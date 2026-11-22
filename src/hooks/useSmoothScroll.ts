import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface LenisScrollEvent {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}

export interface SmoothScrollContextValue {
  lenis: React.RefObject<Lenis | null>;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
    },
  ) => void;
  stop: () => void;
  start: () => void;
  velocityRef: React.RefObject<number>;
  getVelocity: () => number;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

interface SmoothScrollProviderProps {
  children: ReactNode;
  enabled?: boolean;
  onScroll?: (e: LenisScrollEvent) => void;
}

/**
 * SmoothScrollProvider: Centralized Lenis & GSAP ScrollTrigger synchronizer.
 * - Single Lenis instance driven by gsap.ticker with lagSmoothing(0)
 * - Exposes lenis instance, velocity, and controls via context
 * - Touch scrolling preserved on mobile
 * - Automatically disables when prefers-reduced-motion is active
 * - Full cleanup on unmount
 */
export function SmoothScrollProvider({
  children,
  enabled = true,
  onScroll,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const velocityRef = useRef<number>(0);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!enabled || prefersReducedMotion) {
      const handleNativeScroll = () => {
        const scroll = window.scrollY || window.pageYOffset;
        const limit = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(Math.max(scroll / limit, 0), 1);
        velocityRef.current = 0;
        onScrollRef.current?.({
          scroll,
          limit,
          velocity: 0,
          direction: 1,
          progress,
        });
      };
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false, // Driven by GSAP ticker
    });

    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // 1. Sync Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", (e: LenisScrollEvent) => {
      velocityRef.current = e.velocity;
      ScrollTrigger.update();
      onScrollRef.current?.(e);
      window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: e }));
    });

    // 2. Drive Lenis through GSAP ticker for 60fps frame synchronization
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      velocityRef.current = 0;
      if ((window as unknown as { __lenis?: Lenis }).__lenis === lenis) {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, [enabled]);

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: {
        offset?: number;
        duration?: number;
        immediate?: boolean;
      },
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else {
        if (typeof target === "number") {
          window.scrollTo({
            top: target,
            behavior: options?.immediate ? "instant" : "smooth",
          });
        } else if (typeof target === "string") {
          const el = document.querySelector(target);
          if (el) {
            const top =
              el.getBoundingClientRect().top +
              window.pageYOffset +
              (options?.offset ?? 0);
            window.scrollTo({
              top,
              behavior: options?.immediate ? "instant" : "smooth",
            });
          }
        } else if (target instanceof HTMLElement) {
          const top =
            target.getBoundingClientRect().top +
            window.pageYOffset +
            (options?.offset ?? 0);
          window.scrollTo({
            top,
            behavior: options?.immediate ? "instant" : "smooth",
          });
        }
      }
    },
    [],
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const getVelocity = useCallback(() => {
    return velocityRef.current;
  }, []);

  const value: SmoothScrollContextValue = {
    lenis: lenisRef,
    scrollTo,
    stop,
    start,
    velocityRef,
    getVelocity,
  };

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/**
 * Hook to access centralized Lenis controls and velocity from any child component
 */
export function useSmoothScrollContext(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) {
    throw new Error(
      "useSmoothScrollContext must be used within a SmoothScrollProvider",
    );
  }
  return ctx;
}

export const useLenis = useSmoothScrollContext;

/**
 * Backward compatibility hook for App.tsx or standalone usage
 */
export function useSmoothScroll({
  enabled = true,
  onScroll,
}: {
  enabled?: boolean;
  onScroll?: (e: LenisScrollEvent) => void;
} = {}) {
  const lenisRef = useRef<Lenis | null>(null);
  const velocityRef = useRef<number>(0);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!enabled || prefersReducedMotion) {
      const handleNativeScroll = () => {
        const scroll = window.scrollY || window.pageYOffset;
        const limit = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(Math.max(scroll / limit, 0), 1);
        velocityRef.current = 0;
        onScrollRef.current?.({
          scroll,
          limit,
          velocity: 0,
          direction: 1,
          progress,
        });
      };
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", (e: LenisScrollEvent) => {
      velocityRef.current = e.velocity;
      ScrollTrigger.update();
      onScrollRef.current?.(e);
      window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: e }));
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      velocityRef.current = 0;
      if ((window as unknown as { __lenis?: Lenis }).__lenis === lenis) {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, [enabled]);

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: {
        offset?: number;
        duration?: number;
        immediate?: boolean;
      },
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else {
        if (typeof target === "number") {
          window.scrollTo({
            top: target,
            behavior: options?.immediate ? "instant" : "smooth",
          });
        } else if (typeof target === "string") {
          const el = document.querySelector(target);
          if (el) {
            const top =
              el.getBoundingClientRect().top +
              window.pageYOffset +
              (options?.offset ?? 0);
            window.scrollTo({
              top,
              behavior: options?.immediate ? "instant" : "smooth",
            });
          }
        } else if (target instanceof HTMLElement) {
          const top =
            target.getBoundingClientRect().top +
            window.pageYOffset +
            (options?.offset ?? 0);
          window.scrollTo({
            top,
            behavior: options?.immediate ? "instant" : "smooth",
          });
        }
      }
    },
    [],
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const getVelocity = useCallback(() => {
    return velocityRef.current;
  }, []);

  return {
    lenis: lenisRef,
    scrollTo,
    stop,
    start,
    velocityRef,
    getVelocity,
  };
}
