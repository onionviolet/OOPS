# Lane brief: D1, canon as constraints with conditioned keyed draws (LSD103-LSD125, LSD126-LSD143)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside P4 (P4 reserves
`src/main.js`). Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); design
[LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) sections 15-17 govern (proposal lines; Weibao's direction
"the canon run is forced unless external factors" is accepted). B1's be seat is committed (`e7b6f5851`, `bcb1514fd`);
its seam for you is `canonActionDecision` in `src/book_world_lotm_cast_host.js`. Rules: `.claude/rules/runtime-code.md`
(AR1-AR16), AD36, AD43, AD44, AD45 (modular, world-neutral), CLR1-CLR13. Target viewport 1920×1080 for any UI.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Canon facts available for the LOTM be seat now (pack beats, anchors, schedule rows, fight contracts) | 150+ | | yes |
| Facts with a time window (day plus band or minute range) | most | | yes |
| Existing draw call sites in the cast path and whether they use `unitDecision`/`streamSeed` or `nextOrdinal` (LSD139) | list | | yes |

## Scope and seam

- **Constraint store (LSD106, LSD125).** A world-neutral module (for example `src/constraint_store.js`) built from the
  pack's beats, anchors, schedule rows and contracts: actor, what, window, where, needs, produces, locator. Indexed by
  actor, window and needed state. One store for all actors (LSD127); the lead is not a special case (CL225).
- **Conditioned keyed draws (LSD107, LSD139).** A constrained roll draws only from outcomes consistent with the
  constraint, keyed by world, actor, date, subject and pack revision (`unitDecision`/`streamSeed`, never `nextOrdinal`);
  record the unconditioned probability as strain in a derived table (not saved).
- **Provenance (LSD108, LSD143).** Every write the cast path makes carries a short provenance code (`canon`,
  `canon-derived`, `fill`, `emergent`, `divergent`). Canon itself is never stored in the save; only deltas and codes.
- **Reservations (LSD109).** `canonActionDecision` asks the store: a free action that would consume something a later
  constraint needs is refused with an in-world reason naming what it is kept for, without spoilers (LSD116).
- **Run mode (LSD105).** Reads the life's `runMode`; `canon` locks; `weighted` and `open` stay reserved.
- **Pack revision in the save (LSD142).** Record the pack revision on the be life (additive field); on load from an
  older revision keep deltas and report contradicted fills (no rewrite). The existing LOTM state validator refuses
  unknown fields: extend it, with a test that older saves still load.
- **Files owned.** New world-neutral modules and their focused tests; `src/book_world_lotm_cast_host.js`,
  `src/book_world_lotm_host.js`, `src/book_world_lotm_state.js`, `src/book_world_lotm_lives.js`, the book pack under
  `private_packs/lotm-cast/` (adding a pack revision field); checkpoint `cast-lives-lanes/D1_CHECKPOINT.md`.
  `main.js` or other shared files: `D1_INTEGRATION.patch`.
- **Known limits (AD45).** Name what stays LOTM-specific and the expected lift at the second world (LSD141, MW3).

## Work and done check

- Tests (synthetic, name-free): the null-player canon run reproduces every canon fact in two byte-identical runs
  (LSD123); a free action that would spend a reserved amount is refused with a reason; a draw under a constraint never
  yields an inconsistent outcome over 1,000 keys; provenance codes appear on cast writes; an older-revision save loads.
- A second-world check (MW2): the store and draws run over a tiny synthetic second-world fixture with no LOTM import.
- `npm run check:arch` no growth; `node scripts/lane_review.mjs` with grants and paths. Chrome cannot start in the
  sandbox: the coordinator runs the browser floor and the L5r be replay after you report.
- **Stop conditions.** A canon fact cannot be expressed without a field the pack lacks: record it, continue with the rest.

Do not commit. Canon names and text stay in the pack only.
