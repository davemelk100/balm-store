# Stripe Payment Setup for BALM Store

This guide will help you set up Stripe payments for your BALM Store on Netlify.

## Prerequisites

1. A [Stripe](https://stripe.com/) account (sign up at https://dashboard.stripe.com/register)
2. Your site deployed on Netlify

## Step 1: Get Your Stripe Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click on **Developers** in the left sidebar
3. Click on **API keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

⚠️ **Important:** Use TEST keys for testing, LIVE keys only for production!

## Step 2: Configure Environment Variables in Netlify

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your BALM Store site
3. Go to **Site configuration** → **Environment variables**
4. Add the following variables:

### Required Variables:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### Optional (if you need public key in frontend):

```
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
```

## Step 3: Install Dependencies Locally (Optional)

If you want to test the Netlify function locally:

```bash
cd netlify/functions
npm install
```

## Step 4: Deploy to Netlify

After setting the environment variables, deploy your site:

```bash
# From the project root
git add .
git commit -m "Add Stripe checkout functionality"
git push
```

Netlify will automatically:
1. Install the Stripe dependency
2. Deploy the serverless function
3. Make it available at `/.netlify/functions/create-checkout-session`

## Step 5: Test the Payment Flow

1. Go to your deployed site
2. Add items to cart
3. Click "Proceed to Payment"
4. You should be redirected to Stripe Checkout

### Testing with Test Cards

Use these test card numbers in Stripe's test mode:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires authentication:** 4000 0025 0000 3155

Use any future expiry date, any 3-digit CVC, and any billing ZIP code.

## Troubleshooting

### Error: "Stripe checkout is not yet configured"

**Solution:** Make sure `STRIPE_SECRET_KEY` is set in Netlify's environment variables and redeploy.

### Error: "No such API key"

**Solution:** Check that you copied the entire secret key correctly, including the `sk_test_` or `sk_live_` prefix.

### Function not found (404)

**Solution:** 
1. Ensure `netlify.toml` has the `functions` directory configured
2. Check that the function file is at `netlify/functions/create-checkout-session.js`
3. Redeploy the site

## Local Development with Netlify CLI

To test the function locally:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# From project root
netlify dev
```

This will run your site with functions at `http://localhost:8888`

## Switching to Production

When you're ready to go live:

1. In Stripe Dashboard, get your **live** keys (start with `pk_live_` and `sk_live_`)
2. Update the `STRIPE_SECRET_KEY` environment variable in Netlify with your live secret key
3. Update `VITE_STRIPE_PUBLIC_KEY` (if used) with your live publishable key
4. Redeploy your site

⚠️ **Security Note:** Never commit your secret keys to version control!

## Additional Features

You can extend the checkout session with:

- **Tax calculation:** Add `automatic_tax: { enabled: true }`
- **Discounts:** Add `allow_promotion_codes: true`
- **More shipping countries:** Update `allowed_countries` array
- **Custom metadata:** Add `metadata: { orderId: '123' }`

See [Stripe Checkout documentation](https://stripe.com/docs/api/checkout/sessions/create) for all options.

## Support

For issues specific to:
- **Stripe:** Visit [Stripe Support](https://support.stripe.com/)
- **Netlify Functions:** Visit [Netlify Support](https://www.netlify.com/support/)

