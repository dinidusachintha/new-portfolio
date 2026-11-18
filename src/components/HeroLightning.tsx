import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface LightningBranch {
  points: Point[];
  alpha: number;
  width: number;
  isMain: boolean;
}

interface LightningStrike {
  branches: LightningBranch[];
  life: number;
  maxLife: number;
  flashOpacity: number;
}

/**
 * High-performance, luxury procedural lightning engine.
 * Generates natural fractal lightning discharges with multi-layered plasma glow
 * and interactive cursor magnetic attraction.
 */
export default function HeroLightning() {
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
    let height = (canvas.height = container.clientHeight || 650);

    // Responsive DPI scaling
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 650;
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

    // Active lightning strikes queue
    const activeStrikes: LightningStrike[] = [];

    // Interactive mouse tracking relative to the container
    let mouseX = width * 0.25;
    let mouseY = height * 0.45;
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
        mouseX = clientX - rect.left;
        mouseY = clientY - rect.top;
        isHovering = true;
        lastMouseMoveTime = performance.now();
      } else {
        isHovering = false;
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    /**
     * Recursive Midpoint Displacement Fractal Line Generator
     */
    const generateFractalSegment = (
      start: Point,
      end: Point,
      displace: number,
      minSegmentLength = 12
    ): Point[] => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minSegmentLength) {
        return [start, end];
      }

      // Midpoint with normal perpendicular displacement
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      // Normal vector
      const nx = -dy / dist;
      const ny = dx / dist;

      // Jitter displacement
      const offset = (Math.random() - 0.5) * displace;
      const mid: Point = {
        x: midX + nx * offset,
        y: midY + ny * offset,
      };

      const left = generateFractalSegment(start, mid, displace * 0.58, minSegmentLength);
      const right = generateFractalSegment(mid, end, displace * 0.58, minSegmentLength);

      return left.slice(0, -1).concat(right);
    };

    /**
     * Creates a branched lightning bolt strike
     */
    const createStrike = (start: Point, end: Point, isCursorDriven = false) => {
      const branches: LightningBranch[] = [];

      // Main trunk
      const mainDisplace = Math.min(width, height) * (isCursorDriven ? 0.16 : 0.22);
      const mainPoints = generateFractalSegment(start, end, mainDisplace, 10);
      branches.push({
        points: mainPoints,
        alpha: 1.0,
        width: isCursorDriven ? 1.8 : 2.2,
        isMain: true,
      });

      // Secondary forked branches
      const branchCount = isCursorDriven ? 2 : 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < branchCount; i++) {
        // Pick random point along the main trunk (avoiding ends)
        const rootIdx = Math.floor(
          mainPoints.length * 0.2 +
            Math.random() * (mainPoints.length * 0.6)
        );
        const root = mainPoints[rootIdx] || start;

        // Angle deviating from the main trunk direction
        const trunkAngle = Math.atan2(end.y - start.y, end.x - start.x);
        const branchAngle =
          trunkAngle + (Math.random() > 0.5 ? 1 : -1) * (0.45 + Math.random() * 0.6);
        const branchLength = (Math.random() * 0.35 + 0.15) * Math.min(width, height);

        const branchEnd: Point = {
          x: root.x + Math.cos(branchAngle) * branchLength,
          y: root.y + Math.sin(branchAngle) * branchLength,
        };

        const branchPoints = generateFractalSegment(
          root,
          branchEnd,
          mainDisplace * 0.45,
          8
        );
        branches.push({
          points: branchPoints,
          alpha: 0.75,
          width: 1.2,
          isMain: false,
        });
      }

      activeStrikes.push({
        branches,
        life: 0,
        maxLife: isCursorDriven ? 18 : 24, // frames to fade out smoothly
        flashOpacity: isCursorDriven ? 0.08 : 0.14,
      });
    };

    /**
     * Ambient strike trigger
     */
    let lastAmbientStrikeTime = performance.now();
    let ambientInterval = 2200; // ms between ambient strikes

    const triggerAmbientStrike = () => {
      // Pick random origin along the top or left boundary
      const fromLeft = Math.random() > 0.45;
      const start: Point = fromLeft
        ? { x: 0, y: Math.random() * height * 0.65 }
        : { x: Math.random() * width * 0.45, y: 0 };

      // Target point toward bottom-left or center-left
      const end: Point = {
        x: Math.min(width * 0.55, start.x + (Math.random() * 0.35 + 0.15) * width),
        y: Math.min(height * 0.95, start.y + (Math.random() * 0.45 + 0.25) * height),
      };

      createStrike(start, end, false);
      ambientInterval = 1800 + Math.random() * 2600;
    };

    // Viewport IntersectionObserver: Pause rendering when scrolled away
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // Interactive cursor throttle
    let lastCursorStrikeTime = 0;

    // Master Animation Loop
    let animationFrameId: number;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      // Handle ambient discharges
      if (!prefersReducedMotion && time - lastAmbientStrikeTime > ambientInterval) {
        triggerAmbientStrike();
        lastAmbientStrikeTime = time;
      }

      // Handle interactive cursor discharges when user is hovering
      if (
        !prefersReducedMotion &&
        isHovering &&
        time - lastCursorStrikeTime > 650 &&
        time - lastMouseMoveTime < 400
      ) {
        // Spark from top-left or side toward mouse pointer
        const origin: Point = {
          x: Math.max(0, mouseX - 120 - Math.random() * 80),
          y: Math.max(0, mouseY - 140 - Math.random() * 60),
        };
        createStrike(origin, { x: mouseX, y: mouseY }, true);
        lastCursorStrikeTime = time;
      }

      // Clear with soft persistence trail
      ctx.clearRect(0, 0, width, height);

      // Render and update strikes
      for (let s = activeStrikes.length - 1; s >= 0; s--) {
        const strike = activeStrikes[s];
        strike.life++;

        const progress = strike.life / strike.maxLife;
        const fade = Math.max(0, 1 - progress);

        // Ambient atmospheric flash
        if (strike.life <= 3 && strike.flashOpacity > 0) {
          const flashGrad = ctx.createRadialGradient(
            width * 0.2,
            height * 0.3,
            20,
            width * 0.2,
            height * 0.3,
            width * 0.6
          );
          flashGrad.addColorStop(0, `rgba(56, 189, 248, ${strike.flashOpacity * fade})`);
          flashGrad.addColorStop(0.5, `rgba(168, 85, 247, ${strike.flashOpacity * 0.5 * fade})`);
          flashGrad.addColorStop(1, "rgba(8, 8, 12, 0)");
          ctx.fillStyle = flashGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // Draw each branch with multi-pass electric plasma luminescence
        for (const branch of strike.branches) {
          const pts = branch.points;
          if (pts.length < 2) continue;

          const currentAlpha = branch.alpha * fade;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let p = 1; p < pts.length; p++) {
            ctx.lineTo(pts[p].x, pts[p].y);
          }
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Pass 1: Outer Violet / Plasma Aura
          ctx.shadowColor = "#9867ff"; // Electric Violet
          ctx.shadowBlur = branch.isMain ? 18 : 10;
          ctx.strokeStyle = `rgba(152, 103, 255, ${currentAlpha * 0.55})`;
          ctx.lineWidth = branch.width * 2.6;
          ctx.stroke();

          // Pass 2: Inner Cyan Core Glow
          ctx.shadowColor = "#38bdf8"; // Blueprint Cyan
          ctx.shadowBlur = branch.isMain ? 8 : 4;
          ctx.strokeStyle = `rgba(56, 189, 248, ${currentAlpha * 0.9})`;
          ctx.lineWidth = branch.width * 1.4;
          ctx.stroke();

          // Pass 3: Specular White Electric Filament
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.lineWidth = branch.width * 0.6;
          ctx.stroke();

          ctx.restore();
        }

        // Remove dead strikes
        if (strike.life >= strike.maxLife) {
          activeStrikes.splice(s, 1);
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-lightning-container absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[24px]"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

      {/* Atmospheric Vignette: Keeps center & portrait 100% clean, dark, and high-contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(8, 8, 12, 0.05) 0%, rgba(8, 8, 12, 0.02) 20%, rgba(8, 8, 12, 0.55) 55%, rgba(8, 8, 12, 0.95) 100%)",
        }}
      />
    </div>
  );
}
