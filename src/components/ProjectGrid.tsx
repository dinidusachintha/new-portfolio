import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useScroll } from "framer-motion";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  Orbit,
} from "lucide-react";
import {
  projectsData,
  type ProjectItem,
  type ProjectDomain,
} from "../data/projectsData";
import { projects, type Project } from "../data/portfolio";
import ProjectCard from "./ProjectCard";
import ProjectShowcaseCard from "./ProjectShowcaseCard";

type FilterCategory = "All" | ProjectDomain;
type ViewMode = "carousel" | "stack" | "grid";

const DOMAIN_FILTERS: { label: string; value: FilterCategory }[] = [
  { label: "All Systems", value: "All" },
  { label: "Full Stack", value: "Full Stack" },
  { label: "Cloud & Backend", value: "Cloud & Backend" },
  { label: "AI & Media", value: "AI & Media" },
];

export default function ProjectGrid({
  onSelect,
}: {
  onSelect: (project: Project, tab?: "demo" | "arch") => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const cardWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [selectedDomain, setSelectedDomain] = useState<FilterCategory>("All");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  // Pause carousel rotation loop when off-screen to preserve CPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "250px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll progress for Stacked Cards view
  const { scrollYProgress } = useScroll({
    target: stackContainerRef,
    offset: ["start start", "end end"],
  });

  // Filtered projects based on selected domain
  const filteredProjects = useMemo(() => {
    if (selectedDomain === "All") return projectsData;
    return projectsData.filter((p) => p.domain === selectedDomain);
  }, [selectedDomain]);

  // Smooth lerp and drag tracking for 3D carousel
  const targetAngleRef = useRef(0);
  const angleRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const hasMovedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Responsive stage geometry for 3D carousel
  const [stageDimensions, setStageDimensions] = useState({
    rx: 450,
    rz: 390,
    cardW: 400,
  });
  const stageDimRef = useRef(stageDimensions);
  stageDimRef.current = stageDimensions;

  const totalCards = filteredProjects.length;
  const stepAngle = (2 * Math.PI) / Math.max(1, totalCards);

  const applyCardTransforms = useCallback(
    (currentAngle: number) => {
      const { rx, rz } = stageDimRef.current;
      for (let i = 0; i < totalCards; i++) {
        const el = cardWrapRefs.current[i];
        if (!el) continue;
        const cardAngle = currentAngle + i * stepAngle;
        let delta =
          ((cardAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        if (delta > Math.PI) delta -= 2 * Math.PI;

        const sinDelta = Math.sin(delta);
        const cosDelta = Math.cos(delta);

        const x = sinDelta * rx;
        const z = (cosDelta - 1) * rz;

        const normDepth = (cosDelta + 1) / 2;
        const scale = 0.72 + 0.28 * normDepth;
        const opacity = 0.34 + 0.66 * normDepth;
        const rotY = -sinDelta * 26;
        const zIndex = Math.round(10 + normDepth * 50);

        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.zIndex = `${zIndex}`;
        el.style.opacity = `${opacity.toFixed(3)}`;
      }
    },
    [stepAngle, totalCards]
  );

  // Reset carousel angle when filter changes
  useEffect(() => {
    angleRef.current = 0;
    targetAngleRef.current = 0;
    activeIndexRef.current = 0;
    setActiveIndex(0);
    applyCardTransforms(0);
  }, [selectedDomain, applyCardTransforms]);

  // Responsive stage dimensions (Mobile, Tablet, Desktop)
  useEffect(() => {
    const updateDimensions = () => {
      const w = containerRef.current?.offsetWidth || window.innerWidth;
      let nextDim;
      if (w < 480) {
        nextDim = {
          rx: Math.min(115, w * 0.28),
          rz: 195,
          cardW: Math.min(320, w - 24),
        };
      } else if (w < 640) {
        nextDim = {
          rx: Math.min(160, w * 0.35),
          rz: 235,
          cardW: Math.min(346, w - 28),
        };
      } else if (w < 1024) {
        nextDim = {
          rx: Math.min(330, w * 0.43),
          rz: 320,
          cardW: Math.min(372, w * 0.82),
        };
      } else {
        nextDim = {
          rx: Math.min(465, w * 0.44),
          rz: 405,
          cardW: 402,
        };
      }
      stageDimRef.current = nextDim;
      setStageDimensions(nextDim);
      applyCardTransforms(angleRef.current);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => window.removeEventListener("resize", updateDimensions);
  }, [applyCardTransforms]);

  // Smooth continuous rotation & sliding loop
  useEffect(() => {
    if (viewMode !== "carousel" || totalCards <= 1 || !isVisible) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      let moved = false;
      if (!isDraggingRef.current && !document.hidden) {
        if (isPlaying && !isHovered) {
          const autoSpeed = 0.00016;
          angleRef.current =
            (angleRef.current + autoSpeed * delta) % (Math.PI * 2);
          targetAngleRef.current = angleRef.current;
          moved = true;
        } else {
          const diff = targetAngleRef.current - angleRef.current;
          if (Math.abs(diff) > 0.0005) {
            angleRef.current += diff * 0.12;
            moved = true;
          }
        }
      }

      if (moved) {
        applyCardTransforms(angleRef.current);

        // Compute which card is frontmost and update state ONLY when it changes
        const normalizedAngle =
          ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const closestIdx =
          (Math.round(totalCards - normalizedAngle / stepAngle) % totalCards +
            totalCards) %
          totalCards;
        if (closestIdx !== activeIndexRef.current) {
          activeIndexRef.current = closestIdx;
          setActiveIndex(closestIdx);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    applyCardTransforms(angleRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      } else {
        if (!animFrameRef.current) {
          lastTimeRef.current = null;
          animFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, [
    isPlaying,
    isHovered,
    viewMode,
    stepAngle,
    totalCards,
    isVisible,
    applyCardTransforms,
  ]);

  // Pointer drag events for horizontal spinning with inertia & smooth snap
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const pointerVelocityRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = angleRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerVelocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 5) {
      hasMovedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    pointerVelocityRef.current = (e.clientX - lastPointerXRef.current) / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;

    const sensitivity = 0.0035;
    angleRef.current = dragStartAngleRef.current + dx * sensitivity;
    targetAngleRef.current = angleRef.current;
    applyCardTransforms(angleRef.current);

    const normalizedAngle =
      ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const closestIdx =
      (Math.round(totalCards - normalizedAngle / stepAngle) % totalCards +
        totalCards) %
      totalCards;
    if (closestIdx !== activeIndexRef.current) {
      activeIndexRef.current = closestIdx;
      setActiveIndex(closestIdx);
    }
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    if (e) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // safe fallback
      }
    }
    if (isDraggingRef.current) {
      isDraggingRef.current = false;

      // Smooth inertia & snap directly to nearest card
      const vel = pointerVelocityRef.current;
      let snapStep = 0;
      if (Math.abs(vel) > 0.4) {
        snapStep = vel > 0 ? 1 : -1;
      }

      const currentRotations = Math.floor(angleRef.current / (2 * Math.PI));
      const targetBase = -(activeIndexRef.current - snapStep) * stepAngle;
      let newTarget = currentRotations * 2 * Math.PI + targetBase;
      while (newTarget - angleRef.current > Math.PI) newTarget -= 2 * Math.PI;
      while (newTarget - angleRef.current < -Math.PI) newTarget += 2 * Math.PI;

      targetAngleRef.current = newTarget;
    }
  };

  const rotateTo = useCallback(
    (index: number) => {
      const currentRotations = Math.floor(angleRef.current / (2 * Math.PI));
      const targetBase = -index * stepAngle;
      let newTarget = currentRotations * 2 * Math.PI + targetBase;
      while (newTarget - angleRef.current > Math.PI) newTarget -= 2 * Math.PI;
      while (newTarget - angleRef.current < -Math.PI) newTarget += 2 * Math.PI;

      targetAngleRef.current = newTarget;
      setIsPlaying(false);
    },
    [stepAngle]
  );

  const stepNext = useCallback(() => {
    targetAngleRef.current = angleRef.current - stepAngle;
    setIsPlaying(false);
  }, [stepAngle]);

  const stepPrev = useCallback(() => {
    targetAngleRef.current = angleRef.current + stepAngle;
    setIsPlaying(false);
  }, [stepAngle]);

  // Convert ProjectItem to full Project and open modal on requested tab
  const handleSelectProject = useCallback(
    (projectItem: ProjectItem, tab: "demo" | "arch" = "demo") => {
      if (hasMovedRef.current) return;
      setIsPlaying(false);

      const fullProject = projects.find((p) => p.id === projectItem.id);
      if (fullProject) {
        onSelect(fullProject, tab);
        return;
      }

      const fallback: Project = {
        id: projectItem.id,
        index: projectItem.number,
        title: projectItem.title,
        kind: `${projectItem.category} · ${projectItem.domain}`,
        category:
          projectItem.domain === "AI & Media"
            ? "Full Stack"
            : projectItem.domain,
        year: projectItem.year,
        summary: projectItem.shortDescription,
        image: projectItem.screenshot,
        mockupImage: projectItem.screenshot,
        accent: projectItem.accentColor,
        stack: projectItem.technologies,
        metrics: projectItem.metrics,
        problem: projectItem.problem || projectItem.description,
        solution: projectItem.solution || projectItem.shortDescription,
        architecture: projectItem.architecture || projectItem.description,
        highlights: projectItem.highlights,
        role: projectItem.role,
        liveUrl: projectItem.liveUrl,
        sourceUrl: projectItem.sourceUrl,
      };
      onSelect(fallback, tab);
    },
    [onSelect]
  );

  return (
    <div
      ref={containerRef}
      className="project-orbit-master-wrap relative w-full pt-1 pb-6 select-none"
    >
      {/* ===================================================================== */}
      {/* UNIFIED DARK OBSIDIAN COMMAND BAR: DOMAIN FILTERS + VIEW MODES        */}
      {/* ===================================================================== */}
      <div className="project-command-bar flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-4 p-2 sm:p-3.5 rounded-2xl sm:rounded-full mb-5 sm:mb-8">
        {/* Left: Domain Filter Pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 no-scrollbar snap-x snap-mandatory"
          role="tablist"
          aria-label="Filter projects by architectural domain"
        >
          {DOMAIN_FILTERS.map((f) => {
            const count =
              f.value === "All"
                ? projectsData.length
                : projectsData.filter((p) => p.domain === f.value).length;
            const active = selectedDomain === f.value;
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedDomain(f.value)}
                className={`snap-start inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 min-h-[38px] sm:min-h-[44px] rounded-full font-unbounded text-[9.5px] sm:text-[11px] tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-gradient-to-r from-[#9867ff] to-[#6366f1] text-white font-bold shadow-[0_0_20px_rgba(152,103,255,0.45)] border border-violet-400/50"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent font-medium"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-mono ${
                    active
                      ? "bg-black/30 text-violet-100"
                      : "bg-white/[0.07] text-slate-400"
                  }`}
                >
                  0{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: 3-Mode View Switcher */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 p-1 rounded-xl sm:rounded-full bg-black/55 border border-white/10 font-unbounded text-[9px] min-[375px]:text-[9.5px] sm:text-[11px] w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("carousel")}
            className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 min-h-[38px] sm:min-h-[44px] rounded-lg sm:rounded-full transition-all cursor-pointer whitespace-nowrap ${
              viewMode === "carousel"
                ? "bg-white text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white font-medium"
            }`}
            title="Interactive 3D Rotating Glass Deck"
          >
            <Orbit size={12} className="shrink-0 hidden min-[360px]:inline-block sm:w-[13px] sm:h-[13px]" />
            <span>3D Carousel</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("stack")}
            className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 min-h-[38px] sm:min-h-[44px] rounded-lg sm:rounded-full transition-all cursor-pointer whitespace-nowrap ${
              viewMode === "stack"
                ? "bg-white text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white font-medium"
            }`}
            title="Scroll-Driven Stacking Multi-Device Case Studies"
          >
            <Layers size={12} className="shrink-0 hidden min-[360px]:inline-block sm:w-[13px] sm:h-[13px]" />
            <span>Stacked</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 min-h-[38px] sm:min-h-[44px] rounded-lg sm:rounded-full transition-all cursor-pointer whitespace-nowrap ${
              viewMode === "grid"
                ? "bg-white text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white font-medium"
            }`}
            title="Responsive 3-Column Editorial Glass Grid"
          >
            <LayoutGrid size={12} className="shrink-0 hidden min-[360px]:inline-block sm:w-[13px] sm:h-[13px]" />
            <span>Glass Grid</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW MODE 1: 3D ROTATING FROSTED GLASS CAROUSEL                       */}
      {/* ===================================================================== */}
      {viewMode === "carousel" && (
        <div
          className="glass-project-stage relative w-full h-[640px] sm:h-[790px] lg:h-[835px] rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/15 overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl flex flex-col justify-between touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            handlePointerUp();
            setIsHovered(false);
          }}
          onPointerEnter={() => setIsHovered(true)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              stepPrev();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              stepNext();
            }
          }}
          aria-label="Interactive project carousel. Use Left and Right arrow keys or swipe to rotate."
        >
          {/* Matching Portfolio Electric Violet & Cyber Cyan Bokeh Lighting Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 68% 55% at 50% 42%, rgba(152, 103, 255, 0.18) 0%, rgba(56, 189, 248, 0.1) 45%, rgba(7, 9, 16, 0.96) 80%, #05060b 100%)",
            }}
          />

          {/* Floating Violet & Cyan Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-violet-500/15 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/12 blur-[95px] pointer-events-none" />

          {/* Top Rotation Controls Bar (Centered Pill on Mobile, Top-Right on Desktop) */}
          <div className="relative z-30 flex items-center justify-center sm:justify-end px-4 sm:px-8 pt-3.5 sm:pt-5 pb-1 pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/12 shadow-lg">
              <button
                type="button"
                onClick={stepPrev}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-violet-500/25 border border-white/10 hover:border-violet-400/50 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Previous System Card"
                aria-label="Previous system card"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-8 sm:h-9 rounded-full bg-white/[0.06] hover:bg-violet-500/20 border border-white/10 hover:border-violet-400/50 text-white transition-all cursor-pointer hover:scale-105 active:scale-95 font-unbounded"
                title={isPlaying ? "Pause Rotation" : "Resume Smooth Rotation"}
              >
                {isPlaying ? (
                  <Pause size={11} className="text-violet-400 shrink-0" />
                ) : (
                  <Play
                    size={11}
                    className="text-violet-400 fill-current ml-0.5 shrink-0"
                  />
                )}
                <span className="text-[9px] sm:text-[10.5px] font-bold tracking-wider whitespace-nowrap">
                  {isPlaying ? "PAUSE ORBIT" : "AUTO ORBIT"}
                </span>
              </button>

              <button
                type="button"
                onClick={stepNext}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-violet-500/25 border border-white/10 hover:border-violet-400/50 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Next System Card"
                aria-label="Next system card"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* 3D Perspective Stage */}
          <div
            className="relative w-full flex-1 flex items-center justify-center pointer-events-none my-1 sm:my-2"
            style={{ perspective: "1350px" }}
          >
            {filteredProjects.map((project, index) => {
              const cardAngle = angleRef.current + index * stepAngle;
              let delta =
                ((cardAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
              if (delta > Math.PI) delta -= 2 * Math.PI;

              const sinDelta = Math.sin(delta);
              const cosDelta = Math.cos(delta);

              const x = sinDelta * stageDimensions.rx;
              const z = (cosDelta - 1) * stageDimensions.rz;

              const normDepth = (cosDelta + 1) / 2;
              const scale = 0.72 + 0.28 * normDepth;
              const opacity = 0.34 + 0.66 * normDepth;
              const rotY = -sinDelta * 26;
              const zIndex = Math.round(10 + normDepth * 50);
              const isFrontCard = activeIndex === index || totalCards === 1;

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardWrapRefs.current[index] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasMovedRef.current) return;
                    if (!isFrontCard) {
                      rotateTo(index);
                    } else {
                      handleSelectProject(project, "demo");
                    }
                  }}
                  className="absolute pointer-events-auto cursor-pointer transition-shadow duration-300 flex items-center justify-center"
                  style={{
                    width: `${stageDimensions.cardW}px`,
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                    zIndex,
                    opacity,
                    transformOrigin: "center center",
                  }}
                >
                  <ProjectShowcaseCard
                    project={project}
                    isFront={isFrontCard}
                    inCarousel
                    onOpenDemo={() => handleSelectProject(project, "demo")}
                    onOpenArch={() => handleSelectProject(project, "arch")}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Centered Progress Indicator Pills */}
          <div className="relative z-30 flex items-center justify-center px-4 pt-1 pb-3 sm:pb-5 pointer-events-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 shadow-lg">
              {filteredProjects.map((proj, idx) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => rotateTo(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-[#9867ff] shadow-[0_0_14px_rgba(152,103,255,0.9)]"
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/25 hover:bg-white/60"
                  }`}
                  title={`${proj.number} — ${proj.title}`}
                  aria-label={`Rotate to ${proj.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW MODE 2: SCROLL-DRIVEN STACKING MULTI-DEVICE SHOWCASE             */}
      {/* ===================================================================== */}
      {viewMode === "stack" && (
        <div className="project-stacked-wrapper">
          <div ref={stackContainerRef} className="project-stacked-container">
            {filteredProjects.map((project, index) => {
              const step = 1 / Math.max(1, filteredProjects.length);
              const rangeStart = index * step;
              const targetScale = Math.max(
                0.88,
                1 - (filteredProjects.length - index - 1) * 0.025
              );

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  total={filteredProjects.length}
                  progress={scrollYProgress}
                  range={[rangeStart, 1]}
                  targetScale={targetScale}
                  onSelect={(item, tab) => handleSelectProject(item, tab)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW MODE 3: RESPONSIVE 3-COLUMN FROSTED GLASS BENTO GRID             */}
      {/* ===================================================================== */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 items-stretch">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project, "demo")}
              className="w-full h-full cursor-pointer flex"
            >
              <ProjectShowcaseCard
                project={project}
                isFront
                onOpenDemo={() => handleSelectProject(project, "demo")}
                onOpenArch={() => handleSelectProject(project, "arch")}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
