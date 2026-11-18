# 26. Limba personajelor (sarcina T13)

> **Un singur joc (18 noiembrie 2026).** "Bubu și Leo" a fost scos. Tot ce e specificat aici se implementeaza **doar in "Cea mai grea luptă"**. Unde scrie "ambele jocuri", "primul joc", variante `L:` sau teste pentru `bubu`, se citeste: un singur joc, textele lui (varianta `L:`), un singur rand de teste. Nu se mai scrie cod pentru primul joc.

Status: **specificatie, neimplementata.** Vezi `23-update-partea-a-doua.md` pentru cerere, hotarari si planul in 14 sarcini, si `../prompts/06-prompt-partea-a-doua.md` (T13) pentru promptul gata de lipit.

Cererea proprietarei (18 noiembrie 2026): "personajele sa aiba o limba a lor (undeva la 1000 de cuvinte in vocabular)".

Acum fiecare erou are 33 de cuvinte, ca sunete scurte pentru intamplari (`BABBLE`, vezi `06-sunet.md`). Nu sunt o limba: nu au sens, nu se pot combina, nu se pot invata. T13 le face o limba adevarata. Ramane un joc, nu o lectie: copilul aude, vede ce inseamna, si **descopera** cuvinte pe masura ce joaca. Nimeni nu e pus sa invete ceva.

---

## L1. Ce se hotaraste (si de ce)

| Nr | Hotarare | De ce |
|---|---|---|
| L1 | **Patru limbi**, cate una pentru fiecare erou: Bubu, Leo, Boon, Killer. Fiecare are cel putin 950 si cel mult 1100 de cuvinte. Tinta: 1000. | "Personajele sa aiba o limba a lor". Un erou, o limba. Intrebarea I10 din `23` o poate schimba. |
| L2 | Toate patru limbile spun **aceleasi 1000 de lucruri** (lista de sensuri din L3). Se schimba doar cuvantul. | Copilul poate compara cum zice "ou" fiecare erou. Se scrie o singura lista de sensuri, nu patru. |
| L3 | Cuvintele **nu se scriu de mana**. Se **genereaza la pornire** din regulile sunetelor fiecarei limbi (L5) si dintr-un numar fix (`seed`). Aceleasi cuvinte la fiecare pornire, pe orice calculator. | 4000 de cuvinte scrise de mana nu se pot verifica. Un generator si un test se pot. |
| L4 | **Cuvintele vechi raman.** Cele 33 (47 dupa T12) de exclamatii din `BABBLE` nu se schimba si nu se numara in 1000. Devin "exclamatiile" eroului: ce spune cand e lovit, cand ia un ou. | Copiii le-au auzit deja si le stiu. Ele nu sunt cuvinte cu sens, sunt tipete. |
| L5 | Se adauga **consoane moi** (m, n, l, b, d, g, w, y, r), facute din sunete voisate, fara zgomot, ca vocalele. Regula din `06-sunet.md` "doar vocale, fara consoane" se schimba. | Cu doar 5 vocale nu se pot face 1000 de cuvinte pe care urechea unui copil sa le deosebeasca. Regula 5 din `CLAUDE.md` (sunete calde si moi) ramane. |
| L6 | Fiecare cuvant are o **scriere** (litere latine, fara diacritice) si un **sunet**. Scrierea se vede in balon si in dictionar. | Copilul de 8 ani citeste. Cel de 6 asculta. |
| L7 | Eroii **spun numele lucrurilor** pe care le ating sau le intalnesc, in limba lor, cu o traducere scurta in balon. Cuvantul se **descopera** si intra in dictionar. | Altfel 1000 de cuvinte nu se aud niciodata. |
| L8 | Exista un ecran **Dictionar** (din pauza si din meniul de start). Cuvintele nedescoperite apar ca puncte. | Colectionarea e jocul: nu pierzi nimic, doar descoperi. Se potriveste cu "Fara Game Over". |
| L9 | Balonul cu traducerea se poate opri din Setari. Sunetul ramane. | Cel mare poate vrea fara text. `CONFIG.babble` opreste tot. |
| L10 | Numele proprii (Bubu, Leo, Boon, Killer, George, Ciori) **nu se traduc** si nu fac parte din cele 1000. | Sunt numele din desenele copiilor. |

---

## L2. Cele 1000 de sensuri

Lista sta intr-un fisier nou, `src/016-lexic.js`, incarcat dupa `015-lang.js` (se adauga in `FILES` din `build.sh`). Un sens are: un numar (`id`, de la 0), o categorie, textul in romana si textul in engleza.

**Regula de aur: numerele nu se schimba niciodata.** Salvarea tine cuvintele descoperite dupa `id`. Sensurile noi se pun la sfarsit.

```js
// src/016-lexic.js. Fiecare categorie: o lista de perechi "romana|engleza". id = pozitia, numarand de la inceputul listei.
const LEX_CATS = [
  { key: 'creat', ro: 'Vietati', en: 'Creatures', words: 'ou|egg, pasare|bird, cioara|crow, gandac|beetle, ...' },
  ...
];
```

| Cheie | Categorie | Cate | Exemple (ce are voie sa cuprinda) |
|---|---|---|---|
| `creat` | Vietati | 90 | pasare, fluture, gandac, broasca, dinozaur, pisica, pestisor, soricel, copil, mama, prieten, rege |
| `corp` | Corp si simturi | 60 | mana, picior, ochi, burta, coada, corn, cap, inima, aud, vad, miros |
| `natura` | Natura si vreme | 100 | soare, luna, stea, ploaie, vant, norc, rau, lac, jungla, frunza, floare, iarba, noroi, foc, piatra, noapte |
| `loc` | Locuri si cladiri | 80 | cuib, casa, pestera, pod, poarta, turn, drum, deal, sala, tron, cusca, insula |
| `lucru` | Lucruri | 100 | minge, os, manusa, cristal, felinar, cheie, pluta, bolovan, panza, scara, clopotel, lumina, umbra |
| `mancare` | Mancare | 60 | oua, miere, mar, paine, lapte, ciupercuta, prajitura, suc |
| `actiune` | Actiuni | 150 | merg, alerg, sar, iau, dau, arunc, rotesc, imping, trag, deschid, inchid, ajut, caut, gasesc, ascund, strig, rad, dorm, mananc, joc |
| `simt` | Sentimente si stari | 70 | bucurie, frica, mandrie, tristete, rusine, mirare, drag, somn, foame, obosit, curajos |
| `insus` | Insusiri | 100 | mare, mic, rapid, lent, cald, rece, moale, tare, sus, jos, rosu, galben, albastru, roz, turcoaz, frumos, rau, bun |
| `numar` | Numere, timp, directii | 50 | unu pana la zece, mult, putin, azi, maine, acum, stanga, dreapta, inainte, inapoi |
| `mic` | Cuvinte mici | 40 | eu, tu, el, noi, da, nu, si, cu, in, pe, ce, unde, hai, stai, te rog, multumesc, bun venit |
| `joc` | Din lumea jocului | 100 | tot ce are jocul si nu e deja mai sus: placa, tinta, banda, raza, scut, val, nivel, steluta, medalie, capitol, poarta dubla, "ajutor" |

Total: 1000. Un sens apare o singura data. Cuvintele trebuie sa fie ale unui copil de 6 ani: nimic abstract (nu "dreptate", "viitor"), nimic urat, nimic care sperie. Lista se scrie intai, se verifica, apoi vine generatorul.

Sensurile din categoria `joc` si cele de mai sus care corespund unui lucru din joc au si o **legatura** cu lumea: `bind: 'bug'`, `'egg'`, `'gate'` etc. (nume de obiecte, inamici, mecanisme din cod). Prin ea eroii pot spune numele a ceea ce ating (L7). Cel putin 150 de sensuri au legatura.

---

## L3. Cum se fac cuvintele (generatorul)

Pentru fiecare limba exista o descriere a sunetelor, `LANG_PHON[hero]`:

| Camp | Ce spune | Exemplu (Bubu) |
|---|---|---|
| `vow` | Vocalele folosite, cu cat de des. | `a o u` mult, `e` rar |
| `con` | Consoanele moi folosite. | `m b n l w` |
| `shapes` | Felurile de silabe, cu sansa lor. | `CV` 60%, `V` 15%, `CVn` 25% |
| `len` | Cate silabe: pentru sensurile des folosite (categoria `mic`, `corp`, `actiune`) 1 - 2, pentru restul 2 - 3. | 1 - 3 |
| `end` | Cu ce se pot termina cuvintele. | `o u on` |
| `seed` | Numarul care face limba a lui. In `CONFIG.lang.seeds`. | `7301` |

Cele patru limbi, ca sa se deosebeasca de la prima auzire:

| Erou | Cum suna | Vocale | Consoane | Final | Tempo |
|---|---|---|---|---|---|
| Bubu | rotund, jos, lent, alunecari in jos | a o u | m b n l w | o, u, on | lent |
| Leo | luminos, sus, repede, alunecari in sus | i e a | l y n d g | i, e, a | repede |
| Boon | tremurat (ca acum), maraituri scurte | o u a | r g b m w | ur, o, ar | greoi |
| Killer | sacadat, scurt, ca niste strigate de sport | e a i o | d g k t (bataie scurta, vezi mai jos) | k, t, e | foarte repede |

Algoritm (determinist, fara `Math.random`; se foloseste un generator cu `seed`, de exemplu `mulberry32`):

1. Pentru fiecare sens `id` din lista, in ordine, se incearca pana la 200 de variante.
2. O varianta = o lista de silabe alese dupa `shapes`, `vow`, `con`, `len`, `end`.
3. Se **respinge** daca: scrierea exista deja in aceeasi limba; exista deja in oricare din celelalte trei limbi; difera printr-un singur sunet de un cuvant din **aceeasi categorie** (ca sa nu se confunde doua cuvinte apropiate); seamana cu un cuvant din lista de sensuri in romana sau engleza (lista de oprire); e in lista de cuvinte nepotrivite (cel putin 60 de cuvinte urate in romana si engleza, scrisa in `tests/limba.js`, nu in joc).
4. Daca nu iese nimic din 200 de incercari, se slabeste regula "aceeasi categorie" pentru acel sens si se incearca iar. Daca tot nu iese, generatorul da eroare la pornire (testul o prinde).
5. Rezultatul: `LEXICON[hero][id] = { w: 'molu', syl: [...] }`. Se pastreaza in memorie si nu se refac.

Cuvintele nu au voie sa se schimbe cand se schimba codul altor lucruri. De aceea testul pastreaza **primele 20 de cuvinte** ale fiecarei limbi ca valori fixe. Daca se schimba, testul pica si cel care schimba trebuie sa spuna de ce.

### Sunetul unei silabe

Silaba de acum are `[vocala, semiton, durata, alunecare]`. Se adauga un al cincilea element, optional: consoana de la inceput (`'m'`, `'n'`, `'l'`, `'b'`, `'d'`, `'g'`, `'w'`, `'y'`, `'r'`, `'k'`, `'t'`). Silabele vechi nu se schimba.

| Consoana | Cum se face (toate fara zgomot, doar unde si filtre, ca `syl()` de acum) |
|---|---|
| `m`, `n` | 60 ms de sunet nazal: unda triunghi trecuta printr-un filtru trece-jos la 400 Hz, apoi se deschide spre vocala. |
| `l`, `r` | 50 ms in care formantii aluneca de la `u` spre vocala. `r` are si tremurul lui Boon. |
| `w`, `y` | 70 ms de alunecare de la `u` (pentru `w`) sau de la `i` (pentru `y`) spre vocala. |
| `b`, `d`, `g` | 35 ms in care sunetul porneste mai jos cu 4 semitonuri si urca spre vocala, cu volum mic la inceput. |
| `k`, `t` (doar Killer) | O bataie de 15 ms: o unda triunghi scurta, trecuta printr-un trece-jos la 1800 Hz, nivel mic. Nu e zgomot si nu e aspra. |

Durata maxima a unui cuvant: `CONFIG.lang.maxWord` (0.9 s). A unei fraze: `maxPhrase` (2.4 s).

---

## L4. Cum se aude si se vede in joc

### Fraze

O **fraza** e o exclamatie veche (hotararea L4) urmata de 1 - 3 cuvinte din lexic. De exemplu cand Bubu ia un ou: exclamatia `egg` si apoi cuvintele pentru "eu" si "ou". Fiecare situatie are:

- numarul sensurilor in ordine (`LEX_PHRASES.egg = ['eu', 'ou']`),
- textul tradus pentru balon, scris de mana in `STR` (`'ph.egg': 'Un ou!'`), in romana si engleza.

Situatiile sunt cele din `TALK_PRIO` (`egg`, `star`, `giant`, `hurt`, `help`, `rescue`, `thanks`, `nestOpen`, `levelWin`, `bossDown`, ...) plus cele din T12 (`run`, `hurry`, `retry`, `power2`, `gate`, `plate`, `together`, `carry`, `pass`, `ride`, `dark`, `held`, `starFree`). Cel putin 30 de fraze. Eroul care nu are un cuvant in fraza (nu exista, nu e cazul) spune doar exclamatia.

Frazele **nu se aud la fiecare ou**. Se pastreaza regula de acum (`egg` o data din trei) si se adauga o pauza: `CONFIG.lang.phraseGap` (4 s) intre doua fraze ale aceluiasi erou. Un cuvant din fraza taie alt cuvant doar daca prioritatea lui e mai mare (`TALK_PRIO`).

### Numele lucrurilor (L7)

Cand un erou e la mai putin de `CONFIG.lang.nameRange` (180 de unitati) de un lucru cu `bind` (un ou, un gandac, o poarta, o placa, o floare mare), il numeste, la cel mult o data la `nameGap` (6 s), si doar daca cuvantul nu a fost spus de mai mult de 3 ori in acest nivel. Cuvintele nedescoperite au prioritate. Numele nu se aude cand eroul e lovit, amețit sau in poveste.

### Balonul cu traducerea

Un balon mic langa capul eroului: cuvantul (scris cu litere mari, in culoarea eroului) si, dedesubt, sensul in limba jocului. Sta 2.2 s. **Un singur balon pe erou, deodata.** Nu se pune niciodata peste un erou, peste scrisul de sus sau peste o bara (regulile din `24-sisteme-noi.md`, S6). Cuvintele noi au o steluta mica si un sunet `chime` slab.

Balonul se opreste din Setari ("Text la cuvinte", Da / Nu), salvat ca restul setarilor.

### Dictionarul

Ecran nou, `Game.state = 'dict'`. Se deschide din pauza (rand nou "Dictionar", intre "Capitole" si "Ieșire") si din meniul de start (rand nou, dupa "Capitole"). Cu o singura persoana sau cu doua, cu orice controller sau tastatura.

- Sus: doua taburi, eroii jocului de acum. Sub ele, categoriile (12), ca sagetile stanga - dreapta.
- Jos: o grila de 4 x 3 carduri pe pagina, cu pagini (sageata sus - jos, sau L1 / R1).
- Card descoperit: cuvantul mare, sensul in romana (sau engleza), numarul sensului. ✕ il face sa se auda.
- Card nedescoperit: trei puncte. Nu se aude nimic.
- Sus de tot: "Cuvinte aflate: 134 / 1000" pentru eroul ales, si bara de progres.
- ○ inapoi. Nu are timp, nu pune presiune, nu pierzi nimic.

Un cuvant e descoperit cand eroul **il spune** intr-o fraza sau intr-un nume cu balon aratat, nu inainte.

### Salvarea

In locul salvarii de acum (versiunea 4, slotul fiecarui joc) se adauga campul `lex`: `{ '0': [ids], '1': [ids] }`, cuvintele descoperite pentru fiecare erou. Lipsa campului inseamna "nimic descoperit". Nu e nevoie de versiune noua. `migrateSave` pune `{ '0': [], '1': [] }` daca lipseste. `ids` sunt numerele sensurilor.

### Cand nu merge sunetul

Daca sunetul nu a pornit sau `CONFIG.babble` e fals: nu se aude nimic, dar balonul si dictionarul merg ca de obicei (cuvintele pot fi descoperite si doar citite).

---

## L5. `CONFIG.lang` (se adauga in `src/01-config.js`)

```js
lang: {
  on: true,                       // limba cu 1000 de cuvinte. false = doar exclamatiile de acum
  seeds: { bubu: [7301, 7302], lupta: [7303, 7304] },   // cate un numar pentru fiecare limba (Bubu, Leo; Boon, Killer)
  words: 1000,                    // cate sensuri are fiecare limba (950 - 1100)
  maxWord: 0.9,                   // cat poate dura un cuvant, in secunde
  maxPhrase: 2.4,                 // cat poate dura o fraza
  phraseGap: 4,                   // pauza intre doua fraze ale aceluiasi erou
  nameRange: 180, nameGap: 6, nameMax: 3,     // eroii numesc lucrurile (L7)
  bubble: true, bubbleTime: 2.2,  // balonul cu traducerea (valoarea de start, se schimba in Setari)
  own: { }                        // cuvinte alese de copii: { '<joc>:<erou>': { '<id sens>': 'cuvant' } } (vezi I14)
}
```

---

## L6. De facut in cod

1. `src/016-lexic.js` (nou, dupa `015-lang.js`): `LEX_CATS`, `LEX` (lista plata cu `id`, `cat`, `ro`, `en`, `bind`), `LEX_PHRASES`, `LANG_PHON`, `buildLexicon(hero)` si memoria `LEXICON`. Adauga-l in `FILES` din `build.sh`. Verifica cu `grep` ca numele noi nu exista deja.
2. `src/03-audio.js`: consoanele in `syl()` (al cincilea element), `Snd.say(k, id)` (un cuvant din lexic) si `Snd.phrase(k, key)` (exclamatie + cuvinte), cu aceleasi reguli de prioritate si limitele de durata. `Snd.talk` ramane neschimbata.
3. `src/07-play.js`: apeleaza `phrase` unde se apeleaza acum `talk` pentru situatiile din L4; numele lucrurilor din apropiere (L7); `P.lexSeen` pentru ce s-a descoperit in nivel.
4. `src/08-draw.js`: balonul (`drawWordBubble`), asezat dupa regulile S6.
5. `src/09-screens.js`: ecranul `dict`, randul din pauza si din meniul de start, optiunea "Text la cuvinte" in Setari, campul `lex` in salvare.
6. `src/10-main.js`: starea `dict`, intrarile/iesirile din ea.
7. `src/015-lang.js`: textele noi in romana si engleza: `dict.title`, `dict.found`, `dict.hint`, `set.words`, `ph.*` (cel putin 30 de fraze), numele categoriilor.
8. `CLAUDE.md`: regula 9 devine "Fiecare erou are propria limba, cu cel putin 950 de cuvinte generate (vezi `docs/26`), niciun cuvant la fel cu al altui erou." Se adauga randul in tabelul "Unde gasesti lucrurile".
9. Documentatia: capitolul 06 (consoanele, lexicul), 03 (`CONFIG.lang`), 13 (ecranul Dictionar), 17 (testele), 16 (decizii L1 - L10), 19 (ce nu s-a verificat), `00-cuprins.md`, `README.md`. Capitolul 26 devine istoric.

---

## L7. Cazuri de margine

- Eroul nu are inca nicio fraza pentru o situatie noua: spune doar exclamatia.
- Un singur jucator: nu se schimba nimic. Eroul celalalt nu vorbeste.
- Doua fraze deodata (ambii eroi iau un ou): a doua porneste cu 0.4 s mai tarziu, ca sa nu se amestece, si nu o taie pe prima.
- Fereastra mica: balonul se opreste la marginea ecranului, nu iese afara.
- Cuvant descoperit in alt joc: nu conteaza. Fiecare joc are slotul lui de salvare.
- Salvare veche fara `lex`: se deschide normal, dictionarul e gol.
- Limba engleza: balonul si dictionarul arata sensul in engleza. Cuvintele inventate sunt aceleasi.
- Cel mult 1100 de cuvinte pe limba si cel mult 60 KB in plus in fisier (lista de sensuri, fraze, generatorul). Generarea celor 4 limbi la pornire dureaza sub 80 ms (se masoara).

---

## L8. Teste (`tests/limba.js`, ambele jocuri)

| Nr | Ce verifica |
|---|---|
| 1 | Fiecare din cele 4 limbi are intre 950 si 1100 de cuvinte. |
| 2 | Niciun cuvant nu apare de doua ori in aceeasi limba (scriere sau sunet) si niciunul nu apare in alta limba. |
| 3 | Niciun cuvant nu e identic cu un sens din lista in romana sau engleza si niciunul nu e in lista de cuvinte nepotrivite. |
| 4 | Fiecare sens are text in romana si in engleza, nu gol, cel mult 24 de litere. Categoriile au numarul de sensuri din L2. Sunt 1000 in total. |
| 5 | Generarea e determinista: doua porniri dau acelasi rezultat. Primele 20 de cuvinte din fiecare limba sunt cele fixate in test. |
| 6 | Fiecare cuvant din fiecare limba dureaza cel mult `maxWord`, iar fiecare fraza cel mult `maxPhrase`. Varful sunetului (inainte de compresor) nu depaseste limita din `sunete-limita.js` pentru nicio consoana. |
| 7 | Cele patru voci se aud diferit: nota de baza, durata medie a unei silabe si consoanele difera intre eroii aceluiasi joc cu cel putin pragurile din test. |
| 8 | Fiecare din cele cel putin 30 de situatii are fraza si traducere in romana si engleza. |
| 9 | In nivel, un erou langa un ou spune cuvantul pentru "ou", apare balonul si cuvantul intra in `lex`. Dupa reincarcarea paginii, ramane descoperit. |
| 10 | Balonul nu acopera niciun erou: `hud-acoperire.js` cu `STRICT=1` ia in calcul si balonul. Cel mult un balon pe erou. |
| 11 | Dictionarul se deschide din pauza si din meniul de start, cu tastatura si cu controller simulat; ✕ aude un cuvant descoperit, nu aude unul nedescoperit; ○ iese; fara erori. |
| 12 | "Text la cuvinte: Nu" ascunde balonul si lasa sunetul. `CONFIG.babble = false` le opreste pe amandoua. |
| 13 | O salvare veche (fara `lex`) se incarca. Cuvintele descoperite se pastreaza la o salvare noua. |
| 14 | `tests/sunete-personaje.js`, `tests/toate.sh` si `performanta.js` (cel mult 3% mai incet) trec. |

Ca la toate sarcinile: verifica o data ca fiecare test poate sa pice (strica regula, vezi `NEREUSIT`, pune la loc).

---

## L9. Ce nu se poate verifica fara copii

- Daca 1000 de cuvinte sunt prea multe sau prea putine pentru ei, daca se joaca cu dictionarul.
- Daca limbile se deosebesc destul pentru urechea unui copil de 6 ani.
- Daca cele patru limbi suna ca vorbire adevarata sau ca un zumzet. Daca nu plac, se schimba `seeds` si `LANG_PHON`.
- Daca balonul incurca in luptele rapide.
- Daca frazele sunt prea dese: se regleaza `phraseGap` si `nameGap`.
