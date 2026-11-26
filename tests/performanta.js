// Timpul mediu pe cadru la un nivel obisnuit: cu tot desenul, fara cele doua desene pe tot ecranul, si doar regulile. Jocul: variabila JOC.
const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  await page.mouse.click(900, 500); await page.waitForTimeout(300);
  const r = await page.evaluate(async (GAME) => {
    const G = __game; G.setGame(GAME); G.Input.slots[0].joined = G.Input.slots[1].joined = true;
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
    // S7.7 (T6.10): cadrul nou (harta de lumina, planul din fata, halouri, praf, apa) la nivelul 6, in aceeasi rulare cu cel vechi,
    // cate 5 runde alternate; se ia cea mai mica medie din runde (zgomotul masinii doar adauga). Limita: cel mult 20% peste.
    {
      const old = Object.assign({}, G.CONFIG.look), all = { preview: true, lights: true, front: true, waves: true, motes: 40, halo: 0.5 }, none = { preview: false, lights: false, front: false, waves: false, motes: 0, halo: 0 };
      const at = (lv, c) => { Object.assign(G.CONFIG.look, c); G.Game.goLevel(lv); for (let k = 0; k < 4; k++) G.update(1 / 60); G.Game.state = 'play'; const Q = G.P; Q.heroes[1].x = 2600; Q.heroes[1].y = 1500; Q.heroes[0].x = 400; Q.heroes[0].y = 500; run(30); return run(100); };
      const o = [], n = [];
      for (let round = 0; round < 5; round++) { o.push(at(5, none)); n.push(at(5, all)); }
      out.nivel6 = { vechi: Math.min(...o), nou: Math.min(...n), raport: +(Math.min(...n) / Math.min(...o)).toFixed(3), runde_vechi: o, runde_nou: n };
      // T7.5: nivelul 7 (capitolul 7, diorama de la sine) fata de nivelul 6 cu tot stilul nou, in aceeasi rulare, 5 runde alternate
      const s6 = [], s7 = [];
      for (let round = 0; round < 5; round++) { s6.push(at(5, all)); s7.push(at(7, Object.assign({}, all, { preview: false }))); }
      out.nivel7 = { nivel6: Math.min(...s6), nivel7: Math.min(...s7), raport: +(Math.min(...s7) / Math.min(...s6)).toFixed(3), runde6: s6, runde7: s7 };
      Object.assign(G.CONFIG.look, old);
    }
    out.gl = (() => { try { const c = document.createElement('canvas').getContext('webgl'); const e = c.getExtension('WEBGL_debug_renderer_info'); return c.getParameter(e.UNMASKED_RENDERER_WEBGL); } catch (e) { return 'none'; } })();
    return out;
  }, require('./pw.js').game);
  console.log(JSON.stringify(r));
  if (r.nivel7) console.log(r.nivel7.raport <= 1.2 ? 'nivelul 7 OK: ' + Math.round((r.nivel7.raport - 1) * 100) + '% fata de nivelul 6 (limita 20%)' : 'nivelul 7 NEREUSIT: ' + Math.round((r.nivel7.raport - 1) * 100) + '% peste nivelul 6 (limita 20%)');
  if (r.nivel6) console.log(r.nivel6.raport <= 1.2 ? 'buget OK: cadrul nou e ' + Math.round((r.nivel6.raport - 1) * 100) + '% peste cel vechi (limita 20%)' : 'buget NEREUSIT: cadrul nou e ' + Math.round((r.nivel6.raport - 1) * 100) + '% peste cel vechi (limita 20%)');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
