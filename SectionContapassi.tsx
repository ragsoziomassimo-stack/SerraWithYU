import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Footprints, Flame, Clock, Route, Trophy } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { usePedometer } from "@/hooks/use-pedometer.ts";
import { caloriesBurned, classify, formatDuration, strideLengthM } from "@/lib/pedometer.ts";

const PROFILE_KEY = "pedometerProfile";

function readProfile(): { height: string; weight: string } {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as { height: string; weight: string };
  } catch {
    // storage non disponibile
  }
  return { height: "", weight: "" };
}

function formatDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#8B2500]/15 p-3 flex flex-col items-center gap-1 shadow-sm">
      <div className="text-[#8B2500]">{icon}</div>
      <div className="text-xl font-black text-[#333] tabular-nums">{value}</div>
      <div className="text-[11px] text-[#666] uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function SectionContapassi() {
  const { t } = useTranslation("contapassi");
  const [profile, setProfile] = useState(readProfile);
  const height = profile.height ? Number(profile.height) : null;
  const weight = profile.weight ? Number(profile.weight) : null;
  const stride = strideLengthM(height);
  const p = usePedometer(stride);
  const ranking = useQuery(api.passi.top, {});
  const addToRanking = useMutation(api.passi.add);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateProfile = (key: "height" | "weight", value: string) => {
    const next = { ...profile, [key]: value.replace(/[^0-9]/g, "").slice(0, 3) };
    setProfile(next);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch {
      // ignora
    }
  };

  const calories = caloriesBurned(p.distanceM, weight);
  const level = classify(p.distanceM, p.elapsedSec);
  const canRank = p.distanceM >= 50 && p.elapsedSec >= 30;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      await addToRanking({
        nickname,
        distanzaM: p.distanceM,
        passi: p.steps,
        durataSec: p.elapsedSec,
        livello: level,
      });
      setSaved(true);
      toast.success(t("rankingAdded"));
    } catch {
      toast.error(t("rankingError"));
    } finally {
      setSaving(false);
    }
  };

  const restart = () => {
    p.reset();
    setSaved(false);
    setNickname("");
  };

  return (
    <div className="flex flex-col gap-3 pt-3 pb-2">
      <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow">
        <h2 className="text-xl font-black text-[#8B2500] mb-1">{t("title")}</h2>
        <div className="my-2 rounded-lg bg-[#fff7ee] border border-[#8B2500]/20 p-3">
          <p className="text-base font-bold text-[#8B2500]">{t("promoTitle")}</p>
          <p className="text-sm text-[#333] whitespace-pre-line">{t("promoText")}</p>
        </div>
        <p className="text-sm text-[#333]">{t("intro")}</p>
      </div>

      {p.status === "idle" && (
        <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-3">
          <p className="text-xs text-[#555]">{t("profileHint")}</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              inputMode="numeric"
              value={profile.height}
              onChange={(e) => updateProfile("height", e.target.value)}
              placeholder={t("height")}
            />
            <Input
              inputMode="numeric"
              value={profile.weight}
              onChange={(e) => updateProfile("weight", e.target.value)}
              placeholder={t("weight")}
            />
          </div>
          <Button
            onClick={() => void p.start()}
            className="h-16 text-2xl font-black bg-green-600 hover:bg-green-700 text-white"
          >
            {t("start")}
          </Button>
          {p.error === "noSupport" && <p className="text-sm text-red-600">{t("noSupport")}</p>}
          {p.error === "gpsDenied" && <p className="text-sm text-red-600">{t("gpsDenied")}</p>}
        </div>
      )}

      {p.status !== "idle" && (
        <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-3">
          <div className="text-center">
            <div className="text-6xl font-black text-[#8B2500] tabular-nums leading-none">{p.steps}</div>
            <div className="text-xs uppercase tracking-widest text-[#666] mt-1">{t("steps")}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={<Route className="w-5 h-5" />} label={t("distance")} value={formatDistance(p.distanceM)} />
            <Stat icon={<Flame className="w-5 h-5" />} label={t("calories")} value={`${Math.round(calories)} kcal`} />
            <Stat icon={<Clock className="w-5 h-5" />} label={t("time")} value={formatDuration(p.elapsedSec)} />
          </div>
          {p.status === "running" && (
            <>
              <p className="text-center text-xs text-[#666]">
                {p.mode === "gps" ? t("modeGps") : t("modeSensor")}
              </p>
              {p.error === "gpsDenied" && <p className="text-sm text-red-600 text-center">{t("gpsDenied")}</p>}
              <Button onClick={p.stop} className="h-16 text-2xl font-black bg-red-600 hover:bg-red-700 text-white">
                {t("end")}
              </Button>
            </>
          )}
        </div>
      )}

      {p.status === "done" && (
        <div className="bg-[#fff7ee] rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-3 text-center">
          <div className="text-sm text-[#555]">{t("youWere")}</div>
          <div className="text-3xl font-black text-[#8B2500]">{t(`level.${level}`)}</div>
          <p className="text-sm text-[#333]">{t(`levelText.${level}`)}</p>

          {canRank && !saved && (
            <form onSubmit={submit} className="flex flex-col gap-2 text-left">
              <p className="text-sm font-bold text-[#8B2500]">{t("rankingAsk")}</p>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t("nickname")}
                maxLength={20}
              />
              <Button type="submit" disabled={saving || !nickname.trim()} className="bg-[#8B2500] hover:bg-[#6d1d00] text-white">
                {saving ? <Spinner /> : t("rankingYes")}
              </Button>
            </form>
          )}
          {!canRank && <p className="text-xs text-[#666]">{t("tooShort")}</p>}
          <Button onClick={restart} className="bg-green-600 hover:bg-green-700 text-white">
            {t("again")}
          </Button>
        </div>
      )}

      <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow">
        <h3 className="flex items-center gap-2 font-black text-[#8B2500] mb-2">
          <Trophy className="w-5 h-5" /> {t("ranking")}
        </h3>
        {ranking === undefined && <Spinner />}
        {ranking?.length === 0 && <p className="text-sm text-[#666]">{t("rankingEmpty")}</p>}
        <ol className="flex flex-col gap-1">
          {ranking?.map((r, i) => (
            <li key={r._id} className="flex items-center gap-2 text-sm py-1 border-b border-[#8B2500]/10 last:border-0">
              <span className="w-6 text-center font-black text-[#8B2500]">{i + 1}</span>
              <span className="flex-1 truncate font-bold">{r.nickname}</span>
              <span className="text-xs text-[#666]">{t(`level.${r.livello}`, { defaultValue: "" })}</span>
              <span className="font-black tabular-nums">{formatDistance(r.distanzaM)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[10px] text-[#777] mt-2 flex items-center gap-1">
          <Footprints className="w-3 h-3" /> {t("rankingNote")}
        </p>
      </div>
    </div>
  );
}
