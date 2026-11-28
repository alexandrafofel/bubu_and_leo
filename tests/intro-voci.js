// Cartonasul de la inceputul fiecarui capitol, spus de Boon si Killer (tools/voci/intro.py, INTRO_VOICE, STR lvl.<cheie>.talk).
// 1. Fiecare capitol are dialog in romana si engleza, cu acelasi numar de replici ca INTRO_VOICE si acelasi erou pe fiecare replica.
// 2. Amandoi eroii vorbesc in fiecare capitol.
// 3. Pe cartonas replicile se spun pe rand (Snd.introLine 0, 1, ...), fiecare in difuzorul eroului ei (iesiri false).
// 4. ✕ opreste vocile si porneste nivelul.
// Scrie OK sau NEREUSIT, apoi "errors N".
const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, permissions: ['microphone'] });
  const page = await ctx.newPage();
  const errs = []; let fails = 0;
  const check = (name, ok, info) => { console.log((ok ? 'OK        ' : 'NEREUSIT  ') + name + (ok ? '' : '  ' + JSON.stringify(info))); if (!ok) fails++; };
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  await page.mouse.click(900, 500); await page.waitForTimeout(500);
  const t1 = await page.evaluate(() => {
    const out = [];
    for (const ch of chapters()) {
      const def = ch.def || (ch.kind === 'boss' ? BOSS_DEF_L : null); if (!def) continue;
      for (const lang of ['ro', 'en']) {
        const keep = Opt.lang; Opt.lang = lang; const talk = lvlTalk(def); Opt.lang = keep;
        const v = INTRO_VOICE[lang][def.key];
        out.push({ key: def.key, lang, n: talk ? talk.length : 0, nv: v ? v.length : 0, same: !!talk && !!v && talk.every((l, i) => v[i] && v[i].w === l.w), both: !!talk && talk.some(l => l.w === 0) && talk.some(l => l.w === 1) });
      }
    }
    return out;
  });
  check('10 capitole, fiecare in romana si engleza', t1.length === 20, t1.map(x => x.key + '/' + x.lang));
  check('dialogul are cate un clip pentru fiecare replica, cu acelasi erou', t1.every(x => x.n > 0 && x.n === x.nv && x.same), t1.filter(x => !(x.n > 0 && x.n === x.nv && x.same)));
  check('amandoi eroii vorbesc in fiecare capitol', t1.every(x => x.both), t1.filter(x => !x.both));
  const t2 = await page.evaluate(async () => {
    const G = __game, S = G.Snd, out = {};
    const res = await S.listOutputs(true);
    if (res && res.list.length) for (let k = 0; k < 2; k++) await S.setSink(k, res.list[Math.min(k, res.list.length - 1)]);
    const d = S.debug(), seen = [];
    const meter = bus => { if (!bus) return () => 0; const an = bus.context.createAnalyser(); an.fftSize = 2048; bus.connect(an); const b = new Float32Array(2048); return () => { an.getFloatTimeDomainData(b); let m = 0; for (const v of b) m = Math.max(m, Math.abs(v)); return m; }; };
    const m = [meter(d.outs[0]), meter(d.outs[1])], peak = [[0, 0], [0, 0]];
    Game.goLevel(0);
    const t0 = performance.now();
    while (performance.now() - t0 < 26000) {
      await new Promise(r => setTimeout(r, 60));
      const i = S.introLine(); if (i >= 0 && seen[seen.length - 1] !== i) seen.push(i);
      if (i >= 0) { const w = INTRO_VOICE[Opt.lang].glade[i].w; peak[w][0] = Math.max(peak[w][0], m[0]()); peak[w][1] = Math.max(peak[w][1], m[1]()); }
      if (seen.length >= 3 && S.introLine() === 2) break;
    }
    out.state = Game.state; out.seen = seen; out.sinks = !!(d.outs[0] && d.outs[1]); out.peak = peak.map(p => p.map(v => +v.toFixed(3)));
    S.introStop(); await new Promise(r => setTimeout(r, 200)); out.afterStop = S.introLine();
    return out;
  });
  check('pe cartonas replicile se spun pe rand (0, 1, 2)', t2.state === 'intro' && t2.seen.slice(0, 3).join() === '0,1,2', t2);
  if (t2.sinks) check('replica lui Boon iese din difuzorul lui Boon, a lui Killer din al lui Killer', t2.peak[0][0] > 0.01 && t2.peak[1][1] > 0.01 && t2.peak[0][0] > t2.peak[0][1] * 2 && t2.peak[1][1] > t2.peak[1][0] * 2, t2.peak);
  check('oprirea vocilor (✕ porneste nivelul)', t2.afterStop === -1, t2);
  console.log(fails ? 'intro-voci NEREUSIT' : 'intro-voci OK');
  console.log('errors ' + errs.length); errs.slice(0, 5).forEach(e => console.log('  ' + e));
  await browser.close();
})();
