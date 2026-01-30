# Pre-Deployment Checklist

Use this checklist before deploying to production:

## ✅ Code Preparation
- [x] Project builds successfully (`npm run build`)
- [x] All TypeScript errors resolved
- [x] No console errors in development
- [x] `.gitignore` configured properly
- [x] Environment variables template created

## ✅ Convex Setup
- [ ] Production Convex deployment created (`npx convex deploy`)
- [ ] Production environment variables added to Convex:
  - [ ] GEMINI_API_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] STRIPE_PRICE_ID
- [ ] Production Convex URL obtained

## ✅ Clerk Setup (Production)
- [ ] Production Clerk application created
- [ ] JWT Template "convex" created with audience "convex"
- [ ] Production keys obtained:
  - [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_live_...)
  - [ ] CLERK_SECRET_KEY (sk_live_...)
- [ ] Webhook configured (will update URL after Vercel deployment)

## ✅ Stripe Setup (Production)
- [ ] Switched to Production mode in Stripe Dashboard
- [ ] Production keys obtained:
  - [ ] STRIPE_SECRET_KEY (sk_live_...)
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...)
- [ ] Pro subscription product and price created
- [ ] STRIPE_PRICE_ID obtained (price_...)
- [ ] Webhook configured to Convex URL
- [ ] Webhook secret obtained

## ✅ Google AI (Gemini)
- [ ] Gemini API key obtained from Google AI Studio
- [ ] API key tested and working
- [ ] Added to Convex production environment

## ✅ GitHub Repository
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] .env.local NOT committed
- [ ] README.md updated

## ✅ Vercel Deployment
- [ ] Vercel account created/logged in
- [ ] GitHub repository connected
- [ ] Build settings configured:
  - [ ] Framework: Next.js
  - [ ] Build Command: `npm run build`
  - [ ] Install Command: `npm install --legacy-peer-deps`
- [ ] All environment variables added to Vercel
- [ ] Deployment successful

## ✅ Post-Deployment
- [ ] Clerk webhook URL updated with Vercel domain
- [ ] Test authentication (sign up/sign in)
- [ ] Test code execution
- [ ] Test Pro upgrade payment flow
- [ ] Test AI assistant as Pro user
- [ ] Test code sharing
- [ ] Test comments system

## Notes

Record important URLs here:

**Vercel Deployment URL:** _______________________________________________

**Convex Production URL:** _______________________________________________

**Deployment Date:** _______________________________________________

**Issues Encountered:** 
_______________________________________________
_______________________________________________
_______________________________________________
