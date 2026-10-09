const FRESH_MS = 24 * 60 * 60 * 1000;

/** Un avviso è "nuovo" (sirena lampeggiante) per 24 ore dalla pubblicazione. */
export function isFreshAlert(createdAt: string | undefined): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < FRESH_MS;
}
