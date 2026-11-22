<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa A. Toate functiile

Fiecare functie, functie sageata si metoda din cod, in ordinea din fisier. Coloana "Comentariul din cod" este textul scris chiar langa functie. Explicatiile pe larg sunt in capitolele din docs/.

Total: 558 intrari.

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
| 14 | `rng(seed)` | functie | small seeded random generator |
| 23 | `hash(s, i)` | functie sageata |  |
| 26 | `hex(h)` | functie |  |
| 31 | `rgba(h, a)` | functie |  |
| 32 | `mix(h1, h2, t)` | functie |  |
| 37 | `shade(h, t)` | functie sageata | darker = toward warm violet, lighter = toward cream. Never gray or black. |
| 48 | `blobPath(c, x, y, rx, ry, seed, wob, n)` | functie |  |
| 64 | `wash(c, x, y, rx, ry, col, o)` | functie | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 83 | `puff(c, x, y, rx, ry, fill, seed, edge, wob)` | functie | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 88 | `soft(c, x, y, rx, ry, col, alpha, seed)` | functie |  |
| 122 | `lit(c, path, col, o)` | functie | ---- One object with volume, in the new look (docs/24-sisteme-noi.md, S7.1) ---- Five layers, always in this order: the cast shadow that glues the object to the ground, the dark contact line under it, the shape itself with a gradient, the rim light that lifts it off the background, and a gloss spot on shiny materials. Every painter of the new look goes through here, so the one light (KEY from the upper left, FILL from the lower right) falls the same way on everything. c the context path a function (c) that builds the contour: one closed path. It is called a few times col the color of the object o x, y where the object stands on the ground: the middle of its base w, h how wide and how tall it is. The shadow and the gradient are built from these gloss 0 to 1, how shiny the material is. 0 = no gloss spot at all. Left out: the gloss of the material mat the name of a material (see MATERIALS below), or a painter (c, o, path) of your own. It is called inside the shape, over the gradient, and cut to the contour seed for the hand-painted wobble of the gloss spot shadow false = no cast shadow (things that do not stand on the ground: a thrown bone, a cloud, a part of a hero: the hero has one shadow of his own, castShadow()) rim how wide the rim light is (5 when left out). Small parts (a leg, a finger) need a thinner one, or the two rims cover the whole part rimA how strong the rim light is, 0 to 1 (1 when left out). The many parts of a hero take less, or every leg and finger gets a pale outline lite true = only the gradient (and the gloss): no clip, no material, no rim light. For the many small parts of a hero (a leg, an arm, a sleeve): the clip and the two rims cost more than the whole old painter, and on a part a few pixels wide they show nothing flip -1 when the painter has mirrored the drawing (c.scale(-1, 1)). Left out: read from the transform. The light must stay on the upper left of the screen, whichever way a hero looks The rim light is painted by stroking the same path a little moved, inside the clip of the shape: moved down-right it shows along the upper-left edge (KEY), moved up-left along the lower-right one (FILL). No createRadialGradient, no createPattern, no shadowBlur: this runs on every frame (S7.7). |
| 144 | `litGloss(c, x, y, w, h, gloss, seed, fl)` | functie |  |
| 159 | `castShadow(c, x, y, w, h, seed, k)` | functie | The two shadows of S7.1 for anything that stands on the ground (lit() uses them, and so does every hero, who is made of many parts but has one shadow). x, y = the middle of the base, w, h = how wide and tall the thing is. h only decides how far to the lower right the shadow falls: a hero passes less than his height, so his shadow starts at his feet instead of lying beside him. k (0 to 1) = how strong: a hero in the air has a smaller, paler shadow and no contact line. 1. cast shadow: pushed to the lower right because the light comes from the upper left, and flattened. 2. contact shadow: the short dark line right under the base, so the object does not float. |
| 184 | `matOf(m)` | functie |  |
| 192 | `matPattern(key, w, h, paint)` | functie | The pattern of a tile of w x h units. sprite() paints at double size, so the pattern is shrunk by half to be w x h again. |
| 205 | `matFill(c, pat, o, alpha, part)` | functie | Fills the box of the shape with a pattern. part 'back' = only its left half: the back of a hero, who faces right (the painters flip the whole hero, so "left" is always the back). |
| 213 | `paintScaleTile(c)` | functie | scale: little half circles in rows that are shifted by half a scale. The tile repeats without a seam (every scale is also drawn one tile away) |
| 222 | `paint(c, o)` | metoda |  |
| 230 | `paintWeaveTile(c)` | functie | fabric: a very fine weave (lines that cross) and, 4 units inside the edge, a line of stitches |
| 236 | `paint(c, o, path)` | metoda |  |
| 252 | `paint(c, o)` | metoda |  |
| 263 | `paintPoreTile(c)` | functie | bone: almost smooth. A few small pores, and one crack with a pale edge beside it. The tile is big (64 x 64) and the pores sit at random, in lone ones and in little groups: a small tile repeats like a grid |
| 274 | `paint(c, o)` | metoda |  |
| 290 | `paintGrainTile(c)` | functie | wood: long grain lines that wiggle a little, a couple of knots, and lighter plank ends |
| 301 | `paint(c, o)` | metoda |  |
| 318 | `paintScratchTile(c)` | functie | metal: bands of light (light, dark, light), little rivets with a shadow, and fine pale scratches |
| 327 | `paint(c, o)` | metoda |  |
| 344 | `paintBlotchTile(c)` | functie | stone: big irregular blotches in two tones, cracks, and moss low down |
| 354 | `paint(c, o)` | metoda |  |
| 374 | `paint(c, o)` | metoda |  |
| 376 | `pt(i)` | functie sageata |  |
| 392 | `paint(c, o, path)` | metoda |  |
| 410 | `paint(c, o)` | metoda |  |
| 429 | `brushLine(c, pts, width, col, alpha, seed)` | functie | A wobbly brush line through points. |
| 443 | `makeCanvas(w, h)` | functie |  |
| 446 | `topColor(cv)` | functie | The colour of the very first pixel of a painting: the sky at the top. Used to fill the strip above the world when the camera looks a little higher than the painting goes (docs/24-sisteme-noi.md, S6). |
| 453 | `makePaper()` | functie |  |
| 460 | `samp(arr, w, u, v)` | functie sageata |  |
| 485 | `makeOverlay(tint, tintA, vig, night)` | functie | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 501 | `skyCols(t)` | functie |  |
| 509 | `paintSky(c, x, y, w, h, t, seed, o)` | functie |  |
| 535 | `paintNightSky(c, x, y, w, h, seed, o)` | functie | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 560 | `paintMountains(c, x, yBase, w, hgt, seed)` | functie | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 576 | `paintHills(c, x, yBase, w, hgt, t, seed, cols, night)` | functie | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 595 | `setFont(c, size, title, weight)` | functie | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 598 | `text(c, str, x, y, size, col, o)` | functie |  |
| 611 | `wrapLines(c, str, maxW, size, title)` | functie |  |
| 623 | `iconX(c, x, y, r, pulse)` | functie | The ✕ button as a painted icon (blue cross on a cream disc). |
| 633 | `iconSq(c, x, y, r, pulse)` | functie | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 644 | `iconO(c, x, y, r, pulse)` | functie | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 654 | `iconL3(c, x, y, r, t)` | functie | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 668 | `richText(c, str, x, y, size, col, o)` | functie |  |
| 682 | `starPath(c, x, y, r, rot)` | functie |  |
| 693 | `sprite(key, w, h, paint)` | functie | Things that never change are painted once and then stamped: much faster per frame. |
| 698 | `card(c, x, y, w, h, col, seed)` | functie |  |
| 703 | `paintCard(c, x, y, w, h, col, seed)` | functie |  |
| 706 | `p(dx, dy, sc, fill, a)` | functie sageata |  |

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
| 461 | `retry(b, t)` | metoda |  |
| 467 | `play(name, arg, k, vol)` | functie | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 478 | `canSink()` | functie sageata | ---- the controller's own speaker (only when the system shows it as an audio output) ---- |
| 480 | `listOutputs(ask)` | functie | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 489 | `setSink(k, dev)` | functie | dev = { id, label } or null for the computer's speakers |
| 509 | `swapOuts()` | functie |  |
| 515 | `setVol(k, v)` | metoda |  |
| 516 | `setDuck(d)` | metoda |  |
| 523 | `init()` | metoda |  |
| 528 | `pick()` | metoda |  |
| 534 | `say(txt, keep)` | metoda |  |
| 549 | `stop()` | metoda |  |

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
| 337 | `drawRoller(c, o, x, y, t)` | functie | The small enemy that comes down a lane: a rolling pinecone, or a sticky snail. |

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
| 117 | `eyeLit(c, x, y, r, o, look)` | functie | An eye in the new look: two gleams that follow the light (a big one up-left, a small one down-right, on the screen, whichever way the hero looks) and a soft shadow under the upper lid. Closed, happy or dizzy: the old eye. |
| 134 | `sewNumber(c, str, x, y, size, ink, patch)` | functie | Killer's 10, "sewn on": a patch around the digits and a dotted cream stitch just outside them. |
| 144 | `drawBoon(c, x, y, o)` | functie | BOON: the little one's hero. Round teal body, a dome of blue spikes on the back, long tan neck, small blue head, lime legs and a long lime tail. o.claw (0 to 1) = the claws are out and spinning. |
| 155 | `leg(lx, lift, fwd, sd)` | functie sageata | legs with little claws |
| 191 | `drawKiller(c, x, y, o)` | functie | KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. |
| 199 | `leg(lx, lift, fwd, seed)` | functie sageata | legs in blue, big red rubber boots |
| 209 | `arm(sd, sw)` | functie sageata |  |
| 239 | `drawBallL(c, x, y, r, spin)` | functie | Killer's ball, like in the drawing: white, with hexagons. |
| 258 | `drawGeorge(c, x, y, o)` | functie | GEORGE CEL RĂU: a carnotaurus with a crown. Pink body, a head in rainbow colors with a blue snout full of teeth, a striped horn-crown, thin brown legs and arms, a tail that turns from green to blue. mood: calm \| angry \| dizzy \| scared |
| 308 | `drawGeorgeCrown(c, x, y, s, rot)` | functie |  |
| 320 | `paintRobotBody(c, b, t)` | functie | One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. |
| 338 | `drawRobot(c, b, t)` | functie |  |
| 357 | `drawSnail(c, x, y, t, o)` | functie | A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. |
| 382 | `drawBird(c, x, y, o)` | functie | A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. |
| 401 | `gemPath(c, r)` | functie | A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. |
| 404 | `drawCrystal(c, x, y, r, t, seed, z, hue)` | functie |  |
| 425 | `drawSecretStar(c, x, y, r, t, z)` | functie | The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. |
| 437 | `drawRocket(c, x, y, t, s)` | functie | The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. |
| 451 | `drawRockProj(c, x, y, rot, r)` | functie | Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). |
| 456 | `drawSpear(c, x, y, ang, s)` | functie |  |
| 464 | `drawSoldier(c, so, t)` | functie | One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. |
| 484 | `drawGlove(c, x, y, r, sd, t)` | functie | One goalkeeper glove: red, white palm, a blue star in the palm. sd = which side it points to. |
| 497 | `drawBone(c, x, y, r, spin)` | functie | Boon's boomerang bone: two round ends and a shaft, cream amber, with a small crack. |
| 510 | `drawThrown(c, x, y, r, spin, look)` | functie | What a thrown thing looks like: Killer's and Leo's ball, or Boon's bone. |

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
| 420 | `far(x, y, d)` | functie sageata |  |
| 463 | `makeDecor(L, seed)` | functie |  |
| 466 | `pickType()` | functie sageata |  |
| 480 | `paintDecor(cc, type, v, seed)` | functie | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 526 | `paintDecorL(cc, type, v, r, pick)` | functie | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 575 | `decorSprite(type, v)` | functie sageata |  |
| 576 | `paintDecorStill(c, L)` | functie | all the decor that stays put goes into the level picture, once |
| 580 | `paintTree(c, t, P, ox, oy)` | functie |  |
| 601 | `paintCrystalRock(c, x, y, R, col, seed)` | functie | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 606 | `paintShroom(c, x, y, R, seed)` | functie |  |
| 615 | `paintTorch(c, x, y)` | functie |  |
| 620 | `drawFlame(c, x, y, t, s, glow)` | functie | a torch flame that flickers (glow: 0 to 1). Not "lit": that is the painter in 02-core.js |
| 629 | `paintTotem(c, x, y)` | functie | x,y = base center. The totem rises about 200 px; the pinwheel turns on top. |
| 641 | `drawPinwheel(c, x, y, ang)` | functie | the rainbow pinwheel on top of a totem: it turns faster when the wind blows |
| 647 | `paintRock(c, x, y, R, col, seed)` | functie |  |
| 654 | `paintHay(c, x, y, R, seed)` | functie |  |
| 666 | `paintMillTower(c, x, y)` | functie | x,y = base center. Tower rises 250 px. |
| 668 | `body(inset, col, a)` | functie sageata |  |
| 677 | `drawMillBlades(c, x, y, ang)` | functie |  |
| 689 | `paintLantern(c, x, y)` | functie |  |
| 695 | `cellBlobs(c, L, type, rad, col, alpha, seed, jit)` | functie |  |
| 706 | `paintLevel(L)` | functie |  |
| 708 | `typeAt(x, y)` | functie sageata |  |
| 827 | `room(grow, col, al)` | functie sageata | rounded cave room plus the short tunnel to the waterfall |
| 858 | `paintVines(c, x, y, w, len, seed, sway, P)` | functie | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 870 | `paintDoor(c, x, y)` | functie | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 881 | `finishPaint(c, w, h, skyT, r, night)` | functie | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 893 | `genBoss()` | functie | The boss arena: one screen, the tallest tree in the valley. |
| 935 | `genArena()` | functie | The last level of the second game: George's arena. A clearing with mountains behind it, torches of fire all around, soldiers with spears, and in the middle the stone throne on which George sits. |
| 972 | `slab(w, y0, h, col)` | functie sageata |  |

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
| 39 | `makeEgg(x, y, o)` | functie |  |
| 45 | `isJoined(k)` | functie | ---------- the egg quota (docs/27-cota-de-oua.md) ---------- |
| 46 | `bothJoined()` | functie |  |
| 47 | `quotaOn()` | functie |  |
| 48 | `quotaOk(k)` | functie |  |
| 49 | `canTake(e, k)` | functie | alone there is no limit |
| 50 | `quotaState(k)` | functie |  |
| 51 | `flying(to)` | functie | eggs on their way to a hero |
| 53 | `giveEgg(k)` | functie | L1: the hero gives one of his quota eggs to the friend. Returns true when an egg left. |
| 63 | `updateGifts(dt)` | functie |  |
| 77 | `updateAutoGive(dt)` | functie | C12: nobody stays stuck. After CONFIG.quota.autoGive seconds in the nest with a quota missing, the game itself moves one egg every autoEvery seconds, from the hero who is over his quota to the one who is short. 0 = off. |
| 89 | `updateJoinQuota()` | functie | C14: when a player joins in the middle of a level, what the friend holds over the limit goes to him. |
| 99 | `sendEgg(from, to, auto)` | functie | one egg leaves `from` and flies to `to` (by hand with L1, or by the game itself) |
| 105 | `capHint(k, e)` | functie |  |
| 111 | `startPlay(L)` | functie |  |
| 133 | `startWave(k)` | functie |  |
| 146 | `part(x, y, o)` | functie | ---------- particles ---------- |
| 150 | `burst(x, y, n, o)` | functie |  |
| 160 | `stepParts(dt)` | functie |  |
| 168 | `collide(L, e, r, isBall)` | functie | ---------- collisions ---------- |
| 193 | `collectEgg(e, k)` | functie | ---------- eggs and stars ---------- |
| 213 | `rainbowAdd(e, k)` | functie | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 221 | `collectStar(s, k)` | functie |  |
| 227 | `checkWave()` | functie | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 237 | `openNest()` | functie |  |
| 238 | `shakeTree(t, power, byStomp)` | functie |  |
| 255 | `rescueLimit()` | functie | How many seconds the friend has. After a few restarts of the same chapter the children get more time (the safety net). |
| 263 | `countDown(h, dt)` | functie | The ten seconds of a hero who is down: a wooden tick and a short shake on BOTH controllers every second, twice a second and stronger in the last three. At zero the chapter starts again. |
| 277 | `hitHero(h, sx, sy)` | functie |  |
| 306 | `getUp(h, by)` | functie |  |
| 321 | `tryRescue(h)` | functie | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 330 | `updateRescue(dt)` | functie |  |
| 345 | `hurtSmall(e)` | functie | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 355 | `powerSweep(h, id)` | functie | What the first hero's power does to everything around him. id = this stomp (or this spin of the claws): every enemy, tree and guardian feels it once per id. |
| 374 | `doStomp(h)` | functie |  |
| 384 | `startSpin(h)` | functie | A hero starts his spin: Bubu jumps and stomps; Boon's claws and Killer's gloves grow and spin around him (a shield that also gathers crystals). Nothing starts while the other power of the same hero is running. |
| 396 | `spinBeat(h)` | functie | The gloves shake the controller in three short beats (0, 0.28 and 0.56 s), so they feel different in the hand. |
| 398 | `bossShake(h)` | functie | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 410 | `newBall(x, y, vx, vy, power, life, kick, size, hop, owner, look)` | functie |  |
| 414 | `throwReady(h)` | functie sageata | This hero can throw again: everything of his is home, or his cooldown is over. |
| 417 | `throwRing(h, power, ax, ay)` | functie | One throw sends n things out in a circle, so the power goes in every direction. Stick direction = the first one. Killer and Leo throw balls, Boon throws boomerang bones: the same rules, their own numbers and their own look. |
| 437 | `recallBalls(k)` | functie | A second press while his things are still out (inside the cooldown) calls back everything of HIS. The friend's stay out. |
| 444 | `canRun(h)` | functie | Running (L3). One press with the stick tilted starts it; it lasts until the stick is let go. canRun says when a hero is allowed to run at all; everything that stops a run is in one place, below. |
| 449 | `startRun(h)` | functie |  |
| 457 | `stopRun(h)` | functie |  |
| 458 | `updateRun(h, s, ix, iy, dt)` | functie |  |
| 475 | `updateHero(h, dt)` | functie |  |
| 568 | `updateSpin(h, dt, pressed)` | functie | The spin (claws, gloves, or Bubu's stomp) of one hero, on its own button. |
| 589 | `updateThrow(h, dt, pressed, released, held)` | functie | The throw (balls or bones) of one hero, on its own button. |
| 603 | `updateBall(dt)` | functie |  |
| 618 | `stepFlyBall(b, dt)` | functie | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 668 | `updateEggs(dt)` | functie |  |
| 698 | `enemyMul(x, y)` | functie | enemies slow down near a player on "Ușor" |
| 703 | `updateEnemies(dt)` | functie |  |
| 751 | `bossGoal()` | functie | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 755 | `bossBall(b)` | functie |  |
| 770 | `updateBoss(dt)` | functie |  |
| 822 | `hitBird(bd)` | functie | ---------- second game: big birds that pick a hero up and carry him a little way (it does not hurt) ---------- |
| 827 | `dropHero(bd)` | functie |  |
| 836 | `updateBirds(dt)` | functie |  |
| 860 | `stepProj(list, dt, spare)` | functie | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |
| 875 | `updateDecor(dt)` | functie | The reacting decor. Grass, clover, daisies, reeds, dandelions and leaves send up a little puff of leaves, petals or seeds and rustle when a hero walks past (a stomp makes the dandelions and leaves jump). Snails pull in and a ladybug flies off and comes back. Only what is near a hero or a ball reacts. |
| 902 | `updatePlay(dt)` | functie |  |
| 1020 | `camTarget(L, a, b)` | functie | Where the camera wants to be for two heroes: no side effects, so a test can ask the game itself. Rules: both heroes on screen; nothing of a hero (name included) above the band at the top (HUD_TOP, 08-draw.js); the camera may look up to HUD_TOP + 20 screen pixels above the top edge of the world, and that strip is painted sky. |

## 075-duel.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 29 | `duelDefs()` | functie sageata |  |
| 31 | `startDuel(kind = 'nest')` | functie | kind 'mid': the middle fight, the same as before. kind 'nest': the harder one at the nest, bigger and quicker. |
| 41 | `room(c)` | functie sageata | the nest guardian lands as close to its spot as it can; the middle one looks for the most open place near the middle (not the river bank, not a bridge) |
| 54 | `duelFighter()` | functie | Who the guardian goes after: the bravest player who is not hidden in the nest. |
| 64 | `duelWaiting()` | functie sageata | While a hero waits for the friend's help the fight rests: the guardian finishes what it was doing, hurts nobody and starts no new attack. |
| 66 | `duelSpares(h)` | functie sageata | Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. |
| 68 | `duelCanHurt(k, how)` | functie sageata | A tired guardian can always be hit. On "Ușor" every hit counts at any time, except on a guardian that is only waiting for a hero to be helped up. |
| 69 | `duelEggs(n)` | functie |  |
| 77 | `duelHit(k)` | functie |  |
| 89 | `duelBall(b)` | functie |  |
| 99 | `duelStomp(h)` | functie |  |
| 108 | `duelLob(n, slow)` | functie | throws n pinecones: the first where the target is going, the rest around |
| 116 | `duelSnap(x, y)` | functie | nearest spot a guardian can stand on |
| 122 | `updateDuel(dt)` | functie |  |
| 142 | `go(st)` | functie sageata |  |
| 143 | `cycle()` | functie sageata | George takes turns with his tricks |
| 144 | `tire()` | functie sageata |  |
| 205 | `plan()` | functie sageata |  |
| 243 | `duelSwoop(tg)` | functie | fly in a straight line through the place where the target stands |
| 253 | `heartPath(c, x, y, s)` | functie | ---------- drawing the guardians ---------- |
| 259 | `beetle(c, d, t, mood)` | metoda | the Beetle King: a big grumpy beetle with a tiny crown |
| 266 | `owl(c, d, t, mood)` | metoda |  |
| 280 | `crab(c, d, t, mood)` | metoda |  |
| 297 | `whirl(c, d, t, mood)` | metoda | a little whirlwind with eyes |
| 308 | `frog(c, d, t, mood)` | metoda |  |
| 321 | `chick(c, d, t, mood)` | metoda | Ciorel, Ciori's little nephew |
| 324 | `george(c, d, t, mood)` | metoda | George cel Rău (second game): the same painter as the boss, the size comes from the level |
| 328 | `drawDuelBoss(c)` | functie |  |
| 342 | `drawDuelGround(c)` | functie | Things on the ground during a mini-fight: where the next attack will land, shadows. (The shelter ring is in drawNestShelter.) |
| 344 | `red(a)` | functie sageata |  |
| 356 | `drawDuelTop(c)` | functie | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

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
| 93 | `drawRunTrail(c, h)` | functie | The trail of a running hero: three fading copies of him, and six speed lines behind. |
| 114 | `drawHeroFull(c, h)` | functie |  |
| 164 | `drawSmallHp(c, e, x, y)` | functie | Small enemies show how many hits they still take, once they were hit. |
| 168 | `drawBossTargets(c)` | functie |  |
| 181 | `drawProjWarn(c, list)` | functie | the spot where a thrown pinecone will land |
| 188 | `drawProjs(c, list)` | functie |  |
| 197 | `drawWorld(c)` | functie |  |
| 373 | `hintTarget()` | functie |  |
| 383 | `nearestEgg(h, reqOnly, maxD)` | functie | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 388 | `guideTarget(h)` | functie |  |
| 409 | `drawGuides(c)` | functie |  |
| 436 | `drawHints(c, v)` | functie |  |
| 486 | `pressLabel(k)` | functie sageata |  |
| 488 | `levelProgress()` | functie | How far the level is: eggs in groups, then the guardian, then the nest. |
| 491 | `seg(k)` | functie sageata |  |
| 500 | `drawProgress(c)` | functie |  |
| 529 | `drawBadge(c, k, x, y)` | functie |  |
| 547 | `downBanner()` | functie | "Ajută-l pe Boon! ○" while a friend is down and the seconds are running. It comes before any other banner. |
| 551 | `waitBanner()` | functie |  |
| 562 | `drawMidCard(c, ban)` | functie | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 621 | `drawHUD(c)` | functie |  |
| 626 | `drawPlay(c)` | functie |  |
| 633 | `drawEdgePulse(c)` | functie | The last three seconds: the edge of the screen breathes in the fallen hero's own color. Never red-dark, never black. |
| 643 | `drawNestShelter(c)` | functie | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 651 | `drawDecor(c, l, tp, vw, vh)` | functie | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 667 | `drawArenaBack(c)` | functie | the torches of fire around the arena |
| 671 | `drawThrone(c)` | functie |  |
| 678 | `drawGeorgeBoss(c, o, t)` | functie |  |

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
| 542 | `menuNav(o, key, rows)` | functie | ---------- menus: pause and settings ---------- A menu is a list of rows. A row is one of: go { label, ok() } a button opt { label, value, chg(dir) } a choice, changed with left / right (or OK) slide { label, v, chg(dir), set(v) } a volume slider, 0 to 1 text { label } a line of text, cannot be chosen |
| 557 | `drawMenu(c, t, title, rows, sel, o)` | functie |  |
| 597 | `pauseRows()` | functie | ---------- pause ---------- |
| 598 | `leave(go)` | functie sageata |  |
| 607 | `resumeGame()` | functie |  |
| 608 | `updatePause()` | functie |  |
| 614 | `drawPause(c, t)` | functie |  |
| 621 | `openSettings()` | functie | ---------- settings ---------- |
| 625 | `closeSettings()` | functie |  |
| 629 | `setMsg(m)` | functie |  |
| 630 | `setPage(page, p)` | functie |  |
| 631 | `settingsBack()` | functie |  |
| 635 | `toggleFullscreen()` | functie |  |
| 643 | `findSpeakers(k)` | functie |  |
| 660 | `pickSpeaker(k, d)` | functie |  |
| 672 | `captureKey(k, f)` | functie |  |
| 685 | `settingsRows()` | functie |  |
| 687 | `vol(label, id, test)` | functie sageata |  |
| 727 | `updateSettings(dt)` | functie |  |
| 740 | `drawPadTester(c, x, y, g, t)` | functie |  |
| 742 | `b(n)` | functie sageata |  |
| 770 | `drawPadBody(c, x, y, cw, k, t)` | functie |  |
| 772 | `step(n, yy, done, label, w)` | functie sageata |  |
| 777 | `small(str, yy, col)` | functie sageata |  |
| 790 | `drawSettings(c, t)` | functie |  |
| 803 | `restoreSpeakers(ask)` | functie | Chrome only tells the names of the speakers while it has the microphone permission, and for a page opened from a file it forgets that permission when the page is closed. So when the saved speaker is not in the list, the question is asked again (ask = true). If the speaker is still not there, the start screen says so: the sounds are then on the computer. |
| 815 | `startEnding()` | functie | ---------- the Sunset Festival ---------- |
| 844 | `updateEnding(dt)` | functie |  |
| 863 | `drawEndingL(c, t)` | functie | The end of the second game: the Rainbow Party. The crystals are the present, the heroes get medals, and little stars fly in and hug them. |
| 868 | `bob(k)` | functie sageata |  |
| 922 | `drawEnding(c, t)` | functie |  |
| 928 | `bob(k)` | functie sageata |  |

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
| 112 | `draw()` | functie |  |
| 133 | `frame(ts)` | functie |  |
