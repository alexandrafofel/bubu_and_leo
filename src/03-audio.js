
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

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); for (const id in sinks) if (sinks[id].ac.state === 'suspended') sinks[id].ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ac = new AC(); } catch (e) { ac = null; return; }
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500; lp.Q.value = 0.3;
    master = ac.createGain(); master.gain.value = 1.3;
    master.connect(lp); lp.connect(comp); comp.connect(ac.destination);
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
  function osc(bus, type, f, t, g, att, dec, o) {
    const a = bus.context, os = a.createOscillator(), gn = a.createGain();
    os.type = type; os.frequency.setValueAtTime(f, t);
    if (o && o.f2) os.frequency.exponentialRampToValueAtTime(o.f2, t + (o.gt || dec));
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(g, t + att);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + att + dec);
    let node = os;
    if (o && o.lp) { const fl = a.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; os.connect(fl); node = fl; }
    node.connect(gn); gn.connect(bus);
    os.start(t); os.stop(t + att + dec + 0.05);
  }
  function noise(bus, t, g, att, dec, type, f, f2, q) {
    const a = bus.context, s = a.createBufferSource(); s.buffer = nbuf(a); s.loop = true;
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
  // Bubu speaks low and round, Leo higher and brighter.
  const VOX = [{ f: 215, m: 620 }, { f: 400, m: 1050 }];
  const say = (bus, t, k, a, b, dur, g) => { const v = VOX[k ? 1 : 0]; voc(bus, t, v.f * a, v.f * b, dur, g, v.m * (a < b ? 0.8 : 1.4), v.m * (a < b ? 1.5 : 0.75)); };
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
    ending: { root: 60, sc: MAJ, bpm: 72,  seed: 97, flute: 1, chimes: 1 }
  };
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
    if (n != null) kalimba(musicBus, mtof(deg(p, n) + 12), t + hum(), (s % 4 === 0 ? 0.17 : 0.12) + Math.random() * 0.03);
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
    }
    if (!song) return;
    if (nextT < ac.currentTime) nextT = ac.currentTime + 0.05;
    while (nextT < ac.currentTime + 0.25) { schedule(step, nextT); step++; nextT += song.spb; }
  }
  const AMBS = {
    title: { birds: 0.3 }, l0: { birds: 0.4 }, l1: { birds: 0.5, owl: 1 }, l2: { birds: 0.25, water: 0.6 }, l3: { birds: 0.15, wind: 0.7 },
    l4: { birds: 0.2, water: 1 }, l5: { birds: 0.08, crickets: 1, wind: 0.25 }, boss: { crickets: 1, wind: 0.35 }, ending: { crickets: 1 }
  };
  function ambience(key) { amb = AMBS[key] || null; applyAmb(); }
  function music(key) {
    if (key === songKey) return;
    songKey = key; song = key && SONGS[key] ? makeSong(SONGS[key]) : null; step = 0; nextT = 0;
    if (key !== 'duel') ambience(key);
  }

  // ---- sound effects -------------------------------------------------------
  const PENT = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  /* Every effect gets: b = the bus to play on, t = the time now on that bus, x = an optional value. */
  const fx = {
    // --- the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) ---
    egg(b, t, n) { const f = mtof(72 + PENT[(n || 0) % 10]); kalimba(b, f, t, 0.2); kalimba(b, f * 1.5, t + 0.07, 0.1); },
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
    vGo(b, t, k) { say(b, t, k, 0.9, 1.3, 0.13, k ? 0.11 : 0.15); },                                   // "hop!" before a stomp or a kick
    vOw(b, t, k) { say(b, t, k, 1.5, 0.8, 0.2, 0.15); say(b, t + 0.22, k, 1.1, 0.7, 0.28, 0.11); },     // "au-uu"
    vYay(b, t, k) { say(b, t, k, 1.0, 1.25, 0.12, 0.12); say(b, t + 0.15, k, 1.25, 1.9, 0.26, 0.13); }, // "iu-huu!"
    vWow(b, t, k) { say(b, t, k, 0.8, 1.7, 0.42, 0.12); },                                              // "uaaau"
    vHide(b, t, k) { say(b, t, k, 1.3, 1.1, 0.1, 0.08); say(b, t + 0.13, k, 1.3, 1.1, 0.1, 0.08); },    // "ih-ih" (safe in the nest)
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
    flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.1, 700 + i * 90, 900 + i * 90, 0.07, 0.08, 1500, 2200); }
  };
  const CHR = { egg: 1, star: 1, giant: 1, stomp: 1, kick: 1, bounce: 1, bonk: 1, drop: 1, squelch: 1, step: 1, vGo: 1, vOw: 1, vYay: 1, vWow: 1, vHide: 1 };
  /* play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. */
  function play(name, arg, k) {
    if (!ac || ac.state !== 'running' || !fx[name]) return;
    let b = CHR[name] ? ((k === 0 || k === 1) && outs[k] && outs[k].context.state === 'running' ? outs[k] : chrBus) : ambBus;
    try { fx[name](b, b.context.currentTime, arg); } catch (e) { console.error('sound ' + name, e); }
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
        const bus = c2.createGain(), comp = c2.createDynamicsCompressor(); bus.connect(comp); comp.connect(c2.destination);
        s = sinks[dev.id] = { ac: c2, bus }; applyVol();
      }
      if (s.ac.state === 'suspended') await s.ac.resume();
      outs[k] = s.bus; return true;
    } catch (e) { outs[k] = null; return false; }
  }
  function swapOuts() { const t = outs[0]; outs[0] = outs[1]; outs[1] = t; }

  return {
    init, play, music, ambience, canSink, listOutputs, setSink, swapOuts, names: () => Object.keys(fx), debug: () => ({ ac, master, outs, sinks, chrBus, ambBus }),
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
