import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function GlobalStarfield() {
  // Deterministic seed for 36 twinkling stars to avoid hydration mismatch
  const stars = useMemo<Star[]>(() => {
    const list: Star[] = [];
    const colors = ["#ffffff", "#c084fc", "#9867ff", "#e0e7ff"];
    for (let i = 0; i < 36; i++) {
      const x = ((i * 37 + 13) % 97) + 1.5;
      const y = ((i * 43 + 23) % 96) + 2;
      const size = (i % 3 === 0) ? 2 : 1.2;
      const duration = 2.4 + (i % 5) * 0.7; // 2.4s to 5.2s
      const delay = (i % 7) * 0.6;
      const color = colors[i % colors.length];
      list.push({ id: i, x, y, size, duration, delay, color });
    }
    return list;
  }, []);

  return (
    <div className="global-starfield" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
