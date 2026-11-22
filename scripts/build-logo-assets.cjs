const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="dsBrandChrome1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#E2E8F0" />
      <stop offset="70%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>

    <linearGradient id="dsBrandChrome2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>

    <linearGradient id="dsBrandViolet1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D0FE" />
      <stop offset="30%" stop-color="#C084FC" />
      <stop offset="70%" stop-color="#9867FF" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>

    <linearGradient id="dsBrandViolet2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="60%" stop-color="#A855F7" />
      <stop offset="100%" stop-color="#E9D5FF" />
    </linearGradient>

    <filter id="dsBrandGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="#9867ff" flood-opacity="0.4" />
    </filter>
  </defs>

  <g filter="url(#dsBrandGlow)">
    <path d="M 8 10 L 17 6 L 17 38 L 8 42 Z" fill="url(#dsBrandChrome1)" />
    <path d="M 17 6 L 31 13 L 26 17 L 17 12 Z" fill="url(#dsBrandChrome2)" opacity="0.95" />
    <path d="M 31 13 L 38 21 L 38 27 L 31 35 L 26 31 L 32 25 L 32 22 L 26 17 Z" fill="url(#dsBrandChrome1)" />
    <path d="M 17 32 L 26 31 L 31 35 L 17 42 Z" fill="url(#dsBrandChrome2)" />
    <path d="M 8 10 L 17 6 L 31 13 L 29 14.5 L 17 8.5 L 9.5 12 Z" fill="#FFFFFF" opacity="0.75" />

    <path d="M 23 15 L 40 15 L 40 21 L 29 21 Z" fill="url(#dsBrandViolet1)" />
    <path d="M 25 21 L 40 29 L 36 34 L 21 26 Z" fill="url(#dsBrandViolet2)" />
    <path d="M 21 34 L 37 34 L 37 40 L 20 40 Z" fill="url(#dsBrandViolet1)" />

    <circle cx="24" cy="24" r="1.2" fill="#FFFFFF" opacity="0.9" />
  </g>
</svg>`;

const publicImgDir = path.resolve('c:/Users/user/3D Objects/dinidu-portfolio/public/assets/images');
const svgPath = path.join(publicImgDir, 'ds-logo.svg');
const pngPath = path.join(publicImgDir, 'ds-logo.png');

fs.writeFileSync(svgPath, svgContent);
console.log('Saved', svgPath);

// Create HTML harness for headless screenshot to png
const harnessHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:transparent;overflow:hidden;width:512px;height:512px;display:flex;align-items:center;justify-content:center;">
  ${svgContent}
</body>
</html>`;

const harnessPath = path.join(publicImgDir, 'logo-render-harness.html');
fs.writeFileSync(harnessPath, harnessHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --default-background-color=00000000 --screenshot="${pngPath}" --window-size=512,512 "file:///${harnessPath.replace(/\\\\/g, '/')}"`;
try {
  execSync(cmd);
  console.log('Successfully re-rendered crisp PNG to', pngPath);
} catch (e) {
  console.error('Failed to render PNG via edge:', e.message);
}
