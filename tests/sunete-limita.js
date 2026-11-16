// Ce ajunge de fapt la boxe (dupa compresor si limitator): fiecare cuvant al eroilor si mai multe sunete tari deodata, peste muzica.
// Nimic nu are voie sa treaca de 0.98 (peste 1 sunetul se "rupe" si devine aspru), si niciun cuvant sub 0.1. Jocul: variabila JOC.
// Se ruleaza singur: alt test pornit in acelasi timp strica masuratoarea. Dureaza cam 2 minute.
const { chromium, chrome, url, game } = require('./pw.js');
(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.addInitScript(() => {       // remember the node that is plugged into the speakers: the meter goes after it
    const oc = AudioNode.prototype.connect; window.lastToDest = null;
    AudioNode.prototype.connect = function (d) { if (d instanceof AudioDestinationNode) window.lastToDest = this; return oc.apply(this, arguments); };
  });
  await page.goto(url); await page.waitForTimeout(800); await page.mouse.click(900, 500); await page.waitForTimeout(600);
  const r = await page.evaluate(async (game) => {
    const G = __game, S = G.Snd, ac = S.debug().ac; if (!ac || !window.lastToDest) return null;
    G.setGame(game); await ac.resume();
    const an = ac.createAnalyser(); an.fftSize = 32768; lastToDest.connect(an); const buf = new Float32Array(32768);
    const peak = async ms => { let p = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { an.getFloatTimeDomainData(buf); for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs(buf[i])); await new Promise(r => setTimeout(r, 100)); } return +p.toFixed(3); };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const words = {}, many = {}, W = S.words();
    for (const k of [0, 1]) for (const key of Object.keys(W[k])) { await wait(500); S.talk(k, key); words[k + ':' + key] = await peak(900); }
    await wait(800); S.music('l0'); await wait(1500);
    S.play('stomp', 0, 0); S.play('kick', 1, 1); S.talk(0, 'butterfly'); S.talk(1, 'giant'); many.a = await peak(1200);
    S.play('stomp', 0, 0); S.play('bonk', 0, 0); S.play('win'); S.talk(0, 'hurt'); S.talk(1, 'guardHit'); many.b = await peak(1500);
    S.play('goal'); S.play('firework'); S.play('star', 0, 0); S.talk(0, 'levelWin'); S.talk(1, 'levelWin'); many.c = await peak(1800);
    return { words, many };
  }, game);
  if (!r) console.log('NEREUSIT: fara sunet');
  else {
    const w = Object.entries(r.words).sort((a, b) => b[1] - a[1]), m = Object.values(r.many), top = Math.max(w[0][1], ...m), low = w[w.length - 1][1];
    console.log('joc', game, '| cuvinte:', w.length, '| cel mai tare:', w[0].join(' '), '| cel mai incet:', w[w.length - 1].join(' '), '| mai multe sunete deodata:', m.join(' '));
    console.log(top < 0.98 && low >= 0.1 ? 'sunete-limita OK (' + game + ')' : 'NEREUSIT: varf ' + top + ', cel mai incet cuvant ' + low);
  }
  console.log('errors', errs.length); errs.slice(0, 6).forEach(e => console.log(e));
  await browser.close();
})();
