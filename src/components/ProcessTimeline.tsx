import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowDown } from "lucide-react";
import { processSteps } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const fillLine = fillLineRef.current;
    if (!container || !fillLine) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      fillLine.style.transform = "scaleY(1)";
      stepRefs.current.forEach((el) => el?.classList.add("is-active"));
      nodeRefs.current.forEach((el) => el?.classList.add("is-active"));
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Violet fill line scrubbed along the vertical track (transform-origin: top)
      gsap.fromTo(
        fillLine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current || container,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );

      // 2. Class toggling for each node and step content (0 per-frame style writes)
      stepRefs.current.forEach((stepEl, idx) => {
        if (!stepEl) return;
        const nodeEl = nodeRefs.current[idx];

        ScrollTrigger.create({
          trigger: stepEl,
          start: "top 68%",
          onEnter: () => {
            stepEl.classList.add("is-active");
            nodeEl?.classList.add("is-active");
          },
          onLeaveBack: () => {
            stepEl.classList.remove("is-active");
            nodeEl?.classList.remove("is-active");
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="process"
      className="process-section container"
      aria-labelledby="process-timeline-title"
    >
      <div className="process-layout-grid">
        {/* Left Column: Sticky Section Heading on Desktop */}
        <div className="process-left-sticky">
          <div className="sticky top-28 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#9867ff]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#9867ff]">
                04 // METHODOLOGY & EXECUTION
              </span>
            </div>

            <h2
              id="process-timeline-title"
              className="font-unbounded text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
            >
              How systems <br />
              <span className="text-[#9867ff]">come alive.</span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm">
              From whiteboard architecture and domain decomposition to production-hardened deployments.
            </p>

            <div className="pt-2 hidden lg:flex items-center gap-2 text-xs font-mono text-gray-500">
              <ArrowDown size={14} className="text-[#9867ff] animate-bounce" />
              <span>Scroll down to trace steps</span>
            </div>
          </div>
        </div>

        {/* Right Column: Process Timeline Track with Scroll-Driven Fill Line */}
        <div className="process-right-timeline">
          <div ref={trackRef} className="process-timeline-track">
            {/* Background 2px track */}
            <div className="process-track-bg" />
            {/* Scroll-scrubbed violet fill line */}
            <div ref={fillLineRef} className="process-track-fill" />

            {/* Timeline Steps */}
            <div className="process-steps-list">
              {processSteps.map((step, idx) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  className="process-step-item"
                >
                  {/* 14px Node Circle */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[idx] = el;
                    }}
                    className="process-node-circle"
                    aria-hidden="true"
                  >
                    <span className="process-node-core" />
                  </div>

                  {/* Step Card Content */}
                  <div className="process-step-card">
                    <span className="process-step-number font-mono text-xl sm:text-2xl font-bold text-[#9867ff] block mb-2">
                      {step.number}
                    </span>
                    <h3 className="font-unbounded text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
