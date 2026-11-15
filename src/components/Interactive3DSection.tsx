import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Boxes,
  Cpu,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

type RenderMode = "glass" | "wireframe" | "particles";

/**
 * Creates an in-memory high-res radial glow sprite for Three.js particles.
 */
function createParticleGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.25, "rgba(168, 85, 247, 0.9)");
    gradient.addColorStop(0.6, "rgba(56, 189, 248, 0.35)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Interactive3DSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // User interactive state
  const [renderMode, setRenderMode] = useState<RenderMode>("glass");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [telemetry, setTelemetry] = useState({ rx: "0.0", ry: "0.0", rz: "0.0", fps: 60 });

  // Refs for animation loop communication
  const modeRef = useRef<RenderMode>("glass");
  modeRef.current = renderMode;

  const autoRotateRef = useRef(true);
  autoRotateRef.current = isAutoRotating;

  const explodedRef = useRef(false);
  explodedRef.current = isExploded;

  const resetTriggerRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 620;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 28);
    camera.lookAt(0, 0, 0);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 3. Dynamic Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.6);
    scene.add(ambientLight);

    const dirLightViolet = new THREE.DirectionalLight(0xa855f7, 3.2);
    dirLightViolet.position.set(24, 28, 20);
    scene.add(dirLightViolet);

    const dirLightCyan = new THREE.DirectionalLight(0x38bdf8, 2.6);
    dirLightCyan.position.set(-24, -20, 24);
    scene.add(dirLightCyan);

    const coreLight = new THREE.PointLight(0xffffff, 2.0, 35);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 4. Master 3D Model Hierarchy
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- Sub-element A: Complex Mathematical Torus Knot Core ---
    const torusKnotGeo = new THREE.TorusKnotGeometry(5.8, 1.65, 140, 28, 2, 3);

    // Material 1: Obsidian Glass with High-Transmission Refraction
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0c0a1a,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const torusMesh = new THREE.Mesh(torusKnotGeo, glassMaterial);
    masterGroup.add(torusMesh);

    // Wireframe Shell
    const wireframeGeo = new THREE.WireframeGeometry(torusKnotGeo);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x9867ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
    masterGroup.add(wireframeMesh);

    // --- Sub-element B: Pulsating Quantum Inner Polyhedron ---
    const innerIcoGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const innerIcoMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: true,
    });
    const innerIcoMesh = new THREE.Mesh(innerIcoGeo, innerIcoMat);
    masterGroup.add(innerIcoMesh);

    // --- Sub-element C: Gyroscopic Concentric Gimbal Rings ---
    const ringMat1 = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const ringMat2 = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const ringMat3 = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const ring1 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new THREE.Path().absarc(0, 0, 9.8, 0, Math.PI * 2, true).getPoints(80)
    ), ringMat1);

    const ring2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new THREE.Path().absarc(0, 0, 11.6, 0, Math.PI * 2, true).getPoints(80)
    ), ringMat2);

    const ring3 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new THREE.Path().absarc(0, 0, 13.4, 0, Math.PI * 2, true).getPoints(80)
    ), ringMat3);

    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;

    masterGroup.add(ring1);
    masterGroup.add(ring2);
    masterGroup.add(ring3);

    // --- Sub-element D: Orbiting Satellite Data Nodes ---
    const satelliteCount = 14;
    const satellitesGroup = new THREE.Group();
    masterGroup.add(satellitesGroup);

    const satGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const satellites: { mesh: THREE.Mesh; angle: number; speed: number; radius: number; yOffset: number }[] = [];
    for (let i = 0; i < satelliteCount; i++) {
      const mesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satelliteCount) * Math.PI * 2;
      const radius = 9.5 + (i % 3) * 1.8;
      const yOffset = ((i % 5) - 2) * 1.4;
      mesh.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      satellitesGroup.add(mesh);
      satellites.push({
        mesh,
        angle,
        speed: 0.008 + (i % 4) * 0.004,
        radius,
        yOffset,
      });
    }

    // --- Sub-element E: Dynamic Particle Cloud (for Particles Mode) ---
    const glowTexture = createParticleGlowTexture();
    const particleCount = 1800;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginalPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const tempV = new THREE.Vector3();
    const posAttr = torusKnotGeo.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const sampleIdx = Math.floor(Math.random() * posAttr.count);
      tempV.fromBufferAttribute(posAttr, sampleIdx);
      // Small jitter around surface
      tempV.x += (Math.random() - 0.5) * 0.6;
      tempV.y += (Math.random() - 0.5) * 0.6;
      tempV.z += (Math.random() - 0.5) * 0.6;

      particlePositions[i * 3] = tempV.x;
      particlePositions[i * 3 + 1] = tempV.y;
      particlePositions[i * 3 + 2] = tempV.z;

      particleOriginalPositions[i * 3] = tempV.x;
      particleOriginalPositions[i * 3 + 1] = tempV.y;
      particleOriginalPositions[i * 3 + 2] = tempV.z;

      const norm = Math.random();
      if (norm < 0.5) {
        particleColors[i * 3] = 0.596;
        particleColors[i * 3 + 1] = 0.404;
        particleColors[i * 3 + 2] = 1.0; // Violet
      } else {
        particleColors[i * 3] = 0.22;
        particleColors[i * 3 + 1] = 0.741;
        particleColors[i * 3 + 2] = 0.973; // Cyan
      }
    }

    const particleCloudGeo = new THREE.BufferGeometry();
    const cloudPosAttr = new THREE.BufferAttribute(particlePositions, 3);
    cloudPosAttr.setUsage(THREE.DynamicDrawUsage);
    particleCloudGeo.setAttribute("position", cloudPosAttr);
    particleCloudGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleCloudMat = new THREE.PointsMaterial({
      size: 1.8,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleCloud = new THREE.Points(particleCloudGeo, particleCloudMat);
    masterGroup.add(particleCloud);

    // 5. Interactive Touch & Mouse Orbit Dragging with Damped Inertia
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    let targetRotX = 0.3;
    let targetRotY = 0.5;

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      previousPointerX = clientX;
      previousPointerY = clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      dragVelocityX = deltaX * 0.005;
      dragVelocityY = deltaY * 0.005;

      targetRotY += dragVelocityX;
      targetRotX += dragVelocityY;

      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Mouse event bindings
    const handleMouseDown = (e: MouseEvent) => {
      onPointerDown(e.clientX, e.clientY);
    };
    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };
    const handleMouseUp = () => onPointerUp();

    // Touch event bindings
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

    // 6. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 1000;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 7. Visibility Observer (Pause when off-screen)
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

    // 8. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let lastTelemetryUpdate = 0;
    let frameCount = 0;
    let fpsStart = performance.now();
    let currentFps = 60;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // FPS Counter
      frameCount++;
      const now = performance.now();
      if (now - fpsStart >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (now - fpsStart));
        frameCount = 0;
        fpsStart = now;
      }

      // Handle Reset trigger
      if (resetTriggerRef.current > 0) {
        targetRotX = 0.3;
        targetRotY = 0.5;
        resetTriggerRef.current = 0;
      }

      // Auto-rotation when not dragging
      if (autoRotateRef.current && !isDragging) {
        targetRotY += 0.0035;
        targetRotX += Math.sin(elapsedTime * 0.5) * 0.0008;
      } else if (!isDragging) {
        // Apply inertia friction
        targetRotY += dragVelocityX;
        targetRotX += dragVelocityY;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      // Smooth damped rotation
      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.08;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.08;

      // Animate concentric gimbal rings
      ring1.rotation.z += 0.008;
      ring2.rotation.x += 0.006;
      ring3.rotation.y += 0.004;

      // Inner pulsating core
      const pulseScale = 1 + Math.sin(elapsedTime * 2.5) * 0.12;
      innerIcoMesh.scale.set(pulseScale, pulseScale, pulseScale);
      innerIcoMesh.rotation.y -= 0.015;
      innerIcoMesh.rotation.x += 0.01;

      // Orbit satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = sat.yOffset + Math.sin(sat.angle * 2) * 0.6;
      });

      // Handle Exploded / Quantum Expanded State
      const targetScale = explodedRef.current ? 1.35 : 1.0;
      const targetRingSpread = explodedRef.current ? 1.45 : 1.0;
      torusMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
      wireframeMesh.scale.copy(torusMesh.scale);
      ring1.scale.lerp(new THREE.Vector3(targetRingSpread, targetRingSpread, targetRingSpread), 0.06);
      ring2.scale.copy(ring1.scale);
      ring3.scale.copy(ring1.scale);

      // Mode cross-fade transitions
      const currentMode = modeRef.current;
      if (currentMode === "glass") {
        glassMaterial.opacity = THREE.MathUtils.lerp(glassMaterial.opacity, 1.0, 0.08);
        glassMaterial.transparent = false;
        wireframeMaterial.opacity = THREE.MathUtils.lerp(wireframeMaterial.opacity, 0.45, 0.08);
        particleCloudMat.opacity = THREE.MathUtils.lerp(particleCloudMat.opacity, 0.0, 0.1);
      } else if (currentMode === "wireframe") {
        glassMaterial.opacity = THREE.MathUtils.lerp(glassMaterial.opacity, 0.08, 0.08);
        glassMaterial.transparent = true;
        wireframeMaterial.opacity = THREE.MathUtils.lerp(wireframeMaterial.opacity, 0.95, 0.08);
        particleCloudMat.opacity = THREE.MathUtils.lerp(particleCloudMat.opacity, 0.15, 0.1);
      } else if (currentMode === "particles") {
        glassMaterial.opacity = THREE.MathUtils.lerp(glassMaterial.opacity, 0.0, 0.1);
        glassMaterial.transparent = true;
        wireframeMaterial.opacity = THREE.MathUtils.lerp(wireframeMaterial.opacity, 0.08, 0.1);
        particleCloudMat.opacity = THREE.MathUtils.lerp(particleCloudMat.opacity, 0.9, 0.08);

        // Disperse particles dynamically
        const cloudArr = cloudPosAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const ox = particleOriginalPositions[i * 3];
          const oy = particleOriginalPositions[i * 3 + 1];
          const oz = particleOriginalPositions[i * 3 + 2];

          const wave = Math.sin(elapsedTime * 2.0 + i * 0.1) * 0.8;
          cloudArr[i * 3] = ox * (1.1 + wave * 0.1);
          cloudArr[i * 3 + 1] = oy * (1.1 + wave * 0.1);
          cloudArr[i * 3 + 2] = oz * (1.1 + wave * 0.1);
        }
        cloudPosAttr.needsUpdate = true;
      }

      // Update Telemetry HUD state (throttled to 10 FPS for clean UI performance)
      if (now - lastTelemetryUpdate > 100) {
        const radToDeg = 180 / Math.PI;
        setTelemetry({
          rx: ((masterGroup.rotation.x * radToDeg) % 360).toFixed(1),
          ry: ((masterGroup.rotation.y * radToDeg) % 360).toFixed(1),
          rz: ((masterGroup.rotation.z * radToDeg) % 360).toFixed(1),
          fps: currentFps,
        });
        lastTelemetryUpdate = now;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      torusKnotGeo.dispose();
      wireframeGeo.dispose();
      innerIcoGeo.dispose();
      particleCloudGeo.dispose();
      satGeo.dispose();
      glowTexture.dispose();

      glassMaterial.dispose();
      wireframeMaterial.dispose();
      innerIcoMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();
      satMat.dispose();
      particleCloudMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleResetOrientation = () => {
    resetTriggerRef.current = 1;
  };

  return (
    <section
      className="interactive-3d-lab-section relative py-20 sm:py-28 overflow-hidden"
      id="system-dynamics"
      aria-label="Interactive 3D Architectural Core Simulation"
    >
      <div className="container relative z-10">
        {/* Section Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_#a855f7]" />
              <span className="font-mono text-xs text-violet-400 font-bold uppercase tracking-widest">
                04 // INTERACTIVE 3D LAB · SYSTEM DYNAMICS
              </span>
            </div>
            <h2 className="font-unbounded font-black text-2xl sm:text-4xl text-white tracking-tight">
              Kinetic Architecture<span className="text-violet-400">.</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              High-throughput real-time WebGL simulation modeling distributed consensus,
              recursive telemetry, and topological event flow in 3D space.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-1.5">
              <Cpu size={13} className="text-cyan-400" />
              <span>3JS ACCELERATED</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{telemetry.fps} FPS</span>
            </span>
          </div>
        </div>

        {/* 3D Canvas Stage Container */}
        <div
          ref={containerRef}
          className="relative mt-8 w-full h-[520px] sm:h-[640px] rounded-3xl bg-gradient-to-b from-[#090814]/90 via-[#07060f]/95 to-black border border-violet-500/25 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(152,103,255,0.12)] overflow-hidden group select-none"
        >
          {/* Ambient Lighting Gradients */}
          <div
            className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* WebGL Canvas (Cursor grab/grabbing cursor for intuitive tactile feel) */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-grab active:cursor-grabbing relative z-10"
            title="Click and drag to rotate the 3D model in 360 degrees"
          />

          {/* TOP LEFT: Telemetry HUD Card */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none flex flex-col gap-2 font-mono text-[10px] sm:text-[11px]">
            <div className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 shadow-lg space-y-1">
              <div className="flex items-center gap-1.5 text-violet-300 font-bold">
                <Zap size={12} />
                <span>DYNAMIC EULER VECTORS</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-gray-400">
                <span>PITCH: <b className="text-white">{telemetry.rx}°</b></span>
                <span>YAW: <b className="text-white">{telemetry.ry}°</b></span>
                <span>ROLL: <b className="text-white">{telemetry.rz}°</b></span>
              </div>
            </div>

            <div className="hidden min-[480px]:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>ORBITING SATELLITES: 14 NODES ACTIVE</span>
            </div>
          </div>

          {/* TOP RIGHT: Interaction Mode Hint */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono text-gray-300 shadow-md flex items-center gap-1.5">
              <Sparkles size={12} className="text-violet-400" />
              <span>DRAG TO ORBIT 360°</span>
            </span>
          </div>

          {/* BOTTOM FLOATING CONTROL DOCK */}
          <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
            {/* Left: Render Mode Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 shadow-xl">
              <button
                type="button"
                onClick={() => setRenderMode("glass")}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  renderMode === "glass"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Obsidian Glass Core"
              >
                <Boxes size={13} />
                <span>Glass Core</span>
              </button>

              <button
                type="button"
                onClick={() => setRenderMode("wireframe")}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  renderMode === "wireframe"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Holographic Architectural Wireframe"
              >
                <Layers size={13} />
                <span>Wireframe</span>
              </button>

              <button
                type="button"
                onClick={() => setRenderMode("particles")}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  renderMode === "particles"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Quantum Particle Field"
              >
                <Sparkles size={13} />
                <span>Particles</span>
              </button>
            </div>

            {/* Right: Quick Action Buttons (Auto-rotate toggle, Expand, Reset) */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 shadow-xl">
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isAutoRotating ? "bg-white/[0.1] text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
                title={isAutoRotating ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAutoRotating ? "bg-emerald-400" : "bg-gray-500"}`} />
                <span className="hidden min-[380px]:inline">Auto-Spin</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isExploded ? "bg-cyan-950/60 text-cyan-300 border border-cyan-400/40" : "text-gray-400 hover:text-white"
                }`}
                title={isExploded ? "Contract Rings" : "Expand Orbit Rings"}
              >
                {isExploded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span className="hidden min-[420px]:inline">{isExploded ? "Contract" : "Expand"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetOrientation}
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] active:scale-95 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Reset Camera & Angle Orientation"
                aria-label="Reset 3D model orientation"
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
