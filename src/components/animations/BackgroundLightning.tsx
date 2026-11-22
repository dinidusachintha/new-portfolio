import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface LightningData {
  id: number;
  viewBox: string;
  originXPercent: number;
  originYPercent: number;
  trunkPath: string;
  branchPaths: string[];
  twigPaths: string[];
  skyFlashIntensity: number;
}

type LightningPhase =
  | "idle"
  | "leader"
  | "stroke1"
  | "dip1"
  | "stroke2"
  | "dip2"
  | "stroke3"
  | "decay";

/**
 * Procedurally generates an authentic, organic fractal lightning bolt
 * using randomized jagged dielectric breakdown with recursive branching.
 */
function generateFractalLightning(
  width = 1440,
  height = 960,
  type: "top-right" | "top-left" | "top-center" | "crawler" = "top-right"
): LightningData {
  let startX: number;
  let startY: number;
  let targetX: number;
  let targetY: number;

  if (type === "top-right") {
    startX = width * (0.65 + Math.random() * 0.25);
    startY = -15;
    targetX = width * (0.2 + Math.random() * 0.4);
    targetY = height * (0.6 + Math.random() * 0.35);
  } else if (type === "top-left") {
    startX = width * (0.12 + Math.random() * 0.25);
    startY = -15;
    targetX = width * (0.4 + Math.random() * 0.35);
    targetY = height * (0.6 + Math.random() * 0.35);
  } else if (type === "top-center") {
    startX = width * (0.4 + Math.random() * 0.2);
    startY = -15;
    targetX = width * (0.3 + Math.random() * 0.4);
    targetY = height * (0.7 + Math.random() * 0.25);
  } else {
    // Upper atmospheric cloud-to-cloud sheet crawler
    startX = width * (0.1 + Math.random() * 0.15);
    startY = height * (0.08 + Math.random() * 0.12);
    targetX = width * (0.8 + Math.random() * 0.15);
    targetY = height * (0.12 + Math.random() * 0.18);
  }

  const trunkPoints: Point[] = [{ x: Math.round(startX), y: Math.round(startY) }];
  const branchPaths: string[] = [];
  const twigPaths: string[] = [];

  let currentX = startX;
  let currentY = startY;

  const totalDx = targetX - startX;
  const totalDy = targetY - startY;
  const totalDist = Math.hypot(totalDx, totalDy);
  const baseAngle = Math.atan2(totalDy, totalDx);

  const stepCount = Math.max(14, Math.floor(totalDist / 34));
  const segmentLength = totalDist / stepCount;

  for (let i = 0; i < stepCount; i++) {
    const progress = (i + 1) / stepCount;
    const targetInterpX = startX + totalDx * progress;
    const targetInterpY = startY + totalDy * progress;

    // Angular deviation: sharp jagged turns
    const angleJitter = (Math.random() - 0.5) * 1.05;
    const angle = baseAngle + angleJitter;
    const len = segmentLength * (0.7 + Math.random() * 0.55);

    currentX = Math.round(currentX + Math.cos(angle) * len);
    currentY = Math.round(currentY + Math.sin(angle) * len);

    // Guide towards ground/target
    currentX = Math.round(currentX * 0.68 + targetInterpX * 0.32);
    currentY = Math.round(currentY * 0.68 + targetInterpY * 0.32);

    trunkPoints.push({ x: currentX, y: currentY });

    // Organic branching: ~42% chance at each vertex
    if (Math.random() < 0.44 && i > 1 && i < stepCount - 1) {
      const forkSide = Math.random() > 0.5 ? 1 : -1;
      const branchAngle = baseAngle + forkSide * (0.42 + Math.random() * 0.48);
      const branchSteps = 3 + Math.floor(Math.random() * 4);
      let bX = currentX;
      let bY = currentY;
      const bPoints: Point[] = [{ x: bX, y: bY }];

      for (let s = 0; s < branchSteps; s++) {
        const bSubAngle = branchAngle + (Math.random() - 0.5) * 0.75;
        const bLen = segmentLength * (0.55 + Math.random() * 0.4);
        bX = Math.round(bX + Math.cos(bSubAngle) * bLen);
        bY = Math.round(bY + Math.sin(bSubAngle) * bLen);
        bPoints.push({ x: bX, y: bY });

        // Micro-twig off secondary branch
        if (Math.random() < 0.36 && s >= 1) {
          const tAngle =
            bSubAngle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.4);
          const tLen = segmentLength * 0.42;
          const tX = Math.round(bX + Math.cos(tAngle) * tLen);
          const tY = Math.round(bY + Math.sin(tAngle) * tLen);
          twigPaths.push(`M ${bX},${bY} L ${tX},${tY}`);
        }
      }

      branchPaths.push(
        bPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ")
      );
    }
  }

  const trunkPath = trunkPoints
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");

  return {
    id: Date.now() + Math.random(),
    viewBox: `0 0 ${width} ${height}`,
    originXPercent: Math.round((startX / width) * 100),
    originYPercent: Math.max(4, Math.round((startY / height) * 100)),
    trunkPath,
    branchPaths,
    twigPaths,
    skyFlashIntensity: 0.88 + Math.random() * 0.12,
  };
}

export default function BackgroundLightning() {
  const [bolt, setBolt] = useState<LightningData | null>(null);
  const [phase, setPhase] = useState<LightningPhase>("idle");
  const strikeCounterRef = useRef(0);

  useEffect(() => {
    // Accessibility check: disable if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let sequenceTimeouts: ReturnType<typeof setTimeout>[] = [];

    const clearTimeouts = () => {
      sequenceTimeouts.forEach((t) => clearTimeout(t));
      sequenceTimeouts = [];
      if (timeoutId) clearTimeout(timeoutId);
      setPhase("idle");
      setBolt(null);
    };

    /**
     * Executes the rapid multi-return-stroke lightning sequence.
     */
    const fireStrikeSequence = (data: LightningData, onDone: () => void) => {
      setBolt(data);

      // Phase 1: Stepped Leader Pre-Ionization (0ms)
      setPhase("leader");

      // Phase 2: Massive Primary Return Stroke (25ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("stroke1");
        }, 25)
      );

      // Phase 3: Dark Dip / Intermission (75ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("dip1");
        }, 75)
      );

      // Phase 4: Second Return Stroke / Dart Leader (115ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("stroke2");
        }, 115)
      );

      // Phase 5: Second Dip (165ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("dip2");
        }, 165)
      );

      // Phase 6: Third Strike / Residual Pulse (205ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("stroke3");
        }, 205)
      );

      // Phase 7: Exponential Atmospheric Cloud Decay (265ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("decay");
        }, 265)
      );

      // Phase 8: Return to Idle (1100ms)
      sequenceTimeouts.push(
        setTimeout(() => {
          setPhase("idle");
          setBolt(null);
          onDone();
        }, 1100)
      );
    };

    /**
     * Schedules the next lightning strike event (every 8 to 14 seconds).
     */
    const scheduleNextStrike = () => {
      const delay = 8000 + Math.random() * 6000;

      timeoutId = setTimeout(() => {
        const isDark = document.documentElement.getAttribute("data-theme") !== "light";
        if (!document.hidden && isDark) {
          executeLightningEvent();
        } else {
          scheduleNextStrike();
        }
      }, delay);
    };

    /**
     * Triggers a realistic lightning strike event with organic variety.
     */
    const executeLightningEvent = () => {
      strikeCounterRef.current++;
      const types: Array<"top-right" | "top-left" | "top-center" | "crawler"> = [
        "top-right",
        "top-left",
        "top-center",
        "top-right",
        "crawler",
      ];
      const selectedType = types[strikeCounterRef.current % types.length];
      const newBolt = generateFractalLightning(1440, 960, selectedType);

      // Occasional double-strike in nature (~25% probability)
      const isDoubleStrike = Math.random() < 0.26;

      fireStrikeSequence(newBolt, () => {
        if (isDoubleStrike) {
          // Secondary discharge nearby after 140ms
          sequenceTimeouts.push(
            setTimeout(() => {
              const secondaryType = selectedType === "top-right" ? "top-left" : "top-right";
              const secondBolt = generateFractalLightning(1440, 960, secondaryType);
              fireStrikeSequence(secondBolt, () => {
                scheduleNextStrike();
              });
            }, 140)
          );
        } else {
          scheduleNextStrike();
        }
      });
    };

    // First initial strike welcomes the user after 3.2s
    timeoutId = setTimeout(() => {
      if (!document.hidden) {
        executeLightningEvent();
      } else {
        scheduleNextStrike();
      }
    }, 3200);

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimeouts();
      } else {
        scheduleNextStrike();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeouts();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!bolt || phase === "idle") return null;

  return (
    <div
      className={`background-lightning-container phase-${phase}`}
      aria-hidden="true"
      style={
        {
          "--lightning-x": `${bolt.originXPercent}%`,
          "--lightning-y": `${bolt.originYPercent}%`,
          "--lightning-intensity": bolt.skyFlashIntensity,
        } as React.CSSProperties
      }
    >
      {/* 1. Full-screen Atmospheric Ambient Flash */}
      <div className="lightning-ambient-flash" />

      {/* 2. Concentrated Atmospheric Sky Cloud Sheet Illumination */}
      <div className="lightning-sky-sheet" />

      {/* 3. Upper Atmospheric Horizon Scatter */}
      <div className="lightning-horizon-glow" />

      {/* 4. Multi-Layer Organic Fractal Lightning SVG */}
      <svg
        className="lightning-svg-canvas"
        viewBox={bolt.viewBox}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Intense Violet Plasma Bloom Filter */}
          <filter
            id="plasmaGlow"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Crisp Ionization Sheath Filter */}
          <filter
            id="ionGlow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electric Violet Radial Plasma Gradient */}
          <linearGradient id="plasmaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#e9d5ff" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9867ff" stopOpacity="0.4" />
          </linearGradient>

          {/* Branch Plasma Gradient */}
          <linearGradient id="branchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3e8ff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#9867ff" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* LAYER A: Wide Plasma Halo (Trunk & Branches) */}
        <g className="lightning-layer-plasma" filter="url(#plasmaGlow)">
          <path
            d={bolt.trunkPath}
            fill="none"
            stroke="#9867ff"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lightning-trunk-plasma"
          />
          {bolt.branchPaths.map((bp, i) => (
            <path
              key={`b-plasma-${i}`}
              d={bp}
              fill="none"
              stroke="#a855f7"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lightning-branch-plasma"
            />
          ))}
        </g>

        {/* LAYER B: Ionization Sheath (Lavender/Violet) */}
        <g className="lightning-layer-ion" filter="url(#ionGlow)">
          <path
            d={bolt.trunkPath}
            fill="none"
            stroke="url(#plasmaGrad)"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lightning-trunk-ion"
          />
          {bolt.branchPaths.map((bp, i) => (
            <path
              key={`b-ion-${i}`}
              d={bp}
              fill="none"
              stroke="url(#branchGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lightning-branch-ion"
            />
          ))}
        </g>

        {/* LAYER C: Hyper-Hot Pure White Electrical Core */}
        <g className="lightning-layer-core">
          {/* Main Trunk Core */}
          <path
            d={bolt.trunkPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lightning-trunk-core"
          />
          {/* Fork Branches Core */}
          {bolt.branchPaths.map((bp, i) => (
            <path
              key={`b-core-${i}`}
              d={bp}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lightning-branch-core"
            />
          ))}
          {/* Fine Micro-Twigs */}
          {bolt.twigPaths.map((tp, i) => (
            <path
              key={`t-core-${i}`}
              d={tp}
              fill="none"
              stroke="#f5f3ff"
              strokeWidth="0.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lightning-twig-core"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
