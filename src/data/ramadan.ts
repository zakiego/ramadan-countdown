export interface RamadanData {
  year: number;
  hijriYear: string;
  ramadanStart: Date;
  ramadanEnd: Date;
  eidAlFitr: Date;
}

/**
 * Ramadan dates data.
 * To add a new year, simply add a new entry to this array.
 * The array is pre-sorted by ramadanStart date.
 */
export const ramadanData: RamadanData[] = [
  {
    year: 2023,
    hijriYear: "1444H",
    ramadanStart: new Date("2023-03-22"),
    ramadanEnd: new Date("2023-04-20"),
    eidAlFitr: new Date("2023-04-21"),
  },
  {
    year: 2024,
    hijriYear: "1445H",
    ramadanStart: new Date("2024-03-12"),
    ramadanEnd: new Date("2024-04-11"),
    eidAlFitr: new Date("2024-04-12"),
  },
  {
    year: 2025,
    hijriYear: "1446H",
    ramadanStart: new Date("2025-02-28"),
    ramadanEnd: new Date("2025-03-30"),
    eidAlFitr: new Date("2025-03-31"),
  },
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
  {
    year: 2028,
    hijriYear: "1449H",
    ramadanStart: new Date("2028-01-28"),
    ramadanEnd: new Date("2028-02-25"),
    eidAlFitr: new Date("2028-02-26"),
  },
  {
    year: 2029,
    hijriYear: "1450H",
    ramadanStart: new Date("2029-01-16"),
    ramadanEnd: new Date("2029-02-13"),
    eidAlFitr: new Date("2029-02-14"),
  },
  {
    year: 2030,
    hijriYear: "1451H",
    ramadanStart: new Date("2030-01-05"),
    ramadanEnd: new Date("2030-02-03"),
    eidAlFitr: new Date("2030-02-04"),
  },
];
