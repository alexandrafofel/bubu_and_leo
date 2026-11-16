
/* ==========================================================================
   MINI-FIGHTS: when the last eggs of a level are collected, one of Ciori's
   friends guards the nest. Dodge its attack, then hit it while it is tired:
   Leo with the ball, Bubu with a stomp. Every hit throws golden eggs around.
   Standing in the nest is a shelter: nothing can hit a hero there.
   On "Ușor" every hit counts at any time. On "Normal" and "Greu" only hits
   on a tired guardian count, so the player has to wait for the right moment.
   Three attack patterns: charge (runs at you), hop (jumps on you), fly (swoops).
   ========================================================================== */
const DUEL_DEFS = [
  { id: 'beetle', pat: 'charge', speed: 150, dashes: 1, r: 46 },                     // level 1
  { id: 'owl',    pat: 'fly',    lobs: 2, swoops: 1, r: 40 },                        // level 2
  { id: 'crab',   pat: 'charge', speed: 175, dashes: 2, lobs: 2, r: 46 },            // level 3
  { id: 'whirl',  pat: 'hop',    hops: 2, shots: 6, shock: 115, r: 40 },             // level 4
  { id: 'frog',   pat: 'hop',    hops: 3, shock: 170, r: 46 },                       // level 5
  { id: 'chick',  pat: 'fly',    lobs: 3, swoops: 2, r: 40 }                         // level 6
];
/* Second game: the guardian is always George cel Rău. Small at first, bigger on every level, and with one more trick each time.
   pats = the attack patterns he takes turns with. size = how big he is drawn (and hit). */
const DUEL_DEFS_L = [
  { id: 'george', pats: ['charge'], speed: 150, dashes: 1, r: 44, size: 0.62 },                                                   // level 1: he only runs at you
  { id: 'george', pats: ['charge'], speed: 160, dashes: 1, lobs: 2, r: 44, size: 0.72 },                                         // level 2: and throws rocks
  { id: 'george', pats: ['hop'], hops: 2, shock: 120, r: 44, size: 0.82 },                                                       // level 3: he jumps on you
  { id: 'george', pats: ['hop', 'charge'], hops: 2, shots: 6, shock: 125, speed: 170, dashes: 1, r: 44, size: 0.92 },            // level 4: jumps, sparks fly, then he runs
  { id: 'george', pats: ['charge', 'hop'], speed: 180, dashes: 2, lobs: 2, hops: 2, shock: 150, r: 44, size: 1.02 },             // level 5: two runs, rocks, two jumps
  { id: 'george', pats: ['hop', 'charge'], hops: 3, shots: 6, shock: 165, speed: 185, dashes: 2, lobs: 3, r: 44, size: 1.14 }    // level 6: everything he knows
];
const duelDefs = () => isLupta() ? DUEL_DEFS_L : DUEL_DEFS;
/* kind 'mid': the middle fight, the same as before. kind 'nest': the harder one at the nest, bigger and quicker. */
function startDuel(kind = 'nest') {
  const L = P.L, defs = duelDefs(), def = defs[L.idx % defs.length], hard = kind === 'nest', F = CONFIG.duel;
  let top = -1; for (let k = 0; k < 2; k++) if (Input.slots[k].joined) top = Math.max(top, rank(k)); if (top < 0) top = 1;
  const hpTab = hard ? ((isLupta() && CONFIG.lupta.duelFinalHp) || F.finalHp) : ((isLupta() && CONFIG.lupta.duelHp) || F.hp);      // George has his own table: a little tougher
  const base = hpTab[L.idx % hpTab.length];
  const hp = clamp((base || 3) + (top === 0 ? -1 : top === 2 ? 1 : 0), 2, 9);
  const want = hard ? { x: L.nest.x - 320, y: L.nest.y - 30 } : { x: (L.spawn.x + L.nest.x) / 2, y: (L.spawn.y + L.nest.y) / 2 };
  const sc = (hard ? F.finalSize : 1) * (def.size || 1);
  const cells = L.reachCells(want.x, want.y, 0, hard ? 220 : 420, hard ? 0 : 8);
  // the nest guardian lands as close to its spot as it can; the middle one looks for the most open place near the middle (not the river bank, not a bridge)
  const room = c => hard ? 0 : L.reachCells(c.x, c.y, 0, 280, 0).length * 6;
  for (const c of cells) c.w = room(c) - dist(c.x, c.y, want.x, want.y) - (!hard && L.grid[L.ci(c.x, c.y)] === 1 ? 500 : 0);   // and not in the mud
  cells.sort((a, b) => b.w - a.w);
  const sp = cells.length ? cells[0] : want;
  P.duel = { def, kind, hard, sc, pat: def.pats ? def.pats[0] : def.pat, cyc: 1, R: def.r * sc, x: sp.x, y: sp.y, px: sp.x, py: sp.y, z: 700, face: -1, hp, maxHp: hp, state: 'enter', t: 0, n: 0, tx: sp.x, ty: sp.y, sx: sp.x, sy: sp.y, ex: sp.x, ey: sp.y,
    dx: -1, dy: 0, kx: 0, ky: 0, len: 0, run: 0, target: -1, proj: [], shots: [], rings: [], over: false, home: sp, land: null, landed: false, threw: false, bonk: false,
    stagCd: 0, flash: 0, hintT: 0, tonkT: 0, tiredDur: 2, tStart: P.time };
  P.banner = { kind: 'duel', t: 3.6, id: def.id, mid: !hard };
  Snd.play('duel'); Snd.play('caw'); Snd.music(hard ? 'duel2' : 'duel'); P.crow = { x: -200, y: 300, t: 0 };
  Voice.say(T(hard ? 'duel.say' : 'duel.midSay', T('duel.' + def.id)));
  Input.rumble(0, 0.5, 0.5, 250); Input.rumble(1, 0.5, 0.5, 250);
}
/* Who the guardian goes after: the bravest player who is not hidden in the nest. */
function duelFighter() {
  const d = P.duel; let best = -1, bs = -1e9;
  for (const h of P.heroes) {
    if (!Input.slots[h.k].joined || h.safe || h.down) continue;      // not a hero hidden in the nest, not one who waits for help
    const sc = rank(h.k) * 100000 - dist(h.x, h.y, d.x, d.y);
    if (sc > bs) { bs = sc; best = h.k; }
  }
  return best;
}
/* While a hero waits for the friend's help the fight rests: the guardian finishes what it was doing, hurts nobody and starts no new attack. */
const duelWaiting = () => P.heroes.some(h => h.down);
/* Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. */
const duelSpares = h => h.safe || duelWaiting() || (rank(h.k) === 0 && P.duel.target !== h.k && Input.slots[1 - h.k].joined);
/* A tired guardian can always be hit. On "Ușor" every hit counts at any time, except on a guardian that is only waiting for a hero to be helped up. */
const duelCanHurt = (k, how) => P.duel.state === 'tired' || (how === 'ball' && P.duel.state === 'stag') || ((rank(k) === 0 || (CONFIG.duel.mercy > 0 && (P.duel.downs || 0) >= CONFIG.duel.mercyMax)) && !duelWaiting());
function duelEggs(n) {
  const d = P.duel, L = P.L;
  const cells = L.reachCells(d.x, d.y, 90, 330, 2);
  for (let i = 0; i < n; i++) {
    const p = cells.length ? cells.splice(Math.random() * cells.length | 0, 1)[0] : { x: clamp(d.x + (Math.random() - 0.5) * 400, 60, L.W - 60), y: clamp(d.y + (Math.random() - 0.5) * 300, L.top + 60, L.H - 60) };
    P.eggs.push(makeEgg(p.x, p.y, { state: 'pop', sx: d.x, sy: d.y - 40 - d.z, req: false, delay: i * 0.06 }));
  }
}
function duelHit(k) {
  const d = P.duel, h = P.heroes[k], last = d.hp <= 1;
  d.hp--; d.flash = 0.6; P.shake = Math.max(P.shake, 0.3);
  Snd.play('goal'); Snd.play('squeak', 1 + (d.maxHp - d.hp) * 0.1); Snd.talk(k, last ? 'guardGone' : 'guardHit');
  Input.rumble(0, 0.6, 0.8, 260); Input.rumble(1, 0.6, 0.8, 260);
  burst(d.x, d.y - 40 - d.z, 34, { speed: 320, life: 1.1, size: 10 }); burst(d.x, d.y - 40 - d.z, 14, { kind: 'petal', cols: PETALS, speed: 240, life: 1.4, g: 90 });
  duelEggs(last ? CONFIG.duel.eggsAtEnd : CONFIG.duel.eggsPerHit);
  const dx = d.x - h.x, dy = d.y - h.y, m = Math.hypot(dx, dy) || 1; d.kx = dx / m * 420; d.ky = dy / m * 420;
  d.t = 0; d.land = null;
  if (last) { d.state = 'flee'; Snd.play('flee'); for (const p of d.proj) p.dead = true; d.shots.length = 0; d.face = dx >= 0 ? 1 : -1; }
  else d.state = 'hurt';
}
function duelBall(b) {
  const d = P.duel; if (d.over || d.state === 'enter' || d.state === 'flee' || d.state === 'hurt') return;
  if (d.z > 90 && rank(1) > 0) return;                       // too high: the ball flies under it
  if (dist(b.x, b.y, d.x, d.y - 20) > d.R + b.r + 12) return;
  if (duelCanHurt(1, 'ball')) { duelHit(1); b.state = 'return'; return; }
  const dx = b.x - d.x, dy = b.y - (d.y - 20), m = Math.hypot(dx, dy) || 1, v = Math.max(360, Math.hypot(b.vx, b.vy) * 0.8);
  b.vx = dx / m * v; b.vy = dy / m * v; b.x = d.x + dx / m * (d.R + b.r + 14); b.y = d.y - 20 + dy / m * (d.R + b.r + 14);
  if (d.tonkT <= 0) { Snd.play('tonk'); d.tonkT = 0.15; burst(b.x, b.y - 10, 5, { speed: 120, life: 0.35, cols: ['#FFF3C0', '#C9D6E8'] }); }
  d.flash = Math.max(d.flash, 0.2); d.hintT = 1.6;
}
function duelStomp(h) {
  const d = P.duel, cfg = CONFIG.heroes[0];
  if (d.over || d.z > 60 || d.state === 'enter' || d.state === 'flee' || d.state === 'hurt') return false;
  if (dist(h.x, h.y, d.x, d.y) > cfg.stompRadius + d.R) return false;
  if (duelCanHurt(0, 'stomp')) duelHit(0);
  else if (d.stagCd <= 0 && (d.state === 'move' || d.state === 'aim')) { d.state = 'stag'; d.t = 0; d.stagCd = 4.5; Snd.play('stun'); d.hintT = 0; }   // a stomp makes it wobble: Leo's ball counts now
  else { d.hintT = 1.6; Snd.talk(h.k, 'notYet'); }
  return true;                                               // it was close enough: this stomp (or this spin of the claws) is used up
}
function duelLob(n, slow) {                                  // throws n pinecones: the first where the target is going, the rest around
  const d = P.duel, L = P.L, tg = d.target >= 0 ? P.heroes[d.target] : null; if (!tg) return;
  for (let i = 0; i < n; i++) {
    const ox = i === 0 ? tg.vx * 0.6 : (Math.random() - 0.5) * 380, oy = i === 0 ? tg.vy * 0.6 : (Math.random() - 0.5) * 300;
    d.proj.push({ sx: d.x, sy: d.y - 40 - d.z, tx: clamp(tg.x + ox, 60, L.W - 60), ty: clamp(tg.y + oy, L.top + 50, L.H - 50), t: -i * 0.3, dur: 1.45 * slow, rot: 0, kind: isLupta() ? 'rock' : 'cone' });
  }
  Snd.play('pop');
}
function duelSnap(x, y) {                                    // nearest spot a guardian can stand on
  const L = P.L; if (L.reach[L.ci(x, y)]) return { x, y };
  const cs = L.reachCells(x, y, 0, 260, 0); let best = null, bd = 1e9;
  for (const c of cs) { const dd = dist(c.x, c.y, x, y); if (dd < bd) { bd = dd; best = c; } }
  return best;
}
function updateDuel(dt) {
  const d = P.duel, L = P.L, def = d.def;
  d.t += dt; d.flash = Math.max(0, d.flash - dt); d.stagCd = Math.max(0, d.stagCd - dt); d.tonkT = Math.max(0, d.tonkT - dt); d.hintT = Math.max(0, d.hintT - dt);
  stepProj(d.proj, dt, duelSpares);
  for (let i = d.rings.length - 1; i >= 0; i--) { d.rings[i].t += dt; if (d.rings[i].t > 0.45) d.rings.splice(i, 1); }
  for (let i = d.shots.length - 1; i >= 0; i--) {
    const s = d.shots[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; s.rot += dt * 8;
    let gone = s.life <= 0;
    for (const h of P.heroes) if (!gone && !duelSpares(h) && dist(h.x, h.y - 20, s.x, s.y) < 36) { hitHero(h, s.x, s.y); gone = true; }
    if (gone) d.shots.splice(i, 1);
  }
  if (d.over) return;
  d.px = d.x; d.py = d.y;
  let tg = d.target >= 0 ? P.heroes[d.target] : null;
  const F = d.hard ? CONFIG.duel : null, angry = d.hard && d.hp <= d.maxHp * CONFIG.duel.angryAt;
  // mercy: a fight never drags on. Every hero hit in this fight makes the guardian a little slower, its warnings longer, its tired moments longer
  const mz = Math.min(CONFIG.duel.mercyMax || 0, d.downs || 0) * (CONFIG.duel.mercy || 0);
  const rk = tg ? rank(tg.k) : 1, slow = [1.5, 1, 0.8][rk] * (F ? F.finalPrep : 1) * (1 + mz), sf = [0.6, 1, 1.25][rk] * (F ? F.finalSpeed : 1) * (1 - mz * 0.6);
  const more = Math.max(0, (rk === 2 ? 1 : 0) + (F ? F.finalExtra + (angry ? 1 : 0) : 0) - Math.floor((d.downs || 0) / 4));     // the nest fight: one more attack, and one more when angry (one less after every 4 hits on the heroes)
  if (angry) P.shake = Math.max(P.shake, 0.03);                                      // an angry guardian shakes the screen a little
  const go = st => { d.state = st; d.t = 0; };
  const cycle = () => { d.target = duelFighter(); d.n = 0; d.threw = false; if (def.pats) d.pat = def.pats[d.cyc++ % def.pats.length]; go('move'); };   // George takes turns with his tricks
  const tire = () => { go('tired'); Snd.play('tired'); d.tiredDur = CONFIG.duel.tiredTime * [1.4, 1, 0.75][rk] * (F ? F.finalTired : 1) * (1 + mz * 2) + (d.bonk ? 0.7 : 0); d.bonk = false; let lx = d.x, ly = d.y;
    if (d.pat === 'fly' && tg) { const ex = d.x - tg.x, ey = d.y - tg.y, em = Math.hypot(ex, ey) || 1, es = Math.min(em, 250); lx = tg.x + ex / em * es; ly = tg.y + ey / em * es; }   // a tired flyer flops down close to the fighter
    const p = duelSnap(lx, ly); d.land = p && (p.x !== d.x || p.y !== d.y) ? p : null; };
  const st = d.state;
  if (st === 'enter') {
    const u = Math.min(1, d.t / 0.9); d.z = 700 * (1 - u) * (1 - u);
    if (u >= 1 && !d.landed) { d.landed = true; Snd.play('thud'); P.shake = Math.max(P.shake, 0.25); burst(d.x, d.y, 16, { kind: 'dust', cols: ['#F3E2C0'], speed: 220, life: 0.6, size: 16, g: 0, drag: 3 }); }
    if (d.t > 2.2) cycle();
    return;
  }
  if (st === 'flee') {
    d.z += 380 * dt; d.x += d.face * 420 * dt; d.y -= 60 * dt;
    if (Math.random() < dt * 20) part(d.x, d.y - d.z - 30, { life: 0.6, max: 0.6, size: 8, kind: 'spark' });
    if (d.t > 1.7) { d.over = true; Snd.music(L.def.music); if (d.kind === 'nest') openNest(); else P.nextWaveT = 1.0; }   // after the middle fight the next wave comes
    return;
  }
  if (st === 'hurt') {
    d.x += d.kx * dt; d.y += d.ky * dt; const f = Math.max(0, 1 - dt * 4); d.kx *= f; d.ky *= f; d.z += (0 - d.z) * Math.min(1, dt * 8);
    collide(L, d, 30, false);
    if (d.t > 1.1) cycle();
    return;
  }
  if (st === 'stag') { if (d.t > 1.0) cycle(); return; }
  if (st === 'tired') {
    d.z += (0 - d.z) * Math.min(1, dt * 7);
    if (d.land) { d.x += (d.land.x - d.x) * Math.min(1, dt * 6); d.y += (d.land.y - d.y) * Math.min(1, dt * 6); }
    if (d.t > d.tiredDur) cycle();
    return;
  }
  if (st === 'lob') {
    if (!d.threw) { d.threw = true; duelLob((def.lobs || 1) + more, slow); }
    if (d.pat === 'fly') { if (d.t > 1.1) { if (tg && !tg.safe && !duelWaiting()) duelSwoop(tg); else cycle(); } }
    else if (d.t > 0.7) tire();
    return;
  }
  if (st === 'move' && duelWaiting()) {                      // a hero waits for help: the guardian looks around and waits too (touching it does not hurt now)
    d.t = Math.min(d.t, 0.2); d.face = Math.sin(P.time * 2.2) > 0 ? 1 : -1;
    if (d.pat === 'fly') d.z += (180 - d.z) * Math.min(1, dt * 3);
    return;
  }
  // ---- the three attack patterns ---------------------------------------------
  if (d.pat === 'charge') {
    if (st === 'move') {
      d.target = duelFighter(); tg = d.target >= 0 ? P.heroes[d.target] : null;
      const gx = tg ? tg.x : d.home.x, gy = tg ? tg.y : d.home.y, dx = gx - d.x, dy = gy - d.y, m = Math.hypot(dx, dy) || 1, v = def.speed * sf * (tg ? 1 : 0.5) * dt;
      if (m > 30) { d.x += dx / m * Math.min(m, v); d.y += dy / m * Math.min(m, v); d.face = dx >= 0 ? 1 : -1; }
      collide(L, d, 30, false);
      if (tg && (m < 430 || d.t > 2.8)) { d.dx = dx / m; d.dy = dy / m; go('aim'); Snd.play('warn'); }
    } else if (st === 'aim') {
      const dur = (d.n ? 0.5 : 0.85) * slow;
      if (tg && d.t < dur * 0.6) { const dx = tg.x - d.x, dy = tg.y - d.y, m = Math.hypot(dx, dy) || 1; d.dx = dx / m; d.dy = dy / m; d.face = dx >= 0 ? 1 : -1; }
      if (d.t >= dur) { go('dash'); Snd.play('swish'); }
    } else if (st === 'dash') {
      const v = 840 * clamp(sf, 0.75, 1.15) * dt; d.x += d.dx * v; d.y += d.dy * v;
      const c = collide(L, d, 30, false), wall = c && (c.nx * d.dx + c.ny * d.dy) < -0.45;
      if (Math.random() < dt * 40) part(d.x - d.dx * 30, d.y, { life: 0.5, max: 0.5, size: 14, col: '#F3E2C0', kind: 'dust', drag: 2 });
      if (wall) { Snd.play('thud'); P.shake = Math.max(P.shake, 0.22); d.bonk = true; burst(d.x + d.dx * 30, d.y - 30, 10, { speed: 160, life: 0.5 }); }
      const stop = wall || duelWaiting();                    // it ran into something, or a hero went down: no more attacks in this round, it gets tired
      if (wall || d.t > 0.72) { d.n++; if (!stop && d.n < def.dashes + more) { go('aim'); Snd.play('warn'); } else if (!stop && def.lobs) go('lob'); else tire(); }
    }
  } else if (d.pat === 'hop') {
    const plan = () => {
      let tx = d.home.x + (Math.random() - 0.5) * 300, ty = d.home.y + (Math.random() - 0.5) * 200;
      if (tg && !tg.safe) { const dx = tg.x - d.x, dy = tg.y - d.y, m = Math.hypot(dx, dy) || 1, s = Math.min(m, 390); tx = d.x + dx / m * s; ty = d.y + dy / m * s; }
      const p = duelSnap(tx, ty) || { x: d.x, y: d.y };
      d.sx = d.x; d.sy = d.y; d.tx = p.x; d.ty = p.y; d.face = d.tx >= d.x ? 1 : -1; go('aim'); Snd.play('warn');
    };
    if (st === 'move') { d.target = duelFighter(); tg = d.target >= 0 ? P.heroes[d.target] : null; if (tg) d.face = tg.x >= d.x ? 1 : -1; if (d.t > 0.7 * slow) plan(); }
    else if (st === 'aim') { if (d.t > (d.n ? 0.42 : 0.55) * slow) { go('jump'); Snd.play('swish'); } }
    else if (st === 'jump') {
      const u = Math.min(1, d.t / 0.62); d.x = lerp(d.sx, d.tx, u); d.y = lerp(d.sy, d.ty, u); d.z = Math.sin(u * Math.PI) * 200;
      if (u >= 1) {
        d.z = 0; Snd.play('thud'); P.shake = Math.max(P.shake, 0.22); d.rings.push({ x: d.x, y: d.y, t: 0, max: def.shock });
        burst(d.x, d.y, 14, { kind: 'dust', cols: ['#F3E2C0'], speed: 240, life: 0.5, size: 15, g: 0, drag: 3 });
        for (const h of P.heroes) if (!duelSpares(h) && dist(h.x, h.y, d.x, d.y) < def.shock - 8) hitHero(h, d.x, d.y);
        if (def.shots && !duelWaiting()) { const n = def.shots + more * 2, a0 = Math.random() * TAU; for (let i = 0; i < n; i++) { const a = a0 + i / n * TAU; d.shots.push({ x: d.x, y: d.y - 20, vx: Math.cos(a) * 230 * clamp(sf, 0.7, 1.1), vy: Math.sin(a) * 190 * clamp(sf, 0.7, 1.1), life: 2.3, rot: a }); } }
        d.n++; if (d.n < def.hops + more && !duelWaiting()) { d.target = duelFighter(); tg = d.target >= 0 ? P.heroes[d.target] : null; plan(); } else tire();
      }
    }
  } else {                                                   // fly
    if (st === 'move') {
      d.target = duelFighter(); tg = d.target >= 0 ? P.heroes[d.target] : null;
      d.z += (180 - d.z) * Math.min(1, dt * 3);
      const side = tg ? (d.x < tg.x ? -1 : 1) : 0, gx = tg ? tg.x + side * 260 : d.home.x + Math.sin(P.time) * 160, gy = tg ? tg.y - 40 : d.home.y, dx = gx - d.x, dy = gy - d.y, m = Math.hypot(dx, dy) || 1, v = 300 * sf * dt;
      if (m > 12) { d.x += dx / m * Math.min(m, v); d.y += dy / m * Math.min(m, v); }
      if (tg) d.face = tg.x >= d.x ? 1 : -1;
      if (tg && d.t > 1.5 * slow) { if (def.lobs) { d.threw = false; go('lob'); } else duelSwoop(tg); }
    } else if (st === 'aim') {
      d.x += (d.sx - d.x) * Math.min(1, dt * 5); d.y += (d.sy - d.y) * Math.min(1, dt * 5); d.z += (60 - d.z) * Math.min(1, dt * 3); d.face = d.dx >= 0 ? 1 : -1;
      if (d.t > 0.95 * slow) { d.x = d.sx; d.y = d.sy; d.run = 0; go('dash'); Snd.play('swish'); }
    } else if (st === 'dash') {
      const v = 920 * clamp(sf, 0.75, 1.15) * dt; d.x += d.dx * v; d.y += d.dy * v; d.run += v; d.z += (24 - d.z) * Math.min(1, dt * 10);
      if (d.run >= d.len) { d.n++; const t2 = duelFighter(); if (d.n < def.swoops + more && t2 >= 0 && !duelWaiting()) { d.target = t2; duelSwoop(P.heroes[t2]); } else tire(); }
    }
  }
  // touching a guardian that is on the ground and not tired hurts
  if (d.z < 40 && (d.state === 'move' || d.state === 'aim' || d.state === 'dash'))
    for (const h of P.heroes) if (!duelSpares(h) && dist(h.x, h.y, d.x, d.y) < d.R + HERO_R - 12) hitHero(h, d.x, d.y);
}
function duelSwoop(tg) {                                     // fly in a straight line through the place where the target stands
  const d = P.duel, L = P.L, side = d.x < tg.x ? -1 : 1;
  const sx = clamp(tg.x + side * 500, 40, L.W - 40), sy = clamp(tg.y - 30 + (Math.random() - 0.5) * 120, L.top + 40, L.H - 40);
  const dx = tg.x - sx, dy = tg.y - sy, m = Math.hypot(dx, dy) || 1;
  d.sx = sx; d.sy = sy; d.dx = dx / m; d.dy = dy / m;
  d.ex = clamp(tg.x + d.dx * 440, 40, L.W - 40); d.ey = clamp(tg.y + d.dy * 440, L.top + 40, L.H - 40);
  d.len = dist(sx, sy, d.ex, d.ey); d.state = 'aim'; d.t = 0; Snd.play('warn');
}

/* ---------- drawing the guardians ---------- */
function heartPath(c, x, y, s) {
  c.beginPath(); c.moveTo(x, y + s * 0.9);
  c.bezierCurveTo(x - s * 1.5, y - s * 0.1, x - s * 0.8, y - s * 1.1, x, y - s * 0.35);
  c.bezierCurveTo(x + s * 0.8, y - s * 1.1, x + s * 1.5, y - s * 0.1, x, y + s * 0.9); c.closePath();
}
const DUEL_PAINT = {
  beetle(c, d, t, mood) {                                    // the Beetle King: a big grumpy beetle with a tiny crown
    c.scale(1.9, 1.9);
    paintBeetleBody(c, { state: mood === 'dizzy' ? 'stun' : mood === 'angry' ? 'chase' : 'wake' }, t);
    c.fillStyle = '#F8C24E'; c.strokeStyle = 'rgba(180,110,40,0.6)'; c.lineWidth = 1.5; c.lineJoin = 'round'; c.beginPath();
    c.moveTo(-13, -39); c.lineTo(-15, -54); c.lineTo(-8, -47); c.lineTo(-2, -58); c.lineTo(4, -47); c.lineTo(11, -54); c.lineTo(9, -39); c.closePath(); c.fill(); c.stroke();
    soft(c, -2, -56, 2.6, 2.6, '#D9463C', 1, 3);
  },
  owl(c, d, t, mood) {
    const ang = d.z > 30 ? Math.sin(t * 15) * 0.6 - 0.1 : 1.25, eo = { t: t, dizzy: mood === 'dizzy', blinkOff: 0.7 };
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 28, -52); c.rotate(sd * ang); puff(c, sd * 22, 0, 30, 13, '#8A6A4E', 60 + sd); soft(c, sd * 26, 3, 18, 6, '#6E5440', 0.5, 66); c.restore(); }
    c.strokeStyle = '#E99A3C'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-10, -6); c.lineTo(-12, 1); c.moveTo(10, -6); c.lineTo(12, 1); c.stroke();
    puff(c, 0, -40, 34, 40, '#A07E5C', 61);
    soft(c, 0, -28, 22, 26, '#E8D2A8', 0.9, 62);
    c.strokeStyle = 'rgba(138,106,78,0.55)'; c.lineWidth = 2;
    for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-12 + (i % 3) * 12, -30 + (i / 3 | 0) * 13, 5, 0.2, Math.PI - 0.2); c.stroke(); }
    c.fillStyle = '#8A6A4E'; for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 10, -74); c.lineTo(sd * 29, -94); c.lineTo(sd * 31, -64); c.closePath(); c.fill(); }
    soft(c, -14, -60, 15.5, 15.5, '#F4E6C8', 1, 63); soft(c, 14, -60, 15.5, 15.5, '#F4E6C8', 1, 64);
    drawEye(c, -14, -60, 10, eo, 0.5); drawEye(c, 14, -60, 10, eo, 0.5);
    if (mood === 'angry') { c.strokeStyle = '#5A4030'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(-26, -76); c.lineTo(-6, -68); c.moveTo(26, -76); c.lineTo(6, -68); c.stroke(); }
    c.fillStyle = '#F0A040'; c.beginPath(); c.moveTo(-5.5, -53); c.lineTo(5.5, -53); c.lineTo(0, -42); c.closePath(); c.fill();
  },
  crab(c, d, t, mood) {
    const wig = mood !== 'dizzy' ? Math.sin(t * 16) * 4 : 0, snap = mood === 'angry' ? Math.abs(Math.sin(t * 13)) : 0.25, eo = { t: t, dizzy: mood === 'dizzy', blinkOff: 2 };
    c.strokeStyle = '#B4503C'; c.lineWidth = 5; c.lineCap = 'round';
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(sd * (24 + i * 7), -14); c.lineTo(sd * (44 + i * 9) + wig * (i % 2 ? 1 : -1), -1 + i * 2); c.stroke(); }
    for (const sd of [-1, 1]) {
      c.beginPath(); c.moveTo(sd * 34, -30); c.quadraticCurveTo(sd * 60, -38, sd * 58, -58); c.stroke();
      c.save(); c.translate(sd * 58, -66); c.scale(sd, 1); c.rotate(-0.5);
      puff(c, 10, -7 - snap * 6, 17, 8, '#E0705A', 70); puff(c, 10, 6 + snap * 3, 15, 7, '#D0604C', 73); puff(c, -3, 0, 12, 12, '#E0705A', 74);
      c.restore();
    }
    const g = c.createRadialGradient(-8, -38, 4, 0, -24, 46); g.addColorStop(0, '#F29A80'); g.addColorStop(0.6, '#E0705A'); g.addColorStop(1, '#B4503C');
    puff(c, 0, -26, 44, 26, g, 71);
    soft(c, -14, -36, 15, 6, '#FBC2B0', 0.6, 72);
    c.strokeStyle = '#B4503C'; c.lineWidth = 4;
    for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 11, -46); c.lineTo(sd * 13, -62); c.stroke(); drawEye(c, sd * 13, -68, 8.5, eo, 0); }
    c.strokeStyle = '#7A3428'; c.lineWidth = 3; c.beginPath(); if (mood === 'dizzy') { c.moveTo(-8, -22); c.quadraticCurveTo(0, -27, 8, -22); } else { c.moveTo(-9, -26); c.quadraticCurveTo(0, -19, 9, -26); } c.stroke();
  },
  whirl(c, d, t, mood) {                                     // a little whirlwind with eyes
    const eo = { t: t, dizzy: mood === 'dizzy', blinkOff: 1 }; let ex = 0;
    for (let i = 0; i < 6; i++) {
      const u = i / 5, w = 14 + u * 34, y = -6 - u * 80, ox = Math.sin(t * 6 + i * 0.9) * (3 + u * 6); if (i === 4) ex = ox;
      blobPath(c, ox, y, w, 9 + u * 5, 80 + i, 0.08, 10); c.fillStyle = rgba(i % 2 ? '#C9D6E8' : '#AFC0DA', 0.88); c.fill(); c.strokeStyle = 'rgba(110,130,170,0.3)'; c.lineWidth = 2; c.stroke();
      const a0 = (t * 9 + i * 1.3) % TAU; c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.ellipse(ox, y, w * 0.72, 4 + u * 3, 0, a0, a0 + 1.5); c.stroke();
    }
    drawEye(c, ex - 12, -70, 8.5, eo, 0.4); drawEye(c, ex + 12, -70, 8.5, eo, 0.4);
    if (mood === 'angry') { c.strokeStyle = '#6A7A9A'; c.lineWidth = 3; c.beginPath(); c.moveTo(ex - 22, -82); c.lineTo(ex - 6, -77); c.moveTo(ex + 22, -82); c.lineTo(ex + 6, -77); c.stroke(); }
    for (let i = 0; i < 3; i++) { const a = t * 7 + i * 2.1; c.save(); c.translate(Math.cos(a) * 46, -30 - i * 18 + Math.sin(a) * 9); c.rotate(a); c.fillStyle = LEAVES[i]; c.beginPath(); c.ellipse(0, 0, 9, 4, 0, 0, TAU); c.fill(); c.restore(); }
  },
  frog(c, d, t, mood) {
    const st = d.z > 20 ? 1.2 : d.state === 'aim' ? 0.82 : 1, eo = { t: t, dizzy: mood === 'dizzy', blinkOff: 0.4 };
    c.scale(1 / Math.sqrt(st), st);
    for (const sd of [-1, 1]) { puff(c, sd * 36, -13, 20, 14, '#6E9A52', 90 + sd); puff(c, sd * 48, -3, 15, 6, '#8DB866', 92 + sd); }
    const g = c.createRadialGradient(-10, -44, 4, 0, -28, 50); g.addColorStop(0, '#B4D684'); g.addColorStop(0.6, '#8DB866'); g.addColorStop(1, '#6E9A52');
    puff(c, 0, -30, 46, 31, g, 94);
    soft(c, 0, -19, 31, 17, '#EEF2C0', 0.9, 95);
    for (const sd of [-1, 1]) { puff(c, sd * 20, -60, 15, 14, '#8DB866', 96 + sd); drawEye(c, sd * 20, -62, 9.5, eo, 0); }
    soft(c, -30, -34, 6, 4, '#F4B6A0', 0.6, 98); soft(c, 30, -34, 6, 4, '#F4B6A0', 0.6, 99);
    c.strokeStyle = '#4E6E3A'; c.lineWidth = 3.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(-24, -37); c.quadraticCurveTo(0, mood === 'dizzy' ? -42 : -25, 24, -37); c.stroke();
    if (mood === 'dizzy') { c.fillStyle = '#F29A9A'; c.beginPath(); c.ellipse(4, -30, 6, 9, 0.2, 0, TAU); c.fill(); }
    soft(c, -18, -46, 5, 4, '#6E9A52', 0.6, 100); soft(c, 12, -50, 4, 3, '#6E9A52', 0.6, 101);
  },
  chick(c, d, t, mood) {                                     // Ciorel, Ciori's little nephew
    drawCiori(c, 0, 0, { scale: 1.25, t: t, fly: d.z > 30, mood: mood === 'dizzy' ? 'dizzy' : 'cheeky', body: '#4F7387', dark: '#3B596B', light: '#86AEBE', belly: '#A9C7D2' });
  },
  george(c, d, t, mood) {                                    // George cel Rău (second game): the same painter as the boss, the size comes from the level
    drawGeorge(c, 0, 0, { scale: 1.15, t: t, mood: mood, moving: d.state === 'move' || d.state === 'dash', walk: t * 12, squash: d.state === 'aim' ? 0.12 : d.z > 20 ? -0.12 : 0 });
  }
};
function drawDuelBoss(c) {
  const d = P.duel, t = P.time, s = d.state;
  const mood = (s === 'tired' || s === 'stag' || s === 'hurt' || s === 'flee') ? 'dizzy' : (s === 'aim' || s === 'dash' || s === 'jump' || s === 'lob') ? 'angry' : 'calm';
  c.save(); c.translate(d.x + (s === 'aim' && d.pat !== 'fly' ? Math.sin(t * 55) * 3 : 0), d.y - d.z);
  if (s === 'hurt') c.rotate(Math.sin(t * 30) * 0.25); else if (s === 'flee') c.rotate(d.t * 10 * d.face); else if (s === 'stag') c.rotate(Math.sin(t * 12) * 0.15);
  if (s === 'tired') { const br = Math.sin(t * 7) * 0.05; c.scale(1 + br, 1 - br); }
  if (s === 'flee') c.globalAlpha = clamp(1.7 - d.t, 0, 1);
  else if (d.flash > 0 && Math.sin(t * 45) > 0) c.globalAlpha = 0.5;
  c.scale(d.face * d.sc, d.sc);
  DUEL_PAINT[d.def.id](c, d, t, mood);
  c.restore(); c.globalAlpha = 1;
  if (s === 'tired' || s === 'stag') drawDizzyStars(c, d.x, d.y - d.z - 112, t);
}
/* Things on the ground during a mini-fight: where the next attack will land, shadows. (The shelter ring is in drawNestShelter.) */
function drawDuelGround(c) {
  const d = P.duel, L = P.L, t = P.time, pulse = 0.5 + 0.5 * Math.sin(t * 9);
  const red = a => rgba('#D9463C', a);
  if (d.state === 'aim' || d.state === 'dash' || d.state === 'jump') {
    c.lineCap = 'round';
    if (d.pat === 'charge') { c.strokeStyle = red(0.14 + pulse * 0.14); c.lineWidth = d.R * 1.7; c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x + d.dx * 600, d.y + d.dy * 600); c.stroke(); }
    else if (d.pat === 'fly') { c.strokeStyle = red(0.14 + pulse * 0.14); c.lineWidth = d.R * 1.7; c.beginPath(); c.moveTo(d.sx, d.sy); c.lineTo(d.ex, d.ey); c.stroke(); }
    else { const r = d.def.shock; c.fillStyle = red(0.1 + pulse * 0.1); c.beginPath(); c.ellipse(d.tx, d.ty, r, r * 0.6, 0, 0, TAU); c.fill(); c.strokeStyle = red(0.5); c.lineWidth = 5; c.setLineDash([16, 12]); c.stroke(); c.setLineDash([]); }
  }
  for (const r of d.rings) { const u = r.t / 0.45, rad = r.max * easeOut(u); c.strokeStyle = rgba('#FFF3C0', (1 - u) * 0.8); c.lineWidth = 12 * (1 - u) + 2; c.beginPath(); c.ellipse(r.x, r.y, rad, rad * 0.6, 0, 0, TAU); c.stroke(); }
  drawProjWarn(c, d.proj);
  if (!d.over) { const k = clamp(1 - d.z / 500, 0.25, 1); c.fillStyle = rgba(SHADOW, 0.24 * k); c.beginPath(); c.ellipse(d.x, d.y + 3, d.R * 1.1 * k, d.R * 0.36 * k, 0, 0, TAU); c.fill(); }
}
/* Things above everything: flying guardians, thrown pinecones, leaves, hearts. */
function drawDuelTop(c) {
  const d = P.duel, t = P.time;
  if (!d.over && d.z >= 70) drawDuelBoss(c);
  drawProjs(c, d.proj);
  for (const s of d.shots) {
    c.save(); c.translate(s.x, s.y); c.rotate(s.rot); c.globalAlpha = Math.min(1, s.life * 2);
    if (isLupta()) { c.fillStyle = RAINBOW[(s.rot * 3 | 0) % 7]; starPath(c, 0, 0, 17, 0); c.fill(); c.fillStyle = '#FFF8E0'; starPath(c, 0, 0, 8, 0); c.fill(); }      // George's sparks
    else { c.fillStyle = '#C96F4E'; c.beginPath(); c.ellipse(0, 0, 17, 8, 0, 0, TAU); c.fill(); c.strokeStyle = '#FFF3C0'; c.lineWidth = 2; c.beginPath(); c.moveTo(-13, 0); c.lineTo(13, 0); c.stroke(); }
    c.restore();
  }
  c.globalAlpha = 1;
  if (d.over || d.state === 'flee') return;
  const hy = d.y - d.z - 150, n = d.maxHp;
  for (let i = 0; i < n; i++) {
    heartPath(c, d.x + (i - (n - 1) / 2) * 30, hy, 10);
    if (i < d.hp) { c.fillStyle = '#E2574C'; c.fill(); c.strokeStyle = 'rgba(255,246,226,0.9)'; c.lineWidth = 3; c.stroke(); } else { c.fillStyle = 'rgba(120,90,100,0.3)'; c.fill(); }
  }
  if (d.state === 'tired' || d.state === 'stag') text(c, T('duel.now'), d.x, hy - 44, 40 + Math.sin(t * 10) * 4, '#C4573D', { title: true });
  else if (d.hintT > 0) { c.globalAlpha = Math.min(1, d.hintT); text(c, T('duel.wait'), d.x, hy - 40, 30, '#7A5A80', { weight: 'bold' }); c.globalAlpha = 1; }
}
