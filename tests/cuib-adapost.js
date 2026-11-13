// Cuibul e adapost pe tot jocul (update U1): un erou in cuib nu e lovit si nu-l ia vantul.
// Verifica pe nivelul 1 si pe nivelul 4 (cu vant). Pe boss cuibul e in copac, deci nu se ajunge acolo.
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const res = await page.evaluate(() => {
    const G = __game, out = {}, step = n => { for (let i = 0; i < n; i++) G.update(1 / 60); };
    for (const lvl of [1, 4]) {
      window.go(lvl);
      const P = G.P, h = P.heroes[0], L = P.L;
      const tag = 'nivel ' + lvl + ': ';
      // 1. in cuib, cu vant puternic: ramane pe loc
      h.x = L.nest.x; h.y = L.nest.y; h.vx = 0; h.vy = 0; step(3);
      out[tag + 'in cuib, safe'] = h.safe === true;
      const x0 = h.x, y0 = h.y;
      P.wind.power = 1; P.wind.dir = 1; step(60); P.wind.power = 0;
      out[tag + 'vant, deplasare in cuib (pixeli)'] = Math.round(Math.hypot(h.x - x0, h.y - y0));
      // 2. lovitura in cuib: nu se intampla nimic (ni oua, ni lovitura, ni ameteala)
      h.inv = 0; h.dizzy = 0; const eggs0 = G.Game.team.eggs, hits0 = P.hits;
      G.hitHero(h, h.x - 100, h.y);
      out[tag + 'lovit in cuib, lovituri adaugate'] = P.hits - hits0;
      out[tag + 'lovit in cuib, oua pierdute'] = eggs0 - G.Game.team.eggs;
      out[tag + 'lovit in cuib, ameteit'] = h.dizzy > 0;
      // 3. afara din cuib: nu mai e adapost si poate fi lovit
      h.x = L.nest.x + 400; h.y = L.nest.y; h.vx = 0; h.vy = 0; step(3);
      out[tag + 'afara, safe'] = h.safe === true;
      h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 100, h.y);
      out[tag + 'afara, lovituri adaugate'] = P.hits - hits0;
    }
    return out;
  });
  const expect = {
    'in cuib, safe': true, 'lovit in cuib, lovituri adaugate': 0, 'lovit in cuib, oua pierdute': 0,
    'lovit in cuib, ameteit': false, 'afara, safe': false
  };
  let bad = [];
  for (const [k, v] of Object.entries(res)) {
    console.log(k.padEnd(44), JSON.stringify(v));
    const key = Object.keys(expect).find(e => k.endsWith(e));
    if (key !== undefined && v !== expect[key]) bad.push(k);
    if (k.endsWith('vant, deplasare in cuib (pixeli)') && v > 6) bad.push(k);
    if (k.endsWith('afara, lovituri adaugate') && v < 1) bad.push(k);
  }
  console.log(bad.length ? 'NEREUSIT ' + bad.join('; ') : 'cuib-adapost OK');
  await done();
})();
