import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";
import Compass from "./Compass.tsx";

const ENO_KEYS = ["1","2","3","4","5","6"] as const;

const FOTO_DINTORNI = [
  {
    src: "https://images.unsplash.com/photo-1614323777193-379d5e6797f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Costa del Gargano",
    label: "Costa del Gargano",
  },
  {
    src: "https://images.unsplash.com/photo-1621403059510-7d19267b8006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Faraglioni pugliesi",
    label: "Faraglioni pugliesi",
  },
  {
    src: "https://images.unsplash.com/photo-1632153630866-f45b76cc58e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Ulivi di Puglia",
    label: "Ulivi di Puglia",
  },
  {
    src: "https://images.unsplash.com/photo-1778059124393-89c7c1fbc55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Trulli pugliesi",
    label: "Trulli pugliesi",
  },
];

export default function SectionTurismo() {
  const { t } = useTranslation("turismo");
  return (
    <SectionCard title={t("h_card")} emoji="🧭" action={<Compass />}>

      {/* Hero foto scorrevoli */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 mb-5">
        {FOTO_DINTORNI.map((f) => (
          <div key={f.label} className="flex-shrink-0 w-44 rounded-xl overflow-hidden shadow-md border border-[#e8c9a0]">
            <img src={f.src} alt={f.alt} className="w-full h-28 object-cover" />
            <div className="bg-[#fff8f0] px-2 py-1 text-center">
              <span className="text-[10px] font-semibold text-[#8B2500]">{f.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_cosa")}</h2>
      <p className="mb-4">{t("p_cosa")}</p>

      {/* Card luoghi principali */}
      <div className="flex flex-col gap-3 mb-6">
        {[
          { h: "h_castello", p: "p_castello", emoji: "🏰" },
          { h: "h_sanmercurio", p: "p_sanmercurio", emoji: "⛪" },
          { h: "h_padrepio", p: "p_padrepio", emoji: "✝️" },
          { h: "h_teatropalazzo", p: "p_teatropalazzo", emoji: "🎭" },
          { h: "h_palazzo", p: "p_palazzo", emoji: "🏛️" },
          { h: "h_belvedere", p: "p_belvedere", emoji: "🌿" },
        ].map((item) => (
          <div key={item.h} className="flex gap-3 bg-[#fff8f0] border border-[#e8c9a0] rounded-xl p-3">
            <span className="text-2xl mt-0.5 flex-shrink-0">{item.emoji}</span>
            <div>
              <h3 className="font-bold text-[#8B2500] text-sm mb-1">{t(item.h)}</h3>
              <p className="text-sm text-[#444] leading-relaxed">{t(item.p)}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3 mt-2">{t("h_dintorni")}</h2>
      <p className="mb-4">{t("p_dintorni")}</p>

      <div className="flex flex-col gap-3 mb-6">
        {[
          { h: "h_gargano", p: "p_gargano" },
          { h: "h_lesina", p: "p_lesina" },
          { h: "h_varano", p: "p_varano" },
          { h: "h_lucera", p: "p_lucera" },
          { h: "h_troia", p: "p_troia" },
          { h: "h_sangiovanni", p: "p_sangiovanni" },
          { h: "h_montesantangelo", p: "p_montesantangelo" },
          { h: "h_vieste", p: "p_vieste" },
          { h: "h_foresta", p: "p_foresta" },
          { h: "h_termoli", p: "p_termoli" },
        ].map((item) => (
          <div key={item.h} className="bg-white/80 border border-[#e8c9a0] rounded-xl p-3">
            <h3 className="font-semibold text-[#a04020] text-sm mb-1">{t(item.h)}</h3>
            <p className="text-sm text-[#444] leading-relaxed">{t(item.p)}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_eno")}</h2>
      <p className="mb-3">{t("p_eno")}</p>
      <ul className="list-disc pl-5 mb-6 space-y-2 text-sm">
        {ENO_KEYS.map((k) => (
          <li key={k}><strong>{t(`li_eno_${k}_b`)}</strong> — {t(`li_eno_${k}`)}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_attrazioni")}</h2>
      <p className="mb-4">{t("p_attrazioni")}</p>
      <div className="flex flex-col gap-3">
        {[
          { h: "h_acquasplash", p: "p_acquasplash" },
          { h: "h_zoo", p: "p_zoo" },
          { h: "h_lesina_att", p: "p_lesina_att" },
          { h: "h_varano_sport", p: "p_varano_sport" },
          { h: "h_parchi", p: "p_parchi" },
          { h: "h_riserva", p: "p_riserva" },
          { h: "h_equestre", p: "p_equestre" },
          { h: "h_estate", p: "p_estate" },
        ].map((item) => (
          <div key={item.h} className="bg-[#fff8f0] border border-[#e8c9a0] rounded-xl p-3">
            <h3 className="font-semibold text-[#a04020] text-sm mb-1">{t(item.h)}</h3>
            <p className="text-sm text-[#444] leading-relaxed">{t(item.p)}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
