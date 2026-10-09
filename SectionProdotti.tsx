import { useTranslation } from "react-i18next";

const PRODUCT_EMOJIS = ["🫒", "🍞", "🥨", "🌶️", "🌶️", "🥩", "🍷", "🍝", "🐑", "🍩", "🍪", "🌸", "🥧", "🧀"];
const PRODUCT_IMGS: (string | null)[] = [
  "https://images.unsplash.com/photo-1632153630866-f45b76cc58e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  "https://hercules-cdn.com/file_3en6nlL4FY9Rv0a04Oi6j7FR",
  "https://images.unsplash.com/photo-1638566136851-9d9851cd17fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  null, null, null, null,
  null,
  null, null, null, null, null, null,
];

export default function SectionProdotti() {
  const { t } = useTranslation("prodotti");

  const products = t("products", { returnObjects: true }) as Array<{ name: string; desc: string }>;

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4 px-1">
      {/* Header con foto */}
      <div className="rounded-2xl overflow-hidden shadow-md border border-[#e8c9a0] mb-1">
        <div className="bg-[#fff8f0] px-4 py-3">
          <h2 className="text-xl font-black text-[#8B2500]">{t("title")}</h2>
          <p className="text-sm text-[#555] mt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      {Array.isArray(products) && products.map((p, i) => (
        <div
          key={i}
          className="bg-white/90 rounded-2xl shadow-sm border border-[#e8c9a0] overflow-hidden"
        >
          {PRODUCT_IMGS[i] && (
            <img src={PRODUCT_IMGS[i]!} alt={p.name} className="w-full h-36 object-cover" />
          )}
          <div className="p-4 flex gap-3 items-start">
            <span className="text-3xl leading-none mt-0.5 flex-shrink-0">{PRODUCT_EMOJIS[i]}</span>
            <div>
              <h3 className="font-black text-[#8B2500] text-base mb-1">{p.name}</h3>
              <p className="text-sm text-[#333] leading-relaxed">{p.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
