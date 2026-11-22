import Skeleton from "./Skeleton";

export default function VideoSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 ${className}`}
      aria-hidden="true"
    >
      <Skeleton width="100%" height="100%" className="rounded-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white/60 ml-1" />
        </div>
      </div>
    </div>
  );
}
