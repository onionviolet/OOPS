# R22 checkpoint: combat log, 2026-10-17

Saved before editing. Session: Claude (UI main chat after R21c), worktree
`.claude/worktrees/ui-r22-combat-log`, branch `claude/ui-r22-combat-log` from
`codex/gameplay-foundations` at `26eacdd15` (R21c merged). Queue row R22 in the
[Round 15 plan](next-parts/round-15-whole-plan.md); Part 2 Log in
[NEXT_PARTS](NEXT_PARTS_2026-10-15.md) (R1, W3, UX18, C2, C3, A5, IL55, IL60, KL19); B6 milestone
lines; BX7 Report colors from the [R21 feedback](next-parts/r21-feedback-2026-10-17.md), folded in
(Weibao: "start" after the proposal to fold it). Rules: UR11 (log column intact), UR13, UR16, UR18,
UR37 (not color alone), UR48, UR52; AR1, AR3, AR9, AR14, AR15 (IT9 seam); AD36 verification.

## Task record (UR18)

- **Surface:** the Reports column (`#message_log_div`) in the parity shell, the default presentation.
  The classic presentation keeps its native text (the `log-original` branch).
- **Targets:** 1920×1080 primary, 1366×768 floor at 14px and 21px.
- **Visible outcome:** in a fight with 3 or 8 opponents, each combat line says who acted on whom,
  with the opponent's board letter when the fight has more than one; dealt and taken read apart by
  wording and by value color; misses and blocks are quieter; adjacent equivalent lines collapse to
  one line with ×N that expands to its occurrences; defeats stand out as milestones; each report
  kind has its own left rule and label color, also under a custom palette.
- **Deferred:** knowledge-gated names and numbers (R30, Part 4), hit splats (L3), Reports category
  tabs (R23), log history persistence (W3: none), a combat screen rework (BX6).

## Live facts (stated, from source, before)

- Combat lines come from `src/models/combat.js` `doCombatAction` (block, evade, hit, defeat) with
  `target.name` only; a hit on the hero names no attacker, so "Hero takes 3 physical" never says
  which opponent hit.
- `src/display.js` `log_message` builds an original and a compact branch (`compact_log_target`,
  regex on the text), then colors names and numbers by regex (`decorate_log_subjects`).
- Board letters: `src/opponent_board.js` `letterFor(slot)`, slot = defender index (R20). The log
  has none.
- Custom palettes force every log token to `--custom-text` (`styles/ui_tokens.css:1019,1063`).
- The log is not saved (W3); filters are.

## Plan (proposal)

1. New leaf `src/combat_log.js`: an event snapshot built at emit time (encounter serial per Combat
   object, actor and target with side, slot and letter, outcome, amount, hits, critical, partial
   block), the compact line renderer, and the UX18 equivalence key. Letters reuse `letterFor`
   (one authority).
2. `combat.js`: each of the four `log_message` calls passes `details.combat` from that helper. Text,
   RNG draws and order unchanged.
3. `display.js`: when `details.combat` is present the compact branch comes from the renderer, and an
   adjacent equivalent line in the parity shell increments that line's ×N instead of adding one; the
   ×N button lists each occurrence with its in-game time. Counts, follow, unread, Stop/Resume and
   Clear keep their meanings.
4. `component_themes.js`: role tokens (dealt, taken, ally, hostile, defeat) recovered for contrast
   against the custom background. New `styles/combat_log.css` for the tokens and kind rules.
5. Checks: unit test for the leaf (key, letters, wording), seeded RNG unchanged (same fight, same
   snapshot before and after), npm test, check:arch, check-r20, check-r21; captures before/after at
   the three targets on populated-three and 8-mixed; contrast on the real log fill and a custom
   palette.
