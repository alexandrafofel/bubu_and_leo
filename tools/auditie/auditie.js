/* ==========================================================================
   T13 audition page (not part of the game). Built by tools/auditie/build.sh:
   01-config.js + GAME + 03-audio.js (the real game sounds) + this file.
   It adds, only here, the new voice: soft consonants, the generated words, the phrases,
   so the owner can listen (also in the controllers) before anything goes into the game.
   ========================================================================== */
(() => {
  const $ = s => document.querySelector(s);
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const HERO = ['Boon', 'Killer'];
  // the same voices as the game (03-audio.js, VOICES.lupta)
  const VO = [{ note: 47, form: 0.8, gain: 1.45, growl: 24 }, { note: 66, form: 1.25, gain: 0.9 }];
  const FORM = { a: [800, 1200], e: [500, 1900], i: [300, 2300], o: [500, 900], u: [320, 800] };
  // where the "mouth" starts for each consonant, before it opens to the vowel
  const LOCUS = { l: [320, 1000], r: [450, 1100], w: [320, 800], y: [300, 2300], b: [300, 800], d: [350, 1700], g: [300, 2200], n: [300, 1700], m: [300, 900] };
  const bus = k => { const d = Snd.debug(); return d.outs[k] && d.outs[k].context.state === 'running' ? d.outs[k] : d.chrBus; };
  const now = b => b.context.currentTime + (b.lead || 0) + 0.01;

  /* A short hum through a low-pass: "m" and "n" (and a soft "r" at the end of a word for Boon). */
  function murmur(A, out, t, f, dur, lp, g, trem) {
    const o = A.createOscillator(), fl = A.createBiquadFilter(), gn = A.createGain();
    o.type = 'triangle'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = lp; fl.Q.value = 0.7;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(g, t + 0.012); gn.gain.setValueAtTime(g, t + dur * 0.6); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(fl); fl.connect(gn);
    if (trem) { const tr = A.createGain(), lfo = A.createOscillator(), lg = A.createGain(); tr.gain.value = 0.6; lfo.frequency.value = trem; lg.gain.value = 0.4; lfo.connect(lg); lg.connect(tr.gain); gn.connect(tr); tr.connect(out); lfo.start(t); lfo.stop(t + dur + 0.02); }
    else gn.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  }
  /* Killer's "k" and "t": a 15 ms tap of a triangle wave through a low-pass. Not noise, not harsh. */
  function tap(A, out, t, f, g) {
    const o = A.createOscillator(), fl = A.createBiquadFilter(), gn = A.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.015);
    fl.type = 'lowpass'; fl.frequency.value = 1800;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(g, t + 0.002); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);
    o.connect(fl); fl.connect(gn); gn.connect(out); o.start(t); o.stop(t + 0.03);
  }
  /* One syllable: [vowel, semitones, length, slide, consonant before, sound after].
     Without the last two it is exactly the syllable of the game. Returns how long it takes. */
  function sylC(b, t, s, V, lev) {
    const [v, st, d, sl, c, coda] = s, A = b.context;
    const up = b.small && V.note + st < 56 ? 12 : 0, f0 = mtof(V.note + st + up), f1 = f0 * Math.pow(2, sl / 12);
    const G = 0.62 * (V.gain || 1) * (lev == null ? 1 : lev);
    const out = A.createGain();
    if (V.growl) { const tr = A.createGain(), lfo = A.createOscillator(), lg = A.createGain(); tr.gain.value = 0.68; lfo.frequency.value = V.growl; lg.gain.value = 0.32; lfo.connect(lg); lg.connect(tr.gain); out.connect(tr); tr.connect(b); lfo.start(t); lfo.stop(t + d + 0.25); }
    else out.connect(b);
    let tv = t;
    if (c === 'm' || c === 'n') { murmur(A, out, t, f0, 0.06, c === 'm' ? 380 : 480, G * 0.55); tv = t + 0.045; }
    if (c === 'k' || c === 't') { tap(A, out, t, c === 'k' ? 720 : 1300, G * 0.3); tv = t + 0.018; }
    const cd = 'bdg'.includes(c || '-') ? 0.035 : 'lrwy'.includes(c || '-') ? (c === 'w' || c === 'y' ? 0.07 : 0.05) : 0.03;
    const g = A.createGain(), g0 = 'bdg'.includes(c || '-') ? 0.15 : 'lrwy'.includes(c || '-') ? 0.4 : 0;
    const att = c && !'mnkt'.includes(c) ? cd : 0.015;
    g.gain.setValueAtTime(Math.max(0.0001, G * g0), tv); g.gain.linearRampToValueAtTime(G, tv + att); g.gain.setValueAtTime(G, tv + Math.max(att, d * 0.6)); g.gain.exponentialRampToValueAtTime(0.0001, tv + d + 0.05);
    g.connect(out);
    if (c === 'r') { const lfo = A.createOscillator(), lg = A.createGain(); lfo.frequency.value = 28; lg.gain.value = G * 0.3; lfo.connect(lg); lg.connect(g.gain); lfo.start(tv); lfo.stop(tv + cd); }
    const pStart = 'bdg'.includes(c || '-') ? f0 * Math.pow(2, -4 / 12) : f0;
    for (const [mul, lv] of [[1, 1], [2, 0.55]]) {
      const o = A.createOscillator(), og = A.createGain(); o.type = 'triangle'; og.gain.value = lv;
      o.frequency.setValueAtTime(pStart * mul, tv); if (pStart !== f0) o.frequency.exponentialRampToValueAtTime(f0 * mul, tv + cd);
      o.frequency.exponentialRampToValueAtTime(f1 * mul, tv + d);
      o.connect(og);
      FORM[v].forEach((F, j) => {
        const bp = A.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.2;
        const L = LOCUS[c];
        if (L) { bp.frequency.setValueAtTime(L[j] * V.form, tv); bp.frequency.linearRampToValueAtTime(F * V.form, tv + cd); } else bp.frequency.value = F * V.form;
        og.connect(bp); bp.connect(g);
      });
      if (mul === 1) { const lp = A.createBiquadFilter(), dg = A.createGain(); lp.type = 'lowpass'; lp.frequency.value = 1500; dg.gain.value = 0.22; o.connect(lp); lp.connect(dg); dg.connect(g); }
      o.start(tv); o.stop(tv + d + 0.1);
    }
    let len = (tv - t) + d * 0.85;
    if (coda === 'n' || coda === 'm') { murmur(A, out, tv + d * 0.85, f1, 0.07, 420, G * 0.5); len += 0.06; }
    if (coda === 'r') { murmur(A, out, tv + d * 0.85, f1, 0.08, 520, G * 0.45, 28); len += 0.07; }
    if (coda === 'k' || coda === 't') { tap(A, out, tv + d * 0.9, coda === 'k' ? 720 : 1300, G * 0.32); len += 0.04; }
    return len;
  }
  function sayS(k, syls, t, lev) { const b = bus(k); if (t == null) t = now(b); for (const s of syls) t += sylC(b, t, s, VO[k], lev); return t; }
  const lenOf = syls => syls.reduce((a, s) => a + s[2] * 0.85 + (s[4] && 'mn'.includes(s[4]) ? 0.045 : s[4] && 'kt'.includes(s[4]) ? 0.018 : 0) + (s[5] ? 0.06 : 0), 0);

  // ---- the words: generated from rules and a fixed number (seed), the same every time ----
  function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const PHON = [
    { // Boon: round, low, heavy, a little growl. o u a; r g b m w; ends in -ur, -o, -ar
      seed: 7303, vow: 'ooouuuaaa', con: 'rrggbbmmw', onset: 0.75, coda: 'nr', codaP: 0.12, dur: [0.15, 0.21], tones: [0, 2, 4, 5, 7, -2], step: -2, slide: [-4, 1],
      end: [['u', 'r'], ['o', null], ['a', 'r']] },
    { // Killer: short, quick, like shouts at a match. e a i o; d g k t; ends in -k, -t, -e
      seed: 7304, vow: 'eeeaaiiio', con: 'ddggkkt', onset: 0.85, coda: 'kt', codaP: 0.06, dur: [0.06, 0.09], tones: [0, 3, 5, 7, 10, 12], step: 3, slide: [-1, 4],
      end: [['e', 'k'], ['a', 't'], ['e', null], ['i', 'k']] }
  ];
  // A few meanings from each of the 12 categories (the full list of 1000 comes in the implementation)
  const LEX_SAMPLE = [
    ['creat', 'Vietăți', 'pasăre|bird, fluture|butterfly, gândac|beetle, broască|frog, dinozaur|dinosaur, pisică|cat, peștișor|little fish, copil|child, mama|mom, prieten|friend, robot|robot, melc|snail'],
    ['corp', 'Corp', 'mână|hand, picior|foot, ochi|eye, burtă|tummy, coadă|tail, cap|head, gheare|claws, dinte|tooth'],
    ['natura', 'Natură', 'soare|sun, lună|moon, stea|star, ploaie|rain, vânt|wind, râu|river, junglă|jungle, frunză|leaf, floare|flower, copac|tree, piatră|stone, noapte|night'],
    ['loc', 'Locuri', 'cuib|nest, casă|house, peșteră|cave, pod|bridge, poartă|gate, turn|tower, drum|road, deal|hill, canion|canyon, insulă|island'],
    ['lucru', 'Lucruri', 'minge|ball, os|bone, mănușă|glove, cristal|crystal, felinar|lantern, cheie|key, bolovan|boulder, cușcă|cage, lumină|light, umbră|shadow'],
    ['mancare', 'Mâncare', 'miere|honey, măr|apple, pâine|bread, lapte|milk, prăjitură|cake, banană|banana'],
    ['actiune', 'Acțiuni', 'merg|walk, alerg|run, sar|jump, iau|take, dau|give, arunc|throw, ajut|help, caut|look for, găsesc|find, râd|laugh, dorm|sleep, vine|comes, lovesc|hit, deschid|open'],
    ['simt', 'Stări', 'bucurie|joy, mirare|wonder, curajos|brave, obosit|tired, somn|sleepy, foame|hungry, drag|dear'],
    ['insus', 'Însușiri', 'mare|big, mic|small, repede|fast, încet|slow, cald|warm, rece|cold, sus|up, jos|down, roșu|red, turcoaz|turquoise, frumos|pretty, bun|good'],
    ['numar', 'Numere', 'unu|one, doi|two, trei|three, mult|many, acum|now, încă o dată|again, stânga|left, dreapta|right'],
    ['mic', 'Cuvinte mici', 'eu|me, tu|you, noi|we, da|yes, nu|no, și|and, hai|come on, uite|look, ia|here, pa|bye, mulțumesc|thanks, bravo|well done, împreună|together, au|ouch'],
    ['joc', 'Din joc', 'diamant|diamond, steluță|little star, placă|plate, banda|band, rază|ray, nivel|level, pac|bonk, ajutor|help!, deschis|open, cotă|share']
  ];
  const LEX = []; LEX_SAMPLE.forEach(([cat, name, s]) => s.split(', ').forEach(p => { const [ro, en] = p.split('|'); LEX.push({ id: LEX.length, cat, catName: name, ro, en }); }));
  const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const STOP = new Set(LEX.flatMap(m => [plain(m.ro), plain(m.en)]).concat(['boon', 'killer', 'george', 'mama', 'tata', 'caca', 'pipi', 'prost', 'kaka', 'kuku', 'dede', 'gaga', 'mumu', 'bubu', 'leo', 'dumb', 'kill', 'dead', 'gun', 'kut', 'bum', 'murg']));
  const near1 = (a, b) => { if (Math.abs(a.length - b.length) > 1) return false; let i = 0, j = 0, e = 0; while (i < a.length && j < b.length) { if (a[i] === b[j]) { i++; j++; continue; } if (++e > 1) return false; if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; } } return e + (a.length - i) + (b.length - j) <= 1; };
  const shortCat = { mic: 1, corp: 1, actiune: 1 };
  const x0 = s => s[4] || '';
  function buildLex() {
    const used = new Set(), out = [[], []];
    PHON.forEach((P, k) => {
      const r = mulberry32(P.seed), pick = s => s[r() * s.length | 0], rng = (a, b) => a + r() * (b - a);
      for (const m of LEX) {
        let ok = null;
        for (let tries = 0; tries < 400 && !ok; tries++) {
          const n = shortCat[m.cat] ? 1 + (r() < 0.6 ? 1 : 0) : 2 + (r() < 0.45 ? 1 : 0), syl = []; let w = '', tone = pick(P.tones);
          for (let i = 0; i < n; i++) {
            const last = i === n - 1; let v = pick(P.vow), c = r() < P.onset || i > 0 ? pick(P.con) : null, coda = null;
            if (last) { const e = pick(P.end); v = e[0]; coda = e[1]; } else if (r() < P.codaP) coda = pick(P.coda);
            if (i > 0 && !c) c = pick(P.con);
            const d = +rng(P.dur[0], P.dur[1]).toFixed(3), sl = Math.round(rng(P.slide[0], P.slide[1]) + (last ? (k === 0 ? -2 : 2) : 0));
            syl.push([v, tone, last ? +(d * 1.35).toFixed(3) : d, sl, c, coda]); w += (c || '') + v + (coda || '');
            tone = Math.max(-5, Math.min(14, tone + P.step + Math.round(rng(-2, 3))));
          }
          const parts = syl.map(x => (x[4] || '') + x[0] + (x[5] || ''));
          if (parts.some((q, i) => i && (q === parts[i - 1] || (syl[i - 1][5] && syl[i - 1][5] === x0(syl[i]))))) continue;
          if (lenOf(syl) > 0.9 || used.has(w) || STOP.has(w) || [...STOP].some(s => s.length > 2 && (w.startsWith(s) || s === w))) continue;
          if (tries < 200 && out[k].some(o => o.cat === m.cat && near1(o.w, w))) continue;
          ok = { w, syl, cat: m.cat };
        }
        if (!ok) throw new Error('no word for ' + m.ro);
        used.add(ok.w); out[k].push(ok);
      }
    });
    return out;
  }
  const t0 = performance.now(); const WORDS = buildLex(); const genMs = performance.now() - t0;
  const W = (k, ro) => { const m = LEX.find(x => x.ro === ro); return m ? WORDS[k][m.id] : null; };

  // ---- the moments: game sound + exclamation (the 47 the kids already know) + words ----
  const busy = [0, 0];
  function exclLen(k, key) { const w = Snd.words('lupta')[k][key]; if (!w) return 0; const s = Array.isArray(w[0][0]) ? w[0] : w; return s.reduce((a, x) => a + x[2] * 0.85, 0) + 0.06; }
  /* phrase: an exclamation, then 1 - 3 words. Shows the bubble with what it means. */
  function phrase(k, excl, words, ro, en) {
    const b = bus(k); let t = now(b);
    if (excl) { Snd.talk(k, excl); t += exclLen(k, excl); }
    const shown = [];
    for (const r of words) { const w = W(k, r); if (!w) continue; t = sayS(k, w.syl, t) + 0.05; shown.push(w.w); }
    bubble(k, shown.join(' '), lang === 'ro' ? ro : en);
    busy[k] = b.context.currentTime + (t - now(b));
    return t;
  }
  const step = (k, foot, vol) => Snd.play('step', k * 2 + (foot & 1), k, vol);
  const HUM = [ // walking for a while: a soft little tune, quiet
    [['u', 0, 0.16, 0, 'm'], ['u', 2, 0.16, 0, 'm'], ['o', 4, 0.26, -2, 'm']],
    [['a', 0, 0.06, 0, 'd'], ['i', 3, 0.06, 0, 'd'], ['a', 5, 0.06, 0, 'd'], ['e', 7, 0.12, 2, 'd']]
  ];
  const PUFF = [[['u', -2, 0.07, -3]], [['a', 4, 0.04, -2]]];     // running: a little breath, very quiet
  const EFFORT = [[['a', 0, 0.09, -5, 'g']], [['e', 5, 0.05, 3, 't', 'k']]];      // every hit: "ga!" for Boon, "tek!" for Killer
  const SIT = [
    { id: 'walk', ro: 'Merge', when: 'Pas la fiecare pas (ca acum). După 10 s de mers fără oprire: fredonează scurt și încet, apoi iar 10 s.', play(k) { for (let i = 0; i < 6; i++) setTimeout(() => step(k, i), i * 330); setTimeout(() => sayS(k, HUM[k], null, 0.45), 2000); } },
    { id: 'run', ro: 'Aleargă (L3)', when: 'La pornire: „fiu” + exclamația + „Repede!” (o dată la 4 s). Cât aleargă: pași mai deși și o respirație mică la 0,45 s.', play(k) { Snd.play('dash', 0, k); setTimeout(() => phrase(k, 'run', ['repede'], 'Repede!', 'Fast!'), 120); for (let i = 0; i < 10; i++) setTimeout(() => step(k, i, 0.8), 600 + i * 200); for (let i = 0; i < 4; i++) setTimeout(() => sayS(k, PUFF[k], null, 0.3), 900 + i * 450); } },
    { id: 'hit', ro: 'Lovește (✕)', when: 'La fiecare lovitură: sunetul puterii + un „ga!” / „tek!” scurt. Când nimerește un robot: „Pac!”, o dată din trei.', play(k) { Snd.play(k ? 'kick' : 'stomp', 0.5, k); sayS(k, EFFORT[k]); setTimeout(() => phrase(k, null, ['pac'], 'Pac!', 'Bonk!'), 450); } },
    { id: 'power2', ro: 'A doua putere (□)', when: 'Sunetul puterii + exclamația + numele puterii („Os!” / „Mănușa!”). Fraza o dată la 4 s.', play(k) { Snd.play(k ? 'gloves' : 'bone', 0.6, k); phrase(k, 'power2', [k ? 'mănușă' : 'os'], k ? 'Mănușa!' : 'Os!', k ? 'Glove!' : 'Bone!'); } },
    { id: 'enemy', ro: 'Învinge un robot', when: 'Robotul dispare, iese diamantul. „Pa, robotule!”, o dată din două.', play(k) { Snd.play('poof'); setTimeout(() => phrase(k, 'guardGone', ['pa', 'robot'], 'Pa, robotule!', 'Bye, robot!'), 250); } },
    { id: 'hurt', ro: 'E lovit', when: 'Mereu: sunetul de lovit + exclamația + „Au!”. Dacă rămâne jos: „Ajutor!” către prieten.', play(k) { Snd.play('bonk', 0, k); phrase(k, 'hurt', ['au'], 'Au!', 'Ouch!'); setTimeout(() => phrase(k, 'help', ['ajutor'], 'Ajutor!', 'Help!'), 1300); } },
    { id: 'star', ro: 'Ia o steluță', when: 'Mereu: clopoțeii + exclamația + „O steluță!”.', play(k) { Snd.play('star', 0, k); setTimeout(() => phrase(k, 'star', ['steluță'], 'O steluță!', 'A little star!'), 300); } },
    { id: 'gem', ro: 'Ia un diamant', when: 'Cristalul sună mereu. „Diamant!” o dată din trei și nu mai des de 4 s.', play(k) { Snd.play('egg', 2, k); setTimeout(() => phrase(k, 'egg', ['diamant'], 'Un diamant!', 'A diamond!'), 150); } },
    { id: 'give', ro: 'Dă un diamant (L1)', when: '„Ia, prietene!” Prietenul răspunde „Mulțumesc!” în controllerul lui.', play(k) { Snd.play('give', 0, k); phrase(k, 'callFriend', ['ia', 'prieten'], 'Ia, prietene!', 'Here, friend!'); setTimeout(() => phrase(1 - k, 'thanks', ['mulțumesc'], 'Mulțumesc!', 'Thanks!'), 1400); } },
    { id: 'rescue', ro: 'Ajută prietenul (○)', when: 'Cel care ajută: „Hai, sus!”. Cel ajutat: „Mulțumesc!”. Fiecare în controllerul lui.', play(k) { Snd.play('heal', 0, 1 - k); phrase(k, 'rescue', ['hai', 'sus'], 'Hai, sus!', 'Up you get!'); setTimeout(() => phrase(1 - k, 'thanks', ['mulțumesc'], 'Mulțumesc!', 'Thanks!'), 1300); } },
    { id: 'hello', ro: 'Începe nivelul', when: 'O dată, după poveste: „Hai, împreună!”.', play(k) { phrase(k, 'hello', ['hai', 'împreună'], 'Hai, împreună!', 'Come on, together!'); } },
    { id: 'george', ro: 'Vine George', when: 'O dată, când apare: „Uite, vine George!”. Vesel, nu speriat.', play(k) { Snd.play('caw'); setTimeout(() => phrase(k, 'beetleWake', ['uite', 'vine'], 'Uite, vine George!', 'Look, George is coming!'), 700); } },
    { id: 'plate', ro: 'Placă / poartă', when: 'Pe placă: „Împreună!” (o dată la 6 s). Poarta se deschide: „Poarta, deschis!”.', play(k) { Snd.play('plate', 0, k); phrase(k, 'together', ['împreună'], 'Împreună!', 'Together!'); setTimeout(() => { Snd.play('gateOpen'); phrase(1 - k, 'nestOpen', ['poartă', 'deschis'], 'Poarta s-a deschis!', 'The gate is open!'); }, 1300); } },
    { id: 'win', ro: 'Câștigă nivelul', when: 'Amândoi, unul după altul: „Bravo nouă!”.', play(k) { Snd.play('win'); phrase(0, 'levelWin', ['bravo', 'noi'], 'Bravo nouă!', 'Well done, us!'); setTimeout(() => phrase(1, 'levelWin', ['bravo', 'noi'], 'Bravo nouă!', 'Well done, us!'), 1500); } },
    { id: 'retry', ro: '„Încă o dată!”', when: 'Blând, fără tristețe: „Încă o dată!”.', play(k) { Snd.play('retry'); setTimeout(() => phrase(k, 'notYet', ['încă o dată'], 'Încă o dată!', 'Once more!'), 600); } },
    { id: 'bored', ro: 'Stă degeaba', when: 'După 12 s fără nimic: „Hai! Uite!” (o dată, până se mișcă).', play(k) { phrase(k, 'bored', ['hai', 'uite'], 'Hai! Uite!', 'Come on! Look!'); } }
  ];

  // ---- the page ----
  let lang = 'ro';
  function bubble(k, word, mean) {
    const el = $('#bub' + k); if (!el) return;
    el.innerHTML = '<b>' + word.toUpperCase() + '</b><span>' + mean + '</span>'; el.classList.add('on');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200);
  }
  function rows() {
    const tb = $('#sit tbody'); tb.innerHTML = '';
    for (const s of SIT) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td><b>' + s.ro + '</b></td><td>' + s.when + '</td><td class="b"></td>';
      [0, 1].forEach(k => { const bt = document.createElement('button'); bt.className = 'h' + k; bt.textContent = '▶ ' + HERO[k]; bt.onclick = () => { start(); s.play(k); }; tr.lastChild.appendChild(bt); });
      tb.appendChild(tr);
    }
    const lx = $('#lex'); lx.innerHTML = '';
    for (const [cat, name] of LEX_SAMPLE) {
      const d = document.createElement('div'); d.className = 'cat'; d.innerHTML = '<h3>' + name + '</h3>';
      for (const m of LEX.filter(x => x.cat === cat)) {
        const r = document.createElement('div'); r.className = 'w';
        r.innerHTML = '<span class="m">' + m.ro + ' <i>' + m.en + '</i></span>';
        [0, 1].forEach(k => { const b = document.createElement('button'); b.className = 'h' + k; b.textContent = WORDS[k][m.id].w; b.onclick = () => { start(); sayS(k, WORDS[k][m.id].syl); bubble(k, WORDS[k][m.id].w, m.ro); }; r.appendChild(b); });
        d.appendChild(r);
      }
      lx.appendChild(d);
    }
    $('#gen').textContent = LEX.length * 2 + ' cuvinte generate în ' + genMs.toFixed(1) + ' ms';
  }
  function start() { Snd.init(); $('#tap').style.display = 'none'; }
  // speakers: the real code of the game (Snd.listOutputs, Snd.setSink)
  let devs = [];
  async function find() {
    start();
    const r = await Snd.listOutputs(true);
    if (!r) { $('#spkMsg').textContent = 'Chrome-ul acesta nu poate alege difuzoare (lipsește setSinkId).'; return; }
    devs = r.list;
    $('#spkMsg').textContent = r.denied ? 'Chrome nu arată numele difuzoarelor fără permisiunea pentru microfon. Apasă iar și alege „Permite”.' : devs.length + ' ieșiri audio găsite. Controllerul apare doar cu cablu USB.';
    [0, 1].forEach(k => {
      const sel = $('#spk' + k); sel.innerHTML = '<option value="">Boxele calculatorului</option>' + devs.map(d => '<option value="' + d.id + '">' + d.label + '</option>').join('');
      const pads = devs.filter(d => /controller|dualshock|dualsense|gamepad|wireless/i.test(d.label));
      if (pads[k]) { sel.value = pads[k].id; pick(k); }
    });
  }
  async function pick(k) { start(); const id = $('#spk' + k).value, d = devs.find(x => x.id === id) || null; const ok = await Snd.setSink(k, d); $('#st' + k).textContent = d ? (ok ? '✓ ' + d.label : '✗ nu merge') : 'boxele calculatorului'; }
  // controllers: pad 1 = Boon, pad 2 = Killer. Stick = walk, L3 = run, ✕ hit, □ second power, ○ got hit, △ star
  const pad = [{ prev: [], walkT: 0, walked: 0, foot: 0, runT: 0, puffT: 0, run: false }, { prev: [], walkT: 0, walked: 0, foot: 0, runT: 0, puffT: 0, run: false }];
  let lastT = performance.now();
  function poll() {
    const tN = performance.now(), dt = Math.min(0.1, (tN - lastT) / 1000); lastT = tN;
    const gps = [...(navigator.getGamepads ? navigator.getGamepads() : [])].filter(Boolean);
    $('#pads').textContent = gps.length ? gps.map((g, i) => (i < 2 ? HERO[i] : '-') + ': ' + g.id.slice(0, 40)).join(' · ') : 'niciun controller (apasă un buton pe el)';
    gps.slice(0, 2).forEach((g, k) => {
      const p = pad[k], B = i => !!(g.buttons[i] && g.buttons[i].pressed), down = i => B(i) && !p.prev[i];
      const ax = Math.hypot(g.axes[0] || 0, g.axes[1] || 0), dp = B(12) || B(13) || B(14) || B(15), moving = ax > 0.25 || dp;
      if (down(0) || down(2) || down(1) || down(3) || down(10)) start();
      if (down(0)) SIT[2].play(k); if (down(2)) SIT[3].play(k); if (down(1)) SIT[5].play(k); if (down(3)) SIT[6].play(k); if (down(4)) SIT[8].play(k);
      if (down(10) && moving) { p.run = true; Snd.play('dash', 0, k); if (p.runT <= 0) { phrase(k, 'run', ['repede'], 'Repede!', 'Fast!'); p.runT = 4; } }
      if (!moving) { p.run = false; p.walked = 0; }
      p.runT -= dt;
      if (moving) {
        p.walkT -= dt; p.walked += dt;
        if (p.walkT <= 0) { step(k, p.foot++, p.run ? 0.8 : 1); p.walkT = p.run ? 0.2 : 0.33; }
        if (p.run) { p.puffT -= dt; if (p.puffT <= 0) { sayS(k, PUFF[k], null, 0.3); p.puffT = 0.45; } }
        else if (p.walked > 10) { sayS(k, HUM[k], null, 0.45); p.walked = 0; }
      }
      p.prev = g.buttons.map(b => b.pressed);
    });
    requestAnimationFrame(poll);
  }
  window.addEventListener('load', () => {
    rows();
    $('#find').onclick = find; $('#spk0').onchange = () => pick(0); $('#spk1').onchange = () => pick(1);
    $('#lang').onclick = () => { lang = lang === 'ro' ? 'en' : 'ro'; $('#lang').textContent = lang === 'ro' ? 'Balon: română' : 'Balon: engleză'; };
    $('#test0').onclick = () => { start(); phrase(0, 'hello', ['eu', 'hai'], 'Eu sunt Boon! Hai!', 'I am Boon! Come on!'); };
    $('#test1').onclick = () => { start(); phrase(1, 'hello', ['eu', 'hai'], 'Eu sunt Killer! Hai!', 'I am Killer! Come on!'); };
    document.body.addEventListener('pointerdown', start, { once: true });
    requestAnimationFrame(poll);
  });
  window.AUD = { WORDS, LEX, SIT, PHON, sayS, phrase, lenOf, genMs };
})();
