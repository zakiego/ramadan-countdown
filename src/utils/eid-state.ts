import type { RamadanData } from "@/data/ramadan";
import { calculateCountdown, normalizeToMidnight } from "@/utils/ramadan-state";

const DAY_MS = 1000 * 60 * 60 * 24;

export type EidDisplayState =
  | {
      type: "countdown";
      countdown: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
      };
      target: RamadanData;
      hijriYear: string;
    }
  | {
      type: "celebration";
      target: RamadanData;
      hijriYear: string;
    };

/**
 * State for the Eid al-Fitr page: celebration copy on Eid day and the two
 * days after it, otherwise a countdown to the next upcoming Eid.
 */
export function getEidState(
  ramadans: RamadanData[],
  currentDate: Date = new Date(),
): EidDisplayState {
  const today = normalizeToMidnight(currentDate);
  const sorted = [...ramadans].sort(
    (a, b) => a.eidAlFitr.getTime() - b.eidAlFitr.getTime(),
  );

  for (const ramadan of sorted) {
    const eid = normalizeToMidnight(ramadan.eidAlFitr);
    const windowEnd = new Date(eid.getTime() + 2 * DAY_MS);
    if (today >= eid && today <= windowEnd) {
      return {
        type: "celebration",
        target: ramadan,
        hijriYear: ramadan.hijriYear,
      };
    }
  }

  const next = sorted.find((r) => normalizeToMidnight(r.eidAlFitr) > today);
  const target = next ?? sorted[sorted.length - 1];
  return {
    type: "countdown",
    countdown: calculateCountdown(target.eidAlFitr, currentDate),
    target,
    hijriYear: target.hijriYear,
  };
}
