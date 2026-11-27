// Limba personajelor: cel putin 30 de cuvinte pentru fiecare erou, toate diferite, toate se aud la volum normal.
// Jocul: variabila JOC (bubu sau lupta). Compara si cu celalalt joc: cuvintele celor doua jocuri trebuie sa fie diferite.
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const r = await page.evaluate(async () => {
    const G = __game, S = G.Snd, d = S.debug(), ac = d.ac; if (!ac) return { error: 'no audio' };
    await ac.resume(); G.CONFIG.words.on = false;       // this test is about the synthesized words (BABBLE); the recorded voice has tests/limba.js
    const words = S.words(), other = S.words(G.GAME === 'lupta' ? 'bubu' : 'lupta');
    const out = { keys: [words[0] && Object.keys(words[0]).length, words[1] && Object.keys(words[1]).length], same: null, peaks: {} };
    const sig = w => JSON.stringify(w);
    const all = [];
    for (const k of [0, 1]) for (const key of Object.keys(words[k])) all.push(sig(words[k][key]));
    out.distinct = new Set(all).size; out.total = all.length;
    const oth = new Set(); for (const k of [0, 1]) for (const key of Object.keys(other[k])) oth.add(sig(other[k][key]));
    out.sameAsOtherGame = all.filter(x => oth.has(x)).length;
    const an = ac.createAnalyser(); an.fftSize = 2048; d.master.connect(an); const buf = new Float32Array(2048);
    const peak = async ms => { let p = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { an.getFloatTimeDomainData(buf); for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs(buf[i])); await new Promise(r => setTimeout(r, 10)); } return +p.toFixed(3); };
    for (const k of [0, 1]) for (const key of Object.keys(words[k])) {
      await new Promise(r => setTimeout(r, 900));          // let the hero finish the last word
      S.talk(k, key); out.peaks[k + ':' + key] = await peak(1000);
    }
    return out;
  });
  const quiet = Object.entries(r.peaks || {}).filter(([, v]) => v < 0.02).map(([k]) => k);
  console.log('keys per hero', JSON.stringify(r.keys), 'different words', r.distinct, 'of', r.total, '| la fel ca in celalalt joc:', r.sameAsOtherGame);
  console.log('quiet (below 0.02):', quiet.length ? quiet.join(' ') : 'none');
  console.log('peak range', Math.min(...Object.values(r.peaks || { a: 0 })), Math.max(...Object.values(r.peaks || { a: 0 })));
  const srt = Object.entries(r.peaks || {}).sort((x, y) => y[1] - x[1]);
  console.log('cele mai tari:', srt.slice(0, 4).map(x => x.join(' ')).join(', '), '| cele mai incete:', srt.slice(-4).map(x => x.join(' ')).join(', '));
  console.log(r.error ? r.error : (r.distinct === r.total && !quiet.length && r.keys[0] >= 30 && r.keys[1] >= 30 && r.sameAsOtherGame === 0 ? 'sunete-personaje OK' : 'NEREUSIT'));
  await done();
})();
