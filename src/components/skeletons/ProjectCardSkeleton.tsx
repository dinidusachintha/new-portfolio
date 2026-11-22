import Skeleton from "./Skeleton";

export default function ProjectCardSkeleton() {
  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#07090e]/95 p-5 sm:p-7 lg:p-8 backdrop-blur-xl shadow-2xl overflow-hidden w-full mb-8"
      aria-label="Loading project details..."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Metadata & Details */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top badges */}
          <div className="flex items-center gap-2">
            <Skeleton width={110} height={26} className="rounded-full" />
            <Skeleton width={90} height={26} className="rounded-full" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 pt-1">
            <Skeleton width="75%" height={36} className="rounded-lg" />
            <Skeleton width="45%" height={16} className="rounded" />
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <Skeleton width="100%" height={14} className="rounded" />
            <Skeleton width="92%" height={14} className="rounded" />
            <Skeleton width="60%" height={14} className="rounded" />
          </div>

          {/* 3 Metric cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5"
              >
                <Skeleton width="60%" height={18} className="rounded" />
                <Skeleton width="80%" height={10} className="rounded" />
              </div>
            ))}
          </div>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[65, 80, 70, 90, 60].map((w, idx) => (
              <Skeleton
                key={idx}
                width={w}
                height={24}
                className="rounded-full"
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <Skeleton width={120} height={40} className="rounded-xl" />
            <Skeleton width={140} height={40} className="rounded-xl" />
          </div>
        </div>

        {/* Right Column: Project Preview Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
            <Skeleton width="100%" height="100%" className="rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
