import { useEffect, useRef } from "react";

interface CountUpNumberProps {
  value: string | number;
  className?: string;
  duration?: number;
}

/**
 * CountUpNumber: High-performance number counter that animates 0 -> target
 * once on viewport entry via IntersectionObserver.
 * - Zero React re-renders during animation
 * - Updates DOM textContent directly via ref
 * - Respects prefers-reduced-motion immediately
 */
export default function CountUpNumber({
  value,
  className = "",
  duration = 1.2,
}: CountUpNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || animatedRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      el.textContent = String(value);
      animatedRef.current = true;
      return;
    }

    // Parse value: extracts prefix, numeric value, decimal places, suffix
    const strVal = String(value).trim();
    const match = strVal.match(/^([^0-9.]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);

    if (!match) {
      el.textContent = strVal;
      animatedRef.current = true;
      return;
    }

    const prefix = match[1] || "";
    const target = parseFloat(match[2]);
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    const suffix = match[3] || "";

    // Set initial 0 value
    el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;
        animatedRef.current = true;
        io.disconnect();

        const startTime = performance.now();
        const durationMs = duration * 1000;

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / durationMs);

          // Ease out exponential curve: 1 - 2^(-10 * p)
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = target * ease;

          el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          }
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.15, rootMargin: "50px" },
    );

    io.observe(el);

    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={spanRef} className={className}>
      {String(value)}
    </span>
  );
}
