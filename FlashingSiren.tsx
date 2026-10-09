import { motion } from "motion/react";

type Props = { flashing: boolean; className?: string };

// Sirena rossa; lampeggia quando c'è un avviso nuovo
export default function FlashingSiren({ flashing, className }: Props) {
  return (
    <motion.span
      aria-hidden
      className={className}
      animate={flashing ? { opacity: [1, 0.15, 1], scale: [1, 1.25, 1] } : { opacity: 1, scale: 1 }}
      transition={flashing ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const } : {}}
    >
      🚨
    </motion.span>
  );
}
