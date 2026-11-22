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

async function captureAll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9240;
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

    console.log('Navigating to http://localhost:4173/ ...');
    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Hero Screenshot (Split name & scroll cue)
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-hero-verified.png'), Buffer.from(heroShot.result.data, 'base64'));
    console.log('Saved scroll-hero-verified.png');

    // 2. Scroll into About section to show word-by-word reveal
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const el = document.getElementById('about');
          window.__lenis.scrollTo(el, { duration: 1.0, onComplete: resolve });
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 800));
    const aboutShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-about-verified.png'), Buffer.from(aboutShot.result.data, 'base64'));
    console.log('Saved scroll-about-verified.png');

    // 3. Scroll into Experience / Process section to show violet line
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const el = document.getElementById('experience');
          window.__lenis.scrollTo(el, { duration: 1.0, onComplete: resolve });
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 800));
    const expShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-process-verified.png'), Buffer.from(expShot.result.data, 'base64'));
    console.log('Saved scroll-process-verified.png');

    // 4. Scroll into Projects section to show stacked cards
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const el = document.getElementById('work');
          window.__lenis.scrollTo(el, { duration: 1.0, onComplete: resolve });
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 800));
    const workShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-projects-verified.png'), Buffer.from(workShot.result.data, 'base64'));
    console.log('Saved scroll-projects-verified.png');

    // 5. Scroll into Contact / Footer section to show reveal
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const el = document.getElementById('contact');
          window.__lenis.scrollTo(el, { duration: 1.0, onComplete: resolve });
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 800));
    const contactShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-footer-verified.png'), Buffer.from(contactShot.result.data, 'base64'));
    console.log('Saved scroll-footer-verified.png');

    // 6. Mobile 390px view
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `window.__lenis.scrollTo(0, { immediate: true });`
    });
    await new Promise(r => setTimeout(r, 800));
    const mobileHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-mobile-hero-verified.png'), Buffer.from(mobileHero.result.data, 'base64'));
    console.log('Saved scroll-mobile-hero-verified.png');

    // Mobile Projects Stacked View (vertical stack)
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const el = document.getElementById('work');
          window.__lenis.scrollTo(el, { duration: 1.0, onComplete: resolve });
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 800));
    const mobileWork = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactsDir, 'scroll-mobile-work-verified.png'), Buffer.from(mobileWork.result.data, 'base64'));
    console.log('Saved scroll-mobile-work-verified.png');

    ws.close();
  } finally {
    p.kill();
  }
}

captureAll().catch(console.error);
