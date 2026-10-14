# Air workshop acceptance evidence

The report at `../reports/air-workshop.md` owns status. Target: 1366×768,
desktop/laptop first; mobile optimization remains deferred. Disposable origins
and native earned workshop state only. No personal saves are used.

Reproduce after `npm run build`, with the assigned server on port 18701:

1. Extract the legacy client in this worktree: `mkdir -p .proof-old && git archive 0216ccde index.html dist style.css styles assets resources locales favicon.ico | tar -x -C .proof-old`.
2. `node scripts/systems_workshop_legacy.cjs` creates a genuine absent-workshop save with the shipped 0216ccde bundle and checks its current load/reload/file import.
3. `node scripts/systems_workshop_browser.cjs` earns the complete workshop journey, using actual native inputs and Export/Import controls.
4. `node scripts/systems_workshop_boundaries.cjs` checks cancellation, failed storage, both wagers, forged import rejection and carrier absence.
5. `node scripts/systems_workshop_persistence.cjs` repeats exact earned-state reload and native Export/download/file Import.

Default ephemeral outputs: `/tmp/systems-workshop-proof`. The checked summaries,
desktop capture and build manifest are retained beside this file. Exported
workshop test saves are disposable test artifacts, separate from user saves.
