import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

const MAT_KEYS = ["1","2","3","4","5","6","7","8","9","10"] as const;

export default function SectionEcologia() {
  const { t } = useTranslation("ecologia");
  return (
    <SectionCard title={t("h_card")} emoji="♻️">
      <h2 className="text-xl font-bold text-[#2d6a2d] mb-3">{t("h_isola")}</h2>
      <p className="mb-4 text-sm">{t("p_isola")}</p>

      <div className="bg-[#f0fff4] border border-[#a8d5b5] rounded-xl p-4 mb-5">
        <h3 className="font-bold text-[#1a6b35] text-base mb-2">{t("h_dove")}</h3>
        <ul className="text-sm space-y-1">
          <li>📍 <strong>{t("loc_addr")}</strong></li>
          <li>📞 {t("loc_tel_label")} <a href="tel:088259001" className="text-[#1a6b35] hover:underline cursor-pointer">Comune 0882 591001</a></li>
        </ul>
        <a
          href="https://maps.google.com/?q=Isola+Ecologica+Serracapriola"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[#1a6b35] font-semibold hover:underline text-sm cursor-pointer"
        >
          {t("link_maps")}
        </a>
      </div>

      <div className="rounded-xl overflow-hidden shadow-md border border-[#a8d5b5] mb-5">
        <img
          src="https://hercules-cdn.com/file_s7OCQcdXrxJhU8So3cPoW7hG"
          alt="Raccolta differenziata Serracapriola"
          className="w-full object-cover"
        />
      </div>

      <h2 className="text-xl font-bold text-[#2d6a2d] mb-3">{t("h_cosa")}</h2>
      <div className="grid grid-cols-1 gap-3 mb-5">
        {MAT_KEYS.map((k) => (
          <div key={k} className="bg-[#f0fff4] rounded-xl p-3 border border-[#a8d5b5] flex gap-3 items-start">
            <span className="text-2xl">{t(`mat_${k}_title`).split(" ")[0]}</span>
            <div>
              <p className="font-bold text-sm text-[#1a6b35]">{t(`mat_${k}_title`).split(" ").slice(1).join(" ")}</p>
              <p className="text-xs text-[#555]">{t(`mat_${k}_desc`)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-sm">
        {t("warn_nota")}
      </div>
    </SectionCard>
  );
}
