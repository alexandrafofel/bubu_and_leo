// Capturi pentru nivelul 7, Canionul Podurilor de Lumină (T7.4): inceputul, poarta A cu podul, poarta B, lupta cu George,
// cusca si balansoarul. Se ruleaza din tests/out/. Se privesc cu ochiul (lista S7.8: fara negru, fara gri, planul din fata
// nu acopera eroii, nimic sub banda de sus).
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const ev = (f, a) => page.evaluate(f, a);
  const shot = async n => { await page.screenshot({ path: n }); console.log('captura', n); };
  await ev(() => { __game.Game.diff[0] = __game.Game.diff[1] = 'normal'; go(chIdx('level', 6)); step(30); });
  await ev(() => { const P = __game.P; P.L.beetles.forEach(b => { b.state = 'sleep'; }); if (P.L.birds) P.L.birds.forEach(b => { b.state = 'gone'; b.t = 999; }); __game.CONFIG.lupta.george.on = false; step(20); });
  await shot('p2_canyon_inceput.png');
  // poarta A: Boon pe placa, Killer la trecere: podul de lumina
  await ev(() => { const P = __game.P, L = P.L, A = L.gates[0], q = L.inputs[A.inputs[0]], a = P.heroes[0], b = P.heroes[1];
    a.x = q.x; a.y = q.y; b.x = A.x - A.w / 2 - 40; b.y = A.y; step(4); b.x = A.x - A.w / 2 - 40; b.y = A.y; step(24); });
  await shot('p2_canyon_poarta_a.png');
  // poarta B: amandoi pe placile lor
  await ev(() => { const P = __game.P, L = P.L, B = L.gates[1], a = P.heroes[0], b = P.heroes[1];
    L.gates[0].state = 'fixed'; const q0 = L.inputs[B.inputs.find(i => L.inputs[i].who === 0)], q1 = L.inputs[B.inputs.find(i => L.inputs[i].who === 1)];
    for (let f = 0; f < 40; f++) { a.x = q0.x; a.y = q0.y; b.x = q1.x; b.y = q1.y; step(1); } });
  await shot('p2_canyon_poarta_b.png');
  // balansoarul: cate un erou la fiecare capat
  await ev(() => { const P = __game.P, T = P.L.toy, a = P.heroes[0], b = P.heroes[1];
    for (let f = 0; f < 50; f++) { a.x = T.x - 120; a.y = T.y; b.x = T.x + 120; b.y = T.y; step(1); } });
  await shot('p2_canyon_balansoar.png');
  // cusca, langa cuib: deschisa de amandoi
  await ev(() => { const P = __game.P, L = P.L, cg = L.cage, a = P.heroes[0], b = P.heroes[1];
    L.gates[1].state = 'fixed'; a.x = cg.x - 100; a.y = cg.y + 40; b.x = cg.x + 120; b.y = cg.y + 50; step(30); cageSwing(a, 5001); step(10); cageSwing(b, 5002); step(30); });
  await shot('p2_canyon_cusca.png');
  // lupta cu George
  await ev(() => { const P = __game.P; __game.CONFIG.lupta.george.on = true; P.heroes.forEach(h => { h.x = P.L.W / 2; h.y = P.L.H / 2 + 200; h.inv = 99; }); startDuel('mid'); step(120); });
  await shot('p2_canyon_george.png');
  await done();
})();
