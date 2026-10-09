import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

const VIE_DATA = [
  { nome: "Piazza Castello",     key: "1" },
  { nome: "Corso Garibaldi",     key: "2" },
  { nome: "SS16",                key: "3" },
  { nome: "Viale Aldo Moro",     key: "4" },
  { nome: "Piazza Padre Pio",    key: "5" },
  { nome: "Via Giro Esterno",    key: "6" },
  { nome: "Piazza San Francesco", key: "7" },
] as const;

const ITIN_KEYS = ["1", "2"] as const;

export default function SectionVie() {
  const { t } = useTranslation("vie");

  return (
    <SectionCard title={t("h_card")} emoji="🛣️">
      <p className="mb-4">{t("intro_p")}</p>

      <div className="space-y-3 mb-6">
        {VIE_DATA.map((v) => (
          <div key={v.nome} className="bg-white/80 border border-[#e8c9a0] rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-[#8B2500]">{v.nome}</h3>
              <span className="text-xs bg-[#8B2500]/10 text-[#8B2500] rounded-full px-2 py-0.5 ml-2 whitespace-nowrap font-medium">
                {t(`vie_${v.key}_tipo`)}
              </span>
            </div>
            <p className="text-sm text-[#444] leading-relaxed">{t(`vie_${v.key}_desc`)}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(v.nome + " Serracapriola FG")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#8B2500] hover:underline mt-1 inline-block font-semibold cursor-pointer"
            >
              {t("link_maps")}
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_itinerari")}</h2>
      <div className="space-y-3">
        {ITIN_KEYS.map((k) => (
          <div key={k} className="bg-[#fff8f0] border border-[#e8c9a0] rounded-xl p-4">
            <p className="font-bold text-[#8B2500] text-sm mb-1">{t(`itin_${k}_title`)}</p>
            <p className="text-sm text-[#555]">{t(`itin_${k}_desc`)}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
