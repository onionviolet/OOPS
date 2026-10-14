Completed ER7. [Research report](/Users/weiwei/code/yet-another-idle-rpg/docs/research/ENGINE_SPIKES_2026-10-14.md) and [lane report with scripts/results](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/engine-runtime-2026-10-14/ER7/REPORT.md).

- **ER7-F1:** ECS showed no universal speed advantage; active filtering and loop style mattered.
- **ER7-F2:** Cheap buffer transfer did not remove full JSON step costs.
- **ER7-F3:** Gzip cut synthetic save bytes by about 93%; SQLite’s benefit came from small updates.

S1–S3 passed correctness checks across 70 measured rows. S4 links ER1’s existing work. Browser and durability gates remain open. Repo runtime/package files were untouched.