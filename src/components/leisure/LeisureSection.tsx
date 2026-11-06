import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkles } from "lucide-react";
import LeisureImageStack from "./LeisureImageStack";

gsap.registerPlugin(ScrollTrigger);

export default function LeisureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingTextRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingTextRef.current;
    const desc = descRef.current;
    const stackWrap = stackWrapRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      // Entrance reveal when section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      if (heading) {
        tl.fromTo(
          heading,
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
        );
      }

      if (desc) {
        tl.fromTo(
          desc,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
      }

      if (stackWrap) {
        tl.fromTo(
          stackWrap,
          { scale: 0.94, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
          "-=0.5"
        );
      }
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beyond-the-code"
      className="leisure-floating-section relative bg-[#080808] text-white overflow-hidden border-t border-white/10 min-h-[92vh] flex flex-col justify-between py-12 sm:py-16 md:py-20 px-3 sm:px-6"
      aria-label="Beyond the Code — Lifestyle & Personality"
    >
      {/* Ambient Radial Spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[520px] bg-violet-600/[0.08] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Block: Editorial Badge, Headline & Deck */}
      <div
        ref={headerRef}
        className="leisure-header-block max-w-4xl mx-auto text-center space-y-2.5 z-40 relative select-none shrink-0"
      >
        {/* Editorial Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 font-mono text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
          <Compass size={12} className="text-violet-400 animate-pulse" />
          <span>LIFE OUTSIDE WORK / 001</span>
        </div>

        {/* Masked Headline */}
        <div className="overflow-hidden py-0.5">
          <h2
            ref={headingTextRef}
            className="font-unbounded font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.02]"
          >
            BEYOND THE CODE<span className="text-violet-400">.</span>
          </h2>
        </div>

        {/* Supporting Deck */}
        <p
          ref={descRef}
          className="font-sans text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
        >
          When I&apos;m not building digital experiences, I&apos;m exploring the things that inspire me.
        </p>
      </div>

      {/* Centerpiece: Interactive 3D Rotating Stack in the Exact Screenshot Composition */}
      <div
        ref={stackWrapRef}
        className="flex-1 flex items-center justify-center relative w-full overflow-visible py-4 sm:py-8 will-change-transform"
      >
        <LeisureImageStack />
      </div>

      {/* Minimal Footer Legend */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10.5px] font-mono text-gray-500 z-30 pointer-events-none shrink-0 pt-3">
        <div className="flex items-center gap-2">
          <Sparkles size={11} className="text-violet-400" />
          <span className="tracking-widest uppercase text-gray-400">
            INTERACTIVE 3D PERSPECTIVE · MOVE CURSOR TO ROTATE
          </span>
        </div>
        <span className="hidden sm:inline-block tracking-wider text-gray-500">
          HOVER ARTIFACTS TO EXPLORE DETAILS
        </span>
      </div>
    </section>
  );
}
