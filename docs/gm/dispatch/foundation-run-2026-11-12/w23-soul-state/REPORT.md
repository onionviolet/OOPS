# W23-S soul-state law, proposal (agent-verified, 2026-11-24)

## Census and decision

There are 1,234 `blocked:soul-state` rows in 129 ledgers. The wave counted 811 labelled rows; 560 row notes contain a parseable `Effect verb.object/target/time` sentence (30 of those omit time). Those parseable sentences contain 98 distinct verb.object pairs, 8 targets and 7 time values including missing. The four direct soul verbs selected here occur 119 times: `bind.soul` 47, `transform.soul` 40, `move.soul` 21, `release.soul` 11. Many other rows mention a soul as context while their labelled effect acts on form, position, mind or vitality. A `soul-state` blocker therefore mixes mechanisms.

**Default (AD56 proposal):** a soul is a distinct W holder, with its own place, form and a body-bond mark. A sentence to move, bind, release or transform the soul becomes a stored working on its actor and lands through W's existing `position`, `relation` and `form` effects. The body and soul retain separate identity. Time changes the trigger: touch now, an authored clock for delayed, or an authored word for triggered. The effect result persists. A sustained label stays blocked because upkeep and release are not modelled. The law adds no save slice; the engine world and stored record already serialize.

Fields that change play: the soul verb, the soul target, and its time. The case uses one named soul, so line, cone, area and marked targeting stay blocked pending a selection/geometry owner. Other values are dials: the initial and changed soul form (`unshaped` and `shaped`), body-bond mark (`body:person`), destination (`far`), delay (60 world minutes) and trigger word (`release`). **Source for each dial: design**, used to make the engine case observable; no source-world number or form is claimed. A world pack must supply its own values and costs. The single carrier is a person, and the stored working handles the clock and save.

Rejected designs: (1) one `soul` quantity would collapse identity, custody and departure into a score; (2) treating every row that says “spirit” as a soul effect would take unrelated mind, vitality and resurrection cases; (3) using `energy:spirituality` as soul health would equate LOTM's spendable pool with its spirit body. These remain separate under AD38.

## Dry run and remaining blockers

`node scripts/soul_state_ledgers.mjs` was read only. It evaluated all 1,234 blocked rows, including ledgers with their own rebuild owners, and ran each candidate through `runCase`. It would take **79/1,234 (6.4%)** overall and **26/273 (9.5%)** in the held-out fifth (`isTest` from `law_defaults.mjs`). The 25% PWC60 floor is **not met**. Keep this as an engine proposal and **do not run `--write`**. Even the 119 selected verb labels do not all take because some have unsupported targeting or time.

Top reasons: 674 have no parseable effect sentence; 383 state a sentence about another object; 13 `sense.soul` need a perception/knowledge owner; 13 area targets need geometry; 12 each `add.soul`, `alter.soul` and `remove.soul` need creation, alteration or ending semantics; 7 marked targets need selection; 7 omit time; 7 sustained changes need upkeep and release. Proposed sharper blocker slugs for a later label pass: `soul-perception`, `soul-creation-end`, `soul-upkeep`, `soul-area-target`, and `soul-context-only`. No slug or ledger was rewritten here.

## First consumers and player shape

The current Gu aperture in `src/gu_aperture.js` tracks essence and body-space capacity, not Fang Yuan's soul foundation. `src/gu_keeper_spirit.js` has a `spiritHealth.soul` reserve for the Fighting Spirit trial; `applyKeeperSpiritEffect` changes that reserve and `keeperSpiritView` reads it. A Gu soul-foundation pack should first create a soul holder and use this law for bond, transformation or departure at that effect boundary, then show the current bond/form and action cost in a life-panel row with a result line. Soul-foundation strength still needs its own source-grounded account; this law does not invent a numeric conversion from the trial's soul reserve.

For LOTM, `src/book_world_lotm_host.js:lotmMeters` shows `energy:spirituality` as a spendable pool, and `src/book_world_lotm_mind.js:lotmMindView` shows mental effects. The future spirit-body consumer would join through the LOTM host's `readView` and display the spirit body's place or bond in a separate detail/result line, keeping the spirituality cost beside its action. No consumer file was changed. This is engine-ready evidence, not a played tie-in or browser acceptance.

## Files and checks

- `src/soul_state_law.js`: case factory, dials, sentence gate and W-effect translation.
- `tests/soul_state_law.test.js`: runner cases for four verbs and four times, near misses, a still-blocked ledger row and save/restore in every case.
- `scripts/soul_state_ledgers.mjs`: default dry run, optional coordinator-only `--write` mode. Ledgers with their own rebuild owner are counted in dry-run; write mode leaves those files alone.
- This report. No shared file, consumer or ledger was edited.

| Command | Result |
| --- | --- |
| `node --test tests/soul_state_law.test.js` | Exit 0, 18 passed |
| `node --test tests/case_runner*.test.js tests/*_law.test.js` | Exit 0, 93 passed |
| `node scripts/soul_state_ledgers.mjs` | Exit 0, 79/1,234 all, 26/273 held out |
| `npm run -s check:arch` | Exit 0; grandfathered 6 main imports and 205 cyclic edges |
| `npm run -s check:rules` | Exit 1: two new raw-duration failures in concurrent `src/world_packs/book_gu_keeper_lotus_route.js:58-59`, outside this lane |
| `npm run -s check:docs` | Exit 0, no new doc-slip hits |

The authoritative completion gate is PWC60's 25% held-out floor followed by coordinator ledger write, full local verification, and a rebuilt browser consumer with save/reload/export/import for gameplay. None of those later gates is claimed.
