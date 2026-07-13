import type { DateFmt } from "@/i18n/messages/types";

/**
 * Pure UTC date helpers. Ramadan dates are stored as UTC midnight, so all day
 * math happens in UTC. Kept dependency-free so both `seo.ts` and the locale
 * message files can import it without an import cycle.
 */

const DAY_MS = 1000 * 60 * 60 * 24;

export function toUtcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function addDaysUtc(date: Date, days: number): Date {
  return new Date(toUtcMidnight(date).getTime() + days * DAY_MS);
}

/** Whole calendar days from `from` to `to` (UTC midnights). */
export function daysBetweenUtc(from: Date, to: Date): number {
  return Math.round(
    (toUtcMidnight(to).getTime() - toUtcMidnight(from).getTime()) / DAY_MS,
  );
}

/**
 * Build locale-bound date formatters. Digits are forced to Latin
 * (`numberingSystem: latn`) so localized dates stay visually consistent with
 * the live countdown boxes, which always render Western numerals. Formatting
 * in UTC keeps users in negative-offset timezones from seeing the prior day.
 */
export function makeDateFmt(dateLocale: string): DateFmt {
  const full = new Intl.DateTimeFormat(dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    numberingSystem: "latn",
  });
  const short = new Intl.DateTimeFormat(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    numberingSystem: "latn",
  });
  return {
    full: (date) => full.format(date),
    short: (date) => short.format(date),
  };
}
