import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Film,
  Layers,
  Sparkles,
  Volume2,
  Wand2,
} from "lucide-react";
import { aiVideoSkills } from "../data/portfolio";

export default function AiVideoSkills() {
  const [activePillarIdx, setActivePillarIdx] = useState(0);

  const getPillarIcon = (id: string) => {
    switch (id) {
      case "diffusion":
        return <Layers size={24} className="text-violet-400" />;
      case "cinematography":
        return <Film size={24} className="text-cyan-400" />;
      case "multimodal":
        return <Volume2 size={24} className="text-emerald-400" />;
      case "automation":
        return <Cpu size={24} className="text-blue-400" />;
      default:
        return <Sparkles size={24} className="text-violet-400" />;
    }
  };

  const nextPillar = () => {
    setActivePillarIdx((prev) => (prev + 1) % aiVideoSkills.pillars.length);
  };

  const prevPillar = () => {
    setActivePillarIdx((prev) => (prev - 1 + aiVideoSkills.pillars.length) % aiVideoSkills.pillars.length);
  };

  const activePillar = aiVideoSkills.pillars[activePillarIdx];

  return (
    <section className="ai-video-section container" id="ai-video">
      <div className="section-top reveal">
        <span className="eyebrow flex items-center gap-1.5 text-violet-400">
          <Wand2 size={13} />
          {aiVideoSkills.badge}
        </span>
        <span className="small-index">DIFFUSION & NEURAL PIPELINES</span>
      </div>

      <div className="section-heading-row reveal">
        <h2>
          Neural cinematography.
          <br />
          <span className="text-muted">Generative video engineering.</span>
        </h2>
        <p>{aiVideoSkills.subtitle}</p>
      </div>

      {/* Real-time Engineering Stats */}
      <div className="ai-stats-row grid grid-cols-2 sm:grid-cols-4 gap-3 my-8 reveal">
        {aiVideoSkills.stats.map((s, idx) => (
          <div key={idx} className="ai-stat-box p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="font-mono text-xl sm:text-2xl font-bold text-violet-300">
              {s.value}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 4 Core Pillars Slideshow / Carousel */}
      <div className="ai-slideshow-wrap mt-8 reveal-scale">
        {/* Slideshow Header Tabs & Navigation */}
        <div className="slideshow-controls-bar">
          <div className="slideshow-tabs flex flex-wrap gap-2">
            {aiVideoSkills.pillars.map((pillar, idx) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarIdx(idx)}
                className={`slideshow-tab-btn ${
                  activePillarIdx === idx ? "is-active" : ""
                }`}
                aria-label={`View ${pillar.title} slide`}
              >
                <span className="tab-num font-mono text-[11px] opacity-70">
                  0{idx + 1}
                </span>
                <span>{pillar.title.split("&")[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className="slideshow-nav-actions flex items-center gap-2.5">
            <div className="slide-counter-badge font-mono text-xs">
              <span className="text-violet-300 font-bold">0{activePillarIdx + 1}</span>
              <span className="text-muted"> / 0{aiVideoSkills.pillars.length}</span>
            </div>

            <button
              type="button"
              onClick={prevPillar}
              className="slideshow-arrow-btn"
              aria-label="Previous neural pillar"
              title="Previous pillar"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={nextPillar}
              className="slideshow-arrow-btn"
              aria-label="Next neural pillar"
              title="Next pillar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Featured Slide Showcase Card */}
        <div className="slideshow-stage mt-6">
          <div key={activePillar.id} className="slideshow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="ai-icon-box">
                    {getPillarIcon(activePillar.id)}
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-violet-400 font-bold uppercase tracking-wider block">
                      {activePillar.category} // 0{activePillarIdx + 1}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-0.5">
                      {activePillar.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed pt-1">
                  {activePillar.desc}
                </p>

                {/* Highlight Callout */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-center gap-2.5 text-xs font-mono text-emerald-400">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                  <span>{activePillar.highlight}</span>
                </div>

                {/* Slide indicator dots */}
                <div className="flex items-center gap-2 pt-2">
                  {aiVideoSkills.pillars.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePillarIdx(i)}
                      className={`slide-dot ${activePillarIdx === i ? "is-active" : ""}`}
                      aria-label={`Jump to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Stack & Tools */}
              <div className="lg:col-span-6 space-y-4">
                <div className="pb-1 border-b border-white/10 text-xs font-mono text-muted">
                  SPECIALIZED PRODUCTION TOOLKIT & RUNTIMES
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {activePillar.tools.map((tool) => (
                    <div
                      key={tool}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-violet-500/40 transition-colors flex items-center gap-2"
                    >
                      <Sparkles size={13} className="text-violet-400 shrink-0" />
                      <span className="font-mono text-xs text-white font-medium">
                        {tool}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">PIPELINE VERIFICATION</span>
                    <span className="text-cyan-400 font-semibold">100% Tested Workflows</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">LATENCY & THROTTLING</span>
                    <span className="text-violet-400 font-semibold">&lt; 15s Per Keyframe Batch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
