import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import { asset, profile } from "../data/portfolio";

export interface NavLinkItem {
  name: string;
  id: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
  activeSection: string;
  currentPage: "home" | "blog";
  onNavigate: (page: "home" | "blog", targetSection?: string) => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  navLinks,
  activeSection,
  currentPage,
  onNavigate,
  triggerRef,
}: MobileSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // 1. Prevent background scrolling while open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.classList.add("mobile-sidebar-open");

      // Auto focus close button for accessibility
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      return () => {
        const top = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.classList.remove("mobile-sidebar-open");
        if (top) {
          window.scrollTo(0, parseInt(top || "0", 10) * -1);
        }
        // Restore focus to trigger
        triggerRef?.current?.focus();
      };
    }
  }, [isOpen, triggerRef]);

  // 2. Keyboard accessibility: Escape key & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 3. Close automatically on desktop resize (>= 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  const handleLinkClick = (e: React.MouseEvent, targetId?: string) => {
    e.preventDefault();
    onClose();
    // Allow sidebar exit transition before scrolling
    setTimeout(() => {
      onNavigate("home", targetId);
    }, 150);
  };

  const handleBlogClick = () => {
    onClose();
    setTimeout(() => {
      onNavigate(currentPage === "blog" ? "home" : "blog");
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" aria-modal="true" role="dialog" aria-label="Mobile Navigation">
          {/* Dark Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in Sidebar Panel */}
          <motion.div
            ref={sidebarRef}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[340px] h-full h-[100dvh] bg-[#0B0914] border-l border-violet-500/25 shadow-[-16px_0_48px_rgba(0,0,0,0.92)] flex flex-col justify-between overflow-y-auto overscroll-contain z-10"
            style={{
              paddingTop: "max(1rem, env(safe-area-inset-top))",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 280,
            }}
          >
            {/* Ambient Purple Glow Flare Inside Sidebar */}
            <div
              className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-violet-600/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-10 left-0 w-44 h-44 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* TOP HEADER */}
            <div className="relative z-10 px-5 pt-3 pb-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Brand Logo Monogram */}
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/20 p-1 flex items-center justify-center shadow-inner">
                  <img
                    src={asset("assets/images/ds-logo.png")}
                    alt="DS Monogram"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-unbounded font-black text-sm tracking-tight text-white leading-none">
                    Dinidu<span className="text-violet-400">.</span>
                  </span>
                  <span className="font-mono text-[9px] text-gray-400 tracking-wider uppercase mt-0.5">
                    ARCHITECT
                  </span>
                </div>
              </div>

              {/* Navigation Tag & Close Button */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-[9px] font-mono font-bold text-violet-300 uppercase tracking-widest">
                  <Code2 size={10} />
                  NAV
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MIDDLE: NAVIGATION LINKS */}
            <div className="relative z-10 px-4 py-4 flex-1 space-y-4">
              {/* Blog Action Banner */}
              <div className="pb-1">
                <button
                  type="button"
                  onClick={handleBlogClick}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-violet-950/60 via-purple-900/30 to-black/70 border border-violet-500/40 hover:border-violet-400/80 active:scale-[0.99] transition-all flex items-center justify-between shadow-lg group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-violet-400 group-hover:rotate-12 transition-transform" />
                    <span className="font-unbounded font-bold text-xs text-white tracking-wide">
                      {currentPage === "blog" ? "RETURN TO PORTFOLIO" : "EXPLORE BLOG ARTICLES"}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-violet-600 text-[9.5px] font-mono font-bold text-white shadow-sm">
                    NEW
                  </span>
                </button>
              </div>

              {/* Main Section Nav Links */}
              <nav className="space-y-1" aria-label="Sidebar sections">
                {navLinks.map((link, idx) => {
                  const isActive = currentPage === "home" && activeSection === link.id;
                  const itemNumber = `0${idx + 1}`;

                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      className={`min-h-[46px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm transition-all duration-200 cursor-pointer group ${
                        isActive
                          ? "bg-violet-500/20 text-white font-bold border border-violet-400/40 shadow-[0_0_15px_rgba(152,103,255,0.2)]"
                          : "text-gray-300 hover:text-white hover:bg-white/[0.04] active:bg-white/[0.08]"
                      }`}
                      aria-current={isActive ? "location" : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-[10.5px] tracking-wider transition-colors ${
                            isActive ? "text-violet-300 font-bold" : "text-gray-500 group-hover:text-violet-400"
                          }`}
                        >
                          {itemNumber}
                        </span>
                        <span className="font-unbounded text-xs sm:text-[13px] tracking-wide">
                          {link.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_#a855f7]" />
                        )}
                        <ArrowUpRight
                          size={15}
                          className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                            isActive ? "text-violet-300" : "text-gray-500 group-hover:text-gray-300"
                          }`}
                        />
                      </div>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* BOTTOM FOOTER */}
            <div className="relative z-10 px-5 pt-3 border-t border-white/[0.08] space-y-3.5">
              {/* Quick Collaboration CTA */}
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "contact")}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] border border-white/10 flex items-center justify-between text-xs font-mono text-gray-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Mail size={13} className="text-violet-400" />
                  <span>Let’s build together</span>
                </span>
                <ArrowUpRight size={14} className="text-gray-400" />
              </a>

              {/* Social Media Links */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  CONNECT
                </span>
                <div className="flex items-center gap-2">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] active:scale-95 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="GitHub profile"
                      title="GitHub"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] active:scale-95 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="LinkedIn profile"
                      title="LinkedIn"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-2 text-[10.5px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Available for high-impact roles</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
