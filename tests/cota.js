// Cota de oua / cristale (docs/27-cota-de-oua.md, C10): fiecare erou trebuie sa gaseasca q, cel mult cap = ceil(1.5 q),
// L1 da un ou prietenului, nivelul se termina doar cand amandoi sunt in cuib si amandoi au q.
// Rezultat: "ok" sau "GRESIT" pe verificare, apoi "cota OK" sau "NEREUSIT: ...".
// MUTA=<n> strica regula verificarii n (pentru a dovedi ca verificarea poate pica): vezi tests/cota-pica.sh si docs/17-testare.md.
// Verificarile 15 si 16 din C10 sunt facute de joc-complet-bot.js, nivele-bot-mers.js si toate.sh (nu aici).
const { execFileSync } = require('child_process');
const { chromium, chrome, url, game } = require('./pw.js');
const MUTA = +process.env.MUTA || 0;

(async () => {
  // two fake controllers (button 4 = L1), as in controller-simulat.js
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + e.stack));
  await page.addInitScript(() => {
    window.fakePads = [null, null, null, null];
    window.mkPad = (i) => ({ index: i, id: 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)', connected: true, mapping: 'standard', axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0 })), vibrationActuator: { playEffect: () => Promise.resolve('complete') } });
    navigator.getGamepads = () => fakePads;
  });
  await page.goto(url); await page.waitForTimeout(800);
  await page.mouse.click(900, 500); await page.waitForTimeout(300);
  await page.evaluate(([game, MUTA]) => {
    const G = __game, I = G.Input, orig = I.poll; window.inp = [{}, {}]; window.joined = [true, true];
    I.poll = function (dt) { orig(dt); const S = I.slots; for (let k = 0; k < 2; k++) { const s = S[k], b = inp[k]; s.joined = joined[k]; if (b.x != null) { s.x = b.x; s.y = b.y; } if (b.aP) { s.aP = true; b.aP = false; } if (b.hP || b.bP) { s.hP = true; b.hP = false; b.bP = false; } if (b.gP) { s.gP = true; b.gP = false; } } };
    window.step = (n) => { for (let i = 0; i < n; i++) { I.poll(1 / 60); G.update(1 / 60); } G.draw(); };
    step(2); G.setGame(game); G.Game.toTitle(); step(2);
    window.go = (i) => { G.Game.team = { eggs: 12 * i, stars: i }; G.Game.goLevel(i); step(5); G.UI.introT = 2; inp[0].aP = true; step(3); };
    window.G = G;
    // a quiet level 1 with the two heroes close together; nothing hurts them
    window.fresh = (idx) => {
      joined = [true, true]; go(idx || 0); const P = G.P, L = P.L;
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0; if (L.birds) L.birds.length = 0;
      P.heroes[1].x = P.heroes[0].x + 120; P.heroes[1].y = P.heroes[0].y;
      for (const h of P.heroes) { h.vx = h.vy = 0; h.dizzy = 0; h.down = false; h.inv = 0; } P.midFought = P.nestFought = true; step(3);      // T15: George stays away, these checks are about the quota
      return P;
    };
    window.inNest = () => { const P = G.P, L = P.L; P.heroes[0].x = L.nest.x - 30; P.heroes[1].x = L.nest.x + 30; P.heroes[0].y = P.heroes[1].y = L.nest.y; for (const h of P.heroes) { h.vx = h.vy = 0; h.dizzy = 0; h.down = false; } };
    window.noEggs = () => { const P = G.P, L = P.L; P.eggs.length = 0; P.wave = L.NW - 1; for (const t of L.trees) if (t.spark) t.spark.done = true; };
    window.openNestNow = () => { const P = G.P; noEggs(); P.nestOpen = true; P.nestOpenT = 20; P.done = false; };
    window.pad = (k, on) => { if (on && !fakePads[k]) { fakePads[k] = mkPad(k); I.slots[k].pad = k; G.Opt.ctrl[k] = 'pad'; } };
    window.btn = (k, b, on) => { fakePads[k].buttons[b].pressed = on; };
    // the rules to break, for MUTA (each one makes one check fail)
    if (MUTA) {
      const real = { hit: window.hitHero, wb: window.waitBanner };
      if (MUTA === 1) G.CONFIG.quota.perLevel = null;
      if (MUTA === 2) window.quotaOk = () => true;
      if (MUTA === 3) { const real = window.collectEgg; window.collectEgg = (e, k) => { if (e.goal && G.P.found[k] >= G.P.q) return; real(e, k); }; }      // brings the old upper limit back
      if (MUTA === 4) window.giveEgg = () => false;
      if (MUTA === 5) G.CONFIG.quota.giveRange = 1e9;
      if (MUTA === 6) window.quotaOk = () => false;
      if (MUTA === 7) window.quotaState = (k) => ({ found: G.P.found[k], q: G.P.q, ok: G.P.found[k] < G.P.q, extra: 0 });
      if (MUTA === 8) window.updateQuotaMsg = () => {};
      if (MUTA === 9) window.bothJoined = () => true;
      if (MUTA === 10) window.hitHero = (h, sx, sy) => { const f = G.P.found.slice(); real.hit(h, sx, sy); G.P.found = f; };
      if (MUTA === 11) window.updateJoinQuota = () => {};
      if (MUTA === 12) { const mk = window.makeEgg; window.makeEgg = (x, y, o) => { const e = mk(x, y, o); e.goal = true; return e; }; }
      if (MUTA === 13) G.CONFIG.quota.autoGive = 0;
    }
  }, [game, MUTA]);
  await page.evaluate(() => { __game.CONFIG.quota.autoGive = 120; });   // (check 13 changes it on purpose)

  const out = [], ok = (n, label, v, extra) => { out.push([n, label, !!v, extra]); };

  // ---------- 1. the egg count of every level fits the quota ----------
  const r1 = await page.evaluate(() => {
    const G = __game, C = G.CONFIG.quota, res = [];
    for (let n = 0; n < G.CONFIG.levels; n++) {
      const q = C.perLevel && C.perLevel[n]; let bad = 0, made = 0;
      for (let s = 0; s < 10; s++) { const L = G.genLevel(n, 1000 + n * 97 + s * 13); if (!L) continue; made++; if (L.totalEggs < 2 * q) bad++; }
      const B = G.buildLevel(n);
      res.push({ n, q, made, bad, built: !!B && B.totalEggs >= 2 * q, L_q: B && B.q });
    }
    return res;
  });
  ok(1, 'cota e 15 pe fiecare nivel si sunt destule diamante (10 seminte): oua >= 2q', r1.every(r => r.q === 15 && r.made >= 1 && r.bad === 0 && r.built && r.L_q === r.q), JSON.stringify(r1.map(r => [r.n + 1, r.q, r.made, r.bad])));

  // ---------- 2. the example: one hero 5 over the quota, the other 3 short, both in the nest ----------
  const r2 = await page.evaluate(() => {
    const P = fresh(0), G = window.G, o = {};
    P.found = [P.q + 5, P.q - 3]; openNestNow(); inNest(); step(60 * 4);
    const bn = G.waitBanner();
    o.notDone = P.done === false; o.banner = bn && bn.kind === 'need' && bn.name === G.CONFIG.heroes[1].name && bn.n === 3; o.bn = bn;
    return o;
  });
  ok(2, 'cota q, un erou q + 5 si altul q - 3, amandoi in cuib: nu se termina, bannerul "mai are nevoie de 3" pentru al doilea', r2.notDone && r2.banner, JSON.stringify(r2.bn));

  // ---------- 3. no upper limit (T15): a hero over his quota still takes diamonds, by hand, by the pull and by the ball ----------
  const r3 = await page.evaluate(() => {
    const P = fresh(0), G = window.G, a = P.heroes[0], b = P.heroes[1], o = {}, over = P.q + 5;
    P.found = [over, 0]; b.x = a.x + 900; b.y = a.y;
    const e = window.makeEgg(a.x + 8, a.y, { state: 'idle' }); P.eggs.push(e); step(30);
    o.hand = !P.eggs.includes(e) && P.found[0] === over + 1; o.noBalloon = !('fullT' in a);
    const e2 = window.makeEgg(a.x + 40, a.y + 30, { state: 'idle' }); P.eggs.push(e2);
    P.flock.push(G.newBall(e2.x, e2.y, 0, 0, 1, 2, false, 1, 0, 0, 'ball')); step(10);
    o.ball = !P.eggs.includes(e2) && P.found[0] === over + 2;
    o.extra = G.quotaState(0).extra === 7 && G.quotaState(0).ok === true;
    P.flock.length = 0; return o;
  });
  ok(3, 'nu exista limita: un erou peste cota ia diamante cu mana si cu mingea, extra se numara, nu apare "Plin!"', r3.hand && r3.noBalloon && r3.ball && r3.extra, JSON.stringify(r3));

  // ---------- 4. L1 (controller, held, keyboard) ----------
  await page.evaluate(() => { fresh(0); pad(0, true); pad(1, true); });
  await page.evaluate(() => { const P = G.P; P.found = [8, 2]; btn(0, 4, true); step(1); btn(0, 4, false); step(10); });
  const r4a = await page.evaluate(() => { const P = G.P; const mid = P.gifts.length; step(40); return { mid, found: P.found.slice() }; });
  await page.evaluate(() => { const P = G.P; P.found = [3, 0]; step(30); btn(0, 4, true); step(60 * 2); btn(0, 4, false); step(60); });
  const r4b = await page.evaluate(() => { const P = G.P; return { found: P.found.slice() }; });
  ok(4, 'L1 (butonul 4, controller fals): da un diamant care ajunge dupa 0.45 s; tinut apasat da mai multe si se opreste cand nu mai are ce da',
    r4a.mid === 1 && r4a.found[0] === 7 && r4a.found[1] === 3 && r4b.found[0] === 0 && r4b.found[1] === 3, JSON.stringify([r4a, r4b]));
  // the keyboard: key R (player 1), as set in CONFIG.keys
  await page.evaluate(() => { fresh(0); G.Opt.ctrl[0] = 'kb'; G.Input.slots[0].pad = null; fakePads[0] = null; G.Input.slots[0].joined = true; G.P.found = [6, 1]; step(2); });
  await page.keyboard.down('KeyR'); await page.evaluate(() => step(4)); await page.keyboard.up('KeyR');
  const r4k = await page.evaluate(() => { step(60); return G.P.found.slice(); });
  ok(4, 'L1 cu tastatura (tasta R): da un ou', r4k[0] === 5 && r4k[1] === 2, JSON.stringify(r4k));

  // ---------- 5. too far: nothing leaves; nothing to give: nothing leaves and the number shakes ----------
  const r5 = await page.evaluate(() => {
    const P = fresh(0), a = P.heroes[0], b = P.heroes[1], o = {};
    P.found = [5, 2]; b.x = a.x + 900; b.y = a.y; inp[0].gP = true; step(2);
    o.farNothing = P.gifts.length === 0 && P.found[0] === 5; o.farHint = a.tooFarT > 0 && a.reachHint > 0;
    b.x = a.x + 100; P.found = [0, 2]; step(40); inp[0].gP = true; step(2);
    o.noneNothing = P.gifts.length === 0 && P.found[1] === 2; o.shake = a.noT > 0;
    return o;
  });
  ok(5, 'L1 prea departe nu da nimic (balon "Apropie-te"); fara oua nu da nimic si numarul se clatina', r5.farNothing && r5.farHint && r5.noneNothing && r5.shake, JSON.stringify(r5));

  // ---------- 6. q / q each: the level ends within 4 seconds of both being in the nest ----------
  const r6 = await page.evaluate(() => {
    const P = fresh(0); P.found = [P.q, P.q]; openNestNow(); inNest(); let t = 0;
    while (!P.done && t < 60 * 4) { step(1); inNest(); t++; }
    return { done: P.done, secs: +(t / 60).toFixed(2) };
  });
  ok(6, 'amandoi cu cota intreaga: nivelul se termina in cel mult 4 secunde de la intrarea ambilor in cuib', r6.done && r6.secs <= 4, JSON.stringify(r6));

  // ---------- 7. the colors of the number, read from the picture ----------
  const readBadge = (k) => page.evaluate((k) => {
    const cv = document.querySelector('canvas'), c2 = cv.getContext('2d'), sx = cv.width / 1920, sy = cv.height / 1080;
    const bx = k === 0 ? 28 : 1920 - 28 - 300, by = 16;
    const grab = (x, y, w, h) => c2.getImageData(Math.round(x * sx), Math.round(y * sy), Math.round(w * sx), Math.round(h * sy)).data;
    const near = (d, r, g, b, tol) => { let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b) < tol) n++; return n; };
    const hue = (d, f) => { let n = 0; for (let i = 0; i < d.length; i += 4) if (f(d[i], d[i + 1], d[i + 2])) n++; return n; };   // by hue: the paper texture darkens the paint a little
    const num = grab(bx + 138, by + 58, 124, 42), tick = grab(bx + 276 - 14, by + 78 - 14, 28, 28);
    return { green: hue(num, (r, g, b) => g > r + 30 && g > b + 15), red: hue(num, (r, g, b) => r > g + 60 && r > b + 60 && r > 110), tick: hue(tick, (r, g, b) => g > r + 30 && g > b + 15) };
  }, k);
  await page.evaluate(() => { const P = fresh(0); P.found = [P.q, 4]; P.quotaMsg = [true, true]; for (const h of P.heroes) { h.numT = 0; h.noT = 0; } P.time = 1.5; step(1); });
  const c7a = await readBadge(0), c7b = await readBadge(1);
  ok(7, 'insigna: numarul e verde cand found >= q, rosu cand nu; bifa doar cand e gata (citit din captura)',
    c7a.green > 40 && c7a.red < 8 && c7a.tick > 25 && c7b.red > 40 && c7b.green < 8 && c7b.tick < 8, JSON.stringify([c7a, c7b]));

  // ---------- 8. "You found them all": once, only when the friend lacks, with the friend's name and the button; not when both finish together ----------
  const msg8 = (lang, ctrl) => page.evaluate(([lang, ctrl]) => {
    const P = fresh(0), o = {}; G.Opt.lang = lang; G.Opt.ctrl[0] = ctrl; G.Opt.ctrl[1] = ctrl;
    P.found = [P.q - 1, 3]; step(2); o.before = P.banner;
    const e = window.makeEgg(P.heroes[0].x + 6, P.heroes[0].y, { state: 'idle' }); P.eggs.push(e); step(10);
    const bn = P.banner; o.kind = bn && bn.kind; o.name = bn && bn.name; o.k = bn && bn.k;
    o.text = bn ? G.T('quota.done', bn.name, ctrl === 'kb' ? G.CONFIG.keys[0].g.replace('Key', '') : 'L1') : '';
    P.banner = null; step(60); o.again = P.banner && P.banner.kind === 'quotaDone';          // it does not come back
    P.found = [P.q - 1, P.q]; P.quotaMsg = [false, false]; step(2); P.banner = null;           // both together: quotaBoth, never quotaDone
    P.found = [P.q - 1, P.q - 1]; P.quotaMsg = [false, false]; step(2); P.found = [P.q, P.q]; step(3); o.both = P.banner && P.banner.kind;
    G.Opt.lang = 'ro'; G.Opt.ctrl[0] = 'pad'; G.Opt.ctrl[1] = 'pad';
    return o;
  }, [lang, ctrl]);
  const m8 = [await msg8('ro', 'pad'), await msg8('en', 'pad'), await msg8('ro', 'kb')];
  const names8 = ['Killer', 'Killer', 'Killer'];
  ok(8, 'mesajul "Ai gasit toate": o data, numai cand prietenul nu are cota, numele prietenului si L1 / tasta, in ro si en; la final deodata apare quotaBoth',
    m8.every((m, i) => !m.before && m.kind === 'quotaDone' && m.name === names8[i] && m.k === 0 && !m.again && m.both === 'quotaBoth' && m.text.indexOf(names8[i]) >= 0 && m.text.indexOf(i === 2 ? 'R' : 'L1') >= 0)
      && /găsit/.test(m8[0].text) && /found/.test(m8[1].text), JSON.stringify(m8.map(m => [m.kind, m.name, m.again, m.both])));

  // ---------- 9. one player: no limit, the other's quota is met, ends when he has q ----------
  const r9 = await page.evaluate(() => {
    joined = [true, false]; go(0); const P = G.P, L = P.L, a = P.heroes[0], o = {};
    for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0; step(5);
    P.found = [P.q + 5, 0]; const e = window.makeEgg(a.x + 8, a.y, { state: 'idle' }); P.eggs.push(e); step(20);
    o.noLimit = P.found[0] === P.q + 6 && !P.eggs.includes(e); o.otherOk = G.quotaState(1).ok === true;
    // the badge of the one who is not playing shows no counter (the pixels of the number area stay without red or green)
    P.found = [3, 0]; noEggs(); P.nestOpen = true; P.nestOpenT = 20; a.x = L.nest.x; a.y = L.nest.y; step(60 * 2); o.notYet = P.done === false;
    P.found = [P.q, 0]; step(60 * 2); o.ends = P.done === true;
    joined = [true, true]; return o;
  });
  ok(9, 'un singur jucator: nu exista limita, cota celuilalt e indeplinita, nivelul se termina cand el are q (si nu mai devreme)', r9.noLimit && r9.otherOk && r9.notYet && r9.ends, JSON.stringify(r9));

  // ---------- 10. a hit hero drops one of his own eggs; none without eggs; the friend taking it counts for the friend ----------
  const r10 = await page.evaluate(() => {
    const P = fresh(0), a = P.heroes[0], b = P.heroes[1], o = {};
    P.found = [0, 3]; P.levelEggs = 3; G.Game.team.eggs = 3; const n0 = P.eggs.length; G.hitHero(a, a.x - 50, a.y);
    o.nothing = P.eggs.length === n0 && P.found[0] === 0 && P.found[1] === 3;
    for (const h of P.heroes) { h.down = false; h.dizzy = 0; h.inv = 0; }
    P.found = [4, 0]; G.hitHero(a, a.x - 50, a.y);
    const d = P.eggs.filter(x => x.dropped); o.dropped = P.found[0] === 3 && d.length === 1 && d[0].goal === true;
    for (const h of P.heroes) { h.down = false; h.dizzy = 0; }
    const e = d[0]; if (e) { a.x = e.x + 700; a.y = e.y; } step(2); if (e) { e.wait = 0; e.state = 'idle'; e.delay = 0; b.x = e.x; b.y = e.y; } step(30);      // the hit hero far away, so only the friend can take it
    o.friendCounts = !!e && !P.eggs.includes(e) && P.found[1] === 1;
    return o;
  });
  ok(10, 'eroul lovit scapa un ou al lui (found scade cu 1); fara oua nu scapa nimic; oul luat de prieten creste numaratoarea prietenului', r10.nothing && r10.dropped && r10.friendCounts, JSON.stringify(r10));

  // ---------- 11. the second player joins in the middle of the level ----------
  const r11 = await page.evaluate(() => {
    joined = [true, false]; go(0); const P = G.P, L = P.L, o = {};
    for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
    P.heroes[1].x = P.heroes[0].x + 120; P.heroes[1].y = P.heroes[0].y; P.found = [P.q + 3, 0]; step(5);
    joined = [true, true]; step(60 * 2); o.found = P.found.slice(); o.q = P.q; return o;
  });
  ok(11, 'al doilea jucator intra in mijlocul nivelului: diamantele peste cota ale primului trec la el', r11.found[0] === r11.q && r11.found[1] === 3, JSON.stringify(r11));

  // ---------- 12. the giant egg, the guardians' eggs and the rainbow raise the team total, not the quota ----------
  const r12 = await page.evaluate(() => {
    const P = fresh(0), a = P.heroes[0], o = {}; P.found = [1, 1]; const t0 = G.Game.team.eggs;
    const big = window.makeEgg(a.x, a.y, { big: true, value: G.CONFIG.giantEggValue, r: 44, req: false }); P.eggs.push(big); G.collectEgg(big, 0);
    const gd = window.makeEgg(a.x, a.y, { req: false }); P.eggs.push(gd); G.collectEgg(gd, 0);
    o.single = P.found[0] === 1 && G.Game.team.eggs > t0 && big.goal === false && gd.goal === false;
    const t1 = G.Game.team.eggs;
    for (let i = 0; i < 7; i++) { const e = window.makeEgg(a.x, a.y, { req: false, hue: i }); P.eggs.push(e); G.collectEgg(e, 0); }
    o.rainbow = P.found[0] === 1 && P.rainbows === 1 && G.Game.team.eggs >= t1 + 7 + G.CONFIG.lupta.rainbowBonus;
    return o;
  });
  ok(12, 'oul uriaș, ouale din paznic si bonusul curcubeului cresc Game.team.eggs, nu P.found', r12.single && r12.rainbow, JSON.stringify(r12));

  // ---------- 13. the automatic help ----------
  const r13 = await page.evaluate(() => {
    const C = G.CONFIG.quota, o = {};
    const run = (autoGive, secs) => {
      C.autoGive = autoGive; C.autoEvery = 0.5;
      const P = fresh(0); openNestNow(); P.found = [P.q + 4, P.q - 4]; inNest(); let saw = false;
      for (let i = 0; i < 60 * secs && !P.done; i++) { step(1); inNest(); if (P.banner && P.banner.kind === 'auto') saw = true; }
      return { saw, met: P.found[0] >= P.q && P.found[1] >= P.q, done: P.done, found: P.found.slice() };
    };
    o.on = run(3, 14); o.off = run(0, 14); C.autoGive = 120; C.autoEvery = 2; return o;
  });
  ok(13, 'ajutorul automat: cu autoGive 3 se transfera oua pana la cota si apare quota.auto; cu autoGive 0 nu', r13.on.saw && r13.on.met && r13.on.done && !r13.off.saw && !r13.off.met && !r13.off.done, JSON.stringify(r13));

  // ---------- 14. the taller badge covers no hero (hud-acoperire.js with STRICT=1) ----------
  let hud = '';
  try { hud = execFileSync('node', [require('path').join(__dirname, 'hud-acoperire.js')], { env: Object.assign({}, process.env, { STRICT: '1', JOC: game }), encoding: 'utf8', timeout: 600000 }); } catch (e) { hud = (e.stdout || '') + String(e.message); }
  ok(14, 'hud-acoperire.js cu STRICT=1: insigna de 108 nu acopera niciun erou', /hud-acoperire OK/.test(hud) && !/NEREUSIT/.test(hud), (hud.match(/cel mai rau[^\n]*|NEREUSIT[^\n]*|hud-acoperire OK[^\n]*/) || [''])[0]);

  let bad = [];
  for (const [n, label, v, extra] of out) { console.log((v ? 'ok   ' : 'GRESIT ') + n + '. ' + label + (v ? '' : '   ' + (extra || ''))); if (!v) bad.push(n); }
  console.log('-- 15 si 16: botii (joc-complet-bot.js, nivele-bot-mers.js) si toate.sh verifica tot jocul; nu se repeta aici.');
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'cota OK (' + game + ')');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
