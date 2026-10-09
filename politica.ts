import { v, ConvexError } from "convex/values";
import { mutation, query, action, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { isProgrammerPassword } from "./programmerSpace.ts";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
// Cache notizie: 2 ore
const NEWS_CACHE_TTL_MS = 2 * 60 * 60 * 1000;

// ─── MEDIA BACHECA ────────────────────────────────────────────────────────────

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMedia = mutation({
  args: {
    storageId: v.id("_storage"),
    contentType: v.string(),
    authorName: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const expiresAt = new Date(Date.now() + TEN_DAYS_MS).toISOString();
    const mediaId = await ctx.db.insert("politica_media", {
      storageId: args.storageId,
      contentType: args.contentType,
      authorName: args.authorName.trim(),
      caption: args.caption,
      expiresAt,
    });
    await ctx.scheduler.runAfter(TEN_DAYS_MS, internal.politica.deleteExpiredMedia, { mediaId });
  },
});

export const deleteExpiredMedia = internalMutation({
  args: { mediaId: v.id("politica_media") },
  handler: async (ctx, args): Promise<void> => {
    const media = await ctx.db.get(args.mediaId);
    if (!media) return;
    await ctx.storage.delete(media.storageId);
    await ctx.db.delete(args.mediaId);
  },
});

// Elimina un contenuto — richiede la password dello Spazio del Programmatore
export const deleteMedia = mutation({
  args: {
    mediaId: v.id("politica_media"),
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

export const listMedia = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("politica_media")
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

// ─── NOTIZIE FOGGIA ───────────────────────────────────────────────────────────

type NewsArticle = {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: string;
};

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export const getNews = query({
  args: {},
  handler: async (ctx): Promise<NewsArticle[]> => {
    // Return cached news if fresh
    const cached = await ctx.db.query("foggia_news_cache").order("desc").first();
    const cutoff = new Date(Date.now() - FIVE_DAYS_MS).toISOString();
    if (cached) {
      const age = Date.now() - new Date(cached.fetchedAt).getTime();
      const articles = JSON.parse(cached.articles) as NewsArticle[];
      // Filter out articles older than 5 days
      const filtered = articles.filter((a) => a.publishedAt >= cutoff);
      if (age < NEWS_CACHE_TTL_MS) {
        return filtered;
      }
      // Return stale cache (filtered) while triggering background refresh
      return filtered;
    }
    return [];
  },
});

export const refreshNews = action({
  args: {},
  handler: async (ctx): Promise<void> => {
    await ctx.runMutation(internal.politica.triggerNewsRefresh, {});
  },
});

export const triggerNewsRefresh = internalMutation({
  args: {},
  handler: async (ctx): Promise<void> => {
    await ctx.scheduler.runAfter(0, internal.politica.fetchAndCacheNews, {});
  },
});

export const fetchAndCacheNews = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    let articles: NewsArticle[] = [];

    // Usa Google News RSS — completamente gratuito, nessuna API key richiesta
    // Cerca notizie su "Foggia" in italiano
    const RSS_URLS = [
      "https://news.google.com/rss/search?q=Foggia+provincia&hl=it&gl=IT&ceid=IT:it",
      "https://news.google.com/rss/search?q=Foggia+notizie&hl=it&gl=IT&ceid=IT:it",
    ];

    for (const rssUrl of RSS_URLS) {
      if (articles.length >= 15) break;
      try {
        const res = await fetch(rssUrl, {
          headers: { "User-Agent": "SerraWithYU/1.0" },
        });
        if (!res.ok) continue;
        const xml = await res.text();

        // Parse RSS XML manualmente (senza librerie)
        const items = xml.split("<item>").slice(1);
        for (const item of items) {
          if (articles.length >= 15) break;

          const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]
            ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
            ?.replace(/&amp;/g, "&")
            ?.replace(/&lt;/g, "<")
            ?.replace(/&gt;/g, ">")
            ?.replace(/&quot;/g, '"')
            ?.trim();

          const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim()
            ?? item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim();

          const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();

          const source = item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]
            ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
            ?.trim()
            ?? "Google News";

          const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1]
            ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
            ?.replace(/<[^>]+>/g, "")
            ?.replace(/&amp;/g, "&")
            ?.replace(/&lt;/g, "<")
            ?.replace(/&gt;/g, ">")
            ?.replace(/&quot;/g, '"')
            ?.trim();

          if (!title || !link) continue;

          // Evita duplicati per URL
          if (articles.some((a) => a.url === link)) continue;

          const publishedAt = pubDate
            ? new Date(pubDate).toISOString()
            : new Date().toISOString();

          articles.push({
            title,
            description: description ?? null,
            url: link,
            publishedAt,
            source,
          });
        }
      } catch {
        // Continua con il prossimo URL in caso di errore
        continue;
      }
    }

    // Ordina per data più recente prima
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (articles.length > 0) {
      await ctx.runMutation(internal.politica.saveCachedNews, { articles: JSON.stringify(articles) });
    }
  },
});

export const saveCachedNews = internalMutation({
  args: { articles: v.string() },
  handler: async (ctx, args): Promise<void> => {
    // Keep only latest cache entry
    const old = await ctx.db.query("foggia_news_cache").collect();
    for (const row of old) {
      await ctx.db.delete(row._id);
    }
    await ctx.db.insert("foggia_news_cache", {
      articles: args.articles,
      fetchedAt: new Date().toISOString(),
    });
  },
});
