import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { ConvexError } from "convex/values";
import { isProgrammerPassword } from "./programmerSpace.ts";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Generate an upload URL — only for signed-in users publishing a listing
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: "Devi effettuare il login per pubblicare un annuncio", code: "UNAUTHENTICATED" });
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Create a new listing ("annuncio") — only signed-in users can publish
export const create = mutation({
  args: {
    titolo: v.string(),
    descrizione: v.string(),
    prezzo: v.optional(v.string()),
    contatto: v.string(),
    storageId: v.optional(v.id("_storage")),
    contentType: v.optional(v.string()),
    ownerKey: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: "Devi effettuare il login per pubblicare un annuncio", code: "UNAUTHENTICATED" });
    }
    const titolo = args.titolo.trim();
    const descrizione = args.descrizione.trim();
    const contatto = args.contatto.trim();
    if (!titolo || !descrizione || !contatto) {
      throw new ConvexError({ message: "Compila tutti i campi obbligatori", code: "BAD_REQUEST" });
    }

    const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

    const annuncioId = await ctx.db.insert("annunci", {
      titolo: titolo.slice(0, 100),
      descrizione: descrizione.slice(0, 1000),
      prezzo: args.prezzo?.trim().slice(0, 40) || undefined,
      contatto: contatto.slice(0, 100),
      storageId: args.storageId,
      contentType: args.contentType,
      ownerKey: args.ownerKey,
      expiresAt,
    });

    await ctx.scheduler.runAfter(THIRTY_DAYS_MS, internal.annunci.deleteExpiredAnnuncio, { annuncioId });
  },
});

// Remove a listing — either the device that created it, or the Programmer Space
// password (which can remove any listing), can remove it
export const remove = mutation({
  args: {
    annuncioId: v.id("annunci"),
    ownerKey: v.string(),
    programmerPassword: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const annuncio = await ctx.db.get(args.annuncioId);
    if (!annuncio) return;
    const isOwner = annuncio.ownerKey === args.ownerKey;
    const isProgrammer = isProgrammerPassword(args.programmerPassword);
    if (!isOwner && !isProgrammer) {
      throw new ConvexError({ message: "Non puoi eliminare questo annuncio", code: "FORBIDDEN" });
    }
    if (annuncio.storageId) {
      await ctx.storage.delete(annuncio.storageId);
    }
    await ctx.db.delete(args.annuncioId);
  },
});

// Internal: delete a single expired listing (called by scheduler)
export const deleteExpiredAnnuncio = internalMutation({
  args: { annuncioId: v.id("annunci") },
  handler: async (ctx, args): Promise<void> => {
    const annuncio = await ctx.db.get(args.annuncioId);
    if (!annuncio) return;
    if (annuncio.storageId) {
      await ctx.storage.delete(annuncio.storageId);
    }
    await ctx.db.delete(args.annuncioId);
  },
});

// List all active listings (paginated, most recent first)
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const results = await ctx.db
      .query("annunci")
      .withIndex("by_expires", (q) => q.gt("expiresAt", now))
      .order("desc")
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      results.page.map(async (item) => ({
        ...item,
        url: item.storageId ? await ctx.storage.getUrl(item.storageId) : null,
      }))
    );

    return { ...results, page };
  },
});
