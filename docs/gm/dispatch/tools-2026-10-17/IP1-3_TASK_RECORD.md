# Tools IP1–IP3 task record (2026-10-17)

Scope: phases IP1–IP3 of [the tools palette](../../../TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md#ip-implementation-plan-proposal-each-phase-is-playable-on-its-own),
under the [old save compatibility decision](../../../../PROJECT.md) (2026-10-17). Branch
`claude/tools-ip1-3-8c989c`. Rules applied: AR1–AR4, AR6–AR8, AR10, AR16, MR4, MR23 (shape only),
MR33 (relaxed by the save decision), UR1, UR41, UR43, AD22, AD36.

Target viewport 1920×1080, floor 1366×768. Visible outcome: tools wear from gathering, break, fall
back to improvised work, and can be repaired by hand at the Village forge. Deferred: IP4–IP9, a
separate tool-wear dial (MT3), moving coin repair out of `main.js` (MT4), mobile.

## What landed

| Piece | Where | Notes |
|---|---|---|
| IP1 instrument profiles | `src/tool_profiles.js` | Derived from each native Tool template (`equip_slot`, `base_bonus_skill_levels`), so gathering rates are the upstream rates. Adds hardness and precision (read by later phases only) and improvised fallback numbers. `gatherRates` mirrors `getActivityEfficiency`; the golden test pins it to the native method |
| IP1 tooltip | `src/display.js` (one helper) | Gathering tooltip adds `Tool: <name> · Chop +3 levels: speed ×1.27, yield ×1.15, precision 1, hardness 2 · condition N/100`, read from the `tools` projection |
| IP2 wear | `src/absorb_e2/durability.js` | `DURABILITY_PROPOSAL.wearPerUse` by verb (mine 1, chop 1, dig 0.8, cut 0.5, fish 0.4 per completed cycle), `wearUse`, `broken`, `setCondition`, and a max-condition cap hook used by coin repair too |
| IP2 break and fallback | `src/tools_domain.js` `gate` / `workCycle`; joins in `src/main.js` and `src/models/location.js` | Wear only when durability is on and the cycle completes. At 0 the routine stops with a log line. Starting again runs improvised: the broken tool's levels are removed, then speed and find chance are multiplied (axe: 50% speed, 60% chance). Improvised work does not wear the tool |
| IP3 hand repair | `src/tools_domain.js` `quoteRepair({kind, key})` / `executeRepair` / `cancelRepair` / tick; requirements in `src/tool_profiles.js` `REPAIR_REQUIREMENTS` and `REPAIR_BANDS` | Only `kind: 'hand'` exists. Quote (MR4, reads only) lists each input as met or short: skill and level (Forging; Woodworking for poles), station tag and tier at the current place, materials (Low quality iron / Iron / Steel ingot; Flax string for poles), plus minutes, success chance, expected restore and failure cost. Short inputs lower the band instead of refusing. Execute revalidates (AR7), spends what is on hand up to the need in the native rollback boundary and saves once. Bench time counts only while idle at that place; the job occupies the player through the shared occupation gate. Completion draws once from the craft stream; success restores part of the gap, failure keeps condition and lowers max condition (3, doubled without a station; floor 40). Cancel returns what was spent |
| Panel | `src/tools_panel.js` | Place-service panel `tools` (More panels → Tools), center dock with the shared bottom back bar. Lists carried and equipped tools with verb numbers and condition; the quote opens under its tool |
| Seam | `src/tools_domain.js` via `registerDomain` | One `configureToolsDomain({...})` statement plus the import in `main.js`; one import in `save_files.js`. Three registry calls in `main.js` (`gate` in `start_activity`, `workCycle` at cycle end, `occupation` in `nativeOccupationReason`) |

Save slice `tools` (schema 1): `instances[e2 key] = {max, repairs, failures}` and one `job`. Keys
are durability instance keys bound by `prepareEquip`; no second id scheme. Condition stays in
`equipment_durability`.

## Repair design constraints (coordinating session, 2026-10-17)

From the coordinating session ("Cursed tools across worlds"), relaying Weibao ("dont constrain, guide";
"nothing has to be limited"); rationale in the palette's rounds 3 to 5 on `codex/gameplay-foundations`:

- The repair command takes a `kind`. Only `hand` is built; coin repair stays separate in durability.
- Requirements come from a content table keyed by kind, then tool type (`REPAIR_REQUIREMENTS.hand.default`,
  `.fishing_pole`), not constants in the command. Later worlds add rows or kinds.
- Short skill, station or material gives a worse band (less restored, lower success, larger
  failure cost), never a refusal. There is no gate field. A row may carry `claim: {belief, basis}`,
  which makes the quote say "Nobody here knows how"; the Village has no such rows. An unknown kind
  reads "Nobody here knows a <kind> repair for this tool".
- Condition stays one scalar, treated as the tool's body. Typed or layered damage is a later phase.
- Remaining non-input stops: durability off, no instance yet, a repair already running, already at
  best condition, or the player busy.

## Dropped or changed for old saves

Nothing was dropped. Old saves have no `tools` slice and load with a fresh one. Tool templates keep
`use_quality = false` and their native keys; a tool gains an `e2.N` instance only when equipped with
durability on (existing behavior). Coin repair now restores to the tool's max condition, which is 100
unless a hand repair failed.

## Checks

| Command / journey | Input | Result |
|---|---|---|
| `node --test tests/tools_domain.test.js` | final tree | 4/4 pass: IP1 golden (17 tool templates, every tool-gathering activity, 4 skill levels, frozen pickaxe verb numbers), IP2 durability-off regression, IP3 quote consumes nothing (including short skill, station and material bands, unknown kind), IP3 execute/time/success/failure/cancel/save round trip |
| `node --test tests/absorb_e2.test.js` | this branch | pass (durability unchanged for combat) |
| `npm test` | this branch before the last panel edits | 2117 tests: 2114 pass, 0 fail, 3 todo |
| `npm test` | final tree | 2117 tests: 2114 pass, 0 fail, 3 todo |
| `npm run check:arch` | final tree | pass, no new cycles or `main.js` imports |
| `npm run check:rule-behavior` | final tree | 36 pass |
| `npm run check:rules` | final tree | 6 broken `USER_VISION.md` anchors, pre-existing (no docs touched before the check); not fixed here |
| `npm run build` | final tree | built |
| Browser, fresh origin `http://localhost:18247/?test_hooks=1`, 1920×1080 | rebuilt bundle; generated seed (Iron chopping axe, 2 Iron ingot, durability on; craftsman unlocked through his own dialogue) | Equip binds `e2.1`. Tooltip shows the verb line. 5 rounds: 100 → 95. Save + reload: 95, routine resumed. Worked to 0: log "Your Iron chopping axe breaks…", routine stopped. Restart: improvised log, 42 min and 37% vs 22 min and 59%, no further wear, wood still found. Tools panel quote: 40 restore, 55%, 60 min, 1 Iron ingot; nothing spent after quoting. Start: ingot 2 → 1, job saved durably. 60 min: condition 40, `repairs: 1`. Save + reload: 40 and slice kept. Export (`save_to_file`) → work to 37 → Import through `#saved_file_input`: 40 and slice restored |
| Browser, fresh origin `http://localhost:18248/?test_hooks=1`, 1366×768, after the repair-kind change | rebuilt bundle; seed with the axe at 30 and no ingots, Forging 0 | Quote lists "Short: Forging level 0 of 2", "Met: forging station tier 1 of 1 here", "Short: Iron ingot: 0 of 1", expected 20% success restoring about 8. Started with nothing spent; the roll failed: condition stayed 30, best condition 100 → 97. Save + reload kept 30/97 |
| Browser, first origin, 1366×768 | same save as the 1920 run | Tools panel fits with scroll; first run put the quote below the list, fixed so it opens under its tool; rechecked in view. Second repair started; gathering refused with the repair message; Cancel returned the ingot and saved |

Fixture note: the seed was edited in this test origin's storage to add the axe and ingots and to
enable durability. Woodcutting access came from the craftsman's native "learn" line. Time passed
through `advanceTicks` (test hooks).

## Gaps (implemented-unverified)

- Coin repair at a lowered cap is covered by a unit test only.
- Export/Import was exercised before the repair-kind change, not repeated after it (the slice gained
  `kind`, `spent`, `failureLoss` and `floor` on the job only).
- The last panel tweak (repair buttons disabled while a job runs) was rebuilt but not re-exercised in
  the browser.
- Other tool verbs (mine, cut, dig, fish) and the Woodworking pole repair are covered by profile and
  golden tests, not a browser journey. The only native mining spots are outside the Village.
- Repair job across Import mid-job: the slice validates and saves with a job (seen in storage), but
  Import was exercised with no job open.
- No visual-feel acceptance by Weibao; numbers are proposals (wear per verb, improvised rates,
  repair dials).
