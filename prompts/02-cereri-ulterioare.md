# Cererile ulterioare

Mesajele proprietarei dupa prima versiune, cuvant cu cuvant, in ordinea in care au venit. Raspunsul la fiecare este descris in capitolele din `docs/`.

## 1. Tastele (13 noiembrie 2026)

> care sunt controllerele de la tastatura?

Raspuns: Bubu cu W A S D si Spatiu, Leo cu sagetile si Enter, P sau Esc pentru pauza, F pentru ecran complet. Vezi `docs/07-control.md`.

## 2. Al doilea update (13 noiembrie 2026)

> ce trebuie imbunatatit: sa se vada cat din nivel este facut (progresul) si cat mai au de facut. pentru jucatorul de 6 ani nu este foarte intuitiv sa ii apara o sageata ceva unde tb sa mearga sau ce sa faca (cu transparenta, sa nu ii ia tot focusul) si pentru cel de 8 ani nu este suficient de challenging. sa existe niste challenge-uri la fiecare nivel, niste mini lupte inainte de terminarea nivelului in care jucatorul de 8 ani (in cazul asta fotbalistul) sa aiba ceva mai antrenant ssi cel mic fie sa stea ascuns in cuib sau sa adune ouale care apar din lupta (sa nu aiba prea multe de facut). de asemenea, sa aiba jocul setari, sa pot alege tastele cu care vreau sa joc, daca e controller sau tastatura - daca aleg controller sa am pasi si setari sa pot conecta controllerul atunci, limba in care vreau sa joc (engleza sau romana) full screen sau nu, volum sunet personaje si sunet ambiental, personaj. personajele sa scoata niste sunete (care atunci cand e controllerul conectat sa se auda in controller). sunete cand merge, cand ia oua, cand e lovit etc.

Ce s-a facut:

| Cerere | Unde |
|---|---|
| Progresul nivelului | Bara de progres, `docs/12-desen-si-hud.md` |
| Sageata pentru cel mic, transparenta | Sageata ajutatoare, `docs/12-desen-si-hud.md` |
| Provocare pentru cel mare, mini-lupte | `docs/11-mini-lupte.md`, dificultatea "Greu", medaliile |
| Cel mic ascuns in cuib sau aduna ouale | Adapostul si ouale din lupta, `docs/11-mini-lupte.md` |
| Setari: taste, controller sau tastatura, pasi de conectare, limba, ecran complet, volume, personaj | `docs/13-ecrane-si-meniuri.md`, `docs/04-limba-si-setari.md` |
| Sunete pentru personaje, in controller | `docs/06-sunet.md` |

## 3. Documentatia si update-ul urmator (13 noiembrie 2026)

> da-mi o documentatie pentru tot ce ai facut in joc - totul super super super bine documentat, fiecare virgula, fiecare decizie de ce, fiecare culoare, fiecare linie de cod. absolut totul. sa pot sa folosesc documentatia pentru a modifica jocul cu orice cont de claude (nu doar contul asta). urca-mi in github codul sa aiba aces la el in repo bubu_and_leo. urca acolo si documentatia. + promptul. also. vreau niste modificari de pus in documentatie pentru urmatorul update-> personajele sa aiba fiecare cate 30 de sunete diferite pentru diverse actiuni - un fel de limba a lor, draguta, amuzanta. nu ma intereseaza sa dau mai incet muzica din controller, ambele personaje cand isi folosesc puterea (cum e saritul dinozaurului si aruncatul mingii) puterea se duce in toate directiile (cum e la saritul dinozaurului) de ex - in cazul fotbalistului ar fi trebuit sa arunce cu mingi in toate directiile. lupta ca grad de dificultate cum e acum sa fie cand personajele ajung la mijlocul drumului si "boss" fight-ul sa fie mai greu. cand un personaj ajunge in "cuib" sa nu il ia vantul, sa nu poata fi lovit in niciun stadiu al jocului. sa existe minim 10.000 de elemente in joc.

Ce s-a facut: acest depozit (`docs/`, `prompts/`, `CLAUDE.md`). Modificarile pentru update-ul urmator sunt specificate in `docs/20-update-urmator.md`, nu sunt inca in cod.
