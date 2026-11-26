// Un bot merge cu adevarat prin fiecare nivel (singur, cu primul erou). Jocul: variabila JOC (bubu sau lupta).
const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.addInitScript(require('./common.js').BALANSEAZA);      // window.balanseaza() for the two-player run (T7.5)
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(1000);
  await page.mouse.click(900, 500); await page.waitForTimeout(300);
  await page.evaluate((GAME) => {
    const G = __game, I = G.Input, orig = I.poll; G.setGame(GAME); window.bot = { hits: 0, stuck: 0, lastEggs: -1, lastT: 0, tgt: null, field: null, fkey: '' };
    const CS = 40;
    function field(L, tx, ty) {
      const key = (tx / CS | 0) + ',' + (ty / CS | 0) + ':' + (L.gates || []).map(g => g.solid ? 1 : 0).join(''); if (bot.fkey === key && bot.fL === L) return bot.field;      // T7.5: a gate that opens or closes changes the way
      const d = new Int32Array(L.cols * L.rows).fill(-1); let start = L.ci(tx, ty);
      if (!L.reach[start]) { let bd = 1e9; for (let i = 0; i < d.length; i++) if (L.reach[i]) { const x = (i % L.cols + .5) * CS, y = ((i / L.cols | 0) + .5) * CS, dd = Math.hypot(x - tx, y - ty); if (dd < bd) { bd = dd; start = i; } } }
      const q = [start]; d[start] = 0; let qi = 0;
      while (qi < q.length) { const i = q[qi++], cx = i % L.cols, cy = i / L.cols | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (L.reach[j] && L.grid[j] < 2 && d[j] < 0) { d[j] = d[i] + 1; q.push(j); } } }
      bot.field = d; bot.fkey = key; bot.fL = L; return d;
    }
    I.poll = function (dt) {
      orig(dt); if (bot.duo) { duoPoll(dt); return; } const S = I.slots, st = G.Game.state, P = G.P;
      S[0].joined = true; S[0].x = S[0].y = 0; S[0].aP = S[0].aR = S[0].a = false; S[1].joined = false;
      if (st !== 'play' || !P || P.L.boss) return;
      const h = P.heroes[0], L = P.L; let tx = null, ty = null, stomp = false;
      if (h.dizzy > 0 && !bot.wasDizzy) bot.hits++; bot.wasDizzy = h.dizzy > 0;
      if (P.nestOpen) { tx = L.nest.x; ty = L.nest.y; }
      else if (P.duel && !P.duel.over) { const d = P.duel; bot.duelT = (bot.duelT || 0) + dt; tx = d.x; ty = d.y; if (Math.hypot(d.x - h.x, d.y - h.y) < 260 && d.z < 60) { stomp = true; tx = null; } }
      else {
        let bd = 1e9;
        for (const e of P.eggs) if ((e.req || e.goal) && e.delay <= 0 && e.state === 'idle') { const d = Math.hypot(e.x - h.x, e.y - h.y); if (d < bd) { bd = d; tx = e.x; ty = e.y; } }
        if (tx == null) { const tr = L.dynTrees.find(t => t.spark && t.spark.active && !t.spark.done); if (tr) { tx = tr.spark.targets[0].x; ty = tr.spark.targets[0].y; if (Math.hypot(tr.cx - h.x, tr.cy - h.y) < 250 + tr.cr) stomp = true; } }
        // T15: diamonds come only from defeated small enemies: walk to the nearest one and spin when close
        if (tx == null && P.q) { let bb = null, bd3 = 1e9; for (const b of L.beetles) if (b.state !== 'dead') { const d3 = Math.hypot(b.x - h.x, b.y - h.y); if (d3 < bd3) { bd3 = d3; bb = b; } } if (bb) { tx = bb.x; ty = bb.y; if (bd3 < 190) stomp = true; } }
      }
      // T7.5: a band in the way (the target is past it, or there is nothing on this side): go to this hero's place at the gate (mechSteps)
      if (L.gates && L.gates.length && !(P.duel && !P.duel.over)) {
        const fg = frontGate(L);
        if (fg && (tx == null || bandSide(L, tx, ty) !== bandSide(L, h.x, h.y))) { const stp = mechSteps(fg)[0]; if (stp) { tx = stp.x; ty = stp.y; stomp = false; bot.gateT = (bot.gateT || 0) + dt; } }
      }
      if (stomp && h.cd <= 0) S[0].aP = true;
      if (tx == null) return;
      const d = field(L, tx, ty), ci = L.ci(h.x, h.y), cx = ci % L.cols, cy = ci / L.cols | 0;
      let gx = tx, gy = ty;
      if (d[ci] > 1) { let best = d[ci]; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (d[j] < 0) continue; if (dx && dy && (d[cy * L.cols + nx] < 0 || d[ny * L.cols + cx] < 0)) continue; if (d[j] < best) { best = d[j]; gx = (nx + .5) * CS; gy = (ny + .5) * CS; } } }
      else if (d[ci] < 0) { let bd = 1e9; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (d[j] >= 0) { const dd = Math.hypot((nx + .5) * CS - h.x, (ny + .5) * CS - h.y); if (dd < bd) { bd = dd; gx = (nx + .5) * CS; gy = (ny + .5) * CS; } } } }
      const mx = gx - h.x, my = gy - h.y, m = Math.hypot(mx, my) || 1; S[0].x = mx / m; S[0].y = my / m;
      bot.tgt = [tx | 0, ty | 0];
    };
    /* T7.5: the longest time without progress: no diamond found, no gate changed, no hit on George, no hero moved 150 away. */
    window.progress = () => {
      let lastT = G.P.time, max = 0, key = '', anchor = G.P.heroes.map(h => [h.x, h.y]);
      const k = () => { const P = G.P; return [teamFound(), (P.L.gates || []).map(g => g.state).join(''), P.duel ? P.duel.hp + ':' + P.duel.over : '', P.nestOpen, P.heroes.map(h => h.down).join('')].join('|'); };
      key = k();
      return { step() { const P = G.P, nk = k(), moved = P.heroes.some((h, i) => Math.hypot(h.x - anchor[i][0], h.y - anchor[i][1]) > 150);
          if (nk !== key || moved) { max = Math.max(max, P.time - lastT); lastT = P.time; key = nk; anchor = P.heroes.map(h => [h.x, h.y]); } },
        max() { return +Math.max(max, G.P.time - lastT).toFixed(1); } };
    };
    /* T7.5: two bots, one for each hero, each with his own controller (nobody is moved by hand). Each hunts the small enemies on his
       side of the bands and picks up what falls; the friend who was hit gets help (○); in a fight with George both attack him;
       once the team has found its share for this third (or this side is empty), both go to their places at the gate (mechSteps). */
    window.duoPoll = (dt) => {
      const S = I.slots, st = G.Game.state, P = G.P;
      for (const s2 of S) { s2.joined = true; s2.x = s2.y = 0; s2.aP = s2.aR = s2.a = s2.hP = false; }
      bot.f = (bot.f || 0) + 1;
      if (st === 'intro') { if (bot.f % 20 === 0) S[0].aP = true; return; }      // after "Încă o dată!": past the story card
      if (st !== 'play' || !P) return;
      const L = P.L;
      if (P.q && bot.f % 40 === 0 && (P.nestOpen || quotaState(0).ok !== quotaState(1).ok)) balanseaza();
      const fg = L.gates && L.gates.length ? frontGate(L) : null;
      const sideOf = (x, y) => bandSide(L, x, y);
      const back = Math.min(...P.heroes.map(h => sideOf(h.x, h.y))), share = Math.ceil(2 * P.q * (back + 1) / 3);
      const live = (side) => L.beetles.some(b => b.state !== 'dead' && sideOf(b.x, b.y) === side) || P.eggs.some(e => e.state === 'idle' && e.delay <= 0 && sideOf(e.x, e.y) === side);
      if (!live(back)) bot.emptyT = (bot.emptyT || 0) + dt; else bot.emptyT = 0;
      const forward = fg && !P.nestOpen && (teamFound() >= share || bot.emptyT > 6);
      const steps = forward ? mechSteps(fg) : [null, null];
      for (const h of P.heroes) {
        const s2 = S[h.k], fr = P.heroes[1 - h.k]; let tx = null, ty = null, att = false, aimOnly = false;
        if (h.down) continue;
        if (fr.down) {                                    // help the friend
          const reach = h.k === 0 ? G.CONFIG.rescue.reachNear - 40 : G.CONFIG.rescue.reachFar - 60;
          if (Math.hypot(fr.x - h.x, fr.y - h.y) > reach) { tx = fr.x; ty = fr.y; } else { if (bot.f % 8 === 0) s2.hP = true; continue; }
        } else if (P.duel && !P.duel.over) {              // George: both attack him
          const d = P.duel, m = Math.hypot(d.x - h.x, d.y - h.y), R = h.k === 0 ? 200 : 420;
          tx = d.x; ty = d.y; if (m < R && d.z < 70) { aimOnly = true; if (bot.f % (h.k === 0 ? 24 : 18) === 0) att = true; }
        } else if (P.nestOpen) { tx = L.nest.x + (h.k ? 40 : -40); ty = L.nest.y; }
        else if (steps[h.k]) { tx = steps[h.k].x; ty = steps[h.k].y; }
        else {
          const side = sideOf(h.x, h.y); let bd = 1e9;
          for (const e of P.eggs) if (e.state === 'idle' && e.delay <= 0 && sideOf(e.x, e.y) === side) { const q = Math.hypot(e.x - h.x, e.y - h.y); if (q < bd) { bd = q; tx = e.x; ty = e.y; } }
          if (tx == null || bd > 500) for (const b of L.beetles) if (b.state !== 'dead' && sideOf(b.x, b.y) === side) { const q = Math.hypot(b.x - h.x, b.y - h.y); if (q < bd) { bd = q; tx = b.x; ty = b.y; att = q < (h.k === 0 ? 170 : 380) && bot.f % 20 === h.k * 10; aimOnly = h.k === 1 && q < 380; } }
          if (tx == null && fg) { const stp = mechSteps(fg)[h.k]; if (stp) { tx = stp.x; ty = stp.y; } }
          if (tx == null) { tx = L.nest.x; ty = L.nest.y; }
        }
        if (att && h.cd <= 0) s2.aP = true;
        const d = field(L, tx, ty), ci = L.ci(h.x, h.y), cx = ci % L.cols, cy = ci / L.cols | 0; let gx = tx, gy = ty;
        if (d[ci] > 1) { let best = d[ci]; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (d[j] >= 0 && d[j] < best) { best = d[j]; gx = (nx + 0.5) * CS; gy = (ny + 0.5) * CS; } } }
        bot.fkey = '';                                     // two heroes, two targets: no shared cache
        const mx = gx - h.x, my = gy - h.y, m = Math.hypot(mx, my);
        if (aimOnly) { s2.x = mx / (m || 1) * 0.35; s2.y = my / (m || 1) * 0.35; }
        else if (m > 12) { s2.x = mx / m; s2.y = my / m; }
        // pushed against a tree or a rock: slide along it for a moment (a child would walk around)
        if (h.slide > 0) { h.slide--; s2.x = h.slx; s2.y = h.sly; }
        else if ((s2.x || s2.y) && !aimOnly && Math.hypot(h.x - (h.lx ?? -9), h.y - (h.ly ?? -9)) < 0.8) { h.blk = (h.blk || 0) + 1; if (h.blk > 12) { h.blk = 0; h.slide = 40; h.sdir = -(h.sdir || 1); h.slx = -s2.y * h.sdir; h.sly = s2.x * h.sdir; } }
        else h.blk = 0;
        h.lx = h.x; h.ly = h.y;
      }
    };
    window.runDuo = (i, maxT, diff) => {
      bot.duo = true; G.Game.diff = diff.slice(); G.Game.team = { eggs: 0, stars: 0 }; G.Game.goLevel(i); for (let k = 0; k < 5; k++) { I.poll(1 / 60); G.update(1 / 60); } G.Game.state = 'play';
      const prog = progress(); let f = 0; bot.f = 0; bot.emptyT = 0;
      const gateAt = [];
      let retries = 0, wasRetry = false;
      for (; f < maxT * 60; f++) { I.poll(1 / 60); G.update(1 / 60);
        const st = G.Game.state;
        if (st === 'retry' && !wasRetry) retries++; wasRetry = st === 'retry';
        if (st === 'retry' || st === 'loading' || st === 'intro') continue;      // "Încă o dată!": the level starts again, the children play on (at most twice)
        if (st !== 'play' || retries > 2) break; prog.step();
        const P = G.P; (P.L.gates || []).forEach((g, j) => { if (g.state === 'fixed' && gateAt[j] == null) gateAt[j] = Math.round(P.time) + (g.auto ? ' (singura)' : ''); }); }
      bot.duo = false; const P = G.P;
      return { level: i, state: G.Game.state, retries, time: Math.round(P.time), found: P.found.join('/'), q: P.q, gates: gateAt, maxStall: prog.max(), rescues: P.rescues, hits: P.hits };
    };
    window.runLevel = (i, maxT) => {
      G.Game.team = { eggs: 0, stars: 0 }; G.Game.goLevel(i); for (let k = 0; k < 5; k++) { I.poll(1 / 60); G.update(1 / 60); } G.Game.state = 'play'; bot.hits = 0; bot.duelT = 0;
      let lastE = 0, lastChange = 0, stuck = null; const waveT = []; const prog = progress(); bot.gateT = 0;
      for (let f = 0; f < maxT * 60; f++) {
        I.poll(1 / 60); G.update(1 / 60);
        if (G.Game.state !== 'play') break;
        const P = G.P; prog.step(); if (waveT.length <= P.wave) waveT[P.wave] = Math.round(P.time);
        if (P.levelEggs !== lastE) { lastE = P.levelEggs; lastChange = P.time; }
        if (P.time - lastChange > 90 && !P.nestOpen) { stuck = { pos: [P.heroes[0].x | 0, P.heroes[0].y | 0], tgt: bot.tgt, wave: P.wave, left: P.eggs.filter(e => e.req).length }; break; }
      }
      const P = G.P; return { maxStall: prog.max(), gateT: Math.round(bot.gateT || 0), duelT: Math.round(bot.duelT || 0), duelOver: !!(P.duel && P.duel.over), medals: (G.Game.results[i] || {}).med, level: i, state: G.Game.state, time: Math.round(P.time), eggs: P.levelEggs, total: P.L.totalEggs, waveT, hits: bot.hits, stuck, found: P.found[0], q: P.q, leo: [P.heroes[1].x | 0, P.heroes[1].y | 0] };
    };
  }, require('./pw.js').game);
  console.log('joc:', require('./pw.js').game);
  const bad = [];
  const levels = await page.evaluate(() => chapters().map((c, i) => c.kind === 'level' ? i : -1).filter(i => i >= 0));      // T7.5: also the levels of Part Two
  const only = process.env.CAPITOL != null ? +process.env.CAPITOL : -1;      // CAPITOL=7: only that chapter (index), for quick checks
  for (const i of levels) {
    if (only >= 0 && i !== only) continue;
    const r = await page.evaluate((i) => runLevel(i, 900), i);
    console.log(JSON.stringify(r));
    // the level really ended, the bot did not get stuck, and alone the hero reached his own quota (T14.10).
    // On a level with bands (7 - 12): never more than 20 seconds without progress (T7.5)
    const gated = await page.evaluate(() => !!(__game.P.L.gates && __game.P.L.gates.length));
    if (r.state !== 'levelEnd' || r.stuck || (r.q && r.found < r.q) || (gated && r.maxStall > 20)) bad.push('capitolul ' + (i + 1) + ' singur');
  }
  // T7.5: two players on every level with bands, each with his own bot and controller, at two difficulties
  for (const i of levels) {
    if (only >= 0 && i !== only) continue;
    const gated = await page.evaluate((i) => { const L = __game.buildLevel(i); return !!(L.gates && L.gates.length); }, i); if (!gated) continue;
    for (const diff of [['easy', 'normal'], ['normal', 'normal']]) {
      const r = await page.evaluate(([i, d]) => runDuo(i, 900, d), [i, diff]);
      console.log('doi jucatori', diff.join('/'), JSON.stringify(r));
      if (r.state !== 'levelEnd' || r.maxStall > 20 || r.gates.some(g => /singura/.test(g))) bad.push('capitolul ' + (i + 1) + ' doi jucatori ' + diff.join('/'));
    }
  }
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(', ') + ' (nu s-a terminat, sau blocaj peste 20 s)' : 'nivele-bot-mers OK (' + require('./pw.js').game + ')');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
