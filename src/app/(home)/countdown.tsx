"use client";

import { createCountdown, type CreateCountdown } from "@/utils/countdown";
import { useCallback, useEffect, useState } from "react";

interface Props {
  nextRamadan: Date;
}

export default function Countdown(props: Props) {
  const [countdown, setCountdown] = useState<
    CreateCountdown["countdown"] | null
  >(null);

  const updateCountdown = useCallback(() => {
    const timezoneOffset = -(new Date().getTimezoneOffset() / 60);
    const result = createCountdown({
      nextRamadan: props.nextRamadan,
      timezoneOffset,
    });
    setCountdown(result.countdown);
  }, [props.nextRamadan]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  if (!countdown) {
    return (
      <div className="w-full bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/10 shadow-2xl rounded-3xl p-8 md:p-12 ring-1 ring-emerald-500/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center">
          {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
            <div key={label} className="flex flex-col items-center space-y-4">
              <p className="text-sm md:text-base font-medium text-emerald-100/60 uppercase tracking-widest">
                {label}
              </p>
              <div className="w-full h-16 md:h-20 bg-emerald-500/10 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <div className="w-64 h-8 bg-emerald-500/10 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/10 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-emerald-500/10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center relative z-10">
        {[
          { label: "Days", value: countdown.days },
          { label: "Hours", value: countdown.hours },
          { label: "Minutes", value: countdown.minutes },
          { label: "Seconds", value: countdown.seconds },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <p className="text-sm md:text-base font-medium text-emerald-100/70 uppercase tracking-widest mb-2">
              {item.label}
            </p>
            <p className="text-5xl md:text-7xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg">
              {item.value.toString().padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center relative z-10">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-900/20 border border-emerald-500/10 backdrop-blur-md">
          <p className="text-base md:text-lg text-emerald-50">
            Ramadan will, inshaAllah, be coming on{" "}
            <span className="font-semibold text-amber-100">
              {props.nextRamadan.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="ml-2">🌙✨</span>
          </p>
        </div>
      </div>
    </div>
  );
}
