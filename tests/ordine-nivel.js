// Ordinea pe un nivel (update U3): val 1, val 2, lupta din mijloc, val 3, lupta de la cuib, cuib.
// Verifica si bara de progres: fiecare parte are segmentul ei, in aceeasi ordine.
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const res = await page.evaluate(() => {
    const G = __game, out = [];
    for (const lvl of [0, 3]) {
      go(lvl); const P = G.P, L = P.L, seq = [], notes = [];
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
      let last = '', f = 0;
      while (!P.nestOpen && f < 60 * 240) {
        const pr = levelProgress(), d = P.duel, tag = pr.kind + pr.cur + (pr.kind === 'duel' ? ':' + d.kind : '');
        if (tag !== last) { seq.push(tag); last = tag; if (pr.kind === 'duel') notes.push(d.kind + ' hp ' + d.hp + ' banner.mid ' + !!(P.banner && P.banner.mid)); }
        if (d && !d.over) { if (d.state !== 'enter' && d.state !== 'hurt' && d.state !== 'flee' && f % 20 === 0) duelHit(1); }
        else {
          for (const t of L.trees) if (t.spark && t.spark.active && !t.spark.done) shakeTree(t, 1, true);
          for (const e of P.eggs.slice()) if (e.state === 'idle' && e.delay <= 0 && !(e.wait > 0)) collectEgg(e, 0);
        }
        step(1); f++;
      }
      const pr = levelProgress();
      seq.push(pr.kind + pr.cur);
      out.push({ lvl, n: pr.n, midSeg: pr.midSeg, fightSeg: pr.fightSeg, seq: seq.join(' > '), notes, t: Math.round(f / 60) });
    }
    return out;
  });
  const want = 'eggs0 > eggs1 > duel2:mid > eggs2 > eggs3 > duel4:nest > nest5';   // eggs2 = clipa de dupa lupta din mijloc, partea ei ramane facuta
  let bad = 0;
  for (const r of res) {
    console.log(JSON.stringify(r));
    if (r.seq !== want || r.n !== 6 || r.midSeg !== 2 || r.fightSeg !== 4) bad++;
    if (!/^mid .*banner.mid true$/.test(r.notes[0] || '') || !/^nest .*banner.mid false$/.test(r.notes[1] || '')) bad++;
  }
  console.log(bad ? 'NEREUSIT: ordinea asteptata este ' + want : 'ordine-nivel OK');
  await done();
})();
