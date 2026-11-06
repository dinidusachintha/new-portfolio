import { forwardRef } from "react";
import type { LeisureCardData } from "./types";

interface LeisureImageCardProps {
  card: LeisureCardData;
  className?: string;
  style?: React.CSSProperties;
  depthZ?: number;
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
      style,
      depthZ = 0,
      isHovered = false,
      isDimmed = false,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    // When hovered, lift the card forward in 3D space
    const z = isHovered ? depthZ + 35 : depthZ;
    const scale = isHovered ? 1.03 : 1;

    return (
      <div
        ref={ref}
        data-card-id={card.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`leisure-image-card group select-none overflow-hidden rounded-2xl sm:rounded-3xl border border-black/[0.09] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer will-change-transform transition-[filter,opacity,border-color,box-shadow,transform] duration-350 ease-out ${
          isDimmed ? "opacity-55 filter brightness-95" : "opacity-100"
        } ${
          isHovered
            ? "!z-50 border-black/30 shadow-[0_32px_75px_rgba(0,0,0,0.25),0_0_25px_rgba(124,58,237,0.14)]"
            : ""
        } ${className}`}
        style={{
          ...style,
          transform: `translateZ(${z}px) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative w-full h-full overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
          <img
            src={card.image}
            alt={card.alt}
            className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out ${
              card.isPortrait ? "object-top" : ""
            } group-hover:scale-105`}
            loading={card.isPortrait ? "eager" : "lazy"}
          />

          {/* Subtle Bottom Vignette for Pill Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

          {/* Minimal Floating Pill Tag on Hover */}
          <div
            className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between gap-2 pointer-events-none transition-all duration-300"
            style={{ transform: "translateZ(15px)" }}
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-white/20 shadow-md text-[9px] sm:text-[11px] font-mono font-bold text-white tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                style={{
                  backgroundColor: card.accentColor,
                  color: card.accentColor,
                }}
              />
              <span>{card.label}</span>
            </div>

            <span className="font-mono text-[9px] text-gray-200 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:inline-block bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
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
