import { useEffect, useRef, useState } from "react";
import LeisureImageCard from "./LeisureImageCard";
import { portraitCard, floatingLeisureCards } from "./leisureData";

interface LeisureImageStackProps {
  portraitRef?: React.RefObject<HTMLDivElement | null>;
  carGamingRef?: React.RefObject<HTMLDivElement | null>;
  netflixRef?: React.RefObject<HTMLDivElement | null>;
  spotifyRef?: React.RefObject<HTMLDivElement | null>;
  travelRef?: React.RefObject<HTMLDivElement | null>;
  codingRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export default function LeisureImageStack({
  portraitRef,
  carGamingRef,
  netflixRef,
  spotifyRef,
  travelRef,
  codingRef,
  className = "",
}: LeisureImageStackProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cluster3DRef = useRef<HTMLDivElement>(null);

  // Fallback internal refs if external not provided
  const internalPortraitRef = useRef<HTMLDivElement>(null);
  const internalCarGamingRef = useRef<HTMLDivElement>(null);
  const internalNetflixRef = useRef<HTMLDivElement>(null);
  const internalSpotifyRef = useRef<HTMLDivElement>(null);
  const internalTravelRef = useRef<HTMLDivElement>(null);
  const internalCodingRef = useRef<HTMLDivElement>(null);

  // Target and current spring values for 3D cursor rotation
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);
  const targetTransX = useRef(0);
  const targetTransY = useRef(0);

  const currentRotX = useRef(0);
  const currentRotY = useRef(0);
  const currentTransX = useRef(0);
  const currentTransY = useRef(0);

  useEffect(() => {
    let animId: number;

    // Linear interpolation helper for buttery 60fps spring damping
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    // 60FPS Spring Animation Loop
    const tick = () => {
      currentRotX.current = lerp(currentRotX.current, targetRotX.current, 0.08);
      currentRotY.current = lerp(currentRotY.current, targetRotY.current, 0.08);
      currentTransX.current = lerp(currentTransX.current, targetTransX.current, 0.08);
      currentTransY.current = lerp(currentTransY.current, targetTransY.current, 0.08);

      if (cluster3DRef.current) {
        cluster3DRef.current.style.transform = `rotateX(${currentRotX.current.toFixed(
          3
        )}deg) rotateY(${currentRotY.current.toFixed(
          3
        )}deg) translate3d(${currentTransX.current.toFixed(
          2
        )}px, ${currentTransY.current.toFixed(2)}px, 0px)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // Pointer move handler (Desktop mouse & Mobile touch)
    const handlePointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Only track if section is within or near visible viewport
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1.3 to +1.3
      const normX = Math.max(-1.3, Math.min(1.3, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1.3, Math.min(1.3, (e.clientY - centerY) / (rect.height / 2)));

      // 3D Rotation angles based on cursor offset (OVO Campione style)
      targetRotY.current = normX * 16; // Degrees of Y rotation
      targetRotX.current = -normY * 13; // Degrees of X rotation
      targetTransX.current = normX * 18; // Subtle lateral float
      targetTransY.current = normY * 14; // Subtle vertical float
    };

    const handlePointerReset = () => {
      // Smoothly spring return to center equilibrium
      targetRotX.current = 0;
      targetRotY.current = 0;
      targetTransX.current = 0;
      targetTransY.current = 0;
    };

    const stageEl = containerRef.current;
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerReset);
    window.addEventListener("pointercancel", handlePointerReset);
    window.addEventListener("blur", handlePointerReset);
    if (stageEl) {
      stageEl.addEventListener("pointerleave", handlePointerReset);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerReset);
      window.removeEventListener("pointercancel", handlePointerReset);
      window.removeEventListener("blur", handlePointerReset);
      if (stageEl) {
        stageEl.removeEventListener("pointerleave", handlePointerReset);
      }
    };
  }, []);

  const carGamingCard = floatingLeisureCards.find((c) => c.id === "car-gaming")!;
  const netflixCard = floatingLeisureCards.find((c) => c.id === "netflix")!;
  const spotifyCard = floatingLeisureCards.find((c) => c.id === "spotify")!;
  const travelCard = floatingLeisureCards.find((c) => c.id === "travel")!;
  const codingCard = floatingLeisureCards.find((c) => c.id === "coding")!;

  return (
    <div
      ref={containerRef}
      className={`leisure-perspective-stage w-full flex items-center justify-center select-none overflow-visible ${className}`}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* 
        3D Interactive Rotating Cluster:
        Responds to cursor / touch movement with 3D rotateX and rotateY
      */}
      <div
        ref={cluster3DRef}
        className="leisure-3d-cluster will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* 
          Fixed Composition Canvas (860px x 580px) 
          Scaled responsively via CSS transform on mobile to fit 100% of any viewport without overflow.
          Positioning matches the reference screenshot image layout exactly.
        */}
        <div
          className="leisure-composition-box relative w-[860px] h-[580px] shrink-0 pointer-events-auto"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* 1. TOP CENTER: SPOTIFY (Depth: -15px, peeking directly above portrait) */}
          <LeisureImageCard
            ref={spotifyRef || internalSpotifyRef}
            card={spotifyCard}
            depthZ={-15}
            isHovered={hoveredId === spotifyCard.id}
            isDimmed={hoveredId !== null && hoveredId !== spotifyCard.id}
            onMouseEnter={() => setHoveredId(spotifyCard.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute left-[355px] top-[15px] w-[150px] h-[190px] z-10"
          />

          {/* 2. UPPER LEFT: CAR GAMING (Depth: +20px, Digital clock position in reference image) */}
          <LeisureImageCard
            ref={carGamingRef || internalCarGamingRef}
            card={carGamingCard}
            depthZ={20}
            isHovered={hoveredId === carGamingCard.id}
            isDimmed={hoveredId !== null && hoveredId !== carGamingCard.id}
            onMouseEnter={() => setHoveredId(carGamingCard.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute left-[95px] top-[85px] w-[230px] h-[220px] z-15"
          />

          {/* 3. UPPER RIGHT: NETFLIX (Depth: +14px, Orange doorway position in reference image) */}
          <LeisureImageCard
            ref={netflixRef || internalNetflixRef}
            card={netflixCard}
            depthZ={14}
            isHovered={hoveredId === netflixCard.id}
            isDimmed={hoveredId !== null && hoveredId !== netflixCard.id}
            onMouseEnter={() => setHoveredId(netflixCard.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute left-[565px] top-[90px] w-[185px] h-[215px] z-12"
          />

          {/* 4. LOWER LEFT: TRAVEL (Depth: +30px, White shirt position in reference image) */}
          <LeisureImageCard
            ref={travelRef || internalTravelRef}
            card={travelCard}
            depthZ={30}
            isHovered={hoveredId === travelCard.id}
            isDimmed={hoveredId !== null && hoveredId !== travelCard.id}
            onMouseEnter={() => setHoveredId(travelCard.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute left-[145px] top-[290px] w-[230px] h-[270px] z-25"
          />

          {/* 5. LOWER/MIDDLE RIGHT: CODING (Depth: +26px, Open book & coffee cup position in reference image) */}
          <LeisureImageCard
            ref={codingRef || internalCodingRef}
            card={codingCard}
            depthZ={26}
            isHovered={hoveredId === codingCard.id}
            isDimmed={hoveredId !== null && hoveredId !== codingCard.id}
            onMouseEnter={() => setHoveredId(codingCard.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute left-[540px] top-[205px] w-[240px] h-[255px] z-25"
          />

          {/* 6. CENTERPIECE: DINIDU PORTRAIT (Depth: +50px, Dominant Center Stage, White T-Shirt on Black) */}
          <LeisureImageCard
            ref={portraitRef || internalPortraitRef}
            card={portraitCard}
            depthZ={50}
            isHovered={hoveredId === portraitCard.id}
            isDimmed={hoveredId !== null && hoveredId !== portraitCard.id}
            onMouseEnter={() => setHoveredId(portraitCard.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute left-[285px] top-[110px] w-[290px] h-[340px] z-30 shadow-[0_35px_100px_rgba(0,0,0,0.98),0_0_40px_rgba(152,103,255,0.25)] border-white/25"
          />
        </div>
      </div>
    </div>
  );
}
