# Exact engine authoring guide recovery

Completed 2026-10-07 by `/root/integration_map`. The proposed [recovered guide](RECOVERED_ENGINE_AUTHORING.md) contains the **exact 68,278-byte guide immediately before the accidental JSON overwrite**. Both recorded SHA256 checkpoints match:

| Guide version | Recovered SHA256 | Recorded owner |
| --- | --- | --- |
| Before home-world appendix, 65,206 bytes | `3816542038c7f29526688107731da47acbb453db3b4951ce3c8f4831737a9ebe` | [Home acquisition](../world-completion-2026-10-06/ACQUISITION.json), same care evidence digest |
| After home-world appendix, 68,278 bytes | `7dd0cfb6dc68544aeffe57d72b9f3c72aa648b256be611d34fb4ae9094938ef0` | [Home evidence](../world-completion-2026-10-06/EVIDENCE.json) before erroneous final overwrite |

Recovery began from the exact completed FileChange add at line 504 of the Oct2 engine session, timestamp `2026-10-03T02:58:09.458Z`. That complete original was 11,979 bytes, SHA256 `18531fbfa389f4680bbde57b989a898d9a65f1669c747487f5e2c55cc47193ca`. Later completed guide-only patches, literal appends, insertions and replacements were recovered through the home-world appendix. [Machine receipt](AUTHORING_RECOVERY.json) records session paths, lines, per-step fingerprints and reconciliation repairs.

The final reconciliation recovered the omitted Oct3 connected-modules block and its two API replacements, the inner chained custody replacement, the completed skills-build footer change and the exact reference-gameplay append. The master line 5305 readout was a heading search, so it was never treated as complete guide text. All recovered text and anchors are historical literals; no old prose was invented.

Historical commands were parsed only as data. No historical shell, Python or JavaScript was executed. This lane wrote only these three recovery files, leaving the original guide, shared source, libraries, saves, builds and previews untouched. Root preserved the 14,240-byte bad JSON in [before-state](BEFORE_CANONICAL.json). The bad write at home session line 1143 reused `p` from a document loop and is excluded from guide reconstruction.

Root owns the canonical restore: copy the recovered bytes to `docs/ENGINE_AUTHORING.md`, then add current book-world authoring notes and check canonical links/anchors. Internal guide links retain their original relative paths and resolve from `docs/ENGINE_AUTHORING.md`; this proposed artifact intentionally preserves exact bytes. There is no remaining recovery gap, running recovery process or pending mutation. Recovery ownership is released.
