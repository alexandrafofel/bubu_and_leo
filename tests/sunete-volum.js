// every sound: plays without error, peak level at the master bus. Jocul: variabila JOC (in al doilea joc multe sunete sunt altele).
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const r = await page.evaluate(async () => {
    const G = __game, S = G.Snd, d = S.debug(), ac = d.ac; if (!ac) return 'no audio';
    await ac.resume();
    const mk = node => { const an = ac.createAnalyser(); an.fftSize = 2048; node.connect(an); return an; };
    const anM = mk(d.master), buf = new Float32Array(2048);
    const peak = async (an, ms) => { let p = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { an.getFloatTimeDomainData(buf); for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs(buf[i])); await new Promise(r => setTimeout(r, 12)); } return +p.toFixed(3); };
    S.music(null); S.ambience(null); await new Promise(r => setTimeout(r, 700));
    const out = { state: ac.state, silent: await peak(anM, 200), fx: {} };
    for (const n of Array.from(new Set(S.names().concat(S.names2())))) {
      for (const k of (/^v|step/.test(n) ? [0, 1] : [0])) { S.play(n, n === 'step' ? k * 2 : /^v/.test(n) ? k : 1, k); out.fx[n + (/^v|step/.test(n) ? k : '')] = await peak(anM, n === 'giant' || n === 'win' ? 1300 : 650); await new Promise(r => setTimeout(r, 250)); }
    }
    for (const key of ['l0', 'l4', 'l5', 'duel', 'duel2', 'boss']) { S.music(key); await new Promise(r => setTimeout(r, 400)); out['music_' + key] = await peak(anM, 4000); }
    S.music(null); S.ambience('l4'); await new Promise(r => setTimeout(r, 2500)); out.amb_l4 = await peak(anM, 3000);
    return out;
  });
  console.log(JSON.stringify(r));
  await done();
})();
