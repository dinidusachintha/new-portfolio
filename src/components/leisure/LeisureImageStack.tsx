import { useState } from "react";
import LeisureImageCard from "./LeisureImageCard";
import { portraitCard, floatingLeisureCards } from "./leisureData";

interface LeisureImageStackProps {
  portraitRef: React.RefObject<HTMLDivElement | null>;
  carGamingRef: React.RefObject<HTMLDivElement | null>;
  netflixRef: React.RefObject<HTMLDivElement | null>;
  spotifyRef: React.RefObject<HTMLDivElement | null>;
  travelRef: React.RefObject<HTMLDivElement | null>;
  codingRef: React.RefObject<HTMLDivElement | null>;
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

  const carGamingCard = floatingLeisureCards.find((c) => c.id === "car-gaming")!;
  const netflixCard = floatingLeisureCards.find((c) => c.id === "netflix")!;
  const spotifyCard = floatingLeisureCards.find((c) => c.id === "spotify")!;
  const travelCard = floatingLeisureCards.find((c) => c.id === "travel")!;
  const codingCard = floatingLeisureCards.find((c) => c.id === "coding")!;

  return (
    <div
      className={`leisure-stack-outer w-full flex items-center justify-center overflow-visible select-none ${className}`}
    >
      {/* 
        Fixed Composition Canvas (860px x 580px) 
        Scaled responsively via CSS transform on mobile to fit 100% of any viewport without overflow 
      */}
      <div className="leisure-composition-box relative w-[860px] h-[580px] shrink-0 pointer-events-auto">
        {/* 1. TOP CENTER: SPOTIFY (Peeking directly above portrait) */}
        <LeisureImageCard
          ref={spotifyRef}
          card={spotifyCard}
          isHovered={hoveredId === spotifyCard.id}
          isDimmed={hoveredId !== null && hoveredId !== spotifyCard.id}
          onMouseEnter={() => setHoveredId(spotifyCard.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="absolute left-[51%] -translate-x-1/2 top-[3%] w-[150px] h-[190px] z-10"
        />

        {/* 2. UPPER LEFT: CAR GAMING (Alarm clock position in reference image) */}
        <LeisureImageCard
          ref={carGamingRef}
          card={carGamingCard}
          isHovered={hoveredId === carGamingCard.id}
          isDimmed={hoveredId !== null && hoveredId !== carGamingCard.id}
          onMouseEnter={() => setHoveredId(carGamingCard.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="absolute left-[10%] top-[14%] w-[230px] h-[220px] z-15"
        />

        {/* 3. UPPER RIGHT: NETFLIX (Orange doorway position in reference image) */}
        <LeisureImageCard
          ref={netflixRef}
          card={netflixCard}
          isHovered={hoveredId === netflixCard.id}
          isDimmed={hoveredId !== null && hoveredId !== netflixCard.id}
          onMouseEnter={() => setHoveredId(netflixCard.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="absolute right-[14%] top-[15%] w-[180px] h-[210px] z-12"
        />

        {/* 4. LOWER LEFT: TRAVEL (White shirt position in reference image) */}
        <LeisureImageCard
          ref={travelRef}
          card={travelCard}
          isHovered={hoveredId === travelCard.id}
          isDimmed={hoveredId !== null && hoveredId !== travelCard.id}
          onMouseEnter={() => setHoveredId(travelCard.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="absolute left-[16%] bottom-[4%] w-[230px] h-[270px] z-25"
        />

        {/* 5. LOWER/MIDDLE RIGHT: CODING (Open book & coffee cup position in reference image) */}
        <LeisureImageCard
          ref={codingRef}
          card={codingCard}
          isHovered={hoveredId === codingCard.id}
          isDimmed={hoveredId !== null && hoveredId !== codingCard.id}
          onMouseEnter={() => setHoveredId(codingCard.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="absolute right-[9%] top-[32%] w-[240px] h-[250px] z-25"
        />

        {/* 6. CENTERPIECE: DINIDU PORTRAIT (Dominant Center Stage, White T-Shirt on Black) */}
        <LeisureImageCard
          ref={portraitRef}
          card={portraitCard}
          isHovered={hoveredId === portraitCard.id}
          isDimmed={hoveredId !== null && hoveredId !== portraitCard.id}
          onMouseEnter={() => setHoveredId(portraitCard.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[290px] h-[340px] z-30 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_40px_rgba(152,103,255,0.2)] border-white/25"
        />
      </div>
    </div>
  );
}
