# Rules status reconciliation, 2026-11-14

Code prefix RSR. Weibao asked how to "stardardize make things coherent", "Whats iwth all the proposed rulebooks? how can we improve preflight and existing rulebooks?", then "Start accordingly, consider why /reconcile-project didnt fix that? improve reconcile accordingly?" This record covers O1 (three status words, enforced) and O2 (a line-by-line sort of the older proposed sets under AD56). O3 (one preflight card) and O4 (one rulebook shape) followed the same day; see [Answers and follow-through](#answers-and-follow-through-2026-11-14).

Method: five read-only sonnet lanes each read one batch of owner files and sorted every code into widens play (working default), limits play (held for him), process (how agents work; AD56 does not promote these), restates accepted direction, palette, or retired. The coordinator checked the buckets against the [limiting lines review](LIMITING_LINES_REVIEW_2026-11-10.md) and folded them into the register. The lanes' borderline calls are kept below as written; nothing was bulk-assigned.

## Findings

| Code | Finding | Evidence |
|---|---|---|
| RSR1 | **Seven or more status words for three authority levels.** In the register: standing (47 mentions), working default (26), proposed (about 45 variants), plus "proposed, in use", "held for Weibao", "standing defaults", "binding defaults" and "run authorized, lines not yet accepted". | `RULES_INDEX.md` register, census 2026-11-14 |
| RSR2 | **Proposed sets were never routed.** AD56 (2026-11-10) gave a route for new rulebooks (the limiting lines review, answered in four rounds). Sets written before it (PAC, OPN, NMR, CTR, FBK, SPR, MR37+, WPR, GTR, ABR, PGC, WSC, the procedural docs, WA42+) kept "proposed" with no route. | Register rows; LLR review scope line |
| RSR3 | **Labels disagree with force in both directions.** NMR8 and CTR9 make `check:rules` exit 1 while labelled proposed. WPR is "proposed" yet AGENTS.md says passes "follow" it. GTR9–GTR14 shipped as `src/progression_gates.js` while the file says it authorizes no runtime change. UR77 and UR82 read "in use" while held as LLR29 and LLR30. | Lane B and C reports; `package.json` check:rules |
| RSR4 | **Brief requirements live in about six places.** PRF1–PRF8, SPR prompts, MR40 (making brief), UR76 (UI contract), and AGENTS.md (viewport, voice sample, naming sample, WER answers). No single card gathers them. | O3, not yet built |
| RSR5 | **Many proposed lines only restate accepted rules.** For example PRF8, SPR24, SPR27, GTR1, GTR2, ABR13–ABR17, DSG6–DSG13 and WPR31. They bound already through their source; the label undersold them. | Lane reports, SRC rows |
| RSR6 | **One growth gate is written three times.** PGC13, WSC19 and PC81 each say a new effect verb needs a second consumer, which conflicts with AD51's first-known-consumer reading. One answer covers all three (LLR48). | Lane D |
| RSR7 | **One real conflict.** PGC17 rejects new effects off the price curve ("pays"); PC73 says a dominant result is a report, not a clamp, and AD5 says balance is not forced. Held as LLR49. | Lane D |

## Why reconcile-project did not fix this

It ran here on 2026-11-04 ([loose documents](LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md)) and did what it was built for: claim-against-evidence and document coverage. Every guard in it stops false adoption (a proposal treated as a decision). It had no step for the opposite failure: a proposal left with no route, a label census, or a check of label against enforcement. Its line that dated blanket adoption covers only its recorded scope also discouraged re-sorting older proposals under a later rule. So each pass correctly wrote "proposal, gap" and the backlog grew.

Fixed 2026-11-14 in the shared skill (`~/.codex/skills/reconcile-project/SKILL.md`, "Status hygiene and closing the loop"; generic, no project codes): label census, label versus force, later blanket direction applied line by line within its wording, scatter of one requirement kind, a route for every proposal, and a closing decision packet. Eval scenario 11 added, not yet run; logged in `~/Documents/Dev/agent-skills/MAINTENANCE.md`.

## What changed (ACT NOW, done)

- RIX3: the register's [Status words](../RULES_INDEX.md#status-words) section defines Accepted, Working default and Proposal, each tied to AD32 or AD56. Every register Status cell now opens with one of them or "Mixed:" with each range's state; earlier dated text stays after it.
- `scripts/check_rules_index.mjs` fails a Status cell without a state word; `tests/check_rules_index.test.js` covers it.
- Each set's sorted ranges are in its register row. Held lines are LLR38–LLR53 in the [limiting lines review](LIMITING_LINES_REVIEW_2026-11-10.md#older-proposed-sets-2026-11-14).

The register row is the current status; owner headers now carry a matching `Register status:` line (O4, below), and older status wording inside them is history.

## Process sets for one answer each (his yes or no)

AD56 covers play ideas, so these stay Proposal until he answers by set. Recommendation for each: accept as prompts (a blank field stops nothing), since agents already follow them.

| Code | Set | Hard gates inside | Recommendation |
|---|---|---|---|
| RSR P1 | Preflight prompts PRF1–PRF2, PRF4–PRF7, FND1–FND3 | none | Accept as prompts; they become the O3 card |
| RSR P2 | Ratchet checks NMR8, CTR9 (already block in `check:rules`), PAC5, OPN9, FBK8 (block when run on request) | all five | Accept; the ratchet only stops new findings |
| RSR P3 | System practice and making prompts SPR4–SPR7, SPR12–SPR13, SPR22, SPR28–SPR29, MR40 | SPR28 (replay harness registration) | Accept as prompts |
| RSR P4 | World pass procedure WPR1–WPR4, WPR6–WPR7, WPR18–WPR28, WPR30 | WPR18 (review lane returns) | Accept; matches practice |
| RSR P5 | Source and lane procedure WA44–WA45, WA53, WA62, WA65–WA67, ABR3, ABR12, ABR22, UR76, UIV7, PGC10, GTR5, GTR7, GTR9, GTR12, GTR14, GTR23, GTR27, the method sections of the world completion standard and the procedural docs | WA45, WA53, WA67, ABR22, GTR27 | Accept as prompts; keep the five gates |

## Smaller dispositions

- **SPR17** (lead-circle ties read a fixed baseline) is the same limit as LLR2; one answer covers both.
- **GTR25** (rank is a held record) follows LLR12's answer ("rank can match or diverge from real power"); its wording should say both, at O4.
- **Duplicates kept as aliases:** MR39 = SPR3; OPN4 = FBK4 = DSG10 on refusal reasons (UR73 owns it); PAC1 = FBK1; WPR5 = GTR6; WPR31 = GTR7; GTR16 = GTR21 = GTR29; UIV4 = ABR11; PGC9, PGC22, PGC27 restate GR5, GR3 and UK1–UK7. Merging their text is O4 work.
- **Stale lines:** MEANS IMP8 and PAC8 ask for old-save compatibility, against the [old saves disposable](../gm/USER_VISION_LOG_2026-10.md) direction (left Proposal); the NAMING_RULES header says the check is not wired yet (it is); PC59, PC60, PC62, PC63, PC91 and PC93 are retired by PC94 and PC95; the WSC boundary table predates PGC15's agreement.
- **Means and appraisal:** working default for AA9, AA11, AA13–AA15, CRL35, CRL36, CRL40, "UI is a means" and "Showing means in the UI"; the domain tables, AP ladder, LS, ML and AA1–AA8 stay palettes.

## Not sorted (residue)

- LSD1–LSD475 (lead-life systems design): a proposal source whose accepted direction already moved to LEAD_LIFE_RULES; left as Proposal.
- ABILITY_RULES sections after ABR22 (ABM, AB1–AB37, the two later proposal sections) and DESIGN.md's uncoded blocks (action and encounter views, CA1, the 2D exploration note).
- PROCEDURAL_CARRY_OUT after about line 540 ("Capability runs", round 2): sorted from headings and first lines only.
- The 2026-10-30 [reconciliation audit](RULES_RECONCILIATION_AUDIT_2026-10-30.md) overlap-cluster merge proposals: they feed O4, not re-sorted here.

## Answers and follow-through, 2026-11-14

Weibao, on P1 to P5, the held lines and O3/O4: "go ahead for all of them".

- **P1 to P5 accepted as prompts (AD32).** A blank field stops nothing. The gates those sets name still block: the check ratchets, WPR18, WA45, WA53, WA67, ABR22, GTR27 and SPR28. The register rows and GROUND_RULES headers say so.
- **LLR38 to LLR53 take their open alternatives.** The owner lines are rewritten, and the answers are in the [limiting lines review](LIMITING_LINES_REVIEW_2026-11-10.md#answers-so-far). Not covered by this answer: SPR17 (it goes with LLR2), GTR8 (it goes with LLR13), and the earlier holds UR77, UR82, UR88 and UR162.
- **O3 done.** The [preflight card](../gm/PREFLIGHT_CARD.md) is one form: always-fields, conditional rows and the FLR receipt. AGENTS.md Verification, the foundation-run playbook, UR76, MR40 and GROUND_RULES point at it.
- **O4 done.** The [rulebook shape](../RULES_INDEX.md#rulebook-shape) has five points and an alias table. Every rulebook owner now opens with `Register status:`, and `check:rules` fails when it disagrees with the register (RIX4). Moving core lines first and history below happens as each rulebook is next edited.

### Code still on the old defaults (implemented, rule changed)

The rules now say one thing and these files still do the old one. Each needs its own slice with tests:

- `src/procedural_grammar.js`: the default rule severity is still `reject` (line 50), and `unknown-part` is still a violation (line 154). LLR47 makes both flags, except for a malformed shape or a declared world law. Every grammar's check rules need sorting into world law versus source range before the default flips.
- `src/effect_checks.js`: `pays` still fails a candidate (line 113). LLR49 makes it a report and a rank.
- `scripts/check_pacing.mjs` and `scripts/check_openings.mjs`: targets and press counts still fail when exceeded. LLR39 to LLR42 make them guidance a start may exceed with a stated reason (a per-start reason field that turns the failure into a report).
- `src/spell_effects.js` comments still cite the second-consumer rule (EF2). LLR48 changes it to the first known consumer.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/check_rules_index.test.js` | 12 pass (status words, owner headers) | |
| `npm run check:rules` | PASS | |
| `node --test tests/kernel_working.test.js tests/mind_meters.test.js tests/test_changed.test.js` (tests that read changed docs) | 36 pass | `test:changed` pulled in other sessions' src changes and queued behind load; not used |
| `node scripts/check_doc_slips.mjs` on added lines | clean | its older findings elsewhere are not this task's |
| `python3 -m unittest discover tests` (skill helper) | 3 pass | scenario 11 not run |
