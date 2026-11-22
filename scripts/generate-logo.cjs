const fs = require('fs');
const path = require('path');

// Design 1: Modern Geometric Interlocking DS (Precision 45-degree chamfers, sleek chrome D & violet S)
const logoV1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">
  <defs>
    <!-- Liquid Chrome Metallic Gradient for D -->
    <linearGradient id="chromeMetal" x1="15%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#F8FAFC" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="75%" stop-color="#64748B" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>

    <!-- Electric Violet Signature Gradient for S -->
    <linearGradient id="violetElectric" x1="10%" y1="15%" x2="90%" y2="85%">
      <stop offset="0%" stop-color="#E9D5FF" />
      <stop offset="30%" stop-color="#C084FC" />
      <stop offset="70%" stop-color="#9867FF" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>

    <!-- Subtle Specular Rim Highlight -->
    <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.9)" />
      <stop offset="50%" stop-color="rgba(255,255,255,0.1)" />
      <stop offset="100%" stop-color="rgba(152,103,255,0.4)" />
    </linearGradient>

    <!-- Ambient Violet Drop Glow -->
    <filter id="violetGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#9867ff" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Group with subtle drop shadow for depth -->
  <g filter="url(#violetGlow)">
    <!-- THE D GLYPH: Clean Architectural Chrome Spine & Bowl -->
    <!-- Outer D Path -->
    <path
      d="M 18 16 C 18 13.79 19.79 12 22 12 L 44 C 58.36 12 70 23.64 70 38 C 70 47.2 65.18 55.28 57.9 59.8 L 48.6 50.5 C 53.05 47.9 56 43.3 56 38 C 56 31.37 50.63 26 44 26 L 32 26 L 32 74 C 32 79.5 28 84 22 84 C 19.79 84 18 82.21 18 80 Z"
      fill="url(#chromeMetal)"
    />

    <!-- Specular Highlight Ridge on D -->
    <path
      d="M 22 12 L 44 12 C 58.36 12 70 23.64 70 38 C 70 40 69.6 42 68.8 43.8 C 67.5 30.5 57 20 44 20 L 25 20 C 23.3 20 22 18.7 22 17 Z"
      fill="#FFFFFF"
      opacity="0.65"
    />

    <!-- THE S GLYPH: Aerodynamic Interlocking Ribbon in Electric Violet -->
    <path
      d="M 50 26 C 50 22.69 52.69 20 56 20 L 76 C 79.31 20 82 22.69 82 26 L 82 34 C 82 40.63 76.63 46 70 46 L 56 46 C 52.69 46 50 48.69 50 52 L 50 62 C 50 68.63 55.37 74 62 74 L 78 74 C 80.21 74 82 75.79 82 78 C 82 80.21 80.21 82 78 82 L 62 82 C 50.95 82 42 73.05 42 62 L 42 52 C 42 45.37 47.37 40 54 40 L 68 40 C 71.31 40 74 37.31 74 34 L 74 28 L 56 28 C 52.69 28 50 25.31 50 26 Z"
      fill="url(#violetElectric)"
    />

    <!-- Accent Chrome Shard at S intersection -->
    <path
      d="M 54 40 L 68 40 C 71.31 40 74 37.31 74 34 L 74 30 L 66 30 C 60 30 55 35 54 40 Z"
      fill="#FFFFFF"
      opacity="0.4"
    />
  </g>
</svg>`;

// Design 2: High-Precision Cybernetic / Origami Monogram "DS" (Vercel/Linear level minimalism with ultra-sharp futuristic cuts)
const logoV2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="cyberChrome" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#E2E8F0" />
      <stop offset="70%" stop-color="#94A3B8" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="cyberViolet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E9D5FF" />
      <stop offset="40%" stop-color="#A855F7" />
      <stop offset="80%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
    <linearGradient id="coreNeon" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#C084FC" />
    </linearGradient>
    <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#9867ff" flood-opacity="0.45" />
    </filter>
  </defs>

  <g filter="url(#cyberGlow)">
    <!-- Hexagonal Frame / Facet D: Left Polished Chrome Structure -->
    <!-- Spine -->
    <path
      d="M 20 18 L 32 18 L 32 82 L 20 82 Z"
      fill="url(#cyberChrome)"
    />
    <!-- D Top Arch & Angle -->
    <path
      d="M 32 18 L 54 18 L 68 32 L 68 40 L 56 40 L 48 32 L 32 32 Z"
      fill="url(#cyberChrome)"
    />
    <!-- D Bottom Arch & Angle -->
    <path
      d="M 32 68 L 48 68 L 56 60 L 68 60 L 68 68 L 54 82 L 32 82 Z"
      fill="url(#cyberChrome)"
    />

    <!-- S Dynamic Ribbon: Interlaced Electric Violet -->
    <!-- Top S Bar -->
    <path
      d="M 44 26 L 80 26 L 80 38 L 54 38 Z"
      fill="url(#cyberViolet)"
    />
    <!-- Center Diagonal Connector -->
    <path
      d="M 40 44 L 56 36 L 76 56 L 60 64 Z"
      fill="url(#cyberViolet)"
    />
    <!-- Bottom S Bar -->
    <path
      d="M 40 62 L 66 62 L 66 74 L 30 74 L 30 62 Z"
      fill="url(#cyberViolet)"
    />
    <!-- Futuristic Center Micro-slit Neon Line -->
    <path
      d="M 48 48 L 68 48"
      stroke="url(#coreNeon)"
      stroke-width="2.5"
      stroke-linecap="round"
    />
  </g>
</svg>`;

// Design 3: Ultra-Refined Modern Monogram (Continuous dynamic ribbon where D seamlessly transitions into S)
const logoV3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
  <defs>
    <!-- Liquid Chrome Gradient -->
    <linearGradient id="chromeD" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="30%" stop-color="#F1F5F9" />
      <stop offset="60%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>

    <!-- Electric Violet Signature Gradient -->
    <linearGradient id="violetS" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E9D5FF" />
      <stop offset="35%" stop-color="#C084FC" />
      <stop offset="70%" stop-color="#9867FF" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>

    <!-- Inset Rim Glint -->
    <linearGradient id="glint" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="#9867FF" flood-opacity="0.4" />
    </filter>
  </defs>

  <g filter="url(#subtleGlow)">
    <!-- D Glyph: Sleek Liquid Chrome Geometric Arc -->
    <path
      d="M 9 9 C 9 7.9 9.9 7 11 7 L 22 C 29.18 7 35 12.82 35 20 C 35 24.6 32.61 28.64 29 31 L 24.5 26.5 C 26.93 25.1 28.5 22.75 28.5 20 C 28.5 16.41 25.59 13.5 22 13.5 L 15.5 13.5 L 15.5 39 C 15.5 40.1 14.6 41 13.5 41 L 11 41 C 9.9 41 9 40.1 9 39 Z"
      fill="url(#chromeD)"
    />
    <!-- D Chrome Specular Top Highlight -->
    <path
      d="M 11 7 L 22 7 C 29.18 7 35 12.82 35 20 C 35 20.8 34.9 21.6 34.7 22.3 C 33.7 15.8 28.5 11 22 11 L 13 11 C 11.9 11 11 10.1 11 9 Z"
      fill="url(#glint)"
    />

    <!-- S Glyph: Dynamic Electric Violet Ribbon Sweeping Across -->
    <path
      d="M 23 18 C 23 16.9 23.9 16 25 16 L 36 C 37.1 16 38 16.9 38 18 L 38 23 C 38 26.31 35.31 29 32 29 L 26 29 C 24.34 29 23 30.34 23 32 L 23 35 C 23 36.66 24.34 38 26 38 L 37 C 38.1 38 39 38.9 39 40 C 39 41.1 38.1 42 37 42 L 26 C 22.13 42 19 38.87 19 35 L 19 32 C 19 28.69 21.69 26 25 26 L 31 26 C 32.66 26 34 24.66 34 23 L 34 20 L 25 20 C 23.9 20 23 19.1 23 18 Z"
      fill="url(#violetS)"
    />
    <!-- S Ambient Violet Rim Reflection -->
    <circle cx="34" cy="20" r="1.5" fill="#FFFFFF" opacity="0.8" />
  </g>
</svg>`;

// Design 4: Signature Isometric Cuboid "DS" Emblem (Modern tech aesthetic - 3D chrome facet + electric violet facet)
const logoV4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="facetChrome1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>
    <linearGradient id="facetChrome2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>
    <linearGradient id="facetViolet1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E9D5FF" />
      <stop offset="50%" stop-color="#A855F7" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="facetViolet2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#C084FC" />
    </linearGradient>
    <filter id="glowV4" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#9867ff" flood-opacity="0.45" />
    </filter>
  </defs>

  <g filter="url(#glowV4)">
    <!-- THE D WING (Left Facet in Liquid Chrome) -->
    <!-- Vertical Column -->
    <path d="M 8 10 L 17 6 L 17 38 L 8 42 Z" fill="url(#facetChrome1)" />
    <!-- Upper Angle -->
    <path d="M 17 6 L 31 13 L 26 17 L 17 12 Z" fill="url(#facetChrome2)" opacity="0.9" />
    <!-- Outer Curve/Facet -->
    <path d="M 31 13 L 38 21 L 38 27 L 31 35 L 26 31 L 32 25 L 32 22 L 26 17 Z" fill="url(#facetChrome1)" />
    <!-- Lower Angle -->
    <path d="M 17 32 L 26 31 L 31 35 L 17 42 Z" fill="url(#facetChrome2)" />

    <!-- THE S WING (Interlocking Right Facet in Electric Violet) -->
    <!-- Top S Segment -->
    <path d="M 23 15 L 40 15 L 40 21 L 29 21 Z" fill="url(#facetViolet1)" />
    <!-- Center S Diagonal Traverse -->
    <path d="M 25 21 L 40 29 L 36 34 L 21 26 Z" fill="url(#facetViolet2)" />
    <!-- Bottom S Segment -->
    <path d="M 21 34 L 37 34 L 37 40 L 20 40 Z" fill="url(#facetViolet1)" />

    <!-- Pure White Center Point Glint -->
    <circle cx="24" cy="24" r="1.2" fill="#FFFFFF" />
  </g>
</svg>`;

// Generate an HTML preview comparison page
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Logo Concepts for Dinidu Sachintha</title>
  <style>
    body { background: #08080c; color: white; font-family: sans-serif; padding: 40px; display: flex; flex-direction: column; align-items: center; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 30px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; align-items: center; width: 220px; }
    .logo-box { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 12px; margin-bottom: 16px; position: relative; }
    .small-box { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 6px; margin-bottom: 12px; position: relative; }
    .status-dot { position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; background: #10b981; border: 2px solid #08080c; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
    h3 { margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #c084fc; }
    p { font-size: 11px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.4; }
  </style>
</head>
<body>
  <h1>New Brand Monogram Candidates: DS (Dinidu Sachintha)</h1>
  <p>Replacing pixelated legacy raster logo with ultra-sharp vector monogram</p>
  <div class="grid">
    <div class="card">
      <div class="logo-box">
        <div class="status-dot"></div>
        ${logoV1}
      </div>
      <div class="small-box">
        <div class="status-dot"></div>
        ${logoV1}
      </div>
      <h3>V1: Architectural</h3>
      <p>Clean sculptural chrome D with interlocking electric violet ribbon</p>
    </div>
    <div class="card">
      <div class="logo-box">
        <div class="status-dot"></div>
        ${logoV2}
      </div>
      <div class="small-box">
        <div class="status-dot"></div>
        ${logoV2}
      </div>
      <h3>V2: Cyber Geometric</h3>
      <p>Precision 45° chamfers, linear technical aesthetic</p>
    </div>
    <div class="card">
      <div class="logo-box">
        <div class="status-dot"></div>
        ${logoV3}
      </div>
      <div class="small-box">
        <div class="status-dot"></div>
        ${logoV3}
      </div>
      <h3>V3: Liquid Ribbon</h3>
      <p>Ultra-refined continuous curve, perfectly balanced at 24px and 80px</p>
    </div>
    <div class="card">
      <div class="logo-box">
        <div class="status-dot"></div>
        ${logoV4}
      </div>
      <div class="small-box">
        <div class="status-dot"></div>
        ${logoV4}
      </div>
      <h3>V4: Isometric Emblem</h3>
      <p>Layered faceted 3D geometry with dual-material finish</p>
    </div>
  </div>
</body>
</html>`;

const outDir = 'c:/Users/user/3D Objects/dinidu-portfolio/public/assets/images';
fs.writeFileSync(path.join(outDir, 'logo-preview.html'), html);
fs.writeFileSync(path.join(outDir, 'brand-logo-v3.svg'), logoV3);
console.log('Successfully wrote logo-preview.html and brand-logo-v3.svg');
