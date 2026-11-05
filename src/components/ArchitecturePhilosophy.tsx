import { Cpu, GitBranch, Layers, ShieldCheck } from "lucide-react";
import { principles } from "../data/portfolio";

export default function ArchitecturePhilosophy() {
  return (
    <section className="philosophy-section container" id="architecture">
      <div className="section-top reveal">
        <span className="eyebrow">
          <GitBranch size={13} className="inline mr-1 text-violet-400" />
          03 / HOW I BUILD & ENGINEER
        </span>
        <span className="small-index">SYSTEMATIC METHODOLOGY</span>
      </div>

      <div className="section-heading-row reveal">
        <h2>
          Architectural rigor.
          <br />
          <span className="text-muted">From RFC to production cluster.</span>
        </h2>
        <p>
          Great software isn't improvised. It is designed with clear constraints,
          proven data models, and automated guardrails.
        </p>
      </div>

      <div className="principles-grid grid grid-cols-1 md:grid-cols-2 gap-7">
        {principles.map((item, idx) => (
          <div
            key={item.number}
            className="principle-card reveal-card"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="principle-card-top flex items-center justify-between">
              <span className="principle-number font-mono text-xs font-bold text-violet-400">
                PHASE /{item.number}
              </span>
              <span className="principle-badge">{item.tag}</span>
            </div>

            <h3 className="principle-title mt-3">{item.title}</h3>
            <p className="principle-summary text-sm text-gray-400 mt-2">
              {item.summary}
            </p>

            {/* Code / Architecture Snippet Box */}
            <div className="principle-code-box mt-4">
              <div className="code-box-header flex items-center justify-between text-[11px] text-gray-500 font-mono pb-1 border-b border-white/5">
                <span>SPEC // {item.number}</span>
                <span className="text-emerald-400">COMPILED</span>
              </div>
              <pre className="code-box-body font-mono text-xs text-violet-300 mt-2 overflow-x-auto">
                <code>{item.snippet}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Metrics Row */}
      <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 reveal">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-800/40 flex items-center justify-center shrink-0 text-violet-400">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Idempotent Execution</h4>
            <p className="text-xs text-muted mt-0.5">
              Defensive service design ensuring safe retries across distributed networks.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center shrink-0 text-cyan-400">
            <Layers size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Normalized Schemas</h4>
            <p className="text-xs text-muted mt-0.5">
              Structured database models with strict indexing for predictable query plans.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center shrink-0 text-emerald-400">
            <Cpu size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Zero Runtime Guesswork</h4>
            <p className="text-xs text-muted mt-0.5">
              End-to-end static typing and automated CI validations before merging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
