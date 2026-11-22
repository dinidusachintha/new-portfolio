interface BrandLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export default function BrandLogo({
  className = "w-full h-full",
  size,
  glow = true,
}: BrandLogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={className}
      style={style}
      fill="none"
      aria-label="Dinidu Sachintha - Brand Monogram"
    >
      <defs>
        {/* Polished Liquid Chrome Bevel Gradient (The 'D' Monogram) */}
        <linearGradient id="dsBrandChrome1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        <linearGradient id="dsBrandChrome2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Signature Electric Violet Gradient (The 'S' Monogram) */}
        <linearGradient id="dsBrandViolet1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D0FE" />
          <stop offset="30%" stopColor="#C084FC" />
          <stop offset="70%" stopColor="#9867FF" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        <linearGradient id="dsBrandViolet2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="60%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>

        {/* Ambient Specular Glow */}
        {glow && (
          <filter id="dsBrandGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="1.5"
              stdDeviation="2.5"
              floodColor="#9867ff"
              floodOpacity="0.4"
            />
          </filter>
        )}
      </defs>

      <g filter={glow ? "url(#dsBrandGlow)" : undefined}>
        {/* ============================================================== */}
        {/* THE 'D' ARCHITECTURE: Chrome Multi-Faceted Monogram Blade       */}
        {/* ============================================================== */}
        {/* Vertical Left Spine Column */}
        <path
          d="M 8 10 L 17 6 L 17 38 L 8 42 Z"
          fill="url(#dsBrandChrome1)"
        />
        {/* Upper Faceted Chamfer Arch */}
        <path
          d="M 17 6 L 31 13 L 26 17 L 17 12 Z"
          fill="url(#dsBrandChrome2)"
          opacity="0.95"
        />
        {/* Outer Curved Aerodynamic Bowl */}
        <path
          d="M 31 13 L 38 21 L 38 27 L 31 35 L 26 31 L 32 25 L 32 22 L 26 17 Z"
          fill="url(#dsBrandChrome1)"
        />
        {/* Lower Faceted Chamfer Arch */}
        <path
          d="M 17 32 L 26 31 L 31 35 L 17 42 Z"
          fill="url(#dsBrandChrome2)"
        />

        {/* Specular White Chrome Edge Highlight */}
        <path
          d="M 8 10 L 17 6 L 31 13 L 29 14.5 L 17 8.5 L 9.5 12 Z"
          fill="#FFFFFF"
          opacity="0.75"
        />

        {/* ============================================================== */}
        {/* THE 'S' ARCHITECTURE: Intertwined Vivid Electric Violet Ribbon   */}
        {/* ============================================================== */}
        {/* Top S Horizontal Segment */}
        <path
          d="M 23 15 L 40 15 L 40 21 L 29 21 Z"
          fill="url(#dsBrandViolet1)"
        />
        {/* Center Diagonal Bridge Traversing Through D */}
        <path
          d="M 25 21 L 40 29 L 36 34 L 21 26 Z"
          fill="url(#dsBrandViolet2)"
        />
        {/* Bottom S Horizontal Segment */}
        <path
          d="M 21 34 L 37 34 L 37 40 L 20 40 Z"
          fill="url(#dsBrandViolet1)"
        />

        {/* Micro Neon Apex Accent */}
        <circle cx="24" cy="24" r="1.2" fill="#FFFFFF" opacity="0.9" />
      </g>
    </svg>
  );
}
