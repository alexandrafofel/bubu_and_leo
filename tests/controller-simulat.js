const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
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
  const info = (lbl) => page.evaluate((lbl) => { const G = __game, P = G.P; return lbl + ' ' + JSON.stringify({ st: G.Game.state, paused: G.Game.paused, pads: G.Input.slots.map(s => s.pad), joined: G.Input.slots.map(s => s.joined), seen: G.UI.seen, ready: G.UI.ready, diff: G.Game.diff, h0: P ? [P.heroes[0].x | 0, P.heroes[0].y | 0] : null, h1: P ? [P.heroes[1].x | 0, P.heroes[1].y | 0] : null, rumbles: rumbles.length, msg: G.UI.lostMsg }); }, lbl);
  // controller presses ✕ on the boot screen (no click): should still reach the title
  await page.evaluate(() => { fakePads[1] = mkPad(1); fakePads[0] = mkPad(0); });
  await press(1, 0); console.log(await info('after pad1 X on boot'));
  await press(0, 0); console.log(await info('after pad0 X'));
  await page.screenshot({ path: 'g_title.png' });
  await press(1, 14); console.log(await info('pad1 dpad-left (difficulty)'));
  await press(1, 0); await press(0, 0); await fr(1600); console.log(await info('both ready'));
  await fr(800); await press(0, 0); await fr(300); console.log(await info('intro skipped'));
  // stick below deadzone: no move. above: move.
  await page.evaluate(() => { fakePads[1].axes[0] = 0.2; fakePads[0].axes[1] = 0.22; }); await fr(700); console.log(await info('stick 0.2 (inside deadzone)'));
  await page.evaluate(() => { fakePads[1].axes[0] = 0.9; fakePads[0].axes[0] = -0.6; fakePads[0].axes[1] = 0.6; }); await fr(1000); console.log(await info('sticks pushed'));
  await page.evaluate(() => { fakePads[1].axes[0] = 0; fakePads[0].axes[0] = 0; fakePads[0].axes[1] = 0; });
  await press(1, 0); await fr(400); console.log(await info('pad1 X (stomp, rumble?)'));
  await press(0, 0, 600); await fr(300); console.log(await info('pad0 hold X (charged kick)'));
  console.log('rumbles', await page.evaluate(() => JSON.stringify(rumbles.slice(-4))));
  await press(0, 9); console.log(await info('Options -> pause'));
  await page.screenshot({ path: 'g_pause.png' });
  await press(0, 9); console.log(await info('Options -> resume'));
  await page.evaluate(() => { fakePads[1] = null; }); await fr(300); console.log(await info('pad1 unplugged'));
  await page.screenshot({ path: 'g_lost.png' });
  await page.evaluate(() => { fakePads[2] = mkPad(2); }); await press(2, 0); console.log(await info('new pad pressed X'));
  await press(2, 0); console.log(await info('X again -> resume'));
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
