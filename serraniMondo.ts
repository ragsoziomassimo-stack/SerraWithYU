import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Momento dell'ultimo azzeramento della mappa (millisecondi)
const MAP_RESET_AT = 1791438943130;

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Reset della mappa: i pallini creati prima di questa data non vengono mostrati
    return await ctx.db
      .query("serrani_mondo")
      .withIndex("by_creation_time", (q) => q.gt("_creationTime", MAP_RESET_AT))
      .order("desc")
      .take(1000);
  },
});

export const add = mutation({
  args: {
    nome: v.string(),
    luogo: v.string(),
    lat: v.number(),
    lon: v.number(),
  },
  handler: async (ctx, args) => {
    const validCoords =
      Number.isFinite(args.lat) &&
      Number.isFinite(args.lon) &&
      Math.abs(args.lat) <= 90 &&
      Math.abs(args.lon) <= 180;
    const luogo = args.luogo.trim().slice(0, 200);
    if (!validCoords || luogo.length === 0) {
      throw new ConvexError({ message: "Luogo non valido", code: "BAD_REQUEST" });
    }
    await ctx.db.insert("serrani_mondo", {
      nome: args.nome.trim().slice(0, 60) || "Anonimo",
      luogo,
      lat: args.lat,
      lon: args.lon,
    });
    return null;
  },
});
