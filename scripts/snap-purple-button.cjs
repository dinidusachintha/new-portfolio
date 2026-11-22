const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9226;
  const p = spawn(edgePath, [
    '--remote-debugging-port=' + port,
    '--headless=new',
    '--window-size=1200,800',
    'http://localhost:4173/'
  ]);

  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:' + port + '/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        res(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await call('Runtime.evaluate', {
    expression: 'if (window.__lenis) { window.__lenis.scrollTo(1800, { immediate: true }); } else { window.scrollTo(0, 1800); } window.dispatchEvent(new Event("scroll"));'
  });
  await new Promise(r => setTimeout(r, 600));

  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await call('Runtime.evaluate', {
    expression: 'sessionStorage.setItem("dinidu_intro_seen", "true"); sessionStorage.setItem("intro_seen", "true"); location.reload();'
  });
  await new Promise(r => setTimeout(r, 2000));

  await call('Runtime.evaluate', {
    expression: 'window.__lenis.scrollTo(2000, { immediate: true });'
  });
  await new Promise(r => setTimeout(r, 600));

  const clipRes = await call('Runtime.evaluate', {
    expression: '(() => { const el = document.querySelector(".floating-top"); const r = el.getBoundingClientRect(); return JSON.stringify({ x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }); })()',
    returnByValue: true
  });
  console.log('Button rect:', clipRes.result.value);
  const info = JSON.parse(clipRes.result.value);

  // Screenshot around button
  const shot = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: Math.max(0, info.x - 10), y: Math.max(0, info.y - 10), width: info.width + 20, height: info.height + 20, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\purple-scroll-button.png', Buffer.from(shot.data, 'base64'));
  console.log('Screenshot captured successfully!');
  ws.close();
  p.kill();
}
test().catch(console.error);
