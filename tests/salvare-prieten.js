// Regula noua, in ambele jocuri: un erou lovit nu mai poate merge pana cand prietenul vine si apasa pe patrat (□).
// Primul erou (Bubu, Boon) trebuie sa vina aproape. Al doilea (Leo, Killer) poate sta departe: trimite o minge magica.
// In "Cea mai grea luptă" eroul lovit se face mic si creste la loc cand e ajutat. Jocul: variabila JOC (bubu sau lupta).
const boot = require('./common.js');
(async () => {
  const { page, shot, done, game } = await boot();
  const res = await page.evaluate(() => {
    const G = __game, C = G.CONFIG, R = C.rescue, lup = G.GAME === 'lupta', out = {};
    const calm = () => { const L = G.P.L; for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0; if (L.birds) L.birds.length = 0; };
    const place = (far) => { const P = G.P, a = P.heroes[0], b = P.heroes[1]; a.x = P.L.spawn.x + 200; a.y = P.L.spawn.y; b.x = a.x + far; b.y = a.y; for (const h of P.heroes) { h.vx = h.vy = 0; h.inv = 0; h.dizzy = 0; h.down = false; } inp[0] = { x: 0, y: 0 }; inp[1] = { x: 0, y: 0 }; step(2); };
    go(0); calm(); let P = G.P, a = P.heroes[0], b = P.heroes[1];
    // 1. hit: the hero is down, loses one egg, cannot walk
    // a hit drops only what was gathered in this chapter, so the test gives the chapter 5 crystals first
    place(800); G.Game.team.eggs = 5; G.P.levelEggs = 5; const eggs0 = G.Game.team.eggs; G.hitHero(a, a.x - 60, a.y); step(40);
    out['lovit: asteapta ajutor'] = a.down === true;
    out['lovit: scapa un ou'] = eggs0 - G.Game.team.eggs;
    const x0 = a.x; inp[0] = { x: 1, y: 0 }; step(120); inp[0] = { x: 0, y: 0 };
    out['cat asteapta: pixeli parcursi cu stickul impins'] = Math.round(Math.abs(a.x - x0));
    out['cat asteapta: marimea eroului'] = +a.small.toFixed(2);
    step(60 * 12); out['dupa 12 secunde tot asteapta (nu se ridica singur)'] = a.down === true;
    const hits0 = P.hits; a.inv = 0; G.hitHero(a, a.x - 60, a.y); out['nu poate fi lovit din nou cat asteapta'] = P.hits === hits0;
    // 2. the second hero helps from far away, but not from too far
    inp[1].bP = true; step(3); out['al doilea erou, prea departe (800): nu merge'] = a.down === true && P.heal.length === 0;
    b.x = a.x + R.reachFar - 80; step(2); inp[1].bP = true; step(2); out['al doilea erou, la ' + (R.reachFar - 80) + ': pleaca mingea magica'] = P.heal.length === 1;
    let n = 0; while (a.down && n < 200) { step(1); n++; }
    out['mingea ajunge: eroul se ridica'] = a.down === false && P.rescues === 1; out['mingea: cadre pana ajunge'] = n;
    out['dupa ajutor e ferit o vreme'] = a.inv > 1;
    step(30); out['dupa ajutor: marimea eroului'] = +a.small.toFixed(2);
    inp[0] = { x: 1, y: 0 }; const x1 = a.x; step(60); inp[0] = { x: 0, y: 0 }; out['dupa ajutor merge din nou (pixeli)'] = Math.round(a.x - x1);
    // 3. the first hero must come close
    place(400); G.hitHero(b, b.x + 60, b.y); step(40);
    out['al doilea erou lovit: asteapta'] = b.down === true;
    inp[0].bP = true; step(3); out['primul erou, la 400: prea departe'] = b.down === true;
    out['primul erou: apare semnul "vino mai aproape"'] = a.reachHint > 0;
    a.x = b.x - (R.reachNear - 30); step(2); inp[0].bP = true; step(3);
    out['primul erou, la ' + (R.reachNear - 30) + ': il ridica pe loc'] = b.down === false && P.rescues === 2 && a.hugT > 0;
    // 4. both down: they get up alone after a short while
    place(300); G.hitHero(a, a.x - 60, a.y); G.hitHero(b, b.x + 60, b.y); step(30);
    out['amandoi loviti: amandoi asteapta'] = a.down && b.down;
    step(Math.round(R.bothDown * 60) + 30); out['amandoi loviti: dupa ' + R.bothDown + ' s se ridica singuri'] = !a.down && !b.down && P.rescues === 2;
    // 5. a player alone never waits
    joined = [true, false]; place(300); G.hitHero(a, a.x - 60, a.y); step(20);
    out['un singur jucator: nu asteapta pe nimeni'] = a.down === false && a.dizzy > 0;
    joined = [true, true];
    // 6. during a mini-fight the guardian rests while a hero waits
    go(0); calm(); P = G.P; a = P.heroes[0]; b = P.heroes[1];
    P.eggs.length = 0; P.wave = P.L.NW - 1; for (const t of P.L.trees) if (t.spark) t.spark.done = true;
    a.x = P.L.nest.x - 600; a.y = P.L.nest.y + 100; b.x = P.L.nest.x - 900; b.y = P.L.nest.y + 100; step(3); G.startDuel('nest');
    const d = P.duel; n = 0; while (d.state !== 'move' && n < 400) { step(1); n++; }
    b.inv = 0; G.hitHero(b, b.x + 60, b.y); step(5);
    const seen = {}; for (let i = 0; i < 60 * 8; i++) { step(1); seen[d.state] = 1; }
    out['lupta: paznicul asteapta cat un erou e lovit'] = Object.keys(seen).join() === 'move';
    const hp0 = d.hp; G.kickBall(b, 0, 1, 0); d.state = 'move'; out['lupta: paznicul nu poate fi lovit in acest timp'] = duelCanHurt(0, 'stomp') === false && d.hp === hp0;
    a.x = b.x - 100; a.y = b.y; step(2); inp[0].bP = true; step(3);
    for (let i = 0; i < 60 * 6; i++) { step(1); seen[d.state] = 1; }
    out['lupta: dupa ajutor paznicul ataca din nou'] = Object.keys(seen).length > 1;
    out.shrink = C.lupta.shrink; out.lup = lup;
    return out;
  });
  const want = {
    'lovit: asteapta ajutor': true, 'lovit: scapa un ou': 1, 'dupa 12 secunde tot asteapta (nu se ridica singur)': true, 'nu poate fi lovit din nou cat asteapta': true,
    'al doilea erou, prea departe (800): nu merge': true, 'mingea ajunge: eroul se ridica': true, 'dupa ajutor e ferit o vreme': true,
    'al doilea erou lovit: asteapta': true, 'primul erou, la 400: prea departe': true, 'primul erou: apare semnul "vino mai aproape"': true,
    'amandoi loviti: amandoi asteapta': true, 'un singur jucator: nu asteapta pe nimeni': true,
    'lupta: paznicul asteapta cat un erou e lovit': true, 'lupta: paznicul nu poate fi lovit in acest timp': true, 'lupta: dupa ajutor paznicul ataca din nou': true
  };
  const bad = [];
  for (const [k, v] of Object.entries(res)) {
    if (k === 'shrink' || k === 'lup') continue;
    let ok = true;
    if (k in want) ok = v === want[k];
    else if (k.startsWith('cat asteapta: pixeli')) ok = v < 8;
    else if (k === 'cat asteapta: marimea eroului') ok = res.lup ? Math.abs(v - res.shrink) < 0.05 : v === 1;      // doar in al doilea joc se face mic
    else if (k === 'dupa ajutor: marimea eroului') ok = v > 0.95;
    else if (k === 'dupa ajutor merge din nou (pixeli)') ok = v > 100;
    else if (typeof v === 'boolean') ok = v === true;
    console.log((ok ? 'ok   ' : 'GRESIT ') + k.padEnd(62) + JSON.stringify(v)); if (!ok) bad.push(k);
  }
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'salvare-prieten OK (' + game + ')');
  await done();
})();
