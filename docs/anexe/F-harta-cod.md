<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa F. Harta codului, sectiune cu sectiune

Fiecare fisier este impartit in sectiuni. O sectiune incepe la un comentariu-titlu (`// ---- ... ----`, `/* ---- ... ---- */` sau un bloc `/* ... */`) si tine pana la urmatoarea. Asa fiecare linie de cod are un loc numit, iar capitolul din docs/ cu acelasi nume o explica.

## 00-head.html (16 linii)

| Liniile | Sectiunea |
|---|---|
| 1-16 | tot fisierul |

## 01-config.js (109 linii)

| Liniile | Sectiunea |
|---|---|
| 2-7 | BUBU ȘI LEO: OUĂLE DE AUR |
| 8-11 | Names (all other texts, Romanian and English, are in the STR table below CONFIG) |
| 12-38 | Heroes (index 0 = Player 1, index 1 = Player 2) |
| 39-46 | Game length |
| 47-55 | Difficulty, chosen per player on the start screen |
| 56-64 | Obstacles |
| 65-70 | Helpers |
| 71-78 | Boss |
| 79-88 | Mini-fight before the nest, one per level |
| 89-96 | Controls (keys and controller/keyboard are chosen in Setări) |
| 97-102 | Sound |
| 103-109 | Look |

## 015-lang.js (160 linii)

| Liniile | Sectiunea |
|---|---|
| 2-142 | SETTINGS chosen in the game's "Setări" menu (saved on this computer) and |
| 143-151 | T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments. |
| 152-160 | Readable name of a keyboard key, for the "choose the keys" screen. |

## 02-core.js (302 linii)

| Liniile | Sectiunea |
|---|---|
| 2-39 | CORE: math, colors, watercolor painting helpers, paper texture, text |
| 40-56 | A closed blob with slightly irregular, hand-painted edges. |
| 57-75 | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 76-86 | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 87-103 | A wobbly brush line through points. |
| 104-136 | Paper: noise-generated grain, soft blotches and a few fibers. Multiplied over the whole screen. |
| 137-148 | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 149-186 | Sky colors drift from afternoon (t=0) to sunset (t=1) to dusk (t=1.3). |
| 187-205 | Layered distant hills along a horizon line. |
| 206-233 | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 234-243 | The ✕ button as a painted icon (blue cross on a cream disc). |
| 244-266 | Text that may contain ✕, drawn with the painted icon. Returns nothing. |
| 267-268 | A painted card (panel) used by menus and story screens. |
| 269-302 | Things that never change are painted once and then stamped: much faster per frame. |

## 03-audio.js (313 linii)

| Liniile | Sectiunea |
|---|---|
| 2-63 | SOUND: everything is generated with the Web Audio API. |
| 64-85 | building blocks: every sound is made on the bus it is given |
| 86-101 | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 102-116 | instruments |
| 117-187 | music: calm pentatonic patterns, a different one per level |
| 188-189 | sound effects |
| 190-191 | Every effect gets: b = the bus to play on, t = the time now on that bus, x = an optional value. |
| 192-211 | the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) |
| 212-238 | the world (volume "Sunete ambientale") |
| 239-245 | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 246-247 | the controller's own speaker (only when the system shows it as an audio output) |
| 248-281 | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 282-313 | Voice-over with a system voice in the chosen language, when one is installed. |

## 04-input.js (156 linii)

| Liniile | Sectiunea |
|---|---|
| 2-135 | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) |
| 136-156 | Settings: play hero k with a controller or with the keyboard. |

## 05-chars.js (319 linii)

| Liniile | Sectiunea |
|---|---|
| 2-26 | CHARACTERS AND THINGS: all drawn with canvas shapes, picture-book style. |
| 27-70 | BUBU: round baby triceratops, orange with green spots and a tiny red scarf. |
| 71-117 | LEO: young footballer, yellow shirt, blue shorts, red headband. |
| 118-130 | The football: cream with terracotta patches. |
| 131-162 | CIORI: a mischievous plum-colored crow. mood: cheeky \| dizzy \| sorry \| happy |
| 163-280 | Grumpy sleepy beetle. state: sleep \| wake \| chase \| return \| stun \| knock |
| 281-296 | A woven nest seen from above. |
| 297-319 | Small painted icons for hints (no words needed). |

## 06-level.js (632 linii)

| Liniile | Sectiunea |
|---|---|
| 2-80 | LEVELS: definitions, generator (with a reachability check so every egg can |
| 81-97 | the path from the start to the nest |
| 98-147 | water |
| 148-200 | bonus stars: one per third of the map |
| 201-228 | mud, pinecone lanes, windmills |
| 229-254 | trees, rocks, haystacks |
| 255-289 | reachability (flood fill from the start) |
| 290-306 | beetles |
| 307-332 | sparkling trees (hide eggs) and the treetop star |
| 333-354 | golden eggs, in waves from left to right |
| 355-367 | lanterns along the path (sunset level) |
| 368-580 | painting |
| 581-591 | Granulation speckles, watercolor blooms and the warm afternoon light. |
| 592-632 | The boss arena: one screen, the tallest tree in the valley. |

## 07-play.js (543 linii)

| Liniile | Sectiunea |
|---|---|
| 2-50 | GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss |
| 51-72 | particles |
| 73-97 | collisions |
| 98-161 | eggs and stars |
| 162-382 | powers |
| 383-432 | boss: Ciori in the tallest tree |
| 433-543 | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |

## 075-duel.js (339 linii)

| Liniile | Sectiunea |
|---|---|
| 2-33 | MINI-FIGHTS: when the last eggs of a level are collected, one of Ciori's |
| 34-43 | Who the guardian goes after: the bravest player who is not hidden in the nest. |
| 44-150 | Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. |
| 151-217 | the three attack patterns |
| 218-303 | drawing the guardians |
| 304-322 | Things on the ground: the shelter ring, where the next attack will land, shadows. |
| 323-339 | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

## 08-draw.js (372 linii)

| Liniile | Sectiunea |
|---|---|
| 2-191 | DRAWING THE GAME: world, heroes, effects, HUD |
| 192-266 | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 267-372 | How far the level is: eggs in groups, then the guardian, then the nest. |

## 09-screens.js (607 linii)

| Liniile | Sectiunea |
|---|---|
| 2-22 | SCREENS: start, level story card, level end, pause, settings, festival ending. |
| 23-45 | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 46-52 | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 53-54 | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 55-66 | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 67-105 | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 106-199 | boot + title |
| 200-237 | level story card |
| 238-238 | level end |
| 239-341 | Three little medals give the bigger player something extra to aim for. |
| 342-360 | pause |
| 361-529 | settings |
| 530-538 | After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. |
| 539-607 | the Sunset Festival |

## 10-main.js (117 linii)

| Liniile | Sectiunea |
|---|---|
| 2-117 | MAIN: canvas, game states, main loop |
