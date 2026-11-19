import React from "react";
import { asset } from "../data/portfolio";

export interface TechnologyItem {
  id: string;
  imageWebp: string;
  imagePng: string;
  alt: string;
  separatorType: "diamond" | "hexagon" | "star" | "cube";
}

const marqueeTechnologies: TechnologyItem[] = [
  {
    id: "react",
    imageWebp: "/assets/images/3d/react-3d.webp",
    imagePng: "/assets/images/3d/react-3d.png",
    alt: "3D React Logo",
    separatorType: "diamond",
  },
  {
    id: "typescript",
    imageWebp: "/assets/images/3d/typescript-3d.webp",
    imagePng: "/assets/images/3d/typescript-3d.png",
    alt: "3D TypeScript Icon",
    separatorType: "hexagon",
  },
  {
    id: "nodejs",
    imageWebp: "/assets/images/3d/nodejs-3d.webp",
    imagePng: "/assets/images/3d/nodejs-3d.png",
    alt: "3D Node.js Logo",
    separatorType: "star",
  },
  {
    id: "cloud",
    imageWebp: "/assets/images/3d/cloud-3d.webp",
    imagePng: "/assets/images/3d/cloud-3d.png",
    alt: "3D Cloud Computing",
    separatorType: "cube",
  },
  {
    id: "aiml",
    imageWebp: "/assets/images/3d/ai-orb-3d.webp",
    imagePng: "/assets/images/3d/ai-orb-3d.png",
    alt: "3D AI Orb",
    separatorType: "diamond",
  },
  {
    id: "mongodb",
    imageWebp: "/assets/images/3d/mongodb-3d.webp",
    imagePng: "/assets/images/3d/mongodb-3d.png",
    alt: "3D Database Icon",
    separatorType: "hexagon",
  },
  {
    id: "webdev",
    imageWebp: "/assets/images/3d/code-brackets-3d.webp",
    imagePng: "/assets/images/3d/code-brackets-3d.png",
    alt: "3D Code Brackets",
    separatorType: "star",
  },
  {
    id: "creative-eng",
    imageWebp: "/assets/images/3d/chrome-torus-3d.webp",
    imagePng: "/assets/images/3d/chrome-torus-3d.png",
    alt: "3D Chrome Torus",
    separatorType: "cube",
  },
];

function GeometricSeparator({ type }: { type: TechnologyItem["separatorType"] }) {
  switch (type) {
    case "diamond":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7FB3B8]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
          </svg>
        </span>
      );
    case "hexagon":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8601F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </span>
      );
    case "star":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7FB3B8]" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "cube":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EADCC8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </span>
      );
  }
}

interface TechnologyMarqueeProps {
  className?: string;
}

export default function TechnologyMarquee({ className = "" }: TechnologyMarqueeProps) {
  return (
    <section
      className={`tech-marquee-section ${className}`}
      aria-label="3D Technology Showcase"
      tabIndex={0}
    >
      {/* Dynamic Glass Light Prism Shine Sweep Beam matching the hero collaboration button */}
      <div className="tech-marquee-glass-shine" aria-hidden="true" />

      {/* Decorative ambient borders matching liquid glass button border style */}
      <div className="tech-marquee-edge-line tech-marquee-edge-top" />
      <div className="tech-marquee-edge-line tech-marquee-edge-bottom" />

      {/* Track container with smooth infinite GPU scrolling */}
      <div className="tech-marquee-track">
        {/* Render 2 identical sets for mathematical seamless infinite loop */}
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="tech-marquee-group"
            aria-hidden={copyIndex > 0 ? "true" : undefined}
          >
            {marqueeTechnologies.map((item, idx) => {
              // Staggered floating wave animation delay
              const floatDelay = `${(idx % 4) * 0.55}s`;

              return (
                <React.Fragment key={`${copyIndex}-${item.id}`}>
                  {/* Ultra-Premium Glass Pedestal matching button liquid glass aesthetic */}
                  <div
                    className="tech-marquee-pedestal group"
                    role="img"
                    aria-label={item.alt}
                  >
                    {/* Inner Glass Prism Flare */}
                    <div className="tech-marquee-pedestal-shine" aria-hidden="true" />

                    {/* 3D Image Container with floating wave and perspective tilt on hover */}
                    <div
                      className="tech-marquee-img-wrap"
                      style={{ animationDelay: floatDelay }}
                    >
                      <picture>
                        <source srcSet={asset(item.imageWebp)} type="image/webp" />
                        <img
                          src={asset(item.imagePng)}
                          alt={item.alt}
                          width={64}
                          height={64}
                          loading="eager"
                          decoding="async"
                          className="tech-marquee-img"
                        />
                      </picture>
                    </div>
                  </div>

                  {/* Glowing Geometric Separator between icons */}
                  <GeometricSeparator type={item.separatorType} />
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
