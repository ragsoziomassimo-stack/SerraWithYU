import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

export default function SectionFestivita() {
  const { t } = useTranslation("festivita");
  return (
    <SectionCard title={t("h_card")} emoji="🎉">

      <h2 className="text-xl font-bold text-[#8B2500] mb-4">{t("h_feste")}</h2>
      <p className="mb-6 text-sm leading-relaxed">{t("p_feste")}</p>

      <div className="bg-[#fff8f0] rounded-xl p-5 border border-[#e8c9a0] mb-4">
        <h3 className="text-lg font-bold text-[#8B2500] mb-2">{t("fst_fortunato_h")}</h3>
        <p className="text-sm mb-2 leading-relaxed">{t("fst_fortunato_p1")}</p>
        <p className="text-sm leading-relaxed">{t("fst_fortunato_p2")}</p>
      </div>

      <div className="bg-[#fff8f0] rounded-xl p-5 border border-[#e8c9a0] mb-4">
        <h3 className="text-lg font-bold text-[#8B2500] mb-2">{t("fst_mercurio_h")}</h3>
        <p className="text-sm mb-2 leading-relaxed">{t("fst_mercurio_p1")}</p>
        <p className="text-sm leading-relaxed">{t("fst_mercurio_p2")}</p>
      </div>

      <div className="bg-[#fff8f0] rounded-xl p-5 border border-[#e8c9a0] mb-4">
        <h3 className="text-lg font-bold text-[#8B2500] mb-2">{t("fst_grazie_h")}</h3>
        <p className="text-sm mb-2 leading-relaxed">{t("fst_grazie_p1")}</p>
        <p className="text-sm leading-relaxed">{t("fst_grazie_p2")}</p>
      </div>

      {/* Infiorata */}
      <div className="bg-[#fff8f0] rounded-xl p-5 border border-[#e8c9a0] mb-4">
        <h3 className="text-lg font-bold text-[#8B2500] mb-2">{t("fst_infiorata_h")}</h3>
        <p className="text-sm mb-2 leading-relaxed">{t("fst_infiorata_p1")}</p>
        <p className="text-sm leading-relaxed">{t("fst_infiorata_p2")}</p>
      </div>

      {/* Palio */}
      <div className="bg-gradient-to-br from-[#8B2500]/8 to-[#fff8f0] rounded-xl p-5 border border-[#e8c9a0] mb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl">🫏</span>
          <h3 className="text-lg font-bold text-[#8B2500]">{t("fst_palio_h")}</h3>
        </div>
        <p className="text-sm mb-2 leading-relaxed">{t("fst_palio_p1")}</p>
        <p className="text-sm mb-2 leading-relaxed">{t("fst_palio_p2")}</p>
        <p className="text-sm leading-relaxed">{t("fst_palio_p3")}</p>
      </div>

    </SectionCard>
  );
}
