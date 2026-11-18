// Cea mai grea lupta e singurul joc. Dupa primul clic se ajunge direct pe ecranul de start (nu mai exista "Alege jocul").
// Verifica: eroii si textele, progresul salvat in slotul jocului (g2), setarile, si ca un salvat vechi cu progres de la Bubu si Leo nu strica nimic.
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot({ manual: false });
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800);
  const key = async (k, ms = 70) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(130); };
  const state = () => page.evaluate(() => { const G = __game; return { st: G.Game.state, game: G.GAME, title: G.T('title'), heroes: G.CONFIG.heroes.map(h => h.name), villain: G.CONFIG.villainName, egg: G.T('eggN'), set: !!G.UI.set, lvl: (G.Save.slot('lupta') || {}).level }; });
  const bad = [];
  const check = async (lbl, ok) => { const s = await state(); let good = false; try { good = !!ok(s); } catch (e) { good = false; } console.log((good ? 'ok   ' : 'GRESIT ') + lbl + ' ' + JSON.stringify(s)); if (!good) bad.push(lbl); };
  await check('primul ecran', s => s.st === 'boot' && s.game === 'lupta');
  await page.mouse.click(900, 500); await page.waitForTimeout(700);
  await check('dupa clic: direct ecranul de start, Cea mai grea luptă', s => s.st === 'title' && s.game === 'lupta' && s.title === 'Cea mai grea luptă' && s.heroes.join() === 'Boon,Killer' && s.villain === 'George cel Rău' && s.egg === 'cristale');
  await shot('s_title');
  await key('Backspace'); await check('Backspace pe ecranul de start nu mai duce nicaieri', s => s.st === 'title');
  await key('KeyP'); await check('P: setarile se deschid', s => s.set && s.st === 'title'); await key('KeyP');
  await check('P: setarile se inchid', s => !s.set);
  // progres salvat: slotul jocului (g2) ramane valid; campurile vechi (primul joc, direct pe d) sunt ignorate, nu sterse
  await page.evaluate(() => { const G = __game, d = G.Save.data || (G.Save.data = {}); d.level = 3; d.max = 3; G.Save.own().level = 2; G.Save.own().max = 2; G.Save.write(); });
  await page.reload(); await page.waitForTimeout(900); await page.mouse.click(900, 500); await page.waitForTimeout(700);
  await check('dupa repornire: progresul jocului e in slotul lui, cel vechi nu il strica', s => s.st === 'title' && s.lvl === 2);
  const old = await page.evaluate(() => (__game.Save.data || {}).level);
  console.log((old === 3 ? 'ok   ' : 'GRESIT ') + 'progresul vechi de la Bubu si Leo e pastrat in fisier (nefolosit): ' + old); if (old !== 3) bad.push('vechi');
  if (bad.length) console.log('NEREUSIT: ' + bad.join(' | ')); else console.log('un-singur-joc OK');
  await done();
})();
