import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type WeatherData = {
  temp: number;
  weatherCode: number;
};

// WMO Weather interpretation codes → emoji + label
function getWeatherInfo(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: "☀️", label: "w0" };
  if (code <= 2) return { emoji: "⛅", label: "w1" };
  if (code === 3) return { emoji: "☁️", label: "w2" };
  if (code <= 49) return { emoji: "🌫️", label: "w3" };
  if (code <= 59) return { emoji: "🌦️", label: "w4" };
  if (code <= 69) return { emoji: "🌧️", label: "w5" };
  if (code <= 79) return { emoji: "🌨️", label: "w6" };
  if (code <= 82) return { emoji: "🌧️", label: "w7" };
  if (code <= 84) return { emoji: "🌨️", label: "w8" };
  if (code <= 99) return { emoji: "⛈️", label: "w9" };
  return { emoji: "🌡️", label: "w10" };
}

const CACHE_KEY = "serrawithyu_weather";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export default function WeatherWidget() {
  const { t } = useTranslation("extra");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached) as { data: WeatherData; timestamp: number };
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          setWeather(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore corrupt cache
      }
    }

    // Serracapriola coordinates: 41.81°N, 15.16°E
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.81&longitude=15.16&current=temperature_2m,weather_code&timezone=Europe%2FRome"
    )
      .then((r) => r.json())
      .then((json) => {
        const data: WeatherData = {
          temp: Math.round(json.current.temperature_2m as number),
          weatherCode: json.current.weather_code as number,
        };
        setWeather(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      })
      .catch(() => {
        // silently fail
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-0.5 min-w-[52px]">
        <div className="w-7 h-7 rounded-full bg-white/30 animate-pulse" />
        <div className="w-10 h-3 rounded bg-white/30 animate-pulse mt-0.5" />
      </div>
    );
  }

  if (!weather) return <div className="min-w-[52px]" />;

  const { emoji, label: labelKey } = getWeatherInfo(weather.weatherCode);
  const label = t(labelKey);

  return (
    <div
      className="flex flex-col items-center gap-0 select-none"
      title={`Serracapriola: ${label}`}
    >
      <span className="text-2xl leading-none drop-shadow">{emoji}</span>
      <span className="text-[11px] font-black text-[#8B2500] leading-tight">
        {weather.temp}°C
      </span>
      <span className="text-[9px] text-[#8B2500]/70 font-semibold leading-tight hidden sm:block">
        {label}
      </span>
    </div>
  );
}
