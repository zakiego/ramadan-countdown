import { getHistory, getNextRamadan } from "@/app/(home)/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const timezoneOffset = z.coerce
    .number()
    .parse(searchParams.get("timezoneOffset") || 7);

  const history = await getHistory();

  // is today ramadan check from history
  const now = new Date();
  const nowWithTimezoneOffset = new Date(
    now.getTime() + timezoneOffset * 60 * 60 * 1000,
  );

  const ramadanThisYear = history.find((ramadan) => {
    return (
      ramadan.ramadanStart.getFullYear() === nowWithTimezoneOffset.getFullYear()
    );
  });

  if (!ramadanThisYear) {
    throw new Error("Could not find current ramadan");
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
        (1000 * 60 * 60 * 24),
    ) + 1;

  return NextResponse.json({
    isTodayRamadan,
    daysElapsedSinceStart,
    repository: "https://github.com/zakiego/ramadan-countdown",
  });
}
