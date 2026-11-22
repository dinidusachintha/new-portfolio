const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function verify() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9288;
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
  await new Promise(r => setTimeout(r, 2000));

  // 1. Check Lightning Effect Component
  const lightningInfo = await call('Runtime.evaluate', {
    expression: `(() => {
      const c = document.querySelector('.background-lightning-container');
      const svg = document.querySelector('.lightning-svg-canvas');
      const skySheet = document.querySelector('.lightning-sky-sheet');
      return {
        exists: !!c,
        phase: c ? c.className : 'not mounted',
        hasSvg: !!svg,
        hasSkySheet: !!skySheet
      };
    })()`,
    returnByValue: true
  });
  console.log('Lightning status initially:', JSON.stringify(lightningInfo.result.value, null, 2));

  // Wait 1.4s for the 3.2s initial strike to fire, then check and screenshot lightning
  console.log('Waiting for lightning strike...');
  let lightningShot = false;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 100));
    const isStriking = await call('Runtime.evaluate', {
      expression: `(() => {
        const c = document.querySelector('.background-lightning-container');
        if (!c) return false;
        return c.className.includes('stroke') || c.className.includes('leader') || c.className.includes('decay');
      })()`,
      returnByValue: true
    });
    if (isStriking.result.value && !lightningShot) {
      console.log('Lightning active at step', i, '! Snapping screenshot...');
      const shot = await call('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\realistic-lightning-verified.png',
        Buffer.from(shot.data, 'base64')
      );
      lightningShot = true;
      break;
    }
  }

  // If didn't catch in loop, trigger or wait a bit more
  if (!lightningShot) {
    console.log('Snapping hero viewport...');
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\realistic-lightning-verified.png',
      Buffer.from(shot.data, 'base64')
    );
  }

  // 2. Verify and Snapshot the entire Footer section with ALL details
  console.log('Scrolling to footer (#contact)...');
  await call('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  const footerAudit = await call('Runtime.evaluate', {
    expression: `(() => {
      const box = document.querySelector('.have-a-system-box');
      const dotGrid = document.querySelector('.dot-grid-spotlight');
      const gridWrap = document.querySelector('.footer-perspective-grid-wrap');
      const title = document.querySelector('.have-a-system-title');
      const actions = Array.from(document.querySelectorAll('.have-a-system-reveal a, .have-a-system-reveal button')).map(el => el.textContent.trim());
      const socials = Array.from(document.querySelectorAll('.have-a-system-box div.border-t a')).map(el => el.textContent.trim());
      const simpleFooter = document.querySelector('.footer-simple');
      const copyright = simpleFooter ? simpleFooter.textContent.trim() : null;
      const cornerMusic = document.querySelector('.corner-music-btn, button[title*="Music"], button[aria-label*="Music"]');
      return {
        hasBox: !!box,
        hasDotGrid: !!dotGrid,
        hasPerspectiveGrid: !!gridWrap,
        titleText: title ? title.textContent.trim().replace(/\\s+/g, ' ') : null,
        actionButtons: actions,
        socialLinks: socials,
        footerText: copyright,
        hasMusicButton: !!cornerMusic
      };
    })()`,
    returnByValue: true
  });
  console.log('Footer Audit:', JSON.stringify(footerAudit.result.value, null, 2));

  // Snap full footer region screenshot
  const footerClip = await call('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.getElementById('contact');
      const simple = document.querySelector('.footer-simple');
      const top = contact.getBoundingClientRect().top + window.scrollY;
      const bottom = simple.getBoundingClientRect().bottom + window.scrollY;
      return { x: 0, y: Math.max(0, Math.round(top - 40)), width: 1440, height: Math.min(1200, Math.round(bottom - top + 80)) };
    })()`,
    returnByValue: true
  });

  const footerShot = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { ...footerClip.result.value, scale: 1 }
  });
  fs.writeFileSync(
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\footer-all-details-verified.png',
    Buffer.from(footerShot.data, 'base64')
  );
  console.log('Saved footer-all-details-verified.png');

  // 3. Verify single line role title & 3 stat cards on white background
  const sanityCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const roleTitle = document.querySelector('.hero-dymas-role-title');
      const inner = roleTitle ? roleTitle.querySelector('.letter-wave-inner') : null;
      const ir = inner ? inner.getBoundingClientRect() : null;
      const statCards = document.querySelectorAll('.about-stats-grid .stat-card');
      return {
        roleSingleLine: ir ? ir.height < 45 : false,
        roleHeight: ir ? ir.height : null,
        statCardCount: statCards.length
      };
    })()`,
    returnByValue: true
  });
  console.log('Sanity check (Role single-line & Stat cards):', JSON.stringify(sanityCheck.result.value, null, 2));

  ws.close();
  p.kill();
}

verify().catch(console.error);
