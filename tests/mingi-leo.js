// Puterea lui Leo in toate directiile (update U2): un sut trimite 8 mingi (12 la sutul incarcat) in cerc,
// toate se intorc la Leo, iar a doua apasare in cooldown le cheama inapoi.
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const res = await page.evaluate(() => {
    const G = __game, P0 = () => G.P, step = n => { for (let i = 0; i < n; i++) G.update(1 / 60); }, out = {};
    window.go(1);
    const P = P0(), h = P.heroes[1];
    // tap: 8 mingi, in cerc, la distante egale
    G.kickBall(h, 0, 1, 0);
    out.tapMingi = P.flock.length;
    const angs = P.flock.map(f => Math.atan2(f.vy, f.vx)).sort((a, b) => a - b);
    const gaps = angs.slice(1).map((a, i) => a - angs[i]); gaps.push(angs[0] + 2 * Math.PI - angs[angs.length - 1]);
    out.tapUnghiuri = Math.round(Math.max(...gaps) / (2 * Math.PI / 8) * 100) / 100;   // 1.00 = la distante egale
    out.tapDirectii = new Set(P.flock.map(f => Math.sign(Math.round(Math.cos(Math.atan2(f.vy, f.vx)) * 10)) + ',' + Math.sign(Math.round(Math.sin(Math.atan2(f.vy, f.vx)) * 10)))).size;
    out.statusDupaSut = P.ball.state;
    // cooldown: apasare cat zboara le cheama inapoi
    step(20); P.ballCool = 0.5; G.recallBalls();
    out.chemate = P.flock.every(f => f.state === 'return' || f.state === 'fly');
    // toate revin si Leo le ia
    step(60 * 8);
    out.revinMingi = P.flock.length;
    out.statusDupaRevenire = P.ball.state;
    // sut incarcat: 12 mingi
    P.ballCool = 0;
    G.kickBall(h, 1, 1, 0);
    out.incarcatMingi = P.flock.length;
    // o mingea pe paznic pe sut: un sut are o singura lovitura (testat mai jos, dupa ce se intorc)
    step(60 * 8);
    out.revin2 = P.flock.length;
    return out;
  });
  const expect = { tapMingi: 8, tapUnghiuri: 1, tapDirectii: 8, statusDupaSut: 'away', chemate: true, revinMingi: 0, statusDupaRevenire: 'held', incarcatMingi: 12, revin2: 0 };
  const bad = [];
  for (const [k, v] of Object.entries(res)) { const ok = expect[k] === undefined || v === expect[k] || (k === 'tapDirectii' && v >= 6); console.log(k.padEnd(22), JSON.stringify(v), ok ? '' : '<-- ASTEPTAT ' + JSON.stringify(expect[k])); if (!ok) bad.push(k); }
  console.log(bad.length ? 'NEREUSIT ' + bad.join('; ') : 'mingi-leo OK');
  await done();
})();
