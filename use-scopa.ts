import { useCallback, useEffect, useState } from "react";
import {
  applyMove,
  captureOptions,
  chooseAiMove,
  newHand,
  newMatch,
  type Card,
  type GameState,
  type Who,
} from "./scopa-engine.ts";

const AI_DELAY_MS = 1000;
const otherOf = (who: Who): Who => (who === "player" ? "ai" : "player");

export type PendingChoice = { card: Card; options: Card[][] };

export function useScopa() {
  const [state, setState] = useState<GameState>(() => newMatch("player"));
  const [pending, setPending] = useState<PendingChoice | null>(null);

  // Turno dell'IA: piccola pausa per far vedere la mossa
  useEffect(() => {
    if (state.phase !== "playing" || state.turn !== "ai") return;
    const id = window.setTimeout(() => {
      setState((s) => {
        if (s.phase !== "playing" || s.turn !== "ai") return s;
        const move = chooseAiMove(s);
        return applyMove(s, "ai", move.card, move.capture);
      });
    }, AI_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  const play = useCallback(
    (card: Card) => {
      if (state.phase !== "playing" || state.turn !== "player") return;
      const options = captureOptions(card, state.table);
      if (options.length > 1) {
        setPending({ card, options });
        return;
      }
      setPending(null);
      setState(applyMove(state, "player", card, options[0] ?? []));
    },
    [state],
  );

  const choose = useCallback(
    (capture: Card[]) => {
      if (!pending) return;
      setState(applyMove(state, "player", pending.card, capture));
      setPending(null);
    },
    [pending, state],
  );

  const cancel = useCallback(() => setPending(null), []);

  const nextHand = useCallback(() => {
    setState((s) => newHand(s.totals, otherOf(s.starter)));
  }, []);

  const restart = useCallback(() => {
    setPending(null);
    setState((s) => newMatch(otherOf(s.starter)));
  }, []);

  return { state, pending, play, choose, cancel, nextHand, restart };
}
