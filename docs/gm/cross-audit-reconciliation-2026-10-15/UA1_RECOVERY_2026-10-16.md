# UA1 archive evidence recovery

2026-10-16. Read-only comparison at the exact MacTransfer archive root recorded in `private/ARCHIVE_COUNTERPARTS.json`. No checkout was restored or copied. The seven original registrations remain unavailable.

## Result

All seven registered HEAD commit objects are present in the main Git object database. This enables a committed-byte comparison, but it does not recover the checkout’s dirty or private state. The tested task-report paths are absent at the registered commits. Of the selected source paths, most have no blob at that commit; the micro-p1 levelable source exists there but differs from the archive copy. No private or untracked receipt equivalence is claimed.

| Counterpart | Registered commit | Report/source comparison | Receipt result and existing owner |
|---|---|---|---|
| `a5-native-audit` | `53dc1df15889` object present | Report path absent at commit; no selected source blob to compare. | `docs/research/novels/world-depth-2026-10-11/audits/native-proof` present; fully hashed (6 files) six native-proof scripts and two private pack files are present; no expected original SHA-256/line pins exist for these receipts in the registration. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/a5-native-audit.md` |
| `micro-p1-xp` | `8a4c82d9022e` object present | Report path absent at commit; `src/components/levelable_component.js` source blob differs from archive bytes. | No bounded proof directory selected. The implementation, native regression test, and browser harness are present; no expected original receipt pins are preserved, so byte equivalence to the registered checkout cannot be established. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/micro-p1-xp.md` |
| `minigame-management` | `53dc1df15889` object present | Report path absent at commit; no selected source blob to compare. | No bounded proof directory selected. Three named management source files are present; the owner report says no source delta was needed. No exact registered proof-receipt pins are available to compare. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/minigame-management.md` |
| `systems-cheats-completion` | `53dc1df15889` object present | Report path absent at commit; no selected source blob to compare. | No bounded proof directory selected. All nine source/test/harness paths are present; no original registered hashes or proof-output receipts are pinned, so source presence does not recover the registration bytes or establish gameplay. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/systems-cheats-completion.md` |
| `starts-talents-continuity` | `53dc1df15889` object present | Report path absent at commit; no selected source blob to compare. | No bounded proof directory selected. Private manifest and p06 pack bytes are present and hashed in this recovery record. Their original registration hashes are absent; owner report lists additional private/research paths that were not all registered with hashes. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/structured-packs.md` |
| `wider-gameplay` | `53dc1df15889` object present | Report path absent at commit; no selected source blob to compare. | `docs/research/novels/wider-gameplay-2026-10-11/proof` present; fully hashed (21 files) Manifest, p06 pack, and 21-file proof directory are present and hashed/count-recorded where files; no original registration pins exist. The later world1 snapshot removes this runtime branch, per owner report. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/structured-packs.md` |
| `world1-completion` | `53dc1df15889` object present | Report path absent at commit; no selected source blob to compare. | `docs/research/novels/world-depth-2026-10-11/continuation` present; fully hashed (198 files) Manifest, p06 and p07 packs and 198-file continuation directory are present; private pack file hashes are captured here but original registration pins are absent. Owner: `docs/gm/dispatch/air-absorb-2026-10-13/reports/structured-packs.md` |

Owner-copy report SHA-256 and line count, per-file private receipt hashes, and proof-directory manifests are recorded in [`private/UA1_RECOVERY_2026-10-16.json`](private/UA1_RECOVERY_2026-10-16.json). The manifest records paths and hashes only; no sealed truth is reproduced.

## Separate eighth registration

`v06-foundation` remains independently unavailable. WORKTREES records HEAD `43adf6f96a22c4bc9be8384ac4a016a98571d38a` on `codex/v06-foundation`; no counterpart exists at the exact recorded archive path, and no other archive location was searched. Report hashes and private/untracked evidence remain unrecovered. Existing owner: `WORKTREES.md`.

## Check

Ran `git cat-file -e <registered-HEAD>^{commit}` for each of the seven names; all returned success. Ran `git show <registered-HEAD>:<selected-path>` for the owner report and named source/receipt paths and compared available blobs byte-for-byte with archive files. Generated private per-file SHA-256 manifests for the named native-proof, wider-gameplay proof, and world-depth continuation directories. No source files or registrations were modified.
