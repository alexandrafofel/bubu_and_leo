<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa D. Valorile din CONFIG

Valorile asa cum sunt acum in src/01-config.js. Explicatia fiecarei valori si motivul alegerii sunt in docs/03-config.md.

| Cheie | Valoare | Comentariul din cod |
|---|---|---|
| `villainName` | `"Ciori"` |  |
| `language` | `"ro"` | starting language: 'ro' or 'en'. Changeable in Setări. |
| `heroes.0.name` | `"Bubu"` |  |
| `heroes.0.color` | `"#F08A3C"` | player color on screen (rings, badges) |
| `heroes.0.color2` | `"#6FA35E"` | spots |
| `heroes.0.scarf` | `"#D9463C"` |  |
| `heroes.0.speed` | `330` | walking speed, pixels per second |
| `heroes.0.stompRadius` | `280` | enemies inside this circle get stunned |
| `heroes.0.pullRadius` | `360` | golden eggs inside this circle fly to Bubu |
| `heroes.0.stompCooldown` | `0.7` | seconds between stomps |
| `heroes.0.stunTime` | `2.8` | how long stomped enemies stay stunned |
| `heroes.1.name` | `"Leo"` |  |
| `heroes.1.color` | `"#F6C63C"` | shirt (yellow) |
| `heroes.1.color2` | `"#3F78C8"` | shorts (blue) |
| `heroes.1.headband` | `"#D9463C"` |  |
| `heroes.1.speed` | `350` |  |
| `heroes.1.kickSpeed` | `760` | quick tap on the button |
| `heroes.1.kickSpeedMax` | `1400` | fully charged kick (hold the button) |
| `heroes.1.chargeTime` | `0.9` | seconds to hold for a full kick |
| `heroes.1.ballsPerKick` | `8` | balls per tap, spread evenly around a circle (all directions) |
| `heroes.1.ballsPerKickMax` | `12` | balls per fully charged kick |
| `heroes.1.kickCooldown` | `1.2` | seconds before a new kick while the balls are still flying (pressing again then calls them back) |
| `heroes.1.ballLife` | `2.3` | seconds the balls fly after a tap |
| `heroes.1.ballLifeMax` | `3.8` | seconds after a full kick |
| `levels` | `6` | levels before the boss (1 to 6) |
| `decorPerLevel` | `1700` | small meadow things per level (grass, daisies, pebbles...). 6 x 1700 = 10,200 with the rest |
| `levelDuration` | `360` | target seconds per level. Egg count scales with it. |
| `eggsPerMinute` | `10` | eggs per level = levelDuration / 60 * eggsPerMinute |
| `wavesPerLevel` | `3` | eggs appear in this many groups, left to right |
| `starsPerLevel` | `3` |  |
| `giantEggValue` | `20` | the secret egg in the cave (level 5) |
| `difficulty.easy.enemySpeed` | `0.55` |  |
| `difficulty.easy.pickupRadius` | `105` |  |
| `difficulty.easy.dizzyTime` | `1` |  |
| `difficulty.easy.wakeRadius` | `0.75` |  |
| `difficulty.easy.wind` | `0.5` |  |
| `difficulty.easy.ballSize` | `1.3` |  |
| `difficulty.easy.ballSpeed` | `0.85` |  |
| `difficulty.normal.enemySpeed` | `1` |  |
| `difficulty.normal.pickupRadius` | `64` |  |
| `difficulty.normal.dizzyTime` | `2` |  |
| `difficulty.normal.wakeRadius` | `1` |  |
| `difficulty.normal.wind` | `1` |  |
| `difficulty.normal.ballSize` | `1` |  |
| `difficulty.normal.ballSpeed` | `1` |  |
| `difficulty.hard.enemySpeed` | `1.3` |  |
| `difficulty.hard.pickupRadius` | `54` |  |
| `difficulty.hard.dizzyTime` | `2.4` |  |
| `difficulty.hard.wakeRadius` | `1.25` |  |
| `difficulty.hard.wind` | `1.25` |  |
| `difficulty.hard.ballSize` | `1` |  |
| `difficulty.hard.ballSpeed` | `1` |  |
| `defaultDifficulty` | `["easy","normal"]` | Bubu, Leo |
| `guideArrow` | `[true,false]` | the soft arrow that shows each player where to go (Bubu, Leo) |
| `nestSafe` | `true` |  |
| `nestSafeRadius` | `150` | how close to the nest (centre) a hero must stand to hide |
| `nestHideSoundGap` | `3` | seconds between two "ih-ih" sounds when heroes keep stepping in and out |
| `rescue.enabled` | `true` | false = the old rule: a hit hero gets up alone after a moment |
| `rescue.reachNear` | `180` | the first hero (Bubu, Boon) must stand this close to help: a hug, healing hands |
| `rescue.reachFar` | `620` | the second hero (Leo, Killer) can help from this far: he sends a magic ball |
| `rescue.ballSpeed` | `900` | how fast the magic ball flies to the friend |
| `rescue.safeAfter` | `2.6` | seconds nothing can hit a hero who was just helped up |
| `rescue.bothDown` | `3` | both heroes down at the same time: they get up alone after this many seconds |
| `rescue.autoAfter` | `0` | a hero gets up alone after this many seconds (0 = never: only the friend can help) |
| `rescue.callEvery` | `5` | seconds between two calls for help |
| `smallEnemy.hits` | `2` | hits (stomp, claws or ball) before a small enemy disappears |
| `smallEnemy.respawn` | `22` | seconds until another one appears in its place |
| `beetleSpeed` | `150` |  |
| `beetleWakeRadius` | `205` |  |
| `pineconeSpeed` | `165` |  |
| `mudSlow` | `0.45` | speed multiplier in mud |
| `windEvery` | `9` | seconds between gusts on the windy hill |
| `windDuration` | `2.6` |  |
| `windForce` | `185` |  |
| `butterflyEvery` | `[40,70]` | a butterfly appears every 40 to 70 seconds |
| `butterflyBoost` | `1.5` | speed multiplier |
| `butterflyTime` | `6` | seconds of boost |
| `hintAfter` | `10` | seconds without an egg before a golden arrow appears |
| `boss.hits` | `5` | balls in the nest needed to win (3 before the update, now a harder fight) |
| `boss.shakes` | `[2,2,3,3,3]` | stomps needed to shake Ciori down, per round |
| `boss.downTime` | `5` | seconds Ciori stays down |
| `boss.throwEvery` | `[3,2.5,2.1,1.8,1.6]` | seconds between pinecones, per round |
| `duel.enabled` | `true` | false = no mini-fights, the nest opens right after the last eggs |
| `duel.hp` | `[3,3,4,4,4,5]` | hits needed in the middle fight, per level (one less on Ușor, one more on Greu) |
| `duel.tiredTime` | `2.4` | seconds the guardian stays tired (the moment to hit it) |
| `duel.eggsPerHit` | `4` | golden eggs that fly out at every hit |
| `duel.eggsAtEnd` | `8` |  |
| `duel.finalHp` | `[5,5,6,6,7,8]` | hits needed at the nest, per level |
| `duel.finalSize` | `1.3` | guardian drawn and hit this many times bigger |
| `duel.finalSpeed` | `1.25` | multiplier on how fast it moves and attacks |
| `duel.finalPrep` | `0.75` | multiplier on the warning time before an attack (shorter warning) |
| `duel.finalTired` | `0.75` | multiplier on how long it stays tired (shorter window to hit) |
| `duel.finalExtra` | `1` | one more attack in every round |
| `duel.angryAt` | `0.5` | below this share of hits left it gets angry: one more attack, and it shakes |
| `duel.mercy` | `0.06` | every time a hero is hit in a fight the guardian gets this much slower and stays tired longer. 0 = off |
| `duel.mercyMax` | `10` | counted up to this many hits. From then on every hit on the guardian counts at any time, like on "Ușor" |
| `deadzone` | `0.25` | stick deadzone (0.25 or more) |
| `vibration` | `true` |  |
| `keys.0.up` | `"KeyW"` | b = help the friend (the □ button) |
| `keys.0.down` | `"KeyS"` | b = help the friend (the □ button) |
| `keys.0.left` | `"KeyA"` | b = help the friend (the □ button) |
| `keys.0.right` | `"KeyD"` | b = help the friend (the □ button) |
| `keys.0.a` | `"Space"` | b = help the friend (the □ button) |
| `keys.0.b` | `"KeyE"` | b = help the friend (the □ button) |
| `keys.1.up` | `"ArrowUp"` | b = help the friend (the □ button) |
| `keys.1.down` | `"ArrowDown"` | b = help the friend (the □ button) |
| `keys.1.left` | `"ArrowLeft"` | b = help the friend (the □ button) |
| `keys.1.right` | `"ArrowRight"` | b = help the friend (the □ button) |
| `keys.1.a` | `"Enter"` | b = help the friend (the □ button) |
| `keys.1.b` | `"ShiftRight"` | b = help the friend (the □ button) |
| `volume.music` | `0.5` | starting values, 0 to 1. Changeable in Setări. |
| `volume.ambient` | `0.7` | starting values, 0 to 1. Changeable in Setări. |
| `volume.characters` | `0.8` | starting values, 0 to 1. Changeable in Setări. |
| `footsteps` | `true` |  |
| `babble` | `true` | the heroes talk in their own invented words (30 each). false = only the sound effects |
| `voice` | `true` | read level intros aloud (needs a system voice for the chosen language) |
| `voiceRate` | `0.9` |  |
| `fontTitle` | `"Georgia, \"Times New Roman\", serif"` |  |
| `fontUI` | `"\"Avenir Next\", \"Trebuchet MS\", \"Helvetica Neue\", Arial, sans-serif"` |  |
| `maxRenderWidth` | `1920` | lower to 1600 or 1280 if the Mac struggles |
| `saveKey` | `"bubu-leo-oua-de-aur-v1"` |  |
| `lupta.villainName` | `"George cel Rău"` |  |
| `lupta.heroes.0.name` | `"Boon"` |  |
| `lupta.heroes.0.color` | `"#2FBFA8"` | player color on screen (rings, badges) |
| `lupta.heroes.0.color2` | `"#B7D645"` |  |
| `lupta.heroes.0.speed` | `330` |  |
| `lupta.heroes.0.stompRadius` | `220` | the circle of the spinning claws: enemies inside are hit, and nothing can hit Boon |
| `lupta.heroes.0.pullRadius` | `300` | rainbow crystals inside this circle fly to Boon |
| `lupta.heroes.0.stompCooldown` | `1.25` | seconds from the start of one spin to the next |
| `lupta.heroes.0.stunTime` | `2.8` |  |
| `lupta.heroes.0.spinTime` | `0.85` | how long the claws spin |
| `lupta.heroes.1.name` | `"Killer"` |  |
| `lupta.heroes.1.color` | `"#3B6FE0"` | shirt (blue) |
| `lupta.heroes.1.color2` | `"#E4583C"` | boots (red) |
| `lupta.heroes.1.speed` | `350` |  |
| `lupta.heroes.1.kickSpeed` | `760` | the same as Leo |
| `lupta.heroes.1.kickSpeedMax` | `1400` | the same as Leo |
| `lupta.heroes.1.chargeTime` | `0.9` | the same as Leo |
| `lupta.heroes.1.ballsPerKick` | `8` | the same as Leo |
| `lupta.heroes.1.ballsPerKickMax` | `12` | the same as Leo |
| `lupta.heroes.1.kickCooldown` | `1.2` | the same as Leo |
| `lupta.heroes.1.ballLife` | `2.3` | the same as Leo |
| `lupta.heroes.1.ballLifeMax` | `3.8` | the same as Leo |
| `lupta.boss.hits` | `6` | balls that must hit George while he lies on the ground (one more than for Ciori) |
| `lupta.boss.shakes` | `[2,2,3,3,3,4]` | claw spins needed to shake George off his throne, per round |
| `lupta.boss.downTime` | `5` |  |
| `lupta.boss.throwEvery` | `[3,2.5,2.1,1.8,1.6,1.4]` |  |
| `lupta.boss.roarRadius` | `520` | back on the throne George roars: heroes closer than this are pushed away (it does not hurt) |
| `lupta.boss.roarPush` | `1500` |  |
| `lupta.levels` | `6` | levels of the second game that exist. Part Two (levels 7 - 12) raises it as each new level is made |
| `lupta.duelHp` | `[3,3,4,5,5,6]` | hits George takes in the middle fight, per level (the first game: CONFIG.duel.hp) |
| `lupta.duelFinalHp` | `[5,6,6,7,8,9]` | hits George takes at the nest, per level (the first game: CONFIG.duel.finalHp) |
| `lupta.bossSize` | `1.5` | how big George is in his arena (in the mini-fights he grows from level to level, see DUEL_DEFS_L) |
| `lupta.shrink` | `0.5` | a hero who was hit is this small until the friend helps |
| `lupta.rainbowBonus` | `5` | crystals for the team when all seven colors were gathered |
| `lupta.birdSpeed` | `250` | big birds: how fast they fly |
| `lupta.birdCarry` | `1.7` | seconds a bird carries a hero before it lets go |
| `lupta.birdEvery` | `[7,13]` | a bird comes every 7 to 13 seconds (per bird of the level) |
