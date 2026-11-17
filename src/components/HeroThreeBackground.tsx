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

/**
 * Helper to generate a smooth 3D elliptical trajectory curve.
 */
function createOrbitalEllipse(
  xRadius: number,
  yRadius: number,
  segments = 140
): THREE.BufferGeometry {
  const curve = new THREE.EllipseCurve(
    0,
    0,
    xRadius,
    yRadius,
    0,
    2 * Math.PI,
    false,
    0
  );
  const points = curve.getPoints(segments);
  return new THREE.BufferGeometry().setFromPoints(points);
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
    // 3. Sweeping Celestial Elliptical Orbital Curves (Matching Reference Image)
    // =========================================================================
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    // Primary Great Orbital Ellipse: Tilted up and to the right
    const orbit1Geo = createOrbitalEllipse(20.5, 11.0);
    const orbit1Mat = new THREE.LineBasicMaterial({
      color: 0x9867ff, // Electric Violet
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const orbit1 = new THREE.Line(orbit1Geo, orbit1Mat);
    orbit1.position.set(-2.0, 1.0, -4.5);
    orbit1.rotation.z = 0.44;
    orbit1.rotation.x = 0.35;
    orbit1.rotation.y = 0.15;
    orbitalGroup.add(orbit1);

    // Secondary Crossing Orbital Ellipse: Counter-tilted
    const orbit2Geo = createOrbitalEllipse(17.0, 13.0);
    const orbit2Mat = new THREE.LineBasicMaterial({
      color: 0xc084fc, // Lavender Purple
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const orbit2 = new THREE.Line(orbit2Geo, orbit2Mat);
    orbit2.position.set(-1.0, -0.5, -5.5);
    orbit2.rotation.z = -0.52;
    orbit2.rotation.y = 0.32;
    orbit2.rotation.x = -0.22;
    orbitalGroup.add(orbit2);

    // Tertiary Outer Sweeping Arc
    const orbit3Geo = createOrbitalEllipse(23.0, 8.5);
    const orbit3Mat = new THREE.LineBasicMaterial({
      color: 0x38bdf8, // Blueprint Cyan
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    const orbit3 = new THREE.Line(orbit3Geo, orbit3Mat);
    orbit3.position.set(-5.5, -2.5, -6.5);
    orbit3.rotation.z = 0.22;
    orbit3.rotation.x = 0.55;
    orbitalGroup.add(orbit3);

    // =========================================================================
    // 4. Left-Border Crystalline Neural Web (Reduced tightly to border like reference)
    // =========================================================================
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 60 : 105;
    const maxDistance = isMobile ? 4.8 : 5.8;
    const maxDistanceSq = maxDistance * maxDistance;

    interface WebNode {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
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
      let x: number;
      let y: number;
      let z: number;

      // Distribution matching reference image:
      // ~78% tightly hugs the left-most vertical border strip
      // ~14% forms the bottom-center geometric web (visible below collaborate button & portrait base)
      // ~8% grounds the bottom-left corner
      if (i < Math.floor(nodeCount * 0.78)) {
        // Tightly hugs the left border: x ranges from -31 to -21.5 on desktop, -19 to -12 on mobile
        const t = Math.pow(Math.random(), 1.7);
        x = isMobile ? -19 + t * 7.5 : -31 + t * 9.5;
        y = (Math.random() - 0.5) * (isMobile ? 24 : 32);
        z = (Math.random() - 0.5) * 8;
      } else if (i < Math.floor(nodeCount * 0.92)) {
        // Bottom-center wireframe cluster (visible between collaborate button and portrait bottom)
        x = (isMobile ? -5 : -7) + Math.random() * (isMobile ? 10 : 15);
        y = (isMobile ? -13.5 : -16.5) + Math.random() * 3.8;
        z = (Math.random() - 0.5) * 5;
      } else {
        // Grounding corner cluster right along the bottom-left border
        x = (isMobile ? -18 : -30) + Math.random() * (isMobile ? 7 : 10);
        y = (isMobile ? -14 : -17.5) + Math.random() * 3.2;
        z = (Math.random() - 0.5) * 5;
      }

      nodes.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        vz: (Math.random() - 0.5) * 0.006,
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
    // 5. Ambient Stardust Field (Scattered in Depth)
    // =========================================================================
    const dustCount = isMobile ? 50 : 85;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * (isMobile ? 40 : 60);
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

      dustVelocities[i * 3] = (Math.random() - 0.5) * 0.006;
      dustVelocities[i * 3 + 1] = 0.008 + Math.random() * 0.014;
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
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
    // 6. Fluid Cursor Interaction & Parallax Tracking
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

    // 7. Responsive Resize Handler
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

    // 8. Visibility Observer: Pause Rendering When Offscreen
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
    // 9. Master Animation Loop (Delta-Time Framerate Independent)
    // =========================================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation with damping
      currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.065);
      currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.065);

      // Camera 3D Parallax Tilt
      if (!prefersReducedMotion) {
        camera.position.x = currentMouseX * 2.8;
        camera.position.y = currentMouseY * 2.0;
        camera.lookAt(currentMouseX * 1.0, currentMouseY * 0.8, 0);
      }

      // Slow, majestic celestial orbital drift
      orbit1.rotation.z = 0.44 + Math.sin(elapsedTime * 0.12) * 0.05;
      orbit1.rotation.y = 0.15 + elapsedTime * 0.03;

      orbit2.rotation.z = -0.52 + Math.cos(elapsedTime * 0.1) * 0.04;
      orbit2.rotation.x = -0.22 + elapsedTime * 0.025;

      orbit3.rotation.z = 0.22 + Math.sin(elapsedTime * 0.08) * 0.03;

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

        // Wrap around vertically
        if (dustPosArray[i * 3 + 1] > 18) {
          dustPosArray[i * 3 + 1] = -18;
          dustPosArray[i * 3] = (Math.random() - 0.5) * 55;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Complete Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      orbit1Geo.dispose();
      orbit1Mat.dispose();
      orbit2Geo.dispose();
      orbit2Mat.dispose();
      orbit3Geo.dispose();
      orbit3Mat.dispose();

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
