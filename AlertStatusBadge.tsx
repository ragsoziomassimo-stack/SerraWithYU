import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Flame, AlertTriangle, Wind, CloudLightning, CloudRain, Thermometer } from "lucide-react";
import { useLanguage } from "@/hooks/use-language.ts";

const LAT = 41.793;
const LON = 15.153;
const POLL_INTERVAL_MS = 10 * 60 * 1000;

type Status = "ok" | "warning" | "danger" | "loading";

interface WeatherData {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    relative_humidity_2m: number;
  };
}

type AlertDetail = {
  status: Status;
  label: Record<string, string>;
  sub: Record<string, string>;
  icon: React.ReactNode;
};

function analizzaRischio(data: WeatherData): AlertDetail {
  const {
    temperature_2m: temp,
    wind_speed_10m: wind,
    precipitation: rain,
    weather_code: code,
    relative_humidity_2m: humidity,
  } = data.current;

  const isRaining = rain > 0 || (code >= 51 && code <= 82);
  const isThunderstorm = code >= 95 && code <= 99;
  const isHeavyRain = code >= 80 && code <= 82;

  // --- INCENDIO ALTO ---
  if (temp > 37 && wind > 35 && humidity < 30 && !isRaining) {
    return {
      status: "danger",
      icon: <Flame className="w-3.5 h-3.5 text-red-600" />,
      label: {
        it: "🔴 ALLERTA INCENDIO — Rischio ALTO",
        en: "🔴 FIRE ALERT — HIGH Risk",
        de: "🔴 BRANDWARNUNG — HOHES Risiko",
        fr: "🔴 ALERTE INCENDIE — Risque ÉLEVÉ",
        bg: "🔴 ПОЖАРНА ТРЕВОГА — ВИСОК риск",
        es: "🔴 ALERTA INCENDIO — Riesgo ALTO",
      },
      sub: {
        it: `Temp. ${Math.round(temp)}°C · Vento ${Math.round(wind)} km/h · Umidità ${humidity}%. Non accendere fuochi. Chiama il 115.`,
        en: `Temp. ${Math.round(temp)}°C · Wind ${Math.round(wind)} km/h · Humidity ${humidity}%. Do not light fires. Call 115.`,
        de: `Temp. ${Math.round(temp)}°C · Wind ${Math.round(wind)} km/h · Feuchte ${humidity}%. Kein Feuer entzünden. Notruf 115.`,
        fr: `Temp. ${Math.round(temp)}°C · Vent ${Math.round(wind)} km/h · Humidité ${humidity}%. Ne pas allumer de feux. Appelez le 115.`,
        bg: `Темп. ${Math.round(temp)}°C · Вятър ${Math.round(wind)} км/ч · Влажност ${humidity}%. Не палете огън. Обадете се на 115.`,
        es: `Temp. ${Math.round(temp)}°C · Viento ${Math.round(wind)} km/h · Humedad ${humidity}%. No encender fuegos. Llame al 115.`,
      },
    };
  }

  // --- TEMPORALE ---
  if (isThunderstorm) {
    return {
      status: "danger",
      icon: <CloudLightning className="w-3.5 h-3.5 text-red-600" />,
      label: {
        it: "🔴 ALLERTA TEMPORALE in corso",
        en: "🔴 THUNDERSTORM ALERT in progress",
        de: "🔴 GEWITTERWARNUNG aktiv",
        fr: "🔴 ALERTE ORAGE en cours",
        bg: "🔴 ГРЪМОТЕВИЧНА БУРЯ в ход",
        es: "🔴 ALERTA TORMENTA en curso",
      },
      sub: {
        it: "Temporale attivo. Rimani al chiuso, lontano da alberi e strutture metalliche.",
        en: "Active thunderstorm. Stay indoors, away from trees and metal structures.",
        de: "Aktives Gewitter. Bleib drinnen, weg von Bäumen und Metallstrukturen.",
        fr: "Orage actif. Restez à l'intérieur, loin des arbres et des structures métalliques.",
        bg: "Активна буря. Останете на закрито, далеч от дървета и метални конструкции.",
        es: "Tormenta activa. Quédate en interior, lejos de árboles y estructuras metálicas.",
      },
    };
  }

  // --- INCENDIO MEDIO ---
  if (temp > 33 && wind > 20 && !isRaining) {
    return {
      status: "warning",
      icon: <Flame className="w-3.5 h-3.5 text-orange-600" />,
      label: {
        it: "⚠️ ATTENZIONE INCENDIO — Rischio MEDIO",
        en: "⚠️ FIRE ATTENTION — MEDIUM Risk",
        de: "⚠️ BRANDGEFAHR — MITTLERES Risiko",
        fr: "⚠️ ATTENTION INCENDIE — Risque MODÉRÉ",
        bg: "⚠️ ВНИМАНИЕ ПОЖАР — СРЕДЕН риск",
        es: "⚠️ ATENCIÓN INCENDIO — Riesgo MEDIO",
      },
      sub: {
        it: `Temp. ${Math.round(temp)}°C · Vento ${Math.round(wind)} km/h. Evita bruciare sterpaglie. Segnala fumi al 1515.`,
        en: `Temp. ${Math.round(temp)}°C · Wind ${Math.round(wind)} km/h. Avoid burning vegetation. Report smoke to 1515.`,
        de: `Temp. ${Math.round(temp)}°C · Wind ${Math.round(wind)} km/h. Kein Verbrennen. Verdächtigen Rauch → 1515.`,
        fr: `Temp. ${Math.round(temp)}°C · Vent ${Math.round(wind)} km/h. Ne brûlez pas de végétation. Fumée suspecte → 1515.`,
        bg: `Темп. ${Math.round(temp)}°C · Вятър ${Math.round(wind)} км/ч. Избягвайте изгаряне. Дим → 1515.`,
        es: `Temp. ${Math.round(temp)}°C · Viento ${Math.round(wind)} km/h. Evite quemar maleza. Humo sospechoso → 1515.`,
      },
    };
  }

  // --- VENTO FORTE ---
  if (wind > 70) {
    return {
      status: "warning",
      icon: <Wind className="w-3.5 h-3.5 text-orange-600" />,
      label: {
        it: "⚠️ ALLERTA VENTO FORTE",
        en: "⚠️ STRONG WIND ALERT",
        de: "⚠️ STURMWARNUNG",
        fr: "⚠️ ALERTE VENT FORT",
        bg: "⚠️ ПРЕДУПРЕЖДЕНИЕ ЗА СИЛЕН ВЯТЪР",
        es: "⚠️ ALERTA VIENTO FUERTE",
      },
      sub: {
        it: `Vento a ${Math.round(wind)} km/h. Metti in sicurezza oggetti all'aperto. Guida con prudenza.`,
        en: `Wind at ${Math.round(wind)} km/h. Secure outdoor objects. Drive carefully.`,
        de: `Wind mit ${Math.round(wind)} km/h. Gegenstände sichern. Vorsichtig fahren.`,
        fr: `Vent à ${Math.round(wind)} km/h. Sécurisez les objets extérieurs. Conduisez prudemment.`,
        bg: `Вятър ${Math.round(wind)} км/ч. Осигурете предметите на открито. Карайте внимателно.`,
        es: `Viento a ${Math.round(wind)} km/h. Asegure objetos al aire libre. Conduzca con precaución.`,
      },
    };
  }

  // --- PIOGGIA INTENSA ---
  if (isHeavyRain) {
    return {
      status: "warning",
      icon: <CloudRain className="w-3.5 h-3.5 text-orange-600" />,
      label: {
        it: "⚠️ ALLERTA PIOGGIA INTENSA",
        en: "⚠️ HEAVY RAIN ALERT",
        de: "⚠️ STARKREGENWARNUNG",
        fr: "⚠️ ALERTE PLUIE INTENSE",
        bg: "⚠️ ПРЕДУПРЕЖДЕНИЕ ЗА ПРОЛИВЕН ДЪЖД",
        es: "⚠️ ALERTA LLUVIA INTENSA",
      },
      sub: {
        it: "Piogge intense in corso. Evita sottopassi e zone allagabili. Emergenze → 112.",
        en: "Heavy rainfall in progress. Avoid underpasses and flood-prone areas. Emergency → 112.",
        de: "Starkregen. Unterführungen meiden. Notruf → 112.",
        fr: "Pluies intenses. Évitez les zones inondables. Urgences → 112.",
        bg: "Интензивен валеж. Избягвайте заливаеми зони. Спешно → 112.",
        es: "Lluvia intensa. Evite zonas inundables. Emergencias → 112.",
      },
    };
  }

  // --- CALDO ESTREMO ---
  if (temp > 40) {
    return {
      status: "warning",
      icon: <Thermometer className="w-3.5 h-3.5 text-orange-600" />,
      label: {
        it: "⚠️ ALLERTA CALDO ESTREMO",
        en: "⚠️ EXTREME HEAT ALERT",
        de: "⚠️ EXTREMHITZE-WARNUNG",
        fr: "⚠️ ALERTE CHALEUR EXTRÊME",
        bg: "⚠️ ПРЕДУПРЕЖДЕНИЕ ЗА ЕКСТРЕМНА ЖЕГА",
        es: "⚠️ ALERTA CALOR EXTREMO",
      },
      sub: {
        it: `${Math.round(temp)}°C. Evita il sole dalle 12 alle 16. Idratati. Controlla anziani e bambini.`,
        en: `${Math.round(temp)}°C. Avoid sun 12–16h. Stay hydrated. Check on elderly and children.`,
        de: `${Math.round(temp)}°C. Sonne 12–16 Uhr meiden. Gut hydrieren.`,
        fr: `${Math.round(temp)}°C. Évitez le soleil de 12h à 16h. Hydratez-vous.`,
        bg: `${Math.round(temp)}°C. Избягвайте слънцето от 12 до 16 ч. Пийте вода.`,
        es: `${Math.round(temp)}°C. Evite el sol de 12 a 16h. Manténgase hidratado.`,
      },
    };
  }

  // --- OK ---
  return {
    status: "ok",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-green-600" />,
    label: {
      it: "Avviso Calamità Naturali ed Incendi",
      en: "Natural Disasters & Fire Warning",
      de: "Katastrophen- & Brandwarnung",
      fr: "Alerte catastrophes & incendies",
      bg: "Предупреждения за бедствия и пожари",
      es: "Aviso de catástrofes e incendios",
    },
    sub: {
      it: "Nessuna allerta attiva · Sistema attivo ✓",
      en: "No active alert · System active ✓",
      de: "Keine aktive Warnung · System aktiv ✓",
      fr: "Aucune alerte active · Système actif ✓",
      bg: "Няма активна тревога · Системата работи ✓",
      es: "Sin alertas activas · Sistema activo ✓",
    },
  };
}

const STATUS_BG: Record<Status, string> = {
  loading: "bg-gray-100 border-gray-300 text-gray-600",
  ok: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-orange-50 border-orange-300 text-orange-800",
  danger: "bg-red-50 border-red-400 text-red-800",
};

const STATUS_DOT: Record<Status, string> = {
  loading: "bg-gray-400",
  ok: "bg-green-500",
  warning: "bg-orange-500",
  danger: "bg-red-500",
};

export default function AlertStatusBadge() {
  const { t: tx } = useTranslation("extra");
  const { currentLanguage } = useLanguage();
  const lang = ["it", "en", "de", "fr", "bg", "es"].includes(currentLanguage) ? currentLanguage : "it";

  const [detail, setDetail] = useState<AlertDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [expanded, setExpanded] = useState(false);

  const fetch_ = useCallback(async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=Europe%2FRome`;
      const res = await fetch(url);
      if (!res.ok) { setStatus("ok"); return; }
      const data = (await res.json()) as WeatherData;
      const d = analizzaRischio(data);
      setDetail(d);
      setStatus(d.status);
    } catch {
      setStatus("ok");
    }
  }, []);

  useEffect(() => {
    void fetch_();
    const id = setInterval(() => void fetch_(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetch_]);

  const label = detail?.label[lang] ?? detail?.label["it"] ?? "Avviso Calamità Naturali ed Incendi";
  const sub = detail?.sub[lang] ?? detail?.sub["it"] ?? tx("verifying");
  const icon = detail?.icon ?? <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />;
  const dot = STATUS_DOT[status];
  const bg = STATUS_BG[status];
  const pulse = status !== "loading";

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className={`w-full text-left border rounded-xl px-4 py-2.5 flex items-center gap-3 transition-all cursor-pointer shadow-sm ${bg}`}
    >
      {/* Pallino stato */}
      <div className="relative flex-shrink-0 w-4 h-4 flex items-center justify-center">
        {pulse && (
          <motion.span
            className={`absolute inline-flex rounded-full opacity-60 ${dot}`}
            style={{ width: 16, height: 16 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
          />
        )}
        <span className={`relative inline-flex rounded-full w-3 h-3 ${dot}`} />
      </div>

      {/* Testo */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black leading-tight truncate">{label}</p>
        <AnimatePresence>
          {expanded && (
            <motion.p
              className="text-[11px] mt-0.5 leading-snug opacity-80"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {sub}
            </motion.p>
          )}
        </AnimatePresence>
        {!expanded && (
          <p className="text-[10px] opacity-60 leading-tight">{sub}</p>
        )}
      </div>

      {/* Icona */}
      <div className="flex-shrink-0">{icon}</div>
    </button>
  );
}
