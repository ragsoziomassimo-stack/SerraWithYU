import { ExternalLink, BedDouble, Phone, Mail, MapPin, Globe, Navigation, Car, Train, Plane, ParkingSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

type Struttura = {
  nome: string;
  tipo: string;
  indirizzo: string;
  gps: string;
  telefono?: string;
  email?: string;
  sito?: string;
  booking?: string;
  descKey: string;
  colore: string;
};

const STRUTTURE: Struttura[] = [
  {
    nome: "Residenza Gonzaga",
    tipo: "B&B",
    indirizzo: "Via Sant'Anna 18, Serracapriola (FG)",
    gps: "https://www.google.com/maps/search/?api=1&query=41.8094,15.1578",
    telefono: "+39 334 291 1706",
    email: "inforesidenzagonzaga@gmail.com",
    sito: "https://www.residenzagonzaga.it",
    booking: "https://www.booking.com/hotel/it/residenza-gonzaga.it.html",
    descKey: "gonzaga_desc",
    colore: "#8B2500",
  },
  {
    nome: "B&B Un Raggio di Sole",
    tipo: "B&B",
    indirizzo: "Corso Giuseppe Garibaldi 96, Serracapriola (FG)",
    gps: "https://www.google.com/maps/search/?api=1&query=41.8087,15.1582",
    telefono: "+39 339 455 1488",
    sito: "https://www.bebunraggiodisole.it",
    booking: "https://www.booking.com/hotel/it/b-amp-b-un-raggio-di-sole.it.html",
    descKey: "raggio_desc",
    colore: "#c87000",
  },
  {
    nome: "La Terrazza sul Borgo",
    tipo: "B&B",
    indirizzo: "Corso Giuseppe Garibaldi 78, Serracapriola (FG)",
    gps: "https://www.google.com/maps/search/?api=1&query=41.8088,15.1580",
    telefono: "+39 346 686 2325",
    booking: "https://www.booking.com/hotel/it/la-terrazza-sul-borgo-serracapriola.html",
    descKey: "terrazza_desc",
    colore: "#2a6fa8",
  },
  {
    nome: "Dimora Fiorita",
    tipo: "Guest House",
    indirizzo: "Via Imbriani 7, Serracapriola (FG)",
    gps: "https://www.google.com/maps/search/?api=1&query=41.8090,15.1575",
    telefono: "+39 320 674 2225",
    email: "info@dimorafiorita.it",
    sito: "https://www.dimorafiorita.it",
    booking: "https://www.booking.com/hotel/it/dimora-fiorita.it.html",
    descKey: "dimora_desc",
    colore: "#2a8a5a",
  },
  {
    nome: "La Casa di MaGioLò",
    tipo: "B&B",
    indirizzo: "Via Nino Bixio 13, Serracapriola (FG)",
    gps: "https://www.google.com/maps/search/?api=1&query=41.8086,15.1577",
    booking: "https://www.booking.com/hotel/it/la-casa-di-magiolo.it.html",
    descKey: "magiolo_desc",
    colore: "#6a2a8a",
  },
];

export default function SectionHotel() {
  const { t } = useTranslation("hotel");
  return (
    <div className="max-w-2xl mx-auto py-6 px-2 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-14 h-14 rounded-full bg-[#8B2500]/10 flex items-center justify-center">
          <BedDouble className="w-7 h-7 text-[#8B2500]" />
        </div>
        <h2 className="text-2xl font-black text-[#8B2500]">Hotel & B&B</h2>
        <p className="text-sm text-[#555] max-w-xs">{t("subtitle")}</p>
      </div>

      {/* Schede strutture */}
      <div className="flex flex-col gap-4">
        {STRUTTURE.map((s) => (
          <div
            key={s.nome}
            className="rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: s.colore + "33" }}
          >
            {/* Intestazione */}
            <div
              className="px-5 py-3 flex items-center gap-3"
              style={{ background: s.colore + "12" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.colore + "20" }}
              >
                <BedDouble className="w-4 h-4" style={{ color: s.colore }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm leading-tight" style={{ color: s.colore }}>{s.nome}</p>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ background: s.colore + "20", color: s.colore }}
                >
                  {s.tipo}
                </span>
              </div>
            </div>

            {/* Corpo */}
            <div className="px-5 py-4 bg-white flex flex-col gap-2.5">
              <p className="text-sm text-[#444] leading-relaxed">{t(s.descKey)}</p>

              {/* Indirizzo + GPS */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 text-xs text-[#666]">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B2500]/60" />
                  <span>{s.indirizzo}</span>
                </div>
                <a
                  href={s.gps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: s.colore + "18", color: s.colore }}
                >
                  <Navigation className="w-3 h-3" />
                  GPS
                </a>
              </div>

              {/* Telefono */}
              {s.telefono && (
                <a
                  href={`tel:${s.telefono.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-xs font-semibold cursor-pointer hover:underline"
                  style={{ color: s.colore }}
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  {s.telefono}
                </a>
              )}

              {/* Email */}
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-2 text-xs cursor-pointer hover:underline text-[#555]"
                >
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: s.colore }} />
                  {s.email}
                </a>
              )}

              {/* Link sito e booking */}
              <div className="flex flex-wrap gap-2 mt-1">
                {s.sito && (
                  <a
                    href={s.sito}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-80"
                    style={{ background: s.colore + "15", color: s.colore }}
                  >
                    <Globe className="w-3 h-3" />
                    {t("official_site")}
                  </a>
                )}
                {s.booking && (
                  <a
                    href={s.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#003580]/10 text-[#003580] cursor-pointer hover:bg-[#003580]/20 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Booking.com
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info turistica */}
      <div className="rounded-xl bg-[#8B2500]/5 border border-[#8B2500]/15 px-5 py-4 flex flex-col gap-4">
        <div>
          <p className="font-black text-[#8B2500] mb-1">{t("how_to_reach_title")}</p>
          <p className="text-sm text-[#444] leading-relaxed">{t("how_to_reach_text")}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-[#8B2500]">{t("how_to_reach_car_h")}</p>
          <div className="flex items-start gap-2 text-xs text-[#555] leading-relaxed">
            <Car className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B2500]/60" />
            <span>{t("how_to_reach_car_north")}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-[#555] leading-relaxed">
            <Car className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B2500]/60" />
            <span>{t("how_to_reach_car_south")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-[#8B2500]">{t("how_to_reach_train_h")}</p>
          <div className="flex items-start gap-2 text-xs text-[#555] leading-relaxed">
            <Train className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B2500]/60" />
            <span>{t("how_to_reach_train_text")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-[#8B2500]">{t("how_to_reach_plane_h")}</p>
          <div className="flex items-start gap-2 text-xs text-[#555] leading-relaxed">
            <Plane className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B2500]/60" />
            <span>{t("how_to_reach_plane_text")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-[#8B2500]">{t("how_to_reach_parking_h")}</p>
          <div className="flex items-start gap-2 text-xs text-[#555] leading-relaxed">
            <ParkingSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B2500]/60" />
            <span>{t("how_to_reach_parking_text")}</span>
          </div>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=41.8087,15.1580"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-[#8B2500] text-white cursor-pointer hover:bg-[#6f1c00] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          {t("navigate_btn")}
        </a>
      </div>
    </div>
  );
}

