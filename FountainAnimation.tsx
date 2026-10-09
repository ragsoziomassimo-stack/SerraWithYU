import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

// Animated water drops falling from the fountain
const drops = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 30 + (i % 9) * 5,   // spread across 30%–70% of width
  delay: (i * 0.18) % 1.6,
  duration: 0.9 + (i % 4) * 0.2,
  size: 3 + (i % 3),
}));

// Arc streams radiating outward from center
const streams = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: i * 45,
  delay: i * 0.12,
}));

export default function FountainAnimation() {
  const { t } = useTranslation("extra");
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#8B2500]/20 shadow-lg bg-[#e8f4fa]" style={{ minHeight: 220 }}>
      {/* Sky/pool background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#c9e8f8] via-[#e0f3fc] to-[#b0d8f0]" />

      {/* Ripple rings on water surface */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#5bb8f5]/40"
          style={{
            bottom: "12%",
            left: "50%",
            translateX: "-50%",
            width: 60 + i * 40,
            height: (60 + i * 40) * 0.3,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{
            duration: 2.4,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Central fountain basin */}
      <div
        className="absolute rounded-full bg-gradient-to-b from-[#7dcfef] to-[#4ab3e0] border-4 border-[#a0cce0] shadow-inner"
        style={{ bottom: "6%", left: "50%", transform: "translateX(-50%)", width: 120, height: 36 }}
      />

      {/* Fountain pedestal */}
      <div
        className="absolute bg-gradient-to-b from-[#d4b896] to-[#c09a70] rounded"
        style={{ bottom: "22%", left: "50%", transform: "translateX(-50%)", width: 18, height: 52 }}
      />

      {/* Deer silhouette on top */}
      <div className="absolute" style={{ bottom: "44%", left: "50%", transform: "translateX(-50%)" }}>
        <svg width="44" height="54" viewBox="0 0 44 54" fill="none">
          {/* Body */}
          <ellipse cx="22" cy="36" rx="11" ry="8" fill="#8B6340" />
          {/* Neck */}
          <rect x="19" y="24" width="6" height="14" rx="3" fill="#8B6340" />
          {/* Head */}
          <ellipse cx="22" cy="22" rx="6" ry="5" fill="#9B7350" />
          {/* Antlers */}
          <path d="M18 18 L14 10 M14 10 L11 7 M14 10 L16 6" stroke="#6B4420" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M26 18 L30 10 M30 10 L33 7 M30 10 L28 6" stroke="#6B4420" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Legs */}
          <line x1="16" y1="43" x2="14" y2="54" stroke="#7B5330" strokeWidth="3" strokeLinecap="round"/>
          <line x1="20" y1="43" x2="19" y2="54" stroke="#7B5330" strokeWidth="3" strokeLinecap="round"/>
          <line x1="24" y1="43" x2="25" y2="54" stroke="#7B5330" strokeWidth="3" strokeLinecap="round"/>
          <line x1="28" y1="43" x2="30" y2="54" stroke="#7B5330" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Arc water streams */}
      {streams.map((s) => {
        const rad = (s.angle - 90) * (Math.PI / 180);
        const px = 50 + Math.cos(rad) * 18;
        const py = 60 - Math.sin(rad) * 18;
        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-[#7dd3fc]/80"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              width: 4,
              height: 4,
              transformOrigin: "center",
            }}
            animate={{
              x: [0, Math.cos(rad) * 38, Math.cos(rad) * 52],
              y: [0, -18, 30],
              opacity: [0, 0.9, 0],
              scale: [1, 1.2, 0.6],
            }}
            transition={{
              duration: s.delay < 0.5 ? 1.0 : 1.2,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        );
      })}

      {/* Falling water drops */}
      {drops.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-[#38bdf8]/70"
          style={{
            left: `${d.x}%`,
            top: "18%",
            width: d.size,
            height: d.size * 2,
          }}
          animate={{ y: [0, 120], opacity: [0.8, 0] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Water shimmer on basin */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "8%",
          left: "50%",
          translateX: "-50%",
          width: 110,
          height: 28,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
        }}
        animate={{ x: [-40, 40, -40] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Caption */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        <span className="text-[10px] font-semibold text-[#1e6fa0]/80 tracking-wide uppercase">{t("fountainCap")}</span>
      </div>
    </div>
  );
}
