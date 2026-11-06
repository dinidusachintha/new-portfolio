import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeisureIntro from "./LeisureIntro";
import LeisureActivityPanel from "./LeisureActivityPanel";
import LeisureProgressIndicator from "./LeisureProgressIndicator";
import { leisureActivities } from "./leisureData";

gsap.registerPlugin(ScrollTrigger);

export default function LeisureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const stagePinRef = useRef<HTMLDivElement>(null);
  const frameCardRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = scrollTrackRef.current;
    const stage = stagePinRef.current;
    const frame = frameCardRef.current;

    if (!section || !track || !stage || !frame) return;

    // Use GSAP Context for 100% clean React 18/19 lifecycle cleanup
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =========================================================================
      // DESKTOP & TABLET: Pinned Cinematic Campione-Style Scroll Experience
      // =========================================================================
      mm.add("(min-width: 768px)", () => {
        // Initial States for Panels
        // Panel 0 starts inside framed card
        gsap.set(frame, {
          clipPath: "inset(8% 8% 8% 8% round 32px)",
          scale: 0.9,
          transformOrigin: "center center",
        });

        // Panels 1 through 4 start clipped from bottom
        panelRefs.current.forEach((panel, idx) => {
          if (!panel) return;
          if (idx === 0) {
            gsap.set(panel, { clipPath: "none", zIndex: 1 });
            const title = panel.querySelector(".leisure-panel-title");
            const desc = panel.querySelector(".leisure-panel-desc");
            const pill = panel.querySelector(".leisure-panel-category-pill");
            if (title) gsap.set(title, { yPercent: 40, opacity: 0.6 });
            if (desc) gsap.set(desc, { opacity: 0.6, y: 15 });
            if (pill) gsap.set(pill, { y: 15, opacity: 0.7 });
          } else {
            gsap.set(panel, {
              clipPath: "inset(100% 0% 0% 0%)",
              zIndex: idx + 2,
            });
            const img = panel.querySelector(".leisure-panel-img");
            const title = panel.querySelector(".leisure-panel-title");
            const desc = panel.querySelector(".leisure-panel-desc");
            const pill = panel.querySelector(".leisure-panel-category-pill");
            const watermark = panel.querySelector(".leisure-watermark-number");

            if (img) gsap.set(img, { scale: 1.18, yPercent: -8 });
            if (title) gsap.set(title, { yPercent: 100, opacity: 0 });
            if (desc) gsap.set(desc, { y: 25, opacity: 0 });
            if (pill) gsap.set(pill, { y: 15, opacity: 0 });
            if (watermark) gsap.set(watermark, { yPercent: 30, opacity: 0 });
          }
        });

        // Main Pinned Scrub Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            pin: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              setScrollProgress(p);

              // Update active index based on scrub position across 5 panels
              if (p < 0.22) {
                setCurrentIndex(0);
              } else if (p < 0.42) {
                setCurrentIndex(1);
              } else if (p < 0.62) {
                setCurrentIndex(2);
              } else if (p < 0.82) {
                setCurrentIndex(3);
              } else {
                setCurrentIndex(4);
              }
            },
          },
        });

        // -----------------------------------------------------------------------
        // PHASE B: Expansion of First Card (Car Gaming) to Full Viewport
        // -----------------------------------------------------------------------
        const panel0 = panelRefs.current[0];
        const panel0Img = panel0?.querySelector(".leisure-panel-img");
        const panel0Title = panel0?.querySelector(".leisure-panel-title");
        const panel0Desc = panel0?.querySelector(".leisure-panel-desc");
        const panel0Pill = panel0?.querySelector(".leisure-panel-category-pill");

        tl.to(
          frame,
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0
        );

        if (panel0Img) {
          tl.to(panel0Img, { scale: 1.05, duration: 1.2, ease: "power2.inOut" }, 0);
        }
        if (panel0Title) {
          tl.to(panel0Title, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.2);
        }
        if (panel0Desc) {
          tl.to(panel0Desc, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.3);
        }
        if (panel0Pill) {
          tl.to(panel0Pill, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.15);
        }

        // Brief hold on Panel 0
        tl.to({}, { duration: 0.4 });

        // -----------------------------------------------------------------------
        // PHASE C: Sequential Cinematic Clip-Path Transitions (01 -> 05)
        // -----------------------------------------------------------------------
        for (let i = 1; i < leisureActivities.length; i++) {
          const prevPanel = panelRefs.current[i - 1];
          const currPanel = panelRefs.current[i];
          if (!currPanel) continue;

          const prevImg = prevPanel?.querySelector(".leisure-panel-img");
          const prevTitle = prevPanel?.querySelector(".leisure-panel-title");
          const prevDesc = prevPanel?.querySelector(".leisure-panel-desc");
          const prevPill = prevPanel?.querySelector(".leisure-panel-category-pill");

          const currImg = currPanel.querySelector(".leisure-panel-img");
          const currTitle = currPanel.querySelector(".leisure-panel-title");
          const currDesc = currPanel.querySelector(".leisure-panel-desc");
          const currPill = currPanel.querySelector(".leisure-panel-category-pill");
          const currWatermark = currPanel.querySelector(".leisure-watermark-number");

          const stepStartTime = tl.duration();

          // Animate outgoing panel text & image scale
          if (prevImg) {
            tl.to(prevImg, { scale: 1.14, duration: 1.2, ease: "power2.inOut" }, stepStartTime);
          }
          if (prevTitle) {
            tl.to(prevTitle, { yPercent: -50, opacity: 0, duration: 0.6, ease: "power2.in" }, stepStartTime);
          }
          if (prevDesc) {
            tl.to(prevDesc, { y: -20, opacity: 0, duration: 0.5, ease: "power2.in" }, stepStartTime);
          }
          if (prevPill) {
            tl.to(prevPill, { opacity: 0, duration: 0.4 }, stepStartTime);
          }

          // Incoming Panel reveals via full-screen clip-path curtain wipe
          tl.to(
            currPanel,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              ease: "power3.inOut",
            },
            stepStartTime
          );

          // Parallax settling of incoming image
          if (currImg) {
            tl.to(
              currImg,
              {
                scale: 1.05,
                yPercent: 0,
                duration: 1.2,
                ease: "power2.out",
              },
              stepStartTime
            );
          }

          // Masked Typography reveals for incoming panel
          if (currTitle) {
            tl.to(
              currTitle,
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.85,
                ease: "power3.out",
              },
              stepStartTime + 0.35
            );
          }
          if (currDesc) {
            tl.to(
              currDesc,
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power3.out",
              },
              stepStartTime + 0.45
            );
          }
          if (currPill) {
            tl.to(
              currPill,
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power3.out",
              },
              stepStartTime + 0.25
            );
          }
          if (currWatermark) {
            tl.to(
              currWatermark,
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power2.out",
              },
              stepStartTime + 0.3
            );
          }

          // Hold period on this panel before transitioning to next
          tl.to({}, { duration: 0.5 });
        }

        // Final hold on Panel 05 (Coding) before unpinning smoothly
        tl.to({}, { duration: 0.4 });
      });

      // =========================================================================
      // MOBILE: Fluid Touch-Optimized Scroll with ScrollTrigger Panels
      // =========================================================================
      mm.add("(max-width: 767px)", () => {
        panelRefs.current.forEach((panel) => {
          if (!panel) return;
          gsap.set(panel, { clipPath: "none" });
        });
      });

      // =========================================================================
      // REDUCED MOTION ACCESSIBILITY
      // =========================================================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        panelRefs.current.forEach((panel) => {
          if (!panel) return;
          gsap.set(panel, { clipPath: "none", opacity: 1 });
        });
      });
    }, sectionRef);

    // Refresh ScrollTrigger after assets settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Jump to specific activity chapter on indicator click
  const handleSelectChapter = (targetIndex: number) => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const st = ScrollTrigger.getById("leisure-pin-st") || ScrollTrigger.getAll().find((s) => s.trigger === track);
    if (st) {
      const stepFraction = targetIndex / (leisureActivities.length - 1);
      const targetScroll = st.start + (st.end - st.start) * stepFraction;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="beyond-the-code"
      className="leisure-section relative bg-[#06070a] text-white overflow-hidden border-t border-white/10"
      aria-label="Beyond the Code — Leisure & Lifestyle Archive"
    >
      {/* Background Atmosphere Spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. SECTION INTRO (Editorial Heading & Deck) */}
      <LeisureIntro />

      {/* 2. DESKTOP / TABLET: Pinned Campione Viewport Stage */}
      <div
        ref={scrollTrackRef}
        className="leisure-scroll-track relative hidden md:block w-full h-[520vh]"
      >
        <div
          ref={stagePinRef}
          className="leisure-stage-pin sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black"
        >
          {/* Framed Card Container that expands on scroll */}
          <div
            ref={frameCardRef}
            className="leisure-frame-card relative w-full h-full overflow-hidden shadow-2xl"
          >
            {leisureActivities.map((activity, idx) => (
              <LeisureActivityPanel
                key={activity.id}
                ref={(el) => {
                  panelRefs.current[idx] = el;
                }}
                activity={activity}
                index={idx}
                isActive={currentIndex === idx}
              />
            ))}
          </div>

          {/* Floating Minimal Progress Indicator (Campione Style) */}
          <div className="absolute top-6 sm:top-8 right-6 sm:right-10 z-30 pointer-events-none">
            <LeisureProgressIndicator
              currentIndex={currentIndex}
              progress={scrollProgress}
              total={leisureActivities.length}
              activities={leisureActivities}
              onSelectIndex={handleSelectChapter}
            />
          </div>

          {/* Subtle Corner Ambient Label */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 z-30 pointer-events-none flex items-center gap-2 font-mono text-[11px] text-white/40 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-violet-400/80 animate-ping" />
            <span>CAMPIONE CINEMATIC EXPERIENCE</span>
          </div>
        </div>
      </div>

      {/* 3. MOBILE ADAPTIVE VIEW (Fluid Stacked Full-Height Viewports) */}
      <div className="leisure-mobile-track md:hidden px-4 pb-20 space-y-8">
        {leisureActivities.map((activity, idx) => (
          <div
            key={`mobile-${activity.id}`}
            className="leisure-mobile-card relative h-[80vh] min-h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <LeisureActivityPanel
              activity={activity}
              index={idx}
              isActive={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
