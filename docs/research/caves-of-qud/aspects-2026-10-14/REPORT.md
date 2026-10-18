# Caves of Qud aspect backfill report

The installed base gameplay code is unchanged from the prior 2.0.211.56 intake: its assembly SHA-256 matches exactly. Steam now reports build **25520692** fully installed. The prior intake has no Steam build ID, so a numeric build-ID change cannot be determined. **No install is needed** for this static pass. No game, Windows executable or personal save was run/read.

A01–A12 now have explicit source coverage and gaps. The strongest new reading is conversation admission versus effects, the multi-file save/recovery boundary and saved tutorial context. Full dialogue/table bytes and decoded code stay in `~/.codex/research/bf-caves-of-qud/`; the repository contains paraphrase, counts and identifiers only. [ASPECTS](ASPECTS.md) puts prior-dossier corrections first. [Inventory](SYSTEM_INVENTORY.md) accounts for all discovered class families and captured Base XMLs; it does not imply all methods were read.

## Ranked PROPOSALS

Unselected, unimplemented. Existing owners were checked for routing, not audited wholesale. No change to standing priorities, one realm/one prestige scope, repeatable reasonable possibilities or desktop-first direction.

| Rank / code | Proposal | Existing owner | Source |
|---|---|---|---|
| 1 / P1 | Make one social offer report its actual committed result: Offer, permission, costs and learned result stay distinct; retain teacher provenance. | `src/components/dialogue_component.js, src/models/dialogue_action.js, src/people_knowledge.js` | D1 / A01 |
| 2 / P2 | Validate the complete durable save envelope: Keep metadata, world state and pending commands mutually compatible through recovery. | `src/save_files.js, src/save_compatibility.js and current native publisher` | D2 / A04 |
| 3 / P3 | Resume contextual guidance safely: Save stable lesson/substep IDs, derive transient highlights from current location and known facts. | `Existing onboarding/knowledge route; src/people_knowledge.js and docs/UI_RULES.md for UI routing` | D3 / A10 |
| 4 / P4 | Keep NPC observation, eligibility and action result separate: Use one existing encounter; change ally presence or exact fitted tool to produce a useful alternate action. | `src/npc_lives.js and existing encounter/command consumers` | A05 / prior re-pass |
| 5 / P5 | Give generated lore a stable factual source: Journal, rumor and relic description refer to the same event identities with actor-specific discovery. | `Existing world/history, src/world_knowledge.js and quest owners` | A02 / newer generated-world audit |
| 6 / P6 | Declare each delayed effect’s clock and inactive-zone rule: Use existing scheduling; distinguish game actions, played time, history and optional inactive-region catch-up. | `src/simulation_clock.js and current played-time/world scheduler owners` | A09 |

## Prior-lane reconciliation

| Code | Confirm / correct / extend | Result |
|---|---|---|
| F1 | Correct availability | Original full export is historical, not present-day availability. Fresh targeted exports replace that assumption. |
| F2 | Correct installation state | Current Steam manifest reports installed; no launch establishes runtime health. |
| F3 | Confirm gameplay artifact | Same assembly hash/version. Steam build-ID history unknown; package/DLC equality unproved. |
| F4 | Confirm re-pass qualification | Missile inner failure can be hidden by outer success; no universal fallback or universal best-action planner. |
| F5 | Extend dialogue | XML graph/inheritance, event-driven gate/text/action parts and actual selection ordering are now recorded. |
| F6 | Extend persistence | Main save binary, metadata, cache, version range, backups, sentinels and weak post-write check separated from achievement profiles. |
| F7 | Extend broader coverage | Newer local systems audit and supplements are linked with their own unread/native limits, rather than treated as absent or re-run wholesale. |

## Checks and remaining gates

All twelve JSON keys and required documents were validated, all original/derived private extracts hashed, XML parse coverage counted, and failed type lookup kept in TOOLING. A snapshot hash identifies retained bytes, not correct decompilation or play behavior. See [CHECKPOINT](CHECKPOINT.md) for exact validation and unread rows.

Status is **PARTIAL** for semantic/native coverage: every aspect is accounted for, but all migrations, many NPC/effect/zone consumers, Sifrah activation, DLC loading/entitlement and visual layout remain unread or unexercised. Launching the game was prohibited, so no native acceptance is claimed. No YAIR implementation was authorized or delivered. Province War may cite this dossier through its own research register; this lane made no cross-project edits.
