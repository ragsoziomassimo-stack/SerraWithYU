import { useTranslation } from "react-i18next";
import { ExternalLink, Building2 } from "lucide-react";
import SectionCard from "./SectionCard.tsx";

const PORTAL_LINKS = [
  {
    key: "immobiliareVendita",
    url: "https://www.immobiliare.it/vendita-case/serracapriola/",
  },
  {
    key: "immobiliareAffitto",
    url: "https://www.immobiliare.it/affitto-case/serracapriola/",
  },
  {
    key: "idealistaVendita",
    url: "https://www.idealista.it/vendita-case/serracapriola-foggia/",
  },
  {
    key: "idealistaAffitto",
    url: "https://www.idealista.it/affitto-case/serracapriola-foggia/",
  },
  {
    key: "casaIt",
    url: "https://www.casa.it/vendita/residenziale/serracapriola/",
  },
  {
    key: "subitoIt",
    url: "https://www.subito.it/annunci-puglia/vendita/immobili/foggia/serracapriola/",
  },
] as const;

export default function SectionCase() {
  const { t } = useTranslation("case");

  return (
    <SectionCard title={t("h_card")} emoji="🏠">
      <p className="flex items-center gap-2 text-sm font-bold text-[#8B2500] mb-1">
        <Building2 size={16} /> {t("portalsTitle")}
      </p>
      <p className="text-xs text-[#666] mb-4">{t("portalsIntro")}</p>
      <div className="grid grid-cols-1 gap-2">
        {PORTAL_LINKS.map((portal) => (
          <a
            key={portal.key}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 bg-white/90 border border-[#e8c9a0] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8B2500] hover:bg-[#fff0e6] transition-colors cursor-pointer"
          >
            <span>{t(`portal.${portal.key}`)}</span>
            <ExternalLink size={15} className="opacity-60 flex-shrink-0" />
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
