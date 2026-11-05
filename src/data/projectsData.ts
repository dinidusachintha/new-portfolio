import vikashaEBillingImg from "../assets/projects/vikasha-ebilling.jpg";
import lessons2DriveImg from "../assets/projects/lessons2drive.jpg";
import nexusStreamImg from "../assets/projects/nexus-stream.jpg";
import ceylonTrailsImg from "../assets/projects/ceylon-trails.jpg";
import sentinelImg from "../assets/projects/sentinel.jpg";
import omnistreamImg from "../assets/projects/omnistream.jpg";
import pulseImg from "../assets/projects/pulse.jpg";

export type ProjectDomain = "Full Stack" | "Cloud & Backend" | "AI & Media";

export interface ArchitectureNode {
  layer: string;
  tech: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  category: string;
  domain: ProjectDomain;
  year: string;
  role: string;
  status: string;
  title: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  highlights: string[];
  architectureNodes: ArchitectureNode[];
  technologies: string[];
  liveUrl: string;
  sourceUrl: string;
  screenshot: string;
  demoUrl: string;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  glowColor: string;
  tagBg: string;
  tagColor: string;
  metrics: { value: string; label: string }[];
}

export const projectsData: ProjectItem[] = [
  {
    id: "vikasha-ebilling",
    number: "01",
    category: "AI Desk Flagship",
    domain: "Full Stack",
    year: "2026",
    role: "Founder & Web Developer",
    status: "GOVERNMENT PRODUCTION",
    title: "Vikasha CBO E-Billing System",
    shortDescription:
      "Sri Lanka’s 1st Digitalised CBO Project under the National Water Supply and Drainage Board (NWSDB) — modernizing community water billing from traditional paper to cloud.",
    description:
      "Developed by AI Desk as Sri Lanka’s 1st Digitalised CBO Project under the National Water Supply and Drainage Board (NWSDB). Replaces traditional paper-based water billing with automated field meter readings, tiered tariff computing, instant SMS invoices, and centralized utility reporting.",
    problem:
      "Traditional community water schemes relied on handwritten paper ledgers, manual billing calculation, and physical collection slips, causing extensive billing delays, tariff arithmetic mistakes, and zero operational visibility for water boards.",
    solution:
      "Engineered an end-to-end digital utility ecosystem combining an administrative web dashboard for CBO managers with an offline-first mobile meter reader app and automated digital receipt issuance.",
    architecture:
      "Modern React & TypeScript frontend dashboard, Node.js & Express async billing services, PostgreSQL for relational consumer ledgers, and automated SMS gateway triggers.",
    highlights: [
      "Sri Lanka’s 1st Digitalised Community-Based Organisation (CBO) Water Project under NWSDB",
      "Automated multi-tier water tariff calculation engine eliminating human arithmetic discrepancies",
      "Field meter reader mobile app with offline synchronization and Bluetooth receipt printing",
      "Centralized consumption analytics and real-time revenue collection audits",
    ],
    architectureNodes: [
      { layer: "Command Center", tech: "React + TypeScript", detail: "Real-time billing dashboards & consumer directory" },
      { layer: "Field Client", tech: "Offline PWA + Bluetooth", detail: "Mobile meter readings & instant thermal receipts" },
      { layer: "Billing Core", tech: "Node.js + Tier Engine", detail: "Tiered tariff arithmetic & automated late-fee logic" },
      { layer: "Data Layer", tech: "PostgreSQL + Audit Log", detail: "ACID consumer ledgers & government compliance logs" },
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind", "NWSDB"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: vikashaEBillingImg,
    demoUrl: "https://github.com/dinidu",
    accentColor: "#0284c7",
    cardBg: "linear-gradient(145deg, #081726 0%, #040c14 100%)",
    borderColor: "rgba(2, 132, 199, 0.4)",
    glowColor: "rgba(2, 132, 199, 0.32)",
    tagBg: "rgba(2, 132, 199, 0.16)",
    tagColor: "#38bdf8",
    metrics: [
      { value: "1st", label: "Digitalised CBO in SL" },
      { value: "92%", label: "Faster Billing Cycle" },
      { value: "100%", label: "Paperless Ledger" },
    ],
  },
  {
    id: "lessons2drive",
    number: "02",
    category: "Marketplace",
    domain: "Full Stack",
    year: "2026",
    role: "Full Stack Lead Architect",
    status: "LIVE PRODUCTION",
    title: "Lessons2Drive",
    shortDescription:
      "A dual-sided driving lesson marketplace connecting learners with certified instructors, featuring conflict-aware scheduling locks, automated credit bundles, and escrow Stripe payouts.",
    description:
      "A dual-sided driving lesson marketplace connecting learners with certified instructors, featuring conflict-aware scheduling locks, automated credit bundles, and escrow Stripe payouts.",
    problem:
      "Manual scheduling between freelance driving instructors and students led to calendar collisions, double-bookings under peak load, and delayed instructor payouts.",
    solution:
      "Built a unified dual-sided marketplace with atomic PostgreSQL row-level slot locking, automated lesson credit allocation, and instant Stripe Connect escrow payouts.",
    architecture:
      "Next.js App Router frontend, Express.js microservice API, PostgreSQL with Prisma ORM transactional row-locks, and Redis session & availability caching.",
    highlights: [
      "Atomic conditional slot allocation guaranteeing zero double-booking under load",
      "Stripe Connect integration automating escrow releases upon lesson completion",
      "Interactive multi-step learner onboarding wizard with strict runtime validation",
      "Real-time SMS and email dispatch via webhooks and BullMQ background queues",
    ],
    architectureNodes: [
      { layer: "Client App", tech: "Next.js + TypeScript", detail: "Role-based learner & instructor portals" },
      { layer: "Booking Engine", tech: "Express + Prisma", detail: "Serializable row locks & conflict detection" },
      { layer: "Payments & Queue", tech: "Stripe Connect + BullMQ", detail: "Escrow split payouts & SMS reminders" },
      { layer: "Data Store", tech: "PostgreSQL + Redis", detail: "ACID calendar ledger & <60ms slot cache" },
    ],
    technologies: ["Next.js", "TypeScript", "Express", "PostgreSQL", "Prisma", "Stripe"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: lessons2DriveImg,
    demoUrl: "https://lessons2drive.dinidu.dev",
    accentColor: "#38bdf8",
    cardBg: "linear-gradient(145deg, #0d1526 0%, #070a12 100%)",
    borderColor: "rgba(56, 189, 248, 0.32)",
    glowColor: "rgba(56, 189, 248, 0.26)",
    tagBg: "rgba(56, 189, 248, 0.14)",
    tagColor: "#7dd3fc",
    metrics: [
      { value: "0", label: "Booking Conflicts" },
      { value: "+42%", label: "Instructor Utilization" },
      { value: "<60ms", label: "Availability Latency" },
    ],
  },
  {
    id: "nexus",
    number: "03",
    category: "FinTech",
    domain: "Full Stack",
    year: "2025",
    role: "Distributed Systems Architect",
    status: "ACTIVE CLUSTER",
    title: "Nexus Stream Hub",
    shortDescription:
      "An event-driven collaborative financial telemetry platform with binary WebSocket streaming, sub-40ms event fanouts, and client-side optimistic ledger mutations.",
    description:
      "An event-driven collaborative financial telemetry platform with binary WebSocket streaming, sub-40ms event fanouts, and client-side optimistic ledger mutations.",
    problem:
      "Distributed financial analysts experienced stale ledger synchronizations and UI freezes during high-frequency multi-user market telemetry spikes.",
    solution:
      "Architected an event-sourcing engine utilizing Redis Pub/Sub streams, binary WebSocket frames, and deterministic client-side optimistic reconciliation.",
    architecture:
      "Stateless Node.js cluster gateways, Redis Pub/Sub message broker, range-partitioned PostgreSQL ledger tables, and React 19 concurrent rendering.",
    highlights: [
      "Optimistic reconciliation engine eliminating UI latency during high-frequency mutations",
      "Redis Pub/Sub message broker delivering sub-40ms event fanouts across 8 cluster nodes",
      "End-to-end type safety using TypeScript, Zod validators, and binary payload schemas",
      "Automatic WebSocket heartbeat monitoring with seamless zero-data-loss reconnects",
    ],
    architectureNodes: [
      { layer: "Realtime Client", tech: "React 19 + WebSockets", detail: "Binary frame decoding & 60fps canvas" },
      { layer: "Stream Gateway", tech: "Node.js Cluster", detail: "Stateful socket multiplexing & backpressure" },
      { layer: "Event Broker", tech: "Redis Pub/Sub Streams", detail: "50k+ events/sec fanout in <40ms" },
      { layer: "Ledger Store", tech: "Partitioned PostgreSQL", detail: "Append-only time-series trade storage" },
    ],
    technologies: ["React", "TypeScript", "Node.js", "Redis", "PostgreSQL", "Docker"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: nexusStreamImg,
    demoUrl: "https://nexus.dinidu.dev",
    accentColor: "#818cf8",
    cardBg: "linear-gradient(145deg, #101328 0%, #070913 100%)",
    borderColor: "rgba(129, 140, 248, 0.32)",
    glowColor: "rgba(129, 140, 248, 0.28)",
    tagBg: "rgba(129, 140, 248, 0.14)",
    tagColor: "#c7d2fe",
    metrics: [
      { value: "<40ms", label: "WebSocket Roundtrip" },
      { value: "50k+", label: "Events Streamed / Sec" },
      { value: "99.99%", label: "Uptime SLA" },
    ],
  },
  {
    id: "ceylon",
    number: "04",
    category: "Travel GPS",
    domain: "Cloud & Backend",
    year: "2025",
    role: "Backend & Geo-Spatial Architect",
    status: "LIVE PRODUCTION",
    title: "Ceylon Trails",
    shortDescription:
      "An offline-first expedition & reservation platform for Sri Lanka’s mountain peaks, combining R-Tree spatial indexing, real-time GPS waypoint telemetry, and PWA background sync.",
    description:
      "An offline-first expedition companion and distributed booking engine for Sri Lanka’s highest peaks, providing real-time GPS waypoint telemetry, dynamic elevation profiles, and conflict-free guide reservations.",
    problem:
      "High rates of guide double-booking and loss of navigation connectivity across remote mountain trails with zero cellular coverage.",
    solution:
      "Engineered a Spring Boot spatial API with pessimistic write locks on expedition slots, MySQL R-Tree spatial indexing, and an offline-first IndexedDB PWA client.",
    architecture:
      "Spring Boot 3 REST API with JWT security, MySQL spatial geometry indices, Redis geo-caching, and a React + Leaflet offline-capable Progressive Web App.",
    highlights: [
      "100% offline trail navigation using service workers and IndexedDB vector tile caching",
      "MySQL R-Tree spatial queries calculating multi-peak radius proximity within 35ms",
      "Pessimistic database write locks preventing guide reservation collisions under load",
      "Interactive elevation profile scrubbing with live GPS coordinate telemetry",
    ],
    architectureNodes: [
      { layer: "Offline PWA", tech: "React + IndexedDB", detail: "Cached vector tiles & GPS waypoint sync" },
      { layer: "Core API", tech: "Spring Boot 3 (Java 21)", detail: "RESTful controllers & JWT security chain" },
      { layer: "Geo Engine", tech: "MySQL R-Tree Spatial", detail: "<35ms coordinate radius & elevation queries" },
      { layer: "Cache Layer", tech: "Redis Geo-Hash", detail: "Real-time trail weather & guide locks" },
    ],
    technologies: ["Spring Boot", "Java 21", "React", "TypeScript", "MySQL", "Redis"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: ceylonTrailsImg,
    demoUrl: "https://trails.dinidu.dev",
    accentColor: "#a855f7",
    cardBg: "linear-gradient(145deg, #131026 0%, #080711 100%)",
    borderColor: "rgba(168, 85, 247, 0.32)",
    glowColor: "rgba(168, 85, 247, 0.28)",
    tagBg: "rgba(168, 85, 247, 0.14)",
    tagColor: "#e9d5ff",
    metrics: [
      { value: "100%", label: "Offline Operational" },
      { value: "<35ms", label: "Geo-Spatial Query" },
      { value: "4.9/5", label: "Hiker Reliability Score" },
    ],
  },
  {
    id: "sentinel",
    number: "05",
    category: "Cloud Ops",
    domain: "Cloud & Backend",
    year: "2026",
    role: "Infrastructure & Systems Architect",
    status: "ENTERPRISE SLA",
    title: "CloudSentinel AI",
    shortDescription:
      "Autonomous multi-cluster Kubernetes observability daemon streaming eBPF kernel telemetry, predicting memory leaks, and orchestrating instant self-healing failovers.",
    description:
      "Autonomous multi-cluster Kubernetes observability daemon streaming eBPF kernel telemetry, predicting memory leaks, and orchestrating instant self-healing failovers.",
    problem:
      "Traditional userspace APM agents imposed heavy CPU overhead and failed to isolate intermittent kernel socket leaks across multi-tenant Kubernetes clusters.",
    solution:
      "Implemented lightweight eBPF kernel probes in Go, bypassing userspace overhead to stream high-resolution socket lifecycle events directly to Prometheus and automated failover controllers.",
    architecture:
      "Go eBPF DaemonSet deployed per Kubernetes node, kernel RingBuffer telemetry ingestion, Prometheus time-series aggregation, and a React live topology console.",
    highlights: [
      "Zero-instrumentation eBPF kernel telemetry running with sub-1% CPU utilization overhead",
      "Automated node cordon and pod drain triggers executing within 12ms of anomaly detection",
      "Predictive memory-leak alerting 20 minutes prior to container OOM termination",
      "Real-time 48-node cluster topology health visualization with live packet throughput",
    ],
    architectureNodes: [
      { layer: "Kernel Probes", tech: "eBPF + C / Go", detail: "Zero-overhead socket & syscall ringbuffers" },
      { layer: "Node DaemonSet", tech: "Go Kubernetes Operator", detail: "Autonomous pod cordon & failover controller" },
      { layer: "Metrics Engine", tech: "Prometheus + Kafka", detail: "2.4M kernel spans/min ingestion pipeline" },
      { layer: "Control Plane", tech: "React + Grafana SDK", detail: "Live cluster topology & anomaly simulator" },
    ],
    technologies: ["Go", "Kubernetes", "eBPF", "Prometheus", "Grafana", "React"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: sentinelImg,
    demoUrl: "https://sentinel.dinidu.dev",
    accentColor: "#6366f1",
    cardBg: "linear-gradient(145deg, #0e1229 0%, #060915 100%)",
    borderColor: "rgba(99, 102, 241, 0.32)",
    glowColor: "rgba(99, 102, 241, 0.28)",
    tagBg: "rgba(99, 102, 241, 0.14)",
    tagColor: "#a5b4fc",
    metrics: [
      { value: "99.999%", label: "Cluster Uptime SLA" },
      { value: "<12ms", label: "Anomaly Detect TTFD" },
      { value: "2.4M", label: "Kernel Spans / Min" },
    ],
  },
  {
    id: "omnistream",
    number: "06",
    category: "AI Video",
    domain: "AI & Media",
    year: "2026",
    role: "AI & Multimedia Systems Engineer",
    status: "ACTIVE CLUSTER",
    title: "OmniStream AI",
    shortDescription:
      "Distributed neural video generation & frame-interpolation cluster, delivering 8K multi-track video synthesis and low-latency edge HLS streaming.",
    description:
      "Distributed neural video generation & frame-interpolation cluster, delivering 8K multi-track video synthesis and low-latency edge HLS streaming.",
    problem:
      "High-resolution neural video synthesis pipelines suffered from temporal flickering and GPU memory bottlenecks when rendering concurrent multi-clip timelines.",
    solution:
      "Engineered an asynchronous chunked video render queue with Redis and PyTorch FlowNet optical flow models, distributing frame synthesis across heterogeneous GPU worker nodes.",
    architecture:
      "FastAPI orchestration coordinator, PyTorch GPU worker clusters, Redis stream queues, hardware-accelerated FFmpeg NVENC transcoders, and a Next.js WebGL timeline studio.",
    highlights: [
      "Distributed chunked frame rendering with deterministic temporal coherence locks",
      "Hardware-accelerated FFmpeg NVENC pipeline streaming 4K/8K HLS segments in real time",
      "Interactive multi-track web timeline with live FPS interpolation (24 / 60 / 120 FPS)",
      "Automated GPU worker autoscaling with idempotent webhook job recovery",
    ],
    architectureNodes: [
      { layer: "Studio Client", tech: "Next.js + WebGL Canvas", detail: "Multi-track timeline & waveform scrubbing" },
      { layer: "Orchestrator", tech: "FastAPI + Redis Streams", detail: "Chunked frame job scheduling & webhooks" },
      { layer: "Neural Cluster", tech: "PyTorch + FlowNet v4", detail: "Optical-flow 120fps interpolation & upscale" },
      { layer: "Media Edge", tech: "FFmpeg NVENC + HLS", detail: "3.8x faster hardware transcode & delivery" },
    ],
    technologies: ["Python", "PyTorch", "FastAPI", "Next.js", "Redis", "FFmpeg"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: omnistreamImg,
    demoUrl: "https://omnistream.dinidu.dev",
    accentColor: "#c084fc",
    cardBg: "linear-gradient(145deg, #150e28 0%, #090612 100%)",
    borderColor: "rgba(192, 132, 252, 0.32)",
    glowColor: "rgba(192, 132, 252, 0.28)",
    tagBg: "rgba(192, 132, 252, 0.14)",
    tagColor: "#f3e8ff",
    metrics: [
      { value: "120 FPS", label: "Frame Synthesis Rate" },
      { value: "3.8x", label: "Faster Transcode Speed" },
      { value: "4K 60", label: "Edge Stream Fidelity" },
    ],
  },
  {
    id: "pulse",
    number: "07",
    category: "Crypto Ledger",
    domain: "Cloud & Backend",
    year: "2026",
    role: "Lead Systems Architect",
    status: "ENTERPRISE SLA",
    title: "Pulse Ledger Core",
    shortDescription:
      "Ultra-low latency algorithmic transaction ledger engine in Rust with SHA-256 cryptographic verification chaining, Raft consensus locks, and real-time audit telemetry.",
    description:
      "Ultra-low latency algorithmic transaction ledger engine with SHA-256 cryptographic verification chaining, atomic distributed locks, and real-time reconciliation telemetry.",
    problem:
      "High-frequency settlement services suffered from database row contention and state drift during cross-region transactional reconciliation peaks.",
    solution:
      "Engineered a zero-allocation Rust ledger service utilizing append-only SHA-256 state chains and Raft distributed consensus for deterministic state mutation.",
    architecture:
      "Rust microservices compiled on the Tokio async runtime, Kafka partitioned log groups, PostgreSQL durable cold storage, and a TypeScript real-time block audit explorer.",
    highlights: [
      "Append-only cryptographic SHA-256 hash chain guaranteeing immutable audit verification",
      "Sub-millisecond write latencies sustaining 120,000+ verified transactions per second",
      "Zero-contention memory-mapped ring buffers with deterministic Raft leader election",
      "Real-time transaction anomaly detector flagging duplicate settlement nonce attempts",
    ],
    architectureNodes: [
      { layer: "Audit Explorer", tech: "TypeScript + React", detail: "Real-time cryptographic block & hash verifier" },
      { layer: "Consensus Core", tech: "Rust + Tokio Runtime", detail: "Zero-allocation Raft state machine" },
      { layer: "Event Log", tech: "Apache Kafka Partitions", detail: "120k tx/sec ordered settlement streaming" },
      { layer: "Cold Ledger", tech: "PostgreSQL + SHA-256", detail: "Immutable merkle-tree audit persistence" },
    ],
    technologies: ["Rust", "TypeScript", "PostgreSQL", "Kafka", "Docker", "Tailwind"],
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
    screenshot: pulseImg,
    demoUrl: "https://pulse.dinidu.dev",
    accentColor: "#06b6d4",
    cardBg: "linear-gradient(145deg, #0b1626 0%, #060b14 100%)",
    borderColor: "rgba(6, 182, 212, 0.32)",
    glowColor: "rgba(6, 182, 212, 0.28)",
    tagBg: "rgba(6, 182, 212, 0.14)",
    tagColor: "#67e8f9",
    metrics: [
      { value: "0.00ms", label: "Double-Spend Variance" },
      { value: "120k", label: "Transactions / Sec" },
      { value: "100%", label: "Cryptographic Audit" },
    ],
  },
];
