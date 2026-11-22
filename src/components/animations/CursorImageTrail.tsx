import { useEffect, useRef, useState } from "react";
import { projects, asset } from "../../data/portfolio";

interface TrailCard {
  id: number;
  x: number;
  y: number;
  image: string;
  title: string;
}

export default function CursorImageTrail({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<TrailCard[]>([]);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const cardIndexRef = useRef(0);
  const cardIdCounterRef = useRef(0);

  // Images pool from projects
  const projectItems = projects.filter((p) => p.image);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    // Disabled on touch or reduced motion
    if (prefersReducedMotion || !isFinePointer) return;

    const handleMouseEnter = () => {
      // Read container rect ONCE on mouseenter (never in mousemove)
      cachedRectRef.current = el.getBoundingClientRect();
      lastPosRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cachedRectRef.current;
      if (!rect) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!lastPosRef.current) {
        lastPosRef.current = { x: clientX, y: clientY };
        return;
      }

      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn every 50px of cursor travel
      if (dist >= 50) {
        lastPosRef.current = { x: clientX, y: clientY };

        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        const project = projectItems[cardIndexRef.current % projectItems.length];
        cardIndexRef.current++;
        const cardId = ++cardIdCounterRef.current;

        const newCard: TrailCard = {
          id: cardId,
          x: relX,
          y: relY,
          image: asset(project.image),
          title: project.title,
        };

        setCards((prev) => {
          // Cap strictly at 12 live items
          const next = prev.length >= 12 ? prev.slice(prev.length - 11) : prev;
          return [...next, newCard];
        });

        // Automatically clean up after 1s
        setTimeout(() => {
          setCards((prev) => prev.filter((c) => c.id !== cardId));
        }, 1000);
      }
    };

    const handleMouseLeave = () => {
      cachedRectRef.current = null;
      lastPosRef.current = null;
    };

    el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [projectItems]);

  return (
    <div ref={containerRef} className={`relative overflow-visible ${className}`}>
      {children}

      {/* Ephemeral Cursor Trail Preview Cards */}
      <div className="cursor-trail-layer pointer-events-none absolute inset-0 z-30" aria-hidden="true">
        {cards.map((card) => (
          <div
            key={card.id}
            className="cursor-trail-card"
            style={{
              left: `${card.x}px`,
              top: `${card.y}px`,
            }}
          >
            <div className="cursor-trail-card-inner">
              <img
                src={card.image}
                alt=""
                className="w-full h-full object-cover rounded-xl"
                loading="eager"
              />
              <div className="cursor-trail-badge">
                <span>{card.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
