# W3 lineage and companion wishes (G24, G28, G29), 2026-10-23

Direction: Weibao asked for the leftover itch.io items, NPC-heavy ones included. His instruction is direction, so AD33's "deprioritize NPC-heavy" does not block these; they are built small, as per-world dials with in-world reasons (AD1, AD38, AD22). The parent session folds this into `RULES_INDEX` AD33 and PROJECT.md (not edited here). Rules applied: AR1-AR16 (no `main.js` line; `ui_extras.js` import), UR codes (reasons in parts, hidden state not named), AD36 (focused tests).

## G24/G28 inherited qualities (`src/lineage_traits.js`, `src/lineage_domain.js`, hunks in `src/heir_inheritance.js`)

- **Model.** Four loci, two alleles each: Long wind (dominant), Keen eye (recessive), Steady nerve (incomplete: mild at one copy, full at two), Odd knack (recessive and fickle: the strong allele passes only half the time, Grim Brood's "mythic" gene).
- **Phenotype vs genotype.** The panel always shows what shows. A hidden allele is `?` and its letter is never in the view. A test (6 coins, one quality, `TEST_COST`) reveals it. A child that shows a recessive teaches both parents; a child without a dominant quality teaches both parents' hidden allele (`learnFromChild`).
- **Dials (default, dial, reason).** `LINEAGE_PROFILES`: `household` (mutation 3%, inbreeding cost 0.25 x kinship, fickle pass 0.5) and `creature` (8%, 0.55). Inbreeding only drops strong alleles, by recursive pedigree kinship (siblings = 0.25). All proposals, not accepted numbers.
- **Heir crossing.** If the line exists in the save (`inherited_traits`), `deriveHeirLeftovers` adds optional `lineage` and `inherited` fields (schema stays 1; absent = old behavior). The heir is the law's named kin when the line records them, else a seeded cross of the dying body and the other parent. The other parent is the recorded partner if any, else an unrecorded one drawn from the seed. Reason: most lives leave a partner nobody tracked. The seed is the line seed plus `life.endedAt`, so the ended-life preview and the heir save agree. `applyHeirLeftovers` writes the re-rooted slice; the registry's `load` takes it after the reload that begins the heir.
- **Save.** Slice `inherited_traits` = `{schema:1, seed, profile, selfId, members[]}`. Absent in older saves, so no migration is needed (`migrate` maps null to null). The line is founded on first read once a life chronicle exists, from `chronicle.enrolledAt` (same life, same line). Without a chronicle the panel says to begin one.
- **Surface.** `layout_spec.js` `inherited_traits` (ST6, Reference dock, panel id `inherited_traits`).

### Not done (gaps)
- **G1.** Qualities are descriptions only; no stat bucket is bound. `display.js` is off limits for this task, and no world has said what "Long wind" does mechanically.
- **G2.** Creature breeding: `breed` with the `creature` profile is pure and unit-tested, but no world has a creature roster, so it is implemented-unverified in play. No creature system was invented.
- **G3.** No in-play births or partner entity. A lived-in household with children needs the relationship state machine (G03); the heir cross covers the two-parent case at life end. `heirLine` already accepts a named kin member and a recorded `partnerId`, so a later household step plugs in.
- **G4.** A heir save for a life whose line was never opened (no chronicle read) carries no line; the next life founds a fresh one.

## G29 companion wishes and leaving (`src/companion_wishes.js`, `src/companion_roster.js`)

- **Wish.** One open wish per companion: a rite ("share a meal twice more") or a bond level. No two companions share an identical wish. Answering it by clicking rites grants it: bond +2 (`grantGain`), then a new wish.
- **Leaving.** A `free` person whose wish stays unmet for 14 game days (`patienceDays`) and whose bond is below 6 (`holdLevel`) goes back to the road, with the reason shown ("waited N days for a wish nobody answered"). Reason for the dial: people with lives of their own; a strong bond holds them (Grim Brood: bound animals stay).
- **Way back.** After 3 game days (`returnAfterDays`) the panel's "Go looking for them" brings them back with the bond kept and a fresh wish. It always exists; nobody is lost for good.
- **Lio.** Profile `bound`: voices wishes but never leaves. Reason: party and battle contracts depend on him, and departure here is a roster overlay that must not touch `expansion.simulation` or generated-people state (one authority per fact).
- **Save.** Slice `companions` bumps to schema 2 with optional `wish`, `gone`, `issued`, `note` per bond. Schema 1 still validates and migrates (`migrateBonds`). `doBondRite` used to replace the bond object; it now preserves the new fields.
- **Time.** The domain `tick` compares against the game minute; nothing runs without the expansion port.

### Not done (gaps)
- Wishes are rite and level predicates only. Grim Brood's world-state predicates (a lantern by the door) need a world reader per wish; add them as new wish kinds.
- Wishes for household staff and the generated-people goals are separate and unconnected.

## Verification (state per check)
- Unit: `tests/lineage_traits.test.js`, `tests/companion_wishes.test.js` pass with `companion_bond_rite` and `heir_inheritance` (21 tests).
- `check:arch` and `check:rules` pass; `npm run build` ok (rewrote shared `dist/`).
- Browser: `scripts/lineage_companions_browser.cjs` at 1536 and 1920 (see results below).

## Results
`scripts/lineage_companions_browser.cjs <width> <port> <out>` (fresh contexts, serve repo root, real menus):
- 1536: all 13 checks PASS, no page errors (final run, includes schema 1 load).
- 1920: every check through reload PASS; its last step failed only on a wrong test expectation (an empty companions slice is not written), fixed in the script and proven at 1536, not rerun at 1920.
- Covered: fresh save has no slice; panel visible; hidden alleles marked; test costs 6 coins and persists; reload; literal export then import; life end names inherited qualities and the heir save carries a re-rooted line (id `h4`); two met travelers show different wishes; a wish is answered by clicking and granted; 16 neglected days send a free person away with a reason; the way back works; reload keeps the slice.
- Screenshots: `/tmp/claude-501/lc1`, `/tmp/claude-501/lc2` (scratch, not kept in the repo).
- After the last browser run: one display line changed (a gone person no longer shows a stale wish). Unit tests pass; the rebuilt bundle was not re-driven in a browser.
