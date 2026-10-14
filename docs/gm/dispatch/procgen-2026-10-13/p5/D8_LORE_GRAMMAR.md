# D8: remembered local history and generated lore

Status: PROPOSAL, source-audited 2026-10-13; no implemented history grammar claim. Rank W2-2.

| Slice | Outcome Weibao can play | Owner docs | Dependencies | Proposed branch / port |
|---|---|---|---|---|
| D8-A One remembered deed | Complete a Village storylet, hear a generated account naming the same people, then receive a later history-dependent offer whose result changes with the earlier deed | [E6 Lore](../../../../emergent/E6_LORE_LAYER.md), [Timelines](../../../../TIMELINES_AND_DIVERGENCE.md) | P1 text stream, P3 resolved-card/callback adapter, P4 stable people/names mandatory. P2 knowledge/basis contract reused, mixing not required | `proc/w2-d8-lore` / 19420 |

## Live audit and direction

| Code | Evidence | Finding |
|---|---|---|
| F1 | `src/life_record.js:1,14-15`; `src/expansion_engine.js:210-211,529-531`; `src/simulation.js:404-407` | Biography, expansion history and event instances are bounded display/receipt windows. None is a durable typed history/callback authority. E6 needs its own small fact store, not mining prose after pruning. |
| F2 | `src/simulation_contracts.js:217-235`; `src/simulation_effects.js:110-113,281-284` | Per-person knowledge and provenance exist. A true fact, a witness account and a rumor must stay separate; generated prose must not grant omniscient knowledge. |
| F3 | `src/npc_lives.js:11-22,33-42` | Fixed life news is saved and filtered by calendar, but no general grammar or generated historical legend is present there. Reuse known P4 identities; do not regenerate existing named family history. |
| F4 | `src/simulation.js:398-403,423-438`; `src/simulation_resolution.js:9-29` | Occurrences freeze their text/participants and responses have authoritative outcomes. The callback consumer should subscribe to completed P3 receipts and freeze cast/text at commitment. |
| F5 | `src/game_time.js:35-41,64-73`; `src/simulation_contracts.js:223`; `src/expansion_engine.js:73-79` | Native calendar and scheduler already exist. A Village lore year is a mapped calendar value, not a new clock or an engine minute divided by a guessed year length. |

The accepted natural-course direction (`PROJECT.md:365-367`; [Timelines T1–T4](../../../../TIMELINES_AND_DIVERGENCE.md)) preserves causal history unless relevant causes change. USER_VISION's world-texture direction permits ordinary lore without compulsory reward. This slice's callback is one useful consumer, not a rule that every legend pays out. Original Village texture preserves one realm/one prestige, character-limited knowledge and desktop-first existing panels.

## Conflicts and gaps

| Code | Gap / conflict | Resolution proposal |
|---|---|---|
| R1 | E6 names overlap P4's name grammar | P4 owns names and identity. D8 grammar consumes bound names; it never rolls a replacement surname or creates a second person registry. |
| R2 | E6's grammar/tables, guards, annual legends, gossip and three long chains exceed one useful slice | Deliver three authored history types, eight bounded account templates and one callback chain. Annual legend rendering is a small display projection, not world simulation or temporal travel. |
| R3 | Generated history could overwrite canon or predict future facts | Separate authored `background` from actual `earned` facts; no backdating player deeds. Only declared original background IDs may be generated; no source canon changes. Future causal events remain P3/actor outcomes, not grammar decisions. |
| R4 | E6 suggests changing life_record folding and fact references | No biography schema change needed first. Store authoritative history separately and append optional safe text through existing milestone API. No rewards or callback predicates read that lossy text. |
| R5 | E6's private-pack absence proposal could silently lose actionable history | Preserve frozen text/typed IDs/revisions; missing optional content can display safe history but cannot execute a callback without supported definitions. Reject an active unsupported commitment rather than silently invent its result. |

## Implementation contract

Three declared fact types: `village.promise_kept`, `village.promise_declined`, `village.shared_work`. P3's selected ordinary request/work card emits exactly one kept/declined completion receipt; a later optional shared-work callback consumes that typed fact. The exact P3 card ID is an integration binding selected from its delivered deck, not a second independently scheduled copy. Callback eligibility checks same world instance, known evidence, surviving reachable participants and available means. No forced event if the original cause disappeared. One background record uses an original authored Village past-work template, clearly labelled local account, with generated P4 names only for actual admitted cast; do not invent ancient ancestry for a current stranger.

Optional owner: `expansion.loreHistory = {schema:1, worlds:{[worldId]:{revision:1, nextId:1, facts:{}, accounts:{}, legends:{}, callbackClaims:{}}}}`. Fact: stable ID, type, origin (`background|earned`), world/instance, clock/calendar anchor, actor IDs, declared outcome ID, authoritative cause receipt ID and visibility/audience IDs. Account: fact ID, speaker/witness IDs, basis (`observed|testimony|rumor`), saved safe line, grammar revision, line seed and audience. Truth itself does not carry a universally visible line. Validate reference integrity and declared type writers; only committed domain outcomes can add earned facts. Callback claim retains referenced facts across compaction and prevents duplicate settlement for the same occurrence, not all future similar work.

Grammar: plain data weighted choices with `#symbol#` and explicit bound actor/place slots, capitalization/possessive modifiers only. No eval, external LLM, arbitrary script or fresh name generation. Eight templates and a maximum of depth 8 / 240 characters. At each committed account, draw one seed from integrated P1 `text`; local keyed expansion uses that seed and symbol path. Display/preview never draw or re-expand. Save the resolved line and revision, so grammar changes cannot rewrite existing testimony or advance later text/combat streams. Invalid binding/symbol fails content validation before publication; runtime fallback is a safe neutral ID-linked account, never raw tokens or private truth.

First consumer: the later offer reads `history.village.promise_kept` or `.promise_declined` derived from typed receipts. A kept promise supports one useful paid shared-work offer; declining supports a different attainable ordinary offer, without an invented grudge or a universal lockout. Later text refers to the actual earlier participants, and its requirements/costs/stock use live actors. Player response may produce `shared_work`; text is generated from that outcome, not the other way round. Target callback window: day 3 deed, day 20 or later account/offer in seeded-native long-window proof. Also provide an ordinary short local demonstration window for natural journey; no real-time twenty-day waiting requirement.

Small history/legend extension: closing a year creates one stored safe summary line from known recorded facts only. Repeated close of the same year is idempotent; no extra text draw. Proposed bounds: 96 live facts/world, 32 accounts, 25 recent yearly lines. Pin facts referenced by active callbacks or identity/knowledge receipts; fold other facts into display aggregates only. If all facts are pinned, stop admitting optional background texture with a neutral notice rather than corrupting a live commitment. Measure growth; these are bounded prototype choices, not universal history limits. This is the smallest useful legend consumer: the Notebook recalls what actually happened and the offer follows it.

Compatibility: old saves retain absent owner; enroll when the first new qualifying card completes or when explicit lore opt-in occurs. Do not reconstruct lost earned history from life_record. Store definitions/revisions, reject incompatible active imported references, preserve existing public milestone text. Clock follows existing played-time/absence policy. No generic branch archive, canon simulator, gossip transport, world guards, annual death/birth generator or world-wide unseen history rollout.

File ownership: new `src/lore_history_{state,grammar,content,host,view}.js`, optional `src/data/lore/village.history.js` and tests. P3 owns its outcome/callback hook; P4 owns cast/name exports. Root serializes `src/simulation.js`, `src/simulation_effects.js`, `src/expansion_engine.js`, `src/main.js`, `src/save_files.js` edits if needed. No direct `src/npc_lives.js` or `src/life_record.js` rewrite.

## Acceptance checklist (future, all NOT RUN)

- [ ] A1 SOURCE: grammar bounds/bindings, identical seeds, local text draw isolation, saved lines survive grammar revision, typed facts deduplicate by outcome receipt, callbacks retain pinned facts, double close-year emits no new line/draw. Appropriate tests/build pass.
- [ ] A2 NATIVE: fresh Village origin, complete the P3 request, hear a known account about actual people, take the later changed paid offer, observe real stock/reward/access. Separate seeded-native day-3/day-20 and alternate-decline journeys prove historical causality.
- [ ] A3 PERSISTENCE: Save/reload between deed and callback and after response; Export then literal-file Import into a second fresh origin. Compare facts, cast, lines, known basis, claim, year summary and next text/deck draws. Absent legacy owner remains absent.
- [ ] A4 FAILURES / KNOWLEDGE: hidden/private facts never become public rumor truth by rendering; invalid speaker, removed cause, unsupported revision and failed durable write cannot create a false earned fact or reward. Bounded growth stress retains live callback references.
- [ ] A5 UI: rebuilt 1366x768 plus 1600x1000, short account/basis and useful offer readable in existing Notebook/event panels, native actions reachable. Mobile, three multi-year chains, generalized canon, broad gossip and human prose acceptance deferred.
