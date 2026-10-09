import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@/i18n.ts";

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lang: Language) => {
      void i18n.changeLanguage(lang);
      try {
        localStorage.setItem("lang", lang);
      } catch {
        // localStorage might be disabled
      }
    },
    [i18n],
  );

  return {
    currentLanguage: i18n.language as Language,
    changeLanguage,
  };
}
