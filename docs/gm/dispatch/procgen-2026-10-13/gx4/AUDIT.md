# GX4 source audit, proposal evidence

2026-10-14. SHOWN means source inspected, not executed. All recommendations are proposals. Snapshot hashes and a mechanical reference census are in [SOURCE_SNAPSHOT.json](SOURCE_SNAPSHOT.json). Main checkout is active; recheck hashes before a port. Scope: all wave-1 helpers, records and projections; adjacent seeded owners are inventoried to prevent accidental cursor replacement. This is not a semantic audit of every world-specific presentation function.

## A1: seeded helpers and draw provenance

Every exported P1 helper is covered below. File locators refer to the live main checkout, not a worktree. A root seed, a mutable cursor, a derivation and a receipt are different objects.

| Helper / source | Where draws come from; mutations and constraints |
|---|---|
| `STREAMS`, family validation, `src/seeded_streams.js:3-12` | Eight named aliases; extended families accepted by prefix. String validation is not a generator registry or instance reservation. |
| `hashStreamSeed`, `mix32`, `createStreams`, `:14-25` | FNV-style uint32 lane then avalanche mix; `createStreams(seed)` hashes `streams.root` once. No entropy generated here. |
| `validateStreams`, `ensureStreams`, `:27-40` | Schema 1; unknown cells preserved but unavailable to drawing; missing streams initialized from explicit fallback or current `state.rng`. `ensureStreams` can mutate on first call. |
| `scopedStream`, `:42-45` | Appends world ID except global `craft`. This is a world-definition ID, not automatically a unique world-instance/life ID. |
| `unitDecision`, `:47-52` | Pure value and receipt from root plus JSON `[stream,key,salt,n]`. No live validation/initialization, no log, no counter. |
| `streamSeed`, `:56-58` | Derived uint32 from `unitDecision(...,n=0,salt=0)`; calls `ensureStreams`; no receipt or cursor increment. Not a fresh root. |
| `remember`, `:59-63` | Mutates log; last 32 per stream and 256 overall. Log retention is not authoritative truth retention. |
| `nextOrdinal`, `:64-69` | Creates cell `{n:0,salt:0}` then increments. Allocates identity/decision number without drawing/logging a value. |
| `drawUnit`, `:70-74` | Advances cell then uses its saved salt; appends receipt; returns float only. |
| `keyedUnit`, `:75-78` | Uses key, explicit/default ordinal 0 and cell salt; no cursor increment, but appends a receipt on every invocation. Repeated keyed evaluation is not byte-pure. |
| `rollChance`, `rollInt`, `rollTable`, `:79-93` | Pure decision wrappers, caller-supplied stream object; all invoke `unitDecision` with implicit salt 0. They do not honor a saved cell salt automatically. Integer default is `legacyRound`, not uniform. Table accepts finite nonnegative floating weights. |
| `bindGameStreams`, internal `live`, `gameStream`, `:94-97` | Provider returns current expansion owner. `gameStream` takes player world or Frontier fallback. Binding does not freeze a transaction. |
| `gameRandom`, `gameOrdinal`, `gameKeyedRandom`, `gameRandomRange`, `:98-101` | Live wrappers for cursor, allocation, keyed draw and rounded integer draw. Returned values omit receipts, although logs retain them. |
| `seededRecipe`, `:105-110` | Commit-only Proxy redirects quality roll to injected RNG, retains bound private methods. Original recipes remain unchanged. |
| `validateNativeEncounter`, `:113-135` | Schema-1 restore validation for retained enemy truth/turns/loops; no draws. |
| `localMixtureSeed`, `src/mixture_state.js:11-14` | Hash scope then xorshift; pure uint32 with zero fallback. Profiles derive independently from family@1 + ingredient ID, method from method@1 (`:15-29`). Values stored, not cursor-driven. |
| `resolveMixture`, `src/mixture_state.js:47-63` | Pure deterministic composition/process law over retained profiles. No random draw for each batch. Repeating a method reproduces its product. |
| `createGeneratedPeople` local `draw`, `src/generated_people.js:12-27` | Seed rehashed with `village.generated_people@1`; local xorshift sequentially selects template, trait count/traits, supply/reward, need and possessions. Name generation reads current RNG but does not advance it. Final RNG saved; routines/interactions never draw. |
| `generatePersonName`, `src/name_grammar.js:11-22` | `deriveSimulationSeed(seed,names:world:key) % choices.length`, then linear scan past reserved/used names. Enumerating all combinations weights larger cultures more heavily. Saves resolved name/culture/grammarRevision. |
| `initializeStoryletDecks`, private `roll`, `src/storylet_deck.js:10-18,43-46` | Each deck hashes mutable `simulation.seed` at opt-in; saves its own xorshift cursor. Not yet a P1 cell. |
| `storyletCandidates`, `advanceStoryletDecks`, `:29-41,48-75` | Sort IDs with `localeCompare`; E predicates then float weight modifiers, explicit quiet weight. Draws only at eligible local tick after open-card cap; outside Village advances due/ticks without drawing. Receipts keep top three weights, not full candidates/table revision. |

### A2: native and adjacent seeded owners

| Source | Owner / actual caller and persistence |
|---|---|
| `src/main.js:450-452` | Fresh entropy only: crypto uint32 → expansion RNG → saved P1 root, bind provider. Root is hashed, not original raw crypto seed. |
| `src/main.js:2-3` | Mixtures: global `craft`, key `village.mixtures@1`; travelers: `world.people@base.frontier`, key `village.generated_people@1`. Both receive derived P1 seed, then retain their local algorithms. `scopedStream` called without instance here. |
| `src/models/location.js:338-391` | Encounter ordinal allocates key; keyed composition/stat draws indexed locally; every enemy gets encounter/rng/template keys. |
| `src/models/combat.js:61-80,187-188,294,353-432` | Encounter or combat ordinal, attacker/defender turn, target and named decision form keyed draws; callbacks get injected decision-specific draws. Snapshot retains turns and in-progress loops. |
| `src/enemies.js:167-190,212,444-455,502,519` | Keyed loot when enemy has rngKey, otherwise loot cursor; status callbacks default to seeded combat wrappers. |
| `src/components/trader_component.js:110-114` | Keyed stock by trader/name/template/refresh epoch/item indices/decision. Index order remains part of revision-1 behavior. |
| `src/main.js:2613,2953,3312-3316` | Action success, reward chance and mixed-reward inclusion/choice use reward cursor. |
| `src/main.js:4215,4255-4304,4389-4514` | Craft quality uses Proxy; success/rounding uses craft cursor; native craft transaction owns rollback. |
| `src/main.js:4741,7564-7570` | Recovery and activity gather chance/count/quality use gather cursor. |
| `src/main.js:730`, `src/absorb_c2/local_life.js:42` | Local life requires injected callback; host uses scoped localLife cursor keyed by played context clock. |
| `src/expansion_engine.js:517-521,557-579` | Separate moving expansion RNG, xorshift; action and auxiliary tables save resolved draws/outcomes/revisions in jobs and history. Keep its algorithm/order. |
| `src/simulation.js:39-40,49-70,181-187,508-517` | Duplicate hash + xorshift; enrollment hashes expansion RNG (`world.services`); automatic checks hash simulation seed/event ID; commands consume shared simulation seed; checks retain independent RNG/attempts/misses. |
| `src/simulation_resolution.js:4-7`; `src/simulation_effects.js:378`; `src/feature_expansion_nested_host.js:207` | Shared hash derivation also initializes caused and nested automatic checks, later drawn by simulation scheduler. |
| `src/native_battle.js:13,47-53`; `src/party_battle.js:37,87-88`; `src/feature_expansion_battle.js:99,279,323` | Three embedded xorshift closures from saved session seed, initially simulation seed XOR admitted sequence. Inject into combat math. Each session cursor stays its own owner. |
| `src/causal_story_host.js:221-223,240,269`; `src/causal_story_core.js:318-319` | Causal strikes/counters consume saved simulation seed on staged plan. Caller-owned RNG required. The hash at host `:87` fingerprints data, not an entropy stream. |
| `src/chronicle.js:224-225` | Inline xorshift advances expansion RNG to choose elder encounter cue; session retained. Not a new chronicle-owned RNG. |
| `src/npc_lives.js:4-22,46-51` | String hash of seed/person selects death year; all authored identities/events saved. Recruit addition deterministic, no new draw. |
| `src/audit_remainder_offers_state.js:50-55,83` | Derived seed/generationSeed retained and checked; offers are authored, seed does not vary roster. |
| `src/structured_pack_runtime.js:41,77`; `src/structured_pack_state.js:17` | Beginning choice uses current RNG fraction directly, no advance; durable selection pins pack/snapshot/start count/choice. Registration record schema 1, selection schema 2 are different owners. |
| `src/world_instances.js:271-280` | `seed` argument is an explicit instance specification, not a PRNG seed. Do not merge it with streams. |
| `src/life_experience_host.js:20` | New life makes expansion state from prior moving RNG. P1 root/identity carry policy is not a universal accepted reincarnation rule. |

Census includes ten xorshift transition sites: expansion, simulation, mixtures, people, decks, three battle hosts, causal host and chronicle. Hash-only name/death/offer sites are separate. [G1 kit](../../gen-rules-2026-10-14/g1/REPORT.md) is worktree-only at inspection, not an eleventh live implementation.

## A3: complete wave-1 truth / knowledge projections and joins

| Projection | Shown boundary and gap |
|---|---|
| `mixturePresentation`, `src/mixture_state.js:75-80` | Exact product's `observed` gates dose description. Process name public; truth operates before observation. Player-only boolean, no suspected/stale/basis model. |
| Mixture preview/panel, `src/mixture_ui.js:21-29` | Temporary state from derived seed if no owner; resolver then same projection; observed method and last observation shown. No new saved owner/product, but seed provider may initialize missing streams via ensure. |
| Inventory projection, `src/items.js:1221-1225` | Canonical product decoder builds native item; name/description call mixture projection dynamically. Identity key remains independent of label. |
| Experiment/exposure, `src/mixture_native.js:16-22`; `src/mixture_state.js:92-98` | Use writes knowledge/source/time and retained effect in same plan; effect is actual physical payload. Inspection alone never grants knowledge. Exposure is already described as observed because use is its observation route. |
| `generatedPeopleView`, `src/generated_people.js:62-66` | Hides unarrived/away-unmet people, unmet name, hidden traits/possessions. Public role/status/action still visible; met person exposes need ID and full goal; count of undiscovered traits intentionally visible. No NPC observer. |
| Traveler UI, `src/generated_people_ui.js:33-45` | Uses hourly projected snapshot then safe view; direct raw person read in help handler is execution, not display. |
| Deck candidate projection, `src/storylet_deck.js:29-41,65-67` | Candidates/weights derived from actual execution facts. Diagnostic receipts contain candidate IDs/top weights, not an observer-safe fate-ledger view. |
| Event projection, `src/simulation.js:401-418`; `src/storylet_ui.js:18-31` | Occurrence freezes label/responses/expiry/discovery. UI filters `discoveredBy` then displays preview eligibility/reasons. Event inspector returns a copy of full discovered occurrence, including frozen effects/receipts. Discovery alone is not authorization for a generic truth dump. |
| Adjacent general observations, `src/simulation_effects.js:110-113,152-158,281-284`; `src/simulation_contracts.js:66,85,235,249` | Stages seen/interpreted/understood, attribution basis and per-actor records. Monotone-stage replacement overwrites same-key accounts, so contradictory equal-stage claims are not retained together automatically. Actual target body/resources/knowledge-stage predicates also exist (`:131-154`). |
| Adjacent known cast, `src/people_knowledge.js:12-105` | Introductions/received accounts gate authored people; many domain views appended. Does not merge generated_people store. Preserve bridge identity rather than generate a second person. |
| Adjacent world, `src/world_knowledge.js:3-14` | Explicit name/branch facts gate world label; empty description avoids advertising undiscovered cosmology. |
| Adjacent fixed item, `src/nethack_fieldcraft_item_view.js:25-36,44-66` | Completed supported experiment plus understood observation gates identification; physical charge differs from identity knowledge. Preserve this existing route; no appearance shuffle yet in inspected merged wave 1. |
| Adjacent public lives, `src/npc_lives.js:39-42` | Joined-year visibility and last-year news filter future biography. This is a bounded public household, not generic appraisal. |
| Secret projection | No wave-1 randomized secret owner/projector. P5 D6 is a proposal; route IDs only in GX4. Do not assert three implemented generic projectors. |

Actual execution facts must remain available for physical validation. Observer/NPC deliberation, hints, disabled-button reasons, sorting, prices, accessibility labels and exports need a separate known view. A sealed candidate count is itself a disclosure; P4's ordinary undiscovered trait count must not become a universal default.

## A4: generated saved records, revisions and absence policies

| Saved owner / subrecords | Live locator | Current policy and migration implication |
|---|---|---|
| `expansion.streams` root/cells/log | seeded `:23-40`; main `:5361-5364`; save `:81` | Schema 1. No streams → derive from saved expansion RNG, fallback 1 without expansion; legacy RNG unchanged. Unknown cell names retained, future schema rejected. Cursor root is stable after creation. No generator/table revision in generic receipt. |
| `native_encounter` lineup/stats/turns/loops | combat `:66-68`; seeded `:113-135`; main `:5365-5369`; save `:82-83` | Schema 1; absent means legacy new encounter behavior. Present needs matching location/templates and streams. Preserve frozen current fight; no reconstructing enemy from updated template. |
| `mixtures` profiles, hiddenMethod/witness, products, knowledge, methods, job, sequence/lastObservation | mixture state `:15-45` | Schema/revision 1; missing stays null until action. Profiles/hidden method/products/methods each revision 1; owner seed and resolved truth retained. Product ID is content-derived `m1:` JSON, not sequence. `sequence` is a mutation count. |
| Mixture product refs and exposure | mixture state `:64-74,84-98`; native `:24-35,38-43` | All holders scanned for canonical product key. Queue holds exact inputs/due/remaining; knowledge observed/time/source; exposure revision 1, product/dose/timing/replace policy. Product validator reruns current revision-1 law; updating law in place would reject/alter old saves. Freeze v1 evaluator. |
| `generated_people` and each traveler | people `:22-41`; UI `:4-5`; save `:63` | Schema 1, seed/final RNG/enrolledAt/lastMinute and exactly three resolved people. Individual grammarRevision 1; no generator revision/seed path/world/life. Template/culture/current allowed traits hardcoded. Absence null, no retroactive enrollment. Removal of an old template/culture would reject existing records. |
| `expansion.simulation.decks`, `storyletSchema` | deck `:15-17,77-98` | Schema 1. Opt-out keeps absent; enabled missing deck created at scheduler boundary, not retroactive history. Four fixed deck IDs/intervals required. Cards save seen/last, misses, due, RNG, counters and last 20 receipts. No separate table revision. |
| Storylet occurrence / response | simulation `:404-418,433`; contracts `:258` and following validators | Definition revision 1, frozen responses/effects/expiry/label/cause/discoveredBy/roll; response result retained. Terminal events pruned after 100; durable causes/claims remain. Pending card must retain old terms across table changes. |
| Existing generated actors/jobs/rolls | simulation `:63-70,211-213`; resolution `:15-25`; expansion `:278-284,529-530,559-579` | Stable spawn cause+instance key and frozen template; definitionRevision and job/roll revisions. Legacy state readers already retain commitments; GA2 should wrap these concepts, not copy actors/inventories/history. |

Adjacent/P1-native saved records complete the draw-owner inventory; these are not new GA2 stores:

| Saved record / source | Revision and old-save behavior |
|---|---|
| Native crafted quality, loot/gather/reward results and vendor stock, `src/main.js:5147-5156`; recipe quality `src/crafting_recipes.js:172,206,225,236,257,302` | Existing canonical inventory keys plus counts retain generated quality/components; all inventory categories/holders serialized. No per-result generator/recipe/table revision envelope. Existing keys and template decoders remain compatibility authority; GA2 must not normalize keys or reroll quality. Native effects/money/XP/action completions retain consequence, not a new generated record per reward. |
| NPC trader refresh and activity progress, `src/main.js:5083-5088,5116-5120` | Trader last_refresh and persisted inventory define remaining epoch stock; keyed generation is for eligible refresh. Activity gathering_time/gathered_materials/earnings retained. No table version or universally frozen future harvest. Old format remains supported by its native loader, not a new replay of historical rewards. |
| Automatic checks/commands/controllers, `src/simulation.js:63-71,211-213`; `src/simulation_effects.js:378`; `src/simulation_contracts.js:217-249` | Existing simulation schema 1-6 conditional reader. Checks save RNG/due/attempt/misses; caused checks have definitionId and cause. Spawned people definitionRevision; jobs freeze revision, effects/terms/participants; controllers retain due. No generator-wide revision. `loadExpansionState` migrates engine schemas 1-4 before validation (`src/expansion_engine.js:267-271`); no auto-enrollment for absent simulation. |
| Duel/party/feature sessions, `src/native_battle.js:13`; `src/party_battle.js:37`; `src/feature_expansion_battle.js:99`; `src/native_battle_contracts.js:5` | Session nativeBattle carries schema, saved seed/actions/HP and frozen session terms; party uses schema 2, feature schemas delegated to world validator. Preserve current battle reader, not generic record schema replacement. Missing session is no pending battle. |
| Chronicle cue/session and NPC public lives, `src/chronicle.js:224-225`; `src/npc_lives.js:22-31` | Cue/session saved in expansion chronicle; RNG belongs to expansion. Public lives schema 1 saves complete future events/death years and current news; absent owner remains opt-in. Future biography is filtered by its view. |
| Offer solicitation, `src/audit_remainder_offers_state.js:50-55,83` | Schema 1 nested solicitation, generationSeed/derived seed/cause/candidate revision/template/wage/status. Source engine-schema constraints remain; no alternate roster drawn on restore. |
| Structured beginning, `src/structured_pack_runtime.js:41,77`; `src/structured_pack_state.js:17` | Selection schema 2 pins seed, choice, pack revision/content and snapshot hashes; registration schema 1 pins world/location/person/container refs. Missing optional selection stays absent. Unknown pack or mismatched pinned hash is a content/compatibility gate, not permission to pick another start. |

## A5: registration and transaction chokepoints

| Live point | Responsibility to preserve |
|---|---|
| main `:1-7,406,450-452` | Module imports, P1 binding, generator seed providers. |
| main `:1296-1307`, `:8325-8327` | Elder-gated optional storylet enrollment and panel; simulation content `storyletDefinitions` join feeds `expeditionRegistry` (`src/expedition_content.js:39-40`). |
| main `:4696-4708,4717` | Mixture actual means/use; stage validated save and durable write before publishing stock/effect/knowledge. |
| main `:5196,5238-5241` | Serialize optional mixture owner, traveler snapshot and expansion incl. streams/decks; native encounter snapshot serializes at `src/main.js:5052`; restore belongs to existing combat host. |
| main `:5342,5359-5369`; `:445` | Restore mixture before inventory decoding, generated people before use; expedition initialize/load/ensure streams; pending native encounter. Durable life storage also restores traveler envelope. Order matters. |
| main `:8408-8413,8436-8441` | Ingredient gathering/panel and traveler read/save/persist/supply/reward registration. |
| save `:1-3,33,47,63,80-83` | Validate mixture whole-envelope references; population clock; expansion/deck/streams/native encounter before import publication. Registry port must not weaken cross-owner validation. |

## A6: determinism tests inspected, not run

| Test file:line | What it replays; limit |
|---|---|
| `tests/seeded_streams.test.js:15-22,23-32,33-46,47-57,58-68` | Same-root streams; isolation/key order; JSON restore and old-root fallback; pure decisions/distributions; receipt retention. |
| `tests/seeded_streams.test.js:69-80,84-125` | Proxy and failed craft rollback; bundled real lineup/loot/trader/turn continuation with Math.random forbidden and presentation/timers replaced. This test itself builds a temporary bundle; GX4 did not execute it. |
| `tests/mixture_state.test.js:7-16,33-40` | Golden local seed/profile, correlated conservation, preview purity/input order; retained method/witness, exposure serialization. No whole-game next-combat proof. |
| `tests/mixture_native.test.js:8-12,18-27,42` | Cost/write-failure atomicity, pending batch reload/shortage and exposure publication. |
| `tests/generated_people.test.js:6,10-13` | Same/different seed; chunk vs long hourly projection; restore/absence; encoded-file importer; failed UI durable publication. Native file picker not exercised by a Node test. |
| `tests/name_grammar.test.js:3-13` | Same/different seeds, collisions/reservations, world table and exhaustion. |
| `tests/storylet_deck.test.js:22-39,51-59,84-90` | Same/different deck seed, preview unchanged, pending JSON restore/next draws, encoded import rejection. Once filter asserted, not a standing direction endorsement. |
| `tests/simulation.test.js:71-97,120-124,192-204`; `tests/simulation_extensions.test.js:60-77,96-107` | Old schema, frozen commitments, long vs split/reloaded state incl. RNG; preview weights and guaranteed eligible checks; scheduler bounds/failure. |
| `tests/party_battle.test.js:69-77`; `tests/chronicle.test.js:19-24,91-102`; `tests/expansion_engine.test.js:26-61,76` | Saved action RNG, historical schema/cursor preservation and frozen results. These are adjacent tests, not full generation conformance. |

The merging session's 679/679 is STATED in the status map. GX4 ran zero runtime tests; no new passing count or native proof claimed.

## A7: remaining unseeded references, exact census

27 references on 27 lines: 25 calls, 2 default function references. Mechanical census is attached. No direct resource/combat/loot outcome `Math.random()` remains in inspected P1 native hosts, but latent fallback paths still exist.

| Owner and exact sites | Count | Classification / proposed lane |
|---|---:|---|
| `src/combat_math.js:34,44` | 2 defaults | Gameplay hazard if a new caller omits injected RNG. Current inspected native/party/feature hosts inject it. GA1 port should require explicit random, with old supported caller compatibility verified. |
| `src/misc.js:69` via `src/crafting_recipes.js:206,236,302` | 1 call, 3 callers | Latent gameplay-quality path. Main commits use seededRecipe; original roll_quality is still unseeded if invoked directly. Guard each future crafting/invention/equipment/NPC-maker port. |
| `src/main.js:2531` | 1 call | Floating-click appearance. Presentation owner, not reward stream. |
| `src/main.js:2606,2609,2630` | 3 calls | Failure-text variants; narrative replay, not outcome determination. P15 text authoring / P40 hazard owner. |
| `src/main.js:3522,3524` | 2 calls | Dialogue word gag. Save identity/outcomes unchanged, but text not deterministic. P15/P36 text scope if selected. |
| `src/main.js:7635,7636,7639,7642` | 4 calls | Ambient line occurrence/selection; frame/native-loop timing affects logs. P35 sound/presentation and P40 audit. Must not feed causal receipts. |
| `src/display.js:361,376` | 2 calls | Floating-text motion/side. Presentation-only allowed exception. |
| `src/particles.js:5,7,8,9,10,16,43,49,72,85,86,102` | 12 calls | Particle geometry/visual noise. Presentation-only allowed exception. |

Totals: 24 presentation/narrative calls, 1 latent range call, 2 gameplay defaults. Recipe getResult implementations call roll_quality (`crafting_recipes.js:172,225,257`); original display calls remain at `display.js:3068,3132,3146,3208,3511`. Their concrete recipe type/arity decides whether quality is evaluated, so whole-render draw purity is not proven merely by the native Proxy test.

Which lanes add draws next (INFERRED risk, not a claim that they already added calls): GX5 appearance permutation; P5 talents/secrets/households/lore/pacing; P6 and CR/WR maker/product/rune families; P8 harvest/renewal/supply; P9/P10/GX1 origin/era/continuity tables; P11-P34 requests, story cast and outcomes; P35-P37 subtle text/sound; G1-G6 addressed kit/overlays/pins; cheat board/lens lanes. Each registers a purpose, algorithm revision and replay fixture rather than copying PRNG or accepting combat defaults. GX4 guard overlaps core A5 and P40, which keep their owning evidence.
