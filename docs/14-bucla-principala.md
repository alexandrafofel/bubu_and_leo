# 14. Bucla principala (`src/10-main.js`)

Ultimul fisier. Leaga totul si porneste jocul.

## Canvas-ul: `resize()`

- Scara: cat incape 1920 x 1080 in fereastra, pastrand proportia. Restul ramane in culoarea de fundal a paginii (`#4a3540`, un violet-maro inchis, nu negru).
- Latimea reala in pixeli: latimea afisata x `devicePixelRatio`, intre 640 si `CONFIG.maxRenderWidth`.
- `renderScale` = latimea reala / 1920. Fiecare cadru incepe cu `setTransform(renderScale, ...)`, deci tot codul deseneaza in unitati logice.
- Se reface la fiecare schimbare de marime a ferestrei.

## Evenimente

| Eveniment | Ce face |
|---|---|
| `pointerdown` (clic) | Porneste sunetul, tine minte clicul pentru meniuri. Pe primul ecran intra in ecran complet daca `Opt.fullscreen`. |
| `pointermove` | Tine minte pozitia mouse-ului (pentru meniuri). |
| `keydown` | Porneste sunetul. F comuta ecranul complet. Pe primul ecran, orice tasta intra in ecran complet. |
| `fullscreenchange` | `Opt.fullscreen` urmeaza ce face ecranul de fapt si se salveaza. |

Mouse-ul dispare cat se joaca (clasa CSS `playing`, `cursor: none`) si reapare in meniuri si pauza.

## Tranzitiile

| Functie | Ce face |
|---|---|
| `Game.toSelect()` | Ecranul "Alege jocul": inchide meniurile, opreste intrarea in joc cu tastatura (`kbJoin = false`), muzica de start. |
| `Game.toTitle()` | Ecranul de start: reseteaza "Gata!", inchide meniurile, reporneste atribuirea automata a controllerelor, opreste vocea, citeste salvarea, muzica de start. |
| `Game.startGame(cont)` | Cu `cont`: porneste capitolul la care duce "Continuă". Fara: sterge progresul jocului ales (`Save.newGame`) si porneste capitolul 1. |
| `Game.startChapter(i)` | Porneste capitolul `i` ales pe ecranul Capitole. Nu sterge nimic. |
| `Game.toChapters()` | Ecranul Capitole: alege capitolul la care duce "Continuă", opreste intrarea in joc cu tastatura, muzica de start. |
| `Game.goLevel(idx)` | Trece la `loading` pentru capitolul `idx`. Opreste intrarea in joc cu tastatura (vezi `13-ecrane-si-meniuri.md`). |
| `Game.levelEnd()` | `finishChapter()`: tine minte ce s-a adunat acum (`Game.lastRun`), pastreaza cel mai bun rezultat al capitolului (`Save.finish`), totalul devine suma. Apoi trece la `levelEnd`. |
| `Game.toEnding()` | `finishChapter()`, apoi festivalul. |

## `update(dt)`

| Stare | Ce face |
|---|---|
| `boot` | Asteapta o tasta, un clic sau un controller. Apoi porneste sunetul si vocea, cauta difuzoarele salvate, alege jocul jucat ultima data (`Save.data.game`) si merge la "Alege jocul". |
| meniul Setari deschis | Doar `updateSettings`. Jocul din spate sta pe loc. |
| `select` | `updateSelect`. |
| `title` | `updateTitle`. |
| `chapters` | `updateChapters`: ecranul Capitole. |
| `loading` | Al treilea cadru: construieste nivelul, trece la `intro`, coboara muzica, citeste povestea. |
| `intro` | Dupa 0.8 s, orice "mai departe" porneste jocul. |
| `play` | Daca e pauza: `updatePause`. Altfel: daca un controller s-a pierdut sau s-a cerut pauza, pune pauza. Altfel `updatePlay`. |
| `levelEnd` | Particulele continua. Dupa 1.5 s, "mai departe" trece la capitolul urmator. Si dupa un capitol rejucat din lista: ca in "It Takes Two", jocul merge mai departe de acolo. |
| `ending` | `updateEnding`. |

La sfarsitul fiecarui `update`, clicul si pozitia mouse-ului se sterg, iar `UI.spkLostT` (cat mai sta pe ecran mesajul despre difuzorul negasit) scade.

## `draw()`

Deseneaza ecranul starii, apoi pauza sau Setari daca sunt deschise, apoi overlay-ul (hartie, lumina, vinieta) cu `multiply`. Lista de zone pentru clic (`UI.hits`) se goleste la inceputul fiecarui desen. Cand Setari sunt deschise, se goleste inca o data inainte de ele, ca un clic sa nu ajunga la butoanele din spate.

## Pornirea

La incarcarea paginii, in ordine:

1. `Save.load()` si `Save.apply()`: setarile salvate (limba, volume, taste ...).
2. `setLanguage(Opt.lang)`: chiar primul ecran e in limba aleasa.
3. `resize()`.
4. `initScreens()`: picteaza fundalul ecranului de start (o pajiste) si overlay-ul lui.
5. `window.__game`: obiectele interne pentru teste.
6. Porneste bucla de cadre.

## `window.__game`

Folosit doar de teste. Contine `Game`, `Input`, `UI`, `Save`, `CONFIG`, `Opt`, `STR`, `T`, `Snd`, `Voice`, `Perf` (timpii de cadru), `P` (nivelul curent), `GAME` (jocul ales) si functiile `setGame`, `buildLevel`, `genLevel`, `startPlay`, `startDuel`, `duelHit`, `openNest`, `hitHero`, `getUp`, `tryRescue`, `hurtSmall`, `kickBall`, `recallBalls`, `update`, `draw`, `openSettings`, `closeSettings`, `swapHeroes`, `settingsRows`.

Daca adaugi o functie pe care vrei sa o folosesti intr-un test, o adaugi aici.
