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
    gradient.addColorStop(0.2, "rgba(216, 180, 254, 0.95)"); // Soft violet-300
    gradient.addColorStop(0.5, "rgba(152, 103, 255, 0.5)"); // Electric violet
    gradient.addColorStop(0.8, "rgba(56, 189, 248, 0.18)"); // Cyan aura
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
      50,
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
    renderer.toneMappingExposure = 1.15;

    // 3. Central Architectural Holographic Gyroscope Orbital Rings
    const gyroGroup = new THREE.Group();
    scene.add(gyroGroup);

    // Inner Ring: Electric Violet (#9867ff)
    const ring1Geo = new THREE.TorusGeometry(12.5, 0.05, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x9867ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    gyroGroup.add(ring1);

    // Middle Ring: Blueprint Cyan (#38bdf8)
    const ring2Geo = new THREE.TorusGeometry(16.0, 0.045, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = -Math.PI / 5;
    ring2.rotation.x = -Math.PI / 6;
    gyroGroup.add(ring2);

    // Outer Geodesic Ring: Subtle Deep Indigo / White
    const ring3Geo = new THREE.TorusGeometry(20.0, 0.04, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 3;
    gyroGroup.add(ring3);

    // 4. Interactive 3D Neural Constellation Network (Nodes + Dynamic Laser Filaments)
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 65 : 110;
    const maxDistance = isMobile ? 12.0 : 13.5;
    const maxDistanceSq = maxDistance * maxDistance;

    // Spatial boundaries
    const boundsX = isMobile ? 32 : 46;
    const boundsY = isMobile ? 22 : 28;
    const boundsZ = 20;

    interface NodeData {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      origX: number;
      origY: number;
      origZ: number;
    }

    const nodes: NodeData[] = [];
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    const colorViolet = new THREE.Color("#9867ff");
    const colorCyan = new THREE.Color("#38bdf8");
    const colorWhite = new THREE.Color("#f8fafc");

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * boundsX;
      const y = (Math.random() - 0.5) * boundsY;
      const z = (Math.random() - 0.5) * boundsZ;

      nodes.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.015,
      });

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      // Color variation between violet, cyan, and soft white
      const rand = Math.random();
      const nodeCol =
        rand < 0.45 ? colorViolet : rand < 0.85 ? colorCyan : colorWhite;
      nodeColors[i * 3] = nodeCol.r;
      nodeColors[i * 3 + 1] = nodeCol.g;
      nodeColors[i * 3 + 2] = nodeCol.b;
    }

    const nodeGlowTexture = createNodeGlowTexture();
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3)
    );
    nodesGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: isMobile ? 1.0 : 1.25,
      map: nodeGlowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    scene.add(nodesMesh);

    // Dynamic Line Filaments (Max connections = nodeCount * (nodeCount - 1) / 2)
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
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // 5. Floating Ambient Micro-Luminous Stardust Field
    const dustCount = isMobile ? 70 : 130;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * (boundsX + 10);
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * (boundsY + 10);
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * (boundsZ + 15);

      dustVelocities[i * 3] = (Math.random() - 0.5) * 0.008;
      dustVelocities[i * 3 + 1] = 0.012 + Math.random() * 0.018; // gentle upwards drift
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    const dustMat = new THREE.PointsMaterial({
      size: 0.35,
      map: nodeGlowTexture,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // 6. Smooth Mouse & Touch Parallax / Fluid Gravity Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      // Normalize coordinates to -1 to +1 range
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetMouseX = Math.max(-1.2, Math.min(1.2, nx));
      targetMouseY = Math.max(-1.2, Math.min(1.2, ny));
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // 7. Responsive Window Resize Handler
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

    // 8. Visibility Observer: Pause rendering when off-screen to conserve GPU
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

    // 9. Master Animation Loop (Delta-Time Independent)
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
        camera.position.x = currentMouseX * 4.2;
        camera.position.y = currentMouseY * 3.2;
        camera.lookAt(currentMouseX * 1.5, currentMouseY * 1.2, 0);
      }

      // Orbital Gyroscope Rotation
      ring1.rotation.z = elapsedTime * 0.12;
      ring1.rotation.y = elapsedTime * 0.08;
      ring2.rotation.z = -elapsedTime * 0.09;
      ring2.rotation.x = elapsedTime * 0.11;
      ring3.rotation.y = elapsedTime * 0.05;

      // Projected mouse coordinates in 3D world space
      const mouseWorldX = currentMouseX * (boundsX * 0.45);
      const mouseWorldY = currentMouseY * (boundsY * 0.45);

      // Update Node positions & calculate dynamic network filaments
      const posAttr = nodesGeo.attributes.position as THREE.BufferAttribute;
      const nodePosArray = posAttr.array as Float32Array;

      let lineVertexIndex = 0;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        // Intrinsic floating drift
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Bounce gently off bounding volume
        if (node.x < -boundsX / 2 || node.x > boundsX / 2) node.vx *= -1;
        if (node.y < -boundsY / 2 || node.y > boundsY / 2) node.vy *= -1;
        if (node.z < -boundsZ / 2 || node.z > boundsZ / 2) node.vz *= -1;

        // Interactive elastic cursor displacement
        if (!prefersReducedMotion) {
          const dx = node.x - mouseWorldX;
          const dy = node.y - mouseWorldY;
          const distMouse = Math.sqrt(dx * dx + dy * dy);

          if (distMouse < 14.0) {
            const force = (1 - distMouse / 14.0) * 0.08;
            node.x += dx * force;
            node.y += dy * force;
          }
        }

        nodePosArray[i * 3] = node.x;
        nodePosArray[i * 3 + 1] = node.y;
        nodePosArray[i * 3 + 2] = node.z;

        // Connect nearby nodes with glowing laser filaments
        for (let j = i + 1; j < nodeCount; j++) {
          if (lineVertexIndex / 6 >= maxLineSegments) break;

          const other = nodes[j];
          const distSq =
            (node.x - other.x) * (node.x - other.x) +
            (node.y - other.y) * (node.y - other.y) +
            (node.z - other.z) * (node.z - other.z);

          if (distSq < maxDistanceSq) {
            const alpha = 1 - distSq / maxDistanceSq;

            // Start vertex
            linePositions[lineVertexIndex] = node.x;
            linePositions[lineVertexIndex + 1] = node.y;
            linePositions[lineVertexIndex + 2] = node.z;

            lineColors[lineVertexIndex] = colorViolet.r * alpha;
            lineColors[lineVertexIndex + 1] = colorViolet.g * alpha;
            lineColors[lineVertexIndex + 2] = colorViolet.b * alpha;

            // End vertex
            linePositions[lineVertexIndex + 3] = other.x;
            linePositions[lineVertexIndex + 4] = other.y;
            linePositions[lineVertexIndex + 5] = other.z;

            lineColors[lineVertexIndex + 3] = colorCyan.r * alpha;
            lineColors[lineVertexIndex + 4] = colorCyan.g * alpha;
            lineColors[lineVertexIndex + 5] = colorCyan.b * alpha;

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

      // Update Floating Dust
      const dustPosArray = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dustPosArray[i * 3] += dustVelocities[i * 3];
        dustPosArray[i * 3 + 1] += dustVelocities[i * 3 + 1];
        dustPosArray[i * 3 + 2] += dustVelocities[i * 3 + 2];

        // Wrap around vertically
        if (dustPosArray[i * 3 + 1] > boundsY / 2) {
          dustPosArray[i * 3 + 1] = -boundsY / 2;
          dustPosArray[i * 3] = (Math.random() - 0.5) * boundsX;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Complete Resource Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();

      nodesGeo.dispose();
      nodesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();

      nodeGlowTexture.dispose();
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

      {/* Cinematic Vignette Overlay: Keeps text and video portrait 100% crisp and readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.55) 60%, rgba(0, 0, 0, 0.94) 100%)",
        }}
      />
    </div>
  );
}
