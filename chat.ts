import { mutation, query, internalMutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { isProgrammerPassword } from "./programmerSpace.ts";
import type { Id } from "./_generated/dataModel.d.ts";

const EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 ore in ms
const PAGE_SIZE = 80;

// Lista messaggi non scaduti (più recenti per ultimi)
export const list = query({
  args: {},
  handler: async (ctx): Promise<Array<{
    _id: Id<"chat_messages">;
    _creationTime: number;
    nickname: string;
    text?: string;
    imageUrl?: string;
    expiresAt: string;
  }>> => {
    const now = new Date().toISOString();
    const msgs = await ctx.db
      .query("chat_messages")
      .withIndex("by_expires", (q) => q.gt("expiresAt", now))
      .order("asc")
      .take(PAGE_SIZE);

    return await Promise.all(
      msgs.map(async (m) => ({
        _id: m._id,
        _creationTime: m._creationTime,
        nickname: m.nickname,
        text: m.text,
        imageUrl: m.storageId ? await ctx.storage.getUrl(m.storageId) ?? undefined : undefined,
        expiresAt: m.expiresAt,
      }))
    );
  },
});

// Invia un messaggio di testo
export const sendText = mutation({
  args: {
    nickname: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const expiresAt = new Date(Date.now() + EXPIRY_MS).toISOString();
    const id = await ctx.db.insert("chat_messages", {
      nickname: args.nickname.trim().slice(0, 30),
      text: args.text.trim().slice(0, 1000),
      expiresAt,
    });
    // Schedula la cancellazione automatica dopo 48 ore
    await ctx.scheduler.runAt(
      Date.now() + EXPIRY_MS,
      internal.chat.deleteExpired,
      {}
    );
    return id;
  },
});

// Genera URL per upload immagine
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Invia un messaggio con foto
export const sendImage = mutation({
  args: {
    nickname: v.string(),
    storageId: v.id("_storage"),
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    const expiresAt = new Date(Date.now() + EXPIRY_MS).toISOString();
    const id = await ctx.db.insert("chat_messages", {
      nickname: args.nickname.trim().slice(0, 30),
      storageId: args.storageId,
      contentType: args.contentType,
      expiresAt,
    });
    await ctx.scheduler.runAt(
      Date.now() + EXPIRY_MS,
      internal.chat.deleteExpired,
      {}
    );
    return id;
  },
});

// Cancella messaggi scaduti (chiamata automatica)
export const deleteExpired = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const expired = await ctx.db
      .query("chat_messages")
      .withIndex("by_expires", (q) => q.lt("expiresAt", now))
      .take(100);
    for (const msg of expired) {
      if (msg.storageId) {
        await ctx.storage.delete(msg.storageId);
      }
      await ctx.db.delete(msg._id);
    }
  },
});

// Elimina un messaggio (con o senza foto) — richiede la password dello Spazio del Programmatore
export const deleteMessage = mutation({
  args: {
    messageId: v.id("chat_messages"),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    if (!isProgrammerPassword(args.password)) {
      throw new ConvexError({
        message: "Password errata",
        code: "FORBIDDEN",
      });
    }
    const msg = await ctx.db.get(args.messageId);
    if (!msg) return;
    if (msg.storageId) {
      await ctx.storage.delete(msg.storageId);
    }
    await ctx.db.delete(args.messageId);
  },
});
