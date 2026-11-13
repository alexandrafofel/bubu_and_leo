// pictures of the new things: progress bar, helper arrow, every guardian, level end with medals
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot();
  const ev = (f, a) => page.evaluate(f, a);
  await ev(() => { go(0); inp[0] = { x: 1, y: -0.2 }; inp[1] = { x: 1, y: 0.2 }; step(150); inp[0] = { x: 0, y: 0 }; inp[1] = { x: 0, y: 0 }; step(30); });
  await shot('p_play0');
  await ev(() => { const P = __game.P; P.eggs.filter(e => e.req).slice(3).forEach(e => { e.req = false; }); P.eggs = P.eggs.filter(e => e.req); P.waveNeed = 20; P.waveGot = 17; step(20); });
  await shot('p_play1');
  for (let lvl = 5; lvl < 6; lvl++) {
    await ev((lvl) => {
      const G = __game; G.Game.diff = ['easy', 'normal']; go(lvl); const P = G.P, L = P.L;
      P.eggs.length = 0; P.wave = L.NW - 1; P.waveGot = P.waveNeed; for (const t of L.trees) if (t.spark) t.spark.done = true;
      P.heroes[0].x = L.nest.x - 60; P.heroes[0].y = L.nest.y + 50; P.heroes[1].x = L.nest.x - 520; P.heroes[1].y = L.nest.y + 120;
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
      inp[0] = {}; inp[1] = {}; step(30); G.startDuel(); step(80);
    }, lvl);
    await shot('p_duel' + lvl + 'a');
    // run until the guardian aims or jumps
    await ev(() => { const P = __game.P, d = P.duel; let n = 0; while (!(d.state === 'aim' && d.t > 0.25) && d.state !== 'jump' && n < 900) { step(1); n++; } step(2); });
    await shot('p_duel' + lvl + 'b');
    await ev(() => { const P = __game.P, d = P.duel; let n = 0; P.heroes[1].inv = 99; while (d.state !== 'tired' && n < 1500) { step(1); n++; } step(25); });
    await shot('p_duel' + lvl + 'c');
    await ev(() => { __game.duelHit(1); step(50); });
    await shot('p_duel' + lvl + 'd');
  }
  await ev(() => { const G = __game, P = G.P; while (P.duel.hp > 0) { G.duelHit(1); step(70); if (P.duel.hp > 0) P.duel.state = 'tired'; } step(140); });
  await shot('p_nest');
  await ev(() => { const G = __game, P = G.P; P.heroes[0].x = P.L.nest.x - 60; P.heroes[1].x = P.L.nest.x + 60; P.heroes[0].y = P.heroes[1].y = P.L.nest.y + 40; P.levelEggs = 67; P.levelStars = 3; P.stars.forEach(s => { s.got = true; }); P.hits = 0; step(260); });
  console.log('state', await ev(() => __game.Game.state + ' ' + JSON.stringify(__game.Game.results[5])));
  await ev(() => step(220)); await shot('p_levelend');
  await ev(() => { __game.Opt.lang = 'en'; go(1); __game.Game.state = 'intro'; step(3); }); await shot('p_intro_en');
  await ev(() => { __game.Opt.lang = 'ro'; inp.pause = true; __game.Game.state = 'play'; step(3); }); await shot('p_pause');
  await done();
})();
