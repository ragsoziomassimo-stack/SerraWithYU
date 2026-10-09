import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

export default function SectionStoria() {
  const { t } = useTranslation("storia");
  return (
    <SectionCard title={t("h_card")} emoji="📜">
      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_origini")}</h2>
      <p className="mb-4">{t("p_origini_1")}</p>
      <p className="mb-4">{t("p_origini_2")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_romano")}</h2>
      <p className="mb-4">{t("p_romano_1")}</p>
      <p className="mb-4">{t("p_romano_2")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_medioevo")}</h2>
      <p className="mb-4">{t("p_medioevo_1")}</p>
      <p className="mb-4">{t("p_medioevo_2")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_aragonese")}</h2>
      <p className="mb-4">{t("p_aragonese_1")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_moderni")}</h2>
      <p className="mb-4">{t("p_moderni_1")}</p>
      <p className="mb-4">{t("p_moderni_2")}</p>
      <p className="mb-4">{t("p_moderni_3")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_novecento")}</h2>
      <p className="mb-4">{t("p_novecento_1")}</p>
      <p className="mb-4">{t("p_novecento_2")}</p>
      <p className="mb-4">{t("p_novecento_3")}</p>
    </SectionCard>
  );
}
