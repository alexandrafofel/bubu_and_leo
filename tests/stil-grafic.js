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
    out.lm = { fill: cnt.fill, draw: cnt.draw, big: cnt.big, lights: _lights.length, max: CONFIG.look.maxLights, halo: LightCount.halo, haloMax: CONFIG.look.haloMax };
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
  check('harta de lumina: cel mult ' + r.lm.max + ' de lumini, cu 60 de cristale pe ecran, si halourile (cel mult ' + r.lm.haloMax + ') in plus', r.lm.lights <= r.lm.max && r.lm.draw === r.lm.lights + r.lm.halo && r.lm.halo <= r.lm.haloMax && r.lm.lights >= Math.min(r.lm.max, 20), r.lm);
  check('harta de lumina: nicio imagine marita pe tot ecranul (luminile se pun direct)', r.lm.big === 0, r.lm);
  check('niciun createRadialGradient in plus pe cadru cu harta pornita', r.radOn === r.radOff, { pornita: r.radOn, oprita: r.radOff });
  check('lights: false: harta nu se deseneaza, ramane vinieta veche', r.off.fill === 0 && r.off.draw === 0 && r.off.big === 0 && r.off.overlayOld, r.off);
  check('lights: true: hartia e in pictura, harta ia locul vinietei (o singura trecere pe tot ecranul)', r.onOverlayNew, r.onOverlayNew);
  check('front: false: niciun drawImage din planul din fata', r.frontOff === 0, r.frontOff);
  check('nivelurile 1 - 6 fara preview: fara plan din fata si fara harta', !r.plain.front && !r.plain.lm && r.plain.frontDraw === 0, r.plain);

  // ================= T6.8: stralucire, apa, praf in lumina =================
  const w = await page.evaluate(() => {
    const G = __game, out = {}, ctxM = document.getElementById('game').getContext('2d'), P2 = CanvasRenderingContext2D.prototype;
    const grey = (hex) => { const n = parseInt(hex.slice(1), 16), R = n >> 16, Gc = (n >> 8) & 255, B = n & 255; return R === Gc && Gc === B; };
    CONFIG.look.preview = true; CONFIG.look.lights = true; CONFIG.look.front = true; CONFIG.look.waves = true; CONFIG.look.motes = 40; CONFIG.look.halo = 0.5;
    go(2); step(30);
    const L = G.P.L, wc = L.waterCells[(L.waterCells.length / 2) | 0], wx = (wc % L.cols + 0.5) * 40, wy = ((wc / L.cols | 0) + 0.5) * 40;
    for (const [k, h] of G.P.heroes.entries()) { h.x = h.px = wx + (k ? 140 : -140); h.y = h.py = wy - 140; h.inv = 999; }
    step(30);
    // ---- praful: 40 de puncte, alpha 0.15 - 0.4, in spatiul ecranului
    const al = []; const md = ctxM.drawImage; let inM = false; const dm = window.drawMotes;
    window.drawMotes = function () { inM = true; try { return dm.apply(this, arguments); } finally { inM = false; } };
    ctxM.drawImage = function () { if (inM) al.push(ctxM.globalAlpha); return md.apply(this, arguments); };
    step(2); out.motes = MoteCount.draw; out.moteAlpha = [Math.min(...al), Math.max(...al)];
    ctxM.drawImage = md; window.drawMotes = dm;
    const m0 = _motes.map(m => [m.x, m.y]); for (let i = 0; i < 30; i++) step(1); out.moteMoved = _motes.filter((m, i) => Math.hypot(m.x - m0[i][0], m.y - m0[i][1]) > 1).length;
    out.moteDir = _motes.filter((m, i) => { const dy = m.y - m0[i][1]; return Math.abs(dy) < 100 && dy * m.vy > 0; }).length;      // fiecare urca sau coboara dupa viteza lui, nu doar se leagana
    CONFIG.look.motes = 0; step(2); out.motes0 = MoteCount.draw; CONFIG.look.motes = 40; step(2);
    out.moteGrey = Object.values(MOTE_COLS).flat().filter(grey).length;
    // vulcan: scantei care urca; pestera: spori care coboara; altfel praf care pluteste usor in sus
    const fake = (key) => { moteInit({ def: { key }, seed: 3 }); return _motes.map(m => m.vy); };
    const vs = fake('volcano'), vc = fake('cave'), vd = fake('x');
    out.kinds = { spark: vs.every(v => v < 0), spore: vc.every(v => v > 0), dust: vd.every(v => v < 0 && v > -20), sparkFast: Math.min(...vs) < -40 };
    moteInit(G.P.L);
    // ---- apa: doua randuri de valuri, in sens opus; fara createPattern pe cadru; oglindire in pictura
    out.water = !!L.water; out.waves = WaterCount.waves; out.sparkMax = L.water.spark.length;
    const pat = matPattern('water-wave', WAVE_W, WAVE_H, paintWaveTile), e = [], st = pat.setTransform;
    pat.setTransform = function (m) { e.push(m.e); return st.apply(this, arguments); };
    const dctx = ctxM; fillWaves(dctx, L.water.path, 1.0, 14, 9); const a1 = e.slice(); e.length = 0; fillWaves(dctx, L.water.path, 1.5, 14, 9); const a2 = e.slice();
    pat.setTransform = st;
    out.dir = { first: a2[0] - a1[0], second: a2[1] - a1[1] };
    const cnt = { pat: 0, rad: 0 }, op = P2.createPattern, orad = P2.createRadialGradient;
    P2.createPattern = function () { cnt.pat++; return op.apply(this, arguments); };
    const perFrame = () => { cnt.rad = 0; P2.createRadialGradient = function () { cnt.rad++; return orad.apply(this, arguments); }; for (let i = 0; i < 10; i++) step(1); P2.createRadialGradient = orad; return cnt.rad; };
    out.radAll = perFrame(); out.pat = cnt.pat;
    CONFIG.look.waves = true; CONFIG.look.motes = 0; CONFIG.look.halo = 0; out.radBase = perFrame(); out.pat0 = cnt.pat;
    P2.createPattern = op; CONFIG.look.motes = 40; CONFIG.look.halo = 0.5;
    // oglindirea: pictura apei difera cu si fara ea (media pe 60 de celule de apa)
    const sample = (LL) => { const d = LL.bg.getContext('2d'); let v = []; for (let i = 0; i < 60; i++) { const k = LL.waterCells[(i * 7) % LL.waterCells.length], px = d.getImageData((k % LL.cols + 0.5) * 40 | 0, ((k / LL.cols | 0) + 0.5) * 40 | 0, 1, 1).data; v.push(px[0], px[1], px[2]); } return v; };
    const sOn = sample(G.P.L); CONFIG.look.waves = false; go(2); step(3); out.noWaterOff = !G.P.L.water; const sOff = sample(G.P.L);
    out.refl = sOn.reduce((a, b, i) => a + Math.abs(b - sOff[i]), 0) / sOn.length;
    CONFIG.look.waves = true; go(2); step(3);
    // culorile valurilor: niciun gri (nici in placa pictata)
    const tile = sprite('mat-water-wave', WAVE_W, WAVE_H, paintWaveTile).getContext('2d').getImageData(0, 0, WAVE_W * 2, WAVE_H * 2).data;
    let tg = 0, tn = 0; for (let i = 0; i < tile.length; i += 4) if (tile[i + 3] > 120) { tn++; if (tile[i] === tile[i + 1] && tile[i + 1] === tile[i + 2]) tg++; }
    out.tile = { n: tn, grey: tg };
    // ---- halouri: pe ce da lumina, alpha 0.35 - 0.6, cel mult haloMax; halo: 0 = niciunul
    go(6); step(30);
    out.arenaHalo = LightCount.halo; out.haloRange = [LightCount.haloLo, LightCount.haloHi]; out.haloMax = CONFIG.look.haloMax;
    CONFIG.look.halo = 0; step(2); out.halo0 = LightCount.halo; CONFIG.look.halo = 0.5; step(2);
    CONFIG.look.haloMax = 2; step(2); out.haloCap = LightCount.halo; CONFIG.look.haloMax = 12;
    // ---- nivelurile 1 - 6 fara preview: fara apa noua, fara praf
    CONFIG.look.preview = false; go(2); step(30);
    out.plain = { water: !!G.P.L.water, motes: MoteCount.draw };
    return out;
  });
  check('praful: 40 de puncte pe ecran', w.motes === 40, w.motes);
  check('praful: alpha intre 0.15 si 0.4', w.moteAlpha[0] >= 0.149 && w.moteAlpha[1] <= 0.401 && w.moteAlpha[1] > w.moteAlpha[0], w.moteAlpha);
  check('praful: se misca', w.moteMoved >= 30, w.moteMoved);
  check('praful: urca sau coboara dupa viteza fiecaruia (nu doar se leagana)', w.moteDir >= 30, w.moteDir);
  check('motes: 0: niciun punct', w.motes0 === 0, w.motes0);
  check('praful: culorile nu sunt gri', w.moteGrey === 0, w.moteGrey);
  check('vulcan: scantei care urca; pestera: spori care coboara; altfel praf usor', w.kinds.spark && w.kinds.spore && w.kinds.dust && w.kinds.sparkFast, w.kinds);
  check('apa: pictura apei exista (L.water) si doua randuri de valuri pe cadru', w.water && w.waves === 2, { water: w.water, valuri: w.waves });
  check('apa: cel mult 24 de sclipiri', w.sparkMax > 0 && w.sparkMax <= 24, w.sparkMax);
  check('apa: cele doua randuri merg in sens opus', w.dir.first > 0 && w.dir.second < 0, w.dir);
  check('apa si praful: niciun createPattern pe cadru', w.pat === 0 && w.pat0 === 0, { cu: w.pat, fara: w.pat0 });
  check('apa, praful si halourile: niciun createRadialGradient in plus pe cadru', w.radAll === w.radBase, { cu: w.radAll, fara: w.radBase });
  check('oglindirea: pictura apei difera cu ea', w.refl > 0.5, w.refl);
  check('waves: false: nu se mai picteaza apa noua (ramane clipirea veche)', w.noWaterOff, w.noWaterOff);
  check('valurile: nicio culoare gri in placa', w.tile.n > 200 && w.tile.grey === 0, w.tile);
  check('halouri: pe arena, pe ce da lumina, cel mult haloMax', w.arenaHalo > 0 && w.arenaHalo <= w.haloMax, w.arenaHalo);
  check('halouri: alpha intre 0.35 si 0.6', w.haloRange[0] >= 0.349 && w.haloRange[1] <= 0.601, w.haloRange);
  check('halo: 0: niciun halou; haloMax limiteaza', w.halo0 === 0 && w.haloCap <= 2, { fara: w.halo0, cap: w.haloCap });
  check('nivelurile 1 - 6 fara preview: fara apa noua si fara praf', !w.plain.water && w.plain.motes === 0, w.plain);

  // ================= T6.10: pixeli negri sau gri pe fiecare captura; nimic interzis in desenul de la fiecare cadru =================
  const z = await page.evaluate(() => {
    const G = __game, out = { scenes: {}, src: {} }, cv = document.getElementById('game'), cx = cv.getContext('2d');
    const grey = () => { const d = cx.getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] === d[i + 1] && d[i + 1] === d[i + 2] && d[i] < 200) n++; return n / (cv.width * cv.height) * 100; };
    CONFIG.look.lights = true; CONFIG.look.front = true; CONFIG.look.waves = true; CONFIG.look.motes = 40; CONFIG.look.halo = 0.5;
    for (const lang of ['ro', 'en']) {
      G.Opt.lang = lang; setLanguage(lang);
      for (const prev of [false, true]) {
        CONFIG.look.preview = prev;
        for (let lv = 0; lv < chapters().length; lv++) {    /* T7.4: si nivelul 7 */ go(lv); step(120); out.scenes[lang + (prev ? ' diorama ' : ' acuarela ') + lv] = +grey().toFixed(4); }
      }
    }
    CONFIG.look.preview = true; go(2); step(30); G.startDuel(); step(90); out.scenes['mini-lupta'] = +grey().toFixed(4);
    G.Opt.lang = 'ro'; setLanguage('ro'); CONFIG.look.preview = false;
    // codul stilului nou, care ruleaza la fiecare cadru: niciun createRadialGradient, createPattern sau shadowBlur
    // (picatorii care se pun in sprite() si matPattern, care face pattern-ul o singura data, sunt in afara listei)
    const names = ['lit', 'drawArt', 'drawArtChar', 'drawHeroRing', 'drawPlate', 'drawCage', 'drawMechs', 'drawBridge', 'drawToy', 'litGloss', 'castShadow', 'litTube', 'litPuff', 'litClaws', 'litTeeth', 'eyeLit', 'sewNumber', 'matFill', 'drawLightMap', 'collectLights', 'addLight',
      'drawFront', 'updateFront', 'frontOffset', 'heroScreenBox', 'drawMotes', 'drawWater', 'fillWaves', 'holdBreath', 'bigHit', 'kickZoom', 'mechMove', 'mechClick', 'easeBack',
      'heroMotion', 'tailStep', 'tailFollow', 'blinkOn', 'drawRunTrail', 'drawGeorgeBoss', 'drawBoon', 'drawKiller', 'drawGeorge', 'drawGlove'];
    const miss = [], hit = [];
    for (const n of names) {
      let f; try { f = (0, eval)(n); } catch (e) { f = null; }
      if (typeof f !== 'function') { miss.push(n); continue; }
      const src = f.toString().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
      for (const bad of ['createRadialGradient', 'createPattern', 'shadowBlur']) if (src.includes(bad)) hit.push(n + ':' + bad);
    }
    out.src = { n: names.length, miss, hit };
    return out;
  });
  const worst = Object.entries(z.scenes).sort((a, b) => b[1] - a[1])[0];
  check('pe fiecare captura (' + Object.keys(z.scenes).length + ': ro si en, acuarela si diorama, nivelurile 1 - 7 si lupta, mini-lupta) sub 0.1% pixeli negri sau gri (R = G = B sub 200)', worst[1] < 0.1, { cel_mai_rau: worst });
  check('desenul stilului nou nu are createRadialGradient, createPattern, shadowBlur (' + z.src.n + ' de functii)', z.src.miss.length === 0 && z.src.hit.length === 0, z.src);
  // ---- T7.4: nivelul 7 (canyon), primul nivel cu look: 'diorama': sub 0.1% pixeli negri sau gri, in patru locuri ----
  const n7 = await page.evaluate(() => {
    const G = __game, CONFIG = G.CONFIG; CONFIG.look.preview = false; CONFIG.look.front = true; CONFIG.look.lights = true;
    go(7); step(10);
    const P = G.P, L = P.L, cv = document.getElementById('game'), cx = cv.getContext('2d'), out = { key: L.def.key, diorama: isDiorama(L), shots: [] };
    const spots = [[L.spawn.x, L.spawn.y], [L.gates[0].x, L.gates[0].y], [L.gates[1].x, L.gates[1].y], [L.nest.x - 300, L.nest.y]];
    for (const [x, y] of spots) {
      P.heroes.forEach((h, k) => { h.x = x - 60 + k * 120; h.y = y + 40; h.vx = h.vy = 0; }); step(40);
      const d = cx.getImageData(0, 0, cv.width, cv.height).data; let n = 0, bad = 0;
      for (let i = 0; i < d.length; i += 4) { n++; const R = d[i], Gc = d[i + 1], B = d[i + 2];
        if ((R === Gc && Gc === B && R < 200) || Math.max(R, Gc, B) < 24) bad++; }      // gri ca in T6.10 (R = G = B, sub 200), sau aproape negru
      out.shots.push(+(bad / n * 100).toFixed(3));
    }
    return out;
  });
  console.log('nivelul 7:', JSON.stringify(n7));
  check('nivelul 7 e diorama', n7.key === 'canyon' && n7.diorama, n7);
  check('nivelul 7: sub 0.1% pixeli negri sau gri, in patru locuri', n7.shots.every(v => v < 0.1), n7.shots);
  console.log(bad.length ? 'NEREUSIT: ' + bad.join(' | ') : 'stil-grafic OK');
  await done();
})();
