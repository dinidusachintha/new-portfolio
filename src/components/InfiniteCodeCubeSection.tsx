import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  Boxes,
  Compass,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export interface StageInfo {
  id: "idea" | "design" | "code" | "test" | "deploy";
  step: string;
  name: string;
  subtitle: string;
  description: string;
  accent: string;
  specs: string[];
}

const STAGES: StageInfo[] = [
  {
    id: "idea",
    step: "01",
    name: "IDEA",
    subtitle: "Concept & Problem Solving",
    description:
      "Deconstructing complex domain challenges into deterministic algorithms, functional requirements, and high-impact software value propositions.",
    accent: "#FACC15",
    specs: ["Domain Modeling", "Feasibility Matrix", "Value Architecture"],
  },
  {
    id: "design",
    step: "02",
    name: "DESIGN",
    subtitle: "UI/UX & System Architecture",
    description:
      "Crafting high-throughput relational data schemas, resilient microservices topologies, and pixel-precise, accessible user experiences.",
    accent: "#38BDF8",
    specs: ["Distributed Topology", "Figma Design System", "ACID Data Models"],
  },
  {
    id: "code",
    step: "03",
    name: "CODE",
    subtitle: "Frontend & Backend Engineering",
    description:
      "Authoring strict type-safe TypeScript, performant React/Next.js interfaces, async backend microservices, and robust REST/WebSocket pipelines.",
    accent: "#A855F7",
    specs: ["Strict TypeScript", "Reactive State Engine", "Async Node.js / Java"],
  },
  {
    id: "test",
    step: "04",
    name: "TEST",
    subtitle: "Automated Verification & Optimization",
    description:
      "Enforcing zero-regression test harnesses, end-to-end integration audits, latency profiling, and security boundary verification.",
    accent: "#34D399",
    specs: ["Unit & Integration", "Load Profiling (<50ms)", "OWASP Compliance"],
  },
  {
    id: "deploy",
    step: "05",
    name: "DEPLOY",
    subtitle: "Production & Cloud Architecture",
    description:
      "Automating multi-stage CI/CD deployments, zero-downtime containerized releases, edge caching, and real-time observability telemetry.",
    accent: "#FACC15",
    specs: ["Docker & CI/CD", "Edge CDN Latency", "99.99% Uptime SLA"],
  },
];

/**
 * Creates an in-memory high-res radial glow sprite for Three.js particles and energy core.
 */
function createEnergyGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(250, 204, 21, 0.95)"); // Electric Yellow #FACC15
    gradient.addColorStop(0.55, "rgba(234, 179, 8, 0.4)");
    gradient.addColorStop(0.8, "rgba(11, 17, 32, 0.15)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function InfiniteCodeCubeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active highlighted development stage (null = All Stages Unified)
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [telemetry, setTelemetry] = useState({ ry: "0.0", rx: "0.0", fps: 60 });

  // Refs for animation loop communication
  const activeStageRef = useRef<string | null>(null);
  activeStageRef.current = activeStage;

  const explodedRef = useRef(false);
  explodedRef.current = isExploded;

  const autoRotateRef = useRef(true);
  autoRotateRef.current = isAutoRotating;

  const hoveredRef = useRef(false);
  hoveredRef.current = isHovered;

  const resetTriggerRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();

    const initialWidth = container.clientWidth || 1000;
    const initialHeight = container.clientHeight || 640;

    const camera = new THREE.PerspectiveCamera(
      46,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 2. Soft Sophisticated Physically Based Lighting
    // Deep Navy ambient fill (#0B1120) with electric yellow specular rims
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xf8fafc, 2.4);
    mainKeyLight.position.set(20, 25, 20);
    scene.add(mainKeyLight);

    const fillNavyLight = new THREE.DirectionalLight(0x0284c7, 1.8);
    fillNavyLight.position.set(-22, -18, 16);
    scene.add(fillNavyLight);

    const rimYellowLight = new THREE.DirectionalLight(0xfacc15, 2.6);
    rimYellowLight.position.set(0, -20, -22);
    scene.add(rimYellowLight);

    // Central core point light casting golden luminescence through glass layers
    const corePointLight = new THREE.PointLight(0xfacc15, 2.8, 25);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // 3. Master Cube Assembly
    const cubeMasterGroup = new THREE.Group();
    scene.add(cubeMasterGroup);

    // Texture for point particles
    const glowTexture = createEnergyGlowTexture();

    // =========================================================================
    // LAYER 1: IDEA — Outer Glass Cube with Metallic Chamfered Edges
    // =========================================================================
    const ideaGroup = new THREE.Group();
    cubeMasterGroup.add(ideaGroup);

    const ideaSize = 7.4;
    const ideaBoxGeo = new THREE.BoxGeometry(ideaSize, ideaSize, ideaSize);

    // Physically based refractive glass material
    const ideaGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b1120, // Deep Navy
      roughness: 0.08,
      metalness: 0.12,
      transmission: 0.88,
      ior: 1.52,
      reflectivity: 0.85,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    const ideaMesh = new THREE.Mesh(ideaBoxGeo, ideaGlassMat);
    ideaGroup.add(ideaMesh);

    // Thin metallic edges
    const ideaEdgesGeo = new THREE.EdgesGeometry(ideaBoxGeo);
    const ideaEdgesMat = new THREE.LineBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });
    const ideaEdges = new THREE.LineSegments(ideaEdgesGeo, ideaEdgesMat);
    ideaGroup.add(ideaEdges);

    // Glowing Electric Yellow corner node markers
    const cornerMarkersGeo = new THREE.BufferGeometry();
    const halfS = ideaSize / 2;
    const cornerVertices = new Float32Array([
      -halfS, -halfS, -halfS,
       halfS, -halfS, -halfS,
       halfS,  halfS, -halfS,
      -halfS,  halfS, -halfS,
      -halfS, -halfS,  halfS,
       halfS, -halfS,  halfS,
       halfS,  halfS,  halfS,
      -halfS,  halfS,  halfS,
    ]);
    cornerMarkersGeo.setAttribute("position", new THREE.BufferAttribute(cornerVertices, 3));
    const cornerMarkersMat = new THREE.PointsMaterial({
      size: 0.6,
      map: glowTexture,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cornerMarkers = new THREE.Points(cornerMarkersGeo, cornerMarkersMat);
    ideaGroup.add(cornerMarkers);

    // =========================================================================
    // LAYER 2: DESIGN — UI/UX & Architecture Blueprint Lattice
    // =========================================================================
    const designGroup = new THREE.Group();
    cubeMasterGroup.add(designGroup);

    const designSize = 5.8;
    const designBoxGeo = new THREE.BoxGeometry(designSize, designSize, designSize);

    const designGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827, // Dark Charcoal
      roughness: 0.15,
      metalness: 0.45,
      transmission: 0.72,
      ior: 1.45,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const designMesh = new THREE.Mesh(designBoxGeo, designGlassMat);
    designGroup.add(designMesh);

    // Architectural Wireframe Blueprint Lines
    const designWireGeo = new THREE.WireframeGeometry(designBoxGeo);
    const designWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8, // Blueprint Cyan
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const designWire = new THREE.LineSegments(designWireGeo, designWireMat);
    designGroup.add(designWire);

    // Nested Octahedron Structural Core
    const designOctaGeo = new THREE.OctahedronGeometry(designSize * 0.48);
    const designOctaMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const designOcta = new THREE.LineSegments(new THREE.WireframeGeometry(designOctaGeo), designOctaMat);
    designGroup.add(designOcta);

    // =========================================================================
    // LAYER 3: CODE — Frontend & Backend Engineering Matrix
    // =========================================================================
    const codeGroup = new THREE.Group();
    cubeMasterGroup.add(codeGroup);

    const codeSize = 4.3;
    const codeBoxGeo = new THREE.BoxGeometry(codeSize, codeSize, codeSize);

    const codeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.7,
      transmission: 0.55,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const codeMesh = new THREE.Mesh(codeBoxGeo, codeMat);
    codeGroup.add(codeMesh);

    const codeEdgesGeo = new THREE.EdgesGeometry(codeBoxGeo);
    const codeEdgesMat = new THREE.LineBasicMaterial({
      color: 0xa855f7, // Violet syntax
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const codeEdges = new THREE.LineSegments(codeEdgesGeo, codeEdgesMat);
    codeGroup.add(codeEdges);

    // Code Matrix Particle Nodes (120 structured nodes on faces)
    const codePointsCount = 120;
    const codePointPositions = new Float32Array(codePointsCount * 3);
    for (let i = 0; i < codePointsCount; i++) {
      const axis = i % 3;
      const sign = i % 2 === 0 ? 1 : -1;
      const h = (codeSize / 2) * sign;
      const u = ((Math.random() - 0.5) * codeSize * 0.85);
      const v = ((Math.random() - 0.5) * codeSize * 0.85);

      if (axis === 0) {
        codePointPositions[i * 3] = h;
        codePointPositions[i * 3 + 1] = u;
        codePointPositions[i * 3 + 2] = v;
      } else if (axis === 1) {
        codePointPositions[i * 3] = u;
        codePointPositions[i * 3 + 1] = h;
        codePointPositions[i * 3 + 2] = v;
      } else {
        codePointPositions[i * 3] = u;
        codePointPositions[i * 3 + 1] = v;
        codePointPositions[i * 3 + 2] = h;
      }
    }
    const codePointsGeo = new THREE.BufferGeometry();
    codePointsGeo.setAttribute("position", new THREE.BufferAttribute(codePointPositions, 3));
    const codePointsMat = new THREE.PointsMaterial({
      size: 0.4,
      map: glowTexture,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const codePoints = new THREE.Points(codePointsGeo, codePointsMat);
    codeGroup.add(codePoints);

    // =========================================================================
    // LAYER 4: TEST — Automated Verification & Optimization Cage
    // =========================================================================
    const testGroup = new THREE.Group();
    cubeMasterGroup.add(testGroup);

    const testSize = 2.9;
    const testBoxGeo = new THREE.BoxGeometry(testSize, testSize, testSize);

    const testEdgesGeo = new THREE.EdgesGeometry(testBoxGeo);
    const testEdgesMat = new THREE.LineBasicMaterial({
      color: 0x34d399, // Green Verification
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const testEdges = new THREE.LineSegments(testEdgesGeo, testEdgesMat);
    testGroup.add(testEdges);

    // Nested Icosahedron Verification Cage
    const testIcoGeo = new THREE.IcosahedronGeometry(testSize * 0.45, 0);
    const testIcoMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const testIco = new THREE.LineSegments(new THREE.WireframeGeometry(testIcoGeo), testIcoMat);
    testGroup.add(testIco);

    // =========================================================================
    // LAYER 5: DEPLOY — Central Electric Yellow Energy Core (#FACC15)
    // =========================================================================
    const deployGroup = new THREE.Group();
    cubeMasterGroup.add(deployGroup);

    // Inner Luminous Core Sphere
    const coreSphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const coreSphereMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.95,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    deployGroup.add(coreSphere);

    // Glowing Halo Flare Billboard Sprite
    const haloSpriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const haloSprite = new THREE.Sprite(haloSpriteMat);
    haloSprite.scale.set(3.5, 3.5, 3.5);
    deployGroup.add(haloSprite);

    // Micro Gyroscopic Orbital Ring around core
    const coreRingGeo = new THREE.RingGeometry(1.25, 1.32, 48);
    const coreRingMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const coreRing1 = new THREE.Mesh(coreRingGeo, coreRingMat);
    const coreRing2 = new THREE.Mesh(coreRingGeo, coreRingMat);
    coreRing1.rotation.x = Math.PI / 3;
    coreRing2.rotation.y = Math.PI / 4;
    deployGroup.add(coreRing1);
    deployGroup.add(coreRing2);

    // =========================================================================
    // AMBIENT CELESTIAL STARDUST (Minimal, subtle, deep navy background)
    // =========================================================================
    const stardustCount = 180;
    const stardustPositions = new Float32Array(stardustCount * 3);
    for (let i = 0; i < stardustCount; i++) {
      stardustPositions[i * 3] = (Math.random() - 0.5) * 55;
      stardustPositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      stardustPositions[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    const stardustGeo = new THREE.BufferGeometry();
    stardustGeo.setAttribute("position", new THREE.BufferAttribute(stardustPositions, 3));
    const stardustMat = new THREE.PointsMaterial({
      size: 0.5,
      map: glowTexture,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stardust = new THREE.Points(stardustGeo, stardustMat);
    scene.add(stardust);

    // 4. Interactive 360° Pointer & Touch Dragging with Damped Inertia
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    let targetRotY = 0.45;
    let targetRotX = 0.25;

    let pointerXNormalized = 0;
    let pointerYNormalized = 0;

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerXNormalized = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      pointerYNormalized = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      if (!isDragging) return;
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      dragVelocityX = dx * 0.0055;
      dragVelocityY = dy * 0.0055;

      targetRotY += dragVelocityX;
      targetRotX += dragVelocityY;

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const handleMouseUp = () => onPointerUp();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => onPointerUp();

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 5. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 1000;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 6. Visibility Observer (Zero GPU usage when scrolled out of view)
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    visibilityObserver.observe(container);

    // 7. Core Animation Frame Loop (Frame-rate independent delta time)
    const clock = new THREE.Clock();
    let animId: number;
    let lastTelemetryTime = 0;
    let frameCount = 0;
    let fpsStart = performance.now();
    let currentFps = 60;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

      // FPS tracking
      frameCount++;
      if (now - fpsStart >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (now - fpsStart));
        frameCount = 0;
        fpsStart = now;
      }

      // Handle Reset Orientation trigger
      if (resetTriggerRef.current > 0) {
        targetRotY = 0.45;
        targetRotX = 0.25;
        resetTriggerRef.current = 0;
      }

      // Auto-rotation (18–24s per full 360° turn: ~0.26 - 0.35 rad/s)
      const baseRotationSpeed = (Math.PI * 2) / 21; // ~21s per 360° loop
      const hoverSpeedMultiplier = hoveredRef.current ? 0.45 : 1.0;

      if (autoRotateRef.current && !isDragging) {
        targetRotY += baseRotationSpeed * delta * hoverSpeedMultiplier;
        targetRotX += Math.sin(elapsedTime * 0.4) * 0.0006;
      } else if (!isDragging) {
        // Friction damping
        targetRotY += dragVelocityX;
        targetRotX += dragVelocityY;
        dragVelocityX *= 0.93;
        dragVelocityY *= 0.93;
      }

      // Damped smooth rotation of master assembly
      cubeMasterGroup.rotation.y += (targetRotY - cubeMasterGroup.rotation.y) * 0.085;
      cubeMasterGroup.rotation.x += (targetRotX - cubeMasterGroup.rotation.x) * 0.085;

      // Mouse Parallax on Camera
      const parallaxFactor = prefersReducedMotion ? 0.0 : 0.035;
      camera.position.x += (pointerXNormalized * 2.8 - camera.position.x) * parallaxFactor;
      camera.position.y += (1.2 - pointerYNormalized * 1.8 - camera.position.y) * parallaxFactor;
      camera.lookAt(0, 0, 0);

      // =======================================================================
      // NESTED INDEPENDENT LAYER ROTATION & KINETIC DELTAS
      // =======================================================================
      // 1. IDEA Outer Cube: Slow clockwise Y-rotation
      ideaGroup.rotation.y += 0.0018 * hoverSpeedMultiplier;
      ideaGroup.rotation.x = Math.sin(elapsedTime * 0.35) * 0.04;

      // 2. DESIGN Layer 2: Slightly slower counterclockwise rotation
      designGroup.rotation.y -= 0.0028 * hoverSpeedMultiplier;
      designGroup.rotation.z = Math.cos(elapsedTime * 0.4) * 0.03;

      // 3. CODE Layer 3: Independent 3-axis subtle precession
      codeGroup.rotation.y += 0.0035 * hoverSpeedMultiplier;
      codeGroup.rotation.x -= 0.0022 * hoverSpeedMultiplier;

      // 4. TEST Layer 4: Minimal precision alignment
      testGroup.rotation.y -= 0.0015 * hoverSpeedMultiplier;
      testGroup.rotation.z += 0.0018 * hoverSpeedMultiplier;

      // 5. DEPLOY Central Core: High-velocity independent kinetic rotation & pulsation
      const corePulse = 1.0 + Math.sin(elapsedTime * 3.2) * 0.09;
      coreSphere.scale.set(corePulse, corePulse, corePulse);
      haloSprite.scale.set(3.5 * corePulse, 3.5 * corePulse, 3.5 * corePulse);
      coreRing1.rotation.z += 0.015;
      coreRing2.rotation.z -= 0.018;
      deployGroup.rotation.y += 0.012;

      // Hover Edge Illumination & Visibility boost
      const hoverTargetOpacity = hoveredRef.current ? 0.85 : 0.38;
      ideaEdgesMat.opacity = THREE.MathUtils.lerp(ideaEdgesMat.opacity, hoverTargetOpacity, 0.08);

      // =======================================================================
      // SCROLL / EXPLODED ARCHITECTURAL LAYER SEPARATION
      // =======================================================================
      const isExplodeActive = explodedRef.current;
      const targetIdeaScale = isExplodeActive ? 1.38 : 1.0;
      const targetDesignScale = isExplodeActive ? 1.18 : 1.0;
      const targetCodeScale = isExplodeActive ? 1.05 : 1.0;
      const targetTestScale = isExplodeActive ? 0.95 : 1.0;

      ideaGroup.scale.lerp(new THREE.Vector3(targetIdeaScale, targetIdeaScale, targetIdeaScale), 0.06);
      designGroup.scale.lerp(new THREE.Vector3(targetDesignScale, targetDesignScale, targetDesignScale), 0.06);
      codeGroup.scale.lerp(new THREE.Vector3(targetCodeScale, targetCodeScale, targetCodeScale), 0.06);
      testGroup.scale.lerp(new THREE.Vector3(targetTestScale, targetTestScale, targetTestScale), 0.06);

      // =======================================================================
      // STAGE FOCUS HIGHLIGHTING (When user clicks a specific stage pill)
      // =======================================================================
      const stage = activeStageRef.current;
      if (stage) {
        // Dim unselected layers, highlight target
        ideaGlassMat.opacity = THREE.MathUtils.lerp(ideaGlassMat.opacity, stage === "idea" ? 0.85 : 0.15, 0.08);
        designGlassMat.opacity = THREE.MathUtils.lerp(designGlassMat.opacity, stage === "design" ? 0.85 : 0.12, 0.08);
        codeMat.opacity = THREE.MathUtils.lerp(codeMat.opacity, stage === "code" ? 0.85 : 0.1, 0.08);
        testEdgesMat.opacity = THREE.MathUtils.lerp(testEdgesMat.opacity, stage === "test" ? 0.95 : 0.18, 0.08);
        coreSphereMat.opacity = THREE.MathUtils.lerp(coreSphereMat.opacity, stage === "deploy" ? 1.0 : 0.3, 0.08);
      } else {
        // Balanced unified state
        ideaGlassMat.opacity = THREE.MathUtils.lerp(ideaGlassMat.opacity, 0.65, 0.08);
        designGlassMat.opacity = THREE.MathUtils.lerp(designGlassMat.opacity, 0.45, 0.08);
        codeMat.opacity = THREE.MathUtils.lerp(codeMat.opacity, 0.4, 0.08);
        testEdgesMat.opacity = THREE.MathUtils.lerp(testEdgesMat.opacity, 0.6, 0.08);
        coreSphereMat.opacity = THREE.MathUtils.lerp(coreSphereMat.opacity, 0.95, 0.08);
      }

      // Update Telemetry HUD state (throttled to 10 FPS for clean UI performance)
      if (now - lastTelemetryTime > 100) {
        const radToDeg = 180 / Math.PI;
        setTelemetry({
          ry: ((cubeMasterGroup.rotation.y * radToDeg) % 360).toFixed(1),
          rx: ((cubeMasterGroup.rotation.x * radToDeg) % 360).toFixed(1),
          fps: currentFps,
        });
        lastTelemetryTime = now;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Unmount & Resource Cleanup
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      ideaBoxGeo.dispose();
      ideaGlassMat.dispose();
      ideaEdgesGeo.dispose();
      ideaEdgesMat.dispose();
      cornerMarkersGeo.dispose();
      cornerMarkersMat.dispose();

      designBoxGeo.dispose();
      designGlassMat.dispose();
      designWireGeo.dispose();
      designWireMat.dispose();
      designOctaGeo.dispose();
      designOctaMat.dispose();

      codeBoxGeo.dispose();
      codeMat.dispose();
      codeEdgesGeo.dispose();
      codeEdgesMat.dispose();
      codePointsGeo.dispose();
      codePointsMat.dispose();

      testBoxGeo.dispose();
      testEdgesGeo.dispose();
      testEdgesMat.dispose();
      testIcoGeo.dispose();
      testIcoMat.dispose();

      coreSphereGeo.dispose();
      coreSphereMat.dispose();
      haloSpriteMat.dispose();
      coreRingGeo.dispose();
      coreRingMat.dispose();
      stardustGeo.dispose();
      stardustMat.dispose();
      glowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const handleReset = () => {
    resetTriggerRef.current = 1;
    setActiveStage(null);
    setIsExploded(false);
  };

  const currentStageData = useMemo(() => {
    if (!activeStage) return null;
    return STAGES.find((s) => s.id === activeStage) || null;
  }, [activeStage]);

  return (
    <section
      className="infinite-code-cube-section relative py-20 sm:py-28 overflow-hidden"
      id="system-dynamics"
      aria-label="The Infinite Code Cube — 3D Architecture Simulation"
    >
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse shadow-[0_0_10px_#FACC15]" />
              <span className="font-mono text-xs text-[#FACC15] font-bold uppercase tracking-widest">
                04 // THE INFINITE CODE CUBE · ARCHITECTURAL MATRIX
              </span>
            </div>
            <h2 className="font-unbounded font-black text-2xl sm:text-4xl text-white tracking-tight">
              From Idea to Design<span className="text-[#FACC15]">,</span> From Code to Reality<span className="text-[#FACC15]">.</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              An interactive 3D manifestation of the engineering lifecycle: five nested geometric
              layers rotating continuously in 360°, modeling architectural clarity and production stability.
            </p>
          </div>

          {/* Quick HUD Telemetry Badges */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-1.5">
              <Boxes size={13} className="text-[#FACC15]" />
              <span>5 NESTED STAGES</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{telemetry.fps} FPS · WEBGL</span>
            </span>
          </div>
        </div>

        {/* 3D Canvas Stage Card */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative mt-8 w-full h-[540px] sm:h-[660px] rounded-3xl bg-gradient-to-b from-[#0B1120] via-[#090D1A] to-[#040711] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(250,204,21,0.06)] overflow-hidden group select-none"
        >
          {/* Subtle Ambient Navy & Electric Yellow Lighting Reflection */}
          <div
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FACC15]/8 blur-[110px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#0284c7]/12 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />

          {/* WebGL Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-grab active:cursor-grabbing relative z-10"
            title="Click and drag to rotate the Infinite Code Cube in 360 degrees"
          />

          {/* TOP LEFT: Telemetry & Orientation Vector Card */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none flex flex-col gap-2 font-mono text-[10px] sm:text-[11px]">
            <div className="px-3.5 py-2 rounded-xl bg-black/65 backdrop-blur-md border border-white/10 text-gray-300 shadow-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[#FACC15] font-bold">
                <Compass size={12} />
                <span>ORIENTATION HUD</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-400">
                <span>YAW: <b className="text-white">{telemetry.ry}°</b></span>
                <span>PITCH: <b className="text-white">{telemetry.rx}°</b></span>
              </div>
            </div>

            <div className="hidden min-[480px]:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/45 backdrop-blur-sm border border-white/5 text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-ping" />
              <span>CORE CYCLE: 21s / 360° AUTO-LOOP</span>
            </div>
          </div>

          {/* TOP RIGHT: Drag To Orbit Hint */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono text-gray-300 shadow-md flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#FACC15]" />
              <span>DRAG 360° · 5 NESTED LAYERS</span>
            </span>
          </div>

          {/* ACTIVE STAGE DETAIL OVERLAY (Displays when a stage pill is selected) */}
          {currentStageData && (
            <div className="absolute top-20 right-4 sm:right-6 z-20 max-w-[280px] sm:max-w-[320px] p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white shadow-2xl transition-all animate-in fade-in slide-in-from-right-4 duration-200 pointer-events-none">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    background: `${currentStageData.accent}20`,
                    color: currentStageData.accent,
                    border: `1px solid ${currentStageData.accent}50`,
                  }}
                >
                  STAGE {currentStageData.step}
                </span>
                <span className="font-mono text-[10px] text-gray-400 uppercase">
                  {currentStageData.name}
                </span>
              </div>
              <h4 className="font-unbounded font-bold text-sm text-white mb-1">
                {currentStageData.subtitle}
              </h4>
              <p className="font-sans text-xs text-gray-300 leading-relaxed mb-2.5">
                {currentStageData.description}
              </p>
              <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                {currentStageData.specs.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-gray-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BOTTOM CONTROL DOCK */}
          <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
            {/* Stage Filter Buttons (IDEA, DESIGN, CODE, TEST, DEPLOY) */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full p-1 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveStage(null)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeStage === null
                    ? "bg-[#FACC15] text-black shadow-md shadow-[#FACC15]/30"
                    : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                ALL LAYERS
              </button>

              {STAGES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activeStage === s.id
                      ? "bg-white text-black shadow-md"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  title={`${s.step} — ${s.name}: ${s.subtitle}`}
                >
                  <span className="text-[9px] opacity-70">{s.step}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Action Controls (Auto-Spin, Explode/Contract, Reset) */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl ml-auto">
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[11px] sm:text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isAutoRotating ? "bg-white/[0.1] text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
                title={isAutoRotating ? "Pause 360° Auto-Rotation" : "Resume 360° Auto-Rotation"}
              >
                {isAutoRotating ? <Pause size={12} className="text-[#FACC15]" /> : <Play size={12} className="text-gray-300" />}
                <span className="hidden min-[420px]:inline">{isAutoRotating ? "Pause Spin" : "Auto Spin"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[11px] sm:text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isExploded ? "bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40" : "text-gray-300 hover:text-white"
                }`}
                title={isExploded ? "Reassemble Cube Layers" : "Explode & Separate All 5 Stages"}
              >
                {isExploded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span className="hidden min-[480px]:inline">{isExploded ? "Reassemble" : "Expand Layers"}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] active:scale-95 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Reset Orientation & Assembly"
                aria-label="Reset cube orientation"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
