import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ExternalLinkIcon, PlayCircle, RadioIcon, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { getStoredProgrammerPassword, useProgrammerSpace } from "@/hooks/use-programmer-space.ts";

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Collegamenti a video di altri siti, pubblicabili da tutti con un titolo. */
export default function WebcamUserLinks() {
  const { t } = useTranslation("webcam");
  const links = useQuery(api.webcamLinks.list, {});
  const create = useMutation(api.webcamLinks.create);
  const remove = useMutation(api.webcamLinks.remove);
  const { unlocked } = useProgrammerSpace();
  const [titolo, setTitolo] = useState("");
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fixed = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    setSending(true);
    try {
      await create({ titolo, url: fixed });
      setTitolo("");
      setUrl("");
      toast.success(t("ul_ok"));
    } catch {
      toast.error(t("ul_bad"));
    } finally {
      setSending(false);
    }
  };

  const del = async (id: Id<"webcam_links">) => {
    try {
      await remove({ id, password: getStoredProgrammerPassword() });
    } catch {
      toast.error(t("ul_err"));
    }
  };

  return (
    <div className="mt-8 border-t border-[#e8c9a0] pt-5">
      <h3 className="mb-1 text-base font-bold text-[#8B2500]">{t("ul_h")}</h3>
      <p className="mb-3 text-sm text-[#555]">{t("ul_intro")}</p>

      <form onSubmit={submit} className="mb-4 flex flex-col gap-2">
        <Input value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder={t("ul_title")} maxLength={80} />
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("ul_url")} maxLength={500} inputMode="url" />
        <Button type="submit" disabled={sending || !titolo.trim() || !url.trim()} className="bg-[#8B2500] text-white hover:bg-[#6d1d00]">
          {sending ? <Spinner /> : t("ul_publish")}
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        {links === undefined && <Skeleton className="h-14 w-full" />}
        {links?.length === 0 && <p className="text-center text-sm text-[#888]">{t("ul_empty")}</p>}
        {links?.map((l) => (
          <div key={l._id} className="flex items-center gap-2 rounded-xl border border-[#e8c9a0] bg-[#fff8f0] px-3 py-3">
            <a href={l.url} target="_blank" rel="noopener noreferrer nofollow ugc" className="flex min-w-0 flex-1 items-center gap-3 no-underline cursor-pointer">
              <PlayCircle className="shrink-0 text-[#8B2500]" size={22} />
              <div className="min-w-0 flex-1">
                <p className="m-0 break-words text-sm font-semibold leading-tight text-[#8B2500]">{l.titolo}</p>
                <p className="m-0 truncate text-xs text-[#888]">{hostOf(l.url)}</p>
              </div>
              <ExternalLinkIcon size={14} className="shrink-0 text-[#8B2500]/60" />
            </a>
            {unlocked && (
              <Button size="icon" variant="ghost" onClick={() => void del(l._id)} className="shrink-0 text-red-600">
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] italic text-[#888]">{t("ul_warn")}</p>

      <div className="mt-6 rounded-xl border border-[#e8c9a0] bg-[#fff8f0] p-4 text-center">
        <p className="mb-3 text-sm text-[#555]">{t("live_hint")}</p>
        <Button asChild className="bg-[#1877F2] text-white hover:bg-[#145dbf]">
          <a href="https://www.facebook.com/live/producer" target="_blank" rel="noopener noreferrer">
            <RadioIcon className="size-4" /> {t("live_btn")}
          </a>
        </Button>
        <p className="mt-3 text-[11px] text-[#888]">{t("live_steps")}</p>
      </div>
    </div>
  );
}
