const { spawn } = require('child_process');
const fs = require('fs');

async function check() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9245;
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

  const info = await call('Runtime.evaluate', {
    expression: `(() => {
      const wrap = document.querySelector('.hero-dymas-portrait-wrap');
      const frame = document.querySelector('.hero-portrait-video-frame');
      const video = document.querySelector('.hero-dymas-portrait-video');
      const fade = document.querySelector('.hero-purple-forward-fade');
      const dymasFrame = document.querySelector('.hero-dymas-frame');
      return {
        wrap: wrap ? wrap.getBoundingClientRect() : null,
        frame: frame ? frame.getBoundingClientRect() : null,
        video: video ? video.getBoundingClientRect() : null,
        fade: fade ? fade.getBoundingClientRect() : null,
        dymasFrame: dymasFrame ? dymasFrame.getBoundingClientRect() : null,
        videoStyle: video ? {
          objectFit: getComputedStyle(video).objectFit,
          transform: getComputedStyle(video).transform,
          mask: getComputedStyle(video).maskImage || getComputedStyle(video).webkitMaskImage,
          filter: getComputedStyle(video).filter
        } : null,
        frameStyle: frame ? {
          overflow: getComputedStyle(frame).overflow,
          mask: getComputedStyle(frame).maskImage || getComputedStyle(frame).webkitMaskImage
        } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM info:', JSON.stringify(info.result.value, null, 2));

  // Let's capture hero screenshot
  const shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\current-hero-full.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved current-hero-full.png');

  ws.close();
  p.kill();
}
check().catch(console.error);
