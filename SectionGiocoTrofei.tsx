import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it, de, enUS, fr, bg, es } from "date-fns/locale";
import type { Locale } from "date-fns";
import { useTranslation } from "react-i18next";

const DATE_LOCALES: Record<string, Locale> = {
  it, de, en: enUS, fr, bg, es,
};

interface Props {
  onBack: () => void;
}

export default function SectionGiocoTrofei({ onBack }: Props) {
  const { i18n } = useTranslation();
  const { t: tx } = useTranslation("extra");
  const winners = useQuery(api.quiz.listWinners, {});
  const locale = DATE_LOCALES[i18n.language] ?? enUS;

  const medalColor = (rank: number) => {
    if (rank === 0) return "text-yellow-500";
    if (rank === 1) return "text-gray-400";
    if (rank === 2) return "text-amber-700";
    return "text-[#c9a679]";
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-5 pb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#8B2500] cursor-pointer hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        {tx("tBack")}
      </button>

      <div className="text-center space-y-1">
        <Trophy className="w-10 h-10 text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold text-[#8B2500] font-cursive">{tx("tTitle")}</h2>
        <p className="text-sm text-[#555]">
          {tx("tSub")}
        </p>
      </div>

      <div className="space-y-2.5">
        {winners === undefined ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
        ) : winners.length === 0 ? (
          <div className="text-center py-10 text-[#aaa] text-sm">
            {tx("tEmpty")}
          </div>
        ) : (
          winners.map((w, i) => (
            <div
              key={w._id}
              className="flex items-center gap-3 bg-white/90 border border-[#e8c9a0] rounded-xl px-4 py-3 shadow-sm"
            >
              <Medal className={`w-6 h-6 flex-shrink-0 ${medalColor(i)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#8B2500] truncate">{w.nickname}</p>
                <p className="text-xs text-[#aaa]">
                  {formatDistanceToNow(new Date(w.completedAt), { addSuffix: true, locale })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
