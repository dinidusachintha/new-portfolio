import { useRef, useState } from "react";
import {
  motion,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink, Play, Sparkles } from "lucide-react";
import type { ProjectItem } from "../data/projectsData";

export interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale?: number;
  onSelect?: (project: ProjectItem, tab?: "demo" | "arch") => void;
}

export default function ProjectCard({
  project,
  index,
  total,
  progress,
  range,
  targetScale = 0.94,
  onSelect,
}: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);

  const isLast = index === total - 1;

  // Stacking transform: scale down to targetScale and dim slightly as next card stacks over
  const rawScale = useTransform(
    progress,
    range,
    isLast ? [1, 1] : [1, targetScale],
    { clamp: true }
  );

  const rawOpacity = useTransform(
    progress,
    range,
    isLast ? [1, 1] : [1, 0.8],
    { clamp: true }
  );

  const scale = shouldReduceMotion ? 1 : rawScale;
  const opacity = shouldReduceMotion ? 1 : rawOpacity;

  // Sticky top offset so each card sticks below navbar and steps down cleanly
  const topOffset = `calc(var(--card-top-base, 74px) + ${index} * var(--card-step, 16px))`;

  // Formatted hashtag category (e.g. #EDTECH, #MARKETPLACE)
  const categoryTag = `#${project.category
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase()}`;

  return (
    <div
      ref={containerRef}
      id={`project-card-${project.id}`}
      className="card-container"
      style={{
        zIndex: index + 10,
        top: topOffset,
        marginBottom: isLast ? "6vh" : "20vh",
      }}
    >
      <motion.article
        style={{
          scale,
          opacity,
          background:
            project.cardBg || "linear-gradient(145deg, #101223 0%, #070811 100%)",
          borderColor: project.borderColor || "rgba(152, 103, 255, 0.28)",
          boxShadow: `0 30px 80px -15px rgba(0, 0, 0, 0.85), 0 0 55px ${
            project.glowColor || "rgba(152, 103, 255, 0.22)"
          }`,
        }}
        className="card-inner w-full max-w-[1220px] rounded-[1.5rem] sm:rounded-[2.25rem] border transition-colors duration-300 overflow-hidden relative"
      >
        {/* Subtle Top Ambient Violet/Cyan Glow */}
        <div
          className="absolute -top-28 -left-24 w-80 h-80 rounded-full pointer-events-none blur-[90px] opacity-30"
          style={{ background: project.accentColor }}
          aria-hidden="true"
        />

        <div className="p-4 sm:p-8 lg:p-11 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
          {/* ============================================================= */}
          {/* LEFT COLUMN: EDITORIAL PROJECT DETAILS & PRODUCTION METRICS   */}
          {/* ============================================================= */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5 w-full">
            {/* Top Metadata Row: Index, Category Hashtag & Live Status */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[9.5px] sm:text-[10px] font-unbounded font-bold tracking-wider uppercase border"
                  style={{
                    background: project.tagBg,
                    color: project.tagColor,
                    borderColor: project.borderColor,
                  }}
                >
                  {project.number} // {categoryTag}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[9.5px] sm:text-[10px] font-mono font-semibold text-slate-300 uppercase">
                  {project.domain}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-[9.5px] sm:text-[10px] font-mono font-bold text-violet-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {project.status} · {project.year}
                </span>
              </div>
            </div>

            {/* Giant Bold Title in Unbounded Font & Architectural Role */}
            <div>
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.12] font-unbounded break-words">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] sm:text-xs font-mono text-violet-300">
                <Sparkles size={12} style={{ color: project.accentColor }} />
                <span>{project.role}</span>
              </div>
            </div>

            {/* Clean Descriptive Summary */}
            <p
              className="text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-xl font-normal"
              style={{ color: "#cbd5e1" }}
            >
              {project.description || project.shortDescription}
            </p>

            {/* 3-Column Production Impact Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-0.5">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
                >
                  <div
                    className="text-xs sm:text-base lg:text-lg font-extrabold font-unbounded tracking-tight"
                    style={{ color: idx === 0 ? project.tagColor : "#ffffff" }}
                  >
                    {m.value}
                  </div>
                  <div className="text-[9.5px] sm:text-[11px] font-mono text-slate-400 leading-tight mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Badges Row: Rounded pills with border */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-violet-400/20 bg-white/[0.04] text-[9.5px] sm:text-[10.5px] font-unbounded font-semibold tracking-wider text-slate-200 uppercase hover:border-violet-400/50 hover:text-white transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons Row (Mobile Responsive) */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1.5 sm:pt-2">
              <button
                type="button"
                onClick={() => onSelect?.(project, "demo")}
                className="glass-pill-violet py-2.5 sm:py-3 px-5 rounded-full text-white font-unbounded font-bold text-[10.5px] sm:text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play size={13} className="fill-current shrink-0" />
                <span>Interactive Live Demo</span>
              </button>

              <button
                type="button"
                onClick={() => onSelect?.(project, "arch")}
                className="glass-pill-outline py-2.5 sm:py-3 px-4 rounded-full text-white font-unbounded font-semibold text-[10.5px] sm:text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Code2 size={14} className="text-violet-300 shrink-0" />
                <span>Architecture & Specs</span>
              </button>

              {project.liveUrl && !project.liveUrl.endsWith("/dinidu") ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-violet-300 hover:text-white font-unbounded font-bold text-[11px] sm:text-xs tracking-wide underline underline-offset-8 decoration-violet-400/50 hover:decoration-white transition-all group/link cursor-pointer bg-transparent border-0 px-2 py-1.5"
                  aria-label={`Visit live site for ${project.title}`}
                >
                  <span>Visit live site</span>
                  <ArrowUpRight
                    size={15}
                    className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                  />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect?.(project, "demo")}
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-violet-300 hover:text-white font-unbounded font-bold text-[11px] sm:text-xs tracking-wide underline underline-offset-8 decoration-violet-400/50 hover:decoration-white transition-all group/link cursor-pointer bg-transparent border-0 px-2 py-1.5"
                  aria-label={`Visit live site for ${project.title}`}
                >
                  <span>Visit live site</span>
                  <ArrowUpRight
                    size={15}
                    className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                  />
                </button>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: MULTI-DEVICE RESPONSIVE MOCKUP SHOWCASE          */}
          {/* ============================================================= */}
          <div className="lg:col-span-6 w-full">
            <div
              className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#171533] via-[#0d1022] to-[#060710] border border-violet-400/20 p-3 sm:p-6 sm:aspect-[4/3] relative flex flex-col items-center justify-between overflow-hidden shadow-2xl group/showcase cursor-pointer min-h-[220px] sm:min-h-[340px]"
              onClick={() => onSelect?.(project, "demo")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(project, "demo");
                }
              }}
              aria-label={`Open interactive simulator for ${project.title}`}
            >
              {/* Dynamic Violet/Cyan Radial Ambient Center Glow */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover/showcase:opacity-100 opacity-85"
                style={{
                  background: `radial-gradient(ellipse at center, ${
                    project.glowColor || "rgba(152,103,255,0.28)"
                  } 0%, transparent 70%)`,
                }}
                aria-hidden="true"
              />

              {/* Top Browser Telemetry Strip inside Showcase */}
              <div className="relative z-20 w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[9.5px] sm:text-[10px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80 shrink-0" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80 shrink-0" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80 shrink-0" />
                  <span className="ml-1 text-cyan-300 font-semibold truncate">
                    {project.demoUrl.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] text-violet-300 font-bold shrink-0">
                  <ExternalLink size={11} />
                  <span className="hidden xs:inline">SANDBOX</span>
                </span>
              </div>

              {/* Multi-Device Mockup Composition */}
              <div className="relative w-full max-w-[460px] flex items-end justify-center py-3 px-1 my-auto">
                {/* 1. Phone Mockup (Front-Left) */}
                <div className="absolute left-0 sm:-left-2 bottom-1 sm:bottom-2 z-20 w-[22%] sm:w-[25%] aspect-[9/18.5] rounded-[11px] sm:rounded-[20px] p-[2.5px] sm:p-[4px] bg-[#16192b] border border-violet-300/30 shadow-[0_15px_30px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover/showcase:-translate-y-1.5">
                  <div className="w-full h-full rounded-[9px] sm:rounded-[16px] overflow-hidden bg-black relative">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 sm:w-5 h-1 sm:h-1.5 bg-black rounded-full z-10" />
                    {!imgLoaded && <div className="skeleton absolute inset-0" />}
                    <img
                      src={project.screenshot}
                      alt={`${project.title} mobile preview`}
                      onLoad={() => setImgLoaded(true)}
                      decoding="async"
                      className={`w-full h-full object-cover object-left-top transition-opacity duration-500 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* 2. Laptop Mockup (Center) */}
                <div className="relative z-10 w-[78%] sm:w-[82%] flex flex-col items-center shadow-[0_20px_45px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover/showcase:scale-[1.03]">
                  {/* Laptop Screen Frame */}
                  <div className="w-full aspect-[16/10] bg-[#101322] rounded-t-lg sm:rounded-t-2xl p-[4px] sm:p-[7px] border-t border-x border-violet-300/25 relative">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-black mx-auto mb-1 opacity-70" />
                    <div className="w-full h-[calc(100%-6px)] sm:h-[calc(100%-8px)] rounded-sm sm:rounded-md overflow-hidden bg-black relative">
                      {!imgLoaded && <div className="skeleton absolute inset-0" />}
                      <img
                        src={project.screenshot}
                        alt={`${project.title} desktop preview`}
                        onLoad={() => setImgLoaded(true)}
                        decoding="async"
                        className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
                          imgLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {/* Laptop Base */}
                  <div className="w-[106%] h-2 sm:h-3.5 bg-gradient-to-b from-[#282c44] to-[#0d101d] rounded-b-md sm:rounded-b-lg border-b border-x border-white/20 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-0.5 sm:h-1 bg-black/60 rounded-b-sm" />
                  </div>
                </div>

                {/* 3. Tablet Mockup (Front-Right) */}
                <div className="absolute right-0 sm:-right-2 bottom-1 sm:bottom-2 z-20 w-[26%] sm:w-[30%] aspect-[3/4.2] rounded-[11px] sm:rounded-[18px] p-[3px] sm:p-[4.5px] bg-[#16192b] border border-violet-300/30 shadow-[0_15px_30px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover/showcase:-translate-y-1.5">
                  <div className="w-full h-full rounded-[8px] sm:rounded-[14px] overflow-hidden bg-black relative">
                    {!imgLoaded && <div className="skeleton absolute inset-0" />}
                    <img
                      src={project.screenshot}
                      alt={`${project.title} tablet preview`}
                      onLoad={() => setImgLoaded(true)}
                      decoding="async"
                      className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Hint Pill */}
              <div className="relative z-20 w-full flex items-center justify-between px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[9.5px] sm:text-[10px] font-mono text-slate-300">
                <span className="truncate">MULTI-DEVICE RESPONSIVE</span>
                <span className="text-violet-300 font-bold group-hover/showcase:text-white transition-colors shrink-0 ml-2">
                  Launch simulator →
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
