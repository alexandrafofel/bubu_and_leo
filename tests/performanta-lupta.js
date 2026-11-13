const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const r = await page.evaluate(() => {
    const G = __game; go(3); const P = G.P, L = P.L;
    P.eggs.length = 0; P.wave = L.NW - 1; for (const t of L.trees) if (t.spark) t.spark.done = true;
    P.heroes[0].x = L.nest.x - 200; P.heroes[0].y = L.nest.y + 60; P.heroes[1].x = L.nest.x - 520; P.heroes[1].y = L.nest.y + 150; step(3); G.startDuel(); step(150);
    let ms = 0, mx = 0; const n = 240;
    for (let k = 0; k < n; k++) { const a = performance.now(); G.Input.poll(1 / 60); G.update(1 / 60); G.draw(); const e = performance.now() - a; ms += e; if (e > mx) mx = e; }
    return { duelFrameMs: +(ms / n).toFixed(2), max: +mx.toFixed(1), state: P.duel.state };
  });
  console.log(JSON.stringify(r));
  await done();
})();
