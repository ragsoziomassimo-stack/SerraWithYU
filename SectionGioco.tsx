import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, PartyPopper, XCircle, RotateCcw, ChevronRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { QUIZ_QUESTIONS, type QuizQuestion } from "./quizData.ts";

const JUMPING_DEER = "https://hercules-cdn.com/file_nYHw0t6z99wqv7dyrXbHh0G5";
const NICKNAME_KEY = "gioco_paese_nickname";

// Fisher-Yates shuffle, senza mutare l'array originale
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Prepara le domande per una partita: ordine domande casuale + ordine opzioni casuale
type Localized = { question: string; options: string[] };
const isLocalized = (v: unknown): v is Localized[] =>
  Array.isArray(v) && v.every((x) => typeof x === "object" && x !== null && "question" in x && "options" in x);

function prepareGame(texts: Localized[]): { question: QuizQuestion; shuffledOptions: string[]; correctOption: string }[] {
  // Domande e risposte nella lingua scelta (stesso ordine dell'originale italiano).
  const localized = QUIZ_QUESTIONS.map((q, i): QuizQuestion => ({
    ...q,
    question: texts[i]?.question ?? q.question,
    options: texts[i]?.options.length === q.options.length ? texts[i].options : q.options,
  }));
  const shuffledQuestions = shuffle(localized);
  return shuffledQuestions.map((q) => {
    const correctOption = q.options[q.correctIndex];
    return { question: q, shuffledOptions: shuffle(q.options), correctOption };
  });
}

type GameState = "intro" | "playing" | "lost" | "won";

interface Props {
  onNavigateTrofei: () => void;
}

export default function SectionGioco({ onNavigateTrofei }: Props) {
  const { t: tx } = useTranslation("extra");
  const { t: tq } = useTranslation("quiz");
  const raw: unknown = tq("questions", { returnObjects: true });
  const texts = isLocalized(raw) ? raw : [];
  const [state, setState] = useState<GameState>("intro");
  const [nickname, setNickname] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(NICKNAME_KEY) ?? "" : "",
  );
  const [game, setGame] = useState(() => prepareGame(texts));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const addWinner = useMutation(api.quiz.addWinner);

  const total = game.length;
  const current = game[currentIndex];
  const progressPct = Math.round((currentIndex / total) * 100);

  const startGame = () => {
    if (!nickname.trim()) return;
    localStorage.setItem(NICKNAME_KEY, nickname.trim());
    setGame(prepareGame(texts));
    setCurrentIndex(0);
    setSelected(null);
    setState("playing");
  };

  const restartGame = () => {
    setGame(prepareGame(texts));
    setCurrentIndex(0);
    setSelected(null);
    setState("playing");
  };

  const handleAnswer = async (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === current.correctOption;

    setTimeout(async () => {
      if (!isCorrect) {
        setState("lost");
        return;
      }
      if (currentIndex + 1 >= total) {
        setSaving(true);
        try {
          await addWinner({ nickname: nickname.trim() });
        } finally {
          setSaving(false);
        }
        setState("won");
        return;
      }
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }, 900);
  };

  const rulesText = tx("gRules", { count: QUIZ_QUESTIONS.length });

  return (
    <div className="p-4 max-w-xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-4xl">🦌</span>
        <h2 className="text-2xl font-bold text-[#8B2500] font-cursive">{tx("gTitle")}</h2>
        <p className="text-sm text-[#555]">{tx("gSub")}</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNavigateTrofei}
          className="flex items-center gap-2 text-xs font-bold text-[#8B2500] bg-[#fff0e6] border border-[#e8c9a0] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#ffe4cc] transition-colors"
        >
          <Trophy className="w-3.5 h-3.5" />
          {tx("gTrophies")}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {state === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/90 border border-[#e8c9a0] rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <p className="text-sm text-[#333] leading-relaxed">{rulesText}</p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#8B2500] uppercase tracking-wide">
                {tx("gNick")}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={tx("gNickPh")}
                maxLength={30}
                className="w-full rounded-xl border border-[#e8c9a0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2500]/40 bg-white"
              />
            </div>
            <button
              onClick={startGame}
              disabled={!nickname.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B2500] text-white font-bold text-sm shadow hover:bg-[#6e1c00] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tx("gStart")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {state === "playing" && current && (
          <motion.div
            key={`q-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Barra di progresso */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#8B2500]">
                <span>{tx("gQuestion", { n: currentIndex + 1, total })}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 w-full bg-[#f0e0d0] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#8B2500] rounded-full"
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="bg-white/90 border border-[#e8c9a0] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#8B2500] leading-snug">
                {current.question.question}
              </h3>
              <div className="space-y-2.5">
                {current.shuffledOptions.map((option) => {
                  const isSelected = selected === option;
                  const isCorrectOption = option === current.correctOption;
                  const showResult = selected !== null;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={selected !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer
                        ${
                          showResult && isCorrectOption
                            ? "border-green-600 bg-green-50 text-green-700"
                            : showResult && isSelected
                              ? "border-red-500 bg-red-50 text-red-600"
                              : "border-[#e8c9a0] bg-white text-[#333] hover:bg-[#fff0e6]"
                        }
                        ${selected !== null ? "cursor-default" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {state === "lost" && (
          <motion.div
            key="lost"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-sm"
          >
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-red-600">{tx("gWrong")}</h3>
            <p className="text-sm text-[#555]">
              {tx("gWrongText", { n: currentIndex + 1, total })}
            </p>
            <button
              onClick={restartGame}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B2500] text-white font-bold text-sm shadow hover:bg-[#6e1c00] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {tx("gRetry")}
            </button>
          </motion.div>
        )}

        {state === "won" && (
          <motion.div
            key="won"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 border border-green-200 rounded-2xl p-6 text-center space-y-4 shadow-sm overflow-hidden"
          >
            <motion.img
              src={JUMPING_DEER}
              alt={tx("gDeerAlt")}
              className="w-40 h-40 mx-auto object-contain"
              initial={{ y: 0 }}
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex items-center justify-center gap-2">
              <PartyPopper className="w-6 h-6 text-[#8B2500]" />
              <h3 className="text-2xl font-bold text-[#8B2500] font-cursive">{tx("gWon")}</h3>
              <PartyPopper className="w-6 h-6 text-[#8B2500]" />
            </div>
            <p className="text-sm text-[#555]">
              {tx("gCongrats")} <span className="font-bold text-[#8B2500]">{nickname}</span>! {tx("gWonText", { total })}{" "}
              {saving ? tx("gSaving") : tx("gSaved")}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={onNavigateTrofei}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B2500] text-white font-bold text-sm shadow hover:bg-[#6e1c00] transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                {tx("gSeeTrophies")}
              </button>
              <button
                onClick={restartGame}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#e8c9a0] text-[#8B2500] font-semibold text-sm cursor-pointer hover:bg-[#fff0e6] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {tx("gAgain")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
