
/* ==========================================================================
   CORE: math, colors, watercolor painting helpers, paper texture, text
   ========================================================================== */
const TAU = Math.PI * 2;
const W = 1920, H = 1080;            // logical screen size (scaled to the window)
const CS = 40;                       // world grid cell size
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const ease = t => t * t * (3 - 2 * t);
const easeOut = t => 1 - (1 - t) * (1 - t);

function rng(seed) {                 // small seeded random generator
  let a = seed >>> 0;
  return function () {
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const hash = (s, i) => { const x = Math.sin(s * 127.1 + i * 311.7) * 43758.5453; return x - Math.floor(x); };

const _hexCache = new Map();
function hex(h) {
  let c = _hexCache.get(h);
  if (!c) { const n = parseInt(h.slice(1), 16); c = [n >> 16 & 255, n >> 8 & 255, n & 255]; _hexCache.set(h, c); }
  return c;
}
function rgba(h, a) { const c = hex(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
function mix(h1, h2, t) {
  const a = hex(h1), b = hex(h2);
  return '#' + [0, 1, 2].map(i => Math.round(lerp(a[i], b[i], clamp(t, 0, 1))).toString(16).padStart(2, '0')).join('');
}
// darker = toward warm violet, lighter = toward cream. Never gray or black.
const shade = (h, t) => t < 0 ? mix(h, '#5A3550', -t) : mix(h, '#FFF6E0', t);
const SHADOW = '#6A4270';
const RAINBOW = ['#F0556A', '#F58A3C', '#F6CE46', '#6FC96A', '#46B8D8', '#5A78E0', '#A66AD8'];      // the seven colors of the rainbow crystals (second game)

/* A closed blob with slightly irregular, hand-painted edges. */
const _bx = new Float32Array(40), _by = new Float32Array(40);
function blobPath(c, x, y, rx, ry, seed, wob, n) {
  wob = wob == null ? 0.07 : wob; n = n || 10;
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, f = 1 + wob * (hash(seed, i) * 2 - 1);
    _bx[i] = x + Math.cos(a) * rx * f; _by[i] = y + Math.sin(a) * ry * f;
  }
  c.beginPath();
  c.moveTo((_bx[n - 1] + _bx[0]) / 2, (_by[n - 1] + _by[0]) / 2);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    c.quadraticCurveTo(_bx[i], _by[i], (_bx[i] + _bx[j]) / 2, (_by[i] + _by[j]) / 2);
  }
  c.closePath();
}

/* Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. */
function wash(c, x, y, rx, ry, col, o) {
  o = o || {};
  const a = o.a == null ? 0.55 : o.a, layers = o.layers || 3, seed = o.seed || 1;
  const wob = o.wob == null ? 0.1 : o.wob, n = o.n || 12;
  for (let k = 0; k < layers; k++) {
    const s = 1 - k * 0.07;
    blobPath(c, x + (hash(seed, k + 20) - 0.5) * rx * 0.08, y + (hash(seed, k + 30) - 0.5) * ry * 0.08, rx * s, ry * s, seed + k * 3.3, wob, n);
    c.fillStyle = rgba(col, Math.min(1, a / layers * 1.6));
    c.fill();
  }
  if (o.edge !== 0) {
    blobPath(c, x, y, rx, ry, seed, wob, n);
    c.strokeStyle = rgba(shade(col, -0.35), o.edgeA == null ? 0.2 : o.edgeA);
    c.lineWidth = o.edge || 3;
    c.stroke();
  }
}

/* Opaque painted shape for characters: solid fill with a soft colored rim. */
function puff(c, x, y, rx, ry, fill, seed, edge, wob) {
  blobPath(c, x, y, rx, ry, seed || 1, wob == null ? 0.045 : wob, 10);
  c.fillStyle = fill; c.fill();
  if (edge !== 0) { c.strokeStyle = edge || 'rgba(120,70,80,0.28)'; c.lineWidth = 2.2; c.stroke(); }
}
function soft(c, x, y, rx, ry, col, alpha, seed) {
  blobPath(c, x, y, rx, ry, seed || 1, 0.06, 9);
  c.fillStyle = rgba(col, alpha == null ? 1 : alpha); c.fill();
}

/* A wobbly brush line through points. */
function brushLine(c, pts, width, col, alpha, seed) {
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (let k = 0; k < 3; k++) {
    c.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const jx = (hash(seed + k, i) - 0.5) * width * 0.18, jy = (hash(seed + k, i + 50) - 0.5) * width * 0.18;
      if (i === 0) c.moveTo(pts[i][0] + jx, pts[i][1] + jy); else c.lineTo(pts[i][0] + jx, pts[i][1] + jy);
    }
    c.strokeStyle = rgba(col, alpha / 3 * 1.5);
    c.lineWidth = width * (1 - k * 0.14);
    c.stroke();
  }
}

function makeCanvas(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }

/* Paper: noise-generated grain, soft blotches and a few fibers. Multiplied over the whole screen. */
let PAPER = null;
function makePaper() {
  const cv = makeCanvas(W, H), c = cv.getContext('2d');
  const img = c.createImageData(W, H), d = img.data, r = rng(77);
  const gw = 48, gh = 27, g = new Float32Array((gw + 2) * (gh + 2));
  const hw = 320, hh = 180, g2 = new Float32Array((hw + 2) * (hh + 2));
  for (let i = 0; i < g.length; i++) g[i] = r();
  for (let i = 0; i < g2.length; i++) g2[i] = r();
  const samp = (arr, w, u, v) => {
    const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0, i = y0 * (w + 2) + x0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    return lerp(lerp(arr[i], arr[i + 1], sx), lerp(arr[i + w + 2], arr[i + w + 3], sx), sy);
  };
  let p = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n1 = samp(g, gw, x / W * gw, y / H * gh), n2 = samp(g2, hw, x / W * hw, y / H * hh);
      let v = 0.905 + n1 * 0.05 + n2 * 0.05 + (r() - 0.5) * 0.06;
      if (v > 1) v = 1;
      d[p++] = 255 * v; d[p++] = 249 * v; d[p++] = 236 * v; d[p++] = 255;
    }
  }
  c.putImageData(img, 0, 0);
  c.lineCap = 'round';
  for (let i = 0; i < 900; i++) {           // paper fibers
    const x = r() * W, y = r() * H, a = r() * TAU, l = 6 + r() * 22;
    c.strokeStyle = r() < 0.5 ? 'rgba(150,110,90,0.05)' : 'rgba(255,255,250,0.07)';
    c.lineWidth = 0.6 + r();
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (r() - 0.5) * 6, y + Math.sin(a) * l * 0.5 + (r() - 0.5) * 6, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
  }
  return cv;
}
/* Per-scene overlay = paper + warm light tint + soft violet-brown vignette. */
function makeOverlay(tint, tintA, vig, night) {
  if (!PAPER) PAPER = makePaper();
  const cv = makeCanvas(W, H), c = cv.getContext('2d'), vc = night ? '70,56,140,' : '125,74,96,';      // night (second game): a blue-violet vignette
  c.drawImage(PAPER, 0, 0);
  if (tintA > 0) { c.fillStyle = rgba(tint, tintA); c.fillRect(0, 0, W, H); }
  const g = c.createRadialGradient(W * 0.48, H * 0.44, H * 0.42, W * 0.5, H * 0.5, H * 1.08);
  g.addColorStop(0, 'rgba(' + vc + '0)'); g.addColorStop(1, 'rgba(' + vc + (vig == null ? 0.42 : vig) + ')');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return cv;
}

/* Sky colors drift from afternoon (t=0) to sunset (t=1) to dusk (t=1.3). */
const SKY_KEYS = [
  [0.0, '#A9CFD0', '#F8E6BC'], [0.4, '#CDD0B4', '#F7D29A'], [0.7, '#DDB79A', '#F5B983'],
  [1.0, '#B88FA6', '#F2A070'], [1.3, '#5A4C7C', '#D0808A']
];
function skyCols(t) {
  t = clamp(t, 0, 1.3);
  for (let i = 0; i < SKY_KEYS.length - 1; i++) {
    const a = SKY_KEYS[i], b = SKY_KEYS[i + 1];
    if (t <= b[0]) { const u = (t - a[0]) / (b[0] - a[0]); return [mix(a[1], b[1], u), mix(a[2], b[2], u)]; }
  }
  const l = SKY_KEYS[SKY_KEYS.length - 1]; return [l[1], l[2]];
}
function paintSky(c, x, y, w, h, t, seed, o) {
  o = o || {};
  const r = rng(seed || 3), sc = skyCols(t);
  const g = c.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, sc[0]); g.addColorStop(1, sc[1]);
  c.fillStyle = g; c.fillRect(x, y, w, h);
  for (let i = 0; i < 14; i++)   // wet-in-wet sky washes
    wash(c, x + r() * w, y + r() * h * 0.8, w * (0.1 + r() * 0.16), h * (0.1 + r() * 0.14), i % 2 ? sc[1] : mix(sc[0], '#FFF6E0', 0.4), { a: 0.16, seed: i + seed, wob: 0.3, edge: 0 });
  // sun
  const sx = x + w * (o.sunX == null ? 0.74 : o.sunX), sy = y + h * (0.2 + 0.52 * clamp(t, 0, 1.2)), sr = (o.sunR || h * 0.16);
  const sg = c.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 4.5);
  sg.addColorStop(0, 'rgba(255,238,190,0.75)'); sg.addColorStop(0.3, 'rgba(255,214,150,0.32)'); sg.addColorStop(1, 'rgba(255,200,140,0)');
  c.fillStyle = sg; c.fillRect(x, y, w, h);
  wash(c, sx, sy, sr, sr, mix('#FFE9A8', '#F6A06A', clamp(t, 0, 1) * 0.7), { a: 0.95, seed: 5, wob: 0.05, edgeA: 0.1 });
  wash(c, sx - sr * 0.2, sy - sr * 0.2, sr * 0.6, sr * 0.6, '#FFF6D8', { a: 0.5, seed: 6, edge: 0 });
  // clouds
  const nc = o.clouds == null ? 6 : o.clouds;
  for (let i = 0; i < nc; i++) {
    const cx = x + r() * w, cy = y + h * (0.08 + r() * 0.5), cw = w * (0.05 + r() * 0.07), col = mix('#FFF4E2', '#F4B6A8', clamp(t, 0, 1) * 0.8);
    for (let k = 0; k < 4; k++) wash(c, cx + (k - 1.5) * cw * 0.55, cy + (r() - 0.5) * cw * 0.2, cw * (0.5 + r() * 0.3), cw * (0.2 + r() * 0.12), col, { a: 0.5, seed: i * 9 + k, wob: 0.2, edge: 0 });
  }
  if (t > 1.1) {   // first stars at dusk
    for (let i = 0; i < 60; i++) { c.fillStyle = 'rgba(255,244,214,' + (0.3 + r() * 0.6) + ')'; c.beginPath(); c.arc(x + r() * w, y + r() * h * 0.55, 1 + r() * 2.2, 0, TAU); c.fill(); }
  }
}
/* The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. */
function paintNightSky(c, x, y, w, h, seed, o) {
  o = o || {};
  const r = rng(seed || 3), g = c.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#2E2F78'); g.addColorStop(0.6, '#5A4AA0'); g.addColorStop(1, '#4E86B0');
  c.fillStyle = g; c.fillRect(x, y, w, h);
  for (let i = 0; i < 14; i++) wash(c, x + r() * w, y + r() * h * 0.8, w * (0.1 + r() * 0.16), h * (0.1 + r() * 0.14), i % 2 ? '#6A58B8' : '#3A4A98', { a: 0.16, seed: i + seed, wob: 0.3, edge: 0 });
  c.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const yy = y + h * (0.2 + i * 0.055); c.beginPath();
    for (let px = 0; px <= w; px += 40) { const v = yy + Math.sin(px / (w * 0.22) + seed + i * 0.15) * h * 0.11 + Math.sin(px / (w * 0.07) + i) * h * 0.02; if (px === 0) c.moveTo(x + px, v); else c.lineTo(x + px, v); }
    c.strokeStyle = rgba(RAINBOW[i], 0.2); c.lineWidth = h * 0.065; c.stroke();
  }
  for (let i = 0; i < 170; i++) {
    c.fillStyle = 'rgba(255,248,224,' + (0.35 + r() * 0.6) + ')'; const sx = x + r() * w, sy = y + r() * h * 0.85, sr = 1 + r() * 2.4;
    if (i % 9 === 0) { starPath(c, sx, sy, sr * 2.6, r() * 3); c.fill(); } else { c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill(); }
  }
  const mx = x + w * (o.sunX == null ? 0.74 : o.sunX), my = y + h * 0.3, mr = o.sunR || h * 0.16;
  const mg = c.createRadialGradient(mx, my, mr * 0.3, mx, my, mr * 4.5); mg.addColorStop(0, 'rgba(240,244,255,0.6)'); mg.addColorStop(0.3, 'rgba(200,210,255,0.22)'); mg.addColorStop(1, 'rgba(180,190,255,0)');
  c.fillStyle = mg; c.fillRect(x, y, w, h);
  wash(c, mx, my, mr, mr, '#FFF8E4', { a: 0.97, seed: 5, wob: 0.04, edgeA: 0.1 });
  wash(c, mx + mr * 0.25, my - mr * 0.2, mr * 0.22, mr * 0.18, '#E4DCEC', { a: 0.5, seed: 6, edge: 0 }); wash(c, mx - mr * 0.3, my + mr * 0.3, mr * 0.16, mr * 0.14, '#E4DCEC', { a: 0.5, seed: 7, edge: 0 });
  const nc = o.clouds == null ? 6 : o.clouds;
  for (let i = 0; i < nc; i++) { const cx = x + r() * w, cy = y + h * (0.08 + r() * 0.5), cw = w * (0.05 + r() * 0.07); for (let k = 0; k < 4; k++) wash(c, cx + (k - 1.5) * cw * 0.55, cy + (r() - 0.5) * cw * 0.2, cw * (0.5 + r() * 0.3), cw * (0.2 + r() * 0.12), '#8A84D0', { a: 0.35, seed: i * 9 + k, wob: 0.2, edge: 0 }); }
}
/* Two rows of pointed mountains with pale snow on top, for George's arena. */
function paintMountains(c, x, yBase, w, hgt, seed) {
  const r = rng(seed);
  for (let k = 0; k < 2; k++) {
    const n = 6 + k * 2, half = w / n * 0.62, peaks = [];
    for (let i = 0; i <= n; i++) peaks.push([x + w * (i / n) + (r() - 0.5) * w / n * 0.5, yBase - hgt * (0.55 + r() * 0.45) * (k ? 0.7 : 1)]);
    c.beginPath(); c.moveTo(x, yBase + 30);
    for (const p of peaks) { c.lineTo(p[0] - half, yBase + 10); c.lineTo(p[0], p[1]); c.lineTo(p[0] + half, yBase + 10); }
    c.lineTo(x + w, yBase + 30); c.closePath(); c.fillStyle = k ? '#4A4690' : '#6460B0'; c.fill();
    for (const p of peaks) {
      const hh = yBase + 10 - p[1];
      c.fillStyle = 'rgba(46,42,102,0.25)'; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + half, yBase + 10); c.lineTo(p[0] + half * 0.15, yBase + 10); c.closePath(); c.fill();
      c.fillStyle = 'rgba(236,232,255,0.92)'; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] - half * 0.28, p[1] + hh * 0.28); c.lineTo(p[0] - half * 0.08, p[1] + hh * 0.2); c.lineTo(p[0] + half * 0.06, p[1] + hh * 0.3); c.lineTo(p[0] + half * 0.26, p[1] + hh * 0.26); c.closePath(); c.fill();
    }
  }
}
/* Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). */
function paintHills(c, x, yBase, w, hgt, t, seed, cols, night) {
  const r = rng(seed);
  cols = cols || ['#B9C4A0', '#A8BC8C', '#9DB37E'];
  for (let k = 0; k < cols.length; k++) {
    const col = night ? cols[k] : mix(cols[k], mix('#C9A6B0', '#8E7AA0', clamp(t, 0, 1)), 0.25 + clamp(t, 0, 1.2) * 0.35 - k * 0.06);
    const yb = yBase - hgt * (1 - k / cols.length) * 0.75, ph = r() * 9;
    for (let pass = 0; pass < 2; pass++) {
      c.beginPath(); c.moveTo(x, yBase + 40);
      for (let px = 0; px <= w; px += 40) {
        const yy = yb - Math.sin(px / (260 + k * 90) + ph) * hgt * 0.22 - Math.sin(px / 97 + ph * 2) * hgt * 0.06 + pass * 5;
        c.lineTo(x + px, yy);
      }
      c.lineTo(x + w, yBase + 40); c.closePath();
      c.fillStyle = rgba(col, pass ? 0.55 : 0.7); c.fill();
    }
  }
}

/* Text. No black outlines: a soft cream halo and a warm shadow instead. */
function setFont(c, size, title, weight) {
  c.font = (weight || (title ? 'bold' : '600')) + ' ' + size + 'px ' + (title ? CONFIG.fontTitle : CONFIG.fontUI);
}
function text(c, str, x, y, size, col, o) {
  o = o || {};
  setFont(c, size, o.title, o.weight);
  c.textAlign = o.align || 'center'; c.textBaseline = o.base || 'middle';
  if (o.halo !== 0) {
    c.lineJoin = 'round'; c.lineWidth = size * (o.halo || 0.2);
    c.strokeStyle = o.haloCol || 'rgba(255,246,224,0.85)';
    c.strokeText(str, x, y);
  }
  if (o.shadow !== 0) { c.fillStyle = 'rgba(106,66,112,0.25)'; c.fillText(str, x + size * 0.04, y + size * 0.06); }
  c.fillStyle = col || '#6A4250';
  c.fillText(str, x, y);
}
function wrapLines(c, str, maxW, size, title) {
  setFont(c, size, title);
  const words = str.split(' '), lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/* The ✕ button as a painted icon (blue cross on a cream disc). */
function iconX(c, x, y, r, pulse) {
  const s = 1 + (pulse || 0) * 0.08;
  c.save(); c.translate(x, y); c.scale(s, s);
  soft(c, r * 0.06, r * 0.1, r, r, SHADOW, 0.25, 3);
  puff(c, 0, 0, r, r, '#FFF6E2', 4, 'rgba(110,130,190,0.5)');
  c.strokeStyle = '#6D8FD0'; c.lineWidth = r * 0.2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-r * 0.4, -r * 0.4); c.lineTo(r * 0.4, r * 0.4); c.moveTo(r * 0.4, -r * 0.4); c.lineTo(-r * 0.4, r * 0.4); c.stroke();
  c.restore();
}
/* The □ button as a painted icon (pink square on a cream disc): help the friend. */
function iconSq(c, x, y, r, pulse) {
  const s = 1 + (pulse || 0) * 0.08;
  c.save(); c.translate(x, y); c.scale(s, s);
  soft(c, r * 0.06, r * 0.1, r, r, SHADOW, 0.25, 3);
  puff(c, 0, 0, r, r, '#FFF6E2', 4, 'rgba(200,120,170,0.5)');
  c.strokeStyle = '#D98AC0'; c.lineWidth = r * 0.2; c.lineJoin = 'round';
  c.strokeRect(-r * 0.4, -r * 0.4, r * 0.8, r * 0.8);
  c.restore();
}
/* Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. */
function richText(c, str, x, y, size, col, o) {
  o = o || {};
  const parts = str.split(/(✕|□)/);
  if (parts.length === 1) { text(c, str, x, y, size, col, o); return; }
  setFont(c, size, o.title, o.weight);
  const iw = size * 1.25, isIcon = p => p === '✕' || p === '□', widths = parts.map(p => isIcon(p) ? iw : c.measureText(p).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? x : x - total / 2;
  for (let i = 0; i < parts.length; i++) {
    if (isIcon(parts[i])) (parts[i] === '✕' ? iconX : iconSq)(c, cx + iw / 2, y, size * 0.5, o.pulse || 0);
    else if (parts[i]) text(c, parts[i], cx, y, size, col, Object.assign({}, o, { align: 'left' }));
    cx += widths[i];
  }
}
function starPath(c, x, y, r, rot) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot + i / 10 * TAU - Math.PI / 2, rr = i % 2 ? r * 0.5 : r;
    if (i === 0) c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath();
}
/* A painted card (panel) used by menus and story screens. */
const _cards = new Map(), SPR = {};
/* Things that never change are painted once and then stamped: much faster per frame. */
function sprite(key, w, h, paint) {
  let sp = SPR[key];
  if (!sp) { sp = makeCanvas(w * 2, h * 2); const cc = sp.getContext('2d'); cc.scale(2, 2); paint(cc); SPR[key] = sp; }
  return sp;
}
function card(c, x, y, w, h, col, seed) {
  const key = w + '|' + h + '|' + col + '|' + seed; let sp = _cards.get(key);
  if (!sp) { sp = makeCanvas(Math.ceil(w) + 60, Math.ceil(h) + 60); paintCard(sp.getContext('2d'), 30, 30, w, h, col, seed); _cards.set(key, sp); }
  c.drawImage(sp, x - 30, y - 30);
}
function paintCard(c, x, y, w, h, col, seed) {
  c.save();
  c.translate(x + w / 2, y + h / 2);
  const p = (dx, dy, sc, fill, a) => {
    c.beginPath();
    const rw = w / 2 * sc, rh = h / 2 * sc, rad = Math.min(60, rh * 0.5), n = 28;
    for (let i = 0; i <= n; i++) {
      const tt = i / n * TAU, ct = Math.cos(tt), st = Math.sin(tt);
      // rounded-rectangle via superellipse, with a little wobble
      const e = 0.22, f = 1 + (hash(seed, i % n) - 0.5) * 0.012;
      const px = Math.sign(ct) * Math.pow(Math.abs(ct), e * 2) * rw * f + dx, py = Math.sign(st) * Math.pow(Math.abs(st), e * 2) * rh * f + dy;
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath(); c.fillStyle = rgba(fill, a); c.fill();
    return rad;
  };
  p(10, 14, 1.0, SHADOW, 0.22);
  p(0, 0, 1.0, shade(col, -0.18), 1);
  p(0, -2, 0.985, col, 1);
  p(-w * 0.01, -h * 0.02, 0.93, shade(col, 0.5), 0.28);
  c.restore();
}
