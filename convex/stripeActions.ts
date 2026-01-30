"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

export const createCheckoutSession = action({
  args: {
    email: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured in Convex Dashboard");
    }
    
    if (!process.env.STRIPE_PRICE_ID) {
      throw new Error("STRIPE_PRICE_ID is not configured in Convex Dashboard");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });

    try {
      console.log("Creating checkout session for:", args.email);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // Use "subscription" for recurring payments
        customer_email: args.email,
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
        metadata: {
          userId: args.userId,
          email: args.email,
        },
      });

      console.log("Checkout session created:", session.id);
      return { sessionId: session.id, url: session.url };
    } catch (error: any) {
      console.error("Stripe error:", error.message);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  },
});

export const verifyPaymentAndUpgrade = action({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });

    try {
      console.log("🔍 Verifying payment for session:", args.sessionId);
      
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(args.sessionId);

      console.log("📋 Session status:", session.payment_status);
      console.log("📧 Customer email:", session.customer_email || session.customer_details?.email);

      // Check if payment was successful
      if (session.payment_status === "paid") {
        const email = session.customer_email || session.customer_details?.email;
        const userId = session.metadata?.userId;
        
        if (!email && !userId) {
          throw new Error("No email or userId found in session");
        }

        console.log("✅ Payment confirmed!");
        console.log("📧 Email:", email);
        console.log("🆔 UserId:", userId);

        // Upgrade user to Pro using userId (more reliable than email)
        const result = await ctx.runMutation(internal.users.upgradeToProByUserId, {
          userId: userId!,
          email: email || "no-email",
          stripeCustomerId: (session.customer as string) || "none",
          stripeSubscriptionId: session.id,
        });

        console.log("🎉 User upgraded successfully!");
        return { success: true, isPaid: true };
      }

      console.log("⏳ Payment not yet completed");
      return { success: false, isPaid: false };
    } catch (error: any) {
      console.error("❌ Error verifying payment:", error.message);
      throw new Error(`Failed to verify payment: ${error.message}`);
    }
  },
});
