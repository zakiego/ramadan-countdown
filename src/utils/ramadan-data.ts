import ramadan2023 from "../../public/content/ramadan/2023.json";
import ramadan2024 from "../../public/content/ramadan/2024.json";
import ramadan2025 from "../../public/content/ramadan/2025.json";
import ramadan2026 from "../../public/content/ramadan/2026.json";
import { z } from "zod";

const ramadanSchema = z.object({
  year: z.string(),
  ramadanStart: z.coerce.date(),
  ramadanEnd: z.coerce.date(),
  eidAlFitr: z.coerce.date(),
});

export type RamadanData = z.infer<typeof ramadanSchema>;

const rawData = [ramadan2023, ramadan2024, ramadan2025, ramadan2026];

export function getAllRamadanData(): RamadanData[] {
  return rawData.map((data) => ramadanSchema.parse(data));
}

export function getRamadanByYear(year: number): RamadanData | null {
  const data = rawData.find((d) => d.year === String(year));
  if (!data) return null;
  return ramadanSchema.parse(data);
}
