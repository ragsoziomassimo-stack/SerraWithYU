import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Code, Lock } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useProgrammerSpace } from "@/hooks/use-programmer-space.ts";

/**
 * Spazio del Programmatore condiviso, mostrato in fondo a ogni pagina.
 * Permette di sbloccare/bloccare la modalità che consente di eliminare
 * immagini e contenuti caricati dagli utenti nelle varie sezioni.
 */
export default function ProgrammerSpaceFooter() {
  const { t } = useTranslation("common");
  const { unlocked, unlock, lock } = useProgrammerSpace();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await unlock(password)) {
      toast.success(t("programmerUnlockSuccess"));
    } else {
      toast.error(t("programmerWrongPassword"));
    }
    setPassword("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-4 px-1">
      <div className="pt-4 border-t border-[#e8c9a0]">
        <div className="flex items-center gap-2 mb-3 text-[#8B2500]">
          <Code size={16} />
          <p className="text-sm font-bold">{t("programmerSpace")}</p>
        </div>
        {unlocked ? (
          <div className="flex items-center justify-between bg-[#fff8f0] border border-[#e8c9a0] rounded-xl px-3 py-2">
            <p className="text-xs text-muted-foreground">{t("programmerUnlocked")}</p>
            <Button variant="secondary" size="sm" onClick={lock}>
              {t("programmerLock")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("programmerPasswordPlaceholder")}
                className="pl-8 bg-white"
              />
            </div>
            <Button type="submit" size="sm" className="bg-[#8B2500] hover:bg-[#6d1d00] text-white">
              {t("programmerUnlockBtn")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
