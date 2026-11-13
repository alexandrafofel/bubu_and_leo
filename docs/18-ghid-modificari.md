# 18. Ghid de modificari

Retete pas cu pas pentru schimbarile cele mai probabile. Dupa fiecare reteta: `./build.sh`, `node tools/gen-docs.js`, testele minime din `17-testare.md`, si actualizezi capitolul din `docs/` care descrie partea schimbata.

## Inainte de orice

1. Citeste `CLAUDE.md`. Are regulile care nu se schimba fara acordul proprietarei.
2. Cauta numele cu `grep -n` in `src/` inainte sa adaugi unul nou. Toate numele de sus sunt globale.
3. Nu modifica `game/bubu-si-leo-ouale-de-aur.html`. Se rescrie la fiecare `./build.sh`.

## Reglaje simple (doar `src/01-config.js`)

| Vrei | Schimbi | Note |
|---|---|---|
| Niveluri mai lungi sau mai scurte | `levelDuration` | Numarul de oua creste odata cu el: `levelDuration / 60 * eggsPerMinute`. |
| Mai multe sau mai putine oua | `eggsPerMinute` | |
| Eroi mai rapizi | `heroes[k].speed` | Bubu 330, Leo 350. Peste 450 devine greu de controlat la 6 ani. |
| Tropait mai mare | `heroes[0].stompRadius`, `pullRadius` | |
| Sut mai puternic | `heroes[1].kickSpeed`, `kickSpeedMax`, `ballLife`, `ballLifeMax` | |
| Mai multe sau mai putine mingi la un sut | `heroes[1].ballsPerKick` (sut scurt), `ballsPerKickMax` (sut incarcat), `kickCooldown` | |
| Mingi mai mari sau mai lente pe o dificultate | `difficulty.*.ballSize`, `difficulty.*.ballSpeed` | |
| Cuibul sa nu mai fie adapost | `nestSafe: false`. Raza: `nestSafeRadius` | |
| Mai mult sau mai putin decor | `decorPerLevel`. Felurile si proportiile: `DECOR_WEIGHT` in `06-level.js` | Sub 1667 pe nivel, totalul scade sub 10.000 si `numara-elemente.js` pica. |
| Personajele sa nu mai vorbeasca | `babble: false` | Nu e inca in meniul Setari. |
| Gandaci mai lenti | `beetleSpeed` sau `difficulty.*.enemySpeed` | `enemySpeed` e pe jucator. |
| Mai putin vant | `windForce`, `windEvery`, `windDuration` | |
| Lupta din mijloc mai scurta | `duel.hp` (lovituri pe nivel), `duel.tiredTime` | |
| Lupta de la cuib mai usoara | `duel.finalHp`, `finalSize`, `finalSpeed`, `finalPrep`, `finalTired`, `finalExtra`, `angryAt` | Cu `finalSpeed` 1, `finalPrep` 1, `finalTired` 1 si `finalExtra` 0 e la fel ca lupta din mijloc, doar cu mai multe inimi. |
| Fara mini-lupte | `duel.enabled: false` | Cuibul se deschide dupa ultimul val. |
| Boss mai usor | `boss.hits`, `boss.shakes`, `boss.downTime`, `boss.throwEvery` | `shakes` si `throwEvery` au cate o valoare pe runda. Textul povestii ("De 5 ori!") si cercurile din HUD se potrivesc singure cu `hits`. Cate conuri arunca e in cod (`updateBoss`), nu in `CONFIG`. |
| Alte nume | `heroes[k].name`, `villainName` | Numele apar si in texte prin `{0}`, nu trebuie schimbate textele. |
| Alte culori ale eroilor | `heroes[k].color`, `color2`, `scarf`, `headband` | Respecta `15-culori.md`: fara negru, fara gri. |
| Dificultatea de la inceput | `defaultDifficulty` | `'easy'`, `'normal'` sau `'hard'`. |
| Sageata pornita pentru cine | `guideArrow` | `[Bubu, Leo]`. |
| Alte taste implicite | `keys` | Codurile sunt `KeyboardEvent.code`: `KeyW`, `Space`, `ArrowUp`, `Enter`. |
| Joc mai usor pentru Mac-ul vechi | `maxRenderWidth` | 1600 sau 1280. |

Atentie: setarile alese in joc (limba, volume, taste, dificultate) sunt salvate in browser si au prioritate fata de `CONFIG`. Ca sa vezi o valoare noua din `CONFIG` pentru acestea, sterge salvarea: in Chrome, `F12`, tab-ul Application, Local Storage, cheia `bubu-leo-oua-de-aur-v1`. Sau schimba `saveKey`.

## Schimbi un text

1. Deschide `src/015-lang.js`.
2. Gaseste cheia in `STR.ro` si in `STR.en`. Lista tuturor textelor cu cheile lor: `docs/anexe/C-texte.md`.
3. Schimba textul in ambele limbi.
4. `{0}`, `{1}` sunt locuri pentru nume sau numere. Pastreaza-le.
5. `✕` in text se deseneaza ca butonul real al controllerului.

## Adaugi un text nou

1. Alege o cheie cu prefixul zonei: `t.` start, `set.` Setari, `pad.` controller, `key.` taste, `duel.` lupte, `ban.` bannere, `end.` final de nivel.
2. Adaug-o in `STR.ro` si in `STR.en`.
3. In cod: `T('cheie')` sau `T('cheie', valoare0, valoare1)`.
4. Ruleaza `node tools/gen-docs.js` si verifica in `anexe/C-texte.md`.

## Schimbi un nivel

Definitiile sunt in `LEVEL_DEFS` din `src/06-level.js`. Fiecare camp este explicat in `09-niveluri.md`.

- Alt fundal sau alta paleta: `pal` (cheie din `PALS`).
- Alta muzica: `music` (cheie din `SONGS` din `03-audio.js`).
- Mai multi gandaci: `beetles`.
- Vant: `wind` (0 = fara, 1 = normal).
- Numele si povestea nivelului sunt texte: `lvl.<key>.name` si `lvl.<key>.intro` in `STR`.

Dupa schimbare, ruleaza `nivele-bot-mers.js`. Generatorul respinge harti in care ouale, stelele sau cuibul nu pot fi atinse si incearca alta samanta (pana la 80). Daca vezi "Nivelul nu a putut fi construit", harta ta are mereu o parte inchisa.

## Adaugi un nivel

1. Adauga o definitie in `LEVEL_DEFS`, cu o `key` noua.
2. Adauga `lvl.<key>.name` si `lvl.<key>.intro` in ambele limbi.
3. Mareste `CONFIG.levels`.
4. Adauga o valoare in `CONFIG.duel.hp` si una in `CONFIG.duel.finalHp`, si un paznic in `DUEL_DEFS` (`075-duel.js`), sau lupta nivelului foloseste ultimul paznic.
5. Ruleaza `joc-complet-bot.js`.

Atentie: salvarile vechi retin numarul nivelului. Un nivel nou in mijloc muta progresul copiilor.

## Schimbi un sunet

Efectele sunt in obiectul `fx` din `src/03-audio.js`, cate o functie pe sunet. Lista: `docs/anexe/E-sunete.md`. Uneltele (`osc`, `noise`, `kalimba`, `marimba`, `chime`, `flute`) sunt explicate in `06-sunet.md`.

Reguli: doar `sine` si `triangle`, filtru trece-jos pe tot ce e zgomot, nimic sub 0.01 s la atac (ar pocni). Dupa schimbare, ruleaza `sunete-volum.js`: niciun varf peste 0.7.

Sunetele personajelor trebuie trecute in lista `CHR` (merg pe volumul "Sunete personaje" si in difuzorul controllerului) si redate cu `Snd.play(nume, valoare, erou)`.

## Schimbi o culoare

1. Cauta culoarea in `docs/anexe/B-culori.md`. Vezi toate locurile unde apare.
2. Citeste `15-culori.md`: de ce are culoarea asta.
3. Schimb-o in toate locurile care trebuie sa ramana la fel.
4. Fa capturi (`capturi-ecran.js`) si uita-te la ele.

## Schimbi un paznic

`DUEL_DEFS` in `src/075-duel.js`. Campurile si tiparele (`charge`, `hop`, `fly`) sunt in `11-mini-lupte.md`. Desenul e in `DUEL_PAINT.<id>`. Ruleaza `mini-lupte-bot.js` cu nivelul lui.

## Daca ceva nu merge

| Simptom | Cauza probabila |
|---|---|
| Ecran negru, nimic | Eroare la incarcare. Deschide consola Chrome (`Cmd + Option + J`). Mesajul apare si sus, pe joc. |
| `ReferenceError` la incarcare | Un fisier foloseste un nume definit intr-un fisier de dupa el. Vezi ordinea din `build.sh`. |
| `SyntaxError: Identifier ... has already been declared` | Un nume nou exista deja in alt fisier. |
| Textul apare ca o cheie (`set.music`) | Cheia lipseste din `STR`. Adaug-o in ambele limbi. |
| Un sunet nu se aude in controller | Lipseste al treilea argument din `Snd.play` sau numele nu e in `CHR`. |
| Setarea noua din `CONFIG` nu se vede | Salvarea din browser are prioritate. Vezi mai sus. |
| Nivelul nu se construieste | Harta are o zona inchisa. Vezi `09-niveluri.md`, verificarea drumului. |

## Prompt pentru un cont nou de Claude

Vezi `prompts/03-prompt-update-urmator.md`. Principiul: lipesti promptul, atasezi depozitul (sau ii dai acces pe GitHub), si ii ceri sa citeasca `CLAUDE.md` si `docs/00-cuprins.md` inainte sa schimbe ceva.
