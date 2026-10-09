import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const TEXTS: Record<string, { title: string; body: string; ok: string; ios: string }> = {
  it: { title: "Installa l'app sul telefono", body: "Aggiungila alla schermata Home per aprirla subito, come una vera app.", ok: "Ok, installa", ios: "Tocca il pulsante Condividi e poi \"Aggiungi alla schermata Home\"." },
  en: { title: "Install the app on your phone", body: "Add it to your Home screen to open it instantly, like a real app.", ok: "Ok, install", ios: "Tap the Share button, then \"Add to Home Screen\"." },
  de: { title: "App auf dem Handy installieren", body: "Füge sie zum Startbildschirm hinzu, um sie sofort wie eine echte App zu öffnen.", ok: "Ok, installieren", ios: "Tippe auf Teilen und dann auf \"Zum Home-Bildschirm\"." },
  fr: { title: "Installez l'app sur votre téléphone", body: "Ajoutez-la à l'écran d'accueil pour l'ouvrir tout de suite, comme une vraie app.", ok: "Ok, installer", ios: "Touchez Partager puis \"Sur l'écran d'accueil\"." },
  es: { title: "Instala la app en tu teléfono", body: "Añádela a la pantalla de inicio para abrirla al instante, como una app real.", ok: "Ok, instalar", ios: "Toca Compartir y luego \"Añadir a pantalla de inicio\"." },
  bg: { title: "Инсталирайте приложението", body: "Добавете го към началния екран, за да го отваряте веднага като истинско приложение.", ok: "Ок, инсталирай", ios: "Натиснете Споделяне, после \"Добавяне към началния екран\"." },
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

// Banner fisso: non ha pulsante di chiusura, sparisce solo quando l'app è installata.
export default function InstallPrompt() {
  const { i18n } = useTranslation();
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Nell'anteprima dell'editor (iframe) o con l'app già installata non si mostra.
  if (installed || window.self !== window.top || isStandalone()) return null;
  const ios = isIos();
  if (!event && !ios) return null;

  const tx = TEXTS[i18n.language?.slice(0, 2)] ?? TEXTS.it;

  const install = async () => {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") setInstalled(true);
    else setEvent(null);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md rounded-2xl border-2 border-[#8B2500] bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <Download className="size-6 shrink-0 text-[#8B2500]" />
          <div className="min-w-0">
            <p className="font-black text-[#8B2500]">{tx.title}</p>
            <p className="text-sm text-[#333]">{ios && !event ? tx.ios : tx.body}</p>
          </div>
        </div>
        {event && (
          <Button onClick={() => void install()} className="mt-3 h-12 w-full bg-green-600 text-lg font-black text-white hover:bg-green-700">
            {tx.ok}
          </Button>
        )}
      </div>
    </div>
  );
}
