import React, { useRef } from "react";
import gsap from "gsap";

export interface LetterWaveProps {
  text: string;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p";
  stagger?: number; // seconds per letter, default 0.045s (45ms)
}

export default function LetterWave({
  text,
  className = "",
  as: Component = "span",
  stagger = 0.045,
}: LetterWaveProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isWavingRef = useRef(false);

  const handleTrigger = () => {
    const el = containerRef.current;
    if (!el || isWavingRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const letters = el.querySelectorAll<HTMLElement>(".wave-letter");
    if (!letters.length) return;

    isWavingRef.current = true;

    gsap.timeline({
      onComplete: () => {
        isWavingRef.current = false;
        gsap.set(letters, { clearProps: "transform" });
      },
    }).to(letters, {
      y: -8,
      duration: 0.22,
      stagger,
      ease: "power2.out",
    }).to(letters, {
      y: 0,
      duration: 0.26,
      stagger,
      ease: "power3.inOut",
    }, 0.12);
  };

  return (
    <Component
      ref={containerRef as React.RefObject<any>}
      className={`letter-wave-wrap inline-block cursor-pointer select-none ${className}`}
      aria-label={text}
      onMouseEnter={handleTrigger}
      onFocus={handleTrigger}
      tabIndex={0}
    >
      <span aria-hidden="true" className="letter-wave-inner inline-flex flex-wrap">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="wave-letter inline-block transition-transform will-change-transform"
            style={{
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Component>
  );
}
