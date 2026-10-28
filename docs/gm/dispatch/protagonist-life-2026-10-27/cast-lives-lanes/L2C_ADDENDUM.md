# L2c addendum: widen both selections (2026-10-28)

Model: `gpt-6-luna`, medium. Continue the [L2c brief](L2C_CONFLICT_AND_AFTER_BRIEF.md) from its
[checkpoint](L2C_CHECKPOINT.md), editing only L2c's own four files. Review of the first run:

1. **Fight contracts found 0 scenes because LOTM chapters 1-24 steps mostly have no class.** 130 of 161
   slice steps were read before step classes existed (`class` null). Select a scene as a conflict
   candidate when **any** of these holds: a step of class `fight`; a step or outcome whose verb or fact
   names danger, attack, threat, chase, flight, hiding, escape, injury, capture or questioning by police
   (keyword list in the script, tested); or a `footprint.hazards` entry. Expected: about 8-12 LOTM slice
   scenes. A candidate the paragraphs show is not a conflict is kept with `notConflict: true` and a
   reason, not dropped silently. Then fill contracts as the brief says (rows first, cited paragraphs for
   missing fields, `null` plus `unseen` where the text is silent).
2. **After-action mining found 5 and 4 pairs because it only used option `needs`.** Also count a pair
   when A and B are both in `present` of one scene and B appears in a later lead scene with A: the
   trigger class is the first scene's dominant step class (or the classifier on the step verbs), the
   response class is B's step or outcome class in the later scene. Keep the option-based pairs and mark
   each pair's `basis` (`option` or `copresence`).
3. Report the new counts in the checkpoint under a dated "Addendum" heading; keep the earlier counts as
   history.

Git commits are blocked inside the Codex sandbox (`.git/index.lock`). Do not try to commit; the
coordinating session reviews and commits your owned files.

Done check: focused test passes with new fixture cases for (1) a null-class step with a danger keyword
and (2) a co-presence pair; the checkpoint shows LOTM contract candidates above 0.
