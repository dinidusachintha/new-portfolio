import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Creates an in-memory high-resolution radial glow texture for point nodes.
 * Eliminates square artifacts and delivers smooth neon luminescence.
 */
function createNodeGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(56, 189, 248, 0.95)"); // Electric Cyan #38bdf8
    gradient.addColorStop(0.55, "rgba(152, 103, 255, 0.5)"); // Electric Violet #9867ff
    gradient.addColorStop(0.8, "rgba(192, 132, 252, 0.2)"); // Lavender aura
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function HeroThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(
      48,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 36);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance WebGL Renderer
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

    // =========================================================================
    // 3. Left-Border Crystalline Neural Web (Strictly confined to left border)
    // =========================================================================
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 60 : 105;
    const maxDistance = isMobile ? 4.8 : 5.8;
    const maxDistanceSq = maxDistance * maxDistance;

    interface WebNode {
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      origZ: number;
      baseX: number;
      baseY: number;
      phase: number;
    }

    const nodes: WebNode[] = [];
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    const colorCyan = new THREE.Color("#38bdf8");
    const colorViolet = new THREE.Color("#9867ff");
    const colorWhite = new THREE.Color("#f8fafc");

    for (let i = 0; i < nodeCount; i++) {
      // 100% of nodes tightly confined to the left-most vertical border strip
      const t = Math.pow(Math.random(), 1.7);
      const x = isMobile ? -19 + t * 7.5 : -31 + t * 9.5;
      const y = (Math.random() - 0.5) * (isMobile ? 24 : 32);
      const z = (Math.random() - 0.5) * 8;

      nodes.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        baseX: x,
        baseY: y,
        phase: Math.random() * Math.PI * 2,
      });

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      // Outer left-border nodes glow in electric cyan / white; inner nodes transition to violet
      const normalizedX = (x + 31) / 9.5;
      const rand = Math.random();
      let nodeCol: THREE.Color;

      if (normalizedX < 0.4) {
        nodeCol = rand < 0.75 ? colorCyan : colorWhite;
      } else if (normalizedX < 0.75) {
        nodeCol = rand < 0.6 ? colorCyan : colorViolet;
      } else {
        nodeCol = rand < 0.7 ? colorViolet : colorCyan;
      }

      nodeColors[i * 3] = nodeCol.r;
      nodeColors[i * 3 + 1] = nodeCol.g;
      nodeColors[i * 3 + 2] = nodeCol.b;
    }

    const nodeTexture = createNodeGlowTexture();
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3)
    );
    nodesGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: isMobile ? 1.05 : 1.35,
      map: nodeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    scene.add(nodesMesh);

    // Dynamic Crystalline Triangular Line Segments
    const maxLineSegments = Math.min(nodeCount * 8, 480);
    const linePositions = new Float32Array(maxLineSegments * 2 * 3);
    const lineColors = new Float32Array(maxLineSegments * 2 * 3);

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    linesGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // =========================================================================
    // 4. Ambient Stardust Field (Confined to Left Border Area)
    // =========================================================================
    const dustCount = isMobile ? 35 : 55;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (isMobile ? -19 : -31) + Math.random() * (isMobile ? 8.5 : 11);
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      dustVelocities[i * 3] = (Math.random() - 0.5) * 0.004;
      dustVelocities[i * 3 + 1] = 0.008 + Math.random() * 0.012;
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    const dustMat = new THREE.PointsMaterial({
      size: 0.35,
      map: nodeTexture,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // =========================================================================
    // 5. Fluid Cursor Interaction & Parallax Tracking
    // =========================================================================
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetMouseX = Math.max(-1.2, Math.min(1.2, nx));
      targetMouseY = Math.max(-1.2, Math.min(1.2, ny));
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // 6. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 7. Visibility Observer: Pause Rendering When Offscreen
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // =========================================================================
    // 8. Master Animation Loop (Delta-Time Framerate Independent)
    // =========================================================================
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation with damping
      currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.065);
      currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.065);

      // Camera 3D Parallax Tilt
      if (!prefersReducedMotion) {
        camera.position.x = currentMouseX * 2.8;
        camera.position.y = currentMouseY * 2.0;
        camera.lookAt(currentMouseX * 1.0, currentMouseY * 0.8, 0);
      }

      // Project virtual mouse coordinates in 3D world space
      const mouseWorldX = currentMouseX * 24;
      const mouseWorldY = currentMouseY * 15;

      // Update Node positions with breathing oscillation and cursor gravity
      const posAttr = nodesGeo.attributes.position as THREE.BufferAttribute;
      const nodePosArray = posAttr.array as Float32Array;

      let lineVertexIndex = 0;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        // Subtle harmonic floating motion
        const breatheX = Math.sin(elapsedTime * 0.8 + node.phase) * 0.18;
        const breatheY = Math.cos(elapsedTime * 0.9 + node.phase) * 0.22;

        let targetX = node.baseX + breatheX;
        let targetY = node.baseY + breatheY;

        // Interactive elastic cursor displacement
        if (!prefersReducedMotion) {
          const dx = targetX - mouseWorldX;
          const dy = targetY - mouseWorldY;
          const distMouse = Math.sqrt(dx * dx + dy * dy);

          if (distMouse < 8.5) {
            const force = (1 - distMouse / 8.5) * 0.1;
            targetX += dx * force;
            targetY += dy * force;
          }
        }

        node.x = THREE.MathUtils.lerp(node.x, targetX, 0.08);
        node.y = THREE.MathUtils.lerp(node.y, targetY, 0.08);

        nodePosArray[i * 3] = node.x;
        nodePosArray[i * 3 + 1] = node.y;
        nodePosArray[i * 3 + 2] = node.z;

        // Connect nearby nodes with glowing laser line segments
        for (let j = i + 1; j < nodeCount; j++) {
          if (lineVertexIndex / 6 >= maxLineSegments) break;

          const other = nodes[j];
          const distSq =
            (node.x - other.x) * (node.x - other.x) +
            (node.y - other.y) * (node.y - other.y) +
            (node.z - other.z) * (node.z - other.z);

          if (distSq < maxDistanceSq) {
            const alpha = Math.pow(1 - distSq / maxDistanceSq, 1.2) * 0.85;

            // Start vertex (Cyan bias)
            linePositions[lineVertexIndex] = node.x;
            linePositions[lineVertexIndex + 1] = node.y;
            linePositions[lineVertexIndex + 2] = node.z;

            lineColors[lineVertexIndex] = colorCyan.r * alpha;
            lineColors[lineVertexIndex + 1] = colorCyan.g * alpha;
            lineColors[lineVertexIndex + 2] = colorCyan.b * alpha;

            // End vertex (Violet bias)
            linePositions[lineVertexIndex + 3] = other.x;
            linePositions[lineVertexIndex + 4] = other.y;
            linePositions[lineVertexIndex + 5] = other.z;

            lineColors[lineVertexIndex + 3] = colorViolet.r * alpha;
            lineColors[lineVertexIndex + 4] = colorViolet.g * alpha;
            lineColors[lineVertexIndex + 5] = colorViolet.b * alpha;

            lineVertexIndex += 6;
          }
        }
      }

      posAttr.needsUpdate = true;

      // Update lines buffer geometry
      const linesPosAttr = linesGeo.attributes.position as THREE.BufferAttribute;
      const linesColAttr = linesGeo.attributes.color as THREE.BufferAttribute;

      linesPosAttr.needsUpdate = true;
      linesColAttr.needsUpdate = true;
      linesGeo.setDrawRange(0, lineVertexIndex / 3);

      // Update Stardust
      const dustPosArray = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dustPosArray[i * 3] += dustVelocities[i * 3];
        dustPosArray[i * 3 + 1] += dustVelocities[i * 3 + 1];
        dustPosArray[i * 3 + 2] += dustVelocities[i * 3 + 2];

        // Wrap around vertically within left border strip
        if (dustPosArray[i * 3 + 1] > 18) {
          dustPosArray[i * 3 + 1] = -18;
          dustPosArray[i * 3] = (isMobile ? -19 : -31) + Math.random() * (isMobile ? 8.5 : 11);
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Complete Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      nodesGeo.dispose();
      nodesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();

      nodeTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-three-canvas-container absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[22px]"
      aria-hidden="true"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Balanced Vignette: Crisp transparency along the left border and luminous contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(8, 8, 12, 0.05) 0%, rgba(8, 8, 12, 0.0) 18%, rgba(8, 8, 12, 0.6) 60%, rgba(8, 8, 12, 0.95) 100%)",
        }}
      />
    </div>
  );
}
