// Netlify Function to fetch products from Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Local product images fallback (when Stripe doesn't have images)
const localProductImages = {
  'prod_TgsPf8wZHkrZsZ': {
    images: [
      "/img/products/balm-cursive-1-duo.png",
      "/img/products/balm-cursive.png",
      "/img/products/balm-cursive-1-longhair.png",
      "/img/products/balm-cursive-1-cream.png",
      "/img/products/balm-cursive-1-white-chains.png",
      "/img/products/balm-cursive-1-jeans.png",
    ],
    sizeChart: {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      measurements: {
        S: {
          bodyLength: "27 1/2",
          chestWidth: "21 1/2",
          sleeveLength: "34",
        },
        M: {
          bodyLength: "28 1/2",
          chestWidth: "23",
          sleeveLength: "35",
        },
        L: {
          bodyLength: "29 1/2",
          chestWidth: "24 1/2",
          sleeveLength: "36",
        },
        XL: {
          bodyLength: "30 1/2",
          chestWidth: "26",
          sleeveLength: "37",
        },
        "2XL": {
          bodyLength: "31",
          chestWidth: "27 1/2",
          sleeveLength: "38",
        },
        "3XL": {
          bodyLength: "31 1/2",
          chestWidth: "29",
          sleeveLength: "38 3/4",
        },
      },
    }
  }
};

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

      // Get local product data if available
      const localData = localProductImages[product.id] || {};
      
      // Use Stripe images if available, otherwise fall back to local images
      const productImages = product.images && product.images.length > 0 
        ? product.images 
        : (localData.images || []);
      
      const mainImage = productImages[0] || '/img/products/placeholder-product.svg';

      return {
        id: product.id,
        stripeProductId: product.id,
        stripePriceId: price?.id || null,
        title: product.name,
        price: priceAmount,
        description: product.description || '',
        image: mainImage,
        images: productImages,
        // Extract metadata for custom fields
        mainCategory: product.metadata?.category || 'art',
        sizes: sizes,
        colors: product.metadata?.colors ? product.metadata.colors.split(',') : [],
        details: product.metadata?.details || '',
        // Include inventory tracking
        inventory: Object.keys(inventory).length > 0 ? inventory : undefined,
        // Include size chart from local data if available
        sizeChart: localData.sizeChart,
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

