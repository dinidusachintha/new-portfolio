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
import FlyingHeading from "./FlyingHeading";

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
        return <Layout size={24} className="text-[#7FB3B8]" />;
      case "Server":
        return <Server size={24} className="text-[#C8601F]" />;
      case "Database":
        return <Database size={24} className="text-[#7FB3B8]" />;
      case "Cloud":
        return <Cloud size={24} className="text-[#2E6F73]" />;
      default:
        return <Cpu size={24} className="text-[#EADCC8]" />;
    }
  };

  const activePillar = skillPillars[currentSlide];

  return (
    <>
      {/* SECTION 1: ENGINEERING ARSENAL & TOOLKIT */}
      <section className="tech-stack-section tech-stack-arsenal" id="stack">
        <div className="container">
          <div className="section-top reveal">
            <span className="eyebrow flex items-center gap-1.5 font-mono text-[#7FB3B8]">
              <Code2 size={13} className="text-[#C8601F]" />
              05 / ENGINEERING ARSENAL & TOOLKIT
            </span>
            <span className="small-index font-mono text-[#8E9EA0]">INTERACTIVE ARCHITECTURAL SLIDESHOW</span>
          </div>

          <div className="section-heading-row reveal">
            <div>
              <FlyingHeading
                line1="Structured for scale."
                line2="Proven in production."
                line2ClassName="text-[#8E9EA0]"
                className="font-unbounded"
              />
            </div>
            <p className="text-[#8E9EA0]">
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
                <span className="text-[#7FB3B8] font-bold">0{currentSlide + 1}</span>
                <span className="text-[#8E9EA0]"> / 0{skillPillars.length}</span>
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

          {/* Main Slide Showcase Card with Premium Glass Effect */}
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
                      <span className="pillar-badge font-mono">{activePillar.badge}</span>
                      <h3 className="pillar-title font-unbounded text-xl sm:text-2xl font-bold text-[#EADCC8] mt-0.5">
                        {activePillar.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-[#cbd5e1] leading-relaxed">
                    {activePillar.description}
                  </p>

                  <div className="pillar-meta-box p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8E9EA0]">ARCHITECTURAL DOMAIN</span>
                      <span className="text-[#C8601F] font-semibold">Tier-1 Production</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8E9EA0]">ACTIVE COMPETENCIES</span>
                      <span className="text-[#7FB3B8] font-semibold">{activePillar.skills.length} Specializations</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8E9EA0]">COMPLIANCE</span>
                      <span className="text-[#EADCC8] font-semibold">Clean Code & SOLID</span>
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
                  <div className="flex items-center justify-between pb-1 border-b border-white/10 text-xs font-mono text-[#8E9EA0]">
                    <span>CORE SPECIALIZATION</span>
                    <span>PROFICIENCY & BENCHMARK</span>
                  </div>

                  {activePillar.skills.map((skill) => (
                    <div key={skill.name} className="skill-slide-row">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-[#EADCC8] flex items-center gap-2 text-sm font-medium">
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

                      <p className="text-xs text-[#94a3b8] leading-relaxed">
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
        </div>
      </section>

      {/* SECTION 2: CORE RUNTIMES & CLOUD INFRASTRUCTURE */}
      <section className="core-runtimes-section tech-stack-dark" id="runtimes">
        <div className="container">
          <div className="section-top reveal mb-5">
            <span className="eyebrow flex items-center gap-1.5 font-mono text-[#7FB3B8]">
              <Zap size={13} className="text-[#C8601F]" />
              CORE RUNTIMES & CLOUD INFRASTRUCTURE
            </span>
            <span className="small-index font-mono text-[#8E9EA0]">END-TO-END OBSERVABILITY</span>
          </div>

          {/* Infinite Tech Marquee with Floating Glass Pills */}
          <div className="tech-marquee-wrapper reveal" aria-hidden="true">
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

          {/* CS Fundamentals & Architecture Badges with Frosted Glass */}
          <div className="cs-fundamentals-bar mt-10 p-5 rounded-2xl reveal">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <div className="text-sm font-bold text-[#7FB3B8] font-mono tracking-wide">
                  SYSTEM DESIGN
                </div>
                <div className="text-xs text-[#8E9EA0] mt-1">
                  Microservices & Event-Driven
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-bold text-[#EADCC8] font-mono tracking-wide">
                  ALGORITHMS & DSA
                </div>
                <div className="text-xs text-[#8E9EA0] mt-1">
                  Time & Space Complexity
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-bold text-[#7FB3B8] font-mono tracking-wide">
                  ACID GUARANTEES
                </div>
                <div className="text-xs text-[#8E9EA0] mt-1">
                  Transactions & Locking
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-bold text-[#C8601F] font-mono tracking-wide">
                  CLEAN CODE
                </div>
                <div className="text-xs text-[#8E9EA0] mt-1">
                  SOLID & Design Patterns
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
