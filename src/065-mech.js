/* ==========================================================================
   MECHANISMS (T7): the bands that cut a new level from top to bottom, and the gates
   on their crossings that open only when the two heroes work together.
   docs/25-niveluri-7-12.md, 3.1 - 3.3. The bands are carved in genLevel (06-level.js);
   the inputs are placed here (placeMechInputs) and run here (updateMechs).
   The drawing of plates, the cage and the bridges comes with T7.2 and T7.4.

   The rule that keeps it a game for two (decided 26 November 2026, docs/16-decizii.md):
   whoever crosses cannot also be the one who opens. A hero on a crossing never presses
   an input, and a gate opened for anyone ('any') stays open after the input is let go
   only while a hero is on the crossing or close to it (CONFIG.mech.nearGate).
   ========================================================================== */

/* The recipes (3.3). Only the ones of level 7 for now; T8 - T12 add theirs.
   inputs: where each input goes. side 'near' = before the band, 'far' = after it.
   along: the input lies on the path, at least CONFIG.mech.plateGap from the crossing.
   dy: the input lies on its bank, next to the band, this far above (-) or below (+) the crossing. */
const MECH_RECIPES = {
  plates1: { rule: 'any', stay: 1.5, inputs: [{ kind: 'plate', who: -1, side: 'near', along: true }, { kind: 'plate', who: -1, side: 'far', along: true }] },
  plates2: { rule: 'all', stay: 5, inputs: [{ kind: 'plate', who: 0, side: 'near', dy: -520 }, { kind: 'plate', who: 1, side: 'near', dy: 520 }] }
};
const MECH_INPUT_R = { plate: 60, target: 46, crank: 50, pedestal: 50, cage: 70, test: 40 };

/* The band's middle at height y, and its left and right edges there. */
function bandX(g, y) { return g.at * g.W + 40 * Math.sin(y / 260 + g.ph); }
function bandLeft(g, y) { return bandX(g, y) - g.half; }
function bandRight(g, y) { return bandX(g, y) + g.half; }

/* Places the inputs of every gate (genLevel calls this after the reachability check, while every gate is still open).
   Returns false when an input finds no good place: genLevel then tries the next seed. */
function placeMechInputs(L, r, mark) {
  const M = CONFIG.mech, ci = L.ci;
  const ok = (x, y, rad) => {
    if (x < 80 || x > L.W - 80 || y < L.top + 90 || y > L.H - 90) return false;
    const i = ci(x, y); if (!L.reach[i] || L.grid[i] !== 0 || (L.flag[i] & 32)) return false;
    for (const s of L.solids) if (dist(x, y, s.x, s.y) < s.r + rad + 12) return false;
    for (const p of L.inputs) if (dist(x, y, p.x, p.y) < p.r + rad + 40) return false;
    return dist(x, y, L.spawn.x, L.spawn.y) > 170 && dist(x, y, L.nest.x, L.nest.y) > 230;
  };
  const sideOk = (g, x, y, side, rad) => side === 'near' ? x < bandLeft(g, y) - rad - 40 : x > bandRight(g, y) + rad + 40;
  for (let gi = 0; gi < L.gates.length; gi++) {
    const g = L.gates[gi], R = MECH_RECIPES[g.mech];
    if (!R) { console.error('T7: no recipe called ' + g.mech); return false; }
    g.rule = R.rule; g.stay = R.stay || 0; g.window = R.window || 0;
    const next = L.gates[gi + 1], prev = L.gates[gi - 1];
    for (const d of R.inputs) {
      const rad = MECH_INPUT_R[d.kind] || 50;
      let want = null;
      if (d.along) {                              // on the path, the first point at least plateGap away from the crossing
        const pts = d.side === 'near' ? L.path.slice().reverse() : L.path;
        for (const p of pts) {
          if (!sideOk(g, p[0], p[1], d.side, rad)) continue;
          if (dist(p[0], p[1], g.x, g.y) < M.plateGap) continue;
          if (d.side === 'far' && next && p[0] > bandLeft(next, p[1]) - rad - 120) break;
          if (d.side === 'near' && prev && p[0] < bandRight(prev, p[1]) + rad + 120) break;
          want = { x: p[0], y: p[1] }; break;
        }
      } else {
        let y = g.y + d.dy;
        y = clamp(y, L.top + 140, L.H - 140);
        want = { x: d.side === 'far' ? bandRight(g, y) + 150 : bandLeft(g, y) - 150, y };
      }
      if (!want) return false;
      let spot = null;                             // the closest good place around the one we want
      for (let ring = 0; ring <= 240 && !spot; ring += 20) {
        const n = ring ? Math.max(6, ring / 8 | 0) : 1;
        for (let a = 0; a < n && !spot; a++) {
          const x = want.x + Math.cos(a / n * TAU) * ring, y = want.y + Math.sin(a / n * TAU) * ring;
          if (ok(x, y, rad) && sideOk(g, x, y, d.side, rad) && (!d.along || dist(x, y, g.x, g.y) >= M.plateGap)) spot = { x, y };
        }
      }
      if (!spot) return false;
      const inp = { id: L.inputs.length, gate: gi, kind: d.kind, x: spot.x, y: spot.y, r: rad, who: d.who, side: d.side,
        on: false, raw: false, was: false, onT: 0, lastT: -99, n: 0, need: 1 };
      L.inputs.push(inp); g.inputs.push(inp.id);
      mark(spot.x, spot.y, rad + 30, 3);           // no trees, no eggs on an input
    }
  }
  return true;
}

/* startPlay: every gate is closed. The cells of the crossing get the code of the band back (2 or 3). */
function closeGates(L) {
  for (const g of L.gates || []) {
    g.state = 'closed'; g.open = 0; g.vis = 0; g.moveTo = 0; g.moveT = 9; g.stayT = 0; g.step = 0; g.idleT = 0; g.opened = false; g.solid = true;
    for (const i of g.cells) L.grid[i] = g.code;
  }
  for (const p of L.inputs || []) { p.on = p.raw = p.was = false; p.onT = 0; p.lastT = -99; p.n = 0; }
}

/* "Ușor": the easiest difficulty of the players who play. */
function mechEasy() {
  for (let k = 0; k < 2; k++) if (isJoined(k) && Game.diff[k] === 'easy') return true;
  return false;
}
/* A hero on the crossing of a gate (with his own size). */
function onGate(h, g) {
  return Math.abs(h.x - g.x) < g.w / 2 + HERO_R && Math.abs(h.y - g.y) < g.h / 2 + HERO_R;
}
/* A hero standing on the cells of the crossing itself (over the band), not on the land next to it. */
function onGateCells(h, g) {
  const cols = P.L.cols;
  for (const i of g.cells) {
    const x0 = (i % cols) * CS, y0 = (i / cols | 0) * CS, qx = clamp(h.x, x0, x0 + CS), qy = clamp(h.y, y0, y0 + CS);
    if ((h.x - qx) * (h.x - qx) + (h.y - qy) * (h.y - qy) < (HERO_R - 2) * (HERO_R - 2)) return true;
  }
  return false;
}
function nearGate(h, g, d) {
  return Math.abs(h.x - g.x) < g.w / 2 + d && Math.abs(h.y - g.y) < g.h / 2 + d;
}
/* A hero who is crossing somewhere: on any crossing, or carried by a raft (T9). He cannot press anything. */
function heroCrossing(h) {
  if (h.riding) return true;
  for (const g of P.L.gates) if (onGate(h, g)) return true;
  return false;
}
/* Whether an input is pressed right now, before the rule of its gate. Kinds without their own code yet
   ('test', and the ones of T8 - T12) keep the value someone else gave them in inp.raw. */
function inputRaw(inp) {
  if (inp.kind === 'plate') return plateBy(inp) >= 0;
  return !!inp.raw;
}
/* The hero who presses a plate (-1 = nobody). Only the one who is pressing gets the vibration (T7.2). */
function plateBy(inp) {
  for (const h of P.heroes) {
    if (!isJoined(h.k) || h.down || h.carried || heroCrossing(h)) continue;   // the one who crosses cannot be the one who opens
    if (inp.who >= 0 && inp.who !== h.k) continue;
    if (dist(h.x, h.y, inp.x, inp.y) < 55) return h.k;
  }
  return -1;
}

/* Every frame, after the heroes and the thrown things (updatePlay). docs/25, 3.2. */
function updateMechs(dt) {
  updateCage(dt);
  const L = P.L; if (!L.gates || !L.gates.length) return;
  const M = CONFIG.mech, easy = mechEasy(), ef = easy ? M.easy : 1;
  for (const inp of L.inputs) {
    const now = inputRaw(inp);
    inp.rose = now && !inp.was; inp.fell = !now && inp.was; inp.was = now;
    if (inp.rose) inp.lastT = P.time;
    if (inp.kind === 'plate') {
      if (inp.rose) { const k = plateBy(inp); Snd.play('plate'); Input.rumble(k, 0, 0.4, 60); }   // the one who stepped feels it (T7.2)
      if (inp.fell) Snd.play('plateOff');
    }
    inp.onT = now ? inp.onT + dt : 0;
    inp.on = now;
    inp.sink = (inp.sink || 0) + ((now ? 1 : 0) - (inp.sink || 0)) * Math.min(1, dt * 14);   // how far it sinks, for the drawing (T7.2)
  }
  for (const g of L.gates) {
    if (g.state === 'fixed') { stepGateOpen(L, g, dt, 1); continue; }
    const ins = g.inputs.map(id => L.inputs[id]);
    let ruleOk = false;
    if (g.rule === 'any') ruleOk = ins.some(p => p.on);
    else if (g.rule === 'all') ruleOk = ins.length > 0 && ins.every(p => p.on);
    else if (g.rule === 'allWithin') {             // each input stays "on" for `window` seconds after it was touched
      const w = g.window * ef;
      ruleOk = ins.length > 0 && ins.every(p => p.on || P.time - p.lastT <= w);
    } else if (g.rule === 'seq') {                 // the inputs in the order of g.inputs; g.step = the next one
      for (const p of ins) if (p.rose) {
        if (p === ins[g.step]) g.step++;
        else if (!easy) g.step = p === ins[0] ? 1 : 0;   // a wrong one starts again (not on "Ușor")
      }
      if (g.step >= ins.length) { ruleOk = true; g.step = 0; }
    }
    if (ruleOk) {
      g.stayT = g.stay * ef;
      if (g.state !== 'open') openGate(L, g);
    } else if (g.state === 'open') {
      // 'any': the time to cross runs only while somebody is on the crossing or next to it. Otherwise it closes now:
      // nobody can step off the plate and run over alone (docs/16-decizii.md, 26 November 2026)
      const someone = g.rule !== 'any' || P.heroes.some(h => isJoined(h.k) && nearGate(h, g, M.nearGate));
      g.stayT = someone ? g.stayT - dt : 0;
      if (g.stayT <= 0) g.state = 'closed';
    }
    stepGateOpen(L, g, dt, g.state === 'open' ? 1 : 0);
  }
}
function openGate(L, g) {
  g.state = 'open';
  if (!g.opened) {                                 // the first time: a short stop, the camera comes closer, both heroes feel it
    g.opened = true;
    mechClick(g.x, g.y); bigHit();
    Snd.play('gateOpen');
    for (let k = 0; k < 2; k++) if (isJoined(k)) Input.rumble(k, 0.3, 0.6, 220);
  }
}
/* g.open goes smoothly to 1 or 0 in CONFIG.mech.openTime. The cells are free once it is open above 0.9.
   When it closes, the cells close at once (the bridge fades in the drawing): a hero who left the plate cannot
   run over in the half second the bridge takes to fade. They never close under a hero (G1). */
function stepGateOpen(L, g, dt, to) {
  const sp = dt / Math.max(0.05, CONFIG.mech.openTime);
  g.open = to > g.open ? Math.min(to, g.open + sp) : Math.max(to, g.open - sp);
  if (!to && !g.solid && P.heroes.some(h => onGateCells(h, g))) { g.open = Math.max(g.open, 0.95); g.state = g.state === 'fixed' ? 'fixed' : 'open'; g.stayT = Math.max(g.stayT, 0.2); }   // G1
  if (g.moveTo !== to) { g.moveTo = to; g.moveT = 0; } else g.moveT += dt;
  const m = mechMove(g.moveT, CONFIG.mech.openTime);   // what the drawing shows (T7.2, T7.4): a little pull back, then the move (T6.9)
  g.vis = to ? Math.max(0, Math.min(1.1, m)) : Math.max(0, 1 - m);
  if (g.solid && g.open > 0.9) { g.solid = false; for (const i of g.cells) L.grid[i] = 0; }
  else if (!g.solid && !to && g.open < 0.9) { g.solid = true; for (const i of g.cells) L.grid[i] = g.code; }
}

/* ---------- the star cage (T7.2, docs/25-niveluri-7-12.md, 3.4) ----------
   Both heroes must hit it, with any power, within cageWindow of each other. One alone only shakes it. */
function cageEasy() { return mechEasy() ? CONFIG.mech.easy : 1; }
/* A power of hero h (spin or stomp; powerSweep calls this once per power id, and the spin every frame). */
function cageSwing(h, id) {
  const cg = P.L.cage; if (!cg || cg.done || !isJoined(h.k) || h.down) return;
  if (cg.seen[h.k] === id) return;                     // one power is one hit, however many frames it lasts
  if (dist(h.x, h.y, cg.x, cg.y) > CONFIG.mech.cageReach) return;
  cg.seen[h.k] = id; cageHitBy(cg, h.k);
}
function cageHitBy(cg, k) {
  const now = P.time, win = CONFIG.mech.cageWindow * cageEasy(), other = cg.hit[1 - k];
  cg.hit[k] = now;
  if (now - other <= win) { cageOpen(cg, k); return; }
  cg.wobT = CONFIG.mech.cageWobble; Snd.play('click');
}
function cageOpen(cg, k) {
  cg.done = true; cg.doneT = P.time; cg.by = k;
  const s = P.L.stars.find(x => x.kind === 'cage' && !x.got);
  if (s) { s.hidden = false; collectStar(s, k); }
  Snd.play('cage'); P.banner = { kind: 'cage', t: 3 };
  for (let j = 0; j < 2; j++) if (isJoined(j)) Input.rumble(j, 0.4, 0.6, 200);
}
/* Every frame: the wobble runs down, and a ball thrown by a hero counts once when it passes the cage. */
function updateCage(dt) {
  const cg = P.L && P.L.cage; if (!cg) return;
  cg.wobT = Math.max(0, cg.wobT - dt);
  if (cg.done) return;
  for (const f of P.flock) {
    if (cg.done) break;
    if (f.state === 'fly' && !f.cageHit && isJoined(f.owner) && dist(f.x, f.y, cg.x, cg.y) < CONFIG.mech.cageReach) { f.cageHit = true; cageHitBy(cg, f.owner); }
  }
}
