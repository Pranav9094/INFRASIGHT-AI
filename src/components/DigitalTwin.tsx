// ============================================================
// INFRA-SIGHT — 3D Digital Twin
// Golden Gate Bridge — Procedurally generated visualization
// NOT survey geometry — see disclaimer label
// ============================================================

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useStore } from '../stores/useStore';
import { ASSET_REGISTRY } from '../data/ggbAsset';

const COMPONENT_COLORS: Record<string, {
  default: number; selected: number; hover: number;
}> = {
  'DECK-001':     { default: 0x2D5F8A, selected: 0x3B82F6, hover: 0x60A5FA },
  'TOWER-N-001':  { default: 0xC0392B, selected: 0xEF4444, hover: 0xFCA5A5 },
  'TOWER-S-001':  { default: 0xC0392B, selected: 0xEF4444, hover: 0xFCA5A5 },
  'CABLE-MAIN-001': { default: 0x64748B, selected: 0x94A3B8, hover: 0xCBD5E1 },
  'SUSPENDER-001':  { default: 0x475569, selected: 0x64748B, hover: 0x94A3B8 },
  'PIER-N-001':   { default: 0x4E6FA3, selected: 0x60A5FA, hover: 0x93C5FD },
  'PIER-S-001':   { default: 0x4E6FA3, selected: 0x60A5FA, hover: 0x93C5FD },
  'JOINT-001':    { default: 0x92400E, selected: 0xF59E0B, hover: 0xFCD34D },
};

// Risk → glow color mapping
const RISK_GLOW: Record<string, number> = {
  Low: 0x22C55E,
  Medium: 0xF59E0B,
  High: 0xEF4444,
  Critical: 0xDC2626,
  Unknown: 0x9CA3AF,
};

export default function DigitalTwin() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number>(0);
  const partsRef = useRef<Record<string, THREE.Object3D[]>>({});
  const glowsRef = useRef<Record<string, THREE.PointLight>>({});

  const selectedComponentId = useStore(s => s.selectedComponentId);
  const setSelectedComponent = useStore(s => s.setSelectedComponent);
  const components = ASSET_REGISTRY[0].components;

  const resetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(32, 16, 28);
      controlsRef.current.target.set(0, 6, 0);
      controlsRef.current.update();
    }
  }, []);

  // Update component colors when selection changes
  useEffect(() => {
    if (!partsRef.current) return;
    const parts = partsRef.current;

    components.forEach(comp => {
      const objs = parts[comp.id];
      if (!objs) return;
      const colors = COMPONENT_COLORS[comp.id];
      if (!colors) return;

      const isSelected = comp.id === selectedComponentId;
      const targetColor = isSelected ? colors.selected : colors.default;

      objs.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
          const mat = obj.material as THREE.MeshStandardMaterial;
          mat.color.setHex(targetColor);
          mat.emissive.setHex(isSelected ? targetColor : 0x000000);
          mat.emissiveIntensity = isSelected ? 0.25 : 0;
        } else if (obj instanceof THREE.Line) {
          const mat = obj.material as THREE.LineBasicMaterial;
          mat.color.setHex(targetColor);
        }
      });

      // Glow
      const glow = glowsRef.current[comp.id];
      if (glow) {
        glow.intensity = isSelected ? 3 : 0;
      }
    });
  }, [selectedComponentId, components]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0D1F35);
    scene.fog = new THREE.FogExp2(0x0D1F35, 0.012);
    sceneRef.current = scene;

    // ── Camera ───────────────────────────────────────────────
    const cam = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    cam.position.set(32, 16, 28);
    cameraRef.current = cam;

    // ── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Controls ─────────────────────────────────────────────
    const controls = new OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 6, 0);
    controls.minDistance = 8;
    controls.maxDistance = 120;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.update();
    controlsRef.current = controls;

    // ── Lighting ─────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x8BAED4, 0.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xFFF5E0, 2.8);
    sun.position.set(30, 40, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x4A7FC1, 0.8);
    fill.position.set(-20, 10, -20);
    scene.add(fill);

    const waterGlow = new THREE.HemisphereLight(0x6EAFD0, 0x1A3550, 0.5);
    scene.add(waterGlow);

    // ── Parts registry ───────────────────────────────────────
    const parts: Record<string, THREE.Object3D[]> = {};
    partsRef.current = parts;

    function mat(hex: number, metalness = 0.5, roughness = 0.4) {
      return new THREE.MeshStandardMaterial({ color: hex, metalness, roughness });
    }

    function addMesh(id: string, geo: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, castShadow = true) {
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      mesh.userData.componentId = id;
      scene.add(mesh);
      parts[id] = parts[id] || [];
      parts[id].push(mesh);
      return mesh;
    }

    // ── Water / Ground ───────────────────────────────────────
    const waterGeo = new THREE.PlaneGeometry(200, 200, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0A2A4A, metalness: 0.2, roughness: 0.1,
      opacity: 0.92, transparent: true,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.5;
    water.receiveShadow = true;
    scene.add(water);

    // Shore / land areas
    const landMat = mat(0x1A2F45, 0.1, 0.9);
    const landN = new THREE.Mesh(new THREE.BoxGeometry(80, 2, 30), landMat);
    landN.position.set(0, -1.5, -30);
    landN.receiveShadow = true;
    scene.add(landN);
    const landS = new THREE.Mesh(new THREE.BoxGeometry(80, 2, 30), landMat);
    landS.position.set(0, -1.5, 30);
    landS.receiveShadow = true;
    scene.add(landS);

    // ── Piers ────────────────────────────────────────────────
    // South Pier (more prominent - active retrofit)
    addMesh('PIER-S-001',
      new THREE.BoxGeometry(4, 6, 5),
      mat(COMPONENT_COLORS['PIER-S-001'].default, 0.6, 0.5),
      14, 2.5, 0
    );

    // North Pier
    addMesh('PIER-N-001',
      new THREE.BoxGeometry(3, 4, 4),
      mat(COMPONENT_COLORS['PIER-N-001'].default, 0.5, 0.5),
      -22, 1.5, 0
    );

    // ── Towers ───────────────────────────────────────────────
    // Each tower has a central shaft and two legs with portal braces
    function buildTower(id: string, x: number) {
      const towerMat = mat(COMPONENT_COLORS[id].default, 0.65, 0.35);
      const legZ = [2.2, -2.2];

      legZ.forEach(z => {
        // Main leg
        addMesh(id,
          new THREE.BoxGeometry(1.6, 26, 1.6),
          towerMat, x, 13, z
        );

        // Taper top section
        const topGeo = new THREE.CylinderGeometry(0.6, 0.8, 4, 8);
        const top = new THREE.Mesh(topGeo, towerMat);
        top.position.set(x, 27, z);
        top.castShadow = true;
        top.userData.componentId = id;
        scene.add(top);
        parts[id] = parts[id] || [];
        parts[id].push(top);
      });

      // Portal braces (cross-bars)
      const braceYs = [4, 8, 14, 20, 24];
      braceYs.forEach(y => {
        addMesh(id,
          new THREE.BoxGeometry(0.4, 0.4, 4.4 + (y < 10 ? 0.8 : 0)),
          towerMat, x, y, 0
        );
      });

      // Add glow light for selected state
      const glow = new THREE.PointLight(RISK_GLOW['Medium'], 0, 12);
      glow.position.set(x, 14, 0);
      scene.add(glow);
      glowsRef.current[id] = glow;
    }

    buildTower('TOWER-S-001', 14);
    buildTower('TOWER-N-001', -14);

    // ── Main Deck ────────────────────────────────────────────
    const deckMat = mat(COMPONENT_COLORS['DECK-001'].default, 0.3, 0.7);
    const deckGeo = new THREE.BoxGeometry(52, 0.8, 14);
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 4.5, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    deck.userData.componentId = 'DECK-001';
    scene.add(deck);
    parts['DECK-001'] = [deck];

    // Deck underside stiffening truss
    const trussMat = mat(0x1E3A5A, 0.5, 0.6);
    for (let x = -24; x <= 24; x += 4) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 14), trussMat);
      truss.position.set(x, 3.8, 0);
      truss.userData.componentId = 'DECK-001';
      scene.add(truss);
      parts['DECK-001'].push(truss);
    }

    // Deck railings
    const railMat = mat(0x4A6FA5, 0.7, 0.3);
    [-7, 7].forEach(z => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(52, 0.2, 0.2), railMat);
      rail.position.set(0, 5.3, z);
      rail.userData.componentId = 'DECK-001';
      scene.add(rail);
      parts['DECK-001'].push(rail);
    });

    // Deck glow
    const deckGlow = new THREE.PointLight(RISK_GLOW['Medium'], 0, 16);
    deckGlow.position.set(0, 5, 0);
    scene.add(deckGlow);
    glowsRef.current['DECK-001'] = deckGlow;

    // ── Main Cables ──────────────────────────────────────────
    const cableColor = COMPONENT_COLORS['CABLE-MAIN-001'].default;
    const cableMat = new THREE.LineBasicMaterial({ color: cableColor, linewidth: 2 });

    function buildCable(z: number) {
      const pts: THREE.Vector3[] = [];
      const segments = 80;
      const span = 52; // From anchorage to anchorage
      const towerX = 14;
      const towerH = 26;
      const deckH = 5;
      const sagFactor = 6.5;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = -span / 2 + t * span;

        let y: number;
        // Catenary approximation
        if (x >= -towerX && x <= towerX) {
          const localT = (x - (-towerX)) / (2 * towerX);
          y = towerH - sagFactor * 4 * localT * (1 - localT);
        } else if (x < -towerX) {
          const localT = (x - (-span / 2)) / (span / 2 - towerX);
          y = deckH + 4 + (towerH - deckH - 4) * localT;
        } else {
          const localT = (x - towerX) / (span / 2 - towerX);
          y = towerH - (towerH - deckH - 4) * localT;
        }

        pts.push(new THREE.Vector3(x, y, z));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, cableMat.clone());
      line.userData.componentId = 'CABLE-MAIN-001';
      scene.add(line);
      parts['CABLE-MAIN-001'] = parts['CABLE-MAIN-001'] || [];
      parts['CABLE-MAIN-001'].push(line);
    }

    buildCable(4.2);
    buildCable(-4.2);

    // Cable glow
    const cableGlow = new THREE.PointLight(RISK_GLOW['Medium'], 0, 20);
    cableGlow.position.set(0, 18, 0);
    scene.add(cableGlow);
    glowsRef.current['CABLE-MAIN-001'] = cableGlow;

    // ── Suspender Ropes ──────────────────────────────────────
    const hangerMat = new THREE.LineBasicMaterial({
      color: COMPONENT_COLORS['SUSPENDER-001'].default
    });
    const hangerParts: THREE.Object3D[] = [];

    function getCableY(x: number): number {
      const towerX = 14;
      const towerH = 26;
      const sagFactor = 6.5;
      if (x >= -towerX && x <= towerX) {
        const localT = (x - (-towerX)) / (2 * towerX);
        return towerH - sagFactor * 4 * localT * (1 - localT);
      }
      return towerH;
    }

    const numHangers = 18;
    for (let i = 0; i <= numHangers; i++) {
      const x = -14 + i * (28 / numHangers);
      const cableY = getCableY(x);
      [4.2, -4.2].forEach(z => {
        const pts = [
          new THREE.Vector3(x, cableY, z),
          new THREE.Vector3(x, 5.0, z),
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, hangerMat.clone());
        line.userData.componentId = 'SUSPENDER-001';
        scene.add(line);
        hangerParts.push(line);
      });
    }
    parts['SUSPENDER-001'] = hangerParts;

    // Hanger glow
    const hangerGlow = new THREE.PointLight(RISK_GLOW['Low'], 0, 14);
    hangerGlow.position.set(0, 12, 0);
    scene.add(hangerGlow);
    glowsRef.current['SUSPENDER-001'] = hangerGlow;

    // ── Expansion Joints / Connections ───────────────────────
    const jointMat = mat(COMPONENT_COLORS['JOINT-001'].default, 0.7, 0.3);

    // Joint at each tower connection
    [-14, 14].forEach(x => {
      addMesh('JOINT-001',
        new THREE.BoxGeometry(1.0, 1.2, 15),
        jointMat, x, 5.0, 0
      );
    });

    // Joint glow
    const jointGlow = new THREE.PointLight(RISK_GLOW['Medium'], 0, 10);
    jointGlow.position.set(0, 5, 0);
    scene.add(jointGlow);
    glowsRef.current['JOINT-001'] = jointGlow;

    // ── Anchorage blocks ─────────────────────────────────────
    const anchMat = mat(0x2A3F55, 0.4, 0.8);
    [-26, 26].forEach(x => {
      const anch = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 8), anchMat);
      anch.position.set(x, 1, 0);
      anch.receiveShadow = true;
      scene.add(anch);
    });

    // ── Decorative approach spans ─────────────────────────────
    const approachMat = mat(0x2D5070, 0.3, 0.7);
    [-26, 26].forEach(x => {
      const approach = new THREE.Mesh(new THREE.BoxGeometry(8, 0.7, 14), approachMat);
      approach.position.set(x + (x > 0 ? 4 : -4), 4.5, 0);
      approach.receiveShadow = true;
      scene.add(approach);
    });

    // ── Stars / Ambient particles ─────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 300;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xAABBCC, size: 0.3 }));
    scene.add(stars);

    // ── Raycasting for clicks ─────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function getComponentIdFromObject(obj: THREE.Object3D): string | null {
      let current: THREE.Object3D | null = obj;
      while (current) {
        if (current.userData.componentId) return current.userData.componentId;
        current = current.parent;
      }
      return null;
    }

    function onClick(e: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, cam);

      const allMeshes: THREE.Object3D[] = [];
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh && obj.userData.componentId) {
          allMeshes.push(obj);
        }
      });

      const hits = raycaster.intersectObjects(allMeshes, false);
      if (hits.length > 0) {
        const compId = getComponentIdFromObject(hits[0].object);
        if (compId) {
          setSelectedComponent(compId);
        }
      }
    }

    renderer.domElement.addEventListener('click', onClick);

    // ── Animate ───────────────────────────────────────────────
    let animTime = 0;

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      animTime += 0.005;

      controls.update();

      // Subtle water animation
      if (water.geometry instanceof THREE.PlaneGeometry) {
        const positions = water.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          positions.setY(i, Math.sin(x * 0.1 + animTime) * 0.15 + Math.cos(z * 0.12 + animTime * 0.8) * 0.1);
        }
        positions.needsUpdate = true;
        water.geometry.computeVertexNormals();
      }

      renderer.render(scene, cam);
    }

    animate();

    // ── Resize ───────────────────────────────────────────────
    function onResize() {
      if (!mount) return;
      cam.aspect = mount.clientWidth / mount.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [setSelectedComponent]);

  const compRiskColors: Record<string, string> = {};
  components.forEach(c => {
    compRiskColors[c.id] = c.risk === 'Low' ? '#22c55e' : c.risk === 'Medium' ? '#f59e0b' : c.risk === 'High' ? '#ef4444' : '#dc2626';
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top-left tag */}
      <div className="twin-overlay-tl">
        <span className="twin-tag">
          <span className="dot-live" />
          DIGITAL TWIN REPRESENTATION
        </span>
      </div>

      {/* Controls */}
      <div className="twin-controls">
        <button className="twin-ctrl-btn" onClick={resetCamera} title="Reset camera">⊙</button>
        <button className="twin-ctrl-btn" onClick={() => {
          if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.multiplyScalar(0.85);
            controlsRef.current.update();
          }
        }} title="Zoom in">+</button>
        <button className="twin-ctrl-btn" onClick={() => {
          if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.multiplyScalar(1.15);
            controlsRef.current.update();
          }
        }} title="Zoom out">−</button>
      </div>

      {/* Legend */}
      <div className="twin-legend">
        <div className="legend-item">
          <div className="legend-dot legend-dot-green" />
          <span>Operational</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot-amber" />
          <span>Monitor</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot-red" />
          <span>Attention</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot-grey" />
          <span>Unknown</span>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="twin-hint">
        Drag to orbit · Scroll to zoom · Click components to inspect
      </div>

      {/* Model disclaimer */}
      <div style={{
        position: 'absolute', bottom: 12, left: 14,
        fontSize: 9, color: 'rgba(255,255,255,0.35)',
        pointerEvents: 'none',
      }}>
        Visualization model — not survey geometry
      </div>
    </div>
  );
}
