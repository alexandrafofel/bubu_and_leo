<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa F. Harta codului, sectiune cu sectiune

Fiecare fisier este impartit in sectiuni. O sectiune incepe la un comentariu-titlu (`// ---- ... ----`, `/* ---- ... ---- */` sau un bloc `/* ... */`) si tine pana la urmatoarea. Asa fiecare linie de cod are un loc numit, iar capitolul din docs/ cu acelasi nume o explica.

## 00-head.html (16 linii)

| Liniile | Sectiunea |
|---|---|
| 1-16 | tot fisierul |

## 01-config.js (251 linii)
## 01-config.js (269 linii)

| Liniile | Sectiunea |
|---|---|
| 2-7 | BUBU ȘI LEO: OUĂLE DE AUR |
| 8-11 | Names (all other texts, Romanian and English, are in the STR table below CONFIG) |
| 12-43 | Heroes (index 0 = Player 1, index 1 = Player 2) |
| 44-62 | Game length |
| 63-71 | Difficulty, chosen per player on the start screen |
| 72-76 | Nest: a hero in it is hidden on every level, the wind does not move it, nothing can hit it |
| 77-86 | Rescue: a hero who was hit cannot walk until the friend comes and presses □ (both games) |
| 87-95 | The ten seconds: a hit hero waits for his friend, and if nobody comes the level starts again |
| 96-101 | Small enemies: beetles and pinecones (robots, snails and birds in the second game) |
| 102-110 | Obstacles |
| 111-116 | Helpers |
| 117-124 | Boss |
| 125-143 | Two mini-fights per level: one in the middle of the path, one at the nest |
| 144-152 | Controls (keys and controller/keyboard are chosen in Setări). |
| 153-166 | Run: press the left stick (L3) |
| 167-173 | Sound |
| 174-179 | Look |
| 180-189 | The look of levels 7 - 12 and of the heroes (docs/24-sisteme-noi.md, S7) |
| 190-251 | The second game, "Cea mai grea luptă" (invented by the children) |
| 44-52 | Game length |
| 53-61 | Difficulty, chosen per player on the start screen |
| 62-66 | Nest: a hero in it is hidden on every level, the wind does not move it, nothing can hit it |
| 67-76 | Rescue: a hero who was hit cannot walk until the friend comes and presses □ (both games) |
| 77-85 | The ten seconds: a hit hero waits for his friend, and if nobody comes the level starts again |
| 86-91 | Small enemies: beetles and pinecones (robots, snails and birds in the second game) |
| 92-100 | Obstacles |
| 101-106 | Helpers |
| 107-114 | Boss |
| 115-133 | Two mini-fights per level: one in the middle of the path, one at the nest |
| 134-142 | Controls (keys and controller/keyboard are chosen in Setări). |
| 143-156 | Run: press the left stick (L3) |
| 157-163 | Sound |
| 164-169 | Look |
| 170-207 | The look of levels 7 - 12 and of the heroes (docs/24-sisteme-noi.md, S7) |
| 208-269 | The second game, "Cea mai grea luptă" (invented by the children) |

## 015-lang.js (233 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | SETTINGS chosen in the game's "Setări" menu (saved on this computer) and |
| 11-13 | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 14-98 | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 99-224 | the second game, "Cea mai grea luptă". A key that starts with L: takes the place of the same key without it. |
| 225-233 | Readable name of a keyboard key, for the "choose the keys" screen. |

## 02-core.js (735 linii)

| Liniile | Sectiunea |
|---|---|
| 2-45 | CORE: math, colors, watercolor painting helpers, paper texture, text |
| 46-62 | A closed blob with slightly irregular, hand-painted edges. |
| 63-81 | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 82-190 | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 191-286 | The pattern of a tile of w x h units. sprite() paints at double size, so the pattern is shrunk by half to be w x h again. |
| 287-427 | The materials of the world (T6.3): wood, metal, stone, crystal, leaf, lava |
| 428-450 | A wobbly brush line through points. |
| 451-483 | Paper: noise-generated grain, soft blotches and a few fibers. Multiplied over the whole screen. |
| 484-495 | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 496-533 | Sky colors drift from afternoon (t=0) to sunset (t=1) to dusk (t=1.3). |
| 534-558 | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 559-574 | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 575-593 | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 594-621 | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 622-631 | The ✕ button as a painted icon (blue cross on a cream disc). |
| 632-641 | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 642-651 | L1: give an egg to the friend. A cream disc with a lilac rim and the letters L1 (the shoulder button). |
| 652-652 | Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. |
| 653-662 | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 663-675 | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 676-699 | The four button signs that can stand inside a text: ✕ □ ○ and ◉ (= L3, pressing the left stick). |
| 700-701 | A painted card (panel) used by menus and story screens. |
| 702-735 | Things that never change are painted once and then stamped: much faster per frame. |

## 03-audio.js (551 linii)
## 02-core.js (772 linii)

| Liniile | Sectiunea |
|---|---|
| 2-57 | CORE: math, colors, watercolor painting helpers, paper texture, text |
| 58-74 | A closed blob with slightly irregular, hand-painted edges. |
| 75-93 | Watercolor wash: a few translucent layers plus a soft darker rim where pigment pools. |
| 94-202 | Opaque painted shape for characters: solid fill with a soft colored rim. |
| 203-298 | The pattern of a tile of w x h units. sprite() paints at double size, so the pattern is shrunk by half to be w x h again. |
| 299-474 | The materials of the world (T6.3): wood, metal, stone, crystal, leaf, lava |
| 475-497 | A wobbly brush line through points. |
| 498-530 | Paper: noise-generated grain, soft blotches and a few fibers. Multiplied over the whole screen. |
| 531-542 | Per-scene overlay = paper + warm light tint + soft violet-brown vignette. |
| 543-580 | Sky colors drift from afternoon (t=0) to sunset (t=1) to dusk (t=1.3). |
| 581-605 | The sky of the second game: night, a big moon, stars and northern lights in the seven rainbow colors. |
| 606-621 | Two rows of pointed mountains with pale snow on top, for George's arena. |
| 622-640 | Layered distant hills along a horizon line. night = the colors are used as they are (no afternoon haze). |
| 641-668 | Text. No black outlines: a soft cream halo and a warm shadow instead. |
| 669-678 | The ✕ button as a painted icon (blue cross on a cream disc). |
| 679-688 | The □ button as a painted icon (pink square on a cream disc): help the friend. |
| 689-689 | Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. |
| 690-699 | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 700-712 | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 713-736 | The four button signs that can stand inside a text: ✕ □ ○ and ◉ (= L3, pressing the left stick). |
| 737-738 | A painted card (panel) used by menus and story screens. |
| 739-772 | Things that never change are painted once and then stamped: much faster per frame. |

## 03-audio.js (552 linii)

| Liniile | Sectiunea |
|---|---|
| 2-71 | SOUND: everything is generated with the Web Audio API. |
| 72-72 | building blocks: every sound is made on the bus it is given |
| 73-102 | A controller's speaker is tiny: it cannot play low notes. On such a speaker (bus.small) anything low goes one or two octaves up. |
| 103-116 | A tiny cartoon voice: a buzzy tone through a moving "mouth" filter. f0 -> f1 is the melody of the syllable. |
| 117-129 | A soft roar or growl: a low triangle that slides down, with a quick tremble (the "rrr"). Warm, never harsh. |
| 130-144 | instruments |
| 145-238 | music: calm pentatonic patterns, a different one per level |
| 239-352 | the heroes' own language: 33 invented words each |
| 353-366 | Talk(k, word): hero k says one of its words. Routed like the hero's other sounds (own speaker when one was chosen). |
| 367-368 | sound effects |
| 369-370 | Every effect gets: b = the bus to play on, t = the time now on that bus, x = an optional value. |
| 371-386 | the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) |
| 387-462 | the world (volume "Sunete ambientale") |
| 463-465 | Running (L3) in the first game too: the same short soft whoosh. |
| 466-476 | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 477-478 | the controller's own speaker (only when the system shows it as an audio output) |
| 479-519 | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 520-551 | Voice-over with a system voice in the chosen language, when one is installed. |
| 371-385 | the heroes' own sounds (volume "Sunete personaje"; they can play in the controller) |
| 386-463 | the world (volume "Sunete ambientale") |
| 464-466 | Running (L3) in the first game too: the same short soft whoosh. |
| 467-477 | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 478-479 | the controller's own speaker (only when the system shows it as an audio output) |
| 480-520 | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 521-552 | Voice-over with a system voice in the chosen language, when one is installed. |

## 04-input.js (166 linii)

| Liniile | Sectiunea |
|---|---|
| 2-145 | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) |
| 146-166 | Settings: play hero k with a controller or with the keyboard. |

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

## 055-lupta.js (566 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | THE SECOND GAME, "CEA MAI GREA LUPTĂ": its characters and things. |
| 11-87 | A soft tapered tube along a curve: tails, necks, arms, legs. |
| 88-139 | A round part (body, head, boot) in the new look: the same blob as puff(). |
| 140-170 | Rotates the point (x, y) around (cx, cy) by a, into out[i], out[i + 1]. |
| 171-232 | Killer's 10, "sewn on": a patch around the digits and a dotted cream stitch just outside them. |
| 233-284 | KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. |
| 285-371 | Killer's ball, like in the drawing: white, with hexagons. |
| 372-408 | One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. |
| 409-433 | A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. |
| 434-452 | A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. |
| 453-476 | A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. |
| 477-488 | The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. |
| 489-502 | The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. |
| 503-515 | Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). |
| 516-535 | One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. |
| 536-548 | One goalkeeper glove: red, white palm, a blue star in the palm. sd = which side it points to. |
| 549-561 | Boon's boomerang bone: two round ends and a shaft, cream amber, with a small crack. |
| 562-566 | What a thrown thing looks like: Killer's and Leo's ball, or Boon's bone. |

## 06-level.js (985 linii)
## 06-level.js (1115 linii)

| Liniile | Sectiunea |
|---|---|
| 2-72 | LEVELS: definitions, generator (with a reachability check so every egg can |
| 73-133 | What the slow ground looks like: mud in the first game; slime, quicksand or tangled vines in the second. [dark rim, body, light, blotch 1, blotch 2, shine] |
| 134-159 | How long a level lasts (seconds): the sun, the medal and the help in updatePlay read this, not CONFIG.levelDuration. |
| 160-176 | the path from the start to the nest |
| 177-227 | water |
| 228-280 | bonus stars: one per third of the map |
| 281-308 | mud, pinecone lanes, windmills |
| 309-334 | trees, rocks, haystacks |
| 335-369 | reachability (flood fill from the start) |
| 370-386 | beetles |
| 387-412 | sparkling trees (hide eggs) and the treetop star |
| 413-435 | golden eggs, in waves from left to right |
| 436-450 | lanterns along the path (sunset level) |
| 451-459 | painting |
| 460-478 | The decor of the second game: as many kinds, with the same ways of reacting, but the things of a jungle at night. |
| 479-524 | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 525-599 | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 600-856 | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 857-868 | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 869-879 | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 880-891 | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 892-985 | The boss arena: one screen, the tallest tree in the valley. |

## 07-play.js (1040 linii)
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
| 860-1021 | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 1022-1115 | The boss arena: one screen, the tallest tree in the valley. |

## 07-play.js (993 linii)

| Liniile | Sectiunea |
|---|---|
| 2-18 | GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss |
| 19-22 | Which button an ability sits on for this hero: 1 = ✕ (the first power), 2 = □ (the second). Decides the word and the hint. |
| 23-43 | Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. |
| 44-51 | the egg quota (docs/27-cota-de-oua.md) |
| 52-97 | L1: the hero gives one of his quota eggs to the friend. Returns true when an egg left. |
| 98-154 | C14: when a player joins in the middle of a level, what the friend holds over the limit goes to him. |
| 155-176 | particles |
| 177-201 | collisions |
| 202-221 | eggs and stars |
| 222-235 | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 236-263 | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 264-313 | How many seconds the friend has. After a few restarts of the same chapter the children get more time (the safety net). |
| 314-329 | rescue: the friend helps a hero who was hit |
| 330-353 | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 354-361 | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 362-404 | powers |
| 405-406 | The gloves shake the controller in three short beats (0, 0.28 and 0.56 s), so they feel different in the hand. |
| 407-422 | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 423-445 | This hero can throw again: everything of his is home, or his cooldown is over. |
| 446-576 | A second press while his things are still out (inside the cooldown) calls back everything of HIS. The friend's stay out. |
| 577-597 | The spin (claws, gloves, or Bubu's stomp) of one hero, on its own button. |
| 598-626 | The throw (balls or bones) of one hero, on its own button. |
| 627-758 | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 759-759 | boss: Ciori in the tallest tree (first game), George on his stone throne (second game) |
| 760-830 | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 831-868 | second game: big birds that pick a hero up and carry him a little way (it does not hurt) |
| 869-1040 | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |
| 23-76 | Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. |
| 77-90 | particles |
| 91-110 | The zoom of the camera at this moment: 1 + kick while it comes closer (easeOut) and while it goes back (easeOut the other way). |
| 111-132 | A mechanism clicks and sparks just before it moves (anticipation, S7.6). The pull-back itself is mechMove (02-core.js). |
| 133-157 | collisions |
| 158-175 | eggs and stars |
| 176-189 | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 190-217 | The order on a level: wave 1, wave 2, MIDDLE FIGHT (after the second-to-last wave), wave 3, NEST FIGHT, then the nest opens. |
| 218-264 | How many seconds the friend has. After a few restarts of the same chapter the children get more time (the safety net). |
| 265-280 | rescue: the friend helps a hero who was hit |
| 281-304 | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 305-312 | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 313-355 | powers |
| 356-357 | The gloves shake the controller in three short beats (0, 0.28 and 0.56 s), so they feel different in the hand. |
| 358-373 | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 374-396 | This hero can throw again: everything of his is home, or his cooldown is over. |
| 397-539 | A second press while his things are still out (inside the cooldown) calls back everything of HIS. The friend's stay out. |
| 540-560 | The spin (claws, gloves, or Bubu's stomp) of one hero, on its own button. |
| 561-589 | The throw (balls or bones) of one hero, on its own button. |
| 590-716 | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 717-717 | boss: Ciori in the tallest tree (first game), George on his stone throne (second game) |
| 718-789 | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 790-827 | second game: big birds that pick a hero up and carry him a little way (it does not hurt) |
| 828-993 | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |

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

## 08-draw.js (731 linii)
## 08-draw.js (854 linii)

| Liniile | Sectiunea |
|---|---|
| 2-42 | DRAWING THE GAME: world, heroes, effects, HUD |
| 43-91 | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 92-162 | The trail of a running hero: three fading copies of him, and six speed lines behind. |
| 163-381 | Small enemies show how many hits they still take, once they were hit. |
| 382-491 | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 492-533 | How far the level is: eggs in groups, then the guardian, then the nest. |
| 534-545 | The round picture of a hero (the one painted after the children's drawings) in a ring of his color; r = the radius of the ring. |
| 546-555 | A round green tick, painted: the quota is found. |
| 556-576 | The corner badge: portrait, name, difficulty and, when the level has a quota, "found / quota" in green (done) or red (still missing). 300 x 108, inside the band (16 to 124). |
| 577-577 | "We wait for X in the nest": it used to be written in the world, over the nest. Now it is a banner in the band. |
| 578-592 | "Ajută-l pe Boon! ○" while a friend is down and the seconds are running. It comes before any other banner. |
| 593-673 | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 674-683 | The last three seconds: the edge of the screen breathes in the fallen hero's own color. Never red-dark, never black. |
| 684-691 | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 692-707 | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 708-731 | George's arena (the last level of the second game) |
| 43-173 | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 174-392 | Small enemies show how many hits they still take, once they were hit. |
| 393-483 | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 484-541 | How far the level is: eggs in groups, then the guardian, then the nest. |
| 542-542 | "We wait for X in the nest": it used to be written in the world, over the nest. Now it is a banner in the band. |
| 543-553 | "Ajută-l pe Boon! ○" while a friend is down and the seconds are running. It comes before any other banner. |
| 554-795 | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 796-805 | The last three seconds: the edge of the screen breathes in the fallen hero's own color. Never red-dark, never black. |
| 806-813 | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 814-829 | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 830-854 | George's arena (the last level of the second game) |

## 09-screens.js (963 linii)

| Liniile | Sectiunea |
|---|---|
| 2-22 | SCREENS: start, level story card, level end, pause, settings, festival ending. |
| 23-40 | A save from before chapters (version 3 or older) becomes version 4. It changes only what is missing, so it can run again. |
| 41-42 | the progress of the chosen game, made if it is not there yet |
| 43-64 | "New game": the progress of the chosen game is erased. The other game and the settings stay. |
| 65-84 | Puts the saved settings back: language, volumes, difficulty, keys, who plays whom. |
| 85-89 | the furthest chapter open on the Chapters screen (-1: no chapter was ever finished, the button is not shown) |
| 90-96 | Mouse: every clickable thing adds a rectangle while it is drawn. |
| 97-98 | Any "go on" press: ✕ on any controller, Enter, Space, a player's power key or a mouse click. |
| 99-110 | What to press to go on: ✕ when a controller plays, otherwise the power key of a keyboard player. |
| 111-141 | The two players trade heroes. Controllers, keys, difficulty and the helper arrow stay with the players. |
| 142-159 | The backdrop of the second game: the jungle at night, under the moon and the northern lights. |
| 160-164 | The start-screen backdrop of each game is painted once, the first time it is needed. |
| 165-179 | Sets up the game (the second game is the only one now): its heroes, villain and boss values, its texts, pictures, music and progress. |
| 180-188 | boot + title |
| 189-196 | The buttons under the heroes: "Continue: ...", "Chapters", "New game". At the very first start only one, and it says "Start!". |
| 197-337 | What the chosen button does, once every player who joined is "Ready!". |
| 338-410 | the little picture at the top of a card: the level's sky and ground and the three pictures of its story card. Painted once. |
| 411-431 | level story card |
| 432-468 | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 469-469 | level end |
| 470-601 | Three little medals give the bigger player something extra to aim for. |
| 602-625 | pause |
| 626-804 | settings |
| 805-819 | After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. |
| 820-963 | the Sunset Festival |

## 10-main.js (150 linii)

| Liniile | Sectiunea |
|---|---|
| 2-34 | MAIN: canvas, game states, main loop |
| 35-40 | cont: from the chapter "Continue" points at. Otherwise a new game from the first chapter (the progress of this game is erased). |
| 41-58 | One chapter chosen on the Chapters screen. Nothing is erased. |
| 59-150 | The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. |
