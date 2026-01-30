"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import Stripe from "stripe";

export const verifyWebhook = internalAction({
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-12-15.clover",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      const event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );

      return event;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  },
});
