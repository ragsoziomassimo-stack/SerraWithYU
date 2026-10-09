import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  foto: defineTable({
    storageId: v.id("_storage"),
    autore: v.string(),
    didascalia: v.optional(v.string()),
  }),

  // Pagina del turista: foto pubblicate dagli utenti (scadono dopo 20 giorni)
  turista_media: defineTable({
    storageId: v.id("_storage"),
    contentType: v.string(),
    authorName: v.string(),
    authorTokenIdentifier: v.string(),
    caption: v.optional(v.string()),
    expiresAt: v.string(), // ISO 8601 UTC
  })
    .index("by_author", ["authorTokenIdentifier"])
    .index("by_expires", ["expiresAt"]),

  // Pagina Politica: media pubblici (scadono dopo 10 giorni)
  politica_media: defineTable({
    storageId: v.id("_storage"),
    contentType: v.string(),
    authorName: v.string(),
    caption: v.optional(v.string()),
    expiresAt: v.string(), // ISO 8601 UTC
  }).index("by_expires", ["expiresAt"]),

  // Cache notizie Foggia
  foggia_news_cache: defineTable({
    articles: v.string(), // JSON array stringificato
    fetchedAt: v.string(), // ISO 8601 UTC
  }),

  // Chat pubblica in tempo reale (messaggi scadono dopo 48 ore)
  chat_messages: defineTable({
    nickname: v.string(),
    text: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    contentType: v.optional(v.string()), // es. "image/jpeg"
    expiresAt: v.string(), // ISO 8601 UTC
  }).index("by_expires", ["expiresAt"]),
  // Segnalazioni e proposte dei cittadini
  segnalazioni: defineTable({
    categoria: v.string(),
    nome: v.string(),
    testo: v.string(),
    expiresAt: v.string(), // ISO 8601 UTC — scadono dopo 30 giorni
  }).index("by_expires", ["expiresAt"]),

  // Gioco del Paese — vincitori del quiz su Serracapriola (30/30 risposte corrette)
  quiz_winners: defineTable({
    nickname: v.string(),
    completedAt: v.string(), // ISO 8601 UTC
  }),

  // Serrani nel mondo — dove vivono i serrani emigrati
  serrani_mondo: defineTable({
    nome: v.string(),
    luogo: v.string(), // etichetta del luogo (senza indirizzo preciso)
    lat: v.number(),
    lon: v.number(),
  }),

  // Contapassi — classifica per distanza percorsa
  passi_classifica: defineTable({
    nickname: v.string(),
    distanzaM: v.number(),
    passi: v.number(),
    durataSec: v.number(),
    livello: v.string(),
  }).index("by_distanza", ["distanzaM"]),

  // Il Capriolo e la Madonna — classifica per tempo (il più basso vince)
  // Classifica del Gioco 2: tempo totale dei 10 labirinti di fila.
  labirinto_serie: defineTable({
    nickname: v.string(),
    tempoMs: v.number(),
  }).index("by_tempo", ["tempoMs"]),

  // Vecchia classifica (un solo labirinto), non più usata.
  labirinto_classifica: defineTable({
    nickname: v.string(),
    tempoMs: v.number(),
  }).index("by_tempo", ["tempoMs"]),

  // Modifiche al sito fatte dal programmatore dopo la pubblicazione:
  // "text" = sostituisce (o cancella, se vuoto) un testo in una lingua; "hide" = nasconde una foto (lang "*")
  site_overrides: defineTable({
    kind: v.union(v.literal("text"), v.literal("hide")),
    lang: v.string(),
    original: v.string(),
    replacement: v.string(),
  }).index("by_kind_and_lang_and_original", ["kind", "lang", "original"]),

  // Webcam — collegamenti a video di altri siti, pubblicati da tutti
  webcam_links: defineTable({
    titolo: v.string(),
    url: v.string(),
    createdAt: v.string(), // ISO 8601 UTC
  }).index("by_createdAt", ["createdAt"]),

  // Immagine di comunità in home: ne esiste una sola, la nuova sostituisce la vecchia
  community_image: defineTable({
    storageId: v.id("_storage"),
    createdAt: v.string(), // ISO 8601 UTC
  }),

  // YouAlert — avvisi pubblicati dagli utenti
  youalert: defineTable({
    nome: v.optional(v.string()), // non più usato: le segnalazioni sono anonime
    testo: v.string(),
    storageIds: v.optional(v.array(v.id("_storage"))), // max 2 foto
    createdAt: v.string(), // ISO 8601 UTC
  }).index("by_createdAt", ["createdAt"]),

  // Notifiche push: associazione tra iscrizione e visitatore
  pushIdentities: defineTable({
    secret: v.string(),
    visitorId: v.string(),
  })
    .index("by_secret", ["secret"])
    .index("by_visitorId", ["visitorId"]),

  // Ricette scritte dagli utenti
  ricette_utenti: defineTable({
    autore: v.string(),
    titolo: v.string(),
    testo: v.string(),
    createdAt: v.string(), // ISO 8601 UTC
  }).index("by_createdAt", ["createdAt"]),

  // U Spacc — bacheca annunci di compravendita (scadono dopo 30 giorni o rimozione manuale)
  annunci: defineTable({
    titolo: v.string(),
    descrizione: v.string(),
    prezzo: v.optional(v.string()),
    contatto: v.string(),
    storageId: v.optional(v.id("_storage")),
    contentType: v.optional(v.string()),
    ownerKey: v.string(), // chiave locale del dispositivo che ha pubblicato l'annuncio
    expiresAt: v.string(), // ISO 8601 UTC
  })
    .index("by_expires", ["expiresAt"])
    .index("by_owner", ["ownerKey"]),

});
