
/* ==========================================================================
   LEVELS: definitions, generator (with a reachability check so every egg can
   be collected) and the hand-painted backgrounds, pre-rendered once per level.
   ========================================================================== */
const LEVEL_DEFS = [
  { key: 'meadow', music: 'l0', pal: 'meadow', icons: ['egg', 'bubu', 'leo'],
    trees: 30, rocks: 5, hay: 8, beetles: [0, 0, 0], lanes: [0, 1, 1], conesPerLane: 1, coneSpeed: 0.75, mud: [0, 0, 0], sparkle: [0, 1, 1],
    pond: true, stars: ['islet', 'nook', 'treetop'] },
  { key: 'forest', music: 'l1', pal: 'forest', icons: ['beetle', 'tree', 'egg'],
    trees: 105, rocks: 8, bigTrees: true, beetles: [2, 4, 5], lanes: [0, 0, 1], conesPerLane: 1, mud: [0, 0, 0], sparkle: [2, 3, 3],
    stars: ['guarded', 'treetop', 'nook'] },
  { key: 'river', music: 'l2', pal: 'river', icons: ['mud', 'cone', 'egg'],
    trees: 40, rocks: 10, beetles: [1, 1, 2], lanes: [1, 1, 2], conesPerLane: 1, mud: [3, 5, 4], sparkle: [1, 1, 2], river: 'v',
    stars: ['guarded', 'islet', 'treetop'] },
  { key: 'hill', music: 'l3', pal: 'hill', icons: ['wind', 'mill', 'egg'],
    trees: 18, rocks: 20, mills: 4, beetles: [1, 2, 3], lanes: [1, 1, 2], conesPerLane: 1, mud: [0, 1, 1], sparkle: [1, 1, 2], wind: 1,
    stars: ['nook', 'guarded', 'treetop'] },
  { key: 'fall', music: 'l4', pal: 'fall', icons: ['fall', 'star', 'egg'],
    trees: 46, rocks: 12, beetles: [2, 2, 3], lanes: [1, 1, 2], conesPerLane: 1, mud: [1, 2, 2], sparkle: [1, 1, 2], cliff: true, river: 'fall',
    stars: ['guarded', 'islet', 'nook'], pathY: [1100, 1420] },
  { key: 'sunset', music: 'l5', pal: 'sunset', icons: ['lantern', 'butterfly', 'egg'],
    trees: 50, rocks: 10, beetles: [2, 3, 4], lanes: [1, 2, 2], conesPerLane: 2, mud: [1, 2, 2], sparkle: [2, 2, 2], wind: 0.5, lanterns: true, pond: true,
    stars: ['treetop', 'guarded', 'islet'] }
];
const BOSS_DEF = { key: 'boss', music: 'boss', icons: ['bubu', 'ciori', 'leo'], };

const PALS = {
  meadow: { g0: '#CBD08F', g1: '#B4C283', tints: ['#E6D58A', '#A9BF7E', '#DCC47C', '#C7D39A', '#EBCB9C', '#B9CC8A'], canopy: ['#8FAF6A', '#A3BC72', '#7E9F63', '#B9C77A'], flowers: ['#E7A6A1', '#F3D36B', '#FBF3DE', '#E58F6B'], path: '#EBCB9E', trunk: '#9A6B4C', rock: '#C8AE98' },
  forest: { g0: '#AEBB80', g1: '#94A974', tints: ['#7F9B66', '#B9BF7F', '#8CA36B', '#C9B97A', '#9DAE78'], canopy: ['#6F9160', '#84A066', '#5F8459', '#9DB06C', '#7A9A72'], flowers: ['#F3D36B', '#E7A6A1', '#FBF3DE'], path: '#DCC090', trunk: '#8A6048', rock: '#B9A092' },
  river:  { g0: '#C6C389', g1: '#B3B57D', tints: ['#D8B987', '#A9B97F', '#C9A979', '#BFC98E'], canopy: ['#93AD6E', '#A9B878', '#829D66'], flowers: ['#FBF3DE', '#E7A6A1', '#F3D36B'], path: '#E5C597', trunk: '#96684A', rock: '#C2A994' },
  hill:   { g0: '#D9C985', g1: '#C8BE7C', tints: ['#E8CE86', '#BFC480', '#E5B97C', '#D9D08E', '#EBD59A'], canopy: ['#A7B56B', '#BFBF73', '#96A965'], flowers: ['#E58F6B', '#F3D36B', '#FBF3DE', '#E7A6A1'], path: '#F0D3A3', trunk: '#9A6B4C', rock: '#CDB39A' },
  fall:   { g0: '#B6C18C', g1: '#A2B382', tints: ['#C8C08A', '#93AE84', '#D2B48A', '#A9BC8E'], canopy: ['#7E9F6B', '#96AE74', '#6E9068', '#A6B67A'], flowers: ['#FBF3DE', '#E7A6A1', '#F3D36B'], path: '#E0C295', trunk: '#8A6048', rock: '#BFA090' },
  sunset: { g0: '#D6B87E', g1: '#C5A674', tints: ['#E4A771', '#DB9C79', '#CBB47C', '#E2BB8C', '#D8A07A'], canopy: ['#D98A52', '#E2A04F', '#C96F4E', '#E6B65A', '#B98A5A'], flowers: ['#F3D36B', '#E58F6B', '#FBF3DE'], path: '#EECFA2', trunk: '#8A5A48', rock: '#C4A08E' }
};
const HERO_R = 27;                       // collision radius of the heroes
const levelCount = () => clamp(CONFIG.levels | 0, 1, 12);
const levelDef = idx => LEVEL_DEFS[idx % LEVEL_DEFS.length];
const skyTOf = idx => levelCount() === 1 ? 0.4 : idx / (levelCount() - 1) * 0.95;

function spline(pts, stepLen) {          // Catmull-Rom through points, resampled evenly
  const raw = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const t = k / 24, t2 = t * t, t3 = t2 * t;
      raw.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  raw.push(pts[pts.length - 1]);
  const out = [raw[0]]; let acc = 0;
  for (let i = 1; i < raw.length; i++) {
    acc += dist(raw[i][0], raw[i][1], raw[i - 1][0], raw[i - 1][1]);
    if (acc >= stepLen) { out.push(raw[i]); acc = 0; }
  }
  out.push(raw[raw.length - 1]);
  return out;
}

function genLevel(idx, seed) {
  const def = levelDef(idx), r = rng(seed), WW = 3200, WH = 1800, cols = WW / CS, rows = WH / CS;
  const NW = clamp(CONFIG.wavesPerLevel | 0, 1, 5);
  const top = def.cliff ? 520 : 280;
  const L = { idx, def, seed, W: WW, H: WH, cols, rows, top, skyH: def.cliff ? 160 : 280, pal: PALS[def.pal], skyT: skyTOf(idx),
    grid: new Uint8Array(cols * rows), flag: new Uint8Array(cols * rows), solids: [], trees: [], dynTrees: [], beetles: [], lanes: [], cones: [],
    bridges: [], stones: [], mills: [], lanterns: [], stars: [], waves: [], waterCells: [], sprites: [],
    spawn: { x: 240, y: 1080 }, nest: { x: 2950, y: 1040 }, NW, minZoom: 0.6 };
  const G = L.grid, F = L.flag;       // F bits: 1 no trees, 2 no eggs, 4 cave, 8 bridge, 16 lane
  const inW = (cx, cy) => cx >= 0 && cy >= 0 && cx < cols && cy < rows;
  const ci = (x, y) => clamp(y / CS | 0, 0, rows - 1) * cols + clamp(x / CS | 0, 0, cols - 1);
  const mark = (x, y, rad, bits) => {
    for (let cy = (y - rad) / CS | 0; cy <= (y + rad) / CS; cy++) for (let cx = (x - rad) / CS | 0; cx <= (x + rad) / CS; cx++)
      if (inW(cx, cy) && dist((cx + 0.5) * CS, (cy + 0.5) * CS, x, y) <= rad + 20) F[cy * cols + cx] |= bits;
  };
  const region = k => [k * WW / NW, (k + 1) * WW / NW];
  const dv = (arr, k) => arr[Math.min(arr.length - 1, Math.floor(k * arr.length / NW))];
  const starRegion = i => Math.min(NW - 1, Math.floor(i * NW / 3));
  for (let cy = 0; cy < top / CS; cy++) for (let cx = 0; cx < cols; cx++) G[cy * cols + cx] = 3;

  // ---- the path from the start to the nest ----------------------------------
  const py = def.pathY || [740, 1380];
  let wps;
  if (def.river) {
    const Y = lerp(py[0] + 60, py[1] - 60, r());
    wps = [[L.spawn.x, L.spawn.y], [720 + r() * 120, lerp(py[0], py[1], r())], [1230, Y], [1970, Y], [2480 + r() * 120, lerp(py[0], py[1], r())], [L.nest.x, L.nest.y]];
    L.bridgeY = Y;
  } else {
    wps = [[L.spawn.x, L.spawn.y]];
    for (let i = 1; i <= 4; i++) wps.push([L.spawn.x + (L.nest.x - L.spawn.x) * i / 5 + (r() - 0.5) * 160, lerp(py[0], py[1], r())]);
    wps.push([L.nest.x, L.nest.y]);
  }
  L.path = spline(wps, 26);
  const pathDist = (x, y) => { let m = 1e9; for (let i = 0; i < L.path.length; i += 3) { const d = dist(x, y, L.path[i][0], L.path[i][1]); if (d < m) m = d; } return m; };
  for (const p of L.path) mark(p[0], p[1], 78, 1);
  mark(L.spawn.x, L.spawn.y, 210, 3); mark(L.nest.x, L.nest.y, 200, 3);

  // ---- water ----------------------------------------------------------------
  const setWater = (cx, cy) => { if (inW(cx, cy) && G[cy * cols + cx] === 0) G[cy * cols + cx] = 2; };
  if (def.cliff) {
    for (let cy = 6; cy <= 10; cy++) for (let cx = 36; cx <= 43; cx++) { G[cy * cols + cx] = 0; F[cy * cols + cx] |= 7; }
    for (let cy = 11; cy <= 12; cy++) for (let cx = 39; cx <= 41; cx++) { G[cy * cols + cx] = 0; F[cy * cols + cx] |= 7; }
    for (let cy = 13; cy <= 15; cy++) for (let cx = 0; cx < cols; cx++) F[cy * cols + cx] |= 1;
    for (let cy = 16; cy < 24; cy++) for (let cx = 0; cx < cols; cx++) {
      const nx = ((cx + 0.5) * CS - 1620) / 330, ny = ((cy + 0.5) * CS - 790) / 132;
      if (nx * nx + ny * ny < 1) setWater(cx, cy);
    }
    L.fall = { x: 1620, w: 250, y0: 160, y1: 668 };
    L.cave = { x0: 1440, y0: 240, x1: 1760, y1: 520, reveal: 0, egg: { x: 1600, y: 335 } };
    L.cover = { x: 1400, y: 215, w: 400, h: 310 };
  }
  if (def.river) {
    const ph = r() * 6, ph2 = r() * 6;
    L.riverX = def.river === 'fall' ? (y => 1620 + 150 * Math.sin((y - 840) / 270)) : (y => 1600 + 180 * Math.sin(y / 310 + ph) + 50 * Math.sin(y / 120 + ph2));
    const y0 = def.river === 'fall' ? 840 : top;
    for (let cy = y0 / CS | 0; cy < rows; cy++) {
      const yc = (cy + 0.5) * CS, rx = L.riverX(yc);
      for (let cx = 0; cx < cols; cx++) if (Math.abs((cx + 0.5) * CS - rx) < 78) setWater(cx, cy);
    }
    const crossing = (by, list) => {
      const row0 = Math.round((by - 60) / CS), yc = (row0 + 1.5) * CS, bx = L.riverX(yc);
      for (let cy = row0; cy < row0 + 3; cy++) for (let cx = (bx - 160) / CS | 0; cx <= (bx + 160) / CS; cx++)
        if (inW(cx, cy)) { const i = cy * cols + cx; if (G[i] === 2) G[i] = 0; F[i] |= 9; }
      list.push({ x: bx, y: yc, w: 320, h: 120 });
      return yc;
    };
    L.crossY = [crossing(L.bridgeY, L.bridges)];
    for (const y of [top + 190, WH - 200]) if (Math.abs(y - L.bridgeY) > 330 && !(def.river === 'fall' && y < 900)) L.crossY.push(crossing(y, L.stones));
  }

  const pathFar = (x, y, d) => pathDist(x, y) >= d;
  const areaClear = (x, y, rad) => {
    for (let cy = (y - rad) / CS | 0; cy <= (y + rad) / CS; cy++) for (let cx = (x - rad) / CS | 0; cx <= (x + rad) / CS; cx++) {
      if (!inW(cx, cy)) return false;
      if (G[cy * cols + cx] !== 0 || (F[cy * cols + cx] & 31)) return false;
    }
    return true;
  };
  const addSolid = (x, y, rad, kind, extra) => { const s = Object.assign({ x, y, r: rad, kind, seed: r() * 1000 }, extra || {}); L.solids.push(s); return s; };
  const mudEllipse = (x, y, rx, ry) => {
    for (let cy = (y - ry) / CS | 0; cy <= (y + ry) / CS; cy++) for (let cx = (x - rx) / CS | 0; cx <= (x + rx) / CS; cx++) {
      if (!inW(cx, cy)) continue;
      const i = cy * cols + cx, nx = ((cx + 0.5) * CS - x) / rx, ny = ((cy + 0.5) * CS - y) / ry;
      if (nx * nx + ny * ny < 1 + (hash(x, cx * 7 + cy) - 0.5) * 0.35 && G[i] === 0 && !(F[i] & 14)) G[i] = 1;
    }
  };

  // ---- bonus stars: one per third of the map --------------------------------
  const kinds = def.stars.slice(0, clamp(CONFIG.starsPerLevel | 0, 0, 3));
  let guardSpots = [];
  for (let si = 0; si < kinds.length; si++) {
    const k = starRegion(si), [x0, x1] = region(k); let kind = kinds[si], done = false;
    if (kind === 'islet') {
      if (def.cliff) { L.stars.push({ x: 1620, y: 800, kind }); done = true; }
      else if (def.river) {
        for (let t = 0; t < 60 && !done; t++) {
          const y = top + 220 + r() * (WH - top - 440);
          if (L.crossY.every(cy => Math.abs(cy - y) > 250)) { L.stars.push({ x: L.riverX(y), y, kind }); done = true; }
        }
      } else if (def.pond) {
        for (let t = 0; t < 120 && !done; t++) {
          const rx = 190, ry = 130, x = lerp(x0 + rx + 70, x1 - rx - 70, r()), y = lerp(top + ry + 100, WH - ry - 100, r());
          if (!pathFar(x, y, rx + 150) || dist(x, y, L.spawn.x, L.spawn.y) < 460 || dist(x, y, L.nest.x, L.nest.y) < 460) continue;
          for (let cy = (y - ry) / CS | 0; cy <= (y + ry) / CS; cy++) for (let cx = (x - rx) / CS | 0; cx <= (x + rx) / CS; cx++) {
            const nx = ((cx + 0.5) * CS - x) / rx, ny = ((cy + 0.5) * CS - y) / ry;
            if (nx * nx + ny * ny < 1) setWater(cx, cy);
          }
          mark(x, y, rx + 50, 1);
          L.stars.push({ x, y, kind }); done = true;
        }
      }
      if (!done) kind = 'guarded';
    }
    if (kind === 'nook') {
      for (let t = 0; t < 120 && !done; t++) {
        const x = lerp(x0 + 250, x1 - 250, r()), y = r() < 0.5 ? top + 250 + r() * 90 : WH - 260 - r() * 70;
        if (!pathFar(x, y, 330) || !areaClear(x, y, 215)) continue;
        const gap = r() * TAU, n = 7, span = TAU - 1.6;
        for (let i = 0; i < n; i++) { const a = gap + 0.8 + i * span / (n - 1); addSolid(x + Math.cos(a) * 150, y + Math.sin(a) * 150, 44, 'rock'); }
        mark(x, y, 240, 3);
        L.stars.push({ x, y, kind, check: true });
        if (idx > 0) guardSpots.push({ x: x + 50, y: y - 20, n: 1, rad: 0 });
        done = true;
      }
      if (!done) kind = 'guarded';
    }
    if (kind === 'guarded') {
      for (let t = 0; t < 200 && !done; t++) {
        const x = lerp(x0 + 180, x1 - 180, r()), y = lerp(top + 200, WH - 200, r());
        if (!pathFar(x, y, 260) || !areaClear(x, y, 150) || dist(x, y, L.spawn.x, L.spawn.y) < 420) continue;
        mark(x, y, 170, 1);
        if (def.mud.some(m => m > 0)) mudEllipse(x, y, 160, 120);
        L.stars.push({ x, y, kind, check: true });
        guardSpots.push({ x, y, n: idx >= 1 ? (idx >= 3 ? 3 : 2) : 0, rad: 125 });
        done = true;
      }
    }
    if (kind === 'treetop') L.stars.push({ x: 0, y: 0, kind, hidden: true, region: k });
  }

  // ---- mud, pinecone lanes, windmills ---------------------------------------
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k);
    for (let m = 0, t = 0; m < dv(def.mud, k) && t < 80; t++) {
      const x = lerp(x0 + 100, x1 - 100, r()), y = lerp(top + 150, WH - 150, r());
      if (dist(x, y, L.spawn.x, L.spawn.y) < 330 || dist(x, y, L.nest.x, L.nest.y) < 300) continue;
      mudEllipse(x, y, 110 + r() * 80, 80 + r() * 60); m++;
    }
    for (let m = 0, t = 0; m < dv(def.lanes, k) && t < 120; t++) {
      const cx = lerp(x0 + 90, x1 - 90, r()) / CS | 0, x = (cx + 0.5) * CS;
      if (Math.abs(x - L.spawn.x) < 300 || Math.abs(x - L.nest.x) < 300 || L.lanes.some(l => Math.abs(l.x - x) < 240)) continue;
      let ok = true;
      for (let cy = (top / CS | 0) + 1; cy < rows && ok; cy++) for (let d = -1; d <= 1; d++) { const i = cy * cols + cx + d; if (G[i] > 1 || (F[i] & 14)) ok = false; }
      if (!ok) continue;
      for (let cy = top / CS | 0; cy < rows; cy++) for (let d = -1; d <= 1; d++) F[cy * cols + cx + d] |= 17;
      const lane = { x, y0: top + 70, y1: WH - 40 }; L.lanes.push(lane);
      const n = def.conesPerLane || 1;
      for (let j = 0; j < n; j++) L.cones.push({ lane, x, y: lerp(lane.y0, lane.y1, (j + r() * 0.6) / n), rot: 0, state: 'roll', t: 0, r: 26, seed: r() * 100 });
      m++;
    }
  }
  for (let m = 0, t = 0; m < (def.mills || 0) && t < 200; t++) {
    const x = WW * (0.15 + 0.23 * m) + (r() - 0.5) * 220, y = lerp(top + 330, WH - 330, r());
    if (!pathFar(x, y, 240) || !areaClear(x, y, 110)) continue;
    const s = addSolid(x, y, 56, 'mill'); mark(x, y, 150, 1);
    L.mills.push({ x, y, ang: r() * TAU, solid: s }); m++;
  }

  // ---- trees, rocks, haystacks ----------------------------------------------
  const spotFree = (x, y, rad) => {
    for (let a = -1; a < 8; a++) {
      const px = a < 0 ? x : x + Math.cos(a / 8 * TAU) * rad, py2 = a < 0 ? y : y + Math.sin(a / 8 * TAU) * rad;
      if (px < 30 || py2 < top + 20 || px > WW - 30 || py2 > WH - 30) return false;
      const i = ci(px, py2); if (G[i] !== 0 || (F[i] & 1)) return false;
    }
    return true;
  };
  const scatter = (count, rmin, rmax, kind, gap) => {
    for (let t = 0, placed = 0; t < count * 50 && placed < count; t++) {
      const R = lerp(rmin, rmax, r()), x = 70 + r() * (WW - 140), y = top + 50 + R + r() * (WH - top - 150 - R);
      const cx = x, cy = kind === 'tree' ? y + R * 0.15 : y, cr = kind === 'tree' ? R * 0.75 : R * 0.88;
      if (!spotFree(cx, cy, cr + 16)) continue;
      let ok = true;
      for (const s of L.solids) if (dist(cx, cy, s.x, s.y) < cr + s.r + gap) { ok = false; break; }
      if (!ok) continue;
      if (kind === 'tree') { const tr = { x, y, R, ci: r() * L.pal.canopy.length | 0, seed: r() * 1000, cx, cy, cr, shake: 0 }; L.trees.push(tr); tr.solid = addSolid(cx, cy, cr, 'tree', { tree: tr }); }
      else addSolid(cx, cy, cr, kind, { R });
      placed++;
    }
  };
  scatter(def.trees, def.bigTrees ? 56 : 52, def.bigTrees ? 100 : 90, 'tree', 68);
  scatter(def.rocks || 0, 28, 50, 'rock', 70);
  scatter(def.hay || 0, 46, 60, 'hay', 72);

  // ---- reachability (flood fill from the start) -----------------------------
  const blocked = new Uint8Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
    let b = false;
    for (let dy = -1; dy <= 1 && !b; dy++) for (let dx = -1; dx <= 1; dx++) { if (!inW(cx + dx, cy + dy) || G[(cy + dy) * cols + cx + dx] >= 2) { b = true; break; } }
    if (b) blocked[cy * cols + cx] = 1;
  }
  for (const s of L.solids) {
    const rad = s.r + HERO_R + 3;
    for (let cy = (s.y - rad) / CS | 0; cy <= (s.y + rad) / CS; cy++) for (let cx = (s.x - rad) / CS | 0; cx <= (s.x + rad) / CS; cx++)
      if (inW(cx, cy) && dist((cx + 0.5) * CS, (cy + 0.5) * CS, s.x, s.y) < rad) blocked[cy * cols + cx] = 1;
  }
  const reach = L.reach = new Uint8Array(cols * rows), q = [ci(L.spawn.x, L.spawn.y)];
  if (blocked[q[0]]) return null;
  reach[q[0]] = 1;
  while (q.length) {
    const i = q.pop(), cx = i % cols, cy = i / cols | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy; if (!inW(nx, ny)) continue;
      const j = ny * cols + nx; if (!reach[j] && !blocked[j]) { reach[j] = 1; q.push(j); }
    }
  }
  if (!reach[ci(L.nest.x, L.nest.y)]) return null;
  for (const s of L.stars) if (s.check && !reach[ci(s.x, s.y)]) return null;
  if (L.cave && !reach[ci(L.cave.egg.x, L.cave.egg.y + 80)]) return null;
  const reachCells = (x, y, r0, r1, bits) => {
    const out = [];
    for (let cy = (y - r1) / CS | 0; cy <= (y + r1) / CS; cy++) for (let cx = (x - r1) / CS | 0; cx <= (x + r1) / CS; cx++) {
      if (!inW(cx, cy)) continue; const i = cy * cols + cx, d = dist((cx + 0.5) * CS, (cy + 0.5) * CS, x, y);
      if (reach[i] && d >= r0 && d <= r1 && !(F[i] & bits)) out.push({ x: (cx + 0.5) * CS, y: (cy + 0.5) * CS });
    }
    return out;
  };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = r() * (i + 1) | 0; const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  // ---- beetles ---------------------------------------------------------------
  const addBeetle = (x, y) => L.beetles.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, state: 'sleep', t: 0, face: r() < 0.5 ? 1 : -1, seed: r() * 10, r: 28 });
  for (const gs of guardSpots) for (let j = 0; j < gs.n; j++) {
    const a = r() * TAU + j * TAU / Math.max(1, gs.n), x = gs.x + Math.cos(a) * gs.rad, y = gs.y + Math.sin(a) * gs.rad;
    if (reach[ci(x, y)]) addBeetle(x, y);
  }
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k);
    for (let m = 0, t = 0; m < dv(def.beetles, k) && t < 400; t++) {
      const x = lerp(x0 + 60, x1 - 60, r()), y = lerp(top + 80, WH - 80, r()), i = ci(x, y);
      if (!reach[i] || (F[i] & 22) || G[i] !== 0) continue;
      if (dist(x, y, L.spawn.x, L.spawn.y) < 380 || dist(x, y, L.nest.x, L.nest.y) < 280 || !pathFar(x, y, 105)) continue;
      if (L.beetles.some(b => dist(b.x, b.y, x, y) < 230)) continue;
      addBeetle(x, y); m++;
    }
  }

  // ---- sparkling trees (hide eggs) and the treetop star ----------------------
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k);
    const cand = shuffle(L.trees.filter(t => t.x >= x0 && t.x < x1 && !t.spark && pathDist(t.x, t.y) < 560));
    let n = dv(def.sparkle, k);
    for (const t of cand) {
      if (n <= 0) break;
      const cells = shuffle(reachCells(t.cx, t.cy, t.cr + 55, t.cr + 190, 6));
      if (cells.length < 4) continue;
      const cnt = 2 + (r() < 0.5 ? 1 : 0);
      t.spark = { wave: k, n: cnt, targets: cells.slice(0, cnt), done: false }; t.dyn = true; n--;
    }
  }
  for (const s of L.stars) if (s.kind === 'treetop') {
    const [x0, x1] = region(s.region);
    const cand = shuffle(L.trees.filter(t => t.x >= x0 && t.x < x1 && !t.spark && !t.starTree));
    let ok = false;
    for (const t of cand) {
      const cells = shuffle(reachCells(t.cx, t.cy, t.cr + 55, t.cr + 170, 6));
      if (!cells.length) continue;
      t.starTree = s; t.dyn = true; s.tree = t; s.x = cells[0].x; s.y = cells[0].y; ok = true; break;
    }
    if (!ok) { const cells = shuffle(reachCells((x0 + x1) / 2, (top + WH) / 2, 0, 700, 6)).filter(c2 => pathFar(c2.x, c2.y, 300)); if (!cells.length) return null; s.kind = 'guarded'; s.hidden = false; s.x = cells[0].x; s.y = cells[0].y; }
  }
  L.dynTrees = L.trees.filter(t => t.dyn);

  // ---- golden eggs, in waves from left to right ------------------------------
  const total = Math.max(NW, Math.round(CONFIG.levelDuration / 60 * CONFIG.eggsPerMinute)), quota = Math.round(total / NW);
  L.totalEggs = 0;
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k), pts = [];
    const sparkN = L.trees.reduce((a, t) => a + (t.spark && t.spark.wave === k ? t.spark.n : 0), 0);
    const ground = Math.max(2, quota - sparkN), trailN = Math.round(ground * 0.4);
    const far = (x, y, d) => pts.every(p => dist(p.x, p.y, x, y) >= d);
    const seg = L.path.filter(p => p[0] > x0 + 50 && p[0] < x1 - 50 && dist(p[0], p[1], L.spawn.x, L.spawn.y) > 240 && dist(p[0], p[1], L.nest.x, L.nest.y) > 180);
    for (let j = 0; j < trailN && seg.length; j++) {
      const p = seg[Math.floor((j + 0.5) / trailN * seg.length)], i = ci(p[0], p[1]);
      if (reach[i] && !(F[i] & 2) && far(p[0], p[1], 90)) pts.push({ x: p[0], y: p[1] });
    }
    for (let t = 0; t < 6000 && pts.length < ground; t++) {
      const x = lerp(x0 + 50, x1 - 50, r()), y = lerp(top + 50, WH - 50, r()), i = ci(x, y);
      if (!reach[i] || (F[i] & 6) || !far(x, y, 125) || dist(x, y, L.spawn.x, L.spawn.y) < 210) continue;
      pts.push({ x: ((x / CS | 0) + 0.5) * CS + (r() - 0.5) * 14, y: ((y / CS | 0) + 0.5) * CS + (r() - 0.5) * 14 });
    }
    if (pts.length < Math.min(4, ground)) return null;
    L.waves.push(pts); L.totalEggs += pts.length + sparkN;
  }

  // ---- lanterns along the path (sunset level) --------------------------------
  if (def.lanterns) {
    for (let i = 8, side = 1; i < L.path.length - 8; i += 10, side = -side) {
      const p = L.path[i], p2 = L.path[i + 1], dx = p2[0] - p[0], dy = p2[1] - p[1], d = Math.hypot(dx, dy) || 1;
      const x = p[0] - dy / d * 82 * side, y = p[1] + dx / d * 82 * side;
      if (G[ci(x, y)] === 0 && dist(x, y, L.nest.x, L.nest.y) > 200) L.lanterns.push({ x, y, lit: 0 });
    }
  }
  for (let i = 0; i < G.length; i++) if (G[i] === 2) L.waterCells.push(i);
  L.reachCells = reachCells; L.ci = ci; L.pathDist = pathDist;
  return L;
}

/* ---------------- painting ---------------- */
function paintTree(c, t, P, ox, oy) {
  const x = t.x - (ox || 0), y = t.y - (oy || 0), R = t.R, col = P.canopy[t.ci], r = rng(t.seed * 13 + 1);
  wash(c, x, y + R * 0.8, R * 0.17, R * 0.42, P.trunk, { a: 1, seed: t.seed, wob: 0.14, layers: 2 });
  wash(c, x - R * 0.05, y + R * 0.8, R * 0.08, R * 0.36, shade(P.trunk, -0.3), { a: 0.35, seed: t.seed + 9, edge: 0 });
  wash(c, x, y, R, R * 0.92, col, { a: 1.2, seed: t.seed + 1, wob: 0.16, n: 14, edgeA: 0.28 });
  wash(c, x - R * 0.26, y + R * 0.3, R * 0.68, R * 0.52, shade(col, -0.32), { a: 0.38, seed: t.seed + 2, wob: 0.22, edge: 0 });
  wash(c, x + R * 0.26, y - R * 0.28, R * 0.56, R * 0.46, shade(col, 0.35), { a: 0.5, seed: t.seed + 3, wob: 0.2, edge: 0 });
  wash(c, x + R * 0.38, y - R * 0.42, R * 0.26, R * 0.2, '#FFF1C4', { a: 0.4, seed: t.seed + 4, edge: 0 });
  for (let k = 0; k < 12; k++) {
    const a = r() * TAU, d = R * (0.45 + r() * 0.52);
    wash(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.92, R * (0.1 + r() * 0.08), R * (0.07 + r() * 0.06), shade(col, (r() - 0.55) * 0.6), { a: 0.5, seed: k + t.seed, layers: 1, edge: 0 });
  }
}
function paintRock(c, x, y, R, col, seed) {
  wash(c, x, y, R * 1.1, R * 0.95, col, { a: 1.2, seed, wob: 0.16, n: 9, edgeA: 0.3 });
  wash(c, x - R * 0.28, y + R * 0.25, R * 0.7, R * 0.55, shade(col, -0.35), { a: 0.38, seed: seed + 1, wob: 0.2, edge: 0 });
  wash(c, x + R * 0.25, y - R * 0.3, R * 0.55, R * 0.4, '#FFF1D8', { a: 0.5, seed: seed + 2, wob: 0.2, edge: 0 });
  c.strokeStyle = rgba(shade(col, -0.45), 0.3); c.lineWidth = 2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x - R * 0.3, y - R * 0.1); c.quadraticCurveTo(x, y + R * 0.1, x + R * 0.1, y + R * 0.5); c.stroke();
}
function paintHay(c, x, y, R, seed) {
  const r = rng(seed * 7 + 3);
  wash(c, x, y - R * 0.15, R * 1.05, R * 1.05, '#E9C56C', { a: 1.2, seed, wob: 0.1, n: 12, edgeA: 0.3 });
  wash(c, x - R * 0.25, y + R * 0.3, R * 0.75, R * 0.55, '#C99A50', { a: 0.4, seed: seed + 1, edge: 0 });
  wash(c, x + R * 0.25, y - R * 0.5, R * 0.55, R * 0.4, '#FFF0B8', { a: 0.5, seed: seed + 2, edge: 0 });
  c.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const a = r() * TAU, d = r() * R * 0.85, px = x + Math.cos(a) * d, py = y - R * 0.15 + Math.sin(a) * d;
    c.strokeStyle = rgba(i % 2 ? '#B98848' : '#FFF3C4', 0.5); c.lineWidth = 2;
    c.beginPath(); c.moveTo(px, py); c.lineTo(px + (r() - 0.5) * 10, py + 12 + r() * 12); c.stroke();
  }
}
function paintMillTower(c, x, y) {       // x,y = base center. Tower rises 250 px.
  wash(c, x, y + 6, 62, 30, '#B99A7A', { a: 0.9, seed: 3, edge: 0 });
  const body = (inset, col, a) => { c.beginPath(); c.moveTo(x - 54 + inset, y + 14); c.quadraticCurveTo(x - 44 + inset, y - 90, x - 34 + inset, y - 192); c.lineTo(x + 34 - inset, y - 192); c.quadraticCurveTo(x + 44 - inset, y - 90, x + 54 - inset, y + 14); c.quadraticCurveTo(x, y + 30, x - 54 + inset, y + 14); c.closePath(); c.fillStyle = rgba(col, a); c.fill(); };
  body(0, '#F3E4C6', 1); body(5, '#FBF1DA', 0.6);
  c.save(); c.beginPath(); c.rect(x - 60, y - 200, 46, 240); c.clip(); body(0, '#B08A9A', 0.32); c.restore();
  c.strokeStyle = 'rgba(150,110,100,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 54, y + 14); c.quadraticCurveTo(x - 44, y - 90, x - 34, y - 192); c.moveTo(x + 54, y + 14); c.quadraticCurveTo(x + 44, y - 90, x + 34, y - 192); c.stroke();
  c.fillStyle = '#C96F4E'; c.beginPath(); c.moveTo(x - 46, y - 186); c.quadraticCurveTo(x - 20, y - 240, x, y - 256); c.quadraticCurveTo(x + 20, y - 240, x + 46, y - 186); c.quadraticCurveTo(x, y - 174, x - 46, y - 186); c.closePath(); c.fill();
  wash(c, x + 12, y - 222, 16, 20, '#E9A07A', { a: 0.5, seed: 4, edge: 0 });
  c.fillStyle = '#9A5F4A'; c.beginPath(); c.moveTo(x - 15, y + 20); c.lineTo(x - 15, y - 16); c.quadraticCurveTo(x, y - 36, x + 15, y - 16); c.lineTo(x + 15, y + 20); c.closePath(); c.fill();
  wash(c, x, y - 110, 11, 14, '#8E7AA0', { a: 0.8, seed: 5 });
}
function drawMillBlades(c, x, y, ang) {
  c.save(); c.translate(x, y); c.rotate(ang);
  for (let i = 0; i < 4; i++) {
    c.rotate(TAU / 4);
    c.strokeStyle = '#9A6B4C'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -158); c.stroke();
    c.fillStyle = 'rgba(255,246,226,0.93)'; c.beginPath(); c.moveTo(6, -40); c.lineTo(40, -48); c.lineTo(36, -150); c.lineTo(6, -154); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(201,111,78,0.75)'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(201,111,78,0.4)'; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(6, -40 - k * 28); c.lineTo(38, -48 - k * 26); c.stroke(); }
  }
  c.restore();
  puff(c, x, y, 11, 11, '#C96F4E', 6);
}
function paintLantern(c, x, y) {
  c.strokeStyle = '#8A5A48'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 84); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.moveTo(x, y - 84); c.quadraticCurveTo(x + 4, y - 100, x + 20, y - 98); c.stroke();
  wash(c, x + 20, y - 76, 14, 18, '#E9A07A', { a: 1, seed: 8, wob: 0.06 });
  wash(c, x + 20, y - 76, 8, 11, '#FFE9B0', { a: 0.8, seed: 9, edge: 0 });
}
function cellBlobs(c, L, type, rad, col, alpha, seed, jit) {
  c.fillStyle = rgba(col, alpha); jit = jit == null ? 14 : jit;
  for (let cy = 0; cy < L.rows; cy++) for (let cx = 0; cx < L.cols; cx++) {
    const i = cy * L.cols + cx; if (L.grid[i] !== type) continue;
    for (let k = 0; k < 2; k++) {       // two overlapping dabs per cell hide the grid
      c.beginPath(); c.arc((cx + 0.5) * CS + (hash(seed + k * 7, i) - 0.5) * jit * 2, (cy + 0.5) * CS + (hash(seed + 1 + k * 7, i) - 0.5) * jit * 2, rad * (0.8 + hash(seed + 2 + k * 7, i) * 0.4), 0, TAU); c.fill();
    }
  }
}

function paintLevel(L) {
  const cv = makeCanvas(L.W, L.H), c = cv.getContext('2d'), P = L.pal, r = rng(L.seed + 999), G = L.grid, top = L.top, sl = 1 + L.skyT * 0.7;
  const typeAt = (x, y) => G[L.ci(x, y)];
  // ground: gradient, then many wet washes
  let g = c.createLinearGradient(0, top, 0, L.H); g.addColorStop(0, P.g0); g.addColorStop(1, P.g1);
  c.fillStyle = g; c.fillRect(0, 0, L.W, L.H);
  for (let i = 0; i < 110; i++) wash(c, r() * L.W, top - 40 + r() * (L.H - top + 40), 130 + r() * 280, 80 + r() * 190, P.tints[i % P.tints.length], { a: 0.1 + r() * 0.12, seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  if (L.def.key === 'hill') {            // terraced contour lines
    c.lineCap = 'round';
    for (let k = 0; k < 9; k++) { const pts = []; for (let x = -50; x <= L.W + 50; x += 80) pts.push([x, top + 120 + k * 165 + Math.sin(x / 420 + k * 1.7) * 70 + Math.sin(x / 150 + k) * 16]); brushLine(c, pts, 10, k % 2 ? '#B9A868' : '#F1DFA8', 0.28, k + 3); }
  }
  // dry-brush grass strokes
  c.lineCap = 'round';
  for (let i = 0; i < 4200; i++) {
    const x = r() * L.W, y = top + r() * (L.H - top); if (typeAt(x, y) !== 0) continue;
    c.strokeStyle = rgba(i % 3 ? shade(P.g1, -0.22) : shade(P.g0, 0.3), 0.14 + r() * 0.12); c.lineWidth = 1.2 + r() * 1.6;
    const l = 8 + r() * 16, a = -Math.PI / 2 + (r() - 0.5) * 0.9;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
  }
  // the path
  const pp = L.path.filter((p, i) => i % 2 === 0);
  brushLine(c, pp, 120, shade(P.path, -0.18), 0.3, 11); brushLine(c, pp, 96, P.path, 0.75, 12); brushLine(c, pp, 56, shade(P.path, 0.4), 0.4, 13);
  for (const p of L.path) for (let k = 0; k < 2; k++) { const x = p[0] + (r() - 0.5) * 90, y = p[1] + (r() - 0.5) * 80; wash(c, x, y, 3 + r() * 5, 2.5 + r() * 3, r() < 0.5 ? shade(P.path, -0.3) : '#FFF6E0', { a: 0.4, seed: x, layers: 1, edge: 0 }); }
  // pinecone lanes: a worn track
  for (const l of L.lanes) { const pts = []; for (let y = l.y0 - 60; y <= l.y1 + 40; y += 60) pts.push([l.x + Math.sin(y / 130) * 8, y]); brushLine(c, pts, 78, '#A8875E', 0.28, l.x); brushLine(c, pts, 40, '#C9A878', 0.25, l.x + 1); }
  // mud
  if (G.includes(1)) {
    cellBlobs(c, L, 1, 33, '#7E5A4C', 0.28, 21, 16); cellBlobs(c, L, 1, 27, '#A07A5C', 0.9, 22, 12); cellBlobs(c, L, 1, 20, '#B08A68', 0.5, 23, 16);
    for (let i = 0; i < G.length; i++) if (G[i] === 1) {
      const x = (i % L.cols + 0.5) * CS, y = ((i / L.cols | 0) + 0.5) * CS;
      if (hash(34, i) < 0.35) wash(c, x + (hash(35, i) - 0.5) * 30, y + (hash(36, i) - 0.5) * 30, 34 + hash(37, i) * 30, 18 + hash(38, i) * 16, hash(39, i) < 0.5 ? '#8A6452' : '#B8926E', { a: 0.3, seed: i, wob: 0.25, layers: 2, edge: 2, edgeA: 0.1 });
      if (hash(31, i) < 0.22) wash(c, x + 6, y - 6, 15, 6, '#DCC0A0', { a: 0.4, seed: i, layers: 1, edge: 0 });
      if (hash(32, i) < 0.16) { c.strokeStyle = 'rgba(110,70,62,0.35)'; c.lineWidth = 2; c.beginPath(); c.arc(x - 8, y + 6, 4 + hash(33, i) * 4, 0, TAU); c.stroke(); }
    }
  }
  // water
  if (L.waterCells.length) {
    cellBlobs(c, L, 2, 35, mix(P.g1, '#7A6A52', 0.4), 0.3, 41, 12); cellBlobs(c, L, 2, 29, '#82B5AE', 1, 42, 9); cellBlobs(c, L, 2, 21, '#9CCBC0', 0.45, 43, 14);
    for (const i of L.waterCells) {
      const x = (i % L.cols + 0.5) * CS, y = ((i / L.cols | 0) + 0.5) * CS;
      if (hash(51, i) < 0.22) wash(c, x, y, 46, 22, '#CDE8DA', { a: 0.26, seed: i, layers: 2, edge: 0 });
      if (hash(52, i) < 0.3) { c.strokeStyle = 'rgba(244,251,240,0.5)'; c.lineWidth = 2.2; c.beginPath(); c.arc(x, y + 10, 14 + hash(53, i) * 10, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    }
  }
  for (const b of L.bridges) {
    wash(c, b.x - 10, b.y + 14, b.w / 2 + 6, b.h / 2 + 4, SHADOW, { a: 0.3, seed: 3, edge: 0 });
    for (let x = b.x - b.w / 2 + 14, k = 0; x < b.x + b.w / 2; x += 27, k++) wash(c, x, b.y + (hash(k, 4) - 0.5) * 6, 13, b.h / 2 - 4, k % 2 ? '#C99A6A' : '#B98858', { a: 1.1, seed: k + 5, wob: 0.05, n: 8, edgeA: 0.3 });
    for (const sy of [-1, 1]) brushLine(c, [[b.x - b.w / 2 - 6, b.y + sy * (b.h / 2 - 4)], [b.x, b.y + sy * (b.h / 2 + 2)], [b.x + b.w / 2 + 6, b.y + sy * (b.h / 2 - 4)]], 10, '#8E6244', 0.9, 7 + sy);
  }
  for (const s of L.stones) for (let k = 0; k < 6; k++) {
    const x = s.x - s.w / 2 + 34 + k * (s.w - 68) / 5, y = s.y + (k % 2 ? -18 : 18);
    wash(c, x - 5, y + 8, 40, 30, SHADOW, { a: 0.25, seed: k, edge: 0 });
    wash(c, x, y, 38, 30, P.rock, { a: 1.2, seed: k + 60, wob: 0.14, n: 9, edgeA: 0.3 });
    wash(c, x + 8, y - 8, 20, 12, '#FFF1D8', { a: 0.45, seed: k + 70, edge: 0 });
  }
  if (L.def.river) for (let i = 0; i < 160; i++) {   // reeds on the banks
    const wc = L.waterCells[r() * L.waterCells.length | 0], x = (wc % L.cols + 0.5) * CS + (r() - 0.5) * 130, y = ((wc / L.cols | 0) + 0.5) * CS + (r() - 0.5) * 60;
    if (y < top + 30 || typeAt(x, y) === 2 || typeAt(x, y) === 3) continue;
    c.strokeStyle = rgba(r() < 0.5 ? '#7E9A5E' : '#A9B878', 0.8); c.lineWidth = 2.5;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x + k * 5, y); c.quadraticCurveTo(x + k * 5 + (r() - 0.5) * 10, y - 20, x + k * 5 + (r() - 0.5) * 16, y - 32 - r() * 16); c.stroke(); }
  }
  // flowers and tufts
  for (let i = 0; i < 900; i++) {
    const x = r() * L.W, y = top + 20 + r() * (L.H - top - 30); if (typeAt(x, y) !== 0) continue;
    if (i % 3 === 0) {
      c.strokeStyle = rgba(shade(P.g1, -0.3), 0.5); c.lineWidth = 2;
      for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + k * 4, y - 9, x + k * 9, y - 14 - r() * 6); c.stroke(); }
    } else {
      const col = P.flowers[i % P.flowers.length], s = 4 + r() * 5;
      for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); }
      wash(c, x, y, s * 0.42, s * 0.42, '#F3D36B', { a: 1, seed: i, layers: 1, edge: 0 });
    }
  }
  if (L.def.key === 'forest') for (let i = 0; i < 70; i++) {   // mushrooms
    const x = r() * L.W, y = top + 30 + r() * (L.H - top - 50); if (typeAt(x, y) !== 0) continue;
    wash(c, x, y, 5, 9, '#FBF3DE', { a: 1, seed: i, layers: 1 }); wash(c, x, y - 9, 13, 8, i % 2 ? '#D9735C' : '#E9A07A', { a: 1.1, seed: i + 2, layers: 2 });
    wash(c, x - 4, y - 10, 2.5, 2, '#FFF6E0', { a: 0.9, seed: i, layers: 1, edge: 0 }); wash(c, x + 5, y - 8, 2, 1.8, '#FFF6E0', { a: 0.9, seed: i, layers: 1, edge: 0 });
  }
  // long warm shadows, then everything solid
  for (const s of L.solids) wash(c, s.x - s.r * 0.5 * sl, s.y + s.r * 0.42, s.r * 1.08 * sl, s.r * 0.62, SHADOW, { a: 0.3, seed: s.seed, wob: 0.18, edge: 0 });
  drawNest(c, L.nest.x, L.nest.y, 120, 17, 0);
  for (const s of L.solids) { if (s.kind === 'rock') paintRock(c, s.x, s.y, s.r, P.rock, s.seed); else if (s.kind === 'hay') paintHay(c, s.x, s.y, s.r, s.seed); }
  for (const l of L.lanterns) { wash(c, l.x - 16, l.y + 4, 22, 8, SHADOW, { a: 0.3, seed: 2, edge: 0 }); paintLantern(c, l.x, l.y); }
  const trees = L.trees.slice().sort((a, b) => a.y - b.y);
  for (const t of trees) if (!t.dyn) paintTree(c, t, P);
  // sprites that are drawn every frame, sorted with the heroes
  for (const t of L.dynTrees) {
    const w = Math.ceil(t.R * 2.8), h = Math.ceil(t.R * 2.7), sc = makeCanvas(w, h);
    paintTree(sc.getContext('2d'), t, P, t.x - w / 2, t.y - t.R * 1.35);
    t.sprite = sc; L.sprites.push({ kind: 'tree', ref: t, y: t.y + t.R * 1.1 });
  }
  for (const m of L.mills) {
    const sc = makeCanvas(160, 320); paintMillTower(sc.getContext('2d'), 80, 280);
    m.sprite = sc; L.sprites.push({ kind: 'mill', ref: m, y: m.y + 10 });
  }
  // top band: sky and far hills, or the cliff with the waterfall
  paintSky(c, 0, 0, L.W, L.skyH + 40, L.skyT, L.seed, { sunR: L.def.cliff ? 46 : 62, clouds: 9 });
  paintHills(c, 0, L.skyH + 20, L.W, L.def.cliff ? 110 : 170, L.skyT, L.seed + 5);
  if (L.def.cliff) {
    const y0 = L.skyH, y1 = top;
    g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#CDAF98'); g.addColorStop(1, '#93747E');
    c.fillStyle = g; c.fillRect(0, y0, L.W, y1 - y0 + 6);
    for (let i = 0; i < 260; i++) { const x = r() * L.W, y = y0 + r() * (y1 - y0); wash(c, x, y, 40 + r() * 90, 20 + r() * 50, ['#B8948A', '#D9BFA6', '#8E6E7C', '#C4A090'][i % 4], { a: 0.22, seed: i, wob: 0.3, edge: 2, edgeA: 0.08 }); }
    c.lineCap = 'round';
    for (let i = 0; i < 420; i++) { const x = r() * L.W, y = y0 + r() * (y1 - y0 - 40); c.strokeStyle = rgba(i % 2 ? '#7A5A6C' : '#E9D2B8', 0.22); c.lineWidth = 2 + r() * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 14, y + 30 + r() * 60); c.stroke(); }
    for (let x = 0; x < L.W; x += 46) { wash(c, x + r() * 30, y0 + 4 + r() * 10, 50 + r() * 30, 24 + r() * 14, P.canopy[r() * P.canopy.length | 0], { a: 0.95, seed: x, wob: 0.2, edgeA: 0.2 }); }
    for (let x = 0; x < L.W; x += 60) wash(c, x + r() * 40, y1 + 6, 46 + r() * 30, 16, '#7A5A6C', { a: 0.3, seed: x + 3, edge: 0 });
    // remember the plain cliff over the cave, then paint the cave itself
    const cvr = L.cover, cc = makeCanvas(cvr.w, cvr.h); cc.getContext('2d').drawImage(cv, cvr.x, cvr.y, cvr.w, cvr.h, 0, 0, cvr.w, cvr.h); L.coverCv = cc;
    const cvx = L.cave;
    c.save(); c.beginPath(); c.rect(cvr.x, cvr.y, cvr.w, cvr.h); c.clip();
    const room = (grow, col, al) => {       // rounded cave room plus the short tunnel to the waterfall
      wash(c, 1600, 342, 178 + grow, 112 + grow, col, { a: al, seed: 4, wob: 0.07, n: 16, edge: 0 });
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) wash(c, 1600 + sx * 112, 342 + sy * 58, 62 + grow, 56 + grow, col, { a: al, seed: 5 + sx + sy * 2, wob: 0.1, edge: 0 });
      wash(c, 1620, 478, 66 + grow, 70 + grow * 0.5, col, { a: al, seed: 9, wob: 0.06, edge: 0 });
    };
    room(22, '#4E3A54', 1.3); room(6, '#6E5668', 1.3); room(-20, '#806878', 0.6);
    wash(c, 1600, 345, 130, 80, '#C99A6A', { a: 0.4, seed: 6, edge: 0 }); wash(c, 1600, 340, 70, 44, '#FFE0A0', { a: 0.4, seed: 7, edge: 0 });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, x = 1600 + Math.cos(a) * 186, y = 342 + Math.sin(a) * 112; if (Math.abs(x - 1620) < 90 && y > 400) continue; const cl = ['#E9B8C4', '#BFE0D4', '#F3D9A0', '#C8B8E0'][i % 4]; c.fillStyle = rgba(cl, 0.9); c.beginPath(); c.moveTo(x - 9, y + 8); c.lineTo(x, y - 20 - hash(i, 2) * 14); c.lineTo(x + 9, y + 8); c.closePath(); c.fill(); }
    c.restore();
    for (let x = 1480; x < 1760; x += 40) wash(c, x + r() * 20, top + 46, 30, 20, '#A99A94', { a: 0.5, seed: x, edge: 2 });   // wet stones behind the fall
  } else {
    for (let x = -20; x < L.W + 40; x += 42) {
      const y = top - 34 + r() * 26, col = P.canopy[r() * P.canopy.length | 0];
      wash(c, x, y, 46 + r() * 34, 30 + r() * 22, col, { a: 1.1, seed: x + 1, wob: 0.22, edgeA: 0.2 });
      wash(c, x + 10, y - 10, 22, 14, shade(col, 0.4), { a: 0.4, seed: x + 2, edge: 0 });
      wash(c, x - 8, y + 14, 30, 14, shade(col, -0.35), { a: 0.3, seed: x + 3, edge: 0 });
    }
  }
  // leafy frame along the other edges
  for (let i = 0; i < 150; i++) {
    const e = i % 3, col = P.canopy[i % P.canopy.length];
    const x = e === 0 ? r() * L.W : e === 1 ? -10 + r() * 26 : L.W + 10 - r() * 26, y = e === 0 ? L.H + 6 - r() * 22 : top + r() * (L.H - top);
    wash(c, x, y, 50 + r() * 40, 36 + r() * 26, shade(col, -0.1), { a: 0.95, seed: i + 5, wob: 0.22, edgeA: 0.2 });
    wash(c, x + 8, y - 10, 22, 14, shade(col, 0.35), { a: 0.35, seed: i + 6, edge: 0 });
  }
  finishPaint(c, L.W, L.H, L.skyT, r);
  L.bg = cv;
  L.overlay = makeOverlay(mix('#FFF4E0', '#FFC08C', L.skyT), 0.1 + L.skyT * 0.16, 0.42);
  return L;
}
/* Granulation speckles, watercolor blooms and the warm afternoon light. */
function finishPaint(c, w, h, skyT, r) {
  for (let i = 0; i < 7000; i++) { c.fillStyle = i % 2 ? 'rgba(110,70,90,0.07)' : 'rgba(255,250,235,0.1)'; c.beginPath(); c.arc(r() * w, r() * h, 0.6 + r() * 1.6, 0, TAU); c.fill(); }
  for (let i = 0; i < 260; i++) { blobPath(c, r() * w, r() * h, 14 + r() * 50, 10 + r() * 36, i, 0.3, 11); c.strokeStyle = 'rgba(255,250,232,0.09)'; c.lineWidth = 2 + r() * 3; c.stroke(); }
  c.save(); c.globalCompositeOperation = 'soft-light';
  const g = c.createRadialGradient(w * 0.74, 0, 100, w * 0.6, h * 0.3, Math.max(w, h) * 0.95);
  g.addColorStop(0, 'rgba(255,232,170,0.75)'); g.addColorStop(0.5, 'rgba(255,214,160,0.25)'); g.addColorStop(1, 'rgba(120,80,140,' + (0.3 + skyT * 0.25) + ')');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.restore();
}

/* The boss arena: one screen, the tallest tree in the valley. */
function genBoss() {
  const WW = 1920, WH = 1080, cols = WW / CS, rows = WH / CS;
  const L = { idx: levelCount(), def: BOSS_DEF, boss: true, seed: 4242, W: WW, H: WH, cols, rows, top: 480, skyH: 420, pal: PALS.sunset, skyT: 1.05,
    grid: new Uint8Array(cols * rows), flag: new Uint8Array(cols * rows), solids: [], trees: [], dynTrees: [], beetles: [], lanes: [], cones: [], bridges: [], stones: [],
    mills: [], lanterns: [], stars: [], waves: [[]], waterCells: [], sprites: [], spawn: { x: 760, y: 820 }, nest: { x: 960, y: 300 }, NW: 1, minZoom: 1, totalEggs: 0 };
  for (let cy = 0; cy < 12; cy++) for (let cx = 0; cx < cols; cx++) L.grid[cy * cols + cx] = 4;   // heroes stay below the tree, the ball flies over
  L.ci = (x, y) => clamp(y / CS | 0, 0, rows - 1) * cols + clamp(x / CS | 0, 0, cols - 1);
  L.reach = new Uint8Array(cols * rows);
  for (let cy = 13; cy < rows - 1; cy++) for (let cx = 1; cx < cols - 1; cx++) L.reach[cy * cols + cx] = 1;
  L.treeBase = { x: 960, y: 560 };
  L.solids.push({ x: 960, y: 548, r: 70, kind: 'trunk', noBall: true, seed: 1 });
  const cv = makeCanvas(WW, WH), c = cv.getContext('2d'), P = L.pal, r = rng(77);
  paintSky(c, 0, 0, WW, 520, L.skyT, 9, { sunX: 0.2, sunR: 70, clouds: 7 });
  paintHills(c, 0, 470, WW, 190, L.skyT, 12);
  let g = c.createLinearGradient(0, 440, 0, WH); g.addColorStop(0, P.g0); g.addColorStop(1, P.g1);
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 470); for (let x = 0; x <= WW; x += 60) c.lineTo(x, 462 + Math.sin(x / 300) * 14); c.lineTo(WW, WH); c.lineTo(0, WH); c.closePath(); c.fill();
  for (let i = 0; i < 60; i++) wash(c, r() * WW, 480 + r() * 600, 120 + r() * 240, 60 + r() * 150, P.tints[i % P.tints.length], { a: 0.12 + r() * 0.1, seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  c.lineCap = 'round';
  for (let i = 0; i < 1800; i++) { const x = r() * WW, y = 480 + r() * 600; c.strokeStyle = rgba(i % 3 ? shade(P.g1, -0.22) : shade(P.g0, 0.3), 0.14 + r() * 0.12); c.lineWidth = 1.2 + r() * 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 8, y - 8 - r() * 16); c.stroke(); }
  wash(c, 960, 800, 620, 190, P.path, { a: 0.5, seed: 3, wob: 0.12, n: 16, edge: 0 }); wash(c, 960, 800, 480, 130, shade(P.path, 0.4), { a: 0.3, seed: 4, wob: 0.14, n: 16, edge: 0 });
  for (let i = 0; i < 320; i++) { const x = r() * WW, y = 500 + r() * 570; if (Math.abs(x - 960) < 500 && Math.abs(y - 800) < 150) continue; const col = P.flowers[i % P.flowers.length], s = 4 + r() * 5; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); } }
  wash(c, 880, 600, 330, 70, SHADOW, { a: 0.3, seed: 6, wob: 0.14, edge: 0 });
  for (const x of [150, 420, 1500, 1770]) { wash(c, x - 16, 574, 22, 8, SHADOW, { a: 0.3, seed: 2, edge: 0 }); paintLantern(c, x, 570); }
  for (let i = 0; i < 60; i++) { const e = i % 3, col = P.canopy[i % P.canopy.length]; const x = e === 0 ? r() * WW : e === 1 ? -10 + r() * 20 : WW + 10 - r() * 20, y = e === 0 ? WH + 6 - r() * 18 : 480 + r() * 600; wash(c, x, y, 50 + r() * 40, 36 + r() * 26, shade(col, -0.1), { a: 0.95, seed: i + 5, wob: 0.22, edgeA: 0.2 }); }
  finishPaint(c, WW, WH, 1, r);
  L.bg = cv;
  // the big tree is its own sprite so that it can shake
  const tw = 1240, th = 660, tc = makeCanvas(tw, th), t = tc.getContext('2d'), tr = rng(5);
  const bx = tw / 2, by = th - 40;
  t.fillStyle = '#8A5A48'; t.beginPath(); t.moveTo(bx - 120, by + 30); t.quadraticCurveTo(bx - 70, by - 40, bx - 62, by - 260); t.lineTo(bx + 62, by - 260); t.quadraticCurveTo(bx + 70, by - 40, bx + 120, by + 30); t.quadraticCurveTo(bx + 60, by + 6, bx, by + 22); t.quadraticCurveTo(bx - 60, by + 6, bx - 120, by + 30); t.closePath(); t.fill();
  wash(t, bx - 30, by - 120, 30, 130, '#6A4258', { a: 0.4, seed: 2, edge: 0 }); wash(t, bx + 28, by - 130, 18, 120, '#C99A78', { a: 0.4, seed: 3, edge: 0 });
  for (let i = 0; i < 14; i++) { t.strokeStyle = 'rgba(90,50,70,0.3)'; t.lineWidth = 3; t.beginPath(); const x = bx - 50 + tr() * 100, y = by - 240 + tr() * 220; t.moveTo(x, y); t.quadraticCurveTo(x + (tr() - 0.5) * 12, y + 30, x + (tr() - 0.5) * 8, y + 60); t.stroke(); }
  const blobs = [[0, -330, 330, 190], [-290, -280, 250, 170], [290, -280, 250, 170], [-150, -420, 240, 150], [160, -420, 240, 150], [0, -250, 380, 150], [-420, -210, 150, 110], [420, -210, 150, 110]];
  blobs.forEach((b, i) => { const col = P.canopy[i % P.canopy.length]; wash(t, bx + b[0], by + b[1], b[2], b[3], col, { a: 1.2, seed: i + 10, wob: 0.14, n: 16, edgeA: 0.25 }); wash(t, bx + b[0] + b[2] * 0.25, by + b[1] - b[3] * 0.3, b[2] * 0.5, b[3] * 0.4, shade(col, 0.35), { a: 0.4, seed: i + 30, wob: 0.2, edge: 0 }); wash(t, bx + b[0] - b[2] * 0.25, by + b[1] + b[3] * 0.35, b[2] * 0.6, b[3] * 0.4, shade(col, -0.35), { a: 0.32, seed: i + 50, wob: 0.2, edge: 0 }); });
  for (let k = 0; k < 150; k++) { const b = blobs[k % blobs.length], a = tr() * TAU, d = 0.3 + tr() * 0.7; wash(t, bx + b[0] + Math.cos(a) * b[2] * d, by + b[1] + Math.sin(a) * b[3] * d, 14 + tr() * 22, 10 + tr() * 14, shade(P.canopy[k % P.canopy.length], (tr() - 0.5) * 0.6), { a: 0.5, seed: k, layers: 1, edge: 0 }); }
  L.treeCv = tc; L.treeOff = { x: 960 - bx, y: 580 - by };
  L.overlay = makeOverlay('#FFBE8C', 0.2, 0.45);
  return L;
}
