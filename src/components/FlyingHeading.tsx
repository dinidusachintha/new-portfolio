import { motion, type Variants } from "framer-motion";

interface FlyingHeadingProps {
  line1: string;
  line2?: string;
  line2ClassName?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
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
                  className={`inline-block will-change-transform flying-char-letter ${letterClassName}`.trim()}
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
}: FlyingHeadingProps) {
  const line1Len = line1.replace(/\s+/g, "").length;

  return (
    <Component className={className} aria-label={line2 ? `${line1} ${line2}` : line1}>
      <motion.span
        className="block"
        variants={headingContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <span className="block" aria-hidden="true">
          <FlyingLetters text={line1} startIdx={0} />
        </span>
        {line2 && (
          <span className={`block ${line2ClassName}`} aria-hidden="true">
            <FlyingLetters text={line2} startIdx={line1Len} />
          </span>
        )}
      </motion.span>
    </Component>
  );
}
