// Butoanele noi (T2): ✕ prima putere, ○ ajuta prietenul, □ a doua putere (deocamdata doar citita), L3 fuga.
// Controllere false si taste reale. Scrie "control-nou OK" sau "NEREUSIT". Captura: c_taste.png
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot({ manual: false });
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(700);
  await page.addInitScript(() => {
    window.mkPad = i => ({ index: i, id: 'fake pad ' + i, connected: true, mapping: 'standard', timestamp: 1,
      axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) });
    window.fakePads = [];
    navigator.getGamepads = () => fakePads;
  });
  await page.reload(); await page.waitForTimeout(900);
  await page.mouse.click(900, 500); await page.waitForTimeout(600);
  const fr = ms => page.waitForTimeout(ms);
  const key = async (k, ms = 90) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(120); };
  const press = async (i, b, ms = 110) => { await page.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = true; }, [i, b]); await fr(ms); await page.evaluate(([i, b]) => { fakePads[i].buttons[b].pressed = false; }, [i, b]); await fr(120); };
  const bad = [];
  const check = async (lbl, ok, extra) => { const s = await state(); let good = false; try { good = !!ok(s); } catch (e) { good = false; } console.log((good ? 'ok   ' : 'GRESIT ') + lbl + ' ' + JSON.stringify(extra ? extra(s) : s)); if (!good) bad.push(lbl); return s; };
  const state = () => page.evaluate(() => { const G = __game, P = G.P, S = G.Input.slots;
    return { st: G.Game.state, down: P ? P.heroes.map(h => h.down) : null, run: P ? P.heroes.map(h => h.run) : null,
      c: S.map(s => !!s.c), cP: window.seen ? seen.cP : null, runP: window.seen ? seen.runP : null, hP: window.seen ? seen.hP : null,
      keys: G.Opt.keys.map(k => [k.a, k.b, k.c, k.r]), page: G.UI.set ? G.UI.set.page : null }; });

  // two fake controllers join
  await page.evaluate(() => { fakePads[0] = mkPad(0); fakePads[1] = mkPad(1); });
  await press(0, 0); await press(1, 0); await fr(300);
  await page.evaluate(() => { const G = __game, I = G.Input, orig = I.poll;      // remember which edges were seen, they last one frame only
    window.seen = { cP: 0, runP: 0, hP: 0 };
    I.poll = function (dt) { orig(dt); for (const s of I.slots) { if (s.cP) seen.cP++; if (s.runP) seen.runP++; if (s.hP) seen.hP++; } };
    G.Input.slots[0].joined = G.Input.slots[1].joined = true;
  });
  // both ready, into the level
  await press(0, 0); await press(1, 0); await fr(2500);
  await page.evaluate(() => { const G = __game; if (G.Game.state === 'intro') { G.UI.introT = 2; } }); await press(0, 0); await fr(900);
  await check('1. in joc', s => s.st === 'play');

  // 1. ○ lifts a hero who was hit; □ does not
  await page.evaluate(() => { const G = __game, P = G.P, a = P.heroes[0], b = P.heroes[1]; b.x = a.x + 110; b.y = a.y; a.inv = 0; a.dizzy = 0; G.hitHero(a, a.x - 60, a.y); }); await fr(500);
  await check('2. primul erou e lovit', s => s.down[0] === true);
  await press(1, 2); await fr(500);
  await check('3. □ (butonul 2) nu mai ridica eroul', s => s.down[0] === true);
  await press(1, 1); await fr(900);
  await check('4. ○ (butonul 1) il ridica', s => s.down[0] === false);

  // 2. □ is read into cP / c
  const before = await page.evaluate(() => seen.cP);
  await press(1, 2, 200);
  await check('5. □ se citeste o singura data pe apasare (cP)', s => s.cP === before + 1, s => ({ cP: s.cP, inainte: before }));
  // 3. L3 (button 10) gives one runP per press
  const b2 = await page.evaluate(() => seen.runP);
  await press(1, 10, 260);
  await check('6. L3 (butonul 10) da un singur runP pe apasare', s => s.runP === b2 + 1, s => ({ runP: s.runP, inainte: b2 }));

  // 4. the keyboard: KeyE helps, KeyQ gives cP, ShiftLeft gives runP
  await page.evaluate(() => { const G = __game; G.Input.setCtrl(0, 'kb'); G.Input.slots[0].pad = null; G.Input.slots[1].joined = true; });
  // Killer tocmai a primit manusile de la □, iar cat se invart nimic nu il loveste: le oprim intai
  await page.evaluate(() => { const G = __game, P = G.P, a = P.heroes[1], b = P.heroes[0]; a.spinT = -1; a.shield = false; a.cd = 0; b.x = a.x - 90; b.y = a.y; a.inv = 0; a.dizzy = 0; G.hitHero(a, a.x + 60, a.y); }); await fr(500);
  await check('7. al doilea erou e lovit', s => s.down[1] === true);
  const b3 = await page.evaluate(() => seen.cP), b4 = await page.evaluate(() => seen.runP);
  await key('KeyE'); await fr(700);
  await check('8. tastatura: E (ajutor) il ridica', s => s.down[1] === false);
  await key('KeyQ');
  await check('9. tastatura: Q da cP (a doua putere)', s => s.cP > b3, s => ({ cP: s.cP, inainte: b3 }));
  await key('ShiftLeft');
  await check('10. tastatura: Shift stanga da runP (fuga)', s => s.runP > b4, s => ({ runP: s.runP, inainte: b4 }));

  // 5. an old save without c and r: the keys from CONFIG stay
  await page.evaluate(() => {
    const G = __game, raw = JSON.parse(localStorage.getItem(G.CONFIG.saveKey) || '{}');
    raw.opt = raw.opt || {}; raw.opt.keys = [{ up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', a: 'Space', b: 'KeyE' }, { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'Enter', b: 'ShiftRight' }];
    localStorage.setItem(G.CONFIG.saveKey, JSON.stringify(raw));
  });
  await page.reload(); await page.waitForTimeout(900); await page.mouse.click(900, 500); await page.waitForTimeout(600);
  await check('11. salvare veche fara c si r: tastele din CONFIG', s => s.keys[0][2] === 'KeyQ' && s.keys[0][3] === 'ShiftLeft' && s.keys[1][2] === 'Slash' && s.keys[1][3] === 'AltRight' && s.keys[0][1] === 'KeyE', s => ({ keys: s.keys }));

  // 6. the "choose the keys" page: 8 keys + two buttons, all inside the card
  const rows = await page.evaluate(() => {
    const G = __game;
    G.Input.setCtrl(0, 'kb');
    G.openSettings(); G.UI.set.page = 'keys'; G.UI.set.p = 0; G.draw(0.016);
    const r = G.settingsRows ? G.settingsRows() : null;
    return { n: r ? r.length : -1, fields: G.KEY_FIELDS.slice() };
  });
  await page.screenshot({ path: 'c_taste.png' });
  const fit = await page.evaluate(() => {
    const G = __game, rows = G.settingsRows(), rh = 70, head = 150, ch = head + rows.length * rh + 126;
    return { ch, y: Math.round(Math.max(16, (1080 - ch) / 2)), fits: ch <= 1080 - 32 };
  });
  console.log('pagina tastelor: ' + rows.n + ' randuri (' + rows.fields.join(', ') + '), inaltime ' + fit.ch);
  if (!(rows.n === 11 && fit.fits)) { console.log('GRESIT 12. pagina "Alege tastele" nu incape'); bad.push('12'); }
  else console.log('ok   12. pagina "Alege tastele": 9 taste + 2 butoane, incape pe ecran');

  if (bad.length) console.log('NEREUSIT: ' + bad.join(' | ')); else console.log('control-nou OK');
  await done();
})();
