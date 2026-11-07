# HPLEAD report (2026-11-07)

CHECKPOINT: done. The clock hypothesis was wrong; the gate is the scene chain, and the reason now says how far along it is.

## Finding (SHOWN)

- Built the commands with `withHpLeadCast(packNative('book.hp.lead'), cast.json)` and listed every leaf of `requires`.
- `book.hp.lead.w1.night`, `w2.hunted`, `w2.bedroom` have no clock, day, hour or place leaf. Each `requires` is only an
  `all` of "this earlier act is completed or its knowledge is seen" pairs: night needs 7 earlier acts, hunted 8, bedroom 14.
  (Only `arrive_school` has a date gate, day >= 32, and it already carries a reason.)
- So "First: Get up and dress." was true (the first unmet scene) but hid that 6 to 13 more follow it.
- Pack not edited (content hash pinned); no private_packs file touched. Backup of hp-cast made anyway:
  `private/backup-2026-11-07/hp-cast.cast.json`.

## Change (display only)

- `src/structured_action_reasons.js`: `sequenceReason` appends how many more sequence scenes come before this one.
  Only reasons starting "First: " are counted; leaves of one `any` share a reason, so they count once.
- `tests/structured_action_reasons.test.js`: one new case (3 steps, counts 2 more / One more / none); old case fixture
  uses the same reason on both `any` leaves, as the real data does.

## Proof (SHOWN, headless, book.hp.lead, seed 1; clicked each enabled act in order, stepped until it finished)

- start (t=1920): night "First: Get up and dress. 6 more scenes come before this." / hunted "... 7 more scenes ..." /
  bedroom "... 13 more scenes ..."; all disabled.
- after Report to the director (last act before night): night ENABLED; hunted "First: Lie awake in the cupboard."; bedroom
  "First: Lie awake in the cupboard. 6 more scenes come before this."
- after night: night "This action has already been completed."; hunted ENABLED; bedroom "First: Leave the cupboard and keep
  out of the gang's way. 5 more scenes come before this."
- after keyhole (last act before bedroom, full run, t=3610): bedroom ENABLED. Every gate opened exactly when its last
  prerequisite finished, at arbitrary clock times, confirming no clock gate.
- Between acts the buttons are absent (the hero is at another place), not locked; unchanged behavior.

## Checks

- `node --test tests/structured_action_reasons.test.js`: 5 pass.
- hp_lead_life, hp_lead_window1/2/4, world_pack_hp, hp_school_progression, structured_*: 155 pass, 0 fail.
- `node scripts/check_player_text.mjs`: see final line in coordinator run (not baseline-changing; no pack text edited).
- Not run: `npm test`, `check:rules`.

## Left

- The reason names the next scene by its button label; it does not give an in-world time because none exists. If Weibao
  wants clock gates (for example "after breakfast, from 8:00") that is a pack change and breaks pinned hashes.
