// Sunetele personajelor in difuzorul controllerului: cu iesiri audio false (Chrome --use-fake-device-for-media-stream)
// alege un difuzor pentru fiecare erou si masoara semnalul care ajunge acolo: efecte si cuvinte. Scrie OK sau NEREUSIT.
const { chromium } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: require('./pw.js').chrome, headless: true, args: ['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, permissions: ['microphone'] });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(require('./pw.js').url);
  await page.waitForTimeout(800);
  await page.mouse.click(900, 500); await page.waitForTimeout(500);
  const r = await page.evaluate(async () => {
    const G = __game, S = G.Snd, out = { fx: {}, words: {} };
    const res = await S.listOutputs(true);
    out.devices = res ? res.list.map(d => d.label) : null; out.denied = res && res.denied;
    if (!res || !res.list.length) return out;
    for (let k = 0; k < 2; k++) out['sink' + k] = await S.setSink(k, res.list[Math.min(k, res.list.length - 1)]);
    const d = S.debug();
    out.state = d.outs.map(o => o ? o.context.state : null);
    out.lead = d.outs.map(o => o ? +o.lead.toFixed(3) : null); out.baseLatency = d.outs.map(o => o ? +(o.context.baseLatency || 0).toFixed(3) : null); out.small = d.outs.map(o => o ? !!o.small : null);
    // the analyser keeps the last 0.68 s: read it in pieces while the sound plays, so that no short sound is missed
    const meter = bus => { const an = bus.context.createAnalyser(); an.fftSize = 32768; bus.connect(an); const buf = new Float32Array(32768); return async ms => { let p = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { await new Promise(r => setTimeout(r, 120)); an.getFloatTimeDomainData(buf); for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs(buf[i])); } return +p.toFixed(3); }; };
    const m = [meter(d.outs[0]), meter(d.outs[1])], main = meter(d.chrBus);
    await new Promise(r => setTimeout(r, 900));      // the new outputs need a moment to start
    for (const [name, k] of [['stomp', 0], ['bonk', 0], ['step', 0], ['egg', 0], ['kick', 1], ['bounce', 1], ['egg', 1]]) { S.play(name, 0, k); out.fx[name + k] = [await m[k](600), await main(130)]; await new Promise(r => setTimeout(r, 500)); }
    for (const k of [0, 1]) for (const key of ['hello', 'power', 'hurt', 'egg', 'levelWin']) { await new Promise(r => setTimeout(r, 700)); S.talk(k, key); out.words[k + ':' + key] = [await m[k](900), await main(130)]; }
    return out;
  });
  console.log(JSON.stringify(r));
  const weak = Object.entries(Object.assign({}, r.fx, r.words)).filter(([k, v]) => v[0] < 0.02 && !/^step/.test(k)).map(([k]) => k), leak = Object.entries(Object.assign({}, r.fx, r.words)).filter(([, v]) => v[1] > 0.01).map(([k]) => k);
  console.log('prea incet in difuzorul ales (sub 0.02):', weak.length ? weak.join(' ') : 'niciunul', '| ajunse si in boxele calculatorului:', leak.length ? leak.join(' ') : 'niciunul');
  console.log(r.devices && r.devices.length && r.sink0 && r.sink1 && !weak.length && !leak.length ? 'sunete-controller OK' : 'NEREUSIT');
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
