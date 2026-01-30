import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
      });
    }
  },
});

export const getUser = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return null;

    return user;
  },
});

export const upgradeToPro = internalMutation({
  args: {
    email: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("🔍 Looking for user with email:", args.email);
    
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      console.error("❌ User not found with email:", args.email);
      
      // List all users to help debug
      const allUsers = await ctx.db.query("users").collect();
      console.log("📋 All users in database:", allUsers.map(u => ({ email: u.email, userId: u.userId })));
      
      throw new Error("User not found");
    }

    console.log("👤 Found user:", { userId: user.userId, email: user.email });
    console.log("⬆️ Upgrading to Pro...");

    await ctx.db.patch(user._id, {
      isPro: true,
      proSince: Date.now(),
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
    });

    console.log("✅ User upgraded successfully!");

    return { success: true };
  },
});

export const upgradeToProByUserId = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("🔍 Looking for user with userId:", args.userId);
    
    let user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      console.log("❌ User not found, creating new user...");
      
      // Create the user if they don't exist
      const userId = await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.email.split("@")[0], // Use email prefix as name
        isPro: false,
      });
      
      user = await ctx.db.get(userId);
      console.log("✅ New user created:", { userId: args.userId, email: args.email });
    }

    if (!user) {
      throw new Error("Failed to create or find user");
    }

    console.log("👤 Found user:", { userId: user.userId, email: user.email, currentProStatus: user.isPro });
    console.log("⬆️ Upgrading to Pro...");

    await ctx.db.patch(user._id, {
      isPro: true,
      proSince: Date.now(),
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
    });

    console.log("✅ User upgraded successfully to Pro!");

    return { success: true };
  },
});
