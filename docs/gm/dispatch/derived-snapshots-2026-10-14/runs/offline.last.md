Wrote the [audit](/Users/weiwei/code/yet-another-idle-rpg/docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) and [checkpoint](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/derived-snapshots-2026-10-14/offline/CHECKPOINT.md).

- **F1:** General time advances per callback; no automatic load catch-up was found. Prepaid packing has a narrow, explicitly reviewed wall-time mechanism.
- **F2:** Report includes 14 findings, 13 save-field groups, all OT1–OT10/BR6 gaps and four suggestions.
- **F3:** Existing focused tests passed: **51/51**. Browser throttling and native save acceptance remain unverified.

No code or saves changed; no staging, commit or push.