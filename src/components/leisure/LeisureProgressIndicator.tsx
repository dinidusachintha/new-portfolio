import type { LeisureActivity } from "./types";

interface LeisureProgressIndicatorProps {
  currentIndex: number;
  progress: number;
  total: number;
  activities: LeisureActivity[];
  onSelectIndex?: (idx: number) => void;
  className?: string;
}

export default function LeisureProgressIndicator({
  currentIndex,
  progress,
  total,
  activities,
  onSelectIndex,
  className = "",
}: LeisureProgressIndicatorProps) {
  const currentActivity = activities[currentIndex] || activities[0];

  return (
    <div
      className={`leisure-progress-widget pointer-events-auto flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2.5 rounded-full bg-[#08080c]/80 backdrop-blur-xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.6)] ${className}`}
      aria-label={`Leisure section progress: chapter ${currentIndex + 1} of ${total}`}
    >
      {/* Step Numbers: e.g. "01 / 05" */}
      <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
        <span
          className="text-white transition-colors duration-300"
          style={{ color: currentActivity.accentColor || "#9867ff" }}
        >
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-white/40">/</span>
        <span className="text-white/60">{String(total).padStart(2, "0")}</span>
      </div>

      {/* Segmented Timeline Dots / Ticks */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {activities.map((act, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectIndex?.(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-6 sm:w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  : isPassed
                  ? "w-2 sm:w-2.5 bg-white/40"
                  : "w-1.5 sm:w-2 bg-white/15 hover:bg-white/30"
              }`}
              style={{
                backgroundColor: isActive ? act.accentColor : undefined,
              }}
              title={`${act.number} — ${act.category}`}
              aria-label={`Go to ${act.category}`}
            />
          );
        })}
      </div>

      {/* Current Category Pill */}
      <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/15">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: currentActivity.accentColor }}
        />
        <span className="font-mono text-[11px] font-bold tracking-wider text-gray-300 uppercase">
          {currentActivity.category}
        </span>
      </div>

      {/* Continuous Micro Progress Track */}
      <div className="absolute -bottom-[1px] left-4 right-4 h-[2px] bg-white/10 rounded-full overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(0, Math.round(progress * 100)))}%` }}
        />
      </div>
    </div>
  );
}
