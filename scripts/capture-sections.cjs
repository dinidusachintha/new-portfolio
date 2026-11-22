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

async function captureSections() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;

  const port = 9228;
  const userDataDir = 'C:\\Users\\user\\3D Objects\\dinidu-portfolio\\.chrome-qa-profile-sections2';
  const artifactsDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de';

  const browserProc = spawn(bin, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1440,900',
    '--no-first-run',
    'about:blank'
  ]);

  try {
    const wsUrl = await getWsUrl(port);
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    // Skip intro loader on load
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          sessionStorage.setItem('portfolio_intro_seen', 'true');
        } catch (e) {}
      `
    });

    await send('Page.navigate', { url: 'http://localhost:4173/' });
    await new Promise(r => setTimeout(r, 2500));

    // 1. Hero with scroll cue and split name
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    if (heroShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, 'scroll-hero-desktop.png'), Buffer.from(heroShot.result.data, 'base64'));
    }

    // 2. Scroll to About Section
    await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const el = document.getElementById('about');
          if (el && window.__lenis) {
            window.__lenis.scrollTo(el, { duration: 0.8, onComplete: resolve });
          } else {
            el?.scrollIntoView();
            setTimeout(resolve, 800);
          }
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 600));
    const aboutShot = await send('Page.captureScreenshot', { format: 'png' });
    if (aboutShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, 'scroll-about-reveal.png'), Buffer.from(aboutShot.result.data, 'base64'));
    }

    // 3. Scroll to Experience / Process Section
    await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const el = document.getElementById('experience');
          if (el && window.__lenis) {
            window.__lenis.scrollTo(el, { duration: 0.8, onComplete: resolve });
          } else {
            el?.scrollIntoView();
            setTimeout(resolve, 800);
          }
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 600));
    const expShot = await send('Page.captureScreenshot', { format: 'png' });
    if (expShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, 'scroll-process-line.png'), Buffer.from(expShot.result.data, 'base64'));
    }

    // 4. Scroll to Projects Section
    await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const el = document.getElementById('work');
          if (el && window.__lenis) {
            window.__lenis.scrollTo(el, { duration: 0.8, onComplete: resolve });
          } else {
            el?.scrollIntoView();
            setTimeout(resolve, 800);
          }
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 800));
    const workShot = await send('Page.captureScreenshot', { format: 'png' });
    if (workShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, 'scroll-projects-stacked.png'), Buffer.from(workShot.result.data, 'base64'));
    }

    // 5. Scroll to Contact / Footer section
    await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const el = document.getElementById('contact');
          if (el && window.__lenis) {
            window.__lenis.scrollTo(el, { duration: 0.8, onComplete: resolve });
          } else {
            el?.scrollIntoView();
            setTimeout(resolve, 800);
          }
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 600));
    const contactShot = await send('Page.captureScreenshot', { format: 'png' });
    if (contactShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, 'scroll-footer-desktop.png'), Buffer.from(contactShot.result.data, 'base64'));
    }

    console.log('Successfully captured all section screenshots!');
    ws.close();
  } finally {
    browserProc.kill();
  }
}

captureSections().catch(console.error);
