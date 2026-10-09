import { useSyncExternalStore } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api.js";

// Chiave localStorage condivisa: lo sblocco vale per tutta l'app, non solo per una pagina.
const PROGRAMMER_STORAGE_KEY = "app_programmer_unlocked";
const CHANGE_EVENT = "programmer-space-change";

const subscribe = (callback: () => void) => {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};
// Il vero controllo è sul server: questo serve solo a mostrare o nascondere i pulsanti.
const getSnapshot = () => Boolean(localStorage.getItem(PROGRAMMER_STORAGE_KEY));
const getServerSnapshot = () => false;

/**
 * Hook condiviso per lo "Spazio del Programmatore".
 * La password viene verificata dal server; ogni azione protetta la ricontrolla.
 */
export function useProgrammerSpace() {
  const convex = useConvex();
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const unlock = async (password: string): Promise<boolean> => {
    const ok = await convex.query(api.siteOverrides.checkPassword, { password });
    if (ok) {
      localStorage.setItem(PROGRAMMER_STORAGE_KEY, password);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
    return ok;
  };

  const lock = () => {
    localStorage.removeItem(PROGRAMMER_STORAGE_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return { unlocked, unlock, lock };
}

/** Password inserita dal programmatore, inviata al backend che la verifica. */
export function getStoredProgrammerPassword(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PROGRAMMER_STORAGE_KEY) ?? "";
}
