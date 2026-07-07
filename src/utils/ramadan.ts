import { type RamadanData, ramadanData } from "@/data/ramadan";

export const getFutureRamadans = (): RamadanData[] => {
  const now = new Date();
  // Return Ramadans that haven't ended yet (includes current Ramadan if ongoing)
  return ramadanData.filter((r) => r.ramadanEnd > now);
};
