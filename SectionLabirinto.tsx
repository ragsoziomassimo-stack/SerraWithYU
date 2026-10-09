import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Medal, RotateCcw } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { generateMaze, sameCell, shortRoute, type Cell } from "@/lib/maze.ts";
import SectionCard from "./SectionCard.tsx";
import { playGunshot } from "@/lib/gunshot.ts";
import Confetti from "./Confetti.tsx";

const CELLS = 9;
const SIZE = CELLS * 2 + 1;
const START: Cell = { x: 1, y: 1 };
const GOAL: Cell = { x: SIZE - 2, y: SIZE - 2 };
const DEER = "https://hercules-cdn.com/file_nYHw0t6z99wqv7dyrXbHh0G5";
const HUNTER = "/hunter.png";
const NICK_KEY = "labirinto_nickname";

const LEVELS = 10;

// "levelDone" = labirinto finito ma ne restano altri; "won" = tutti i 10 completati.
type Status = "idle" | "playing" | "levelDone" | "won";

const seconds = (ms: number) => (ms / 1000).toFixed(1);
// I personaggi occupano circa 2x2 caselle, centrati sulla casella, per vederli bene anche su un labirinto fitto.
const BIG = 3.2;
const clamp = (n: number) => Math.min(Math.max(n, 0), SIZE - BIG);
const tileStyle = (c: Cell) => ({
  left: `${(clamp(c.x + 0.5 - BIG / 2) / SIZE) * 100}%`,
  top: `${(clamp(c.y + 0.5 - BIG / 2) / SIZE) * 100}%`,
  width: `${(BIG / SIZE) * 100}%`,
  height: `${(BIG / SIZE) * 100}%`,
});

export default function SectionLabirinto() {
  const { t } = useTranslation("labirinto");
  const [maze, setMaze] = useState(() => generateMaze(CELLS));
  const [path, setPath] = useState<Cell[]>([START]);
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(1);
  // Tempo dei labirinti già finiti: il totale è la somma di tutti.
  const baseMs = useRef(0);
  const [nickname, setNickname] = useState(() => localStorage.getItem(NICK_KEY) ?? "");
  const [saved, setSaved] = useState(false);
  const [flash, setFlash] = useState(false);
  const board = useRef<HTMLDivElement>(null);
  const pathRef = useRef<Cell[]>([START]);
  const drawing = useRef(false);
  const startedAt = useRef(0);
  const top = useQuery(api.labirinto.top, {});
  const addScore = useMutation(api.labirinto.add);

  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => setElapsed(baseMs.current + Date.now() - startedAt.current), 100);
    return () => clearInterval(id);
  }, [status]);

  const tileAt = (e: PointerEvent): Cell | null => {
    const rect = board.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * SIZE);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * SIZE);
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return null;
    return { x, y };
  };

  const advance = (target: Cell) => {
    const head = pathRef.current[pathRef.current.length - 1];
    // Se il dito finisce sul bosco, si segue la pietra vicina più prossima al cacciatore.
    const open = maze[target.y]?.[target.x]
      ? target
      : [
          { x: target.x + 1, y: target.y },
          { x: target.x - 1, y: target.y },
          { x: target.x, y: target.y + 1 },
          { x: target.x, y: target.y - 1 },
        ]
          .filter((n) => maze[n.y]?.[n.x])
          .sort((a, b) => Math.abs(a.x - head.x) + Math.abs(a.y - head.y) - (Math.abs(b.x - head.x) + Math.abs(b.y - head.y)))[0];
    if (!open || sameCell(head, open)) return;
    const route = shortRoute(maze, head, open, 10);
    if (!route) return;
    let next = pathRef.current;
    for (const cell of route) {
      const at = next.findIndex((p) => sameCell(p, cell));
      // Tornare su una casella già toccata accorcia la linea (si "cancella" tornando indietro).
      next = at >= 0 ? next.slice(0, at + 1) : [...next, cell];
    }
    pathRef.current = next;
    setPath(next);
    if (sameCell(next[next.length - 1], GOAL)) {
      drawing.current = false;
      playGunshot();
      setFlash(true);
      setTimeout(() => setFlash(false), 250);
      const total = baseMs.current + Date.now() - startedAt.current;
      baseMs.current = total;
      setElapsed(total);
      setStatus(level >= LEVELS ? "won" : "levelDone");
    }
  };

  const onDown = (e: PointerEvent) => {
    if (status === "won" || status === "levelDone") return;
    const tile = tileAt(e);
    if (!tile) return;
    const head = pathRef.current[pathRef.current.length - 1];
    const nearHead = Math.abs(tile.x - head.x) + Math.abs(tile.y - head.y) <= 4;
    if (!nearHead) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    if (status === "idle") {
      startedAt.current = Date.now();
      setStatus("playing");
    }
    advance(tile);
  };

  const onMove = (e: PointerEvent) => {
    if (!drawing.current) return;
    const tile = tileAt(e);
    if (tile) advance(tile);
  };

  const loadMaze = () => {
    setMaze(generateMaze(CELLS));
    pathRef.current = [START];
    setPath([START]);
    drawing.current = false;
    setStatus("idle");
  };

  const nextLevel = () => {
    setLevel((n) => n + 1);
    loadMaze();
  };

  const reset = () => {
    baseMs.current = 0;
    setLevel(1);
    setElapsed(0);
    setSaved(false);
    loadMaze();
  };

  const save = async () => {
    const name = nickname.trim();
    if (!name) {
      toast.error(t("needName"));
      return;
    }
    try {
      await addScore({ nickname: name, tempoMs: elapsed });
      localStorage.setItem(NICK_KEY, name);
      setSaved(true);
      toast.success(t("savedToast"));
    } catch {
      toast.error(t("saveError"));
    }
  };

  const points = path.map((c) => `${c.x + 0.5},${c.y + 0.5}`).join(" ");

  return (
    <SectionCard title={t("title")} emoji="🌲">
      {(status === "won" || status === "levelDone") && <Confetti />}
      <p className="mt-0 text-sm">{t("intro", { total: LEVELS })}</p>

      <div className="flex items-center justify-between text-sm font-bold text-[#8B2500] mb-2">
        <span>
          {t("level", { n: level, total: LEVELS })} · {t("time")}: {seconds(elapsed)} s
        </span>
        <Button size="sm" variant="secondary" onClick={reset} className="cursor-pointer">
          <RotateCcw className="size-4" /> {t("newMaze")}
        </Button>
      </div>

      <div
        ref={board}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
        className="relative mx-auto w-full max-w-[440px] aspect-square touch-none select-none rounded-xl overflow-hidden border-2 border-emerald-950 bg-emerald-950"
      >
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {maze.flatMap((row, y) =>
            row.map((open, x) => (
              <div key={`${x}-${y}`} className="flex items-center justify-center">
                {open ? (
                  <div className="size-full bg-stone-300 border border-stone-400/70 rounded-[28%]" />
                ) : (
                  <div className="size-[80%] rounded-full bg-emerald-700" />
                )}
              </div>
            )),
          )}
        </div>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 size-full pointer-events-none">
          <polyline
            points={points}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={0.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute pointer-events-none rounded-full bg-amber-400/80 ring-2 ring-white animate-pulse"
          style={{ ...tileStyle(GOAL), left: `${(GOAL.x / SIZE) * 100}%`, top: `${(GOAL.y / SIZE) * 100}%`, width: `${100 / SIZE}%`, height: `${100 / SIZE}%` }}
        />
        {flash && <div className="absolute inset-0 z-20 bg-white/70 pointer-events-none" />}
        <img
          src={HUNTER}
          alt="Cacciatore"
          className="m-0 absolute pointer-events-none object-contain drop-shadow-lg z-10"
          style={tileStyle(path[path.length - 1])}
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-3">
        <span className="text-sm font-bold text-[#8B2500]">{t("goal")}</span>
        <img src={DEER} alt="Capriolo" className="m-0 size-20 rounded-full object-cover bg-amber-100 border-2 border-[#8B2500] shadow-md" />
      </div>

      {status === "idle" && <p className="text-xs text-center mt-2">{t("hint")}</p>}

      {status === "levelDone" && (
        <div className="mt-4 rounded-2xl border border-[#e8c9a0] bg-white p-4 space-y-3 text-center">
          <p className="m-0 font-bold text-[#8B2500]">{t("levelDone", { n: level })}</p>
          <p className="m-0 text-sm">
            {t("totalSoFar")}: {seconds(elapsed)} s
          </p>
          <Button onClick={nextLevel} className="cursor-pointer">
            {t("next")}
          </Button>
        </div>
      )}

      {status === "won" && (
        <div className="mt-4 rounded-2xl border border-[#e8c9a0] bg-white p-4 space-y-3 text-center">
          <p className="m-0 font-bold text-[#8B2500]">
            {t("win", { total: LEVELS })} {seconds(elapsed)} s
          </p>
          {saved ? (
            <p className="m-0 text-sm">{t("saved")}</p>
          ) : (
            <div className="flex gap-2">
              <Input
                value={nickname}
                maxLength={20}
                placeholder={t("namePlaceholder")}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Button onClick={save} className="cursor-pointer">
                {t("save")}
              </Button>
            </div>
          )}
          <Button variant="secondary" onClick={reset} className="cursor-pointer">
            {t("playAgain")}
          </Button>
        </div>
      )}

      <h2 className="text-lg font-bold text-[#8B2500] mt-6 mb-2">{t("ranking", { total: LEVELS })}</h2>
      <div className="space-y-2">
        {top === undefined ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
        ) : top.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          top.map((r, i) => (
            <div key={r._id} className="flex items-center gap-3 bg-white/90 border border-[#e8c9a0] rounded-xl px-4 py-2">
              <Medal className={`size-5 shrink-0 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-[#c9a679]"}`} />
              <span className="flex-1 truncate text-sm font-bold text-[#8B2500]">{r.nickname}</span>
              <span className="text-sm font-semibold">{seconds(r.tempoMs)} s</span>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
