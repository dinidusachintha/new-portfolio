const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9243;
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

  // Skip intro
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: 'sessionStorage.setItem("dinidu_portfolio_intro_played", "true");'
  });

  await call('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  console.log('--- 1. VERIFYING BENTO ABOUT ---');
  await call('Runtime.evaluate', {
    expression: 'document.querySelector("#about").scrollIntoView({ block: "center", behavior: "instant" });'
  });
  // Wait 1.5s for 900ms count-up and entrance stagger
  await new Promise(r => setTimeout(r, 1600));

  const bentoCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector("#about");
      if (!sec) return { exists: false };
      const tiles = sec.querySelectorAll(".bento-tile");
      const statNums = Array.from(sec.querySelectorAll(".bento-stat-num")).map(el => el.textContent.trim());
      const ariaLabels = Array.from(sec.querySelectorAll(".bento-stat-num")).map(el => el.getAttribute("aria-label"));
      const isDl = sec.querySelector("dl") !== null;
      return {
        exists: true,
        tilesCount: tiles.length,
        statNums,
        ariaLabels,
        isDl,
        heading: sec.querySelector("h2")?.textContent.trim()
      };
    })()`,
    returnByValue: true
  });
  console.log('Bento check:', bentoCheck.result.value);

  // Capture Bento screenshot
  const bentoClip = await call('Runtime.evaluate', {
    expression: '(() => { const r = document.querySelector("#about").getBoundingClientRect(); return JSON.stringify({ x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.min(800, Math.round(r.height)), scale: 1 }); })()',
    returnByValue: true
  });
  if (bentoClip.result.value) {
    const clip = JSON.parse(bentoClip.result.value);
    const shot = await call('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\bento-about-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved bento-about-verified.png!');
  }

  console.log('--- 2. VERIFYING PROCESS TIMELINE ---');
  await call('Runtime.evaluate', {
    expression: 'document.querySelector("#process").scrollIntoView({ block: "start", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 600));

  // Advance scroll inside process section to trigger line and nodes
  await call('Runtime.evaluate', {
    expression: 'window.scrollBy({ top: 350, behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 800));

  const processCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector("#process");
      if (!sec) return { exists: false };
      const steps = sec.querySelectorAll(".process-step-item");
      const activeSteps = sec.querySelectorAll(".process-step-item.is-active");
      const nodes = sec.querySelectorAll(".process-node-circle");
      const activeNodes = sec.querySelectorAll(".process-node-circle.is-active");
      const fillLine = sec.querySelector(".process-track-fill");
      return {
        exists: true,
        totalSteps: steps.length,
        activeSteps: activeSteps.length,
        totalNodes: nodes.length,
        activeNodes: activeNodes.length,
        fillTransform: fillLine ? window.getComputedStyle(fillLine).transform : 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('Process check:', processCheck.result.value);

  const processClip = await call('Runtime.evaluate', {
    expression: '(() => { const r = document.querySelector("#process").getBoundingClientRect(); return JSON.stringify({ x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.min(800, Math.round(r.height)), scale: 1 }); })()',
    returnByValue: true
  });
  if (processClip.result.value) {
    const clip = JSON.parse(processClip.result.value);
    const shot = await call('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\process-timeline-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved process-timeline-verified.png!');
  }

  console.log('--- 3. VERIFYING AVAILABILITY BADGE & CONTACT ---');
  await call('Runtime.evaluate', {
    expression: 'document.querySelector(".availability-badge-section").scrollIntoView({ block: "center", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 600));

  const badgeCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector(".availability-badge-section");
      if (!sec) return { exists: false };
      const textPath = sec.querySelector("textPath");
      const link = sec.querySelector(".availability-badge-link");
      const centerBtn = sec.querySelector(".availability-badge-center-btn");
      const headline = sec.querySelector(".availability-headline");
      return {
        exists: true,
        text: textPath?.textContent?.trim(),
        href: link?.getAttribute("href"),
        ariaLabel: link?.getAttribute("aria-label"),
        hasArrow: centerBtn !== null,
        headlineText: headline?.textContent?.trim()
      };
    })()`,
    returnByValue: true
  });
  console.log('Badge check:', badgeCheck.result.value);

  const badgeClip = await call('Runtime.evaluate', {
    expression: '(() => { const r = document.querySelector(".availability-badge-section").getBoundingClientRect(); return JSON.stringify({ x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.round(r.height), scale: 1 }); })()',
    returnByValue: true
  });
  if (badgeClip.result.value) {
    const clip = JSON.parse(badgeClip.result.value);
    const shot = await call('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\availability-badge-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved availability-badge-verified.png!');
  }

  console.log('--- 4. RESPONSIVE OVERFLOW AUDIT ---');
  const viewports = [1440, 1024, 768, 390, 320];
  for (const w of viewports) {
    await call('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 800,
      deviceScaleFactor: 1,
      mobile: w < 768
    });
    await new Promise(r => setTimeout(r, 400));
    const overflowRes = await call('Runtime.evaluate', {
      expression: '(() => { return { viewport: ' + w + ', scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth }; })()',
      returnByValue: true
    });
    console.log('Viewport ' + w + 'px:', overflowRes.result.value);
  }

  ws.close();
  p.kill();
}

test().catch(console.error);
