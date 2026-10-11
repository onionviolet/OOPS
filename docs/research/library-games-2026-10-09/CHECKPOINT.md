# Library games checkpoint

2026-10-09, revision 3. **Three public-source passes delivered; Steam acquisition blocked. The whole assigned install/audit/uninstall wave is not complete.** Start with [REPORT.md](REPORT.md). Role: library games source GM `/root`; [assignment](../../gm/dispatch/library-games-2026-10-09/ASSIGNMENT.md).

## Authority and ownership

Research only: no YAIR source edits/builds/commits, purchases, gameplay launches or private-save access. Keep one Steam payload at a time. Protected apps 1468810, 1546320, 1325860, 2854290 remain excluded from uninstall; their manifests are still present. No compatibility/config mutation selected.

Coordinator owns this directory, dispatch CHECKPOINT and all eight per-game research dossiers. `/root/theory_magic` completed Theory of Magic and KTL and explicitly handed both docs/private snapshots back; `/root/bitburner` completed and explicitly handed back its docs/private snapshot. Both stopped with no active writes or pending tools. No child restart or duplicate writer needed. Unrelated dirty source/build/docs work and other processes were preserved. [INPUT_SNAPSHOT.json](INPUT_SNAPSHOT.json) holds head, status and initial owning-source hashes; final checks found no captured input drift.

## Completed source passes

| Game | Pinned source | Output | Limits |
|---|---|---|---|
| [Theory of Magic](../theory-of-magic/REPORT.md) | Community `a2632d2edf3e07e9168fff81167b11f2792e9197`; original identity `35437ed4869856220d17ea9564b339cd02b03035` | 8 ranked proposals, 24 original touches; 594 inventory hashes | User-open version unknown; original identity only, no complete fork diff. |
| [Bitburner](../bitburner/REPORT.md) | Official stable `1da7316ffd9d281b45a86c4c54ec532276557892`; default dev separately qualified | 6 proposals, 26 touches; 17 selected hashes and git provenance | Not the installed Steam build; no runtime/offline correctness proof. |
| [Kill the Lich Idle](../kill-the-lich-idle/REPORT.md) | Public web `d41bf197f9203e6da6f72628a9d76369b8140d57` | 6 core chains,8 proposals, 24 touches; 23 selected files, 652,790 bytes | Related-source inference only; no inspected direct link to shipped binary, no Steam equivalence/ownership. |

Per-game INTAKE, REPORT, FINDINGS, COVERAGE, IMPLEMENTATION_PACKETS and CHECKPOINT are present. Private hashes/raw source remain outside YAIR. Five other dossiers are explicitly acquisition-only, with no fabricated source proposal/touch sets. All designs remain proposals. Counts overlap across dossiers and are not distinct-idea totals.

## Install and uninstall queue

[STEAM_STATE.json](STEAM_STATE.json) is the exact recorded queue receipt. Sole configured Steam library inspected; no target manifest exists. Cached depot estimates are below 8 GB but do not prove current install size or ownership. Eldyn's store excludes Mac while cached appinfo contains a Mac launch/depot; actual installability remains unverified.

| Order/app | Install state | Source state | Uninstall state |
|---|---|---|---|
| Theory of Magic | No action; exact open instance unidentified | Public-source pass complete | Not requested |
| 1 / 3848900 Sucker for Love | `open steam://install/3848900` shell exit0, Steam console acknowledged 01:33:49 local; dialog unobserved, no manifest | Acquisition-only | Not requested; gates unmet |
| 2 / 4522510 Kill the Lich Idle | Not requested; queued behind first | Public web pass complete; Steam payload pending | Not requested; installed-source gates unmet |
| 3 / 3795920 Ani Idle | Not requested; queued | Acquisition-only | Not requested; gates unmet |
| 4 / 2847400 Endless Ascent | Not requested; queued | Acquisition-only; storefront describes puzzle/platforming, not idle ascent | Not requested; gates unmet |
| 5 / 3606890 Upload Labs | Not requested; queued | Acquisition-only; declared DLC inventory is not entitlement/read coverage | Not requested; gates unmet |
| 6 / 1740540 The Lands of Eldyn | Not requested; queued | Acquisition-only; territory-control MMO, not established NPC life simulation | Not requested; gates unmet |
| Bitburner 1812820 | No Steam action, as assigned | Official public-source pass complete | Not requested |

## Blocker and resume

Native Steam inspection failed with ScreenCaptureKit -3811, “Failed to start stream due to audio/video capture failure.” Initial bundle-ID lookup was ambiguous; exact running path was selected before that capture failure. Switched to the explicitly assigned Steam URI route and read-only manifest/log/cache checks, not repeated capture variants or another UI automation mechanism. The install URI reaching Steam is not proof of a dialog, ownership, download or installation. Async user question asked availability/size in the first dialog; no reply received before checkpoint. No auto-approval rejection or password prompt occurred.

**Next action:** reconcile the existing Sucker for Love dialog with user feedback or restored native inspection, then inspect finalized manifest/build, staging and stable files. Do not resend its URI or queue other dialogs while its outcome is unknown. Confirm ownership and <=8 GB size; hash-copy only useful source, complete the actual source pass and preserve required inputs before requesting `steam://uninstall/3848900`. Weibao owns uninstall confirmation. Verify manifest/install removal before proceeding in listed order. Never launch a game, modify saves, buy, uninstall protected titles or force a platform workaround to bypass this blocker. KTL's public-source pass cannot substitute for installed-version comparison if its Steam payload arrives later.

## Verification

[VALIDATION.json](VALIDATION.json) records static artifact/hash/range/link/count checks and input drift, with its limits. Parent directly cross-checked Theory study/furnishing/Hall, Bitburner research/reset/offline, and KTL flow/confrontation/Amulet. No npm tests or builds were run because this is a research-only lane. No runtime pacing, rendered UI/accessibility, game save/reload/import or YAIR playable acceptance was exercised. No outstanding worker/tool operations remain; only the unobserved first Steam install request needs external reconciliation.
