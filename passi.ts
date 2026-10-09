import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

const MAX_SPEED_MS = 8; // oltre ~29 km/h a piedi non è credibile
const MAX_DISTANCE_M = 100000;

export const top = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("passi_classifica")
      .withIndex("by_distanza")
      .order("desc")
      .take(20);
  },
});

export const add = mutation({
  args: {
    nickname: v.string(),
    distanzaM: v.number(),
    passi: v.number(),
    durataSec: v.number(),
    livello: v.union(
      v.literal("esordiente"),
      v.literal("passeggiatore"),
      v.literal("sportivo"),
    ),
  },
  handler: async (ctx, args) => {
    const nickname = args.nickname.trim().slice(0, 20);
    const valid =
      nickname.length > 0 &&
      Number.isFinite(args.distanzaM) &&
      Number.isFinite(args.durataSec) &&
      args.distanzaM >= 50 &&
      args.distanzaM <= MAX_DISTANCE_M &&
      args.durataSec >= 30 &&
      args.passi >= 0 &&
      args.distanzaM / args.durataSec <= MAX_SPEED_MS;
    if (!valid) {
      throw new ConvexError({ message: "Dati non validi", code: "BAD_REQUEST" });
    }
    await ctx.db.insert("passi_classifica", {
      nickname,
      distanzaM: Math.round(args.distanzaM),
      passi: Math.round(args.passi),
      durataSec: Math.round(args.durataSec),
      livello: args.livello,
    });
    return null;
  },
});
