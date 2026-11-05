import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import { asset, blogPosts, companySpotlight } from "../data/portfolio";
import type { BlogPost, BlogSection } from "../data/portfolio";
import SmartImage from "./SmartImage";

type FilterTab = "All Sections" | BlogSection;

const SECTIONS_CONFIG: {
  key: BlogSection;
  number: string;
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
}[] = [
  {
    key: "Company Updates",
    number: "01",
    title: "Company Blog & Updates",
    subtitle: "AI Desk milestones, GovTech initiatives, and public sector digital transformations.",
    icon: Building2,
  },
  {
    key: "Articles",
    number: "02",
    title: "Articles Section",
    subtitle: "Deep-dive technical architectural logs, distributed systems, and generative media.",
    icon: FileText,
  },
  {
    key: "Career Blogs",
    number: "03",
    title: "Career & Engineering Growth",
    subtitle: "Navigating engineering leadership, founder mindsets, and developer culture.",
    icon: Briefcase,
  },
];

export default function BlogPage({
  onBackToHome,
}: {
  onBackToHome: () => void;
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All Sections");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visibleSections =
    activeTab === "All Sections"
      ? SECTIONS_CONFIG
      : SECTIONS_CONFIG.filter((s) => s.key === activeTab);

  return (
    <div className="blog-page-container container py-10 sm:py-14" id="blog-root">
      {/* Blog Top Navigation Bar */}
      <div className="blog-nav-bar flex items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            if (selectedPost) {
              setSelectedPost(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              onBackToHome();
            }
          }}
          className="blog-back-btn flex items-center gap-2 text-xs font-mono font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="text-violet-400" />
          <span>{selectedPost ? "← ALL SECTIONS" : "← RETURN TO PORTFOLIO"}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="blog-author-pill hidden sm:inline-flex items-center gap-2 font-mono text-xs text-gray-300 bg-white/[0.04] backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <img
              src={asset("assets/images/ds-logo.png")}
              alt="DS Logo"
              className="w-4 h-4 object-contain filter contrast-125 brightness-105"
            />
            <span className="text-white font-semibold">DINIDU SACHINTHA</span>
            <span className="text-violet-400">// ARCHITECTURE LOGS</span>
          </div>

          <button
            type="button"
            onClick={copyArticleLink}
            className="circle-button"
            title="Share or copy page link"
            aria-label="Share page"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
          </button>
        </div>
      </div>

      {selectedPost ? (
        /* Full Article Reader View */
        <article className="blog-reader-view max-w-3xl mx-auto reveal animate-in fade-in duration-300">
          <div className="blog-reader-meta flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <span className="blog-category-tag font-mono text-xs px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold">
              {selectedPost.category}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-gray-400">
              {selectedPost.section}
            </span>
            <span className="text-muted text-xs font-mono flex items-center gap-1">
              <Calendar size={12} /> {selectedPost.date}
            </span>
            <span className="text-muted text-xs font-mono flex items-center gap-1">
              <Clock size={12} /> {selectedPost.readTime}
            </span>
          </div>

          <h1 className="blog-reader-title font-unbounded text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            {selectedPost.title}
          </h1>

          {/* Author Callout with DS Monogram */}
          <div className="blog-reader-author flex items-center gap-3.5 pb-6 mb-8 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.5)]">
              <img
                src={asset("assets/images/ds-logo.png")}
                alt="DS Logo"
                className="w-full h-full object-contain filter contrast-125 brightness-105"
                style={{
                  filter: "contrast(1.22) brightness(1.06) drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                }}
              />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{selectedPost.author.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  <CheckCircle2 size={11} className="text-violet-400" /> VERIFIED
                </span>
              </div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">
                {selectedPost.author.role}
              </div>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="blog-reader-image-wrap rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl shadow-black/80">
            <SmartImage
              src={asset(selectedPost.image)}
              alt={selectedPost.title}
              eager
              className="w-full aspect-[16/9] object-cover"
            />
          </div>

          {/* Lead Summary Callout with Glowing Border */}
          <div className="blog-lead-box p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-black/60 border border-violet-700/50 mb-10 shadow-xl">
            <div className="flex items-center gap-2 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="text-violet-400" />
              <span>Executive Brief</span>
            </div>
            <p className="text-sm sm:text-base text-violet-100 font-medium leading-relaxed">
              {selectedPost.summary}
            </p>
          </div>

          {/* Article Content Sections */}
          <div className="blog-body space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            {selectedPost.content.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="font-unbounded text-lg sm:text-2xl font-bold text-white pt-2">
                  {sec.heading}
                </h2>

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-gray-300 leading-relaxed">
                    {p}
                  </p>
                ))}

                {sec.callout && (
                  <div className="p-4 sm:p-5 rounded-xl bg-violet-950/20 border-l-4 border-violet-400 my-5 text-sm sm:text-base text-violet-200">
                    <p className="font-mono text-xs sm:text-sm">{sec.callout}</p>
                  </div>
                )}

                {sec.codeSnippet && (
                  <div className="blog-code-snippet rounded-xl overflow-hidden bg-black/80 border border-white/10 my-5">
                    <div className="code-header flex items-center justify-between px-4 py-2.5 border-b border-white/10 text-xs font-mono text-gray-400 bg-white/[0.03]">
                      <span className="font-bold text-violet-300">{sec.codeSnippet.language.toUpperCase()}</span>
                      <span className="text-emerald-400">PRODUCTION VERIFIED</span>
                    </div>
                    <pre className="p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto leading-relaxed">
                      <code>{sec.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Tags Row */}
          <div className="blog-reader-tags flex flex-wrap gap-2 pt-8 mt-10 border-t border-white/10">
            {selectedPost.tags.map((tag) => (
              <span key={tag} className="tech-pill flex items-center gap-1.5 px-3 py-1 text-xs font-mono">
                <Tag size={12} className="text-violet-400" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setSelectedPost(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="button button-outline text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to all blog sections</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="button button-primary text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Portfolio</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </article>
      ) : (
        /* Multi-Section Blog Listing View */
        <div className="blog-listing-view">
          {/* Hero Header */}
          <div className="blog-hero mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-xs mb-3">
              <BookOpen size={13} className="text-violet-400" />
              <span>PUBLICATIONS & COMPANY CHRONICLES</span>
            </div>

            <h1 className="font-unbounded text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Engineering Insights & <span className="gradient-text">Company Updates.</span>
            </h1>

            <p className="text-muted text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
              Official updates from <strong className="text-white">AI Desk</strong>, technical distributed systems deep dives, and software engineering career playbooks written by Dinidu Sachintha.
            </p>

            {/* Section Tab Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">
                SECTIONS:
              </span>
              {(["All Sections", "Company Updates", "Articles", "Career Blogs"] as FilterTab[]).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`filter-btn text-xs font-mono px-4 py-2 rounded-xl transition-all ${
                      activeTab === tab
                        ? "is-active bg-violet-600 text-white shadow-lg shadow-violet-950/60 border border-violet-400/50"
                        : "bg-white/[0.04] text-gray-300 hover:text-white border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* AI DESK COMPANY PROJECT SPOTLIGHT (Shown when viewing All or Company Updates) */}
          {(activeTab === "All Sections" || activeTab === "Company Updates") && (
            <div className="company-spotlight-card relative rounded-3xl overflow-hidden mb-16 border border-violet-500/30 bg-gradient-to-b from-[#0e0c1f] via-[#090714] to-[#04030a] p-6 sm:p-10 shadow-2xl shadow-violet-950/30">
              {/* Subtle ambient corner glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Column: Recreated Highlighted Paragraph & Info */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                      <Building2 size={12} className="text-violet-400" />
                      <span>{companySpotlight.companyName.toUpperCase()} FLAGSHIP</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 animate-pulse">
                      <Award size={12} className="text-amber-400" />
                      <span>{companySpotlight.highlightMilestone.toUpperCase()}</span>
                    </span>
                  </div>

                  <h2 className="font-unbounded text-xl sm:text-3xl font-bold text-white leading-tight">
                    {companySpotlight.headline}
                  </h2>

                  {/* Founder & Web Developer Role Statement with DS Logo */}
                  <div className="founder-badge flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/20 w-fit shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                    <img
                      src={asset("assets/images/ds-logo.png")}
                      alt="DS Monogram"
                      className="w-7 h-7 object-contain"
                      style={{
                        filter: "contrast(1.22) brightness(1.06) drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                      }}
                    />
                    <div>
                      <span className="text-xs text-gray-400 font-mono block">FOUNDER & WEB DEVELOPER</span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        Dinidu Sachintha · <span className="text-violet-300">AI Desk</span>
                      </span>
                    </div>
                  </div>

                  {/* Nicely Re-created and Highlighted Paragraph */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-violet-500/30 text-gray-200 text-sm sm:text-base leading-relaxed space-y-3">
                    <p>
                      <strong className="text-white font-semibold">AI Desk</strong> is a technology company focused on building innovative software solutions that simplify business operations and accelerate digital transformation.
                    </p>
                    <p className="border-l-4 border-amber-400 pl-4 py-1 bg-amber-500/[0.05] rounded-r-lg">
                      One of our key milestones is the development of the{" "}
                      <strong className="text-white font-bold underline decoration-amber-400 decoration-2 underline-offset-4">
                        Vikasha CBO E-Billing System
                      </strong>
                      , a government digitalisation initiative under Sri Lanka’s{" "}
                      <span className="text-cyan-300 font-semibold">
                        National Water Supply and Drainage Board (NWSDB)
                      </span>
                      . Proudly recognized as{" "}
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                        Sri Lanka’s 1st Digitalised CBO Project
                      </span>
                      , this project supports the transition from traditional paper-based water billing to a more efficient digital process, helping modernise community-based water service management.
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {companySpotlight.bulletPoints.map((bp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs font-mono text-gray-300 bg-white/[0.02] p-2 rounded-lg border border-white/5"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link to Full Company Blog */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const post = blogPosts.find((p) => p.id === "ai-desk-vikasha-ebilling");
                        if (post) {
                          setSelectedPost(post);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="button button-primary text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-900/40"
                    >
                      <span>Read AI Desk Case Study & Story</span>
                      <ArrowUpRight size={14} />
                    </button>

                    <span className="text-[11px] font-mono text-gray-400">
                      OFFICIAL AI DESK PUBLICATION
                    </span>
                  </div>
                </div>

                {/* Right Column: 2nd Image Placed on the Company Project Showcase */}
                <div className="lg:col-span-5">
                  <div
                    className="company-project-frame relative rounded-2xl overflow-hidden border-2 border-violet-500/40 shadow-2xl shadow-violet-950/60 group cursor-pointer"
                    onClick={() => {
                      const post = blogPosts.find((p) => p.id === "ai-desk-vikasha-ebilling");
                      if (post) {
                        setSelectedPost(post);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  >
                    <SmartImage
                      src={asset(companySpotlight.projectVisual)}
                      alt="Vikasha CBO E-Billing System - Water Utility Digital Solution"
                      className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay Caption Bar */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block">
                          COMPANY PROJECT SHOWCASE
                        </span>
                        <h4 className="text-white font-bold text-sm sm:text-base">
                          Vikasha CBO E-Billing System
                        </h4>
                        <span className="text-xs text-gray-300 font-mono">
                          National Water Supply & Drainage Board
                        </span>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-violet-600/80 text-white flex items-center justify-center shrink-0 group-hover:bg-violet-500 transition-colors">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>

                    {/* Top Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-md">
                        1ST SRI LANKAN CBO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED SECTIONS: 01 Company Updates, 02 Articles, 03 Career Blogs */}
          <div className="space-y-16">
            {visibleSections.map((sec) => {
              const postsInSection = blogPosts.filter((p) => p.section === sec.key);
              const SecIcon = sec.icon;

              return (
                <section key={sec.key} className="blog-section-block">
                  {/* Section Title Header */}
                  <div className="section-header-row flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 mb-8 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-bold mb-1">
                        <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/30">
                          SECTION {sec.number}
                        </span>
                        <SecIcon size={14} />
                        <span className="uppercase">{sec.key}</span>
                      </div>
                      <h2 className="font-unbounded text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {sec.title}
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                        {sec.subtitle}
                      </p>
                    </div>

                    <span className="font-mono text-xs text-gray-500 shrink-0">
                      SHOWING {postsInSection.length} POST{postsInSection.length === 1 ? "" : "S"}
                    </span>
                  </div>

                  {/* Section Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {postsInSection.map((post) => (
                      <article
                        key={post.id}
                        className="blog-card reveal-card cursor-pointer group flex flex-col justify-between p-4 rounded-2xl bg-[#0c0a17]/80 hover:bg-[#120f24] border border-white/10 hover:border-violet-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-violet-950/40"
                        onClick={() => {
                          setSelectedPost(post);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <div>
                          {/* Image Thumbnail with Overlay Pill */}
                          <div className="blog-card-image-shell relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-white/10 bg-black/40">
                            <SmartImage
                              src={asset(post.image)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                              <span className="blog-badge-float text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-violet-300">
                                {post.category}
                              </span>
                              {post.badge && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/80 text-black">
                                  {post.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Post Meta */}
                          <div className="flex items-center gap-3 text-xs text-muted font-mono mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} /> {post.date}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {post.readTime}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-unbounded text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          {/* Summary */}
                          <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                            {post.summary}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/5">
                          <span className="text-xs font-mono text-violet-300 font-semibold group-hover:underline flex items-center gap-1">
                            <span>Read Story</span>
                            <ArrowUpRight size={13} />
                          </span>

                          <span className="text-[10.5px] font-mono text-gray-500 uppercase">
                            BY {post.author.name}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
