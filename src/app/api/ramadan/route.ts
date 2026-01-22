import { ramadanData } from "@/data/ramadan";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const timezoneOffset = z.coerce
    .number()
    .parse(searchParams.get("timezoneOffset") || 7);

  // is today ramadan check from history
  const now = new Date();
  const nowWithTimezoneOffset = new Date(
    now.getTime() + timezoneOffset * 60 * 60 * 1000
  );

  const ramadanThisYear = ramadanData.find((ramadan) => {
    return (
      ramadan.ramadanStart.getFullYear() === nowWithTimezoneOffset.getFullYear()
    );
  });

  if (!ramadanThisYear) {
    return NextResponse.json({
      error: "Could not find Ramadan data for this year",
      isTodayRamadan: false,
      repository: "https://github.com/zakiego/ramadan-countdown",
    });
  }

  // To get the last hour of the last day of Ramadan
  const ramadanEndWithLastHour = new Date(ramadanThisYear.ramadanEnd);
  ramadanEndWithLastHour.setHours(23, 59, 59, 999);

  const isTodayRamadan =
    ramadanThisYear &&
    nowWithTimezoneOffset >= ramadanThisYear.ramadanStart &&
    nowWithTimezoneOffset <= ramadanEndWithLastHour;

  if (!isTodayRamadan) {
    return NextResponse.json({
      isTodayRamadan,
      repository: "https://github.com/zakiego/ramadan-countdown",
    });
  }

  const daysElapsedSinceStart =
    Math.floor(
      (nowWithTimezoneOffset.getTime() -
        ramadanThisYear.ramadanStart.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return NextResponse.json({
    isTodayRamadan,
    daysElapsedSinceStart,
    repository: "https://github.com/zakiego/ramadan-countdown",
  });
}
