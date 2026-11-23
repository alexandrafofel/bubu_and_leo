
/* ==========================================================================
   GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss
   ========================================================================== */
const Game = { state: 'boot', t: 0, levelIdx: 0, team: { eggs: 0, stars: 0 }, results: [], diff: CONFIG.defaultDifficulty.slice(), paused: false, tries: [] };      // tries: how many times each chapter was started again
let P = null;                                   // everything about the level being played
const D = k => CONFIG.difficulty[Game.diff[k]] || CONFIG.difficulty.normal;
const rank = k => Game.diff[k] === 'easy' ? 0 : Game.diff[k] === 'hard' ? 2 : 1;      // 0 Ușor, 1 Normal, 2 Greu
/* The two abilities of this game. Any hero can have any of them, on either button (CONFIG: power = ✕, power2 = □).
   - 'spin'  turns around the hero: Boon's claws, Killer's gloves. Bubu's stomp is the same ability with time 0.
   - 'throw' sends things out in a circle: Leo's and Killer's balls, Boon's bones.
   abil gives the numbers of one ability for one hero: his own block if he has one, else the old names on the hero. */
function abil(k, kind) {
  const c = CONFIG.heroes[k];
  if (kind === 'spin') return c.spin || { radius: c.stompRadius, pull: c.pullRadius, cooldown: c.stompCooldown, stun: c.stunTime, time: c.spinTime || 0, look: c.spinTime ? 'claws' : 'stomp' };
  return c.throw || { speed: c.kickSpeed, speedMax: c.kickSpeedMax, charge: c.chargeTime, n: c.ballsPerKick, nMax: c.ballsPerKickMax, cooldown: c.kickCooldown, life: c.ballLife, lifeMax: c.ballLifeMax, look: 'ball' };
}
const hasAbil = (k, kind) => CONFIG.heroes[k].power === kind || CONFIG.heroes[k].power2 === kind;
/* Which button an ability sits on for this hero: 1 = ✕ (the first power), 2 = □ (the second). Decides the word and the hint. */
const abilSlot = (k, kind) => CONFIG.heroes[k].power2 === kind ? 2 : 1;
const _col = { nx: 0, ny: 0, hit: null };

/* Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. */
function buildLevel(idx) {
  const ch = chapters()[idx] || chapters()[0];
  if (ch.kind === 'boss') { const B = isLupta() ? genArena() : genBoss(); B.ch = idx; return B; }
  const n = ch.n;
  for (let a = 0; a < 80; a++) { const L = genLevel(n, 1000 + n * 97 + a * 13); if (L) { L.ch = idx; return paintLevel(L); } }
  throw new Error(T('err.level'));
}
function makeHero(k, x, y) {
  return { k, x, y, px: x, py: y, vx: 0, vy: 0, face: 1, ax: 1, ay: 0, walk: 0, moving: false, dizzy: 0, inv: 0, boost: 0, squash: 0, z: 0, cd: 0,
    stompT: -1, charge: 0, charging: false, kickT: 0, inMud: false, mudT: 0, tagT: 5, t: Math.random() * 5,
    down: false, downT: 0, downLeft: 0, downTick: null, hurried: false, callT: 0, small: 1, spinT: -1, spinNo: 0, shield: false, carried: null, hugT: 0, reachHint: 0, tooFarT: 0, giveT: 0, numT: 0, noT: 0,
    run: false, runIdle: 0, runT: 0, runRest: 0, runWord: -99, ghosts: [], ghostT: 0,         // run (L3): ghosts = the trail left behind
    throwCd: 0, homeState: 'held', home: { x, y, z: 0, spin: 0 }, chargeHold: 0,               // the thrown things (balls or bones): cooldown, whether they are all home, and the one kept at hand
    spinBeat: 0, spinLook: null, duelSweep: 0, bossSweep: 0,                                    // the spin (claws or gloves)
    tail: [0, 0, 0, 0], wasMoving: false, pz: 0, ghostCv: [], ghostNo: 0 };                    // the tail spring (two joints), squash on start / stop / landing, the ghosts' pictures
}
function makeEgg(x, y, o) {
  const e = Object.assign({ x, y, r: 17, seed: Math.random() * 10, req: true, value: 1, state: 'idle', t: 0, delay: 0, z: 0, pull: null, pullT: 0, big: false, hue: Math.random() * 7 | 0 }, o || {});   // hue: the color of a rainbow crystal (second game)
  if (e.goal === undefined) e.goal = e.req;      // goal: counts toward the quota (wave and tree eggs, and the ones a hit hero drops). The giant egg and the guardians' eggs do not.
  return e;
}
/* ---------- the egg quota (docs/27-cota-de-oua.md) ---------- */
function isJoined(k) { return !!Input.slots[k].joined; }
function bothJoined() { return isJoined(0) && isJoined(1); }
function quotaOn() { return !!(CONFIG.quota.on && P && P.q > 0 && !P.L.boss); }
function quotaOk(k) { return !isJoined(k) || P.found[k] >= P.q; }
function quotaState(k) { return { found: P.found[k], q: P.q, ok: quotaOk(k), extra: Math.max(0, P.found[k] - P.q) }; }      // no upper limit (T15): extra = how many over the quota
function flying(to) { let n = 0; for (const g of P.gifts) if (g.to === to) n++; return n; }      // eggs on their way to a hero
/* L1: the hero gives one of his quota eggs to the friend. Returns true when an egg left. */
function giveEgg(k) {
  if (!quotaOn()) return false;
  const h = P.heroes[k], f = P.heroes[1 - k], Q = CONFIG.quota;
  if (!isJoined(1 - k) || h.down || h.dizzy > 0 || h.carried || P.done) return false;
  if (P.found[k] < 1) { Snd.play('no', 0, k); h.noT = 0.5; return false; }                                      // nothing to give: the number shakes
  if (dist(h.x, h.y, f.x, f.y) > Q.giveRange) { h.tooFarT = 1.4; h.reachHint = 1.4; Snd.play('no', 0, k); return false; }
  sendEgg(k, 1 - k, false); Snd.talk(k, 'together');
  return true;
}
function updateGifts(dt) {
  for (let i = P.gifts.length - 1; i >= 0; i--) {
    const g = P.gifts[i], f = P.heroes[g.to];
    g.t += dt; const u = Math.min(1, g.t / CONFIG.quota.flyTime);
    g.x = lerp(g.x0, f.x, u); g.y = lerp(g.y0, f.y - 50, u); g.z = Math.sin(u * Math.PI) * 120;
    if (u < 1) continue;
    P.gifts.splice(i, 1);
    P.found[g.to]++; f.numT = 0.3;                      // nothing is lost: the egg arrives even if the giver was hit on the way
    Snd.play('egg', 0, g.to); Input.rumble(g.to, 0, 0.4, 80); Snd.talk(g.to, 'thanks');
    burst(f.x, f.y - 50, 8, { speed: 130, life: 0.6, up: 40 });
  }
}
/* The first time a hero has found his whole quota: tell the friend how to help (quotaDone), or, when the second one finishes too, say "to the nest" (quotaBoth).
   Once per hero per level, and only with two players. */
function updateQuotaMsg() {
  if (!quotaOn() || !bothJoined() || P.done) return;
  for (let k = 0; k < 2; k++) {
    if (P.quotaMsg[k] || P.found[k] < P.q) continue;
    if (P.found[1 - k] >= P.q) { P.quotaMsg[0] = P.quotaMsg[1] = true; P.banner = { kind: 'quotaBoth', t: 5 }; Snd.play('star', 0, k); return; }
    P.quotaMsg[k] = true; P.banner = { kind: 'quotaDone', t: 6, k, name: CONFIG.heroes[1 - k].name }; Snd.play('star', 0, k);
  }
}
/* C12: nobody stays stuck. After CONFIG.quota.autoGive seconds in the nest with a quota missing, the game itself
   moves one egg every autoEvery seconds, from the hero who is over his quota to the one who is short. 0 = off. */
function updateAutoGive(dt) {
  const Q = CONFIG.quota;
  if (!quotaOn() || !Q.autoGive || P.needT <= Q.autoGive) { P.autoT = 0; return; }
  P.autoT += dt; if (P.autoT < Q.autoEvery) return;
  P.autoT = 0;
  const k = quotaOk(0) ? 1 : 0, g = 1 - k;                              // k is short, g gives
  if (P.found[g] <= P.q) return;                                        // only what is over his own quota moves
  if (P.found[k] + flying(k) >= P.q) return;                            // the short one has enough already on its way
  sendEgg(g, k, true);
  P.banner = { kind: 'auto', t: 3, name: CONFIG.heroes[g].name };
}
/* C14: when a player joins in the middle of a level, what the friend holds over his quota goes to him, up to the newcomer's quota. */
function updateJoinQuota() {
  for (let k = 0; k < 2; k++) {
    const now = isJoined(k);
    if (now && !P.wasJoined[k] && quotaOn()) {
      const f = 1 - k;
      while (P.found[f] > P.q && P.found[k] + flying(k) < P.q) sendEgg(f, k, true);
    }
    P.wasJoined[k] = now;
  }
}
function sendEgg(from, to, auto) {                   // one egg leaves `from` and flies to `to` (by hand with L1, or by the game itself)
  const h = P.heroes[from];
  P.found[from]--; h.numT = 0.3;
  P.gifts.push({ from, to, t: 0, x0: h.x, y0: h.y - 50, x: h.x, y: h.y - 50, z: 0, seed: Math.random() * 10, auto: !!auto });
  Snd.play('give', 0, from); Input.rumble(from, 0.1, 0.3, 60);
}
function startPlay(L) {
  const bs = !!L.boss;
  P = { L, q: L.q || 0, found: [0, 0], gifts: [], needT: 0, autoT: 0, quotaMsg: [false, false], wasJoined: [isJoined(0), isJoined(1)], eggs: [], stars: L.stars, parts: [], rings: [], wave: -1, time: 0, sinceEgg: 0, levelEggs: 0, levelStars: 0, combo: 0, comboT: 0,
    cam: { x: L.spawn.x, y: L.spawn.y, zoom: 1 }, shake: 0, wind: { t: CONFIG.windEvery * 0.7, state: 'calm', dir: 1, power: 0 },
    freeze: 0, kickT: 99, latch: {},
    bfly: null, bflyT: 20 + Math.random() * 12, bflyCount: 0, crow: null, nestOpen: false, nestT: 0, done: false, doneT: 0, banner: null,
    tut: [{ moved: 0, used: false, used2: false, ran: false }, { moved: 0, used: false, used2: false, ran: false }], runHint: 0, runHintDone: false, nextWaveT: -1, waveNeed: 1, waveGot: 0, duel: null, hits: 0, hintCharge: 0, rumbleT: 0, bounceT: 0, glint: 0,
    heroes: [makeHero(0, bs ? 700 : L.spawn.x - 55, bs ? 830 : L.spawn.y), makeHero(1, bs ? 1220 : L.spawn.x + 55, bs ? 830 : L.spawn.y + 10)],
    flock: [], kickNo: 0, midFought: false, nestFought: false, rustleT: 0, boss: null,                                                         // the balls in the air (one kick = many balls)
    heal: [], rescues: 0, rainbow: [], rainbows: 0 };                                                                                                         // magic balls on their way to a friend; the colors of crystals collected so far
  for (const s of P.stars) { s.got = false; s.z = 0; s.pop = 0; }
  for (const e of L.beetles) e.hp = e.maxHp || CONFIG.smallEnemy.hits;      // Little George has his own 3 hearts (T15)
  for (const e of L.cones) e.hp = CONFIG.smallEnemy.hits;
  if (L.cave) P.eggs.push(makeEgg(L.cave.egg.x, L.cave.egg.y, { big: true, value: CONFIG.giantEggValue, r: 44, req: false }));
  if (bs) {
    P.boss = { phase: 0, state: 'up', t: 0, shakes: 0, throwT: 3, x: L.nest.x, y: L.nest.y, fx: 0, fy: 0, treeShake: 0, proj: [], cawT: 0, said: false, rings: [], sc: 1 };
    P.cam.x = L.W / 2; P.cam.y = L.H / 2;
  } else startWave(0);
  // the team total is the best result of every other chapter, plus what is gathered here (so playing a chapter again cannot spoil it)
  const ci = L.ch != null ? L.ch : Game.levelIdx, base = sumResults(Game.results.filter((r, i) => i !== ci));
  P.baseEggs = base.eggs; P.baseStars = base.stars; Game.team = { eggs: base.eggs, stars: base.stars };
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
/* ---------- The weight of a hit (T6.9, S7.6) ----------
   bigHit(): the game holds its breath for CONFIG.look.freeze seconds (updatePlay does not run, the drawing does) and the camera comes
   closer by look.kick in look.kickIn seconds and goes back in look.kickOut. Called when a guardian is hit and when George falls;
   a gate that opens or a boulder that falls (T7) calls it too. The shake (P.shake) is separate and unchanged. */
function bigHit() {
  const K = CONFIG.look;
  if (K.freeze > 0) P.freeze = Math.max(P.freeze, K.freeze);
  if (K.kick > 0) P.kickT = 0;
}
/* The zoom of the camera at this moment: 1 + kick while it comes closer (easeOut) and while it goes back (easeOut the other way). */
function kickZoom() {
  const K = CONFIG.look, t = P.kickT;
  if (K.kick <= 0 || t >= K.kickIn + K.kickOut) return 1;
  return 1 + K.kick * (t < K.kickIn ? easeOut(t / K.kickIn) : 1 - easeOut((t - K.kickIn) / K.kickOut));
}
/* Called every frame before updatePlay. True while the game holds its breath: then updatePlay must not run. A button that is pressed or
   let go in these frames (they last 0.06 s, three or four frames) is not lost: it is kept and given to the first frame that runs. */
const EDGES = ['aP', 'aR', 'cP', 'cR', 'hP', 'runP'];
function holdBreath(dt) {
  P.kickT += dt;
  const slots = Input.slots;
  if (P.freeze > 0) {
    P.freeze -= dt;
    for (let k = 0; k < 2; k++) for (const e of EDGES) if (slots[k][e]) (P.latch[k] || (P.latch[k] = {}))[e] = true;
    return true;
  }
  for (const k in P.latch) { for (const e in P.latch[k]) slots[k][e] = true; delete P.latch[k]; }
  return false;
}
/* A mechanism clicks and sparks just before it moves (anticipation, S7.6). The pull-back itself is mechMove (02-core.js). */
function mechClick(x, y) {
  Snd.play('click');
  burst(x, y, 5, { speed: 140, life: 0.35, size: 5 });
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
  if (e.goal && quotaOn()) P.found[!isJoined(k) && isJoined(1 - k) ? 1 - k : k]++;      // alone: what the hero who is not playing picks up counts for the one who plays (T15)
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
    if (isLupta()) rainbowAdd(e, k);
  }
  checkWave();
}
/* Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. */
function rainbowAdd(e, k) {
  if (P.rainbow.indexOf(e.hue) < 0) P.rainbow.push(e.hue);
  if (P.rainbow.length < 7) return;
  const n = CONFIG.lupta.rainbowBonus, h = P.heroes[k];
  P.rainbow.length = 0; P.rainbows++; Game.team.eggs += n; P.levelEggs += n;
  P.banner = { kind: 'rainbow', t: 3 }; Snd.play('star', 0, k); Input.rumble(k, 0.3, 0.7, 200);
  for (let i = 0; i < 7; i++) burst(h.x, h.y - 60, 8, { cols: [RAINBOW[i]], speed: 260, life: 1.3, size: 10, up: 90 });
}
function collectStar(s, k) {
  s.got = true; Game.team.stars++; P.levelStars++;
  Snd.play('star', 0, k); Snd.talk(k, 'star'); burst(s.x, s.y - 20, 26, { kind: 'petal', cols: PETALS, speed: 230, life: 1.3, g: 90, up: 60 }); burst(s.x, s.y - 20, 16, { speed: 200, life: 0.9 });
  Input.rumble(k, 0.3, 0.7, 160);
}
/* The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens.
   With the quota (T15) the waves only light the next glowing trees, and George comes from the diamonds (updateGeorge). */
function checkWave() {
  const L = P.L; if (L.boss || P.nestOpen || P.nextWaveT >= 0) return;
  if (P.eggs.some(e => e.req)) return;
  if (L.trees.some(t => t.spark && t.spark.active && !t.spark.done)) return;
  if (P.duel && !P.duel.over) return;                                     // a mini-fight is on
  if (quotaOn()) { if (P.wave < L.NW - 1) P.nextWaveT = 1.0; return; }
  if (CONFIG.duel.enabled && !P.midFought && P.wave === L.NW - 2) { P.midFought = true; startDuel('mid'); return; }
  if (P.wave < L.NW - 1) { P.nextWaveT = 1.0; return; }
  if (CONFIG.duel.enabled && !P.nestFought) { P.nestFought = true; startDuel('nest'); return; }
  openNest();
}
function openNest() { P.nestOpen = true; P.banner = { kind: 'nest', t: 5 }; Snd.play('wave'); Snd.talk(0, 'nestOpen'); Snd.talk(1, 'nestOpen'); }
/* ---------- T15: diamonds from enemies, George from diamonds (docs/28-t15-george-de-doua-ori.md) ---------- */
function teamNeed() { return P.q * (bothJoined() ? 2 : 1); }                                  // alone, the friend's quota counts as found
function teamFound() { return P.found[0] + P.found[1] + P.gifts.length; }                    // a diamond in the air still belongs to the team
/* George comes when the team has half of what it needs (the middle fight) and again when it has all of it (the nest fight). */
function updateGeorge() {
  if (!quotaOn() || P.done || P.nestOpen || (P.duel && !P.duel.over)) return;
  const n = teamFound(), need = teamNeed();
  if (!CONFIG.duel.enabled) { if (n >= need) openNest(); return; }                          // without fights the nest opens with the diamonds
  if (!P.midFought) { if (n >= Math.ceil(need / 2) && P.time >= CONFIG.lupta.george.minT) { P.midFought = true; startDuel('mid'); } return; }
  if (!P.nestFought && n >= need) { P.nestFought = true; startDuel('nest'); }
}
/* A defeated small enemy leaves diamonds: the only place they come from. Thrown enemies too; nothing else. */
function dropGems(e) {
  if (!quotaOn()) return;
  const n = e.drop != null ? e.drop : CONFIG.lupta.enemyDrop;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, d = 26 + Math.random() * 22;
    P.eggs.push(makeEgg(e.x + Math.cos(a) * d, e.y + Math.sin(a) * d * 0.6, { state: 'pop', sx: e.x, sy: e.y - 40, delay: i * 0.1, req: false, goal: true }));
  }
}
/* A snail crawls out of a glowing tree. It is a small enemy like the robots: it chases, it can be beaten, it comes back after a while. */
function addSnail(x, y, i) {
  P.L.beetles.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, state: 'wake', t: 0.7 + i * 0.25, face: Math.random() < 0.5 ? 1 : -1, seed: Math.random() * 10, r: 26, look: 'snail', born: 0.5, cool: 0, hp: CONFIG.smallEnemy.hits });
}
function shakeTree(t, power, byStomp) {
  const L = P.L;
  t.shake = Math.max(t.shake, 0.5 + power * 0.5);
  if (t.spark && t.spark.active && !t.spark.done) {
    t.spark.done = true; t.shake = 1; Snd.play('rustle'); Snd.play('pop');
    if (quotaOn()) t.spark.targets.slice(0, CONFIG.lupta.treeSnails).forEach((p, i) => addSnail(p.x, p.y, i));      // T15: the glowing tree hides snails, not diamonds
    else t.spark.targets.forEach((p, i) => P.eggs.push(makeEgg(p.x, p.y, { state: 'pop', sx: t.cx, sy: t.cy - 20, delay: i * 0.12 })));
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
/* How many seconds the friend has. After a few restarts of the same chapter the children get more time (the safety net). */
function rescueLimit() {
  const RS = CONFIG.rescue;
  if (!(RS.limit > 0)) return 0;
  const tries = (Game.tries && Game.tries[Game.levelIdx]) || 0;
  return RS.retryMercy > 0 && tries >= RS.retryMercy ? RS.limitMercy : RS.limit;
}
/* The ten seconds of a hero who is down: a wooden tick and a short shake on BOTH controllers every second,
   twice a second and stronger in the last three. At zero the chapter starts again. */
function countDown(h, dt) {
  h.downLeft = Math.max(0, h.downLeft - dt);
  const hurry = h.downLeft <= 3, beat = hurry ? 2 : 1, now = Math.ceil(h.downLeft * beat);    // the last three seconds tick twice as often
  if (h.downTick == null) h.downTick = now;
  else if (now < h.downTick) {
    h.downTick = now;
    if (h.downLeft > 0) {
      Snd.play('tick', hurry ? 1 : 0);
      for (let k = 0; k < 2; k++) if (Input.slots[k].joined) Input.rumble(k, hurry ? 0.4 : 0, hurry ? 0.6 : 0.35, hurry ? 90 : 60);
    }
    if (hurry && !h.hurried) { h.hurried = true; Snd.talk(1 - h.k, 'hurry'); }
  }
  if (h.downLeft <= 0) Game.failLevel();
}
function hitHero(h, sx, sy) {
  if (h.down || h.dizzy > 0 || h.inv > 0 || P.done || h.safe || h.shield || h.carried) return;
  if (!Input.slots[h.k].joined) return;          // a hero nobody controls cannot lose eggs
  P.hits++;
  if (P.duel && !P.duel.over) P.duel.downs = (P.duel.downs || 0) + 1;      // the guardian goes a little easier after every hit (CONFIG.duel.mercy)
  const d = D(h.k), L = P.L;
  h.dizzy = d.dizzyTime; h.inv = d.dizzyTime + 1.6; h.charging = false; h.charge = 0; h.squash = 0.25; h.stompT = -1; h.spinT = -1; h.z = 0;
  // with a friend in the game the hero stays down until the friend comes and helps (□)
  if (CONFIG.rescue.enabled && Input.slots[1 - h.k].joined) {
    h.down = true; h.downT = 0; h.callT = 1.3;
    h.downLeft = rescueLimit(); h.downTick = null; h.hurried = false;      // the ten seconds start now (0 = no limit)
    if (h.downLeft > 0) Input.rumble(1 - h.k, 0.6, 0.5, 300);              // the friend feels it too: come, quickly
  }
  const dx = h.x - sx, dy = h.y - sy, m = Math.hypot(dx, dy) || 1; h.vx = dx / m * 260; h.vy = dy / m * 260;
  Snd.play('bonk', 0, h.k); Snd.talk(h.k, 'hurt'); h.dizzyVoice = P.time + 0.9; Input.rumble(h.k, 0.9, 0.6, 300); P.shake = Math.max(P.shake, 0.12);
  burst(h.x, h.y - 50, 8, { speed: 120, life: 0.6, cols: ['#FFE08A', '#FFF3C0'] });
  // a hero drops one of his own quota eggs (none if he has none: the friend's eggs are safe). In the big fight: what was gathered there.
  const QO = quotaOn(), canDrop = QO ? P.found[h.k] > 0 : P.levelEggs > 0;
  if (canDrop) {
    if (QO) P.found[h.k]--;
    Game.team.eggs--; P.levelEggs--;
    let cells = L.reachCells ? L.reachCells(h.x, h.y, 80, 200, 4) : [];
    const p = cells.length ? cells[Math.random() * cells.length | 0] : { x: clamp(h.x + (Math.random() - 0.5) * 240, 60, L.W - 60), y: clamp(h.y + 60 + Math.random() * 100, L.top + 60, L.H - 60) };
    P.eggs.push(makeEgg(p.x, p.y, { state: 'pop', sx: h.x, sy: h.y - 40, req: false, goal: QO, delay: 0.1, wait: 0.9, dropped: true }));
    Snd.play('drop', 0, h.k);
  }
}
/* ---------- rescue: the friend helps a hero who was hit ---------- */
const HEALS = ['#FFD0DC', '#FFF3C0', '#BFE8D0', '#FFE08A'];
function getUp(h, by) {
  const ring = h.downLeft > 0;
  h.down = false; h.dizzy = 0; h.inv = CONFIG.rescue.safeAfter; h.squash = -0.18; h.wasDizzy = false; h.dizzyVoice = 0;
  h.downLeft = 0; h.downTick = null; h.hurried = false;                 // the ten seconds stop here
  Snd.play('heal', 0, h.k);
  if (ring) for (let i = 0; i < 10; i++) {                              // the ring of beads breaks into sparks
    const a2 = i / 10 * TAU - Math.PI / 2;
    part(h.x + Math.cos(a2) * 76, h.y - 50 + Math.sin(a2) * 40, { vx: Math.cos(a2) * 150, vy: Math.sin(a2) * 90, life: 0.6, max: 0.6, size: 10, col: CONFIG.heroes[1 - h.k].color, kind: 'spark' });
  }
  burst(h.x, h.y - 46, 20, { cols: HEALS, speed: 200, life: 1, up: 70, size: 9 });
  for (let i = 0; i < 5; i++) part(h.x + (Math.random() - 0.5) * 50, h.y - 40 - Math.random() * 40, { vy: -60 - Math.random() * 40, life: 1.1, max: 1.1, size: 12, col: '#F29C9C', kind: 'heart', g: -20 });
  if (by) { P.rescues++; Snd.talk(h.k, 'thanks'); Input.rumble(h.k, 0.2, 0.7, 200); Input.rumble(by.k, 0.2, 0.6, 140); }
  else Snd.talk(h.k, 'recover');
}
/* □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. */
function tryRescue(h) {
  const o = P.heroes[1 - h.k], R = CONFIG.rescue;
  if (!o.down) return false;
  if (dist(h.x, h.y, o.x, o.y) > (h.k === 0 ? R.reachNear : R.reachFar)) { h.reachHint = 1.8; Snd.talk(h.k, 'notYet'); return false; }
  h.face = o.x >= h.x ? 1 : -1; Snd.talk(h.k, 'rescue');
  if (h.k === 0) { h.hugT = 0.7; getUp(o, h); }
  else if (!P.heal.some(q => q.to === o)) { P.heal.push({ x: h.x + h.face * 30, y: h.y - 34, to: o, by: h, spin: 0 }); h.kickT = 0.28; Snd.play('kick', 0.2, 1); }
  return true;
}
function updateRescue(dt) {
  const a = P.heroes[0], b = P.heroes[1], R = CONFIG.rescue;
  if (a.down && b.down) {
    if (R.bothDownRestart && R.limit > 0) { for (const h of [a, b]) if (h.downLeft > R.bothDown) { h.downLeft = R.bothDown; h.downTick = null; } }   // nobody left to help: the level starts again soon
    else if (Math.min(a.downT, b.downT) > R.bothDown) { getUp(a, null); getUp(b, null); }                                                            // the old rule: both get up alone
  }
  for (let i = P.heal.length - 1; i >= 0; i--) {
    const q = P.heal[i], dx = q.to.x - q.x, dy = q.to.y - 40 - q.y, m = Math.hypot(dx, dy) || 1, v = R.ballSpeed * dt;
    q.spin += dt * 12;
    if (m < 34 || !q.to.down) { if (q.to.down) getUp(q.to, q.by); P.heal.splice(i, 1); continue; }
    q.x += dx / m * Math.min(m, v); q.y += dy / m * Math.min(m, v);
    part(q.x, q.y, { life: 0.5, max: 0.5, size: 8, col: isLupta() ? RAINBOW[Math.random() * 7 | 0] : HEALS[Math.random() * 4 | 0], kind: 'spark' });
  }
}
/* A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. */
function hurtSmall(e) {
  e.hp = (e.hp == null ? (e.maxHp || CONFIG.smallEnemy.hits) : e.hp) - 1; e.flash = 0.4;
  if (e.hp > 0) return false;
  dropGems(e);
  Snd.play('poof'); burst(e.x, e.y - 20, 14, { kind: 'dust', cols: ['#FFF3E0', '#F3E2C0'], speed: 150, life: 0.6, size: 16, g: -30, drag: 2 }); burst(e.x, e.y - 20, 8, { speed: 190, life: 0.6 });
  return true;
}

/* ---------- powers ---------- */
/* What the first hero's power does to everything around him. id = this stomp (or this spin of the claws):
   every enemy, tree and guardian feels it once per id. */
function powerSweep(h, id) {
  const L = P.L, cfg = abil(h.k, 'spin'), R = cfg.radius;
  const stun = cfg.stun * (rank(h.k) === 0 ? 1.3 : 1);
  let stunned = 0;
  for (const b of L.beetles) if (b.state !== 'dead' && b.sweep !== id && dist(b.x, b.y, h.x, h.y) < R + b.r) {
    b.sweep = id; stunned++;
    if (hurtSmall(b)) { b.state = 'dead'; b.t = CONFIG.smallEnemy.respawn; } else { b.state = 'stun'; b.t = stun; }
  }
  if (stunned) Snd.talk(h.k, 'beetleStun');
  for (const c of L.cones) if ((c.state === 'roll' || c.state === 'stun') && c.sweep !== id && dist(c.x, c.y, h.x, h.y) < R + c.r) {
    c.sweep = id;
    if (hurtSmall(c)) { c.state = 'gone'; c.t = CONFIG.smallEnemy.respawn; } else { c.state = 'stun'; c.t = stun; }
  }
  if (L.birds) for (const bd of L.birds) if (bd.state === 'fly' && bd.sweep !== id && dist(bd.x, bd.y, h.x, h.y) < R + 40) { bd.sweep = id; hitBird(bd); }
  for (const e of P.eggs) if (e.state === 'idle' && e.delay <= 0 && !e.big && dist(e.x, e.y, h.x, h.y) < cfg.pull) { e.pull = h; e.pullT = 1.5; }
  for (const t of L.dynTrees) if (t.sweep !== id && dist(t.cx, t.cy, h.x, h.y) < R + t.cr) { t.sweep = id; shakeTree(t, 0.5, true); }
  if (P.duel && h.duelSweep !== id && duelStomp(h)) h.duelSweep = id;
  if (P.boss && h.bossSweep !== id && bossShake(h)) h.bossSweep = id;
}
function doStomp(h) {
  const cfg = abil(h.k, 'spin');
  Snd.play('stomp', 0, h.k); Input.rumble(h.k, 0.85, 0.4, 170); P.shake = Math.max(P.shake, 0.22); h.squash = 0.22;
  P.rings.push({ x: h.x, y: h.y, t: 0, max: cfg.radius });
  for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; part(h.x + Math.cos(a) * 30, h.y + Math.sin(a) * 14, { vx: Math.cos(a) * 230, vy: Math.sin(a) * 110, life: 0.6, max: 0.6, size: 16, col: '#F3E2C0', kind: 'dust', drag: 3 }); }
  burst(h.x, h.y - 10, 8, { kind: 'petal', cols: PETALS, speed: 200, life: 1.1, g: 120, up: 80 });
  powerSweep(h, ++P.kickNo);
}
/* A hero starts his spin: Bubu jumps and stomps; Boon's claws and Killer's gloves grow and spin around him
   (a shield that also gathers crystals). Nothing starts while the other power of the same hero is running. */
function startSpin(h) {
  const cfg = abil(h.k, 'spin'), slot = abilSlot(h.k, 'spin');
  if (h.cd > 0 || h.dizzy > 0 || h.stompT >= 0 || h.spinT >= 0 || h.carried || h.charging) return false;
  h.cd = cfg.cooldown; P.tut[h.k][slot === 2 ? 'used2' : 'used'] = true; Snd.talk(h.k, slot === 2 ? 'power2' : 'power');
  if (cfg.time) {
    h.spinT = 0; h.spinNo = ++P.kickNo; h.spinLook = cfg.look; h.spinBeat = 0;
    if (cfg.look === 'gloves') { Snd.play('gloves', 0, h.k); spinBeat(h); }      // the gloves: three short shakes, and their own sound
    else { Snd.play('stomp', 0, h.k); Input.rumble(h.k, 0.5, 0.6, cfg.time * 900); }
  } else h.stompT = 0;
  return true;
}
/* The gloves shake the controller in three short beats (0, 0.28 and 0.56 s), so they feel different in the hand. */
function spinBeat(h) { h.spinBeat++; Input.rumble(h.k, 0.7, 0.9, 110); }
/* A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. */
function bossShake(h) {
  const L = P.L, b = P.boss, tb = L.treeBase;
  if (dist(h.x, h.y, tb.x, tb.y) >= 360) return false;
  b.treeShake = 1; Snd.play('rustle');
  if (L.arena) burst(tb.x + (Math.random() - 0.5) * 300, tb.y - 80 - Math.random() * 160, 18, { kind: 'dot', cols: ['#C9C0E8', '#9A8EC8', '#FFE08A'], speed: 240, life: 1.2, g: 320, size: 9 });
  else burst(tb.x + (Math.random() - 0.5) * 500, 260, 22, { kind: 'leaf', cols: L.pal.canopy, speed: 260, life: 2, g: 140, size: 11 });
  if (b.state === 'up') {
    b.shakes++;
    if (b.shakes >= (CONFIG.boss.shakes[b.phase] || 1)) { b.state = 'falling'; b.t = 0; b.fx = tb.x + (h.x < tb.x ? 240 : -240); b.fy = 640; b.sx = b.x; b.sy = b.y; Snd.play('caw'); }
  }
  return true;
}
function newBall(x, y, vx, vy, power, life, kick, size, hop, owner, look) {
  return { state: 'fly', x, y, px: x, py: y, vx, vy, power, life, kick, r: 15 * size, z: 0, spin: 0, hop: hop || 0, owner, look, trail: [] };   // hop: the balls bounce up and down as they fly. trail: the bones' arc
}
/* This hero can throw again: everything of his is home, or his cooldown is over. */
const throwReady = h => h.homeState === 'held' || h.throwCd <= 0;
/* One throw sends n things out in a circle, so the power goes in every direction. Stick direction = the first one.
   Killer and Leo throw balls, Boon throws boomerang bones: the same rules, their own numbers and their own look. */
function throwRing(h, power, ax, ay) {
  const cfg = abil(h.k, 'throw'), dd = D(h.k), slot = abilSlot(h.k, 'throw'), bone = cfg.look === 'bone';
  const n = Math.round(lerp(cfg.n, cfg.nMax, power));
  const sp = lerp(cfg.speed, cfg.speedMax, power) * dd.ballSpeed, life = lerp(cfg.life, cfg.lifeMax, power);
  const base = Math.atan2(ay, ax), kick = ++P.kickNo;
  for (let i = 0; i < n; i++) {
    const a = base + i / n * TAU, cx = Math.cos(a), cy = Math.sin(a);
    P.flock.push(newBall(h.x + cx * 34, h.y + cy * 26, cx * sp, cy * sp, power, life, kick, dd.ballSize, i * 0.7, h.k, cfg.look));
  }
  h.homeState = 'away'; h.throwCd = cfg.cooldown;
  if (Math.abs(ax) > 0.2) h.face = Math.sign(ax);
  h.kickT = 0.28;
  if (bone) Snd.play('bone', power, h.k); else Snd.play('kick', power, h.k);
  Snd.play('swish', power, h.k);
  if (power > 0.5) Snd.talk(h.k, slot === 2 ? (power > 0.8 ? 'power2Big' : 'power2') : (power > 0.8 ? 'powerBig' : 'power'));
  Input.rumble(h.k, 0.3 + power * 0.5, 0.5, 70 + power * 90);
  burst(h.x + ax * 34, h.y + ay * 26 - 10, 5 + power * 8, { speed: 120 + power * 120, life: 0.4, cols: bone ? ['#F3E2B8', '#2FBFA8'] : ['#FFF3C0', '#F6C63C'] });
  P.tut[h.k][slot === 2 ? 'used2' : 'used'] = true;
}
/* A second press while his things are still out (inside the cooldown) calls back everything of HIS. The friend's stay out. */
function recallBalls(k) {
  for (const f of P.flock) if (f.state === 'fly' && f.owner === k) f.state = 'return';
  Snd.play('swish', 0.2, k);
}

/* Running (L3). One press with the stick tilted starts it; it lasts until the stick is let go.
   canRun says when a hero is allowed to run at all; everything that stops a run is in one place, below. */
/* The weight of a hero (docs/24-sisteme-noi.md, S7.3, second part): a squash or a stretch when he starts, stops
   and lands, and the tail that lifts with the speed and comes after the body with a lag. Only numbers here:
   the painters read them (heroOpts). */
function heroMotion(h, v, dt) {
  const LK = CONFIG.look;
  if (h.moving !== h.wasMoving) { if (h.z <= 0 && !h.down) h.squash = h.moving ? LK.squashStart : LK.squashStop; h.wasMoving = h.moving; }
  if (h.pz > 2 && h.z <= 0) h.squash = Math.max(h.squash, LK.squashLand);
  h.pz = h.z;
  if (Math.abs(h.squash) < 1e-4) h.squash = 0;                              // no endless tiny wobble while he stands still
  tailStep(h.tail, h.moving ? Math.min(LK.tailMax, v / CONFIG.heroes[h.k].speed * LK.tailLift) : 0, dt);
}
function canRun(h) {
  const S = CONFIG.sprint;
  return S.enabled && !h.down && h.dizzy <= 0 && !h.carried && !h.charging && !P.done && h.runRest <= 0
    && (S.inDuel || !(P.duel && !P.duel.over));
}
function startRun(h) {
  const S = CONFIG.sprint;
  h.run = true; h.runIdle = 0; h.runT = 0;
  h.squash = CONFIG.look.squashRun;                                            // the body stretches as the run starts
  Snd.play('dash', 0, h.k);
  if (P.time - h.runWord > S.wordGap) { h.runWord = P.time; Snd.talk(h.k, 'run'); }
  Input.rumble(h.k, 0, 0.35, 70);
  P.tut[h.k].ran = true;
}
function stopRun(h) { h.run = false; h.runIdle = 0; h.ghosts.length = 0; }
function updateRun(h, s, ix, iy, dt) {
  const S = CONFIG.sprint, tilt = Math.hypot(ix, iy);
  if (h.runRest > 0) h.runRest = Math.max(0, h.runRest - dt);
  if (!s.joined) {                       // nobody holds this hero: it runs when the friend runs and is far away
    const o = P.heroes[1 - h.k];
    h.run = canRun(h) && o.run && dist(h.x, h.y, o.x, o.y) > 300;
    return;
  }
  if (!canRun(h)) { if (h.run) stopRun(h); return; }
  if (S.mode === 'hold') { const want = s.run && tilt > 0.5; if (want && !h.run) startRun(h); else if (!want && h.run) stopRun(h); }
  else if (s.runP) { if (h.run) stopRun(h); else if (tilt > 0.5) startRun(h); }      // a second press stops it
  if (!h.run) return;
  h.runT += dt;
  if (S.max > 0 && h.runT > S.max) { stopRun(h); h.runRest = S.rest; return; }       // out of breath (max = 0: never)
  h.runIdle = tilt > 0.25 ? 0 : h.runIdle + dt;
  if (h.runIdle > S.stopAfter) stopRun(h);
}
function updateHero(h, dt) {
  const L = P.L, s = Input.slots[h.k], d = D(h.k), cfg = CONFIG.heroes[h.k];
  let ix = s.x, iy = s.y, aP = s.aP, aR = s.aR, aH = s.a;
  h.t += dt; h.dizzy = Math.max(0, h.dizzy - dt); h.inv = Math.max(0, h.inv - dt); h.boost = Math.max(0, h.boost - dt); h.cd = Math.max(0, h.cd - dt);
  // the hero's own words: dizzy, recovering
  if (h.dizzyVoice && P.time >= h.dizzyVoice && h.dizzy > 0) { h.dizzyVoice = 0; Snd.talk(h.k, 'dizzy'); }
  if (h.wasDizzy && h.dizzy <= 0 && s.joined) Snd.talk(h.k, 'recover');
  h.wasDizzy = h.dizzy > 0;
  h.hugT = Math.max(0, h.hugT - dt); h.reachHint = Math.max(0, h.reachHint - dt); h.tooFarT = Math.max(0, h.tooFarT - dt); h.giveT = Math.max(0, h.giveT - dt); h.numT = Math.max(0, h.numT - dt); h.noT = Math.max(0, h.noT - dt);
  if (quotaOn() && (s.gP || (s.g && h.giveT <= 0))) { h.giveT = CONFIG.quota.giveEvery; giveEgg(h.k); }        // L1: give an egg to the friend (held down: again every giveEvery)
  h.small += ((h.down && isLupta() ? CONFIG.lupta.shrink : 1) - h.small) * Math.min(1, dt * 7);        // second game: a hero who was hit is tiny until the friend helps
  if (h.down) {                          // hit: waits for the friend. Nothing can hit a hero who is down.
    const RS = CONFIG.rescue;
    h.downT += dt; h.dizzy = Math.max(h.dizzy, 0.4); h.inv = Math.max(h.inv, 0.4);
    h.callT -= dt; if (h.callT <= 0) { h.callT = RS.callEvery; Snd.talk(h.k, 'help'); }
    if (h.downLeft > 0) countDown(h, dt);
    if (!Input.slots[1 - h.k].joined || (RS.autoAfter > 0 && h.downT > RS.autoAfter)) getUp(h, null);
  }
  if (h.carried) { h.moving = false; return; }   // a bird is carrying this hero
  if (s.hP && s.joined && !h.down && h.dizzy <= 0 && !P.done) tryRescue(h);
  h.kickT = Math.max(0, h.kickT - dt); h.squash += (0 - h.squash) * Math.min(1, dt * 9); h.tagT = Math.max(0, h.tagT - dt);
  if (!s.joined) {                       // nobody holds this controller: the hero follows a friend
    const o = P.heroes[1 - h.k]; let tx = o.x - o.face * 85, ty = o.y + 26; aP = aR = aH = false;
    if (P.boss && P.boss.state !== 'won') {
      const b = P.boss, tb = L.treeBase;
      if (h.k === 0) { tx = tb.x - 190; ty = tb.y + 140; if (b.state === 'up' && dist(h.x, h.y, tx, ty) < 80 && startSpin(h)) h.cd = 1.6; }
      else { tx = tb.x + 150; ty = tb.y + 300; if (b.state === 'down' && h.homeState === 'held' && h.dizzy <= 0 && dist(h.x, h.y, tx, ty) < 120) { const g = bossGoal(), dx = g.x - h.x, dy = g.y - h.y, m = Math.hypot(dx, dy) || 1; throwRing(h, 0.5, dx / m, dy / m); } }
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
  updateRun(h, s, ix, iy, dt);
  let sp = cfg.speed;
  h.inMud = L.grid[L.ci(h.x, h.y)] === 1;
  if (h.inMud && !h.wasMud && s.joined) Snd.talk(h.k, 'mud'); h.wasMud = h.inMud;
  const onBridge = !!(L.flag[L.ci(h.x, h.y)] & 8); if (onBridge && !h.wasBridge && s.joined) Snd.talk(h.k, 'bridge'); h.wasBridge = onBridge;
  if (h.inMud) sp *= L.def.slow || CONFIG.mudSlow;
  if (h.boost > 0) sp *= CONFIG.butterflyBoost;
  if (h.dizzy > 0) sp *= 0.2;
  if (h.down) sp = 0;
  if (h.charging) sp *= 0.65;
  if (h.stompT >= 0) sp *= 0.35;
  if (h.spinT >= 0) sp *= 0.8;
  if (h.run) sp = Math.min(sp * CONFIG.sprint.mult, CONFIG.sprint.maxSpeed);      // running: three times faster, but never over the limit
  const m = Math.hypot(ix, iy), f = m > 0.01 ? (0.45 + 0.55 * Math.min(1, m)) / m : 0;
  h.vx += (ix * f * sp - h.vx) * Math.min(1, dt * 12); h.vy += (iy * f * sp - h.vy) * Math.min(1, dt * 12);
  if (m > 0.3) { h.ax = ix / m; h.ay = iy / m; P.tut[h.k].moved += dt; }
  // bored: standing still for 8 seconds while a player holds this hero
  h.idleT = (s.joined && !h.moving && !h.charging && h.dizzy <= 0) ? (h.idleT || 0) + dt : 0;
  if (h.idleT > 8) { h.idleT = 0; Snd.talk(h.k, 'bored'); }
  // The hero moves in small steps, like the balls: at full running speed one frame would be longer than a cell
  // and the hero would go through a thin wall or over the water.
  {
    const v0 = Math.hypot(h.vx, h.vy), n = Math.max(1, Math.ceil(v0 * dt / CONFIG.sprint.step)), sdt = dt / n;
    const wind = P.wind.power > 0.02 && !h.safe && !h.down ? P.wind.power * CONFIG.windForce * d.wind : 0;
    for (let i = 0; i < n; i++) {
      h.px = h.x; h.py = h.y;
      h.x += h.vx * sdt; h.y += h.vy * sdt;
      if (wind) { h.x += P.wind.dir * wind * sdt; h.y += wind * 0.12 * sdt; }
      collide(L, h, HERO_R, false);
    }
  }
  if (h.run && h.moving) {               // the trail of three ghosts, and a little dust at every step
    h.ghostT -= dt;
    if (h.ghostT <= 0) { h.ghostT = 0.04; h.ghosts.unshift({ x: h.x, y: h.y, face: h.face, walk: h.walk, z: h.z, cv: null }); if (h.ghosts.length > 3) h.ghosts.length = 3; }   // cv: its picture, painted once (drawRunTrail)
  } else if (h.ghosts.length) h.ghosts.length = 0;
  const v = Math.hypot(h.vx, h.vy);
  h.moving = v > 35;
  heroMotion(h, v, dt);
  if (h.moving) {
    const w0 = h.walk; h.walk += dt * (7 + v / 55); if (Math.abs(h.vx) > 25) h.face = Math.sign(h.vx);
    // footsteps: one soft sound each time a foot lands
    if (CONFIG.footsteps && s.joined && !h.inMud && h.z <= 0 && Math.floor(w0 / Math.PI) !== Math.floor(h.walk / Math.PI)) {
      Snd.play('step', h.k * 2 + (Math.floor(h.walk / Math.PI) & 1), h.k, h.run ? 0.8 : 1);
      if (h.run) {                       // a little cloud of dust in the color of this level's ground
        const pl = PALS[P.L.def.pal] || PALS.glade;
        part(h.x - h.face * 22 + (Math.random() - 0.5) * 16, h.y + 2, { vx: -h.face * (30 + Math.random() * 40), vy: -18 - Math.random() * 22, life: 0.5, max: 0.5, size: 11 + Math.random() * 7, col: mix(pl.g0, '#FFF6E2', 0.45), kind: 'dust', drag: 2.2 });
      }
    }
  }
  if (h.inMud && h.moving) { h.mudT -= dt; if (h.mudT <= 0) { h.mudT = 0.3; Snd.play('squelch', 0, h.k); burst(h.x, h.y, 4, { kind: 'dot', cols: ['#A9764F', '#8E5E48'], speed: 90, life: 0.5, up: 70, g: 400, size: 6 }); } }
  if (h.boost > 0 && Math.random() < dt * 14) part(h.x + (Math.random() - 0.5) * 40, h.y - 30 - Math.random() * 40, { vy: -20, life: 0.7, max: 0.7, size: 6, col: '#FFD48A', kind: 'spark' });
  // the two powers: each ability runs on the button this hero has it on (✕ = power, □ = power2)
  if (cfg.power === 'spin') updateSpin(h, dt, aP); else if (cfg.power === 'throw') updateThrow(h, dt, aP, aR, aH);
  if (cfg.power2 === 'spin') updateSpin(h, dt, s.cP); else if (cfg.power2 === 'throw') updateThrow(h, dt, s.cP, s.cR, s.c);
  if (!hasAbil(h.k, 'spin')) h.shield = false;
}
/* The spin (claws, gloves, or Bubu's stomp) of one hero, on its own button. */
function updateSpin(h, dt, pressed) {
  const cfg = abil(h.k, 'spin');
  if (pressed) startSpin(h);
  if (h.stompT >= 0) {
    const pt = h.stompT; h.stompT += dt;
    h.z = h.stompT < 0.2 ? Math.sin(h.stompT / 0.2 * Math.PI) * 30 : 0;
    if (pt < 0.2 && h.stompT >= 0.2) doStomp(h);
    if (h.stompT > 0.42) h.stompT = -1;
  }
  if (h.spinT >= 0) {                   // while it spins nothing can hit the hero, and everything in the circle feels it
    h.spinT += dt; h.shield = true; powerSweep(h, h.spinNo);
    if (h.spinLook === 'gloves' && h.spinBeat < 3 && h.spinT >= h.spinBeat * 0.28) spinBeat(h);      // the three beats of the gloves
    if (Math.random() < dt * 60) {
      const a = Math.random() * TAU, gl = h.spinLook === 'gloves';
      part(h.x + Math.cos(a) * cfg.radius * 0.92, h.y - 16 + Math.sin(a) * cfg.radius * 0.5,
        { vy: -30, life: 0.5, max: 0.5, size: gl ? 8 : 7, col: gl ? (Math.random() < 0.25 ? '#3B6FE0' : '#FFFFFF') : RAINBOW[Math.random() * 7 | 0], kind: gl && Math.random() < 0.18 ? 'hex' : 'spark' });
    }
    if (h.spinT >= cfg.time) { h.spinT = -1; h.shield = false; h.spinLook = null; }
  } else h.shield = false;
}
/* The throw (balls or bones) of one hero, on its own button. */
function updateThrow(h, dt, pressed, released, held) {
  const cfg = abil(h.k, 'throw');
  if (h.dizzy > 0 || h.carried) { h.charging = false; h.charge = 0; return; }
  if (pressed && !h.charging) {
    if (h.spinT >= 0 || h.stompT >= 0) return;                 // his other power is running: not now
    if (throwReady(h)) { h.charging = true; h.charge = 0; h.chargeHold = 0; }   // all home, or cooldown over: a new throw
    else recallBalls(h.k);                                     // still out and the cooldown running: call them back
  }
  if (h.charging) {
    h.charge = Math.min(1, h.charge + dt / cfg.charge); if (h.charge >= 1) h.chargeHold += dt;
    if (released || !held || h.chargeHold > 1.2) { h.charging = false; throwRing(h, h.charge < 0.22 ? 0 : h.charge, h.ax, h.ay); h.charge = 0; }
  }
}

function updateBall(dt) {
  const out = [false, false];
  for (const h of P.heroes) h.throwCd = Math.max(0, h.throwCd - dt);
  for (let i = P.flock.length - 1; i >= 0; i--) { const f = P.flock[i]; if (stepFlyBall(f, dt)) out[f.owner] = true; else P.flock.splice(i, 1); }
  for (const h of P.heroes) {
    if (!hasAbil(h.k, 'throw')) continue;
    h.homeState = out[h.k] ? 'away' : 'held';
    if (h.homeState !== 'held') continue;
    const b = h.home, bone = abil(h.k, 'throw').look === 'bone', bob = h.moving ? Math.abs(Math.sin(h.walk * 2)) * 4 : 0;
    if (bone) { b.x = h.x - h.face * 20; b.y = h.y - 92 - bob * 0.5; b.z = 0; b.spin = -0.5 * h.face; }      // Boon keeps the bone on his shoulder
    else { b.x = h.x + h.face * 27; b.y = h.y + 5; b.z = bob; b.spin += h.vx * dt * 0.05; }                  // the ball rides at the feet
  }
}

/* One ball in the air. Returns false when the ball has come home to Leo and can go. */
function stepFlyBall(b, dt) {
  const L = P.L, h = P.heroes[b.owner], bone = b.look === 'bone';
  b.z = bone ? 14 : (isLupta() && b.state === 'fly' ? Math.abs(Math.sin(b.hop += dt * 9)) * 38 : 0);   // the balls hop as they fly; a bone floats and spins instead (only how it looks)
  if (bone) { b.trail.push(b.x, b.y); if (b.trail.length > 12) b.trail.splice(0, b.trail.length - 12); }
  if (b.state === 'return') {
    const dx = h.x - b.x, dy = h.y - b.y, m = Math.hypot(dx, dy);
    if (m < 40) return false;
    const sp = 1050 * dt; b.x += dx / m * Math.min(m, sp); b.y += dy / m * Math.min(m, sp); b.spin += dt * (bone ? 26 : 14);
    if (bone) { b.ret = (b.ret || 0) + dt * 1.6; const u = clamp(b.ret, 0, 1); b.x += -dy / m * Math.sin(u * Math.PI) * 90 * dt * 1.6; b.y += dx / m * Math.sin(u * Math.PI) * 90 * dt * 1.6; }   // a bone comes back on a curve
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
      if (P.bounceT <= 0) { Snd.play(bone ? 'tock' : 'bounce', 0, b.owner); P.bounceT = 0.33; burst(b.x, b.y - 8, 3, { speed: 80, life: 0.3, cols: [bone ? '#F3E2B8' : '#FFF3C0'] }); }   // at most about 3 bounce sounds a second, for everything together
      if (c.hit && c.hit.tree && c.hit.tree.dyn) shakeTree(c.hit.tree, b.power, false);
    }
    // small enemies: one kick (all its balls together) counts as one hit; the second hit makes them disappear
    for (const bt of L.beetles) if (bt.state !== 'knock' && bt.state !== 'dead' && bt.kickHit !== b.kick && dist(bt.x, bt.y, b.x, b.y) < bt.r + b.r + 8) {
      const m = Math.hypot(b.vx, b.vy) || 1; bt.kickHit = b.kick;
      if (hurtSmall(bt)) { bt.state = 'dead'; bt.t = CONFIG.smallEnemy.respawn; }
      else { bt.state = 'knock'; bt.t = 0.55; bt.vx = b.vx / m * 430; bt.vy = b.vy / m * 430; Snd.play('stun'); burst(bt.x, bt.y - 20, 8, { speed: 150, life: 0.5 }); }
      b.vx *= 0.6; b.vy *= 0.6; Snd.talk(b.owner, 'beetleStun');
    }
    for (const cn of L.cones) if ((cn.state === 'roll' || cn.state === 'stun') && cn.kickHit !== b.kick && dist(cn.x, cn.y, b.x, b.y) < cn.r + b.r + 8) {
      cn.kickHit = b.kick;
      if (hurtSmall(cn)) { cn.state = 'gone'; cn.t = CONFIG.smallEnemy.respawn; }
      else { cn.state = 'stun'; cn.t = CONFIG.heroes[0].stunTime; Snd.play('thud'); burst(cn.x, cn.y - 20, 8, { kind: 'dot', cols: ['#9C6A46', '#D6AA78'], speed: 200, life: 0.6, g: 300, size: 7 }); }
    }
    if (L.birds) for (const bd of L.birds) if (bd.state === 'fly' && bd.kickHit !== b.kick && dist(bd.x, bd.y, b.x, b.y) < 62 + b.r) { bd.kickHit = b.kick; hitBird(bd); }
    for (let j = P.eggs.length - 1; j >= 0; j--) { const e = P.eggs[j]; if (e.state === 'idle' && e.delay <= 0 && !(e.wait > 0) && dist(e.x, e.y, b.x, b.y) < e.r + b.r + 20) { collectEgg(e, b.owner); } }
    for (const s of P.stars) if (!s.got && !s.hidden && !s.pop && dist(s.x, s.y, b.x, b.y) < 26 + b.r + 16) collectStar(s, b.owner);
    if (P.boss) bossBall(b);
    if (P.duel) duelBall(b);
    if (b.state !== 'fly') return true;
  }
  const fr = Math.max(0, 1 - 0.28 * dt); b.vx *= fr; b.vy *= fr; b.spin += sp0 * dt * 0.03;
  b.life -= dt;
  if (b.life <= 0 || Math.hypot(b.vx, b.vy) < 110) b.state = 'return';
  if (bone) { if (Math.random() < dt * 8) part(b.x, b.y + 6, { life: 0.5, max: 0.5, size: 7, col: '#2FBFA8', kind: 'paw' }); }      // bones leave little paw prints
  else if (Math.random() < dt * 30) part(b.x, b.y - 10 - b.z, { life: 0.35, max: 0.35, size: 5 + b.power * 5, col: isLupta() ? RAINBOW[(P.time * 9 | 0) % 7] : '#FFF3C0', kind: isLupta() ? 'spark' : 'dot' });
  return true;
}

function updateEggs(dt) {
  const L = P.L, help = P.time > levelDurationOf(L) ? 1.5 : 1;
  for (let i = P.eggs.length - 1; i >= 0; i--) {
    const e = P.eggs[i];
    if (e.delay > 0) { e.delay -= dt; if (e.delay <= 0 && e.state === 'pop') Snd.play('pop'); continue; }
    if (e.state === 'fall') { e.t += dt; const u = e.t / 0.5; e.z = u < 1 ? 300 * (1 - u) * (1 - u) : Math.sin(Math.min(1, (e.t - 0.5) / 0.18) * Math.PI) * 14; if (e.t >= 0.68) { e.state = 'idle'; e.z = 0; } continue; }
    if (e.state === 'pop') { e.t += dt; const u = Math.min(1, e.t / 0.6); e.x = lerp(e.sx, e.tx == null ? (e.tx = e.x) : e.tx, u); e.y = lerp(e.sy, e.ty == null ? (e.ty = e.y) : e.ty, u); e.z = Math.sin(u * Math.PI) * 90; if (u >= 1) { e.state = 'idle'; e.z = 0; } continue; }
    if (e.wait > 0) { e.wait -= dt; continue; }
    if (e.hop > 0) { e.hop -= dt; e.z = e.hop > 0 ? Math.sin((1 - e.hop / 0.4) * Math.PI) * 16 : 0; }
    if (e.pull) {                        // stomped eggs fly all the way to Bubu, so none gets stranded
      const dx = e.pull.x - e.x, dy = e.pull.y - e.y, m = Math.hypot(dx, dy) || 1, sp = 540 * dt;
      e.x += dx / m * Math.min(m, sp); e.y += dy / m * Math.min(m, sp);
    }
    for (const h of P.heroes) {
      if (h.dizzy > 0 || h.carried) continue;
      const rad = (e.big ? 80 : D(h.k).pickupRadius) * help;
      if (dist(h.x, h.y, e.x, e.y) < rad) {
        collectEgg(e, h.k); break;
      }
    }
  }
  for (const s of P.stars) {
    if (s.got || s.hidden) continue;
    if (s.pop) { s.pop += dt; const u = Math.min(1, s.pop / 0.7); s.x = lerp(s.sx, s.tx, u); s.y = lerp(s.sy, s.ty, u); s.z = Math.sin(u * Math.PI) * 110; if (u >= 1) { s.pop = 0; s.z = 0; } continue; }
    for (const h of P.heroes) if (h.dizzy <= 0 && !h.carried && dist(h.x, h.y, s.x, s.y) < D(h.k).pickupRadius * 0.85) { collectStar(s, h.k); break; }
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
    b.flash = Math.max(0, (b.flash || 0) - dt); b.born = Math.max(0, (b.born || 0) - dt);
    if (b.state === 'dead') {              // gone after two hits: another one appears here after a while, when no hero stands close
      if (b.thrown) continue;              // George's thrown enemies never come back (removed below)
      b.t -= dt;
      if (b.t <= 0 && P.heroes.every(h => dist(h.x, h.y, b.hx, b.hy) > 380)) {
        b.x = b.hx; b.y = b.hy; b.state = 'sleep'; b.hp = b.maxHp || CONFIG.smallEnemy.hits; b.cool = 2; b.born = 0.5; b.vx = b.vy = 0;
        burst(b.x, b.y - 20, 10, { kind: 'dust', cols: ['#FFF3E0'], speed: 120, life: 0.6, size: 14, g: -20, drag: 2 });
      }
      continue;
    }
    b.t -= dt; b.cool = Math.max(0, (b.cool || 0) - dt);
    let near = null, nd = 1e9;
    for (const h of P.heroes) { const d = dist(h.x, h.y, b.x, b.y); if (d < nd) { nd = d; near = h; } }
    const mul = enemyMul(b.x, b.y);
    b.px = b.x; b.py = b.y;
    if (b.look === 'mini' && b.state !== 'stun' && b.state !== 'knock') {      // Little George: walks after the nearest hero, stops beside him, never hits
      const M = CONFIG.lupta.miniGeorge, tx = nd < M.near ? near.x : b.hx, ty = nd < M.near ? near.y : b.hy, dx = tx - b.x, dy = ty - b.y, m = Math.hypot(dx, dy) || 1;
      const stop = nd < M.near ? 90 : 6;
      if (m > stop) { const sp = Math.min(m - stop, M.speed * mul * dt); b.x += dx / m * sp; b.y += dy / m * sp; b.face = dx > 0 ? 1 : -1; }
      b.state = nd < M.near ? 'chase' : 'return';
    } else if (b.state === 'sleep') {
      if (b.cool <= 0 && nd < CONFIG.beetleWakeRadius * D(near.k).wakeRadius && near.inv <= 0 && !near.safe) { b.state = 'wake'; b.t = 0.6; Snd.play('wake'); Snd.talk(near.k, 'beetleWake'); b.face = near.x > b.x ? 1 : -1; }
    } else if (b.state === 'wake') { if (b.t <= 0) { b.state = 'chase'; b.t = 5; } }
    else if (b.state === 'chase') {
      const dx = near.x - b.x, dy = near.y - b.y, m = Math.hypot(dx, dy) || 1, sp = (b.chase || CONFIG.beetleSpeed * (b.look === 'snail' ? 0.7 : 1)) * mul * dt;      // snails are slower; George's last enemies have their own speed
      b.x += dx / m * sp; b.y += dy / m * sp; b.face = dx > 0 ? 1 : -1;
      if (!b.follow && (b.t <= 0 || nd > 560 || dist(b.x, b.y, b.hx, b.hy) > 440 || near.dizzy > 0 || near.safe)) { b.state = 'return'; b.cool = 2; }      // George's thrown enemies keep after the heroes
    } else if (b.state === 'return') {
      const dx = b.hx - b.x, dy = b.hy - b.y, m = Math.hypot(dx, dy);
      if (m < 8) { b.state = 'sleep'; } else { const sp = CONFIG.beetleSpeed * 0.75 * dt; b.x += dx / m * Math.min(m, sp); b.y += dy / m * Math.min(m, sp); b.face = dx > 0 ? 1 : -1; }
    } else if (b.state === 'stun') { if (b.t <= 0) { b.state = 'return'; b.cool = 2.5; } }
    else if (b.state === 'knock') { b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 1 - Math.min(1, dt * 3); b.vy *= 1 - Math.min(1, dt * 3); if (b.t <= 0) { b.state = 'stun'; b.t = 3; } }
    if (b.state !== 'sleep') collide(L, b, 22, false);
    if ((b.state === 'chase' || b.state === 'wake') && b.look !== 'mini') for (const h of P.heroes) if (!h.safe && dist(h.x, h.y, b.x, b.y) < b.r + HERO_R - 8 && h.dizzy <= 0 && h.inv <= 0) { hitHero(h, b.x, b.y); b.state = 'return'; b.cool = 3; }
  }
  if (L.beetles.some(b => b.thrown && b.state === 'dead')) L.beetles = L.beetles.filter(b => !(b.thrown && b.state === 'dead'));      // George's thrown enemies do not come back
  const cs = CONFIG.pineconeSpeed * (L.def.coneSpeed || 1);
  for (const c of L.cones) {
    c.flash = Math.max(0, (c.flash || 0) - dt);
    if (c.state === 'roll') {
      const v = cs * enemyMul(c.x, c.y) * dt; c.y += v; c.rot += v / c.r; c.fade = Math.min(1, (c.fade == null ? 1 : c.fade) + dt * 2);
      if (c.y > c.lane.y1) { c.state = 'gone'; c.t = 1.4; }
      for (const h of P.heroes) if (!h.safe && dist(h.x, h.y, c.x, c.y) < c.r + HERO_R - 6 && h.dizzy <= 0 && h.inv <= 0) {
        hitHero(h, c.x, c.y); c.state = 'gone'; c.t = 3; burst(c.x, c.y - 20, 10, { kind: 'dot', cols: ['#9C6A46', '#D6AA78'], speed: 180, life: 0.6, g: 300, size: 7 });
      }
    } else if (c.state === 'stun') { c.t -= dt; if (c.t <= 0) c.state = 'roll'; }
    else { c.t -= dt; if (c.t <= 0) { c.state = 'roll'; c.y = c.lane.y0; c.fade = 0; c.hp = CONFIG.smallEnemy.hits; } }      // a new one starts at the top of the lane
  }
}

/* ---------- boss: Ciori in the tallest tree (first game), George on his stone throne (second game) ---------- */
/* Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. */
function bossGoal() {
  const bs = P.boss, L = P.L;
  return L.arena && bs.state === 'down' ? { x: bs.x, y: bs.y - 50, r: 124 } : { x: L.nest.x, y: L.nest.y, r: 108 };
}
function bossBall(b) {
  const bs = P.boss, L = P.L, g = bossGoal();
  if (dist(b.x, b.y, g.x, g.y) > g.r) return;
  if (bs.state === 'down') {
    bs.phase++; Snd.play('goal'); Snd.talk(0, 'bossDown'); Snd.talk(1, 'bossDown'); Input.rumble(0, 0.7, 0.9, 350); Input.rumble(1, 0.7, 0.9, 350); P.shake = 0.3; b.state = 'return'; bigHit();
    burst(g.x, g.y, 50, { speed: 380, life: 1.4, size: 11 }); burst(g.x, g.y, 24, { kind: 'petal', cols: PETALS, speed: 260, life: 1.8, g: 80 });
    for (let i = 0; i < 8; i++) P.eggs.push(makeEgg(260 + Math.random() * 1400, 660 + Math.random() * 340, { state: 'pop', sx: g.x, sy: g.y, req: false, delay: i * 0.07 }));
    if (bs.phase >= CONFIG.boss.hits) { bs.state = 'won'; bs.t = 0; Snd.music('ending'); for (const p of bs.proj) p.dead = true; }
    else { bs.state = 'rising'; bs.t = 0; bs.sx = bs.x; bs.sy = bs.y; }
  } else if (bs.state === 'up') {
    const dx = b.x - L.nest.x, dy = b.y - L.nest.y, m = Math.hypot(dx, dy) || 1;
    b.vx = dx / m * 520; b.vy = Math.abs(dy / m) * 520 + 200; b.x = L.nest.x + dx / m * 112; b.y = L.nest.y + dy / m * 112;
    Snd.play('bounce'); if (bs.cawT <= 0) { Snd.play('caw'); bs.cawT = 2; } bs.bat = 0.4;
  }
}
function updateBoss(dt) {
  const bs = P.boss, L = P.L, tb = L.treeBase, B = CONFIG.boss;
  bs.t += dt; bs.treeShake = Math.max(0, bs.treeShake - dt * 1.4); bs.cawT = Math.max(0, bs.cawT - dt); bs.bat = Math.max(0, (bs.bat || 0) - dt);
  for (let i = bs.rings.length - 1; i >= 0; i--) { bs.rings[i].t += dt; if (bs.rings[i].t > 0.8) bs.rings.splice(i, 1); }
  if (bs.state === 'up') {
    bs.x = L.nest.x; bs.y = L.nest.y + 6;
    if (!P.heroes.some(h => h.down)) bs.throwT -= dt;      // nothing new is thrown while a hero waits for the friend's help
    bs.windup = bs.throwT > 0 && bs.throwT < CONFIG.look.anticipate && CONFIG.look.anticipate > 0 && !P.heroes.some(h => h.down) ? 1 - bs.throwT / CONFIG.look.anticipate : 0;      // 0 -> 1 in the 0.15 s before a throw: George pulls back (T6.9)
    if (bs.throwT <= 0) {
      bs.throwT = B.throwEvery[Math.min(bs.phase, B.throwEvery.length - 1)] || 2.5;
      // one thing thrown at first, two from the second round, and one more in the last two rounds
      const n = 1 + Math.min(1, bs.phase) + (bs.phase >= B.hits - 2 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const h = P.heroes[(i + (Math.random() < 0.5 ? 0 : 1)) % 2];
        const tx = i < 2 ? clamp(h.x + h.vx * 0.5, 80, L.W - 80) : 200 + Math.random() * 1500, ty = i < 2 ? clamp(h.y + h.vy * 0.5, 540, L.H - 60) : 600 + Math.random() * 400;
        const sol = L.soldiers && i === 2 ? L.soldiers[Math.random() * L.soldiers.length | 0] : null;      // in George's arena the third thing is a spear from one of the soldiers
        if (sol) sol.throwT = 0.5;
        bs.proj.push({ sx: sol ? sol.x : bs.x, sy: sol ? sol.y - 60 : bs.y - 40, tx: tx + i * 50 * (Math.random() - 0.5), ty, t: -i * 0.35, dur: [1.9, 1.4, 1.15][rank(h.k)], rot: 0, kind: sol ? 'spear' : L.arena ? 'rock' : 'cone' });
      }
      bs.throwAnim = 0.4; bs.windup = 0;
    }
  } else if (bs.state === 'falling') {
    const u = Math.min(1, bs.t / 0.8); bs.x = lerp(bs.sx, bs.fx, u); bs.y = lerp(bs.sy, bs.fy, u * u);
    if (u >= 1) { bs.state = 'down'; bs.t = 0; Snd.play('bonk'); P.shake = 0.15; burst(bs.x, bs.y - 30, 14, { kind: 'leaf', cols: L.arena ? ['#E0559C', '#F6CE46', '#46B8D8'] : ['#5F4E80', '#8474A4'], speed: 180, life: 1, g: 200, size: 9 }); }
  } else if (bs.state === 'down') {
    if (bs.t > B.downTime * [1.35, 1, 0.8][rank(1)]) { bs.state = 'rising'; bs.t = 0; bs.sx = bs.x; bs.sy = bs.y; }
  } else if (bs.state === 'rising') {
    const u = Math.min(1, bs.t / 1.1); bs.x = lerp(bs.sx, L.nest.x, ease(u)); bs.y = lerp(bs.sy, L.nest.y + 6, ease(u)) - Math.sin(u * Math.PI) * 60;
    if (u >= 1) {
      bs.state = 'up'; bs.shakes = 0; bs.throwT = 1.8;
      if (L.arena && B.roarPush) {          // back on his throne George roars: a wave that pushes the heroes away (it does not hurt)
        Snd.play('caw'); P.shake = Math.max(P.shake, 0.3); bs.rings.push({ t: 0 }); bs.cawT = 2;
        for (const h of P.heroes) { const dx = h.x - tb.x, dy = h.y - tb.y, m = Math.hypot(dx, dy) || 1; if (m < B.roarRadius && !h.down && !h.shield) { h.vx += dx / m * B.roarPush * [0.5, 1, 1.2][rank(h.k)]; h.vy += Math.abs(dy / m) * B.roarPush * 0.6; Input.rumble(h.k, 0.6, 0.4, 220); } }
      }
    }
  } else if (bs.state === 'won') {
    if (L.arena) {                          // George loses his crown, turns small and runs away
      if (bs.wy == null) { bs.wy = bs.y; bs.cx = bs.x - 30; Snd.play('flee'); }                 // cx: where the crown falls
      bs.sc = lerp(1, 0.42, clamp(bs.t / 1.2, 0, 1));
      if (bs.t > 1.2) { bs.x += 560 * dt; bs.y = bs.wy - Math.abs(Math.sin(bs.t * 12)) * 16; }
    } else {
      const u = Math.min(1, bs.t / 1.6); if (bs.wx == null) { bs.wx = bs.x; bs.wy = bs.y; }
      bs.x = lerp(bs.wx, 960, ease(u)); bs.y = lerp(bs.wy, 700, ease(u)) - Math.sin(u * Math.PI) * 80;
    }
    if (bs.t > 1.6 && !bs.said) { bs.said = true; Voice.say(T('sorryVoice')); }
    if (Math.random() < dt * 5) burst(200 + Math.random() * 1500, 200 + Math.random() * 300, 6, { kind: 'petal', cols: isLupta() ? RAINBOW : PETALS, speed: 120, life: 2, g: 60 });
    if (bs.t > 9 || (bs.t > 3.5 && Input.any(s => s.aP))) { Voice.stop(); Game.toEnding(); }
  }
  bs.throwAnim = Math.max(0, (bs.throwAnim || 0) - dt);
  if (L.soldiers) for (const so of L.soldiers) so.throwT = Math.max(0, (so.throwT || 0) - dt);
  stepProj(bs.proj, dt);
}
/* ---------- second game: big birds that pick a hero up and carry him a little way (it does not hurt) ---------- */
function hitBird(bd) {
  if (bd.grab) dropHero(bd);
  if (hurtSmall(bd)) { bd.state = 'gone'; bd.t = CONFIG.smallEnemy.respawn; }
  else { bd.rest = 3; Snd.play('stun'); }
}
function dropHero(bd) {
  const h = bd.grab, L = P.L; if (!h) return;
  if (!L.reach[L.ci(h.x, h.y)]) {            // never dropped into water, a pit or a tree: the nearest free place
    let p = null, best = 1e9; for (const c of L.reachCells(h.x, h.y, 0, 360, 0)) { const dd = dist(c.x, c.y, h.x, h.y); if (dd < best) { best = dd; p = c; } }
    if (p) { h.x = p.x; h.y = p.y; }
  }
  h.carried = null; h.z = 0; h.squash = 0.25; h.inv = Math.max(h.inv, 1.5); h.vx = h.vy = 0; h.px = h.x; h.py = h.y; bd.grab = null; bd.rest = 4;
  Snd.play('thud'); burst(h.x, h.y, 8, { kind: 'dust', cols: ['#F3E2C0'], speed: 160, life: 0.5, size: 14, g: 0, drag: 3 });
}
function updateBirds(dt) {
  const L = P.L, C = CONFIG.lupta;
  for (const bd of L.birds) {
    bd.flash = Math.max(0, (bd.flash || 0) - dt); bd.rest = Math.max(0, (bd.rest || 0) - dt);
    if (bd.state === 'gone') {
      bd.t -= dt; if (bd.t > 0 || (P.duel && !P.duel.over) || P.nestOpen) continue;      // no birds during a fight or when the level is won
      bd.state = 'fly'; bd.dir = Math.random() < 0.5 ? 1 : -1; bd.hp = CONFIG.smallEnemy.hits; bd.wing = 0;
      const h = P.heroes[Math.random() * 2 | 0], vw = W / P.cam.zoom;                     // it flies over where the heroes are, a little off, so it can be dodged
      bd.x = clamp(P.cam.x - bd.dir * (vw / 2 + 220), -200, L.W + 200); bd.y = clamp(h.y + (Math.random() - 0.5) * 240, L.top + 120, L.H - 100);
      Snd.play('bird');
      continue;
    }
    bd.x += bd.dir * C.birdSpeed * enemyMul(bd.x, bd.y) * dt; bd.wing += dt;
    if (bd.grab) {
      const h = bd.grab; h.x = clamp(bd.x, 60, L.W - 60); h.y = bd.y; h.z = Math.min(150, h.z + 420 * dt); h.px = h.x; h.py = h.y;
      bd.carryT -= dt; if (bd.carryT <= 0 || bd.x < 90 || bd.x > L.W - 90) dropHero(bd);
    } else if (bd.rest <= 0) for (const h of P.heroes) {
      if (!Input.slots[h.k].joined || h.down || h.safe || h.shield || h.carried || h.inv > 0 || P.done) continue;
      if (dist(h.x, h.y, bd.x, bd.y) < 66) { bd.grab = h; h.carried = bd; bd.carryT = C.birdCarry; h.charging = false; h.charge = 0; h.stompT = -1; Snd.play('grab', 0, h.k); Snd.talk(h.k, 'wind'); Input.rumble(h.k, 0.4, 0.6, 250); break; }
    }
    if (bd.x < -260 || bd.x > L.W + 260) { if (bd.grab) dropHero(bd); bd.state = 'gone'; bd.t = lerp(C.birdEvery[0], C.birdEvery[1], Math.random()); }
  }
}
/* Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. */
function stepProj(list, dt, spare) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i]; p.t += dt; p.rot += dt * 9;
    if (p.dead) { list.splice(i, 1); continue; }
    if (p.t >= p.dur && p.onLand) { p.onLand(p); list.splice(i, 1); continue; }      // T15: an enemy George threw lands and starts walking; it does not hit on landing
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
  const L = P.L;
  if (!L.decor) return;
  const who = [];
  for (const h of P.heroes) who.push({ x: h.x, y: h.y, stomp: (h.stompT >= 0 && h.stompT < 0.25) || h.spinT >= 0, r: abil(h.k, 'spin').radius });
  for (const f of P.flock) who.push({ x: f.x, y: f.y, stomp: false });
  P.rustleT = Math.max(0, P.rustleT - dt);
  for (const d of L.decor) {
    if (!d.react) continue;
    d.cool = Math.max(0, d.cool - dt);
    let near = 1e9, jump = false;
    for (const w of who) { const dd = dist(w.x, w.y, d.x, d.y); if (dd < near) near = dd; if (w.stomp && dd < (w.r || 0)) jump = true; }
    if (d.rk === 'hide') { const want = near < 90 ? 1 : 0; d.hide += (want - d.hide) * Math.min(1, dt * 5); }
    else if (d.rk === 'fly') {
      if (d.flyT > 0) d.flyT = Math.max(0, d.flyT - dt);
      else if (near < 60) { d.flyT = 2.2; Snd.play('pop'); }
    }
    else if (d.cool <= 0 && (jump || near < 70)) {          // a little puff, then a short rest
      d.cool = jump ? 0.9 : 0.7;
      const cols = isLupta() ? RAINBOW : d.type === 'daisy' || d.type === 'dandelion' ? PETALS : LEAVES;
      if (d.type === 'dandelion' || d.type === 'puffball') burst(d.x, d.y - 30, 10, { kind: 'dot', cols: ['#FFF8EA', '#FFFFFF'], speed: 120, life: 1.4, g: -20, up: 40, size: 5 });
      else burst(d.x, d.y - 14, jump ? 10 : 5, { kind: d.type === 'daisy' ? 'petal' : 'leaf', cols, speed: jump ? 220 : 130, life: 1.1, g: 120, up: jump ? 120 : 60, size: 9 });
      if ((d.type === 'grass' || d.type === 'fern') && P.rustleT <= 0) { P.rustleT = 0.8; Snd.play('rustle'); }
    }
  }
}

function updatePlay(dt) {
  const L = P.L;
  P.time += dt; P.sinceEgg += dt; P.comboT -= dt; P.rumbleT -= dt; P.bounceT -= dt; P.shake = Math.max(0, P.shake - dt); P.hintCharge = Math.max(0, P.hintCharge - dt);
  // the two friends: one calls for the other when they are far apart, and they cheer when they meet again
  { const a = P.heroes[0], c = P.heroes[1], sep = dist(a.x, a.y, c.x, c.y);
    // the first time they are far apart on a level, L3 is shown over each hero who has not run yet
    P.runHint = Math.max(0, P.runHint - dt);
    if (sep > 900 && !P.runHintDone && CONFIG.sprint.enabled && !(P.tut[0].ran && P.tut[1].ran)) { P.runHint = 4; P.runHintDone = true; }
    for (const h of P.heroes) {
      if (sep > 1200) { h.farT = (h.farT || 0) + dt; if (h.farT > 5) { h.farT = 0; h.wasFar = true; Snd.talk(h.k, 'callFriend'); } }
      else { h.farT = 0; if (h.wasFar && sep < 250) { h.wasFar = false; Snd.talk(h.k, 'together'); } }
    } }
  if (P.banner) { if (P.banner.max == null) P.banner.max = P.banner.t; P.banner.t -= dt; if (P.banner.t <= 0) P.banner = null; }      // max: how long it lasts, so the card can breathe when it comes in
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
  updateRescue(dt);
  updateBall(dt);
  updateEggs(dt);
  updateGifts(dt);
  updateJoinQuota();
  updateQuotaMsg();
  updateAutoGive(dt);
  updateEnemies(dt);
  if (L.birds) updateBirds(dt);
  if (P.boss) updateBoss(dt);
  if (P.duel) updateDuel(dt);
  for (const t of L.dynTrees) {
    t.shake = Math.max(0, t.shake - dt * 1.6);
    const act = (t.spark && t.spark.active && !t.spark.done) || (t.starTree && t.starTree.hidden);
    if (act && Math.random() < dt * 7) { const a = Math.random() * TAU, dd = Math.random() * t.R; part(t.x + Math.cos(a) * dd, t.y + Math.sin(a) * dd * 0.9, { vy: -18, life: 0.9, max: 0.9, size: t.starTree ? 9 : 7, col: t.starTree ? '#FFD0C4' : '#FFE9A0', kind: 'spark' }); }
  }
  // waves, nest
  if (P.nextWaveT >= 0) { P.nextWaveT -= dt; if (P.nextWaveT < 0 && P.wave + 1 < L.NW) startWave(P.wave + 1); }      // never past the last wave
  if (quotaOn()) { checkWave(); updateGeorge(); }                  // T15: the waves move on without diamonds; George comes from the diamonds
  updateDecor(dt);
  if (P.crow) { P.crow.t += dt; if (P.crow.t > 3.2) P.crow = null; }
  if (P.nestOpen && !P.done) {
    const near = P.heroes.map(h => dist(h.x, h.y, L.nest.x, L.nest.y) < 185);
    const solo = !Input.slots[0].joined || !Input.slots[1].joined;
    if (near[0] || near[1]) P.nestT += dt; else P.nestT = 0;
    P.nestOpenT = (P.nestOpenT || 0) + dt;
    const ready = P.nestOpenT > 14 || !P.eggs.some(e => !e.big);     // eggs still lying around: a little time to pick them up first
    // the level ends only when BOTH players stand in the nest (one alone is enough only when one plays alone) and each found the quota
    const quotaMet = !quotaOn() || (quotaOk(0) && quotaOk(1));
    if (near[0] && near[1] && !solo && !quotaMet) P.needT += dt; else P.needT = 0;           // how long both wait in the nest for a missing quota (the automatic help, T14.6, reads this)
    if (ready && quotaMet && ((near[0] && near[1]) || ((near[0] || near[1]) && solo))) { P.done = true; P.doneT = 0; Snd.play('win'); Snd.talk(0, 'levelWin'); Snd.talk(1, 'levelWin'); Input.rumble(0, 0.4, 0.8, 500); Input.rumble(1, 0.4, 0.8, 500); }
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
    if (L.fall && Math.random() < dt * 20) part(L.fall.x + (Math.random() - 0.5) * L.fall.w, L.fall.y1 + Math.random() * 20, { vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 40, life: 0.9, max: 0.9, size: 12, col: '#F4FBF4', kind: 'dust', drag: 1 });
  }
  // particles and rings
  stepParts(dt);
  for (let i = P.rings.length - 1; i >= 0; i--) { P.rings[i].t += dt; if (P.rings[i].t > 0.55) P.rings.splice(i, 1); }
  // camera: keep both heroes on screen, under the band at the top, and zoom out when they are far apart
  const a = P.heroes[0], b2 = P.heroes[1], cam = P.cam, tgt = camTarget(L, a, b2);
  const fast = a.run || b2.run;                                       // while anyone runs the camera keeps up, or the hero reaches the edge first
  cam.zoom += (tgt.zoom - cam.zoom) * Math.min(1, dt * (fast ? 5 : 2.5));
  const vw = W / cam.zoom, vh = H / cam.zoom, lo = vh / 2 - (HUD_TOP + 20) / cam.zoom;
  const cf = Math.min(1, dt * (fast ? 9 : 4));
  cam.x += (tgt.x - cam.x) * cf; cam.y += (tgt.y - cam.y) * cf;
  cam.x = clamp(cam.x, vw / 2, L.W - vw / 2); cam.y = clamp(cam.y, lo, Math.max(lo, L.H - vh / 2));
}
/* Where the camera wants to be for two heroes: no side effects, so a test can ask the game itself.
   Rules: both heroes on screen; nothing of a hero (name included) above the band at the top (HUD_TOP, 08-draw.js);
   the camera may look up to HUD_TOP + 20 screen pixels above the top edge of the world, and that strip is painted sky. */
function camTarget(L, a, b) {
  const safe = HUD_TOP + 20, z = clamp(Math.min(1, W / (Math.abs(a.x - b.x) + 760), (H - safe) / (Math.abs(a.y - b.y) + 560)), L.minZoom, 1);
  const vw = W / z, vh = H / z;
  const cap = Math.min(a.y, b.y) - HERO_BOX + (H / 2 - HUD_TOP - 4) / z;        // the highest the camera may look: the top hero stays under the band
  const hi = Math.min(L.H - vh / 2, cap);                                       // never look below the bottom edge of the world
  const lo = Math.max(Math.min(vh / 2, Math.max(vh / 2 - safe / z, cap)),       // the world's top edge, left only as far as the band asks
    Math.min(hi, Math.max(a.y, b.y) - (H / 2 - 10) / z));                       // and, when it fits, the lower hero keeps its feet on screen
  return { x: clamp((a.x + b.x) / 2, vw / 2, L.W - vw / 2), y: clamp((a.y + b.y) / 2 - 30 - safe / 2 / z, lo, Math.max(lo, hi)), zoom: z };
}
