import { forwardRef } from "react";
import type { LeisureActivity } from "./types";

interface LeisureActivityPanelProps {
  activity: LeisureActivity;
  index: number;
  isActive?: boolean;
  className?: string;
}

export const LeisureActivityPanel = forwardRef<HTMLDivElement, LeisureActivityPanelProps>(
  ({ activity, index, isActive = false, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`leisure-activity-panel absolute inset-0 w-full h-full overflow-hidden will-change-transform ${
          isActive ? "is-active" : ""
        } ${className}`}
        data-index={index}
        data-id={activity.id}
        aria-current={isActive ? "true" : undefined}
      >
        {/* Layer 1: Scalable Parallax Image Layer */}
        <div className="leisure-panel-img-wrap absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={activity.image}
            alt={activity.alt}
            className="leisure-panel-img w-full h-full object-cover object-center will-change-transform scale-105"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>

        {/* Layer 2: Multi-stop Cinematic Gradients for Editorial Contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 60% 40%, transparent 20%, rgba(5,6,10,0.4) 65%, rgba(4,5,8,0.92) 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-black/45 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Layer 3: Oversized Editorial Watermark Index (Campione style) */}
        <div
          className="leisure-watermark-number absolute bottom-4 right-6 sm:bottom-10 sm:right-12 font-unbounded font-black text-[22vw] sm:text-[18vw] leading-none text-white/[0.04] pointer-events-none select-none tracking-tighter"
          aria-hidden="true"
        >
          {activity.number}
        </div>

        {/* Layer 4: Foreground Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end p-6 sm:p-12 md:p-16 lg:p-20 max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            {/* Category Pill with Colored Accent Dot */}
            <div className="leisure-panel-category-pill inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-widest uppercase">
              <span
                className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{
                  backgroundColor: activity.accentColor,
                  color: activity.accentColor,
                }}
              />
              <span className="text-white/90">
                {activity.number} — {activity.category}
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-gray-400 text-[11px] hidden sm:inline">
                {activity.badge}
              </span>
            </div>

            {/* Masked Title Block */}
            <div className="leisure-panel-title-mask overflow-hidden py-1">
              <h3 className="leisure-panel-title font-unbounded font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.04] uppercase">
                {activity.title}
              </h3>
            </div>

            {/* Description Text */}
            <div className="leisure-panel-desc-wrap max-w-xl">
              <p className="leisure-panel-desc font-sans text-base sm:text-lg md:text-xl text-gray-200 font-light leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Sub-Metadata Footer Pill */}
            <div className="leisure-panel-meta pt-2 flex items-center gap-3 font-mono text-[11px] text-gray-400">
              <span className="w-6 h-[1px] bg-white/20" />
              <span className="tracking-widest uppercase text-gray-400">
                {activity.meta}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LeisureActivityPanel.displayName = "LeisureActivityPanel";

export default LeisureActivityPanel;
