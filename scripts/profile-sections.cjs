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

async function testSection(sectionId) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9234;
  const p = spawn(bin, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--window-size=1440,900',
    'http://localhost:4173/'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const wsUrl = await getWsUrl(port);
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const onMsg = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', onMsg);
            resolve(msg);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll to section
    const res = await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const el = document.getElementById('${sectionId}');
          if (!el) return resolve({ found: false });

          const top = el.getBoundingClientRect().top + window.pageYOffset;
          const height = el.offsetHeight;

          // Track during scrolling this section
          const longTasks = [];
          const po = new PerformanceObserver(list => {
            for (const e of list.getEntries()) longTasks.push(Math.round(e.duration));
          });
          po.observe({ type: 'longtask' });

          const frameTimes = [];
          let last = performance.now();
          let run = true;
          function f(now) {
            if (!run) return;
            frameTimes.push(now - last);
            last = now;
            requestAnimationFrame(f);
          }
          requestAnimationFrame(f);

          window.__lenis.scrollTo(top + height, {
            duration: 2.5,
            onComplete: () => {
              run = false;
              po.disconnect();
              const avg = frameTimes.length ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length : 16.6;
              resolve({
                found: true,
                fps: Math.round(1000 / avg),
                longTasks: longTasks.length,
                durations: longTasks
              });
            }
          });
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });

    console.log(`[${sectionId}]`, res.result?.result?.value);
    ws.close();
  } finally {
    p.kill();
  }
}

async function main() {
  for (const s of ['work', 'stack', 'leisure', 'ai-video', 'contact']) {
    await testSection(s);
  }
}

main().catch(console.error);
