// Netlify Function: Stripe Webhook Handler for Automatic Inventory Sync
// This listens for checkout completions and automatically decrements inventory

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Your webhook signing secret from Stripe Dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let stripeEvent;

  try {
    // Verify webhook signature
    const sig = event.headers["stripe-signature"];
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;

      // Add other event types as needed
      case "payment_intent.succeeded":
        console.log("💰 Payment succeeded:", stripeEvent.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Webhook processing failed" }),
    };
  }
};

/**
 * Handle checkout.session.completed event
 * Automatically decrements inventory based on what was purchased
 */
async function handleCheckoutCompleted(session) {
  console.log("🛒 Checkout completed:", session.id);

  try {
    // Parse metadata to get size information for each item
    // Metadata format: item_0_size, item_0_product_id, item_0_quantity, etc.
    const metadata = session.metadata || {};
    const items = [];

    // Extract items from metadata
    Object.keys(metadata).forEach((key) => {
      const match = key.match(/^item_(\d+)_(.+)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        if (!items[index]) {
          items[index] = {};
        }
        items[index][field] = metadata[key];
      }
    });

    // Process each item
    for (const item of items) {
      if (!item.size || !item.product_id || !item.quantity) {
        console.log("⚠️  Incomplete item data in metadata, skipping:", item);
        continue;
      }

      const productId = item.product_id;
      const size = item.size;
      const quantity = parseInt(item.quantity, 10);

      // Get product name for logging
      let productName = productId;
      try {
        const product = await stripe.products.retrieve(productId);
        productName = product.name;
      } catch (error) {
        console.log("Could not retrieve product name:", error.message);
      }

      // Decrement inventory
      await decrementInventory(productId, size, quantity);

      console.log(
        `✅ Decremented inventory: ${productName} - Size ${size} - Qty ${quantity}`
      );
    }

    // If no items found in metadata, log warning
    if (items.length === 0) {
      console.log(
        "⚠️  No size information found in checkout metadata. Cannot update inventory."
      );
      console.log("Make sure your checkout session includes size metadata.");
    }
  } catch (error) {
    console.error("Error handling checkout completion:", error);
    throw error;
  }
}

/**
 * Decrement inventory in Stripe product metadata
 */
async function decrementInventory(productId, size, quantity) {
  try {
    // Get current product
    const product = await stripe.products.retrieve(productId);

    const stockKey = `stock_${size}`;
    const currentStock = parseInt(product.metadata[stockKey] || "0", 10);
    const newStock = Math.max(0, currentStock - quantity); // Don't go below 0

    // Update the metadata
    await stripe.products.update(productId, {
      metadata: {
        ...product.metadata,
        [stockKey]: newStock.toString(),
      },
    });

    // Log warning if stock is low
    if (newStock === 0) {
      console.log(`⚠️  OUT OF STOCK: ${product.name} - Size ${size}`);
    } else if (newStock <= 5) {
      console.log(
        `⚠️  LOW STOCK: ${product.name} - Size ${size} - ${newStock} remaining`
      );
    }

    return newStock;
  } catch (error) {
    console.error(`Error decrementing inventory for ${productId}:`, error);
    throw error;
  }
}
