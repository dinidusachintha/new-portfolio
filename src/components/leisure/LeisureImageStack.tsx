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
      className={`leisure-image-stack relative w-full max-w-[1150px] mx-auto h-[560px] sm:h-[620px] md:h-[680px] lg:h-[720px] flex items-center justify-center ${className}`}
    >
      {/* 1. TOP CENTER: SPOTIFY (Z-10, Tucked behind portrait) */}
      <LeisureImageCard
        ref={spotifyRef}
        card={spotifyCard}
        isHovered={hoveredId === spotifyCard.id}
        isDimmed={hoveredId !== null && hoveredId !== spotifyCard.id}
        onMouseEnter={() => setHoveredId(spotifyCard.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="absolute left-1/2 -translate-x-1/2 top-[2%] sm:top-[3%] w-[210px] sm:w-[250px] md:w-[280px] lg:w-[300px] h-[145px] sm:h-[175px] md:h-[195px] lg:h-[210px] z-10 -rotate-1"
      />

      {/* 2. UPPER LEFT: CAR GAMING (Z-20, Slightly overlapping portrait left edge) */}
      <LeisureImageCard
        ref={carGamingRef}
        card={carGamingCard}
        isHovered={hoveredId === carGamingCard.id}
        isDimmed={hoveredId !== null && hoveredId !== carGamingCard.id}
        onMouseEnter={() => setHoveredId(carGamingCard.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="absolute left-[1%] sm:left-[3%] md:left-[4%] top-[9%] sm:top-[12%] md:top-[13%] w-[220px] sm:w-[270px] md:w-[310px] lg:w-[340px] h-[150px] sm:h-[185px] md:h-[210px] lg:h-[230px] z-20 -rotate-3"
      />

      {/* 3. UPPER RIGHT: NETFLIX (Z-20, Slightly overlapping portrait right edge) */}
      <LeisureImageCard
        ref={netflixRef}
        card={netflixCard}
        isHovered={hoveredId === netflixCard.id}
        isDimmed={hoveredId !== null && hoveredId !== netflixCard.id}
        onMouseEnter={() => setHoveredId(netflixCard.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="absolute right-[1%] sm:right-[3%] md:right-[4%] top-[11%] sm:top-[13%] md:top-[15%] w-[220px] sm:w-[270px] md:w-[310px] lg:w-[340px] h-[150px] sm:h-[185px] md:h-[210px] lg:h-[230px] z-20 rotate-3"
      />

      {/* 4. LOWER LEFT: TRAVEL (Z-25, Overlapping bottom-left of portrait) */}
      <LeisureImageCard
        ref={travelRef}
        card={travelCard}
        isHovered={hoveredId === travelCard.id}
        isDimmed={hoveredId !== null && hoveredId !== travelCard.id}
        onMouseEnter={() => setHoveredId(travelCard.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="absolute left-[3%] sm:left-[5%] md:left-[7%] bottom-[3%] sm:bottom-[5%] w-[210px] sm:w-[260px] md:w-[300px] lg:w-[330px] h-[150px] sm:h-[180px] md:h-[205px] lg:h-[225px] z-25 rotate-2"
      />

      {/* 5. LOWER RIGHT: CODING (Z-25, Overlapping bottom-right of portrait) */}
      <LeisureImageCard
        ref={codingRef}
        card={codingCard}
        isHovered={hoveredId === codingCard.id}
        isDimmed={hoveredId !== null && hoveredId !== codingCard.id}
        onMouseEnter={() => setHoveredId(codingCard.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="absolute right-[3%] sm:right-[5%] md:right-[7%] bottom-[3%] sm:bottom-[5%] w-[210px] sm:w-[260px] md:w-[300px] lg:w-[330px] h-[150px] sm:h-[180px] md:h-[205px] lg:h-[225px] z-25 -rotate-2"
      />

      {/* 6. CENTERPIECE: DINIDU PORTRAIT (Z-30, Supreme Visual Priority) */}
      <LeisureImageCard
        ref={portraitRef}
        card={portraitCard}
        isHovered={hoveredId === portraitCard.id}
        isDimmed={hoveredId !== null && hoveredId !== portraitCard.id}
        onMouseEnter={() => setHoveredId(portraitCard.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] h-[330px] sm:h-[390px] md:h-[450px] lg:h-[480px] z-30 shadow-[0_35px_90px_rgba(0,0,0,0.95),0_0_45px_rgba(152,103,255,0.25)] border-white/25"
      />
    </div>
  );
}
