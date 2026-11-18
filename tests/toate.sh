#!/bin/bash
# Ruleaza toate testele, unul dupa altul, pentru ambele jocuri. Scrie o linie pe test: OK sau NEREUSIT.
# Folosire:  tests/toate.sh            (fara luptele lungi si fara capturi: cam 25 de minute)
#            tests/toate.sh tot        (si mini-lupte-bot.js, de doua ori cate 72 de lupte: inca 30 de minute)
# Iesirile fiecarui test si capturile de ecran raman in tests/out/ (dosar ignorat de git).
# Testele de sunet si de viteza se ruleaza singure: nu porni altceva pe calculator in acelasi timp.
cd "$(dirname "$0")"
mkdir -p out && cd out
bad=0
run() {   # run <game> <test> [args...]
  local g=$1 t=$2; shift 2
  local log="log-${t%.js}-$g.txt"
  STRICT=1 JOC=$g node ../$t "$@" > "$log" 2>&1      # STRICT: doar hud-acoperire.js il citeste (cere 0% acoperire)
  if grep -q "errors 0" "$log" && ! grep -q "NEREUSIT\|GRESIT\|PAGEERROR" "$log"; then echo "OK        $g  $t"; else echo "NEREUSIT  $g  $t   (vezi tests/out/$log)"; bad=$((bad+1)); fi
}
# the one test that is about both games at once
run ambele alege-jocul.js
for g in bubu lupta; do
  for t in sunete-personaje.js sunete-controller.js sunete-volum.js sunete-limita.js joc-complet-bot.js controller-simulat.js setari-ui.js tastatura-reala.js pauza-setari-engleza.js nivele-bot-mers.js \
           salvare-prieten.js inamici-mici.js cuib-amandoi.js capitole.js cuib-adapost.js mingi-leo.js ordine-nivel.js numara-elemente.js hud-acoperire.js \
           performanta.js performanta-lupta.js; do run $g $t; done
  if [ "$1" = "tot" ]; then run $g mini-lupte-bot.js; run $g capturi-ecran.js; fi
done
if [ $bad -eq 0 ]; then echo "TOATE TESTELE AU TRECUT"; else echo "$bad TESTE NEREUSITE"; fi
exit $bad
