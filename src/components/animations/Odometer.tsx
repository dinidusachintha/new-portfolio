import { useEffect, useRef, useState } from "react";

export interface OdometerProps {
  value: string; // e.g. "1y", "5+", "20+", "<100ms", "99.9%"
  label?: string; // Screen reader text, e.g. "1 year industry experience"
  className?: string;
  digitClassName?: string;
  suffixClassName?: string;
}

// 20-digit stack for smooth continuous rolling past at least one full cycle
const DIGITS_STACK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Odometer({
  value,
  label,
  className = "",
  digitClassName = "",
  suffixClassName = "",
}: OdometerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animatedRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setInView(true);
      animatedRef.current = true;
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "80px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const characters = value.split("");

  return (
    <div
      ref={containerRef}
      className={`odometer-root inline-flex items-baseline font-mono select-none ${className}`}
      aria-label={label || value}
      role="text"
    >
      <span aria-hidden="true" className="odometer-viewport inline-flex items-baseline">
        {characters.map((char, idx) => {
          const isDigit = /^[0-9]$/.test(char);

          if (!isDigit) {
            return (
              <span key={idx} className={`odometer-symbol ${suffixClassName}`}>
                {char}
              </span>
            );
          }

          const targetNum = parseInt(char, 10);
          // Target index in 20-digit stack: 10 + targetNum
          const targetIndex = 10 + targetNum;
          const targetPercent = targetIndex * 5; // 5% per digit
          const transitionDelay = `${idx * 0.1}s`;

          return (
            <span key={idx} className={`odometer-column ${digitClassName}`}>
              <span
                className="odometer-strip flex flex-col"
                style={{
                  transform: inView ? `translate3d(0, -${targetPercent}%, 0)` : "translate3d(0, 0, 0)",
                  transitionDuration: inView ? "1.25s" : "0s",
                  transitionDelay,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {DIGITS_STACK.map((d, dIdx) => (
                  <span key={dIdx} className="odometer-digit flex items-center justify-center">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </div>
  );
}
