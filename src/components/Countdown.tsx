import { NumberBox } from "@/components/NumberBox";
import { useDevDate } from "@/context/DevDateContext";
import type { RamadanData } from "@/data/ramadan";
import {
  type RamadanDisplayState,
  getRamadanState,
} from "@/utils/ramadan-state";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface Props {
  ramadans: RamadanData[];
}

// Countdown display component
function CountdownDisplay({
  state,
  targetDate,
}: {
  state: Extract<RamadanDisplayState, { type: "countdown" }>;
  targetDate: Date;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/10 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-emerald-500/10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center relative z-10">
        <NumberBox value={state.countdown.days} label="Days" />
        <NumberBox value={state.countdown.hours} label="Hours" />
        <NumberBox value={state.countdown.minutes} label="Minutes" />
        <NumberBox value={state.countdown.seconds} label="Seconds" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 text-center relative z-10"
      >
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-900/20 border border-emerald-500/10 backdrop-blur-md">
          <p className="text-base md:text-lg text-emerald-50">
            Ramadan {state.hijriYear} will, inshaAllah, be coming on{" "}
            <span className="font-semibold text-amber-100">
              {targetDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                // Dates are stored as UTC midnight; format in UTC so users in
                // negative-offset timezones don't see the previous calendar day
                timeZone: "UTC",
              })}
            </span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// During Ramadan display component
function RamadanDisplay({
  state,
}: {
  state: Extract<RamadanDisplayState, { type: "ramadan" }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/10 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-emerald-500/10"
    >
      <div className="text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl text-emerald-100/70 uppercase tracking-widest mb-4"
        >
          Ramadan {state.hijriYear}
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-baseline justify-center gap-4"
        >
          <span className="text-7xl md:text-9xl font-bold text-white drop-shadow-lg">
            {state.day}
          </span>
          <span className="text-2xl md:text-3xl text-emerald-100/70">
            / {state.totalDays}
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl md:text-2xl text-emerald-50"
        >
          Day of Ramadan
        </motion.p>
      </div>
    </motion.div>
  );
}

// Lailatul Qadr display component
function LailatulQadrDisplay({
  state,
}: {
  state: Extract<RamadanDisplayState, { type: "lailatul_qadr" }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-amber-900/20 via-emerald-900/10 to-amber-900/20 backdrop-blur-xl border border-amber-500/20 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-amber-500/20"
    >
      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-8 text-2xl opacity-30">*</div>
        <div className="absolute top-12 right-16 text-xl opacity-20">*</div>
        <div className="absolute bottom-8 left-1/4 text-lg opacity-25">*</div>
        <div className="absolute top-1/3 right-8 text-2xl opacity-20">*</div>
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6"
        >
          <span className="text-amber-200 text-sm md:text-base font-medium tracking-wide">
            Lailatul Qadr Period
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl text-emerald-100/70 uppercase tracking-widest mb-4"
        >
          Ramadan {state.hijriYear}
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-baseline justify-center gap-4"
        >
          <span className="text-7xl md:text-9xl font-bold text-amber-100 drop-shadow-lg">
            {state.day}
          </span>
          <span className="text-2xl md:text-3xl text-emerald-100/70">
            / {state.totalDays}
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl md:text-2xl text-emerald-50"
        >
          Day of Ramadan
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-base text-amber-200/80 italic"
        >
          &quot;The Night of Decree is better than a thousand months&quot;
        </motion.p>
      </div>
    </motion.div>
  );
}

// Eid display component
function EidDisplay({
  state,
}: {
  state: Extract<RamadanDisplayState, { type: "eid" }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-amber-500/20 backdrop-blur-xl border border-amber-400/30 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-amber-400/30"
    >
      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="text-6xl md:text-8xl mb-6"
        >
          <span role="img" aria-label="Crescent moon">
            &#127769;
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-amber-100 drop-shadow-lg mb-4"
        >
          Eid Mubarak!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-emerald-50"
        >
          1 Syawal {state.hijriYear}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-base md:text-lg text-amber-200/80"
        >
          Taqabbalallahu minna wa minkum
        </motion.p>
      </div>
    </motion.div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
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

export default function Countdown(props: Props) {
  const { getCurrentDate, simulatedDate } = useDevDate();
  const [state, setState] = useState<RamadanDisplayState | null>(null);

  const updateState = useCallback(() => {
    const now = getCurrentDate();
    const newState = getRamadanState(props.ramadans, now);
    setState(newState);
  }, [props.ramadans, getCurrentDate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: simulatedDate is used to trigger re-render when dev date changes
  useEffect(() => {
    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [updateState, simulatedDate]);

  if (!state) {
    return <LoadingSkeleton />;
  }

  switch (state.type) {
    case "countdown":
      return (
        <CountdownDisplay
          state={state}
          targetDate={state.targetRamadan.ramadanStart}
        />
      );
    case "ramadan":
      return <RamadanDisplay state={state} />;
    case "lailatul_qadr":
      return <LailatulQadrDisplay state={state} />;
    case "eid":
      return <EidDisplay state={state} />;
    default:
      return <LoadingSkeleton />;
  }
}
