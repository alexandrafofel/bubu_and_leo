
/* ==========================================================================
   GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss
   ========================================================================== */
const Game = { state: 'boot', t: 0, levelIdx: 0, team: { eggs: 0, stars: 0 }, results: [], diff: CONFIG.defaultDifficulty.slice(), paused: false };
let P = null;                                   // everything about the level being played
const D = k => CONFIG.difficulty[Game.diff[k]] || CONFIG.difficulty.normal;
const rank = k => Game.diff[k] === 'easy' ? 0 : Game.diff[k] === 'hard' ? 2 : 1;      // 0 Ușor, 1 Normal, 2 Greu
const _col = { nx: 0, ny: 0, hit: null };

function buildLevel(idx) {
  if (idx >= levelCount()) return genBoss();
  for (let a = 0; a < 80; a++) { const L = genLevel(idx, 1000 + idx * 97 + a * 13); if (L) return paintLevel(L); }
  throw new Error(T('err.level'));
}
function makeHero(k, x, y) {
  return { k, x, y, px: x, py: y, vx: 0, vy: 0, face: 1, ax: 1, ay: 0, walk: 0, moving: false, dizzy: 0, inv: 0, boost: 0, squash: 0, z: 0, cd: 0,
    stompT: -1, charge: 0, charging: false, kickT: 0, inMud: false, mudT: 0, tagT: 5, t: Math.random() * 5 };
}
function makeEgg(x, y, o) {
  return Object.assign({ x, y, r: 17, seed: Math.random() * 10, req: true, value: 1, state: 'idle', t: 0, delay: 0, z: 0, pull: null, pullT: 0, big: false }, o || {});
}
function startPlay(L) {
  const bs = !!L.boss;
  P = { L, eggs: [], stars: L.stars, parts: [], rings: [], wave: -1, time: 0, sinceEgg: 0, levelEggs: 0, levelStars: 0, combo: 0, comboT: 0,
    cam: { x: L.spawn.x, y: L.spawn.y, zoom: 1 }, shake: 0, wind: { t: CONFIG.windEvery * 0.7, state: 'calm', dir: 1, power: 0 },
    bfly: null, bflyT: 20 + Math.random() * 12, bflyCount: 0, crow: null, nestOpen: false, nestT: 0, done: false, doneT: 0, banner: null,
    tut: [{ moved: 0, used: false }, { moved: 0, used: false }], nextWaveT: -1, waveNeed: 1, waveGot: 0, duel: null, hits: 0, hintCharge: 0, rumbleT: 0, bounceT: 0, glint: 0,
    heroes: [makeHero(0, bs ? 700 : L.spawn.x - 55, bs ? 830 : L.spawn.y), makeHero(1, bs ? 1220 : L.spawn.x + 55, bs ? 830 : L.spawn.y + 10)],
    ball: { state: 'held', x: 0, y: 0, vx: 0, vy: 0, life: 0, spin: 0, power: 0, r: 15, px: 0, py: 0 },   // Leo's home ball (drawn when held)
    flock: [], ballCool: 0, kickNo: 0, midFought: false, nestFought: false, rustleT: 0, boss: null };                                                       // the balls in the air (one kick = many balls)
  for (const s of P.stars) { s.got = false; s.z = 0; s.pop = 0; }
  if (L.cave) P.eggs.push(makeEgg(L.cave.egg.x, L.cave.egg.y, { big: true, value: CONFIG.giantEggValue, r: 44, req: false }));
  if (bs) {
    P.boss = { phase: 0, state: 'up', t: 0, shakes: 0, throwT: 3, x: L.nest.x, y: L.nest.y, fx: 0, fy: 0, treeShake: 0, proj: [], cawT: 0, said: false };
    P.cam.x = L.W / 2; P.cam.y = L.H / 2;
  } else startWave(0);
  Snd.music(L.def.music);
}
function startWave(k) {
  const L = P.L; P.wave = k; P.waveGot = 0;
  P.waveNeed = L.waves[k].length + L.trees.reduce((a, t) => a + (t.spark && t.spark.wave === k ? t.spark.targets.length : 0), 0);
  L.waves[k].forEach((p, i) => P.eggs.push(makeEgg(p.x, p.y, { state: 'fall', delay: (k === 0 ? 0 : 0.9) + i * 0.06 })));
  for (const t of L.trees) if (t.spark && t.spark.wave === k) t.spark.active = true;
  if (k > 0) {
    P.banner = { kind: 'more', t: 4 }; Snd.play('wave'); Snd.play('caw');
    P.crow = { x: -200, y: 300, t: 0 };
  }
  P.sinceEgg = 0;
}

/* ---------- particles ---------- */
function part(x, y, o) {
  if (P.parts.length > 520) P.parts.splice(0, 40);
  P.parts.push(Object.assign({ x, y, vx: 0, vy: 0, g: 0, life: 1, max: 1, size: 6, col: '#FFE08A', kind: 'dot', rot: Math.random() * TAU, vr: 0, drag: 0 }, o));
}
function burst(x, y, n, o) {
  o = o || {}; const cols = o.cols || ['#FFE08A', '#FFF3C0', '#F8C24E'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, s = (o.speed || 140) * (0.35 + Math.random() * 0.85), l = (o.life || 0.7) * (0.6 + Math.random() * 0.7);
    part(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.75 - (o.up || 0), g: o.g == null ? 160 : o.g, life: l, max: l, size: (o.size || 7) * (0.6 + Math.random() * 0.8),
      col: cols[Math.random() * cols.length | 0], kind: o.kind || 'spark', vr: (Math.random() - 0.5) * 6, drag: o.drag || 1.5 });
  }
}
const PETALS = ['#F4B6B0', '#FBE3BA', '#F3D36B', '#E7A6A1'], LEAVES = ['#8FAF6A', '#B9C77A', '#E2A04F', '#C96F4E'];

function stepParts(dt) {
  for (let i = P.parts.length - 1; i >= 0; i--) {
    const p = P.parts[i]; p.life -= dt; if (p.life <= 0) { P.parts.splice(i, 1); continue; }
    p.vy += p.g * dt; if (p.drag) { const f = Math.max(0, 1 - p.drag * dt); p.vx *= f; p.vy *= f; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
  }
}
/* ---------- collisions ---------- */
function collide(L, e, r, isBall) {
  let nx = 0, ny = 0, n = 0, hit = null;
  if (e.x < r) { e.x = r; nx += 1; n++; } if (e.x > L.W - r) { e.x = L.W - r; nx -= 1; n++; }
  if (e.y < r) { e.y = r; ny += 1; n++; } if (e.y > L.H - r) { e.y = L.H - r; ny -= 1; n++; }
  const c0 = Math.max(0, (e.x - r) / CS | 0), c1 = Math.min(L.cols - 1, (e.x + r) / CS | 0), r0 = Math.max(0, (e.y - r) / CS | 0), r1 = Math.min(L.rows - 1, (e.y + r) / CS | 0);
  for (let cy = r0; cy <= r1; cy++) for (let cx = c0; cx <= c1; cx++) {
    const t = L.grid[cy * L.cols + cx]; if (t < 2) continue; if (isBall && t !== 3) continue;
    const qx = clamp(e.x, cx * CS, cx * CS + CS), qy = clamp(e.y, cy * CS, cy * CS + CS), dx = e.x - qx, dy = e.y - qy, d2 = dx * dx + dy * dy;
    if (d2 < r * r) {
      if (d2 > 1e-6) { const d = Math.sqrt(d2); e.x += dx / d * (r - d); e.y += dy / d * (r - d); nx += dx / d; ny += dy / d; }
      else { e.x = e.px; e.y = e.py; }
      n++;
    }
  }
  for (const s of L.solids) {
    if (isBall && s.noBall) continue;
    const dx = e.x - s.x, dy = e.y - s.y, rr = r + s.r, d2 = dx * dx + dy * dy;
    if (d2 < rr * rr) { const d = Math.sqrt(d2) || 0.01; e.x = s.x + dx / d * rr; e.y = s.y + dy / d * rr; nx += dx / d; ny += dy / d; n++; hit = s; }
  }
  if (!n) return null;
  const m = Math.hypot(nx, ny); _col.nx = m ? nx / m : 0; _col.ny = m ? ny / m : 0; _col.hit = hit;
  return _col;
}

/* ---------- eggs and stars ---------- */
function collectEgg(e, k) {
  const i = P.eggs.indexOf(e); if (i >= 0) P.eggs.splice(i, 1);
  Game.team.eggs += e.value; P.levelEggs += e.value; P.sinceEgg = 0; if (e.req) P.waveGot++;
  P.combo = P.comboT > 0 ? P.combo + 1 : 0; P.comboT = 1.3;
  if (e.big) {
    Snd.play('giant', 0, k); Snd.talk(k, 'giant'); burst(e.x, e.y - 30, 70, { speed: 320, life: 1.6, size: 12, up: 80 }); burst(e.x, e.y - 30, 30, { kind: 'petal', cols: PETALS, speed: 220, life: 2, g: 60 });
    P.banner = { kind: 'giant', t: 4.5 }; Input.rumble(0, 0.6, 0.8, 400); Input.rumble(1, 0.6, 0.8, 400);
  } else {
    Snd.play('egg', P.combo, k);
    if (e.dropped) Snd.talk(k, 'regain'); else if (P.combo === 4) Snd.talk(k, 'eggs5'); else if (Math.random() < 1 / 3) Snd.talk(k, 'egg');
    burst(e.x, e.y - 14, 9, { speed: 150, life: 0.6, up: 50 });
    for (let j = 0; j < 4; j++) part(e.x + (Math.random() - 0.5) * 20, e.y - 14, { vy: -30 - Math.random() * 40, vx: (Math.random() - 0.5) * 40, life: 1, max: 1, size: 4, col: '#FFF3C0', kind: 'dot', g: -10 });
    if (P.rumbleT <= 0) { Input.rumble(k, 0, 0.4, 45); P.rumbleT = 0.12; }
  }
  checkWave();
}
function collectStar(s, k) {
  s.got = true; Game.team.stars++; P.levelStars++;
  Snd.play('star', 0, k); Snd.talk(k, 'star'); burst(s.x, s.y - 20, 26, { kind: 'petal', cols: PETALS, speed: 230, life: 1.3, g: 90, up: 60 }); burst(s.x, s.y - 20, 16, { speed: 200, life: 0.9 });
  Input.rumble(k, 0.3, 0.7, 160);
}
/* The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. */
function checkWave() {
  const L = P.L; if (L.boss || P.nestOpen || P.nextWaveT >= 0) return;
  if (P.eggs.some(e => e.req)) return;
  if (L.trees.some(t => t.spark && t.spark.active && !t.spark.done)) return;
  if (P.duel && !P.duel.over) return;                                     // a mini-fight is on
  if (CONFIG.duel.enabled && !P.midFought && P.wave === L.NW - 2) { P.midFought = true; startDuel('mid'); return; }
  if (P.wave < L.NW - 1) { P.nextWaveT = 1.0; return; }
  if (CONFIG.duel.enabled && !P.nestFought) { P.nestFought = true; startDuel('nest'); return; }
  openNest();
}
function openNest() { P.nestOpen = true; P.banner = { kind: 'nest', t: 5 }; Snd.play('wave'); Snd.talk(0, 'nestOpen'); Snd.talk(1, 'nestOpen'); }
function shakeTree(t, power, byStomp) {
  const L = P.L;
  t.shake = Math.max(t.shake, 0.5 + power * 0.5);
  if (t.spark && t.spark.active && !t.spark.done) {
    t.spark.done = true; t.shake = 1; Snd.play('rustle'); Snd.play('pop');
    t.spark.targets.forEach((p, i) => P.eggs.push(makeEgg(p.x, p.y, { state: 'pop', sx: t.cx, sy: t.cy - 20, delay: i * 0.12 })));
    burst(t.x, t.y, 16, { kind: 'leaf', cols: L.pal.canopy, speed: 200, life: 1.4, g: 120, size: 10 });
    checkWave();
  } else if (t.starTree && !t.starTree.got && t.starTree.hidden) {
    if (!byStomp && power >= 0.55) {
      const s = t.starTree; s.hidden = false; s.pop = 0.001; s.sx = t.cx; s.sy = t.cy - 20; s.tx = s.x; s.ty = s.y; s.x = s.sx; s.y = s.sy;
      t.shake = 1; Snd.play('rustle'); Snd.play('pop');
      burst(t.x, t.y, 20, { kind: 'leaf', cols: L.pal.canopy, speed: 220, life: 1.4, g: 120, size: 10 });
    } else { Snd.play('rustle'); P.hintCharge = 3.5; burst(t.x, t.y, 5, { kind: 'leaf', cols: L.pal.canopy, speed: 120, life: 1, g: 120, size: 9 }); }
  }
}
function hitHero(h, sx, sy) {
  if (h.dizzy > 0 || h.inv > 0 || P.done || h.safe) return;
  if (!Input.slots[h.k].joined) return;          // a hero nobody controls cannot lose eggs
  P.hits++;
  const d = D(h.k), L = P.L;
  h.dizzy = d.dizzyTime; h.inv = d.dizzyTime + 1.6; h.charging = false; h.charge = 0; h.squash = 0.25;
  const dx = h.x - sx, dy = h.y - sy, m = Math.hypot(dx, dy) || 1; h.vx = dx / m * 260; h.vy = dy / m * 260;
  Snd.play('bonk', 0, h.k); Snd.talk(h.k, 'hurt'); h.dizzyVoice = P.time + 0.9; Input.rumble(h.k, 0.9, 0.6, 280); P.shake = Math.max(P.shake, 0.12);
  burst(h.x, h.y - 50, 8, { speed: 120, life: 0.6, cols: ['#FFE08A', '#FFF3C0'] });
  if (Game.team.eggs > 0) {
    Game.team.eggs--; P.levelEggs = Math.max(0, P.levelEggs - 1);
    let cells = L.reachCells ? L.reachCells(h.x, h.y, 80, 200, 4) : [];
    const p = cells.length ? cells[Math.random() * cells.length | 0] : { x: clamp(h.x + (Math.random() - 0.5) * 240, 60, L.W - 60), y: clamp(h.y + 60 + Math.random() * 100, L.top + 60, L.H - 60) };
    P.eggs.push(makeEgg(p.x, p.y, { state: 'pop', sx: h.x, sy: h.y - 40, req: false, delay: 0.1, wait: 0.9, dropped: true }));
    Snd.play('drop', 0, h.k);
  }
}

/* ---------- powers ---------- */
function doStomp(h) {
  const L = P.L, cfg = CONFIG.heroes[0], d = D(0);
  Snd.play('stomp', 0, 0); Input.rumble(0, 0.85, 0.4, 170); P.shake = Math.max(P.shake, 0.22); h.squash = 0.22;
  P.rings.push({ x: h.x, y: h.y, t: 0, max: cfg.stompRadius });
  for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; part(h.x + Math.cos(a) * 30, h.y + Math.sin(a) * 14, { vx: Math.cos(a) * 230, vy: Math.sin(a) * 110, life: 0.6, max: 0.6, size: 16, col: '#F3E2C0', kind: 'dust', drag: 3 }); }
  burst(h.x, h.y - 10, 8, { kind: 'petal', cols: PETALS, speed: 200, life: 1.1, g: 120, up: 80 });
  const stun = cfg.stunTime * (Game.diff[0] === 'easy' ? 1.3 : 1);
  let stunned = 0; for (const b of L.beetles) if (dist(b.x, b.y, h.x, h.y) < cfg.stompRadius + b.r) { b.state = 'stun'; b.t = stun; stunned++; }
  if (stunned) Snd.talk(h.k, 'beetleStun');
  for (const c of L.cones) if (c.state === 'roll' && dist(c.x, c.y, h.x, h.y) < cfg.stompRadius + c.r) { c.state = 'stun'; c.t = stun; }
  for (const e of P.eggs) if (e.state === 'idle' && e.delay <= 0 && !e.big && dist(e.x, e.y, h.x, h.y) < cfg.pullRadius) { e.pull = h; e.pullT = 1.5; }
  for (const t of L.dynTrees) if (dist(t.cx, t.cy, h.x, h.y) < cfg.stompRadius + t.cr) shakeTree(t, 0.5, true);
  if (P.duel) duelStomp(h);
  if (P.boss) {
    const b = P.boss, tb = L.treeBase;
    if (dist(h.x, h.y, tb.x, tb.y) < 360) {
      b.treeShake = 1; Snd.play('rustle');
      burst(tb.x + (Math.random() - 0.5) * 500, 260, 22, { kind: 'leaf', cols: L.pal.canopy, speed: 260, life: 2, g: 140, size: 11 });
      if (b.state === 'up') {
        b.shakes++;
        if (b.shakes >= (CONFIG.boss.shakes[b.phase] || 1)) { b.state = 'falling'; b.t = 0; b.fx = tb.x + (h.x < tb.x ? 240 : -240); b.fy = 640; b.sx = b.x; b.sy = b.y; Snd.play('caw'); }
      }
    }
  }
}
function newBall(x, y, vx, vy, power, life, kick, size) {
  return { state: 'fly', x, y, px: x, py: y, vx, vy, power, life, kick, r: 15 * size, z: 0, spin: 0 };
}
const ballReady = () => P.ball.state === 'held' || P.ballCool <= 0;     // all balls home, or the cooldown is over
/* One kick sends n balls out in a circle, so Leo's power goes in every direction. Stick direction = the first ball. */
function kickBall(h, power, ax, ay) {
  const cfg = CONFIG.heroes[1], dd = D(1);
  const n = Math.round(lerp(cfg.ballsPerKick, cfg.ballsPerKickMax, power));
  const sp = lerp(cfg.kickSpeed, cfg.kickSpeedMax, power) * dd.ballSpeed, life = lerp(cfg.ballLife, cfg.ballLifeMax, power);
  const base = Math.atan2(ay, ax), kick = ++P.kickNo;
  for (let i = 0; i < n; i++) {
    const a = base + i / n * TAU, cx = Math.cos(a), cy = Math.sin(a);
    P.flock.push(newBall(h.x + cx * 34, h.y + cy * 26, cx * sp, cy * sp, power, life, kick, dd.ballSize));
  }
  P.ball.state = 'away'; P.ball.power = power; P.ballCool = cfg.kickCooldown;
  if (Math.abs(ax) > 0.2) h.face = Math.sign(ax);
  h.kickT = 0.28; Snd.play('kick', power, 1); Snd.play('swish', power, 1); if (power > 0.5) Snd.talk(1, power > 0.8 ? 'powerBig' : 'power'); Input.rumble(1, 0.3 + power * 0.5, 0.5, 70 + power * 90);
  burst(h.x + ax * 34, h.y + ay * 26 - 10, 5 + power * 8, { speed: 120 + power * 120, life: 0.4, cols: ['#FFF3C0', '#F6C63C'] });
  P.tut[1].used = true;
}
/* A second press while the balls are still out (inside the cooldown) calls every ball back to Leo. */
function recallBalls() {
  for (const f of P.flock) if (f.state === 'fly') f.state = 'return';
  Snd.play('swish', 0.2, 1);
}

function updateHero(h, dt) {
  const L = P.L, s = Input.slots[h.k], d = D(h.k), cfg = CONFIG.heroes[h.k];
  let ix = s.x, iy = s.y, aP = s.aP, aR = s.aR, aH = s.a;
  h.t += dt; h.dizzy = Math.max(0, h.dizzy - dt); h.inv = Math.max(0, h.inv - dt); h.boost = Math.max(0, h.boost - dt); h.cd = Math.max(0, h.cd - dt);
  // the hero's own words: dizzy, recovering
  if (h.dizzyVoice && P.time >= h.dizzyVoice && h.dizzy > 0) { h.dizzyVoice = 0; Snd.talk(h.k, 'dizzy'); }
  if (h.wasDizzy && h.dizzy <= 0 && s.joined) Snd.talk(h.k, 'recover');
  h.wasDizzy = h.dizzy > 0;
  h.kickT = Math.max(0, h.kickT - dt); h.squash += (0 - h.squash) * Math.min(1, dt * 9); h.tagT = Math.max(0, h.tagT - dt);
  if (!s.joined) {                       // nobody holds this controller: the hero follows a friend
    const o = P.heroes[1 - h.k]; let tx = o.x - o.face * 85, ty = o.y + 26; aP = aR = aH = false;
    if (P.boss && P.boss.state !== 'won') {
      const b = P.boss, tb = L.treeBase;
      if (h.k === 0) { tx = tb.x - 190; ty = tb.y + 140; if (b.state === 'up' && dist(h.x, h.y, tx, ty) < 80 && h.cd <= 0 && h.stompT < 0 && h.dizzy <= 0) { h.stompT = 0; h.cd = 1.6; } }
      else { tx = tb.x + 150; ty = tb.y + 300; if (b.state === 'down' && P.ball.state === 'held' && h.dizzy <= 0 && dist(h.x, h.y, tx, ty) < 120) { const dx = L.nest.x - h.x, dy = L.nest.y - h.y, m = Math.hypot(dx, dy); kickBall(h, 0.5, dx / m, dy / m); } }
    }
    const dx = tx - h.x, dy = ty - h.y, m = Math.hypot(dx, dy);
    if (m > 60) { const f = Math.min(1, (m - 40) / 120); ix = dx / m * f; iy = dy / m * f; } else { ix = iy = 0; }
  }
  if (P.done || (P.boss && P.boss.state === 'won')) { ix = iy = 0; aP = aR = aH = false; }
  // the nest is a shelter on every level: a hero standing in it cannot be hit and the wind does not move it
  const wasSafe = h.safe;
  h.safe = !!CONFIG.nestSafe && !L.boss && dist(h.x, h.y, L.nest.x, L.nest.y) < CONFIG.nestSafeRadius;   // not on the boss level: that nest is Ciori's, up in the tree
  if (h.safe && !wasSafe && s.joined && P.time - (h.hideAt ?? -99) > CONFIG.nestHideSoundGap) { h.hideAt = P.time; Snd.talk(h.k, 'hide'); Input.rumble(h.k, 0, 0.3, 60); }
  else if (!h.safe && wasSafe && s.joined) Snd.talk(h.k, 'unhide');
  let sp = cfg.speed;
  h.inMud = L.grid[L.ci(h.x, h.y)] === 1;
  if (h.inMud && !h.wasMud && s.joined) Snd.talk(h.k, 'mud'); h.wasMud = h.inMud;
  const onBridge = !!(L.flag[L.ci(h.x, h.y)] & 8); if (onBridge && !h.wasBridge && s.joined) Snd.talk(h.k, 'bridge'); h.wasBridge = onBridge;
  if (h.inMud) sp *= CONFIG.mudSlow;
  if (h.boost > 0) sp *= CONFIG.butterflyBoost;
  if (h.dizzy > 0) sp *= 0.2;
  if (h.charging) sp *= 0.65;
  if (h.stompT >= 0) sp *= 0.35;
  const m = Math.hypot(ix, iy), f = m > 0.01 ? (0.45 + 0.55 * Math.min(1, m)) / m : 0;
  h.vx += (ix * f * sp - h.vx) * Math.min(1, dt * 12); h.vy += (iy * f * sp - h.vy) * Math.min(1, dt * 12);
  if (m > 0.3) { h.ax = ix / m; h.ay = iy / m; P.tut[h.k].moved += dt; }
  // bored: standing still for 8 seconds while a player holds this hero
  h.idleT = (s.joined && !h.moving && !h.charging && h.dizzy <= 0) ? (h.idleT || 0) + dt : 0;
  if (h.idleT > 8) { h.idleT = 0; Snd.talk(h.k, 'bored'); }
  h.px = h.x; h.py = h.y;
  h.x += h.vx * dt; h.y += h.vy * dt;
  if (P.wind.power > 0.02 && !h.safe) { h.x += P.wind.dir * P.wind.power * CONFIG.windForce * d.wind * dt; h.y += P.wind.power * CONFIG.windForce * d.wind * 0.12 * dt; }
  collide(L, h, HERO_R, false);
  const v = Math.hypot(h.vx, h.vy);
  h.moving = v > 35;
  if (h.moving) {
    const w0 = h.walk; h.walk += dt * (7 + v / 55); if (Math.abs(h.vx) > 25) h.face = Math.sign(h.vx);
    // footsteps: one soft sound each time a foot lands
    if (CONFIG.footsteps && s.joined && !h.inMud && h.z <= 0 && Math.floor(w0 / Math.PI) !== Math.floor(h.walk / Math.PI)) Snd.play('step', h.k * 2 + (Math.floor(h.walk / Math.PI) & 1), h.k);
  }
  if (h.inMud && h.moving) { h.mudT -= dt; if (h.mudT <= 0) { h.mudT = 0.3; Snd.play('squelch', 0, h.k); burst(h.x, h.y, 4, { kind: 'dot', cols: ['#A9764F', '#8E5E48'], speed: 90, life: 0.5, up: 70, g: 400, size: 6 }); } }
  if (h.boost > 0 && Math.random() < dt * 14) part(h.x + (Math.random() - 0.5) * 40, h.y - 30 - Math.random() * 40, { vy: -20, life: 0.7, max: 0.7, size: 6, col: '#FFD48A', kind: 'spark' });
  // powers
  if (h.k === 0) {
    if (aP && h.cd <= 0 && h.dizzy <= 0 && h.stompT < 0) { h.stompT = 0; h.cd = cfg.stompCooldown; P.tut[0].used = true; Snd.talk(0, 'power'); }
    if (h.stompT >= 0) {
      const pt = h.stompT; h.stompT += dt;
      h.z = h.stompT < 0.2 ? Math.sin(h.stompT / 0.2 * Math.PI) * 30 : 0;
      if (pt < 0.2 && h.stompT >= 0.2) doStomp(h);
      if (h.stompT > 0.42) h.stompT = -1;
    }
  } else {
    const b = P.ball;
    if (h.dizzy > 0) { h.charging = false; h.charge = 0; }
    else {
      if (aP && !h.charging) {
        if (ballReady()) { h.charging = true; h.charge = 0; h.chargeHold = 0; }   // all home, or cooldown over: a new kick
        else recallBalls();                                                         // balls still out and cooldown running: call them back
      }
      if (h.charging) {
        h.charge = Math.min(1, h.charge + dt / cfg.chargeTime); if (h.charge >= 1) h.chargeHold += dt;
        if (aR || !aH || h.chargeHold > 1.2) { h.charging = false; kickBall(h, h.charge < 0.22 ? 0 : h.charge, h.ax, h.ay); h.charge = 0; }
      }
    }
  }
}

function updateBall(dt) {
  const h = P.heroes[1], b = P.ball;
  P.ballCool = Math.max(0, P.ballCool - dt);
  for (let i = P.flock.length - 1; i >= 0; i--) if (!stepFlyBall(P.flock[i], dt, h)) P.flock.splice(i, 1);
  if (!P.flock.length) b.state = 'held';
  if (b.state === 'held') {                       // the home ball rides at Leo's feet
    const bob = h.moving ? Math.abs(Math.sin(h.walk * 2)) * 4 : 0;
    b.x = h.x + h.face * 27; b.y = h.y + 5; b.z = bob; b.spin += h.vx * dt * 0.05;
  }
}

/* One ball in the air. Returns false when the ball has come home to Leo and can go. */
function stepFlyBall(b, dt, h) {
  const L = P.L;
  b.z = 0;
  if (b.state === 'return') {
    const dx = h.x - b.x, dy = h.y - b.y, m = Math.hypot(dx, dy);
    if (m < 40) return false;
    const sp = 1050 * dt; b.x += dx / m * Math.min(m, sp); b.y += dy / m * Math.min(m, sp); b.spin += dt * 14;
    return true;
  }
  const sp0 = Math.hypot(b.vx, b.vy), steps = Math.max(1, Math.ceil(sp0 * dt / 11)), sdt = dt / steps;
  for (let i = 0; i < steps; i++) {
    b.px = b.x; b.py = b.y;
    b.x += b.vx * sdt; b.y += b.vy * sdt;
    if (P.wind.power > 0.02) b.x += P.wind.dir * P.wind.power * CONFIG.windForce * 0.8 * sdt;
    const c = collide(L, b, b.r, true);
    if (c) {
      if (c.nx === 0 && c.ny === 0) { b.vx = -b.vx; b.vy = -b.vy; }
      else { const dot = b.vx * c.nx + b.vy * c.ny; if (dot < 0) { b.vx = (b.vx - 2 * dot * c.nx) * 0.9; b.vy = (b.vy - 2 * dot * c.ny) * 0.9; } }
      if (P.bounceT <= 0) { Snd.play('bounce', 0, 1); P.bounceT = 0.33; burst(b.x, b.y - 8, 3, { speed: 80, life: 0.3, cols: ['#FFF3C0'] }); }   // at most about 3 bounce sounds a second, for all balls together
      if (c.hit && c.hit.tree && c.hit.tree.dyn) shakeTree(c.hit.tree, b.power, false);
    }
    for (const bt of L.beetles) if (bt.state !== 'knock' && dist(bt.x, bt.y, b.x, b.y) < bt.r + b.r + 8) {
      const m = Math.hypot(b.vx, b.vy) || 1; bt.state = 'knock'; bt.t = 0.55; bt.vx = b.vx / m * 430; bt.vy = b.vy / m * 430;
      b.vx *= 0.6; b.vy *= 0.6; Snd.play('stun'); Snd.talk(1, 'beetleStun'); burst(bt.x, bt.y - 20, 8, { speed: 150, life: 0.5 });
    }
    for (const cn of L.cones) if ((cn.state === 'roll' || cn.state === 'stun') && dist(cn.x, cn.y, b.x, b.y) < cn.r + b.r + 8) {
      cn.state = 'gone'; cn.t = 3.2; Snd.play('thud'); burst(cn.x, cn.y - 20, 12, { kind: 'dot', cols: ['#9C6A46', '#D6AA78'], speed: 200, life: 0.6, g: 300, size: 7 });
    }
    for (let j = P.eggs.length - 1; j >= 0; j--) { const e = P.eggs[j]; if (e.state === 'idle' && e.delay <= 0 && !(e.wait > 0) && dist(e.x, e.y, b.x, b.y) < e.r + b.r + 20) collectEgg(e, 1); }
    for (const s of P.stars) if (!s.got && !s.hidden && !s.pop && dist(s.x, s.y, b.x, b.y) < 26 + b.r + 16) collectStar(s, 1);
    if (P.boss) bossBall(b);
    if (P.duel) duelBall(b);
    if (b.state !== 'fly') return true;
  }
  const fr = Math.max(0, 1 - 0.28 * dt); b.vx *= fr; b.vy *= fr; b.spin += sp0 * dt * 0.03;
  b.life -= dt;
  if (b.life <= 0 || Math.hypot(b.vx, b.vy) < 110) b.state = 'return';
  if (Math.random() < dt * 30) part(b.x, b.y - 10, { life: 0.35, max: 0.35, size: 5 + b.power * 5, col: '#FFF3C0', kind: 'dot' });
  return true;
}

function updateEggs(dt) {
  const L = P.L, help = P.time > CONFIG.levelDuration ? 1.5 : 1;
  for (let i = P.eggs.length - 1; i >= 0; i--) {
    const e = P.eggs[i];
    if (e.delay > 0) { e.delay -= dt; if (e.delay <= 0 && e.state === 'pop') Snd.play('pop'); continue; }
    if (e.state === 'fall') { e.t += dt; const u = e.t / 0.5; e.z = u < 1 ? 300 * (1 - u) * (1 - u) : Math.sin(Math.min(1, (e.t - 0.5) / 0.18) * Math.PI) * 14; if (e.t >= 0.68) { e.state = 'idle'; e.z = 0; } continue; }
    if (e.state === 'pop') { e.t += dt; const u = Math.min(1, e.t / 0.6); e.x = lerp(e.sx, e.tx == null ? (e.tx = e.x) : e.tx, u); e.y = lerp(e.sy, e.ty == null ? (e.ty = e.y) : e.ty, u); e.z = Math.sin(u * Math.PI) * 90; if (u >= 1) { e.state = 'idle'; e.z = 0; } continue; }
    if (e.wait > 0) { e.wait -= dt; continue; }
    if (e.pull) {                        // stomped eggs fly all the way to Bubu, so none gets stranded
      const dx = e.pull.x - e.x, dy = e.pull.y - e.y, m = Math.hypot(dx, dy) || 1, sp = 540 * dt;
      e.x += dx / m * Math.min(m, sp); e.y += dy / m * Math.min(m, sp);
    }
    for (const h of P.heroes) {
      if (h.dizzy > 0) continue;
      const rad = (e.big ? 80 : D(h.k).pickupRadius) * help;
      if (dist(h.x, h.y, e.x, e.y) < rad) { collectEgg(e, h.k); break; }
    }
  }
  for (const s of P.stars) {
    if (s.got || s.hidden) continue;
    if (s.pop) { s.pop += dt; const u = Math.min(1, s.pop / 0.7); s.x = lerp(s.sx, s.tx, u); s.y = lerp(s.sy, s.ty, u); s.z = Math.sin(u * Math.PI) * 110; if (u >= 1) { s.pop = 0; s.z = 0; } continue; }
    for (const h of P.heroes) if (h.dizzy <= 0 && dist(h.x, h.y, s.x, s.y) < D(h.k).pickupRadius * 0.85) { collectStar(s, h.k); break; }
  }
}

function enemyMul(x, y) {                  // enemies slow down near a player on "Ușor"
  let m = 9;                                  // ...and speed up near a player on "Greu" (the gentlest player nearby decides)
  for (const h of P.heroes) if (dist(h.x, h.y, x, y) < 460) m = Math.min(m, Input.slots[h.k].joined ? D(h.k).enemySpeed : 1);
  return m > 8 ? 1 : m;
}
function updateEnemies(dt) {
  const L = P.L;
  for (const b of L.beetles) {
    b.t -= dt; b.cool = Math.max(0, (b.cool || 0) - dt);
    let near = null, nd = 1e9;
    for (const h of P.heroes) { const d = dist(h.x, h.y, b.x, b.y); if (d < nd) { nd = d; near = h; } }
    const mul = enemyMul(b.x, b.y);
    b.px = b.x; b.py = b.y;
    if (b.state === 'sleep') {
      if (b.cool <= 0 && nd < CONFIG.beetleWakeRadius * D(near.k).wakeRadius && near.inv <= 0 && !near.safe) { b.state = 'wake'; b.t = 0.6; Snd.play('wake'); Snd.talk(near.k, 'beetleWake'); b.face = near.x > b.x ? 1 : -1; }
    } else if (b.state === 'wake') { if (b.t <= 0) { b.state = 'chase'; b.t = 5; } }
    else if (b.state === 'chase') {
      const dx = near.x - b.x, dy = near.y - b.y, m = Math.hypot(dx, dy) || 1, sp = CONFIG.beetleSpeed * mul * dt;
      b.x += dx / m * sp; b.y += dy / m * sp; b.face = dx > 0 ? 1 : -1;
      if (b.t <= 0 || nd > 560 || dist(b.x, b.y, b.hx, b.hy) > 440 || near.dizzy > 0 || near.safe) { b.state = 'return'; b.cool = 2; }
    } else if (b.state === 'return') {
      const dx = b.hx - b.x, dy = b.hy - b.y, m = Math.hypot(dx, dy);
      if (m < 8) { b.state = 'sleep'; } else { const sp = CONFIG.beetleSpeed * 0.75 * dt; b.x += dx / m * Math.min(m, sp); b.y += dy / m * Math.min(m, sp); b.face = dx > 0 ? 1 : -1; }
    } else if (b.state === 'stun') { if (b.t <= 0) { b.state = 'return'; b.cool = 2.5; } }
    else if (b.state === 'knock') { b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 1 - Math.min(1, dt * 3); b.vy *= 1 - Math.min(1, dt * 3); if (b.t <= 0) { b.state = 'stun'; b.t = 3; } }
    if (b.state !== 'sleep') collide(L, b, 22, false);
    if (b.state === 'chase' || b.state === 'wake') for (const h of P.heroes) if (!h.safe && dist(h.x, h.y, b.x, b.y) < b.r + HERO_R - 8 && h.dizzy <= 0 && h.inv <= 0) { hitHero(h, b.x, b.y); b.state = 'return'; b.cool = 3; }
  }
  const cs = CONFIG.pineconeSpeed * (L.def.coneSpeed || 1);
  for (const c of L.cones) {
    if (c.state === 'roll') {
      const v = cs * enemyMul(c.x, c.y) * dt; c.y += v; c.rot += v / c.r; c.fade = Math.min(1, (c.fade == null ? 1 : c.fade) + dt * 2);
      if (c.y > c.lane.y1) { c.state = 'gone'; c.t = 1.4; }
      for (const h of P.heroes) if (!h.safe && dist(h.x, h.y, c.x, c.y) < c.r + HERO_R - 6 && h.dizzy <= 0 && h.inv <= 0) {
        hitHero(h, c.x, c.y); c.state = 'gone'; c.t = 3; burst(c.x, c.y - 20, 10, { kind: 'dot', cols: ['#9C6A46', '#D6AA78'], speed: 180, life: 0.6, g: 300, size: 7 });
      }
    } else if (c.state === 'stun') { c.t -= dt; if (c.t <= 0) c.state = 'roll'; }
    else { c.t -= dt; if (c.t <= 0) { c.state = 'roll'; c.y = c.lane.y0; c.fade = 0; } }
  }
}

/* ---------- boss: Ciori in the tallest tree ---------- */
function bossBall(b) {
  const bs = P.boss, L = P.L;
  if (dist(b.x, b.y, L.nest.x, L.nest.y) > 108) return;
  if (bs.state === 'down') {
    bs.phase++; Snd.play('goal'); Snd.talk(0, 'bossDown'); Snd.talk(1, 'bossDown'); Input.rumble(0, 0.7, 0.9, 350); Input.rumble(1, 0.7, 0.9, 350); P.shake = 0.3; b.state = 'return';
    burst(L.nest.x, L.nest.y, 50, { speed: 380, life: 1.4, size: 11 }); burst(L.nest.x, L.nest.y, 24, { kind: 'petal', cols: PETALS, speed: 260, life: 1.8, g: 80 });
    for (let i = 0; i < 8; i++) P.eggs.push(makeEgg(260 + Math.random() * 1400, 660 + Math.random() * 340, { state: 'pop', sx: L.nest.x, sy: L.nest.y, req: false, delay: i * 0.07 }));
    if (bs.phase >= CONFIG.boss.hits) { bs.state = 'won'; bs.t = 0; Snd.music('ending'); for (const p of bs.proj) p.dead = true; }
    else { bs.state = 'rising'; bs.t = 0; bs.sx = bs.x; bs.sy = bs.y; }
  } else if (bs.state === 'up') {
    const dx = b.x - L.nest.x, dy = b.y - L.nest.y, m = Math.hypot(dx, dy) || 1;
    b.vx = dx / m * 520; b.vy = Math.abs(dy / m) * 520 + 200; b.x = L.nest.x + dx / m * 112; b.y = L.nest.y + dy / m * 112;
    Snd.play('bounce'); if (bs.cawT <= 0) { Snd.play('caw'); bs.cawT = 2; } bs.bat = 0.4;
  }
}
function updateBoss(dt) {
  const bs = P.boss, L = P.L, tb = L.treeBase;
  bs.t += dt; bs.treeShake = Math.max(0, bs.treeShake - dt * 1.4); bs.cawT = Math.max(0, bs.cawT - dt); bs.bat = Math.max(0, (bs.bat || 0) - dt);
  if (bs.state === 'up') {
    bs.x = L.nest.x; bs.y = L.nest.y + 6;
    bs.throwT -= dt;
    if (bs.throwT <= 0) {
      bs.throwT = CONFIG.boss.throwEvery[Math.min(bs.phase, CONFIG.boss.throwEvery.length - 1)] || 2.5;
      // Ciori throws one pinecone at first, two from the second round, and one more in the last two rounds
      const n = 1 + Math.min(1, bs.phase) + (bs.phase >= CONFIG.boss.hits - 2 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const h = P.heroes[(i + (Math.random() < 0.5 ? 0 : 1)) % 2];
        const tx = i < 2 ? clamp(h.x + h.vx * 0.5, 80, L.W - 80) : 200 + Math.random() * 1500, ty = i < 2 ? clamp(h.y + h.vy * 0.5, 540, L.H - 60) : 600 + Math.random() * 400;
        bs.proj.push({ sx: bs.x, sy: bs.y - 40, tx: tx + i * 50 * (Math.random() - 0.5), ty, t: -i * 0.35, dur: [1.9, 1.4, 1.15][rank(h.k)], rot: 0 });
      }
      bs.throwAnim = 0.4;
    }
  } else if (bs.state === 'falling') {
    const u = Math.min(1, bs.t / 0.8); bs.x = lerp(bs.sx, bs.fx, u); bs.y = lerp(bs.sy, bs.fy, u * u);
    if (u >= 1) { bs.state = 'down'; bs.t = 0; Snd.play('bonk'); P.shake = 0.15; burst(bs.x, bs.y - 30, 14, { kind: 'leaf', cols: ['#5F4E80', '#8474A4'], speed: 180, life: 1, g: 200, size: 9 }); }
  } else if (bs.state === 'down') {
    if (bs.t > CONFIG.boss.downTime * [1.35, 1, 0.8][rank(1)]) { bs.state = 'rising'; bs.t = 0; bs.sx = bs.x; bs.sy = bs.y; }
  } else if (bs.state === 'rising') {
    const u = Math.min(1, bs.t / 1.1); bs.x = lerp(bs.sx, L.nest.x, ease(u)); bs.y = lerp(bs.sy, L.nest.y + 6, ease(u)) - Math.sin(u * Math.PI) * 60;
    if (u >= 1) { bs.state = 'up'; bs.shakes = 0; bs.throwT = 1.8; }
  } else if (bs.state === 'won') {
    const u = Math.min(1, bs.t / 1.6); if (bs.wx == null) { bs.wx = bs.x; bs.wy = bs.y; }
    bs.x = lerp(bs.wx, 960, ease(u)); bs.y = lerp(bs.wy, 700, ease(u)) - Math.sin(u * Math.PI) * 80;
    if (bs.t > 1.6 && !bs.said) { bs.said = true; Voice.say(T('sorryVoice')); }
    if (Math.random() < dt * 5) burst(200 + Math.random() * 1500, 200 + Math.random() * 300, 6, { kind: 'petal', cols: PETALS, speed: 120, life: 2, g: 60 });
    if (bs.t > 9 || (bs.t > 3.5 && Input.any(s => s.aP))) { Voice.stop(); Game.toEnding(); }
  }
  bs.throwAnim = Math.max(0, (bs.throwAnim || 0) - dt);
  stepProj(bs.proj, dt);
}
/* Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. */
function stepProj(list, dt, spare) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i]; p.t += dt; p.rot += dt * 9;
    if (p.dead) { list.splice(i, 1); continue; }
    if (p.t >= p.dur) {
      Snd.play('thud'); burst(p.tx, p.ty - 10, 12, { kind: 'dot', cols: ['#9C6A46', '#D6AA78', '#F3E2C0'], speed: 200, life: 0.6, g: 300, size: 7 });
      for (const h of P.heroes) if (dist(h.x, h.y, p.tx, p.ty) < 66 && !(spare && spare(h))) hitHero(h, p.tx, p.ty);
      list.splice(i, 1);
    }
  }
}

/* The reacting decor. Grass, clover, daisies, reeds, dandelions and leaves send up a little puff of leaves,
   petals or seeds and rustle when a hero walks past (a stomp makes the dandelions and leaves jump).
   Snails pull in and a ladybug flies off and comes back. Only what is near a hero or a ball reacts. */
function updateDecor(dt) {
  const L = P.L, cfg = CONFIG.heroes[0];
  if (!L.decor) return;
  const who = [];
  for (const h of P.heroes) who.push({ x: h.x, y: h.y, stomp: h.stompT >= 0 && h.stompT < 0.25 });
  for (const f of P.flock) who.push({ x: f.x, y: f.y, stomp: false });
  P.rustleT = Math.max(0, P.rustleT - dt);
  for (const d of L.decor) {
    if (!d.react) continue;
    d.cool = Math.max(0, d.cool - dt);
    let near = 1e9, jump = false;
    for (const w of who) { const dd = dist(w.x, w.y, d.x, d.y); if (dd < near) near = dd; if (w.stomp && dd < cfg.stompRadius) jump = true; }
    if (d.type === 'snail') { const want = near < 90 ? 1 : 0; d.hide += (want - d.hide) * Math.min(1, dt * 5); }
    else if (d.type === 'ladybug') {
      if (d.flyT > 0) d.flyT = Math.max(0, d.flyT - dt);
      else if (near < 60) { d.flyT = 2.2; Snd.play('pop'); }
    }
    else if (d.cool <= 0 && (jump || near < 70)) {          // a little puff, then a short rest
      d.cool = jump ? 0.9 : 0.7;
      const cols = d.type === 'daisy' || d.type === 'dandelion' ? PETALS : LEAVES;
      if (d.type === 'dandelion') burst(d.x, d.y - 30, 10, { kind: 'dot', cols: ['#FFF8EA', '#FFFFFF'], speed: 120, life: 1.4, g: -20, up: 40, size: 5 });
      else burst(d.x, d.y - 14, jump ? 10 : 5, { kind: d.type === 'daisy' ? 'petal' : 'leaf', cols, speed: jump ? 220 : 130, life: 1.1, g: 120, up: jump ? 120 : 60, size: 9 });
      if (d.type === 'grass' && P.rustleT <= 0) { P.rustleT = 0.8; Snd.play('rustle'); }
    }
  }
}

function updatePlay(dt) {
  const L = P.L;
  P.time += dt; P.sinceEgg += dt; P.comboT -= dt; P.rumbleT -= dt; P.bounceT -= dt; P.shake = Math.max(0, P.shake - dt); P.hintCharge = Math.max(0, P.hintCharge - dt);
  // the two friends: one calls for the other when they are far apart, and they cheer when they meet again
  { const a = P.heroes[0], c = P.heroes[1], sep = dist(a.x, a.y, c.x, c.y);
    for (const h of P.heroes) {
      if (sep > 1200) { h.farT = (h.farT || 0) + dt; if (h.farT > 5) { h.farT = 0; h.wasFar = true; Snd.talk(h.k, 'callFriend'); } }
      else { h.farT = 0; if (h.wasFar && sep < 250) { h.wasFar = false; Snd.talk(h.k, 'together'); } }
    } }
  if (P.banner) { P.banner.t -= dt; if (P.banner.t <= 0) P.banner = null; }
  // wind
  const w = P.wind;
  if (L.def.wind) {
    w.t -= dt;
    if (w.state === 'calm' && w.t <= 0) { w.state = 'warn'; w.t = 1.0; w.dir = Math.random() < 0.5 ? 1 : -1; Snd.play('whoosh'); }
    else if (w.state === 'warn' && w.t <= 0) { w.state = 'blow'; w.t = CONFIG.windDuration; Snd.talk(0, 'wind'); Snd.talk(1, 'wind'); }
    else if (w.state === 'blow' && w.t <= 0) { w.state = 'calm'; w.t = CONFIG.windEvery * (0.8 + Math.random() * 0.4); }
    const target = w.state === 'blow' ? L.def.wind : w.state === 'warn' ? 0.12 : 0;
    w.power += (target - w.power) * Math.min(1, dt * 3);
    if (w.power > 0.1 && Math.random() < dt * 26 * w.power) {
      const vw = W / P.cam.zoom, vh = H / P.cam.zoom;
      part(P.cam.x - w.dir * vw / 2 + (Math.random() - 0.5) * 200, P.cam.y - vh / 2 + Math.random() * vh, { vx: w.dir * (500 + Math.random() * 300), vy: 40 + Math.random() * 60, life: 2.2, max: 2.2, size: 9, col: LEAVES[Math.random() * 4 | 0], kind: 'leaf', vr: 8, drag: 0 });
    }
  }
  for (const m of L.mills) m.ang += dt * (0.45 + w.power * 5) * (w.dir || 1);
  for (const h of P.heroes) updateHero(h, dt);
  updateBall(dt);
  updateEggs(dt);
  updateEnemies(dt);
  if (P.boss) updateBoss(dt);
  if (P.duel) updateDuel(dt);
  for (const t of L.dynTrees) {
    t.shake = Math.max(0, t.shake - dt * 1.6);
    const act = (t.spark && t.spark.active && !t.spark.done) || (t.starTree && t.starTree.hidden);
    if (act && Math.random() < dt * 7) { const a = Math.random() * TAU, dd = Math.random() * t.R; part(t.x + Math.cos(a) * dd, t.y + Math.sin(a) * dd * 0.9, { vy: -18, life: 0.9, max: 0.9, size: t.starTree ? 9 : 7, col: t.starTree ? '#FFD0C4' : '#FFE9A0', kind: 'spark' }); }
  }
  // waves, nest
  if (P.nextWaveT >= 0) { P.nextWaveT -= dt; if (P.nextWaveT < 0) startWave(P.wave + 1); }
  updateDecor(dt);
  if (P.crow) { P.crow.t += dt; if (P.crow.t > 3.2) P.crow = null; }
  if (P.nestOpen && !P.done) {
    const near = P.heroes.map(h => dist(h.x, h.y, L.nest.x, L.nest.y) < 185);
    const solo = !Input.slots[0].joined || !Input.slots[1].joined;
    if (near[0] || near[1]) P.nestT += dt; else P.nestT = 0;
    P.nestOpenT = (P.nestOpenT || 0) + dt;
    const ready = P.nestOpenT > 14 || !P.eggs.some(e => !e.big);     // eggs still lying around: a little time to pick them up first
    if (ready && ((near[0] && near[1]) || ((near[0] || near[1]) && (solo || P.nestT > 7)))) { P.done = true; P.doneT = 0; Snd.play('win'); Snd.talk(0, 'levelWin'); Snd.talk(1, 'levelWin'); Input.rumble(0, 0.4, 0.8, 500); Input.rumble(1, 0.4, 0.8, 500); }
  }
  if (P.done) {
    P.doneT += dt;
    if (Math.random() < dt * 18) burst(L.nest.x + (Math.random() - 0.5) * 300, L.nest.y - 60 - Math.random() * 200, 8, { kind: Math.random() < 0.5 ? 'petal' : 'spark', cols: Math.random() < 0.5 ? PETALS : undefined, speed: 180, life: 1.2, g: 80 });
    if (P.doneT > 2.6) Game.levelEnd();
  }
  // butterfly
  if (!P.bfly) {
    P.bflyT -= dt;
    if (P.bflyT <= 0 && !P.done && !(P.boss && P.boss.state === 'won')) {
      const side = Math.random() < 0.5 ? -1 : 1, vw = W / P.cam.zoom;
      P.bfly = { x: clamp(P.cam.x + side * (vw / 2 + 40), 20, L.W - 20), y: clamp(P.cam.y - 100 + Math.random() * 200, L.top + 80, L.H - 80), t: 0, ph: Math.random() * 9, away: false,
        toFall: !!L.cave && P.bflyCount === 0 };
      P.bflyCount++;
    }
  } else {
    const b = P.bfly; b.t += dt;
    if (b.away) { b.y -= 260 * dt; b.x += Math.sin(b.t * 6) * 60 * dt; if (b.t > 2) { P.bfly = null; P.bflyT = lerp(CONFIG.butterflyEvery[0], CONFIG.butterflyEvery[1], Math.random()); } }
    else {
      const mx = (P.heroes[0].x + P.heroes[1].x) / 2, my = (P.heroes[0].y + P.heroes[1].y) / 2;
      const tx = b.toFall ? 1620 : mx + Math.sin(b.t * 0.7 + b.ph) * 240, ty = b.toFall ? 600 : my - 60 + Math.cos(b.t * 0.9 + b.ph) * 160;
      const dx = tx - b.x, dy = ty - b.y, m = Math.hypot(dx, dy) || 1, sp = 150 * dt;
      b.x += dx / m * Math.min(m, sp) + Math.sin(b.t * 5 + b.ph) * 40 * dt; b.y += dy / m * Math.min(m, sp) + Math.cos(b.t * 7) * 50 * dt;
      if (Math.random() < dt * 8) part(b.x, b.y, { vy: 20, life: 0.8, max: 0.8, size: 5, col: '#FFD48A', kind: 'spark' });
      for (const h of P.heroes) if (dist(h.x, h.y - 30, b.x, b.y) < 70) {
        for (const g of P.heroes) g.boost = CONFIG.butterflyTime;
        Snd.play('butterfly'); Snd.talk(h.k, 'butterfly'); burst(b.x, b.y, 24, { speed: 220, life: 1, cols: ['#FFD48A', '#FFF3C0', '#F2913C'] }); Input.rumble(0, 0, 0.5, 200); Input.rumble(1, 0, 0.5, 200);
        b.away = true; b.t = 0; break;
      }
      if (!b.away && b.t > (b.toFall ? 40 : 18)) { b.away = true; b.t = 0; }
    }
  }
  // lanterns, cave, waterfall glints
  for (const l of L.lanterns) {
    if (l.lit === 0) { for (const h of P.heroes) if (dist(h.x, h.y, l.x, l.y) < 200) { l.lit = 0.01; Snd.play('lantern'); burst(l.x + 20, l.y - 76, 8, { speed: 90, life: 0.8, cols: ['#FFE9B0', '#FFD48A'] }); break; } }
    else if (l.lit < 1) l.lit = Math.min(1, l.lit + dt * 1.5);
  }
  if (L.cave) {
    const cv = L.cave; let inside = false;
    for (const h of P.heroes) if (h.x > cv.x0 - 30 && h.x < cv.x1 + 30 && h.y < 566 && Math.abs(h.x - 1620) < 240) inside = true;
    cv.reveal += ((inside ? 1 : 0) - cv.reveal) * Math.min(1, dt * 4);
    P.glint -= dt;
    if (P.glint <= 0 && P.eggs.some(e => e.big)) { P.glint = 1.6 + Math.random() * 2; burst(1620 + (Math.random() - 0.5) * 120, 530 + Math.random() * 90, 4, { speed: 50, life: 1.2, g: -20, cols: ['#FFE9A0', '#FFF6D0'] }); }
    if (Math.random() < dt * 20) part(L.fall.x + (Math.random() - 0.5) * L.fall.w, L.fall.y1 + Math.random() * 20, { vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 40, life: 0.9, max: 0.9, size: 12, col: '#F4FBF4', kind: 'dust', drag: 1 });
  }
  // particles and rings
  stepParts(dt);
  for (let i = P.rings.length - 1; i >= 0; i--) { P.rings[i].t += dt; if (P.rings[i].t > 0.55) P.rings.splice(i, 1); }
  // camera: keep both heroes on screen, zoom out when they are far apart
  const a = P.heroes[0], b2 = P.heroes[1], cam = P.cam;
  let tz = Math.min(1, W / (Math.abs(a.x - b2.x) + 760), H / (Math.abs(a.y - b2.y) + 560)); tz = clamp(tz, L.minZoom, 1);
  cam.zoom += (tz - cam.zoom) * Math.min(1, dt * 2.5);
  const vw = W / cam.zoom, vh = H / cam.zoom;
  const tx = clamp((a.x + b2.x) / 2, vw / 2, L.W - vw / 2), ty = clamp((a.y + b2.y) / 2 - 30, vh / 2, L.H - vh / 2);
  cam.x += (tx - cam.x) * Math.min(1, dt * 4); cam.y += (ty - cam.y) * Math.min(1, dt * 4);
  cam.x = clamp(cam.x, vw / 2, L.W - vw / 2); cam.y = clamp(cam.y, vh / 2, L.H - vh / 2);
}
