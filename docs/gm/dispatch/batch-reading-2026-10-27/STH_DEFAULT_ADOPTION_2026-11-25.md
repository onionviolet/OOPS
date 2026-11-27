# Small-Town Hero default Atlas check

AD36 / AU11 count-only acceptance receipt, 2026-11-25. After the coordinator adopted the one-world refresh, a clean headless Chromium session exercised the normal default Atlas at 1366×900. Snapshot, reader-root, handoff and rebuild overrides were removed. No source, registry, snapshot or measurement output was written during the check.

| Normal output route | Source rows | Exact matched rows | Unindexed | Withheld | Parse/read errors |
| --- | ---: | ---: | ---: | ---: | ---: |
| `#library/outputs/sth/sthc029/people/people` | 35 | 29 | 6 | 0 | 0 |
| `#library/outputs/sth/sthc029/people/other` | 10 | 10 | 0 | 0 | 0 |

Both normal pages displayed Manual structured reading with scope `en b1 c29 p1` through `en b1 c30 p35`. Both API projections verified the file method with provider unknown. The original paid request remains an errored attempt; this check does not relabel it as a successful provider response. The six unindexed rows remained unlinked. Existing linked entities can still show no confirmed file locator, as recorded in the earlier candidate receipt.

Tested default identities:

- Snapshot SHA256 `b0983bb677fbea94ebd9f0652c497e5abc44ff40ac3fe3960e949763cb27fe2d`.
- Small-Town Hero digest SHA256 `96e1060c4868a0b40624fd041c28fb01cc8ec4da8232b3346b73319df76722d8`.
- Separate private default-browser proof SHA256 `06101969ecc8abbcd08f36558b96d4dfd10dc4bb60ffb530caa4cd433a755c4e`.

The normal browser check passed with zero page errors and exit 0, including teardown. The desktop screenshot was visually inspected. Hash guards verified that the three promoted source files, default snapshot/digest and earlier candidate/provenance evidence were unchanged. Script syntax and the document slip check passed. No full measurement or global sweep ran. Agent-verified, not human-reviewed.
