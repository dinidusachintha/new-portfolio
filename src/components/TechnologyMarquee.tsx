import React from "react";
import { asset } from "../data/portfolio";

export interface TechnologyItem {
  id: string;
  name: string;
  shortLabel: string;
  imageWebp: string;
  imagePng: string;
  alt: string;
  separatorType: "diamond" | "hexagon" | "star" | "cube";
}

const marqueeTechnologies: TechnologyItem[] = [
  {
    id: "react",
    name: "React",
    shortLabel: "UI Architecture",
    imageWebp: "/assets/images/3d/react-3d.webp",
    imagePng: "/assets/images/3d/react-3d.png",
    alt: "3D React Logo with Orbital Rings",
    separatorType: "diamond",
  },
  {
    id: "typescript",
    name: "TypeScript",
    shortLabel: "Type Safety",
    imageWebp: "/assets/images/3d/typescript-3d.webp",
    imagePng: "/assets/images/3d/typescript-3d.png",
    alt: "3D TypeScript Icon with Cyan Accents",
    separatorType: "hexagon",
  },
  {
    id: "nodejs",
    name: "Node.js",
    shortLabel: "Scalable Runtime",
    imageWebp: "/assets/images/3d/nodejs-3d.webp",
    imagePng: "/assets/images/3d/nodejs-3d.png",
    alt: "3D Node.js Hexagonal Logo",
    separatorType: "star",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    shortLabel: "Distributed Infra",
    imageWebp: "/assets/images/3d/cloud-3d.webp",
    imagePng: "/assets/images/3d/cloud-3d.png",
    alt: "3D Volumetric Floating Cloud",
    separatorType: "cube",
  },
  {
    id: "aiml",
    name: "AI & Machine Learning",
    shortLabel: "Neural Engines",
    imageWebp: "/assets/images/3d/ai-orb-3d.webp",
    imagePng: "/assets/images/3d/ai-orb-3d.png",
    alt: "3D Futuristic AI Holographic Orb",
    separatorType: "diamond",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    shortLabel: "Data Systems",
    imageWebp: "/assets/images/3d/mongodb-3d.webp",
    imagePng: "/assets/images/3d/mongodb-3d.png",
    alt: "3D Database Cylinder Stack",
    separatorType: "hexagon",
  },
  {
    id: "webdev",
    name: "Web Development",
    shortLabel: "Fullstack Architecture",
    imageWebp: "/assets/images/3d/code-brackets-3d.webp",
    imagePng: "/assets/images/3d/code-brackets-3d.png",
    alt: "3D Floating Code Brackets",
    separatorType: "star",
  },
  {
    id: "creative-eng",
    name: "Creative Engineering",
    shortLabel: "3D & Motion",
    imageWebp: "/assets/images/3d/chrome-torus-3d.webp",
    imagePng: "/assets/images/3d/chrome-torus-3d.png",
    alt: "3D Abstract Chrome Torus Knot",
    separatorType: "cube",
  },
];

function GeometricSeparator({ type }: { type: TechnologyItem["separatorType"] }) {
  switch (type) {
    case "diamond":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
          </svg>
        </span>
      );
    case "hexagon":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </span>
      );
    case "star":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "cube":
      return (
        <span className="marquee-3d-separator" aria-hidden="true">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      {/* Decorative ambient borders */}
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
              const floatDelay = `${(idx % 4) * 0.6}s`;

              return (
                <React.Fragment key={`${copyIndex}-${item.id}`}>
                  <div
                    className="tech-marquee-card group"
                    role="group"
                    aria-label={`${item.name} - ${item.shortLabel}`}
                  >
                    {/* 3D Image Container with subtle floating and gentle 3D tilt on hover */}
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

                    {/* Typography: White name with subtle electric cyan highlight badge */}
                    <div className="tech-marquee-meta">
                      <span className="tech-marquee-name font-mono">
                        {item.name}
                      </span>
                      <span className="tech-marquee-badge">
                        <span className="tech-marquee-dot" />
                        {item.shortLabel}
                      </span>
                    </div>
                  </div>

                  {/* Glowing Geometric Separator between items */}
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
