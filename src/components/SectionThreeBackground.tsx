import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SectionBackgroundSide = "left" | "right";
export type SectionBackgroundPalette =
  | "cyan-violet"
  | "violet-purple"
  | "cyan-blue"
  | "emerald-cyan";

interface SectionThreeBackgroundProps {
  side: SectionBackgroundSide;
  palette?: SectionBackgroundPalette;
  className?: string;
  density?: "compact" | "normal";
}

/**
 * Creates an in-memory high-resolution radial glow texture for point nodes.
 * Eliminates square artifacts and delivers smooth neon luminescence.
 */
function createNodeGlowTexture(colorStop: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, colorStop);
    gradient.addColorStop(0.6, "rgba(152, 103, 255, 0.4)");
    gradient.addColorStop(0.85, "rgba(192, 132, 252, 0.15)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function SectionThreeBackground({
  side,
  palette = "cyan-violet",
  className = "",
  density = "normal",
}: SectionThreeBackgroundProps) {
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
    const initialHeight = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(
      46,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 32);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Palette Configuration
    let primaryColorHex: number;
    let secondaryColorHex: number;
    let glowStop: string;

    switch (palette) {
      case "violet-purple":
        primaryColorHex = 0xa855f7; // Electric Violet
        secondaryColorHex = 0xc084fc; // Soft Lavender
        glowStop = "rgba(168, 85, 247, 0.95)";
        break;
      case "cyan-blue":
        primaryColorHex = 0x38bdf8; // Cyan
        secondaryColorHex = 0x3b82f6; // Blue
        glowStop = "rgba(56, 189, 248, 0.95)";
        break;
      case "emerald-cyan":
        primaryColorHex = 0x34d399; // Emerald
        secondaryColorHex = 0x38bdf8; // Cyan
        glowStop = "rgba(52, 211, 153, 0.95)";
        break;
      case "cyan-violet":
      default:
        primaryColorHex = 0x38bdf8; // Cyan
        secondaryColorHex = 0x9867ff; // Violet
        glowStop = "rgba(56, 189, 248, 0.95)";
        break;
    }

    const colorPrimary = new THREE.Color(primaryColorHex);
    const colorSecondary = new THREE.Color(secondaryColorHex);
    const colorWhite = new THREE.Color("#f8fafc");

    // 3. Node Configuration
    const isMobile = window.innerWidth < 768;
    const nodeCount =
      density === "compact"
        ? isMobile
          ? 28
          : 45
        : isMobile
        ? 38
        : 68;

    const maxDistance = isMobile ? 4.4 : 5.4;
    const maxDistanceSq = maxDistance * maxDistance;

    interface SectionWebNode {
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

    const nodes: SectionWebNode[] = [];
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const t = Math.pow(Math.random(), 1.6);
      let x: number;

      // Position tightly along the designated border side
      if (side === "left") {
        x = isMobile ? -17 + t * 6.5 : -28 + t * 9.0;
      } else {
        x = isMobile ? 17 - t * 6.5 : 28 - t * 9.0;
      }

      const y = (Math.random() - 0.5) * (isMobile ? 22 : 30);
      const z = (Math.random() - 0.5) * 6.5;

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

      // Subtle gradient color mapping based on proximity to the border edge
      const edgeDistanceRatio =
        side === "left" ? (x + 28) / 9.0 : (28 - x) / 9.0;
      const rand = Math.random();
      let nodeCol: THREE.Color;

      if (edgeDistanceRatio < 0.35) {
        nodeCol = rand < 0.7 ? colorPrimary : colorWhite;
      } else if (edgeDistanceRatio < 0.7) {
        nodeCol = rand < 0.6 ? colorPrimary : colorSecondary;
      } else {
        nodeCol = rand < 0.7 ? colorSecondary : colorPrimary;
      }

      nodeColors[i * 3] = nodeCol.r;
      nodeColors[i * 3 + 1] = nodeCol.g;
      nodeColors[i * 3 + 2] = nodeCol.b;
    }

    const nodeTexture = createNodeGlowTexture(glowStop);
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3)
    );
    nodesGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: isMobile ? 1.05 : 1.3,
      map: nodeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    scene.add(nodesMesh);

    // 4. Dynamic Laser Line Segments
    const maxLineSegments = Math.min(nodeCount * 7, 350);
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
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // 5. Interactive Cursor Tracking (Relative to this Section Container)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      // Only respond when hovering within or nearby this section
      if (
        clientY >= rect.top - 150 &&
        clientY <= rect.bottom + 150 &&
        clientX >= rect.left &&
        clientX <= rect.right
      ) {
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetMouseX = Math.max(-1.2, Math.min(1.2, nx));
        targetMouseY = Math.max(-1.2, Math.min(1.2, ny));
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // 6. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 7. Visibility Observer: Pause rendering when out of viewport for maximum performance
    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.02, rootMargin: "60px 0px 60px 0px" }
    );
    visibilityObserver.observe(container);

    // 8. Master Animation Loop (Delta-Time Independent)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Damped mouse interpolation
      currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.06);
      currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.06);

      // Subtle 3D Parallax Tilt
      if (!prefersReducedMotion) {
        camera.position.x = currentMouseX * 1.8;
        camera.position.y = currentMouseY * 1.4;
        camera.lookAt(currentMouseX * 0.8, currentMouseY * 0.6, 0);
      }

      const mouseWorldX = currentMouseX * 22;
      const mouseWorldY = currentMouseY * 14;

      const posAttr = nodesGeo.attributes.position as THREE.BufferAttribute;
      const nodePosArray = posAttr.array as Float32Array;

      let lineVertexIndex = 0;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        // Harmonious breathing floating animation
        const breatheX = Math.sin(elapsedTime * 0.75 + node.phase) * 0.16;
        const breatheY = Math.cos(elapsedTime * 0.85 + node.phase) * 0.2;

        let targetX = node.baseX + breatheX;
        let targetY = node.baseY + breatheY;

        // Interactive elastic cursor displacement
        if (!prefersReducedMotion) {
          const dx = targetX - mouseWorldX;
          const dy = targetY - mouseWorldY;
          const distMouse = Math.sqrt(dx * dx + dy * dy);

          if (distMouse < 7.5) {
            const force = (1 - distMouse / 7.5) * 0.09;
            targetX += dx * force;
            targetY += dy * force;
          }
        }

        node.x = THREE.MathUtils.lerp(node.x, targetX, 0.08);
        node.y = THREE.MathUtils.lerp(node.y, targetY, 0.08);

        nodePosArray[i * 3] = node.x;
        nodePosArray[i * 3 + 1] = node.y;
        nodePosArray[i * 3 + 2] = node.z;

        // Connect nearby nodes with dynamic laser filaments
        for (let j = i + 1; j < nodeCount; j++) {
          if (lineVertexIndex / 6 >= maxLineSegments) break;

          const other = nodes[j];
          const distSq =
            (node.x - other.x) * (node.x - other.x) +
            (node.y - other.y) * (node.y - other.y) +
            (node.z - other.z) * (node.z - other.z);

          if (distSq < maxDistanceSq) {
            const alpha =
              Math.pow(1 - distSq / maxDistanceSq, 1.3) * 0.72;

            linePositions[lineVertexIndex] = node.x;
            linePositions[lineVertexIndex + 1] = node.y;
            linePositions[lineVertexIndex + 2] = node.z;

            lineColors[lineVertexIndex] = colorPrimary.r * alpha;
            lineColors[lineVertexIndex + 1] = colorPrimary.g * alpha;
            lineColors[lineVertexIndex + 2] = colorPrimary.b * alpha;

            linePositions[lineVertexIndex + 3] = other.x;
            linePositions[lineVertexIndex + 4] = other.y;
            linePositions[lineVertexIndex + 5] = other.z;

            lineColors[lineVertexIndex + 3] = colorSecondary.r * alpha;
            lineColors[lineVertexIndex + 4] = colorSecondary.g * alpha;
            lineColors[lineVertexIndex + 5] = colorSecondary.b * alpha;

            lineVertexIndex += 6;
          }
        }
      }

      posAttr.needsUpdate = true;

      const linesPosAttr = linesGeo.attributes.position as THREE.BufferAttribute;
      const linesColAttr = linesGeo.attributes.color as THREE.BufferAttribute;

      linesPosAttr.needsUpdate = true;
      linesColAttr.needsUpdate = true;
      linesGeo.setDrawRange(0, lineVertexIndex / 3);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup Resources
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
      nodeTexture.dispose();
      renderer.dispose();
    };
  }, [side, palette, density]);

  // Subtle directional fade vignette so the side with the animation is clear and the opposite side blends away
  const vignetteBackground =
    side === "left"
      ? "linear-gradient(to right, rgba(8, 8, 12, 0.0) 0%, rgba(8, 8, 12, 0.2) 20%, rgba(8, 8, 12, 0.75) 55%, rgba(8, 8, 12, 0.96) 100%)"
      : "linear-gradient(to left, rgba(8, 8, 12, 0.0) 0%, rgba(8, 8, 12, 0.2) 20%, rgba(8, 8, 12, 0.75) 55%, rgba(8, 8, 12, 0.96) 100%)";

  return (
    <div
      ref={containerRef}
      className={`section-three-bg-container absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: vignetteBackground }}
      />
    </div>
  );
}
