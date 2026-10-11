# Steam installed-source audits, 2026-10-09

All six targets installed, received bounded source audits with verified private
retention, and had uninstall URIs requested. Eldyn's installed content is a remote
web wrapper, so its actual gameplay mechanics remain unavailable. No game was
launched and no Steam dialog was clicked. Removal status is recorded separately.

## Acquisition and delivery

Watch began 2026-10-09T19:35:04.571321+00:00. All targets were Fully Installed by
2026-10-09T20:03:08.526050+00:00, after 11
polls spaced about three minutes apart (one restart preserved the original deadline).
The two-hour cap was unnecessary after all targets installed.
[STATUS.json](STATUS.json) and [timestamped observations](OBSERVATIONS.jsonl).

| AppID | Report | Installed build | Proposals/touches | Removal observed |
|---|---|---|---|---|
| 1740540 | [the-lands-of-eldyn](../../../research/the-lands-of-eldyn/REPORT.md) | 7520224 | 5/22 | not-verified; request sent, dialog confirmation unobserved |
| 3848900 | [sucker-for-love-crush-landing](../../../research/sucker-for-love-crush-landing/REPORT.md) | 25151407 | 8/24 | verified-manifest-absent-and-log-success |
| 4522510 | [kill-the-lich-idle](../../../research/kill-the-lich-idle/REPORT.md) | 23044204 | 8/24 | verified-manifest-absent-and-log-success |
| 3795920 | [ani-idle](../../../research/ani-idle/REPORT.md) | 19068956 | 8/24 | not-verified; request sent, dialog confirmation unobserved |
| 2847400 | [endless-ascent](../../../research/endless-ascent/REPORT.md) | 25410965 | 8/24 | not-verified; request sent, dialog confirmation unobserved |
| 3606890 | [upload-labs](../../../research/upload-labs/REPORT.md) | 23748080 | 8/24 | not-verified; request sent, dialog confirmation unobserved |

Counts overlap across reports and are not distinct-idea totals. All proposals
are original adaptations, not accepted decisions or implemented gameplay.

## Findings and limits

- **F1 the-lands-of-eldyn:** Local wrapper loads remote game; menu navigation is inspectable, territory/army/NPC rules are not. Limit: Remote host public-source recovery failed including DNS; no runtime or remote game logic.
- **F2 sucker-for-love-crush-landing:** Typed heart milestones remember preparation choices and inform final scenes; ending flags retained separately. Limit: Full routes/localization/native extensions and runtime unverified; point_wicked/points_wicked discrepancy.
- **F3 kill-the-lich-idle:** Ordinary skills/social work feed prepared confrontation; 19 of 22 source files match normalized public source. Limit: Installed cloud loading enabled but ordinary cloud write commented; runtime synchronization/pacing unverified.
- **F4 ani-idle:** Repeat fights, manual skills, interruptible rest events, directed crystal crafting and chained quest memory. Limit: No prestige/offline reconciliation found in inspected scripts; exact scene/resource data and runtime unverified.
- **F5 endless-ascent:** Weighted item puzzles, distinct missing-item checks, heat/hydration warnings and completion-funded consumables. Limit: Scene bindings/serialized overrides/full route graph/checkpoint persistence/runtime unverified; no idle or prestige established.
- **F6 upload-labs:** Research alternatives, flow bottlenecks, sample sell-versus-investigate choices, capped away-time reserve and distinct reset/refund paths. Limit: Nine inspected automation bytecode entries truly blank; 11 recovered scripts blank in total; runtime/pacing/reset consequences unexercised.

The dated [north-star findings](../../../LIFE_SIM_NORTH_STAR.md#steam-install-follow-up-findings-2026-10-09)
link the six passes and keep adaptations marked proposals.

## Verification and remaining gates

Raw inputs remain private under `~/.codex/research/<game>/`; exact retention and
recovery hashes, tool versions and byte/line anchors stay with each dossier.
[VALIDATION.json](VALIDATION.json) records static output checks and live shared
workspace drift. No YAIR source edits, builds, saves, commits or runtime tests
were performed by this task. Runtime, pacing, rendered UI and game persistence
remain unexercised. Uninstall URI exit0 is a request, not confirmation of removal.
