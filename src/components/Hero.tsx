import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { asset, profile } from "../data/portfolio";

// Stagger container for the whole name
const nameContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.18,
    },
  },
};

// Flying effect for each individual letter
const letterVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: i % 2 === 0 ? -45 : 45,
    x: (i - 7) * 5,
    scale: 0.6,
    rotateZ: i % 2 === 0 ? -10 : 10,
    filter: "blur(10px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotateZ: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const [diniduChars, setDiniduChars] = useState<string[]>(() => "DINIDU".split(""));
  const [sachinthaChars, setSachinthaChars] = useState<string[]>(() => "SACHINTHA".split(""));
  const [isGlitching, setIsGlitching] = useState(false);

  // Trigger high-speed RGB hacker scramble glitch
  const triggerGlitch = () => {
    if (isGlitching || shouldReduceMotion) return;
    setIsGlitching(true);

    const GLYPHS = "01X#_<>!?*/+~$%&";
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDiniduChars("DINIDU".split("").map((c) => (Math.random() < 0.4 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c)));
      setSachinthaChars("SACHINTHA".split("").map((c) => (Math.random() < 0.4 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c)));

      if (count >= 5) {
        clearInterval(interval);
        setDiniduChars("DINIDU".split(""));
        setSachinthaChars("SACHINTHA".split(""));
        setIsGlitching(false);
      }
    }, 65);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {
        // Auto-play policy catch fallback
      });
    }

    // Subtle photo parallax on scroll (disabled under prefers-reduced-motion)
    if (!shouldReduceMotion) {
      let rafId = 0;
      const handleScroll = () => {
        if (!portraitWrapRef.current) return;
        const scrollY = window.scrollY;
        if (scrollY < 900) {
          portraitWrapRef.current.style.transform = `translate3d(-50%, ${scrollY * 0.12}px, 0)`;
        }
      };

      const onScrollThrottled = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(handleScroll);
      };

      window.addEventListener("scroll", onScrollThrottled, { passive: true });

      // Periodic gentle micro-glitch trigger
      const glitchTimer = setInterval(() => {
        if (Math.random() > 0.45) {
          triggerGlitch();
        }
      }, 7000);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScrollThrottled);
        clearInterval(glitchTimer);
      };
    }
  }, [shouldReduceMotion]);

  return (
    <section className="hero-dymas-section container" id="home">
      {/* Outer Liquid Obsidian Mockup Frame with Cinematic Landing Animation */}
      <motion.div
        className="hero-dymas-mockup-wrapper"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Inner Luminous Pure Black Hero Card Canvas */}
        <div className="hero-dymas-frame">
          {/* Top Bar: Minimalist System & Architecture Identifier */}
          <motion.div
            className="hero-dymas-topbar"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left: Minimalist System & Architecture Identifier */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <Sparkles size={13} className="text-violet-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs text-slate-300 font-semibold tracking-wider uppercase">
                Systems Architect <span className="text-white/30">✦</span> Full Stack
              </span>
            </div>
          </motion.div>

          {/* Central Visual Stage */}
          <div className="hero-dymas-stage">
            {/* Centered Live Video/Photo Portrait with Radial Violet Glow & Two-Axis Mask Fade */}
            <motion.div
              ref={portraitWrapRef}
              className="hero-dymas-portrait-wrap"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.05, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Soft Violet Radial Glow Behind Portrait */}
              <div className="hero-photo-glow" aria-hidden="true" />

              <div className="hero-portrait-video-frame">
                <video
                  ref={videoRef}
                  src={asset("assets/videos/video2.mp4")}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={asset("assets/images/video2-preview.jpg")}
                  width={560}
                  height={640}
                  className="hero-dymas-portrait-video"
                  aria-label="Dinidu Sachintha video portrait"
                />
              </div>
            </motion.div>

            {/* Giant Headline Typography with RGB Chromatic Glitch Fonts - Split into Two Lines */}
            <motion.div
              className={`hero-dymas-big-name hero-rgb-glitch-wrap ${isGlitching ? "is-glitching" : ""}`}
              aria-label="Dinidu Sachintha"
              variants={shouldReduceMotion ? undefined : nameContainerVariants}
              initial={shouldReduceMotion ? undefined : "hidden"}
              animate={shouldReduceMotion ? undefined : "visible"}
              onMouseEnter={triggerGlitch}
              onClick={triggerGlitch}
              title="Hover to glitch"
            >
              <div className="hero-name-line hero-name-line-1">
                <span className="hero-name-outlined hero-glitch-word" data-text="DINIDU" aria-hidden="true">
                  {diniduChars.map((char, i) => (
                    <motion.span
                      key={`d-${i}`}
                      custom={i}
                      variants={shouldReduceMotion ? undefined : letterVariants}
                      className="hero-char-letter hero-rgb-char"
                      data-char={char}
                      style={{
                        animationDelay: `${i * 0.12}s`,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </div>

              <div className="hero-name-line hero-name-line-2">
                <span className="hero-name-solid hero-glitch-word" data-text="SACHINTHA" aria-hidden="true">
                  {sachinthaChars.map((char, i) => (
                    <motion.span
                      key={`s-${i}`}
                      custom={i + 6}
                      variants={shouldReduceMotion ? undefined : letterVariants}
                      className="hero-char-letter hero-rgb-char"
                      data-char={char}
                      style={{
                        animationDelay: `${(i + 6) * 0.12}s`,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </div>
            </motion.div>

            {/* Bottom Left: Availability Badge, Role Title, Tagline, Dual CTAs, and Compact Social Row */}
            <div className="hero-dymas-bottom-left">
              {/* Requirement 3: Available for work badge with pulsing green dot */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hero-availability-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold tracking-wider uppercase mb-2 shadow-[0_0_12px_rgba(16,185,129,0.18)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>Available for work</span>
                </div>
              </motion.div>

              <motion.h1
                className="hero-dymas-role-title hero-role-glitch"
                data-text="Software Engineer"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                Software Engineer
              </motion.h1>

              {/* Requirement 6: Updated Tagline */}
              <motion.p
                className="hero-dymas-role-desc"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              >
                I build fast, scalable web apps with React, TypeScript and Node.js, from database to interface.
              </motion.p>

              {/* Tech Pill Row: <> TypeScript ✦ React ✦ Node.js */}
              <motion.div
                className="hero-tech-pill-row"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              >
                <Code2 size={12} className="text-cyan-400 shrink-0" />
                <span>TypeScript</span>
                <span className="text-violet-400">✦</span>
                <span>React</span>
                <span className="text-violet-400">✦</span>
                <span>Node.js</span>
              </motion.div>

              {/* Requirement 4: Dual Action Buttons (Let's collaborate + View projects ghost button) */}
              <motion.div
                className="hero-dymas-actions"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="#contact"
                  className="hero-dymas-collab-btn group"
                  aria-label="Let's collaborate - Contact Dinidu"
                >
                  <span className="hero-collab-text">Let's collaborate</span>
                  <ArrowUpRight size={16} className="hero-collab-arrow" />
                </a>

                <a
                  href="#work"
                  className="hero-dymas-ghost-btn group"
                  aria-label="View projects"
                >
                  <span>View projects</span>
                  <ArrowDown size={14} className="hero-ghost-arrow transition-transform group-hover:translate-y-0.5 text-violet-400" />
                </a>
              </motion.div>

              {/* Requirement 5: Compact Social Links Icon Row with Tooltips */}
              <motion.div
                className="hero-social-compact-row"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
              >
                {[
                  {
                    href: profile.github,
                    label: "GitHub",
                    icon: Github,
                    download: false,
                  },
                  {
                    href: "https://instagram.com",
                    label: "Instagram",
                    icon: Instagram,
                    download: false,
                  },
                  {
                    href: profile.linkedin,
                    label: "LinkedIn",
                    icon: Linkedin,
                    download: false,
                  },
                  {
                    href: asset(profile.cv),
                    label: "Resume",
                    icon: FileText,
                    download: true,
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.download ? undefined : "_blank"}
                    rel={s.download ? undefined : "noopener noreferrer"}
                    download={s.download ? true : undefined}
                    className="hero-social-icon-btn group relative"
                    aria-label={s.label}
                  >
                    <s.icon size={15} className="text-gray-300 group-hover:text-white transition-colors" />
                    <span className="hero-social-tooltip font-mono">{s.label}</span>
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Requirement 7: Scroll-down cue indicator */}
            <motion.a
              href="#about"
              className="hero-scroll-cue"
              aria-label="Scroll down to About section"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.8 }}
            >
              <span className="hero-scroll-cue-dot animate-bounce" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">SCROLL</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
