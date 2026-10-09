import type { ReactNode } from "react";

interface Props {
  title: string;
  emoji: string;
  headerImage?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, headerImage, action, children }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl border border-[#e8c9a0] p-6 mb-4">
        {headerImage ? (
          <div className="flex justify-center mb-4 border-b border-[#e8c9a0] pb-4">
            <img src={headerImage} alt={title} className="w-40 h-auto drop-shadow-md" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 mb-4 border-b border-[#e8c9a0] pb-3">
            <h1 className="text-2xl font-bold text-[#8B2500]">{title}</h1>
            {action}
          </div>
        )}
        <div className="prose prose-sm max-w-none text-[#333] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
