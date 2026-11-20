import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import LeisureCarousel from "./LeisureCarousel";
import "../styles/leisure-section.css";

export default function LeisureSection() {
  return (
    <section className="leisure-section" id="leisure" aria-labelledby="leisure-heading">
      {/* Subtle Futuristic Digital Environment Background */}
      <div className="leisure-bg-grid" aria-hidden="true" />
      <div className="leisure-bg-spotlight" aria-hidden="true" />
      <div className="leisure-bg-radial-glow" aria-hidden="true" />

      {/* Dual Violet & Cyan Orbital Rings Beneath Center Card */}
      <div className="leisure-orbital-rings-wrap" aria-hidden="true">
        <svg className="leisure-orbital-svg" viewBox="0 0 1000 320" fill="none">
          {/* Outer Elliptical Orbital Ring (Violet dashed) */}
          <ellipse
            cx="500"
            cy="160"
            rx="460"
            ry="110"
            stroke="rgba(124, 58, 237, 0.18)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />
          {/* Middle Ring with Violet Accent Field */}
          <ellipse
            cx="500"
            cy="160"
            rx="340"
            ry="80"
            stroke="rgba(168, 85, 247, 0.26)"
            strokeWidth="1.5"
          />
          {/* Inner Focused Core Ring (Cyan) */}
          <ellipse
            cx="500"
            cy="160"
            rx="200"
            ry="50"
            stroke="rgba(8, 145, 178, 0.3)"
            strokeWidth="1.5"
          />
          {/* Glowing Light Nodes on Rings */}
          <circle cx="340" cy="115" r="3.5" fill="#7c3aed" filter="drop-shadow(0 0 8px #a855f7)" />
          <circle cx="660" cy="205" r="3" fill="#0891b2" filter="drop-shadow(0 0 8px #06b6d4)" />
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
          {/* Section Eyebrow matching light theme */}
          <div className="leisure-eyebrow-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-mono font-semibold tracking-widest uppercase mb-5 shadow-sm">
            <Sparkles size={13} className="text-violet-600" />
            <span>/ 06 — THE HUMAN SIDE</span>
          </div>

          {/* Main Heading: "Beyond the Code." with dual Violet-Cyan Gradient */}
          <h2 id="leisure-heading" className="leisure-main-heading font-unbounded">
            Beyond the <span className="leisure-gradient-highlight">Code.</span>
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
