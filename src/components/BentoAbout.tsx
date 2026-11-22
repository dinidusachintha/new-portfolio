import { useEffect, useRef } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { bentoAboutData } from "../data/portfolio";
import Odometer from "./animations/Odometer";
import LetterWave from "./animations/LetterWave";

interface StatItemProps {
  label: string;
  value: string;
  ariaLabel: string;
}

function StatTile({ label, value, ariaLabel }: StatItemProps) {
  return (
    <div className="bento-tile bento-tile-stat">
      <dd
        className="bento-stat-num font-mono font-black"
        aria-label={ariaLabel}
      >
        <Odometer
          value={value}
          label={ariaLabel}
          digitClassName="text-white"
          suffixClassName="text-[#9867ff] font-sans font-bold"
        />
      </dd>
      <dt className="bento-stat-label text-xs sm:text-sm text-gray-400 mt-2 font-mono">
        {label}
      </dt>
    </div>
  );
}

export default function BentoAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingLineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tiles = section.querySelectorAll<HTMLElement>(".bento-tile");

    if (prefersReducedMotion) {
      tiles.forEach((tile) => {
        tile.classList.add("is-visible");
      });
      if (headingLineRef.current) {
        headingLineRef.current.classList.add("is-visible");
      }
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (headingLineRef.current) {
              headingLineRef.current.classList.add("is-visible");
            }

            tiles.forEach((tile, idx) => {
              setTimeout(() => {
                tile.classList.add("is-visible");
              }, idx * 60);
            });

            io.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bento-about-section container"
      aria-labelledby="bento-about-title"
    >
      {/* Section Eyebrow & LetterWave Heading */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#9867ff]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#9867ff]">
            01 // ARCHITECT & SYSTEMS OVERVIEW
          </span>
        </div>

        <h2
          id="bento-about-title"
          className="bento-heading font-unbounded text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
        >
          <LetterWave text="Engineered with precision." as="span" />
        </h2>
      </div>

      {/* 4 columns x 3 rows Bento Grid */}
      <div className="bento-grid">
        {/* Large Tile (2x2): Violet-tinted bio card */}
        <div className="bento-tile bento-tile-bio">
          <div className="bento-glow-corner" aria-hidden="true" />
          <span className="bento-tag font-mono text-xs text-[#9867ff] font-semibold uppercase tracking-wider mb-3 inline-block">
            About
          </span>
          <h3 className="font-unbounded text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-1">
            {bentoAboutData.name}
          </h3>
          <p className="font-mono text-xs sm:text-sm text-[#c084fc] mb-4 font-semibold tracking-wide">
            {bentoAboutData.role}
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {bentoAboutData.bio}
          </p>
        </div>

        {/* 3 Stats Tiles with Odometer (<dl> list for strict accessibility) */}
        <dl className="bento-stats-group contents">
          {bentoAboutData.stats.map((st) => (
            <StatTile
              key={st.label}
              label={st.label}
              value={st.value}
              ariaLabel={st.ariaLabel}
            />
          ))}
        </dl>

        {/* Availability Tile */}
        <div className="bento-tile bento-tile-availability">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="bento-pulse-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-mono text-xs sm:text-sm text-emerald-400 font-semibold tracking-wide">
              {bentoAboutData.availability}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-2 font-mono">
            Full-time & high-impact contracts
          </p>
        </div>

        {/* Stack Tile: Small mono chips */}
        <div className="bento-tile bento-tile-stack">
          <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider block mb-2.5">
            Core Arsenal
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {bentoAboutData.stackChips.map((chip) => (
              <span key={chip} className="bento-stack-chip font-mono text-[11px] sm:text-xs">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Location Tile */}
        <div className="bento-tile bento-tile-location">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin size={16} className="text-[#9867ff] shrink-0" />
            <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
              {bentoAboutData.location}
            </span>
          </div>
          <span className="text-gray-500 text-xs font-mono mt-1 block">
            UTC +05:30 (Global Remote)
          </span>
        </div>
      </div>
    </section>
  );
}
