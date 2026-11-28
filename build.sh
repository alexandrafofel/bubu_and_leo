#!/bin/bash
# Builds the single playable file game/bubu-si-leo-ouale-de-aur.html from the files in src/.
# The order of FILES matters: every file may only use names defined in the files before it
# (or inside functions that run later). See docs/02-arhitectura.md.
set -e
cd "$(dirname "$0")"
OUT=game/bubu-si-leo-ouale-de-aur.html
FILES="src/01-config.js src/015-lang.js src/016-art-data.js src/017-voci-data.js src/018-intro-voci.js src/02-core.js src/03-audio.js src/04-input.js src/05-chars.js src/055-lupta.js src/06-level.js src/065-mech.js src/07-play.js src/075-duel.js src/08-draw.js src/09-screens.js src/10-main.js"
mkdir -p game tests/tmp
cat src/00-head.html > $OUT
for f in $FILES; do cat "$f" >> $OUT; done
printf '\n</script>\n</body>\n</html>\n' >> $OUT
# syntax check: the same code as one plain script
cat $FILES > tests/tmp/all.js
node --check tests/tmp/all.js
wc -c $OUT | awk '{print "built", $1, "bytes"}'
