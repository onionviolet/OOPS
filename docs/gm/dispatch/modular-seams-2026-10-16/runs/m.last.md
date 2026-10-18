M1 and M2 passed and are committed. M3 stopped under the two-failure rule; M4 was not started.

- **R1:** M1 `9e089696`, M2 `4498c8e6`. Both passed `npm run build`, `npm test`, `npm run check:arch`, and rebuilt 1366×768 browser comparisons covering Save, reload, Export and literal Import. M2 also passed two-domain persistence and old-save checks.
- **R2:** M3 candidate `c5f2ff6e`; checkpoint `3b24c469`. The launcher correction exposed a second blocker: Gather remained disabled. Crafting gameplay and persistence remain **implemented-unverified**. The final styling correction passed focused tests but has not been rebuilt or fully retested.
- **F1:** Passing rounds removed **160 main lines and 9 display lines**. Including M3, net counts are **main −152, display −9, save_files +1**. M3 added **8 / 0 / 1** lines respectively, exceeding AR1’s main target for native-operation registration and generic item-use dispatch.
- **F2:** Merge reconciliation remains around core imports/state, save/load/ticks, item use, decoding and effect restoration. Shared checkout and personal saves are untouched. No push or merge back; worktree clean and preview stopped.
- **F3:** Rule feedback: the missing native item-use/transaction seam caused AR1 excess. The referenced assessment and `UI_RULES.md` were absent; no standing rules were changed.

Full evidence and open gates: [CHECKPOINT.md](docs/gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md).