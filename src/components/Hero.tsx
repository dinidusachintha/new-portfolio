import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Code2,
  Download,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { asset, profile } from "../data/portfolio";
import LetterWave from "./animations/LetterWave";
import HeroThreeBackground from "./HeroThreeBackground";

gsap.registerPlugin(ScrollTrigger);

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

  // Trigger 800ms left-to-right text scramble
  const triggerGlitch = () => {
    if (isGlitching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsGlitching(true);
    const GLYPHS = "01X#_<>!?*/+~$%&";
    const startTime = performance.now();
    const duration = 800; // 800ms
    const totalChars = 15; // 6 for DINIDU + 9 for SACHINTHA

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

  useEffect(() => {
    const el = heroRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    v.muted = true;
    let glitchTimer: ReturnType<typeof setInterval> | null = null;

    const startGlitchTimer = () => {
      if (glitchTimer) clearInterval(glitchTimer);
      glitchTimer = setInterval(() => {
        if (Math.random() > 0.4) {
          triggerGlitch();
        }
      }, 7500);
    };

    const stopGlitchTimer = () => {
      if (glitchTimer) {
        clearInterval(glitchTimer);
        glitchTimer = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
          startGlitchTimer();
        } else {
          v.pause();
          stopGlitchTimer();
        }
      },
      { rootMargin: "100px" }
    );

    io.observe(el);

    // Modern Scroll Parallax & Scroll Cue (Transform and Opacity only)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let ctx: gsap.Context | null = null;
    if (!prefersReducedMotion) {
      ctx = gsap.context(() => {
        // 1. Split-name parallax: DINIDU moves left, SACHINTHA moves right, both fade out
        gsap.to(".hero-name-line-1", {
          xPercent: -35,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
          },
        });

        gsap.to(".hero-name-line-2", {
          xPercent: 35,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
          },
        });

        // 2. Photo parallax: moves slower than page scroll
        gsap.to(".hero-dymas-portrait-wrap", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // 3. Scroll cue fade out on initial scroll
        gsap.to(".hero-scroll-cue", {
          opacity: 0,
          y: 20,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=100",
            scrub: true,
          },
        });
      }, el);
    }

    return () => {
      io.disconnect();
      stopGlitchTimer();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-dymas-section container" id="home">
      {/* Outer Liquid Obsidian Mockup Frame with Cinematic Landing Animation */}
      <motion.div
        className="hero-dymas-mockup-wrapper"
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Inner Luminous Pure Black Hero Card Canvas */}
        <div className="hero-dymas-frame relative overflow-hidden">
          {/* Three.js Hero Interactive Background Layer */}
          <HeroThreeBackground />

          {/* Subtle Drifting Blurred Glow Orbs */}
          <div className="hero-glow-orbs" aria-hidden="true">
            <div className="hero-glow-orb hero-glow-orb-1" />
            <div className="hero-glow-orb hero-glow-orb-2" />
            <div className="hero-glow-orb hero-glow-orb-3" />
          </div>

          {/* Top Bar: Minimalist System & Architecture Identifier */}
          <motion.div
            className="hero-dymas-topbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
            {/* Centered Live Video 2 of Dinidu - Continuously Auto-Playing, Perfectly Grounded */}
            <motion.div
              className="hero-dymas-portrait-wrap"
              initial={{ opacity: 0, scale: 0.92, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
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
                  className="hero-dymas-portrait-video"
                  aria-label="Dinidu Sachintha video portrait"
                />
              </div>
            </motion.div>

            {/* Giant Headline Typography with RGB Chromatic Glitch Fonts - Split into Two Lines */}
            <motion.div
              className={`hero-dymas-big-name hero-rgb-glitch-wrap ${isGlitching ? "is-glitching" : ""}`}
              aria-label="Dinidu Sachintha"
              variants={nameContainerVariants}
              initial="hidden"
              animate="visible"
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
                <span className="hero-name-solid hero-glitch-word" data-text="SACHINTHA" aria-hidden="true">
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
              <motion.div
                className="hero-dymas-role-title hero-role-glitch"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <LetterWave
                  text="Software Engineer"
                  as="h1"
                  className="font-unbounded font-black tracking-tight"
                />
              </motion.div>

              <motion.p
                className="hero-dymas-role-desc"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              >
                Designing digital products and resilient architectures that are clear,
                usable, and conversion focused.
              </motion.p>

              {/* Tech Pill Row from Image 3: <> TypeScript ✦ React ✦ Node.js */}
              <motion.div
                className="hero-tech-pill-row"
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              >
                <Code2 size={12} className="text-cyan-400 shrink-0" />
                <span>TypeScript</span>
                <span className="text-violet-400">✦</span>
                <span>React</span>
                <span className="text-violet-400">✦</span>
                <span>Node.js</span>
              </motion.div>

              <motion.div
                className="hero-dymas-actions"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
              >
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
              </motion.div>
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
                ].map((s, idx) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target={s.download ? undefined : "_blank"}
                    rel={s.download ? undefined : "noopener noreferrer"}
                    download={s.download ? true : undefined}
                    className={`hero-dymas-social-pill ${s.extraClass}`}
                    title={s.label}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.48 + idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <s.icon size={15} />
                    <span>{s.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Subtle Looping Scroll Cue */}
            <div className="hero-scroll-cue" aria-hidden="true">
              <div className="hero-scroll-cue-pill">
                <div className="hero-scroll-cue-dot" />
              </div>
              <span className="hero-scroll-cue-label">SCROLL</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
