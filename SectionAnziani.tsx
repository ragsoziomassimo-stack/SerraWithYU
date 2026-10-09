import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Phone, MapPin, Share2, Copy, Pencil, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

const PHONE_KEY = "sosPhone";

type Position = { lat: number; lon: number; accuracy: number };
type GeoError = "denied" | "unavailable" | "generic" | null;

function readPhone(): string {
  try {
    return localStorage.getItem(PHONE_KEY) ?? "";
  } catch {
    return "";
  }
}

// Tiene solo cifre e un eventuale "+" iniziale
function cleanPhone(raw: string): string {
  const plus = raw.trim().startsWith("+") ? "+" : "";
  return plus + raw.replace(/[^0-9]/g, "").slice(0, 15);
}

export default function SectionAnziani() {
  const { t } = useTranslation("anziani");
  const [phone, setPhone] = useState(readPhone);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(() => readPhone() === "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [geoError, setGeoError] = useState<GeoError>(null);

  const savePhone = () => {
    const cleaned = cleanPhone(draft);
    if (cleaned.replace("+", "").length < 3) {
      toast.error(t("phoneInvalid"));
      return;
    }
    try {
      localStorage.setItem(PHONE_KEY, cleaned);
    } catch {
      toast.error(t("saveError"));
    }
    setPhone(cleaned);
    setEditing(false);
    toast.success(t("phoneSaved"));
  };

  const startEdit = () => {
    setDraft(phone);
    setEditing(true);
  };

  const locate = () => {
    setConfirmOpen(false);
    setGeoError(null);
    if (!("geolocation" in navigator)) {
      setGeoError("unavailable");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setLocating(false);
      },
      (err) => {
        setGeoError(err.code === err.PERMISSION_DENIED ? "denied" : "generic");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

  const mapsUrl = position
    ? `https://www.google.com/maps?q=${position.lat.toFixed(6)},${position.lon.toFixed(6)}`
    : "";
  const shareText = position ? `${t("shareText")} ${mapsUrl}` : "";

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: t("shareTitle"), text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success(t("copied"));
      }
    } catch {
      // l'utente ha annullato la condivisione
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(t("copied"));
    } catch {
      toast.error(t("saveError"));
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-3 pb-2">
      <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow">
        <h2 className="text-xl font-black text-[#8B2500] mb-1">{t("title")}</h2>
        <p className="text-sm text-[#333]">{t("intro")}</p>
      </div>

      <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-2">
        <p className="text-sm font-bold text-[#8B2500]">{t("phoneLabel")}</p>
        {editing ? (
          <div className="flex gap-2">
            <Input
              type="tel"
              inputMode="tel"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="text-lg"
            />
            <Button onClick={savePhone} className="bg-[#8B2500] hover:bg-[#6d1d00] text-white">
              {t("save")}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl font-black tabular-nums text-[#333]">{phone}</span>
            <Button variant="ghost" onClick={startEdit} className="text-[#8B2500]">
              <Pencil className="w-4 h-4" /> {t("change")}
            </Button>
          </div>
        )}
        <p className="text-[11px] text-[#777]">{t("phoneNote")}</p>
      </div>

      {phone && !editing ? (
        <a
          href={`tel:${phone}`}
          className="h-28 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white flex flex-col items-center justify-center gap-1 shadow-lg"
        >
          <Phone className="w-9 h-9" />
          <span className="text-4xl font-black tracking-widest">SOS</span>
          <span className="text-xs opacity-90">{t("sosHint")}</span>
        </a>
      ) : (
        <div className="h-28 rounded-2xl bg-red-600/30 text-white flex flex-col items-center justify-center gap-1 text-center px-4">
          <span className="text-4xl font-black tracking-widest">SOS</span>
          <span className="text-xs">{t("sosDisabled")}</span>
        </div>
      )}

      <Button
        onClick={() => setConfirmOpen(true)}
        disabled={locating}
        className="h-16 text-lg font-black bg-[#8B2500] hover:bg-[#6d1d00] text-white"
      >
        {locating ? <Spinner /> : <MapPin className="w-6 h-6" />} {t("locate")}
      </Button>

      {geoError && (
        <p className="text-sm text-red-600 bg-white/90 rounded-xl p-3 border border-red-200">
          {t(`error.${geoError}`)}
        </p>
      )}

      {position && (
        <div className="bg-[#fff7ee] rounded-xl p-4 border border-[#8B2500]/20 shadow flex flex-col gap-3">
          <p className="font-black text-[#8B2500]">{t("yourPosition")}</p>
          <p className="text-sm tabular-nums text-[#333]">
            {t("latitude")}: {position.lat.toFixed(6)}
            <br />
            {t("longitude")}: {position.lon.toFixed(6)}
            <br />
            {t("accuracy")}: ± {Math.round(position.accuracy)} m
          </p>
          <iframe
            title={t("yourPosition")}
            className="w-full h-56 rounded-lg border border-[#8B2500]/20"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${position.lon - 0.004},${position.lat - 0.0025},${position.lon + 0.004},${position.lat + 0.0025}&layer=mapnik&marker=${position.lat},${position.lon}`}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => void share()} className="bg-green-600 hover:bg-green-700 text-white">
              <Share2 className="w-4 h-4" /> {t("share")}
            </Button>
            <Button onClick={() => void copy()} className="bg-[#8B2500] hover:bg-[#6d1d00] text-white">
              <Copy className="w-4 h-4" /> {t("copy")}
            </Button>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#8B2500] underline flex items-center gap-1"
          >
            <Navigation className="w-4 h-4" /> {t("openMaps")}
          </a>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("consentTitle")}</DialogTitle>
            <DialogDescription>{t("consentText")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={locate} className="bg-green-600 hover:bg-green-700 text-white">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
