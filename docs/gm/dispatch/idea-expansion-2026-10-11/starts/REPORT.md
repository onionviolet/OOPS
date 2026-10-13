# G1 Starts and life forms: first planning tranche

Date: 2026-10-11. Status: planning-reviewed-by-worker, awaiting integrator review.
Runtime status: no gameplay written, built or exercised by this pass.
Owner: G1 worker; exclusive writes in this `starts/` directory. Existing owners,
source, builds and private saves were read-only. No commits or external research.

[Requirements](REQUIREMENTS.json) holds 30 parent detail contracts with concrete
variants, dependencies, inspected consumers/gaps and observable cases. These are
planning proposals, not accepted world mechanics or a complete start catalog.
Candidate-specific truth was neither added nor disclosed. Public family names
already present in existing owners do not identify a sealed selected candidate.

## Problems before improvements

| Code | Named problem | Evidence and correction |
|---|---|---|
| F1 | An origin taxonomy can hide missing gameplay | `chooseSimulationOrigin` in `src/simulation.js` only rejects a stale/already-selected command, checks eligibility and stages effects/one global claim. Caller search found its test, no native invocation. Define atomic native initialization and each body’s actual first actions before treating selection as playable. |
| F2 | Older proposals turn alternatives into universal restrictions | Shared origins require costs for inherited powers/impossible combinations; life-sim creation proposes all-three-door creation, baseline layers, symmetric trades and priced rerolls. Latest local-world/user authority governs instead. Keep full inherited faculties, free entry, powerful bodies and any locally supported reroll alongside other variants. |
| F3 | Existing opening language conflicts with current entry direction | Life-sim introduction still calls vanilla the default; current PROJECT.md makes suspenseful random entry intended and Frontier optional. Use Frontier as old-save/optional campaign compatibility, never as a prerequisite. |
| F4 | A body label does not change native functions | `character_creation.js` writes bio fields; racial/height bonuses are disabled in configuration; `body_progression.js` offers human hand training. A tree, infant, ship or system needs real perception/control/action consumers. |
| F5 | Memory and biography can become false state authority | `life_record.js` explicitly stores a bounded lossy biography. It cannot reconstruct exact actor history, earn mastery, materialize inherited property or initialize a replay-self. Use actual native/simulation state and provenance, with G4 history owners. |

These are bounded source/planning findings. Repo search and code reading do not
prove behavior absent from every private pack or uninspected adapter.

## Coverage and dispositions

| Inspected family | Requirements | Disposition and meaningful retained variants |
|---|---|---|
| Composed origins and validation | G1-001, 029 | Expand existing composition into actual cross-owner transaction; distinguish old save/new game/new life. |
| Random start, optional controls, rerolls and hidden pool | G1-002, 027 | Expand with frozen result, publication, availability and suspenseful presentation; local choice and free reroll stay possible. |
| Historical/world/era/location/situation entry | G1-003, 026 | Join G4; early/mid/late, premise/successor/replay/regression each retain a distinct function. |
| Ordinary adult/native/outsider/established late life | G1-004 | Expand actual language, means, body and background provenance; no automatic age penalty or veteran mastery. |
| Generated family, household, care and property | G1-005, 013 | Expand durable independent people, permissions, supportive/harsh/rich/poor/foster/communal variants. G3 owns ongoing life. |
| Infant/child/adolescent/compressed development | G1-006, 007 | Expand legal signals, meaningful early wins, support, supervision and projected chapter aftermath. |
| Memories, amnesia, language and uncertain plot knowledge | G1-008 | Expand domain separation and discovery through actual means; retain functional skill without automatic explanation where coherent. |
| Body/build/species/genetics/constitution/aptitude/lineage/name/sex/presentation | G1-009, 010 | Separate provenance, physical functions and knowledge; local heredity is not universal two-copy genetics or mandatory symmetric trade. |
| Source role, named counterpart, retained body and shared identity | G1-011 | Retain role-only, full inherited faculty and changed-body variants; no mandatory cost or hidden erasure of operative faculties. |
| Existing entry routes and payment palette | G1-012 | Retain ordinary, sponsored, free, coercive, paid, passenger, intercepted, dream, ritual, integration and constructed-world routes; G4 owns passage. |
| Starting resources/access/known support | G1-013 | Expand actual custody, legal action and first pursuit; retain extreme/zero means without forced balance. |
| Monster/beast/familiar | G1-014 | Separate anatomy, independence/bond, communication, ecology and social reception. |
| Plant/tree/fungus/seed | G1-015 | Separate rooted reach, senses, network nodes, production and transition; no universal hearing or automatic consciousness copy. |
| Object/artifact/ship/vehicle | G1-016 | Separate controlled actor from physical item and holder; custody and command are different. |
| Spirit/ghost/undead/divine/demon | G1-017 | Retain local substrate/manifestation/support and immortal/no-need possibilities; avoid genre defaults masquerading as rules. |
| Full robot/construct/golem/homunculus/cyborg/bio-synthetic | G1-018 | Distinguish parts/food/power/binding and repair/freedom; retain perpetual/self-repair variants. |
| Dungeon/house/river/lake/array/place | G1-019 | Expand concrete site authority, residents and useful actions with bounded extent. |
| Collective/swarm/symbiont/parasite/second soul | G1-020 | Expand channels, node loss, host autonomy and actual control; no double spending across bodies. |
| Character/soul/guide/system/lineage/fate perspective | G1-021 | Preserve mode diversity; playable system possibility is accepted, mechanism remains local proposal. |
| Concept/force/rumor/song/shadow/reflection/microbe/national fortune/egg | G1-022, 015 | Retain distinct substrate/scale adapters; egg/dormant phases join limited-body development, not adult race menus. |
| Heir/successor/unrelated next life and preparation | G1-023, 024 | Expand surviving transfer, refusal and exact plans; G4 owns ending and G2 revival. |
| Immortal self beginning elsewhere | G1-025 | Keep full-power in-person, local avatar, fragment, sealed body and chosen suppression; no compulsory equalization. |
| Harry Potter bounded origin study | G1-028 | Retain existing candidate palette as original/qualified proposal; no full-source or selected-world claim. Exact canon questions stay source tasks. |
| Optional Frontier finite campaign | G1-029 | Preserve existing campaign requirements and saves; no new random origin required for this campaign. |
| Complete section/family acceptance | G1-030 | Bind selected details to S00–S14 and C0–C5 gates; preserve unread remainder. |

The manifest is a finite extraction from explicitly inspected sections, not an
artifact-count claim. `LIFE_SIM_NORTH_STAR.md` is 7,514 lines at inspection. Only
the slices listed in REQUIREMENTS.json were reviewed for this lane; the remaining
sections and their underlying audit cards are not reconciled by this report.
Source-reading claims in older owners were not independently reverified.

## Micro-to-macro detail examples

These are generic design cards, not selected secret scenarios or source canon.
Exact numbers, cast and hidden outcomes belong to later local owners.

| Card | Acquisition and first function | Development and combinations | Response and lasting consequence |
|---|---|---|---|
| D1 Infant communication | A supported deliberate signal is observed by an actual caregiver; their interpretation may be partial. | Repetition can develop a shared vocabulary; retained memory can suggest a signal but does not supply speech organs. | Caregiver knowledge/trust and their own plans change from what they observed. A chapter advance retains that relationship and chosen learning, without perfect care assumptions. |
| D2 Established craft life | Authored background supplies a particular supported method and owned/loaned tool with provenance. | Use can repair an actual item, earn local work, teach an apprentice or build an institution; stronger imported means can solve suitable work outright. | Customer and witness remember actual results. Age/history do not fabricate prior player quests or wages. |
| D3 Rooted life | Real sensing and a supported root/production/signaling action matter in its current place. | Tending, protection, harvest, symbiosis or mobility through acquired means connects to livelihoods or a grove; no overhearing without a channel. | People react to witnessed effects, not secret personhood. Grafting, transplant or seed transition declares identity/source/custody retention. |
| D4 Object life | A holder interacts with the one physical object; independent awareness chooses a supported effect or refusal. | Forging, reattachment, a new wielder, navigation or embodiment changes actual components and access. | Trading or stealing the object changes custody without copying consciousness/items. Wielder and object can have different knowledge and goals. |
| D5 System life | System issues a real supported offer or provides a genuinely backed benefit; host’s action is independent. | Guidance, shop, copying, grant, takeover or evolution uses G2’s actual mechanism; no compulsory resource meter or weakness. | Host refusal, observers and patron response have local causes. Host change/death follows actual surviving system carrier and information. |
| D6 New life from a plan | A valid surviving vessel/anchor/ritual narrows exactly the domains it controls. | Better or unusual source support may grant full free control; partial plans leave other dimensions random. | Destroyed assets stay destroyed; NPCs decide loyalty independently. Pending next-life publication cannot reroll or erase the old life on a failed save. |

Each card joins a local person/place/material/power consumer. It is incomplete
until the named native adapter and persistence proof exist. Rich description
alone is not a playable implementation.

## Cross-lane joins and ownership

| Partner | Needed return | G1 ownership boundary |
|---|---|---|
| G2 powers/cheats | Exact carried faculties, sources, control, body changes, memory/source retention, revival, multi-body/system functions | G1 initializes the chosen entry/body contract; does not create another cheat engine. |
| G3 lived world | Household templates and people, actual property/care/livelihoods, office recognition, parts/supplies, followers and hosts | G1 selects the entry snapshot and first-use bindings; G3 owns their continuing behavior. |
| G4 continuity | Historical snapshots/event state, source causes, discovery projection, ending/next-life triggers, passage and clock mapping | G1 owns eligibility/body/start reveal; G4 owns historical transitions and hidden history, not a duplicate origin save. |
| G5 integration | Sole origin transaction authority, native actor/body/stock binding, per-life ID, typed adapter contract and compatible persistence | G1 supplies required cases and option domains. G5 chooses real interfaces after source inspection. |
| Presentation reviewer | Center-menu usability for limited/abstract bodies, low knowledge, known constraints and failure recovery | No spoiler chooser or future locked-verb catalog. UI may teach an actual means only within character knowledge. |
| Source/world GM | Local source boundaries, exact era/cast/faculty/arrival qualification and private candidate content | Family palette is not canon or a universal rule. World owner determines permissible variants and source questions. |

## Ready implementation packets

Ready means executable after the stated interface/selection prerequisite is
resolved, not runtime authorization or a claim that every adapter already exists.
One integrator must reserve shared writes; no proposed names here are claimed as
existing exported APIs.

| Packet | Finite outcome and requirement IDs | Prerequisite and probable owner areas | Positive/counterexample and evidence gate |
|---|---|---|---|
| START-P1 | Atomic origin identity, frozen selection and compatibility baseline, G1-001/002/029 | G5 selects durable main/save authority, then reserves exact native creation/simulation/world bindings and tests. Two generic fixture starts may stay public; actual candidate selection remains sealed. | Fresh origins produce actual differing means/actions; stale/invalid/failed publication rejected; unavailable candidate policy; old saves unchanged; reload/import stable. Rebuild and fresh-origin browser plus generated-save proofs. |
| START-P2 | Historical early/mid/late entry, G1-003/013/027 | G4 snapshot/event interface and selected world-qualified source/private content owner; use START-P1 result, no second scheduler. | Correct actors/stock/access/knowledge; mid-event action affects a real cause; late start cannot resurrect/refill absent unique content. Save/reentry retains committed history. |
| START-P3 | Household infant/child to one later-stage pursuit, G1-005/006/007/008 | G3 selects care/property/people; G4 selects chapter-time projection; G5 reserves native action legality and one atomic advance host. | Different first signals/actions; actual care/ownership; one meaningful developmental choice and chapter consequence; lost caregiver/interrupted job cases; no retroactive mastery or hidden reveals; save/reload/import. |
| START-P4 | One rooted or object body and actual body-consumer depth, G1-009 plus 015 or 016 | G2 selects relevant senses/source; G3 material/custody; qualify native stat/action consumer before repeating families. | Human-only actions unavailable absent adapters; supported first function changes actual recipient/place; custody, communication, transition and superior means cases; reload/import no duplicate production/stat grants. |
| START-P5 | One planned/unplanned next life or immortal-local beginning, G1-023/024 or 025 | G4 selects ending/clock boundary; G2 selected surviving carrier/multi-body function; G3 surviving assets and people; G5 control/ID integration. | Surviving plan constrains declared axes, absent plan commits one coherent roll; existing life retained until durable publication; no ancestor inventory/loyalty clone; actual character knowledge and body support; full persistence proof. |

Run START-P1’s representative transaction/first-action qualification before
batching world cards. START-P2 can author snapshots while START-P3’s chapter
adapter is unresolved. START-P4 and START-P5 are independent later selected
journeys once their named prerequisites exist. Their full family horizons remain
in the 30 requirements instead of being silently reduced to those first proofs.

## Remaining and checkpoint

Unselected: exact world/start roster, local generation weights, source boundaries,
reroll/fallback policies, body laws, support abstractions and lifecycle rules.
Uninspected: other world/private dossiers; most north-star audit detail;
full native save/main/combat/action integration; detailed clock/time adapters.
Readability and JSON checks only qualify these planning artifacts. No source
implementation, bundle rebuild, browser gameplay or generated-save checks ran.

Reservation remains this directory only. Parent can integrate after reading the
actual REPORT.md and REQUIREMENTS.json. Next concrete action: G5 select and inspect
the sole START-P1 durable initializer host, then join G2/G3/G4 contracts before
assigning any native writer. Source owners continue to outrank this palette.
