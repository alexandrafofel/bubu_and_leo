// pictures of the new things: progress bar, helper arrow, every guardian, level end with medals
// Jocul: variabila JOC (bubu sau lupta). Mai face capturi cu regulile noi: eroul care asteapta ajutor, mingea magica, inamicul lovit o data.
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
  await ev(() => { const G = __game, P = G.P; P.heroes[0].x = P.L.nest.x - 60; P.heroes[1].x = P.L.nest.x + 60; P.heroes[0].y = P.heroes[1].y = P.L.nest.y + 40; P.eggs.length = 0; P.found = [P.q, P.q]; P.wave = P.L.NW - 1; P.midFought = P.nestFought = true; P.nestOpen = true; P.nestOpenT = 20; P.levelEggs = 67; P.levelStars = 3; P.stars.forEach(s => { s.got = true; }); P.hits = 0; step(260); });      // no eggs left lying around: the level ends as soon as both are in the nest
  console.log('state', await ev(() => __game.Game.state + ' ' + JSON.stringify(__game.Game.results[5])));
  await ev(() => step(220)); await shot('p_levelend');
  // the new rules: a hero who waits for the friend, the magic ball on its way, a small enemy that was hit once
  await ev(() => { const G = __game; go(1); const P = G.P, L = P.L, a = P.heroes[0], b = P.heroes[1]; for (const q of L.beetles) { q.cool = 999; } L.cones.length = 0;
    const bt = L.beetles[0]; a.x = bt.x - 150; a.y = bt.y + 40; b.x = a.x + 420; b.y = a.y + 60; step(3); G.hurtSmall(bt); bt.state = 'stun'; bt.t = 9; a.inv = 0; G.hitHero(a, a.x - 60, a.y); step(45); });
  await shot('p_ajutor_asteapta');
  // the game keeps running while the picture is taken, so the ball is slowed down to almost nothing for that moment
  await ev(() => { const R = __game.CONFIG.rescue; inp[1].bP = true; step(12); R.ballSpeed0 = R.ballSpeed; R.ballSpeed = 2; }); await shot('p_ajutor_minge');
  await ev(() => { const R = __game.CONFIG.rescue; R.ballSpeed = R.ballSpeed0; });
  await ev(() => { step(40); const P = __game.P, a = P.heroes[0], b = P.heroes[1]; b.inv = 0; b.dizzy = 0; __game.hitHero(b, b.x + 60, b.y); step(40); a.x = b.x - 120; a.y = b.y; step(4); }); await shot('p_ajutor_aproape');
  await ev(() => { __game.Opt.lang = 'en'; go(1); __game.Game.state = 'intro'; step(3); }); await shot('p_intro_en');
  await ev(() => { __game.Opt.lang = 'ro'; inp.pause = true; __game.Game.state = 'play'; step(3); }); await shot('p_pause');
  await done();
})();
