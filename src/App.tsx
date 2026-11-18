import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronUp,
  Mail,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { asset, profile } from "./data/portfolio";
import type { Project } from "./data/portfolio";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ExperienceTimeline from "./components/ExperienceTimeline";
import TechStack from "./components/TechStack";
import VideoBanner from "./components/VideoBanner";
import LeisureSection from "./components/LeisureSection";
import FlyingHeading from "./components/FlyingHeading";
import MobileSidebar from "./components/MobileSidebar";
import Navbar from "./components/Navbar";
import TechnologyMarquee from "./components/TechnologyMarquee";
import IntroLoader from "./components/animations/IntroLoader";
import { useIntroSession } from "./hooks/useIntroSession";

const InteractiveTerminal = lazy(() => import("./components/InteractiveTerminal"));
const ProjectDialog = lazy(() => import("./components/ProjectDialog"));
const BlogPage = lazy(() => import("./components/BlogPage"));
const ProjectGrid = lazy(() => import("./components/ProjectGrid"));

const navLinks = [
  { name: "About", id: "about" },
  { name: "Experience", id: "experience" },
  { name: "Systems", id: "work" },
  { name: "Terminal", id: "terminal" },
  { name: "Arsenal", id: "stack" },
  { name: "Beyond Code", id: "leisure" },
  { name: "Contact", id: "contact" },
];

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
          className="p-6 sm:p-10 lg:p-12 rounded-[2rem] sm:rounded-[2.5rem] bg-[#090b14] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center shadow-2xl"
        >
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <div className="skeleton h-5 w-24 rounded-full" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
            <div className="skeleton h-8 sm:h-10 w-3/4 rounded-xl" />
            <div className="skeleton h-14 sm:h-16 w-full rounded-lg" />
            {/* Metrics Skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
            </div>
            {/* Tech Badges Skeleton */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-14 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>
            {/* Buttons Row Skeleton */}
            <div className="flex gap-3 pt-2">
              <div className="skeleton h-10 w-36 rounded-full" />
              <div className="skeleton h-10 w-36 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-6 w-full aspect-[4/3] rounded-2xl sm:rounded-3xl bg-black/40 border border-white/5 p-4 flex items-center justify-center">
            <div className="skeleton w-full h-full rounded-xl sm:rounded-2xl" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading system architecture previews...</span>
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
      <span className="font-mono text-xs uppercase tracking-widest text-violet-400 mb-4 inline-flex items-center gap-2">
        <Sparkles size={13} className="text-violet-400" />
        <span>07 // INITIATE COLLABORATION</span>
      </span>

      <FlyingHeading
        line1="HAVE A SYSTEM TO BUILD OR ARCHITECT?"
        line2="LET'S BUILD IT."
        line2ClassName="have-a-system-outline font-unbounded block mt-2"
        className="have-a-system-title font-unbounded font-black text-white tracking-tight leading-[1.02] mb-6"
      />

      <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-7">
        I am currently open for new projects. You bring the idea, and I will handle the code, the architecture, and all the fine details to make sure it runs flawlessly.
      </p>

      {/* Action Buttons matching Image 3 */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        <a
          href={`mailto:${profile.email}?subject=Project%20Architecture%20Inquiry`}
          className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/25 cursor-pointer whitespace-nowrap"
        >
          <span>start a project</span>
          <Mail size={15} className="sm:w-4 sm:h-4" />
        </a>

        {profile.cv && (
          <a
            href={asset(profile.cv)}
            download
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs sm:text-sm border border-white/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>download cv</span>
            <ArrowUpRight size={14} className="sm:w-[15px] sm:h-[15px]" />
          </a>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-full bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white font-mono text-[11px] sm:text-xs border border-white/10 transition-all cursor-pointer max-w-full truncate"
          title="Click to copy email address"
        >
          <span className="truncate">{copied ? "Email Copied!" : profile.email}</span>
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
  const { shouldPlayIntro, markIntroSeen } = useIntroSession();
  const [introActive, setIntroActive] = useState(shouldPlayIntro);
  const [loaded, setLoaded] = useState(!shouldPlayIntro);
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

  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
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

  const scrollToSection = (targetSection?: string) => {
    if (!targetSection) {
      if (lenis.current) {
        lenis.current.scrollTo(0, { duration: 0.9 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const el = document.getElementById(targetSection);
    if (!el) return;

    const offset = window.innerWidth < 768 ? 68 : 84;
    if (lenis.current) {
      lenis.current.scrollTo(el, { offset: -offset, duration: 1.0 });
    } else {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const navigateTo = (page: "home" | "blog", targetSection?: string) => {
    setMenuOpen(false);

    if (page === "blog") {
      setCurrentPage("blog");
      window.location.hash = "#/blog";
      if (lenis.current) {
        lenis.current.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Navigating to Home
    if (currentPage !== "home") {
      setCurrentPage("home");
      window.location.hash = targetSection ? `#${targetSection}` : "#/";
      // Wait for Home DOM elements to mount before scrolling
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToSection(targetSection);
        }, 120);
      });
      return;
    }

    // Already on Home
    if (targetSection) {
      window.location.hash = `#${targetSection}`;
      scrollToSection(targetSection);
    } else {
      window.location.hash = "#/";
      scrollToSection();
    }
  };

  // Direct show hero section: lock scroll to top on visit/revisit and prevent browser auto-scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Direct show hero section at the top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Clear section anchor hashes on entry/revisit so browser never scrolls down away from hero section
    if (window.location.hash && !window.location.hash.startsWith("#/blog")) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const handleBeforeUnload = () => {
      // Reset scroll position on leave so reopening direct shows hero section
      window.scrollTo(0, 0);
    };

    const handlePageShow = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      lenis.current?.scrollTo(0, { immediate: true });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleIntroComplete = () => {
    markIntroSeen();
    setIntroActive(false);
    setLoaded(true);
    lenis.current?.start();
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);
  };

  // Lock scrolling during intro reveal animation
  useEffect(() => {
    if (introActive) {
      lenis.current?.stop();
      document.documentElement.classList.add("intro-active");
    } else {
      lenis.current?.start();
      document.documentElement.classList.remove("intro-active");
    }
  }, [introActive]);

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
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis.current;

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
      ScrollTrigger.update();
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

    // Deterministic, flicker-free active section scroll spy for primary nav links
    const navSectionIds = navLinks.map((l) => l.id);
    const updateActiveNavSection = () => {
      if (currentPage !== "home") {
        setActiveSection("");
        return;
      }
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollY >= documentHeight - 90) {
        setActiveSection("contact");
        return;
      }

      if (scrollY < 180) {
        setActiveSection("");
        return;
      }

      const headerOffset = 130;
      let matched = "";
      for (const id of navSectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop - headerOffset;
        const height = el.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          matched = id;
          break;
        }
      }

      if (matched) {
        setActiveSection(matched);
      }
    };

    window.addEventListener("scroll", updateActiveNavSection, { passive: true });
    updateActiveNavSection();

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
      window.removeEventListener("scroll", updateActiveNavSection);
      workObserver.disconnect();
    };
  }, [workReady, currentPage]);

  useEffect(() => {
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

      {/* Recreated High-Performance Navbar */}
      <Navbar
        scrolled={scrolled}
        navLinks={navLinks}
        activeSection={activeSection}
        currentPage={currentPage}
        onNavigate={navigateTo}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        mobileMenuTriggerRef={mobileMenuTriggerRef}
      />

      {/* Premium Mobile Slide-In Sidebar Navigation */}
      <MobileSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={navLinks}
        activeSection={activeSection}
        currentPage={currentPage}
        onNavigate={navigateTo}
        triggerRef={mobileMenuTriggerRef}
      />

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

            {/* Futuristic 3D Infinite Technology Marquee */}
            <TechnologyMarquee />

            {/* 01 / About Section */}
            <AboutSection />

            {/* 02 / Experience Section */}
            <ExperienceTimeline />

            {/* 03 / Projects Section */}
            <section className="project-section-light" id="work" ref={work}>
              <div className="container">
                <div className="section-top reveal">
                  <span className="eyebrow inline-flex items-center gap-1.5">
                    <Sparkles size={13} className="text-violet-600" />
                    03 / PRODUCTION SYSTEMS & CASE STUDIES
                  </span>
                  <span className="small-index">END-TO-END ARCHITECTURAL WORK</span>
                </div>
                <div className="section-heading-row reveal">
                  <FlyingHeading
                    line1="Engineered systems."
                    line2="Measurable production impact."
                    line2ClassName="text-muted"
                    className="font-unbounded"
                  />
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

            {/* Beyond the Code — Premium Floating 3D Leisure Cards */}
            <LeisureSection />

            {/* 07 // Initiate Collaboration Section */}
            <section className="section container contact-section" id="contact">
              <HaveASystemSection />
            </section>
          </>
        )}
      </main>

      {/* Simple Footer matching Image 3 with reduced compact spacing */}
      <footer className="footer-simple container border-t border-white/10 pt-4 pb-20 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 font-mono text-xs text-gray-400">
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
