# Quick Start Deployment Guide

## 🚀 Deploy in 30 Minutes

Follow these steps to deploy your Code Craft editor to production:

---

## Step 1: Prepare Convex (5 minutes)

### Create Production Deployment
```bash
npx convex deploy
```
✅ Save the production URL (e.g., `https://abc-123.convex.cloud`)

### Add Environment Variables
```bash
npx convex env set GEMINI_API_KEY your_gemini_key --prod
npx convex env set STRIPE_SECRET_KEY your_stripe_secret --prod
npx convex env set STRIPE_WEBHOOK_SECRET your_stripe_webhook_secret --prod
npx convex env set STRIPE_PRICE_ID your_price_id --prod
```

---

## Step 2: Clerk Production Setup (5 minutes)

1. Go to https://dashboard.clerk.com/
2. Create production app or switch to production environment
3. **CRITICAL**: Create JWT Template:
   - JWT Templates → New Template
   - Name: `convex`
   - Audience: `convex`
   - Save
4. Copy these keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (pk_live_...)
   - `CLERK_SECRET_KEY` (sk_live_...)

---

## Step 3: Stripe Production Setup (5 minutes)

1. Go to https://dashboard.stripe.com/
2. **Toggle to "Production" mode** (top right)
3. Create Pro subscription:
   - Products → Add Product
   - Set price (e.g., $10/month)
   - Copy `STRIPE_PRICE_ID` (price_...)
4. Get API keys:
   - Developers → API Keys
   - Copy Secret Key (sk_live_...)
   - Copy Publishable Key (pk_live_...)
5. Set up webhook:
   - Webhooks → Add Endpoint
   - URL: `https://[YOUR_CONVEX_URL].convex.site/stripe-webhook`
   - Events: `checkout.session.completed`
   - Copy webhook secret (whsec_...)

---

## Step 4: Push to GitHub (3 minutes)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/code-craft.git
git branch -M main
git push -u origin main
```

---

## Step 5: Deploy to Vercel (10 minutes)

### 5.1 Connect Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Next.js ✅

### 5.2 Configure Build
- Framework: **Next.js** (auto-detected)
- Install Command: `npm install --legacy-peer-deps`
- Build Command: `npm run build` (default)

### 5.3 Add Environment Variables

Copy-paste these into Vercel environment variables section:

**Clerk:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_... (will add after deployment)
```

**Stripe:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID=price_...
```

**Gemini:**
```
GEMINI_API_KEY=AIzaSy...
```

**Convex:**
```
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud
```

### 5.4 Deploy
Click **"Deploy"** and wait 2-3 minutes ⏱️

---

## Step 6: Update Webhooks (2 minutes)

### Clerk Webhook
1. Back to Clerk Dashboard
2. Webhooks → Add Endpoint
3. URL: `https://your-app.vercel.app/api/clerk-webhook`
4. Events: `user.created`, `user.updated`
5. Copy webhook secret
6. Add `CLERK_WEBHOOK_SECRET` to Vercel env vars
7. Redeploy: Vercel Dashboard → Deployments → ... → Redeploy

---

## Step 7: Test Everything (5 minutes)

Visit your live site and test:

✅ Sign up / Sign in
✅ Write and run code
✅ Try different languages
✅ Upgrade to Pro (use Stripe test card: 4242 4242 4242 4242)
✅ Test AI Assistant (Pro feature)
✅ Share a code snippet
✅ Add a comment

---

## 🎉 You're Live!

Your Code Craft editor is now deployed at: **https://your-app.vercel.app**

### Next Steps:
- Add custom domain in Vercel settings
- Set up analytics
- Monitor Convex dashboard for usage
- Check Stripe dashboard for payments

---

## ⚠️ Common Issues

**Build fails:**
- Ensure `--legacy-peer-deps` in install command
- Check all env vars are set

**Auth not working:**
- Verify JWT template exists in Clerk
- Check webhook URL is correct

**Payments fail:**
- Ensure Stripe is in PRODUCTION mode
- Verify price ID is from production

**AI not working:**
- Check GEMINI_API_KEY in Convex production env
- Run: `npx convex env list --prod` to verify

---

## 📞 Need Help?

Check the full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
