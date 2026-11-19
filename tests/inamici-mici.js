// Regula noua, in ambele jocuri: un inamic mic dispare dupa doua lovituri, iar dupa o vreme apare altul in locul lui.
// Bubu și Leo: gandaci si conuri. Cea mai grea luptă: roboti, melci si pasarile mari. Jocul: variabila JOC (bubu sau lupta).
const boot = require('./common.js');
(async () => {
  const { page, done, game } = await boot();
  const res = await page.evaluate(() => {
    const G = __game, C = G.CONFIG, SE = C.smallEnemy, lup = G.GAME === 'lupta', out = {}, sec = s => step(Math.round(s * 60));
    const power = (k) => { const P = G.P, h = P.heroes[k]; h.cd = 0; h.dizzy = 0; h.inv = 9; if (k === 0) { inp[0].aP = true; sec(1.4); } else { h.throwCd = 0; P.flock.length = 0; h.homeState = 'held'; G.throwRing(h, 0, 1, 0); sec(0.5); G.recallBalls(1); sec(1.2); } };
    out.hits = SE.hits; out.respawn = SE.respawn;
    // ---- sleepers (beetles / robots), with the first hero's power
    go(1); let P = G.P, L = P.L, a = P.heroes[0], b = P.heroes[1];
    L.cones.length = 0; for (const q of L.beetles) q.cool = 999;
    const bt = L.beetles[0], bt2 = L.beetles[1];
    b.x = L.spawn.x; b.y = L.spawn.y; a.x = bt.x - 90; a.y = bt.y; inp[0] = {}; inp[1] = {}; step(2);
    out['adormit, inainte: lovituri ramase'] = bt.hp;
    power(0); out['prima lovitura (puterea primului erou): ramane 1, ameteste'] = bt.hp === 1 && (bt.state === 'stun' || bt.state === 'return');
    power(0); out['a doua lovitura: dispare'] = bt.state === 'dead';
    sec(SE.respawn + 3); out['cat un erou e aproape nu apare altul'] = bt.state === 'dead';
    a.x = L.spawn.x + 80; a.y = L.spawn.y; sec(1.5); out['cand eroii sunt departe apare altul, intreg'] = bt.state === 'sleep' && bt.hp === SE.hits;
    // ---- the same with the second hero's balls
    bt2.cool = 999; b.x = bt2.x - 120; b.y = bt2.y; a.x = L.spawn.x; a.y = L.spawn.y; step(2);
    power(1); out['mingi: prima lovitura, ramane 1'] = bt2.hp === 1 && bt2.state !== 'dead';
    out['un sut cu multe mingi = o singura lovitura'] = bt2.hp === 1;
    b.x = bt2.x - 120; b.y = bt2.y; step(2); power(1); out['mingi: a doua lovitura, dispare'] = bt2.state === 'dead';
    // ---- rollers (pinecones / snails)
    go(2); P = G.P; L = P.L; a = P.heroes[0]; b = P.heroes[1]; for (const q of L.beetles) q.cool = 999;
    const cn = L.cones[0]; out['nivelul 3 are un con / melc'] = !!cn;
    if (cn) {
      cn.state = 'roll'; cn.y = (cn.lane.y0 + cn.lane.y1) / 2; b.x = L.spawn.x; b.y = L.spawn.y; a.x = cn.x - 120; a.y = cn.y + 40; inp[0] = {}; step(2);
      power(0); out['con / melc: prima lovitura, ramane 1'] = cn.hp === 1 && cn.state !== 'gone';
      a.x = cn.x - 120; a.y = cn.y + 40; step(1); power(0); out['con / melc: a doua lovitura, dispare'] = cn.state === 'gone' && cn.t > SE.respawn - 3;
      a.x = L.spawn.x + 80; a.y = L.spawn.y; sec(SE.respawn + 1); out['con / melc: dupa o vreme vine altul din capul cararii'] = cn.state === 'roll' && cn.hp === SE.hits && cn.y < cn.lane.y0 + 400;
    }
    // ---- big birds (second game only)
    if (lup) {
      go(3); P = G.P; L = P.L; a = P.heroes[0]; b = P.heroes[1]; for (const q of L.beetles) q.cool = 999; L.cones.length = 0;
      out['nivelul 4 are pasari mari'] = !!(L.birds && L.birds.length);
      const bd = L.birds[0]; bd.state = 'fly'; bd.hp = SE.hits; bd.dir = 1; bd.rest = 9; bd.x = a.x + 40; bd.y = a.y; bd.wing = 0;
      const keep = () => { bd.x = a.x + 40; bd.y = a.y; bd.rest = 9; };
      keep(); inp[0] = { aP: true }; a.cd = 0; for (let i = 0; i < 70; i++) { keep(); step(1); } out['pasare: prima lovitura, ramane 1'] = bd.hp === 1 && bd.state === 'fly';
      a.cd = 0; inp[0] = { aP: true }; for (let i = 0; i < 70; i++) { if (bd.state === 'fly') keep(); step(1); } out['pasare: a doua lovitura, pleaca'] = bd.state === 'gone';
      // a bird carries a hero and lets go
      bd.state = 'fly'; bd.hp = SE.hits; bd.rest = 0; bd.dir = 1; a.inv = 0; a.dizzy = 0; a.spinT = -1; a.shield = false; bd.x = a.x - 30; bd.y = a.y; inp[0] = {}; step(3);
      out['pasare: ridica un erou'] = a.carried === bd; const x0 = a.x;
      sec(C.lupta.birdCarry + 0.4); out['pasare: il lasa jos mai incolo, nelovit'] = a.carried === null && a.x > x0 + 150 && !a.down && P.hits === 0;
      out['pasare: eroul e lasat pe pamant liber'] = !!L.reach[L.ci(a.x, a.y)];
    }
    return out;
  });
  const bad = [];
  for (const [k, v] of Object.entries(res)) { const ok = typeof v !== 'boolean' || v === true; console.log((ok ? 'ok   ' : 'GRESIT ') + k.padEnd(62) + JSON.stringify(v)); if (!ok) bad.push(k); }
  if (res.hits !== 2) bad.push('CONFIG.smallEnemy.hits trebuie sa fie 2');
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'inamici-mici OK (' + game + ')');
  await done();
})();
