import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Github,
  Layers,
  Monitor,
  Play,
  Smartphone,
  Sparkles,
  Tablet,
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

  // 1. Vikasha CBO E-Billing Simulator State
  const [cboAccount, setCboAccount] = useState("CBO-MAG-1048");
  const [cboUnits, setCboUnits] = useState(18);
  const [cboBillCalculated, setCboBillCalculated] = useState(false);
  const [cboCalculating, setCboCalculating] = useState(false);

  // 2. SchoolRide LK Simulator State
  const [selectedInstructor, setSelectedInstructor] = useState("Anura Kumara");
  const [selectedSlot, setSelectedSlot] = useState("Morning (6:30 AM)");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // 3. Waterboard Inventory Management Simulator State
  const [selectedInventoryItem, setSelectedInventoryItem] = useState("PVC Pressure Pipe 50mm");
  const [selectedSection, setSelectedSection] = useState("Operations & Maintenance Depot");
  const [inventoryDispatched, setInventoryDispatched] = useState(false);
  const [inventoryDispatching, setInventoryDispatching] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      setActiveTab(initialTab);
      setCboBillCalculated(false);
      setCboCalculating(false);
      setBookingConfirmed(false);
      setBookingLoading(false);
      setInventoryDispatched(false);
      setInventoryDispatching(false);
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

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  const handleBookSlot = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingConfirmed(true);
    }, 600);
  };

  const handleDispatchInventory = () => {
    setInventoryDispatching(true);
    setTimeout(() => {
      setInventoryDispatching(false);
      setInventoryDispatched(true);
    }, 500);
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
      aria-modal="true"
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
                className="w-11 h-11 min-w-[44px] min-h-[44px] border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center rounded-full transition-colors cursor-pointer shrink-0"
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
                    {detailedItem?.status === "COMING SOON"
                      ? "https://schoolride-lk.dev [COMING SOON]"
                      : liveUrl || `https://${project.id}.dinidu.dev`}
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {detailedItem?.status === "COMING SOON" ? "PRE-LAUNCH" : "200 OK · 38ms"}
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
                {/* 1. SCHOOLRIDE LK INTERACTIVE SIMULATOR */}
                {(project.id === "schoolride-lk" || project.id === "lessons2drive") && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          SCHOOLRIDE LK LIVE FLEET &amp; BOOKING ENGINE
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Select Verified Van Operator &amp; School Route
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live GPS Active
                      </span>
                    </div>

                    {/* Step 1: Instructor / Operator Choice */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        1. AVAILABLE VERIFIED OPERATOR &amp; VAN
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { name: "Anura Kumara", rating: "4.98", car: "Toyota HiAce (WP-NA-4821)", route: "Colombo 07 - Royal College" },
                          { name: "Sunil Perera", rating: "4.95", car: "Nissan Caravan (WP-NB-1920)", route: "Nugegoda - Visakha Route" },
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
                            <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">{inst.route}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Time Slot / Pickup Choice */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        2. PICKUP WINDOW &amp; ROUTE SCHEDULE
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Morning (6:30 AM)", "Afternoon (1:30 PM)", "Full Day Round-Trip"].map((slot) => (
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
                            <span>Confirming Verified Van Slot...</span>
                          ) : (
                            <>
                              <Zap size={16} />
                              <span>Reserve Verified School Van Seat</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
                          <div className="flex items-center gap-2 font-bold text-sm text-white">
                            <Check size={16} className="text-emerald-400" />
                            <span>Ride Confirmed &amp; Driver Linked!</span>
                          </div>
                          <div>Operator: {selectedInstructor} · {selectedSlot}</div>
                          <div className="text-[11px] text-gray-400">
                            Live Tracking: Active · Socket.io Gateway Connected · Parent Push SMS Dispatched
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* VIKASHA CBO E-BILLING INTERACTIVE SIMULATOR */}
                {project.id === "vikasha-ebilling" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                          NWSDB COMMUNITY WATER · VIKASHA CBO METERING ENGINE
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Automated Water Tariff Calculator & SMS Dispatch Simulator
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        NWSDB Tiered Tariff Live
                      </span>
                    </div>

                    {/* Step 1: Account Selection */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        1. SELECT CONSUMER WATER ACCOUNT
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: "CBO-MAG-1048", name: "R.M. Bandara", cat: "Domestic", prev: 142 },
                          { id: "CBO-MAG-2081", name: "K. Somapala", cat: "Commercial", prev: 310 },
                          { id: "CBO-MAG-3142", name: "St. Mary's School", cat: "Institutional", prev: 520 },
                        ].map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              setCboAccount(acc.id);
                              setCboBillCalculated(false);
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              cboAccount === acc.id
                                ? "bg-cyan-500/15 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-semibold mb-1">
                              <span>{acc.id}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-normal">
                                {acc.cat}
                              </span>
                            </div>
                            <div className="text-white text-sm font-semibold truncate">{acc.name}</div>
                            <div className="text-gray-400 text-[11px] font-mono mt-1">Prev Meter: {acc.prev} Units</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Current Meter Reading / Units Consumed */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-gray-400">
                          2. MONTHLY CONSUMPTION (UNITS / CUBIC METERS)
                        </label>
                        <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-lg">
                          {cboUnits} Units ({cboUnits * 1000} Liters)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={cboUnits}
                        onChange={(e) => {
                          setCboUnits(Number(e.target.value));
                          setCboBillCalculated(false);
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-gray-500">
                        <span>5 Units (Base Lifeline)</span>
                        <span>25 Units (Avg Family)</span>
                        <span>50 Units (Peak Load)</span>
                      </div>
                    </div>

                    {/* Tariff Breakdown Matrix */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
                      <div className="text-gray-400 font-semibold flex items-center justify-between pb-2 border-b border-white/10">
                        <span>NWSDB STANDARD TARIFF COMPUTATION</span>
                        <span className="text-cyan-400">BILLING CYCLE: NOV 2026</span>
                      </div>
                      <div className="flex justify-between text-gray-300 pt-1">
                        <span>Tier 1 (0 - 15 units @ LKR 40.00/unit):</span>
                        <span>LKR {(Math.min(cboUnits, 15) * 40).toFixed(2)}</span>
                      </div>
                      {cboUnits > 15 && (
                        <div className="flex justify-between text-gray-300">
                          <span>Tier 2 (16 - 25 units @ LKR 65.00/unit):</span>
                          <span>LKR {((Math.min(cboUnits, 25) - 15) * 65).toFixed(2)}</span>
                        </div>
                      )}
                      {cboUnits > 25 && (
                        <div className="flex justify-between text-gray-300">
                          <span>Tier 3 (26+ units @ LKR 110.00/unit):</span>
                          <span>LKR {((cboUnits - 25) * 110).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-400">
                        <span>Fixed Monthly Infrastructure Charge:</span>
                        <span>LKR 250.00</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                        <span>Total Due (LKR):</span>
                        <span className="text-cyan-400">
                          LKR{" "}
                          {(
                            (Math.min(cboUnits, 15) * 40) +
                            (cboUnits > 15 ? (Math.min(cboUnits, 25) - 15) * 65 : 0) +
                            (cboUnits > 25 ? (cboUnits - 25) * 110 : 0) +
                            250
                          ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Action button & generated result */}
                    <div>
                      {!cboBillCalculated ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCboCalculating(true);
                            setTimeout(() => {
                              setCboCalculating(false);
                              setCboBillCalculated(true);
                            }, 500);
                          }}
                          disabled={cboCalculating}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                        >
                          {cboCalculating ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              Compiling Water Meter Ledger & Encrypting SMS Payload...
                            </span>
                          ) : (
                            <span>Generate E-Bill & Dispatch SMS Alert</span>
                          )}
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs font-mono space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-sm text-white">
                              <Check size={16} className="text-cyan-400" />
                              <span>E-Bill Successfully Generated & SMS Dispatched!</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              REF: {cboAccount}-202611
                            </span>
                          </div>
                          
                          {/* Simulated SMS Alert bubble */}
                          <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-gray-300 space-y-1">
                            <div className="text-[10px] uppercase text-cyan-400 font-bold flex items-center justify-between">
                              <span>📱 SIMULATED SMS GATEWAY (DIALOG / MOBITEL)</span>
                              <span className="text-gray-500">SENT JUST NOW</span>
                            </div>
                            <p className="text-white">
                              [NWSDB VIKASHA CBO] Water Bill for Acc: {cboAccount}. Units: {cboUnits}. Total: LKR{" "}
                              {(
                                (Math.min(cboUnits, 15) * 40) +
                                (cboUnits > 15 ? (Math.min(cboUnits, 25) - 15) * 65 : 0) +
                                (cboUnits > 25 ? (cboUnits - 25) * 110 : 0) +
                                250
                              ).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                              due by 28/11/2026. Pay at CBO counter or online. Thank you!
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-gray-400">
                              Status: Ledger committed to MySQL · Thermal printer receipt spool ready
                            </span>
                            <button
                              type="button"
                              onClick={() => setCboBillCalculated(false)}
                              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors cursor-pointer"
                            >
                              Recalculate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. WATERBOARD INVENTORY MANAGEMENT INTERACTIVE SIMULATOR */}
                {project.id === "waterboard-inventory" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                          NWSDB WATER UTILITY · INVENTORY &amp; STOCK CONTROL
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Material Rebalance, Stock Allocation &amp; PDF Audit
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        MongoDB &amp; jsPDF Engine Active
                      </span>
                    </div>

                    {/* Step 1: Material Item Choice */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        1. SELECT WATERWORKS MATERIAL ITEM
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { name: "PVC Pressure Pipe 50mm", code: "WBD-PIP-050", stock: "420 Units", status: "In Stock" },
                          { name: "Brass Water Meter 15mm", code: "WBD-MTR-015", stock: "35 Units", status: "Low Stock Alert" },
                          { name: "Sluice Gate Valve 100mm", code: "WBD-VLV-100", stock: "18 Units", status: "In Stock" },
                        ].map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              setSelectedInventoryItem(item.name);
                              setInventoryDispatched(false);
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedInventoryItem === item.name
                                ? "bg-cyan-950/40 border-cyan-500 text-white"
                                : "bg-white/[0.02] border-white/10 text-gray-300 hover:border-white/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs truncate">{item.name}</span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  item.status.includes("Low")
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                }`}
                              >
                                {item.stock}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400 block mt-1 font-mono">{item.code}</span>
                            <span className="text-[10px] text-cyan-300 font-mono block mt-0.5">{item.status}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Utility Section Assignment */}
                    <div>
                      <label className="text-xs font-mono text-gray-400 block mb-2">
                        2. ASSIGN TO WATER SUPPLY SECTION / DEPOT
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          "Operations & Maintenance Depot",
                          "Distribution Network Unit",
                          "Water Quality & Treatment Section",
                        ].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => {
                              setSelectedSection(sec);
                              setInventoryDispatched(false);
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer truncate ${
                              selectedSection === sec
                                ? "bg-white text-black font-bold border-white"
                                : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30"
                            }`}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dispatch & Report Action */}
                    <div className="pt-2">
                      {!inventoryDispatched ? (
                        <button
                          type="button"
                          onClick={handleDispatchInventory}
                          disabled={inventoryDispatching}
                          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm font-mono flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {inventoryDispatching ? (
                            <span>Generating jsPDF Stock Manifest &amp; Updating MongoDB...</span>
                          ) : (
                            <>
                              <Zap size={16} />
                              <span>Record Stock Movement &amp; Generate PDF Audit</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono space-y-1">
                          <div className="flex items-center gap-2 font-bold text-sm text-white">
                            <Check size={16} className="text-cyan-400" />
                            <span>Stock Movement Recorded &amp; Audit PDF Exported!</span>
                          </div>
                          <div>Section: {selectedSection} · Material: {selectedInventoryItem}</div>
                          <div className="text-[11px] text-gray-400">
                            Status: MongoDB Synced (14ms) · PDF Manifest Built via jsPDF-AutoTable · Low Stock Alert: Monitored
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 8. FARMCART BLOG INTERACTIVE SIMULATOR */}
                {project.id === "farmcart-blog" && (
                  <div className="p-6 sm:p-8 space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          FARMCART BLOG · AGRICULTURE CONTENT &amp; KNOWLEDGE HUB
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          Practical Farming Knowledge for Better Harvests
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold">
                        Lush Green Theme · MERN Stack
                      </span>
                    </div>

                    {/* Blog Hero Screenshot Display */}
                    <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 aspect-[16/9] relative group">
                      <img
                        src={asset(project.mockupImage || project.image)}
                        alt="FarmCart Blog - Agriculture Content Platform"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white z-10">
                        <span className="px-2.5 py-1 rounded bg-black/70 border border-white/20 text-emerald-300">
                          Farming Insights · Crop Tips · Modern Practices
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-600/80 text-white font-bold">
                          Publishing Engine Active
                        </span>
                      </div>
                    </div>

                    {/* Interactive Blog Explorer & PDF Simulator Widget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-xs font-mono text-gray-400 block">
                          1. CATEGORIZED CROP GUIDES
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                            🍅 Tomato Cultivation
                          </span>
                          <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                            🌾 Paddy Best Practices
                          </span>
                          <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                            🌱 Organic Fertilizers
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                          ✓ Full-text keyword search &amp; instant category filtering
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <span className="text-xs font-mono text-gray-400 block">
                          2. PUBLISHING &amp; PDF REPORTS
                        </span>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            PDF Guides Ready
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            jsPDF + html2canvas
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                          ✓ Multer media upload · Mongoose article schema · Reader discussions
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
                      className="glass-pill-violet inline-flex items-center gap-2 px-5 py-2.5 rounded-full !text-white font-unbounded font-bold text-xs shadow-lg cursor-pointer"
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
                        className="glass-pill-violet inline-flex items-center gap-2 px-5 py-2.5 rounded-full !text-white font-unbounded font-bold text-xs shadow-lg cursor-pointer"
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
