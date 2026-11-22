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

async function verifyFocusMarquee() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9245;
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

    const violations = [];
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Log.entryAdded' || msg.method === 'Console.messageAdded') {
        const text = msg.params.entry?.text || msg.params.message?.text || '';
        if (text.includes('[Violation]') || text.includes('reflow')) {
          violations.push(text);
        }
      }
    };

    await send('Log.enable');
    await send('Console.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    // Skip intro loader
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `sessionStorage.setItem('portfolio_intro_seen', 'true');`
    });

    console.log('Navigating to http://localhost:4173/ ...');
    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Verify DOM structure
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const strip = document.querySelector('.focus-marquee-strip');
          const line = document.querySelector('.focus-marquee-center-line');
          const items = document.querySelectorAll('.focus-marquee-item');
          const srList = document.querySelectorAll('.focus-marquee-section .sr-only li');
          const focused = document.querySelectorAll('.focus-marquee-item.is-focused');

          return {
            stripExists: !!strip,
            lineExists: !!line,
            itemCount: items.length,
            srCount: srList.length,
            focusedCount: focused.length,
            stripHeight: strip ? strip.offsetHeight : 0,
            hasOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DOM Check:', domCheck.result?.result?.value);

    // 2. Scroll to Focus Marquee Strip and capture high-res desktop screenshot
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const strip = document.querySelector('.focus-marquee-strip');
          window.__lenis.scrollTo(strip, { offset: -150, duration: 0.8, onComplete: resolve });
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 600));

    const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-desktop-1440px.png'), Buffer.from(shotDesktop.result.data, 'base64'));
    console.log('Saved focus-marquee-desktop-1440px.png');

    // 3. Test 768px Tablet
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 600));
    const shot768 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-tablet-768px.png'), Buffer.from(shot768.result.data, 'base64'));
    console.log('Saved focus-marquee-tablet-768px.png');

    // 4. Test 390px Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));
    const shot390 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'focus-marquee-mobile-390px.png'), Buffer.from(shot390.result.data, 'base64'));
    console.log('Saved focus-marquee-mobile-390px.png');

    // 5. Test 320px Small Mobile (Check no horizontal overflow)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 600,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));
    const overflowCheck = await send('Runtime.evaluate', {
      expression: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`,
      returnByValue: true
    });
    console.log('320px No Horizontal Overflow:', overflowCheck.result?.result?.value);

    // 6. 4x CPU slowdown full scroll profiling to confirm 0 Forced Reflows
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });

    violations.length = 0;
    console.log('Running 4x CPU slowdown scroll test across Focus Marquee...');

    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const start = window.scrollY;
          window.__lenis.scrollTo(start + 1800, {
            duration: 3.0,
            onComplete: resolve
          });
        })
      `,
      awaitPromise: true
    });

    console.log('Violations recorded during scroll:', violations.length);

    ws.close();
  } finally {
    p.kill();
  }
}

verifyFocusMarquee().catch(console.error);
