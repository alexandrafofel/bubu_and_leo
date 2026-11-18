// Fuga cu L3 (T2): viteza x 3 masurata, limita maxSpeed, oprirea cand lasi stick-ul, varianta "hold",
// si proba grea: cu dt fortat la 0.05 niciun erou nu intra intr-un perete, in apa sau in prapastie.
// Scrie "fuga OK" sau "NEREUSIT".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };

  // ---- 1 - 4 and 6: on an open patch of ground, with the stick held right
  const r = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); step(10);
    const P = G.P, h = P.heroes[0], S = G.CONFIG.sprint;
    joined = [true, true];
    const CLEAR = 1150, SEC = 0.5;    // enough free ground to speed up (0.4 s) and then run half a second
    const free = () => {        // a spot with no walls, no mud and nothing solid in front, so the hero runs in a straight line
      const L = P.L;
      for (let y = L.H / 2; y < L.H - 200; y += 40) for (let x = 200; x < L.W - CLEAR - 100; x += 40) {
        let ok = true;
        for (let dx = 0; dx < CLEAR && ok; dx += 20) { const g = L.grid[L.ci(x + dx, y)]; if (g >= 2 || g === 1) ok = false; }
        for (const s of L.solids) if (ok && Math.abs(s.y - y) < s.r + 60 && s.x > x - 60 && s.x < x + CLEAR + 40) ok = false;
        if (ok) return { x, y };
      }
      return null;
    };
    const spot = free(); out.spot = spot;
    /* How far the hero gets in one second, walking or running. The first 0.4 s are only for speeding up
       (the hero does not jump to full speed), they are not measured. The measured half second is doubled, so the
       numbers below are units per second. */
    const walk = (run) => {
      h.x = spot.x; h.y = spot.y; h.vx = h.vy = 0; h.run = false; h.boost = 0; h.dizzy = 0; h.down = false;
      inp[0] = { x: 1, y: 0 };
      if (run) { G.Input.poll(1 / 60); inp[0].runP = true; }
      for (let i = 0; i < 24; i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
      const x0 = h.x;
      for (let i = 0; i < Math.round(SEC * 60); i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
      const d = (h.x - x0) / SEC; inp[0] = { x: 0, y: 0 }; return { d, run: h.run };
    };
    const base = G.CONFIG.heroes[0].speed;
    const w = walk(false); out.walk = Math.round(w.d); out.base = base;
    const f = walk(true); out.runDist = Math.round(f.d); out.ran = f.run;
    out.want = Math.round(base * S.mult);
    // 2. with the rocket on top, the speed stays under maxSpeed
    h.x = spot.x; h.y = spot.y; h.vx = h.vy = 0; h.run = false;
    inp[0] = { x: 1, y: 0 }; G.Input.poll(1 / 60); inp[0].runP = true;
    for (let i = 0; i < 20; i++) { h.boost = 5; G.Input.poll(1 / 60); G.update(1 / 60); }
    let top = 0; for (let i = 0; i < 60; i++) { h.boost = 5; G.Input.poll(1 / 60); G.update(1 / 60); top = Math.max(top, Math.hypot(h.vx, h.vy)); }
    out.topWithRocket = Math.round(top); out.maxSpeed = S.maxSpeed; h.boost = 0;
    // 3. let the stick go: after stopAfter the run is over; moving again is normal walking
    inp[0] = { x: 0, y: 0 };
    for (let i = 0; i < Math.round((S.stopAfter + 0.1) * 60); i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
    out.runAfterRelease = h.run;
    const again = walk(false); out.walkAgain = Math.round(again.d);
    // 6. hit while running: the run is over
    h.x = spot.x; h.y = spot.y; h.vx = h.vy = 0; h.inv = 0; h.dizzy = 0;
    inp[0] = { x: 1, y: 0 }; G.Input.poll(1 / 60); inp[0].runP = true;
    for (let i = 0; i < 12; i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
    out.ranBeforeHit = h.run;
    G.hitHero(h, h.x - 40, h.y);
    for (let i = 0; i < 3; i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
    out.runAfterHit = h.run;
    G.getUp(h, null); h.dizzy = 0; h.inv = 0; inp[0] = { x: 0, y: 0 };
    return out;
  });
  console.log(JSON.stringify(r));
  const near = (a, b, p) => Math.abs(a - b) <= b * p;
  check('1a. mers normal: ' + r.walk + ' unitati intr-o secunda (asteptat ' + r.base + ')', near(r.walk, r.base, 0.05));
  check('1b. fuga: ' + r.runDist + ' unitati intr-o secunda (asteptat ' + r.want + ')', near(r.runDist, r.want, 0.05));
  check('2. cu racheta si fuga viteza ramane sub limita', r.topWithRocket <= r.maxSpeed + 1, { varf: r.topWithRocket, limita: r.maxSpeed });
  check('3a. dupa ce lasi stick-ul fuga se opreste', r.runAfterRelease === false);
  check('3b. dupa oprire mersul e iar normal', near(r.walkAgain, r.base, 0.05), { mers: r.walkAgain });
  check('6. lovit in timpul fugii: fuga s-a oprit', r.ranBeforeHit === true && r.runAfterHit === false, { inainte: r.ranBeforeHit, dupa: r.runAfterHit });

  // ---- 4. mode 'hold': the run lasts only while L3 is held
  const hold = await page.evaluate(() => {
    const G = __game, P = G.P, h = P.heroes[0], S = G.CONFIG.sprint, old = S.mode;
    S.mode = 'hold'; h.run = false; h.dizzy = 0; h.down = false;
    inp[0] = { x: 1, y: 0, run: true }; const out = {};
    for (let i = 0; i < 6; i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
    out.whileHeld = h.run;
    inp[0] = { x: 1, y: 0 };
    for (let i = 0; i < 6; i++) { G.Input.poll(1 / 60); G.update(1 / 60); }
    out.afterRelease = h.run;
    S.mode = old; inp[0] = { x: 0, y: 0 };
    return out;
  });
  check('4. mode "hold": fuga tine doar cat L3 e apasat', hold.whileHeld === true && hold.afterRelease === false, hold);

  // ---- 5. the hard one: running into every edge and into the water, with dt forced to 0.05.
  // What is checked is the line between two frames: if the hero jumped over a wall (through it), a point of that
  // line lands inside a wall. Standing against a wall is fine; crossing it is not.
  const walls = await page.evaluate(async () => {
    const G = __game, out = { bad: [], frames: 0, far: 0 };
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];
    for (const lvl of [0, 1, 2]) {            // level 3 (index 2) is the one with the river
      go(lvl); step(10);
      const P = G.P, L = P.L, h = P.heroes[0], o = P.heroes[1];
      o.x = L.spawn.x; o.y = L.spawn.y;
      joined = [true, false];
      for (const d of dirs) for (const start of [{ x: L.spawn.x, y: L.spawn.y }, { x: L.W * 0.35, y: L.H * 0.5 }, { x: L.W * 0.7, y: L.H * 0.35 }]) {
        h.x = start.x; h.y = start.y; h.vx = h.vy = 0; h.run = false; h.dizzy = 0; h.down = false; h.inv = 999;
        inp[0] = { x: d[0], y: d[1] }; G.Input.poll(0.05); inp[0].runP = true;
        for (let i = 0; i < 100; i++) {        // 5 seconds at dt = 0.05
          const x0 = h.x, y0 = h.y;
          G.Input.poll(0.05); G.update(0.05);
          out.frames++;
          const dx = h.x - x0, dy = h.y - y0, m = Math.hypot(dx, dy);
          if (m > 40) out.far++;               // frames in which the hero moved more than a cell: the dangerous ones
          const n = Math.ceil(m / 8);
          for (let j = 1; j <= n; j++) {
            const sx = x0 + dx * j / n, sy = y0 + dy * j / n, cell = L.grid[L.ci(sx, sy)];
            if (cell >= 2) { out.bad.push({ lvl, d, x: Math.round(sx), y: Math.round(sy), cell, sar: Math.round(m) }); break; }
          }
          if (out.bad.length > 6) break;
        }
        inp[0] = { x: 0, y: 0 };
      }
    }
    joined = [true, true];
    return out;
  });
  check('5. fuga cu dt = 0.05 in toate directiile, 3 niveluri: eroul nu trece niciodata printr-un perete sau peste apa', walls.bad.length === 0, { cadre: walls.frames, cadreLungi: walls.far, gresite: walls.bad.slice(0, 3) });

  // ---- 5b. a wall one cell thick, built here on purpose: at full speed the hero must not go through it.
  // Today's levels have no walls thinner than two cells, so this is the case that proves the small steps work.
  const thin = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); step(10);
    const P = G.P, L = P.L, h = P.heroes[0];
    joined = [true, false];
    // a free strip: the hero starts there, the wall is 420 units in front of him
    let spot = null;
    for (let y = L.top + 200; y < L.H - 200 && !spot; y += 40) for (let x = 200; x < L.W - 900; x += 40) {
      let ok = true;
      for (let dx = 0; dx < 900 && ok; dx += 20) for (const dy of [-60, 0, 60]) if (L.grid[L.ci(x + dx, y + dy)] >= 1) { ok = false; break; }
      for (const s of L.solids) if (ok && Math.abs(s.y - y) < s.r + 90 && s.x > x - 90 && s.x < x + 990) ok = false;
      if (ok) { spot = { x, y }; break; }
    }
    out.spot = spot; if (!spot) return out;
    const wx = Math.floor((spot.x + 420) / 40), old = [];
    for (let cy = 0; cy < L.rows; cy++) {          // one cell wide, from the top of the level to the bottom: it cannot be walked around
      const i = cy * L.cols + wx; old.push([i, L.grid[i]]); L.grid[i] = 2;
    }
    out.wallX = wx * 40;
    // The stress test: the hero is made much faster than the game allows today (2400 instead of 1100), the speed
    // the new levels could need. Without the small steps he jumps clean over a wall one cell thick.
    const oldMax = G.CONFIG.sprint.maxSpeed, oldMult = G.CONFIG.sprint.mult;
    G.CONFIG.sprint.maxSpeed = 2400; G.CONFIG.sprint.mult = 8;
    // started from twelve places 10 units apart, so the jumps land in front of the wall in every possible way
    out.maxX = spot.x; out.ran = false; out.through = false;
    for (let off = 0; off < 12 && !out.through; off++) {
      h.x = spot.x + off * 10; h.y = spot.y; h.vx = h.vy = 0; h.run = false; h.dizzy = 0; h.down = false; h.inv = 999;
      inp[0] = { x: 1, y: 0 }; G.Input.poll(0.05); inp[0].runP = true;
      for (let i = 0; i < 60; i++) {
        G.Input.poll(0.05); G.update(0.05);
        out.maxX = Math.max(out.maxX, h.x);
        if (h.x > wx * 40 + 40 + 27) { out.through = true; out.offset = off * 10; break; }      // past the far side of the wall = it went through
      }
      out.ran = out.ran || h.run;
      inp[0] = { x: 0, y: 0 };
    }
    for (const [i, v] of old) L.grid[i] = v;
    G.CONFIG.sprint.maxSpeed = oldMax; G.CONFIG.sprint.mult = oldMult;
    inp[0] = { x: 0, y: 0 }; joined = [true, true];
    return out;
  });
  check('5b. perete de o singura celula, la viteza de 2400 (proba grea): eroul nu trece prin el', thin.spot && thin.ran && !thin.through, { peretele: thin.wallX, celMaiDeparte: Math.round(thin.maxX || 0), fugea: thin.ran });


  if (bad.length) console.log('NEREUSIT: ' + bad.join(' | ')); else console.log('fuga OK');
  await done();
})();
