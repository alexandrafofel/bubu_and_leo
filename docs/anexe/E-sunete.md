<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa E. Toate efectele sonore

Efectele sunt in obiectul `fx` din src/03-audio.js. Se cer cu `Snd.play('nume', valoare, erou)`. Grupul decide volumul care le controleaza: "personaje" = Sunete personaje (pot merge si in difuzorul controllerului), "lume" = Sunete ambientale.

Total: 34 efecte.

| Linia | Nume | Grup | Comentariul din cod | Cod |
|---|---|---|---|---|
| 257 | `egg` | personaje |  | `egg(b, t, n) { const f = mtof(72 + PENT[(n \|\| 0) % 10]); kalimba(b, f, t, 0.2); kalimba(b, f * 1.5, t + 0.07, 0.1); },` |
| 258 | `star` | personaje |  | `star(b, t) { [0, 4, 7, 12, 16].forEach((d, i) => chime(b, mtof(79 + d), t + i * 0.07, 0.11)); },` |
| 259 | `giant` | personaje |  | `giant(b, t) { [0, 4, 7, 12, 16, 19, 24].forEach((d, i) => { chime(b, mtof(67 + d), t + i * 0.09, 0.13); kalimba(b, mtof(55 + d), t + i * 0.09, 0.14); }); },` |
| 260 | `stomp` | personaje |  | `stomp(b, t) { osc(b, 'sine', 95, t, 0.75, 0.006, 0.4, { f2: 42, gt: 0.3 }); osc(b, 'triangle', 60, t, 0.3, 0.005, 0.25, { lp: 300 }); noise(b, t, 0.22, 0.005, 0 ...` |
| 261 | `kick` | personaje |  | `kick(b, t, p) { const f = 210 + (p \|\| 0) * 60; osc(b, 'sine', f, t, 0.5, 0.003, 0.13, { f2: f * 0.55, gt: 0.1 }); osc(b, 'triangle', f * 2.1, t, 0.12, 0.002, 0. ...` |
| 262 | `bounce` | personaje |  | `bounce(b, t) { osc(b, 'sine', 300, t, 0.16, 0.003, 0.09, { f2: 200 }); },` |
| 263 | `bonk` | personaje |  | `bonk(b, t) { osc(b, 'sine', 330, t, 0.45, 0.004, 0.22, { f2: 150, gt: 0.2 }); marimba(b, 196, t + 0.02, 0.3); },` |
| 264 | `drop` | personaje |  | `drop(b, t) { kalimba(b, mtof(76), t, 0.14); kalimba(b, mtof(72), t + 0.09, 0.12); kalimba(b, mtof(67), t + 0.18, 0.1); },` |
| 265 | `squelch` | personaje |  | `squelch(b, t) { noise(b, t, 0.2, 0.01, 0.1, 'lowpass', 500, 200); osc(b, 'sine', 140, t, 0.2, 0.01, 0.08, { f2: 90 }); },` |
| 266 | `step` | personaje | x = hero * 2 + (left or right foot) | `step(b, t, x) {                    // x = hero * 2 + (left or right foot)` |
| 272 | `wake` | lume |  | `wake(b, t) { marimba(b, mtof(50), t, 0.3); marimba(b, mtof(53), t + 0.12, 0.3); },` |
| 273 | `stun` | lume |  | `stun(b, t) { marimba(b, mtof(64), t, 0.2); marimba(b, mtof(57), t + 0.08, 0.2); },` |
| 274 | `pop` | lume |  | `pop(b, t) { osc(b, 'sine', 420, t, 0.25, 0.003, 0.12, { f2: 760, gt: 0.1 }); },` |
| 275 | `rustle` | lume |  | `rustle(b, t) { noise(b, t, 0.32, 0.02, 0.4, 'bandpass', 2200, 900, 0.8); },` |
| 276 | `butterfly` | lume |  | `butterfly(b, t) { [0, 2, 4, 7, 9, 12].forEach((d, i) => chime(b, mtof(84 + d), t + i * 0.05, 0.07)); },` |
| 277 | `wave` | lume |  | `wave(b, t) { [0, 4, 7, 12].forEach((d, i) => marimba(b, mtof(67 + d), t + i * 0.11, 0.28)); chime(b, mtof(91), t + 0.44, 0.1); },` |
| 278 | `win` | lume |  | `win(b, t) { [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach((d, i) => { marimba(b, mtof(60 + d), t + i * 0.13, 0.3); if (i % 2 === 0) chime(b, mtof(84 + d), t + i * 0. ...` |
| 279 | `caw` | lume |  | `caw(b, t) { for (let i = 0; i < 2; i++) { osc(b, 'triangle', 560, t + i * 0.2, 0.22, 0.01, 0.13, { f2: 370, gt: 0.12, lp: 1500 }); noise(b, t + i * 0.2, 0.05, 0 ...` |
| 280 | `whoosh` | lume |  | `whoosh(b, t) { noise(b, t, 0.6, 0.7, 1.8, 'bandpass', 300, 900, 1.0); },` |
| 281 | `swish` | personaje |  | `swish(b, t) { noise(b, t, 0.3, 0.05, 0.35, 'bandpass', 500, 1800, 1.2); },` |
| 282 | `lantern` | lume |  | `lantern(b, t) { chime(b, mtof(76 + PENT[Math.random() * 5 \| 0]), t, 0.11); },` |
| 283 | `firework` | lume |  | `firework(b, t) { noise(b, t, 0.3, 0.01, 0.5, 'lowpass', 900, 200); for (let i = 0; i < 5; i++) chime(b, mtof(84 + PENT[Math.random() * 10 \| 0]), t + 0.08 + i *  ...` |
| 284 | `ui` | lume |  | `ui(b, t) { kalimba(b, mtof(76), t, 0.13); },` |
| 285 | `ok` | lume |  | `ok(b, t) { kalimba(b, mtof(72), t, 0.18); kalimba(b, mtof(79), t + 0.08, 0.18); },` |
| 286 | `thud` | lume |  | `thud(b, t) { osc(b, 'sine', 120, t, 0.4, 0.004, 0.2, { f2: 60 }); noise(b, t, 0.1, 0.004, 0.1, 'lowpass', 500, 150); },` |
| 287 | `goal` | lume |  | `goal(b, t) { [0, 7, 12, 16].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.08, 0.34)); chime(b, mtof(86), t + 0.3, 0.12); },` |
| 288 | `crack` | lume |  | `crack(b, t) { osc(b, 'triangle', 900, t, 0.3, 0.002, 0.06, { f2: 500, lp: 2500 }); noise(b, t, 0.18, 0.002, 0.06, 'bandpass', 1800, 0, 2); },` |
| 289 | `splash` | lume |  | `splash(b, t) { noise(b, t, 0.12, 0.02, 0.3, 'bandpass', 1200, 500, 0.8); },` |
| 290 | `tonk` | lume | the ball bounces off a guardian that is not tired yet | `tonk(b, t) { osc(b, 'triangle', 520, t, 0.22, 0.002, 0.07, { f2: 410, lp: 2200 }); osc(b, 'sine', 1040, t, 0.06, 0.002, 0.05); },   // the ball bounces off a gu ...` |
| 291 | `warn` | lume | a guardian gets ready to attack | `warn(b, t) { marimba(b, mtof(57), t, 0.26); marimba(b, mtof(57), t + 0.16, 0.26); },                                                 // a guardian gets ready to ...` |
| 292 | `squeak` | lume | a guardian got hit | `squeak(b, t, p) { const f = 520 * (p \|\| 1); voc(b, t, f * 1.4, f * 0.7, 0.24, 0.12, 1700, 900); },                                   // a guardian got hit` |
| 293 | `tired` | lume |  | `tired(b, t) { voc(b, t, 300, 190, 0.5, 0.07, 700, 450); },` |
| 294 | `duel` | lume |  | `duel(b, t) { [0, 3, 7, 10, 12].forEach((d, i) => marimba(b, mtof(57 + d), t + i * 0.09, 0.3)); osc(b, 'sine', 110, t, 0.3, 0.01, 0.5, { f2: 70 }); },` |
| 295 | `flee` | lume |  | `flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.1, 700 + i * 90, 900 + i * 90, 0.07, 0.08, 1500, 2200); }` |
