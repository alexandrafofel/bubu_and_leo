#!/bin/sh
# The T13 audition page: the real game sounds (01-config.js, 03-audio.js) + the new voice (auditie.js). Not part of the game.
set -e
cd "$(dirname "$0")"
OUT=auditie-limba.html
cat head.html > $OUT
printf "'use strict';\n" >> $OUT
cat ../../src/01-config.js >> $OUT
printf "\nlet GAME = 'lupta';\n" >> $OUT
cat ../../src/03-audio.js auditie.js >> $OUT
printf '\n</script>\n</body>\n</html>\n' >> $OUT
sed -n '/<script>/,/<\/script>/p' $OUT | sed '1d;$d' > /tmp/aud-check.js && node --check /tmp/aud-check.js
echo "ok: $OUT"
