import { useTranslation } from "react-i18next";
import { Phone, MapPin, Navigation, UtensilsCrossed } from "lucide-react";
import SectionCard from "./SectionCard.tsx";
import { RESTAURANTS } from "./ristoranti/restaurants.ts";

const photoUrl = (id: string) =>
  `https://hercules-cdn.com/cdn-cgi/image/w=700,quality=70,format=auto/file_${id}`;
// Nome + indirizzo: Google Maps trova il locale e avvia il percorso dalla posizione dell'utente.
const directionsUrl = (name: string, address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${name}, ${address}, Serracapriola`)}`;
const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Serracapriola`)}`;

export default function SectionRistoranti() {
  const { t } = useTranslation("ristoranti");
  return (
    <SectionCard title={t("title")} emoji="🍝">
      <p className="mt-0 text-sm">{t("intro")}</p>
      <div className="space-y-5">
        {RESTAURANTS.map((r) => (
          <article key={r.name} className="rounded-2xl border border-[#e8c9a0] overflow-hidden bg-white">
            {r.photo ? (
              r.photoFit ? (
                <div className="flex justify-center bg-[#fff0e6]">
                  <img src={photoUrl(r.photo)} alt={r.name} loading="lazy" className="m-0 h-64 w-auto max-w-full object-contain" />
                </div>
              ) : (
                <img src={photoUrl(r.photo)} alt={r.name} loading="lazy" className="m-0 w-full h-44 object-cover" />
              )
            ) : (
              <div className="h-44 flex flex-col items-center justify-center gap-1 bg-[#fff0e6] text-[#8B2500]">
                <span className="text-6xl leading-none">🍝</span>
                <span className="text-xs">{t("noPhoto")}</span>
              </div>
            )}
            <div className="p-4 space-y-2">
              <h2 className="m-0 text-lg font-bold text-[#8B2500]">{r.name}</h2>
              <p className="m-0 text-sm flex items-center gap-2">
                <UtensilsCrossed className="size-4 shrink-0" /> {r.kind}
              </p>
              <a href={mapsUrl(r.address)} target="_blank" rel="noreferrer" className="text-sm flex items-center gap-2 no-underline text-[#333]">
                <MapPin className="size-4 shrink-0" /> {r.address}
              </a>
              {r.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="text-sm flex items-center gap-2 no-underline text-[#333] font-semibold">
                  <Phone className="size-4 shrink-0" /> {p}
                </a>
              ))}
              <a
                href={directionsUrl(r.name, r.address)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-[#8B2500] px-4 py-1.5 text-sm font-bold text-white no-underline"
              >
                <Navigation className="size-4" /> Indicazioni
              </a>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
