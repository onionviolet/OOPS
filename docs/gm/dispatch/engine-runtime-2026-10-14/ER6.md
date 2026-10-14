Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER6: libraries to incorporate. Output
docs/research/LIBRARIES_TO_INCORPORATE_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER6/REPORT.md.

For root palette LB1-LB11 plus anything better you find: check current
npm/GitHub data (version, last release, license, minified+gzip size,
ESM support, maintenance) with URLs and date checked. Candidates include
bitECS, miniplex, Koota, sqlite-wasm (official), Immer, @preact/signals-core,
Zod/Valibot/TypeBox, Yuka, rot.js, ngraph.path, pure-rand, simplex-noise,
tracery, Howler, PixiJS, break_infinity/decimal.js (link ER3 if covered).
For each: which existing file/system it would serve (READ file:line), adapter
boundary, save compatibility impact, smallest first step, and a reason not
to adopt. Note license compatibility with this repo's LICENSE. Rank top 5.
