// A doua putere (T3): oasele-bumerang ale lui Boon si manusile-vartej ale lui Killer, pe butonul □.
// Verifica numarul de obiecte, o singura lovitura pe aruncare, scutul, cele trei vibratii, si ca cele doua puteri
// ale unui erou nu pot porni deodata. Scrie "puteri-doi OK" sau "NEREUSIT". Captura: p_doua-puteri.png
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };

  const r = await page.evaluate(() => {
    const G = __game, out = {};
    go(1); step(10); joined = [true, true];      // nivelul 2: are roboti (beetles) de lovit
    const P = G.P, boon = P.heroes[0], killer = P.heroes[1];
    const clear = () => { P.flock.length = 0; boon.homeState = killer.homeState = 'held'; boon.throwCd = killer.throwCd = 0; boon.cd = killer.cd = 0; boon.spinT = killer.spinT = -1; boon.charging = killer.charging = false; boon.dizzy = killer.dizzy = 0; boon.inv = 999; killer.inv = 999; inp[0] = { x: 0, y: 0 }; inp[1] = { x: 0, y: 0 }; };
    const angles = (own) => {
      const a = P.flock.filter(f => f.owner === own).map(f => Math.atan2(f.vy, f.vx)).sort((x, y) => x - y);
      const gaps = a.slice(1).map((v, i) => v - a[i]); gaps.push(a[0] + 2 * Math.PI - a[a.length - 1]);
      return Math.round(Math.max(...gaps) / (2 * Math.PI / a.length) * 100) / 100;      // 1.00 = la distante egale
    };

    // 1. Boon, □ scurt: 8 oase. □ tinut: 12.
    clear();
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0 }; step(4);
    out.tapN = P.flock.filter(f => f.owner === 0).length;
    out.tapLook = P.flock.every(f => f.owner !== 0 || f.look === 'bone');
    out.tapUnghiuri = angles(0);
    out.tapHome = boon.homeState;
    clear();
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0, c: true }; step(60); inp[0] = { x: 1, y: 0 }; step(4);
    out.holdN = P.flock.filter(f => f.owner === 0).length;

    // 2. a doua apasare cat zboara: oasele lui se intorc, mingile lui Killer nu
    clear();
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0 }; step(10);
    inp[1] = { x: -1, y: 0, aP: true, a: true }; step(2); inp[1] = { x: -1, y: 0 }; step(10);
    out.douaFeluri = [P.flock.filter(f => f.owner === 0).length, P.flock.filter(f => f.owner === 1).length];
    boon.throwCd = 0.5;
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0 }; step(2);
    out.oaseIntorc = P.flock.filter(f => f.owner === 0).every(f => f.state === 'return');
    out.mingiRaman = P.flock.filter(f => f.owner === 1).some(f => f.state === 'fly');

    // 3. un os loveste un robot: o inima mai putin, si cele 8 oase ale aceleiasi aruncari tot una
    clear();
    const L = P.L; for (const q of L.beetles) q.cool = 999;
    out.roboti = L.beetles.length;
    const bt = L.beetles[0]; bt.state = 'sleep'; bt.hp = G.CONFIG.smallEnemy.hits; bt.x = boon.x + 150; bt.y = boon.y;
    const hp0 = bt.hp;
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0 }; step(30);
    out.robotHp = [hp0, bt.hp];

    // 4. un os culege un cristal: creste totalul si culesul e trecut pe Boon
    clear();
    P.eggs.length = 0; P.combo = 0;
    const e0 = G.P.levelEggs;
    P.eggs.push(G.makeEgg(boon.x + 120, boon.y, { req: false }));
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0 }; step(20);
    out.cristal = [e0, G.P.levelEggs];

    // 5. Killer, □: scut 0.85 s, robotul de langa pierde o inima, cristalele vin spre el
    clear();
    const bt2 = L.beetles[1] || L.beetles[0]; bt2.state = 'sleep'; bt2.hp = G.CONFIG.smallEnemy.hits; bt2.x = killer.x + 120; bt2.y = killer.y;
    P.eggs.length = 0; P.eggs.push(G.makeEgg(killer.x + 260, killer.y, { req: false }));
    const bHp0 = bt2.hp;
    inp[1] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[1] = { x: 1, y: 0 }; step(6);
    out.scutLaInceput = killer.shield;
    out.spinLook = killer.spinLook;
    const pulled = P.eggs[0] && !!P.eggs[0].pull;
    step(10);
    out.robot2 = [bHp0, bt2.hp];
    out.cristalTras = pulled;
    killer.inv = 0; const before = killer.dizzy;
    G.hitHero(killer, killer.x + 50, killer.y);
    out.nuEsteLovit = [before, killer.dizzy, killer.down];
    step(Math.round(0.9 * 60));
    out.scutDupa = killer.shield;
    killer.inv = 999; killer.dizzy = 0; killer.down = false;

    // 7. cele doua puteri nu pornesc deodata
    clear();
    inp[1] = { x: 1, y: 0, cP: true, c: true }; step(4); inp[1] = { x: 1, y: 0, c: true, aP: true, a: true }; step(4);
    out.sutInRotire = P.flock.filter(f => f.owner === 1).length;
    out.rotireTine = killer.spinT >= 0;
    clear();
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(10);            // Boon incarca oasele
    out.incarca = boon.charging;
    inp[0] = { x: 1, y: 0, c: true, aP: true, a: true }; step(4);
    out.ghearePeste = boon.spinT >= 0;
    clear();

    // 8. un erou fara a doua putere: □ nu face nimic
    const keep = G.CONFIG.heroes[1].power2; G.CONFIG.heroes[1].power2 = null;
    inp[1] = { x: 1, y: 0, cP: true, c: true }; step(6); inp[1] = { x: 0, y: 0 }; step(2);
    out.faraPower2 = [P.flock.filter(f => f.owner === 1).length, killer.spinT >= 0];
    G.CONFIG.heroes[1].power2 = keep;
    clear();
    return out;
  });
  console.log(JSON.stringify(r));
  check('1a. Boon, □ scurt: 8 oase', r.tapN === 8, { n: r.tapN });
  check('1b. toate sunt oase (look: bone), la distante egale, iar Boon ramane fara os in mana', r.tapLook && r.tapUnghiuri === 1 && r.tapHome === 'away', { look: r.tapLook, unghiuri: r.tapUnghiuri, acasa: r.tapHome });
  check('1c. Boon, □ tinut o secunda: 12 oase', r.holdN === 12, { n: r.holdN });
  check('2. a doua apasare: oasele lui Boon se intorc, mingile lui Killer raman in aer', r.oaseIntorc && r.mingiRaman, { douaFeluri: r.douaFeluri, oase: r.oaseIntorc, mingi: r.mingiRaman });
  check('3. o aruncare de oase ia robotului o singura inima', r.robotHp[1] === r.robotHp[0] - 1, { inimi: r.robotHp });
  check('4. un os culege un cristal', r.cristal[1] === r.cristal[0] + 1, { cristale: r.cristal });
  check('5a. Killer, □: manusile se invart si il apara', r.scutLaInceput === true && r.spinLook === 'gloves', { scut: r.scutLaInceput, fel: r.spinLook });
  check('5b. robotul de langa el pierde o inima', r.robot2[1] === r.robot2[0] - 1, { inimi: r.robot2 });
  check('5c. cristalele din jur vin spre el', r.cristalTras === true);
  check('5d. un atac nu il loveste cat se invarte', r.nuEsteLovit[1] === r.nuEsteLovit[0] && r.nuEsteLovit[2] === false, { dizzy: r.nuEsteLovit });
  check('5e. dupa 0.85 s scutul se termina', r.scutDupa === false);
  check('7a. cat Killer se invarte, ✕ nu porneste un sut', r.sutInRotire === 0 && r.rotireTine === true, { mingi: r.sutInRotire });
  check('7b. cat Boon incarca oasele, ✕ nu porneste ghearele', r.incarca === true && r.ghearePeste === false, { incarca: r.incarca, gheare: r.ghearePeste });
  check('8. un erou fara a doua putere: □ nu face nimic', r.faraPower2[0] === 0 && r.faraPower2[1] === false, { rezultat: r.faraPower2 });

  // 6. cele trei vibratii ale manusilor, pe controllerul lui Killer
  const rum = await page.evaluate(() => {
    const G = __game, P = G.P, killer = P.heroes[1], orig = G.Input.rumble;
    const seen = [];
    G.Input.rumble = function (k, s, w, ms) { if (k === 1) seen.push(Math.round(G.P.time * 1000) / 1000); return orig.apply(this, arguments); };
    P.flock.length = 0; killer.homeState = 'held'; killer.cd = 0; killer.spinT = -1; killer.dizzy = 0; killer.inv = 999;
    inp[1] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[1] = { x: 1, y: 0, c: true }; step(60);
    inp[1] = { x: 0, y: 0 };
    G.Input.rumble = orig;
    const gaps = seen.slice(1).map((v, i) => Math.round((v - seen[i]) * 1000) / 1000);
    return { n: seen.length, gaps };
  });
  check('6. manusile: trei vibratii pe controllerul lui Killer, la cel putin 0.2 s una de alta', rum.n === 3 && rum.gaps.every(g => g >= 0.2), rum);

  // 9. captura cu amandoua puterile noi pornite deodata
  await page.evaluate(() => {
    const G = __game, P = G.P, boon = P.heroes[0], killer = P.heroes[1];
    P.flock.length = 0; boon.homeState = 'held'; boon.throwCd = 0; boon.cd = 0; boon.spinT = -1; boon.charging = false;
    killer.cd = 0; killer.spinT = -1; killer.homeState = 'held';
    killer.x = boon.x + 420; killer.y = boon.y;
    inp[0] = { x: 1, y: 0, cP: true, c: true }; step(2); inp[0] = { x: 1, y: 0 }; step(16);     // oasele pleaca
    inp[1] = { x: -1, y: 0, cP: true, c: true }; step(2); inp[1] = { x: -1, y: 0, c: true }; step(14);   // manusile se invart
    G.draw(0.016);
  });
  await shot('p_doua-puteri');

  if (bad.length) console.log('NEREUSIT: ' + bad.join(' | ')); else console.log('puteri-doi OK');
  await done();
})();
