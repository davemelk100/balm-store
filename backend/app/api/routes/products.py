from typing import Any

import stripe
from fastapi import APIRouter, Response

from app.core.config import settings

router = APIRouter(prefix="/api/products", tags=["products"])


LOCAL_PRODUCT_IMAGES: dict[str, dict[str, Any]] = {
    "prod_TgsPf8wZHkrZsZ": {
        "images": [
            "/img/products/balm-cursive.png",
        ],
        "sizeChart": {
            "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
            "measurements": {
                "S": {"bodyLength": "27 1/2", "chestWidth": "21 1/2", "sleeveLength": "34"},
                "M": {"bodyLength": "28 1/2", "chestWidth": "23", "sleeveLength": "35"},
                "L": {"bodyLength": "29 1/2", "chestWidth": "24 1/2", "sleeveLength": "36"},
                "XL": {"bodyLength": "30 1/2", "chestWidth": "26", "sleeveLength": "37"},
                "2XL": {"bodyLength": "31", "chestWidth": "27 1/2", "sleeveLength": "38"},
                "3XL": {"bodyLength": "31 1/2", "chestWidth": "29", "sleeveLength": "38 3/4"},
            },
        },
    }
}


def _format_product(product: Any) -> dict[str, Any]:
    metadata = product.get("metadata") or {}
    price = product.get("default_price")
    price_amount = (price.get("unit_amount") / 100) if price and price.get("unit_amount") is not None else 0

    sizes_raw = metadata.get("sizes", "")
    sizes = [s.strip() for s in sizes_raw.split(",")] if sizes_raw else []

    inventory: dict[str, int] = {}
    for size in sizes:
        stock_key = f"stock_{size}"
        if metadata.get(stock_key) is not None:
            try:
                inventory[size] = int(metadata[stock_key])
            except (TypeError, ValueError):
                inventory[size] = 0

    local_data = LOCAL_PRODUCT_IMAGES.get(product["id"], {})
    local_images = local_data.get("images") or []
    stripe_images = product.get("images") or []
    # Prefer local override so we control the canonical product imagery; fall back to Stripe.
    product_images = local_images if local_images else stripe_images
    main_image = product_images[0] if product_images else "/img/products/placeholder-product.svg"

    colors_raw = metadata.get("colors", "")

    return {
        "id": product["id"],
        "stripeProductId": product["id"],
        "stripePriceId": price.get("id") if price else None,
        "title": product.get("name"),
        "price": price_amount,
        "description": product.get("description") or "",
        "image": main_image,
        "images": product_images,
        "mainCategory": metadata.get("category", "art"),
        "sizes": sizes,
        "colors": [c.strip() for c in colors_raw.split(",")] if colors_raw else [],
        "details": metadata.get("details", ""),
        "inventory": inventory if inventory else None,
        "sizeChart": local_data.get("sizeChart"),
        "metadata": metadata,
    }


@router.get("")
def list_products(response: Response):
    if not settings.STRIPE_SECRET_KEY:
        response.status_code = 503
        return {"error": "Stripe is not configured", "products": []}

    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        products = stripe.Product.list(
            active=True,
            expand=["data.default_price"],
            limit=100,
        )
    except stripe.error.StripeError as e:
        response.status_code = 500
        return {"error": str(e.user_message or e), "products": []}

    response.headers["Cache-Control"] = "public, max-age=300"
    return {"products": [_format_product(p) for p in products.data]}
