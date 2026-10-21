# Gear completion coordination, 2026-10-21

Weibao: “Coordinate with the gear-depth chat to finish the remaining Apotheosis
and related gear features, verify them in game, and merge the finished work into
master.” This authorizes implementation, verification and a scoped local master
merge/commit. It does not request a new push or publication.

The existing gear-depth CHECKPOINT and its coverage own the builder's ongoing
work. This packet connects that work to the new completion/merge request; it
creates no competing design authority. Live owners: [equipment dimensions](../../../EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md),
[gear depth](../../../GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md),
[USER_VISION](../../../USER_VISION.md#finish-and-merge-remaining-gear-features-2026-10-21),
and [PROJECT](../../../../PROJECT.md). Rules: AD5/6–9/22/32–34/36/38/41,
MR1–36, AR1–16, UR40–49, CBR, GR1–17; ESD1–16/GDP1–39 are design palettes,
not universal world laws. [Runtime instructions](../../../../.claude/rules/runtime-code.md),
[making instructions](../../../../.claude/rules/making-systems.md),
[UI instructions](../../../../.claude/rules/player-ui.md).

## Ownership and input identity

Coordinator/integrator: chat `01a15f06-9c7f-7292-af78-79b5971fecf0`, primary
`/Users/weiwei/code/yet-another-idle-rpg`. Builder: existing gear-depth chat
`01a15f03-cf2d-7ec3-9bd3-0577dbaff334`, isolated gear-depth checkout.
Primary master at dispatch: `a052e0794`; builder's initial base: `7aff0a396`.
Later master includes P1 shared damage readers, source/host repairs and baseline
integration, so a full copy from the older gear checkout is unsafe. Integrate
scoped diffs, preserving later fixes and user changes.

Active CORC UI owner reserves primary `inventory_composition.js`,
`shell_item_description.js`, `proto23_shell.js` presentation and UI/font styles,
tests and generated dist. Native gear fact generation and calculations are the
gear lane's domain; cross-boundary changes need coordinated hunk ownership.
No primary runtime/index/build writes before the integration boundary. Builder
releases exact files or a commit with input hashes before the coordinator merges.
No duplicate wave or independent master merge/push.

## Completion map

| Code | Delivered behavior and observable gate |
|---|---|
| G1 | Typed socket/setting roles and native gems/materials affect actual gear, with install/remove costs and source explanations; changes persist |
| G2 | Native component replacement, upgrade/reforge, material repair and salvage form a connected lifecycle; preserve identity/condition/history, conserve material and revalidate stock/quotes |
| G3 | Supported loot and shop routes carry affixed gear through real item keys and inventory; stable rolls occur at creation, not inspection/reload/refresh |
| G4 | Inventory and tooltip show useful affix/part/process facts with actual sources; reuse existing shell's tooltip clone and avoid duplicate interface owners |
| G5 | A capable non-player maker and equipped enemy use the same item/maker/wearer mechanisms; demonstrate through native actions/encounter and preserve knowledge boundaries |

Processed-material split/merge lineage and current useful Proto23 continuation
are already authorized in the builder's checkpoint and remain part of its
connected work. Reuse implemented portions and all later shared combat readers.
Cross-system chemistry/energy/power cases should reuse existing consumers where
they directly cause gear behavior; an unrelated world or generic new simulation
framework is not a hidden completion prerequisite. Keep any still-authorized
unfinished horizon visible in coverage instead of calling it completed or
silently cancelling it.

## Verification and release

1920×1080 desktop; mobile deferred. Fresh disposable origins and rebuilt source
are required for gameplay claims. Exercise real acquisition/crafting, exact
selected item, install/work/replace/repair/salvage, inspect effects, trade/drop
carriage and shared actors. Use a clearly labeled generated fixture for otherwise
late progression and retain a normal acquisition journey; fixtures alone do not
prove discovery or natural balance. Changed persistence requires Save/reload,
Export/literal Import with same key, effects and history. Personal saves stay
untouched; sealed truths stay inside discovery routes.

Before implementation, select meaningful invariants: no stock duplication,
no RNG rerolls on preview/reload, no free salvage cycles, stale quote rejection,
rollback of failed inventory/save transaction, exact lineage conservation,
no duplicate stat source or stale source after removal. Focused checks during
editing; final required build, full tests, architecture and rules, plus
rule-behavior if rules changed. Record input identity, command/result and gaps in
the existing builder record. Do not repeat equivalent full suites on unchanged
inputs. Coordinator reviews actual released diff/evidence, resolves master drift,
checks resulting combined candidate, then commits/merges only task paths while
preserving unrelated UI changes. Complete means the playable requested scope is
verified and integrated; human taste/balance acceptance remains distinct.


## AU7 checkpoint, 2026-10-21

Observed account meter reached 64% used, the active gear packet's 59% +5-point
ceiling. Source attribution across parallel chats is uncertain; AU7 treats this
as a conservative stop. The user has been asked to explicitly authorize a new
finite ceiling of 67% used for final repairs, combined verification and merge.
Approval is pending. No budget reset, paid fallback or new agents.

G3 is preserved in the existing master-except-start-menu integration checkout:
22 focused tests, architecture/rules and six rebuilt 1920x1080 native browser
checks pass, including last-unit buy/sell, actual equipped-enemy loot and
Save/reload/Export/literal Import. Its report/evidence is at
`docs/gm/dispatch/gear-depth-2026-10-21/g3/` in that checkout. Exact G3 patch,
new files and hashes are additionally saved privately at
`/Users/weiwei/.codex/research/gear-completion-checkpoint-2026-10-21`.

Builder has stopped feature expansion and is saving RELEASE/COVERAGE in its
existing gear-depth checkout. Material lineage browser passes its six checks;
expanded workshop acquisition/NPC/gem/repair/component-swap browser is not yet
certified. Earlier full suite predates final workshop edits, so full final
combined verification is still required. No master merge or commit yet.

CORC UI ownership has resumed for a separately requested reload/spacing repair;
its previous release is superseded by that active work. Preserve its primary
paths and wait for a fresh source release before any combined capture.


## Explicit finite continuation approved, 2026-10-21

Weibao answered the budget question: “Approve up to 67% used.” This supersedes
the pending status above. The task continues from the observed 64% reading to
an aggregate 67% included-usage ceiling, with no new agents or paid fallback.
Reuse completed evidence, repair the final connected browser gates, then run
the final full suite only on the combined current-master candidate. The builder
retains source ownership until exact release; the coordinator owns integration.


### Concurrent approvals reconciled

The gear-depth chat also received direct human approval for “Finish within 2
more points” (64% to 66%). Coordination uses the stricter **66% aggregate
ceiling**, which fits both that approval and this chat's up-to-67% approval.
These are overlapping allowances, not additive budgets. No additional question
is needed. The active UI owner independently owns its separately authorized
scoped commit/push; gear waits for that master boundary and integrates atop it.


## Completion boundary

Gear source and final evidence are released. Current UI master83bbba0ff has been
incorporated, all required combined gates pass and this change performs the
scoped gear master integration. [Final report](INTEGRATION_REPORT.md) and
[check identity](FINAL_CHECKS.json) own the outcome. No new push.
