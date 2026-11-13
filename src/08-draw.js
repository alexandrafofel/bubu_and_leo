
/* ==========================================================================
   DRAWING THE GAME: world, heroes, effects, HUD
   ========================================================================== */
const _sorted = [];
function heroOpts(h) {
  return { face: h.face, walk: h.walk, moving: h.moving, t: h.t, z: h.z, squash: h.squash, dizzy: h.dizzy > 0, kick: h.kickT > 0 ? h.kickT / 0.28 : 0,
    happy: P.done || (P.boss && P.boss.state === 'won') };
}
function drawParts(c) {
  for (const p of P.parts) {
    const a = clamp(p.life / p.max, 0, 1);
    if (p.kind === 'spark') { c.fillStyle = rgba(p.col, a); starPath(c, p.x, p.y, p.size * (0.5 + a * 0.5), p.rot); c.fill(); }
    else if (p.kind === 'dust') { c.fillStyle = rgba(p.col, a * 0.5); c.beginPath(); c.arc(p.x, p.y, p.size * (1.6 - a * 0.8), 0, TAU); c.fill(); }
    else if (p.kind === 'petal' || p.kind === 'leaf') { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = rgba(p.col, Math.min(1, a * 1.6)); c.beginPath(); c.ellipse(0, 0, p.size, p.size * (p.kind === 'leaf' ? 0.42 : 0.6), 0, 0, TAU); c.fill(); c.restore(); }
    else { c.fillStyle = rgba(p.col, a); c.beginPath(); c.arc(p.x, p.y, p.size * 0.6, 0, TAU); c.fill(); }
  }
}
function drawHeroFull(c, h) {
  const cfg = CONFIG.heroes[h.k];
  // colored ground ring so each player finds their hero at a glance
  c.lineWidth = 6; c.strokeStyle = rgba(cfg.color, 0.85); c.beginPath(); c.ellipse(h.x, h.y + 2, 44, 17, 0, 0, TAU); c.stroke();
  if (h.k === 1) { c.lineWidth = 3; c.strokeStyle = rgba(cfg.color2, 0.85); c.beginPath(); c.ellipse(h.x, h.y + 2, 37, 13, 0, 0, TAU); c.stroke(); }
  c.fillStyle = rgba(SHADOW, 0.22); c.beginPath(); c.ellipse(h.x - 6, h.y + 3, Math.max(10, 34 - h.z * 0.3), 11, 0, 0, TAU); c.fill();
  if (h.boost > 0) { const g = c.createRadialGradient(h.x, h.y - 40, 10, h.x, h.y - 40, 110); g.addColorStop(0, 'rgba(255,214,140,0.5)'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.beginPath(); c.arc(h.x, h.y - 40, 110, 0, TAU); c.fill(); }
  if (h.safe) { c.strokeStyle = rgba('#7FB06A', 0.9); c.lineWidth = 5; c.setLineDash([12, 9]); c.beginPath(); c.ellipse(h.x, h.y + 2, 58, 24, 0, 0, TAU); c.stroke(); c.setLineDash([]); }
  if (h.inv > 0 && h.dizzy <= 0) c.globalAlpha = 0.55 + Math.sin(P.time * 22) * 0.25;
  drawHero(c, h.k, h.x, h.y, heroOpts(h));
  c.globalAlpha = 1;
  if (h.dizzy > 0) drawDizzyStars(c, h.x + (h.k === 0 ? 30 * h.face : 0), h.y - (h.k === 0 ? 100 : 122), P.time);
  if (h.k === 1 && P.ball.state === 'held' && h.dizzy <= 0) {       // aim arrow, grows while charging
    const pw = h.charging ? h.charge : 0, len = 62 + pw * 70;
    iconArrow(c, h.x + h.ax * len, h.y - 14 + h.ay * len * 0.8, Math.atan2(h.ay, h.ax), 13 + pw * 13, pw > 0.95 ? '#E9703C' : mix('#F6C63C', '#E9703C', pw));
    if (h.charging) { c.strokeStyle = rgba('#3F78C8', 0.8); c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(h.x, h.y - 130, 17, -Math.PI / 2, -Math.PI / 2 + TAU * pw); c.stroke(); }
  }
  if (h.tagT > 0) text(c, cfg.name, h.x, h.y - (h.k === 0 ? 118 : 140), 34, shade(cfg.color, -0.35), { title: true });
}
function drawBossTargets(c) {
  const bs = P.boss, L = P.L, t = P.time, pulse = 0.5 + 0.5 * Math.sin(t * 5);
  if (bs.state === 'up') {
    const tb = L.treeBase; c.strokeStyle = rgba(CONFIG.heroes[0].color, 0.35 + pulse * 0.35); c.lineWidth = 10; c.setLineDash([26, 20]);
    c.beginPath(); c.ellipse(tb.x, tb.y + 40, 330 + pulse * 10, 150 + pulse * 5, 0, 0, Math.PI); c.stroke(); c.setLineDash([]);
  } else if (bs.state === 'down') {
    c.strokeStyle = rgba(CONFIG.heroes[1].color, 0.6 + pulse * 0.4); c.lineWidth = 12; c.beginPath(); c.arc(L.nest.x, L.nest.y, 118 + pulse * 14, 0, TAU); c.stroke();
    c.strokeStyle = rgba(CONFIG.heroes[1].color2, 0.8); c.lineWidth = 5; c.beginPath(); c.arc(L.nest.x, L.nest.y, 100 + pulse * 10, 0, TAU); c.stroke();
  }
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
  for (const p of list) { if (p.t < 0) continue; const u = p.t / p.dur; drawCone(c, lerp(p.sx, p.tx, u), lerp(p.sy, p.ty, u) - Math.sin(u * Math.PI) * 260 + 26, p.rot, 24, 0); }
}

function drawWorld(c) {
  const L = P.L, cam = P.cam, z = cam.zoom, vw = W / z, vh = H / z, t = P.time;
  let l = cam.x - vw / 2, tp = cam.y - vh / 2;
  if (P.shake > 0) { l += Math.sin(t * 90) * P.shake * 22; tp += Math.cos(t * 77) * P.shake * 22; }
  l = clamp(l, 0, L.W - vw); tp = clamp(tp, 0, L.H - vh);
  c.drawImage(L.bg, l, tp, vw, vh, 0, 0, W, H);
  c.save(); c.scale(z, z); c.translate(-l, -tp);
  // water shimmer
  if (L.waterCells.length) {
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
  for (const r of P.rings) {
    const u = r.t / 0.55, rad = r.max * easeOut(u);
    blobPath(c, r.x, r.y, rad, rad * 0.5, 3, 0.04, 16); c.strokeStyle = rgba(CONFIG.heroes[0].color, (1 - u) * 0.7); c.lineWidth = 14 * (1 - u) + 3; c.stroke();
    blobPath(c, r.x, r.y, rad * 0.8, rad * 0.4, 4, 0.04, 16); c.strokeStyle = rgba('#FFF3C0', (1 - u) * 0.6); c.lineWidth = 6 * (1 - u) + 1; c.stroke();
  }
  if (L.boss) {
    const bs = P.boss, sh = Math.sin(t * 38) * bs.treeShake * 0.022;
    c.save(); c.translate(L.treeBase.x, 600); c.rotate(sh); c.drawImage(L.treeCv, L.treeOff.x - L.treeBase.x, L.treeOff.y - 600); c.restore();
    c.save(); c.translate(L.nest.x + Math.sin(t * 38) * bs.treeShake * 9, L.nest.y); drawNest(c, 0, 0, 108, 31, 0);
    const ne = Math.max(0, 9 - bs.phase * 3); for (let i = 0; i < ne; i++) { c.save(); c.translate(-44 + (i % 5) * 22, -6 + (i / 5 | 0) * 16); const g = c.createRadialGradient(-3, -6, 1, 0, 0, 16); g.addColorStop(0, '#FFF6C4'); g.addColorStop(1, '#E9A93A'); eggPath(c, 11); c.fillStyle = g; c.fill(); c.restore(); }
    c.restore();
    drawBossTargets(c);
  }
  if (P.duel) drawDuelGround(c);
  // eggs and stars lie on the ground
  for (const e of P.eggs) if (e.delay <= 0) {
    if (e.big && L.cave) { if (L.cave.reveal < 0.05) continue; c.globalAlpha = L.cave.reveal; }   // the secret stays a secret
    drawEgg(c, e.x, e.y, e.r, t, e.seed, e.z); c.globalAlpha = 1;
  }
  for (const s of P.stars) if (!s.got && !s.hidden) drawStar(c, s.x, s.y, 26, t, s.z);
  drawGuides(c);
  // everything that stands up, sorted by depth
  _sorted.length = 0;
  for (const h of P.heroes) _sorted.push({ y: h.y, k: 0, o: h });
  for (const b of L.beetles) _sorted.push({ y: b.y, k: 1, o: b });
  for (const cn of L.cones) if (cn.state !== 'gone') _sorted.push({ y: cn.y, k: 2, o: cn });
  for (const s of L.sprites) _sorted.push({ y: s.y, k: 3, o: s });
  if (P.ball.state !== 'held') _sorted.push({ y: P.ball.y, k: 4, o: P.ball });
  if (P.boss) _sorted.push({ y: P.boss.state === 'up' ? 0 : P.boss.y, k: 5, o: P.boss });
  if (P.duel && !P.duel.over && P.duel.z < 70) _sorted.push({ y: P.duel.y, k: 6, o: P.duel });
  _sorted.sort((a, b) => a.y - b.y);
  for (const it of _sorted) {
    const o = it.o;
    if (it.k === 0) { drawHeroFull(c, o); if (o.k === 1 && P.ball.state === 'held') { c.fillStyle = rgba(SHADOW, 0.2); c.beginPath(); c.ellipse(P.ball.x, P.ball.y + 3, 13, 5, 0, 0, TAU); c.fill(); drawBall(c, P.ball.x, P.ball.y - 13 - (P.ball.z || 0), 14, P.ball.spin); } }
    else if (it.k === 1) { drawBeetle(c, o, t); if (o.state === 'stun') drawDizzyStars(c, o.x, o.y - 52, t); }
    else if (it.k === 2) { c.globalAlpha = o.fade == null ? 1 : o.fade; drawCone(c, o.x + (o.state === 'stun' ? Math.sin(t * 30) * 2 : 0), o.y, o.rot, o.r, 0); c.globalAlpha = 1; if (o.state === 'stun') drawDizzyStars(c, o.x, o.y - 66, t); }
    else if (it.k === 3) {
      const r = o.ref;
      // a hero standing behind a tree or a windmill stays visible
      const hw = o.kind === 'tree' ? r.R : 70, hh = o.kind === 'tree' ? r.R * 2.3 : 270;
      for (const h of P.heroes) if (h.y < o.y && h.y > o.y - hh - 40 && Math.abs(h.x - r.x) < hw + 30) c.globalAlpha = 0.4;
      if (o.kind === 'tree') {
        const sh = Math.sin(t * 34) * r.shake * 0.07, w = r.sprite.width;
        c.save(); c.translate(r.x, r.y + r.R * 1.1); c.rotate(sh); c.drawImage(r.sprite, -w / 2, -r.R * 2.45); c.restore();
        if (r.starTree && r.starTree.hidden) { c.globalAlpha *= 0.55 + 0.35 * Math.sin(t * 3); c.fillStyle = '#FFE9C8'; starPath(c, r.x + r.R * 0.2, r.y - r.R * 0.25, 15, t * 0.5); c.fill(); }
      } else { c.drawImage(r.sprite, r.x - 80, r.y - 280); drawMillBlades(c, r.x, r.y - 202, r.ang); }
      c.globalAlpha = 1;
    }
    else if (it.k === 4) { c.fillStyle = rgba(SHADOW, 0.22); c.beginPath(); c.ellipse(o.x - 3, o.y + 4, 14, 6, 0, 0, TAU); c.fill(); drawBall(c, o.x, o.y - 16, o.r, o.spin); }
    else if (it.k === 6) drawDuelBoss(c);
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
  if (P.crow) { const cr = P.crow, u = cr.t / 3.2; drawCiori(c, l + u * (vw + 400) - 200, tp + vh * 0.22 + Math.sin(u * 9) * 30, { scale: 1.2 / z, t: t, fly: true, face: 1 }); if (Math.random() < 0.5) part(l + u * (vw + 400) - 200, tp + vh * 0.22, { vy: 140, vx: (Math.random() - 0.5) * 50, life: 1.1, max: 1.1, size: 7, kind: 'spark' }); }
  if (P.bfly) drawButterfly(c, P.bfly.x, P.bfly.y - 50, t, 1.15);
  if (P.duel) drawDuelTop(c);
  drawParts(c);
  if (P.boss && P.boss.state === 'won' && P.boss.t > 1.6) {       // Ciori says sorry
    const bx = 960, by = 250;
    card(c, bx - 430, by - 80, 860, 150, '#FFF6E2', 5);
    text(c, T('sorry1'), bx, by - 32, 42, '#5F4E80', { halo: 0 }); text(c, T('sorry2'), bx, by + 22, 42, '#5F4E80', { halo: 0 });
  }
  c.restore();
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
  if (P.sinceEgg < CONFIG.hintAfter && P.time < CONFIG.levelDuration) return null;
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
    if (h.k === 1 && bs.state === 'down') return { x: L.nest.x, y: L.nest.y + 60, kind: 'ball' };
    return nearestEgg(h, false);
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
    if (!Opt.guide[h.k] || !Input.slots[h.k].joined || h.dizzy > 0) continue;
    const g = guideTarget(h); if (!g) continue;
    const dx = g.x - h.x, dy = g.y - h.y, m = Math.hypot(dx, dy); if (m < 130) continue;
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
      if (g.kind === 'egg') drawEgg(c, ix, iy + 14, 12, 0, 1, 0);
      else if (g.kind === 'nest') c.drawImage(sprite('gNest', 56, 44, cc => drawNest(cc, 28, 22, 21, 3, 0)), ix - 28, iy - 22, 56, 44);
      else if (g.kind === 'x') iconX(c, ix, iy, 16, 0);
      else if (g.kind === 'ball') drawBall(c, ix, iy, 14, t * 2);
      else text(c, '!', ix, iy + 2, 40, '#D9463C', { halo: 0, shadow: 0, weight: 'bold' });
    }
    c.globalAlpha = 1;
  }
}
function drawHints(c, v) {
  const t = P.time, L = P.L, tg = hintTarget();
  if (tg) {
    const sx = (tg.x - v.l) * v.z, sy = (tg.y - v.tp) * v.z, m = 90;
    if (sx > m && sx < W - m && sy > 240 && sy < H - m) iconArrow(c, sx, sy - 30 + Math.sin(t * 6) * 10, Math.PI / 2, 30, '#F8C24E');
    else { const cx = clamp(sx, m, W - m), cy = clamp(sy, 260, H - m); iconArrow(c, cx + Math.sin(t * 6) * 6, cy, Math.atan2(sy - cy, sx - cx), 38, '#F8C24E'); }
  }
  // first steps: stick, then ✕, shown above each hero
  if (Game.levelIdx === 0 || L.boss) for (const h of P.heroes) {
    const tu = P.tut[h.k]; if (!Input.slots[h.k].joined || (tu.moved > 0.8 && tu.used) || P.time > 90) continue;
    if (L.boss && (tu.used || P.time > 12)) continue;
    const sx = (h.x - v.l) * v.z, sy = (h.y - v.tp) * v.z - (h.tagT > 0 ? 200 : 160) * v.z + Math.sin(t * 5) * 5;
    if (tu.moved <= 0.8 && !L.boss) iconStick(c, sx, sy, 28, t); else iconX(c, sx, sy, 30, Math.sin(t * 6));
  }
  if (P.hintCharge > 0) { const h = P.heroes[1], sx = (h.x - v.l) * v.z, sy = (h.y - v.tp) * v.z - 200 * v.z - 20, u = (t * 0.9) % 1; iconX(c, sx - 24, sy, 28, 0); c.strokeStyle = '#3F78C8'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.arc(sx + 34, sy, 20, -Math.PI / 2, -Math.PI / 2 + TAU * u); c.stroke(); }
  if (P.boss) {
    const bs = P.boss, sc = v.z;
    if (bs.state === 'up' && P.time > 3) { const x = (L.treeBase.x - 250 - v.l) * sc, y = (L.treeBase.y + 10 - v.tp) * sc + Math.sin(t * 6) * 8; iconX(c, x, y, 26, Math.sin(t * 6)); iconArrow(c, x, y + 52, Math.PI / 2, 20, CONFIG.heroes[0].color); }
    if (bs.state === 'down') { const x = (L.nest.x - v.l) * sc, y = (L.nest.y + 200 - v.tp) * sc + Math.sin(t * 6) * 8; drawBall(c, x, y + 44, 22, t * 3); iconArrow(c, x, y - 6, -Math.PI / 2, 26, CONFIG.heroes[1].color); }
  }
}

const pressLabel = k => Opt.ctrl[k] === 'kb' ? keyName(Opt.keys[k].a) : T('t.press');
/* How far the level is: eggs in groups, then the guardian, then the nest. */
function levelProgress() {
  const NW = P.L.NW, n = NW + (CONFIG.duel.enabled ? 1 : 0) + 1;
  let cur, frac, left = 0, kind;
  if (P.done) { cur = n - 1; frac = 1; kind = 'nest'; }
  else if (P.nestOpen) { cur = n - 1; frac = 0.2; kind = 'nest'; }
  else if (P.duel) { cur = NW; frac = (P.duel.maxHp - P.duel.hp) / P.duel.maxHp; left = P.duel.hp; kind = 'duel'; }
  else { cur = clamp(P.wave, 0, NW - 1); left = Math.max(0, P.waveNeed - P.waveGot); frac = P.nextWaveT >= 0 ? 1 : clamp(P.waveGot / Math.max(1, P.waveNeed), 0, 1); kind = 'eggs'; }
  return { n, cur, frac, left, kind, u: clamp((cur + frac) / n, 0, 1) };
}
function drawProgress(c) {
  const pr = levelProgress(), t = P.time, NW = P.L.NW, y = 184, x0 = W / 2 - 372, x1 = W / 2 + 392, len = x1 - x0;
  P.progU = P.progU == null ? pr.u : P.progU + (pr.u - P.progU) * 0.12;
  card(c, W / 2 - 520, 152, 1040, 66, '#FFF3DC', 12);
  // left: what is still to do right now
  if (pr.kind === 'eggs') { c.save(); c.translate(W / 2 - 478, y + 12); const g = c.createRadialGradient(-3, -16, 1, 0, -10, 18); g.addColorStop(0, '#FFF6C4'); g.addColorStop(1, '#E9A93A'); c.translate(0, -12); eggPath(c, 14); c.fillStyle = g; c.fill(); c.restore(); text(c, '× ' + pr.left, W / 2 - 456, y + 1, 34, '#B9702E', { align: 'left', halo: 0, shadow: 0, weight: 'bold' }); }
  else if (pr.kind === 'duel') { heartPath(c, W / 2 - 478, y, 11); c.fillStyle = '#E2574C'; c.fill(); text(c, '× ' + pr.left, W / 2 - 456, y + 1, 34, '#C4573D', { align: 'left', halo: 0, shadow: 0, weight: 'bold' }); }
  else { c.drawImage(sprite('gNest', 56, 44, cc => drawNest(cc, 28, 22, 21, 3, 0)), W / 2 - 500, y - 22, 56, 44); iconArrow(c, W / 2 - 424 + Math.sin(t * 6) * 4, y, 0, 13, '#F8C24E'); }
  // the road
  c.lineCap = 'round'; c.strokeStyle = 'rgba(190,150,130,0.32)'; c.lineWidth = 16; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
  const mx = x0 + len * P.progU;
  c.strokeStyle = '#F8C24E'; c.beginPath(); c.moveTo(x0, y); c.lineTo(Math.max(x0 + 0.1, mx), y); c.stroke();
  c.strokeStyle = 'rgba(255,246,214,0.7)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x0, y - 3); c.lineTo(Math.max(x0 + 0.1, mx), y - 3); c.stroke();
  for (let i = 0; i < pr.n; i++) {                      // a sign at the end of every part of the level
    const x = x0 + len * (i + 1) / pr.n, done = i < pr.cur || (i === pr.cur && pr.frac >= 1), now = i === pr.cur && !done;
    if (i === pr.n - 1) { c.drawImage(sprite('gNest', 56, 44, cc => drawNest(cc, 28, 22, 21, 3, 0)), x - 30, y - 24, 60, 48); continue; }
    const pop = now ? 1 + Math.sin(t * 5) * 0.08 : 1;
    c.fillStyle = done ? '#F8C24E' : '#FFF6E2'; c.strokeStyle = done ? '#E3952F' : 'rgba(170,130,110,0.6)'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 19 * pop, 0, TAU); c.fill(); c.stroke();
    if (i < NW) { c.save(); c.translate(x, y - 1); eggPath(c, 10 * pop); c.fillStyle = done ? '#FFF6C4' : 'rgba(233,169,58,0.55)'; c.fill(); c.restore(); }
    else { heartPath(c, x, y, 8.5 * pop); c.fillStyle = done ? '#FFF6C4' : '#E2574C'; c.fill(); }
  }
  // where the team is now
  const h0 = CONFIG.heroes[0], h1 = CONFIG.heroes[1];
  c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.arc(mx + 2, y + 3, 15, 0, TAU); c.fill();
  c.fillStyle = h0.color; c.beginPath(); c.arc(mx, y, 14, Math.PI / 2, Math.PI * 1.5); c.fill();
  c.fillStyle = h1.color; c.beginPath(); c.arc(mx, y, 14, -Math.PI / 2, Math.PI / 2); c.fill();
  c.strokeStyle = '#FFF8E8'; c.lineWidth = 3.5; c.beginPath(); c.arc(mx, y, 14, 0, TAU); c.stroke();
  text(c, Math.round(pr.u * 100) + '%', W / 2 + 474, y + 1, 30, '#9A7A6A', { halo: 0, shadow: 0, weight: 'bold' });
}
function drawBadge(c, k, x, y) {
  const cfg = CONFIG.heroes[k], h = P.heroes[k], s = Input.slots[k], w = 340, hh = 112;
  card(c, x, y, w, hh, '#FFF3DC', 20 + k);
  c.fillStyle = rgba(cfg.color, 0.95); c.beginPath(); c.arc(x + 62, y + hh / 2, 44, 0, TAU); c.fill();
  if (k === 1) { c.strokeStyle = cfg.color2; c.lineWidth = 6; c.beginPath(); c.arc(x + 62, y + hh / 2, 44, 0, TAU); c.stroke(); }
  const dz = h.dizzy > 0, ps = sprite('port' + k + (dz ? 'd' : ''), 90, 90, cc => {
    cc.beginPath(); cc.arc(45, 45, 41, 0, TAU); cc.clip(); cc.fillStyle = '#FFF3DC'; cc.fillRect(0, 0, 90, 90);
    if (k === 0) drawBubu(cc, 27, 89, { scale: 0.8, t: 1, dizzy: dz }); else drawLeo(cc, 41, 129, { scale: 0.9, t: 1, dizzy: dz });
  });
  c.drawImage(ps, x + 17, y + hh / 2 - 45, 90, 90);
  text(c, cfg.name, x + 122, y + 42, 44, shade(cfg.color, -0.5), { align: 'left', title: true, halo: 0 });
  if (!s.joined) richText(c, pressLabel(k), x + 122 + 78, y + 82, 28, '#8A6A6A', { halo: 0, shadow: 0, pulse: Math.sin(P.time * 5) });
  else text(c, T('diff.' + Game.diff[k]), x + 122, y + 82, 28, '#8A6A6A', { align: 'left', halo: 0, shadow: 0 });
  if (h.boost > 0) drawButterfly(c, x + w - 44, y + 56, P.time, 0.8);
}
function drawHUD(c) {
  const L = P.L, t = P.time;
  drawBadge(c, 0, 36, 28); drawBadge(c, 1, W - 36 - 340, 28);
  const cw = L.boss ? 560 : 660, cx = W / 2 - cw / 2;
  card(c, cx, 24, cw, 120, '#FFF3DC', 9);
  const pop = P.comboT > 1.0 ? 1 + (P.comboT - 1.0) * 0.6 : 1;
  c.save(); c.translate(cx + 74, 96); c.scale(pop, pop); const g = c.createRadialGradient(-8, -18, 2, 0, -6, 40); g.addColorStop(0, '#FFF6C4'); g.addColorStop(0.5, '#F8CC4E'); g.addColorStop(1, '#E3952F'); c.translate(0, -12); eggPath(c, 30); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(190,110,50,0.4)'; c.lineWidth = 3; c.stroke(); c.restore();
  text(c, String(Game.team.eggs), cx + 122, 86, 72, '#B9702E', { align: 'left', halo: 0, weight: 'bold' });
  if (L.boss) {
    for (let i = 0; i < CONFIG.boss.hits; i++) {
      const x = cx + cw - 70 - (CONFIG.boss.hits - 1 - i) * 86, done = i < P.boss.phase;
      c.fillStyle = done ? '#F8C24E' : 'rgba(180,140,120,0.3)'; c.beginPath(); c.arc(x, 84, 30, 0, TAU); c.fill();
      if (done) drawBall(c, x, 84, 22, 0.4); else { c.strokeStyle = 'rgba(150,110,100,0.5)'; c.lineWidth = 4; c.setLineDash([8, 8]); c.beginPath(); c.arc(x, 84, 22, 0, TAU); c.stroke(); c.setLineDash([]); }
    }
  } else {
    c.lineJoin = 'round';
    for (let i = 0; i < P.stars.length; i++) {
      const s = P.stars[i], x = cx + 330 + i * 78;
      starPath(c, x, 78, 30, 0);
      if (s.got) { c.fillStyle = '#FFE7A0'; c.strokeStyle = '#F4B08E'; c.lineWidth = 6; c.stroke(); c.fill(); } else { c.fillStyle = 'rgba(190,150,130,0.28)'; c.fill(); }
    }
    // sun timer: the sun travels toward the hill while the level lasts
    const u = clamp(t / CONFIG.levelDuration, 0, 1), x0 = cx + 580, yy = 108;
    c.strokeStyle = 'rgba(160,120,110,0.4)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(x0, yy, 44, Math.PI, TAU); c.stroke();
    const a = Math.PI + u * Math.PI; soft(c, x0 + Math.cos(a) * 44, yy + Math.sin(a) * 44, 13, 13, mix('#FFD86A', '#EE8A5A', u), 1, 3);
    c.fillStyle = '#9DB37E'; c.beginPath(); c.ellipse(x0, yy + 8, 56, 12, 0, Math.PI, TAU); c.fill();
    drawProgress(c);
  }
  if (P.banner) {
    const b = P.banner, a = clamp(Math.min(b.t, 1), 0, 1), y = (L.boss ? 232 : 306) + (1 - easeOut(a)) * -40;
    c.globalAlpha = a;
    const label = T('ban.' + b.kind);
    if (b.kind === 'duel') {
      card(c, W / 2 - 480, y - 62, 960, 176, '#FFF6E2', 33);
      text(c, label, W / 2, y - 6, 64, '#C4573D', { title: true, halo: 0 });
      text(c, T('duel.guard', T('duel.' + b.id)), W / 2, y + 66, 40, '#7A4A52', { halo: 0, shadow: 0, weight: 'bold' });
    } else {
    card(c, W / 2 - 330, y - 56, 660, 112, '#FFF6E2', 31);
    text(c, label, W / 2 - 10, y, 60, '#C4573D', { title: true, halo: 0 });
    if (b.kind === 'more') iconArrow(c, W / 2 + 240 + Math.sin(t * 6) * 8, y, 0, 30, '#F8C24E');
    if (b.kind === 'nest') { drawNest(c, W / 2 + 232, y + 4, 44, 5, 0); iconArrow(c, W / 2 - 250 + Math.sin(t * 6) * 8, y, 0, 26, '#F8C24E'); }
    if (b.kind === 'giant') drawEgg(c, W / 2 + 250, y + 26, 26, t, 1, 0);
    }
    c.globalAlpha = 1;
  }
}
function drawPlay(c) {
  const v = drawWorld(c);
  drawHints(c, v);
  drawHUD(c);
}
