import { Share2 } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language.ts";
import type { Language } from "@/i18n.ts";
import Fireworks from "./_components/Fireworks.tsx";
import BottomNav from "./_components/BottomNav.tsx";
import CommunityImage from "./_components/CommunityImage.tsx";
import SiteEditor from "./_components/SiteEditor.tsx";
import WeatherWidget from "./_components/WeatherWidget.tsx";
import AvatarAssistente from "./_components/AvatarAssistente.tsx";
import AlertBanner from "./_components/AlertBanner.tsx";
import SplashScreen from "./_components/SplashScreen.tsx";
import AlertStatusBadge from "./_components/AlertStatusBadge.tsx";
import ProgrammerSpaceFooter from "./_components/ProgrammerSpaceFooter.tsx";
import PrivacyLink from "./_components/PrivacyLink.tsx";

// Tutte le sezioni sono caricate insieme all'avvio, così la navigazione è immediata.
import SectionStoria from "./_components/SectionStoria.tsx";
import SectionTurismo from "./_components/SectionTurismo.tsx";
import SectionMaps from "./_components/SectionMaps.tsx";
import SectionCastello from "./_components/SectionCastello.tsx";
import SectionFestivita from "./_components/SectionFestivita.tsx";
import SectionMare from "./_components/SectionMare.tsx";
import SectionComune from "./_components/SectionComune.tsx";
import SectionFarmacie from "./_components/SectionFarmacie.tsx";
import SectionVie from "./_components/SectionVie.tsx";
import SectionFrancigena from "./_components/SectionFrancigena.tsx";
import SectionEcologia from "./_components/SectionEcologia.tsx";
import SectionChiese from "./_components/SectionChiese.tsx";
import SectionProdotti from "./_components/SectionProdotti.tsx";
import SectionWebcam from "./_components/SectionWebcam.tsx";
import SectionCuriosita from "./_components/SectionCuriosita.tsx";
import SectionTurista from "./_components/SectionTurista.tsx";
import SectionHotel from "./_components/SectionHotel.tsx";
import SectionSegnalazioni from "./_components/SectionSegnalazioni.tsx";
import SectionChat from "./_components/SectionChat.tsx";
import SectionPolitica from "./_components/SectionPolitica.tsx";
import SectionSondaggi from "./_components/SectionSondaggi.tsx";
import SectionSondaggiStorico from "./_components/SectionSondaggiStorico.tsx";
import SectionRicette from "./_components/SectionRicette.tsx";
import SectionAnnunci from "./_components/SectionAnnunci.tsx";
import SectionMondo from "./_components/SectionMondo.tsx";
import SectionYouAlert from "./_components/SectionYouAlert.tsx";
import SectionAnziani from "./_components/SectionAnziani.tsx";
import SectionContapassi from "./_components/SectionContapassi.tsx";
import SectionRicordi from "./_components/SectionRicordi.tsx";
import SectionRistoranti from "./_components/SectionRistoranti.tsx";
import SectionLabirinto from "./_components/SectionLabirinto.tsx";
import SectionGioco3 from "./_components/SectionGioco3.tsx";
import SectionGioco4 from "./_components/SectionGioco4.tsx";
import SectionCase from "./_components/SectionCase.tsx";
import SectionGioco from "./_components/SectionGioco.tsx";
import SectionGiocoTrofei from "./_components/SectionGiocoTrofei.tsx";

export type SectionId =
  | "home"
  | "storia"
  | "turismo"
  | "maps"
  | "castello"
  | "festivita"
  | "mare"
  | "comune"
  | "farmacie"
  | "vie"
  | "francigena"
  | "ecologia"
  | "prodotti"
  | "chiese"
  | "webcam"
  | "curiosita"
  | "turista"
  | "hotel"
  | "segnalazioni"
  | "chat"
  | "politica"
  | "sondaggi"
  | "sondaggiStorico"
  | "ricette"
  | "annunci"
  | "case"
  | "mondo"
  | "contapassi"
  | "ricordi"
  | "capriolo"
  | "gioco3"
  | "gioco4"
  | "ristoranti"
  | "anziani"
  | "youalert"
  | "gioco"
  | "giocoTrofei";

const CASTLE_BG =
  "https://hercules-cdn.com/file_U5OV56MH2LcbCfnWBn3VVHLp";
const DEER_LOGO = "https://hercules-cdn.com/file_exgbQOpopbMnCfjGxTRCxSI6";

const FLAGS: { lang: Language; flag: string; title: string }[] = [
  { lang: "it", flag: "🇮🇹", title: "Italiano" },
  { lang: "de", flag: "🇩🇪", title: "Deutsch" },
  { lang: "en", flag: "🇬🇧", title: "English" },
  { lang: "fr", flag: "🇫🇷", title: "Français" },
  { lang: "bg", flag: "🇧🇬", title: "Български" },
];

const SECTION_KEY = "activeSection";
const SPLASH_KEY = "splashSeen";

// Memoria nel telefono (non solo nella scheda): se il browser chiude l'app in background,
// al rientro si ritrova la stessa pagina. Scade dopo 6 ore, poi si riparte dalla home.
const MEMORY_MS = 6 * 60 * 60 * 1000;

function safeStorage(op: "get" | "set", key: string, value?: string): string | null {
  try {
    if (op === "set") {
      localStorage.setItem(key, JSON.stringify({ value: value ?? "", at: Date.now() }));
      return null;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { value?: string; at?: number };
    const fresh = typeof saved.at === "number" && Date.now() - saved.at < MEMORY_MS;
    return fresh && saved.value ? saved.value : null;
  } catch {
    return null; // storage non disponibile (es. navigazione privata)
  }
}

function readSavedSection(): SectionId {
  const saved = safeStorage("get", SECTION_KEY);
  return saved ? (saved as SectionId) : "gioco3"; // TEMP
}

export default function Index() {
  // Sezione e splash sopravvivono a un eventuale ricaricamento della pagina
  // (il browser mobile scarica le schede in background per liberare memoria).
  const [activeSection, setActiveSectionState] = useState<SectionId>(readSavedSection);
  const [showSplash, setShowSplash] = useState(
    () => !safeStorage("get", SPLASH_KEY) || new URLSearchParams(window.location.search).has("evento"),
  );
  const setActiveSection = useCallback((s: SectionId) => {
    setActiveSectionState(s);
    safeStorage("set", SECTION_KEY, s);
  }, []);
  const { t } = useTranslation("common");
  const { currentLanguage, changeLanguage } = useLanguage();
  const hideSplash = useCallback(() => {
    safeStorage("set", SPLASH_KEY, "1");
    setShowSplash(false);
  }, []);

  return (
    <div
      className="relative h-screen flex flex-col overflow-hidden"
      style={{ background: "#fff" }}
    >
      {/* Splash screen all'avvio */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onDone={hideSplash} />
        )}
      </AnimatePresence>


      {/* Header — fisso, non scorre */}
      <header className="relative z-20 flex-shrink-0 pt-3 pb-2 px-4 bg-white/80 backdrop-blur-sm">
        {/* Fuochi artificiali solo sull'header */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-none z-0">
          <Fireworks />
        </div>
        {/* Riga principale: meteo sx | titolo centro | capriolo dx */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Capriolo nel cerchio sx */}
          <div className="flex-shrink-0 w-14 flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-full border-2 border-[#8B4513] shadow-md overflow-hidden cursor-pointer flex items-center justify-center bg-white"
              onClick={() => setActiveSection("home")}
            >
              <img
                src={DEER_LOGO}
                alt="Logo Capriolo SerraWithY❤U"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Titolo centro */}
          <button
            type="button"
            onClick={() => setActiveSection("home")}
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <motion.h1
              className="font-cursive text-3xl md:text-4xl lg:text-5xl text-[#8B2500] drop-shadow-sm select-none leading-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              SerraWithY❤U
            </motion.h1>
            <p className="text-[9px] text-[#8B2500] font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap">
              {t("subtitle")}
            </p>
          </button>
          {/* Meteo destra */}
          <div className="flex-shrink-0 w-14">
            <WeatherWidget />
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className={`relative z-20 flex-1 overflow-y-auto pt-0 ${activeSection === "chat" ? "px-0 pb-[72px] overflow-hidden flex flex-col" : "px-3 pb-[90px]"}`}>
        <>
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HomeSection onNavigate={setActiveSection} flags={FLAGS} currentLanguage={currentLanguage} changeLanguage={changeLanguage} />
            </motion.div>
          )}
          {activeSection === "storia" && (
            <motion.div key="storia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionStoria />
            </motion.div>
          )}
          {activeSection === "turismo" && (
            <motion.div key="turismo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionTurismo />
            </motion.div>
          )}
          {activeSection === "maps" && (
            <motion.div key="maps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionMaps />
            </motion.div>
          )}
          {activeSection === "castello" && (
            <motion.div key="castello" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionCastello />
            </motion.div>
          )}
          {activeSection === "festivita" && (
            <motion.div key="festivita" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionFestivita />
            </motion.div>
          )}
          {activeSection === "mare" && (
            <motion.div key="mare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionMare />
            </motion.div>
          )}
          {activeSection === "comune" && (
            <motion.div key="comune" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionComune />
            </motion.div>
          )}
          {activeSection === "farmacie" && (
            <motion.div key="farmacie" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionFarmacie />
            </motion.div>
          )}
          {activeSection === "vie" && (
            <motion.div key="vie" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionVie />
            </motion.div>
          )}
          {activeSection === "francigena" && (
            <motion.div key="francigena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionFrancigena />
            </motion.div>
          )}
          {activeSection === "ecologia" && (
            <motion.div key="ecologia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionEcologia />
            </motion.div>
          )}
          {activeSection === "prodotti" && (
            <motion.div key="prodotti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionProdotti />
            </motion.div>
          )}
          {activeSection === "chiese" && (
            <motion.div key="chiese" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionChiese />
            </motion.div>
          )}
          {activeSection === "webcam" && (
            <motion.div key="webcam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionWebcam />
            </motion.div>
          )}
          {activeSection === "curiosita" && (
            <motion.div key="curiosita" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionCuriosita />
            </motion.div>
          )}
          {activeSection === "turista" && (
            <motion.div key="turista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionTurista />
            </motion.div>
          )}
          {activeSection === "hotel" && (
            <motion.div key="hotel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionHotel />
            </motion.div>
          )}
          {activeSection === "segnalazioni" && (
            <motion.div key="segnalazioni" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionSegnalazioni />
            </motion.div>
          )}
          {activeSection === "chat" && (
            <motion.div key="chat" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionChat />
            </motion.div>
          )}
          {activeSection === "politica" && (
            <motion.div key="politica" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionPolitica />
            </motion.div>
          )}
          {activeSection === "sondaggi" && (
            <motion.div key="sondaggi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionSondaggi onNavigateStorico={() => setActiveSection("sondaggiStorico")} />
            </motion.div>
          )}
          {activeSection === "sondaggiStorico" && (
            <motion.div key="sondaggiStorico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionSondaggiStorico onBack={() => setActiveSection("sondaggi")} />
            </motion.div>
          )}
          {activeSection === "ricette" && (
            <motion.div key="ricette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionRicette />
            </motion.div>
          )}
          {activeSection === "annunci" && (
            <motion.div key="annunci" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionAnnunci />
            </motion.div>
          )}
          {activeSection === "mondo" && (
            <motion.div key="mondo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionMondo />
            </motion.div>
          )}
          {activeSection === "youalert" && (
            <motion.div key="youalert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionYouAlert />
            </motion.div>
          )}
          {activeSection === "anziani" && (
            <motion.div key="anziani" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionAnziani />
            </motion.div>
          )}
          {activeSection === "contapassi" && (
            <motion.div key="contapassi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionContapassi />
            </motion.div>
          )}
          {activeSection === "ricordi" && (
            <motion.div key="ricordi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionRicordi />
            </motion.div>
          )}
          {activeSection === "ristoranti" && (
            <motion.div key="ristoranti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionRistoranti />
            </motion.div>
          )}
          {activeSection === "capriolo" && (
            <motion.div key="capriolo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionLabirinto />
            </motion.div>
          )}
          {activeSection === "gioco3" && (
            <motion.div key="gioco3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionGioco3 />
            </motion.div>
          )}
          {activeSection === "gioco4" && (
            <motion.div key="gioco4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionGioco4 />
            </motion.div>
          )}
          {activeSection === "case" && (
            <motion.div key="case" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionCase />
            </motion.div>
          )}
          {activeSection === "gioco" && (
            <motion.div key="gioco" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionGioco onNavigateTrofei={() => setActiveSection("giocoTrofei")} />
            </motion.div>
          )}
          {activeSection === "giocoTrofei" && (
            <motion.div key="giocoTrofei" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionGiocoTrofei onBack={() => setActiveSection("gioco")} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Spazio del Programmatore — presente in fondo a tutte le pagine tranne la Chat
            (la Chat ha un proprio layout a schermo intero con input fisso in basso) */}
        {activeSection !== "chat" && <ProgrammerSpaceFooter />}
        </>
      </main>

      {/* Bottom Nav Frame */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNav active={activeSection} onSelect={setActiveSection} />
      </div>

      {/* Avatar Assistente vocale */}
      <AvatarAssistente />
      <AlertBanner />
      <SiteEditor />
    </div>
  );
}

// Condivisione sul profilo Facebook di chi preme il tasto: il link è quello del sito aperto.
const FACEBOOK_SHARE_URL = () =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent("SerraWithY♥U l'app di Serracapriola")}`;

const CORSO_GARIBALDI = "https://hercules-cdn.com/file_U5OV56MH2LcbCfnWBn3VVHLp";

function HomeSection({ flags, currentLanguage, changeLanguage }: { onNavigate: (s: SectionId) => void; flags: { lang: Language; flag: string; title: string }[]; currentLanguage: Language; changeLanguage: (lang: Language) => void }) {
  const { t } = useTranslation("common");
  const { t: tx } = useTranslation("extra");

  const stagger = {
    container: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.15,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    },
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto flex flex-col gap-8"
      variants={stagger.container}
      initial="hidden"
      animate="show"
    >
      {/* Ulivo millenario */}
      <motion.div variants={stagger.item} className="rounded-xl overflow-hidden shadow-md mt-0 relative">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1639220448675-8c01fdb446fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwyfHxvbGQlMjBvbGl2ZSUyMHRyZWUlMjB3aWRlJTIwY2Fub3B5JTIwbHVzaCUyMGZ1bGwlMjBncmVlbiUyMGJyYW5jaGVzJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4MzUzMDA0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Ulivo millenario - Serracapriola"
          className="w-full object-cover max-h-72"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-4 gap-2">
          <motion.img
            src="https://hercules-cdn.com/file_zgVxxi3svP6v7R07ihhN7a3s"
            alt="Logo SerraWithY❤U"
            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/80"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const }}
          />
          <span className="font-cursive text-4xl text-white drop-shadow-lg select-none">Serracapri<span className="text-red-500">♥</span>la</span>
          <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md select-none">270 m s.l.m.</span>
          <span className="text-white text-xs font-semibold tracking-wide drop-shadow-md text-center px-4">{t("oliveTagline")}</span>
          {/* Bandiere lingua */}
          <div className="flex justify-center gap-2 text-2xl mt-1">
            {flags.map((f, i) => (
              <motion.button
                key={f.lang}
                type="button"
                title={f.title}
                onClick={() => changeLanguage(f.lang)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`cursor-pointer leading-none transition-all ${
                  currentLanguage === f.lang
                    ? "scale-125 drop-shadow-md"
                    : "opacity-60 hover:opacity-100 hover:scale-110"
                }`}
              >
                {f.flag}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={stagger.item} className="text-center">
        <h2 className="text-2xl font-black text-[#8B2500] mb-2" style={{ WebkitTextStroke: "0.5px #8B2500" }}>{t("welcome")}</h2>
        <p className="text-[#333] text-sm font-black" style={{ WebkitTextStroke: "0.5px #333" }}>
          {t("description")}
        </p>
      </motion.div>

      {/* Badge avviso calamità — sempre visibile */}
      <motion.div variants={stagger.item}>
        <AlertStatusBadge />
      </motion.div>

      {/* Facebook links */}
      <motion.div variants={stagger.item} className="text-center flex flex-col gap-2">
        <p className="text-sm font-black text-[#8B2500] tracking-wide uppercase" style={{ WebkitTextStroke: "0.8px #8B2500" }}>{t("facebook")}</p>
        <div className="flex flex-col gap-1.5">
          <a
            href="https://www.facebook.com/share/g/1JtTSmdaY6/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-semibold shadow hover:bg-[#1664d8] transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            SerracapriolaOnLine
          </a>
          <a
            href="https://www.facebook.com/share/19cTWDsj32/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-semibold shadow hover:bg-[#1664d8] transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            Comune di Serracapriola
          </a>
        </div>
      </motion.div>

      {/* Corso Garibaldi photo */}
      <motion.div variants={stagger.item} className="rounded-xl overflow-hidden shadow-lg border border-[#8B2500]/20">
        <img
          src={CORSO_GARIBALDI}
          alt="Corso Garibaldi, Serracapriola"
          className="w-full object-cover"
        />
        <div className="bg-white/90 px-4 py-2 text-center">
          <span className="text-xs font-semibold text-[#8B2500] tracking-wide uppercase">{t("corso")}</span>
        </div>
        <div className="bg-white px-5 py-5 flex flex-col gap-3 border-t border-[#8B2500]/10">
          <p className="text-[#333] text-sm leading-relaxed">{t("corsoText1")}</p>
          <p className="text-[#333] text-sm leading-relaxed">{t("corsoText2")}</p>
          <p className="text-[#8B2500] text-sm font-semibold leading-relaxed italic">{t("corsoText3")}</p>
        </div>
      </motion.div>

      {/* Immagine di comunità sostituibile da chiunque */}
      <motion.div variants={stagger.item}>
        <CommunityImage />
      </motion.div>

      {/* QR Code */}
      <motion.div variants={stagger.item} className="flex flex-col items-center gap-2">
        <p className="text-sm font-black text-[#8B2500] tracking-wide text-center" style={{ WebkitTextStroke: "0.8px #8B2500" }}>
          {tx("qrBefore")} <span className="font-cursive text-lg">SerraWithY<span className="text-red-500">♥</span>U</span> {tx("qrAfter")}
        </p>
        <img
          src="https://hercules-cdn.com/file_zhP2q7dKza5xKWTaak6Xl15Q"
          alt="QR Code SerraWithY❤U"
          className="w-56 h-56 object-contain rounded-xl shadow-md border border-[#8B2500]/20"
        />
        <a
          href={FACEBOOK_SHARE_URL()}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2 text-sm font-bold text-white shadow-md no-underline cursor-pointer"
        >
          <Share2 className="size-4" /> {tx("shareFb")}
        </a>
      </motion.div>

      {/* Disclaimer legale */}
      <motion.div variants={stagger.item}>
        <p className="text-[10px] text-muted-foreground text-center leading-snug px-4">
          {t("disclaimer")}
        </p>
        <div className="mt-2 text-center">
          <PrivacyLink />
        </div>
      </motion.div>

      {/* Spazio bianco finale */}
      <div className="h-16" />
    </motion.div>
  );
}
