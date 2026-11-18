<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa E. Toate efectele sonore

Efectele sunt in obiectul `fx` din src/03-audio.js. Se cer cu `Snd.play('nume', valoare, erou)`. Grupul decide volumul care le controleaza: "personaje" = Sunete personaje (pot merge si in difuzorul controllerului), "lume" = Sunete ambientale.

Total: 39 efecte.

| Linia | Nume | Grup | Comentariul din cod | Cod |
|---|---|---|---|---|
| 363 | `egg` | personaje |  | `egg(b, t, n) { const f = mtof(72 + PENT[(n \|\| 0) % 10]); kalimba(b, f, t, 0.2); kalimba(b, f * 1.5, t + 0.07, 0.1); },` |
| 364 | `star` | personaje |  | `star(b, t) { [0, 4, 7, 12, 16].forEach((d, i) => chime(b, mtof(79 + d), t + i * 0.07, 0.11)); },` |
| 365 | `giant` | personaje |  | `giant(b, t) { [0, 4, 7, 12, 16, 19, 24].forEach((d, i) => { chime(b, mtof(67 + d), t + i * 0.09, 0.13); kalimba(b, mtof(55 + d), t + i * 0.09, 0.14); }); },` |
| 366 | `stomp` | personaje |  | `stomp(b, t) { osc(b, 'sine', 95, t, 0.75, 0.006, 0.4, { f2: 42, gt: 0.3 }); osc(b, 'triangle', 60, t, 0.3, 0.005, 0.25, { lp: 300 }); noise(b, t, 0.22, 0.005, 0 ...` |
| 367 | `kick` | personaje |  | `kick(b, t, p) { const f = 210 + (p \|\| 0) * 60; osc(b, 'sine', f, t, 0.5, 0.003, 0.13, { f2: f * 0.55, gt: 0.1 }); osc(b, 'triangle', f * 2.1, t, 0.12, 0.002, 0. ...` |
| 368 | `bounce` | personaje |  | `bounce(b, t) { osc(b, 'sine', 300, t, 0.16, 0.003, 0.09, { f2: 200 }); },` |
| 369 | `bonk` | personaje |  | `bonk(b, t) { osc(b, 'sine', 330, t, 0.45, 0.004, 0.22, { f2: 150, gt: 0.2 }); marimba(b, 196, t + 0.02, 0.3); },` |
| 370 | `drop` | personaje |  | `drop(b, t) { kalimba(b, mtof(76), t, 0.14); kalimba(b, mtof(72), t + 0.09, 0.12); kalimba(b, mtof(67), t + 0.18, 0.1); },` |
| 371 | `squelch` | personaje |  | `squelch(b, t) { noise(b, t, 0.2, 0.01, 0.1, 'lowpass', 500, 200); osc(b, 'sine', 140, t, 0.2, 0.01, 0.08, { f2: 90 }); },` |
| 372 | `step` | personaje | x = hero * 2 + (left or right foot) | `step(b, t, x) {                    // x = hero * 2 + (left or right foot)` |
| 378 | `wake` | lume |  | `wake(b, t) { marimba(b, mtof(50), t, 0.3); marimba(b, mtof(53), t + 0.12, 0.3); },` |
| 379 | `stun` | lume |  | `stun(b, t) { marimba(b, mtof(64), t, 0.2); marimba(b, mtof(57), t + 0.08, 0.2); },` |
| 380 | `pop` | lume |  | `pop(b, t) { osc(b, 'sine', 420, t, 0.25, 0.003, 0.12, { f2: 760, gt: 0.1 }); },` |
| 381 | `rustle` | lume |  | `rustle(b, t) { noise(b, t, 0.32, 0.02, 0.4, 'bandpass', 2200, 900, 0.8); },` |
| 382 | `butterfly` | lume |  | `butterfly(b, t) { [0, 2, 4, 7, 9, 12].forEach((d, i) => chime(b, mtof(84 + d), t + i * 0.05, 0.07)); },` |
| 383 | `wave` | lume |  | `wave(b, t) { [0, 4, 7, 12].forEach((d, i) => marimba(b, mtof(67 + d), t + i * 0.11, 0.28)); chime(b, mtof(91), t + 0.44, 0.1); },` |
| 384 | `win` | lume |  | `win(b, t) { [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach((d, i) => { marimba(b, mtof(60 + d), t + i * 0.13, 0.3); if (i % 2 === 0) chime(b, mtof(84 + d), t + i * 0. ...` |
| 385 | `caw` | lume |  | `caw(b, t) { for (let i = 0; i < 2; i++) { osc(b, 'triangle', 560, t + i * 0.2, 0.22, 0.01, 0.13, { f2: 370, gt: 0.12, lp: 1500 }); noise(b, t + i * 0.2, 0.05, 0 ...` |
| 386 | `whoosh` | lume |  | `whoosh(b, t) { noise(b, t, 0.6, 0.7, 1.8, 'bandpass', 300, 900, 1.0); },` |
| 387 | `swish` | personaje |  | `swish(b, t) { noise(b, t, 0.3, 0.05, 0.35, 'bandpass', 500, 1800, 1.2); },` |
| 388 | `lantern` | lume |  | `lantern(b, t) { chime(b, mtof(76 + PENT[Math.random() * 5 \| 0]), t, 0.11); },` |
| 389 | `firework` | lume |  | `firework(b, t) { noise(b, t, 0.3, 0.01, 0.5, 'lowpass', 900, 200); for (let i = 0; i < 5; i++) chime(b, mtof(84 + PENT[Math.random() * 10 \| 0]), t + 0.08 + i *  ...` |
| 390 | `ui` | lume |  | `ui(b, t) { kalimba(b, mtof(76), t, 0.13); },` |
| 391 | `no` | lume | "not that one": two soft notes going down (a locked chapter) | `no(b, t) { kalimba(b, mtof(67), t, 0.13); kalimba(b, mtof(64), t + 0.13, 0.13); },           // "not that one": two soft notes going down (a locked chapter)` |
| 392 | `ok` | lume |  | `ok(b, t) { kalimba(b, mtof(72), t, 0.18); kalimba(b, mtof(79), t + 0.08, 0.18); },` |
| 393 | `thud` | lume |  | `thud(b, t) { osc(b, 'sine', 120, t, 0.4, 0.004, 0.2, { f2: 60 }); noise(b, t, 0.1, 0.004, 0.1, 'lowpass', 500, 150); },` |
| 394 | `goal` | lume |  | `goal(b, t) { [0, 7, 12, 16].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.08, 0.34)); chime(b, mtof(86), t + 0.3, 0.12); },` |
| 395 | `crack` | lume |  | `crack(b, t) { osc(b, 'triangle', 900, t, 0.3, 0.002, 0.06, { f2: 500, lp: 2500 }); noise(b, t, 0.18, 0.002, 0.06, 'bandpass', 1800, 0, 2); },` |
| 396 | `splash` | lume |  | `splash(b, t) { noise(b, t, 0.12, 0.02, 0.3, 'bandpass', 1200, 500, 0.8); },` |
| 397 | `tonk` | lume | the ball bounces off a guardian that is not tired yet | `tonk(b, t) { osc(b, 'triangle', 520, t, 0.22, 0.002, 0.07, { f2: 410, lp: 2200 }); osc(b, 'sine', 1040, t, 0.06, 0.002, 0.05); },   // the ball bounces off a gu ...` |
| 398 | `warn` | lume | a guardian gets ready to attack | `warn(b, t) { marimba(b, mtof(57), t, 0.26); marimba(b, mtof(57), t + 0.16, 0.26); },                                                 // a guardian gets ready to ...` |
| 399 | `squeak` | lume | a guardian got hit | `squeak(b, t, p) { const f = 520 * (p \|\| 1); voc(b, t, f * 1.4, f * 0.7, 0.24, 0.12, 1700, 900); },                                   // a guardian got hit` |
| 400 | `tired` | lume |  | `tired(b, t) { voc(b, t, 300, 190, 0.5, 0.07, 700, 450); },` |
| 401 | `duel` | lume |  | `duel(b, t) { [0, 3, 7, 10, 12].forEach((d, i) => marimba(b, mtof(57 + d), t + i * 0.09, 0.3)); osc(b, 'sine', 110, t, 0.3, 0.01, 0.5, { f2: 70 }); },` |
| 402 | `flee` | lume |  | `flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.1, 700 + i * 90, 900 + i * 90, 0.07, 0.08, 1500, 2200); },` |
| 403 | `heal` | personaje | a friend helped a hero up | `heal(b, t) { [0, 4, 7, 12].forEach((d, i) => kalimba(b, mtof(72 + d), t + i * 0.06, 0.2)); chime(b, mtof(91), t + 0.26, 0.1); },                    // a friend  ...` |
| 404 | `grab` | personaje | a bird picks a hero up | `grab(b, t) { osc(b, 'sine', 300, t, 0.3, 0.02, 0.3, { f2: 760, gt: 0.3 }); noise(b, t, 0.12, 0.04, 0.3, 'bandpass', 700, 1900, 1.2); },                 // a bir ...` |
| 405 | `poof` | lume | a small enemy disappears | `poof(b, t) { noise(b, t, 0.22, 0.01, 0.22, 'lowpass', 1400, 300); osc(b, 'sine', 520, t, 0.2, 0.004, 0.16, { f2: 210 }); },                              // a sm ...` |
| 406 | `bird` | lume | a big bird is coming | `bird(b, t) { for (let i = 0; i < 3; i++) osc(b, 'triangle', 1250 - i * 140, t + i * 0.13, 0.09, 0.01, 0.1, { f2: 900 - i * 100, lp: 3200 }); }            // a b ...` |

## Al doilea joc: `fx2`

Cat se joaca "Cea mai grea luptă", efectele de mai jos iau locul celor cu acelasi nume din `fx`. Un nume care nu e in `fx` exista doar in al doilea joc.

Total: 29 efecte.

| Linia | Nume | Grup | Comentariul din cod | Cod |
|---|---|---|---|---|
| 411 | `egg` | personaje | a crystal rings like glass | `egg(b, t, n) { const f = mtof(76 + PENT[(n \|\| 0) % 10]); chime(b, f, t, 0.16); chime(b, f * 1.5, t + 0.05, 0.09); osc(b, 'sine', f * 4, t, 0.03, 0.002, 0.12); } ...` |
| 412 | `star` | personaje |  | `star(b, t) { [0, 7, 12, 19, 24].forEach((d, i) => chime(b, mtof(74 + d), t + i * 0.08, 0.11)); },` |
| 413 | `giant` | personaje |  | `giant(b, t) { [0, 2, 4, 7, 9, 12, 14, 16, 19, 24].forEach((d, i) => { chime(b, mtof(69 + d), t + i * 0.07, 0.12); if (i % 2) kalimba(b, mtof(57 + d), t + i * 0. ...` |
| 414 | `stomp` | personaje | Boon's claws: three quick swishes | `stomp(b, t) { for (let i = 0; i < 3; i++) noise(b, t + i * 0.09, 0.24, 0.015, 0.1, 'bandpass', 900, 2800, 1.4); osc(b, 'sine', 150, t, 0.4, 0.01, 0.4, { f2: 95, ...` |
| 415 | `kick` | personaje | Killer's kick: a springy "boing" | `kick(b, t, p) { const f = 250 + (p \|\| 0) * 70; osc(b, 'sine', f, t, 0.45, 0.004, 0.2, { f2: f * 2.1, gt: 0.12 }); osc(b, 'triangle', f * 1.5, t + 0.02, 0.14, 0. ...` |
| 416 | `bounce` | personaje |  | `bounce(b, t) { osc(b, 'sine', 380, t, 0.15, 0.003, 0.1, { f2: 640, gt: 0.08 }); },` |
| 417 | `bonk` | personaje | a hero shrinks | `bonk(b, t) { osc(b, 'sine', 760, t, 0.4, 0.01, 0.36, { f2: 170, gt: 0.34 }); osc(b, 'triangle', 380, t + 0.03, 0.14, 0.01, 0.3, { f2: 110, lp: 1600 }); },       ...` |
| 418 | `heal` | personaje | a hero grows back | `heal(b, t) { osc(b, 'sine', 180, t, 0.36, 0.01, 0.34, { f2: 760, gt: 0.3 }); [0, 7, 12].forEach((d, i) => chime(b, mtof(79 + d), t + 0.24 + i * 0.06, 0.1)); },  ...` |
| 419 | `drop` | personaje |  | `drop(b, t) { chime(b, mtof(84), t, 0.1); chime(b, mtof(79), t + 0.08, 0.09); chime(b, mtof(72), t + 0.16, 0.08); },` |
| 420 | `squelch` | personaje |  | `squelch(b, t) { noise(b, t, 0.18, 0.015, 0.14, 'lowpass', 800, 260); osc(b, 'sine', 190, t, 0.18, 0.01, 0.12, { f2: 120 }); },` |
| 421 | `step` | personaje |  | `step(b, t, x) {` |
| 426 | `wake` | lume | a robot switches on: beep-beep | `wake(b, t) { osc(b, 'triangle', 880, t, 0.16, 0.004, 0.09, { lp: 2800 }); osc(b, 'triangle', 1175, t + 0.13, 0.16, 0.004, 0.12, { lp: 2800 }); },                ...` |
| 427 | `stun` | lume | a robot runs down | `stun(b, t) { osc(b, 'triangle', 880, t, 0.16, 0.004, 0.34, { f2: 220, gt: 0.32, lp: 2600 }); },                                                                  ...` |
| 428 | `poof` | lume |  | `poof(b, t) { noise(b, t, 0.2, 0.01, 0.22, 'lowpass', 1400, 300); [988, 740, 494].forEach((f, i) => osc(b, 'triangle', f, t + i * 0.07, 0.1, 0.004, 0.07, { lp: 2 ...` |
| 429 | `caw` | lume | George's roar: low and warm, never harsh | `caw(b, t) { growl(b, t, 150, 88, 0.75, 0.42, 21); },                                                                                                             ...` |
| 430 | `pop` | lume |  | `pop(b, t) { osc(b, 'sine', 520, t, 0.22, 0.003, 0.12, { f2: 940, gt: 0.1 }); },` |
| 431 | `rustle` | lume |  | `rustle(b, t) { noise(b, t, 0.3, 0.02, 0.45, 'lowpass', 420, 150); },` |
| 432 | `butterfly` | lume | the rocket | `butterfly(b, t) { noise(b, t, 0.22, 0.05, 0.6, 'bandpass', 400, 2600, 1.1); osc(b, 'sine', 220, t, 0.2, 0.03, 0.55, { f2: 990, gt: 0.5 }); },                    ...` |
| 433 | `wave` | lume |  | `wave(b, t) { [0, 3, 7, 10].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.11, 0.28)); chime(b, mtof(86), t + 0.44, 0.1); },` |
| 434 | `win` | lume |  | `win(b, t) { [0, 5, 7, 12, 7, 12, 17, 19, 24].forEach((d, i) => { marimba(b, mtof(62 + d), t + i * 0.12, 0.3); if (i % 2 === 0) chime(b, mtof(86 + d), t + i * 0. ...` |
| 435 | `lantern` | lume | a torch catches fire | `lantern(b, t) { noise(b, t, 0.2, 0.02, 0.28, 'lowpass', 1100, 320); osc(b, 'sine', 330, t, 0.1, 0.01, 0.2, { f2: 210 }); },                                      ...` |
| 436 | `warn` | lume |  | `warn(b, t) { osc(b, 'triangle', 392, t, 0.2, 0.005, 0.12, { lp: 1800 }); osc(b, 'triangle', 392, t + 0.16, 0.2, 0.005, 0.12, { lp: 1800 }); },` |
| 437 | `tonk` | lume |  | `tonk(b, t) { osc(b, 'triangle', 660, t, 0.2, 0.002, 0.08, { f2: 540, lp: 2400 }); osc(b, 'sine', 1320, t, 0.05, 0.002, 0.05); },` |
| 438 | `squeak` | lume | George got hit | `squeak(b, t, p) { const f = 300 * (p \|\| 1); voc(b, t, f * 1.3, f * 0.7, 0.28, 0.13, 1000, 600); },                                                               ...` |
| 439 | `tired` | lume |  | `tired(b, t) { growl(b, t, 130, 80, 0.5, 0.2, 9); },` |
| 440 | `duel` | lume |  | `duel(b, t) { [0, 0, 3].forEach((d, i) => marimba(b, mtof(50 + d), t + i * 0.14, 0.32)); growl(b, t + 0.35, 150, 90, 0.7, 0.4, 21); },` |
| 441 | `flee` | lume |  | `flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.11, 520 - i * 50, 380 - i * 40, 0.08, 0.09, 1200, 800); },` |
| 442 | `goal` | lume |  | `goal(b, t) { [0, 7, 12, 17].forEach((d, i) => marimba(b, mtof(64 + d), t + i * 0.08, 0.34)); chime(b, mtof(88), t + 0.3, 0.12); },` |
| 443 | `dash` | personaje | starting to run: a short soft "whoosh" going up | `dash(b, t) { noise(b, t, 0.16, 0.015, 0.17, 'bandpass', 500, 2100, 1.1); osc(b, 'sine', 330, t, 0.1, 0.01, 0.16, { f2: 760, gt: 0.14 }); }      // starting to r ...` |
