import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useScroll } from "framer-motion";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  LayoutGrid,
  Layers,
  Sparkles,
  Orbit,
} from "lucide-react";
import {
  projectsData,
  type ProjectItem,
  type ProjectDomain,
} from "../data/projectsData";
import { projects, type Project } from "../data/portfolio";
import ProjectCard from "./ProjectCard";

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

  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [selectedDomain, setSelectedDomain] = useState<FilterCategory>("All");
  const [isPlaying, setIsPlaying] = useState(true);
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const totalCards = filteredProjects.length;
  const stepAngle = (2 * Math.PI) / Math.max(1, totalCards);

  // Reset carousel angle when filter changes
  useEffect(() => {
    angleRef.current = 0;
    targetAngleRef.current = 0;
    setAngle(0);
    setActiveIndex(0);
  }, [selectedDomain]);

  // Responsive stage dimensions (Mobile, Tablet, Desktop)
  useEffect(() => {
    const updateDimensions = () => {
      const w = containerRef.current?.offsetWidth || window.innerWidth;
      if (w < 480) {
        setStageDimensions({
          rx: Math.min(125, w * 0.34),
          rz: 185,
          cardW: Math.min(312, w - 24),
        });
      } else if (w < 640) {
        setStageDimensions({
          rx: Math.min(175, w * 0.4),
          rz: 225,
          cardW: Math.min(340, w - 32),
        });
      } else if (w < 1024) {
        setStageDimensions({
          rx: Math.min(330, w * 0.43),
          rz: 320,
          cardW: Math.min(372, w * 0.82),
        });
      } else {
        setStageDimensions({
          rx: Math.min(465, w * 0.44),
          rz: 405,
          cardW: 402,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Smooth continuous rotation loop
  useEffect(() => {
    if (viewMode !== "carousel" || totalCards <= 1) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isDraggingRef.current) {
        if (isPlaying && !isHovered) {
          const autoSpeed = 0.00016;
          angleRef.current =
            (angleRef.current + autoSpeed * delta) % (Math.PI * 2);
          targetAngleRef.current = angleRef.current;
          setAngle(angleRef.current);
        } else {
          const diff = targetAngleRef.current - angleRef.current;
          if (Math.abs(diff) > 0.0005) {
            angleRef.current += diff * 0.095;
            setAngle(angleRef.current);
          }
        }
      }

      // Compute which card is frontmost
      const normalizedAngle =
        ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const closestIdx =
        Math.round(totalCards - normalizedAngle / stepAngle) % totalCards;
      setActiveIndex((closestIdx + totalCards) % totalCards);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, [isPlaying, isHovered, viewMode, stepAngle, totalCards]);

  // Pointer drag events for horizontal spinning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = angleRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 5) {
      hasMovedRef.current = true;
    }
    const sensitivity = 0.0038;
    angleRef.current = dragStartAngleRef.current + dx * sensitivity;
    targetAngleRef.current = angleRef.current;
    setAngle(angleRef.current);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
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
      <div className="project-command-bar flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-full mb-6 sm:mb-8">
        {/* Left: Domain Filter Pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 no-scrollbar"
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
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-unbounded text-[10px] sm:text-[11px] tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-gradient-to-r from-[#9867ff] to-[#6366f1] text-white font-bold shadow-[0_0_20px_rgba(152,103,255,0.45)] border border-violet-400/50"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent font-medium"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
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
        <div className="grid grid-cols-3 sm:flex items-center gap-1 p-1 rounded-xl sm:rounded-full bg-black/50 border border-white/10 font-unbounded text-[10px] sm:text-[11px] w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("carousel")}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-full transition-all cursor-pointer ${
              viewMode === "carousel"
                ? "bg-white text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white font-medium"
            }`}
            title="Interactive 3D Rotating Glass Deck"
          >
            <Orbit size={13} className="shrink-0" />
            <span className="truncate">3D Carousel</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("stack")}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-full transition-all cursor-pointer ${
              viewMode === "stack"
                ? "bg-white text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white font-medium"
            }`}
            title="Scroll-Driven Stacking Multi-Device Case Studies"
          >
            <Layers size={13} className="shrink-0" />
            <span className="truncate">Stacked</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-full transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white font-medium"
            }`}
            title="Responsive 3-Column Editorial Glass Grid"
          >
            <LayoutGrid size={13} className="shrink-0" />
            <span className="truncate">Glass Grid</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW MODE 1: 3D ROTATING FROSTED GLASS CAROUSEL                       */}
      {/* ===================================================================== */}
      {viewMode === "carousel" && (
        <div
          className="glass-project-stage relative w-full h-[610px] sm:h-[720px] lg:h-[760px] rounded-[1.75rem] sm:rounded-[2.5rem] border border-white/15 overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl flex flex-col justify-between touch-pan-y"
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
          aria-label="3D interactive project carousel. Use Left and Right arrow keys or drag to rotate."
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

          {/* Top-Right Rotation Controls Only (Clean, Minimalist) */}
          <div className="relative z-30 flex items-center justify-end gap-2 px-4 sm:px-8 pt-4 sm:pt-6 pointer-events-auto">
            <button
              type="button"
              onClick={stepPrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-violet-500/25 border border-white/15 hover:border-violet-400/50 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Previous System Card"
              aria-label="Previous system card"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] hover:bg-violet-500/20 border border-white/15 hover:border-violet-400/50 text-white transition-all cursor-pointer hover:scale-105 active:scale-95 font-unbounded"
              title={isPlaying ? "Pause Rotation" : "Resume Smooth Rotation"}
            >
              {isPlaying ? (
                <Pause size={12} className="text-violet-400" />
              ) : (
                <Play
                  size={12}
                  className="text-violet-400 fill-current ml-0.5"
                />
              )}
              <span className="text-[9.5px] sm:text-[10.5px] font-bold tracking-wider">
                {isPlaying ? "PAUSE ORBIT" : "AUTO ORBIT"}
              </span>
            </button>

            <button
              type="button"
              onClick={stepNext}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-violet-500/25 border border-white/15 hover:border-violet-400/50 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Next System Card"
              aria-label="Next system card"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 3D Perspective Stage */}
          <div
            className="relative w-full flex-1 flex items-center justify-center pointer-events-none"
            style={{ perspective: "1350px" }}
          >
            {filteredProjects.map((project, index) => {
              const cardAngle = angle + index * stepAngle;
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
              const isFrontCard = normDepth > 0.92 || totalCards === 1;

              return (
                <div
                  key={project.id}
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
                    transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transformOrigin: "center center",
                  }}
                >
                  <GlassCardItem
                    project={project}
                    isFront={isFrontCard}
                    onOpenDemo={() => handleSelectProject(project, "demo")}
                    onOpenArch={() => handleSelectProject(project, "arch")}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Centered Progress Indicator Pills */}
          <div className="relative z-30 flex items-center justify-center px-4 pb-4 sm:pb-6 pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              {filteredProjects.map((proj, idx) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => rotateTo(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? "w-8 h-2.5 bg-[#9867ff] shadow-[0_0_14px_rgba(152,103,255,0.9)]"
                      : "w-2.5 h-2.5 bg-white/25 hover:bg-white/60"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project, "demo")}
              className="w-full cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
            >
              <GlassCardItem
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

// =============================================================================
// REUSABLE LUXURY FROSTED GLASS EFFECT CARD COMPONENT (OBSIDIAN + VIOLET/CYAN)
// =============================================================================
function GlassCardItem({
  project,
  isFront,
  onOpenDemo,
  onOpenArch,
}: {
  project: ProjectItem;
  isFront: boolean;
  onOpenDemo: () => void;
  onOpenArch: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const categoryTag = `#${project.category
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase()}`;

  return (
    <article
      style={{
        background: project.cardBg,
        borderColor: isFront ? project.borderColor : "rgba(255, 255, 255, 0.14)",
      }}
      className={`glass-card-frosted w-full rounded-[1.6rem] sm:rounded-[2.15rem] p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative text-center select-none ${
        isFront ? "ring-1 ring-violet-400/30" : ""
      }`}
    >
      {/* Subtle Inner Ambient Violet/Cyan Flare */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-35"
        style={{ background: project.accentColor }}
      />

      {/* Top Index & Live Status Corner Pills */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
        <span
          className="px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-unbounded font-bold uppercase border"
          style={{
            background: project.tagBg,
            color: project.tagColor,
            borderColor: project.borderColor,
          }}
        >
          {project.number} · {project.domain}
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-[9.5px] font-mono font-bold text-violet-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{project.year}</span>
        </span>
      </div>

      {/* 1. TOP HEADER WITH UNBOUNDED FONT */}
      <div className="relative z-10 space-y-1 mb-2.5 sm:mb-3">
        <div className="flex items-center justify-center gap-1.5 text-violet-300 font-mono text-[10.5px] sm:text-xs font-semibold tracking-wider uppercase">
          <Sparkles size={12} className="text-violet-400 shrink-0" />
          <span className="truncate">{project.role}</span>
        </div>

        {/* Project Title in Unbounded Font */}
        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug font-unbounded">
          {project.title}
        </h3>

        {/* Latency & Category Badge */}
        <div className="text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-widest uppercase text-cyan-300 pt-0.5">
          {project.metrics[1]?.value || "<50MS TTFB"} · {categoryTag}
        </div>
      </div>

      {/* 2. FROSTED SCREENSHOT PREVIEW FRAME */}
      <div className="relative z-10 w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-inner mb-3 sm:mb-3.5 group/img">
        {!imgLoaded && <div className="skeleton absolute inset-0" />}
        <img
          src={project.screenshot}
          alt={`${project.title} system interface preview`}
          onLoad={() => setImgLoaded(true)}
          decoding="async"
          className={`w-full h-full object-cover object-top transition-all duration-500 group-hover/img:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070810]/85 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono text-slate-200">
          <span className="px-2 py-0.5 rounded bg-black/70 border border-white/15 text-cyan-300 truncate max-w-[65%]">
            {project.demoUrl.replace(/^https?:\/\//, "")}
          </span>
          <span className="px-2 py-0.5 rounded bg-violet-600/80 border border-violet-400/40 text-white font-bold">
            LIVE ↗
          </span>
        </div>
      </div>

      {/* 3. STRUCTURED METADATA WITH HAIRLINE DIVIDERS */}
      <div className="relative z-10 space-y-1.5 sm:space-y-2 mb-3.5 sm:mb-4">
        {/* Row 1: SYSTEM ARCHITECTURE */}
        <div className="py-1 sm:py-1.5 border-t border-white/10">
          <div className="text-[9px] sm:text-[9.5px] font-unbounded tracking-widest uppercase text-slate-400 font-bold mb-0.5">
            SYSTEM ARCHITECTURE
          </div>
          <p
            className="text-[11px] sm:text-xs line-clamp-2 leading-relaxed px-1 font-normal"
            style={{ color: "#e2e8f0" }}
          >
            {project.shortDescription || project.description}
          </p>
        </div>

        {/* Row 2: CORE TECHNOLOGIES */}
        <div className="py-1 sm:py-1.5 border-t border-white/10">
          <div className="text-[9px] sm:text-[9.5px] font-unbounded tracking-widest uppercase text-slate-400 font-bold mb-0.5">
            PRIMARY ARSENAL
          </div>
          <div className="text-[10.5px] sm:text-[11px] font-mono text-violet-300 font-semibold tracking-wide truncate px-1">
            {project.technologies.slice(0, 5).join(" · ")}
          </div>
        </div>

        {/* Row 3: PRODUCTION IMPACT */}
        <div className="py-1 sm:py-1.5 border-t border-b border-white/10">
          <div className="text-[9px] sm:text-[9.5px] font-unbounded tracking-widest uppercase text-slate-400 font-bold mb-0.5">
            PRODUCTION IMPACT
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-cyan-300 font-bold tracking-wider truncate">
            {project.metrics
              .map((m) => `${m.value} ${m.label.split(" ")[0]}`)
              .join(" ✦ ")}
          </div>
        </div>
      </div>

      {/* 4. TWO PILL ACTION BUTTONS IN MATCHING VIOLET/OBSIDIAN THEME */}
      <div className="relative z-10 space-y-2">
        {/* Top Button: Electric Violet / Indigo Gradient Filled Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDemo();
          }}
          className="glass-pill-violet w-full py-2.5 sm:py-3 px-4 sm:px-5 rounded-full text-white font-unbounded font-bold text-[10px] sm:text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
        >
          <ExternalLink size={13} className="shrink-0" />
          <span>EXPLORE LIVE SYSTEM</span>
        </button>

        {/* Bottom Button: Frosted Glass Outline Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenArch();
          }}
          className="glass-pill-outline w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-white font-unbounded font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Code2 size={13} className="shrink-0 text-violet-300" />
          <span>VIEW ARCHITECTURE & CODE</span>
        </button>
      </div>
    </article>
  );
}
