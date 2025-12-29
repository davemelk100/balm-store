// Netlify Function to fetch products from Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Stripe is not configured',
        products: [] // Return empty array as fallback
      })
    };
  }

  try {
    // Fetch products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    });

    // Transform Stripe products to match your app's format
    const formattedProducts = products.data.map(product => {
      const price = product.default_price;
      const priceAmount = price ? (price.unit_amount / 100) : 0;

      // Parse inventory from metadata
      const sizes = product.metadata?.sizes ? product.metadata.sizes.split(',') : [];
      const inventory = {};
      sizes.forEach(size => {
        const stockKey = `stock_${size.trim()}`;
        if (product.metadata?.[stockKey]) {
          inventory[size.trim()] = parseInt(product.metadata[stockKey], 10) || 0;
        }
      });

      return {
        id: product.id,
        stripeProductId: product.id,
        stripePriceId: price?.id || null,
        title: product.name,
        price: priceAmount,
        description: product.description || '',
        image: product.images?.[0] || '/img/products/placeholder-product.svg',
        images: product.images || [],
        // Extract metadata for custom fields
        mainCategory: product.metadata?.category || 'art',
        sizes: sizes,
        colors: product.metadata?.colors ? product.metadata.colors.split(',') : [],
        details: product.metadata?.details || '',
        // Include inventory tracking
        inventory: Object.keys(inventory).length > 0 ? inventory : undefined,
        // Include full product metadata
        metadata: product.metadata || {},
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify({ products: formattedProducts })
    };
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: error.message || 'Failed to fetch products',
        products: []
      })
    };
  }
};

