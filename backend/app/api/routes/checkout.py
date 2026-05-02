from typing import Any, Optional

import stripe
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter(prefix="/api/checkout", tags=["checkout"])


class CheckoutItem(BaseModel):
    price: Optional[str] = None
    price_data: Optional[dict[str, Any]] = None
    quantity: Optional[int] = 1
    size: Optional[str] = None
    title: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    unit_amount: Optional[float] = None
    productId: Optional[str] = None
    stripeProductId: Optional[str] = None


class CheckoutSessionRequest(BaseModel):
    items: list[CheckoutItem]
    successUrl: str
    cancelUrl: str


def _build_line_item(item: CheckoutItem) -> dict[str, Any]:
    quantity = item.quantity or 1

    if item.price and isinstance(item.price, str) and item.price.startswith("price_"):
        return {"price": item.price, "quantity": quantity}

    if item.price_data:
        return {"price_data": item.price_data, "quantity": quantity}

    raw_amount = item.unit_amount if item.unit_amount is not None else 0
    return {
        "price_data": {
            "currency": "usd",
            "product_data": {
                "name": item.title or item.name,
                "description": item.description,
                "images": [item.image] if item.image else [],
            },
            "unit_amount": round(raw_amount * 100),
        },
        "quantity": quantity,
    }


def _build_metadata(items: list[CheckoutItem]) -> dict[str, str]:
    metadata: dict[str, str] = {}
    for index, item in enumerate(items):
        if item.size:
            metadata[f"item_{index}_size"] = item.size
            metadata[f"item_{index}_product_id"] = (
                item.stripeProductId or item.productId or ""
            )
            metadata[f"item_{index}_quantity"] = str(item.quantity or 1)
    return metadata


@router.post("/session")
def create_checkout_session(payload: CheckoutSessionRequest):
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Stripe checkout is not configured. Set STRIPE_SECRET_KEY.",
        )

    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid items",
        )

    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[_build_line_item(i) for i in payload.items],
            mode="payment",
            success_url=payload.successUrl,
            cancel_url=payload.cancelUrl,
            shipping_address_collection={"allowed_countries": ["US", "CA"]},
            billing_address_collection="required",
            metadata=_build_metadata(payload.items),
        )
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e.user_message or e),
        )

    return {"url": session.url}
