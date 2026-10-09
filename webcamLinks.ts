import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isProgrammerPassword } from "./programmerSpace.ts";

const MAX_TITLE = 80;
const MAX_URL = 500;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("webcam_links").withIndex("by_createdAt").order("desc").take(50);
  },
});

// Tutti possono pubblicare; accettiamo solo indirizzi http/https validi.
export const create = mutation({
  args: { titolo: v.string(), url: v.string() },
  handler: async (ctx, args) => {
    const titolo = args.titolo.trim().slice(0, MAX_TITLE);
    const url = args.url.trim();
    let valid = false;
    try {
      const parsed = new URL(url);
      valid = parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      valid = false;
    }
    if (!titolo || !valid || url.length > MAX_URL) {
      throw new ConvexError({ message: "Titolo o indirizzo non validi", code: "BAD_REQUEST" });
    }
    await ctx.db.insert("webcam_links", { titolo, url, createdAt: new Date().toISOString() });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("webcam_links"), password: v.string() },
  handler: async (ctx, args) => {
    if (!isProgrammerPassword(args.password)) {
      throw new ConvexError({ message: "Password errata", code: "FORBIDDEN" });
    }
    await ctx.db.delete(args.id);
    return null;
  },
});
