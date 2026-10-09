import { useTranslation } from "react-i18next";
import WebcamUserLinks from "./WebcamUserLinks.tsx";
import SectionCard from "./SectionCard.tsx";
import { VideoIcon, ExternalLinkIcon } from "lucide-react";

const WEBCAM_LINKS = [
  "https://soluzionielettriche.emanuelevalentino.com/webcam-serracapriola",
  "https://www.comune.serracapriola.fg.it",
] as const;

export default function SectionWebcam() {
  const { t, i18n } = useTranslation("webcam");

  const cams = [
    { nome: t("cam1_nome"), nota: t("cam1_nota"), link: WEBCAM_LINKS[0] },
    { nome: t("cam2_nome"), nota: t("cam2_nota"), link: WEBCAM_LINKS[1] },
  ];

  return (
    <SectionCard key={i18n.language} title={t("h_card")} emoji="📷">
      <p className="mb-5 text-sm text-[#555]">{t("p_intro")}</p>

      <div className="flex flex-col gap-4">
        {cams.map((cam) => (
          <a
            key={cam.nome}
            href={cam.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-[#fff8f0] border border-[#e8c9a0] rounded-xl px-4 py-4 hover:bg-[#fff0e0] transition-colors cursor-pointer"
          >
            <VideoIcon className="text-[#8B2500] mt-0.5 shrink-0" size={22} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#8B2500] text-sm leading-tight mb-0.5">{cam.nome}</p>
              {cam.nota && <p className="text-xs text-[#888]">{cam.nota}</p>}
            </div>
            <ExternalLinkIcon size={14} className="text-[#8B2500]/60 shrink-0 mt-1" />
          </a>
        ))}
      </div>

      <p className="mt-6 text-xs italic text-[#888] text-center">{t("p_nota")}</p>

      <WebcamUserLinks />
    </SectionCard>
  );
}
