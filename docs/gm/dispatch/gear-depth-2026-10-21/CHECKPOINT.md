# Gear depth implementation, 2026-10-21

Weibao: “Can we go ahead and incorporate the rest of the gear depth stuff too,
adapting it to our world rules and shared systems? Consider other stuff that is
like that and more to bring up to spead and to be taken into consideration
everywhere else?”

This authorizes implementation of the remaining GDP palette through native
systems, plus a cross-system consideration pass. Mechanisms and world variation
remain authoritative; GDP default numbers remain playable proposals. It does
not itself authorize commits, pushes, publication or changes to private saves.
The later scoped master-merge authorization is recorded at the release boundary below.

Baseline: master 7aff0a396 (recheck actual HEAD in evidence). Isolated writer:
`/Users/weiwei/.codex/worktrees/gear-depth/yet-another-idle-rpg`. The dirty shared
checkout is preserved. Reuse its live GDP palette as the owner, retaining all
prior text. Existing toughness, affixes, heat-grade and shared combat inputs
are inputs, not new achievements. Rules: AD5/6–9/22/32/36/38, MR1–36, AR1–16,
UR40 and CBR; GDP1–39 and ESD1–15 describe the selected design horizon.

## Connected delivery

First connected journey: carry an item to a native crafting station, inspect its
parts and physical traits, attach/remove material roles, heat/work/quench/temper,
refit, improve known work after meaningful use, swap a real component, repair
with compatible material and dismantle with explicit loss. One item identity
keeps its condition and history across key rewrites. Quotes are pure and native
custody checks run before the existing transaction/save boundary. Same resolver
accepts any maker snapshot. Existing equipment aggregation gives every wearer
the same results. Materials and process affect properties, never a universal
"best item" score. Quality, part lot grade, condition and recognition differ.

Target: 1920×1080 desktop, current font settings. Visible outcome: Gear workshop
lists carried equipment and quotes exact input/output changes with source
explanations. Mobile deferred. No new timer, currency, inventory or save writer.

## Verification selection

Failure scenarios: stale stock/quote; failed save after key rewrite; part swap
loses identity/condition; free attachment cycling returns more material than
spent; heating with insufficient fuel grade; improving identical work repeatedly;
enemy equipped with the same worked item gets different effects. Focused tests
cover these invariants and native item load/equip. Complete with build, full
suite, arch, rules, and rebuilt fresh-origin native journey plus Save/reload,
Export/literal Import. Record input identity and gaps in this file.

## Cross-system pass (round 2)

| Code | Disposition | Integration constraint / consequence | Done check |
|---|---|---|---|
| GX1 | ACT NOW | GDP1–20,24: one worked-item key, physical properties, sourced contributions, role integrity, material repair, component replacement and conserved salvage | Connected workshop journey and rejection/rollback cases |
| GX2 | ACT NOW | GDP38–39: shared item effects reach people and creatures; physical use counts belong to the existing durability owner | Same item on two native actor types |
| GX3 | ACCOUNT FOR NOW | Trade, loot, gifts and loadouts transfer the complete key, including process history. Buyer appraisal remains knowledge-based; no arbitrary value multiplier for hidden traits | Save/trade/load key census; no metadata stripping |
| GX4 | ACCOUNT FOR NOW | Tools, vessels, foci and armor share property names; tool verbs and chemistry keep separate product resolvers (MR29). Material tags identify a mechanism rather than permission to work | No second material schema or universal recipe solver |
| GX5 | ACCOUNT FOR NOW | Heat, fuel quantity, burn duration and output are different. Existing fuel inventory and energy reserves stay separate owners. Cooling/aging resolve on their owning clock; travel/world changes do not grant work | No parallel heat/energy store |
| GX6 | ACCOUNT FOR NOW | Powers, potions, mutations and affixes need source lifetime and removal through real consumers. Conduction/insulation require energy and exposure readers before becoming visible stats | GDP32/36/39 cannot close on write-only fields |
| GX7 | ACCOUNT FOR NOW | Maker skill controls process quality; apprentices, artisans and constructs reuse snapshots. Knowledge, assay, provenance, ownership and actual material truth remain separate | NPC resolver parity; no unexplained all-knowing appraisal |
| GX8 | LATER / DELEGATE | GDP22–25/27–29/31–37: chemical vessel reactions, lazy corrosion/fermentation, energy storage/converters and structured power-to-stat effects need connected consumers. Medium/high capability, medium/large effort each | Each crosses a native consumer and save/clock boundaries; never mark complete from schema alone |

GX8 is authorized by this request but remains unfinished until its connected
journeys land. It is not turned into an unrelated prerequisite for GX1.

## Steering and bounded delegation, 2026-10-21

Weibao: “Continue with processed-material split/merge lineage and the remaining
useful Proto23 gaps accordingly. Reuse what's already done, use lesser agents,
and finish the native implementation with browser and persistence checks.”
This extends the active connected implementation. Existing finite processing,
material observations, household/play and source comparisons are inputs.

AU1–AU15: coordinator plus at most 2 fresh Luna-low workers, no descendants,
no source acquisitions, no stronger/paid fallback. Worker 1 owns only new
`material_lineage` pure operations/tests; worker 2 owns a narrow reuse/gap report.
Native host, item factory, workshop, shared docs and combined acceptance stay
with the coordinator. Included-usage starting reading 59%, ceiling 64% of the
reported weekly window; shared-account use may be external and is conservative.
One bounded invocation per worker; root includes integration and acceptance.
Stop delegation at returned evidence; no automatic new waves. Full requested
horizon is not declared complete when this operational bound is reached.

## Release boundary, 2026-10-21

Human here approved "Finish within 2 more points" after the meter reached64. The shared ceiling is66, reconciled with the master coordinator; no additional agents or paid fallback. The coordinator's human explicitly authorized finishing in-game gear proof and merging the finished gear work to master. The coordinator owns combined validation and integration; this lane does not merge or push independently.

G1/G2/G4/G5 native implementation is released with processed-material lineage. The G3 owner supplied the two native trade-preview fallback hunks already included in this candidate's display diff; avoid applying twice. Native gem purchase uses the real `window.startTrade` host entry under a disposable funded fixture, then actual stock/accept controls. Armor and material access, damage, skill, and stock are explicit fixture inputs, so this is no natural progression or human acceptance claim.

Current-input focused tests16/16, arch and rules pass. Current runtime build passes (`/tmp/gear-completion-build.log`). Earlier full suite2417/2417 predates the final reforge/ItemComponent/NPC-presence/display hunks and is historical evidence only. Coordinator runs the required full suite/build/arch/rules on combined current master. No rule semantics changed. Source whitespace check excludes generated output.

Browser gear11/11 plus lineage6/6 receipts are saved under evidence. Gear proof covers native purchase, work, typed socket/gem, NPC service transfer, repair/swap/dismantle with exact degraded returns and spent-choice removal, no-preview RNG, committed armor affixes and tooltip, exact-key equip, Save/reload/Export/literal Import, and 14/21px desktop typography at1920x1080 and1536x864. No page errors; browser consoles record resource404s, so this is not a zero-console-error claim. Local font access used a private-font symlink excluded from release. Fresh test origins never load personal saves.

Remaining broader palette work: GX8 chemistry/energy/converters/power lifetimes, conditional salvage opportunity CRL44, and spatial landing CRL24/25 remain explicitly unfinished. Native deterioration mechanisms for every lineage-bearing product are not implemented by carrying provenance. The useful bounded Proto23 gap closed here is CRL36/37 through the native material path.


## Content reconciliation B382: identity, source effects and remaining GX8 scope

The full checkpoint through its release boundary was read. Preserve one worked-item identity, condition and process history across native key rewrites, transfers and component changes. Quotes remain read-only; actual custody and stock are rechecked before transaction/save. Compatible material and degraded returns conserve the chosen spent source, while maker snapshot, workmanship, part-lot grade, condition, recognition and actual hidden material truth remain different. A shared property name does not make tools, vessels, foci and armor use one product resolver.

GX3–GX7 keep real downstream obligations: trade/gift/loadout cannot strip complete history; knowledge-based buyer appraisal does not reveal hidden metadata; heat grade, fuel quantity, duration and useful output stay separate; cooling/aging belongs to an actual clock. Conduction, insulation and power-lifetime fields require an energy/exposure/effect/removal consumer before they count as behavior. Split/merge lineage and provenance alone implement neither corrosion/fermentation nor deterioration for every product. GX8, CRL44's conditional salvage and CRL24/25's spatial landing remain explicitly unfinished, without blocking the distinct delivered native gear slice.

The old2417 full suite predates final reforge/component/NPC/display changes; current-input16 focused and gear11/lineage6 browser receipts have their stated narrower scopes. Real trade/equip/work/persistence actions use labelled material, skill, armor and damage prerequisites, not naturally acquired campaign progress. Resource404s are not zero console errors, local-font symlink is excluded from release, and a duplicate supplied G3 hunk must not be applied twice. Old merged-release authorization, ceilings and delegated reservations remain historical; no new integration or source/gameplay proof is claimed here. AD42 keeps human taste feedback optional, while combined current master and installed-app evidence remain distinct.


## Later CRL44 qualification, 2026-11-04 (B383)

Later [recovered-detail coverage](../title-rules-implementation-2026-10-21/COVERAGE.md) qualifies the historical CRL44 open label above: its October23 O2a row records the selected vest-condition bounty, and a scoped current salvage-source read finds its eligibility quote, staged receipt and payout. The October21 gear return and B382 reading retain their original then-unfinished status, rather than contradicting this later one-consumer delivery. This is not a fresh browser/persistence run or proof of all title/salvage opportunities. GX8 chemistry/energy/conversion/lifetime and spatial-landing horizons remain separate; no further gear work is launched.
