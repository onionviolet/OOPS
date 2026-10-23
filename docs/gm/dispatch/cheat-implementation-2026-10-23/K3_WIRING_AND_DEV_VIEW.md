CHECKPOINT: K3 wiring and dev view, read-only survey, 2026-10-23. Nothing in src/ or tests/ edited. Labels: SHOWN (file:line read), STATED (a doc or comment says it), INFERRED (my reading). Seam named for lane briefs: domain registry (AR2, AR14). Links: [architecture rules](../../../ARCHITECTURE_RULES.md). player-ui.md has no headings; I read it as one paragraph of rules, not used further.

# K3: cheat wiring, UI seams, dev view

Bottom line: cheat state is one `let cheatState` in main.js (SHOWN main.js:397) with no event bus, no hook dispatch and no registry domain. Cards 2 to 4 are cheap only if cheat state moves into a registered domain and hooks reuse the call sites that already call `awakenOptionalStart`. The dev console has no cheat verbs (SHOWN dev_console.js:19-151). A read-only view plus a draft-based mutation set fits in one module.

## 1. Engine seam map

### 1a. State: producer, owner, commit, readers

| Item | Where | Label |
| --- | --- | --- |
| Owner of live state | `let cheatState=defaultCheatState()` main.js:397; shape `{schema:1, held:{id:{card,acquired,messages}}, known:{}}` cheat_cards.js:46 | SHOWN |
| Pure transitions (no I/O) | `grantCheat` cheat_cards.js:78, `recordCheatMessage` :86, `awakenCheats` :107, `validateCheatState` :55; all return a new validated clone | SHOWN |
| Producer 1: grant | New-game only: `grantCheat(cheatState, optionalStartCard(), {route:'optional-start'})` main.js:9595-9598. No other grant route exists (no death-menu, no shop, no later-life grant) | SHOWN |
| Producer 2: awaken | `awakenOptionalStart(wonFight)` main.js:403-427. Builds `create_save()`, splices `save.cheats=result.state`, validates the envelope, writes via `lifeSaveStorage.setItem(...,onCommit)`, and sets `cheatState=result.state` only inside the commit callback (main.js:417-420). So live state changes only after the durable write | SHOWN |
| Awakening guards | `importProbeToken || !ownsSave || foundationSaveBlocked || is_loading_error || restoringNativeSave` main.js:404 | SHOWN |
| Save point | `save_data.cheats = validateCheatState(cheatState)` in `create_save` main.js:6529; this line sits after `domainRegistry.save(save_data)` at :6332 and next to `content_packs` | SHOWN |
| Load point | `cheatState=validateCheatState(save.cheats??defaultCheatState())` main.js:627 (restore path) and :6651 (`load`, right after `domainRegistry.load(save_data)` :6650) | SHOWN |
| Envelope check | save_files.js:78 validates `original.cheats` only if present | SHOWN |
| Readers | status window only: `read: () => ({cheats: cheatState, level, stats, titles})` main.js:9757; `awakenedStatusCard` cheat_cards.js:100 is the one discovery predicate; the Appearance option list is patched by `onKnown` main.js:9759-9763 | SHOWN |
| Randomness | Streams are per-save; "No cheat policies are applied here; receipts are the seam" (seeded_streams.js:4-5). `unitDecision` is pure (:46-52); `streamSeed` takes one pure seed with no cursor advance (:57-60). A cheat that rerolls must record a receipt, not touch a legacy generator | SHOWN (comment), reading INFERRED |
| Rule overlay | `kind:'cheat_overlay'` is admitted by `validateRuleModule` (rule_modules.js:41), but `RULE_TARGET='oral.restore_availability'` is the only parameter target (:13) and `resolveRuleEffects` returns detached proposals and never writes (rule_modules.js:104-106 comment). No card uses it | SHOWN |

Gap (SHOWN): `cheatState` is not a domain, so the registry's `save/validate/load/migrate/refresh/mountPanels` do not cover it, and `CARD_KEYS` includes `hooks` as an empty array on the only card (cheat_cards.js:1,69). `cheat_cards.js:1` says granting runs no hooks.

### 1b. Where `card.hooks` would fire

No pub/sub exists for game events (INFERRED from grep: no emit/subscribe except `subscribeDisplaySettings` display_settings.js:101, a settings-only listener set). AR3 forbids a second mutation event bus; "events may observe, they never mutate" (ARCHITECTURE_RULES.md:30, STATED). So hooks must be observer calls placed at existing choke points, each returning a proposal that goes through the existing transaction path. The one proven pattern is `awakenOptionalStart`, called from six sites (SHOWN):

| Hook | Existing call site | Label |
| --- | --- | --- |
| clock tick | `update_timer(minutes)` main.js:8544; registry fan-out `domainRegistry.tick(consumed)` main.js:2622 and domain `tick` field (domain_registry.js:34). Awakening already rides calendar via main.js:1973, :8611, :8675 | SHOWN |
| combat end (win) | `finish_combat_round` main.js:4818-4820 (comment: "only after the player wins"). Raw end: `end_combat` main.js:5317 (also reached at :1877, :3241, :3247, :4674; includes retreat and forced ends) | SHOWN |
| enemy killed | `target.is_alive=false` main.js:4858 inside the damage path (per fighter, includes special combat) | SHOWN |
| skill gain | `add_xp_to_skill` main.js:4970 (multipliers applied at :840 for the native-craft path, bonus at :4976) | SHOWN |
| level up | `add_xp_to_character` main.js:5148-5161; `character.addXP` returns the level-up message | SHOWN |
| death | `character.is_alive=false` at main.js:1911, :8126, :8586, :9267; defeat staging `stageP23Defeat` main.js:1539, `publishDefeat`/`combatDefeat` imported from defeat_domain.js (main.js:6) | SHOWN |
| location change | `change_location` (used by dev console dev_console.js:73); not read in detail | STATED by use |

Recommendation (INFERRED, D1): a hook is a card-owned pure function `(cheatState, event) -> {state, messages, proposals}` declared by id in the card and dispatched by one `cheatHost.observe(kind, payload)` call at each site above. Kinds: `tick`, `combat_won`, `skill_xp`, `level_up`, `death`. Build only the kinds card 2 uses. The six `awakenOptionalStart` sites show the cost of adding a seventh ad hoc call: refactor those into one `observeCheats` already behind main.js (net zero for AR1).

## 2. UI seam map

| Question | Answer | Label |
| --- | --- | --- |
| How a panel registers | `definePanel({id,title,role,node,home,discovered,eligible,unavailableReason,settings,emptyText,after,defaultDock})` panel_kit.js:8-11; it calls `registerWorkspaceModule` workspace_layout.js:96 and sets `data-panel-role`, an icon from `roleIcons` (`actions/character/records/log/optional`) | SHOWN |
| Status window pattern | `createStatusWindow({read,onKnown})` status_window.js:10: builds the node under `#character_div`, renders on a 250 ms `setInterval` and on `subscribeDisplaySettings` (:55), registers `definePanel({id:'status-window',role:'character',defaultDock:'left',after:'shell-character',...})` (:50) | SHOWN |
| Discovery / eligibility | One predicate, `awakenedStatusCard(read().cheats)`, feeds `discovered`, `eligible` and the render guard (status_window.js:13,52-53). `unavailableReason` gives the dormant text | SHOWN |
| Settings | `settings:[{key,label,description,options,default}]` registered once when `known` flips true (panel_kit.js:14-16); read with `getDisplaySetting('panel.status-window.density')` status_window.js:29 | SHOWN |
| Where it docks | `defaultDock:'left'`, `after:'shell-character'`; `home` is a node or `'right'`/`'left'` string (adventure_notebook.js:131 uses `home:'right'`) | SHOWN |
| Creation site | main.js:9757 inside the init that runs after `domainRegistry.mountPanels()` (main.js:9656) | SHOWN |
| Planned panel ids | `PANELS` allow-list: status-window, death-menu, anchor-list, system-shop, companion-voice, simulator, simulator-foresight, appraisal-lens, harvest-ledger, harvest-multiplier-ledger, cheat-library, cheat-settings, quiet (cheat_cards.js:3-5). `validateCheatCard` rejects a card whose `ui` is not in it (:35). Only `status-window` is implemented | SHOWN |

Two comparable modules that plug in through the registry (the pattern to copy):

1. `book_world_lotm_domain.js:21-23`: `registerDomain({id,deps,tick,refresh,commands,projection,panels:[()=>{panel=createLotmPanel({read,act,...})}]})`; main.js makes one `configureLotm` call (file header :3). Panel `definePanel` in book_world_lotm_ui.js:40.
2. `companion_roster.js:165-168`: `registerDomain({id:'companions',initialState,save,validate,migrate,load,refresh,panels:[()=>{panel=createRosterPanel()}]})`, panel `definePanel({id:'companions',role:'records',...})` :160.
All lifecycle calls fan out from main.js: `domainRegistry.save` :6332, `.load` :6650, `.refresh` :3340/:4533/:8446, `.mountPanels` :9656 (SHOWN). Neither module is imported for state by main.js beyond its one line (INFERRED from the imports I saw).

What a second panel needs, say a death menu, anchor list or system shop:
- Its own `createXPanel({read, act})` with a `read` projection from the cheat domain and an `act` that goes through a domain command (AR7: quote, then revalidate).
- Its own `definePanel` with `discovered`/`eligible` built from the held card list. Add a shared predicate `heldCard(state, ui)` next to `awakenedStatusCard` so the status window and later panels stop each writing their own scan (rule of two: the second panel is the proof it is needed).
- `home`: death-menu is a modal-like state, not a dock, so decide whether the existing death/defeat surface (defeat_domain.js) hosts it. That is a UI decision for the card lane, not for this seam.
- The Appearance option patch in `onKnown` (main.js:9759-9763) is status-window-specific DOM poking; a second panel should not copy it. Prefer `registerPanelSettings` (display_settings.js) which `definePanel` already calls.
- The 250 ms `setInterval` render (status_window.js:55) is the one place a panel polls; with registry `refresh` available, panels 2+ should use `refresh`, not a new timer (AR3, STATED).

## 3. Dev cheat view

Gate: `config.enable_dev_mode` (config.js:5, SHOWN). The single existing precedent is `enableDevConsole` injection main.js:10075 (SHOWN). `testHooksEnabled` (simulation_clock.js:4-5) is a different gate: dev mode OR localhost with `?test_hooks=1`; it guards `pauseEngine/runEngineTicks` only (:73,77). Do not reuse it for cheat verbs (INFERRED: it would enable them on any localhost URL).

Design: add two groups to the same injected `helpers` object, no new window global scheme.

Read-only (safe, no mutation, no save):
- `cheat_view()`: returns `structuredClone(read())` plus a computed row per held card: id, ui, awakened, points, messages count, `hooks` ids, `discovered` by predicate, panels it would open. Also `cheat_panels()` lists `PANELS` minus implemented.
- Respects the sealed-secret rule: it dumps card data, not world truth (STATED AGENTS.md "Sealed secrets"; card state has no secrets today, INFERRED).

Mutating verbs (explicit, draft-based):
- `cheat_grant(card_id)`, `cheat_awaken()`, `cheat_set_points(n)` all edit a `draft = structuredClone(cheatState)` using the existing pure transitions (`grantCheat`, `awakenCheats`, a new `setCheatPoints` that goes through `validateCheatState`). Each returns a diff from live state. Invalid input throws the same validator error.
- `cheat_apply()` assigns the draft to live state through an injected `setCheatState(next)` that does `validateCheatState`, then `window`-side `domainRegistry.refresh()` and panel render. It does not save.
- `cheat_discard()` drops the draft. Persistence is only the player's own `save_progress()` (main.js:6621) or the autosave already in the game; verbs never call `create_save`.

Save safety (SHOWN vs INFERRED):
- Live state persists on the next save because `create_save` reads `cheatState` (main.js:6529, SHOWN). So "not persisted unless saved deliberately" holds only if apply is a separate step and the log says so (D2). Existing dev verbs (`add_money`, `give`) already persist on any save (INFERRED from dev_console.js:62-64 mutating live state), so this is consistent, not stricter.
- `is_on_dev()` selects `dev_save_key` (main.js:6186, used :417,:1227,:6621), so dev saves stay apart from the live key when that function says dev (INFERRED; I did not read its body).
- Awakening uses the durable-first rule (main.js:417-420). `cheat_awaken` must not bypass it: in dev it should call the same pure `awakenCheats`, then require an explicit `save_progress()` for durability; document this deviation.

Single focused test: `tests/cheat_dev_view.test.js` using `cheatGame()` (tests/helpers/cheat_game.mjs). The helper already appends `__cheatTest = {create_save, load, advance, read, set}` to main.js source at build time (SHOWN helper :12-14), but only with `enable_dev_mode`-independent injection; the test needs dev mode on, so either set the `config` flag via the same esbuild onLoad plugin (INFERRED, one extra replace) or add `cheat_view` access through `__cheatTest`. Assertions, one scenario:
1. Start with `start:'system-quests'`; `cheat_view()` shows one dormant card, `points:0`, status-window hidden.
2. `cheat_awaken()` then `cheat_apply()` (no save): status window visible, `__cheatTest.create_save()` includes `awakened:true` (proves live state feeds saves, i.e. why apply is explicit), but `localStorage` save key content is unchanged.
3. `cheat_set_points(-1)` throws; `cheat_discard()` restores.
4. `save_progress()`, reload, `cheat_view()` equals saved state (state, command, UI, save/reload per AR10).
Mark all of this implemented-unverified until run; this document ran nothing.

## 4. Minimal cheat host boundary

Recommended (O1): `src/cheat_host.js`, a registry domain in the lotm/companions shape. About 80 to 120 lines.

Stays in `cheat_cards.js`: card schema, `validateCheatCard/State`, `grantCheat`, `recordCheatMessage`, `awakenCheats`, `awakenedStatusCard`, and the card catalog (`SYSTEM_QUESTS_CARD`, card 2 to 4 definitions). Pure and import-free (SHOWN: it imports nothing).

Goes in `cheat_host.js` (new): 
- `registerDomain({id:'cheats', initialState:defaultCheatState, save:()=>state, validate:validateCheatState, load, refresh, tick, projection, commands:{grant,awaken,observe}, panels:[mount status window and later panels]})`. This moves `cheatState` out of main.js (AR1 payment: removes :397, :627, :6529, :6651 and `cheatCalendarTime`/`awakenOptionalStart` bodies; adds one line).
- The commit rule: keep durable-first as an injected `commitSave(serialized, onDurable)` port wrapping `lifeSaveStorage.setItem`.
- `observe(kind, payload)` as the single hook dispatcher (section 1b); the existing six `awakenOptionalStart` call sites become `observe('tick'|'combat_won', ...)`.
- A shared `heldCard(state, ui)` predicate.

What main.js injects (AR4, few ports, no GameContext): `{read: {level, stats, titles, dayCount, calendarTime}, ownsSave, saveBlocked, commitSave, logMessage, addXp}`. Four to six ports; `create_save` stays main.js's. Dev verbs get the host's `commands`, via `enableDevConsole`'s argument list (one new key `cheats`).

Order of work (INFERRED): (a) structural move to a domain with the same behavior (AR9: same scenario before and after, save, reload, Export, Import), (b) card 2 as the second case (AR11), (c) only then extract what card 2 reused.

### What NOT to build yet
- Do not build a generic hook DSL, rule-language effects or `cheat_overlay` modules. No card needs them; the only rule target in the resolver is oral restore (rule_modules.js:13).
- Do not build a mutation event bus (AR3). Observer calls at existing sites only.
- Do not stub `death-menu`, `anchor-list`, `system-shop` panels. One allow-list entry per implemented panel; keep the other planned ids as data (cheat_cards.js:3).
- Do not add a cheat settings or library panel (`cheat-library`, `cheat-settings`) before a second held card exists.
- Do not add cheat verbs that persist by themselves, and do not make `testHooksEnabled` the gate.
- Do not write a card-authoring tool; cards are data files validated by `validateCheatCard`.
- Do not extend the 250 ms render poll to new panels.

Risks: R1 the six `awakenOptionalStart` sites mean the observe refactor touches main.js broadly (AR15 writer reservation needed). R2 `heirs/death` flows (chronicle `nativeLifeEnded`, main.js:396, :9267) may need cheat state to carry or reset across lives; unresolved, ask the inheritance owner before card 2. R3 `known:{}` in the state shape has no reader (SHOWN: grep found none in the read paths); do not build on it until a card needs it.
