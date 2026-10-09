import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useServiceWorker() {
  const toastShown = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // In dev, a service worker caches Vite's HMR token and breaks hot reload.
    // It also caches a stale "/" app shell that keeps reloading over old JS chunks,
    // which is what was causing the app to keep bouncing back to the home page.
    if (!import.meta.env.PROD) {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }

    const showUpdateToast = () => {
      if (toastShown.current) return;
      toastShown.current = true;

      toast("È disponibile una nuova versione!", {
        duration: Infinity,
        action: { label: "Aggiorna", onClick: () => window.location.reload() },
      });
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);

        // Check if update is already waiting
        if (registration.waiting) {
          showUpdateToast();
          return;
        }

        // Listen for new updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateToast();
            }
          });
        });
      })
      .catch((err) => console.log("Service Worker registration failed:", err));
  }, []);
}
