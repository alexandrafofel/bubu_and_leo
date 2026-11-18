<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa A. Toate functiile

Fiecare functie, functie sageata si metoda din cod, in ordinea din fisier. Coloana "Comentariul din cod" este textul scris chiar langa functie. Explicatiile pe larg sunt in capitolele din docs/.

Total: 477 intrari.

## 01-config.js

Nicio functie.

## 015-lang.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 8 | `isLupta()` | functie sageata |  |
| 12 | `applyGameConfig()` | functie | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 14 | `TG(id, k, ...a)` | functie | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 25 | `playerOf(k)` | functie sageata | which player (0 or 1) plays hero k |
| 210 | `T(k, a, b)` | functie | T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments. In the second game a text with the key 'L:key' takes the place of 'key' (its own title, its own words for crystals...). |
| 218 | `lvlName(def)` | functie sageata | {0} = how many goals the boss needs |
| 219 | `eggWord(n)` | functie sageata |  |
| 221 | `keyName(code)` | functie | Readable name of a keyboard key, for the "choose the keys" screen. |

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
| 107 | `makePaper()` | functie |  |
| 114 | `samp(arr, w, u, v)` | functie sageata |  |
| 139 | `makeOverlay(tint, tintA, vig, night)` | functie | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 155 | `skyCols(t)` | functie |  |
| 163 | `paintSky(c, x, y, w, h, t, seed, o)` | functie |  |
| 189 | `paintNightSky(c, x, y, w, h, seed, o)` | functie | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 214 | `paintMountains(c, x, yBase, w, hgt, seed)` | functie | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 230 | `paintHills(c, x, yBase, w, hgt, t, seed, cols, night)` | functie | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 249 | `setFont(c, size, title, weight)` | functie | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 252 | `text(c, str, x, y, size, col, o)` | functie |  |
| 265 | `wrapLines(c, str, maxW, size, title)` | functie |  |
| 277 | `iconX(c, x, y, r, pulse)` | functie | The ✕ button as a painted icon (blue cross on a cream disc). |
| 287 | `iconSq(c, x, y, r, pulse)` | functie | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 297 | `richText(c, str, x, y, size, col, o)` | functie | Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. |
| 311 | `starPath(c, x, y, r, rot)` | functie |  |
| 322 | `sprite(key, w, h, paint)` | functie | Things that never change are painted once and then stamped: much faster per frame. |
| 327 | `card(c, x, y, w, h, col, seed)` | functie |  |
| 332 | `paintCard(c, x, y, w, h, col, seed)` | functie |  |
| 335 | `p(dx, dy, sc, fill, a)` | functie sageata |  |

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
| 325 | `syl(b, t, k, s, V)` | functie | One syllable. Two triangle waves (the note and its octave) go through two "mouth" filters; a little of the plain note keeps the tune clear. Loud enough to be heard next to the other sounds, also in a controller's small speaker. |
| 343 | `talk(k, key)` | functie | Talk(k, word): hero k says one of its words. Routed like the hero's other sounds (own speaker when one was chosen). |
| 361 | `egg(b, t, n)` | metoda | --- the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) --- |
| 362 | `star(b, t)` | metoda |  |
| 363 | `giant(b, t)` | metoda |  |
| 364 | `stomp(b, t)` | metoda |  |
| 365 | `kick(b, t, p)` | metoda |  |
| 366 | `bounce(b, t)` | metoda |  |
| 367 | `bonk(b, t)` | metoda |  |
| 368 | `drop(b, t)` | metoda |  |
| 369 | `squelch(b, t)` | metoda |  |
| 370 | `step(b, t, x)` | metoda | x = hero * 2 + (left or right foot) |
| 376 | `wake(b, t)` | metoda | --- the world (volume "Sunete ambientale") --- |
| 377 | `stun(b, t)` | metoda |  |
| 378 | `pop(b, t)` | metoda |  |
| 379 | `rustle(b, t)` | metoda |  |
| 380 | `butterfly(b, t)` | metoda |  |
| 381 | `wave(b, t)` | metoda |  |
| 382 | `win(b, t)` | metoda |  |
| 383 | `caw(b, t)` | metoda |  |
| 384 | `whoosh(b, t)` | metoda |  |
| 385 | `swish(b, t)` | metoda |  |
| 386 | `lantern(b, t)` | metoda |  |
| 387 | `firework(b, t)` | metoda |  |
| 388 | `ui(b, t)` | metoda |  |
| 389 | `no(b, t)` | metoda |  |
| 390 | `ok(b, t)` | metoda |  |
| 391 | `thud(b, t)` | metoda |  |
| 392 | `goal(b, t)` | metoda |  |
| 393 | `crack(b, t)` | metoda |  |
| 394 | `splash(b, t)` | metoda |  |
| 395 | `tonk(b, t)` | metoda | the ball bounces off a guardian that is not tired yet |
| 396 | `warn(b, t)` | metoda | a guardian gets ready to attack |
| 397 | `squeak(b, t, p)` | metoda | a guardian got hit |
| 398 | `tired(b, t)` | metoda |  |
| 399 | `duel(b, t)` | metoda |  |
| 400 | `flee(b, t)` | metoda |  |
| 401 | `heal(b, t)` | metoda | a friend helped a hero up |
| 402 | `grab(b, t)` | metoda | a bird picks a hero up |
| 403 | `poof(b, t)` | metoda | a small enemy disappears |
| 404 | `bird(b, t)` | metoda | a big bird is coming |
| 409 | `egg(b, t, n)` | metoda | a crystal rings like glass |
| 410 | `star(b, t)` | metoda |  |
| 411 | `giant(b, t)` | metoda |  |
| 412 | `stomp(b, t)` | metoda | Boon's claws: three quick swishes |
| 413 | `kick(b, t, p)` | metoda | Killer's kick: a springy "boing" |
| 414 | `bounce(b, t)` | metoda |  |
| 415 | `bonk(b, t)` | metoda | a hero shrinks |
| 416 | `heal(b, t)` | metoda | a hero grows back |
| 417 | `drop(b, t)` | metoda |  |
| 418 | `squelch(b, t)` | metoda |  |
| 419 | `step(b, t, x)` | metoda |  |
| 424 | `wake(b, t)` | metoda | a robot switches on: beep-beep |
| 425 | `stun(b, t)` | metoda | a robot runs down |
| 426 | `poof(b, t)` | metoda |  |
| 427 | `caw(b, t)` | metoda | George's roar: low and warm, never harsh |
| 428 | `pop(b, t)` | metoda |  |
| 429 | `rustle(b, t)` | metoda |  |
| 430 | `butterfly(b, t)` | metoda | the rocket |
| 431 | `wave(b, t)` | metoda |  |
| 432 | `win(b, t)` | metoda |  |
| 433 | `lantern(b, t)` | metoda | a torch catches fire |
| 434 | `warn(b, t)` | metoda |  |
| 435 | `tonk(b, t)` | metoda |  |
| 436 | `squeak(b, t, p)` | metoda | George got hit |
| 437 | `tired(b, t)` | metoda |  |
| 438 | `duel(b, t)` | metoda |  |
| 439 | `flee(b, t)` | metoda |  |
| 440 | `goal(b, t)` | metoda |  |
| 444 | `play(name, arg, k)` | functie | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 452 | `canSink()` | functie sageata | ---- the controller's own speaker (only when the system shows it as an audio output) ---- |
| 454 | `listOutputs(ask)` | functie | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 463 | `setSink(k, dev)` | functie | dev = { id, label } or null for the computer's speakers |
| 483 | `swapOuts()` | functie |  |
| 489 | `setVol(k, v)` | metoda |  |
| 490 | `setDuck(d)` | metoda |  |
| 497 | `init()` | metoda |  |
| 502 | `pick()` | metoda |  |
| 508 | `say(txt, keep)` | metoda |  |
| 523 | `stop()` | metoda |  |

## 04-input.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 9 | `Input(()` | functie sageata | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) or the keyboard. ✕ (button 0) = power, □ (button 2) = help the friend. Each hero is played with what was chosen in Setări: a controller ('pad') or the keyboard ('kb') with its own keys. Menus listen to everything: every controller, the arrow keys, Enter, Space, Backspace and the players' own keys. |
| 11 | `kd(code)` | functie sageata |  |
| 12 | `mk()` | functie sageata |  |
| 31 | `pads()` | functie |  |
| 36 | `assigned(i)` | functie |  |
| 37 | `freeSlot()` | functie | the hero a newly pressed controller will play |
| 44 | `poll(dt)` | functie |  |
| 51 | `b(n)` | functie sageata |  |
| 72 | `b(n)` | functie sageata |  |
| 125 | `rumble(k, strong, weak, ms, force)` | functie | returns false when this controller cannot vibrate |
| 138 | `setCtrl(k, kind)` | functie | Settings: play hero k with a controller or with the keyboard. |
| 143 | `unbind(k)` | functie |  |
| 144 | `swap()` | functie | the two players trade heroes: controllers go with the players |
| 151 | `capture(f)` | metoda |  |
| 152 | `muteHeld()` | metoda |  |
| 153 | `any(f)` | metoda |  |
| 154 | `padCount()` | metoda |  |

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
| 24 | `makeEgg(x, y, o)` | functie |  |
| 27 | `startPlay(L)` | functie |  |
| 50 | `startWave(k)` | functie |  |
| 63 | `part(x, y, o)` | functie | ---------- particles ---------- |
| 67 | `burst(x, y, n, o)` | functie |  |
| 77 | `stepParts(dt)` | functie |  |
| 85 | `collide(L, e, r, isBall)` | functie | ---------- collisions ---------- |
| 110 | `collectEgg(e, k)` | functie | ---------- eggs and stars ---------- |
| 128 | `rainbowAdd(e, k)` | functie | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 136 | `collectStar(s, k)` | functie |  |
| 142 | `checkWave()` | functie | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 152 | `openNest()` | functie |  |
| 153 | `shakeTree(t, power, byStomp)` | functie |  |
| 169 | `hitHero(h, sx, sy)` | functie |  |
| 191 | `getUp(h, by)` | functie |  |
| 200 | `tryRescue(h)` | functie | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 209 | `updateRescue(dt)` | functie |  |
| 221 | `hurtSmall(e)` | functie | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 231 | `powerSweep(h, id)` | functie | What the first hero's power does to everything around him. id = this stomp (or this spin of the claws): every enemy, tree and guardian feels it once per id. |
| 250 | `doStomp(h)` | functie |  |
| 259 | `startPower(h)` | functie | The first hero starts his power: Bubu jumps and stomps; Boon's claws grow and spin around him (a shield that also gathers crystals). |
| 268 | `bossShake(h)` | functie | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 280 | `newBall(x, y, vx, vy, power, life, kick, size, hop)` | functie |  |
| 283 | `ballReady()` | functie sageata | all balls home, or the cooldown is over |
| 285 | `kickBall(h, power, ax, ay)` | functie | One kick sends n balls out in a circle, so Leo's power goes in every direction. Stick direction = the first ball. |
| 301 | `recallBalls()` | functie | A second press while the balls are still out (inside the cooldown) calls every ball back to Leo. |
| 306 | `updateHero(h, dt)` | functie |  |
| 401 | `updateBall(dt)` | functie |  |
| 413 | `stepFlyBall(b, dt, h)` | functie | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 460 | `updateEggs(dt)` | functie |  |
| 485 | `enemyMul(x, y)` | functie | enemies slow down near a player on "Ușor" |
| 490 | `updateEnemies(dt)` | functie |  |
| 538 | `bossGoal()` | functie | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 542 | `bossBall(b)` | functie |  |
| 557 | `updateBoss(dt)` | functie |  |
| 609 | `hitBird(bd)` | functie | ---------- second game: big birds that pick a hero up and carry him a little way (it does not hurt) ---------- |
| 614 | `dropHero(bd)` | functie |  |
| 623 | `updateBirds(dt)` | functie |  |
| 647 | `stepProj(list, dt, spare)` | functie | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |
| 662 | `updateDecor(dt)` | functie | The reacting decor. Grass, clover, daisies, reeds, dandelions and leaves send up a little puff of leaves, petals or seeds and rustle when a hero walks past (a stomp makes the dandelions and leaves jump). Snails pull in and a ladybug flies off and comes back. Only what is near a hero or a ball reacts. |
| 689 | `updatePlay(dt)` | functie |  |

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
| 11 | `heroTop(k)` | functie sageata | how tall each hero is: where the stars, the name and the □ go |
| 12 | `drawParts(c)` | functie |  |
| 23 | `drawClawRing(c, h)` | functie | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 36 | `drawHeroFull(c, h)` | functie |  |
| 76 | `drawSmallHp(c, e, x, y)` | functie | Small enemies show how many hits they still take, once they were hit. |
| 80 | `drawBossTargets(c)` | functie |  |
| 93 | `drawProjWarn(c, list)` | functie | the spot where a thrown pinecone will land |
| 100 | `drawProjs(c, list)` | functie |  |
| 109 | `drawWorld(c)` | functie |  |
| 265 | `hintTarget()` | functie |  |
| 275 | `nearestEgg(h, reqOnly, maxD)` | functie | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 280 | `guideTarget(h)` | functie |  |
| 301 | `drawGuides(c)` | functie |  |
| 328 | `drawHints(c, v)` | functie |  |
| 351 | `pressLabel(k)` | functie sageata |  |
| 353 | `levelProgress()` | functie | How far the level is: eggs in groups, then the guardian, then the nest. |
| 356 | `seg(k)` | functie sageata |  |
| 365 | `drawProgress(c)` | functie |  |
| 394 | `drawBadge(c, k, x, y)` | functie |  |
| 410 | `drawHUD(c)` | functie |  |
| 462 | `drawPlay(c)` | functie |  |
| 468 | `drawNestShelter(c)` | functie | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 476 | `drawDecor(c, l, tp, vw, vh)` | functie | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 492 | `drawArenaBack(c)` | functie | the torches of fire around the arena |
| 496 | `drawThrone(c)` | functie |  |
| 503 | `drawGeorgeBoss(c, o, t)` | functie |  |

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
| 165 | `setGame(id)` | functie | Chooses which of the two games is played: its heroes, villain and boss values, its texts, pictures, music and progress. |
| 172 | `initScreens()` | functie |  |
| 175 | `drawBackdrop(c, cv)` | functie |  |
| 176 | `prompt(c, str, x, y, size, t)` | functie |  |
| 180 | `drawBoot(c, t)` | functie | ---------- boot + title ---------- |
| 190 | `updateSelect(dt)` | functie | ---------- the first screen: which of the two games? ---------- |
| 199 | `drawSelect(c, t)` | functie |  |
| 219 | `bob(q)` | functie sageata |  |
| 235 | `titleMenu()` | functie | The buttons under the heroes: "Continue: ...", "Chapters", "New game". At the very first start only one, and it says "Start!". |
| 243 | `titleGo()` | functie | What the chosen button does, once every player who joined is "Ready!". |
| 252 | `askYesNo(title, sub, yes, ok)` | functie | A small yes / no question over the start screen or the pause. "No" is the one shown first, so a child who keeps pressing ✕ cannot erase anything by chance. ○ or Backspace also say no. |
| 253 | `askRows()` | functie |  |
| 254 | `updateAsk()` | functie |  |
| 255 | `drawAsk(c, t)` | functie |  |
| 256 | `updateTitle(dt)` | functie |  |
| 280 | `drawGear(c, x, y, r, col, t)` | functie |  |
| 287 | `drawTitle(c, t)` | functie |  |
| 353 | `chapterLayout()` | functie |  |
| 363 | `Game.toChapters()` | functie |  |
| 370 | `updateChapters(dt)` | functie |  |
| 375 | `move(row, col)` | functie sageata |  |
| 388 | `chapterPic(i, ch)` | functie | the little picture at the top of a card: the level's sky and ground and the three pictures of its story card. Painted once. |
| 401 | `drawCrownIcon(c, x, y, s)` | functie |  |
| 410 | `drawPadlock(c, x, y, s)` | functie |  |
| 419 | `drawChapterCard(c, i, ch, p, t, open)` | functie |  |
| 449 | `drawChapters(c, t)` | functie |  |
| 461 | `drawIntroIcon(c, kind, x, y, t, Lx)` | functie | ---------- level story card ---------- |
| 482 | `drawIntroIconL(c, kind, x, y, t, Lx)` | functie | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 500 | `drawDim(c, a)` | functie |  |
| 501 | `drawIntro(c, t)` | functie |  |
| 513 | `drawLoading(c, t)` | functie |  |
| 520 | `levelMedals()` | functie | Three little medals give the bigger player something extra to aim for. |
| 521 | `drawMedal(c, i, x, y, got, t)` | functie |  |
| 536 | `drawLevelEnd(c, t)` | functie |  |
| 568 | `menuNav(o, key, rows)` | functie | ---------- menus: pause and settings ---------- A menu is a list of rows. A row is one of: go { label, ok() } a button opt { label, value, chg(dir) } a choice, changed with left / right (or OK) slide { label, v, chg(dir), set(v) } a volume slider, 0 to 1 text { label } a line of text, cannot be chosen |
| 583 | `drawMenu(c, t, title, rows, sel, o)` | functie |  |
| 623 | `pauseRows()` | functie | ---------- pause ---------- |
| 624 | `leave(go)` | functie sageata |  |
| 633 | `resumeGame()` | functie |  |
| 634 | `updatePause()` | functie |  |
| 640 | `drawPause(c, t)` | functie |  |
| 647 | `openSettings()` | functie | ---------- settings ---------- |
| 651 | `closeSettings()` | functie |  |
| 655 | `setMsg(m)` | functie |  |
| 656 | `setPage(page, p)` | functie |  |
| 657 | `settingsBack()` | functie |  |
| 661 | `toggleFullscreen()` | functie |  |
| 669 | `findSpeakers(k)` | functie |  |
| 686 | `pickSpeaker(k, d)` | functie |  |
| 698 | `captureKey(k, f)` | functie |  |
| 711 | `settingsRows()` | functie |  |
| 713 | `vol(label, id, test)` | functie sageata |  |
| 753 | `updateSettings(dt)` | functie |  |
| 766 | `drawPadTester(c, x, y, g, t)` | functie |  |
| 768 | `b(n)` | functie sageata |  |
| 793 | `drawPadBody(c, x, y, cw, k, t)` | functie |  |
| 795 | `step(n, yy, done, label, w)` | functie sageata |  |
| 800 | `small(str, yy, col)` | functie sageata |  |
| 813 | `drawSettings(c, t)` | functie |  |
| 826 | `restoreSpeakers(ask)` | functie | Chrome only tells the names of the speakers while it has the microphone permission, and for a page opened from a file it forgets that permission when the page is closed. So when the saved speaker is not in the list, the question is asked again (ask = true). If the speaker is still not there, the start screen says so: the sounds are then on the computer. |
| 838 | `startEnding()` | functie | ---------- the Sunset Festival ---------- |
| 867 | `updateEnding(dt)` | functie |  |
| 886 | `drawEndingL(c, t)` | functie | The end of the second game: the Rainbow Party. The crystals are the present, the heroes get medals, and little stars fly in and hug them. |
| 891 | `bob(k)` | functie sageata |  |
| 945 | `drawEnding(c, t)` | functie |  |
| 951 | `bob(k)` | functie sageata |  |

## 10-main.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 7 | `resize()` | functie |  |
| 15 | `goFullscreen()` | functie |  |
| 16 | `mousePos(e)` | functie |  |
| 30 | `Game.toSelect()` | functie | the screen where one of the two games is chosen |
| 35 | `Game.toTitle()` | functie |  |
| 41 | `Game.startGame(cont)` | functie | cont: from the chapter "Continue" points at. Otherwise a new game from the first chapter (the progress of this game is erased). |
| 47 | `Game.startChapter(i)` | functie | One chapter chosen on the Chapters screen. Nothing is erased. |
| 54 | `Game.goLevel(idx)` | functie | A player joins with the keyboard only on the start screen. In a level, Enter or Space in the pause menu must not make the second hero join (a child playing alone would suddenly have a friend nobody plays). Controllers can still join any time. |
| 56 | `finishChapter()` | functie | The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. |
| 61 | `Game.levelEnd()` | functie |  |
| 62 | `Game.toEnding()` | functie |  |
| 64 | `update(dt)` | functie |  |
| 105 | `draw()` | functie |  |
| 126 | `frame(ts)` | functie |  |
