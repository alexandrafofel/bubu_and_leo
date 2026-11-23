// Ordinea pe un nivel (T15, docs/28-t15-george-de-doua-ori.md): diamante pana la jumatatea cotei comune, lupta din mijloc,
// diamante pana la cota comuna intreaga, lupta de la cuib, cuib. Diamantele vin doar din inamicii mici invinsi.
// Verifica si bara de progres: fiecare parte are segmentul ei, in aceeasi ordine, si bannerul fiecarei lupte.
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const res = await page.evaluate(() => {
    const G = __game, out = [];
    for (const lvl of [0, 3]) {
      go(lvl); const P = G.P, L = P.L, seq = [], notes = [];
      for (const b of L.beetles) { b.state = 'sleep'; b.cool = 999; } L.cones.length = 0;
      let last = '', f = 0, kills = 0;
      while (!P.nestOpen && f < 60 * 300) {
        const pr = levelProgress(), d = P.duel, tag = pr.kind + pr.cur + (pr.kind === 'duel' ? ':' + d.kind : '');
        if (tag !== last) { seq.push(tag); last = tag; if (pr.kind === 'duel') notes.push(d.kind + ' hp ' + d.hp + ' mid ' + !!(P.banner && P.banner.mid) + ' msg ' + (P.banner && P.banner.msg)); }
        if (d && !d.over) { if (d.state !== 'enter' && d.state !== 'hurt' && d.state !== 'flee' && f % 20 === 0) duelHit(1); }
        else if (f % 60 === 0) {             // a small enemy is beaten every second (the only place diamonds come from), and the diamond is picked up
          for (const t of L.trees) if (t.spark && t.spark.active && !t.spark.done) shakeTree(t, 1, true);      // the glowing trees let their snails out
          const b = L.beetles.find(x => x.state !== 'dead' && !x.thrown);
          if (b) { while (!hurtSmall(b)); b.state = 'dead'; b.t = 0.5; kills++; }       // it comes back soon (the heroes stand far away, at the start)
        }
        for (const e of P.eggs.slice()) if (e.goal && e.state === 'idle' && e.delay <= 0 && !(e.wait > 0)) collectEgg(e, P.found[0] < P.q ? 0 : 1);   // the first hero takes his quota, the friend the rest
        for (const h of P.heroes) { h.down = false; h.dizzy = 0; h.inv = 99; }      // nobody falls: this test is about the order, not about the help
        step(1); f++;
      }
      const pr = levelProgress();
      seq.push(pr.kind + pr.cur);
      out.push({ lvl, n: pr.n, midSeg: pr.midSeg, fightSeg: pr.fightSeg, seq: seq.join(' > '), notes, kills, found: P.found.slice(), t: Math.round(f / 60) });
    }
    return out;
  });
  const want = 'eggs0 > duel1:mid > eggs2 > duel3:nest > nest4';
  let bad = 0;
  for (const r of res) {
    console.log(JSON.stringify(r));
    if (r.seq !== want || r.n !== 5 || r.midSeg !== 1 || r.fightSeg !== 3) bad++;
    if (!/^mid .* mid true msg george\.half$/.test(r.notes[0] || '') || !/^nest .* mid false msg george\.final$/.test(r.notes[1] || '')) bad++;
  }
  console.log(bad ? 'NEREUSIT: ordinea asteptata este ' + want : 'ordine-nivel OK');
  await done();
})();
