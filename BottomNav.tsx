import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { isFreshAlert } from "@/lib/youalert.ts";
import FlashingSiren from "./FlashingSiren.tsx";
import type { SectionId } from "../Index.tsx";

const NAV_IDS: SectionId[] = [
  "home", "youalert", "anziani", "webcam", "storia", "ricordi", "turismo", "maps", "castello",
  "festivita", "mare", "comune", "farmacie", "vie", "francigena", "ecologia", "prodotti", "ricette", "ristoranti", "case", "mondo", "contapassi", "chiese", "curiosita", "hotel", "segnalazioni", "sondaggi", "gioco", "capriolo", "gioco3", "chat",
];

const NAV_EMOJIS: Record<SectionId, string> = {
  home: "🏠",
  storia: "📜",
  turismo: "🧭",
  maps: "🗺️",
  castello: "🏰",
  festivita: "🎉",
  mare: "🌊",
  comune: "🏛️",
  farmacie: "💊",
  vie: "🛣️",
  francigena: "⛪",
  ecologia: "♻️",
  prodotti: "🛒",
  ricette: "👵",
  annunci: "🛍️",
  case: "🏠",
  mondo: "🌍",
  contapassi: "👣",
  ricordi: "🖼️",
  capriolo: "🧩",
  gioco3: "🃏",
  gioco4: "🔍",
  ristoranti: "🍝",
  anziani: "🆘",
  youalert: "🚨",
  chiese: "⛪",
  webcam: "📷",
  curiosita: "💡",
  turista: "🤳",
  hotel: "🛏️",
  segnalazioni: "📢",
  chat: "💬",
  politica: "🏛️",
  sondaggi: "📊",
  sondaggiStorico: "🗳️",
  gioco: "🦌",
  giocoTrofei: "🏆",
};

interface Props {
  active: SectionId;
  onSelect: (s: SectionId) => void;
}

export default function BottomNav({ active, onSelect }: Props) {
  const { t } = useTranslation("common");
  const latest = useQuery(api.youalert.latest, {});
  const sirenFlashing = isFreshAlert(latest?.createdAt);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-[#e8c9a0] shadow-[0_-4px_24px_rgba(139,45,0,0.12)]">
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-1 px-2 py-2 min-w-max mx-auto">
          {NAV_IDS.map((id) => (
            <motion.button
              key={id}
              onClick={() => onSelect(id)}
              whileTap={{ scale: 0.88 }}
              animate={active === id ? { y: [0, -4, 0] } : { y: 0 }}
              transition={active === id ? { duration: 0.3, ease: "easeOut" as const } : {}}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer select-none min-w-[58px]
                ${active === id
                  ? "bg-[#8B2500] text-white shadow-md scale-105"
                  : "text-[#8B2500] hover:bg-[#fff0e6]"
                }`}
            >
              {id === "youalert" ? (
                <FlashingSiren flashing={sirenFlashing} className="text-lg leading-none" />
              ) : (
                <span className="text-lg leading-none">{NAV_EMOJIS[id]}</span>
              )}
              <span className="text-[10px] font-bold leading-tight whitespace-nowrap">
                {t(`nav.${id}`)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
