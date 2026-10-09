import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

const EMERG = [
  { n: "118", key: "emerg_118", color: "#e53e3e" },
  { n: "112", key: "emerg_112", color: "#2b6cb0" },
  { n: "115", key: "emerg_115", color: "#dd6b20" },
  { n: "113", key: "emerg_113", color: "#2b6cb0" },
  { n: "1522", key: "emerg_1522", color: "#805ad5" },
  { n: "800274274", key: "emerg_800", color: "#276749" },
] as const;

export default function SectionFarmacie() {
  const { t } = useTranslation("farmacie");
  return (
    <SectionCard title={t("h_card")} emoji="💊">
      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_farmacie")}</h2>

      <div className="space-y-4 mb-6">
        {(["bissanti","risoldi"] as const).map((ph) => (
          <div key={ph} className="bg-[#f0fff4] border border-[#a8d5b5] rounded-xl p-4">
            <h3 className="font-bold text-[#1a6b35] text-base mb-2">{t(`ph_${ph}_name`)}</h3>
            <ul className="text-sm space-y-1">
              <li>📍 {t(`ph_${ph}_addr`)}</li>
              <li>📞 {t("label_tel")} {ph === "bissanti" ? <a href="tel:0882681076" className="text-[#1a6b35] hover:underline cursor-pointer">0882 681076</a> : <a href="tel:0882681605" className="text-[#1a6b35] hover:underline cursor-pointer">0882 681605</a>}</li>
              <li>🕐 <strong>{t("label_orari")}</strong> {t(`ph_${ph}_hours_lv`)}</li>
              <li>🕐 {t(`ph_${ph}_hours_sab`)}</li>
              <li>🔄 {t(`ph_${ph}_turni`)}</li>
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-sm mb-6">
        {t("warn_orari")}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_presidio")}</h2>
      <div className="bg-[#fff0f0] border border-[#e8a0a0] rounded-xl p-4 mb-6">
        <h3 className="font-bold text-[#8B0000] text-base mb-2">{t("hosp_pres_name")}</h3>
        <ul className="text-sm space-y-1">
          <li>📍 <strong>{t("hosp_pres_addr")}</strong></li>
          <li>📞 Tel: <a href="tel:088259001" className="text-[#8B0000] hover:underline cursor-pointer">0882 590001</a></li>
          <li>🕐 {t("label_apertura")} <strong>{t("hosp_pres_apertura")}</strong></li>
        </ul>
        <a href="https://maps.google.com/?q=Presidio+Ospedaliero+Serracapriola" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#8B0000] font-semibold hover:underline text-sm cursor-pointer">
          {t("link_maps")}
        </a>
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_riferimento")}</h2>

      {/* San Severo */}
      <div className="bg-[#fff0f0] border border-[#e8a0a0] rounded-xl p-4 mb-4">
        <h3 className="font-bold text-[#8B0000] text-base mb-2">{t("hosp_sansevero_name")}</h3>
        <ul className="text-sm space-y-1">
          <li>📍 {t("hosp_sansevero_addr")}</li>
          <li>📞 {t("label_centralino")} <a href="tel:08282641" className="text-[#8B0000] hover:underline cursor-pointer">0882 2641</a></li>
          <li>📞 {t("label_ps")} <a href="tel:0882264433" className="text-[#8B0000] hover:underline cursor-pointer">0882 264433</a></li>
          <li>🚗 {t("label_distanza")} <strong>{t("hosp_sansevero_dist")}</strong></li>
          <li>🕐 {t("label_ps_orari")} <strong>{t("hosp_sansevero_ps")}</strong></li>
        </ul>
        <a href="https://maps.google.com/?q=Ospedale+Masselli+Mascia+San+Severo+Foggia" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#8B0000] font-semibold hover:underline text-sm cursor-pointer">
          {t("link_maps")}
        </a>
      </div>

      {/* Lucera */}
      <div className="bg-[#fff0f0] border border-[#e8a0a0] rounded-xl p-4 mb-4">
        <h3 className="font-bold text-[#8B0000] text-base mb-2">{t("hosp_lucera_name")}</h3>
        <ul className="text-sm space-y-1">
          <li>📍 {t("hosp_lucera_addr")}</li>
          <li>📞 {t("label_centralino")} <a href="tel:088255501" className="text-[#8B0000] hover:underline cursor-pointer">0882 55501</a></li>
          <li>📞 {t("label_ps")} <a href="tel:0882555255" className="text-[#8B0000] hover:underline cursor-pointer">0882 555255</a></li>
          <li>🚗 {t("label_distanza_short")} <strong>{t("hosp_lucera_dist")}</strong></li>
        </ul>
        <a href="https://maps.google.com/?q=Ospedale+Lastaria+Lucera+Foggia" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#8B0000] font-semibold hover:underline text-sm cursor-pointer">
          {t("link_maps")}
        </a>
      </div>

      {/* SGR */}
      <div className="bg-[#fff0f0] border border-[#e8a0a0] rounded-xl p-4 mb-4">
        <h3 className="font-bold text-[#8B0000] text-base mb-2">{t("hosp_sgr_name")}</h3>
        <ul className="text-sm space-y-1">
          <li>📍 {t("hosp_sgr_addr")}</li>
          <li>📞 {t("label_centralino")} <a href="tel:08826361" className="text-[#8B0000] hover:underline cursor-pointer">0882 6361</a></li>
          <li>📞 {t("label_ps")} <a href="tel:0882636111" className="text-[#8B0000] hover:underline cursor-pointer">0882 636111</a></li>
          <li>🚗 {t("label_distanza")} <strong>{t("hosp_sgr_dist")}</strong></li>
          <li>🕐 {t("label_ps_orari")} <strong>{t("hosp_sgr_ps")}</strong></li>
        </ul>
        <a href="https://maps.google.com/?q=Casa+Sollievo+della+Sofferenza+San+Giovanni+Rotondo" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#8B0000] font-semibold hover:underline text-sm cursor-pointer">
          {t("link_maps")}
        </a>
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_medici")}</h2>
      <div className="bg-[#f0fff4] border border-[#a8d5b5] rounded-xl p-4 mb-4">
        <h3 className="font-bold text-[#1a6b35] mb-2">{t("medici_studio_name")}</h3>
        <p className="text-sm mb-2">{t("p_medici")}</p>
        <ul className="text-sm space-y-1">
          <li>📞 {t("label_asl")} <a href="tel:0882228111" className="text-[#1a6b35] hover:underline cursor-pointer">0882 228111</a></li>
          <li>🌐 <a href="https://www.aslfg.it" target="_blank" rel="noopener noreferrer" className="text-[#1a6b35] hover:underline cursor-pointer">www.aslfg.it</a></li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_vet")}</h2>
      <div className="bg-[#f0fff4] border border-[#a8d5b5] rounded-xl p-4 mb-4">
        <img src="https://hercules-cdn.com/cdn-cgi/image/w=400,quality=75,format=auto/file_rljOO60UDMMU5miPrpkc4ZEr" alt="" loading="lazy" className="mx-auto mb-3 size-36 rounded-xl object-cover" />
        <h3 className="font-bold text-[#1a6b35] mb-2">{t("vet_name")}</h3>
        <ul className="text-sm space-y-1">
          <li>👩‍⚕️ {t("vet_doctor")}</li>
          <li>📍 Corso Skanderbeg 2A — Serracapriola (FG)</li>
          <li>📞 {t("label_phone")} <a href="tel:3409613867" className="text-[#1a6b35] hover:underline cursor-pointer">340 961 3867</a></li>
          <li>✉️ <a href="mailto:demartinoteresa.vet@gmail.com" className="text-[#1a6b35] hover:underline cursor-pointer break-all">demartinoteresa.vet@gmail.com</a></li>
        </ul>
        <p className="text-xs text-[#555] mt-2">{t("vet_note")}</p>
        <a href="https://maps.google.com/?q=Corso+Skanderbeg+2A+Serracapriola" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#1a6b35] font-semibold hover:underline text-sm cursor-pointer">
          {t("link_maps")}
        </a>
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-6">{t("h_emergenza")}</h2>
      <div className="grid grid-cols-2 gap-3">
        {EMERG.map((e) => (
          <a
            key={e.n}
            href={`tel:${e.n}`}
            className="flex flex-col items-center justify-center bg-white border-2 rounded-xl py-3 px-2 shadow-sm hover:shadow-md transition cursor-pointer text-center"
            style={{ borderColor: e.color }}
          >
            <span className="text-2xl font-bold" style={{ color: e.color }}>{e.n}</span>
            <span className="text-xs text-[#555] mt-0.5">{t(e.key)}</span>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
