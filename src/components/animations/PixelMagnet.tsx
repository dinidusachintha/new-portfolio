import { useEffect, useRef } from "react";

export interface PixelMagnetProps {
  /** Total count of magnetic pixels in the swarm */
  pixelCount?: number;
  /** Base pixel size in pixels */
  pixelSize?: number;
  /** Magnetic attraction coefficient towards cursor (0.01 - 0.2) */
  magnetStrength?: number;
  /** Velocity damping friction (0.8 - 0.98) */
  friction?: number;
  /** Swirl / vortex orbital velocity */
  swirl?: number;
  /** Palette of pixel colors */
  colors?: string[];
  /** Maximum influence radius in pixels */
  activeRadius?: number;
  /** Whether mouse click triggers a magnetic shockwave */
  repelOnClick?: boolean;
  /** If true, covers the entire viewport fixed */
  fullScreen?: boolean;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional children if used as a container wrapper */
  children?: React.ReactNode;
}

interface Pixel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  seed: number;
  orbitRadius: number;
  orbitSpeed: number;
}

const DEFAULT_COLORS = [
  "#9867ff", // Violet accent
  "#00D9FF", // Electric cyan
  "#c084fc", // Lavender
  "#ffffff", // Core white
  "#e9d5ff", // Soft purple
];

export default function PixelMagnet({
  pixelCount = 180,
  pixelSize = 3,
  magnetStrength = 0.055,
  friction = 0.91,
  swirl = 0.35,
  colors = DEFAULT_COLORS,
  activeRadius = 550,
  repelOnClick = true,
  fullScreen = true,
  className = "",
  children,
}: PixelMagnetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check accessibility & device pointer capabilities
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !isFinePointer) {
      return;
    }

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse coordinates (start offscreen)
    let mouseX = -9999;
    let mouseY = -9999;
    let isMouseActive = false;
    let mouseIdleTimer: ReturnType<typeof setTimeout> | null = null;

    // Shockwave pulse state
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;
    let shockwaveOrigin = { x: 0, y: 0 };

    // Initialize Pixels
    const pixels: Pixel[] = [];
    const initPixels = (w: number, h: number) => {
      pixels.length = 0;
      for (let i = 0; i < pixelCount; i++) {
        const pSize = Math.random() < 0.65 ? pixelSize : Math.max(1.5, pixelSize * (0.6 + Math.random() * 0.9));
        const color = colors[Math.floor(Math.random() * colors.length)];
        const baseAlpha = 0.4 + Math.random() * 0.55;

        // Spread initially in subtle constellation
        pixels.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: pSize,
          color,
          alpha: baseAlpha,
          baseAlpha,
          seed: Math.random() * Math.PI * 2,
          orbitRadius: 18 + Math.random() * 85,
          orbitSpeed: (0.015 + Math.random() * 0.035) * (Math.random() < 0.5 ? 1 : -1),
        });
      }
    };

    // Resize Handler
    const updateDimensions = () => {
      if (fullScreen) {
        width = window.innerWidth;
        height = window.innerHeight;
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      if (pixels.length === 0) {
        initPixels(width, height);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });

    // Pointer event listeners
    const handlePointerMove = (e: MouseEvent) => {
      if (fullScreen) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }

      isMouseActive = true;
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer);
      mouseIdleTimer = setTimeout(() => {
        isMouseActive = false;
      }, 3500);
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      isMouseActive = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!repelOnClick) return;

      let clickX = e.clientX;
      let clickY = e.clientY;

      if (!fullScreen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        clickX = e.clientX - rect.left;
        clickY = e.clientY - rect.top;
      }

      shockwaveOrigin = { x: clickX, y: clickY };
      shockwaveRadius = 10;
      shockwaveAlpha = 0.8;

      // Blast nearby pixels outward
      for (const p of pixels) {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);

        if (dist < 260) {
          const force = (1 - dist / 260) * 16;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }
    };

    const targetElement = fullScreen ? window : containerRef.current;
    if (targetElement) {
      window.addEventListener("mousemove", handlePointerMove, { passive: true });
      window.addEventListener("mouseleave", handlePointerLeave, { passive: true });
      window.addEventListener("mousedown", handleClick, { passive: true });
    }

    // Visibility observer to pause loop when tab hidden
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Clear previous frame
      ctx.clearRect(0, 0, width, height);

      // Render & expand shockwave if active
      if (shockwaveAlpha > 0.01) {
        shockwaveRadius += dt * 380;
        shockwaveAlpha *= 0.91;

        ctx.strokeStyle = `rgba(152, 103, 255, ${shockwaveAlpha * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(
          shockwaveOrigin.x,
          shockwaveOrigin.y,
          shockwaveRadius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      const hasCursor = mouseX > -1000 && mouseY > -1000;

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        p.seed += p.orbitSpeed;

        if (hasCursor) {
          // Calculate distance to target (cursor + orbital variance)
          const targetX = mouseX + Math.cos(p.seed) * p.orbitRadius;
          const targetY = mouseY + Math.sin(p.seed) * p.orbitRadius;

          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < activeRadius) {
            // Magnetic attraction force
            const pull = Math.min(dist * magnetStrength, 14);
            const angle = Math.atan2(dy, dx);

            p.vx += Math.cos(angle) * pull;
            p.vy += Math.sin(angle) * pull;

            // Swirl vortex around cursor
            if (isMouseActive) {
              const perpAngle = angle + Math.PI / 2;
              const swirlPull = (1 - dist / activeRadius) * swirl * 3.5;
              p.vx += Math.cos(perpAngle) * swirlPull;
              p.vy += Math.sin(perpAngle) * swirlPull;
            }

            // Glow brighter near cursor
            const proximity = 1 - Math.min(dist / 220, 1);
            p.alpha = THREE_lerp(p.alpha, p.baseAlpha + proximity * 0.45, 0.15);
          } else {
            // Subtle harmonic idle drift
            p.vx += Math.sin(p.seed * 0.8) * 0.1;
            p.vy += Math.cos(p.seed * 0.8) * 0.1;
            p.alpha = THREE_lerp(p.alpha, p.baseAlpha * 0.5, 0.08);
          }
        } else {
          // No cursor: gentle Brownian motion
          p.vx += Math.sin(p.seed) * 0.12;
          p.vy += Math.cos(p.seed) * 0.12;
          p.alpha = THREE_lerp(p.alpha, p.baseAlpha * 0.35, 0.05);
        }

        // Apply friction damping
        p.vx *= friction;
        p.vy *= friction;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        // Render pixel as crisp glowing square
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(p.alpha, 1));

        // Core pixel square
        ctx.fillRect(
          Math.round(p.x - p.size / 2),
          Math.round(p.y - p.size / 2),
          p.size,
          p.size
        );

        // Optional subtle halo glow on brighter pixels
        if (p.alpha > 0.6) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (p.alpha - 0.6) * 0.35;
          ctx.fillRect(
            Math.round(p.x - p.size),
            Math.round(p.y - p.size),
            p.size * 2,
            p.size * 2
          );
        }
      }

      ctx.globalAlpha = 1;
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("mousedown", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer);
    };
  }, [
    pixelCount,
    pixelSize,
    magnetStrength,
    friction,
    swirl,
    colors,
    activeRadius,
    repelOnClick,
    fullScreen,
  ]);

  return (
    <div
      ref={containerRef}
      className={`${
        fullScreen
          ? "fixed inset-0 pointer-events-none z-[35] overflow-hidden"
          : "relative overflow-hidden pointer-events-none"
      } ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
      {children}
    </div>
  );
}

function THREE_lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
