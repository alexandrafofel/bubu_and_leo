// Capturi pentru placile si cusca stelutelor (T7.2): placa libera, placa apasata, cusca inchisa, o lovitura, deschisa.
// Se ruleaza din tests/out/ ca sa ramana acolo. Fara test de trecere: se privesc cu ochiul (fara negru, fara gri).
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  await page.evaluate(() => {
    const G = __game, orig = LEVEL_DEFS_L[0];
    LEVEL_DEFS_L[0] = Object.assign({}, orig, { bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'plates2' }], cage: true, lanes: [0, 0, 0], pond: false, stars: ['nook', 'nook', 'nook'], beetles: [0, 0, 0] });
    G.Game.diff[0] = G.Game.diff[1] = 'normal';
    go(0); step(3);
    const P = G.P, L = P.L; L.beetles.length = 0; L.cones.length = 0; if (L.birds) L.birds.length = 0; G.CONFIG.lupta.george.on = false;
    G.UI.introT = 0;
    window.__t72 = { P, L, a: P.heroes[0], b: P.heroes[1], cg: L.cage, tur: L.inputs[L.gates[0].inputs[0]] };
  });
  const shot = async name => { await page.screenshot({ path: name }); };
  // placa libera, o zona cu drumul
  await page.evaluate(() => { const T = window.__t72; T.a.x = T.L.spawn.x; T.a.y = T.L.spawn.y - 200; T.b.x = T.L.spawn.x + 120; T.b.y = T.L.spawn.y - 200; });
  await page.evaluate(() => { const T = window.__t72; T.cgFocus = { x: T.tur.x, y: T.tur.y }; });
  await step_(page, 30);
  await shot('p2_placa_libera.png');
  // placa apasata de Boon
  await page.evaluate(() => { const T = window.__t72; T.a.x = T.tur.x; T.a.y = T.tur.y; T.b.x = T.L.spawn.x; T.b.y = T.L.spawn.y - 200; });
  await step_(page, 40);
  await shot('p2_placa_apasata.png');
  // cusca inchisa, langa cuib; apoi un singur erou o loveste (se clatina, apar fetele)
  await page.evaluate(() => { const T = window.__t72; T.a.x = T.cg.x - 100; T.a.y = T.cg.y + 40; T.b.x = T.cg.x + 130; T.b.y = T.cg.y + 40; });
  await step_(page, 20);
  await shot('p2_cusca_inchisa.png');
  await page.evaluate(() => { const T = window.__t72; cageSwing(T.a, 7001); });
  await step_(page, 12);
  await shot('p2_cusca_clatinata.png');
  // amandoi: cusca deschisa
  await page.evaluate(() => { const T = window.__t72; cageSwing(T.b, 7002); });
  await step_(page, 40);
  await shot('p2_cusca_deschisa.png');
  console.log('capturi scrise: p2_placa_libera, p2_placa_apasata, p2_cusca_inchisa, p2_cusca_clatinata, p2_cusca_deschisa');
  await done();
})();
async function step_(page, n) { await page.evaluate(n => step(n), n); }
