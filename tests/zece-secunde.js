// Cele 10 secunde (T4): un erou lovit asteapta, amandoua controllerele vibreaza, iar daca nimeni nu-l ajuta
// nivelul reincepe cu ecranul "Încă o dată!". Cele 10 puncte din docs/24, S4 ("Test").
// Scrie "zece-secunde OK" sau "NEREUSIT". Capturi: z_numaratoare.png, z_inca-o-data.png
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };

  // tine minte toate vibratiile, cu numarul cadrului in care au fost cerute
  await page.evaluate(() => {
    const G = __game, orig = G.Input.rumble.bind(G.Input);
    window.rum = []; window.fno = 0;        // nu 'frame': asa se cheama bucla jocului
    G.Input.rumble = (k, a, b, ms) => { rum.push({ k, a, b, ms, f: fno }); return orig(k, a, b, ms); };
    const upd = G.update;
    window.stepF = n => { for (let i = 0; i < n; i++) { fno++; G.Input.poll(1 / 60); upd(1 / 60); } };
  });

  // ---- 1, 2, 3: lovitura, asteptarea, ajutorul la timp
  const r1 = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); stepF(20); joined = [true, true];
    const P = G.P, h = P.heroes[0], fr = P.heroes[1];
    fr.x = h.x + 120; fr.y = h.y;
    h.inv = 0; h.dizzy = 0; rum.length = 0;
    G.hitHero(h, h.x - 50, h.y);
    out.rumAtHit = rum.filter(r => r.f === fno).map(r => r.k).sort();      // 1. amandoua controllerele, in acelasi cadru
    out.limit = G.rescueLimit(); out.left0 = Math.round(h.downLeft * 10) / 10;
    stepF(Math.round(9.5 * 60));
    out.after95 = { state: G.Game.state, down: h.down, left: Math.round(h.downLeft * 10) / 10 };   // 2. inca asteapta
    const ticks = rum.filter(r => r.ms === 60 || r.ms === 90).length;
    out.tickRumbles = ticks;
    G.getUp(h, fr); stepF(30);
    out.helped = { state: G.Game.state, down: h.down, left: h.downLeft };    // 3. ajutat: se ridica, nu reincepe nimic
    return out;
  });
  console.log(JSON.stringify(r1));
  check('1. la lovitura vibreaza amandoua controllerele in acelasi cadru', r1.rumAtHit.length === 2 && r1.rumAtHit[0] === 0 && r1.rumAtHit[1] === 1, r1.rumAtHit);
  check('1b. numaratoarea porneste de la 10', r1.limit === 10 && r1.left0 === 10);
  check('2. dupa 9.5 s inca asteapta, jocul merge', r1.after95.state === 'play' && r1.after95.down === true && r1.after95.left > 0, r1.after95);
  check('2b. la fiecare secunda a vibrat scurt pe amandoua (>= 18 vibratii in 9 secunde)', r1.tickRumbles >= 18, { vibratii: r1.tickRumbles });
  check('3. ajutat la timp: se ridica, nimic nu reincepe', r1.helped.state === 'play' && r1.helped.down === false && r1.helped.left === 0, r1.helped);

  // ---- 4: neajutat. La 10 s "retry", dupa inca 2.5 s nivelul de la inceput
  const r2 = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); stepF(20); joined = [true, true];
    const P = G.P, h = P.heroes[0];
    P.levelEggs = 7; G.Game.team.eggs = P.baseEggs + 7;
    out.baseEggs = P.baseEggs; out.teamInainte = G.Game.team.eggs;
    h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 50, h.y);
    stepF(Math.round(10.2 * 60));
    out.at10 = { state: G.Game.state, tries: G.Game.tries[0] };
    stepF(Math.round(2.6 * 60));
    const P2 = G.P;
    out.after = { state: G.Game.state, lvl: G.Game.levelIdx, time: Math.round(P2.time * 10) / 10, levelEggs: P2.levelEggs, team: G.Game.team.eggs, intro: G.UI.skipIntro };
    return out;
  });
  console.log(JSON.stringify(r2));
  check('4a. la 10 s ecranul "Încă o dată!"', r2.at10.state === 'retry' && r2.at10.tries === 1, r2.at10);
  check('4b. dupa 2.6 s: acelasi nivel, de la inceput, fara povestea nivelului', r2.after.state === 'play' && r2.after.lvl === 0 && r2.after.time < 3, r2.after);
  check('4c. cristalele nivelului se pierd, totalul echipei e cel de la inceputul nivelului', r2.after.levelEggs === 0 && r2.after.team === r2.baseEggs, { team: r2.after.team, base: r2.baseEggs });

  // ---- 5: amandoi loviti
  const r3 = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); stepF(20); joined = [true, true]; G.Game.tries[0] = 0;
    const P = G.P, a = P.heroes[0], b = P.heroes[1];
    a.inv = b.inv = 0; a.dizzy = b.dizzy = 0;
    G.hitHero(a, a.x - 50, a.y); G.hitHero(b, b.x - 50, b.y);
    stepF(6);
    out.left = [Math.round(a.downLeft * 10) / 10, Math.round(b.downLeft * 10) / 10];     // sare la bothDown (3)
    stepF(Math.round(3.2 * 60));
    out.state = G.Game.state;
    // cu bothDownRestart fals: se ridica singuri, ca inainte
    G.CONFIG.rescue.bothDownRestart = false;
    stepF(Math.round(2.6 * 60));                       // asteapta sa reinceapa nivelul
    const P2 = G.P, a2 = P2.heroes[0], b2 = P2.heroes[1];
    a2.inv = b2.inv = 0; a2.dizzy = b2.dizzy = 0;
    G.hitHero(a2, a2.x - 50, a2.y); G.hitHero(b2, b2.x - 50, b2.y);
    stepF(Math.round(4 * 60));
    out.fara = { state: G.Game.state, down: [a2.down, b2.down] };
    G.CONFIG.rescue.bothDownRestart = true;
    return out;
  });
  console.log(JSON.stringify(r3));
  check('5a. amandoi jos: numaratoarea sare la 3 secunde', r3.left[0] <= 3 && r3.left[1] <= 3, r3.left);
  check('5b. amandoi jos: nivelul reincepe', r3.state === 'retry', { stare: r3.state });
  check('5c. cu bothDownRestart fals: se ridica singuri, nu reincepe', r3.fara.state === 'play' && r3.fara.down[0] === false && r3.fara.down[1] === false, r3.fara);

  // ---- 6: un singur jucator
  const r4 = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); stepF(20); joined = [true, false]; stepF(4);      // intai pleaca al doilea jucator, apoi lovitura
    G.Game.tries[0] = 0;
    const P = G.P, h = P.heroes[0];
    h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 50, h.y);
    out.down = h.down; out.left = h.downLeft;
    stepF(Math.round(13 * 60));
    out.state = G.Game.state; out.downAfter = G.P.heroes[0].down;
    joined = [true, true];
    return out;
  });
  check('6. un singur jucator: fara numaratoare, nu reincepe niciodata', r4.state === 'play' && !r4.left, r4);

  // ---- 7: plasa de siguranta dupa trei reinceperi
  const r5 = await page.evaluate(() => {
    const G = __game, out = { limite: [] };
    go(0); stepF(20); joined = [true, true]; G.Game.tries[0] = 0;
    for (let i = 0; i < 4; i++) {
      const P = G.P, h = P.heroes[0];
      h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 50, h.y);
      out.limite.push(Math.round(h.downLeft));
      stepF(Math.round((h.downLeft + 0.3) * 60));          // nimeni nu-l ajuta
      stepF(Math.round(2.6 * 60));                          // ecranul "Încă o dată!" si nivelul nou
    }
    out.tries = G.Game.tries[0];
    return out;
  });
  console.log(JSON.stringify(r5));
  check('7. dupa trei reinceperi limita creste la 15 secunde', r5.limite[0] === 10 && r5.limite[1] === 10 && r5.limite[2] === 10 && r5.limite[3] === 15, r5.limite);

  // ---- 8: pauza opreste numaratoarea
  const r6 = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); stepF(20); joined = [true, true]; G.Game.tries[0] = 0;
    const h = G.P.heroes[0];
    h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 50, h.y);
    stepF(Math.round(5 * 60));
    out.inainte = Math.round(h.downLeft * 10) / 10;
    G.Game.paused = true;
    stepF(Math.round(20 * 60));
    out.inPauza = Math.round(h.downLeft * 10) / 10;
    G.Game.paused = false;
    stepF(Math.round(1 * 60));
    out.dupa = Math.round(h.downLeft * 10) / 10;
    out.state = G.Game.state;
    return out;
  });
  console.log(JSON.stringify(r6));
  check('8. pauza opreste numaratoarea (20 de secunde de pauza nu scad nimic)', Math.abs(r6.inPauza - r6.inainte) < 0.1 && r6.state === 'play' && r6.dupa < r6.inainte, r6);

  // ---- 9: capturi. Numaratoarea la 3 si ecranul "Încă o dată!"
  await page.evaluate(() => {
    const G = __game;
    go(0); stepF(20); joined = [true, true]; G.Game.tries[0] = 0;
    const P = G.P, h = P.heroes[0], fr = P.heroes[1];
    fr.x = h.x + 200; fr.y = h.y;
    h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 50, h.y);
    stepF(Math.round(7.1 * 60));                  // mai are 3 secunde
    G.draw(0.016);
  });
  await shot('z_numaratoare');
  const nr = await page.evaluate(() => Math.ceil(__game.P.heroes[0].downLeft));
  check('9a. captura cu numaratoarea la 3', nr === 3, { cifra: nr });

  await page.evaluate(() => { const G = __game; stepF(Math.round(3.2 * 60)); stepF(30); G.draw(0.016); });
  const st = await page.evaluate(() => __game.Game.state);
  await shot('z_inca-o-data');
  check('9b. captura cu ecranul "Încă o dată!"', st === 'retry', { stare: st });

  // niciun pixel negru sau gri in cartonas (900 x 360, in mijloc)
  const dark = await page.evaluate(() => {
    const cv = document.querySelector('canvas'), g = cv.getContext('2d');
    const sc = cv.width / 1920, x = Math.round((1920 - 900) / 2 * sc), y = Math.round(((1080 - 470) / 2 - 20) * sc);
    const w = Math.round(900 * sc), h = Math.round(470 * sc), d = g.getImageData(x, y, w, h).data;
    let negru = 0, gri = 0, worst = null;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      if (mx < 60) negru++;                                   // negru: niciodata
      else if (mx - mn < 10 && mx < 120) { gri++; if (!worst) worst = [r, gg, b]; }      // gri fara nicio caldura
    }
    return { negru, gri, total: d.length / 4, worst };
  });
  // pana la cinci pixeli gri sunt marginea moale dintre umbra violet si cartonas, nu un element desenat
  check('9c. niciun pixel negru si niciun gri desenat in cartonasul "Încă o dată!"', dark.negru === 0 && dark.gri <= 5, dark);

  if (bad.length) console.log('NEREUSIT: ' + bad.join(' | ')); else console.log('zece-secunde OK');
  await done();
})();
