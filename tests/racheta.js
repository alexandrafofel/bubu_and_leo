// Racheta: 10 secunde, invincibili, inamicii mici devin diamante, George pierde o inimioara; steluta de pe stalp (nivelul 7).
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };
  const r = await page.evaluate(() => {
    const G = __game, out = {};
    go(0); step(30);
    let P = G.P, L = P.L, a = P.heroes[0], b = P.heroes[1];
    for (const g of P.heroes) g.boost = CONFIG.butterflyTime;
    out.time = a.boost; out.bothBoost = b.boost === a.boost;
    hitHero(a, a.x + 50, a.y); out.hitIgnored = !a.dizzy && !a.down;
    const bt = L.beetles[0];
    if (bt) { bt.state = 'chase'; bt.x = a.x + 20; bt.y = a.y; bt.hp = 2; const g0 = P.gems !== undefined ? P.gems : null; step(3); out.beetleDead = bt.state === 'dead'; }
    out.noBeetle = !bt;
    // George
    return out;
  });
  check('10 secunde', r.time === 10, r.time); check('amandoi', r.bothBoost);
  check('lovitura nu face nimic', r.hitIgnored); if (!r.noBeetle) check('robotul atins moare', r.beetleDead);
  const g = await page.evaluate(() => {
    const G = __game, out = {};
    go(chIdx('level', 0)); step(10);
    const P = G.P; const h = P.heroes[0];
    startDuel(true); step(200);
    const d = P.duel; out.has = !!d; if (!d) return out;
    d.state = 'move'; d.x = h.x + 10; d.y = h.y; d.z = 0; d.over = false; d.rocketCd = 0;
    const hp0 = d.hp; P.heroes.forEach(x => x.boost = 10);
    step(2); out.hp0 = hp0; out.hp1 = d.hp; out.state = d.state;
    // untouched when no rocket
    return out;
  });
  check('George a pierdut o inimioara', g.has && g.hp1 === g.hp0 - 1, g);
  const s = await page.evaluate(() => {
    const G = __game, out = [];
    go(chIdx('level', 6)); step(10);
    const P = G.P, L = P.L, st = L.stars.find(x => x.pillar), h = P.heroes[0], g0 = L.gates[0];
    out.push(!!st);
    // spin from the edge
    h.x = g0.x - g0.w / 2 - 50; h.y = st.y; h.vx = h.vy = 0; powerSweep(h, 9999);
    out.push(st.got);
    return out;
  });
  check('steluta de pe stalp: exista', s[0]); check('steluta de pe stalp: cade la invartire de la margine', s[1]);
  console.log(bad.length ? 'NEREUSIT' : 'racheta OK'); await done(); process.exit(bad.length ? 1 : 0);
})();
