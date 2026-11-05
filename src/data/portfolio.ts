// ─────────────────────────────────────────────────────────────────────────────
// DINIDU SACHINTHA — SENIOR SOFTWARE ENGINEER PORTFOLIO DATA
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Dinidu Sachintha",
  firstName: "Dinidu",
  lastName: "Sachintha",
  role: "Senior Software Engineer",
  titleHeadline: "Software Engineer & Full Stack Architect",
  roles: [
    "Full Stack Engineer",
    "Distributed Systems Architect",
    "Cloud & DevOps Engineer",
    "React & TypeScript Specialist",
  ],
  location: "Colombo, Sri Lanka",
  timezone: "UTC +5:30",
  education: "BSc (Hons) Software Engineering · SLIIT",
  intro:
    "I design and engineer resilient distributed systems, high-throughput APIs, and polished web applications that balance strict performance with exceptional user experience.",
  about:
    "I’m a software engineer who builds systems with scale, clarity, and reliability in mind. My focus spans end-to-end engineering: from relational schema design and event-driven backend microservices to responsive, accessible client interfaces. I believe great software is not just about writing code — it is about problem decomposition, architectural rigor, and shipping solutions that thrive in production.",
  email: "dinidusachintha@gmail.com", // Ready for direct contact
  phone: "+94727839803",
  github: "https://github.com", // Ready to be customized
  linkedin: "https://linkedin.com", // Ready to be customized
  cv: "assets/documents/ADD_YOUR_CV.txt", // CV document link
  music: "assets/music/ambientd-loop.mp3",
  video: "assets/videos/video1.mp4",
  portrait: "assets/images/dinidu-portrait.png",
  available: true,
  status: "Available for high-impact roles & contract engineering",
};

export const stats = [
  { value: "3+", label: "Years Engineering Code", detail: "Full stack & systems" },
  { value: "20+", label: "Production Systems", detail: "Shipped & maintained" },
  { value: "<100ms", label: "Target API Latency", detail: "p95 response time" },
  { value: "99.9%", label: "System Availability", detail: "Uptime focus" },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kind: string;
  category: "Full Stack" | "Cloud & Backend" | "Mobile & Systems";
  year: string;
  summary: string;
  image: string;
  mockupImage?: string;
  accent: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  problem: string;
  solution: string;
  architecture: string;
  highlights: string[];
  role: string;
  liveUrl?: string;
  sourceUrl?: string;
};

export const projects: Project[] = [
  {
    id: "vikasha-ebilling",
    index: "01",
    title: "Vikasha CBO E-Billing",
    kind: "Sri Lanka’s 1st Digitalised CBO Project · NWSDB",
    category: "Full Stack",
    year: "2026",
    summary:
      "Sri Lanka’s 1st Digitalised CBO Project under the National Water Supply and Drainage Board (NWSDB). Developed by AI Desk to replace traditional paper-based water billing with automated meter readings, tiered tariff computing, and instant digital invoicing.",
    image: "assets/images/vikasha-ebilling.jpg",
    mockupImage: "assets/images/vikasha-ebilling.jpg",
    accent: "#0284c7",
    stack: ["REACT", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "TAILWIND CSS", "NWSDB"],
    metrics: [
      { value: "1st", label: "Digitalised CBO in SL" },
      { value: "92%", label: "Faster Billing Cycle" },
      { value: "100%", label: "Paperless Audit Trail" },
    ],
    problem:
      "Traditional community water schemes relied on handwritten index books, manual tariff math, and paper slips prone to rain damage and ledger discrepancies.",
    solution:
      "Architected a dual web management portal and offline-first mobile meter reader that automates water tariff calculations and issues instant digital receipts.",
    architecture:
      "Cloud PostgreSQL backend with role-based CBO tenant isolation, lightweight PWA for mobile field officers, and automated SMS notification gateways.",
    highlights: [
      "Sri Lanka’s 1st Digitalised CBO Project officially operating under NWSDB",
      "Automated tiered water tariff calculation engine eliminating human arithmetic error",
      "Offline-capable field meter reading mobile client with Bluetooth receipt printing",
      "Citizen web portal for real-time bill inquiry, consumption analytics, and receipts",
    ],
    role: "Founder & Web Developer (AI Desk)",
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
  },
  {
    id: "lessons2drive",
    index: "02",
    title: "Lessons2Drive",
    kind: "Driving Lesson Marketplace & Logistics",
    category: "Full Stack",
    year: "2026",
    summary:
      "A comprehensive driving lesson marketplace connecting learners and instructors through a unified role based system. The Next.js frontend delivers seamless booking flows, while the Express backend strictly enforces conflict aware scheduling, credit bundles, and Stripe payouts.",
    image: "assets/images/project-pulse.svg",
    mockupImage: "assets/images/mockup-lessons2drive.jpg",
    accent: "#10b981",
    stack: ["NEXT.JS", "TYPESCRIPT", "EXPRESS", "POSTGRESQL", "PRISMA", "STRIPE"],
    metrics: [
      { value: "0", label: "Booking Conflicts" },
      { value: "+42%", label: "Instructor Utilization" },
      { value: "<60ms", label: "Slot Availability API" },
    ],
    problem:
      "Manual scheduling between freelance driving instructors and students led to calendar collisions, payment delays, and student churn.",
    solution:
      "Built a unified dual-sided marketplace with real-time slot locking, automated lesson credit allocation, and instant Stripe escrow payouts.",
    architecture:
      "Next.js App Router frontend, Express.js microservice API, PostgreSQL with Prisma ORM transactional row-locks, and Redis session caching.",
    highlights: [
      "Atomic conditional slot allocation guaranteeing zero double-booking under load",
      "Stripe Connect integration automating escrow releases upon instructor completion",
      "Interactive multi-step learner onboarding wizard with responsive step validation",
      "Real-time SMS and email dispatch via Webhooks and BullMQ background queues",
    ],
    role: "Full Stack Lead Architect",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
  },
  {
    id: "nexus",
    index: "03",
    title: "Nexus Stream Hub",
    kind: "FinTech · Real-Time Collaboration Core",
    category: "Full Stack",
    year: "2025",
    summary:
      "An event-driven collaborative workspace platform featuring real-time financial telemetry, optimistic state mutations, and resilient transaction processing.",
    image: "assets/images/project-beyond.svg",
    mockupImage: "assets/images/mockup-nexus.jpg",
    accent: "#00f2fe",
    stack: ["REACT", "TYPESCRIPT", "NODE.JS", "REDIS", "POSTGRESQL", "DOCKER"],
    metrics: [
      { value: "<40ms", label: "WebSocket Roundtrip" },
      { value: "50k+", label: "Events Streamed / Sec" },
      { value: "99.99%", label: "Uptime Reliability" },
    ],
    problem:
      "Distributed financial analysts experienced stale ledger synchronizations and race conditions during simultaneous multi-user ledger edits.",
    solution:
      "Architected an event sourcing engine utilizing Redis Pub/Sub, binary WebSocket streaming, and client-side optimistic reconciliation.",
    architecture:
      "Stateless Node.js microservices with Redis cluster caching, partitioned PostgreSQL ledger tables, and automated schema migrations.",
    highlights: [
      "Optimistic reconciliation engine eliminating UI latency during high frequency mutations",
      "Redis Pub/Sub message broker delivering sub-40ms event fanouts across clusters",
      "End-to-end type safety using TypeScript, Zod validators, and OpenAPI schemas",
    ],
    role: "Distributed Systems Architect",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
  },
  {
    id: "ceylon",
    index: "04",
    title: "Ceylon Trails Engine",
    kind: "Distributed Travel Booking API",
    category: "Cloud & Backend",
    year: "2024",
    summary:
      "A distributed travel reservation engine with geospatial tour discovery, multi-tier seat allocation algorithms, and real-time operator notification dispatch.",
    image: "assets/images/project-ceylon.svg",
    mockupImage: "assets/images/mockup-ceylon.jpg",
    accent: "#f59e0b",
    stack: ["SPRING BOOT", "JAVA 21", "MYSQL", "REDIS", "MAPBOX GL", "DOCKER"],
    metrics: [
      { value: "18+", label: "Microservice Endpoints" },
      { value: "88%", label: "Automated Test Coverage" },
      { value: "<35ms", label: "Geo-Spatial Query Time" },
    ],
    problem:
      "High rates of double-booking and slow geographical coordinate search across thousands of tourist experiences and guide schedules.",
    solution:
      "Built a robust Spring Boot service with pessimistic write locks on slot reservations, MySQL spatial indexing (R-Tree), and an intuitive Mapbox web client.",
    architecture:
      "Spring Boot 3 REST API with layered architecture (Controller, Service, Repository), Spring Security with JWT tokens, and Dockerized deploy.",
    highlights: [
      "Pessimistic database locking guaranteeing zero reservation collision under concurrency",
      "MySQL spatial queries calculating radius distance within 35ms",
      "Interactive map clustering rendering 500+ locations smoothly at 60fps",
    ],
    role: "Backend Architect",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
  },
  {
    id: "sentinel",
    index: "05",
    title: "CloudSentinel AI",
    kind: "Cloud Infrastructure & eBPF Telemetry",
    category: "Cloud & Backend",
    year: "2026",
    summary:
      "An autonomous Kubernetes observability daemon capturing kernel-level socket traces with eBPF probes, predicting memory leak anomalies, and orchestrating instant self-healing failovers.",
    image: "assets/images/mockup-sentinel.jpg",
    mockupImage: "assets/images/mockup-sentinel.jpg",
    accent: "#6366f1",
    stack: ["GO", "KUBERNETES", "EBPF", "PROMETHEUS", "GRAFANA", "REACT"],
    metrics: [
      { value: "99.999%", label: "Cluster Uptime SLA" },
      { value: "<12ms", label: "Anomaly Detect TTFD" },
      { value: "2.4M", label: "Kernel Spans / Min" },
    ],
    problem:
      "Traditional APM agents imposed significant CPU overhead and struggled to isolate intermittent socket memory leaks in multi-tenant Kubernetes clusters.",
    solution:
      "Implemented lightweight eBPF kernel probes in Go, bypassing userspace overhead to stream high-resolution socket lifecycle events directly to Prometheus.",
    architecture:
      "Go eBPF daemonset deployed per cluster node, RingBuffer telemetry ingestion, Kafka pipeline, and React real-time health canvas.",
    highlights: [
      "eBPF kernel telemetry running with sub-1% CPU and memory utilization overhead",
      "Real-time cluster topology graphing with automatic node cordon and pod reschedule triggers",
      "Predictive memory leak alerts triggered 20 minutes before threshold OOM kills",
    ],
    role: "Infrastructure & Systems Architect",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
  },
  {
    id: "omnistream",
    index: "06",
    title: "OmniStream AI",
    kind: "AI Video Synthesis & Edge CDN",
    category: "Full Stack",
    year: "2026",
    summary:
      "A distributed neural video generation pipeline orchestrating GPU worker clusters for automated 8K frame synthesis, frame-interpolation telemetry, and low-latency edge HLS streaming.",
    image: "assets/images/mockup-omnistream.jpg",
    mockupImage: "assets/images/mockup-omnistream.jpg",
    accent: "#f43f5e",
    stack: ["PYTHON", "PYTORCH", "FASTAPI", "NEXT.JS", "REDIS", "FFMPEG"],
    metrics: [
      { value: "120 FPS", label: "Frame Synthesis Rate" },
      { value: "3.8x", label: "Faster Transcode Speed" },
      { value: "4K 60", label: "Edge Stream Fidelity" },
    ],
    problem:
      "High-resolution video synthesis pipelines suffered from slow frame interpolation and bottlenecked GPU memory when processing concurrent multi-clip requests.",
    solution:
      "Engineered an asynchronous chunked video queue with Redis and PyTorch FlowNet models, distributing frame-rendering tasks across heterogeneous worker nodes.",
    architecture:
      "FastAPI coordinator, PyTorch GPU cluster nodes, Redis task queue, Next.js real-time editor with HTML5 Canvas timeline and WebSockets.",
    highlights: [
      "Distributed chunked frame rendering with sub-frame time synchronization",
      "Hardware-accelerated FFmpeg transcode pipeline streaming HLS segments in sub-2 seconds",
      "Interactive multi-track web editor with audio waveform alignment and real-time color grading",
    ],
    role: "AI & Multimedia Systems Engineer",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
  },
  {
    id: "pulse",
    index: "07",
    title: "Pulse Ledger Core",
    kind: "FinTech & Cryptographic Verification",
    category: "Cloud & Backend",
    year: "2026",
    summary:
      "Ultra-low latency algorithmic transaction ledger engine with SHA-256 cryptographic verification chaining, atomic distributed locks, and real-time reconciliation telemetry.",
    image: "assets/images/mockup-pulse.jpg",
    mockupImage: "assets/images/mockup-pulse.jpg",
    accent: "#06b6d4",
    stack: ["RUST", "TYPESCRIPT", "POSTGRESQL", "KAFKA", "DOCKER", "TAILWIND CSS"],
    metrics: [
      { value: "0.00ms", label: "Double-Spend Variance" },
      { value: "120k", label: "Transactions / Sec" },
      { value: "100%", label: "Cryptographic Audit" },
    ],
    problem:
      "High-frequency settlement services suffered from database row contention and state drift during cross-region transactional reconciliation peaks.",
    solution:
      "Engineered a zero-allocation Rust ledger service utilizing append-only SHA-256 state chains and Raft distributed consensus for deterministic state mutation.",
    architecture:
      "Rust microservices compiled with tokio runtime, Kafka partition groups, PostgreSQL for durable cold storage, and Next.js audit explorer.",
    highlights: [
      "Append-only cryptographic hash chain guaranteeing immutable audit trail verification",
      "Sub-millisecond write latencies at 120,000 sustained transactions per second",
      "Real-time transaction anomaly detector flagging duplicate settlement nonce attempts",
    ],
    role: "Lead Systems Architect",
    liveUrl: "https://github.com",
    sourceUrl: "https://github.com",
  },
  {
    id: "e-wedding-rsvp",
    index: "08",
    title: "E-Wedding RSVP Invitation",
    kind: "Client Project · Digital Wedding Experience",
    category: "Full Stack",
    year: "2026",
    summary:
      "A premium digital wedding invitation website designed for Gimasha & Chathura, delivering an elegant, interactive wedding experience with cinematic visuals, romantic animations, and seamless guest interaction.",
    image: "assets/images/e-wedding-rsvp.jpg",
    mockupImage: "assets/images/e-wedding-rsvp.jpg",
    accent: "#849b5c",
    stack: ["REACT", "TYPESCRIPT", "TAILWIND CSS", "FRAMER MOTION"],
    metrics: [
      { value: "100%", label: "Mobile Responsive" },
      { value: "Live", label: "Interactive RSVP" },
      { value: "60 FPS", label: "Cinematic Animations" },
    ],
    problem:
      "Traditional paper wedding invitations are static, lack real-time RSVP tracking, cannot provide dynamic countdowns or interactive venue maps, and are easily lost or misplaced by wedding guests.",
    solution:
      "Engineered a luxury digital wedding invitation platform featuring an interactive online RSVP system, live countdown timer, cinematic cover screen, animated flower petals, and Google Maps venue integration.",
    architecture:
      "Modern React & TypeScript architecture styled with Tailwind CSS, utilizing Framer Motion for cinematic physics-based animations, fluid scroll-driven transitions, and real-time guest RSVP state handling.",
    highlights: [
      "Interactive online RSVP with instant guest attendance confirmation & response tracking",
      "Live wedding countdown timer synchronizing event milestones in real time",
      "Cinematic wedding cover screen with romantic ambient visuals and audio controls",
      "Animated flower petals with fluid physics and silky smooth scroll navigation",
      "Wedding story and ceremony details with Google Maps location integration",
      "Fully responsive mobile and desktop experience with premium olive-green and gold theme",
    ],
    role: "Lead Frontend & Creative Engineer",
    liveUrl: "https://github.com/dinidu",
    sourceUrl: "https://github.com/dinidu",
  },
  {
    id: "spicy-selling-site",
    index: "09",
    title: "Spicy Selling Site",
    kind: "03 · E-Commerce · Modern Spice Shopping Experience",
    category: "Full Stack",
    year: "2026",
    summary:
      "A modern, responsive e-commerce website designed to showcase and sell premium spices through an engaging digital shopping experience. Focused on intuitive navigation, attractive product presentation, smooth interactions, and mobile-friendly design.",
    image: "assets/images/spicy-selling-site.jpg",
    mockupImage: "assets/images/spicy-selling-site.jpg",
    accent: "#f97316",
    stack: ["REACT", "JAVASCRIPT", "TAILWIND CSS", "HTML5", "CSS3"],
    metrics: [
      { value: "100%", label: "Ceylon Quality" },
      { value: "<0.1s", label: "Cart Update Latency" },
      { value: "Mobile", label: "First Responsive UI" },
    ],
    problem:
      "Traditional specialty spice stores struggle with outdated online storefronts that fail to convey rich product freshness, provide clear culinary pairing guides, or deliver smooth mobile cart checkouts.",
    solution:
      "Engineered a sleek, responsive e-commerce web platform with categorized spice showcases, detailed product pricing and heat levels, dynamic cart state management, and an engaging Ceylon Reds brand identity.",
    architecture:
      "Modular React component hierarchy utilizing Tailwind CSS for utility-driven responsive design, structured client-side product catalogues, dynamic shopping cart drawer state, and fluid UI micro-interactions.",
    highlights: [
      "Interactive spice product catalogue showcasing Ceylon Reds premium seasonings",
      "Detailed product cards with pricing, heat indicators, and single-click cart addition",
      "Organized category browsing for chili blends, whole spices, and gourmet sauces",
      "Reactive shopping cart state management with real-time badge updates and item counts",
      "Responsive mobile-first storefront optimized for fast browsing across all screen sizes",
      "Smooth animations, newsletter subscription modal, and warm chili-orange aesthetic",
    ],
    role: "Web Developer · E-Commerce",
    liveUrl: "https://github.com/dinidusachintha/spicy-selling-site",
    sourceUrl: "https://github.com/dinidusachintha/spicy-selling-site",
  },
];

export const skillPillars = [
  {
    id: "frontend",
    title: "Frontend & Client Systems",
    icon: "Layout",
    badge: "CLIENT ARCHITECTURE",
    description: "Crafting accessible, high-performance interfaces with responsive motion and strict type safety.",
    skills: [
      { name: "React & Next.js", level: "Expert", desc: "App Router, SSR, ISR, Server Actions, State Machines" },
      { name: "TypeScript", level: "Expert", desc: "Advanced Generics, Strict Type Safety, AST Transforms" },
      { name: "State Architecture", level: "Advanced", desc: "Zustand, Redux Toolkit, TanStack Query, Optimistic UI" },
      { name: "CSS & Motion", level: "Advanced", desc: "Tailwind CSS, CSS Grid/Flexbox, Lenis Smooth Scroll" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Distributed Services",
    icon: "Server",
    badge: "SERVER-SIDE SYSTEMS",
    description: "Designing resilient APIs, background worker queues, and event-driven microservices.",
    skills: [
      { name: "Node.js & Express", level: "Expert", desc: "Async I/O, REST APIs, Microservices, Worker Threads" },
      { name: "Java & Spring Boot", level: "Advanced", desc: "Spring Security, JPA/Hibernate, Multi-threading, MVC" },
      { name: "API & Protocols", level: "Expert", desc: "RESTful Standards, GraphQL, WebSockets, gRPC Basics" },
      { name: "Auth & Security", level: "Advanced", desc: "JWT Rotation, OAuth2, RBAC, Rate Limiting, OWASP" },
    ],
  },
  {
    id: "databases",
    title: "Databases & Data Modeling",
    icon: "Database",
    badge: "DATA ARCHITECTURE",
    description: "Designing normalized schemas, cache invalidation strategies, and indexing for low-latency queries.",
    skills: [
      { name: "PostgreSQL", level: "Advanced", desc: "Schema Design, Partitioning, Index Tuning, ACID Transactions" },
      { name: "MongoDB", level: "Advanced", desc: "Aggregation Pipelines, Document Modeling, Sharding" },
      { name: "Redis", level: "Advanced", desc: "In-memory Caching, Pub/Sub, Session Management, Rate Limits" },
      { name: "MySQL & SQLite", level: "Advanced", desc: "Relational Modeling, Local-first Sync, Constraints" },
    ],
  },
  {
    id: "devops",
    title: "Cloud, DevOps & Tooling",
    icon: "Cloud",
    badge: "INFRASTRUCTURE & OPS",
    description: "Automating builds, containerizing environments, and ensuring zero-downtime production deployments.",
    skills: [
      { name: "Docker & Containers", level: "Advanced", desc: "Multi-stage Builds, Compose, Container Optimization" },
      { name: "AWS Cloud Services", level: "Intermediate", desc: "S3, EC2, Lambda, CloudFront, Route53" },
      { name: "CI / CD Automation", level: "Advanced", desc: "GitHub Actions, Automated Testing, Preview Deploys" },
      { name: "Linux & Networking", level: "Advanced", desc: "Shell Scripting, Nginx Reverse Proxy, SSH, DNS" },
    ],
  },
];

export const techMarquee = [
  "TypeScript",
  "React 19",
  "Next.js",
  "Node.js",
  "Spring Boot",
  "Java",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
  "Redis",
  "Tailwind CSS",
  "GraphQL",
  "WebSockets",
  "Git & GitHub Actions",
  "REST APIs",
  "Jest / Vitest",
];

export const principles = [
  {
    number: "01",
    tag: "REQUIREMENTS & RFC",
    title: "Decompose Ambiguity First",
    summary:
      "Clarify constraints, data models, and edge cases before touching the keyboard. The most maintainable code is the code you prevent from needing to exist.",
    snippet: "// Phase 01: System RFC\ntype SystemSpec = {\n  sla: '99.9% Uptime';\n  p95Latency: '<100ms';\n  idempotency: true;\n};",
  },
  {
    number: "02",
    tag: "ARCHITECTURE & CONTRACTS",
    title: "Design for Scalability & Resilience",
    summary:
      "Model domain boundaries, establish clear API contracts with TypeScript/OpenAPI, and select dependable patterns over fleeting trends.",
    snippet: "// Phase 02: Typed Contracts\ninterface ServiceResponse<T> {\n  data: T;\n  traceId: string;\n  status: 'SUCCESS' | 'RETRY';\n}",
  },
  {
    number: "03",
    tag: "ENGINEERING & TESTS",
    title: "Write Clean, Testable Code",
    summary:
      "Implement idiomatic patterns, strict static typing, and automated unit/integration tests to guarantee software that teammates love reviewing.",
    snippet: "// Phase 03: Test-Driven Integrity\ndescribe('TransactionProcessor', () => {\n  it('prevents race conditions under load');\n});",
  },
  {
    number: "04",
    tag: "OBSERVABILITY & CI/CD",
    title: "Automate, Deploy & Monitor",
    summary:
      "Continuous integration with automated test suites, containerized deployments, and structured logging to maintain high production availability.",
    snippet: "// Phase 04: Production Pipeline\nawait deploy({ canary: true });\nmonitor({ alerts: 'real-time' });",
  },
];

export const experience = [
  {
    period: "2024 — PRESENT",
    role: "Software Engineer",
    company: "Freelance & Solutions Engineering",
    type: "Contract / Independent",
    description:
      "Architecting and shipping end-to-end full stack web platforms, real-time dashboards, and custom backend systems for global clients and startups.",
    achievements: [
      "Engineered full stack applications using React, Next.js, Node.js, and PostgreSQL with sub-100ms API response targets",
      "Designed decoupled database architectures with Redis caching, reducing server load by up to 60%",
      "Implemented automated CI/CD pipelines with GitHub Actions and Docker containerization",
    ],
    tech: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
  },
  {
    period: "2024 June — 2024 present",
    role: "Full Stack Developer Intern",
    company: "Waterboard CBO Project",
    type: "Internship",
    description:
      "Collaborated in an agile engineering squad building enterprise microservices and user interfaces, participating in sprint reviews and design audits.",
    achievements: [
      "Built RESTful microservice endpoints in Spring Boot with comprehensive JUnit integration tests",
      "Refactored legacy React frontend components into modern modular hooks, improving performance metrics",
      "Optimized complex SQL queries and indexes, decreasing slow database transactions",
    ],
    tech: ["Java", "Spring Boot", "React", "MySQL", "REST APIs", "Git"],
  },
  {
    period: "2022 — PRESENT",
    role: "BSc (Hons) in Software Engineering",
    company: "SLIIT (Sri Lanka Institute of Information Technology)",
    type: "Undergraduate Degree",
    description:
      "Deep academic coursework covering Data Structures & Algorithms, Object-Oriented Software Engineering, Database Systems, Cloud Computing, and Distributed Architectures.",
    achievements: [
      "Specialized in Software Architecture, Concurrent Programming, and System Design",
      "Led multiple team capstone engineering projects from ideation to production deployment",
      "Active contributor to student developer communities and technical hackathons",
    ],
    tech: ["Data Structures", "Algorithms", "System Design", "OOP", "Networking", "Security"],
  },
];

export const aiVideoSkills = {
  badge: "GENERATIVE MEDIA & AI DIRECTION",
  title: "AI Video & Neural Cinematography",
  subtitle:
    "Merging systems engineering with state-of-the-art diffusion models to architect end-to-end generative media workflows and cinematic synthesis.",
  stats: [
    { value: "60 FPS", label: "Render Consistency" },
    { value: "4K", label: "Neural Upscaling" },
    { value: "ComfyUI", label: "Custom Node Graphs" },
    { value: "<15s", label: "Pipeline Latency" },
  ],
  pillars: [
    {
      id: "diffusion",
      title: "Diffusion & Latent Video Synthesis",
      category: "NODE ARCHITECTURE",
      desc: "Constructing specialized ComfyUI workflows, AnimateDiff motion modules, and Stable Video Diffusion pipelines with custom ControlNet guidance.",
      tools: ["ComfyUI", "Stable Video Diffusion", "AnimateDiff", "CogVideoX"],
      highlight: "Custom frame-interpolation & temporal consistency locks",
    },
    {
      id: "cinematography",
      title: "Generative Camera & Direction",
      category: "AI CINEMATOGRAPHY",
      desc: "Prompt engineering dynamic 3D camera trajectories, orbital tracking, depth mapping, and multi-shot continuity across flagship video models.",
      tools: ["Runway Gen-3 Alpha", "Luma Dream Machine", "Kling AI", "Midjourney v6"],
      highlight: "Photorealistic lighting & optical aberration matching",
    },
    {
      id: "multimodal",
      title: "Synthetic Audio & Voice Direction",
      category: "MULTIMODAL PIPELINES",
      desc: "Integrating zero-shot voice cloning with ElevenLabs, dynamic foley audio synthesis, and beat-matched DAW sound design for immersive storytelling.",
      tools: ["ElevenLabs", "AudioCraft", "Suno", "DaVinci Resolve Studio"],
      highlight: "Lossless dialogue dubbing with emotional inflection",
    },
    {
      id: "automation",
      title: "Cloud GPU & Automation Pipelines",
      category: "ENGINEERING & OPS",
      desc: "Deploying headless generative video workers using Python, FFmpeg transcoding filters, Replicate APIs, and scalable RunPod GPU worker instances.",
      tools: ["Python SDKs", "FFmpeg", "Replicate API", "RunPod Clusters"],
      highlight: "Idempotent batch render dispatch with webhook callbacks",
    },
  ],
  workflowSteps: [
    {
      step: "01",
      title: "Prompt Engineering & Pre-Visualization",
      text: "Crafting technical token prompts, aspect ratios, and seed parameters to establish lighting and art direction.",
    },
    {
      step: "02",
      title: "Latent Diffusion & Keyframe Synthesis",
      text: "Running multi-pass diffusion graphs with depth and motion conditioning to eliminate morphing artifacts.",
    },
    {
      step: "03",
      title: "Neural Upscale & Temporal Smoothing",
      text: "Spatial and temporal enhancement yielding crystal-clear 4K resolution at smooth 60fps frame rates.",
    },
    {
      step: "04",
      title: "Audio Master & Color Grading",
      text: "Synthetic voice generation, sound effects layering, and film LUT color correction for production delivery.",
    },
  ],
};

export type BlogSection = "Company Updates" | "Articles" | "Career Blogs";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  section: BlogSection;
  category: "Company Spotlight" | "Distributed Systems" | "AI & Video Tech" | "Software Architecture" | "Career & Mentorship" | "Engineering Culture";
  date: string;
  readTime: string;
  summary: string;
  image: string;
  badge?: string;
  highlightPill?: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
  };
  content: {
    heading: string;
    paragraphs: string[];
    codeSnippet?: {
      language: string;
      code: string;
    };
    callout?: string;
  }[];
  tags: string[];
};

export interface CompanySpotlight {
  companyName: string;
  founderRole: string;
  headline: string;
  highlightMilestone: string;
  recreatedParagraph: string;
  bulletPoints: string[];
  client: string;
  status: string;
  projectVisual: string;
}

export const companySpotlight: CompanySpotlight = {
  companyName: "AI Desk",
  founderRole: "Founder & Web Developer",
  headline: "AI Desk: Driving Digital Transformation in Sri Lanka",
  highlightMilestone: "Sri Lanka’s 1st Digitalised CBO Project",
  recreatedParagraph:
    "AI Desk is a pioneering technology company founded and engineered by Dinidu Sachintha, focused on architecting innovative software solutions that simplify business operations and accelerate digital transformation across Sri Lanka. One of our landmark milestones is the development of the Vikasha CBO E-Billing System — proudly recognized as Sri Lanka’s 1st Digitalised CBO Project under Sri Lanka’s National Water Supply and Drainage Board (NWSDB). This mission-critical initiative supports the complete transition from traditional paper-based water billing to a seamless, transparent digital process, empowering modern community-based water service management nationwide.",
  bulletPoints: [
    "Sri Lanka’s 1st Digitalised CBO Water Project under NWSDB",
    "Transition from error-prone paper ledgers to real-time cloud invoicing",
    "Integrated mobile field reader app with instant Bluetooth receipt printing",
    "Citizen online payment portal with automated SMS payment confirmations",
  ],
  client: "National Water Supply and Drainage Board (NWSDB)",
  status: "GOVERNMENT PRODUCTION INITIATIVE",
  projectVisual: "assets/images/vikasha-ebilling.jpg",
};

export const blogPosts: BlogPost[] = [
  // SECTION 1: COMPANY UPDATES
  {
    id: "ai-desk-vikasha-ebilling",
    slug: "ai-desk-vikasha-ebilling",
    title: "AI Desk Driving Digital Transformation in Sri Lanka: Sri Lanka’s 1st Digitalised CBO Project",
    section: "Company Updates",
    category: "Company Spotlight",
    date: "OCT 2026",
    readTime: "4 MIN READ",
    featured: true,
    badge: "1ST SRI LANKAN DIGITALISED CBO PROJECT",
    highlightPill: "NWSDB Government Initiative",
    summary:
      "AI Desk is a technology company focused on building innovative software solutions that simplify business operations and accelerate digital transformation. Discover how we built and deployed the Vikasha CBO E-Billing System under Sri Lanka's National Water Supply and Drainage Board.",
    image: "assets/images/vikasha-ebilling.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Founder & Web Developer, AI Desk",
    },
    tags: [
      "AI Desk",
      "Vikasha CBO",
      "NWSDB",
      "Digital Transformation",
      "GovTech",
      "Sri Lanka",
      "E-Billing",
    ],
    content: [
      {
        heading: "1. The Vision of AI Desk",
        paragraphs: [
          "AI Desk is a technology company focused on building innovative software solutions that simplify business operations and accelerate digital transformation. Founded and engineered in Sri Lanka, our mission is to replace manual friction with resilient, human-centered digital infrastructure.",
          "As the Founder and Web Developer at AI Desk, I spearhead our architectural vision and product engineering — bridging modern cloud and web technologies with local public sector needs.",
        ],
        callout:
          "Mission Statement: 'Empowering communities and national institutions through robust, accessible, and automated digital systems.'",
      },
      {
        heading: "2. Landmark Milestone: Sri Lanka’s 1st Digitalised CBO Project",
        paragraphs: [
          "One of our key milestones is the development of the Vikasha CBO E-Billing System, a government digitalisation initiative under Sri Lanka’s National Water Supply and Drainage Board (NWSDB). Proudly standing as Sri Lanka’s 1st Digitalised CBO Project, this system modernizes how Community-Based Organizations operate water services across the island.",
          "For decades, community water schemes relied on handwritten index books, manual tariff arithmetic, and paper slips prone to rain damage and ledger discrepancies. Vikasha transforms this workflow end-to-end with automated meter readings, immediate digital calculation, and instant SMS audit receipts.",
        ],
        callout:
          "Highlight: Sri Lanka’s 1st Digitalised CBO Project — officially modernising community-based water service management in partnership with NWSDB.",
      },
      {
        heading: "3. Architecture & Operational Impact",
        paragraphs: [
          "The Vikasha E-Billing platform combines an intuitive web-based administrative command center for utility executives with a lightweight offline-first mobile client for community meter readers in the field.",
          "Since deployment, the system has eliminated manual billing reconciliation delays by over 92%, while giving thousands of rural water consumers transparent access to their billing history and digital payment methods.",
        ],
        codeSnippet: {
          language: "typescript",
          code: `// Vikasha Billing Engine: Tiered Water Tariff Calculator\nexport function calculateWaterTariff(unitsConsumed: number, schemeCategory: 'DOMESTIC' | 'COMMERCIAL') {\n  const slabs = TARIFF_SLABS[schemeCategory];\n  let totalCharge = FIXED_FACILITY_FEE;\n  \n  for (const slab of slabs) {\n    if (unitsConsumed > slab.minUnits) {\n      const slabUnits = Math.min(unitsConsumed, slab.maxUnits) - slab.minUnits;\n      totalCharge += slabUnits * slab.ratePerUnit;\n    }\n  }\n  return { totalCharge, currency: 'LKR', isSubsidized: schemeCategory === 'DOMESTIC' };\n}`,
        },
      },
      {
        heading: "4. What Lies Ahead for AI Desk",
        paragraphs: [
          "Following the successful rollout of the Vikasha CBO project, AI Desk is expanding its pipeline into AI-driven enterprise tools, IoT telemetry integrations, and automated logistics management across South Asia.",
        ],
      },
    ],
  },
  {
    id: "ai-desk-q4-initiatives",
    slug: "ai-desk-q4-initiatives",
    title: "AI Desk Q4 Roadmap: Scaling Cloud Utility Invoicing & Enterprise Integrations",
    section: "Company Updates",
    category: "Company Spotlight",
    date: "OCT 2026",
    readTime: "3 MIN READ",
    summary:
      "An inside look into AI Desk's expansion plans, community water scheme rollouts, and the engineering behind our high-availability multi-tenant cloud ledger.",
    image: "assets/images/vikasha-ebilling.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Founder & Web Developer, AI Desk",
    },
    tags: ["AI Desk", "Company Roadmap", "Cloud Infrastructure", "Enterprise"],
    content: [
      {
        heading: "1. Multi-Tenant CBO Expansion",
        paragraphs: [
          "Building upon our milestone deployment of the Vikasha CBO E-Billing System, AI Desk is onboarding additional regional community schemes under the National Water Supply and Drainage Board umbrella.",
          "Our engineering team has modularized the billing core into a scalable multi-tenant architecture, allowing new municipal boards to provision isolated tenant spaces in minutes.",
        ],
      },
      {
        heading: "2. Real-Time Telemetry and Automated Alerting",
        paragraphs: [
          "Upcoming releases introduce automated anomaly detection for sudden pipeline leaks and abnormal consumption spikes, safeguarding community water reserves.",
        ],
      },
    ],
  },

  // SECTION 2: ARTICLES (TECHNICAL ENGINEERING)
  {
    id: "sub-100ms-distributed-systems",
    slug: "sub-100ms-distributed-systems",
    title: "Designing Sub-100ms Event-Driven Architectures with Redis & PostgreSQL",
    section: "Articles",
    category: "Distributed Systems",
    date: "OCT 2026",
    readTime: "6 MIN READ",
    summary:
      "A deep dive into building low-latency ingestion engines, avoiding database table contention, and achieving predictable p95 response times under heavy transaction load.",
    image: "assets/images/blog-distributed-systems.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Senior Software Engineer",
    },
    tags: ["Distributed Systems", "PostgreSQL", "Redis", "Event Driven", "Performance"],
    content: [
      {
        heading: "1. The Bottleneck: When Relational Writes Block Everything",
        paragraphs: [
          "In many backend applications, latency degradation begins not in the network, but at the database write boundary. When thousands of concurrent requests attempt synchronous row locks on the same transaction tables, lock contention cascades into thread starvation across your Node.js or Spring Boot workers.",
          "To achieve sub-100ms p95 latency at scale, write paths must be decoupled from heavy analytical calculation. The database must do what it does best: maintain ACID integrity over normalized records, while caching layers absorb the repetitive query burden.",
        ],
        callout:
          "Rule of thumb: Never let an external client request wait synchronously on a background transaction aggregation. Return an optimistic acknowledge token and process downstream.",
      },
      {
        heading: "2. The Event Ingestion Pipeline",
        paragraphs: [
          "By introducing an in-memory queue with Redis streams and idempotent consumers, we can acknowledge client writes in under 15ms. Workers batch-insert events into PostgreSQL using multi-row transactions with range-partitioned ledger tables.",
          "Here is an example of an idempotent transaction consumer worker pattern:",
        ],
        codeSnippet: {
          language: "typescript",
          code: `// Idempotent worker with Redis deduplication\nasync function processTransaction(event: LedgerEvent) {\n  const lockKey = \`txn:lock:\${event.idempotencyKey}\`;\n  const acquired = await redis.set(lockKey, '1', 'NX', 'EX', 30);\n  if (!acquired) return; // Duplicate message absorbed\n\n  await db.transaction(async (trx) => {\n    await trx.raw('INSERT INTO ledger_partitioned VALUES (?)', [event.payload]);\n    await redis.set(\`balance:\${event.accountId}\`, event.newBalance);\n  });\n}`,
        },
      },
      {
        heading: "3. Cache Invalidation & Read Optimizations",
        paragraphs: [
          "For reads, we employ a read-through cache with a deterministic 60-second TTL backed by pub/sub cache invalidation. Rather than invalidating entire collections, we evict only affected user shards.",
          "The result of this architecture in production is a sustained 42ms p95 latency across 50,000+ daily financial transactions with zero table lock deadlocks.",
        ],
      },
    ],
  },
  {
    id: "ai-video-diffusion-comfyui",
    slug: "ai-video-diffusion-comfyui",
    title: "The Architecture of Neural Video: ComfyUI, Latent Diffusion & Temporal Locks",
    section: "Articles",
    category: "AI & Video Tech",
    date: "OCT 2026",
    readTime: "8 MIN READ",
    summary:
      "How generative AI video models actually work under the hood: managing latent noise, conditioning with AnimateDiff, and eliminating flicker in modern AI cinematography.",
    image: "assets/images/blog-ai-video.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Generative AI & Software Engineer",
    },
    tags: ["AI Video", "ComfyUI", "Diffusion Models", "Runway Gen-3", "Cinematography"],
    content: [
      {
        heading: "1. From Static Pixels to Temporal Coherence",
        paragraphs: [
          "Image diffusion models generate breathtaking single frames by iteratively denoising Gaussian noise in latent space. But applying 2D diffusion frame-by-frame creates violent temporal flicker — the infamous 'boiling water' artifact that plagued early generative video.",
          "Modern video diffusion architectures like SVD, Runway Gen-3, and AnimateDiff solve this by injecting temporal cross-attention layers into the UNet backbone, enforcing mathematical correlation across consecutive frame latents.",
        ],
        callout:
          "Temporal consistency is achieved by constraining the latent delta vector across neighboring frame steps rather than running independent seed sampling.",
      },
      {
        heading: "2. ComfyUI Graph Architecture",
        paragraphs: [
          "ComfyUI is to generative media what Kubernetes is to cloud infrastructure: an execution graph where models, VAEs, ControlNets, and latent tensors are wired into a deterministic pipeline.",
          "A production-grade generative video workflow combines:",
        ],
        codeSnippet: {
          language: "json",
          code: `{\n  "pipeline": "ComfyUI-Video-Engine-v2",\n  "checkpoint": "svd_xt_1_1.safetensors",\n  "motion_bucket_id": 127,\n  "fps": 25,\n  "augmentation_level": 0.04,\n  "upscaler": "4x_NMKD_Superscale_DAT",\n  "target_resolution": "3840x2160"\n}`,
        },
      },
      {
        heading: "3. The Future of AI Cinematography",
        paragraphs: [
          "As software engineers, we can now automate video production through headless cloud APIs. By scripting camera motion paths and combining synthetic voice dubbing with ElevenLabs, automated storytelling pipelines are fundamentally transforming how digital content is created.",
        ],
      },
    ],
  },
  {
    id: "microservices-without-distributed-monolith",
    slug: "microservices-without-distributed-monolith",
    title: "Domain-Driven Decomposition: Microservices Without the Distributed Monolith Trap",
    section: "Articles",
    category: "Software Architecture",
    date: "SEP 2026",
    readTime: "5 MIN READ",
    summary:
      "Why most microservice migrations fail, how to identify real bounded contexts, and practical patterns for asynchronous service communication.",
    image: "assets/images/blog-clean-architecture.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Senior Software Engineer",
    },
    tags: ["Microservices", "System Design", "Domain Driven Design", "Clean Architecture"],
    content: [
      {
        heading: "1. The Distributed Monolith Dilemma",
        paragraphs: [
          "Splitting a codebase into twenty microservices that all share the same relational database or synchronously HTTP-call each other in a fragile chain isn't microservices — it is a distributed monolith with network latency and partial failure modes.",
          "True service boundaries should be defined around business domain capabilities, where each service owns its datastore and communicates primarily through asynchronous events.",
        ],
        callout:
          "If Service A cannot fulfill a read request when Service B is restarting, your services are tightly coupled.",
      },
      {
        heading: "2. Clean Boundary Contracts with TypeScript & OpenAPI",
        paragraphs: [
          "Strong typing across service boundaries prevents runtime deserialization failures. Defining strict contract schemas with Zod or Protocol Buffers ensures that consumer and producer services never diverge.",
        ],
        codeSnippet: {
          language: "typescript",
          code: `// Shared Domain Contract\nexport const OrderCreatedSchema = z.object({\n  orderId: z.string().uuid(),\n  customerId: z.string(),\n  items: z.array(z.object({\n    sku: z.string(),\n    quantity: z.number().int().positive(),\n    unitPriceCents: z.number().int(),\n  })),\n  timestamp: z.number(),\n});\nexport type OrderCreatedEvent = z.infer<typeof OrderCreatedSchema>;`,
        },
      },
      {
        heading: "3. Modular Monolith as the Sensible Starting Point",
        paragraphs: [
          "For 90% of software products, starting with a well-architected Modular Monolith (clear domain packages, strict interface boundaries, and isolated schemas) provides superior developer velocity without operational overhead.",
          "When scaling demands it, individual domains can be extracted into standalone services with minimal friction.",
        ],
      },
    ],
  },

  // SECTION 3: CAREER BLOGS
  {
    id: "founder-engineer-mindset",
    slug: "founder-engineer-mindset",
    title: "From Code to Company: The Founder-Engineer Mindset in Developing Tech Ecosystems",
    section: "Career Blogs",
    category: "Career & Mentorship",
    date: "OCT 2026",
    readTime: "5 MIN READ",
    summary:
      "Lessons learned founding AI Desk while building production software: balancing architectural perfection with real client delivery, and why shipping value always beats premature abstraction.",
    image: "assets/images/blog-clean-architecture.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Founder & Web Developer, AI Desk",
    },
    tags: ["Founder", "Career", "Web Development", "Entrepreneurship", "Mentorship"],
    content: [
      {
        heading: "1. The Duality of Code and Business",
        paragraphs: [
          "Transitioning from purely writing code to founding a tech venture changes how you measure success. As software engineers, we pride ourselves on clean code, test coverage, and elegant abstractions. But as a founder, your primary metric is whether your software solves a painful, tangible problem for real humans.",
          "Building the Vikasha CBO E-Billing System taught me that user empathy in rural field conditions matters just as much as database indexing.",
        ],
        callout:
          "Code is a means to an outcome. The best software is the one that reliably runs unnoticed because it simply works.",
      },
      {
        heading: "2. The 'Founder-Developer' Flywheel",
        paragraphs: [
          "Being both the founder and the web developer provides an unparalleled superpower: zero translation loss. When a government stakeholder describes an operational obstacle, you can mentally map it directly to database entities and API endpoints in real-time.",
          "This rapid iteration loop enables small agile teams to outpace bloated enterprise consultants every single time.",
        ],
      },
      {
        heading: "3. Advice for Aspiring Engineers",
        paragraphs: [
          "Don't wait for permission or the 'perfect idea' to start building. Look around your local environment, identify manual, paper-driven processes, and build digital tools that make someone's daily life 10x easier.",
        ],
      },
    ],
  },
  {
    id: "mastering-software-engineering-career",
    slug: "mastering-software-engineering-career",
    title: "Navigating Modern Software Engineering: Depth, Breadth & High-Leverage Skills",
    section: "Career Blogs",
    category: "Engineering Culture",
    date: "SEP 2026",
    readTime: "6 MIN READ",
    summary:
      "A strategic roadmap for junior and mid-level engineers looking to accelerate their growth into senior roles: cultivating T-shaped mastery, system design intuition, and clear technical communication.",
    image: "assets/images/blog-distributed-systems.jpg",
    author: {
      name: "Dinidu Sachintha",
      role: "Senior Software Engineer",
    },
    tags: ["Career Growth", "Software Engineering", "Mentorship", "System Design"],
    content: [
      {
        heading: "1. The T-Shaped Engineer in the AI Era",
        paragraphs: [
          "In an era where AI can generate boilerplate functions in seconds, deep foundational comprehension is more valuable than ever. Seniority isn't about memorizing API syntax; it's about knowing how systems fail, how data flows under pressure, and how to debug state races across distributed boundaries.",
        ],
      },
      {
        heading: "2. Technical Communication as a Differentiator",
        paragraphs: [
          "The engineers who create the largest impact are those who can explain complex architectural trade-offs to non-technical stakeholders with clarity and poise.",
        ],
      },
    ],
  },
];

export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;


