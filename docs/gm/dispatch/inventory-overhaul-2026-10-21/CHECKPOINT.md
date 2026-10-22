# Inventory overhaul and combined publication, 2026-10-21

Human instruction: "Go ahead with the inventory overhaul and the remaining UI gaps that fit OOPS, using the base game and Proto23 as references. Fully integrate it into the latest combined Electron app and push and merge".

Owner: Check Discord research UI parity. Start HEAD e1a68873d; primary master is dirty/shared. Home and MF owners explicitly released runtime/test/docs paths for scoped publication; their handoffs and exact source manifests own dependency scope. Preserve other edits and private assets. No additional agents dispatched.

Rules: AD6–8/34/36/40/41, AR1–16, UR1–64, especially27/43/45/49/52. [Runtime](../../../ARCHITECTURE_RULES.md), [UI](../../../UI_RULES.md), [.claude UI](../../../../.claude/rules/player-ui.md). Surface: existing routine Inventory, its existing expanded reference/workbench and place-service chest. Seam: native DOM row decoration; existing shell injected operations; actual structured equipment projection; existing staged storage transaction/persistence owner. No new stock/save/clock owner.

Visible outcome: useful type/quality filters with honest counts; exact native variant rows and stable expanded companion; context-qualified structured gear comparison; reviewed atomic local-chest batch transfer with stale/custody/favorite handling. Preserve compact proportions, full Reports, exact item keys and ordinary native controls. Targets1920×1080,1800×1040,1536×864 at14/21px; mobile remains deferred. Party/cargo-wide stock redesign and universal power scores are outside this slice.

Reference: previously pinned Proto23 inventory renderer/isort, base YAIR native create_inventory_item_control/count/quality/action rows; current matched screenshots and inventory assessment. Adapt category/search density and persistent reading to OOPS rather than copying reference mechanics.

Verification selected before implementation: inventory/category/UI contracts, native storage transaction stale/borrowed/failed durable write, structured equipment wrong-body/fit/condition plus new comparison; full build/tests/arch/rules/rule-behavior on an isolated combined candidate. Fresh-origin native browser + spare Electron Save/reload/Export/literal Import,30+ mixed exact keys, expanded keyboard/filter/selection, review/cancel/stale batch then success, structured comparison/equip; six desktop/text cases. Finally verify the exact frozen build in the real normal Electron window. Publish from a clean export of the scoped combined commit, preserving optional local assets only in local installation. Guarded master integration and push origin/master are explicitly authorized.

## Delivered and published

I2–I5 are implemented and crossed through real browser/native consumers.2516/2516
full tests pass in the candidate and clean publication export; build, arch, rules
and36 behavior checks pass. Six desktop/text browser cases, two actual inventory/
equipment Save/reload/Export/literal-file Import journeys and six native Electron
font/layout cases pass. Exact native update/adoption and Electron restart retain
progress. The normal player window adopted frozen `v0.6-72af84cf8e66`, bundle
`e35668b1862220d8737de390ce4a9fc11c03fc2a441be72363bb06dd552c36d4`. All82 served files match,
including unchanged previously installed optional local assets; those private
bytes were excluded from Git publication. No personal save was read or injected.

Source payload `7df5a7df7bed374dc1b825fd14a507f514a19db6` was committed on the scoped
Codex lane, guarded fast-forwarded into master and verified on origin/master.
The final status receipt is a separate documentation change.
[Publication](PUBLICATION.json), [report](REPORT.md), [normal app](MAIN_ELECTRON.json),
[clean export](CLEAN_CHECKS.json). No technical merge/push/install gate remains
for this captured release. Human taste and natural pacing remain distinct.
Unrelated book-world/workflow/research/cleanup edits and all local artifacts remain
in the shared checkout; no stash/reset/force or broad staging was used.
