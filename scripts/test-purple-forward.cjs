const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9235;
  const p = spawn(edgePath, ['--remote-debugging-port=' + port, '--headless=new', '--window-size=1440,900']);
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

  await call('Page.addScriptToEvaluateOnNewDocument', { source: 'sessionStorage.setItem("dinidu_portfolio_intro_played", "true");' });
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  // Test placing purple animated fade forward over video
  await call('Runtime.evaluate', {
    expression: `(() => {
      const style = document.createElement('style');
      style.id = 'test-forward-style';
      style.innerHTML = \`
        /* Place purple animated glow forward (higher z-index than video z-index: 3) */
        .hero-glow-orbs {
          z-index: 4 !important;
          mix-blend-mode: screen !important;
          pointer-events: none !important;
        }

        /* Forward animated purple edge glow directly crossing the video */
        .hero-video-forward-glow {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background: linear-gradient(to right,
            rgba(152, 103, 255, 0.35) 0%,
            rgba(152, 103, 255, 0.15) 30%,
            transparent 70%);
          mix-blend-mode: screen;
        }

        /* Ensure typography and buttons are topmost and crisp */
        .hero-dymas-topbar,
        .hero-dymas-bottom-left,
        .hero-dymas-bottom-right {
          position: relative;
          z-index: 10 !important;
        }
      \`;
      document.head.appendChild(style);
    })()`
  });

  await new Promise(r => setTimeout(r, 500));

  // Capture close-up of the seam where the purple fade meets the video
  const clip = { x: 532, y: 202, width: 350, height: 350, scale: 1 };
  const shotSeam = await call('Page.captureScreenshot', { format: 'png', clip });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\purple-forward-seam.png', Buffer.from(shotSeam.data, 'base64'));
  console.log('Saved purple-forward-seam.png');

  // Capture full hero
  const heroRectRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(".hero-dymas-section");
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.round(r.height) };
    })()`,
    returnByValue: true
  });
  const rect = heroRectRes.result.value;

  const shotHero = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\purple-forward-hero.png', Buffer.from(shotHero.data, 'base64'));
  console.log('Saved purple-forward-hero.png');

  ws.close();
  p.kill();
}
test().catch(console.error);
