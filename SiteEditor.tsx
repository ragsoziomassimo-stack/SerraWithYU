import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EyeOff, History, Pencil, Trash2, Undo2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { getStoredProgrammerPassword, useProgrammerSpace } from "@/hooks/use-programmer-space.ts";
import { useApplyOverrides } from "@/hooks/use-site-overrides.ts";

type Target = { kind: "text"; original: string; value: string } | { kind: "hide"; src: string };

// Cerca il testo sotto il dito/mouse e controlla che il tocco sia davvero sopra il testo.
function textNodeAt(x: number, y: number): Text | null {
  const range = document.caretRangeFromPoint?.(x, y);
  const node = range?.startContainer;
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;
  const box = document.createRange();
  box.selectNodeContents(node);
  const r = box.getBoundingClientRect();
  const slack = 8;
  const inside = x >= r.left - slack && x <= r.right + slack && y >= r.top - slack && y <= r.bottom + slack;
  return inside ? (node as Text) : null;
}

export default function SiteEditor() {
  const { i18n, t } = useTranslation("extra");
  const lang = i18n.language;
  const { unlocked } = useProgrammerSpace();
  const overrides = useQuery(api.siteOverrides.list, {});
  const setOverride = useMutation(api.siteOverrides.set);
  const removeOverride = useMutation(api.siteOverrides.remove);
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [listOpen, setListOpen] = useState(false);

  useApplyOverrides(overrides, lang);

  const active = editing && unlocked;

  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el.closest('[data-site-editor],[role="dialog"],[role="alertdialog"]')) return;
      e.preventDefault();
      e.stopPropagation();
      if (el instanceof HTMLImageElement) {
        setTarget({ kind: "hide", src: el.getAttribute("src") ?? "" });
        return;
      }
      const node = textNodeAt(e.clientX, e.clientY);
      const shown = node?.nodeValue?.trim();
      if (!shown) {
        toast.info("Tocca direttamente un testo o una foto");
        return;
      }
      // Se il testo è già stato modificato, si riparte dall'originale salvato.
      const done = overrides?.find((o) => o.kind === "text" && o.lang === lang && o.replacement === shown);
      setTarget({ kind: "text", original: done?.original ?? shown, value: shown });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active, overrides, lang]);

  if (!unlocked) return null;

  const save = async (t: Target, replacement: string) => {
    try {
      await setOverride({
        password: getStoredProgrammerPassword(),
        kind: t.kind,
        lang: t.kind === "text" ? lang : "*",
        original: t.kind === "text" ? t.original : t.src,
        replacement,
      });
      toast.success("Modifica salvata");
      setTarget(null);
    } catch {
      toast.error("Salvataggio non riuscito");
    }
  };

  const restore = async (id: Id<"site_overrides">) => {
    try {
      await removeOverride({ password: getStoredProgrammerPassword(), id });
      toast.success("Originale ripristinato");
    } catch {
      toast.error("Ripristino non riuscito");
    }
  };

  const visible = (overrides ?? []).filter((o) => o.kind === "hide" || o.lang === lang);

  return (
    <div data-site-editor>
      {active && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-black shadow-lg">
          {t("edMode")}
        </div>
      )}
      <div className="fixed bottom-[96px] left-3 z-40 flex gap-2">
        <Button size="sm" onClick={() => setEditing((v) => !v)} className={`cursor-pointer shadow-lg ${active ? "bg-amber-500 text-black hover:bg-amber-600" : "bg-[#8B2500] text-white"}`}>
          <Pencil className="size-4" /> {active ? t("edEnd") : t("edStart")}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setListOpen(true)} className="cursor-pointer shadow-lg">
          <History className="size-4" /> {visible.length}
        </Button>
      </div>

      <Dialog open={target !== null} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          {target?.kind === "text" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("edTextT")}</DialogTitle>
                <DialogDescription>{t("edTextD")}</DialogDescription>
              </DialogHeader>
              <Textarea
                value={target.value}
                rows={6}
                onChange={(e) => setTarget({ ...target, value: e.target.value })}
              />
              <DialogFooter className="gap-2 sm:justify-between">
                <Button variant="destructive" className="cursor-pointer" onClick={() => save(target, "")}>
                  <Trash2 className="size-4" /> {t("edDel")}
                </Button>
                <Button className="cursor-pointer" onClick={() => save(target, target.value.trim())}>
                  {t("edSave")}
                </Button>
              </DialogFooter>
            </>
          )}
          {target?.kind === "hide" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("edHideT")}</DialogTitle>
                <DialogDescription>{t("edHideD")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" className="cursor-pointer" onClick={() => save(target, "hidden")}>
                  <EyeOff className="size-4" /> {t("edHide")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("edListT")}</DialogTitle>
            <DialogDescription>{t("edListD")}</DialogDescription>
          </DialogHeader>
          {visible.length === 0 && <p className="text-sm text-muted-foreground">{t("edNone")}</p>}
          <div className="space-y-2">
            {visible.map((o) => (
              <div key={o._id} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate font-bold">{o.kind === "hide" ? t("edHidden") : o.original}</p>
                  <p className="m-0 truncate text-muted-foreground">
                    {o.kind === "hide" ? o.original : o.replacement || t("edDeleted")}
                  </p>
                </div>
                <Button size="sm" variant="secondary" className="cursor-pointer" onClick={() => restore(o._id)}>
                  <Undo2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
