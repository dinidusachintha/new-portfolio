import { useEffect, useRef, useState } from "react";

export interface SmoothCursorProps {
  trailCount?: number;
  color?: string;
  secondaryColor?: string;
  headSize?: number;
  trailWidth?: number;
  damping?: number;
  stiffness?: number;
  magneticHover?: boolean;
  className?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function SmoothCursor({
  trailCount = 12,
  color = "#9867ff",
  secondaryColor = "#38bdf8",
  headSize = 4,
  trailWidth = 4,
  damping = 0.72,
  stiffness = 0.22,
  magneticHover = true,
  className = "",
}: SmoothCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const pointsRef = useRef<TrailPoint[]>([]);
  const isHoveringInteractive = useRef(false);
  const hoverScale = useRef(1);
  const isVisible = useRef(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only devices and disable custom cursor
    const touchCheck =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    if (touchCheck) {
      setIsTouchDevice(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize points
    pointsRef.current = Array.from({ length: trailCount }, () => ({
      x: -100,
      y: -100,
      vx: 0,
      vy: 0,
    }));

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible.current) {
        isVisible.current = true;
        // Snap initial points to cursor
        for (let i = 0; i < pointsRef.current.length; i++) {
          pointsRef.current[i].x = e.clientX;
          pointsRef.current[i].y = e.clientY;
          pointsRef.current[i].vx = 0;
          pointsRef.current[i].vy = 0;
        }
      }
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;

      if (magneticHover) {
        const target = e.target as HTMLElement | null;
        if (target) {
          const interactive = target.closest(
            'a, button, [role="button"], input, textarea, select, .cursor-pointer, .btn-liquid-fill'
          );
          isHoveringInteractive.current = !!interactive;
        }
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isVisible.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Smooth hover scale interpolation
      const targetScale = isHoveringInteractive.current ? 1.85 : 1;
      hoverScale.current += (targetScale - hoverScale.current) * 0.18;

      const points = pointsRef.current;
      const targetX = mousePos.current.targetX;
      const targetY = mousePos.current.targetY;

      // Spring physics for Point 0 (directly following mouse)
      const p0 = points[0];
      const ax = (targetX - p0.x) * stiffness;
      const ay = (targetY - p0.y) * stiffness;
      p0.vx = (p0.vx + ax) * damping;
      p0.vy = (p0.vy + ay) * damping;
      p0.x += p0.vx;
      p0.y += p0.vy;

      // Spring physics for consecutive trail points
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const prev = points[i - 1];

        // Progressive stiffness and damping along the trail for natural elasticity
        const stepRatio = 1 - i / points.length;
        const currentStiffness = stiffness * (0.85 + stepRatio * 0.45);
        const currentDamping = damping * 0.96;

        const forceX = (prev.x - p.x) * currentStiffness;
        const forceY = (prev.y - p.y) * currentStiffness;

        p.vx = (p.vx + forceX) * currentDamping;
        p.vy = (p.vy + forceY) * currentDamping;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw smooth tapering spring trail using quadratic bezier curves
      if (points.length > 2) {
        for (let i = 0; i < points.length - 1; i++) {
          const ptA = points[i];
          const ptB = points[i + 1];
          const midX = (ptA.x + ptB.x) / 2;
          const midY = (ptA.y + ptB.y) / 2;

          const ratio = 1 - i / (points.length - 1);
          const currentWidth = Math.max(1, trailWidth * ratio * hoverScale.current);
          const alpha = Math.max(0.05, ratio * 0.75);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ptA.x, ptA.y);
          ctx.quadraticCurveTo(ptA.x, ptA.y, midX, midY);

          // Interpolate between violet and cyan along the trail
          ctx.strokeStyle = i < points.length / 2 ? color : secondaryColor;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = currentWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowBlur = 8 * ratio;
          ctx.shadowColor = i < points.length / 2 ? color : secondaryColor;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw Head Cursor
      const head = points[0];
      const radius = headSize * hoverScale.current;

      ctx.save();
      // Outer subtle magnetic halo
      ctx.beginPath();
      ctx.arc(head.x, head.y, radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isHoveringInteractive.current ? `${secondaryColor}25` : `${color}20`;
      ctx.fill();

      // Sharp glowing central core
      ctx.beginPath();
      ctx.arc(head.x, head.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHoveringInteractive.current ? secondaryColor : "#ffffff";
      ctx.shadowBlur = isHoveringInteractive.current ? 16 : 10;
      ctx.shadowColor = isHoveringInteractive.current ? secondaryColor : color;
      ctx.fill();

      // Inner point
      ctx.beginPath();
      ctx.arc(head.x, head.y, radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [trailCount, color, secondaryColor, headSize, trailWidth, damping, stiffness, magneticHover]);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`smooth-cursor-canvas fixed inset-0 pointer-events-none z-[9999] ${className}`}
      aria-hidden="true"
    />
  );
}
