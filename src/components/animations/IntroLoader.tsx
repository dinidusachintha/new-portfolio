import { useEffect, useRef } from "react";
import gsap from "gsap";
import IntroTypography from "./IntroTypography";
import SplitCurtain from "./SplitCurtain";
import "../../styles/intro-loader.css";

export interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const typoRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accessibility check: immediately complete if prefers-reduced-motion is enabled
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    // Safety timeout fallback (max 2.5s) to guarantee the user is never trapped
    const safetyTimeout = setTimeout(() => {
      onComplete();
    }, 2500);

    const ctx = gsap.context(() => {
      const letters = typoRef.current?.querySelectorAll(".intro-char");
      const subtitle = typoRef.current?.querySelector(".intro-subtitle");

      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(safetyTimeout);
          onComplete();
        },
      });

      // Initial states
      if (letters) {
        gsap.set(letters, { y: 60, opacity: 0 });
      }
      if (subtitle) {
        gsap.set(subtitle, { y: 15, opacity: 0 });
      }
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0, opacity: 1 });
      }
      if (topPanelRef.current && bottomPanelRef.current) {
        gsap.set([topPanelRef.current, bottomPanelRef.current], { yPercent: 0 });
      }

      // ====================================================================
      // PHASE 1: Cinematic Typography Reveal (0s - 0.7s)
      // ====================================================================
      if (letters && letters.length > 0) {
        tl.to(
          letters,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: "power3.out",
          },
          0.05
        );
      }

      if (subtitle) {
        tl.to(
          subtitle,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          0.38
        );
      }

      // ====================================================================
      // PHASE 2: Electric Cyan Line Expansion (0.7s - 1.1s)
      // ====================================================================
      if (lineRef.current) {
        tl.to(
          lineRef.current,
          {
            scaleX: 1,
            duration: 0.45,
            ease: "expo.out",
          },
          0.72
        );
      }

      // Subtle typography recession in perspective
      if (typoRef.current) {
        tl.to(
          typoRef.current,
          {
            scale: 0.94,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          0.85
        );
      }

      // ====================================================================
      // PHASE 3 & 4: Split-Screen Curtain Reveal & Hero Entrance (1.1s - 1.7s)
      // ====================================================================
      if (topPanelRef.current) {
        tl.to(
          topPanelRef.current,
          {
            yPercent: -100,
            duration: 0.65,
            ease: "power4.inOut",
          },
          1.12
        );
      }

      if (bottomPanelRef.current) {
        tl.to(
          bottomPanelRef.current,
          {
            yPercent: 100,
            duration: 0.65,
            ease: "power4.inOut",
          },
          1.12
        );
      }

      // Smooth fade out of center cyan line as panels diverge
      if (lineRef.current) {
        tl.to(
          lineRef.current,
          {
            opacity: 0,
            duration: 0.28,
            ease: "power2.in",
          },
          1.15
        );
      }

      // Final micro fade of root overlay
      if (containerRef.current) {
        tl.to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.15,
            ease: "none",
          },
          1.65
        );
      }
    }, containerRef);

    return () => {
      clearTimeout(safetyTimeout);
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <aside
      ref={containerRef}
      className="intro-loader-root"
      aria-label="Portfolio Loading Screen"
      aria-live="polite"
      role="status"
    >
      <SplitCurtain
        topRef={topPanelRef}
        bottomRef={bottomPanelRef}
        lineRef={lineRef}
      />
      <IntroTypography ref={typoRef} />
    </aside>
  );
}
