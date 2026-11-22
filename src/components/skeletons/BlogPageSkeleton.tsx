import Skeleton from "./Skeleton";
import BlogCardSkeleton from "./BlogCardSkeleton";

export default function BlogPageSkeleton() {
  return (
    <div
      className="container py-24 sm:py-32 space-y-12"
      role="status"
      aria-label="Loading engineering blog..."
    >
      {/* Header Skeleton */}
      <div className="space-y-4 max-w-2xl">
        <Skeleton width={120} height={24} className="rounded-full" />
        <Skeleton width="80%" height={48} className="rounded-xl" />
        <Skeleton width="60%" height={20} className="rounded" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[100, 140, 120, 130].map((w, i) => (
          <Skeleton key={i} width={w} height={38} className="rounded-full shrink-0" />
        ))}
      </div>

      {/* Grid of Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
      <span className="sr-only">Loading engineering blog...</span>
    </div>
  );
}
