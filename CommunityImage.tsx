import { useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { ImagePlus, ShieldCheck } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { compressImage } from "@/lib/image-compression.ts";

/** Immagine unica di comunità: chiunque può sostituirla, previo controllo automatico AI. */
export default function CommunityImage() {
  const { t } = useTranslation("common");
  const current = useQuery(api.comunita.current, {});
  const generateUploadUrl = useMutation(api.comunita.generateUploadUrl);
  const submit = useAction(api.comunita.submit);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (input.current) input.current.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("communityNotImage"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(await generateUploadUrl(), {
        method: "POST",
        headers: { "Content-Type": "image/jpeg" },
        body: await compressImage(file),
      });
      if (!res.ok) throw new Error("upload");
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      await submit({ storageId });
      toast.success(t("communityOk"));
    } catch (e) {
      const reason = e instanceof ConvexError ? (e.data as { message?: string }).message : undefined;
      toast.error(reason ? `${t("communityRejected")} ${reason}` : t("communityError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {current?.url && (
        <img src={current.url} alt={t("communityAlt")} loading="lazy" className="w-full max-w-sm rounded-xl border border-[#8B2500]/20 shadow-md" />
      )}
      <p className="text-sm leading-relaxed text-[#444]">{t("communityIntro")}</p>
      <p className="text-sm font-bold text-[#8B2500]">{t("communityNoAds")}</p>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
      <Button disabled={busy} onClick={() => input.current?.click()} className="bg-[#8B2500] text-white hover:bg-[#6d1d00]">
        {busy ? <Spinner /> : <ImagePlus className="size-4" />} {busy ? t("communityChecking") : t("communityButton")}
      </Button>
      <div className="w-full max-w-sm rounded-xl border border-[#8B2500]/20 bg-white/80 p-3 text-left">
        <p className="m-0 flex items-center gap-2 text-sm font-bold text-[#8B2500]">
          <ShieldCheck className="size-4" /> {t("moderatorTitle")}
        </p>
        <p className="m-0 mt-1 text-xs leading-snug text-[#555]">{t("moderatorText1")}</p>
        <p className="m-0 text-xs leading-snug text-[#555]">{t("moderatorText2")}</p>
      </div>
    </div>
  );
}
