import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2, Sparkles } from "lucide-react";
import type { ProjectItem } from "../data/projectsData";

export interface ProjectShowcaseData {
  id: string;
  projectNumber: string;
  title: string;
  category: string;
  year: string;
  subtitle?: string;
  description: string;
  image: string;
  features?: string | string[];
  technologies: string[];
  capabilities?: string;
  githubUrl?: string;
  projectUrl?: string;
  status?: string;
}

export interface ProjectShowcaseCardProps {
  project: ProjectItem;
  isFront?: boolean;
  inCarousel?: boolean;
  onOpenDemo: () => void;
  onOpenArch: () => void;
}

export default function ProjectShowcaseCard({
  project,
  isFront = true,
  inCarousel = false,
  onOpenDemo,
  onOpenArch,
}: ProjectShowcaseCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const categoryTag = `#${project.category
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase()}`;

  const isResearch =
    project.status === "RESEARCH PROJECT" ||
    project.statusBadgeVariant === "cyan-green";
  const isComingSoon = project.status === "COMING SOON";

  const primaryButtonText =
    project.primaryCtaLabel ||
    (isResearch || isComingSoon ? "EXPLORE PROJECT" : "EXPLORE LIVE SYSTEM");

  const secondaryButtonText =
    project.secondaryCtaLabel ||
    (isResearch ? "VIEW RESEARCH & CODE" : "VIEW ARCHITECTURE & CODE");

  const bottomLeftBadge =
    project.imageOverlayLeft ||
    (isComingSoon
      ? "schoolride-lk.dev [COMING SOON]"
      : project.demoUrl.replace(/^https?:\/\//, ""));

  const bottomRightBadge =
    project.imageOverlayRight ||
    (isComingSoon ? "COMING SOON" : isResearch ? "RESEARCH 2026" : "LIVE ↗");

  const featuresList = Array.isArray(project.coreFeatures)
    ? project.coreFeatures.join(" · ")
    : project.coreFeatures;

  const motionProps =
    !inCarousel && !shouldReduceMotion
      ? {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
        }
      : {};

  return (
    <motion.article
      {...motionProps}
      style={{
        background:
          project.cardBg ||
          "linear-gradient(145deg, #0B1726 0%, #071525 60%, #050e1a 100%)",
        borderColor: isFront
          ? project.borderColor || "rgba(0, 217, 255, 0.35)"
          : "rgba(255, 255, 255, 0.14)",
      }}
      className={`glass-card-frosted group/card w-full h-full rounded-[28px] sm:rounded-[32px] ${
        inCarousel ? "p-3 sm:p-4 lg:p-5" : "p-3.5 sm:p-5 lg:p-6"
      } flex flex-col justify-between overflow-hidden relative text-center select-none transition-all duration-300 ${
        !inCarousel
          ? "hover:-translate-y-[5px] hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.88),0_0_30px_rgba(0,217,255,0.2)]"
          : ""
      } ${
        isFront
          ? isResearch
            ? "ring-1 ring-[#00D9FF]/30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85),0_0_24px_rgba(0,217,255,0.14)]"
            : "ring-1 ring-violet-400/30"
          : ""
      }`}
    >
      {/* Subtle Inner Ambient Cyan/Emerald/Violet Flare */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full pointer-events-none blur-3xl opacity-30 transition-opacity duration-300 group-hover/card:opacity-45"
        style={{ background: project.accentColor || "#00D9FF" }}
        aria-hidden="true"
      />

      {/* =================================================================== */}
      {/* 1. TOP HEADER: DUAL HORIZONTAL BADGES + ROLE/YEAR + TITLE/SUBTITLE  */}
      {/* =================================================================== */}
      <div className="relative z-10">
        {/* Top Row: Left Category Badge & Right Status Pill */}
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          <span
            className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-unbounded font-bold uppercase border truncate max-w-[62%]"
            style={{
              background: project.tagBg || "rgba(16, 185, 129, 0.15)",
              color: project.tagColor || "#6ee7b7",
              borderColor:
                project.tagBorderColor ||
                project.borderColor ||
                "rgba(16, 185, 129, 0.45)",
            }}
          >
            {project.badgeCategory || `${project.number} · ${project.domain}`}
          </span>

          {isResearch ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#00D9FF]/12 border border-[#00D9FF]/45 text-[8.5px] sm:text-[9.5px] font-mono font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(0,217,255,0.22)] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_6px_#10B981]" />
              <span>RESEARCH PROJECT</span>
            </span>
          ) : isComingSoon ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[8.5px] sm:text-[9.5px] font-mono font-bold text-emerald-300 shadow-[0_0_12px_rgba(34,197,94,0.3)] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>COMING SOON</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-[8.5px] sm:text-[9.5px] font-mono font-bold text-violet-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{project.year}</span>
            </span>
          )}
        </div>

        {/* Eyebrow, Title & Subtitle */}
        <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
          <div className="flex items-center justify-center gap-1.5 text-violet-300 font-mono text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles
              size={10}
              className="text-violet-400 shrink-0 sm:w-[11px] sm:h-[11px]"
              aria-hidden="true"
            />
            <span className="truncate">
              {project.role} · {project.year}
            </span>
          </div>

          {/* Large Centered Project Title */}
          <h3 className="text-[15.5px] sm:text-[20px] lg:text-[22px] font-black text-white tracking-tight leading-snug font-unbounded px-1">
            {project.title}
          </h3>

          {/* Cyan Uppercase Subtitle */}
          <div
            className="text-[8.5px] sm:text-[10px] font-mono font-bold tracking-[0.11em] sm:tracking-[0.14em] uppercase pt-0.5 px-1 truncate"
            style={{ color: isResearch ? "#00D9FF" : "#67e8f9" }}
          >
            {project.subtitle
              ? project.subtitle
              : `${project.metrics[1]?.value || "<50MS TTFB"} · ${categoryTag}`}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. PROJECT PREVIEW IMAGE WITH 18PX ROUNDED CORNERS & OVERLAY PILLS  */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full aspect-[16/8.6] sm:aspect-[16/9] rounded-[15px] sm:rounded-[18px] overflow-hidden border border-white/15 bg-[#050d18] shadow-[0_8px_24px_rgba(0,0,0,0.6)] mb-2 sm:mb-3.5">
        {!imgLoaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}
        <img
          src={project.screenshot}
          alt={project.imageAlt || `${project.title} system interface preview`}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (typeof img.decode === "function") {
              img.decode().then(() => setImgLoaded(true)).catch(() => setImgLoaded(true));
            } else {
              setImgLoaded(true);
            }
          }}
          decoding="async"
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-300 ease-out group-hover/card:scale-[1.03] ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Subtle Bottom Vignette for Overlay Pill Contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050c16]/85 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Bottom Left & Bottom Right Glassmorphism Overlay Badges */}
        <div className="absolute bottom-1.5 sm:bottom-2.5 left-2 sm:left-2.5 right-2 sm:right-2.5 flex items-center justify-between gap-2 text-[8px] sm:text-[9.5px] font-mono">
          <span
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md backdrop-blur-md border truncate max-w-[65%] font-semibold tracking-wider ${
              isResearch
                ? "bg-[#071525]/85 border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                : "bg-black/75 border-white/15 text-cyan-300"
            }`}
          >
            {bottomLeftBadge}
          </span>

          {isResearch ? (
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#064e3b]/85 backdrop-blur-md border border-[#10B981]/55 text-[#6ee7b7] font-bold tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.35)] shrink-0">
              {bottomRightBadge}
            </span>
          ) : isComingSoon ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/80 backdrop-blur-md border border-emerald-400/50 text-white font-bold tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.4)] shrink-0">
              {bottomRightBadge}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-violet-600/80 backdrop-blur-md border border-violet-400/40 text-white font-bold shrink-0">
              {bottomRightBadge}
            </span>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. FOUR CENTERED INFORMATION SECTIONS WITH HAIRLINE DIVIDERS        */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-0.5 sm:space-y-1 mb-2.5 sm:mb-3.5">
        {/* Section 01 – PROJECT OVERVIEW / SYSTEM ARCHITECTURE */}
        <div className="py-1 sm:py-1.5 border-t border-white/10">
          <div className="text-[7.5px] sm:text-[9px] font-unbounded tracking-widest uppercase text-[#94A3B8] font-bold mb-0.5">
            {project.overviewLabel || "SYSTEM ARCHITECTURE"}
          </div>
          <p className="text-[9.5px] sm:text-[11.5px] line-clamp-3 leading-snug sm:leading-relaxed px-1 font-normal text-slate-200">
            {project.shortDescription || project.description}
          </p>
        </div>

        {/* Section 02 – CORE FEATURES */}
        {featuresList && (
          <div className="py-1 sm:py-1.5 border-t border-white/10">
            <div className="text-[7.5px] sm:text-[9px] font-unbounded tracking-widest uppercase text-[#94A3B8] font-bold mb-0.5">
              CORE FEATURES
            </div>
            <div className="text-[9px] sm:text-[11px] font-mono text-[#34d399] font-semibold tracking-wide leading-snug px-1 break-words">
              {featuresList}
            </div>
          </div>
        )}

        {/* Section 03 – PRIMARY TECH STACK / PRIMARY ARSENAL */}
        <div className="py-1 sm:py-1.5 border-t border-white/10">
          <div className="text-[7.5px] sm:text-[9px] font-unbounded tracking-widest uppercase text-[#94A3B8] font-bold mb-0.5">
            {project.techStackLabel || "PRIMARY ARSENAL"}
          </div>
          <div className="text-[9px] sm:text-[11px] font-mono text-violet-300 font-semibold tracking-wide leading-snug px-1 break-words">
            {project.technologies.slice(0, 6).join(" · ")}
          </div>
        </div>

        {/* Section 04 – RESEARCH CAPABILITIES / SYSTEM CAPABILITIES */}
        <div className="py-1 sm:py-1.5 border-t border-b border-white/10">
          <div className="text-[7.5px] sm:text-[9px] font-unbounded tracking-widest uppercase text-[#94A3B8] font-bold mb-0.5">
            {project.capabilitiesLabel || "PRODUCTION IMPACT"}
          </div>
          <div
            className="text-[9px] sm:text-[10.5px] font-mono font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase leading-snug px-1 break-words"
            style={{ color: isResearch ? "#00D9FF" : "#67e8f9" }}
          >
            {project.capabilitiesText ||
              project.metrics
                .map((m) => `${m.value} ${m.label.split(" ")[0]}`)
                .join(" ✦ ")}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. TWO FULL-WIDTH PILL ACTION BUTTONS                               */}
      {/* =================================================================== */}
      <div className="relative z-10 space-y-1.5 sm:space-y-2">
        {/* Primary Button: White Pill with Black Bold Text & Arrow ↗ */}
        {isResearch || isComingSoon || !project.liveUrl || project.liveUrl.endsWith("/dinidu") ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDemo();
            }}
            className="glass-pill-white-3d group/btn w-full min-h-[42px] sm:min-h-[48px] py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-slate-950 font-unbounded font-bold text-[9.5px] min-[375px]:text-[10px] sm:text-[11px] tracking-[0.03em] sm:tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-md transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,255,255,0.28)] whitespace-nowrap"
          >
            <span>{primaryButtonText}</span>
            <ArrowUpRight
              size={14}
              className="shrink-0 stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </button>
        ) : (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="glass-pill-white-3d group/btn w-full min-h-[42px] sm:min-h-[48px] py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-slate-950 font-unbounded font-bold text-[9.5px] min-[375px]:text-[10px] sm:text-[11px] tracking-[0.03em] sm:tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-md transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,255,255,0.28)] whitespace-nowrap"
          >
            <span>{primaryButtonText}</span>
            <ArrowUpRight
              size={14}
              className="shrink-0 stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </a>
        )}

        {/* Secondary Button: Transparent Dark Pill with Gray-Purple Border & Light Lavender Text */}
        {project.sourceUrl && !project.sourceUrl.endsWith("/dinidu") ? (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="glass-pill-dark-3d w-full min-h-[40px] sm:min-h-[46px] py-2 px-4 sm:px-5 rounded-full text-violet-200 hover:text-white font-unbounded font-semibold text-[9px] min-[375px]:text-[9.5px] sm:text-[10.5px] tracking-[0.03em] sm:tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-300 hover:border-[#00D9FF]/45 whitespace-nowrap"
          >
            <Code2 size={13} className="shrink-0 text-violet-300" />
            <span>{secondaryButtonText}</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenArch();
            }}
            className="glass-pill-dark-3d w-full min-h-[40px] sm:min-h-[46px] py-2 px-4 sm:px-5 rounded-full text-violet-200 hover:text-white font-unbounded font-semibold text-[9px] min-[375px]:text-[9.5px] sm:text-[10.5px] tracking-[0.03em] sm:tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-300 hover:border-[#00D9FF]/45 whitespace-nowrap"
          >
            <Code2 size={13} className="shrink-0 text-violet-300" />
            <span>{secondaryButtonText}</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
