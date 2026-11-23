const { spawn } = require('child_process');
const fs = require('fs');

async function verify() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9335;
  const p = spawn(edgePath, ['--remote-debugging-port=' + port, '--headless=new', '--window-size=1440,960']);
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

  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: 'sessionStorage.setItem("dinidu_portfolio_intro_played", "true");'
  });
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Scroll to TechStack (#stack) and snap
  await call('Runtime.evaluate', {
    expression: `document.getElementById('stack')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 600));
  const shotStack = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\techstack-no-numbering-verified.png',
    Buffer.from(shotStack.data, 'base64')
  );

  // 2. Scroll to VideoBanner (.video-banner-section) and snap
  await call('Runtime.evaluate', {
    expression: `document.querySelector('.video-banner-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotVideo = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\video-banner-hd-verified.png',
    Buffer.from(shotVideo.data, 'base64')
  );

  // 3. Audit all eyebrows on the page
  const eyebrows = await call('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('.eyebrow, .leisure-eyebrow-badge, .video-eyebrow')).map(e => e.textContent.trim())`,
    returnByValue: true
  });
  console.log('Eyebrows on page:', JSON.stringify(eyebrows.result.value, null, 2));

  ws.close();
  p.kill();
}

verify().catch(console.error);
