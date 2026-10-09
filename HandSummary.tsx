import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Frown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";
import type { GameState, HandBreakdown, Who } from "./scopa-engine.ts";
import { TARGET_SCORE } from "./scopa-engine.ts";

type Props = { state: GameState; onNext: () => void; onRestart: () => void };

const ROWS: ("carte" | "denari" | "settebello" | "primiera")[] = ["carte", "denari", "settebello", "primiera"];

function Cell({ b, row }: { b: HandBreakdown; row: (typeof ROWS)[number] }) {
  return <td className="text-center">{b[row] ? "✓" : "–"}</td>;
}

// Riepilogo di fine mano (e, se finita, di fine partita)
export default function HandSummary({ state, onNext, onRestart }: Props) {
  const { t } = useTranslation("gioco3");
  const result = state.handResult;
  const matchOver = state.phase === "matchOver";
  const winner: Who = state.totals.player > state.totals.ai ? "player" : "ai";
  const playerWon = matchOver && winner === "player";

  // Coriandoli lanciati verso l'alto una sola volta quando l'utente vince la partita
  useEffect(() => {
    if (!playerWon) return;
    const burst = (originX: number) =>
      confetti({ particleCount: 90, spread: 80, angle: 90, startVelocity: 55, origin: { x: originX, y: 0.9 } });
    burst(0.2);
    burst(0.5);
    burst(0.8);
  }, [playerWon]);

  if (!result) return null;

  return (
    <div className="mt-3 rounded-2xl border border-[#e8c9a0] bg-[#fff8ee] p-4 text-sm">
      {matchOver && !playerWon && (
        <div className="mb-2 flex flex-col items-center">
          <Frown className="size-14 text-[#8B2500]" />
          <p className="m-0 text-2xl font-bold text-[#8B2500]">{t("retry")}</p>
        </div>
      )}
      <p className="m-0 mb-2 text-center font-bold text-[#8B2500]">
        {matchOver ? (winner === "player" ? t("youWin") : t("youLose")) : t("handOver")}
      </p>
      <table className="m-0 w-full">
        <thead>
          <tr className="text-[#8B2500]">
            <th />
            <th>{t("you")}</th>
            <th>{t("ai")}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row}>
              <td>{t(row)}</td>
              <Cell b={result.player} row={row} />
              <Cell b={result.ai} row={row} />
            </tr>
          ))}
          <tr>
            <td>{t("scope")}</td>
            <td className="text-center">{result.player.scope}</td>
            <td className="text-center">{result.ai.scope}</td>
          </tr>
          <tr className="font-bold">
            <td>{t("points")}</td>
            <td className="text-center">+{result.player.total}</td>
            <td className="text-center">+{result.ai.total}</td>
          </tr>
          <tr className="font-bold text-[#8B2500]">
            <td>
              {t("total")} / {TARGET_SCORE}
            </td>
            <td className="text-center">{state.totals.player}</td>
            <td className="text-center">{state.totals.ai}</td>
          </tr>
        </tbody>
      </table>
      <Button onClick={matchOver ? onRestart : onNext} className="mt-3 w-full cursor-pointer">
        {matchOver ? t("newMatch") : t("nextHand")}
      </Button>
    </div>
  );
}
