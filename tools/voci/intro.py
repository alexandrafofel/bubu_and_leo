# The start card of each chapter: Boon (b) and Killer (k) explain to the children what to do.
# (who, Romanian shown, Romanian spoken, English shown, English spoken)
# Shown = the text on the card (STR 'lvl.<key>.talk' in src/015-lang.js must hold the same lines, tests/intro-voci.js checks it).
# Spoken = what the voice says (button symbols said as words). The arena line with {0} is spoken with the number 6 (CONFIG.lupta boss hits).
# The order of the chapters and of the lines is the order of the clips: do not reorder, only change a line and record it again.
INTRO = [
 ('glade', [
  ('b', 'Salut! Eu sunt Boon. George cel Rău a ascuns cristalele curcubeu prin junglă!', None,
        "Hi! I'm Boon. George the Bad hid the rainbow crystals all over the jungle!", None),
  ('k', 'Și eu sunt Killer! Cristalele le au monștrii lui George. Hai să-i prindem!', None,
        "And I'm Killer! George's monsters have the crystals. Let's catch them!", None),
  ('b', 'Cu ✕ îmi rotesc ghearele. Killer aruncă mingi.', 'Cu butonul X îmi rotesc ghearele. Killer aruncă mingi.',
        'With ✕ I spin my claws. Killer throws balls.', 'With the X button I spin my claws. Killer throws balls.'),
  ('k', 'Dacă unul cade, celălalt vine repede și apasă ○!', 'Dacă unul cade, celălalt vine repede și apasă cercul!',
        'If one of us falls, the other runs over and presses ○!', 'If one of us falls, the other runs over and presses the circle!'),
  ('b', 'Apasă stick-ul ca să fugi. Rrrr, hai!', 'Apasă stickul ca să fugi. Rrrr, hai!',
        'Press the stick to run. Rrrr, come on!', 'Press the stick to run. Rrrr, come on!'),
 ]),
 ('robots', [
  ('k', 'Șșt! Aici dorm monștrii lui George.', None,
        "Shh! George's monsters sleep here.", None),
  ('b', 'Trecem încet pe lângă ei. Dacă se trezesc, îi lovim de două ori.', None,
        'We tiptoe past them. If they wake up, we hit them twice.', None),
  ('k', 'Florile mari care sclipesc ascund cristale. Lovește-le!', None,
        'The big sparkly flowers hide crystals. Hit them!', None),
  ('b', 'Fiecare trebuie să găsească cincisprezece cristale.', None,
        'Each of us has to find fifteen crystals.', None),
 ]),
 ('snails', [
  ('b', 'Uite râul! Pe mal sunt urme lipicioase. Prin ele mergem încet.', None,
        'Look, the river! There are sticky trails on the bank. We walk slowly in them.', None),
  ('k', 'Trecem apa pe pod sau sărim pe pietre.', None,
        'We cross the water on the bridge or jump on the stones.', None),
  ('b', 'Ai prea multe cristale? Dă-mi unul cu L1!', 'Ai prea multe cristale? Dă-mi unul cu butonul L unu!',
        'Too many crystals? Give me one with L1!', 'Too many crystals? Give me one with the L one button!'),
  ('k', 'Și atenție: când avem jumătate din cristale, vine George!', None,
        'And watch out: when we have half of the crystals, George comes!', None),
 ]),
 ('ridge', [
  ('k', 'Ce vânt bate pe culme!', None,
        'So windy on the ridge!', None),
  ('b', 'Păsările mari ne pot ridica în aer. Fugi de umbra lor!', None,
        'The big birds can lift us up in the air. Run away from their shadow!', None),
  ('k', 'Sau le speriem cu ghearele și cu mingea.', None,
        'Or we scare them with the claws and the ball.', None),
  ('b', 'Atenție la nisipul mișcător. Stăm aproape unul de altul!', None,
        'Watch out for the quicksand. We stay close together!', None),
 ]),
 ('vines', [
  ('b', 'Lianele atârnă pe stâncă. Se zice că în spatele lor e o ușă secretă.', None,
        'Vines hang down the cliff. They say there is a secret door behind them.', None),
  ('k', 'Și acolo e o stea pe care puțini au găsit-o!', None,
        'And there is a star that only a few have ever found!', None),
  ('b', 'Căutăm cu atenție peste tot.', None,
        'We look carefully everywhere.', None),
  ('k', 'La sfârșit intrăm amândoi în cuib!', None,
        'At the end we both go into the nest!', None),
 ]),
 ('road', [
  ('k', 'Torțele se aprind când trecem pe lângă ele.', None,
        'The torches light up when we walk past them.', None),
  ('b', 'E ultimul drum până la arena lui George.', None,
        "It's the last road to George's arena.", None),
  ('k', 'Gropi, monștri și vânt... Nu ne despărțim!', None,
        "Pits, monsters and wind... We don't split up!", None),
  ('b', 'Împreună suntem cei mai tari. Rrrr!', None,
        "Together we're the strongest. Rrrr!", None),
 ]),
 ('canyon', [
  ('b', 'George s-a întors și a furat steluțele!', None,
        'George came back and stole the little stars!', None),
  ('k', 'Avem puteri noi! Apasă □: eu îmi învârt mănușile.', 'Avem puteri noi! Apasă pătratul: eu îmi învârt mănușile.',
        'We have new powers! Press □: I spin my gloves.', 'We have new powers! Press the square: I spin my gloves.'),
  ('b', 'Și eu arunc oase-bumerang!', None,
        'And I throw boomerang bones!', None),
  ('k', 'Podul de lumină apare dacă stăm amândoi pe plăcile care sclipesc.', None,
        'The light bridge appears when we both stand on the shiny plates.', None),
  ('b', 'Dacă unul cade, celălalt are zece secunde să-l ajute cu ○!', 'Dacă unul cade, celălalt are zece secunde să-l ajute cu cercul!',
        'If one of us falls, the other has ten seconds to help with ○!', 'If one of us falls, the other has ten seconds to help with the circle!'),
 ]),
 ('works', [
  ('k', 'Aici își face George monștrii!', None,
        'This is where George makes his monsters!', None),
  ('b', 'Zidurile se deschid doar dacă lovim țintele.', None,
        'The walls only open if we hit the targets.', None),
  ('k', 'Țintele albastre sunt ale mele. Cele turcoaz sunt ale lui Boon.', None,
        "The blue targets are mine. The turquoise ones are Boon's.", None),
  ('b', 'La al doilea zid le lovim pe rând. Și ferește-te de benzile care te duc!', None,
        'At the second wall we hit them in order. And watch out for the moving belts!', None),
  ('k', 'Butonul roșu îi face pe monștri să danseze!', None,
        'The red button makes the monsters dance!', None),
 ]),
 ('lake', [
  ('b', 'Lacul e prea adânc ca să trecem înot.', None,
        'The lake is too deep to swim across.', None),
  ('k', 'Unul urcă pe plută. Celălalt învârte manivela de pe mal.', None,
        'One of us climbs on the raft. The other turns the crank on the bank.', None),
  ('b', 'Manivela o învârt cu ✕. Killer o învârte cu □.', 'Manivela o învârt cu butonul X. Killer o învârte cu pătratul.',
        'I turn the crank with ✕. Killer turns it with □.', 'I turn the crank with the X button. Killer turns it with the square.'),
  ('k', 'Apoi facem schimb! Pe a doua apă curentul trage pluta înapoi: învârte repede!', None,
        'Then we swap! On the second water the current pulls the raft back: turn fast!', None),
 ]),
 ('arena', [
  ('k', 'Asta e arena lui George! Stă pe tronul lui de piatră.', None,
        "This is George's arena! He sits on his stone throne.", None),
  ('b', 'Eu zgârii tronul cu ghearele, ca să cadă George!', None,
        'I scratch the throne with my claws, so George falls down!', None),
  ('k', 'Și când George cade, eu îl lovesc cu mingea!', None,
        'And when George falls, I hit him with the ball!', None),
  ('b', 'De {0} ori! Împreună putem!', 'De șase ori! Împreună putem!',
        '{0} times! Together we can do it!', 'Six times! Together we can do it!'),
 ]),
]

def lines(lang, who):
    """[(chapter, index in the chapter, spoken text)] for one language ('ro' / 'en') and one hero ('b' / 'k'), in order."""
    out = []
    for key, L in INTRO:
        for i, (w, ro, ros, en, ens) in enumerate(L):
            if w != who: continue
            out.append((key, i, (ros or ro) if lang == 'ro' else (ens or en)))
    return out
