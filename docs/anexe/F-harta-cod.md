<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa F. Harta codului, sectiune cu sectiune

Fiecare fisier este impartit in sectiuni. O sectiune incepe la un comentariu-titlu (`// ---- ... ----`, `/* ---- ... ---- */` sau un bloc `/* ... */`) si tine pana la urmatoarea. Asa fiecare linie de cod are un loc numit, iar capitolul din docs/ cu acelasi nume o explica.

## 00-head.html (16 linii)

| Liniile | Sectiunea |
|---|---|
| 1-16 | tot fisierul |

## 01-config.js (189 linii)

| Liniile | Sectiunea |
|---|---|
| 2-7 | BUBU ȘI LEO: OUĂLE DE AUR |
| 8-11 | Names (all other texts, Romanian and English, are in the STR table below CONFIG) |
| 12-41 | Heroes (index 0 = Player 1, index 1 = Player 2) |
| 42-50 | Game length |
| 51-59 | Difficulty, chosen per player on the start screen |
| 60-64 | Nest: a hero in it is hidden on every level, the wind does not move it, nothing can hit it |
| 65-76 | Rescue: a hero who was hit cannot walk until the friend comes and presses □ (both games) |
| 77-82 | Small enemies: beetles and pinecones (robots, snails and birds in the second game) |
| 83-91 | Obstacles |
| 92-97 | Helpers |
| 98-105 | Boss |
| 106-124 | Two mini-fights per level: one in the middle of the path, one at the nest |
| 125-132 | Controls (keys and controller/keyboard are chosen in Setări). On a controller: ✕ = power, □ = help the friend |
| 133-139 | Sound |
| 140-145 | Look |
| 146-189 | The second game, "Cea mai grea luptă" (invented by the children) |

## 015-lang.js (222 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | SETTINGS chosen in the game's "Setări" menu (saved on this computer) and |
| 11-12 | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 13-92 | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 93-213 | the second game, "Cea mai grea luptă". A key that starts with L: takes the place of the same key without it. |
| 214-222 | Readable name of a keyboard key, for the "choose the keys" screen. |

## 02-core.js (354 linii)

| Liniile | Sectiunea |
|---|---|
| 2-40 | CORE: math, colors, watercolor painting helpers, paper texture, text |
| 41-57 | A closed blob with slightly irregular, hand-painted edges. |
| 58-76 | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 77-87 | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 88-104 | A wobbly brush line through points. |
| 105-137 | Paper: noise-generated grain, soft blotches and a few fibers. Multiplied over the whole screen. |
| 138-149 | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 150-187 | Sky colors drift from afternoon (t=0) to sunset (t=1) to dusk (t=1.3). |
| 188-212 | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 213-228 | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 229-247 | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 248-275 | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 276-285 | The ✕ button as a painted icon (blue cross on a cream disc). |
| 286-295 | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 296-318 | Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. |
| 319-320 | A painted card (panel) used by menus and story screens. |
| 321-354 | Things that never change are painted once and then stamped: much faster per frame. |

## 03-audio.js (524 linii)

| Liniile | Sectiunea |
|---|---|
| 2-71 | SOUND: everything is generated with the Web Audio API. |
| 72-72 | building blocks: every sound is made on the bus it is given |
| 73-97 | A controller's speaker is tiny: it cannot play low notes. On such a speaker (bus.small) anything low goes one or two octaves up. |
| 98-111 | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 112-124 | A soft roar or growl: a low triangle that slides down, with a quick tremble (the "rrr"). Warm, never harsh. |
| 125-139 | instruments |
| 140-233 | music: calm pentatonic patterns, a different one per level |
| 234-341 | the heroes' own language: 33 invented words each |
| 342-355 | Talk(k, word): hero k says one of its words. Routed like the hero's other sounds (own speaker when one was chosen). |
| 356-357 | sound effects |
| 358-359 | Every effect gets: b = the bus to play on, t = the time now on that bus, x = an optional value. |
| 360-374 | the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) |
| 375-441 | the world (volume "Sunete ambientale") |
| 442-449 | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 450-451 | the controller's own speaker (only when the system shows it as an audio output) |
| 452-492 | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 493-524 | Voice-over with a system voice in the chosen language, when one is installed. |

## 04-input.js (157 linii)

| Liniile | Sectiunea |
|---|---|
| 2-136 | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) |
| 137-157 | Settings: play hero k with a controller or with the keyboard. |

## 05-chars.js (338 linii)

| Liniile | Sectiunea |
|---|---|
| 2-26 | CHARACTERS AND THINGS: all drawn with canvas shapes, picture-book style. |
| 27-70 | BUBU: round baby triceratops, orange with green spots and a tiny red scarf. |
| 71-117 | LEO: young footballer, yellow shirt, blue shorts, red headband. |
| 118-131 | The football: cream with terracotta patches (Leo). In the second game Killer has his own ball: white with hexagons. |
| 132-163 | CIORI: a mischievous plum-colored crow. mood: cheeky \| dizzy \| sorry \| happy |
| 164-232 | Grumpy sleepy beetle. state: sleep \| wake \| chase \| return \| stun \| knock |
| 233-273 | The thing the heroes gather: a golden egg in the first game, a rainbow crystal (or the secret star) in the second. |
| 274-290 | The helper that makes both heroes fast for a moment: a butterfly in the first game, a little rocket in the second. |
| 291-307 | A woven nest seen from above. |
| 308-328 | Small painted icons for hints (no words needed). |
| 329-333 | The two heroes of the game being played: Bubu and Leo, or Boon and Killer. |
| 334-335 | The small enemy that sleeps and wakes up: a beetle, or one of George's robots. |
| 336-338 | The small enemy that comes down a lane: a rolling pinecone, or a sticky snail. |

## 055-lupta.js (371 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | THE SECOND GAME, "CEA MAI GREA LUPTĂ": its characters and things. |
| 11-80 | A soft tapered tube along a curve: tails, necks, arms, legs. |
| 81-125 | KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. |
| 126-207 | Killer's ball, like in the drawing: white, with hexagons. |
| 208-244 | One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. |
| 245-269 | A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. |
| 270-288 | A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. |
| 289-312 | A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. |
| 313-324 | The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. |
| 325-338 | The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. |
| 339-351 | Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). |
| 352-371 | One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. |

## 06-level.js (942 linii)

| Liniile | Sectiunea |
|---|---|
| 2-72 | LEVELS: definitions, generator (with a reachability check so every egg can |
| 73-117 | What the slow ground looks like: mud in the first game; slime, quicksand or tangled vines in the second. [dark rim, body, light, blotch 1, blotch 2, shine] |
| 118-134 | the path from the start to the nest |
| 135-185 | water |
| 186-238 | bonus stars: one per third of the map |
| 239-266 | mud, pinecone lanes, windmills |
| 267-292 | trees, rocks, haystacks |
| 293-327 | reachability (flood fill from the start) |
| 328-344 | beetles |
| 345-370 | sparkling trees (hide eggs) and the treetop star |
| 371-392 | golden eggs, in waves from left to right |
| 393-407 | lanterns along the path (sunset level) |
| 408-416 | painting |
| 417-435 | The decor of the second game: as many kinds, with the same ways of reacting, but the things of a jungle at night. |
| 436-481 | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 482-556 | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 557-813 | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 814-825 | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 826-836 | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 837-848 | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 849-942 | The boss arena: one screen, the tallest tree in the valley. |

## 07-play.js (790 linii)

| Liniile | Sectiunea |
|---|---|
| 2-55 | GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss |
| 56-77 | particles |
| 78-102 | collisions |
| 103-120 | eggs and stars |
| 121-134 | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 135-182 | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 183-192 | rescue: the friend helps a hero who was hit |
| 193-213 | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 214-221 | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 222-251 | powers |
| 252-260 | The first hero starts his power: Bubu jumps and stomps; Boon's claws grow and spin around him (a shield that also gathers crystals). |
| 261-277 | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 278-293 | One kick sends n balls out in a circle, so Leo's power goes in every direction. Stick direction = the first ball. |
| 294-405 | A second press while the balls are still out (inside the cooldown) calls every ball back to Leo. |
| 406-529 | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 530-530 | boss: Ciori in the tallest tree (first game), George on his stone throne (second game) |
| 531-601 | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 602-639 | second game: big birds that pick a hero up and carry him a little way (it does not hurt) |
| 640-790 | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |

## 075-duel.js (376 linii)

| Liniile | Sectiunea |
|---|---|
| 2-29 | MINI-FIGHTS: when the last eggs of a level are collected, one of Ciori's |
| 30-52 | kind 'mid': the middle fight, the same as before. kind 'nest': the harder one at the nest, bigger and quicker. |
| 53-62 | Who the guardian goes after: the bravest player who is not hidden in the nest. |
| 63-64 | While a hero waits for the friend's help the fight rests: the guardian finishes what it was doing, hurts nobody and starts no new attack. |
| 65-66 | Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. |
| 67-183 | A tired guardian can always be hit. On "Ușor" every hit counts at any time, except on a guardian that is only waiting for a hero to be helped up. |
| 184-251 | the three attack patterns |
| 252-340 | drawing the guardians |
| 341-354 | Things on the ground during a mini-fight: where the next attack will land, shadows. (The shelter ring is in drawNestShelter.) |
| 355-376 | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

## 08-draw.js (514 linii)

| Liniile | Sectiunea |
|---|---|
| 2-21 | DRAWING THE GAME: world, heroes, effects, HUD |
| 22-74 | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 75-273 | Small enemies show how many hits they still take, once they were hit. |
| 274-351 | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 352-466 | How far the level is: eggs in groups, then the guardian, then the nest. |
| 467-474 | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 475-490 | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 491-514 | George's arena (the last level of the second game) |

## 09-screens.js (801 linii)

| Liniile | Sectiunea |
|---|---|
| 2-26 | SCREENS: start, level story card, level end, pause, settings, festival ending. |
| 27-49 | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 50-56 | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 57-58 | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 59-70 | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 71-101 | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 102-119 | The backdrop of the second game: the jungle at night, under the moon and the northern lights. |
| 120-124 | The start-screen backdrop of each game is painted once, the first time it is needed. |
| 125-139 | Chooses which of the two games is played: its heroes, villain and boss values, its texts, pictures, music and progress. |
| 140-149 | boot + title |
| 150-285 | the first screen: which of the two games? |
| 286-306 | level story card |
| 307-343 | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 344-344 | level end |
| 345-447 | Three little medals give the bigger player something extra to aim for. |
| 448-466 | pause |
| 467-642 | settings |
| 643-657 | After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. |
| 658-801 | the Sunset Festival |

## 10-main.js (126 linii)

| Liniile | Sectiunea |
|---|---|
| 2-126 | MAIN: canvas, game states, main loop |
