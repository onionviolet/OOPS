# G1 fix round (coordinator, 2026-10-28)

Your G1 work passed review on source, focused tests (20/20), the full suite (3698/3698 with your code and the
applied `G1_INTEGRATION.patch`) and `check:arch`. The coordinator applied the integration patch to
`src/book_world_lotm_host.js` and `src/main.js`; you now own those two hunks as well. The browser floor at
1920×1080 found one blocking defect (F1). A second run measured 289 s for the same wait.

**F1. Waiting freezes the page.** In a fresh beside life, "Wait until dawn · 349 min" blocked the page for
268 seconds (about 0.77 s per one-minute `update_timer(1,'wait')` step; measured with a DOM click and
`performance.now()`). A player sees a hung browser for four and a half minutes.
Fix within the same seam (no second clock, AR3): advance in as few `update_timer(n)` calls as the clock owner
allows, stopping only where something can change the wait: the next due cast beat time (so a present player
still witnesses it at exactly `at === state.clock`, which `planLotmCastBeats` requires), the target time,
and the existing interruption checks (asleep, busy, not writable, moved). Keep the one-minute fallback only if
a step returns a different minute count than asked. Target: the 349-minute wait finishes in under 3 s of real
time in the browser, and the witnessed dawn beat still writes the player's knowledge.
Add a focused regression: a 349-minute wait over a fake clock calls `advance` fewer than 20 times and stops at
each due beat minute.

**F2 (closed by the coordinator).** A Save, reload, Export and Import after the wait kept the beat
knowledge; the only difference was the natural clock running between reads (a harness artifact).
No action needed.

Owned files: as in your brief, plus the two applied hunks. Do not commit. Finish with the short report and
update `G1_CHECKPOINT.md`.
