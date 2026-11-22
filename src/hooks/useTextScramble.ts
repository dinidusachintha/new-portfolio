import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "01_X#$!*?%&~+<>";

export function useTextScramble(text: string, duration = 800) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Sync if text changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const triggerScramble = useCallback(() => {
    // Prevent overlapping runs
    if (isScramblingRef.current) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(text);
      return;
    }

    isScramblingRef.current = true;
    const startTime = performance.now();
    const len = text.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Characters resolve left to right
      // resolvedCount moves from 0 to len
      const resolvedCount = Math.floor(progress * len);

      let scrambled = "";
      for (let i = 0; i < len; i++) {
        const char = text[i];
        if (char === " " || char === "\n") {
          scrambled += char;
        } else if (i < resolvedCount) {
          scrambled += char;
        } else {
          // Random glyph from set
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
        isScramblingRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      isScramblingRef.current = false;
    };
  }, []);

  return { displayText, triggerScramble, isScrambling: isScramblingRef.current };
}
