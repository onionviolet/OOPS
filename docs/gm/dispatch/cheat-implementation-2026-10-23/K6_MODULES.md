CHECKPOINT: K6 modules lane, 2026-10-23. Read-only audit; one file written; no src/tests edits, no git. Everything here is a proposal (not accepted direction). Labels: SHOWN = read in code/doc this pass, STATED = a doc says it, INFERRED = my reasoning.

# K6: Cheat modules and the existing module system

Codes: F findings, D decisions to make, M modules, R risks. AR1-AR16 (docs/ARCHITECTURE_RULES.md): AR1 main.js is a root; AR2 register through the domain registry; AR3 one authority per fact; AR4 inject few ops; AR5 no import cycles.

## F. Findings (what already is the module system)

- F1 SHOWN: `src/rule_modules.js` (122 lines) is a real, tested module system. Schema 1, one resolver `village.mix@2`, kinds `world_law | generated_law | institution_policy | cheat_overlay | learned_technique`. `kind` is only an enum check in `validateRuleModule`; nothing branches on it. No `cheat_overlay` module exists in src (grep: kind appears only in the enum). Consumers: `world_pack.js`, `world_pack_loader.js`, `mixture_rules.js`, `check_rule_pack.js`, tests `rule_modules.test.js`, `world_pack.test.js`, `check_resolver.test.js`.
- F2 SHOWN: a module is inert data: `scope{worldId,instanceId,continuityId}`, `selector{routes,subjects,requires}`, `priority{layer core<world<region<actor<director,...}`, `effects[]`. Effect kinds: `parameter` (only target `oral.restore_availability`, ratio math), `gate` (veto/permit/exempt on physical/means/access/selection/obligation), `observation`, `consequence` (record only). `resolveRuleEffects` returns detached proposals plus a receipt; "never owner writes". `createRuleLock`/`validateRuleLock` give a fingerprint over the sorted module set.
- F3 SHOWN: the fact vocabulary is closed: `RULE_FACTS` has five facts (`procedure.process`, `input.mass`, `source.ready`, `station.owned`, `evidence.witnessed`). Unknown fact or op fails admission.
- F4 STATED: docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md MMR7 "Cheats that edit rules ... scoped and receipted so saves stay coherent", MA3 "Rule module ... world laws, generated rules, social rules, cheats", MMR4 priority "specific beats general, world beats core, later overlay beats earlier". So `cheat_overlay` was reserved on purpose for MMR7.
- F5 SHOWN: the "knowledge" half already exists. `simulation_contracts.js` knowledge records carry `stage` (seen/interpreted/understood), `value`, `at`, `basis`, validated per person; `people_knowledge.js` `knownPeopleView` projects witnessed content only ("never an NPC's hidden state"). This is AB2 observation and AB4 display in embryo. CHEAT_LIBRARY's own correction ("II2 ... keep a retained reading's value, time and cause, as simulation_contracts.js and people_knowledge.js already do") agrees.
- F6 SHOWN: `seeded_streams.js` already has named streams (`STREAMS`, `scopedStream`, `streamSeed`, `nextOrdinal`, `drawUnit`, `keyedUnit`, `rollChance/rollInt/rollTable`). `keyedUnit(state,stream,key,n)` and `unitDecision` are keyed, so they read without advancing the ordinal; `drawUnit` advances. STATED (LIBRARY corrections): II6/AB7 "as new builds duplicate what exists; keep only adapters". So AB7 is an adapter, not a stream system.
- F7 SHOWN: `src/carry_ledger.js` (36 lines) is data rows `{boundary: death|rebirth|world crossing, what, carries|halved|drops|unavailable, scope: this life|last life|any life, note}` for two worlds only (`base.frontier`, `book.paradise.hub`). Paradise row: "Method, source, fuel, office ... unavailable on the far side"; "Body, cargo, memory, debt, observer carries". Throws for any other world id.
- F8 STATED: CHEAT_COSMOLOGY.md "what backs a cheat" (line 39): backings Soul, Body, Item, System, World law, Patron, Knowledge, Concept/meta. "Each part travels by its own rule." Placement card has Backing, Scope reached by feats, Outside (default compatibility mode).
- F9 STATED: CHEAT_LIBRARY "Implementation (proposal)" (line 187): a card can be a `source` in the content registry with capabilities/techniques and `actor.sources[cheatId]` state; hooks `onDayBoundary,onAction,onKill,onDeath,onRestart,onTravel,onObserve,onGift,onLevel`; phases C0-C5. The card has `observers` and `backing` fields.
- F10 STATED: AB1-AB10 (lines ~1400-1440) and the corrections: AB6 and AB9 "already two users" was overstated; expected cards are not implemented consumers (AB C5). Top pick 4: read-only fact adapter and redactor, stage 1 as second reader. LQ2 (dormant Export names the card) is open; LQ3 and LQ5 (quarantine keeps raw data inert with a reason, never a silent reset).
- F11 INFERRED: the repo has no `cheat_library` tab and no `checks/leak_lint.cjs` in the listing I could see (`ls checks` returned nothing; LQ doc says it was produced in a dispatch folder). Treat the lint as an existing probe artifact, not a gate.

## 1. Overlay versus card

D1 (recommend): **layered, not the same.** A cheat card is the holder's thing: identity, backing, state (charges, anchors), stages, observers, hooks, UI (F9). A `cheat_overlay` rule module is one *effect the card puts on the world's rules* while the card is active. A card may own zero, one or several overlays; an overlay never owns state.
- Why not "same" (INFERRED): a card has save state and hooks that run at day boundaries and kills; rule modules are pure, stateless and resolver-evaluated (F2). Merging would put state into a lock-fingerprinted object, which breaks `validateRuleLock`.
- Why not "separate" (INFERRED): MMR7 wants overlays "scoped and receipted"; the card is the scope's author. Overlay `id` should be derived from card id plus effect id (`cheat.<cardId>.<n>`), revision from the card version (see M5), and `scope.continuityId` from the holder's life, so quarantining a card removes exactly its overlays.
- What an overlay can change today (SHOWN): one numeric parameter (oral restore availability), gates on five targets, plus observation/consequence records. A price needs a new `parameter` target (e.g. `trade.price_factor`); a visibility change is an `observation` effect on the `knowledge` channel (records text, never alters truth). World-rule edits are bounded by `layers`: a cheat overlay should sit in layer `actor` (holder-scoped) and only `director`/`world` for a world-law cheat with a patron or system reach that the world accepts (default, dial, reason: world-wide reach needs the cosmology's "scope reached by feats").
- D2 (recommend): add targets only with a second consumer (rule of two). Candidates: price factor (trade.js and market stream), visibility gate (a "known unknown" record). Do not widen `parameter` into a free-form key space; keep the closed vocabulary (AR/MMR "no universal rule language" in the target-shape paragraph).

**Guard against silently altering saves.** SHOWN pieces: module admission rejects unknown fields/facts; `resolveRuleEffects` returns proposals and a receipt, never writes; rule lock has a fingerprint and refs list. Proposed (INFERRED): (a) store `ruleLock.refs` and `fingerprint` in the save, and on load recompute from the active card set; mismatch quarantines the overlay with a reason (LQ5), never a silent drop or re-roll; (b) every applied overlay writes its receipt row (`ref`, `status applied|superseded|exempted`) into the existing log/chronicle (OV4 every reveal is an event); (c) overlays are recomputed from card state on load, not persisted as their own save slice, so there is one authority (AR3); (d) a card version bump (M5) changes `revision`, and `compileRuleModules` already refuses two different bodies at the same `id` ("Conflicting active rule revisions"); (e) legacy saves have no overlays, so the migration is a no-op (AD "persistence needs a migration or an explicit compatibility decision").

## 2. Candidate modules

Owner = where it would live (AR2: register through the domain registry; AR1: one registration line, move one line out; AR5: leaf modules, nothing imports main.js).

| Id | Module | Owner file | Inputs / outputs | First two consumers (rule of two) | Verdict |
|---|---|---|---|---|---|
| M1 | Fact adapter + redactor (AB1+AB4, read-only) | new leaf `src/cheat_facts.js` (adapter over existing `*_facts.js`, `rules.js`, `world_knowledge.js`); redactor beside it | in: fact id, observer/lens, grade; out: `{state: exact/range/presence/hidden, text}` | status window rows; export summary and leak lint (same function) | **BUILD NEXT** (CHEAT_LIBRARY top pick 4; second reader is stage 1, a real next consumer). Keep read-only: no write path, no new fact store. |
| M2 | Observation retention (AB2) | extend `simulation_contracts.js` knowledge records (already `value,stage,at,basis`); add `grade` and `source` only if SH4 needs them | in: reading event; out: retained `{value, at, cause, grade}` | status window "as of"; SH4 True Appraisal | **WAIT FOR SECOND CONSUMER** (SH4 does not exist). Do not add a parallel store; extend the existing record (F5). |
| M3 | Milestone predicate (AB6) | `simulation_contracts.js` `validatePredicate`/`meets` + `rules.js` (SHOWN exist) | in: committed facts, clock source; out: boolean + reason | stage 1 known-skill milestone; awakening trigger | **WAIT FOR SECOND CONSUMER** as a module. The predicate evaluator exists; only the clock-source choice is new. Awakening is a real consumer, stage 1 is not yet implemented (F10 AB C5). |
| M4 | Named stream peek (AB7) | adapter in `seeded_streams.js` (use `keyedUnit`/`unitDecision`, no ordinal advance) | in: stream, key, n; out: unit without advancing | stage 1 board draw; SH1 Fate Ledger later | **WAIT FOR SECOND CONSUMER**. SH1 is the only consumer that needs peek; board draws use `drawUnit`. A12 says wait for the TE probe findings. |
| M5 | Card version + quarantine (AB9/FR1/FR2) | the C0 envelope (CHEAT_LIBRARY C0), next to the card validator; LQ5 smallest rule | in: held card + version; out: valid card or inert raw blob with reason | stage 1 board card; any first update to the status-window card | **BUILD NEXT** (LQ3: one invalid held card blocks normal load today, a real defect). Not a framework: version integer, `migrate`, `quarantine{reason,raw}`. |
| M6 | Carry ledger integration | `src/carry_ledger.js` + a `cheat` row set per backing | in: card `backing[]`, boundary, world; out: carries/halved/drops/unavailable + note | death menu (C2); a world crossing into Paradise | **BUILD NEXT, small**: add backing-keyed rows for base.frontier and Paradise (already data). Throwing on unrecorded worlds is a risk (R2). |
| M7 | Cheat overlay admission | `rule_modules.js` extension (targets) + a card-to-module compiler in the card owner | in: card overlays; out: validated modules, `ruleLock` | first real `cheat_overlay` (price or visibility); an enemy-held card (see 4) | **WAIT FOR SECOND CONSUMER.** Zero overlays exist; do not add targets for hypothetical cheats. A player-held and a rival-held card is the natural pair. |
| M8 | Cheat library tab | UI via the panel kit (docs/UI_RULES UR); data from `CHEAT_LIBRARY` markdown is not a runtime source | in: discovered cards only; out: a list | none yet | **NEVER-ENOUGH-USERS** as a game tab (sealed: a tab that lists cards names undiscovered ones). Keep as design docs; in-game, discovery shows through the status window (M1). Revisit only if a world needs a codex of *known* cheats (people_knowledge-style projection). |
| M9 | Leak lint as shared check | `checks/leak_lint.cjs` (LQ probe) | in: DOM/export/aria, spoiler classes; out: pass/fail | status window states (none, dormant, awakened); export summary | **BUILD NEXT** (A8 "build now"; every cheat lane runs it). Not a module in game code. |

Ordering (INFERRED): M5 and M9 first (defect and gate), then M1 with stage 1 as the second reader, then M6; hold M2, M3, M4, M7 until a second real consumer ships; skip M8.

## 3. Carrier and portability

Carry ledger rows are per world and per boundary (F7). A cheat's backing (F8) sets the row it uses:

| Backing | Death | Rebirth | World crossing | Failure mode |
|---|---|---|---|---|
| Soul / Knowledge | drops on this life unless the world carries it | carries (Paradise "Base cheat", "Memories": any life) | carries; memory relevance decays | relevance, not loss (F8) |
| Body | drops with the body (Frontier "Body, skills and levels" drops) | drops, heir starts fresh | carries with the body this life | lost on body swap |
| Item | belongings carry to the estate (last life) | last life via estate | cargo "must be bound before bodily passage"; Paradise: retained but "unavailable" for use | stolen, broken, blocked at a border |
| Contract (patron/obligation) | open obligations carry (last life) | carry (grievance, duty) | Paradise: "debt" carries, "office, credential, duty, curse, ally" unavailable | terms decide whether it can be taken back |
| System / World law | n/a | n/a | works only where the system reaches; world law stays home (Blocked) | frozen, reread or cut off |

D3 (recommend): a card declares `backing[]` (one entry per part, F8 "each part travels by its own rule"), and the carry ledger answers per part. Build rows as data in `carry_ledger.js`; the card never carries its own travel logic. Unrecorded worlds should return an explicit "no rule recorded" state rather than throw (R2); this keeps it a default with a dial, not a blanket. A cheat that fails to move stays on the holder as inert state with a reason (quarantine shape, M5), so the heir/return path can still restore it.
INFERRED test: Frontier death->rebirth with an item-backed card (estate path), and Paradise world crossing with an item-backed card (retained, unavailable).

## 4. Enemy-held cheats

The module boundary must make *holder* a field, not an assumption (INFERRED, consistent with F2 scope and F9 `observers`):
- Card state keyed by `holderId` (player or actor), the same shape as `actor.sources[cheatId]` (F9); no `state.player.cheat` singleton.
- Overlay `scope.continuityId` is the holder's life/instance; a rival's overlay resolves through the same `resolveRuleEffects` with the rival's roles in `context.roles.actor`.
- Observers (AB3 lens) run against any holder; the redactor takes an observer, so what the player sees of a rival's card is `presence` or `category`, not the card (OV5 symmetric counterplay; SE5 being read).
- Knowledge is per observer (`simulation.knowledge.<actor>`, SHOWN keyed by actor), so the rival's belief about the player's cheat is the same record type.
- Carry/loss: the same ledger rows apply; a stolen item-backed card changes `holderId`, nothing else.
- Priority: rival overlays sit in layer `actor`; world-wide effects need `director`/`world` layer plus the cosmology's reach evidence. Pushback needs an in-world agent with a reason.
Rule of two: player card plus first rival card are the first two consumers for M7.

## 5. Sealed secrets

AGENTS.md: agents may read sealed files; never show the truth to Weibao in chat, reports, indexes, commit messages or UI outside its discovery route. Sealed material sits in `docs/worlds/<world>/sealed/` and a sealed data file; franchise: the private pack (WORLD_SECRETS_AND_DISCOVERY.md line ~118, SHOWN).
- Cheat text splits in two: public shell (id, family, observable tell, grade names) and sealed truth (real mechanism, hidden costs, true reach). Only the shell reaches DOM, titles, aria, tooltips, settings lists, export and file names (SL1, STATED).
- M1 redactor is the single display path: UI, export summary and leak lint use it (II4/AB4). Spoiler class per fact: `public | on discovery | sealed-by-id`; the lint runs per state (none, dormant, awakened).
- LQ2 (OPEN, STATED): the dormant Export text names the card when decoded. Recommended rule (AB C6): redact the human-readable share summary; the full backup keeps real data so restore works. Do not "fix" by dropping the card from backups (would silently lose it).
- Receipts and overlay refs use opaque ids (`cheat.<cardId>.<n>`); refer to secrets by ID, route, status ("S2: route works"), never by truth, including in log rows and commit messages.
- M5 quarantine reasons must be generic ("invalid version"), not name the card.

## R. Risks

- R1 INFERRED: widening `RULE_FACTS`/parameter targets ahead of a consumer breaks the closed-vocabulary guard that makes admission safe.
- R2 SHOWN: `carryLedger` throws for unrecorded worlds; a cheat row lookup in a new world would crash a death menu. Needs a safe fallback before M6 ships.
- R3 INFERRED: an overlay resolved only at run time with no saved lock fingerprint can differ after a card revision; the fingerprint compare in section 1 closes it.
- R4 STATED: AB6/AB9 "two users" was overstated; counting expected cards as consumers repeats that error.

## 6. Dependency graph (text)

```
                  seeded_streams.js ---(peek adapter, M4 later)--+
                                                                  |
 rules.js + simulation_contracts.js ----> M3 milestone predicate  |
   (validatePredicate, meets, knowledge)        |                 |
        |                                       v                 v
        +--> people_knowledge.js ---> M1 fact adapter + redactor ---> status window (consumer 1)
        |        (knownPeopleView)         |    |                     export summary / leak lint (consumer 2)
        |                                  |    +--> M9 checks/leak_lint.cjs (spoiler classes)
        v                                  v
   M2 observation retention  <------ lens/grade (AB3)  ---> SH4 True Appraisal (consumer 2, not built)
                                          ^
 card (C0 envelope) --M5 version/quarantine--> actor.sources[cheatId] (holderId: player | rival)
        |       \
        |        +--backing[]--> carry_ledger.js (M6) ---> death menu (C2), Paradise crossing
        |
        +--overlays[]--> M7 compiler --> rule_modules.js (kind: cheat_overlay, layer actor)
                              |              |
                              |              +--> resolveRuleEffects --> proposals + receipt --> log/chronicle (OV4)
                              |              +--> createRuleLock / validateRuleLock --> save (refs, fingerprint)
                              v
                  rival card (consumer 2) uses the same shape, holderId = actor

 Build order: M5 + M9 -> M1 (stage 1 second reader) -> M6 -> [wait: M2, M3, M4, M7] -> M8 never (in-game)
```

## D. Decisions for Weibao (none block the build-next list)

- D1 layered overlay (above). D2 add overlay targets only per second consumer. D3 `backing[]` per part, answered by the carry ledger. Each is a proposal, not accepted direction.
