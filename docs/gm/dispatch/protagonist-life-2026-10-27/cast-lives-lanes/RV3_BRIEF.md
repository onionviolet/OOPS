# Lane brief: RV3 (chapters 17-24), paragraph-reviewed rows for the chapters 1-24 gaps (sharded: RV1 ch1-8, RV2 ch9-16, RV3 ch17-24)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Rules: CLR1 (implement
from the cited paragraph, not the row), CLR2, CLR3, CLR4, CLR6, CLR12; AD36, AD44; sealed secrets (WORLD_SECRETS_AND_DISCOVERY): refer to secrets by id only
in anything you write outside the private folder, and never put a secret's text into a public file. Read first: [X4_CHECKPOINT](X4_CHECKPOINT.md) Resume 2-3
(why bulk row generation from step rows stalled: CLR1 gate; counts by family), [D2](D2_CHECKPOINT.md), [T2](T2_CHECKPOINT.md), [A3](A3_CHECKPOINT.md) (the three row schemas and
adapters: `src/cast_topic_talk.js`, `src/cast_journeys.js`, `src/place_acts.js`), `scripts/lead_run/cite_paragraphs.mjs` (how to get a step's cited paragraph from the
private book text). Publication: everything you write is private under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`, except your checkpoint (counts and generic words only).

## Why

Mappings from step rows alone reach 1,113 of 11,159 steps. The browser replay (deterministic, be seat) reached 2 of 150 steps of chapters 1-24. Extending a control to a
step needs someone to read the cited paragraph and write the row it supports. This lane does that for its chapter shard, so the coordinator can measure how much a paragraph-reviewed
pack raises replay fidelity, and so a later ingest lane can fold the reviewed rows into the pack builders.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Steps in your chapter range (chapters 17-24) in `x4-whole-book-mapping-2026-10-29/chapters-1-24.json` (or the 19-range ladder mapping) | RV1 about 500, RV2 about 500, RV3 about 490 | | no |
| Of those, with no control now (gap) | most | | no |
| Paragraphs retrievable through `cite_paragraphs.mjs` for those steps | nearly all | | yes (stop if under half) |

## Scope

For each gap step in your range, in scene order: read the cited paragraph(s), decide what the lead (or the player in the lead's seat) does there, and write one JSONL line to
`reviewed-rows-2026-10-29/<RV-id>.jsonl`:
`{"stepId","verdict":"row"|"gap","kind":"act"|"topic"|"journey"|"wait","row":{...adapter-shaped row...},"locator":"<chapter, paragraph>","paraphrase":"<one sentence, no verbatim text>","gapReason":"<if gap: no mechanism | actor not the lead | unresolved person/place/object | not an action>"}`.
Rows must pass the real adapters (`defineTopicTalks`, `defineJourneys`, `definePlaceActs`) and the JSON-safety rules: no `undefined`, no empty `requires` array, fares `null` when
unknown, ids stable from the step id, place and person ids from the pack at `private_packs/lotm-cast/cast.json` (the live whole-book pack; resolve names through its registry/aliases;
unresolved means verdict gap with reason, never an invented id). One canon choice per topic row (forced canon run; untaken options come later, ON2). Effects only knowledge (with basis),
and relationship or fact effects the paragraph states. Never invent stock, prices, outcomes or secrets. When the lead is not the actor (another person acts, the lead only watches), the
step is a `gap` with reason "actor not the lead" unless it is an observation the lead makes (then an act that records the knowledge).
A small validation script of yours in the private folder (or Node one-liner) must load every `row` through the adapters and report failures; fix or downgrade failing rows to gaps.

## Done check

Counts per kind and per gap reason for your shard; validation PASS count; a list of the top 10 gap reasons with generic descriptions of the mechanisms they imply (for the next Sol lane choice);
checkpoint `cast-lives-lanes/RV<N>_CHECKPOINT.md` with one line per check. Ambiguity default (CLR12): if the paragraph does not support a row, gap.

**Your shard: RV3, chapters 17-24 only. Your checkpoint: RV3_CHECKPOINT.md. Output file: RV3.jsonl.**
