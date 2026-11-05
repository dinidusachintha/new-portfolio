import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layout,
  Pause,
  Play,
  Server,
  Zap,
} from "lucide-react";
import { skillPillars, techMarquee } from "../data/portfolio";

export default function TechStack() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % skillPillars.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % skillPillars.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + skillPillars.length) % skillPillars.length);
  };

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "Layout":
        return <Layout size={24} className="text-cyan-400" />;
      case "Server":
        return <Server size={24} className="text-violet-400" />;
      case "Database":
        return <Database size={24} className="text-emerald-400" />;
      case "Cloud":
        return <Cloud size={24} className="text-blue-400" />;
      default:
        return <Cpu size={24} className="text-violet-400" />;
    }
  };

  const activePillar = skillPillars[currentSlide];

  return (
    <section className="tech-stack-section tech-stack-dark" id="stack">
      <div className="container">
        <div className="section-top reveal">
          <span className="eyebrow">
            <Code2 size={13} className="inline mr-1 text-violet-600" />
            05 / ENGINEERING ARSENAL & TOOLKIT
          </span>
          <span className="small-index">INTERACTIVE ARCHITECTURAL SLIDESHOW</span>
        </div>

      <div className="section-heading-row reveal">
        <div>
          <h2 className="font-unbounded">
            Structured for scale.
            <br />
            <span className="text-muted">Proven in production.</span>
          </h2>
        </div>
        <p>
          I select tools based on domain requirements, low-latency performance, and
          long-term maintainability.
        </p>
      </div>

      {/* Slideshow Top Controls: Slide Tabs + Prev/Next + Autoplay */}
      <div className="slideshow-controls-bar reveal">
        {/* Layer Selector Tabs */}
        <div className="slideshow-tabs flex flex-wrap gap-2">
          {skillPillars.map((pillar, idx) => (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`slideshow-tab-btn ${
                currentSlide === idx ? "is-active" : ""
              }`}
              aria-label={`Show ${pillar.title} slide`}
            >
              <span className="tab-num font-mono text-[11px] opacity-70">
                0{idx + 1}
              </span>
              <span>{pillar.title.split("&")[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="slideshow-nav-actions flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAutoPlay((p) => !p)}
            className="slideshow-action-btn"
            title={autoPlay ? "Pause Auto-slide" : "Play Auto-slide"}
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoPlay ? <Pause size={13} /> : <Play size={13} />}
            <span className="font-mono text-[11px] hidden sm:inline">
              {autoPlay ? "Auto ON" : "Paused"}
            </span>
          </button>

          <div className="slide-counter-badge font-mono text-xs">
            <span className="text-violet-300 font-bold">0{currentSlide + 1}</span>
            <span className="text-muted"> / 0{skillPillars.length}</span>
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="slideshow-arrow-btn"
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="slideshow-arrow-btn"
            aria-label="Next slide"
            title="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Slide Showcase Card */}
      <div className="slideshow-stage mt-6 reveal-scale">
        <div key={activePillar.id} className="slideshow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Pillar Summary */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="pillar-icon-box">
                  {getPillarIcon(activePillar.icon)}
                </div>
                <div>
                  <span className="pillar-badge">{activePillar.badge}</span>
                  <h3 className="pillar-title font-unbounded text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {activePillar.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {activePillar.description}
              </p>

              <div className="pillar-meta-box p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">ARCHITECTURAL DOMAIN</span>
                  <span className="text-violet-400 font-semibold">Tier-1 Production</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">ACTIVE COMPETENCIES</span>
                  <span className="text-cyan-400 font-semibold">{activePillar.skills.length} Specializations</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">COMPLIANCE</span>
                  <span className="text-emerald-400 font-semibold">Clean Code & SOLID</span>
                </div>
              </div>

              {/* Slide Progress Dots */}
              <div className="flex items-center gap-2 pt-2">
                {skillPillars.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={`slide-dot ${currentSlide === i ? "is-active" : ""}`}
                    aria-label={`Jump to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: In-Depth Skill Rows */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-white/10 text-xs font-mono text-muted">
                <span>CORE SPECIALIZATION</span>
                <span>PROFICIENCY & BENCHMARK</span>
              </div>

              {activePillar.skills.map((skill) => (
                <div key={skill.name} className="skill-slide-row">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-white flex items-center gap-2 text-sm">
                      <span className="skill-dot" />
                      {skill.name}
                    </span>
                    <span
                      className={`level-badge ${
                        skill.level === "Expert"
                          ? "level-expert"
                          : "level-advanced"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {skill.desc}
                  </p>

                  <div className="skill-meter-track mt-2">
                    <div
                      className="skill-meter-fill"
                      style={{
                        width: skill.level === "Expert" ? "95%" : "85%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Tech Marquee */}
      <div className="tech-marquee-wrapper mt-14 reveal" aria-hidden="true">
        <div className="marquee-label-row flex items-center justify-between pb-3 text-xs text-muted font-mono">
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-violet-400" />
            CORE RUNTIMES & CLOUD INFRASTRUCTURE
          </span>
          <span className="hidden sm:inline">END-TO-END OBSERVABILITY</span>
        </div>

        <div className="tech-marquee-strip">
          <div className="marquee-content-track">
            {[...techMarquee, ...techMarquee].map((tech, idx) => (
              <span key={idx} className="marquee-tech-pill">
                <span className="marquee-bullet">✦</span>
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CS Fundamentals & Architecture Badges */}
      <div className="cs-fundamentals-bar mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/5 reveal">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-sm font-bold text-violet-300 font-mono">
              SYSTEM DESIGN
            </div>
            <div className="text-xs text-muted mt-1">
              Microservices & Event-Driven
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-cyan-300 font-mono">
              ALGORITHMS & DSA
            </div>
            <div className="text-xs text-muted mt-1">
              Time & Space Complexity
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-emerald-300 font-mono">
              ACID GUARANTEES
            </div>
            <div className="text-xs text-muted mt-1">
              Transactions & Locking
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-amber-300 font-mono">
              CLEAN CODE
            </div>
            <div className="text-xs text-muted mt-1">
              SOLID & Design Patterns
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
