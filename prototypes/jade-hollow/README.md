# Retired Jade Hollow prototype

Archived 2026-10-01 at the user's request to restart expansion from the YAIRPG foundation. These files are reference material and are not imported by the live game. Preserve upstream LICENSE and attribution when revisiting them.

The directory contains the rules, native content registration, UI, CSS, tests and previous main/CSS integration diff. Local imports were adjusted after relocation. Run reference rules checks with `node --test prototypes/jade-hollow/*.test.js`. The integration patch is historical reference, not a safe automatic restore patch for future versions.

Prototype history and earlier browser checks are in `docs/PROTOTYPE_HISTORY.md` and `docs/PLAYTEST.md`. Current saves preserve removed data through `src/save_compatibility.js` in `retired_content`. That module does not restore the prototype. Future restoration needs an explicit migration and conflict policy for active progress made since retirement. Do not apply historical snapshots over user saves.
