import type { RamadanData } from "@/data/ramadan";
import { getEidState } from "@/utils/eid-state";
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

describe("getEidState", () => {
  it("counts down to the next Eid", () => {
    const state = getEidState(ramadans, new Date("2026-07-13T00:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.target.year).toBe(2027);
      expect(state.countdown.days).toBeGreaterThan(0);
    }
  });

  it("counts down to the current year's Eid during Ramadan", () => {
    const state = getEidState(ramadans, new Date("2027-02-18T12:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.target.year).toBe(2027);
      expect(state.countdown.days).toBeLessThan(30);
    }
  });

  it("celebrates on Eid day and the two days after", () => {
    expect(getEidState(ramadans, new Date("2027-03-09T08:00:00")).type).toBe(
      "celebration",
    );
    expect(getEidState(ramadans, new Date("2027-03-11T08:00:00")).type).toBe(
      "celebration",
    );
  });

  it("returns to a countdown after the celebration window", () => {
    const state = getEidState(ramadans, new Date("2026-03-23T08:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.target.year).toBe(2027);
    }
  });

  it("falls back to the last known Eid when no future data exists", () => {
    const state = getEidState(ramadans, new Date("2030-01-01T00:00:00"));
    expect(state.type).toBe("countdown");
    if (state.type === "countdown") {
      expect(state.target.year).toBe(2027);
      expect(state.countdown.days).toBe(0);
    }
  });
});
