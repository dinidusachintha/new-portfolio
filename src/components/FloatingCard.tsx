import React, { useRef, useState, useCallback } from "react";
import {
  Gamepad2,
  Headphones,
  Play,
  MapPin,
  Trophy,
  Camera,
  ArrowUpRight,
} from "lucide-react";
import { asset } from "../data/portfolio";
import type { LeisureActivity } from "../data/leisureActivities";

interface FloatingCardProps {
  activity: LeisureActivity;
  isCenter: boolean;
  offset: number; // 0 for center, -1/+1 for immediate sides, etc.
  onSelect: () => void;
  floatDelay?: number;
}

export default function FloatingCard({
  activity,
  isCenter,
  offset: _offset,
  onSelect,
  floatDelay = 0,
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic mouse-tracking 3D tilt (only when hovered on desktop)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || window.innerWidth < 768) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt max ±7 degrees
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      setTilt({ rotateX, rotateY });
    },
    []
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const renderIcon = () => {
    const iconProps = {
      size: 18,
      className: "text-[#c084fc] group-hover:text-[#00E5FF] transition-all duration-300 group-hover:scale-110",
    };
    switch (activity.iconName) {
      case "Gamepad":
        return <Gamepad2 {...iconProps} />;
      case "Headphones":
        return <Headphones {...iconProps} />;
      case "Play":
        return <Play {...iconProps} fill="currentColor" />;
      case "MapPin":
        return <MapPin {...iconProps} />;
      case "Trophy":
        return <Trophy {...iconProps} />;
      case "Camera":
        return <Camera {...iconProps} />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`leisure-floating-card-wrap ${isCenter ? "is-center" : "is-side"}`}
      style={{
        animationDelay: `${floatDelay}s`,
      }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${activity.title}: ${activity.description}`}
      aria-current={isCenter ? "true" : undefined}
    >
      <div
        className={`leisure-floating-card group ${isCenter ? "is-active-card" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-8px) scale(1.03)`
            : undefined,
        }}
      >
        {/* Soft cyan floor shadow beneath the card */}
        <div className="leisure-card-shadow" aria-hidden="true" />

        {/* Ambient Top Glow Accent */}
        <div className="leisure-card-top-glow" aria-hidden="true" />

        {/* Cinematic Background Image Container */}
        <div className="leisure-card-media-wrap">
          <picture>
            <source srcSet={asset(activity.imageWebp)} type="image/webp" />
            <img
              src={asset(activity.imageJpg)}
              alt={activity.alt}
              loading="lazy"
              decoding="async"
              className="leisure-card-media"
            />
          </picture>
          {/* Multi-layered cinematic gradient overlay */}
          <div className="leisure-card-gradient-overlay" />
        </div>

        {/* Top Badges Bar */}
        <div className="leisure-card-top-bar">
          <span className="leisure-card-index font-mono">
            {activity.number}
          </span>
          <span className="leisure-card-pill">
            <span className="leisure-card-dot" />
            {activity.badge}
          </span>
        </div>

        {/* Glassmorphism Content Panel with activity icon, title, description, and action button */}
        <div className="leisure-card-glass-panel">
          <div className="leisure-card-content-header">
            <div className="leisure-card-icon-pedestal">
              {renderIcon()}
            </div>
            <div className="leisure-card-headings">
              <span className="leisure-card-category font-mono">
                {activity.category}
              </span>
              <h3 className="leisure-card-title">
                {activity.title}
              </h3>
            </div>
          </div>

          <p className="leisure-card-desc">
            {activity.description}
          </p>

          <div className="leisure-card-footer">
            <span className="leisure-card-action-text font-mono">
              EXPLORE
            </span>
            <div className="leisure-card-arrow-btn">
              <ArrowUpRight size={15} className="leisure-card-arrow-icon" />
            </div>
          </div>
        </div>

        {/* Subtle cyan border beam highlight */}
        <div className="leisure-card-border-glow" aria-hidden="true" />
      </div>
    </div>
  );
}
