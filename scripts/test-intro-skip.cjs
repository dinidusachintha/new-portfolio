const { spawn } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const p = spawn(edgePath, ['--remote-debugging-port=9236', '--headless=new', '--window-size=1440,900', 'about:blank']);

setTimeout(async () => {
  const res = await fetch('http://127.0.0.1:9236/json/list');
  const [page] = await res.json();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    const fn = (e) => {
      const data = JSON.parse(e.data);
      if (data.id === msgId) {
        ws.removeEventListener('message', fn);
        res(data);
      }
    };
    ws.addEventListener('message', fn);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `sessionStorage.setItem('portfolio_intro_seen', 'true');`
  });
  await send('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2000));

  const scrollRes = await send('Runtime.evaluate', {
    expression: `
      new Promise(resolve => {
        let frames = [];
        let last = performance.now();
        let active = true;
        function t(now) {
          if (!active) return;
          frames.push(now - last);
          last = now;
          requestAnimationFrame(t);
        }
        requestAnimationFrame(t);

        const target = document.documentElement.scrollHeight - window.innerHeight;
        window.__lenis.scrollTo(target, {
          duration: 3.5,
          onComplete: () => {
            active = false;
            const avg = frames.reduce((a,b)=>a+b, 0) / frames.length;
            resolve({
              fps: Math.round(1000 / avg),
              avgMs: avg.toFixed(1),
              totalFrames: frames.length
            });
          }
        });
      })
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Scroll Result:', JSON.stringify(scrollRes));
  p.kill();
  process.exit(0);
}, 1000);
