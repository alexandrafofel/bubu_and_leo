<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->

# Anexa D. Valorile din CONFIG

Valorile asa cum sunt acum in src/01-config.js. Explicatia fiecarei valori si motivul alegerii sunt in docs/03-config.md.

| Cheie | Valoare | Comentariul din cod |
|---|---|---|
| `villainName` | `"George cel Rău"` |  |
| `language` | `"ro"` | starting language: 'ro' or 'en'. Changeable in Setări. |
| `heroes.0.name` | `"Boon"` |  |
| `heroes.0.power` | `"spin"` | ✕: the stomp (a spin with time 0). □: nothing |
| `heroes.0.power2` | `"throw"` | ✕: the stomp (a spin with time 0). □: nothing |
| `heroes.0.color` | `"#2FBFA8"` | player color on screen (rings, badges) |
| `heroes.0.color2` | `"#B7D645"` | spots |
| `heroes.0.speed` | `330` | walking speed, pixels per second |
| `heroes.0.stompRadius` | `220` | enemies inside this circle get stunned |
| `heroes.0.pullRadius` | `300` | golden eggs inside this circle fly to Bubu |
| `heroes.0.stompCooldown` | `1.25` | seconds between stomps |
| `heroes.0.stunTime` | `2.8` | how long stomped enemies stay stunned |
| `heroes.0.spinTime` | `0.85` | how long the claws spin |
| `heroes.0.throw.look` | `"bone"` |  |
| `heroes.0.throw.speed` | `700` | a little slower than the balls (760, 1400): easier for the younger player to follow |
| `heroes.0.throw.speedMax` | `1250` | a little slower than the balls (760, 1400): easier for the younger player to follow |
| `heroes.0.throw.charge` | `0.9` |  |
| `heroes.0.throw.n` | `8` |  |
| `heroes.0.throw.nMax` | `12` |  |
| `heroes.0.throw.cooldown` | `1.2` |  |
| `heroes.0.throw.life` | `2.3` |  |
| `heroes.0.throw.lifeMax` | `3.8` |  |
| `heroes.1.name` | `"Killer"` |  |
| `heroes.1.power` | `"throw"` | ✕: the balls. □: the whirl gloves |
| `heroes.1.power2` | `"spin"` | ✕: the balls. □: the whirl gloves |
| `heroes.1.color` | `"#3B6FE0"` | shirt (blue) |
| `heroes.1.color2` | `"#E4583C"` | boots (red) |
| `heroes.1.speed` | `350` |  |
| `heroes.1.kickSpeed` | `760` | the same as Leo |
| `heroes.1.kickSpeedMax` | `1400` | the same as Leo |
| `heroes.1.chargeTime` | `0.9` | the same as Leo |
| `heroes.1.ballsPerKick` | `8` | the same as Leo |
| `heroes.1.ballsPerKickMax` | `12` | the same as Leo |
| `heroes.1.kickCooldown` | `1.2` | the same as Leo |
| `heroes.1.ballLife` | `2.3` | the same as Leo |
| `heroes.1.ballLifeMax` | `3.8` | the same as Leo |
| `heroes.1.spin.look` | `"gloves"` |  |
| `heroes.1.spin.radius` | `220` |  |
| `heroes.1.spin.pull` | `300` |  |
| `heroes.1.spin.time` | `0.85` |  |
| `heroes.1.spin.cooldown` | `1.6` | Boon: 1.25. A little longer: the older player is shielded a little less often |
| `heroes.1.spin.stun` | `2.8` |  |
| `levels` | `6` | levels of the second game that exist. Part Two (levels 7 - 12) raises it as each new level is made |
| `decorPerLevel` | `1700` |  |
| `levelDuration` | `360` |  |
| `eggsPerMinute` | `10` |  |
| `quota.on` | `true` |  |
| `quota.perLevel` | `[10,15,20,25,30,35,40,45,50,55,60,65]` |  |
| `quota.cap` | `1.5` |  |
| `quota.extra` | `2.2` |  |
| `quota.giveRange` | `420` |  |
| `quota.giveEvery` | `0.3` |  |
| `quota.flyTime` | `0.45` |  |
| `quota.autoGive` | `120` |  |
| `quota.autoEvery` | `2` |  |
| `wavesPerLevel` | `3` |  |
| `starsPerLevel` | `3` |  |
| `giantEggValue` | `20` |  |
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
| `defaultDifficulty` | `["easy","normal"]` |  |
| `guideArrow` | `[true,false]` |  |
| `nestSafe` | `true` |  |
| `nestSafeRadius` | `150` |  |
| `nestHideSoundGap` | `3` |  |
| `rescue.enabled` | `true` |  |
| `rescue.reachNear` | `180` |  |
| `rescue.reachFar` | `620` |  |
| `rescue.ballSpeed` | `900` |  |
| `rescue.safeAfter` | `2.6` |  |
| `rescue.bothDown` | `3` |  |
| `rescue.autoAfter` | `0` |  |
| `rescue.callEvery` | `5` |  |
| `rescue.limit` | `10` |  |
| `rescue.limitMercy` | `15` |  |
| `rescue.retryMercy` | `3` |  |
| `rescue.bothDownRestart` | `true` |  |
| `rescue.restart` | `"level"` |  |
| `rescue.retryScreen` | `2.2` |  |
| `smallEnemy.hits` | `2` |  |
| `smallEnemy.respawn` | `22` |  |
| `beetleSpeed` | `150` |  |
| `beetleWakeRadius` | `205` |  |
| `pineconeSpeed` | `165` |  |
| `mudSlow` | `0.45` |  |
| `windEvery` | `9` |  |
| `windDuration` | `2.6` |  |
| `windForce` | `185` |  |
| `butterflyEvery` | `[40,70]` |  |
| `butterflyBoost` | `1.5` |  |
| `butterflyTime` | `6` |  |
| `hintAfter` | `10` |  |
| `boss.hits` | `6` |  |
| `boss.shakes` | `[2,2,3,3,3,4]` |  |
| `boss.downTime` | `5` |  |
| `boss.throwEvery` | `[3,2.5,2.1,1.8,1.6,1.4]` |  |
| `boss.roarRadius` | `520` |  |
| `boss.roarPush` | `1500` |  |
| `duel.enabled` | `true` |  |
| `duel.hp` | `[3,3,4,4,4,5]` |  |
| `duel.tiredTime` | `2.4` |  |
| `duel.eggsPerHit` | `4` |  |
| `duel.eggsAtEnd` | `8` |  |
| `duel.finalHp` | `[5,5,6,6,7,8]` |  |
| `duel.finalSize` | `1.3` |  |
| `duel.finalSpeed` | `1.25` |  |
| `duel.finalPrep` | `0.75` |  |
| `duel.finalTired` | `0.75` |  |
| `duel.finalExtra` | `1` |  |
| `duel.angryAt` | `0.5` |  |
| `duel.mercy` | `0.06` |  |
| `duel.mercyMax` | `10` |  |
| `deadzone` | `0.25` |  |
| `vibration` | `true` |  |
| `keys.0.up` | `"KeyW"` |  |
| `keys.0.down` | `"KeyS"` |  |
| `keys.0.left` | `"KeyA"` |  |
| `keys.0.right` | `"KeyD"` |  |
| `keys.0.a` | `"Space"` |  |
| `keys.0.b` | `"KeyE"` |  |
| `keys.0.c` | `"KeyQ"` |  |
| `keys.0.r` | `"ShiftLeft"` |  |
| `keys.0.g` | `"KeyR"` |  |
| `keys.1.up` | `"ArrowUp"` |  |
| `keys.1.down` | `"ArrowDown"` |  |
| `keys.1.left` | `"ArrowLeft"` |  |
| `keys.1.right` | `"ArrowRight"` |  |
| `keys.1.a` | `"Enter"` |  |
| `keys.1.b` | `"ShiftRight"` |  |
| `keys.1.c` | `"Slash"` |  |
| `keys.1.r` | `"AltRight"` |  |
| `keys.1.g` | `"Period"` |  |
| `sprint.enabled` | `true` |  |
| `sprint.mult` | `3` |  |
| `sprint.maxSpeed` | `1100` |  |
| `sprint.mode` | `"click"` |  |
| `sprint.stopAfter` | `0.25` |  |
| `sprint.inDuel` | `true` |  |
| `sprint.max` | `0` |  |
| `sprint.rest` | `2` |  |
| `sprint.step` | `12` |  |
| `sprint.wordGap` | `6` |  |
| `volume.music` | `0.5` |  |
| `volume.ambient` | `0.7` |  |
| `volume.characters` | `0.8` |  |
| `footsteps` | `true` |  |
| `babble` | `true` |  |
| `voice` | `true` |  |
| `voiceRate` | `0.9` |  |
| `fontTitle` | `"Georgia, \"Times New Roman\", serif"` |  |
| `fontUI` | `"\"Avenir Next\", \"Trebuchet MS\", \"Helvetica Neue\", Arial, sans-serif"` |  |
| `maxRenderWidth` | `1920` |  |
| `saveKey` | `"bubu-leo-oua-de-aur-v1"` |  |
| `look.lights` | `true` |  |
| `look.front` | `true` |  |
| `look.motes` | `40` |  |
| `look.freeze` | `0.06` |  |
| `look.maxLights` | `24` |  |
| `look.lightGlow` | `0.6` |  |
| `look.halo` | `0.5` |  |
| `look.haloMax` | `12` |  |
| `look.waves` | `true` |  |
| `look.waveSpeedA` | `14` |  |
| `look.waveSpeedB` | `9` |  |
| `look.preview` | `false` |  |
| `look.frontFade` | `0.2` |  |
| `look.frontMin` | `0.15` |  |
| `look.frontPar` | `1.15` |  |
| `look.frontNear` | `220` |  |
| `look.tailLift` | `0.18` |  |
| `look.tailMax` | `0.5` |  |
| `look.tailSpring` | `70` |  |
| `look.armSwing` | `0.45` |  |
| `look.armSwingRun` | `0.8` |  |
| `look.breath` | `0.02` |  |
| `look.blinkMin` | `3` |  |
| `look.blinkMax` | `6` |  |
| `look.squashStart` | `-0.1` |  |
| `look.squashStop` | `0.12` |  |
| `look.squashLand` | `0.18` |  |
| `look.squashRun` | `-0.16` |  |
| `lupta.villainName` | `"George cel Rău"` |  |
| `lupta.heroes.0.name` | `"Boon"` |  |
| `lupta.heroes.0.power` | `"spin"` |  |
| `lupta.heroes.0.power2` | `"throw"` |  |
| `lupta.heroes.0.color` | `"#2FBFA8"` |  |
| `lupta.heroes.0.color2` | `"#B7D645"` |  |
| `lupta.heroes.0.speed` | `330` |  |
| `lupta.heroes.0.stompRadius` | `220` |  |
| `lupta.heroes.0.pullRadius` | `300` |  |
| `lupta.heroes.0.stompCooldown` | `1.25` |  |
| `lupta.heroes.0.stunTime` | `2.8` |  |
| `lupta.heroes.0.spinTime` | `0.85` |  |
| `lupta.heroes.0.throw.look` | `"bone"` |  |
| `lupta.heroes.0.throw.speed` | `700` |  |
| `lupta.heroes.0.throw.speedMax` | `1250` |  |
| `lupta.heroes.0.throw.charge` | `0.9` |  |
| `lupta.heroes.0.throw.n` | `8` |  |
| `lupta.heroes.0.throw.nMax` | `12` |  |
| `lupta.heroes.0.throw.cooldown` | `1.2` |  |
| `lupta.heroes.0.throw.life` | `2.3` |  |
| `lupta.heroes.0.throw.lifeMax` | `3.8` |  |
| `lupta.heroes.1.name` | `"Killer"` |  |
| `lupta.heroes.1.power` | `"throw"` |  |
| `lupta.heroes.1.power2` | `"spin"` |  |
| `lupta.heroes.1.color` | `"#3B6FE0"` |  |
| `lupta.heroes.1.color2` | `"#E4583C"` |  |
| `lupta.heroes.1.speed` | `350` |  |
| `lupta.heroes.1.kickSpeed` | `760` |  |
| `lupta.heroes.1.kickSpeedMax` | `1400` |  |
| `lupta.heroes.1.chargeTime` | `0.9` |  |
| `lupta.heroes.1.ballsPerKick` | `8` |  |
| `lupta.heroes.1.ballsPerKickMax` | `12` |  |
| `lupta.heroes.1.kickCooldown` | `1.2` |  |
| `lupta.heroes.1.ballLife` | `2.3` |  |
| `lupta.heroes.1.ballLifeMax` | `3.8` |  |
| `lupta.heroes.1.spin.look` | `"gloves"` |  |
| `lupta.heroes.1.spin.radius` | `220` |  |
| `lupta.heroes.1.spin.pull` | `300` |  |
| `lupta.heroes.1.spin.time` | `0.85` |  |
| `lupta.heroes.1.spin.cooldown` | `1.6` |  |
| `lupta.heroes.1.spin.stun` | `2.8` |  |
| `lupta.boss.hits` | `6` |  |
| `lupta.boss.shakes` | `[2,2,3,3,3,4]` |  |
| `lupta.boss.downTime` | `5` |  |
| `lupta.boss.throwEvery` | `[3,2.5,2.1,1.8,1.6,1.4]` |  |
| `lupta.boss.roarRadius` | `520` |  |
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
