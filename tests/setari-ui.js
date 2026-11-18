// settings: real key presses and fake controllers, screenshots of every page. Jocul: variabila JOC (bubu sau lupta).
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot({ manual: false, init: () => {
    window.fakePads = [null, null, null, null]; window.rumbles = [];
    window.mkPad = (i) => ({ index: i, id: 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)', connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0 })),
      vibrationActuator: { playEffect: (t, o) => { rumbles.push([i, o.duration]); return Promise.resolve('complete'); } } });
    navigator.getGamepads = () => fakePads;
  } });
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800);
  const key = async (k, ms = 60) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(90); };
  const pad = async (i, b, ms = 80) => { await page.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = true; }, [i, b]); await page.waitForTimeout(ms); await page.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = false; }, [i, b]); await page.waitForTimeout(90); };
  const info = (lbl) => page.evaluate((lbl) => { const G = __game, s = G.UI.set; return lbl + ' ' + JSON.stringify({ st: G.Game.state, set: s ? [s.page, s.p, s.sel[s.page], s.msg, s.cap] : null, lang: G.Opt.lang, ctrl: G.Opt.ctrl, swap: G.Opt.swap, keys: G.Opt.keys.map(k => Object.values(k).join(',')), diff: G.Game.diff, guide: G.Opt.guide, vol: G.Snd.vol, pads: G.Input.slots.map(s => s.pad), joined: G.Input.slots.map(s => s.joined), seen: G.UI.seen, vib: G.Opt.vibration }); }, lbl);
  await shot('u_boot');
  await page.mouse.click(900, 500); await page.waitForTimeout(1500); console.log(await info('boot -> title (un singur joc)'));
  await shot('u_title0');
  await key('KeyP'); console.log(await info('P opens settings')); await shot('u_set_main');
  await key('ArrowRight'); console.log(await info('language -> en')); await shot('u_set_main_en');
  await key('ArrowLeft'); console.log(await info('language -> ro'));
  await key('ArrowDown'); await key('ArrowDown'); await key('ArrowLeft'); await key('ArrowLeft'); console.log(await info('music -2'));
  await key('ArrowDown'); await key('ArrowDown'); await key('ArrowRight'); console.log(await info('chr +1'));
  await key('ArrowDown'); await key('Enter'); console.log(await info('vibration toggled'));
  await key('ArrowDown'); await key('Enter'); console.log(await info('player 1 page')); await shot('u_set_p1');
  await key('ArrowDown'); await key('ArrowRight'); console.log(await info('p1 plays with keyboard'));
  await key('ArrowDown'); await key('Enter'); console.log(await info('keys page')); await shot('u_set_keys');
  await key('Enter'); console.log(await info('capture up')); await shot('u_set_keys_cap');
  await key('KeyI'); console.log(await info('up = I'));
  await key('ArrowDown'); await key('Enter'); await key('ArrowUp'); console.log(await info('down = ArrowUp (was player 2 up): swapped')); await shot('u_set_keys2');
  await key('ArrowDown'); await key('Enter'); await key('KeyP'); console.log(await info('left = P (reserved): refused'));
  await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); await key('KeyQ'); console.log(await info('help the friend (the square) = Q'));
  await key('ArrowDown'); await key('Enter'); console.log(await info('reset keys'));
  await key('Backspace'); console.log(await info('back to player'));
  await key('ArrowUp'); await key('ArrowLeft'); console.log(await info('p1 plays with controller'));
  await key('ArrowDown'); await key('Enter'); console.log(await info('pad page (no pad yet)')); await shot('u_set_pad0');
  await page.evaluate(() => { fakePads[0] = mkPad(0); fakePads[1] = mkPad(1); }); await page.waitForTimeout(200);
  await pad(1, 0); console.log(await info('pad 1 pressed X: bound to hero of player 1'));
  await page.evaluate(() => { fakePads[1].axes[0] = 0.8; fakePads[1].axes[1] = -0.5; fakePads[1].buttons[2].pressed = true; }); await page.waitForTimeout(150);
  await shot('u_set_pad1');
  await page.evaluate(() => { fakePads[1].axes[0] = 0; fakePads[1].axes[1] = 0; fakePads[1].buttons[2].pressed = false; }); await page.waitForTimeout(400);
  await pad(1, 0); console.log(await info('X on "try the vibration"'), 'rumbles', await page.evaluate(() => rumbles.length));
  await pad(1, 13); await pad(1, 0); await page.waitForTimeout(900); console.log(await info('find speaker')); await shot('u_set_pad2');
  await pad(1, 1); console.log(await info('circle = back'));
  await key('ArrowUp'); await key('ArrowUp'); await key('ArrowRight'); console.log(await info('hero swapped: player 1 = Leo')); await shot('u_set_p1_leo');
  await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowRight'); await key('ArrowDown'); await key('Enter'); console.log(await info('diff +1, guide toggled'));
  await pad(1, 9); console.log(await info('OPTIONS closes settings')); await shot('u_title1');
  // mouse: open settings by click, click a slider, click back
  await page.mouse.click(1700, 86); await page.waitForTimeout(200); console.log(await info('click on settings card'));
  await page.mouse.move(960, 400); await page.waitForTimeout(150); await shot('u_set_mouse');
  await page.mouse.click(1340, 322); await page.waitForTimeout(150); console.log(await info('click on a music dot'));
  await page.mouse.click(960, 800); await page.waitForTimeout(150); console.log(await info('click on back'));
  const saved = await page.evaluate(() => localStorage.getItem(__game.CONFIG.saveKey)); console.log('saved', saved);
  await page.reload(); await page.waitForTimeout(900); console.log(await info('after reload (settings restored)'));
  await shot('u_boot2');
  await done();
})();
