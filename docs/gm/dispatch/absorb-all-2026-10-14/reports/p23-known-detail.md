# P11 known-item hotkeys and known-route detail, 2026-10-14

Status: **source/module delivered, native loop implemented-unverified**. P00 host
integration and its native acceptance candidate are OPEN. This lane is not a
passing gameplay merge candidate. No push or merge by this lane.

## Authority, scope and reservations

Base and initial live HEAD: `0216ccdefcfce79877378f8cb0ee41129fe11c5d`.
Branch `absorb-all/p23-known-detail`; initial working tree clean. Coordinator
assignment reserves this worktree, exclusive areas and port18830; live
`runs/SESSIONS.md` lists the lane and session. Port18830 was vacant before
starting the lane-owned Python server. No other port or personal save used.
The later coordinator instruction to build against the base without waiting
supersedes the prepared packet's wave1 wait. COMMON, AGENTS, PROJECT,
USER_VISION and relevant LIFE_SIM_NORTH_STAR direction were reconciled.

Target: 1366×768 desktop/laptop, keyboard-accessible binding/use/unbind,
known readiness and exact numeric values. Mobile optimization deferred. New
mechanics/fiction are not introduced. Rebuilt native baseline and isolated
module controls are distinct evidence layers. Sealed/private names and drop
catalogs are never enumerated by these modules. Effects-off cap is retained;
these new presenters add no motion or sound.

Read owners: native enemies/display bestiary, skill_expansion_content/host/ui,
known_routes/known_routes_ui, adventure_notebook, display_settings and
save_files. P08 retains recipe route and recipe edits. Wave1 ui-polish report
`fd737f8a` was read: keyboard detail parity and existing settings are retained.
Reveal-chain report was not landed at last check. Existing d49cb911/379007d7
features (Vivid, new marker, coin/reveal, crafting, settings/panel kit) were not
reimplemented. P00 must reconcile its final disclosure presenter after wave1.
Pinned HTML hash matches audit input: `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
R1–R5 reader notes and the relevant M3/mod settings/readiness/number notes were
read as inspiration. No foreign code or assets copied.

## Row dispositions

| Row | Decision | Landing and evidence limit |
| --- | --- | --- |
| R35 | Retain native equivalent | Existing first-kill entry/count and unknown-name placeholder verified on rebuilt native desktop; no bestiary rewrite. Source comparison preceded changes; actual native first-kill verification followed the module edits. First actual-drop persistence remains OPEN. |
| N12 | Improve demonstrated per-creature gap | Native bestiary uses global obscure_name(item) and catalog odds. `observations.js` accepts actual native loot receipts only; `projectObservedDrops` requires player/creature-specific observations and explicitly known labels/odds/rank. No catalog scan or invented learned odds. Host settlement/save wiring OPEN. |
| N13 | Independently implement | `hotkeys.js`: per-browser stable identity binding, rebind/unbind, no hover, typing/repeat/composition/modifier guards, fresh custody/eligibility read and native preflight. Settings list exposes stale binding removal without exposing its opaque ID. Native use/equip adapters OPEN. |
| N19 | Derive existing known chain | `presentation.js` consumes skillExpansionPresentation learned families/milestones/actions. Actual Trail reading presenter/preview parity tested; no free-stat grants or new progression. Native Notebook attachment OPEN. |
| N25 | Render native readiness | Same native-disclosed actions, terms and blockers; no runtime regex scan, hidden catalog or recipe edits. P08 owns recipe acquisition. Native presentation attachment OPEN. |
| N26 | Optional presentation | display_settings numberFormat exact(default)/compact/scientific; formatKnownNumber preserves String(value), keyboard-expandable exact value; rarity words require authored known metadata, never infer rarity from mastery. Native hosts must supply metadata; absent rarity is omitted. |
| N27 | Optional versioned settings carry | display_settings exports/validates/adopts a whitelist snapshot with per-key local precedence. Two isolated contexts and literal presentation-snapshot file tested. Actual native save envelope/import hooks OPEN. |

## Exact P00 host requests

H1: Import `createKnownItemHotkeys`, `mountKnownItemBinding`,
`mountKnownItemHotkeyList` from `src/absorb_p23/known_detail/hotkeys.js`.
Create one controller per live game UI, destroy it on teardown. Signature:
`createKnownItemHotkeys({read, preflight, command, storage, target, notice, reserved})`.
`read()` returns `{canWrite,error,items:[{id,label,known,owned,eligible,action,inputFingerprint}]}`.
IDs are the native stable selected-copy identity for equipment or native known
stack identity for consumables. `action` is `use` or `equip`. Include known stale
bindings as unavailable where possible; never substitute a spare or reveal an
unknown row. `reserved` is the host's reserved letter/digit list. Controller
uses only unmodified letters/digits; F6/Escape/navigation are unaffected.
`preflight({id,action,inputFingerprint})` returns `{eligible,command}` only after
native exact-copy, custody, world/body, actual resource and current action checks.
`command(frozenCommand)` revalidates and settles atomically via the existing
native dispatcher. No DOM direct use/equip or second receipt path. Mount row
form into each supported known inventory row and list into browser settings;
call render after inventory/binding changes. Preserve ui-polish focus/detail.

H2: Import `mountKnownMethodChains`, `mountKnownNumber` from `presentation.js`.
Mount the former into the existing Notebook Practice surface with
`mountKnownMethodChains(host, () => skillExpansionPresentation(state, registry, nativeContext))`.
Call render with the same native context used by the actual action preview.
It displays learned families only, copies native milestones/readiness and grants
nothing. No hidden descendants, future count or independent requirement rules.
Optional `family.rarity={known:true,text}` must be authored/disclosed metadata;
otherwise omit it. `mountKnownNumber(host, value, getDisplaySetting('numberFormat'))`
returns a keyboard-expandable exact-value details node. Use for an appropriate
known large count; maintain native currency units, calculations and inputs.
Subscribe to display changes, replace/destroy the old detail when rerendering.
P00 owns any CSS/workspace placement and route registrations. Existing Known
Routes quote/fingerprint execution remains authoritative and unchanged.

H3: Import `validateDropObservations`, `settleObservedDrops` from `observations.js`.
Optional envelope field proposed: `p23_drop_observations`.
Shape: `{schema:1,creatures:{[nativeCreatureId]:{lastKillOrdinal,drops:{[nativeItemId]:positiveSafeInteger}}}}`.
Validate a present field before any envelope/live/storage mutation and validate
it through isolated loader preflight. Absent field means no observations, no
retroactive drop associations. Native first-kill count still owns discovery.
After each real eligible player kill's actual loot settlement, call
`settleObservedDrops(old, {recipientId:'player',creatureId,killOrdinal,drops:[{itemId,count}]})`.
`killOrdinal` is that creature's native monotonically increasing bestiary count;
process in native order, not a UI timer. Publish the returned optional state
atomically with the real loot/count save. Repeated/restored same ordinal is inert;
later real kills keep counting, no lifetime once cap. Do not infer receipts from
item ownership or registry drop possibilities. `projectObservedDrops(facts)`
needs `{known:true,recipientId:'player',observed:true,id,label:{known,text},count,
rank?:{known,text},chance?:{known,text}}`. Join names via native item/discovery
owners only for observed associations. Exact odds require independent native
learned evidence; observation of an item alone does not teach its odds.

H4: Import `exportDisplayPreferences`, `validateDisplayPreferences`,
`adoptDisplayPreferences` from `display_settings.js`.
Optional envelope field proposed: `display_preferences`, shape
`{schema:1,settings:{supportedDisplayKey:value}}`. Export only whitelisted core
display preferences/colors; panel definitions, bindings, world/private state,
account/hardware data and gameplay pacing are excluded. In validateSaveEnvelope,
if Object.hasOwn(save,'display_preferences'), validate it before mutation and
through native loader preflight. After the whole literal-file import preflight
and guarded save write succeed, adopt the snapshot in the destination browser.
Also support adoption after a validated saved-life load when local keys are
absent. Never adopt during the isolated preflight itself. Existing own local
keys win individually, including local Exact; missing keys may adopt. Absent
snapshot is inert; future/unsupported schema rejects before save mutation.
Malformed existing local preferences are retained rather than overwritten.
A storage/adoption failure must not be described as failed gameplay import or
roll back a valid save; keep imported game and report preferences not adopted.

H5: Return an integrated candidate before marking native gates passed. Rebuild
and test actual keyboard bind/use/equip/unbind at1366×768, real known chain
preview parity, observed first drop with no unobserved truth, Effects-off,
Save/reload/export/literal-file import in two fresh contexts and existing-local
precedence. The current fixture's file is a presentation snapshot, NOT a game
save. No native persistence success is claimed for these new fields.

## Compatibility and verification

C1: New game state is optional. Old saves gain no synthetic kills, drops,
learning, currency, skill rarity or settings. Existing display defaults/settings
are retained except one optional number format defaulting to Exact. Browser
hotkey preferences use independent schema1 localStorage; corrupt preferences
are inert. Native envelope validation and atomic settlement are P00 obligations.

C2: `npm run build` passes, including Ink parity. Final served bundle SHA256 `aa9e4155fa4961e114f1b4afff28964363002517e584e783e3e52f8c69f5a9ea` and
browser results are in checks/p23-known-detail/browser-results.json. Served
bundle bytes were compared with the rebuilt file. Dist/index build stamps are
not committed. Rebuild the integrated stack.

C3: Focused `node --test tests/p23-known-detail.test.js`: **10/10 pass**.
Final full `npm test -- --test-concurrency=2`: **631/631 pass, 0 failures,
0 skips**, duration10630.110792ms. The first default-concurrency `npm test`
completed **628/629**, with the existing alloy_equipment test
"equipped native brace with an open road offer keeps ticking, travelling and
reloading" timing out its child fixture after60489.804542ms. It passes in the
final bounded run. That timeout is not claimed as a proven pre-existing source
failure. Early new readiness fixtures were incomplete (missing player power
map/fragments) and fixed; final actual presenter/preview test passes.

C4: Browser evidence at1366×768 includes unchanged native first-kill bestiary,
fresh baseline without page errors, served hash, and separately labelled module
contracts: keyboard bind/use/typing/rebind/unbind/reload, stale cleanup, exact
value access/readiness, observed-drop omission and two-context literal snapshot
adoption/local precedence. The initial Playwright bundled browser was absent;
route switched to installed Chrome headless, with no package install or native
foreground control. Final **10/10 browser groups pass**; count/status in browser-results.json. An intermediate harness reload timed out; the independent reload reproduction and final isolated run passed without runtime source repair.
Screenshots visually reviewed. source-inputs.json records module/test hashes and served source byte matches. Fixtures are not native gameplay acceptance.

C5: `git diff --check` passes. No main-checkout game/source/raw-source/user-save
writes. Only own report/ledger mirrored to the coordinator's report folder.
No original/audit ledger modified. No dist staged. Source commit recorded below.

## Remaining gate and merge risks

P00 exclusively owns main/display/items/skills/activities/calendar/save/workspace
wiring. Every new native loop and optional native persistence field stays
**implemented-unverified** until H5. Do not final-merge this lane under COMMON
as a completed gameplay lane. Coordinator may assemble an integration candidate.
After technical native gates, the remaining authoritative acceptance is
Weibao's desktop play/taste. No human acceptance claimed.

Only shared overlap is src/display_settings.js: preserve wave1 settings and
panel registrations when joining these additive functions/numberFormat row.
No adventure_notebook/known_routes_ui edits were necessary; P00 can attach the
focused presenters without replacing those owners. Reveal-chain changes may
require the adapter to follow its final disclosed-family output. P08 recipe
route is untouched. Optional envelope keys are proposals for P00 to confirm.

Source/task commit: `e43f0f9bc7793b005be8cb17b7be9f7e180a6d60`. Evidence/report commit follows separately. Lane server stopped after verification; coordinator port ownership remains unchanged.
