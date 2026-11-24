const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9255;
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

  const consoleLogs = [];
  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Console.messageAdded' || msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(msg.params);
    }
  });

  await call('Console.enable');
  await call('Page.enable');
  await call('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  console.log('1. Loading site with fresh session...');
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 600));

  // Check intro loader status at t=600ms
  const loaderCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.querySelector('.intro-globe-overlay');
      const canvas = document.querySelector('.intro-globe-stage canvas');
      const caption = document.querySelector('.intro-globe-stage div:last-child');
      return {
        hasOverlay: !!overlay,
        hasCanvas: !!canvas,
        captionText: caption ? caption.textContent.trim() : null,
        ariaLabel: overlay ? overlay.getAttribute('aria-label') : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Loader on mount (desktop 1440px):', loaderCheck.result.value);

  // Take screenshot of Intro Loader
  const loaderShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-intro-loader.png', Buffer.from(loaderShot.data, 'base64'));
  console.log('Saved scripts/ss-intro-loader.png');

  // Wait for loader exit to complete (2.6s)
  console.log('Waiting for loader exit completion...');
  await new Promise(r => setTimeout(r, 2600));

  const postLoaderCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.querySelector('.intro-globe-overlay');
      const sessionFlag = sessionStorage.getItem('dinidu_portfolio_intro_played');
      const lenis = window.__lenis;
      return {
        hasOverlay: !!overlay,
        sessionFlag,
        lenisStarted: lenis ? !lenis.isStopped : false,
        syncTouch: lenis?.options?.syncTouch
      };
    })()`,
    returnByValue: true
  });
  console.log('Post-loader check:', postLoaderCheck.result.value);

  // Check footer for NO RisingLines
  const footerCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const risingLines = document.querySelector('.rising-lines-container, .rising-lines-canvas');
      const haveBox = document.querySelector('.have-a-system-box');
      return {
        hasRisingLines: !!risingLines,
        hasHaveBox: !!haveBox
      };
    })()`,
    returnByValue: true
  });
  console.log('Footer animation check (rising lines removed):', footerCheck.result.value);

  // Check mobile viewports for horizontal overflow
  const viewports = [320, 360, 375, 390, 430, 768];
  const overflowResults = {};
  for (const w of viewports) {
    await call('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 300));
    const check = await call('Runtime.evaluate', {
      expression: '(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth }))()',
      returnByValue: true
    });
    overflowResults[w] = check.result.value;
  }
  console.log('Mobile viewports horizontal overflow check:', overflowResults);

  // Check repeat visit in same tab
  console.log('Testing reload in same tab (should skip loader)...');
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 400));
  const reloadCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.querySelector('.intro-globe-overlay');
      return { hasOverlay: !!overlay };
    })()`,
    returnByValue: true
  });
  console.log('Reload in same tab (skipped immediately):', reloadCheck.result.value);

  console.log('Console logs captured:', consoleLogs.length);
  const errorLogs = consoleLogs.filter(l => l.type === 'error' || l.level === 'error');
  console.log('Console errors:', errorLogs.length);

  ws.close();
  p.kill();
}

test().catch(console.error);
