const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9238;
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

  // Capture close-up of the seam area
  const clipSeam = { x: 532, y: 202, width: 350, height: 350, scale: 1 };
  const shotSeam = await call('Page.captureScreenshot', { format: 'png', clip: clipSeam });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\verified-purple-forward-seam.png', Buffer.from(shotSeam.data, 'base64'));
  console.log('Saved verified-purple-forward-seam.png');

  // Capture full hero
  const heroRectRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(".hero-dymas-section");
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.round(r.height) };
    })()`,
    returnByValue: true
  });
  const rectHero = heroRectRes.result.value;

  const shotHero = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rectHero.x, y: rectHero.y, width: rectHero.width, height: rectHero.height, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\verified-purple-forward-hero.png', Buffer.from(shotHero.data, 'base64'));
  console.log('Saved verified-purple-forward-hero.png');

  // Scroll to footer and capture previous footer
  await call('Runtime.evaluate', {
    expression: 'document.querySelector("#contact").scrollIntoView({ block: "center", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 1000));

  const footerRectRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#contact");
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.round(r.height) };
    })()`,
    returnByValue: true
  });
  const rectFooter = footerRectRes.result.value;

  const shotFooter = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rectFooter.x, y: rectFooter.y, width: rectFooter.width, height: rectFooter.height, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\verified-previous-footer.png', Buffer.from(shotFooter.data, 'base64'));
  console.log('Saved verified-previous-footer.png');

  ws.close();
  p.kill();
}
test().catch(console.error);
