import logging
import re
from typing import Any

import stripe
from fastapi import APIRouter, HTTPException, Header, Request, status

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/stripe", tags=["stripe"])


_ITEM_KEY_RE = re.compile(r"^item_(\d+)_(.+)$")


def _decrement_inventory(product_id: str, size: str, quantity: int) -> int:
    product = stripe.Product.retrieve(product_id)
    metadata = dict(product.get("metadata") or {})
    stock_key = f"stock_{size}"

    try:
        current_stock = int(metadata.get(stock_key) or 0)
    except (TypeError, ValueError):
        current_stock = 0

    new_stock = max(0, current_stock - quantity)
    metadata[stock_key] = str(new_stock)
    stripe.Product.modify(product_id, metadata=metadata)

    if new_stock == 0:
        logger.warning("OUT OF STOCK: %s - Size %s", product.get("name"), size)
    elif new_stock <= 5:
        logger.warning(
            "LOW STOCK: %s - Size %s - %d remaining", product.get("name"), size, new_stock
        )

    return new_stock


def _handle_checkout_completed(session: Any) -> None:
    metadata = session.get("metadata") or {}
    items: dict[int, dict[str, str]] = {}

    for key, value in metadata.items():
        m = _ITEM_KEY_RE.match(key)
        if not m:
            continue
        index = int(m.group(1))
        field = m.group(2)
        items.setdefault(index, {})[field] = value

    if not items:
        logger.warning(
            "No size information found in checkout metadata for session %s", session.get("id")
        )
        return

    for item in items.values():
        if not item.get("size") or not item.get("product_id") or not item.get("quantity"):
            logger.warning("Incomplete item data in metadata, skipping: %s", item)
            continue
        try:
            quantity = int(item["quantity"])
        except (TypeError, ValueError):
            continue
        _decrement_inventory(item["product_id"], item["size"], quantity)


@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    if not settings.STRIPE_SECRET_KEY or not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Stripe webhook not configured",
        )

    stripe.api_key = settings.STRIPE_SECRET_KEY

    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook Error: {e}",
        )

    event_type = event["type"]
    if event_type == "checkout.session.completed":
        _handle_checkout_completed(event["data"]["object"])
    elif event_type == "payment_intent.succeeded":
        logger.info("Payment succeeded: %s", event["data"]["object"]["id"])
    else:
        logger.info("Unhandled event type: %s", event_type)

    return {"received": True}
