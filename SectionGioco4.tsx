import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import SectionCard from "./SectionCard.tsx";
import { useMemoryPairs } from "./ricordi/use-memory-pairs.ts";
import type { MemoryPair } from "./ricordi/memory-pairs.ts";

// Foto del quiz (id della foto a colori, o di quella unica se non c'è la coppia).
// Soggetti scelti ben distinti tra loro, per non rendere ambigue le 4 risposte.
const QUIZ_PHOTO_IDS = [
  "XCuvOGdsgesqge01JrLb2Y8I", "bjyPwNCrdNu6exaLR764R6Yq", "vhqyCZ1Ka6BN4HS4Ndvyc21I",
  "9HBaND5C2LSNXwyBbXk5IIHD", "qXTpl3npVGtg76zeipPEn1L9", "7SqWyg8gK3ibWizWo3ZEFihW",
  "jaFuBeYUZQYXnQMv5j4YjRU8", "s0zGubaBqSch4cs9PnHIyioz", "WAS3c7i301RmdWW3ThjV6zS7",
  "iqHhzhBPDI74eUsOX5mPhKhQ", "U54HxFKum6zKAZy2lRchPjNh", "S5evyCHk2Gmm3u43ZNLv19vx",
  "ICAMx3wNrgSFcmlLRI79127H", "CAosRtKxz5E05W9oss0BaPKH", "GIvAVdz6P0nNO2TbDOCNJNfb",
  "air8qY6s7LChvCe0VJeKoyDv", "13oKAAcIOE4qUjeMT5H3e05X", "gdNDAIQPsv8609P1FkwD6CHj",
  "44mIPEjLI6r5Uxmj5eOw6Ce2", "HZeBbjFSMD6QrIM2qIUFP8Ia",
];

type Question = { photo: string; answer: string; options: string[] };

const thumb = (id: string) =>
  `https://hercules-cdn.com/cdn-cgi/image/w=520,quality=60,format=auto/file_${id}`;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(pairs: MemoryPair[]): Question[] {
  const titleOf = (id: string) =>
    pairs.find((p) => p.right === id || (!p.right && p.left === id))?.title ?? "";
  const all = QUIZ_PHOTO_IDS.map((photo) => ({ photo, answer: titleOf(photo) })).filter((q) => q.answer);
  return shuffle(all).map((q) => {
    const wrong = shuffle(all.filter((o) => o.answer !== q.answer)).slice(0, 3).map((o) => o.answer);
    return { ...q, options: shuffle([q.answer, ...wrong]) };
  });
}

export default function SectionGioco4() {
  const { t } = useTranslation("gioco4");
  const pairs = useMemoryPairs();
  const [questions, setQuestions] = useState(() => buildQuestions(pairs));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const finished = index >= questions.length;
  const q = questions[index];

  const choose = (option: string) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };
  const restart = () => {
    setQuestions(buildQuestions(pairs));
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  if (finished) {
    return (
      <SectionCard title={t("title")} emoji="🔍">
        <div className="text-center space-y-3 py-6">
          <p className="m-0 text-4xl font-bold text-[#8B2500]">
            {score} / {questions.length}
          </p>
          <p className="m-0">{score >= 16 ? t("great") : score >= 10 ? t("good") : t("retry")}</p>
          <Button onClick={restart} className="cursor-pointer">
            <RotateCcw className="size-4" /> {t("playAgain")}
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={t("title")} emoji="🔍">
      <p className="mt-0 text-sm">{t("intro")}</p>
      <div className="flex justify-between text-sm font-bold text-[#8B2500] mb-2">
        <span>
          {t("photo")} {index + 1} / {questions.length}
        </span>
        <span>
          {t("score")}: {score}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e8c9a0] bg-stone-200">
        <img
          src={thumb(q.photo)}
          alt={picked ? q.answer : t("blurred")}
          className={`m-0 w-full h-56 sm:h-72 object-cover transition-all duration-500 ${picked ? "blur-0 scale-100" : "blur-[3px] scale-105"}`}
        />
      </div>

      <div className="mt-3 grid gap-2">
        {q.options.map((option) => {
          const isRight = option === q.answer;
          const state =
            picked === null
              ? "bg-white hover:bg-[#fff0e6] text-[#8B2500]"
              : isRight
                ? "bg-green-600 text-white"
                : option === picked
                  ? "bg-red-600 text-white"
                  : "bg-white text-[#8B2500] opacity-60";
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              disabled={picked !== null}
              className={`flex items-center justify-between gap-2 rounded-xl border border-[#e8c9a0] px-4 py-3 text-left text-sm font-bold cursor-pointer disabled:cursor-default ${state}`}
            >
              <span>{option}</span>
              {picked !== null && isRight && <Check className="size-4 shrink-0" />}
              {picked !== null && !isRight && option === picked && <X className="size-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <Button onClick={next} className="mt-3 w-full cursor-pointer">
          {index + 1 === questions.length ? t("results") : t("next")} <ChevronRight className="size-4" />
        </Button>
      )}
    </SectionCard>
  );
}
