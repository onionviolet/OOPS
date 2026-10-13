#!/bin/sh
# Sends harness/steps/_prelude.js + the named step to the running repl.mjs.
here=$(dirname "$0")
cat "$here/steps/_prelude.js" "$here/steps/$1.js" | curl -s --data-binary @- http://127.0.0.1:19161/
