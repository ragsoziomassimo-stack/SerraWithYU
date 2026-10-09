import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { isProgrammerPassword } from "./programmerSpace.ts";

const MAX_LEN = 3000;

function assertPassword(password: string) {
  if (!isProgrammerPassword(password)) {
    throw new ConvexError({ message: "Password errata", code: "FORBIDDEN" });
  }
}

// Le modifiche sono pubbliche perché chiunque deve vederle nel sito.
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("site_overrides").take(1000);
  },
});

export const set = mutation({
  args: {
    password: v.string(),
    kind: v.union(v.literal("text"), v.literal("hide")),
    lang: v.string(),
    original: v.string(),
    replacement: v.string(),
  },
  handler: async (ctx, args) => {
    assertPassword(args.password);
    if (!args.original || args.original.length > MAX_LEN || args.replacement.length > MAX_LEN) {
      throw new ConvexError({ message: "Testo non valido", code: "BAD_REQUEST" });
    }
    const existing = await ctx.db
      .query("site_overrides")
      .withIndex("by_kind_and_lang_and_original", (q) =>
        q.eq("kind", args.kind).eq("lang", args.lang).eq("original", args.original),
      )
      .first();
    const fields = { kind: args.kind, lang: args.lang, original: args.original, replacement: args.replacement };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("site_overrides", fields);
    }
    return null;
  },
});

// Ripristina l'originale eliminando la modifica.
export const remove = mutation({
  args: { password: v.string(), id: v.id("site_overrides") },
  handler: async (ctx, args) => {
    assertPassword(args.password);
    await ctx.db.delete(args.id);
    return null;
  },
});

// Usata dallo "Spazio del Programmatore" per verificare la password al momento dell'accesso.
export const checkPassword = query({
  args: { password: v.string() },
  handler: async (_ctx, args) => {
    return isProgrammerPassword(args.password);
  },
});
