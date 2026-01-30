# Deployment Guide - Code Craft

This guide will walk you through deploying Code Craft to production on Vercel.

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Vercel account (free)
- ✅ Production accounts for:
  - Clerk (authentication)
  - Convex (database/backend)
  - Stripe (payments)
  - Google AI Studio (Gemini API)

## Step 1: Prepare Convex for Production

### 1.1 Create Production Deployment

```bash
npx convex deploy
```

This creates a production Convex deployment. Note the deployment URL (e.g., `https://your-prod-deployment.convex.cloud`)

### 1.2 Add Production Environment Variables to Convex

```bash
npx convex env set GEMINI_API_KEY your_production_gemini_key --prod
npx convex env set STRIPE_SECRET_KEY your_production_stripe_key --prod
npx convex env set STRIPE_WEBHOOK_SECRET your_production_webhook_secret --prod
npx convex env set STRIPE_PRICE_ID your_production_price_id --prod
```

## Step 2: Set Up Clerk Production Environment

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or use existing production app
3. Get your production keys:
   - Publishable Key
   - Secret Key
4. Configure JWT Template (required for Convex):
   - Go to JWT Templates → Create Template
   - Name it "convex"
   - Set Audience to "convex"
   - Save the template
5. Set up webhook:
   - Go to Webhooks → Add Endpoint
   - URL: `https://your-vercel-domain.vercel.app/api/clerk-webhook`
   - Subscribe to: `user.created`, `user.updated`
   - Save the webhook secret

## Step 3: Set Up Stripe Production Environment

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to Production mode (toggle in sidebar)
3. Get your production keys:
   - Publishable Key (starts with `pk_live_`)
   - Secret Key (starts with `sk_live_`)
4. Create a product and price for Pro subscription
5. Set up webhook:
   - Go to Developers → Webhooks → Add endpoint
   - URL: `https://your-convex-url.convex.site/stripe-webhook`
   - Subscribe to: `checkout.session.completed`
   - Save the webhook secret

## Step 4: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/code-craft.git
git push -u origin main
```

## Step 5: Deploy to Vercel

### 5.1 Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will detect Next.js automatically

### 5.2 Configure Build Settings

In the build settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Output Directory**: `.next` (default)

### 5.3 Add Environment Variables

Add the following environment variables in Vercel:

**Clerk:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

**Stripe:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID=price_...
```

**Gemini AI:**
```
GEMINI_API_KEY=AIzaSy...
```

**Convex:**
```
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

### 5.4 Deploy

Click "Deploy" and wait for the build to complete.

## Step 6: Update Webhook URLs

After deployment, update webhook URLs with your production domain:

**Clerk Webhook:**
- Update to: `https://your-domain.vercel.app/api/clerk-webhook`

**Stripe Webhook:**
- Already points to Convex URL (no change needed)

## Step 7: Test Production Deployment

1. Visit your deployed site
2. Test authentication (sign up/sign in)
3. Test code execution
4. Test Pro upgrade flow
5. Test AI assistant (as Pro user)
6. Test code sharing and comments

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `--legacy-peer-deps` is in install command

### Authentication Issues
- Verify Clerk JWT template is configured
- Check that webhook URLs are correct
- Ensure production keys are used (not test keys)

### Payment Issues
- Verify Stripe is in production mode
- Check webhook secret matches
- Ensure price ID is from production environment

### AI Assistant Not Working
- Verify Gemini API key is set in Convex
- Check Convex production deployment has the key
- Test API key with Google AI Studio

## Post-Deployment

### Monitor Your App
- Set up Vercel Analytics
- Monitor Convex dashboard for errors
- Check Clerk dashboard for authentication metrics
- Review Stripe dashboard for payment data

### Domain Configuration
1. Go to Vercel project settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update webhook URLs to use custom domain

## Support

For issues or questions:
- Check Vercel deployment logs
- Review Convex function logs
- Check browser console for client errors
- Open an issue on GitHub

## Security Notes

- Never commit `.env.local` or production keys to Git
- Use different keys for development and production
- Regularly rotate API keys
- Monitor webhook security
- Keep dependencies updated

---

**Congratulations! Your Code Craft editor is now live! 🎉**
