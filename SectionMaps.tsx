import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";

const MAPS_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12160.08!2d15.1534!3d41.8105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1339e4e49c2f1c1b%3A0x2e47f5567d1f1c2b!2sSerracapriola%2C%20FG!5e0!3m2!1sit!2sit!4v1699999999999!5m2!1sit!2sit";

const NAV_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=Serracapriola,+FG,+Italia";

const POI = [
  { name: "Castello Maresca", coords: "41.8120, 15.1545", link: "https://maps.google.com/?q=Castello+Maresca+Serracapriola" },
  { name: "Municipio di Serracapriola", coords: "41.8108, 15.1528", link: "https://maps.google.com/?q=Comune+di+Serracapriola" },
  { name: "Farmacia Comunale", coords: "41.8105, 15.1520", link: "https://maps.google.com/?q=Farmacia+Serracapriola" },
  { name: "Stazione FS Serracapriola-Chieuti", coords: "41.7940, 15.1700", link: "https://maps.google.com/?q=Stazione+Serracapriola+Chieuti" },
];

export default function SectionMaps() {
  const { t } = useTranslation("maps");

  return (
    <SectionCard title={t("h_card")} emoji="🗺️">
      <p className="mb-4">{t("intro_p")}</p>

      <div className="rounded-2xl overflow-hidden border border-[#e8c9a0] shadow-md mb-5">
        <iframe
          src={MAPS_URL}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t("map_title")}
        />
      </div>

      <a
        href={NAV_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-[#8B2500] text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:bg-[#a03000] transition-colors mb-6 cursor-pointer"
      >
        {t("btn_naviga")}
      </a>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_poi")}</h2>
      <p className="mb-3 text-sm text-[#555]">{t("p_poi")}</p>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {POI.map((poi) => (
          <a
            key={poi.name}
            href={poi.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-[#fff8f0] border border-[#e8c9a0] rounded-xl px-4 py-3 hover:bg-[#fff0e0] transition-colors cursor-pointer"
          >
            <div>
              <p className="font-semibold text-[#8B2500] text-sm">{poi.name}</p>
              <p className="text-xs text-[#888]">📍 {poi.coords}</p>
            </div>
            <span className="text-[#8B2500] text-xl">→</span>
          </a>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_come")}</h2>
      <div className="space-y-4 text-sm">
        <div className="bg-[#fff8f0] rounded-xl p-4 border border-[#e8c9a0]">
          <h3 className="font-bold text-[#8B2500] mb-1">{t("p_auto_h")}</h3>
          <p>{t("p_auto_nord")}</p>
          <p className="mt-1">{t("p_auto_sud")}</p>
        </div>
        <div className="bg-[#fff8f0] rounded-xl p-4 border border-[#e8c9a0]">
          <h3 className="font-bold text-[#8B2500] mb-1">{t("p_treno_h")}</h3>
          <p>{t("p_treno")}</p>
        </div>
        <div className="bg-[#fff8f0] rounded-xl p-4 border border-[#e8c9a0]">
          <h3 className="font-bold text-[#8B2500] mb-1">{t("p_aereo_h")}</h3>
          <p>{t("p_aereo")}</p>
        </div>
      </div>
    </SectionCard>
  );
}
