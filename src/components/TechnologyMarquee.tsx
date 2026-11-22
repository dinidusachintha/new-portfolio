import { techMarquee } from "../data/portfolio";

interface TechnologyMarqueeProps {
  className?: string;
}

export default function TechnologyMarquee({ className = "" }: TechnologyMarqueeProps) {
  // Render 3 seamless repeats for an unbroken 60fps infinite marquee loop
  const items = [...techMarquee, ...techMarquee, ...techMarquee];

  return (
    <div
      className={`hero-pill-marquee-wrap ${className}`}
      aria-label="Core Engineering Technologies and Tooling"
    >
      <div className="hero-pill-marquee-track">
        {items.map((tech, idx) => (
          <span key={idx} className="hero-pill-item">
            <span className="hero-pill-bullet" aria-hidden="true">
              ✦
            </span>
            <span className="hero-pill-text">{tech}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
