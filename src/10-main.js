
/* ==========================================================================
   MAIN: canvas, game states, main loop
   ========================================================================== */
const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
let renderScale = 1;
function resize() {
  const s = Math.min(innerWidth / W, innerHeight / H), cw = Math.floor(W * s), dpr = window.devicePixelRatio || 1;
  const bw = Math.max(640, Math.min(Math.round(cw * dpr), CONFIG.maxRenderWidth));
  canvas.width = bw; canvas.height = Math.round(bw * H / W);
  canvas.style.width = cw + 'px'; canvas.style.height = Math.floor(H * s) + 'px';
  renderScale = bw / W;
}
addEventListener('resize', resize);
function goFullscreen() { try { const el = document.documentElement; if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {}); } catch (e) { /* ignore */ } }
function mousePos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / Math.max(1, r.width) * W, y: (e.clientY - r.top) / Math.max(1, r.height) * H }; }
addEventListener('pointerdown', e => {
  Snd.init(); UI.clicked = true; UI.click = mousePos(e);
  if (Game.state === 'boot' && Opt.fullscreen) goFullscreen();
});
addEventListener('pointermove', e => { UI.hover = mousePos(e); });
addEventListener('keydown', e => {
  Snd.init();
  if (e.code === 'KeyF' && !e.defaultPrevented && !e.repeat) { if (document.fullscreenElement) document.exitFullscreen(); else goFullscreen(); }
  else if (Game.state === 'boot' && Opt.fullscreen) goFullscreen();
});
// "Ecran complet" in Setări always shows what the screen really does, and that is what gets saved
document.addEventListener('fullscreenchange', () => { Opt.fullscreen = !!document.fullscreenElement; if (Game.state !== 'boot') Save.write(); });

Game.toTitle = function () {
  Game.state = 'title'; Game.paused = false; UI.ready = [false, false]; UI.menuSel = 0; UI.startT = -1; UI.lostK = -1; UI.set = null;
  Input.autoJoin = true; Input.kbJoin = true; Input.bindTo = null;
  Voice.stop(); Save.load(); Snd.music('title'); Snd.setDuck(1);
};
Game.startGame = function (cont) {
  const d = Save.data;
  if (cont && d) { Game.team = { eggs: d.eggs || 0, stars: d.stars || 0 }; Game.results = d.results || []; Game.goLevel(clamp(d.level | 0, 0, levelCount())); }
  else { Game.team = { eggs: 0, stars: 0 }; Game.results = []; Save.write(0); Game.goLevel(0); }
};
Game.goLevel = function (idx) { Game.levelIdx = idx; Game.state = 'loading'; UI.loadStep = 0; Voice.stop(); };
Game.levelEnd = function () {
  Game.results[Game.levelIdx] = { eggs: P.levelEggs, stars: P.levelStars, med: levelMedals() };
  Game.state = 'levelEnd'; UI.lvlT = 0; Save.write(Game.levelIdx + 1);
};
Game.toEnding = function () { Game.state = 'ending'; startEnding(); };

function update(dt) {
  Game.t += dt;
  const st = Game.state;
  if (st === 'boot') {
    if (Input.anyKey || UI.clicked || Input.slots[0].joined || Input.slots[1].joined) {
      Snd.init(); Voice.init(); restoreSpeakers();
      Game.toTitle();
    }
  } else if (UI.set && (st === 'title' || (st === 'play' && Game.paused))) updateSettings(dt);
  else if (st === 'title') updateTitle(dt);
  else if (st === 'loading') {
    UI.loadStep++;
    if (UI.loadStep >= 3) {
      startPlay(buildLevel(Game.levelIdx));
      Game.state = 'intro'; UI.introT = 0; Snd.setDuck(0.45);
      Voice.say(lvlName(P.L.def) + '. ' + lvlIntro(P.L.def));
    }
  } else if (st === 'intro') {
    UI.introT += dt;
    if (UI.introT > 0.8 && pressedGo()) { Voice.stop(); Snd.setDuck(1); Snd.play('ok'); Game.state = 'play'; Snd.talk(0, 'hello'); Snd.talk(1, 'hello'); }
  } else if (st === 'play') {
    if (Game.paused) updatePause();
    else {
      const lost = Input.slots.findIndex(s => s.lost);
      if (lost >= 0) UI.lostK = lost;
      if (Input.pause || lost >= 0) { Game.paused = true; UI.pauseSel = 0; Snd.setDuck(0.35); }
      else updatePlay(dt);
    }
  } else if (st === 'levelEnd') {
    UI.lvlT += dt; stepParts(dt);
    if (UI.lvlT > 1.5 && pressedGo()) { Snd.play('ok'); Game.goLevel(Game.levelIdx + 1); }
  } else if (st === 'ending') updateEnding(dt);
  UI.click = null; UI.hover = null;
  // the mouse pointer hides while the heroes are walking
  const hide = Game.state === 'play' && !Game.paused;
  if (hide !== UI.hidden) { UI.hidden = hide; document.body.classList.toggle('playing', hide); }
}
function draw() {
  const c = ctx, t = Game.t, st = Game.state;
  c.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  UI.hits.length = 0;
  let ov = UI.titleOv;
  if (st === 'boot') drawBoot(c, t);
  else if (st === 'title') drawTitle(c, t);
  else if (st === 'loading') drawLoading(c, t);
  else if (st === 'intro') { drawIntro(c, t); ov = P.L.overlay; }
  else if (st === 'play') { drawPlay(c); if (Game.paused && !UI.set) drawPause(c, t); ov = P.L.overlay; }
  else if (st === 'levelEnd') { drawLevelEnd(c, t); ov = P.L.overlay; }
  else if (st === 'ending') { drawEnding(c, t); ov = UI.endOv; }
  if (UI.set && (st === 'title' || st === 'play')) { UI.hits.length = 0; drawSettings(c, t); }
  // the paper texture, the warm light and the vignette lie over everything
  c.globalCompositeOperation = 'multiply'; c.drawImage(ov, 0, 0, W, H); c.globalCompositeOperation = 'source-over';
}
let _last = 0;
const Perf = { ms: 0, n: 0, max: 0 };
function frame(ts) {
  const dt = Math.min(0.05, Math.max(0.001, (ts - _last) / 1000)); _last = ts;
  const t0 = performance.now();
  try { Input.poll(dt); update(dt); draw(); }
  catch (e) { console.error(e); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#FFF6E2'; ctx.fillRect(0, 0, canvas.width, 60); ctx.fillStyle = '#C4573D'; ctx.font = '20px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(T('err') + e.message, 12, 36); }
  const el = performance.now() - t0; Perf.ms += el; Perf.n++; if (el > Perf.max) Perf.max = el;
  requestAnimationFrame(frame);
}
// saved settings first: the very first screen is already in the chosen language
Save.load(); Save.apply(); setLanguage(Opt.lang);
resize();
initScreens();
window.__game = { Game, Input, UI, Save, CONFIG, Opt, STR, T, Snd, Voice, Perf, get P() { return P; }, buildLevel, genLevel, startPlay, startDuel, duelHit, openNest, hitHero, kickBall, recallBalls, update, draw, openSettings, closeSettings, swapHeroes, settingsRows };
requestAnimationFrame(ts => { _last = ts; requestAnimationFrame(frame); });
