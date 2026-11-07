import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkles, Trophy, Move3d, MousePointer, Hand } from "lucide-react";
import LeisureImageCard from "./LeisureImageCard";
import { portraitCard, floatingLeisureCards } from "./leisureData";
import type { LeisureCardData } from "./types";

gsap.registerPlugin(ScrollTrigger);

export default function Leisure3DStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const pinViewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clusterScrollRef = useRef<HTMLDivElement>(null);
  const clusterTiltRef = useRef<HTMLDivElement>(null);
  const singleCardRef = useRef<HTMLDivElement>(null);
  const phaseIndicatorRef = useRef<HTMLSpanElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string>("car-gaming");
  const [responsiveScale, setResponsiveScale] = useState<number>(1);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Find cards
  const carGamingCard = floatingLeisureCards.find((c) => c.id === "car-gaming")!;
  const netflixCard = floatingLeisureCards.find((c) => c.id === "netflix")!;
  const spotifyCard = floatingLeisureCards.find((c) => c.id === "spotify")!;
  const travelCard = floatingLeisureCards.find((c) => c.id === "travel")!;
  const codingCard = floatingLeisureCards.find((c) => c.id === "coding")!;

  const activeSpotlightCard: LeisureCardData =
    floatingLeisureCards.find((c) => c.id === selectedCardId) || carGamingCard;

  // ---------------------------------------------------------------------------
  // INTERACTIVE 3D CURSOR & TOUCH TILT (SPRING / LERP PHYSICS)
  // Replicates the tactile 3D hover rotation from the reference video
  // ---------------------------------------------------------------------------
  const targetTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth 60fps lerp loop
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const factor = 0.085;
      currentTiltRef.current.x +=
        (targetTiltRef.current.x - currentTiltRef.current.x) * factor;
      currentTiltRef.current.y +=
        (targetTiltRef.current.y - currentTiltRef.current.y) * factor;

      if (clusterTiltRef.current) {
        clusterTiltRef.current.style.transform = `rotateX(${currentTiltRef.current.x.toFixed(
          2
        )}deg) rotateY(${currentTiltRef.current.y.toFixed(2)}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Mouse move handler (Desktop) - bounded to +/- 12deg Y, +/- 8deg X
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    // Calibrated gentle tilt (keeps cards fully facing viewer and never edge-on)
    targetTiltRef.current = {
      x: -normY * 8,
      y: normX * 12,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetTiltRef.current = { x: 0, y: 0 };
    setHoveredId(null);
  }, []);

  // Touch handlers (Mobile & Tablet) - bounded to +/- 10deg
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setIsTouchDevice(true);
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;

    targetTiltRef.current = {
      x: Math.max(-8, Math.min(8, -dy * 0.08)),
      y: Math.max(-11, Math.min(11, dx * 0.11)),
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    targetTiltRef.current = { x: 0, y: 0 };
    touchStartRef.current = null;
  }, []);

  // ---------------------------------------------------------------------------
  // RESPONSIVE SCALE COMPUTATION
  // Fits composition cleanly across viewports from 320px small mobile to 4K
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );

      if (width < 440) {
        // Small/modern mobile (320px - 430px): leave 20px padding
        const s = Math.min(0.48, Math.max(0.36, (width - 20) / 860));
        setResponsiveScale(s);
      } else if (width < 768) {
        // Large mobile / phablet
        const s = Math.min(0.68, Math.max(0.48, (width - 32) / 860));
        setResponsiveScale(s);
      } else if (width < 1024) {
        // Tablet
        const s = Math.min(0.85, Math.max(0.70, (width - 48) / 860));
        setResponsiveScale(s);
      } else {
        // Laptop & Desktop
        setResponsiveScale(1);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale, { passive: true });
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // ---------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER 3D CHOREOGRAPHY (Matches Reference Video Exactly)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;
    const pinTrack = pinTrackRef.current;
    const pinViewport = pinViewportRef.current;
    const clusterScroll = clusterScrollRef.current;
    const singleCard = singleCardRef.current;
    const phaseIndicator = phaseIndicatorRef.current;

    if (!section || !pinTrack || !pinViewport || !clusterScroll || !singleCard) return;

    const handleScroll = () => {
      ScrollTrigger.update();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =======================================================================
      // DESKTOP & TABLET TIMELINE (>= 768px)
      // =======================================================================
      mm.add("(min-width: 768px)", () => {
        // Initial state: elegant angled 3D perspective from video (capped at -26deg)
        gsap.set(clusterScroll, {
          rotateY: -26,
          rotateX: 3,
          scale: 0.95,
          opacity: 1,
          filter: "blur(0px)",
          transformPerspective: 1400,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        gsap.set(singleCard, {
          rotateY: -22,
          opacity: 0,
          scale: 0.92,
          pointerEvents: "none",
          transformPerspective: 1400,
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
              if (p < 0.22) {
                phaseIndicator.textContent = "PHASE 01 / 3D ANGLED PERSPECTIVE";
              } else if (p < 0.68) {
                phaseIndicator.textContent = "PHASE 02 / FRONT-FACING COMPOSITION";
              } else if (p < 0.85) {
                phaseIndicator.textContent = "PHASE 03 / 3D ROTATION OUT";
              } else {
                phaseIndicator.textContent = "PHASE 04 / ACTIVITY SPOTLIGHT";
              }
            },
          },
        });

        // 1. Entrance: Smoothly rotate into view (-26deg -> 0deg)
        masterTl.to(
          clusterScroll,
          {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.22,
            ease: "power2.out",
          },
          0
        );

        // 2. Center hold (0.22 -> 0.68): Front-facing with dynamic cursor tilt
        masterTl.to(
          clusterScroll,
          {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.46,
            ease: "none",
          },
          0.22
        );

        // 3. Exit rotation: Gently revolve to +24deg (NEVER past 26deg to avoid slivers!)
        masterTl.to(
          clusterScroll,
          {
            rotateY: 24,
            rotateX: -3,
            scale: 0.93,
            duration: 0.20,
            ease: "power2.inOut",
          },
          0.68
        );

        // Soft fade out that overlaps with spotlight entrance (no black void!)
        masterTl.to(
          clusterScroll,
          {
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.12,
            ease: "power1.in",
          },
          0.76
        );

        // 4. Spotlight single card reveal facing viewer
        masterTl.fromTo(
          singleCard,
          {
            rotateY: -22,
            opacity: 0,
            scale: 0.92,
            pointerEvents: "none",
          },
          {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.18,
            ease: "power2.out",
          },
          0.78
        );
      });

      // =======================================================================
      // MOBILE (< 768px) TIMELINE — Smooth Touch Scrub, Zero Slivers
      // =======================================================================
      mm.add("(max-width: 767px)", () => {
        gsap.set(clusterScroll, {
          rotateY: -20,
          rotateX: 2,
          scale: 0.96,
          opacity: 1,
          filter: "blur(0px)",
          transformPerspective: 1100,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        gsap.set(singleCard, {
          rotateY: -18,
          opacity: 0,
          scale: 0.94,
          pointerEvents: "none",
          transformPerspective: 1100,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        });

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTrack,
            pin: pinViewport,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (!phaseIndicator) return;
              const p = self.progress;
              if (p < 0.22) {
                phaseIndicator.textContent = "PHASE 01 / 3D PERSPECTIVE";
              } else if (p < 0.68) {
                phaseIndicator.textContent = "PHASE 02 / BEYOND THE CODE";
              } else if (p < 0.85) {
                phaseIndicator.textContent = "PHASE 03 / ROTATION OUT";
              } else {
                phaseIndicator.textContent = "PHASE 04 / SPOTLIGHT";
              }
            },
          },
        });

        mobileTl.to(
          clusterScroll,
          { rotateY: 0, rotateX: 0, scale: 1, duration: 0.22, ease: "power2.out" },
          0
        );
        mobileTl.to(
          clusterScroll,
          { rotateY: 0, rotateX: 0, scale: 1, duration: 0.46, ease: "none" },
          0.22
        );
        mobileTl.to(
          clusterScroll,
          { rotateY: 20, rotateX: -2, scale: 0.93, duration: 0.20, ease: "power2.inOut" },
          0.68
        );
        mobileTl.to(
          clusterScroll,
          { opacity: 0, filter: "blur(5px)", duration: 0.12 },
          0.76
        );
        mobileTl.fromTo(
          singleCard,
          { rotateY: -18, opacity: 0, scale: 0.94, pointerEvents: "none" },
          { rotateY: 0, opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.18, ease: "power2.out" },
          0.78
        );
      });

      // Reduced motion accessibility fallback
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(clusterScroll, { rotateY: 0, rotateX: 0, scale: 1, opacity: 1 });
        gsap.set(singleCard, { display: "none" });
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beyond-the-code"
      className="leisure-floating-section relative bg-[#080808] text-white overflow-x-clip border-t border-b border-white/10 select-none"
      aria-label="Beyond the Code — 3D Rotating Leisure Image Stack"
    >
      {/* Background Radial Atmosphere Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[550px] bg-violet-600/[0.07] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Pinned Scroll Track Container (220vh on mobile, 250vh on desktop) */}
      <div
        ref={pinTrackRef}
        className="leisure-pin-track relative w-full h-[220vh] md:h-[250vh]"
      >
        <div
          ref={pinViewportRef}
          className="leisure-pin-viewport relative w-full h-screen max-h-screen overflow-hidden flex flex-col justify-between pt-16 pb-16 sm:pt-20 sm:pb-8 px-3 sm:px-6"
        >
          {/* Header Block: Category Pill, Headline & Subtitle */}
          <div className="leisure-header-block max-w-4xl mx-auto text-center space-y-1.5 sm:space-y-2 z-40 relative select-none shrink-0 pointer-events-none">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 font-mono text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
              <Compass size={12} className="text-violet-400 animate-pulse" />
              <span>LIFE OUTSIDE WORK / 001</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-unbounded font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.02]">
              BEYOND THE CODE<span className="text-violet-400">.</span>
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              A glimpse into what keeps me inspired when I'm away from the screen.
            </p>

            {/* Interactive Mode Pill */}
            <div className="pt-0.5 sm:pt-1 flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[9.5px] sm:text-[10.5px] font-mono text-gray-400">
                {isTouchDevice ? (
                  <>
                    <Hand size={11} className="text-violet-400 animate-pulse" />
                    <span>TOUCH & DRAG TO TILT · SCROLL FOR SPOTLIGHT</span>
                  </>
                ) : (
                  <>
                    <MousePointer size={11} className="text-violet-400 animate-pulse" />
                    <span>MOVE CURSOR TO ROTATE IN 3D · CLICK CARD TO SPOTLIGHT</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Central 3D Perspective Stage */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex-1 flex items-center justify-center relative w-full overflow-visible py-2 sm:py-4 touch-pan-y"
          >
            <div
              className="leisure-perspective-stage relative w-full h-full flex items-center justify-center select-none overflow-visible"
              style={{
                perspective: "1400px",
                perspectiveOrigin: "center center",
              }}
            >
              {/* 
                1. GSAP SCROLL ROTATION CONTAINER:
                Rotated gracefully around Y-axis by ScrollTrigger (-26deg -> 0deg -> +24deg).
                Transform origin centered so cards never pivot off-screen or into a sliver!
              */}
              <div
                ref={clusterScrollRef}
                className="leisure-scroll-cluster relative flex items-center justify-center will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                }}
              >
                {/* 
                  2. INTERACTIVE MOUSE & TOUCH TILT CONTAINER:
                  Smoothly lerped in 3D (rotateX & rotateY) based on cursor / touch.
                */}
                <div
                  ref={clusterTiltRef}
                  className="leisure-tilt-container relative flex items-center justify-center will-change-transform"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                  }}
                >
                  {/* 
                    3. RESPONSIVE SIZING WRAPPER:
                    Takes exact pixel bounds of (860 * scale) x (580 * scale) in layout,
                    scaling smoothly from center center across any viewport width!
                  */}
                  <div
                    className="relative flex items-center justify-center pointer-events-auto"
                    style={{
                      width: `${Math.round(860 * responsiveScale)}px`,
                      height: `${Math.round(580 * responsiveScale)}px`,
                    }}
                  >
                    {/* Fixed 860px x 580px canvas scaled symmetrically from center */}
                    <div
                      className="leisure-composition-box relative w-[860px] h-[580px] shrink-0"
                      style={{
                        transform: `scale(${responsiveScale})`,
                        transformOrigin: "center center",
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
                        onClick={() => setSelectedCardId(spotifyCard.id)}
                        className="absolute left-[355px] top-[15px] w-[150px] h-[190px] z-10"
                      />

                      {/* 2. UPPER LEFT: CAR GAMING (Depth: +20px, Digital clock position in reference image) */}
                      <LeisureImageCard
                        card={carGamingCard}
                        depthZ={20}
                        isHovered={hoveredId === carGamingCard.id}
                        isDimmed={hoveredId !== null && hoveredId !== carGamingCard.id}
                        onMouseEnter={() => setHoveredId(carGamingCard.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedCardId(carGamingCard.id)}
                        className="absolute left-[95px] top-[85px] w-[230px] h-[220px] z-15"
                      />

                      {/* 3. UPPER RIGHT: NETFLIX (Depth: +14px, Orange doorway position in reference image) */}
                      <LeisureImageCard
                        card={netflixCard}
                        depthZ={14}
                        isHovered={hoveredId === netflixCard.id}
                        isDimmed={hoveredId !== null && hoveredId !== netflixCard.id}
                        onMouseEnter={() => setHoveredId(netflixCard.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedCardId(netflixCard.id)}
                        className="absolute left-[565px] top-[90px] w-[185px] h-[215px] z-12"
                      />

                      {/* 4. LOWER LEFT: TRAVEL (Depth: +32px, White shirt position in reference image) */}
                      <LeisureImageCard
                        card={travelCard}
                        depthZ={32}
                        isHovered={hoveredId === travelCard.id}
                        isDimmed={hoveredId !== null && hoveredId !== travelCard.id}
                        onMouseEnter={() => setHoveredId(travelCard.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedCardId(travelCard.id)}
                        className="absolute left-[145px] top-[290px] w-[230px] h-[270px] z-25"
                      />

                      {/* 5. LOWER/MIDDLE RIGHT: CODING (Depth: +28px, Open book & coffee cup position in reference image) */}
                      <LeisureImageCard
                        card={codingCard}
                        depthZ={28}
                        isHovered={hoveredId === codingCard.id}
                        isDimmed={hoveredId !== null && hoveredId !== codingCard.id}
                        onMouseEnter={() => setHoveredId(codingCard.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedCardId(codingCard.id)}
                        className="absolute left-[540px] top-[205px] w-[240px] h-[255px] z-25"
                      />

                      {/* 6. CENTERPIECE: DINIDU PORTRAIT (Depth: +55px, Dominant centerpiece) */}
                      <LeisureImageCard
                        card={portraitCard}
                        depthZ={55}
                        isHovered={hoveredId === portraitCard.id}
                        isDimmed={hoveredId !== null && hoveredId !== portraitCard.id}
                        onMouseEnter={() => setHoveredId(portraitCard.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedCardId("car-gaming")}
                        className="absolute left-[285px] top-[110px] w-[290px] h-[340px] z-30 shadow-[0_35px_95px_rgba(0,0,0,0.98),0_0_40px_rgba(152,103,255,0.25)] border-white/25"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 
                SINGLE-CARD REVEAL (Phase 04):
                Smoothly rotates in around Y-axis (-22deg -> 0deg) facing the viewer.
                Sized responsively to fit mobile screens comfortably without clipping.
              */}
              <div
                ref={singleCardRef}
                className="leisure-single-card-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform z-50 pointer-events-none"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                }}
              >
                <div className="relative w-[min(380px,calc(100vw-36px))] h-[min(480px,calc(100vh-230px))] min-h-[380px] rounded-3xl overflow-hidden border border-white/20 bg-[#0c0d14] shadow-[0_35px_100px_rgba(0,0,0,0.98),0_0_50px_rgba(152,103,255,0.25)] select-none">
                  {/* Spotlight Image */}
                  <img
                    src={activeSpotlightCard.image}
                    alt={activeSpotlightCard.alt}
                    className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Cinematic Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none" />

                  {/* Top Bar Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-md text-[10px] font-mono font-bold text-white tracking-wider uppercase">
                      <span
                        className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                        style={{
                          backgroundColor: activeSpotlightCard.accentColor,
                          color: activeSpotlightCard.accentColor,
                        }}
                      />
                      <span>{activeSpotlightCard.label}</span>
                    </div>

                    <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-violet-400">
                      <Trophy size={14} />
                    </div>
                  </div>

                  {/* Bottom Activity Info & Interactive Switcher */}
                  <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 space-y-1.5 sm:space-y-2 pointer-events-auto">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-mono font-bold tracking-widest uppercase"
                        style={{ color: activeSpotlightCard.accentColor }}
                      >
                        {activeSpotlightCard.category}
                      </span>

                      {/* 5-activity switcher pills */}
                      <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/10">
                        {floatingLeisureCards.map((card, idx) => (
                          <button
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            title={card.title}
                            className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold transition-all duration-300 flex items-center justify-center ${
                              selectedCardId === card.id
                                ? "bg-white text-black scale-110 shadow-sm"
                                : "text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <h3 className="font-unbounded font-black text-lg sm:text-xl md:text-2xl text-white uppercase tracking-tight">
                      {activeSpotlightCard.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {activeSpotlightCard.id === "car-gaming" &&
                        "Virtual roads, real excitement. Precision sim racing setup built for maximum adrenaline."}
                      {activeSpotlightCard.id === "netflix" &&
                        "Getting lost in great films and unforgettable stories with cinematic ambient immersion."}
                      {activeSpotlightCard.id === "spotify" &&
                        "Studio-grade audio and curated playlists that fuel deep focus and creative flow."}
                      {activeSpotlightCard.id === "travel" &&
                        "New places, fresh perspectives, and endless memories along open mountain highways."}
                      {activeSpotlightCard.id === "coding" &&
                        "Sometimes the best ideas happen after hours when creativity takes over without constraints."}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-white/10">
                      <span>SELECT 1-5 TO SWITCH</span>
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
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono text-gray-500 z-30 pointer-events-none shrink-0 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={11} className="text-violet-400" />
              <span
                ref={phaseIndicatorRef}
                className="tracking-widest uppercase text-gray-300 font-medium transition-all duration-300"
              >
                PHASE 01 / 3D ANGLED PERSPECTIVE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-gray-400">
                <Move3d size={12} className="text-violet-400" />
                <span>3D PRESERVE-DEPTH STACK</span>
              </span>
              <span className="tracking-wider text-gray-400">
                CAMPIONE CHOREOGRAPHY
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
