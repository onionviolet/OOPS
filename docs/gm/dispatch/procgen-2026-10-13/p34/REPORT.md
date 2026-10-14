# P34: Village story spine prototype

2026-10-14. Reversible prototype, only in proc-p34-spine on proc/p34-story-spine, baseline cc5fa556. Main checkout was read-only; another worker owns integration there. No P2 merge, push or merge into codex/gameplay-foundations. Human fiction/balance/layout acceptance remains OPEN.

## How to play

Serve this worktree's rebuilt files on http://127.0.0.1:22400/.

1. **A1:** Create a hero, choose Talk to someone → Village elder → Hello, then end the conversation. Open Notebook → People → Begin Village encounters.
2. **A2:** In Reports, expand Village travelers → Welcome road travelers. Expand a traveler and Meet traveler. Meeting reveals their actual requested supply. Two are present; a third arrives after one played day.
3. **A3:** Choose Begin remembered requests → Ask about a supply need → Take request. One missing journey supply causes the request; the named traveler has reserved the displayed fee from their own purse. Casting prefers introduced present people with shared known receipts, then stable ID order.
4. **A4:** Bring the requested item and choose Deliver. Stale bread is starting stock; Rat pelt/Rat tail use ordinary rat loot. Alternatively choose Decline request. Delivery moves one real item into the traveler's supplies and releases the reserved fee to you. Decline returns it to the traveler, with no player cost or invented grudge.
5. **A5:** Read Story so far in that person's record or beside the settled request. Stay in Village: after at least12 played minutes, the next eligible Village chances draw can show a remembered supply card under Notebook → People → Village encounters. It names the same person and item, cites the real settlement internally, and offers road-sign advice:8 Perception XP after delivery,4 after decline. Choosing the lesson adds the received lesson to the recap.

No choice blocks ordinary idle play. Requests have no deadline, absence cost or hunger effect. If the traveler is away, the fee stays reserved until they return. Closing the browser does not advance these stories. The original P3 nonblocking policy remains in place; existing unrelated ordinary decisions keep their old behavior. The callback competes in the existing saved deck, so its draw is not an unconditional timer promise.

Desktop targets are1366x768 and1600x1000. Reports and Notebook retain separate scroll regions; actual stock, routine actions, request terms and known recap/card fit the existing desktop workspace. Mobile deferred.

## What changed

| ID | Stage | Result |
|---|---|---|
| I1 | S-1 | Merged P1 7b787fdd, P3 4e444a5e and P4 09403f5c. New deck/population enrollment uses P1 named deck:* and world.people:village streams. Existing P3 deck cursors retain their local xorshift derivation, preserving the saved next draw. Existing P4 people never regenerate. |
| I2 | S-2 | Optional expansion.loreHistory schema1 is the D8-A/P14 retained outcome owner. Query actor, issuer, person/object/place, action, result, played time and cause refs. P3 response receipts capture actual applied native item/coin/skill deltas after effects, in the detached plan. The feed and biography are still projections. |
| I3 | S-3/S-4 | P4-owned storyRequests freezes need, terms, escrow and settlement ref. No second person, purse or stock owner. Full envelope is durable before native publication. The P3 aftermath uses the same receipt-backed person/object and only learned bindings. Recap text is deterministic, pure and reload-stable, with receipt basis and enrollment coverage. |
| I4 | S-5 | Card/request lint runs in npm test. The no-DOM seeded runner uses actual enrollment, request settlement, P3 draws/responses and the existing scheduler, including budget continuation. Closed request retirement avoids quota becoming a lifetime decline limit. |

History retains at most96 receipts, with explicit consumer pins, live-card refs, causal parents and each person's latest request outcome protected. Request storage keeps at most16 active/recent claims; raising a new legitimate need retires an old closed claim when needed. All-pinned history admission rejects in the detached plan, before native publication. A source stress trace performs100 declines, keeps bounded storage, then successfully delivers a new funded obligation. Rendering grants no rewards and draws nothing.

Compatibility is additive. Old saves without these opt-ins acquire no travelers, decks, request owner, retroactive story or history backfill. P1's inherited native RNG compatibility decision still applies: future formerly-unseeded native draws become deterministic, without rewriting inventory, earned progress or prior outcomes. Legacy P3 local deck generators stay local; changing their algorithm would alter the next saved result. Optional history consumer pins are initialized from current request refs when that owner next writes; older missing-pin records remain readable. Load/import validate streams, decks, history graph, request reservations and settlement refs before publication. No engine schema bump or private-save access.

## Files and merge resolutions

P34 modules: src/lore_history_state.js, src/lore_history_view.js, src/story_requests.js, src/story_aftermath.js. Tooling: scripts/lint_story_spine.mjs, scripts/run_story_spine.mjs, tests/helpers/story_spine.js and focused tests. P4-owned generated_people.js/generated_people_ui.js and P3-owned storylet_deck.js have minimal bridges for named draws, requests and known projection.

Shared-file edits, separate from those owned modules:

| File | P34 join |
|---|---|
| src/main.js | Combined inherited lane imports/registrations. P4 detached full-envelope writes validate before durable publication, then adopt the saved expansion state, preserving named draws/history. Supplies/rewards publish through the existing native methods. |
| src/save_files.js | Combined P1/P3/P4 validators and new request/history reference admission. Missing request history owner rejects. |
| src/expansion_engine.js | Validates optional saved streams, decks and loreHistory at runtime/load as well as envelope import. |
| src/simulation.js | Captures P3 settled response outcomes and freezes receipt refs into admitted aftermath events. Inherited deck/nonblocking scheduler hooks retained. |
| src/simulation_content.js | Registers the one aftermath definition alongside the original14 cards. |

P3 conflicted in src/main.js imports and src/save_files.js imports/expansion validation. Both imports were retained; expansion, storylet, stream and native-encounter checks were combined. P4 merged automatically. No shared-file authority was discarded. P1-owned combat/enemy/location/trader/local-life changes and P3-owned notebook/feed/simulation UI changes are inherited merge content, not newly rewritten by P34. No npc_lives.js, P2 item/crafting/inventory-component owner or source library edits. Rebuilt dist/ and index.html are intentionally uncommitted.

## Verification

| ID | Label | Evidence and result |
|---|---|---|
| V1 | SOURCE | S-1 integration: npm test664/664 and npm run build PASS before any new feature. Final suite680/680, zero failures/skips; final build PASS. P34 contributes18 focused checks: streams2, history4, requests7, known views3, lint/runner2. |
| V2 | SOURCE | Lint rejects bad refs, unknown/contradictory/self-locked requirements, unsupported effects and sealed synthetic text without printing its contents. Reads actual original item declarations without native DOM imports. It covers15 cards plus the request contract, not general semantic/canon validation. |
| V3 | SOURCE | Headless seed43 run through3600 played minutes: repeated seed matches receipts/draws; chunk900 plus JSON reload matches the long advance; a distinct seed varies. At least one512-boundary budget return is drained, with no lost remaining time or blocking generated decision. SOURCE-only stock fixture is labelled, not natural acquisition. |
| V4 | natural | Fresh Chrome profile, default native timers, actual creation/elder/opt-in/meeting controls, starting Stale bread delivery and reserved fee, known recap, later same-person/item card. Both desktop viewports inspected. Pending and completed Save/reload exact; native Export download and literal-file Import to a second fresh profile exact. Zero page errors. [BROWSER_EVIDENCE](BROWSER_EVIDENCE.json). |
| V5 | seeded-native | Copies the exact disposable naturally earned pending checkpoint through literal-file Import into two new profiles, without grants or fabricated time. Normal native timers reach the same next deck boundary; cards, draws, population, history, stock and money match after reload. Native decline returns escrow without stock/player cost, then same unresolved need can raise a new funded request. [REPLAY_EVIDENCE](REPLAY_EVIDENCE.json). |
| V6 | seeded-native, final build | Final candidate fresh native import of that naturally earned pending checkpoint: deliver, read recap, receive the delivery-backed card, gain exactly8 native Perception XP, completed Save/reload and native Export/literal-file Import to another fresh profile preserve projection and learned lesson. [FINAL_NATIVE_EVIDENCE](FINAL_NATIVE_EVIDENCE.json). |

Each browser proof verifies served bundle bytes equal its own rebuilt worktree bundle. Natural proof predates the final stricter load/retention joins; final candidate validation/publication is independently covered by V5/V6 and the final suite. Bundle hashes, source-map matching and source fingerprints are in CHECKS.json and the evidence files. Proof projections compare people/requests, receipts, stream cells/logs, deck due/cooldown/draw state, frozen cards, native inventory and purse; they do not claim exact wall-clock timer phase or every unrelated native XP interleaving.

Harnesses and compact screenshots live here. Profiles and literal test exports remain under /private/tmp/procgen-p34-*. Browser harnesses name fixtures TEST FIXTURE PROCGEN P34; no user saves were opened. A first stream fixture skipped scheduler boundaries and was corrected. A request fixture initially lacked required component-envelope levels and was corrected. An initial lint import pulled in native DOM and was replaced with read-only declaration inspection. A12000-minute headless probe was stopped and narrowed to3600, which still proves real budget exhaustion and chunk/reload parity. None of those incomplete attempts is acceptance evidence.

Commits through S-4:83af4bba and819bb6f2 (S-1 merges),30430de9 (S-1 final integration),6b0f1f32 (S-2),6af99aec (S-3),364d8300 (S-4). The S-5 delivery commit is the branch tip after this report is committed; CHECKPOINT records handoff. Remaining native variants and capacity/inherited-system limits are labelled IMPLEMENTED_UNVERIFIED in [BACKLOG](BACKLOG.md). Root integration and Weibao's fiction/balance/layout acceptance remain OPEN.
