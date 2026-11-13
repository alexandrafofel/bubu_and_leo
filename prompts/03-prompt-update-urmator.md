# Prompt pentru urmatorul update

Lipeste textul de mai jos intr-o conversatie noua cu Claude (orice cont), dupa ce Claude are acces la depozitul `alexandrafofel/bubu_and_leo` (prin GitHub sau ca arhiva atasata).

---

Lucrezi la jocul "Bubu și Leo: Ouăle de Aur" din depozitul GitHub `alexandrafofel/bubu_and_leo`. Este un joc HTML pentru doi frati de 6 si 8 ani, intr-un singur fisier, jucat pe un Mac in Chrome cu doua controllere DualShock 4.

Inainte sa schimbi ceva:

1. Citeste `CLAUDE.md`. Are regulile care nu se schimba si pasii de lucru.
2. Citeste `docs/00-cuprins.md`, apoi `docs/02-arhitectura.md`.
3. Citeste `docs/20-update-urmator.md`. Este specificatia acestui update.

Ce ai de facut: implementeaza update-ul descris in `docs/20-update-urmator.md`, sectiunile U1 pana la U6, in aceasta ordine. Pentru intrebarile deschise I1 pana la I6, foloseste recomandarea din tabel, daca nu am raspuns altfel mai jos.

Raspunsurile mele la intrebarile deschise (sterge ce nu e cazul):

- I1:
- I2:
- I3:
- I4:
- I5:
- I6:

Reguli de lucru:

- Modifici doar `src/`. Construiesti cu `./build.sh`. Regenerezi anexele cu `node tools/gen-docs.js`.
- Dupa fiecare sectiune (U1, U2...): ruleaza testele minime din `docs/17-testare.md` si testul sectiunii. Toate trebuie sa termine cu `errors 0`.
- Fa capturi de ecran dupa orice schimbare vizuala si uita-te la ele.
- Toate textele noi in romana si engleza, in `STR` din `src/015-lang.js`.
- Valorile noi de reglaj in `CONFIG` (`src/01-config.js`), cu comentariu.
- Muta descrierea fiecarei parti terminate din `docs/20-update-urmator.md` in capitolul potrivit. Adauga deciziile in `docs/16-decizii.md`.
- La final: un commit pe o ramura noua, un pull request in `alexandrafofel/bubu_and_leo`, si fisierul `game/bubu-si-leo-ouale-de-aur.html` trimis mie.
- Spune-mi la final ce nu ai putut verifica (controllere reale, cum suna, timpul real al copiilor).

---

## Daca vrei alte schimbari

Inlocuieste paragraful "Ce ai de facut" cu cererea ta. Pastreaza pasii "Inainte sa schimbi ceva" si "Reguli de lucru". Pentru schimbari mici (o viteza, un nume, o culoare), `docs/18-ghid-modificari.md` are retete gata facute.
