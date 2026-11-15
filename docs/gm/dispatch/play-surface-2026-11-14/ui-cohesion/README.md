# UI cohesion captures (2026-11-14)

Headless Chrome at 1920×1080, fresh origin each. "Before" is HEAD `ab42c5d99` (before the slice); "after" is a clean build of HEAD `6a9d432cc`. Agent-verified, not human-reviewed. The audit rows are UIC250 to UIC261 in [the UI audit](../../../../audits/UI_DESIGN_CORE_AUDIT.md).

| Capture | What to look at |
| --- | --- |
| `before-mid-home.png` / `after-mid-home.png` | perf-mid, Here. The clock, weather, work and save state move from the place header and the top bar into one status line, with the day strip under it (B, F). |
| `before-mid-stats.png` / `after-mid-stats.png` | perf-mid, Stats. The selected attribute moves to the left column under a vitals strip; the stat grid and Condition step aside; the list takes the centre (A). |
| `before-gu-home.png` / `after-gu-home.png` | The Gu keeper (`gu-fed-second`): the status line carries the world's reserve, "Rank-one primeval essence 11/12". |
| `after-fang-yuan-ready-hub.png` | Fang Yuan (`ri-fang-yuan-ice-crystal`, his day adopted): "Ready now · 2 ready · 1 close" lists his Gu's missed meals and the White Jade Gu's food gap (D, PS57). Taken before the hub moved above the action list (f516788e4). |
