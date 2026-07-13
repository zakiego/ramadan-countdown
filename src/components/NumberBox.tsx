import { AnimatePresence, motion } from "framer-motion";

export const NumberBox = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
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
