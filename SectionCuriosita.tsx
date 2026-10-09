import { useTranslation } from "react-i18next";

const ITEMS = [
  { emoji: "🦌", tKey: "s1" },
  { emoji: "✝️", tKey: "s2" },
  { emoji: "🏰", tKey: "s3" },
  { emoji: "👻", tKey: "s4" },
  { emoji: "🧿", tKey: "s5" },
  { emoji: "💡", tKey: "s6" },
  { emoji: "⚙️", tKey: "s7" },
  { emoji: "🕯️", tKey: "s8" },
  { emoji: "🔵", tKey: "s9" },
  { emoji: "💰", tKey: "s10" },
  { emoji: "🕳️", tKey: "s11" },
  { emoji: "⚔️", tKey: "s12" },
  { emoji: "🌙", tKey: "s13" },
  { emoji: "🗡️", tKey: "s14" },
  { emoji: "💰", tKey: "s15" },
  { emoji: "🔵", tKey: "s16" },
  { emoji: "🪨", tKey: "s17" },
  { emoji: "🔔", tKey: "s18" },
  { emoji: "🌬️", tKey: "s19" },
  { emoji: "👗", tKey: "s20" },
];

export default function SectionCuriosita() {
  const { t } = useTranslation("curiosita");

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-8">
      <h2 className="text-xl font-bold text-[#8B2500] font-cursive text-center">
        {t("titolo")}
      </h2>

      {ITEMS.map((item) => (
        <div
          key={item.tKey}
          className="bg-white/80 border border-[#e8c9a0] rounded-xl p-4 shadow-sm space-y-2"
        >
          <h3 className="font-bold text-[#8B2500] flex items-center gap-2">
            <span className="text-xl">{item.emoji}</span>
            {t(`${item.tKey}_titolo`)}
          </h3>
          {t(`${item.tKey}_testo`).split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
