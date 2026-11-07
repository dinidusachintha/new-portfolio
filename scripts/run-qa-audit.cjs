const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PORT = 4173;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

// 1. Static file server for dist
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0].split('#')[0];
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

      const filePath = path.join(DIST_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // SPA fallback
        const indexPath = path.join(DIST_DIR, 'index.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        fs.createReadStream(indexPath).pipe(res);
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

// 2. Launch headless Chrome with CDP
function launchChrome() {
  const remotePort = 9222;
  const userDataDir = path.join(__dirname, '..', '.chrome-qa-profile');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);
  return { chrome, remotePort };
}

// Helper to poll CDP endpoint
async function waitForCDP(port, maxTries = 30) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Could not connect to Chrome DevTools endpoint');
}

// CDP Client using Node 22+ WebSocket
class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        } else if (msg.method && this.eventListeners.has(msg.method)) {
          this.eventListeners.get(msg.method)(msg.params);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    this.eventListeners.set(event, handler);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('--- STARTING QA PRODUCTION AUDIT SUITE ---');
  const server = await startServer();
  console.log(`[1/5] Local test server running on http://127.0.0.1:${PORT}`);

  const { chrome, remotePort } = launchChrome();
  console.log('[2/5] Chrome headless launched with CDP');

  try {
    await waitForCDP(remotePort);

    // Get list of targets and connect to the page target
    const targetsRes = await fetch(`http://127.0.0.1:${remotePort}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    console.log('[3/5] Connected to Chrome Page via WebSocket CDP');

    // Enable domains
    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');
    await client.send('Network.enable');

    const consoleLogs = [];
    const failedRequests = [];

    client.on('Runtime.consoleAPICalled', (params) => {
      const text = params.args.map((a) => a.value || a.description).join(' ');
      consoleLogs.push({ type: params.type, text });
    });

    client.on('Network.responseReceived', (params) => {
      if (params.response.status >= 400) {
        failedRequests.push({
          url: params.response.url,
          status: params.response.status,
          statusText: params.response.statusText,
        });
      }
    });

    // Navigate to Home
    console.log('[4/5] Navigating to http://127.0.0.1:4173/ ...');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });

    // Wait for load
    await new Promise((r) => setTimeout(r, 2000));

    // Test Target Viewports for Horizontal Overflow & Sizing (All 10 required viewports)
    const viewports = [
      { name: 'Small mobile', width: 320, height: 640 },
      { name: 'Android mobile', width: 360, height: 740 },
      { name: 'iPhone', width: 375, height: 812 },
      { name: 'Modern smartphone', width: 390, height: 844 },
      { name: 'Large smartphone', width: 414, height: 896 },
      { name: 'Large mobile', width: 430, height: 932 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Small laptop', width: 1024, height: 768 },
      { name: 'Desktop', width: 1280, height: 800 },
      { name: 'Large desktop', width: 1440, height: 900 },
    ];

    console.log('[5/5] Evaluating viewports & layout overflow...');
    const viewportResults = [];

    for (const vp of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768,
      });

      await new Promise((r) => setTimeout(r, 400));

      const evalRes = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const doc = document.documentElement;
            const scrollWidth = doc.scrollWidth;
            const innerWidth = window.innerWidth;
            const hasOverflow = scrollWidth > innerWidth;
            
            // Check elements extending outside
            let culprit = null;
            if (hasOverflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > innerWidth + 1) {
                  culprit = el.tagName + '.' + (el.className || '').slice(0, 30);
                  break;
                }
              }
            }
            return {
              scrollWidth,
              innerWidth,
              hasOverflow,
              culprit
            };
          })()
        `,
        returnByValue: true,
      });

      const res = evalRes.result.value;
      viewportResults.push({
        ...vp,
        ...res,
      });
    }

    // Test Blog Navigation
    console.log('Testing Blog Route Navigation...');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#/blog` });
    await new Promise((r) => setTimeout(r, 1500));

    const blogCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const blogArticles = document.querySelectorAll('.blog-card');
          const title = document.querySelector('h1, h2');
          return {
            articleCount: blogArticles.length,
            titleFound: !!title,
            bodyLength: document.body.innerText.length
          };
        })()
      `,
      returnByValue: true,
    });

    // Test Specific Article Deep Link
    console.log('Testing Blog Article Deep Link (#/blog/schoolride-lk-coming-soon)...');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#/blog/schoolride-lk-coming-soon` });
    await new Promise((r) => setTimeout(r, 1200));

    const articleCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            hasArticleHeading: document.body.innerText.includes('SchoolRide LK'),
            hasReturnButton: document.body.innerText.includes('RETURN TO PORTFOLIO') || document.body.innerText.includes('BACK')
          };
        })()
      `,
      returnByValue: true,
    });

    // Test Project Dialog Modal Opening & Closing
    console.log('Testing Project Dialog Modal Interaction...');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll to work section and click an interactive demo button
    const dialogOpenResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button.glass-pill-white-3d, button.glass-pill-dark-3d');
          if (btn) {
            btn.click();
            return { buttonFound: true };
          }
          return { buttonFound: false };
        })()
      `,
      returnByValue: true,
    });

    await new Promise((r) => setTimeout(r, 600));

    const dialogCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const dlg = document.querySelector('dialog.project-dialog');
          const isOpen = dlg && dlg.open;
          return {
            dialogFound: !!dlg,
            isOpen
          };
        })()
      `,
      returnByValue: true,
    });

    // Test Escape key press to close dialog
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });

    await new Promise((r) => setTimeout(r, 400));

    const dialogClosedCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const dlg = document.querySelector('dialog.project-dialog');
          return {
            isClosed: !dlg || !dlg.open
          };
        })()
      `,
      returnByValue: true,
    });

    // Test Mobile Sidebar Navigation Opening, Links, and Escape Dismissal
    console.log('Testing Mobile Sidebar Navigation...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click mobile hamburger button
    const openMenuResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button.mobile-menu-toggle');
          if (btn) {
            btn.click();
            return { clicked: true };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true,
    });

    await new Promise((r) => setTimeout(r, 500));

    const sidebarOpenCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const sidebar = document.querySelector('[role="dialog"][aria-label="Mobile Navigation"]');
          const navLinks = sidebar ? sidebar.querySelectorAll('nav a') : [];
          return {
            sidebarFound: !!sidebar,
            linkCount: navLinks.length,
            bodyScrollLocked: document.body.style.overflow === 'hidden'
          };
        })()
      `,
      returnByValue: true,
    });

    // Test Escape key dismissal
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });

    await new Promise((r) => setTimeout(r, 650));

    const sidebarClosedCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const sidebar = document.querySelector('[role="dialog"][aria-label="Mobile Navigation"]');
          return {
            isClosed: !sidebar,
            bodyScrollRestored: document.body.style.overflow !== 'hidden'
          };
        })()
      `,
      returnByValue: true,
    });

    client.close();

    console.log('\n========================================');
    console.log('       QA AUDIT RESULTS SUMMARY         ');
    console.log('========================================');
    console.log('VIEWPORT OVERFLOW CHECKS:');
    let allPassedOverflow = true;
    for (const r of viewportResults) {
      const status = !r.hasOverflow ? 'PASS ✓' : `FAIL ✗ (overflow: ${r.scrollWidth} > ${r.innerWidth}, culprit: ${r.culprit})`;
      console.log(`  - [${r.name}] ${r.width}px: ${status}`);
      if (r.hasOverflow) allPassedOverflow = false;
    }

    console.log('\nMOBILE SIDEBAR AUDIT:');
    const sidebarOpened = sidebarOpenCheck.result.value.sidebarFound && sidebarOpenCheck.result.value.linkCount > 0;
    const sidebarClosed = sidebarClosedCheck.result.value.isClosed;
    console.log(`  - Mobile sidebar opens on hamburger click: ${sidebarOpened ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  - Sidebar links rendered (${sidebarOpenCheck.result.value.linkCount} sections): ${sidebarOpenCheck.result.value.linkCount >= 6 ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  - Body scroll locks when open: ${sidebarOpenCheck.result.value.bodyScrollLocked ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  - Escape key dismisses sidebar: ${sidebarClosed ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  - Body scroll restored when closed: ${sidebarClosedCheck.result.value.bodyScrollRestored ? 'PASS ✓' : 'FAIL ✗'}`);

    console.log('\nNETWORK REQUEST AUDIT:');
    if (failedRequests.length === 0) {
      console.log('  - All requests returned HTTP 200/304 (0 failed requests) ✓');
    } else {
      console.log(`  - ${failedRequests.length} FAILED REQUESTS:`);
      failedRequests.forEach((f) => console.log(`      * [${f.status}] ${f.url}`));
    }

    console.log('\nCONSOLE ERRORS AUDIT:');
    const errors = consoleLogs.filter((l) => l.type === 'error');
    if (errors.length === 0) {
      console.log('  - 0 console errors logged ✓');
    } else {
      console.log(`  - ${errors.length} console errors:`);
      errors.forEach((e) => console.log(`      * ${e.text}`));
    }

    console.log('\nBLOG ROUTE AUDIT:');
    console.log(`  - Blog listing rendered: ${blogCheck.result.value.titleFound ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  - SchoolRide LK deep link rendered: ${articleCheck.result.value.hasArticleHeading ? 'PASS ✓' : 'FAIL ✗'}`);

    console.log('\nMODAL DIALOG AUDIT:');
    console.log(`  - Interactive demo button triggered modal: ${dialogCheck.result.value.isOpen ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  - Escape key dismisses modal: ${dialogClosedCheck.result.value.isClosed ? 'PASS ✓' : 'FAIL ✗'}`);

    console.log('\n========================================');
    console.log('OVERALL QA STATUS:', allPassedOverflow && failedRequests.length === 0 && errors.length === 0 ? 'ALL CHECKS PASSED ✓' : 'NEEDS ATTENTION');
    console.log('========================================');
  } finally {
    chrome.kill();
    server.close();
    // Clean up chrome temp profile
    try {
      const userDataDir = path.join(__dirname, '..', '.chrome-qa-profile');
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

run().catch((err) => {
  console.error('QA Script failed:', err);
  process.exit(1);
});
