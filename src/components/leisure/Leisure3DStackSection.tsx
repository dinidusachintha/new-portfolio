import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkles, Trophy } from "lucide-react";
import LeisureImageCard from "./LeisureImageCard";
import { portraitCard, floatingLeisureCards } from "./leisureData";

gsap.registerPlugin(ScrollTrigger);

export default function Leisure3DStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const pinViewportRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const singleCardRef = useRef<HTMLDivElement>(null);
  const phaseIndicatorRef = useRef<HTMLSpanElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const carGamingCard = floatingLeisureCards.find((c) => c.id === "car-gaming")!;
  const netflixCard = floatingLeisureCards.find((c) => c.id === "netflix")!;
  const spotifyCard = floatingLeisureCards.find((c) => c.id === "spotify")!;
  const travelCard = floatingLeisureCards.find((c) => c.id === "travel")!;
  const codingCard = floatingLeisureCards.find((c) => c.id === "coding")!;

  useEffect(() => {
    const section = sectionRef.current;
    const pinTrack = pinTrackRef.current;
    const pinViewport = pinViewportRef.current;
    const cluster = clusterRef.current;
    const singleCard = singleCardRef.current;
    const phaseIndicator = phaseIndicatorRef.current;

    if (!section || !pinTrack || !pinViewport || !cluster || !singleCard) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =========================================================================
      // DESKTOP & TABLET: Master 5-Phase Scroll-Driven 3D Rotation Timeline
      // =========================================================================
      mm.add("(min-width: 768px)", () => {
        // Initial 3D Setup
        gsap.set(cluster, {
          rotateY: -90,
          opacity: 1,
          transformPerspective: 1200,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        gsap.set(singleCard, {
          rotateY: -90,
          opacity: 0,
          scale: 0.9,
          pointerEvents: "none",
          transformPerspective: 1200,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTrack,
            pin: pinViewport,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (!phaseIndicator) return;
              const p = self.progress;
              if (p < 0.15) {
                phaseIndicator.textContent = "PHASE 01 / EDGE-ON PERSPECTIVE";
              } else if (p < 0.40) {
                phaseIndicator.textContent = "PHASE 02 / ROTATING INTO VIEW";
              } else if (p < 0.65) {
                phaseIndicator.textContent = "PHASE 03 / FRONT-FACING COMPOSITION";
              } else if (p < 0.85) {
                phaseIndicator.textContent = "PHASE 04 / ROTATING OUT";
              } else {
                phaseIndicator.textContent = "PHASE 05 / SINGLE-CARD SPOTLIGHT";
              }
            },
          },
        });

        // -----------------------------------------------------------------------
        // PHASE 01: 0% - 15% -> Initial edge-on state (-90deg hold)
        // -----------------------------------------------------------------------
        masterTl.to(
          cluster,
          {
            rotateY: -90,
            duration: 0.15,
            ease: "none",
          },
          0
        );

        // -----------------------------------------------------------------------
        // PHASE 02: 15% - 40% -> Synchronized 3D rotation into view (-90deg to 0deg)
        // -----------------------------------------------------------------------
        masterTl.to(
          cluster,
          {
            rotateY: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0.15
        );

        // -----------------------------------------------------------------------
        // PHASE 03: 40% - 65% -> Front-facing layered composition hold (0deg)
        // -----------------------------------------------------------------------
        masterTl.to(
          cluster,
          {
            rotateY: 0,
            duration: 0.25,
            ease: "none",
          },
          0.40
        );

        // -----------------------------------------------------------------------
        // PHASE 04: 65% - 85% -> Synchronized 3D rotation out (0deg to +90deg)
        // -----------------------------------------------------------------------
        masterTl.to(
          cluster,
          {
            rotateY: 90,
            duration: 0.20,
            ease: "power2.in",
          },
          0.65
        );

        masterTl.to(
          cluster,
          {
            opacity: 0,
            duration: 0.05,
            ease: "power1.in",
          },
          0.80
        );

        // -----------------------------------------------------------------------
        // PHASE 05: 85% - 100% -> Single-card reveal (-90deg to 0deg facing viewer)
        // -----------------------------------------------------------------------
        masterTl.fromTo(
          singleCard,
          {
            rotateY: -90,
            opacity: 0,
            scale: 0.9,
            pointerEvents: "none",
          },
          {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.15,
            ease: "power2.out",
          },
          0.85
        );
      });

      // =========================================================================
      // MOBILE (< 768px): Smooth Mobile ScrollTrigger Scrub
      // =========================================================================
      mm.add("(max-width: 767px)", () => {
        gsap.set(cluster, {
          rotateY: -85,
          opacity: 1,
          transformPerspective: 1000,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        gsap.set(singleCard, {
          rotateY: -85,
          opacity: 0,
          scale: 0.92,
          pointerEvents: "none",
          transformPerspective: 1000,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTrack,
            pin: pinViewport,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Phase 01: Edge-on hold
        mobileTl.to(cluster, { rotateY: -85, duration: 0.15, ease: "none" }, 0);
        // Phase 02: Rotate to front
        mobileTl.to(cluster, { rotateY: 0, duration: 0.25, ease: "power2.out" }, 0.15);
        // Phase 03: Front hold
        mobileTl.to(cluster, { rotateY: 0, duration: 0.25, ease: "none" }, 0.40);
        // Phase 04: Rotate out
        mobileTl.to(cluster, { rotateY: 85, duration: 0.20, ease: "power2.in" }, 0.65);
        mobileTl.to(cluster, { opacity: 0, duration: 0.05 }, 0.80);
        // Phase 05: Single card reveal
        mobileTl.fromTo(
          singleCard,
          { rotateY: -85, opacity: 0, scale: 0.92, pointerEvents: "none" },
          { rotateY: 0, opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.15, ease: "power2.out" },
          0.85
        );
      });

      // =========================================================================
      // ACCESSIBILITY: Reduced Motion Preference
      // =========================================================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cluster, { rotateY: 0, opacity: 1 });
        gsap.set(singleCard, { display: "none" });
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beyond-the-code"
      className="leisure-floating-section relative bg-[#080808] text-white overflow-hidden border-t border-b border-white/10"
      aria-label="Beyond the Code — 3D Rotating Leisure Image Stack"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[550px] bg-violet-600/[0.07] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Pinned Scroll Track Container (300vh for luxury smooth scrub) */}
      <div
        ref={pinTrackRef}
        className="leisure-pin-track relative w-full h-[280vh] md:h-[320vh]"
      >
        <div
          ref={pinViewportRef}
          className="leisure-pin-viewport sticky top-0 w-full h-screen max-h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6"
        >
          {/* Header Block: Category Pill, Headline & Subtitle */}
          <div className="leisure-header-block max-w-4xl mx-auto text-center space-y-2 z-40 relative select-none shrink-0 pointer-events-none">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 font-mono text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
              <Compass size={12} className="text-violet-400 animate-pulse" />
              <span>LIFE OUTSIDE WORK / 001</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-unbounded font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.02]">
              BEYOND THE CODE<span className="text-violet-400">.</span>
            </h2>

            {/* Requested Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              A glimpse into the things that inspire me beyond programming.
            </p>
          </div>

          {/* Central 3D Perspective Stage */}
          <div className="flex-1 flex items-center justify-center relative w-full overflow-visible py-2 sm:py-4">
            <div
              className="leisure-perspective-stage relative w-full flex items-center justify-center select-none overflow-visible"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "center center",
              }}
            >
              {/* 
                THE MASTER 3D ROTATING CLUSTER (Phases 01 - 04):
                Parent element rotated around Y-axis by GSAP ScrollTrigger (-90deg -> 0deg -> +90deg).
              */}
              <div
                ref={clusterRef}
                className="leisure-3d-cluster relative will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* 
                  Fixed Composition Canvas (860px x 580px)
                  Maintains the exact overlapping geometry from the reference screenshot.
                  Scales proportionally on tablet & mobile via CSS transform without layout shift.
                */}
                <div
                  className="leisure-composition-box relative w-[860px] h-[580px] shrink-0 pointer-events-auto"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 1. TOP CENTER: SPOTIFY (Depth: -18px, peeking directly above portrait) */}
                  <LeisureImageCard
                    card={spotifyCard}
                    depthZ={-18}
                    isHovered={hoveredId === spotifyCard.id}
                    isDimmed={hoveredId !== null && hoveredId !== spotifyCard.id}
                    onMouseEnter={() => setHoveredId(spotifyCard.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute left-[355px] top-[15px] w-[150px] h-[190px] z-10"
                  />

                  {/* 2. UPPER LEFT: CAR GAMING (Depth: +20px, Digital clock position in screenshot) */}
                  <LeisureImageCard
                    card={carGamingCard}
                    depthZ={20}
                    isHovered={hoveredId === carGamingCard.id}
                    isDimmed={hoveredId !== null && hoveredId !== carGamingCard.id}
                    onMouseEnter={() => setHoveredId(carGamingCard.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute left-[95px] top-[85px] w-[230px] h-[220px] z-15"
                  />

                  {/* 3. UPPER RIGHT: NETFLIX (Depth: +14px, Orange doorway position in screenshot) */}
                  <LeisureImageCard
                    card={netflixCard}
                    depthZ={14}
                    isHovered={hoveredId === netflixCard.id}
                    isDimmed={hoveredId !== null && hoveredId !== netflixCard.id}
                    onMouseEnter={() => setHoveredId(netflixCard.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute left-[565px] top-[90px] w-[185px] h-[215px] z-12"
                  />

                  {/* 4. LOWER LEFT: TRAVEL (Depth: +32px, White linen shirt position in screenshot) */}
                  <LeisureImageCard
                    card={travelCard}
                    depthZ={32}
                    isHovered={hoveredId === travelCard.id}
                    isDimmed={hoveredId !== null && hoveredId !== travelCard.id}
                    onMouseEnter={() => setHoveredId(travelCard.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute left-[145px] top-[290px] w-[230px] h-[270px] z-25"
                  />

                  {/* 5. LOWER/MIDDLE RIGHT: CODING (Depth: +28px, Book & coffee position in screenshot) */}
                  <LeisureImageCard
                    card={codingCard}
                    depthZ={28}
                    isHovered={hoveredId === codingCard.id}
                    isDimmed={hoveredId !== null && hoveredId !== codingCard.id}
                    onMouseEnter={() => setHoveredId(codingCard.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute left-[540px] top-[205px] w-[240px] h-[255px] z-25"
                  />

                  {/* 6. CENTERPIECE: DINIDU PORTRAIT (Depth: +55px, Dominant centerpiece, White T-Shirt on Black) */}
                  <LeisureImageCard
                    card={portraitCard}
                    depthZ={55}
                    isHovered={hoveredId === portraitCard.id}
                    isDimmed={hoveredId !== null && hoveredId !== portraitCard.id}
                    onMouseEnter={() => setHoveredId(portraitCard.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute left-[285px] top-[110px] w-[290px] h-[340px] z-30 shadow-[0_35px_95px_rgba(0,0,0,0.98),0_0_40px_rgba(152,103,255,0.25)] border-white/25"
                  />
                </div>
              </div>

              {/* 
                PHASE 05: SINGLE-CARD REVEAL
                Rotates in around Y-axis (-90deg -> 0deg) facing the viewer after stack rotates away.
              */}
              <div
                ref={singleCardRef}
                className="leisure-single-card-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform z-50 pointer-events-none"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-[320px] sm:w-[380px] h-[430px] sm:h-[490px] rounded-3xl overflow-hidden border border-white/20 bg-[#0c0d14] shadow-[0_35px_100px_rgba(0,0,0,0.98),0_0_50px_rgba(239,68,68,0.25)] select-none">
                  {/* Spotlight Image */}
                  <img
                    src={carGamingCard.image}
                    alt={carGamingCard.alt}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />

                  {/* Cinematic Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 pointer-events-none" />

                  {/* Top Bar Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-md text-[10px] font-mono font-bold text-white tracking-wider uppercase">
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                      <span>01 / FEATURED ACTIVITY</span>
                    </div>

                    <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-red-400">
                      <Trophy size={14} />
                    </div>
                  </div>

                  {/* Bottom Activity Info */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1.5 pointer-events-none">
                    <div className="text-[11px] font-mono text-red-400 font-bold tracking-widest uppercase">
                      {carGamingCard.category}
                    </div>
                    <h3 className="font-unbounded font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                      {carGamingCard.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                      Virtual roads, real excitement. Precision sim racing setup built for maximum adrenaline.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-white/10">
                      <span>01 OF 05 ACTIVITIES</span>
                      <span className="text-violet-400 font-semibold tracking-wider uppercase">
                        SCROLL TO REVERSE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Bottom Legend Bar */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10.5px] font-mono text-gray-500 z-30 pointer-events-none shrink-0 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={11} className="text-violet-400" />
              <span
                ref={phaseIndicatorRef}
                className="tracking-widest uppercase text-gray-300 font-medium transition-all duration-300"
              >
                PHASE 01 / EDGE-ON PERSPECTIVE
              </span>
            </div>
            <span className="hidden sm:inline-block tracking-wider text-gray-400">
              SCROLL DRIVEN 3D IMAGE STACK · REVERSIBLE CHOREOGRAPHY
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
