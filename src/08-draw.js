
/* ==========================================================================
   DRAWING THE GAME: world, heroes, effects, HUD
   ========================================================================== */
const _sorted = [];
function heroOpts(h) {
  return { face: h.face, walk: h.walk, moving: h.moving, t: h.t, z: h.z, squash: h.squash, dizzy: h.dizzy > 0, kick: h.kickT > 0 ? h.kickT / 0.28 : 0,
    happy: P.done || (P.boss && P.boss.state === 'won'), scale: h.small, hug: h.hugT > 0 ? h.hugT / 0.7 : 0, tail: h.tail, run: h.run,
    claw: h.spinT >= 0 && h.spinLook !== 'gloves' ? clamp(h.spinT / (abil(h.k, 'spin').time || 1), 0, 1) : -1,
    glove: h.spinT >= 0 && h.spinLook === 'gloves' ? clamp(h.spinT / (abil(h.k, 'spin').time || 1), 0, 1) : -1 };
}
const heroTop = k => (isLupta() ? [148, 128] : [100, 122])[k];        // how tall each hero is: where the stars, the name and the ○ go
/* The band at the top. Everything written over the world (badges, the middle card, the progress bar, the banners)
   stays inside it, and the camera (camTarget, 07-play.js) keeps every hero under it. See docs/24-sisteme-noi.md, S6. */
const HUD_TOP = 132;                  // how tall the band is, in screen units
const HERO_BOX = 190;                 // how tall a hero is with its name above it, in world units
/* Is a hero standing where we want to write? Used by the few texts that stay in the world, so they never cover anybody.
   only: check just this hero. The box is the painted body, without the name above it. */
function heroInWay(x, y, w, h, only) {
  return P.heroes.some(o => (only == null || o.k === only) && !o.carried &&
    Math.abs(o.x - x) < w / 2 + 50 && o.y + 6 > y - h / 2 && o.y - heroTop(o.k) * o.small - 20 < y + h / 2);
}
function drawParts(c) {
  for (const p of P.parts) {
    const a = clamp(p.life / p.max, 0, 1);
    if (p.kind === 'spark') { c.fillStyle = rgba(p.col, a); starPath(c, p.x, p.y, p.size * (0.5 + a * 0.5), p.rot); c.fill(); }
    else if (p.kind === 'dust') { c.fillStyle = rgba(p.col, a * 0.5); c.beginPath(); c.arc(p.x, p.y, p.size * (1.6 - a * 0.8), 0, TAU); c.fill(); }
    else if (p.kind === 'petal' || p.kind === 'leaf') { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = rgba(p.col, Math.min(1, a * 1.6)); c.beginPath(); c.ellipse(0, 0, p.size, p.size * (p.kind === 'leaf' ? 0.42 : 0.6), 0, 0, TAU); c.fill(); c.restore(); }
    else if (p.kind === 'heart') { heartPath(c, p.x, p.y, p.size * 0.7); c.fillStyle = rgba(p.col, Math.min(1, a * 1.6)); c.fill(); }
    else if (p.kind === 'hex') {           // the gloves: a small hexagon, like the ones on the ball
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot || 0); c.fillStyle = rgba(p.col, a * 0.9); c.beginPath();
      for (let i = 0; i < 6; i++) { const q = i / 6 * TAU, px = Math.cos(q) * p.size * 0.6, py = Math.sin(q) * p.size * 0.6; i ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.closePath(); c.fill(); c.restore();
    }
    else if (p.kind === 'paw') {           // a bone in flight leaves little paw prints
      c.fillStyle = rgba(p.col, a * 0.55);
      c.beginPath(); c.ellipse(p.x, p.y, p.size * 0.5, p.size * 0.38, 0, 0, TAU); c.fill();
      for (let i = 0; i < 3; i++) { const q = -0.9 + i * 0.9; c.beginPath(); c.arc(p.x + Math.cos(q) * p.size * 0.55, p.y + Math.sin(q) * p.size * 0.5 - p.size * 0.3, p.size * 0.19, 0, TAU); c.fill(); }
    }
    else { c.fillStyle = rgba(p.col, a); c.beginPath(); c.arc(p.x, p.y, p.size * 0.6, 0, TAU); c.fill(); }
  }
}
/* Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. */
/* The ten seconds of a hero who is down: ten beads around him, one going out every second, and the number
   over his head. It pops at every second and grows coral in the last three. Nothing dark: it is a countdown, not a threat. */
function drawDownRing(c, h, by) {
  const RS = CONFIG.rescue, full = rescueLimit() || RS.limit, left = h.downLeft, t = P.time;
  const col = CONFIG.heroes[1 - h.k].color, hurry = left <= 3, n = 10;
  const onN = Math.ceil(left / full * n);                 // how many beads are still on ("lit" is the painter in 02-core.js)
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU - Math.PI / 2, bx = h.x + Math.cos(a) * 76, byy = h.y - 50 + Math.sin(a) * 40, on = i < onN;
    const pu = on && i === onN - 1 ? 1 + 0.3 * Math.abs(Math.sin(t * 7)) : 1;
    c.fillStyle = on ? col : 'rgba(255,246,224,0.45)';
    c.beginPath(); c.arc(bx, byy, 8 * pu, 0, TAU); c.fill();
    c.strokeStyle = on ? 'rgba(255,248,232,0.9)' : rgba(col, 0.4); c.lineWidth = on ? 2.5 : 2; c.stroke();
  }
  const secs = Math.ceil(left), frac = secs - left, pop = 1 + 0.25 * clamp(1 - frac / 0.15, 0, 1);      // the number pops at every second
  c.save(); c.translate(h.x - 46, by + 6); c.scale(pop, pop);
  text(c, String(secs), 0, 0, hurry ? 84 : 64, hurry ? '#E4583C' : col, { title: true, halo: 0.26, haloCol: 'rgba(255,248,232,0.95)' });
  c.restore();
}
function drawClawRing(c, h) {
  const cfg = abil(h.k, 'spin'), R = cfg.radius, u = clamp(h.spinT / cfg.time, 0, 1), grow = Math.min(1, u * 5) * (u > 0.85 ? (1 - u) / 0.15 : 1), t = P.time;
  c.fillStyle = rgba(CONFIG.heroes[h.k].color, 0.12 * grow); c.beginPath(); c.ellipse(h.x, h.y - 6, R * grow, R * 0.52 * grow, 0, 0, TAU); c.fill();
  c.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a0 = t * 13 + i * TAU / 6;
    for (let k = 0; k < 3; k++) {          // three claw marks next to each other
      const rr = R * grow * (0.86 + k * 0.07);
      c.strokeStyle = rgba(k === 1 ? '#FFFBEA' : RAINBOW[i], 0.85 * grow); c.lineWidth = k === 1 ? 5 : 8;
      c.beginPath(); c.ellipse(h.x, h.y - 6, rr, rr * 0.52, 0, a0 + k * 0.05, a0 + 0.62 - k * 0.05); c.stroke();
    }
  }
}
/* The ring of Killer's whirl gloves: two gloves chasing each other, each with a ribbon behind (one blue, one white),
   and a dotted white circle on the ground, like the line in the middle of a pitch. It turns the other way than the claws. */
function drawGloveRing(c, h) {
  const cfg = abil(h.k, 'spin'), R = cfg.radius, u = clamp(h.spinT / cfg.time, 0, 1), grow = Math.min(1, u * 5) * (u > 0.85 ? (1 - u) / 0.15 : 1), t = P.time;
  c.fillStyle = rgba(CONFIG.heroes[h.k].color, 0.12 * grow); c.beginPath(); c.ellipse(h.x, h.y - 6, R * grow, R * 0.52 * grow, 0, 0, TAU); c.fill();
  c.save();                                 // the dotted circle on the ground
  c.strokeStyle = rgba('#FFF6E2', 0.65 * grow); c.lineWidth = 5; c.setLineDash([16, 14]); c.lineDashOffset = -t * 60;
  c.beginPath(); c.ellipse(h.x, h.y + 4, R * grow * 0.96, R * 0.5 * grow, 0, 0, TAU); c.stroke();
  c.restore();
  c.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    const a0 = -t * 11 + i * Math.PI, rr = R * grow * 0.9;            // minus: the other way round
    c.strokeStyle = rgba(i === 0 ? '#3B6FE0' : '#FFFDF4', 0.85 * grow); c.lineWidth = 11;
    c.beginPath(); c.ellipse(h.x, h.y - 6, rr, rr * 0.52, 0, a0 - 0.8, a0); c.stroke();         // the ribbon behind each glove
    drawGlove(c, h.x + Math.cos(a0) * rr, h.y - 6 + Math.sin(a0) * rr * 0.52, 20 * grow, Math.cos(a0) >= 0 ? 1 : -1, t);
  }
}
/* The trail of a running hero: three fading copies of him, and six speed lines behind.
   Every copy is painted ONCE, into a small canvas of its own, when it appears (every 0.04 s), and then only
   drawn with drawImage: 3 drawImage per hero (S7.7), not three more heroes painted on every frame. */
const GHOST_W = 300, GHOST_H = 230, GHOST_OX = 150, GHOST_OY = 190, GHOST_RES = 1.25;   // the box of a hero around his feet, and how sharp
function ghostCanvas(h, g) {
  if (!h.ghostCv.length) for (let i = 0; i < 4; i++) h.ghostCv.push(makeCanvas(GHOST_W * GHOST_RES, GHOST_H * GHOST_RES));   // 4: one more than can be on screen
  const cv = h.ghostCv[h.ghostNo++ % 4], c = cv.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.setTransform(GHOST_RES, 0, 0, GHOST_RES, 0, 0);
  drawHero(c, h.k, GHOST_OX, GHOST_OY, Object.assign(heroOpts(h), { face: g.face, walk: g.walk, z: g.z }));
  return cv;
}
function drawRunTrail(c, h) {
  const cfg = CONFIG.heroes[h.k], al = [0.28, 0.18, 0.09];
  for (let i = 0; i < h.ghosts.length; i++) {
    const g = h.ghosts[i];
    if (!g.cv) g.cv = ghostCanvas(h, g);
    c.globalAlpha = al[i] || 0.08;
    c.save(); c.translate(g.x, g.y); c.rotate(0.14 * g.face);
    c.drawImage(g.cv, -GHOST_OX, -GHOST_OY, GHOST_W, GHOST_H);
    c.restore();
  }
  c.globalAlpha = 1;
  const v = Math.hypot(h.vx, h.vy); if (v < 60) return;
  const ux = -h.vx / v, uy = -h.vy / v, t = P.time;
  c.strokeStyle = rgba(mix(cfg.color, '#FFF6E2', 0.65), 0.5); c.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const ph = (t * 3.4 + i * 0.37) % 1, len = 60 + ((i * 37) % 61), off = ((i * 29) % 70) - 35;
    const bx = h.x + ux * (26 + ph * 40) - uy * off, by = h.y - 44 + uy * (26 + ph * 40) + ux * off * 0.5;
    c.globalAlpha = 0.5 * Math.sin(ph * Math.PI); c.lineWidth = 3 + (i % 2);
    c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + ux * len, by + uy * len); c.stroke();
  }
  c.globalAlpha = 1;
}
function drawHeroFull(c, h) {
  const cfg = CONFIG.heroes[h.k], fr = P.heroes[1 - h.k], fcfg = CONFIG.heroes[fr.k], t = P.time, top = heroTop(h.k) * h.small;
  if (P.L.night) {                          // second game: a soft light around each hero, so they stand out in the dark jungle
    const lg = c.createRadialGradient(h.x, h.y - 44, 12, h.x, h.y - 44, 170); lg.addColorStop(0, 'rgba(255,250,228,0.36)'); lg.addColorStop(0.5, rgba(cfg.color, 0.12)); lg.addColorStop(1, 'rgba(255,250,228,0)');
    c.fillStyle = lg; c.beginPath(); c.arc(h.x, h.y - 44, 170, 0, TAU); c.fill();
  }
  // colored ground ring so each player finds their hero at a glance
  c.lineWidth = 6; c.strokeStyle = rgba(cfg.color, 0.85); c.beginPath(); c.ellipse(h.x, h.y + 2, 44, 17, 0, 0, TAU); c.stroke();
  if (h.k === 1) { c.lineWidth = 3; c.strokeStyle = rgba(cfg.color2, 0.85); c.beginPath(); c.ellipse(h.x, h.y + 2, 37, 13, 0, 0, TAU); c.stroke(); }
  castShadow(c, h.x, h.y + 2, 70 * h.small, 50 * h.small, 11 + h.k, clamp(1 - h.z / 300, 0.35, 1));   // the cast shadow of S7.1 (smaller and paler in the air)
  if (h.down) {                            // hit: waits for the friend. A ring in the friend's color pulses around the hero.
    const pu = 0.5 + 0.5 * Math.sin(t * 6);
    if (fr.k === 0) { c.fillStyle = rgba(fcfg.color, 0.1 + pu * 0.06); c.beginPath(); c.ellipse(h.x, h.y, CONFIG.rescue.reachNear, CONFIG.rescue.reachNear * 0.6, 0, 0, TAU); c.fill(); }   // the first hero must step into this circle
    c.strokeStyle = rgba(fcfg.color, 0.55 + pu * 0.4); c.lineWidth = 7; c.setLineDash([14, 10]); c.lineDashOffset = -t * 30;
    c.beginPath(); c.ellipse(h.x, h.y + 2, 64 + pu * 8, 27 + pu * 3, 0, 0, TAU); c.stroke(); c.setLineDash([]);
  }
  if (h.boost > 0) { const g = c.createRadialGradient(h.x, h.y - 40, 10, h.x, h.y - 40, 110); g.addColorStop(0, 'rgba(255,214,140,0.5)'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.beginPath(); c.arc(h.x, h.y - 40, 110, 0, TAU); c.fill(); }
  if (h.safe) { c.strokeStyle = rgba('#7FB06A', 0.9); c.lineWidth = 5; c.setLineDash([12, 9]); c.beginPath(); c.ellipse(h.x, h.y + 2, 58, 24, 0, 0, TAU); c.stroke(); c.setLineDash([]); }
  if (h.spinT >= 0) { if (h.spinLook === 'gloves') drawGloveRing(c, h); else drawClawRing(c, h); }
  if (h.run) drawRunTrail(c, h);           // running: three ghosts behind, then the speed lines
  if (h.inv > 0 && h.dizzy <= 0) c.globalAlpha = 0.55 + Math.sin(P.time * 22) * 0.25;
  if (h.run) { c.save(); c.translate(h.x, h.y); c.rotate(0.14 * h.face); c.translate(-h.x, -h.y); }      // leaning into the run
  drawHero(c, h.k, h.x, h.y, heroOpts(h));
  if (h.run) c.restore();
  c.globalAlpha = 1;
  if (h.carried) return;
  if (h.dizzy > 0) drawDizzyStars(c, h.x + (h.k === 0 && !isLupta() ? 30 * h.face : 0), h.y - top, P.time);
  if (h.down) {                            // ○ and a dot in the friend's color: "friend, press ○ for me"
    const by = h.y - top - 52 + Math.sin(t * 5) * 5;
    if (h.downLeft > 0) drawDownRing(c, h, by);        // the ten seconds: the beads and the number
    iconO(c, h.x + (h.downLeft > 0 ? 44 : 0), by, 28, Math.sin(t * 6));
    c.fillStyle = fcfg.color; c.beginPath(); c.arc(h.x + (h.downLeft > 0 ? 74 : 30), by - 24, 12, 0, TAU); c.fill(); c.strokeStyle = '#FFF8E8'; c.lineWidth = 3.5; c.stroke();
  } else if (fr.down && Input.slots[h.k].joined && h.dizzy <= 0) {    // the helper: close enough = a big ○ over the head
    const reach = h.k === 0 ? CONFIG.rescue.reachNear : CONFIG.rescue.reachFar;
    if (dist(h.x, h.y, fr.x, fr.y) <= reach) iconO(c, h.x, h.y - top - 44 + Math.sin(t * 7) * 6, 34, Math.sin(t * 9) * 1.5);
  }
  if (hasAbil(h.k, 'throw') && throwReady(h) && h.dizzy <= 0) {       // aim arrow, grows while charging
    const pw = h.charging ? h.charge : 0, len = 62 + pw * 70;
    iconArrow(c, h.x + h.ax * len, h.y - 14 + h.ay * len * 0.8, Math.atan2(h.ay, h.ax), 13 + pw * 13, pw > 0.95 ? '#E9703C' : mix('#F6C63C', '#E9703C', pw));
    if (h.charging) { c.strokeStyle = rgba(abil(h.k, 'throw').look === 'bone' ? '#2FBFA8' : isLupta() ? '#E4583C' : '#3F78C8', 0.8); c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(h.x, h.y - top - 8, 17, -Math.PI / 2, -Math.PI / 2 + TAU * pw); c.stroke(); }
  }
  if (h.tagT > 0) {                        // the name of the hero: never written over the friend, and the two names never over each other
    let nx = h.x, ny = h.y - top - 18;
    const fy = fr.y - heroTop(fr.k) * fr.small - 18;
    if (h.k === 1 && fr.tagT > 0 && Math.abs(fr.x - h.x) < 150 && Math.abs(fy - ny) < 38) nx += h.x >= fr.x ? 70 : -70;     // the second name steps aside
    if (heroInWay(nx, ny, 160, 40, fr.k)) ny = Math.max(ny - 46, h.y - HERO_BOX + 22);                                      // never higher than the camera keeps free
    if (!heroInWay(nx, ny, 160, 40, fr.k)) text(c, cfg.name, nx, ny, 34, shade(cfg.color, -0.35), { title: true });
  }
}
/* Small enemies show how many hits they still take, once they were hit. */
function drawSmallHp(c, e, x, y) {
  const n = CONFIG.smallEnemy.hits; if (e.hp == null || e.hp >= n || e.hp <= 0) return;
  for (let i = 0; i < n; i++) { heartPath(c, x + (i - (n - 1) / 2) * 20, y, 7); if (i < e.hp) { c.fillStyle = '#E2574C'; c.fill(); c.strokeStyle = 'rgba(255,246,226,0.9)'; c.lineWidth = 2; c.stroke(); } else { c.fillStyle = 'rgba(120,90,100,0.35)'; c.fill(); } }
}
function drawBossTargets(c) {
  const bs = P.boss, L = P.L, t = P.time, pulse = 0.5 + 0.5 * Math.sin(t * 5);
  if (bs.state === 'up') {
    const tb = L.treeBase; c.strokeStyle = rgba(CONFIG.heroes[0].color, 0.35 + pulse * 0.35); c.lineWidth = 10; c.setLineDash([26, 20]);
    c.beginPath(); c.ellipse(tb.x, tb.y + 40, 330 + pulse * 10, 150 + pulse * 5, 0, 0, Math.PI); c.stroke(); c.setLineDash([]);
  } else if (bs.state === 'down') {
    const g = bossGoal();                   // where the ball must go: the nest in the tree, or George himself
    c.strokeStyle = rgba(CONFIG.heroes[1].color, 0.6 + pulse * 0.4); c.lineWidth = 12; c.beginPath(); c.arc(g.x, g.y, g.r + 10 + pulse * 14, 0, TAU); c.stroke();
    c.strokeStyle = rgba(CONFIG.heroes[1].color2, 0.8); c.lineWidth = 5; c.beginPath(); c.arc(g.x, g.y, g.r - 8 + pulse * 10, 0, TAU); c.stroke();
  }
  for (const r of bs.rings) { const u = r.t / 0.8, rad = CONFIG.boss.roarRadius * easeOut(u); for (let i = 0; i < 3; i++) { c.strokeStyle = rgba(RAINBOW[(i * 2) % 7], (1 - u) * 0.6); c.lineWidth = 14 * (1 - u) + 3; c.beginPath(); c.ellipse(L.treeBase.x, L.treeBase.y + 40, rad * (1 - i * 0.12), rad * 0.5 * (1 - i * 0.12), 0, 0, TAU); c.stroke(); } }
  drawProjWarn(c, bs.proj);
}
function drawProjWarn(c, list) {            // the spot where a thrown pinecone will land
  for (const p of list) {
    if (p.t < 0) continue; const u = p.t / p.dur;
    c.fillStyle = rgba(SHADOW, 0.18 + u * 0.22); c.beginPath(); c.ellipse(p.tx, p.ty, 26 + u * 40, (26 + u * 40) * 0.45, 0, 0, TAU); c.fill();
    c.strokeStyle = rgba('#D9463C', 0.3 + u * 0.5); c.lineWidth = 5; c.beginPath(); c.ellipse(p.tx, p.ty, 66, 30, 0, 0, TAU); c.stroke();
  }
}
function drawProjs(c, list) {
  for (const p of list) {
    if (p.t < 0) continue; const u = p.t / p.dur, x = lerp(p.sx, p.tx, u), y = lerp(p.sy, p.ty, u) - Math.sin(u * Math.PI) * 260 + 26;
    if (p.kind === 'rock') drawRockProj(c, x, y, p.rot, 24);
    else if (p.kind === 'spear') drawSpear(c, x, y - 26, Math.atan2((p.ty - p.sy) - Math.cos(u * Math.PI) * 260 * Math.PI, p.tx - p.sx), 1);
    else drawCone(c, x, y, p.rot, 24, 0);
  }
}

function drawWorld(c) {
  const L = P.L, cam = P.cam, z = cam.zoom * kickZoom(), vw = W / z, vh = H / z, t = P.time;      // kickZoom: the camera comes closer at a big hit (T6.9)
  let l = cam.x - vw / 2, tp = cam.y - vh / 2;
  if (P.shake > 0) { l += Math.sin(t * 90) * P.shake * 22; tp += Math.cos(t * 77) * P.shake * 22; }
  const tpMin = -(HUD_TOP + 20) / z;         // the camera may look above the top edge of the world, so no hero hides under the band
  l = clamp(l, 0, L.W - vw); tp = clamp(tp, tpMin, Math.max(tpMin, L.H - vh));
  if (tp < 0) { c.fillStyle = L.skyTop || '#CFE4F2'; c.fillRect(0, 0, W, Math.ceil(-tp * z) + 1); }      // that strip has no painting: it is sky
  c.drawImage(L.bg, l, tp, vw, vh, 0, 0, W, H);
  c.save(); c.scale(z, z); c.translate(-l, -tp);
  // water: in the new levels two rows of waves and sparkles (drawWater), elsewhere the old shimmer
  if (L.water && CONFIG.look.waves) drawWater(c, L, t, l, tp, vw, vh);
  else if (L.waterCells.length) {
    WaterCount.waves = WaterCount.spark = 0;
    c.strokeStyle = 'rgba(250,255,246,0.55)'; c.lineWidth = 2.5; c.lineCap = 'round';
    for (let i = 0; i < 46; i++) {
      const a = Math.sin(t * 1.4 + i * 1.7); if (a < 0.2) continue;
      const wc = L.waterCells[(i * 53) % L.waterCells.length], x = (wc % L.cols + 0.5) * CS + Math.sin(t * 0.6 + i) * 10, y = ((wc / L.cols | 0) + 0.5) * CS;
      c.globalAlpha = a * 0.8; c.beginPath(); c.moveTo(x - 14, y); c.quadraticCurveTo(x, y - 5, x + 14, y); c.stroke();
    }
    c.globalAlpha = 1;
  }
  if (L.cave && L.cave.reveal < 0.99) { c.globalAlpha = 1 - L.cave.reveal * 0.96; c.drawImage(L.coverCv, L.cover.x, L.cover.y); c.globalAlpha = 1; }
  if (P.nestOpen && !L.boss) { const gl = 0.6 + 0.4 * Math.sin(t * 4); const g = c.createRadialGradient(L.nest.x, L.nest.y, 40, L.nest.x, L.nest.y, 260); g.addColorStop(0, 'rgba(255,226,140,' + 0.55 * gl + ')'); g.addColorStop(1, 'rgba(255,226,140,0)'); c.fillStyle = g; c.beginPath(); c.arc(L.nest.x, L.nest.y, 260, 0, TAU); c.fill(); }
  if (L.arena) drawArenaBack(c);
  for (const r of P.rings) {
    const u = r.t / 0.55, rad = r.max * easeOut(u);
    blobPath(c, r.x, r.y, rad, rad * 0.5, 3, 0.04, 16); c.strokeStyle = rgba(CONFIG.heroes[0].color, (1 - u) * 0.7); c.lineWidth = 14 * (1 - u) + 3; c.stroke();
    blobPath(c, r.x, r.y, rad * 0.8, rad * 0.4, 4, 0.04, 16); c.strokeStyle = rgba('#FFF3C0', (1 - u) * 0.6); c.lineWidth = 6 * (1 - u) + 1; c.stroke();
  }
  if (L.arena) { drawThrone(c); drawBossTargets(c); }
  else if (L.boss) {
    const bs = P.boss, sh = Math.sin(t * 38) * bs.treeShake * 0.022;
    c.save(); c.translate(L.treeBase.x, 600); c.rotate(sh); c.drawImage(L.treeCv, L.treeOff.x - L.treeBase.x, L.treeOff.y - 600); c.restore();
    c.save(); c.translate(L.nest.x + Math.sin(t * 38) * bs.treeShake * 9, L.nest.y); drawNest(c, 0, 0, 108, 31, 0);
    const ne = Math.max(0, Math.round(9 * (1 - bs.phase / CONFIG.boss.hits))); for (let i = 0; i < ne; i++) { c.save(); c.translate(-44 + (i % 5) * 22, -6 + (i / 5 | 0) * 16); const g = c.createRadialGradient(-3, -6, 1, 0, 0, 16); g.addColorStop(0, '#FFF6C4'); g.addColorStop(1, '#E9A93A'); eggPath(c, 11); c.fillStyle = g; c.fill(); c.restore(); }
    c.restore();
    drawBossTargets(c);
  }
  drawDecor(c, l, tp, vw, vh);
  drawNestShelter(c);
  if (P.duel) drawDuelGround(c);
  for (const g of P.gifts) { c.fillStyle = rgba(SHADOW, 0.18); c.beginPath(); c.ellipse(g.x, g.y + 50, 12, 5, 0, 0, TAU); c.fill(); }        // eggs in flight (L1)
  // eggs and stars lie on the ground
  for (const e of P.eggs) if (e.delay <= 0) {
    if (e.big && L.cave) { if (L.cave.reveal < 0.05) continue; c.globalAlpha = L.cave.reveal; }   // the secret stays a secret
    drawEgg(c, e.x, e.y, e.r, t, e.seed, e.z, e.hue, e.big); c.globalAlpha = 1;
  }
  for (const g of P.gifts) drawEgg(c, g.x, g.y + 50, 17, t, g.seed, 50 + g.z, (g.seed | 0) % 7, false);      // the same painted egg, in the air
  for (const s of P.stars) if (!s.got && !s.hidden) drawStar(c, s.x, s.y, 26, t, s.z);
  drawGuides(c);
  // everything that stands up, sorted by depth
  _sorted.length = 0;
  for (const h of P.heroes) _sorted.push({ y: h.y, k: 0, o: h });
  for (const b of L.beetles) if (b.state !== 'dead') _sorted.push({ y: b.y, k: 1, o: b });
  if (L.soldiers) for (const so of L.soldiers) _sorted.push({ y: so.y, k: 7, o: so });
  for (const cn of L.cones) if (cn.state !== 'gone') _sorted.push({ y: cn.y, k: 2, o: cn });
  for (const s of L.sprites) _sorted.push({ y: s.y, k: 3, o: s });
  for (const f of P.flock) _sorted.push({ y: f.y, k: 4, o: f });        // every ball in the air
  if (P.boss) _sorted.push({ y: P.boss.state === 'up' ? 0 : P.boss.y, k: 5, o: P.boss });
  if (P.duel && !P.duel.over && P.duel.z < 70) _sorted.push({ y: P.duel.y, k: 6, o: P.duel });
  _sorted.sort((a, b) => a.y - b.y);
  for (const it of _sorted) {
    const o = it.o;
    if (it.k === 0) {
      drawHeroFull(c, o);
      if (hasAbil(o.k, 'throw') && o.homeState === 'held' && !o.down) {       // what he keeps at hand: Leo's and Killer's ball at the feet, Boon's bone on his shoulder
        const b = o.home, look = abil(o.k, 'throw').look;
        if (look === 'bone') drawThrown(c, b.x, b.y, 15, b.spin, 'bone');
        else { c.fillStyle = rgba(SHADOW, 0.2); c.beginPath(); c.ellipse(b.x, b.y + 3, 13, 5, 0, 0, TAU); c.fill(); drawThrown(c, b.x, b.y - 13 - (b.z || 0), 14, b.spin, look); }
      }
    }
    else if (it.k === 1) {                 // beetles (robots in the second game): they blink when hit and pop up when a new one arrives
      if (o.flash > 0 && Math.sin(t * 45) > 0) c.globalAlpha = 0.45;
      if (o.born > 0) { const k = 1 - o.born / 0.5; c.save(); c.translate(o.x, o.y); c.scale(k, k); c.translate(-o.x, -o.y); drawSleeper(c, o, t); c.restore(); } else drawSleeper(c, o, t);
      c.globalAlpha = 1; if (o.state === 'stun') drawDizzyStars(c, o.x, o.y - 52, t); drawSmallHp(c, o, o.x, o.y - 78);
    }
    else if (it.k === 2) {                 // pinecones (sticky snails in the second game)
      c.globalAlpha = (o.fade == null ? 1 : o.fade) * (o.flash > 0 && Math.sin(t * 45) > 0 ? 0.45 : 1);
      drawRoller(c, o, o.x + (o.state === 'stun' ? Math.sin(t * 30) * 2 : 0), o.y, t); c.globalAlpha = 1;
      if (o.state === 'stun') drawDizzyStars(c, o.x, o.y - 66, t); drawSmallHp(c, o, o.x, o.y - 84);
    }
    else if (it.k === 7) drawSoldier(c, o, t);
    else if (it.k === 3) {
      const r = o.ref;
      // a hero standing behind a tree or a windmill stays visible
      const hw = o.kind === 'tree' ? r.R : 70, hh = o.kind === 'tree' ? r.R * 2.3 : 270;
      for (const h of P.heroes) if (h.y < o.y && h.y > o.y - hh - 40 && Math.abs(h.x - r.x) < hw + 30) c.globalAlpha = 0.4;
      if (o.kind === 'tree') {
        const sh = Math.sin(t * 34) * r.shake * 0.07, w = r.sprite.width;
        c.save(); c.translate(r.x, r.y + r.R * 1.1); c.rotate(sh); c.drawImage(r.sprite, -w / 2, -r.R * 2.45); c.restore();
        if (r.starTree && r.starTree.hidden) { c.globalAlpha *= 0.55 + 0.35 * Math.sin(t * 3); c.fillStyle = '#FFE9C8'; starPath(c, r.x + r.R * 0.2, r.y - r.R * 0.25, 15, t * 0.5); c.fill(); }
      } else { c.drawImage(r.sprite, r.x - 80, r.y - 280); if (L.night) drawPinwheel(c, r.x, r.y - 206, r.ang); else drawMillBlades(c, r.x, r.y - 202, r.ang); }      // second game: a totem with a rainbow pinwheel
      c.globalAlpha = 1;
    }
    else if (it.k === 4) {
      const zk = 1 - Math.min(0.5, (o.z || 0) / 90);
      if (o.look === 'bone' && o.trail && o.trail.length > 3) {       // the turquoise arc a bone leaves behind, like a boomerang
        c.lineCap = 'round'; c.lineJoin = 'round';
        for (const w of [[13, 'rgba(47,191,168,0.55)'], [5, 'rgba(214,247,240,0.55)']]) {      // a turquoise arc with a pale core, like a boomerang
          c.strokeStyle = w[1]; c.lineWidth = w[0];
          c.beginPath(); c.moveTo(o.trail[0], o.trail[1] - 16);
          for (let i = 2; i < o.trail.length; i += 2) c.lineTo(o.trail[i], o.trail[i + 1] - 16);
          c.stroke();
        }
      }
      c.fillStyle = rgba(SHADOW, 0.22 * zk); c.beginPath(); c.ellipse(o.x - 3, o.y + 4, 14 * zk, 6 * zk, 0, 0, TAU); c.fill();
      drawThrown(c, o.x, o.y - 16 - (o.z || 0), o.r, o.spin, o.look);
    }
    else if (it.k === 6) drawDuelBoss(c);
    else if (it.k === 5 && L.arena) drawGeorgeBoss(c, o, t);
    else if (it.k === 5) {
      const mood = o.state === 'won' ? 'sorry' : (o.state === 'down' || o.state === 'falling') ? 'dizzy' : 'cheeky';
      const fly = o.state === 'rising' || (o.state === 'won' && o.t < 1.6);
      if (o.state !== 'up') { c.fillStyle = rgba(SHADOW, 0.2); c.beginPath(); c.ellipse(o.x, (o.state === 'down' || o.state === 'won') ? o.y + 4 : 660, 40, 14, 0, 0, TAU); c.fill(); }
      c.save(); c.translate(o.x + (o.state === 'up' ? Math.sin(t * 38) * o.treeShake * 9 : 0), o.y + (o.state === 'up' ? -4 + Math.sin(t * 3) * 3 : 0));
      if (o.state === 'falling') c.rotate(o.t * 9);
      drawCiori(c, 0, o.state === 'falling' ? 30 : 0, { scale: 1.5, t: t, face: o.state === 'won' ? 1 : (P.heroes[0].x < o.x ? -1 : 1), fly, mood });
      c.restore();
      if (o.state === 'down') drawDizzyStars(c, o.x + 10, o.y - 128, t);
    }
  }
  if (P.boss) drawProjs(c, P.boss.proj);
  // the magic ball on its way to a friend who waits for help
  for (const q of P.heal) {
    const g = c.createRadialGradient(q.x, q.y, 3, q.x, q.y, 46); g.addColorStop(0, 'rgba(255,240,190,0.9)'); g.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(q.x, q.y, 46, 0, TAU); c.fill();
    drawBall(c, q.x, q.y, 14, q.spin); heartPath(c, q.x, q.y - 26, 8); c.fillStyle = '#F29C9C'; c.fill();
  }
  // big birds (second game): the shadow on the ground is where they can grab
  if (L.birds) for (const bd of L.birds) if (bd.state === 'fly') {
    c.fillStyle = rgba(SHADOW, 0.26); c.beginPath(); c.ellipse(bd.x, bd.y + 4, 50, 17, 0, 0, TAU); c.fill();
    if (!bd.grab && bd.rest <= 0) { c.strokeStyle = rgba('#D9463C', 0.35 + 0.25 * Math.sin(t * 9)); c.lineWidth = 4; c.setLineDash([10, 8]); c.beginPath(); c.ellipse(bd.x, bd.y + 4, 62, 24, 0, 0, TAU); c.stroke(); c.setLineDash([]); }
    if (bd.flash > 0 && Math.sin(t * 45) > 0) c.globalAlpha = 0.45;
    drawBird(c, bd.x, bd.y - 190, { t: bd.wing, face: bd.dir, grab: !!bd.grab }); c.globalAlpha = 1;
    drawSmallHp(c, bd, bd.x, bd.y - 290);
  }
  // lantern glows
  for (const ln of L.lanterns) if (ln.lit > 0) {
    const fl = ln.lit * (0.85 + Math.sin(t * 7 + ln.x) * 0.1), g = c.createRadialGradient(ln.x + 20, ln.y - 76, 4, ln.x + 20, ln.y - 76, 130);
    g.addColorStop(0, 'rgba(255,232,170,' + 0.8 * fl + ')'); g.addColorStop(0.35, 'rgba(255,200,120,' + 0.3 * fl + ')'); g.addColorStop(1, 'rgba(255,190,110,0)');
    c.fillStyle = g; c.beginPath(); c.arc(ln.x + 20, ln.y - 76, 130, 0, TAU); c.fill();
  }
  // the waterfall falls in front of the heroes: there is room to walk behind it
  if (L.fall) {
    const f = L.fall, len = f.y1 - f.y0;
    c.fillStyle = 'rgba(206,232,224,0.5)'; c.fillRect(f.x - f.w / 2, f.y0, f.w, len);
    c.lineCap = 'round';
    for (let i = 0; i < 40; i++) {
      const x = f.x - f.w / 2 + 8 + hash(i, 1) * (f.w - 16), sp = 420 + hash(i, 2) * 300, sl = 60 + hash(i, 3) * 90, y = f.y0 + ((t * sp + hash(i, 4) * len) % (len + sl)) - sl;
      c.strokeStyle = 'rgba(250,255,250,' + (0.35 + hash(i, 5) * 0.4) + ')'; c.lineWidth = 4 + hash(i, 6) * 7;
      c.beginPath(); c.moveTo(x, Math.max(f.y0, y)); c.lineTo(x, Math.min(f.y1, y + sl)); c.stroke();
    }
    for (let i = 0; i < 9; i++) { const x = f.x - f.w / 2 + i * f.w / 8; c.fillStyle = 'rgba(250,255,250,0.75)'; c.beginPath(); c.arc(x, f.y1 + Math.sin(t * 5 + i * 1.3) * 5, 22 + Math.sin(t * 3 + i) * 5, 0, TAU); c.fill(); }
  }
  if (P.crow && isLupta()) { const cr = P.crow, u = cr.t / 3.2, bx = l + u * (vw + 400) - 200, by = tp + vh * 0.22 + Math.sin(u * 9) * 30; drawBird(c, bx, by, { t: t, face: 1, scale: 0.9 / z, spy: true }); drawEgg(c, bx, by + 70 / z, 15 / z, t, 3, 0, (t * 3 | 0) % 7); }
  else if (P.crow) { const cr = P.crow, u = cr.t / 3.2; drawCiori(c, l + u * (vw + 400) - 200, tp + vh * 0.22 + Math.sin(u * 9) * 30, { scale: 1.2 / z, t: t, fly: true, face: 1 }); if (Math.random() < 0.5) part(l + u * (vw + 400) - 200, tp + vh * 0.22, { vy: 140, vx: (Math.random() - 0.5) * 50, life: 1.1, max: 1.1, size: 7, kind: 'spark' }); }
  if (P.bfly) drawButterfly(c, P.bfly.x, P.bfly.y - 50, t, 1.15);
  if (P.duel) drawDuelTop(c);
  drawParts(c);
  if (P.boss && P.boss.state === 'won' && P.boss.t > 1.6) {       // Ciori says sorry (George runs away)
    const bx = 960, by = L.arena ? 470 : 250;
    card(c, bx - 430, by - 80, 860, 150, '#FFF6E2', 5);
    text(c, T('sorry1'), bx, by - 32, 42, '#5F4E80', { halo: 0 }); text(c, T('sorry2'), bx, by + 22, 42, '#5F4E80', { halo: 0 });
  }
  c.restore();      // "we wait for X in the nest" used to be written here, over the nest: it is a banner now (waitBanner)
  // wind streaks in screen space
  if (P.wind.power > 0.04) {
    c.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const sp = 900 + hash(i, 7) * 700, len = 90 + hash(i, 8) * 160;
      let x = (hash(i, 9) * (W + 400) + t * sp * P.wind.dir) % (W + 400); if (x < 0) x += W + 400; x -= 200;
      const y = hash(i, 10) * H + Math.sin(t * 2 + i) * 14;
      c.strokeStyle = 'rgba(255,250,236,' + Math.min(0.5, P.wind.power * 0.5) + ')'; c.lineWidth = 3 + hash(i, 11) * 4;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + len * 0.5 * P.wind.dir, y - 8, x + len * P.wind.dir, y + 3); c.stroke();
    }
  }
  return { l, tp, z };
}

function hintTarget() {
  const L = P.L; if (P.done || L.boss || (P.duel && !P.duel.over)) return null;
  if (P.nestOpen) return { x: L.nest.x, y: L.nest.y - 60 };
  if (P.sinceEgg < CONFIG.hintAfter && P.time < levelDurationOf(L)) return null;
  const mx = (P.heroes[0].x + P.heroes[1].x) / 2, my = (P.heroes[0].y + P.heroes[1].y) / 2; let best = null, bd = 1e9;
  for (const e of P.eggs) if (e.req && e.delay <= 0) { const d = dist(mx, my, e.x, e.y); if (d < bd) { bd = d; best = { x: e.x, y: e.y - 50 }; } }
  for (const t of L.dynTrees) if (t.spark && t.spark.active && !t.spark.done) { const d = dist(mx, my, t.x, t.y); if (d < bd) { bd = d; best = { x: t.x, y: t.y - t.R - 30 }; } }
  return best;
}
/* The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. */
function nearestEgg(h, reqOnly, maxD) {
  let best = null, bd = maxD || 1e9;
  for (const e of P.eggs) { if (e.big || e.delay > 0.4 || (reqOnly && !e.req)) continue; const d = dist(h.x, h.y, e.x, e.y); if (d < bd) { bd = d; best = { x: e.x, y: e.y, kind: 'egg' }; } }
  return best;
}
function guideTarget(h) {
  const L = P.L, o = P.heroes[1 - h.k];
  if (P.done) return null;
  if (L.boss) {
    const bs = P.boss; if (bs.state === 'won') return null;
    if (h.k === 0 && bs.state === 'up') return { x: L.treeBase.x + (h.x < L.treeBase.x ? -210 : 210), y: L.treeBase.y + 150, kind: 'x' };
    if (h.k === 1 && bs.state === 'down') { const g = bossGoal(); return L.arena ? { x: g.x, y: g.y + 50, kind: 'ball' } : { x: L.nest.x, y: L.nest.y + 60, kind: 'ball' }; }
    return nearestEgg(h, false);
  }
  if (quotaOn() && bothJoined() && P.found[h.k] >= P.cap) {          // a full hero takes no more eggs: he goes to the friend who still needs some, or to the nest
    if (!quotaOk(1 - h.k)) return { x: o.x, y: o.y, kind: 'give' };
    return P.nestOpen ? { x: L.nest.x, y: L.nest.y, kind: 'nest' } : null;
  }
  if (P.nestOpen) return nearestEgg(h, false, 700) || { x: L.nest.x, y: L.nest.y, kind: 'nest' };
  if (P.duel && !P.duel.over) {
    const d = P.duel, helper = rank(h.k) === 0 && Input.slots[o.k].joined && rank(o.k) > 0;     // the little one helps: eggs first, then the shelter
    if (helper) return nearestEgg(h, false, 750) || (h.safe ? null : { x: L.nest.x, y: L.nest.y, kind: 'nest' });
    if (d.state === 'enter' || d.state === 'flee') return null;
    return { x: d.x, y: d.y, kind: duelCanHurt(h.k, h.k ? 'ball' : 'stomp') ? (h.k ? 'ball' : 'x') : 'wait' };
  }
  const e = nearestEgg(h, true); if (e) return e;
  let best = null, bd = 1e9;
  for (const t of L.dynTrees) if (t.spark && t.spark.active && !t.spark.done) { const dd = dist(h.x, h.y, t.cx, t.cy); if (dd < bd) { bd = dd; best = { x: t.cx, y: t.cy, kind: h.k ? 'ball' : 'x' }; } }
  return best;
}
function drawGuides(c) {
  const t = P.time;
  for (const h of P.heroes) {
    const fr = P.heroes[1 - h.k], help = fr.down && !h.down && Input.slots[h.k].joined;      // a friend who waits for help: the arrow shows the way to them, for every player
    if (!help && (!Opt.guide[h.k] || !Input.slots[h.k].joined || h.dizzy > 0 || h.carried)) continue;
    const g = help ? { x: fr.x, y: fr.y, kind: 'help' } : guideTarget(h); if (!g) continue;
    const dx = g.x - h.x, dy = g.y - h.y, m = Math.hypot(dx, dy); if (m < (help ? (h.k === 0 ? CONFIG.rescue.reachNear : CONFIG.rescue.reachFar) : 130)) continue;
    const ux = dx / m, uy = dy / m, ang = Math.atan2(uy, ux), col = CONFIG.heroes[h.k].color, fade = clamp((m - 130) / 90, 0, 1);
    for (let i = 0; i < 3; i++) {                        // three chevrons run toward the goal
      const u = (t * 1.1 + i / 3) % 1, r = 64 + u * 62;
      c.globalAlpha = 0.55 * fade * Math.sin(u * Math.PI);
      iconArrow(c, h.x + ux * r, h.y - 6 + uy * r, ang, 19, col);
    }
    if (m > 230) {
      const ix = h.x + ux * 172, iy = h.y - 6 + uy * 172;
      c.globalAlpha = 0.68 * fade;
      soft(c, ix, iy, 31, 31, '#FFF6E2', 0.9, 7);
      if (g.kind === 'egg') drawEgg(c, ix, iy + 14, 12, 0, 1, 0, 4);
      else if (g.kind === 'nest') c.drawImage(sprite('gNest', 56, 44, cc => drawNest(cc, 28, 22, 21, 3, 0)), ix - 28, iy - 22, 56, 44);
      else if (g.kind === 'x') iconX(c, ix, iy, 16, 0);
      else if (g.kind === 'help') iconO(c, ix, iy, 18, Math.sin(t * 8));
      else if (g.kind === 'give') iconL1(c, ix, iy, 18, Math.sin(t * 8));
      else if (g.kind === 'ball') drawBall(c, ix, iy, 14, t * 2);
      else text(c, '!', ix, iy + 2, 40, '#D9463C', { halo: 0, shadow: 0, weight: 'bold' });
    }
    c.globalAlpha = 1;
  }
}
function drawHints(c, v) {
  const t = P.time, L = P.L, tg = hintTarget();
  if (tg) {
    const sx = (tg.x - v.l) * v.z, sy = (tg.y - v.tp) * v.z, m = 90, hm = HUD_TOP + 50;      // hm: the arrow stays under the band at the top
    if (sx > m && sx < W - m && sy > hm && sy < H - m) iconArrow(c, sx, sy - 30 + Math.sin(t * 6) * 10, Math.PI / 2, 30, '#F8C24E');
    else { const cx = clamp(sx, m, W - m), cy = clamp(sy, hm + 20, H - m); iconArrow(c, cx + Math.sin(t * 6) * 6, cy, Math.atan2(sy - cy, sx - cx), 38, '#F8C24E'); }
  }
  // first steps: stick, then ✕, shown above each hero
  if (L.idx === 0 || L.boss) for (const h of P.heroes) {
    const tu = P.tut[h.k]; if (!Input.slots[h.k].joined || (tu.moved > 0.8 && tu.used) || P.time > 90) continue;
    if (L.boss && (tu.used || P.time > 12)) continue;
    const sx = (h.x - v.l) * v.z, sy = Math.max(HUD_TOP + 30, (h.y - v.tp) * v.z - (h.tagT > 0 ? 200 : 160) * v.z) + Math.sin(t * 5) * 5;      // never over the band at the top
    if (tu.moved <= 0.8 && !L.boss) iconStick(c, sx, sy, 28, t); else iconX(c, sx, sy, 30, Math.sin(t * 6));
  }
  // running: L3 over each hero who has not run yet, the first time the two are far apart
  if (P.runHint > 0) for (const h of P.heroes) {
    if (!Input.slots[h.k].joined || P.tut[h.k].ran || h.down) continue;
    const sx = (h.x - v.l) * v.z, sy = Math.max(HUD_TOP + 44, (h.y - v.tp) * v.z - (h.tagT > 0 ? 260 : 220) * v.z) + Math.sin(t * 5) * 5;      // above the name and above the ✕ of the first steps
    c.globalAlpha = Math.min(1, P.runHint); iconL3(c, sx, sy, 26, t); c.globalAlpha = 1;
  }
  // the second power (□): over a hero who has one and has not used it yet, after he used ✕. Only on the first level
  // and on level 7 (where the story tells about the new powers), and for at most 90 seconds.
  if (P.time < 90 && (L.idx === 0 || L.idx === 6) && !L.boss) for (const h of P.heroes) {
    if (!Input.slots[h.k].joined || !CONFIG.heroes[h.k].power2 || P.tut[h.k].used2 || !P.tut[h.k].used || h.down) continue;
    const sx = (h.x - v.l) * v.z, sy = Math.max(HUD_TOP + 30, (h.y - v.tp) * v.z - (h.tagT > 0 ? 200 : 160) * v.z) + Math.sin(t * 5) * 5;
    iconSq(c, sx, sy, 24, Math.sin(t * 6));
  }
  for (const h of P.heroes) if (h.tooFarT > 0 && !h.down) {       // L1 pressed but the friend is too far: "come closer"
    const sx = (h.x - v.l) * v.z, sy = Math.max(HUD_TOP + 40, (h.y - v.tp) * v.z - 190 * v.z);
    c.globalAlpha = Math.min(1, h.tooFarT / 0.3);
    card(c, sx - 170, sy - 26, 340, 52, '#FFF6E2', 44 + h.k);
    fitText(c, T('quota.far', CONFIG.heroes[1 - h.k].name), sx, sy + 2, 28, 320, '#B9802E', { halo: 0, shadow: 0, weight: 'bold' });
    c.globalAlpha = 1;
  }
  for (const h of P.heroes) if (h.fullT > 0 && !h.down) {          // "Plin!": the hero cannot hold more quota eggs
    const sx = (h.x - v.l) * v.z, sy = Math.max(HUD_TOP + 40, (h.y - v.tp) * v.z - 190 * v.z) - (1.2 - h.fullT) * 14;
    c.globalAlpha = Math.min(1, h.fullT / 0.3);
    card(c, sx - 62, sy - 26, 124, 52, '#FFF6E2', 40 + h.k);
    text(c, T('quota.full'), sx, sy + 2, 30, '#B9802E', { halo: 0, shadow: 0, weight: 'bold' });
    c.globalAlpha = 1;
  }
  if (P.hintCharge > 0) { const h = P.heroes[1], sx = (h.x - v.l) * v.z, sy = Math.max(HUD_TOP + 30, (h.y - v.tp) * v.z - 200 * v.z - 20), u = (t * 0.9) % 1; iconX(c, sx - 24, sy, 28, 0); c.strokeStyle = '#3F78C8'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.arc(sx + 34, sy, 20, -Math.PI / 2, -Math.PI / 2 + TAU * u); c.stroke(); }
  if (P.boss) {
    const bs = P.boss, sc = v.z;
    if (bs.state === 'up' && P.time > 3) { const x = (L.treeBase.x - 250 - v.l) * sc, y = (L.treeBase.y + 10 - v.tp) * sc + Math.sin(t * 6) * 8; iconX(c, x, y, 26, Math.sin(t * 6)); iconArrow(c, x, y + 52, Math.PI / 2, 20, CONFIG.heroes[0].color); }
    if (bs.state === 'down' && L.arena) { const g = bossGoal(), x = (g.x - v.l) * sc, y = (g.y - g.r - 130 - v.tp) * sc + Math.sin(t * 6) * 8; drawBall(c, x, y - 40, 22, t * 3); iconArrow(c, x, y + 10, Math.PI / 2, 26, CONFIG.heroes[1].color); }      // George lies on the sand: the ball must hit him
    else if (bs.state === 'down') { const x = (L.nest.x - v.l) * sc, y = (L.nest.y + 200 - v.tp) * sc + Math.sin(t * 6) * 8; drawBall(c, x, y + 44, 22, t * 3); iconArrow(c, x, y - 6, -Math.PI / 2, 26, CONFIG.heroes[1].color); }
  }
}

const pressLabel = k => Opt.ctrl[k] === 'kb' ? keyName(Opt.keys[k].a) : T('t.press');
/* How far the level is: eggs in groups, then the guardian, then the nest. */
function levelProgress() {
  // the bar: wave 1, wave 2, middle fight, wave 3, nest fight, nest. Without mini-fights there are no fight segments.
  const NW = P.L.NW, on = CONFIG.duel.enabled, midSeg = on && NW >= 2 ? NW - 1 : -1, n = NW + (on ? 1 : 0) + (midSeg >= 0 ? 1 : 0) + 1;
  const seg = k => (midSeg >= 0 && k >= midSeg ? k + 1 : k);
  let cur, frac, left = 0, kind;
  if (P.done) { cur = n - 1; frac = 1; kind = 'nest'; }
  else if (P.nestOpen) { cur = n - 1; frac = 0.2; kind = 'nest'; }
  else if (P.duel && !P.duel.over) { cur = P.duel.kind === 'mid' && midSeg >= 0 ? midSeg : n - 2; frac = (P.duel.maxHp - P.duel.hp) / P.duel.maxHp; left = P.duel.hp; kind = 'duel'; }
  else { cur = clamp(seg(clamp(P.wave, 0, NW - 1)), 0, n - 1); left = Math.max(0, P.waveNeed - P.waveGot); frac = P.nextWaveT >= 0 ? 1 : clamp(P.waveGot / Math.max(1, P.waveNeed), 0, 1); kind = 'eggs';
    if (midSeg >= 0 && P.midFought && P.wave === midSeg - 1) { cur = midSeg; frac = 1; } }      // the moment after the middle fight: its part stays done
  return { n, cur, frac, left, kind, midSeg, fightSeg: on ? n - 2 : -1, u: clamp((cur + frac) / n, 0, 1) };
}
function drawProgress(c) {
  const pr = levelProgress(), t = P.time, y = 118, x0 = W / 2 - 360, x1 = W / 2 + 380, len = x1 - x0;
  P.progU = P.progU == null ? pr.u : P.progU + (pr.u - P.progU) * 0.12;
  c.fillStyle = rgba(SHADOW, 0.16); c.beginPath(); c.ellipse(W / 2 - 40, y + 11, 492, 11, 0, 0, TAU); c.fill();     // a soft shadow under the line, instead of a card
  // left: what is still to do right now
  if (pr.kind === 'eggs') { c.save(); c.translate(W / 2 - 448, y); const g = c.createRadialGradient(-2, -8, 1, 0, -5, 12); g.addColorStop(0, isLupta() ? '#E8FBFF' : '#FFF6C4'); g.addColorStop(1, isLupta() ? '#46B8D8' : '#E9A93A'); itemPath(c, 10); c.fillStyle = g; c.fill(); c.restore(); text(c, '× ' + pr.left, W / 2 - 432, y + 1, 22, '#B9702E', { align: 'left', shadow: 0, weight: 'bold' }); }
  else if (pr.kind === 'duel') { heartPath(c, W / 2 - 448, y, 8); c.fillStyle = '#E2574C'; c.fill(); text(c, '× ' + pr.left, W / 2 - 432, y + 1, 22, '#C4573D', { align: 'left', shadow: 0, weight: 'bold' }); }
  else { c.drawImage(sprite('gNest', 56, 44, cc => drawNest(cc, 28, 22, 21, 3, 0)), W / 2 - 462, y - 13, 34, 27); iconArrow(c, W / 2 - 410 + Math.sin(t * 6) * 4, y, 0, 9, '#F8C24E'); }
  // the road
  c.lineCap = 'round'; c.strokeStyle = 'rgba(190,150,130,0.32)'; c.lineWidth = 12; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
  const mx = x0 + len * P.progU;
  c.strokeStyle = '#F8C24E'; c.beginPath(); c.moveTo(x0, y); c.lineTo(Math.max(x0 + 0.1, mx), y); c.stroke();
  c.strokeStyle = 'rgba(255,246,214,0.7)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y - 2); c.lineTo(Math.max(x0 + 0.1, mx), y - 2); c.stroke();
  for (let i = 0; i < pr.n; i++) {                      // a sign at the end of every part of the level
    const x = x0 + len * (i + 1) / pr.n, done = i < pr.cur || (i === pr.cur && pr.frac >= 1), now = i === pr.cur && !done;
    if (i === pr.n - 1) { c.drawImage(sprite('gNest', 56, 44, cc => drawNest(cc, 28, 22, 21, 3, 0)), x - 21, y - 17, 42, 33); continue; }
    const pop = now ? 1 + Math.sin(t * 5) * 0.08 : 1;
    c.fillStyle = done ? '#F8C24E' : '#FFF6E2'; c.strokeStyle = done ? '#E3952F' : 'rgba(170,130,110,0.6)'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 13 * pop, 0, TAU); c.fill(); c.stroke();
    if (i !== pr.midSeg && i !== pr.fightSeg) { c.save(); c.translate(x, y - 1); itemPath(c, 7 * pop); c.fillStyle = done ? '#FFF6C4' : 'rgba(233,169,58,0.55)'; c.fill(); c.restore(); }
    else { heartPath(c, x, y, 6 * pop); c.fillStyle = done ? '#FFF6C4' : '#E2574C'; c.fill(); }
  }
  // where the team is now
  const h0 = CONFIG.heroes[0], h1 = CONFIG.heroes[1];
  c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.arc(mx + 2, y + 2, 12, 0, TAU); c.fill();
  c.fillStyle = h0.color; c.beginPath(); c.arc(mx, y, 11, Math.PI / 2, Math.PI * 1.5); c.fill();
  c.fillStyle = h1.color; c.beginPath(); c.arc(mx, y, 11, -Math.PI / 2, Math.PI / 2); c.fill();
  c.strokeStyle = '#FFF8E8'; c.lineWidth = 3; c.beginPath(); c.arc(mx, y, 11, 0, TAU); c.stroke();
  text(c, Math.round(pr.u * 100) + '%', W / 2 + 432, y + 1, 22, '#8A6A5A', { align: 'left', shadow: 0, weight: 'bold' });
}
/* The round picture of a hero (the one painted after the children's drawings) in a ring of his color; r = the radius of the ring. */
function drawPort(c, k, cx, cy, r, dizzy) {
  const cfg = CONFIG.heroes[k];
  c.fillStyle = rgba(cfg.color, 0.95); c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill();
  if (k === 1) { c.strokeStyle = cfg.color2; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); }
  const ps = sprite('port' + k + (dizzy ? 'd' : ''), 90, 90, cc => {
    cc.beginPath(); cc.arc(45, 45, 41, 0, TAU); cc.clip(); cc.fillStyle = '#FFF3DC'; cc.fillRect(0, 0, 90, 90);
    const pp = (isLupta() ? [[14, 131, 0.8], [43, 128, 0.92]] : [[27, 89, 0.8], [41, 129, 0.9]])[k];      // where the face sits in the round picture
    drawHero(cc, k, pp[0], pp[1], { scale: pp[2], t: 1, dizzy });
  });
  c.drawImage(ps, cx - r, cy - r, r * 2, r * 2);
}
/* A round green tick, painted: the quota is found. */
function drawTick(c, x, y, r) {
  c.save(); c.translate(x, y);
  soft(c, r * 0.05, r * 0.1, r, r, SHADOW, 0.22, 3);
  puff(c, 0, 0, r, r, QUOTA_GREEN, 4, 'rgba(40,110,60,0.5)');
  c.strokeStyle = '#FFF8E8'; c.lineWidth = r * 0.24; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-r * 0.42, r * 0.02); c.lineTo(-r * 0.12, r * 0.34); c.lineTo(r * 0.46, -r * 0.32); c.stroke();
  c.restore();
}
const QUOTA_GREEN = '#3E9A5A', QUOTA_RED = '#D6503F';      // contrast on the cream card (#FFF3DC): green 3.2 : 1, red 3.8 : 1
/* The corner badge: portrait, name, difficulty and, when the level has a quota, "found / quota" in green (done) or red (still missing). 300 x 108, inside the band (16 to 124). */
function drawBadge(c, k, x, y) {
  const cfg = CONFIG.heroes[k], h = P.heroes[k], s = Input.slots[k], w = 300, hh = 108;
  card(c, x, y, w, hh, '#FFF3DC', 20 + k);
  drawPort(c, k, x + 54, y + hh / 2, 40, h.dizzy > 0);
  text(c, cfg.name, x + 106, y + 30, 30, shade(cfg.color, -0.5), { align: 'left', title: true, halo: 0 });
  if (s.joined) text(c, T('diff.' + Game.diff[k]), x + w - 14, y + 22, 18, '#8A6A6A', { align: 'right', halo: 0, shadow: 0 });
  if (!s.joined) richText(c, pressLabel(k), x + 106 + 62, y + 76, 24, '#8A6A6A', { halo: 0, shadow: 0, pulse: Math.sin(P.time * 5) });
  else if (quotaOn()) {
    const qs = quotaState(k), col = qs.ok ? QUOTA_GREEN : QUOTA_RED, by = y + 78;
    const pop = 1 + 0.25 * clamp(h.numT / 0.2, 0, 1);                                   // grows when an egg was given or received
    const ph = P.time % 3, wob = !qs.ok && ph < 0.5 ? Math.sin(ph / 0.5 * TAU) * 0.0175 : 0;      // missing: a little wobble (1 degree) every 3 seconds, so it shows without color
    const shake = h.noT > 0 ? Math.sin(P.time * 70) * 5 * clamp(h.noT / 0.3, 0, 1) : 0;           // L1 with nothing to give
    c.save(); c.translate(x + 112 + shake, by); c.rotate(wob); c.scale(pop, pop);
    c.save(); c.translate(10, 2); itemPath(c, 12); c.fillStyle = isLupta() ? '#7FB4E8' : '#F8CC4E'; c.fill(); c.strokeStyle = 'rgba(120,90,60,0.35)'; c.lineWidth = 2; c.stroke(); c.restore();
    fitText(c, qs.found + ' / ' + qs.q, 28, 0, 46, qs.ok ? 116 : 152, col, { align: 'left', halo: 0.12, haloCol: shade(col, -0.35), shadow: 0, weight: 'bold' });
    c.restore();
    if (qs.ok) drawTick(c, x + w - 24, by, 15);
  }
  if (h.boost > 0) drawButterfly(c, x + w - 32, y + 56, P.time, 0.62);
}
/* "We wait for X in the nest": it used to be written in the world, over the nest. Now it is a banner in the band. */
/* "Ajută-l pe Boon! ○" while a friend is down and the seconds are running. It comes before any other banner. */
function downBanner() {
  for (const h of P.heroes) if (h.down && h.downLeft > 0) return { kind: 'down', t: 2, name: CONFIG.heroes[h.k].name, k: h.k };
  return null;
}
function waitBanner() {
  const L = P.L;
  if (!P.nestOpen || P.done || L.boss || !Input.slots[0].joined || !Input.slots[1].joined) return null;
  const nr = P.heroes.map(h => dist(h.x, h.y, L.nest.x, L.nest.y) < 185);
  if (nr[0] && nr[1] && quotaOn() && !(quotaOk(0) && quotaOk(1))) {      // both wait in the nest but a quota is missing: who needs how many
    const k = quotaOk(0) ? 1 : (quotaOk(1) ? 0 : (P.q - P.found[0] >= P.q - P.found[1] ? 0 : 1)), n = P.q - P.found[k];
    return { kind: 'need', t: 2, name: CONFIG.heroes[k].name, n };
  }
  return nr[0] === nr[1] ? null : { kind: 'wait', t: 2, name: CONFIG.heroes[nr[0] ? 1 : 0].name };
}
/* The card in the middle, with what a banner says when there is one. A banner never comes down over the world. */
function drawMidCard(c, ban) {
  const L = P.L, t = P.time, y0 = 16, hh = 88, yc = y0 + hh / 2;
  const bh = CONFIG.boss.hits, bsp = bh > 3 ? 52 : 66, br = bh > 3 ? 18 : 22;      // the boss goals: smaller circles when there are many
  let cw = L.boss ? Math.max(520, 300 + bh * bsp) : 640;
  if (ban) cw = Math.max(cw, ban.kind === 'duel' ? 1000 : 880);
  const cx = W / 2 - cw / 2;
  const el = ban && ban.max != null ? ban.max - ban.t : 9, pop = ban ? 1 + 0.06 * (1 - clamp(el / 0.2, 0, 1)) : 1;      // the card breathes when a banner comes in
  if (ban) { c.save(); c.translate(W / 2, yc); c.scale(pop, pop); c.translate(-W / 2, -yc); c.globalAlpha = clamp(Math.min(ban.t, 1), 0, 1); }
  card(c, cx, y0, cw, hh, ban ? '#FFF6E2' : '#FFF3DC', ban ? 31 : 9);
  if (ban) {
    if (ban.kind === 'down') {                      // a friend is down: the message and a big ○, in his color
      const fk = 1 - ban.k, kb = Opt.ctrl[fk] === 'kb', key = kb ? keyName(Opt.keys[fk].b) : '';      // the friend plays on the keyboard: his own key, not ○
      text(c, kb ? T('retry.helpKey', ban.name, key) : T('retry.help', ban.name), W / 2 - 30, yc, 44, CONFIG.heroes[ban.k].color, { title: true, halo: 0 });
      iconO(c, W / 2 + cw / 2 - 54, yc, 26, Math.sin(t * 7));
      c.globalAlpha = 1; c.restore();
      return;
    }
    if (ban.kind === 'quotaDone') {                  // this hero found his quota: his picture, the words, and L1 with an arrow toward the friend
      const k = ban.k, btn = Opt.ctrl[k] === 'kb' ? keyName(Opt.keys[k].g) : 'L1', lines = wrapLines(c, T('quota.done', ban.name, btn), cw - 250, 28);
      drawPort(c, k, W / 2 - cw / 2 + 54, yc, 30, false);
      const ly = yc - (Math.min(lines.length, 2) - 1) * 17;
      lines.slice(0, 2).forEach((ln, i) => text(c, ln, W / 2 - 14, ly + i * 34, 28, '#7A4A52', { halo: 0, shadow: 0, weight: 'bold' }));
      const ex = W / 2 + cw / 2 - 48, dir = k === 0 ? 1 : -1;
      iconL1(c, ex - dir * 22, yc, 24, Math.sin(t * 7)); iconArrow(c, ex + dir * 22 + Math.sin(t * 6) * 5 * dir, yc, dir > 0 ? 0 : Math.PI, 16, '#F8C24E');
      c.globalAlpha = 1; c.restore();
      return;
    }
    const label = ban.kind === 'quotaBoth' ? T('quota.both') : ban.kind === 'need' ? T('quota.need', ban.name, ban.n === 1 ? T('quota.one') : T('quota.many', ban.n)) : ban.kind === 'auto' ? T('quota.auto', ban.name) : T('ban.' + ban.kind, ban.kind === 'wait' ? ban.name : isLupta() ? CONFIG.lupta.rainbowBonus : '');
    if (ban.kind === 'duel') {
      text(c, label, W / 2, y0 + 30, 40, '#C4573D', { title: true, halo: 0 });
      text(c, T(ban.mid ? 'duel.mid' : 'duel.guard', T('duel.' + ban.id)), W / 2, y0 + 66, 26, '#7A4A52', { halo: 0, shadow: 0, weight: 'bold' });
    } else {
      text(c, label, W / 2, yc, 46, '#C4573D', { title: true, halo: 0 });
      const ex = W / 2 + cw / 2 - 54;                 // the little picture sits at the right edge of the card
      if (ban.kind === 'more') iconArrow(c, ex + Math.sin(t * 6) * 6, yc, 0, 22, '#F8C24E');
      if (ban.kind === 'nest' || ban.kind === 'wait' || ban.kind === 'quotaBoth') { drawNest(c, ex, yc + 4, 32, 5, 0); iconArrow(c, W / 2 - cw / 2 + 48 + Math.sin(t * 6) * 6, yc, 0, 19, '#F8C24E'); }
      if (ban.kind === 'giant') drawEgg(c, ex, yc + 18, 19, t, 1, 0, 0, true);
      if (ban.kind === 'rainbow') for (let i = 0; i < 7; i++) { c.save(); c.translate(W / 2 + (i < 3 ? -cw / 2 + 34 + i * 24 : cw / 2 - 106 + (i - 3) * 24), yc + Math.sin(t * 6 + i) * 4); itemPath(c, 9); c.fillStyle = RAINBOW[i]; c.fill(); c.restore(); }
    }
    c.globalAlpha = 1; c.restore();
    return;
  }
  const cpop = P.comboT > 1.0 ? 1 + (P.comboT - 1.0) * 0.6 : 1;
  if (isLupta()) {                         // a crystal, and under the number the seven colors gathered so far (all seven = a rainbow, bonus crystals)
    c.save(); c.translate(cx + 56, yc - 6); c.scale(cpop, cpop); drawCrystal(c, 0, 19, 22, 0, 0, 0, (t * 0.7 | 0) % 7); c.restore();
    for (let i = 0; i < 7; i++) { const on = P.rainbow.indexOf(i) >= 0; c.save(); c.translate(cx + 96 + i * 18, y0 + 76); itemPath(c, 6); c.fillStyle = on ? RAINBOW[i] : 'rgba(150,120,140,0.25)'; c.fill(); if (on) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.2; c.stroke(); } c.restore(); }
  } else { c.save(); c.translate(cx + 56, yc + 10); c.scale(cpop, cpop); const g = c.createRadialGradient(-6, -13, 2, 0, -4, 29); g.addColorStop(0, '#FFF6C4'); g.addColorStop(0.5, '#F8CC4E'); g.addColorStop(1, '#E3952F'); c.translate(0, -9); eggPath(c, 22); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(190,110,50,0.4)'; c.lineWidth = 2.5; c.stroke(); c.restore(); }
  text(c, String(Game.team.eggs), cx + 90, isLupta() ? yc - 12 : yc, 52, isLupta() ? '#3F6FB0' : '#B9702E', { align: 'left', halo: 0, weight: 'bold' });
  if (L.boss) {
    for (let i = 0; i < bh; i++) {
      const x = cx + cw - 50 - (bh - 1 - i) * bsp, done = i < P.boss.phase;
      c.fillStyle = done ? '#F8C24E' : 'rgba(180,140,120,0.3)'; c.beginPath(); c.arc(x, yc, br, 0, TAU); c.fill();
      if (done) drawBall(c, x, yc, br - 6, 0.4); else { c.strokeStyle = 'rgba(150,110,100,0.5)'; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); c.arc(x, yc, br - 6, 0, TAU); c.stroke(); c.setLineDash([]); }
    }
    return;
  }
  c.lineJoin = 'round';
  for (let i = 0; i < P.stars.length; i++) {
    const s = P.stars[i], x = cx + 274 + i * 56;
    starPath(c, x, yc - 2, 24, 0);
    if (s.got) { c.fillStyle = '#FFE7A0'; c.strokeStyle = '#F4B08E'; c.lineWidth = 5; c.stroke(); c.fill(); } else { c.fillStyle = 'rgba(190,150,130,0.28)'; c.fill(); }
  }
  // sun timer: the sun travels toward the hill while the level lasts (second game: the moon travels toward sunrise)
  const u = clamp(t / levelDurationOf(P.L), 0, 1), x0 = cx + 496, yy = y0 + 72;
  c.strokeStyle = 'rgba(160,120,110,0.4)'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.arc(x0, yy, 34, Math.PI, TAU); c.stroke();
  const a = Math.PI + u * Math.PI; soft(c, x0 + Math.cos(a) * 34, yy + Math.sin(a) * 34, 10, 10, isLupta() ? mix('#E8ECFF', '#FFD86A', u) : mix('#FFD86A', '#EE8A5A', u), 1, 3);
  if (isLupta()) soft(c, x0 + Math.cos(a) * 34 + 4, yy + Math.sin(a) * 34 - 2, 8, 8, '#FFF3DC', 1 - u, 4);      // a crescent moon that grows into a sun
  c.fillStyle = isLupta() ? '#6A6FB0' : '#9DB37E'; c.beginPath(); c.ellipse(x0, yy + 6, 44, 9, 0, Math.PI, TAU); c.fill();
}
function drawHUD(c) {
  drawBadge(c, 0, 28, 16); drawBadge(c, 1, W - 28 - 300, 16);
  drawMidCard(c, downBanner() || P.banner || waitBanner());
  if (!P.L.boss) drawProgress(c);
}
/* ---------- The light map (S7.5) ----------
   The whole screen is multiplied by the level's ambient colour (one fill), then every light is added on it ('lighter')
   as a round sprite painted once per colour: at most maxLights drawImage, no createRadialGradient per frame.
   S7.5 asks for a small canvas (480 x 270) blown up over the screen with 'multiply'. Measured on the test machine
   (SwiftShader), blowing a small canvas up to the whole screen with smoothing costs 10 ms by itself (without
   smoothing 4 ms, but the light comes out in blocks of 4 pixels): over the budget of S7.7. Painting the same lights
   straight on the screen costs about 3 ms. The difference: a light here adds warm colour over the darkened world,
   instead of giving back the world's own colour; the darker the ambient, the stronger the lights (lightGlow). */
const _lights = [], _lightPool = [];
const LightCount = { fill: 0, draw: 0, big: 0, halo: 0, haloLo: 1, haloHi: 0 };              // for the test: what the last frame did
function lightSprite(col) {
  return sprite('light-' + col, 64, 64, c => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, rgba(col, 1)); g.addColorStop(0.4, rgba(col, 0.55)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.fillRect(0, 0, 64, 64);
  });
}
function addLight(x, y, r, col, a, glow) {
  const o = _lightPool[_lights.length] || (_lightPool[_lights.length] = {});
  o.x = x; o.y = y; o.r = r; o.col = col; o.a = a; o.glow = !!glow; _lights.push(o);       // glow: it also gets a halo, it gives light by itself
}
function collectLights(L) {
  _lights.length = 0;
  for (const h of P.heroes) addLight(h.x, h.y - 70, 150, mix(CONFIG.heroes[h.k].color, '#FFF6E0', 0.5), 0.45);
  for (const e of P.eggs) if (e.delay <= 0 && e.state === 'idle' && !(e.big && L.cave && L.cave.reveal < 0.05)) addLight(e.x, e.y, 50, '#FFE6A8', 0.7);
  for (const s of P.stars) if (!s.got && !s.hidden) addLight(s.x, s.y, 60, '#FFF0B8', 0.7, true);
  for (const f of P.flock) addLight(f.x, f.y - 16, 70, '#FFE8C0', 0.6);
  for (const q of P.heal) addLight(q.x, q.y, 90, '#FFF0C8', 0.8);
  for (const ln of L.lanterns) if (ln.lit > 0) addLight(ln.x + 20, ln.y - 76, 230, '#FFD9A0', 0.85 * ln.lit, true);
  if (L.torches) for (const tc of L.torches) addLight(tc.x, tc.y - 86, 210, '#FFBE80', 0.85, true);
  if (L.lights) for (const lt of L.lights) addLight(lt.x, lt.y, lt.r, lt.col, lt.a == null ? 0.8 : lt.a, lt.glow !== false);     // the lights a level puts by itself (lava, the Sun Crystal...)
  if (P.nestOpen && !L.boss) addLight(L.nest.x, L.nest.y, 260, '#FFE28C', 0.6, true);
  if (L.arena && P.boss) {                                       // the crystals at the foot of George's throne give light too
    const ne = Math.max(0, Math.round(12 * (1 - P.boss.phase / CONFIG.boss.hits)));
    for (let i = 0; i < ne; i++) addLight(850 + (i % 6) * 44, 600 - (i / 6 | 0) * 44 - 14, 54, RAINBOW[i % 7], 0.7, true);
  }
}
function drawLightMap(c, v) {
  const L = P.L; LightCount.fill = LightCount.draw = LightCount.big = LightCount.halo = 0; LightCount.haloLo = 1; LightCount.haloHi = 0;
  if (!v || !isDiorama(L) || !CONFIG.look.lights) return;
  const vw = W / v.z, vh = H / v.z, mx = v.l + vw / 2, my = v.tp + vh / 2;
  collectLights(L);
  let n = 0;                                                // keep the ones on screen, then the nearest to the middle
  for (let i = 0; i < _lights.length; i++) { const o = _lights[i]; if (o.x + o.r < v.l || o.x - o.r > v.l + vw || o.y + o.r < v.tp || o.y - o.r > v.tp + vh || o.a <= 0) continue; o.d = (o.x - mx) * (o.x - mx) + (o.y - my) * (o.y - my); _lights[n++] = o; }
  _lights.length = n;
  if (n > CONFIG.look.maxLights) { _lights.sort((a, b) => a.d - b.d); _lights.length = CONFIG.look.maxLights; }
  const amb = levelAmbient(L), ar = parseInt(amb.slice(1, 3), 16), ag = parseInt(amb.slice(3, 5), 16), ab = parseInt(amb.slice(5, 7), 16);
  const k = CONFIG.look.lightGlow * (0.35 + 1 - (ar * 0.299 + ag * 0.587 + ab * 0.114) / 255);
  c.globalCompositeOperation = 'multiply'; c.fillStyle = amb; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'lighter';
  for (const o of _lights) { c.globalAlpha = Math.min(1, o.a * k); const s = o.r * v.z; c.drawImage(lightSprite(o.col), (o.x - v.l) * v.z - s, (o.y - v.tp) * v.z - s, s * 2, s * 2); }
  const HA = CONFIG.look.halo;                               // the halos: a small bright core over what gives light, alpha 0.35 - 0.6 (it breathes a little)
  if (HA > 0) for (const o of _lights) {
    if (!o.glow || LightCount.halo >= CONFIG.look.haloMax) continue;
    const s = Math.max(24, o.r * 0.34) * v.z, fl = 0.8 + 0.2 * Math.sin(P.time * 5 + o.x * 0.05 + o.y * 0.03);
    c.globalAlpha = clamp(HA * fl * (0.55 + 0.45 * o.a), 0.7 * HA, 1.2 * HA); LightCount.haloLo = Math.min(LightCount.haloLo, c.globalAlpha); LightCount.haloHi = Math.max(LightCount.haloHi, c.globalAlpha);
    c.drawImage(lightSprite(mix(o.col, '#FFFFFF', 0.45)), (o.x - v.l) * v.z - s, (o.y - v.tp) * v.z - s, s * 2, s * 2); LightCount.halo++;
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  LightCount.fill = 1; LightCount.draw = _lights.length;
}
/* ---------- Water (T6.8) ----------
   Two rows of thin pale waves that go in opposite directions (one pattern, drawn twice with other shifts, in fillWaves),
   and small sparkles that come and go, each at its own time. The reflection is already in the picture (paintWater). */
const WaterCount = { waves: 0, spark: 0 };
function waterSpark() {
  return sprite('water-spark', 24, 24, k => {
    const g = k.createRadialGradient(12, 12, 0, 12, 12, 12); g.addColorStop(0, 'rgba(255,252,236,1)'); g.addColorStop(0.3, 'rgba(255,244,208,0.5)'); g.addColorStop(1, 'rgba(255,244,208,0)');
    k.fillStyle = g; k.fillRect(0, 0, 24, 24); k.strokeStyle = 'rgba(255,252,236,0.9)'; k.lineWidth = 1.4; k.lineCap = 'round';
    k.beginPath(); k.moveTo(2, 12); k.lineTo(22, 12); k.moveTo(12, 2); k.lineTo(12, 22); k.stroke();
  });
}
function drawWater(c, L, t, l, tp, vw, vh) {
  WaterCount.waves = WaterCount.spark = 0;
  fillWaves(c, L.water.path, t, CONFIG.look.waveSpeedA, CONFIG.look.waveSpeedB); WaterCount.waves = 2;
  const sp = waterSpark();
  c.globalCompositeOperation = 'lighter';
  for (const q of L.water.spark) {
    if (q.x < l - 20 || q.x > l + vw + 20 || q.y < tp - 20 || q.y > tp + vh + 20) continue;
    const a = Math.sin(t * 2.2 + q.ph); if (a < 0.45) continue;               // most of the time it is dark: a glint is short
    const k = (a - 0.45) / 0.55; c.globalAlpha = k * 0.9; const s = q.s * (0.6 + 0.4 * k);
    c.drawImage(sp, q.x - s, q.y - s, s * 2, s * 2); WaterCount.spark++;
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
}
/* ---------- Dust in the light (T6.8) ----------
   CONFIG.look.motes tiny specks float through the whole screen (in screen space, not in the world), alpha 0.15 - 0.4,
   stronger near a light. On the volcano they are sparks that rise, in the cave spores that fall, elsewhere dust that drifts. */
const MoteCount = { draw: 0 }, _motes = [];
let _moteFor = null, _moteT = -1;
function moteKind(L) { return L.def.key === 'volcano' ? 'spark' : L.def.key === 'cave' ? 'spore' : 'dust'; }
const MOTE_COLS = { spark: ['#FFB060', '#FFD27A', '#FF8A4C'], spore: ['#D8C8FF', '#B8E0FF', '#F0C8F0'], dust: ['#FFF0C8', '#FFE6A8', '#FFF6E0'] };
function moteSprite(col) {
  return sprite('mote-' + col, 16, 16, k => {
    const g = k.createRadialGradient(8, 8, 0, 8, 8, 8); g.addColorStop(0, rgba(col, 1)); g.addColorStop(0.45, rgba(col, 0.5)); g.addColorStop(1, rgba(col, 0));
    k.fillStyle = g; k.fillRect(0, 0, 16, 16);
  });
}
function moteInit(L) {
  const r = rng((L.seed || 5) + 1313), kind = moteKind(L); _motes.length = 0;
  for (let i = 0; i < CONFIG.look.motes; i++) {
    _motes.push({ x: r() * W, y: r() * H, ph: r() * TAU, s: 1.6 + r() * 2.2, col: MOTE_COLS[kind][i % 3],
      vy: kind === 'spark' ? -(40 + r() * 50) : kind === 'spore' ? 10 + r() * 18 : -(5 + r() * 10), vx: (r() - 0.5) * 12 });
  }
  _moteFor = L; _moteT = -1;
}
function drawMotes(c, v) {
  const L = P.L; MoteCount.draw = 0;
  if (!v || !isDiorama(L) || CONFIG.look.motes <= 0) return;
  if (_moteFor !== L || _motes.length !== CONFIG.look.motes) moteInit(L);
  const dt = _moteT < 0 ? 0 : clamp(P.time - _moteT, 0, 0.1); _moteT = P.time;
  const t = P.time, lights = CONFIG.look.lights;
  c.globalCompositeOperation = 'lighter';
  for (const m of _motes) {
    m.x += (m.vx + Math.sin(t * 0.7 + m.ph) * 9) * dt; m.y += m.vy * dt;
    if (m.y < -12) { m.y = H + 12; m.x = (m.x * 7.3 + 311) % W; } else if (m.y > H + 12) { m.y = -12; m.x = (m.x * 7.3 + 311) % W; }
    if (m.x < -12) m.x += W + 24; else if (m.x > W + 12) m.x -= W + 24;
    let near = 0;
    if (lights) for (const o of _lights) {                                   // _lights holds what the light map drew in this frame
      const dx = (o.x - v.l) * v.z - m.x, dy = (o.y - v.tp) * v.z - m.y, R = o.r * v.z * 0.9, d2 = dx * dx + dy * dy;
      if (d2 < R * R) near = Math.max(near, (1 - Math.sqrt(d2) / R) * o.a);
    }
    c.globalAlpha = clamp(0.15 + 0.1 * (0.5 + 0.5 * Math.sin(t * 1.3 + m.ph)) + 0.15 * near, 0.15, 0.4);
    const s = m.s * 2.4; c.drawImage(moteSprite(m.col), m.x - s, m.y - s, s * 2, s * 2); MoteCount.draw++;
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
}
/* ---------- The front plane (S7.4) ----------
   The things painted once in L.front, each drawn with its own alpha (at most 12 drawImage). They move 1.15 times the
   camera, but never more than FRONT_PAR_MAX from their place, so they stay at the edges. THE RULE: a thing never
   covers a hero. A hero closer than frontNear (on screen) to a thing makes it fade to frontMin in frontFade seconds,
   so it is already faded when he gets under it. If he is under it anyway (the camera jumped), it fades at once. */
const FrontCount = { draw: 0 };
function heroScreenBox(h, v) {
  const sx = (h.x - v.l) * v.z, sy = (h.y - v.tp) * v.z, s = v.z * (h.small || 1);
  return [sx - 75 * s, sy - (190 + (h.z || 0)) * s, sx + 75 * s, sy + 20 * s];
}
function frontOffset(L, v) {
  const vw = W / v.z, vh = H / v.z, p = CONFIG.look.frontPar - 1;
  return [clamp(-(v.l - (L.W - vw) / 2) * p * v.z, -FRONT_PAR_MAX, FRONT_PAR_MAX), clamp(-(v.tp - (L.H - vh) / 2) * p * v.z, -FRONT_PAR_MAX, FRONT_PAR_MAX)];
}
function updateFront(L, v) {                                   // the alphas: called while drawing, from the time that passed in the game
  const F = L.front, LK = CONFIG.look, dt = F.t < 0 ? 1 : clamp(P.time - F.t, 0, 0.1); F.t = P.time;
  const [ox, oy] = frontOffset(L, v), near = LK.frontNear, step = (1 - LK.frontMin) / LK.frontFade * dt;
  const boxes = P.heroes.map(h => heroScreenBox(h, v));
  for (const it of F.items) {
    const x0 = it.x + ox - near, y0 = it.y + oy - near, x1 = it.x + ox + it.w + near, y1 = it.y + oy + it.h + near;
    let hit = false, under = false;
    for (const b of boxes) {
      if (b[2] > x0 && b[0] < x1 && b[3] > y0 && b[1] < y1) hit = true;
      if (b[2] > it.x + ox && b[0] < it.x + ox + it.w && b[3] > it.y + oy && b[1] < it.y + oy + it.h) under = true;
    }
    const tg = hit ? LK.frontMin : 1;
    if (under) it.a = LK.frontMin;                             // already under it (the camera jumped, a hero was put there): at once, no fading
    else it.a = it.a < tg ? Math.min(tg, it.a + step) : Math.max(tg, it.a - step);
  }
  return [ox, oy];
}
function drawFront(c, v) {
  const L = P.L; FrontCount.draw = 0;
  if (!v || !L.front || !CONFIG.look.front) return;
  const [ox, oy] = updateFront(L, v), cv = L.front.cv;
  for (const it of L.front.items) {
    if (it.a < 0.01) continue;
    c.globalAlpha = it.a; c.drawImage(cv, it.x, it.y, it.w, it.h, it.x + ox, it.y + oy, it.w, it.h); FrontCount.draw++;
  }
  c.globalAlpha = 1;
}
function drawPlay(c) {
  const v = drawWorld(c);
  drawLightMap(c, v);
  drawMotes(c, v);
  drawFront(c, v);
  drawHints(c, v);
  drawEdgePulse(c);
  drawHUD(c);
}
/* The last three seconds: the edge of the screen breathes in the fallen hero's own color. Never red-dark, never black. */
function drawEdgePulse(c) {
  let worst = 0, col = null;
  for (const h of P.heroes) if (h.down && h.downLeft > 0 && h.downLeft <= 3 && (!worst || h.downLeft < worst)) { worst = h.downLeft; col = CONFIG.heroes[h.k].color; }
  if (!col) return;
  const a = (0.1 + 0.15 * (1 - worst / 3)) * (0.55 + 0.45 * Math.sin(P.time * 7));
  const g = c.createRadialGradient(W / 2, H / 2, H * 0.34, W / 2, H / 2, H * 0.78);
  g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, Math.max(0, a)));
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
/* The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. */
function drawNestShelter(c) {
  const L = P.L, t = P.time, R = CONFIG.nestSafeRadius, fight = !!(P.duel && !P.duel.over), inside = P.heroes.some(h => h.safe);
  if (L.boss || !CONFIG.nestSafe) return;                                   // Ciori's nest in the tree is not a shelter
  c.fillStyle = rgba('#BFE3A8', (inside ? 0.3 : 0.16) * (fight ? 1 : 0.6)); c.beginPath(); c.ellipse(L.nest.x, L.nest.y, R, R * 0.7, 0, 0, TAU); c.fill();
  c.strokeStyle = rgba('#7FB06A', (0.55 + 0.25 * Math.sin(t * 3)) * (fight ? 1 : 0.35)); c.lineWidth = 7; c.setLineDash([22, 16]); c.lineDashOffset = -t * 20;
  c.beginPath(); c.ellipse(L.nest.x, L.nest.y, R, R * 0.7, 0, 0, TAU); c.stroke(); c.setLineDash([]);
}
/* The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. */
function drawDecor(c, l, tp, vw, vh) {
  const L = P.L; if (!L.decor) return;
  const x0 = l - 60, x1 = l + vw + 60, y0 = tp - 60, y1 = tp + vh + 60;
  for (const d of L.decor) {
    if (!d.live || d.x < x0 || d.x > x1 || d.y < y0 || d.y > y1) continue;
    c.save();
    let dy = 0, al = 1, sy = 1;
    if (d.rk === 'hide') sy = 1 - d.hide * 0.22;
    if (d.rk === 'fly' && d.flyT > 0) { const k = 1 - d.flyT / 2.2; dy -= Math.sin(k * Math.PI) * 90; al = 1 - k * 0.3; }
    c.translate(d.x, d.y + dy); c.rotate(d.rot); c.scale(d.s, d.s * sy);
    c.globalAlpha = al;
    c.drawImage(decorSprite(d.type, d.v), -48, -56, 96, 96);
    c.restore();
  }
}
/* ---------- George's arena (the last level of the second game) ---------- */
function drawArenaBack(c) {                 // the torches of fire around the arena
  const L = P.L, t = P.time;
  for (const tc of L.torches) drawFlame(c, tc.x, tc.y - 86, t, 1.15, 1);
}
function drawThrone(c) {
  const L = P.L, bs = P.boss, t = P.time, sh = Math.sin(t * 38) * bs.treeShake * 0.012;
  c.save(); c.translate(L.treeBase.x, 600); c.rotate(sh); c.drawImage(L.treeCv, L.treeOff.x - L.treeBase.x, L.treeOff.y - 600); c.restore();
  // the crystals George keeps at the foot of his throne: fewer after every hit
  const ne = Math.max(0, Math.round(12 * (1 - bs.phase / CONFIG.boss.hits)));
  for (let i = 0; i < ne; i++) drawCrystal(c, 850 + (i % 6) * 44, 600 - (i / 6 | 0) * 44, 15, t, i * 1.3, 0, i % 7);
}
function drawGeorgeBoss(c, o, t) {
  const L = P.L, st = o.state, up = st === 'up', S = CONFIG.lupta.bossSize * (o.sc || 1);
  const mood = st === 'won' ? 'scared' : (st === 'down' || st === 'falling') ? 'dizzy' : (o.throwAnim > 0 || o.bat > 0 || o.rings.length) ? 'angry' : 'calm';
  if (!up) castShadow(c, o.x, (st === 'down' || st === 'won') ? o.y + 4 : 660, 100 * S, 70 * S, 21, 1);   // the cast shadow of S7.1
  c.save(); c.translate(o.x + (up ? Math.sin(t * 38) * o.treeShake * 9 : 0), o.y + (up ? 34 + Math.sin(t * 3) * 3 : 0));
  if (st === 'falling') c.rotate(o.t * 9);
  if (o.windup > 0) { const w = easeOut(o.windup); c.translate(0, -12 * w); c.scale(1 - 0.05 * w, 1 + 0.07 * w); c.rotate(-0.1 * w); }      // anticipation: he draws back before he throws (T6.9)
  drawGeorge(c, 0, st === 'falling' ? 40 : 0, { tail: tailFollow(o, o.x, t, 260), scale: S, t: t, face: st === 'won' ? 1 : (P.heroes[0].x + P.heroes[1].x < o.x * 2 ? -1 : 1), mood, moving: st === 'won' && o.t > 1.2, walk: t * 18, noCrown: st === 'won' });
  c.restore();
  if (st === 'down') drawDizzyStars(c, o.x + 30, o.y - 190, t);
  if (st === 'won' && o.wy != null) drawGeorgeCrown(c, o.cx, o.wy - 8, 1.5, 1.25);          // his crown stays behind on the sand
}
