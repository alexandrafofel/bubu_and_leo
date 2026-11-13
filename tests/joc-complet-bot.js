const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(1000);
  await page.evaluate(() => { localStorage.clear(); });
  await page.mouse.click(900, 500); await page.waitForTimeout(400);
  await page.evaluate(() => {
    const G = __game, I = G.Input, orig = I.poll; let f = 0;
    window.bot = { on: true, log: [] };
    I.poll = function (dt) {
      orig(dt); if (!bot.on) return; f++;
      const S = I.slots, st = G.Game.state, P = G.P;
      for (const s of S) { s.x = s.y = 0; s.aP = s.aR = s.a = false; s.joined = true; s.up = s.down = s.left = s.right = false; }
      if (st === 'title' || st === 'intro' || st === 'levelEnd' || st === 'ending') { if (f % 20 === 0) { S[0].aP = true; S[1].aP = true; } return; }
      if (st !== 'play' || !P) return;
      const h = P.heroes[0], l = P.heroes[1], L = P.L;
      if (L.boss) {
        S[1].joined = false;
        if (P.boss.state === 'up') { h.x = L.treeBase.x - 200; h.y = L.treeBase.y + 150; if (f % 50 === 0) S[0].aP = true; }
        return;
      }
      if (f % 90 === 0) S[1].aP = true; if (f % 90 < 12) S[1].a = true; if (f % 90 === 12) S[1].aR = true;
      S[1].x = Math.sin(f / 50); S[1].y = Math.cos(f / 70);
      if (P.nestOpen) { h.x = L.nest.x - 40; h.y = L.nest.y; l.x = L.nest.x + 40; l.y = L.nest.y; return; }
      if (f % 6) return;
      let best = null, bd = 1e9;
      for (const e of P.eggs) if (e.delay <= 0 && e.state === 'idle' && !(e.wait > 0)) { const d = Math.hypot(e.x - h.x, e.y - h.y); if (d < bd) { bd = d; best = e; } }
      if (best) { h.x = best.x - 20; h.y = best.y; return; }
      if (P.duel && !P.duel.over) { h.x = P.duel.x - 130; h.y = P.duel.y; h.dizzy = 0; if (h.cd <= 0 && P.duel.z < 60) S[0].aP = true; return; }
      const tr = L.dynTrees.find(t => t.spark && t.spark.active && !t.spark.done);
      if (tr) { h.x = tr.cx; h.y = tr.cy + tr.cr + 60; if (h.cd <= 0) S[0].aP = true; return; }
      const st2 = P.stars.find(s => !s.got && !s.hidden && s.kind !== 'islet'); if (st2 && f % 60 === 0) { h.x = st2.x - 10; h.y = st2.y; }
    };
  });
  let last = '', out = [];
  for (let iter = 0; iter < 400; iter++) {
    const r = await page.evaluate(() => {
      const G = __game; let n = 0; const st0 = G.Game.state + ':' + G.Game.levelIdx;
      for (; n < 600; n++) { G.Input.poll(1 / 60); G.update(1 / 60); if (G.Game.state + ':' + G.Game.levelIdx !== st0) break; }
      G.draw();
      const P = G.P;
      return { st: G.Game.state + ':' + G.Game.levelIdx, t: P ? Math.round(P.time) : 0, eggs: G.Game.team.eggs, stars: G.Game.team.stars, wave: P ? P.wave : -1, left: P ? P.eggs.filter(e => e.req).length : 0, nest: P ? P.nestOpen : 0, boss: P && P.boss ? P.boss.state + P.boss.phase : '', parts: P ? P.parts.length : 0 };
    });
    if (r.st !== last) { console.log(JSON.stringify(r)); last = r.st; if (/^(intro|levelEnd|ending)/.test(r.st)) { await page.evaluate(() => { for (let i = 0; i < 70; i++) { __game.Game.t += 1 / 60; if (__game.Game.state === 'intro') __game.UI.introT += 0; } __game.draw(); }); } }
    if (iter % 12 === 11) console.log('  ..', JSON.stringify(r));
    if (r.st.startsWith('title') && iter > 5) break;
    if (errs.length) break;
  }
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  console.log('save', await page.evaluate(() => localStorage.getItem(__game.CONFIG.saveKey)));
  await browser.close();
})();
