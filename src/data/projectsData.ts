import vikashaEBillingImg from "../assets/projects/vikasha-ebilling.jpg";
import schoolrideLkImg from "../assets/projects/schoolride-lk.jpg";
import waterboardInventoryImg from "../assets/projects/waterboard-inventory.jpg";
import eWeddingRsvpImg from "../assets/projects/e-wedding-rsvp.jpg";
import spicySellingSiteImg from "../assets/projects/spicy-selling-site.jpg";

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
  capabilitiesLabel?: string;
  capabilitiesText?: string;
  imageAlt?: string;
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
    liveUrl: "https://vikashacbo.com/",
    sourceUrl: "https://github.com/dinidu",
    screenshot: vikashaEBillingImg,
    demoUrl: "https://vikashacbo.com/",
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
    id: "schoolride-lk",
    number: "02",
    category: "Transportation",
    domain: "Full Stack",
    year: "2026",
    role: "Full Stack Web Development",
    status: "LIVE PLATFORM",
    title: "SchoolRide LK",
    shortDescription:
      "A full-stack school transportation platform designed for Sri Lankan families, connecting parents with verified school van operators through secure ride bookings, real-time GPS tracking, child safety monitoring, and role-based management dashboards.",
    description:
      "A full-stack school transportation platform designed for Sri Lankan families, connecting parents with verified school van operators through secure ride bookings, real-time GPS tracking, child safety monitoring, and role-based management dashboards.",
    problem:
      "School transportation for children in Sri Lanka relied on informal verbal agreements with van operators, causing constant parental anxiety due to zero route visibility, unverified driver credentials, and lack of real-time pickup/drop-off status alerts.",
    solution:
      "Built an all-in-one school ride management system empowering parents with live GPS vehicle tracking, direct child safety status confirmations, verified driver credential checks, and role-based portals for parents, van operators, and administrators.",
    architecture:
      "Next.js 15 App Router frontend with Tailwind CSS, NestJS 11 backend microservices with Socket.io real-time telemetry, PostgreSQL with Prisma ORM transactional persistence, and Leaflet/OpenStreetMap geospatial tracking.",
    highlights: [
      "School ride booking & trip management for verified school van operators",
      "Real-time GPS tracking with live pickup and drop-off status monitoring",
      "Parent, driver, and administrative role-based management dashboards",
      "Driver verification, vehicle documentation, and child safety compliance",
    ],
    architectureNodes: [
      { layer: "Client UI", tech: "Next.js 15 + Tailwind CSS", detail: "Responsive parent, driver & admin web dashboards" },
      { layer: "Backend API", tech: "NestJS 11 + Express", detail: "Modular REST microservices & Socket.io tracking" },
      { layer: "Realtime Engine", tech: "Socket.io + Leaflet", detail: "Live GPS coordinates & route updates" },
      { layer: "Persistence", tech: "PostgreSQL + Prisma ORM", detail: "Relational booking ledgers & driver verification" },
    ],
    technologies: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Tailwind"],
    liveUrl: "",
    sourceUrl: "https://github.com/dinidusachintha/SchoolRide-LK-V2",
    screenshot: schoolrideLkImg,
    demoUrl: "https://schoolride.lk",
    accentColor: "#22c55e",
    cardBg: "linear-gradient(145deg, #0d2014 0%, #060e09 100%)",
    borderColor: "rgba(34, 197, 94, 0.35)",
    glowColor: "rgba(34, 197, 94, 0.28)",
    tagBg: "rgba(34, 197, 94, 0.16)",
    tagColor: "#86efac",
    metrics: [
      { value: "3 Roles", label: "Parent, Driver & Admin" },
      { value: "Live GPS", label: "Real-Time Tracking" },
      { value: "100%", label: "Child Safety Focus" },
    ],
    capabilitiesLabel: "SYSTEM CAPABILITIES",
    capabilitiesText: "3 USER ROLES ✦ LIVE TRACKING ✦ SECURE BOOKINGS",
    imageAlt: "SchoolRide LK - Smart School Transportation Platform",
  },
  {
    id: "waterboard-inventory",
    number: "03",
    category: "Inventory",
    domain: "Full Stack",
    year: "2026",
    role: "Full Stack Web Developer",
    status: "UTILITY PRODUCTION",
    title: "Waterboard Inventory Management",
    shortDescription:
      "A centralized inventory solution for water utility operations, simplifying inventory tracking, stock movements, supplier records, section categorization, and automated operational reporting with PDF exports.",
    description:
      "A centralized inventory solution for water utility operations, simplifying inventory tracking, stock movements, supplier records, section categorization, and automated operational reporting with PDF exports.",
    problem:
      "Waterboard utility depots and regional distribution sections struggled with fragmented stock records, manual paper log sheets, and delayed procurement reporting for critical waterworks materials.",
    solution:
      "Engineered a centralized web inventory ecosystem with SKU item tracking, waterboard section categorization, low-stock threshold alerts, automated PDF audit reporting, and JWT role-based access.",
    architecture:
      "React 18 frontend with TypeScript and Tailwind CSS, TanStack React Query for cached server state, Express REST microservices with Mongoose ORM, and jsPDF autotable generation.",
    highlights: [
      "Inventory & materials management with real-time stock levels, SKU codes, and unit metrics",
      "Section-based resource allocation across water supply divisions and maintenance depots",
      "Automated PDF inventory audits and summary generation using jsPDF and autotable",
      "Role-based authentication with JWT session control for administrators and inventory staff",
    ],
    architectureNodes: [
      { layer: "Presentation UI", tech: "React 18 + Tailwind CSS", detail: "Responsive admin portal with TanStack Query & Recharts" },
      { layer: "Reporting Engine", tech: "jsPDF + AutoTable", detail: "Client-side PDF inventory manifest & report export" },
      { layer: "Backend API", tech: "Node.js + Express (TS)", detail: "RESTful inventory services & JWT role-based security" },
      { layer: "Persistence Layer", tech: "MongoDB + Mongoose", detail: "Document stores for items, sections, and user audit logs" },
    ],
    technologies: ["React", "TypeScript", "Express", "MongoDB", "Node.js", "Tailwind"],
    liveUrl: "",
    sourceUrl: "https://github.com/dinidusachintha/Waterboard-Inventory-management",
    screenshot: waterboardInventoryImg,
    demoUrl: "https://waterboard-inventory.nwsdb.lk",
    accentColor: "#0284c7",
    cardBg: "linear-gradient(145deg, #081726 0%, #040c14 100%)",
    borderColor: "rgba(2, 132, 199, 0.4)",
    glowColor: "rgba(2, 132, 199, 0.3)",
    tagBg: "rgba(2, 132, 199, 0.16)",
    tagColor: "#38bdf8",
    metrics: [
      { value: "Full Stack", label: "Utility Inventory Core" },
      { value: "PDF Export", label: "Automated Reports" },
      { value: "Role-Based", label: "Admin & Staff Security" },
    ],
    capabilitiesLabel: "SYSTEM CAPABILITIES",
    capabilitiesText: "CENTRALIZED INVENTORY ✦ STOCK VISIBILITY ✦ REPORTING",
    imageAlt: "Waterboard Inventory Management - Inventory and Stock Control Platform",
  },
  {
    id: "e-wedding-rsvp",
    number: "04",
    category: "Client Project · Web Development",
    domain: "Full Stack",
    year: "2026",
    role: "Lead Frontend & Creative Engineer",
    status: "CLIENT PRODUCTION",
    title: "E-Wedding RSVP Invitation",
    shortDescription:
      "A premium digital wedding invitation website designed for Gimasha & Chathura, delivering an elegant, interactive wedding experience with cinematic visuals, romantic animations, and seamless guest interaction.",
    description:
      "A premium digital wedding invitation website designed for Gimasha & Chathura, delivering an elegant, interactive wedding experience with cinematic visuals, romantic animations, and seamless guest interaction.",
    problem:
      "Traditional paper wedding invitations are static, lack real-time RSVP tracking, cannot provide dynamic countdowns or interactive venue maps, and are easily lost or misplaced by wedding guests.",
    solution:
      "Engineered a luxury digital wedding invitation platform featuring an interactive online RSVP system, live countdown timer, cinematic cover screen, animated flower petals, and Google Maps venue integration.",
    architecture:
      "Modern React & TypeScript architecture styled with Tailwind CSS, utilizing Framer Motion for cinematic physics-based animations, fluid scroll-driven transitions, and real-time guest RSVP state handling.",
    highlights: [
      "Interactive online RSVP with instant guest attendance confirmation and response tracking",
      "Live wedding countdown timer synchronizing event milestones in real time",
      "Cinematic wedding cover screen with romantic ambient visuals and audio controls",
      "Animated flower petals with fluid physics and smooth scroll navigation",
      "Wedding story and ceremony details with Google Maps location integration",
      "Fully responsive mobile and desktop experience with premium olive-green and gold theme",
    ],
    architectureNodes: [
      { layer: "Presentation UI", tech: "React + Tailwind CSS", detail: "Luxury olive-green & champagne-gold aesthetic" },
      { layer: "Motion Engine", tech: "Framer Motion", detail: "Animated falling flower petals & cinematic transitions" },
      { layer: "Guest Utilities", tech: "Interactive RSVP & Maps", detail: "Online RSVP confirmation & Google Maps routing" },
      { layer: "Event Core", tech: "Live Countdown & Audio", detail: "Real-time wedding day synchronizer & ambient audio controller" },
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://www.chathuragimasha.site/",
    sourceUrl: "https://github.com/Genula2003/WeddingSite-1",
    screenshot: eWeddingRsvpImg,
    demoUrl: "https://www.chathuragimasha.site/",
    accentColor: "#849b5c",
    cardBg: "linear-gradient(145deg, #0f1611 0%, #080d09 100%)",
    borderColor: "rgba(132, 155, 92, 0.38)",
    glowColor: "rgba(132, 155, 92, 0.28)",
    tagBg: "rgba(132, 155, 92, 0.16)",
    tagColor: "#c5d8a4",
    metrics: [
      { value: "100%", label: "Mobile Responsive" },
      { value: "Live", label: "Interactive RSVP" },
      { value: "60 FPS", label: "Cinematic Animations" },
    ],
  },
  {
    id: "spicy-selling-site",
    number: "05",
    category: "E-Commerce",
    domain: "Full Stack",
    year: "2026",
    role: "Web Developer · E-Commerce",
    status: "E-COMMERCE STORE",
    title: "Spicy Selling Site",
    shortDescription:
      "A modern, responsive e-commerce website designed to showcase and sell premium spices through an engaging digital shopping experience. Focused on intuitive navigation, attractive product presentation, smooth interactions, and mobile-friendly design.",
    description:
      "A modern, responsive e-commerce website designed to showcase and sell premium Ceylon spices through an engaging digital shopping experience. Focused on intuitive navigation, attractive product presentation, smooth interactions, and mobile-friendly design.",
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
    architectureNodes: [
      { layer: "Storefront UI", tech: "React + Tailwind CSS", detail: "Responsive layout with Ceylon Reds fiery aesthetic" },
      { layer: "Catalog Core", tech: "JavaScript + Product State", detail: "Structured spice catalog with categorized browsing" },
      { layer: "Cart Management", tech: "React State & Context", detail: "Real-time item count, price calculation & cart drawer" },
      { layer: "Engage & Capture", tech: "Interactive Modals", detail: "Subscription newsletter modal & promotional banners" },
    ],
    technologies: ["React", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
    liveUrl: "https://ceylonredspice.netlify.app/",
    sourceUrl: "https://github.com/dinidusachintha/spicy-selling-site",
    screenshot: spicySellingSiteImg,
    demoUrl: "https://ceylonredspice.netlify.app/",
    accentColor: "#f97316",
    cardBg: "linear-gradient(145deg, #180e0a 0%, #0c0705 100%)",
    borderColor: "rgba(249, 115, 22, 0.38)",
    glowColor: "rgba(249, 115, 22, 0.28)",
    tagBg: "rgba(249, 115, 22, 0.16)",
    tagColor: "#fdba74",
    metrics: [
      { value: "100%", label: "Ceylon Quality" },
      { value: "<0.1s", label: "Cart Update Latency" },
      { value: "Mobile", label: "First Responsive UI" },
    ],
  },
];
