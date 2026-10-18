# B3 knowledge versus truth inspector

Proposal, 2026-10-14. CN10 build design, not implemented or accepted gameplay.
The user requests an existing-state inspector now and belief comparison later.
This expands CN10's timing without selecting IM2 or a revealer-card build.

Authority: [COMMON](../COMMON.md), [PROJECT](../../../../../PROJECT.md),
[user vision](../../../../USER_VISION.md), technology owner
`docs/TECHNOLOGY_AND_PROGRESSION.md:1501-1548,1819-1820,1877`.
OM1 keeps truth, actor knowledge and presentation separate; OM3 keeps evidence
with its producer. IM2 remains absent. T13 R12c avoids duplicate economy
balances; T14 L75/L76 distinguishes valid card data from working revealers.

## Current source audit

Locators are repository-relative, checked against the source read in this lane.
They are source observations, not rebuilt browser evidence. No sealed values
are reproduced here.

| Surface | File:line evidence | Consequence |
|---|---|---|
| B3F1: Build | `build.js:23-34`; `package.json:6-10` | One esbuild browser entry, minified ESM and source map. No compile-time dev inspector definition or dev build script in these files. `logLevel: "debug"` is build logging, not a gameplay gate. |
| B3F2: Runtime dev switch | `src/config.js:5`; `src/main.js:8800-8802` | `enable_dev_mode` defaults false and enables a console. It is not proof of production bundle exclusion. |
| B3F3: URL dev detection | `src/main.js:5085-5089,415` | Exact upstream dev URL selects existing dev-save behavior. Localhost and arbitrary query flags are not this detector. Do not reuse it as an inspector build gate or alter save-key selection. |
| B3F4: Existing dev tools | `src/main.js:8120-8138,8164-8192,8219-8241` | Console helpers grant money/XP, unlock travel and change flags; combat simulation creates a DOM window. No dedicated knowledge/truth inspector found by scoped source search. Do not enable the mutating console to get inspection. |
| B3F5: Cheats | `src/cheat_cards.js:2-6,32-46,48-79,89-104`; `src/main.js:319,5353` | Fixed panel enum, JSON-only cards, held/known state and recorded acquisition/messages. Grant/message/awakening are separate writes. Inspector reads held state without calling them. |
| B3F6: Status window | `src/status_window.js:8-54`; `src/main.js:8527-8536` | First eligible awake status card exposes native level/stats/titles/points and fixed quest text. It calls `onKnown` and registers a panel. It has no RC1/RC2 tab or comparison renderer. |
| B3F7: Display settings | `src/display_settings.js:1-6,38-46,71-80` | Browser settings live in `yairpg.display.v1`, outside game saves, but still persist and export. Do not register inspector preferences there. Read theme/effects only. |
| B3F8: Panel kit and layout | `src/panel_kit.js:6-16`; `src/workspace_layout.js:8-16,33-43,318-325` | `definePanel` registers a workspace module and optional stored preferences. Layout can serialize registered module IDs. F6 already cycles workspace panels. Reuse visual conventions, not registration/persistence. |
| B3F9: Actor/world facts | `src/expansion_engine.js:75-95`; `src/simulation_effects.js:104-114` | Actor facts/resources and actor-linked world facts exist as saved scalar domains. Derived execution facts include knowledge and contextual predicates; they are not all actor beliefs or a universal truth service. |
| B3F10: Existing local knowledge | `src/simulation_contracts.js:217-218`; `src/simulation_effects.js:282-285` | Actor-keyed seen/interpreted/understood records have value/time/cause and optional basis. They are useful legacy records, not IM2 questions, revisable beliefs or TK fidelity. |
| B3F11: Native skills | `src/models/skill.js:104-129`; `src/models/person.js:205-206`; `src/components/levelable_component.js:29,99-107` | Skill accessors use the native player and can create missing XP objects. Read an existing actor's `skill_progress` directly, detached. Do not enumerate definitions through these getters. |
| B3F12: UI craft receipt | `src/display.js:361-363,3180-3184,3228-3237`; `src/crafting_detail.js:107-111,127` | One session-only `{key,text}` receipt reports measured native output/input/XP differences. It is not a saved craft history or a maker-at-craft skill snapshot. |
| B3F13: Retained craft receipts | `src/work_ledger_system.js:49-51,73-74,130-142`; `src/main.js:5356` | Work Ledger holds bounded receipts including `native-craft` and `native-craft-failed`, plus benefit-application receipts. It is not a complete lifetime archive. Inspection must not connect the ledger, settle or claim commissions. |
| B3F14: Other receipt owners | `src/lore_history_state.js:7-8,20-30`; `src/invention_receipts.js:37-48,62-68` | Typed Village outcomes are not native craft receipts. Planner captures are pure retained demo roadmaps, not a wired gameplay evidence store. Do not combine them into invented IM2 evidence. |
| B3F15: Planner | `src/invention_planner.js:225-263`; `src/invention_qa.js:129`; technology owner `:1807-1809,1870` | Merged pure known-roadmap code exists. Unknown nodes use slots, and beliefs are not checked against truth. Demo consumers remain unwired. Do not present the demo pack as the actor's world truth. |
| B3F16: Save boundary | `src/main.js:5104-5125,5353-5370` | Serializer explicitly includes cheats, Work Ledger and expansion. It also invokes observation/clock/native snapshot helpers. Inspector must not use `create_save()` as its refresh reader. |

Search scope for dev/debug absence: `src/`, `build.js`, `package.json`,
`index.html` for debug, enable_dev_mode, NODE_ENV, import.meta.env and __DEV__.
This is not a claim that every external harness or historical worktree lacks
debug instrumentation. Existing test-only loader access is at
`tests/helpers/cheat_game.mjs:1-17` and is not a shipped dev API.

## B3D1. First slice: detached current-state snapshots

The dev build offers a text button, **Dev inspector**, outside the workspace
module registry. It opens an inline dev region beside the game board, not a
gameplay status card. At 1366x768 the region uses two columns and its own
scrolling body; header, actor selector, Refresh and Close stay visible. Closing
restores the opener's focus and the existing workspace geometry. Use existing
theme variables and panel region/header conventions, with scoped styles injected
by the dev module. No production stylesheet or static HTML entry is required.

An explicit Refresh takes one coherent detached snapshot. There is no tick,
RNG call, background polling, network lookup or mutation. Changing actor/filter,
paging or closing changes only local UI variables. Paginate long tables in
50-row pages with all authorized records reachable; never silently truncate them. Before the host is ready,
display **Game state unavailable** and do not create an actor or enroll services.

| View | First-slice data | Honest boundary |
|---|---|---|
| Facts | Actor ID/world ID, curated actor facts/resources, corresponding world scalar facts, owner path and snapshot clock/sequence | Saved engine state, not inferred knowledge. No enumeration of every authored world or NPC. Only explicitly public or already route-authorized subjects. |
| Skills | Existing native player `skill_progress`: current level, total XP and existing bonus-level data, identified separately; registry availability only via verified pure reads | No native NPC skill mirror. Missing record is **Not recorded**, not fabricated zero or initialized state. Learned levels are not TK fidelity. |
| Cheat state | Held card IDs/family/UI, existing awakened/points fields, acquisition route/time, message count; known metadata after safety filtering | No inferred dormancy for legacy cards with absent `awakened`; no messages means no status eligibility. Existence of hooks/stages is metadata, not running behavior. |
| Craft receipts | Retained Work Ledger craft/application receipt IDs/type/sequence/text, plus the current session UI receipt from a new detached accessor | Keep owner and retention labels. Page-session receipt may predate an in-page import; label that explicitly. Reload loses it normally. Missing maker skill, cost breakdown or timestamp stays **Not recorded**. |
| Knowledge comparison | Optional legacy stage/value/cause/basis rows; separate IM2 comparison section says **IM2 unavailable** | Never convert legacy stages to TK0-TK5, never derive beliefs from skill levels or craft success. Roadmap says **No native binding** until an admitted owner is supplied. |

Do not render raw JSON. The host passes allowlisted scalar rows and specific
receipt fields, not a whole game object. A new `readCraftReceiptSnapshot()` in
`display.js` may clone the existing `{key,text}` or return null. It must not
refresh the crafting screen, invoke a recipe, save or add history. Receipt text
is historical source text; current skill never rewrites it (CN3).

Read-only includes getter behavior. Use
`character.getLevelableComponent().skill_progress` as the source of recorded
native progress using the pure component accessor (`src/models/person.js:143-145`). Do not
call `getCurrentLvl()`, `getTotalXP()` or `getSkillXPObject()` across the registry.
The host builds fresh row objects; renderer never receives mutable owner refs.
Tests freeze inputs and compare the complete relevant owners, including RNG,
sequence, skill-record key set and receipt collections, before and after reads.

## B3D2. Build exclusion and zero persistence

Proposed compile-time identifier: `__YAIRPG_DEV_INSPECTOR__`. `build.js` defines
it as literal false for `npm run build`, true only for an explicit
`node build.js --dev-inspector` / `npm run build:dev-inspector`. Reject unknown
mode arguments rather than treating them as opt-in. Keep `config.enable_dev_mode`
false; do not couple this new flag to console grants or save routing.

The main host contains a guarded lazy import, evaluated after native startup:

```js
if (typeof __YAIRPG_DEV_INSPECTOR__ !== 'undefined' && __YAIRPG_DEV_INSPECTOR__) {
    const {mountKnowledgeInspector} = await import('./dev/knowledge_inspector.js');
    // Supply an explicitly detached, filtered read callback. No commands.
}
```

This is a proposed seam, not a pasted patch: fit startup readiness and cleanup
to live main.js before coding. Literal-false bundling must eliminate the dev
module, its injected style, UI strings and handlers. A query parameter,
localStorage value, hostname or console function cannot activate the normal
bundle. No global inspector API is exposed. Dev-labelled artifact verification
records build mode/hash so a dev bundle cannot be mistaken for production.

Check esbuild metadata for zero dev-module contribution to normal outputs;
check bundle and source map for absence of dev-module code and source content.
A guard/import locator in the main source map is not executable inspector code.
Verify the built normal page has no opener/region, even after attempted runtime
flag overrides. Do not rely solely on a hidden node or a false runtime setting.

Inspector UI state stays in the dev module's closure: open, selected actor/tab,
filter, page and snapshot. No localStorage, sessionStorage, display setting,
workspace registration, customization, game-save field, feed or biography write.
Destroy listeners and nodes on teardown; reload begins closed with no remembered
selection. Game save schemas and old-save behavior do not change. The inspector
must neither serialize its own state nor overwrite legitimate game fields.

Save proof uses the real serializer/loader in a test-only harness, not inspector
production capabilities. With the clock held by existing test controls, compare
closed/open/refreshed saves, plus relevant live owner hashes and all browser
preference keys. Serializer-induced changes must be isolated by a matching
closed-inspector control. Then Save, reload and literal-file Import a disposable
fixture through the existing routes. Inspect exported decoded data for absence
of inspector keys. Do not equate only a JSON roundtrip with native persistence.

## B3D3. RC1/RC2 reuse without granting cards

There is no RC execution logic to reuse today. T14's cards are validated authoring
data; six UI IDs are rejected, including `rc2-system` (`research-roadmap`).
Do not install cards.json, widen PANELS, fabricate a held entry or invoke
`grantCheat`, `recordCheatMessage`, `awakenCheats`, `onKnown`, teaching or rewards.
T13's proposed status-window reuse and T14 L30's new-panel option remain separate
future gameplay choices. This dev slice needs neither decision.

Propose a small pure comparison module, `src/research_reveal.js`, using T13's IM8
name, only after confirming that no current worker owns it. Phase A returns
explicit unavailable statuses; it need not build hypothetical comparators.
When IM2 and an admitted truth/roadmap owner exist, the dev inspector and later
RC presenters share these data readers, rather than borrowing card acquisition
or status-window mounting:

| Reader contract, proposed | Dev consumer | Future gameplay consumer |
|---|---|---|
| Belief/truth join by subject/property/world instance/context/revision, with receipt references and qualified comparator | Reads authorized nonsealed truth and records; displays both sides and comparable/not comparable result | RC1 base grade receives only the permitted fidelity/verdict, never the correction. Mature correct-neighbor output needs its own actual owner/grade. |
| Paired roadmap projection from one admitted retained graph/revision and actor knowledge | Displays actor view beside scoped true graph, with capability gaps and coverage label | RC2 receives only its granted scope/grade; seeing a graph grants no stock, unlock, skill, access or practical mastery. |

Use `roadmapView` / bounded `runPlanner` for the actor side. The full graph comes
from an admitted, law-qualified owner, not fake TK5 grants for every node.
Inspector opening does not call `captureRoadmap`, pin a route or settle a product.
No demo roadmap is shown as native play; `unbound-demo` remains visible if a
separately authorized developer fixture is ever used. Critical-path duration
cannot come from graph depth; timing requires actual scheduler evidence.

Stage B joins receipt-backed claims only after IM2 exists. No save shape is
reserved here: T13's optional `save.research` is a proposal, not a live path.
The IM2 owner supplies a detached adapter with actor identity, supported schema,
truth revision/context and receipt resolution. Missing means empty/unavailable;
unsupported schemas stop the comparison without mutation. False hypotheses
absent from the lawful graph remain separate claim rows, not discarded nodes.
Confidence, fidelity and truth agreement are distinct columns. No evidence is
not false; incomparable contexts and missing truth return unknown. Nothing is
copied from debug output into actor knowledge.

## B3D4. Sealed subjects and failure behavior

Dev-only access does not unseal content for Weibao. Start with a curated public
subject allowlist; use actual existing discovery authorization for any additional
subject. Unknown subjects fail closed, including nested strings, IDs, receipt
text, attribute labels and filter suggestions. Display sealed subjects only by
safe secret ID, route and status. Do not display hidden values, answers, labels,
counts or DOM attributes that reveal them. No raw JSON fallback, clipboard dump
or console logging of snapshots. Tests use invented sentinel secrets only.

If no trustworthy public/discovery classification exists for a field, omit that
field and record the bounded adapter gap. Do not build a new general secrecy
engine. An actor/world change invalidates the old snapshot; Refresh reads the
new current owners. Read failure gives an unavailable message without save calls,
repair, enrollment or automatic retries. Mount failure affects only the dev
region and is reported with a safe error code.

## B3G1. Delivery gates and deferred scope

First-slice done requires production artifact exclusion, immutable current-state
reads, a rebuilt dev/normal comparison at 1366x768 and native save/reload/import
proof with zero inspector persistence. [BUILD_PROMPT](BUILD_PROMPT.md) specifies
the checks and stop conditions. These gates are specified, not run by B3.

Belief comparison remains OPEN until IM2 and qualified truth readers exist.
RC gameplay, card acquisition/awakening, IM5 generation, item provenance,
roadmap pinning/execution, generic debug grants, mobile optimization and human
taste acceptance are outside this slice. A first-slice inspector is not delivery
of full CN10 beliefs-versus-truth behavior.
