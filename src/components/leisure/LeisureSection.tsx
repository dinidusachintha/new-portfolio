import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkles } from "lucide-react";
import LeisureImageStack from "./LeisureImageStack";

gsap.registerPlugin(ScrollTrigger);

export default function LeisureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const pinViewportRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingTextRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Card element refs
  const portraitRef = useRef<HTMLDivElement>(null);
  const carGamingRef = useRef<HTMLDivElement>(null);
  const netflixRef = useRef<HTMLDivElement>(null);
  const spotifyRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const codingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinTrack = pinTrackRef.current;
    const pinViewport = pinViewportRef.current;
    const heading = headingTextRef.current;
    const desc = descRef.current;

    const portrait = portraitRef.current;
    const carGaming = carGamingRef.current;
    const netflix = netflixRef.current;
    const spotify = spotifyRef.current;
    const travel = travelRef.current;
    const coding = codingRef.current;

    if (!section || !pinTrack || !pinViewport) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =========================================================================
      // DESKTOP & TABLET: Pinned Smooth Floating Stack Scrub Animation
      // =========================================================================
      mm.add("(min-width: 768px)", () => {
        // Initial setup: Header
        if (heading) gsap.set(heading, { yPercent: 100, opacity: 0 });
        if (desc) gsap.set(desc, { y: 20, opacity: 0 });

        // Initial setup: Cards start slightly compacted near center
        if (portrait) gsap.set(portrait, { scale: 0.8, opacity: 0 });
        if (spotify) gsap.set(spotify, { y: 55, opacity: 0 });
        if (carGaming) gsap.set(carGaming, { x: 65, y: 45, opacity: 0 });
        if (netflix) gsap.set(netflix, { x: -65, y: 45, opacity: 0 });
        if (travel) gsap.set(travel, { x: 55, y: -55, opacity: 0 });
        if (coding) gsap.set(coding, { x: -55, y: -45, opacity: 0 });

        // Header Reveal
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => {
            gsap.to(heading, {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            });
            gsap.to(desc, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2,
              ease: "power3.out",
            });
          },
        });

        // Main Pinned Scrub Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTrack,
            pin: pinViewport,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            anticipatePin: 1,
          },
        });

        // STAGE 01: Expansion into the exact reference screenshot arrangement
        if (portrait) {
          tl.to(
            portrait,
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            0
          );
        }
        if (carGaming) {
          tl.to(
            carGaming,
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            0.1
          );
        }
        if (netflix) {
          tl.to(
            netflix,
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            0.15
          );
        }
        if (spotify) {
          tl.to(
            spotify,
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
            },
            0.2
          );
        }
        if (travel) {
          tl.to(
            travel,
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            0.25
          );
        }
        if (coding) {
          tl.to(
            coding,
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            0.3
          );
        }

        // STAGE 02: Pinned Hold with Multi-Layer Floating Parallax
        if (portrait) {
          tl.to(
            portrait,
            {
              y: -8,
              scale: 1.01,
              duration: 1.5,
              ease: "none",
            },
            1.6
          );
        }
        if (carGaming) {
          tl.to(
            carGaming,
            {
              y: -20,
              x: -10,
              duration: 1.5,
              ease: "none",
            },
            1.6
          );
        }
        if (netflix) {
          tl.to(
            netflix,
            {
              y: -18,
              x: 10,
              duration: 1.5,
              ease: "none",
            },
            1.6
          );
        }
        if (spotify) {
          tl.to(
            spotify,
            {
              y: -26,
              duration: 1.5,
              ease: "none",
            },
            1.6
          );
        }
        if (travel) {
          tl.to(
            travel,
            {
              y: 18,
              x: -8,
              duration: 1.5,
              ease: "none",
            },
            1.6
          );
        }
        if (coding) {
          tl.to(
            coding,
            {
              y: 20,
              x: 8,
              duration: 1.5,
              ease: "none",
            },
            1.6
          );
        }

        // STAGE 03: Smooth Outward Drift Exit into Next Section
        if (carGaming) {
          tl.to(
            carGaming,
            {
              x: -45,
              y: -30,
              opacity: 0.2,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.2
          );
        }
        if (netflix) {
          tl.to(
            netflix,
            {
              x: 45,
              y: -30,
              opacity: 0.2,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.2
          );
        }
        if (spotify) {
          tl.to(
            spotify,
            {
              y: -40,
              opacity: 0.2,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.2
          );
        }
        if (travel) {
          tl.to(
            travel,
            {
              x: -40,
              y: 40,
              opacity: 0.2,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.2
          );
        }
        if (coding) {
          tl.to(
            coding,
            {
              x: 40,
              y: 40,
              opacity: 0.2,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.2
          );
        }
        if (portrait) {
          tl.to(
            portrait,
            {
              scale: 1.05,
              opacity: 0.35,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.2
          );
        }
        if (headerRef.current) {
          tl.to(
            headerRef.current,
            {
              opacity: 0.25,
              y: -20,
              duration: 0.8,
              ease: "power2.inOut",
            },
            3.2
          );
        }
      });

      // =========================================================================
      // MOBILE (< 768px): Smooth Mobile Touch Pinned Experience
      // =========================================================================
      mm.add("(max-width: 767px)", () => {
        // Initial setup for mobile
        if (portrait) gsap.set(portrait, { scale: 0.85, opacity: 0 });
        if (spotify) gsap.set(spotify, { y: 35, opacity: 0 });
        if (carGaming) gsap.set(carGaming, { x: 40, y: 30, opacity: 0 });
        if (netflix) gsap.set(netflix, { x: -40, y: 30, opacity: 0 });
        if (travel) gsap.set(travel, { x: 35, y: -35, opacity: 0 });
        if (coding) gsap.set(coding, { x: -35, y: -30, opacity: 0 });

        // Mobile Scrub Timeline
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTrack,
            pin: pinViewport,
            start: "top top",
            end: "+=160%",
            scrub: 0.9,
            anticipatePin: 1,
          },
        });

        // Expansion into place
        mobileTl.to(
          [portrait, carGaming, netflix, spotify, travel, coding].filter(Boolean),
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.08,
            duration: 1,
            ease: "power2.out",
          },
          0
        );

        // Subtle floating drift
        mobileTl.to(
          [carGaming, spotify, netflix].filter(Boolean),
          {
            y: -12,
            duration: 1,
            ease: "none",
          },
          1.1
        );
        mobileTl.to(
          [travel, coding].filter(Boolean),
          {
            y: 12,
            duration: 1,
            ease: "none",
          },
          1.1
        );

        // Gentle exit fade
        mobileTl.to(
          [portrait, carGaming, netflix, spotify, travel, coding].filter(Boolean),
          {
            opacity: 0.4,
            duration: 0.6,
            ease: "power2.inOut",
          },
          2.2
        );
      });

      // =========================================================================
      // ACCESSIBILITY: Reduced Motion
      // =========================================================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const elements = [portrait, carGaming, netflix, spotify, travel, coding];
        elements.forEach((el) => {
          if (el) gsap.set(el, { clearProps: "all", opacity: 1 });
        });
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beyond-the-code"
      className="leisure-floating-section relative bg-[#080808] text-white overflow-hidden border-t border-white/10"
      aria-label="Beyond the Code — Floating Image Composition"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[550px] bg-violet-600/[0.07] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Pinned Scroll Track Container */}
      <div
        ref={pinTrackRef}
        className="leisure-pin-track relative w-full h-[220vh] md:h-[340vh]"
      >
        <div
          ref={pinViewportRef}
          className="leisure-pin-viewport sticky top-0 w-full h-screen max-h-screen overflow-hidden flex flex-col justify-between py-8 sm:py-12 md:py-14 px-3 sm:px-6"
        >
          {/* Header Block: Main Heading & Deck */}
          <div
            ref={headerRef}
            className="leisure-header-block max-w-4xl mx-auto text-center space-y-2.5 z-40 relative select-none pointer-events-none shrink-0"
          >
            {/* Editorial Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 font-mono text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
              <Compass size={12} className="text-violet-400 animate-pulse" />
              <span>LIFE OUTSIDE WORK / 001</span>
            </div>

            {/* Masked Upward Reveal Heading */}
            <div className="overflow-hidden py-0.5">
              <h2
                ref={headingTextRef}
                className="font-unbounded font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.02]"
              >
                BEYOND THE CODE<span className="text-violet-400">.</span>
              </h2>
            </div>

            {/* Supporting Description */}
            <p
              ref={descRef}
              className="font-sans text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
            >
              When I&apos;m not building digital experiences, I&apos;m exploring the things that inspire me.
            </p>
          </div>

          {/* Central Layered Floating Image Composition */}
          <div className="flex-1 flex items-center justify-center relative w-full overflow-visible py-2 sm:py-4">
            <LeisureImageStack
              portraitRef={portraitRef}
              carGamingRef={carGamingRef}
              netflixRef={netflixRef}
              spotifyRef={spotifyRef}
              travelRef={travelRef}
              codingRef={codingRef}
            />
          </div>

          {/* Minimalist Bottom Subtle Legend */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10.5px] font-mono text-gray-500 z-30 pointer-events-none shrink-0 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles size={11} className="text-violet-400" />
              <span className="tracking-widest uppercase text-gray-400">
                SCROLL-DRIVEN COMPOSITION
              </span>
            </div>
            <span className="hidden sm:inline-block tracking-wider text-gray-500">
              HOVER TO INSPECT ARTIFACTS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
