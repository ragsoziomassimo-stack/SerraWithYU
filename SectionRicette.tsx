import { useState } from "react";
import { useTranslation } from "react-i18next";
import RicetteUtenti from "./RicetteUtenti.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

const RICETTE_KEYS = Array.from({ length: 30 }, (_, i) => String(i + 1));

const RICETTE_EMOJIS: Record<string, string> = {
  "1": "🍝", "2": "🍲", "3": "🥘", "4": "🍞", "5": "🐟",
  "6": "🥩", "7": "🍅", "8": "🧀", "9": "🥬", "10": "🍆",
  "11": "🍖", "12": "🐐", "13": "🐔", "14": "🥔", "15": "🌾",
  "16": "🍬", "17": "🍪", "18": "🍩", "19": "🥧", "20": "🍮",
  "21": "🍯", "22": "🥜", "23": "🍫", "24": "🥛", "25": "🍨",
  "26": "🍰", "27": "🍳", "28": "🥬", "29": "🧇", "30": "🍭",
};

type Ricetta = { nome: string; ingredienti: string; preparazione: string };

export default function SectionRicette() {
  const { t } = useTranslation("ricette");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const openRicetta: Ricetta | null = openKey
    ? {
        nome: t(`ricetta_${openKey}_nome`),
        ingredienti: t(`ricetta_${openKey}_ingredienti`),
        preparazione: t(`ricetta_${openKey}_preparazione`),
      }
    : null;

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4 px-1">
      <div className="rounded-2xl overflow-hidden shadow-md border border-[#e8c9a0] mb-1">
        <div className="bg-[#fff8f0] px-4 py-3">
          <h2 className="text-xl font-black text-[#8B2500]">{t("title")}</h2>
          <p className="text-sm text-[#555] mt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {RICETTE_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setOpenKey(k)}
            className="bg-white/90 rounded-2xl shadow-sm border border-[#e8c9a0] p-4 flex flex-col items-center gap-2 text-center cursor-pointer hover:shadow-md hover:border-[#8B2500]/40 transition-all"
          >
            <span className="text-3xl leading-none">{RICETTE_EMOJIS[k]}</span>
            <span className="font-black text-[#8B2500] text-sm leading-tight">
              {t(`ricetta_${k}_nome`)}
            </span>
          </button>
        ))}
      </div>

      <RicetteUtenti />

      <Dialog open={openKey !== null} onOpenChange={(open) => !open && setOpenKey(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {openRicetta && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#8B2500] text-xl font-black">
                  {RICETTE_EMOJIS[openKey ?? ""]} {openRicetta.nome}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <div>
                  <h4 className="font-bold text-[#8B2500] text-sm mb-1">{t("ingredientiLabel")}</h4>
                  <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">
                    {openRicetta.ingredienti}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#8B2500] text-sm mb-1">{t("preparazioneLabel")}</h4>
                  <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">
                    {openRicetta.preparazione}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
