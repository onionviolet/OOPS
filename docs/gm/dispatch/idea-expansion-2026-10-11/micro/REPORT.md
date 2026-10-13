# G8 Micro-progression and native-feature implementation audit

Date: 2026-10-11. Finite planning tranche, planning-reviewed-by-worker.
[Requirements](REQUIREMENTS.json) contains 24 stable detail families and their
variants, native seams, interaction cases and remaining work. Existing shared
owners, native source, tests and bundles stayed read-only. G1 starts delivery
remains intact. No runtime writes, builds, tests, browser, downloads or new source
research were performed. This report uses current source inspection, not a
prebuilt bundle or historical passing test count as behavior proof.

## Problems before expansions

| Code | Finding | Evidence and required next check |
|---|---|---|
| F1 | Native capped-XP branch cannot execute its intended guard | `src/components/levelable_component.js:134` compares `typeof skillXP.xp_to_next_lvl === Number`. `typeof` produces a string, so this branch is source-inspected unreachable. Determine intended caller policy, reproduce a capped finite grant and assess compatibility before repair. Uncapped crafting/cheat grants must retain their own rules. |
| F2 | Old audit’s missing-title diagnosis is stale | Proto23 R1 says native YAIR has no title catalog. Current `src/titles.js`, native counters/refresh in `main.js`, `Hero.setTitleBonus`, serialization/load and `titles_ui.js` form an actual source-integrated catalog. Expansion should deepen it, not rebuild another lifetime-title owner. No fresh runtime proof supplied. |
| F3 | Issued titles and native lifetime titles have different semantics | Native `character.titles` derives bonuses and has no inspected removal/hidden policy; simulation titles retain issuer/world/cause, expose facts and support removal. A simulation-issued title does not automatically reach the native panel/bonus consumer. Select bridges only where the title’s actual function needs one. |
| F4 | Effect rejection can mutate earlier group members | Native `add_active_effect` deletes weaker group-matching effects during scanning, then may encounter a stronger group and return. Multi-group/insertion-order fixtures need reproduction to establish a concrete gameplay failure; rejection should leave the full existing set unchanged. |
| F5 | Growth and timing expansions can change saved meaning | Skill coefficients divide by cap, bulk XP calculates pre-clamp unlocks, fixed title life-date does not represent arbitrary historical births, and native sleep expiry mutates the shared duration variable. These are concrete source seams, not a claim that every live joined-clock path is defective. Reproduce the selected route and preserve old-save meanings. |

Additional specific source concern: `Skill.add_xp` computes `level_after_xp` from
zero and gathers milestone unlocks on that loop. Later level-ups can return earlier
unlock identifiers again; the actual reward consumers may already be idempotent.
Inspect and exercise one material unlock before claiming duplicate rewards.

## Implementation-audit matrix

“Persisted” below means inspected serialization/owner wiring, not successful
save/reload/import in this pass. Older evidence remains with its exact wave owner.

| Family / stable owner | Declared or catalogued | Caller-integrated source | Persisted owner | Actual native UI consumer | Current test/browser state |
|---|---|---|---|---|---|
| Native lifetime titles | `src/titles.js` public combat/endurance/craft/life counter palette and bonus helpers | `readTitleCounters`, periodic `refresh_titles`, load backfill and derived Hero contribution | `character.titles` serialized/normalized in main; unknown IDs inertly retained | `createTitlesPanel` and title/bonus notifications | `tests/titles.test.js` read, not run; current integrated browser proof not inspected |
| Simulation-issued titles | Effect contract includes issuer/world/cause and remove | `simulation_effects.js` grant/remove/fact generation | `simulation.titles[actor]` in existing expansion owner | No generic native-title bridge inspected; local consumers may use facts | Exact title-specific native/save behavior unknown |
| Native skills and parent transfer | `Skill` definitions, names, caps, XP and milestones | Main `add_xp_to_skill` → person → component → Skill; parent catch-up and reward/UI dispatch | Native skill_progress/save restoration source pathways targeted | Native bars/descriptions use stored-XP discovery; many other tooltips remain uninspected | No tests run; full individual catalog/native task matrix remains |
| Learned methods | Existing brace/trail/timber/inquiry family IDs retained | Skill host/content/main panel/native publication source inspected | Existing simulation power/source/knowledge/job + native XP owners | Notebook Practice / center-panel host | Prior engineering delivery says gameplay deferred; not promoted here |
| Human traits and body changes | `body_progression.js` source/faculty/condition palette | Human practice/recovery/facts and capability support | Existing simulation source/body/conditions | Body/native support presentation with selected consumers | Body test file exists; no current test/browser claim |
| General perks/achievements/classes | Proposed distinctions in skills/progression docs | Facts/claims/progress or title machinery may support selected content; no universal complete perk engine established | Selected actual owner needed | No inspected generic perk/class catalog UI | Design/source question, not a proved absence from every world/private pack |
| Native equipment and status stats | Effect templates, bonus levels, flat/multiplicative contributions | Hero active-effect aggregation; person stat/equipment/derived task values; simulation equipment staging | Native gear/effects and expansion conditions retain distinct domains | Equipment, native effects and stat/skill bars | Actual stacking/removal/transition behavior not exercised |
| Care effect projection | Status host/facts/native reader references | Main binds effect reader and final publisher; host supplies native drying changes | Existing simulation/care and native effect-duration state | Center care panel and native effects | Existing status-care backlog explicitly keeps native, persistence and UI groups unrun |
| Arbitrary growth/loss/body/world variants | Growth models, title/perk/trait and assembly design palettes | A `progress` field or catalog entry is not a functional consumer | Must select existing owner + compatibility; no new parallel progress save | Native adapter required for selected variant | Planning only |

## Input dispositions and expanded detail ownership

| Consulted family | Requirement IDs | Disposition |
|---|---|---|
| Lifetime titles and Proto23 title audit | G8-001–005 | Reconcile stale absence; deepen event/counter fidelity, issuer distinction, hidden projection, lifecycle and actual elapsed-time semantics. |
| Native XP/curves/caps/parent semantics | G8-006–009, 012 | Preserve actual native model and caller policy; investigate source guard/pre-clamp/idempotence seams before adopting broader local models. |
| Skill discovery and native UI | G8-010, 022 | Preserve pure projection and stored-XP threshold; expand known-source explanations without revealing hidden rows. |
| Ordinary skill depth and four implemented method families | G8-011, 021 | Reuse existing stable methods and actual native outputs; extend one connected application, keep old verification remainder. |
| Character/world growth and levels lifecycle | G8-013, 014 | Local branches/consolidation/loss remain distinct; missing inverse or non-native model gets a named adapter, not negative XP on forward API. |
| Body/traits/aptitudes/faculties/constitution | G8-015, 020 | Preserve G1 initializer and G2 mechanisms; G8 owns actual contribution and native task/stat seams. |
| Perks/achievements/feats/quirks | G8-016 | Classify recording versus real rule change; retain functional/texture variants, no new bar or universal smallness/rarity. |
| Equipment/effect templates/care | G8-017–019, 021 | Inspect composition, collision, duration, suppression/removal and actual native consumers; source concerns await targeted reproduction. |
| Save/title test source and growth scale audit | G8-023 | Preserve current save domains and old progress; distinguish source test assertions from executed proof and measured numerical policy. |
| Completion/actionability/assembly standards | G8-024 | Reuse S00–S14/one-owner gates; do not impose all assembly costs or fixed component lists on every local world. |

This is not a reconciliation of every title, all native skills or 396 audit
artifacts. The JSON inputs state precise read scopes, including references/search
only where a file was not read fully. Other perk/game/book raw source was not
consulted. No secret title names, selected candidate truth or private-source
content was introduced.

## Concrete expansions to implement deeply

| Card | Early function | Small interaction details | Continuing and macro use |
|---|---|---|---|
| D1 Recognized professional | Actual completed result can grant issuer recognition or an automatic counter honor. | Witness unavailable, incorrect credit, borrowed tool, disputed result, unknown issuer, display choice and removal each retain distinct behavior. | Credential opens a real service/office where local law grants it; revoked authority stops, historical achievement remains only if its rule does. NPCs know through witnesses/records. |
| D2 Ordinary precision method | A learned material/observation procedure changes one actual recipe or route output. | Genuine owned material, defective tool, support loss, interruption, precise alternative, unwilling teacher and a superior imported faculty each affect the actual consumer. | Reliable method can improve a workshop, supply project, teaching or technical research. Lower-tier methods need not retain contrived niches if genuinely superseded. |
| D3 Aptitude and constitution | Aptitude speeds selected learning; constitution changes a physical process; faculty opens a verb. | Dormant/awakened, copied information, body replacement, borrowed support, injury and false appraisal differ. | Late tools/processes can amplify a supported strength without generic trait stacking. A permanent benefit remains when its carrier actually survives. |
| D4 Effective skill from a device | Owned equipped device gives its promised competence/function. | Effective level, earned XP, milestone grant, equipment removal, status coexistence and lost power are accounted separately. | Immediate strong function may transform labor/combat; it does not retroactively create training history. Refit returns the same physical object and removes only its contribution. |
| D5 Feat and perk | One real outcome can grant a persistent record, concrete exception or both. | Repeated loading, witness refusal, partial result, copied claim and secret discovery preserve credit/knowledge boundaries. | A rule-changing perk changes native use rather than an ornamental badge. Free or overwhelming functions stay possible without artificial cooldowns, slots or balancing costs. |

The G1 start palette and G2 power palette already cover broader sources,
evolution/fusion, body forms, cheats and carriers. G8 adds the actual native
seams and small detail depth instead of creating competing definitions.

## Bounded follow-on packets

| Packet | Scope | Required ownership and acceptance |
|---|---|---|
| MICRO-P1 native XP policy repair | G8-006 plus 007/009 guards | One native XP writer inspects all relevant cap callers; reproduce capped, deliberately uncapped, bulk milestone, loading and parent-transfer cases. Decide compatibility before correcting guard. Rebuild and fresh native action/save proof after source tests. |
| MICRO-P2 title lifecycle and hidden projection | G8-001–005 | Native title owner + G4 known projection + G1 life/time anchor. Select one public permanent honor and one generic hidden/revocable fixture. Verify actual acquisition moment, derived bonus/removal, display/notification/count secrecy, retention and old-save reload/import. Source-specific content stays in its correct private/sealed owner. |
| MICRO-P3 ordinary late-use method | G8-011/012/021 | Reuse existing method ID and one G3 workshop/route consumer; no new XP owner. Verify actual output, high-support/low-support alternative, paid/free teaching where selected, unwilling participant/cancel, native XP, discovery and save-return. |
| MICRO-P4 effect application and timing | G8-017–020 | Native effect final publisher and G4 clock authority; reproduce real selected group/template and native versus joined routes. Verify rejection before mutation, order independence, refresh/extension, travel/rest/expiry, exact stats and no repeated effect contribution. |
| MICRO-P5 selected progression branch or loss | G8-013–016/023 | G2 selects full functional branch/loss rule; G8 audits native contribution/level interface; G5 owns persistence. Verify actual new function, refusal/alternative, loss versus suppression, restoration, old progress and numeric boundary. No universal inverse XP API or new perk tree assumed. |

Every packet must reserve exact files before runtime writes. Main/save shared
publication belongs to one integrator, especially while the absorption wave is
dirty. Checks in this planning pass are document checks only. Browser/save proof
and director acceptance remain the later selected packet’s gates.

## Checkpoint and remaining

Outputs: REPORT.md + REQUIREMENTS.json in the worker’s `micro/` reservation.
Complete: finite source-audit matrix, 24 expansion/detail contracts, ownership
joins and five follow-on packets. Current code pointers use the dirty checkout at
inspection and may shift while other authorized writers work.
Remaining: full individual native skill/milestone catalog, all effect template
group combinations, all UI callers, full main/save/clock paths, exact numerical
limits and source-qualified world-specific titles/perks. Test/browser execution
was prohibited for this worker, so no runtime defect or verification promoted.

Next concrete action: parent/G5 reconcile source findings and freeze MICRO-P1 or
another selected connected packet, inspect current source again, reserve one
native writer and assign exact reproduction/compatibility cases.
