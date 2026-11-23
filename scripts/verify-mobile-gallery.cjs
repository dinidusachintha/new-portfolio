const { spawn } = require('child_process');
const fs = require('fs');

async function verifyMobile() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9248;
  const p = spawn(edgePath, [
    '--remote-debugging-port=' + port,
    '--headless=new',
    '--window-size=390,844'
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
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
    hasTouch: true
  });
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 3000));

  // Screenshot top on mobile
  const ssHero = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-mobile-hero.png', Buffer.from(ssHero.data, 'base64'));

  // Scroll to work section (Projects)
  await call('Runtime.evaluate', {
    expression: 'document.getElementById("work").scrollIntoView()'
  });
  await new Promise(r => setTimeout(r, 1200));

  // Check mobile gallery track existence and snap properties
  const galleryCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.mobile-snap-slide');
      const mobileTrack = document.querySelector('.overflow-x-auto');
      const card = document.querySelector('.glass-card-frosted');
      return {
        hasMobileSlide: !!track,
        trackComputedStyle: mobileTrack ? {
          scrollSnapType: getComputedStyle(mobileTrack).scrollSnapType,
          touchAction: getComputedStyle(mobileTrack).touchAction,
        } : null,
        cardContain: card ? getComputedStyle(card).contain : null,
      };
    })()`,
    returnByValue: true
  });

  console.log('Mobile Gallery Check:', galleryCheck.result.value);

  const ssProjects = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-mobile-projects.png', Buffer.from(ssProjects.data, 'base64'));

  console.log('Console Logs on Mobile:', consoleLogs);

  ws.close();
  p.kill();
}

verifyMobile().catch(console.error);
