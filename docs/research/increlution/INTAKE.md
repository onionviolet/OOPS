# Increlution intake

Section A, Steam library wave 2026-10-10. Source-only audit, completed against installed build 11640258. App 1593350 manifest was StateFlags 4, fully downloaded; waiting protocol was not needed.

**Seen in data or code:** actual engine is Electron, not the expected Unity. `package.json` names Gniller and Electron ^9.1.2; `main.js` loads `electron-index.html`. Dependency version is a package declaration, not proof of the bundled runtime version. Gameplay is obfuscated JavaScript in `gniller-min.js`, with HTML tutorial and tooltips. Embedded build label: 6 July 2023. No claim that this is the newest available release.

Install: `~/Library/Application Support/Steam/steamapps/common/Increlution/`; useful inputs: `Increlution.app/Contents/Resources/app/`. Manifest reports 217,820,661 bytes installed. Disk check before work: 6.6 GiB free.

Read AGENTS.md, PROJECT.md, accepted RULES_FROM_SCRATCH.md, dispatch shared rules/unbiased lens, Tale of Immortal extraction method and its referenced life-sim method. Read the named north-star sections on persistence/loop, random next life and heirs/families. Older uninstall instructions are superseded by this assignment. Existing dirty YAIR work was inspected and preserved.

## Retention and reproducibility

Eight selected files, 1,239,536 bytes total, copied to `~/.codex/research/increlution/source/`. Each copy initially matched SHA-256 of its installed original. Full receipt: `~/.codex/research/increlution/RETENTION.json`. Proprietary source and decoded text stay outside git; repository contains derived analysis only.

Static recovery: rotate the 2,624-entry base64 string table by 107 positions, following the bootstrap's increment and shift loop; replace literal decoder calls, normalize numeric hex literals, then format with jsbeautifier. No installed code was executed. Obfuscated local identifiers remain. See private `decode.py`, `decoded.js`, `decoded-strings.json`, `EXTRACTION_RECEIPT.json` and `TABLE_INDEX.json`. Python formatter dependencies were installed only in this game's private research/tools folder. This is readable recovery, not a claim of semantic equivalence proven by execution.

All gameplay locators in FINDINGS refer to the reproducible private `decoded.js` (18,037 lines), named function and/or numeric table ID. HTML locators refer to retained `source/electron-index.html`, whose line numbers match the install. Hashes below bind this exact source version.

| Retained file | Bytes | SHA-256 |
|---|---:|---|
| `gniller-min.js` | 1066222 | `48df93af5bfc0a16eed01a6d5cb385316bdfda318e2aee008ca438a8bd8ca529` |
| `electron-index.html` | 95715 | `ccd62bf1fe7dd59604dcaae55fd745bfa2b6b5759c93eddbb7eb2b3d8f4ae17e` |
| `main.js` | 4896 | `bd9533f7095da518e81f6d943bc5454b732bbbfed17245cffe541cd7edc8f0d9` |
| `package.json` | 1075 | `42d2097a23a0a828630056f53629f7a00f1b32fa9d9ad52445d4a9a6e2c408be` |
| `gsrv.css` | 31855 | `47c96ef42ff2a34fd2a16ae78bb17f8ea1b998e3a5eaef72a412c0c4bf3f1b26` |
| `copyright.txt` | 301 | `52ea843d4e710b48d21ca3eb78c09c005b70f464636a715f57575f9b2503bf35` |
| `helpers/ad-notations.min.js` | 22928 | `9b0d6b7f15c21e25a47870c605eb87164a6d7d909b33c143bf6cd0817078978e` |
| `helpers/break_infinity.min.js` | 16544 | `22dc376d684ba913a4de9c3a3631fee7af8f2cde21f7ec15c65d5d56c4e0952e` |

No game launch, save read, settings access, native UI operation, uninstall, YAIR source edit, build or commit. No extract exceeded 200 MB; no disk wait was triggered. The install remains available for Weibao to remove.
