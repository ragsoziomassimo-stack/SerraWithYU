import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const DEER_LOGO = "https://hercules-cdn.com/file_exgbQOpopbMnCfjGxTRCxSI6";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  // Usa un ref per onDone così il timer non si azzera se il parent re-renderizza
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("out"), 3200);
    const t3 = setTimeout(() => onDoneRef.current(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // intenzionalmente vuoto: i timer partono una sola volta

  return (
    <AnimatePresence>
      {phase !== "out" ? (
        <motion.div
          key="splash"
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fffaf5]`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" as const }}
        >
          {/* Cerchi concentrici decorativi */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="rounded-full border-2 border-[#8B2500]/10"
              style={{ width: 260, height: 260 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
            />
            <motion.div
              className="absolute rounded-full border border-[#8B2500]/20"
              style={{ width: 200, height: 200 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" as const }}
            />
          </div>

          {/* Logo capriolo */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as const }}
            className="relative z-10 mb-6"
          >
            <motion.div
              animate={phase === "hold" ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 1.4, ease: "easeInOut" as const, repeat: Infinity, repeatType: "loop" as const }}
            >
              <img
                src={DEER_LOGO}
                alt="Logo Capriolo SerraWithY❤U"
                className="w-28 h-28 rounded-full object-cover shadow-2xl border-4 border-[#8B2500]/30"
              />
            </motion.div>
          </motion.div>

          {/* Titolo */}
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="font-cursive text-4xl text-[#8B2500] drop-shadow-sm select-none">
              SerraWithY<span className="text-red-500">❤</span>U
            </span>
            <motion.span
              className="text-xs text-[#8B2500]/70 font-bold tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Serracapriola — Provincia di Foggia
            </motion.span>
          </motion.div>

          {/* Puntini di caricamento */}
          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#8B2500]/40"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                }}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
