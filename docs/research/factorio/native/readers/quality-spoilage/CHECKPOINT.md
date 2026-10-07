# Quality and spoilage reader checkpoint

Status: **completed and released**, 2026-10-07. Former exact writer `/root/factorio_native_successor/native_quality_dlc_reader`; integrator `/root/factorio_native_successor`. The bounded native-to-installed reading is complete. The same full Factorio recovery objective continues under the parent.

Released exact reservations:

- `docs/research/factorio/native/readers/quality-spoilage/`
- `/Users/weiwei/.codex/research/factorio/native-23347942/reader-work/quality-spoilage/`

Delivery is [REPORT.md](REPORT.md) and [FINDINGS.json](FINDINGS.json). Eleven complete arm64 bodies, one additionally scoped helper, eleven reviewed claims, 1,515 decoded instructions, 1,271 generated C lines, fourteen exact installed file/API/info hashes matched to live source files, and twenty-seven selected API entries. Every claim retains C/body identity, C-line and instruction/xref locators, installed file hashes/lines/version, API JSON pointers, observed behavior, inferred field bindings and original YAIR implications.

Private verification artifacts and exact extracted bodies stay in the released private reader scope: `verification.json`, `verification-summary.json`, `installed-verification.json`, `final-coverage.json`, per-entry `record.json` / `recovered.c`, and the reproducible `build_report.py`. Public artifacts include no raw recovered C/body bytes. Five assigned frozen views exactly matched fresh schema2 chunks; all eleven complete body/C hashes and qualification chunk4/5/6 hashes verified. Scoped parent helper100741abc matched chunk7line78 and its closed receipt.

Important integration limit: canGiveProducts100741abc forwards the ingredient spoil scalar unchanged; canGiveItemProduct101559374 has no product-offset read/addition in any of its129 instructions; giveProducts10073ec44 adds product+0x34 at10073ef78–84. This helper-level asymmetry is verified, but no runtime bug is claimed. Native expiry can convert material, clear a stack or dispatch an egg trigger. Trigger helper/Item::spoil internals and unknown virtual consumers remain unreviewed here.

Parent retains caller/interface integration, native shared owners/index/exporter and full both-architecture recovery. Parent reviews fresh CraftingMachine10073e2e4 and canGiveProducts100741abc, including supplied tick/fraction, energy/progress and completed-output retention. This reader releases ownership and leaves no background child, analyzer, shell process, game execution, gameplay change or acceptance suite running.

Later source gaps and deferred playable acceptance are listed in FINDINGS and REPORT. No reader packet/batch boundary closes or reduces the parent full goal.
