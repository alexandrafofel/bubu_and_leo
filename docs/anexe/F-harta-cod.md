<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa F. Harta codului, sectiune cu sectiune

Fiecare fisier este impartit in sectiuni. O sectiune incepe la un comentariu-titlu (`// ---- ... ----`, `/* ---- ... ---- */` sau un bloc `/* ... */`) si tine pana la urmatoarea. Asa fiecare linie de cod are un loc numit, iar capitolul din docs/ cu acelasi nume o explica.

## 00-head.html (16 linii)

| Liniile | Sectiunea |
|---|---|
| 1-16 | tot fisierul |

## 01-config.js (324 linii)

| Liniile | Sectiunea |
|---|---|
| 2-7 | BUBU ȘI LEO: OUĂLE DE AUR |
| 8-11 | Names (all other texts, Romanian and English, are in the STR table below CONFIG) |
| 12-43 | Heroes (index 0 = Player 1, index 1 = Player 2) |
| 44-62 | Game length |
| 63-71 | Difficulty, chosen per player on the start screen |
| 72-76 | Nest: a hero in it is hidden on every level, the wind does not move it, nothing can hit it |
| 77-86 | Rescue: a hero who was hit cannot walk until the friend comes and presses □ (both games) |
| 87-112 | Co-op mechanisms of levels 7 - 12 (T7): bands cut the map, each crossing opens only when both heroes do their part. |
| 113-121 | The ten seconds: a hit hero waits for his friend, and if nobody comes the level starts again |
| 122-127 | Small enemies: beetles and pinecones (robots, snails and birds in the second game) |
| 128-136 | Obstacles |
| 137-142 | Helpers |
| 143-150 | Boss |
| 151-169 | Two mini-fights per level: one in the middle of the path, one at the nest |
| 170-178 | Controls (keys and controller/keyboard are chosen in Setări). |
| 179-192 | Run: press the left stick (L3) |
| 193-199 | Sound |
| 200-205 | Look |
| 206-247 | The look of levels 7 - 12 and of the heroes (docs/24-sisteme-noi.md, S7) |
| 248-324 | The second game, "Cea mai grea luptă" (invented by the children) |

## 015-lang.js (237 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | SETTINGS chosen in the game's "Setări" menu (saved on this computer) and |
| 11-13 | Puts the chosen game's own heroes, villain and boss values into CONFIG. |
| 14-98 | A text of one of the two games, whichever game is being played (for the screen where the game is chosen). |
| 99-228 | the second game, "Cea mai grea luptă". A key that starts with L: takes the place of the same key without it. |
| 229-237 | Readable name of a keyboard key, for the "choose the keys" screen. |

## 02-core.js (812 linii)

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
| 689-698 | L1: give an egg to the friend. A cream disc with a lilac rim and the letters L1 (the shoulder button). |
| 699-699 | Text that may contain ✕ or □, drawn with the painted icons. Returns nothing. |
| 700-709 | ○: help the friend. Same shape as ✕ and □, in the warm coral of the ○ button. |
| 710-722 | L3: the cap of the left stick with the letter L and a little arrow pressing it down. |
| 723-746 | The four button signs that can stand inside a text: ✕ □ ○ and ◉ (= L3, pressing the left stick). |
| 747-748 | A painted card (panel) used by menus and story screens. |
| 749-812 | Things that never change are painted once and then stamped: much faster per frame. |

## 03-audio.js (560 linii)

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
| 387-470 | the world (volume "Sunete ambientale") |
| 471-474 | Running (L3) in the first game too: the same short soft whoosh. |
| 475-485 | play('egg', 3, k): k = the hero who made the sound. Their sounds go to their own speaker when one was chosen. |
| 486-487 | the controller's own speaker (only when the system shows it as an audio output) |
| 488-528 | Chrome only tells the names of the speakers after the microphone permission was given (ask = true asks for it). |
| 529-560 | Voice-over with a system voice in the chosen language, when one is installed. |

## 04-input.js (166 linii)

| Liniile | Sectiunea |
|---|---|
| 2-145 | INPUT: two DualShock 4 controllers through the Gamepad API (standard mapping) |
| 146-166 | Settings: play hero k with a controller or with the keyboard. |

## 05-chars.js (342 linii)

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
| 334-339 | The small enemy that sleeps and wakes up: a beetle, or one of George's robots. |
| 340-342 | The small enemy that comes down a lane: a rolling pinecone, or a sticky snail. |

## 055-lupta.js (692 linii)

| Liniile | Sectiunea |
|---|---|
| 2-10 | THE SECOND GAME, "CEA MAI GREA LUPTĂ": its characters and things. |
| 11-87 | A soft tapered tube along a curve: tails, necks, arms, legs. |
| 88-139 | A round part (body, head, boot) in the new look: the same blob as puff(). |
| 140-170 | Rotates the point (x, y) around (cx, cy) by a, into out[i], out[i + 1]. |
| 171-233 | Killer's 10, "sewn on": a patch around the digits and a dotted cream stitch just outside them. |
| 234-286 | KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. |
| 287-377 | Killer's ball, like in the drawing: white, with hexagons. |
| 378-451 | One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. |
| 452-483 | A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. |
| 484-508 | A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. |
| 509-532 | A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. |
| 533-591 | The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. |
| 592-607 | The seesaw of level 7 (T7.4): the Krea picture, rocking around its log. |
| 608-621 | The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. |
| 622-634 | Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). |
| 635-661 | One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. |
| 662-674 | One goalkeeper glove: red, white palm, a blue star in the palm. sd = which side it points to. |
| 675-687 | Boon's boomerang bone: two round ends and a shaft, cream amber, with a small crack. |
| 688-692 | What a thrown thing looks like: Killer's and Leo's ball, or Boon's bone. |

## 06-level.js (1313 linii)

| Liniile | Sectiunea |
|---|---|
| 2-97 | LEVELS: definitions, generator (with a reachability check so every egg can |
| 98-103 | The palette of a level: PALS, with the calm Krea colors over it when the new look is on. |
| 104-164 | What the slow ground looks like: mud in the first game; slime, quicksand or tangled vines in the second. [dark rim, body, light, blotch 1, blotch 2, shine] |
| 165-190 | How long a level lasts (seconds): the sun, the medal and the help in updatePlay read this, not CONFIG.levelDuration. |
| 191-207 | the path from the start to the nest |
| 208-241 | water |
| 242-279 | bands (T7, levels 7 - 12): a chasm, water, lava or a wall from the top to the bottom |
| 280-340 | bonus stars: one per third of the map |
| 341-349 | the toy of the level (T7.4): a seesaw from a fallen trunk. Two heroes at its ends make it rock; it gives nothing |
| 350-377 | mud, pinecone lanes, windmills |
| 378-403 | trees, rocks, haystacks |
| 404-444 | reachability (flood fill from the start) |
| 445-461 | beetles |
| 462-474 | sparkling trees (hide eggs) and the treetop star |
| 475-514 | T15: enough small enemies to give the diamonds (they are the only place diamonds come from) |
| 515-538 | golden eggs, in waves from left to right |
| 539-553 | lanterns along the path (sunset level) |
| 554-602 | painting |
| 603-621 | The decor of the second game: as many kinds, with the same ways of reacting, but the things of a jungle at night. |
| 622-667 | One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. |
| 668-757 | The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. |
| 758-1033 | Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. |
| 1034-1045 | A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). |
| 1046-1056 | The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. |
| 1057-1219 | Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). |
| 1220-1313 | The boss arena: one screen, the tallest tree in the valley. |

## 065-mech.js (352 linii)

| Liniile | Sectiunea |
|---|---|
| 1-23 | MECHANISMS (T7): the bands that cut a new level from top to bottom, and the gates |
| 24-82 | The band's middle at height y, and its left and right edges there. |
| 83-97 | startPlay: every gate is closed. The cells of the crossing get the code of the band back (2 or 3). |
| 98-102 | "Ușor": the easiest difficulty of the players who play. |
| 103-106 | A hero on the crossing of a gate (with his own size). |
| 107-118 | A hero standing on the cells of the crossing itself (over the band), not on the land next to it. |
| 119-130 | A hero who is crossing somewhere: on any crossing, or carried by a raft (T9). He cannot press anything. |
| 131-140 | The hero who presses a plate (-1 = nobody). Only the one who is pressing gets the vibration (T7.2). |
| 141-141 | helpers of the safety rules (T7.3, docs/25-niveluri-7-12.md, 3.6) |
| 142-143 | How many bands lie left of (x, y): two places with the same number are on the same side of every band. |
| 144-150 | The hero who plays alone (0 or 1), or -1 when both play or nobody does. |
| 151-152 | G8: the gate the players are stuck at: closed, and no progress for CONFIG.mech.hintAfter seconds. |
| 153-155 | The gate in front of the heroes: the first one that is not fixed yet (G2 fixes every gate both have passed). |
| 156-274 | Every frame, after the heroes and the thrown things (updatePlay). docs/25, 3.2 and 3.6. |
| 275-306 | The step of hero h at the gate in front, for the arrow (guideTarget). |
| 307-327 | A power of hero h (spin or stomp; powerSweep calls this once per power id, and the spin every frame). |
| 328-352 | Every frame: the wobble runs down, and a ball thrown by a hero counts once when it passes the cage. |

## 07-play.js (1143 linii)

| Liniile | Sectiunea |
|---|---|
| 2-18 | GAMEPLAY: heroes, powers, eggs, stars, enemies, wind, butterfly, boss |
| 19-22 | Which button an ability sits on for this hero: 1 = ✕ (the first power), 2 = □ (the second). Decides the word and the hint. |
| 23-44 | Builds chapter idx: a level (its number inside the game is ch.n) or a big fight. L.ch remembers the chapter. |
| 45-51 | the egg quota (docs/27-cota-de-oua.md) |
| 52-96 | L1: the hero gives one of his quota eggs to the friend. Returns true when an egg left. |
| 97-149 | C14: when a player joins in the middle of a level, what the friend holds over his quota goes to him, up to the newcomer's quota. |
| 150-163 | particles |
| 164-183 | The zoom of the camera at this moment: 1 + kick while it comes closer (easeOut) and while it goes back (easeOut the other way). |
| 184-205 | A mechanism clicks and sparks just before it moves (anticipation, S7.6). The pull-back itself is mechMove (02-core.js). |
| 206-230 | collisions |
| 231-249 | eggs and stars |
| 250-277 | Second game only: crystals come in seven colors. One of each color = a rainbow: a few bonus crystals for the team. |
| 278-280 | T15: diamonds from enemies, George from diamonds (docs/28-t15-george-de-doua-ori.md) |
| 281-288 | George comes when the team has half of what it needs (the middle fight) and again when it has all of it (the nest fight). |
| 289-297 | A defeated small enemy leaves diamonds: the only place they come from. Thrown enemies too; nothing else. |
| 298-318 | A snail crawls out of a glowing tree. It is a small enemy like the robots: it chases, it can be beaten, it comes back after a while. |
| 319-341 | How many seconds the friend has. After a few restarts of the same chapter the children get more time (the safety net). |
| 342-384 | Is this a fight with George (the middle one, the one at the nest, or the arena)? Then the ring around each hero counts the hits. |
| 385-401 | rescue: the friend helps a hero who was hit |
| 402-425 | □ pressed. The first hero must stand close (a hug, healing hands). The second one may stand far: he sends a magic ball. |
| 426-434 | A small enemy loses one of its hits. true = that was the last one: it disappears, another one comes later. |
| 435-478 | powers |
| 479-480 | The gloves shake the controller in three short beats (0, 0.28 and 0.56 s), so they feel different in the hand. |
| 481-496 | A stomp (or the claws) next to the big tree, or next to George's throne, shakes it. |
| 497-519 | This hero can throw again: everything of his is home, or his cooldown is over. |
| 520-663 | A second press while his things are still out (inside the cooldown) calls back everything of HIS. The friend's stay out. |
| 664-684 | The spin (claws, gloves, or Bubu's stomp) of one hero, on its own button. |
| 685-713 | The throw (balls or bones) of one hero, on its own button. |
| 714-850 | One ball in the air. Returns false when the ball has come home to Leo and can go. |
| 851-851 | boss: Ciori in the tallest tree (first game), George on his stone throne (second game) |
| 852-923 | Where the ball must land. Ciori: the nest in the tree. George: George himself, while he lies dizzy on the ground. |
| 924-968 | second game: big birds that pick a hero up and carry him a little way (it does not hurt) |
| 969-1143 | Thrown things (pinecones, mud balls) fly in an arc and land on a marked spot. |

## 075-duel.js (441 linii)

| Liniile | Sectiunea |
|---|---|
| 2-29 | MINI-FIGHTS: when the last eggs of a level are collected, one of Ciori's |
| 30-61 | kind 'mid': the middle fight, the same as before. kind 'nest': the harder one at the nest, bigger and quicker. |
| 62-71 | Who the guardian goes after: the bravest player who is not hidden in the nest. |
| 72-73 | While a hero waits for the friend's help the fight rests: the guardian finishes what it was doing, hurts nobody and starts no new attack. |
| 74-75 | Nothing touches a hero hidden in the nest. A player on "Ușor" who only helps (the guardian is after the friend) is spared too. |
| 76-124 | A tired guardian can always be hit. On "Ușor" every hit counts at any time, except on a guardian that is only waiting for a hero to be helped up. |
| 125-126 | T15: what George throws (docs/28-t15-george-de-doua-ori.md, section 4) |
| 127-137 | n bones and balls, at the heroes: they land in a red circle and daze, like the pinecones. |
| 138-153 | n small enemies, thrown near the heroes. follow = the ones of his last heart: they keep after Boon and Killer and never give up. |
| 154-161 | The middle fight (T15): a few bones and balls, two at a time, every few seconds. |
| 162-169 | The nest fight (T15): what he throws depends on the hearts he has left. Called after every heart he loses. |
| 170-246 | George is beaten: his thrown enemies go with him (each one in a puff of dust, without diamonds). |
| 247-314 | the three attack patterns |
| 315-403 | drawing the guardians |
| 404-417 | Things on the ground during a mini-fight: where the next attack will land, shadows. (The shelter ring is in drawNestShelter.) |
| 418-441 | Things above everything: flying guardians, thrown pinecones, leaves, hearts. |

## 08-draw.js (975 linii)

| Liniile | Sectiunea |
|---|---|
| 2-42 | DRAWING THE GAME: world, heroes, effects, HUD |
| 43-196 | Boon's claws while they spin: rainbow slashes that run around him, on a soft shield. |
| 197-420 | Small enemies show how many hits they still take, once they were hit. |
| 421-547 | The helper arrow: a soft arrow next to a hero that shows where to go and, in a small bubble, what waits there. |
| 548-601 | How far the level is: eggs in groups, then the guardian, then the nest. |
| 602-613 | The round picture of a hero (the one painted after the children's drawings) in a ring of his color; r = the radius of the ring. |
| 614-623 | A round green tick, painted: the quota is found. |
| 624-645 | The corner badge: portrait, name, difficulty and, when the level has a quota, "found / quota" in green (done) or red (still missing). 300 x 108, inside the band (16 to 124). |
| 646-646 | "We wait for X in the nest": it used to be written in the world, over the nest. Now it is a banner in the band. |
| 647-661 | "Ajută-l pe Boon! ○" while a friend is down and the seconds are running. It comes before any other banner. |
| 662-916 | The card in the middle, with what a banner says when there is one. A banner never comes down over the world. |
| 917-926 | The last three seconds: the edge of the screen breathes in the fallen hero's own color. Never red-dark, never black. |
| 927-934 | The shelter ring around the nest. It is there on every level: lighter when a hero stands inside, stronger during a mini-fight. |
| 935-950 | The moving decor on screen (snails, ladybugs), every frame. All other decor is already in the level picture. |
| 951-975 | George's arena (the last level of the second game) |

## 09-screens.js (966 linii)

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
| 432-470 | The pictures on the story card of the second game. Returns false for a picture that is the same in both games. |
| 471-471 | level end |
| 472-604 | Three little medals give the bigger player something extra to aim for. |
| 605-628 | pause |
| 629-807 | settings |
| 808-822 | After a restart: send each hero's sounds to the speaker chosen last time, if Chrome still shows it. |
| 823-966 | the Sunset Festival |

## 10-main.js (150 linii)

| Liniile | Sectiunea |
|---|---|
| 2-34 | MAIN: canvas, game states, main loop |
| 35-40 | cont: from the chapter "Continue" points at. Otherwise a new game from the first chapter (the progress of this game is erased). |
| 41-58 | One chapter chosen on the Chapters screen. Nothing is erased. |
| 59-150 | The chapter that is being played is over: its best result is kept and the team total becomes the sum of all results. |
