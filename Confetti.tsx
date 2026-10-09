import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  angle: number;
  spin: number;
};

const COLORS = ["#FF4500", "#FFD700", "#FF69B4", "#00BFFF", "#7FFF00", "#DA70D6", "#FFA500", "#00FA9A"];
const COUNT = 220;
const DURATION_MS = 4500;

// Metà dei pezzi parte dai lati verso l'alto, l'altra metà cade dall'alto.
const makePiece = (width: number, i: number): Piece => {
  const fromTop = i % 3 === 0;
  const fromLeft = i % 2 === 0;
  return {
    x: fromTop ? Math.random() * width : fromLeft ? 0 : width,
    y: fromTop ? -20 - Math.random() * 200 : window.innerHeight * 0.7,
    vx: fromTop ? (Math.random() - 0.5) * 4 : (fromLeft ? 1 : -1) * (4 + Math.random() * 9),
    vy: fromTop ? 2 + Math.random() * 3 : -(8 + Math.random() * 12),
    size: 8 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.4,
  };
};

// Coriandoli sparati dai due lati dello schermo; si fermano da soli dopo pochi secondi.
export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: COUNT }, (_, i) => makePiece(canvas.width, i));
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.min(1, (DURATION_MS - elapsed) / 1000);
      for (const p of pieces) {
        p.vy += 0.25;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (elapsed < DURATION_MS) frame = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Portale su body: nessun contenitore con transform può ritagliare o spostare i coriandoli.
  return createPortal(
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[9999]" />,
    document.body,
  );
}
