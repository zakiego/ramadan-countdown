import type { RamadanData } from "@/data/ramadan";
import { getRamadanState } from "@/utils/ramadan-state";
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

describe("getRamadanState", () => {
  it("counts down to the next Ramadan before it starts", () => {
    const state = getRamadanState(ramadans, new Date("2026-01-18T00:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.targetRamadan.year).toBe(2026);
      expect(state.hijriYear).toBe("1447H");
      expect(state.countdown.days).toBeGreaterThan(0);
    }
  });

  it("reports the day number during Ramadan", () => {
    const state = getRamadanState(ramadans, new Date("2026-02-18T12:00:00"));
    expect(state.type).toBe("ramadan");
    if (state.type === "ramadan") {
      expect(state.day).toBe(1);
      expect(state.totalDays).toBe(30);
    }
  });

  it("switches to lailatul qadr in the last ten nights", () => {
    const state = getRamadanState(ramadans, new Date("2026-03-10T12:00:00"));
    expect(state.type).toBe("lailatul_qadr");
    if (state.type === "lailatul_qadr") {
      expect(state.day).toBeGreaterThanOrEqual(21);
    }
  });

  it("celebrates Eid on Eid al-Fitr", () => {
    const state = getRamadanState(ramadans, new Date("2026-03-20T08:00:00"));
    expect(state.type).toBe("eid");
    if (state.type === "eid") {
      expect(state.hijriYear).toBe("1447H");
    }
  });

  it("targets the following year between Eid and the next Ramadan", () => {
    const state = getRamadanState(ramadans, new Date("2026-07-07T00:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.targetRamadan.year).toBe(2027);
    }
  });

  it("falls back to the last known Ramadan when no future data exists", () => {
    const state = getRamadanState(ramadans, new Date("2030-01-01T00:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.targetRamadan.year).toBe(2027);
      expect(state.countdown).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
  });
});
