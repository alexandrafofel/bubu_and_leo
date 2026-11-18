<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa F. Harta codului, sectiune cu sectiune

Fiecare fisier este impartit in sectiuni. O sectiune incepe la un comentariu-titlu (`// ---- ... ----`, `/* ---- ... ---- */` sau un bloc `/* ... */`) si tine pana la urmatoarea. Asa fiecare linie de cod are un loc numit, iar capitolul din docs/ cu acelasi nume o explica.

## 00-head.html (16 linii)

| Liniile | Sectiunea |
|---|---|
| 1-16 | tot fisierul |

## 01-config.js (205 linii)

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
| 125-133 | Controls (keys and controller/keyboard are chosen in Setări). |
| 134-147 | Run: press the left stick (L3) |
| 148-154 | Sound |
| 155-160 | Look |
| 161-205 | The second game, "Cea mai grea luptă" (invented by the children) |

## 015-lang.js (229 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | SETTINGS chosen in the game's "Setări" menu (saved on this computer) and |
| 11-13 | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 14-96 | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 97-220 | the second game, "Cea mai grea luptă". A key that starts with L: takes the place of the same key without it. |
| 221-229 | Readable name of a keyboard key, for the "choose the keys" screen. |

## 02-core.js (384 linii)

| Liniile | Sectiunea |
|---|---|
| 2-40 | CORE: math, colors, watercolor painting helpers, paper texture, text |
| 41-57 | A closed blob with slightly irregular, hand-painted edges. |
| 58-76 | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 77-87 | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 88-110 | A wobbly brush line through points. |
| 111-143 | Paper: noise-generated grain, soft blotches and a few fibers. Multiplied over the whole screen. |
| 144-155 | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 156-193 | Sky colors drift from afternoon (t=0) to sunset (t=1) to dusk (t=1.3). |
| 194-218 | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 219-234 | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 235-253 | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 254-281 | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 282-291 | The ✕ button as a painted icon (blue cross on a cream disc). |
| 292-301 | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 302-302 | Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. |
| 303-312 | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 313-348 | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 349-350 | A painted card (panel) used by menus and story screens. |
| 351-384 | Things that never change are painted once and then stamped: much faster per frame. |

## 03-audio.js (533 linii)

| Liniile | Sectiunea |
|---|---|
| 2-71 | SOUND: everything is generated with the Web Audio API. |
| 72-72 | building blocks: every sound is made on the bus it is given |
| 73-97 | A controller's speaker is tiny: it cannot play low notes. On such a speaker (bus.small) anything low goes one or two octaves up. |
| 98-111 | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 112-124 | A soft roar or growl: a low triangle that slides down, with a quick tremble (the "rrr"). Warm, never harsh. |
| 125-139 | instruments |
| 140-233 | music: calm pentatonic patterns, a different one per level |
| 234-343 | the heroes' own language: 33 invented words each |
| 344-357 | Talk(k, word): hero k says one of its words. Routed like the hero's other sounds (own speaker when one was chosen). |
| 358-359 | sound effects |
| 360-361 | Every effect gets: b = the bus to play on, t = the time now on that bus, x = an optional value. |
| 362-376 | the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) |
| 377-444 | the world (volume "Sunete ambientale") |
| 445-447 | Running (L3) in the first game too: the same short soft whoosh. |
| 448-458 | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 459-460 | the controller's own speaker (only when the system shows it as an audio output) |
| 461-501 | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 502-533 | Voice-over with a system voice in the chosen language, when one is installed. |

## 04-input.js (163 linii)

| Liniile | Sectiunea |
|---|---|
| 2-142 | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) |
| 143-163 | Settings: play hero k with a controller or with the keyboard. |

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

## 06-level.js (965 linii)

| Liniile | Sectiunea |
|---|---|
| 2-72 | LEVELS: definitions, generator (with a reachability check so every egg can |
| 73-140 | What the slow ground looks like: mud in the first game; slime, quicksand or tangled vines in the second. [dark rim, body, light, blotch 1, blotch 2, shine] |
| 141-157 | the path from the start to the nest |
| 158-208 | water |
| 209-261 | bonus stars: one per third of the map |
| 262-289 | mud, pinecone lanes, windmills |
| 290-315 | trees, rocks, haystacks |
| 316-350 | reachability (flood fill from the start) |
| 351-367 | beetles |
| 368-393 | sparkling trees (hide eggs) and the treetop star |
| 394-415 | golden eggs, in waves from left to right |
| 416-430 | lanterns along the path (sunset level) |
| 431-439 | painting |
| 440-458 | The decor of the second game: as many kinds, with the same ways of reacting, but the things of a jungle at night. |
| 459-504 | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 505-579 | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 580-836 | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 837-848 | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 849-859 | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 860-871 | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 872-965 | The boss arena: one screen, the tallest tree in the valley. |

## 07-play.js (865 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss |
| 11-62 | Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. |
| 63-84 | particles |
| 85-109 | collisions |
| 110-127 | eggs and stars |
| 128-141 | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 142-189 | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 190-199 | rescue: the friend helps a hero who was hit |
| 200-220 | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 221-228 | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 229-258 | powers |
| 259-267 | The first hero starts his power: Bubu jumps and stomps; Boon's claws grow and spin around him (a shield that also gathers crystals). |
| 268-284 | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 285-300 | One kick sends n balls out in a circle, so Leo's power goes in every direction. Stick direction = the first ball. |
| 301-465 | A second press while the balls are still out (inside the cooldown) calls every ball back to Leo. |
| 466-589 | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 590-590 | boss: Ciori in the tallest tree (first game), George on his stone throne (second game) |
| 591-661 | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 662-699 | second game: big birds that pick a hero up and carry him a little way (it does not hurt) |
| 700-865 | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |

## 075-duel.js (378 linii)

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
| 355-378 | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

## 08-draw.js (572 linii)

| Liniile | Sectiunea |
|---|---|
| 2-31 | DRAWING THE GAME: world, heroes, effects, HUD |
| 32-45 | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 46-115 | The trail of a running hero: three fading copies of him, and six speed lines behind. |
| 116-312 | Small enemies show how many hits they still take, once they were hit. |
| 313-396 | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 397-454 | How far the level is: eggs in groups, then the guardian, then the nest. |
| 455-461 | "We wait for X in the nest": it used to be written in the world, over the nest. Now it is a banner in the band. |
| 462-524 | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 525-532 | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 533-548 | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 549-572 | George's arena (the last level of the second game) |

## 09-screens.js (930 linii)

| Liniile | Sectiunea |
|---|---|
| 2-21 | SCREENS: start, level story card, level end, pause, settings, festival ending. |
| 22-39 | A save from before chapters (version 3 or older) becomes version 4. It changes only what is missing, so it can run again. |
| 40-41 | the progress of the chosen game, made if it is not there yet |
| 42-63 | "New game": the progress of the chosen game is erased. The other game and the settings stay. |
| 64-83 | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 84-88 | the furthest chapter open on the Chapters screen (-1: no chapter was ever finished, the button is not shown) |
| 89-95 | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 96-97 | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 98-109 | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 110-140 | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 141-158 | The backdrop of the second game: the jungle at night, under the moon and the northern lights. |
| 159-163 | The start-screen backdrop of each game is painted once, the first time it is needed. |
| 164-178 | Sets up the game (the second game is the only one now): its heroes, villain and boss values, its texts, pictures, music and progress. |
| 179-187 | boot + title |
| 188-195 | The buttons under the heroes: "Continue: ...", "Chapters", "New game". At the very first start only one, and it says "Start!". |
| 196-336 | What the chosen button does, once every player who joined is "Ready!". |
| 337-409 | the little picture at the top of a card: the level's sky and ground and the three pictures of its story card. Painted once. |
| 410-430 | level story card |
| 431-467 | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 468-468 | level end |
| 469-571 | Three little medals give the bigger player something extra to aim for. |
| 572-595 | pause |
| 596-771 | settings |
| 772-786 | After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. |
| 787-930 | the Sunset Festival |

## 10-main.js (131 linii)

| Liniile | Sectiunea |
|---|---|
| 2-34 | MAIN: canvas, game states, main loop |
| 35-40 | cont: from the chapter "Continue" points at. Otherwise a new game from the first chapter (the progress of this game is erased). |
| 41-49 | One chapter chosen on the Chapters screen. Nothing is erased. |
| 50-131 | The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. |
