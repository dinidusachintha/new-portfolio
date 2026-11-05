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

export default function AboutSection() {
  return (
    <section className="about-section about-section-light" id="about">
      <div className="container">
        {/* Glass Effect Black Card Floating on White Background */}
        <div className="about-glass-black-card reveal">
          <div className="about-black-glass-glow" aria-hidden="true" />

          <div className="section-top relative z-10">
            <span className="eyebrow flex items-center gap-1.5 font-mono text-violet-300">
              <Sparkles size={13} className="text-violet-400" />
              01 / ABOUT THE ENGINEER
            </span>
            <span className="small-index font-mono text-slate-400">ETHOS & BACKGROUND</span>
          </div>

          <div className="section-heading-row mt-4 mb-8 relative z-10">
            <h2 className="font-unbounded text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight">
              Developer’s mind.
              <br />
              <span className="text-slate-400 font-normal">Architect’s vision.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Software engineering undergraduate at SLIIT, full stack engineer, and distributed systems enthusiast based in Sri Lanka.
            </p>
          </div>

          <div className="about-clean-editorial-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
            {/* Left Column: Narrative & Credentials */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for High-Impact Projects</span>
              </div>

              <h3 className="font-unbounded text-xl sm:text-2xl font-bold text-white leading-snug">
                Building reliable software systems with{" "}
                <span className="text-slate-200 underline decoration-violet-400/50 underline-offset-4">
                  clarity, speed, and precision.
                </span>
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                I am a software engineering undergraduate at the Sri Lanka Institute of Information Technology (SLIIT). I bridge deep backend infrastructure with fluid client experiences, architecting resilient databases and type-safe systems that solve real-world operational challenges.
              </p>

              <p className="text-slate-400 text-sm leading-relaxed">
                From relational schemas and concurrency-safe distributed booking algorithms to responsive React frontends with 60fps micro-animations, I care deeply about performance, developer ergonomics, and enduring code quality.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-slate-200 font-mono font-medium">
                  <GraduationCap size={15} className="text-violet-400" />
                  <span>SLIIT · BSc (Hons) Software Engineering</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-slate-200 font-mono font-medium">
                  <MapPin size={14} className="text-violet-400" />
                  <span>Colombo, Sri Lanka</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <a
                  href="#contact"
                  className="about-glass-touch-btn"
                  id="about-get-in-touch-btn"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight size={15} className="about-glass-btn-arrow" />
                </a>

                {profile.cv && (
                  <a
                    href={asset(profile.cv)}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/18 text-slate-200 font-mono text-xs hover:bg-white/[0.1] hover:border-white/30 transition-all font-semibold"
                  >
                    <Download size={14} />
                    <span>Download Resume</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: 3 Architectural Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div className="pb-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                    <Layers size={16} className="text-violet-400" />
                    <span>01 // DISTRIBUTED BACKENDS & APIS</span>
                  </div>
                  <span className="text-[11px] font-mono text-violet-300 font-bold">&lt;100ms p95</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Designing normalized PostgreSQL schemas, table partitioning, Redis caching layers, and concurrency locks preventing double-allocations under high throughput.
                </p>
              </div>

              <div className="pb-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                    <Code2 size={16} className="text-violet-400" />
                    <span>02 // TYPE-SAFE FULL STACK CLIENTS</span>
                  </div>
                  <span className="text-[11px] font-mono text-violet-300 font-bold">100% Strict</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Engineering modern React and Next.js applications with strict TypeScript AST validation, optimistic UI mutations, and accessible design system primitives.
                </p>
              </div>

              <div className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                    <Zap size={16} className="text-violet-400" />
                    <span>03 // RESILIENT DEVOPS & CLOUD</span>
                  </div>
                  <span className="text-[11px] font-mono text-violet-300 font-bold">Zero Downtime</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
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
