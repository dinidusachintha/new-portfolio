const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9230;
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

  await call('Runtime.evaluate', {
    expression: `(() => {
      const style = document.createElement('style');
      style.id = 'test-fade-style';
      style.innerHTML = \`
        /* Soft violet radial glow behind photo */
        .hero-dymas-portrait-wrap::before {
          content: "";
          position: absolute;
          top: 10%;
          left: 20%;
          width: 60%;
          height: 65%;
          background: radial-gradient(circle at 50% 50%, rgba(152, 103, 255, 0.28) 0%, rgba(152, 103, 255, 0.08) 55%, transparent 75%);
          filter: blur(55px);
          pointer-events: none;
          z-index: 1;
        }

        .hero-portrait-video-frame {
          position: relative;
          z-index: 2;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%),
                              linear-gradient(to top, transparent 0%, black 14%, black 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%),
                      linear-gradient(to top, transparent 0%, black 14%, black 100%);
          mask-composite: intersect;
        }

        .hero-dymas-portrait-video {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
                              linear-gradient(to top, transparent 0%, black 16%, black 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
                      linear-gradient(to top, transparent 0%, black 16%, black 100%);
          mask-composite: intersect;
        }
      \`;
      document.head.appendChild(style);
    })()`
  });

  await new Promise(r => setTimeout(r, 500));

  // Capture desktop
  const heroRectRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(".hero-dymas-section");
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.round(r.height) };
    })()`,
    returnByValue: true
  });
  const rect = heroRectRes.result.value;

  const shot = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\hero-fade-glow-desktop.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved hero-fade-glow-desktop.png');

  // Also test mobile 390px
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));

  const shotMobile = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\hero-fade-glow-mobile.png', Buffer.from(shotMobile.data, 'base64'));
  console.log('Saved hero-fade-glow-mobile.png');

  ws.close();
  p.kill();
}
test().catch(console.error);
