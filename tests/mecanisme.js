// Mecanismele de colaborare (T7): benzile, portile si regulile lor. docs/25-niveluri-7-12.md, 3.1 - 3.3.
// Partea 1 (T7.1): pe o definitie de proba facuta aici (nu in joc), cu intrari pornite direct din test.
// Testul de colaborare: un singur erou, cu prietenul in joc dar stand pe loc, nu trece de nicio poarta, nici fugind.
// Fiecare verificare a fost stricata o data, ca sa vedem ca pica (docs/17-testare.md).
// Scrie "mecanisme OK" sau "NEREUSIT".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };

  // ---------- partea 1: cadrul, cu intrari de proba ----------
  const r = await page.evaluate(() => {
    const G = __game, out = {};
    const orig = LEVEL_DEFS_L[0];
    MECH_RECIPES.tAny = { rule: 'any', stay: 1.5, inputs: [{ kind: 'test', who: -1, side: 'near', dy: -300 }, { kind: 'test', who: -1, side: 'far', dy: -300 }] };
    MECH_RECIPES.tAll = { rule: 'all', stay: 5, inputs: [{ kind: 'test', who: 0, side: 'near', dy: -400 }, { kind: 'test', who: 1, side: 'near', dy: 400 }] };
    LEVEL_DEFS_L[0] = Object.assign({}, orig, { bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'tAny' }, { at: 0.665, kind: 'wall', w: 200, mech: 'tAll' }], lanes: [0, 0, 0], pond: false, stars: ['nook', 'nook', 'nook'] });
    G.Game.diff[0] = G.Game.diff[1] = 'normal';                          // the first player starts on "Ușor": the times below are the normal ones
    go(0); step(3);
    let P = G.P; const L = P.L, [A, B] = L.gates, a = P.heroes[0], b = P.heroes[1], cols = L.cols;
    const inA = A.inputs.map(i => L.inputs[i]), inB = B.inputs.map(i => L.inputs[i]);
    const code = i => L.grid[i];
    const closedA = () => A.cells.every(i => code(i) === 2), openA = () => A.cells.every(i => code(i) === 0);
    const closedB = () => B.cells.every(i => code(i) === 3), openB = () => B.cells.every(i => code(i) === 0);
    const park = () => { a.x = L.spawn.x; a.y = L.spawn.y; b.x = L.spawn.x + 60; b.y = L.spawn.y; a.vx = a.vy = b.vx = b.vy = 0; };
    const sec = s => step(Math.round(s * 60));
    // 1. structura
    let bandFull = true;
    for (const g of [A, B]) for (let cy = (L.top / 40 | 0) + 1; cy < L.rows; cy++) {
      const y = (cy + 0.5) * 40, cx = bandX(g, y) / 40 | 0, i = cy * cols + cx;
      if (L.grid[i] !== g.code && !g.cells.includes(i)) bandFull = false;
    }
    out.struct = { n: L.gates.length, cellsA: A.cells.length, cellsB: B.cells.length, codes: [A.code, B.code], bandFull, inputs: L.inputs.length, flag32: A.cells.every(i => L.flag[i] & 32) };
    out.reachNest = !!L.reach[L.ci(L.nest.x, L.nest.y)];
    out.startClosed = closedA() && closedB() && A.state === 'closed' && B.state === 'closed';
    out.inputSides = { a0: inA[0].x < bandLeft(A, inA[0].y), a1: inA[1].x > bandRight(A, inA[1].y), b0: inB[0].x < bandLeft(B, inB[0].y), b1: inB[1].x < bandLeft(B, inB[1].y) };
    // 2. inchisa: nu se poate trece
    park(); a.x = A.x - A.w / 2 - 60; a.y = A.y; inp[0] = { x: 1, y: 0 }; sec(3); inp[0] = { x: 0, y: 0 };
    out.blocked = { x: a.x, edge: bandLeft(A, a.y) };
    // 3. any: o intrare deschide; eroul trece
    inA[0].raw = true; sec(0.8);
    out.anyOpen = { open: openA(), state: A.state, opened: A.opened, freeze: P.kickT < 2 };
    inp[0] = { x: 1, y: 0 }; sec(2.2); inp[0] = { x: 0, y: 0 };
    out.crossed = { x: a.x, edge: bandRight(A, a.y) };
    // 4. any: lasata, cu nimeni langa trecere -> se inchide indata
    park(); sec(0.2); inA[0].raw = false; step(6);
    out.anyCloseNow = { closed: closedA(), state: A.state };
    // 5. any: lasata, cu un erou langa trecere -> mai sta deschisa `stay` (1.5 s)
    inA[1].raw = true; sec(0.8); b.x = A.x + A.w / 2 + 80; b.y = A.y; inA[1].raw = false;
    sec(1.0); out.anyStay1 = openA(); sec(1.0); out.anyStay2 = closedA();
    // 6. all: una singura nu deschide, amandoua da, apoi mai sta 5 s
    park(); inB[0].raw = true; sec(1); out.allOne = closedB();
    inB[1].raw = true; sec(0.8); out.allBoth = openB();
    inB[0].raw = inB[1].raw = false; sec(4); out.allStay4 = openB(); sec(1.6); out.allStay6 = closedB();
    // 7. allWithin (fereastra 4 s): la 2 s una de alta deschide, la 5 s nu
    B.rule = 'allWithin'; B.window = 4; B.stay = 0.5;
    const pulse = p => { p.raw = true; step(2); p.raw = false; step(1); };
    pulse(inB[0]); sec(2); pulse(inB[1]); step(30); out.withinNear = openB(); sec(2);
    pulse(inB[0]); sec(5); pulse(inB[1]); step(30); out.withinFar = closedB(); sec(5);
    // 8. seq: ordinea gresita nu deschide, ordinea buna da
    B.rule = 'seq'; B.step = 0; B.stay = 0.5;
    pulse(inB[1]); pulse(inB[0]); step(30); out.seqWrong = closedB();
    B.step = 0; pulse(inB[0]); pulse(inB[1]); step(30); out.seqRight = openB(); sec(2);
    // 9. "Ușor": stay * 1.6 (all, 5 s -> 8 s)
    B.rule = 'all'; B.stay = 5; G.Game.diff[0] = 'easy';
    inB[0].raw = inB[1].raw = true; sec(0.8); inB[0].raw = inB[1].raw = false; sec(6.5); out.easyStay = openB(); sec(2.5); out.easyEnd = closedB();
    G.Game.diff[0] = 'normal';
    // 10. G1: nu se inchide sub un erou
    inA[0].raw = true; sec(0.8); const c0 = A.cells[A.cells.length / 2 | 0]; a.x = (c0 % cols + 0.5) * 40; a.y = ((c0 / cols | 0) + 0.5) * 40; b.x = L.spawn.x; b.y = L.spawn.y;
    inA[0].raw = false; sec(3); out.g1 = { open: !A.solid, onCells: onGateCells(a, A) };
    a.x = A.x - A.w / 2 - 300; a.y = A.y; sec(0.5); out.g1after = closedA();
    // 11. reinceperea: totul de la zero
    inA[0].raw = true; sec(0.8); G.Game.goLevel(0); step(5); G.UI.introT = 2; inp[0].aP = true; step(3); P = G.P;
    out.restart = P.L.gates.every(g => g.state === 'closed' && g.cells.every(i => P.L.grid[i] === g.code));
    LEVEL_DEFS_L[0] = orig; delete MECH_RECIPES.tAny; delete MECH_RECIPES.tAll;
    return out;
  });
  console.log(JSON.stringify(r));
  check('doua benzi, cu trecere si intrari', r.struct.n === 2 && r.struct.cellsA > 0 && r.struct.cellsB > 0 && r.struct.inputs === 4, r.struct);
  check('banda taie harta de sus pana jos', r.struct.bandFull, r.struct);
  check('trecerea are steagul 32', r.struct.flag32);
  check('codurile: prapastie 2, zid 3', r.struct.codes[0] === 2 && r.struct.codes[1] === 3, r.struct.codes);
  check('cuibul se poate atinge (cu portile deschise)', r.reachNest);
  check('portile sunt inchise la inceput', r.startClosed);
  check('intrarile stau pe malul lor', Object.values(r.inputSides).every(Boolean), r.inputSides);
  check('banda inchisa nu se poate trece', r.blocked.x < r.blocked.edge, r.blocked);
  check('any: o intrare deschide poarta', r.anyOpen.open && r.anyOpen.state === 'open' && r.anyOpen.opened, r.anyOpen);
  check('prima deschidere: oprire scurta si camera', r.anyOpen.freeze, r.anyOpen);
  check('cu poarta deschisa eroul trece', r.crossed.x > r.crossed.edge, r.crossed);
  check('any: lasata, cu nimeni langa trecere, se inchide indata', r.anyCloseNow.closed && r.anyCloseNow.state === 'closed', r.anyCloseNow);
  check('any: lasata, cu un erou langa trecere, mai sta 1.5 s', r.anyStay1 && r.anyStay2, [r.anyStay1, r.anyStay2]);
  check('all: o singura intrare nu deschide', r.allOne);
  check('all: amandoua deschid', r.allBoth);
  check('all: mai sta deschisa 5 s, apoi se inchide', r.allStay4 && r.allStay6, [r.allStay4, r.allStay6]);
  check('allWithin: la 2 s una de alta deschide', r.withinNear);
  check('allWithin: la 5 s una de alta nu deschide', r.withinFar);
  check('seq: ordinea gresita nu deschide', r.seqWrong);
  check('seq: ordinea buna deschide', r.seqRight);
  check('Usor: timpul de stat deschis e de 1.6 ori', r.easyStay && r.easyEnd, [r.easyStay, r.easyEnd]);
  check('G1: nu se inchide sub un erou', r.g1.open && r.g1.onCells, r.g1);
  check('G1: se inchide dupa ce pleaca', r.g1after);
  check('reinceperea: portile inchise din nou', r.restart);

  // ---------- testul de colaborare: placile adevarate, un singur erou ----------
  const s = await page.evaluate(() => {
    const G = __game, out = {}, orig = LEVEL_DEFS_L[0];
    LEVEL_DEFS_L[0] = Object.assign({}, orig, { bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'plates1' }, { at: 0.665, kind: 'chasm', w: 200, mech: 'plates2' }], lanes: [0, 0, 0], pond: false, stars: ['nook', 'nook', 'nook'], beetles: [0, 0, 0] });
    go(0); step(3);
    const P = G.P, L = P.L, [A, B] = L.gates, a = P.heroes[0], b = P.heroes[1];
    L.beetles.length = 0; L.cones.length = 0; if (L.birds) L.birds.length = 0; G.CONFIG.lupta.george.on = false;
    const pl = L.inputs;
    out.gap = A.inputs.map(i => Math.round(dist(pl[i].x, pl[i].y, A.x, A.y)));
    // 1. cine trece nu poate fi cel care deschide: un erou pe trecere nu apasa o placa pusa sub el
    const p0 = pl[A.inputs[0]], keep = { x: p0.x, y: p0.y };
    a.x = A.x; a.y = A.y; p0.x = a.x; p0.y = a.y; step(2); out.crosserPress = p0.on; p0.x = keep.x; p0.y = keep.y;
    // 2. un singur erou incearca poarta A: sta pe placa, apoi fuge spre trecere si mai departe, 60 s
    const bot = (h, k, plate, g, secs) => {
      let passed = false, mode = 0, t = 0, wait = 0, tries = 0;
      for (let f = 0; f < secs * 60; f++) {
        b.x = L.spawn.x; b.y = L.spawn.y + 200;                         // the friend plays, but stays where he is
        const tx = mode === 0 ? plate.x : g.x + 400, ty = mode === 0 ? plate.y : g.y;
        const dx = tx - h.x, dy = ty - h.y, m = Math.hypot(dx, dy) || 1;
        if (mode === 0) {
          if (m < 30) { inp[k] = { x: 0, y: 0 }; wait += 1 / 60; if (wait > 0.6 + (tries % 3) * 0.5) { mode = 1; tries++; if (tries % 2) inp[k].runP = true; } }
          else inp[k] = { x: dx / m, y: dy / m };
        } else {
          inp[k] = { x: dx / m, y: dy / m, run: tries % 2 === 1 };
          t += 1 / 60; if (t > 4) { mode = 0; t = 0; wait = 0; }
        }
        step(1);
        if (h.x > bandRight(g, h.y) + 10) passed = true;
      }
      inp[k] = { x: 0, y: 0 };
      return { passed, tries, x: Math.round(h.x), edge: Math.round(bandRight(g, h.y)), opened: g.opened };
    };
    a.x = pl[A.inputs[0]].x; a.y = pl[A.inputs[0]].y;
    out.soloA = bot(a, 0, pl[A.inputs[0]], A, 60);
    // 3. la poarta B: placa lui Boon, apoi fuga. Placa lui Killer e departe, de partea cealalta
    A.state = 'fixed'; step(40);
    a.x = pl[B.inputs[0]].x; a.y = pl[B.inputs[0]].y; step(2);
    out.soloB = bot(a, 0, pl[B.inputs[0]], B, 40);
    // 4. iar cu doi: Boon pe placa, Killer trece (dovada ca poarta A se poate trece impreuna)
    G.Game.goLevel(0); step(5); G.UI.introT = 2; inp[0].aP = true; step(3);
    const P2 = G.P, L2 = P2.L, A2 = L2.gates[0], a2 = P2.heroes[0], b2 = P2.heroes[1], q = L2.inputs[A2.inputs[0]];
    a2.x = q.x; a2.y = q.y; b2.x = A2.x - A2.w / 2 - 30; b2.y = A2.y; step(40);
    inp[1] = { x: 1, y: 0 }; for (let f = 0; f < 150; f++) { a2.x = q.x; a2.y = q.y; step(1); } inp[1] = { x: 0, y: 0 };
    out.together = { x: Math.round(b2.x), edge: Math.round(bandRight(A2, b2.y)), open: !A2.solid };
    G.CONFIG.lupta.george.on = true;
    LEVEL_DEFS_L[0] = orig;
    return out;
  });
  console.log(JSON.stringify(s));
  check('placile de la poarta A stau la cel putin 700 de trecere', s.gap.every(d => d >= 700), s.gap);
  check('un erou de pe trecere nu apasa placa', !s.crosserPress);
  check('singur la poarta A: nu trece, nici fugind (60 s)', !s.soloA.passed && s.soloA.tries >= 4, s.soloA);
  check('singur la poarta B: nu trece', !s.soloB.passed, s.soloB);
  check('impreuna la poarta A: unul pe placa, celalalt trece', s.together.x > s.together.edge, s.together);
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(', ') : 'mecanisme OK');
  await done();
})();
