// Ecranul cu cele doua jocuri: "Bubu și Leo" si "Cea mai grea luptă". Taste reale si mouse.
// Verifica: alegerea cu stanga / dreapta, pornirea, intoarcerea cu Backspace, eroii si textele fiecarui joc,
// progresul salvat separat pentru fiecare joc si jocul ales data trecuta dupa o repornire. Capturi s_*.png.
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot({ manual: false });
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800);
  const key = async (k, ms = 70) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(130); };
  const state = () => page.evaluate(() => { const G = __game; return { st: G.Game.state, game: G.GAME, sel: G.UI.gameSel, title: G.T('title'), heroes: G.CONFIG.heroes.map(h => h.name), villain: G.CONFIG.villainName, egg: G.T('eggN'), hits: G.CONFIG.boss.hits,
    has: [G.Save.hasProgress('bubu'), G.Save.hasProgress('lupta')], lvl: [(G.Save.slot('bubu') || {}).level, (G.Save.slot('lupta') || {}).level], set: !!G.UI.set }; });
  const bad = [];
  const check = async (lbl, ok) => { const s = await state(); let good = false; try { good = !!ok(s); } catch (e) { good = false; } console.log((good ? 'ok   ' : 'GRESIT ') + lbl + ' ' + JSON.stringify(s)); if (!good) bad.push(lbl); return s; };
  await check('primul ecran', s => s.st === 'boot');
  await page.mouse.click(900, 500); await page.waitForTimeout(700);
  await check('dupa clic: alege jocul, primul joc e ales', s => s.st === 'select' && s.sel === 0);
  await shot('s_select0');
  await key('ArrowRight'); await check('dreapta: al doilea joc', s => s.sel === 1); await shot('s_select1');
  await key('ArrowRight'); await check('dreapta din nou: inapoi la primul', s => s.sel === 0);
  await key('ArrowLeft'); await check('stanga: al doilea', s => s.sel === 1);
  await key('KeyP'); await check('P: setarile se deschid si de aici', s => s.set && s.st === 'select'); await key('KeyP');
  await check('P: setarile se inchid', s => !s.set);
  await key('Enter'); await page.waitForTimeout(300);
  await check('Enter: Cea mai grea luptă, cu eroii si textele ei', s => s.st === 'title' && s.game === 'lupta' && s.title === 'Cea mai grea luptă' && s.heroes.join() === 'Boon,Killer' && s.villain === 'George cel Rău' && s.egg === 'cristale');
  await shot('s_title_lupta');
  // progresul jocului ales, ca si cum echipa ar fi terminat nivelurile 1 - 4 cu 77 de cristale in total (rezultatul fiecarui capitol e in results)
  const prog = (lvl, eggs) => page.evaluate(([lvl, eggs]) => { const G = __game, sl = G.Save.own(); sl.level = lvl; sl.max = lvl; sl.results = Array.from({ length: lvl }, (_, i) => ({ eggs: i ? 0 : eggs, stars: 0, med: [false, false, false] })); sl.eggs = eggs; sl.stars = 0; G.Save.write(); }, [lvl, eggs]);
  await prog(4, 77);      // ca si cum ar fi ajuns la nivelul 5
  await key('Backspace'); await page.waitForTimeout(300); await check('Backspace: inapoi la alegerea jocului', s => s.st === 'select' && s.sel === 1);
  await key('ArrowLeft'); await key('Enter'); await page.waitForTimeout(300);
  await check('Enter: Bubu și Leo, cu eroii si textele lui', s => s.st === 'title' && s.game === 'bubu' && s.title === 'Bubu și Leo' && s.heroes.join() === 'Bubu,Leo' && s.villain === 'Ciori' && s.egg === 'ouă');
  await check('progresul e separat: doar al doilea joc are progres', s => s.has[0] === false && s.has[1] === true && s.lvl[1] === 4);
  await shot('s_title_bubu');
  await prog(2, 20);
  await check('acum amandoua au progres, fiecare al lui', s => s.has[0] && s.has[1] && s.lvl[0] === 2 && s.lvl[1] === 4);
  // dupa repornire: jocul jucat ultima data e cel ales din start, progresul amandurora e pastrat
  await page.reload(); await page.waitForTimeout(900); await page.mouse.click(900, 500); await page.waitForTimeout(700);
  await check('dupa repornire: ales e jocul de data trecuta (Bubu și Leo)', s => s.st === 'select' && s.sel === 0 && s.lvl[0] === 2 && s.lvl[1] === 4);
  await shot('s_select_progres');
  // mouse: un clic pe cartonasul din dreapta porneste al doilea joc
  await page.mouse.move(1400, 600); await page.waitForTimeout(200); await check('mouse deasupra celui de-al doilea joc: il alege', s => s.sel === 1);
  await page.mouse.click(1400, 600); await page.waitForTimeout(400); await check('clic: porneste Cea mai grea luptă', s => s.st === 'title' && s.game === 'lupta' && s.has[1]);
  // "Continuă" porneste de la nivelul salvat al jocului ales
  await key('Enter'); await key('Enter'); await page.waitForTimeout(2200);
  const lv = await page.evaluate(() => ({ st: __game.Game.state, idx: __game.Game.levelIdx, eggs: __game.Game.team.eggs, key: __game.P && __game.P.L.def.key }));
  console.log('continua:', JSON.stringify(lv)); if (!(lv.idx === 4 && lv.eggs === 77 && lv.key === 'vines')) bad.push('Continuă: nivelul salvat al jocului ales');
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'alege-jocul OK');
  await done();
})();
