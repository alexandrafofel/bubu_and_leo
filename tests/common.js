const { chromium } = require('./pw.js');
/* BALANSEAZA: source injected into the page by the bots (addInitScript). It defines window.balanseaza(),
   which moves eggs from the hero who has more than his quota to the friend who still needs some, with
   __game.giveEgg (the same path as L1). The bots set hero positions themselves, so when the two are
   farther apart than CONFIG.quota.giveRange it first walks the giver next to the friend.
   Returns true when it did something this frame, so the bot's own movement yields to it.
   Solo play, no quota or quota already met: returns false and changes nothing. */
const BALANSEAZA = `window.balanseaza = function () {
  const G = window.__game; if (!G || !G.P) return false;
  const P = G.P; if (!G.quotaOn || !G.quotaOn() || P.done) return false;
  if (!G.isJoined(0) || !G.isJoined(1)) return false;                      // solo: nothing to share
  if (P.gifts.length) return true;                                        // an egg is already flying: wait for it to land
  const a = G.quotaState(0), b = G.quotaState(1);
  if (a.ok && b.ok) return false;
  const from = a.ok && !b.ok ? 0 : (b.ok && !a.ok ? 1 : (P.found[0] >= P.found[1] ? 0 : 1));
  if (P.found[from] < 1 || G.quotaState(1 - from).ok) return false;
  const g = P.heroes[from], f = P.heroes[1 - from];
  if (g.down || g.dizzy > 0 || g.carried || f.down) return false;
  const R = G.CONFIG.quota.giveRange;
  if (Math.hypot(g.x - f.x, g.y - f.y) > R * 0.6) { g.x = f.x + (from ? 90 : -90); g.y = f.y; return true; }
  return G.giveEgg(from) || true;
};`;
/* boot(opts): opens the game in a headless Chrome, clicks once (sound), and (unless opts.manual === false)
   starts the game and replaces Input.poll so the test decides what the players press.
   opts.game: always 'lupta' (the only game). */
module.exports = async function boot(opts = {}) {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [], game = opts.game || require('./pw.js').game;
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.addInitScript(BALANSEAZA);           // window.balanseaza() available in every test
  if (opts.init) await page.addInitScript(opts.init);
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  if (opts.manual !== false) {
    await page.mouse.click(900, 500); await page.waitForTimeout(300);
    await page.evaluate((game) => {
      const G = __game, I = G.Input, orig = I.poll; window.inp = [{}, {}]; window.joined = [true, true];
      I.poll = function (dt) { orig(dt); const S = I.slots; for (let k = 0; k < 2; k++) { const s = S[k], b = inp[k]; s.joined = joined[k]; if (b.x != null) { s.x = b.x; s.y = b.y; } if (b.aP) { s.aP = true; b.aP = false; } if (b.a) s.a = true; if (b.aR) { s.aR = true; b.aR = false; } if (b.hP || b.bP) { s.hP = true; b.hP = false; b.bP = false; } if (b.cP) { s.cP = true; b.cP = false; } if (b.c) s.c = true; if (b.cR) { s.cR = true; b.cR = false; } if (b.runP) { s.runP = true; b.runP = false; } if (b.run) s.run = true; if (b.gP) { s.gP = true; b.gP = false; } if (b.g) s.g = true; } if (inp.pause) { I.pause = true; inp.pause = false; } };
      window.step = (n) => { for (let i = 0; i < n; i++) { I.poll(1 / 60); G.update(1 / 60); } G.draw(); };
      step(2);                                   // boot -> the title screen
      G.setGame(game); G.Game.toTitle(); step(2);
      // the index of a chapter: chIdx('level', 6) = level 7, chIdx('boss') = the big fight (always the last chapter since 27 November 2026)
      window.chIdx = (kind, n) => chapters().findIndex(c => c.kind === kind && (kind === 'boss' || c.n === n));
      window.go = (i) => { G.Game.team = { eggs: 12 * i, stars: i }; G.Game.goLevel(i); step(5); G.UI.introT = 2; inp[0].aP = true; step(3); };
    }, game);
  }
  const shot = async (n) => { await page.waitForTimeout(150); await page.screenshot({ path: n + '.png' }); };
  const done = async () => { console.log('errors', errs.length); errs.slice(0, 8).forEach(e => console.log(e)); await browser.close(); };
  return { browser, page, errs, shot, done, game };
};
module.exports.BALANSEAZA = BALANSEAZA;        // for the bots, which build their own page instead of calling boot()
