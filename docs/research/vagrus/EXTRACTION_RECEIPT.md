# Vagrus extraction receipt

Build 25598304, app 909660, macOS Unity **6000.2.9f1**, Mono. The version was read from the serialized resource header; this is not a launch result. Install names/sizes inventory contains 17,365 files totaling 5,479,725,761 bytes.

Managed method bodies were recovered with ILSpy 9.1.0.7988 on .NET SDK 8.0.425. An unpinned incompatible tool package failed before the compatible version succeeded. The 5,106,688-byte assembly and the 1,633,329-byte graph input were copied hash-matched. Generic resource custom type-tree reads largely failed; no gameplay claims depend on those failures. Targeted Addressables TextAssets and recovered loader/decryption code replaced that route.

Five original data bundles were copied hash-matched, totaling 55,145,936 bytes. Decoding uses the installed StringEncryptor/PoolLoader format. Keys are kept privately; no game method was executed. All five tables parse as JSON and re-extract/re-decode byte-for-byte from the retained bundle copies.

| Table | Original bundle SHA-256 | Decoded bytes | Decoded SHA-256 |
|---|---|---|---|
| events | `d154fe4efb54b1f817db8f5a6b7a94ae0d1c93118b25549a8e8f36991bb6c276` | 29,671,814 | `46cfaa96f369f6b816fad13888c1413df30d35972e66021c8f4cf2d0cc64e84b` |
| AirTable | `f362275fee3c3310dbec154c9c6afc9a9aa0820ad583450399d3ea2454c2140f` | 8,671,302 | `dd0a614e027216ee32cf8da9c258c6447e4c522ca6652962d58aec818cae5c0d` |
| Locals | `be5bd83e9eae6734115f8b48658808902379ed2f6ca374dde7ac26d07a8a9a6e` | 1,434,779 | `caa875c7b7b70ba26c5c671ae5d0ff54f5a5bc752aa26d0768ab417849dbcbac` |
| journals | `4f2ab049d6b2850893a70f8134656bc4eb944a6af9592d59ccd6c84926718150` | 889,587 | `e44c5469a6a78ee97fd2bebf83f1a7fd2bc76d0fc141fc8e185f5726053a6420` |
| codexes | `9a6885f0121744605c9eca32243f1b83bb8217fa4139b301660b7c1942c79605` | 686,090 | `8e4ae18ac4d14288ced1fd00ef98017687727ed3f061e5d5a3faa88a7eced065` |

Public documents contain derived notes and locators. Raw prose, managed code, original bundles and decoded tables stay in `~/.codex/research/vagrus/`. Temporary redundant ciphertext and generic resource-text exports were deleted after matching original bundles/plaintext were retained: 55,248,685 bytes removed, recorded in private `CLEANUP.json`. No install file was deleted.

Private provenance: `INPUT_RECEIPT.json`, `BUNDLE_COPY_RECEIPT.json`, `TABLE_RECEIPT.json`, `REPRODUCTION.json`, `CODE_READSET.json`, `INSTALL_INVENTORY.json`, `BUNDLE_SCAN.json`, `CLEANUP.json`, and `RETENTION.json`. Reproduce with `python3 ~/.codex/research/vagrus/reproduce_tables.py`; it uses the existing UnityPy tools interpreter and the separate Python cryptography runtime. Earlier extraction helpers were interrupted/superseded; use this checked reproduction route.

Extraction/indexing does not mean the whole corpus was read. [Coverage](COVERAGE.json) names reviewed fields, complete branch samples, unread stories, inaccessible/custom type trees and unrun runtime checks.
