import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { ar } from "./ar";
import { en } from "./en";
import { es } from "./es";
import { hi } from "./hi";
import type { Messages } from "./types";
import { zh } from "./zh";

const MESSAGES: Record<Locale, Messages> = { en, ar, es, hi, zh };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}

export type { Messages } from "./types";
