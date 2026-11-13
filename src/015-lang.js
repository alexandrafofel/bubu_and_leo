
/* ==========================================================================
   SETTINGS chosen in the game's "Setări" menu (saved on this computer) and
   all the texts, in Romanian and in English.
   Arrays with two entries are per hero: [Bubu, Leo].
   ========================================================================== */
const Opt = {
  lang: CONFIG.language === 'en' ? 'en' : 'ro',
  fullscreen: true,
  vibration: !!CONFIG.vibration,
  swap: false,                                   // false: player 1 plays Bubu. true: player 1 plays Leo.
  ctrl: ['pad', 'pad'],                          // 'pad' = controller, 'kb' = keyboard
  keys: CONFIG.keys.map(k => Object.assign({}, k)),
  guide: CONFIG.guideArrow.slice(),
  sink: ['', '']                                 // name of the speaker that plays this hero's own sounds ('' = computer)
};
const playerOf = k => Opt.swap ? 1 - k : k;      // which player (0 or 1) plays hero k

const STR = {
  ro: {
    title: 'Bubu și Leo', subtitle: 'Ouăle de Aur',
    'boot.click': 'Fă clic sau apasă o tastă', 'boot.sub': 'pentru sunet și ecran complet',
    't.padPress': 'Controller: apasă ✕', 't.padOk': 'Controller detectat', 't.kb': 'Tastatură', 't.ready': 'Gata!',
    't.xReady': '✕ = Gata', 't.press': 'Apasă ✕', 't.then': 'apoi pornim!', 't.onPad': 'pe controller',
    't.final': 'Marele final', 't.level': 'Nivelul {0}', 't.cont': 'Continuă: {0}', 't.new': 'Joc nou',
    't.voice': 'Voce: {0}', 't.novoice': 'Fără voce în română',
    't.foot': 'F = ecran complet   ·   △ = schimbă personajele', 't.click': 'Fă clic o dată pentru sunet',
    't.player': 'Jucătorul {0}', 't.settings': 'Setări', 't.setKey': 'OPTIONS sau tasta P',
    't.kbPress': 'Tastatură: apasă {0}', 't.orKey': 'sau tasta {0}', 't.pressKey': 'Apasă {0}', 't.keyReady': '{0} = Gata',
    loading: 'Se pictează...',
    'end.bravo': 'Bravo!', 'end.team': 'Echipa:', egg1: 'ou', eggN: 'ouă', star1: 'stea', starN: 'stele',
    'med.stars': 'Toate stelele', 'med.nohit': 'Fără nicio lovitură', 'med.sun': 'Înainte de apus',
    'pause.title': 'Pauză', 'pause.cont': 'Continuă', 'pause.set': 'Setări', 'pause.quit': 'Ieșire la meniu',
    'pause.lost': 'Controllerul lui {0} s-a deconectat. Apasă ✕ pe el.',
    'ban.more': 'Mai departe!', 'ban.nest': 'La cuib!', 'ban.giant': 'Oul uriaș!', 'ban.duel': 'Provocare!',
    sorry1: 'Îmi pare rău! Voiam doar', sorry2: 'să vin și eu la festival.', sorryVoice: 'Îmi pare rău! Voiam doar să vin și eu la festival.',
    fest: 'Festivalul Apusului', 'fest.v1': 'Festivalul Apusului a început! {0} și-a cerut iertare și a rămas la petrecere.',
    'fest.v2': 'Din oul de aur a ieșit un pui de dinozaur! Bravo, {0} și {1}!', 'fest.bravo': 'Bravo, {0} și {1}!', 'fest.end': 'Sfârșit',
    'diff.easy': 'Ușor', 'diff.normal': 'Normal', 'diff.hard': 'Greu',
    'err.level': 'Nivelul nu a putut fi construit', 'err': 'Eroare: ',
    'lvl.meadow.name': 'Pajiștea Însorită',
    'lvl.meadow.intro': 'Ciori, cioara cea poznașă, a furat ouăle de aur și le-a împrăștiat prin Valea Caldă! Bubu și Leo, adunați-le pe toate înainte de apus. Bubu tropăie tare. Leo șutează mingea.',
    'lvl.forest.name': 'Pădurea Somnoroasă',
    'lvl.forest.intro': 'În pădure dorm gândaci morocănoși. Treceți încet pe lângă ei! Copacii care sclipesc ascund ouă. Scuturați-i cu un tropăit sau cu mingea.',
    'lvl.river.name': 'Malul Noroios',
    'lvl.river.intro': 'Pe malul râului este noroi lipicios. Prin noroi mergeți mai încet. Treceți râul pe pod sau pe pietre și feriți-vă de conurile care se rostogolesc!',
    'lvl.hill.name': 'Dealul Morilor',
    'lvl.hill.intro': 'Pe dealul cu mori de vânt bate vântul! Când vine o rafală, mergeți împotriva vântului și țineți-vă bine.',
    'lvl.fall.name': 'Cascada Secretă',
    'lvl.fall.intro': 'Ați ajuns la cascadă. Se spune că în spatele apei se ascunde o comoară. Căutați cu atenție!',
    'lvl.sunset.name': 'Drumul Apusului',
    'lvl.sunset.intro': 'Soarele apune și felinarele se aprind. Este ultimul drum până la copacul lui Ciori. Rămâneți împreună!',
    'lvl.boss.name': 'Cuibul lui Ciori',
    'lvl.boss.intro': 'Ciori stă în cuibul din cel mai înalt copac și aruncă conuri. Bubu, tropăie lângă copac ca să îl scuturi! Leo, când Ciori cade, șutează mingea în cuib! De {0} ori!',
    'duel.beetle': 'Regele Gândac', 'duel.owl': 'Bufnița Buhu', 'duel.crab': 'Racul Cleștișor', 'duel.whirl': 'Vârtejel', 'duel.frog': 'Broscoiul Oac', 'duel.chick': 'Ciorel',
    'duel.guard': '{0} păzește cuibul!', 'duel.mid': '{0} vă stă în cale!', 'duel.midSay': '{0} vă stă în cale! Feriți-vă și loviți când obosește.', 'duel.say': '{0} păzește cuibul! Feriți-vă și loviți când obosește. În cuib sunteți la adăpost.',
    'duel.hide': 'Adăpost', 'duel.now': 'Acum!', 'duel.wait': 'Încă nu!',
    'set.title': 'Setări', 'set.lang': 'Limbă', 'set.langName': 'Română', 'set.fs': 'Ecran complet', yes: 'Da', no: 'Nu',
    'set.music': 'Muzică', 'set.amb': 'Sunete ambientale', 'set.chr': 'Sunete personaje', 'set.vib': 'Vibrații în controller',
    'set.player': 'Jucătorul {0}  ({1})', 'set.back': 'Înapoi', 'set.hero': 'Personaj', 'set.ctrl': 'Joacă cu', 'set.pad': 'Controller', 'set.kb': 'Tastatură',
    'set.diff': 'Dificultate', 'set.guide': 'Săgeată ajutătoare', 'set.keys': 'Alege tastele', 'set.connect': 'Conectează controllerul',
    'set.spk': 'Sunetele lui {0} se aud în', 'set.spkMain': 'Calculator', 'set.spkFind': 'Caută difuzorul controllerului',
    'set.fsHint': 'Apasă tasta F pentru ecran complet.',
    'pad.noVib': 'Acest controller nu poate vibra în Chrome.', 'spk.ok': 'Sunetele lui {0} se aud acum în: {1}', 'spk.fail': 'Nu am putut porni acest difuzor.',
    'set.hint': 'sus / jos = alege      stânga / dreapta = schimbă      ✕ sau Enter = OK      ○ sau Backspace = înapoi',
    'key.title': 'Tastele lui {0}', 'key.up': 'Sus', 'key.down': 'Jos', 'key.left': 'Stânga', 'key.right': 'Dreapta', 'key.a': 'Putere (butonul ✕)',
    'key.press': 'Apasă tasta nouă', 'key.reset': 'Tastele de la început', 'key.space': 'Spațiu', 'key.taken': 'Tasta era folosită. Le-am schimbat între ele.',
    'key.no': 'Tasta aceasta este păstrată pentru meniu.',
    'pad.title': 'Controllerul lui {0}', 'pad.s1': 'Pornește controllerul',
    'pad.s1a': 'Cu cablu: leagă controllerul la Mac cu cablul USB.',
    'pad.s1b': 'Fără cablu: ține apăsate SHARE și PS până clipește lumina. Apoi, pe Mac, alege',
    'pad.s1c': '„Wireless Controller” în Setări sistem › Bluetooth.',
    'pad.s2': 'Apasă orice buton, ca să îl vadă Chrome', 'pad.seen': 'Controllere văzute: {0}',
    'pad.s3': 'Apasă ✕ pe controllerul lui {0}', 'pad.ok': 'Conectat!', 'pad.wait': 'Aștept...',
    'pad.test': 'Încearcă vibrația', 'pad.other': 'Alt controller', 'pad.try': 'Mișcă stickul și apasă butoanele.',
    'spk.none': 'Chrome nu a găsit alt difuzor. Difuzorul controllerului apare doar cu cablu USB.',
    'spk.denied': 'Ca să vadă difuzoarele, Chrome cere voie la microfon. Apasă „Permite” și încearcă din nou.',
    'spk.unsup': 'Acest browser nu poate trimite sunetul în controller.', 'spk.wait': 'Caut difuzoare...',
    'spk.pick': 'Schimbă cu stânga / dreapta până auzi sunetul în controller.'
  },
  en: {
    title: 'Bubu and Leo', subtitle: 'The Golden Eggs',
    'boot.click': 'Click or press a key', 'boot.sub': 'for sound and full screen',
    't.padPress': 'Controller: press ✕', 't.padOk': 'Controller found', 't.kb': 'Keyboard', 't.ready': 'Ready!',
    't.xReady': '✕ = Ready', 't.press': 'Press ✕', 't.then': 'then off we go!', 't.onPad': 'on the controller',
    't.final': 'Grand finale', 't.level': 'Level {0}', 't.cont': 'Continue: {0}', 't.new': 'New game',
    't.voice': 'Voice: {0}', 't.novoice': 'No English voice found',
    't.foot': 'F = full screen   ·   △ = swap characters', 't.click': 'Click once for sound',
    't.player': 'Player {0}', 't.settings': 'Settings', 't.setKey': 'OPTIONS or the P key',
    't.kbPress': 'Keyboard: press {0}', 't.orKey': 'or the {0} key', 't.pressKey': 'Press {0}', 't.keyReady': '{0} = Ready',
    loading: 'Painting...',
    'end.bravo': 'Well done!', 'end.team': 'Team:', egg1: 'egg', eggN: 'eggs', star1: 'star', starN: 'stars',
    'med.stars': 'All the stars', 'med.nohit': 'Never hit', 'med.sun': 'Before sunset',
    'pause.title': 'Pause', 'pause.cont': 'Continue', 'pause.set': 'Settings', 'pause.quit': 'Quit to menu',
    'pause.lost': "{0}'s controller disconnected. Press ✕ on it.",
    'ban.more': 'Onward!', 'ban.nest': 'To the nest!', 'ban.giant': 'The giant egg!', 'ban.duel': 'Challenge!',
    sorry1: 'I am sorry! I only wanted', sorry2: 'to come to the festival too.', sorryVoice: 'I am sorry! I only wanted to come to the festival too.',
    fest: 'The Sunset Festival', 'fest.v1': 'The Sunset Festival has begun! {0} said sorry and stayed for the party.',
    'fest.v2': 'A baby dinosaur hatched from the golden egg! Well done, {0} and {1}!', 'fest.bravo': 'Well done, {0} and {1}!', 'fest.end': 'The End',
    'diff.easy': 'Easy', 'diff.normal': 'Normal', 'diff.hard': 'Hard',
    'err.level': 'The level could not be built', 'err': 'Error: ',
    'lvl.meadow.name': 'The Sunny Meadow',
    'lvl.meadow.intro': 'Ciori, the cheeky crow, stole the golden eggs and scattered them all over the Warm Valley! Bubu and Leo, gather them all before sunset. Bubu stomps hard. Leo kicks the ball.',
    'lvl.forest.name': 'The Sleepy Forest',
    'lvl.forest.intro': 'Grumpy beetles sleep in the forest. Tiptoe past them! Sparkling trees hide eggs. Shake them with a stomp or with the ball.',
    'lvl.river.name': 'The Muddy Bank',
    'lvl.river.intro': 'The river bank is full of sticky mud. You walk slower in mud. Cross the river on the bridge or on the stones, and watch out for rolling pinecones!',
    'lvl.hill.name': 'Windmill Hill',
    'lvl.hill.intro': 'The wind blows on Windmill Hill! When a gust comes, walk against the wind and hold on tight.',
    'lvl.fall.name': 'The Secret Waterfall',
    'lvl.fall.intro': 'You have reached the waterfall. They say a treasure hides behind the water. Look carefully!',
    'lvl.sunset.name': 'Sunset Road',
    'lvl.sunset.intro': "The sun is setting and the lanterns light up. This is the last road to Ciori's tree. Stay together!",
    'lvl.boss.name': "Ciori's Nest",
    'lvl.boss.intro': 'Ciori sits in the nest in the tallest tree and throws pinecones. Bubu, stomp next to the tree to shake it! Leo, when Ciori falls, kick the ball into the nest! {0} times!',
    'duel.beetle': 'The Beetle King', 'duel.owl': 'Buhu the Owl', 'duel.crab': 'Snappy the Crab', 'duel.whirl': 'Little Twister', 'duel.frog': 'Croak the Frog', 'duel.chick': 'Ciorel',
    'duel.guard': '{0} guards the nest!', 'duel.mid': '{0} blocks the way!', 'duel.midSay': '{0} blocks the way! Dodge, then strike when it gets tired.', 'duel.say': '{0} guards the nest! Dodge, then strike when it gets tired. You are safe inside the nest.',
    'duel.hide': 'Shelter', 'duel.now': 'Now!', 'duel.wait': 'Not yet!',
    'set.title': 'Settings', 'set.lang': 'Language', 'set.langName': 'English', 'set.fs': 'Full screen', yes: 'Yes', no: 'No',
    'set.music': 'Music', 'set.amb': 'Ambient sounds', 'set.chr': 'Character sounds', 'set.vib': 'Controller vibration',
    'set.player': 'Player {0}  ({1})', 'set.back': 'Back', 'set.hero': 'Character', 'set.ctrl': 'Plays with', 'set.pad': 'Controller', 'set.kb': 'Keyboard',
    'set.diff': 'Difficulty', 'set.guide': 'Helper arrow', 'set.keys': 'Choose the keys', 'set.connect': 'Connect the controller',
    'set.spk': "{0}'s sounds play on", 'set.spkMain': 'Computer', 'set.spkFind': 'Find the controller speaker',
    'set.fsHint': 'Press the F key for full screen.',
    'pad.noVib': 'This controller cannot vibrate in Chrome.', 'spk.ok': "{0}'s sounds now play on: {1}", 'spk.fail': 'That speaker could not be started.',
    'set.hint': 'up / down = choose      left / right = change      ✕ or Enter = OK      ○ or Backspace = back',
    'key.title': "{0}'s keys", 'key.up': 'Up', 'key.down': 'Down', 'key.left': 'Left', 'key.right': 'Right', 'key.a': 'Power (the ✕ button)',
    'key.press': 'Press the new key', 'key.reset': 'Starting keys', 'key.space': 'Space', 'key.taken': 'That key was in use. The two were swapped.',
    'key.no': 'That key is kept for the menu.',
    'pad.title': "{0}'s controller", 'pad.s1': 'Turn the controller on',
    'pad.s1a': 'With a cable: plug the controller into the Mac with the USB cable.',
    'pad.s1b': 'Wireless: hold SHARE and PS until the light blinks. Then, on the Mac, choose',
    'pad.s1c': '"Wireless Controller" in System Settings › Bluetooth.',
    'pad.s2': 'Press any button so Chrome can see it', 'pad.seen': 'Controllers seen: {0}',
    'pad.s3': "Press ✕ on {0}'s controller", 'pad.ok': 'Connected!', 'pad.wait': 'Waiting...',
    'pad.test': 'Try the vibration', 'pad.other': 'Another controller', 'pad.try': 'Move the stick and press the buttons.',
    'spk.none': 'Chrome found no other speaker. The controller speaker only shows up over a USB cable.',
    'spk.denied': 'To list speakers, Chrome asks for microphone permission. Press "Allow" and try again.',
    'spk.unsup': 'This browser cannot send sound to the controller.', 'spk.wait': 'Looking for speakers...',
    'spk.pick': 'Change with left / right until you hear the sound in the controller.'
  }
};
/* T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments. */
function T(k, a, b) {
  let s = STR[Opt.lang] && STR[Opt.lang][k];
  if (s == null) s = STR.ro[k];
  if (s == null) return k;
  return a == null ? s : s.replace('{0}', a).replace('{1}', b == null ? '' : b);
}
const lvlName = def => T('lvl.' + def.key + '.name'), lvlIntro = def => T('lvl.' + def.key + '.intro', CONFIG.boss.hits);   // {0} = how many goals the boss needs
const eggWord = n => T(n === 1 ? 'egg1' : 'eggN'), starWord = n => T(n === 1 ? 'star1' : 'starN');
/* Readable name of a keyboard key, for the "choose the keys" screen. */
function keyName(code) {
  if (!code) return '?';
  if (code === 'Space') return T('key.space');
  const ar = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
  if (ar[code]) return ar[code];
  return code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ').replace(/Left$/, ' L').replace(/Right$/, ' R');
}
