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
    const z = isHovered ? depthZ + 30 : depthZ;
    const scale = isHovered ? 1.03 : 1;

    return (
      <div
        ref={ref}
        data-card-id={card.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`leisure-image-card group select-none overflow-hidden rounded-2xl sm:rounded-3xl border border-white/14 bg-[#090a0f] shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-pointer will-change-transform transition-[filter,opacity,border-color,box-shadow,transform] duration-350 ease-out ${
          isDimmed ? "opacity-45 filter brightness-75" : "opacity-100"
        } ${
          isHovered
            ? "!z-50 border-white/40 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(152,103,255,0.3)]"
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

          {/* Subtle Contrast Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

          {/* Minimal Floating Pill Tag on Hover */}
          <div
            className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between gap-2 pointer-events-none transition-all duration-300"
            style={{ transform: "translateZ(15px)" }}
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 shadow-md text-[9px] sm:text-[11px] font-mono font-bold text-white tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                style={{
                  backgroundColor: card.accentColor,
                  color: card.accentColor,
                }}
              />
              <span>{card.label}</span>
            </div>

            <span className="font-mono text-[9px] text-gray-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:inline-block bg-black/70 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
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
