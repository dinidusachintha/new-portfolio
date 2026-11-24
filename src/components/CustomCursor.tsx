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
  // Only render on devices with hover capability and fine pointer (mouse/trackpad),
  // respecting prefers-reduced-motion and forced-colors.
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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
  const isSettled = useRef(true);
  const rAFId = useRef<number | null>(null);

  // Cursor state refs
  const stateRef = useRef<CursorState>("default");
  const snapBounds = useRef<SnapBounds | null>(null);
  const isPressedRef = useRef(false);
  const isWindowFocusedRef = useRef(true);
  const hasMovedOnceRef = useRef(false);

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

  // Update dynamic classes and text based on current state
  const updateCursorClasses = useCallback((state: CursorState, label = "") => {
    stateRef.current = state;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const lbl = labelRef.current;
    if (!ring || !dot || !lbl) return;

    ring.dataset.state = state;
    dot.dataset.state = state;
    lbl.textContent = label;

    if (state === "snap" && snapBounds.current) {
      ring.style.width = `${snapBounds.current.width}px`;
      ring.style.height = `${snapBounds.current.height}px`;
      ring.style.borderRadius = snapBounds.current.borderRadius;
    } else {
      ring.style.width = "";
      ring.style.height = "";
      ring.style.borderRadius = "";
    }
  }, []);

  // Media queries listener
  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqColors = window.matchMedia("(forced-colors: active)");

    const checkSupport = () => {
      const supported = mqHover.matches && !mqMotion.matches && !mqColors.matches;
      setIsSupported(supported);
      if (!supported) {
        document.documentElement.classList.remove("has-cursor");
      }
    };

    mqHover.addEventListener("change", checkSupport);
    mqMotion.addEventListener("change", checkSupport);
    mqColors.addEventListener("change", checkSupport);

    return () => {
      mqHover.removeEventListener("change", checkSupport);
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
    if (!wrapper || !dot || !ring) return;

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

      // Dot follows pointer instantly
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

      // Ring trails with press scale feedback
      const scaleVal = isPressedRef.current ? 0.85 : 1;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scaleVal})`;

      const dist = Math.hypot(destinationX - rx, destinationY - ry);

      // Stop loop when settled and mouse is not moving
      if (dist < 0.1 && !isMoving.current) {
        isSettled.current = true;
        rAFId.current = null;
        return;
      }

      isSettled.current = false;
      rAFId.current = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (rAFId.current === null && isWindowFocusedRef.current) {
        rAFId.current = requestAnimationFrame(render);
      }
    };

    // -----------------------------------------------------------------------
    // Mouse Move & Native Cursor Safe Initialization
    // -----------------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      isMoving.current = true;

      // First move initialization: enable custom cursor & hide native cursor
      if (!hasMovedOnceRef.current) {
        hasMovedOnceRef.current = true;
        document.documentElement.classList.add("has-cursor");
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        wrapper.style.opacity = "1";
      }

      startLoop();

      // Reset moving flag on idle
      clearTimeout((handleMouseMove as unknown as { idleTimer?: ReturnType<typeof setTimeout> }).idleTimer);
      (handleMouseMove as unknown as { idleTimer?: ReturnType<typeof setTimeout> }).idleTimer = setTimeout(() => {
        isMoving.current = false;
      }, 40);
    };

    // -----------------------------------------------------------------------
    // Delegated State Determination (Single mouseover on document)
    // -----------------------------------------------------------------------
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Native cursor exceptions (inputs, editable, video, etc.)
      const isInput = target.closest(
        'input, textarea, select, [contenteditable="true"], iframe, video, audio, [data-cur="none"]'
      );
      if (isInput) {
        updateCursorClasses("hidden");
        return;
      }

      const match = target.closest(
        '[data-cur], a[href], button, [role="button"], summary, label, p, li, blockquote'
      ) as HTMLElement | null;

      if (!match) {
        snapBounds.current = null;
        updateCursorClasses("default");
        return;
      }

      const customState = match.dataset.cur as CursorState | undefined;

      if (customState === "view") {
        snapBounds.current = null;
        updateCursorClasses("view", "View");
        return;
      }

      if (customState === "drag") {
        snapBounds.current = null;
        updateCursorClasses("drag", "Drag");
        return;
      }

      if (customState === "text" || /^(P|LI|BLOCKQUOTE)$/.test(match.tagName)) {
        snapBounds.current = null;
        updateCursorClasses("text");
        return;
      }

      // Snap state for buttons & links: read layout ONCE here in mouseover
      const rect = match.getBoundingClientRect();
      // Cap snap size at 320x120px; larger elements keep the default ring
      if (rect.width <= 320 && rect.height <= 120 && rect.width > 0 && rect.height > 0) {
        const computed = window.getComputedStyle(match);
        snapBounds.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: Math.round(rect.width + 18),
          height: Math.round(rect.height + 14),
          borderRadius: computed.borderRadius || "9999px",
        };
        updateCursorClasses("snap");
      } else {
        snapBounds.current = null;
        updateCursorClasses("default");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        // Pointer left the window
        wrapper.style.opacity = "0";
      }
    };

    const handleMouseEnter = () => {
      if (hasMovedOnceRef.current) {
        wrapper.style.opacity = "1";
      }
    };

    // -----------------------------------------------------------------------
    // Click & Press Feedback (Transform only, 150ms)
    // -----------------------------------------------------------------------
    const handlePointerDown = () => {
      isPressedRef.current = true;
      startLoop();
    };

    const handlePointerUp = () => {
      isPressedRef.current = false;
      startLoop();
    };

    // -----------------------------------------------------------------------
    // Drop back to default state on Lenis scroll (no layout reads)
    // -----------------------------------------------------------------------
    const lenis = (window as unknown as { __lenis?: { on: (event: string, cb: () => void) => void; off: (event: string, cb: () => void) => void } }).__lenis;

    const handleScroll = () => {
      if (stateRef.current === "snap") {
        snapBounds.current = null;
        updateCursorClasses("default");
        startLoop();
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
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
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
      dialogObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
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
  }, [isSupported, ensureTopLayer, updateCursorClasses]);

  if (!isSupported) return null;

  return (
    <div
      ref={wrapperRef}
      // @ts-expect-error popover attribute is standard in modern HTML
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
