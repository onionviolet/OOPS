# V2 resume 1: replay driver waits are too short for the whole-book pack

With the whole-book pack (1,500 people; browser pack load about 16 s on an idle machine, longer under load) the be-seat replay run
ends with `UI proof incomplete`: `locator.waitFor: Timeout 30000ms exceeded` waiting for `#loading_screen_play_button` to be visible
(`scripts/headless/lead_runs/lotm_ui_replay.mjs` around line 259). Replace the fixed 30 s waits for page-ready and play-button
visibility (every page-load wait in the file, including after each reload) with one named constant, default 180000 ms, overridable by
`--ready-timeout-ms`, and keep every other timeout as is. Also record, in the audit, `packLoadMs` per run (time from navigation to the
play button) so slow packs show up in the receipts. Grants: `scripts/headless/lead_runs/lotm_ui_replay.mjs`,
`tests/lead_replay_score.test.js` (only if a test pins the old constant), `cast-lives-lanes/V2_CHECKPOINT.md` (append "Resume 1", one
line per check). Run `node --test tests/lead_replay_score.test.js`. You cannot run Chrome here; the coordinator will. Do not commit.
