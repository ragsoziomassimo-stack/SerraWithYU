import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

const MAX_TEXT = 500;
const MAX_PHOTOS = 2;

// Le segnalazioni sono anonime: il nome non viene mai restituito.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("youalert").withIndex("by_createdAt").order("desc").take(50);
    return await Promise.all(
      rows.map(async (r) => ({
        _id: r._id,
        testo: r.testo,
        createdAt: r.createdAt,
        photos: await Promise.all((r.storageIds ?? []).map((id) => ctx.storage.getUrl(id))),
      })),
    );
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Solo l'ultimo avviso: usato dal menu per far lampeggiare la sirena
export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("youalert").withIndex("by_createdAt").order("desc").first();
  },
});

export const create = mutation({
  args: { testo: v.string(), storageIds: v.optional(v.array(v.id("_storage"))) },
  handler: async (ctx, args) => {
    const testo = args.testo.trim().slice(0, MAX_TEXT);
    const storageIds = (args.storageIds ?? []).slice(0, MAX_PHOTOS);
    if (testo.length < 3) {
      throw new ConvexError({ message: "Testo troppo corto", code: "BAD_REQUEST" });
    }
    await ctx.db.insert("youalert", { testo, storageIds, createdAt: new Date().toISOString() });
    // Notifica a tutti gli iscritti
    await ctx.scheduler.runAfter(0, internal.pushNotifications.sendNotification, {
      title: "YouAlert - Serracapriola",
      body: testo.length > 120 ? `${testo.slice(0, 117)}...` : testo,
      urgency: "high",
    });
    return null;
  },
});
