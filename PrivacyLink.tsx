import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";

// Chiavi dei testi (namespace "extra"): titolo e paragrafi di ogni sezione.
const SECTIONS = [
  { title: "pGeoT", paragraphs: ["pGeo1", "pGeo2", "pGeo3"] },
  { title: "pNavT", paragraphs: ["pNav1", "pNav2"] },
  { title: "pMapsT", paragraphs: ["pMaps1"] },
] as const;

export default function PrivacyLink() {
  const { t } = useTranslation("extra");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer bg-transparent text-xs font-bold text-[#8B2500] underline"
        >
          {t("pLink")}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("pLink")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="m-0">{t("pIntro")}</p>
          {SECTIONS.map((s) => (
            <section key={s.title} className="space-y-2">
              <h3 className="m-0 text-base font-bold text-[#8B2500]">{t(s.title)}</h3>
              {s.paragraphs.map((p) => (
                <p key={p} className="m-0">
                  {t(p)}
                </p>
              ))}
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
