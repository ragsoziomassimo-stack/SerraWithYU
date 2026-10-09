import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Elenco dei vincitori del Gioco del Paese, dal più recente
export const listWinners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quiz_winners").order("desc").take(200);
  },
});

// Registra un nuovo vincitore (30/30 risposte corrette)
export const addWinner = mutation({
  args: {
    nickname: v.string(),
  },
  handler: async (ctx, args) => {
    const nickname = args.nickname.trim().slice(0, 30);
    if (!nickname) return null;
    await ctx.db.insert("quiz_winners", {
      nickname,
      completedAt: new Date().toISOString(),
    });
    return null;
  },
});
