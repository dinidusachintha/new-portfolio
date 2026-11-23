const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testScroll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9247;
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
  await new Promise(r => setTimeout(r, 2500));

  // Check what text / cards exist between Hero and About
  const inspection = await call('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.getElementById('home');
      const about = document.getElementById('about');
      const focusMarquee = document.querySelector('.focus-marquee-section');
      const hasActivePortalLayer = document.body.innerText.includes('ACTIVE PORTAL LAYER');
      const hasDiveDeeper = document.body.innerText.includes('SCROLL TO DIVE DEEPER');
      return {
        heroHeight: hero ? hero.offsetHeight : 0,
        aboutTop: about ? about.getBoundingClientRect().top : 0,
        focusMarqueeHeight: focusMarquee ? focusMarquee.offsetHeight : 0,
        hasActivePortalLayer,
        hasDiveDeeper,
      };
    })()`,
    returnByValue: true
  });

  console.log('DOM Inspection:', inspection.result.value);

  // Take screenshot at top
  const ss1 = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-hero-top.png', Buffer.from(ss1.data, 'base64'));

  // Scroll 500px down
  await call('Runtime.evaluate', { expression: 'window.scrollTo(0, 500)' });
  await new Promise(r => setTimeout(r, 500));
  const ss2 = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-hero-scroll-500.png', Buffer.from(ss2.data, 'base64'));

  // Scroll to About section
  await call('Runtime.evaluate', { expression: 'document.getElementById("about").scrollIntoView()' });
  await new Promise(r => setTimeout(r, 500));
  const ss3 = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-about.png', Buffer.from(ss3.data, 'base64'));

  console.log('Captured 3 screenshots to scripts/');
  console.log('Console logs caught:', consoleLogs.length, consoleLogs);

  ws.close();
  p.kill();
}

testScroll().catch(console.error);
