import { useEffect, useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";

interface FlyingHeadingProps {
  line1: string;
  line2?: string;
  line2ClassName?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  enableGlitch?: boolean;
}

const headingContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.024,
      delayChildren: 0.08,
    },
  },
};

const letterFlyVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: i % 2 === 0 ? -38 : 38,
    x: ((i % 5) - 2) * 5,
    scale: 0.6,
    rotateZ: i % 2 === 0 ? -12 : 12,
    filter: "blur(8px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotateZ: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function FlyingLetters({
  text,
  startIdx = 0,
  letterClassName = "",
}: {
  text: string;
  startIdx?: number;
  letterClassName?: string;
}) {
  let charCounter = startIdx;
  const words = text.split(" ");

  return (
    <>
      {words.map((word, wIdx) => {
        const letters = Array.from(word);
        return (
          <span key={`w-${wIdx}`} className="inline-block whitespace-nowrap">
            {letters.map((char, cIdx) => {
              const currentIdx = charCounter++;
              return (
                <motion.span
                  key={`c-${wIdx}-${cIdx}`}
                  custom={currentIdx}
                  variants={letterFlyVariants}
                  className={`inline-block will-change-transform flying-char-letter flying-rgb-char ${letterClassName}`.trim()}
                  data-char={char}
                >
                  {char}
                </motion.span>
              );
            })}
            {wIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </>
  );
}

export default function FlyingHeading({
  line1,
  line2,
  line2ClassName = "text-muted",
  className = "font-unbounded",
  as: Component = "h2",
  enableGlitch = true,
}: FlyingHeadingProps) {
  const [displayLine1, setDisplayLine1] = useState(line1);
  const [displayLine2, setDisplayLine2] = useState(line2 || "");
  const [isGlitching, setIsGlitching] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setDisplayLine1(line1);
    setDisplayLine2(line2 || "");
  }, [line1, line2]);

  // High-speed cyber scramble and RGB glitch trigger on hover/interaction
  const triggerGlitch = useCallback(() => {
    if (!enableGlitch || isGlitching) return;
    setIsGlitching(true);

    const GLYPHS = "01X#_<>!?*/+~$%&";
    let iteration = 0;
    const maxIterations = 4;

    const interval = setInterval(() => {
      iteration++;
      if (iteration < maxIterations) {
        // Scramble with futuristic cyber glyphs
        setDisplayLine1(
          line1
            .split("")
            .map((c) => (c === " " ? " " : Math.random() > 0.45 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c))
            .join("")
        );
        if (line2) {
          setDisplayLine2(
            line2
              .split("")
              .map((c) => (c === " " ? " " : Math.random() > 0.45 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c))
              .join("")
          );
        }
      } else {
        clearInterval(interval);
        setDisplayLine1(line1);
        if (line2) setDisplayLine2(line2);
        setIsGlitching(false);
      }
    }, 60);
  }, [enableGlitch, isGlitching, line1, line2]);

  // Ambient periodic subtle micro-glitch (every 7 seconds)
  useEffect(() => {
    if (!enableGlitch) return;

    const timer = setInterval(() => {
      if (Math.random() > 0.5) {
        triggerGlitch();
      }
    }, 7500);

    return () => clearInterval(timer);
  }, [enableGlitch, triggerGlitch]);

  const line1Len = displayLine1.replace(/\s+/g, "").length;

  return (
    <Component
      className={`${className} flying-heading-glitch-wrap ${isGlitching ? "is-glitching" : ""}`}
      aria-label={line2 ? `${line1} ${line2}` : line1}
      onMouseEnter={triggerGlitch}
      onClick={triggerGlitch}
      title={enableGlitch ? "Hover to glitch" : undefined}
    >
      <motion.span
        className="block"
        variants={headingContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <span className="block" aria-hidden="true">
          <FlyingLetters text={displayLine1} startIdx={0} />
        </span>
        {line2 && (
          <span className={`block ${line2ClassName}`} aria-hidden="true">
            <FlyingLetters text={displayLine2} startIdx={line1Len} />
          </span>
        )}
      </motion.span>
    </Component>
  );
}
