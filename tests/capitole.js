// Capitolele, meniul de pe ecranul de start si salvarea versiunea 4 (docs/24-sisteme-noi.md, S5).
// Totul cu taste reale (partea 1) si doar cu controllere false (partea 2), pornind de la o salvare goala.
// Jocul: variabila JOC (bubu sau lupta). Scrie "capitole OK" sau "NEREUSIT".
const { chromium, chrome, url, game } = require('./pw.js');
const other = game === 'lupta' ? 'bubu' : 'lupta';

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  const bad = [], errs = [];
  const check = (lbl, good, info) => { console.log((good ? 'ok     ' : 'GRESIT ') + lbl + (info ? '  ' + JSON.stringify(info) : '')); if (!good) bad.push(lbl); };

  // ---------- partea 1: tastatura ----------
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.goto(url); await page.waitForTimeout(500);
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(600);
  const ev = (f, a) => page.evaluate(f, a);
  const wait = ms => page.waitForTimeout(ms);
  const key = async (k, ms) => { await page.keyboard.press(k); await wait(ms || 160); };
  const st = () => ev(() => { const G = __game, sl = G.Save.slot(); return { st: G.Game.state, game: G.GAME, idx: G.Game.levelIdx, paused: G.Game.paused,
    menu: G.Game.state === 'title' ? G.titleMenu().map(m => m.label) : null, sel: G.UI.menuSel, ask: !!G.UI.ask, chSel: G.UI.chSel, chShake: G.UI.chShake,
    open: G.Save.maxOpen(), level: sl ? sl.level : null, max: sl ? sl.max : null, res: sl && sl.results ? sl.results.map(r => r ? [r.eggs, r.stars] : null) : null,
    team: G.Game.team.eggs, joined: G.Input.slots.map(s => s.joined) }; });
  // from the start screen into a level: the first player joins and is ready with Space, then Space again on the story card
  const intoPlay = async () => { for (let i = 0; i < 40; i++) { const s = await st(); if (s.st === 'play') return s; if (s.st === 'intro') { await wait(900); await key('Space'); } else await wait(150); } return st(); };
  const ready = async () => { await key('Space'); await key('Space'); await wait(1300); };     // join, then "Ready!": what the chosen button says happens 0.9 s later
  const endLevel = (eggs, stars) => ev(([e, s]) => { const G = __game; G.P.levelEggs = e; G.P.levelStars = s; G.Game.levelEnd(); }, [eggs, stars]);

  await page.mouse.click(900, 500); await wait(700);
  await ev(g => { const G = __game; G.setGame(g); G.Game.toTitle(); }, game); await wait(300);
  // the other game has progress of its own: nothing here may touch it
  await ev(g => { const d = __game.Save.data || (__game.Save.data = {}); const sl = g === 'lupta' ? (d.g2 = d.g2 || {}) : d;
    sl.level = 3; sl.max = 3; sl.results = [{ eggs: 11, stars: 1, med: [false, false, false] }, { eggs: 12, stars: 1, med: [false, false, false] }, { eggs: 13, stars: 1, med: [false, false, false] }]; sl.eggs = 36; sl.stars = 3; __game.Save.write(); }, other);

  // 1. first start: one button only, "Start!"
  let s = await st();
  check('1. prima pornire: un singur buton, "Începe!"', s.menu && s.menu.length === 1 && s.menu[0] === 'Începe!', s.menu);

  // 2. level 1 played: three buttons, "Continue: Level 2" chosen first
  await ready(); s = await intoPlay();
  check('2a. "Începe!" porneste nivelul 1', s.st === 'play' && s.idx === 0, { st: s.st, idx: s.idx });
  await endLevel(30, 1); await wait(300);
  await ev(() => __game.Game.toTitle()); await wait(300); s = await st();
  check('2b. dupa nivelul 1: trei butoane (patru cu Dicționar, cand erou a spus deja un cuvant), "Continuă: Nivelul 2" ales din start', (s.menu.length === 3 || (s.menu.length === 4 && s.menu[2] === 'Dicționar')) && s.menu[0] === 'Continuă: Nivelul 2' && s.menu[1] === 'Capitole' && s.menu[s.menu.length - 1] === 'Joc nou' && s.sel === 0, s.menu);
  check('2c. salvarea: continua de la capitolul 2, capitolele 1 si 2 deschise', s.level === 1 && s.max === 1 && s.open === 1, { level: s.level, max: s.max });

  // 3. the Chapters screen: chapters 1 and 2 open, the others locked; ✕ on a locked one starts nothing
  await key('KeyS'); s = await st();      // the first player's "down" key
  check('3a. jos: alege "Capitole"', s.sel === 1, { sel: s.sel });
  await key('Space'); await wait(1300); s = await st();      // already joined: Space = ready
  check('3b. "Capitole" deschide lista de capitole', s.st === 'chapters', { st: s.st });
  check('3c. ales din start: capitolul la care duce "Continuă"', s.chSel === 1, { chSel: s.chSel });
  await page.screenshot({ path: 'cap_' + game + '_lista.png' });
  await key('ArrowRight'); await key('ArrowRight'); s = await st();
  check('3d. dreapta: alegerea merge pe capitolul 4, incuiat', s.chSel === 3, { chSel: s.chSel });
  await key('Enter'); await wait(200); s = await st();
  check('3e. Enter pe un capitol incuiat: nu porneste nimic, lacatul tremura', s.st === 'chapters' && s.chShake > 0, { st: s.st, shake: s.chShake });
  check('3f. Enter nu l-a bagat pe al doilea erou in joc pe tastatura', s.joined[1] === false, s.joined);

  // 4. chapter 1 again: a worse result does not lower the saved one, a better one raises it, "Continue" stays
  await key('ArrowLeft'); await key('ArrowLeft'); await key('ArrowLeft'); await key('Enter'); s = await intoPlay();
  check('4a. capitolul 1, rejucat din lista', s.st === 'play' && s.idx === 0, { st: s.st, idx: s.idx });
  await endLevel(10, 0); await wait(200); s = await st();
  check('4b. rezultat mai slab: salvat ramane 30 de cristale si 1 stea', s.res[0][0] === 30 && s.res[0][1] === 1 && s.level === 1, { res: s.res, level: s.level });
  check('4c. pe ecranul de sfarsit apare ce s-a adunat acum (10), totalul ramane suma celor mai bune (30)', (await ev(() => __game.Game.lastRun.eggs)) === 10 && s.team === 30, { team: s.team });
  await ev(() => __game.Game.toChapters()); await wait(500); await key('ArrowLeft'); await key('Enter'); s = await intoPlay();      // the list opens on the chapter "Continue" points at (2)
  await endLevel(50, 2); await wait(200); s = await st();
  check('4d. rezultat mai bun: salvat devine 50 si 2 stele, "Continuă" tot la capitolul 2', s.res[0][0] === 50 && s.res[0][1] === 2 && s.level === 1, { res: s.res, level: s.level });

  // 5. the HUD total at the start of level 2 is the sum of the other chapters
  await ev(() => __game.Game.toTitle()); await wait(300);
  await key('Space'); await wait(1300); s = await intoPlay();      // the player is still joined: Space = ready on "Continue"
  check('5. "Continuă" porneste capitolul 2, iar totalul de pe ecran e suma celorlalte (50)', s.st === 'play' && s.idx === 1 && s.team === 50, { idx: s.idx, team: s.team });
  // a hit at the very start of a chapter drops nothing: nothing was gathered here yet
  const drop = await ev(() => { const G = __game, h = G.P.heroes[0]; h.inv = 0; h.dizzy = 0; const e0 = G.Game.team.eggs; G.hitHero(h, h.x - 50, h.y); return e0 - G.Game.team.eggs; });
  check('5b. lovit la inceputul capitolului: nu scapa niciun cristal din cele de dinainte', drop === 0, { drop });
  await endLevel(40, 1); await wait(200);

  // pause: "Restart level" and "Chapters", each asks first, "No" shown first
  await ev(() => { __game.Game.goLevel(2); }); s = await intoPlay();
  await key('KeyP'); s = await st();
  check('P1. P: pauza', s.paused, { paused: s.paused });
  const j0 = s.joined[1];
  await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); s = await st();
  check('P2. pauza, "Reia nivelul": intreaba intai', s.paused && s.ask, { ask: s.ask });
  await page.screenshot({ path: 'cap_' + game + '_pauza_intrebare.png' });
  await key('Enter'); s = await st();
  check('P3. Enter pe "Nu" (ales din start): nimic nu se intampla', s.paused && !s.ask && s.st === 'play', { st: s.st, ask: s.ask });
  await key('Enter'); await key('ArrowUp'); await key('Enter'); await wait(300); s = await st();
  check('P4. "Da": acelasi capitol, de la inceput', (s.st === 'loading' || s.st === 'intro') && s.idx === 2 && !s.paused, { st: s.st, idx: s.idx });
  s = await intoPlay(); await key('KeyP'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); await key('ArrowUp'); await key('Enter'); await wait(400); s = await st();
  check('P5. pauza, "Capitole", "Da": lista de capitole', s.st === 'chapters' && !s.paused, { st: s.st });
  await key('Backspace'); s = await st();
  check('P6. Backspace in lista: inapoi la ecranul de start', s.st === 'title', { st: s.st });
  check('P7. Enter in pauza nu l-a bagat pe al doilea erou in joc pe tastatura', j0 === false && s.joined[1] === false, s.joined);

  // 6. "New game": "No" erases nothing, "Yes" erases this game only
  await ev(() => { __game.UI.menuSel = __game.titleMenu().length - 1; }); await key('Space'); await wait(1300); s = await st();
  check('6a. "Joc nou" cu progres: intreaba intai, "Nu" e ales din start', s.ask && (await ev(() => __game.UI.ask.sel)) === 1, { ask: s.ask });
  await page.screenshot({ path: 'cap_' + game + '_joc_nou.png' });
  await key('Backspace'); s = await st();
  check('6b. Backspace = "Nu": nimic sters', !s.ask && s.st === 'title' && s.level === 2 && s.res.length === 2, { level: s.level, res: s.res });
  await key('Space'); await wait(1300); await key('ArrowUp'); await key('Enter'); await wait(300); s = await st();
  check('6c. "Da, de la capăt": progresul jocului ales e sters, jocul porneste de la capitolul 1', s.level === 0 && s.max === 0 && s.res.length === 0 && s.idx === 0 && s.st !== 'title', s);
  const oth = await ev(g => { const sl = __game.Save.slot(g); return sl && [sl.level, sl.max, sl.results.length, sl.eggs]; }, other);
  check('6d. progresul celuilalt joc a ramas neatins', oth && oth[0] === 3 && oth[1] === 3 && oth[2] === 3 && oth[3] === 36, oth);

  // 7. a save from before chapters (version 3)
  await ev(() => localStorage.setItem(__game.CONFIG.saveKey, JSON.stringify({ v: 3, game: 'lupta',
    level: 3, eggs: 100, stars: 5, results: [{ eggs: 40, stars: 2, med: [true, true, false] }, { eggs: 40, stars: 2, med: [false, true, false] }, { eggs: 30, stars: 1, med: [false, false, false] }],
    g2: { level: 6, eggs: 300, stars: 12, results: [1, 2, 3, 4, 5, 6].map(i => ({ eggs: 40 + i, stars: 2, med: [false, true, false] })) },
    diff: ['easy', 'normal'], opt: { lang: 'ro' } })));
  await page.reload(); await wait(700); await page.mouse.click(900, 500); await wait(700);
  const v3 = await ev(() => { const G = __game, S = G.Save, sum = sl => sl.results.reduce((a, r) => a + (r ? r.eggs : 0), 0);
    return { v: S.data.v, l2: S.slot('lupta').level, open2: S.maxOpen('lupta'), sum2: sum(S.slot('lupta')), lbl2: G.chapterLabel(S.slot('lupta').level, 'lupta'),
             l1: S.slot('bubu').level, open1: S.maxOpen('bubu'), sum1: sum(S.slot('bubu')), eggs1: S.slot('bubu').eggs, has1: S.hasProgress('bubu'), has2: S.hasProgress('lupta') }; });
  check('7a. salvarea veche devine versiunea 4', v3.v === 4, v3);
  // 27 noiembrie 2026: lupta mare e ultima. Salvarea veche (6 niveluri jucate, "Continuă" pe Arena, capitolul 7 de atunci) se pune in ordinea noua:
  // "Continuă" duce la primul capitol nejucat (nivelul 7, cand exista), iar Arena, deschisa deja, ramane deschisa
  const exp7 = await ev(() => { const ch = chapters('lupta'), l7 = ch.findIndex(c => c.kind === 'level' && c.n === 6); return { lvl: l7 >= 0 ? l7 : ch.length - 1, lbl: l7 >= 0 ? 'Nivelul 7' : 'Arena lui George', open: ch.length - 1 }; });
  check('7b. al doilea joc: "Continuă" la primul capitol nejucat (' + exp7.lbl + '), pana la Arena deschise', v3.l2 === exp7.lvl && v3.lbl2 === exp7.lbl && v3.open2 === exp7.open && v3.has2, [v3, exp7]);
  check('7c. al doilea joc: totalul nu a scazut (rezultatele aveau 261, totalul vechi 300)', v3.sum2 === 300, v3);
  check('7d. primul joc: continua de la nivelul 4, totalul e suma rezultatelor (110, mai mult decat 100)', v3.l1 === 3 && v3.open1 === 3 && v3.sum1 === 110 && v3.eggs1 === 110 && v3.has1, v3);

  // 7e. o salvare din ordinea veche (T7.4: Arena pe capitolul 7, nivelul 7 pe capitolul 8), cu Arena castigata: rezultatul Arenei merge cu ea la sfarsit
  await ev(() => localStorage.setItem(__game.CONFIG.saveKey, JSON.stringify({ v: 4, game: 'lupta', g2: { level: 7, max: 7, eggs: 0, stars: 0,
    results: [0, 1, 2, 3, 4, 5, 6].map(i => ({ eggs: 10 + i, stars: 1, med: [false, false, false] })) }, diff: ['easy', 'normal'], opt: { lang: 'ro' } })));
  await page.reload(); await wait(700); await page.mouse.click(900, 500); await wait(700);
  const v7 = await ev(() => { const G = __game, sl = G.Save.slot('lupta'), ch = chapters('lupta'), b = ch.length - 1, l7 = ch.findIndex(c => c.kind === 'level' && c.n === 6);
    return { boss: sl.results[b] && sl.results[b].eggs, l7res: l7 >= 0 ? !!sl.results[l7] : null, level: sl.level, l7, max: sl.max, b, order: (sl.order || []).join(','), lbl: G.chapterLabel(sl.level, 'lupta') }; });
  check('7e. salvarea cu Arena pe capitolul 7: Arena (16 diamante) trece la sfarsit, "Continuă" la nivelul 7, totul deschis', v7.boss === 16 && (v7.l7 < 0 || (v7.l7res === false && v7.level === v7.l7 && v7.lbl === 'Nivelul 7')) && v7.max === v7.b && /boss$/.test(v7.order), v7);

  // 8. the cards: one row of 7 now (the second game gets a second row when the levels of Part Two exist)
  for (const g of ['bubu', 'lupta']) {
    const lay = await ev(g => { const G = __game; G.setGame(g); const L = G.chapterLayout(); return { n: L.list.length, rows: L.rows.map(r => r.length), two: L.two, p2: L.list.filter(c => c.kind === 'level' && c.part === 2).length, last: L.list[L.list.length - 1].kind }; }, g);
    // lupta mare e mereu ultima. Cu nivelurile Partii a doua: randul 1 are 6 niveluri, randul 2 nivelurile noi si lupta mare; fara ele, un rand de 7
    check('8. ' + g + ': lupta mare la sfarsit; Partea a doua pe al doilea rand', lay.last === 'boss' && (lay.p2 > 0 ? lay.two && lay.rows[0] === 6 && lay.rows[1] === lay.p2 + 1 : !lay.two && lay.rows[0] === 7), lay);
  }
  const two = await ev(() => { const G = __game, C = G.CONFIG; G.setGame('lupta'); const was = C.lupta.levels; C.lupta.levels = 12; const L = G.chapterLayout(); C.lupta.levels = was;
    return { n: L.list.length, rows: L.rows.map(r => r.length), two: L.two, last: L.list[L.list.length - 1], part2: L.list[6].part }; });
  check('8b. cu 12 niveluri: Partea întâi (6 niveluri) si Partea a doua (6 niveluri + Arena, la sfarsit)', two.two && two.rows[0] === 6 && two.rows[1] === 7 && two.last.kind === 'boss' && two.last.part === 2 && two.part2 === 2, two);

  // 9. after the last fight the progress stays and every chapter is open
  await ev(g => { const G = __game; G.setGame(g); G.Game.toTitle(); }, game); await wait(300);
  await ev(() => { const G = __game, S = G.Save; S.newGame(); for (let i = 0; i < 6; i++) S.finish(i, { eggs: 20, stars: 2, med: [false, false, false] }); G.Game.startChapter(chapters().length - 1); });
  s = await intoPlay();
  const bossIdx = await ev(() => chapters().length - 1);
  check('9a. lupta mare (ultimul capitol) porneste din lista', s.st === 'play' && s.idx === bossIdx && (await ev(() => !!__game.P.L.boss)), { st: s.st, idx: s.idx, bossIdx });
  await ev(() => __game.Game.toEnding());
  await ev(() => { const G = __game; for (let i = 0; i < 13 * 30; i++) G.update(1 / 30); }); await key('Enter'); await wait(300); s = await st();
  // lupta mare e ultimul capitol: dupa final "Continuă" ramane pe ea si toate capitolele sunt deschise
  const nCh = await ev(() => chapters().length);
  check('9b. dupa final: inapoi la start, progresul nu e sters, toate capitolele deschise', s.st === 'title' && s.level === bossIdx && s.open === bossIdx && s.res.length === nCh, { st: s.st, level: s.level, open: s.open, n: s.res && s.res.length, nCh });
  check('9c. "Continuă" duce la lupta mare', s.menu[0] === 'Continuă: ' + (await ev(c => __game.chapterLabel(c), bossIdx)), s.menu);
  await page.screenshot({ path: 'cap_' + game + '_dupa_final.png' });
  await page.close();

  // ---------- partea 2: doar controllere (navigatorul vede doua controllere false) ----------
  const p2 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  p2.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p2.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await p2.addInitScript(() => {
    window.fakePads = [null, null, null, null];
    window.mkPad = i => ({ index: i, id: 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)', connected: true, mapping: 'standard', axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0 })), vibrationActuator: { playEffect: () => Promise.resolve('complete') } });
    navigator.getGamepads = () => fakePads;
  });
  await p2.goto(url); await p2.waitForTimeout(500);
  await p2.evaluate(g => { localStorage.setItem('bubu-leo-oua-de-aur-v1', JSON.stringify({ v: 4, game: g, level: 2, max: 2, eggs: 40, stars: 2,
    results: [{ eggs: 20, stars: 1, med: [false, false, false] }, { eggs: 20, stars: 1, med: [false, false, false] }],
    g2: { level: 2, max: 2, eggs: 40, stars: 2, results: [{ eggs: 20, stars: 1, med: [false, false, false] }, { eggs: 20, stars: 1, med: [false, false, false] }] } })); }, game);
  await p2.reload(); await p2.waitForTimeout(600);
  const pw2 = ms => p2.waitForTimeout(ms);
  const press = async (i, b, ms) => { await p2.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = true; }, [i, b]); await pw2(90); await p2.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = false; }, [i, b]); await pw2(ms || 120); };
  const st2 = () => p2.evaluate(() => { const G = __game; return { st: G.Game.state, game: G.GAME, gsel: G.UI.gameSel, sel: G.UI.menuSel, chSel: G.UI.chSel, idx: G.Game.levelIdx }; });
  await p2.evaluate(() => { fakePads[0] = mkPad(0); });
  await press(0, 0, 500);      // ✕ on the first screen: the choice of the game
  let c2 = await st2();
  check('10a. controller: ecranul de start (jocul e unul singur)', c2.st === 'title' && c2.game === game, c2);
  await press(0, 0, 200);      // the controller joins
  await press(0, 13); c2 = await st2();
  check('10b. controller, jos pe D-pad: "Capitole"', c2.sel === 1, c2);
  await press(0, 0, 1300); c2 = await st2();
  check('10c. controller, ✕ (Gata!): lista de capitole', c2.st === 'chapters' && c2.chSel === 2, c2);
  await press(0, 14); c2 = await st2();
  check('10d. controller, stanga pe D-pad: capitolul 2', c2.chSel === 1, c2);
  await press(0, 1, 300); c2 = await st2();
  check('10e. controller, ○: inapoi la start', c2.st === 'title', c2);
  await p2.evaluate(() => __game.Game.toChapters()); await pw2(500);
  await p2.evaluate(() => { fakePads[0].axes[0] = -0.9; }); await pw2(150); await p2.evaluate(() => { fakePads[0].axes[0] = 0; }); await pw2(150);
  c2 = await st2();
  check('10f. controller, stick spre stanga: capitolul 2', c2.chSel === 1, c2);
  await press(0, 0, 400); c2 = await st2();
  check('10g. controller, ✕: porneste capitolul ales', (c2.st === 'loading' || c2.st === 'intro') && c2.idx === 1, c2);
  await p2.close();

  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'capitole OK (' + game + ')');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
