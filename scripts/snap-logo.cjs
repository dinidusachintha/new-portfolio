const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlUrl = 'file:///c:/Users/user/3D Objects/dinidu-portfolio/public/assets/images/brand-test.html';
const outPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\new-brand-monogram.png';
const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=600,260 "${htmlUrl}"`;
execSync(cmd);
console.log('Saved to', outPath);
