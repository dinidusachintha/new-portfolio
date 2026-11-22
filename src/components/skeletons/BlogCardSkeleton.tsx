import Skeleton from "./Skeleton";

export default function BlogCardSkeleton() {
  return (
    <div
      className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <Skeleton width={90} height={22} className="rounded-full" />
        <Skeleton width={70} height={14} className="rounded" />
      </div>

      <div className="space-y-2">
        <Skeleton width="85%" height={24} className="rounded-md" />
        <Skeleton width="60%" height={24} className="rounded-md" />
      </div>

      <div className="space-y-1.5 pt-1">
        <Skeleton width="100%" height={14} className="rounded" />
        <Skeleton width="90%" height={14} className="rounded" />
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-white/5">
        <Skeleton width={100} height={16} className="rounded" />
        <Skeleton width={24} height={24} className="rounded-full" />
      </div>
    </div>
  );
}
