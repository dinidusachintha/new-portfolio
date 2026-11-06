import { Compass, Sparkles } from "lucide-react";

interface LeisureIntroProps {
  className?: string;
}

export default function LeisureIntro({ className = "" }: LeisureIntroProps) {
  return (
    <div className={`leisure-intro-container container relative z-10 py-16 sm:py-24 lg:py-28 ${className}`}>
      {/* Editorial Category Pill */}
      <div className="leisure-intro-badge-row flex items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 font-mono text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
          <Compass size={13} className="text-violet-400 animate-pulse" />
          <span>LIFE OUTSIDE WORK / 001</span>
        </div>
        <span className="font-mono text-xs text-gray-500 hidden sm:inline-block tracking-wider">
          EDITORIAL ARCHIVE · 5 DISCIPLINES
        </span>
      </div>

      {/* Masked Headline Row */}
      <div className="leisure-intro-title-wrap overflow-hidden mb-6">
        <h2 className="leisure-intro-headline font-unbounded font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.98]">
          <span className="block transform transition-transform duration-700">
            BEYOND THE CODE<span className="text-violet-400">.</span>
          </span>
        </h2>
      </div>

      {/* Subtitle & Editorial Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-2 border-t border-white/10">
        <p className="md:col-span-7 font-sans text-lg sm:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed">
          A little glimpse into what keeps me inspired when I&apos;m away from the screen.
        </p>

        <div className="md:col-span-5 md:text-right font-mono text-xs text-gray-400 space-y-1">
          <div className="flex items-center md:justify-end gap-2 text-violet-300">
            <Sparkles size={12} />
            <span className="uppercase tracking-widest">SCROLL TO EXPLORE ARCHIVE</span>
          </div>
          <p className="text-gray-500 text-[11px]">
            Cinematic scroll experience · 5 curated chapters
          </p>
        </div>
      </div>
    </div>
  );
}
