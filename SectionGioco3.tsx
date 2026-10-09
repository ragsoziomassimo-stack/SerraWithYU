import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";
import SectionCard from "./SectionCard.tsx";
import PlayingCard from "./scopa/PlayingCard.tsx";
import HandSummary from "./scopa/HandSummary.tsx";
import { useScopa } from "./scopa/use-scopa.ts";
import { TARGET_SCORE, type Card, type LastMove } from "./scopa/scopa-engine.ts";

function useCardName() {
  const { t } = useTranslation("gioco3");
  return (c: Card) =>
    t("of", { value: c.value >= 8 ? t(`face_${c.value}`) : c.value, suit: t(`suit_${c.suit}`) });
}

export default function SectionGioco3() {
  const { t } = useTranslation("gioco3");
  const cardName = useCardName();
  const { state, pending, play, choose, cancel, nextHand, restart } = useScopa();
  const playing = state.phase === "playing";
  const myTurn = playing && state.turn === "player";

  const describe = (m: LastMove): string => {
    const key = m.who === "ai" ? (m.captured.length ? "aiTook" : "aiDropped") : m.captured.length ? "youTook" : "youDropped";
    return t(key, { card: cardName(m.card) });
  };

  const highlighted = new Set(pending?.options.flat().map((c) => c.id));

  // Un click sulla carta del tavolo sceglie la presa; se la carta compare in più opzioni si usa il pannello sotto
  const pickFromTable = (c: Card) => {
    const matches = pending?.options.filter((opt) => opt.some((x) => x.id === c.id)) ?? [];
    if (matches.length === 1) choose(matches[0]);
  };

  return (
    <SectionCard title={t("title")} emoji="🃏">
      <p className="mt-0 mb-0 text-center text-sm font-bold">{t("subtitle1")}</p>
      <p className="mt-1 text-center text-sm">{t("subtitle2")}</p>

      <div className="mb-3 flex items-center justify-between rounded-xl bg-[#fff0e6] px-3 py-2 text-sm font-bold text-[#8B2500]">
        <span>
          {t("you")}: {state.totals.player}
        </span>
        <span className="text-xs font-normal">{t("goal", { n: TARGET_SCORE })}</span>
        <span>
          {t("ai")}: {state.totals.ai}
        </span>
      </div>

      <div className="rounded-2xl bg-[#2f6b3c] p-3 shadow-inner">
        <div className="flex items-center justify-between text-xs text-white">
          <span>
            {t("ai")} · {t("scope")}: {state.scope.ai}
          </span>
          <span>{t("deckLeft", { n: state.deck.length })}</span>
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {state.hands.ai.map((c) => (
            <PlayingCard key={c.id} hidden />
          ))}
        </div>

        <p className="mb-1 mt-3 text-center text-xs font-bold text-white/80">{t("table")}</p>
        <div className="flex min-h-28 flex-wrap items-center justify-center gap-2">
          {state.table.length === 0 && <span className="text-sm text-white/70">{t("tableEmpty")}</span>}
          {state.table.map((c) => (
            <PlayingCard
              key={c.id}
              card={c}
              highlight={highlighted.has(c.id)}
              disabled={!highlighted.has(c.id)}
              onClick={() => pickFromTable(c)}
            />
          ))}
        </div>

        <p className="mb-1 mt-3 text-center text-xs font-bold text-white/80">
          {t("yourHand")} · {t("scope")}: {state.scope.player}
        </p>
        <div className="flex justify-center gap-2">
          {state.hands.player.map((c) => (
            <PlayingCard
              key={c.id}
              card={c}
              highlight={pending?.card.id === c.id}
              disabled={!myTurn || pending !== null}
              onClick={() => play(c)}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 min-h-10 text-center text-sm">
        {state.lastMove?.scopa && <p className="m-0 text-lg font-bold text-amber-600">{t("scopaMsg")}</p>}
        {state.lastMove && <p className="m-0 text-xs text-stone-600">{describe(state.lastMove)}</p>}
        {playing && !pending && (
          <p className="m-0 font-bold text-[#8B2500]">{myTurn ? t("yourTurn") : t("aiThinking")}</p>
        )}
      </div>

      {pending && (
        <div className="rounded-2xl border border-amber-400 bg-amber-50 p-3">
          <p className="m-0 mb-2 text-center text-sm font-bold text-[#8B2500]">{t("chooseCapture")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {pending.options.map((opt) => (
              <button
                key={opt.map((c) => c.id).join("+")}
                type="button"
                onClick={() => choose(opt)}
                className="flex cursor-pointer gap-1 rounded-xl border-2 border-[#c9a36b] bg-white p-2 hover:border-amber-500"
              >
                {opt.map((c) => (
                  <PlayingCard key={c.id} card={c} small disabled />
                ))}
              </button>
            ))}
          </div>
          <Button onClick={cancel} variant="ghost" size="sm" className="mt-2 w-full cursor-pointer">
            {t("cancel")}
          </Button>
        </div>
      )}

      {!playing && <HandSummary state={state} onNext={nextHand} onRestart={restart} />}

      <p className="mb-0 mt-4 text-center text-[10px] leading-snug text-muted-foreground">{t("disclaimer")}</p>
    </SectionCard>
  );
}
