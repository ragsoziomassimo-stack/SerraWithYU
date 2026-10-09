import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const DEER_LOGO = "https://hercules-cdn.com/file_exgbQOpopbMnCfjGxTRCxSI6";

// Rete di sicurezza per tutta l'app: se un componente qualsiasi va in errore
// durante il rendering, mostra una schermata di recupero invece di far
// scomparire/riavviare l'intero sito senza spiegazione.
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AppErrorBoundary caught an error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-[#fffaf5] px-6 text-center">
          <img
            src={DEER_LOGO}
            alt="Logo Capriolo SerraWithY❤U"
            className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-[#8B2500]/30"
          />
          <h1 className="text-xl font-bold text-[#8B2500] font-cursive">Ops, qualcosa è andato storto</h1>
          <p className="text-sm text-[#555] max-w-xs">
            Si è verificato un piccolo inconveniente. Premi il pulsante per ricaricare l&apos;app.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B2500] text-white font-bold text-sm shadow hover:bg-[#6e1c00] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Ricarica l&apos;app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Variante silenziosa per widget secondari (es. badge notifiche): se vanno in
// errore, semplicemente scompaiono senza mostrare la schermata di recupero.
export class SilentErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SilentErrorBoundary caught an error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
