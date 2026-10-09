import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const storeIdentity = internalMutation({
  args: { secret: v.string(), visitorId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("pushIdentities", { secret: args.secret, visitorId: args.visitorId });
  },
});

export const deleteIdentity = internalMutation({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.db
      .query("pushIdentities")
      .withIndex("by_secret", (q) => q.eq("secret", args.secret))
      .first();
    if (identity) await ctx.db.delete(identity._id);
  },
});
