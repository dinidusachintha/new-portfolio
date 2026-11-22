import { useEffect, useRef, useState } from "react";

interface LightningStrike {
  id: number;
  originX: number; // percentage
  originY: number; // percentage
  branchPath: string;
}

// Organic pre-computed branching lightning paths (normalized coordinates)
const LIGHTNING_PATHS = [
  "M 0,0 Q 15,35 10,70 T 30,120 Q 25,160 45,210 T 35,260 Q 55,310 50,370 M 10,70 Q -15,100 -25,130 M 30,120 Q 50,150 70,175 M 45,210 Q 25,245 15,270",
  "M 0,0 Q -20,40 -15,80 T -35,135 Q -30,180 -50,230 T -40,290 Q -65,340 -55,400 M -15,80 Q 10,110 25,140 M -35,135 Q -55,165 -75,190",
  "M 0,0 Q 25,45 20,90 T 5,140 Q 30,190 25,240 T 40,300 M 20,90 Q 45,115 60,145 M 5,140 Q -15,170 -30,200",
];

export default function BackgroundLightning() {
  const [strike, setStrike] = useState<LightningStrike | null>(null);
  const [phase, setPhase] = useState<"idle" | "flash1" | "dip" | "flash2" | "fade">("idle");
  const strikeCountRef = useRef(0);

  useEffect(() => {
    // Accessibility check: disable if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let sequenceTimeouts: ReturnType<typeof setTimeout>[] = [];

    const clearSequence = () => {
      sequenceTimeouts.forEach((t) => clearTimeout(t));
      sequenceTimeouts = [];
      setPhase("idle");
      setStrike(null);
    };

    // Schedule next rare lightning strike (every 10s to 16s)
    const scheduleNextStrike = () => {
      const delay = 10000 + Math.random() * 6000;

      timeoutId = setTimeout(() => {
        // Only trigger if document is visible and not light theme
        const isDark = document.documentElement.getAttribute("data-theme") !== "light";
        if (!document.hidden && isDark) {
          triggerRareLightning();
        } else {
          scheduleNextStrike();
        }
      }, delay);
    };

    const triggerRareLightning = () => {
      strikeCountRef.current++;
      const strikeIdx = strikeCountRef.current % LIGHTNING_PATHS.length;

      // Random origin in upper atmospheric region
      const origins = [
        { x: 72 + Math.random() * 16, y: 8 + Math.random() * 12 }, // Upper right
        { x: 26 + Math.random() * 20, y: 6 + Math.random() * 10 }, // Upper left-center
        { x: 50 + Math.random() * 18, y: 5 + Math.random() * 8 },  // Upper center
      ];
      const selectedOrigin = origins[strikeCountRef.current % origins.length];

      setStrike({
        id: Date.now(),
        originX: selectedOrigin.x,
        originY: selectedOrigin.y,
        branchPath: LIGHTNING_PATHS[strikeIdx],
      });

      // Atmospheric multi-burst lightning timing:
      // 0ms: Initial fast flash
      setPhase("flash1");

      // 90ms: Brief dip
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("dip");
        }, 90)
      );

      // 170ms: Main luminous pulse with branch illumination
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("flash2");
        }, 170)
      );

      // 360ms: Silky atmospheric decay/afterglow
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("fade");
        }, 360)
      );

      // 1800ms: Complete and schedule next rare event
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("idle");
          setStrike(null);
          scheduleNextStrike();
        }, 1800)
      );
    };

    // Initial first trigger after 4s to welcome the user, then every 10s-16s
    timeoutId = setTimeout(() => {
      if (!document.hidden) {
        triggerRareLightning();
      } else {
        scheduleNextStrike();
      }
    }, 4000);

    const handleVisibility = () => {
      if (document.hidden) {
        clearSequence();
        if (timeoutId) clearTimeout(timeoutId);
      } else {
        scheduleNextStrike();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearSequence();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!strike || phase === "idle") return null;

  return (
    <div
      className={`background-lightning-container phase-${phase}`}
      aria-hidden="true"
      style={{
        "--lightning-x": `${strike.originX}%`,
        "--lightning-y": `${strike.originY}%`,
      } as React.CSSProperties}
    >
      {/* 1. Atmospheric Violet Sky Sheet Illumination */}
      <div className="lightning-sheet-glow" />

      {/* 2. Soft Violet Ambient Aura */}
      <div className="lightning-ambient-aura" />

      {/* 3. Subtle Ethereal Branch Filament */}
      <svg
        className="lightning-filament-svg"
        viewBox="-100 0 200 450"
        style={{
          left: `${strike.originX}%`,
          top: `${strike.originY}%`,
        }}
      >
        <defs>
          <linearGradient id="lightningVioletGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#9867ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <filter id="lightningVioletGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow halo path */}
        <path
          d={strike.branchPath}
          fill="none"
          stroke="url(#lightningVioletGrad)"
          strokeWidth="3.5"
          filter="url(#lightningVioletGlow)"
          className="lightning-path-glow"
        />

        {/* Crisp core path */}
        <path
          d={strike.branchPath}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          className="lightning-path-core"
        />
      </svg>
    </div>
  );
}
