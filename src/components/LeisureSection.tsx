import { motion } from "framer-motion";
import LeisureCarousel from "./LeisureCarousel";
import "../styles/leisure-section.css";

export default function LeisureSection() {
  return (
    <section className="leisure-section" id="leisure" aria-labelledby="leisure-heading">
      {/* Subtle Futuristic Digital Environment Background */}
      <div className="leisure-bg-grid" aria-hidden="true" />
      <div className="leisure-bg-spotlight" aria-hidden="true" />
      <div className="leisure-bg-radial-glow" aria-hidden="true" />

      {/* Thin Cyan Orbital Rings Beneath Center Card */}
      <div className="leisure-orbital-rings-wrap" aria-hidden="true">
        <svg className="leisure-orbital-svg" viewBox="0 0 1000 320" fill="none">
          {/* Outer Elliptical Orbital Ring */}
          <ellipse
            cx="500"
            cy="160"
            rx="460"
            ry="110"
            stroke="rgba(0, 229, 255, 0.12)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />
          {/* Middle Ring with Cyan Accent Nodes */}
          <ellipse
            cx="500"
            cy="160"
            rx="340"
            ry="80"
            stroke="rgba(0, 229, 255, 0.22)"
            strokeWidth="1.5"
          />
          {/* Inner Focused Core Ring */}
          <ellipse
            cx="500"
            cy="160"
            rx="200"
            ry="50"
            stroke="rgba(0, 229, 255, 0.35)"
            strokeWidth="1.5"
          />
          {/* Glowing Light Node on Ring */}
          <circle cx="340" cy="115" r="3.5" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />
          <circle cx="660" cy="205" r="3" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />
        </svg>
      </div>

      <div className="container relative z-10">
        {/* Section Heading: Center-Aligned with generous spacing */}
        <motion.div
          className="leisure-heading-container text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Small Uppercase Cyber Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081421] border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-mono font-semibold tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF] animate-pulse" />
            / 06 — THE HUMAN SIDE
          </div>

          {/* Main Heading: "Beyond the Code." with "Code." in Electric Cyan */}
          <h2 id="leisure-heading" className="leisure-main-heading font-unbounded">
            Beyond the <span className="leisure-cyan-highlight">Code.</span>
          </h2>

          {/* Subtitle */}
          <p className="leisure-subtitle">
            When the editor closes, a different world opens. Here are the things that keep me inspired, balanced, and creative.
          </p>
        </motion.div>

        {/* 3D Floating Cards Curved Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <LeisureCarousel />
        </motion.div>
      </div>
    </section>
  );
}
