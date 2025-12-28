// Netlify Function for creating Stripe Checkout sessions
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 503,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error:
          "Stripe checkout is not yet configured. Payment processing is currently unavailable.",
        message:
          "Please set STRIPE_SECRET_KEY environment variable in Netlify dashboard.",
      }),
    };
  }

  try {
    const { items, successUrl, cancelUrl } = JSON.parse(event.body);

    // Validate the request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Invalid items" }),
      };
    }

    // Transform items to Stripe format
    // Items should be either:
    // 1. { price: 'price_xxx', quantity: 1 } - if using Stripe price IDs
    // 2. { price_data: {...}, quantity: 1 } - if creating prices on the fly (already formatted by frontend)
    const lineItems = items.map((item) => {
      // If item has a Stripe price ID, use it
      if (
        item.price &&
        typeof item.price === "string" &&
        item.price.startsWith("price_")
      ) {
        return {
          price: item.price,
          quantity: item.quantity || 1,
        };
      }

      // If item already has price_data (formatted by frontend), use it directly
      if (item.price_data) {
        return {
          price_data: item.price_data,
          quantity: item.quantity || 1,
        };
      }

      // Otherwise, create price data on the fly (fallback for legacy items)
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title || item.name,
            description: item.description,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round((item.unit_amount || item.price || 0) * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"], // Add more countries as needed
      },
      billing_address_collection: "required",
      // Enable automatic tax calculation (optional)
      // automatic_tax: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error.message || "Failed to create checkout session",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    };
  }
};
