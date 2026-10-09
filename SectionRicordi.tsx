import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard.tsx";
import { useMemoryPairs } from "./ricordi/use-memory-pairs.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

// Le foto restano sulla CDN e vengono ridimensionate al volo: poche decine di KB ciascuna.
const thumbUrl = (id: string) =>
  `https://hercules-cdn.com/cdn-cgi/image/w=420,quality=65,format=auto/file_${id}`;
// Originale a piena risoluzione, caricato solo quando si apre una foto.
const bigUrl = (id: string) => `https://hercules-cdn.com/file_${id}`;

type Opened = { id: string; caption: string };

export default function SectionRicordi() {
  const { t } = useTranslation("ricordi");
  const { t: tx } = useTranslation("extra");
  const pairs = useMemoryPairs();
  const [opened, setOpened] = useState<Opened | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const close = () => {
    setOpened(null);
    setZoomed(false);
  };

  return (
    <SectionCard title={t("title")} emoji="🖼️">
      <p className="mt-0 whitespace-pre-line text-sm italic leading-relaxed">{t("intro")}</p>
      <div className="space-y-6">
        {pairs.map((pair) => {
          const caption = tx("photoCaption", { year: pair.year ?? "" });
          return (
            <figure key={pair.left} className="m-0">
              <div className={pair.right ? "grid grid-cols-2 gap-2" : "flex justify-center"}>
                {[pair.left, pair.right].map((id) =>
                  id ? (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setOpened({ id, caption })}
                      aria-label={caption}
                      className={`p-0 border-0 bg-transparent cursor-zoom-in w-full ${pair.right ? "" : "max-w-[50%]"}`}
                    >
                      <img
                        src={thumbUrl(id)}
                        alt={pair.title}
                        loading="lazy"
                        decoding="async"
                        className="m-0 w-full h-40 sm:h-52 object-cover rounded-lg border border-[#e8c9a0]"
                      />
                    </button>
                  ) : null,
                )}
              </div>
              <figcaption className="mt-2 text-sm">
                <span className="font-bold text-[#8B2500]">{caption}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <Dialog open={opened !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-[96vw] sm:max-w-4xl p-2 gap-2">
          <DialogTitle className="text-sm text-[#8B2500] px-2 pt-1">{opened?.caption}</DialogTitle>
          <DialogDescription className="sr-only">{tx("photoZoomed")}</DialogDescription>
          {opened && (
            <div className="max-h-[80vh] overflow-auto rounded-md bg-black/5">
              <img
                src={bigUrl(opened.id)}
                alt={opened.caption}
                onClick={() => setZoomed((z) => !z)}
                className={`m-0 block mx-auto ${zoomed ? "max-w-none w-auto cursor-zoom-out" : "w-full max-h-[80vh] object-contain cursor-zoom-in"}`}
              />
            </div>
          )}
          <p className="text-xs text-center text-muted-foreground m-0">
            {zoomed ? tx("photoShrink") : tx("photoEnlarge")}
          </p>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
