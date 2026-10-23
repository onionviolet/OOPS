# K1: base cheat acquisition and carry across lives

CHECKPOINT: K1 read-only audit, 2026-10-23. Static code reading only; no test or browser run. No src/tests edits. Proposals below are not accepted decisions.

Labels: SHOWN (file:line read), STATED (doc), INFERRED (my reading of code), MEMORY (not re-checked).

## Headline

F1. A default player never gets a cheat. SHOWN: index.html:162 defaults the picker to 'none' (given in brief); src/main.js:9595-9597 grants only on 'system-quests' or 'surprise'; picker hidden unless localhost + ?start_probe=1 (given in brief, src/new_game_beginning.js).
F2. The base cheat is LOST on heir succession. This contradicts src/carry_ledger.js:23-25, which says the Paradise base cheat carries (and the ledger is data, not behavior; no cheat clause exists in the frontier rows, carry_ledger.js:12-20).
F3. Nothing resets cheatState on death. It is simply never touched except at load and at new-game grant.
F4. Test coverage for carry is zero. tests/ has cheat_awakening, cheat_cards, cheat_status_window, heir_inheritance, lives_carry_codex; none asserts cheats across an heir (SHOWN by file list; contents of heir_inheritance.test.js not read, so INFERRED that it lacks a cheat assertion; grep of src/heir_inheritance.js and src/chronicle.js for "cheat" returned nothing).

## 1. Path trace

| Path | cheatState | Evidence |
| --- | --- | --- |
| Declaration | `let cheatState=defaultCheatState()` = `{schema:1,held:{},known:{}}` | SHOWN main.js:397, cheat_cards.js:48 |
| Save write | `save_data.cheats = validateCheatState(cheatState)` on every create_save | SHOWN main.js:6529 |
| Save load | reassigned from `save_data.cheats ?? default` | SHOWN main.js:6651 (also :627, a second restore path) |
| Awakening | reassigned only after durable write | SHOWN main.js:406-419 (awakenOptionalStart), cheat_cards.js:106+ |
| New game grant | `grantCheat(... optionalStartCard() ...)` on PLAY, capture listener, once | SHOWN main.js:9594-9597 |
| Death (hero dies, chronicle life ends) | UNTOUCHED. grep of `cheatState` in main.js lists only lines 397, 406-419, 627, 6529, 6651, 9597, 9757. No death handler writes it. Dormant card stays dormant until day 3 or a won fight; awake card stays awake. | SHOWN (grep), INFERRED (no other writer, since chronicle.js and heir_inheritance.js contain no "cheat") |
| Same-life dead state | Save still carries cheats; status window reads live cheatState (main.js:9757) | SHOWN |
| Heir (beginHeir -> reload -> completeHeirRequest) | RESETS to empty. Chain: beginHeir stores `heir request` with leftovers (main.js:2724-2732); on reload the boot condition skips `load_from_localstorage()` when `heirRequest?.leftovers` (main.js:~9523, the `!heirRequest?.leftovers` term), so the else-branch builds a fresh game with `cheatState=defaultCheatState()`; completeHeirRequest calls `fresh=create_save()` (main.js:2756), whose cheats field is the empty default (main.js:6529); `buildLifeHeirSave` clones fresh and copies only npc_lives, options, inheritance_law, discovery_codex, life_record from previous (life_experience_host.js:20-27). No `cheats` line. | SHOWN for each hop; the net result is INFERRED (not run) |
| Independent life (beginIndependentLife) | Same boot-skip shape: the previous save is archived and `create_save()` of the fresh state is published (main.js:2733-2751). Cheats reset. Arguably correct ("new character"), but undecided. | SHOWN code, INFERRED intent |
| Rebirth (in-world, Paradise) | No rebirth code path touches cheatState. The ledger row is aspirational data. | SHOWN (carry_ledger.js:25 data only), grep INFERRED |
| New game / hard reset | default empty, then picker grant only if choice set | SHOWN main.js:9594-9597 |
| Import of save | validated by save_files.js:78 if the field exists; absent field passes | SHOWN |

Net: the "base cheat persists across lives" claim (STATED, CA docs and carry_ledger) is true only for the same continuous save, not for any new-life path that goes through `create_save()` of a fresh boot. Heir is the only shipped new-life path that matters for carry.

Note on docs: the CA1-CA14 file I read (docs/gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md) is mostly about the continuation/checkpoint cheat; CA13 (line 1317) is the "quiet faculty" question, recommended P52, and AD29 (RULES_INDEX.md:198) records it as accepted. Persistence of the base cheat across embodiments is STATED in CA13 ("consistent with persistent learning and capabilities across bodies") and AD11 context. I did not find an explicit statement that an heir keeps it; that is INFERRED from AD11/AD29 plus carry_ledger.

## 2. Acquisition routes for the first real slice

Shared facts. STATED: CHEAT_LIBRARY.md:616-640 says the first playable route is the optional start (AQ1), every other route stays possible, rarity is a per-world dial; its related owner recommends "random circumstances with an authored, reachable early opportunity rather than an unavoidable powerful grant" (CHEAT_LIBRARY.md:623, D1). AD29: base cheat is a quiet faculty by default; AD26: powers are discovered in play. Existing machinery SHOWN: dormant card awakens on day 3 or first won fight with a first system message (cheat_cards.js `awakenCheats`, FIRST_SYSTEM_MESSAGE), status window docks only when awakened (status_window.js:53-54).

Constraint to flag: the existing card is `SYSTEM_QUESTS_CARD` (ui 'status-window', a quest system with messages). AD29 says the default base cheat is a quiet faculty, with "systems or voices" coming via accompanying cheats. So the card used for a default grant should not be the talking quest system. That needs a new quiet card (family e.g. faculty, ui none). INFERRED: a new card needs validateCheatCard fields only (`id, family, name, ui, terms, hooks, state, stages, observers, sources`, cheat_cards.js:~30-46) and no save schema change (schema stays 1).

### A. Grant a quiet base cheat at every new game; keep the picker for variants

- Cost: small. One new card constant plus one grant line near main.js:9595; picker keeps 'system-quests' and 'surprise' as variants.
- Seams: cheat_cards.js (new card), main.js new-game branch (9594-9597), a milestone text line (9598-9600 already branches on choice), heir carry fix (F2), possibly a visible faculty surface (none today; a quiet faculty with ui none has no panel).
- Save risk: low. Field already exists; old saves lack the card and would simply not have it (see section 4).
- Decisions met: AD29 yes (quiet by default), AD11/carry yes once carry is fixed, AD26 partial (needs a discovery moment, see dials), CHEAT_LIBRARY first-route "optional start" only loosely (the picker stays, but default becomes granted, which contradicts D1's "reachable opportunity, not unavoidable powerful grant" unless the card is weak at start).
- Risk: every player is "chosen"; conflicts with per-world rarity dial (a world with "none" or "very rare" needs the dial, so the grant must read a per-world setting).

### B. Show the picker again

- Cost: smallest code change (reveal gate in new_game_beginning.js), but the product problem is large.
- Seams: new_game_beginning.js, index.html default.
- Save risk: none new.
- Decisions met: CHEAT_LIBRARY AQ1 literally. Violates AD26's spirit (discovery in play; a menu that says "begin with a system" announces the cheat), and picker only offers the talking quest card, which AD29 says is not the default base. MEMORY: it was hidden deliberately by R21b (main.js comment ~9577 says the panel was retired and moved to the start screen; hiding behind ?start_probe=1 was a later choice, not re-verified).
- Verdict: fine as a dev/variant door, not as the default player route.

### C. Grant via an in-world event

- Cost: highest. Needs an authored early scene (a found object, a fever dream, a near-death), an awakening trigger, and a message surface.
- Seams: chronicle/expedition content or a village scene, awakening (cheat_cards.js awakenCheats already supports "wonFight or day 3"), cheat_status_window or a new quiet surface, heir carry.
- Save risk: medium. New event state must live somewhere in the save (chronicle state or content pack); chronicle validation is strict (validateChronicle, life_experience_host.js:12).
- Decisions met: AD26, AD29, CHEAT_LIBRARY D1 (authored reachable opportunity), AQ3/AQ11. Best fit with "discovered in play". Does not meet "first playable slice is cheap".

### Recommended default (proposal, not accepted)

Two-step: A as the floor, C as the dial that replaces it.
- Dial `cheat.start`: default `quiet-faculty-seed` (A: a dormant quiet card granted at new game); alternatives `none` (world says no cheat), `picker` (B, variants), `event` (C).
- Reason: A delivers a real player a cheat today with a three-file change and matches AD29; the dormant-to-awakened path already exists, so AD26 discovery is preserved (player does not see it until day 3 or first won fight). C then swaps only the trigger, not the state shape, so nothing is thrown away.
- Cost dial: seed is weak at start (points 0, minimal benefit) so "not an unavoidable powerful grant" (D1) holds; growth is earned.
- Per-world dial: base.frontier = seed granted; book worlds read their own setting; Paradise carry already declared.
- Must ship with the heir carry fix (section 3); granting a cheat that vanishes at first heir is worse than none.

## 3. First failing tests (write before any fix)

File: `tests/cheat_carry.test.js` (new; one file, system-organized per AGENTS lean-test rule). Uses `cheatGame` from tests/helpers/cheat_game.mjs (SHOWN: it exposes `__cheatTest.{create_save,load,advance,read,set}` and `start` option; note `set` validates and assigns cheatState).

T1 (pure, fast, no browser): `buildLifeHeirSave` carries the cheat.
- Setup: build `previous` with a pristine fresh save plus ended chronicle (reuse the fixture pattern in tests/heir_inheritance.test.js, not read by me; reuse its helper), set `previous.cheats` to an awakened quiet card (grantCheat + awakenCheats) with points 3 and one message; `fresh` has default cheats.
- Assert: `next.cheats` deep-equals `previous.cheats`; `validateCheatState(next.cheats)` passes; `next.cheats.held[id].messages` unchanged; `acquired.route` unchanged. Expected today: FAIL (next.cheats is empty; SHOWN life_experience_host.js:20-27 omits it).
- Dormant variant: previous card dormant (awakened false, no messages) carries as dormant, and awakening day count does not reset (assert awakenCheats on next with dayCount from the new calendar; note buildLifeHeirSave keeps the calendar, line 17, so dayCount is already past 3 and the heir wakes on the first tick; decide intended behavior, see Q2).

T2 (browser, real path): full heir flow.
- Setup: `cheatGame({start:'system-quests'})`, advance past day 3, assert `read()` awake; force chronicle life end via the same route heir_inheritance browser tests use (MEMORY: `beginHeir` is internal; if no test hook exists, add `beginHeir` to the test-only injection list in cheat_game.mjs, same pattern as `create_save`, not a production API). Call beginHeir, wait for reload, `waitForFunction(__cheatTest)`.
- Assert: `__cheatTest.read()` after reload still holds the card, `awakened:true`, message count 1, durable `JSON.parse(localStorage['save data']).cheats` equals live. Expected today: FAIL.

T3 (negative/scope): independent life resets cheats only if decided so; write after Q1 is answered. Not before.

T4 (grant, depends on route A): fresh `cheatGame({start:'none'})` yields exactly the quiet seed, dormant, no status window (`#status_window_panel` hidden), and `start:'system-quests'` yields the quest card instead of both (assert no double grant: grantCheat throws on duplicate id, SHOWN cheat_cards.js `grantCheat`, so distinct card ids are required).

Failure scenario to name in the task record: "heir loses faculty" and "heir double-wakes, replaying the first system message". Gate: focused file only, then committer's full `npm test`.

## 4. Existing saves

- Save with no `cheats` field: SHOWN main.js:6651 / :627 `?? defaultCheatState()`; save_files.js:78 only validates when present. Stays cheat-free. A route A grant at new-game would not apply (they are past new game). Options (proposals): leave as ordinary-start lives (no migration, matches "everything possible, per world"); or offer a one-time in-world seed event (route C) in the next life/heir. Do not backfill silently; that would be an unrequested persistence mutation (AGENTS Safety: persistence changes need migration or explicit decision).
- Save with a dormant card (route 'optional-start', awakened false): unchanged; awakens at day 3 or won fight (SHOWN fixture docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/dormant_day3.save.txt in cheat_awakening.test.js:24). Adding a second default card with a different id is safe; same id would throw 'already held' (grantCheat), so never re-grant on load.
- Save with awake `system-quests`: keeps the talking quest system. If AD29 makes quiet default, this is a variant not a bug; keep.
- Heir creation from any of these after the carry fix: the previous life's `cheats` is copied verbatim and validated (validateCheatState via create_save and save_files.js:78). A pre-fix save whose heir already lost the cheat stays lost; no recovery path exists (INFERRED, the previous life's save was overwritten by importSaveFile at main.js:2758-2760). Flag to Weibao as a known cost; no migration can invent it back.
- Version: schema 1 unchanged for a verbatim copy. A new card needs no `game version` bump by itself (INFERRED); confirm with validateSaveEnvelope before shipping.

## Open questions (for GM, not blockers for T1/T2)

Q1. Does an independent (new character) life keep the faculty? Proposal: default no, dial yes for "same soul" worlds (reason: AD11 says nothing crosses without a carrier).
Q2. On heir, does an unawakened card keep its dormant state or restart its day-3 clock? Calendar is preserved (life_experience_host.js:17), so the heir would wake on the first tick. Proposal: carry state as-is, and let the awakening scene be per-life only if the card says so.
Q3. Which quiet card shape (id, family, benefit at points 0)? Needs a design owner before route A; not decided here.
Q4. Does the carry rule belong in buildLifeHeirSave, or in carry_ledger (ledger today has no frontier cheat row, carry_ledger.js:12-20; add one to match behavior)?
