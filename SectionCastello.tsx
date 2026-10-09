import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

const FAM_KEYS = ["1","2","3","4","5","6","7"] as const;

export default function SectionCastello() {
  const { t } = useTranslation("castello");
  return (
    <SectionCard title={t("h_card")} emoji="🏰">
      <div className="rounded-2xl overflow-hidden border border-[#e8c9a0] shadow-md mb-5">
        <img
          src="https://hercules-cdn.com/file_mX5xS1yrNSuf8LS4abU55Caj"
          alt="Castello Maresca - Serracapriola"
          className="w-full object-cover"
        />
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_simbolo")}</h2>
      <p className="mb-4">{t("p_simbolo_1")}</p>
      <p className="mb-4">{t("p_simbolo_2")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_architettura")}</h2>
      <p className="mb-4">{t("p_architettura_1")}</p>
      <p className="mb-4">{t("p_architettura_2")}</p>
      <p className="mb-4">{t("p_architettura_3")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_famiglie")}</h2>
      <p className="mb-4">{t("p_famiglie")}</p>
      <ul className="list-disc pl-5 mb-4 space-y-2">
        {FAM_KEYS.map((k) => (
          <li key={k}><strong>{t(`li_fam_${k}_name`)}</strong> {t(`li_fam_${k}_desc`)}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_leggende")}</h2>
      <p className="mb-4">{t("p_leggende_1")}</p>
      <p className="mb-4">{t("p_leggende_2")}</p>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_visita")}</h2>
      <p className="mb-4">{t("p_visita")}</p>

      <div className="bg-[#fff8f0] rounded-xl p-4 border border-[#e8c9a0] mb-4">
        <p className="font-bold text-[#8B2500] mb-2">{t("museo_h")}</p>
        <p className="text-sm mb-2">{t("museo_p")}</p>
      </div>

      <div className="bg-[#fff8f0] rounded-xl p-4 border border-[#e8c9a0]">
        <p className="font-bold text-[#8B2500] mb-1">{t("come_h")}</p>
        <p className="text-sm">{t("come_p")}</p>
        <a
          href="https://maps.google.com/?q=Castello+Maresca+Serracapriola"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[#8B2500] font-semibold hover:underline text-sm cursor-pointer"
        >
          {t("link_maps")}
        </a>
      </div>
    </SectionCard>
  );
}
