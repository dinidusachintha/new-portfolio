const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9277;
  const p = spawn(edgePath, ['--remote-debugging-port=' + port, '--headless=new', '--window-size=1440,900']);
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

  await call('Page.addScriptToEvaluateOnNewDocument', { source: 'sessionStorage.setItem("dinidu_portfolio_intro_played", "true");' });
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Inspect "Software Engineer" role title in Hero
  const heroRoleInfo = await call('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('.hero-dymas-role-title');
      const inner = title ? title.querySelector('.letter-wave-inner') : null;
      const wrap = title ? title.querySelector('.letter-wave-wrap') : null;
      const r = title ? title.getBoundingClientRect() : null;
      const ir = inner ? inner.getBoundingClientRect() : null;
      return {
        text: title ? title.textContent.trim() : null,
        titleRect: r ? { width: r.width, height: r.height } : null,
        innerRect: ir ? { width: ir.width, height: ir.height } : null,
        whiteSpace: title ? getComputedStyle(title).whiteSpace : null,
        innerWhiteSpace: inner ? getComputedStyle(inner).whiteSpace : null,
        isSingleLine: ir ? ir.height < 45 : false
      };
    })()`,
    returnByValue: true
  });
  console.log('Hero role title info:', JSON.stringify(heroRoleInfo.result.value, null, 2));

  // Capture hero bottom-left close-up
  const heroRect = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.hero-dymas-bottom-left');
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x - 10)), y: Math.max(0, Math.round(r.y - 10)), width: Math.round(r.width + 30), height: Math.round(r.height + 20) };
    })()`,
    returnByValue: true
  });
  const shotRole = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { ...heroRect.result.value, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\hero-software-engineer-oneline.png', Buffer.from(shotRole.data, 'base64'));
  console.log('Saved hero-software-engineer-oneline.png');

  // 2. Scroll to About Section and inspect the 4 stat cards
  await call('Runtime.evaluate', {
    expression: 'document.querySelector("#about").scrollIntoView({ block: "start", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 1500));

  const statsInfo = await call('Runtime.evaluate', {
    expression: `(() => {
      const grid = document.querySelector('.about-stats-grid');
      const section = document.querySelector('.about-section-light');
      const cards = grid ? Array.from(grid.querySelectorAll('.bento-tile')).map(c => ({
        text: c.textContent.replace(/\\s+/g, ' ').trim(),
        ariaLabel: c.querySelector('[aria-label]') ? c.querySelector('[aria-label]').getAttribute('aria-label') : null
      })) : [];
      return {
        gridFound: !!grid,
        cardCount: cards.length,
        cards,
        sectionBg: section ? getComputedStyle(section).backgroundColor : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Stats info on white canvas:', JSON.stringify(statsInfo.result.value, null, 2));

  // Capture screenshot of the 4 stat cards on white background
  const gridRect = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.about-stats-grid');
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x - 16)), y: Math.max(0, Math.round(r.y - 16)), width: Math.round(r.width + 32), height: Math.round(r.height + 32) };
    })()`,
    returnByValue: true
  });
  const shotGrid = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { ...gridRect.result.value, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\stats-on-white-background-verified.png', Buffer.from(shotGrid.data, 'base64'));
  console.log('Saved stats-on-white-background-verified.png');

  ws.close();
  p.kill();
}
test().catch(console.error);
