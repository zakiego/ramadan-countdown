import type { RamadanData } from "@/data/ramadan";

export type RamadanStateType =
  | "countdown"
  | "ramadan"
  | "lailatul_qadr"
  | "eid";

export interface CountdownState {
  type: "countdown";
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  targetRamadan: RamadanData;
  hijriYear: string;
}

export interface RamadanState {
  type: "ramadan";
  day: number;
  totalDays: number;
  currentRamadan: RamadanData;
  hijriYear: string;
}

export interface LailatulQadrState {
  type: "lailatul_qadr";
  day: number;
  totalDays: number;
  currentRamadan: RamadanData;
  hijriYear: string;
}

export interface EidState {
  type: "eid";
  currentRamadan: RamadanData;
  hijriYear: string;
}

export type RamadanDisplayState =
  | CountdownState
  | RamadanState
  | LailatulQadrState
  | EidState;

/**
 * Normalize a date to midnight (start of day) in local time
 */
function normalizeToMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Calculate the day number of Ramadan (1-indexed)
 */
function getRamadanDay(currentDate: Date, ramadanStart: Date): number {
  const start = normalizeToMidnight(ramadanStart);
  const current = normalizeToMidnight(currentDate);
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // 1-indexed
}

/**
 * Calculate total days in Ramadan
 */
function getTotalRamadanDays(ramadanStart: Date, ramadanEnd: Date): number {
  const start = normalizeToMidnight(ramadanStart);
  const end = normalizeToMidnight(ramadanEnd);
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Calculate countdown to a target date
 */
function calculateCountdown(
  targetDate: Date,
  currentDate: Date,
): { days: number; hours: number; minutes: number; seconds: number } {
  const difference = targetDate.getTime() - currentDate.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

/**
 * Determine the current Ramadan state based on the current date
 */
export function getRamadanState(
  ramadans: RamadanData[],
  currentDate: Date = new Date(),
): RamadanDisplayState {
  const now = currentDate;
  const today = normalizeToMidnight(now);

  // Sort ramadans by start date
  const sortedRamadans = [...ramadans].sort(
    (a, b) => a.ramadanStart.getTime() - b.ramadanStart.getTime(),
  );

  // Check if we're on Eid al-Fitr
  for (const ramadan of sortedRamadans) {
    const eidDate = normalizeToMidnight(ramadan.eidAlFitr);
    if (today.getTime() === eidDate.getTime()) {
      return {
        type: "eid",
        currentRamadan: ramadan,
        hijriYear: ramadan.hijriYear,
      };
    }
  }

  // Check if we're during Ramadan
  for (const ramadan of sortedRamadans) {
    const ramadanStart = normalizeToMidnight(ramadan.ramadanStart);
    const ramadanEnd = normalizeToMidnight(ramadan.ramadanEnd);

    if (today >= ramadanStart && today <= ramadanEnd) {
      const day = getRamadanDay(now, ramadan.ramadanStart);
      const totalDays = getTotalRamadanDays(
        ramadan.ramadanStart,
        ramadan.ramadanEnd,
      );

      // Lailatul Qadr is during the last 10 nights (day 21-30)
      const isLailatulQadr = day >= 21;

      if (isLailatulQadr) {
        return {
          type: "lailatul_qadr",
          day,
          totalDays,
          currentRamadan: ramadan,
          hijriYear: ramadan.hijriYear,
        };
      }

      return {
        type: "ramadan",
        day,
        totalDays,
        currentRamadan: ramadan,
        hijriYear: ramadan.hijriYear,
      };
    }
  }

  // Find next Ramadan for countdown
  const nextRamadan = sortedRamadans.find(
    (r) => normalizeToMidnight(r.ramadanStart) > today,
  );

  // If no future Ramadan found, use the last one
  const targetRamadan =
    nextRamadan ?? sortedRamadans[sortedRamadans.length - 1];

  return {
    type: "countdown",
    countdown: calculateCountdown(targetRamadan.ramadanStart, now),
    targetRamadan,
    hijriYear: targetRamadan.hijriYear,
  };
}
