import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Burst {
  particles: Particle[];
  done: boolean;
}

const COLORS = [
  "#FF4500", "#FFD700", "#FF69B4", "#00BFFF",
  "#7FFF00", "#FF6347", "#FF1493", "#FFA500",
  "#ADFF2F", "#00FA9A", "#FF8C00", "#DA70D6",
];

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bursts = useRef<Burst[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const launchBurst = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.55 + 30;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 60 + Math.floor(Math.random() * 40);
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 1.5 + Math.random() * 3.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 1.5 + Math.random() * 2,
        });
      }
      bursts.current.push({ particles, done: false });
    };

    const interval = setInterval(launchBurst, 1200);
    launchBurst();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bursts.current = bursts.current.filter((b) => !b.done);
      for (const burst of bursts.current) {
        let alive = 0;
        for (const p of burst.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.vx *= 0.98;
          p.alpha -= 0.013;
          if (p.alpha <= 0) continue;
          alive++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (alive === 0) burst.done = true;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
