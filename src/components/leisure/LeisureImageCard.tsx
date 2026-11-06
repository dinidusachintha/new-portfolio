import { forwardRef } from "react";
import type { LeisureCardData } from "./types";

interface LeisureImageCardProps {
  card: LeisureCardData;
  className?: string;
  isHovered?: boolean;
  isDimmed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const LeisureImageCard = forwardRef<HTMLDivElement, LeisureImageCardProps>(
  (
    {
      card,
      className = "",
      isHovered = false,
      isDimmed = false,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-card-id={card.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`leisure-image-card group select-none overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0a0a0f] shadow-[0_24px_60px_rgba(0,0,0,0.85)] cursor-pointer will-change-transform transition-[filter,opacity,border-color,box-shadow] duration-300 ${
          isDimmed ? "opacity-45 filter brightness-75 scale-[0.98]" : "opacity-100"
        } ${
          isHovered
            ? "!z-50 border-white/40 shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(152,103,255,0.35)] scale-[1.03]"
            : ""
        } ${className}`}
        style={{
          transformOrigin: "center center",
        }}
      >
        {/* Image Container with subtle scale on hover */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={card.image}
            alt={card.alt}
            className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out ${
              card.isPortrait ? "object-top" : ""
            } group-hover:scale-105`}
            loading={card.isPortrait ? "eager" : "lazy"}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

          {/* Subtle Accent Glow on Hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${card.accentColor}, transparent 70%)`,
            }}
          />

          {/* Interactive Floating Pill Label (Reveals / Brightens on Hover) */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 pointer-events-none transition-all duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-lg text-[10px] sm:text-xs font-mono font-bold text-white tracking-wider uppercase transition-transform duration-300 group-hover:translate-y-0 translate-y-0.5">
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{
                  backgroundColor: card.accentColor,
                  color: card.accentColor,
                }}
              />
              <span>{card.label}</span>
            </div>

            {/* Title Teaser */}
            <span className="font-mono text-[9px] sm:text-[10px] text-gray-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline-block bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              {card.title}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

LeisureImageCard.displayName = "LeisureImageCard";

export default LeisureImageCard;
