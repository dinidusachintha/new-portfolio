import ProjectCardSkeleton from "./ProjectCardSkeleton";

export default function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="space-y-8 w-full py-6"
      role="status"
      aria-live="polite"
      aria-label="Loading featured engineering projects"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProjectCardSkeleton key={idx} />
      ))}
      <span className="sr-only">Loading engineering projects...</span>
    </div>
  );
}
