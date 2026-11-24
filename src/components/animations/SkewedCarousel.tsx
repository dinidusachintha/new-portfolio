import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Gamepad2, Headphones, Play, MapPin, Trophy, Camera } from "lucide-react";
import { leisureActivities, type LeisureActivity } from "../../data/leisureActivities";

export interface SkewedCarouselProps {
  activities?: LeisureActivity[];
  skewAngle?: number; // e.g. -4 degrees
  tiltFactor?: number; // e.g. 18 degrees
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function SkewedCarousel({
  activities = leisureActivities,
  skewAngle = -3.5,
  tiltFactor = 16,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
}: SkewedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const dragCurrentX = useRef<number>(0);
  const rafDragRef = useRef<number | null>(null);
  const count = activities.length;

  const updateDrag = (currentX: number) => {
    dragCurrentX.current = currentX;
    if (rafDragRef.current === null) {
      rafDragRef.current = requestAnimationFrame(() => {
        setDragOffset(dragCurrentX.current - dragStartX.current);
        rafDragRef.current = null;
      });
    }
  };

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
  };

  // Cleanup pending drag rAF on unmount
  useEffect(() => {
    return () => {
      if (rafDragRef.current !== null) {
        cancelAnimationFrame(rafDragRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const isFocused = containerRef.current.contains(document.activeElement);
      if (!isFocused) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || isDragging || hoveredCard !== null) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isDragging, hoveredCard, nextSlide]);

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragCurrentX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateDrag(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (rafDragRef.current !== null) {
      cancelAnimationFrame(rafDragRef.current);
      rafDragRef.current = null;
    }
    if (!isDragging) return;
    setIsDragging(false);
    const delta = dragCurrentX.current - dragStartX.current;
    setDragOffset(0);
    if (delta > 40) {
      prevSlide();
    } else if (delta < -40) {
      nextSlide();
    }
  };

  // Mouse Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateDrag(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (rafDragRef.current !== null) {
      cancelAnimationFrame(rafDragRef.current);
      rafDragRef.current = null;
    }
    if (!isDragging) return;
    setIsDragging(false);
    const delta = dragCurrentX.current - dragStartX.current;
    setDragOffset(0);
    if (delta > 50) {
      prevSlide();
    } else if (delta < -50) {
      nextSlide();
    }
  };

  // 3D Card Hover Tilt
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    if (idx !== activeIndex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 12, y: -y * 12 });
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
    setMouseTilt({ x: 0, y: 0 });
  };

  // Circular offset calculation
  const getCardOffset = (itemIndex: number) => {
    let diff = itemIndex - activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Gamepad":
        return <Gamepad2 size={16} />;
      case "Headphones":
        return <Headphones size={16} />;
      case "Play":
        return <Play size={16} />;
      case "MapPin":
        return <MapPin size={16} />;
      case "Trophy":
        return <Trophy size={16} />;
      case "Camera":
        return <Camera size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`skewed-carousel-wrapper relative w-full overflow-hidden select-none py-10 sm:py-16 touch-pan-y ${className}`}
      style={{ touchAction: "pan-y" }}
      tabIndex={0}
      role="region"
      aria-label="Skewed Carousel - Beyond The Code"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skewed Perspective Runway Stage */}
      <div
        className="skewed-carousel-stage relative flex items-center justify-center min-h-[460px] sm:min-h-[540px]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          transform: `rotateZ(${skewAngle}deg)`,
        }}
      >
        {activities.map((act, idx) => {
          const offset = getCardOffset(idx);
          const isCenter = offset === 0;

          // Responsive spacing parameters
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
          const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1200;

          const baseSpacing = isMobile ? 180 : isTablet ? 270 : 360;
          const translateX = offset * baseSpacing + (isDragging ? dragOffset * 0.7 : 0);

          // Dynamic tilt calculations as card slides:
          // Cards tilt around Y axis based on offset + drag momentum
          const dynamicTiltY = -offset * tiltFactor + (isDragging ? dragOffset * 0.05 : 0);
          // Cards tilt around Z axis slightly following the skew
          const dynamicTiltZ = offset * 2.2;
          // Vertical shift along the skew ramp
          const translateY = offset * 18;

          // Scale & Depth
          const scale = isCenter ? (isMobile ? 1.05 : 1.12) : Math.max(0.72, 0.94 - Math.abs(offset) * 0.12);
          const translateZ = isCenter ? 60 : -Math.abs(offset) * 80;
          const opacity = Math.abs(offset) > 2 ? 0 : Math.max(0.3, 1 - Math.abs(offset) * 0.28);
          const zIndex = 50 - Math.abs(offset) * 10;

          // Additional micro-tilt when center card is hovered
          const hoverRotateX = isCenter && hoveredCard === idx ? mouseTilt.y : 0;
          const hoverRotateY = isCenter && hoveredCard === idx ? mouseTilt.x : 0;

          const accentGlow = act.accentGlow || "rgba(152, 103, 255, 0.4)";

          return (
            <div
              key={act.id}
              className={`skewed-carousel-card-slot absolute transition-all ${
                isDragging ? "duration-75" : "duration-500 ease-out"
              }`}
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${
                  dynamicTiltY + hoverRotateY
                }deg) rotateX(${hoverRotateX}deg) rotateZ(${dynamicTiltZ}deg) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
                visibility: opacity === 0 ? "hidden" : "visible",
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseMove={(e) => handleCardMouseMove(e, idx)}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => {
                if (!isCenter) goToSlide(idx);
              }}
            >
              {/* The Skewed Card Itself */}
              <div
                className={`skewed-card relative w-[270px] sm:w-[320px] h-[380px] sm:h-[450px] rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 border ${
                  isCenter
                    ? "border-violet-500/50 shadow-2xl shadow-violet-500/25 ring-1 ring-violet-400/30"
                    : "border-white/10 hover:border-white/20 shadow-xl shadow-black/60"
                }`}
                style={{
                  background: "linear-gradient(145deg, #120e1c 0%, #0a0812 100%)",
                }}
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 overflow-hidden">
                  <picture>
                    <source srcSet={act.imageWebp} type="image/webp" />
                    <img
                      src={act.imageJpg}
                      alt={act.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </picture>

                  {/* Cinematic Obsidian Glass Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0812] via-[#0a0812]/50 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 20%, ${accentGlow}, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Card Top: Number & Category Badge */}
                <div className="relative z-10 p-5 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-violet-300 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
                    {act.number}
                  </span>

                  <span className="font-mono text-[11px] text-gray-300 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-md flex items-center gap-1.5">
                    {renderIcon(act.iconName)}
                    <span>{act.badge}</span>
                  </span>
                </div>

                {/* Card Bottom: Title & Description */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-5 pt-8 bg-gradient-to-t from-[#0a0812] via-[#0a0812]/90 to-transparent">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-violet-400 mb-1">
                    {act.category}
                  </div>
                  <h3 className="font-unbounded font-bold text-lg sm:text-xl text-white tracking-tight mb-2">
                    {act.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Center Glow highlight */}
                {isCenter && (
                  <div
                    className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/20 rounded-2xl"
                    style={{
                      boxShadow: `inset 0 0 30px ${accentGlow}`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls: Arrows & Pagination */}
      <div className="relative z-30 flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
          {activities.map((act, idx) => (
            <button
              key={act.id}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? "w-6 bg-violet-400 shadow-sm shadow-violet-400/50"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
