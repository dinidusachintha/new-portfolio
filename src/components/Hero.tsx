import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      // Auto-play policy catch fallback
    });
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

            {/* Giant Merged Headline Typography with Smooth Floating Waving Animation */}
            <motion.div
              className="hero-dymas-big-name"
              aria-label="Dinidu Sachintha"
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hero-name-outlined">DINIDU</span>
              <span className="hero-name-solid">SACHINTHA</span>
            </motion.div>

            {/* Bottom Left: Role Title, Tech Pill, and Action Button */}
            <div className="hero-dymas-bottom-left">
              <motion.h1
                className="hero-dymas-role-title"
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
