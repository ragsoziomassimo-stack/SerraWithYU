import { ConvexError, v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Immagine unica della home: ogni nuova pubblicazione sostituisce la precedente.
export const current = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db.query("community_image").order("desc").first();
    if (!row) return null;
    return { url: await ctx.storage.getUrl(row.storageId), createdAt: row.createdAt };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const replaceImage = internalMutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const old = await ctx.db.query("community_image").take(20);
    for (const row of old) {
      await ctx.storage.delete(row.storageId);
      await ctx.db.delete(row._id);
    }
    await ctx.db.insert("community_image", { storageId: args.storageId, createdAt: new Date().toISOString() });
    return null;
  },
});

const RULES =
  "Sei il moderatore di un'app di comunità di un paese italiano. Il tuo UNICO compito è impedire la pubblicazione di immagini offensive o di nudo. " +
  "Rifiuta SOLO: nudità o contenuti sessuali espliciti, immagini offensive (violenza grafica, odio, discriminazione, volgarità). " +
  "Approva tutto il resto, senza giudicare l'argomento, lo scopo o il tipo di contenuto (anche pubblicità, foto, locandine, documenti). " +
  'Rispondi SOLO con JSON: {"allowed": true|false, "reason": "motivo breve in italiano"}.';

type Verdict = { allowed: boolean; reason?: string };

async function askModerator(imageUrl: string): Promise<Verdict> {
  const res = await fetch("https://ai-gateway.hercules.app/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.HERCULES_API_KEY}` },
    body: JSON.stringify({
      model: "openai/gpt-6-luna",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: RULES },
        { role: "user", content: [{ type: "text", text: "Analizza questa immagine." }, { type: "image_url", image_url: { url: imageUrl } }] },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const parsed: unknown = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
  if (typeof parsed === "object" && parsed !== null && "allowed" in parsed && typeof parsed.allowed === "boolean") {
    const reason = "reason" in parsed && typeof parsed.reason === "string" ? parsed.reason : undefined;
    return { allowed: parsed.allowed, reason };
  }
  throw new Error("Risposta AI non valida");
}

// Controllo automatico prima di pubblicare: se non passa, il file viene cancellato.
export const submit = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args): Promise<null> => {
    const url = await ctx.storage.getUrl(args.storageId);
    let verdict: Verdict = { allowed: false, reason: "Controllo non riuscito, riprova." };
    try {
      if (url) verdict = await askModerator(url);
    } catch {
      // In caso di errore dell'AI non si pubblica nulla.
    }
    if (!verdict.allowed) {
      await ctx.storage.delete(args.storageId);
      throw new ConvexError({ message: verdict.reason ?? "Immagine non consentita", code: "BAD_REQUEST" });
    }
    await ctx.runMutation(internal.comunita.replaceImage, { storageId: args.storageId });
    return null;
  },
});
