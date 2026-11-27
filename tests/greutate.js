// Greutatea miscarii (T6.9, docs/24-sisteme-noi.md, S7.6): oprirea scurta la o lovitura mare, apropierea camerei,
// anticiparea (George inainte sa arunce, un mecanism inainte sa porneasca) si easeBack.
// Scrie "greutate OK" sau "NEREUSIT".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };

  const r = await page.evaluate(() => {
    const G = __game, out = {};
    const frame = () => { G.Input.poll(1 / 60); G.update(1 / 60); };
    // ---------- easeBack si mechMove (functii pure)
    let mx = 0, mxAt = 0, ups = 0, downs = 0, prev = 0;
    for (let i = 0; i <= 1000; i++) { const v = easeBack(i / 1000); if (v > mx) { mx = v; mxAt = i / 1000; } if (i) { if (v > prev + 1e-12) ups++; else if (v < prev - 1e-12) downs++; } prev = v; }
    out.eb = { max: mx, at: mxAt, v0: easeBack(0), v1: easeBack(1), before: easeBack(-3), after: easeBack(4), ups, downs };
    const A = CONFIG.look.anticipate; let mn = 9, mm = -9, mnAt = 0;
    for (let i = 0; i <= 2000; i++) { const t = i / 1000, v = mechMove(t, 0.6); if (v < mn) { mn = v; mnAt = t; } if (v > mm) mm = v; }
    out.mech = { start: mechMove(0, 0.6), min: mn, minAt: mnAt, max: mm, end: mechMove(A + 0.6, 0.6), A };
    { let down = true, prevV = 0; for (let i = 1; i <= 15; i++) { const v = mechMove(i / 100, 0.6); if (v > prevV + 1e-12) down = false; prevV = v; } out.mech.gradual = down; out.mech.half = mechMove(A / 2, 0.6); }
    const a0 = CONFIG.look.anticipate; CONFIG.look.anticipate = 0; out.mechNoAnt = { start: mechMove(0, 0.6), min: Math.min(...[0, 0.1, 0.2, 0.3, 0.4].map(t => mechMove(t, 0.6))) }; CONFIG.look.anticipate = a0;

    // ---------- oprirea: updatePlay nu ruleaza, desenul da
    go(2); step(60);
    const P = G.P, h = P.heroes[0];
    const calls = []; const up = window.updatePlay; window.updatePlay = function (dt) { calls.push({ aP: G.Input.slots[0].aP, cP: G.Input.slots[0].cP }); return up.apply(this, arguments); };
    let draws = 0; const dp = window.drawPlay; window.drawPlay = function () { draws++; return dp.apply(this, arguments); };
    const sh0 = P.shake; bigHit(); out.shakeSame = P.shake === sh0;
    out.freeze0 = P.freeze;
    const t0 = P.time, x0 = h.x; G.Input.slots[0].x = 1;
    const frozen = []; const aps = [];
    for (let i = 0; i < 8; i++) {
      G.Input.poll(1 / 60); G.Input.slots[0].x = 1; if (i === 1) G.Input.slots[0].aP = true;           // ✕ apasat chiar in timpul opririi
      const c0 = calls.length; G.update(1 / 60); G.draw(); frozen.push(calls.length === c0);
      if (calls.length > c0) aps.push(calls[calls.length - 1].aP);
    }
    out.frozen = frozen; out.firstAP = aps[0]; out.secondAP = aps[1]; out.draws = draws;
    G.Input.slots[0].x = 0;
    window.updatePlay = up; window.drawPlay = dp;
    out.moved = h.x - x0 > 0;
    // freeze: 0 = nimic nu se opreste
    CONFIG.look.freeze = 0; P.freeze = 0; bigHit(); const tt = P.time; frame(); out.freezeOffRan = P.time > tt && P.freeze === 0; CONFIG.look.freeze = 0.06;

    // ---------- apropierea camerei: 4% in 0.15 s, inapoi in 0.4 s
    const K = CONFIG.look; P.kickT = 0; const z0 = kickZoom();
    const z = []; for (const t of [0, 0.075, 0.15, 0.2, 0.35, 0.55, 0.8]) { P.kickT = t; z.push(+kickZoom().toFixed(5)); }
    out.zoom = { z0, z };
    P.kickT = 0.15; out.zoomPeak = kickZoom();
    K.kick = 0; P.kickT = 0.15; out.zoomOff = kickZoom(); K.kick = 0.04; P.kickT = 99;
    // draw cu zoom: nicio eroare, iar eroii raman in cadru (camera se apropie spre centrul ei)
    P.kickT = 0.15; let drawErr = null; try { G.draw(); } catch (e) { drawErr = String(e); } out.drawErr = drawErr; P.kickT = 99;

    // ---------- loviturile mari: paznicul lovit
    go(2); step(30); G.startDuel(); step(80);
    const P2 = G.P; P2.freeze = 0; P2.kickT = 99; G.duelHit(1); out.duelFreeze = P2.freeze; out.duelKick = P2.kickT;

    // ---------- George: se trage inapoi in cele 0.15 s dinaintea aruncarii; momentul aruncarii nu se schimba
    const arena = () => { go(chIdx('boss')); step(30); const Q = G.P, bs = Q.boss; Q.heroes[0].x = 700; Q.heroes[0].y = 830; Q.heroes[1].x = 1220; Q.heroes[1].y = 830; for (const q of Q.heroes) { q.inv = 999; q.down = 0; } bs.state = 'up'; return { Q, bs }; };
    const runWind = () => {
      const { Q, bs } = arena(); bs.throwT = 0.5; bs.proj.length = 0; const w = []; let thrownAt = -1;
      for (let i = 0; i < 60; i++) { frame(); w.push(+(bs.windup || 0).toFixed(3)); if (thrownAt < 0 && bs.proj.length) thrownAt = i; }
      return { w, thrownAt };
    };
    const on = runWind(); out.windOn = { thrownAt: on.thrownAt, first: on.w.slice(0, 18), nonzero: on.w.filter(v => v > 0).length, max: Math.max(...on.w.slice(0, on.thrownAt)), afterThrow: on.w[on.thrownAt] };
    CONFIG.look.anticipate = 0; const off = runWind(); CONFIG.look.anticipate = a0;
    out.windOff = { thrownAt: off.thrownAt, max: Math.max(...off.w), min: Math.min(...off.w) };
    // cat asteapta un erou ajutor, George nu arunca si nu se trage inapoi
    { const { Q, bs } = arena(); bs.throwT = 0.1; Q.heroes[0].down = 5; frame(); out.windDown = bs.windup; }
    // George cade (lovit): oprire si apropiere
    { const { Q, bs } = arena(); bs.state = 'down'; const g = bossGoal(); Q.freeze = 0; Q.kickT = 99; const b = { x: g.x, y: g.y, state: 'fly', vx: 0, vy: 0 }; bossBall(b); out.bossFreeze = Q.freeze; out.bossKick = Q.kickT; }
    // sunetul de clic exista
    out.click = typeof mechClick === 'function' && !!Snd.play;
    return out;
  });

  // easeBack
  check('easeBack: 0 -> 0, 1 -> 1, in afara lui 0..1 ramane 0 si 1', r.eb.v0 === 0 && Math.abs(r.eb.v1 - 1) < 1e-9 && r.eb.before === 0 && Math.abs(r.eb.after - 1) < 1e-9, r.eb);
  check('easeBack: depaseste tinta cu 8% (nu 5%, nu 12%)', r.eb.max > 1.078 && r.eb.max < 1.082, r.eb.max);
  check('easeBack: urca pana la varf, apoi coboara o data (nu zig-zag)', r.eb.ups > 100 && r.eb.downs > 100 && r.eb.at > 0.55 && r.eb.at < 0.65, { ups: r.eb.ups, downs: r.eb.downs, at: r.eb.at });
  check('mechMove: porneste din 0, se trage inapoi cu 6% in 0.15 s', Math.abs(r.mech.start) < 1e-9 && r.mech.min > -0.0605 && r.mech.min < -0.0595 && Math.abs(r.mech.minAt - r.mech.A) < 0.005, r.mech);
  check('mechMove: tragerea inapoi e treptata (coboara la fiecare cadru, la jumatate e ~75% din 6%)', r.mech.gradual && r.mech.half < -0.04 && r.mech.half > -0.05, { gradual: r.mech.gradual, half: r.mech.half });
  check('mechMove: depaseste 1 (cu 8% din drumul de dupa tragere) si ajunge la 1', r.mech.max > 1.07 && r.mech.max < 1.10 && Math.abs(r.mech.end - 1) < 1e-9, r.mech);
  check('anticipate: 0 -> mecanismul nu se trage inapoi', Math.abs(r.mechNoAnt.start) < 1e-9 && r.mechNoAnt.min >= 0, r.mechNoAnt);
  // oprirea
  check('bigHit: P.freeze = look.freeze (0.06)', Math.abs(r.freeze0 - 0.06) < 1e-9, r.freeze0);
  check('oprirea: updatePlay nu ruleaza 3 - 4 cadre (0.06 s), apoi ruleaza', r.frozen.slice(0, 3).every(v => v) && r.frozen.slice(4).every(v => !v) && r.frozen.filter(v => v).length >= 3 && r.frozen.filter(v => v).length <= 4, r.frozen);
  check('oprirea nu opreste desenul: drawPlay a rulat in fiecare cadru (si in cele oprite)', r.draws === 8, r.draws);
  check('un buton apasat in timpul opririi nu se pierde: ajunge la primul cadru care ruleaza', r.firstAP === true, { primul: r.firstAP, al_doilea: r.secondAP });
  check('dupa oprire eroul se misca iar', r.moved, r.moved);
  check('freeze: 0 -> nimic nu se opreste', r.freezeOffRan, r.freezeOffRan);
  check('zguduirea (P.shake) ramane neschimbata de bigHit', r.shakeSame, r.shakeSame);
  // apropierea
  check('apropierea: zoom 1 la inceput, 1.04 la 0.15 s, 1 dupa 0.55 s', Math.abs(r.zoom.z0 - 1) < 1e-9 && Math.abs(r.zoom.z[2] - 1.04) < 1e-5 && r.zoom.z[5] === 1 && r.zoom.z[6] === 1, r.zoom);
  check('apropierea: creste in 0.15 s si scade dupa', r.zoom.z[1] > 1 && r.zoom.z[1] < 1.04 && r.zoom.z[3] < 1.04 && r.zoom.z[3] > r.zoom.z[4] && r.zoom.z[4] > 1, r.zoom.z);
  check('kick: 0 -> camera nu se apropie', r.zoomOff === 1, r.zoomOff);
  check('desenul cu camera apropiata merge fara eroare', r.drawErr === null, r.drawErr);
  // loviturile
  check('paznicul lovit: oprire si apropiere', r.duelFreeze > 0.05 && r.duelKick === 0, { freeze: r.duelFreeze, kick: r.duelKick });
  check('George cazut (lovit): oprire si apropiere', r.bossFreeze > 0.05 && r.bossKick === 0, { freeze: r.bossFreeze, kick: r.bossKick });
  // anticiparea lui George
  check('George se trage inapoi in cele 0.15 s dinaintea aruncarii, 0 inainte', r.windOn.nonzero >= 7 && r.windOn.nonzero <= 10 && r.windOn.max > 0.85, r.windOn);
  check('George: dupa aruncare se indreapta (windup 0)', r.windOn.afterThrow === 0, r.windOn.afterThrow);
  check('anticiparea nu schimba momentul aruncarii (30 de cadre +- 1, cu si fara)', Math.abs(r.windOn.thrownAt - r.windOff.thrownAt) <= 1 && Math.abs(r.windOn.thrownAt - 30) <= 2, { cu: r.windOn.thrownAt, fara: r.windOff.thrownAt });
  check('anticipate: 0 -> George nu se trage inapoi', r.windOff.max === 0 && r.windOff.min === 0, r.windOff);
  check('cat asteapta un erou ajutor, George nu se trage inapoi', r.windDown === 0, r.windDown);
  check('mechClick exista (clic + scanteie)', r.click, r.click);
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'greutate OK');
  await done();
})();
