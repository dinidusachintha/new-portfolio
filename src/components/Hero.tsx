import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
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
      delayChildren: 0.22,
    },
  },
};

// Flying effect for each individual letter
const letterVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: i % 2 === 0 ? -55 : 55,
    x: (i - 7) * 7,
    scale: 0.5,
    rotateZ: i % 2 === 0 ? -14 : 14,
    filter: "blur(12px)",
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [diniduChars, setDiniduChars] = useState<string[]>(() => "DINIDU".split(""));
  const [sachinthaChars, setSachinthaChars] = useState<string[]>(() => "SACHINTHA".split(""));
  const [isGlitching, setIsGlitching] = useState(false);

  // Trigger high-speed RGB hacker scramble glitch
  const triggerGlitch = () => {
    if (isGlitching) return;
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
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      // Auto-play policy catch fallback
    });

    // Periodic gentle micro-glitch trigger
    const glitchTimer = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerGlitch();
      }
    }, 6500);

    return () => clearInterval(glitchTimer);
  }, []);

  return (
    <section className="hero-dymas-section container" id="home">
      {/* Outer Liquid Obsidian Mockup Frame with Cinematic Landing Animation */}
      <motion.div
        className="hero-dymas-mockup-wrapper"
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Inner Luminous Pure Black Hero Card Canvas */}
        <div className="hero-dymas-frame">
          {/* Top Bar: Minimalist System & Architecture Identifier */}
          <motion.div
            className="hero-dymas-topbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left: Minimalist System & Architecture Identifier */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#2E6F73]/30 bg-[#0F3D3E]/30 backdrop-blur-md">
              <Sparkles size={13} className="text-[#C8601F] animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs text-[#EADCC8] font-semibold tracking-wider uppercase">
                Systems Architect <span className="text-[#7FB3B8]">✦</span> Full Stack
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
              <motion.h1
                className="hero-dymas-role-title hero-role-glitch"
                data-text="Software Engineer"
                initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                Software Engineer
              </motion.h1>

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
                <Code2 size={12} className="text-[#7FB3B8] shrink-0" />
                <span>TypeScript</span>
                <span className="text-[#C8601F]">✦</span>
                <span>React</span>
                <span className="text-[#7FB3B8]">✦</span>
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
                  className="hero-dymas-collab-btn group"
                  aria-label="Let's collaborate - Contact Dinidu"
                >
                  <span className="hero-collab-text">Let's collaborate</span>
                  <ArrowUpRight size={16} className="hero-collab-arrow" />
                </a>
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
          </div>
        </div>
      </motion.div>
    </section>
  );
}
