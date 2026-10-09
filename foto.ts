import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const salvaFoto = mutation({
  args: {
    storageId: v.id("_storage"),
    autore: v.string(),
    didascalia: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.autore.trim()) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "Il nome è obbligatorio" });
    }
    await ctx.db.insert("foto", {
      storageId: args.storageId,
      autore: args.autore.trim(),
      didascalia: args.didascalia?.trim() || undefined,
    });
  },
});

export const listaFoto = query({
  args: {},
  handler: async (ctx) => {
    const fotos = await ctx.db.query("foto").order("desc").take(100);
    return await Promise.all(
      fotos.map(async (f) => ({
        ...f,
        url: await ctx.storage.getUrl(f.storageId),
      }))
    );
  },
});
