import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/portfolio";

export default function AvailabilityBadge() {
  const badgeWrapRef = useRef<HTMLAnchorElement>(null);
  const centerBtnRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  // Optional zero-reflow magnetic effect: reads bounding rect ONCE on mouseenter only
  const handleMouseEnter = () => {
    if (badgeWrapRef.current && window.innerWidth >= 768) {
      const r = badgeWrapRef.current.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!rectRef.current || !centerBtnRef.current) return;
    const x = e.clientX - (rectRef.current.left + rectRef.current.width / 2);
    const y = e.clientY - (rectRef.current.top + rectRef.current.height / 2);
    // Subtle magnetic pull (strength 0.35, clamped)
    const pullX = Math.max(-14, Math.min(14, x * 0.35));
    const pullY = Math.max(-14, Math.min(14, y * 0.35));
    centerBtnRef.current.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0) scale(1.15) rotate(45deg)`;
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (centerBtnRef.current) {
      centerBtnRef.current.style.transform = "";
    }
  };

  const emailHref = profile.email
    ? `mailto:${profile.email}?subject=Project%20Collaboration%20Inquiry`
    : "#contact";

  return (
    <div className="availability-badge-section flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-12 py-10 sm:py-14 border-b border-white/10">
      {/* Huge "Let's talk." Headline with Line-Mask Reveal */}
      <div className="availability-headline-wrap">
        <span className="font-mono text-xs uppercase tracking-widest text-[#9867ff] mb-3 block">
          ✦ DIRECT INITIATION
        </span>
        <h2 className="availability-headline font-unbounded font-black text-white tracking-tight leading-[0.98]">
          <span className="line-mask-wrap inline-block">
            <span className="line-mask-inner is-visible inline-block">
              Let's <span className="text-[#9867ff]">talk.</span>
            </span>
          </span>
        </h2>
      </div>

      {/* 120px Rotating SVG <textPath> Badge */}
      <div className="availability-badge-container shrink-0 self-start md:self-center">
        <a
          ref={badgeWrapRef}
          href={emailHref}
          className="availability-badge-link group relative inline-flex items-center justify-center w-[120px] h-[120px] cursor-pointer"
          aria-label="Email me, available for work"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Rotating Text Ring (14s linear, transform rotate only) */}
          <div className="availability-badge-rotator" aria-hidden="true">
            <svg
              viewBox="0 0 120 120"
              className="w-[120px] h-[120px] overflow-visible"
            >
              <defs>
                <path
                  id="badgeTextCircle"
                  d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  fill="none"
                />
              </defs>
              <text className="font-mono text-[9px] fill-[#c084fc] uppercase tracking-[0.22em] font-semibold">
                <textPath
                  href="#badgeTextCircle"
                  startOffset="0%"
                >
                  AVAILABLE FOR WORK • AVAILABLE FOR WORK •{" "}
                </textPath>
              </text>
            </svg>
          </div>

          {/* 48px Violet Center Circle with "↗" Arrow */}
          <div
            ref={centerBtnRef}
            className="availability-badge-center-btn absolute w-12 h-12 rounded-full bg-[#9867ff] text-white flex items-center justify-center shadow-lg shadow-[#9867ff]/40 transition-transform duration-300 pointer-events-none"
            aria-hidden="true"
          >
            <ArrowUpRight size={22} className="stroke-[2.5]" />
          </div>
        </a>
      </div>
    </div>
  );
}
