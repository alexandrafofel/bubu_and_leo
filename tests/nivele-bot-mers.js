// Un bot merge cu adevarat prin fiecare nivel (singur, cu primul erou). Jocul: variabila JOC (bubu sau lupta).
const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(1000);
  await page.mouse.click(900, 500); await page.waitForTimeout(300);
  await page.evaluate((GAME) => {
    const G = __game, I = G.Input, orig = I.poll; G.setGame(GAME); window.bot = { hits: 0, stuck: 0, lastEggs: -1, lastT: 0, tgt: null, field: null, fkey: '' };
    const CS = 40;
    function field(L, tx, ty) {
      const key = (tx / CS | 0) + ',' + (ty / CS | 0); if (bot.fkey === key && bot.fL === L) return bot.field;
      const d = new Int32Array(L.cols * L.rows).fill(-1); let start = L.ci(tx, ty);
      if (!L.reach[start]) { let bd = 1e9; for (let i = 0; i < d.length; i++) if (L.reach[i]) { const x = (i % L.cols + .5) * CS, y = ((i / L.cols | 0) + .5) * CS, dd = Math.hypot(x - tx, y - ty); if (dd < bd) { bd = dd; start = i; } } }
      const q = [start]; d[start] = 0; let qi = 0;
      while (qi < q.length) { const i = q[qi++], cx = i % L.cols, cy = i / L.cols | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (L.reach[j] && d[j] < 0) { d[j] = d[i] + 1; q.push(j); } } }
      bot.field = d; bot.fkey = key; bot.fL = L; return d;
    }
    I.poll = function (dt) {
      orig(dt); const S = I.slots, st = G.Game.state, P = G.P;
      S[0].joined = true; S[0].x = S[0].y = 0; S[0].aP = S[0].aR = S[0].a = false; S[1].joined = false;
      if (st !== 'play' || !P || P.L.boss) return;
      const h = P.heroes[0], L = P.L; let tx = null, ty = null, stomp = false;
      if (h.dizzy > 0 && !bot.wasDizzy) bot.hits++; bot.wasDizzy = h.dizzy > 0;
      if (P.nestOpen) { tx = L.nest.x; ty = L.nest.y; }
      else if (P.duel && !P.duel.over) { const d = P.duel; bot.duelT = (bot.duelT || 0) + dt; tx = d.x; ty = d.y; if (Math.hypot(d.x - h.x, d.y - h.y) < 260 && d.z < 60) { stomp = true; tx = null; } }
      else {
        let bd = 1e9;
        for (const e of P.eggs) if (e.req && e.delay <= 0 && e.state === 'idle') { const d = Math.hypot(e.x - h.x, e.y - h.y); if (d < bd) { bd = d; tx = e.x; ty = e.y; } }
        if (tx == null) { const tr = L.dynTrees.find(t => t.spark && t.spark.active && !t.spark.done); if (tr) { tx = tr.spark.targets[0].x; ty = tr.spark.targets[0].y; if (Math.hypot(tr.cx - h.x, tr.cy - h.y) < 250 + tr.cr) stomp = true; } }
      }
      if (stomp && h.cd <= 0) S[0].aP = true;
      if (tx == null) return;
      const d = field(L, tx, ty), ci = L.ci(h.x, h.y), cx = ci % L.cols, cy = ci / L.cols | 0;
      let gx = tx, gy = ty;
      if (d[ci] > 1) { let best = d[ci]; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (d[j] < 0) continue; if (dx && dy && (d[cy * L.cols + nx] < 0 || d[ny * L.cols + cx] < 0)) continue; if (d[j] < best) { best = d[j]; gx = (nx + .5) * CS; gy = (ny + .5) * CS; } } }
      else if (d[ci] < 0) { let bd = 1e9; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows) continue; const j = ny * L.cols + nx; if (d[j] >= 0) { const dd = Math.hypot((nx + .5) * CS - h.x, (ny + .5) * CS - h.y); if (dd < bd) { bd = dd; gx = (nx + .5) * CS; gy = (ny + .5) * CS; } } } }
      const mx = gx - h.x, my = gy - h.y, m = Math.hypot(mx, my) || 1; S[0].x = mx / m; S[0].y = my / m;
      bot.tgt = [tx | 0, ty | 0];
    };
    window.runLevel = (i, maxT) => {
      G.Game.team = { eggs: 0, stars: 0 }; G.Game.goLevel(i); for (let k = 0; k < 5; k++) { I.poll(1 / 60); G.update(1 / 60); } G.Game.state = 'play'; bot.hits = 0; bot.duelT = 0;
      let lastE = 0, lastChange = 0, stuck = null; const waveT = [];
      for (let f = 0; f < maxT * 60; f++) {
        I.poll(1 / 60); G.update(1 / 60);
        if (G.Game.state !== 'play') break;
        const P = G.P; if (waveT.length <= P.wave) waveT[P.wave] = Math.round(P.time);
        if (P.levelEggs !== lastE) { lastE = P.levelEggs; lastChange = P.time; }
        if (P.time - lastChange > 90 && !P.nestOpen) { stuck = { pos: [P.heroes[0].x | 0, P.heroes[0].y | 0], tgt: bot.tgt, wave: P.wave, left: P.eggs.filter(e => e.req).length }; break; }
      }
      const P = G.P; return { duelT: Math.round(bot.duelT || 0), duelOver: !!(P.duel && P.duel.over), medals: (G.Game.results[i] || {}).med, level: i, state: G.Game.state, time: Math.round(P.time), eggs: P.levelEggs, total: P.L.totalEggs, waveT, hits: bot.hits, stuck, found: P.found[0], q: P.q, leo: [P.heroes[1].x | 0, P.heroes[1].y | 0] };
    };
  }, require('./pw.js').game);
  console.log('joc:', require('./pw.js').game);
  const bad = [];
  for (let i = 0; i < 6; i++) {
    const r = await page.evaluate((i) => runLevel(i, 900), i);
    console.log(JSON.stringify(r));
    // the level really ended, the bot did not get stuck, and alone the hero reached his own quota (T14.10)
    if (r.state !== 'levelEnd' || r.stuck || (r.q && r.found < r.q)) bad.push(i + 1);
  }
  console.log(bad.length ? 'NEREUSIT: nivelurile ' + bad.join(', ') + ' nu s-au terminat' : 'nivele-bot-mers OK (' + require('./pw.js').game + ')');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
