const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9227;
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

  // Pluck exact pixel colors along a horizontal line crossing the left edge of the video
  const result = await call('Runtime.evaluate', {
    expression: `(() => {
      const wrap = document.querySelector(".hero-dymas-portrait-wrap");
      const video = document.querySelector(".hero-dymas-portrait-video");
      const frame = document.querySelector(".hero-portrait-video-frame");
      const r = video.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      return {
        video: { left: r.left, top: r.top, width: r.width, height: r.height },
        wrap: { left: wr.left, top: wr.top, width: wr.width, height: wr.height }
      };
    })()`,
    returnByValue: true
  });
  console.log('Geometry:', result.result.value);

  // Take a close-up screenshot around the left edge of the video
  const v = result.result.value.video;
  // Let's capture around the left edge of the video: x from v.left - 80 to v.left + 150, y from v.top + 100 to v.top + 350
  const clip = {
    x: Math.max(0, Math.round(v.left - 100)),
    y: Math.max(0, Math.round(v.top + 50)),
    width: 300,
    height: 300,
    scale: 1
  };
  console.log('Capturing clip:', clip);
  const shot = await call('Page.captureScreenshot', { format: 'png', clip });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\video-left-seam-test.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved video-left-seam-test.png');

  ws.close();
  p.kill();
}
test().catch(console.error);
