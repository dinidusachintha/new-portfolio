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
 * Creates a smoothly chamfered / rounded 3D box geometry using ExtrudeGeometry with beveling.
 * Real glass and titanium products have beveled edges where specular highlights reflect.
 */
function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  smoothness: number
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const eps = 0.0001;
  const radiusMinus = Math.max(0.01, radius - eps);
  shape.absarc(-width / 2 + radius, -height / 2 + radius, radiusMinus, Math.PI, 1.5 * Math.PI, true);
  shape.absarc(width / 2 - radius, -height / 2 + radius, radiusMinus, 1.5 * Math.PI, 2 * Math.PI, true);
  shape.absarc(width / 2 - radius, height / 2 - radius, radiusMinus, 0, 0.5 * Math.PI, true);
  shape.absarc(-width / 2 + radius, height / 2 - radius, radiusMinus, 0.5 * Math.PI, Math.PI, true);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.1, depth - radius * 2),
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius,
    curveSegments: smoothness,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Procedurally generates an HDR studio reflection environment using PMREMGenerator.
 * This supplies physically based glass and metallic surfaces with studio reflections.
 */
function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x060913); // Deep night studio

  // Overhead Key Softbox
  const keySoftboxGeo = new THREE.PlaneGeometry(24, 24);
  const keySoftboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const keySoftbox = new THREE.Mesh(keySoftboxGeo, keySoftboxMat);
  keySoftbox.position.set(0, 18, 0);
  keySoftbox.rotation.x = Math.PI / 2;
  envScene.add(keySoftbox);

  // Warm Gold Rim Strip (#FACC15)
  const warmSoftboxGeo = new THREE.PlaneGeometry(10, 24);
  const warmSoftboxMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const warmSoftbox = new THREE.Mesh(warmSoftboxGeo, warmSoftboxMat);
  warmSoftbox.position.set(18, 0, 6);
  warmSoftbox.rotation.y = -Math.PI / 2;
  envScene.add(warmSoftbox);

  // Cool Blueprint Cyan Rim Strip
  const coolSoftboxGeo = new THREE.PlaneGeometry(12, 24);
  const coolSoftboxMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const coolSoftbox = new THREE.Mesh(coolSoftboxGeo, coolSoftboxMat);
  coolSoftbox.position.set(-18, 0, -6);
  coolSoftbox.rotation.y = Math.PI / 2;
  envScene.add(coolSoftbox);

  // Backlit Electric Violet Rim
  const violetSoftboxGeo = new THREE.PlaneGeometry(24, 10);
  const violetSoftboxMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
  const violetSoftbox = new THREE.Mesh(violetSoftboxGeo, violetSoftboxMat);
  violetSoftbox.position.set(0, -6, -18);
  envScene.add(violetSoftbox);

  const renderTarget = pmremGenerator.fromScene(envScene, 0.04);
  const texture = renderTarget.texture;

  pmremGenerator.dispose();
  keySoftboxGeo.dispose();
  keySoftboxMat.dispose();
  warmSoftboxGeo.dispose();
  warmSoftboxMat.dispose();
  coolSoftboxGeo.dispose();
  coolSoftboxMat.dispose();
  violetSoftboxGeo.dispose();
  violetSoftboxMat.dispose();

  return texture;
}

/**
 * Radial dark contact shadow texture grounded beneath the floating cube.
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.88)");
    gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.55)");
    gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.16)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates in-memory high-res radial glow sprite for Three.js particles and energy core.
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

/**
 * Realistic silicon microchip motherboard texture with gold etched bus lines.
 */
function createCircuitBoardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#070c17";
    ctx.fillRect(0, 0, 512, 512);

    // Center CPU socket frame
    ctx.fillStyle = "#0c1424";
    ctx.fillRect(192, 192, 128, 128);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 3;
    ctx.strokeRect(192, 192, 128, 128);

    // Inner silicon die
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(216, 216, 80, 80);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(216, 216, 80, 80);

    // Gold circuit traces
    ctx.strokeStyle = "rgba(250, 204, 21, 0.75)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ctx.moveTo(256 + cos * 70, 256 + sin * 70);
      ctx.lineTo(256 + cos * 150, 256 + sin * 150);
      ctx.lineTo(256 + cos * 220 + (i % 2 === 0 ? 25 : -25), 256 + sin * 220);
    }
    ctx.stroke();

    // Circuit contact pads
    ctx.fillStyle = "#facc15";
    for (let x = 40; x < 480; x += 64) {
      for (let y = 40; y < 480; y += 64) {
        if (x > 180 && x < 330 && y > 180 && y < 330) continue;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
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
      44,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 23);
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
    renderer.toneMappingExposure = 1.25;

    // 2. Realistic Studio Lighting & Environment Map Reflections
    const studioEnvTexture = createStudioEnvironment(renderer);
    scene.environment = studioEnvTexture;

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xf8fafc, 2.6);
    mainKeyLight.position.set(20, 25, 20);
    scene.add(mainKeyLight);

    const fillNavyLight = new THREE.DirectionalLight(0x0284c7, 1.9);
    fillNavyLight.position.set(-22, -18, 16);
    scene.add(fillNavyLight);

    const rimYellowLight = new THREE.DirectionalLight(0xfacc15, 2.8);
    rimYellowLight.position.set(0, -20, -22);
    scene.add(rimYellowLight);

    // Central core point light casting golden luminescence through glass layers
    const corePointLight = new THREE.PointLight(0xfacc15, 3.2, 28);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // 3. Ground Contact Shadow & Studio Pedestal Grid
    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -5.8;
    scene.add(shadowMesh);

    // Holographic Circular Studio Pedestal Floor Ring
    const floorRingGeo = new THREE.RingGeometry(5.8, 6.0, 64);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const floorRingMesh = new THREE.Mesh(floorRingGeo, floorRingMat);
    floorRingMesh.rotation.x = -Math.PI / 2;
    floorRingMesh.position.y = -5.79;
    scene.add(floorRingMesh);

    // 4. Master Cube Assembly
    const cubeMasterGroup = new THREE.Group();
    scene.add(cubeMasterGroup);

    // Shared reusable textures
    const glowTexture = createEnergyGlowTexture();
    const circuitTexture = createCircuitBoardTexture();

    // =========================================================================
    // LAYER 1: IDEA — Smooth Chamfered Glass Cube with Titanium Corner Brackets
    // =========================================================================
    const ideaGroup = new THREE.Group();
    cubeMasterGroup.add(ideaGroup);

    const ideaSize = 7.2;
    const ideaBoxGeo = createRoundedBoxGeometry(ideaSize, ideaSize, ideaSize, 0.42, 4);

    // Photorealistic Optical Glass Material with IOR, transmission and dispersion
    const ideaGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a101d, // Deep Navy
      roughness: 0.03,
      metalness: 0.05,
      transmission: 0.94,
      ior: 1.54, // Crown Optical Glass
      thickness: 2.4,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 4.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.6,
      transparent: true,
      depthWrite: false,
    });

    const ideaMesh = new THREE.Mesh(ideaBoxGeo, ideaGlassMat);
    ideaGroup.add(ideaMesh);

    // Titanium Corner Brackets (8 precision corner braces)
    const cornerBracketGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const cornerBracketMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      metalness: 0.92,
      roughness: 0.2,
      envMapIntensity: 2.2,
    });

    const halfS = ideaSize / 2;
    const cornerOffsets = [
      [-halfS, -halfS, -halfS],
      [ halfS, -halfS, -halfS],
      [ halfS,  halfS, -halfS],
      [-halfS,  halfS, -halfS],
      [-halfS, -halfS,  halfS],
      [ halfS, -halfS,  halfS],
      [ halfS,  halfS,  halfS],
      [-halfS,  halfS,  halfS],
    ];

    cornerOffsets.forEach(([cx, cy, cz]) => {
      const bracket = new THREE.Mesh(cornerBracketGeo, cornerBracketMat);
      bracket.position.set(cx, cy, cz);
      ideaGroup.add(bracket);
    });

    // Glowing Electric Yellow Bevel Edge Markers
    const cornerMarkersGeo = new THREE.BufferGeometry();
    const cornerVertices = new Float32Array(cornerOffsets.flat());
    cornerMarkersGeo.setAttribute("position", new THREE.BufferAttribute(cornerVertices, 3));
    const cornerMarkersMat = new THREE.PointsMaterial({
      size: 0.7,
      map: glowTexture,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cornerMarkers = new THREE.Points(cornerMarkersGeo, cornerMarkersMat);
    ideaGroup.add(cornerMarkers);

    // =========================================================================
    // LAYER 2: DESIGN — UI/UX & Architectural Blueprint Grid Lattice
    // =========================================================================
    const designGroup = new THREE.Group();
    cubeMasterGroup.add(designGroup);

    const designSize = 5.6;
    const designBoxGeo = createRoundedBoxGeometry(designSize, designSize, designSize, 0.3, 3);

    const designGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a, // Dark Charcoal
      roughness: 0.22,
      metalness: 0.35,
      transmission: 0.75,
      thickness: 1.6,
      ior: 1.48,
      envMapIntensity: 2.0,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const designMesh = new THREE.Mesh(designBoxGeo, designGlassMat);
    designGroup.add(designMesh);

    // Architectural Wireframe Blueprint Lines
    const rawDesignBox = new THREE.BoxGeometry(designSize, designSize, designSize);
    const designWireGeo = new THREE.WireframeGeometry(rawDesignBox);
    const designWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8, // Blueprint Cyan
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const designWire = new THREE.LineSegments(designWireGeo, designWireMat);
    designGroup.add(designWire);

    // Nested Octahedron Structural Core
    const designOctaGeo = new THREE.OctahedronGeometry(designSize * 0.48);
    const designOctaMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const designOcta = new THREE.LineSegments(new THREE.WireframeGeometry(designOctaGeo), designOctaMat);
    designGroup.add(designOcta);

    // =========================================================================
    // LAYER 3: CODE — Silicon Motherboard Wafer & Micro-Circuit Bus Traces
    // =========================================================================
    const codeGroup = new THREE.Group();
    cubeMasterGroup.add(codeGroup);

    const codeSize = 4.2;
    // Dual intersecting silicon motherboards with etched gold circuitry
    const codeBoardGeo = new THREE.BoxGeometry(codeSize, 0.1, codeSize);
    const codeBoardMat = new THREE.MeshStandardMaterial({
      map: circuitTexture,
      roughness: 0.2,
      metalness: 0.75,
      envMapIntensity: 1.8,
    });
    const codeBoard1 = new THREE.Mesh(codeBoardGeo, codeBoardMat);
    codeGroup.add(codeBoard1);

    const codeBoard2 = new THREE.Mesh(codeBoardGeo, codeBoardMat);
    codeBoard2.rotation.x = Math.PI / 2;
    codeGroup.add(codeBoard2);

    // Central CPU Silicon Processor Core
    const cpuGeo = new THREE.BoxGeometry(1.4, 0.22, 1.4);
    const cpuMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 2.2,
    });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    codeGroup.add(cpuMesh);

    // Dynamic Data Pulse Nodes (Luminous circuit nodes travelling along buses)
    const codePointsCount = 64;
    const codePointPositions = new Float32Array(codePointsCount * 3);
    for (let i = 0; i < codePointsCount; i++) {
      const angle = (i / codePointsCount) * Math.PI * 2;
      const rad = 0.8 + (i % 4) * 0.65;
      codePointPositions[i * 3] = Math.cos(angle) * rad;
      codePointPositions[i * 3 + 1] = (i % 2 === 0 ? 0.08 : -0.08);
      codePointPositions[i * 3 + 2] = Math.sin(angle) * rad;
    }
    const codePointsGeo = new THREE.BufferGeometry();
    codePointsGeo.setAttribute("position", new THREE.BufferAttribute(codePointPositions, 3));
    const codePointsMat = new THREE.PointsMaterial({
      size: 0.35,
      map: glowTexture,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const codePoints = new THREE.Points(codePointsGeo, codePointsMat);
    codeGroup.add(codePoints);

    // =========================================================================
    // LAYER 4: TEST — Precision Dual-Axis Quantum Gyroscope Gimbal Rings
    // =========================================================================
    const testGroup = new THREE.Group();
    cubeMasterGroup.add(testGroup);

    // Outer Gyroscope Ring: 24K Gold
    const outerGimbalGeo = new THREE.TorusGeometry(1.85, 0.055, 16, 80);
    const outerGimbalMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Polished Gold
      metalness: 0.96,
      roughness: 0.12,
      envMapIntensity: 2.8,
    });
    const outerGimbalMesh = new THREE.Mesh(outerGimbalGeo, outerGimbalMat);
    testGroup.add(outerGimbalMesh);

    // Inner Gyroscope Ring: Dark Titanium Gunmetal
    const innerGimbalGeo = new THREE.TorusGeometry(1.48, 0.045, 16, 80);
    const innerGimbalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Precision Cyan Titanium
      metalness: 0.98,
      roughness: 0.1,
      envMapIntensity: 2.5,
    });
    const innerGimbalMesh = new THREE.Mesh(innerGimbalGeo, innerGimbalMat);
    testGroup.add(innerGimbalMesh);

    // Gyroscope Axis Cross-Pins
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.95,
      roughness: 0.1,
    });
    const pinX = new THREE.Mesh(pinGeo, pinMat);
    pinX.rotation.z = Math.PI / 2;
    testGroup.add(pinX);

    // =========================================================================
    // LAYER 5: DEPLOY — Nuclear Plasma Energy Singularity
    // =========================================================================
    const deployGroup = new THREE.Group();
    cubeMasterGroup.add(deployGroup);

    // Radiant Hot White Core Sphere
    const coreWhiteGeo = new THREE.SphereGeometry(0.52, 32, 32);
    const coreWhiteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const coreWhite = new THREE.Mesh(coreWhiteGeo, coreWhiteMat);
    deployGroup.add(coreWhite);

    // Pulsating Golden Plasma Corona Sphere
    const coreCoronaGeo = new THREE.SphereGeometry(0.82, 32, 32);
    const coreCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const coreCorona = new THREE.Mesh(coreCoronaGeo, coreCoronaMat);
    deployGroup.add(coreCorona);

    // Orbiting Golden Spark Motes
    const sparkCount = 48;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / sparkCount);
      const theta = Math.sqrt(sparkCount * Math.PI) * phi;
      const r = 1.05 + Math.random() * 0.35;
      sparkPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      sparkPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      sparkPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.3,
      map: glowTexture,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    deployGroup.add(sparks);

    // Floating Atmospheric Ambient Dust Particles
    const dustCount = 65;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 22;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.22,
      map: glowTexture,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // =========================================================================
    // 5. Interactive Mouse & Touch Drag-To-Orbit Controls with Damping
    // =========================================================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.5;
    let targetRotationX = 0.25;
    let currentRotationY = 0.5;
    let currentRotationX = 0.25;
    let dragVelocityY = 0;
    let dragVelocityX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      dragVelocityY = 0;
      dragVelocityX = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      dragVelocityY = deltaX * 0.0065;
      dragVelocityX = deltaY * 0.0065;
      targetRotationY += dragVelocityY;
      targetRotationX += dragVelocityX;
      targetRotationX = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, targetRotationX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // =========================================================================
    // 6. Responsive Window Resize Handler
    // =========================================================================
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || 1000;
      const height = container.clientHeight || 640;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // =========================================================================
    // 7. Master Render & Animation Loop (Clock Delta Framerate-Independent)
    // =========================================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let lastTelemetryUpdate = 0;

    // Explode Layer Expansion Offsets
    let currentExplodeFactor = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Continuous 360-degree rotation (18-24 second complete cycle)
      const autoRotateSpeed = hoveredRef.current ? 0.08 : 0.28;
      if (autoRotateRef.current && !isDragging && !prefersReducedMotion) {
        targetRotationY += autoRotateSpeed * delta;
      }

      // Physics damping interpolation
      currentRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, 0.08);
      currentRotationX = THREE.MathUtils.lerp(currentRotationX, targetRotationX, 0.08);

      cubeMasterGroup.rotation.y = currentRotationY;
      cubeMasterGroup.rotation.x = currentRotationX;

      // Gentle floating levitation oscillation
      const floatY = Math.sin(elapsedTime * 1.4) * 0.22;
      cubeMasterGroup.position.y = floatY;
      shadowMesh.position.y = -5.8;
      const shadowScale = 1 - floatY * 0.15;
      shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);

      // 2. Exploded View Layer Separation Animation
      const targetExplode = explodedRef.current ? 1.0 : 0.0;
      currentExplodeFactor = THREE.MathUtils.lerp(currentExplodeFactor, targetExplode, 0.08);

      // Separate layers along spatial axes when exploded
      ideaGroup.position.x = -currentExplodeFactor * 5.2;
      designGroup.position.y = currentExplodeFactor * 4.6;
      codeGroup.position.z = currentExplodeFactor * 4.8;
      testGroup.position.x = currentExplodeFactor * 5.0;
      deployGroup.position.y = -currentExplodeFactor * 3.8;

      // 3. Layer-Specific Internal Differential Rotations
      // Outer Idea Glass: slow clockwise rotation
      ideaGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.1;

      // Design Octahedron: architectural counter-rotation
      designOcta.rotation.x = elapsedTime * 0.35;
      designOcta.rotation.y = elapsedTime * 0.5;

      // Code Motherboard: subtle data pulsation
      codeBoard1.rotation.y = Math.sin(elapsedTime * 0.6) * 0.15;
      codePoints.rotation.y = elapsedTime * 0.4;

      // Test Gyroscope Gimbal: dual-axis continuous mechanical rotation
      outerGimbalMesh.rotation.x = elapsedTime * 0.85;
      innerGimbalMesh.rotation.z = elapsedTime * 1.15;

      // Deploy Singularity Core: dynamic energy breathing pulse
      const corePulse = 1 + Math.sin(elapsedTime * 3.2) * 0.12;
      coreCorona.scale.set(corePulse, corePulse, corePulse);
      corePointLight.intensity = 3.2 + Math.sin(elapsedTime * 4.0) * 0.6;
      sparks.rotation.y = elapsedTime * 0.9;
      sparks.rotation.z = elapsedTime * 0.6;

      // Atmospheric dust drifting
      dustParticles.rotation.y = elapsedTime * 0.03;

      // 4. Hover Edge Illumination Transition
      const targetEdgeOpacity = hoveredRef.current ? 0.8 : 0.45;
      cornerMarkersMat.opacity = THREE.MathUtils.lerp(cornerMarkersMat.opacity, targetEdgeOpacity, 0.1);

      // 5. Telemetry update throttle (every 100ms)
      if (elapsedTime - lastTelemetryUpdate > 0.1) {
        lastTelemetryUpdate = elapsedTime;
        const normalizedY = ((currentRotationY * (180 / Math.PI)) % 360).toFixed(1);
        const normalizedX = (currentRotationX * (180 / Math.PI)).toFixed(1);
        setTelemetry({
          ry: normalizedY,
          rx: normalizedX,
          fps: Math.round(1 / Math.max(0.001, delta)),
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // 8. Cleanup & Resource Disposal
    // =========================================================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);

      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      // Dispose Three.js objects
      ideaBoxGeo.dispose();
      ideaGlassMat.dispose();
      cornerBracketGeo.dispose();
      cornerBracketMat.dispose();
      cornerMarkersGeo.dispose();
      cornerMarkersMat.dispose();

      designBoxGeo.dispose();
      designGlassMat.dispose();
      rawDesignBox.dispose();
      designWireGeo.dispose();
      designWireMat.dispose();
      designOctaGeo.dispose();
      designOctaMat.dispose();

      codeBoardGeo.dispose();
      codeBoardMat.dispose();
      cpuGeo.dispose();
      cpuMat.dispose();
      codePointsGeo.dispose();
      codePointsMat.dispose();

      outerGimbalGeo.dispose();
      outerGimbalMat.dispose();
      innerGimbalGeo.dispose();
      innerGimbalMat.dispose();
      pinGeo.dispose();
      pinMat.dispose();

      coreWhiteGeo.dispose();
      coreWhiteMat.dispose();
      coreCoronaGeo.dispose();
      coreCoronaMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();

      dustGeo.dispose();
      dustMat.dispose();

      shadowGeo.dispose();
      shadowMat.dispose();
      floorRingGeo.dispose();
      floorRingMat.dispose();

      shadowTexture.dispose();
      glowTexture.dispose();
      circuitTexture.dispose();
      studioEnvTexture.dispose();

      renderer.dispose();
    };
  }, []);

  // Handle stage filtering highlight
  const currentStageData = useMemo(() => {
    return STAGES.find((s) => s.id === activeStage);
  }, [activeStage]);

  const handleReset = () => {
    setActiveStage(null);
    setIsExploded(false);
    setIsAutoRotating(true);
    resetTriggerRef.current += 1;
  };

  return (
    <section
      className="relative w-full py-24 sm:py-32 bg-[#080808] text-[#f5f4f0] overflow-hidden border-t border-white/10"
      id="system-dynamics"
      aria-label="The Infinite Code Cube 3D Experience"
    >
      <div className="container relative z-10">
        {/* Section Top Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium">
            <Boxes size={13} className="text-[#FACC15]" />
            <span className="text-[#FACC15] font-bold">04 // INTERACTIVE 3D ARCHITECTURE</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-300">SYSTEM DYNAMICS</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Three.js WebGL Core Active</span>
            </span>
            <span className="text-gray-600">|</span>
            <span>60 FPS Physically Based</span>
          </div>
        </div>

        {/* Section Heading Row */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-unbounded text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              THE INFINITE <span className="text-[#FACC15]">CODE CUBE</span>.
            </h2>
            <p className="mt-3 text-gray-400 font-sans text-sm sm:text-base leading-relaxed">
              From Idea to Design, From Code to Reality. A floating transparent glass monolith
              housing five nested architectural development layers, rotating in continuous 360°
              orbit with physically based studio lighting and refraction.
            </p>
          </div>

          {/* Quick Subtitle Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
            <Sparkles size={14} className="text-[#FACC15]" />
            <span>Interactive 3D Stage Explorer</span>
          </div>
        </div>

        {/* 3D WebGL Canvas Stage Frame */}
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
