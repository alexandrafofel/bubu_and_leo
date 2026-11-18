<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa A. Toate functiile

Fiecare functie, functie sageata si metoda din cod, in ordinea din fisier. Coloana "Comentariul din cod" este textul scris chiar langa functie. Explicatiile pe larg sunt in capitolele din docs/.

Total: 486 intrari.

## 01-config.js

Nicio functie.

## 015-lang.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 8 | `isLupta()` | functie sageata |  |
| 12 | `applyGameConfig()` | functie | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 15 | `TG(id, k, ...a)` | functie | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 26 | `playerOf(k)` | functie sageata | which player (0 or 1) plays hero k |
| 211 | `T(k, a, b)` | functie | T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments. In the second game a text with the key 'L:key' takes the place of 'key' (its own title, its own words for crystals...). |
| 219 | `lvlName(def)` | functie sageata | {0} = how many goals the boss needs |
| 220 | `eggWord(n)` | functie sageata |  |
| 222 | `keyName(code)` | functie | Readable name of a keyboard key, for the "choose the keys" screen. |

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
| 43 | `blobPath(c, x, y, rx, ry, seed, wob, n)` | functie |  |
| 59 | `wash(c, x, y, rx, ry, col, o)` | functie | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 78 | `puff(c, x, y, rx, ry, fill, seed, edge, wob)` | functie | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 83 | `soft(c, x, y, rx, ry, col, alpha, seed)` | functie |  |
| 89 | `brushLine(c, pts, width, col, alpha, seed)` | functie | A wobbly brush line through points. |
| 103 | `makeCanvas(w, h)` | functie |  |
| 106 | `topColor(cv)` | functie | The colour of the very first pixel of a painting: the sky at the top. Used to fill the strip above the world when the camera looks a little higher than the painting goes (docs/24-sisteme-noi.md, S6). |
| 113 | `makePaper()` | functie |  |
| 120 | `samp(arr, w, u, v)` | functie sageata |  |
| 145 | `makeOverlay(tint, tintA, vig, night)` | functie | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 161 | `skyCols(t)` | functie |  |
| 169 | `paintSky(c, x, y, w, h, t, seed, o)` | functie |  |
| 195 | `paintNightSky(c, x, y, w, h, seed, o)` | functie | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 220 | `paintMountains(c, x, yBase, w, hgt, seed)` | functie | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 236 | `paintHills(c, x, yBase, w, hgt, t, seed, cols, night)` | functie | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 255 | `setFont(c, size, title, weight)` | functie | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 258 | `text(c, str, x, y, size, col, o)` | functie |  |
| 271 | `wrapLines(c, str, maxW, size, title)` | functie |  |
| 283 | `iconX(c, x, y, r, pulse)` | functie | The ✕ button as a painted icon (blue cross on a cream disc). |
| 293 | `iconSq(c, x, y, r, pulse)` | functie | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 304 | `iconO(c, x, y, r, pulse)` | functie | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 314 | `iconL3(c, x, y, r, t)` | functie | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 326 | `richText(c, str, x, y, size, col, o)` | functie |  |
| 341 | `starPath(c, x, y, r, rot)` | functie |  |
| 352 | `sprite(key, w, h, paint)` | functie | Things that never change are painted once and then stamped: much faster per frame. |
| 357 | `card(c, x, y, w, h, col, seed)` | functie |  |
| 362 | `paintCard(c, x, y, w, h, col, seed)` | functie |  |
| 365 | `p(dx, dy, sc, fill, a)` | functie sageata |  |

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
| 88 | `noise(bus, t, g, att, dec, type, f, f2, q)` | functie |  |
| 99 | `voc(bus, t, f0, f1, dur, g, m0, m1)` | functie | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 113 | `growl(bus, t, f0, f1, dur, g, rate)` | functie | A soft roar or growl: a low triangle that slides down, with a quick tremble (the "rrr"). Warm, never harsh. |
| 126 | `kalimba(bus, f, t, g)` | functie sageata | Bubu speaks low and round, Leo higher and brighter. ---- instruments --------------------------------------------------------- |
| 127 | `marimba(bus, f, t, g)` | functie sageata |  |
| 128 | `chime(bus, f, t, g)` | functie sageata |  |
| 129 | `flute(bus, f, t, dur, g)` | functie |  |
| 167 | `setKey(key)` | functie sageata | the name of a tune or of an ambience in the game being played |
| 168 | `makeSong(p)` | functie |  |
| 170 | `motif()` | functie sageata |  |
| 182 | `deg(p, d)` | functie sageata |  |
| 183 | `schedule(st, t)` | functie |  |
| 200 | `tick()` | functie |  |
| 225 | `ambience(key)` | functie |  |
| 226 | `music(key)` | functie |  |
| 327 | `syl(b, t, k, s, V)` | functie | One syllable. Two triangle waves (the note and its octave) go through two "mouth" filters; a little of the plain note keeps the tune clear. Loud enough to be heard next to the other sounds, also in a controller's small speaker. |
| 345 | `talk(k, key)` | functie | Talk(k, word): hero k says one of its words. Routed like the hero's other sounds (own speaker when one was chosen). |
| 363 | `egg(b, t, n)` | metoda | --- the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) --- |
| 364 | `star(b, t)` | metoda |  |
| 365 | `giant(b, t)` | metoda |  |
| 366 | `stomp(b, t)` | metoda |  |
| 367 | `kick(b, t, p)` | metoda |  |
| 368 | `bounce(b, t)` | metoda |  |
| 369 | `bonk(b, t)` | metoda |  |
| 370 | `drop(b, t)` | metoda |  |
| 371 | `squelch(b, t)` | metoda |  |
| 372 | `step(b, t, x)` | metoda | x = hero * 2 + (left or right foot) |
| 378 | `wake(b, t)` | metoda | --- the world (volume "Sunete ambientale") --- |
| 379 | `stun(b, t)` | metoda |  |
| 380 | `pop(b, t)` | metoda |  |
| 381 | `rustle(b, t)` | metoda |  |
| 382 | `butterfly(b, t)` | metoda |  |
| 383 | `wave(b, t)` | metoda |  |
| 384 | `win(b, t)` | metoda |  |
| 385 | `caw(b, t)` | metoda |  |
| 386 | `whoosh(b, t)` | metoda |  |
| 387 | `swish(b, t)` | metoda |  |
| 388 | `lantern(b, t)` | metoda |  |
| 389 | `firework(b, t)` | metoda |  |
| 390 | `ui(b, t)` | metoda |  |
| 391 | `no(b, t)` | metoda |  |
| 392 | `ok(b, t)` | metoda |  |
| 393 | `thud(b, t)` | metoda |  |
| 394 | `goal(b, t)` | metoda |  |
| 395 | `crack(b, t)` | metoda |  |
| 396 | `splash(b, t)` | metoda |  |
| 397 | `tonk(b, t)` | metoda | the ball bounces off a guardian that is not tired yet |
| 398 | `warn(b, t)` | metoda | a guardian gets ready to attack |
| 399 | `squeak(b, t, p)` | metoda | a guardian got hit |
| 400 | `tired(b, t)` | metoda |  |
| 401 | `duel(b, t)` | metoda |  |
| 402 | `flee(b, t)` | metoda |  |
| 403 | `heal(b, t)` | metoda | a friend helped a hero up |
| 404 | `grab(b, t)` | metoda | a bird picks a hero up |
| 405 | `poof(b, t)` | metoda | a small enemy disappears |
| 406 | `bird(b, t)` | metoda | a big bird is coming |
| 411 | `egg(b, t, n)` | metoda | a crystal rings like glass |
| 412 | `star(b, t)` | metoda |  |
| 413 | `giant(b, t)` | metoda |  |
| 414 | `stomp(b, t)` | metoda | Boon's claws: three quick swishes |
| 415 | `kick(b, t, p)` | metoda | Killer's kick: a springy "boing" |
| 416 | `bounce(b, t)` | metoda |  |
| 417 | `bonk(b, t)` | metoda | a hero shrinks |
| 418 | `heal(b, t)` | metoda | a hero grows back |
| 419 | `drop(b, t)` | metoda |  |
| 420 | `squelch(b, t)` | metoda |  |
| 421 | `step(b, t, x)` | metoda |  |
| 426 | `wake(b, t)` | metoda | a robot switches on: beep-beep |
| 427 | `stun(b, t)` | metoda | a robot runs down |
| 428 | `poof(b, t)` | metoda |  |
| 429 | `caw(b, t)` | metoda | George's roar: low and warm, never harsh |
| 430 | `pop(b, t)` | metoda |  |
| 431 | `rustle(b, t)` | metoda |  |
| 432 | `butterfly(b, t)` | metoda | the rocket |
| 433 | `wave(b, t)` | metoda |  |
| 434 | `win(b, t)` | metoda |  |
| 435 | `lantern(b, t)` | metoda | a torch catches fire |
| 436 | `warn(b, t)` | metoda |  |
| 437 | `tonk(b, t)` | metoda |  |
| 438 | `squeak(b, t, p)` | metoda | George got hit |
| 439 | `tired(b, t)` | metoda |  |
| 440 | `duel(b, t)` | metoda |  |
| 441 | `flee(b, t)` | metoda |  |
| 442 | `goal(b, t)` | metoda |  |
| 443 | `dash(b, t)` | metoda | starting to run: a short soft "whoosh" going up |
| 449 | `play(name, arg, k, vol)` | functie | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 460 | `canSink()` | functie sageata | ---- the controller's own speaker (only when the system shows it as an audio output) ---- |
| 462 | `listOutputs(ask)` | functie | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 471 | `setSink(k, dev)` | functie | dev = { id, label } or null for the computer's speakers |
| 491 | `swapOuts()` | functie |  |
| 497 | `setVol(k, v)` | metoda |  |
| 498 | `setDuck(d)` | metoda |  |
| 505 | `init()` | metoda |  |
| 510 | `pick()` | metoda |  |
| 516 | `say(txt, keep)` | metoda |  |
| 531 | `stop()` | metoda |  |

## 04-input.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 10 | `Input(()` | functie sageata | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) or the keyboard. ✕ (button 0) = first power, ○ (button 1) = help the friend, □ (button 2) = second power, L3 (button 10, pressing the left stick) = run. Each hero is played with what was chosen in Setări: a controller ('pad') or the keyboard ('kb') with its own keys. Menus listen to everything: every controller, the arrow keys, Enter, Space, Backspace and the players' own keys. |
| 12 | `kd(code)` | functie sageata |  |
| 13 | `mk()` | functie sageata |  |
| 35 | `pads()` | functie |  |
| 40 | `assigned(i)` | functie |  |
| 41 | `freeSlot()` | functie | the hero a newly pressed controller will play |
| 48 | `poll(dt)` | functie |  |
| 55 | `b(n)` | functie sageata |  |
| 76 | `b(n)` | functie sageata |  |
| 131 | `rumble(k, strong, weak, ms, force)` | functie | returns false when this controller cannot vibrate |
| 144 | `setCtrl(k, kind)` | functie | Settings: play hero k with a controller or with the keyboard. |
| 149 | `unbind(k)` | functie |  |
| 150 | `swap()` | functie | the two players trade heroes: controllers go with the players |
| 157 | `capture(f)` | metoda |  |
| 158 | `muteHeld()` | metoda |  |
| 159 | `any(f)` | metoda |  |
| 160 | `padCount()` | metoda |  |

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
| 29 | `drawBoon(c, x, y, o)` | functie | BOON: the little one's hero. Round teal body, a dome of blue spikes on the back, long tan neck, small blue head, lime legs and a long lime tail. o.claw (0 to 1) = the claws are out and spinning. |
| 40 | `leg(lx, lift, fwd)` | functie sageata | legs with little claws |
| 82 | `drawKiller(c, x, y, o)` | functie | KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. |
| 89 | `leg(lx, lift, fwd, seed)` | functie sageata | legs in blue, big red boots |
| 99 | `arm(sd, sw)` | functie sageata | long arms, like in the drawing (up in the air when happy) |
| 127 | `drawBallL(c, x, y, r, spin)` | functie | Killer's ball, like in the drawing: white, with hexagons. |
| 146 | `drawGeorge(c, x, y, o)` | functie | GEORGE CEL RĂU: a carnotaurus with a crown. Pink body, a head in rainbow colors with a blue snout full of teeth, a striped horn-crown, thin brown legs and arms, a tail that turns from green to blue. mood: calm \| angry \| dizzy \| scared |
| 197 | `drawGeorgeCrown(c, x, y, s, rot)` | functie |  |
| 209 | `paintRobotBody(c, b, t)` | functie | One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. |
| 227 | `drawRobot(c, b, t)` | functie |  |
| 246 | `drawSnail(c, x, y, t, o)` | functie | A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. |
| 271 | `drawBird(c, x, y, o)` | functie | A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. |
| 290 | `gemPath(c, r)` | functie | A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. |
| 293 | `drawCrystal(c, x, y, r, t, seed, z, hue)` | functie |  |
| 314 | `drawSecretStar(c, x, y, r, t, z)` | functie | The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. |
| 326 | `drawRocket(c, x, y, t, s)` | functie | The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. |
| 340 | `drawRockProj(c, x, y, rot, r)` | functie | Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). |
| 345 | `drawSpear(c, x, y, ang, s)` | functie |  |
| 353 | `drawSoldier(c, so, t)` | functie | One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. |

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
| 121 | `genLevel(idx, seed)` | functie |  |
| 130 | `inW(cx, cy)` | functie sageata |  |
| 131 | `ci(x, y)` | functie sageata |  |
| 132 | `mark(x, y, rad, bits)` | functie sageata |  |
| 136 | `region(k)` | functie sageata |  |
| 137 | `dv(arr, k)` | functie sageata |  |
| 138 | `starRegion(i)` | functie sageata |  |
| 154 | `pathDist(x, y)` | functie sageata |  |
| 159 | `setWater(cx, cy)` | functie sageata | ---- water ---------------------------------------------------------------- |
| 181 | `crossing(by, list)` | functie sageata |  |
| 192 | `pathFar(x, y, d)` | functie sageata |  |
| 193 | `areaClear(x, y, rad)` | functie sageata |  |
| 200 | `addSolid(x, y, rad, kind, extra)` | functie sageata |  |
| 201 | `mudEllipse(x, y, rx, ry)` | functie sageata |  |
| 291 | `spotFree(x, y, rad)` | functie sageata | ---- trees, rocks, haystacks ---------------------------------------------- |
| 299 | `scatter(count, rmin, rmax, kind, gap)` | functie sageata |  |
| 341 | `reachCells(x, y, r0, r1, bits)` | functie sageata |  |
| 349 | `shuffle(a)` | functie sageata |  |
| 352 | `addBeetle(x, y)` | functie sageata | ---- beetles --------------------------------------------------------------- |
| 401 | `far(x, y, d)` | functie sageata |  |
| 443 | `makeDecor(L, seed)` | functie |  |
| 446 | `pickType()` | functie sageata |  |
| 460 | `paintDecor(cc, type, v, seed)` | functie | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 506 | `paintDecorL(cc, type, v, r, pick)` | functie | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 555 | `decorSprite(type, v)` | functie sageata |  |
| 556 | `paintDecorStill(c, L)` | functie | all the decor that stays put goes into the level picture, once |
| 560 | `paintTree(c, t, P, ox, oy)` | functie |  |
| 581 | `paintCrystalRock(c, x, y, R, col, seed)` | functie | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 586 | `paintShroom(c, x, y, R, seed)` | functie |  |
| 595 | `paintTorch(c, x, y)` | functie |  |
| 600 | `drawFlame(c, x, y, t, s, lit)` | functie | a torch flame that flickers (lit: 0 to 1) |
| 609 | `paintTotem(c, x, y)` | functie | x,y = base center. The totem rises about 200 px; the pinwheel turns on top. |
| 621 | `drawPinwheel(c, x, y, ang)` | functie | the rainbow pinwheel on top of a totem: it turns faster when the wind blows |
| 627 | `paintRock(c, x, y, R, col, seed)` | functie |  |
| 634 | `paintHay(c, x, y, R, seed)` | functie |  |
| 646 | `paintMillTower(c, x, y)` | functie | x,y = base center. Tower rises 250 px. |
| 648 | `body(inset, col, a)` | functie sageata |  |
| 657 | `drawMillBlades(c, x, y, ang)` | functie |  |
| 669 | `paintLantern(c, x, y)` | functie |  |
| 675 | `cellBlobs(c, L, type, rad, col, alpha, seed, jit)` | functie |  |
| 686 | `paintLevel(L)` | functie |  |
| 688 | `typeAt(x, y)` | functie sageata |  |
| 807 | `room(grow, col, al)` | functie sageata | rounded cave room plus the short tunnel to the waterfall |
| 838 | `paintVines(c, x, y, w, len, seed, sway, P)` | functie | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 850 | `paintDoor(c, x, y)` | functie | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 861 | `finishPaint(c, w, h, skyT, r, night)` | functie | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 873 | `genBoss()` | functie | The boss arena: one screen, the tallest tree in the valley. |
| 915 | `genArena()` | functie | The last level of the second game: George's arena. A clearing with mountains behind it, torches of fire all around, soldiers with spears, and in the middle the stone throne on which George sits. |
| 952 | `slab(w, y0, h, col)` | functie sageata |  |

## 07-play.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 7 | `D(k)` | functie sageata |  |
| 8 | `rank(k)` | functie sageata | 0 Ușor, 1 Normal, 2 Greu |
| 12 | `buildLevel(idx)` | functie | Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. |
| 19 | `makeHero(k, x, y)` | functie |  |
| 25 | `makeEgg(x, y, o)` | functie |  |
| 28 | `startPlay(L)` | functie |  |
| 51 | `startWave(k)` | functie |  |
| 64 | `part(x, y, o)` | functie | ---------- particles ---------- |
| 68 | `burst(x, y, n, o)` | functie |  |
| 78 | `stepParts(dt)` | functie |  |
| 86 | `collide(L, e, r, isBall)` | functie | ---------- collisions ---------- |
| 111 | `collectEgg(e, k)` | functie | ---------- eggs and stars ---------- |
| 129 | `rainbowAdd(e, k)` | functie | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 137 | `collectStar(s, k)` | functie |  |
| 143 | `checkWave()` | functie | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 153 | `openNest()` | functie |  |
| 154 | `shakeTree(t, power, byStomp)` | functie |  |
| 170 | `hitHero(h, sx, sy)` | functie |  |
| 192 | `getUp(h, by)` | functie |  |
| 201 | `tryRescue(h)` | functie | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 210 | `updateRescue(dt)` | functie |  |
| 222 | `hurtSmall(e)` | functie | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 232 | `powerSweep(h, id)` | functie | What the first hero's power does to everything around him. id = this stomp (or this spin of the claws): every enemy, tree and guardian feels it once per id. |
| 251 | `doStomp(h)` | functie |  |
| 260 | `startPower(h)` | functie | The first hero starts his power: Bubu jumps and stomps; Boon's claws grow and spin around him (a shield that also gathers crystals). |
| 269 | `bossShake(h)` | functie | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 281 | `newBall(x, y, vx, vy, power, life, kick, size, hop)` | functie |  |
| 284 | `ballReady()` | functie sageata | all balls home, or the cooldown is over |
| 286 | `kickBall(h, power, ax, ay)` | functie | One kick sends n balls out in a circle, so Leo's power goes in every direction. Stick direction = the first ball. |
| 302 | `recallBalls()` | functie | A second press while the balls are still out (inside the cooldown) calls every ball back to Leo. |
| 309 | `canRun(h)` | functie | Running (L3). One press with the stick tilted starts it; it lasts until the stick is let go. canRun says when a hero is allowed to run at all; everything that stops a run is in one place, below. |
| 314 | `startRun(h)` | functie |  |
| 322 | `stopRun(h)` | functie |  |
| 323 | `updateRun(h, s, ix, iy, dt)` | functie |  |
| 340 | `updateHero(h, dt)` | functie |  |
| 455 | `updateBall(dt)` | functie |  |
| 467 | `stepFlyBall(b, dt, h)` | functie | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 514 | `updateEggs(dt)` | functie |  |
| 539 | `enemyMul(x, y)` | functie | enemies slow down near a player on "Ușor" |
| 544 | `updateEnemies(dt)` | functie |  |
| 592 | `bossGoal()` | functie | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 596 | `bossBall(b)` | functie |  |
| 611 | `updateBoss(dt)` | functie |  |
| 663 | `hitBird(bd)` | functie | ---------- second game: big birds that pick a hero up and carry him a little way (it does not hurt) ---------- |
| 668 | `dropHero(bd)` | functie |  |
| 677 | `updateBirds(dt)` | functie |  |
| 701 | `stepProj(list, dt, spare)` | functie | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |
| 716 | `updateDecor(dt)` | functie | The reacting decor. Grass, clover, daisies, reeds, dandelions and leaves send up a little puff of leaves, petals or seeds and rustle when a hero walks past (a stomp makes the dandelions and leaves jump). Snails pull in and a ladybug flies off and comes back. Only what is near a hero or a ball reacts. |
| 743 | `updatePlay(dt)` | functie |  |
| 856 | `camTarget(L, a, b)` | functie | Where the camera wants to be for two heroes: no side effects, so a test can ask the game itself. Rules: both heroes on screen; nothing of a hero (name included) above the band at the top (HUD_TOP, 08-draw.js); the camera may look up to HUD_TOP + 20 screen pixels above the top edge of the world, and that strip is painted sky. |

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
| 11 | `heroTop(k)` | functie sageata | how tall each hero is: where the stars, the name and the ○ go |
| 18 | `heroInWay(x, y, w, h, only)` | functie | Is a hero standing where we want to write? Used by the few texts that stay in the world, so they never cover anybody. only: check just this hero. The box is the painted body, without the name above it. |
| 22 | `drawParts(c)` | functie |  |
| 33 | `drawClawRing(c, h)` | functie | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 47 | `drawRunTrail(c, h)` | functie | The trail of a running hero: three fading copies of him, and six speed lines behind. |
| 68 | `drawHeroFull(c, h)` | functie |  |
| 117 | `drawSmallHp(c, e, x, y)` | functie | Small enemies show how many hits they still take, once they were hit. |
| 121 | `drawBossTargets(c)` | functie |  |
| 134 | `drawProjWarn(c, list)` | functie | the spot where a thrown pinecone will land |
| 141 | `drawProjs(c, list)` | functie |  |
| 150 | `drawWorld(c)` | functie |  |
| 304 | `hintTarget()` | functie |  |
| 314 | `nearestEgg(h, reqOnly, maxD)` | functie | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 319 | `guideTarget(h)` | functie |  |
| 340 | `drawGuides(c)` | functie |  |
| 367 | `drawHints(c, v)` | functie |  |
| 396 | `pressLabel(k)` | functie sageata |  |
| 398 | `levelProgress()` | functie | How far the level is: eggs in groups, then the guardian, then the nest. |
| 401 | `seg(k)` | functie sageata |  |
| 410 | `drawProgress(c)` | functie |  |
| 439 | `drawBadge(c, k, x, y)` | functie |  |
| 456 | `waitBanner()` | functie | "We wait for X in the nest": it used to be written in the world, over the nest. Now it is a banner in the band. |
| 463 | `drawMidCard(c, ban)` | functie | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 515 | `drawHUD(c)` | functie |  |
| 520 | `drawPlay(c)` | functie |  |
| 526 | `drawNestShelter(c)` | functie | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 534 | `drawDecor(c, l, tp, vw, vh)` | functie | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 550 | `drawArenaBack(c)` | functie | the torches of fire around the arena |
| 554 | `drawThrone(c)` | functie |  |
| 561 | `drawGeorgeBoss(c, o, t)` | functie |  |

## 09-screens.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 11 | `heroOf(p)` | functie sageata | which hero (0 Bubu, 1 Leo) player p plays |
| 20 | `emptyResult()` | functie sageata | One save for everything. The settings are shared by the two games. Each game keeps its own progress: the first game at the top of the save (as before), the second one in g2. Progress of a game (a "slot"): level the chapter "Continue" starts (see chapters() in 06-level.js) max how far the players have ever got: chapters 0 .. max are open on the Chapters screen results the best result of every chapter played: { eggs, stars, med: [3 medals] } eggs, stars the team total = the sum of results. Still written, so that an older version of the game can read the file. |
| 21 | `sumResults(res)` | functie |  |
| 23 | `migrateSave(d)` | functie | A save from before chapters (version 3 or older) becomes version 4. It changes only what is missing, so it can run again. |
| 38 | `load()` | metoda |  |
| 39 | `slot(id)` | metoda | the progress of one game |
| 41 | `own()` | metoda | the progress of the chosen game, made if it is not there yet |
| 43 | `newGame()` | metoda | "New game": the progress of the chosen game is erased. The other game and the settings stay. |
| 46 | `finish(i, r)` | metoda | Chapter i is over with result r. The chapter keeps its best result, "Continue" moves on only if this was the chapter it pointed at, and the chapters up to the next one open. |
| 57 | `write()` | metoda |  |
| 65 | `apply()` | metoda | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 83 | `hasProgress(id)` | metoda |  |
| 85 | `maxOpen(id)` | metoda | the furthest chapter open on the Chapters screen (-1: no chapter was ever finished, the button is not shown) |
| 90 | `hitAdd(x, y, w, h, id, v, act, val)` | functie | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 91 | `hitFind(p)` | functie |  |
| 97 | `pressedGo()` | functie sageata | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 99 | `pressText()` | functie | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 105 | `fitText(c, str, x, y, size, maxW, col, o)` | functie |  |
| 111 | `swapHeroes()` | functie | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 116 | `cycleDiff(k, d)` | functie |  |
| 117 | `setLanguage(l)` | functie |  |
| 123 | `paintMeadowScene(skyT, horizon, seed)` | functie |  |
| 142 | `paintJungleScene(horizon, seed)` | functie | The backdrop of the second game: the jungle at night, under the moon and the northern lights. |
| 160 | `titleBackdrop(id)` | functie | The start-screen backdrop of each game is painted once, the first time it is needed. |
| 165 | `setGame(id)` | functie | Sets up the game (the second game is the only one now): its heroes, villain and boss values, its texts, pictures, music and progress. |
| 172 | `initScreens()` | functie |  |
| 175 | `drawBackdrop(c, cv)` | functie |  |
| 176 | `prompt(c, str, x, y, size, t)` | functie |  |
| 180 | `drawBoot(c, t)` | functie | ---------- boot + title ---------- |
| 189 | `titleMenu()` | functie | The buttons under the heroes: "Continue: ...", "Chapters", "New game". At the very first start only one, and it says "Start!". |
| 197 | `titleGo()` | functie | What the chosen button does, once every player who joined is "Ready!". |
| 206 | `askYesNo(title, sub, yes, ok)` | functie | A small yes / no question over the start screen or the pause. "No" is the one shown first, so a child who keeps pressing ✕ cannot erase anything by chance. ○ or Backspace also say no. |
| 207 | `askRows()` | functie |  |
| 208 | `updateAsk()` | functie |  |
| 209 | `drawAsk(c, t)` | functie |  |
| 210 | `updateTitle(dt)` | functie |  |
| 233 | `drawGear(c, x, y, r, col, t)` | functie |  |
| 240 | `drawTitle(c, t)` | functie |  |
| 303 | `chapterLayout()` | functie |  |
| 313 | `Game.toChapters()` | functie |  |
| 320 | `updateChapters(dt)` | functie |  |
| 325 | `move(row, col)` | functie sageata |  |
| 338 | `chapterPic(i, ch)` | functie | the little picture at the top of a card: the level's sky and ground and the three pictures of its story card. Painted once. |
| 351 | `drawCrownIcon(c, x, y, s)` | functie |  |
| 360 | `drawPadlock(c, x, y, s)` | functie |  |
| 369 | `drawChapterCard(c, i, ch, p, t, open)` | functie |  |
| 399 | `drawChapters(c, t)` | functie |  |
| 411 | `drawIntroIcon(c, kind, x, y, t, Lx)` | functie | ---------- level story card ---------- |
| 432 | `drawIntroIconL(c, kind, x, y, t, Lx)` | functie | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 450 | `drawDim(c, a)` | functie |  |
| 451 | `drawIntro(c, t)` | functie |  |
| 463 | `drawLoading(c, t)` | functie |  |
| 470 | `levelMedals()` | functie | Three little medals give the bigger player something extra to aim for. |
| 471 | `drawMedal(c, i, x, y, got, t)` | functie |  |
| 486 | `drawLevelEnd(c, t)` | functie |  |
| 518 | `menuNav(o, key, rows)` | functie | ---------- menus: pause and settings ---------- A menu is a list of rows. A row is one of: go { label, ok() } a button opt { label, value, chg(dir) } a choice, changed with left / right (or OK) slide { label, v, chg(dir), set(v) } a volume slider, 0 to 1 text { label } a line of text, cannot be chosen |
| 533 | `drawMenu(c, t, title, rows, sel, o)` | functie |  |
| 573 | `pauseRows()` | functie | ---------- pause ---------- |
| 574 | `leave(go)` | functie sageata |  |
| 583 | `resumeGame()` | functie |  |
| 584 | `updatePause()` | functie |  |
| 590 | `drawPause(c, t)` | functie |  |
| 597 | `openSettings()` | functie | ---------- settings ---------- |
| 601 | `closeSettings()` | functie |  |
| 605 | `setMsg(m)` | functie |  |
| 606 | `setPage(page, p)` | functie |  |
| 607 | `settingsBack()` | functie |  |
| 611 | `toggleFullscreen()` | functie |  |
| 619 | `findSpeakers(k)` | functie |  |
| 636 | `pickSpeaker(k, d)` | functie |  |
| 648 | `captureKey(k, f)` | functie |  |
| 661 | `settingsRows()` | functie |  |
| 663 | `vol(label, id, test)` | functie sageata |  |
| 703 | `updateSettings(dt)` | functie |  |
| 716 | `drawPadTester(c, x, y, g, t)` | functie |  |
| 718 | `b(n)` | functie sageata |  |
| 743 | `drawPadBody(c, x, y, cw, k, t)` | functie |  |
| 745 | `step(n, yy, done, label, w)` | functie sageata |  |
| 750 | `small(str, yy, col)` | functie sageata |  |
| 763 | `drawSettings(c, t)` | functie |  |
| 776 | `restoreSpeakers(ask)` | functie | Chrome only tells the names of the speakers while it has the microphone permission, and for a page opened from a file it forgets that permission when the page is closed. So when the saved speaker is not in the list, the question is asked again (ask = true). If the speaker is still not there, the start screen says so: the sounds are then on the computer. |
| 788 | `startEnding()` | functie | ---------- the Sunset Festival ---------- |
| 817 | `updateEnding(dt)` | functie |  |
| 836 | `drawEndingL(c, t)` | functie | The end of the second game: the Rainbow Party. The crystals are the present, the heroes get medals, and little stars fly in and hug them. |
| 841 | `bob(k)` | functie sageata |  |
| 895 | `drawEnding(c, t)` | functie |  |
| 901 | `bob(k)` | functie sageata |  |

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
| 51 | `finishChapter()` | functie | The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. |
| 56 | `Game.levelEnd()` | functie |  |
| 57 | `Game.toEnding()` | functie |  |
| 59 | `update(dt)` | functie |  |
| 97 | `draw()` | functie |  |
| 117 | `frame(ts)` | functie |  |
