import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type PermissionedOrientation = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};
type State = "idle" | "active" | "denied" | "unavailable";

const CARDINALS = [
  { key: "dN", deg: 0 },
  { key: "dE", deg: 90 },
  { key: "dS", deg: 180 },
  { key: "dW", deg: 270 },
] as const;

// Calcola la direzione (0 = nord) dai dati del sensore
function headingFrom(e: CompassEvent): number | null {
  if (typeof e.webkitCompassHeading === "number") return e.webkitCompassHeading; // iOS
  if (e.alpha === null) return null;
  return (360 - e.alpha) % 360; // Android: alpha è antiorario
}

function cardinalKey(h: number): string {
  const keys = ["dN", "dNE", "dE", "dSE", "dS", "dSW", "dW", "dNW"];
  return keys[Math.round(h / 45) % 8];
}

export default function Compass() {
  const { t } = useTranslation("extra");
  const [state, setState] = useState<State>("idle");
  const [heading, setHeading] = useState(0);
  const lastRef = useRef(0);
  const handlerRef = useRef<((e: Event) => void) | null>(null);
  const eventName = useRef<string>("deviceorientation");

  const stop = useCallback(() => {
    if (handlerRef.current) window.removeEventListener(eventName.current, handlerRef.current);
    handlerRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    if (typeof DeviceOrientationEvent === "undefined") {
      setState("unavailable");
      return;
    }
    const Ctor = DeviceOrientationEvent as PermissionedOrientation;
    if (Ctor.requestPermission) {
      try {
        if ((await Ctor.requestPermission()) !== "granted") {
          setState("denied");
          return;
        }
      } catch {
        setState("denied");
        return;
      }
    }
    // Android espone la bussola assoluta (riferita al nord magnetico)
    eventName.current = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    let gotData = false;
    const handler = (ev: Event) => {
      const h = headingFrom(ev as CompassEvent);
      if (h === null) return;
      gotData = true;
      const now = Date.now();
      if (now - lastRef.current < 60) return; // limita gli aggiornamenti
      lastRef.current = now;
      setHeading(h);
    };
    handlerRef.current = handler;
    window.addEventListener(eventName.current, handler);
    setState("active");
    // Senza dati (es. computer) la bussola non può funzionare
    window.setTimeout(() => {
      if (!gotData) {
        stop();
        setState("unavailable");
      }
    }, 2500);
  };

  const rotation = -heading; // il quadrante ruota al contrario del telefono
  const active = state === "active";

  return (
    <button
      type="button"
      onClick={() => (active ? undefined : void start())}
      aria-label={t("cAria")}
      className="shrink-0 flex flex-col items-center gap-1 cursor-pointer select-none"
    >
      <div className="relative w-20 h-20 rounded-full border-4 border-[#8B2500] bg-[#fff8f0] shadow-lg">
        <div
          className="absolute inset-0 transition-transform duration-100 ease-linear"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {CARDINALS.map((c) => (
            <span
              key={c.key}
              className={`absolute left-1/2 top-0 -ml-2 w-4 text-center text-[10px] font-black leading-none pt-0.5 ${
                c.key === "dN" ? "text-red-600" : "text-[#8B2500]"
              }`}
              style={{ transformOrigin: "50% 36px", transform: `rotate(${c.deg}deg)` }}
            >
              <span className="inline-block" style={{ transform: `rotate(${-c.deg}deg)` }}>
                {t(c.key)}
              </span>
            </span>
          ))}
          {/* Ago: metà rossa verso nord, metà scura verso sud */}
          <div className="absolute left-1/2 top-[14px] -ml-[5px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-600" />
          <div className="absolute left-1/2 top-[38px] -ml-[5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#5a2a10]" />
        </div>
        <div className="absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#8B2500] border border-white" />
      </div>
      <span className="text-[10px] font-bold text-[#8B2500] leading-tight text-center max-w-[90px]">
        {state === "idle" && t("cTap")}
        {active && `${Math.round(heading)}° ${t(cardinalKey(heading))}`}
        {state === "denied" && t("cDenied")}
        {state === "unavailable" && t("cUnavailable")}
      </span>
    </button>
  );
}
