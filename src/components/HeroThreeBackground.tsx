import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Generates an in-memory high-res radial glow texture for Three.js point particles.
 * Eliminates square sprite artifacts and produces deep neon luminescence.
 */
function createGlowSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(216, 180, 254, 0.9)"); // soft violet-300
    gradient.addColorStop(0.5, "rgba(152, 103, 255, 0.45)"); // electric violet
    gradient.addColorStop(0.75, "rgba(56, 189, 248, 0.15)"); // cyan aura
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

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(
      55,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.set(0, 16, 42);
    camera.lookAt(0, -2, -5);

    // 2. High-performance WebGL Renderer
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

    // 3. Grid Dimensions
    const isMobile = window.innerWidth < 768;
    const COLS = isMobile ? 42 : 58;
    const ROWS = isMobile ? 36 : 46;
    const SPACING_X = isMobile ? 3.0 : 2.5;
    const SPACING_Z = isMobile ? 3.0 : 2.5;
    const totalPoints = COLS * ROWS;

    // 4. Geometry & Vertex Buffers for Topographical Quantum Wave
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    // Color palettes: Electric Violet (#9867ff) to Neon Cyan (#38bdf8) to Deep Indigo (#4f46e5)
    const colorViolet = new THREE.Color("#9867ff");
    const colorCyan = new THREE.Color("#38bdf8");
    const colorIndigo = new THREE.Color("#4f46e5");
    const tempColor = new THREE.Color();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        const x = (c - COLS / 2) * SPACING_X;
        const z = (r - ROWS / 2) * SPACING_Z - 5;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // Gradient based on distance from center and depth
        const normX = Math.abs(c - COLS / 2) / (COLS / 2);
        const normZ = r / ROWS;

        if (normX < 0.45) {
          tempColor.copy(colorViolet).lerp(colorCyan, normX * 1.5);
        } else {
          tempColor.copy(colorCyan).lerp(colorIndigo, (normX - 0.45) * 1.8);
        }
        // Darken back row slightly for atmospheric depth cue
        tempColor.multiplyScalar(0.7 + (1 - normZ) * 0.4);

        colors[idx * 3] = tempColor.r;
        colors[idx * 3 + 1] = tempColor.g;
        colors[idx * 3 + 2] = tempColor.b;
      }
    }

    const waveGeometry = new THREE.BufferGeometry();
    const posAttribute = new THREE.BufferAttribute(positions, 3);
    posAttribute.setUsage(THREE.DynamicDrawUsage);
    waveGeometry.setAttribute("position", posAttribute);
    waveGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Shared particle glow sprite
    const glowTexture = createGlowSpriteTexture();

    const pointsMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.6 : 2.2,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const wavePoints = new THREE.Points(waveGeometry, pointsMaterial);
    scene.add(wavePoints);

    // 5. Constellation / Architectural Mesh Lattice Lines
    // We connect adjacent nodes horizontally and vertically using shared position buffer
    const lineIndices: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        // Horizontal segment
        if (c < COLS - 1) {
          lineIndices.push(idx, idx + 1);
        }
        // Vertical segment
        if (r < ROWS - 1) {
          lineIndices.push(idx, idx + COLS);
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", posAttribute);
    linesGeometry.setIndex(lineIndices);

    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: isMobile ? 0.12 : 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const waveLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(waveLines);

    // 6. Floating Ambient Celestial Stardust
    const starCount = isMobile ? 140 : 260;
    const starPositions = new Float32Array(starCount * 3);
    const starVelocities = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 110;
      starPositions[i * 3 + 1] = (Math.random() - 0.2) * 45;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 75;

      starVelocities[i * 3] = (Math.random() - 0.5) * 0.015;
      starVelocities[i * 3 + 1] = Math.random() * 0.02 + 0.005;
      starVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.25,
      map: glowTexture,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starParticles);

    // 7. Interactive Cursor State & Physics with Smooth Lerping
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let lastMouseMoveTime = performance.now();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      // Calculate cursor position normalized to [-1, 1]
      const relX = clientX - (rect.left + rect.width / 2);
      const relY = clientY - (rect.top + rect.height / 2);

      targetMouseX = Math.max(-1.5, Math.min(1.5, relX / (rect.width / 2)));
      targetMouseY = Math.max(-1.5, Math.min(1.5, relY / (rect.height / 2)));
      lastMouseMoveTime = performance.now();
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 9. Intersection Observer (Freeze loop when scrolled out of view to save 100% GPU)
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

    // 10. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

      // If user hasn't moved cursor for 2.5s, create an elegant subtle autonomous drifting motion
      if (now - lastMouseMoveTime > 2500) {
        const autoTime = elapsedTime * 0.45;
        targetMouseX = Math.sin(autoTime) * 0.4;
        targetMouseY = Math.cos(autoTime * 0.8) * 0.3;
      }

      // Smooth lerp towards cursor coordinates (silky fluid inertia)
      const lerpFactor = prefersReducedMotion ? 0.02 : 0.045;
      currentMouseX += (targetMouseX - currentMouseX) * lerpFactor;
      currentMouseY += (targetMouseY - currentMouseY) * lerpFactor;

      // Camera Parallax & Subtle Tilt
      camera.position.x = currentMouseX * 13;
      camera.position.y = 16 - currentMouseY * 8.5;
      camera.position.z = 42 + (currentMouseY > 0 ? currentMouseY * 4 : 0);
      camera.lookAt(0, -2, -5);
      camera.rotation.z = -currentMouseX * 0.035;

      // Wave & Ripple Physics Calculation
      const timeScale = prefersReducedMotion ? 0.3 : 0.85;
      const t = elapsedTime * timeScale;
      const posArr = posAttribute.array as Float32Array;

      // Virtual cursor coordinates projected on the 3D grid plane
      const cursorX = currentMouseX * 42;
      const cursorZ = currentMouseY * 30 - 5;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const px = posArr[idx * 3];
          const pz = posArr[idx * 3 + 2];

          // 1. Dual harmonic harmonic traveling waves
          const wave1 =
            Math.sin(px * 0.08 + t * 1.25) * Math.cos(pz * 0.08 + t * 0.95) * 3.2;
          const wave2 =
            Math.sin((px + pz) * 0.055 + t * 0.75) * 1.9;
          const baseWave = wave1 + wave2;

          // 2. Interactive fluid cursor displacement with Gaussian falloff
          const dx = px - cursorX;
          const dz = pz - cursorZ;
          const distSq = dx * dx + dz * dz;
          const dist = Math.sqrt(distSq);

          let ripple = 0;
          if (!prefersReducedMotion && dist < 35) {
            const rippleFalloff = Math.exp(-dist * 0.095);
            const rippleWave = Math.sin(dist * 0.42 - t * 3.8);
            ripple = rippleFalloff * rippleWave * 5.2;
          }

          posArr[idx * 3 + 1] = baseWave + ripple;
        }
      }
      posAttribute.needsUpdate = true;

      // Update Floating Celestial Stardust
      const starPosArr = starsGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        starPosArr[i * 3 + 1] += starVelocities[i * 3 + 1];
        starPosArr[i * 3] += starVelocities[i * 3];
        starPosArr[i * 3 + 2] += starVelocities[i * 3 + 2];

        // Wrap around vertically
        if (starPosArr[i * 3 + 1] > 35) {
          starPosArr[i * 3 + 1] = -10;
          starPosArr[i * 3] = (Math.random() - 0.5) * 110;
        }
      }
      starsGeometry.attributes.position.needsUpdate = true;

      // Rotate stardust field subtly
      starParticles.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Complete Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      waveGeometry.dispose();
      linesGeometry.dispose();
      starsGeometry.dispose();
      pointsMaterial.dispose();
      linesMaterial.dispose();
      starsMaterial.dispose();
      glowTexture.dispose();
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

      {/* Cinematic Vignette Overlay: Keeps text and video portrait perfectly crisp and readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.55) 60%, rgba(0, 0, 0, 0.94) 100%)",
        }}
      />
    </div>
  );
}
