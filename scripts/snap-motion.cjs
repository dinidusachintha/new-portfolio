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

async function snapMotion() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9246;
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
    await new Promise(r => setTimeout(r, 3000));

    // Scroll strip into view
    await send('Runtime.evaluate', {
      expression: `
        const strip = document.querySelector('.focus-marquee-strip');
        strip?.scrollIntoView({ block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 500));

    // Get strip bounding box
    const clipData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const strip = document.querySelector('.focus-marquee-strip');
          const r = strip.getBoundingClientRect();
          return {
            x: Math.max(0, r.left),
            y: Math.max(0, r.top - 20),
            width: r.width,
            height: r.height + 40,
            scale: 1
          };
        })()
      `,
      returnByValue: true
    });

    const clip = clipData.result?.result?.value;

    // Frame 1
    const f1 = await send('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-motion-1.png'), Buffer.from(f1.result.data, 'base64'));

    // Wait 800ms
    await new Promise(r => setTimeout(r, 800));
    const f2 = await send('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-motion-2.png'), Buffer.from(f2.result.data, 'base64'));

    // Wait 800ms
    await new Promise(r => setTimeout(r, 800));
    const f3 = await send('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-motion-3.png'), Buffer.from(f3.result.data, 'base64'));

    // Full section with hero-to-about transition
    const transClip = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const strip = document.querySelector('.focus-marquee-strip');
          const r = strip.getBoundingClientRect();
          return {
            x: 0,
            y: Math.max(0, r.top - 120),
            width: 1440,
            height: 450,
            scale: 1
          };
        })()
      `,
      returnByValue: true
    });
    const fTrans = await send('Page.captureScreenshot', { format: 'png', clip: transClip.result?.result?.value });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-desktop-1440px.png'), Buffer.from(fTrans.result.data, 'base64'));

    console.log('Successfully captured motion progression and transition screenshots!');
    ws.close();
  } finally {
    p.kill();
  }
}

snapMotion().catch(console.error);
