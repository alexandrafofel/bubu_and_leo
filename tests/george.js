// T15 (docs/28-t15-george-de-doua-ori.md, sectiunea 12): cota 15, diamante doar din inamicii invinsi, Micul George,
// George chemat de diamantele comune (jumatate si toata cota), ce arunca in cele doua lupte, sfarsitul nivelului.
// Rezultat: "ok" sau "GRESIT" pe verificare, apoi "george OK" sau "NEREUSIT: ...".
// MUTA=<n> strica o regula, ca sa se vada ca verificarea poate pica (vezi docs/17-testare.md).
const boot = require('./common.js');
const MUTA = +process.env.MUTA || 0;

(async () => {
  const { page, done, game } = await boot();
  await page.evaluate((MUTA) => {
    const G = __game; window.G = G;
    window.cnt = { bones: 0, enemies: [], };
    const rb = window.georgeBones, re = window.georgeEnemies;
    window.georgeBones = (n) => { cnt.bones += n; return rb(n); };
    window.georgeEnemies = (n, f) => { cnt.enemies.push([n, !!f]); return re(n, f); };
    // a quiet level: enemies asleep, no pinecones; the two heroes together at the start
    window.fresh = (idx) => {
      joined = [true, true]; go(idx || 0); const P = G.P, L = P.L;
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0; if (L.birds) L.birds.length = 0;
      P.heroes[1].x = P.heroes[0].x + 120; P.heroes[1].y = P.heroes[0].y;
      for (const h of P.heroes) { h.vx = h.vy = 0; h.dizzy = 0; h.down = false; h.inv = 0; }
      cnt.bones = 0; cnt.enemies = []; step(3); return P;
    };
    window.calm = () => { for (const h of G.P.heroes) { h.down = false; h.dizzy = 0; h.inv = 99; } };      // the heroes do not fall during a check
    window.duelReady = () => { const d = G.P.duel; let f = 0; while (d.state === 'enter' && f < 600) { calm(); step(1); f++; } return d; };
    window.hitGeorge = () => { const d = G.P.duel; let f = 0; while ((d.state === 'enter' || d.state === 'hurt') && f < 600) { calm(); step(1); f++; } G.duelHit(1); calm(); step(2); };
    const Cg = G.CONFIG.lupta.george;
    if (MUTA === 1) G.CONFIG.quota.perLevel[2] = 10;
    if (MUTA === 2) { const s = window.startWave; window.startWave = (k) => { s(k); G.P.eggs.push(window.makeEgg(G.P.heroes[0].x + 300, G.P.heroes[0].y, { req: false, goal: true })); }; }
    if (MUTA === 3) window.dropGems = () => {};
    if (MUTA === 4) G.CONFIG.lupta.miniGeorge.speed = 0;
    if (MUTA === 5) Cg.minT = 0;
    if (MUTA === 6) { const u = window.updateGeorge; window.updateGeorge = () => { const P = G.P; if (P.midFought && !P.nestFought) return; u(); }; }
    if (MUTA === 7) Cg.midThrows = [0, 0, 0, 0, 0, 0];
    if (MUTA === 8) Cg.boneEvery = 0;
    if (MUTA === 9) Cg.nestEnemies = [0, 0, 0, 0, 0, 0];
    if (MUTA === 10) Cg.enemyHp = [1, 1, 1, 1, 1, 1];
    if (MUTA === 11) { const h = window.duelHit; window.duelHit = (k) => { if (G.P.L.beetles.some(b => b.thrown && b.state !== 'dead')) return; h(k); }; }
    if (MUTA === 12) window.quotaOk = () => true;
    if (MUTA === 13) window.teamNeed = () => G.P.q * 2;
    if (MUTA === 15) { const c = window.collectEgg; window.collectEgg = (e, k) => { const f = G.P.found.slice(); c(e, k); if (e.goal && !isJoined(k)) { G.P.found = f; G.P.found[k]++; } }; }      // the old way: the absent hero keeps what he picks up
    if (MUTA === 14) { const s = window.startPlay; window.startPlay = (L) => { s(L); G.P.midFought = true; }; }
  }, MUTA);

  const out = [], T0 = Date.now(), ok = (n, label, v, extra) => { out.push([n, label, !!v, extra]); if (process.env.PAS) console.log('  .. ' + n + ' ' + ((Date.now() - T0) / 1000 | 0) + ' s'); };

  // 1. quota 15 everywhere, no upper limit
  const r1 = await page.evaluate(() => {
    const per = G.CONFIG.quota.perLevel.slice(0, G.CONFIG.levels), P = fresh(0), a = P.heroes[0];
    P.found = [20, 0]; const e = window.makeEgg(a.x + 8, a.y, { state: 'idle' }); P.eggs.push(e); step(20);
    return { per, took: P.found[0] === 21 };
  });
  ok(1, 'cota e 15 pe fiecare nivel; un erou cu 20 mai ia un diamant', r1.per.every(q => q === 15) && r1.took, JSON.stringify(r1));

  // 2. diamonds come only from defeated enemies: the waves and the glowing trees bring none
  const r2 = await page.evaluate(() => {
    const P = fresh(1), L = P.L, o = {};
    o.waves = L.waves.every(w => w.length === 0); o.total = L.totalEggs === 2 * P.q;
    for (let i = 0; i < 60 * 12; i++) { for (const t of L.trees) if (t.spark && t.spark.active && !t.spark.done) shakeTree(t, 1, true); for (const b of L.beetles) b.cool = 999; calm(); step(1); }
    o.goalEggs = P.eggs.filter(e => e.goal).length; o.snails = L.beetles.filter(b => b.look === 'snail').length; o.wave = P.wave;
    return o;
  });
  ok(2, 'valurile si copacii nu dau diamante; copacii dau melci', r2.waves && r2.total && r2.goalEggs === 0 && r2.snails >= 2, JSON.stringify(r2));

  // 3. a defeated small enemy leaves exactly one diamond, and the team total grows when it is picked up
  const r3 = await page.evaluate(() => {
    const P = fresh(0), L = P.L, b = L.beetles.find(x => x.look !== 'mini'), n0 = P.eggs.length, t0 = teamFound();
    while (!G.hurtSmall(b)); b.state = 'dead'; b.t = 999;
    const got = P.eggs.slice(n0); step(40);
    const a = P.heroes[0]; for (const e of got) { a.x = e.x; a.y = e.y; calm(); step(8); }
    return { dropped: got.length, goal: got.every(e => e.goal && !e.req), team: teamFound() - t0 };
  });
  ok(3, 'un inamic mic invins lasa exact un diamant; luat, creste totalul echipei', r3.dropped === 1 && r3.goal && r3.team === 1, JSON.stringify(r3));

  // 4. Little George: 3 hearts, follows the nearest hero, never hits, leaves one diamond, comes back
  const r4 = await page.evaluate(() => {
    const P = fresh(0), L = P.L, m = L.beetles.find(b => b.look === 'mini'), a = P.heroes[0], o = {};
    if (!m) return { none: true };
    o.hp = m.maxHp === 3 && m.hp === 3;
    a.x = m.x - 400; a.y = m.y; P.heroes[1].x = a.x - 200; P.heroes[1].y = a.y; a.inv = 0;
    const d0 = Math.hypot(m.x - a.x, m.y - a.y); for (let i = 0; i < 180; i++) { a.inv = 0; a.dizzy = 0; step(1); }
    o.closer = Math.hypot(m.x - a.x, m.y - a.y) < d0 - 150; o.noHit = !a.down && a.dizzy <= 0;
    const n0 = P.eggs.length; while (!G.hurtSmall(m)); m.state = 'dead'; m.t = 0.2; o.drop = P.eggs.length - n0;
    a.x = m.hx - 900; P.heroes[1].x = a.x - 100; for (let i = 0; i < 60; i++) step(1);
    o.back = m.state !== 'dead' && m.hp === 3;
    return o;
  });
  ok(4, 'Micul George: 3 inimi, se apropie de erou, nu loveste, lasa 1 diamant, revine', r4.hp && r4.closer && r4.noHit && r4.drop === 1 && r4.back, JSON.stringify(r4));

  // 5. the middle fight comes at half of the team's quota, and not before minT seconds
  const r5 = await page.evaluate(() => {
    const P = fresh(0), half = Math.ceil(teamNeed() / 2), o = {};
    P.time = 3; P.found = [half, 0]; calm(); step(2); o.early = !P.duel;
    P.time = G.CONFIG.lupta.george.minT + 1; P.found = [half - 1, 0]; calm(); step(2); o.under = !P.duel;
    P.found = [half - 1, 1]; calm(); step(2); o.mid = !!P.duel && P.duel.kind === 'mid';
    return o;
  });
  ok(5, 'lupta din mijloc vine la jumatatea cotei comune (15), nu mai devreme de minT', r5.early && r5.under && r5.mid, JSON.stringify(r5));

  // 6. the nest fight comes at the whole team quota (30), once
  const r6 = await page.evaluate(() => {
    const P = fresh(0), need = teamNeed(), o = {};
    P.time = 30; P.found = [Math.ceil(need / 2), 0]; calm(); step(2); const d = P.duel;
    d.over = true; P.found = [need - 1, 0]; calm(); step(3); o.notYet = P.duel === d;
    P.found = [need - 1, 1]; calm(); step(2); o.nest = P.duel !== d && P.duel.kind === 'nest';
    const d2 = P.duel; d2.over = true; calm(); step(3); o.once = P.duel === d2;
    return o;
  });
  ok(6, 'lupta de la cuib vine la cota comuna intreaga (30), o singura data', r6.notYet && r6.nest && r6.once, JSON.stringify(r6));

  // 7. the middle fight: midThrows bones and balls, no enemies
  const r7 = await page.evaluate(() => {
    const o = {}, per = [];
    for (const lvl of [0, 5]) {
      const P = fresh(lvl); G.startDuel('mid'); duelReady();
      for (let i = 0; i < 6 * 30; i++) { calm(); step(10); }
      per.push({ lvl, bones: cnt.bones, want: G.CONFIG.lupta.george.midThrows[lvl], enemies: cnt.enemies.length });
    }
    return per;
  });
  ok(7, 'lupta din mijloc: George arunca midThrows oase si mingi si niciun inamic', r7.every(r => r.bones === r.want && r.want > 0 && r.enemies === 0), JSON.stringify(r7));

  // 8, 9, 10, 11. the nest fight: by the hearts he has left
  const r8 = await page.evaluate(() => {
    const out = [];
    for (const lvl of [1, 4]) {
      const P = fresh(lvl); G.startDuel('nest'); const d = duelReady(), H = d.maxHp, N = G.CONFIG.lupta.george.nestEnemies[lvl], o = { lvl, H, N, log: [] };
      let aboveHalf = 0;
      while (d.hp > 1) {
        const b0 = cnt.bones, e0 = cnt.enemies.length;
        hitGeorge();
        o.log.push([d.hp, cnt.bones - b0, cnt.enemies.slice(e0)]);
        if (d.hp > H / 2) aboveHalf += (cnt.bones - b0 === G.CONFIG.lupta.george.boneEvery && cnt.enemies.length === e0) ? 1 : 100;
      }
      o.bonesOk = aboveHalf === o.log.filter(l => l[0] > H / 2).length && aboveHalf > 0;
      const thrownN = cnt.enemies.reduce((a, e) => a + e[0], 0);
      o.enemiesOk = thrownN === N && cnt.enemies.length === 2 && !cnt.enemies[0][1] && cnt.enemies[1][1];
      for (let i = 0; i < 12; i++) { calm(); step(10); }
      const th = P.L.beetles.filter(b => b.thrown && b.state !== 'dead');
      o.landed = th.length; o.hp = th.every(b => b.maxHp === G.CONFIG.lupta.george.enemyHp[lvl]);
      const fol = th.filter(b => b.follow); o.follow = fol.length === N - (N <= 2 ? N : Math.floor(N / 2));
      // the followers do not give up: far from where they landed, after a while, still chasing
      for (let i = 0; i < 48; i++) { calm(); step(10); }
      o.keepOn = fol.every(b => b.state === 'chase' || b.state === 'stun' || b.state === 'knock');
      const hp0 = d.hp; hitGeorge(); o.notArmored = d.hp === hp0 - 1 || d.state === 'flee';
      for (let i = 0; i < 30; i++) step(1);
      o.cleared = P.L.beetles.every(b => !b.thrown);
      out.push(o);
    }
    return out;
  });
  ok(8, 'lupta de la cuib: la fiecare inima pierduta peste jumatate, boneEvery oase si mingi', r8.every(r => r.bonesOk), JSON.stringify(r8.map(r => [r.lvl, r.H, r.log.map(l => l[1])])));
  ok(9, 'la jumatate arunca prima parte din nestEnemies, la ultima inima restul, care urmaresc', r8.every(r => r.enemiesOk && r.follow), JSON.stringify(r8.map(r => [r.lvl, r.N, r.log.map(l => l[2])])));
  ok(10, 'inamicii aruncati au enemyHp inimi, cei de la ultima inima nu renunta, dispar cu George', r8.every(r => r.landed === r.N && r.hp && r.keepOn && r.cleared), JSON.stringify(r8.map(r => [r.lvl, r.landed, r.hp, r.keepOn, r.cleared])));
  ok(11, 'George nu e blindat: poate fi lovit cat inamicii aruncati traiesc', r8.every(r => r.notArmored), JSON.stringify(r8.map(r => r.notArmored)));

  // 12. the level ends only with George beaten, the quota of each, and both in the nest
  const r12 = await page.evaluate(() => {
    const P = fresh(0), L = P.L, o = {};
    const inNest = () => { P.heroes[0].x = L.nest.x - 30; P.heroes[1].x = L.nest.x + 30; P.heroes[0].y = P.heroes[1].y = L.nest.y; for (const h of P.heroes) { h.vx = h.vy = 0; h.dizzy = 0; h.down = false; } };
    P.eggs.length = 0; P.time = 40; P.found = [P.q, P.q]; inNest(); for (let i = 0; i < 60 * 4; i++) { inNest(); calm(); step(1); }
    o.noGeorge = !P.done && !P.nestOpen;                                              // the nest stays closed: George first
    const d = P.duel; while (d && d.kind === 'mid' && d.hp > 0) hitGeorge();
    for (let i = 0; i < 60 && d && !d.over; i++) { calm(); step(10); }                 // he runs away, then the fight is over
    for (let i = 0; i < 60 && !(P.duel && P.duel.kind === 'nest'); i++) { calm(); step(10); }
    const dn = P.duel; while (dn && dn.kind === 'nest' && dn.hp > 0) hitGeorge();
    for (let i = 0; i < 60 && !P.nestOpen; i++) { calm(); step(10); }
    o.open = P.nestOpen;
    P.found = [P.q, P.q - 1]; inNest(); P.nestOpenT = 20; for (let i = 0; i < 60 * 3; i++) { inNest(); calm(); step(1); } o.noQuota = !P.done;
    P.found = [P.q, P.q]; P.heroes[1].x = L.nest.x - 900; for (let i = 0; i < 60 * 3; i++) { P.heroes[0].x = L.nest.x; P.heroes[0].y = L.nest.y; calm(); step(1); } o.oneOut = !P.done;
    inNest(); for (let i = 0; i < 60 * 4 && !P.done; i++) { inNest(); calm(); step(1); } o.ends = P.done;
    return o;
  });
  ok(12, 'nivelul nu se termina fara George invins, fara 15 fiecare, fara amandoi in cuib; se termina cu toate trei', r12.noGeorge && r12.open && r12.noQuota && r12.oneOut && r12.ends, JSON.stringify(r12));

  // 13. one player: the friend's quota counts as found; George comes at half and at all of one quota
  const r13 = await page.evaluate(() => {
    joined = [true, false]; go(0); const P = G.P, o = {};
    for (const b of P.L.beetles) { b.state = 'sleep'; b.cool = 999; } P.L.cones.length = 0; step(3);
    o.need = teamNeed() === P.q; o.friendOk = G.quotaState(1).ok;
    const f0 = P.found[0]; G.collectEgg(window.makeEgg(P.heroes[1].x, P.heroes[1].y, { req: false, goal: true }), 1);
    o.credit = P.found[0] === f0 + 1 && P.found[1] === 0;                       // what the hero who is not playing picks up counts for the one who plays
    P.time = 30; P.found = [Math.ceil(P.q / 2), 0]; calm(); step(2); o.mid = !!P.duel && P.duel.kind === 'mid';
    joined = [true, true]; return o;
  });
  ok(13, 'un singur jucator: cota celuilalt e indeplinita, ce culege eroul care nu joaca se numara la cel care joaca, George vine la jumatatea cotei lui', r13.need && r13.friendOk && r13.credit && r13.mid, JSON.stringify(r13));

  // 14. "Încă o dată!": a restart begins with no diamonds and no George
  const r14 = await page.evaluate(() => {
    const P = fresh(0); P.time = 30; P.found = [8, 7]; calm(); step(2);
    const had = !!P.duel; G.Game.goLevel(G.Game.levelIdx); step(5); G.UI.introT = 2; inp[0].aP = true; step(3);
    const Q = G.P; return { had, team: teamFound(), mid: Q.midFought, nest: Q.nestFought, duel: !!Q.duel };
  });
  ok(14, 'dupa reincepere: zero diamante, fara lupte, fara George', r14.had && r14.team === 0 && !r14.mid && !r14.nest && !r14.duel, JSON.stringify(r14));

  const bad = [];
  for (const [n, label, v, extra] of out) { console.log((v ? 'ok   ' : 'GRESIT ') + n + '. ' + label + (v ? '' : '   ' + (extra || ''))); if (!v) bad.push(n); }
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'george OK (' + game + ')');
  await done();
})();
