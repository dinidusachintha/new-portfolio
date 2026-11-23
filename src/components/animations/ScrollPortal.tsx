import React, { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown, Layers, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

export interface ScrollPortalScene {
  id?: string | number;
  title: string;
  subtitle?: string;
  tag?: string;
  description?: string;
  background?: string;
  accent?: string;
  radius?: number;
  stats?: Array<{ label: string; value: string }>;
  tags?: string[];
  link?: string;
  content?: React.ReactNode;
}

export interface ScrollPortalProps {
  scenes?: ScrollPortalScene[];
  frameDepth?: number;
  perspective?: number;
  scrollLength?: number;
  frameRadius?: number;
  frameBorder?: number;
  scrub?: number;
  hold?: number;
  dim?: number;
  className?: string;
}

const DEFAULT_SCENES: ScrollPortalScene[] = [
  {
    id: "portal-1",
    tag: "LAYER 01 // CORE INFRASTRUCTURE",
    title: "Cloud & Distributed Systems",
    subtitle: "High-Throughput Multi-Region Architecture",
    description:
      "Enterprise systems engineered with event-driven microservices, distributed consensus algorithms, and zero-downtime blue/green deployment topologies across Kubernetes clusters.",
    background: "linear-gradient(145deg, rgba(17,17,24,0.95) 0%, rgba(10,10,18,0.98) 100%)",
    accent: "#9867ff",
    stats: [
      { label: "Throughput", value: "100k+ req/s" },
      { label: "P99 Latency", value: "< 14ms" },
      { label: "Availability", value: "99.99%" },
    ],
    tags: ["Kubernetes", "Kafka", "Go", "Distributed Consensus", "gRPC"],
  },
  {
    id: "portal-2",
    tag: "LAYER 02 // INTELLIGENT COMPUTE",
    title: "AI Engines & Real-Time RAG",
    subtitle: "Vector Search & Autonomous Agents",
    description:
      "Sub-second vector retrieval pipelines with semantic re-ranking, streaming LLM agent orchestrations, and high-concurrency memory stores for autonomous multi-agent systems.",
    background: "linear-gradient(145deg, rgba(14,19,32,0.95) 0%, rgba(8,12,22,0.98) 100%)",
    accent: "#38bdf8",
    stats: [
      { label: "Vector Index", value: "10M+ docs" },
      { label: "Semantic Search", value: "18ms avg" },
      { label: "Token Stream", value: "120 t/sec" },
    ],
    tags: ["pgvector", "LangChain", "FastAPI", "Python", "OpenAI"],
  },
  {
    id: "portal-3",
    tag: "LAYER 03 // LOW-LATENCY FABRIC",
    title: "High-Frequency Execution",
    subtitle: "Real-Time WebSocket & Financial Pipelines",
    description:
      "Ultra-low latency financial messaging and state synchronization fabrics processing millions of ticks per second with cryptographic verification and audited transactional isolation.",
    background: "linear-gradient(145deg, rgba(20,15,30,0.95) 0%, rgba(12,8,20,0.98) 100%)",
    accent: "#c084fc",
    stats: [
      { label: "State Sync", value: "Microsecond" },
      { label: "Daily Volume", value: "$4.2M+" },
      { label: "Integrity", value: "ACID L3" },
    ],
    tags: ["WebSockets", "Redis Cluster", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    id: "portal-4",
    tag: "LAYER 04 // SPATIAL FRONTEND",
    title: "Immersive 3D Experiences",
    subtitle: "WebGL Shaders & Kinetic Interactions",
    description:
      "Award-caliber spatial web interfaces built with GPU-accelerated Three.js shaders, 60 FPS buttery micro-animations, and responsive architectural component libraries.",
    background: "linear-gradient(145deg, rgba(12,24,28,0.95) 0%, rgba(6,16,20,0.98) 100%)",
    accent: "#34d399",
    stats: [
      { label: "Frame Rate", value: "60 FPS" },
      { label: "Shader Pass", value: "GLSL Raymarch" },
      { label: "Bundle Size", value: "Optimized" },
    ],
    tags: ["Three.js", "React 19", "GLSL Shaders", "GSAP", "Tailwind CSS"],
  },
];

export default function ScrollPortal({
  scenes = DEFAULT_SCENES,
  frameDepth = 1,
  perspective = 1000,
  scrollLength = 1,
  frameRadius = 16,
  frameBorder = 1,
  scrub = 0.35,
  hold = 0,
  dim = 0.55,
  className = "",
}: ScrollPortalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const sceneCount = scenes.length;
  // Calculate total runway height: each scene gets scrollLength * 100vh
  const totalRunwayVh = useMemo(() => {
    return Math.max(200, (sceneCount - 1) * scrollLength * 100 + 100);
  }, [sceneCount, scrollLength]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      // Progress from 0 (top of container at top of viewport) to 1 (bottom of container at bottom)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Map progress to 0 ... (sceneCount - 1)
      targetProgressRef.current = progress * (sceneCount - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    let curProg = targetProgressRef.current;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const target = targetProgressRef.current;

      if (prefersReducedMotion) {
        curProg = target;
      } else {
        // Smooth lerp based on scrub factor
        const alpha = 1 - Math.pow(Math.max(0.001, 1 - scrub), dt * 60);
        curProg += (target - curProg) * alpha;
      }

      setCurrentProgress(curProg);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [sceneCount, scrollLength, scrub]);

  const activeIndex = Math.min(sceneCount - 1, Math.max(0, Math.round(currentProgress)));

  const jumpToScene = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = containerTop + (idx / (sceneCount - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className={`scroll-portal-root relative w-full ${className}`}
      style={{ height: `${totalRunwayVh}vh` }}
    >
      {/* Sticky Viewport Stage pinned for the entire duration of the scroll */}
      <div className="scroll-portal-sticky sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#050507]">
        {/* Subtle Ambient Background Vignette & Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${scenes[activeIndex]?.accent || "#9867ff"}18 0%, rgba(5,5,7,0.85) 60%, #050507 100%)`,
          }}
          aria-hidden="true"
        />

        {/* Top Header HUD: Scene counter & Title */}
        <div className="absolute top-6 sm:top-10 left-6 sm:left-12 right-6 sm:right-12 z-40 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-violet-400">
              <Layers size={16} />
            </span>
            <div>
              <div className="font-mono text-[10px] sm:text-xs text-violet-400 uppercase tracking-widest flex items-center gap-2">
                <span>SCROLL PORTAL</span>
                <span className="text-white/20">|</span>
                <span>NESTED FRAMES</span>
              </div>
              <div className="font-unbounded text-xs sm:text-sm font-bold text-white tracking-tight">
                {scenes[activeIndex]?.title || "Architecture Layers"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full font-mono text-xs text-gray-300">
            <span className="text-white font-bold">0{activeIndex + 1}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/50">0{sceneCount}</span>
          </div>
        </div>

        {/* 3D Perspective Stage */}
        <div
          className="scroll-portal-perspective-stage relative w-full max-w-[1240px] h-[78vh] sm:h-[82vh] max-h-[760px] mx-auto px-4 flex items-center justify-center"
          style={{
            perspective: `${perspective}px`,
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
          }}
        >
          {scenes.map((scene, idx) => {
            // Delta relative to smoothed scroll position
            const delta = idx - currentProgress;

            let scale = 1;
            let translateZ = 0;
            let opacity = 1;
            let zIndex = 100 - idx;
            let dimOpacity = 0;
            let pointerEvents: "auto" | "none" = "none";

            if (delta < 0) {
              // Frame has been passed: zoom past camera, fly forward and fade out
              const passedProgress = -delta;
              scale = 1 + passedProgress * 3.6;
              translateZ = passedProgress * 550;
              opacity = Math.max(0, 1 - passedProgress * 1.5);
              zIndex = 200 + Math.floor(passedProgress * 10);
              pointerEvents = "none";
            } else if (delta === 0) {
              // Currently active frame
              scale = 1;
              translateZ = 0;
              opacity = 1;
              zIndex = 100;
              pointerEvents = "auto";
            } else {
              // Frame is nested deeper inside the previous one
              // Scale drops exponentially with frameDepth
              scale = Math.pow(0.52, delta * frameDepth);
              translateZ = -delta * frameDepth * 420;
              opacity = Math.max(0.12, 1 - delta * 0.28);
              dimOpacity = Math.min(dim, delta * dim);
              zIndex = 100 - idx;
              pointerEvents = "none";
            }

            const accentColor = scene.accent || "#9867ff";

            return (
              <div
                key={scene.id || idx}
                className="scroll-portal-frame absolute inset-x-4 sm:inset-x-8 inset-y-2 sm:inset-y-4 rounded-2xl overflow-hidden flex flex-col justify-between"
                style={{
                  borderRadius: `${scene.radius || frameRadius}px`,
                  border: `${frameBorder}px solid ${delta === 0 ? accentColor : "rgba(255,255,255,0.12)"}`,
                  boxShadow:
                    delta === 0
                      ? `0 0 35px -5px ${accentColor}40, 0 25px 60px -15px rgba(0,0,0,0.85)`
                      : `0 15px 40px -10px rgba(0,0,0,0.6)`,
                  background:
                    scene.background ||
                    "linear-gradient(145deg, rgba(17,17,24,0.96) 0%, rgba(10,10,18,0.98) 100%)",
                  transform: `translate3d(0, 0, ${translateZ}px) scale(${scale})`,
                  transformOrigin: "center center",
                  opacity,
                  zIndex,
                  pointerEvents,
                  willChange: "transform, opacity",
                  transition:
                    delta < 0 ? "none" : "border-color 0.4s ease, box-shadow 0.4s ease",
                }}
              >
                {/* Dark depth shading for nested inner frames */}
                <div
                  className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
                  style={{ opacity: dimOpacity }}
                />

                {/* Cybernetic Corner Reticle Target Brackets */}
                <div
                  className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 pointer-events-none transition-colors duration-300"
                  style={{ borderColor: accentColor }}
                />
                <div
                  className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 pointer-events-none transition-colors duration-300"
                  style={{ borderColor: accentColor }}
                />
                <div
                  className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 pointer-events-none transition-colors duration-300"
                  style={{ borderColor: accentColor }}
                />
                <div
                  className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 pointer-events-none transition-colors duration-300"
                  style={{ borderColor: accentColor }}
                />

                {/* Inner Ambient Glow Highlight */}
                <div
                  className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-20"
                  style={{ background: accentColor }}
                />

                {/* Frame Content Header */}
                <div className="relative z-10 p-6 sm:p-9 pb-3">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span
                      className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border"
                      style={{
                        color: accentColor,
                        borderColor: `${accentColor}40`,
                        background: `${accentColor}12`,
                      }}
                    >
                      {scene.tag || `LAYER 0${idx + 1}`}
                    </span>

                    <span className="font-mono text-xs text-gray-400">
                      NESTING DEPTH: {delta > 0 ? `-${delta.toFixed(2)}` : delta < 0 ? `+${(-delta).toFixed(2)}` : "ACTIVE"}
                    </span>
                  </div>

                  <h3 className="font-unbounded font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                    {scene.title}
                  </h3>
                  {scene.subtitle && (
                    <p className="font-mono text-xs sm:text-sm text-gray-400 mt-1">
                      {scene.subtitle}
                    </p>
                  )}
                </div>

                {/* Frame Middle: Rich Content / Visual Chamber or Nested Aperture */}
                <div className="relative z-10 px-6 sm:px-9 py-2 sm:py-4 flex-1 flex flex-col justify-center">
                  {scene.content ? (
                    scene.content
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-7 space-y-4">
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          {scene.description}
                        </p>

                        {scene.tags && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {scene.tags.map((t) => (
                              <span
                                key={t}
                                className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {scene.stats && (
                        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
                          {scene.stats.map((st) => (
                            <div
                              key={st.label}
                              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between sm:flex-col sm:items-start md:flex-row md:items-center"
                            >
                              <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
                                {st.label}
                              </span>
                              <span
                                className="font-mono font-bold text-base sm:text-lg"
                                style={{ color: accentColor }}
                              >
                                {st.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Frame Footer: Status Bar & Interaction prompt */}
                <div className="relative z-10 px-6 sm:px-9 py-4 border-t border-white/10 bg-black/30 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: accentColor }}
                    />
                    <span>SYSTEM PORTAL ACTIVE</span>
                  </div>

                  {idx < sceneCount - 1 ? (
                    <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                      <span>NEXT: {scenes[idx + 1]?.title}</span>
                      <ArrowRight size={13} className="text-violet-400" />
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>DEEPEST ARCHITECTURAL LAYER REACHED</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation & Scroll Indicator HUD */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 z-40 flex items-center justify-between">
          {/* Clickable Scene Jump Pills */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {scenes.map((s, idx) => (
              <button
                key={s.id || idx}
                type="button"
                onClick={() => jumpToScene(idx)}
                className={`px-2.5 py-1 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                  idx === activeIndex
                    ? "bg-violet-500 text-white font-bold shadow-md shadow-violet-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title={`Jump to ${s.title}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          {/* Interactive Scroll Prompt */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-gray-400 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 animate-pulse">
            <span>SCROLL TO FLY THROUGH FRAMES</span>
            <ChevronDown size={14} className="text-violet-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
