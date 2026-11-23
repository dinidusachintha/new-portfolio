import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface TextReveal3DProps {
  items?: string[];
  perspective?: number;
  radiusOffset?: number; // 0.1 to 1.0 (multiplier for cylinder radius)
  startRotation?: number; // initial degrees
  endRotation?: number; // final degrees
  textClassName?: string;
  className?: string;
}

const DEFAULT_ITEMS = [
  "PRODUCTION-GRADE ARCHITECTURES",
  "DISTRIBUTED HIGH-CONCURRENCY SYSTEMS",
  "FROM CODE TO MEASURABLE IMPACT",
  "SCALABLE FULL STACK EXCELLENCE",
  "EXPLORE FEATURED CASE STUDIES",
];

export default function TextReveal3D({
  items = DEFAULT_ITEMS,
  perspective = 1100,
  radiusOffset = 0.45,
  startRotation = -75,
  endRotation = 220,
  textClassName = "",
  className = "",
}: TextReveal3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cylinderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cylinder = cylinderRef.current;
    if (!container || !cylinder) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Calculate cylinder radius based on container height / radiusOffset
    const updateRadius = () => {
      const h = container.offsetHeight || window.innerHeight;
      const radius = Math.max(160, Math.min(380, h * radiusOffset));
      const lineEls = cylinder.querySelectorAll<HTMLElement>(".cylinder-text-line");
      const total = lineEls.length;

      lineEls.forEach((el, i) => {
        const angle = (i / total) * 360;
        el.style.transform = `rotateX(${angle}deg) translateZ(${radius}px)`;
      });
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);

    const ctx = gsap.context(() => {
      // Rotate the 3D cylinder as the user scrolls
      gsap.fromTo(
        cylinder,
        {
          rotationX: startRotation,
        },
        {
          rotationX: endRotation,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.8,
            onUpdate: (self) => {
              // Calculate lighting & opacity based on angle facing the viewer
              const currentRot = startRotation + self.progress * (endRotation - startRotation);
              const lineEls = cylinder.querySelectorAll<HTMLElement>(".cylinder-text-line");
              const total = lineEls.length;

              lineEls.forEach((el, i) => {
                const baseAngle = (i / total) * 360;
                // Relative angle to camera plane (normalized to -180 to 180)
                let relAngle = (baseAngle + currentRot) % 360;
                if (relAngle > 180) relAngle -= 360;
                if (relAngle < -180) relAngle += 360;

                const rad = (relAngle * Math.PI) / 180;
                const cos = Math.cos(rad);

                if (cos > 0) {
                  // Facing camera
                  const intensity = Math.pow(cos, 1.8);
                  el.style.opacity = `${Math.max(0.15, intensity)}`;
                  el.style.filter = `blur(${Math.max(0, (1 - cos) * 4)}px)`;
                  el.style.pointerEvents = cos > 0.8 ? "auto" : "none";
                } else {
                  // Back face
                  el.style.opacity = "0.05";
                  el.style.filter = "blur(6px)";
                  el.style.pointerEvents = "none";
                }
              });
            },
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", updateRadius);
    };
  }, [items, radiusOffset, startRotation, endRotation]);

  return (
    <div
      ref={containerRef}
      className={`text-reveal-3d-section relative w-full py-16 sm:py-24 overflow-hidden select-none ${className}`}
      aria-label="3D Text Reveal Transition"
    >
      {/* Background Subtle Cyber Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(152, 103, 255, 0.12) 0%, rgba(5,5,7,0.7) 65%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Eyebrow Milestone Tag */}
      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-mono text-xs uppercase tracking-widest">
          <Sparkles size={12} className="text-violet-400" />
          <span>EVOLUTION & ARCHITECTURAL FOCUS</span>
        </div>
      </div>

      {/* 3D Cylinder Stage */}
      <div
        className="cylinder-viewport relative w-full max-w-[1200px] h-[340px] sm:h-[420px] mx-auto flex items-center justify-center overflow-visible"
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          ref={cylinderRef}
          className="cylinder-drum relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {items.map((line, idx) => (
            <div
              key={idx}
              className={`cylinder-text-line absolute inset-x-4 sm:inset-x-8 text-center transition-all ${textClassName}`}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform, opacity, filter",
              }}
            >
              <h2 className="font-unbounded font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight uppercase">
                <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(152,103,255,0.45)]">
                  {line}
                </span>
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sub-Indicator */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-4 text-center">
        <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Layers size={13} className="text-violet-400" />
          <span>TRANSITIONING TO PRODUCTION CASE STUDIES</span>
        </span>
      </div>
    </div>
  );
}
