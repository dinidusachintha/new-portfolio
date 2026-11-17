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
    renderer.toneMappingExposure = 1.2;

    // 3. Right-Aligned Master 3D Group
    const isMobile = window.innerWidth < 768;
    const heroRightGroup = new THREE.Group();
    heroRightGroup.position.x = isMobile ? 2.5 : 11.5;
    heroRightGroup.position.y = 0;
    scene.add(heroRightGroup);

    // 4. Central Architectural Holographic Gyroscope Orbital Rings (Right Side)
    const gyroGroup = new THREE.Group();
    heroRightGroup.add(gyroGroup);

    // Inner Ring: Electric Violet (#9867ff)
    const ring1Geo = new THREE.TorusGeometry(9.5, 0.045, 16, 90);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x9867ff,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    gyroGroup.add(ring1);

    // Middle Ring: Blueprint Cyan (#38bdf8)
    const ring2Geo = new THREE.TorusGeometry(12.5, 0.04, 16, 110);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = -Math.PI / 5;
    ring2.rotation.x = -Math.PI / 6;
    gyroGroup.add(ring2);

    // Outer Geodesic Ring: Subtle Lavender / White
    const ring3Geo = new THREE.TorusGeometry(15.5, 0.035, 16, 130);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 3;
    gyroGroup.add(ring3);

    // 5. Interactive 3D Neural Constellation Network (Right Side Cluster)
    const nodeCount = isMobile ? 60 : 105;
    const maxDistance = isMobile ? 10.5 : 12.0;
    const maxDistanceSq = maxDistance * maxDistance;

    const boundsX = isMobile ? 26 : 36;
    const boundsY = isMobile ? 22 : 26;
    const boundsZ = 18;

    interface NodeData {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
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
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.015,
      });

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

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
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    heroRightGroup.add(nodesMesh);

    // Dynamic Line Filaments
    const maxLineSegments = Math.min(nodeCount * 7, 420);
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
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    heroRightGroup.add(linesMesh);

    // 6. Floating Ambient Stardust (Right-weighted)
    const dustCount = isMobile ? 60 : 110;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * (boundsX + 12);
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * (boundsY + 10);
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * (boundsZ + 12);

      dustVelocities[i * 3] = (Math.random() - 0.5) * 0.008;
      dustVelocities[i * 3 + 1] = 0.012 + Math.random() * 0.018;
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
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    heroRightGroup.add(dustMesh);

    // 7. Smooth Mouse Parallax & Gravity Tracking
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

    // 8. Responsive Resize Handler with Dynamic Right-Side Alignment
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const mobile = window.innerWidth < 768;
      heroRightGroup.position.x = mobile ? 2.5 : 11.5;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. Visibility Observer to Pause Rendering When Offscreen
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

    // 10. Master Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.065);
      currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.065);

      // Camera Parallax
      if (!prefersReducedMotion) {
        camera.position.x = currentMouseX * 3.5;
        camera.position.y = currentMouseY * 2.5;
        camera.lookAt(currentMouseX * 1.2, currentMouseY * 1.0, 0);
      }

      // Orbital Gyroscope Rotation
      ring1.rotation.z = elapsedTime * 0.12;
      ring1.rotation.y = elapsedTime * 0.08;
      ring2.rotation.z = -elapsedTime * 0.09;
      ring2.rotation.x = elapsedTime * 0.11;
      ring3.rotation.y = elapsedTime * 0.05;

      // Local mouse position relative to the right-aligned group
      const mouseWorldX = currentMouseX * 22;
      const mouseWorldY = currentMouseY * 14;
      const localMouseX = mouseWorldX - heroRightGroup.position.x;
      const localMouseY = mouseWorldY;

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
          const dx = node.x - localMouseX;
          const dy = node.y - localMouseY;
          const distMouse = Math.sqrt(dx * dx + dy * dy);

          if (distMouse < 13.0) {
            const force = (1 - distMouse / 13.0) * 0.08;
            node.x += dx * force;
            node.y += dy * force;
          }
        }

        nodePosArray[i * 3] = node.x;
        nodePosArray[i * 3 + 1] = node.y;
        nodePosArray[i * 3 + 2] = node.z;

        // Connect nearby nodes with glowing filaments
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

    // 11. Resource Disposal
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

      {/* Asymmetric Vignette Gradient: Solid clean dark on the left for crisp typography, glowing on the right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(8, 8, 12, 0.94) 0%, rgba(8, 8, 12, 0.72) 32%, rgba(8, 8, 12, 0.18) 65%, rgba(8, 8, 12, 0.45) 100%)",
        }}
      />
    </div>
  );
}
