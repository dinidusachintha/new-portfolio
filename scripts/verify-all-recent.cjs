const { spawn } = require('child_process');
const fs = require('fs');

async function testAll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9251;
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
  await call('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
    hasTouch: true
  });
  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Check dropdown initial open state in ExperienceTimeline
  const dropdownState = await call('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.experience-dropdown-toggle-btn');
      const content = document.getElementById('experience-dropdown-content');
      return {
        ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        isContentExpanded: content ? content.classList.contains('is-expanded') : false,
      };
    })()`,
    returnByValue: true
  });

  console.log('Dropdown Initial State (Should be closed/false):', dropdownState.result.value);

  // 2. Check CV Download Strip responsiveness
  const cvStripCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const strip = document.querySelector('.cv-download-strip');
      const btns = strip ? strip.querySelectorAll('a') : [];
      return {
        exists: !!strip,
        stripWidth: strip ? strip.offsetWidth : 0,
        buttonCount: btns.length,
        buttons: Array.from(btns).map(b => ({
          text: b.innerText.trim(),
          width: b.offsetWidth,
          height: b.offsetHeight,
        })),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    })()`,
    returnByValue: true
  });

  console.log('CV Strip Check:', cvStripCheck.result.value);

  // 3. Scroll to Experience Section and take screenshot of closed dropdown & CV strip
  await call('Runtime.evaluate', {
    expression: 'document.getElementById("experience").scrollIntoView()'
  });
  await new Promise(r => setTimeout(r, 600));

  const ssExp = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/ss-experience-closed.png', Buffer.from(ssExp.data, 'base64'));

  // 4. Check that 3D carousel exists and does NOT have flat snap list
  const carouselCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const stage = document.querySelector('.glass-project-stage');
      const flatList = document.querySelector('.mobile-snap-slide');
      const cylinderCards = stage ? stage.querySelectorAll('.glass-card-frosted') : [];
      return {
        hasStage: !!stage,
        hasFlatList: !!flatList,
        cardCount: cylinderCards.length,
      };
    })()`,
    returnByValue: true
  });

  console.log('Carousel Check:', carouselCheck.result.value);

  // 5. Check if any text matching "EVOLUTION & ARCHITECTURAL FOCUS" or "TRANSITIONING TO PRODUCTION" exists
  const textCheck = await call('Runtime.evaluate', {
    expression: `(() => ({
      hasEvolution: document.body.innerText.includes('EVOLUTION & ARCHITECTURAL FOCUS'),
      hasTransitioning: document.body.innerText.includes('TRANSITIONING TO PRODUCTION CASE STUDIES'),
    }))()`,
    returnByValue: true
  });

  console.log('Text Badges Check (both should be false):', textCheck.result.value);
  console.log('Console Logs Caught:', consoleLogs.length);

  ws.close();
  p.kill();
}

testAll().catch(console.error);
