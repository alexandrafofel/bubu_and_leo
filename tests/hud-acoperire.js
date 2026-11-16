// Cat de des acopera scrisul de sus (HUD-ul si bannerele) un erou? Jocul: variabila JOC (bubu sau lupta).
// Pentru fiecare nivel, eroii sunt asezati in doua feluri, camera e pusa cum o pune jocul (updatePlay) si se verifica
// daca dreptunghiul unui erou pe ecran (corp si nume) atinge un cartonas:
//   1. amandoi in aceeasi celula, pentru fiecare celula libera;
//   2. 400 de perechi de celule alese la intamplare (eroi departe unul de altul).
// Scrie procentul de asezari in care macar un erou e acoperit de: HUD, un banner obisnuit, bannerul de lupta.
// Acum (16 noiembrie 2026) testul doar masoara: bug-ul exista. Dupa repararea din docs/24-sisteme-noi.md, S6,
// toate procentele trebuie sa fie 0: ruleaza-l cu STRICT=1 si adauga-l in tests/toate.sh.
// Dreptunghiurile de mai jos sunt cele din drawHUD de acum. Dupa reparare, testul citeste din joc inaltimea benzii de sus
// (__game.HUD_TOP) si regula camerei (__game.camTarget), ca sa masoare exact ce face jocul.
const { chromium, chrome, url, game } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(url); await page.waitForTimeout(600); await page.mouse.click(900, 500); await page.waitForTimeout(600);
  const rows = await page.evaluate((game) => {
    const G = __game, W = 1920, H = 1080, out = [];
    G.setGame(game);
    const top = G.HUD_TOP || 0;         // after the fix the game says how tall the top band is
    const R = top ? { hud: [[0, 0, W, top]], banner: [[0, 0, W, top]], duel: [[0, 0, W, top]] }
      : { hud: [[36, 28, 376, 140], [W - 376, 28, W - 36, 140], [W / 2 - 330, 24, W / 2 + 330, 144], [W / 2 - 520, 152, W / 2 + 520, 218]],
          banner: [[W / 2 - 330, 250, W / 2 + 330, 362]], duel: [[W / 2 - 480, 244, W / 2 + 480, 420]] };
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const hit = (Q, b) => Q.some(q => b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1]);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const n = G.CONFIG.levels;
    for (let idx = 0; idx < n; idx++) {
      const L = G.buildLevel(idx), CS = L.W / L.cols, cells = [];
      for (let cy = 0; cy < L.rows; cy++) for (let cx = 0; cx < L.cols; cx++) if (L.grid[cy * L.cols + cx] < 2 && (cy + 0.5) * CS > L.top) cells.push([(cx + 0.5) * CS, (cy + 0.5) * CS]);
      // where the game puts the camera for two heroes at a and b (the settled values of updatePlay), and each hero's box on the screen
      const boxes = (a, b) => {
        let z, cx, cy;
        if (G.camTarget) { const t = G.camTarget(L, { x: a[0], y: a[1] }, { x: b[0], y: b[1] }); z = t.zoom; cx = t.x; cy = t.y; }      // after the fix: the game's own camera rule
        else { z = clamp(Math.min(1, W / (Math.abs(a[0] - b[0]) + 760), H / (Math.abs(a[1] - b[1]) + 560)), L.minZoom, 1); const vw = W / z, vh = H / z;
          cx = clamp((a[0] + b[0]) / 2, vw / 2, L.W - vw / 2); cy = clamp((a[1] + b[1]) / 2 - 30, vh / 2, L.H - vh / 2); }
        return [a, b].map(p => { const sx = (p[0] - cx) * z + W / 2, sy = (p[1] - cy) * z + H / 2; return [sx - 55 * z, sy - 190 * z, sx + 55 * z, sy]; });
      };
      const count = pairs => { const c = { hud: 0, banner: 0, duel: 0 }; for (const [a, b] of pairs) { const bx = boxes(a, b); for (const k in c) if (bx.some(q => hit(R[k], q))) c[k]++; } for (const k in c) c[k] = +(c[k] / pairs.length * 100).toFixed(1); return c; };
      const far = []; for (let i = 0; i < 400; i++) far.push([cells[rnd() * cells.length | 0], cells[rnd() * cells.length | 0]]);
      out.push({ level: idx + 1, cells: cells.length, together: count(cells.map(p => [p, p])), apart: count(far) });
    }
    return out;
  }, game);
  let worst = 0;
  console.log('joc ' + game + '. Procent din asezari in care un erou e acoperit de: HUD / banner / bannerul de lupta');
  for (const r of rows) {
    console.log('nivelul ' + r.level + ' | impreuna: ' + r.together.hud + ' / ' + r.together.banner + ' / ' + r.together.duel + ' | departe: ' + r.apart.hud + ' / ' + r.apart.banner + ' / ' + r.apart.duel);
    worst = Math.max(worst, ...Object.values(r.together), ...Object.values(r.apart));
  }
  if (process.env.STRICT) console.log(worst === 0 ? 'hud-acoperire OK (' + game + ')' : 'NEREUSIT: un erou e acoperit in ' + worst + '% din asezari');
  else console.log('cel mai rau caz: ' + worst + '% (doar masuratoare; cu STRICT=1 trebuie sa fie 0)');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
