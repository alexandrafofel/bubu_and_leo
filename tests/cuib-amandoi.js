// Regula noua, in ambele jocuri: la sfarsitul rundei se asteapta pana cand amandoi jucatorii ajung in cuib.
// Unul singur in cuib nu mai termina nivelul (inainte termina dupa 7 secunde). Un jucator care joaca singur termina singur.
// Jocul: variabila JOC (bubu sau lupta).
const boot = require('./common.js');
(async () => {
  const { page, shot, done, game } = await boot();
  const prep = () => page.evaluate(() => {
    const G = __game; go(0); const P = G.P, L = P.L;
    for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
    P.eggs.length = 0; P.wave = L.NW - 1; for (const t of L.trees) if (t.spark) t.spark.done = true;
    G.openNest(); inp[0] = {}; inp[1] = {};
    P.heroes[0].x = L.nest.x - 30; P.heroes[0].y = L.nest.y + 20; P.heroes[1].x = L.nest.x - 700; P.heroes[1].y = L.nest.y + 60; step(5);
  });
  const out = {};
  await prep();
  out['cuib deschis, doar primul erou in cuib, dupa 30 de secunde: nivelul nu s-a terminat'] = await page.evaluate(() => { step(60 * 30); return __game.Game.state === 'play' && !__game.P.done; });
  await shot('c_asteptam');
  out['vine si al doilea: nivelul se termina'] = await page.evaluate(() => { const P = __game.P; P.heroes[1].x = P.L.nest.x + 40; P.heroes[1].y = P.L.nest.y + 20; step(30); const d = P.done; step(60 * 4); return d && __game.Game.state === 'levelEnd'; });
  await prep();
  out['invers, doar al doilea erou in cuib: nu se termina'] = await page.evaluate(() => { const P = __game.P, L = P.L; P.heroes[1].x = L.nest.x + 30; P.heroes[1].y = L.nest.y + 20; P.heroes[0].x = L.nest.x - 700; P.heroes[0].y = L.nest.y + 60; step(60 * 20); return !P.done; });
  await prep();
  out['un singur jucator: termina singur'] = await page.evaluate(() => { joined = [true, false]; step(60 * 2); const d = __game.P.done; joined = [true, true]; return d; });
  const bad = [];
  for (const [k, v] of Object.entries(out)) { console.log((v ? 'ok   ' : 'GRESIT ') + k); if (!v) bad.push(k); }
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'cuib-amandoi OK (' + game + ')');
  await done();
})();
