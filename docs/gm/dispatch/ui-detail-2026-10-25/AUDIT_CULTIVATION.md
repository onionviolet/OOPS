# D1 cultivation and production UI audit, 2026-10-25

Scope: Mistglass cultivation, native gear workshop, crafting and production UI. Read-only lane; no runtime or save changes. Rules consulted: AD34, UR1–UR7, UR9, UR11, UR14–UR17, UR21–UR25, UR33, UR41–UR49, UR59–UR64, MR11 and the D1 shell instruction. Research reviewed: `PROTOLIKE_DISCORD_SWEEP_2026-10-24.md`, itch batches `BATCH_CRAFTING.md` and `BATCH_CULT_REST.md`, and `cultivation-spacing-2026-10-22/CHECKPOINT.md`.

## Ranked findings

No defect is ranked from this partial pass. The captures did not reach the requested production panels or the fully enrolled Mistglass cultivation state, so they cannot support claims about their rendered behavior.

## Verified blockers and evidence

The intended fixture route requires the declared prerequisite setup used by the existing combined gear UI harness: set `seed.availabilities.dialogue.oldCraftsman=1` and `global_flags.is_crafting_unlocked=true`. Natural prerequisite earning is not required. The first attempt looked for `#simulation_panel`, which was absent because the craftsman had not been discovered. Its fallback clicked `[data-p23-local="enrollLeisure"]`, which opens optional target-dice practice, not simulation enrollment. The subsequent Mistglass image is an entry/proposal surface and is not proof of learned cultivation.

The capture harness also uses a nonexistent selector, `#workspace_navigation select[aria-label="Other known panels"]`. After Mistglass stayed selected, it wrote that same screen under the workshop and crafting output filenames. Those files are invalid and must not be cited. See [static partial receipt](evidence/before/cultivation/static-partial-receipt.json). The correctly named Mistglass images are still proposal/entry-only views: [1920×1080](evidence/before/cultivation/mistglass-1920x1080.png) and [1440×900](evidence/before/cultivation/mistglass-1440x900.png). They do not establish the intended enrollment/learn route.

Earlier attempts used temporary rebuilt bundles and yielded incomplete or mislabeled images. `receipt.json` is an older receipt and does not describe the current files. No current static-bundle screenshot proves gear workshop, herbal crafting or Practical works at both requested viewports. A complete audit still needs a corrected declared fixture, verified navigation selectors, and six valid static captures.

## Source review and runtime files to recheck

These are inspection targets, not confirmed defects:

- Mistglass presenter: `src/absorb_p23/host_joins/world_adaptation_ui.js:20-45` lays out reserve, method, trial, sluice, path-work and history content. Inspect actual enrolled cultivation at both desktop viewports before ranking density or reachability concerns.
- Gear workshop: `src/gear_workshop_panel.js:43-48` renders preparation options and their reasons. Earlier temporary-build output suggested repeated prerequisite text, but the screenshots in the evidence folder no longer verify that claim.
- Herbal crafting: `src/crafting_home.js:24-68` combines material selection, quote, sample examination, notebook and products. Inspect the populated panel before ranking scrolling or grouping concerns.
- Practical works: `src/field_works_ui.js:51-57` and `src/field_works_extension_ui.js:11-26` are source-only targets pending a rendered production view.

## Shared-primary overlap

The primary checkout had active edits in `src/absorb_p23/host_joins/world_adaptation.js`, `src/absorb_p23/host_joins/world_adaptation_ui.js`, `src/absorb_p23/world_adaptation/techniques.js`, `src/mistglass_path_work.js`, `src/gear_workshop_domain.js`, `src/gear_workshop_panel.js`, `src/main.js`, and `src/crafting_home.js`. No active primary edits were reported for `src/field_works_ui.js`, `src/field_works_extension_ui.js`, `src/mixture_ui.js` or `src/hp_brewing_panel.js`. These are distinct from the rendered baseline: the static bundle at HEAD `3dfc49cf3` was not rebuilt, and the worktree itself also contains active edits in `src/absorb_p23/host_joins/world_adaptation_ui.js`.

Exact command used: `git -C /Users/weiwei/code/yet-another-idle-rpg status --short -- <named runtime paths above>`.

## Files and verification state

- Capture harness: [`scripts/playtest/d1-audit-cultivation.mjs`](../../../scripts/playtest/d1-audit-cultivation.mjs). It uses `scripts/playtest/lib.mjs` (`Session`) and `scripts/ui_helpers.cjs` through that library. It still needs its fixture and navigation selectors corrected before reuse.
- Browser: one disposable session on `http://127.0.0.1:5101/?test_hooks=1`; closed and slot released. Browser/local-storage state was disposable; primary saves were untouched.
- Static screenshots: two proposal/entry-only Mistglass images; not learned-cultivation proof. Other current capture paths are invalid; older `receipt.json` is stale.
- Runtime edits, commits and saves: none.


## Coordinator verification, 2026-10-25

The parent completed the native route with declared public fixture prerequisites (crafting, introduced craftsman). The simulation player was already enrolled, so its hidden enroll button was correctly skipped; `enrollLeisure` is unrelated dice practice. The Other known panels selector is valid. Native Mistglass entry/learning/practice/reload, real workshop and herbal panels were captured at both sizes in `evidence/{before,after}/journeys/`. Original harness failures and overwritten/mislabeled captures above are not final visual evidence. Repeated workshop prerequisite text was confirmed and is now grouped by the existing quote reason. See CHECKPOINT D1-C2/C3/C4 and the canonical comparison index.
