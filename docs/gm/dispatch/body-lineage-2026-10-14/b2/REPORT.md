# B2 return, 2026-10-14

Delivered a documentation-only implementation spec for G24/G25.1 plus the
requested eight quirk variants. All new mechanics and numbers remain proposals.
No runtime, shared design owner, build, save or git staging/commit was changed.

Files: [source audit](AUDIT.md), [specification](SPEC.md),
[migration](MIGRATION.md), [test plan](TEST_PLAN.md),
[resume checkpoint](CHECKPOINT.md).

## Findings

| Code | Finding | Impact |
|---|---|---|
| F1 | One old gender value drives biography and one executable address branch; no pronoun resolver found | Split SG1/SG3/SG5 without guessing sex or pronouns. Preserve ambiguous's existing nonmale honorific |
| F2 | Race/height methods exist but accumulate; config disables them; startup and probe call separately | Use one idempotent world-profile resolver with neutral migrated profiles and explicit fresh creation application |
| F3 | Existing body progression, anatomy and possession already have owners | New optional native record coexists with those; it must not overwrite host/control/custody or auto-enroll a character |
| F4 | Native sleep, food, combat and crafting consumers exist; stealth has a paid pursuit conceal action | Eight optional LQ variants touch concrete consumers, without inventing a generic stealth meter |
| F5 | Bio serialization and loading enumerate only existing fields; native age spelling differs from address comparison | Explicit save/load integration and exact raw-label migration are essential. Codec roundtrip alone cannot prove them |

Detailed file:line evidence and full legacy address matrix are in AUDIT.

## Recommendations ranked by implementation size

Size is a relative estimate, not a schedule. Rank runs smallest to largest;
dependencies determine execution order. Each code slice needs a playable checkpoint.

| Rank/code | Size | Proposed slice | Dependencies and finite acceptance |
|---|---|---|---|
| 1 / A1 | S | Split identity/address projection and exact old honorific adapter | Build atop A2 record owner; legacy matrix, miller dialogue, existing bio view purity. Standalone adapter can be prepared first |
| 2 / A2 | M | Optional body_record schema, validation, neutral migration and explicit serialization | First integrated implementation base. Generated legacy/current Save/reload/export/literal Import; unchanged old gameplay; no implicit simulation enrollment |
| 3 / A3 | M | World profile and race/height replacement buckets | A2; short cat gentle example and unchanged legacy comparator in actual rebuilt native stats, same profile after import |
| 4 / A4 | M | Existing biography summary/details and resolved creation/tooltips | A1–A3; 1366x768 rebuilt proof, saved layouts, keyboard/zoom and hidden-state inspection |
| 5 / A5 | L | Quirk query plus native sleep/food/combat/craft and pursuit cost adapters | A2/A3; deliver connected small increments within this slice, preserve native transactions, prove actual consumers and persistence, then optional richer physique cards |

A2 plus A1 is the safe first playable unit. A3 plus A4 is the smallest complete
G25.1 demonstration. A5 is larger than its small numeric effects imply because
it joins five real action families and their preview/commit boundaries. The two
LQ3 variants are alternatives, giving eight examples across seven palette codes.
No generic genetics engine or treatment economy is needed for that proof.

## Checks and open gates

Documentation QA covers local links, requested topic coverage, exact source
locators, JSON example validity, formula arithmetic, no em dashes and permitted
write scope. See CHECKPOINT for final results. Source files were read, not run.
No npm, test runner, build, browser UI, runtime save/reload/export/import,
performance benchmark or private-save check was performed. The save-size values
are proposed targets with an illustrative record measurement, not observed
full-envelope gameplay measurements.

| Gate | Status |
|---|---|
| Docs content, source references and local structural QA | Complete; evidence in CHECKPOINT |
| Actual migration and native stat/address compatibility | OPEN, implementation required |
| Rebuilt 1366x768 UI/action consumers | OPEN, implementation required |
| Actual Save/reload/Export/literal-file Import and failure recovery | OPEN, implementation required |
| Director fiction, balance and layout acceptance | OPEN, human-only |

Deferred: heredity/prestige selection (B3), active GN simulation, reproduction,
aging/decline, full SG social laws, treatment content, broad nonhuman/possessed
body adapters, additional world profiles and mobile optimization. Empty GN or
constitution records imply no accepted biological limit. No sealed truth was
included and no external canon research was needed for this source-local spec.
Root integration into genetics/IDEA_INDEX remains with the dispatch owner; B2
writes only its lane and grants no runtime implementation authority.


## Current-use reconciliation B110, 2026-11-04

B2 F1–F5 source tables are bounded October 14 observations, not current whole-tree absence claims. Preserve separate four-field bio serialization versus added-body record, identity/address versus anatomy, disabled additive race/height data versus replaced owned buckets, actual native combat/pursuit/craft versus similarly named helper hosts, parked versus controlled body and codec versus real-loader proof. Current public start picker is deferred (B94), so its creation-route suggestions are not an active UI assignment. B8’s later parent-chain correction routes Body & recovery to Notebook → Practice, superseding B2’s old Local actions instruction. No currently missing pronoun/body/stealth subsystem is concluded from old term searches alone.

B2 A1–A5 rank implementation size and dependencies, not product priority. A1 identity/address projection and A2 optional record could form a small selected unit; A3/A4 world effects/UI and A5 five-family quirks are distinct larger joins. This does not require full genetics, treatment economy, migration of every old save, a public start menu or all-body support. Detailed GHS B94/B95 and actual future consumer govern; all proposed test/native gates remain NOT RUN unless exact later evidence is found. Optional human taste feedback is not a hard execution blocker.
