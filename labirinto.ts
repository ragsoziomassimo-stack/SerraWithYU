import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

const MIN_TIME_MS = 20 * 1000; // 10 labirinti in meno di 20 secondi non sono credibili
const MAX_TIME_MS = 90 * 60 * 1000;

export const top = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("labirinto_serie").withIndex("by_tempo").order("asc").take(20);
  },
});

export const add = mutation({
  args: { nickname: v.string(), tempoMs: v.number() },
  handler: async (ctx, args) => {
    const nickname = args.nickname.trim().slice(0, 20);
    const valid =
      nickname.length > 0 &&
      Number.isFinite(args.tempoMs) &&
      args.tempoMs >= MIN_TIME_MS &&
      args.tempoMs <= MAX_TIME_MS;
    if (!valid) {
      throw new ConvexError({ message: "Dati non validi", code: "BAD_REQUEST" });
    }
    await ctx.db.insert("labirinto_serie", { nickname, tempoMs: Math.round(args.tempoMs) });
    return null;
  },
});
