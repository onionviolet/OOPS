# Post-build UI audit prompt, 2026-10-18

Weibao: "create a prompt to audit latest UI once its done, how to restructure to show more
information and look better and more?" Paste everything below the line into a fresh session once
the start gate passes. It starts the repeatable `docs/audits/UI_CORE_AUDIT.md`; later runs add a
round to that file and never restart codes.

---

You are auditing the YAIRPG player-facing UI after the surface-manifest builds. Your job is to find
how to restructure it so it **shows more useful information** and **looks better**, with evidence.
This is an audit, not a build: change no runtime code.

## Start gate

Before anything else, confirm from `git log` and the reports in
`docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/` that UIL2, UIL4, UIL7, UIL8 and UIL9 are
committed. If any is missing, list which ones and stop. If Weibao says to audit anyway, record the
missing steps as a limit in the report.

## Read first (bounded)

- `AGENTS.md`, then `docs/RULES_INDEX.md`. Apply UR1–UR58 (`docs/UI_RULES.md`), AD34, AD36 and
  AD37/AU1–AU15 for any helpers.
- `next-parts/surface-manifest-and-ui-flow-2026-10-18.md`: UIM, UIW, UIX, UIY, UIZ, UIP and the UIL
  reports. These are proposals. Check what was built against them; do not treat them as accepted.
- `docs/UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md`, `docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md`
  (SC5, IN3, PL, ZN), `next-parts/r21-feedback-2026-10-17.md` (BX), `docs/MOCKUP_SYSTEM.md`,
  `docs/audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md`.
- Search the earlier UI audits in `docs/` (`UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md`,
  `UI_EXPERIENCE_AUDIT_2026-10-12.md`) only for findings to recheck. Do not repeat them.

## Evidence

Rebuild (`node build.js`) and use a fresh browser origin per target. Use the populated fixture
(`docs/gm/dispatch/calm-vivid-2026-10-14/evidence/populated-ui-fixture.json`) and extend
`check-uil1.cjs` rather than writing a new harness.

- **Targets:** 1920×1080 (primary), about 1800×1040 (Weibao's MacBook), 1536×864 and 1366×768,
  each at 14 px and 21 px text. Mobile is deferred.
- **States:** idle in the Village; at the Mixing counter and in Crafting; travelling; a fight with
  1, 4 and 8 opponents; Journal and Inventory expanded; return after a time skip; a stored custom
  placement and sizes (UIL7).
- **Measure per region:** pixel area; the share actually covered by content (union of content
  bounding boxes against the region box); visible list rows; text sizes; scroll owners; page
  `scrollHeight` against the viewport.
- **Count:** decision-relevant facts visible without clicking (the UIW list), the clicks and keys
  for each UIY flow, and duplicated facts or titles.
- **Look:** alignment, label/value gutters, palette roles (UR37), hierarchy (UR46), token use (UR6,
  UR7), and Proto23 composition (UR12, UR49: a difference is a gap only without a YAIR reason).
- **References:** compare with saved notes in `docs/research/` (Melvor, NGU, ITRTG, idle-game UI
  research T1–T8). Label each claim shown, stated or inferred. Do not rank sources or turn one
  game's choice into a rule.

## Questions to answer

1. Where is space spent on nothing, and what decision-relevant fact could live there instead?
2. Which facts are shown too often (stable, neutral, duplicated) and which too rarely (UIW)?
3. Which panels should split, merge, shrink to content or become a summary row, chip or hover card
   (UIP5, UIZ1)?
4. Does each context (idle, combat, travel, service) show what that activity needs, and does
   leaving restore your place (UIX6, UR23)?
5. Do resizing, Move to and the splits keep every surface reachable in one click, with no route
   lost at any target (UR21, UR25, UR52)?
6. What makes it look better without smaller text or fewer facts: grouping, alignment, rhythm,
   color roles, framing, motion that stays out of the way (UR38, UR46)?
7. What breaks at 21 px, at 1366×768 or with a large fight?

## Output

Write `docs/audits/UI_CORE_AUDIT.md` (create it on the first run; add a dated round on later runs):

- **Findings F1…** with a screenshot path, the target and state, the measurement, and whether each
  is shown or inferred.
- **Restructure proposals R1…**, each as default, dial and reason, naming the surfaces it touches
  and the rules it applies. No either/or questions for Weibao: propose the default and when the
  alternative applies.
- **Two or three layout mockups** for the biggest restructures, built with `MOCKUP_SYSTEM.md`
  comparison controls. Label fixture provenance, target and limits. Mockups are not native proof.
- **ACT NOW / ACCOUNT FOR NOW / LATER-DELEGATE** lists. LATER items get a level, effort and done
  check so they can be dispatched as UIL10 onward.
- **Five suggestions, ranked** at the end, with the rest split off.

Keep screenshots in `docs/gm/dispatch/ui-foundation-2026-10-15/evidence/ui-core-audit-r1/`. Add one
line to `docs/USER_VISION.md` under the 2026-10-18 UI section linking the audit (from disk, append
only, then check nothing was removed). Add a register row for the audit only if `RULES_INDEX`
lists audits.

## Limits

- Change no runtime code, saves or styles. Findings and proposals are not decisions.
- Sealed secrets: never show a secret's truth in screenshots, text or mockups (refer by ID).
- Shared checkout on `codex/gameplay-foundations`: inspect `git status` first, touch only the audit
  files, never stash, reset or force, switch no branch and commit nothing. The coordinator commits.
- Helpers: at most two generated agents at once, read-only, within one shared budget (AU).
- Weibao's visual acceptance stays open (UR16).

**Done when** the audit file has findings with evidence at all four targets and both text sizes, the
restructure proposals and mockups, the ranked five and the LATER items with done checks, and every
screenshot path resolves.
