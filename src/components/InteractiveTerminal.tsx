import { useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Maximize2,
  Sparkles,
  Terminal as TerminalIcon,
} from "lucide-react";
import { profile, projects, stats } from "../data/portfolio";
import FlyingHeading from "./FlyingHeading";

type HistoryItem = {
  command: string;
  output: React.ReactNode;
  time: string;
};

const INITIAL_HISTORY: HistoryItem[] = [
  {
    command: "system --info",
    output: (
      <div className="terminal-boot-text">
        <p className="text-emerald-400 font-mono">
          ✓ System Boot Sequence OK · Node v20.x · Architecture: x86_64
        </p>
        <p className="text-gray-400">
          Welcome to Dinidu Sachintha’s interactive developer terminal.
        </p>
        <p className="text-gray-400">
          Type <span className="text-violet-400 font-semibold">help</span> or click any quick command chip below.
        </p>
      </div>
    ),
    time: "10:00:01",
  },
];

const QUICK_COMMANDS = [
  "help",
  "skills",
  "projects",
  "architecture",
  "about",
  "contact",
  "stats",
  "sudo hire",
  "clear",
];

export default function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [copied, setCopied] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  };

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-2">
            <p className="text-gray-300 font-medium">Available commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
              <div>
                <span className="text-violet-400">skills</span> — Inspect technical proficiencies
              </div>
              <div>
                <span className="text-violet-400">projects</span> — List production systems
              </div>
              <div>
                <span className="text-violet-400">architecture</span> — Engineering principles
              </div>
              <div>
                <span className="text-violet-400">about</span> — Bio & SLIIT background
              </div>
              <div>
                <span className="text-violet-400">stats</span> — Engineering benchmarks
              </div>
              <div>
                <span className="text-violet-400">contact</span> — Get in touch directly
              </div>
              <div>
                <span className="text-violet-400">sudo hire</span> — Immediate team onboarding
              </div>
              <div>
                <span className="text-violet-400">clear</span> — Clear terminal output
              </div>
            </div>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="space-y-2 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Technical Arsenal:</p>
            <p>
              <span className="text-cyan-400 font-semibold">Frontend:</span> React 19, Next.js, TypeScript, Tailwind CSS, Zustand, Redux Toolkit
            </p>
            <p>
              <span className="text-violet-400 font-semibold">Backend:</span> Node.js, Express, Spring Boot, Java, REST APIs, WebSockets, GraphQL
            </p>
            <p>
              <span className="text-amber-400 font-semibold">Databases:</span> PostgreSQL, MongoDB, Redis, MySQL, SQLite, Prisma ORM
            </p>
            <p>
              <span className="text-blue-400 font-semibold">Cloud & Ops:</span> Docker, AWS (S3, EC2, Lambda), GitHub Actions, Linux, Nginx
            </p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-3 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Featured Production Systems:</p>
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="border-l-2 border-violet-500/50 pl-3 py-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-bold">{p.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800/60">
                    {p.kind}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-0.5">{p.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-cyan-300 mt-1">
                  {p.metrics.map((m, idx) => (
                    <span key={idx}>[{m.value} {m.label}]</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case "architecture":
        output = (
          <div className="space-y-2 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Core Engineering Philosophy:</p>
            <p>01. <span className="text-violet-300">Decompose Ambiguity:</span> Clarify constraints & contracts before code.</p>
            <p>02. <span className="text-violet-300">Scalable Foundations:</span> Normalized relational schemas & resilient caching.</p>
            <p>03. <span className="text-violet-300">Test Integrity:</span> Idiomatic TypeScript with automated regression suites.</p>
            <p>04. <span className="text-violet-300">Continuous Deploys:</span> Containerized pipelines with telemetry.</p>
          </div>
        );
        break;

      case "about":
        output = (
          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">{profile.name} — {profile.role}</p>
            <p className="text-gray-300">{profile.about}</p>
            <p className="text-gray-400">
              📍 <span className="text-white">{profile.location}</span> ({profile.timezone}) · 🎓 <span className="text-white">{profile.education}</span>
            </p>
          </div>
        );
        break;

      case "stats":
        output = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-mono">
            {stats.map((s, idx) => (
              <div key={idx} className="p-2 rounded bg-white/5 border border-white/10 text-center">
                <div className="text-lg font-bold text-violet-400">{s.value}</div>
                <div className="text-xs text-gray-300">{s.label}</div>
              </div>
            ))}
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="space-y-1 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Communication Channels:</p>
            <p>Email: <a href={`mailto:${profile.email}`} className="text-cyan-400 hover:underline">{profile.email}</a></p>
            <p>Phone: <span className="text-gray-300">{profile.phone}</span></p>
            <p>WhatsApp: <a href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Direct WhatsApp Chat ↗</a></p>
            <p>Status: <span className="text-emerald-400">● {profile.status}</span></p>
          </div>
        );
        break;

      case "sudo hire":
        output = (
          <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-mono space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles size={16} /> [SUCCESS] ACCESS GRANTED: CONTRACT AUTHORIZED
            </p>
            <p>Dinidu Sachintha is ready to engineer your next high-impact system.</p>
            <p className="text-xs text-gray-300">
              Jump to the <a href="#contact" className="text-white underline">Contact Form</a> or WhatsApp directly at {profile.phone}.
            </p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        output = (
          <p className="text-rose-400 text-sm font-mono">
            command not found: {cmd}. Type <span className="text-white font-bold">help</span> to view available commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        command: rawCmd,
        output,
        time: getCurrentTime(),
      },
    ]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput("");
  };

  const copyContact = () => {
    navigator.clipboard.writeText(`${profile.email} · ${profile.phone}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="terminal-section container" id="terminal">
      <div className="section-top reveal">
        <span className="eyebrow">
          <TerminalIcon size={12} className="inline mr-1 text-violet-400" />
          04 / INTERACTIVE DEVELOPER CONSOLE
        </span>
        <span className="small-index">EXECUTE SHELL COMMANDS</span>
      </div>

      <div className="section-heading-row reveal">
        <FlyingHeading
          line1="Inside the engine."
          line2="Live interactive environment."
          line2ClassName="text-muted"
          className="font-unbounded"
        />
        <p>
          Explore system architecture, inspect technical proficiencies, or query
          benchmarks directly from the command line.
        </p>
      </div>

      <div className="terminal-window reveal-scale">
        {/* Terminal Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-controls">
            <span className="t-dot t-red" />
            <span className="t-dot t-yellow" />
            <span className="t-dot t-green" />
          </div>

          <div className="terminal-title">
            <span>dinidu@production: ~ (zsh)</span>
          </div>

          <div className="terminal-actions">
            <button
              type="button"
              onClick={copyContact}
              className="terminal-quick-btn"
              title="Copy developer contact"
              aria-label="Copy developer contact info"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy Contact"}</span>
            </button>
            <span className="terminal-quick-btn hidden md:inline-flex opacity-60">
              <Maximize2 size={12} />
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body" data-lenis-prevent>
          {history.map((item, idx) => (
            <div key={idx} className="terminal-entry space-y-1 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span className="text-emerald-400 font-semibold">dinidu@cluster</span>
                <span className="text-violet-400 font-semibold">:~$</span>
                <span className="text-white font-bold">{item.command}</span>
                <span className="ml-auto text-gray-500 text-[10px] hidden sm:inline">{item.time}</span>
              </div>
              <div className="terminal-output pl-2 sm:pl-4">{item.output}</div>
            </div>
          ))}

          {/* Active Command Input Form */}
          <form onSubmit={handleSubmit} className="terminal-form flex items-center gap-2 mt-2">
            <span className="text-emerald-400 font-mono text-sm font-semibold">dinidu@cluster</span>
            <span className="text-violet-400 font-mono text-sm font-semibold">:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type a command (e.g. skills, projects, help)..."
              className="terminal-input flex-1 bg-transparent border-0 outline-none font-mono text-sm text-white"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="terminal-submit-btn" aria-label="Run command">
              <ChevronRight size={16} />
            </button>
          </form>
        </div>

        {/* Quick Command Chips */}
        <div className="terminal-chips-bar">
          <span className="chips-label">Quick Commands:</span>
          <div className="chips-scroll">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => executeCommand(cmd)}
                className="chip-btn"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
