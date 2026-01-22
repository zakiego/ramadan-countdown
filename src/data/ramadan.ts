export interface RamadanData {
  year: number;
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
    ramadanStart: new Date("2023-03-22"),
    ramadanEnd: new Date("2023-04-20"),
    eidAlFitr: new Date("2023-04-21"),
  },
  {
    year: 2024,
    ramadanStart: new Date("2024-03-12"),
    ramadanEnd: new Date("2024-04-11"),
    eidAlFitr: new Date("2024-04-12"),
  },
  {
    year: 2025,
    ramadanStart: new Date("2025-02-28"),
    ramadanEnd: new Date("2025-03-30"),
    eidAlFitr: new Date("2025-03-31"),
  },
  {
    year: 2026,
    ramadanStart: new Date("2026-02-18"),
    ramadanEnd: new Date("2026-03-19"),
    eidAlFitr: new Date("2026-03-20"),
  },
  {
    year: 2027,
    ramadanStart: new Date("2027-02-07"),
    ramadanEnd: new Date("2027-03-08"),
    eidAlFitr: new Date("2027-03-09"),
  },
];
