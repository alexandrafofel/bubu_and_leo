<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa A. Toate functiile

Fiecare functie, functie sageata si metoda din cod, in ordinea din fisier. Coloana "Comentariul din cod" este textul scris chiar langa functie. Explicatiile pe larg sunt in capitolele din docs/.

Total: 329 intrari.

## 01-config.js

Nicio functie.

## 015-lang.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 17 | `playerOf(k)` | functie sageata | which player (0 or 1) plays hero k |
| 144 | `T(k, a, b)` | functie | T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments. |
| 150 | `lvlName(def)` | functie sageata |  |
| 151 | `eggWord(n)` | functie sageata |  |
| 153 | `keyName(code)` | functie | Readable name of a keyboard key, for the "choose the keys" screen. |

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
| 42 | `blobPath(c, x, y, rx, ry, seed, wob, n)` | functie |  |
| 58 | `wash(c, x, y, rx, ry, col, o)` | functie | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 77 | `puff(c, x, y, rx, ry, fill, seed, edge, wob)` | functie | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 82 | `soft(c, x, y, rx, ry, col, alpha, seed)` | functie |  |
| 88 | `brushLine(c, pts, width, col, alpha, seed)` | functie | A wobbly brush line through points. |
| 102 | `makeCanvas(w, h)` | functie |  |
| 106 | `makePaper()` | functie |  |
| 113 | `samp(arr, w, u, v)` | functie sageata |  |
| 138 | `makeOverlay(tint, tintA, vig)` | functie | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 154 | `skyCols(t)` | functie |  |
| 162 | `paintSky(c, x, y, w, h, t, seed, o)` | functie |  |
| 188 | `paintHills(c, x, yBase, w, hgt, t, seed, cols)` | functie | Layered distant hills along a horizon line. |
| 207 | `setFont(c, size, title, weight)` | functie | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 210 | `text(c, str, x, y, size, col, o)` | functie |  |
| 223 | `wrapLines(c, str, maxW, size, title)` | functie |  |
| 235 | `iconX(c, x, y, r, pulse)` | functie | The ✕ button as a painted icon (blue cross on a cream disc). |
| 245 | `richText(c, str, x, y, size, col, o)` | functie | Text that may contain ✕, drawn with the painted icon. Returns nothing. |
| 259 | `starPath(c, x, y, r, rot)` | functie |  |
| 270 | `sprite(key, w, h, paint)` | functie | Things that never change are painted once and then stamped: much faster per frame. |
| 275 | `card(c, x, y, w, h, col, seed)` | functie |  |
| 280 | `paintCard(c, x, y, w, h, col, seed)` | functie |  |
| 283 | `p(dx, dy, sc, fill, a)` | functie sageata |  |

## 03-audio.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 6 | `Snd(()` | functie sageata | SOUND: everything is generated with the Web Audio API. Sine and triangle waves, low-pass filters, a soft generated reverb. |
| 14 | `mtof(m)` | functie sageata |  |
| 16 | `init()` | functie |  |
| 30 | `send(bus, g)` | functie sageata |  |
| 33 | `bed(type, f, q)` | functie sageata | two soft noise beds for the ambience: water and wind |
| 38 | `nbuf(c)` | functie |  |
| 43 | `impulse(sec)` | functie | soft room: decaying, low-passed noise |
| 51 | `applyVol()` | functie |  |
| 58 | `applyAmb()` | functie |  |
| 65 | `osc(bus, type, f, t, g, att, dec, o)` | functie | ---- building blocks: every sound is made on the bus it is given ----------- |
| 77 | `noise(bus, t, g, att, dec, type, f, f2, q)` | functie |  |
| 87 | `voc(bus, t, f0, f1, dur, g, m0, m1)` | functie | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 101 | `say(bus, t, k, a, b, dur, g)` | functie sageata |  |
| 103 | `kalimba(bus, f, t, g)` | functie sageata | ---- instruments --------------------------------------------------------- |
| 104 | `marimba(bus, f, t, g)` | functie sageata |  |
| 105 | `chime(bus, f, t, g)` | functie sageata |  |
| 106 | `flute(bus, f, t, dur, g)` | functie |  |
| 131 | `makeSong(p)` | functie |  |
| 133 | `motif()` | functie sageata |  |
| 145 | `deg(p, d)` | functie sageata |  |
| 146 | `schedule(st, t)` | functie |  |
| 162 | `tick()` | functie |  |
| 181 | `ambience(key)` | functie |  |
| 182 | `music(key)` | functie |  |
| 193 | `egg(b, t, n)` | metoda | --- the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) --- |
| 194 | `star(b, t)` | metoda |  |
| 195 | `giant(b, t)` | metoda |  |
| 196 | `stomp(b, t)` | metoda |  |
| 197 | `kick(b, t, p)` | metoda |  |
| 198 | `bounce(b, t)` | metoda |  |
| 199 | `bonk(b, t)` | metoda |  |
| 200 | `drop(b, t)` | metoda |  |
| 201 | `squelch(b, t)` | metoda |  |
| 202 | `step(b, t, x)` | metoda | x = hero * 2 + (left or right foot) |
| 207 | `vGo(b, t, k)` | metoda |  |
| 208 | `vOw(b, t, k)` | metoda |  |
| 209 | `vYay(b, t, k)` | metoda |  |
| 210 | `vWow(b, t, k)` | metoda |  |
| 211 | `vHide(b, t, k)` | metoda |  |
| 213 | `wake(b, t)` | metoda | --- the world (volume "Sunete ambientale") --- |
| 214 | `stun(b, t)` | metoda |  |
| 215 | `pop(b, t)` | metoda |  |
| 216 | `rustle(b, t)` | metoda |  |
| 217 | `butterfly(b, t)` | metoda |  |
| 218 | `wave(b, t)` | metoda |  |
| 219 | `win(b, t)` | metoda |  |
| 220 | `caw(b, t)` | metoda |  |
| 221 | `whoosh(b, t)` | metoda |  |
| 222 | `swish(b, t)` | metoda |  |
| 223 | `lantern(b, t)` | metoda |  |
| 224 | `firework(b, t)` | metoda |  |
| 225 | `ui(b, t)` | metoda |  |
| 226 | `ok(b, t)` | metoda |  |
| 227 | `thud(b, t)` | metoda |  |
| 228 | `goal(b, t)` | metoda |  |
| 229 | `crack(b, t)` | metoda |  |
| 230 | `splash(b, t)` | metoda |  |
| 231 | `tonk(b, t)` | metoda | the ball bounces off a guardian that is not tired yet |
| 232 | `warn(b, t)` | metoda | a guardian gets ready to attack |
| 233 | `squeak(b, t, p)` | metoda | a guardian got hit |
| 234 | `tired(b, t)` | metoda |  |
| 235 | `duel(b, t)` | metoda |  |
| 236 | `flee(b, t)` | metoda |  |
| 240 | `play(name, arg, k)` | functie | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 247 | `canSink()` | functie sageata | ---- the controller's own speaker (only when the system shows it as an audio output) ---- |
| 249 | `listOutputs(ask)` | functie | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 258 | `setSink(k, dev)` | functie | dev = { id, label } or null for the computer's speakers |
| 271 | `swapOuts()` | functie |  |
| 277 | `setVol(k, v)` | metoda |  |
| 278 | `setDuck(d)` | metoda |  |
| 285 | `init()` | metoda |  |
| 290 | `pick()` | metoda |  |
| 296 | `say(txt, keep)` | metoda |  |
| 311 | `stop()` | metoda |  |

## 04-input.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 9 | `Input(()` | functie sageata | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) or the keyboard. Each hero is played with what was chosen in Setări: a controller ('pad') or the keyboard ('kb') with its own keys. Menus listen to everything: every controller, the arrow keys, Enter, Space, Backspace and the players' own keys. |
| 11 | `kd(code)` | functie sageata |  |
| 12 | `mk()` | functie sageata |  |
| 31 | `pads()` | functie |  |
| 36 | `assigned(i)` | functie |  |
| 37 | `freeSlot()` | functie | the hero a newly pressed controller will play |
| 44 | `poll(dt)` | functie |  |
| 51 | `b(n)` | functie sageata |  |
| 72 | `b(n)` | functie sageata |  |
| 124 | `rumble(k, strong, weak, ms, force)` | functie | returns false when this controller cannot vibrate |
| 137 | `setCtrl(k, kind)` | functie | Settings: play hero k with a controller or with the keyboard. |
| 142 | `unbind(k)` | functie |  |
| 143 | `swap()` | functie | the two players trade heroes: controllers go with the players |
| 150 | `capture(f)` | metoda |  |
| 151 | `muteHeld()` | metoda |  |
| 152 | `any(f)` | metoda |  |
| 153 | `padCount()` | metoda |  |

## 05-chars.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 6 | `drawEye(c, x, y, r, o, look)` | functie | CHARACTERS AND THINGS: all drawn with canvas shapes, picture-book style. Every draw function takes the feet position (x, y) in the current transform. |
| 28 | `drawBubu(c, x, y, o)` | functie | BUBU: round baby triceratops, orange with green spots and a tiny red scarf. |
| 59 | `horn(hx, hy, w, h, rot)` | functie sageata | horns |
| 72 | `drawLeo(c, x, y, o)` | functie | LEO: young footballer, yellow shirt, blue shorts, red headband. |
| 79 | `leg(lx, lift, fwd, seed)` | functie sageata | legs: sock + shoe |
| 90 | `arm(ax, sw, seed)` | functie sageata | arms |
| 119 | `drawBall(c, x, y, r, spin)` | functie | The football: cream with terracotta patches. |
| 132 | `drawCiori(c, x, y, o)` | functie | CIORI: a mischievous plum-colored crow. mood: cheeky \| dizzy \| sorry \| happy |
| 164 | `paintBeetleBody(c, b, t)` | functie | Grumpy sleepy beetle. state: sleep \| wake \| chase \| return \| stun \| knock |
| 184 | `drawBeetle(c, b, t)` | functie |  |
| 207 | `drawCone(c, x, y, rot, r, z)` | functie |  |
| 224 | `eggPath(c, r)` | functie |  |
| 232 | `drawEgg(c, x, y, r, t, seed, z)` | functie |  |
| 250 | `drawStar(c, x, y, r, t, z)` | functie |  |
| 266 | `drawButterfly(c, x, y, t, s)` | functie |  |
| 282 | `drawNest(c, x, y, r, seed, glow)` | functie | A woven nest seen from above. |
| 298 | `iconArrow(c, x, y, ang, size, col)` | functie | Small painted icons for hints (no words needed). |
| 305 | `iconStick(c, x, y, r, t)` | functie | left stick: four little arrows and a wiggling cap |
| 311 | `drawDizzyStars(c, x, y, t)` | functie |  |
| 318 | `drawHero(c, k, x, y, o)` | functie |  |

## 06-level.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 37 | `levelCount()` | functie sageata |  |
| 38 | `levelDef(idx)` | functie sageata |  |
| 39 | `skyTOf(idx)` | functie sageata |  |
| 41 | `spline(pts, stepLen)` | functie | Catmull-Rom through points, resampled evenly |
| 61 | `genLevel(idx, seed)` | functie |  |
| 70 | `inW(cx, cy)` | functie sageata |  |
| 71 | `ci(x, y)` | functie sageata |  |
| 72 | `mark(x, y, rad, bits)` | functie sageata |  |
| 76 | `region(k)` | functie sageata |  |
| 77 | `dv(arr, k)` | functie sageata |  |
| 78 | `starRegion(i)` | functie sageata |  |
| 94 | `pathDist(x, y)` | functie sageata |  |
| 99 | `setWater(cx, cy)` | functie sageata | ---- water ---------------------------------------------------------------- |
| 120 | `crossing(by, list)` | functie sageata |  |
| 131 | `pathFar(x, y, d)` | functie sageata |  |
| 132 | `areaClear(x, y, rad)` | functie sageata |  |
| 139 | `addSolid(x, y, rad, kind, extra)` | functie sageata |  |
| 140 | `mudEllipse(x, y, rx, ry)` | functie sageata |  |
| 230 | `spotFree(x, y, rad)` | functie sageata | ---- trees, rocks, haystacks ---------------------------------------------- |
| 238 | `scatter(count, rmin, rmax, kind, gap)` | functie sageata |  |
| 280 | `reachCells(x, y, r0, r1, bits)` | functie sageata |  |
| 288 | `shuffle(a)` | functie sageata |  |
| 291 | `addBeetle(x, y)` | functie sageata | ---- beetles --------------------------------------------------------------- |
| 340 | `far(x, y, d)` | functie sageata |  |
| 369 | `paintTree(c, t, P, ox, oy)` | functie | ---------------- painting ---------------- |
| 382 | `paintRock(c, x, y, R, col, seed)` | functie |  |
| 389 | `paintHay(c, x, y, R, seed)` | functie |  |
| 401 | `paintMillTower(c, x, y)` | functie | x,y = base center. Tower rises 250 px. |
| 403 | `body(inset, col, a)` | functie sageata |  |
| 412 | `drawMillBlades(c, x, y, ang)` | functie |  |
| 424 | `paintLantern(c, x, y)` | functie |  |
| 430 | `cellBlobs(c, L, type, rad, col, alpha, seed, jit)` | functie |  |
| 440 | `paintLevel(L)` | functie |  |
| 442 | `typeAt(x, y)` | functie sageata |  |
| 551 | `room(grow, col, al)` | functie sageata | rounded cave room plus the short tunnel to the waterfall |
| 582 | `finishPaint(c, w, h, skyT, r)` | functie | Granulation speckles, watercolor blooms and the warm afternoon light. |
| 593 | `genBoss()` | functie | The boss arena: one screen, the tallest tree in the valley. |

## 07-play.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 7 | `D(k)` | functie sageata |  |
| 8 | `rank(k)` | functie sageata | 0 Ușor, 1 Normal, 2 Greu |
| 11 | `buildLevel(idx)` | functie |  |
| 16 | `makeHero(k, x, y)` | functie |  |
| 20 | `makeEgg(x, y, o)` | functie |  |
| 23 | `startPlay(L)` | functie |  |
| 39 | `startWave(k)` | functie |  |
| 52 | `part(x, y, o)` | functie | ---------- particles ---------- |
| 56 | `burst(x, y, n, o)` | functie |  |
| 66 | `stepParts(dt)` | functie |  |
| 74 | `collide(L, e, r, isBall)` | functie | ---------- collisions ---------- |
| 99 | `collectEgg(e, k)` | functie | ---------- eggs and stars ---------- |
| 114 | `collectStar(s, k)` | functie |  |
| 119 | `checkWave()` | functie |  |
| 127 | `openNest()` | functie |  |
| 128 | `shakeTree(t, power, byStomp)` | functie |  |
| 144 | `hitHero(h, sx, sy)` | functie |  |
| 163 | `doStomp(h)` | functie | ---------- powers ---------- |
| 187 | `aimAssist(h, ax, ay)` | functie |  |
| 189 | `consider(x, y)` | functie sageata |  |
| 197 | `kickBall(h, power, ax, ay)` | functie |  |
| 208 | `updateHero(h, dt)` | functie |  |
| 272 | `updateBall(dt)` | functie |  |
| 317 | `updateEggs(dt)` | functie |  |
| 342 | `enemyMul(x, y)` | functie | enemies slow down near a player on "Ușor" |
| 347 | `updateEnemies(dt)` | functie |  |
| 384 | `bossBall(b)` | functie | ---------- boss: Ciori in the tallest tree ---------- |
| 399 | `updateBoss(dt)` | functie |  |
| 434 | `stepProj(list, dt, spare)` | functie | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |
| 446 | `updatePlay(dt)` | functie |  |

## 075-duel.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 19 | `startDuel()` | functie |  |
| 35 | `duelFighter()` | functie | Who the guardian goes after: the bravest player who is not hidden in the nest. |
| 45 | `duelSpares(h)` | functie sageata | Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. |
| 46 | `duelCanHurt(k, how)` | functie sageata |  |
| 47 | `duelEggs(n)` | functie |  |
| 55 | `duelHit(k)` | functie |  |
| 67 | `duelBall(b)` | functie |  |
| 77 | `duelStomp(h)` | functie |  |
| 85 | `duelLob(n, slow)` | functie | throws n pinecones: the first where the target is going, the rest around |
| 93 | `duelSnap(x, y)` | functie | nearest spot a guardian can stand on |
| 99 | `updateDuel(dt)` | functie |  |
| 114 | `go(st)` | functie sageata |  |
| 115 | `cycle()` | functie sageata |  |
| 116 | `tire()` | functie sageata |  |
| 171 | `plan()` | functie sageata |  |
| 209 | `duelSwoop(tg)` | functie | fly in a straight line through the place where the target stands |
| 219 | `heartPath(c, x, y, s)` | functie | ---------- drawing the guardians ---------- |
| 225 | `beetle(c, d, t, mood)` | metoda | the Beetle King: a big grumpy beetle with a tiny crown |
| 232 | `owl(c, d, t, mood)` | metoda |  |
| 246 | `crab(c, d, t, mood)` | metoda |  |
| 263 | `whirl(c, d, t, mood)` | metoda | a little whirlwind with eyes |
| 274 | `frog(c, d, t, mood)` | metoda |  |
| 287 | `chick(c, d, t, mood)` | metoda | Ciorel, Ciori's little nephew |
| 291 | `drawDuelBoss(c)` | functie |  |
| 305 | `drawDuelGround(c)` | functie | Things on the ground: the shelter ring, where the next attack will land, shadows. |
| 312 | `red(a)` | functie sageata |  |
| 324 | `drawDuelTop(c)` | functie | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

## 08-draw.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 6 | `heroOpts(h)` | functie |  |
| 10 | `drawParts(c)` | functie |  |
| 19 | `drawHeroFull(c, h)` | functie |  |
| 38 | `drawBossTargets(c)` | functie |  |
| 49 | `drawProjWarn(c, list)` | functie | the spot where a thrown pinecone will land |
| 56 | `drawProjs(c, list)` | functie |  |
| 60 | `drawWorld(c)` | functie |  |
| 183 | `hintTarget()` | functie |  |
| 193 | `nearestEgg(h, reqOnly, maxD)` | functie | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 198 | `guideTarget(h)` | functie |  |
| 219 | `drawGuides(c)` | functie |  |
| 244 | `drawHints(c, v)` | functie |  |
| 266 | `pressLabel(k)` | functie sageata |  |
| 268 | `levelProgress()` | functie | How far the level is: eggs in groups, then the guardian, then the nest. |
| 277 | `drawProgress(c)` | functie |  |
| 306 | `drawBadge(c, k, x, y)` | functie |  |
| 321 | `drawHUD(c)` | functie |  |
| 367 | `drawPlay(c)` | functie |  |

## 09-screens.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 10 | `heroOf(p)` | functie sageata | which hero (0 Bubu, 1 Leo) player p plays |
| 14 | `load()` | metoda |  |
| 15 | `write(level)` | metoda |  |
| 24 | `apply()` | metoda | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 42 | `hasProgress()` | metoda |  |
| 47 | `hitAdd(x, y, w, h, id, v, act, val)` | functie | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 48 | `hitFind(p)` | functie |  |
| 54 | `pressedGo()` | functie sageata | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 56 | `pressText()` | functie | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 62 | `fitText(c, str, x, y, size, maxW, col, o)` | functie |  |
| 68 | `swapHeroes()` | functie | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 73 | `cycleDiff(k, d)` | functie |  |
| 74 | `setLanguage(l)` | functie |  |
| 80 | `paintMeadowScene(skyT, horizon, seed)` | functie |  |
| 98 | `initScreens()` | functie |  |
| 102 | `drawBackdrop(c, cv)` | functie |  |
| 103 | `prompt(c, str, x, y, size, t)` | functie |  |
| 107 | `drawBoot(c, t)` | functie | ---------- boot + title ---------- |
| 116 | `updateTitle(dt)` | functie |  |
| 137 | `drawGear(c, x, y, r, col, t)` | functie |  |
| 144 | `drawTitle(c, t)` | functie |  |
| 201 | `drawIntroIcon(c, kind, x, y, t)` | functie | ---------- level story card ---------- |
| 220 | `drawDim(c, a)` | functie |  |
| 221 | `drawIntro(c, t)` | functie |  |
| 233 | `drawLoading(c, t)` | functie |  |
| 240 | `levelMedals()` | functie | Three little medals give the bigger player something extra to aim for. |
| 241 | `drawMedal(c, i, x, y, got, t)` | functie |  |
| 256 | `drawLevelEnd(c, t)` | functie |  |
| 288 | `menuNav(o, key, rows)` | functie | ---------- menus: pause and settings ---------- A menu is a list of rows. A row is one of: go { label, ok() } a button opt { label, value, chg(dir) } a choice, changed with left / right (or OK) slide { label, v, chg(dir), set(v) } a volume slider, 0 to 1 text { label } a line of text, cannot be chosen |
| 303 | `drawMenu(c, t, title, rows, sel, o)` | functie |  |
| 343 | `pauseRows()` | functie | ---------- pause ---------- |
| 350 | `resumeGame()` | functie |  |
| 351 | `updatePause()` | functie |  |
| 356 | `drawPause(c, t)` | functie |  |
| 362 | `openSettings()` | functie | ---------- settings ---------- |
| 366 | `closeSettings()` | functie |  |
| 370 | `setMsg(m)` | functie |  |
| 371 | `setPage(page, p)` | functie |  |
| 372 | `settingsBack()` | functie |  |
| 376 | `toggleFullscreen()` | functie |  |
| 384 | `findSpeakers(k)` | functie |  |
| 395 | `pickSpeaker(k, d)` | functie |  |
| 407 | `captureKey(k, f)` | functie |  |
| 420 | `settingsRows()` | functie |  |
| 422 | `vol(label, id, test)` | functie sageata |  |
| 461 | `updateSettings(dt)` | functie |  |
| 474 | `drawPadTester(c, x, y, g, t)` | functie |  |
| 476 | `b(n)` | functie sageata |  |
| 501 | `drawPadBody(c, x, y, cw, k, t)` | functie |  |
| 503 | `step(n, yy, done, label, w)` | functie sageata |  |
| 508 | `small(str, yy, col)` | functie sageata |  |
| 521 | `drawSettings(c, t)` | functie |  |
| 531 | `restoreSpeakers()` | functie | After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. |
| 540 | `startEnding()` | functie | ---------- the Sunset Festival ---------- |
| 558 | `updateEnding(dt)` | functie |  |
| 573 | `drawEnding(c, t)` | functie |  |
| 578 | `bob(k)` | functie sageata |  |

## 10-main.js

| Linia | Nume si parametri | Tip | Comentariul din cod |
|---|---|---|---|
| 7 | `resize()` | functie |  |
| 15 | `goFullscreen()` | functie |  |
| 16 | `mousePos(e)` | functie |  |
| 30 | `Game.toTitle()` | functie |  |
| 35 | `Game.startGame(cont)` | functie |  |
| 40 | `Game.goLevel(idx)` | functie |  |
| 41 | `Game.levelEnd()` | functie |  |
| 45 | `Game.toEnding()` | functie |  |
| 47 | `update(dt)` | functie |  |
| 84 | `draw()` | functie |  |
| 103 | `frame(ts)` | functie |  |
