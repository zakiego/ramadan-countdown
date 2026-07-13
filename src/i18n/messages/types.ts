import type { RamadanData } from "@/data/ramadan";

/** A single question/answer pair rendered in the FAQ section and JSON-LD. */
export interface Faq {
  question: string;
  answer: string;
}

/** All translatable copy for one page in one phase. */
export interface PageSeo {
  title: string;
  description: string;
  h1: string;
  /** The one-sentence answer rendered right under the live countdown. */
  answer: string;
  faqs: Faq[];
}

/** Locale-bound date formatters (Latin digits, UTC). Built in `utils/date.ts`. */
export interface DateFmt {
  /** e.g. "Sunday, February 7, 2027" in the active locale. */
  full(date: Date): string;
  /** e.g. "February 7, 2027" in the active locale. */
  short(date: Date): string;
}

// ---------------------------------------------------------------------------
// SEO copy-builder contexts. seo.ts detects the phase, gathers these, and
// hands them to the active locale's builder, which returns a full PageSeo.
// ---------------------------------------------------------------------------

export interface HomePreCtx {
  target: RamadanData;
  daysUntil: number;
  /** The evening Ramadan begins (day before the first full fasting day). */
  eveOfStart: Date;
  fmt: DateFmt;
}

export interface HomeDuringCtx {
  target: RamadanData;
  dayOf: number;
  totalDays: number;
  daysUntilEid: number;
  fmt: DateFmt;
}

export interface HomeEidCtx {
  target: RamadanData;
  /** The following year's Ramadan, when known. */
  next: RamadanData | undefined;
  fmt: DateFmt;
}

export interface EidPreCtx {
  target: RamadanData;
  daysUntil: number;
  /** Whether Ramadan has already started (drives past/future tense). */
  ramadanStarted: boolean;
  fmt: DateFmt;
}

export interface EidDayCtx {
  target: RamadanData;
  next: RamadanData | undefined;
  fmt: DateFmt;
}

/** Split copy that wraps an inline `<Link>` (before + link text + after). */
export interface LinkedText {
  before: string;
  link: string;
  after: string;
}

/** Split copy that wraps a styled inline value such as a date. */
export interface WrappedText {
  before: string;
  after: string;
}

/** Short UI strings used by the React components. */
export interface UiMessages {
  // Live countdown boxes
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  /** "Ramadan {hijri} will, inshaAllah, be coming on " + <date>. */
  ramadanComingOn(hijriYear: string): WrappedText;
  /** "Eid al-Fitr {hijri} will, inshaAllah, be celebrated on " + <date>. */
  eidCelebratedOn(hijriYear: string): WrappedText;

  // During-Ramadan / Lailatul Qadr card
  /** "Ramadan {hijri}" label. */
  ramadanLabel(hijriYear: string): string;
  dayOfRamadan: string;
  lailatulQadrPeriod: string;
  nightOfDecreeQuote: string;

  // Eid celebration card
  eidMubarak: string;
  /** "1 Shawwal {hijri}". */
  shawwal(hijriYear: string): string;
  taqabbal: string;

  // Dates table
  datesTableHeading: string;
  colYear: string;
  colFirstDay: string;
  colEid: string;
  colHijri: string;
  datesTableNote: string;
  datesTable2030Note: string;

  // FAQ section
  faqHeading: string;

  // Cross-page links
  crossToEid: LinkedText;
  crossToRamadan: LinkedText;

  // Footer link labels
  footerEidCountdown: string;
  footerRamadanCountdown: string;
  footerApi: string;
  footerBuiltBy: string;

  // Not-found page
  notFoundMessage: string;
  notFoundBack: string;

  // Language switcher
  languageLabel: string;
}

/** The full translation contract every locale must implement. */
export interface Messages {
  home: {
    pre(ctx: HomePreCtx): PageSeo;
    during(ctx: HomeDuringCtx): PageSeo;
    eid(ctx: HomeEidCtx): PageSeo;
  };
  eidPage: {
    pre(ctx: EidPreCtx): PageSeo;
    day(ctx: EidDayCtx): PageSeo;
  };
  ui: UiMessages;
}
