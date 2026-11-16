// real keyboard: join, start, walk, remap a key in the pause settings, walk with the new key
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot({ manual: false });
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800);
  const key = async (k, ms = 70) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(110); };
  const info = (lbl) => page.evaluate((lbl) => { const G = __game, P = G.P; return lbl + ' ' + JSON.stringify({ st: G.Game.state, paused: G.Game.paused, set: G.UI.set ? G.UI.set.page : null, ctrl: G.Opt.ctrl, joined: G.Input.slots.map(s => s.joined), seen: G.UI.seen, ready: G.UI.ready, h0: P ? [P.heroes[0].x | 0, P.heroes[0].y | 0] : null, h1: P ? [P.heroes[1].x | 0, P.heroes[1].y | 0] : null, keys0: Object.values(G.Opt.keys[0]).join(',') }); }, lbl);
  await page.mouse.click(900, 500); await page.waitForTimeout(1500);
  if (require('./pw.js').game === 'lupta') await key('ArrowRight');
  await key('Enter'); await page.waitForTimeout(300); console.log(await info('Enter: jocul ales'));
  await key('Space'); console.log(await info('Space: Bubu joins by keyboard'));
  await key('Enter'); console.log(await info('Enter: Leo joins by keyboard'));
  await shot('k_title');
  await key('Space'); await key('Enter'); await page.waitForTimeout(1500); console.log(await info('both ready'));
  await page.waitForTimeout(900); await key('Space'); await page.waitForTimeout(300); console.log(await info('intro skipped'));
  await key('KeyD', 700); await key('ArrowDown', 500); console.log(await info('D held, ArrowDown held'));
  await key('Space'); await page.waitForTimeout(500); console.log(await info('Space = stomp'));
  await key('Escape'); console.log(await info('Esc = pause'));
  await key('ArrowDown'); await key('Enter'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); console.log(await info('player 1 page'));
  await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); console.log(await info('keys page'));
  await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); await key('KeyL'); console.log(await info('right = L'));
  await key('KeyP'); await key('KeyP'); await page.waitForTimeout(200); console.log(await info('P, P: back in the game'));
  await key('KeyD', 500); console.log(await info('old key D: no move'));
  await key('KeyL', 600); console.log(await info('new key L: moves right'));
  await shot('k_play');
  await done();
})();
