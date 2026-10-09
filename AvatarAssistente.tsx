import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Mic, MicOff, X, Volume2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language.ts";

const DEER_LOGO = "https://hercules-cdn.com/file_ZKgfTbNvoN0kLty11MNohV2I";

const SALUTI: Record<string, string> = {
  it: "Ciao, sono Xana il tuo avatar di viaggio, come posso aiutarti?",
  de: "Hallo, ich bin Xana, dein Reise-Avatar – wie kann ich dir helfen?",
  en: "Hello, I'm Xana your travel avatar, how can I help you?",
  fr: "Bonjour, je suis Xana votre avatar de voyage, comment puis-je vous aider ?",
  bg: "Здравейте, аз съм Xana вашият пътеводител, как мога да ви помогна?",
};

const SPEECH_LANG: Record<string, string> = {
  it: "it-IT",
  de: "de-DE",
  en: "en-US",
  fr: "fr-FR",
  bg: "bg-BG",
};

const SUBTITLES: Record<string, string> = {
  it: "Assistente di Serracapriola",
  de: "Reiseassistent Serracapriola",
  en: "Serracapriola Travel Guide",
  fr: "Guide de voyage Serracapriola",
  bg: "Пътеводител Серракаприола",
};

const PLACEHOLDER: Record<string, string> = {
  it: "Scrivi o parla...",
  de: "Schreib oder sprich...",
  en: "Type or speak...",
  fr: "Écrivez ou parlez...",
  bg: "Пишете или говорете...",
};

const ERROR_MSG: Record<string, string> = {
  it: "Qualcosa non ha funzionato! Riprova tra poco.",
  de: "Etwas hat nicht geklappt! Versuch es bitte nochmal.",
  en: "Something went wrong! Please try again.",
  fr: "Quelque chose s'est mal passé ! Réessayez.",
  bg: "Нещо се обърка! Моля, опитайте отново.",
};

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function AvatarAssistente() {
  const { t: tx } = useTranslation("extra");
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage in SALUTI ? currentLanguage : "it";

  const [aperto, setAperto] = useState(false);
  const [salutato, setSalutato] = useState(false);
  const [messaggi, setMessaggi] = useState<ChatMessage[]>([]);
  const [ascolto, setAscolto] = useState(false);
  const [pensando, setPensando] = useState(false);
  const [testoDomanda, setTestoDomanda] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chiedi = useAction(api.assistente.chiedi);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesCacheRef = useRef<SpeechSynthesisVoice[]>([]);

  // Pre-carica le voci appena disponibili (alcune browser le caricano async)
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synthRef.current = synth;
    const caricaVoci = () => {
      voicesCacheRef.current = synth.getVoices();
    };
    caricaVoci();
    synth.addEventListener("voiceschanged", caricaVoci);
    return () => synth.removeEventListener("voiceschanged", caricaVoci);
  }, []);

  // Leggi ad alta voce nella lingua corrente con voce maschile
  const leggi = useCallback((testo: string, lingua: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    // Toglie punteggiatura e simboli, così la voce non li legge
    const testoPulito = testo
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!testoPulito) return;
    const utterance = new SpeechSynthesisUtterance(testoPulito);
    const langCode = SPEECH_LANG[lingua] ?? "it-IT";
    const langPrefix = langCode.split("-")[0] ?? langCode;
    utterance.lang = langCode;
    utterance.rate = 1.25;
    utterance.pitch = 1.0; // pitch naturale — la mascolinità viene dalla selezione della voce

    // Cerca voce maschile: prima per nome, poi escludendo femminile, poi qualsiasi della lingua
    const voci = voicesCacheRef.current.length > 0
      ? voicesCacheRef.current
      : synthRef.current.getVoices();

    const voceMaschile =
      // 1. Voce esplicitamente maschile nella lingua
      voci.find((v) => v.lang.startsWith(langPrefix) && /\bmale\b|uomo|mann|homme|мъж|\bman\b/i.test(v.name)) ??
      // 2. Voce della lingua senza "female/donna/frau" nel nome
      voci.find((v) => v.lang.startsWith(langPrefix) && !/female|donna|frau|femme|жена|woman|girl/i.test(v.name)) ??
      // 3. Qualsiasi voce della lingua
      voci.find((v) => v.lang.startsWith(langPrefix));

    if (voceMaschile) utterance.voice = voceMaschile;
    synthRef.current.speak(utterance);
  }, []);

  // Apri e saluta nella lingua corrente
  useEffect(() => {
    if (aperto && !salutato) {
      setSalutato(true);
      const saluto = SALUTI[lang] ?? SALUTI["it"];
      setMessaggi([{ role: "assistant", text: saluto }]);
      leggi(saluto, lang);
    }
  }, [aperto, salutato, leggi, lang]);

  // Reset saluto quando cambia lingua — ri-saluta subito se la chat è aperta
  useEffect(() => {
    setSalutato(false);
    setMessaggi([]);
  }, [currentLanguage]);

  // Scroll in fondo alla chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messaggi, pensando]);

  // Invia domanda
  const inviaDomanda = useCallback(async (testo: string) => {
    if (!testo.trim() || pensando) return;
    const domanda = testo.trim();
    const linguaCorrente = lang;
    setTestoDomanda("");
    setMessaggi((prev) => [...prev, { role: "user", text: domanda }]);
    setPensando(true);
    try {
      const { risposta } = await chiedi({ domanda, lingua: linguaCorrente });
      setMessaggi((prev) => [...prev, { role: "assistant", text: risposta }]);
      leggi(risposta, linguaCorrente);
    } catch {
      const errore = ERROR_MSG[linguaCorrente] ?? ERROR_MSG["it"];
      setMessaggi((prev) => [...prev, { role: "assistant", text: errore }]);
    } finally {
      setPensando(false);
    }
  }, [chiedi, pensando, leggi, lang]);

  // Avvia riconoscimento vocale nella lingua corrente
  const avviaAscolto = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      alert(tx("avNoSpeech"));
      return;
    }
    const recognition = new SR();
    recognition.lang = SPEECH_LANG[lang] ?? "it-IT";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const trascrizione = event.results[0]?.[0]?.transcript ?? "";
      if (trascrizione) {
        void inviaDomanda(trascrizione);
      }
    };
    recognition.onerror = () => setAscolto(false);
    recognition.onend = () => setAscolto(false);

    recognitionRef.current = recognition;
    recognition.start();
    setAscolto(true);
  }, [inviaDomanda, lang, tx]);

  const fermaAscolto = useCallback(() => {
    recognitionRef.current?.stop();
    setAscolto(false);
  }, []);

  return (
    <>
      {/* Avatar flottante */}
      <div className="fixed bottom-[126px] right-3 z-50">
        <motion.button
          type="button"
          onClick={() => setAperto((v) => !v)}
          className="w-14 h-14 cursor-pointer relative block"
          style={{ background: "transparent", border: "none", padding: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={tx("avTitle")}
        >
          {/* Maschera Guy Fawkes senza cappello, sfondo rimosso via Canvas */}
          <div className="w-full h-full">
            <img
              src={DEER_LOGO}
              alt="XANA assistente"
              className="w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
            />
          </div>
          {ascolto && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Chat popup */}
      <AnimatePresence>
        {aperto && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-[198px] right-3 z-50 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-2xl border border-[#8B4513]/20 flex flex-col overflow-hidden"
            style={{ maxHeight: "60vh" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#8B2500] px-4 py-3 flex-shrink-0">
              <img
                src={DEER_LOGO}
                alt="Capriolo"
                className="w-9 h-9 rounded-full border-2 border-white/70 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">XANA</p>
                <p className="text-white/70 text-[10px]">{SUBTITLES[lang] ?? SUBTITLES["it"]}</p>
              </div>
              <button
                type="button"
                onClick={() => setAperto(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messaggi */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#fdf6ee]">
              {messaggi.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 items-end ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "assistant" && (
                    <img
                      src={DEER_LOGO}
                      alt="Capriolo"
                      className="w-7 h-7 rounded-full border border-[#8B4513]/30 object-cover flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-white text-[#333] shadow-sm rounded-bl-sm border border-[#8B4513]/10"
                        : "bg-[#8B2500] text-white rounded-br-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => leggi(msg.text, lang)}
                      className="text-[#8B4513]/50 hover:text-[#8B4513] cursor-pointer flex-shrink-0"
                      title={tx("avListen")}
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              ))}
              {pensando && (
                <div className="flex gap-2 items-end">
                  <img
                    src={DEER_LOGO}
                    alt="Capriolo"
                    className="w-7 h-7 rounded-full border border-[#8B4513]/30 object-cover flex-shrink-0"
                  />
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-[#8B4513]/10">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#8B4513]"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 px-3 py-2 bg-white border-t border-[#8B4513]/10 flex gap-2 items-center">
              <input
                type="text"
                value={testoDomanda}
                onChange={(e) => setTestoDomanda(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void inviaDomanda(testoDomanda)}
                placeholder={PLACEHOLDER[lang] ?? PLACEHOLDER["it"]}
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-[#8B4513]/20 outline-none focus:border-[#8B2500] bg-[#fdf6ee]"
                disabled={pensando}
              />
              <button
                type="button"
                onClick={ascolto ? fermaAscolto : avviaAscolto}
                disabled={pensando}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                  ascolto
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20"
                }`}
                title={ascolto ? "Stop" : "Speak"}
              >
                {ascolto ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                type="button"
                onClick={() => void inviaDomanda(testoDomanda)}
                disabled={pensando || !testoDomanda.trim()}
                className="w-9 h-9 rounded-full bg-[#8B2500] text-white flex items-center justify-center flex-shrink-0 cursor-pointer disabled:opacity-40 hover:bg-[#6B1800] transition-colors"
                title={tx("avSend")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
