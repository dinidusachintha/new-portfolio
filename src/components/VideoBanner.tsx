import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { asset, profile } from "../data/portfolio";
import FlyingHeading from "./FlyingHeading";

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Lazy-play video only when near viewport to optimize initial page bandwidth
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { rootMargin: "250px" }
    );
    io.observe(container);

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      io.disconnect();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasInteracted(true);
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasInteracted(true);
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.paused) {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen not supported or allowed
    }
  };

  return (
    <section className="video-banner-section video-banner-light-bg w-full" aria-label="Cinematic video showcase">
      <div className="container">
        <div
          ref={containerRef}
          className={`video-banner-card ${isFullscreen ? "is-fullscreen" : ""}`}
        >
        {/* Background Video */}
        <video
          ref={videoRef}
          className="video-banner-media"
          src={asset(profile.video)}
          loop
          muted={isMuted}
          playsInline
          autoPlay
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Ambient Dark Tech Gradients & Scanlines */}
        <div className="video-banner-overlay" aria-hidden="true" />
        <div className="video-banner-grid" aria-hidden="true" />


        {/* Center Content */}
        <div className="video-banner-content">
          <div className="video-eyebrow">
            <Sparkles size={14} className="text-violet-400" />
            <span>06 / SOFTWARE ARCHITECTURE IN ACTION</span>
          </div>

          <FlyingHeading
            line1="BUILDING SYSTEMS."
            line2="CRAFTING WHAT MATTERS."
            line2ClassName="video-title-gradient font-unbounded block"
            className="video-title font-unbounded"
          />

          <p className="video-lead">
            High-throughput event pipelines, resilient relational models, and responsive web platforms engineered to endure real-world production load.
          </p>

          <div className="video-actions">
            <a href="#contact" className="video-btn-primary">
              <span>Let’s Build Together</span>
              <ArrowUpRight size={17} />
            </a>

            <a href="#work" className="video-btn-secondary">
              <span>Explore Architecture</span>
            </a>
          </div>
        </div>

        {/* Bottom Controls & Telemetry */}
        <div className="video-banner-bottom">
          <div className="video-controls">
            <button
              type="button"
              className="video-ctrl-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              title={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}
              <span className="hidden sm:inline">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>

            <button
              type="button"
              className={`video-ctrl-btn ${!isMuted ? "is-active" : ""}`}
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
              title={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              <span className="hidden sm:inline">
                {isMuted ? "Sound Off" : "Sound On"}
              </span>
            </button>

            <button
              type="button"
              className="video-ctrl-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
          </div>

          <div className="video-bottom-stats">
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

        {!hasInteracted && isMuted && (
          <div className="video-hint-pill hidden sm:flex">
            <Volume2 size={13} />
            <span>Click controls to toggle sound</span>
          </div>
        )}
      </div>
    </div>
  </section>
);
}
