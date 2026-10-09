import { useTranslation } from "react-i18next";
import { MEMORY_PAIRS, type MemoryPair } from "./memory-pairs.ts";

type Localized = { title: string; text: string };

const isLocalized = (v: unknown): v is Localized[] =>
  Array.isArray(v) && v.every((x) => typeof x === "object" && x !== null && "title" in x && "text" in x);

// Titoli e descrizioni delle foto nella lingua scelta (stesso ordine di MEMORY_PAIRS); in caso di errore resta l'italiano.
export function useMemoryPairs(): MemoryPair[] {
  const { t } = useTranslation("ricordiPairs");
  const raw: unknown = t("pairs", { returnObjects: true });
  const texts = isLocalized(raw) ? raw : [];
  return MEMORY_PAIRS.map((p, i) => ({ ...p, title: texts[i]?.title ?? p.title, text: texts[i]?.text ?? p.text }));
}
