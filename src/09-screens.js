
/* ==========================================================================
   SCREENS: start, level story card, level end, pause, settings, festival ending.
   Saving (progress and settings) on this computer.
   ========================================================================== */
const UI = { titleBg: null, titleOv: null, endBg: null, endOv: null, seen: [false, false], ready: [false, false], menuSel: 0, startT: -1,
  pauseSel: 0, introT: 0, endT: 0, lvlT: 0, loadStep: 0, lostK: -1, hatch: false, said2: false, fwT: 0,
  bgs: {}, ends: {}, spkLost: -1, spkLostT: 0,          // gameSel: the game picked on the "choose the game" screen
  set: null, hits: [], click: null, hover: null, clicked: false,
  retryT: 0, retryMercy: false, skipIntro: false };      // "Încă o dată!": how long it has been on screen, whether the children now get more seconds
const DIFFS = ['easy', 'normal', 'hard'];
const heroOf = p => Opt.swap ? 1 - p : p;        // which hero (0 Bubu, 1 Leo) player p plays

/* One save for everything. The settings are shared by the two games. Each game keeps its own progress:
   the first game at the top of the save (as before), the second one in g2.
   Progress of a game (a "slot"):
     level    the chapter "Continue" starts (see chapters() in 06-level.js)
     max      how far the players have ever got: chapters 0 .. max are open on the Chapters screen
     results  the best result of every chapter played: { eggs, stars, med: [3 medals] }
     eggs, stars  the team total = the sum of results. Still written, so that an older version of the game can read the file. */
const emptyResult = () => ({ eggs: 0, stars: 0, med: [false, false, false] });
function sumResults(res) { const t = { eggs: 0, stars: 0 }; for (const r of res || []) if (r) { t.eggs += r.eggs | 0; t.stars += r.stars | 0; } return t; }
/* A save from before chapters (version 3 or older) becomes version 4. It changes only what is missing, so it can run again. */
function migrateSave(d) {
  if (!d || (d.v | 0) >= 4) return d;
  for (const sl of [d, d.g2]) {
    if (!sl || typeof sl !== 'object') continue;
    const lvl = Math.max(0, sl.level | 0), res = sl.results = Array.isArray(sl.results) ? sl.results : [];
    for (let i = 0; i < lvl; i++) if (!res[i]) res[i] = emptyResult();      // a level that was played must have a result (it should always have had one)
    if (sl.max == null) sl.max = lvl;
    const sum = sumResults(res), had = sl.eggs | 0;
    if (sum.eggs < had) { if (!res[0]) res[0] = emptyResult(); res[0].eggs = (res[0].eggs | 0) + had - sum.eggs; }      // the total the children saw must not get smaller
    const tt = sumResults(res); sl.eggs = tt.eggs; sl.stars = Math.max(tt.stars, sl.stars | 0);
  }
  d.v = 4; return d;
}
const Save = {
  data: null,
  load() { try { const s = localStorage.getItem(CONFIG.saveKey); this.data = s ? migrateSave(JSON.parse(s)) : null; } catch (e) { this.data = null; } return this.data; },
  slot(id) { const d = this.data; if (!d) return null; return (id || GAME) === 'lupta' ? (d.g2 || null) : d; },      // the progress of one game
  /* the progress of the chosen game, made if it is not there yet */
  own() { const d = this.data || (this.data = {}); return GAME === 'lupta' ? (d.g2 = d.g2 || {}) : d; },
  /* "New game": the progress of the chosen game is erased. The other game and the settings stay. */
  newGame() { const sl = this.own(); sl.level = 0; sl.max = 0; sl.results = []; sl.eggs = 0; sl.stars = 0; Game.results = []; this.write(); },
  /* Chapter i is over with result r. The chapter keeps its best result, "Continue" moves on only if this was the chapter it
     pointed at, and the chapters up to the next one open. */
  finish(i, r) {
    const sl = this.own(), res = sl.results = Array.isArray(sl.results) ? sl.results : [], o = res[i];
    res[i] = o ? Object.assign({}, o, { eggs: Math.max(o.eggs | 0, r.eggs | 0), stars: Math.max(o.stars | 0, r.stars | 0), med: [0, 1, 2].map(j => !!(o.med && o.med[j]) || !!(r.med && r.med[j])), tries: Math.min(o.tries != null ? o.tries : 99, r.tries | 0) })
               : { eggs: r.eggs | 0, stars: r.stars | 0, med: (r.med || []).slice(0, 3).map(Boolean) };
    for (let j = 0; j < i; j++) if (!res[j]) res[j] = emptyResult();
    const last = chapters().length - 1;
    if (i >= (sl.level | 0)) sl.level = Math.min(i + 1, last);
    sl.max = Math.max(sl.max | 0, Math.min(i + 1, last));
    const tt = sumResults(res); sl.eggs = tt.eggs; sl.stars = tt.stars;
    Game.results = res; this.write();
  },
  write() {
    const d = this.data || {};
    d.v = 4; d.game = GAME; d.diff = Game.diff; d.vol = { music: Snd.vol.music, amb: Snd.vol.amb, chr: Snd.vol.chr };
    d.opt = { lang: Opt.lang, fullscreen: Opt.fullscreen, vibration: Opt.vibration, swap: Opt.swap, ctrl: Opt.ctrl, keys: Opt.keys, guide: Opt.guide, sink: Opt.sink };
    this.data = d;
    try { localStorage.setItem(CONFIG.saveKey, JSON.stringify(d)); } catch (e) { /* private mode */ }
  },
  /* Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. */
  apply() {
    const d = this.data; if (!d) return;
    if (Array.isArray(d.diff)) for (let k = 0; k < 2; k++) if (DIFFS.indexOf(d.diff[k]) >= 0) Game.diff[k] = d.diff[k];
    const v = d.vol;
    if (v) { Snd.setVol('music', v.music); Snd.setVol('amb', v.amb != null ? v.amb : v.sfx); Snd.setVol('chr', v.chr != null ? v.chr : v.sfx); }
    const o = d.opt; if (!o) return;
    if (o.lang === 'ro' || o.lang === 'en') Opt.lang = o.lang;
    if (typeof o.fullscreen === 'boolean') Opt.fullscreen = o.fullscreen;
    if (typeof o.vibration === 'boolean') Opt.vibration = o.vibration;
    Opt.swap = !!o.swap;
    for (let k = 0; k < 2; k++) {
      if (o.ctrl && (o.ctrl[k] === 'kb' || o.ctrl[k] === 'pad')) Opt.ctrl[k] = o.ctrl[k];
      if (o.guide && typeof o.guide[k] === 'boolean') Opt.guide[k] = o.guide[k];
      if (o.sink && typeof o.sink[k] === 'string') Opt.sink[k] = o.sink[k];
      const ks = o.keys && o.keys[k];
      if (ks) for (const f of KEY_FIELDS) if (typeof ks[f] === 'string' && ks[f] && !Input.RESERVED[ks[f]]) Opt.keys[k][f] = ks[f];
    }
  },
  hasProgress(id) { const s = this.slot(id); return !!(s && s.level > 0 && s.level < chapters(id).length); },
  /* the furthest chapter open on the Chapters screen (-1: no chapter was ever finished, the button is not shown) */
  maxOpen(id) { const s = this.slot(id); return s && (s.max | 0) > 0 ? Math.min(s.max | 0, chapters(id).length - 1) : -1; }
};
const KEY_FIELDS = ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'r', 'g'];      // a = first power (✕), b = help (○), c = second power (□), r = run (L3), g = give an egg (L1)

/* Mouse: every clickable thing adds a rectangle while it is drawn. */
function hitAdd(x, y, w, h, id, v, act, val) { UI.hits.push({ x, y, w, h, id, v, act, val }); }
function hitFind(p) {
  if (!p) return null;
  for (let i = UI.hits.length - 1; i >= 0; i--) { const r = UI.hits[i]; if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) return r; }
  return null;
}
/* Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. */
const pressedGo = () => Input.any(s => s.aP) || Input.menu.ok || !!UI.click;
/* What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. */
function pressText() {
  const S = Input.slots;
  if (S[0].pad != null || S[1].pad != null) return T('t.press');
  for (let k = 0; k < 2; k++) if (S[k].joined && Opt.ctrl[k] === 'kb') return T('t.pressKey', keyName(Opt.keys[k].a));
  return T('t.press');
}
function fitText(c, str, x, y, size, maxW, col, o) {
  setFont(c, size, o && o.title, o && o.weight);
  const w = c.measureText(str).width, s = w > maxW ? Math.max(14, Math.floor(size * maxW / w)) : size;
  if (/[✕□○◉]/.test(str)) richText(c, str, x, y, s, col, o); else text(c, str, x, y, s, col, o);
}
/* The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. */
function swapHeroes() {
  Opt.swap = !Opt.swap; Input.swap(); Snd.swapOuts();
  for (const a of [Opt.ctrl, Opt.keys, Opt.guide, Opt.sink, Game.diff, UI.seen, UI.ready]) { const t = a[0]; a[0] = a[1]; a[1] = t; }
  Snd.play('ui'); Save.write();
}
function cycleDiff(k, d) { Game.diff[k] = DIFFS[(DIFFS.indexOf(Game.diff[k]) + d + DIFFS.length) % DIFFS.length]; Snd.play('ui'); Save.write(); }
function setLanguage(l) {
  Opt.lang = l === 'en' ? 'en' : 'ro';
  try { document.documentElement.lang = Opt.lang; document.title = T('title') + ': ' + T('subtitle'); } catch (e) { /* ignore */ }
  Voice.stop(); Voice.pick();
}

function paintMeadowScene(skyT, horizon, seed) {
  const cv = makeCanvas(W, H), c = cv.getContext('2d'), r = rng(seed), P0 = skyT > 1 ? PALS.sunset : PALS.meadow;
  paintSky(c, 0, 0, W, horizon + 60, skyT, seed, { sunX: 0.5, sunR: 90, clouds: 8 });
  paintHills(c, 0, horizon + 10, W, 240, skyT, seed + 1);
  const dusk = clamp(skyT - 1, 0, 0.3) / 0.3;
  const g = c.createLinearGradient(0, horizon, 0, H); g.addColorStop(0, mix(P0.g0, '#8E7AA0', dusk * 0.35)); g.addColorStop(1, mix(P0.g1, '#6A5A80', dusk * 0.45));
  c.fillStyle = g; c.beginPath(); c.moveTo(0, horizon + 10); for (let x = 0; x <= W; x += 60) c.lineTo(x, horizon + Math.sin(x / 330 + seed) * 16); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
  for (let i = 0; i < 70; i++) wash(c, r() * W, horizon + r() * (H - horizon), 120 + r() * 260, 50 + r() * 130, mix(P0.tints[i % P0.tints.length], '#8E7AA0', dusk * 0.3), { a: 0.12 + r() * 0.1, seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([W / 2 + Math.sin(u * 5) * 120 * u, horizon + 20 + u * u * (H - horizon)]); }
  for (let i = 0; i < pts.length - 1; i++) brushLine(c, [pts[i], pts[i + 1]], 30 + i * 22, P0.path, 0.5, i + 3);
  c.lineCap = 'round';
  for (let i = 0; i < 2600; i++) { const x = r() * W, y = horizon + 10 + r() * (H - horizon), s = 0.4 + (y - horizon) / (H - horizon); c.strokeStyle = rgba(i % 3 ? shade(P0.g1, -0.22) : shade(P0.g0, 0.3), 0.14 + r() * 0.12); c.lineWidth = (1.2 + r() * 1.6) * s; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 10 * s, y - (8 + r() * 18) * s); c.stroke(); }
  for (let i = 0; i < 420; i++) { const x = r() * W, y = horizon + 30 + r() * (H - horizon - 30), s = (4 + r() * 5) * (0.5 + (y - horizon) / (H - horizon)), col = P0.flowers[i % P0.flowers.length]; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); } wash(c, x, y, s * 0.4, s * 0.4, '#F3D36B', { a: 1, seed: i, layers: 1, edge: 0 }); }
  const trees = [[150, horizon - 70, 190], [1790, horizon - 50, 170], [420, horizon - 20, 90], [1540, horizon - 10, 80]];
  for (const t of trees) { wash(c, t[0] - t[2] * 0.6, t[1] + t[2] * 1.2, t[2] * 1.2, t[2] * 0.3, SHADOW, { a: 0.3, seed: 2, edge: 0 }); paintTree(c, { x: t[0], y: t[1], R: t[2], ci: (t[0] | 0) % P0.canopy.length, seed: t[0] }, P0); }
  finishPaint(c, W, H, Math.min(1, skyT), r);
  return cv;
}
/* The backdrop of the second game: the jungle at night, under the moon and the northern lights. */
function paintJungleScene(horizon, seed) {
  const cv = makeCanvas(W, H), c = cv.getContext('2d'), r = rng(seed), P0 = PALS.glade;
  paintNightSky(c, 0, 0, W, horizon + 60, seed, { sunX: 0.5, sunR: 90, clouds: 7 });
  paintHills(c, 0, horizon + 10, W, 240, 0, seed + 1, NIGHT_HILLS, true);
  const g = c.createLinearGradient(0, horizon, 0, H); g.addColorStop(0, P0.g0); g.addColorStop(1, P0.g1);
  c.fillStyle = g; c.beginPath(); c.moveTo(0, horizon + 10); for (let x = 0; x <= W; x += 60) c.lineTo(x, horizon + Math.sin(x / 330 + seed) * 16); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
  for (let i = 0; i < 70; i++) wash(c, r() * W, horizon + r() * (H - horizon), 120 + r() * 260, 50 + r() * 130, RAINBOW[i % 7], { a: 0.07 + r() * 0.08, seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([W / 2 + Math.sin(u * 5) * 120 * u, horizon + 20 + u * u * (H - horizon)]); }
  for (let i = 0; i < pts.length - 1; i++) brushLine(c, [pts[i], pts[i + 1]], 30 + i * 22, P0.path, 0.5, i + 3);
  c.lineCap = 'round';
  for (let i = 0; i < 2600; i++) { const x = r() * W, y = horizon + 10 + r() * (H - horizon), s = 0.4 + (y - horizon) / (H - horizon); c.strokeStyle = rgba(i % 3 ? shade(P0.g1, -0.22) : shade(P0.g0, 0.3), 0.14 + r() * 0.12); c.lineWidth = (1.2 + r() * 1.6) * s; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 10 * s, y - (8 + r() * 18) * s); c.stroke(); }
  for (let i = 0; i < 420; i++) { const x = r() * W, y = horizon + 30 + r() * (H - horizon - 30), s = (4 + r() * 5) * (0.5 + (y - horizon) / (H - horizon)), col = P0.flowers[i % P0.flowers.length]; const gg = c.createRadialGradient(x, y, 1, x, y, s * 3.4); gg.addColorStop(0, rgba(col, 0.32)); gg.addColorStop(1, rgba(col, 0)); c.fillStyle = gg; c.beginPath(); c.arc(x, y, s * 3.4, 0, TAU); c.fill(); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); } wash(c, x, y, s * 0.4, s * 0.4, '#FFF6D0', { a: 1, seed: i, layers: 1, edge: 0 }); }
  const trees = [[150, horizon - 70, 190], [1790, horizon - 50, 170], [420, horizon - 20, 90], [1540, horizon - 10, 80]];
  for (const t of trees) { wash(c, t[0] - t[2] * 0.6, t[1] + t[2] * 1.2, t[2] * 1.2, t[2] * 0.3, SHADOW, { a: 0.3, seed: 2, edge: 0 }); paintTree(c, { x: t[0], y: t[1], R: t[2], ci: (t[0] | 0) % P0.canopy.length, seed: t[0] }, P0); }
  finishPaint(c, W, H, 1, r, true);
  return cv;
}
/* The start-screen backdrop of each game is painted once, the first time it is needed. */
function titleBackdrop(id) {
  if (!UI.bgs[id]) UI.bgs[id] = id === 'lupta' ? { bg: paintJungleScene(600, 27), ov: makeOverlay('#C8D0FF', 0.1, 0.5, true) } : { bg: paintMeadowScene(0.3, 600, 21), ov: makeOverlay('#FFE6BE', 0.1, 0.42) };
  return UI.bgs[id];
}
/* Sets up the game (the second game is the only one now): its heroes, villain and boss values, its texts, pictures, music and progress. */
function setGame(id) {
  GAME = 'lupta'; applyGameConfig();      // there is only one game now; the argument is ignored
  for (const k in SPR) delete SPR[k];              // the cached pictures (egg or crystal, portraits, nest) belong to one game
  const b = titleBackdrop(GAME); UI.titleBg = b.bg; UI.titleOv = b.ov;
  UI.endBg = null; UI.seen = [false, false]; UI.ready = [false, false];
  setLanguage(Opt.lang);
}
function initScreens() {
  const b = titleBackdrop('lupta'); UI.titleBg = b.bg; UI.titleOv = b.ov;
}
function drawBackdrop(c, cv) { c.drawImage(cv, 0, 0); }
function prompt(c, str, x, y, size, t) { richText(c, str, x, y, size, '#7A4A52', { pulse: Math.sin(t * 5), title: false }); }


/* ---------- boot + title ---------- */
function drawBoot(c, t) {
  drawBackdrop(c, UI.titleBg);
  fitText(c, TG('lupta', 'title'), W / 2, 380, 150, 1500, '#FFE9B0', { title: true, haloCol: 'rgba(70,56,140,0.6)' });
  drawCrystal(c, W / 2, 640, 56, t, 2, 0, (t * 1.5 | 0) % 7);
  card(c, W / 2 - 520, 800, 1040, 150, '#FFF6E2', 3);
  text(c, T('boot.click'), W / 2, 852, 54, '#7A4A52', { halo: 0 });
  text(c, T('boot.sub'), W / 2, 912, 34, '#9A7A7A', { halo: 0, shadow: 0 });
}
/* The buttons under the heroes: "Continue: ...", "Chapters", "New game". At the very first start only one, and it says "Start!". */
function titleMenu() {
  const items = [];
  if (Save.hasProgress()) items.push({ id: 'cont', label: T('t.cont', chapterLabel(Save.slot().level)) });
  if (Save.maxOpen() >= 0) items.push({ id: 'chap', label: T('t.chapters') });
  items.push({ id: 'new', label: items.length ? T('t.new') : T('t.start') });
  return items;
}
/* What the chosen button does, once every player who joined is "Ready!". */
function titleGo() {
  const items = titleMenu(), it = items[clamp(UI.menuSel | 0, 0, items.length - 1)];
  if (it.id === 'cont') Game.startGame(true);
  else if (it.id === 'chap') Game.toChapters();
  else if (Save.hasProgress() || Save.maxOpen() >= 0) askYesNo(T('t.new'), T('t.newAsk'), T('t.newYes'), () => Game.startGame(false));      // there is something to lose: ask first
  else Game.startGame(false);
}
/* A small yes / no question over the start screen or the pause. "No" is the one shown first, so a child who keeps pressing ✕
   cannot erase anything by chance. ○ or Backspace also say no. */
function askYesNo(title, sub, yes, ok) { UI.ask = { title, sub, yes, ok, sel: 1 }; Snd.play('ui'); }
function askRows() { const a = UI.ask; return [{ kind: 'go', label: a.yes, ok: () => { UI.ask = null; a.ok(); } }, { kind: 'go', label: T('t.newNo'), ok: () => { UI.ask = null; Snd.play('ui'); } }]; }
function updateAsk() { if (Input.menu.back) { UI.ask = null; Snd.play('ui'); return; } menuNav(UI.ask, 'sel', askRows()); }
function drawAsk(c, t) { drawDim(c, 0.5); drawMenu(c, t, UI.ask.title, askRows(), UI.ask.sel, { w: 1100, rh: 86, sub: UI.ask.sub }); }
function updateTitle(dt) {
  const S = Input.slots, ck = hitFind(UI.click), nm = titleMenu().length;
  if (UI.ask) { updateAsk(); return; }
  if (Input.pause || (ck && ck.id === 'settings')) { openSettings(); return; }
  if (ck && ck.id === 'tmenu') { UI.menuSel = ck.v; Snd.play('ui'); }
  UI.menuSel = clamp(UI.menuSel | 0, 0, nm - 1);
  for (let k = 0; k < 2; k++) {
    const s = S[k];
    if (!s.joined) { UI.seen[k] = false; UI.ready[k] = false; continue; }
    if (!UI.seen[k]) { UI.seen[k] = true; Snd.play('ok'); continue; }
    if (s.aP && !UI.ready[k]) { UI.ready[k] = true; Snd.play('ok'); Snd.talk(k, 'ready'); Input.rumble(k, 0.3, 0.6, 120); }
    if (s.back && UI.ready[k]) { UI.ready[k] = false; UI.startT = -1; }
    if (s.left || s.right) cycleDiff(k, s.left ? -1 : 1);
    if ((s.up || s.down) && nm > 1) { UI.menuSel = (UI.menuSel + (s.up ? -1 : 1) + nm) % nm; Snd.play('ui'); }
    if (s.tri) { swapHeroes(); return; }
  }
  const joined = [0, 1].filter(k => UI.seen[k]);
  if (joined.length && joined.every(k => UI.ready[k])) {
    if (UI.startT < 0) UI.startT = 0.9;
    UI.startT -= dt;
    if (UI.startT <= 0) { UI.startT = -1; UI.ready = [false, false]; titleGo(); }
  } else UI.startT = -1;
}
function drawGear(c, x, y, r, col, t) {
  c.save(); c.translate(x, y); c.rotate(t * 0.4); c.fillStyle = col;
  for (let i = 0; i < 8; i++) { c.save(); c.rotate(i / 8 * TAU); c.beginPath(); c.rect(-r * 0.2, -r * 1.05, r * 0.4, r * 0.5); c.fill(); c.restore(); }
  c.beginPath(); c.arc(0, 0, r * 0.76, 0, TAU); c.fill();
  c.fillStyle = '#FFF6E2'; c.beginPath(); c.arc(0, 0, r * 0.32, 0, TAU); c.fill();
  c.restore();
}
function drawTitle(c, t) {
  drawBackdrop(c, UI.titleBg);
  fitText(c, T('title'), W / 2, 150, 150, 1080, isLupta() ? '#FFE9B0' : '#C4573D', { title: true, haloCol: isLupta() ? 'rgba(70,56,140,0.6)' : undefined });
  text(c, T('subtitle'), W / 2, 272, 84, isLupta() ? '#FFB0D8' : '#B9802E', { title: true, haloCol: isLupta() ? 'rgba(70,56,140,0.6)' : undefined });
  // settings button (OPTIONS on a controller, the P key or a mouse click)
  card(c, W - 400, 34, 366, 104, '#FFF6E2', 44); hitAdd(W - 400, 34, 366, 104, 'settings');
  drawGear(c, W - 346, 86, 30, '#C4573D', t);
  text(c, T('t.settings'), W - 300, 70, 40, '#7A4A52', { align: 'left', halo: 0, shadow: 0, weight: 'bold' });
  text(c, T('t.setKey'), W - 300, 110, 22, '#9A7A7A', { align: 'left', halo: 0, shadow: 0 });
  // Ciori circles with a stolen egg (in the second game George stomps about with a crystal)
  const cx = W / 2 + Math.sin(t * 0.5) * 300, cy = 430 + Math.sin(t * 1.1) * 40, cf = Math.cos(t * 0.5) > 0 ? 1 : -1;
  if (isLupta()) { drawGeorge(c, cx, 520, { scale: 1.2, t: t, face: cf, mood: 'calm', moving: true, walk: t * 9 }); drawCrystal(c, cx + cf * 96, 470, 20, t, 3, 0, (t | 0) % 7); }
  else { drawEgg(c, cx + cf * 10, cy + 44, 20, t, 3, 0); drawCiori(c, cx, cy, { scale: 1.5, t: t, fly: true, face: cf }); }
  drawNest(c, W / 2, 640, 110, 12, 0.6 + Math.sin(t * 2) * 0.2);
  for (let i = 0; i < 3; i++) drawEgg(c, W / 2 - 46 + i * 46, 640 + (i === 1 ? 4 : -4), 22, t, i * 2.1, 0, i * 3);
  const S = Input.slots;
  for (let side = 0; side < 2; side++) {
    const k = heroOf(side), cfg = CONFIG.heroes[k], x = side === 0 ? 90 : W - 90 - 600, y = 740, s = S[k], seen = UI.seen[k], rdy = UI.ready[k];
    const hx = x + 300, hy = 720, bounce = rdy ? Math.abs(Math.sin(t * 6)) * 18 : 0;
    c.fillStyle = rgba(SHADOW, 0.22); c.beginPath(); c.ellipse(hx - 10, hy + 4, 90, 24, 0, 0, TAU); c.fill();
    c.globalAlpha = seen ? 1 : 0.6;
    drawHero(c, k, hx - (k === 0 ? 30 * (side ? -1 : 1) : 0), hy - bounce, { scale: isLupta() ? 2.1 : k === 0 ? 2.5 : 2.2, t: t + k, face: side === 0 ? 1 : -1, happy: rdy, moving: rdy, walk: t * 8 });
    c.globalAlpha = 1;
    card(c, x, y, 600, 270, mix('#FFF3DC', cfg.color, 0.22), 40 + k);
    c.fillStyle = cfg.color; c.beginPath(); c.arc(x + 62, y + 62, 30, 0, TAU); c.fill();
    if (k === 1) { c.strokeStyle = cfg.color2; c.lineWidth = 7; c.stroke(); }
    text(c, String(side + 1), x + 62, y + 64, 36, '#FFF8E8', { halo: 0, weight: 'bold' });
    text(c, cfg.name, x + 112, y + 62, 68, shade(cfg.color, -0.55), { align: 'left', title: true, halo: 0 });
    const key = keyName(Opt.keys[k].a);
    if (seen) text(c, T(s.pad != null ? 't.padOk' : 't.kb') + '  ✓', x + 300, y + 138, 36, '#5E8A4E', { halo: 0, shadow: 0 });
    else if (Opt.ctrl[k] === 'kb') text(c, T('t.kbPress', key), x + 300, y + 138, 36, '#8A6A6A', { halo: 0, shadow: 0 });
    else {
      richText(c, T('t.padPress'), x + 300, y + 128, 36, '#8A6A6A', { halo: 0, shadow: 0, pulse: Math.sin(t * 5) });
      text(c, T('t.orKey', key), x + 300, y + 166, 23, '#A08888', { halo: 0, shadow: 0 });
    }
    const dy = y + 216;
    iconArrow(c, x + 150, dy, Math.PI, 18, rgba(cfg.color2 || cfg.color, 0.9)); iconArrow(c, x + 450, dy, 0, 18, rgba(cfg.color2 || cfg.color, 0.9));
    text(c, T('diff.' + Game.diff[k]), x + 300, dy, 48, '#7A4A52', { halo: 0, weight: 'bold' });
    if (rdy) { c.save(); c.translate(x + 500, y + 50); c.rotate(-0.14); card(c, -90, -36, 180, 72, '#C4573D', 7); text(c, T('t.ready'), 0, 0, 40, '#FFF6E2', { halo: 0, title: true }); c.restore(); }
  }
  // center column
  const any = UI.seen[0] || UI.seen[1], kbOnly = any && [0, 1].every(k => !UI.seen[k] || S[k].pad == null), kk = UI.seen[0] ? 0 : 1;
  richText(c, !any ? T('t.press') : kbOnly ? T('t.keyReady', keyName(Opt.keys[kk].a)) : T('t.xReady'), W / 2, 780, 58, '#7A4A52', { pulse: Math.sin(t * 5), weight: 'bold' });
  text(c, any ? T('t.then') : T('t.onPad'), W / 2, 834, 40, '#7A4A52', {});
  // the buttons: in the middle, between the two players' cards, the last one just above the bottom line
  const items = titleMenu(), n = items.length;
  for (let i = 0; i < n; i++) {
    const sel = clamp(UI.menuSel | 0, 0, n - 1) === i, yy = 1010 - (n - 1 - i) * 54;
    card(c, W / 2 - 260, yy - 24, 520, 48, sel ? '#F8C24E' : '#FFF3DC', 50 + i);
    hitAdd(W / 2 - 260, yy - 26, 520, 52, 'tmenu', i);
    fitText(c, items[i].label, W / 2, yy, 32, 480, sel ? '#6A3A30' : '#8A6A6A', { halo: 0, shadow: 0, weight: sel ? 'bold' : '600' });
  }
  text(c, (Voice.ok ? T('t.voice', Voice.v.name) : T('t.novoice')) + '   ·   ' + T('t.foot'), W / 2, 1056, 20, 'rgba(110,80,90,0.85)', { shadow: 0 });
  if (UI.spkLost >= 0 && UI.spkLostT > 0) fitText(c, T('spk.lost', CONFIG.heroes[UI.spkLost].name), W / 2, 318, 26, 1100, '#C4573D', {});
  if (!Snd.ready) text(c, T('t.click'), W / 2, 706, 28, '#C4573D', {});
  if (UI.ask) { UI.hits.length = 0; drawAsk(c, t); }
}

/* ---------- the Chapters screen ----------
   Every level and big fight of the chosen game, one card each. A chapter that was already reached can be played again;
   the others are locked. The first game has one row. The second game has a row for Part One and, once its levels exist,
   a row for Part Two. */
const CH_W = 240, CH_H = 330, CH_GAP = 20;
function chapterLayout() {
  const list = chapters(), rows = [[], []];
  list.forEach((ch, i) => rows[ch.part === 2 ? 1 : 0].push(i));
  const two = rows[1].length > 0, pos = [];
  rows.forEach((r, ri) => {
    const x0 = (W - (r.length * CH_W + (r.length - 1) * CH_GAP)) / 2, y = two ? (ri === 0 ? 220 : 640) : 360;
    r.forEach((i, j) => { pos[i] = { x: x0 + j * (CH_W + CH_GAP), y, row: ri, col: j }; });
  });
  return { list, rows, two, pos };
}
Game.toChapters = function () {
  Game.state = 'chapters'; Game.paused = false; UI.ask = null; UI.set = null; UI.chT = 0; UI.chShake = 0;
  const open = Save.maxOpen(), sl = Save.slot();
  UI.chSel = clamp(sl ? sl.level | 0 : 0, 0, Math.max(0, open));            // the chapter "Continue" points at is chosen first
  Input.kbJoin = false;      // Enter or Space here only start a chapter: a parent picking with Enter must not make the second hero join on the keyboard
  Input.muteHeld(); Voice.stop(); Save.load(); Snd.music('title'); Snd.setDuck(1);
};
function updateChapters(dt) {
  const M = Input.menu, ck = hitFind(UI.click), hv = hitFind(UI.hover), Lc = chapterLayout(), open = Save.maxOpen();
  UI.chT += dt; UI.chShake = Math.max(0, UI.chShake - dt);
  if (M.back || (ck && ck.id === 'chBack')) { Snd.play('ui'); Game.toTitle(); return; }
  const p = Lc.pos[UI.chSel] || Lc.pos[0];
  const move = (row, col) => { const r = Lc.rows[row]; if (!r.length) return; const i = r[clamp(col, 0, r.length - 1)]; if (i !== UI.chSel) { UI.chSel = i; Snd.play('ui'); } };
  if (M.left) move(p.row, p.col - 1);
  if (M.right) move(p.row, p.col + 1);
  if (Lc.two && M.up) move(0, p.col);
  if (Lc.two && M.down) move(1, p.col);
  if (hv && hv.id === 'chap') UI.chSel = hv.v;
  let go = UI.chT > 0.4 && M.ok;
  if (ck && ck.id === 'chap') { UI.chSel = ck.v; go = true; }
  if (!go) return;
  if (UI.chSel <= open) { Snd.play('ok'); Game.startChapter(UI.chSel); }
  else { Snd.play('no'); UI.chShake = 0.5; UI.chShakeI = UI.chSel; }             // locked: the padlock shakes, nothing starts
}
/* the little picture at the top of a card: the level's sky and ground and the three pictures of its story card. Painted once. */
function chapterPic(i, ch) {
  return sprite('ch-' + GAME + '-' + i + '-' + ch.def.key, 216, 124, c => {
    const lup = isLupta(), pal = PALS[ch.def.pal] || (lup ? PALS.road : PALS.sunset);
    const sk = lup ? ['#3E3A7A', '#8A70C0'] : ch.kind === 'boss' ? skyCols(1.05) : skyCols(skyTOf(ch.n));
    let g = c.createLinearGradient(0, 0, 0, 124); g.addColorStop(0, sk[0]); g.addColorStop(1, sk[1]); c.fillStyle = g; c.fillRect(0, 0, 216, 124);
    if (lup) for (let k = 0; k < 14; k++) { c.fillStyle = 'rgba(255,240,200,' + (0.4 + (k % 3) * 0.2) + ')'; c.beginPath(); c.arc((k * 53) % 216, 6 + (k * 29) % 40, 1.4, 0, TAU); c.fill(); }
    wash(c, 108, 118, 150, 50, pal.g1, { a: 1, seed: i * 3 + 1, edgeA: 0.2 });
    wash(c, 108, 128, 160, 46, pal.g0, { a: 1.1, seed: i * 3 + 2, edgeA: 0.2 });
    (pal.canopy || []).slice(0, 3).forEach((col, k) => wash(c, 14 + k * 94, 84 - (k % 2) * 6, 26, 20, col, { a: 0.9, seed: i + k * 5 }));
    const Lx = { def: ch.def, pal };
    (ch.def.icons || []).forEach((kind, k) => { c.save(); c.translate(42 + k * 66, 66); c.scale(0.4, 0.4); drawIntroIcon(c, kind, 0, 0, 1.3, Lx); c.restore(); });
  });
}
function drawCrownIcon(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = rgba(SHADOW, 0.22); c.beginPath(); c.ellipse(2, 13, 26, 5, 0, 0, TAU); c.fill();
  c.beginPath(); c.moveTo(-24, 10); c.lineTo(-26, -10); c.lineTo(-13, 0); c.lineTo(0, -16); c.lineTo(13, 0); c.lineTo(26, -10); c.lineTo(24, 10); c.closePath();
  c.fillStyle = '#F8C24E'; c.fill(); c.strokeStyle = '#E3952F'; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke();
  for (const [px, py, col] of [[-26, -12, '#E45AA0'], [0, -18, '#3B6FE0'], [26, -12, '#2FBFA8']]) { c.fillStyle = col; c.beginPath(); c.arc(px, py, 4.5, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,246,214,0.7)'; c.fillRect(-20, 3, 40, 3);
  c.restore();
}
function drawPadlock(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.strokeStyle = '#8E6A9A'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.arc(0, -14, 15, Math.PI, 0); c.lineTo(15, -2); c.moveTo(-15, -14); c.lineTo(-15, -2); c.stroke();
  c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.roundRect(-20, -3, 44, 34, 8); c.fill();
  c.fillStyle = '#E9B86A'; c.beginPath(); c.roundRect(-22, -6, 44, 34, 8); c.fill();
  c.fillStyle = 'rgba(255,246,214,0.6)'; c.beginPath(); c.roundRect(-17, -2, 12, 24, 5); c.fill();
  c.fillStyle = '#6A4270'; c.beginPath(); c.arc(0, 7, 5, 0, TAU); c.fill(); c.fillRect(-2, 8, 4, 10);
  c.restore();
}
function drawChapterCard(c, i, ch, p, t, open) {
  const sl = Save.slot(), sel = UI.chSel === i, locked = i > open, r = sl && Array.isArray(sl.results) ? sl.results[i] : null;
  const k = sel ? 1.06 : 1, sway = sel ? Math.sin(t * 2) * 0.012 : 0, shake = UI.chShake > 0 && UI.chShakeI === i ? Math.sin(UI.chShake * 60) * 10 * UI.chShake : 0;
  c.save(); c.translate(p.x + CH_W / 2, p.y + CH_H / 2); c.rotate(sway); c.scale(k, k); c.translate(-CH_W / 2, -CH_H / 2);
  if (sel) card(c, -10, -10, CH_W + 20, CH_H + 20, '#F8C24E', 300 + i);
  card(c, 0, 0, CH_W, CH_H, isLupta() ? '#ECE8FC' : '#FFF6E2', 200 + i);
  c.drawImage(chapterPic(i, ch), 12, 12, 216, 124);
  const ink = isLupta() ? '#5A58B0' : '#B9802E';
  if (locked) {
    c.fillStyle = 'rgba(201,192,232,0.8)'; c.beginPath(); c.roundRect(12, 12, 216, 124, 10); c.fill();
    drawPadlock(c, 120 + shake, 64, 1.1);
    text(c, T('ch.locked'), 120, 118, 22, '#6A5A9A', { halo: 0, shadow: 0, weight: 'bold' });
  }
  if (ch.kind === 'boss') drawCrownIcon(c, 120, 166, 1); else text(c, T('t.level', ch.n + 1), 120, 164, 26, ink, { halo: 0, shadow: 0, weight: 'bold' });
  setFont(c, 23, false, 'bold');
  const lines = wrapLines(c, lvlName(ch.def), CH_W - 28, 23).slice(0, 2);
  lines.forEach((ln, j) => fitText(c, ln, 120, 204 + (j - (lines.length - 1) / 2) * 27, 23, CH_W - 24, '#6A4250', { halo: 0, shadow: 0, weight: 'bold' }));
  if (!locked) {
    if (ch.kind === 'level') for (let j = 0; j < 3; j++) {
      const got = r && j < (r.stars | 0);
      starPath(c, 120 + (j - 1) * 42, 254, got ? 16 : 14, 0);
      if (got) { c.fillStyle = '#FFE7A0'; c.fill(); c.strokeStyle = '#F4B08E'; c.lineWidth = 4; c.stroke(); } else { c.fillStyle = 'rgba(190,150,130,0.3)'; c.fill(); }
    }
    for (let j = 0; j < 3; j++) { c.save(); c.translate(34 + j * 40, 300); c.scale(0.4, 0.4); drawMedal(c, j, 0, 0, !!(r && r.med && r.med[j]), t); c.restore(); }
    drawEgg(c, 168, 312, 13, t, 1, 0, (i * 2) % 7);
    text(c, r ? String(r.eggs | 0) : '–', 186, 300, 26, isLupta() ? '#3F6FB0' : '#B9702E', { align: 'left', halo: 0, shadow: 0, weight: 'bold' });
  }
  c.restore();
  hitAdd(p.x, p.y, CH_W, CH_H, 'chap', i);
}
function drawChapters(c, t) {
  drawBackdrop(c, UI.titleBg); drawDim(c, 0.55);
  const Lc = chapterLayout(), open = Save.maxOpen(), ink = isLupta() ? '#5A58B0' : '#C4573D';
  text(c, T('ch.title'), W / 2, 110, 96, ink, { title: true });
  card(c, 34, 34, 330, 104, '#FFF6E2', 46); hitAdd(34, 34, 330, 104, 'chBack');
  iconArrow(c, 84, 86, Math.PI, 22, '#C4573D'); fitText(c, T('set.back'), 222, 86, 36, 220, '#7A4A52', { halo: 0, shadow: 0, weight: 'bold' });
  if (Lc.two) { text(c, T('ch.part1'), W / 2, 190, 38, ink, { title: true }); text(c, T('ch.part2'), W / 2, 610, 38, ink, { title: true }); }
  Lc.list.forEach((ch, i) => { if (i !== UI.chSel) drawChapterCard(c, i, ch, Lc.pos[i], t, open); });
  if (Lc.list[UI.chSel]) drawChapterCard(c, UI.chSel, Lc.list[UI.chSel], Lc.pos[UI.chSel], t, open);       // the chosen card last, on top of its neighbours
  richText(c, T('ch.hint'), W / 2, 1030, 30, '#7A4A52', { weight: 'bold' });
}
/* ---------- level story card ---------- */
function drawIntroIcon(c, kind, x, y, t, Lx) {
  c.save();
  wash(c, x, y, 92, 92, '#FFF3DC', { a: 1.1, seed: kind.length * 3 + 1, wob: 0.05, n: 16, edgeA: 0.25 });
  if (isLupta() && drawIntroIconL(c, kind, x, y, t, Lx)) { c.restore(); return; }
  if (kind === 'egg') drawEgg(c, x, y + 40, 40, t, 1, 0);
  else if (kind === 'star') drawStar(c, x, y + 44, 40, t, 0);
  else if (kind === 'bubu') { drawBubu(c, x - 22, y + 56, { scale: 1.25, t: t }); iconX(c, x + 58, y - 52, 22, Math.sin(t * 6)); }
  else if (kind === 'leo') { drawLeo(c, x - 16, y + 64, { scale: 1.1, t: t }); drawBall(c, x + 46, y + 44, 17, t * 3); iconX(c, x + 58, y - 52, 22, Math.sin(t * 6)); }
  else if (kind === 'ciori') drawCiori(c, x - 10, y + 60, { scale: 1.3, t: t, mood: 'cheeky' });
  else if (kind === 'beetle') { c.translate(x - 10, y + 44); c.scale(1.7, 1.7); drawBeetle(c, { x: 0, y: 0, state: 'sleep', seed: 1, face: 1 }, t); }
  else if (kind === 'cone') drawCone(c, x, y + 50, t * 2, 42, 0);
  else if (kind === 'butterfly') drawButterfly(c, x, y, t, 2);
  else if (kind === 'tree') { paintTree(c, { x: x, y: y - 8, R: 56, ci: 0, seed: 5 }, PALS.forest); for (let i = 0; i < 5; i++) { c.fillStyle = rgba('#FFE9A0', 0.5 + 0.5 * Math.sin(t * 4 + i * 2)); starPath(c, x + Math.cos(i * 1.9) * 40, y - 10 + Math.sin(i * 2.7) * 36, 9, t); c.fill(); } }
  else if (kind === 'mud') { wash(c, x, y + 14, 70, 44, '#8E5E48', { a: 0.9, seed: 3 }); wash(c, x, y + 12, 58, 34, '#A9764F', { a: 1.1, seed: 4 }); wash(c, x + 14, y, 24, 10, '#E0B88C', { a: 0.5, seed: 5, edge: 0 }); }
  else if (kind === 'wind') { c.strokeStyle = '#8E9AB0'; c.lineWidth = 8; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const o = Math.sin(t * 3 + i) * 8; c.beginPath(); c.moveTo(x - 56 + o, y - 30 + i * 30); c.quadraticCurveTo(x + o, y - 44 + i * 30, x + 40 + o, y - 30 + i * 30); c.arc(x + 40 + o, y - 18 + i * 30, 12, -Math.PI / 2, Math.PI * 0.7); c.stroke(); } }
  else if (kind === 'mill') { c.translate(x, y + 6); c.scale(0.5, 0.5); drawMillBlades(c, 0, 0, t); }
  else if (kind === 'fall') { c.fillStyle = '#B89684'; c.fillRect(x - 56, y - 56, 112, 112); c.fillStyle = 'rgba(206,232,224,0.9)'; c.fillRect(x - 28, y - 56, 56, 112); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 6; c.lineCap = 'round'; for (let i = 0; i < 4; i++) { const yy = ((t * 160 + i * 40) % 112) - 56; c.beginPath(); c.moveTo(x - 18 + i * 12, y + yy); c.lineTo(x - 18 + i * 12, y + Math.min(56, yy + 30)); c.stroke(); } }
  else if (kind === 'lantern') { const g = c.createRadialGradient(x + 20, y - 14, 4, x + 20, y - 14, 80); g.addColorStop(0, 'rgba(255,226,150,0.9)'); g.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = g; c.beginPath(); c.arc(x + 20, y - 14, 80, 0, TAU); c.fill(); paintLantern(c, x, y + 62); }
  c.restore();
}
/* The pictures on the story card of the second game. Returns false for a picture that is the same in both games. */
function drawIntroIconL(c, kind, x, y, t, Lx) {
  const L = Lx || P.L, PL = L.pal;      // Lx: { def, pal } of a level that is not being played (the Chapters screen)
  if (kind === 'egg') { for (let i = 0; i < 3; i++) drawCrystal(c, x - 44 + i * 44, y + 44 - (i === 1 ? 14 : 0), 26, t, i * 2, 0, (i * 2 + (t * 0.8 | 0)) % 7); }
  else if (kind === 'star') drawSecretStar(c, x, y + 56, 34, t, 0);
  else if (kind === 'boon') { drawBoon(c, x - 26, y + 70, { scale: 1.15, t: t, claw: (t * 0.7) % 1.6 < 0.8 ? ((t * 0.7) % 1.6) / 0.8 : -1 }); iconX(c, x + 58, y - 52, 22, Math.sin(t * 6)); }
  else if (kind === 'killer') { drawKiller(c, x - 16, y + 70, { scale: 1.1, t: t }); drawBall(c, x + 50, y + 44 - Math.abs(Math.sin(t * 5)) * 26, 17, t * 3); iconX(c, x + 58, y - 52, 22, Math.sin(t * 6)); }
  else if (kind === 'ciori') drawGeorge(c, x - 22, y + 66, { scale: 1.02, t: t, mood: 'angry' });
  else if (kind === 'robot') { c.translate(x, y + 62); c.scale(1.5, 1.5); drawRobot(c, { x: 0, y: 0, state: 'sleep', seed: 1, face: 1 }, t); }
  else if (kind === 'cone') drawSnail(c, x, y + 30, t, { r: 40, seed: 1 });
  else if (kind === 'bird') drawBird(c, x - 8, y + 10, { t: t, scale: 0.82, face: 1 });
  else if (kind === 'tree') { paintTree(c, { x: x, y: y - 4, R: 54, ci: 0, seed: 5 }, PL); for (let i = 0; i < 5; i++) { c.fillStyle = rgba('#FFF0B0', 0.5 + 0.5 * Math.sin(t * 4 + i * 2)); starPath(c, x + Math.cos(i * 1.9) * 44, y - 6 + Math.sin(i * 2.7) * 38, 9, t); c.fill(); } }
  else if (kind === 'mud') { const M = SLOW_COLS[L.def.slowKind || 'slime']; wash(c, x, y + 14, 70, 44, M[0], { a: 0.9, seed: 3 }); wash(c, x, y + 12, 58, 34, M[1], { a: 1.1, seed: 4 }); wash(c, x + 14, y, 24, 10, M[5], { a: 0.6, seed: 5, edge: 0 }); if (L.def.slowKind === 'sand') { c.strokeStyle = rgba(M[0], 0.6); c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(x, y + 12, 14 + i * 14 + (t * 8 % 14), 7 + i * 7 + (t * 4 % 7), 0, 0, TAU); c.stroke(); } } }
  else if (kind === 'vine') { c.beginPath(); c.arc(x, y, 86, 0, TAU); c.clip(); c.fillStyle = '#6E62A8'; c.fillRect(x - 90, y - 90, 180, 180); paintVines(c, x, y - 92, 170, 170, 4, t * 1.5, PL); }
  else if (kind === 'door') { c.beginPath(); c.arc(x, y, 86, 0, TAU); c.clip(); c.fillStyle = '#6E62A8'; c.fillRect(x - 90, y - 90, 180, 180); paintDoor(c, x, y + 66); }
  else if (kind === 'lantern') { paintTorch(c, x, y + 74); drawFlame(c, x, y - 12, t, 1.1, 1); }
  else return false;
  return true;
}
function drawDim(c, a) { c.fillStyle = (isLupta() && Game.state !== 'title' ? 'rgba(232,228,255,' : 'rgba(255,240,214,') + a + ')'; c.fillRect(0, 0, W, H); }
function drawIntro(c, t) {
  const L = P.L, def = L.def;
  drawWorld(c); drawDim(c, 0.45);
  const cw = 1380, ch = 800, x = (W - cw) / 2, y = 130;
  card(c, x, y, cw, ch, '#FFF6E2', 61);
  text(c, L.boss ? T('t.final') : T('t.level', L.idx + 1), W / 2, y + 74, 40, '#B9802E', { halo: 0, shadow: 0, weight: 'bold' });
  fitText(c, lvlName(def), W / 2, y + 160, 96, cw - 120, '#C4573D', { title: true, halo: 0 });
  def.icons.forEach((k, i) => drawIntroIcon(c, k, W / 2 + (i - 1) * 270, y + 340, t));
  const lines = wrapLines(c, lvlIntro(def), cw - 160, 38);
  lines.forEach((ln, i) => text(c, ln, W / 2, y + 490 + i * 50, 38, '#6A4250', { halo: 0, shadow: 0 }));
  if (UI.introT > 0.8) prompt(c, pressText(), W / 2, y + ch - 62, 52, t);
}
function drawLoading(c, t) {
  drawBackdrop(c, UI.titleBg); drawDim(c, 0.5);
  text(c, T('loading'), W / 2, H / 2, 80, '#C4573D', { title: true });
}

/* ---------- level end ---------- */
/* Three little medals give the bigger player something extra to aim for. */
function levelMedals() { return [P.stars.length > 0 && P.levelStars >= P.stars.length, P.hits === 0, P.time <= levelDurationOf(P.L)]; }
function drawMedal(c, i, x, y, got, t) {
  const pop = got ? 1 + Math.sin(t * 3 + i) * 0.04 : 1;
  c.save(); c.translate(x, y); c.scale(pop, pop);
  c.fillStyle = rgba(SHADOW, 0.2); c.beginPath(); c.arc(3, 5, 40, 0, TAU); c.fill();
  c.fillStyle = got ? '#F8C24E' : 'rgba(190,150,130,0.3)'; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill();
  if (got) { c.strokeStyle = '#E3952F'; c.lineWidth = 5; c.stroke(); c.strokeStyle = 'rgba(255,246,214,0.8)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 32, Math.PI * 1.1, Math.PI * 1.6); c.stroke(); }
  const ink = got ? '#FFF8E0' : 'rgba(150,110,100,0.5)';
  if (i === 0) { starPath(c, 0, 1, 23, 0); c.fillStyle = ink; c.fill(); }
  else if (i === 1) { heartPath(c, 0, 1, 15); c.fillStyle = ink; c.fill(); }
  else {
    c.fillStyle = ink; c.beginPath(); c.arc(0, 0, 11, 0, TAU); c.fill(); c.strokeStyle = ink; c.lineWidth = 4; c.lineCap = 'round';
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; c.beginPath(); c.moveTo(Math.cos(a) * 17, Math.sin(a) * 17); c.lineTo(Math.cos(a) * 24, Math.sin(a) * 24); c.stroke(); }
  }
  c.restore();
}
/* "Încă o dată!": the only screen the children see when nobody came in time. No "Game Over", no red, no dark:
   the two heroes hold hands, the level starts again right after. */
function drawRetry(c, t) {
  drawWorld(c); drawDim(c, 0.7);
  const cw = 900, ch = 470, x = (W - cw) / 2, y = (H - ch) / 2 - 20, u = clamp(UI.retryT / 0.3, 0, 1);
  c.save(); c.translate(W / 2, y + ch / 2); c.scale(0.92 + 0.08 * u, 0.92 + 0.08 * u); c.globalAlpha = u; c.translate(-W / 2, -(y + ch / 2));
  card(c, x, y, cw, ch, '#FFF6E2', 53);
  text(c, T('retry.title'), W / 2, y + 104, 92, '#C4573D', { title: true, halo: 0 });
  const secs = UI.retryMercy ? CONFIG.rescue.limitMercy : CONFIG.rescue.limit;
  text(c, T(UI.retryMercy ? 'retry.mercy' : 'retry.sub', secs), W / 2, y + 176, 36, '#7A4A52', { halo: 0, shadow: 0, weight: 'bold' });
  // the two heroes, holding hands, bobbing together, under the writing
  const hy = y + ch - 34, bob = Math.sin(t * 3) * 5, sc = isLupta() ? 1.3 : 1.35, gap = 104;
  for (let i = 0; i < 3; i++) {                        // three little hearts floating up between them
    const ht = (t * 0.6 + i / 3) % 1;
    c.globalAlpha = u * (1 - ht) * 0.8; heartPath(c, W / 2 + Math.sin(t * 2 + i * 2) * 26, hy - 150 - ht * 60, 11);
    c.fillStyle = '#F29C9C'; c.fill(); c.globalAlpha = u;
  }
  drawHero(c, 0, W / 2 - gap, hy + bob, { scale: sc, t, face: 1, happy: false, moving: false });
  drawHero(c, 1, W / 2 + gap, hy - bob, { scale: sc, t: t + 1, face: -1, happy: false, moving: false });
  c.strokeStyle = '#E8A87C'; c.lineWidth = 9; c.lineCap = 'round';                               // the hands they hold, drawn over both arms
  c.beginPath(); c.moveTo(W / 2 - gap + 44 * sc, hy - 44 * sc + bob); c.lineTo(W / 2 + gap - 40 * sc, hy - 44 * sc - bob); c.stroke();
  c.globalAlpha = 1; c.restore();
}
function drawLevelEnd(c, t) {
  drawWorld(c); drawDim(c, 0.5);
  const r = Game.lastRun || emptyResult(), cw = 1100, ch = 900, x = (W - cw) / 2, y = 90;      // what was gathered this time (the save keeps the best)
  card(c, x, y, cw, ch, '#FFF6E2', 71);
  text(c, T('end.bravo'), W / 2, y + 104, 112, '#C4573D', { title: true, halo: 0 });
  text(c, lvlName(P.L.def), W / 2, y + 188, 40, '#B9802E', { halo: 0, shadow: 0 });
  const shown = Math.min(r.eggs, Math.floor(UI.lvlT * 40));
  drawEgg(c, W / 2 - 150, y + 330, 50, t, 1, 0, (t * 1.2 | 0) % 7);
  text(c, '+ ' + shown, W / 2 - 70, y + 298, 110, isLupta() ? '#3F6FB0' : '#B9702E', { align: 'left', halo: 0, weight: 'bold' });
  c.lineJoin = 'round';
  for (let i = 0; i < P.stars.length; i++) {
    const got = i < r.stars && UI.lvlT > 1.2 + i * 0.4, sx = W / 2 + (i - (P.stars.length - 1) / 2) * 130;
    starPath(c, sx, y + 440, got ? 52 : 44, got ? Math.sin(t * 2 + i) * 0.1 : 0);
    if (got) { c.strokeStyle = '#F4B08E'; c.lineWidth = 10; c.stroke(); c.fillStyle = '#FFE7A0'; c.fill(); } else { c.fillStyle = 'rgba(190,150,130,0.28)'; c.fill(); }
  }
  const med = r.med || [], names = ['med.stars', 'med.nohit', 'med.sun'];
  for (let i = 0; i < 3; i++) {
    const got = !!med[i] && UI.lvlT > 2.2 + i * 0.35, mx = W / 2 + (i - 1) * 320;
    drawMedal(c, i, mx, y + 566, got, t);
    fitText(c, T(names[i]), mx, y + 634, 28, 300, got ? '#8A5A30' : '#B09A94', { halo: 0, shadow: 0, weight: got ? 'bold' : '600' });
  }
  const te = Game.team.eggs, ts = Game.team.stars;
  text(c, T('end.team') + '   ' + te + ' ' + eggWord(te) + '   ·   ' + ts + ' ' + starWord(ts), W / 2, y + 716, 40, '#6A4250', { halo: 0, shadow: 0 });
  if (P.q > 0 && !P.L.boss && UI.lvlT > 0.6) for (let k = 0; k < 2; k++) {      // what each hero found of his quota (only read, nothing to press)
    const qs = quotaState(k), gx = W / 2 + (k ? 1 : -1) * 240, col = qs.ok ? QUOTA_GREEN : QUOTA_RED;
    drawPort(c, k, gx - 118, y + 772, 30, false);
    fitText(c, qs.found + ' / ' + qs.q, gx - 70, y + 772, 44, 150, col, { align: 'left', halo: 0.12, haloCol: shade(col, -0.35), shadow: 0, weight: 'bold' });
    if (qs.ok) drawTick(c, gx + 112, y + 772, 20);
    if (qs.extra > 0) text(c, T('quota.extra', qs.extra), gx + 140, y + 772, 30, QUOTA_GREEN, { align: 'left', halo: 0, shadow: 0, weight: 'bold' });      // found more than the quota
  }
  if (UI.lvlT > 1.5) prompt(c, pressText(), W / 2, y + ch - 52, 50, t);
}

/* ---------- menus: pause and settings ----------
   A menu is a list of rows. A row is one of:
     go    { label, ok() }                 a button
     opt   { label, value, chg(dir) }      a choice, changed with left / right (or OK)
     slide { label, v, chg(dir), set(v) }  a volume slider, 0 to 1
     text  { label }                       a line of text, cannot be chosen                */
function menuNav(o, key, rows) {
  const M = Input.menu, n = rows.length, ok = i => rows[i] && rows[i].kind !== 'text';
  let sel = clamp(o[key] | 0, 0, n - 1);
  for (let j = 0; j < n && !ok(sel); j++) sel = (sel + 1) % n;
  const step = M.up ? -1 : M.down ? 1 : 0;
  if (step) { let i = sel; for (let j = 0; j < n; j++) { i = (i + step + n) % n; if (ok(i)) break; } if (i !== sel) { sel = i; Snd.play('ui'); } }
  const hv = hitFind(UI.hover); if (hv && hv.id === 'row' && ok(hv.v)) sel = hv.v;
  let act = M.left ? 'left' : M.right ? 'right' : M.ok ? 'ok' : null, val = 0;
  const ck = hitFind(UI.click); if (ck && ck.id === 'row' && ok(ck.v)) { sel = ck.v; act = ck.act || 'ok'; val = ck.val; }
  o[key] = sel;
  const r = rows[sel]; if (!act || !r) return;
  if (r.kind === 'go') { if (act === 'ok') r.ok(); }
  else if (r.kind === 'opt') r.chg(act === 'left' ? -1 : 1);
  else if (r.kind === 'slide') { if (act === 'set') r.set(val); else if (act !== 'ok') r.chg(act === 'left' ? -1 : 1); }
}
function drawMenu(c, t, title, rows, sel, o) {
  o = o || {};
  const n = rows.length, cw = o.w || 1240, rh = o.rh || 72, top = o.top || 0, head = o.sub ? 196 : 150;
  const ch = head + top + n * rh + 126, x = (W - cw) / 2, y = Math.round(Math.max(16, (H - ch) / 2));
  card(c, x, y, cw, ch, '#FFF6E2', 81);
  fitText(c, title, W / 2, y + 80, 66, cw - 160, '#C4573D', { title: true, halo: 0 });
  if (o.sub) fitText(c, o.sub, W / 2, y + 148, 30, cw - 120, '#C4573D', { halo: 0, shadow: 0 });
  if (o.body) o.body(c, x, y + head, cw);
  for (let i = 0; i < n; i++) {
    const r = rows[i], yy = y + head + top + i * rh + rh / 2, on = sel === i, col = on ? '#6A3A30' : '#7A5A60';
    if (r.kind === 'text') { fitText(c, r.label, W / 2, yy, 28, cw - 140, '#8A6A6A', { halo: 0, shadow: 0 }); continue; }
    if (on) card(c, x + 50, yy - rh / 2 + 4, cw - 100, rh - 8, '#F8C24E', 90);
    hitAdd(x + 50, yy - rh / 2, cw - 100, rh, 'row', i);
    if (r.kind === 'go') {
      fitText(c, r.label, W / 2, yy, 38, cw - 260, col, { halo: 0, shadow: 0, weight: 'bold' });
      if (r.dot) { setFont(c, 38, false, 'bold'); const w = Math.min(cw - 260, c.measureText(r.label).width); c.fillStyle = r.dot; c.beginPath(); c.arc(W / 2 - w / 2 - 34, yy, 17, 0, TAU); c.fill(); }
      if (r.more) iconArrow(c, x + cw - 110, yy, 0, 12, on ? '#6A3A30' : '#C4573D');
      continue;
    }
    fitText(c, r.label, x + 96, yy, 36, cw - 660, col, { align: 'left', halo: 0, shadow: 0, weight: 'bold' });
    if (r.kind === 'slide') {
      const x0 = x + cw - 500, onN = Math.round(r.v * 10);      // onN: how many beads are full ("lit" is the painter in 02-core.js)
      for (let k = 0; k < 10; k++) { c.fillStyle = k < onN ? '#C4573D' : 'rgba(150,110,100,0.25)'; c.beginPath(); c.ellipse(x0 + k * 40, yy, 14, 20 - (9 - k) * 0.8, 0, 0, TAU); c.fill(); hitAdd(x0 + k * 40 - 20, yy - rh / 2, 40, rh, 'row', i, 'set', (k + 1) / 10); }
      hitAdd(x0 - 70, yy - rh / 2, 50, rh, 'row', i, 'set', 0);
    } else {
      const vx = x + cw - 320;
      if (!r.plain) {
        iconArrow(c, vx - 210, yy, Math.PI, 13, '#C4573D'); iconArrow(c, vx + 210, yy, 0, 13, '#C4573D');
        hitAdd(vx - 250, yy - rh / 2, 80, rh, 'row', i, 'left'); hitAdd(vx + 170, yy - rh / 2, 80, rh, 'row', i, 'right');
      }
      if (r.pulse) c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 7);
      fitText(c, r.value, vx, yy, 36, 370, r.pulse ? '#C4573D' : col, { halo: 0, shadow: 0 });
      c.globalAlpha = 1;
    }
  }
  if (o.msg) fitText(c, o.msg, W / 2, y + ch - 102, 28, cw - 120, '#C4573D', { halo: 0, shadow: 0, weight: 'bold' });
  if (o.hint) fitText(c, o.hint, W / 2, y + ch - 60, 23, cw - 220, '#9A7A7A', { halo: 0, shadow: 0 });
}

/* ---------- pause ---------- */
function pauseRows() {
  const leave = go => () => askYesNo(T('pause.title'), T('pause.ask'), T('ask.yes'), () => { Game.paused = false; UI.lostK = -1; Snd.setDuck(1); go(); });
  return [
    { kind: 'go', label: T('pause.cont'), ok: resumeGame },
    { kind: 'go', label: T('pause.set'), ok: openSettings, more: true },
    { kind: 'go', label: T('pause.restart'), ok: leave(() => Game.goLevel(Game.levelIdx)) },        // the same chapter from its beginning
    { kind: 'go', label: T('pause.chapters'), ok: leave(() => Game.toChapters()) },
    { kind: 'go', label: T('pause.quit'), ok: () => { Game.paused = false; Game.toTitle(); } }
  ];
}
function resumeGame() { Game.paused = false; UI.lostK = -1; Snd.setDuck(1); Snd.play('ok'); }
function updatePause() {
  if (UI.lostK >= 0 && Input.slots[UI.lostK].pad != null) UI.lostK = -1;     // the controller is back
  if (UI.ask) { updateAsk(); return; }
  if (Input.menu.back || Input.pause) { resumeGame(); return; }
  menuNav(UI, 'pauseSel', pauseRows());
}
function drawPause(c, t) {
  drawDim(c, 0.55);
  if (UI.ask) { drawMenu(c, t, UI.ask.title, askRows(), UI.ask.sel, { w: 1100, rh: 86, sub: UI.ask.sub }); return; }
  drawMenu(c, t, T('pause.title'), pauseRows(), UI.pauseSel, { w: 900, rh: 86, sub: UI.lostK >= 0 ? T('pause.lost', CONFIG.heroes[UI.lostK].name) : '' });
}

/* ---------- settings ---------- */
function openSettings() {
  UI.set = { page: 'main', p: 0, sel: { main: 0, player: 0, keys: 0, pad: 0 }, msg: '', msgT: 0, cap: '', spk: { list: null, i: [-1, -1], busy: false } };
  Input.autoJoin = false; Input.kbJoin = false; Snd.play('ok');
}
function closeSettings() {
  UI.set = null; Input.autoJoin = true; Input.kbJoin = Game.state !== 'chapters'; Input.bindTo = null; Input.cancelCapture();
  Save.write(); Snd.play('ok');
}
function setMsg(m) { if (UI.set) { UI.set.msg = m; UI.set.msgT = 6; } }
function setPage(page, p) { const s = UI.set; s.page = page; if (p != null) s.p = p; s.msg = ''; s.cap = ''; Input.cancelCapture(); Input.bindTo = page === 'pad' ? heroOf(s.p) : null; Snd.play('ok'); }
function settingsBack() {
  const s = UI.set;
  if (s.page === 'main') closeSettings(); else setPage(s.page === 'player' ? 'main' : 'player');
}
function toggleFullscreen() {
  const want = !document.fullscreenElement;
  try {
    if (!want) { document.exitFullscreen(); return; }
    const p = document.documentElement.requestFullscreen();
    if (p && p.catch) p.catch(() => setMsg(T('set.fsHint')));      // a controller button is not enough for Chrome: it wants a key or a click
  } catch (e) { setMsg(T('set.fsHint')); }
}
function findSpeakers(k) {
  const s = UI.set, sp = s.spk;
  if (!Snd.canSink()) { setMsg(T('spk.unsup')); return; }
  if (sp.busy) return;
  sp.busy = true; setMsg(T('spk.wait'));
  Snd.listOutputs(true).then(res => {
    sp.busy = false; if (!UI.set) return;
    sp.list = res ? res.list : [];
    setMsg(!res ? T('spk.unsup') : res.denied ? T('spk.denied') : sp.list.length ? T('spk.pick') : T('spk.none'));
    // a speaker that calls itself a controller is chosen at once: the first one for the first hero, the second one for the second hero.
    // Left / right still changes it (two controllers have the same name: only the ear can tell which is which).
    if (sp.list.length && !Opt.sink[k]) {
      const pads = []; sp.list.forEach((dv, i) => { if (/controller|dualshock|dualsense|gamepad/i.test(dv.label)) pads.push(i); });
      if (pads.length) { sp.i[k] = pads[Math.min(k, pads.length - 1)] - 1; pickSpeaker(k, 1); }
    }
  }).catch(() => { sp.busy = false; setMsg(T('spk.none')); });
}
function pickSpeaker(k, d) {
  const sp = UI.set.spk, name = CONFIG.heroes[k].name;
  if (!sp.list || !sp.list.length) { findSpeakers(k); return; }
  const n = sp.list.length + 1; let i = sp.i[k]; i = ((i + 1 + d + n) % n) - 1; sp.i[k] = i;
  const dev = i < 0 ? null : sp.list[i];
  Snd.setSink(k, dev).then(ok => {
    if (!ok) { Opt.sink[k] = ''; sp.i[k] = -1; setMsg(T('spk.fail')); return; }
    Opt.sink[k] = dev ? dev.label : ''; Save.write();
    setMsg(T('spk.ok', name, dev ? dev.label : T('set.spkMain')));
    Snd.talk(k, 'ready'); Snd.play('egg', 3, k);
  });
}
function captureKey(k, f) {
  const s = UI.set; s.cap = f; s.msg = '';
  Input.capture(code => {
    if (!UI.set) return;
    UI.set.cap = '';
    if (code === 'Escape') return;
    if (Input.RESERVED[code]) { setMsg(T('key.no')); return; }
    const old = Opt.keys[k][f]; let swapped = false;
    for (let j = 0; j < 2; j++) for (const g of KEY_FIELDS) if (Opt.keys[j][g] === code && !(j === k && g === f)) { Opt.keys[j][g] = old; swapped = true; }
    Opt.keys[k][f] = code; Save.write(); Snd.play('ok');
    setMsg(swapped ? T('key.taken') : '');
  });
}
function settingsRows() {
  const s = UI.set, yn = b => T(b ? 'yes' : 'no'), p = s.p, k = heroOf(p), cfg = CONFIG.heroes[k], sl = Input.slots[k];
  const vol = (label, id, test) => ({ kind: 'slide', label: T(label), v: Snd.vol[id],
    chg: d => { Snd.setVol(id, Snd.vol[id] + d * 0.1); if (test) Snd.play(test, 2); Save.write(); },
    set: v => { Snd.setVol(id, v); if (test) Snd.play(test, 2); Save.write(); } });
  if (s.page === 'main') return [
    { kind: 'opt', label: T('set.lang'), value: T('set.langName'), chg: () => { setLanguage(Opt.lang === 'ro' ? 'en' : 'ro'); Snd.play('ui'); Save.write(); } },
    { kind: 'opt', label: T('set.fs'), value: yn(!!document.fullscreenElement), chg: () => { toggleFullscreen(); Snd.play('ui'); } },
    vol('set.music', 'music'), vol('set.amb', 'amb', 'pop'), vol('set.chr', 'chr', 'egg'),
    { kind: 'opt', label: T('set.vib'), value: yn(Opt.vibration), chg: () => { Opt.vibration = !Opt.vibration; Snd.play('ui'); Input.rumble(0, 0.6, 0.6, 200); Input.rumble(1, 0.6, 0.6, 200); Save.write(); } },
    { kind: 'go', label: T('set.player', 1, CONFIG.heroes[heroOf(0)].name), dot: CONFIG.heroes[heroOf(0)].color, more: true, ok: () => setPage('player', 0) },
    { kind: 'go', label: T('set.player', 2, CONFIG.heroes[heroOf(1)].name), dot: CONFIG.heroes[heroOf(1)].color, more: true, ok: () => setPage('player', 1) },
    { kind: 'go', label: T('set.back'), ok: settingsBack }
  ];
  if (s.page === 'player') return [
    { kind: 'opt', label: T('set.hero'), value: cfg.name, chg: swapHeroes },
    { kind: 'opt', label: T('set.ctrl'), value: T(Opt.ctrl[k] === 'kb' ? 'set.kb' : 'set.pad'), chg: () => { Input.setCtrl(k, Opt.ctrl[k] === 'kb' ? 'pad' : 'kb'); Snd.play('ui'); Save.write(); } },
    Opt.ctrl[k] === 'kb' ? { kind: 'go', label: T('set.keys'), more: true, ok: () => setPage('keys') }
      : { kind: 'go', label: T('set.connect') + (sl.pad != null ? '  ✓' : ''), more: true, ok: () => setPage('pad') },
    { kind: 'opt', label: T('set.diff'), value: T('diff.' + Game.diff[k]), chg: d => cycleDiff(k, d) },
    { kind: 'opt', label: T('set.guide'), value: yn(Opt.guide[k]), chg: () => { Opt.guide[k] = !Opt.guide[k]; Snd.play('ui'); Save.write(); } },
    { kind: 'go', label: T('set.back'), ok: settingsBack }
  ];
  if (s.page === 'keys') {
    const rows = KEY_FIELDS.map(f => ({ kind: 'opt', label: T('key.' + f), value: s.cap === f ? T('key.press') : keyName(Opt.keys[k][f]), pulse: s.cap === f, plain: true, chg: () => captureKey(k, f) }));
    rows.push({ kind: 'go', label: T('key.reset'), ok: () => { Opt.keys = CONFIG.keys.map(q => Object.assign({}, q)); Save.write(); Snd.play('ok'); setMsg(''); } });
    rows.push({ kind: 'go', label: T('set.back'), ok: settingsBack });
    return rows;
  }
  // 'pad': connect and try the controller
  const rows = [];
  if (sl.pad != null) {
    rows.push({ kind: 'go', label: T('pad.test'), ok: () => { if (!Input.rumble(k, 0.9, 0.9, 500, true)) setMsg(T('pad.noVib')); Snd.play('stomp', 0, k); } });
    rows.push({ kind: 'go', label: T('spk.test'), ok: () => { Snd.talk(k, 'hello'); setTimeout(() => Snd.play(k ? 'kick' : 'stomp', 0.5, k), 700); setTimeout(() => Snd.play('egg', 3, k), 1100); } });      // the hero says hello and makes its two sounds, wherever its sounds go
    const i = s.spk.i[k], cur = Opt.sink[k] || T('set.spkMain');
    rows.push(s.spk.list && s.spk.list.length ? { kind: 'opt', label: T('set.spk', cfg.name), value: i >= 0 && s.spk.list[i] ? s.spk.list[i].label : cur, chg: d => pickSpeaker(k, d) }
      : { kind: 'go', label: T('set.spkFind'), ok: () => findSpeakers(k) });
    rows.push({ kind: 'go', label: T('pad.other'), ok: () => { Input.unbind(k); Snd.setSink(k, null); Opt.sink[k] = ''; Snd.play('ui'); } });
  }
  rows.push({ kind: 'go', label: T('set.back'), ok: settingsBack });
  return rows;
}
function updateSettings(dt) {
  const s = UI.set, M = Input.menu;
  if (s.msgT > 0) { s.msgT -= dt; if (s.msgT <= 0) s.msg = ''; }
  if (Input.capturing) {                                   // waiting for the new key
    if (M.back || M.ok || UI.click || Input.pause) { Input.cancelCapture(); s.cap = ''; }
    return;
  }
  s.cap = '';
  if (s.page === 'pad' && Input.joinedNow === heroOf(s.p)) { const k = heroOf(s.p); Snd.play('ok'); Snd.talk(k, 'ready'); Input.rumble(k, 0.6, 0.8, 300, true); setMsg(''); }
  if (Input.pause) { closeSettings(); return; }
  if (M.back) { settingsBack(); return; }
  menuNav(s.sel, s.page, settingsRows());
}
function drawPadTester(c, x, y, g, t) {
  card(c, x, y, 360, 230, '#FFF3DC', 95);
  const b = n => !!(g && g.buttons[n] && g.buttons[n].pressed), ax = g ? g.axes[0] || 0 : 0, ay = g ? g.axes[1] || 0 : 0;
  const off = 'rgba(150,110,100,0.26)';
  // d-pad
  const dx = x + 84, dy = y + 76;
  for (const d of [[12, 0, -1], [13, 0, 1], [14, -1, 0], [15, 1, 0]]) { c.fillStyle = b(d[0]) ? '#C4573D' : off; c.beginPath(); c.arc(dx + d[1] * 30, dy + d[2] * 30, 14, 0, TAU); c.fill(); }
  // left stick
  const sx = x + 150, sy = y + 172;
  c.strokeStyle = off; c.lineWidth = 5; c.beginPath(); c.arc(sx, sy, 36, 0, TAU); c.stroke();
  const m = Math.hypot(ax, ay), live = m > Math.max(0.25, CONFIG.deadzone);
  c.fillStyle = b(10) ? '#3F5A9A' : live ? '#6D8FD0' : 'rgba(109,143,208,0.45)'; c.beginPath(); c.arc(sx + ax * 24, sy + ay * 24, 16, 0, TAU); c.fill();      // L3: the cap goes darker when the stick is pressed
  // OPTIONS
  c.fillStyle = b(9) ? '#C4573D' : off; c.beginPath(); c.ellipse(x + 190, y + 40, 22, 9, 0, 0, TAU); c.fill();
  // L1 (top left shoulder): gives an egg to the friend
  c.fillStyle = b(4) ? '#F8C24E' : off; c.beginPath(); c.ellipse(x + 62, y + 22, 30, 12, 0, 0, TAU); c.fill();
  text(c, 'L1', x + 62, y + 24, 20, b(4) ? '#FFF8E8' : '#6A3A30', { halo: 0, shadow: 0, weight: 'bold' });
  // △ ○ ✕ □
  const fx = x + 276, fy = y + 86, shapes = [[3, 0, -1, '#6FB58A'], [1, 1, 0, '#E2574C'], [0, 0, 1, '#6D8FD0'], [2, -1, 0, '#D98AC0']];
  for (const sI of shapes) {
    const px = fx + sI[1] * 38, py = fy + sI[2] * 38, on = b(sI[0]);
    c.fillStyle = on ? sI[3] : '#FFF6E2'; c.beginPath(); c.arc(px, py, 19, 0, TAU); c.fill(); c.strokeStyle = on ? sI[3] : off; c.lineWidth = 3; c.stroke();
    c.strokeStyle = on ? '#FFF6E2' : sI[3]; c.lineWidth = 3.5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
    if (sI[0] === 3) { c.moveTo(px, py - 9); c.lineTo(px + 9, py + 7); c.lineTo(px - 9, py + 7); c.closePath(); }
    else if (sI[0] === 1) c.arc(px, py, 8.5, 0, TAU);
    else if (sI[0] === 0) { c.moveTo(px - 7, py - 7); c.lineTo(px + 7, py + 7); c.moveTo(px + 7, py - 7); c.lineTo(px - 7, py + 7); }
    else c.rect(px - 7.5, py - 7.5, 15, 15);
    c.stroke();
  }
}
function drawPadBody(c, x, y, cw, k, t) {
  const sl = Input.slots[k], bound = sl.pad != null, seen = Input.padCount(), name = CONFIG.heroes[k].name, lx = x + 150, tw = cw - 240;
  const step = (n, yy, done, label, w) => {
    c.fillStyle = done ? '#7FB06A' : '#F8C24E'; c.beginPath(); c.arc(x + 100, yy, 25, 0, TAU); c.fill();
    text(c, done ? '✓' : String(n), x + 100, yy + 1, 30, '#FFF8E8', { halo: 0, shadow: 0, weight: 'bold' });
    fitText(c, label, lx, yy, 34, w, '#6A3A30', { align: 'left', halo: 0, shadow: 0, weight: 'bold' });
  };
  const small = (str, yy, col) => fitText(c, str, lx, yy, 26, tw, col || '#7A5A60', { align: 'left', halo: 0, shadow: 0 });
  step(1, y + 6, seen > 0, T('pad.s1'), tw);
  small(T('pad.s1a'), y + 50); small(T('pad.s1b'), y + 86); small(T('pad.s1c'), y + 120);
  step(2, y + 184, seen > 0, T('pad.s2'), tw - 400);
  small(T('pad.seen', seen), y + 228, seen > 0 ? '#5E8A4E' : '#7A5A60');
  step(3, y + 292, bound, T('pad.s3', name), tw - 400);
  if (bound) { small(T('pad.ok'), y + 336, '#5E8A4E'); }
  else { c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 5); small(T('pad.wait'), y + 336, '#C4573D'); c.globalAlpha = 1; }
  c.globalAlpha = bound ? 1 : 0.45;
  drawPadTester(c, x + cw - 450, y + 128, bound ? Input.pads()[sl.pad] : null, t);
  c.globalAlpha = 1;
  if (bound) fitText(c, T('pad.try'), x + cw - 270, y + 378, 24, 440, '#7A5A60', { halo: 0, shadow: 0 });
}
function drawSettings(c, t) {
  const s = UI.set, rows = settingsRows(), k = heroOf(s.p), name = CONFIG.heroes[k].name;
  drawDim(c, 0.74);
  const o = { msg: s.msg, hint: T('set.hint') };
  if (s.page === 'main') drawMenu(c, t, T('set.title'), rows, s.sel.main, Object.assign(o, { rh: 70 }));
  else if (s.page === 'player') drawMenu(c, t, T('set.player', s.p + 1, name), rows, s.sel.player, Object.assign(o, { rh: 80 }));
  else if (s.page === 'keys') drawMenu(c, t, T('key.title', name), rows, s.sel.keys, Object.assign(o, { rh: 70 }));
  else drawMenu(c, t, T('pad.title', name), rows, s.sel.pad, Object.assign(o, { rh: 62, top: 400, body: (cc, x, y, cw) => drawPadBody(cc, x, y, cw, k, t) }));
}
/* After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. */
/* Chrome only tells the names of the speakers while it has the microphone permission, and for a page opened from a file it
   forgets that permission when the page is closed. So when the saved speaker is not in the list, the question is asked again
   (ask = true). If the speaker is still not there, the start screen says so: the sounds are then on the computer. */
function restoreSpeakers(ask) {
  if (!(Opt.sink[0] || Opt.sink[1]) || !Snd.canSink()) return;
  Snd.listOutputs(!!ask).then(res => {
    if (!res) return;
    let missing = -1;
    for (let k = 0; k < 2; k++) { if (!Opt.sink[k]) continue; const dev = res.list.find(d => d.label === Opt.sink[k]); if (dev) Snd.setSink(k, dev); else missing = k; }
    if (missing >= 0 && !ask) restoreSpeakers(true);
    else if (missing >= 0) { UI.spkLost = missing; UI.spkLostT = 14; }
  }).catch(() => {});
}

/* ---------- the Sunset Festival ---------- */
function startEnding() {
  if (!UI.endBg && isLupta()) {                  // the Rainbow Party: the jungle at night, strings of lights in all the colors
    const cv = paintJungleScene(620, 39), c = cv.getContext('2d');
    UI.lanterns = [];
    for (let row = 0; row < 2; row++) {
      const y0 = 250 + row * 130, pts = [];
      for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([u * W, y0 + Math.sin(u * Math.PI * (row ? 3 : 2)) * 50 + 30]); }
      brushLine(c, pts, 4, '#C8C0F0', 0.8, row + 1);
      for (let i = 1; i < 24; i++) { const p = pts[i], col = RAINBOW[(i + row * 3) % 7]; if (i % 2) { wash(c, p[0], p[1] + 26, 20, 26, col, { a: 1.1, seed: i, wob: 0.06 }); wash(c, p[0], p[1] + 26, 11, 15, '#FFF8E0', { a: 0.7, seed: i + 3, edge: 0 }); UI.lanterns.push([p[0], p[1] + 26]); } else { c.fillStyle = col; c.beginPath(); c.moveTo(p[0] - 16, p[1]); c.lineTo(p[0] + 16, p[1]); c.lineTo(p[0], p[1] + 34); c.closePath(); c.fill(); } }   // lights and little flags
    }
    UI.endBg = cv; UI.endOv = makeOverlay('#C8D0FF', 0.1, 0.5, true);
  }
  if (!UI.endBg) {
    const cv = paintMeadowScene(1.28, 620, 33), c = cv.getContext('2d');
    // strings of lanterns
    UI.lanterns = [];
    for (let row = 0; row < 2; row++) {
      const y0 = 250 + row * 130, pts = [];
      for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([u * W, y0 + Math.sin(u * Math.PI * (row ? 3 : 2)) * 50 + 30]); }
      brushLine(c, pts, 4, '#6A4258', 0.8, row + 1);
      for (let i = 1; i < 24; i += 2) { const p = pts[i], col = ['#E9A07A', '#F3D36B', '#E7A6A1', '#F2913C'][(i + row) % 4]; wash(c, p[0], p[1] + 26, 20, 26, col, { a: 1.1, seed: i, wob: 0.06 }); wash(c, p[0], p[1] + 26, 11, 15, '#FFF0C0', { a: 0.8, seed: i + 3, edge: 0 }); UI.lanterns.push([p[0], p[1] + 26]); }
    }
    UI.endBg = cv; UI.endOv = makeOverlay('#C8A0B4', 0.2, 0.5);
  }
  UI.endT = 0; UI.hatch = false; UI.said2 = false; UI.fwT = 0.5; UI.crack = 0; UI.medal = false;
  if (P) P.parts.length = 0;
  Snd.music('ending'); Snd.setDuck(1);
  Voice.say(T('fest.v1', CONFIG.villainName));
}
function updateEnding(dt) {
  UI.endT += dt; const t = UI.endT;
  UI.fwT -= dt;
  if (UI.fwT <= 0) {
    UI.fwT = 0.7 + Math.random() * 0.9; Snd.play('firework');
    const x = 200 + Math.random() * 1520, y = 130 + Math.random() * 300, rc = RAINBOW[Math.random() * 7 | 0];
    const cols = isLupta() ? [rc, shade(rc, 0.6)] : [['#FFC8C0', '#FFF0D8'], ['#FFE48A', '#FFF8D8'], ['#C8F0E0', '#F8FFF4'], ['#FFB88A', '#FFE4A8'], ['#E0CCF8', '#FFF0FF']][Math.random() * 5 | 0];
    part(x, y, { life: 0.5, max: 0.5, size: 60, col: cols[1], kind: 'dust' });
    for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + ring * 0.12, s = (ring ? 130 : 230) + Math.random() * 40; part(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 46, life: 2.1, max: 2.1, size: ring ? 9 : 13, col: cols[(i + ring) % 2], kind: i % 2 ? 'dot' : 'spark', drag: 1.0, vr: 3 }); }
  }
  if (isLupta()) { if (t > 3.5 && !UI.medal) { UI.medal = true; Snd.play('win'); Input.rumble(0, 0.3, 0.6, 250); Input.rumble(1, 0.3, 0.6, 250); } }      // the medals arrive
  else if (t > 3.5 && t < 6.5 && UI.crack < Math.floor((t - 3.5) / 0.9) + 1) { UI.crack++; Snd.play('crack'); }
  if (t > 6.5 && !UI.hatch) { UI.hatch = true; Snd.play('giant'); burst(W / 2, 800, 50, { speed: 320, life: 1.5, size: 11, up: 120 }); Input.rumble(0, 0.4, 0.8, 400); Input.rumble(1, 0.4, 0.8, 400); }
  if (t > 7.4 && !UI.said2) { UI.said2 = true; Voice.say(T('fest.v2', CONFIG.heroes[0].name, CONFIG.heroes[1].name), true); }
  stepParts(dt);
  if (t > 12 && pressedGo()) { Voice.stop(); Game.toTitle(); }      // the progress stays: every chapter is open now, "Continue" points at the last fight
}
/* The end of the second game: the Rainbow Party. The crystals are the present, the heroes get medals,
   and little stars fly in and hug them. */
function drawEndingL(c, t) {
  const te = UI.endT, H0 = CONFIG.heroes[0], H1 = CONFIG.heroes[1];
  drawBackdrop(c, UI.endBg);
  for (const l of UI.lanterns) { const fl = 0.8 + Math.sin(t * 6 + l[0]) * 0.12, g = c.createRadialGradient(l[0], l[1], 3, l[0], l[1], 90); g.addColorStop(0, 'rgba(255,240,200,' + 0.7 * fl + ')'); g.addColorStop(1, 'rgba(255,220,160,0)'); c.fillStyle = g; c.beginPath(); c.arc(l[0], l[1], 90, 0, TAU); c.fill(); }
  drawParts(c);
  const bob = k => Math.abs(Math.sin(t * 5 + k)) * 16, hp = [[610, 910, bob(0)], [1310, 910, bob(1.3)]];
  for (const p of [[620, 910], [1310, 910], [W / 2, 900]]) { c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.ellipse(p[0], p[1] + 4, 90, 22, 0, 0, TAU); c.fill(); }
  // the present: a big box, open, full of rainbow crystals
  const gx = W / 2, gy = 890;
  const gg = c.createRadialGradient(gx, gy - 120, 20, gx, gy - 120, 260); gg.addColorStop(0, 'rgba(255,240,200,0.55)'); gg.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = gg; c.beginPath(); c.arc(gx, gy - 120, 260, 0, TAU); c.fill();
  for (let i = 0; i < 7; i++) drawCrystal(c, gx - 90 + i * 30, gy - 96 - Math.sin(i * 1.3) * 18 - Math.abs(Math.sin(t * 2 + i)) * 10, 26, t, i * 1.7, 0, i);
  c.save(); c.translate(gx - 138, gy - 104); c.rotate(-0.62);                                    // the lid, leaning on the box
  c.fillStyle = '#C2417F'; c.beginPath(); c.roundRect(-112, -20, 224, 40, 12); c.fill(); c.fillStyle = '#F6CE46'; c.fillRect(-15, -20, 30, 40);
  c.restore();
  c.fillStyle = '#C2417F'; c.beginPath(); c.roundRect(-122 + gx, gy - 100, 244, 112, 18); c.fill();
  const bxg = c.createLinearGradient(0, gy - 104, 0, gy + 8); bxg.addColorStop(0, '#F07AB6'); bxg.addColorStop(1, '#D94C94');
  c.fillStyle = bxg; c.beginPath(); c.roundRect(gx - 122, gy - 106, 244, 108, 18); c.fill();
  soft(c, gx + 62, gy - 78, 40, 14, '#FBC2DE', 0.5, 8);
  c.fillStyle = '#F6CE46'; c.fillRect(gx - 16, gy - 106, 32, 108); c.fillStyle = 'rgba(255,246,214,0.6)'; c.fillRect(gx - 16, gy - 106, 9, 108);
  drawBoon(c, hp[0][0], hp[0][1] - hp[0][2], { scale: 2.0, t: t, happy: true, moving: true, walk: t * 5 });
  drawKiller(c, hp[1][0], hp[1][1] - hp[1][2], { scale: 2.0, t: t, happy: true, face: -1, moving: true, walk: t * 5 + 1 });
  // the medals come down on ribbons
  if (te > 3.5) {
    const u = easeOut(clamp((te - 3.5) / 0.9, 0, 1)), chest = [[hp[0][0] + 60, hp[0][1] - hp[0][2] - 150], [hp[1][0], hp[1][1] - hp[1][2] - 96]];
    chest.forEach((p, i) => {
      const my = lerp(-80, p[1], u), col = i ? H1.color2 : H0.color2;
      c.strokeStyle = col; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(p[0] - 24, my - 64); c.lineTo(p[0], my); c.lineTo(p[0] + 24, my - 64); c.stroke();
      c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.arc(p[0] + 3, my + 5, 30, 0, TAU); c.fill();
      c.fillStyle = '#F8C24E'; c.beginPath(); c.arc(p[0], my, 30, 0, TAU); c.fill(); c.strokeStyle = '#E3952F'; c.lineWidth = 5; c.stroke();
      c.fillStyle = '#FFF8E0'; starPath(c, p[0], my + 1, 17, Math.sin(t * 2 + i) * 0.15); c.fill();
    });
  }
  // the little stars fly in, put their arms around the heroes and squeeze
  if (te > 6.5) for (let i = 0; i < 10; i++) {
    const k = i % 2, u = easeOut(clamp((te - 6.5 - i * 0.22) / 1.1, 0, 1)), a = i * 1.26 + t * 0.5, cx = hp[k][0] + (k ? 0 : 20), cy = hp[k][1] - hp[k][2] - 120;
    const tx = cx + Math.cos(a) * (120 - Math.abs(Math.sin(t * 3 + i)) * 26 * u), ty = cy + Math.sin(a) * (104 - Math.abs(Math.sin(t * 3 + i)) * 22 * u);
    const sx = lerp(cx + Math.cos(i * 2.4) * 1400, tx, u), sy = lerp(cy - 900 + Math.sin(i * 1.7) * 200, ty, u), r = 26 + (i % 3) * 5;
    c.save(); c.translate(sx, sy); c.rotate(Math.sin(t * 4 + i) * 0.2);
    const hg = c.createRadialGradient(0, 0, 2, 0, 0, r * 2); hg.addColorStop(0, rgba(RAINBOW[i % 7], 0.45)); hg.addColorStop(1, rgba(RAINBOW[i % 7], 0)); c.fillStyle = hg; c.beginPath(); c.arc(0, 0, r * 2, 0, TAU); c.fill();
    c.lineJoin = 'round'; starPath(c, 0, 0, r, 0); c.strokeStyle = RAINBOW[i % 7]; c.lineWidth = r * 0.22; c.stroke(); c.fillStyle = '#FFF1B0'; c.fill();
    const ang = Math.atan2(cy - sy, cx - sx);                                                   // two little arms toward the hero
    c.rotate(-Math.sin(t * 4 + i) * 0.2); c.strokeStyle = '#FFE08A'; c.lineWidth = 5; c.lineCap = 'round';
    for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(Math.cos(ang + sd * 0.9) * r * 0.6, Math.sin(ang + sd * 0.9) * r * 0.6); c.quadraticCurveTo(Math.cos(ang + sd * 0.7) * r * 1.5, Math.sin(ang + sd * 0.7) * r * 1.5, Math.cos(ang + sd * 0.25) * r * 1.7, Math.sin(ang + sd * 0.25) * r * 1.7); c.stroke(); }
    c.strokeStyle = '#8A5A30'; c.lineWidth = 2.5; c.beginPath(); c.arc(-r * 0.22, -r * 0.05, r * 0.14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.beginPath(); c.arc(r * 0.22, -r * 0.05, r * 0.14, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    c.beginPath(); c.arc(0, r * 0.12, r * 0.2, 0.2, Math.PI - 0.2); c.stroke();
    c.restore();
  }
  if (te < 4) { c.globalAlpha = clamp(Math.min(te, 4 - te), 0, 1); text(c, T('fest'), W / 2, 560, 110, '#FFF0D0', { title: true, haloCol: 'rgba(70,56,140,0.6)' }); c.globalAlpha = 1; }
  if (te > 8) {
    const a = clamp((te - 8) / 1, 0, 1); c.globalAlpha = a;
    fitText(c, T('fest.bravo', H0.name, H1.name), W / 2, 150, 120, W - 200, '#FFE9B0', { title: true, haloCol: 'rgba(70,56,140,0.65)' });
    card(c, W / 2 - 420, 430, 840, 130, '#FFF6E2', 99);
    drawCrystal(c, W / 2 - 320, 522, 34, t, 1, 0, (t | 0) % 7); text(c, String(Game.team.eggs), W / 2 - 270, 496, 72, '#3F6FB0', { align: 'left', halo: 0, weight: 'bold' });
    c.lineJoin = 'round'; starPath(c, W / 2 + 110, 494, 38, 0); c.strokeStyle = '#F4B08E'; c.lineWidth = 8; c.stroke(); c.fillStyle = '#FFE7A0'; c.fill();
    text(c, Game.team.stars + ' / ' + levelsBefore(Game.levelIdx) * clamp(CONFIG.starsPerLevel | 0, 0, 3), W / 2 + 164, 496, 64, '#B9702E', { align: 'left', halo: 0, weight: 'bold' });
    c.globalAlpha = 1;
  }
  if (te > 12) { text(c, T('fest.end'), W / 2, 330, 70, '#FFF0D0', { title: true, haloCol: 'rgba(70,56,140,0.6)' }); richText(c, pressText(), W / 2, 1040, 44, '#FFF0D0', { pulse: Math.sin(t * 5), haloCol: 'rgba(70,56,140,0.65)' }); }
}
function drawEnding(c, t) {
  const te = UI.endT;
  if (isLupta()) { drawEndingL(c, t); return; }
  drawBackdrop(c, UI.endBg);
  for (const l of UI.lanterns) { const fl = 0.8 + Math.sin(t * 6 + l[0]) * 0.12, g = c.createRadialGradient(l[0], l[1], 3, l[0], l[1], 90); g.addColorStop(0, 'rgba(255,232,170,' + 0.75 * fl + ')'); g.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = g; c.beginPath(); c.arc(l[0], l[1], 90, 0, TAU); c.fill(); }
  drawParts(c);
  const bob = k => Math.abs(Math.sin(t * 5 + k)) * 16;
  for (const p of [[620, 900, 0], [1300, 900, 1], [1560, 880, 2]]) { c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.ellipse(p[0], p[1] + 4, 80, 20, 0, 0, TAU); c.fill(); }
  drawBubu(c, 600, 900 - bob(0), { scale: 2.2, t: t, happy: true, moving: true, walk: t * 5 });
  drawLeo(c, 1300, 900 - bob(1.3), { scale: 2.0, t: t, happy: true, face: -1, moving: true, walk: t * 5 + 1 });
  drawCiori(c, 1560, 880 - bob(2.2), { scale: 1.7, t: t, mood: 'happy', face: -1 });
  drawNest(c, W / 2, 850, 130, 44, 0.8);
  if (!UI.hatch) {
    const wob = te > 3.5 ? Math.sin(t * 22) * 0.12 * Math.min(1, (te - 3.5) / 2) : 0;
    c.save(); c.translate(W / 2, 850); c.rotate(wob); drawEgg(c, 0, 0, 58, t, 2, 0);
    c.strokeStyle = 'rgba(150,90,50,0.8)'; c.lineWidth = 3; c.lineCap = 'round';
    for (let i = 0; i < UI.crack; i++) { c.beginPath(); c.moveTo(-30 + i * 22, -50 - i * 8); c.lineTo(-18 + i * 22, -34 - i * 6); c.lineTo(-28 + i * 22, -20); c.lineTo(-12 + i * 22, -6); c.stroke(); }
    c.restore();
  } else {
    const u = Math.min(1, (te - 6.5) / 0.6), hop = Math.abs(Math.sin(t * 6)) * 10;
    for (const sd of [-1, 1]) { c.save(); c.translate(W / 2 + sd * 70, 846); c.rotate(sd * 0.5); c.beginPath(); c.rect(-60, -10, 120, 70); c.clip(); const g = c.createRadialGradient(-10, 0, 4, 0, 0, 60); g.addColorStop(0, '#FFF6C4'); g.addColorStop(1, '#E3952F'); eggPath(c, 44); c.fillStyle = g; c.fill(); c.restore(); }
    drawBubu(c, W / 2 - 20, 850 - easeOut(u) * 20 - hop, { scale: 0.95 * easeOut(u) + 0.01, t: t * 1.3, happy: true, col: '#9CC27A', col2: '#F3D36B', noScarf: true, moving: true, walk: t * 7 });
  }
  if (te < 4) { c.globalAlpha = clamp(Math.min(te, 4 - te), 0, 1); text(c, T('fest'), W / 2, 560, 110, '#FFF0D0', { title: true, haloCol: 'rgba(106,66,112,0.55)' }); c.globalAlpha = 1; }
  if (te > 8) {
    const a = clamp((te - 8) / 1, 0, 1); c.globalAlpha = a;
    fitText(c, T('fest.bravo', CONFIG.heroes[0].name, CONFIG.heroes[1].name), W / 2, 150, 120, W - 200, '#FFE9B0', { title: true, haloCol: 'rgba(106,66,112,0.6)' });
    card(c, W / 2 - 420, 500, 840, 130, '#FFF6E2', 99);
    drawEgg(c, W / 2 - 320, 590, 34, t, 1, 0); text(c, String(Game.team.eggs), W / 2 - 270, 566, 72, '#B9702E', { align: 'left', halo: 0, weight: 'bold' });
    c.lineJoin = 'round'; starPath(c, W / 2 + 110, 564, 38, 0); c.strokeStyle = '#F4B08E'; c.lineWidth = 8; c.stroke(); c.fillStyle = '#FFE7A0'; c.fill();
    text(c, Game.team.stars + ' / ' + levelsBefore(Game.levelIdx) * clamp(CONFIG.starsPerLevel | 0, 0, 3), W / 2 + 164, 566, 64, '#B9702E', { align: 'left', halo: 0, weight: 'bold' });
    c.globalAlpha = 1;
  }
  if (te > 12) { text(c, T('fest.end'), W / 2, 330, 70, '#FFF0D0', { title: true, haloCol: 'rgba(106,66,112,0.55)' }); richText(c, pressText(), W / 2, 1020, 44, '#FFF0D0', { pulse: Math.sin(t * 5), haloCol: 'rgba(106,66,112,0.6)' }); }
}
