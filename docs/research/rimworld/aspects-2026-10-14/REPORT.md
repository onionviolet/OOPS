# RimWorld installed-build research

The installed game is usable for read-only extraction without another install. It is **1.7.4979 rev109, Steam build 25947168, unstable branch**, rather than the earlier 1.6 DMG. The assembly changed. Prior INTAKE has no Steam build ID, so the exact numeric Steam build comparison is unavailable. The current host is .NET 10/Waylith with Unity compatibility APIs; the old Unity/Mono description must stay version-bound.

A01-A12 are recorded in [ASPECTS](ASPECTS.md), with explicit scope and gaps. Priority dialogue, implementation and save routes were rebuilt from the installed assemblies. Full raw XML and English text stay private. The [inventory](SYSTEM_INVENTORY.md) indexes every discovered Def family and runtime namespace; the [deeper pass](DEEPER_SYSTEMS.md) traces conversation, quest lifecycle and save compatibility. Status is PARTIAL because runtime/UI verification and substantial systems remain unread, not because extraction failed.

## Ranked original PROPOSALS

These are a reference palette. No owner edits, gameplay implementation, copied donor code/assets, new realm or prestige layer are selected. Verify live owners and existing consumers before any integration.

| Rank/code | Proposal | Proposed owner | Why useful |
| --- | --- | --- | --- |
| 1 P1 | Persist social occurrence identity, actor/target and consequences; render perspective-specific wording separately | CHARACTERS_AND_WORLD_EVENTS.md | Reopening a log must not replay XP, opinion or rewards. |
| 2 P2 | Keep named content version, reference resolution and cache rebuild as explicit load phases | ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md / ENGINE_EXPANSION.md | Missing references and old definitions should have a chosen repair or refusal policy. |
| 3 P3 | Give quest steps saved activation/deadline/outcome and authored recurrence | CHARACTERS_AND_WORLD_EVENTS.md / ENGINE_EXPANSION.md | Save/reload can resume a pending event without duplicating closure. |
| 4 P4 | Rebuild conversation choices from current host predicates after an action | Dialogue/character owner under CHARACTERS_AND_WORLD_EVENTS.md | Changed standing and unavailable means stay legible. |
| 5 P5 | Queue occurrences with target, retry window and removal reason | ENGINE_EXPANSION.md | A requested arrival is a stateful commitment, not a message promising guaranteed delivery. |
| 6 P6 | Show useful actor-specific rate/chance and actual stock with the work request | Crafting/skill owners under ENGINE_EXPANSION.md | Quality and output expectations can be understood before spending. |
| 7 P7 | Trigger optional contextual lessons from useful opportunities and demonstrated knowledge | THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md | Teaches depth while retaining available routes. |
| 8 P8 | Spread expensive infrequent consumers across stable tick buckets | Engine clock owner under ENGINE_EXPANSION.md | Useful performance pattern, subject to measured ordering and idle-progress requirements. |

All options remain reachable where world rules permit. Repeatability is an authored per-world policy, never a fixed universal once-only cap. Ordinary hunger remains comfortable and nonlethal; the donor's survival pressure is not an accepted YAIRPG rule. Passive progression remains required where eligible. UI proposals target 1366x768 laptop play; mobile is deferred.

## Prior dossier disposition

| Prior work | Result |
| --- | --- |
| Root five mechanic paths | Historical 1.6 evidence retained. Current social/work/story endpoints sampled, not a claim of full five-path revalidation. |
| Root installation claim | Corrected as current state: Steam install exists. |
| Root extraction route | ILSpy remains suitable for managed gameplay; no IL2CPP/native route needed for the traced systems. |
| Feature pass six modules | Extended with current installed 1.7 data, dialogue, quest and persistence traces. |
| Feature aspect gaps | Save/quest/dialogue framework gaps substantially reduced; all converters, scripts, DLC consumers and native UI remain open. |

Checks: selected ILSpy exports, XML parsing/census, private hashes, output JSON/key checks and source-reference validation. No recovered-source compile, game launch, YAIRPG build/browser, personal save access, commit or push. [CHECKPOINT](CHECKPOINT.md) owns exact remaining gaps; [VALIDATION](VALIDATION.json) owns measured checks.
