import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Briefcase, Ship, TrendingUp, Package, ArrowLeft } from "lucide-react";
import SectionCard from "./SectionCard.tsx";

// Dati storici relativi ai governi Conte I e Conte II (giugno 2018 - febbraio 2021),
// raccolti da serie storiche ISTAT.
// Sezione di archivio, non necessita di aggiornamento periodico.

// Occupati in Italia (milioni) — ISTAT, media annua, periodo Conte I-II.
const LAVORO_DATA = [
  { anno: "2018", occupati: 23.21 },
  { anno: "2019", occupati: 23.36 },
  { anno: "2020", occupati: 22.86 },
  { anno: "Feb 2021", occupati: 22.63 },
];

// Sbarchi migranti via mare — totali annui, Ministero dell'Interno (Cruscotto statistico), 2013-2023.
const SBARCHI_DATA = [
  { anno: "2013", sbarchi: 22118, evidenzia: false },
  { anno: "2014", sbarchi: 66066, evidenzia: false },
  { anno: "2015", sbarchi: 103792, evidenzia: false },
  { anno: "2016", sbarchi: 176554, evidenzia: false },
  { anno: "2017", sbarchi: 183681, evidenzia: false },
  { anno: "2018", sbarchi: 135858, evidenzia: false },
  { anno: "2019", sbarchi: 91424, evidenzia: false },
  { anno: "2020", sbarchi: 79938, evidenzia: false },
  { anno: "2021", sbarchi: 78421, evidenzia: false },
  { anno: "2022", sbarchi: 107268, evidenzia: false },
  { anno: "15/04/2023", sbarchi: 114972, evidenzia: true },
];

// Spread BTP-Bund (punti base) — andamento storico 2013-2023, Banca d'Italia / MEF.
const SPREAD_DATA = [
  { anno: "2013", spread: 280 },
  { anno: "2014", spread: 160 },
  { anno: "2015", spread: 105 },
  { anno: "2016", spread: 130 },
  { anno: "2017", spread: 165 },
  { anno: "2018", spread: 290 },
  { anno: "2019", spread: 160 },
  { anno: "2020", spread: 175 },
  { anno: "2021", spread: 100 },
  { anno: "2022", spread: 210 },
  { anno: "2023*", spread: 245 },
];

// Export italiano di beni (miliardi di euro) — ISTAT, Commercio con l'estero, periodo Conte I-II.
const EXPORT_DATA = [
  { anno: "2018", export: 464.9 },
  { anno: "2019", export: 476.8 },
  { anno: "2020", export: 419.9 },
];

function ChartBlock({
  icon,
  title,
  desc,
  fonte,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  fonte: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8c9a0] p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="text-base font-bold text-[#8B2500]">{title}</h3>
      </div>
      {desc && <p className="text-xs text-[#666] mb-3">{desc}</p>}
      <div className="h-56 w-full">{children}</div>
      <p className="text-[10px] text-muted-foreground mt-2 italic">{fonte}</p>
    </div>
  );
}

export default function SectionSondaggiStorico({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation("sondaggi");

  return (
    <SectionCard title={t("storico_titolo")} emoji="🗳️">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#8B2500] mb-4 cursor-pointer hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("storico_indietro")}
      </button>

      <p className="text-sm text-[#555] mb-4">{t("storico_intro")}</p>

      {/* Separatore sezione ISTAT */}
      <div className="flex items-center gap-2 mt-6 mb-3">
        <div className="h-px flex-1 bg-[#e8c9a0]" />
        <span className="text-xs font-bold text-[#8B2500] uppercase tracking-wide whitespace-nowrap">
          {t("storico_istat_sezione")}
        </span>
        <div className="h-px flex-1 bg-[#e8c9a0]" />
      </div>

      {/* Lavoro */}
      <ChartBlock
        icon={<Briefcase className="w-4 h-4 text-[#8B2500]" />}
        title={t("lavoro_titolo")}
        fonte={t("lavoro_fonte")}
      >
        <p className="text-center text-sm font-bold text-black uppercase mb-4 leading-relaxed">
          Numero di occupati in Italia, Governo Conte 2, persi 945.000 posti di lavoro. Tasso di disoccupazione salito al 10,2%.
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={LAVORO_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 11, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} domain={[22, 24]} unit="M" />
            <Tooltip
              formatter={(value) => [`${value} M`, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Line type="monotone" dataKey="occupati" stroke="#0d6e34" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBlock>

      <div className="h-4" />

      {/* Sbarchi */}
      <ChartBlock
        icon={<Ship className="w-4 h-4 text-[#8B2500]" />}
        title={t("sbarchi_titolo")}
        desc={t("sbarchi_desc")}
        fonte={t("sbarchi_fonte")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SBARCHI_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 9, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} />
            <Tooltip
              formatter={(value) => [typeof value === "number" ? value.toLocaleString("it-IT") : value, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Bar dataKey="sbarchi" radius={[6, 6, 0, 0]}>
              {SBARCHI_DATA.map((d) => (
                <Cell key={d.anno} fill={d.evidenzia ? "#e2231a" : "#ffc408"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* Spread */}
      <ChartBlock
        icon={<TrendingUp className="w-4 h-4 text-[#8B2500]" />}
        title={t("spread_titolo")}
        desc={t("spread_desc")}
        fonte={t("spread_fonte")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SPREAD_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 10, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} domain={[50, 320]} unit=" pb" />
            <Tooltip
              formatter={(value) => [`${value} pb`, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Area type="monotone" dataKey="spread" stroke="#1e3a6e" fill="#9db4d4" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* Export */}
      <ChartBlock
        icon={<Package className="w-4 h-4 text-[#8B2500]" />}
        title={t("export_titolo")}
        desc={t("export_desc")}
        fonte={t("export_fonte")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={EXPORT_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8c9a0" />
            <XAxis dataKey="anno" tick={{ fontSize: 11, fill: "#8B2500" }} />
            <YAxis tick={{ fontSize: 11, fill: "#8B2500" }} unit=" Mld€" domain={[400, 500]} />
            <Tooltip
              formatter={(value) => [`${value} Mld€`, ""]}
              contentStyle={{ borderRadius: 12, borderColor: "#e8c9a0", fontSize: 12 }}
            />
            <Bar dataKey="export" radius={[6, 6, 0, 0]} fill="#8bc53f" />
          </BarChart>
        </ResponsiveContainer>
      </ChartBlock>
    </SectionCard>
  );
}
