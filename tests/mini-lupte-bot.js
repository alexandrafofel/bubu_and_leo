// mini-fights: a simple bot plays each guardian at each difficulty
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot();
  await page.evaluate(() => {
    const I = __game.Input, tick = () => { I.poll(1 / 60); __game.update(1 / 60); };
    window.duelRun = (lvl, diff, mode, maxS) => {
      const G = __game; G.Game.diff = diff.slice(); joined = mode === 'soloB' ? [true, false] : mode === 'soloL' ? [false, true] : [true, true];
      go(lvl); const P = G.P, L = P.L;
      // skip the egg waves
      P.eggs.length = 0; P.wave = L.NW - 1; for (const t of L.trees) if (t.spark) t.spark.done = true;
      P.heroes[0].x = L.nest.x - 200; P.heroes[0].y = L.nest.y + 60; P.heroes[1].x = L.nest.x - 420; P.heroes[1].y = L.nest.y + 150;
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
      inp[0] = {}; inp[1] = {}; step(2); G.startDuel();
      const d = P.duel, log = { name: d.def.id, hp0: d.hp, t: 0, hits: 0, states: {}, eggs0: G.Game.team.eggs };
      let f = 0, kickCd = 0;
      while (!P.nestOpen && f < maxS * 60) {
        const b = P.heroes[0], l = P.heroes[1];
        log.states[d.state] = (log.states[d.state] || 0) + 1;
        // Leo: stay about 330 away, sidestep when it aims, kick when it can be hurt
        const dx = d.x - l.x, dy = d.y - l.y, m = Math.hypot(dx, dy) || 1, can = d.state === 'tired' || d.state === 'stag' || diff[1] === 'easy';
        kickCd--;
        if (mode !== 'soloB') {
          if (mode === 'lazy') { inp[1] = { x: 0, y: 0 }; if (kickCd <= 0) { l.ax = dx / m; l.ay = dy / m; inp[1].aP = true; inp[1].aR = true; kickCd = 50; } }
          else if ((d.state === 'tired' || d.state === 'stag') && m > 260) inp[1] = { x: dx / m, y: dy / m };
          else if (can && d.z < 80 && P.ball.state === 'held' && kickCd <= 0) { inp[1] = { x: dx / m, y: dy / m, aP: true }; tick(); f++; inp[1] = { x: dx / m, y: dy / m, aR: true }; kickCd = 20; }
          else if (d.state === 'aim' || d.state === 'dash' || d.state === 'jump') { const sx = -d.dy || 1, sy = d.dx || 0; inp[1] = { x: sx, y: sy }; }
          else if (m < 300) inp[1] = { x: -dx / m, y: -dy / m }; else if (m > 420) inp[1] = { x: dx / m, y: dy / m }; else inp[1] = { x: 0, y: 0 };
        }
        // Bubu: collect eggs, otherwise hide in the nest. Alone: stomp next to the guardian
        if (mode === 'soloB') {
          const bx = d.x - b.x, by = d.y - b.y, bm = Math.hypot(bx, by) || 1;
          if (bm > 200) inp[0] = { x: bx / bm, y: by / bm }; else { inp[0] = { x: 0, y: 0 }; if (f % 30 === 0) inp[0].aP = true; }
        } else {
          let e = null, bd = 1e9; for (const g of P.eggs) { const q = Math.hypot(g.x - b.x, g.y - b.y); if (q < bd) { bd = q; e = g; } }
          const tx = e ? e.x : L.nest.x, ty = e ? e.y : L.nest.y, ex = tx - b.x, ey = ty - b.y, em = Math.hypot(ex, ey) || 1;
          inp[0] = em > 30 ? { x: ex / em, y: ey / em } : { x: 0, y: 0 };
        }
        tick(); f++;
      }
      log.t = +(f / 60).toFixed(1); log.won = P.nestOpen; log.hits = P.hits; log.hp = d.hp; log.eggs = G.Game.team.eggs - log.eggs0; log.left = P.eggs.length;
      return log;
    };
  });
  const runs = [];
  for (const lvl of (process.argv[2] || '0,1,2,3,4,5').split(',').map(Number)) for (const [diff, mode] of [[['easy', 'normal'], 'duo'], [['easy', 'hard'], 'duo'], [['easy', 'easy'], 'duo'], [['normal', 'normal'], 'soloB'], [['easy', 'normal'], 'soloL'], [['easy', 'normal'], 'lazy']]) {
    const r = await page.evaluate(([l, d, m]) => JSON.stringify(duelRun(l, d, m, 240)), [lvl, diff, mode]);
    console.log(lvl, diff.join('/'), mode, r);
  }
  await done();
})();
