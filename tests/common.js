const { chromium } = require('./pw.js');
/* boot(opts): opens the game in a headless Chrome, clicks once (sound), and (unless opts.manual === false)
   starts the game and replaces Input.poll so the test decides what the players press.
   opts.game: always 'lupta' (the only game). */
module.exports = async function boot(opts = {}) {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [], game = opts.game || require('./pw.js').game;
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  if (opts.init) await page.addInitScript(opts.init);
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  if (opts.manual !== false) {
    await page.mouse.click(900, 500); await page.waitForTimeout(300);
    await page.evaluate((game) => {
      const G = __game, I = G.Input, orig = I.poll; window.inp = [{}, {}]; window.joined = [true, true];
      I.poll = function (dt) { orig(dt); const S = I.slots; for (let k = 0; k < 2; k++) { const s = S[k], b = inp[k]; s.joined = joined[k]; if (b.x != null) { s.x = b.x; s.y = b.y; } if (b.aP) { s.aP = true; b.aP = false; } if (b.a) s.a = true; if (b.aR) { s.aR = true; b.aR = false; } if (b.hP || b.bP) { s.hP = true; b.hP = false; b.bP = false; } if (b.cP) { s.cP = true; b.cP = false; } if (b.c) s.c = true; if (b.cR) { s.cR = true; b.cR = false; } if (b.runP) { s.runP = true; b.runP = false; } if (b.run) s.run = true; } if (inp.pause) { I.pause = true; inp.pause = false; } };
      window.step = (n) => { for (let i = 0; i < n; i++) { I.poll(1 / 60); G.update(1 / 60); } G.draw(); };
      step(2);                                   // boot -> the title screen
      G.setGame(game); G.Game.toTitle(); step(2);
      window.go = (i) => { G.Game.team = { eggs: 12 * i, stars: i }; G.Game.goLevel(i); step(5); G.UI.introT = 2; inp[0].aP = true; step(3); };
    }, game);
  }
  const shot = async (n) => { await page.waitForTimeout(150); await page.screenshot({ path: n + '.png' }); };
  const done = async () => { console.log('errors', errs.length); errs.slice(0, 8).forEach(e => console.log(e)); await browser.close(); };
  return { browser, page, errs, shot, done, game };
};
