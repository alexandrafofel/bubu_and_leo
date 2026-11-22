// Stilul grafic al nivelurilor 7 - 12 (docs/24-sisteme-noi.md, S7). Inceputul testului: T6.6 (planul din fata) si T6.7
// (harta de lumina). Pana exista nivelurile 7 - 12 (look: 'diorama'), cadrul nou se porneste pe nivelurile 1 - 6 cu
// CONFIG.look.preview = true. Scrie "stil-grafic OK" sau "NEREUSIT".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const bad = [];
  const check = (lbl, ok, extra) => { console.log((ok ? 'ok   ' : 'GRESIT ') + lbl + (extra !== undefined ? ' ' + JSON.stringify(extra) : '')); if (!ok) bad.push(lbl); };

  const r = await page.evaluate(() => {
    const G = __game, out = {};
    CONFIG.look.preview = true; CONFIG.look.lights = true; CONFIG.look.front = true;
    // ---- T6.6, 1: niciun lucru din planul din fata nu e pus in mijlocul ecranului (1500 x 760)
    go(0); step(5);
    const items = G.P.L.front.items, M = FRONT_MID;
    out.items = items.length;
    // culorile planului din fata: niciun gri, nimic mai inchis decat #241A3A (pe fiecare nivel, pictat diferit).
    // Doar pixelii aproape opaci: marginile sterse, aproape transparente, se amesteca oricum cu ce e dedesubt
    out.frontCol = { gri: 0, inchis: 0, n: 0 };
    for (let lv = 0; lv < 7; lv++) { go(lv); step(2); const cv = G.P.L.front.cv, d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      for (let i = 0; i < d.length; i += 16) if (d[i + 3] > 200) { out.frontCol.n++; const R = d[i], Gc = d[i + 1], B = d[i + 2]; if (Math.abs(R - Gc) < 6 && Math.abs(Gc - B) < 6 && R < 200) out.frontCol.gri++; if (R < 36 && Gc < 26 && B < 58) out.frontCol.inchis++; } }
    go(0); step(2);
    out.inMiddle = items.filter(it => it.x < M.x + M.w + FRONT_PAR_MAX && it.x + it.w > M.x - FRONT_PAR_MAX && it.y < M.y + M.h + FRONT_PAR_MAX && it.y + it.h > M.y - FRONT_PAR_MAX).length;
    // ---- T6.6, 2: 400 de asezari ale eroilor, pe toate nivelurile, si mai ales langa margini. Niciun erou acoperit.
    let rs = 12345; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
    let covered = 0, placements = 0, maxDraw = 0, faded = 0, skipped = 0; const ex = [];
    for (let lv = 0; lv < 7 && placements < 400; lv++) {
      go(lv); step(3);
      const L = G.P.L, hs = G.P.heroes;
      for (let n = 0; n < 58 && placements < 400; n++, placements++) {
        for (const h of hs) {
          const edge = rnd() < 0.6;                     // 60%: langa marginile nivelului, unde camera nu mai poate tine eroul la mijloc
          h.x = h.px = edge ? (rnd() < 0.5 ? 60 + rnd() * 260 : L.W - 60 - rnd() * 260) : 200 + rnd() * (L.W - 400);
          h.y = h.py = edge && rnd() < 0.5 ? (rnd() < 0.5 ? 140 + rnd() * 220 : L.H - 40 - rnd() * 220) : 200 + rnd() * (L.H - 400);
          h.vx = h.vy = 0; h.inv = 999; h.down = false; h.dizzy = 0;         // nimic nu il loveste: testul e despre ce se vede, nu despre joc
        }
        if (rnd() < 0.5) { hs[1].x = hs[1].px = clamp(hs[0].x + (rnd() - 0.5) * 700, 60, L.W - 60); hs[1].y = hs[1].py = clamp(hs[0].y + (rnd() - 0.5) * 400, 140, L.H - 40); }
        inp[0] = { x: 0, y: 0 }; inp[1] = { x: 0, y: 0 };
        for (let i = 0; i < 20; i++) step(1);               // 0.33 s: timp sa se stinga (0.2 s) si camera sa ajunga
        const v = { l: 0, tp: 0, z: G.P.cam.zoom };
        // vederea exacta din ultimul cadru: o recalculam cum o face drawWorld
        { const cam = G.P.cam, z = cam.zoom, vw = W / z, vh = H / z; let l = cam.x - vw / 2, tp = cam.y - vh / 2; const tpMin = -(HUD_TOP + 20) / z; v.l = clamp(l, 0, L.W - vw); v.tp = clamp(tp, tpMin, Math.max(tpMin, L.H - vh)); }
        if (G.Game.state !== 'play' || L.front.t !== G.P.time) { skipped++; continue; }      // planul din fata se deseneaza doar in joc
        const [ox, oy] = frontOffset(L, v);
        maxDraw = Math.max(maxDraw, FrontCount.draw);
        for (const h of hs) {
          const b = heroScreenBox(h, v);
          for (const it of L.front.items) {
            const x0 = it.x + ox, y0 = it.y + oy;
            if (b[2] > x0 && b[0] < x0 + it.w && b[3] > y0 && b[1] < y0 + it.h) {
              if (it.a > CONFIG.look.frontMin + 0.01) { covered++; if (ex.length < 4) ex.push({ lv, hx: Math.round(h.x), hy: Math.round(h.y), a: +it.a.toFixed(2), kind: it.kind, st: G.Game.state, upd: L.front.t === G.P.time, duel: !!(G.P.duel && !G.P.duel.over), zoom: +v.z.toFixed(2) }); }
              else faded++;
            }
          }
        }
      }
    }
    out.covered = covered; out.placements = placements; out.skipped = skipped; out.maxDraw = maxDraw; out.faded = faded; out.ex = ex;
    // ---- T6.7: harta de lumina. Multe lumini: 60 de cristale in jurul eroilor
    go(0); step(5);
    const P = G.P, h0 = P.heroes[0];
    for (let i = 0; i < 60; i++) P.eggs.push(makeEgg(h0.x + (i % 10) * 60 - 270, h0.y + (i / 10 | 0) * 50 - 150, { delay: 0 }));
    step(2);
    const cnt = { fill: 0, draw: 0, big: 0, rad: 0 };
    const mainCtx = document.getElementById('game').getContext('2d'), of = mainCtx.fillRect, md = mainCtx.drawImage;
    let inLM = false; const dl = window.drawLightMap;
    const orad = CanvasRenderingContext2D.prototype.createRadialGradient;
    // ce face harta intr-un cadru: umplerile si drawImage-urile de pe ecran din timpul lui drawLightMap
    window.drawLightMap = function () { inLM = true; try { return dl.apply(this, arguments); } finally { inLM = false; } };
    mainCtx.fillRect = function () { if (inLM) cnt.fill++; return of.apply(this, arguments); };
    mainCtx.drawImage = function (img) { if (inLM) { if (img.width >= 1900) cnt.big++; else cnt.draw++; } return md.apply(this, arguments); };
    // gradientele rotunde: numaram cu harta pornita si oprita, pe aceleasi cadre; diferenta trebuie sa fie 0
    const radCount = (on) => { CONFIG.look.lights = on; let n = 0; CanvasRenderingContext2D.prototype.createRadialGradient = function () { n++; return orad.apply(this, arguments); }; for (let i = 0; i < 10; i++) step(1); CanvasRenderingContext2D.prototype.createRadialGradient = orad; return n; };
    CONFIG.look.lights = true; cnt.fill = cnt.draw = cnt.big = 0; step(1);
    out.lm = { fill: cnt.fill, draw: cnt.draw, big: cnt.big, lights: _lights.length, max: CONFIG.look.maxLights };
    out.radOn = radCount(true); out.radOff = radCount(false);
    // cu lights: false nu se deseneaza harta si ramane vinieta veche
    CONFIG.look.lights = false; cnt.fill = cnt.draw = cnt.big = 0; step(1);
    out.off = { fill: cnt.fill, draw: cnt.draw, big: cnt.big, overlayOld: levelOverlay(P.L) === P.L.overlay && !!P.L.overlay };
    CONFIG.look.lights = true; step(1); out.onOverlayNew = levelOverlay(P.L) === null && P.L.paperBaked === true;
    mainCtx.fillRect = of; mainCtx.drawImage = md; window.drawLightMap = dl;
    // ---- planul din fata oprit: niciun drawImage
    CONFIG.look.front = false; step(1); out.frontOff = FrontCount.draw;
    // ---- nivelurile 1 - 6 fara preview: nimic nou
    CONFIG.look.preview = false; CONFIG.look.front = true; go(1); step(5);
    out.plain = { front: !!G.P.L.front, lm: !!G.P.L.paperBaked, frontDraw: FrontCount.draw };
    return out;
  });
  check('planul din fata: lucruri pe nivel (cel mult 12)', r.items > 0 && r.items <= 12, r.items);
  check('niciun lucru in dreptunghiul din mijloc (1500 x 760 + marja paralaxei)', r.inMiddle === 0, r.inMiddle);
  check('planul din fata: niciun gri si nimic sub #241A3A', r.frontCol.n > 1000 && r.frontCol.gri === 0 && r.frontCol.inchis === 0, r.frontCol);
  check('400 de asezari: niciun erou acoperit de planul din fata', r.placements === 400 && r.covered === 0 && r.skipped < 20, { covered: r.covered, ex: r.ex, stinse: r.faded, sarite: r.skipped });
  check('in asezarile de la margine chiar s-au stins lucruri (testul a ajuns acolo)', r.faded > 20, r.faded);
  check('planul din fata: cel mult 12 drawImage pe cadru', r.maxDraw <= 12, r.maxDraw);
  check('harta de lumina: 1 umplere (ambianta)', r.lm.fill === 1, r.lm);
  check('harta de lumina: cel mult ' + r.lm.max + ' drawImage, cu 60 de cristale pe ecran', r.lm.draw <= r.lm.max && r.lm.draw >= Math.min(r.lm.max, 20), r.lm);
  check('harta de lumina: nicio imagine marita pe tot ecranul (luminile se pun direct)', r.lm.big === 0, r.lm);
  check('niciun createRadialGradient in plus pe cadru cu harta pornita', r.radOn === r.radOff, { pornita: r.radOn, oprita: r.radOff });
  check('lights: false: harta nu se deseneaza, ramane vinieta veche', r.off.fill === 0 && r.off.draw === 0 && r.off.big === 0 && r.off.overlayOld, r.off);
  check('lights: true: hartia e in pictura, harta ia locul vinietei (o singura trecere pe tot ecranul)', r.onOverlayNew, r.onOverlayNew);
  check('front: false: niciun drawImage din planul din fata', r.frontOff === 0, r.frontOff);
  check('nivelurile 1 - 6 fara preview: fara plan din fata si fara harta', !r.plain.front && !r.plain.lm && r.plain.frontDraw === 0, r.plain);
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'stil-grafic OK');
  await done();
})();
