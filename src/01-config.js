'use strict';
/* ==========================================================================
   BUBU ȘI LEO: OUĂLE DE AUR
   Everything the kids might ask you to change lives in CONFIG.
   Edit a value, save the file, reload the page in Chrome.
   ========================================================================== */
const CONFIG = {
  // ---- Names (all other texts, Romanian and English, are in the STR table below CONFIG)
  villainName: 'Ciori',
  language: 'ro',              // starting language: 'ro' or 'en'. Changeable in Setări.

  // ---- Heroes (index 0 = Player 1, index 1 = Player 2) ---------------------
  heroes: [
    {
      name: 'Bubu',
      color: '#F08A3C',        // player color on screen (rings, badges)
      color2: '#6FA35E',       // spots
      scarf: '#D9463C',
      speed: 330,              // walking speed, pixels per second
      stompRadius: 280,        // enemies inside this circle get stunned
      pullRadius: 360,         // golden eggs inside this circle fly to Bubu
      stompCooldown: 0.7,      // seconds between stomps
      stunTime: 2.8            // how long stomped enemies stay stunned
    },
    {
      name: 'Leo',
      color: '#F6C63C',        // shirt (yellow)
      color2: '#3F78C8',       // shorts (blue)
      headband: '#D9463C',
      speed: 350,
      kickSpeed: 760,          // quick tap on the button
      kickSpeedMax: 1400,      // fully charged kick (hold the button)
      chargeTime: 0.9,         // seconds to hold for a full kick
      ballsPerKick: 8,         // balls per tap, spread evenly around a circle (all directions)
      ballsPerKickMax: 12,     // balls per fully charged kick
      kickCooldown: 1.2,       // seconds before a new kick while the balls are still flying (pressing again then calls them back)
      ballLife: 2.3,           // seconds the balls fly after a tap
      ballLifeMax: 3.8         // seconds after a full kick
    }
  ],

  // ---- Game length ---------------------------------------------------------
  levels: 6,                   // levels before the boss (1 to 6)
  decorPerLevel: 1700,         // small meadow things per level (grass, daisies, pebbles...). 6 x 1700 = 10,200 with the rest
  levelDuration: 360,          // target seconds per level. Egg count scales with it.
  eggsPerMinute: 10,           // eggs per level = levelDuration / 60 * eggsPerMinute
  wavesPerLevel: 3,            // eggs appear in this many groups, left to right
  starsPerLevel: 3,
  giantEggValue: 20,           // the secret egg in the cave (level 5)

  // ---- Difficulty, chosen per player on the start screen -------------------
  difficulty: {
    easy:   { enemySpeed: 0.55, pickupRadius: 105, dizzyTime: 1.0, wakeRadius: 0.75, wind: 0.5, ballSize: 1.3, ballSpeed: 0.85 },
    normal: { enemySpeed: 1.0,  pickupRadius: 64,  dizzyTime: 2.0, wakeRadius: 1.0,  wind: 1.0, ballSize: 1.0, ballSpeed: 1.0  },
    hard:   { enemySpeed: 1.3,  pickupRadius: 54,  dizzyTime: 2.4, wakeRadius: 1.25, wind: 1.25, ballSize: 1.0, ballSpeed: 1.0  }
  },
  defaultDifficulty: ['easy', 'normal'],   // Bubu, Leo
  guideArrow: [true, false],   // the soft arrow that shows each player where to go (Bubu, Leo)

  // ---- Nest: a hero in it is hidden on every level, the wind does not move it, nothing can hit it
  nestSafe: true,
  nestSafeRadius: 150,         // how close to the nest (centre) a hero must stand to hide
  nestHideSoundGap: 3,         // seconds between two "ih-ih" sounds when heroes keep stepping in and out

  // ---- Obstacles -----------------------------------------------------------
  beetleSpeed: 150,
  beetleWakeRadius: 205,
  pineconeSpeed: 165,
  mudSlow: 0.45,               // speed multiplier in mud
  windEvery: 9,                // seconds between gusts on the windy hill
  windDuration: 2.6,
  windForce: 185,

  // ---- Helpers -------------------------------------------------------------
  butterflyEvery: [40, 70],    // a butterfly appears every 40 to 70 seconds
  butterflyBoost: 1.5,         // speed multiplier
  butterflyTime: 6,            // seconds of boost
  hintAfter: 10,               // seconds without an egg before a golden arrow appears

  // ---- Boss ----------------------------------------------------------------
  boss: {
    hits: 5,                   // balls in the nest needed to win (3 before the update, now a harder fight)
    shakes: [2, 2, 3, 3, 3],   // stomps needed to shake Ciori down, per round
    downTime: 5,               // seconds Ciori stays down
    throwEvery: [3, 2.5, 2.1, 1.8, 1.6]   // seconds between pinecones, per round
  },

  // ---- Two mini-fights per level: one in the middle of the path, one at the nest ----
  duel: {
    enabled: true,             // false = no mini-fights, the nest opens right after the last eggs
    hp: [3, 3, 4, 4, 4, 5],    // hits needed in the middle fight, per level (one less on Ușor, one more on Greu)
    tiredTime: 2.4,            // seconds the guardian stays tired (the moment to hit it)
    eggsPerHit: 4,             // golden eggs that fly out at every hit
    eggsAtEnd: 8,
    // the nest fight: the same guardian, bigger, harder
    finalHp: [5, 5, 6, 6, 7, 8],   // hits needed at the nest, per level
    finalSize: 1.3,            // guardian drawn and hit this many times bigger
    finalSpeed: 1.25,          // multiplier on how fast it moves and attacks
    finalPrep: 0.75,           // multiplier on the warning time before an attack (shorter warning)
    finalTired: 0.75,          // multiplier on how long it stays tired (shorter window to hit)
    finalExtra: 1,             // one more attack in every round
    angryAt: 0.5               // below this share of hits left it gets angry: one more attack, and it shakes
  },

  // ---- Controls (keys and controller/keyboard are chosen in Setări) -----------
  deadzone: 0.25,              // stick deadzone (0.25 or more)
  vibration: true,
  keys: [                      // starting keys: player 1, player 2 (KeyboardEvent.code names)
    { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', a: 'Space' },
    { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'Enter' }
  ],

  // ---- Sound ---------------------------------------------------------------
  volume: { music: 0.5, ambient: 0.7, characters: 0.8 },   // starting values, 0 to 1. Changeable in Setări.
  footsteps: true,
  babble: true,                // the heroes talk in their own invented words (30 each). false = only the sound effects
  voice: true,                 // read level intros aloud (needs a system voice for the chosen language)
  voiceRate: 0.9,

  // ---- Look ----------------------------------------------------------------
  fontTitle: 'Georgia, "Times New Roman", serif',
  fontUI: '"Avenir Next", "Trebuchet MS", "Helvetica Neue", Arial, sans-serif',
  maxRenderWidth: 1920,        // lower to 1600 or 1280 if the Mac struggles
  saveKey: 'bubu-leo-oua-de-aur-v1'
};
