# Prompt: decide the next YAIR UI work, then build the first slice

2026-10-15. Written at Weibao's request ("make prompt to figure out what ui stuff to do
accordingly?"). Paste everything below the line into a fresh Claude or Codex session in
`/Users/weiwei/code/yet-another-idle-rpg`. This prompt is an index: the owners it links
outrank it, and nothing it lists is accepted direction unless an owner says so.

---

You are continuing YAIR's UI work for Weibao, the creative director. Figure out which UI
work matters most now, rank it, save the plan, then build and verify the top slice.
Reasonable reversible taste choices are yours to make; label them as proposals.

## 1. Recover state before deciding anything

- Read `AGENTS.md`, then the UI parts of `PROJECT.md` and `docs/USER_VISION.md`
  (Standing UI priority 2026-10-13; Calmer Vivid 2026-10-14; Parity keeps YAIR-specific
  reasons 2026-10-15), then `docs/UI_RULES.md` in full (UR1–UR49).
- Read in `docs/gm/dispatch/ui-foundation-2026-10-15/`: `PARITY_INTENT_2026-10-15.md`
  (K/N/A/B/M codes), `R13_REPORT.md` (including the dedupe pass, DD/BO codes),
  `R12_REPORT.md`, and `CLAUDE_HANDOFF.md` for Weibao's original UI requests U1–U11.
- Expected state, verify it: branch `codex/gameplay-foundations`; `94f5059` (R12) and
  `58b34e6` (UI foundation R1–R11) committed; R13 + dedupe **uncommitted** in
  `src/village_workspace.js`, `src/center_modes.js`, `src/workspace_navigation.js`,
  `src/workspace_layout.js`, `styles/ui_tokens.css`. Frozen candidates: R11 on 19171, R12
  on 19251, R13 on 19253 (`~/.codex/candidates/`). If any of this differs, trust the live
  tree and say so.
- The shared tree holds other lanes' uncommitted work (continuation, story aftermath,
  simulation clock, hero parking). It currently breaks `tests/cheat_awakening.test.js`
  3–4; that is theirs. Check live sessions and file reservations before editing; one
  writer per file area; never reset, clean or stage everything.

## 2. Look at the game the way the player does

Build, serve the working tree on a new free loopback port, and capture a **state matrix**
at 1366×768 (14px and 21px text) plus 1920×1080 21px, on synthetic saves only:

| State | Source |
| --- | --- |
| Idle Village, populated | `evidence/parity-r3/populated-multi.save.txt` or the calm-vivid populated fixture used by `r12-regress-lib.cjs` |
| Each top-bar destination | `check-r13-sweep.cjs` (extend, don't fork) |
| Crafting with a ready and a blocked recipe | `evidence/r12/cooking-fixture.save.json` |
| Three-enemy fight | `evidence/parity-r9/populated-three.save.txt` |
| A long, populated Reports stream | find or make one; UR44 says judge the log on a live stream, not startup notices |
| Trade, dialogue, reading or a running activity | at least one; none has had a parity pass |

For each state note what the player can see, do and find without scrolling (UR14,
UR25), what repeats, what is empty, what is cramped and what is hidden behind a click.
Compare against Proto23 captures in `evidence/parity-r7/proto23-*.png`. Do not re-audit
Proto23 source; R7_AUDIT and `docs/research/proto23/` already cover it.

## 3. Classify before ranking

Every candidate gets one label, using UR49:

- **Kept on purpose:** has a recorded reason (PARITY_INTENT K1–K9 or an owner). Only the
  Proto23 lesson inside it may change.
- **Defect:** contradicts an accepted rule or Weibao's request (e.g. a view that scrolls
  where UR25 says it must not).
- **Gap:** no recorded reason, and a Proto23 or YAIR lesson would help.
- **Weibao's call:** taste or default choices that change how play feels, such as hiding
  header controls (BO6) or which view is a default.

Existing candidates to re-check, not assume: N2/N3 (footer and top-bar labels),
A2 (equipment slot grid in You), A3 (log line richness), A5 (inventory category tabs),
A6 (skills table), B3/B4 (context stat sets and one priority list per region), B5
(recipe row readiness), B7 (temperature linked to You), B9/BO3 (grouped top bar), BO1
(service chips that add a fact), BO2 (short place text), BO4 (two-column settings), BO5
(trip tally from log events), M1/M3/M4 (shared scenarios, generated comparisons, flaky
hover wait).

## 4. Rank and save the plan

Rank by: how often the player meets it × how much it hurts or helps × how cheap and
reversible it is. Defects in frequent views first. Separate **ACT NOW** (next slice),
**ACCOUNT FOR NOW** (constraints the slice must respect) and **LATER** (saved with a
reason). At most five items in any list Weibao must act on; code everything and keep
the codes. Save the plan as a new section in `PARITY_INTENT_2026-10-15.md` or a dated
`UI_NEXT_<date>.md` beside it, and link it from that folder's `CHECKPOINT.md`.

## 5. Build the top slice

- One coherent playable slice (an R14), not the whole list. Save its scope, surface type,
  target viewports, visible outcome and deferred scope in an `R14_CHECKPOINT.md` before
  editing.
- Reuse the owners: the center-mode controller and `data-center-task`, the R13 yield
  rule, `village_workspace.js`, the attribute reader, shared tokens and components. No
  new navigation manager, store or per-screen layout patch where one rule will do.
- Inspection never advances time, spends, targets or grants knowledge (UR35). Unknown
  things stay unnamed in text, ARIA and links. Sealed world secrets stay sealed.
- No main/save/clock/simulation/combat-engine edits unless the slice truly needs them;
  then say so first. Persistence changes need Save/reload/export/import proof.

## 6. Verify and report

- Rebuild, freeze a new candidate under `~/.codex/candidates/`, serve on a new port, keep
  the older ones.
- Before/after at the same states and sizes, at 100% as well as fit images.
- Rerun what the change can affect: `check-r13.cjs`, the R11 fit/modes/interactions
  copies (`check-r12-regress-*.cjs`), the R12 recipe journey, focused node tests and the
  UI contract. Run the full suite on a clean export (HEAD + your paths) to separate your
  failures from other lanes'.
- Report: what was wrong, what changed, why, checks with numbers, what is not claimed,
  and what stays open. Proof and taste are separate gates (UR16): Weibao's visual/play
  acceptance stays open.
- No commit, push or publish without Weibao's explicit yes for that action. When he says
  yes, commit only the slice's paths and hunks through a private index, after checking
  that HEAD has not moved.

Done means: the ranked plan is saved, the first slice is playable on a new candidate with
before/after evidence, and the report names the next ranked item.
