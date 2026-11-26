# LOTM continuity metadata recovery

Status: agent-verified source recovery, not human-reviewed. This restores an authentic missing verification dependency. It changes no cast rows, verifier, baseline or runtime manifest.

| Preflight | Scope |
| --- | --- |
| Reading | Determine whether the recovered cast's 156 new CTR2 findings are a verifier scope error or unresolved source identities; compare the authoritative Mac checkout. |
| Authority | Coordinator authorized diagnosis, then restoration of the authentic missing continuity metadata beside its owner, with exact byte verification and no baseline changes. CTR2/CTR9 and AD36 apply. |
| Player sentence | n/a: verification metadata, no player text or gameplay change. |
| Ordinary route | Read the current local pack and checker, compare the existing Mac owner, simulate its links in memory, then restore the matching missing file. No new aliases or same-name heuristics. |
| Mechanism and fit | Existing `emitIdMap`, `emitDistinct`, `applyIdMaps` and `scanTree` in `scripts/check_continuity.mjs`; authentic cast-side continuity reconciliation. |
| Ring | Producer identity, existing verifier consumer, missing-file failure and source preservation; no persistence migration or UI claim. |
| Files | This receipt and ignored `private_packs/lotm-cast/continuity-links.json`. The cast, checker and baseline stay unchanged. |
| Failure and checks | Without the metadata, re-keyed names produce 156 new findings. Restore byte-verified metadata, check the exact two archival refs remain, run focused continuity tests and the existing rules gate. |

F1: The local pre-recovery scan read 22 private JSON files and reported 158 CTR2 groups: two known and 156 new. Of the new groups, 62 concerned people and 94 places. Explicit in-pack `indexId` and `idMap` links were already applied. These were missing-reconciliation warnings, not evidence of 156 duplicated people and not a Windows ID-scope comparison defect.

F2: Read-only inspection of the existing `mac` SSH owner's `/Users/weiwei/code/yet-another-idle-rpg` found the byte-identical cast, LF-identical checker and LF-identical baseline. Its 58-file private scan reported the same two known findings and no new findings. The missing local dependency was `private_packs/lotm-cast/continuity-links.json`: 308 existing identity links plus two explicit distinct-pair claims. Applying those authentic claims in memory to the local scan reduced it to the exact Mac result before any file was restored. Other absent Mac packs were not acquired.

F3: The file was copied as bytes from that exact Mac path using an exclusive-create write, then independently rehashed locally. The local scanner now reads 23 private JSON files and produces only the unchanged known refs `7b888db3` and `b82c3230`. Real unresolved findings remain in force. No baseline entry was added, removed or regenerated; no verifier allowance was changed. Existing identity-link and distinct-pair regressions cover the recovered mechanism, so no duplicate test was added.

| Input | Bytes / identity |
| --- | --- |
| Restored `lotm-cast/continuity-links.json` | 32,865; SHA256 `d3a6a5ad8912846e49021b909084265d0499b8bc4e8b64169e82c1223b2e17d2` |
| Preserved `lotm-cast/cast.json` | 6,572,056; SHA256 before and after `4e1b1e4be8d9420553259132ad02ceef7b41fb6fa0f9241aa63bcb619eea5c0e` |
| Mac / LF-normalized local checker | SHA256 `20cb7158bac0bd52ed0f4f1099b0dbaea745a465a4f4e2996760ced86b72cbae` |
| Mac / LF-normalized local baseline | SHA256 `a8061e834100908a8c8f2e12a8e5dab89e2411e54594801f5174846d0e275302` |

| Check | Result and gap |
| --- | --- |
| Read-only Mac `scanTree` comparison and in-memory local link overlay | Exact two known refs; zero new findings. No source labels or sealed identity values copied into this report. |
| `node --test tests/continuity_check.test.js` | 13/13 passed, zero failed/skipped; includes the current recovered tree against the unchanged baseline. |
| `npm run check:rules` | Exit 0; continuity reports two known findings. Existing warning-only rule lints and the ignored-private-path stale glob remain. Log: `%TEMP%/oops-continuity-restored-rules-20261125.log`. |

The authentic metadata is retained beside its cast owner. No scratch source copy, browser, server, build candidate, commit or push was created by this recovery. Runtime playability and the separate full-suite attempt are outside this receipt.
