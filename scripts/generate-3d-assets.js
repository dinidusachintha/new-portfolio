import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'assets', 'images', '3d');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const savedImages = new Set();
const expectedImages = [
  'react-3d',
  'typescript-3d',
  'nodejs-3d',
  'cloud-3d',
  'ai-orb-3d',
  'mongodb-3d',
  'code-brackets-3d',
  'chrome-torus-3d'
];

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Generate 3D Assets</title>
  <style>body { margin: 0; background: transparent; }</style>
</head>
<body>
  <div id="status">Generating...</div>
  <script type="module">
    import * as THREE from '/node_modules/three/build/three.module.js';

    const width = 256;
    const height = 256;

    function createRenderer() {
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.setClearColor(0x000000, 0);
      return renderer;
    }

    function createScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0.4, 4.5);
      camera.lookAt(0, 0, 0);

      // Studio Lighting for sleek futuristic dark navy & electric cyan aesthetic
      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);

      // Key light - crisp cool white
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
      keyLight.position.set(3, 4, 4);
      scene.add(keyLight);

      // Electric Cyan Rim Light - signature accent
      const cyanRim = new THREE.DirectionalLight(0x00E5FF, 3.5);
      cyanRim.position.set(-3.5, 2.5, -2);
      scene.add(cyanRim);

      // Soft purple/blue fill from bottom
      const fillLight = new THREE.DirectionalLight(0x3b82f6, 1.2);
      fillLight.position.set(0, -3, 2);
      scene.add(fillLight);

      return { scene, camera };
    }

    const builders = {
      'react-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.25;
        group.rotation.y = -0.3;

        // Core glowing nucleus
        const coreMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x00b4d8,
          emissiveIntensity: 0.9,
          roughness: 0.1,
          metalness: 0.8,
          clearcoat: 1.0
        });
        const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), coreMat);
        group.add(nucleus);

        // 3 Elliptical orbital rings
        const ringMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x004466,
          emissiveIntensity: 0.4,
          roughness: 0.15,
          metalness: 0.9,
          clearcoat: 1.0,
          reflectivity: 0.9
        });

        const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];
        angles.forEach((ang) => {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.08, 20, 100), ringMat);
          ring.rotation.z = ang;
          ring.scale.set(1, 0.38, 1);
          group.add(ring);
        });

        return group;
      },

      'typescript-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.25;
        group.rotation.y = -0.35;

        // Dark navy 3D plate
        const boxMat = new THREE.MeshPhysicalMaterial({
          color: 0x071b36,
          emissive: 0x00172e,
          emissiveIntensity: 0.3,
          roughness: 0.15,
          metalness: 0.85,
          clearcoat: 1.0
        });
        const box = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 0.4), boxMat);
        group.add(box);

        // Electric Cyan edge bevel border
        const borderMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        const wireframeBox = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(2.02, 2.02, 0.42)),
          borderMat
        );
        group.add(wireframeBox);

        // 3D "TS" Extrusion
        const tsMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x007799,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.9,
          clearcoat: 1.0
        });

        // 'T'
        const tTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.12), tsMat);
        tTop.position.set(-0.45, 0.4, 0.26);
        const tStem = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.12), tsMat);
        tStem.position.set(-0.45, 0.05, 0.26);
        group.add(tTop, tStem);

        // 'S'
        const sTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.12), tsMat);
        sTop.position.set(0.42, 0.4, 0.26);
        const sMid = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.15, 0.12), tsMat);
        sMid.position.set(0.42, 0.05, 0.26);
        const sBot = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.12), tsMat);
        sBot.position.set(0.42, -0.3, 0.26);
        const sLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.12), tsMat);
        sLeft.position.set(0.18, 0.22, 0.26);
        const sRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.12), tsMat);
        sRight.position.set(0.66, -0.12, 0.26);
        group.add(sTop, sMid, sBot, sLeft, sRight);

        return group;
      },

      'nodejs-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.3;
        group.rotation.y = -0.3;

        // 3D Hexagonal Prism
        const hexMat = new THREE.MeshPhysicalMaterial({
          color: 0x0c2518,
          emissive: 0x051a0f,
          roughness: 0.2,
          metalness: 0.85,
          clearcoat: 1.0
        });
        const hex = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.45, 6), hexMat);
        hex.rotation.x = Math.PI / 2;
        group.add(hex);

        // Node.js neon emerald & electric cyan glowing wireframe rim
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.26, 1.26, 0.46, 6)),
          new THREE.MeshBasicMaterial({ color: 0x22c55e })
        );
        edge.rotation.x = Math.PI / 2;
        group.add(edge);

        // Inner glowing 'N' symbol in electric cyan
        const nMat = new THREE.MeshPhysicalMaterial({
          color: 0x22c55e,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.6,
          roughness: 0.1,
          metalness: 0.9
        });
        const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.15), nMat);
        leftBar.position.set(-0.35, 0, 0.28);
        const rightBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.15), nMat);
        rightBar.position.set(0.35, 0, 0.28);
        const diagBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.05, 0.15), nMat);
        diagBar.rotation.z = -0.65;
        diagBar.position.set(0, 0, 0.28);
        group.add(leftBar, rightBar, diagBar);

        return group;
      },

      'cloud-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.2;
        group.rotation.y = -0.25;

        const cloudMat = new THREE.MeshPhysicalMaterial({
          color: 0xe6f8ff,
          emissive: 0x007799,
          emissiveIntensity: 0.25,
          roughness: 0.1,
          metalness: 0.2,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });

        // 5 overlapping smooth spheres forming a lush 3D stylized cloud
        const lobes = [
          { r: 0.65, x: 0, y: 0.1, z: 0 },
          { r: 0.5, x: -0.6, y: -0.1, z: 0.05 },
          { r: 0.52, x: 0.6, y: -0.05, z: 0.05 },
          { r: 0.42, x: -0.9, y: -0.2, z: 0 },
          { r: 0.4, x: 0.9, y: -0.22, z: 0 }
        ];

        lobes.forEach(l => {
          const m = new THREE.Mesh(new THREE.SphereGeometry(l.r, 32, 32), cloudMat);
          m.position.set(l.x, l.y, l.z);
          group.add(m);
        });

        // Subtle electric cyan data ring underneath
        const ringMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.8,
          roughness: 0.1,
          metalness: 0.9
        });
        const dataRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.04, 16, 64), ringMat);
        dataRing.rotation.x = Math.PI / 2.2;
        dataRing.position.set(0, -0.45, 0);
        group.add(dataRing);

        return group;
      },

      'ai-orb-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.25;
        group.rotation.y = 0.4;

        // Glowing core
        const coreMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 1.2,
          roughness: 0.1,
          metalness: 0.8
        });
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), coreMat);
        group.add(core);

        // Futuristic geodesic icosahedron wireframe
        const icoGeo = new THREE.IcosahedronGeometry(1.15, 1);
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.85 });
        const wireIco = new THREE.Mesh(icoGeo, wireMat);
        group.add(wireIco);

        // Outer equatorial energy rings
        const ringMat = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          roughness: 0.1,
          metalness: 0.9
        });
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.04, 16, 64), ringMat);
        ring1.rotation.x = Math.PI / 3;
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.04, 16, 64), ringMat);
        ring2.rotation.y = Math.PI / 3;
        group.add(ring1, ring2);

        return group;
      },

      'mongodb-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.35;
        group.rotation.y = -0.3;

        const platterMat = new THREE.MeshPhysicalMaterial({
          color: 0x091e36,
          emissive: 0x031020,
          roughness: 0.2,
          metalness: 0.85,
          clearcoat: 1.0
        });

        const cyanSlotMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.8,
          roughness: 0.1,
          metalness: 0.9
        });

        // 3 stacked database disk platters
        [-0.55, 0, 0.55].forEach(y => {
          const platter = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.32, 32), platterMat);
          platter.position.y = y;
          const rim = new THREE.Mesh(new THREE.TorusGeometry(1.11, 0.02, 16, 48), cyanSlotMat);
          rim.rotation.x = Math.PI / 2;
          rim.position.y = y;
          group.add(platter, rim);
        });

        // MongoDB stylized cyber leaf on top
        const leafMat = new THREE.MeshPhysicalMaterial({
          color: 0x22c55e,
          emissive: 0x16a34a,
          emissiveIntensity: 0.5,
          roughness: 0.1,
          metalness: 0.7
        });
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 16), leafMat);
        leaf.rotation.z = 0.2;
        leaf.position.set(0, 0.9, 0.3);
        group.add(leaf);

        return group;
      },

      'code-brackets-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.2;
        group.rotation.y = -0.3;

        const bracketMat = new THREE.MeshPhysicalMaterial({
          color: 0x00e5ff,
          emissive: 0x007799,
          emissiveIntensity: 0.7,
          roughness: 0.15,
          metalness: 0.9,
          clearcoat: 1.0
        });

        // Left bracket '<'
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.18), bracketMat);
        l1.rotation.z = Math.PI / 4;
        l1.position.set(-0.75, 0.28, 0);
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.18), bracketMat);
        l2.rotation.z = -Math.PI / 4;
        l2.position.set(-0.75, -0.28, 0);
        group.add(l1, l2);

        // Center slash '/'
        const slash = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.45, 0.18), bracketMat);
        slash.rotation.z = -Math.PI / 6;
        slash.position.set(0, 0, 0);
        group.add(slash);

        // Right bracket '>'
        const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.18), bracketMat);
        r1.rotation.z = -Math.PI / 4;
        r1.position.set(0.75, 0.28, 0);
        const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.18), bracketMat);
        r2.rotation.z = Math.PI / 4;
        r2.position.set(0.75, -0.28, 0);
        group.add(r1, r2);

        return group;
      },

      'chrome-torus-3d': () => {
        const group = new THREE.Group();
        group.rotation.x = 0.4;
        group.rotation.y = -0.35;

        // Abstract liquid chrome torus knot
        const chromeMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          emissive: 0x004455,
          emissiveIntensity: 0.35,
          roughness: 0.04,
          metalness: 0.98,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 1.0
        });

        const knot = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.9, 0.28, 128, 32, 2, 3),
          chromeMat
        );
        group.add(knot);

        return group;
      }
    };

    const renderer = createRenderer();
    document.body.appendChild(renderer.domElement);

    async function run() {
      for (const [name, builder] of Object.entries(builders)) {
        const { scene, camera } = createScene();
        const obj = builder();
        scene.add(obj);

        renderer.render(scene, camera);
        const dataUrl = renderer.domElement.toDataURL('image/png');

        await fetch('/save-asset?name=' + name, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl })
        });
      }
      document.getElementById('status').innerText = 'COMPLETE';
    }

    run();
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else if (url.pathname.startsWith('/node_modules/')) {
    const filePath = path.join(rootDir, url.pathname);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } else if (url.pathname === '/save-asset' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { image } = JSON.parse(body);
        const name = url.searchParams.get('name');
        const base64Data = image.replace(/^data:image\/png;base64,/, '');
        const pngPath = path.join(outDir, `${name}.png`);
        fs.writeFileSync(pngPath, base64Data, 'base64');
        console.log(`Saved ${name}.png (${(fs.statSync(pngPath).size / 1024).toFixed(1)} KB)`);
        savedImages.add(name);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));

        if (savedImages.size >= expectedImages.length) {
          console.log('All 8 3D assets generated successfully!');
          setTimeout(() => {
            process.exit(0);
          }, 500);
        }
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3847;
server.listen(PORT, () => {
  console.log(`Asset generator server listening on port ${PORT}...`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const child = spawn(chromePath, [
    '--headless',
    '--use-gl=angle',
    '--enable-webgl',
    '--no-sandbox',
    `http://127.0.0.1:${PORT}/`
  ]);

  child.on('error', err => {
    console.error('Failed to spawn chrome:', err);
    process.exit(1);
  });
});
