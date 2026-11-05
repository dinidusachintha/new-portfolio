import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronUp,
  Code2,
  Mail,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import { asset, profile } from "./data/portfolio";
import type { Project } from "./data/portfolio";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ExperienceTimeline from "./components/ExperienceTimeline";
import TechStack from "./components/TechStack";
import VideoBanner from "./components/VideoBanner";

const InteractiveTerminal = lazy(() => import("./components/InteractiveTerminal"));
const ProjectDialog = lazy(() => import("./components/ProjectDialog"));
const BlogPage = lazy(() => import("./components/BlogPage"));
const ProjectGrid = lazy(() => import("./components/ProjectGrid"));

function FloralLotusOrnament({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={`floral-lotus-svg ${className}`}
      aria-hidden="true"
    >
      <path
        d="M16 2C18.4 8.5 20.5 11.6 26 14C20.5 16.4 18.4 19.5 16 26C13.6 19.5 11.5 16.4 6 14C11.5 11.6 13.6 8.5 16 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6C19.5 10.2 21.8 12.5 26 16C21.8 19.5 19.5 21.8 16 26C12.5 21.8 10.2 19.5 6 16C10.2 12.5 12.5 10.2 16 6Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeOpacity="0.55"
        transform="rotate(45 16 16)"
      />
      <circle cx="16" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

const navLinks = [
  { name: "About", id: "about" },
  { name: "Experience", id: "experience" },
  { name: "Systems", id: "work" },
  { name: "Terminal", id: "terminal" },
  { name: "Arsenal", id: "stack" },
  { name: "Contact", id: "contact" },
];

const techTickerSequence = [
  { text: "TYPE SAFETY", symbol: "✿", type: "flower" },
  { text: "ZERO DOWNTIME DEPLOYS", symbol: "✦", type: "star" },
  { text: "DISTRIBUTED SYSTEMS", symbol: "✿", type: "flower" },
  { text: "AI VIDEO PIPELINES", symbol: "✦", type: "star" },
];

function LogoSharpFilter() {
  return (
    <svg className="sr-only" aria-hidden="true" width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
      <defs>
        <filter id="ds-logo-sharp" x="-10%" y="-10%" width="120%" height="120%">
          <feConvolveMatrix
            order="3"
            preserveAlpha="true"
            kernelMatrix="0 -0.5 0 -0.5 3.0 -0.5 0 -0.5 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`brand-mark-glass flex items-center justify-center relative p-1.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] ${className}`}
    >
      <LogoSharpFilter />
      <img
        src={asset("assets/images/ds-logo.png")}
        alt="DS Monogram"
        className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 hover:scale-105"
        style={{
          filter: "url(#ds-logo-sharp) contrast(1.25) brightness(1.06) drop-shadow(0 2px 5px rgba(0,0,0,0.45))",
          imageRendering: "-webkit-optimize-contrast",
        }}
        loading="eager"
      />
    </div>
  );
}

function CornerMusicButton() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audio.current;
    if (el) el.volume = 0.28;

    // Automatically pause whenever user leaves the site (tab switch, window minimization, navigation away)
    const handleLeaveSite = () => {
      if (audio.current && !audio.current.paused) {
        audio.current.pause();
        setPlaying(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLeaveSite();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleLeaveSite);
    window.addEventListener("beforeunload", handleLeaveSite);
    window.addEventListener("blur", handleLeaveSite);

    // Automatic playback handler on site entry
    const attemptAutoPlay = async () => {
      if (!audio.current) return;
      try {
        await audio.current.play();
        setPlaying(true);
      } catch {
        // Modern browsers enforce autoplay policy:
        // Automatically start music upon first interaction anywhere on page
        const onFirstInteraction = async () => {
          if (!audio.current) return;
          try {
            await audio.current.play();
            setPlaying(true);
          } catch {
            // Silently handled
          }
          cleanup();
        };

        const cleanup = () => {
          window.removeEventListener("pointerdown", onFirstInteraction);
          window.removeEventListener("click", onFirstInteraction);
          window.removeEventListener("touchstart", onFirstInteraction);
          window.removeEventListener("scroll", onFirstInteraction);
          window.removeEventListener("keydown", onFirstInteraction);
        };

        window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
        window.addEventListener("click", onFirstInteraction, { once: true, passive: true });
        window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
        window.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });
        window.addEventListener("keydown", onFirstInteraction, { once: true, passive: true });
      }
    };

    attemptAutoPlay();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleLeaveSite);
      window.removeEventListener("beforeunload", handleLeaveSite);
      window.removeEventListener("blur", handleLeaveSite);
    };
  }, []);

  const toggle = async () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      try {
        await audio.current.play();
        setPlaying(true);
      } catch {
        // Autoplay policy fallback
      }
    }
  };

  return (
    <div className="corner-music-pill-wrap">
      <audio
        ref={audio}
        src={asset(profile.music)}
        loop
        autoPlay
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />
      <button
        type="button"
        className={`corner-music-pill ${!playing ? "is-paused" : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Pause background music" : "Play background music"}
      >
        <span className="corner-music-icon-wrap" aria-hidden="true">
          {playing ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" className="ml-0.5" />
          )}
        </span>

        {/* Animated sound equalizer bars */}
        <span
          className={`sound-equalizer-bars ${playing ? "is-active" : ""}`}
          aria-hidden="true"
        >
          <span className="eq-bar" />
          <span className="eq-bar" />
          <span className="eq-bar" />
        </span>

        <span className="corner-music-label">
          <span className="corner-music-status-dot" aria-hidden="true" />
          <span>{playing ? "Pause Music" : "Play Music"}</span>
        </span>
      </button>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div
      className="space-y-10 my-10"
      aria-label="Loading system architecture previews"
      role="status"
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className="p-8 sm:p-12 rounded-[2.5rem] bg-[#0a0c14] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl"
        >
          <div className="lg:col-span-6 space-y-5">
            <div className="skeleton h-6 w-28 rounded-full" />
            <div className="skeleton h-12 w-3/4 rounded-xl" />
            <div className="skeleton h-16 w-full rounded-lg" />
            <div className="flex gap-2 pt-2">
              <div className="skeleton h-7 w-20 rounded-lg" />
              <div className="skeleton h-7 w-24 rounded-lg" />
              <div className="skeleton h-7 w-20 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HaveASystemSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="have-a-system-box pt-4 pb-0 sm:pt-6 sm:pb-0 relative overflow-hidden">
      <div className="floral-ambient-watermark" aria-hidden="true">
        <FloralLotusOrnament className="w-64 h-64 text-violet-400/10" />
      </div>

      <span className="font-mono text-xs uppercase tracking-widest text-violet-400 mb-4 inline-flex items-center gap-2">
        <FloralLotusOrnament className="w-3.5 h-3.5 text-violet-400" />
        <span>07 // INITIATE COLLABORATION</span>
      </span>

      <h2 className="have-a-system-title font-unbounded font-black text-white tracking-tight leading-[1.02] mb-6">
        HAVE A SYSTEM TO BUILD OR ARCHITECT?
        <br />
        <span className="have-a-system-outline font-unbounded block mt-2">
          LET&apos;S BUILD IT.
        </span>
      </h2>

      <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-7">
        I am currently open for new projects. You bring the idea, and I will handle the code, the architecture, and all the fine details to make sure it runs flawlessly.
      </p>

      {/* Action Buttons matching Image 3 */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <a
          href={`mailto:${profile.email}?subject=Project%20Architecture%20Inquiry`}
          className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          <span>start a project</span>
          <Mail size={16} />
        </a>

        {profile.cv && (
          <a
            href={asset(profile.cv)}
            download
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-sm border border-white/20 transition-all cursor-pointer"
          >
            <span>download cv</span>
            <ArrowUpRight size={15} />
          </a>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white font-mono text-xs border border-white/10 transition-all cursor-pointer"
          title="Click to copy email address"
        >
          <span>{copied ? "Email Copied!" : profile.email}</span>
        </button>
      </div>

      {/* Social Links Row matching Image 3 with compact vertical spacing */}
      <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-5 sm:pt-6 pb-2 border-t border-white/10 font-mono text-xs text-gray-400">
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>LINKEDIN</span>
            <ArrowUpRight size={13} />
          </a>
        )}
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>GITHUB</span>
            <ArrowUpRight size={13} />
          </a>
        )}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>INSTAGRAM</span>
          <ArrowUpRight size={13} />
        </a>
        {profile.phone && (
          <a
            href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>WHATSAPP</span>
            <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<"demo" | "arch">("demo");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [workReady, setWorkReady] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleOpenProject = (proj: Project, tab: "demo" | "arch" = "demo") => {
    setSelectedTab(tab);
    setSelected(proj);
  };

  // Client Routing state: 'home' or 'blog'
  const [currentPage, setCurrentPage] = useState<"home" | "blog">(() => {
    return typeof window !== "undefined" && window.location.hash.startsWith("#/blog")
      ? "blog"
      : "home";
  });

  const menu = useRef<HTMLDialogElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const work = useRef<HTMLElement>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith("#/blog")) {
        setCurrentPage("blog");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentPage("home");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigateTo = (page: "home" | "blog", targetSection?: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
    if (page === "blog") {
      window.location.hash = "#/blog";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (targetSection) {
        window.location.hash = `#${targetSection}`;
        setTimeout(() => {
          const el = document.getElementById(targetSection);
          if (el) {
            lenis.current?.scrollTo(el, { offset: -86 });
          }
        }, 60);
      } else {
        window.location.hash = "#/";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [siteReady, setSiteReady] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 24) + 22;
      if (current >= 100) {
        current = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setSiteReady(true);
          setLoaded(true);
        }, 140);
      } else {
        setLoadingProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onMouseMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
        frame = 0;
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    lenis.current = new Lenis({
      autoRaf: true,
      anchors: { offset: -86 },
      duration: 1.15,
      smoothWheel: true,
    });

    let frame = 0;
    const updateScrollMetrics = () => {
      const scrollY = lenis.current?.scroll ?? window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollPercent(Math.round(progress * 100));
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(progress),
      );
      document.documentElement.style.setProperty(
        "--scroll-y",
        `${scrollY}px`,
      );
      document.documentElement.style.setProperty(
        "--hero-drift",
        `${Math.min(scrollY * 0.12, 120)}px`,
      );
      document.documentElement.style.setProperty(
        "--hero-fade",
        String(Math.max(0, 1 - scrollY / 550)),
      );
      setScrolled(scrollY > 40);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        updateScrollMetrics();
        frame = 0;
      });
    };

    lenis.current.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollMetrics();

    return () => {
      lenis.current?.destroy();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [currentPage]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        }),
      { threshold: 0.01, rootMargin: "0px 0px -15px 0px" },
    );

    const observeAll = () => {
      const elements = document.querySelectorAll(
        ".reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-card, .process-step, .service, .stack-item, .pillar-card, .principle-card, .ai-pillar-card, .blog-card",
      );
      elements.forEach((el) => {
        if (!el.classList.contains("visible")) {
          revealObserver.observe(el);
        }
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    const mainEl = document.getElementById("main") || document.body;
    mutationObserver.observe(mainEl, { childList: true, subtree: true });

    const sectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }),
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => sectionObserver.observe(el));

    const workObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setWorkReady(true);
          workObserver.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    if (work.current) workObserver.observe(work.current);

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      sectionObserver.disconnect();
      workObserver.disconnect();
    };
  }, [workReady, currentPage]);

  useEffect(() => {
    if (menuOpen) menu.current?.showModal();
    else menu.current?.close();

    if (menuOpen || selected) {
      lenis.current?.stop();
      document.documentElement.classList.add("dialog-open");
    } else {
      lenis.current?.start();
      document.documentElement.classList.remove("dialog-open");
    }

    return () => {
      document.documentElement.classList.remove("dialog-open");
    };
  }, [menuOpen, selected]);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className={`site-shell ${loaded ? "is-loaded" : ""}`}>
      {/* Luxury Cinematic Site Preloader with Subtle Floral Emblem */}
      <div
        className={`site-preloader ${siteReady ? "is-complete" : ""}`}
        aria-hidden={siteReady}
      >
        <div className="preloader-content text-center">
          <div className="preloader-floral-halo mb-4 flex items-center justify-center relative" aria-hidden="true">
            <div className="p-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.7)]">
              <img
                src={asset("assets/images/ds-logo.png")}
                alt="DS Emblem"
                className="w-14 h-14 object-contain animate-pulse"
                style={{
                  filter: "url(#ds-logo-sharp) contrast(1.25) brightness(1.06) drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
                  imageRendering: "-webkit-optimize-contrast",
                }}
              />
            </div>
          </div>
          <div className="preloader-brand flex items-center justify-center gap-2 mb-4">
            <span className="brand-dot-pulse" />
            <span className="font-unbounded font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
              Dinidu<span className="text-violet-400">.</span>
            </span>
          </div>
          <div className="preloader-bar-wrap mx-auto">
            <div
              className="preloader-bar-fill"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="preloader-meta font-mono text-[10.5px] text-gray-400 flex items-center justify-between w-full max-w-[260px] mx-auto mt-3">
            <span>INITIALIZING ARCHITECTURE</span>
            <span className="text-violet-400 font-bold">{loadingProgress}%</span>
          </div>
        </div>
      </div>

      <div className="ambient-spotlight" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      {/* Top Scroll Progress Indicator */}
      <div className="scroll-progress" aria-hidden="true" />

      {/* Header */}
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container flex items-center justify-between gap-5">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("home");
            }}
            className="brand flex items-center"
            aria-label="Dinidu Sachintha, back to home"
          >
            <BrandMark />
          </a>

          {/* Desktop Navigation */}
          <nav
            className="desktop-nav hidden items-center gap-6 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((l) => (
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("home", l.id);
                }}
                className={currentPage === "home" && activeSection === l.id ? "active" : ""}
                key={l.id}
                aria-current={activeSection === l.id ? "location" : undefined}
              >
                {l.name}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Clean Highlighted Blog Button without star icon */}
            <button
              type="button"
              onClick={() => navigateTo(currentPage === "blog" ? "home" : "blog")}
              className={`nav-blog-btn-animated ${currentPage === "blog" ? "is-active" : ""}`}
              aria-label="Read personal engineering blog"
              title="Explore Engineering Blog & Articles"
            >
              <span>{currentPage === "blog" ? "PORTFOLIO" : "BLOG"}</span>
              <span className="blog-new-pill">NEW</span>
            </button>

            <button
              className="circle-button mobile-menu-toggle"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <dialog
        id="mobile-nav"
        ref={menu}
        className="mobile-dialog"
        onCancel={() => setMenuOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
        aria-label="Navigation menu"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between">
          <span className="eyebrow flex items-center gap-1.5 text-gray-300">
            <Code2 size={13} className="text-white" />
            NAVIGATION
          </span>
          <button
            type="button"
            className="circle-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Clean Blog Button without star icon */}
        <div className="pt-2 pb-4">
          <button
            type="button"
            onClick={() => navigateTo(currentPage === "blog" ? "home" : "blog")}
            className="w-full nav-blog-btn-animated justify-center py-2.5 text-sm"
          >
            <span>{currentPage === "blog" ? "← RETURN TO PORTFOLIO" : "EXPLORE BLOG ARTICLES"}</span>
            <span className="blog-new-pill">NEW</span>
          </button>
        </div>

        <nav>
          {navLinks.map((l, i) => (
            <a
              href={`#${l.id}`}
              key={l.id}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", l.id);
              }}
            >
              <span>0{i + 1}</span>
              {l.name}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
          <div className="text-xs text-muted font-mono">
            {profile.education}
          </div>
          <p className="text-xs text-gray-400">
            Colombo, Sri Lanka · Open to high-impact opportunities
          </p>
        </div>
      </dialog>

      <main id="main">
        {currentPage === "blog" ? (
          /* Dedicated Blog Page Route */
          <Suspense fallback={<div className="container py-32"><ProjectSkeleton /></div>}>
            <BlogPage onBackToHome={() => navigateTo("home")} />
          </Suspense>
        ) : (
          /* Home Portfolio: EXACT SEQUENTIAL SECTION ORDER (01 -> 07) */
          <>
            {/* Hero Section */}
            <Hero />

            {/* Continuous Tech Ticker with Subtle Floral Accents */}
            <div className="marquee-section" aria-hidden="true">
              <div className="marquee-track">
                {[0, 1].map((groupIdx) => (
                  <div key={groupIdx} className="marquee-group">
                    {[0, 1, 2, 3].map((repIdx) =>
                      techTickerSequence.map((item, itemIdx) => (
                        <span key={`${groupIdx}-${repIdx}-${itemIdx}`} className="marquee-item">
                          <span className="marquee-text">{item.text}</span>
                          <span className={`marquee-symbol ${item.type === "flower" ? "symbol-flower" : "symbol-star"}`}>
                            {item.symbol}
                          </span>
                        </span>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 01 / About Section */}
            <AboutSection />

            {/* 02 / Experience Section */}
            <ExperienceTimeline />

            {/* 03 / Projects Section */}
            <section className="project-section-light" id="work" ref={work}>
              <div className="container">
                <div className="section-top reveal">
                  <span className="eyebrow inline-flex items-center gap-1.5">
                    <FloralLotusOrnament className="w-3.5 h-3.5 text-violet-600" />
                    03 / PRODUCTION SYSTEMS & CASE STUDIES
                  </span>
                  <span className="small-index">END-TO-END ARCHITECTURAL WORK</span>
                </div>
                <div className="section-heading-row reveal">
                  <h2 className="font-unbounded">
                    Engineered systems.
                    <br />
                    <span className="text-muted">Measurable production impact.</span>
                  </h2>
                  <p>
                    A selection of full stack platforms, distributed backend services, and
                    responsive applications built for performance.
                  </p>
                </div>

                {workReady ? (
                  <Suspense fallback={<ProjectSkeleton />}>
                    <ProjectGrid onSelect={handleOpenProject} />
                  </Suspense>
                ) : (
                  <ProjectSkeleton />
                )}

                <div className="work-end reveal">
                  <span>NEED A CUSTOM ARCHITECTURE OR SYSTEM?</span>
                  <a
                    href="#contact"
                    className="text-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("home", "contact");
                    }}
                  >
                    Let’s build something together <ArrowUpRight size={19} />
                  </a>
                </div>
              </div>
            </section>

            {/* 04 / Interactive Developer Console */}
            <Suspense fallback={<div className="container py-16"><div className="skeleton h-96 w-full rounded-3xl" /></div>}>
              <InteractiveTerminal />
            </Suspense>

            {/* 05 / Engineering Arsenal & Tech Stack */}
            <TechStack />

            {/* 06 / Cinematic Video Showcase */}
            <VideoBanner />

            {/* 07 // Initiate Collaboration Section */}
            <section className="section container contact-section" id="contact">
              <HaveASystemSection />
            </section>
          </>
        )}
      </main>

      {/* Simple Footer matching Image 3 with reduced compact spacing */}
      <footer className="footer-simple container border-t border-white/10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} DINIDU SACHINTHA</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (lenis.current) {
              lenis.current.scrollTo(0, { duration: 1.1 });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <ArrowUp size={14} />
        </button>
      </footer>

      {/* Background Corner Music Play/Pause Toggle (Icon Only) matching Image 3 */}
      <CornerMusicButton />

      {/* Floating Scroll to Top Button */}
      <a
        href="#/"
        className={`floating-top circle-button ${scrolled ? "show" : ""}`}
        aria-label="Scroll back to top"
        onClick={(e) => {
          e.preventDefault();
          if (lenis.current) {
            lenis.current.scrollTo(0, { duration: 1.1 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <svg
          className="scroll-progress-ring"
          width="46"
          height="46"
          viewBox="0 0 46 46"
          aria-hidden="true"
        >
          <circle className="progress-ring-track" cx="23" cy="23" r="19" />
          <circle
            className="progress-ring-fill"
            cx="23"
            cy="23"
            r="19"
            style={{
              strokeDasharray: 119.38,
              strokeDashoffset: Math.max(
                0,
                119.38 - 119.38 * (scrollPercent / 100),
              ),
            }}
          />
        </svg>
        <ChevronUp size={19} />
      </a>

      {/* Case Study Dialog Modal */}
      {selected && (
        <Suspense fallback={null}>
          <ProjectDialog
            project={selected}
            initialTab={selectedTab}
            onClose={() => setSelected(null)}
            onSelectProject={handleOpenProject}
          />
        </Suspense>
      )}
    </div>
  );
}
