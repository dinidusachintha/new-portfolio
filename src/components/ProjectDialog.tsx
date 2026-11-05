import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  ExternalLink,
  Github,
  Layers,
  Monitor,
  Play,
  Smartphone,
  Sparkles,
  Tablet,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { asset, projects } from "../data/portfolio";
import type { Project } from "../data/portfolio";
import { projectsData } from "../data/projectsData";
import SmartImage from "./SmartImage";

export default function ProjectDialog({
  project,
  initialTab = "demo",
  onClose,
  onSelectProject,
}: {
  project: Project | null;
  initialTab?: "demo" | "arch";
  onClose: () => void;
  onSelectProject?: (project: Project, tab?: "demo" | "arch") => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "arch">(initialTab);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Interactive Live Demo States
  // 1. Lessons2Drive
  const [selectedInstructor, setSelectedInstructor] = useState("Marcus Vance");
  const [selectedSlot, setSelectedSlot] = useState("Today, 2:30 PM");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // 2. Learning Platform
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);

  // 3. Nexus Stream Hub
  const [nexusPrice, setNexusPrice] = useState(64820.5);
  const [nexusLatency, setNexusLatency] = useState(34);
  const [nexusEvents, setNexusEvents] = useState<string[]>([
    "ORDER_MATCHED #NX-9428 @ $64,815.00 [2.4 BTC]",
    "LIQUIDITY_POOLED: ETH/USDT +$450,000",
    "WEBSOCKET_HEARTBEAT: Node us-east-1 OK (32ms)",
  ]);

  // 4. Ceylon Trails
  const [selectedTrail, setSelectedTrail] = useState<"ella" | "knuckles" | "adams">("ella");

  // 5. CloudSentinel AI
  const [sentinelSpikeActive, setSentinelSpikeActive] = useState(false);
  const [sentinelRecovered, setSentinelRecovered] = useState(false);

  // 6. OmniStream AI
  const [omniFps, setOmniFps] = useState<24 | 60 | 120>(60);
  const [omniResolution, setOmniResolution] = useState<"1080p" | "4K" | "8K">("4K");
  const [omniProcessing, setOmniProcessing] = useState(false);
  const [omniProgress, setOmniProgress] = useState(100);

  // 7. Pulse Ledger Core
  const [pulseBlocks, setPulseBlocks] = useState<
    { id: string; txCount: number; hash: string; verified: boolean; time: string }[]
  >([
    { id: "#89421", txCount: 2480, hash: "0x8fa9...31c2", verified: true, time: "Just now" },
    { id: "#89420", txCount: 3120, hash: "0x3e17...b49a", verified: true, time: "2s ago" },
    { id: "#89419", txCount: 1940, hash: "0x72dc...f901", verified: true, time: "4s ago" },
  ]);

  // Keep Nexus price ticking for realism
  useEffect(() => {
    if (!project || project.id !== "nexus" || activeTab !== "demo") return;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 15;
      setNexusPrice((prev) => +(prev + delta).toFixed(2));
      setNexusLatency(Math.floor(28 + Math.random() * 12));
    }, 2000);
    return () => clearInterval(interval);
  }, [project, activeTab]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      setActiveTab(initialTab);
      setBookingConfirmed(false);
      setBookingLoading(false);
      setQuizSelected(null);
      setQuizPassed(null);
      setSentinelSpikeActive(false);
      setSentinelRecovered(false);
      setOmniProcessing(false);
      setOmniProgress(100);
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          // Dialog may already be open or opening
        }
      }
    } else {
      if (dialog.open) {
        try {
          dialog.close();
        } catch {
          // Dialog may already be closed
        }
      }
    }
  }, [project, initialTab]);

  const handleBookSlot = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingConfirmed(true);
    }, 600);
  };

  const handleQuizAnswer = (idx: number) => {
    setQuizSelected(idx);
    setQuizPassed(idx === 1);
  };

  // Find current project index and architecture nodes for navigation & diagram
  const currentProjectIndex = project
    ? projects.findIndex((p) => p.id === project.id)
    : -1;
  const detailedItem = project
    ? projectsData.find((d) => d.id === project.id)
    : undefined;
  const liveUrl = project?.liveUrl || detailedItem?.liveUrl;
  const sourceUrl = project?.sourceUrl || detailedItem?.sourceUrl;

  const navigateSibling = (direction: -1 | 1) => {
    if (!onSelectProject || currentProjectIndex === -1) return;
    const nextIdx =
      (currentProjectIndex + direction + projects.length) % projects.length;
    onSelectProject(projects[nextIdx], activeTab);
  };

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      {project && (
        <div className="dialog-inner max-w-4xl max-h-[92vh] overflow-y-auto">
          {/* Top Bar with Mode Switcher, Prev/Next Navigation & Close Button */}
          <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#0a0c12]/95 backdrop-blur-md border-b border-white/10">
            {/* View Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("demo")}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "demo"
                    ? "bg-white text-black font-bold shadow-md"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Interactive Live Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("arch")}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "arch"
                    ? "bg-white text-black font-bold shadow-md"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Code2 size={13} />
                <span>Architecture & Case Study</span>
              </button>
            </div>

            {/* Right: Project Stepper & Close */}
            <div className="flex items-center gap-2 ml-auto">
              {onSelectProject && (
                <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-white/10 font-mono text-xs text-slate-300">
                  <button
                    type="button"
                    onClick={() => navigateSibling(-1)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                    title="Previous System"
                    aria-label="Previous system"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <span className="px-2 text-[11px] font-bold text-violet-300 font-unbounded">
                    {project.index} / 0{projects.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateSibling(1)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                    title="Next System"
                    aria-label="Next system"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}

              <button
                autoFocus
                type="button"
                className="w-9 h-9 border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center rounded-full transition-colors cursor-pointer shrink-0"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: INTERACTIVE LIVE DEMO PREVIEW                              */}
          {/* ================================================================= */}
          {activeTab === "demo" && (
            <div className="p-5 sm:p-8 space-y-6">
              {/* System Header Banner inside Demo Tab */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-violet-300 font-bold">
                    <span>SYSTEM {project.index}</span>
                    <span>·</span>
                    <span>{project.kind}</span>
                  </div>
                  <h2
                    id="project-dialog-title"
                    className="text-xl sm:text-3xl font-black text-white tracking-tight mt-0.5 font-unbounded"
                  >
                    {project.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {project.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="hidden md:block px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-right font-mono"
                    >
                      <div className="text-xs font-bold text-violet-300 font-unbounded">
                        {m.value}
                      </div>
                      <div className="text-[9.5px] text-slate-400">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Address Bar & Device Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300 truncate">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="px-3 py-1 rounded-md bg-black/60 border border-white/10 text-emerald-400 font-semibold truncate">
                    {liveUrl || `https://${project.id}.dinidu.dev`}
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    200 OK · 38ms
                  </span>
                </div>

                {/* Device Viewport Resizer */}
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 font-mono text-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setDeviceView("desktop")}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      deviceView === "desktop"
                        ? "bg-white/20 text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor size={13} />
                    <span className="text-[10px]">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView("tablet")}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      deviceView === "tablet"
                        ? "bg-white/20 text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Tablet Preview"
                  >
                    <Tablet size={13} />
                    <span className="text-[10px]">Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView("mobile")}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      deviceView === "mobile"
                        ? "bg-white/20 text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Mobile Preview"
                  >
                    <Smartphone size={13} />
                    <span className="text-[10px]">Mobile</span>
                  </button>
                </div>
              </div>

              {/* Viewport Sandbox Container */}
              <div
                className={`mx-auto transition-all duration-300 rounded-2xl overflow-hidden border border-white/15 bg-[#090b10] shadow-2xl ${
                  deviceView === "desktop"
                    ? "w-full"
                    : deviceView === "tablet"
                    ? "max-w-[620px]"
                    : "max-w-[360px]"
                }`}
              >
                {/* 1. LESSONS2DRIVE INTERACTIVE SIMULATOR */}
                {project.id === "lessons2drive" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          LESSONS2DRIVE LIVE BOOKING ENGINE
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Select an Instructor & Conflict-Free Slot
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                        PostgreSQL Row-Locks Active
                      </span>
                    </div>

                    {/* Step 1: Instructor Choice */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        1. AVAILABLE VERIFIED INSTRUCTOR
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { name: "Marcus Vance", rating: "4.98", car: "VW Golf (Manual)" },
                          { name: "Sarah Chen", rating: "4.95", car: "Toyota Corolla (Auto)" },
                        ].map((inst) => (
                          <button
                            key={inst.name}
                            type="button"
                            onClick={() => {
                              setSelectedInstructor(inst.name);
                              setBookingConfirmed(false);
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedInstructor === inst.name
                                ? "bg-emerald-950/40 border-emerald-500 text-white"
                                : "bg-white/[0.02] border-white/10 text-gray-300 hover:border-white/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm">{inst.name}</span>
                              <span className="text-xs text-amber-400 font-mono">⭐ {inst.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400 block mt-1">{inst.car}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Time Slot Choice */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        2. CONFLICT-CHECKED CALENDAR SLOTS
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Today, 2:30 PM", "Tomorrow, 10:00 AM", "Friday, 4:00 PM"].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot);
                              setBookingConfirmed(false);
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer ${
                              selectedSlot === slot
                                ? "bg-white text-black font-bold border-white"
                                : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Booking Action */}
                    <div className="pt-2">
                      {!bookingConfirmed ? (
                        <button
                          type="button"
                          onClick={handleBookSlot}
                          disabled={bookingLoading}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm font-mono flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {bookingLoading ? (
                            <span>Acquiring Distributed Mutex Lock...</span>
                          ) : (
                            <>
                              <Zap size={16} />
                              <span>Reserve Slot with Zero-Conflict Lock</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
                          <div className="flex items-center gap-2 font-bold text-sm text-white">
                            <Check size={16} className="text-emerald-400" />
                            <span>Slot Successfully Booked!</span>
                          </div>
                          <div>Instructor: {selectedInstructor} · {selectedSlot}</div>
                          <div className="text-[11px] text-gray-400">
                            TxId: 0x4f89b21a · Row lock executed in 44ms · Stripe Escrow Ready
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. LEARNING PLATFORM INTERACTIVE SIMULATOR */}
                {project.id === "learning-platform" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold">
                          NEXT.JS ISR LEARNING PLATFORM
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Distributed Systems & Microservices Masterclass
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-xs font-mono font-semibold">
                        sub-50ms ISR
                      </span>
                    </div>

                    {/* Interactive Video Player Mock */}
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-video relative flex flex-col justify-end p-4 group">
                      <img
                        src={asset(project.mockupImage || project.image)}
                        alt="Course video preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                      <div className="relative z-10 space-y-2">
                        <div className="flex items-center justify-between text-xs text-white font-mono">
                          <div className="flex items-center gap-2">
                            <Play size={14} className="text-violet-400" fill="currentColor" />
                            <span>Module 0{activeLesson + 1}: High-Throughput Concurrency</span>
                          </div>
                          <span>18:42 / 24:10</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                          <div className="h-full bg-violet-400 w-3/4 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Lesson Syllabus Selector */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        SYLLABUS MODULES (CLICK TO SWITCH):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          "01 Concurrency Locks",
                          "02 Redis Partitioning",
                          "03 WebSocket Streaming",
                        ].map((mod, idx) => (
                          <button
                            key={mod}
                            type="button"
                            onClick={() => {
                              setActiveLesson(idx);
                              setQuizSelected(null);
                              setQuizPassed(null);
                            }}
                            className={`p-2.5 rounded-lg text-xs font-mono border text-left transition-all cursor-pointer ${
                              activeLesson === idx
                                ? "bg-violet-950/60 border-violet-500 text-white font-bold"
                                : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
                            }`}
                          >
                            {mod}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Knowledge Check Quiz */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                      <span className="text-xs font-mono text-violet-300 font-bold block">
                        INTERACTIVE KNOWLEDGE CHECK:
                      </span>
                      <p className="text-xs text-gray-300">
                        How does this platform prevent duplicate seat registrations during flash-sale enrollment?
                      </p>
                      <div className="space-y-2">
                        {[
                          "Client-side local storage flag",
                          "PostgreSQL transactional row lock with atomic SELECT FOR UPDATE",
                          "Periodic polling cron job every 5 minutes",
                        ].map((ans, idx) => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => handleQuizAnswer(idx)}
                            className={`w-full text-left p-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                              quizSelected === idx
                                ? idx === 1
                                  ? "bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold"
                                  : "bg-rose-950/50 border-rose-500 text-rose-200"
                                : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30"
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {quizPassed !== null && (
                        <p className={`text-xs font-mono font-bold ${quizPassed ? "text-emerald-400" : "text-rose-400"}`}>
                          {quizPassed
                            ? "✓ Correct! Atomic row-level lock ensures absolute consistency under concurrency."
                            : "✗ Incorrect. Strict database transactional guarantees are required."}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. NEXUS STREAM HUB INTERACTIVE SIMULATOR */}
                {project.id === "nexus" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                          NEXUS REAL-TIME WEBSOCKET HUB
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Live Financial Telemetry Engine
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-xs font-mono text-cyan-300 font-bold">
                          {nexusLatency}ms Roundtrip
                        </span>
                      </div>
                    </div>

                    {/* Live Price Board */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] font-mono text-gray-400 block">BTC / USDT</span>
                        <div className="text-lg font-bold font-mono text-white flex items-center gap-1.5 mt-0.5">
                          <TrendingUp size={16} className="text-emerald-400" />
                          <span>${nexusPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] font-mono text-gray-400 block">ETH / USDT</span>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">$3,492.10</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] font-mono text-gray-400 block">THROUGHPUT</span>
                        <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">50k evt/s</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] font-mono text-gray-400 block">CLUSTER</span>
                        <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">Healthy (8/8)</div>
                      </div>
                    </div>

                    {/* Real-time Event Feed */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-400">
                          WEBSOCKET EVENT DISPATCH (STREAMING):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newEvent = `ORDER_EXEC #NX-${Math.floor(1000 + Math.random() * 9000)} @ $${nexusPrice} [${(Math.random() * 5).toFixed(2)} BTC]`;
                            setNexusEvents((prev) => [newEvent, ...prev.slice(0, 3)]);
                          }}
                          className="text-[11px] font-mono text-cyan-300 hover:underline cursor-pointer"
                        >
                          + Trigger Mock Trade
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 font-mono text-xs space-y-1.5 text-gray-300 max-h-36 overflow-y-auto">
                        {nexusEvents.map((evt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">&gt;</span>
                            <span className={idx === 0 ? "text-cyan-300 font-semibold" : "text-gray-400"}>
                              {evt}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CEYLON TRAILS INTERACTIVE SIMULATOR */}
                {project.id === "ceylon" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                          CEYLON TRAILS ADVENTURE HUB
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Offline-First GPS Waypoint & Elevation Explorer
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold">
                        Offline Cache Ready
                      </span>
                    </div>

                    {/* Trail Selector */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "ella", label: "Ella Rock", elev: "1,041m", dist: "8.4 km" },
                        { id: "knuckles", label: "Knuckles Range", elev: "1,863m", dist: "14.2 km" },
                        { id: "adams", label: "Adam's Peak", elev: "2,243m", dist: "12.0 km" },
                      ].map((trail) => (
                        <button
                          key={trail.id}
                          type="button"
                          onClick={() => setSelectedTrail(trail.id as "ella" | "knuckles" | "adams")}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedTrail === trail.id
                              ? "bg-amber-950/50 border-amber-500 text-white font-bold"
                              : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          <div className="text-xs font-bold">{trail.label}</div>
                          <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                            {trail.elev} · {trail.dist}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Interactive Elevation & Trail Stats */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Compass size={15} />
                          <span>ACTIVE WAYPOINT COORDINATES:</span>
                        </span>
                        <span className="text-white">
                          {selectedTrail === "ella"
                            ? "6.8667° N, 81.0466° E"
                            : selectedTrail === "knuckles"
                            ? "7.4000° N, 80.7833° E"
                            : "6.8096° N, 80.4994° E"}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                          style={{
                            width:
                              selectedTrail === "ella"
                                ? "65%"
                                : selectedTrail === "knuckles"
                                ? "85%"
                                : "95%",
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400">
                        <span>Base Camp</span>
                        <span>
                          Ridge Elevation:{" "}
                          {selectedTrail === "ella"
                            ? "1,041m"
                            : selectedTrail === "knuckles"
                            ? "1,863m"
                            : "2,243m"}
                        </span>
                        <span>Summit Checkpoint</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CLOUDSENTINEL AI INTERACTIVE SIMULATOR */}
                {project.id === "sentinel" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                          KUBERNETES KERNEL TELEMETRY
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          eBPF Observability & Cluster Self-Healing
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        48/48 Nodes Online
                      </span>
                    </div>

                    {/* Cluster Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="text-[11px] font-mono text-gray-400">HEALTH SLA</div>
                        <div className="text-lg font-bold text-emerald-400">99.98%</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="text-[11px] font-mono text-gray-400">ANOMALY TTFD</div>
                        <div className="text-lg font-bold text-indigo-300">8.4ms</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="text-[11px] font-mono text-gray-400">eBPF PROBES</div>
                        <div className="text-lg font-bold text-cyan-300">1,280 Hooks</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="text-[11px] font-mono text-gray-400">INGRESS RATE</div>
                        <div className="text-lg font-bold text-white">4.2 Gbps</div>
                      </div>
                    </div>

                    {/* Interactive Cluster Anomaly Simulator */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-300 flex items-center gap-2">
                          <Activity size={14} className="text-indigo-400" />
                          <span>NODE CPU LOAD MONITORING</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSentinelSpikeActive(true);
                            setSentinelRecovered(false);
                            setTimeout(() => {
                              setSentinelRecovered(true);
                              setSentinelSpikeActive(false);
                            }, 1800);
                          }}
                          disabled={sentinelSpikeActive}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-indigo-200 text-xs font-mono transition-all cursor-pointer"
                        >
                          {sentinelSpikeActive ? "Mitigating Spike..." : "Simulate Pod Memory Spike"}
                        </button>
                      </div>

                      {/* Health Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-gray-400">worker-us-east-1a:</span>
                          <span className={sentinelSpikeActive ? "text-rose-400 font-bold" : "text-emerald-400"}>
                            {sentinelSpikeActive
                              ? "94% CRITICAL"
                              : sentinelRecovered
                              ? "42% NORMAL (Auto-Cordoned)"
                              : "48% HEALTHY"}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              sentinelSpikeActive ? "bg-rose-500 w-[94%]" : "bg-emerald-500 w-[48%]"
                            }`}
                          />
                        </div>
                      </div>

                      {sentinelRecovered && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                          <CheckCircle2 size={15} />
                          <span>
                            eBPF Daemon cordoned anomalous pod and rescheduled to node-04 in 12ms.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. OMNISTREAM AI INTERACTIVE SIMULATOR */}
                {project.id === "omnistream" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                          OMNISTREAM NEURAL RENDER STUDIO
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Distributed 8K Frame Interpolation & Stream
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold">
                        GPU Cluster Active
                      </span>
                    </div>

                    {/* Frame Rate & Resolution Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-gray-400 block mb-2">
                          TARGET FRAME RATE
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[24, 60, 120].map((fps) => (
                            <button
                              key={fps}
                              type="button"
                              onClick={() => setOmniFps(fps as 24 | 60 | 120)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                                omniFps === fps
                                  ? "bg-rose-600 text-white border-rose-400"
                                  : "bg-white/[0.03] text-gray-400 border-white/10 hover:text-white"
                              }`}
                            >
                              {fps} FPS
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-gray-400 block mb-2">
                          ENCODING FIDELITY
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["1080p", "4K", "8K"] as const).map((res) => (
                            <button
                              key={res}
                              type="button"
                              onClick={() => setOmniResolution(res)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                                omniResolution === res
                                  ? "bg-rose-600 text-white border-rose-400"
                                  : "bg-white/[0.03] text-gray-400 border-white/10 hover:text-white"
                              }`}
                            >
                              {res}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Audio & Waveform Visualization */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <Sparkles size={14} />
                          <span>NEURAL TIMELINE · FLOWNET V4.2</span>
                        </span>
                        <span className="text-gray-400">
                          {omniResolution} @ {omniFps}fps (Chunked Multi-GPU)
                        </span>
                      </div>

                      <div className="flex items-end gap-1 h-12 pt-2 px-1">
                        {[
                          18, 35, 60, 85, 45, 90, 70, 30, 95, 65, 40, 75, 50,
                          80, 100, 55, 30, 90, 45, 70, 85, 40,
                        ].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-t"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setOmniProcessing(true);
                          setOmniProgress(20);
                          const t1 = setTimeout(() => setOmniProgress(65), 500);
                          const t2 = setTimeout(() => {
                            setOmniProgress(100);
                            setOmniProcessing(false);
                          }, 1100);
                          return () => {
                            clearTimeout(t1);
                            clearTimeout(t2);
                          };
                        }}
                        disabled={omniProcessing}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                      >
                        {omniProcessing
                          ? `Synthesizing Neural Chunks (${omniProgress}%)...`
                          : "Render Neural Frame Interpolation"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. PULSE LEDGER CORE INTERACTIVE SIMULATOR */}
                {project.id === "pulse" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                          CRYPTOGRAPHIC CONSENSUS ENGINE
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Append-Only Distributed Ledger & Zero-Contention Audit
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold">
                        124,500 Tx/Sec
                      </span>
                    </div>

                    {/* Block Explorer */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400">
                          RECENT VERIFIED CRYPTOGRAPHIC BLOCKS:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newBlock = {
                              id: `#8942${pulseBlocks.length + 2}`,
                              txCount: Math.floor(2000 + Math.random() * 1500),
                              hash: `0x${Math.random()
                                .toString(16)
                                .substring(2, 6)}...${Math.random()
                                .toString(16)
                                .substring(2, 6)}`,
                              verified: true,
                              time: "Just now",
                            };
                            setPulseBlocks((prev) => [newBlock, ...prev.slice(0, 3)]);
                          }}
                          className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                        >
                          + Append Block
                        </button>
                      </div>

                      <div className="space-y-2">
                        {pulseBlocks.map((blk) => (
                          <div
                            key={blk.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-cyan-400 font-bold">{blk.id}</span>
                              <span className="text-gray-300">
                                {blk.txCount} Transactions
                              </span>
                              <span className="text-gray-500 hidden sm:inline">
                                {blk.hash}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                                SHA-256 VALID
                              </span>
                              <span className="text-gray-500 text-[11px]">
                                {blk.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. E-WEDDING RSVP INVITATION INTERACTIVE SIMULATOR */}
                {project.id === "e-wedding-rsvp" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5d8a4] font-bold">
                          E-WEDDING RSVP INVITATION · GIMASHA &amp; CHATHURA
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Digital Wedding Experience &amp; Live RSVP Engine
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold">
                        Olive &amp; Gold Luxury Theme
                      </span>
                    </div>

                    {/* Wedding Hero Screenshot Display */}
                    <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 aspect-[16/9] relative group">
                      <img
                        src={asset(project.mockupImage || project.image)}
                        alt="E-Wedding RSVP Invitation"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white z-10">
                        <span className="px-2.5 py-1 rounded bg-black/70 border border-white/20 text-[#c5d8a4]">
                          Gimasha &amp; Chathura · Together Forever
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#708238]/80 text-white font-bold">
                          Live Countdown Active
                        </span>
                      </div>
                    </div>

                    {/* Interactive RSVP Simulator Widget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-xs font-mono text-gray-400 block">
                          1. WEDDING COUNTDOWN TIMER
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 rounded bg-black/40 border border-white/10">
                            <div className="text-lg font-bold text-white font-unbounded">128</div>
                            <div className="text-[9px] font-mono text-gray-400 uppercase">Days</div>
                          </div>
                          <div className="p-2 rounded bg-black/40 border border-white/10">
                            <div className="text-lg font-bold text-white font-unbounded">14</div>
                            <div className="text-[9px] font-mono text-gray-400 uppercase">Hours</div>
                          </div>
                          <div className="p-2 rounded bg-black/40 border border-white/10">
                            <div className="text-lg font-bold text-white font-unbounded">36</div>
                            <div className="text-[9px] font-mono text-gray-400 uppercase">Mins</div>
                          </div>
                          <div className="p-2 rounded bg-black/40 border border-white/10">
                            <div className="text-lg font-bold text-white font-unbounded">42</div>
                            <div className="text-[9px] font-mono text-gray-400 uppercase">Secs</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-xs font-mono text-gray-400 block">
                          2. GUEST RSVP SIMULATOR
                        </span>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Confirmed Attending
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            2 Guests Reserved
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                          ✓ Flower Petals Animation Enabled · Audio Controller Ready
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. SPICY SELLING SITE INTERACTIVE SIMULATOR */}
                {project.id === "spicy-selling-site" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                          CEYLON REDS · SPICE E-COMMERCE STOREFRONT
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Modern Spice Shopping Experience &amp; Cart Engine
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-mono font-semibold">
                        Chili-Red &amp; Amber Fire Theme
                      </span>
                    </div>

                    {/* Storefront Hero Screenshot Display */}
                    <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 aspect-[16/9] relative group">
                      <img
                        src={asset(project.mockupImage || project.image)}
                        alt="Ceylon Reds Spicy Store"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white z-10">
                        <span className="px-2.5 py-1 rounded bg-black/70 border border-white/20 text-[#fdba74]">
                          Ceylon Reds · Premium Handcrafted Spice Blends
                        </span>
                        <span className="px-2.5 py-1 rounded bg-orange-600/80 text-white font-bold">
                          Cart Ready
                        </span>
                      </div>
                    </div>

                    {/* Interactive Store Simulator Widget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-xs font-mono text-gray-400 block">
                          1. FEATURED SPICE PRODUCT
                        </span>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10">
                          <div>
                            <div className="text-sm font-bold text-white">Ceylon Fire Hot Blend</div>
                            <div className="text-[10px] font-mono text-orange-400 font-semibold">
                              Heat: Extra Hot · Small Batch
                            </div>
                          </div>
                          <div className="text-sm font-mono font-bold text-emerald-400">$12.99</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-xs font-mono text-gray-400 block">
                          2. SHOPPING CART ENGINE
                        </span>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-mono font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                            Cart: 1 Item ($12.99)
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            Free Shipping Ready
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                          ✓ Reactive Cart State · Fast Product Search &amp; Filtering
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all shadow-lg cursor-pointer"
                    >
                      <span>Open External Live Deployment</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/20 text-white font-mono text-xs hover:bg-white/[0.08] transition-all cursor-pointer"
                    >
                      <Github size={14} />
                      <span>View GitHub Repository</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("arch")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-400 hover:underline cursor-pointer"
                >
                  <span>Read Full Technical Architecture Notes &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: SYSTEM ARCHITECTURE & CASE STUDY                           */}
          {/* ================================================================= */}
          {activeTab === "arch" && (
            <div>
              {/* Project Preview Banner */}
              <div className="dialog-image-wrapper">
                <SmartImage
                  src={asset(project.mockupImage || project.image)}
                  alt={`${project.title} — ${project.kind}`}
                  eager
                  className="dialog-hero-image"
                />
              </div>

              <div className="dialog-copy p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="eyebrow flex items-center gap-1.5 text-violet-400">
                    <Sparkles size={13} />
                    SYSTEM CASE STUDY /{project.index}
                  </span>
                  <span className="text-xs font-mono text-muted">
                    {project.category} · {project.year}
                  </span>
                </div>

                <h2
                  id="project-dialog-title"
                  className="text-xl sm:text-3xl font-bold text-white font-unbounded"
                >
                  {project.title}
                </h2>

                <p className="text-sm font-semibold text-gray-300 mt-1">
                  {project.kind} ·{" "}
                  <span className="text-violet-300">{project.role}</span>
                </p>

                <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                  {project.summary}
                </p>

                {/* Metrics Chips */}
                <div className="grid grid-cols-3 gap-3 my-5 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-base sm:text-lg font-bold font-mono text-violet-300">
                        {m.value}
                      </div>
                      <div className="text-[11px] text-gray-400">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* 4-Stage System Architecture Pipeline Diagram */}
                {detailedItem?.architectureNodes && (
                  <div className="my-6 p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-unbounded font-bold text-violet-300 uppercase tracking-wider">
                        END-TO-END SYSTEM TOPOLOGY & DATA FLOW
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        ● ZERO-CONTENTION PIPELINE
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {detailedItem.architectureNodes.map((node, idx) => (
                        <div
                          key={idx}
                          className="relative p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span>0{idx + 1} // {node.layer.toUpperCase()}</span>
                              {idx < detailedItem.architectureNodes.length - 1 && (
                                <ArrowRight
                                  size={12}
                                  className="text-violet-400 hidden lg:inline"
                                />
                              )}
                            </div>
                            <div className="text-xs font-bold text-white font-mono">
                              {node.tech}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                            {node.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="text-xs font-mono text-gray-400 mb-2">
                    TECHNOLOGY ARSENAL:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <span key={t} className="tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deep Breakdown Columns */}
                <div className="dialog-columns grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-sm font-bold text-rose-300 flex items-center gap-1.5 mb-2">
                      <Activity size={15} /> The Challenge & Constraints
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {project.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                      <Layers size={15} /> Architectural Solution
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Architecture Details */}
                {project.architecture && (
                  <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/30 mb-6">
                    <h3 className="text-xs font-bold font-mono text-violet-300 uppercase tracking-wider mb-1.5">
                      SYSTEM ARCHITECTURE NOTES:
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {project.architecture}
                    </p>
                  </div>
                )}

                {/* Key Engineering Decisions */}
                <div className="mb-6">
                  <h3 className="text-xs font-mono text-gray-400 mb-2">
                    KEY ENGINEERING DECISIONS & HIGHLIGHTS:
                  </h3>
                  <ul className="space-y-1.5">
                    {project.highlights.map((h, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-gray-300"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-emerald-400 mt-0.5 shrink-0"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("demo")}
                      className="button button-primary text-xs py-2.5 px-5 cursor-pointer"
                    >
                      <Play size={14} className="fill-current" />
                      <span>Launch Interactive Simulator</span>
                    </button>
                    {liveUrl && (
                      <a
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all shadow-lg cursor-pointer"
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Open External Live Deployment</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {sourceUrl && (
                      <a
                        className="button button-outline text-xs py-2.5 px-5 cursor-pointer"
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={14} />
                        <span>Inspect Source Code</span>
                      </a>
                    )}
                  </div>

                  {onSelectProject && (
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => navigateSibling(-1)}
                        className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateSibling(1)}
                        className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
