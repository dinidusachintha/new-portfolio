const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function getWsUrl(port) {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find(t => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('Could not connect to browser CDP port');
}

async function snapHero() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9242;
  const artifactsDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de';

  const p = spawn(bin, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--window-size=1440,900',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1500));
    const wsUrl = await getWsUrl(port);
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const fn = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', fn);
            resolve(msg);
          }
        };
        ws.addEventListener('message', fn);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `sessionStorage.setItem('portfolio_intro_seen', 'true');`
    });

    await send('Page.navigate', { url: 'http://localhost:4173/' });
    // Wait 3.5s for video frame and intro to settle
    await new Promise(r => setTimeout(r, 3500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-hero-verified.png'), Buffer.from(shot.result.data, 'base64'));
    console.log('Hero screenshot successfully captured and saved!');

    ws.close();
  } finally {
    p.kill();
  }
}

snapHero().catch(console.error);
