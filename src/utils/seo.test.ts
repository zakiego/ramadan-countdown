import type { RamadanData } from "@/data/ramadan";
import {
  daysBetweenUtc,
  getEidSeo,
  getEidSeoPhase,
  getHomeSeo,
  getHomeSeoPhase,
} from "@/utils/seo";
import { describe, expect, it } from "vitest";

const ramadans: RamadanData[] = [
  {
    year: 2026,
    hijriYear: "1447H",
    ramadanStart: new Date("2026-02-18"),
    ramadanEnd: new Date("2026-03-19"),
    eidAlFitr: new Date("2026-03-20"),
  },
  {
    year: 2027,
    hijriYear: "1448H",
    ramadanStart: new Date("2027-02-07"),
    ramadanEnd: new Date("2027-03-08"),
    eidAlFitr: new Date("2027-03-09"),
  },
];

describe("daysBetweenUtc", () => {
  it("counts whole calendar days regardless of time of day", () => {
    expect(
      daysBetweenUtc(new Date("2026-07-13T22:45:00Z"), new Date("2027-02-07")),
    ).toBe(209);
    expect(daysBetweenUtc(new Date("2027-02-06"), new Date("2027-02-07"))).toBe(
      1,
    );
  });
});

describe("getHomeSeoPhase", () => {
  it("is pre mode with the day count before Ramadan", () => {
    const phase = getHomeSeoPhase(ramadans, new Date("2026-07-13T10:00:00Z"));
    expect(phase).toMatchObject({ mode: "pre", daysUntil: 209 });
    expect(phase.target.year).toBe(2027);
  });

  it("is during mode with day-of and days-until-Eid inside Ramadan", () => {
    const phase = getHomeSeoPhase(ramadans, new Date("2027-02-18T12:00:00Z"));
    expect(phase).toMatchObject({
      mode: "during",
      dayOf: 12,
      totalDays: 30,
      daysUntilEid: 19,
    });
  });

  it("is eid mode on Eid al-Fitr itself", () => {
    const phase = getHomeSeoPhase(ramadans, new Date("2027-03-09T08:00:00Z"));
    expect(phase.mode).toBe("eid");
    expect(phase.target.year).toBe(2027);
  });

  it("falls back to the last known Ramadan with zero days when data runs out", () => {
    const phase = getHomeSeoPhase(ramadans, new Date("2030-06-01"));
    expect(phase).toMatchObject({ mode: "pre", daysUntil: 0 });
    expect(phase.target.year).toBe(2027);
  });
});

describe("getHomeSeo", () => {
  it("targets the question-form queries before Ramadan", () => {
    const seo = getHomeSeo(ramadans, new Date("2026-07-13T10:00:00Z"));
    expect(seo.title).toBe("How Many Days Until Ramadan 2027? Live Countdown");
    expect(seo.answer).toContain("Sunday, February 7, 2027");
    expect(seo.answer).toContain("209 days");
    expect(seo.description.length).toBeLessThanOrEqual(160);
    const questions = seo.faqs.map((f) => f.question);
    expect(questions).toContain("How many weeks until Ramadan 2027?");
    expect(questions).toContain("How many months until Ramadan 2027?");
    expect(seo.faqs.some((f) => f.answer.includes("Ramzan"))).toBe(true);
  });

  it("switches to days-left copy during Ramadan", () => {
    const seo = getHomeSeo(ramadans, new Date("2027-02-18T12:00:00Z"));
    expect(seo.title).toBe("How Many Days Left in Ramadan 2027? Day 12 of 30");
    expect(seo.answer).toContain("day 12 of 30");
    expect(seo.answer).toContain("19 days");
    expect(
      seo.faqs.some(
        (f) => f.question === "How many days are left in Ramadan 2027?",
      ),
    ).toBe(true);
  });

  it("celebrates on Eid day and points at the next year", () => {
    const seo = getHomeSeo(ramadans, new Date("2026-03-20T09:00:00Z"));
    expect(seo.title).toContain("Eid Mubarak");
    expect(seo.faqs.some((f) => f.question === "When is Ramadan 2027?")).toBe(
      true,
    );
  });

  it("handles the singular day correctly the day before Ramadan", () => {
    const seo = getHomeSeo(ramadans, new Date("2027-02-06T09:00:00Z"));
    expect(seo.answer).toContain("1 day from today");
    expect(seo.answer).not.toContain("1 days");
  });
});

describe("getEidSeoPhase", () => {
  it("counts down to the next Eid before Ramadan", () => {
    const phase = getEidSeoPhase(ramadans, new Date("2026-07-13T10:00:00Z"));
    expect(phase).toMatchObject({ mode: "pre", daysUntil: 239 });
    expect(phase.target.year).toBe(2027);
  });

  it("stays in celebration mode on Eid day and the two days after", () => {
    expect(getEidSeoPhase(ramadans, new Date("2027-03-09")).mode).toBe("day");
    expect(getEidSeoPhase(ramadans, new Date("2027-03-11")).mode).toBe("day");
    expect(getEidSeoPhase(ramadans, new Date("2027-03-12")).mode).toBe("pre");
  });

  it("targets the current year's Eid while Ramadan is running", () => {
    const phase = getEidSeoPhase(ramadans, new Date("2027-02-18T12:00:00Z"));
    expect(phase).toMatchObject({ mode: "pre", daysUntil: 19 });
    expect(phase.target.year).toBe(2027);
  });
});

describe("getEidSeo", () => {
  it("answers the days-until-Eid question", () => {
    const seo = getEidSeo(ramadans, new Date("2026-07-13T10:00:00Z"));
    expect(seo.title).toBe("How Many Days Until Eid al-Fitr 2027? Countdown");
    expect(seo.answer).toContain("Tuesday, March 9, 2027");
    expect(seo.answer).toContain("239 days");
    expect(seo.faqs.some((f) => f.answer.includes("Eid ul-Fitr"))).toBe(true);
  });

  it("uses past tense for the Ramadan start once it has begun", () => {
    const seo = getEidSeo(ramadans, new Date("2027-02-18T12:00:00Z"));
    const whenIsEid = seo.faqs.find(
      (f) => f.question === "When is Eid al-Fitr 2027?",
    );
    expect(whenIsEid?.answer).toContain("began on February 7, 2027");
  });
});
