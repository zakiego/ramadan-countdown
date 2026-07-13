export function CountdownSkeleton() {
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
      <div className="flex justify-center mt-12">
        <div className="w-72 h-[50px] md:h-[54px] bg-emerald-500/10 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
