import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const signature = request.headers.get("stripe-signature");

    console.log("🔔 Stripe webhook received");

    if (!signature) {
      console.error("❌ Missing stripe-signature header");
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    try {
      const event = await ctx.runAction(internal.stripe.verifyWebhook, {
        payload: payloadString,
        signature,
      });

      console.log("✅ Webhook verified, event type:", event.type);

      // Handle successful payment and subscription creation
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        console.log("💳 Checkout session completed:", {
          mode: session.mode,
          email: session.customer_email || session.customer_details?.email,
          customerId: session.customer,
        });

        if (session.mode === "payment" || session.mode === "subscription") {
          const email = session.customer_email || session.customer_details?.email;
          
          console.log("⏳ Upgrading user to Pro:", email);
          
          const { success } = await ctx.runMutation(internal.users.upgradeToPro, {
            email,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription || session.id,
          });

          if (success) {
            console.log("✨ User successfully upgraded to Pro:", email);
          } else {
            console.error("❌ Failed to upgrade user:", email);
          }
        }
      }

      // Handle subscription updates
      if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as any;
        console.log("🔄 Subscription updated:", subscription.id);
      }

      // Handle subscription deletions (cancellations)
      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as any;
        console.log("🗑️ Subscription deleted:", subscription.id);
      }

      return new Response("Webhook processed successfully", { status: 200 });
    } catch (error) {
      console.error("❌ Webhook error:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }),
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;
    if (eventType === "user.created") {
      // save the user to convex db
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          userId: id,
          email,
          name,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
