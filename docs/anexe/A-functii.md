<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa A. Toate functiile

Fiecare functie, functie sageata si metoda din cod, in ordinea din fisier. Coloana "Comentariul din cod" este textul scris chiar langa functie. Explicatiile pe larg sunt in capitolele din docs/.

Total: 612 intrari.

## 01-config.js

Nicio functie.

## 015-lang.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 8 | `isLupta()` | functie sageata |  |
| 12 | `applyGameConfig()` | functie | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 15 | `TG(id, k, ...a)` | functie | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 26 | `playerOf(k)` | functie sageata | which player (0 or 1) plays hero k |
| 215 | `T(k, a, b)` | functie | T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments. In the second game a text with the key 'L:key' takes the place of 'key' (its own title, its own words for crystals...). |
| 223 | `lvlName(def)` | functie sageata | {0} = how many goals the boss needs |
| 224 | `eggWord(n)` | functie sageata |  |
| 226 | `keyName(code)` | functie | Readable name of a keyboard key, for the "choose the keys" screen. |

## 02-core.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 8 | `clamp(v, a, b)` | functie sageata |  |
| 9 | `lerp(a, b, t)` | functie sageata |  |
| 10 | `dist(ax, ay, bx, by)` | functie sageata |  |
| 11 | `ease(t)` | functie sageata |  |
| 12 | `easeOut(t)` | functie sageata |  |
| 15 | `easeBack(t)` | functie sageata | easeBack (T6.9): goes to 1, goes past it by 8% and comes back. t in 0..1 -> 0..1.08..1. A bridge, a gate or a raft that stops "with weight" uses it instead of easeOut. (The overshoot of 1 + (c+1)(t-1)^3 + c(t-1)^2 is 1 + c*s^2/3 with s = 2c/(3(c+1)): 8% for c = 1.5.) |
| 19 | `mechMove(t, dur, pull)` | functie | The way of a mechanism (a bridge, a gate, a raft) as a fraction: first it pulls back by `pull` (6%) for CONFIG.look.anticipate seconds (0.15), then it goes to 1 in `dur` seconds with easeBack (it passes 1 by 8% and settles). t = seconds since it was told to move. 0 at the start, -pull at the end of the pull-back, 1 at the end. |
| 26 | `rng(seed)` | functie | small seeded random generator |
| 35 | `hash(s, i)` | functie sageata |  |
| 38 | `hex(h)` | functie |  |
| 43 | `rgba(h, a)` | functie |  |
| 44 | `mix(h1, h2, t)` | functie |  |
| 49 | `shade(h, t)` | functie sageata | darker = toward warm violet, lighter = toward cream. Never gray or black. |
| 60 | `blobPath(c, x, y, rx, ry, seed, wob, n)` | functie |  |
| 76 | `wash(c, x, y, rx, ry, col, o)` | functie | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 95 | `puff(c, x, y, rx, ry, fill, seed, edge, wob)` | functie | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 100 | `soft(c, x, y, rx, ry, col, alpha, seed)` | functie |  |
| 134 | `lit(c, path, col, o)` | functie | ---- One object with volume, in the new look (docs/24-sisteme-noi.md, S7.1) ---- Five layers, always in this order: the cast shadow that glues the object to the ground, the dark contact line under it, the shape itself with a gradient, the rim light that lifts it off the background, and a gloss spot on shiny materials. Every painter of the new look goes through here, so the one light (KEY from the upper left, FILL from the lower right) falls the same way on everything. c the context path a function (c) that builds the contour: one closed path. It is called a few times col the color of the object o x, y where the object stands on the ground: the middle of its base w, h how wide and how tall it is. The shadow and the gradient are built from these gloss 0 to 1, how shiny the material is. 0 = no gloss spot at all. Left out: the gloss of the material mat the name of a material (see MATERIALS below), or a painter (c, o, path) of your own. It is called inside the shape, over the gradient, and cut to the contour seed for the hand-painted wobble of the gloss spot shadow false = no cast shadow (things that do not stand on the ground: a thrown bone, a cloud, a part of a hero: the hero has one shadow of his own, castShadow()) rim how wide the rim light is (5 when left out). Small parts (a leg, a finger) need a thinner one, or the two rims cover the whole part rimA how strong the rim light is, 0 to 1 (1 when left out). The many parts of a hero take less, or every leg and finger gets a pale outline lite true = only the gradient (and the gloss): no clip, no material, no rim light. For the many small parts of a hero (a leg, an arm, a sleeve): the clip and the two rims cost more than the whole old painter, and on a part a few pixels wide they show nothing flip -1 when the painter has mirrored the drawing (c.scale(-1, 1)). Left out: read from the transform. The light must stay on the upper left of the screen, whichever way a hero looks The rim light is painted by stroking the same path a little moved, inside the clip of the shape: moved down-right it shows along the upper-left edge (KEY), moved up-left along the lower-right one (FILL). No createRadialGradient, no createPattern, no shadowBlur: this runs on every frame (S7.7). |
| 156 | `litGloss(c, x, y, w, h, gloss, seed, fl)` | functie |  |
| 171 | `castShadow(c, x, y, w, h, seed, k)` | functie | The two shadows of S7.1 for anything that stands on the ground (lit() uses them, and so does every hero, who is made of many parts but has one shadow). x, y = the middle of the base, w, h = how wide and tall the thing is. h only decides how far to the lower right the shadow falls: a hero passes less than his height, so his shadow starts at his feet instead of lying beside him. k (0 to 1) = how strong: a hero in the air has a smaller, paler shadow and no contact line. 1. cast shadow: pushed to the lower right because the light comes from the upper left, and flattened. 2. contact shadow: the short dark line right under the base, so the object does not float. |
| 196 | `matOf(m)` | functie |  |
| 204 | `matPattern(key, w, h, paint)` | functie | The pattern of a tile of w x h units. sprite() paints at double size, so the pattern is shrunk by half to be w x h again. |
| 217 | `matFill(c, pat, o, alpha, part)` | functie | Fills the box of the shape with a pattern. part 'back' = only its left half: the back of a hero, who faces right (the painters flip the whole hero, so "left" is always the back). |
| 225 | `paintScaleTile(c)` | functie | scale: little half circles in rows that are shifted by half a scale. The tile repeats without a seam (every scale is also drawn one tile away) |
| 234 | `paint(c, o)` | metoda |  |
| 242 | `paintWeaveTile(c)` | functie | fabric: a very fine weave (lines that cross) and, 4 units inside the edge, a line of stitches |
| 248 | `paint(c, o, path)` | metoda |  |
| 264 | `paint(c, o)` | metoda |  |
| 275 | `paintPoreTile(c)` | functie | bone: almost smooth. A few small pores, and one crack with a pale edge beside it. The tile is big (64 x 64) and the pores sit at random, in lone ones and in little groups: a small tile repeats like a grid |
| 286 | `paint(c, o)` | metoda |  |
| 302 | `paintGrainTile(c)` | functie | wood: long grain lines that wiggle a little, a couple of knots, and lighter plank ends |
| 313 | `paint(c, o)` | metoda |  |
| 330 | `paintScratchTile(c)` | functie | metal: bands of light (light, dark, light), little rivets with a shadow, and fine pale scratches |
| 339 | `paint(c, o)` | metoda |  |
| 356 | `paintBlotchTile(c)` | functie | stone: big irregular blotches in two tones, cracks, and moss low down |
| 366 | `paint(c, o)` | metoda |  |
| 386 | `paint(c, o)` | metoda |  |
| 388 | `pt(i)` | functie sageata |  |
| 404 | `paint(c, o, path)` | metoda |  |
| 422 | `paint(c, o)` | metoda |  |
| 443 | `paintWaveTile(c)` | functie | two thin wavy lines; each makes whole turns across the tile, so it repeats without a seam |
| 455 | `fillWaves(c, path, t, sa, sb)` | functie | The two rows of waves over the shape `path` (a Path2D in the same coordinates). The pattern is made once (matPattern); a frame only moves it (setTransform): no createPattern while drawing. |
| 465 | `paint(c, o, path)` | metoda |  |
| 476 | `brushLine(c, pts, width, col, alpha, seed)` | functie | A wobbly brush line through points. |
| 490 | `makeCanvas(w, h)` | functie |  |
| 493 | `topColor(cv)` | functie | The colour of the very first pixel of a painting: the sky at the top. Used to fill the strip above the world when the camera looks a little higher than the painting goes (docs/24-sisteme-noi.md, S6). |
| 500 | `makePaper()` | functie |  |
| 507 | `samp(arr, w, u, v)` | functie sageata |  |
| 532 | `makeOverlay(tint, tintA, vig, night)` | functie | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 548 | `skyCols(t)` | functie |  |
| 556 | `paintSky(c, x, y, w, h, t, seed, o)` | functie |  |
| 582 | `paintNightSky(c, x, y, w, h, seed, o)` | functie | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 607 | `paintMountains(c, x, yBase, w, hgt, seed)` | functie | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 623 | `paintHills(c, x, yBase, w, hgt, t, seed, cols, night)` | functie | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 642 | `setFont(c, size, title, weight)` | functie | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 645 | `text(c, str, x, y, size, col, o)` | functie |  |
| 658 | `wrapLines(c, str, maxW, size, title)` | functie |  |
| 670 | `iconX(c, x, y, r, pulse)` | functie | The ✕ button as a painted icon (blue cross on a cream disc). |
| 680 | `iconSq(c, x, y, r, pulse)` | functie | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 690 | `iconL1(c, x, y, r, pulse)` | functie | L1: give an egg to the friend. A cream disc with a lilac rim and the letters L1 (the shoulder button). |
| 701 | `iconO(c, x, y, r, pulse)` | functie | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 711 | `iconL3(c, x, y, r, t)` | functie | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 725 | `richText(c, str, x, y, size, col, o)` | functie |  |
| 739 | `starPath(c, x, y, r, rot)` | functie |  |
| 750 | `sprite(key, w, h, paint)` | functie | Things that never change are painted once and then stamped: much faster per frame. |
| 755 | `card(c, x, y, w, h, col, seed)` | functie |  |
| 760 | `paintCard(c, x, y, w, h, col, seed)` | functie |  |
| 763 | `p(dx, dy, sc, fill, a)` | functie sageata |  |

## 03-audio.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 6 | `Snd(()` | functie sageata | SOUND: everything is generated with the Web Audio API. Sine and triangle waves, low-pass filters, a soft generated reverb. |
| 14 | `mtof(m)` | functie sageata |  |
| 18 | `toSpeaker(a, node)` | functie | The last thing before any speaker: a limiter. A loud word, a stomp and the music at the same moment would otherwise go over what a speaker can play and sound harsh (clipping). Measured by tests/sunete-limita.js. |
| 24 | `init()` | functie |  |
| 38 | `send(bus, g)` | functie sageata |  |
| 41 | `bed(type, f, q)` | functie sageata | two soft noise beds for the ambience: water and wind |
| 46 | `nbuf(c)` | functie |  |
| 51 | `impulse(sec)` | functie | soft room: decaying, low-passed noise |
| 59 | `applyVol()` | functie |  |
| 66 | `applyAmb()` | functie |  |
| 74 | `smallUp(bus, f)` | functie sageata | A controller's speaker is tiny: it cannot play low notes. On such a speaker (bus.small) anything low goes one or two octaves up. |
| 75 | `osc(bus, type, f, t, g, att, dec, o)` | functie |  |
| 93 | `noise(bus, t, g, att, dec, type, f, f2, q)` | functie |  |
| 104 | `voc(bus, t, f0, f1, dur, g, m0, m1)` | functie | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 118 | `growl(bus, t, f0, f1, dur, g, rate)` | functie | A soft roar or growl: a low triangle that slides down, with a quick tremble (the "rrr"). Warm, never harsh. |
| 131 | `kalimba(bus, f, t, g)` | functie sageata | Bubu speaks low and round, Leo higher and brighter. ---- instruments --------------------------------------------------------- |
| 132 | `marimba(bus, f, t, g)` | functie sageata |  |
| 133 | `chime(bus, f, t, g)` | functie sageata |  |
| 134 | `flute(bus, f, t, dur, g)` | functie |  |
| 172 | `setKey(key)` | functie sageata | the name of a tune or of an ambience in the game being played |
| 173 | `makeSong(p)` | functie |  |
| 175 | `motif()` | functie sageata |  |
| 187 | `deg(p, d)` | functie sageata |  |
| 188 | `schedule(st, t)` | functie |  |
| 205 | `tick()` | functie |  |
| 230 | `ambience(key)` | functie |  |
| 231 | `music(key)` | functie |  |
| 336 | `syl(b, t, k, s, V)` | functie | One syllable. Two triangle waves (the note and its octave) go through two "mouth" filters; a little of the plain note keeps the tune clear. Loud enough to be heard next to the other sounds, also in a controller's small speaker. |
| 354 | `talk(k, key)` | functie | Talk(k, word): hero k says one of its words. Routed like the hero's other sounds (own speaker when one was chosen). |
| 372 | `egg(b, t, n)` | metoda | --- the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) --- |
| 373 | `give(b, t)` | metoda | an egg leaves: two warm marimba notes, going up |
| 374 | `star(b, t)` | metoda |  |
| 375 | `giant(b, t)` | metoda |  |
| 376 | `stomp(b, t)` | metoda |  |
| 377 | `kick(b, t, p)` | metoda |  |
| 378 | `bounce(b, t)` | metoda |  |
| 379 | `bonk(b, t)` | metoda |  |
| 380 | `drop(b, t)` | metoda |  |
| 381 | `squelch(b, t)` | metoda |  |
| 382 | `step(b, t, x)` | metoda | x = hero * 2 + (left or right foot) |
| 388 | `wake(b, t)` | metoda | --- the world (volume "Sunete ambientale") --- |
| 389 | `stun(b, t)` | metoda |  |
| 390 | `pop(b, t)` | metoda |  |
| 391 | `rustle(b, t)` | metoda |  |
| 392 | `butterfly(b, t)` | metoda |  |
| 393 | `wave(b, t)` | metoda |  |
| 394 | `win(b, t)` | metoda |  |
| 395 | `caw(b, t)` | metoda |  |
| 396 | `whoosh(b, t)` | metoda |  |
| 397 | `swish(b, t)` | metoda |  |
| 398 | `lantern(b, t)` | metoda |  |
| 399 | `firework(b, t)` | metoda |  |
| 400 | `ui(b, t)` | metoda |  |
| 401 | `no(b, t)` | metoda |  |
| 402 | `ok(b, t)` | metoda |  |
| 403 | `thud(b, t)` | metoda |  |
| 404 | `goal(b, t)` | metoda |  |
| 405 | `crack(b, t)` | metoda |  |
| 406 | `splash(b, t)` | metoda |  |
| 407 | `tonk(b, t)` | metoda | the ball bounces off a guardian that is not tired yet |
| 408 | `warn(b, t)` | metoda | a guardian gets ready to attack |
| 409 | `squeak(b, t, p)` | metoda | a guardian got hit |
| 410 | `tired(b, t)` | metoda |  |
| 411 | `duel(b, t)` | metoda |  |
| 412 | `flee(b, t)` | metoda |  |
| 413 | `heal(b, t)` | metoda | a friend helped a hero up |
| 414 | `grab(b, t)` | metoda | a bird picks a hero up |
| 415 | `poof(b, t)` | metoda | a small enemy disappears |
| 416 | `bird(b, t)` | metoda | a big bird is coming |
| 421 | `egg(b, t, n)` | metoda | a crystal rings like glass |
| 422 | `star(b, t)` | metoda |  |
| 423 | `giant(b, t)` | metoda |  |
| 424 | `stomp(b, t)` | metoda | Boon's claws: three quick swishes |
| 425 | `kick(b, t, p)` | metoda | Killer's kick: a springy "boing" |
| 426 | `bounce(b, t)` | metoda |  |
| 427 | `bonk(b, t)` | metoda | a hero shrinks |
| 428 | `heal(b, t)` | metoda | a hero grows back |
| 429 | `drop(b, t)` | metoda |  |
| 430 | `squelch(b, t)` | metoda |  |
| 431 | `step(b, t, x)` | metoda |  |
| 436 | `wake(b, t)` | metoda | a robot switches on: beep-beep |
| 437 | `stun(b, t)` | metoda | a robot runs down |
| 438 | `poof(b, t)` | metoda |  |
| 439 | `caw(b, t)` | metoda | George's roar: low and warm, never harsh |
| 440 | `pop(b, t)` | metoda |  |
| 441 | `rustle(b, t)` | metoda |  |
| 442 | `butterfly(b, t)` | metoda | the rocket |
| 443 | `wave(b, t)` | metoda |  |
| 444 | `win(b, t)` | metoda |  |
| 445 | `lantern(b, t)` | metoda | a torch catches fire |
| 446 | `warn(b, t)` | metoda |  |
| 447 | `tonk(b, t)` | metoda |  |
| 448 | `squeak(b, t, p)` | metoda | George got hit |
| 449 | `tired(b, t)` | metoda |  |
| 450 | `duel(b, t)` | metoda |  |
| 451 | `flee(b, t)` | metoda |  |
| 452 | `goal(b, t)` | metoda |  |
| 453 | `dash(b, t)` | metoda | starting to run: a short soft "whoosh" going up |
| 455 | `bone(b, t, v)` | metoda | Boon throws the bones: three low "fup-fup-fup" with a tremble, and the bones knocking on a wall: a warm wooden "tock" |
| 456 | `tock(b, t)` | metoda |  |
| 458 | `gloves(b, t)` | metoda | Killer's whirl gloves: two "fuip" going up and a soft rubbery squeak |
| 460 | `tick(b, t, v)` | metoda | The ten seconds: a soft wooden knock every second (higher in the last three), and the three kind notes of "Încă o dată!" |
| 462 | `click(b, t)` | metoda | a mechanism clicks before it moves (T6.9): a short soft wooden "tic" with a spark of air |
| 463 | `retry(b, t)` | metoda |  |
| 470 | `play(name, arg, k, vol)` | functie | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 481 | `canSink()` | functie sageata | ---- the controller's own speaker (only when the system shows it as an audio output) ---- |
| 483 | `listOutputs(ask)` | functie | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 492 | `setSink(k, dev)` | functie | dev = { id, label } or null for the computer's speakers |
| 512 | `swapOuts()` | functie |  |
| 518 | `setVol(k, v)` | metoda |  |
| 519 | `setDuck(d)` | metoda |  |
| 526 | `init()` | metoda |  |
| 531 | `pick()` | metoda |  |
| 537 | `say(txt, keep)` | metoda |  |
| 552 | `stop()` | metoda |  |

## 04-input.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 10 | `Input(()` | functie sageata | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) or the keyboard. ✕ (button 0) = first power, ○ (button 1) = help the friend, □ (button 2) = second power, L3 (button 10, pressing the left stick) = run. Each hero is played with what was chosen in Setări: a controller ('pad') or the keyboard ('kb') with its own keys. Menus listen to everything: every controller, the arrow keys, Enter, Space, Backspace and the players' own keys. |
| 12 | `kd(code)` | functie sageata |  |
| 13 | `mk()` | functie sageata |  |
| 36 | `pads()` | functie |  |
| 41 | `assigned(i)` | functie |  |
| 42 | `freeSlot()` | functie | the hero a newly pressed controller will play |
| 49 | `poll(dt)` | functie |  |
| 56 | `b(n)` | functie sageata |  |
| 77 | `b(n)` | functie sageata |  |
| 134 | `rumble(k, strong, weak, ms, force)` | functie | returns false when this controller cannot vibrate |
| 147 | `setCtrl(k, kind)` | functie | Settings: play hero k with a controller or with the keyboard. |
| 152 | `unbind(k)` | functie |  |
| 153 | `swap()` | functie | the two players trade heroes: controllers go with the players |
| 160 | `capture(f)` | metoda |  |
| 161 | `muteHeld()` | metoda |  |
| 162 | `any(f)` | metoda |  |
| 163 | `padCount()` | metoda |  |

## 05-chars.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 6 | `drawEye(c, x, y, r, o, look)` | functie | CHARACTERS AND THINGS: all drawn with canvas shapes, picture-book style. Every draw function takes the feet position (x, y) in the current transform. |
| 28 | `drawBubu(c, x, y, o)` | functie | BUBU: round baby triceratops, orange with green spots and a tiny red scarf. |
| 59 | `horn(hx, hy, w, h, rot)` | functie sageata | horns |
| 72 | `drawLeo(c, x, y, o)` | functie | LEO: young footballer, yellow shirt, blue shorts, red headband. |
| 79 | `leg(lx, lift, fwd, seed)` | functie sageata | legs: sock + shoe |
| 90 | `arm(ax, sw, seed)` | functie sageata | arms |
| 119 | `drawBall(c, x, y, r, spin)` | functie | The football: cream with terracotta patches (Leo). In the second game Killer has his own ball: white with hexagons. |
| 133 | `drawCiori(c, x, y, o)` | functie | CIORI: a mischievous plum-colored crow. mood: cheeky \| dizzy \| sorry \| happy |
| 165 | `paintBeetleBody(c, b, t)` | functie | Grumpy sleepy beetle. state: sleep \| wake \| chase \| return \| stun \| knock |
| 185 | `drawBeetle(c, b, t)` | functie |  |
| 208 | `drawCone(c, x, y, rot, r, z)` | functie |  |
| 225 | `eggPath(c, r)` | functie |  |
| 234 | `drawEgg(c, x, y, r, t, seed, z, hue, big)` | functie | The thing the heroes gather: a golden egg in the first game, a rainbow crystal (or the secret star) in the second. |
| 239 | `itemPath(c, r)` | functie sageata | the small egg (or crystal) shape used by the HUD and the progress bar |
| 240 | `drawGoldEgg(c, x, y, r, t, seed, z)` | functie |  |
| 258 | `drawStar(c, x, y, r, t, z)` | functie |  |
| 275 | `drawButterfly(c, x, y, t, s)` | functie | The helper that makes both heroes fast for a moment: a butterfly in the first game, a little rocket in the second. |
| 292 | `drawNest(c, x, y, r, seed, glow)` | functie | A woven nest seen from above. |
| 309 | `iconArrow(c, x, y, ang, size, col)` | functie | Small painted icons for hints (no words needed). |
| 316 | `iconStick(c, x, y, r, t)` | functie | left stick: four little arrows and a wiggling cap |
| 322 | `drawDizzyStars(c, x, y, t)` | functie |  |
| 330 | `drawHero(c, k, x, y, o)` | functie | The two heroes of the game being played: Bubu and Leo, or Boon and Killer. |
| 335 | `drawSleeper(c, b, t)` | functie | The small enemy that sleeps and wakes up: a beetle, or one of George's robots. |
| 341 | `drawRoller(c, o, x, y, t)` | functie | The small enemy that comes down a lane: a rolling pinecone, or a sticky snail. |

## 055-lupta.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 12 | `tube(c, x0, y0, cx, cy, x1, y1, r0, r1, col, col2)` | functie | A soft tapered tube along a curve: tails, necks, arms, legs. |
| 19 | `clawTips(c, x, y, ang, len, n, col)` | functie | n little pointed claws fanning out from (x, y) |
| 38 | `tubeSamples(segs)` | functie |  |
| 56 | `tubePath(c)` | functie | the contour of the last tubeSamples(): one side, a round end, the other side, a round start |
| 66 | `partRim(r)` | functie sageata | a thin part gets a thin rim light, or the two rims would cover it |
| 73 | `litTube(c, segs, col, o)` | functie | A tube in the new look. o.col2: the tube turns into this colour toward its end. o.grad: [[stop, colour], ...] along the tube, for a tail that changes colour on the way (George's: green, then blue). |
| 89 | `litPuff(c, x, y, rx, ry, seed, col, o)` | functie | A round part (body, head, boot) in the new look: the same blob as puff(). |
| 95 | `litClaws(c, x, y, ang, len, n, col)` | functie | Claws: little pointed triangles, all in one contour. Long claws (the power is on) go through lit() in bone; the small ones get only the light's gradient: a rim and a texture on a claw of a few pixels cost a lot and show nothing. |
| 96 | `path(cc)` | functie sageata |  |
| 109 | `litTeeth(c, pts, col)` | functie | pts: [x0, base y, tip y, width] for every tooth |
| 110 | `path(cc)` | functie sageata |  |
| 120 | `tailStep(T, target, dt)` | functie | The tail: a spring with two joints (docs/24-sisteme-noi.md, S7.3). T = [a1, v1, a2, v2]: a1 = how much the whole tail is lifted (radians, + = up), a2 = how much its second half bends on top of that. a1 goes to the target with a little swing; a2 is pushed the other way by a1's speeding up, so the tip comes after the base. Small substeps keep it steady at 30 frames a second. When the target is 0 and everything is tiny, it is set to exactly 0: a hero standing still does not tremble. |
| 133 | `tailFollow(obj, x, t, speed)` | functie | The same spring for George, who has no update of his own for it: it is stepped while he is drawn, from how far he moved since the last frame. obj = the boss or the duel, where the spring is kept. |
| 141 | `rotPt(out, i, x, y, cx, cy, a)` | functie | Rotates the point (x, y) around (cx, cy) by a, into out[i], out[i + 1]. |
| 145 | `blinkOn(t, seed)` | functie | A blink every blinkMin to blinkMax seconds, at random, without keeping any state: time is cut into windows of (min + max) / 2 seconds and every window has its blink at a random moment of its first (max - min) / 2 seconds, so two blinks are always between min and max apart. seed: each character blinks on his own. |
| 152 | `eyeLit(c, x, y, r, o, look, seed)` | functie | An eye in the new look: two gleams that follow the light (a big one up-left, a small one down-right, on the screen, whichever way the hero looks) and a soft shadow under the upper lid. Closed, happy or dizzy: the old eye. |
| 172 | `sewNumber(c, str, x, y, size, ink, patch)` | functie | Killer's 10, "sewn on": a patch around the digits and a dotted cream stitch just outside them. |
| 184 | `drawBoon(c, x, y, o)` | functie | BOON: the little one's hero. Round teal body, a dome of blue spikes on the back, long tan neck, small blue head, lime legs and a long lime tail. o.claw (0 to 1) = the claws are out and spinning. |
| 198 | `leg(lx, lift, fwd, sd)` | functie sageata | legs with little claws |
| 234 | `drawKiller(c, x, y, o)` | functie | KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. |
| 242 | `leg(lx, lift, fwd, seed)` | functie sageata | legs in blue, big red rubber boots |
| 252 | `arm(sd, sw)` | functie sageata |  |
| 286 | `drawBallL(c, x, y, r, spin)` | functie | Killer's ball, like in the drawing: white, with hexagons. |
| 305 | `drawGeorge(c, x, y, o)` | functie | GEORGE CEL RĂU: a carnotaurus with a crown. Pink body, a head in rainbow colors with a blue snout full of teeth, a striped horn-crown, thin brown legs and arms, a tail that turns from green to blue. mood: calm \| angry \| dizzy \| scared |
| 361 | `drawGeorgeCrown(c, x, y, s, rot)` | functie |  |
| 373 | `paintRobotBody(c, b, t)` | functie | One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. |
| 391 | `drawRobot(c, b, t)` | functie |  |
| 411 | `drawMiniGeorge(c, b, t)` | functie | Little George (T15): George, small, in other colors (green and blue instead of pink and brown). He follows the nearest hero and never hits. Painted once per walk frame into a sprite (the colors come from a hue filter, applied only then), so a frame costs one drawImage. |
| 426 | `drawSnail(c, x, y, t, o)` | functie | A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. |
| 451 | `drawBird(c, x, y, o)` | functie | A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. |
| 470 | `gemPath(c, r)` | functie | A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. |
| 473 | `drawCrystal(c, x, y, r, t, seed, z, hue)` | functie |  |
| 494 | `drawSecretStar(c, x, y, r, t, z)` | functie | The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. |
| 506 | `drawRocket(c, x, y, t, s)` | functie | The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. |
| 520 | `drawRockProj(c, x, y, rot, r)` | functie | Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). |
| 525 | `drawSpear(c, x, y, ang, s)` | functie |  |
| 533 | `drawSoldier(c, so, t)` | functie | One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. |
| 553 | `drawGlove(c, x, y, r, sd, t)` | functie | One goalkeeper glove: red, white palm, a blue star in the palm. sd = which side it points to. |
| 566 | `drawBone(c, x, y, r, spin)` | functie | Boon's boomerang bone: two round ends and a shaft, cream amber, with a small crack. |
| 579 | `drawThrown(c, x, y, r, spin, look)` | functie | What a thrown thing looks like: Killer's and Leo's ball, or Boon's bone. |

## 06-level.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 70 | `levelCount(id)` | functie sageata |  |
| 71 | `levelDefs()` | functie sageata |  |
| 72 | `levelDef(idx)` | functie sageata |  |
| 77 | `skyTOf(idx)` | functie sageata | the sky goes from afternoon to dusk over the levels. In the second game it is always counted over 6 levels: Part Two has its own colors |
| 84 | `chapters(id)` | functie | The chapters of a game, in order: every level and every big fight. This is what "Continue", the Chapters screen and the save count in. Game.levelIdx is the index of a chapter; L.idx is still the number of the level (0-based) inside it. first game: levels 1 - 6, then the fight with Ciori (7 chapters) second game: levels 1 - 6, George's Arena, then the levels of Part Two (7 chapters now, 14 when Part Two is made) The Throne Hall, the last fight of Part Two, is added after the Part Two levels when it exists (task T11). |
| 94 | `chapterLabel(i, id)` | functie | how a chapter is named in "Continue: ...": "Level 3", or the name of the big fight |
| 99 | `levelsBefore(i, id)` | functie sageata | how many levels (not fights) come before chapter i: used for "stars found / stars there are" |
| 101 | `spline(pts, stepLen)` | functie | Catmull-Rom through points, resampled evenly |
| 124 | `quotaOf(idx)` | functie |  |
| 135 | `levelDurationOf(L)` | functie | How long a level lasts (seconds): the sun, the medal and the help in updatePlay read this, not CONFIG.levelDuration. |
| 140 | `genLevel(idx, seed)` | functie |  |
| 149 | `inW(cx, cy)` | functie sageata |  |
| 150 | `ci(x, y)` | functie sageata |  |
| 151 | `mark(x, y, rad, bits)` | functie sageata |  |
| 155 | `region(k)` | functie sageata |  |
| 156 | `dv(arr, k)` | functie sageata |  |
| 157 | `starRegion(i)` | functie sageata |  |
| 173 | `pathDist(x, y)` | functie sageata |  |
| 178 | `setWater(cx, cy)` | functie sageata | ---- water ---------------------------------------------------------------- |
| 200 | `crossing(by, list)` | functie sageata |  |
| 211 | `pathFar(x, y, d)` | functie sageata |  |
| 212 | `areaClear(x, y, rad)` | functie sageata |  |
| 219 | `addSolid(x, y, rad, kind, extra)` | functie sageata |  |
| 220 | `mudEllipse(x, y, rx, ry)` | functie sageata |  |
| 310 | `spotFree(x, y, rad)` | functie sageata | ---- trees, rocks, haystacks ---------------------------------------------- |
| 318 | `scatter(count, rmin, rmax, kind, gap)` | functie sageata |  |
| 360 | `reachCells(x, y, r0, r1, bits)` | functie sageata |  |
| 368 | `shuffle(a)` | functie sageata |  |
| 371 | `addBeetle(x, y)` | functie sageata | ---- beetles --------------------------------------------------------------- |
| 406 | `place(gap)` | functie sageata |  |
| 446 | `far(x, y, d)` | functie sageata |  |
| 489 | `makeDecor(L, seed)` | functie |  |
| 492 | `pickType()` | functie sageata |  |
| 506 | `paintDecor(cc, type, v, seed)` | functie | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 552 | `paintDecorL(cc, type, v, r, pick)` | functie | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 601 | `decorSprite(type, v)` | functie sageata |  |
| 602 | `paintDecorStill(c, L)` | functie | all the decor that stays put goes into the level picture, once |
| 606 | `paintTree(c, t, P, ox, oy)` | functie |  |
| 627 | `paintCrystalRock(c, x, y, R, col, seed)` | functie | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 632 | `paintShroom(c, x, y, R, seed)` | functie |  |
| 641 | `paintTorch(c, x, y)` | functie |  |
| 646 | `drawFlame(c, x, y, t, s, glow)` | functie | a torch flame that flickers (glow: 0 to 1). Not "lit": that is the painter in 02-core.js |
| 655 | `paintTotem(c, x, y)` | functie | x,y = base center. The totem rises about 200 px; the pinwheel turns on top. |
| 667 | `drawPinwheel(c, x, y, ang)` | functie | the rainbow pinwheel on top of a totem: it turns faster when the wind blows |
| 673 | `paintRock(c, x, y, R, col, seed)` | functie |  |
| 680 | `paintHay(c, x, y, R, seed)` | functie |  |
| 692 | `paintMillTower(c, x, y)` | functie | x,y = base center. Tower rises 250 px. |
| 694 | `body(inset, col, a)` | functie sageata |  |
| 703 | `drawMillBlades(c, x, y, ang)` | functie |  |
| 715 | `paintLantern(c, x, y)` | functie |  |
| 721 | `cellBlobs(c, L, type, rad, col, alpha, seed, jit)` | functie |  |
| 732 | `paintLevel(L)` | functie |  |
| 734 | `typeAt(x, y)` | functie sageata |  |
| 853 | `room(grow, col, al)` | functie sageata | rounded cave room plus the short tunnel to the waterfall |
| 884 | `paintVines(c, x, y, w, len, seed, sway, P)` | functie | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 896 | `paintDoor(c, x, y)` | functie | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 915 | `isDiorama(L)` | functie | ---------- The frame of the new levels (docs/24-sisteme-noi.md, S7.4 and S7.5) ---------- A level with look: 'diorama' (levels 7 - 12, or every level with CONFIG.look.preview) gets, once, at loading: - haze over its far part (the top of the picture): paler and bluer, like air between the eye and the far away; - the front plane (L.front): big dark blurred things at the edges of the screen; - the paper texture multiplied into the picture itself (L.paperBaked), when the light map is on: the light map then takes the place of the whole overlay (paper + night vignette). On the slow test machine every full-screen pass costs a few ms, and the light map is already one. Levels 1 - 6 stay as they are. |
| 916 | `levelAmbient(L)` | functie |  |
| 917 | `finishLook(L)` | functie |  |
| 941 | `paintWater(L, c)` | functie | The water of the new levels (T6.8). Once, at loading: - L.water.path: the water cells as one Path2D (a rectangle for every run of cells on a row, a little smaller than the cells, so the waves stop before the bank); every frame fills it twice with the wave pattern (drawWater); - the reflection: the bank above every column of water, upside down, faint and out of focus, painted into the picture. It is made at a quarter of the size (that is what makes it soft), faded with depth, cut with a mask of soft discs (the shore of the water is not square), then laid over the water with a low alpha; - L.water.spark: the places where it sparkles. |
| 978 | `frontSlots()` | functie | where the things can be: two tall corners at the top, the two sides, two places at the bottom |
| 986 | `paintFront(L)` | functie |  |
| 1010 | `paintFrontThing(t, kind, at, x, y, w, h, r, base, base2)` | functie |  |
| 1051 | `frontLeaf(t, x, y, len, ang, col)` | functie | a long pointed leaf from (x, y) in the direction ang, with a pale midrib |
| 1057 | `finishPaint(c, w, h, skyT, r, night)` | functie |  |
| 1069 | `genBoss()` | functie | The boss arena: one screen, the tallest tree in the valley. |
| 1111 | `genArena()` | functie | The last level of the second game: George's arena. A clearing with mountains behind it, torches of fire all around, soldiers with spears, and in the middle the stone throne on which George sits. |
| 1148 | `slab(w, y0, h, col)` | functie sageata |  |

## 07-play.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 7 | `D(k)` | functie sageata |  |
| 8 | `rank(k)` | functie sageata | 0 Ușor, 1 Normal, 2 Greu |
| 13 | `abil(k, kind)` | functie | The two abilities of this game. Any hero can have any of them, on either button (CONFIG: power = ✕, power2 = □). - 'spin' turns around the hero: Boon's claws, Killer's gloves. Bubu's stomp is the same ability with time 0. - 'throw' sends things out in a circle: Leo's and Killer's balls, Boon's bones. abil gives the numbers of one ability for one hero: his own block if he has one, else the old names on the hero. |
| 18 | `hasAbil(k, kind)` | functie sageata |  |
| 20 | `abilSlot(k, kind)` | functie sageata | Which button an ability sits on for this hero: 1 = ✕ (the first power), 2 = □ (the second). Decides the word and the hint. |
| 24 | `buildLevel(idx)` | functie | Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. |
| 31 | `makeHero(k, x, y)` | functie |  |
| 40 | `makeEgg(x, y, o)` | functie |  |
| 46 | `isJoined(k)` | functie | ---------- the egg quota (docs/27-cota-de-oua.md) ---------- |
| 47 | `bothJoined()` | functie |  |
| 48 | `quotaOn()` | functie |  |
| 49 | `quotaOk(k)` | functie |  |
| 50 | `quotaState(k)` | functie | no upper limit (T15): extra = how many over the quota |
| 51 | `flying(to)` | functie | eggs on their way to a hero |
| 53 | `giveEgg(k)` | functie | L1: the hero gives one of his quota eggs to the friend. Returns true when an egg left. |
| 62 | `updateGifts(dt)` | functie |  |
| 76 | `updateQuotaMsg()` | functie | The first time a hero has found his whole quota: tell the friend how to help (quotaDone), or, when the second one finishes too, say "to the nest" (quotaBoth). Once per hero per level, and only with two players. |
| 86 | `updateAutoGive(dt)` | functie | C12: nobody stays stuck. After CONFIG.quota.autoGive seconds in the nest with a quota missing, the game itself moves one egg every autoEvery seconds, from the hero who is over his quota to the one who is short. 0 = off. |
| 98 | `updateJoinQuota()` | functie | C14: when a player joins in the middle of a level, what the friend holds over his quota goes to him, up to the newcomer's quota. |
| 108 | `sendEgg(from, to, auto)` | functie | one egg leaves `from` and flies to `to` (by hand with L1, or by the game itself) |
| 114 | `startPlay(L)` | functie |  |
| 137 | `startWave(k)` | functie |  |
| 150 | `part(x, y, o)` | functie | ---------- particles ---------- |
| 158 | `bigHit()` | functie | ---------- The weight of a hit (T6.9, S7.6) ---------- bigHit(): the game holds its breath for CONFIG.look.freeze seconds (updatePlay does not run, the drawing does) and the camera comes closer by look.kick in look.kickIn seconds and goes back in look.kickOut. Called when a guardian is hit and when George falls; a gate that opens or a boulder that falls (T7) calls it too. The shake (P.shake) is separate and unchanged. |
| 164 | `kickZoom()` | functie | The zoom of the camera at this moment: 1 + kick while it comes closer (easeOut) and while it goes back (easeOut the other way). |
| 172 | `holdBreath(dt)` | functie |  |
| 184 | `mechClick(x, y)` | functie | A mechanism clicks and sparks just before it moves (anticipation, S7.6). The pull-back itself is mechMove (02-core.js). |
| 188 | `burst(x, y, n, o)` | functie |  |
| 198 | `stepParts(dt)` | functie |  |
| 206 | `collide(L, e, r, isBall)` | functie | ---------- collisions ---------- |
| 231 | `collectEgg(e, k)` | functie | ---------- eggs and stars ---------- |
| 250 | `rainbowAdd(e, k)` | functie | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 258 | `collectStar(s, k)` | functie |  |
| 265 | `checkWave()` | functie | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. With the quota (T15) the waves only light the next glowing trees, and George comes from the diamonds (updateGeorge). |
| 276 | `openNest()` | functie |  |
| 278 | `teamNeed()` | functie | alone, the friend's quota counts as found |
| 279 | `teamFound()` | functie | a diamond in the air still belongs to the team |
| 281 | `updateGeorge()` | functie | George comes when the team has half of what it needs (the middle fight) and again when it has all of it (the nest fight). |
| 289 | `dropGems(e)` | functie | A defeated small enemy leaves diamonds: the only place they come from. Thrown enemies too; nothing else. |
| 298 | `addSnail(x, y, i)` | functie | A snail crawls out of a glowing tree. It is a small enemy like the robots: it chases, it can be beaten, it comes back after a while. |
| 301 | `shakeTree(t, power, byStomp)` | functie |  |
| 319 | `rescueLimit()` | functie | How many seconds the friend has. After a few restarts of the same chapter the children get more time (the safety net). |
| 327 | `countDown(h, dt)` | functie | The ten seconds of a hero who is down: a wooden tick and a short shake on BOTH controllers every second, twice a second and stronger in the last three. At zero the chapter starts again. |
| 341 | `hitHero(h, sx, sy)` | functie |  |
| 370 | `getUp(h, by)` | functie |  |
| 385 | `tryRescue(h)` | functie | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 394 | `updateRescue(dt)` | functie |  |
| 409 | `hurtSmall(e)` | functie | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 420 | `powerSweep(h, id)` | functie | What the first hero's power does to everything around him. id = this stomp (or this spin of the claws): every enemy, tree and guardian feels it once per id. |
| 439 | `doStomp(h)` | functie |  |
| 449 | `startSpin(h)` | functie | A hero starts his spin: Bubu jumps and stomps; Boon's claws and Killer's gloves grow and spin around him (a shield that also gathers crystals). Nothing starts while the other power of the same hero is running. |
| 461 | `spinBeat(h)` | functie | The gloves shake the controller in three short beats (0, 0.28 and 0.56 s), so they feel different in the hand. |
| 463 | `bossShake(h)` | functie | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 475 | `newBall(x, y, vx, vy, power, life, kick, size, hop, owner, look)` | functie |  |
| 479 | `throwReady(h)` | functie sageata | This hero can throw again: everything of his is home, or his cooldown is over. |
| 482 | `throwRing(h, power, ax, ay)` | functie | One throw sends n things out in a circle, so the power goes in every direction. Stick direction = the first one. Killer and Leo throw balls, Boon throws boomerang bones: the same rules, their own numbers and their own look. |
| 502 | `recallBalls(k)` | functie | A second press while his things are still out (inside the cooldown) calls back everything of HIS. The friend's stay out. |
| 512 | `heroMotion(h, v, dt)` | functie | The weight of a hero (docs/24-sisteme-noi.md, S7.3, second part): a squash or a stretch when he starts, stops and lands, and the tail that lifts with the speed and comes after the body with a lag. Only numbers here: the painters read them (heroOpts). |
| 520 | `canRun(h)` | functie |  |
| 525 | `startRun(h)` | functie |  |
| 534 | `stopRun(h)` | functie |  |
| 535 | `updateRun(h, s, ix, iy, dt)` | functie |  |
| 552 | `updateHero(h, dt)` | functie |  |
| 646 | `updateSpin(h, dt, pressed)` | functie | The spin (claws, gloves, or Bubu's stomp) of one hero, on its own button. |
| 667 | `updateThrow(h, dt, pressed, released, held)` | functie | The throw (balls or bones) of one hero, on its own button. |
| 681 | `updateBall(dt)` | functie |  |
| 696 | `stepFlyBall(b, dt)` | functie | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 746 | `updateEggs(dt)` | functie |  |
| 774 | `enemyMul(x, y)` | functie | enemies slow down near a player on "Ușor" |
| 779 | `updateEnemies(dt)` | functie |  |
| 834 | `bossGoal()` | functie | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 838 | `bossBall(b)` | functie |  |
| 853 | `updateBoss(dt)` | functie |  |
| 906 | `hitBird(bd)` | functie | ---------- second game: big birds that pick a hero up and carry him a little way (it does not hurt) ---------- |
| 911 | `dropHero(bd)` | functie |  |
| 920 | `updateBirds(dt)` | functie |  |
| 944 | `stepProj(list, dt, spare)` | functie | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |
| 960 | `updateDecor(dt)` | functie | The reacting decor. Grass, clover, daisies, reeds, dandelions and leaves send up a little puff of leaves, petals or seeds and rustle when a hero walks past (a stomp makes the dandelions and leaves jump). Snails pull in and a ladybug flies off and comes back. Only what is near a hero or a ball reacts. |
| 987 | `updatePlay(dt)` | functie |  |
| 1107 | `camTarget(L, a, b)` | functie | Where the camera wants to be for two heroes: no side effects, so a test can ask the game itself. Rules: both heroes on screen; nothing of a hero (name included) above the band at the top (HUD_TOP, 08-draw.js); the camera may look up to HUD_TOP + 20 screen pixels above the top edge of the world, and that strip is painted sky. |

## 075-duel.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 29 | `duelDefs()` | functie sageata |  |
| 31 | `startDuel(kind = 'nest')` | functie | kind 'mid': the middle fight, the same as before. kind 'nest': the harder one at the nest, bigger and quicker. |
| 42 | `room(c)` | functie sageata | the nest guardian lands as close to its spot as it can; the middle one looks for the most open place near the middle (not the river bank, not a bridge) |
| 55 | `duelFighter()` | functie | Who the guardian goes after: the bravest player who is not hidden in the nest. |
| 65 | `duelWaiting()` | functie sageata | While a hero waits for the friend's help the fight rests: the guardian finishes what it was doing, hurts nobody and starts no new attack. |
| 67 | `duelSpares(h)` | functie sageata | Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. |
| 69 | `duelCanHurt(k, how)` | functie sageata | A tired guardian can always be hit. On "Ușor" every hit counts at any time, except on a guardian that is only waiting for a hero to be helped up. |
| 70 | `duelEggs(n)` | functie |  |
| 78 | `duelHit(k)` | functie |  |
| 90 | `duelBall(b)` | functie |  |
| 100 | `duelStomp(h)` | functie |  |
| 109 | `duelLob(n, slow)` | functie | throws n pinecones: the first where the target is going, the rest around |
| 118 | `lvlOf(arr)` | functie | ---------- T15: what George throws (docs/28-t15-george-de-doua-ori.md, section 4) ---------- |
| 120 | `georgeBones(n)` | functie | n bones and balls, at the heroes: they land in a red circle and daze, like the pinecones. |
| 131 | `georgeEnemies(n, follow)` | functie | n small enemies, thrown near the heroes. follow = the ones of his last heart: they keep after Boon and Killer and never give up. |
| 147 | `updateGeorgeMid(d, dt)` | functie | The middle fight (T15): a few bones and balls, two at a time, every few seconds. |
| 155 | `georgeNestThrows(d)` | functie | The nest fight (T15): what he throws depends on the hearts he has left. Called after every heart he loses. |
| 163 | `georgeClearThrown()` | functie | George is beaten: his thrown enemies go with him (each one in a puff of dust, without diamonds). |
| 168 | `duelSnap(x, y)` | functie | nearest spot a guardian can stand on |
| 174 | `updateDuel(dt)` | functie |  |
| 195 | `go(st)` | functie sageata |  |
| 196 | `cycle()` | functie sageata | George takes turns with his tricks |
| 197 | `tire()` | functie sageata |  |
| 258 | `plan()` | functie sageata |  |
| 296 | `duelSwoop(tg)` | functie | fly in a straight line through the place where the target stands |
| 306 | `heartPath(c, x, y, s)` | functie | ---------- drawing the guardians ---------- |
| 312 | `beetle(c, d, t, mood)` | metoda | the Beetle King: a big grumpy beetle with a tiny crown |
| 319 | `owl(c, d, t, mood)` | metoda |  |
| 333 | `crab(c, d, t, mood)` | metoda |  |
| 350 | `whirl(c, d, t, mood)` | metoda | a little whirlwind with eyes |
| 361 | `frog(c, d, t, mood)` | metoda |  |
| 374 | `chick(c, d, t, mood)` | metoda | Ciorel, Ciori's little nephew |
| 377 | `george(c, d, t, mood)` | metoda | George cel Rău (second game): the same painter as the boss, the size comes from the level |
| 381 | `drawDuelBoss(c)` | functie |  |
| 395 | `drawDuelGround(c)` | functie | Things on the ground during a mini-fight: where the next attack will land, shadows. (The shelter ring is in drawNestShelter.) |
| 397 | `red(a)` | functie sageata |  |
| 409 | `drawDuelTop(c)` | functie | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

## 08-draw.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 6 | `heroOpts(h)` | functie |  |
| 12 | `heroTop(k)` | functie sageata | how tall each hero is: where the stars, the name and the ○ go |
| 19 | `heroInWay(x, y, w, h, only)` | functie | Is a hero standing where we want to write? Used by the few texts that stay in the world, so they never cover anybody. only: check just this hero. The box is the painted body, without the name above it. |
| 23 | `drawParts(c)` | functie |  |
| 46 | `drawDownRing(c, h, by)` | functie | The ten seconds of a hero who is down: ten beads around him, one going out every second, and the number over his head. It pops at every second and grows coral in the last three. Nothing dark: it is a countdown, not a threat. |
| 62 | `drawClawRing(c, h)` | functie |  |
| 77 | `drawGloveRing(c, h)` | functie | The ring of Killer's whirl gloves: two gloves chasing each other, each with a ribbon behind (one blue, one white), and a dotted white circle on the ground, like the line in the middle of a pitch. It turns the other way than the claws. |
| 96 | `ghostCanvas(h, g)` | functie |  |
| 103 | `drawRunTrail(c, h)` | functie |  |
| 125 | `drawHeroFull(c, h)` | functie |  |
| 175 | `drawSmallHp(c, e, x, y)` | functie | Small enemies show how many hits they still take, once they were hit. |
| 179 | `drawBossTargets(c)` | functie |  |
| 192 | `drawProjWarn(c, list)` | functie | the spot where a thrown pinecone will land |
| 199 | `drawProjs(c, list)` | functie |  |
| 210 | `drawWorld(c)` | functie |  |
| 388 | `hintTarget()` | functie |  |
| 398 | `nearestEgg(h, reqOnly, maxD)` | functie | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 403 | `guideTarget(h)` | functie |  |
| 425 | `drawGuides(c)` | functie |  |
| 453 | `drawHints(c, v)` | functie |  |
| 496 | `pressLabel(k)` | functie sageata |  |
| 498 | `levelProgress()` | functie | How far the level is: eggs in groups, then the guardian, then the nest. |
| 513 | `seg(k)` | functie sageata |  |
| 522 | `drawProgress(c)` | functie |  |
| 552 | `drawPort(c, k, cx, cy, r, dizzy)` | functie | The round picture of a hero (the one painted after the children's drawings) in a ring of his color; r = the radius of the ring. |
| 564 | `drawTick(c, x, y, r)` | functie | A round green tick, painted: the quota is found. |
| 574 | `drawBadge(c, k, x, y)` | functie | The corner badge: portrait, name, difficulty and, when the level has a quota, "found / quota" in green (done) or red (still missing). 300 x 108, inside the band (16 to 124). |
| 597 | `downBanner()` | functie | "Ajută-l pe Boon! ○" while a friend is down and the seconds are running. It comes before any other banner. |
| 601 | `waitBanner()` | functie |  |
| 612 | `drawMidCard(c, ban)` | functie | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 681 | `drawHUD(c)` | functie |  |
| 696 | `lightSprite(col)` | functie |  |
| 703 | `addLight(x, y, r, col, a, glow)` | functie |  |
| 707 | `collectLights(L)` | functie |  |
| 723 | `drawLightMap(c, v)` | functie |  |
| 751 | `waterSpark()` | functie |  |
| 758 | `drawWater(c, L, t, l, tp, vw, vh)` | functie |  |
| 776 | `moteKind(L)` | functie |  |
| 778 | `moteSprite(col)` | functie |  |
| 784 | `moteInit(L)` | functie |  |
| 792 | `drawMotes(c, v)` | functie |  |
| 819 | `heroScreenBox(h, v)` | functie |  |
| 823 | `frontOffset(L, v)` | functie |  |
| 827 | `updateFront(L, v)` | functie | the alphas: called while drawing, from the time that passed in the game |
| 844 | `drawFront(c, v)` | functie |  |
| 854 | `drawPlay(c)` | functie |  |
| 864 | `drawEdgePulse(c)` | functie | The last three seconds: the edge of the screen breathes in the fallen hero's own color. Never red-dark, never black. |
| 874 | `drawNestShelter(c)` | functie | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 882 | `drawDecor(c, l, tp, vw, vh)` | functie | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 898 | `drawArenaBack(c)` | functie | the torches of fire around the arena |
| 902 | `drawThrone(c)` | functie |  |
| 909 | `drawGeorgeBoss(c, o, t)` | functie |  |

## 09-screens.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 12 | `heroOf(p)` | functie sageata | which hero (0 Bubu, 1 Leo) player p plays |
| 21 | `emptyResult()` | functie sageata | One save for everything. The settings are shared by the two games. Each game keeps its own progress: the first game at the top of the save (as before), the second one in g2. Progress of a game (a "slot"): level the chapter "Continue" starts (see chapters() in 06-level.js) max how far the players have ever got: chapters 0 .. max are open on the Chapters screen results the best result of every chapter played: { eggs, stars, med: [3 medals] } eggs, stars the team total = the sum of results. Still written, so that an older version of the game can read the file. |
| 22 | `sumResults(res)` | functie |  |
| 24 | `migrateSave(d)` | functie | A save from before chapters (version 3 or older) becomes version 4. It changes only what is missing, so it can run again. |
| 39 | `load()` | metoda |  |
| 40 | `slot(id)` | metoda | the progress of one game |
| 42 | `own()` | metoda | the progress of the chosen game, made if it is not there yet |
| 44 | `newGame()` | metoda | "New game": the progress of the chosen game is erased. The other game and the settings stay. |
| 47 | `finish(i, r)` | metoda | Chapter i is over with result r. The chapter keeps its best result, "Continue" moves on only if this was the chapter it pointed at, and the chapters up to the next one open. |
| 58 | `write()` | metoda |  |
| 66 | `apply()` | metoda | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 84 | `hasProgress(id)` | metoda |  |
| 86 | `maxOpen(id)` | metoda | the furthest chapter open on the Chapters screen (-1: no chapter was ever finished, the button is not shown) |
| 91 | `hitAdd(x, y, w, h, id, v, act, val)` | functie | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 92 | `hitFind(p)` | functie |  |
| 98 | `pressedGo()` | functie sageata | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 100 | `pressText()` | functie | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 106 | `fitText(c, str, x, y, size, maxW, col, o)` | functie |  |
| 112 | `swapHeroes()` | functie | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 117 | `cycleDiff(k, d)` | functie |  |
| 118 | `setLanguage(l)` | functie |  |
| 124 | `paintMeadowScene(skyT, horizon, seed)` | functie |  |
| 143 | `paintJungleScene(horizon, seed)` | functie | The backdrop of the second game: the jungle at night, under the moon and the northern lights. |
| 161 | `titleBackdrop(id)` | functie | The start-screen backdrop of each game is painted once, the first time it is needed. |
| 166 | `setGame(id)` | functie | Sets up the game (the second game is the only one now): its heroes, villain and boss values, its texts, pictures, music and progress. |
| 173 | `initScreens()` | functie |  |
| 176 | `drawBackdrop(c, cv)` | functie |  |
| 177 | `prompt(c, str, x, y, size, t)` | functie |  |
| 181 | `drawBoot(c, t)` | functie | ---------- boot + title ---------- |
| 190 | `titleMenu()` | functie | The buttons under the heroes: "Continue: ...", "Chapters", "New game". At the very first start only one, and it says "Start!". |
| 198 | `titleGo()` | functie | What the chosen button does, once every player who joined is "Ready!". |
| 207 | `askYesNo(title, sub, yes, ok)` | functie | A small yes / no question over the start screen or the pause. "No" is the one shown first, so a child who keeps pressing ✕ cannot erase anything by chance. ○ or Backspace also say no. |
| 208 | `askRows()` | functie |  |
| 209 | `updateAsk()` | functie |  |
| 210 | `drawAsk(c, t)` | functie |  |
| 211 | `updateTitle(dt)` | functie |  |
| 234 | `drawGear(c, x, y, r, col, t)` | functie |  |
| 241 | `drawTitle(c, t)` | functie |  |
| 304 | `chapterLayout()` | functie |  |
| 314 | `Game.toChapters()` | functie |  |
| 321 | `updateChapters(dt)` | functie |  |
| 326 | `move(row, col)` | functie sageata |  |
| 339 | `chapterPic(i, ch)` | functie | the little picture at the top of a card: the level's sky and ground and the three pictures of its story card. Painted once. |
| 352 | `drawCrownIcon(c, x, y, s)` | functie |  |
| 361 | `drawPadlock(c, x, y, s)` | functie |  |
| 370 | `drawChapterCard(c, i, ch, p, t, open)` | functie |  |
| 400 | `drawChapters(c, t)` | functie |  |
| 412 | `drawIntroIcon(c, kind, x, y, t, Lx)` | functie | ---------- level story card ---------- |
| 433 | `drawIntroIconL(c, kind, x, y, t, Lx)` | functie | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 451 | `drawDim(c, a)` | functie |  |
| 452 | `drawIntro(c, t)` | functie |  |
| 464 | `drawLoading(c, t)` | functie |  |
| 471 | `levelMedals()` | functie | Three little medals give the bigger player something extra to aim for. |
| 472 | `drawMedal(c, i, x, y, got, t)` | functie |  |
| 489 | `drawRetry(c, t)` | functie | "Încă o dată!": the only screen the children see when nobody came in time. No "Game Over", no red, no dark: the two heroes hold hands, the level starts again right after. |
| 510 | `drawLevelEnd(c, t)` | functie |  |
| 549 | `menuNav(o, key, rows)` | functie | ---------- menus: pause and settings ---------- A menu is a list of rows. A row is one of: go { label, ok() } a button opt { label, value, chg(dir) } a choice, changed with left / right (or OK) slide { label, v, chg(dir), set(v) } a volume slider, 0 to 1 text { label } a line of text, cannot be chosen |
| 564 | `drawMenu(c, t, title, rows, sel, o)` | functie |  |
| 604 | `pauseRows()` | functie | ---------- pause ---------- |
| 605 | `leave(go)` | functie sageata |  |
| 614 | `resumeGame()` | functie |  |
| 615 | `updatePause()` | functie |  |
| 621 | `drawPause(c, t)` | functie |  |
| 628 | `openSettings()` | functie | ---------- settings ---------- |
| 632 | `closeSettings()` | functie |  |
| 636 | `setMsg(m)` | functie |  |
| 637 | `setPage(page, p)` | functie |  |
| 638 | `settingsBack()` | functie |  |
| 642 | `toggleFullscreen()` | functie |  |
| 650 | `findSpeakers(k)` | functie |  |
| 667 | `pickSpeaker(k, d)` | functie |  |
| 679 | `captureKey(k, f)` | functie |  |
| 692 | `settingsRows()` | functie |  |
| 694 | `vol(label, id, test)` | functie sageata |  |
| 734 | `updateSettings(dt)` | functie |  |
| 747 | `drawPadTester(c, x, y, g, t)` | functie |  |
| 749 | `b(n)` | functie sageata |  |
| 777 | `drawPadBody(c, x, y, cw, k, t)` | functie |  |
| 779 | `step(n, yy, done, label, w)` | functie sageata |  |
| 784 | `small(str, yy, col)` | functie sageata |  |
| 797 | `drawSettings(c, t)` | functie |  |
| 810 | `restoreSpeakers(ask)` | functie | Chrome only tells the names of the speakers while it has the microphone permission, and for a page opened from a file it forgets that permission when the page is closed. So when the saved speaker is not in the list, the question is asked again (ask = true). If the speaker is still not there, the start screen says so: the sounds are then on the computer. |
| 822 | `startEnding()` | functie | ---------- the Sunset Festival ---------- |
| 851 | `updateEnding(dt)` | functie |  |
| 870 | `drawEndingL(c, t)` | functie | The end of the second game: the Rainbow Party. The crystals are the present, the heroes get medals, and little stars fly in and hug them. |
| 875 | `bob(k)` | functie sageata |  |
| 929 | `drawEnding(c, t)` | functie |  |
| 935 | `bob(k)` | functie sageata |  |

## 10-main.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 7 | `resize()` | functie |  |
| 15 | `goFullscreen()` | functie |  |
| 16 | `mousePos(e)` | functie |  |
| 30 | `Game.toTitle()` | functie |  |
| 36 | `Game.startGame(cont)` | functie | cont: from the chapter "Continue" points at. Otherwise a new game from the first chapter (the progress of this game is erased). |
| 42 | `Game.startChapter(i)` | functie | One chapter chosen on the Chapters screen. Nothing is erased. |
| 49 | `Game.goLevel(idx)` | functie | A player joins with the keyboard only on the start screen. In a level, Enter or Space in the pause menu must not make the second hero join (a child playing alone would suddenly have a friend nobody plays). Controllers can still join any time. |
| 52 | `Game.failLevel()` | functie | Nobody came in time: the chapter starts again from its beginning. Never "Game Over": "Încă o dată!". Game.tries counts the restarts of each chapter, so after a few of them the children get more seconds (CONFIG.rescue). |
| 60 | `finishChapter()` | functie | The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. |
| 65 | `Game.levelEnd()` | functie |  |
| 66 | `Game.toEnding()` | functie |  |
| 68 | `update(dt)` | functie |  |
| 114 | `levelOverlay(L)` | functie | The paper and the vignette over the level. None while the light map is drawn on a level that has its paper in the picture (finishLook): the light map takes the vignette's place. |
| 115 | `draw()` | functie |  |
| 136 | `frame(ts)` | functie |  |
