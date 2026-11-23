const { spawn } = require('child_process');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9243;
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

  await call('Page.enable');
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  const status1 = await call('Runtime.evaluate', {
    expression: '(() => { const v = document.querySelector(".hero-dymas-portrait-video"); return v ? { paused: v.paused, currentTime: v.currentTime, duration: v.duration, loop: v.loop, muted: v.muted, readyState: v.readyState, autoplay: v.autoplay } : null; })()',
    returnByValue: true
  });
  console.log('Video status after 2.5s:', status1.result.value);

  // Wait another 3s and check currentTime
  await new Promise(r => setTimeout(r, 3000));
  const status2 = await call('Runtime.evaluate', {
    expression: '(() => { const v = document.querySelector(".hero-dymas-portrait-video"); return v ? { paused: v.paused, currentTime: v.currentTime } : null; })()',
    returnByValue: true
  });
  console.log('Video status after 5.5s:', status2.result.value);

  ws.close();
  p.kill();
}

test().catch(console.error);
