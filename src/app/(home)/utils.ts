import { type RamadanData, ramadanData } from "@/data/ramadan";

export const getHistory = (): RamadanData[] => {
  return ramadanData;
};

export const getFutureRamadans = (): RamadanData[] => {
  const now = new Date();
  // Return Ramadans that haven't ended yet (includes current Ramadan if ongoing)
  return ramadanData.filter((r) => r.ramadanEnd > now);
};

export const getNextRamadan = (): RamadanData => {
  const now = new Date();
  const next = ramadanData.find((r) => r.ramadanStart > now);
  if (!next) {
    throw new Error("No upcoming Ramadan data available");
  }
  return next;
};
