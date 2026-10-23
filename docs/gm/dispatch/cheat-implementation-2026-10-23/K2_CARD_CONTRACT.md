CHECKPOINT: K2 read-only audit done 2026-10-23. Nothing in src/ or tests/ was edited; every design below is an unapplied proposal, not an accepted decision. Verification state: source read only, no test or browser run.

# K2: cheat card contract, awakening, tolerant read

Labels: SHOWN (file:line read this session), STATED (a doc says so, not re-derived), INFERRED (my reasoning).
Rules applied: default + dial + reason, rule of two (AGENTS.md), main.js net-zero (AR rules, `.claude/rules/runtime-code.md`).
Line numbers for main.js are the current dirty working tree. Older LQ probe line numbers (5182, 5290, 7087) are stale; use the ones here.

## Verdicts

| Finding | Verdict | One-line reason |
| --- | --- | --- |
| F2 awakening hardcoded | CONFIRMED, but "12 of 13 can never awaken" is only half the story | No second card exists and 12 of 13 PANELS have no panel code at all |
| F3 strict keys, no card version, one bad card blocks load | CONFIRMED | Whole domain throws, load catch sets is_loading_error |
| F5 250 ms poll forever | CONFIRMED, and a better home already exists | `pollDisplays` at main.js:9793 already polls at 250 ms with hidden-tab deferral |
| F7 messages uncapped | PARTLY REFUTED as a live defect | Production writes at most one message per card; the growth path is latent |

Suggested order: F3 tolerant read first (protects real saves before any schema grows), F5 (one-line), F2 (card-supplied text/trigger), F7 last (cap lands with the first emitter).

## F2. awakenCheats is one card in disguise

SHOWN
- `src/cheat_cards.js:98` skips every entry whose `ui !== 'status-window'`; any other kind never reaches the awaken branch.
- `src/cheat_cards.js:93,100,102` use the one constant `FIRST_SYSTEM_MESSAGE` for every card and every awakening.
- `src/cheat_cards.js:96` is one global trigger for all cards: `wonFight || dayCount >= 3`.
- `src/cheat_cards.js:3-5` PANELS has 13 kinds; only `status-window` has an awaken path (line 98) and a finder (`awakenedStatusCard`, line 90, which also filters on `ui === 'status-window'`).
- `src/cheat_cards.js:90` uses `.find`, so a second `status-window` card is held but never displayed (the window reads one entry, `src/status_window.js:29`).
- `src/main.js:403-427` computes `wonFight` once from zone state, so a per-card fight trigger has no separate input today.
- The only dormant card source is `optionalStartCard()` (`src/cheat_cards.js:86-88`), granted at `src/main.js:9595-9597`.
- Existing tests pin only `system-quests` (`tests/cheat_awakening.test.js`, `tests/cheat_status_window.test.js`).

INFERRED
- The 12 other kinds are not blocked by awaken code only. They have no panels, readers or tests either; PANELS is a name whitelist for a future UI (`src/cheat_cards.js:1` says cards describe future behavior). Widening awakenCheats alone would let a `quiet` card flip to awakened with a message nothing shows. That is inert but harmless, and it is the honest first step.
- Today's behavior is correct for the one consumer. The defect is that adding a second card silently inherits the wrong text and trigger.

### Smallest change (no card schema change)

`card.state` is free-form JSON (`src/cheat_cards.js:37-41` checks only `awakened` and `points`). A card can carry its own awakening data there, so `CARD_KEYS` stays untouched and F3 is not a prerequisite.

```
// cheat_cards.js
const DEFAULT_WAKE = {day: 3, fight: true};
function wakeSpec(state) { return {...DEFAULT_WAKE, ...(state.wake ?? {})}; }
awakenCheats:
  for each [id, entry] of next.held:
    if (entry.card.state.awakened !== false) continue;        // drop the ui filter
    const w = wakeSpec(entry.card.state);
    const due = (w.fight && wonFight) || (Number.isSafeInteger(w.day) && dayCount >= w.day);
    if (!due) continue;
    const text = entry.card.state.firstMessage ?? FIRST_SYSTEM_MESSAGE;
    entry.messages.push({text, at}); entry.card.state.awakened = true; messages.push(text);
// validateCheatCard: if state.firstMessage present -> text(); if state.wake present ->
//   object with optional boolean fight and positive safe-integer day.
```
Move the `if(!wonFight && !(dayCount >= 3)) return` early exit (line 96) into the per-card test; otherwise the global gate defeats a card with `wake.day: 1`.

Keep `awakenedStatusCard` as is (status-window only). Generalizing it waits for a second panel (below).

### Migration / compat
- Dormant `system-quests` (state `{awakened:false, points:0}`): no `wake`/`firstMessage`, so defaults give identical behavior. No migration.
- Awakened card: skipped at the `awakened !== false` test and has message[0] (invariant at line 60). Untouched.
- Legacy card with `state: {}` and messages (test at `tests/cheat_awakening.test.js` first case): `awakened` is undefined, so `!== false` skips it. Unchanged.
- Old build reading a new-build dormant card with `state.wake`: state is free-form, so it validates and the card stays dormant until the old default fires. Acceptable.

### Regression test (extend `tests/cheat_awakening.test.js`, pure unit, no browser)
1. Two dormant cards: `system-quests` (default) and a fixture `{ui:'status-window', state:{awakened:false, wake:{day:1,fight:false}, firstMessage:'Other voice.'}}`. At `dayCount:1, wonFight:false`, only the fixture wakes, and its message is `Other voice.`, not the default text. At day 3 the default card wakes with `FIRST_SYSTEM_MESSAGE`.
2. A fixture with `ui:'quiet'` wakes through the same path and keeps `validateCheatState` valid.
3. Bad `state.wake` (`day:-1`, `fight:'yes'`) and empty `firstMessage` are rejected with /cheat/.
4. Existing tests stay green unchanged (they are the legacy-compat proof).

### What waits for a second real consumer
- A shared milestone list ("first one wins": AW6, AB6) beyond `{day, fight}`. Rule of two: one default plus one fixture is not two real cards.
- A generalized finder replacing `awakenedStatusCard`, and any per-`ui` panel registry. No panel code exists for the 12 kinds.
- Per-card voice, rapport and message budgets (SC, ML rows).
- Multiple `status-window` cards (merged board or one panel per card; CHEAT_LIBRARY "two systems held at once" row).
- `wake` fields beyond day and fight (skill-level, bed, near-death; AW6) wait for the AB6 predicate to have two users. STATED: `docs/CHEAT_LIBRARY.md:1467` already says "AB6 and AB9 already two users" was overstated.

## F3. Strict card keys, no card version, no quarantine

SHOWN
- `src/cheat_cards.js:11-15` `keys()` throws on any added key and any missing key. `CARD_KEYS` (line 2) has no version field, so card shape changes are unversionable; only the container has `schema: 1` (line 48, 51).
- `src/cheat_cards.js:35-36` unknown `ui` or `terms` throws, so a card of a kind a build does not know is "invalid".
- `src/cheat_cards.js:53-55` validateCheatState validates every held card and throws on the first failure. One bad card fails the whole domain.
- Callers that do not catch per card: `src/main.js:627` (`validateCheatState(save.cheats??default)` inside load), `src/main.js:6651` (same, inside a load path), `src/main.js:6529` (save), and `src/save_files.js:78` (envelope validation).
- Normal-load failure ends in the catch at `src/main.js:8499-8503`: `is_loading_error = true`, loading screen "Something went wrong".
- STATED (`docs/gm/dispatch/cheat-status-window-2026-10-13/LEAK_AND_QUARANTINE_PROBE.md` LQ3): a one-field edit (`hooks: {}`) reproduced the block live, save and `save_to_file()` fail, raw storage stays untouched until Play. LQ4: import refusal is correct and must stay strict.
- STATED (`docs/CHEAT_LIBRARY.md:1219-1220,1265,1344`): FR1 quarantine and FR2 per-card migration are proposed, A9 says land FR1 before any schema change. `docs/CHEAT_LIBRARY.md:1468` forbids silent reset ("Quarantine keeps raw data inert with a reason, never a silent reset").
- Only one card shape exists in code (`SYSTEM_QUESTS_CARD`, line 81), so no real saves are broken yet. The risk is the first card or validator change after saves exist.

### Tolerant-read plan (FR1, smallest version)

Principle: strict write, strict import, tolerant normal load. A held entry that fails validation is moved, byte-exact, into an inert quarantine and the rest of the save loads. Nothing is repaired, stripped or reset.

Data shape. Quarantine is a sibling of `cheats`, not a new key inside it, because `validateCheatState` requires exactly `schema/held/known` (line 50) and changing that breaks old readers:
```
save.cheats_quarantine = {schema:1, entries:{[id]: {raw, reason, seenAt}}, container?: {raw, reason}}
```
- `raw` is the exact parsed held entry (JSON from storage, so it is JSON-safe by construction).
- `reason` is the validator's error message string (developer-facing, never shown to the player).
- `container` holds the whole `cheats` value when the container itself fails (for example `schema: 2` or `held` not an object); active state then becomes `defaultCheatState()` with the raw preserved, so it is a reset only in the live view, never in storage.

Reader (new export in `src/cheat_cards.js`, replaces the two strict loads at `src/main.js:627` and `6651`):
```
readCheatSave(save):
  rawCheats = save.cheats ?? defaultCheatState()
  quarantine = clone(save.cheats_quarantine ?? {schema:1, entries:{}})   // tolerate it being malformed: if not an object -> keep raw under .container-style slot, never drop
  try validate container keys+schema, held/known are objects
  catch e: quarantine.container = {raw: rawCheats, reason: e.message}; return {state: default, quarantine}
  active = {schema:1, held:{}, known: rawCheats.known}
  for [id, entry] of rawCheats.held + [id, q.raw] of quarantine.entries (retry):
      try validateCheatState({schema:1, held:{[id]: entry}, known:{}})   // reuses existing entry checks
          if active.held has id (already live): keep quarantined, reason 'id already held'
          else active.held[id] = entry; delete quarantine.entries[id]
      catch e: quarantine.entries[id] = {raw: entry, reason: e.message}
  return {state: validateCheatState(active), quarantine}
```
Properties:
- One rule covers an added card field, a missing field, an unknown `ui`/`terms` kind, a future `terms`, and an awakened card missing its message. All throw in the existing validators, so all quarantine.
- Retry-on-load gives automatic reattach: when a later build learns the kind or field, the entry validates on the next load and moves back to active. No migration prompt, no separate reattach API (that waits for a consumer that needs a manual path).
- No silent reset: quarantined data survives save, reload and export because the writer emits it (below).
- `grantCheat`, `recordCheatMessage`, `awakenCheats` stay strict on active state only.

Wiring (main.js, net-zero ask):
- Normal-load call sites at `src/main.js:627` and `6651` swap `validateCheatState(...)` for `readCheatSave(save)`; keep `cheatQuarantine` in a `let` beside `cheatState` (line 397). That is +1 line; pay it by moving `cheatCalendarTime`/`awakenOptionalStart` (lines 399-427) out into a cheat module in the same change, or log a named baseline reset (INFERRED, per AR rule wording).
- The envelope check must see a valid domain first: the strict `validateCheatState` call at `src/save_files.js:78` runs on whatever object `load` is given, so the quarantine split must happen before it, on the parsed save at the storage-load site (`src/main.js:8497`, and its dev-save branch just above). Do the split once there on the parsed object (STATED by LQ5 "normal-load-only preparation step before load()").
- Writer: `src/main.js:6529` also sets `save_data.cheats_quarantine = cheatQuarantine` when non-empty (omit when empty, so ordinary saves stay byte-identical). Add to `save_files.js:78`: if the key exists, check it is plain JSON data with `schema:1` and an `entries` object; never validate the raw cards inside it.
- Import (`importSaveFile`, `src/save_files.js`) stays strict: invalid `cheats` is refused before preflight and write, exactly as `tests/cheat_cards.test.js` last test pins. A file that carries a valid `cheats` plus a `cheats_quarantine` imports fine.
- Receipt: one generic non-spoiling line per load that quarantined something ("A saved ability was set aside after this update. Its original record is preserved."), no card name or id. Dial: once per quarantine entry (add `noticed: true` after first show) versus every load; default once.
- Dormant-card name leakage in decoded export (LQ2) is unchanged by this: quarantined raw may contain a card name. STATED open.

Migration / compat
- Save with no `cheats`: default, no quarantine key. Save with valid cheats: byte-identical to today. No version bump of `cheats.schema`.
- Existing dormant and awakened `system-quests` saves: validate as before, never quarantined (existing fixtures `dormant_day3.save.txt`, `held_system.save.txt` double as proof).
- Newer-build save opened in this build: the unknown card is quarantined and kept; opening it back in the newer build restores it by retry. A newer build exported and imported into this one by file is refused (strict import, LQ4); accept this as the default, dial only if a real downgrade need appears.
- Card version field: add optional `v` to `CARD_KEYS` handling only after the reader ships (missing `v` means 1). That is the first real use of FR2 and waits for a second card shape to migrate (rule of two; AB9 "already two users" overstated, `docs/CHEAT_LIBRARY.md:1467`).

Regression tests (extend `tests/cheat_cards.test.js`; first four are pure unit)
1. Two held cards, one valid and one with an extra key (`{...card, v:2}`), plus one with `ui:'future-panel'`: `readCheatSave` returns the valid card active, each bad entry in quarantine as a deep-equal exact raw copy, and does not throw.
2. Round-trip: feed the result back through the writer shape and `readCheatSave` again: quarantine unchanged, no duplicate, active unchanged (idempotent).
3. Reattach: remove the extra key from the quarantined raw and reread: it moves to active, quarantine empties.
4. Container failure (`schema: 2`): active default, raw kept in `container`, not lost, not merged.
5. Browser (`cheatGame` helper): load a save with a bad card beside the healthy one: no `is_loading_error`, hero restored, one receipt, `create_save()` contains `cheats_quarantine` with the exact raw, reload keeps it, game errors empty.
6. Keep the existing strict-import test; add: valid cheats plus quarantine key imports, and an invalid `cheats` still rejects before preflight and write.

Wait for a second real consumer: FR2 migration table, quarantine UI/repair panel, manual reattach API, per-card validators (a ui-kind registry with its own state schema), FR3 board reset. A reader that retries on load covers the only case that exists.

## F5. Status window polls forever

SHOWN
- `src/status_window.js:57` `timer = setInterval(render, 250)`; cleared only in `destroy()` (line 58). Searching `src/main.js` for `statusWindow` shows no `destroy` call; it is created once at 9757 and lives for the page.
- `render()` (lines 28-50) runs on a timer even while the panel is hidden or the tab is hidden. When awake it also reads `panel.scrollHeight` (line 44), a layout read, four times a second.
- The timer calls the closure `render` directly, not the returned `{render}` property. The `main.js:9134-9139` loop wraps `panel.render` with `deferSimulationRender`, so the status window's own timer bypasses that deferral. INFERRED from the closure shape; wrapper at 9137-9139 is SHOWN.
- An existing shared poll with hidden-tab deferral: `src/main.js:9792-9793` `pollDisplays` (calls `workLedgerPanel?.render()`, `quietPlaceDetail.render()`, `customizationPanel?.refresh()`) on `setInterval(... deferWhileHidden(pollDisplays, pollDisplays) ..., 250)`; `deferWhileHidden` is at `src/simulation_render.js:67`. `statusWindow` is assigned at 9757, before 9793, so it is defined.
- No event bus tells the panel that level, stats or titles changed (read() at 9757 pulls them), so removing polling entirely is not available without a new seam.

Smallest change
```
// status_window.js
-  const unsubscribe = subscribeDisplaySettings(render), timer = setInterval(render, 250);
-  return {render, destroy() {clearInterval(timer); unsubscribe(); panel.remove();}};
+  const unsubscribe = subscribeDisplaySettings(render);
+  return {render, destroy() {unsubscribe(); panel.remove();}};
// main.js:9792  (edit the existing line, no new line)
-  const pollDisplays=()=>{quietPlaceDetail.render();workLedgerPanel?.render();...
+  const pollDisplays=()=>{quietPlaceDetail.render();statusWindow?.render();workLedgerPanel?.render();...
```
Gains: hidden-tab deferral, one timer instead of two, same 250 ms cadence for the player, and `statusWindow.render` runs through the wrapped version. Net-zero for main.js (same line). Dial: skip render while `panel.hidden` and no entry is already the early return at line 31, so cost is a read() call.

Migration / compat: none; no save or card data involved. Behavior for a player is unchanged (same cadence) except that a backgrounded tab stops repainting.

Regression test: browser, in `tests/cheat_status_window.test.js` (it currently only tests card logic, so this also covers the panel): with an awakened `system-quests` card, change level or a title through `__cheatTest`, wait about 300 ms, assert `[data-status-level]` text updates. Second case: emulate a hidden document and assert no update until visible (uses the existing `deferWhileHidden`). Do not assert on `setInterval` source text.

Wait for a second consumer: a change event bus for level/stat/title, replacing polling entirely. Only the status window and work ledger want it today; designing it now is speculative.

## F7. Messages array is uncapped

SHOWN
- `src/cheat_cards.js:78` `recordCheatMessage` pushes with no cap; `src/cheat_cards.js:100` awaken pushes one.
- `src/cheat_cards.js:59-64` validates every message on every `grantCheat`/`recordCheatMessage`/`awakenCheats` call (each calls `validateCheatState`, which clones the whole state, lines 67 and 70-73,79). Cost is O(total messages) per write.
- `recordCheatMessage` is not imported by `src/main.js` (import list at line 372 has `defaultCheatState, validateCheatState, grantCheat, optionalStartCard, awakenCheats`) and `.messages` appears in `src/` only in `cheat_cards.js`. So production writes exactly one message per card, ever (awaken guard, line 98, refuses a second).
- `src/cheat_cards.js:60,91` depend on `messages[0]` existing: awakened cards must have at least one message, and the finder needs `messages.length > 0`.

Verdict: refuted as a current defect (max length 1 in any real save); latent once stage 1 emits system lines (STATED, `docs/CHEAT_LIBRARY.md` ML2-ML4 and TE6 expect growth).

Smallest change, to land with the first emitter, not before:
```
const MESSAGE_CAP = 50;     // dial: default 50, reason: saves stay small, window needs recent lines only
recordCheatMessage: after push,
  if (list.length > MESSAGE_CAP) list.splice(1, list.length - MESSAGE_CAP);   // keep [0], drop oldest after it
```
Keeps the first message forever (invariant at lines 60 and 91, and ML4 "keeps the first message forever") plus the newest 49. Message entry keys are exactly `text`,`at` (line 63), so a dropped counter cannot live on the entry without a schema change; do not add one. Daily-summary compaction (ML4) is the richer form and waits.

Reader must not trim: a hand-made save with more than the cap still validates (inert), because trimming on read would be a silent data change. Only the writer trims.

Migration / compat: existing saves have at most one message, under any cap; no migration. A legacy awakened card with `state: {}` and one message is unaffected.

Regression test (`tests/cheat_cards.test.js`, pure unit): record 200 messages on an awakened card; result length equals the cap, `messages[0]` is the original first, the last message is the newest, `validateCheatState` passes, and `awakenedStatusCard` still finds it. A second case: a 120-message state passed to `validateCheatState` is accepted unchanged.

Wait for a second consumer: dedupe with counts (ML3), per-hour budget (ML2), daily-summary compaction (ML4), unread dots (ML6), log filters (ML5). None has a user until stage 1 board lines exist. STATED: the AB5 event abstraction waits (`docs/CHEAT_LIBRARY.md:1419`).

## Interactions and ordering notes (INFERRED)
- F2's card-supplied `state.wake`/`firstMessage` do not need F3, but F3's quarantine is what makes a later card-shape change safe; ship F3 before adding `v` or any new top-level card key.
- F2 widens which entries awaken; with F7's cap the awakened invariant (messages[0]) is preserved, so the two do not conflict.
- A quarantined card never reaches `awakenCheats`, `awakenedStatusCard` or the status window, so it cannot awaken, render or leak its name in UI. It is still present in the raw save and export (LQ2).
- Acceptance gates before calling any of these done (AGENTS.md): rebuild, then browser-exercise from a fresh origin and, since persistence changes (F3), save, reload and import. Until then each stays implemented-unverified.

## Suggested lane split (not authorized, for the GM)
1. F3 reader + writer + save_files check + tests (owns `src/cheat_cards.js`, `src/save_files.js`, the two main.js load lines).
2. F5 one-line move (owns `src/status_window.js` and one main.js line) with its panel test.
3. F2 after F3 lands (same file as 1, so same writer).
4. F7 held until the first emitter is scheduled.
