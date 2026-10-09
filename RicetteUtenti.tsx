import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

export default function RicetteUtenti() {
  const { t, i18n } = useTranslation("ricetteUtenti");
  const ricette = useQuery(api.ricetteUtenti.list, {});
  const create = useMutation(api.ricetteUtenti.create);
  const [autore, setAutore] = useState("");
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [sending, setSending] = useState(false);

  const valid = autore.trim() && titolo.trim() && testo.trim().length >= 10;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSending(true);
    try {
      await create({ autore, titolo, testo });
      setTitolo("");
      setTesto("");
      toast.success(t("published"));
    } catch {
      toast.error(t("error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      <h3 className="text-xl font-black text-[#8B2500]">{t("title")}</h3>
      <p className="text-sm text-[#333]">{t("intro")}</p>

      <form onSubmit={submit} className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-2">
        <Input value={autore} onChange={(e) => setAutore(e.target.value)} placeholder={t("author")} maxLength={40} />
        <Input value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder={t("recipeName")} maxLength={80} />
        <Textarea
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder={t("recipeText")}
          rows={6}
          maxLength={5000}
        />
        <Button type="submit" disabled={sending || !valid} className="bg-[#8B2500] hover:bg-[#6d1d00] text-white font-bold">
          {sending ? <Spinner /> : t("publish")}
        </Button>
      </form>

      {ricette === undefined && <Skeleton className="h-24 w-full" />}
      {ricette?.length === 0 && <p className="text-sm text-center text-[#666]">{t("empty")}</p>}
      {ricette?.map((r) => (
        <article key={r._id} className="bg-white/95 rounded-xl p-4 border border-[#8B2500]/20 shadow">
          <h4 className="font-black text-[#8B2500]">{r.titolo}</h4>
          <p className="text-[11px] text-[#777] mb-2">
            {t("by")} {r.autore} · {new Date(r.createdAt).toLocaleDateString(i18n.language, { dateStyle: "long" })}
          </p>
          <p className="text-sm text-[#333] whitespace-pre-wrap break-words leading-relaxed">{r.testo}</p>
        </article>
      ))}
    </div>
  );
}
