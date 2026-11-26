// mini-fights: a simple bot plays each guardian at each difficulty. Jocul: variabila JOC (bubu sau lupta).
// Botii se ajuta intre ei: cand un erou e lovit si asteapta, celalalt merge la el si apasa pe cerc.
const boot = require('./common.js');
(async () => {
  const { page, shot, done } = await boot();
  await page.evaluate(() => {
    const I = __game.Input, tick = () => { I.poll(1 / 60); __game.update(1 / 60); };
    window.duelRun = (lvl, diff, mode, maxS, kind = 'nest') => {
      const G = __game; G.Game.diff = diff.slice(); joined = mode === 'soloB' ? [true, false] : mode === 'soloL' ? [false, true] : [true, true];
      go(lvl); const P = G.P, L = P.L;
      // skip the egg waves
      P.eggs.length = 0; P.wave = L.NW - 1; for (const t of L.trees) if (t.spark) t.spark.done = true;
      P.heroes[0].x = L.nest.x - 200; P.heroes[0].y = L.nest.y + 60; P.heroes[1].x = L.nest.x - 420; P.heroes[1].y = L.nest.y + 150;
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
      inp[0] = {}; inp[1] = {}; step(2); G.startDuel(kind);
      if (kind === 'mid') {                       // the middle fight is far from the nest: put the heroes next to the guardian
        const cs = L.reachCells(P.duel.x, P.duel.y, 220, 420, 0);
        if (cs.length > 1) { P.heroes[0].x = cs[0].x; P.heroes[0].y = cs[0].y; const c2 = cs[cs.length >> 1]; P.heroes[1].x = c2.x; P.heroes[1].y = c2.y; }
      }
      const d = P.duel, log = { name: d.def.id, hp0: d.hp, t: 0, hits: 0, states: {}, eggs0: G.Game.team.eggs };
      let f = 0, kickCd = 0;
      while (!d.over && f < maxS * 60) {
        const b = P.heroes[0], l = P.heroes[1];
        log.states[d.state] = (log.states[d.state] || 0) + 1;
        // Leo: stay about 330 away, sidestep when it aims, kick when it can be hurt
        const dx = d.x - l.x, dy = d.y - l.y, m = Math.hypot(dx, dy) || 1, can = d.state === 'tired' || d.state === 'stag' || diff[1] === 'easy';
        kickCd--;
        const rx = b.x - l.x, ry = b.y - l.y, rm = Math.hypot(rx, ry) || 1, RS = G.CONFIG.rescue;
        if (l.down && !b.down) log.downs = (log.downs || 0) + (l.wasDown ? 0 : 1); if (b.down && !l.down) log.downs = (log.downs || 0) + (b.wasDown ? 0 : 1); l.wasDown = l.down; b.wasDown = b.down;
        // a helper who walks straight into a tree for 2 seconds goes around it (the bot jumps next to the friend, a child walks around)
        if ((l.down && !b.down) || (b.down && !l.down)) { const hp = l.down ? b : l, tgt = l.down ? l : b, far = l.down ? RS.reachNear - 40 : RS.reachFar - 60; if (rm > far && Math.hypot(hp.x - (hp.bx || 0), hp.y - (hp.by || 0)) < 30) { hp.stuckT = (hp.stuckT || 0) + 1; if (hp.stuckT > 120) { const cs = L.reachCells(tgt.x, tgt.y, 40, 130, 0); let c0 = null, bd = 1e9; for (const c of cs) { const q = Math.hypot(c.x - hp.x, c.y - hp.y); if (q < bd) { bd = q; c0 = c; } } if (c0) { hp.x = c0.x; hp.y = c0.y; } else { hp.x = tgt.x + (hp.x < tgt.x ? -70 : 70); hp.y = tgt.y; } hp.stuckT = 0; log.around = (log.around || 0) + 1; } } else if (f % 30 === 0) { hp.bx = hp.x; hp.by = hp.y; hp.stuckT = 0; } }
        if (mode !== 'soloB' && b.down && !l.down) inp[1] = rm > RS.reachFar - 60 ? { x: rx / rm, y: ry / rm } : { x: 0, y: 0, bP: f % 10 === 0 };      // the friend waits for help: send the magic ball
        else if (mode !== 'soloB') {
          if (mode === 'lazy') { inp[1] = { x: 0, y: 0 }; if (kickCd <= 0) { l.ax = dx / m; l.ay = dy / m; inp[1].aP = true; inp[1].aR = true; kickCd = 50; } }
          else if (l.safe && d.target < 0) inp[1] = { x: dx / m, y: dy / m };       // everyone is hidden in the nest: step out
          else if ((d.state === 'tired' || d.state === 'stag') && m > 260) inp[1] = { x: dx / m, y: dy / m };
          else if (can && d.z < 80 && P.heroes[1].homeState === 'held' && kickCd <= 0) { inp[1] = { x: dx / m, y: dy / m, aP: true }; tick(); f++; inp[1] = { x: dx / m, y: dy / m, aR: true }; kickCd = 20; }
          else if (d.pat === 'hop' && (d.state === 'aim' || d.state === 'jump')) { let ox = l.x - d.tx, oy = l.y - d.ty, om = Math.hypot(ox, oy); if (om < 20) { ox = l.x - d.sx; oy = l.y - d.sy; om = Math.hypot(ox, oy) || 1; } ox = ox / om + (L.W / 2 - l.x) / L.W; oy = oy / om + ((L.top + L.H) / 2 - l.y) / L.H; const o2 = Math.hypot(ox, oy) || 1; inp[1] = om < d.def.shock + 90 ? { x: ox / o2, y: oy / o2 } : { x: 0, y: 0 }; }      // away from the landing spot, and a little toward the open middle (not into a corner)      // out of the red circle
          else if (d.state === 'aim' || d.state === 'dash' || d.state === 'jump') { const sx = -d.dy || 1, sy = d.dx || 0; inp[1] = { x: sx, y: sy }; }
          else if (m < 300) inp[1] = { x: -dx / m, y: -dy / m }; else if (m > 420) inp[1] = { x: dx / m, y: dy / m }; else inp[1] = { x: 0, y: 0 };
        }
        // pushed against water, a rock or a tree: slide along it for a moment, first one way, next time the other way (a child would walk around)
        if (mode !== 'soloB' && !l.down) {
          if (l.slide > 0) { l.slide--; inp[1].x = l.slx; inp[1].y = l.sly; }
          else if ((inp[1].x || inp[1].y) && Math.hypot(l.x - (l.lx == null ? -9 : l.lx), l.y - (l.ly == null ? -9 : l.ly)) < 0.8) { l.blk = (l.blk || 0) + 1; if (l.blk > 12) { l.blk = 0; l.slide = 50; l.sdir = -(l.sdir || 1); l.slx = -inp[1].y * l.sdir; l.sly = inp[1].x * l.sdir; } }
          else l.blk = 0;
          l.lx = l.x; l.ly = l.y;
        }
        // Bubu: collect eggs, otherwise hide in the nest. Alone: stomp next to the guardian
        if (mode === 'soloB') {
          const bx = d.x - b.x, by = d.y - b.y, bm = Math.hypot(bx, by) || 1;
          if (b.safe && d.target < 0) inp[0] = { x: bx / bm, y: by / bm };          // hidden in the nest nothing happens: step out, like a child would
          else if (bm > 200) inp[0] = { x: bx / bm, y: by / bm }; else { inp[0] = { x: 0, y: 0 }; if (f % 30 === 0) inp[0].aP = true; }
        } else if (l.down && !b.down) inp[0] = rm > RS.reachNear - 40 ? { x: -rx / rm, y: -ry / rm } : { x: 0, y: 0, bP: f % 10 === 0 };      // go to the friend and help
        else {
          let e = null, bd = 1e9; for (const g of P.eggs) { const q = Math.hypot(g.x - b.x, g.y - b.y); if (q < bd) { bd = q; e = g; } }
          const tx = e ? e.x : L.nest.x, ty = e ? e.y : L.nest.y, ex = tx - b.x, ey = ty - b.y, em = Math.hypot(ex, ey) || 1;
          inp[0] = em > 30 ? { x: ex / em, y: ey / em } : { x: 0, y: 0 };
        }
        tick(); f++;
      }
      log.t = +(f / 60).toFixed(1); log.won = d.over; log.rescues = P.rescues; log.kind = kind; log.hits = P.hits; log.hp = d.hp; log.eggs = G.Game.team.eggs - log.eggs0; log.left = P.eggs.length;
      return log;
    };
  });
  const runs = [];
  for (const lvl of (process.argv[2] || '0,1,2,3,4,5,7').split(',').map(Number)) for (const [diff, mode] of [[['easy', 'normal'], 'duo'], [['easy', 'hard'], 'duo'], [['easy', 'easy'], 'duo'], [['normal', 'normal'], 'soloB'], [['easy', 'normal'], 'soloL'], [['easy', 'normal'], 'lazy']]) {
    if (process.argv[4] && process.argv[4] !== mode) continue;      // optional: only one kind of player (duo, soloB, soloL, lazy)
    for (let rep = 0; rep < (+process.env.REP || 1); rep++) for (const kind of (process.argv[3] || 'mid,nest').split(',')) {      // REP=5: every fight five times
      const r = await page.evaluate(([l, d, m, k]) => JSON.stringify(duelRun(l, d, m, 240, k)), [lvl, diff, mode, kind]);
      console.log(lvl, kind, diff.join('/'), mode, r); runs.push(JSON.parse(r));
    }
  }
  const lost = runs.filter(r => !r.won).length;
  console.log(lost ? 'NEREUSIT: ' + lost + ' lupte necastigate din ' + runs.length : 'mini-lupte OK: ' + runs.length + ' lupte castigate');
  await done();
})();
