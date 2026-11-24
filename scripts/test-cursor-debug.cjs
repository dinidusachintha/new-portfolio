const { spawn } = require('child_process');
const fs = require('fs');

async function testAllStates() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9265;
  const p = spawn(edgePath, [
    '--remote-debugging-port=' + port,
    '--headless=new',
    '--window-size=1440,900'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:' + port + '/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const h = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', h);
        msg.error ? reject(msg.error) : resolve(msg.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await call('Page.enable');
  await call('Runtime.enable');

  console.log('Navigating to http://localhost:5173...');
  await call('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 3500));

  // 1. Initial State before mousemove
  const checkInit = await call('Runtime.evaluate', {
    expression: `(() => {
      const wrapper = document.querySelector('.custom-cursor-wrapper');
      return {
        hasCursor: document.documentElement.classList.contains('has-cursor'),
        wrapperExists: !!wrapper,
        wrapperOpacity: wrapper ? getComputedStyle(wrapper).opacity : null,
      };
    })()`,
    returnByValue: true
  });
  console.log('1. Before move:', checkInit.result.value);

  // 2. Dispatch Mouse Move: DEFAULT state
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 600, y: 300 });
  await new Promise(r => setTimeout(r, 200));

  const checkDefault = await call('Runtime.evaluate', {
    expression: `(() => {
      const ring = document.querySelector('.custom-cursor-ring');
      const dot = document.querySelector('.custom-cursor-dot');
      return {
        hasCursor: document.documentElement.classList.contains('has-cursor'),
        ringState: ring ? ring.dataset.state : null,
        dotTransform: dot ? dot.style.transform : null,
        ringTransform: ring ? ring.style.transform : null,
      };
    })()`,
    returnByValue: true
  });
  console.log('2. Default state:', checkDefault.result.value);

  let snap = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/verified-default.png', Buffer.from(snap.data, 'base64'));

  // 3. Move to Button: SNAP state
  const btnPos = await call('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.includes("Let's collaborate"));
      if (!btn) return null;
      const rect = btn.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('Button target:', btnPos.result.value);

  if (btnPos.result.value) {
    const { x, y } = btnPos.result.value;
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
    await new Promise(r => setTimeout(r, 300));

    const checkSnap = await call('Runtime.evaluate', {
      expression: `(() => {
        const ring = document.querySelector('.custom-cursor-ring');
        return {
          ringState: ring ? ring.dataset.state : null,
          ringWidth: ring ? ring.style.width : null,
          ringHeight: ring ? ring.style.height : null,
          ringTransform: ring ? ring.style.transform : null,
        };
      })()`,
      returnByValue: true
    });
    console.log('3. Snap state on button:', checkSnap.result.value);
    snap = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/verified-snap.png', Buffer.from(snap.data, 'base64'));
  }

  // 4. Click Feedback on Button: is-pressed scale(0.85)
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', x: 600, y: 300, clickCount: 1 });
  await new Promise(r => setTimeout(r, 50));
  const checkPress = await call('Runtime.evaluate', {
    expression: `(() => {
      const ring = document.querySelector('.custom-cursor-ring');
      return {
        isPressed: ring ? ring.classList.contains('is-pressed') : false,
        computedScale: ring ? getComputedStyle(ring).scale : null,
      };
    })()`,
    returnByValue: true
  });
  console.log('4. Press feedback:', checkPress.result.value);

  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', x: 600, y: 300, clickCount: 1 });
  await new Promise(r => setTimeout(r, 100));

  // 5. Move to Project Card: VIEW state
  const cardPos = await call('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('[data-cur="view"]');
      if (!card) return null;
      card.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = card.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + 100 };
    })()`,
    returnByValue: true
  });
  console.log('Card target:', cardPos.result.value);

  if (cardPos.result.value) {
    const { x, y } = cardPos.result.value;
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
    await new Promise(r => setTimeout(r, 300));

    const checkView = await call('Runtime.evaluate', {
      expression: `(() => {
        const ring = document.querySelector('.custom-cursor-ring');
        const label = document.querySelector('.custom-cursor-label');
        const dot = document.querySelector('.custom-cursor-dot');
        return {
          ringState: ring ? ring.dataset.state : null,
          ringBg: ring ? getComputedStyle(ring).backgroundColor : null,
          ringWidth: ring ? getComputedStyle(ring).width : null,
          labelText: label ? label.textContent : null,
          labelOpacity: label ? getComputedStyle(label).opacity : null,
          dotOpacity: dot ? getComputedStyle(dot).opacity : null,
        };
      })()`,
      returnByValue: true
    });
    console.log('5. View state on project card:', checkView.result.value);
    snap = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/verified-view.png', Buffer.from(snap.data, 'base64'));
  }

  // 6. Move to Hero Stage: DRAG state
  const dragPos = await call('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const stage = document.querySelector('[data-cur="drag"]');
      if (!stage) return null;
      const rect = stage.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('Hero stage target:', dragPos.result.value);

  if (dragPos.result.value) {
    const { x, y } = dragPos.result.value;
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
    await new Promise(r => setTimeout(r, 300));

    const checkDrag = await call('Runtime.evaluate', {
      expression: `(() => {
        const ring = document.querySelector('.custom-cursor-ring');
        const label = document.querySelector('.custom-cursor-label');
        return {
          ringState: ring ? ring.dataset.state : null,
          labelText: label ? label.textContent : null,
          ringWidth: ring ? getComputedStyle(ring).width : null,
        };
      })()`,
      returnByValue: true
    });
    console.log('6. Drag state on hero stage:', checkDrag.result.value);
    snap = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/verified-drag.png', Buffer.from(snap.data, 'base64'));
  }

  // 7. Move to Paragraph: TEXT state
  const textPos = await call('Runtime.evaluate', {
    expression: `(() => {
      const p = document.querySelector('p');
      if (!p) return null;
      const rect = p.getBoundingClientRect();
      return { x: rect.left + 50, y: rect.top + rect.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('Paragraph target:', textPos.result.value);

  if (textPos.result.value) {
    const { x, y } = textPos.result.value;
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
    await new Promise(r => setTimeout(r, 300));

    const checkText = await call('Runtime.evaluate', {
      expression: `(() => {
        const ring = document.querySelector('.custom-cursor-ring');
        const dot = document.querySelector('.custom-cursor-dot');
        return {
          ringState: ring ? ring.dataset.state : null,
          ringWidth: ring ? getComputedStyle(ring).width : null,
          ringHeight: ring ? getComputedStyle(ring).height : null,
          dotOpacity: dot ? getComputedStyle(dot).opacity : null,
        };
      })()`,
      returnByValue: true
    });
    console.log('7. Text state on paragraph:', checkText.result.value);
  }

  ws.close();
  p.kill();
}

testAllStates();
