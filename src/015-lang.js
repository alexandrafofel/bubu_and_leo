
/* ==========================================================================
   SETTINGS chosen in the game's "Setări" menu (saved on this computer) and
   all the texts, in Romanian and in English.
   Arrays with two entries are per hero: [Bubu, Leo].
   ========================================================================== */
let GAME = 'lupta';                              // the one game: 'lupta' (Cea mai grea luptă). The first game, 'bubu' (Bubu și Leo), was taken out of the menus on 18 Nov 2026; its code is still here, unused
const isLupta = () => GAME === 'lupta';
const GAME_IDS = ['bubu', 'lupta'], GAME_KEYS = ['villainName', 'heroes', 'boss'], GAME_BASE = {};
for (const k of GAME_KEYS) GAME_BASE[k] = CONFIG[k];
/* Puts the chosen game's own heroes, villain and boss values into CONFIG. */
function applyGameConfig() { for (const k of GAME_KEYS) CONFIG[k] = (GAME === 'lupta' ? CONFIG.lupta : GAME_BASE)[k]; }
applyGameConfig();
/* A text of one of the two games, whichever game is being played (for the screen where the game is chosen). */
function TG(id, k, ...a) { const tab = STR[Opt.lang] || STR.ro; let s = id === 'lupta' ? tab['L:' + k] : null; if (s == null) s = tab[k]; if (s == null) return k; a.forEach((v, i) => { s = s.split('{' + i + '}').join(v); }); return s; }
const Opt = {
  lang: CONFIG.language === 'en' ? 'en' : 'ro',
  fullscreen: true,
  vibration: !!CONFIG.vibration,
  words: !!CONFIG.words.bubble,                  // the balloon with the meaning of a word (T13)
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
    'george.half': 'George cel Rău s-a trezit!', 'george.final': 'George cel Rău: ultima luptă!', 'ban.gthrow': 'Ai grijă!', 'ban.glast': 'Ultima inimă! Vin după voi!', 'quota.extra': '+{0}', 'quota.far': 'Apropie-te de {0}!', 'quota.need': '{0} mai are nevoie de {1}!', 'quota.auto': '{0} îți trimite un ou.', 'quota.done': 'Ai găsit toate ouăle! Acum ajută-l și pe {0}: poți să-i dai cu {1}.', 'L:quota.done': 'Ai găsit toate cristalele! Acum ajută-l și pe {0}: poți să-i dai cu {1}.', 'quota.both': 'Amândoi ați găsit toate! La cuib!', 'L:quota.auto': '{0} îți trimite un cristal.', 'quota.one': 'un ou', 'quota.many': '{0} ouă', 'L:quota.one': 'un cristal', 'L:quota.many': '{0} cristale', 't.final': 'Marele final', 't.level': 'Nivelul {0}', 't.cont': 'Continuă: {0}', 't.new': 'Joc nou',
    't.start': 'Începe!', 't.chapters': 'Capitole', 't.dict': 'Dicționar', 'pause.dict': 'Dicționar', 'dict.title': 'Dicționar', 'dict.found': 'Cuvinte aflate: {0} din {1}', 'dict.page': 'Pagina {0} din {1}', 'dict.hint': '✕ ascultă   ·   ○ înapoi', 'set.words': 'Text la cuvinte', 't.newAsk': 'Începi de la capăt? Se șterge tot ce ați adunat în acest joc.', 't.newYes': 'Da, de la capăt', 't.newNo': 'Nu',
    'ch.title': 'Capitole', 'ch.part1': 'Partea întâi', 'ch.part2': 'Partea a doua: Stelele furate', 'ch.locked': 'Încă nu', 'ch.hint': '✕ joacă   ·   ○ înapoi',
    'pause.restart': 'Reia nivelul', 'pause.chapters': 'Capitole', 'pause.ask': 'Sigur? Ce ați adunat aici se pierde.', 'ask.yes': 'Da',
    't.voice': 'Voce: {0}', 't.novoice': 'Fără voce în română',
    't.foot': 'F = ecran complet   ·   △ = schimbă personajele', 't.click': 'Fă clic o dată pentru sunet',
    'sel.title': 'Alege jocul', 'sel.hint': 'stânga / dreapta = alege      ✕ sau Enter = pornește      OPTIONS sau P = setări',
    'sel.bubu': 'Bubu și Leo adună ouăle de aur furate de Ciori.', 'sel.lupta': 'Boon și Killer adună cristalele curcubeu și îl înfruntă pe George cel Rău.',
    'sel.byKids': 'Joc inventat de copii',
    't.player': 'Jucătorul {0}', 't.settings': 'Setări', 't.setKey': 'OPTIONS sau tasta P',
    't.kbPress': 'Tastatură: apasă {0}', 't.orKey': 'sau tasta {0}', 't.pressKey': 'Apasă {0}', 't.keyReady': '{0} = Gata',
    loading: 'Se pictează...',
    'retry.title': 'Încă o dată!', 'retry.sub': 'Ajutați-vă repede: aveți {0} secunde.', 'retry.mercy': 'Acum aveți {0} secunde.',
    'retry.help': 'Ajută-l pe {0}!', 'retry.helpKey': 'Ajută-l pe {0}! ({1})',
    'end.bravo': 'Bravo!', 'end.team': 'Echipa:', egg1: 'ou', eggN: 'ouă', star1: 'stea', starN: 'stele',
    'med.stars': 'Toate stelele', 'med.nohit': 'Fără nicio lovitură', 'med.sun': 'Înainte de apus',
    'pause.title': 'Pauză', 'pause.cont': 'Continuă', 'pause.set': 'Setări', 'pause.quit': 'Ieșire la meniu',
    'pause.lost': 'Controllerul lui {0} s-a deconectat. Apasă ✕ pe el.',
    'ban.cage': 'Bate palma!', 'ban.gateAuto': 'Poarta s-a deschis singură.', 'mech.yours': 'Al tău', 'ban.more': 'Mai departe!', 'ban.nest': 'La cuib!', 'ban.giant': 'Oul uriaș!', 'ban.duel': 'Provocare!',
    'ban.wait': 'Îl așteptăm pe {0} în cuib!', 'ban.rainbow': 'Curcubeu!  +{0}',
    sorry1: 'Îmi pare rău! Voiam doar', sorry2: 'să vin și eu la festival.', sorryVoice: 'Îmi pare rău! Voiam doar să vin și eu la festival.',
    fest: 'Festivalul Apusului', 'fest.v1': 'Festivalul Apusului a început! {0} și-a cerut iertare și a rămas la petrecere.',
    'fest.v2': 'Din oul de aur a ieșit un pui de dinozaur! Bravo, {0} și {1}!', 'fest.bravo': 'Bravo, {0} și {1}!', 'fest.end': 'Sfârșit',
    'diff.easy': 'Ușor', 'diff.normal': 'Normal', 'diff.hard': 'Greu',
    'err.level': 'Nivelul nu a putut fi construit', 'err': 'Eroare: ',
    'lvl.meadow.name': 'Pajiștea Însorită',
    'lvl.meadow.intro': 'Ciori, cioara cea poznașă, a furat ouăle de aur și le-a împrăștiat prin Valea Caldă! Bubu și Leo, adunați-le pe toate înainte de apus. Bubu tropăie tare. Leo șutează mingea. Dacă prietenul tău este lovit, mergi la el și apasă pe cerc! Apasă stick-ul stâng ca să fugi.',
    'lvl.forest.name': 'Pădurea Somnoroasă',
    'lvl.forest.intro': 'În pădure dorm gândaci morocănoși. Treceți încet pe lângă ei! Copacii care sclipesc ascund ouă. Scuturați-i cu un tropăit sau cu mingea. Un gândac lovit de două ori dispare.',
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
    'key.title': 'Tastele lui {0}', 'key.up': 'Sus', 'key.down': 'Jos', 'key.left': 'Stânga', 'key.right': 'Dreapta', 'key.a': 'Prima putere (butonul ✕)', 'key.b': 'Ajută prietenul (butonul ○)', 'key.c': 'A doua putere (butonul □)', 'key.r': 'Fugă (apasă stick-ul, L3)', 'key.g': 'Dă un ou prietenului (butonul L1)',
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
    'spk.pick': 'Schimbă cu stânga / dreapta până auzi sunetul în controller.',
    'spk.test': 'Încearcă sunetul', 'spk.lost': 'Difuzorul ales pentru {0} nu a fost găsit. Sunetele lui se aud în calculator.',
    // ---- the second game, "Cea mai grea luptă". A key that starts with L: takes the place of the same key without it.
    'L:title': 'Cea mai grea luptă', 'L:subtitle': 'Cristalele Curcubeu',
    'L:egg1': 'cristal', 'L:eggN': 'cristale', 'L:med.sun': 'Înainte de răsărit', 'L:ban.giant': 'Steaua secretă!',
    'L:sorry1': 'George cel Rău a fugit!', 'L:sorry2': 'Cristalele sunt ale voastre.', 'L:sorryVoice': 'George cel Rău a fugit! Cristalele sunt ale voastre.',
    'L:fest': 'Petrecerea Curcubeu', 'L:fest.v1': 'Petrecerea Curcubeu a început! Cristalele sunt cel mai frumos cadou.',
    'L:fest.v2': 'Medalii pentru eroi! Steluțele îi îmbrățișează pe {0} și pe {1}. Bravo!',
    'duel.george': 'George cel Rău',
    'lvl.glade.name': 'Poiana Licuricilor',
    'lvl.glade.intro': 'Salut! Eu sunt Boon. George cel Rău a ascuns cristalele curcubeu prin junglă! Și eu sunt Killer! Cristalele le au monștrii lui George. Hai să-i prindem! Cu ✕ îmi rotesc ghearele. Killer aruncă mingi. Dacă unul cade, celălalt vine repede și apasă ○! Apasă stick-ul ca să fugi. Rrrr, hai!',
    'lvl.glade.talk': 'B: Salut! Eu sunt Boon. George cel Rău a ascuns cristalele curcubeu prin junglă!\nK: Și eu sunt Killer! Cristalele le au monștrii lui George. Hai să-i prindem!\nB: Cu ✕ îmi rotesc ghearele. Killer aruncă mingi.\nK: Dacă unul cade, celălalt vine repede și apasă ○!\nB: Apasă stick-ul ca să fugi. Rrrr, hai!',
    'lvl.robots.name': 'Jungla Monștrilor',
    'lvl.robots.intro': 'Șșt! Aici dorm monștrii lui George. Trecem încet pe lângă ei. Dacă se trezesc, îi lovim de două ori. Florile mari care sclipesc ascund cristale. Lovește-le! Fiecare trebuie să găsească cincisprezece cristale.',
    'lvl.robots.talk': 'K: Șșt! Aici dorm monștrii lui George.\nB: Trecem încet pe lângă ei. Dacă se trezesc, îi lovim de două ori.\nK: Florile mari care sclipesc ascund cristale. Lovește-le!\nB: Fiecare trebuie să găsească cincisprezece cristale.',
    'lvl.snails.name': 'Râul Lipicios',
    'lvl.snails.intro': 'Uite râul! Pe mal sunt urme lipicioase. Prin ele mergem încet. Trecem apa pe pod sau sărim pe pietre. Ai prea multe cristale? Dă-mi unul cu L1! Și atenție: când avem jumătate din cristale, vine George!',
    'lvl.snails.talk': 'B: Uite râul! Pe mal sunt urme lipicioase. Prin ele mergem încet.\nK: Trecem apa pe pod sau sărim pe pietre.\nB: Ai prea multe cristale? Dă-mi unul cu L1!\nK: Și atenție: când avem jumătate din cristale, vine George!',
    'lvl.ridge.name': 'Culmea Vântului',
    'lvl.ridge.intro': 'Ce vânt bate pe culme! Păsările mari ne pot ridica în aer. Fugi de umbra lor! Sau le speriem cu ghearele și cu mingea. Atenție la nisipul mișcător. Stăm aproape unul de altul!',
    'lvl.ridge.talk': 'K: Ce vânt bate pe culme!\nB: Păsările mari ne pot ridica în aer. Fugi de umbra lor!\nK: Sau le speriem cu ghearele și cu mingea.\nB: Atenție la nisipul mișcător. Stăm aproape unul de altul!',
    'lvl.vines.name': 'Stânca Lianelor',
    'lvl.vines.intro': 'Lianele atârnă pe stâncă. Se zice că în spatele lor e o ușă secretă. Și acolo e o stea pe care puțini au găsit-o! Căutăm cu atenție peste tot. La sfârșit intrăm amândoi în cuib!',
    'lvl.vines.talk': 'B: Lianele atârnă pe stâncă. Se zice că în spatele lor e o ușă secretă.\nK: Și acolo e o stea pe care puțini au găsit-o!\nB: Căutăm cu atenție peste tot.\nK: La sfârșit intrăm amândoi în cuib!',
    'lvl.canyon.name': 'Canionul Podurilor de Lumină',
    'lvl.canyon.intro': 'George s-a întors și a furat steluțele! Avem puteri noi! Apasă □: eu îmi învârt mănușile. Și eu arunc oase-bumerang! Podul de lumină apare dacă stăm amândoi pe plăcile care sclipesc. Dacă unul cade, celălalt are zece secunde să-l ajute cu ○!',
    'lvl.canyon.talk': 'B: George s-a întors și a furat steluțele!\nK: Avem puteri noi! Apasă □: eu îmi învârt mănușile.\nB: Și eu arunc oase-bumerang!\nK: Podul de lumină apare dacă stăm amândoi pe plăcile care sclipesc.\nB: Dacă unul cade, celălalt are zece secunde să-l ajute cu ○!',
    'lvl.lake.name': 'Lacul Nuferilor Uriași',
    'lvl.lake.intro': 'Lacul e prea adânc ca să trecem înot. Unul urcă pe plută. Celălalt învârte manivela de pe mal. Manivela o învârt cu ✕. Killer o învârte cu □. Apoi facem schimb! Pe a doua apă curentul trage pluta înapoi: învârte repede!',
    'lvl.lake.talk': 'B: Lacul e prea adânc ca să trecem înot.\nK: Unul urcă pe plută. Celălalt învârte manivela de pe mal.\nB: Manivela o învârt cu ✕. Killer o învârte cu □.\nK: Apoi facem schimb! Pe a doua apă curentul trage pluta înapoi: învârte repede!',
    'lvl.works.name': 'Atelierul lui George',
    'lvl.works.intro': 'Aici își face George monștrii! Zidurile se deschid doar dacă lovim țintele. Țintele albastre sunt ale mele. Cele turcoaz sunt ale lui Boon. La al doilea zid le lovim pe rând. Și ferește-te de benzile care te duc! Butonul roșu îi face pe monștri să danseze!',
    'lvl.works.talk': 'K: Aici își face George monștrii!\nB: Zidurile se deschid doar dacă lovim țintele.\nK: Țintele albastre sunt ale mele. Cele turcoaz sunt ale lui Boon.\nB: La al doilea zid le lovim pe rând. Și ferește-te de benzile care te duc!\nK: Butonul roșu îi face pe monștri să danseze!',
    'lvl.road.name': 'Drumul Torțelor',
    'lvl.road.intro': 'Torțele se aprind când trecem pe lângă ele. E ultimul drum până la arena lui George. Gropi, monștri și vânt... Nu ne despărțim! Împreună suntem cei mai tari. Rrrr!',
    'lvl.road.talk': 'K: Torțele se aprind când trecem pe lângă ele.\nB: E ultimul drum până la arena lui George.\nK: Gropi, monștri și vânt... Nu ne despărțim!\nB: Împreună suntem cei mai tari. Rrrr!',
    'lvl.arena.name': 'Arena lui George',
    'lvl.arena.intro': 'Asta e arena lui George! Stă pe tronul lui de piatră. Eu zgârii tronul cu ghearele, ca să cadă George! Și când George cade, eu îl lovesc cu mingea! De {0} ori! Împreună putem!',
    'lvl.arena.talk': 'K: Asta e arena lui George! Stă pe tronul lui de piatră.\nB: Eu zgârii tronul cu ghearele, ca să cadă George!\nK: Și când George cade, eu îl lovesc cu mingea!\nB: De {0} ori! Împreună putem!'
  },
  en: {
    title: 'Bubu and Leo', subtitle: 'The Golden Eggs',
    'boot.click': 'Click or press a key', 'boot.sub': 'for sound and full screen',
    't.padPress': 'Controller: press ✕', 't.padOk': 'Controller found', 't.kb': 'Keyboard', 't.ready': 'Ready!',
    't.xReady': '✕ = Ready', 't.press': 'Press ✕', 't.then': 'then off we go!', 't.onPad': 'on the controller',
    'george.half': 'George the Bad woke up!', 'george.final': 'George the Bad: the last fight!', 'ban.gthrow': 'Look out!', 'ban.glast': 'His last heart! They come for you!', 'quota.extra': '+{0}', 'quota.far': 'Come closer to {0}!', 'quota.need': '{0} still needs {1}!', 'quota.auto': '{0} sends you one.', 'quota.done': 'You found them all! Now help {0}: you can give them with {1}.', 'L:quota.done': 'You found all the crystals! Now help {0}: you can give them with {1}.', 'quota.both': 'You both found them all! To the nest!', 'quota.one': 'one egg', 'quota.many': '{0} eggs', 'L:quota.one': 'one crystal', 'L:quota.many': '{0} crystals', 't.final': 'Grand finale', 't.level': 'Level {0}', 't.cont': 'Continue: {0}', 't.new': 'New game',
    't.start': 'Start!', 't.chapters': 'Chapters', 't.dict': 'Dictionary', 'pause.dict': 'Dictionary', 'dict.title': 'Dictionary', 'dict.found': 'Words found: {0} of {1}', 'dict.page': 'Page {0} of {1}', 'dict.hint': '✕ listen   ·   ○ back', 'set.words': 'Text on words', 't.newAsk': 'Start over? Everything you gathered in this game is erased.', 't.newYes': 'Yes, start over', 't.newNo': 'No',
    'ch.title': 'Chapters', 'ch.part1': 'Part One', 'ch.part2': 'Part Two: The Stolen Stars', 'ch.locked': 'Not yet', 'ch.hint': '✕ play   ·   ○ back',
    'pause.restart': 'Restart level', 'pause.chapters': 'Chapters', 'pause.ask': 'Sure? What you gathered here is lost.', 'ask.yes': 'Yes',
    't.voice': 'Voice: {0}', 't.novoice': 'No English voice found',
    't.foot': 'F = full screen   ·   △ = swap characters', 't.click': 'Click once for sound',
    'sel.title': 'Choose the game', 'sel.hint': 'left / right = choose      ✕ or Enter = start      OPTIONS or P = settings',
    'sel.bubu': 'Bubu and Leo gather the golden eggs that Ciori stole.', 'sel.lupta': 'Boon and Killer gather the rainbow crystals and face George the Bad.',
    'sel.byKids': 'A game invented by the kids',
    't.player': 'Player {0}', 't.settings': 'Settings', 't.setKey': 'OPTIONS or the P key',
    't.kbPress': 'Keyboard: press {0}', 't.orKey': 'or the {0} key', 't.pressKey': 'Press {0}', 't.keyReady': '{0} = Ready',
    loading: 'Painting...',
    'retry.title': 'Once more!', 'retry.sub': 'Help each other quickly: you have {0} seconds.', 'retry.mercy': 'Now you have {0} seconds.',
    'retry.help': 'Help {0}!', 'retry.helpKey': 'Help {0}! ({1})',
    'end.bravo': 'Well done!', 'end.team': 'Team:', egg1: 'egg', eggN: 'eggs', star1: 'star', starN: 'stars',
    'med.stars': 'All the stars', 'med.nohit': 'Never hit', 'med.sun': 'Before sunset',
    'pause.title': 'Pause', 'pause.cont': 'Continue', 'pause.set': 'Settings', 'pause.quit': 'Quit to menu',
    'pause.lost': "{0}'s controller disconnected. Press ✕ on it.",
    'ban.cage': 'High five!', 'ban.gateAuto': 'The gate opened by itself.', 'mech.yours': 'Yours', 'ban.more': 'Onward!', 'ban.nest': 'To the nest!', 'ban.giant': 'The giant egg!', 'ban.duel': 'Challenge!',
    'ban.wait': 'Waiting for {0} in the nest!', 'ban.rainbow': 'Rainbow!  +{0}',
    sorry1: 'I am sorry! I only wanted', sorry2: 'to come to the festival too.', sorryVoice: 'I am sorry! I only wanted to come to the festival too.',
    fest: 'The Sunset Festival', 'fest.v1': 'The Sunset Festival has begun! {0} said sorry and stayed for the party.',
    'fest.v2': 'A baby dinosaur hatched from the golden egg! Well done, {0} and {1}!', 'fest.bravo': 'Well done, {0} and {1}!', 'fest.end': 'The End',
    'diff.easy': 'Easy', 'diff.normal': 'Normal', 'diff.hard': 'Hard',
    'err.level': 'The level could not be built', 'err': 'Error: ',
    'lvl.meadow.name': 'The Sunny Meadow',
    'lvl.meadow.intro': 'Ciori, the cheeky crow, stole the golden eggs and scattered them all over the Warm Valley! Bubu and Leo, gather them all before sunset. Bubu stomps hard. Leo kicks the ball. If your friend gets hit, go to them and press the circle! Press the left stick to run.',
    'lvl.forest.name': 'The Sleepy Forest',
    'lvl.forest.intro': 'Grumpy beetles sleep in the forest. Tiptoe past them! Sparkling trees hide eggs. Shake them with a stomp or with the ball. A beetle that is hit twice disappears.',
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
    'key.title': "{0}'s keys", 'key.up': 'Up', 'key.down': 'Down', 'key.left': 'Left', 'key.right': 'Right', 'key.a': 'First power (the ✕ button)', 'key.b': 'Help your friend (the ○ button)', 'key.c': 'Second power (the □ button)', 'key.r': 'Run (press the stick, L3)', 'key.g': 'Give an egg to your friend (the L1 button)',
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
    'spk.pick': 'Change with left / right until you hear the sound in the controller.',
    'spk.test': 'Try the sound', 'spk.lost': 'The speaker chosen for {0} was not found. Their sounds play on the computer.',
    'L:title': 'The Hardest Fight', 'L:subtitle': 'The Rainbow Crystals',
    'L:egg1': 'crystal', 'L:eggN': 'crystals', 'L:med.sun': 'Before sunrise', 'L:ban.giant': 'The secret star!',
    'L:sorry1': 'George the Bad ran away!', 'L:sorry2': 'The crystals are yours.', 'L:sorryVoice': 'George the Bad ran away! The crystals are yours.',
    'L:fest': 'The Rainbow Party', 'L:fest.v1': 'The Rainbow Party has begun! The crystals are the best present of all.',
    'L:fest.v2': 'Medals for the heroes! The little stars hug {0} and {1}. Well done!',
    'duel.george': 'George the Bad',
    'lvl.glade.name': 'Firefly Glade',
    'lvl.glade.intro': 'Hi! I\'m Boon. George the Bad hid the rainbow crystals all over the jungle! And I\'m Killer! George\'s monsters have the crystals. Let\'s catch them! With ✕ I spin my claws. Killer throws balls. If one of us falls, the other runs over and presses ○! Press the stick to run. Rrrr, come on!',
    'lvl.glade.talk': 'B: Hi! I\'m Boon. George the Bad hid the rainbow crystals all over the jungle!\nK: And I\'m Killer! George\'s monsters have the crystals. Let\'s catch them!\nB: With ✕ I spin my claws. Killer throws balls.\nK: If one of us falls, the other runs over and presses ○!\nB: Press the stick to run. Rrrr, come on!',
    'lvl.robots.name': 'The Monster Jungle',
    'lvl.robots.intro': 'Shh! George\'s monsters sleep here. We tiptoe past them. If they wake up, we hit them twice. The big sparkly flowers hide crystals. Hit them! Each of us has to find fifteen crystals.',
    'lvl.robots.talk': 'K: Shh! George\'s monsters sleep here.\nB: We tiptoe past them. If they wake up, we hit them twice.\nK: The big sparkly flowers hide crystals. Hit them!\nB: Each of us has to find fifteen crystals.',
    'lvl.snails.name': 'Sticky River',
    'lvl.snails.intro': 'Look, the river! There are sticky trails on the bank. We walk slowly in them. We cross the water on the bridge or jump on the stones. Too many crystals? Give me one with L1! And watch out: when we have half of the crystals, George comes!',
    'lvl.snails.talk': 'B: Look, the river! There are sticky trails on the bank. We walk slowly in them.\nK: We cross the water on the bridge or jump on the stones.\nB: Too many crystals? Give me one with L1!\nK: And watch out: when we have half of the crystals, George comes!',
    'lvl.ridge.name': 'Windy Ridge',
    'lvl.ridge.intro': 'So windy on the ridge! The big birds can lift us up in the air. Run away from their shadow! Or we scare them with the claws and the ball. Watch out for the quicksand. We stay close together!',
    'lvl.ridge.talk': 'K: So windy on the ridge!\nB: The big birds can lift us up in the air. Run away from their shadow!\nK: Or we scare them with the claws and the ball.\nB: Watch out for the quicksand. We stay close together!',
    'lvl.vines.name': 'Vine Cliff',
    'lvl.vines.intro': 'Vines hang down the cliff. They say there is a secret door behind them. And there is a star that only a few have ever found! We look carefully everywhere. At the end we both go into the nest!',
    'lvl.vines.talk': 'B: Vines hang down the cliff. They say there is a secret door behind them.\nK: And there is a star that only a few have ever found!\nB: We look carefully everywhere.\nK: At the end we both go into the nest!',
    'lvl.canyon.name': 'The Canyon of Light Bridges',
    'lvl.canyon.intro': 'George came back and stole the little stars! We have new powers! Press □: I spin my gloves. And I throw boomerang bones! The light bridge appears when we both stand on the shiny plates. If one of us falls, the other has ten seconds to help with ○!',
    'lvl.canyon.talk': 'B: George came back and stole the little stars!\nK: We have new powers! Press □: I spin my gloves.\nB: And I throw boomerang bones!\nK: The light bridge appears when we both stand on the shiny plates.\nB: If one of us falls, the other has ten seconds to help with ○!',
    'lvl.lake.name': 'The Lake of Giant Lilies',
    'lvl.lake.intro': 'The lake is too deep to swim across. One of us climbs on the raft. The other turns the crank on the bank. I turn the crank with ✕. Killer turns it with □. Then we swap! On the second water the current pulls the raft back: turn fast!',
    'lvl.lake.talk': 'B: The lake is too deep to swim across.\nK: One of us climbs on the raft. The other turns the crank on the bank.\nB: I turn the crank with ✕. Killer turns it with □.\nK: Then we swap! On the second water the current pulls the raft back: turn fast!',
    'lvl.works.name': "George's Workshop",
    'lvl.works.intro': 'This is where George makes his monsters! The walls only open if we hit the targets. The blue targets are mine. The turquoise ones are Boon\'s. At the second wall we hit them in order. And watch out for the moving belts! The red button makes the monsters dance!',
    'lvl.works.talk': 'K: This is where George makes his monsters!\nB: The walls only open if we hit the targets.\nK: The blue targets are mine. The turquoise ones are Boon\'s.\nB: At the second wall we hit them in order. And watch out for the moving belts!\nK: The red button makes the monsters dance!',
    'lvl.road.name': 'Torch Road',
    'lvl.road.intro': 'The torches light up when we walk past them. It\'s the last road to George\'s arena. Pits, monsters and wind... We don\'t split up! Together we\'re the strongest. Rrrr!',
    'lvl.road.talk': 'K: The torches light up when we walk past them.\nB: It\'s the last road to George\'s arena.\nK: Pits, monsters and wind... We don\'t split up!\nB: Together we\'re the strongest. Rrrr!',
    'lvl.arena.name': "George's Arena",
    'lvl.arena.intro': 'This is George\'s arena! He sits on his stone throne. I scratch the throne with my claws, so George falls down! And when George falls, I hit him with the ball! {0} times! Together we can do it!',
    'lvl.arena.talk': 'K: This is George\'s arena! He sits on his stone throne.\nB: I scratch the throne with my claws, so George falls down!\nK: And when George falls, I hit him with the ball!\nB: {0} times! Together we can do it!'
  }
};
/* T('key') gives the text in the chosen language. {0} and {1} are filled in from the extra arguments.
   In the second game a text with the key 'L:key' takes the place of 'key' (its own title, its own words for crystals...). */
function T(k, a, b) {
  const tab = STR[Opt.lang] || STR.ro;
  let s = GAME === 'lupta' ? tab['L:' + k] : null;
  if (s == null) s = tab[k];
  if (s == null) s = STR.ro[k];
  if (s == null) return k;
  return a == null ? s : s.replace('{0}', a).replace('{1}', b == null ? '' : b);
}
const lvlName = def => T('lvl.' + def.key + '.name'), lvlIntro = def => T('lvl.' + def.key + '.intro', CONFIG.boss.hits);
/* The start card as a talk between the heroes (tools/voci/intro.py): [{ w: 0 Boon / 1 Killer, text }], or null for a chapter without one. */
const lvlTalk = def => { const k = 'lvl.' + def.key + '.talk', s = T(k, CONFIG.boss.hits); return s && s !== k ? s.split('\n').map(l => ({ w: l[0] === 'K' ? 1 : 0, text: l.slice(3) })) : null; };   // {0} = how many goals the boss needs
const eggWord = n => T(n === 1 ? 'egg1' : 'eggN'), starWord = n => T(n === 1 ? 'star1' : 'starN');
/* Readable name of a keyboard key, for the "choose the keys" screen. */
function keyName(code) {
  if (!code) return '?';
  if (code === 'Space') return T('key.space');
  const ar = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
  if (ar[code]) return ar[code];
  return code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ').replace(/Left$/, ' L').replace(/Right$/, ' R');
}
