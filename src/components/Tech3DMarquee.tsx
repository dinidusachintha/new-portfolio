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
        <span className="tech-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L12 2Z" />
          </svg>
        </span>
      );
    case "hexagon":
      return (
        <span className="tech-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </span>
      );
    case "star":
      return (
        <span className="tech-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "cube":
      return (
        <span className="tech-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </span>
      );
  }
}

interface Tech3DMarqueeProps {
  className?: string;
}

export default function Tech3DMarquee({ className = "" }: Tech3DMarqueeProps) {
  return (
    <div
      className={`tech-3d-marquee-container ${className}`}
      aria-label="3D Core Runtimes & Infrastructure Icons"
    >
      <div className="tech-3d-glass-sweep" aria-hidden="true" />
      <div className="tech-3d-track">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="tech-3d-group"
            aria-hidden={copyIndex > 0 ? "true" : undefined}
          >
            {marqueeTechnologies.map((item, idx) => {
              const floatDelay = `${(idx % 4) * 0.55}s`;

              return (
                <React.Fragment key={`${copyIndex}-${item.id}`}>
                  <div
                    className="tech-3d-pedestal group"
                    role="img"
                    aria-label={item.alt}
                  >
                    <div className="tech-3d-pedestal-shine" aria-hidden="true" />
                    <div
                      className="tech-3d-img-wrap"
                      style={{ animationDelay: floatDelay }}
                    >
                      <picture>
                        <source srcSet={asset(item.imageWebp)} type="image/webp" />
                        <img
                          src={asset(item.imagePng)}
                          alt={item.alt}
                          width={64}
                          height={64}
                          loading="lazy"
                          decoding="async"
                          className="tech-3d-img"
                        />
                      </picture>
                    </div>
                  </div>

                  <GeometricSeparator type={item.separatorType} />
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
