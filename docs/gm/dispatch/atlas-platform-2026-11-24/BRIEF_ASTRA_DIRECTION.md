# Lane brief: overall direction, weak rules, and the atlas as a dev platform (2026-11-24)

Coordinator: Claude session (atlas platform). Model: Codex Astra, low. Reason for the frontier route: Weibao asked Astra to find the best overall direction and check whether it agrees with Claude's. Read-only except the one output file.

## Weibao's words

- "start the design grammar and kit in parallel too, use astra to figure out best direction overall and see if you two agree, also consider if certain rules are weak and more, like the ones we had to remove before"
- "how to turn the atlas into like a dev platform as much as a wiki and shows gaps and more? Other aspects?"

## Read

The [atlas platform note](../../../reviews/WORLD_ATLAS_PLATFORM_2026-11-24.md) (Claude's view, rounds 1-4 and the Discord ideas), your own [audit](../../../audits/ATLAS_PLATFORM_AUDIT_2026-11-24.md), the [Discord ideas](../../../research/DISCORD_ATLAS_DESIGN_IDEAS_2026-11-24.md) (DY1-DY40), the [goal discovery](../../../reviews/OOPS_GOAL_DISCOVERY_2026-11-24.md), [DESIGN.md](../../../../DESIGN.md), [UI rules](../../../UI_RULES.md), [RULES_INDEX](../../../RULES_INDEX.md), and the vision log entry "Colour may carry meaning alone, 2026-11-21" in [USER_VISION_LOG_2026-11](../../USER_VISION_LOG_2026-11.md) (a rule Weibao had removed because it got in the way; he asked which other rules "might be useless").

## Do

1. **Overall direction.** In at most one page: what OOPS should do next across the atlas, the foundation run, the design language and the goal, and in what order. Then a table comparing your view with Claude's note item by item: agree, disagree (why), or refine.
2. **Weak rules.** Review the UI rules, DESIGN.md DSG lines and PRESENTATION_AND_FOURTH_WALL for rules that are weak in the same way as the removed colour rule: they block a reasonable design, duplicate another rule, are unenforceable or never checked, contradict later direction, or cost more than they protect. For each: code, the problem in one line, evidence (a file or recent change it blocked or a later direction it contradicts), and a proposed disposition (keep, reword, merge into X, retire with successor, make a dial). At most 25, ranked by harm. Do not edit the rule files.
3. **Atlas as a dev platform.** Concrete design for the atlas as both a wiki of what exists and a developer platform that shows gaps and moves work: which views, which actions (each mapped to an existing owner, script or check), how gaps are computed, how a developer or agent goes from a gap to a draft change and back to proof, and what must never be automated. Include other aspects Claude's note missed.
4. Write `docs/audits/OOPS_DIRECTION_AND_WEAK_RULES_2026-11-24.md` with those three sections and at most five ranked decisions for Weibao.

## Rules

- Owned file: only that output. Touch nothing else, commit nothing.
- Proposals, not decisions (AD32). Separate verified facts from inference.
- No reading spend, no paid APIs.
