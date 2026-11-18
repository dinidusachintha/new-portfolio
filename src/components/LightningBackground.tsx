import { useEffect, useRef } from "react";

export type LightningSide = "left" | "right" | "full";
export type LightningPalette =
  | "cyan-violet"
  | "violet-purple"
  | "cyan-blue"
  | "emerald-cyan";

interface LightningBackgroundProps {
  side?: LightningSide;
  palette?: LightningPalette;
  className?: string;
  intensity?: "subtle" | "normal";
}

interface Point {
  x: number;
  y: number;
}

interface SmoothBranch {
  points: Point[];
  targetPoints: Point[];
  width: number;
  isMain: boolean;
  length: number;
}

interface SmoothStrike {
  branches: SmoothBranch[];
  startTime: number;
  duration: number; // in ms
  flashAlpha: number;
}

/**
 * Ultra-smooth, cinematic Electric Plasma & Lightning Engine.
 * Features:
 * - Fluid streak-growth rendering (visible path expansion)
 * - Continuous ambient harmonic plasma filaments (no harsh popping)
 * - Damped cursor electrical attraction
 * - Dual-tone luminous neon glow passes
 * - Automatic viewport visibility pausing (0% idle CPU)
 */
export default function LightningBackground({
  side = "left",
  palette = "cyan-violet",
  className = "",
  intensity = "normal",
}: LightningBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || 550);

    // Color definitions
    let primaryRgb: string;
    let secondaryRgb: string;
    let coreRgb = "rgba(255, 255, 255, 0.95)";

    switch (palette) {
      case "violet-purple":
        primaryRgb = "rgba(168, 85, 247, 0.85)"; // #a855f7
        secondaryRgb = "rgba(192, 132, 252, 0.5)"; // #c084fc
        break;
      case "cyan-blue":
        primaryRgb = "rgba(56, 189, 248, 0.85)"; // #38bdf8
        secondaryRgb = "rgba(59, 130, 246, 0.5)"; // #3b82f6
        break;
      case "emerald-cyan":
        primaryRgb = "rgba(52, 211, 153, 0.85)"; // #34d399
        secondaryRgb = "rgba(56, 189, 248, 0.5)"; // #38bdf8
        break;
      case "cyan-violet":
      default:
        primaryRgb = "rgba(56, 189, 248, 0.85)"; // #38bdf8
        secondaryRgb = "rgba(152, 103, 255, 0.5)"; // #9867ff
        break;
    }

    // High-DPI canvas handling
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 550;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Active strikes queue
    const activeStrikes: SmoothStrike[] = [];

    // Interactive cursor tracking
    let targetMouseX = side === "right" ? width * 0.8 : width * 0.2;
    let targetMouseY = height * 0.5;
    let currentMouseX = targetMouseX;
    let currentMouseY = targetMouseY;
    let isHovering = false;
    let lastMouseMoveTime = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        targetMouseX = clientX - rect.left;
        targetMouseY = clientY - rect.top;
        isHovering = true;
        lastMouseMoveTime = performance.now();
      } else {
        isHovering = false;
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    /**
     * Fractal segment generator with midpoint displacement
     */
    const generateFractalSegment = (
      start: Point,
      end: Point,
      displace: number,
      minSegmentLength = 10
    ): Point[] => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minSegmentLength) {
        return [start, end];
      }

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const nx = -dy / dist;
      const ny = dx / dist;

      const offset = (Math.random() - 0.5) * displace;
      const mid: Point = {
        x: midX + nx * offset,
        y: midY + ny * offset,
      };

      const left = generateFractalSegment(start, mid, displace * 0.55, minSegmentLength);
      const right = generateFractalSegment(mid, end, displace * 0.55, minSegmentLength);

      return left.slice(0, -1).concat(right);
    };

    /**
     * Spawns a smooth cinematic strike
     */
    const createStrike = (start: Point, end: Point, isCursorDriven = false) => {
      const branches: SmoothBranch[] = [];
      const stripSpan = Math.min(width * 0.35, 260);
      const mainDisplace = stripSpan * (isCursorDriven ? 0.18 : 0.24);

      // Main trunk
      const mainPoints = generateFractalSegment(start, end, mainDisplace, 8);
      branches.push({
        points: mainPoints,
        targetPoints: mainPoints,
        width: isCursorDriven ? 1.7 : 2.1,
        isMain: true,
        length: mainPoints.length,
      });

      // Secondary organic branches
      const branchCount = isCursorDriven ? 2 : 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < branchCount; i++) {
        const rootIdx = Math.floor(
          mainPoints.length * 0.25 + Math.random() * (mainPoints.length * 0.55)
        );
        const root = mainPoints[rootIdx] || start;

        const trunkAngle = Math.atan2(end.y - start.y, end.x - start.x);
        const branchAngle =
          trunkAngle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6);
        const branchLength = (Math.random() * 0.35 + 0.15) * Math.min(width, height);

        const branchEnd: Point = {
          x: root.x + Math.cos(branchAngle) * branchLength,
          y: root.y + Math.sin(branchAngle) * branchLength,
        };

        const branchPoints = generateFractalSegment(
          root,
          branchEnd,
          mainDisplace * 0.45,
          7
        );

        branches.push({
          points: branchPoints,
          targetPoints: branchPoints,
          width: 1.1,
          isMain: false,
          length: branchPoints.length,
        });
      }

      activeStrikes.push({
        branches,
        startTime: performance.now(),
        duration: isCursorDriven ? 550 : 750, // smooth ms lifespan
        flashAlpha: isCursorDriven ? 0.05 : 0.09,
      });
    };

    /**
     * Ambient strike scheduler
     */
    let lastAmbientStrikeTime = performance.now();
    let ambientInterval = intensity === "subtle" ? 3800 : 2500;

    const triggerAmbientStrike = () => {
      let start: Point;
      let end: Point;

      if (side === "left") {
        const fromTop = Math.random() > 0.6;
        start = fromTop
          ? { x: Math.random() * (width * 0.15), y: 0 }
          : { x: 0, y: Math.random() * (height * 0.5) };

        end = {
          x: Math.min(width * 0.28, start.x + (Math.random() * 0.18 + 0.06) * width),
          y: Math.min(height * 0.95, start.y + (Math.random() * 0.4 + 0.25) * height),
        };
      } else if (side === "right") {
        const fromTop = Math.random() > 0.6;
        start = fromTop
          ? { x: width - Math.random() * (width * 0.15), y: 0 }
          : { x: width, y: Math.random() * (height * 0.5) };

        end = {
          x: Math.max(width * 0.72, start.x - (Math.random() * 0.18 + 0.06) * width),
          y: Math.min(height * 0.95, start.y + (Math.random() * 0.4 + 0.25) * height),
        };
      } else {
        start = { x: Math.random() * width, y: 0 };
        end = {
          x: start.x + (Math.random() - 0.5) * (width * 0.3),
          y: Math.min(height * 0.9, height * 0.4 + Math.random() * height * 0.4),
        };
      }

      createStrike(start, end, false);
      ambientInterval =
        intensity === "subtle"
          ? 3200 + Math.random() * 3000
          : 2200 + Math.random() * 2400;
    };

    // Visibility Observer
    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.02, rootMargin: "60px 0px 60px 0px" }
    );
    visibilityObserver.observe(container);

    let lastCursorStrikeTime = 0;
    let animationFrameId: number;

    // Master Render Loop
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Ambient strikes
      if (!prefersReducedMotion && time - lastAmbientStrikeTime > ambientInterval) {
        triggerAmbientStrike();
        lastAmbientStrikeTime = time;
      }

      // Smooth cursor-triggered electric spark
      if (
        !prefersReducedMotion &&
        isHovering &&
        time - lastCursorStrikeTime > 750 &&
        time - lastMouseMoveTime < 400
      ) {
        let origin: Point;
        if (side === "left") {
          origin = {
            x: Math.max(0, currentMouseX - 110 - Math.random() * 60),
            y: Math.max(0, currentMouseY - 120 - Math.random() * 60),
          };
        } else if (side === "right") {
          origin = {
            x: Math.min(width, currentMouseX + 110 + Math.random() * 60),
            y: Math.max(0, currentMouseY - 120 - Math.random() * 60),
          };
        } else {
          origin = {
            x: currentMouseX + (Math.random() > 0.5 ? -90 : 90),
            y: Math.max(0, currentMouseY - 100),
          };
        }

        createStrike(origin, { x: currentMouseX, y: currentMouseY }, true);
        lastCursorStrikeTime = time;
      }

      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // 1. Continuous Ambient Plasma Filaments (The "Humming" Electric Edge)
      // =========================================================================
      if (!prefersReducedMotion) {
        const tSec = time * 0.001;
        const filamentCount = side === "full" ? 2 : 2;

        for (let f = 0; f < filamentCount; f++) {
          const fPhase = f * Math.PI * 0.8;
          ctx.save();
          ctx.beginPath();

          const segCount = 28;
          for (let s = 0; s <= segCount; s++) {
            const frac = s / segCount;
            const y = frac * height;

            // Smooth undulating harmonic sine waves
            const wave1 = Math.sin(tSec * 1.6 + frac * 5.0 + fPhase) * 14;
            const wave2 = Math.cos(tSec * 2.4 + frac * 8.0) * 8;
            const wave3 = Math.sin(tSec * 0.8 + fPhase) * 6;

            let x: number;
            if (side === "left") {
              const base = 25 + f * 22;
              x = Math.max(4, base + wave1 + wave2 + wave3);
            } else if (side === "right") {
              const base = width - (25 + f * 22);
              x = Math.min(width - 4, base - (wave1 + wave2 + wave3));
            } else {
              x = (width * 0.5) + wave1 + wave2;
            }

            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Soft plasma glow
          ctx.shadowColor = f === 0 ? primaryRgb : secondaryRgb;
          ctx.shadowBlur = 10;
          ctx.strokeStyle =
            f === 0
              ? `rgba(56, 189, 248, ${0.18 + Math.sin(tSec * 3 + f) * 0.06})`
              : `rgba(168, 85, 247, ${0.14 + Math.cos(tSec * 2.5 + f) * 0.05})`;
          ctx.lineWidth = 1.2;
          ctx.lineCap = "round";
          ctx.stroke();

          ctx.restore();
        }
      }

      // =========================================================================
      // 2. Dynamic Procedural Strikes (Smooth Streak Growth & Gentle Decay)
      // =========================================================================
      for (let s = activeStrikes.length - 1; s >= 0; s--) {
        const strike = activeStrikes[s];
        const elapsed = time - strike.startTime;
        const progress = Math.min(1, elapsed / strike.duration);

        if (progress >= 1) {
          activeStrikes.splice(s, 1);
          continue;
        }

        // Smooth growth and fade curves
        // - In first 24%: grows from start to end (streak effect)
        // - In remaining 76%: smooth exponential fade
        const growProgress = Math.min(1, progress / 0.24);
        const fadeProgress =
          progress < 0.24 ? 1 : Math.max(0, 1 - (progress - 0.24) / 0.76);
        const currentAlpha = Math.pow(fadeProgress, 1.6);

        // Soft atmospheric radial bloom
        if (progress < 0.35 && strike.flashAlpha > 0) {
          const bloomAlpha = strike.flashAlpha * (1 - progress / 0.35);
          const bloomX =
            side === "right" ? width * 0.85 : side === "left" ? width * 0.15 : width * 0.5;
          const bloomGrad = ctx.createRadialGradient(
            bloomX,
            height * 0.4,
            10,
            bloomX,
            height * 0.4,
            Math.min(width, height) * 0.75
          );
          bloomGrad.addColorStop(0, `rgba(56, 189, 248, ${bloomAlpha * 1.2})`);
          bloomGrad.addColorStop(0.5, `rgba(168, 85, 247, ${bloomAlpha * 0.6})`);
          bloomGrad.addColorStop(1, "rgba(8, 8, 12, 0)");
          ctx.fillStyle = bloomGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // Render each branch up to current growth length
        for (const branch of strike.branches) {
          const pts = branch.points;
          if (pts.length < 2) continue;

          const visibleCount = Math.max(
            2,
            Math.floor(pts.length * growProgress)
          );

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let p = 1; p < visibleCount; p++) {
            ctx.lineTo(pts[p].x, pts[p].y);
          }
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Pass 1: Outer Plasma Aura
          ctx.shadowColor = secondaryRgb;
          ctx.shadowBlur = branch.isMain ? 16 : 8;
          ctx.strokeStyle = `rgba(168, 85, 247, ${currentAlpha * 0.55})`;
          ctx.lineWidth = branch.width * 2.8;
          ctx.stroke();

          // Pass 2: Inner Neon Plasma
          ctx.shadowColor = primaryRgb;
          ctx.shadowBlur = branch.isMain ? 7 : 3;
          ctx.strokeStyle = `rgba(56, 189, 248, ${currentAlpha * 0.9})`;
          ctx.lineWidth = branch.width * 1.35;
          ctx.stroke();

          // Pass 3: Specular Core Filament
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.95})`;
          ctx.lineWidth = branch.width * 0.55;
          ctx.stroke();

          ctx.restore();
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [side, palette, intensity]);

  // Directional vignette ensures the content stays 100% dark, clear, and high-contrast
  const vignetteBackground =
    side === "left"
      ? "linear-gradient(to right, rgba(8, 8, 12, 0.0) 0%, rgba(8, 8, 12, 0.05) 15%, rgba(8, 8, 12, 0.5) 28%, rgba(8, 8, 12, 0.9) 42%, rgba(8, 8, 12, 1) 56%, rgba(8, 8, 12, 1) 100%)"
      : side === "right"
      ? "linear-gradient(to left, rgba(8, 8, 12, 0.0) 0%, rgba(8, 8, 12, 0.05) 15%, rgba(8, 8, 12, 0.5) 28%, rgba(8, 8, 12, 0.9) 42%, rgba(8, 8, 12, 1) 56%, rgba(8, 8, 12, 1) 100%)"
      : "radial-gradient(ellipse at center, rgba(8, 8, 12, 0.1) 0%, rgba(8, 8, 12, 0.8) 75%, rgba(8, 8, 12, 1) 100%)";

  return (
    <div
      ref={containerRef}
      className={`lightning-bg-container absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: vignetteBackground }}
      />
    </div>
  );
}
