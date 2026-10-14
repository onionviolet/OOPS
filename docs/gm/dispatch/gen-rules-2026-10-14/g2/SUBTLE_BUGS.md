# G2 subtle-bug audit

Proposal, 2026-10-14. Revision aliases and coverage are in [CONFORMANCE](CONFORMANCE.md). H is the integrated main snapshot `9f5c7a98`; B is the requested 63-reference snapshot `12179d0f`. SHOWN means read code or a stated small source probe. INFERRED play effects and fixes below are proposals. UNKNOWN means no concrete hit was established. No browser play, player save, full suite or replay harness was used.

## SB1: no live preview draw leak established in the named paths

SHOWN: H:src/simulation.js:131-143 makes a detached `plan`, then clones each possible candidate before preparing/applying effects. The actual outcome advances `s.seed` at H:src/simulation.js:183-187, after admission. H:src/simulation_resolution.js:11-32 copies effects, aliases spawns and resolves numeric amounts without drawing. H:src/power_models.js:5-54 computes numeric legality without RNG. B:src/simulation.js:445-453 likewise executes response validation on a detached plan. H retains this structure, with shifted lines. These are negative findings, not a reproduced SB1 hit.

SHOWN latent API trap: H:src/seeded_streams.js:75-77 returns a stable keyed value but appends to the saved receipt log. It is not a side-effect-free peek. A direct probe left `cells` unchanged but changed `log`; `unitDecision` at lines 47-51 left the whole stream owner unchanged. INFERRED: a future quote using `gameKeyedRandom` could evict evidence just by opening menus, even though it does not move luck. Smallest fix: call pure `unitDecision` in previews and publish receipts only on commit. No existing named preview caller of that wrapper was established.

SHOWN craft boundary: H:src/main.js:4214 wraps the recipe only inside commit execution. H:src/seeded_streams.js:102-109 leaves the original recipe in display previews. Display `getResult()` sites at B:src/display.js:3068,3208,3511 are item-recipe paths; B:src/crafting_recipes.js:70 returns the fixed result there. The quality-producing `getResult(material/components)` methods at H:src/crafting_recipes.js:169-172,222-225,255-257 must not be mistaken for those preview calls. No live preview use of those quality methods was found. H:src/mixture_ui.js:21 calls pure mixture resolution on retained truth or a root-seeded temporary owner, not a draw cursor.

Gate: A5 should compare the full state, stream cells, logs, pending jobs and native budgets before/after repeated eligible and rejected previews, including spawn/event effects, responses and mixture UI read paths. UNKNOWN: exhaustive transitive purity of every world-specific facts adapter. G2 does not declare every adapter proven pure.

## SB2: quote dismissal is distinct from cancelling committed work

SHOWN: previews above return data and do not publish detached state. B:src/expansion_engine.js:643-656 and H:src/simulation.js:305-320 cancel already committed jobs; those jobs have legitimately rolled and reserved costs. Neither restores the old cursor. Remainder cancellation closes the retained solicitation rather than generating a new roster (H:src/audit_remainder_offers_state.js:164-166).

UNKNOWN: no concrete quote-dismissal path that consumes a saved draw was found. INFERRED fix/gate: keep quote dismissal a no-op; A5 compares next addressed values after zero, one and many previews/dismissals. Do not implement cursor rewind for paid-job cancellation as an SB2 fix. It would change disclosed commitments and allow farming frozen results.

## SB3: key insertion order feeds the gather stream; serialized property order chooses NPC actions

SHOWN hit: H:src/main.js:4738-4742 iterates `Object.keys(recovery_chances)` and calls `gameRandom(STREAMS.gather, key)` for each. H:src/seeded_streams.js:70-73 increments one cursor for the whole gather stream. A probe with `{a,b}` versus `{b,a}` produced different per-key draws from the same root. This is insertion order, not a claim that current item names are integer-like keys. The root's integer-key warning would worsen it if such content arrives.

INFERRED play effect: moving one recoverable entry in an item's definition changes which container/material returns, and shifts subsequent gathering luck. Smallest fix: keyed draws by consume-action ID plus recoverable item ID and purpose; code-point-sort the table for stable receipt ordering. Sorting alone still leaves same-stream insertion sensitivity.

SHOWN second hit: H:src/simulation.js:530 breaks equal-priority controller ties using `JSON.stringify(candidate)`. Semantically equal candidate objects with different property insertion order can sort differently, changing which eligible action is committed at line 537. That action may consume the shared command seed at lines 183-187. Smallest fix: explicit stable candidate ID as the tie-break. Do not hash raw authored object serialization as its identity.

Gate: A5 permutes equivalent object property insertion order and content-map order, then checks selected actions and per-subject receipts. P2 already canonicalizes ingredient input order (H:src/mixture_state.js:50-62); the mixture resolver's reversed-input probe passed.

## SB4: locale sorting feeds weighted picks and shared command draws

SHOWN hits: H:src/storylet_deck.js:31 sorts card IDs with `localeCompare` before the cumulative pick at lines 62-64. H:src/simulation.js:527,530,550 sorts controllers, candidate JSON and actor programs before starting commands that share `s.seed` at lines 183-187. Event-check sorting at line 504 can also change facts/sequence before later checks even though each automatic check has its own RNG. B:src/npc_lives.js:21,51 affects same-year news order but does not feed another lifespan draw. H:src/generated_people.js:57 affects a utility tie, not a fresh random draw.

SHOWN probe: valid ASCII IDs `a_z`, `az`, `a-z` sort as `[a_z,a-z,az]` in English and `[a_z,az,a-z]` in Thai under this Node/ICU installation. The first attempted two-ID example did not differ; the corrected three-ID probe did. This demonstrates a permitted-key risk, not an observed change in the current 14-card Village deck across the user's browsers.

INFERRED play effect: identical roots and tables can select different cards or distribute shared command luck to different actors across locales. Smallest fix: explicit code-point comparator for machine IDs, stable candidate ID for ties; preserve locale sorting only in presentation. Gate: A5 runs locale/environment comparisons and a deterministic injected comparator fixture; source-only Node behavior is not browser proof.

## GR17: game-time scheduling is not game-time addressing

SHOWN direct tick hit: native gathering increments `gathering_time` by one per update (B:src/main.js:7485; H keeps that loop) then consumes chance/count/quality rolls at H:src/main.js:7563-7569. Ordinary `update_timer` can consume more than one game minute for sleep or explicit travel (B:src/main.js:7150-7161), while the native loop is reached once per successful update (B:src/main.js:7244-7246). Ambient sound chances also run per update, H:src/main.js:7634-7641. No day/hour/window address appears in those keys.

SHOWN minute/cursor hit: H:src/main.js:729 keys local-life calls as `local:${context.clock}`, using a stream ordinal as well. H:src/absorb_c2/local_life.js:59-62,75-79 deliberately admits at most one attempt per observed clock step, resetting search progress. One 15-minute jump and fifteen one-minute steps can offer different counts of search attempts. This is deliberate current source policy, but fails the proposed time-partition contract. It is not a literal frame-number key.

SHOWN cursor-only hit: H:src/storylet_deck.js:43-45 advances a mutable RNG and lines 56-57 use `due = state.clock + interval`. H:src/simulation.js:504-512 instead advances anchored `due += interval` but still draws from an eligibility-dependent cursor. The common engine walks causal boundaries (H:src/expansion_engine.js:626 caps a batch and returns unspent time); normal split advances may therefore agree. A direct late deck call can drift the next due time, and neither system addresses a draw by its due game-time window.

SHOWN wall-clock influence, not a wall-clock hash key: H:src/models/combat.js:136,231 uses `Date.now` for attack timing. It uses keyed per-turn draws at lines 79-80, so the callback schedule can affect which actor attacks first without changing that actor's keyed number. Keep draw determinism and event scheduling determinism as separate gates.

INFERRED smallest fix: assign native gather cycles and local attempts explicit game-time windows; use scheduled `due` as the event slot before incrementing it. Retain finite catch-up budgets and current pause/support rules. A local-life cadence change needs an explicit compatibility decision for `searchProgress`, `lastHubAttempt` and saved counters; do not silently replay historical opportunities. Gate: A5 compares equal game-time advances in partitions including sleep/travel and interrupted catch-up. Browser background timing remains an integration gate for combat.

## SB5: concrete modulo reducers, tiny arithmetic skew

SHOWN: H:src/npc_lives.js:9 uses a 32-bit hash `%20`; H:src/mixture_state.js:19 uses `%5`; H:src/name_grammar.js:16 uses `%choices.length`, currently 120 possibilities. Closing delta L:src/anchor_snapshots.js:47 also uses `%windowWidth` for inclusive integer event windows. The 32-bit domain has remainders 16, 1 and 16 for those divisors. `%2` at H:src/chronicle.js:225 divides 2^32 evenly, so do not call that the same modulo-bias hit. Xorshift omits zero, which is a separate tiny state-space asymmetry.

INFERRED play effect: the arithmetic bias is far below visible balance noise for these small tables, but becomes a copied bad selector. Smallest fix: shared fraction-based or rejection-based integer picking for unseen values. Keep already saved dates, profiles and names. Linear collision scanning in names creates a much larger order-dependent skew than modulo itself. Gate: G1 owns the pick primitive; distribution tests need bands and candidate constraints, with A5 checking frozen values stay unchanged. Prioritize SB18's rounded-endpoint bias first.

## SB6: one-lane hashes and copied cursors

SHOWN: H:src/seeded_streams.js:14-21 and H:src/simulation_resolution.js:4-6 produce one 32-bit lane. Independent xorshift implementations remain in H:src/expansion_engine.js:517-521, H:src/simulation.js:39, H:src/native_battle.js:47, H:src/party_battle.js:87, H:src/feature_expansion_battle.js:279 and H:src/storylet_deck.js:43-45.

INFERRED play effect: growing address sets collide; changing a copied algorithm changes just one subsystem's luck. Smallest fix: G1 versioned two-lane address hash for new generators; retain old cursor readers until migration explicitly opts in. No current pair of gameplay IDs with a demonstrated 32-bit collision was found. SB24 adds a demonstrated Unicode encoding collision distinct from normal hash-width collision odds.

## SB7: float weights and sums remain

SHOWN: H:src/storylet_deck.js:37-39 multiplies integer bases by `0.6**seen`, `0.5` and `0.25` pity increments. H:src/expansion_engine.js:371-386 normalizes arbitrary finite weights then applies float probability transfers. H:src/simulation_resolution.js:36-40 and H:src/seeded_streams.js:88-91 permit floats. H:src/rules.js:43-53 adds cumulative floats with a last-positive fallback.

INFERRED play effect: near an interval edge, changed summation order or rounding can move a pick. No ordinary card currently shown to flip solely because of float rounding. Smallest fix: G1 integer/fixed-point weights, explicit rounding policy and integer contribution receipts; preserve authored ratios by a declared scale. Gate: zero-weight, edge-draw and order fixtures plus distribution bands. Re-scaling weights changes unseen outcomes and needs a table revision.

## SB8: adding a card changes every card and the quiet rate

SHOWN: H:src/storylet_deck.js:62 uses `quiet + sum(all eligible card weights)`, then one cumulative pick. No category-first choice exists. Adding an eligible card shrinks each old card's share and lowers quiet probability. H:src/models/location.js:348,361 selects uniformly from whole group/enemy arrays, so additions similarly dilute old entries.

INFERRED play effect: a content expansion can make a Village busier and weaken the relative rate of existing threats without a balance edit. Smallest fix: G1 stratified category-then-entry selection and G3 tag-overlay policy. Gate: compare per-category and quiet mass before/after adding an equal-weight card. This is a balance proposal, not permission to change current rates.

## SB9: rarity assurance is partial, not universal

SHOWN: H:src/enemies.js:440 gives a loot entry probability `.002` with no pity schedule in the loot loop at lines 170-179. Under an independent-roll model, 500 eligible kills still have about a 36.75% chance of no drop. That is an inference about the roll model, not an observed 40-hour play result.

SHOWN counterexample: H:src/simulation.js:512-515 supports `guaranteeAfter`. H:src/storylet_deck.js:39 caps a family weight boost at 4; positive boost is not a finite guarantee.

INFERRED smallest fix: per-world rarity policy on eligible windows, not a global mandatory guarantee. Gate: P18 farms eligible encounters and records reachability; A5 checks persisted pity survives reload/import. Existing seed counts alone do not prove rare content reachability.

## SB10: independent loot/crit streaks; local contact already has pity

SHOWN: H:src/enemies.js:170-179 and H:src/models/combat.js:411 perform per-opportunity rolls without a shuffle bag/pity owner. H:src/absorb_c2/local_life.js:64-68,78-81 retains misses and increases odds; storylets also penalize seen cards and repeat families (H:src/storylet_deck.js:37-39).

INFERRED play effect: unlucky loot or combat clusters remain possible. This is a policy gap, not inherently broken combat. Smallest fix: opt-in world luck shape through G1; keep independent worlds independent. Gate: distribution/streak bands appropriate to that policy, with persistence of bags/counters. Do not install pity globally from this audit.

## SB11: deck-local emissions are counted as player memory

SHOWN: H:src/storylet_deck.js:17 stores `cards` and `lastFamily` per deck. Lines 71-73 increase `seen` before emitting. There is no shared observer repetition owner consulted by `storyletCandidates`. An emitted but unnoticed card can count as seen; two decks do not share family recency.

INFERRED play effect: closely related cards from different decks can follow each other, while unnoticed events suppress later visible content. Exact duplicate card IDs are currently separated by a card's declared deck, so do not claim that the same current card exists in two decks. Smallest fix: observer-owned recent-card/family memory updated on real reveal; keep deck generation/attempt counters separate. Gate: A5 observer/visibility replay cases; P18 evaluates repetition across decks. New memory fields require migration with an empty legacy observer history, not reconstruction from pruned logs.

## SB12: positive correlation example; no present genealogy bug proved

SHOWN: H:src/mixture_state.js:19-24 shares an axis between family fractions. H:src/npc_lives.js:12-20 carries parent IDs, but its lifespan draws at line 9 do not use parent traits. H:src/generated_people.js:18-25 rolls three travelers independently; they are not declared siblings, apprentices or a product batch.

UNKNOWN: no current generated family inheritance consumer was established, so independent traveler traits are not an SB12 bug. INFERRED future fix: require parent/batch fact inputs when a generator declares those relationships. Gate: a family/batch invariant fixture once that consumer exists, not a new milestone gate now.

## SB13: collision hygiene exists; blocklist enforcement is missing

SHOWN: H:src/name_grammar.js:14 blocks existing full names, authored names and authored first names case-insensitively; lines 17-19 scan for an unused result. P4:tests/name_grammar.test.js:6-12 exercises collisions and exhaustion. No small accidental-word blocklist is consulted. The present authored syllable pools have no concrete offensive-name hit identified.

INFERRED smallest fix: P15 lint the approved grammar pool against a modest declared blocklist, then retain resolved names. Do not report a bad name merely because a filter is absent. Gate: exhaustion and canonical name collisions plus P15 review; no need to block wave 1 for hypothetical name accidents.

## SB14: branch-dependent retries/roll counts shift later subjects

SHOWN hit: H:src/main.js:4264-4274 makes extra success attempts near a skill level boundary, each consuming `gameRandom(STREAMS.craft, recipe-attempt)`. The shared cursor at H:src/seeded_streams.js:70-73 means those extra attempts shift the next recipe's quality/count draws. H:src/main.js:4388-4396 and4503-4513 also draw a prototype result quality before the per-item quality loop; that discarded sample shifts later craft luck. This is an extra-attempt/discarded-candidate hit, not a literal validation-retry loop.

SHOWN parallel issue: H:src/models/location.js:340-341 uses a local `draw++` composition slot for every branch/stat. Adding a rejected candidate or a new stat draw inside that generation shifts subsequent slots within the encounter. H:src/generated_people.js:15-25 similarly uses one roster-local cursor; an extra traveler trait draw shifts subsequent travelers.

SHOWN non-hit: H:src/name_grammar.js:17-21 scans candidates from one hashed offset without advancing another subject's cursor. Exhaustion throws, but collision retries do not consume shared luck. It still lacks a named fallback (GR6) and has scan bias (SB23).

INFERRED smallest fix: entity/action-local slots and explicit `attempt` parameter; replace metadata-only `getResult` calls with a nonrandom result-shape query. Preserve current paid-attempt counts and XP policy. Gate: A5 inserts a rejected/discarded candidate or one extra attempt, then asserts unrelated subject slots remain equal. Source-only branch tests that compare identical draw order cannot close this gate.

## SB15: seed disclosure is not a present UI leak finding

SHOWN: H:src/mixture_state.js:75-79 renders unobserved products through a knowledge check. H:src/generated_people.js:62-66 hides unmet names/unknown traits. H:src/main.js:2-3 passes seeds internally; no player-visible world-code/seed override in those paths was established. G2 did not open files named `SECRETS*` and records no rolled secret truth. Closing delta L does add a displayed seed/override, but only behind localhost `?start_probe=1` (L:src/start_probe_ui.js:4,7,45), as the root requires for dev overrides. It is not an ordinary seed-visibility violation. A distinct knowledge-projection gap is shown at L:src/main.js:8240-8241: the persisted beginning milestone includes every chosen layer ID even when the start resolver marked an axis hidden (L:src/start_records.js:64). The card masks those axes at L:src/start_probe_ui.js:34,41. INFERRED: if that milestone is later shown unchanged, an unknown start layer becomes known outside its discovery route. Smallest fix: persist truth provenance separately and render a hidden-aware milestone; A5/source fixtures should ensure changing hidden layers does not expose their IDs in player-facing records. No particular hidden layer truth is reported here.

UNKNOWN: no concrete displayed-seed leak found in the scoped routes. INFERRED smallest fix: keep future codes/dev overrides separate from ordinary projections; P22's director UI needs explicit knowledge filtering. Gate: secret IDs/routes only in audits, and browser checks of their discovery projection when a seed-sharing UI is actually added.

## SB16: mixture origin law is implicit and globally resolved

SHOWN gap: H:src/mixture_state.js:62 stores revision/unit/consumer and a Village product ID but no explicit `originWorldId` or origin-world law tag. `stageMixtureAction` at H:src/mixture_native.js:5-18 has no world-law input. The panel is restricted to Village at H:src/main.js:8397-8399, but item law validation resolves through the singleton mixture owner (H:src/mixture_state.js:84-90).

INFERRED play effect: future cross-world stock/use must infer home rules from a product string; a second world's mixing law cannot share the carrier safely. No current crossing route demonstrated changed dose laws. Smallest fix: explicit origin world and law revision for new product identities; retain schema1 as `base.frontier`/current Village law through a compatibility reader. Gate: cross-world carrier roundtrip and origin-law dispatch when such a route is integrated, not an immediate new world requirement.

## SB17: actual P1 legacy migration contradicts the root summary

SHOWN hit: H:src/seeded_streams.js:25 derives the root from the supplied seed; lines 38-39 default that seed to saved `state.rng`. H:src/main.js:5363 passes `save_data.expansion?.rng ?? 1` on old save load. P1:tests/seeded_streams.test.js:32-43 explicitly expects deterministic back-derivation from the old RNG and a shared fallback for pre-expansion saves. The root says P1 already supplies a fresh root; that claim is contradicted by code. A direct probe produced different new roots for legacy cursor values 1 and 2.

INFERRED play effect: prior legacy actions determine new stream roots; pre-expansion saves all receive the same new-stream root. Existing stream owners must remain frozen once created. Smallest fix: root/integrator chooses an explicit compatibility policy. If following SB17, mint a fresh root once at durable migration before enabling generation; do not mint at every load or overwrite existing roots. A user-exported old save imported independently twice needs a declared identity/reproducibility rule rather than an accidental choice.

Gate: A5 checks absent-stream migration, failed write/reload, established-stream import, repeated old-save import and preservation of legacy cursors. Migration behavior is already merged; change it only with that compatibility decision.
