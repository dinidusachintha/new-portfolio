import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import FlyingHeading from "./FlyingHeading";
import SynapticShift from "./animations/SynapticShift";

export default function VideoBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(container);

    const onVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const shouldPause = isPaused || !isInView || !isTabVisible;

  return (
    <section className="video-banner-section video-banner-light-bg w-full" aria-label="Systems architecture showcase">
      <div className="container">
        <div
          ref={containerRef}
          className="video-banner-card relative overflow-hidden"
          data-paused={shouldPause}
        >
          {/* Layer 0: Synaptic Shift - Glowing neural tendrils that pulse and shift */}
          <SynapticShift isPaused={shouldPause} />

          {/* Layer 1: Ambient Readability Overlay */}
          <div className="video-banner-overlay" aria-hidden="true" />

          {/* Layer 2: Center Content */}
          <div className="video-banner-content pointer-events-none relative z-10">
            <FlyingHeading
              line1="BUILDING SYSTEMS."
              line2="CRAFTING WHAT MATTERS."
              line2ClassName="video-title-gradient font-unbounded block"
              className="video-title font-unbounded pointer-events-auto"
            />

            <p className="video-lead pointer-events-auto">
              High-throughput event pipelines, resilient relational models, and responsive web platforms engineered to endure real-world production load.
            </p>

            <div className="video-actions pointer-events-auto">
              <a href="#contact" className="video-btn-primary">
                <span>Let’s Build Together</span>
                <ArrowUpRight size={17} />
              </a>

              <a href="#work" className="video-btn-secondary">
                <span>Explore Architecture</span>
              </a>
            </div>
          </div>

          {/* Layer 2: Bottom Controls & Telemetry */}
          <div className="video-banner-bottom relative z-10">
            <div className="video-controls pointer-events-auto">
              <button
                type="button"
                className={`video-ctrl-btn ${isPaused ? "is-active" : ""}`}
                onClick={togglePause}
                aria-pressed={isPaused}
                aria-label={isPaused ? "Resume star globe animation" : "Pause star globe animation"}
                title={isPaused ? "Resume star globe animation" : "Pause star globe animation"}
              >
                {isPaused ? <Play size={17} /> : <Pause size={17} />}
                <span className="hidden sm:inline">
                  {isPaused ? "Play" : "Pause"}
                </span>
              </button>
            </div>

            <div className="video-bottom-stats pointer-events-auto">
              <span className="stat-pill">
                <span className="dot-green" /> REGION: AP-SOUTH-1
              </span>
              <span className="stat-pill hidden md:inline-flex">
                LATENCY: 24ms
              </span>
              <span className="stat-pill hidden lg:inline-flex">
                UPTIME: 99.98%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
