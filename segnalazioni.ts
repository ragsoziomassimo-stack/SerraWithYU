import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    return await ctx.db
      .query("segnalazioni")
      .order("desc")
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .take(100);
  },
});

export const create = mutation({
  args: {
    categoria: v.string(),
    nome: v.string(),
    testo: v.string(),
  },
  handler: async (ctx, args) => {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await ctx.db.insert("segnalazioni", {
      categoria: args.categoria,
      nome: args.nome,
      testo: args.testo,
      expiresAt,
    });
  },
});
