import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquarePlus, Send, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { formatDistanceToNow } from "date-fns";
import { it, de, enUS, fr, bg, es } from "date-fns/locale";
import type { Locale } from "date-fns";
import { useTranslation as useT } from "react-i18next";

const CATEGORIES = [
  { key: "viabilita", emoji: "🛣️" },
  { key: "verde", emoji: "🌿" },
  { key: "illuminazione", emoji: "💡" },
  { key: "rifiuti", emoji: "🗑️" },
  { key: "proposta", emoji: "💬" },
  { key: "altro", emoji: "📋" },
];

const DATE_LOCALES: Record<string, Locale> = {
  it, de, en: enUS, fr, bg, es,
};

function TimeAgo({ isoDate }: { isoDate: string }) {
  const { i18n } = useT();
  const locale = DATE_LOCALES[i18n.language] ?? enUS;
  return (
    <span className="text-xs text-[#aaa]">
      {formatDistanceToNow(new Date(isoDate), { addSuffix: true, locale })}
    </span>
  );
}

function SegnalazioneCard({ s }: { s: { _id: string; _creationTime: number; categoria: string; nome: string; testo: string } }) {
  const { t } = useTranslation("segnalazioni");
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES.find((c) => c.key === s.categoria);
  const preview = s.testo.length > 120 && !expanded ? s.testo.slice(0, 120) + "…" : s.testo;

  return (
    <div className="bg-white rounded-xl border border-[#e8c9a0] p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#8B2500] bg-[#fff0e6] px-2.5 py-1 rounded-full">
          <span>{cat?.emoji ?? "📋"}</span>
          {t(`cat_${s.categoria}`)}
        </span>
        <TimeAgo isoDate={new Date(s._creationTime).toISOString()} />
      </div>
      <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap">{preview}</p>
      {s.testo.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[#8B2500] font-semibold cursor-pointer hover:underline"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? t("leggi_meno") : t("leggi_tutto")}
        </button>
      )}
      <p className="text-xs text-[#888] font-semibold">— {s.nome || t("anonimo")}</p>
    </div>
  );
}

export default function SectionSegnalazioni() {
  const { t } = useTranslation("segnalazioni");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const segnalazioni = useQuery(api.segnalazioni.list);
  const create = useMutation(api.segnalazioni.create);

  const handleSend = async () => {
    if (!category || !text.trim()) {
      toast.error(t("errore_campi"));
      return;
    }
    await create({ categoria: category, nome: name.trim() || t("anonimo"), testo: text.trim() });
    toast.success(t("inviato"));
    setCategory("");
    setName("");
    setText("");
    setShowForm(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <MessageSquarePlus className="w-9 h-9 text-[#8B2500] mx-auto" />
        <h2 className="text-2xl font-bold text-[#8B2500] font-cursive">{t("titolo")}</h2>
        <p className="text-sm text-[#555]">{t("descrizione")}</p>
      </div>

      {/* Bottone apri form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B2500] text-white font-bold text-sm shadow hover:bg-[#6e1c00] transition-colors cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          {t("nuova_segnalazione")}
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-[#fffaf6] border border-[#e8c9a0] rounded-xl p-4 space-y-4">
          {/* Categoria */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#8B2500] uppercase tracking-wide">{t("scegli_categoria")}</p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition-all text-xs font-semibold cursor-pointer
                    ${category === c.key
                      ? "border-[#8B2500] bg-[#8B2500] text-white shadow-md scale-105"
                      : "border-[#e8c9a0] bg-white text-[#8B2500] hover:bg-[#fff0e6]"
                    }`}
                >
                  <span className="text-lg">{c.emoji}</span>
                  <span>{t(`cat_${c.key}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#8B2500] uppercase tracking-wide">{t("label_nome_opt")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("placeholder_nome")}
              className="w-full rounded-xl border border-[#e8c9a0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]/40 bg-white"
            />
          </div>

          {/* Testo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#8B2500] uppercase tracking-wide">{t("label_messaggio")}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("placeholder_messaggio")}
              rows={4}
              className="w-full rounded-xl border border-[#e8c9a0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]/40 bg-white resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#e8c9a0] text-[#8B2500] font-semibold text-sm cursor-pointer hover:bg-[#fff0e6] transition-colors"
            >
              {t("annulla")}
            </button>
            <button
              onClick={handleSend}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#8B2500] text-white font-bold text-sm shadow hover:bg-[#6e1c00] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {t("pubblica")}
            </button>
          </div>
        </div>
      )}

      {/* Lista segnalazioni */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-[#8B2500] uppercase tracking-wide">{t("lista_titolo")}</p>
        {segnalazioni === undefined ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : segnalazioni.length === 0 ? (
          <div className="text-center py-10 text-[#aaa] text-sm">{t("nessuna")}</div>
        ) : (
          segnalazioni.map((s) => <SegnalazioneCard key={s._id} s={s} />)
        )}
      </div>
    </div>
  );
}
