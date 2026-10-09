"use node";

import { Hercules } from "@usehercules/sdk";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

const hercules = new Hercules({ apiKey: process.env.HERCULES_API_KEY!, apiVersion: "2025-12-09" });

export const getVapidPublicKey = action({
  args: {},
  handler: async () => {
    const { vapidPublicKey } = await hercules.pushNotifications.enable();
    return { vapidPublicKey };
  },
});

export const subscribe = action({
  args: { subscription: v.string() },
  handler: async (ctx, args): Promise<{ secret: string }> => {
    const visitorId = crypto.randomUUID();
    const sub = JSON.parse(args.subscription);
    const { secret } = await hercules.pushNotifications.subscribe({
      visitorId,
      subscription: {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        expirationTime: sub.expirationTime,
      },
    });
    await ctx.runMutation(internal.pushIdentities.storeIdentity, { secret, visitorId });
    return { secret };
  },
});

export const unsubscribe = action({
  args: { secret: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    await hercules.pushNotifications.unsubscribe({ secret: args.secret });
    await ctx.runMutation(internal.pushIdentities.deleteIdentity, { secret: args.secret });
    return { success: true };
  },
});

export const sendNotification = internalAction({
  args: {
    title: v.string(),
    body: v.optional(v.string()),
    urgency: v.optional(
      v.union(v.literal("very-low"), v.literal("low"), v.literal("normal"), v.literal("high")),
    ),
  },
  handler: async (_, args) => {
    await hercules.pushNotifications.send({
      title: args.title,
      body: args.body,
      urgency: args.urgency,
    });
    return null;
  },
});
