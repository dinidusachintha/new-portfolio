const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9229;
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

  // Inject session storage before page loads
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: 'sessionStorage.setItem("dinidu_portfolio_intro_played", "true");'
  });

  await call('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2500));

  // Scroll to marquee strip
  await call('Runtime.evaluate', {
    expression: '(() => { const el = document.querySelector(".focus-marquee-strip"); if (el) el.scrollIntoView({ block: "center", behavior: "instant" }); })()'
  });
  // Wait for items including Git & GitHub Actions to flow into center lens
  await new Promise(r => setTimeout(r, 6000));

  // Check positions of items near center
  const positionsRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll(".focus-marquee-item")).map(el => {
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent.trim(),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          isFocused: el.classList.contains("is-focused")
        };
      }).filter(i => i.left > 200 && i.left < 1200).sort((a,b) => a.left - b.left);
      return JSON.stringify(items);
    })()`,
    returnByValue: true
  });
  console.log('Visible items near center:', positionsRes.result.value);

  // Capture screenshot of focus marquee strip
  const stripRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(".focus-marquee-strip");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return JSON.stringify({ x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) });
    })()`,
    returnByValue: true
  });
  console.log('Strip rect:', stripRes.result.value);

  if (stripRes.result.value) {
    const rect = JSON.parse(stripRes.result.value);
    const shot = await call('Page.captureScreenshot', {
      format: 'png',
      clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 }
    });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\focus-marquee-spaced.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved focus-marquee-spaced.png successfully!');
  }

  ws.close();
  p.kill();
}

test().catch(console.error);
