import { ramadanData } from "@/data/ramadan";
import { REPOSITORY_URL, jsonHeaders } from "@/utils/api";
import { getRamadanState } from "@/utils/ramadan-state";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/countdown")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const parsed = z.coerce
          .number()
          .safeParse(searchParams.get("timezoneOffset") || 7);

        if (!parsed.success) {
          return Response.json(
            { error: "timezoneOffset must be a number" },
            { status: 400, headers: jsonHeaders },
          );
        }

        const timezoneOffset = parsed.data;

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
          repository: REPOSITORY_URL,
        };

        switch (state.type) {
          case "countdown":
            return Response.json(
              {
                ...baseResponse,
                countdown: state.countdown,
                targetDate: state.targetRamadan.ramadanStart.toISOString(),
                year: state.targetRamadan.year,
              },
              { headers: jsonHeaders },
            );

          case "ramadan":
          case "lailatul_qadr":
            return Response.json(
              {
                ...baseResponse,
                day: state.day,
                totalDays: state.totalDays,
                year: state.currentRamadan.year,
                ramadanStart: state.currentRamadan.ramadanStart.toISOString(),
                ramadanEnd: state.currentRamadan.ramadanEnd.toISOString(),
                eidAlFitr: state.currentRamadan.eidAlFitr.toISOString(),
              },
              { headers: jsonHeaders },
            );

          case "eid":
            return Response.json(
              {
                ...baseResponse,
                year: state.currentRamadan.year,
                eidAlFitr: state.currentRamadan.eidAlFitr.toISOString(),
              },
              { headers: jsonHeaders },
            );

          default:
            return Response.json(
              { error: "Unknown state" },
              { status: 500, headers: jsonHeaders },
            );
        }
      },
    },
  },
});
