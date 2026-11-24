import { useEffect, useRef, useState, useCallback } from "react";

export type CursorState = "default" | "snap" | "view" | "drag" | "text" | "hidden";

interface SnapBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: string;
}

export default function CustomCursor() {
  // Only render on devices with hover capability and fine pointer,
  // respecting prefers-reduced-motion and forced-colors.
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const hasFinePointer =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forcedColors = window.matchMedia("(forced-colors: active)").matches;
    return hasFinePointer && !prefersReducedMotion && !forcedColors;
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  // Motion physics refs (zero React re-renders during 60/120Hz movement)
  const targetPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isMoving = useRef(false);
  const rAFId = useRef<number | null>(null);

  // Cursor state refs
  const stateRef = useRef<CursorState>("default");
  const snapBounds = useRef<SnapBounds | null>(null);
  const isWindowFocusedRef = useRef(true);
  const hasMovedOnceRef = useRef(false);
  const lastHoveredTargetRef = useRef<HTMLElement | null>(null);

  // Promote popover into browser top-layer (above native <dialog>)
  const ensureTopLayer = useCallback(() => {
    const el = wrapperRef.current;
    if (!el || typeof el.showPopover !== "function") return;
    try {
      el.showPopover();
    } catch {
      // In case popover is already showing
    }
  }, []);

  // Media queries listener
  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqAnyHover = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqColors = window.matchMedia("(forced-colors: active)");

    const checkSupport = () => {
      const supported =
        (mqHover.matches || mqAnyHover.matches) &&
        !mqMotion.matches &&
        !mqColors.matches;
      setIsSupported(supported);
      if (!supported) {
        document.documentElement.classList.remove("has-cursor");
      }
    };

    mqHover.addEventListener("change", checkSupport);
    mqAnyHover.addEventListener("change", checkSupport);
    mqMotion.addEventListener("change", checkSupport);
    mqColors.addEventListener("change", checkSupport);

    return () => {
      mqHover.removeEventListener("change", checkSupport);
      mqAnyHover.removeEventListener("change", checkSupport);
      mqMotion.removeEventListener("change", checkSupport);
      mqColors.removeEventListener("change", checkSupport);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  // Main Cursor Loop & Event Coordination
  useEffect(() => {
    if (!isSupported) return;

    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const lbl = labelRef.current;
    if (!wrapper || !dot || !ring || !lbl) return;

    ensureTopLayer();

    // Re-promote whenever any native <dialog> opens
    const dialogObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "open") {
          const target = m.target as HTMLElement;
          if (target.tagName === "DIALOG" && (target as HTMLDialogElement).open) {
            try {
              if (wrapper.hidePopover && wrapper.showPopover) {
                wrapper.hidePopover();
                wrapper.showPopover();
              }
            } catch {
              // fallback
            }
          }
        }
      }
    });
    dialogObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["open"] });

    // -----------------------------------------------------------------------
    // Single requestAnimationFrame Physics Engine
    // -----------------------------------------------------------------------
    const render = () => {
      const tx = targetPos.current.x;
      const ty = targetPos.current.y;

      // When snapped to an element, ring glides to element center
      const destinationX =
        stateRef.current === "snap" && snapBounds.current
          ? snapBounds.current.x
          : tx;
      const destinationY =
        stateRef.current === "snap" && snapBounds.current
          ? snapBounds.current.y
          : ty;

      // Trailing lerp 0.17
      const rx = ringPos.current.x + (destinationX - ringPos.current.x) * 0.17;
      const ry = ringPos.current.y + (destinationY - ringPos.current.y) * 0.17;
      ringPos.current.x = rx;
      ringPos.current.y = ry;

      // Dot follows pointer instantly (zero lag)
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

      // Ring trails to (rx, ry)
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

      const dist = Math.hypot(destinationX - rx, destinationY - ry);

      // Stop loop when settled and mouse has stopped moving
      if (dist < 0.1 && !isMoving.current) {
        rAFId.current = null;
        return;
      }

      rAFId.current = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (rAFId.current === null && isWindowFocusedRef.current) {
        rAFId.current = requestAnimationFrame(render);
      }
    };

    // -----------------------------------------------------------------------
    // State Determination & Transition Engine
    // -----------------------------------------------------------------------
    const applyState = ({
      state,
      label = "",
      element,
    }: {
      state: CursorState;
      label?: string;
      element?: HTMLElement;
    }) => {
      stateRef.current = state;
      ring.dataset.state = state;
      dot.dataset.state = state;
      lbl.textContent = label;

      if (state === "snap" && element) {
        const rect = element.getBoundingClientRect();
        const computed = window.getComputedStyle(element);
        snapBounds.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: Math.round(rect.width + 18),
          height: Math.round(rect.height + 14),
          borderRadius: computed.borderRadius || "9999px",
        };
        ring.style.width = `${snapBounds.current.width}px`;
        ring.style.height = `${snapBounds.current.height}px`;
        ring.style.borderRadius = snapBounds.current.borderRadius;
      } else {
        snapBounds.current = null;
        ring.style.width = "";
        ring.style.height = "";
        ring.style.borderRadius = "";
      }

      startLoop();
    };

    const determineState = (
      target: HTMLElement | null
    ): { state: CursorState; label?: string; element?: HTMLElement } => {
      if (!target) return { state: "default" };

      // 1. Native cursor exceptions (inputs, contenteditable, iframe, video controls, data-cur="none")
      const isInput = target.closest(
        'input, textarea, select, [contenteditable="true"], iframe, video[controls], audio[controls], [data-cur="none"]'
      );
      if (isInput) return { state: "hidden" };

      // 2. Clickable buttons & links: SNAP state (capped at 320x120px)
      const clickable = target.closest(
        'a[href], button, [role="button"], summary, label, [data-cur="snap"]'
      ) as HTMLElement | null;
      if (clickable) {
        const rect = clickable.getBoundingClientRect();
        if (rect.width <= 320 && rect.height <= 120 && rect.width > 0 && rect.height > 0) {
          return { state: "snap", element: clickable };
        }
        return { state: "default" };
      }

      // 3. Custom data-cur attributes (e.g. project cards "view", hero stage "drag")
      const customCur = target.closest("[data-cur]") as HTMLElement | null;
      if (customCur) {
        const cur = customCur.dataset.cur;
        if (cur === "view") return { state: "view", label: "View" };
        if (cur === "drag") return { state: "drag", label: "Drag" };
        if (cur === "text") return { state: "text" };
        if (cur === "none") return { state: "hidden" };
      }

      // 4. Text paragraphs and long text: TEXT state (shrink to 2px x 26px bar)
      const textEl = target.closest("p, li, blockquote") as HTMLElement | null;
      if (textEl) {
        return { state: "text" };
      }

      return { state: "default" };
    };

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // -----------------------------------------------------------------------
    // Mouse Move & State Update
    // -----------------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      isMoving.current = true;

      // Enable custom cursor class and ensure wrapper is visible
      if (!hasMovedOnceRef.current) {
        hasMovedOnceRef.current = true;
        document.documentElement.classList.add("has-cursor");
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
      }
      wrapper.style.opacity = "1";

      // Detect state change only when element under pointer changes
      const target = e.target as HTMLElement | null;
      if (target !== lastHoveredTargetRef.current) {
        lastHoveredTargetRef.current = target;
        const next = determineState(target);
        applyState(next);
      }

      startLoop();

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving.current = false;
      }, 50);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        // Pointer left the window
        wrapper.style.opacity = "0";
        lastHoveredTargetRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      if (hasMovedOnceRef.current) {
        wrapper.style.opacity = "1";
      }
    };

    // -----------------------------------------------------------------------
    // Click & Press Feedback (Transform only, 150ms spring via CSS scale)
    // -----------------------------------------------------------------------
    const handlePointerDown = () => {
      ring.classList.add("is-pressed");
    };

    const handlePointerUp = () => {
      ring.classList.remove("is-pressed");
    };

    // -----------------------------------------------------------------------
    // Drop back to default state on Lenis scroll (no layout reads)
    // -----------------------------------------------------------------------
    const lenis = (
      window as unknown as {
        __lenis?: {
          on: (event: string, cb: () => void) => void;
          off: (event: string, cb: () => void) => void;
        };
      }
    ).__lenis;

    const handleScroll = () => {
      if (stateRef.current === "snap") {
        lastHoveredTargetRef.current = null;
        applyState({ state: "default" });
      }
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Tab visibility handling
    const handleVisibility = () => {
      isWindowFocusedRef.current = !document.hidden;
      if (!document.hidden) {
        startLoop();
      } else if (rAFId.current !== null) {
        cancelAnimationFrame(rAFId.current);
        rAFId.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (rAFId.current !== null) {
        cancelAnimationFrame(rAFId.current);
        rAFId.current = null;
      }
      if (idleTimer) clearTimeout(idleTimer);
      dialogObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
      document.documentElement.classList.remove("has-cursor");
    };
  }, [isSupported, ensureTopLayer]);

  if (!isSupported) return null;

  return (
    <div
      ref={wrapperRef}
      popover="manual"
      className="custom-cursor-wrapper"
      aria-hidden="true"
      role="presentation"
    >
      {/* Instant 6px Violet Dot */}
      <div ref={dotRef} className="custom-cursor-dot" />

      {/* Trailing Ring with 5 dynamic morphological states */}
      <div ref={ringRef} className="custom-cursor-ring" data-state="default">
        <span ref={labelRef} className="custom-cursor-label" />
      </div>
    </div>
  );
}
