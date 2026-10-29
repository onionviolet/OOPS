# Lane brief: TG2, TG1 rerun on Luna (a blind paragraph-level tag pilot) (actor, kind, whether the paragraph shows the step)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Rules: CLR1 (read the cited paragraph, not the row),
CLR2, CLR3, CLR4 (absent means silent: say `unknown`), CLR12; AD36; sealed secrets (ids only outside the private folder). Publication: everything you write is private under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/step-tags-2026-10-29/pilot/`, except your checkpoint (counts and generic words only).

## Why

Script tags from the verb alone found none of the steps reviewers marked "actor not the lead" and few marked "not an action"
(guide section 6 run log). The unpaid-credit question is whether a model reading the cited paragraph tags actor and kind well enough to replace a 1.5 reread. TG1 ran as another model after a resume; this fresh launch names Luna so the result is Luna's. It must be **blind**.
Do not open `reviewed-rows-2026-10-29/`, any `RV*` or `MF_*` checkpoint, or any file in `step-tags-2026-10-29/` other than `pilot/pilot_input_paragraphs.jsonl`. Do not infer an expected answer from the step's class or label; read the paragraph.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Lines in `pilot/pilot_input_paragraphs.jsonl` | 140 | | yes (stop if under 70) |
| Lines with at least one paragraph of text | 140 | | yes (stop if under 70) |

## Scope

Use `pilot/pilot_input_paragraphs.jsonl` (140 steps; fields `stepId`, `verb`, `object`, `class`, `scenePov`, `present`, `evidenceLocators`, `paragraphs` with `locator` and `text`). Do not call `cite_paragraphs.mjs`; it selects by person and place, not step. Read them and write one JSONL line to `pilot/luna2_tags.jsonl`:
`{"stepId","actor":"lead"|"<person id from the registry in the merged folder>"|"unknown","actorBasis":"<chapter, paragraph>","kind":"act"|"perceive"|"think"|"speak"|"report"|"narration","kindBasis":"<chapter, paragraph>","shown":"yes"|"partly"|"no","note":"<one short sentence, no verbatim text>"}`.

- `actor`: who actually performs the step in the cited paragraph. The lead is `lead`. Another person is their registry id; if the text names someone you cannot resolve, `unknown`.
- `kind`: act (does something), perceive (notices), think (deduces, recalls, decides), speak, report (someone tells of an event), narration (the narrator states it).
- `shown`: does the cited paragraph show this step happening as labelled? `no` when it shows something else (for example advice instead of a payment).
- Do not split or merge steps. Do not read the whole book. Do not read `pilot/luna_tags.jsonl` or `TG1_CHECKPOINT.md`. Never invent ids. When unsure, `unknown` and `partly`, not a guess (CLR12).

Time budget: stop after all 140 lines or 60 minutes. Write lines as you go so a stop keeps partial work.

## Done check

`pilot/luna2_tags.jsonl` has one line per input line (or states the shortfall); every `actor` is `lead`, `unknown` or an id present in the merged registry (a one-line Node check); a checkpoint
`cast-lives-lanes/TG2_CHECKPOINT.md` with counts by `kind`, `shown` and `actor` class (lead, other, unknown) and the commands you ran. Scoring against reviewed verdicts is done by the coordinator, not you.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3) and out of your checkpoint.

First line of the checkpoint: the model name your session reports.
