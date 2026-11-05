import { useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Download,
  GraduationCap,
} from "lucide-react";
import { asset, experience, profile } from "../data/portfolio";
import FlyingHeading from "./FlyingHeading";

export default function ExperienceTimeline() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <section className="experience-section container" id="experience">
      <div className="section-top reveal">
        <span className="eyebrow flex items-center gap-1.5 text-violet-400">
          <Briefcase size={13} />
          02 / TRAJECTORY & EXPERIENCE
        </span>
        <span className="small-index">TRACK RECORD & ACADEMICS</span>
      </div>

      <div className="section-heading-row reveal">
        <FlyingHeading
          line1="Building credibility."
          line2="Engineering in the real world."
          line2ClassName="text-muted"
          className="font-unbounded"
        />
        <p>
          A combination of formal software engineering at SLIIT and continuous
          production delivery for clients and startups.
        </p>
      </div>

      {/* Interactive Smooth Dropdown Header Card */}
      <div className="experience-dropdown-header-card mt-8 reveal">
        <button
          type="button"
          onClick={toggleDropdown}
          className={`experience-dropdown-toggle-btn ${
            isDropdownOpen ? "is-open" : "is-closed"
          }`}
          aria-expanded={isDropdownOpen}
          aria-controls="experience-dropdown-content"
        >
          <div className="flex items-center gap-3">
            <div className="dropdown-icon-pill">
              <Briefcase size={16} className="text-violet-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-violet-400 uppercase tracking-wider">
                  02 / TRAJECTORY & EXPERIENCE
                </span>
                <span className="status-live-dot" />
              </div>
              <h3 className="font-unbounded text-sm sm:text-base font-bold text-white mt-0.5">
                Career Milestones & Academic Background
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted hidden sm:inline-block">
              {isDropdownOpen ? "CLICK TO COLLAPSE" : "CLICK TO EXPAND"}
            </span>
            <div className="dropdown-counter-badge font-mono text-xs">
              <span>{experience.length} MILESTONES</span>
            </div>
            <div
              className={`dropdown-chevron-box ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} />
            </div>
          </div>
        </button>
      </div>

      {/* Smooth Animated Dropdown Container */}
      <div
        id="experience-dropdown-content"
        className={`experience-dropdown-wrapper ${
          isDropdownOpen ? "is-expanded" : "is-collapsed"
        }`}
      >
        <div className="experience-dropdown-inner pt-8">
          <div className="timeline-container relative pl-4 sm:pl-8 border-l border-white/10 ml-2 sm:ml-4 space-y-8">
            {experience.map((item, idx) => (
              <div key={idx} className="timeline-item relative group">
                  {/* Pulsing Timeline Node */}
                  <div className="timeline-marker absolute -left-[21px] sm:-left-[37px] top-1.5 w-3.5 h-3.5 rounded-full bg-violet-500 border-4 border-[#080808] group-hover:scale-125 transition-transform" />

                  <div className="timeline-card p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-semibold text-violet-400">
                        {item.period}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[11px] font-mono text-gray-300 border border-white/10">
                        {item.type}
                      </span>
                    </div>

                    <h3 className="font-unbounded text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      {item.role.includes("BSc") ? (
                        <GraduationCap
                          size={20}
                          className="text-cyan-400 shrink-0"
                        />
                      ) : (
                        <Briefcase
                          size={20}
                          className="text-violet-400 shrink-0"
                        />
                      )}
                      <span>{item.role}</span>
                    </h3>

                    <div className="text-sm font-semibold text-gray-300 mt-0.5">
                      {item.company}
                    </div>

                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Achievements */}
                    <div className="mt-4 space-y-1.5">
                      {item.achievements.map((ach, aIdx) => (
                        <div
                          key={aIdx}
                          className="flex items-start gap-2 text-xs text-gray-300"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-violet-400 mt-0.5 shrink-0"
                          />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/5">
                      {item.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] font-mono text-gray-300 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {/* CV Download Bar */}
          <div className="cv-download-strip mt-12 p-6 rounded-2xl bg-gradient-to-r from-violet-950/30 via-transparent to-cyan-950/30 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Looking for a full resume with complete academic transcripts?
              </h4>
              <p className="text-xs text-muted mt-0.5">
                Download the official PDF document or reach out directly for references.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {profile.cv && (
                <a
                  href={asset(profile.cv)}
                  download
                  className="button button-outline text-xs py-2.5 px-4 flex items-center gap-2"
                >
                  <Download size={15} />
                  <span>Download CV</span>
                </a>
              )}
              <a
                href="#contact"
                className="button button-primary text-xs py-2.5 px-4 flex items-center gap-2"
              >
                <span>Initiate Conversation</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
