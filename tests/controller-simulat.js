// Doua controllere false (navigator.getGamepads inlocuit): pornirea doar din controller, alegerea jocului,
// intrarea in joc cu ✕, dificultatea, zona moarta, puterea, vibratiile, ajutorul cu □, pauza, deconectarea.
// Jocul: variabila JOC (bubu sau lupta). Scrie "controller-simulat OK" sau "NEREUSIT".
const { chromium, game } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [], bad = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.addInitScript(() => {
    window.fakePads = [null, null, null, null]; window.rumbles = [];
    const mk = (i) => ({ index: i, id: 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)', connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0 })),
      vibrationActuator: { playEffect: (t, o) => { rumbles.push([i, t, o.duration, o.strongMagnitude, o.weakMagnitude]); return Promise.resolve('complete'); } } });
    window.mkPad = mk;
    navigator.getGamepads = () => fakePads;
  });
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  await page.evaluate(() => { localStorage.clear(); });
  const fr = (ms) => page.waitForTimeout(ms);
  const press = async (i, b, ms = 80) => { await page.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = true; }, [i, b]); await fr(ms); await page.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = false; }, [i, b]); await fr(80); };
  const state = () => page.evaluate(() => { const G = __game, P = G.P; return { st: G.Game.state, game: G.GAME, paused: G.Game.paused, pads: G.Input.slots.map(s => s.pad), joined: G.Input.slots.map(s => s.joined), seen: G.UI.seen.slice(), ready: G.UI.ready.slice(), diff: G.Game.diff.slice(), sel: G.UI.gameSel,
    h0: P ? [P.heroes[0].x | 0, P.heroes[0].y | 0] : null, h1: P ? [P.heroes[1].x | 0, P.heroes[1].y | 0] : null, down: P ? P.heroes.map(h => h.down) : null, flock: P ? P.flock.length : 0, rumbles: rumbles.length }; });
  const check = async (lbl, ok) => { const s = await state(); let good = false; try { good = !!ok(s); } catch (e) { good = false; } console.log((good ? 'ok   ' : 'GRESIT ') + lbl + ' ' + JSON.stringify(s)); if (!good) bad.push(lbl); return s; };

  // two controllers. Only buttons, no click: the game must still leave the first screen
  await page.evaluate(() => { fakePads[1] = mkPad(1); fakePads[0] = mkPad(0); });
  await press(1, 0); await fr(500);
  await check('✕ pe primul ecran: apare alegerea jocului', s => s.st === 'select');
  // the screen with the two games: right, left, then the wanted game
  await press(1, 15); await check('dreapta: al doilea joc', s => s.sel === 1);
  await press(1, 14); await check('stanga: primul joc', s => s.sel === 0);
  if (game === 'lupta') await press(1, 15);
  await press(1, 0); await fr(300);
  await check('✕: jocul ales, ecranul de start', s => s.st === 'title' && s.game === game);
  await page.screenshot({ path: 'g_title.png' });
  // the controller that pressed first plays the first hero; the second one joins with ✕
  await press(0, 0); await fr(200);
  const j = await check('al doilea controller intra cu ✕', s => s.joined[0] && s.joined[1] && s.pads[0] === 1 && s.pads[1] === 0);
  const d0 = j.diff[0];
  await press(1, 14); await check('stanga pe controllerul 1: dificultatea primului erou se schimba', s => s.diff[0] !== d0);
  await press(1, 15);
  await press(1, 0); await press(0, 0); await check('amandoi gata', s => s.ready[0] && s.ready[1]);
  await fr(1700); await check('jocul porneste: povestea nivelului', s => s.st === 'intro');
  await fr(900); await press(0, 0); await fr(300);
  const p0 = await check('✕: incepe nivelul', s => s.st === 'play');
  // stick inside the dead zone: nobody moves. Pushed: both move
  await page.evaluate(() => { fakePads[1].axes[0] = 0.2; fakePads[0].axes[1] = 0.22; }); await fr(700);
  await check('stick 0.2 (in zona moarta): nu se misca', s => Math.abs(s.h0[0] - p0.h0[0]) < 3 && Math.abs(s.h1[1] - p0.h1[1]) < 3);
  await page.evaluate(() => { fakePads[1].axes[0] = 0.9; fakePads[0].axes[0] = -0.6; fakePads[0].axes[1] = 0.6; }); await fr(1000);
  await check('stick impins: amandoi se misca', s => s.h0[0] > p0.h0[0] + 80 && s.h1[1] > p0.h1[1] + 40);
  await page.evaluate(() => { fakePads[1].axes[0] = 0; fakePads[0].axes[0] = 0; fakePads[0].axes[1] = 0; });
  const r0 = (await state()).rumbles;
  await press(1, 0); await fr(400); await check('✕ pe controllerul 1: puterea primului erou, cu vibratie', s => s.rumbles > r0);
  await press(0, 0, 600); await fr(150); await check('✕ tinut pe controllerul 2: mingi in toate directiile', s => s.flock >= 8);
  console.log('ultimele vibratii', await page.evaluate(() => JSON.stringify(rumbles.slice(-4))));
  // a hero is hit: he waits. The friend presses □: the hero gets up
  await fr(2500);
  await page.evaluate(() => { const G = __game, P = G.P, a = P.heroes[0], b = P.heroes[1]; b.x = a.x + 110; b.y = a.y; a.inv = 0; a.dizzy = 0; G.hitHero(a, a.x - 60, a.y); }); await fr(400);
  const hx = await check('primul erou e lovit: asteapta ajutor', s => s.down[0] === true);
  await page.evaluate(() => { fakePads[1].axes[0] = 0.9; }); await fr(600); await page.evaluate(() => { fakePads[1].axes[0] = 0; });
  await check('cat asteapta nu poate merge', s => s.down[0] && Math.abs(s.h0[0] - hx.h0[0]) < 40);
  await press(1, 2); await fr(300); await check('□ apasat de cel lovit: nimic', s => s.down[0] === true);
  await press(0, 2); await fr(900); await check('□ pe controllerul prietenului: eroul se ridica', s => s.down[0] === false);
  // pause, unplug, plug another one
  await press(0, 9); await check('OPTIONS: pauza', s => s.paused);
  await page.screenshot({ path: 'g_pause.png' });
  await press(0, 9); await check('OPTIONS: inapoi in joc', s => !s.paused);
  await page.evaluate(() => { fakePads[1] = null; }); await fr(300); await check('controller scos: pauza', s => s.paused && s.pads[0] === null);
  await page.screenshot({ path: 'g_lost.png' });
  await page.evaluate(() => { fakePads[2] = mkPad(2); }); await press(2, 0); await check('alt controller apasa ✕: ia locul celui scos', s => s.pads[0] === 2);
  await press(2, 0); await check('✕ din nou: jocul continua', s => !s.paused && s.st === 'play');
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'controller-simulat OK (' + game + ')');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
