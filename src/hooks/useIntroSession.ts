import { useState } from "react";

const INTRO_SESSION_KEY = "dinidu_portfolio_intro_played";

export function useIntroSession() {
  const [shouldPlayIntro, setShouldPlayIntro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      // Respect accessibility preference for reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return false;

      // Play intro only once per browser tab session
      const alreadyPlayed = sessionStorage.getItem(INTRO_SESSION_KEY);
      return !alreadyPlayed;
    } catch {
      // Storage unavailable or private mode restriction fallback
      return false;
    }
  });

  const markIntroSeen = () => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // Silently handle storage write failures
    }
    setShouldPlayIntro(false);
  };

  return { shouldPlayIntro, markIntroSeen };
}
