
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
  Game.state = 'title'; Game.paused = false; UI.ready = [false, false]; UI.menuSel = 0; UI.startT = -1; UI.lostK = -1; UI.set = null; UI.dict = null; UI.ask = null;
  Input.autoJoin = true; Input.kbJoin = true; Input.bindTo = null;
  Voice.stop(); Save.load(); Snd.music('title'); Snd.setDuck(1);
};
/* cont: from the chapter "Continue" points at. Otherwise a new game from the first chapter (the progress of this game is erased). */
Game.startGame = function (cont) {
  const d = Save.slot();
  if (cont && d) { Game.results = Array.isArray(d.results) ? d.results : []; Game.goLevel(clamp(d.level | 0, 0, chapters().length - 1)); }
  else { Save.newGame(); Game.goLevel(0); }
};
/* One chapter chosen on the Chapters screen. Nothing is erased. */
Game.startChapter = function (i) {
  const d = Save.slot(); Game.results = d && Array.isArray(d.results) ? d.results : [];
  Input.muteHeld();      // the Enter that chose the chapter is ignored until it is let go
  Game.paused = false; Game.goLevel(clamp(i, 0, chapters().length - 1));
};
/* A player joins with the keyboard only on the start screen. In a level, Enter or Space in the pause menu must not make
   the second hero join (a child playing alone would suddenly have a friend nobody plays). Controllers can still join any time. */
Game.goLevel = function (idx) { Game.levelIdx = idx; Game.state = 'loading'; UI.loadStep = 0; Input.kbJoin = false; Voice.stop(); };
/* Nobody came in time: the chapter starts again from its beginning. Never "Game Over": "Încă o dată!".
   Game.tries counts the restarts of each chapter, so after a few of them the children get more seconds (CONFIG.rescue). */
Game.failLevel = function () {
  if (Game.state !== 'play') return;
  Game.tries[Game.levelIdx] = (Game.tries[Game.levelIdx] || 0) + 1;
  Game.state = 'retry'; UI.retryT = 0; UI.retryMercy = CONFIG.rescue.retryMercy > 0 && Game.tries[Game.levelIdx] >= CONFIG.rescue.retryMercy;
  Snd.play('retry'); Snd.setDuck(0.5); Voice.stop();
  for (let k = 0; k < 2; k++) if (Input.slots[k].joined) Input.rumble(k, 0.3, 0.3, 400);
};
/* The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. */
function finishChapter() {
  Game.lastRun = { eggs: P.levelEggs, stars: P.levelStars, med: levelMedals(), tries: Game.tries[Game.levelIdx] || 0 };      // tries: how many times this chapter started again before it was finished
  Save.finish(Game.levelIdx, Game.lastRun);
  const tt = sumResults(Game.results); Game.team = { eggs: tt.eggs, stars: tt.stars };
}
Game.levelEnd = function () { Game.tries[Game.levelIdx] = 0; finishChapter(); Game.state = 'levelEnd'; UI.lvlT = 0; };
Game.toEnding = function () { finishChapter(); Game.state = 'ending'; startEnding(); };

function update(dt) {
  Game.t += dt;
  const st = Game.state;
  if (st === 'boot') {
    if (Input.anyKey || UI.clicked || Input.slots[0].joined || Input.slots[1].joined) {
      Snd.init(); Voice.init(); restoreSpeakers();
      Game.toTitle();
    }
  } else if (UI.dict && (st === 'title' || (st === 'play' && Game.paused))) updateDict(dt);
  else if (UI.set && (st === 'title' || (st === 'play' && Game.paused))) updateSettings(dt);
  else if (st === 'title') updateTitle(dt);
  else if (st === 'chapters') updateChapters(dt);
  else if (st === 'loading') {
    UI.loadStep++;
    if (UI.loadStep >= 3) {
      startPlay(buildLevel(Game.levelIdx));
      if (UI.skipIntro) { UI.skipIntro = false; Game.state = 'play'; Snd.setDuck(1); }      // after a restart the heroes start right away
      else {
        Game.state = 'intro'; UI.introT = 0; Snd.setDuck(0.45);
        Voice.say(lvlName(P.L.def) + '. ' + lvlIntro(P.L.def));
      }
    }
  } else if (st === 'retry') {
    UI.retryT += dt; stepParts(dt);
    if (UI.retryT > CONFIG.rescue.retryScreen) { UI.skipIntro = true; Snd.setDuck(1); Game.goLevel(Game.levelIdx); }      // the same chapter, without its story again
  } else if (st === 'intro') {
    UI.introT += dt;
    if (UI.introT > 0.8 && pressedGo()) { Voice.stop(); Snd.setDuck(1); Snd.play('ok'); Game.state = 'play'; say(0, 'hello'); say(1, 'hello'); }
  } else if (st === 'play') {
    if (Game.paused) updatePause();
    else {
      const lost = Input.slots.findIndex(s => s.lost);
      if (lost >= 0) UI.lostK = lost;
      if (Input.pause || lost >= 0) { Game.paused = true; UI.pauseSel = 0; UI.ask = null; Snd.setDuck(0.35); }
      else if (!holdBreath(dt)) updatePlay(dt);      // not while the game holds its breath after a big hit (T6.9)
    }
  } else if (st === 'levelEnd') {
    UI.lvlT += dt; stepParts(dt);
    if (UI.lvlT > 1.5 && pressedGo()) { Snd.play('ok'); if (Game.levelIdx + 1 < chapters().length) Game.goLevel(Game.levelIdx + 1); else Game.toTitle(); }   // T7.5: after the last chapter that exists (now level 7), back to the start screen
  } else if (st === 'ending') updateEnding(dt);
  UI.click = null; UI.hover = null; UI.spkLostT = Math.max(0, UI.spkLostT - dt);
  // the mouse pointer hides while the heroes are walking
  const hide = Game.state === 'play' && !Game.paused;
  if (hide !== UI.hidden) { UI.hidden = hide; document.body.classList.toggle('playing', hide); }
}
/* The paper and the vignette over the level. None while the light map is drawn on a level that has its paper in the
   picture (finishLook): the light map takes the vignette's place. */
function levelOverlay(L) { return L.paperBaked && CONFIG.look.lights && Game.state === 'play' ? null : L.overlay; }
function draw() {
  const c = ctx, t = Game.t, st = Game.state;
  c.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  UI.hits.length = 0;
  let ov = UI.titleOv;
  if (st === 'boot') drawBoot(c, t);
  else if (st === 'title') drawTitle(c, t);
  else if (st === 'chapters') drawChapters(c, t);
  else if (st === 'loading') drawLoading(c, t);
  else if (st === 'intro') { drawIntro(c, t); ov = levelOverlay(P.L); }
  else if (st === 'play') { drawPlay(c); if (Game.paused && !UI.set && !UI.dict) drawPause(c, t); ov = levelOverlay(P.L); }
  else if (st === 'retry') { drawRetry(c, t); ov = levelOverlay(P.L); }
  else if (st === 'levelEnd') { drawLevelEnd(c, t); ov = levelOverlay(P.L); }
  else if (st === 'ending') { drawEnding(c, t); ov = UI.endOv; }
  if (UI.set && (st === 'title' || st === 'play')) { UI.hits.length = 0; drawSettings(c, t); }
  if (UI.dict && (st === 'title' || st === 'play')) { UI.hits.length = 0; drawDict(c, t); }
  // the paper texture, the warm light and the vignette lie over everything
  if (ov) { c.globalCompositeOperation = 'multiply'; c.drawImage(ov, 0, 0, W, H); c.globalCompositeOperation = 'source-over'; }
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
window.__game = { Game, Input, UI, Save, CONFIG, Opt, STR, T, Snd, Voice, Perf, openDict, closeDict, dictList, pauseRows, titleMenu, get P() { return P; }, get GAME() { return GAME; }, setGame, buildLevel, genLevel, startPlay, startDuel, duelHit, openNest, hitHero, getUp, tryRescue, hurtSmall, throwRing, recallBalls, startSpin, abil, hasAbil, makeEgg, collectEgg, quotaState, quotaOn, giveEgg, updateGifts, updateAutoGive, sendEgg, waitBanner, newBall, quotaOk, isJoined, drawBadge, teamFound, teamNeed, updateGeorge, dropGems, hurtSmall, georgeEnemies, georgeNestThrows, levelProgress, chapters, chapterLabel, titleMenu, chapterLayout, HUD_TOP, HERO_BOX, camTarget, update, draw, openSettings, closeSettings, swapHeroes, settingsRows, KEY_FIELDS, startRun, stopRun, canRun, rescueLimit, drawRetry };
requestAnimationFrame(ts => { _last = ts; requestAnimationFrame(frame); });
