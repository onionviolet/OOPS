# L4c brief: private pack, travel to cast places, beside entry, and the floor

Model: `gpt-6.1-sol`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Do not
commit; the coordinating session commits once the tracked tree carries no canon names from this work.
Never stash, reset, force or push. Rules: `.claude/rules/runtime-code.md`, AR1-AR16, AD1, AD36, AD43,
WER, UR rules (`.claude/rules/player-ui.md`), target 1920×1080 desktop.

## Where things stand

L4a's work is in the working tree, uncommitted, owned by this lane now: `src/book_world_lotm_cast_days.js`,
`src/book_world_lotm_cast_host.js`, `tests/lotm_cast_week.test.js`, and hunks in
`src/book_world_lotm_lives.js`, `src/book_world_lotm_content.js`, `src/book_world_lotm_host.js`. Also
uncommitted: L6b's `src/book_world_mol_cast.js` and `tests/book_world_mol_cast.test.js`. Read
[L4A_CHECKPOINT](L4A_CHECKPOINT.md) (its R1 list is items 2 and 3 below) and
[L3M brief](L3M_PRIVATE_PACK_BRIEF.md) (item 1 below).

## Work, in this order

1. **Private pack (the whole L3m brief).** Canon data (people, names, relations, beats, place labels, day
   bindings, the beside blurb and situation label) moves to `private_packs/lotm-cast/` and
   `private_packs/mol-cast/`; `src/` keeps name-free bridges and the host logic; the beside start and its
   texts come from the pack and are hidden when it is absent. Tests use synthetic fixtures with invented
   names. `scripts/check_private_cast.mjs` checks the real packs or skips.
2. **Travel to cast places, beside only.** The cast's concrete Tingen places (from the pack) become
   reachable through the same timed walk the host already offers (`LOTM_MOVE_LABELS`, `move()`), with
   travel minutes from the district links and a stated same-district default, registered as native
   locations so the envelope validates. Do not fold a cast place into an existing original place. The
   four original starts keep their exact move lists.
3. **Beside entry answers.** `entryAnswers()` gives the fifth start an ordinary resident's answers: no
   church probation, no reporting duty, lodging near the household, a local purse, money left behind as
   now (WER9). Keep the other four profiles' answers byte-identical (test it).
4. **The floor (AD43).** From a fresh life: Village to the beside start, walk to two cast places at two
   times, talk to one present principal, get the away reason from another; rebuild, then in a fresh
   browser origin at 1920×1080 take screenshots of the start choice, a present talk and an away refusal,
   and exercise Save, reload, Export and Import (literal clicks). Name the bundle hash.

## Done check

- Focused tests pass (`tests/lotm_cast_week.test.js` rewritten on synthetic fixtures, the MoL test likewise).
- `node scripts/check_private_cast.mjs` passes with packs and prints skipped without them (prove both).
- `git grep -i` over tracked `src/` and `tests/` for the principals' canon names from this work returns
  nothing; `grep -c` of those names in the rebuilt bundle returns 0.
- `npm run build`, `npm run check:arch` (no growth), `npm run check:rules`; one line per check in
  `cast-lives-lanes/L4C_CHECKPOINT.md`, with FLR1-FLR6 each stated.

## Stop and report if

The private-pack route cannot carry supplementary (non-world) data without a core change to
`src/content_packs.js` beyond a small loader, or travel needs a change to native location validation
outside the LOTM files.
