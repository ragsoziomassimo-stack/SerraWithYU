import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Bell, BellOff, ImagePlus, X } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { usePushNotifications } from "@/hooks/use-push-notifications.ts";
import { compressImage } from "@/lib/image-compression.ts";
import { isFreshAlert } from "@/lib/youalert.ts";
import FlashingSiren from "./FlashingSiren.tsx";

const MAX_PHOTOS = 2;

export default function SectionYouAlert() {
  const { t, i18n } = useTranslation("youalert");
  const alerts = useQuery(api.youalert.list, {});
  const create = useMutation(api.youalert.create);
  const push = usePushNotifications();
  const generateUploadUrl = useMutation(api.youalert.generateUploadUrl);
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [testo, setTesto] = useState("");
  const [sending, setSending] = useState(false);

  // Solo il più recente lampeggia, se pubblicato nelle ultime 24 ore
  const freshId = alerts?.[0] && isFreshAlert(alerts[0].createdAt) ? alerts[0]._id : null;

  const addFiles = (list: FileList | null) => {
    const images = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    if (files.length + images.length > MAX_PHOTOS) toast.error(t("maxPhotos"));
    setFiles([...files, ...images].slice(0, MAX_PHOTOS));
    if (fileInput.current) fileInput.current.value = "";
  };

  const upload = async (file: File) => {
    const res = await fetch(await generateUploadUrl(), {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: await compressImage(file),
    });
    if (!res.ok) throw new Error("upload");
    const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
    return storageId;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testo.trim().length < 3) return;
    setSending(true);
    try {
      const storageIds = await Promise.all(files.map(upload));
      await create({ testo, storageIds });
      setTesto("");
      setFiles([]);
      toast.success(t("published"));
    } catch {
      toast.error(t("error"));
    } finally {
      setSending(false);
    }
  };

  const enablePush = async () => {
    const ok = await push.subscribe();
    if (ok) toast.success(t("pushOn"));
    else toast.error(t("pushFail"));
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(i18n.language, { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="flex flex-col gap-3 pt-3 pb-2">
      <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow">
        <h2 className="text-xl font-black text-[#8B2500] mb-1 flex items-center gap-2">
          <span>🚨</span> YouAlert
        </h2>
        <p className="whitespace-pre-line text-sm text-[#333]">{t("intro")}</p>
      </div>

      {push.status !== "unsupported" && (
        <div className="bg-white/90 rounded-xl p-3 border border-[#8B2500]/20 shadow flex items-center gap-3">
          <p className="flex-1 text-xs text-[#555]">
            {push.status === "iframe"
              ? t("pushIframe")
              : push.status === "denied"
                ? t("pushDenied")
                : push.status === "subscribed"
                  ? t("pushActive")
                  : t("pushAsk")}
          </p>
          {push.status === "unsubscribed" && (
            <Button size="sm" onClick={() => void enablePush()} className="bg-[#8B2500] hover:bg-[#6d1d00] text-white">
              <Bell className="w-4 h-4" /> {t("pushEnable")}
            </Button>
          )}
          {push.status === "subscribed" && (
            <Button size="sm" variant="ghost" onClick={() => void push.unsubscribe()} className="text-[#8B2500]">
              <BellOff className="w-4 h-4" /> {t("pushDisable")}
            </Button>
          )}
          {push.status === "loading" && <Spinner />}
        </div>
      )}

      <form onSubmit={submit} className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-2">
        <p className="text-sm font-bold text-[#8B2500]">{t("newAlert")}</p>
        <Textarea
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder={t("text")}
          maxLength={500}
          rows={3}
        />
        <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <div className="flex flex-wrap items-center gap-2">
          {files.map((f, i) => (
            <div key={f.name + i} className="relative size-16 overflow-hidden rounded-lg border">
              <img src={URL.createObjectURL(f)} alt="" className="size-full object-cover" />
              <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="absolute right-0 top-0 cursor-pointer rounded-bl bg-black/70 p-0.5 text-white">
                <X className="size-3" />
              </button>
            </div>
          ))}
          {files.length < MAX_PHOTOS && (
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
              <ImagePlus className="size-4" /> {t("addPhotos")}
            </Button>
          )}
        </div>
        <Button type="submit" disabled={sending || testo.trim().length < 3} className="bg-red-600 hover:bg-red-700 text-white font-bold">
          {sending ? <Spinner /> : t("publish")}
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        {alerts === undefined && <Skeleton className="h-24 w-full" />}
        {alerts?.length === 0 && (
          <p className="text-sm text-center text-[#666] bg-white/90 rounded-xl p-4">{t("empty")}</p>
        )}
        {alerts?.map((a) => (
          <div
            key={a._id}
            className="bg-white/95 rounded-xl p-3 border border-[#8B2500]/20 shadow flex items-start gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-[#8B2500] mb-1">{fmt(a.createdAt)}</div>
              <p className="text-sm text-[#333] whitespace-pre-wrap break-words">{a.testo}</p>
              {a.photos.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {a.photos.map((url) => url && (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="block size-24 overflow-hidden rounded-lg border">
                      <img src={url} alt="" loading="lazy" className="size-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <FlashingSiren flashing={a._id === freshId} className="text-2xl shrink-0" />
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-white/90 p-3 text-center text-xs font-semibold leading-snug text-[#8B2500]">{t("disclaimer")}</p>
    </div>
  );
}
