import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

const BEACH_KEYS = [
  { id: "marina", hideMap: true },
  { id: "termoli" },
  { id: "lesina" },
  { id: "chieuti" },
  { id: "sanmenaio" },
  { id: "rodi" },
  { id: "tremiti" },
  { id: "lagol" },
] as const;

const CONS_KEYS = ["1","2","3","4","5"] as const;

const BEACH_PHOTOS = [
  "https://images.unsplash.com/photo-1768058240917-73724953455a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1785848845694-cad917aa1c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1614323777193-379d5e6797f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
];

const MARINA_PHOTO = "https://hercules-cdn.com/file_6Ks1jLA6lnPzZjGF03V6PPHX";

export default function SectionMare() {
  const { t } = useTranslation("mare");

  const beaches = BEACH_KEYS.map((b) => ({
    id: b.id,
    name: t(`beach_${b.id}_name`),
    dist: b.id === "marina" ? "" : t(`beach_${b.id}_dist`),
    desc: t(`beach_${b.id}_desc`),
    hideMap: "hideMap" in b,
  }));

  return (
    <SectionCard title={t("h_card")} emoji="🌊">

      {/* Galleria foto scorrevole */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 mb-5">
        {BEACH_PHOTOS.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-52 rounded-xl overflow-hidden shadow-md border border-[#b0d4e8]">
            <img src={src} alt="Mare Adriatico" className="w-full h-32 object-cover" />
          </div>
        ))}
      </div>

      <p className="mb-4 leading-relaxed">{t("intro_p")}</p>

      <div className="space-y-3 mb-6">
        {beaches.map((b) => (
          <div key={b.id}>
            <div className="bg-[#f0f8ff] border border-[#b0d4e8] rounded-xl overflow-hidden p-0">
              <div className="flex items-start justify-between p-4 pb-2">
                <h3 className="font-bold text-[#005580]">{b.name}</h3>
                {b.dist && (
                  <span className="text-xs bg-[#005580] text-white rounded-full px-2 py-0.5 ml-2 whitespace-nowrap">
                    {b.dist}
                  </span>
                )}
              </div>
              {b.id === "marina" && (
                <div className="mx-4 mb-3 rounded-xl overflow-hidden shadow-sm border border-[#b0d4e8]">
                  <img
                    src={MARINA_PHOTO}
                    alt="Marina di Serracapriola"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-[#333] leading-relaxed px-4 pb-4">{b.desc}</p>
              {!b.hideMap && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(b.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#005580] font-semibold hover:underline mt-1 inline-block cursor-pointer"
                >
                  {t("link_maps")}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_consigli")}</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm mb-4">
        {CONS_KEYS.map((k) => (
          <li key={k}><strong>{t(`li_c${k}_b`)}</strong> {t(`li_c${k}`)}</li>
        ))}
      </ul>
    </SectionCard>
  );
}
