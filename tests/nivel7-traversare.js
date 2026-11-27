// Nivelul 7 (T7.4): cei doi eroi trec, cu controalele (nu mutati de mana), prin ambele porti pana la cuib.
// Fiecare merge dupa pasul lui din mechSteps (placa sau trecerea) pe drumul cel mai scurt prin grila.
// Inamicii, pasarile si George sunt opriti: aici se verifica harta si portile, nu luptele (acelea: T7.5).
// Scrie "nivel7-traversare OK" sau "NEREUSIT".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const r = await page.evaluate(() => {
    const G = __game; G.Game.diff[0] = G.Game.diff[1] = 'normal'; go(chIdx('level', 6)); step(5);
    const P = G.P, L = P.L, cols = L.cols, rows = L.rows; G.CONFIG.lupta.george.on = false;
    L.beetles.length = 0; L.cones.length = 0; if (L.birds) L.birds.length = 0; P.wind.power = 0;
    const field = (tx, ty) => {                      // distanta in celule pana la tinta, prin celulele pe care se poate merge acum
      const D = new Int32Array(cols * rows).fill(-1), q = [], s = L.ci(tx, ty); D[s] = 0; q.push(s);
      for (let h = 0; h < q.length; h++) { const i = q[h], x = i % cols, y = i / cols | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue; const j = ny * cols + nx;
          if (D[j] >= 0 || L.grid[j] >= 2 || (solidCell[j] && j !== s)) continue; D[j] = D[i] + 1; q.push(j); } }
      return D;
    };
    const solidCell = new Uint8Array(cols * rows);           // copacii si stancile nu sunt in grila: le punem aici
    for (const so of L.solids) for (let cy = (so.y - so.r - 30) / 40 | 0; cy <= (so.y + so.r + 30) / 40; cy++) for (let cx = (so.x - so.r - 30) / 40 | 0; cx <= (so.x + so.r + 30) / 40; cx++)
      if (cx >= 0 && cy >= 0 && cx < cols && cy < rows && dist((cx + 0.5) * 40, (cy + 0.5) * 40, so.x, so.y) < so.r + 26) solidCell[cy * cols + cx] = 1;
    const log = [], t0 = P.time; let fields = {};
    for (let f = 0; f < 60 * 240; f++) {
      P.wind.power = 0;
      const g = frontGate(L), st = g ? mechSteps(g) : [null, null];
      for (let k = 0; k < 2; k++) {
        const h = P.heroes[k], s = st[k] || { x: L.nest.x, y: L.nest.y };
        const key = Math.round(s.x) + ',' + Math.round(s.y) + ':' + (g ? g.state + g.solid : '');
        if (!fields[key]) fields = { [key]: field(s.x, s.y) };
        const D = fields[key], i = L.ci(h.x, h.y);
        let bx = s.x, by = s.y;
        if (D[i] > 1) { let best = D[i], bi = i; const x = i % cols, y = i / cols | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const j = (y + dy) * cols + x + dx; if (D[j] >= 0 && D[j] < best) { best = D[j]; bi = j; } }
          bx = (bi % cols + 0.5) * 40; by = ((bi / cols | 0) + 0.5) * 40; }
        const dx = bx - h.x, dy = by - h.y, m = Math.hypot(dx, dy);
        inp[k] = m < 14 ? { x: 0, y: 0 } : { x: dx / m, y: dy / m };
      }
      step(1);
      for (const gg of L.gates) if (!gg.logged && gg.state === 'fixed') { gg.logged = true; log.push('poarta ' + gg.band + ' trecuta la ' + Math.round(P.time - t0) + ' s'); }
      if (P.heroes.every(h => dist(h.x, h.y, L.nest.x, L.nest.y) < 260)) { log.push('amandoi la cuib la ' + Math.round(P.time - t0) + ' s'); break; }
    }
    inp[0] = inp[1] = { x: 0, y: 0 }; G.CONFIG.lupta.george.on = true;
    return { log, gates: L.gates.map(g => g.state), auto: L.gates.some(g => g.auto), atNest: P.heroes.map(h => Math.round(dist(h.x, h.y, L.nest.x, L.nest.y))) };
  });
  console.log(JSON.stringify(r));
  const ok = r.gates.every(s => s === 'fixed') && !r.auto && r.atNest.every(d => d < 260);
  console.log(ok ? 'nivel7-traversare OK' : 'NEREUSIT');
  await done();
})();
