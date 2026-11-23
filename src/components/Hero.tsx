import { useEffect, useRef, useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Code2,
  Download,
  FileText,
  Github,
  Instagram,
  Layers,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { asset, profile } from "../data/portfolio";
import LetterWave from "./animations/LetterWave";

// Stagger container for the whole name
const nameContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.22,
    },
  },
};

// Flying effect for each individual letter (transform and opacity only)
const letterVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: i % 2 === 0 ? -30 : 30,
    scale: 0.8,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [diniduChars, setDiniduChars] = useState<string[]>(() => "DINIDU".split(""));
  const [sachinthaChars, setSachinthaChars] = useState<string[]>(() => "SACHINTHA".split(""));
  const [isGlitching, setIsGlitching] = useState(false);

  // Scroll Portal Progress State (0 to 3 for 4 nested scenes)
  const [currentProgress, setCurrentProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const totalFrames = 4;

  // Trigger 800ms text scramble glitch
  const triggerGlitch = () => {
    if (isGlitching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsGlitching(true);
    const GLYPHS = "01X#_<>!?*/+~$%&";
    const startTime = performance.now();
    const duration = 800;
    const totalChars = 15;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const resolvedTotal = Math.floor(progress * totalChars);

      const resolvedD = Math.min(6, resolvedTotal);
      const resolvedS = Math.max(0, resolvedTotal - 6);

      setDiniduChars(
        "DINIDU".split("").map((c, i) => (i < resolvedD ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      );
      setSachinthaChars(
        "SACHINTHA".split("").map((c, i) => (i < resolvedS ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      );

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDiniduChars("DINIDU".split(""));
        setSachinthaChars("SACHINTHA".split(""));
        setIsGlitching(false);
      }
    };

    requestAnimationFrame(tick);
  };

  // Video Autoplay & Infinite Loop Setup
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.defaultMuted = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;

    const playVideo = () => {
      const promise = v.play();
      if (promise !== undefined) {
        promise.catch(() => {
          const unlock = () => {
            v.play().catch(() => {});
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("scroll", unlock);
            window.removeEventListener("keydown", unlock);
          };
          window.addEventListener("pointerdown", unlock, { passive: true, once: true });
          window.addEventListener("touchstart", unlock, { passive: true, once: true });
          window.addEventListener("scroll", unlock, { passive: true, once: true });
          window.addEventListener("keydown", unlock, { passive: true, once: true });
        });
      }
    };
    playVideo();

    const handleEnded = () => {
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    v.addEventListener("ended", handleEnded);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        v.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let glitchTimer: ReturnType<typeof setInterval> | null = null;
    const startGlitchTimer = () => {
      if (glitchTimer) clearInterval(glitchTimer);
      glitchTimer = setInterval(() => {
        if (Math.random() > 0.4) {
          triggerGlitch();
        }
      }, 7500);
    };
    startGlitchTimer();

    return () => {
      if (glitchTimer) clearInterval(glitchTimer);
      v.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Scroll Portal Runway Progress Tracker
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      const container = heroRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      targetProgressRef.current = progress * (totalFrames - 1);
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
        const alpha = 1 - Math.pow(Math.max(0.001, 1 - 0.35), dt * 60);
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
  }, []);

  const activeIndex = Math.min(totalFrames - 1, Math.max(0, Math.round(currentProgress)));

  const jumpToFrame = (idx: number) => {
    const container = heroRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = containerTop + (idx / (totalFrames - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const getFrame3DStyles = (idx: number) => {
    const delta = idx - currentProgress;
    const frameDepth = 1;

    let scale = 1;
    let translateZ = 0;
    let opacity = 1;
    let zIndex = 100 - idx;
    let dimOpacity = 0;
    let pointerEvents: "auto" | "none" = "none";

    if (delta < 0) {
      const passed = -delta;
      scale = 1 + passed * 3.6;
      translateZ = passed * 550;
      opacity = Math.max(0, 1 - passed * 1.5);
      zIndex = 200 + Math.floor(passed * 10);
      pointerEvents = "none";
    } else if (delta === 0) {
      scale = 1;
      translateZ = 0;
      opacity = 1;
      zIndex = 100;
      pointerEvents = "auto";
    } else {
      scale = Math.pow(0.52, delta * frameDepth);
      translateZ = -delta * frameDepth * 420;
      opacity = Math.max(0.12, 1 - delta * 0.28);
      dimOpacity = Math.min(0.55, delta * 0.55);
      zIndex = 100 - idx;
      pointerEvents = "none";
    }

    return {
      transform: `translate3d(0, 0, ${translateZ}px) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents,
      dimOpacity,
    };
  };

  const frame0Style = getFrame3DStyles(0);
  const frame1Style = getFrame3DStyles(1);
  const frame2Style = getFrame3DStyles(2);
  const frame3Style = getFrame3DStyles(3);

  return (
    <section
      ref={heroRef}
      className="hero-scroll-portal-root relative w-full"
      id="home"
      style={{ height: "300vh" }}
    >
      {/* Pinned Viewport for 3D Camera Flight */}
      <div className="hero-scroll-portal-sticky sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#050507]">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background:
              activeIndex === 0
                ? "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(152,103,255,0.12) 0%, rgba(5,5,7,0.85) 60%, #050507 100%)"
                : activeIndex === 1
                ? "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(168,85,247,0.14) 0%, rgba(5,5,7,0.85) 60%, #050507 100%)"
                : activeIndex === 2
                ? "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56,189,248,0.14) 0%, rgba(5,5,7,0.85) 60%, #050507 100%)"
                : "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(192,132,252,0.14) 0%, rgba(5,5,7,0.85) 60%, #050507 100%)",
          }}
          aria-hidden="true"
        />

        {/* Top Floating HUD: Shows active portal layer */}
        <div className="absolute top-6 sm:top-10 left-6 sm:left-12 right-6 sm:right-12 z-40 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-violet-400">
              <Layers size={16} />
            </span>
            <div>
              <div className="font-mono text-[10px] sm:text-xs text-violet-400 uppercase tracking-widest flex items-center gap-2">
                <span>SCROLL PORTAL</span>
                <span className="text-white/20">|</span>
                <span>HERO → ABOUT GATEWAY</span>
              </div>
              <div className="font-unbounded text-xs sm:text-sm font-bold text-white tracking-tight">
                {activeIndex === 0
                  ? "Stage 01 // Hero Stage"
                  : activeIndex === 1
                  ? "Stage 02 // Architectural Core"
                  : activeIndex === 2
                  ? "Stage 03 // Tech Arsenal"
                  : "Stage 04 // About Dinidu"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full font-mono text-xs text-gray-300">
            <span className="text-white font-bold">0{activeIndex + 1}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/50">04</span>
          </div>
        </div>

        {/* 3D Perspective Stage Container */}
        <div
          className="hero-perspective-stage relative w-full max-w-[1280px] h-[78vh] sm:h-[84vh] max-h-[780px] mx-auto px-3 sm:px-6 flex items-center justify-center"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* ===================================================================
              FRAME 0: FULL HERO STAGE (Dinidu Live Video Portrait + Typography)
              =================================================================== */}
          <div
            className="scroll-portal-frame absolute inset-x-2 sm:inset-x-4 inset-y-1 sm:inset-y-2 rounded-3xl overflow-hidden flex flex-col justify-between"
            style={{
              transform: frame0Style.transform,
              opacity: frame0Style.opacity,
              zIndex: frame0Style.zIndex,
              pointerEvents: frame0Style.pointerEvents,
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          >
            {/* Outer Liquid Obsidian Mockup Frame */}
            <div className="hero-dymas-mockup-wrapper w-full h-full p-2.5 sm:p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Inner Luminous Pure Black Hero Card Canvas */}
              <div className="hero-dymas-frame relative overflow-hidden flex-1 flex flex-col justify-between">
                {/* Subtle Drifting Blurred Glow Orbs */}
                <div className="hero-glow-orbs" aria-hidden="true">
                  <div className="hero-glow-orb hero-glow-orb-1" />
                  <div className="hero-glow-orb hero-glow-orb-2" />
                  <div className="hero-glow-orb hero-glow-orb-3" />
                </div>

                {/* Top Bar: Minimalist System & Architecture Identifier */}
                <div className="hero-dymas-topbar relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
                    <Sparkles size={13} className="text-violet-400 animate-pulse" />
                    <span className="font-mono text-[11px] sm:text-xs text-slate-300 font-semibold tracking-wider uppercase">
                      Systems Architect <span className="text-white/30">✦</span> Full Stack
                    </span>
                  </div>
                </div>

                {/* Central Visual Stage */}
                <div className="hero-dymas-stage relative z-10 my-auto">
                  {/* Centered Live Video 2 of Dinidu */}
                  <div className="hero-dymas-portrait-wrap">
                    <div className="hero-portrait-video-frame">
                      <video
                        ref={videoRef}
                        src={asset("assets/videos/video2.mp4")}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        controls={false}
                        poster={asset("assets/images/video2-preview.jpg")}
                        className="hero-dymas-portrait-video"
                        aria-label="Dinidu Sachintha video portrait"
                      />
                    </div>
                  </div>

                  {/* Giant Headline Typography with RGB Chromatic Glitch Fonts */}
                  <motion.div
                    className={`hero-dymas-big-name hero-rgb-glitch-wrap ${
                      isGlitching ? "is-glitching" : ""
                    }`}
                    aria-label="Dinidu Sachintha"
                    variants={nameContainerVariants}
                    initial="hidden"
                    animate="visible"
                    onMouseEnter={triggerGlitch}
                    onClick={triggerGlitch}
                    title="Hover to glitch"
                  >
                    <div className="hero-name-line hero-name-line-1">
                      <span
                        className="hero-name-outlined hero-glitch-word"
                        data-text="DINIDU"
                        aria-hidden="true"
                      >
                        {diniduChars.map((char, i) => (
                          <motion.span
                            key={`d-${i}`}
                            custom={i}
                            variants={letterVariants}
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
                      <span
                        className="hero-name-solid hero-glitch-word"
                        data-text="SACHINTHA"
                        aria-hidden="true"
                      >
                        {sachinthaChars.map((char, i) => (
                          <motion.span
                            key={`s-${i}`}
                            custom={i + 6}
                            variants={letterVariants}
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

                  {/* Bottom Left: Role Title, Tech Pill, and Action Button */}
                  <div className="hero-dymas-bottom-left">
                    <div className="hero-dymas-role-title hero-role-glitch">
                      <LetterWave
                        text="Software Engineer"
                        as="h1"
                        className="font-unbounded font-black tracking-tight"
                      />
                    </div>

                    <p className="hero-dymas-role-desc">
                      Designing digital products and resilient architectures that are clear, usable, and
                      conversion focused.
                    </p>

                    <div className="hero-tech-pill-row">
                      <Code2 size={12} className="text-cyan-400 shrink-0" />
                      <span>TypeScript</span>
                      <span className="text-violet-400">✦</span>
                      <span>React</span>
                      <span className="text-violet-400">✦</span>
                      <span>Node.js</span>
                    </div>

                    <div className="hero-dymas-actions">
                      <a
                        href="#contact"
                        className="hero-dymas-collab-btn btn-liquid-fill group"
                        aria-label="Let's collaborate - Contact Dinidu"
                      >
                        <span className="liquid-fill-shape" aria-hidden="true" />
                        <span className="liquid-btn-content">
                          <span className="hero-collab-text">Let's collaborate</span>
                          <ArrowUpRight size={16} className="hero-collab-arrow liquid-btn-arrow" />
                        </span>
                      </a>

                      {profile.cv && (
                        <a
                          href={asset(profile.cv)}
                          download="Dinidu_Sachintha_Resume.pdf"
                          className="hero-dymas-cv-btn btn-liquid-fill group"
                          aria-label="Download Dinidu Sachintha CV"
                        >
                          <span className="liquid-fill-shape" aria-hidden="true" />
                          <span className="liquid-btn-content">
                            <span className="hero-collab-text">Download CV</span>
                            <Download size={15} className="hero-collab-arrow" />
                          </span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom Right: Vertical Stack of Rounded Social Pills */}
                  <div className="hero-dymas-bottom-right">
                    <div className="hero-dymas-social-stack">
                      {[
                        {
                          href: profile.github,
                          label: "GitHub",
                          icon: Github,
                          extraClass: "pill-github",
                          download: false,
                        },
                        {
                          href: "https://instagram.com",
                          label: "Instagram",
                          icon: Instagram,
                          extraClass: "pill-instagram",
                          download: false,
                        },
                        {
                          href: profile.linkedin,
                          label: "LinkedIn",
                          icon: Linkedin,
                          extraClass: "pill-linkedin",
                          download: false,
                        },
                        {
                          href: asset(profile.cv),
                          label: "Resume",
                          icon: FileText,
                          extraClass: "pill-resume",
                          download: true,
                        },
                      ].map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target={s.download ? undefined : "_blank"}
                          rel={s.download ? undefined : "noopener noreferrer"}
                          download={s.download ? true : undefined}
                          className={`hero-dymas-social-pill ${s.extraClass}`}
                          title={s.label}
                        >
                          <s.icon size={15} />
                          <span>{s.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Looping Scroll Cue */}
                  <div className="hero-scroll-cue" aria-hidden="true">
                    <div className="hero-scroll-cue-pill">
                      <div className="hero-scroll-cue-dot" />
                    </div>
                    <span className="hero-scroll-cue-label">SCROLL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              FRAME 1: ARCHITECTURAL CORE & DISTRIBUTED SYSTEMS
              =================================================================== */}
          <div
            className="scroll-portal-frame absolute inset-x-2 sm:inset-x-4 inset-y-1 sm:inset-y-2 rounded-3xl overflow-hidden flex flex-col justify-between"
            style={{
              transform: frame1Style.transform,
              opacity: frame1Style.opacity,
              zIndex: frame1Style.zIndex,
              pointerEvents: frame1Style.pointerEvents,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              background: "linear-gradient(145deg, rgba(17,17,24,0.96) 0%, rgba(10,10,18,0.98) 100%)",
              boxShadow: "0 0 40px -10px rgba(168,85,247,0.3), 0 25px 60px -15px rgba(0,0,0,0.85)",
            }}
          >
            <div
              className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
              style={{ opacity: frame1Style.dimOpacity }}
            />
            {/* Cybernetic Reticles */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-violet-400 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-violet-400 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-violet-400 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-violet-400 pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-10 pb-3">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300">
                  PORTAL 01 // ARCHITECTURAL CORE
                </span>
                <span className="font-mono text-xs text-gray-400">
                  HIGH-CONCURRENCY BACKENDS
                </span>
              </div>
              <h3 className="font-unbounded font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                Distributed Systems & Cloud Architecture
              </h3>
              <p className="font-mono text-xs sm:text-sm text-violet-400 mt-1">
                High-Throughput Microservices & Event-Driven Topology
              </p>
            </div>

            <div className="relative z-10 px-6 sm:px-10 py-4 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Architecting resilient production backends with low-latency messaging, container
                    orchestration, and failover-resistant database topologies across Kubernetes
                    clusters.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Kubernetes", "Kafka", "Go", "PostgreSQL", "Redis", "gRPC"].map((t) => (
                      <span
                        key={t}
                        className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-cols-1 gap-3">
                  {[
                    { label: "Throughput", value: "100k+ req/s" },
                    { label: "P99 Latency", value: "< 14ms" },
                    { label: "Availability", value: "99.99% SLA" },
                  ].map((st) => (
                    <div
                      key={st.label}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                    >
                      <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
                        {st.label}
                      </span>
                      <span className="font-mono font-bold text-base sm:text-lg text-violet-400">
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 px-6 sm:px-10 py-4 border-t border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span>ACTIVE PORTAL LAYER</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                <span>SCROLL TO DIVE DEEPER</span>
                <ArrowRight size={13} className="text-violet-400" />
              </div>
            </div>
          </div>

          {/* ===================================================================
              FRAME 2: FULL STACK INTELLIGENCE & TECH ARSENAL
              =================================================================== */}
          <div
            className="scroll-portal-frame absolute inset-x-2 sm:inset-x-4 inset-y-1 sm:inset-y-2 rounded-3xl overflow-hidden flex flex-col justify-between"
            style={{
              transform: frame2Style.transform,
              opacity: frame2Style.opacity,
              zIndex: frame2Style.zIndex,
              pointerEvents: frame2Style.pointerEvents,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              background: "linear-gradient(145deg, rgba(14,19,32,0.96) 0%, rgba(8,12,22,0.98) 100%)",
              boxShadow: "0 0 40px -10px rgba(56,189,248,0.3), 0 25px 60px -15px rgba(0,0,0,0.85)",
            }}
          >
            <div
              className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
              style={{ opacity: frame2Style.dimOpacity }}
            />
            {/* Cybernetic Reticles */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-10 pb-3">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
                  PORTAL 02 // TECH ARSENAL
                </span>
                <span className="font-mono text-xs text-gray-400">
                  TYPE-SAFE RUNTIMES
                </span>
              </div>
              <h3 className="font-unbounded font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                Full Stack & Intelligent Systems
              </h3>
              <p className="font-mono text-xs sm:text-sm text-cyan-400 mt-1">
                Type-Safe Web Fabrics & Modern AI Pipelines
              </p>
            </div>

            <div className="relative z-10 px-6 sm:px-10 py-4 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Building fluid client experiences backed by type-safe TypeScript runtimes,
                    high-concurrency Node.js microservices, and AI-powered vector search pipelines.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["React 19", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "Python"].map(
                      (t) => (
                        <span
                          key={t}
                          className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-300"
                        >
                          {t}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-cols-1 gap-3">
                  {[
                    { label: "Frontend", value: "React 19 & Next.js" },
                    { label: "Language", value: "TypeScript Strict" },
                    { label: "Motion", value: "60 FPS Butter" },
                  ].map((st) => (
                    <div
                      key={st.label}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                    >
                      <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
                        {st.label}
                      </span>
                      <span className="font-mono font-bold text-base sm:text-lg text-cyan-400">
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 px-6 sm:px-10 py-4 border-t border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>NEXT: ABOUT GATEWAY</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                <span>SCROLL TO DIVE IN</span>
                <ArrowRight size={13} className="text-cyan-400" />
              </div>
            </div>
          </div>

          {/* ===================================================================
              FRAME 3: ABOUT DINIDU GATEWAY (Transitional Frame to About Section)
              =================================================================== */}
          <div
            className="scroll-portal-frame absolute inset-x-2 sm:inset-x-4 inset-y-1 sm:inset-y-2 rounded-3xl overflow-hidden flex flex-col justify-between"
            style={{
              transform: frame3Style.transform,
              opacity: frame3Style.opacity,
              zIndex: frame3Style.zIndex,
              pointerEvents: frame3Style.pointerEvents,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              border: "1px solid rgba(192, 132, 252, 0.45)",
              background: "linear-gradient(145deg, rgba(20,15,30,0.96) 0%, rgba(12,8,20,0.98) 100%)",
              boxShadow: "0 0 45px -10px rgba(192,132,252,0.35), 0 25px 60px -15px rgba(0,0,0,0.85)",
            }}
          >
            <div
              className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
              style={{ opacity: frame3Style.dimOpacity }}
            />
            {/* Cybernetic Reticles */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-purple-400 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-400 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-400 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-purple-400 pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-10 pb-3">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300">
                  PORTAL 03 // THE JOURNEY
                </span>
                <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>ABOUT DINIDU SACHINTHA</span>
                </span>
              </div>
              <h3 className="font-unbounded font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                Software Engineering at SLIIT
              </h3>
              <p className="font-mono text-xs sm:text-sm text-purple-400 mt-1">
                Bridging Deep Backend Infrastructure with Fluid Client Experiences
              </p>
            </div>

            <div className="relative z-10 px-6 sm:px-10 py-4 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Undergraduate at the Sri Lanka Institute of Information Technology (SLIIT).
                    Architecting resilient databases, distributed systems, and responsive modern
                    applications that deliver measurable production impact.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["1y Industry Exp", "15+ Systems Delivered", "SLIIT Faculty of Computing"].map(
                      (t) => (
                        <span
                          key={t}
                          className="font-mono text-xs px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-200"
                        >
                          {t}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-cols-1 gap-3">
                  {[
                    { label: "Experience", value: "1y Industry" },
                    { label: "Systems", value: "15+ Production" },
                    { label: "Focus", value: "Full Stack Resilient" },
                  ].map((st) => (
                    <div
                      key={st.label}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                    >
                      <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
                        {st.label}
                      </span>
                      <span className="font-mono font-bold text-base sm:text-lg text-purple-300">
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 px-6 sm:px-10 py-4 border-t border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between">
              <a
                href="#about"
                className="flex items-center gap-2 font-mono text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>ENTERING ABOUT SECTION</span>
                <ChevronDown size={14} className="animate-bounce" />
              </a>

              <span className="font-mono text-[11px] text-gray-400">
                SCROLL DOWN TO REVEAL BENTO STATS
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation HUD: Clickable Frame Jump Pills */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {[
              { label: "01 · HERO", idx: 0 },
              { label: "02 · ARCHITECTURE", idx: 1 },
              { label: "03 · TECH ARSENAL", idx: 2 },
              { label: "04 · ABOUT GATEWAY", idx: 3 },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => jumpToFrame(item.idx)}
                className={`px-2.5 py-1 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                  item.idx === activeIndex
                    ? "bg-violet-500 text-white font-bold shadow-md shadow-violet-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title={`Jump to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-gray-400 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 animate-pulse">
            <span>SCROLL TO DIVE THROUGH FRAMES TO ABOUT</span>
            <ChevronDown size={14} className="text-violet-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
