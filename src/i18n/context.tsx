import { LOCALE_META, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { DateFmt, UiMessages } from "@/i18n/messages/types";
import { makeDateFmt } from "@/utils/date";
import { type ReactNode, createContext, useContext, useMemo } from "react";

interface I18nValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  /** Short UI strings for the active locale. */
  ui: UiMessages;
  /** Locale-bound, Latin-digit, UTC date formatters. */
  fmt: DateFmt;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(() => {
    const meta = LOCALE_META[locale];
    return {
      locale,
      dir: meta.dir,
      ui: getMessages(locale).ui,
      fmt: makeDateFmt(meta.dateLocale),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return value;
}
