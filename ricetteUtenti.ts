import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ricette_utenti").withIndex("by_createdAt").order("desc").take(50);
  },
});

export const create = mutation({
  args: { autore: v.string(), titolo: v.string(), testo: v.string() },
  handler: async (ctx, args) => {
    const autore = args.autore.trim().slice(0, 40);
    const titolo = args.titolo.trim().slice(0, 80);
    const testo = args.testo.trim().slice(0, 5000);
    if (!autore || !titolo || testo.length < 10) {
      throw new ConvexError({ message: "Dati non validi", code: "BAD_REQUEST" });
    }
    await ctx.db.insert("ricette_utenti", {
      autore,
      titolo,
      testo,
      createdAt: new Date().toISOString(),
    });
    return null;
  },
});
