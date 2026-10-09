import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

const PHOTO_ID = "file_uYrTXphZ4eEoE5XY6Gx1bxul";
const THUMB_URL = `https://hercules-cdn.com/cdn-cgi/image/w=140,quality=70,format=auto/${PHOTO_ID}`;
// Originale a piena risoluzione, caricato solo all'apertura.
const BIG_URL = `https://hercules-cdn.com/${PHOTO_ID}`;
const PHOTO_ALT = "Municipio di Serracapriola";

const ROW_KEYS = [
  "segreteria", "anagrafe", "tecnico", "protocollo", "polizia", "tributi", "sociale",
] as const;

const SVC_KEYS = ["1","2","3","4","5","6"] as const;

export default function SectionComune() {
  const { t } = useTranslation("comune");
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) setZoomed(false);
  };
  return (
    <SectionCard
      title={t("h_card")}
      emoji="🏛️"
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={PHOTO_ALT}
          className="p-0 border-0 bg-transparent cursor-zoom-in shrink-0"
        >
          <img
            src={THUMB_URL}
            alt={PHOTO_ALT}
            className="m-0 h-14 w-14 rounded-lg object-cover border border-[#e8c9a0]"
          />
        </button>
      }
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[96vw] sm:max-w-4xl p-2 gap-2">
          <DialogTitle className="text-sm text-[#8B2500] px-2 pt-1">{PHOTO_ALT}</DialogTitle>
          <DialogDescription className="sr-only">{t("photoZoomed", { ns: "extra" })}</DialogDescription>
          <div className="max-h-[80vh] overflow-auto rounded-md bg-black/5">
            <img
              src={BIG_URL}
              alt={PHOTO_ALT}
              onClick={() => setZoomed((z) => !z)}
              className={`m-0 block mx-auto ${zoomed ? "max-w-none w-auto cursor-zoom-out" : "w-full max-h-[80vh] object-contain cursor-zoom-in"}`}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground m-0">
            {zoomed ? "Tocca per rimpicciolire" : "Tocca la foto per ingrandire alla dimensione originale"}
          </p>
        </DialogContent>
      </Dialog>
      <div className="bg-[#fff8f0] border border-[#e8c9a0] rounded-xl p-4 mb-5">
        <h2 className="text-lg font-bold text-[#8B2500] mb-2">{t("h_contatti")}</h2>
        <ul className="space-y-1 text-sm">
          <li>📍 <strong>{t("label_indirizzo")}</strong> {t("val_indirizzo")}</li>
          <li>📞 <strong>{t("label_tel")}</strong> {t("val_tel")}</li>
          <li>📠 <strong>{t("label_fax")}</strong> {t("val_fax")}</li>
          <li>✉️ <strong>{t("label_email")}</strong> {t("val_email")}</li>
          <li>🌐 <strong>{t("label_sito")}</strong>{" "}
            <a href="https://www.comune.serracapriola.fg.it" target="_blank" rel="noopener noreferrer" className="text-[#8B2500] hover:underline font-semibold cursor-pointer">
              {t("btn_sito")}
            </a>
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_orari")}</h2>
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#8B2500] text-white">
              <th className="p-2 text-left rounded-tl-lg">{t("th_ufficio")}</th>
              <th className="p-2 text-left">{t("th_lunven")}</th>
              <th className="p-2 text-left rounded-tr-lg">{t("th_sab")}</th>
            </tr>
          </thead>
          <tbody>
            {ROW_KEYS.map((key, i) => (
              <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-[#fff8f0]"}>
                <td className="p-2 font-semibold border-b border-[#e8c9a0]">{t(`row_${key}_uff`)}</td>
                <td className="p-2 border-b border-[#e8c9a0]">{t(`row_${key}_lv`)}</td>
                <td className="p-2 border-b border-[#e8c9a0]">{t(`row_${key}_sab`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-[#8B2500] mb-3">{t("h_servizi")}</h2>
      <div className="grid grid-cols-1 gap-3 mb-5">
        {SVC_KEYS.map((k) => (
          <div key={k} className="bg-[#fff8f0] rounded-xl p-3 border border-[#e8c9a0]">
            <p className="font-bold text-sm text-[#8B2500] mb-0.5">{t(`svc_${k}_title`)}</p>
            <p className="text-xs text-[#555]">{t(`svc_${k}_desc`)}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
