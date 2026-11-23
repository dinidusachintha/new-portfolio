import { useEffect, useRef } from "react";

interface RisingLinesProps {
  lineCount?: number;
  className?: string;
}

interface LightLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  baseAlpha: number;
  colorType: "violet" | "cyan" | "white" | "indigo";
}

export default function RisingLines({ lineCount = 48, className = "" }: RisingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const colors = {
      violet: {
        glow: "rgba(168, 85, 247, 0.9)",
        tip: "rgba(255, 255, 255, 0.98)",
        body: "rgba(168, 85, 247, 0.65)",
        tail: "rgba(152, 103, 255, 0.0)",
      },
      cyan: {
        glow: "rgba(56, 189, 248, 0.9)",
        tip: "rgba(255, 255, 255, 0.98)",
        body: "rgba(56, 189, 248, 0.65)",
        tail: "rgba(56, 189, 248, 0.0)",
      },
      white: {
        glow: "rgba(255, 255, 255, 0.9)",
        tip: "rgba(255, 255, 255, 1.0)",
        body: "rgba(224, 231, 255, 0.75)",
        tail: "rgba(199, 210, 254, 0.0)",
      },
      indigo: {
        glow: "rgba(129, 140, 248, 0.85)",
        tip: "rgba(255, 255, 255, 0.95)",
        body: "rgba(129, 140, 248, 0.6)",
        tail: "rgba(99, 102, 241, 0.0)",
      },
    };

    const typePool: Array<"violet" | "cyan" | "white" | "indigo"> = [
      "violet", "violet", "cyan", "indigo", "white", "violet", "cyan"
    ];

    let lines: LightLine[] = [];

    const createLine = (initialRandomY = false): LightLine => {
      const type = typePool[Math.floor(Math.random() * typePool.length)];
      const lineLen = Math.random() * 140 + 70; // 70px to 210px
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + Math.random() * 30,
        length: lineLen,
        speed: Math.random() * 1.5 + 0.65, // 0.65px to 2.15px per frame
        width: Math.random() * 1.4 + 0.8, // 0.8px to 2.2px
        baseAlpha: Math.random() * 0.45 + 0.5,
        colorType: type,
      };
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.max(24, Math.min(lineCount, Math.floor(width / 22)));
      lines = Array.from({ length: targetCount }, () => createLine(true));
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Render rising light lines
      if (!prefersReducedMotion) {
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          l.y -= l.speed;

          // Calculate vertical fade factor:
          // Bright near horizon & middle, smoothly fades to 0 as it ascends past upper 25%
          const topFadeBoundary = height * 0.35;
          let fade = 1;
          if (l.y < topFadeBoundary) {
            fade = Math.max(0, l.y / topFadeBoundary);
          }
          // Also smooth fade-in as it leaves the bottom
          const bottomFadeBoundary = height - 40;
          if (l.y > bottomFadeBoundary) {
            fade = Math.min(fade, Math.max(0, (height - l.y) / 40));
          }

          const currentAlpha = l.baseAlpha * fade;

          if (currentAlpha > 0.01) {
            const colorScheme = colors[l.colorType];
            const gradient = ctx.createLinearGradient(l.x, l.y, l.x, l.y + l.length);
            gradient.addColorStop(0, colorScheme.tip);
            gradient.addColorStop(0.2, colorScheme.body);
            gradient.addColorStop(1, colorScheme.tail);

            ctx.save();
            ctx.globalAlpha = currentAlpha;

            // Soft glowing streak
            ctx.strokeStyle = gradient;
            ctx.lineWidth = l.width;
            ctx.lineCap = "round";
            ctx.shadowBlur = 10;
            ctx.shadowColor = colorScheme.glow;

            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(l.x, l.y + l.length);
            ctx.stroke();

            // Glowing light spark at the tip of the line
            ctx.beginPath();
            ctx.arc(l.x, l.y, l.width * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = colorScheme.tip;
            ctx.shadowBlur = 12;
            ctx.shadowColor = colorScheme.glow;
            ctx.fill();

            ctx.restore();
          }

          // Respawn at bottom when it has traveled past top
          if (l.y + l.length < 0) {
            lines[i] = createLine(false);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(container);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      io.disconnect();
      resizeObserver.disconnect();
    };
  }, [lineCount]);

  return (
    <div
      ref={containerRef}
      className={`rising-lines-container absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Ambient Radial Horizon Glow Blooming Upward */}
      <div className="rising-lines-ambient-glow" />

      {/* 2. Razor-Sharp Luminous Horizon Line at Bottom */}
      <div className="rising-lines-horizon-bar" />

      {/* 3. HTML5 Canvas for the Rising Lines of Light */}
      <canvas ref={canvasRef} className="rising-lines-canvas w-full h-full block" />
    </div>
  );
}
