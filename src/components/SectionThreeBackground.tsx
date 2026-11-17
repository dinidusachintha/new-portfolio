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
 * Generates an in-memory high-definition radial glow texture for vertices.
 * Delivers clean, round, luminous laser pinpoints with soft chromatic aura.
 */
function createNodeGlowTexture(primaryColorRgb: string, secondaryColorRgb: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.12, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.28, primaryColorRgb);
    gradient.addColorStop(0.58, secondaryColorRgb);
    gradient.addColorStop(0.82, "rgba(168, 85, 247, 0.12)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
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

    // 1. Scene & Perspective Camera Setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
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
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 3. Color Palette Configuration
    let primaryColorHex: number;
    let secondaryColorHex: number;
    let primaryRgbStr: string;
    let secondaryRgbStr: string;

    switch (palette) {
      case "violet-purple":
        primaryColorHex = 0xa855f7; // Electric Violet
        secondaryColorHex = 0xc084fc; // Soft Lavender
        primaryRgbStr = "rgba(168, 85, 247, 0.95)";
        secondaryRgbStr = "rgba(192, 132, 252, 0.4)";
        break;
      case "cyan-blue":
        primaryColorHex = 0x38bdf8; // Blueprint Cyan
        secondaryColorHex = 0x3b82f6; // High-Voltage Blue
        primaryRgbStr = "rgba(56, 189, 248, 0.95)";
        secondaryRgbStr = "rgba(59, 130, 246, 0.4)";
        break;
      case "emerald-cyan":
        primaryColorHex = 0x34d399; // Mint Emerald
        secondaryColorHex = 0x38bdf8; // Blueprint Cyan
        primaryRgbStr = "rgba(52, 211, 153, 0.95)";
        secondaryRgbStr = "rgba(56, 189, 248, 0.4)";
        break;
      case "cyan-violet":
      default:
        primaryColorHex = 0x38bdf8; // Blueprint Cyan
        secondaryColorHex = 0x9867ff; // Electric Violet
        primaryRgbStr = "rgba(56, 189, 248, 0.95)";
        secondaryRgbStr = "rgba(152, 103, 255, 0.4)";
        break;
    }

    const colorPrimary = new THREE.Color(primaryColorHex);
    const colorSecondary = new THREE.Color(secondaryColorHex);
    const colorWhite = new THREE.Color(0xf8fafc);

    // 4. Parametric Node Geometry
    // Using normalized (u, v) parametric space ensures the lattice is 100% immune to
    // layout shifts, height changes, and responsive breakpoints.
    const isMobile = window.innerWidth < 768;
    const nodeCount =
      density === "compact"
        ? isMobile
          ? 28
          : 44
        : isMobile
        ? 36
        : 64;

    interface ParametricNode {
      u: number; // 0 (outermost border edge) to 1 (inward boundary of the strip)
      v: number; // -1 (top border) to +1 (bottom border)
      z: number; // depth variation
      phase: number;
      speed: number;
      isNexus: boolean; // 18% of nodes are prominent bright anchor vertices
      currentX: number;
      currentY: number;
      currentZ: number;
    }

    const nodes: ParametricNode[] = [];
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      // Non-linear bias: more nodes hug the absolute outer edge for a sharp border definition
      const u = Math.pow(Math.random(), 1.55);
      // Vertical spread from -0.92 to +0.92 of the visible frame
      const v = (Math.random() - 0.5) * 1.84;
      const z = (Math.random() - 0.5) * 4.5;
      const isNexus = Math.random() < 0.18;

      nodes.push({
        u,
        v,
        z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.5,
        isNexus,
        currentX: 0,
        currentY: 0,
        currentZ: z,
      });

      // Color mapping: Nexus nodes are bright white/primary, border nodes primary, inner nodes secondary
      let col: THREE.Color;
      if (isNexus) {
        col = colorWhite;
      } else if (u < 0.45) {
        col = Math.random() < 0.7 ? colorPrimary : colorWhite;
      } else {
        col = Math.random() < 0.65 ? colorSecondary : colorPrimary;
      }

      nodeColors[i * 3] = col.r;
      nodeColors[i * 3 + 1] = col.g;
      nodeColors[i * 3 + 2] = col.b;
    }

    const nodeTexture = createNodeGlowTexture(primaryRgbStr, secondaryRgbStr);
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3)
    );
    nodesGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: isMobile ? 1.15 : 1.45,
      map: nodeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    scene.add(nodesMesh);

    // 5. Dynamic Laser Filament Line Segments
    const maxLineSegments = Math.min(nodeCount * 8, 380);
    const linePositions = new Float32Array(maxLineSegments * 2 * 3);
    const lineColors = new Float32Array(maxLineSegments * 2 * 3);

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    linesGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // 6. Interactive Cursor Tracking (Damped Elastic Physics)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      // Only calculate when hovering within the neighborhood of this section
      if (
        clientY >= rect.top - 120 &&
        clientY <= rect.bottom + 120 &&
        clientX >= rect.left &&
        clientX <= rect.right
      ) {
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetMouseX = Math.max(-1.1, Math.min(1.1, nx));
        targetMouseY = Math.max(-1.1, Math.min(1.1, ny));
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // 7. Dynamic Camera Frustum Computation Helper
    const computeFrustum = () => {
      const vFOV = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;
      return {
        halfW: visibleWidth / 2,
        halfH: visibleHeight / 2,
        visibleWidth,
        visibleHeight,
      };
    };

    // 8. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. Visibility Observer: 100% pause rendering when offscreen
    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.02, rootMargin: "80px 0px 80px 0px" }
    );
    visibilityObserver.observe(container);

    // 10. Master Animation Loop (Delta-Time Independent & Mathematically Bound)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.055);
      currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.055);

      // Subtle 3D camera parallax tilt
      if (!prefersReducedMotion) {
        camera.position.x = currentMouseX * 1.6;
        camera.position.y = currentMouseY * 1.2;
        camera.lookAt(currentMouseX * 0.7, currentMouseY * 0.5, 0);
      }

      // Compute exact visible dimensions at z = 0
      const { halfW, halfH, visibleWidth, visibleHeight } = computeFrustum();

      // Define the framing strip width (strictly 18% to 24% of the visible container width)
      const stripWidth = Math.min(visibleWidth * 0.22, isMobile ? 8.5 : 12.0);
      const maxDistance = Math.min(stripWidth * 0.85, isMobile ? 3.8 : 4.8);
      const maxDistanceSq = maxDistance * maxDistance;

      const mouseWorldX = currentMouseX * halfW;
      const mouseWorldY = currentMouseY * halfH;

      const posAttr = nodesGeo.attributes.position as THREE.BufferAttribute;
      const nodePosArray = posAttr.array as Float32Array;

      let lineVertexIndex = 0;

      // Update every node dynamically according to the visible boundaries
      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        // Base coordinate strictly mapped to the designated border
        let baseX: number;
        if (side === "left") {
          // Anchored exactly at the left border edge (-halfW) extending inward by stripWidth
          baseX = -halfW + node.u * stripWidth;
        } else {
          // Anchored exactly at the right border edge (+halfW) extending inward by stripWidth
          baseX = halfW - node.u * stripWidth;
        }

        const baseY = node.v * (halfH * 0.94);

        // Gentle organic breathing wave
        const breatheX =
          Math.sin(elapsedTime * node.speed + node.phase) * (isMobile ? 0.12 : 0.18);
        const breatheY =
          Math.cos(elapsedTime * (node.speed * 1.1) + node.phase) *
          (isMobile ? 0.15 : 0.22);

        let targetX = baseX + breatheX;
        let targetY = baseY + breatheY;

        // Interactive elastic cursor displacement
        if (!prefersReducedMotion) {
          const dx = targetX - mouseWorldX;
          const dy = targetY - mouseWorldY;
          const distMouse = Math.sqrt(dx * dx + dy * dy);

          if (distMouse < 7.0) {
            const force = (1 - distMouse / 7.0) * 0.085;
            targetX += dx * force;
            targetY += dy * force;
          }
        }

        node.currentX = THREE.MathUtils.lerp(node.currentX || targetX, targetX, 0.08);
        node.currentY = THREE.MathUtils.lerp(node.currentY || targetY, targetY, 0.08);

        nodePosArray[i * 3] = node.currentX;
        nodePosArray[i * 3 + 1] = node.currentY;
        nodePosArray[i * 3 + 2] = node.z;

        // Connect nearby nodes with dynamic laser filaments
        for (let j = i + 1; j < nodeCount; j++) {
          if (lineVertexIndex / 6 >= maxLineSegments) break;

          const other = nodes[j];
          const dx = node.currentX - other.currentX;
          const dy = node.currentY - other.currentY;
          const dz = node.z - other.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistanceSq) {
            const alpha = Math.pow(1 - distSq / maxDistanceSq, 1.35) * 0.72;

            linePositions[lineVertexIndex] = node.currentX;
            linePositions[lineVertexIndex + 1] = node.currentY;
            linePositions[lineVertexIndex + 2] = node.z;

            lineColors[lineVertexIndex] = colorPrimary.r * alpha;
            lineColors[lineVertexIndex + 1] = colorPrimary.g * alpha;
            lineColors[lineVertexIndex + 2] = colorPrimary.b * alpha;

            linePositions[lineVertexIndex + 3] = other.currentX;
            linePositions[lineVertexIndex + 4] = other.currentY;
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

    // 11. Complete Resource Cleanup
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

  // Directional gradient vignette:
  // - The outer 14% is 100% transparent and luminous where the 3D crystal web lives
  // - Between 16% and 36%, it gently falls off into deep obsidian
  // - Across the rest of the container (from 38% to 100%), it is completely dark,
  //   guaranteeing all text, cards, and interactive elements sit on a pure, clean background
  const vignetteBackground =
    side === "left"
      ? "linear-gradient(to right, rgba(8, 8, 12, 0.0) 0%, rgba(8, 8, 12, 0.02) 14%, rgba(8, 8, 12, 0.45) 24%, rgba(8, 8, 12, 0.88) 36%, rgba(8, 8, 12, 0.98) 48%, rgba(8, 8, 12, 1) 100%)"
      : "linear-gradient(to left, rgba(8, 8, 12, 0.0) 0%, rgba(8, 8, 12, 0.02) 14%, rgba(8, 8, 12, 0.45) 24%, rgba(8, 8, 12, 0.88) 36%, rgba(8, 8, 12, 0.98) 48%, rgba(8, 8, 12, 1) 100%)";

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
