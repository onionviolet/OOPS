#!/bin/sh
# UIC143: build dist/bundle.js from HEAD plus only the paths you name, so a commit from the shared
# checkout does not carry another session's unfinished edits in its bundle.
#   sh scripts/clean_bundle.sh src/a.js styles/b.css
# Then commit those paths with dist/bundle.js, dist/bundle.js.map and index.html.
# Stops at the first failure and leaves dist/ untouched unless the build succeeded.
set -eu
root=$(git rev-parse --show-toplevel)
cd "$root"
tree=$(mktemp -d "${TMPDIR:-/tmp}/yairpg-clean.XXXXXX")
trap 'rm -rf "$tree"' EXIT
git archive HEAD | tar -x -C "$tree"
for path in "$@"; do
    mkdir -p "$tree/$(dirname "$path")"
    cp "$path" "$tree/$path"
done
ln -s "$root/node_modules" "$tree/node_modules"
(cd "$tree" && node build.js >/dev/null)
cp "$tree/dist/bundle.js" "$tree/dist/bundle.js.map" dist/
cp "$tree/index.html" index.html
cmp "$tree/dist/bundle.js" dist/bundle.js
echo "clean bundle from $(git rev-parse --short HEAD) plus $# path(s)"
