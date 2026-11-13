
/* ==========================================================================
   INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping)
   or the keyboard. Each hero is played with what was chosen in Setări:
   a controller ('pad') or the keyboard ('kb') with its own keys.
   Menus listen to everything: every controller, the arrow keys, Enter, Space,
   Backspace and the players' own keys.
   ========================================================================== */
const Input = (() => {
  const keys = {}, tap = {}, mute = {};   // tap: pressed and released between two frames. mute: ignored until released.
  const kd = code => !!(code && !mute[code] && (keys[code] || tap[code]));
  const mk = () => ({ pad: null, joined: false, usedKb: false, x: 0, y: 0, a: false, aP: false, aR: false,
    start: false, tri: false, back: false, up: false, down: false, left: false, right: false, _p: {}, _rep: 0 });
  const slots = [mk(), mk()];
  const menu = { up: false, down: false, left: false, right: false, ok: false, back: false, pause: false, _p: {}, _rep: 0 };
  const padPrev = {};                 // previous ✕ state per gamepad index
  const RESERVED = { Escape: 1, KeyP: 1, KeyF: 1, Backspace: 1, Tab: 1, MetaLeft: 1, MetaRight: 1 };
  let kbPause = false, anyKey = false, capture = null;

  addEventListener('keydown', e => {
    if (capture && !e.repeat) {                  // "choose the keys": this key press is the answer
      const f = capture; capture = null; mute[e.code] = true; e.preventDefault(); f(e.code); return;
    }
    if (!keys[e.code]) { if (e.code === 'KeyP' || e.code === 'Escape') kbPause = true; anyKey = true; }
    keys[e.code] = true; tap[e.code] = true;
    if (/^(Arrow|Space|Enter|Backspace|Tab)/.test(e.code)) e.preventDefault();
  });
  addEventListener('keyup', e => { keys[e.code] = false; delete mute[e.code]; });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

  function pads() {
    let list = [];
    try { list = navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { list = []; }
    return list || [];
  }
  function assigned(i) { return slots[0].pad === i || slots[1].pad === i; }
  function freeSlot() {               // the hero a newly pressed controller will play
    const order = Opt.swap ? [1, 0] : [0, 1];
    for (const k of order) if (slots[k].pad == null && Opt.ctrl[k] === 'pad') return k;
    for (const k of order) if (slots[k].pad == null && !slots[k].joined) return k;
    return -1;
  }

  function poll(dt) {
    const gp = pads();
    api.joinedNow = -1;
    let mU = false, mD = false, mL = false, mR = false, mOk = false, mBack = false, mStart = false;
    // A controller that is not assigned yet joins a free player by pressing ✕.
    for (let i = 0; i < gp.length; i++) {
      const g = gp[i]; if (!g || !g.connected) { padPrev[i] = false; continue; }
      const b = n => !!(g.buttons[n] && g.buttons[n].pressed);
      const a = b(0);
      if (a && !padPrev[i] && !assigned(i)) {
        const k = api.bindTo != null ? (slots[api.bindTo].pad == null ? api.bindTo : -1) : (api.autoJoin ? freeSlot() : -1);
        if (k >= 0) { const s = slots[k]; s.pad = i; s.usedKb = false; s._p.a = true; Opt.ctrl[k] = 'pad'; api.joinedNow = k; menu._p.ok = true; }
      }
      padPrev[i] = a;
      // every controller can move through the menus
      const ax = g.axes[0] || 0, ay = g.axes[1] || 0;
      mU = mU || b(12) || ay < -0.6; mD = mD || b(13) || ay > 0.6; mL = mL || b(14) || ax < -0.6; mR = mR || b(15) || ax > 0.6;
      mOk = mOk || a; mBack = mBack || b(1); mStart = mStart || b(9);
    }
    for (let k = 0; k < 2; k++) {
      const s = slots[k], kb = Opt.keys[k];
      let x = 0, y = 0, a = false, start = false, tri = false, back = false;
      let dU = false, dD = false, dL = false, dR = false;
      s.lost = false;
      if (s.pad != null) {
        const g = gp[s.pad];
        if (!g || !g.connected) { s.pad = null; s.lost = true; }
        else {
          const b = n => !!(g.buttons[n] && g.buttons[n].pressed);
          let ax = g.axes[0] || 0, ay = g.axes[1] || 0;
          const m = Math.hypot(ax, ay), dz = Math.max(0.25, CONFIG.deadzone);
          if (m > dz) { const f = Math.min(1, (m - dz) / (1 - dz)) / m; x = ax * f; y = ay * f; }
          if (b(12)) y = -1; if (b(13)) y = 1; if (b(14)) x = -1; if (b(15)) x = 1;
          a = b(0); start = b(9); tri = b(3); back = b(1);
          dU = y < -0.55; dD = y > 0.55; dL = x < -0.55; dR = x > 0.55;
          s.joined = true;
        }
      }
      // A player without a controller can join with the keyboard by pressing their power key.
      if (Opt.ctrl[k] === 'pad' && s.pad == null && !s.joined && api.kbJoin && kd(kb.a)) Opt.ctrl[k] = 'kb';
      if (Opt.ctrl[k] === 'kb' && s.pad == null) {
        let kx = 0, ky = 0;
        if (kd(kb.left)) kx -= 1; if (kd(kb.right)) kx += 1; if (kd(kb.up)) ky -= 1; if (kd(kb.down)) ky += 1;
        if (kx || ky || kd(kb.a)) { s.usedKb = true; s.joined = true; }
        if (kx || ky) { x = kx; y = ky; dU = ky < 0; dD = ky > 0; dL = kx < 0; dR = kx > 0; }
        a = kd(kb.a);
        mU = mU || dU; mD = mD || dD; mL = mL || dL; mR = mR || dR; mOk = mOk || a;
      }
      const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
      const p = s._p;
      s.x = x; s.y = y;
      s.aP = a && !p.a; s.aR = !a && !!p.a; s.a = a;
      s.start = start && !p.start; s.tri = tri && !p.tri; s.back = back && !p.back;
      s.up = dU && !p.dU; s.down = dD && !p.dD;
      // left/right repeat while held (for the volume sliders)
      const lr = dL ? -1 : dR ? 1 : 0;
      s.left = s.right = false;
      if (lr !== 0) {
        if (p.lr !== lr) { s._rep = 0.4; s.left = lr < 0; s.right = lr > 0; }
        else { s._rep -= dt; if (s._rep <= 0) { s._rep = 0.16; s.left = lr < 0; s.right = lr > 0; } }
      }
      p.a = a; p.start = start; p.tri = tri; p.back = back; p.dU = dU; p.dD = dD; p.lr = lr;
    }
    // menus: fixed keys always work
    mU = mU || kd('ArrowUp'); mD = mD || kd('ArrowDown'); mL = mL || kd('ArrowLeft'); mR = mR || kd('ArrowRight');
    mOk = mOk || kd('Enter') || kd('Space'); mBack = mBack || kd('Backspace');
    const q = menu._p, lr = mL ? -1 : mR ? 1 : 0;
    menu.up = mU && !q.up; menu.down = mD && !q.down; menu.ok = mOk && !q.ok; menu.back = mBack && !q.back;
    menu.left = menu.right = false;
    if (lr !== 0) {
      if (q.lr !== lr) { menu._rep = 0.4; menu.left = lr < 0; menu.right = lr > 0; }
      else { menu._rep -= dt; if (menu._rep <= 0) { menu._rep = 0.14; menu.left = lr < 0; menu.right = lr > 0; } }
    }
    const pz = kbPause; kbPause = false;
    menu.pause = pz || (mStart && !q.start);
    q.up = mU; q.down = mD; q.ok = mOk; q.back = mBack; q.lr = lr; q.start = mStart;
    api.pause = menu.pause;
    api.anyKey = anyKey; anyKey = false;
    for (const k in tap) delete tap[k];
  }
  function rumble(k, strong, weak, ms, force) {   // returns false when this controller cannot vibrate
    if (!Opt.vibration && !force) return false;
    const s = slots[k]; if (s.pad == null) return false;
    const g = pads()[s.pad];
    try {
      if (g && g.vibrationActuator && g.vibrationActuator.playEffect) {
        g.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, duration: ms, weakMagnitude: weak, strongMagnitude: strong }).catch(() => {});
        return true;
      }
    } catch (e) { /* not supported */ }
    return false;
  }
  /* Settings: play hero k with a controller or with the keyboard. */
  function setCtrl(k, kind) {
    const s = slots[k]; Opt.ctrl[k] = kind;
    if (kind === 'kb') { s.pad = null; s.joined = true; s.usedKb = true; }
    else if (s.pad == null) { s.joined = false; s.usedKb = false; }
  }
  function unbind(k) { const s = slots[k]; s.pad = null; s.joined = false; }
  function swap() {                   // the two players trade heroes: controllers go with the players
    const a = slots[0], b = slots[1];
    for (const f of ['pad', 'joined', 'usedKb']) { const t = a[f]; a[f] = b[f]; b[f] = t; }
    a._p = {}; b._p = {};
  }
  const api = { slots, menu, poll, rumble, keys, setCtrl, unbind, swap, pads, RESERVED, pause: false, anyKey: false,
    autoJoin: true, kbJoin: true, bindTo: null, joinedNow: -1,
    capture(f) { capture = f; }, get capturing() { return !!capture; }, cancelCapture() { capture = null; },
    muteHeld() { for (const k in keys) if (keys[k]) mute[k] = true; },
    any(f) { return f(slots[0]) || f(slots[1]); },
    padCount() { let n = 0; for (const g of pads()) if (g && g.connected) n++; return n; } };
  return api;
})();
