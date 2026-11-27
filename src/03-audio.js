
/* ==========================================================================
   SOUND: everything is generated with the Web Audio API.
   Sine and triangle waves, low-pass filters, a soft generated reverb.
   ========================================================================== */
const Snd = (() => {
  let ac = null, master, musicBus, ambBus, chrBus, timer = null;
  const vol = { music: CONFIG.volume.music, amb: CONFIG.volume.ambient, chr: CONFIG.volume.characters };
  const outs = [null, null];          // where each hero's own sounds play: null = computer, or a bus on another speaker
  const sinks = {};                   // deviceId -> { ac, bus }: one extra audio output per controller speaker
  const noiseBufs = new WeakMap();
  let song = null, songKey = null, step = 0, nextT = 0, duck = 1;
  let amb = null, bedW = null, bedA = null, cricketT = 0;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  /* The last thing before any speaker: a limiter. A loud word, a stomp and the music at the same moment would otherwise
     go over what a speaker can play and sound harsh (clipping). Measured by tests/sunete-limita.js. */
  function toSpeaker(a, node) {
    const lim = a.createDynamicsCompressor(), trim = a.createGain();
    lim.threshold.value = -8; lim.knee.value = 4; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.12;
    trim.gain.value = 0.85;
    node.connect(lim); lim.connect(trim); trim.connect(a.destination);
  }
  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); for (const id in sinks) if (sinks[id].ac.state === 'suspended') sinks[id].ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ac = new AC(); } catch (e) { ac = null; return; }
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500; lp.Q.value = 0.3;
    master = ac.createGain(); master.gain.value = 1.3;
    master.connect(lp); lp.connect(comp); toSpeaker(ac, comp);
    loadVoices();
    const rev = ac.createConvolver(); rev.buffer = impulse(2.6);
    const revOut = ac.createGain(); revOut.gain.value = 0.55; rev.connect(revOut); revOut.connect(master);
    musicBus = ac.createGain(); ambBus = ac.createGain(); chrBus = ac.createGain();
    musicBus.connect(master); ambBus.connect(master); chrBus.connect(master);
    const send = (bus, g) => { const s = ac.createGain(); s.gain.value = g; bus.connect(s); s.connect(rev); };
    send(musicBus, 0.5); send(ambBus, 0.3); send(chrBus, 0.26);
    // two soft noise beds for the ambience: water and wind
    const bed = (type, f, q) => { const s = ac.createBufferSource(); s.buffer = nbuf(ac); s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(fl); fl.connect(g); g.connect(ambBus); s.start(); return g; };
    bedW = bed('lowpass', 900, 0.4); bedA = bed('bandpass', 420, 0.6);
    applyVol(); applyAmb();
    timer = setInterval(tick, 50);
  }
  function nbuf(c) {
    let b = noiseBufs.get(c);
    if (!b) { b = c.createBuffer(1, c.sampleRate * 1.5, c.sampleRate); const nd = b.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1; noiseBufs.set(c, b); }
    return b;
  }
  function impulse(sec) {             // soft room: decaying, low-passed noise
    const n = ac.sampleRate * sec | 0, b = ac.createBuffer(2, n, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let v = 0;
      for (let i = 0; i < n; i++) { const t = i / n; v += ((Math.random() * 2 - 1) * Math.pow(1 - t, 2.8) - v) * 0.22; d[i] = v * 1.5; }
    }
    return b;
  }
  function applyVol() {
    if (!ac) return;
    musicBus.gain.setTargetAtTime(vol.music * 0.55 * duck, ac.currentTime, 0.1);
    ambBus.gain.setTargetAtTime(vol.amb, ac.currentTime, 0.05);
    chrBus.gain.setTargetAtTime(vol.chr, ac.currentTime, 0.05);
    for (const id in sinks) sinks[id].bus.gain.value = vol.chr * 1.6;
  }
  function applyAmb() {
    if (!ac) return;
    bedW.gain.setTargetAtTime(amb ? (amb.water || 0) * 0.05 : 0, ac.currentTime, 0.8);
    bedA.gain.setTargetAtTime(amb ? (amb.wind || 0) * 0.045 : 0, ac.currentTime, 0.8);
  }

  // ---- building blocks: every sound is made on the bus it is given -----------
  /* A controller's speaker is tiny: it cannot play low notes. On such a speaker (bus.small) anything low goes one or two octaves up. */
  const smallUp = (bus, f) => !bus.small || f >= 260 ? 1 : f >= 130 ? 2 : 4;
  function osc(bus, type, f, t, g, att, dec, o) {
    const a = bus.context, os = a.createOscillator(), gn = a.createGain(), up = smallUp(bus, f);
    if (up > 1) { f *= up; if (o) o = Object.assign({}, o, { f2: o.f2 ? o.f2 * up : 0, lp: o.lp ? o.lp * up : 0 }); }
    os.type = type; os.frequency.setValueAtTime(f, t);
    if (o && o.f2) os.frequency.exponentialRampToValueAtTime(o.f2, t + (o.gt || dec));
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(g, t + att);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + att + dec);
    let node = os;
    if (o && o.lp) { const fl = a.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; os.connect(fl); node = fl; }
    node.connect(gn); gn.connect(bus);
    if (o && o.trem) {                     // a trembling note ("fup-fup"): a slow wave on top of the loudness
      const lo = a.createOscillator(), lg = a.createGain();
      lo.type = 'sine'; lo.frequency.value = o.trem; lg.gain.value = g * 0.4;
      lo.connect(lg); lg.connect(gn.gain); lo.start(t); lo.stop(t + att + dec + 0.05);
    }
    os.start(t); os.stop(t + att + dec + 0.05);
  }
  function noise(bus, t, g, att, dec, type, f, f2, q) {
    const a = bus.context, s = a.createBufferSource(); s.buffer = nbuf(a); s.loop = true;
    if (bus.small && f < 700) { f *= 2.5; if (f2) f2 *= 2.5; }
    const fl = a.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q || 0.7;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + att + dec);
    const gn = a.createGain();
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(g, t + att); gn.gain.exponentialRampToValueAtTime(0.0001, t + att + dec);
    s.connect(fl); fl.connect(gn); gn.connect(bus);
    s.start(t, Math.random()); s.stop(t + att + dec + 0.05);
  }
  /* A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. */
  function voc(bus, t, f0, f1, dur, g, m0, m1) {
    const a = bus.context, os = a.createOscillator(), o2 = a.createOscillator(), fl = a.createBiquadFilter(), gn = a.createGain();
    if (bus.small && f0 < 260) { f0 *= 2; f1 *= 2; }
    os.type = 'sawtooth'; o2.type = 'triangle';
    os.frequency.setValueAtTime(f0, t); os.frequency.exponentialRampToValueAtTime(f1, t + dur);
    o2.frequency.setValueAtTime(f0, t); o2.frequency.exponentialRampToValueAtTime(f1, t + dur);
    fl.type = 'bandpass'; fl.Q.value = 2.2; fl.frequency.setValueAtTime(m0, t); fl.frequency.exponentialRampToValueAtTime(m1, t + dur);
    g *= 2.1;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(g, t + 0.025); gn.gain.setValueAtTime(g, t + dur * 0.55); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.04);
    const g2 = a.createGain(); g2.gain.value = 0.45;
    os.connect(fl); fl.connect(gn); o2.connect(g2); g2.connect(gn); gn.connect(bus);
    os.start(t); o2.start(t); os.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  }
  /* A soft roar or growl: a low triangle that slides down, with a quick tremble (the "rrr"). Warm, never harsh. */
  function growl(bus, t, f0, f1, dur, g, rate) {
    const a = bus.context, up = smallUp(bus, f1), os = a.createOscillator(), o2 = a.createOscillator(), fl = a.createBiquadFilter(), gn = a.createGain(), tr = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
    os.type = 'triangle'; o2.type = 'sine'; fl.type = 'lowpass'; fl.frequency.value = 1100 * up; fl.Q.value = 0.6;
    for (const [o, m] of [[os, 1], [o2, 2]]) { o.frequency.setValueAtTime(f0 * up * m, t); o.frequency.exponentialRampToValueAtTime(f1 * up * m, t + dur); }
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(g, t + 0.06); gn.gain.setValueAtTime(g, t + dur * 0.55); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
    lfo.frequency.value = rate || 23; lg.gain.value = 0.38; tr.gain.value = 0.62; lfo.connect(lg); lg.connect(tr.gain);
    const g2 = a.createGain(); g2.gain.value = 0.3;
    os.connect(fl); o2.connect(g2); g2.connect(fl); fl.connect(gn); gn.connect(tr); tr.connect(bus);
    for (const o of [os, o2, lfo]) { o.start(t); o.stop(t + dur + 0.12); }
    noise(bus, t, g * 0.18, 0.05, dur * 0.8, 'lowpass', 500, 220);
  }
  // Bubu speaks low and round, Leo higher and brighter.
  // ---- instruments ---------------------------------------------------------
  const kalimba = (bus, f, t, g) => { osc(bus, 'sine', f, t, g, 0.004, 1.25); osc(bus, 'sine', f * 3, t, g * 0.13, 0.003, 0.28); osc(bus, 'triangle', f * 5.42, t, g * 0.04, 0.002, 0.07); };
  const marimba = (bus, f, t, g) => { osc(bus, 'sine', f, t, g, 0.005, 0.6); osc(bus, 'sine', f * 4, t, g * 0.2, 0.003, 0.12); osc(bus, 'triangle', f, t, g * 0.22, 0.004, 0.22, { lp: 900 }); };
  const chime = (bus, f, t, g) => { osc(bus, 'sine', f, t, g, 0.004, 1.9); osc(bus, 'sine', f * 2.76, t, g * 0.26, 0.004, 1.0); osc(bus, 'sine', f * 5.4, t, g * 0.09, 0.003, 0.45); };
  function flute(bus, f, t, dur, g) {
    const os = ac.createOscillator(), gn = ac.createGain(), fl = ac.createBiquadFilter(), lfo = ac.createOscillator(), lg = ac.createGain();
    os.type = 'triangle'; os.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 1100 + f; fl.Q.value = 0.5;
    lfo.frequency.value = 4.8; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.007, t + 0.5);
    lfo.connect(lg); lg.connect(os.frequency);
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(g, t + 0.16); gn.gain.setValueAtTime(g, t + Math.max(0.2, dur - 0.3)); gn.gain.linearRampToValueAtTime(0.0001, t + dur);
    os.connect(fl); fl.connect(gn); gn.connect(bus);
    os.start(t); lfo.start(t); os.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
    noise(bus, t, g * 0.1, 0.1, dur * 0.8, 'bandpass', f * 2, 0, 3);
  }

  // ---- music: calm pentatonic patterns, a different one per level ------------
  const MAJ = [0, 2, 4, 7, 9], MIN = [0, 3, 5, 7, 10], SUS = [0, 2, 5, 7, 9];
  const SONGS = {
    title:  { root: 60, sc: MAJ, bpm: 78,  seed: 5,  flute: 1 },
    l0:     { root: 60, sc: MAJ, bpm: 86,  seed: 11 },
    l1:     { root: 57, sc: MIN, bpm: 78,  seed: 23, flute: 1 },
    l2:     { root: 62, sc: MAJ, bpm: 84,  seed: 31 },
    l3:     { root: 65, sc: MAJ, bpm: 92,  seed: 47, flute: 1 },
    l4:     { root: 55, sc: SUS, bpm: 76,  seed: 59, flute: 1, chimes: 1 },
    l5:     { root: 58, sc: MAJ, bpm: 80,  seed: 67, flute: 1 },
    boss:   { root: 62, sc: MIN, bpm: 112, seed: 83, shaker: 1 },
    duel:   { root: 64, sc: MIN, bpm: 104, seed: 71, shaker: 1 },
    duel2:  { root: 64, sc: MIN, bpm: 116, seed: 71, shaker: 1 },      // the nest fight: the same tune, a little faster
    ending: { root: 60, sc: MAJ, bpm: 72,  seed: 97, flute: 1, chimes: 1 },
    // the second game has its own tunes: glass bells instead of the kalimba, and a soft jungle drum
    'L:title':  { root: 57, sc: MIN, bpm: 84,  seed: 105, flute: 1, glass: 1 },
    'L:l0':     { root: 62, sc: SUS, bpm: 88,  seed: 111, glass: 1 },
    'L:l1':     { root: 59, sc: MIN, bpm: 92,  seed: 123, glass: 1, drum: 1 },
    'L:l2':     { root: 64, sc: SUS, bpm: 82,  seed: 131, flute: 1, glass: 1 },
    'L:l3':     { root: 55, sc: MIN, bpm: 96,  seed: 147, flute: 1, drum: 1 },
    'L:l4':     { root: 60, sc: SUS, bpm: 78,  seed: 159, flute: 1, glass: 1, chimes: 1 },
    'L:l5':     { root: 57, sc: MIN, bpm: 90,  seed: 167, glass: 1, drum: 1 },
    'L:boss':   { root: 57, sc: MIN, bpm: 118, seed: 183, shaker: 1, drum: 1 },
    'L:duel':   { root: 59, sc: MIN, bpm: 108, seed: 171, shaker: 1, drum: 1 },
    'L:duel2':  { root: 59, sc: MIN, bpm: 120, seed: 171, shaker: 1, drum: 1 },
    'L:ending': { root: 62, sc: MAJ, bpm: 96,  seed: 197, flute: 1, chimes: 1, glass: 1, drum: 1 }
  };
  const setKey = key => (GAME === 'lupta' && key ? 'L:' : '') + key;      // the name of a tune or of an ambience in the game being played
  function makeSong(p) {
    const r = rng(p.seed);
    const motif = () => {
      const m = []; let d = 2 + (r() * 3 | 0);
      for (let i = 0; i < 8; i++) {
        if (i % 2 === 1 && r() < 0.42) { m.push(null); continue; }
        d = clamp(d + [-2, -1, -1, 0, 1, 1, 2][r() * 7 | 0], 0, 9); m.push(d);
      }
      return m;
    };
    const A = motif(), B = motif(), C = motif(), E = A.slice(); E[5] = 1; E[6] = 0; E[7] = null;
    const progs = [[0, 0, 3, 2, 4, 3, 0, 0], [0, 2, 3, 0, 4, 2, 3, 0], [0, 3, 0, 3, 2, 4, 3, 0]];
    return { p, mel: [A, B, A, E, C, B, A, E], bass: progs[r() * 3 | 0], spb: 60 / p.bpm / 2 };
  }
  const deg = (p, d) => p.root + p.sc[((d % 5) + 5) % 5] + 12 * Math.floor(d / 5);
  function schedule(st, t) {
    const p = song.p, bar = (st >> 3) % 8, s = st & 7, hum = () => (Math.random() - 0.5) * 0.012;
    const n = song.mel[bar][s];
    if (n != null) { if (p.glass) chime(musicBus, mtof(deg(p, n) + 12), t + hum(), (s % 4 === 0 ? 0.1 : 0.07) + Math.random() * 0.02); else kalimba(musicBus, mtof(deg(p, n) + 12), t + hum(), (s % 4 === 0 ? 0.17 : 0.12) + Math.random() * 0.03); }
    if (p.drum) { if (s === 0) osc(musicBus, 'sine', 84, t, 0.3, 0.005, 0.2, { f2: 52 }); else if (s === 3 || s === 6) osc(musicBus, 'sine', 150, t + hum(), 0.12, 0.004, 0.11, { f2: 104 }); }
    const b = song.bass[bar];
    if (s === 0) marimba(musicBus, mtof(deg(p, b) - 12), t, 0.24);
    if (s === 4) marimba(musicBus, mtof(deg(p, b + 2) - 12), t + hum(), 0.15);
    if (s === 6 && bar % 2 === 1) marimba(musicBus, mtof(deg(p, b + 1) - 12), t + hum(), 0.1);
    if (s === 0 && bar % 4 === 0) chime(musicBus, mtof(deg(p, b) + 24), t, 0.045);
    if (p.chimes && s === 3 && bar % 2 === 0) chime(musicBus, mtof(deg(p, b + 2) + 24), t, 0.03);
    if (p.flute && s === 0 && bar % 2 === 0 && bar !== 0) flute(musicBus, mtof(deg(p, song.mel[bar][0] == null ? b : song.mel[bar][0]) + 12), t, song.spb * 7, 0.045);
    if (p.shaker) {
      noise(musicBus, t, s % 2 ? 0.012 : 0.022, 0.004, 0.05, 'bandpass', 2600, 0, 1.2);
      if (s % 4 === 2) marimba(musicBus, mtof(deg(p, b + 2)), t, 0.09);
    }
  }
  function tick() {
    if (!ac || ac.state !== 'running') return;
    if (amb && duck > 0.9) {                 // little living sounds of the valley
      const t = ac.currentTime + 0.02;
      if (amb.birds && Math.random() < amb.birds * 0.05) {
        const f = 2300 + Math.random() * 1700, n = 2 + (Math.random() * 3 | 0), g = 0.018 + Math.random() * 0.016;
        for (let i = 0; i < n; i++) osc(ambBus, 'sine', f * (1 + i * 0.04), t + i * 0.11, g, 0.012, 0.07, { f2: f * (Math.random() < 0.5 ? 1.25 : 0.8), gt: 0.07 });
      }
      if (amb.crickets) { cricketT -= 0.05; if (cricketT <= 0) { cricketT = 1.1 + Math.random() * 1.6; const f = 4100 + Math.random() * 500; for (let i = 0; i < 7; i++) osc(ambBus, 'sine', f, t + i * 0.045, 0.007, 0.006, 0.025); } }
      if (amb.owl && Math.random() < 0.0035) { osc(ambBus, 'sine', 370, t, 0.03, 0.05, 0.3, { f2: 340 }); osc(ambBus, 'sine', 350, t + 0.45, 0.035, 0.05, 0.5, { f2: 300 }); }
      if (amb.frogs && Math.random() < amb.frogs * 0.012) { const f = 190 + Math.random() * 90; for (let i = 0; i < 2; i++) osc(ambBus, 'triangle', f, t + i * 0.16, 0.03, 0.01, 0.09, { f2: f * 1.25, lp: 900 }); }
      if (amb.robots && Math.random() < amb.robots * 0.01) { const n = 2 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) osc(ambBus, 'triangle', mtof(79 + PENT[Math.random() * 6 | 0]), t + i * 0.1, 0.014, 0.004, 0.06, { lp: 2600 }); }
      if (amb.fire && Math.random() < 0.09) noise(ambBus, t, 0.03 + Math.random() * 0.03, 0.002, 0.03, 'bandpass', 1400 + Math.random() * 1200, 0, 2);
    }
    if (!song) return;
    if (nextT < ac.currentTime) nextT = ac.currentTime + 0.05;
    while (nextT < ac.currentTime + 0.25) { schedule(step, nextT); step++; nextT += song.spb; }
  }
  const AMBS = {
    title: { birds: 0.3 }, l0: { birds: 0.4 }, l1: { birds: 0.5, owl: 1 }, l2: { birds: 0.25, water: 0.6 }, l3: { birds: 0.15, wind: 0.7 },
    l4: { birds: 0.2, water: 1 }, l5: { birds: 0.08, crickets: 1, wind: 0.25 }, boss: { crickets: 1, wind: 0.35 }, ending: { crickets: 1 },
    // the jungle at night: crickets, frogs, an owl, George's robots beeping far away, the fire of the torches
    'L:title': { crickets: 1, frogs: 0.5 }, 'L:l0': { crickets: 1, frogs: 0.5, owl: 1 }, 'L:l1': { crickets: 0.6, robots: 1 }, 'L:l2': { water: 0.6, frogs: 1, crickets: 0.5 }, 'L:l3': { wind: 0.8, owl: 1 },
    'L:l4': { water: 0.5, crickets: 1, frogs: 0.6 }, 'L:l5': { crickets: 1, wind: 0.3, robots: 0.6, fire: 1 }, 'L:boss': { wind: 0.3, fire: 1 }, 'L:ending': { crickets: 1, frogs: 0.3 }
  };
  function ambience(key) { amb = AMBS[setKey(key)] || AMBS[key] || null; applyAmb(); }
  function music(key) {
    const k2 = key && SONGS[setKey(key)] ? setKey(key) : key;
    if (k2 === songKey) return;
    songKey = k2; song = k2 && SONGS[k2] ? makeSong(SONGS[k2]) : null; step = 0; nextT = 0;
    if (key !== 'duel' && key !== 'duel2') ambience(key);
  }


  // ---- the heroes' own language: 33 invented words each -------------------------
  // A word is a list of syllables [vowel, semitones from the hero's base note, length in seconds, slide in semitones].
  // Bubu: low, round, slow, sliding down. Leo: high, quick, bright, sliding up.
  // Boon: a little dinosaur who growls his words. Killer: short, sporty shouts. Nothing is recorded: all is synthesized.
  // note = the base note, form = how "big" the mouth is, gain = how loud, growl = how fast the voice trembles (a soft "rrr").
  const VOICES = {
    bubu:  [{ note: 43, form: 0.85, gain: 1.5 }, { note: 62, form: 1.15, gain: 0.95 }],
    lupta: [{ note: 47, form: 0.8, gain: 1.45, growl: 24 }, { note: 66, form: 1.25, gain: 0.9 }]
  };
  const FORM = { a: [800, 1200], e: [500, 1900], i: [300, 2300], o: [500, 900], u: [320, 800] };
  const BABBLE = {
    bubu: [
    { hello: [['u', 0, 0.22, 4], ['o', 5, 0.3, -3]], ready: [['o', -2, 0.14, 0], ['a', 3, 0.2, 5]],
      egg: [[['o', 2, 0.14, 2]], [['u', 4, 0.12, 3]], [['a', 0, 0.12, 4]]], eggs5: [['o', 2, 0.1, 0], ['o', 4, 0.1, 0], ['o', 6, 0.1, 0], ['u', 8, 0.25, -2]],
      star: [['u', 7, 0.2, 4], ['a', 12, 0.25, -4]], giant: [['o', 0, 0.3, -5], ['a', -2, 0.3, -5], ['a', -4, 0.35, -6], ['u', -6, 0.45, -8]],
      power: [['a', 0, 0.12, -4], ['u', -2, 0.2, -3]], powerBig: [['u', -4, 0.3, -6], ['a', -1, 0.2, 4], ['o', -7, 0.4, -6]],
      hurt: [['a', 2, 0.22, -8], ['u', -1, 0.3, -6]], dizzy: [['u', 0, 0.25, -2], ['o', -2, 0.25, 2], ['u', 0, 0.25, -2]],
      recover: [['u', 3, 0.12, 1], ['o', 3, 0.2, 0]], drop: [['o', -4, 0.18, -5], ['u', -6, 0.2, -4]], regain: [['u', 3, 0.12, 2], ['o', 5, 0.2, 0]],
      hide: [['i', 0, 0.14, 0], ['i', -1, 0.2, -2]], unhide: [['u', 1, 0.18, 3]],
      beetleWake: [['a', 0, 0.1, 4], ['o', 0, 0.25, 2]], beetleStun: [['i', 3, 0.1, -2], ['i', 0, 0.1, -3], ['u', -2, 0.2, -4]],
      wind: [['u', -3, 0.5, 4]], mud: [['o', -6, 0.1, -8], ['u', -8, 0.25, -10]], bridge: [['u', 2, 0.08, 0], ['o', 0, 0.08, 0], ['u', 2, 0.08, 0]],
      butterfly: [['i', 7, 0.08, 0], ['i', 9, 0.08, 2], ['i', 12, 0.12, 4]], guardHit: [['u', -4, 0.12, 0], ['a', -6, 0.4, -10]],
      notYet: [['a', 5, 0.15, 6], ['u', 2, 0.2, -3]], guardGone: [['u', 0, 0.14, -2], ['o', -2, 0.14, -2], ['u', -4, 0.3, -6]],
      bored: [['u', 0, 0.3, 0], ['u', 0, 0.3, 0], ['u', -1, 0.4, -2]], callFriend: [['o', 7, 0.25, 4], ['u', 10, 0.3, 2]],
      together: [['u', 3, 0.16, 2], ['a', 5, 0.25, 4]], nestOpen: [['a', 2, 0.14, 2], ['a', 4, 0.14, 2], ['o', 6, 0.4, -3]],
      levelWin: [['u', 0, 0.16, 2], ['u', 3, 0.16, 2], ['u', 5, 0.16, 2], ['u', 7, 0.5, 3]],
      bossDown: [['a', -2, 0.15, -2], ['a', -2, 0.15, -2], ['a', -2, 0.15, -2], ['a', -5, 0.4, -6]] ,
      help: [['u', 5, 0.3, -4], ['u', 3, 0.36, -5]], rescue: [['o', 0, 0.12, 3], ['a', 4, 0.18, 2], ['u', 7, 0.3, -2]], thanks: [['a', 2, 0.14, 3], ['u', 5, 0.3, 2]] },
    { hello: [['e', 0, 0.08, 7], ['o', 5, 0.25, 2]], ready: [['i', 0, 0.07, 5], ['a', 7, 0.14, 8]],
      egg: [[['i', 0, 0.07, 3]], [['e', 3, 0.08, 2]], [['i', 5, 0.07, 3]]], eggs5: [['i', 2, 0.06, 0], ['i', 4, 0.06, 0], ['i', 6, 0.06, 0], ['a', 9, 0.16, 5]],
      star: [['u', 9, 0.1, 4], ['e', 12, 0.16, 6]], giant: [['o', 0, 0.12, 6], ['o', 4, 0.12, 7], ['o', 7, 0.12, 8], ['o', 10, 0.42, 9]],
      power: [['e', 0, 0.07, 6], ['i', 4, 0.1, 4]], powerBig: [['i', 2, 0.1, 9], ['a', 6, 0.1, 8], ['i', 10, 0.4, 6]],
      hurt: [['a', 5, 0.14, -10], ['e', 3, 0.2, -6]], dizzy: [['e', 2, 0.1, -2], ['i', 0, 0.1, 2], ['e', 2, 0.1, -2], ['i', 0, 0.1, 2]],
      recover: [['a', 7, 0.07, 0], ['a', 9, 0.12, 3]], drop: [['u', 4, 0.1, 4], ['a', 6, 0.1, -3], ['a', 2, 0.12, -4]],
      regain: [['a', 4, 0.08, 4], ['a', 7, 0.2, 2]], hide: [['i', -2, 0.14, -1], ['i', -2, 0.14, -1]],
      unhide: [['a', 5, 0.1, 6], ['o', 8, 0.12, 3]], beetleWake: [['o', 7, 0.1, 6], ['o', 10, 0.14, 4]],
      beetleStun: [['a', 4, 0.08, -3], ['a', 0, 0.1, -5]], wind: [['i', 7, 0.25, 8], ['u', 9, 0.4, 6]],
      mud: [['a', -2, 0.1, -6], ['e', -4, 0.14, -7]], bridge: [['i', 4, 0.06, 0], ['a', 2, 0.06, 0], ['i', 4, 0.06, 0]],
      butterfly: [['i', 12, 0.06, 4], ['u', 14, 0.06, 2], ['i', 16, 0.12, 6]], guardHit: [['o', 10, 0.12, 4], ['e', 12, 0.4, 8]],
      notYet: [['a', 6, 0.12, 2], ['a', 3, 0.16, -4]], guardGone: [['e', 7, 0.12, 3], ['e', 9, 0.12, 3], ['e', 12, 0.35, 6]],
      bored: [['i', 9, 0.1, 0], ['i', 11, 0.1, -2], ['i', 12, 0.22, -3]], callFriend: [['u', 0, 0.12, 6], ['u', 5, 0.22, 6]],
      together: [['i', 7, 0.1, 4], ['a', 11, 0.2, 6]], nestOpen: [['a', 5, 0.1, 3], ['a', 7, 0.1, 3], ['e', 9, 0.2, 2], ['a', 12, 0.2, 3]],
      levelWin: [['e', 2, 0.1, 4], ['o', 4, 0.1, 4], ['e', 7, 0.1, 4], ['o', 9, 0.1, 4], ['e', 11, 0.3, 3]],
      bossDown: [['a', 5, 0.1, -3], ['a', 5, 0.1, -3], ['a', 5, 0.1, -3], ['a', 2, 0.3, -6]] ,
      help: [['e', 9, 0.16, -4], ['e', 9, 0.16, -4], ['o', 6, 0.3, -6]], rescue: [['a', 4, 0.07, 5], ['i', 9, 0.07, 3], ['a', 12, 0.22, 4]], thanks: [['i', 7, 0.08, 2], ['e', 10, 0.2, 5]] }
    ],
    lupta: [
      // Boon
      { hello: [['a', 0, 0.18, 3], ['o', 4, 0.16, 0], ['a', 7, 0.3, -5]], ready: [['a', 2, 0.1, 0], ['a', 2, 0.1, 0], ['o', 7, 0.28, 3]],
        egg: [[['i', 9, 0.1, 3]], [['a', 7, 0.1, 4]], [['o', 5, 0.11, 5]]], eggs5: [['a', 0, 0.09, 2], ['a', 3, 0.09, 2], ['a', 7, 0.09, 2], ['o', 10, 0.28, 2]],
        star: [['o', 5, 0.16, 7], ['i', 14, 0.3, -2]], giant: [['a', -3, 0.25, 3], ['o', 2, 0.25, 3], ['a', 7, 0.25, 3], ['o', 12, 0.5, -4]],
        power: [['a', 3, 0.14, -6], ['a', 0, 0.16, -5]], powerBig: [['a', 5, 0.2, -7], ['o', 0, 0.2, -5], ['a', -4, 0.45, -8]],
        hurt: [['i', 12, 0.14, -9], ['u', 4, 0.32, -7]], dizzy: [['o', 3, 0.2, 2], ['u', 1, 0.2, -2], ['o', 3, 0.2, 2], ['u', -1, 0.3, -3]],
        recover: [['a', 0, 0.12, 5], ['a', 7, 0.22, 0]], drop: [['u', 2, 0.14, -4], ['o', -3, 0.24, -5]], regain: [['o', 2, 0.1, 4], ['a', 8, 0.2, 1]],
        hide: [['u', 5, 0.12, 0], ['u', 5, 0.12, 0], ['i', 3, 0.2, -2]], unhide: [['a', 4, 0.2, 4]],
        beetleWake: [['o', 7, 0.1, 5], ['a', 9, 0.28, -3]], beetleStun: [['a', 5, 0.1, -4], ['a', 2, 0.1, -4], ['a', -1, 0.22, -5]],
        wind: [['o', 0, 0.55, 6]], mud: [['u', -5, 0.14, -6], ['o', -8, 0.28, -8]], bridge: [['a', 4, 0.08, 0], ['u', 1, 0.08, 0], ['a', 4, 0.08, 0], ['u', 1, 0.08, 0]],
        butterfly: [['i', 10, 0.09, 2], ['a', 12, 0.09, 3], ['i', 15, 0.16, 5]], guardHit: [['a', -2, 0.14, 2], ['o', -5, 0.42, -9]],
        notYet: [['o', 6, 0.16, 5], ['a', 3, 0.22, -4]], guardGone: [['a', 2, 0.14, -2], ['a', 0, 0.14, -2], ['o', -3, 0.34, -7]],
        bored: [['o', 2, 0.34, -1], ['u', 0, 0.34, -1], ['o', -2, 0.44, -3]], callFriend: [['a', 9, 0.26, 5], ['o', 12, 0.34, 1]],
        together: [['o', 5, 0.16, 3], ['a', 9, 0.26, 3]], nestOpen: [['a', 0, 0.14, 3], ['o', 4, 0.14, 3], ['a', 9, 0.42, -2]],
        levelWin: [['a', 2, 0.16, 2], ['a', 5, 0.16, 2], ['a', 9, 0.16, 2], ['o', 12, 0.52, 2]],
        bossDown: [['a', 0, 0.16, -3], ['a', 0, 0.16, -3], ['o', -3, 0.44, -7]],
        help: [['i', 10, 0.22, -3], ['i', 8, 0.3, -4]], rescue: [['o', 2, 0.12, 4], ['a', 7, 0.14, 3], ['o', 11, 0.3, -2]], thanks: [['a', 6, 0.14, 4], ['o', 11, 0.3, 0]],
        run: [['a', 7, 0.08, 7], ['o', 13, 0.15, 9]],
        power2: [['o', 4, 0.1, 6], ['a', 10, 0.16, 5]], power2Big: [['o', 3, 0.12, 8], ['a', 9, 0.1, 7], ['u', 15, 0.26, 4]],
        hurry: [['a', 6, 0.07, 9], ['a', 11, 0.07, 10], ['o', 17, 0.18, 8]] },
      // Killer
      { hello: [['a', 0, 0.09, 5], ['i', 7, 0.09, 0], ['a', 3, 0.2, 4]], ready: [['e', 4, 0.07, 0], ['e', 4, 0.07, 0], ['a', 9, 0.18, 5]],
        egg: [[['a', 2, 0.07, 4]], [['i', 6, 0.07, 3]], [['e', 9, 0.07, 2]]], eggs5: [['a', 0, 0.06, 0], ['e', 3, 0.06, 0], ['a', 7, 0.06, 0], ['i', 12, 0.18, 3]],
        star: [['i', 7, 0.1, 5], ['a', 14, 0.2, 2]], giant: [['a', 0, 0.1, 5], ['a', 5, 0.1, 5], ['a', 9, 0.1, 5], ['i', 14, 0.4, 5]],
        power: [['a', 2, 0.07, 7], ['e', 7, 0.11, 2]], powerBig: [['e', 0, 0.09, 8], ['a', 7, 0.09, 6], ['e', 12, 0.36, 4]],
        hurt: [['i', 8, 0.12, -9], ['a', 2, 0.22, -7]], dizzy: [['a', 3, 0.1, -3], ['e', 1, 0.1, 3], ['a', 3, 0.1, -3], ['e', 1, 0.14, -4]],
        recover: [['e', 5, 0.07, 2], ['i', 10, 0.14, 2]], drop: [['o', 6, 0.1, -3], ['e', 3, 0.1, -3], ['o', 0, 0.14, -5]],
        regain: [['e', 2, 0.08, 5], ['i', 9, 0.18, 1]], hide: [['e', 0, 0.12, -2], ['i', -2, 0.16, 0]],
        unhide: [['e', 3, 0.09, 5], ['a', 8, 0.14, 2]], beetleWake: [['a', 9, 0.09, 4], ['e', 12, 0.16, 2]],
        beetleStun: [['e', 6, 0.08, -4], ['a', 2, 0.12, -4]], wind: [['a', 5, 0.22, 7], ['e', 10, 0.36, 5]],
        mud: [['e', 0, 0.1, -5], ['a', -3, 0.16, -6]], bridge: [['e', 5, 0.06, 0], ['e', 7, 0.06, 0], ['e', 5, 0.06, 0], ['e', 7, 0.06, 0]],
        butterfly: [['a', 10, 0.06, 3], ['i', 14, 0.06, 3], ['a', 17, 0.12, 4]], guardHit: [['a', 7, 0.1, 5], ['i', 14, 0.36, 5]],
        notYet: [['e', 7, 0.11, 0], ['e', 4, 0.16, -3]], guardGone: [['a', 5, 0.1, 4], ['a', 9, 0.1, 4], ['i', 14, 0.32, 4]],
        bored: [['e', 7, 0.12, -1], ['e', 5, 0.12, -1], ['a', 3, 0.24, -2]], callFriend: [['a', 2, 0.12, 5], ['e', 7, 0.24, 5]],
        together: [['e', 5, 0.1, 5], ['i', 12, 0.2, 3]], nestOpen: [['e', 2, 0.09, 3], ['a', 5, 0.09, 3], ['e', 9, 0.09, 3], ['i', 14, 0.24, 2]],
        levelWin: [['a', 0, 0.09, 4], ['e', 4, 0.09, 4], ['a', 7, 0.09, 4], ['e', 11, 0.09, 4], ['i', 14, 0.32, 2]],
        bossDown: [['e', 7, 0.09, -3], ['e', 7, 0.09, -3], ['a', 3, 0.3, -6]],
        help: [['a', 10, 0.14, -5], ['a', 10, 0.14, -5], ['e', 6, 0.26, -5]], rescue: [['e', 2, 0.07, 5], ['a', 7, 0.07, 4], ['e', 12, 0.2, 3]], thanks: [['a', 5, 0.08, 3], ['i', 12, 0.2, 2]],
        run: [['i', 9, 0.05, 8], ['a', 16, 0.13, 7]],
        power2: [['e', 4, 0.06, 6], ['i', 10, 0.14, 5]], power2Big: [['e', 3, 0.07, 7], ['a', 8, 0.06, 6], ['i', 14, 0.22, 8]],
        hurry: [['i', 6, 0.05, 10], ['i', 10, 0.05, 11], ['e', 15, 0.16, 9]] }
    ]
  };
  // How loud a voice is: a quiet one never cuts in on a louder one that is still talking.
  const TALK_PRIO = { hello: 3, ready: 3, egg: 1, eggs5: 2, star: 3, giant: 3, power: 2, powerBig: 3, hurt: 3, dizzy: 2, recover: 2, drop: 2, regain: 2, hide: 2, unhide: 1,
    beetleWake: 2, beetleStun: 2, wind: 2, mud: 1, bridge: 1, butterfly: 3, guardHit: 3, notYet: 1, guardGone: 3, bored: 1, callFriend: 1, together: 2, nestOpen: 3, levelWin: 3, bossDown: 3,
    help: 3, rescue: 3, thanks: 3, run: 2, power2: 2, power2Big: 3, hurry: 2, george: 2, hum: 0, puff: 0, effort: 0 };
  const talkBusy = [{ until: 0, prio: 0, last: -1 }, { until: 0, prio: 0, last: -1 }];
  /* One syllable. Two triangle waves (the note and its octave) go through two "mouth" filters; a little of the plain note
     keeps the tune clear. Loud enough to be heard next to the other sounds, also in a controller's small speaker. */
  function syl(b, t, k, s, V) {
    const [v, st, d, sl] = s, A = b.context, up = b.small && V.note + st < 56 ? 12 : 0, f0 = mtof(V.note + st + up), f1 = f0 * Math.pow(2, sl / 12);
    const g = A.createGain(), G = 0.62 * (V.gain || 1);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(G, t + 0.015); g.gain.setValueAtTime(G, t + d * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.05);
    for (const [mul, lev] of [[1, 1], [2, 0.55]]) {
      const o = A.createOscillator(), og = A.createGain(); o.type = 'triangle'; og.gain.value = lev;
      o.frequency.setValueAtTime(f0 * mul, t); o.frequency.exponentialRampToValueAtTime(f1 * mul, t + d);
      o.connect(og);
      for (const F of FORM[v]) { const bp = A.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = F * V.form; bp.Q.value = 2.2; og.connect(bp); bp.connect(g); }
      if (mul === 1) { const lp = A.createBiquadFilter(), dg = A.createGain(); lp.type = 'lowpass'; lp.frequency.value = 1500; dg.gain.value = 0.22; o.connect(lp); lp.connect(dg); dg.connect(g); }
      o.start(t); o.stop(t + d + 0.1);
    }
    if (V.growl) {                       // Boon: the voice trembles quickly, a soft little roar
      const tr = A.createGain(), lfo = A.createOscillator(), lg = A.createGain(); tr.gain.value = 0.68; lfo.frequency.value = V.growl; lg.gain.value = 0.32;
      lfo.connect(lg); lg.connect(tr.gain); g.connect(tr); tr.connect(b); lfo.start(t); lfo.stop(t + d + 0.1);
    } else g.connect(b);
  }
  /* ---- recorded voices (T13) ----
     Boon and Killer have a voice: short clips of two children playing dinosaurs (src/017-voci-data.js, made by tools/voci).
     A clip plays through the same bus as the hero's other sounds, so it comes out of his own controller.
     A moment (the key of talk) has one or more lines; the position of a line in VOICE_DATA is its id (kept forever, saves use it).
     When a key has no clip, or the clips are not decoded yet, the old synthesized word is used. */
  const voice = { buf: [[], []], by: [{}, {}], ready: false, last: [-1, -1], lastKey: [{}, {}], until: [0, 0], said: [{ t: -99 }, { t: -99 }] };
  const voiceSet = () => (typeof VOICE_DATA !== 'undefined' && VOICE_DATA[GAME]) || null;
  function loadVoices() {
    const set = voiceSet(); if (!set || voice.ready || voice.loading) return;
    voice.loading = true;
    let todo = 0; for (const L of set) todo += L.length;
    set.forEach((L, k) => L.forEach((w, i) => {
      (voice.by[k][w.k] = voice.by[k][w.k] || []).push(i);
      try {
        const bin = atob(w.d), u = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) u[j] = bin.charCodeAt(j);
        ac.decodeAudioData(u.buffer, b => { voice.buf[k][i] = b; if (--todo === 0) voice.ready = true; }, () => { --todo; });
      } catch (e) { --todo; }
    }));
  }
  /* A line of the voice. quiet = 0..1 (a hum or a puff is quieter). Returns the id of the line, or -1. */
  function voiceSay(k, id, quiet) {
    const buf = voice.buf[k][id], b = (outs[k] && outs[k].context.state === 'running') ? outs[k] : chrBus; if (!buf) return -1;
    const A = b.context, src = A.createBufferSource(), g = A.createGain();
    src.buffer = buf; g.gain.value = (CONFIG.words.gain[k] || 1) * (quiet == null ? 1 : quiet);
    src.connect(g); g.connect(b); src.start(A.currentTime + 0.01 + (b.lead || 0));
    return id;
  }
  /* Talk(k, key): hero k says a line for this moment. Routed like the hero's other sounds (own speaker when one was chosen).
     Returns the id of the line that was said (so the game can show the balloon and fill the dictionary), or -1. */
  function talk(k, key) {
    if (!ac || ac.state !== 'running' || !CONFIG.babble) return -1;
    const pr = TALK_PRIO[key] != null ? TALK_PRIO[key] : 1, tb = talkBusy[k], now = ac.currentTime, V = CONFIG.words;
    const ids = voice.ready && V.on ? voice.by[k][key] : null;
    if (ids && ids.length && voice.buf[k][ids[0]]) {
      if (now < tb.until && pr < tb.prio) return -1;                              // a louder word is still going
      const soft = key === 'hum' || key === 'puff' || key === 'effort';          // small noises: they never cut in on a word
      if (soft && now < tb.until) return -1;
      // the lines are not said at every moment: between two lines of a hero there is a pause (not for the loud ones)
      if (pr < 3 && now - voice.said[k].t < (soft ? V.softGap : V.gap)) return -1;
      let id; do { id = ids[Math.random() * ids.length | 0]; } while (ids.length > 1 && id === voice.last[k]);
      voice.last[k] = id;
      voiceSay(k, id, key === 'hum' ? V.humGain : key === 'puff' ? V.puffGain : key === 'effort' ? V.effortGain : 1);
      const dur = voice.buf[k][id].duration; tb.until = now + dur; tb.prio = pr; voice.said[k].t = now + dur;
      return id;
    }
    const set = BABBLE[GAME] || BABBLE.bubu, w = set[k] && set[k][key]; if (!w) return -1;
    if (now < tb.until && pr < tb.prio) return -1;
    let syls = w;
    if (Array.isArray(w[0][0])) { let i; do { i = Math.random() * w.length | 0; } while (w.length > 1 && i === tb.last); tb.last = i; syls = w[i]; }
    const b = (outs[k] && outs[k].context.state === 'running') ? outs[k] : chrBus, Vv = (VOICES[GAME] || VOICES.bubu)[k];
    let t = b.context.currentTime + 0.01 + (b.lead || 0);
    for (const s of syls) { syl(b, t, k, s, Vv); t += s[2] * 0.85; }
    tb.until = now + (t - b.context.currentTime); tb.prio = pr;
    return -1;
  }
  const voiceInfo = (k, id) => { const set = voiceSet(); return set && set[k] && set[k][id] ? set[k][id] : null; };

  // ---- sound effects -------------------------------------------------------
  const PENT = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  /* Every effect gets: b = the bus to play on, t = the time now on that bus, x = an optional value. */
  const fx = {
    // --- the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) ---
    egg(b, t, n) { const f = mtof(72 + PENT[(n || 0) % 10]); kalimba(b, f, t, 0.2); kalimba(b, f * 1.5, t + 0.07, 0.1); },
    give(b, t) { kalimba(b, mtof(79), t, 0.16); kalimba(b, mtof(86), t + 0.09, 0.16); },                                                      // an egg leaves: two warm marimba notes, going up
    star(b, t) { [0, 4, 7, 12, 16].forEach((d, i) => chime(b, mtof(79 + d), t + i * 0.07, 0.11)); },
    giant(b, t) { [0, 4, 7, 12, 16, 19, 24].forEach((d, i) => { chime(b, mtof(67 + d), t + i * 0.09, 0.13); kalimba(b, mtof(55 + d), t + i * 0.09, 0.14); }); },
    stomp(b, t) { osc(b, 'sine', 95, t, 0.75, 0.006, 0.4, { f2: 42, gt: 0.3 }); osc(b, 'triangle', 60, t, 0.3, 0.005, 0.25, { lp: 300 }); noise(b, t, 0.22, 0.005, 0.22, 'lowpass', 420, 120); },
    kick(b, t, p) { const f = 210 + (p || 0) * 60; osc(b, 'sine', f, t, 0.5, 0.003, 0.13, { f2: f * 0.55, gt: 0.1 }); osc(b, 'triangle', f * 2.1, t, 0.12, 0.002, 0.05, { lp: 1800 }); noise(b, t, 0.08, 0.002, 0.04, 'bandpass', 900, 0, 1); },
    bounce(b, t) { osc(b, 'sine', 300, t, 0.16, 0.003, 0.09, { f2: 200 }); },
    bonk(b, t) { osc(b, 'sine', 330, t, 0.45, 0.004, 0.22, { f2: 150, gt: 0.2 }); marimba(b, 196, t + 0.02, 0.3); },
    drop(b, t) { kalimba(b, mtof(76), t, 0.14); kalimba(b, mtof(72), t + 0.09, 0.12); kalimba(b, mtof(67), t + 0.18, 0.1); },
    squelch(b, t) { noise(b, t, 0.2, 0.01, 0.1, 'lowpass', 500, 200); osc(b, 'sine', 140, t, 0.2, 0.01, 0.08, { f2: 90 }); },
    step(b, t, x) {                    // x = hero * 2 + (left or right foot)
      const k = x >> 1, alt = x & 1 ? 1.08 : 0.95;
      if (k === 0) { osc(b, 'sine', 118 * alt, t, 0.15, 0.004, 0.09, { f2: 70 }); noise(b, t, 0.04, 0.003, 0.05, 'lowpass', 380, 160); }
      else { osc(b, 'sine', 205 * alt, t, 0.075, 0.003, 0.05, { f2: 140 }); noise(b, t, 0.035, 0.002, 0.035, 'bandpass', 1500, 0, 1.2); }
    },
    // --- the world (volume "Sunete ambientale") ---
    wake(b, t) { marimba(b, mtof(50), t, 0.3); marimba(b, mtof(53), t + 0.12, 0.3); },
    stun(b, t) { marimba(b, mtof(64), t, 0.2); marimba(b, mtof(57), t + 0.08, 0.2); },
    pop(b, t) { osc(b, 'sine', 420, t, 0.25, 0.003, 0.12, { f2: 760, gt: 0.1 }); },
    rustle(b, t) { noise(b, t, 0.32, 0.02, 0.4, 'bandpass', 2200, 900, 0.8); },
    butterfly(b, t) { [0, 2, 4, 7, 9, 12].forEach((d, i) => chime(b, mtof(84 + d), t + i * 0.05, 0.07)); },
    wave(b, t) { [0, 4, 7, 12].forEach((d, i) => marimba(b, mtof(67 + d), t + i * 0.11, 0.28)); chime(b, mtof(91), t + 0.44, 0.1); },
    win(b, t) { [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach((d, i) => { marimba(b, mtof(60 + d), t + i * 0.13, 0.3); if (i % 2 === 0) chime(b, mtof(84 + d), t + i * 0.13, 0.07); }); },
    caw(b, t) { for (let i = 0; i < 2; i++) { osc(b, 'triangle', 560, t + i * 0.2, 0.22, 0.01, 0.13, { f2: 370, gt: 0.12, lp: 1500 }); noise(b, t + i * 0.2, 0.05, 0.01, 0.1, 'bandpass', 1300, 800, 2); } },
    whoosh(b, t) { noise(b, t, 0.6, 0.7, 1.8, 'bandpass', 300, 900, 1.0); },
    swish(b, t) { noise(b, t, 0.3, 0.05, 0.35, 'bandpass', 500, 1800, 1.2); },
    lantern(b, t) { chime(b, mtof(76 + PENT[Math.random() * 5 | 0]), t, 0.11); },
    firework(b, t) { noise(b, t, 0.3, 0.01, 0.5, 'lowpass', 900, 200); for (let i = 0; i < 5; i++) chime(b, mtof(84 + PENT[Math.random() * 10 | 0]), t + 0.08 + i * 0.06, 0.06); },
    ui(b, t) { kalimba(b, mtof(76), t, 0.13); },
    no(b, t) { kalimba(b, mtof(67), t, 0.13); kalimba(b, mtof(64), t + 0.13, 0.13); },           // "not that one": two soft notes going down (a locked chapter)
    ok(b, t) { kalimba(b, mtof(72), t, 0.18); kalimba(b, mtof(79), t + 0.08, 0.18); },
    thud(b, t) { osc(b, 'sine', 120, t, 0.4, 0.004, 0.2, { f2: 60 }); noise(b, t, 0.1, 0.004, 0.1, 'lowpass', 500, 150); },
    goal(b, t) { [0, 7, 12, 16].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.08, 0.34)); chime(b, mtof(86), t + 0.3, 0.12); },
    crack(b, t) { osc(b, 'triangle', 900, t, 0.3, 0.002, 0.06, { f2: 500, lp: 2500 }); noise(b, t, 0.18, 0.002, 0.06, 'bandpass', 1800, 0, 2); },
    splash(b, t) { noise(b, t, 0.12, 0.02, 0.3, 'bandpass', 1200, 500, 0.8); },
    tonk(b, t) { osc(b, 'triangle', 520, t, 0.22, 0.002, 0.07, { f2: 410, lp: 2200 }); osc(b, 'sine', 1040, t, 0.06, 0.002, 0.05); },   // the ball bounces off a guardian that is not tired yet
    warn(b, t) { marimba(b, mtof(57), t, 0.26); marimba(b, mtof(57), t + 0.16, 0.26); },                                                 // a guardian gets ready to attack
    squeak(b, t, p) { const f = 520 * (p || 1); voc(b, t, f * 1.4, f * 0.7, 0.24, 0.12, 1700, 900); },                                   // a guardian got hit
    tired(b, t) { voc(b, t, 300, 190, 0.5, 0.07, 700, 450); },
    duel(b, t) { [0, 3, 7, 10, 12].forEach((d, i) => marimba(b, mtof(57 + d), t + i * 0.09, 0.3)); osc(b, 'sine', 110, t, 0.3, 0.01, 0.5, { f2: 70 }); },
    flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.1, 700 + i * 90, 900 + i * 90, 0.07, 0.08, 1500, 2200); },
    heal(b, t) { [0, 4, 7, 12].forEach((d, i) => kalimba(b, mtof(72 + d), t + i * 0.06, 0.2)); chime(b, mtof(91), t + 0.26, 0.1); },                    // a friend helped a hero up
    grab(b, t) { osc(b, 'sine', 300, t, 0.3, 0.02, 0.3, { f2: 760, gt: 0.3 }); noise(b, t, 0.12, 0.04, 0.3, 'bandpass', 700, 1900, 1.2); },                 // a bird picks a hero up
    poof(b, t) { noise(b, t, 0.22, 0.01, 0.22, 'lowpass', 1400, 300); osc(b, 'sine', 520, t, 0.2, 0.004, 0.16, { f2: 210 }); },                              // a small enemy disappears
    bird(b, t) { for (let i = 0; i < 3; i++) osc(b, 'triangle', 1250 - i * 140, t + i * 0.13, 0.09, 0.01, 0.1, { f2: 900 - i * 100, lp: 3200 }); }            // a big bird is coming
  };
  /* The second game has its own sounds for the same moments: glass crystals, claws, bouncy balls, robots, George's roar.
     A name that is not here uses the sound of the first game. */
  const fx2 = {
    egg(b, t, n) { const f = mtof(76 + PENT[(n || 0) % 10]); chime(b, f, t, 0.16); chime(b, f * 1.5, t + 0.05, 0.09); osc(b, 'sine', f * 4, t, 0.03, 0.002, 0.12); },          // a crystal rings like glass
    star(b, t) { [0, 7, 12, 19, 24].forEach((d, i) => chime(b, mtof(74 + d), t + i * 0.08, 0.11)); },
    giant(b, t) { [0, 2, 4, 7, 9, 12, 14, 16, 19, 24].forEach((d, i) => { chime(b, mtof(69 + d), t + i * 0.07, 0.12); if (i % 2) kalimba(b, mtof(57 + d), t + i * 0.07, 0.12); }); },
    stomp(b, t) { for (let i = 0; i < 3; i++) noise(b, t + i * 0.09, 0.24, 0.015, 0.1, 'bandpass', 900, 2800, 1.4); osc(b, 'sine', 150, t, 0.4, 0.01, 0.4, { f2: 95, gt: 0.35 }); chime(b, mtof(88), t + 0.05, 0.05); },   // Boon's claws: three quick swishes
    kick(b, t, p) { const f = 250 + (p || 0) * 70; osc(b, 'sine', f, t, 0.45, 0.004, 0.2, { f2: f * 2.1, gt: 0.12 }); osc(b, 'triangle', f * 1.5, t + 0.02, 0.14, 0.003, 0.08, { lp: 2000 }); },                        // Killer's kick: a springy "boing"
    plate(b, t) { noise(b, t, 0.2, 0.004, 0.05, 'bandpass', 1400, 3200, 1.2); chime(b, mtof(91), t + 0.03, 0.07); },     // a stone plate clicks, a little bell rings (T7.2)
    bridge(b, t, n) { const d = [0, 2, 4, 5, 7, 9, 11][(n || 0) % 7]; chime(b, mtof(79 + d), t, 0.07); osc(b, 'sine', mtof(91 + d), t, 0.02, 0.003, 0.25); },   // a plank of light appears: one glass note of a scale (T7.4)
    crank(b, t, n) { const d = [0, 2, 4, 7][(n || 0) % 4]; for (let i = 0; i < 3; i++) noise(b, t + i * 0.07, 0.1, 0.004, 0.05, 'bandpass', 700 + d * 60, 1800, 1.6); chime(b, mtof(74 + d), t + 0.1, 0.06); },   // four soft wooden clicks, a little higher each turn (T8)
    raftGo(b, t) { noise(b, t, 0.5, 0.05, 0.06, 'bandpass', 420, 640, 0.8); },                                              // the raft moves: soft water
    boing(b, t) { osc(b, 'sine', 330, t, 0.4, 0.004, 0.22, { f2: 760, gt: 0.22 }); osc(b, 'triangle', 660, t + 0.02, 0.2, 0.004, 0.1, { f2: 1180, gt: 0.2, lp: 2200 }); },   // a lily pad springs (T8)
    plateOff(b, t) { chime(b, mtof(84), t, 0.06); },                                                                       // let go: the same bell, lower
    cage(b, t) { noise(b, t, 0.18, 0.004, 0.04, 'bandpass', 1800, 3600, 1.5); noise(b, t + 0.12, 0.18, 0.004, 0.04, 'bandpass', 1800, 3600, 1.5); [0, 4, 7, 12].forEach((d, i) => chime(b, mtof(79 + d), t + 0.22 + i * 0.07, 0.1)); },   // the lock clicks twice, then a happy arpeggio (T7.2)
    bounce(b, t) { osc(b, 'sine', 380, t, 0.15, 0.003, 0.1, { f2: 640, gt: 0.08 }); },
    bonk(b, t) { osc(b, 'sine', 760, t, 0.4, 0.01, 0.36, { f2: 170, gt: 0.34 }); osc(b, 'triangle', 380, t + 0.03, 0.14, 0.01, 0.3, { f2: 110, lp: 1600 }); },                                                        // a hero shrinks
    heal(b, t) { osc(b, 'sine', 180, t, 0.36, 0.01, 0.34, { f2: 760, gt: 0.3 }); [0, 7, 12].forEach((d, i) => chime(b, mtof(79 + d), t + 0.24 + i * 0.06, 0.1)); },                                                    // a hero grows back
    drop(b, t) { chime(b, mtof(84), t, 0.1); chime(b, mtof(79), t + 0.08, 0.09); chime(b, mtof(72), t + 0.16, 0.08); },
    squelch(b, t) { noise(b, t, 0.18, 0.015, 0.14, 'lowpass', 800, 260); osc(b, 'sine', 190, t, 0.18, 0.01, 0.12, { f2: 120 }); },
    step(b, t, x) {
      const k = x >> 1, alt = x & 1 ? 1.1 : 0.94;
      if (k === 0) { osc(b, 'sine', 150 * alt, t, 0.12, 0.004, 0.07, { f2: 95 }); osc(b, 'sine', 135 * alt, t + 0.05, 0.07, 0.004, 0.06, { f2: 90 }); }
      else { osc(b, 'sine', 240 * alt, t, 0.07, 0.003, 0.05, { f2: 170 }); osc(b, 'triangle', 900 * alt, t, 0.012, 0.003, 0.03, { lp: 2600 }); }
    },
    wake(b, t) { osc(b, 'triangle', 880, t, 0.16, 0.004, 0.09, { lp: 2800 }); osc(b, 'triangle', 1175, t + 0.13, 0.16, 0.004, 0.12, { lp: 2800 }); },                                                               // a robot switches on: beep-beep
    stun(b, t) { osc(b, 'triangle', 880, t, 0.16, 0.004, 0.34, { f2: 220, gt: 0.32, lp: 2600 }); },                                                                                                                  // a robot runs down
    poof(b, t) { noise(b, t, 0.2, 0.01, 0.22, 'lowpass', 1400, 300); [988, 740, 494].forEach((f, i) => osc(b, 'triangle', f, t + i * 0.07, 0.1, 0.004, 0.07, { lp: 2600 })); },
    caw(b, t) { growl(b, t, 150, 88, 0.75, 0.42, 21); },                                                                                                                                                            // George's roar: low and warm, never harsh
    pop(b, t) { osc(b, 'sine', 520, t, 0.22, 0.003, 0.12, { f2: 940, gt: 0.1 }); },
    rustle(b, t) { noise(b, t, 0.3, 0.02, 0.45, 'lowpass', 420, 150); },
    butterfly(b, t) { noise(b, t, 0.22, 0.05, 0.6, 'bandpass', 400, 2600, 1.1); osc(b, 'sine', 220, t, 0.2, 0.03, 0.55, { f2: 990, gt: 0.5 }); },                                                                  // the rocket
    wave(b, t) { [0, 3, 7, 10].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.11, 0.28)); chime(b, mtof(86), t + 0.44, 0.1); },
    win(b, t) { [0, 5, 7, 12, 7, 12, 17, 19, 24].forEach((d, i) => { marimba(b, mtof(62 + d), t + i * 0.12, 0.3); if (i % 2 === 0) chime(b, mtof(86 + d), t + i * 0.12, 0.07); }); },
    lantern(b, t) { noise(b, t, 0.2, 0.02, 0.28, 'lowpass', 1100, 320); osc(b, 'sine', 330, t, 0.1, 0.01, 0.2, { f2: 210 }); },                                                                                      // a torch catches fire
    warn(b, t) { osc(b, 'triangle', 392, t, 0.2, 0.005, 0.12, { lp: 1800 }); osc(b, 'triangle', 392, t + 0.16, 0.2, 0.005, 0.12, { lp: 1800 }); },
    tonk(b, t) { osc(b, 'triangle', 660, t, 0.2, 0.002, 0.08, { f2: 540, lp: 2400 }); osc(b, 'sine', 1320, t, 0.05, 0.002, 0.05); },
    squeak(b, t, p) { const f = 300 * (p || 1); voc(b, t, f * 1.3, f * 0.7, 0.28, 0.13, 1000, 600); },                                                                                                              // George got hit
    tired(b, t) { growl(b, t, 130, 80, 0.5, 0.2, 9); },
    duel(b, t) { [0, 0, 3].forEach((d, i) => marimba(b, mtof(50 + d), t + i * 0.14, 0.32)); growl(b, t + 0.35, 150, 90, 0.7, 0.4, 21); },
    flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.11, 520 - i * 50, 380 - i * 40, 0.08, 0.09, 1200, 800); },
    goal(b, t) { [0, 7, 12, 17].forEach((d, i) => marimba(b, mtof(64 + d), t + i * 0.08, 0.34)); chime(b, mtof(88), t + 0.3, 0.12); },
    dash(b, t) { noise(b, t, 0.16, 0.015, 0.17, 'bandpass', 500, 2100, 1.1); osc(b, 'sine', 330, t, 0.1, 0.01, 0.16, { f2: 760, gt: 0.14 }); },      // starting to run: a short soft "whoosh" going up
    // Boon throws the bones: three low "fup-fup-fup" with a tremble, and the bones knocking on a wall: a warm wooden "tock"
    bone(b, t, v) { for (let i = 0; i < 3; i++) osc(b, 'triangle', 180 - i * 20, t + i * 0.055, 0.12 + (v || 0) * 0.05, 0.008, 0.09, { f2: 140 - i * 14, gt: 0.08, trem: 14 }); noise(b, t, 0.1, 0.01, 0.12, 'bandpass', 700, 420, 1.4); },
    tock(b, t) { osc(b, 'sine', 520, t, 0.16, 0.004, 0.06, { f2: 430, gt: 0.05 }); noise(b, t, 0.07, 0.002, 0.03, 'bandpass', 1500, 900, 2.2); },
    // Killer's whirl gloves: two "fuip" going up and a soft rubbery squeak
    gloves(b, t) { for (let i = 0; i < 2; i++) noise(b, t + i * 0.12, 0.14, 0.012, 0.13, 'bandpass', 500, 1400, 1.2); osc(b, 'sine', 900, t + 0.1, 0.09, 0.01, 0.08, { f2: 700, gt: 0.07 }); },
    // The ten seconds: a soft wooden knock every second (higher in the last three), and the three kind notes of "Încă o dată!"
    tick(b, t, v) { osc(b, 'sine', v > 0.5 ? 880 : 660, t, 0.14, 0.004, 0.05, { f2: v > 0.5 ? 760 : 580, gt: 0.04 }); },
    // a mechanism clicks before it moves (T6.9): a short soft wooden "tic" with a spark of air
    click(b, t) { osc(b, 'triangle', 1250, t, 0.12, 0.002, 0.045, { f2: 900, gt: 0.04 }); noise(b, t, 0.04, 0.001, 0.05, 'bandpass', 2600, 1800, 2.0); },
    // a gate opens for the first time (T7.1): a warm rising marimba arpeggio of four notes, a soft breath of air and one high bell
    gateOpen(b, t) { [0, 4, 7, 12].forEach((d, i) => marimba(b, mtof(60 + d), t + 0.06 + i * 0.09, 0.26)); noise(b, t, 0.5, 0.08, 0.45, 'lowpass', 700, 260); chime(b, mtof(84), t + 0.42, 0.09); },
    retry(b, t) { [72, 67, 64].forEach((n, i) => marimba(b, mtof(n), t + i * 0.16, 0.3)); chime(b, mtof(79), t + 0.42, 0.1); }
  };
  /* Running (L3) in the first game too: the same short soft whoosh. */
  fx.dash = fx2.dash; fx.tick = fx2.tick; fx.retry = fx2.retry;
  const CHR = { give: 1, egg: 1, star: 1, giant: 1, stomp: 1, kick: 1, bounce: 1, bonk: 1, drop: 1, squelch: 1, step: 1, swish: 1, heal: 1, grab: 1, dash: 1, bone: 1, tock: 1, gloves: 1 };
  fx.dash = fx2.dash; fx.tick = fx2.tick; fx.retry = fx2.retry; fx.click = fx2.click;
  /* play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. */
  function play(name, arg, k, vol) {
    const f = (GAME === 'lupta' && fx2[name]) || fx[name];
    if (!ac || ac.state !== 'running' || !f) return;
    let b = CHR[name] ? ((k === 0 || k === 1) && outs[k] && outs[k].context.state === 'running' ? outs[k] : chrBus) : ambBus;
    if (vol != null && vol !== 1) {      // a quieter copy of the same sound (running footsteps): a small gain in front of the bus
      const g = b.context.createGain(); g.gain.value = vol; g.connect(b); g.small = b.small; g.lead = b.lead; b = g;
    }
    try { f(b, b.context.currentTime + (b.lead || 0), arg); } catch (e) { console.error('sound ' + name, e); }      // lead: see setSink
  }

  // ---- the controller's own speaker (only when the system shows it as an audio output) ----
  const canSink = () => !!(window.AudioContext && 'setSinkId' in AudioContext.prototype && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
  /* Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). */
  async function listOutputs(ask) {
    if (!canSink()) return null;
    let denied = false;
    if (ask) { try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }); st.getTracks().forEach(tr => tr.stop()); } catch (e) { denied = true; } }
    let ds = [];
    try { ds = await navigator.mediaDevices.enumerateDevices(); } catch (e) { ds = []; }
    const list = ds.filter(d => d.kind === 'audiooutput' && d.deviceId && d.deviceId !== 'default' && d.deviceId !== 'communications' && d.label).map(d => ({ id: d.deviceId, label: d.label }));
    return { list, denied: denied && !list.length };
  }
  async function setSink(k, dev) {     // dev = { id, label } or null for the computer's speakers
    if (!dev) { outs[k] = null; return true; }
    try {
      let s = sinks[dev.id];
      if (!s) {
        const c2 = new AudioContext(); await c2.setSinkId(dev.id);
        // a small speaker: nothing below 200 Hz (it could not play it anyway), a little more "presence", then a compressor
        const bus = c2.createGain(), hp = c2.createBiquadFilter(), pk = c2.createBiquadFilter(), comp = c2.createDynamicsCompressor();
        hp.type = 'highpass'; hp.frequency.value = 200; pk.type = 'peaking'; pk.frequency.value = 2400; pk.Q.value = 0.8; pk.gain.value = 4;
        bus.connect(hp); hp.connect(pk); pk.connect(comp); toSpeaker(c2, comp);
        bus.small = !/built-?in|macbook|imac|display|hdmi|airpods|headphone|c[aă]ști|boxe/i.test(dev.label || '');      // low notes are moved up on small speakers (a controller), not on real ones
        // A second audio output is filled in big blocks. A short sound that starts "now" would begin in a block that is already on its way
        // and would be cut or lost (steps, kicks, short words). So every sound on this output starts a moment later: one block ahead.
        bus.lead = Math.max(0.04, (c2.baseLatency || 0) + 0.03);
        s = sinks[dev.id] = { ac: c2, bus }; applyVol();
      }
      if (s.ac.state === 'suspended') await s.ac.resume();
      outs[k] = s.bus; return true;
    } catch (e) { outs[k] = null; return false; }
  }
  function swapOuts() { const t = outs[0]; outs[0] = outs[1]; outs[1] = t; }

  return {
    init, play, talk, voiceInfo, sayWord: (k, id) => voiceSay(k, id), voiceReady: () => voice.ready, voiceCount: k => voice.buf[k].filter(Boolean).length, music, ambience, canSink, listOutputs, setSink, swapOuts, names: () => Object.keys(fx), names2: () => Object.keys(fx2), words: id => BABBLE[id || GAME] || BABBLE.bubu, debug: () => ({ ac, master, outs, sinks, chrBus, ambBus }),
    get ready() { return !!ac && ac.state === 'running'; },
    vol,
    setVol(k, v) { if (!(k in vol) || !isFinite(v)) return; vol[k] = clamp(Math.round(v * 10) / 10, 0, 1); applyVol(); },
    setDuck(d) { if (d !== duck) { duck = d; applyVol(); } }
  };
})();

/* Voice-over with a system voice in the chosen language, when one is installed. */
const Voice = {
  v: null, ok: false, speaking: false, _hooked: false,
  init() {
    if (!('speechSynthesis' in window)) return;
    this.pick();
    if (!this._hooked) { this._hooked = true; try { speechSynthesis.addEventListener('voiceschanged', () => this.pick()); } catch (e) { /* ignore */ } }
  },
  pick() {
    let vs = []; try { vs = speechSynthesis.getVoices(); } catch (e) { vs = []; }
    const re = Opt.lang === 'en' ? /^en/i : /^ro/i;
    this.v = vs.find(v => re.test(v.lang) && v.localService && (Opt.lang !== 'en' || /en[-_](US|GB)/i.test(v.lang))) || vs.find(v => re.test(v.lang) && v.localService) || vs.find(v => re.test(v.lang)) || null;
    this.ok = !!this.v;
  },
  say(txt, keep) {
    if (!CONFIG.voice || !this.v) return;
    try {
      if (!keep) speechSynthesis.cancel();
      const parts = txt.match(/[^.!?…]+[.!?…]+/g) || [txt];
      parts.forEach((s, i) => {
        const u = new SpeechSynthesisUtterance(s.trim());
        u.voice = this.v; u.lang = this.v.lang || (Opt.lang === 'en' ? 'en-US' : 'ro-RO'); u.rate = CONFIG.voiceRate; u.pitch = 1.08;
        u.volume = Snd.vol.chr <= 0 ? 0 : clamp(0.4 + Snd.vol.chr * 0.6, 0, 1);
        if (i === 0) u.onstart = () => { this.speaking = true; };
        if (i === parts.length - 1) u.onend = u.onerror = () => { this.speaking = false; };
        speechSynthesis.speak(u);
      });
    } catch (e) { /* ignore */ }
  },
  stop() { this.speaking = false; try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
};
