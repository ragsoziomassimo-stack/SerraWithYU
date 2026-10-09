import { useEffect } from "react";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type Override = Doc<"site_overrides">;

// Parti che non vanno mai modificate: lo strumento di modifica stesso e campi di input.
const SKIP = "[data-site-editor],script,style,noscript,textarea,input";
const OBSERVE_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["src"],
};

/**
 * Applica al sito le modifiche salvate dal programmatore (testi sostituiti/cancellati, foto nascoste).
 * Lavora sul DOM: così vale per ogni pagina e ogni testo, anche scritti direttamente nel codice.
 */
export function useApplyOverrides(overrides: Override[] | undefined, lang: string) {
  useEffect(() => {
    if (!overrides) return;
    const texts = new Map<string, string>();
    const hidden = new Set<string>();
    for (const o of overrides) {
      if (o.kind === "text" && o.lang === lang) texts.set(o.original, o.replacement);
      if (o.kind === "hide") hidden.add(o.original);
    }
    if (texts.size === 0 && hidden.size === 0) return;

    const changedTexts = new Map<Text, string>();
    const hiddenImgs = new Map<HTMLElement, string>();
    let observer: MutationObserver | null = null;

    const applyText = (node: Text) => {
      const raw = node.nodeValue ?? "";
      const key = raw.trim();
      const replacement = texts.get(key);
      if (replacement === undefined || replacement === key) return;
      if (node.parentElement?.closest(SKIP)) return;
      changedTexts.set(node, raw);
      node.nodeValue = raw.replace(key, () => replacement);
    };

    const applyImage = (img: HTMLElement) => {
      const shouldHide = hidden.has(img.getAttribute("src") ?? "");
      const isHidden = hiddenImgs.has(img);
      if (shouldHide && !isHidden) {
        hiddenImgs.set(img, img.style.display);
        img.style.display = "none";
      } else if (!shouldHide && isHidden) {
        img.style.display = hiddenImgs.get(img) ?? "";
        hiddenImgs.delete(img);
      }
    };

    const applyTree = (start: Node) => {
      if (start.nodeType === Node.TEXT_NODE) {
        applyText(start as Text);
        return;
      }
      if (!(start instanceof HTMLElement)) return;
      const walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) applyText(n as Text);
      if (start.tagName === "IMG") applyImage(start);
      start.querySelectorAll("img").forEach(applyImage);
    };

    const onMutations = (records: MutationRecord[]) => {
      // Si scollega durante le modifiche, per non reagire alle proprie scritture.
      observer?.disconnect();
      for (const r of records) {
        if (r.type === "childList") r.addedNodes.forEach(applyTree);
        else if (r.type === "characterData") applyTree(r.target);
        else if (r.target instanceof HTMLElement) applyImage(r.target);
      }
      observer?.observe(document.body, OBSERVE_OPTIONS);
    };

    observer = new MutationObserver(onMutations);
    applyTree(document.body);
    observer.observe(document.body, OBSERVE_OPTIONS);

    return () => {
      observer?.disconnect();
      changedTexts.forEach((raw, node) => {
        if (node.isConnected) node.nodeValue = raw;
      });
      hiddenImgs.forEach((display, img) => {
        img.style.display = display;
      });
    };
  }, [overrides, lang]);
}
