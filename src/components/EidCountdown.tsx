import { CountdownSkeleton } from "@/components/CountdownSkeleton";
import { NumberBox } from "@/components/NumberBox";
import { useDevDate } from "@/context/DevDateContext";
import type { RamadanData } from "@/data/ramadan";
import { useI18n } from "@/i18n/context";
import { type EidDisplayState, getEidState } from "@/utils/eid-state";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface Props {
  ramadans: RamadanData[];
}

function EidCountdownDisplay({
  state,
}: {
  state: Extract<EidDisplayState, { type: "countdown" }>;
}) {
  const { ui, fmt } = useI18n();
  const celebrated = ui.eidCelebratedOn(state.hijriYear);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/10 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-emerald-500/10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center relative z-10">
        <NumberBox
          value={state.countdown.days}
          label={ui.days}
          enterDelay={0}
        />
        <NumberBox
          value={state.countdown.hours}
          label={ui.hours}
          enterDelay={0.05}
        />
        <NumberBox
          value={state.countdown.minutes}
          label={ui.minutes}
          enterDelay={0.1}
        />
        <NumberBox
          value={state.countdown.seconds}
          label={ui.seconds}
          enterDelay={0.15}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
        className="mt-12 text-center relative z-10"
      >
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-900/20 border border-emerald-500/10 backdrop-blur-md">
          <p className="text-base md:text-lg text-emerald-50">
            {celebrated.before}
            <span className="font-semibold text-amber-100">
              {fmt.short(state.target.eidAlFitr)}
            </span>
            {celebrated.after}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EidCelebrationDisplay({
  state,
}: {
  state: Extract<EidDisplayState, { type: "celebration" }>;
}) {
  const { ui } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-amber-500/20 backdrop-blur-xl border border-amber-400/30 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden ring-1 ring-amber-400/30"
    >
      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
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
          {ui.eidMubarak}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-emerald-50"
        >
          {ui.shawwal(state.hijriYear)}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-base md:text-lg text-amber-200/80"
        >
          {ui.taqabbal}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function EidCountdown(props: Props) {
  const { getCurrentDate, simulatedDate } = useDevDate();
  const [state, setState] = useState<EidDisplayState | null>(null);

  const updateState = useCallback(() => {
    const now = getCurrentDate();
    setState(getEidState(props.ramadans, now));
  }, [props.ramadans, getCurrentDate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: simulatedDate is used to trigger re-render when dev date changes
  useEffect(() => {
    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [updateState, simulatedDate]);

  if (!state) {
    return <CountdownSkeleton />;
  }

  switch (state.type) {
    case "countdown":
      return <EidCountdownDisplay state={state} />;
    case "celebration":
      return <EidCelebrationDisplay state={state} />;
    default:
      return <CountdownSkeleton />;
  }
}
