const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runBaselineAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9311;
  const p = spawn(edgePath, ['--remote-debugging-port=' + port, '--headless=new', '--window-size=1440,900']);
  await new Promise(r => setTimeout(r, 2000));

  const res = await fetch('http://127.0.0.1:' + port + '/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const consoleMessages = [];
  const networkRequests = [];
  const failedRequests = [];

  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push({
        type: msg.params.type,
        text: msg.params.args.map(a => a.value || a.description || '').join(' ')
      });
    } else if (msg.method === 'Log.entryAdded') {
      consoleMessages.push({
        type: msg.params.entry.level,
        text: msg.params.entry.text,
        url: msg.params.entry.url
      });
    } else if (msg.method === 'Network.requestWillBeSent') {
      networkRequests.push(msg.params.request.url);
    } else if (msg.method === 'Network.responseReceived') {
      if (msg.params.response.status >= 400) {
        failedRequests.push({
          url: msg.params.response.url,
          status: msg.params.response.status
        });
      }
    }
  });

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

  await call('Runtime.enable');
  await call('Log.enable');
  await call('Network.enable');
  await call('Page.enable');

  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      sessionStorage.setItem("dinidu_portfolio_intro_played", "true");
      window.__perfData = { lcp: 0, cls: 0, longTasks: 0, tbt: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perfData.lcp = entry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__perfData.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perfData.longTasks++;
          window.__perfData.tbt += Math.max(0, entry.duration - 50);
        }
      }).observe({ type: 'longtask', buffered: true });
    `
  });

  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 3000));

  // 1. Measure Perf Metrics
  const perfMetrics = await call('Runtime.evaluate', {
    expression: `JSON.stringify(window.__perfData)`,
    returnByValue: true
  });

  // 2. Measure 4x CPU Throttled Scroll FPS
  await call('Emulation.setCPUThrottlingRate', { rate: 4 });
  const fpsResult = await call('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      let frames = 0;
      let minDelta = 999;
      let maxDelta = 0;
      let last = performance.now();
      const start = last;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      function step(now) {
        frames++;
        const dt = now - last;
        if (frames > 1) {
          if (dt < minDelta) minDelta = dt;
          if (dt > maxDelta) maxDelta = dt;
        }
        last = now;
        const elapsed = now - start;
        const p = Math.min(1, elapsed / 2000);
        window.scrollTo(0, totalScroll * p);
        if (elapsed < 2000) {
          requestAnimationFrame(step);
        } else {
          const avgFps = Math.round((frames / (elapsed / 1000)) * 10) / 10;
          resolve({ avgFps, frames, maxFrameMs: Math.round(maxDelta * 10) / 10 });
        }
      }
      requestAnimationFrame(step);
    })`,
    awaitPromise: true,
    returnByValue: true
  });
  await call('Emulation.setCPUThrottlingRate', { rate: 1 });

  // 3. Check Horizontal Overflow at 320, 360, 390, 414, 768, 1024, 1440, 1920
  const widths = [320, 360, 390, 414, 768, 1024, 1440, 1920];
  const overflowReport = {};

  for (const w of widths) {
    await call('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 844,
      deviceScaleFactor: 1,
      mobile: w < 768
    });
    await new Promise(r => setTimeout(r, 350));

    const check = await call('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const offenders = [];
        if (scrollW > docW) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.right > docW + 1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '',
                right: Math.round(r.right),
                docW
              });
              if (offenders.length >= 5) break;
            }
          }
        }
        return { docW, scrollW, hasOverflow: scrollW > docW, offenders };
      })()`,
      returnByValue: true
    });
    overflowReport[w] = check.result.value;
  }

  const video1Reqs = networkRequests.filter(u => u.includes('video1.mp4')).length;
  const video2Reqs = networkRequests.filter(u => u.includes('video2.mp4')).length;

  console.log('=== BASELINE AUDIT REPORT ===');
  console.log('Console Messages:', JSON.stringify(consoleMessages, null, 2));
  console.log('Failed Network Requests (404/etc):', JSON.stringify(failedRequests, null, 2));
  console.log('Video Request Counts:', { video1Reqs, video2Reqs });
  console.log('Perf Metrics (LCP/CLS/TBT):', perfMetrics.result.value);
  console.log('4x CPU Slowdown Scroll FPS:', JSON.stringify(fpsResult.result.value));
  console.log('Horizontal Overflow Check:', JSON.stringify(overflowReport, null, 2));

  ws.close();
  p.kill();
}

runBaselineAudit().catch(console.error);
