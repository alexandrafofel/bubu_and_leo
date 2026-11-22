
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
/* ---- The one light of the new look (levels 7 - 12, the heroes and George). docs/24-sisteme-noi.md, S7.1 ----
   Everything painted in the new style is lit from the upper left by a warm key light, and filled from the
   lower right by a cool light. Two names, used by every new painter, so the light is the same everywhere. */
const KEY = '#FFE2B0';       // warm light, upper left
const FILL = '#8FA8FF';      // cool fill light, lower right

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

/* ---- One object with volume, in the new look (docs/24-sisteme-noi.md, S7.1) ----
   Five layers, always in this order: the cast shadow that glues the object to the ground, the dark
   contact line under it, the shape itself with a gradient, the rim light that lifts it off the
   background, and a gloss spot on shiny materials. Every painter of the new look goes through here,
   so the one light (KEY from the upper left, FILL from the lower right) falls the same way on everything.

   c     the context
   path  a function (c) that builds the contour: one closed path. It is called a few times
   col   the color of the object
   o     x, y    where the object stands on the ground: the middle of its base
         w, h    how wide and how tall it is. The shadow and the gradient are built from these
         gloss   0 to 1, how shiny the material is. 0 = no gloss spot at all. Left out: the gloss of the material
         mat     the name of a material (see MATERIALS below), or a painter (c, o, path) of your own. It is
                 called inside the shape, over the gradient, and cut to the contour
         seed    for the hand-painted wobble of the gloss spot
         shadow  false = no cast shadow (things that do not stand on the ground: a thrown bone, a cloud,
                 a part of a hero: the hero has one shadow of his own, castShadow())
         rim     how wide the rim light is (5 when left out). Small parts (a leg, a finger) need a thinner one,
                 or the two rims cover the whole part
         rimA    how strong the rim light is, 0 to 1 (1 when left out). The many parts of a hero take less,
                 or every leg and finger gets a pale outline
         lite    true = only the gradient (and the gloss): no clip, no material, no rim light. For the many small
                 parts of a hero (a leg, an arm, a sleeve): the clip and the two rims cost more than the whole old
                 painter, and on a part a few pixels wide they show nothing
         flip    -1 when the painter has mirrored the drawing (c.scale(-1, 1)). Left out: read from the transform.
                 The light must stay on the upper left of the screen, whichever way a hero looks
   The rim light is painted by stroking the same path a little moved, inside the clip of the shape:
   moved down-right it shows along the upper-left edge (KEY), moved up-left along the lower-right one (FILL).
   No createRadialGradient, no createPattern, no shadowBlur: this runs on every frame (S7.7). */
function lit(c, path, col, o) {
  o = o || {};
  const mat = matOf(o.mat);
  const x = o.x || 0, y = o.y || 0, w = o.w || 60, h = o.h || 60, gloss = o.gloss != null ? o.gloss : (mat && mat.gloss) || 0;
  const fl = o.flip || (c.getTransform().a < 0 ? -1 : 1), rim = o.rim || 5, ro = rim * 0.48, ra = o.rimA == null ? 1 : o.rimA;
  if (o.shadow !== false) castShadow(c, x, y, w, h, o.seed || 1, 1);   // a thing that does not stand on the ground has neither shadow
  // 3. the shape, with volume: light from the upper left, darker and a little violet to the lower right
  const g = c.createLinearGradient(x - fl * w / 2, y - h, x + fl * w / 2, y);
  g.addColorStop(0, shade(col, 0.22));
  g.addColorStop(1, mix(shade(col, -0.28), '#5A3550', 0.1));
  if (o.lite) { path(c); c.fillStyle = g; c.fill(); litGloss(c, x, y, w, h, gloss, o.seed, fl); return; }
  c.save();
  path(c); c.fillStyle = g; c.fill(); c.clip();
  if (mat) mat.paint(c, o, path);                              // the material lies over the shape, cut to the contour
  // 4. rim light, inside the shape: warm along the upper-left edge, cool along the lower-right one
  c.lineWidth = rim;
  c.save(); c.translate(ro * fl, ro); path(c); c.strokeStyle = rgba(KEY, 0.7 * ra); c.stroke(); c.restore();
  c.save(); c.translate(-ro * fl, -ro); path(c); c.strokeStyle = rgba(FILL, 0.55 * ra); c.stroke(); c.restore();
  // 5. gloss: only on shiny materials. The shinier, the bigger and the stronger the spot
  litGloss(c, x, y, w, h, gloss, o.seed, fl);
  c.restore();
}
function litGloss(c, x, y, w, h, gloss, seed, fl) {
  if (!(gloss > 0)) return;
  const grx = w * (0.06 + 0.12 * gloss);
  blobPath(c, x - fl * w * 0.22, y - h * 0.72, grx, grx * 0.62, (seed || 1) + 13, 0.08, 9);
  c.fillStyle = 'rgba(255,255,255,' + (0.6 + 0.3 * gloss) + ')';
  c.fill();
}

/* The two shadows of S7.1 for anything that stands on the ground (lit() uses them, and so does every hero, who is
   made of many parts but has one shadow). x, y = the middle of the base, w, h = how wide and tall the thing is.
   h only decides how far to the lower right the shadow falls: a hero passes less than his height, so his shadow
   starts at his feet instead of lying beside him.
   k (0 to 1) = how strong: a hero in the air has a smaller, paler shadow and no contact line.
   1. cast shadow: pushed to the lower right because the light comes from the upper left, and flattened.
   2. contact shadow: the short dark line right under the base, so the object does not float. */
function castShadow(c, x, y, w, h, seed, k) {
  k = k == null ? 1 : k;
  c.save();
  c.globalCompositeOperation = 'multiply';
  c.fillStyle = rgba(SHADOW, 0.28 * k);
  blobPath(c, x + h * 0.35 * k, y + h * 0.12 * k, w * 0.55 * k, w * 0.55 * 0.4 * k, seed, 0.05, 9);
  c.fill();
  c.restore();
  if (k < 0.95) return;
  c.fillStyle = rgba(SHADOW, 0.4);
  blobPath(c, x, y, w * 0.3, w * 0.3 * 0.26, seed + 7, 0.05, 9);
  c.fill();
}

/* ---- Materials of the new look (docs/24-sisteme-noi.md, S7.2) ----
   A material is an object { gloss, paint(c, o, path) }. `lit()` calls paint inside the shape, over the gradient,
   with the clip of the contour already on, so a texture can never leave the object. `gloss` is the shine the
   material has when the caller does not say otherwise (S7.2: scale 0.3, fabric 0.05, rubber 0.4, bone 0.25).
   Use one by name: lit(c, path, col, { x, y, w, h, mat: 'scale' }).

   The textures are small tiles painted ONCE (sprite()), turned into a pattern ONCE (matPattern()) and then only
   filled with fillRect on every frame. createPattern is never called while drawing a frame (S7.7).
   A tile is painted opaque in a dark violet or a cream: the material decides how strongly it shows (globalAlpha). */
const MATERIALS = {}, _matPat = new Map(), _matWarned = new Set();
let _matScratch = null;
function matOf(m) {
  if (!m) return null;
  if (typeof m === 'function') return { gloss: 0, paint: m };
  const k = MATERIALS[m];
  if (!k && !_matWarned.has(m)) { _matWarned.add(m); console.error('lit(): no material named "' + m + '"'); }
  return k || null;
}
/* The pattern of a tile of w x h units. sprite() paints at double size, so the pattern is shrunk by half to be w x h again. */
function matPattern(key, w, h, paint) {
  let p = _matPat.get(key);
  if (!p) {
    const tile = sprite('mat-' + key, w, h, paint);
    if (!_matScratch) _matScratch = makeCanvas(1, 1).getContext('2d');
    p = _matScratch.createPattern(tile, 'repeat');
    if (p.setTransform) p.setTransform(new DOMMatrix([0.5, 0, 0, 0.5, 0, 0]));
    _matPat.set(key, p);
  }
  return p;
}
/* Fills the box of the shape with a pattern. part 'back' = only its left half: the back of a hero, who faces right
   (the painters flip the whole hero, so "left" is always the back). */
function matFill(c, pat, o, alpha, part) {
  const w = o.w || 60, h = o.h || 60;
  c.save(); c.globalAlpha = alpha; c.fillStyle = pat;
  c.fillRect((o.x || 0) - w / 2 - 8, (o.y || 0) - h - 8, part === 'back' ? w / 2 + 8 : w + 16, h + 16);
  c.restore();
}

// scale: little half circles in rows that are shifted by half a scale. The tile repeats without a seam (every scale is also drawn one tile away)
function paintScaleTile(c) {
  c.strokeStyle = SHADOW; c.lineWidth = 1.5; c.lineCap = 'round';
  for (const dy of [-16, 0, 16]) for (const dx of [-22, 0, 22]) {
    for (const cx of [5.5, 16.5]) { c.beginPath(); c.arc(cx + dx, 5 + dy, 5.5, 0.1, Math.PI - 0.1); c.stroke(); }
    for (const cx of [0, 11, 22]) { c.beginPath(); c.arc(cx + dx, 13 + dy, 5.5, 0.1, Math.PI - 0.1); c.stroke(); }
  }
}
MATERIALS.scale = {
  gloss: 0.3,
  paint(c, o) {
    const p = matPattern('scale', 22, 16, paintScaleTile);
    matFill(c, p, o, 0.12);               // the whole shape
    matFill(c, p, o, 0.07, 'back');       // closer together toward the back: a second layer over the left half
  }
};

// fabric: a very fine weave (lines that cross) and, 4 units inside the edge, a line of stitches
function paintWeaveTile(c) {
  c.fillStyle = SHADOW;
  c.fillRect(0, 0, 3, 1.2); c.fillRect(0, 0, 1.2, 3);       // one thread across, one down, every 3 units
}
MATERIALS.fabric = {
  gloss: 0.05,
  paint(c, o, path) {
    matFill(c, matPattern('weave', 3, 3, paintWeaveTile), o, 0.08);
    // the stitches: the same contour made a little smaller around the middle of the shape (about 4 units inside), dashed and cream
    const w = o.w || 60, h = o.h || 60, mx = o.x || 0, my = (o.y || 0) - h / 2;
    c.save();
    c.translate(mx, my); c.scale(Math.max(0.2, 1 - 4 / (w / 2)), Math.max(0.2, 1 - 4 / (h / 2))); c.translate(-mx, -my);
    path(c);
    c.setLineDash([3.5, 3.5]); c.lineWidth = 1.5; c.lineCap = 'round'; c.strokeStyle = 'rgba(255,246,224,0.7)';
    c.stroke();
    c.restore();
  }
};

// rubber: smooth. One wide soft band of light across the upper left, with no hard edge
MATERIALS.rubber = {
  gloss: 0.4,
  paint(c, o) {
    const w = o.w || 60, h = o.h || 60, x0 = (o.x || 0) - w / 2, y0 = (o.y || 0) - h;
    const g = c.createLinearGradient(x0, y0, x0 + w, y0 + h);
    g.addColorStop(0, rgba(KEY, 0)); g.addColorStop(0.16, rgba(KEY, 0.1)); g.addColorStop(0.32, rgba(KEY, 0.32));
    g.addColorStop(0.5, rgba(KEY, 0.08)); g.addColorStop(0.64, rgba(KEY, 0));
    c.fillStyle = g; c.fillRect(x0 - 8, y0 - 8, w + 16, h + 16);
  }
};

// bone: almost smooth. A few small pores, and one crack with a pale edge beside it.
// The tile is big (64 x 64) and the pores sit at random, in lone ones and in little groups: a small tile repeats like a grid
function paintPoreTile(c) {
  c.fillStyle = SHADOW;
  for (let i = 0; i < 11; i++) {
    const x = 4 + hash(41, i) * 56, y = 4 + hash(42, i) * 56, n = hash(46, i) > 0.6 ? 3 : 1;     // some pores come in threes
    for (let k = 0; k < n; k++) {
      c.beginPath(); c.ellipse(x + (hash(47, i * 5 + k) - 0.5) * 7, y + (hash(48, i * 5 + k) - 0.5) * 5, 0.8 + hash(43, i * 5 + k) * 1.1, 0.6 + hash(44, i * 5 + k) * 0.8, hash(45, i) * 3, 0, TAU); c.fill();
    }
  }
}
MATERIALS.bone = {
  gloss: 0.25,
  paint(c, o) {
    matFill(c, matPattern('pores', 64, 64, paintPoreTile), o, 0.3);
    const w = o.w || 60, h = o.h || 60, sd = o.seed || 1, x = (o.x || 0) + (hash(sd, 1) - 0.5) * w * 0.3, y = (o.y || 0) - h * (0.62 + hash(sd, 2) * 0.12);
    const pts = [[x, y]];
    for (let i = 1; i <= 4; i++) pts.push([x + (hash(sd, 10 + i) - 0.3) * w * 0.12, y + i * h * 0.1]);
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [dx, col, a, lw] of [[1.2, KEY, 0.5, 1.2], [0, SHADOW, 0.34, 1.5]]) {   // the pale edge first, the dark crack over it
      c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0] + dx, q[1] + dx) : c.moveTo(q[0] + dx, q[1] + dx));
      c.strokeStyle = rgba(col, a); c.lineWidth = lw; c.stroke();
    }
  }
};

// ---- The materials of the world (T6.3): wood, metal, stone, crystal, leaf, lava ----

// wood: long grain lines that wiggle a little, a couple of knots, and lighter plank ends
function paintGrainTile(c) {
  c.strokeStyle = SHADOW; c.lineWidth = 1.1; c.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const y = 3 + i * 5.2 + (hash(51, i) - 0.5) * 2, a = 1 + hash(52, i) * 1.6, ph = hash(53, i) * TAU;
    c.beginPath();
    for (let x = 0; x <= 96; x += 4) { const yy = y + Math.sin(x / 96 * TAU * 2 + ph) * a; x ? c.lineTo(x, yy) : c.moveTo(x, yy); }
    c.stroke();
  }
}
MATERIALS.wood = {
  gloss: 0.15,
  paint(c, o) {
    const w = o.w || 60, h = o.h || 60, x0 = (o.x || 0) - w / 2, y0 = (o.y || 0) - h, sd = o.seed || 1;
    matFill(c, matPattern('grain', 96, 48, paintGrainTile), o, 0.2);
    for (let k = 0; k < 3; k++) {                            // knots: a few rings, at seeded places
      const kx = x0 + w * (0.15 + hash(sd, 20 + k) * 0.7), ky = y0 + h * (0.2 + hash(sd, 30 + k) * 0.6), r = Math.min(w, h) * (0.05 + hash(sd, 40 + k) * 0.03);
      for (let j = 3; j >= 1; j--) { c.beginPath(); c.ellipse(kx, ky, r * j * 0.55 + 1, r * j * 0.38 + 0.8, 0, 0, TAU); c.strokeStyle = rgba(SHADOW, 0.16 + 0.05 * (3 - j)); c.lineWidth = 1.2; c.stroke(); }
    }
    const e = Math.min(w * 0.12, 14);                       // the ends of the plank, lighter
    for (const [xa, dir] of [[x0, 1], [x0 + w, -1]]) {
      const g = c.createLinearGradient(xa, 0, xa + dir * e, 0);
      g.addColorStop(0, rgba(KEY, 0.2)); g.addColorStop(1, rgba(KEY, 0));
      c.fillStyle = g; c.fillRect(Math.min(xa, xa + dir * e), y0 - 4, e, h + 8);
    }
  }
};

// metal: bands of light (light, dark, light), little rivets with a shadow, and fine pale scratches
function paintScratchTile(c) {
  c.strokeStyle = '#FFF6E0'; c.lineWidth = 0.8; c.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const x = hash(61, i) * 70, y = hash(62, i) * 70, a = -0.5 + hash(63, i) * 1.0, l = 6 + hash(64, i) * 14;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
  }
}
MATERIALS.metal = {
  gloss: 0.8,
  paint(c, o) {
    const w = o.w || 60, h = o.h || 60, x0 = (o.x || 0) - w / 2, y0 = (o.y || 0) - h;
    const g = c.createLinearGradient(x0, 0, x0 + w, 0);
    g.addColorStop(0, rgba(KEY, 0.3)); g.addColorStop(0.2, rgba(KEY, 0)); g.addColorStop(0.42, rgba(SHADOW, 0.26));
    g.addColorStop(0.62, rgba(SHADOW, 0)); g.addColorStop(0.8, rgba(KEY, 0.26)); g.addColorStop(1, rgba(SHADOW, 0.1));
    c.fillStyle = g; c.fillRect(x0 - 8, y0 - 8, w + 16, h + 16);
    matFill(c, matPattern('scratch', 70, 70, paintScratchTile), o, 0.25);
    const ins = Math.min(11, Math.min(w, h) * 0.12), r = Math.max(1.4, Math.min(w, h) * 0.022);
    for (const [fx, fy] of [[0.2, 0.2], [0.8, 0.2], [0.2, 0.8], [0.8, 0.8]]) {     // rivets, at a quarter of the box from every corner
      const rx = x0 + Math.max(ins, w * fx), ry = y0 + Math.max(ins, h * fy);
      c.beginPath(); c.arc(rx + r * 0.6, ry + r * 0.7, r, 0, TAU); c.fillStyle = rgba(SHADOW, 0.4); c.fill();
      c.beginPath(); c.arc(rx, ry, r, 0, TAU); c.fillStyle = rgba(KEY, 0.55); c.fill();
    }
  }
};

// stone: big irregular blotches in two tones, cracks, and moss low down
function paintBlotchTile(c) {
  for (let i = 0; i < 9; i++) {
    c.fillStyle = i % 2 ? SHADOW : '#FFF6E0';
    for (const dx of [-96, 0, 96]) for (const dy of [-96, 0, 96]) {      // every blotch is also drawn one tile away, so the tile repeats without a straight seam
      c.beginPath(); c.ellipse(hash(71, i) * 96 + dx, hash(72, i) * 96 + dy, 9 + hash(73, i) * 16, 7 + hash(74, i) * 12, hash(75, i) * 3, 0, TAU); c.fill();
    }
  }
}
MATERIALS.stone = {
  gloss: 0.1,
  paint(c, o) {
    const w = o.w || 60, h = o.h || 60, x0 = (o.x || 0) - w / 2, y0 = (o.y || 0) - h, sd = o.seed || 1;
    matFill(c, matPattern('blotch', 96, 96, paintBlotchTile), o, 0.16);
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let k = 0; k < 2; k++) {                             // two cracks
      let x = x0 + w * (0.25 + hash(sd, 50 + k) * 0.5), y = y0 + h * (0.15 + hash(sd, 52 + k) * 0.25);
      c.beginPath(); c.moveTo(x, y);
      for (let i = 1; i <= 5; i++) { x += (hash(sd, 60 + k * 9 + i) - 0.5) * w * 0.12; y += h * 0.09; c.lineTo(x, y); }
      c.strokeStyle = rgba(SHADOW, 0.4); c.lineWidth = 1.5; c.stroke();
    }
    const mg = c.createLinearGradient(0, y0 + h * 0.62, 0, y0 + h);                 // moss: from the lower third down
    mg.addColorStop(0, 'rgba(122,174,94,0)'); mg.addColorStop(1, 'rgba(122,174,94,0.4)');
    c.fillStyle = mg; c.fillRect(x0 - 8, y0 + h * 0.62, w + 16, h * 0.38 + 8);
    for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(x0 + w * (0.08 + i * 0.12) + (hash(sd, 80 + i) - 0.5) * 8, y0 + h * (0.84 + hash(sd, 90 + i) * 0.1), 2 + hash(sd, 100 + i) * 3, 0, TAU); c.fillStyle = 'rgba(122,174,94,0.32)'; c.fill(); }
  }
};

// crystal: facets (triangles in three tones of the same colour) and a lighter core
MATERIALS.crystal = {
  gloss: 1,
  paint(c, o) {
    const w = o.w || 60, h = o.h || 60, cx = o.x || 0, cy = (o.y || 0) - h / 2, sd = o.seed || 1, N = 7, rx = w * 0.62, ry = h * 0.62;
    const pt = (i) => { const a = (i + (hash(sd, i % N) - 0.5) * 0.5) / N * TAU; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; };
    for (let i = 0; i < N; i++) {
      const a = pt(i), b = pt(i + 1), t = i % 3;
      c.beginPath(); c.moveTo(cx + (hash(sd, 20) - 0.5) * w * 0.12, cy + (hash(sd, 21) - 0.5) * h * 0.12); c.lineTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.closePath();
      c.fillStyle = t === 0 ? rgba(KEY, 0.26) : t === 1 ? rgba(SHADOW, 0.2) : rgba(FILL, 0.12); c.fill();
      c.strokeStyle = rgba(KEY, 0.3); c.lineWidth = 1; c.stroke();
    }
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.38);
    g.addColorStop(0, 'rgba(255,246,224,0.55)'); g.addColorStop(1, 'rgba(255,246,224,0)');
    c.fillStyle = g; c.fillRect(cx - w / 2 - 8, cy - h / 2 - 8, w + 16, h + 16);
  }
};

// leaf: one midrib and side veins in pairs, all pale, and an edge a little darker
MATERIALS.leaf = {
  gloss: 0.35,
  paint(c, o, path) {
    const w = o.w || 60, h = o.h || 60, cx = o.x || 0, yb = o.y || 0, yt = yb - h, sd = o.seed || 1;
    c.lineCap = 'round';
    const bend = (hash(sd, 1) - 0.5) * w * 0.12;
    c.beginPath(); c.moveTo(cx, yb - h * 0.04); c.quadraticCurveTo(cx + bend, yb - h * 0.5, cx, yt + h * 0.06);
    c.strokeStyle = rgba(KEY, 0.5); c.lineWidth = Math.max(1.6, w * 0.018); c.stroke();
    for (let i = 1; i <= 6; i++) {
      const f = i / 7, y = yb - h * f * 0.92 - h * 0.04, x = cx + bend * 4 * f * (1 - f);
      for (const d of [-1, 1]) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + d * w * 0.18, y - h * 0.03, x + d * w * (0.34 - f * 0.12), y - h * 0.11); c.strokeStyle = rgba(KEY, 0.34); c.lineWidth = 1.2; c.stroke(); }
    }
    c.save(); path(c); c.strokeStyle = rgba(SHADOW, 0.32); c.lineWidth = 5; c.stroke(); c.restore();   // only the inner half shows: the shape is clipped
  }
};

// lava: a dark crust (#5A2A3A) with glowing cracks. The glow pulses from yellow to orange: o.t is the time in seconds
const LAVA_CRUST = '#5A2A3A', LAVA_HOT = '#F6CE46', LAVA_WARM = '#F58A3C';
MATERIALS.lava = {
  gloss: 0,
  paint(c, o) {
    const w = o.w || 60, h = o.h || 60, x0 = (o.x || 0) - w / 2, y0 = (o.y || 0) - h, sd = o.seed || 1;
    const g = c.createLinearGradient(x0, y0, x0 + w, y0 + h);
    g.addColorStop(0, rgba(shade(LAVA_CRUST, 0.12), 0.92)); g.addColorStop(1, rgba(LAVA_CRUST, 0.95));
    c.fillStyle = g; c.fillRect(x0 - 8, y0 - 8, w + 16, h + 16);
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let k = 0; k < 5; k++) {
      const pulse = 0.5 + 0.5 * Math.sin((o.t || 0) * 2.4 + k * 0.45), col = mix(LAVA_WARM, LAVA_HOT, pulse);
      let x = x0 + w * (0.1 + hash(sd, 110 + k) * 0.8), y = y0 + h * (0.05 + hash(sd, 120 + k) * 0.3);
      const pts = [[x, y]];
      for (let i = 1; i <= 5; i++) { x += (hash(sd, 130 + k * 9 + i) - 0.5) * w * 0.22; y += h * (0.1 + hash(sd, 150 + k * 9 + i) * 0.06); pts.push([x, y]); }
      c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]));
      c.strokeStyle = rgba(col, 0.3); c.lineWidth = 7; c.stroke();         // the soft glow around it
      c.strokeStyle = rgba(col, 0.95); c.lineWidth = 2.4; c.stroke();     // the crack itself
    }
  }
};

// water (T6.8): a deep blue base, then two rows of thin pale waves that go in opposite directions. o.t is the time in seconds.
// The wave tile is one picture, painted once: the two rows are the same pattern, drawn twice with different shifts.
const WAVE_W = 160, WAVE_H = 48, WAVE_COL = '#E6F6F8', WATER_DEEP = '#2E5FA8', WATER_SHALLOW = '#5FA8D8';
function paintWaveTile(c) {              // two thin wavy lines; each makes whole turns across the tile, so it repeats without a seam
  c.lineCap = 'round';
  for (const [y0, k, ph, a] of [[13, 2, 0.4, 3.2], [37, 3, 2.1, 2.4]]) {
    for (let x = 0; x < WAVE_W; x += 5) {
      const u = x / WAVE_W, yy = y0 + Math.sin(u * TAU * k + ph) * a, y2 = y0 + Math.sin((u + 5 / WAVE_W) * TAU * k + ph) * a;
      c.strokeStyle = rgba(WAVE_COL, 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(u * TAU * 2 + ph * 2)));       // the line fades in and out along its length
      c.lineWidth = 1.8; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + 5.5, y2); c.stroke();
    }
  }
}
/* The two rows of waves over the shape `path` (a Path2D in the same coordinates). The pattern is made once (matPattern);
   a frame only moves it (setTransform): no createPattern while drawing. */
function fillWaves(c, path, t, sa, sb) {
  const pat = matPattern('water-wave', WAVE_W, WAVE_H, paintWaveTile);
  c.save();
  pat.setTransform(new DOMMatrix([0.5, 0, 0, 0.5, (t * sa) % WAVE_W, 0])); c.globalAlpha = 0.5; c.fillStyle = pat; c.fill(path);
  pat.setTransform(new DOMMatrix([0.5, 0, 0, 0.5, (WAVE_W * 9 - t * sb + 57) % WAVE_W, WAVE_H / 2])); c.globalAlpha = 0.38; c.fill(path);
  pat.setTransform(new DOMMatrix([0.5, 0, 0, 0.5, 0, 0]));
  c.restore();
}
MATERIALS.water = {
  gloss: 0,
  paint(c, o, path) {
    const w = o.w || 60, h = o.h || 60, x0 = (o.x || 0) - w / 2, y0 = (o.y || 0) - h;
    const g = c.createLinearGradient(0, y0, 0, y0 + h);
    g.addColorStop(0, rgba(WATER_SHALLOW, 0.55)); g.addColorStop(1, rgba(WATER_DEEP, 0.6));
    c.fillStyle = g; c.fillRect(x0 - 8, y0 - 8, w + 16, h + 16);
    const box = new Path2D(); box.rect(x0 - 8, y0 - 8, w + 16, h + 16);
    fillWaves(c, box, o.t || 0, 14, 9);
  }
};

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
/* The colour of the very first pixel of a painting: the sky at the top. Used to fill the strip above the world
   when the camera looks a little higher than the painting goes (docs/24-sisteme-noi.md, S6). */
function topColor(cv) {
  try { const d = cv.getContext('2d').getImageData(0, 0, 1, 1).data; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'; }
  catch (e) { return '#CFE4F2'; }
}

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
/* ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. */
function iconO(c, x, y, r, pulse) {
  const s = 1 + (pulse || 0) * 0.08;
  c.save(); c.translate(x, y); c.scale(s, s);
  soft(c, r * 0.06, r * 0.1, r, r, SHADOW, 0.25, 3);
  puff(c, 0, 0, r, r, '#FFF6E2', 4, 'rgba(226,120,100,0.5)');
  c.strokeStyle = '#E4583C'; c.lineWidth = r * 0.22;
  c.beginPath(); c.arc(0, 0, r * 0.42, 0, TAU); c.stroke();
  c.restore();
}
/* L3: the cap of the left stick with the letter L and a little arrow pressing it down. */
function iconL3(c, x, y, r, t) {
  const pu = 0.5 + 0.5 * Math.sin((t || 0) * 5);
  c.save(); c.translate(x, y);
  soft(c, r * 0.06, r * 0.12, r, r, SHADOW, 0.25, 3);
  puff(c, 0, 0, r, r, '#C9C0E8', 4, 'rgba(142,124,195,0.55)');
  c.strokeStyle = '#8E7CC3'; c.lineWidth = r * 0.16; c.beginPath(); c.arc(0, 0, r * 0.66, 0, TAU); c.stroke();
  text(c, 'L', 0, r * 0.02, r * 0.86, '#5A4A8E', { halo: 0, shadow: 0, weight: 'bold' });
  c.strokeStyle = '#F8C24E'; c.lineWidth = r * 0.17; c.lineCap = 'round'; c.lineJoin = 'round';
  const ay = -r * 1.5 + pu * r * 0.3;                 // the arrow bobs down onto the cap
  c.beginPath(); c.moveTo(0, ay - r * 0.3); c.lineTo(0, ay + r * 0.3); c.moveTo(-r * 0.22, ay + r * 0.08); c.lineTo(0, ay + r * 0.32); c.lineTo(r * 0.22, ay + r * 0.08); c.stroke();
  c.restore();
}
/* The four button signs that can stand inside a text: ✕ □ ○ and ◉ (= L3, pressing the left stick). */
const ICONS = { '✕': iconX, '□': iconSq, '○': iconO, '◉': (cc, ix, iy, ir, pu) => iconL3(cc, ix, iy, ir * 0.92, pu) };
function richText(c, str, x, y, size, col, o) {
  o = o || {};
  const parts = str.split(/(✕|□|○|◉)/);
  if (parts.length === 1) { text(c, str, x, y, size, col, o); return; }
  setFont(c, size, o.title, o.weight);
  const iw = size * 1.25, isIcon = p => !!ICONS[p], widths = parts.map(p => isIcon(p) ? iw : c.measureText(p).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? x : x - total / 2;
  for (let i = 0; i < parts.length; i++) {
    if (isIcon(parts[i])) ICONS[parts[i]](c, cx + iw / 2, y, size * 0.5, o.pulse || 0);
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
