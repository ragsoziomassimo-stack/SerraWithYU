import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { isProgrammerPassword } from "./programmerSpace.ts";

// A far-future date used as a placeholder for the (now unused) expiresAt field,
// kept only for schema/backward compatibility. Photos are no longer auto-deleted.
const FAR_FUTURE_ISO = "9999-12-31T00:00:00.000Z";

// Generate an upload URL — open to everyone
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save photo after upload. Photos are kept indefinitely (no automatic deletion).
export const saveMedia = mutation({
  args: {
    storageId: v.id("_storage"),
    contentType: v.string(),
    authorName: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    // Only allow images
    if (!args.contentType.startsWith("image/")) {
      throw new Error("Solo le foto sono consentite");
    }

    await ctx.db.insert("turista_media", {
      storageId: args.storageId,
      contentType: args.contentType,
      authorName: args.authorName.trim(),
      authorTokenIdentifier: "",
      caption: args.caption,
      expiresAt: FAR_FUTURE_ISO,
    });
  },
});

// Delete a photo — requires the programmer password
export const deleteMedia = mutation({
  args: {
    mediaId: v.id("turista_media"),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    if (!isProgrammerPassword(args.password)) {
      throw new ConvexError({
        message: "Password errata",
        code: "FORBIDDEN",
      });
    }
    const media = await ctx.db.get(args.mediaId);
    if (!media) return;
    await ctx.storage.delete(media.storageId);
    await ctx.db.delete(args.mediaId);
  },
});

// List all media (paginated, most recent first)
export const listMedia = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("turista_media")
      .order("desc")
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      results.page.map(async (item) => ({
        ...item,
        url: await ctx.storage.getUrl(item.storageId),
      }))
    );

    return { ...results, page };
  },
});
