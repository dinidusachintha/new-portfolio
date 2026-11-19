import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import LeisureCarousel from "./LeisureCarousel";
import FlyingHeading from "./FlyingHeading";
import "../styles/leisure-section.css";

export default function LeisureSection() {
  return (
    <section className="leisure-section" id="leisure" aria-labelledby="leisure-heading">
      {/* Subtle Futuristic Digital Environment Background */}
      <div className="leisure-bg-grid" aria-hidden="true" />
      <div className="leisure-bg-spotlight" aria-hidden="true" />
      <div className="leisure-bg-radial-glow" aria-hidden="true" />

      {/* Dual Teal & Amber Orbital Rings Beneath Center Card */}
      <div className="leisure-orbital-rings-wrap" aria-hidden="true">
        <svg className="leisure-orbital-svg" viewBox="0 0 1000 320" fill="none">
          {/* Outer Elliptical Orbital Ring (Deep Teal dashed) */}
          <ellipse
            cx="500"
            cy="160"
            rx="460"
            ry="110"
            stroke="rgba(46, 111, 115, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />
          {/* Middle Ring with Petrol Teal Accent Field */}
          <ellipse
            cx="500"
            cy="160"
            rx="340"
            ry="80"
            stroke="rgba(15, 61, 62, 0.45)"
            strokeWidth="1.5"
          />
          {/* Inner Focused Core Ring (Luminous Teal) */}
          <ellipse
            cx="500"
            cy="160"
            rx="200"
            ry="50"
            stroke="rgba(127, 179, 184, 0.5)"
            strokeWidth="1.5"
          />
          {/* Glowing Light Nodes on Rings */}
          <circle cx="340" cy="115" r="3.5" fill="#C8601F" filter="drop-shadow(0 0 8px #C8601F)" />
          <circle cx="660" cy="205" r="3" fill="#7FB3B8" filter="drop-shadow(0 0 8px #7FB3B8)" />
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
          {/* Section Eyebrow matching main portfolio theme */}
          <div className="leisure-eyebrow-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F3D3E]/50 border border-[#2E6F73]/40 text-[#7FB3B8] text-xs font-mono font-semibold tracking-widest uppercase mb-5 shadow-[0_0_20px_rgba(46,111,115,0.2)] backdrop-blur-md">
            <Sparkles size={13} className="text-[#C8601F]" />
            <span>/ 06 — THE HUMAN SIDE</span>
          </div>

          {/* Main Heading: "Beyond the Code." with RGB Chromatic Glitch */}
          <FlyingHeading
            line1="Beyond the"
            line2="Code."
            line2ClassName="leisure-gradient-highlight font-unbounded block mt-1"
            className="leisure-main-heading font-unbounded text-center"
          />

          {/* Subtitle */}
          <p className="leisure-subtitle text-[#8E9EA0]">
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
