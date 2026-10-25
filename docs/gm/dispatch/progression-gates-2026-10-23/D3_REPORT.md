# D3 report: original-world overflow pilot, Mistglass (2026-10-23)

Brief: [D3_BRIEF](D3_BRIEF.md). Built on the frozen [D1_INPUT_RECEIPT](D1_INPUT_RECEIPT.md) (package applied to HEAD 547209e82, `skill_overflow_domain.js` sha256 prefix c4157ab7d7b49f8c matched). Worktree `.claude/worktrees/d3-overflow-pilot-9433a4`, branch `claude/d3-overflow-pilot-9433a4`. Nothing committed, pushed, published or installed. Everything here is a **proposal** (original world, authored mechanism, not canon).

## Choice

Consumer: the Mistglass purification trial's 30 Meditation XP. It is reachable (Projects panel in a fresh game) and it is capped today by `p00NativeSkillXP` in `src/main.js` (`min(xp, xp_to_next * 0.1)`), a separate copy of the single-gain cap that never reaches `settleCappedSkillGain`. The excess was silently lost. So the GTL6 world table could not see this world; the missing seam was the native quote path, not a missing reserve.

Row (`SKILL_EVENT_OVERFLOW['p23.mistglass#purification']`, GTR29 event-keyed): **converted**.
- Default: surplus insight settles into the selected drill's practice minutes at **5 insight per minute** (dial `xpPerMinute`), remainder carried.
- Reason shown to the player: a purification teaches more than one sitting holds; the surplus settles into the drill being practised.
- Cost / fade: open-mist absorption has no drill, and an Integrated (48 min) drill has no further stage, so the surplus fades and is counted as "faded".
- Effect that matters: practice stage (16 / 48 minutes) raises condensate throughput, so the conversion has a real consumer.
- Other Mistglass skill gains keep the stated loss (`skillEventOverflowRow` falls back to the world row, `lost`). GTO6 (reserve clamp) and GTO7 (48-minute track itself) are unchanged.

## Files changed (all additive; D1-owned files only gain the export)

- `src/skill_overflow_domain.js` (D1 file): `SKILL_EVENT_OVERFLOW`, `skillEventOverflowRow`. Existing rows and `settleCappedSkillGain` untouched.
- `src/main.js`: `p00NativeSkillXP(id, amount, report)`, optional report callback; line count unchanged (check:arch growth 0). Other callers (reading, teaching) pass nothing, so unchanged.
- `src/absorb_p23/host_joins/world_adaptation.js`: `applyPlan` collects the reported surplus for `p23.mistglass.trial.*` effects and settles it into the saved state in the same plan (atomic with the XP and dose effects).
- `src/absorb_p23/world_adaptation/techniques.js`: optional `insight {carry, lost, minutes, last}` on the saved techniques record, `settleInsight`; `validateCultivation` accepts it. Saves without it load as before.
- `src/absorb_p23/world_adaptation/index.js` (export), `host_joins/world_adaptation_ui.js` (panel line and trial preview text).
- Tests: `tests/p23-world-adaptation.test.js`, `tests/p23-host-joins-world-adaptation.test.js`.
- Evidence and handoff in the dispatch folder: `d3_mistglass_check.cjs`, `d3-mistglass-panel-1920.png`, `d3-overflow.patch` (HEAD-based, no D1 files), `d3-skill_overflow_domain-hunk.txt`.

## Receipts (sha256 prefix of worktree files)

```
932647c912e69015 src/main.js
30c893a8decf07b9 src/skill_overflow_domain.js (D1 base c4157ab7d7b49f8c + event-row hunk)
94e8b1aa331fa914 src/absorb_p23/world_adaptation/techniques.js
0d7bc04b67d22b7b src/absorb_p23/host_joins/world_adaptation.js
e51f6b0a30a306f5 src/absorb_p23/host_joins/world_adaptation_ui.js
a77dd0a3322995720 src/absorb_p23/world_adaptation/index.js
567750f3c33e9ab3 d3-overflow.patch
```

## Checks (one line each)

- `node --test` p23-world-adaptation, p23-host-joins-world-adaptation, skill_overflow, progression_gates, micro_p1_xp, chain_inspector: 50/50 pass. Covers conservation (`minutes*5 + carry + lost == excess`, including carry across events), fade at open-mist and at 48, unchanged other-gain row, legacy techniques shape (no `insight`) validates, invalid insight refused, host path: capped quote reports surplus and the saved drill takes it, uncapped quote leaves no record. Slice only; full `npm test` not run.
- `npm run build`: success.
- `npm run check:arch`: exit 0, main.js growth 0, display.js -50.
- `npm run check:rules`: 1 failure, `docs/PROGRESSION_GATE_RULES.md` has no row in the rules register. Not caused by D3; the register is a shared-doc hunk owned by the reconciliation lane (D1 receipt "Excluded").
- Browser, rebuilt bundle, headless 1920x1080, fresh origin, own port 19931 (stopped): `MXP=20 node d3_mistglass_check.cjs` reached the conservatory by the real route, bought a dose, ran a real trial. Meditation 20 -> 40 (capped at 20, not 30). Panel: "Insight past one sitting settles into practice (converted): 2 practiced minutes so far, 0 insight held, 0 faded. Last purification: 10 surplus -> 2 minutes." Saved `techniques.insight` identical after save, reload and file import; Meditation 40 after each; console errors `[]`. Passes: 3 of my runs plus the worker's runs; 2 runs failed on harness steps (trial button disabled while the player was mid-work, first Projects click timeout); the wait loop in the script now covers the first. Screenshot: `d3-mistglass-panel-1920.png`. Gap: the failure path (rawness) and a full Integrated fade were not exercised in the browser, only in unit tests.

## Proposal status and remaining gates

- Proposal status: all of the above. Weibao has not accepted the row or the 5 insight per minute dial.
- Not done: AD/rules-index register rows and USER_VISION/PROJECT mention (shared docs excluded); the overflow doc's GTO6/GTO7 rows still describe Mistglass as unconverted and need an update by their owner; GTO6 (reserve clamp) and GTO7 (minutes cap) remain lost; the standard `settleCappedSkillGain` has no converted executor (this row lives in the native quote path by design).
- Receiving owners keep their combined gate. Apply order: D1 package, R3 herb fix, then `d3-overflow.patch` plus the domain hunk.
