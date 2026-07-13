import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export const NumberBox = ({
  value,
  label,
  enterDelay = 0,
}: {
  value: number;
  label: string;
  /** Entrance stagger; applies to the first mount only, never to ticks. */
  enterDelay?: number;
}) => {
  const displayValue = value.toString().padStart(2, "0");
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm md:text-base font-medium text-emerald-100/70 uppercase tracking-widest mb-2">
        {label}
      </p>
      <div className="relative h-16 md:h-20 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={displayValue}
            // Full transform strings hand the animation to the compositor;
            // the y shorthand would tween on the main thread every second
            initial={{ transform: "translateY(20px)", opacity: 0 }}
            animate={{ transform: "translateY(0px)", opacity: 1 }}
            exit={{ transform: "translateY(-20px)", opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.23, 1, 0.32, 1],
              delay: isFirstRender.current ? enterDelay : 0,
            }}
            className="text-5xl md:text-7xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg"
          >
            {displayValue}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
