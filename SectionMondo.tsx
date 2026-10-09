import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

type Target = { lat: number; lon: number };
type NominatimResult = { lat: string; lon: string; display_name: string };

const SERRACAPRIOLA: Target = { lat: 41.7993, lon: 15.1608 };

const pinIcon = L.divIcon({
  html: '<div style="font-size:30px;line-height:30px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))">📍</div>',
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 29],
  popupAnchor: [0, -26],
});

function FlyTo({ target }: { target: Target | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lon], 11, { duration: 1.2 });
  }, [map, target]);
  return null;
}

export default function SectionMondo() {
  const { t } = useTranslation("mondo");
  const entries = useQuery(api.serraniMondo.list, {});
  const add = useMutation(api.serraniMondo.add);
  const [luogo, setLuogo] = useState("");
  const [nome, setNome] = useState("");
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);

  // Raggruppa le persone che hanno scelto lo stesso posto
  const groups = useMemo(() => {
    const map = new Map<string, { lat: number; lon: number; luogo: string; nomi: string[] }>();
    for (const e of entries ?? []) {
      const key = `${e.lat.toFixed(2)},${e.lon.toFixed(2)}`;
      const g = map.get(key);
      if (g) g.nomi.push(e.nome);
      else map.set(key, { lat: e.lat, lon: e.lon, luogo: e.luogo, nomi: [e.nome] });
    }
    return Array.from(map.entries());
  }, [entries]);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const q = luogo.trim();
    if (!q) return;
    setBusy(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=it&q=${encodeURIComponent(q)}`,
      );
      const data = (await res.json()) as NominatimResult[];
      if (data.length === 0) {
        toast.error(t("notFound"));
        return;
      }
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      await add({ nome: nome.trim(), luogo: q, lat, lon });
      setTarget({ lat, lon });
      setLuogo("");
      setNome("");
      toast.success(t("added"));
    } catch {
      toast.error(t("error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-3">
      <div className="bg-[#fff7ee] rounded-xl p-4 border border-[#8B2500]/20 shadow text-center italic text-sm text-[#5a2a10] leading-relaxed flex flex-col gap-2">
        {(t("dedica", { returnObjects: true }) as string[]).map((line, i, arr) => (
          <p key={i} className={i === arr.length - 1 ? "not-italic font-bold text-[#8B2500]" : ""}>
            {line}
          </p>
        ))}
      </div>
      <div className="bg-white/90 rounded-xl p-4 border border-[#8B2500]/20 shadow">
        <h2 className="text-xl font-black text-[#8B2500] mb-1">{t("title")}</h2>
        <p className="text-sm text-[#333] mb-3">{t("intro")}</p>
        <form onSubmit={submit} className="flex flex-col gap-2">
          <Input
            value={luogo}
            onChange={(e) => setLuogo(e.target.value)}
            placeholder={t("placePlaceholder")}
            maxLength={120}
          />
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={t("namePlaceholder")}
            maxLength={60}
          />
          <Button type="submit" disabled={busy || !luogo.trim()} className="bg-[#8B2500] hover:bg-[#6d1d00] text-white">
            {busy ? <Spinner /> : t("ok")}
          </Button>
        </form>
      </div>

      <div className="rounded-xl overflow-hidden border border-[#8B2500]/20 shadow h-[60vh] min-h-[360px] relative z-0">
        <MapContainer
          center={[SERRACAPRIOLA.lat, SERRACAPRIOLA.lon]}
          zoom={3}
          minZoom={2}
          worldCopyJump
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo target={target} />
          {groups.map(([key, g]) => (
            <Marker key={key} position={[g.lat, g.lon]} icon={pinIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-bold text-[#8B2500] mb-1">{g.luogo}</div>
                  <ul className="list-disc pl-4">
                    {g.nomi.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p className="text-center text-xs text-[#555] pb-2">
        {entries === undefined ? "…" : t("count", { count: entries.length })}
      </p>
      <div className="text-[10px] leading-snug text-[#666] pb-3 px-1 flex flex-col gap-1">
        <p className="font-bold">{t("privacyTitle")}</p>
        <p>{t("privacy1")}</p>
        <p>{t("privacy2")}</p>
        <p>{t("privacy3")}</p>
      </div>
    </div>
  );
}
