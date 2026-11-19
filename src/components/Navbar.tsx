import React from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { asset } from "../data/portfolio";

export interface NavLinkItem {
  name: string;
  id: string;
}

interface NavbarProps {
  scrolled: boolean;
  navLinks: NavLinkItem[];
  activeSection: string;
  currentPage: "home" | "blog";
  onNavigate: (page: "home" | "blog", targetSection?: string) => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  mobileMenuTriggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function Navbar({
  scrolled,
  navLinks,
  activeSection,
  currentPage,
  onNavigate,
  menuOpen,
  onToggleMenu,
  mobileMenuTriggerRef,
}: NavbarProps) {
  return (
    <header
      className={`header fixed inset-x-0 top-0 z-[75] transition-all duration-300 ${
        scrolled
          ? "bg-[#050508]/95 backdrop-blur-2xl py-3 border-b border-white/12 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(152,103,255,0.06)]"
          : "bg-[#08080c]/85 backdrop-blur-xl py-4 sm:py-5 border-b border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
      }`}
      role="banner"
    >
      <div className="container flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand / Logo Identification */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
          className="brand flex items-center gap-2.5 min-w-0 shrink-0 cursor-pointer group select-none"
          aria-label="Dinidu Sachintha, Back to home top"
        >
          {/* Glass Brand Monogram with Live Indicator */}
          <div className="relative p-1.5 sm:p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-md border border-white/20 hover:border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-105">
            <img
              src={asset("assets/images/ds-logo.png")}
              alt="DS Monogram"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              style={{
                filter: "contrast(1.2) brightness(1.06) drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                imageRendering: "-webkit-optimize-contrast",
              }}
              loading="eager"
            />
            {/* Live Status Pulse Dot */}
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#08080c] shadow-[0_0_8px_#10b981] animate-pulse"
              title="Available for high-impact software engineering roles"
            />
          </div>

          {/* Name & Title */}
          <div className="flex flex-col leading-none">
            <span className="font-unbounded font-black text-sm sm:text-base tracking-tight text-white whitespace-nowrap group-hover:text-violet-300 transition-colors">
              Dinidu<span className="text-violet-400">.</span>
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] text-gray-400 tracking-wider uppercase hidden min-[360px]:block mt-0.5">
              SYSTEMS ARCHITECT
            </span>
          </div>
        </a>

        {/* Desktop Centered Capsule Navigation Bar */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.5)]"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const isActive = currentPage === "home" && activeSection === link.id;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("home", link.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-white/[0.12] text-white font-semibold border border-white/20 shadow-[0_0_14px_rgba(152,103,255,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
                aria-current={isActive ? "location" : undefined}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#a855f7]" />
                )}
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Header Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Animated Blog / Portfolio Toggle Button */}
          <button
            type="button"
            onClick={() => onNavigate(currentPage === "blog" ? "home" : "blog")}
            className={`nav-blog-btn-animated shrink-0 cursor-pointer ${
              currentPage === "blog" ? "is-active" : ""
            }`}
            aria-label={currentPage === "blog" ? "Return to Portfolio" : "Read engineering blog"}
            title={currentPage === "blog" ? "Return to Portfolio" : "Explore Engineering Blog & Articles"}
          >
            <span>{currentPage === "blog" ? "PORTFOLIO" : "BLOG"}</span>
            <span className="blog-new-pill">NEW</span>
          </button>

          {/* Quick Contact CTA (Desktop only) */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("home", "contact");
            }}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-white font-mono text-xs font-semibold border border-white/15 hover:border-violet-400/50 shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <span>Let’s Talk</span>
            <ArrowUpRight
              size={13}
              className="text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>

          {/* Mobile Menu Toggle Button (Hamburger / Close) */}
          <button
            ref={mobileMenuTriggerRef}
            type="button"
            className="mobile-menu-toggle md:hidden cursor-pointer transition-all duration-200 active:scale-95 flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.05] border border-white/15 hover:bg-white/[0.1] hover:border-white/30 text-white shadow-sm"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-sidebar"
            onClick={onToggleMenu}
          >
            {menuOpen ? <X size={19} className="text-white" /> : <Menu size={19} className="text-white" />}
          </button>
        </div>
      </div>
    </header>
  );
}
