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

async function runSession(width, height, label) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;

  const port = 9226;
  const userDataDir = 'C:\\Users\\user\\3D Objects\\dinidu-portfolio\\.chrome-qa-profile-scroll';

  console.log(`\n================ STARTING ${label} (${width}x${height}) ================`);
  const browserProc = spawn(bin, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    `--window-size=${width},${height}`,
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  try {
    const wsUrl = await getWsUrl(port);
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const callbacks = new Map();
    const violations = [];

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
      if (msg.method === 'Log.entryAdded') {
        const text = msg.params.entry.text || '';
        if (text.includes('[Violation]') || text.includes('reflow') || text.includes('requestAnimationFrame')) {
          violations.push(text);
        }
      }
      if (msg.method === 'Console.messageAdded') {
        const text = msg.params.message.text || '';
        if (text.includes('[Violation]') || text.includes('reflow') || text.includes('requestAnimationFrame')) {
          violations.push(text);
        }
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Enable domains
    await send('Log.enable');
    await send('Console.enable');
    await send('Network.enable');
    await send('Runtime.enable');
    await send('Page.enable');

    // Emulate device metrics
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    // 4x CPU Slowdown
    console.log('Applying 4x CPU Slowdown...');
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });

    // Navigate
    console.log('Navigating to http://localhost:4173/ ...');
    await send('Page.navigate', { url: 'http://localhost:4173/' });

    // Wait for settle
    await new Promise(r => setTimeout(r, 6500));
    violations.length = 0; // Clear initial chunk load logs

    // Take Hero Screenshot
    const artifactsDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de';
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    if (heroShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, `scroll-hero-${label.toLowerCase()}.png`), Buffer.from(heroShot.result.data, 'base64'));
    }

    // Inject frame & long task tracker
    await send('Runtime.evaluate', {
      expression: `
        window.__longTasks = [];
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              window.__longTasks.push({ duration: Math.round(entry.duration) });
            }
          }
        });
        po.observe({ type: 'longtask' });

        window.__frameTimes = [];
        let lastFrame = performance.now();
        let tracking = true;
        window.__stopTracking = () => { tracking = false; };
        function trackFrame(now) {
          if (!tracking) return;
          window.__frameTimes.push(now - lastFrame);
          lastFrame = now;
          requestAnimationFrame(trackFrame);
        }
        requestAnimationFrame(trackFrame);
      `
    });

    console.log(`Scrolling ${label} top-to-bottom under 4x CPU slowdown...`);

    // Perform smooth scroll using Lenis
    await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const lenis = window.__lenis;
          if (lenis) {
            lenis.scrollTo(totalHeight, {
              duration: 3.5,
              onComplete: () => setTimeout(resolve, 400)
            });
          } else {
            let current = 0;
            const interval = setInterval(() => {
              current += 150;
              window.scrollTo(0, current);
              if (current >= totalHeight) {
                clearInterval(interval);
                setTimeout(resolve, 400);
              }
            }, 30);
          }
        })
      `,
      awaitPromise: true
    });

    await send('Runtime.evaluate', { expression: `window.__stopTracking && window.__stopTracking();` });

    // Capture Footer Screenshot
    const footerShot = await send('Page.captureScreenshot', { format: 'png' });
    if (footerShot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, `scroll-footer-${label.toLowerCase()}.png`), Buffer.from(footerShot.result.data, 'base64'));
    }

    // Gather Stats
    const perfData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const frameTimes = window.__frameTimes || [];
          const avgFrameTime = frameTimes.length ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length : 16.6;
          const fps = 1000 / avgFrameTime;
          const longTasks = window.__longTasks || [];
          return {
            fps: Math.round(fps),
            avgFrameTimeMs: avgFrameTime.toFixed(2),
            longTaskCount: longTasks.length,
            totalFrames: frameTimes.length
          };
        })()
      `,
      returnByValue: true
    });

    const results = perfData?.result?.result?.value || perfData?.result?.value || {};
    console.log(`--- ${label} Results ---`);
    console.log(`Average FPS: ~${results.fps} FPS (avg frame time: ${results.avgFrameTimeMs}ms)`);
    console.log(`Total Frames Recorded: ${results.totalFrames}`);
    console.log(`Long Tasks (> 50ms): ${results.longTaskCount}`);
    console.log(`Forced Reflow Violations: ${violations.length}`);

    ws.close();
    return { ...results, violations: violations.length };
  } finally {
    browserProc.kill();
  }
}

async function main() {
  const desktop = await runSession(1440, 900, 'Desktop-1440px');
  const mobile = await runSession(390, 844, 'Mobile-390px');

  console.log('\n================ FINAL PERFORMANCE AUDIT SUMMARY ================');
  console.log(`Desktop (1440px): ~${desktop.fps} FPS, ${desktop.longTaskCount} Long Tasks, ${desktop.violations} Forced Reflows`);
  console.log(`Mobile (390px):  ~${mobile.fps} FPS, ${mobile.longTaskCount} Long Tasks, ${mobile.violations} Forced Reflows`);
  console.log('=================================================================\n');
}

main().catch(console.error);
