import Skeleton from "./Skeleton";

export default function ImageSkeleton({
  aspectRatio = "16/9",
  className = "",
}: {
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 ${className}`}
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      <Skeleton width="100%" height="100%" className="rounded-2xl" />
    </div>
  );
}
