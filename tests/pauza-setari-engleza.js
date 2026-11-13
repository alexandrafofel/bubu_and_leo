// pause -> settings during a level, in English, with a keyboard player; solo player; swapped heroes in play
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot();
  const ev = (f, a) => page.evaluate(f, a);
  await ev(() => { go(2); inp[0] = { x: 1, y: 0 }; inp[1] = { x: 1, y: 0.3 }; step(120); inp[0] = {}; inp[1] = {}; inp.pause = true; step(3); });
  await shot('q_pause');
  console.log(await ev(() => JSON.stringify({ paused: __game.Game.paused, set: !!__game.UI.set })));
  // real keys from here on
  const key = async (k) => { await page.keyboard.down(k); await page.waitForTimeout(70); await page.keyboard.up(k); await page.waitForTimeout(100); };
  await ev(() => { window.auto = setInterval(() => step(1), 16); });
  await key('ArrowDown'); await key('Enter'); await page.waitForTimeout(200);
  console.log(await ev(() => JSON.stringify({ paused: __game.Game.paused, set: __game.UI.set && __game.UI.set.page })));
  await key('ArrowRight'); await shot('q_set_en');
  await key('KeyP'); await page.waitForTimeout(150);
  console.log('after P', await ev(() => JSON.stringify({ paused: __game.Game.paused, set: !!__game.UI.set, lang: __game.Opt.lang })));
  await shot('q_pause_en');
  await key('Backspace'); await page.waitForTimeout(150);
  console.log('after Backspace', await ev(() => JSON.stringify({ paused: __game.Game.paused, st: __game.Game.state })));
  await ev(() => { clearInterval(auto); const G = __game, P = G.P; P.eggs.length = 0; P.wave = P.L.NW - 1; for (const t of P.L.trees) if (t.spark) t.spark.done = true; P.heroes[0].x = P.L.nest.x - 300; P.heroes[0].y = P.L.nest.y + 80; P.heroes[1].x = P.L.nest.x - 500; P.heroes[1].y = P.L.nest.y + 150; step(5); G.startDuel(); step(60); });
  await shot('q_duel_en');
  await ev(() => { __game.swapHeroes(); step(30); });
  console.log('swap in play', await ev(() => JSON.stringify({ swap: __game.Opt.swap, diff: __game.Game.diff, guide: __game.Opt.guide })));
  await shot('q_swapped');
  await done();
})();
