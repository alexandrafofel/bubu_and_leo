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
| `heroes.1.ballLife` | `2.3` | seconds the ball flies after a tap |
| `heroes.1.ballLifeMax` | `3.8` | seconds after a full kick |
| `levels` | `6` | levels before the boss (1 to 6) |
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
| `difficulty.easy.aimAssist` | `true` |  |
| `difficulty.normal.enemySpeed` | `1` |  |
| `difficulty.normal.pickupRadius` | `64` |  |
| `difficulty.normal.dizzyTime` | `2` |  |
| `difficulty.normal.wakeRadius` | `1` |  |
| `difficulty.normal.wind` | `1` |  |
| `difficulty.normal.aimAssist` | `false` |  |
| `difficulty.hard.enemySpeed` | `1.3` |  |
| `difficulty.hard.pickupRadius` | `54` |  |
| `difficulty.hard.dizzyTime` | `2.4` |  |
| `difficulty.hard.wakeRadius` | `1.25` |  |
| `difficulty.hard.wind` | `1.25` |  |
| `difficulty.hard.aimAssist` | `false` |  |
| `defaultDifficulty` | `["easy","normal"]` | Bubu, Leo |
| `guideArrow` | `[true,false]` | the soft arrow that shows each player where to go (Bubu, Leo) |
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
| `boss.hits` | `3` | balls in the nest needed to win |
| `boss.shakes` | `[1,2,2]` | stomps needed to shake Ciori down, per round |
| `boss.downTime` | `7` | seconds Ciori stays down |
| `boss.throwEvery` | `[3.4,2.7,2.2]` | seconds between pinecones, per round |
| `duel.enabled` | `true` | false = no mini-fights, the nest opens right after the last eggs |
| `duel.hp` | `[3,3,4,4,4,5]` | hits needed, per level (one less on Ușor, one more on Greu) |
| `duel.tiredTime` | `2.4` | seconds the guardian stays tired (the moment to hit it) |
| `duel.eggsPerHit` | `4` | golden eggs that fly out at every hit |
| `duel.eggsAtEnd` | `8` |  |
| `duel.safeRadius` | `150` | standing this close to the nest = hidden, nothing can hit you |
| `deadzone` | `0.25` | stick deadzone (0.25 or more) |
| `vibration` | `true` |  |
| `keys.0.up` | `"KeyW"` |  |
| `keys.0.down` | `"KeyS"` |  |
| `keys.0.left` | `"KeyA"` |  |
| `keys.0.right` | `"KeyD"` |  |
| `keys.0.a` | `"Space"` |  |
| `keys.1.up` | `"ArrowUp"` |  |
| `keys.1.down` | `"ArrowDown"` |  |
| `keys.1.left` | `"ArrowLeft"` |  |
| `keys.1.right` | `"ArrowRight"` |  |
| `keys.1.a` | `"Enter"` |  |
| `volume.music` | `0.5` | starting values, 0 to 1. Changeable in Setări. |
| `volume.ambient` | `0.7` | starting values, 0 to 1. Changeable in Setări. |
| `volume.characters` | `0.8` | starting values, 0 to 1. Changeable in Setări. |
| `footsteps` | `true` |  |
| `voice` | `true` | read level intros aloud (needs a system voice for the chosen language) |
| `voiceRate` | `0.9` |  |
| `fontTitle` | `"Georgia, \"Times New Roman\", serif"` |  |
| `fontUI` | `"\"Avenir Next\", \"Trebuchet MS\", \"Helvetica Neue\", Arial, sans-serif"` |  |
| `maxRenderWidth` | `1920` | lower to 1600 or 1280 if the Mac struggles |
| `saveKey` | `"bubu-leo-oua-de-aur-v1"` |  |
