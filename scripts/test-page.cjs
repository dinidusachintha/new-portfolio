const { spawn } = require('child_process');

async function check() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const fs = require('fs');
  const bin = fs.existsSync(edgePath) ? edgePath : chromePath;
  const port = 9238;
  const p = spawn(bin, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    'http://localhost:4173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        JSON.stringify({
          reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          lenisExists: !!window.__lenis,
          hasLenisProto: window.__lenis ? typeof window.__lenis.scrollTo : 'none'
        })
      `,
      returnByValue: true
    }
  }));

  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
    if (data.id === 1) {
      console.log('Result:', data.result?.result?.value);
      p.kill();
      process.exit(0);
    }
  };
}

check().catch(console.error);
