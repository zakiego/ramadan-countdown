import { ramadanData } from "@/data/ramadan";
import { getRamadanState } from "@/utils/ramadan-state";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const timezoneOffset = z.coerce
    .number()
    .parse(searchParams.get("timezoneOffset") || 7);

  // Apply timezone offset to current time
  const now = new Date();
  const nowWithTimezoneOffset = new Date(
    now.getTime() + timezoneOffset * 60 * 60 * 1000,
  );

  const state = getRamadanState(ramadanData, nowWithTimezoneOffset);

  // Format response based on state type
  const baseResponse = {
    status: state.type,
    hijriYear: state.hijriYear,
    timezoneOffset,
    repository: "https://github.com/zakiego/ramadan-countdown",
  };

  switch (state.type) {
    case "countdown":
      return NextResponse.json({
        ...baseResponse,
        countdown: state.countdown,
        targetDate: state.targetRamadan.ramadanStart.toISOString(),
        year: state.targetRamadan.year,
      });

    case "ramadan":
    case "lailatul_qadr":
      return NextResponse.json({
        ...baseResponse,
        day: state.day,
        totalDays: state.totalDays,
        year: state.currentRamadan.year,
        ramadanStart: state.currentRamadan.ramadanStart.toISOString(),
        ramadanEnd: state.currentRamadan.ramadanEnd.toISOString(),
        eidAlFitr: state.currentRamadan.eidAlFitr.toISOString(),
      });

    case "eid":
      return NextResponse.json({
        ...baseResponse,
        year: state.currentRamadan.year,
        eidAlFitr: state.currentRamadan.eidAlFitr.toISOString(),
      });

    default:
      return NextResponse.json({ error: "Unknown state" }, { status: 500 });
  }
}
