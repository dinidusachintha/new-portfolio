const { spawn } = require('child_process');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9236;
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

  // Find all elements whose left or right or bounding rect boundary is around 632px
  const elements = await call('Runtime.evaluate', {
    expression: `(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const matches = [];
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (Math.abs(r.left - 632) < 15 || Math.abs(r.right - 632) < 15) {
          matches.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height },
            background: getComputedStyle(el).background,
            backgroundColor: getComputedStyle(el).backgroundColor,
            overflow: getComputedStyle(el).overflow,
            zIndex: getComputedStyle(el).zIndex
          });
        }
      }
      return matches;
    })()`,
    returnByValue: true
  });
  console.log('Matches at 632px:', JSON.stringify(elements.result.value, null, 2));

  ws.close();
  p.kill();
}
test().catch(console.error);
