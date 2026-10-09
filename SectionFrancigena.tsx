import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

type TappaItem = { nome: string; dist: string; desc: string };

export default function SectionFrancigena() {
  const { t } = useTranslation("francigena");

  // i18next returns a raw array for the "tappe" key
  const tappe = t("tappe", { returnObjects: true }) as TappaItem[];

  return (
    <SectionCard title={t("h_card")} emoji="⛪">
      {/* Intro */}
      <p className="mb-6 text-base leading-relaxed">{t("intro_p")}</p>

      {/* Image */}
      <div className="rounded-2xl overflow-hidden shadow-md mb-6 border border-[#e8c9a0]">
        <img
          src="https://hercules-cdn.com/file_4b14IOlbNfXphk6b0p9ZF4xm"
          alt="Pellegrini sulla Via Francigena"
          className="w-full object-cover max-h-64"
        />
        <div className="bg-[#fff8f0] px-4 py-2 text-center">
          <span className="text-xs font-semibold text-[#8B2500] tracking-wide uppercase">
            Via Francigena del Sud
          </span>
        </div>
      </div>

      {/* Storia */}
      <h2 className="text-lg font-bold text-[#8B2500] mb-2">{t("storia_title")}</h2>
      <p className="mb-5 text-sm leading-relaxed">{t("storia_desc")}</p>

      {/* Serracapriola */}
      <h2 className="text-lg font-bold text-[#8B2500] mb-2">{t("serracapriola_title")}</h2>
      <p className="mb-5 text-sm leading-relaxed">{t("serracapriola_desc")}</p>

      {/* Tappe */}
      <h2 className="text-lg font-bold text-[#8B2500] mb-3">{t("tappe_title")}</h2>
      <div className="space-y-3 mb-6">
        {Array.isArray(tappe) && tappe.map((tappa) => (
          <div
            key={tappa.nome}
            className="bg-white/80 border border-[#e8c9a0] rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-[#8B2500]">{tappa.nome}</h3>
              <span className="text-xs bg-[#8B2500]/10 text-[#8B2500] rounded-full px-2 py-0.5 ml-2 whitespace-nowrap font-medium">
                {tappa.dist}
              </span>
            </div>
            <p className="text-sm text-[#444] leading-relaxed">{tappa.desc}</p>
          </div>
        ))}
      </div>

      {/* Spirituale */}
      <h2 className="text-lg font-bold text-[#8B2500] mb-2">{t("spirituale_title")}</h2>
      <p className="mb-5 text-sm leading-relaxed">{t("spirituale_desc")}</p>

      {/* Info pratiche */}
      <div className="bg-[#fff8f0] border border-[#e8c9a0] rounded-2xl p-5">
        <h2 className="text-base font-bold text-[#8B2500] mb-3">{t("info_title")}</h2>
        <ul className="space-y-1 text-sm text-[#444]">
          <li>📅 {t("info_stagione")}</li>
          <li>📏 {t("info_distanza")}</li>
          <li>🏔️ {t("info_difficolta")}</li>
        </ul>
        <a
          href={t("info_link")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-[#8B2500] hover:underline cursor-pointer"
        >
          {t("info_link_label")}
        </a>
      </div>
    </SectionCard>
  );
}
