import { useEffect, useRef, useCallback } from "react";
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

interface SmoothScrollOptions {
  enabled?: boolean;
  onScroll?: (e: LenisScrollEvent) => void;
}

/**
 * useSmoothScroll: Centralized Lenis & GSAP ScrollTrigger synchronizer.
 * - Single Lenis instance driven by gsap.ticker with lagSmoothing(0)
 * - Native touch scrolling preserved on mobile
 * - Automatically disables when prefers-reduced-motion is active
 * - Full cleanup on unmount
 */
export function useSmoothScroll({ enabled = true, onScroll }: SmoothScrollOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!enabled || prefersReducedMotion) {
      // If motion is reduced, allow native instant browser scrolling with lightweight scroll updates
      const handleNativeScroll = () => {
        const scroll = window.scrollY || window.pageYOffset;
        const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(Math.max(scroll / limit, 0), 1);
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

    // Initialize single Lenis instance
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easeOut
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false, // Driven by GSAP ticker below
    });

    lenisRef.current = lenis;

    // Expose instance for dialogs and modal preventions
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // 1. Sync Lenis scroll events to GSAP ScrollTrigger and pass to onScroll handler
    lenis.on("scroll", (e: LenisScrollEvent) => {
      ScrollTrigger.update();
      onScrollRef.current?.(e);
    });

    // 2. Drive Lenis through GSAP ticker for 60fps frame synchronization
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger layout calculation
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
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

  return {
    lenis: lenisRef,
    scrollTo,
    stop,
    start,
  };
}
