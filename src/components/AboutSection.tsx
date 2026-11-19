import {
  ArrowUpRight,
  Code2,
  Download,
  GraduationCap,
  Layers,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { asset, profile } from "../data/portfolio";
import FlyingHeading from "./FlyingHeading";

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="container">
        {/* Luxury Glass Card on Deep Obsidian Background */}
        <div className="about-glass-card reveal">
          <div className="about-glass-glow" aria-hidden="true" />

          <div className="section-top relative z-10">
            <span className="eyebrow flex items-center gap-1.5 font-mono text-[#7FB3B8]">
              <Sparkles size={13} className="text-[#C8601F]" />
              01 / ABOUT THE ENGINEER
            </span>
            <span className="small-index font-mono text-[#8E9EA0]">ETHOS & BACKGROUND</span>
          </div>

          <div className="section-heading-row mt-4 mb-8 relative z-10">
            <FlyingHeading
              line1="Developer’s mind."
              line2="Architect’s vision."
              line2ClassName="text-[#8E9EA0] font-normal"
              className="font-unbounded text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#EADCC8] tracking-tight leading-tight"
            />
            <p className="text-[#cbd5e1] text-sm sm:text-base max-w-xl">
              Software engineering undergraduate at SLIIT, full stack engineer, and distributed systems enthusiast based in Sri Lanka.
            </p>
          </div>

          <div className="about-clean-editorial-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
            {/* Left Column: Narrative & Credentials */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3D3E]/60 border border-[#7FB3B8]/30 text-[#7FB3B8] text-xs font-mono font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#7FB3B8] animate-pulse" />
                <span>Available for High-Impact Projects</span>
              </div>

              <h3 className="font-unbounded text-xl sm:text-2xl font-bold text-[#EADCC8] leading-snug">
                Building reliable software systems with{" "}
                <span className="text-white underline decoration-[#C8601F]/70 underline-offset-4">
                  clarity, speed, and precision.
                </span>
              </h3>

              <p className="text-[#cbd5e1] text-sm sm:text-base leading-relaxed">
                I am a software engineering undergraduate at the Sri Lanka Institute of Information Technology (SLIIT). I bridge deep backend infrastructure with fluid client experiences, architecting resilient databases and type-safe systems that solve real-world operational challenges.
              </p>

              <p className="text-[#8E9EA0] text-sm leading-relaxed">
                From relational schemas and concurrency-safe distributed booking algorithms to responsive React frontends with 60fps micro-animations, I care deeply about performance, developer ergonomics, and enduring code quality.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#EADCC8] font-mono font-medium backdrop-blur-md">
                  <GraduationCap size={15} className="text-[#7FB3B8]" />
                  <span>SLIIT · BSc (Hons) Software Engineering</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#EADCC8] font-mono font-medium backdrop-blur-md">
                  <MapPin size={14} className="text-[#C8601F]" />
                  <span>Colombo, Sri Lanka</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <a
                  href="#contact"
                  className="glass-btn glass-btn-primary"
                  id="about-get-in-touch-btn"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight size={15} className="about-glass-btn-arrow" />
                </a>

                {profile.cv && (
                  <a
                    href={asset(profile.cv)}
                    download
                    className="glass-btn glass-btn-secondary"
                  >
                    <Download size={14} />
                    <span>Download Resume</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: 3 Architectural Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-5 rounded-2xl bg-[#0F3D3E]/20 border border-[#2E6F73]/30 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EADCC8]">
                    <Layers size={16} className="text-[#7FB3B8]" />
                    <span>01 // DISTRIBUTED BACKENDS & APIS</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#C8601F] font-bold">&lt;100ms p95</span>
                </div>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  Designing normalized PostgreSQL schemas, table partitioning, Redis caching layers, and concurrency locks preventing double-allocations under high throughput.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F3D3E]/20 border border-[#2E6F73]/30 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EADCC8]">
                    <Code2 size={16} className="text-[#7FB3B8]" />
                    <span>02 // TYPE-SAFE FULL STACK CLIENTS</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#7FB3B8] font-bold">100% Strict</span>
                </div>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  Engineering modern React and Next.js applications with strict TypeScript AST validation, optimistic UI mutations, and accessible design system primitives.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F3D3E]/20 border border-[#2E6F73]/30 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EADCC8]">
                    <Zap size={16} className="text-[#C8601F]" />
                    <span>03 // RESILIENT DEVOPS & CLOUD</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#EADCC8] font-bold">Zero Downtime</span>
                </div>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  Dockerized containerization, automated GitHub Actions CI/CD pipelines, and health observability for high availability production deployments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
