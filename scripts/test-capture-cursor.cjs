const { spawn } = require('child_process');
const fs = require('fs');

async function captureCursorStates() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9262;
  const p = spawn(edgePath, [
    '--remote-debugging-port=' + port,
    '--headless=new',
    '--window-size=1440,900'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9262/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const h = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', h);
        msg.error ? reject(msg.error) : resolve(msg.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await call('Page.enable');
  await call('Runtime.enable');

  console.log('Navigating...');
  await call('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 3500));

  // Move mouse to center
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 700, y: 400 });
  await new Promise(r => setTimeout(r, 300));

  // Take screenshot of default
  let snap = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/snap-cursor-default.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap-cursor-default.png');

  // Hover CV download button
  const btnPos = await call('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.includes('Download CV'));
      if (!btn) return null;
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = btn.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('Button pos:', btnPos.result.value);

  if (btnPos.result.value) {
    const { x, y } = btnPos.result.value;
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
    await new Promise(r => setTimeout(r, 400));
    snap = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/snap-cursor-snap.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved snap-cursor-snap.png');
  }

  // Hover project card
  const cardPos = await call('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('[data-cur="view"]');
      if (!card) return null;
      card.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = card.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('Card pos:', cardPos.result.value);

  if (cardPos.result.value) {
    const { x, y } = cardPos.result.value;
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
    await new Promise(r => setTimeout(r, 400));
    snap = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/snap-cursor-view.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved snap-cursor-view.png');
  }

  // Check state in card
  const stateCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const ring = document.querySelector('.custom-cursor-ring');
      const dot = document.querySelector('.custom-cursor-dot');
      const label = document.querySelector('.custom-cursor-label');
      return {
        ringState: ring ? ring.dataset.state : null,
        ringStyle: ring ? ring.getAttribute('style') : null,
        labelStyle: label ? getComputedStyle(label).opacity : null,
        dotStyle: dot ? getComputedStyle(dot).opacity : null,
      };
    })()`,
    returnByValue: true
  });
  console.log('State check:', stateCheck.result.value);

  ws.close();
  p.kill();
}

captureCursorStates();
