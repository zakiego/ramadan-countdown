import type { RamadanData } from "@/data/ramadan";

export const SITE_URL = "https://ramadan.zakiego.com";

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * The moment the site was built, injected by Vite `define`. All prerendered
 * SEO copy derives from this single timestamp so the server HTML and the
 * hydrating client bundle always agree (no hydration mismatch). CI rebuilds
 * daily to keep it fresh. Falls back to the current time in environments
 * without the define (e.g. Vitest).
 */
export function getBuildDate(): Date {
  return typeof __BUILD_DATE__ === "string"
    ? new Date(__BUILD_DATE__)
    : new Date();
}

/** Ramadan dates are stored as UTC midnight, so all day math happens in UTC. */
function toUtcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function addDaysUtc(date: Date, days: number): Date {
  return new Date(toUtcMidnight(date).getTime() + days * DAY_MS);
}

/** Whole calendar days from `from` to `to` (UTC midnights). */
export function daysBetweenUtc(from: Date, to: Date): number {
  return Math.round(
    (toUtcMidnight(to).getTime() - toUtcMidnight(from).getTime()) / DAY_MS,
  );
}

/** "Sunday, February 7, 2027" */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "February 7, 2027" */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "1448H" -> "1448 AH" */
function formatHijri(hijriYear: string): string {
  return hijriYear.replace(/H$/, " AH");
}

function daysWord(n: number): string {
  return n === 1 ? "day" : "days";
}

function totalRamadanDays(ramadan: RamadanData): number {
  return daysBetweenUtc(ramadan.ramadanStart, ramadan.ramadanEnd) + 1;
}

// ---------------------------------------------------------------------------
// Phase detection (which copy the page should carry, resolved at build time)
// ---------------------------------------------------------------------------

export type HomeSeoPhase =
  | { mode: "pre"; target: RamadanData; daysUntil: number }
  | {
      mode: "during";
      target: RamadanData;
      dayOf: number;
      totalDays: number;
      daysUntilEid: number;
    }
  | { mode: "eid"; target: RamadanData };

export function getHomeSeoPhase(
  ramadans: RamadanData[],
  now: Date,
): HomeSeoPhase {
  const today = toUtcMidnight(now);
  const sorted = [...ramadans].sort(
    (a, b) => a.ramadanStart.getTime() - b.ramadanStart.getTime(),
  );

  for (const ramadan of sorted) {
    if (today.getTime() === toUtcMidnight(ramadan.eidAlFitr).getTime()) {
      return { mode: "eid", target: ramadan };
    }
    if (
      today >= toUtcMidnight(ramadan.ramadanStart) &&
      today <= toUtcMidnight(ramadan.ramadanEnd)
    ) {
      return {
        mode: "during",
        target: ramadan,
        dayOf: daysBetweenUtc(ramadan.ramadanStart, today) + 1,
        totalDays: totalRamadanDays(ramadan),
        daysUntilEid: daysBetweenUtc(today, ramadan.eidAlFitr),
      };
    }
  }

  const next = sorted.find((r) => toUtcMidnight(r.ramadanStart) > today);
  const target = next ?? sorted[sorted.length - 1];
  return {
    mode: "pre",
    target,
    daysUntil: Math.max(0, daysBetweenUtc(today, target.ramadanStart)),
  };
}

/** Eid page: celebration copy on Eid day and the two days after it. */
export type EidSeoPhase =
  | { mode: "pre"; target: RamadanData; daysUntil: number }
  | { mode: "day"; target: RamadanData };

export function getEidSeoPhase(
  ramadans: RamadanData[],
  now: Date,
): EidSeoPhase {
  const today = toUtcMidnight(now);
  const sorted = [...ramadans].sort(
    (a, b) => a.eidAlFitr.getTime() - b.eidAlFitr.getTime(),
  );

  for (const ramadan of sorted) {
    const eid = toUtcMidnight(ramadan.eidAlFitr);
    if (today >= eid && today <= addDaysUtc(eid, 2)) {
      return { mode: "day", target: ramadan };
    }
  }

  const next = sorted.find((r) => toUtcMidnight(r.eidAlFitr) > today);
  const target = next ?? sorted[sorted.length - 1];
  return {
    mode: "pre",
    target,
    daysUntil: Math.max(0, daysBetweenUtc(today, target.eidAlFitr)),
  };
}

// ---------------------------------------------------------------------------
// Copy builders
// ---------------------------------------------------------------------------

export interface Faq {
  question: string;
  answer: string;
}

export interface PageSeo {
  title: string;
  description: string;
  h1: string;
  /** The one-sentence answer rendered right under the live countdown. */
  answer: string;
  faqs: Faq[];
}

function weeksAnswer(year: number, days: number): string {
  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `Less than a week is left until Ramadan ${year}: just ${days} ${daysWord(days)} to go.`;
  }
  return `About ${weeks} ${weeks === 1 ? "week" : "weeks"} (${days} ${daysWord(days)}) are left until Ramadan ${year}.`;
}

function monthsAnswer(year: number, days: number, start: Date): string {
  const months = Math.round(days / 30.44);
  if (months < 1) {
    return `Less than a month is left until Ramadan ${year}: just ${days} ${daysWord(days)}.`;
  }
  const label = months === 1 ? "about 1 month" : `about ${months} months`;
  return `There ${months === 1 ? "is" : "are"} ${label} (${days} ${daysWord(days)}) left until Ramadan ${year}, which is expected to begin on ${formatShortDate(start)}.`;
}

function howLongFaq(target: RamadanData): Faq {
  return {
    question: "How long does Ramadan last?",
    answer: `Ramadan lasts 29 or 30 days, one full lunar month. Ramadan ${formatHijri(target.hijriYear)} (${target.year}) is expected to run for ${totalRamadanDays(target)} days, from ${formatShortDate(target.ramadanStart)} to ${formatShortDate(target.ramadanEnd)}.`,
  };
}

function whenIsEidFaq(target: RamadanData): Faq {
  return {
    question: `When is Eid al-Fitr ${target.year}?`,
    answer: `Eid al-Fitr ${target.year}, the festival marking the end of Ramadan, is expected on ${formatFullDate(target.eidAlFitr)} (1 Shawwal ${formatHijri(target.hijriYear)}).`,
  };
}

const WHAT_IS_RAMADAN_FAQ: Faq = {
  question: "What is Ramadan?",
  answer:
    "Ramadan (also spelled Ramzan, Ramadhan, or Ramazan) is the ninth month of the Islamic calendar, when Muslims around the world fast from dawn to sunset, give charity, and increase prayer and Quran recitation. It ends with the Eid al-Fitr celebration.",
};

export function getHomeSeo(ramadans: RamadanData[], now: Date): PageSeo {
  const phase = getHomeSeoPhase(ramadans, now);
  const target = phase.target;
  const year = target.year;
  const hijri = formatHijri(target.hijriYear);

  if (phase.mode === "during") {
    const { dayOf, totalDays, daysUntilEid } = phase;
    return {
      title: `How Many Days Left in Ramadan ${year}? Day ${dayOf} of ${totalDays}`,
      description: `Today is day ${dayOf} of ${totalDays} of Ramadan ${year}. ${daysUntilEid} ${daysWord(daysUntilEid)} left until Eid al-Fitr, expected on ${formatShortDate(target.eidAlFitr)}. Follow the live day tracker.`,
      h1: `Ramadan ${year}`,
      answer: `Today is day ${dayOf} of ${totalDays} of Ramadan ${hijri} (${year}). ${daysUntilEid} ${daysWord(daysUntilEid)} ${daysUntilEid === 1 ? "is" : "are"} left until Eid al-Fitr, expected on ${formatFullDate(target.eidAlFitr)}, inshaAllah.`,
      faqs: [
        {
          question: `How many days are left in Ramadan ${year}?`,
          answer: `Today is day ${dayOf} of ${totalDays} of Ramadan ${hijri}. There ${daysUntilEid === 1 ? "is" : "are"} ${daysUntilEid} ${daysWord(daysUntilEid)} left until Eid al-Fitr, expected on ${formatFullDate(target.eidAlFitr)}.`,
        },
        {
          question: `When does Ramadan ${year} end?`,
          answer: `The last day of fasting is expected to be ${formatFullDate(target.ramadanEnd)}, with Eid al-Fitr on ${formatFullDate(target.eidAlFitr)}, depending on the moon sighting.`,
        },
        {
          question: `When did Ramadan ${year} start?`,
          answer: `Ramadan ${hijri} began on ${formatFullDate(target.ramadanStart)} (1 Ramadan).`,
        },
        howLongFaq(target),
        whenIsEidFaq(target),
        WHAT_IS_RAMADAN_FAQ,
      ],
    };
  }

  if (phase.mode === "eid") {
    const next = ramadans.find(
      (r) => r.ramadanStart.getTime() > target.ramadanStart.getTime(),
    );
    const faqs: Faq[] = [
      {
        question: `When is Eid al-Fitr ${year}?`,
        answer: `Eid al-Fitr ${year} falls on ${formatFullDate(target.eidAlFitr)} (1 Shawwal ${hijri}), marking the end of Ramadan.`,
      },
    ];
    if (next) {
      faqs.push({
        question: `When is Ramadan ${next.year}?`,
        answer: `Ramadan ${next.year} (1 Ramadan ${formatHijri(next.hijriYear)}) is expected to begin on ${formatFullDate(next.ramadanStart)}.`,
      });
    }
    faqs.push(howLongFaq(target), WHAT_IS_RAMADAN_FAQ);
    return {
      title: `Eid Mubarak! Eid al-Fitr ${year} Has Arrived`,
      description: `Today is Eid al-Fitr, 1 Shawwal ${hijri}, marking the end of Ramadan ${year}. Taqabbalallahu minna wa minkum, Eid Mubarak!`,
      h1: `Eid al-Fitr ${year}`,
      answer: `Today, ${formatFullDate(target.eidAlFitr)}, is Eid al-Fitr (1 Shawwal ${hijri}), the celebration marking the end of Ramadan ${year}. Eid Mubarak!`,
      faqs,
    };
  }

  const { daysUntil } = phase;
  return {
    title: `How Many Days Until Ramadan ${year}? Live Countdown`,
    description: `Ramadan ${year} is expected to begin on ${formatShortDate(target.ramadanStart)}, ${daysUntil} ${daysWord(daysUntil)} from today. Live countdown of the days, weeks, and months left.`,
    h1: `Ramadan Countdown ${year}`,
    answer: `Ramadan ${year} is expected to begin on ${formatFullDate(target.ramadanStart)}, inshaAllah. That is ${daysUntil} ${daysWord(daysUntil)} from today.`,
    faqs: [
      {
        question: `How many days until Ramadan ${year}?`,
        answer: `There are ${daysUntil} ${daysWord(daysUntil)} until Ramadan ${year}. The first day of fasting is expected to be ${formatFullDate(target.ramadanStart)} (1 Ramadan ${hijri}), depending on the sighting of the crescent moon.`,
      },
      {
        question: `When does Ramadan ${year} start?`,
        answer: `Ramadan ${year} is expected to begin at sunset on ${formatFullDate(addDaysUtc(target.ramadanStart, -1))}, with the first full day of fasting on ${formatFullDate(target.ramadanStart)}. The exact date depends on the moon sighting in your country.`,
      },
      {
        question: `How many weeks until Ramadan ${year}?`,
        answer: weeksAnswer(year, daysUntil),
      },
      {
        question: `How many months until Ramadan ${year}?`,
        answer: monthsAnswer(year, daysUntil, target.ramadanStart),
      },
      howLongFaq(target),
      whenIsEidFaq(target),
      WHAT_IS_RAMADAN_FAQ,
    ],
  };
}

export function getEidSeo(ramadans: RamadanData[], now: Date): PageSeo {
  const phase = getEidSeoPhase(ramadans, now);
  const target = phase.target;
  const year = target.year;
  const hijri = formatHijri(target.hijriYear);

  const whatIsEidFaq: Faq = {
    question: "What is Eid al-Fitr?",
    answer:
      "Eid al-Fitr (also written Eid ul-Fitr) is the festival of breaking the fast, celebrated on 1 Shawwal, the day after Ramadan ends. Muslims mark it with the Eid prayer, zakat al-fitr charity, festive meals, and visits to family and friends.",
  };
  const adhaFaq: Faq = {
    question: "Is Eid al-Fitr the same as Eid al-Adha?",
    answer:
      "No. Eid al-Fitr comes right after Ramadan, while Eid al-Adha falls about 70 days later, on 10 Dhul-Hijjah during the Hajj season. This page counts down to Eid al-Fitr.",
  };

  if (phase.mode === "day") {
    const next = ramadans.find(
      (r) => r.eidAlFitr.getTime() > target.eidAlFitr.getTime(),
    );
    const faqs: Faq[] = [whatIsEidFaq, adhaFaq];
    if (next) {
      faqs.push({
        question: "When is the next Eid al-Fitr?",
        answer: `The next Eid al-Fitr (${next.year}) is expected on ${formatFullDate(next.eidAlFitr)} (1 Shawwal ${formatHijri(next.hijriYear)}).`,
      });
    }
    return {
      title: `Eid Mubarak! Eid al-Fitr ${year} Is Here`,
      description: `Eid al-Fitr ${year} (1 Shawwal ${hijri}) has arrived. Taqabbalallahu minna wa minkum, Eid Mubarak!`,
      h1: `Eid al-Fitr ${year}`,
      answer: `Eid Mubarak! Eid al-Fitr ${year} (1 Shawwal ${hijri}) began on ${formatFullDate(target.eidAlFitr)}. Taqabbalallahu minna wa minkum.`,
      faqs,
    };
  }

  const { daysUntil } = phase;
  const ramadanStarted = toUtcMidnight(now) >= toUtcMidnight(target.ramadanStart);
  return {
    title: `How Many Days Until Eid al-Fitr ${year}? Countdown`,
    description: `Eid al-Fitr ${year} is expected on ${formatShortDate(target.eidAlFitr)}, ${daysUntil} ${daysWord(daysUntil)} from today. Live countdown to Eid ul-Fitr in days, hours, minutes, and seconds.`,
    h1: `Eid al-Fitr Countdown ${year}`,
    answer: `Eid al-Fitr ${year} is expected on ${formatFullDate(target.eidAlFitr)} (1 Shawwal ${hijri}), inshaAllah. That is ${daysUntil} ${daysWord(daysUntil)} from today.`,
    faqs: [
      {
        question: `How many days until Eid al-Fitr ${year}?`,
        answer: `There are ${daysUntil} ${daysWord(daysUntil)} until Eid al-Fitr ${year}, expected on ${formatFullDate(target.eidAlFitr)}, depending on the moon sighting.`,
      },
      {
        question: `When is Eid al-Fitr ${year}?`,
        answer: `Eid al-Fitr ${year} (1 Shawwal ${hijri}) is expected on ${formatFullDate(target.eidAlFitr)}. It marks the end of Ramadan, which ${ramadanStarted ? "began" : "is expected to begin"} on ${formatShortDate(target.ramadanStart)}.`,
      },
      whatIsEidFaq,
      adhaFaq,
    ],
  };
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

export function faqJsonLd(faqs: Faq[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
