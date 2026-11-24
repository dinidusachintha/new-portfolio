import { useEffect, useRef, useState, useCallback } from "react";

export interface IntroLoaderProps {
  onComplete: () => void;
  lenis?: { stop: () => void; start: () => void } | null;
}

const SESSION_KEY = "dinidu_portfolio_intro_played";
const TOTAL_STARS = 130;
const FIBONACCI_PHI = Math.PI * (3 - Math.sqrt(5)); // Golden angle ~2.39996 rad

export default function IntroLoader({ onComplete, lenis }: IntroLoaderProps) {
  // Check if loader should be skipped immediately (repeat visit, reduced motion, saveData)
  const shouldSkip = useCallback((): boolean => {
    if (typeof window === "undefined") return true;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return true;
    } catch {
      // storage unavailable
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return true;
    return false;
  }, []);

  const [skipped] = useState<boolean>(() => shouldSkip());
  const [useCanvas, setUseCanvas] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const isDesktop = window.innerWidth >= 768;
    const nav = navigator as unknown as { hardwareConcurrency?: number; deviceMemory?: number };
    const concurrency = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    const isCapable = concurrency >= 6 && memory >= 4;
    return isDesktop && isCapable;
  });

  const [captionVisible, setCaptionVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [quickExit, setQuickExit] = useState(false);
  const [cssLineFilled, setCssLineFilled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Cached dimensions (zero layout thrashing inside rAF)
  const dimsRef = useRef({ w: 0, h: 0, cx: 0, cy: 0, radius: 0, dpr: 1 });
  const pointsRef = useRef<Float32Array | null>(null); // [origX, origY, targetX, targetY, targetZ, delay, duration]
  const edgesRef = useRef<Uint16Array | null>(null); // pairs [i, j, ...]
  const isTerminatedRef = useRef(false);

  // Mark session
  const persistSession = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore storage error
    }
  };

  // Immediate skip if initial condition met
  useEffect(() => {
    if (skipped) {
      persistSession();
      onComplete();
    }
  }, [skipped, onComplete]);

  // Lock scrolling during intro
  useEffect(() => {
    if (skipped) return;
    if (lenis) {
      lenis.stop();
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (lenis) {
        lenis.start();
      }
      document.body.style.overflow = "";
    };
  }, [skipped, lenis]);

  // Handle exit completion
  const handleFinalExit = useCallback(() => {
    if (isTerminatedRef.current) return;
    isTerminatedRef.current = true;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    persistSession();
    if (lenis) {
      lenis.start();
    }
    document.body.style.overflow = "";
    onComplete();
  }, [lenis, onComplete]);

  // User skip trigger (click, touch, or key)
  const triggerSkip = useCallback(() => {
    if (exiting || isTerminatedRef.current) return;
    setQuickExit(true);
    setExiting(true);
    setTimeout(handleFinalExit, 250);
  }, [exiting, handleFinalExit]);

  // Global skip listeners
  useEffect(() => {
    if (skipped) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        triggerSkip();
      }
    };
    window.addEventListener("keydown", handleKey, { passive: true });
    return () => window.removeEventListener("keydown", handleKey);
  }, [skipped, triggerSkip]);

  // Asset readiness & exit coordinator
  useEffect(() => {
    if (skipped) return;

    let mounted = true;
    const startTime = performance.now();
    const minDuration = 1600; // 1.6s minimum
    const maxSafetyTimeout = 4000; // 4.0s maximum

    // Preload & decode critical hero image
    const assetReadyPromise = (async () => {
      try {
        if ("fonts" in document) {
          await document.fonts.ready;
        }
        const img = new Image();
        img.src = "/assets/images/video2-preview.jpg";
        if (img.decode) {
          await img.decode();
        } else {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
      } catch {
        // Continue even if image preload errors
      }
    })();

    // Caption fade-in timer at ~1.2s
    const captionTimer = setTimeout(() => {
      if (mounted) setCaptionVisible(true);
    }, 1200);

    // CSS variant line fill
    const cssLineTimer = setTimeout(() => {
      if (mounted) setCssLineFilled(true);
    }, 100);

    // Coordinate natural exit
    const coordinateExit = async () => {
      await Promise.race([
        Promise.all([
          assetReadyPromise,
          new Promise((resolve) => setTimeout(resolve, minDuration)),
        ]),
        new Promise((resolve) => setTimeout(resolve, maxSafetyTimeout)),
      ]);

      if (!mounted || isTerminatedRef.current || exiting) return;

      const elapsed = performance.now() - startTime;
      const remainingMin = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (!mounted || isTerminatedRef.current || exiting) return;
        setExiting(true);
        setTimeout(handleFinalExit, 600);
      }, remainingMin);
    };

    coordinateExit();

    return () => {
      mounted = false;
      clearTimeout(captionTimer);
      clearTimeout(cssLineTimer);
    };
  }, [skipped, exiting, handleFinalExit]);

  // =========================================================================
  // Canvas 2D Globe Engine
  // =========================================================================
  useEffect(() => {
    if (skipped || !useCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      setUseCanvas(false);
      return;
    }

    // Initialize 3D points and precompute neighbor edges
    const stride = 7; // [origX, origY, targetX, targetY, targetZ, delay, duration]
    const pts = new Float32Array(TOTAL_STARS * stride);

    // Measure canvas wrapper
    const updateCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const radius = Math.min(w, h) * 0.42;
      dimsRef.current = { w, h, cx: w * 0.5, cy: h * 0.5, radius, dpr };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasDimensions();

    const ro = new ResizeObserver(() => updateCanvasDimensions());
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const { w, h } = dimsRef.current;

    // Generate Fibonacci Sphere points
    for (let i = 0; i < TOTAL_STARS; i++) {
      const idx = i * stride;
      // Random starting coordinates on 2D stage
      pts[idx] = (Math.random() - 0.5) * w * 1.5;
      pts[idx + 1] = (Math.random() - 0.5) * h * 1.5;

      // Fibonacci sphere target coordinates (normalized unit sphere)
      const y = 1 - (2 * i) / (TOTAL_STARS - 1);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = FIBONACCI_PHI * i;

      pts[idx + 2] = r * Math.cos(theta); // targetX
      pts[idx + 3] = y;                   // targetY
      pts[idx + 4] = r * Math.sin(theta); // targetZ

      pts[idx + 5] = Math.random() * 600; // delay (0 to 600ms)
      pts[idx + 6] = 1300;               // duration (1300ms)
    }
    pointsRef.current = pts;

    // Precompute 3D neighbor pairs once (pairs closer than unit distance 0.44)
    const pairList: number[] = [];
    const maxDistSq = 0.44 * 0.44;

    for (let i = 0; i < TOTAL_STARS; i++) {
      const iIdx = i * stride;
      const x1 = pts[iIdx + 2];
      const y1 = pts[iIdx + 3];
      const z1 = pts[iIdx + 4];

      for (let j = i + 1; j < TOTAL_STARS; j++) {
        const jIdx = j * stride;
        const dx = x1 - pts[jIdx + 2];
        const dy = y1 - pts[jIdx + 3];
        const dz = z1 - pts[jIdx + 4];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq <= maxDistSq) {
          pairList.push(i, j);
        }
      }
    }
    edgesRef.current = new Uint16Array(pairList);

    // Ease-out cubic formula
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Projected coordinate arrays for rendering
    const projX = new Float32Array(TOTAL_STARS);
    const projY = new Float32Array(TOTAL_STARS);
    const projZ = new Float32Array(TOTAL_STARS);
    const projAlpha = new Float32Array(TOTAL_STARS);

    let startTime = performance.now();
    let frameCount = 0;
    let fpsCheckDone = false;
    let rotationAngle = 0;
    let lastTime = startTime;

    // Visibility observer to pause loop when tab hidden
    let isTabVisible = !document.hidden;
    const handleVisChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !isTerminatedRef.current) {
        lastTime = performance.now();
        animFrameRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);

    const render = (now: number) => {
      if (isTerminatedRef.current || !isTabVisible) return;

      const delta = now - lastTime;
      lastTime = now;
      const elapsed = now - startTime;

      // Dynamic FPS guard for the first 600ms
      if (!fpsCheckDone) {
        frameCount++;
        if (elapsed >= 600) {
          fpsCheckDone = true;
          const fps = (frameCount * 1000) / elapsed;
          if (fps < 40) {
            // Switch gracefully to CSS fallback
            setUseCanvas(false);
            return;
          }
        }
      }

      const { w, h, cx, cy, radius: r } = dimsRef.current;
      if (w === 0 || h === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Fill background #050507
      ctx.fillStyle = "#050507";
      ctx.fillRect(0, 0, w, h);

      // Rotate around Y axis: ~0.0007 rad/ms
      rotationAngle += 0.0007 * delta;
      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);

      const fov = r * 2.8;

      // 1. Transform each point (convergence + sphere rotation)
      for (let i = 0; i < TOTAL_STARS; i++) {
        const idx = i * stride;
        const delay = pts[idx + 5];
        const duration = pts[idx + 6];

        const pointTime = Math.max(0, elapsed - delay);
        const progress = Math.min(1, pointTime / duration);
        const t = easeOutCubic(progress);

        // Spherical target coordinates
        const tx = pts[idx + 2] * r;
        const ty = pts[idx + 3] * r;
        const tz = pts[idx + 4] * r;

        // Current 3D position (interpolating from random 2D plane to 3D sphere)
        const curX = pts[idx] * (1 - t) + tx * t;
        const curY = pts[idx + 1] * (1 - t) + ty * t;
        const curZ = 0 * (1 - t) + tz * t;

        // Rotate around Y axis
        const rx = curX * cosRot + curZ * sinRot;
        const rz = -curX * sinRot + curZ * cosRot;
        const ry = curY;

        // 3D Perspective Projection
        const pz = rz + fov;
        const scale = fov / Math.max(1, pz);

        projX[i] = cx + rx * scale;
        projY[i] = cy + ry * scale;
        projZ[i] = rz;

        // Depth shading: front dots brighter, back dots dimmer
        const normZ = (rz / r + 1) * 0.5; // 0 to 1
        projAlpha[i] = Math.max(0.18, Math.min(1, 0.25 + 0.75 * normZ)) * t;
      }

      // 2. Draw connecting violet constellation lines (#9867ff)
      // Fade lines in from 1.0s to 1.4s
      const linesFade = Math.max(0, Math.min(1, (elapsed - 1000) / 400));
      const edges = edgesRef.current;

      if (linesFade > 0 && edges) {
        ctx.lineWidth = 0.85;

        // Draw in 3 alpha buckets to minimize state changes
        const bucketAlpha = [0.15 * linesFade, 0.32 * linesFade, 0.55 * linesFade];
        const bucketColors = [
          `rgba(152, 103, 255, ${bucketAlpha[0].toFixed(3)})`,
          `rgba(152, 103, 255, ${bucketAlpha[1].toFixed(3)})`,
          `rgba(152, 103, 255, ${bucketAlpha[2].toFixed(3)})`,
        ];

        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          ctx.strokeStyle = bucketColors[b];
          let drawnInBucket = false;

          for (let e = 0; e < edges.length; e += 2) {
            const p1 = edges[e];
            const p2 = edges[e + 1];

            const a1 = projAlpha[p1];
            const a2 = projAlpha[p2];
            const avgAlpha = (a1 + a2) * 0.5;

            const bucketIdx = avgAlpha < 0.4 ? 0 : avgAlpha < 0.7 ? 1 : 2;
            if (bucketIdx !== b) continue;

            ctx.moveTo(projX[p1], projY[p1]);
            ctx.lineTo(projX[p2], projY[p2]);
            drawnInBucket = true;
          }

          if (drawnInBucket) {
            ctx.stroke();
          }
        }
      }

      // 3. Draw star dots: rgba(216, 196, 255, alpha), radius ~1.5px
      const dotRadius = 1.45;
      for (let i = 0; i < TOTAL_STARS; i++) {
        const a = projAlpha[i];
        if (a < 0.05) continue;

        ctx.beginPath();
        ctx.arc(projX[i], projY[i], dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 196, 255, ${a.toFixed(3)})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisChange);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [skipped, useCanvas]);

  if (skipped) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading portfolio"
      onClick={triggerSkip}
      onTouchStart={triggerSkip}
      className={`intro-globe-overlay fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none cursor-pointer bg-[#050507] ${
        exiting ? (quickExit ? "intro-exit-quick" : "intro-exit-smooth") : ""
      }`}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: quickExit ? "250ms" : "600ms",
        transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <span className="sr-only">Loading Dinidu Sachintha's Portfolio</span>

      {/* Main Visual Stage */}
      <div
        className={`intro-globe-stage relative flex flex-col items-center justify-center ${
          exiting ? "intro-stage-scale-exit" : ""
        }`}
        style={{
          transition: quickExit
            ? "transform 250ms cubic-bezier(0.76, 0, 0.24, 1)"
            : "transform 600ms cubic-bezier(0.76, 0, 0.24, 1)",
        }}
        aria-hidden="true"
      >
        {useCanvas ? (
          /* Desktop Canvas Globe */
          <div className="relative w-[min(60vw,60vh)] h-[min(60vw,60vh)] max-w-[480px] max-h-[480px] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        ) : (
          /* Mobile / Low-End Lightweight CSS Fallback */
          <div className="flex flex-col items-center justify-center py-8">
            <div className="font-unbounded font-black text-3xl sm:text-4xl text-white tracking-[4px] mb-4">
              DS
            </div>
            {/* 1px violet line filling across */}
            <div className="w-32 h-[1px] bg-white/10 overflow-hidden relative rounded-full">
              <div
                className={`h-full bg-[#9867ff] rounded-full transition-transform duration-[1200ms] ease-out origin-left shadow-[0_0_8px_#9867ff] ${
                  cssLineFilled ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </div>
          </div>
        )}

        {/* Small Mono Caption ("Dinidu Sachintha", 11px, letter-spacing 3px, color #9a8ccf) */}
        <div
          className={`mt-4 font-mono text-[11px] tracking-[3px] text-[#9a8ccf] uppercase transition-opacity duration-700 select-none ${
            captionVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Dinidu Sachintha
        </div>
      </div>
    </div>
  );
}
