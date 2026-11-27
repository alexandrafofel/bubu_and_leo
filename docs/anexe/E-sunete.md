<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa E. Toate efectele sonore

Efectele sunt in obiectul `fx` din src/03-audio.js. Se cer cu `Snd.play('nume', valoare, erou)`. Grupul decide volumul care le controleaza: "personaje" = Sunete personaje (pot merge si in difuzorul controllerului), "lume" = Sunete ambientale.

Total: 40 efecte.

| Linia | Nume | Grup | Comentariul din cod | Cod |
|---|---|---|---|---|
| 416 | `egg` | personaje |  | `egg(b, t, n) { const f = mtof(72 + PENT[(n \|\| 0) % 10]); kalimba(b, f, t, 0.2); kalimba(b, f * 1.5, t + 0.07, 0.1); },` |
| 417 | `give` | personaje | an egg leaves: two warm marimba notes, going up | `give(b, t) { kalimba(b, mtof(79), t, 0.16); kalimba(b, mtof(86), t + 0.09, 0.16); },                                                      // an egg leaves: two  ...` |
| 418 | `star` | personaje |  | `star(b, t) { [0, 4, 7, 12, 16].forEach((d, i) => chime(b, mtof(79 + d), t + i * 0.07, 0.11)); },` |
| 419 | `giant` | personaje |  | `giant(b, t) { [0, 4, 7, 12, 16, 19, 24].forEach((d, i) => { chime(b, mtof(67 + d), t + i * 0.09, 0.13); kalimba(b, mtof(55 + d), t + i * 0.09, 0.14); }); },` |
| 420 | `stomp` | personaje |  | `stomp(b, t) { osc(b, 'sine', 95, t, 0.75, 0.006, 0.4, { f2: 42, gt: 0.3 }); osc(b, 'triangle', 60, t, 0.3, 0.005, 0.25, { lp: 300 }); noise(b, t, 0.22, 0.005, 0 ...` |
| 421 | `kick` | personaje |  | `kick(b, t, p) { const f = 210 + (p \|\| 0) * 60; osc(b, 'sine', f, t, 0.5, 0.003, 0.13, { f2: f * 0.55, gt: 0.1 }); osc(b, 'triangle', f * 2.1, t, 0.12, 0.002, 0. ...` |
| 422 | `bounce` | personaje |  | `bounce(b, t) { osc(b, 'sine', 300, t, 0.16, 0.003, 0.09, { f2: 200 }); },` |
| 423 | `bonk` | personaje |  | `bonk(b, t) { osc(b, 'sine', 330, t, 0.45, 0.004, 0.22, { f2: 150, gt: 0.2 }); marimba(b, 196, t + 0.02, 0.3); },` |
| 424 | `drop` | personaje |  | `drop(b, t) { kalimba(b, mtof(76), t, 0.14); kalimba(b, mtof(72), t + 0.09, 0.12); kalimba(b, mtof(67), t + 0.18, 0.1); },` |
| 425 | `squelch` | personaje |  | `squelch(b, t) { noise(b, t, 0.2, 0.01, 0.1, 'lowpass', 500, 200); osc(b, 'sine', 140, t, 0.2, 0.01, 0.08, { f2: 90 }); },` |
| 426 | `step` | personaje | x = hero * 2 + (left or right foot) | `step(b, t, x) {                    // x = hero * 2 + (left or right foot)` |
| 432 | `wake` | lume |  | `wake(b, t) { marimba(b, mtof(50), t, 0.3); marimba(b, mtof(53), t + 0.12, 0.3); },` |
| 433 | `stun` | lume |  | `stun(b, t) { marimba(b, mtof(64), t, 0.2); marimba(b, mtof(57), t + 0.08, 0.2); },` |
| 434 | `pop` | lume |  | `pop(b, t) { osc(b, 'sine', 420, t, 0.25, 0.003, 0.12, { f2: 760, gt: 0.1 }); },` |
| 435 | `rustle` | lume |  | `rustle(b, t) { noise(b, t, 0.32, 0.02, 0.4, 'bandpass', 2200, 900, 0.8); },` |
| 436 | `butterfly` | lume |  | `butterfly(b, t) { [0, 2, 4, 7, 9, 12].forEach((d, i) => chime(b, mtof(84 + d), t + i * 0.05, 0.07)); },` |
| 437 | `wave` | lume |  | `wave(b, t) { [0, 4, 7, 12].forEach((d, i) => marimba(b, mtof(67 + d), t + i * 0.11, 0.28)); chime(b, mtof(91), t + 0.44, 0.1); },` |
| 438 | `win` | lume |  | `win(b, t) { [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach((d, i) => { marimba(b, mtof(60 + d), t + i * 0.13, 0.3); if (i % 2 === 0) chime(b, mtof(84 + d), t + i * 0. ...` |
| 439 | `caw` | lume |  | `caw(b, t) { for (let i = 0; i < 2; i++) { osc(b, 'triangle', 560, t + i * 0.2, 0.22, 0.01, 0.13, { f2: 370, gt: 0.12, lp: 1500 }); noise(b, t + i * 0.2, 0.05, 0 ...` |
| 440 | `whoosh` | lume |  | `whoosh(b, t) { noise(b, t, 0.6, 0.7, 1.8, 'bandpass', 300, 900, 1.0); },` |
| 441 | `swish` | personaje |  | `swish(b, t) { noise(b, t, 0.3, 0.05, 0.35, 'bandpass', 500, 1800, 1.2); },` |
| 442 | `lantern` | lume |  | `lantern(b, t) { chime(b, mtof(76 + PENT[Math.random() * 5 \| 0]), t, 0.11); },` |
| 443 | `firework` | lume |  | `firework(b, t) { noise(b, t, 0.3, 0.01, 0.5, 'lowpass', 900, 200); for (let i = 0; i < 5; i++) chime(b, mtof(84 + PENT[Math.random() * 10 \| 0]), t + 0.08 + i *  ...` |
| 444 | `ui` | lume |  | `ui(b, t) { kalimba(b, mtof(76), t, 0.13); },` |
| 445 | `no` | lume | "not that one": two soft notes going down (a locked chapter) | `no(b, t) { kalimba(b, mtof(67), t, 0.13); kalimba(b, mtof(64), t + 0.13, 0.13); },           // "not that one": two soft notes going down (a locked chapter)` |
| 446 | `ok` | lume |  | `ok(b, t) { kalimba(b, mtof(72), t, 0.18); kalimba(b, mtof(79), t + 0.08, 0.18); },` |
| 447 | `thud` | lume |  | `thud(b, t) { osc(b, 'sine', 120, t, 0.4, 0.004, 0.2, { f2: 60 }); noise(b, t, 0.1, 0.004, 0.1, 'lowpass', 500, 150); },` |
| 448 | `goal` | lume |  | `goal(b, t) { [0, 7, 12, 16].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.08, 0.34)); chime(b, mtof(86), t + 0.3, 0.12); },` |
| 449 | `crack` | lume |  | `crack(b, t) { osc(b, 'triangle', 900, t, 0.3, 0.002, 0.06, { f2: 500, lp: 2500 }); noise(b, t, 0.18, 0.002, 0.06, 'bandpass', 1800, 0, 2); },` |
| 450 | `splash` | lume |  | `splash(b, t) { noise(b, t, 0.12, 0.02, 0.3, 'bandpass', 1200, 500, 0.8); },` |
| 451 | `tonk` | lume | the ball bounces off a guardian that is not tired yet | `tonk(b, t) { osc(b, 'triangle', 520, t, 0.22, 0.002, 0.07, { f2: 410, lp: 2200 }); osc(b, 'sine', 1040, t, 0.06, 0.002, 0.05); },   // the ball bounces off a gu ...` |
| 452 | `warn` | lume | a guardian gets ready to attack | `warn(b, t) { marimba(b, mtof(57), t, 0.26); marimba(b, mtof(57), t + 0.16, 0.26); },                                                 // a guardian gets ready to ...` |
| 453 | `squeak` | lume | a guardian got hit | `squeak(b, t, p) { const f = 520 * (p \|\| 1); voc(b, t, f * 1.4, f * 0.7, 0.24, 0.12, 1700, 900); },                                   // a guardian got hit` |
| 454 | `tired` | lume |  | `tired(b, t) { voc(b, t, 300, 190, 0.5, 0.07, 700, 450); },` |
| 455 | `duel` | lume |  | `duel(b, t) { [0, 3, 7, 10, 12].forEach((d, i) => marimba(b, mtof(57 + d), t + i * 0.09, 0.3)); osc(b, 'sine', 110, t, 0.3, 0.01, 0.5, { f2: 70 }); },` |
| 456 | `flee` | lume |  | `flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.1, 700 + i * 90, 900 + i * 90, 0.07, 0.08, 1500, 2200); },` |
| 457 | `heal` | personaje | a friend helped a hero up | `heal(b, t) { [0, 4, 7, 12].forEach((d, i) => kalimba(b, mtof(72 + d), t + i * 0.06, 0.2)); chime(b, mtof(91), t + 0.26, 0.1); },                    // a friend  ...` |
| 458 | `grab` | personaje | a bird picks a hero up | `grab(b, t) { osc(b, 'sine', 300, t, 0.3, 0.02, 0.3, { f2: 760, gt: 0.3 }); noise(b, t, 0.12, 0.04, 0.3, 'bandpass', 700, 1900, 1.2); },                 // a bir ...` |
| 459 | `poof` | lume | a small enemy disappears | `poof(b, t) { noise(b, t, 0.22, 0.01, 0.22, 'lowpass', 1400, 300); osc(b, 'sine', 520, t, 0.2, 0.004, 0.16, { f2: 210 }); },                              // a sm ...` |
| 460 | `bird` | lume | a big bird is coming | `bird(b, t) { for (let i = 0; i < 3; i++) osc(b, 'triangle', 1250 - i * 140, t + i * 0.13, 0.09, 0.01, 0.1, { f2: 900 - i * 100, lp: 3200 }); }            // a b ...` |

## Al doilea joc: `fx2`

Cat se joaca "Cea mai grea luptă", efectele de mai jos iau locul celor cu acelasi nume din `fx`. Un nume care nu e in `fx` exista doar in al doilea joc.

Total: 43 efecte.

| Linia | Nume | Grup | Comentariul din cod | Cod |
|---|---|---|---|---|
| 465 | `egg` | personaje | a crystal rings like glass | `egg(b, t, n) { const f = mtof(76 + PENT[(n \|\| 0) % 10]); chime(b, f, t, 0.16); chime(b, f * 1.5, t + 0.05, 0.09); osc(b, 'sine', f * 4, t, 0.03, 0.002, 0.12); } ...` |
| 466 | `star` | personaje |  | `star(b, t) { [0, 7, 12, 19, 24].forEach((d, i) => chime(b, mtof(74 + d), t + i * 0.08, 0.11)); },` |
| 467 | `giant` | personaje |  | `giant(b, t) { [0, 2, 4, 7, 9, 12, 14, 16, 19, 24].forEach((d, i) => { chime(b, mtof(69 + d), t + i * 0.07, 0.12); if (i % 2) kalimba(b, mtof(57 + d), t + i * 0. ...` |
| 468 | `stomp` | personaje | Boon's claws: three quick swishes | `stomp(b, t) { for (let i = 0; i < 3; i++) noise(b, t + i * 0.09, 0.24, 0.015, 0.1, 'bandpass', 900, 2800, 1.4); osc(b, 'sine', 150, t, 0.4, 0.01, 0.4, { f2: 95, ...` |
| 469 | `kick` | personaje | Killer's kick: a springy "boing" | `kick(b, t, p) { const f = 250 + (p \|\| 0) * 70; osc(b, 'sine', f, t, 0.45, 0.004, 0.2, { f2: f * 2.1, gt: 0.12 }); osc(b, 'triangle', f * 1.5, t + 0.02, 0.14, 0. ...` |
| 470 | `plate` | lume | a stone plate clicks, a little bell rings (T7.2) | `plate(b, t) { noise(b, t, 0.2, 0.004, 0.05, 'bandpass', 1400, 3200, 1.2); chime(b, mtof(91), t + 0.03, 0.07); },     // a stone plate clicks, a little bell ring ...` |
| 471 | `bridge` | lume | a plank of light appears: one glass note of a scale (T7.4) | `bridge(b, t, n) { const d = [0, 2, 4, 5, 7, 9, 11][(n \|\| 0) % 7]; chime(b, mtof(79 + d), t, 0.07); osc(b, 'sine', mtof(91 + d), t, 0.02, 0.003, 0.25); },   // a ...` |
| 472 | `crank` | lume | four soft wooden clicks, a little higher each turn (T8) | `crank(b, t, n) { const d = [0, 2, 4, 7][(n \|\| 0) % 4]; for (let i = 0; i < 3; i++) noise(b, t + i * 0.07, 0.1, 0.004, 0.05, 'bandpass', 700 + d * 60, 1800, 1.6) ...` |
| 473 | `raftGo` | lume | the raft moves: soft water | `raftGo(b, t) { noise(b, t, 0.5, 0.05, 0.06, 'bandpass', 420, 640, 0.8); },                                              // the raft moves: soft water` |
| 474 | `boing` | lume | a lily pad springs (T8) | `boing(b, t) { osc(b, 'sine', 330, t, 0.4, 0.004, 0.22, { f2: 760, gt: 0.22 }); osc(b, 'triangle', 660, t + 0.02, 0.2, 0.004, 0.1, { f2: 1180, gt: 0.2, lp: 2200  ...` |
| 475 | `plateOff` | lume | let go: the same bell, lower | `plateOff(b, t) { chime(b, mtof(84), t, 0.06); },                                                                       // let go: the same bell, lower` |
| 476 | `cage` | lume | the lock clicks twice, then a happy arpeggio (T7.2) | `cage(b, t) { noise(b, t, 0.18, 0.004, 0.04, 'bandpass', 1800, 3600, 1.5); noise(b, t + 0.12, 0.18, 0.004, 0.04, 'bandpass', 1800, 3600, 1.5); [0, 4, 7, 12].forE ...` |
| 477 | `bounce` | personaje |  | `bounce(b, t) { osc(b, 'sine', 380, t, 0.15, 0.003, 0.1, { f2: 640, gt: 0.08 }); },` |
| 478 | `bonk` | personaje | a hero shrinks | `bonk(b, t) { osc(b, 'sine', 760, t, 0.4, 0.01, 0.36, { f2: 170, gt: 0.34 }); osc(b, 'triangle', 380, t + 0.03, 0.14, 0.01, 0.3, { f2: 110, lp: 1600 }); },       ...` |
| 479 | `heal` | personaje | a hero grows back | `heal(b, t) { osc(b, 'sine', 180, t, 0.36, 0.01, 0.34, { f2: 760, gt: 0.3 }); [0, 7, 12].forEach((d, i) => chime(b, mtof(79 + d), t + 0.24 + i * 0.06, 0.1)); },  ...` |
| 480 | `drop` | personaje |  | `drop(b, t) { chime(b, mtof(84), t, 0.1); chime(b, mtof(79), t + 0.08, 0.09); chime(b, mtof(72), t + 0.16, 0.08); },` |
| 481 | `squelch` | personaje |  | `squelch(b, t) { noise(b, t, 0.18, 0.015, 0.14, 'lowpass', 800, 260); osc(b, 'sine', 190, t, 0.18, 0.01, 0.12, { f2: 120 }); },` |
| 482 | `step` | personaje |  | `step(b, t, x) {` |
| 487 | `wake` | lume | a robot switches on: beep-beep | `wake(b, t) { osc(b, 'triangle', 880, t, 0.16, 0.004, 0.09, { lp: 2800 }); osc(b, 'triangle', 1175, t + 0.13, 0.16, 0.004, 0.12, { lp: 2800 }); },                ...` |
| 488 | `stun` | lume | a robot runs down | `stun(b, t) { osc(b, 'triangle', 880, t, 0.16, 0.004, 0.34, { f2: 220, gt: 0.32, lp: 2600 }); },                                                                  ...` |
| 489 | `poof` | lume |  | `poof(b, t) { noise(b, t, 0.2, 0.01, 0.22, 'lowpass', 1400, 300); [988, 740, 494].forEach((f, i) => osc(b, 'triangle', f, t + i * 0.07, 0.1, 0.004, 0.07, { lp: 2 ...` |
| 490 | `caw` | lume | George's roar: low and warm, never harsh | `caw(b, t) { growl(b, t, 150, 88, 0.75, 0.42, 21); },                                                                                                             ...` |
| 491 | `pop` | lume |  | `pop(b, t) { osc(b, 'sine', 520, t, 0.22, 0.003, 0.12, { f2: 940, gt: 0.1 }); },` |
| 492 | `rustle` | lume |  | `rustle(b, t) { noise(b, t, 0.3, 0.02, 0.45, 'lowpass', 420, 150); },` |
| 493 | `butterfly` | lume | the rocket | `butterfly(b, t) { noise(b, t, 0.22, 0.05, 0.6, 'bandpass', 400, 2600, 1.1); osc(b, 'sine', 220, t, 0.2, 0.03, 0.55, { f2: 990, gt: 0.5 }); },                    ...` |
| 494 | `wave` | lume |  | `wave(b, t) { [0, 3, 7, 10].forEach((d, i) => marimba(b, mtof(62 + d), t + i * 0.11, 0.28)); chime(b, mtof(86), t + 0.44, 0.1); },` |
| 495 | `win` | lume |  | `win(b, t) { [0, 5, 7, 12, 7, 12, 17, 19, 24].forEach((d, i) => { marimba(b, mtof(62 + d), t + i * 0.12, 0.3); if (i % 2 === 0) chime(b, mtof(86 + d), t + i * 0. ...` |
| 496 | `lantern` | lume | a torch catches fire | `lantern(b, t) { noise(b, t, 0.2, 0.02, 0.28, 'lowpass', 1100, 320); osc(b, 'sine', 330, t, 0.1, 0.01, 0.2, { f2: 210 }); },                                      ...` |
| 497 | `warn` | lume |  | `warn(b, t) { osc(b, 'triangle', 392, t, 0.2, 0.005, 0.12, { lp: 1800 }); osc(b, 'triangle', 392, t + 0.16, 0.2, 0.005, 0.12, { lp: 1800 }); },` |
| 498 | `tonk` | lume |  | `tonk(b, t) { osc(b, 'triangle', 660, t, 0.2, 0.002, 0.08, { f2: 540, lp: 2400 }); osc(b, 'sine', 1320, t, 0.05, 0.002, 0.05); },` |
| 499 | `squeak` | lume | George got hit | `squeak(b, t, p) { const f = 300 * (p \|\| 1); voc(b, t, f * 1.3, f * 0.7, 0.28, 0.13, 1000, 600); },                                                               ...` |
| 500 | `tired` | lume |  | `tired(b, t) { growl(b, t, 130, 80, 0.5, 0.2, 9); },` |
| 501 | `duel` | lume |  | `duel(b, t) { [0, 0, 3].forEach((d, i) => marimba(b, mtof(50 + d), t + i * 0.14, 0.32)); growl(b, t + 0.35, 150, 90, 0.7, 0.4, 21); },` |
| 502 | `flee` | lume |  | `flee(b, t) { for (let i = 0; i < 5; i++) voc(b, t + i * 0.11, 520 - i * 50, 380 - i * 40, 0.08, 0.09, 1200, 800); },` |
| 503 | `goal` | lume |  | `goal(b, t) { [0, 7, 12, 17].forEach((d, i) => marimba(b, mtof(64 + d), t + i * 0.08, 0.34)); chime(b, mtof(88), t + 0.3, 0.12); },` |
| 504 | `dash` | personaje | starting to run: a short soft "whoosh" going up | `dash(b, t) { noise(b, t, 0.16, 0.015, 0.17, 'bandpass', 500, 2100, 1.1); osc(b, 'sine', 330, t, 0.1, 0.01, 0.16, { f2: 760, gt: 0.14 }); },      // starting to  ...` |
| 506 | `bone` | personaje |  | `bone(b, t, v) { for (let i = 0; i < 3; i++) osc(b, 'triangle', 180 - i * 20, t + i * 0.055, 0.12 + (v \|\| 0) * 0.05, 0.008, 0.09, { f2: 140 - i * 14, gt: 0.08, t ...` |
| 507 | `tock` | personaje |  | `tock(b, t) { osc(b, 'sine', 520, t, 0.16, 0.004, 0.06, { f2: 430, gt: 0.05 }); noise(b, t, 0.07, 0.002, 0.03, 'bandpass', 1500, 900, 2.2); },` |
| 509 | `gloves` | personaje |  | `gloves(b, t) { for (let i = 0; i < 2; i++) noise(b, t + i * 0.12, 0.14, 0.012, 0.13, 'bandpass', 500, 1400, 1.2); osc(b, 'sine', 900, t + 0.1, 0.09, 0.01, 0.08, ...` |
| 511 | `tick` | lume |  | `tick(b, t, v) { osc(b, 'sine', v > 0.5 ? 880 : 660, t, 0.14, 0.004, 0.05, { f2: v > 0.5 ? 760 : 580, gt: 0.04 }); },` |
| 513 | `click` | lume |  | `click(b, t) { osc(b, 'triangle', 1250, t, 0.12, 0.002, 0.045, { f2: 900, gt: 0.04 }); noise(b, t, 0.04, 0.001, 0.05, 'bandpass', 2600, 1800, 2.0); },` |
| 515 | `gateOpen` | lume |  | `gateOpen(b, t) { [0, 4, 7, 12].forEach((d, i) => marimba(b, mtof(60 + d), t + 0.06 + i * 0.09, 0.26)); noise(b, t, 0.5, 0.08, 0.45, 'lowpass', 700, 260); chime( ...` |
| 516 | `retry` | lume |  | `retry(b, t) { [72, 67, 64].forEach((n, i) => marimba(b, mtof(n), t + i * 0.16, 0.3)); chime(b, mtof(79), t + 0.42, 0.1); }` |
