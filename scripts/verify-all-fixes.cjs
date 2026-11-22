const { spawn } = require('child_process');
const fs = require('fs');

async function verify() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9260;
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
  await new Promise(r => setTimeout(r, 3000));

  // 1. Verify Video Frame
  const videoCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const video = document.querySelector('.hero-dymas-portrait-video');
      const frame = document.querySelector('.hero-portrait-video-frame');
      const orbs = document.querySelector('.hero-glow-orbs');
      const forwardFade = document.querySelector('.hero-purple-forward-fade');
      const vStyle = video ? getComputedStyle(video) : null;
      const fStyle = frame ? getComputedStyle(frame) : null;
      const oStyle = orbs ? getComputedStyle(orbs) : null;
      return {
        videoFound: !!video,
        frameFound: !!frame,
        forwardFadeExists: !!forwardFade,
        videoTransform: vStyle ? vStyle.transform : null,
        videoObjectFit: vStyle ? vStyle.objectFit : null,
        videoMask: vStyle ? (vStyle.maskImage || vStyle.webkitMaskImage) : null,
        frameMask: fStyle ? (fStyle.maskImage || fStyle.webkitMaskImage) : null,
        orbsZIndex: oStyle ? oStyle.zIndex : null,
        orbsMixBlend: oStyle ? oStyle.mixBlendMode : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Video check:', JSON.stringify(videoCheck.result.value, null, 2));

  // 2. Capture Hero Screenshot
  const heroShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\hero-seamless-verified.png', Buffer.from(heroShot.data, 'base64'));
  console.log('Saved hero-seamless-verified.png');

  // Capture close-up of the video left edge (where seam used to be)
  const clipSeam = { x: 480, y: 150, width: 450, height: 400, scale: 1 };
  const shotSeam = await call('Page.captureScreenshot', { format: 'png', clip: clipSeam });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\video-left-edge-close-up.png', Buffer.from(shotSeam.data, 'base64'));
  console.log('Saved video-left-edge-close-up.png');

  // 3. Scroll to Bento About Section
  await call('Runtime.evaluate', {
    expression: 'document.querySelector("#about").scrollIntoView({ block: "center", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 1600)); // allow odometer roll to finish

  const bentoCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const bento = document.querySelector('.bento-about-section');
      const stats = Array.from(document.querySelectorAll('.bento-tile-stat')).map(t => {
        const dd = t.querySelector('.bento-stat-num');
        const dt = t.querySelector('.bento-stat-label');
        return {
          label: dt ? dt.textContent.trim() : '',
          ariaLabel: dd ? dd.getAttribute('aria-label') : '',
          visibleText: dd ? dd.textContent.replace(/\\s+/g, ' ').trim() : '',
          hasOdometer: !!t.querySelector('.odometer-root'),
          suffixEl: t.querySelector('.odometer-symbol') ? t.querySelector('.odometer-symbol').textContent : ''
        };
      });
      const avail = document.querySelector('.bento-tile-availability');
      const loc = document.querySelector('.bento-tile-location');
      return {
        bentoFound: !!bento,
        stats,
        availability: avail ? avail.textContent.replace(/\\s+/g, ' ').trim() : '',
        location: loc ? loc.textContent.replace(/\\s+/g, ' ').trim() : ''
      };
    })()`,
    returnByValue: true
  });
  console.log('Bento check:', JSON.stringify(bentoCheck.result.value, null, 2));

  // Capture Bento About Section Screenshot
  const bentoRectRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(".bento-about-section");
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)), width: Math.round(r.width), height: Math.round(r.height) };
    })()`,
    returnByValue: true
  });
  const rectBento = bentoRectRes.result.value;

  const shotBento = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rectBento.x, y: rectBento.y, width: rectBento.width, height: rectBento.height, scale: 1 }
  });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\bento-odometer-verified.png', Buffer.from(shotBento.data, 'base64'));
  console.log('Saved bento-odometer-verified.png');

  // 4. Test Mobile (390px)
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Runtime.evaluate', {
    expression: 'document.querySelector("#home").scrollIntoView({ block: "start", behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileVideoCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const video = document.querySelector('.hero-dymas-portrait-video');
      const vStyle = video ? getComputedStyle(video) : null;
      return {
        videoTransform: vStyle ? vStyle.transform : null,
        videoObjectFit: vStyle ? vStyle.objectFit : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile video check (390px):', JSON.stringify(mobileVideoCheck.result.value, null, 2));

  const mobileShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\mobile-hero-verified.png', Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved mobile-hero-verified.png');

  ws.close();
  p.kill();
}
verify().catch(console.error);
