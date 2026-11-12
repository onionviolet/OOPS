# Creature lifecycle foundation

```receipt
build: 635eb263ddc7f015f4e2cb9b0e3df8624699f09625f01484cbb2205d646ae0a0
route: fixture(fresh Village meadow and copse, owned Shack for pet)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 81 focused tests, build, architecture, rules, frozen MCP and rebuilt Chromium
review: none
surface: agent-verified Village meadow, copse and owned-Shack pet on this bundle
```

Active goal, November 11, 2026. Read-only inspection at b92e1e87f with shared edits present. Existing proposal references are read in place. This lane owns `src/creature_lifecycle.js`, `tests/creature_lifecycle.test.js` and this checkpoint. No shared reserve used. Follow AR1–AR16, AD6–AD8, AD38, AD43, AD49, AD51, AD52, CX1–CX5 and WPR30. See [architecture](../../../ARCHITECTURE_RULES.md) and [existing seams](../../../AREA_GUIDE.md#care-and-upkeep-of-living-things).

## Read-only seam map

| Existing owner | Fit and gap |
| --- | --- |
| `absorb_p23/household/model.js` | Moss has a persistent household identity, interaction history, bond, self-fed diet and an adopted state. Keep the household and hearth here. A portable individual needs habitat and custody independent of the hearth. |
| `habitat_care.js`, `native_resources_domain.js` | Village pen owns shelter, acquisition cost, one sheep and finite hay/attention receipts with a wool consumer. Preserve the legacy save and its wool economics when adapting it. |
| `needs.js`, `living_upkeep.js` | Shared need reader and upkeep predictions. A lifecycle should consume body/diet and supplied care facts at this boundary. |
| `creature_layers.js`, `companion_roster.js` | Removable layers and authored bond rites are separate from inherited traits. Preserve learned history on the individual and decide who each bond refers to. Static wiring of the roster remains unproven. |
| `book_world_paradise_ecology.js`, `world_pack_population.js` | Paradise nursery owns plant care and native source yields. World-pack population generates addressed actors and edges under a draw budget. Neither owns finite animal cohorts. Gu emergence, unique Immortal Gu and refinement belong to the Gu lane. |

## Source cases and falsifiable tests

| Case | Basis and predicted test |
| --- | --- |
| Pet | Moss household runtime shows earned adoption through interactions and a self-feeding cat. Promote one local animal, carry its stable ID across a custody change, and verify the first keeper's learned bond survives without becoming the new keeper's bond. |
| Livestock | [Stardew care digest](../../../research/stardew-valley/ANIMAL_CARE_DIGEST.md) shows separate growth, care and product data. Village sheep is the existing real consumer. A young lamb cannot yield wool at purchase, and one batch consumes the same paid inputs after elapsed-time partition and reload. Offspring inherits declared parental variation while training starts fresh. |
| Gu-adjacent habitat | [Held-source synthesis](../../../research/OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md) cites RI ch. 826 habitat tradeoffs and a planned grass/rabbit/fox chain. Keep stock and feed separate. With rabbit stock removed, the same parcel fails the fox support test. Treat YAIR quantities and rates as fixture dials. |
| Interrupted care | Original control. Settle injury and a finite supported recovery interval; moving away or losing supplies cuts the interval at the actual boundary. Rehydration during recovery preserves elapsed work and the pending outcome. |
| Acquisition and transfer | Original controls. Exhaust a cohort or fill a destination, and attempt the same acquisition twice against updated state. Reject without consuming a second animal or altering the original. Release or transfer must keep the individual attached to one actual place. |

Foundation choice: materialize individuals from bounded cohort stock only on acquisition. This preserves explicit identity for a pet and finite counts for habitat stock without preallocating every animal. A pre-generated roster pays for unused detail. An event-only simulation would need additional reconstruction for each live identity and disposition. Start with stock conservation and identity/custody settlement; add biological and interaction history on the same record after contrasting fixtures pass.

Desktop proof target when wiring begins: 1920×1080, with visible acquisition cost, changed animal state, blocked actions and a usable outcome. Mobile deferred per standing direction. Build and fixture/MCP route, browser use and save/reload/export/import are open under FLR1–FLR6.

## Adjacent proceduralization recommendations

| Rank | Scenario | Existing owner and state boundary | Falsifiable proof |
| --- | --- | --- | --- |
| 1. Research/discovery | Klein compares two independent consultation clues; a second student repeats a lesson with a different method. | `inquiry.js` owns work, simulation knowledge owns what each learner can conclude. | Corroboration improves one conclusion. Duplicate evidence and another actor's private clue do not. Both routes consume the same evidence contract. |
| 2. Social memory | A bystander recalls a witnessed theft when questioned; a former client recalls paid help. | `person_memory.js`, `crowd_memory.js`. Witnessed event and observer interpretation have separate authority. | Only observers with access report the event, and an unobserved repetition yields no new witness. Both enforcement and conversation read the recollection. |
| 3. Relationships | An ally helps during a shift; a former ally honors a debt after friendship sours. | Relationship projection and simulation ties; relationship facts belong to the two actual people, standing and obligation remain separate. | Hold debt fixed while changing personal regard and observe diverging work help and debt settlement outcomes. |
| 4. Livelihoods/economy | Earn a shift in a workshop, then deliver contracted farm stock during scarcity. | `livelihoods.js`, `livelihood_sources.js`, employer/market inventory. Offer and obligations persist across time; money and stock settle in existing owners. | Both consumers settle once. When stock or permission disappears before settlement, the quote cannot create goods or wages. |
| 5. Ecology/events | A depleted meadow recovers while a predator nursery loses support; an unrelated regional event comes due on its own clock. | Habitat/cohort owner and `life_events.js`; local ecology quantities and world event identity stay independent. | Equivalent elapsed-time partitions and a midstream reload yield the same outcomes. A habitat change affects its cohort without duplicating the regional event. |

These are recommendations with proposed controls. Implementation scope here is the creature lifecycle. Candidate proofs still await implementation by their owners.

## First foundation evidence

- Input: b92e1e87f plus the shared tree and this lane's new leaf files. Zero composition-root lines or imports added to existing runtime files. No registration or new cycle.
- Implemented below floor: `creature_lifecycle@1` restores a plain JSON state; finite local stock becomes a named individual at acquisition. Capacity counts both forms. Host passes habitat support and authority; lifecycle checks expected keeper, rejects a stale revision, and retains identity through transfer and release. It has no direct clock or randomness. Each operation scans at most the supplied host slice's cohorts and individuals; bound loaded parcel sizes before runtime wiring.
- `node --test tests/creature_lifecycle.test.js tests/habitat_care.test.js tests/creature_layers.test.js tests/companion_bond_rite.test.js tests/paradise_ecology.test.js`: 26 pass. The three new synthetic cases exercise cat custody/JSON rehydration, finite sheep acquisition/capacity, and habitat support/capacity for fox and rabbit cohorts. The fox fixture supplies support explicitly; it does not derive feeding from prey.
- `npm run check:arch`: pass, unchanged main/display/save-file baselines. Four checkpoint link targets resolve.
- Next: add inherited variation and keeper-scoped acquired history, with sheep offspring and cat transfer as controls. Then settle growth, injuries, finite care and recovery across equivalent time partitions, and implement prey-dependent cohort support. Keep local economic costs and body/diet truth in their existing owners. After contrast tests pass, wire existing pet and sheep routes with legacy-save migration, then rebuild and prove visible outcomes, save/reload/export/import and failure paths. Full goal remains active.
- Whitespace: all three lane files pass. The checkout-wide `git diff --check` flags unrelated, already-modified `dist/bundle.js`. No edits to that bundle from this lane.

## Inheritance, development and habitat support

- Progress from the prior turn was verified in the worktree. This turn added keeper-scoped learned responses and bonds, pending broods with addressed inheritance, birth settlement and juvenile maturation. The first parent is the carrier and its current custody and habitat determine placement. The local host supplies reproductive compatibility and timing. If settlement cannot place the young, the brood remains pending and growth starts at the eventual settled birth. Trait inheritance is a categorical fixture rule, with at most one addressed draw per shared trait. Missing development fields in the earlier experimental slice restore to an adult with empty traits and experience.
- The marsh fixture now derives entry and stock-addition support from prey actually present in the same habitat. Existing predator stock survives prey removal in the saved state. Its subsequent ecological consequences still need a time-based settlement rule. Prey ratios and durations are original dials.
- `node --test tests/creature_lifecycle.test.js tests/habitat_care.test.js tests/creature_layers.test.js tests/companion_bond_rite.test.js tests/paradise_ecology.test.js`: 28 pass. Cat transfer preserves earlier experience and starts a fresh relationship with the next keeper. Sheep capacity rejection retains a pending brood after JSON restore, then one birth settles and yields a juvenile with inherited traits and empty training. Removing the rabbits blocks adding foxes after JSON restore.
- `npm run check:arch`: pass. Source SHA-256 `5546bd1545b698e93f6286c97e64a8fdd4513b7fc16be7f4e3ac691d5fbe5552`; focused test SHA-256 `d1fba35e42d8ad56182902e866f3b1fe296e63323ec47aba6f9617dc5df50426`. Existing owners, shared reserve and other lanes untouched.
- Next: finite care and injury/recovery with a clock-partition and transfer interruption proof. Then wire contrasting consumers and verify native save migration, actual actions and desktop acceptance. Current state remains implemented below floor.

## Finite care and recovery

- Prior turn was progress. Current leaf adds lazy, monotone recovery settlement. One active injury per individual is the current model. A finite care interval grants one minute of recovery per supported minute and retains the exact completion time. The host supplies the authorized care duration, checked supplies and shelter. Changing keeper or habitat settles through the transfer minute and closes that interval. A host can also close it explicitly when shelter or supplies fail.
- Sheep control proves expiry, equal recovery across elapsed-time partitions, JSON reload and no duplicate active care interval. Cat control proves interrupted treatment retains only earned recovery, with authority passing to the current keeper.
- `node --test tests/creature_lifecycle.test.js tests/habitat_care.test.js tests/creature_layers.test.js tests/companion_bond_rite.test.js tests/paradise_ecology.test.js`: 30 pass. `npm run check:arch`: pass. Source SHA-256 `8a93f1e9b6cb9f5c43be1a424a721888bcb630e4da1c279d99b8675ef5d66c8f`. Test SHA-256 `f555b4acb4264e2d2f075854ed39281f41172787a0df30e10fb1e515aca9adf0`.
- Rechecked the Meadow pen integration boundary. `native_resources_domain.js` already registers and migrates `meadow_pen`. The host's `commitHabitatPlan` couples item, purse and state changes. Extend that seam instead of introducing another registration or touching shared `main.js`. Recheck the household boundary before migrating Moss. Open work includes wiring and migration, time-based wild outcomes, and rebuilt gameplay plus native save/load/export/import. No reserve use or other lane edits.

## Village sheep integration

- Prior turn was progress. First runtime consumer wired through `habitat_care.js` and the existing `meadow_pen` owner in `native_resources_domain.js`. Adoption enrolls the existing adult sheep, brushing adds keeper experience, and overlap between paid hay and brushing establishes a finite recovery interval. Wool production reads maturity. Legacy pen saves retain wool progress and reconstruct an active care interval when both old receipts exist. Earlier brush history starts at neutral bond because the prior save never tracked it. Existing coin and wool amounts stay intact. No main.js registration or changes to other lanes.
- `node --test tests/habitat_care.test.js tests/creature_lifecycle.test.js`: 17 pass. Includes old active save migration and recovery against actual hay and brushing actions. `npm run check:arch` and scoped whitespace checks passed.
- `BUILD_OUT=/tmp/yair-creature-build.aSmGzR npm run build`: pass. Bundle SHA-256 `95c2b76c1da2e8d48cff3b3e12082f8fd6d6ef09fc6bba4f5ef3e0202e63e867`.
- `PROOF_LIFECYCLE=1 PROOF_URL='http://127.0.0.1:19643/?test_hooks=1' PROOF_OUT=/tmp/yair-creature-build.aSmGzR/receipt.json node scripts/modular_seams_browser.cjs`: passed in headless Chromium, fresh 1920×1080 profile. Visible native actions built and paid for the pen, adopted and fed the sheep, brushed it, confirmed early collection disabled, then collected one batch. Literal save/reload/export/import retained identity, bond and collected count. A fresh legacy envelope with no pen still loaded without one. The older combined route hit stale dialogue and unrelated harvest navigation; switched the proof to the live Talk topic and meadow-only route.
- Next: wire a contrasting pet consumer through the household owner, surface lifecycle consequences in existing panels, and finish wild time-based outcomes and native checks for the remaining features. Meadow browser check is agent-verified; the full lifecycle remains below floor. No reserve use.

## Moss integration and relocation

- Prior turn was progress. Moss now uses the same lifecycle as the sheep. Meeting records a free cat in the local doorstep habitat. Visits build a keeper-scoped bond and play adds learned chase behavior. The existing bond threshold moves the same individual into the home under player custody. The household rest bonus reads maturity from the lifecycle. Moss still feeds himself and the household keeps ownership of gifts, play preferences and the hearth.
- Legacy records lazily migrate at the next household transaction, preserving recorded bond and number of play visits. The old record remains readable before migration. Existing residence retrieval routes move that same animal between addressed habitats, retaining learned behavior and home-local inventory. Serialized lifecycle identity is scoped to the host save record.
- 74 focused tests passed across lifecycle, meadow, household and home owners. Tests exercised legacy play history, adoption, import preflight and actual residence transfer with stable identity. `npm run check:arch` and scoped whitespace checks passed. No composition root edit.
- Isolated `BUILD_OUT=/tmp/yair-cat-build.Q4kGKS npm run build` passed, bundle SHA-256 `54e85d03f7dde90b5e8f25afd316dd36c4634fb96ca02d46592a8472caf98168`. Current-build pet browser and native roundtrip remain open. The prior meadow browser receipt remains scoped to its earlier bundle. No reserve use.
- Next: run a fresh owned-Shack fixture for Moss, then implement time-based wild outcomes and a playable path for remaining breeding, injury and recovery. Reconcile current runtime ownership and complete the full-floor audit before closing the goal.

## Wild population settlement

- Previous turn was progress. A habitat can now settle recurring local played-time windows. Surviving cohorts can reproduce into free space. Prey shortfalls, missing habitat support and capacity loss can shrink managed cohorts at their declared rates. Losses use the prey present at the opening of the window. Births cannot retroactively save a predator. Named individuals are retained and count toward capacity. Extinct cohorts require external restocking or another local route.
- The save retains the next due minute and cumulative births/losses. Catch-up settles up to 64 windows per call and returns the pending remainder. The policy accepts up to 32 managed cohort rows in host-authored order. Within a window, order governs competition for limited habitat space. Host adapters must settle elapsed windows before applying a local stock or habitat change.
- The marsh test removes prey, verifies no early settlement, then observes predator loss and surviving rabbit regrowth. Partitioned advances across JSON restore equal a single advance, including revision and next due. A 70-window empty-clearing control proves bounded catch-up and no spontaneous repopulation.
- `node --test tests/creature_lifecycle.test.js tests/habitat_care.test.js tests/household.test.js tests/household_play.test.js tests/home_system.test.js` and `npm run check:arch` passed. Wild habitat still needs a native host and visible decision. Remaining routes also include current-bundle Moss browser persistence and playable breeding and injury/recovery. No reserve use.

## Village copse runtime

- Prior turn was progress. The Meadow pen Projects drawer now lets the player check the nearby copse and trade one carried Stale bread for a rabbit hunt and one Rabbit meat. Rabbit meat uses the existing raw-meat cooking material type. The same local wildlife clock projects scarcity-driven departures and reproduction. The save keeps the catch, clock and cohort checkpoint, from which reload projects the same later outcome. A fresh life starts with one observed fox and three rabbits when the player first checks the copse. This is an original ecology comparison using the prey dependency from the held RI case, with no changes to Gu systems.
- UI target 1920×1080 desktop (DSG6–DSG10, UR70–UR75). Existing Projects disclosure keeps counts, price and local consequence together. PRS4/PRS6 voice sample from the existing pen: “Brush and inspect sheep.” Mobile remains deferred.
- `node --test tests/habitat_care.test.js tests/creature_lifecycle.test.js`: 20 pass. The new control uses the live pen command, rejects missing bait, debits bread, credits meat and contrasts the next fox count with the unhunted copse. `npm run check:arch`, player text check and scoped whitespace checks passed.
- Isolated build SHA-256 `d8c72847bde7002fe268f00f3f09e6c8b803303589bd05d72fe00e433d455537`. Fresh 1920×1080 Chromium `PROOF_LIFECYCLE=1` through `scripts/modular_seams_browser.cjs` passed. After native sheep care and wool collection, the browser surveyed, spent one bread, received one meat, waited for the fox count to reach zero, and saved/reloaded/exported/imported. After import the visible count was still zero and one Rabbit meat remained. Local receipt `/tmp/yair-copse-build.CgpfuU/receipt.json`; browser errors zero. Cooking the new meat itself was not exercised. No reserve use.
- Next: complete the pet browser roundtrip and implement playable breeding and injury/recovery through their normal owner. Keep the goal open for the full audit.

## Livestock, pet and full-goal verification

The previous turn was progress. The meadow now offers a cheaper injured ewe, a paid spare stall and a shepherd's ram visit. The ewe needs six overlapping minutes of hay and brushing to recover before wool production resumes. The paid brood reserves the spare stall, and the lamb inherits a coat trait. It cannot be sold before maturity. A sale transfers the same animal to the shepherd and credits the purse once. The visiting ram returns to the shepherd and can be hired for a later brood. Durations and prices are original Village dials.

| Goal requirement | Current evidence |
| --- | --- |
| Wild populations, habitat, acquisition and persistent outcomes | Copse survey and hunt spend carried bait, credit meat and alter future fox support. Headless desktop UI reprojects the loss after literal import. Focused controls prove local clock partitioning, scarcity and bounded catch-up. |
| Identity, breeding, traits and growth | Native meadow rescue, paid breeding, juvenile sale refusal, elapsed maturity and sale all passed. Focused host tests restore a pending brood, verify inherited coat and empty experience, reject duplicate sale, and keep ram identity across broods. |
| Care, injury, recovery and an actual consumer | The native injured-ewe route consumes hay, uses brushing and recovers before the wool batch. Focused recovery tests prove interrupted treatment, exact healing time and equivalent time partitions. |
| Acquired behavior, bonds, custody and transfer | Owned-Shack fixture uses native meet, play and pet. The same cat crosses from free to player custody with bond 30 and one chase practice. Save/reload/export/import keeps the animal exactly. Residence tests exercise relocation to a different habitat while preserving identity and experience. |
| Contrasting consumers and adjacent recommendations | Meadow wool, Moss's earned adoption/rest, and the prey-dependent copse use the shared lifecycle with different local rules. Source matrix and ranked adjacent recommendations are above. Gu emergence and Immortal uniqueness stay with the Gu owner. |

- Build: isolated `BUILD_OUT=/tmp/yair-flock-build.BLw4I1 npm run build` passed. SHA-256 in receipt.
- MCP: fresh Village on frozen instrumented bundle `7830f5aeabe61499aa186102e20cf1c5d5f09ce6ec77529c30dca9d6ae587380`. Opened Projects drawer and Meadow pen, built the pen and took in the ewe. The visible panel showed the cut, six minutes of care and the missing-hay reason.
- Desktop: `PROOF_LIFECYCLE=1 PROOF_URL='http://127.0.0.1:19647/?test_hooks=1' PROOF_OUT=/tmp/yair-flock-build.BLw4I1/combined.json node scripts/modular_seams_browser.cjs` passed at 1920×1080 with no page errors. Native actions and literal save exchange proved the sold lamb, wool, wild state and Moss. Shack ownership and a reusable cloth were fixture inputs. The fixture was switched to the visible Place Options tab after diagnosing the hidden panel.
- Focused checks: 81 pass across lifecycle, meadow, household, home and Paradise ecology suites. `npm run check:arch`, `npm run check:rules` and scoped whitespace passed. Rules emitted unrelated HP day-counter and stale-glob warnings. AD36 reserves the full suite for a committer. No commit or push, human review or reserve use.
