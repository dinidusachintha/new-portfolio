const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9239;
  const p = spawn(edgePath, [
    '--remote-debugging-port=' + port,
    '--headless=new',
    '--window-size=1440,900'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:' + port + '/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: 'sessionStorage.setItem("dinidu_portfolio_intro_played", "true");'
  });

  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Check Global Starfield
  const starCheck = await call('Runtime.evaluate', {
    expression: '(() => { const stars = document.querySelectorAll(".star-twinkle"); return { count: stars.length, visible: stars.length > 0 && window.getComputedStyle(stars[0]).display !== "none" }; })()',
    returnByValue: true
  });
  console.log('Starfield check:', starCheck.result.value);

  // 2. Check Hero Glow Orbs
  const orbsCheck = await call('Runtime.evaluate', {
    expression: '(() => { const orbs = document.querySelectorAll(".hero-glow-orb"); return { count: orbs.length, styles: Array.from(orbs).map(o => ({ bg: window.getComputedStyle(o).backgroundImage.slice(0, 40), filter: window.getComputedStyle(o).filter, anim: window.getComputedStyle(o).animationName })) }; })()',
    returnByValue: true
  });
  console.log('Hero Orbs check:', orbsCheck.result.value);

  // 3. Check Dot Grid Spotlight in About & Contact
  const dotCheck = await call('Runtime.evaluate', {
    expression: '(() => { const grids = document.querySelectorAll(".dot-grid-spotlight"); return { count: grids.length }; })()',
    returnByValue: true
  });
  console.log('Dot Grid check:', dotCheck.result.value);

  // 4. Check Footer Perspective Grid
  const footerCheck = await call('Runtime.evaluate', {
    expression: '(() => { const plane = document.querySelector(".footer-perspective-grid-plane"); return plane ? { exists: true, anim: window.getComputedStyle(plane).animationName } : { exists: false }; })()',
    returnByValue: true
  });
  console.log('Footer Grid check:', footerCheck.result.value);

  // Screenshot Hero with Glow Orbs & Twinkling Stars
  const heroShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\hero-background-animations.png', Buffer.from(heroShot.data, 'base64'));
  console.log('Saved hero-background-animations.png!');

  // Scroll to Footer and screenshot Perspective Floor
  await call('Runtime.evaluate', {
    expression: 'document.querySelector(".have-a-system-box").scrollIntoView({ block: "center", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 600));

  const footerShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\footer-background-animations.png', Buffer.from(footerShot.data, 'base64'));
  console.log('Saved footer-background-animations.png!');

  ws.close();
  p.kill();
}

test().catch(console.error);
