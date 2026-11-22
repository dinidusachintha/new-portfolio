const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;

  const port = 9225;
  const userDataDir = 'C:\\Users\\user\\3D Objects\\dinidu-portfolio\\.chrome-qa-profile';

  console.log('Launching browser from:', bin);
  const browserProc = spawn(bin, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1440,900',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  try {
    const wsUrl = await getWsUrl(port);
    console.log('Connected to CDP at:', wsUrl);

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const callbacks = new Map();
    const violations = [];
    const consoleLogs = [];
    const networkRequests = [];

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
      if (msg.method === 'Network.requestWillBeSent') {
        const url = msg.params.request.url;
        if (url.includes('.mp4')) {
          networkRequests.push({ url, timestamp: msg.params.timestamp });
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

    // 1. Enable domains
    await send('Log.enable');
    await send('Console.enable');
    await send('Network.enable');
    await send('Runtime.enable');
    await send('Page.enable');

    // 2. Set CPU Throttling
    const throttleRate = process.env.THROTTLE ? Number(process.env.THROTTLE) : 4;
    console.log(`Applying ${throttleRate}x CPU Slowdown...`);
    await send('Emulation.setCPUThrottlingRate', { rate: throttleRate });

    // 3. Navigate
    console.log('Navigating to http://localhost:4173/ ...');
    await send('Page.navigate', { url: 'http://localhost:4173/' });

    // Wait for initial render, intro, and lazy bundles under 4x CPU slowdown
    const settleTime = throttleRate > 1 ? 6500 : 3500;
    console.log(`Waiting ${settleTime}ms for initial components and lazy chunks to settle...`);
    await new Promise(r => setTimeout(r, settleTime));

    // Clear initial load violations and start performance tracking
    violations.length = 0;

    // 4. Inject Performance Observer for long tasks & FPS in page context (tracking strictly during scroll)
    await send('Runtime.evaluate', {
      expression: `
        window.__longTasks = [];
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              window.__longTasks.push({
                duration: Math.round(entry.duration),
                startTime: Math.round(entry.startTime),
                name: entry.name,
                attribution: entry.attribution ? entry.attribution.map(a => ({ name: a.name, containerType: a.containerType, containerId: a.containerId })) : []
              });
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

    console.log('Beginning full page smooth scroll under 4x CPU slowdown...');

    // 5. Perform smooth scroll from top to bottom using Lenis
    await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const lenis = window.__lenis;
          if (lenis) {
            lenis.scrollTo(totalHeight, {
              duration: 3.5,
              onComplete: () => {
                setTimeout(resolve, 300);
              }
            });
          } else {
            let current = 0;
            const interval = setInterval(() => {
              current += 120;
              window.scrollTo(0, current);
              if (current >= totalHeight) {
                clearInterval(interval);
                setTimeout(resolve, 300);
              }
            }, 30);
          }
        })
      `,
      awaitPromise: true
    });

    await send('Runtime.evaluate', { expression: `window.__stopTracking && window.__stopTracking();` });

    // 6. Gather performance statistics from page context
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
            longTasks: longTasks.slice(0, 10),
            totalFrames: frameTimes.length
          };
        })()
      `,
      returnByValue: true
    });

    const results = perfData?.result?.result?.value || perfData?.result?.value || {};
    if (!results.fps) {
      console.log('perfData raw:', JSON.stringify(perfData));
    }

    console.log('\n================ PERFORMANCE AUDIT RESULTS ================');
    console.log('CPU Throttling: 4x Slowdown');
    console.log(`Average FPS: ~${results.fps} FPS (avg frame time: ${results.avgFrameTimeMs}ms)`);
    console.log(`Total Frames Recorded: ${results.totalFrames}`);
    console.log(`Long Tasks (> 50ms): ${results.longTaskCount}`);
    if (results.longTasks.length > 0) {
      console.log('Long Tasks Details:', JSON.stringify(results.longTasks));
    }
    console.log(`Console [Violation] Warnings: ${violations.length}`);
    if (violations.length > 0) {
      console.log('Violations:', violations);
    } else {
      console.log('  -> 0 Forced Reflow warnings! (PASSED)');
    }
    console.log(`Video MP4 Requests: ${networkRequests.length}`);
    networkRequests.forEach(r => console.log('  -', r.url));
    console.log('===========================================================\n');

    ws.close();
  } finally {
    browserProc.kill();
  }
}

run().catch(console.error);
