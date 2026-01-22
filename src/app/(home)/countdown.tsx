"use client";

import { createCountdown, type CreateCountdown } from "@/utils/countdown";
import { useDevDate } from "@/context/DevDateContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RamadanClientData {
  year: number;
  ramadanStart: string;
  ramadanEnd: string;
  eidAlFitr: string;
}

interface Props {
  ramadans: RamadanClientData[];
}

const NumberBox = ({ value, label }: { value: number; label: string }) => {
  const displayValue = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm md:text-base font-medium text-emerald-100/70 uppercase tracking-widest mb-2">
        {label}
      </p>
      <div className="relative h-16 md:h-20 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={displayValue}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-5xl md:text-7xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg"
          >
            {displayValue}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function Countdown(props: Props) {
  const { getCurrentDate, simulatedDate } = useDevDate();
  const [countdown, setCountdown] = useState<
    CreateCountdown["countdown"] | null
  >(null);

  // Determine the next Ramadan on the client side based on current date
  // Note: simulatedDate triggers re-render, getCurrentDate returns the correct date
  const nextRamadan = useMemo(() => {
    const now = getCurrentDate();
    const ramadan = props.ramadans.find(
      (r) => new Date(r.ramadanStart) > now
    );
    // If no future Ramadan found, use the last one in the list
    return ramadan ?? props.ramadans[props.ramadans.length - 1];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.ramadans, simulatedDate]);

  const nextRamadanDate = useMemo(
    () => new Date(nextRamadan.ramadanStart),
    [nextRamadan]
  );

  const updateCountdown = useCallback(() => {
    const now = getCurrentDate();
    const timezoneOffset = -(now.getTimezoneOffset() / 60);
    const result = createCountdown({
      nextRamadan: nextRamadanDate,
      timezoneOffset,
      currentDate: now,
    });
    setCountdown(result.countdown);
  }, [nextRamadanDate, getCurrentDate]);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/10 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-emerald-500/10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center relative z-10">
        <NumberBox value={countdown.days} label="Days" />
        <NumberBox value={countdown.hours} label="Hours" />
        <NumberBox value={countdown.minutes} label="Minutes" />
        <NumberBox value={countdown.seconds} label="Seconds" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 text-center relative z-10"
      >
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-900/20 border border-emerald-500/10 backdrop-blur-md">
          <p className="text-base md:text-lg text-emerald-50">
            Ramadan will, inshaAllah, be coming on{" "}
            <span className="font-semibold text-amber-100">
              {nextRamadanDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="ml-2">🌙✨</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
