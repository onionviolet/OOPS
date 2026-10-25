# S1 decision (lane B): Corpse Collector Sequence 9 brewing

Status: agent proposal, not an accepted decision. Written to the lane's own file, not the shared IMPLEMENTATION_DESIGN.md (coordinator
instruction). Honest note: the first draft of the code was written before this file; the decision below is the one the code implements
(design section 2.4 already proposed it).

## Decision

Brewing is a second route to the same allocated state. `brew_collect_cc` sets `book.lotm.cc.allocated` and mints the same
`corpseDose` item that `accept_allocation_cc` mints, so `pathwayDoses` (`own(base)===(allocated&&!ingested?1:0)`), `ingest_cc`, the acts,
the assessment and the Gravedigger promotion run unchanged. No new fact is needed by the dose assertion; it is not edited.

## Rules that keep one pathway per life

- Brew start requires `lotm.pathChosen` false and `lotm.block.corpse.switching` false. `lotmFacts` now counts `cc.brew.started` as a
  chosen/allocated pathway, so every accept command (all require `pathChosen` false) and every other pathway's `other.*.allocated` block
  close the moment a brew stands. Command definitions are untouched (golden test).
- State assertions (`brewAssertions`): a brew needs its formula, a reported probationer and no other pathway chosen; a bottled dose needs
  its brew and records `allocated`; a brew in progress holds no dose and no ingestion.
- Brewing is therefore open only to a probationer with no pathway yet. A player already allocated or ingested cannot brew a second dose
  (the issued one is already the held dose); the `Corpse Collector track` case is covered by the same fact once brewing has started.

## Save compatibility

`LOTM_SOURCE_HASH` is a literal constant in `book_world_lotm_ids.js`, fed by nothing else, so it is unchanged; `definitionRevision` stays 1.
State is facts (`cc.formula`, `cc.brew.started`, `cc.brew.collected`) plus the `.at` of knowledge note `book.lotm.brew.cc.started`; no new
`state.lotm` field. Existing commands stay byte-identical (`tests/lotm_commands_golden.test.js`). Old saves hold none of the new flags, so every
new assertion is vacuous for them.

## Conservation

The frog is a cost of `brew_start_cc` (consumed once). The envelope adds `frog held + broker frog + reserved + (brew started ? 1 : 0) <= 1`
for the single stocked frog. The dose is minted at collect exactly as acceptance mints it, never both (collect requires no `allocated`).

## Proposals labelled as such

Formula price 5 pounds (canon 230; scaled to a clerk's purse), sold by Hale; 120 played minutes; Hale's attention 1 at start and Hale present
at collect; frog is the only input (no auxiliaries: the broker stocks one frog, and an ink barter would consume it). Inputs are role slots in
`CC_BREW.slots` with `select:{material}` as in `src/craft_recipes.js`; only the exact key resolves now.
