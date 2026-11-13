const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  await page.mouse.click(900, 500); await page.waitForTimeout(300);
  const r = await page.evaluate(async () => {
    const G = __game; G.Input.slots[0].joined = G.Input.slots[1].joined = true;
    G.Game.goLevel(1); for (let k = 0; k < 4; k++) G.update(1 / 60); G.Game.state = 'play'; const P = G.P;
    P.heroes[1].x = 2600; P.heroes[1].y = 1500; P.heroes[0].x = 400; P.heroes[0].y = 500;
    const ctx = document.getElementById('game').getContext('2d');
    const run = (n) => { let ms = 0; for (let k = 0; k < n; k++) { const a = performance.now(); G.Input.poll(1 / 60); G.update(1 / 60); G.draw(); ms += performance.now() - a; } return +(ms / n).toFixed(2); };
    run(60); const out = {};
    out.full = run(200);
    const od = ctx.drawImage.bind(ctx);
    ctx.drawImage = function (img) { if (img.width >= 1900) return; return od.apply(null, arguments); };   // skip the two full-screen blits
    out.noFullscreenBlits = run(200);
    ctx.drawImage = od;
    const t0 = performance.now(); for (let k = 0; k < 200; k++) { G.Input.poll(1 / 60); G.update(1 / 60); } out.updateOnly = +((performance.now() - t0) / 200).toFixed(3);
    out.gl = (() => { try { const c = document.createElement('canvas').getContext('webgl'); const e = c.getExtension('WEBGL_debug_renderer_info'); return c.getParameter(e.UNMASKED_RENDERER_WEBGL); } catch (e) { return 'none'; } })();
    return out;
  });
  console.log(JSON.stringify(r));
  await browser.close();
})();
