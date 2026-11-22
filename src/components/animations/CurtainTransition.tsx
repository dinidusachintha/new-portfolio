import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface CurtainTransitionProps {
  isActive: boolean;
  onCovered?: () => void;
  onComplete?: () => void;
}

export default function CurtainTransition({
  isActive,
  onCovered,
  onComplete,
}: CurtainTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Direct completion under reduced motion
    if (prefersReducedMotion) {
      onCovered?.();
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const bars = container.querySelectorAll<HTMLElement>(".curtain-bar");
    if (!bars.length) {
      onCovered?.();
      onComplete?.();
      return;
    }

    // Stop Lenis during transition if available on window
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop?.();

    let coveredTriggered = false;

    const tl = gsap.timeline({
      onComplete: () => {
        lenis?.start?.();
        onComplete?.();
      },
    });

    timelineRef.current = tl;

    // Initial state: scaleY: 0 anchored at bottom
    gsap.set(bars, { scaleY: 0, transformOrigin: "center bottom" });

    // 1. Enter: scaleY 0 -> 1 from bottom (stagger 70ms)
    tl.to(bars, {
      scaleY: 1,
      duration: 0.42,
      stagger: 0.07,
      ease: "power3.inOut",
    });

    // 2. Call onCovered as soon as bars fully obscure screen
    tl.call(() => {
      if (!coveredTriggered) {
        coveredTriggered = true;
        onCovered?.();
      }
    });

    // Small hold (60ms) for content swap
    tl.to({}, { duration: 0.06 });

    // 3. Exit: scaleY 1 -> 0 toward top
    tl.set(bars, { transformOrigin: "center top" });
    tl.to(bars, {
      scaleY: 0,
      duration: 0.42,
      stagger: 0.07,
      ease: "power3.inOut",
    });

    // Skip handler: any click or keypress finishes curtain instantly
    const handleSkip = () => {
      if (tl.isActive()) {
        tl.progress(1);
        if (!coveredTriggered) {
          coveredTriggered = true;
          onCovered?.();
        }
        lenis?.start?.();
        onComplete?.();
      }
    };

    window.addEventListener("click", handleSkip, { once: true });
    window.addEventListener("keydown", handleSkip, { once: true });

    return () => {
      window.removeEventListener("click", handleSkip);
      window.removeEventListener("keydown", handleSkip);
      tl.kill();
      lenis?.start?.();
    };
  }, [isActive, onCovered, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="curtain-transition-overlay fixed inset-0 z-[120] pointer-events-none flex"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="curtain-bar flex-1 h-full will-change-transform" />
      ))}
    </div>
  );
}
