import { useEffect, useRef } from "react";

export interface SynapticShiftProps {
  speed?: number;
  scale?: number;
  intensity?: number;
  color?: string;
  secondaryColor?: string;
  falloff?: number;
  complexity?: number;
  breathing?: boolean;
  isPaused?: boolean;
  className?: string;
}

export default function SynapticShift({
  speed = 0.5,
  scale = 0.5,
  intensity = 2.0,
  color = "#9867ff",
  secondaryColor = "#00e5ff",
  falloff = 1.15,
  complexity = 10,
  breathing = true,
  isPaused = false,
  className = "",
}: SynapticShiftProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Convert hex colors to RGB components
    const parseHex = (hex: string) => {
      const clean = hex.replace("#", "");
      const full =
        clean.length === 3
          ? clean
              .split("")
              .map((c) => c + c)
              .join("")
          : clean;
      const num = parseInt(full, 16);
      return [
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255,
      ];
    };

    const rgbPrimary = parseHex(color);
    const rgbSecondary = parseHex(secondaryColor);

    // Try WebGL first for high-performance organic filaments
    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (gl) {
      // Vertex Shader
      const vsSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: Glowing Neural Tendrils with Synaptic Pulses
      const fsSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_speed;
        uniform float u_scale;
        uniform float u_intensity;
        uniform float u_falloff;
        uniform int u_complexity;
        uniform int u_breathing;
        uniform vec3 u_color;
        uniform vec3 u_color2;

        // Simplex/Organic Noise helpers for neural tendril fractal structure
        vec3 hash33(vec3 p3) {
          p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
          p3 += dot(p3, p3.yxz + 33.33);
          return fract((p3.xxy + p3.yxx) * p3.zyx);
        }

        float snoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453);
          float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
          float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
          float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          uv *= u_scale * 4.2;

          float t = u_time * u_speed * 0.4;
          float breath = (u_breathing == 1) ? (0.85 + 0.25 * sin(t * 1.5)) : 1.0;

          float tendrilAccum = 0.0;
          float pulseAccum = 0.0;
          vec2 shift = uv;

          // Fractal loops for branching neural tendrils
          for (int i = 0; i < 12; i++) {
            if (i >= u_complexity) break;
            float fi = float(i);

            // Shifting coordinate space resembling organic axonal branching
            shift = abs(shift * u_falloff) - vec2(0.5, 0.45);
            float rotAngle = t * 0.15 + fi * 0.45;
            mat2 rot = mat2(cos(rotAngle), -sin(rotAngle), sin(rotAngle), cos(rotAngle));
            shift = rot * shift;

            // Distance to neural filament line
            float d = length(shift) * 0.85;
            float filament = 0.018 / (d + 0.012);

            // Electrical synaptic pulse traveling down the line
            float pulseWave = sin(fi * 1.7 - t * 3.5 + shift.x * 4.0);
            float pulse = smoothstep(0.75, 1.0, pulseWave) * filament * 1.8;

            tendrilAccum += filament;
            pulseAccum += pulse;
          }

          tendrilAccum = pow(tendrilAccum * 0.12, u_intensity) * breath;
          pulseAccum = pulseAccum * breath;

          // Color blending: Violet base with electric cyan for synaptic pulses & core junctions
          vec3 finalColor = mix(u_color * tendrilAccum, u_color2 * (tendrilAccum + pulseAccum * 2.0), clamp(pulseAccum, 0.0, 1.0));
          finalColor += u_color * pulseAccum * 0.8;

          // Vignette edge falloff for seamless background integration
          vec2 normUV = gl_FragCoord.xy / u_resolution.xy;
          float vignette = smoothstep(0.0, 0.35, normUV.x) * smoothstep(1.0, 0.65, normUV.x) *
                           smoothstep(0.0, 0.35, normUV.y) * smoothstep(1.0, 0.65, normUV.y);

          finalColor *= vignette;

          gl_FragColor = vec4(finalColor, min(1.0, length(finalColor) * 1.4));
        }
      `;

      const createShader = (type: number, src: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
      }

      gl.useProgram(program);

      // Full-screen quad
      const posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const aPos = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, "u_resolution");
      const uTime = gl.getUniformLocation(program, "u_time");
      const uSpeed = gl.getUniformLocation(program, "u_speed");
      const uScale = gl.getUniformLocation(program, "u_scale");
      const uIntensity = gl.getUniformLocation(program, "u_intensity");
      const uFalloff = gl.getUniformLocation(program, "u_falloff");
      const uComplexity = gl.getUniformLocation(program, "u_complexity");
      const uBreathing = gl.getUniformLocation(program, "u_breathing");
      const uColor = gl.getUniformLocation(program, "u_color");
      const uColor2 = gl.getUniformLocation(program, "u_color2");

      let accumulatedTime = 0;
      let lastFrameTime = performance.now();
      let animId: number = 0;

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const isCoarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
        const dpr = isCoarse ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
        width = Math.floor(rect.width * dpr);
        height = Math.floor(rect.height * dpr);
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      const loop = (now: number) => {
        if (!isVisible || document.hidden) {
          animId = 0;
          return;
        }

        const delta = (now - lastFrameTime) / 1000;
        lastFrameTime = now;

        if (!isPaused && !prefersReducedMotion) {
          accumulatedTime += delta;
        }

        gl.useProgram(program);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, accumulatedTime);
        gl.uniform1f(uSpeed, speed);
        gl.uniform1f(uScale, scale);
        gl.uniform1f(uIntensity, intensity);
        gl.uniform1f(uFalloff, falloff);
        gl.uniform1i(uComplexity, complexity);
        gl.uniform1i(uBreathing, breathing ? 1 : 0);
        gl.uniform3f(uColor, rgbPrimary[0], rgbPrimary[1], rgbPrimary[2]);
        gl.uniform3f(uColor2, rgbSecondary[0], rgbSecondary[1], rgbSecondary[2]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animId = requestAnimationFrame(loop);
      };

      const startLoop = () => {
        if (animId === 0 && isVisible && !document.hidden) {
          lastFrameTime = performance.now();
          animId = requestAnimationFrame(loop);
        }
      };

      const stopLoop = () => {
        if (animId !== 0) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: "100px" }
      );
      io.observe(container);

      const handleVisibilityChange = () => {
        if (!document.hidden && isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      startLoop();

      return () => {
        stopLoop();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        resizeObserver.disconnect();
        io.disconnect();
        gl.deleteProgram(program);
      };
    } else {
      // 2D Canvas Fallback
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let time = 0;
      const render2D = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02 * speed;
        // Radial pulsating neural glow
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          10,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.6
        );
        grad.addColorStop(0, `${color}40`);
        grad.addColorStop(0.5, `${secondaryColor}20`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animId = requestAnimationFrame(render2D);
      };
      animId = requestAnimationFrame(render2D);
      return () => cancelAnimationFrame(animId);
    }
  }, [speed, scale, intensity, color, secondaryColor, falloff, complexity, breathing, isPaused]);

  return (
    <div
      ref={containerRef}
      className={`synaptic-shift-container absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="synaptic-shift-canvas w-full h-full block" />
    </div>
  );
}
