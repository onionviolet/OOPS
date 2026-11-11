# Prose rules (PRS)

How player-facing words are written and checked. Weibao, 2026-11-06, to the
three-move proposal (vocabulary lint, rewrite by surface, voice sample in every
brief) and to registering the 2026-10-27 PR1–PR4 seed as a rulebook: "Lets do
that" ([record](USER_VISION.md#prose-rulebook-and-npc-dialogue-ideaboard-2026-11-06)).
The seed lines come from [master plan round 4](MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-4-overnight-development-zoom-and-prose-2026-10-27)
(PR1–PR6 there; renumbered PRS to avoid the crafting and companion PR codes).
Each line is a default, a dial and a reason, never never/always/only (AD5, AD38).

The editorial defaults already standing in [UI rules](UI_RULES.md) (UR70–UR74,
the 2026-11-04 creative-review paragraph, SUI1, RPT1–RPT14) and
[DESIGN](../DESIGN.md) DSG3/DSG5/DSG13 are not restated here; this file adds
voice, knowledge and vocabulary rules and the check that keeps them.

## Rules

| Code | Rule | Default, dial, reason |
| --- | --- | --- |
| PRS1 | **Write from what the character knows at that moment.** | Default: name people and institutions as they appear to a newcomer (an employer, a security office, a watchful supervisor). Dial: a premise where the character arrives knowing the setting (someone who read the books) may name them. Reason: WER3 wants a knowing choice about costs, not a tour of hidden structure; sealed secrets stay on their discovery route. |
| PRS2 | **Choice text states costs and stakes, not reveals.** | Default: what you keep, lose, owe and risk, in plain words. Hidden structure appears when play discovers it. Dial: a full-premise disclosure (PRS3) may say more on request. Reason: matches the discovery route and the sealed-secret practice. |
| PRS3 | **A spoiler dial for start screens.** | Default: discovery wording. Dial: a "full premise" disclosure the player can open for exact terms. Reason: some starts are chosen for the setup; let the player ask for it. |
| PRS4 | **One voice per surface.** | Default: confirm screens, tooltips and option labels are short, second person, present tense, effect first (UR70–UR75). Place and event prose speak in the world's voice; dialogue speaks as its speaker (DSG13). Dial: a world may be spare, lyrical, eerie or comic; the surface's job stays the same. Reason: mixing them reads as the UI talking in costume. |
| PRS5 | **Checks follow rules.** | Default: `scripts/check_player_text.mjs` runs inside `npm run check:rules`; it scans player-facing string fields in `src/*.js` for engine vocabulary and fails on any hit not in `scripts/player_text_baseline.json`. The baseline is a ratchet: rewrite a string and its entry retires; a new engine-speak string fails. Dial: an in-world use (a shop receipt, a stall's owner) is allowed with `// player-text: allow <why>` on the line. Reason: GROUND_RULES found that prose rules without a check recur. |
| PRS6 | **Player text uses the player's words, not the project's.** | Default: "admitted", "native", "actual", "real", "bounded", "seam", "owner", "consumer", "slice", "lane", "proposal", "supported", "disclosed", "revalidate" and their kin are how agents talk to each other. If a thing is in the game it is real; drop the word. A string says what the thing is and what it changes for you, in the world's nouns. Dial: a reference or developer view may keep technical terms when labelled as such. Reason: the 2026-11-06 sweep found 504 such strings in 171 files, almost all copied from lane briefs into content. |
| PRS7 | **Every brief that produces player text carries one voice sample.** | Default: a lane brief or task packet quotes one good line from the same world and surface ("player text sounds like this") and names PRS4/PRS6. Dial: a brief for a new world supplies the sample from its voice row (DSG13) or writes one as its first deliverable. Reason: agents write engine-speak when the brief is engine-speak; the sample costs one line and fixes the source. |
| PRS8 | **A prose rewrite changes the owning string only.** | Default: rewrite the content or event string; saved observations, Notebook entries and report history keep their wording (UR74, RPT8). Rewrite by surface the player reads most (confirm screens and tooltips, then Reports lines, then reference text), not by file. Dial: a scoped compatibility repair may touch stored text when it states its scope. Reason: a prose edit must not rewrite history or change an event's mechanics. |
| PRS9 | **The world speaks, not the build.** | Default: player text never shows build status ("prototype", "represented"), hedges written for agents ("makes no claim about"), bookkeeping ("creates no past history", "played minutes") or a missing-text marker; a dialogue line authored as prose reads as that prose. A place may pose a question to invite play ("Could you make a shelter here?") where an instruction would break the scene. In a sentence a person goes by their name; their role sits beside it once ("Talking with Old Hesk, the village elder"). Dial: Settings and debug views may name systems plainly. Reason: one leaked line ("text not found, id: ...") breaks a scene the rest of the text built. Checked by the PRS6 lint terms added 2026-11-10 (which now also read `textContent` assignments) and the dialogue test in `tests/talk_view.test.js` (PX42, PX47). |

## Review prompts (not rules)

From [UI rules, 2026-11-04](UI_RULES.md#ui-prose-and-subtle-detail-reconciliation-2026-11-04):
prefer details particular to the subject and source, verbs that carry the
action, rhythm suited to the scene; question mood padding, repeated sentence
templates, tidy moral conclusions, stock contrasts, forced jokes and defensive
caveats. A reviewer quotes the worst line and its rewrite, not just "passes".

## Backlog and workflow

- [Rewrite backlog](prose/PROSE_REWRITE_BACKLOG.md), regenerated by
  `node scripts/check_player_text.mjs --backlog`; `--update-baseline` after a
  rewrite pass records the retired entries.
- Bulk local-AI drafting stays a later option
  ([direction](USER_VISION.md#ui-and-prose-defaults-subtle-details-and-whimsy-2026-11-04));
  the lint and voice samples come first so a drafting pass does not reproduce
  the problem at scale.
- Dialogue, reactions and autonomous people: [dialogue owner](worlds/DIALOGUE_AND_INTERACTIONS.md),
  including the 2026-11-06 set-dialogue-versus-autonomy round.
