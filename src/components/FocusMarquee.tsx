import { useEffect, useRef } from "react";
import { focusMarqueeTech } from "../data/portfolio";
import type { LenisScrollEvent } from "../hooks/useSmoothScroll";

export default function FocusMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Duplicate items for seamless continuous looping
  const items = [...focusMarqueeTech, ...focusMarqueeTech];

  const directionRef = useRef<number>(1);
  const targetSpeedRef = useRef<number>(50); // pixels per second
  const currentSpeedRef = useRef<number>(50);
  const isHoveredRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const isTabVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    // 1. Measure and cache geometries ONCE (plus on ResizeObserver)
    const GAP = 20;
    const count = items.length;
    const halfCount = focusMarqueeTech.length;
    let itemWidths: number[] = new Array(count).fill(120);
    let initialOffsets: number[] = new Array(count).fill(0);
    let cycleWidth = 2400;
    let containerWidth = container.offsetWidth || window.innerWidth;
    const wasFocused: boolean[] = new Array(count).fill(false);

    const measureGeometries = () => {
      containerWidth = container.offsetWidth || window.innerWidth;
      let cumOffset = 0;

      // Measure first half
      for (let i = 0; i < halfCount; i++) {
        const el = itemRefs.current[i];
        const w = el ? el.offsetWidth : 120;
        itemWidths[i] = w;
        initialOffsets[i] = cumOffset;
        cumOffset += w + GAP;
      }

      cycleWidth = cumOffset;

      // Second half duplicates offsets
      for (let i = 0; i < halfCount; i++) {
        const idx = halfCount + i;
        const el = itemRefs.current[idx];
        const w = el ? el.offsetWidth : itemWidths[i];
        itemWidths[idx] = w;
        initialOffsets[idx] = initialOffsets[i] + cycleWidth;
      }
    };

    measureGeometries();

    // ResizeObserver caches measurements on resize (never inside animation loop)
    const ro = new ResizeObserver(() => {
      measureGeometries();
    });
    ro.observe(container);

    // 2. Pause when off-screen or tab hidden
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(container);

    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 3. Lenis scroll velocity & direction listener (reads existing event, no new scroll listener)
    const handleLenisScroll = (e: Event) => {
      if (!isVisibleRef.current) return;
      const { velocity, direction } = (e as CustomEvent<LenisScrollEvent>).detail;

      if (direction !== 0) {
        directionRef.current = direction; // 1 = down (scroll left), -1 = up (scroll right)
      }

      const boost = Math.min(Math.abs(velocity) * 0.45, 3.8);
      targetSpeedRef.current = Math.max(targetSpeedRef.current, 50 * (1 + boost));
    };

    window.addEventListener("lenis-scroll", handleLenisScroll, { passive: true });

    // 4. ONE requestAnimationFrame animation loop
    let rAFId: number | null = null;
    let offset = 0;
    let lastTime = performance.now();
    const baseSpeed = 50; // px/sec

    const tick = (now: number) => {
      const deltaSec = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (isVisibleRef.current && isTabVisibleRef.current) {
        // Smoothly decay velocity back to base speed
        currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.08;
        targetSpeedRef.current += (baseSpeed - targetSpeedRef.current) * 0.03;

        // Advance offset if not desktop hovered
        if (!isHoveredRef.current) {
          const move = currentSpeedRef.current * directionRef.current * deltaSec;
          offset -= move;

          // Seamless wrapping
          if (offset <= -cycleWidth) {
            offset += cycleWidth;
          } else if (offset >= 0) {
            offset -= cycleWidth;
          }
        }

        // Lens calculations
        const centerX = containerWidth * 0.5;
        const isMobile = containerWidth < 768;
        const radius = isMobile ? containerWidth * 0.42 : containerWidth * 0.46;
        const minScale = isMobile ? 0.9 : 0.82;
        const maxScale = isMobile ? 1.15 : 1.32;
        const focusThreshold = centerX * 0.3; // 30% of center

        const totalSpan = cycleWidth * 2;

        for (let i = 0; i < count; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;

          const w = itemWidths[i];
          let pos = initialOffsets[i] + offset;

          // Wrap individual chips into active view zone
          while (pos < -w - 200) pos += totalSpan;
          while (pos > containerWidth + 200) pos -= totalSpan;

          const itemCenter = pos + w * 0.5;
          const dist = Math.abs(itemCenter - centerX);

          let scale = minScale;
          let opacity = 0.35;

          if (dist < radius) {
            const u = dist / radius; // 0 at center, 1 at boundary
            const cosVal = Math.cos(u * (Math.PI / 2));
            scale = minScale + (maxScale - minScale) * (cosVal * cosVal);
            opacity = 0.35 + 0.65 * cosVal;
          }

          // Toggle .is-focused ONLY when threshold state changes (zero reflow)
          const isFocused = dist <= focusThreshold;
          if (isFocused !== wasFocused[i]) {
            wasFocused[i] = isFocused;
            el.classList.toggle("is-focused", isFocused);
          }

          // Write ONLY transform & opacity
          el.style.transform = `translate3d(${pos.toFixed(1)}px, -50%, 0) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
        }
      }

      rAFId = requestAnimationFrame(tick);
    };

    rAFId = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("lenis-scroll", handleLenisScroll);
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, [items.length]);

  return (
    <div className="focus-marquee-section">
      {/* Visually Hidden Semantic List for Screen Readers */}
      <ul className="sr-only">
        {focusMarqueeTech.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      {/* Decorative Focus Lens Marquee Viewport */}
      <div
        ref={containerRef}
        className="focus-marquee-strip"
        aria-hidden="true"
        onMouseEnter={() => {
          if (window.innerWidth >= 768) isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        {/* Subtle Violet Center Focus Line (0.5px, 50% opacity) */}
        <div className="focus-marquee-center-line" />

        {/* Ambient Left & Right Edge Vignette Masks */}
        <div className="focus-marquee-fade focus-marquee-fade-left" />
        <div className="focus-marquee-fade focus-marquee-fade-right" />

        {/* Pill Chips Track */}
        <div ref={trackRef} className="focus-marquee-track">
          {items.map((tech, idx) => (
            <div
              key={`${tech}-${idx}`}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className="focus-marquee-item font-mono text-[14px]"
            >
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
