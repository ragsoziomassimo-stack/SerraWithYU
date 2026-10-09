// Logica pura del contapassi: rilevamento passi, distanza, calorie, livello.

export type Level = "esordiente" | "passeggiatore" | "sportivo";

const GRAVITY_ALPHA = 0.9; // filtro passa-basso per isolare la gravità
const SMOOTH_ALPHA = 0.55; // leggero smorzamento del rumore
const THRESHOLD = 1.1; // m/s² sopra la gravità per contare un picco
const MIN_STEP_MS = 280; // massimo ~3.5 passi/s (corsa veloce)
const MAX_GAP_MS = 1500; // pausa oltre la quale la sequenza si azzera
const WARMUP_STEPS = 4; // passi consecutivi richiesti per evitare falsi positivi

/** Rileva i passi dal modulo dell'accelerazione (con gravità). */
export class StepDetector {
  private gravity = 9.81;
  private smooth = 0;
  private prev = 0;
  private lastStepAt = 0;
  private pending = 0;

  /** Restituisce quanti passi aggiungere (0 o più) per questo campione. */
  process(magnitude: number, timestamp: number): number {
    this.gravity = this.gravity * GRAVITY_ALPHA + magnitude * (1 - GRAVITY_ALPHA);
    const linear = magnitude - this.gravity;
    this.smooth = this.smooth * SMOOTH_ALPHA + linear * (1 - SMOOTH_ALPHA);

    const crossedUp = this.prev <= THRESHOLD && this.smooth > THRESHOLD;
    this.prev = this.smooth;
    if (!crossedUp) return 0;

    const gap = timestamp - this.lastStepAt;
    if (gap < MIN_STEP_MS) return 0;
    this.lastStepAt = timestamp;

    if (gap > MAX_GAP_MS) this.pending = 0;
    if (this.pending < WARMUP_STEPS) {
      this.pending += 1;
      // Al raggiungimento della soglia si recuperano i passi in attesa
      return this.pending === WARMUP_STEPS ? WARMUP_STEPS : 0;
    }
    return 1;
  }
}

/** Lunghezza del passo in metri: dall'altezza se nota, altrimenti 0.75. */
export function strideLengthM(heightCm: number | null): number {
  if (heightCm && heightCm >= 100 && heightCm <= 230) return (heightCm / 100) * 0.415;
  return 0.75;
}

/** Calorie: ~0.9 kcal per kg per km di camminata. */
export function caloriesBurned(distanceM: number, weightKg: number | null): number {
  const kg = weightKg && weightKg >= 30 && weightKg <= 250 ? weightKg : 70;
  return (distanceM / 1000) * kg * 0.9;
}

export function averageSpeedKmh(distanceM: number, seconds: number): number {
  if (seconds <= 0) return 0;
  return (distanceM / seconds) * 3.6;
}

export function classify(distanceM: number, seconds: number): Level {
  const speed = averageSpeedKmh(distanceM, seconds);
  if ((distanceM >= 2000 && speed >= 5) || distanceM >= 8000) return "sportivo";
  if (distanceM >= 1000 && speed >= 2.5) return "passeggiatore";
  return "esordiente";
}

export function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
