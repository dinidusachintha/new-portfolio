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
      // DESKTOP & TABLET (min-width: 768px): Pinned Cinematic Staged Animation
      // =========================================================================
      mm.add("(min-width: 768px)", () => {
        // STAGE 01: Entrance text initial state
        if (heading) {
          gsap.set(heading, { yPercent: 100, opacity: 0 });
        }
        if (desc) {
          gsap.set(desc, { y: 20, opacity: 0 });
        }

        // STAGE 02: Initial offscreen/dispersed positions for image cards
        if (carGaming) {
          gsap.set(carGaming, {
            xPercent: -140,
            yPercent: -20,
            rotate: -14,
            scale: 0.82,
            opacity: 0,
          });
        }
        if (netflix) {
          gsap.set(netflix, {
            xPercent: 140,
            yPercent: -20,
            rotate: 14,
            scale: 0.82,
            opacity: 0,
          });
        }
        if (spotify) {
          gsap.set(spotify, {
            yPercent: -150,
            scale: 0.85,
            opacity: 0,
          });
        }
        if (travel) {
          gsap.set(travel, {
            xPercent: -120,
            yPercent: 130,
            rotate: -10,
            scale: 0.82,
            opacity: 0,
          });
        }
        if (coding) {
          gsap.set(coding, {
            xPercent: 120,
            yPercent: 130,
            rotate: 10,
            scale: 0.82,
            opacity: 0,
          });
        }
        if (portrait) {
          gsap.set(portrait, {
            scale: 0.72,
            opacity: 0,
            clipPath: "inset(16% 16% 16% 16% round 32px)",
          });
        }

        // Section Heading Scroll Reveal Trigger
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
            scrub: 1.2,
            anticipatePin: 1,
          },
        });

        // -----------------------------------------------------------------------
        // STAGE 02: Staggered Fly-In into Overlapping Composition
        // -----------------------------------------------------------------------
        // 1. Car Gaming flies in from upper left
        if (carGaming) {
          tl.to(
            carGaming,
            {
              xPercent: 0,
              yPercent: 0,
              rotate: -4,
              scale: 1,
              opacity: 1,
              duration: 1.4,
              ease: "power3.out",
            },
            0
          );
        }

        // 2. Netflix flies in from upper right (slight stagger)
        if (netflix) {
          tl.to(
            netflix,
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 3.5,
              scale: 1,
              opacity: 1,
              duration: 1.4,
              ease: "power3.out",
            },
            0.15
          );
        }

        // 3. Spotify drops down from top center
        if (spotify) {
          tl.to(
            spotify,
            {
              yPercent: 0,
              rotate: -1.5,
              scale: 1,
              opacity: 1,
              duration: 1.3,
              ease: "power3.out",
            },
            0.25
          );
        }

        // 4. Travel sweeps in from bottom left
        if (travel) {
          tl.to(
            travel,
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 2.5,
              scale: 1,
              opacity: 1,
              duration: 1.4,
              ease: "power3.out",
            },
            0.35
          );
        }

        // 5. Coding sweeps in from bottom right
        if (coding) {
          tl.to(
            coding,
            {
              xPercent: 0,
              yPercent: 0,
              rotate: -3,
              scale: 1,
              opacity: 1,
              duration: 1.4,
              ease: "power3.out",
            },
            0.45
          );
        }

        // 6. Central Portrait arrives last and expands prominently above all
        if (portrait) {
          tl.to(
            portrait,
            {
              scale: 1,
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              duration: 1.6,
              ease: "power3.out",
            },
            0.7
          );
        }

        // -----------------------------------------------------------------------
        // STAGE 03: Pinned Composition Layered Parallax Hold
        // -----------------------------------------------------------------------
        // Multi-layered depth parallax while user scrubs through the settled composition
        if (carGaming) {
          tl.to(
            carGaming,
            {
              y: -30,
              x: -12,
              rotate: -5,
              duration: 1.6,
              ease: "none",
            },
            2.3
          );
        }
        if (netflix) {
          tl.to(
            netflix,
            {
              y: -24,
              x: 12,
              rotate: 4.5,
              duration: 1.6,
              ease: "none",
            },
            2.3
          );
        }
        if (spotify) {
          tl.to(
            spotify,
            {
              y: -36,
              duration: 1.6,
              ease: "none",
            },
            2.3
          );
        }
        if (travel) {
          tl.to(
            travel,
            {
              y: 22,
              x: -10,
              rotate: 3.5,
              duration: 1.6,
              ease: "none",
            },
            2.3
          );
        }
        if (coding) {
          tl.to(
            coding,
            {
              y: 26,
              x: 10,
              rotate: -4,
              duration: 1.6,
              ease: "none",
            },
            2.3
          );
        }
        if (portrait) {
          tl.to(
            portrait,
            {
              y: -14,
              scale: 1.02,
              duration: 1.6,
              ease: "none",
            },
            2.3
          );
        }

        // -----------------------------------------------------------------------
        // STAGE 05: Cinematic Exit Animation (Outward Dispersion & Pin Release)
        // -----------------------------------------------------------------------
        if (carGaming) {
          tl.to(
            carGaming,
            {
              xPercent: -70,
              yPercent: -40,
              opacity: 0.15,
              scale: 0.9,
              duration: 1.2,
              ease: "power2.inOut",
            },
            3.9
          );
        }
        if (netflix) {
          tl.to(
            netflix,
            {
              xPercent: 70,
              yPercent: -40,
              opacity: 0.15,
              scale: 0.9,
              duration: 1.2,
              ease: "power2.inOut",
            },
            3.9
          );
        }
        if (spotify) {
          tl.to(
            spotify,
            {
              yPercent: -60,
              opacity: 0.15,
              duration: 1.2,
              ease: "power2.inOut",
            },
            3.9
          );
        }
        if (travel) {
          tl.to(
            travel,
            {
              xPercent: -60,
              yPercent: 60,
              opacity: 0.15,
              scale: 0.9,
              duration: 1.2,
              ease: "power2.inOut",
            },
            3.9
          );
        }
        if (coding) {
          tl.to(
            coding,
            {
              xPercent: 60,
              yPercent: 60,
              opacity: 0.15,
              scale: 0.9,
              duration: 1.2,
              ease: "power2.inOut",
            },
            3.9
          );
        }
        if (portrait) {
          tl.to(
            portrait,
            {
              scale: 1.06,
              opacity: 0.35,
              duration: 1.2,
              ease: "power2.inOut",
            },
            3.9
          );
        }
        if (headerRef.current) {
          tl.to(
            headerRef.current,
            {
              opacity: 0.2,
              y: -25,
              duration: 0.8,
              ease: "power2.inOut",
            },
            3.9
          );
        }
      });

      // =========================================================================
      // MOBILE (< 768px): Fluid Responsive Layout without Sticky Traps
      // =========================================================================
      mm.add("(max-width: 767px)", () => {
        // Reset transform positions so cards render cleanly in fluid mobile viewport
        const elements = [portrait, carGaming, netflix, spotify, travel, coding];
        elements.forEach((el) => {
          if (el) {
            gsap.set(el, {
              clearProps: "all",
            });
          }
        });

        // Smooth staggered reveal on scroll into view
        gsap.from(elements.filter(Boolean), {
          scrollTrigger: {
            trigger: pinTrack,
            start: "top 75%",
          },
          y: 40,
          opacity: 0,
          scale: 0.92,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
        });
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
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[500px] bg-violet-600/[0.08] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Pinned Scroll Track Container */}
      <div
        ref={pinTrackRef}
        className="leisure-pin-track relative w-full md:h-[380vh]"
      >
        <div
          ref={pinViewportRef}
          className="leisure-pin-viewport md:sticky md:top-0 w-full md:h-screen md:max-h-screen overflow-hidden flex flex-col justify-between py-12 md:py-16 px-4 sm:px-8"
        >
          {/* Header Block: Main Heading & Deck */}
          <div
            ref={headerRef}
            className="leisure-header-block max-w-4xl mx-auto text-center space-y-3 z-40 relative select-none pointer-events-none mb-6"
          >
            {/* Editorial Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 font-mono text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
              <Compass size={13} className="text-violet-400" />
              <span>LIFE OUTSIDE WORK / 001</span>
            </div>

            {/* Masked Upward Reveal Heading */}
            <div className="overflow-hidden py-1">
              <h2
                ref={headingTextRef}
                className="font-unbounded font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.02]"
              >
                BEYOND THE CODE<span className="text-violet-400">.</span>
              </h2>
            </div>

            {/* Supporting Description */}
            <p
              ref={descRef}
              className="font-sans text-sm sm:text-base md:text-lg text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
            >
              When I&apos;m not building digital experiences, I&apos;m exploring the things that inspire me.
            </p>
          </div>

          {/* Central Layered Floating Image Composition */}
          <div className="flex-1 flex items-center justify-center relative w-full">
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
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-gray-500 z-30 pointer-events-none pt-4">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-violet-400" />
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
