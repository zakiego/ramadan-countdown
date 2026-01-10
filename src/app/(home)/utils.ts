import { getAllRamadanData } from "@/utils/ramadan-data";
import { sortBy } from "lodash";
import { cache } from "react";

export const getHistory = async () => {
  const data = getAllRamadanData();
  return sortBy(data, (ramadan) => ramadan.ramadanStart);
};

export const getNextRamadan = cache(async () => {
  const data = await getHistory();

  // find the next ramadan
  const now = new Date();
  const nextRamadan = data.find((ramadan) => ramadan.ramadanStart > now);

  if (!nextRamadan) {
    throw new Error("Could not find next ramadan");
  }

  return {
    ...nextRamadan,
    year: Number(nextRamadan.year),
  };
});
