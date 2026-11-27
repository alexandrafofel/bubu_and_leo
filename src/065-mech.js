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
  plates2: { rule: 'all', stay: 5, inputs: [{ kind: 'plate', who: 0, side: 'near', dy: -520 }, { kind: 'plate', who: 1, side: 'near', dy: 520 }] },
  // Level 8 (T8): targets on the face of the wall, each for one hero only (who 0 = turquoise = Boon, who 1 = blue = Killer).
  // face: the target sits against the wall, on the near bank, this far from it (not 150 away like the plates).
  targets1: { rule: 'allWithin', stay: 5, window: 4, inputs: [{ kind: 'target', who: 0, side: 'near', dy: -300, face: true }, { kind: 'target', who: 1, side: 'near', dy: 300, face: true }] },
  targets2: { rule: 'seq', stay: 6, inputs: [{ kind: 'target', who: 0, side: 'near', dy: -440, face: true }, { kind: 'target', who: 1, side: 'near', dy: 130, face: true },
                                             { kind: 'target', who: 1, side: 'near', dy: -140, face: true }, { kind: 'target', who: 0, side: 'near', dy: 430, face: true }] }
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
    for (const ln of L.lanes) if (Math.abs(x - ln.x) < 130) return false;       // not on the lane of a rolling gear or snail (T8)
    if (L.toy && dist(x, y, L.toy.x, L.toy.y) < 320) return false;       // not on the seesaw (T7.4)
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
        const off = d.face ? 105 : 150;
        want = { x: d.side === 'far' ? bandRight(g, y) + off : bandLeft(g, y) - off, y };
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
  for (const p of L.inputs || []) { p.on = p.raw = p.was = p.realWas = false; p.onT = 0; p.lastT = -99; p.n = 0; p.sink = 0; }
  // G10: on a restart everything starts from zero: the gates, the time without progress, the cage and its star
  for (const g of L.gates || []) { g.pastN = 0; g.g3 = false; g.auto = false; }
  if (L.cage) {
    Object.assign(L.cage, { hit: [-99, -99], seen: [-1, -1], done: false, doneT: 0, by: -1, wobT: 0 });
    for (const st of L.stars) if (st.kind === 'cage') st.hidden = true;
  }
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
  if (inp.kind === 'target') return P.time < (inp.hitUntil || 0);          // a hit by the right hero keeps it on for a moment (targetHit)
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

/* ---------- the targets of level 8 (T8, docs/25-niveluri-7-12.md, 3.4) ----------
   Turquoise ones listen only to Boon, blue ones only to Killer. Any power of the right hero counts: the claws spinning
   or a stomp close to it, a bone or a ball that flies into it. A hit of the wrong hero only shakes it. */
function targetHit(inp, k) {
  const M = CONFIG.mech;
  if (inp.who >= 0 && inp.who !== k) { inp.shakeT = 0.5; Snd.play('click'); return false; }
  inp.hitUntil = P.time + M.targetOn; inp.flash = 1; inp.lastHitBy = k;
  Snd.play('plate'); Input.rumble(k, 0, 0.5, 90); burst(inp.x, inp.y, 6, { speed: 120, life: 0.5 });
  return true;
}
/* A power of hero h (powerSweep: once per power id). */
function targetSwing(h, id) {
  const L = P.L; if (!L.inputs || !L.inputs.length || !isJoined(h.k) || h.down) return;
  for (const inp of L.inputs) {
    if (inp.kind !== 'target' || inp.swing === h.k + ':' + id) continue;
    if (dist(h.x, h.y, inp.x, inp.y) > CONFIG.mech.targetReach) continue;
    inp.swing = h.k + ':' + id; targetHit(inp, h.k);
  }
}
/* Every frame: the flash runs down, and a bone or a ball in the air counts once when it reaches a target. */
function updateTargets(dt) {
  const L = P.L; if (!L.inputs) return;
  for (const inp of L.inputs) {
    if (inp.kind !== 'target') continue;
    inp.flash = Math.max(0, (inp.flash || 0) - dt * 2.2); inp.shakeT = Math.max(0, (inp.shakeT || 0) - dt);
    for (const f of P.flock) if (f.state === 'fly' && f.tgt !== inp.id && isJoined(f.owner) && dist(f.x, f.y, inp.x, inp.y) < inp.r + 28) { f.tgt = inp.id; targetHit(inp, f.owner); }
  }
}

/* ---------- helpers of the safety rules (T7.3, docs/25-niveluri-7-12.md, 3.6) ---------- */
/* How many bands lie left of (x, y): two places with the same number are on the same side of every band. */
function bandSide(L, x, y) { let n = 0; for (const g of L.gates || []) if (x > bandX(g, y)) n++; return n; }
/* The hero who plays alone (0 or 1), or -1 when both play or nobody does. */
function soloK() { const a = isJoined(0), b = isJoined(1); return a && !b ? 0 : b && !a ? 1 : -1; }
/* G6: with one player, the inputs of the hero nobody plays are always pressed. An input for anyone (who -1) counts too:
   alone, nobody could stand on it and cross at the same time. */
function inputVirtual(inp, solo) { return solo >= 0 && (inp.who === -1 || inp.who === 1 - solo); }
function mechDuel() { return !!(P.duel && !P.duel.over); }
function heroPast(h, g) { return h.x > bandRight(g, h.y) + 60; }
/* G8: the gate the players are stuck at: closed, and no progress for CONFIG.mech.hintAfter seconds. */
function gateHinting(g) { const M = CONFIG.mech; return M.hintAfter > 0 && g.state === 'closed' && g.idleT >= M.hintAfter; }
/* The gate in front of the heroes: the first one that is not fixed yet (G2 fixes every gate both have passed). */
function frontGate(L) { for (const g of L.gates || []) if (g.state !== 'fixed') return g; return null; }

/* Every frame, after the heroes and the thrown things (updatePlay). docs/25, 3.2 and 3.6. */
function updateMechs(dt) {
  updateCage(dt); updateToy(dt); updateTargets(dt);
  const L = P.L; if (!L.gates || !L.gates.length) return;
  const M = CONFIG.mech, easy = mechEasy(), ef = easy ? M.easy : 1, solo = soloK();
  for (const inp of L.inputs) {
    const real = inputRaw(inp), now = real || inputVirtual(inp, solo);      // G6
    inp.rose = now && !inp.was; inp.fell = !now && inp.was; inp.was = now;
    if (inp.rose) inp.lastT = P.time;
    if (inp.kind === 'plate') {
      if (inp.rose && real) { const k = plateBy(inp); Snd.play('plate'); Input.rumble(k, 0, 0.4, 60); }   // the one who stepped feels it (T7.2)
      if (inp.fell && inp.realWas) Snd.play('plateOff');
    }
    inp.realWas = real;
    inp.onT = now ? inp.onT + dt : 0;
    inp.on = now;
    inp.sink = (inp.sink || 0) + ((real ? 1 : 0) - (inp.sink || 0)) * Math.min(1, dt * 14);   // how far it sinks, for the drawing (T7.2): only a real foot
  }
  const g3 = P.heroes.some(h => isJoined(h.k) && h.down);       // G3: a hero waits for help
  const duel = mechDuel();
  const players = P.heroes.filter(h => isJoined(h.k));
  for (const g of L.gates) {
    if (g.state === 'fixed') { stepGateOpen(L, g, dt, 1); continue; }
    // G9: during a fight with George (either one, ring or not) no gate changes. G3 still opens them: nobody is left down behind a band
    if (duel && !g3) { stepGateOpen(L, g, dt, g.state === 'open' ? 1 : 0); continue; }
    // G2: both players are past the band: it stays open until the end of the level
    if (players.length && players.every(h => heroPast(h, g))) { g.state = 'fixed'; stepGateOpen(L, g, dt, 1); continue; }
    const ins = g.inputs.map(id => L.inputs[id]);
    // G7 and G8: the time without progress. It runs only while a hero is within 500 of the gate. Progress = one more hero past the band
    const pastN = players.filter(h => heroPast(h, g)).length;
    if (pastN > (g.pastN || 0)) g.idleT = 0;
    g.pastN = pastN;
    if (players.some(h => dist(h.x, h.y, g.x, g.y) < 500)) g.idleT += dt;
    if (M.autoOpen > 0 && g.idleT >= M.autoOpen) {               // G7: it opens by itself
      g.state = 'fixed'; g.auto = true; mechClick(g.x, g.y); Snd.play('gateOpen'); P.banner = { kind: 'gateAuto', t: 4 };
      stepGateOpen(L, g, dt, 1); continue;
    }
    let ruleOk = false;
    if (g.rule === 'any') ruleOk = ins.some(p => p.on);
    else if (g.rule === 'all') ruleOk = ins.length > 0 && ins.every(p => p.on);
    else if (g.rule === 'allWithin') {             // each input stays "on" for `window` seconds after it was touched
      const w = g.window * ef;                     // G6: alone there is no window, an input touched once stays touched
      ruleOk = ins.length > 0 && ins.every(p => p.on || (solo >= 0 ? p.lastT > -50 : P.time - p.lastT <= w));
    } else if (g.rule === 'seq') {                 // the inputs in the order of g.inputs; g.step = the next one
      for (const p of ins) if (p.rose) {
        if (p === ins[g.step]) g.step++;
        else if (!easy && !inputVirtual(p, solo)) g.step = p === ins[0] ? 1 : 0;   // a wrong one starts again (not on "Ușor")
      }
      while (g.step < ins.length && inputVirtual(ins[g.step], solo)) g.step++;      // G6: the other hero's turns are done
      if (g.step >= ins.length) { ruleOk = true; g.step = 0; }
    }
    if (g3) { g.g3 = true; ruleOk = true; }        // G3: every gate opens and stays open while a hero is down
    if (ruleOk) {
      g.stayT = g.stay * ef;
      if (g.state !== 'open') { g.fromRight = ins.some(p => p.realWas && p.side === 'far'); if (g3) g.state = 'open'; else openGate(L, g); }   // the bridge grows from the bank of the plate (T7.4)
    } else if (g.state === 'open') {
      // 'any': the time to cross runs only while somebody is on the crossing or next to it. Otherwise it closes now:
      // nobody can step off the plate and run over alone (docs/16-decizii.md, 26 November 2026). After G3 it always runs.
      const someone = g.g3 || g.rule !== 'any' || P.heroes.some(h => isJoined(h.k) && nearGate(h, g, M.nearGate));
      g.stayT = someone ? g.stayT - dt : 0;
      if (g.stayT <= 0) { g.state = 'closed'; g.g3 = false; }
    }
    stepGateOpen(L, g, dt, g.state === 'open' ? 1 : 0);
    if (g.kind === 'chasm') {                     // T7.4: every plank of light that appears sings one note of a scale
      const n = Math.max(0, Math.min(7, Math.floor(g.vis * 8)));
      if (n > (g.planks || 0)) for (let j = g.planks || 0; j < n; j++) Snd.play('bridge', j);
      g.planks = n;
    }
  }
}

/* What each hero has to do at gate g right now (3.7): [step of Boon, step of Killer], each { x, y, act, inp } or null
   (a hero nobody plays, or nothing to do). act: 'stand' (on a plate, or wait there), 'throw', 'spin', 'push', 'carry',
   'ride', 'cross'. The arrow (guideTarget), the hints (drawHints) and the bots (T7.5) use it. */
function mechSteps(g) {
  const L = P.L, out = [null, null];
  if (!g || g.state === 'fixed') return out;
  const ins = g.inputs.map(id => L.inputs[id]), solo = soloK();
  const far = h => h.x > bandX(g, h.y);
  const actOf = p => p.kind === 'target' ? 'throw' : p.kind === 'crank' ? 'spin' : p.kind === 'pedestal' ? 'carry' : p.kind === 'slot' ? 'push' : 'stand';
  // a target: stand a little way from it, where there is room (the nearest free place of a few), and aim at it
  const spot = p => {
    for (const [dx, dy] of [[-130, 0], [-100, -70], [-100, 70], [-70, 0], [-70, -90], [-70, 90], [0, 0]]) {
      const x = p.x + dx, y = p.y + dy; if (L.grid[L.ci(x, y)] !== 0 || (L.flag[L.ci(x, y)] & 32)) continue;
      if (L.solids.some(so => dist(x, y, so.x, so.y) < so.r + HERO_R + 8)) continue;
      return { x, y };
    }
    return { x: p.x, y: p.y };
  };
  const at = (p, h) => p.kind === 'target' ? Object.assign(spot(p), { act: 'throw', inp: p.id, ax: p.x, ay: p.y }) : { x: p.x, y: p.y, act: actOf(p), inp: p.id };
  const cross = h => far(h) ? { x: g.x + g.w / 2 + 110, y: g.y, act: 'stand' } : { x: g.x - g.w / 2 - 70, y: g.y, act: 'cross' };   // wait by the crossing; once open, go
  const go = h => far(h) ? { x: g.x + g.w / 2 + 110, y: g.y, act: 'stand' } : { x: g.x + g.w / 2 + 110, y: g.y, act: 'cross' };
  const mine = (h, p) => (p.who === -1 || p.who === h.k) && (p.side === 'far') === far(h) && !inputVirtual(p, solo);
  const hs = P.heroes.filter(h => isJoined(h.k));
  const open = g.state === 'open';
  const used = new Set();
  const pick = h => {                      // the nearest free input of this hero, the next one of a sequence first
    if (g.rule === 'seq' && ins[g.step] && mine(h, ins[g.step]) && !used.has(ins[g.step])) return ins[g.step];
    let best = null, bd = 1e9;
    for (const p of ins) if (mine(h, p) && !used.has(p)) { const d = dist(h.x, h.y, p.x, p.y) + (p.who === h.k ? 0 : 400); if (d < bd) { bd = d; best = p; } }
    return best;
  };
  if (hs.length === 1) {                   // G6: alone, his own input (if he has one), then over
    const h = hs[0], p = open ? null : pick(h);
    out[h.k] = p && !p.on ? at(p, h) : go(h);
    return out;
  }
  if (g.rule === 'any') {
    const near = hs.filter(h => !far(h));
    if (!near.length) return out;
    // one presses, the other crosses. A hero on the far bank presses the far plate for the one left behind
    let holder = null;
    if (near.length === 1) holder = hs.find(h => far(h));
    else { let bd = 1e9; for (const h of hs) { const p = pick(h); if (p) { const d = dist(h.x, h.y, p.x, p.y); if (d < bd) { bd = d; holder = h; } } } }
    for (const h of hs) {
      if (h === holder) { const p = pick(h); if (p) { used.add(p); out[h.k] = at(p, h); } else out[h.k] = cross(h); }
      else out[h.k] = open ? go(h) : cross(h);
    }
    return out;
  }
  // all, allWithin, seq (and the kinds of T8 - T12): everyone to his own input; once it is open, everyone over
  for (const h of hs) {
    if (open) { out[h.k] = go(h); continue; }
    let p = pick(h);
    if (g.rule === 'seq' && ins[g.step] && p !== ins[g.step]) p = null;       // a sequence: only the hero whose turn it is goes to his input, the other waits
    if (p) { used.add(p); out[h.k] = at(p, h); } else out[h.k] = cross(h);
  }
  return out;
}
/* The step of hero h at the gate in front, for the arrow (guideTarget). */
function mechGuide(h) {
  const L = P.L, g = frontGate(L); if (!g || !isJoined(h.k)) return null;
  const st = mechSteps(g)[h.k]; if (!st) return null;
  return { x: st.x, y: st.y, kind: st.act, hint: gateHinting(g) };
}
function openGate(L, g) {
  g.state = 'open';
  if (!g.opened) {                                 // the first time: a short stop, the camera comes closer, both heroes feel it
    g.opened = true;
    mechClick(g.x, g.y); bigHit();
    Snd.play('gateOpen'); { const nh = P.heroes.filter(h => isJoined(h.k)); if (nh.length) say(nh[(P.gateSaid = (P.gateSaid | 0) + 1) % nh.length].k, 'nestOpen'); }
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
  if (soloK() >= 0) { cageOpen(cg, k); return; }       // G6: alone, one hit opens it
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

/* ---------- the toy of the level (T7.4): the seesaw of level 7 ----------
   A hero at each end makes it rock, and both laugh. It gives nothing: it is only for fun. */
const SEESAW_END = 120;
function updateToy(dt) {
  const L = P.L, toy = L && L.toy; if (!toy) return;
  if (toy.kind === 'button') {                           // T8: the red button of the workshop. Whoever steps on it makes every robot dance for 5 seconds, once in 30
    toy.danceT = Math.max(0, toy.danceT - dt); toy.cool = Math.max(0, toy.cool - dt);
    const h = P.heroes.find(q => isJoined(q.k) && !q.down && !q.carried && dist(q.x, q.y, toy.x, toy.y) < 70), on = !!h;
    toy.down += ((on ? 1 : 0) - toy.down) * Math.min(1, dt * 14);
    if (on && !toy.was && toy.cool <= 0) { toy.danceT = CONFIG.mech.danceTime; toy.cool = CONFIG.mech.danceEvery; Snd.play('plate'); say(h.k, 'levelWin'); Input.rumble(h.k, 0, 0.5, 120); burst(toy.x, toy.y - 20, 12, { speed: 200, life: 0.7 }); }
    toy.was = on; return;
  }
  if (toy.kind !== 'seesaw') return;
  const on = [-1, 1].map(side => P.heroes.find(h => isJoined(h.k) && !h.down && !h.carried && dist(h.x, h.y, toy.x + side * SEESAW_END, toy.y) < 70));
  toy.both = !!(on[0] && on[1] && on[0] !== on[1]);
  toy.t = (toy.t || 0) + dt;
  const target = toy.both ? Math.sin(toy.t * 2.6) * 0.2 : on[0] ? -0.14 : on[1] ? 0.14 : 0;
  toy.va += ((target - toy.ang) * 40 - toy.va * 6) * dt; toy.ang += toy.va * dt;
  toy.laughT -= dt;
  if (toy.both && toy.laughT <= 0) { toy.laughT = 4; for (const h of on) say(h.k, 'levelWin'); }
}
