import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Vote, Briefcase, Ship, Package, History, ChevronRight } from "lucide-react";
import SectionCard from "./SectionCard.tsx";

// Dati raccolti dall'ultima Supermedia YouTrend/AGI disponibile (ottobre 2026).
// Da aggiornare ogni 6 mesi con la rilevazione più recente.
const SONDAGGI_DATA = [
  { partito: "FDI", valore: 28, colore: "#0b4f8a" },
  { partito: "PD", valore: 21.0, colore: "#e2231a" },
  { partito: "M5S", valore: 12.1, colore: "#ffc408" },
  { partito: "FN", valore: 7.6, colore: "#3f5b3a" },
  { partito: "FI", valore: 7.6, colore: "#1e88c7" },
  { partito: "AVS", valore: 6.3, colore: "#8bc53f" },
  { partito: "Lega", valore: 5.6, colore: "#0d6e34" },
  { partito: "Azione", valore: 3.7, colore: "#e8752c" },
  { partito: "IV", valore: 2.4, colore: "#6d4c9f" },
  { partito: "+Eu", valore: 1.4, colore: "#f5a623" },
  { partito: "NM", valore: 1.0, colore: "#7a7a7a" },
];

// Occupati in Italia (milioni), dati ISTAT — Rilevazione forze di lavoro.
// Serie: media 2022, media 2023, media 2024, media 2025, dato più recente (luglio 2026).
const LAVORO_DATA = [
  { anno: "2022", occupati: 23.1 },
  { anno: "2023", occupati: 23.58 },
  { anno: "2024", occupati: 23.93 },
  { anno: "2025", occupati: 24.1 },
  { anno: "2026*", occupati: 24.37 },
];

// Sbarchi migranti via mare — totali annui, Ministero dell'Interno (Cruscotto statistico).
// Il 2026 è parziale (dato aggiornato a fine maggio 2026).
const SBARCHI_DATA = [
  { anno: "2022", sbarchi: 105131 },
  { anno: "2023", sbarchi: 157651 },
  { anno: "2024", sbarchi: 66617 },
  { anno: "2025", sbarchi: 66296 },
  { anno: "2026*", sbarchi: 10817 },
];

// Export italiano di beni (miliardi di euro) — ISTAT, Commercio con l'estero.
// Il 2026 è una stima (previsione SACE, luglio 2026).
const EXPORT_DATA = [
  { anno: "2022", export: 626.2 },
  { anno: "2023", export: 626.2 },
  { anno: "2024", export: 623.5 },
  { anno: "2025", export: 643 },
  { anno: "2026*", export: 656 },
];

function ChartBlock({
  icon,
  title,
  desc,
  fonte,
  below,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  fonte: string;
  below?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8c9a0] p-4 shadow-sm mb-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="text-base font-bold text-[#8B2500]">{title}</h3>
      </div>
      {desc && <p className="text-xs text-[#666] mb-3">{desc}</p>}
      <div className="h-56 w-full">{children}</div>
      {below}
      <p className="text-[10px] text-muted-foreground mt-2 italic">{fonte}</p>
    </div>
  );
}

export default function SectionSondaggi({ onNavigateStorico }: { onNavigateStorico: () => void }) {
  const { t } = useTranslation("sondaggi");

  return (
    <SectionCard title={t("titolo")} emoji="📊">
      <p className="text-sm text-[#555] mb-4">{t("intro")}</p>

      {/* Sondaggi politici nazionali — YouTrend */}
      <ChartBlock
        icon={<Vote className="w-4 h-4 text-[#8B2500]" />}
        title={t("sondaggi_sezione")}
        desc={t("sondaggi_asse")}
        fonte={t("sondaggi_fonte")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SONDAGGI_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="partito" tick={{ fontSize: 11, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} unit="%" />
            <Tooltip
              formatter={(value) => [`${value}%`, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Bar dataKey="valore" radius={[6, 6, 0, 0]}>
              {SONDAGGI_DATA.map((d) => (
                <Cell key={d.partito} fill={d.colore} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* Separatore sezione ISTAT */}
      <div className="flex items-center gap-2 mt-6 mb-3">
        <div className="h-px flex-1 bg-[#e8c9a0]" />
        <span className="text-xs font-bold text-[#8B2500] uppercase tracking-wide whitespace-nowrap">
          {t("istat_sezione")}
        </span>
        <div className="h-px flex-1 bg-[#e8c9a0]" />
      </div>

      {/* 1. Nuovi posti di lavoro */}
      <ChartBlock
        icon={<Briefcase className="w-4 h-4 text-[#8B2500]" />}
        title={t("lavoro_titolo")}
        desc={t("lavoro_desc")}
        fonte={t("lavoro_fonte")}
      >
        <p className="text-center text-sm font-bold text-black uppercase mb-2">
          1.306.000 nuovi posti di lavoro
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={LAVORO_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 11, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} domain={[22, 25]} unit="M" />
            <Tooltip
              formatter={(value) => [`${value} M`, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Line type="monotone" dataKey="occupati" stroke="#0d6e34" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* 2. Sbarchi migranti */}
      <ChartBlock
        icon={<Ship className="w-4 h-4 text-[#8B2500]" />}
        title={t("sbarchi_titolo")}
        desc={t("sbarchi_desc")}
        fonte={t("sbarchi_fonte")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SBARCHI_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 11, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} />
            <Tooltip
              formatter={(value) => [typeof value === "number" ? value.toLocaleString("it-IT") : value, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Bar dataKey="sbarchi" radius={[6, 6, 0, 0]} fill="#1e88c7" />
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* 3. Export */}
      <ChartBlock
        icon={<Package className="w-4 h-4 text-[#8B2500]" />}
        title={t("export_titolo")}
        fonte={t("export_fonte")}
        below={
          <p className="text-center text-sm font-bold text-black uppercase mt-4 leading-relaxed">
            Valore delle esportazioni italiane di beni (miliardi di euro). L'Italia ha superato il Giappone ed è il 4° esportatore al mondo.
          </p>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={EXPORT_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 11, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} unit=" Mld€" domain={[600, 680]} />
            <Tooltip
              formatter={(value) => [`${value} Mld€`, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Bar dataKey="export" radius={[6, 6, 0, 0]} fill="#8bc53f" />
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* Link storico sondaggi precedenti */}
      <button
        type="button"
        onClick={onNavigateStorico}
        className="w-full flex items-center justify-between gap-2 bg-[#8B2500] text-white rounded-xl p-4 mt-16 cursor-pointer hover:bg-[#6e1c00] transition-colors shadow-sm"
      >
        <span className="flex items-center gap-2 font-bold uppercase text-sm">
          <History className="w-4 h-4" />
          {t("storico_link")}
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </SectionCard>
  );
}
