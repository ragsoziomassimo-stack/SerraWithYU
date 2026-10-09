import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";
import { MapPinIcon } from "lucide-react";

type Chiesa = {
  key: string;
  mapsQuery: string;
};

const CHIESE: Chiesa[] = [
  { key: "mercurio",  mapsQuery: "San+Mercurio+Serracapriola" },
  { key: "silvis",    mapsQuery: "Santa+Maria+in+Silvis+Serracapriola" },
  { key: "cappuccini",mapsQuery: "Convento+Frati+Cappuccini+Serracapriola" },
  { key: "anna",      mapsQuery: "Sant+Anna+Serracapriola+Foggia" },
  { key: "angelo",    mapsQuery: "Sant+Angelo+Serracapriola+Foggia" },
  { key: "trinita",   mapsQuery: "Santissima+Trinita+Serracapriola" },
  { key: "grazie",    mapsQuery: "Santa+Maria+delle+Grazie+Serracapriola" },
];

const CHURCH_PHOTOS: Partial<Record<string, string>> = {
  mercurio: "https://hercules-cdn.com/file_sF01z5zaoKVEhvbaqwVIaZ21",
};

export default function SectionChiese() {
  const { t } = useTranslation("chiese");

  return (
    <SectionCard title={t("h_card")} emoji="⛪">
      <p className="mb-6 text-sm text-[#555]">{t("p_intro")}</p>

      <div className="flex flex-col gap-6">
        {CHIESE.map((c) => (
          <div key={c.key} className="rounded-xl border border-[#e8c9a0] bg-[#fff8f0] overflow-hidden shadow-sm">
            <h3 className="text-base font-bold text-[#8B2500] px-4 pt-4 mb-2">{t(`${c.key}_nome`)}</h3>
            {CHURCH_PHOTOS[c.key] && (
              <div className="px-4 mb-3">
                <img
                  src={CHURCH_PHOTOS[c.key]}
                  alt={t(`${c.key}_nome`)}
                  className="w-full rounded-xl object-cover max-h-64"
                />
              </div>
            )}
            <p className="text-sm text-[#444] px-4 mb-3">{t(`${c.key}_storia`)}</p>
            <div className="px-4 pb-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${c.mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a6fa0] hover:underline cursor-pointer"
            >
              <MapPinIcon size={13} />
              {t("link_mappa")}
            </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs italic text-[#888] text-center">{t("p_nota")}</p>
    </SectionCard>
  );
}
