// Inelul din jurul eroilor in luptele cu George (CONFIG.ring) si imaginile Krea (CONFIG.look.art).
// Scrie "inel OK" sau "NEREUSIT".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };
  const r = await page.evaluate(() => {
    const G = __game, out = {};
    const hit = (h) => { h.inv = 0; h.dizzy = 0; window.hitHero(h, h.x - 50, h.y); };
    out.art = { ready: artReady(), n: Object.keys(ART).length };
    go(0); step(3); let P = G.P;
    out.calm = !!P.L.pal.art;
    // 1. in afara luptei: o lovitura il pune jos (regula veche)
    const a = P.heroes[0], b = P.heroes[1];
    P.found[0] = 5; hit(a); out.outside = { down: a.down, found: P.found[0], ring: a.ringHits || 0 };
    window.getUp(a, b); step(2);
    // 2. in lupta cu George: 10 lovituri fac inelul rosu, fara sa cada, fara diamante pierdute
    G.startDuel('mid'); step(5); P = G.P;
    out.fight = window.ringFight();
    P.found[0] = 5; const f0 = P.found[0]; let downEarly = false;
    for (let i = 0; i < 10; i++) { hit(a); if (a.down) downEarly = true; step(1); }
    out.ten = { ring: a.ringHits, down: downEarly, found: P.found[0], f0 };
    // 3. a 11-a lovitura: ameteste si asteapta prietenul
    hit(a); out.eleven = { down: a.down, dizzy: a.dizzy > 0 };
    // 4. prietenul il ajuta: inelul e intreg din nou
    window.getUp(a, b); out.after = a.ringHits;
    // 5. singur in joc: a 11-a lovitura il ameteste, se ridica singur, inelul se goleste
    joined[1] = false; step(2); a.ringHits = 10; hit(a); out.solo = { down: a.down, dizzy: a.dizzy > 0, ring: a.ringHits };
    joined[1] = true; step(2);
    // 6. CONFIG.ring.on = false: regula veche si in lupta
    a.down = false; a.dizzy = 0; a.ringHits = 0; CONFIG.ring.on = false; hit(a); out.off = { down: a.down }; CONFIG.ring.on = true;
    window.getUp(a, b);
    // 7. o lupta noua incepe cu inelul intreg
    a.ringHits = 4; G.startDuel('nest'); out.newFight = a.ringHits;
    // 8. desenul: inelul se deseneaza in lupta fara erori
    step(10);
    return out;
  });
  console.log(JSON.stringify(r));
  check('toate imaginile Krea sunt gata', r.art.ready && r.art.n >= 50, r.art);
  check('nivelurile au aspectul calm', r.calm);
  check('in afara luptei o lovitura il pune jos', r.outside.down && r.outside.found === 4 && r.outside.ring === 0, r.outside);
  check('lupta cu George e recunoscuta', r.fight);
  check('10 lovituri: inelul e tot rosu, eroul nu cade', r.ten.ring === 10 && !r.ten.down, r.ten);
  check('10 lovituri: nu pierde diamante', r.ten.found === r.ten.f0, r.ten);
  check('a 11-a lovitura il ameteste pana e ajutat', r.eleven.down && r.eleven.dizzy, r.eleven);
  check('ajutat: inelul e intreg', r.after === 0, r.after);
  check('singur: ameteste, se ridica singur, inel intreg', !r.solo.down && r.solo.dizzy && r.solo.ring === 0, r.solo);
  check('ring.on false: regula veche', r.off.down, r.off);
  check('lupta noua: inel intreg', r.newFight === 0, r.newFight);
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(', ') : 'inel OK');
  await done();
})();
