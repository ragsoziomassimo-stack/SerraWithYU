// Motore puro della scopa (mazzo napoletano da 40 carte). Nessuna dipendenza da React.

export type Suit = "denari" | "coppe" | "spade" | "bastoni";
export type Who = "player" | "ai";
export type Card = { id: string; suit: Suit; value: number };

export const SUITS: Suit[] = ["denari", "coppe", "spade", "bastoni"];
export const TARGET_SCORE = 15;

const PRIMIERA_POINTS: Record<number, number> = { 7: 21, 6: 18, 1: 16, 5: 15, 4: 14, 3: 13, 2: 12, 8: 10, 9: 10, 10: 10 };

export type HandBreakdown = {
  carte: boolean;
  denari: boolean;
  settebello: boolean;
  primiera: boolean;
  scope: number;
  total: number;
};

export type LastMove = { who: Who; card: Card; captured: Card[]; scopa: boolean };

export type GameState = {
  deck: Card[];
  table: Card[];
  hands: Record<Who, Card[]>;
  captured: Record<Who, Card[]>;
  scope: Record<Who, number>;
  lastCapturer: Who | null;
  turn: Who;
  starter: Who;
  totals: Record<Who, number>;
  phase: "playing" | "handOver" | "matchOver";
  handResult: Record<Who, HandBreakdown> | null;
  lastMove: LastMove | null;
};

const other = (who: Who): Who => (who === "player" ? "ai" : "player");

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    Array.from({ length: 10 }, (_, i) => ({ id: `${suit}-${i + 1}`, suit, value: i + 1 })),
  );
}

export function isSettebello(c: Card): boolean {
  return c.suit === "denari" && c.value === 7;
}

export function newHand(totals: Record<Who, number>, starter: Who): GameState {
  const deck = shuffle(createDeck());
  return {
    table: deck.splice(0, 4),
    hands: { player: deck.splice(0, 3), ai: deck.splice(0, 3) },
    deck,
    captured: { player: [], ai: [] },
    scope: { player: 0, ai: 0 },
    lastCapturer: null,
    turn: starter,
    starter,
    totals,
    phase: "playing",
    handResult: null,
    lastMove: null,
  };
}

export function newMatch(starter: Who): GameState {
  return newHand({ player: 0, ai: 0 }, starter);
}

// Regola: se c'è una carta uguale sul tavolo si deve prendere quella; altrimenti una somma.
export function captureOptions(card: Card, table: Card[]): Card[][] {
  const same = table.filter((c) => c.value === card.value);
  if (same.length > 0) return same.map((c) => [c]);
  const result: Card[][] = [];
  const walk = (start: number, picked: Card[], sum: number) => {
    if (sum === card.value) {
      result.push(picked);
      return;
    }
    for (let i = start; i < table.length; i++) {
      if (sum + table[i].value <= card.value) walk(i + 1, [...picked, table[i]], sum + table[i].value);
    }
  };
  walk(0, [], 0);
  return result;
}

function primieraScore(cards: Card[]): number | null {
  let sum = 0;
  for (const suit of SUITS) {
    const best = Math.max(0, ...cards.filter((c) => c.suit === suit).map((c) => PRIMIERA_POINTS[c.value]));
    if (best === 0) return null; // senza tutti i semi non si ha la primiera
    sum += best;
  }
  return sum;
}

export function scoreHand(
  captured: Record<Who, Card[]>,
  scope: Record<Who, number>,
): Record<Who, HandBreakdown> {
  const p = captured.player;
  const a = captured.ai;
  const denariP = p.filter((c) => c.suit === "denari").length;
  const denariA = a.filter((c) => c.suit === "denari").length;
  const primP = primieraScore(p);
  const primA = primieraScore(a);
  const build = (who: Who): HandBreakdown => {
    const mine = captured[who];
    const mineDenari = who === "player" ? denariP : denariA;
    const theirDenari = who === "player" ? denariA : denariP;
    const mineP = who === "player" ? primP : primA;
    const theirP = who === "player" ? primA : primP;
    const carte = mine.length > captured[other(who)].length;
    const denari = mineDenari > theirDenari;
    const settebello = mine.some(isSettebello);
    const primiera = mineP !== null && (theirP === null || mineP > theirP);
    const points = scope[who] + [carte, denari, settebello, primiera].filter(Boolean).length;
    return { carte, denari, settebello, primiera, scope: scope[who], total: points };
  };
  return { player: build("player"), ai: build("ai") };
}

function finishHand(state: GameState): GameState {
  const captured = { player: [...state.captured.player], ai: [...state.captured.ai] };
  // Le carte rimaste sul tavolo vanno a chi ha fatto l'ultima presa
  if (state.lastCapturer) captured[state.lastCapturer].push(...state.table);
  const handResult = scoreHand(captured, state.scope);
  const totals = {
    player: state.totals.player + handResult.player.total,
    ai: state.totals.ai + handResult.ai.total,
  };
  const over = Math.max(totals.player, totals.ai) >= TARGET_SCORE && totals.player !== totals.ai;
  return {
    ...state,
    captured,
    table: [],
    totals,
    handResult,
    phase: over ? "matchOver" : "handOver",
  };
}

export function applyMove(state: GameState, who: Who, card: Card, capture: Card[]): GameState {
  const hands = { ...state.hands, [who]: state.hands[who].filter((c) => c.id !== card.id) };
  let table = state.table;
  const captured = { player: state.captured.player, ai: state.captured.ai };
  const scope = { ...state.scope };
  let lastCapturer = state.lastCapturer;
  let scopa = false;

  if (capture.length > 0) {
    const ids = new Set(capture.map((c) => c.id));
    table = table.filter((c) => !ids.has(c.id));
    captured[who] = [...captured[who], card, ...capture];
    lastCapturer = who;
    const moreToPlay = state.deck.length > 0 || hands.player.length + hands.ai.length > 0;
    if (table.length === 0 && moreToPlay) {
      scope[who] += 1;
      scopa = true;
    }
  } else {
    table = [...table, card];
  }

  let next: GameState = {
    ...state,
    hands,
    table,
    captured,
    scope,
    lastCapturer,
    turn: other(who),
    lastMove: { who, card, captured: capture, scopa },
  };

  if (hands.player.length === 0 && hands.ai.length === 0) {
    if (next.deck.length > 0) {
      const deck = [...next.deck];
      next = { ...next, hands: { player: deck.splice(0, 3), ai: deck.splice(0, 3) }, deck };
    } else {
      next = finishHand(next);
    }
  }
  return next;
}

function cardValueForAi(c: Card): number {
  return (isSettebello(c) ? 8 : 0) + (c.suit === "denari" ? 2 : 0) + (c.value === 7 ? 3 : 0) + (c.value === 1 ? 1 : 0) + 1;
}

// L'IA sceglie la mossa con un punteggio semplice: scope, settebello, denari, 7 e numero di carte.
export function chooseAiMove(state: GameState): { card: Card; capture: Card[] } {
  let best: { card: Card; capture: Card[]; score: number } | null = null;
  for (const card of state.hands.ai) {
    const options = captureOptions(card, state.table);
    const choices = options.length > 0 ? options : [[]];
    for (const capture of choices) {
      let score: number;
      if (capture.length > 0) {
        const taken = [card, ...capture];
        const clears = capture.length === state.table.length;
        const moreToPlay = state.deck.length > 0 || state.hands.player.length + state.hands.ai.length > 1;
        score = 20 + taken.reduce((s, c) => s + cardValueForAi(c), 0) + (clears && moreToPlay ? 12 : 0);
      } else {
        const remaining = [...state.table, card];
        const sum = remaining.reduce((s, c) => s + c.value, 0);
        // Rischio: se la somma sul tavolo è <= 10 l'avversario può fare scopa
        score = -cardValueForAi(card) * 2 - (sum <= 10 ? 8 : 0) + Math.random();
      }
      if (!best || score > best.score) best = { card, capture, score };
    }
  }
  if (!best) throw new Error("L'IA non ha carte da giocare");
  return { card: best.card, capture: best.capture };
}
