import { useCallback, useEffect, useRef, useState } from "react";
import { StepDetector, haversineM } from "@/lib/pedometer.ts";

export type PedometerStatus = "idle" | "running" | "done";
export type PedometerMode = "sensor" | "gps";
export type PedometerError = "noSupport" | "gpsDenied" | null;

type PermissionedMotionEvent = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};
type WakeLockSentinelLike = { release: () => Promise<void> };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
};

const SENSOR_WATCHDOG_MS = 3000;
const GPS_MAX_ACCURACY_M = 35;
const GPS_MIN_SEGMENT_M = 4; // scarta il "tremolio" del GPS da fermi
const GPS_MAX_SPEED_MS = 8; // scarta salti impossibili

export function usePedometer(strideM: number) {
  const [status, setStatus] = useState<PedometerStatus>("idle");
  const [mode, setMode] = useState<PedometerMode | null>(null);
  const [steps, setSteps] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState<PedometerError>(null);

  const strideRef = useRef(strideM);
  strideRef.current = strideM;

  const detector = useRef(new StepDetector());
  const startedAt = useRef(0);
  const sensorHandler = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const gotSensorData = useRef(false);
  const watchdog = useRef<number | null>(null);
  const ticker = useRef<number | null>(null);
  const geoId = useRef<number | null>(null);
  const lastPos = useRef<{ lat: number; lon: number; t: number } | null>(null);
  const wakeLock = useRef<WakeLockSentinelLike | null>(null);
  const stepsRef = useRef(0);
  const gpsDistRef = useRef(0);

  const cleanup = useCallback(() => {
    if (sensorHandler.current) {
      window.removeEventListener("devicemotion", sensorHandler.current);
      sensorHandler.current = null;
    }
    if (watchdog.current !== null) window.clearTimeout(watchdog.current);
    if (ticker.current !== null) window.clearInterval(ticker.current);
    if (geoId.current !== null) navigator.geolocation.clearWatch(geoId.current);
    watchdog.current = ticker.current = geoId.current = null;
    void wakeLock.current?.release().catch(() => undefined);
    wakeLock.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startGps = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("noSupport");
      return false;
    }
    setMode("gps");
    lastPos.current = null;
    geoId.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy > GPS_MAX_ACCURACY_M) return;
        const cur = { lat: pos.coords.latitude, lon: pos.coords.longitude, t: pos.timestamp };
        const prev = lastPos.current;
        if (!prev) {
          lastPos.current = cur;
          return;
        }
        const d = haversineM(prev.lat, prev.lon, cur.lat, cur.lon);
        const dt = Math.max((cur.t - prev.t) / 1000, 0.5);
        if (d < GPS_MIN_SEGMENT_M || d / dt > GPS_MAX_SPEED_MS) return;
        lastPos.current = cur;
        gpsDistRef.current += d;
        setDistanceM(gpsDistRef.current);
        stepsRef.current = Math.round(gpsDistRef.current / strideRef.current);
        setSteps(stepsRef.current);
      },
      () => setError("gpsDenied"),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 },
    );
    return true;
  }, []);

  const startSensor = useCallback(() => {
    setMode("sensor");
    gotSensorData.current = false;
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x === null || a.y === null || a.z === null) return;
      gotSensorData.current = true;
      const magnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
      const added = detector.current.process(magnitude, Date.now());
      if (added > 0) {
        stepsRef.current += added;
        setSteps(stepsRef.current);
        setDistanceM(stepsRef.current * strideRef.current);
      }
    };
    sensorHandler.current = handler;
    window.addEventListener("devicemotion", handler);
    // Se dopo qualche secondo non arrivano dati (es. computer), passa al GPS
    watchdog.current = window.setTimeout(() => {
      if (gotSensorData.current) return;
      window.removeEventListener("devicemotion", handler);
      sensorHandler.current = null;
      startGps();
    }, SENSOR_WATCHDOG_MS);
  }, [startGps]);

  const start = useCallback(async () => {
    setError(null);
    setSteps(0);
    setDistanceM(0);
    setElapsedSec(0);
    stepsRef.current = 0;
    gpsDistRef.current = 0;
    detector.current = new StepDetector();

    // iOS richiede il permesso, da chiedere dentro il tocco dell'utente
    const Motion = (typeof DeviceMotionEvent !== "undefined"
      ? DeviceMotionEvent
      : undefined) as PermissionedMotionEvent | undefined;
    let sensorAllowed = Motion !== undefined;
    if (Motion?.requestPermission) {
      try {
        sensorAllowed = (await Motion.requestPermission()) === "granted";
      } catch {
        sensorAllowed = false;
      }
    }

    const ok = sensorAllowed ? (startSensor(), true) : startGps();
    if (!ok) return;

    startedAt.current = Date.now();
    setStatus("running");
    ticker.current = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);

    // Mantiene lo schermo acceso, dove supportato
    try {
      wakeLock.current = (await (navigator as WakeLockNavigator).wakeLock?.request("screen")) ?? null;
    } catch {
      wakeLock.current = null;
    }
  }, [startSensor, startGps]);

  const stop = useCallback(() => {
    setElapsedSec(Math.floor((Date.now() - startedAt.current) / 1000));
    cleanup();
    setStatus("done");
  }, [cleanup]);

  const reset = useCallback(() => {
    setStatus("idle");
    setMode(null);
    setSteps(0);
    setDistanceM(0);
    setElapsedSec(0);
    setError(null);
  }, []);

  return { status, mode, steps, distanceM, elapsedSec, error, start, stop, reset };
}
