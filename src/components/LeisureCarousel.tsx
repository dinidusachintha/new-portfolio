import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FloatingCard from "./FloatingCard";
import { leisureActivities } from "../data/leisureActivities";

export default function LeisureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const dragCurrentX = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const count = leisureActivities.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if carousel or section is in focus or hovered
      if (!carouselRef.current) return;
      const isFocused = carouselRef.current.contains(document.activeElement);
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

  // Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragCurrentX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    dragCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaX = dragCurrentX.current - dragStartX.current;
    if (deltaX > 45) {
      prevSlide();
    } else if (deltaX < -45) {
      nextSlide();
    }
  };

  // Mouse Drag Handling for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on non-interactive elements
    if ((e.target as HTMLElement).closest("button")) return;
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dragCurrentX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaX = dragCurrentX.current - dragStartX.current;
    if (deltaX > 55) {
      prevSlide();
    } else if (deltaX < -55) {
      nextSlide();
    }
  };

  // Calculate shortest circular offset from active index [-2, -1, 0, 1, 2]
  const getCardOffset = (itemIndex: number) => {
    let diff = itemIndex - activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  // 3D Transform calculations based on circular offset
  const get3DStyles = (offset: number) => {
    // Determine screen width factor for responsive 3D spacing
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1200;

    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;
    let pointerEvents: "auto" | "none" = "auto";

    if (offset === 0) {
      // Center Card (closest to viewer, largest)
      scale = isMobile ? 1.05 : 1.15;
      translateZ = isMobile ? 40 : 100;
      rotateY = 0;
      translateX = 0;
      zIndex = 30;
      opacity = 1;
    } else if (offset === -1) {
      // Immediate Left Card
      translateX = isMobile ? -160 : isTablet ? -250 : -340;
      translateZ = isMobile ? -30 : 0;
      rotateY = isMobile ? 8 : 15;
      scale = isMobile ? 0.88 : 0.95;
      zIndex = 20;
      opacity = isMobile ? 0.35 : 0.85;
    } else if (offset === 1) {
      // Immediate Right Card
      translateX = isMobile ? 160 : isTablet ? 250 : 340;
      translateZ = isMobile ? -30 : 0;
      rotateY = isMobile ? -8 : -15;
      scale = isMobile ? 0.88 : 0.95;
      zIndex = 20;
      opacity = isMobile ? 0.35 : 0.85;
    } else if (offset === -2) {
      // Outer Left Card
      translateX = isMobile ? -280 : isTablet ? -440 : -600;
      translateZ = isMobile ? -100 : -100;
      rotateY = isMobile ? 12 : 25;
      scale = isMobile ? 0.72 : 0.8;
      zIndex = 10;
      opacity = isMobile ? 0 : 0.55;
    } else if (offset === 2) {
      // Outer Right Card
      translateX = isMobile ? 280 : isTablet ? 440 : 600;
      translateZ = isMobile ? -100 : -100;
      rotateY = isMobile ? -12 : -25;
      scale = isMobile ? 0.72 : 0.8;
      zIndex = 10;
      opacity = isMobile ? 0 : 0.55;
    } else {
      // Farthest hidden cards
      translateX = offset < 0 ? -700 : 700;
      translateZ = -220;
      rotateY = offset < 0 ? 30 : -30;
      scale = 0.65;
      zIndex = 5;
      opacity = 0;
      pointerEvents = "none";
    }

    return {
      transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      opacity,
      pointerEvents,
      visibility: opacity === 0 ? ("hidden" as const) : ("visible" as const),
    };
  };

  return (
    <div
      ref={carouselRef}
      className="leisure-carousel-container"
      tabIndex={0}
      role="region"
      aria-label="Leisure Activities 3D Carousel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Perspective Stage */}
      <div className="leisure-carousel-stage">
        {leisureActivities.map((activity, idx) => {
          const offset = getCardOffset(idx);
          const isCenter = offset === 0;
          const style3D = get3DStyles(offset);

          return (
            <div
              key={activity.id}
              className={`leisure-carousel-card-slot ${isCenter ? "slot-active" : ""}`}
              style={style3D}
            >
              <FloatingCard
                activity={activity}
                isCenter={isCenter}
                offset={offset}
                onSelect={() => goToSlide(idx)}
                floatDelay={(idx % 3) * 0.8}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Controls Bar */}
      <div className="leisure-carousel-controls">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="leisure-nav-btn leisure-nav-prev group"
          aria-label="Previous Activity"
        >
          <ChevronLeft size={20} className="leisure-nav-icon" />
        </button>

        {/* Circular Pagination Dots */}
        <div className="leisure-pagination-dots" role="tablist">
          {leisureActivities.map((act, idx) => (
            <button
              key={act.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === idx}
              aria-label={`Go to ${act.title}`}
              onClick={() => goToSlide(idx)}
              className={`leisure-dot-btn ${activeIndex === idx ? "is-active" : ""}`}
            >
              <span className="leisure-dot-inner" />
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="leisure-nav-btn leisure-nav-next group"
          aria-label="Next Activity"
        >
          <ChevronRight size={20} className="leisure-nav-icon" />
        </button>
      </div>
    </div>
  );
}
