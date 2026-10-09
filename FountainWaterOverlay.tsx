import { motion } from "motion/react";

// Simula i getti d'acqua della fontana sovrapposti alla foto reale
const jets = [
  // Getto centrale principale
  { id: 0, left: "49%", bottom: "44%", width: 28, delay: 0, duration: 1.1, spread: 0 },
  // Archi laterali
  { id: 1, left: "44%", bottom: "42%", width: 14, delay: 0.15, duration: 1.0, spread: -22 },
  { id: 2, left: "54%", bottom: "42%", width: 14, delay: 0.25, duration: 1.0, spread: 22 },
  { id: 3, left: "40%", bottom: "39%", width: 10, delay: 0.35, duration: 0.95, spread: -38 },
  { id: 4, left: "58%", bottom: "39%", width: 10, delay: 0.45, duration: 0.95, spread: 38 },
  // Spruzzi piccoli periferici
  { id: 5, left: "36%", bottom: "36%", width: 7, delay: 0.1, duration: 0.8, spread: -55 },
  { id: 6, left: "62%", bottom: "36%", width: 7, delay: 0.2, duration: 0.8, spread: 55 },
] as const;

// Gocce che ricadono
const drops = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: 38 + (i % 11) * 2.4,
  startY: 0,
  delay: (i * 0.13) % 1.4,
  duration: 0.7 + (i % 3) * 0.15,
  size: 2 + (i % 3),
}));

export default function FountainWaterOverlay() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-[#8B2500]/20">
      {/* Foto reale */}
      <img
        src="https://hercules-cdn.com/file_rtwirgvxMUtOemTY9M9Arb1k"
        alt="Fontana del Capriolo - Serracapriola"
        className="w-full object-cover"
      />

      {/* Overlay animazioni acqua */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Getti principali che salgono */}
        {jets.map((j) => (
          <motion.div
            key={j.id}
            className="absolute rounded-full"
            style={{
              left: j.left,
              bottom: j.bottom,
              width: j.width,
              height: j.width * 2.5,
              background: "linear-gradient(to top, rgba(180,220,255,0.0), rgba(200,235,255,0.65), rgba(255,255,255,0.85))",
              rotate: j.spread,
              transformOrigin: "bottom center",
              filter: "blur(1px)",
            }}
            animate={{
              scaleY: [0.6, 1.15, 0.65],
              scaleX: [1, 0.85, 1],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: j.duration,
              delay: j.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Gocce che ricadono */}
        {drops.map((d) => (
          <motion.div
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: `${d.left}%`,
              bottom: "38%",
              width: d.size,
              height: d.size * 2,
              background: "rgba(200,235,255,0.75)",
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, 55],
              opacity: [0.8, 0],
              scaleX: [1, 1.3],
            }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}

        {/* Riflesso/shimmer sulla superficie dell'acqua nella vasca */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`shimmer-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${35 + i * 10}%`,
              bottom: "30%",
              width: 30 + i * 18,
              height: 6,
              background: "rgba(255,255,255,0.35)",
              filter: "blur(2px)",
            }}
            animate={{ opacity: [0, 0.7, 0], scaleX: [0.7, 1.3, 0.7] }}
            transition={{
              duration: 1.8,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Spruzzino nebbia attorno al getto centrale */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: "44%",
            bottom: "44%",
            width: 60,
            height: 24,
            background: "radial-gradient(ellipse, rgba(220,240,255,0.45) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Didascalia */}
      <div className="bg-white/90 px-4 py-2 text-center">
        <span className="text-xs font-semibold text-[#8B2500] tracking-wide uppercase">
          Fontana del Capriolo — Serracapriola
        </span>
      </div>
    </div>
  );
}
