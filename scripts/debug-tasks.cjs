const { spawn } = require('child_process');
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

async function debugLongTasks() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9232;
  const p = spawn(bin, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--window-size=1440,900',
    'http://localhost:4173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
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
    return new Promise(resolve => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });

  // Wait for initial render
  await new Promise(r => setTimeout(r, 4000));

  await send('Runtime.evaluate', {
    expression: `
      window.__longTasks = [];
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__longTasks.push({
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
            name: entry.name,
            attribution: entry.attribution ? entry.attribution.map(a => a.name || a.containerType) : []
          });
        }
      });
      po.observe({ type: 'longtask' });

      window.__frameTimes = [];
      let last = performance.now();
      function track(now) {
        window.__frameTimes.push(now - last);
        last = now;
        requestAnimationFrame(track);
      }
      requestAnimationFrame(track);
    `
  });

  // Scroll 1,500px (Hero through About and Experience) over 4 seconds
  await send('Runtime.evaluate', {
    expression: `
      new Promise(resolve => {
        window.__lenis.scrollTo(2500, {
          duration: 4.0,
          onComplete: resolve
        });
      })
    `,
    awaitPromise: true
  });

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const ft = window.__frameTimes || [];
        const avg = ft.length ? ft.reduce((a, b) => a + b, 0) / ft.length : 16.6;
        return {
          fps: Math.round(1000 / avg),
          avgFrameTime: avg.toFixed(1),
          longTasks: window.__longTasks
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(res.result?.result?.value, null, 2));

  p.kill();
  process.exit(0);
}

debugLongTasks().catch(console.error);
