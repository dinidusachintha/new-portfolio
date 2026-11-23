const { spawn } = require('child_process');

async function audit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9246;
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
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 3000));

  // Check horizontal overflow on 320, 360, 390, 430
  const mobileWidths = [320, 360, 390, 430];
  const overflowResults = {};

  for (const w of mobileWidths) {
    await call('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 400));
    const check = await call('Runtime.evaluate', {
      expression: '(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth }))()',
      returnByValue: true
    });
    overflowResults[w] = check.result.value;
  }

  // Restore desktop
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Check Lenis setup
  const lenisCheck = await call('Runtime.evaluate', {
    expression: '(() => { const l = window.__lenis; return l ? { isStopped: l.isStopped, options: { syncTouch: l.options?.syncTouch, smoothWheel: l.options?.smoothWheel, touchMultiplier: l.options?.touchMultiplier } } : null; })()',
    returnByValue: true
  });

  // Check CSS 100vh occurrences in DOM or stylesheets
  const vhCheck = await call('Runtime.evaluate', {
    expression: '(() => { const hasDvh = CSS.supports("height: 100dvh"); return { supportsDvh: hasDvh }; })()',
    returnByValue: true
  });

  console.log('--- AUDIT RESULTS ---');
  console.log('Mobile Overflows:', overflowResults);
  console.log('Lenis Setup:', lenisCheck.result.value);
  console.log('Console Logs Captured:', consoleLogs.length);

  ws.close();
  p.kill();
}

audit().catch(console.error);
