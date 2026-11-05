# Progress atlas

Retained from the November 4 foundation assessment. This is an interactive historical assessment, not live gameplay or a current implementation queue. The frozen data, preview, input manifests and visual results retain their original dates and proof scope.

From the repository root:

```sh
python3 prototypes/progress-atlas/build_data.py --out /tmp/oops-atlas-candidate
python3 prototypes/progress-atlas/write_report.py --data /tmp/oops-atlas-candidate/atlas-data.json --out /tmp/oops-atlas-candidate/report-draft.md
node prototypes/progress-atlas/check_visual.cjs
```

The visual check uses a hidden browser and writes its results beside this preview. Open `preview.html` through a local server for manual inspection. The data builder uses current register rows plus the retained historical assessment text; regenerate into a separate candidate and review freshness before replacing frozen artifacts. The report writer produces a draft and does not overwrite the reviewed report.

Owner: [refined assessment](../../docs/reports/PROGRESS_ATLAS_REFINED_2026-11-04.md). Former local path: `work/progress-atlas-refined-2026-11-04/`, retained as a local compatibility symlink. `history/close_refresh.py` preserves the one-time patch history; it is not a supported regeneration command.
