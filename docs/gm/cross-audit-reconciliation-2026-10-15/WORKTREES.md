# Worktree provenance manifest

Current UA1 result, 2026-10-16: [seven-counterpart evidence comparison](UA1_RECOVERY_2026-10-16.md)
completes the bounded reconciliation. Report/private equivalence remains unproved;
exact absent/different blobs and owner-assigned receipt gaps are preserved there.
The eighth unavailable registration remains separate. No restore or merge follows.

Frozen registration: 2026-10-15T16:10:08.429624+00:00. Main HEAD `c768ad60676e76cb94cb17f7182a7234427b46ec`.

111 registered, 103 available, 8 unavailable. Exact porcelain, full dirty paths, object catalog and revision aliases are retained in ignored [private/WORKTREES.json](private/WORKTREES.json), [DOCUMENT_CATALOG.tsv](private/DOCUMENT_CATALOG.tsv) and [record queue](private/RECORD_QUEUE.json). These are inventory, not semantic reading. No checkout restored/pruned/switched/merged.

Status observation was sequential after the registration timestamp, not an atomic snapshot. Main has concurrent writers. Blob catalog describes HEAD; dirty SHA256 rows override the corresponding working observation. An ancestor or matching report never proves current-candidate integration. Owners are unverified unless a checkpoint/return identifies one. Full status includes runtime and loose documentation; no private save contents were read.

| Tree | Branch / HEAD | Availability | Dirty paths / doc deltas from main HEAD |
|---|---|---|---|
| `/Users/weiwei/code/yet-another-idle-rpg` | `codex/gameplay-foundations` / `c768ad60676e` | available | 2011 / 0 |
| `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/4ccba8a0-e617-4c65-acff-f0b65bdf3042/scratchpad/oldclient` | `detached` / `78e3c70afcf2` | available | 2 / 15 |
| `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/e26723ff-9aba-474b-8ba9-880b7e142612/scratchpad/rootbuild` | `detached` / `a6fdaafd1556` | available | 0 / 19 |
| `/private/tmp/p00-old-main-cc04a4bf` | `detached` / `cc04a4bf6816` | available | 1 / 16 |
| `/private/tmp/yairpg-audit-20261014` | `detached` / `d1ef4736ab76` | available | 1 / 19 |
| `/private/tmp/yairpg-audit-current-20261014` | `detached` / `5c084e50cc25` | available | 1 / 19 |
| `/Users/weiwei/.codex/worktrees/a5-native-audit/yet-another-idle-rpg` | `detached` / `53dc1df15889` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/micro-p1-xp/yet-another-idle-rpg` | `detached` / `8a4c82d9022e` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/minigame-management/yet-another-idle-rpg` | `detached` / `53dc1df15889` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg` | `codex/start-records` / `554435c95337` | available | 0 / 50 |
| `/Users/weiwei/.codex/worktrees/starts-talents-continuity/yet-another-idle-rpg` | `detached` / `53dc1df15889` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/systems-cheats-completion/yet-another-idle-rpg` | `detached` / `53dc1df15889` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/v06-foundation/yet-another-idle-rpg` | `refs/heads/codex/v06-foundation` / `43adf6f96a22` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/wider-gameplay/yet-another-idle-rpg` | `detached` / `53dc1df15889` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/.codex/worktrees/world1-completion/yet-another-idle-rpg` | `detached` / `53dc1df15889` | unavailable; registered prunable | untracked/private content unrecovered |
| `/Users/weiwei/code/absorb-2026-10-11-workers/b` | `codex/absorb-2026-10-11-b` / `d54bf106b15e` | available | 0 / 39 |
| `/Users/weiwei/code/absorb-2026-10-11-workers/c1` | `codex/absorb-2026-10-11-c1` / `a200067863c3` | available | 0 / 39 |
| `/Users/weiwei/code/absorb-2026-10-11-workers/c2` | `codex/absorb-2026-10-11-c2` / `3dce81868c92` | available | 0 / 40 |
| `/Users/weiwei/code/absorb-2026-10-11-workers/d` | `codex/absorb-2026-10-11-d` / `761fde3958f9` | available | 0 / 39 |
| `/Users/weiwei/code/absorb-2026-10-11-workers/e1` | `codex/absorb-2026-10-11-e1` / `e6c6573297a3` | available | 0 / 39 |
| `/Users/weiwei/code/absorb-2026-10-11-workers/e2` | `codex/absorb-2026-10-11-e2` / `9ef8a719ad43` | available | 0 / 39 |
| `/Users/weiwei/code/absorb-2026-10-11-workers/e3` | `codex/absorb-2026-10-11-e3` / `16bb9ef853da` | available | 0 / 39 |
| `/Users/weiwei/code/yair-absorb-all-20261014/air-wider` | `absorb-all/air-wider` / `83f838406209` | available | 3 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/fork-fort` | `absorb-all/fork-fort` / `892beb4f56c8` | available | 3 / 18 |
| `/Users/weiwei/code/yair-absorb-all-20261014/fork-resurvey` | `absorb-all/fork-resurvey` / `733f0b2c26cc` | available | 3 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/integration` | `absorb-all/integration` / `d4bcb1b89736` | available | 0 / 56 |
| `/Users/weiwei/code/yair-absorb-all-20261014/natural-play` | `detached` / `ce005a31f296` | available | 1 / 14 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-combat-options` | `absorb-all/p23-combat-options` / `d4fcc35a38a8` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-encounter-profiles` | `absorb-all/p23-encounter-profiles` / `110b4ccb6230` | available | 0 / 21 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-exposure` | `absorb-all/p23-exposure` / `5ba2ec4f65fc` | available | 0 / 21 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-field-familiarity` | `absorb-all/p23-field-familiarity` / `7b3b7249c01c` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-growth-profile` | `absorb-all/p23-growth-profile` / `3fb645a3d45b` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-host-joins` | `absorb-all/p23-host-joins` / `30cea72852ab` | available | 0 / 16 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-household` | `absorb-all/p23-household` / `f53cdfbf928e` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-known-detail` | `absorb-all/p23-known-detail` / `b30fd87f39b4` | available | 0 / 21 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-leisure-memory` | `absorb-all/p23-leisure-memory` / `4f8a035671bc` | available | 1 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-life-loops` | `absorb-all/p23-life-loops` / `090fcb0d8807` | available | 3 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-living-gear` | `absorb-all/p23-living-gear` / `7a739fc79acf` | available | 0 / 21 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-long-life` | `absorb-all/p23-long-life` / `3c0fdb97f313` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-market-life` | `absorb-all/p23-market-life` / `6adb34c0a329` | available | 0 / 20 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-repeat-search` | `absorb-all/p23-repeat-search` / `e4679325644b` | available | 0 / 21 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-reread` | `absorb-all/p23-reread` / `c0fae23da16c` | available | 1 / 21 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-reveal-chain` | `absorb-all/p23-reveal-chain` / `1cf32c0f9832` | available | 3 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-salvage` | `absorb-all/p23-salvage` / `58afaf185b0a` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-save-time-options` | `absorb-all/p23-save-time-options` / `7ab1c66ea3f9` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-ui-polish` | `absorb-all/p23-ui-polish` / `6cca47b71893` | available | 3 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/p23-world-adaptation` | `absorb-all/p23-world-adaptation` / `b73a1ba3be81` | available | 0 / 19 |
| `/Users/weiwei/code/yair-absorb-all-20261014/reach-fixes` | `absorb-all/reach-fixes` / `d208523bacfe` | available | 0 / 15 |
| `/Users/weiwei/code/yair-absorb-all-20261014/sim-stepper` | `absorb-all/sim-stepper` / `78749564ccb1` | available | 0 / 57 |
| `/Users/weiwei/code/yair-absorb-all-20261014/stepper-perf` | `absorb-all/stepper-perf` / `1fc4cc327982` | available | 0 / 16 |
| `/Users/weiwei/code/yair-absorb-all-20261014/upstream-dev` | `absorb-all/upstream-dev` / `2dd47f05f9cc` | available | 3 / 19 |
| `/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion` | `absorb/air-systems-cheats-completion` / `f60638d1176f` | available | 35 / 19 |
| `/Users/weiwei/code/yair-cb-integrate` | `integrate/cb-t3` / `9c4602a9e369` | available | 0 / 15 |
| `/Users/weiwei/code/yair-p01-integrate` | `integrate/p01` / `838f805250f5` | available | 0 / 13 |
| `/Users/weiwei/code/yair-p01-mixing` | `slice/p01-mixing-feedback` / `77c0851a63fc` | available | 0 / 17 |
| `/Users/weiwei/code/yairpg-w28-world-climate` | `kit/w28-world-climate` / `024d4da98268` | available | 0 / 34 |
| `/Users/weiwei/code/yairpg-w36-calendar-climate` | `kit/w36-calendar-climate` / `45c75e9cd2fd` | available | 0 / 34 |
| `/Users/weiwei/code/yairpg-w36-integrate` | `kit/w36-integrate` / `51b045e01315` | available | 0 / 15 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-a09658bcd5ecc072d` | `worktree-agent-a09658bcd5ecc072d` / `643b7f1b9479` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-a31a7ac7607bfd391` | `worktree-agent-a31a7ac7607bfd391` / `ce76f3cca27c` | available | 3 / 27 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-a69210d5dc7a62447` | `worktree-agent-a69210d5dc7a62447` / `5fca93d94bca` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-a98ba83b128c9a0c3` | `worktree-agent-a98ba83b128c9a0c3` / `0810bdf9e9df` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-ab32482a518df251b` | `worktree-agent-ab32482a518df251b` / `3dcfe7ba58bf` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-ad82f23d94f196fae` | `worktree-agent-ad82f23d94f196fae` / `943bfca548a1` | available | 3 / 27 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-aedda304f5f9605f0` | `worktree-agent-aedda304f5f9605f0` / `a3cac4aabe62` | available | 0 / 27 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/cb-t2-inspector` | `proc/cb-t2-inspector` / `da1ced88de85` | available | 0 / 14 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/cb-t3-rules` | `proc/cb-t3-rules` / `879eb4d4b6eb` | available | 0 / 14 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/core-a2-tags` | `core/a2-tags` / `d666e20fbe89` | available | 0 / 19 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/core-a3-travel-tests` | `core/a3-travel-tests` / `030c476bbcc3` | available | 0 / 19 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/core-a4-relationships` | `core/a4-relationships` / `c6ea2cbc43c0` | available | 0 / 19 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/core-a5-determinism` | `core/a5-determinism` / `6fbc31934350` | available | 0 / 19 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/elated-bhaskara-f9178d` | `claude/engine-perf-d1` / `96aad3dff7f7` | available | 0 / 22 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-perf` | `claude/engine-perf-wave` / `e0723a0d580a` | available | 0 / 57 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-perf-core-5a93e1` | `claude/engine-perf-core-5a93e1` / `951792bac514` | available | 0 / 22 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-perf-gate-853189` | `claude/engine-perf-gate-853189` / `6ec2baa84dd9` | available | 0 / 22 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-perf-harness-7fa4db` | `claude/engine-perf-harness-7fa4db` / `d8fb43a37781` | available | 0 / 17 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-perf-layout-4d6570` | `claude/engine-perf-layout-4d6570` / `eca2ca23891a` | available | 0 / 21 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/engine-perf-scaling-afdada` | `claude/engine-perf-scaling-afdada` / `c3a9369d09f4` | available | 0 / 23 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/fix-f1-sequence-426668` | `claude/fix-f1-sequence-426668` / `9062f6579140` | available | 0 / 57 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/gen-g1-kit` | `gen/g1-kit` / `adaa4e181b6a` | available | 0 / 23 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/hl-integration` | `hl/integration` / `10ff5acb71ca` | available | 0 / 25 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/hl-lp2` | `codex/hl-lp2` / `d98c40ab9742` | available | 3 / 20 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/hl-lp3` | `codex/hl-lp3` / `849503c51a40` | available | 3 / 21 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/hv1-carcass` | `proc/hv1-carcass` / `dbf266c7cbdc` | available | 3 / 37 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-gx5-appearances` | `proc/gx5-appearances` / `cb98f67fb0cc` | available | 3 / 39 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p1-streams` | `proc/p1-streams` / `7b787fdddc72` | available | 3 / 26 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p2-mixing` | `proc/p2-mixing` / `f8fe699487c9` | available | 3 / 26 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p3-storylets` | `proc/p3-storylets` / `4e444a5e19c0` | available | 3 / 25 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p34-spine` | `proc/p34-story-spine` / `f9a95e6aafdc` | available | 3 / 18 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p4-people` | `proc/p4-people` / `09403f5c948e` | available | 3 / 26 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-r3-merge` | `proc/r3-merge` / `ad11f8ababc7` | available | 3 / 34 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-wave1-integration` | `proc/wave1-integration` / `ff24c75f1741` | available | 3 / 19 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/r15-g10-remaining` | `r15-g10-remaining` / `df21cd50da76` | available | 0 / 30 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/r15-g9-world1` | `r15-g9-world1` / `cf04734c2662` | available | 0 / 30 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/rbe-r1` | `codex/rbe-r1-resolver` / `4d168282d4d2` | available | 0 / 15 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/rbe-r2` | `codex/rbe-r2-effect-dsl` / `186b553f75d4` | available | 0 / 13 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/rt-slice1` | `codex/rt-slice1` / `667fbe118745` | available | 0 / 19 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/rt-slice1-fixtures` | `codex/rt-slice1-fixtures` / `aa0c2d2210da` | available | 0 / 16 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ta1-village-asks` | `proc/ta1-village-asks` / `c18da69132b0` | available | 12 / 41 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-cheats-ch1` | `detached` / `dc06d02e292b` | available | 0 / 30 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-cheats-r1` | `ui/cheats-r1` / `6ddf720f1cc3` | available | 0 / 53 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/w1-campaign` | `w1-campaign` / `bc999ea491fe` | available | 3 / 42 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-a-loop-53c42e` | `claude/wave-a-loop-53c42e` / `df259bda28ef` | available | 0 / 36 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-b-state-f96892` | `claude/wave-b-state-f96892` / `439bf0593f89` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-c-headless-0f7b1d` | `claude/wave-c-headless-0f7b1d` / `e942ff902039` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-d-simfuzz-b76281` | `claude/wave-d-simfuzz-b76281` / `b8045d277873` | available | 0 / 32 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-e-replay-37566f` | `claude/wave-e-replay-37566f` / `ead6735f215b` | available | 0 / 32 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-f-checks-4616ad` | `claude/wave-f-checks-4616ad` / `89f5c760fee3` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-g-render-887951` | `claude/wave-g-render-887951` / `451f3297e1e1` | available | 0 / 34 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-h-startup-67e16e` | `claude/wave-h-startup-67e16e` / `35201e4d4755` | available | 0 / 29 |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/wave-i-combat-d8c88a` | `claude/wave-i-combat-d8c88a` / `f76904f4da3b` | available | 0 / 33 |

## Referenced locations beyond registration

[Referenced-path intake](private/REFERENCED_PATHS.txt) came from main dispatch CHECKPOINT, PAUSED_HANDOFF, THREADS and ASSIGNMENT files only. This is a finite selected reference family, not all possible historic paths. Source tool `lncrawl-polite` is excluded from checkout discovery. Recorded temporary proof/save paths are evidence locations, not automatically worktrees. Availability/classification is in [REFERENCE_LOCATIONS.json](private/REFERENCE_LOCATIONS.json). No archived worktree attachment was returned for this chat; this does not prove no archives exist elsewhere.


## Archive recovery delta

[Continuation F20](CONTINUATION.md#missing-registered-locations-and-accessible-archive-counterparts-f20) records seven accessible named snapshot counterparts in the exact MacTransfer archive referenced by Air re-audit. Original registered-path absence remains valid. Snapshot identity/private retention are unverified; no restore/copy occurred.
