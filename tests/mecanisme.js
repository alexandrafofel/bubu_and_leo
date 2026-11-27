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
  // ---------- partea a treia (T7.2): placile cu cine calca, sunetul, cusca ----------
  const c3 = await page.evaluate(() => {
    const G = __game, out = {}, orig = LEVEL_DEFS_L[0];
    LEVEL_DEFS_L[0] = Object.assign({}, orig, { bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'plates2' }], cage: true, lanes: [0, 0, 0], pond: false, stars: ['nook', 'nook', 'nook'], beetles: [0, 0, 0] });
    G.Game.diff[0] = G.Game.diff[1] = 'normal';
    go(0); step(3);
    const P = G.P, L = P.L, [A] = L.gates, a = P.heroes[0], b = P.heroes[1], cg = L.cage;
    L.beetles.length = 0; L.cones.length = 0; if (L.birds) L.birds.length = 0; G.CONFIG.lupta.george.on = false;
    const sec = s => step(Math.round(s * 60));
    const tur = L.inputs[A.inputs[0]], ice = L.inputs[A.inputs[1]];
    // 1. placa turcoaz (who 0): Boon o apasa, Killer nu
    a.x = tur.x; a.y = tur.y; b.x = L.spawn.x; b.y = L.spawn.y; step(2);
    out.turBoon = tur.on;
    b.x = tur.x; b.y = tur.y; a.x = L.spawn.x; a.y = L.spawn.y; step(2);
    out.turKiller = tur.on;
    // 2. apasata: se scufunda; lasata: se ridica, si se aude clopotelul (fell)
    a.x = tur.x; a.y = tur.y; b.x = L.spawn.x; b.y = L.spawn.y; sec(0.5); out.sinkDown = tur.sink;
    a.x = L.spawn.x; a.y = L.spawn.y - 300; sec(0.6); out.sinkUp = tur.sink;
    // 3. cusca: un singur erou o loveste: nu se deschide, se clatina
    a.x = cg.x - 90; a.y = cg.y; b.x = L.spawn.x; b.y = L.spawn.y - 300; step(2);
    cageSwing(a, 9001); out.cageOne = { done: cg.done, wob: cg.wobT > 0 };
    // 4. aceeasi lovitura numarata o singura data (10 cadre cu acelasi id)
    for (let i = 0; i < 10; i++) cageSwing(a, 9001); out.cageDup = { done: cg.done, hit: cg.hit[0] > 0 };
    // 5. al doilea erou lovind dupa mai mult de 1.5 s nu deschide
    sec(2); b.x = cg.x + 90; b.y = cg.y; step(2); cageSwing(b, 9002); out.cageLate = cg.done;
    // 6. cu amandoi in fereastra (1.5 s): se deschide, steluta e stransa
    const starGot0 = L.stars.filter(s => s.kind === 'cage' && s.got).length;
    cg.hit = [-99, -99]; cg.done = false; cg.wobT = 0;
    cageSwing(a, 9003); sec(0.5); cageSwing(b, 9004);
    out.cageBoth = { done: cg.done, by: cg.by, star: L.stars.filter(s => s.kind === 'cage' && s.got).length - starGot0, banner: P.banner && P.banner.kind };
    // 7. sunetele noi exista
    out.sounds = ['plate', 'plateOff', 'cage'].map(n => Snd.names2().includes(n));
    // 8. pentru captura: placa apasata si cusca deschisa; apoi se vede placa libera
    return out;
  });
  console.log(JSON.stringify(c3));
  check('placa turcoaz nu o apasa Killer', c3.turKiller === false, c3.turKiller);
  check('placa turcoaz o apasa Boon', c3.turBoon === true, c3.turBoon);
  check('placa se scufunda cand e calcata', c3.sinkDown > 0.5, c3.sinkDown);
  check('placa se ridica cand e lasata', c3.sinkUp < 0.5, c3.sinkUp);
  check('cusca: un singur erou nu o deschide, o clatina', c3.cageOne.done === false && c3.cageOne.wob === true, c3.cageOne);
  check('cusca: aceeasi lovitura numarata o singura data', c3.cageDup.done === false, c3.cageDup);
  check('cusca: al doilea erou dupa 2 s nu deschide', c3.cageLate === false, c3.cageLate);
  check('cusca: amandoi in 1.5 s o deschid, steluta e stransa', c3.cageBoth.done === true && c3.cageBoth.by === 1 && c3.cageBoth.star === 1, c3.cageBoth);
  check('sunetele placilor si cuștii exista', c3.sounds.every(Boolean), c3.sounds);

  // ---------- partea a patra (T7.3): regulile de siguranta G1 - G10 si mechSteps ----------
  const g = await page.evaluate(() => {
    const G = __game, out = {}, orig = LEVEL_DEFS_L[0], M = G.CONFIG.mech, keepM = Object.assign({}, M);
    LEVEL_DEFS_L[0] = Object.assign({}, orig, { bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'plates1' }, { at: 0.665, kind: 'chasm', w: 200, mech: 'plates2' }], cage: true, lanes: [0, 0, 0], pond: false, stars: ['nook', 'nook', 'nook'], beetles: [0, 0, 0] });
    G.Game.diff[0] = G.Game.diff[1] = 'normal';
    const fresh = () => {
      joined[0] = joined[1] = true; go(0); step(3);
      const P = G.P, L = P.L; L.beetles.length = 0; L.cones.length = 0; if (L.birds) L.birds.length = 0; G.CONFIG.lupta.george.on = false;
      for (const h of P.heroes) h.inv = 0;
      return { P, L, A: L.gates[0], B: L.gates[1], a: P.heroes[0], b: P.heroes[1] };
    };
    const sec = s => step(Math.round(s * 60));
    const put = (h, x, y) => { h.x = h.px = x; h.y = h.py = y; h.vx = h.vy = 0; };
    const solid = g => g.cells.every(i => __game.P.L.grid[i] === g.code), free = g => g.cells.every(i => __game.P.L.grid[i] === 0);
    const cellXY = (L, i) => ({ x: (i % L.cols + 0.5) * 40, y: ((i / L.cols | 0) + 0.5) * 40 });
    let Z;
    // mechSteps: la fiecare poarta inchisa, un loc si o actiune pentru fiecare erou
    Z = fresh(); { const { L, A, B, a, b } = Z;
      put(a, A.x - 500, A.y - 80); put(b, A.x - 520, A.y + 80); step(2);
      const sA = mechSteps(A), pA = A.inputs.map(i => L.inputs[i]);
      out.stepsA = sA.map(s => s && s.act).sort().join(',');
      out.stepsAplate = sA.some(s => s && s.act === 'stand' && pA.some(p => p.x === s.x && p.y === s.y));
      const q = pA[0]; put(a, q.x, q.y); put(b, A.x - A.w / 2 - 60, A.y); step(30);
      const sO = mechSteps(A); out.stepsOpen = { a: sO[0] && sO[0].act, b: sO[1] && sO[1].act, bx: sO[1] && sO[1].x > bandRight(A, A.y), open: A.state };
      // poarta B: amandoi trec de A ca sa ajunga la ea (G2 o fixeaza pe A)
      put(a, B.x - 500, B.y); put(b, B.x - 520, B.y + 60); step(2);
      const sB = mechSteps(B), pB = B.inputs.map(i => L.inputs[i]);
      out.stepsB = sB.map(s => s && s.act).join(',');
      out.stepsBown = pB.every(p => { const s = sB[p.who]; return s && s.x === p.x && s.y === p.y; });
    }
    // G1: poarta 'any' lasata nu se inchide sub un erou de pe celulele ei
    Z = fresh(); { const { L, A, a, b } = Z, q = L.inputs[A.inputs[0]];
      put(a, q.x, q.y); sec(0.8); const c = cellXY(L, A.cells[Math.floor(A.cells.length / 2)]);
      put(b, c.x, c.y); put(a, q.x, q.y - 250); sec(3);
      out.g1 = { free: free(A), on: onGateCells(b, A) };
      put(b, A.x - A.w / 2 - 200, A.y); sec(2.5); out.g1after = solid(A);
    }
    // G2: amandoi dincolo de banda -> fixed, ramane deschisa
    Z = fresh(); { const { L, A, a, b } = Z, q = L.inputs[A.inputs[0]];
      put(a, q.x, q.y); sec(0.8);
      put(a, bandRight(A, A.y) + 160, A.y); put(b, bandRight(A, A.y) + 200, A.y + 60); sec(0.3);
      out.g2state = A.state; sec(8); out.g2open = free(A);
    }
    // G3: un erou jos -> toate portile deschise; ridicat -> se inchid dupa stay
    Z = fresh(); { const { P, A, B, a, b } = Z;
      put(a, A.x - 400, A.y); put(b, A.x - 450, A.y + 80); step(2);
      hitHero(a, a.x - 40, a.y); out.g3down = a.down; sec(1);
      out.g3open = free(A) && free(B);
      a.down = false; a.dizzy = 0; a.downLeft = 0; sec(2.2); out.g3A = solid(A); out.g3Bmid = free(B); sec(3.8); out.g3B = solid(B);
    }
    // G4: pasarea il lasa doar pe partea de unde l-a luat
    Z = fresh(); { const { L, A, a } = Z;
      put(a, A.x - 400, A.y + 100); const side0 = bandSide(L, a.x, a.y);
      a.grabSide = side0; a.grabX = a.x; a.grabY = a.y; const bd = { grab: a }; a.carried = bd;
      put(a, bandRight(A, A.y) + 300, A.y + 100); dropHero(bd);
      out.g4 = { side0, side: bandSide(L, a.x, a.y), carried: !!a.carried };
    }
    // G5: vantul si o lovitura nu imping un erou in banda
    Z = fresh(); { const { P, L, A, a, b } = Z, y = A.y + 360;
      put(a, bandLeft(A, y) - 60, y); put(b, L.spawn.x, L.spawn.y);
      P.wind.state = 'blow'; P.wind.dir = 1; P.wind.power = 1;
      for (let f = 0; f < 240; f++) { P.wind.power = 1; P.wind.dir = 1; if (f % 30 === 0) a.vx = 2400; step(1); }
      out.g5 = { x: Math.round(a.x), edge: Math.round(bandLeft(A, a.y)), ok: a.x < bandX(A, a.y) };
      P.wind.power = 0;
    }
    // G6: un singur jucator
    Z = fresh(); joined[1] = false; step(3); { const { L, A, B, a, b } = Z, P = G.P;
      put(a, A.x - 400, A.y); sec(1); out.g6A = free(A);
      const qb = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)]; put(a, qb.x, qb.y); sec(1); out.g6B = free(B);
      B.rule = 'allWithin'; B.window = 1; B.stay = 0.2; B.state = 'closed'; put(a, qb.x, qb.y - 300); sec(4); out.g6within = free(B);
      const cg = L.cage; put(a, cg.x - 90, cg.y); step(2); cageSwing(a, 8101); out.g6cage = cg.done;
    }
    joined[1] = true;
    // G7, G8: fara progres langa poarta B -> sageata si iconita la hintAfter, deschidere singura la autoOpen
    Z = fresh(); { const { P, L, B, a, b } = Z;
      M.autoOpen = 6; M.hintAfter = 2;
      put(a, B.x - 600 - 700, B.y); put(b, B.x - 650 - 700, B.y + 60); sec(3); out.g7far = B.idleT;
      put(a, B.x - 300, B.y); put(b, B.x - 320, B.y + 80); sec(1.5); out.g8before = gateHinting(B);
      sec(1); out.g8 = gateHinting(B);
      const gt = guideTarget(a), mine = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)];
      out.g8arrow = !!gt && gt.x === mine.x && gt.y === mine.y && gt.kind === 'stand';
      G.Opt.guide[0] = false; out.g8force = !!(mechGuide(a) && mechGuide(a).hint); G.Opt.guide[0] = true;
      sec(4); out.g7 = { state: B.state, banner: P.banner && P.banner.kind, free: free(B) };
      M.autoOpen = keepM.autoOpen; M.hintAfter = keepM.hintAfter;
    }
    // G9: in lupta cu George portile nu isi schimba starea
    Z = fresh(); { const { P, L, B, a, b } = Z;
      startDuel('mid'); step(2); for (const h of P.heroes) h.inv = 999;
      const q0 = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)], q1 = L.inputs[B.inputs.find(i => L.inputs[i].who === 1)];
      for (let f = 0; f < 90; f++) { put(a, q0.x, q0.y); put(b, q1.x, q1.y); step(1); }
      out.g9 = { duel: !!(P.duel && !P.duel.over), state: B.state, solid: solid(B) };
      P.duel.over = true; for (let f = 0; f < 60; f++) { put(a, q0.x, q0.y); put(b, q1.x, q1.y); step(1); }
      out.g9after = free(B);
    }
    // G10: la reincepere totul de la zero
    Z = fresh(); { const { L, A, B } = Z;
      A.state = 'fixed'; A.idleT = 99; L.cage.done = true; step(40);
      closeGates(L); out.g10close = { gates: L.gates.every(g => g.state === 'closed' && g.idleT === 0 && !g.g3), cage: !L.cage.done && L.cage.hit[0] < 0, star: L.stars.filter(x => x.kind === 'cage').every(x => x.hidden) };
      A.state = 'fixed'; L.cage.done = true; step(10);
      G.Game.goLevel(0); step(5); G.UI.introT = 2; inp[0].aP = true; step(3);
      const L2 = G.P.L, A2 = L2.gates[0], cg = L2.cage;
      out.g10 = { state: L2.gates.map(g => g.state).join(','), idle: L2.gates.every(g => g.idleT < 1), solid: L2.gates.every(g => g.cells.every(i => L2.grid[i] === g.code)), cage: !cg.done, star: L2.stars.filter(s => s.kind === 'cage').every(s => s.hidden) };
    }
    G.CONFIG.lupta.george.on = true; LEVEL_DEFS_L[0] = orig; Object.assign(M, keepM);
    return out;
  });
  console.log(JSON.stringify(g));
  check('mechSteps: la poarta A unul sta pe placa, celalalt asteapta sa treaca', g.stepsA === 'cross,stand' && g.stepsAplate, [g.stepsA, g.stepsAplate]);
  check('mechSteps: la poarta B fiecare la placa lui', g.stepsB === 'stand,stand' && g.stepsBown, [g.stepsB, g.stepsBown]);
  check('mechSteps: poarta deschisa, cel de pe placa sta, celalalt trece', g.stepsOpen.a === 'stand' && g.stepsOpen.b === 'cross' && g.stepsOpen.bx, g.stepsOpen);
  check('G1: poarta any nu se inchide sub un erou', g.g1.free && g.g1.on, g.g1);
  check('G1: se inchide dupa ce pleaca', g.g1after);
  check('G2: amandoi dincolo -> fixed, ramane deschisa', g.g2state === 'fixed' && g.g2open, [g.g2state, g.g2open]);
  check('G3: un erou jos -> toate portile deschise', g.g3down && g.g3open, [g.g3down, g.g3open]);
  check('G3: dupa ridicare se inchid dupa stay', g.g3A && g.g3Bmid && g.g3B, [g.g3A, g.g3Bmid, g.g3B]);
  check('G4: pasarea il lasa pe partea de unde l-a luat', g.g4.side === g.g4.side0 && !g.g4.carried, g.g4);
  check('G5: vantul si loviturile nu il imping in banda', g.g5.ok, g.g5);
  check('G6: singur, poarta any e deschisa', g.g6A);
  check('G6: singur, placa celuilalt e apasata', g.g6B);
  check('G6: singur, fara fereastra de timp', g.g6within);
  check('G6: singur, cusca la o lovitura', g.g6cage);
  check('G7: departe de poarta nu se numara', g.g7far < 0.5, g.g7far);
  check('G8: inainte de hintAfter fara iconite', !g.g8before);
  check('G8: dupa hintAfter iconite si sageata spre locul lui', g.g8 && g.g8arrow, [g.g8, g.g8arrow]);
  check('G8: sageata si cu sageata oprita', g.g8force);
  check('G7: dupa autoOpen se deschide singura, cu mesaj', g.g7.state === 'fixed' && g.g7.banner === 'gateAuto' && g.g7.free, g.g7);
  check('G9: in lupta portile nu se schimba', g.g9.duel && g.g9.state === 'closed' && g.g9.solid, g.g9);
  check('G9: dupa lupta merg din nou', g.g9after);
  check('G10: closeGates pune totul la zero (si cusca)', g.g10close.gates && g.g10close.cage && g.g10close.star, g.g10close);
  check('G10: la reincepere totul de la zero', g.g10.state === 'closed,closed' && g.g10.idle && g.g10.solid && g.g10.cage && g.g10.star, g.g10);

  // ---------- partea finala (T7.5): nivelul 7 adevarat (capitolul 7), cele doua porti ----------
  const n7 = await page.evaluate(() => {
    const G = __game, M = G.CONFIG.mech, keep = M.autoOpen, out = { A: {}, B: {} };
    G.Game.diff[0] = G.Game.diff[1] = 'normal';
    const fresh = (solo) => { joined[0] = true; joined[1] = !solo; go(chIdx('level', 6)); step(3); const P = G.P, L = P.L;
      L.beetles.length = 0; L.cones.length = 0; if (L.birds) L.birds.length = 0; G.CONFIG.lupta.george.on = false; P.wind.power = 0;
      for (const h of P.heroes) { h.x = L.spawn.x; h.y = L.spawn.y + 200; h.vx = h.vy = 0; } step(2); return { P, L, A: L.gates[0], B: L.gates[1], a: P.heroes[0], b: P.heroes[1] }; };
    const put = (h, x, y) => { h.x = h.px = x; h.y = h.py = y; h.vx = h.vy = 0; };
    const solid = g => g.cells.every(i => G.P.L.grid[i] === g.code);
    const sec = t => step(Math.round(t * 60));
    let Z = fresh();
    out.key = Z.L.def.key; out.recipes = Z.L.gates.map(g => g.mech).join(',');
    // 1. inchise la inceput, nu se poate trece
    for (const [n, g] of [['A', Z.A], ['B', Z.B]]) {
      out[n].closed = solid(g) && g.state === 'closed';
      const h = Z.a; put(h, g.x - g.w / 2 - 60, g.y); inp[0] = { x: 1, y: 0 }; sec(2); inp[0] = { x: 0, y: 0 };
      out[n].blocked = h.x < bandX(g, h.y);
      if (n === 'A') { put(h, Z.L.spawn.x, Z.L.spawn.y); step(2); }
      else { Z.A.state = 'fixed'; }
    }
    // 2. un singur erou isi face partea: A (oricine) se deschide, dar el nu poate trece (se inchide cand pleaca); B ramane inchisa
    Z = fresh(); { const { L, A, B, a, b } = Z, q = L.inputs[A.inputs[0]];
      put(a, q.x, q.y); sec(0.8); const opened = A.state === 'open';
      put(a, q.x + 250, q.y); step(6); out.A.alone = { opened, closedWhenLeft: solid(A) };
      A.state = 'fixed'; sec(0.6);
      const q0 = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)]; put(a, q0.x, q0.y); put(b, B.x - 900, B.y); sec(2); out.B.alone = solid(B) && B.state === 'closed'; }
    // 3. amandoi: A, unul pe placa si celalalt trece; B, fiecare pe placa lui
    Z = fresh(); { const { L, A, B, a, b } = Z, q = L.inputs[A.inputs[0]];
      put(a, q.x, q.y); put(b, A.x - A.w / 2 - 40, A.y); sec(0.8);
      inp[1] = { x: 1, y: 0 }; for (let f = 0; f < 130; f++) { put(a, q.x, q.y); step(1); } inp[1] = { x: 0, y: 0 };
      out.A.both = b.x > bandRight(A, b.y);
      A.state = 'fixed'; const q0 = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)], q1 = L.inputs[B.inputs.find(i => L.inputs[i].who === 1)];
      for (let f = 0; f < 50; f++) { put(a, q0.x, q0.y); put(b, q1.x, q1.y); step(1); } out.B.both = !solid(B) && B.state === 'open'; }
    // 4. un singur jucator (G6): A deschisa fara nimeni; B se deschide cu placa lui
    Z = fresh(true); { const { L, A, B, a } = Z; sec(0.8); out.A.solo = !solid(A);
      A.state = 'fixed'; const q0 = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)]; put(a, q0.x, q0.y); sec(1); out.B.solo = !solid(B); }
    // 5. G7: fara progres langa poarta, se deschide singura (autoOpen pus pe 5 s pentru test)
    M.autoOpen = 5;
    Z = fresh(); { const { A, B, a, b } = Z; const stay = (x, y, t) => { for (let f = 0; f < t * 60; f++) { G.P.wind.power = 0; put(a, x, y); put(b, x - 40, y + 80); step(1); } };   // vantul nivelului nu ii muta
      stay(A.x - 300, A.y, 5.6); out.A.auto = A.state === 'fixed' && A.auto && !solid(A);
      stay(B.x - 300, B.y, 6.1); out.B.auto = B.state === 'fixed' && B.auto && !solid(B); }
    // 6. lupta cu George pe partea eroilor: si la jumatate, si la cuib, chiar daca eroii sunt inca in prima treime
    out.duel = [];
    for (const kind of ['mid', 'nest']) {
      Z = fresh(); const { L, a, b } = Z; put(a, L.spawn.x + 200, L.spawn.y); put(b, L.spawn.x + 260, L.spawn.y + 80); step(2);
      G.startDuel(kind); const d = G.P.duel; georgeEnemies(4, false); for (let f = 0; f < 120; f++) step(1);
      const sideH = bandSide(L, a.x, a.y), enemies = L.beetles.filter(x => x.thrown);
      out.duel.push({ kind, george: bandSide(L, d.x, d.y) === sideH && bandSide(L, d.home.x, d.home.y) === sideH, enemies: enemies.length > 0 && enemies.every(x => bandSide(L, x.x, x.y) === sideH) });
      d.over = true; step(2);
    }
    // 7. eroii stau in cuib cand vine George la jumatate: el nu aterizeaza in cuib (acolo nimeni nu l-ar putea lovi)
    Z = fresh(); { const { L, a, b } = Z; put(a, L.nest.x, L.nest.y); put(b, L.nest.x + 30, L.nest.y + 20); step(2); G.startDuel('mid'); const d = G.P.duel;
      out.notInNest = Math.round(dist(d.home.x, d.home.y, L.nest.x, L.nest.y)); d.over = true; step(2); }
    M.autoOpen = keep; joined[1] = true; G.CONFIG.lupta.george.on = true;
    return out;
  });
  console.log(JSON.stringify(n7));
  check('nivelul 7: canyon cu plates1 si plates2', n7.key === 'canyon' && n7.recipes === 'plates1,plates2', [n7.key, n7.recipes]);
  for (const n of ['A', 'B']) {
    const g = n7[n];
    check('nivelul 7, poarta ' + n + ': inchisa la inceput, nu se trece', g.closed && g.blocked, g);
    check('nivelul 7, poarta ' + n + ': cu amandoi se trece', g.both, g.both);
    check('nivelul 7, poarta ' + n + ': un singur jucator (G6) o deschide', g.solo, g.solo);
    check('nivelul 7, poarta ' + n + ': se deschide singura dupa autoOpen (G7)', g.auto, g.auto);
  }
  check('George nu aterizeaza in cuib la lupta de la jumatate', n7.notInNest > 150 + 160, n7.notInNest);
  for (const d of n7.duel) check('nivelul 7: George (' + d.kind + ') si inamicii aruncati sunt pe partea eroilor', d.george && d.enemies, d);
  check('nivelul 7, poarta A: un singur erou pe placa o deschide, dar se inchide cand pleaca', n7.A.alone.opened && n7.A.alone.closedWhenLeft, n7.A.alone);
  check('nivelul 7, poarta B: un singur erou pe placa lui nu o deschide', n7.B.alone, n7.B.alone);

  console.log(bad.length ? 'NEREUSIT: ' + bad.join(', ') : 'mecanisme OK');
  await done();
})();
