const { spawn } = require('child_process');
const fs = require('fs');

async function snapCards() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9328;
  const p = spawn(edgePath, ['--remote-debugging-port=' + port, '--headless=new', '--window-size=1440,980']);
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

  // Scroll to #work
  await call('Runtime.evaluate', {
    expression: `document.getElementById('work')?.scrollIntoView({ behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Rotate 3D Carousel to Ayurvedic Plant Recognition (dot index 4)
  await call('Runtime.evaluate', {
    expression: `(() => {
      const dot = document.querySelector('button[aria-label="Rotate to Ayurvedic Plant Recognition"]');
      if (dot) dot.click();
      const stage = document.querySelector('.glass-project-stage');
      if (stage) stage.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1400));

  const shotCarousel = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\ayurvedic-card-carousel-verified.png',
    Buffer.from(shotCarousel.data, 'base64')
  );

  // 2. Switch to "Glass Grid" view to show Ayurvedic Plant Recognition side-by-side with the other cards
  await call('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gridBtn = btns.find(b => b.textContent.includes('Glass Grid'));
      if (gridBtn) gridBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 900));

  await call('Runtime.evaluate', {
    expression: `(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      const h = headings.find(el => el.textContent.includes('Ayurvedic Plant Recognition'));
      const card = h ? h.closest('article') : null;
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const shotGrid = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\ayurvedic-plant-card-closeup.png',
    Buffer.from(shotGrid.data, 'base64')
  );

  ws.close();
  p.kill();
  console.log('Saved carousel and grid screenshots!');
}

snapCards().catch(console.error);
