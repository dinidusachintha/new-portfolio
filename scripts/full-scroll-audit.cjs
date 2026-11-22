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

async function fullScrollAudit(width, height, label) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9233;
  const p = spawn(bin, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    `--window-size=${width},${height}`,
    'http://localhost:4173/'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
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
      if (msg.method === 'Log.entryAdded' || msg.method === 'Console.messageAdded') {
        const text = (msg.params.entry?.text || msg.params.message?.text || '');
        if (text.includes('[Violation]') || text.includes('reflow')) {
          violations.push(text);
        }
      }
    };

    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Log.enable');
    await send('Console.enable');
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });

    // Wait for initial render
    await new Promise(r => setTimeout(r, 4000));
    violations.length = 0;

    await send('Runtime.evaluate', {
      expression: `
        window.__longTasks = [];
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__longTasks.push({
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime),
              name: entry.name
            });
          }
        });
        po.observe({ type: 'longtask' });

        window.__frameTimes = [];
        let last = performance.now();
        let running = true;
        window.__stop = () => { running = false; };
        function track(now) {
          if (!running) return;
          window.__frameTimes.push(now - last);
          last = now;
          requestAnimationFrame(track);
        }
        requestAnimationFrame(track);
      `
    });

    console.log(`Scrolling ${label} under 4x CPU slowdown...`);
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          window.__lenis.scrollTo(totalHeight, {
            duration: 8.5,
            onComplete: () => setTimeout(resolve, 300)
          });
        })
      `,
      awaitPromise: true
    });

    await send('Runtime.evaluate', { expression: 'window.__stop && window.__stop();' });

    // Capture final screenshot
    const artifactsDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de';
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot?.result?.data) {
      fs.writeFileSync(path.join(artifactsDir, `verified-${label.toLowerCase()}.png`), Buffer.from(shot.result.data, 'base64'));
    }

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const ft = window.__frameTimes || [];
          const avg = ft.length ? ft.reduce((a, b) => a + b, 0) / ft.length : 16.6;
          return {
            fps: Math.round(1000 / avg),
            avgFrameTime: avg.toFixed(1),
            totalFrames: ft.length,
            longTaskCount: window.__longTasks.length
          };
        })()
      `,
      returnByValue: true
    });

    const data = res.result?.result?.value;
    console.log(`--- ${label} Results ---`);
    console.log(`Average FPS: ~${data.fps} FPS (avg frame time: ${data.avgFrameTime}ms)`);
    console.log(`Total Frames: ${data.totalFrames}`);
    console.log(`Long Tasks (> 50ms): ${data.longTaskCount}`);
    console.log(`Forced Reflow Violations: ${violations.length}`);

    ws.close();
    return { ...data, violations: violations.length };
  } finally {
    p.kill();
  }
}

async function run() {
  const d = await fullScrollAudit(1440, 900, 'Desktop-1440px');
  const m = await fullScrollAudit(390, 844, 'Mobile-390px');

  console.log('\n================ OFFICIAL VERIFICATION AUDIT ================');
  console.log(`Desktop (1440px): ~${d.fps} FPS | Long Tasks: ${d.longTaskCount} | Forced Reflows: ${d.violations}`);
  console.log(`Mobile (390px):  ~${m.fps} FPS | Long Tasks: ${m.longTaskCount} | Forced Reflows: ${m.violations}`);
  console.log('=============================================================\n');
}

run().catch(console.error);
