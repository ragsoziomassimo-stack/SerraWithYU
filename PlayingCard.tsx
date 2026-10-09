import { cn } from "@/lib/utils.ts";
import { useTranslation } from "react-i18next";
import type { Card } from "./scopa-engine.ts";

// Ogni carta è un'immagine intera del mazzo napoletano: /cards/<seme>-<valore>.webp
const cardImage = (card: Card) => `/cards/${card.suit}-${card.value}.webp`;

type Props = {
  card?: Card;
  hidden?: boolean;
  highlight?: boolean;
  small?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function PlayingCard({ card, hidden, highlight, small, disabled, onClick }: Props) {
  const { t } = useTranslation("gioco3");
  // Proporzioni uguali all'immagine (122x212) così la carta non viene deformata
  const size = small ? "h-14 aspect-[122/212]" : "h-24 aspect-[122/212] sm:h-28";
  const base = cn("relative m-0 shrink-0 overflow-hidden rounded-lg select-none shadow-md transition-transform", size);
  if (hidden || !card) {
    return (
      <div
        className={cn(
          base,
          "border-2 border-[#5c1800] bg-[repeating-linear-gradient(45deg,#8B2500,#8B2500_6px,#b5532a_6px,#b5532a_12px)]",
        )}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={card.value >= 8 ? t(`face_${card.value}`) : undefined}
      className={cn(
        base,
        "border bg-white p-0",
        highlight ? "border-amber-500 ring-4 ring-amber-400 -translate-y-1" : "border-[#c9a36b]",
        onClick && !disabled && "cursor-pointer hover:-translate-y-1",
        disabled && "cursor-default",
      )}
    >
      <img src={cardImage(card)} alt={`${card.value} ${card.suit}`} draggable={false} className="m-0 size-full -translate-y-[20%] scale-[1.22] object-cover" />
    </button>
  );
}
