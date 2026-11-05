# Hogwarts wave: what to delete and more to consider

2026-10-14, after LP1 and LP4 to LP8 merged (09e38aa1) and the deep re-passes
landed (2e166ce6). Weibao asked: "anything to delete? more to consider?"
Proposals and housekeeping only; nothing here is accepted design.

## Delete

| Code | Item | Size | Verdict |
|---|---|---|---|
| X1 | Merged worktrees `hl-lp1`, `hl-lp4` to `hl-lp8` and their local branches | about 2.4 GB | Safe: every commit is in `codex/gameplay-foundations`. Leftover changes are rebuilt `dist/` files only. |
| X2 | `hl-lp2`, `hl-lp3`, `hl-integration` | about 1.3 GB | After the LP2+LP3 reconciliation lane lands. |
| X3 | Hogwarts Legacy install | 71 GB | Not yet. The deep pass says uninstall readiness is No (L3 first). 249 GB is free, so there is no pressure. |
| X4 | `~/.codex/research/hogwarts-legacy/repos` (tool sources and builds) | 2.4 GB | Keep: TOOLING's rerun recipe depends on it. |

Other large installs (Taiwu 19 GB, HoI4 11 GB, Immortal Life, Vagrus) belong to
the other session's research wave; leave them to that owner.

## Act now

- **A1:** LP2 and LP3 conflict in the practice command: both added a
  requirement. The coordinator kept both (LP2's return step and LP3's brace).
  Seven tests fail because each slice's tests assume only its own
  requirement. Lane `lp23merge` is reconciling tests on `hl/integration`,
  then runs a combined browser path. Landing waits for it.

## Account for now

- **K1 Combined play:** six slices now share Village. Each passed alone; no
  run has gone through them together, and Village's action panels may be
  crowded at 1366x768. Merge gate for LP2+LP3: one combined screenshot of
  Village at 1366x768.
- **K2 Combined save:** no save yet holds every slice's state at once
  through Export and literal Import. Add one to the next merge smoke.
- **K3 Flaky harness:** LP7's browser helper allows only 40 fake-clock
  steps and fails under machine load on its own branch too. Raise the
  budget in that script before relying on it in future sweeps.
- **K4 Dispatch ports:** assign each lane's port explicitly in its prompt
  (LP4 got LP1's port from a formula).

## Later or delegate

- **L1 Cross-slice joins (design):** LP6's partner helps at LP1's task;
  LP8's counter tracks LP3 bench batches; LP5's teaching hours gate the LP1
  and LP2 teacher; LP4 wool as an LP7 material. Each is a small proposal
  once Weibao has played the slices.
- **L2 Fold research into owners:** deep-pass D codes, re-pass proposals
  and the Ars Nouveau and Arx findings (glyph composition, rune vocabulary)
  are not yet folded into IDEA_INDEX or the technique and lesson owners.
  One fold lane.
- **L3 Uninstall path:** a capture pass for the packages the deep pass
  still needs (conversation graphs, AI task packages, streamed world event
  actors) under the deep-details rule, then uninstall with Weibao's Steam
  confirmation.
- **L4 Re-audit P5 to P10:** Disco Elysium restore, Book of Hours, Cycle of
  the First Dawn, Vagrus companion return, Ultima Ratio Regum and P10 are
  ranked but not dispatched.
- **L5 Similar games without buying:** public material for Magical Diary
  and Bully, Ars Magica 2 source and OpenMW spell code. Buying Magical
  Diary, Bully, Rune Factory 4 or Potionomics needs Weibao's yes.
- **L6 Balance:** LP4's replay spent 120 wool on 24 failed cloth attempts.
  That is the existing cloth recipe's odds; review it.
- **L7 Method inspector:** a dev-only view that shows why a learned method
  can or cannot be used right now (teacher, body, tool, brace, hours) would
  make LP1 to LP3 easier to test and tune. Inspection only, no mutation.


## Content reconciliation B490: retained findings and evidence boundaries

Historical housekeeping/proposal inventory under AD32/AD36/AD41/AD42/AD43. X1–X4 sizes, merge ancestry, dirty generated-only worktrees and249GB free were observations at2026-10-14, not live deletion readiness. Even the old Safe verdict requires fresh current ancestry, dirty/index/untracked ownership, recovery and inbound/tool checks before any retirement; this reconciliation grants no deletion, uninstall or branch action. Tool repos support reproducibility; installed game/source payload and retained evidence are separate assets. Other sessions' installs remain outside this brief.

A1's seven failing tests and combined LP2/LP3 requirement decision are historical integration facts, not seven reproduced current failures. Both legitimate return and brace requirements must be tested in combination rather than dropping one to satisfy single-lane tests. K1 combined crowding and K2 combined literal import are named proof gaps; isolated slice passes do not imply combined coverage. The1366 viewport is historical, not today's desktop matrix. K3's40-step harness issue and K4's port collision are diagnostic questions; raising a budget alone does not certify gameplay or resolve a slow/hung route.

Retain L1's four actual cross-slice joins, L2's research-to-owner fold, L3's remaining capture families, L4's ranked unsent re-audits, L5's available-source candidates, L6's120 wool/24 failed cloth attempts and L7's read-only method inspector. Those outcomes are useful alternatives, not present implementation/acquisition/dispatch authority. A finite unlucky replay does not alone establish the probability distribution or required balance change. Human play is optional AD42 review rather than a universal prerequisite to consider fitting joins. Current source/install state, later merges, native/UI/full-suite behavior and purchase availability were not inspected in this full-document read.
