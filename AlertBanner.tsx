import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Flame, Wind, CloudLightning, CloudRain, Thermometer, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language.ts";

// Coordinate di Serracapriola (FG)
const LAT = 41.793;
const LON = 15.153;
const POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minuti

type AlertLevel = "red" | "orange" | "yellow";

type Alert = {
  level: AlertLevel;
  icon: React.ReactNode;
  title: Record<string, string>;
  message: Record<string, string>;
};

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    relative_humidity_2m: number;
  };
  hourly: {
    precipitation: number[];
  };
}

function analizzaCondizioni(data: OpenMeteoResponse): Alert | null {
  const { temperature_2m: temp, wind_speed_10m: wind, precipitation: rain, weather_code: code, relative_humidity_2m: humidity } = data.current;

  // Codici meteo WMO: 95-99 = temporale
  const isThunderstorm = code >= 95 && code <= 99;
  // 80-82 = pioggia forte, 85-86 = neve, 51-67 = pioggia
  const isHeavyRain = code >= 80 && code <= 82;
  const isRaining = rain > 0 || (code >= 51 && code <= 82);

  // Precipitazioni cumulate prossime 3h
  const next3hRain = data.hourly.precipitation.slice(0, 3).reduce((a, b) => a + b, 0);

  // --- INCENDIO ---
  // Rischio alto: temp > 37°C, vento > 35 km/h, umidità < 30%, nessuna pioggia
  if (temp > 37 && wind > 35 && humidity < 30 && !isRaining) {
    return {
      level: "red",
      icon: <Flame className="w-5 h-5" />,
      title: {
        it: "🔴 ALLERTA INCENDIO — Rischio ALTO",
        en: "🔴 FIRE ALERT — HIGH Risk",
        de: "🔴 BRANDWARNUNG — HOHES Risiko",
        fr: "🔴 ALERTE INCENDIE — Risque ÉLEVÉ",
        bg: "🔴 ПОЖАРНА ТРЕВОГА — ВИСОК риск",
        es: "🔴 ALERTA INCENDIO — Riesgo ALTO",
      },
      message: {
        it: `Temperatura ${Math.round(temp)}°C, vento ${Math.round(wind)} km/h, umidità ${humidity}%. Non accendere fuochi. Chiama il 115 in caso di incendio. Segui le indicazioni della Protezione Civile.`,
        en: `Temperature ${Math.round(temp)}°C, wind ${Math.round(wind)} km/h, humidity ${humidity}%. Do not light fires. Call 115 in case of fire. Follow Civil Protection instructions.`,
        de: `Temperatur ${Math.round(temp)}°C, Wind ${Math.round(wind)} km/h, Luftfeuchte ${humidity}%. Keine Feuer entzünden. Im Brandfall 115 anrufen.`,
        fr: `Température ${Math.round(temp)}°C, vent ${Math.round(wind)} km/h, humidité ${humidity}%. N'allumez pas de feux. Appelez le 115 en cas d'incendie.`,
        bg: `Температура ${Math.round(temp)}°C, вятър ${Math.round(wind)} км/ч, влажност ${humidity}%. Не палете огън. При пожар се обадете на 115.`,
        es: `Temperatura ${Math.round(temp)}°C, viento ${Math.round(wind)} km/h, humedad ${humidity}%. No encender fuegos. Llame al 115 en caso de incendio.`,
      },
    };
  }

  // Rischio medio: temp > 33°C, vento > 20 km/h, nessuna pioggia
  if (temp > 33 && wind > 20 && !isRaining) {
    return {
      level: "orange",
      icon: <Flame className="w-5 h-5" />,
      title: {
        it: "🟠 ATTENZIONE INCENDIO — Rischio MEDIO",
        en: "🟠 FIRE ATTENTION — MEDIUM Risk",
        de: "🟠 BRANDGEFAHR — MITTLERES Risiko",
        fr: "🟠 ATTENTION INCENDIE — Risque MODÉRÉ",
        bg: "🟠 ВНИМАНИЕ ПОЖАР — СРЕДЕН риск",
        es: "🟠 ATENCIÓN INCENDIO — Riesgo MEDIO",
      },
      message: {
        it: `Temperatura ${Math.round(temp)}°C, vento ${Math.round(wind)} km/h. Evita di bruciare sterpaglie. Non lasciare rifiuti infiammabili. Segnala fumi sospetti al 1515.`,
        en: `Temperature ${Math.round(temp)}°C, wind ${Math.round(wind)} km/h. Avoid burning vegetation. Report suspicious smoke to 1515.`,
        de: `Temperatur ${Math.round(temp)}°C, Wind ${Math.round(wind)} km/h. Kein Verbrennen von Gestrüpp. Verdächtigen Rauch unter 1515 melden.`,
        fr: `Température ${Math.round(temp)}°C, vent ${Math.round(wind)} km/h. Évitez de brûler des broussailles. Signalez toute fumée suspecte au 1515.`,
        bg: `Температура ${Math.round(temp)}°C, вятър ${Math.round(wind)} км/ч. Избягвайте изгаряне на растителност. Съобщете за подозрителен дим на 1515.`,
        es: `Temperatura ${Math.round(temp)}°C, viento ${Math.round(wind)} km/h. Evite quemar maleza. Informe de humos sospechosos al 1515.`,
      },
    };
  }

  // --- TEMPORALE ---
  if (isThunderstorm) {
    return {
      level: "red",
      icon: <CloudLightning className="w-5 h-5" />,
      title: {
        it: "🔴 ALLERTA TEMPORALE in corso",
        en: "🔴 THUNDERSTORM ALERT in progress",
        de: "🔴 GEWITTERWARNUNG aktiv",
        fr: "🔴 ALERTE ORAGE en cours",
        bg: "🔴 ГРЪМОТЕВИЧНА БУРЯ в ход",
        es: "🔴 ALERTA TORMENTA en curso",
      },
      message: {
        it: "Temporale in corso. Rimani al chiuso, lontano da alberi e strutture metalliche. Non usare il cellulare all'aperto. Evita strade allagate.",
        en: "Thunderstorm in progress. Stay indoors, away from trees and metal structures. Avoid flooded roads.",
        de: "Gewitter im Gange. Bleib drinnen, weg von Bäumen und Metallstrukturen. Überflutete Straßen meiden.",
        fr: "Orage en cours. Restez à l'intérieur, loin des arbres et des structures métalliques. Évitez les routes inondées.",
        bg: "Гръмотевична буря. Останете на закрито, далеч от дървета и метални конструкции. Избягвайте наводнени пътища.",
        es: "Tormenta en curso. Quédate en interior, lejos de árboles y estructuras metálicas. Evita carreteras inundadas.",
      },
    };
  }

  // --- VENTO FORTE ---
  if (wind > 70) {
    return {
      level: "orange",
      icon: <Wind className="w-5 h-5" />,
      title: {
        it: "🟠 ALLERTA VENTO FORTE",
        en: "🟠 STRONG WIND ALERT",
        de: "🟠 STURMWARNUNG",
        fr: "🟠 ALERTE VENT FORT",
        bg: "🟠 ПРЕДУПРЕЖДЕНИЕ ЗА СИЛЕН ВЯТЪР",
        es: "🟠 ALERTA VIENTO FUERTE",
      },
      message: {
        it: `Vento a ${Math.round(wind)} km/h. Metti in sicurezza oggetti all'aperto. Presta attenzione alla guida. Evita aree boscose.`,
        en: `Wind at ${Math.round(wind)} km/h. Secure outdoor objects. Drive carefully. Avoid wooded areas.`,
        de: `Wind mit ${Math.round(wind)} km/h. Gegenstände im Freien sichern. Vorsichtig fahren.`,
        fr: `Vent à ${Math.round(wind)} km/h. Sécurisez les objets extérieurs. Conduisez prudemment.`,
        bg: `Вятър ${Math.round(wind)} км/ч. Осигурете предметите на открито. Карайте внимателно.`,
        es: `Viento a ${Math.round(wind)} km/h. Asegure objetos al aire libre. Conduzca con precaución.`,
      },
    };
  }

  // --- PIOGGIA INTENSA ---
  if (isHeavyRain || next3hRain > 15) {
    return {
      level: "yellow",
      icon: <CloudRain className="w-5 h-5" />,
      title: {
        it: "🟡 ALLERTA PIOGGIA INTENSA",
        en: "🟡 HEAVY RAIN ALERT",
        de: "🟡 STARKREGENWARNUNG",
        fr: "🟡 ALERTE PLUIE INTENSE",
        bg: "🟡 ПРЕДУПРЕЖДЕНИЕ ЗА ПРОЛИВЕН ДЪЖД",
        es: "🟡 ALERTA LLUVIA INTENSA",
      },
      message: {
        it: `Previste precipitazioni intense. Evita sottopassi e zone allagabili. Presta attenzione a ruscelli e canali. Chiama il 112 in caso di emergenza.`,
        en: `Intense rainfall expected. Avoid underpasses and flood-prone areas. Watch streams and canals. Call 112 in emergency.`,
        de: `Starkregen erwartet. Unterführungen und überflutungsgefährdete Gebiete meiden. Bei Notfall 112 anrufen.`,
        fr: `Précipitations intenses prévues. Évitez les passages souterrains et les zones inondables. Appelez le 112 en cas d'urgence.`,
        bg: `Очаква се интензивен валеж. Избягвайте подлези и заливаеми зони. При спешност се обадете на 112.`,
        es: `Se esperan precipitaciones intensas. Evite pasos inferiores y zonas inundables. Llame al 112 en emergencia.`,
      },
    };
  }

  // --- CALDO ESTREMO ---
  if (temp > 40) {
    return {
      level: "orange",
      icon: <Thermometer className="w-5 h-5" />,
      title: {
        it: "🟠 ALLERTA CALDO ESTREMO",
        en: "🟠 EXTREME HEAT ALERT",
        de: "🟠 EXTREMHITZE-WARNUNG",
        fr: "🟠 ALERTE CHALEUR EXTRÊME",
        bg: "🟠 ПРЕДУПРЕЖДЕНИЕ ЗА ЕКСТРЕМНА ЖЕГА",
        es: "🟠 ALERTA CALOR EXTREMO",
      },
      message: {
        it: `Temperatura di ${Math.round(temp)}°C. Evita l'esposizione al sole nelle ore centrali (12-16). Idratati abbondantemente. Controlla anziani e bambini.`,
        en: `Temperature of ${Math.round(temp)}°C. Avoid sun exposure during midday (12-16h). Stay hydrated. Check on elderly and children.`,
        de: `Temperatur ${Math.round(temp)}°C. Sonnenexposition zwischen 12-16 Uhr vermeiden. Gut hydrieren.`,
        fr: `Température de ${Math.round(temp)}°C. Évitez l'exposition au soleil entre 12h et 16h. Hydratez-vous.`,
        bg: `Температура ${Math.round(temp)}°C. Избягвайте слънцето от 12 до 16 ч. Пийте достатъчно вода.`,
        es: `Temperatura de ${Math.round(temp)}°C. Evite exposición solar de 12 a 16h. Manténgase hidratado.`,
      },
    };
  }

  return null;
}

const LEVEL_STYLES: Record<AlertLevel, string> = {
  red: "bg-red-600 border-red-700 text-white",
  orange: "bg-orange-500 border-orange-600 text-white",
  yellow: "bg-yellow-400 border-yellow-500 text-gray-900",
};

export default function AlertBanner() {
  const { t: tx } = useTranslation("extra");
  const { currentLanguage } = useLanguage();
  const lang = ["it", "en", "de", "fr", "bg", "es"].includes(currentLanguage) ? currentLanguage : "it";
  const [alert, setAlert] = useState<Alert | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAndAnalyze = useCallback(async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&hourly=precipitation&timezone=Europe%2FRome&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = (await res.json()) as OpenMeteoResponse;
      const newAlert = analizzaCondizioni(data);
      setAlert(newAlert);
      setDismissed(false);
      setLastUpdated(new Date());
    } catch {
      // Silently fail — non blocca l'app
    }
  }, []);

  useEffect(() => {
    void fetchAndAnalyze();
    const interval = setInterval(() => void fetchAndAnalyze(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAndAnalyze]);

  if (!alert || dismissed) return null;

  const title = alert.title[lang] ?? alert.title["it"];
  const message = alert.message[lang] ?? alert.message["it"];

  return (
    <AnimatePresence>
      <motion.div
        key="alert-banner"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed bottom-[64px] left-0 right-0 z-40 border-t-2 ${LEVEL_STYLES[alert.level]} shadow-lg`}
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{alert.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight mb-1">{title}</p>
              <p className="text-xs leading-relaxed opacity-90">{message}</p>
              {lastUpdated && (
                <p className="text-[10px] mt-1 opacity-60">
                  {lang === "it" && `Aggiornato: ${lastUpdated.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`}
                  {lang === "en" && `Updated: ${lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`}
                  {lang === "de" && `Aktualisiert: ${lastUpdated.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`}
                  {lang === "fr" && `Mis à jour: ${lastUpdated.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                  {lang === "bg" && `Обновено: ${lastUpdated.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}`}
                  {!["it","en","de","fr","bg"].includes(lang) && `Aggiornato: ${lastUpdated.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 opacity-70 hover:opacity-100 cursor-pointer mt-0.5"
              title={tx("close")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
