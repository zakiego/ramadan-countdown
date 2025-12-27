"use client";

import { createCountdown, type CreateCountdown } from "@/utils/countdown";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

interface Props {
  nextRamadan: Date;
}

export default function Countdown(props: Props) {
  const [countdown, setCountdown] = useState<
    CreateCountdown["countdown"] | null
  >(null);

  const updateCountdown = () => {
    const countdown = createCountdown({
      nextRamadan: props.nextRamadan,
      timezoneOffset: 8,
    });
    setCountdown(countdown.countdown);
  };

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000); // Updates countdown every 1 second

    return () => clearInterval(interval);
  }, [props.nextRamadan]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!countdown) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-gray-800">{label}</p>
              <div className="flex justify-center mt-1">
                <div className="w-20 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="w-80 h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-semibold text-gray-800 ">Days</p>
          <p className="text-6xl font-bold text-gray-800 tabular-nums">
            {countdown?.days.toString().padStart(2, "0")}
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800 ">Hours</p>
          <p className="text-6xl font-bold text-gray-800 tabular-nums">
            {countdown?.hours.toString().padStart(2, "0")}
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800 ">Minutes</p>
          <p className="text-6xl font-bold text-gray-800 tabular-nums">
            {countdown?.minutes.toString().padStart(2, "0")}
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800 ">Seconds</p>
          <p className="text-6xl font-bold text-gray-800 tabular-nums">
            {countdown?.seconds.toString().padStart(2, "0")}
          </p>
        </div>
      </div>
      <p className="text-center text-lg text-gray-700 mt-6">
        Ramadan will, inshaAllah, be coming on{" "}
        {props.nextRamadan.toLocaleDateString("en-US", {
          // weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        🌙✨
      </p>
    </div>
  );
}
