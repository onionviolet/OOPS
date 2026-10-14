# P4 generated people

## Source audit before implementation (SOURCE)

F1. `src/npc_lives.js` is a separate optional store of authored Village households and Iona. Family/name records are fixed; death years use a hash. It supplies no traits, needs, requests or generated names.

F2. `src/simulation.js` enrolls registered people and actors and schedules registered controllers. `src/simulation_effects.js` spawns registered/frozen templates and attaches per-instance controller records by template definition. This is actor/spawn infrastructure, not a living generated population. `deriveSimulationSeed` in `src/simulation_resolution.js` supplies a stable seed derivation seam; it does not itself persist generated draws.

F3. The Village elder has an authored registered NPC and bounded chronicle interactions/relationships. His native dialogue and hidden-build knowledge routes do not supply general generated people. Existing knowledge projections distinguish observed facts from truth.

Implementation uses an optional separate bounded store and its own registration module, avoiding changes to P3's simulation_content. This slice does not promote authored households or implement all E3 proposals. Names are original Village culture from E6's hill/river/road tables. Live authority: USER_VISION standing desktop priority, PROJECT standing priorities, dispatch PLAN and E3/E6/CHARACTERS owners.

## Play route and compatibility

A1. In Village, open Reports > Village travelers > Welcome road travelers. This is optional on new and old saves. Open each traveler record and Meet traveler. Two are present immediately; a third arrives after one played game day.

A2. Talk about their travels reveals one actual trait per conversation. The UI projects only discovered traits and reports the remaining count. Meeting reveals their need and supply request, not their full possessions or hidden traits. Give the requested native item for a stated reward paid from their saved purse. The item leaves the hero's inventory and enters the person's saved supplies. A fulfilled obligation cannot pay twice.

A3. After helping, Offer a place in Village lets that person settle. Otherwise travelers visit for three days, leave for two, and return. Hourly need pressure and trait biases choose resting, talking, planning or browsing. This is a six-hour bounded routine with recovery, not the full E3 utility simulation. Only played calendar time matters; no wall-clock/offline consequences.

D1. Schema 1 stores all three drawn people, final RNG state, immutable names/culture/template/traits, original need, request/reward, purse/keepsake, acquired supplies, knowledge and relationship fact. Later projections use no random draws. Old envelopes without generated_people remain absent; enrollment begins from their current calendar and never inserts historical people. Authored households and elder names/families remain unchanged.

D2. Save writes precede native inventory removal and reward publication. Invalid/future population imports reject before storage mutation. Name grammar supports per-world registration, reserves authored first/full names and used generated names, and fails explicitly if a grammar is exhausted. Grammar updates do not rewrite saved names.

## Changes and integration seams

Owned new modules: `src/name_grammar.js`, `src/generated_people.js`, `src/generated_people_ui.js`. Tests: `tests/name_grammar.test.js`, `tests/generated_people.test.js`. Report artifacts are in this p4 folder.

Shared edits only:
- `src/main.js`: one import; hydrate after durable save and native load; snapshot during save; register the panel with native inventory, purse and write/busy guards.
- `src/save_files.js`: validate optional generated_people and its calendar bound before import.

No edits to npc_lives.js, simulation.js or P3's simulation_content.js. The store is intentionally separate from simulation actor IDs; full actor combat/controllers/relationships are deferred. Root can unify this local derived stream with P1 after merge without regenerating saved records.

## Verification

| Check | Label | Result |
|---|---|---|
| Name grammar determinism, uniqueness/authored reservation, extension/exhaustion | SOURCE | 3 tests pass |
| Generated determinism, knowledge projection, supply/reward settlement, residence, hourly catchup, restore/absence, rejection, literal import and storage-failure publication | SOURCE | 9 tests pass |
| Full npm test | SOURCE | 633/633 pass, includes the 12 focused tests |
| npm run build, served bundle equality | SOURCE / rebuilt bytes | PASS; SHA in browser-evidence.json |
| Fresh original Village hero meets two generated people through buttons | NATURAL | PASS |
| One discovered trait and remaining traits hidden; retained after reload | NATURAL | PASS |
| Starting Stale bread given: native count minus one, hero purse plus reward, person's saved purse minus reward and supplies plus one | NATURAL | PASS |
| Helped person chooses settlement; relationship fact displayed | NATURAL | PASS |
| Save/reload and native restoration | NATURAL | Exact generated state retained; saving available after corrected single-page reload |
| Export download then literal saved_file_input Import | NATURAL | Exact generated state matches decoded exported file |
| Hourly action transition | NATURAL | OPEN: 90 played minutes retained the same chosen actions; the harness assumption that every hour changes action failed. Different actions/catchup pass SOURCE; no native transition claimed. |
| Desktop 1366x768 and 1600x1000 | NATURAL | PASS; screenshots in this folder, existing Reports scroll surface |

Compact executable harness: browser-proof.cjs. Profile and literal export are private test fixtures under /private/tmp, not committed. The harness needs a fresh profile (P4_PROFILE) for repeat execution because it consumes the person's finite request. No user save was opened. Evidence omits hidden trait truth.

An initial resumed-profile browser attempt restored an extra tab and showed read-only after reload. Its screenshot was superseded. The corrected proof used one page in a new profile and retained native saving authority. This was a harness correction, not a product repair.

Human fiction/balance/layout acceptance remains open. Broad E3 population AI, births, NPC-to-NPC relations, combat, household traits, other-world grammars and mobile are outside this slice.
