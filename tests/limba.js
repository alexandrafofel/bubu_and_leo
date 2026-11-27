// T13: vocile eroilor (Boon si Killer): clipuri inregistrate in fisier, redate prin Web Audio in difuzorul eroului,
// balonul cu traducerea, dictionarul, salvarea cuvintelor. Rulat din tests/out/.
const boot = require('./common.js');
const NEED = ['hello', 'ready', 'egg', 'eggs5', 'star', 'giant', 'power', 'powerBig', 'hurt', 'dizzy', 'recover', 'drop', 'regain', 'hide', 'unhide', 'beetleWake', 'beetleStun', 'wind', 'mud', 'bridge', 'butterfly', 'guardHit', 'notYet', 'guardGone', 'bored', 'callFriend', 'together', 'nestOpen', 'levelWin', 'bossDown', 'help', 'rescue', 'thanks', 'run', 'power2', 'power2Big', 'hurry', 'puff', 'hum', 'effort', 'george'];
(async () => {
  const { page, done, shot } = await boot();
  const ev = (f, a) => page.evaluate(f, a);
  const res = [];                                                              // [nr, ce verifica, ok, detalii]
  const chk = (n, what, ok, d) => { res.push([n, what, !!ok, d || '']); console.log((ok ? 'ok   ' : 'NEREUSIT ') + n + ' ' + what + (d ? '  (' + d + ')' : '')); };
  await page.waitForTimeout(1500);
  // 1: clipurile sunt in fisier si se decodeaza
  const a = await ev(async () => {
    const S = __game.Snd; for (let i = 0; i < 60 && !S.voiceReady(); i++) await new Promise(r => setTimeout(r, 100));
    const set = VOICE_DATA.lupta; return { ready: S.voiceReady(), n: [S.voiceCount(0), S.voiceCount(1)], len: [set[0].length, set[1].length],
      keys: set.map(L => { const o = {}; L.forEach(w => o[w.k] = (o[w.k] || 0) + 1); return o; }),
      txt: set.map(L => L.filter(w => !w.ro || !w.en || !w.say || w.ro.length > 26 || w.en.length > 26).length) };
  });
  chk(1, 'fiecare erou are clipurile lui, toate decodate', a.ready && a.n[0] === a.len[0] && a.n[1] === a.len[1] && a.len[0] >= 40 && a.len[1] >= 40, JSON.stringify(a.n));
  chk(2, 'toate momentele din joc au cate o replica la fiecare erou', [0, 1].every(k => NEED.every(key => a.keys[k][key] >= 1)), NEED.filter(key => !(a.keys[0][key] >= 1 && a.keys[1][key] >= 1)).join(' '));
  chk(3, 'fiecare replica are text in romana si engleza (cel mult 26 de litere)', a.txt[0] === 0 && a.txt[1] === 0);
  // 4: durata, varful, vocile se deosebesc
  const b = await ev(async () => {
    const S = __game.Snd, ac = S.debug().ac, set = VOICE_DATA.lupta, out = { max: 0, peak: 0, zcr: [], dur: [] };
    for (const k of [0, 1]) {
      let z = 0, n = 0, d = 0, cnt = 0;
      for (let i = 0; i < set[k].length; i++) {
        const bin = atob(set[k][i].d), u = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) u[j] = bin.charCodeAt(j);
        const buf = await ac.decodeAudioData(u.buffer), x = buf.getChannelData(0); out.max = Math.max(out.max, buf.duration); d += buf.duration; cnt++;
        for (let j = 0; j < x.length; j++) { out.peak = Math.max(out.peak, Math.abs(x[j])); if (j && (x[j] > 0) !== (x[j - 1] > 0) && Math.abs(x[j]) > 0.02) z++; } n += x.length;
      }
      out.zcr.push(z / n * 24000); out.dur.push(d / cnt);
    }
    return out;
  });
  chk(4, 'nicio replica nu e mai lunga de 3.4 s si niciuna nu depaseste 1', b.max <= 3.4 && b.peak <= 1.0, 'max ' + b.max.toFixed(2) + ' s, varf ' + b.peak.toFixed(2));
  chk(5, 'cele doua voci se aud diferit (inaltime medie si durata medie)', Math.abs(b.zcr[0] - b.zcr[1]) / Math.max(...b.zcr) > 0.08 || Math.abs(b.dur[0] - b.dur[1]) / Math.max(...b.dur) > 0.1, 'zcr ' + b.zcr.map(x => x.toFixed(0)).join('/') + ', durata ' + b.dur.map(x => x.toFixed(2)).join('/'));
  // 6: vocea merge in difuzorul eroului, nu in al prietenului
  const c = await ev(async () => {
    const S = __game.Snd, d = S.debug(), ac = d.ac, an = (n) => { const x = ac.createAnalyser(); x.fftSize = 2048; n.connect(x); return x; };
    const bus0 = ac.createGain(); bus0.connect(ac.destination); bus0.lead = 0; d.outs[0] = bus0;            // "controllerul" lui Boon
    const a0 = an(bus0), aC = an(d.chrBus), buf = new Float32Array(2048);
    const peak = async (x, ms) => { let p = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { x.getFloatTimeDomainData(buf); for (const v of buf) p = Math.max(p, Math.abs(v)); await new Promise(r => setTimeout(r, 15)); } return p; };
    await new Promise(r => setTimeout(r, 4500));
    const id0 = S.talk(0, 'hurt'), p0 = await peak(a0, 900), pc = await peak(aC, 100);
    await new Promise(r => setTimeout(r, 2500));
    const id1 = S.talk(1, 'hurt'), p1 = await peak(aC, 900), q0 = await peak(a0, 100);
    d.outs[0] = null;
    return { id0, id1, p0, pc, p1, q0 };
  });
  chk(6, 'cuvantul lui Boon iese doar in difuzorul lui Boon, cel al lui Killer in celalalt', c.id0 >= 0 && c.id1 >= 0 && c.p0 > 0.05 && c.pc < 0.02 && c.p1 > 0.05 && c.q0 < 0.02, JSON.stringify({ id0: c.id0, id1: c.id1, p0: +c.p0.toFixed(2), pc: +c.pc.toFixed(3), p1: +c.p1.toFixed(2), q0: +c.q0.toFixed(3) }));
  // 7: in nivel: lovit -> cuvant, balon, dictionar, salvare
  await ev(() => { __game.Game.diff = ['normal', 'normal']; localStorage.clear(); __game.Save.data = null; go(0); __game.Opt.lang = 'ro'; });
  const d = await ev(async () => {
    const G = __game, P = G.P, h = P.heroes[0]; await new Promise(r => setTimeout(r, 4500));
    h.ringHits = G.CONFIG.ring.hits; h.inv = 0; h.dizzy = 0; G.hitHero(h, h.x - 60, h.y); step(40);
    const w = P.words[0], boxes = (P.wordBoxes || []).slice();
        return { w: w && { id: w.id, key: w.key, fresh: w.fresh, say: w.say, mean: w.mean }, boxes, lex: G.Save.lexOf(0).slice(), hy: h.y };
  });
  chk(7, 'un erou lovit spune un cuvant: apare balonul cu traducerea si cuvantul intra in dictionar', d.w && d.w.key === 'hurt' && d.w.fresh && d.w.mean === 'Au!' && d.boxes.length === 1 && d.lex.includes(d.w.id), JSON.stringify(d.w));
  await shot('limba-balon-ro');
  // 8: balonul nu acopera niciun erou si nu intra sub banda de sus
  const e = await ev(() => {
    const G = __game, P = G.P, v = { l: 0, tp: 0, z: 1 };
    const cam = P.cam, z = cam.zoom, l = cam.x - 960 / z, tp = cam.y - 540 / z, bad = [];
    for (const b of (P.wordBoxes || [])) {
      if (b.y - b.h / 2 < 132) bad.push('banda');
      for (const h of P.heroes) { const hx = (h.x - l) * z, hy = (h.y - tp) * z; if (Math.abs(hx - b.x) < b.w / 2 + 40 && hy - 90 * z < b.y + b.h / 2 && hy + 20 * z > b.y - b.h / 2) bad.push('erou ' + h.k); }
    }
    return bad;
  });
  chk(8, 'balonul nu acopera un erou si nu coboara sub banda de sus', e.length === 0, e.join(','));
  // 9: setarea "Text la cuvinte" si CONFIG.babble
  const f = await ev(async () => {
    const G = __game, P = G.P; G.Opt.words = false; await new Promise(r => setTimeout(r, 4500)); const id = G.Snd.talk(1, 'star'); if (id >= 0) { /* said by the test, not by the game */ }
    P.words[1] = null; G.Snd.talk(1, 'power'); step(3);
    const offBoxes = P.wordBoxes.length; G.Opt.words = true; G.CONFIG.babble = false;
    await new Promise(r => setTimeout(r, 4500)); const idOff = G.Snd.talk(0, 'star'); G.CONFIG.babble = true;
    return { id, offBoxes, idOff };
  });
  chk(9, '"Text la cuvinte: Nu" ascunde balonul si lasa sunetul; babble=false le opreste pe amandoua', f.id >= 0 && f.offBoxes === 0 && f.idOff === -1, JSON.stringify(f));
  // 10: momentele noi: fredonat la mers, respiratie la alergat
  const g = await ev(async () => {
    const G = __game, S = G.Snd, log = [], orig = S.talk; S.talk = (k, key) => { log.push(k + ':' + key); return orig.call(S, k, key); };
    G.Game.diff = ['normal', 'normal']; go(0); const P = G.P, h = P.heroes[0]; h.down = false; h.dizzy = 0; h.inv = 99; P.L.beetles.length = 0; const x0 = h.x;
    await new Promise(r => setTimeout(r, 4500));   // the pause between two words runs on the real clock
    P.L.beetles.length = 0; h.down = false; h.dizzy = 0; h.inv = 99; P.words[0] = null; log.length = 0;
    for (let s = 0; s < 11; s++) { inp[0].x = 1; inp[0].y = 0; h.x = x0; for (let q = 0; q < 6; q++) { P.L.beetles.length = 0; h.down = false; h.dizzy = 0; h.inv = 99; step(10); } }
    const hum = log.filter(x => x === '0:hum').length, hlog = log.slice(), hT = h.humT, mv0 = h.moving;
    inp[0].x = 0; step(30); log.length = 0; await new Promise(r => setTimeout(r, 3000));
    inp[0].x = 1; inp[0].y = 0; h.x = x0; for (let s = 0; s < 8; s++) { h.x = x0; h.dizzy = 0; h.inv = 99; inp[0].runP = s === 0; step(1); inp[0].runP = false; step(29); }
    const puff = log.filter(x => x === '0:puff').length, run = log.filter(x => x === '0:run').length;
    inp[0].x = 0; S.talk = orig; return { hum, puff, run, ran: h.run, mv: h.moving, pT: h.puffT, v: Math.hypot(h.vx,h.vy), x: h.x, down: h.down, log: log.slice(0,6) };
  });
  chk(10, 'dupa 10 s de mers un erou fredoneaza; alergand rasufla din cand in cand', g.hum >= 1 && g.puff >= 1, JSON.stringify(g));
  // 11: dictionar din pauza: X asculta un cuvant aflat, nu si unul necunoscut; sageata pe filele de sus schimba eroul; O iese
  const m = await ev(() => {
    const G = __game, S = G.Snd, played = [], orig = S.sayWord; S.sayWord = (k, i) => { played.push(k + ':' + i); return orig.call(S, k, i); };
    const stepM = (fl) => { G.Input.poll(1 / 60); Object.assign(G.Input.menu, fl || {}); G.update(1 / 60); G.draw(); };
    const out = {}; G.Game.paused = true; stepM();
    const row = G.pauseRows().find(r => r.label === G.T('pause.dict')); out.row = !!row; row.ok(); stepM();
    const D = G.UI.dict; out.open = !!D;
    const known = G.Save.lexOf(0)[0], unknown = G.dictList(0).findIndex((w, i) => !G.Save.lexOf(0).includes(i));
    D.k = 0; D.sel = known; stepM({ ok: true }); out.knownPlayed = played.includes('0:' + known);
    played.length = 0; D.sel = unknown; stepM({ ok: true }); out.unknownPlayed = played.length > 0;
    D.sel = -1; stepM({ right: true }); out.tab = G.UI.dict.k; stepM({ left: true }); out.tab2 = G.UI.dict.k;
    D.sel = known; D.k = 0; stepM(); out.drawn = true;
    window.__dictShot = true; return out;
  });
  await shot('limba-dictionar-ro');
  const m2 = await ev(() => {
    const G = __game, stepM = (fl) => { G.Input.poll(1 / 60); Object.assign(G.Input.menu, fl || {}); G.update(1 / 60); G.draw(); };
    stepM({ back: true }); const closed = !G.UI.dict; G.Game.paused = false; stepM();
    G.Game.toTitle(); stepM(); const t = G.titleMenu().map(i => i.id);
    G.UI.dict = null; G.openDict(); stepM(); const fromTitle = !!G.UI.dict; G.Opt.lang = 'en'; stepM(); stepM({ back: true }); G.Opt.lang = 'ro';
    return { closed, t, fromTitle, after: !G.UI.dict };
  });
  chk(11, 'dictionarul se deschide din pauza, X asculta doar cuvintele aflate, sagetile schimba eroul, O iese', m.row && m.open && m.knownPlayed && !m.unknownPlayed && m.tab === 1 && m.tab2 === 0 && m2.closed, JSON.stringify(m));
  chk(12, 'din meniul de start apare randul Dictionar (cand exista cuvinte) si dictionarul se deschide', m2.t.includes('dict') && m2.fromTitle && m2.after, JSON.stringify(m2));
  // 13: salvarea: o salvare veche (fara lex) se incarca; cuvintele se pastreaza dupa reincarcarea paginii
  const n1 = await ev(() => { const G = __game; G.Save.write(); const lex = JSON.parse(localStorage.getItem(G.CONFIG.saveKey)).g2.lex; return { lex }; });
  await page.reload(); await page.waitForTimeout(1200);
  const n2 = await ev(() => { const G = __game; G.Save.load(); return { a: G.Save.lexOf(0), b: G.Save.lexOf(1) }; });
  await ev(() => { const G = __game, d = JSON.parse(localStorage.getItem(G.CONFIG.saveKey)); delete d.g2.lex; localStorage.setItem(G.CONFIG.saveKey, JSON.stringify(d)); });
  await page.reload(); await page.waitForTimeout(1200);
  const n3 = await ev(() => { const G = __game; G.Save.load(); const before = G.Save.lexOf(0).length; G.Save.lexAdd(0, 5); return { before, after: G.Save.lexOf(0).slice() }; });
  chk(13, 'cuvintele aflate se pastreaza dupa reincarcare; o salvare fara lex se incarca (dictionar gol) si primeste cuvinte', n1.lex && n2.a.length >= 1 && n3.before === 0 && n3.after.length === 1, JSON.stringify([n1.lex, n2, n3]));
  await done();
  const bad = res.filter(r => !r[2]);
  console.log(bad.length ? 'NEREUSIT: ' + bad.map(r => r[0]).join(',') : 'limba OK');
})();
