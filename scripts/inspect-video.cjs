const { spawn } = require('child_process');
async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9226;
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
      const wrap = document.querySelector(".hero-dymas-portrait-wrap");
      const frame = document.querySelector(".hero-portrait-video-frame");
      const video = document.querySelector(".hero-dymas-portrait-video");
      const orbs = document.querySelector(".hero-glow-orbs");
      return {
        wrapRect: wrap ? wrap.getBoundingClientRect() : null,
        frameRect: frame ? frame.getBoundingClientRect() : null,
        videoRect: video ? video.getBoundingClientRect() : null,
        videoComputed: video ? {
          maskImage: getComputedStyle(video).maskImage,
          webkitMaskImage: getComputedStyle(video).webkitMaskImage,
          overflow: getComputedStyle(video).overflow,
          clipPath: getComputedStyle(video).clipPath,
          filter: getComputedStyle(video).filter,
          transform: getComputedStyle(video).transform
        } : null,
        frameComputed: frame ? {
          overflow: getComputedStyle(frame).overflow,
          maskImage: getComputedStyle(frame).maskImage
        } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Video Elements Info:', JSON.stringify(info.result.value, null, 2));

  ws.close();
  p.kill();
}
test().catch(console.error);
