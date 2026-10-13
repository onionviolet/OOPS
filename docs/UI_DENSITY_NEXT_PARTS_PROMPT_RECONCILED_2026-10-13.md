<!-- Reconciled from UI_DENSITY_NEXT_PARTS_CHATGPT_RESPONSE_2026-10-13.md, part (a).
Three local edits, everything else verbatim:
R1 removed the reviewer's claim that this prompt is implementation authorization;
R2 noted the PLAY blocker (A4.1) can be pulled forward;
R3 added an honest fallback when real browser zoom cannot be driven. -->

# YAIRPG next UI pass: five bounded implementation slices

> **Standing-direction reconciliation, 2026-10-13:** This finite pass is complete
> per its [checkpoint](gm/dispatch/ui-density-slices-2026-10-13/CHECKPOINT.md).
> The original criteria below are retained as historical task scope, not a new
> assignment. Future reuse must follow the [standing UI priority](USER_VISION.md#standing-ui-priority-2026-10-13)
> and [UI scope gates](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#standing-ui-scope-and-acceptance-gates-2026-10-13).
> Do not inherit 400×800/mobile optimization as required scope. Affected laptop
> zoom and compatibility checks remain relevant; recorded narrow-screen proofs
> stay valid for their original slice and do not establish product priority.

## Role, authority, and working rules

You are implementing the next UI work for YAIRPG, a personal fork of Miktaew's browser idle RPG "Yet Another Idle RPG" (MIT, attribution preserved).

User / creative director: Weibao  
Repository: `/Users/weiwei/code/yet-another-idle-rpg`  
Expected branch: `codex/gameplay-foundations`

This prompt does not itself authorize implementation. Begin only when Weibao launches it or gives standing authorization for this pass; then work within the gates and exclusions below. Complete one slice at a time. A slice is not complete until its browser acceptance checks and relevant persistence checks have been exercised. Leave the game in a playable state after every slice before proceeding.

Before editing:

1. Read `AGENTS.md` and `PROJECT.md` first. Treat their live contents as authoritative where they conflict with this supplied summary.
2. Confirm the current branch, HEAD, `git status`, and relevant tracked/untracked changes.
3. Inspect active dispatch checkpoints under `docs/gm/dispatch/` and identify live write owners before touching files.
4. Preserve unrelated dirty edits and concurrent owners.
5. Locate the audit material and drivers under `docs/reviews/ui-density-2026-10-13/`.
6. Verify consequential repository facts named below against the live source. The line numbers and commit-derived observations in this prompt are audit evidence, not substitutes for inspection of the current tree.
7. Establish the persistence behavior described under "Persistence preflight" before changing any layout defaults or schemas.

Do not reset, discard, overwrite, or reformat unrelated work. Do not commit, push, publish, deploy, or mutate upstream/reference worktrees unless separately authorized. Do not expose sealed world truths through UI, test fixtures, screenshots intended for publication, reports, panel names, pickers, or player-facing strings.

If the current tree has materially diverged from the audited implementation, reconcile the intent of the slice with the live code rather than mechanically reproducing old line-specific suggestions. Record any such divergence in the slice report.

---

## Product contract that must survive

### Original play model remains the baseline

Per the PROJECT.md decision dated 2026-10-02, extend the existing panels and center actions rather than creating a collection of separate gameplay windows.

Preserve vanilla opening, quests, stats, professions, equipment, and center-menu play.

### Keep reasonable options reachable

"Everything possible, reasonably": every reasonable player option should remain reachable. Prefer reversible choices. Add a setting only where multiple modes have durable player value rather than merely preserving an implementation experiment.

### Sealed secrets

Never surface a sealed world truth outside its intended discovery route.

### Persistence

Saves are private. Persisted state includes, at minimum, workspace layout storage currently reported under:

- `yairpg.workspace.v1.desktop`
- `yairpg.workspace.v1.narrow`
- `yairpg.workspace.v1.authoring`

Do not assume these are the only relevant keys or that changing `presetLayout()` affects only untouched users. Trace the actual read/write/default/merge/import code first.

A persisted-data change requires one of:

1. backward-compatible interpretation with no migration;
2. an explicit migration with observable verification; or
3. an explicit compatibility decision documenting why existing persisted data intentionally remains unchanged.

Never silently reset a player's custom layout to obtain the new default.

### Strengths that must not regress

Preserve:

- no horizontal page scroll at the tested desktop widths;
- narrow reflow;
- keyboard-reachable native actions;
- authoring isolated behind "Authoring" / "Return to play";
- existing job consequence wording such as full-round pay and early-stop consequences;
- inline cost/duration where already provided;
- reduced-motion behavior;
- player-selectable presets and density modes.

---

# Supplied audit baseline

The audit was run 2026-10-13 against fork HEAD `dd3efe33`, bundle sha256 prefix `451be34e…`, with original v0.5.5.30 `e3356432` and fork v0.6 base `25afe1a8` as references.

All audit comparisons used fresh disposable browser origins and a matched progressed save.

Treat the following as supplied audit findings to reproduce or invalidate against the live tree, not as facts to blindly encode.

## F1: center space is too constrained

At 1366×768, the audited Workspace preset exposed only 143 px of an approximately 830 px Local actions body. At larger desktop sizes it still constrained routine play substantially.

The center stack placed Time & weather, Current location, Current work & saving, then Local actions vertically.

The original and v0.6 could expose routine actions such as movement, crafting, talking, merchant access, work, training, gathering, and food use without the same routine scrolling.

Busy work, crafting, and trading were also vertically constrained.

Audit evidence pointed to `src/workspace_state.js` and `presetLayout('Workspace')`; inspect the current implementation before changing it.

## F2: expansion content precedes some native choices

Audit source inspection found special ordering for only some location controls, while native craft, sleep, and chest controls could remain after expansion material.

Reported expansion material included a Waypost supply clerk, learned-item sources, and several disclosures.

The result was that "Try to craft something" appeared below large amounts of expansion content.

Trace the live rendering/order mechanism before choosing CSS ordering, DOM restructuring, or another solution.

## F3: combat sits outside the useful workspace geometry

The audited enemy/stance region rendered as a wide band beneath the workspace docks. At 1366 it displaced retreat and the message log; at 1920 it consumed substantial mostly empty height.

## F4: layout chrome dominates play

The audited play surface exposed Authoring, Edit layout, preset selection, reset, density, panels, layout configuration, gesture help, and panel grips/resize handles.

Move and resize controls also remained in keyboard order outside layout editing.

The audit found Workspace to be the first-run fallback, despite an earlier product recommendation favoring the original play model.

## F5/F6: zoom and narrow startup problems

At real 150% browser zoom on a 1366×768 screen, equivalent to about 911×512 CSS px in the audit setup:

- PLAY was covered by the fixed bottom bar;
- PLAY was not keyboard activatable;
- workspace chrome appeared over the loading screen.

At narrow widths the first screen exposed too little routine play, and at 400 px the bottom-bar counter overlapped Export.

## F7: internal identifiers leak

Examples in the audited build included:

- `fieldwork` in Current work;
- `villageElder` in an observed item-source row.

Verify the live occurrences rather than limiting the fix to these two strings.

## F8: inventory/trade density is poor

At laptop size, inventory visibility was much worse than the original.

In trade:

- player sellable inventory was not adjacent to trader stock;
- quantity controls wrapped;
- Total price could require scrolling.

## F9: Classic is not currently a faithful substitute

The audit found overlap, excess whitespace, delayed actions, and page scrolling in Classic.

Classic fidelity remains backlog in this pass. Do not use "switch the default to Classic" as a shortcut around fixing Workspace unless the evidence after the relevant slices supports that product decision.

---

# Dependency decisions for this pass

The five slices are not fully independent.

Use this sequence:

1. **A1 — Action-first center column**
2. **A2 — Play-mode chrome reduction and first-run preset decision**
3. **A3 — Combat inside the workspace**
4. **A5 — Player-facing status and trade adjacency**
5. **A4 — Zoom and narrow start-and-play**

Why this order:

- A1 establishes the fundamental Workspace geometry without relying on a later toolbar-space windfall.
- A2 then removes play chrome and makes the first-run preset decision using the improved Workspace, rather than judging the old Workspace against Classic.
- A3 depends on the stable post-A1/A2 workspace geometry.
- A5 depends on the settled center/trade space and owns the actual trade-adjacency redesign.
- A4 is the cumulative responsive/zoom gate. It must validate the UI produced by the preceding slices rather than certify an intermediate layout that later work changes.

Do not reorder these merely for implementation convenience. If live architecture reveals a hard dependency that makes this order unsafe, stop only that dependency chain, document the concrete reason from source/runtime evidence, and perform any still-independent verification or work that remains safe. Do not silently merge several slices into an unreviewable redesign.

Exception: the loading-screen part of A4 (A4.1, PLAY reachability and keyboard activation at zoom) does not depend on workspace geometry and blocks play entirely for affected players. Weibao may pull it forward as a standalone fix; if so, re-run A4.1 inside the final cumulative A4 gate.

A1 is therefore **not assumed fully independent of A2/A3**:

- A1 may change center allocation and location-content hierarchy.
- A1 must not depend on A2's chrome reduction to meet its core laptop acceptance.
- A1 must not relocate combat as an incidental way to recover height; combat ownership belongs to A3.
- A2 must re-run A1's core T6/T2/T5 checks after changing play chrome.
- A3 must re-run the relevant A1 action visibility check after integrating combat.

---

# Persistence preflight

Complete this before the first layout-affecting edit.

Inspect the current implementation of:

- layout default creation;
- preset construction;
- storage reads and writes;
- missing-field/default merging;
- desktop/narrow/authoring separation;
- layout reset;
- layout import/export if present;
- game-save import interactions with workspace state, if any.

Determine whether editing a preset can alter an existing player's layout indirectly through merge/default behavior.

Create or reuse disposable browser-origin fixtures through the app where possible:

### P0 — fresh origin

No workspace keys stored. Record the first-run preset and screenshot.

### P1 — untouched saved default

Start from the current default, cause it to be persisted without manually moving/resizing panels, reload, and record the serialized layout plus screenshot.

This fixture distinguishes a genuinely fresh user from a user who previously saved the old default.

### P2 — visibly customized desktop layout

Make an unmistakable but valid custom desktop arrangement using the supported UI. Record:

- relevant serialized persisted value;
- screenshot;
- enough visible landmarks to prove whether positions/sizes survived.

### P3 — narrow/custom state

If narrow layout is separately persisted in the live architecture, create an unmistakably customized narrow fixture and capture the same evidence.

### P4 — authoring layout

If authoring persistence can be affected by common layout code, create a customized authoring fixture as well.

### P5 — exported/importable layout

If the app has supported layout export/import, create one export before migration/default work and retain it as a compatibility fixture.

Do not manufacture a migration test by hand-editing version fields unless the storage contract explicitly requires such a fixture. Prefer data the prior app could actually have produced.

For every slice that touches layout persistence, prove after the change that:

- P0 gets the intentionally chosen new fresh default;
- P1 does not silently become the new default unless an explicit migration intentionally says so;
- P2/P3/P4 retain their recognizable customization;
- P5 still imports correctly if its format remains supported;
- reload does not undo the verified result.

If a migration is introduced, show before/after serialized evidence and browser-visible evidence. If storage is deliberately untouched, state that explicitly and show the survival check rather than claiming "no migration needed" from code inspection alone.

---

# Browser states

Reuse the audit method and adapt the existing Playwright drivers rather than inventing unrelated synthetic states.

Always launch changed builds from a fresh/disposable test origin unless a persistence fixture specifically requires continuity.

## T1 — fresh hero

Fresh hero, first playable screen.

## T6 — progressed village hub

Village after exhausting the elder's dialogue through the UI, then using the audit's disposable progressed save.

The supplied audit fixture contained approximately:

- 29 inventory stacks;
- 5000 money;
- `is_crafting_unlocked`;
- `is_gathering_unlocked`;
- XP in about 14 skills.

Exclude Meditation if the same original-loader crash still exists. Verify whether that constraint remains relevant before carrying it forward.

## T2 — native work running

From T6:

1. open Find work;
2. choose "Work on the fields".

## T3 — Infested field combat

From T6:

1. Move somewhere else;
2. choose Infested field from the travel control.

Scope the selector to the travel UI because unrelated text may also mention "Infested field".

## T4 — first trader

From T6:

1. Visit a merchant;
2. open the first trader.

## T5 — crafting

From T6, choose "Try to craft something".

---

# What "visible without scrolling" means

Avoid ambiguous acceptance language.

Unless a slice says otherwise, a control is "visible" only when:

- its complete actionable control or row is inside the browser viewport;
- it is not hidden behind a fixed/sticky overlay;
- it is not clipped by its panel's scrollport;
- no wheel/trackpad/page/panel scrolling is required after entering the named state;
- no disclosure must first be opened unless opening that disclosure is itself part of the named state.

Record screenshots with the full browser content viewport.

For any acceptance involving a set of native actions, inspect the live T6 action list before editing and record the native action labels actually present. Reconcile them against the audit's expected set:

- Move / travel;
- Talk;
- merchant;
- Find work;
- Train;
- Gather;
- Craft;
- immediately usable food/item action if the current native UI exposes one here;
- sleep/chest or another native choice when legitimately present in that location/state.

Do not force the UI to display a nonexistent action just to satisfy a stale numeric count.

The acceptance target is the actual routine native set present in the named state, with expected audit actions accounted for.

---

# Slice A1 — Action-first center column

## Outcome

Restore an action-first center hierarchy at laptop size while retaining the fork's responsive/reachable advantages.

Do not solve A1 by deleting expansion controls, moving combat, hiding information permanently, or relying on the later A2 chrome reduction.

## Scope

Inspect and adjust the live equivalents of:

- Workspace preset center allocation;
- Time & weather;
- Current location/place prose;
- Current work;
- Local actions;
- ordering of native choices versus expansion content.

### Place prose

Keep the first useful line immediately readable. Additional prose may use a single obvious disclosure/action or an equivalent compact treatment.

Acceptance is not tied to a specific `<details>` implementation.

### Time & weather

Present it as compact status rather than as a separately scrolling content panel.

### Current work

When idle, do not reserve a large fixed block merely for an empty/status line.

Do not implement F7's full naming/time redesign here unless necessary to avoid regressions; A5 owns player-facing Current work semantics.

### Native action ordering

Every native location choice present in the current location must precede expansion-only material in the same action flow.

In particular, verify craft, sleep, chest, food/use, and any classless/native controls rather than assuming the audit identified every markup variant.

Expansion material such as the clerk, learned sources, optional pacing, equipment-condition information, elemental-preparation information, and similar fork-added disclosures should remain reachable but visually subordinate to the native action sequence.

Choose a robust grouping/order mechanism based on the live DOM. Do not build a brittle selector list if the underlying rendering code can express the semantic grouping directly.

## Persistence constraint

Changing the untouched Workspace preset is permitted only after the persistence preflight proves how fresh and previously persisted layouts are distinguished.

Do not reset P1/P2/P3/P4 merely because a preset definition changes.

## Browser acceptance

### A1.1 — progressed hub, 1366×768

Enter T6 using the fresh/default Workspace case P0.

Without scrolling after the state is entered:

- the complete routine native village-action set identified before editing is visible in the action area;
- expected audit actions that legitimately exist in T6 are accounted for;
- expansion material does not precede native craft/sleep/chest/etc.;
- there is no horizontal page scrollbar.

Capture the whole viewport and the recorded native-action list.

### A1.2 — Find work does not bury nearby play

From T6 at 1366×768, open Find work.

The Talk action remains completely visible without manually scrolling the location/action panel after opening Find work.

### A1.3 — running work card

At T2, 1366×768, the following are simultaneously visible:

- the player-facing job/card title currently rendered by that state;
- next-pay information;
- Stop.

A5 may improve the wording later, but A1 must provide enough geometry to expose the card.

### A1.4 — crafting

At T5, 1366×768:

- the crafting category/tab controls are fully visible;
- at least five complete recipe entries are visible simultaneously if the T5 fixture contains at least five recipes;
- otherwise all available recipe entries are visible and the report records the fixture count.

No manual scroll is allowed between entering T5 and taking the acceptance screenshot.

### A1.5 — desktop scaling

Repeat the A1 core T6 and T5 checks at:

- 1440×900;
- 1920×1080.

There must be no new horizontal page scroll at any of the three desktop sizes.

### Trade boundary

Do not expand A1 into the full trade redesign merely to satisfy old F1 trade measurements.

At T4, record the post-A1 trade state and prove A1 did not make it worse, but the requested outcome "player sellable rows, trader rows, and Total price visible together" is owned and accepted under A5 below.

## End-of-slice gate

Rebuild and exercise A1 in-browser.

Also re-run the applicable P0-P5 persistence fixtures before proceeding.

Leave the result playable before beginning A2.

---

# Slice A2 — Play-mode chrome reduction and first-run preset decision

## Outcome

Layout machinery should be available without dominating ordinary play.

Make the first-run preset decision only after evaluating the post-A1 Workspace. Do not choose Classic solely because pre-A1 Workspace was poor.

## Scope

In normal play mode:

- collapse layout tooling to one obvious entry control;
- keep the full editing tools reachable from that entry in at most one activation/click;
- move handles and resize handles are neither visible nor keyboard focusable outside Edit layout;
- preserve preset and density selection capabilities;
- preserve Authoring / Return to play separation.

Trace current focus behavior before modifying tab order. Do not simply add `tabindex=-1` while leaving hidden interactive controls semantically active if a cleaner edit-mode mount/disable path exists.

## First-run preset decision

Using the post-A1 build, compare fresh P0 in Workspace against the live Classic preset at minimum in T1 and T6 at 1366×768.

Inspect `PROJECT.md` for the existing decision/proposal conventions.

Choose one of these explicit implementation outcomes based on the evidence:

1. **Workspace remains first-run default**, because post-A1 it now satisfies the action-first product contract better while retaining responsive strengths; or
2. **Classic becomes first-run default**, only if the live evidence shows it is the safer play baseline despite known F9 issues.

Do not "fix" F9 under this slice beyond a regression strictly caused by A2.

Record the resulting first-run choice in the project documentation in the form appropriate to the live repository. If PROJECT.md distinguishes accepted owner decisions from agent proposals, do not falsely mark an agent judgment as owner-approved. Make the status explicit.

Changing the first-run fallback must not overwrite P1/P2/P3/P4.

## Browser acceptance

At T1, 1366×768, normal play mode:

- exactly one consolidated layout-edit/configuration entry is visibly presented as the ordinary gateway to layout machinery, excluding Authoring if Authoring is a separate product context;
- no panel move grip is visible;
- no resize handle is visible;
- no move/resize handle receives keyboard focus.

Activate the consolidated layout control once:

- the player can reach the existing layout tools without navigating to another page or requiring a second hidden gateway.

### Keyboard acceptance

Starting from a freshly loaded T1 document with focus at the browser/page start, record the Tab sequence.

The first native gameplay/location action must be reached within 25 Tab presses.

Record the actual tab count; do not substitute DOM-count arithmetic.

### Space acceptance

Do not use the old "≤6.8% chrome" percentage as the implementation target.

Instead, at 1366×768 capture T1 and prove visibly that:

- the play-mode layout toolbar no longer occupies a persistent multi-control row;
- no edit handles reserve visible panel-header space solely for manipulation;
- the first gameplay action is completely inside the initial viewport.

Record the top and bottom CSS-pixel coordinates of the consolidated layout control and first gameplay action as diagnostic measurements, not as a separate hard-coded layout contract.

### Regression reruns

After A2, re-run at 1366×768:

- A1.1 T6 native-action visibility;
- A1.2 Find work/Talk;
- A1.3 T2 job card;
- A1.4 T5 crafting.

A2 is not accepted if reducing chrome breaks those states.

Run relevant P0-P5 persistence checks again, including the chosen first-run behavior.

---

# Slice A3 — Combat inside the workspace

## Outcome

Combat participates in the workspace rather than consuming an independent full-width band that displaces both actions and reports.

## Required execution-time trace

Before editing, trace how the current equivalents of:

- `#combat_div`;
- enemy/enemies container;
- `#main_content`;
- workspace module containers;
- retreat/navigation control;
- Reports/message log

mount, hide/show, and resize during combat.

Verify whether moving a DOM node would break code that relies on parentage, sibling selectors, IDs, measurements, or lifecycle behavior.

Choose the integration approach only after this trace.

## Scope

- render the enemy/combat view inside an appropriate workspace region;
- keep retreat adjacent to the enemy/combat decision area;
- preserve stance/combat controls and native combat behavior;
- give the Reports/message log a useful minimum visible region during combat;
- avoid using fixed heights that only happen to fit the supplied combat fixture.

Do not consume the Local actions area to such an extent that A1's action-first hierarchy collapses when combat ends.

## Browser acceptance

At T3, capture both:

- 1366×768;
- 1920×1080.

Without manual scrolling after entering combat, the same viewport must contain:

- enemy identity;
- enemy HP/status needed to understand the fight;
- retreat control;
- at least five complete recent report/log lines when the fixture contains five lines.

If fewer than five log messages exist naturally at entry, produce enough ordinary in-game combat/report events through the UI to reach five rather than injecting presentation-only text.

The combat view must no longer appear as a separate full-width band spanning beneath the workspace docks.

There must be no new horizontal page scroll.

After leaving combat, re-run A1.1 at 1366×768 to prove normal location geometry returns correctly.

Run relevant persistence fixtures if A3 changes panel membership/layout serialization.

---

# Slice A5 — Player-facing status and trade adjacency

## Outcome

Remove implementation identifiers from ordinary player-facing status and recover an original-like trade relationship between player stock, trader stock, quantity, and price.

This slice owns the trade acceptance intentionally deferred from A1.

## Scope: identifiers and Current work

Inspect all player-facing strings rendered in:

- Current work;
- Local actions;
- item-source/contact rows implicated by F7;
- any directly shared formatter touched by the fix.

Do not use a cosmetic global camelCase splitter as a substitute for proper player-facing labels where canonical names already exist.

Prefer established entity/activity display names from the game's own data model. Add a bounded formatter/mapping only where there is no canonical label.

Current work for a native job must expose:

- player-facing job/activity name; and
- useful time/payment progress: remaining time **or** next-pay timing, according to the live native job model.

Do not invent precision the game does not track.

## Scope: trade

At T4, recover an immediately comprehensible relationship among:

- player's sellable inventory;
- trader stock;
- quantity controls;
- Total price;
- the relevant buy/sell action.

Prefer use of the available center width over nested vertical scarcity.

At desktop laptop width, player and trader lists should be visually adjacent rather than separated into distant sequential sections requiring routine back-and-forth scrolling.

Do not remove quantity choices merely to prevent wrapping.

At narrow widths, adjacency may legitimately collapse into a vertical responsive arrangement; A4 will test cumulative narrow behavior.

## Browser acceptance

### A5.1 — identifiers

Exercise the known native work state and the known observed item-source/contact state.

No raw internal identifier is visible where a player-facing name should be used.

Specifically verify that the equivalents of:

- `fieldwork`;
- `villageElder`

do not appear as raw player-facing identifiers if those entities still exist in the live fixture.

Also inspect the changed rendered surfaces for other obvious raw camelCase/internal IDs introduced through the same path.

### A5.2 — native work status

At T2, the Current work presentation simultaneously shows:

- the canonical/player-facing native job name;
- remaining-time or next-pay information supported by the model.

Stop behavior and existing pay-consequence wording must remain intact.

### A5.3 — trade at 1440×900

At T4, 1440×900, without scrolling after entering the trader:

- at least one complete player-sellable row is visible;
- at least one complete trader-stock row is visible;
- the full quantity-control group is visible without overlapping/wrapping into an unusable state;
- Total price is visible;
- the corresponding transaction action is visible;
- player and trader stock are visibly adjacent in the same trade composition.

If one side of the fixture genuinely contains zero rows, use a bounded fixture/state from the existing audit method that has data on both sides rather than weakening the acceptance target.

### A5.4 — laptop regression

At T4, 1366×768, capture the complete viewport and record how many complete player and trader rows are visible.

Do not require an arbitrary original row count, but the central transaction facts and controls must remain usable without hidden fixed overlays or horizontal page scrolling.

Re-run T2 acceptance from A1 after changing Current work.

---

# Slice A4 — Zoom and narrow start-and-play

## Outcome

Make startup and routine play usable under browser zoom and narrow layouts after the preceding layout work has settled.

This is the final cumulative responsive gate for the five-slice pass.

## Scope

Address:

- loading-screen PLAY reachability;
- keyboard activation of PLAY;
- workspace toolbar/chrome appearing over loading;
- fixed-bottom-bar collision;
- narrow first-screen action access;
- 400 px bottom-bar overlap.

Do not "fix" the 150% state only by detecting a particular zoom factor in JavaScript. Treat zoom primarily as reduced effective CSS viewport space unless the live architecture provides a principled reason otherwise.

## Required test method

Test both:

1. **real browser zoom**: physical browser window/screen at 1366×768 with browser zoom set to 150%; and
2. **emulated CSS viewport** approximating the resulting CSS area for repeatable automation.

Do not claim real-zoom acceptance from emulation alone. If the execution environment cannot drive real browser zoom (for example headless automation only), mark A4.1 and A4.2 real-zoom checks `implemented-unverified`, report the emulated results separately, and name the exact manual check for Weibao.

Record the effective CSS viewport reported by the browser during the real-zoom run because it may differ slightly from the audit's approximately 911×512 figure.

Also test a true 400×800 CSS viewport.

## Browser acceptance

### A4.1 — loading at real 150% zoom

On a fresh origin before PLAY:

- PLAY is fully visible;
- no fixed bottom bar covers any part of PLAY;
- the workspace play/layout toolbar is not rendered over the loading screen;
- PLAY can be activated by pointer;
- after a fresh reload, PLAY can be reached and activated using the keyboard.

Record the keyboard sequence used. Do not count a scripted `.click()` as keyboard acceptance.

### A4.2 — progressed play at real 150% zoom

Enter T6.

On the first screen, without scrolling after entering the state, at least three complete routine native gameplay actions are visible and actionable.

Name the three controls in the report; do not report only a count.

No fixed UI covers those actions.

### A4.3 — 400×800

At T6, 400×800:

- at least three complete routine native gameplay actions are visible on the initial screen without scrolling;
- name them in the report;
- the bottom bar contains no overlap among its visible controls/text;
- Export, if present in that state, remains readable and actionable;
- there is no horizontal page scrollbar.

### A4.4 — cumulative desktop regression

After A4, perform a final abbreviated rerun at 1366×768 of:

- T1 first play screen;
- T6 native action visibility;
- T2 running job;
- T3 combat;
- T4 trade;
- T5 crafting.

Do not redesign those slices under A4 unless A4 itself caused a regression. Fix responsive regressions introduced by the cumulative work.

---

# Backlog: explicitly out of scope unless required to prevent a regression

Do not broaden this pass into:

- full Classic fidelity / F9;
- general checkbox alignment;
- general tooltip-placement redesign;
- broad `aria-live` policy;
- log repeat-condensing;
- per-category message history;
- "next locked" placeholder rows;
- general dimming of expansion panels irrelevant to the current world.

A narrowly required fix is allowed if one of these directly prevents an in-scope acceptance condition, but report that dependency rather than turning it into a parallel redesign.

---

# Verification requirements for every slice

After source changes:

1. Run `npm run build`.
2. Run `npm test` for affected suites, or the repository-prescribed equivalent if live instructions supersede this command.
3. Exercise every changed behavior in a browser against the newly built source.
4. Use fresh origins for normal acceptance states.
5. Use continuity origins only for the explicit persistence fixtures.
6. Do not claim results from the old prebuilt bundle.
7. Capture before/after screenshots for each acceptance state and viewport relevant to the slice.
8. Record browser-visible failures as failures rather than explaining them away with source reasoning.
9. If an acceptance check cannot be exercised, label the slice `implemented-unverified` and state exactly what remains unverified. Do not silently call it complete.
10. If layout persistence was touched or could be touched indirectly, perform the applicable P0-P5 reload/import survival checks.
11. Preserve reduced-motion behavior and verify no new horizontal page scroll at every desktop/narrow viewport exercised by the slice.

Use the audit's Playwright drivers and measurement JSON in `docs/reviews/ui-density-2026-10-13/` as starting points. Their local-port assumptions may be adapted.

When "original-like" behavior is useful for comparison, use upstream `e3356432` in a scratch worktree/read-only comparison context. Do not mutate the reference merely to simplify testing.

---

# Evidence discipline

Distinguish in each slice report:

- **supplied audit fact**: came from this prompt/audit;
- **live source finding**: confirmed against the current repository;
- **runtime observation**: directly exercised in the newly built browser;
- **inference**: reasoned from evidence but not itself directly observed.

Do not preserve a stale source claim merely because it appears in this prompt.

For layout acceptance, prefer screenshots plus concrete browser observations over derived percentages.

Measurements such as element bounding rectangles, scroll heights, viewport size, and tab counts are useful diagnostics, but acceptance is defined by the named visible outcomes above.

---

# Per-slice completion report

At the end of each slice, report before starting the next:

1. **Files changed**
   - file paths;
   - concise purpose of each change.

2. **Live implementation findings**
   - consequential ways the repository differed from or confirmed the audit.

3. **Before → after**
   - named test state;
   - viewport;
   - visible outcome;
   - useful supporting measurements such as bounds, scroll state, row count, or tab count.

4. **Persistence**
   - which P0-P5 fixtures were relevant;
   - what survived;
   - whether any migration or compatibility rule was introduced.

5. **Verification**
   - build/test commands and results;
   - browser states actually exercised;
   - screenshots/artifacts produced.

6. **Regressions / residual issues**
   - anything newly worse;
   - anything intentionally deferred to a later slice or backlog.

7. **Slice status**
   - `accepted by automated/browser criteria`,
   - `implemented-unverified`, or
   - `blocked`, with the exact unmet criterion.

Do not use Weibao's subjective taste as a substitute for these observable gates.

After all five slices pass their objective gates, leave one separate human review item:

**Human acceptance gate:** Weibao evaluates whether the resulting layout feels appropriately action-first, compact, legible, and faithful to the game's intended character. This subjective review may motivate later refinement, but it does not replace the browser acceptance criteria above.
