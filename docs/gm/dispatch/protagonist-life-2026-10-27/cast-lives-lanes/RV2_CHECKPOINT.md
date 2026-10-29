# RV2 checkpoint: paragraph-reviewed gaps, chapters 9–16

Status: paragraph review complete for the 54 mapped gap steps in chapters 9–16; 54 typed gaps, 0 new rows. Agent-verified, not human-reviewed. Private source-backed candidate only; no runtime or pack changes. Rules: CLR1–CLR4, CLR6, CLR12, AD36, AD44.

## Data probe

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| Chapter 9–16 steps in X4 chapter 1–24 mapping | about 500 steps | 54 current gaps; the mapping has additional non-gap controls outside this lane's review set | PASS; this lane reviewed only its gap subset |
| Paragraphs retrievable for target gaps | nearly all; stop below half | 54/54 cited paragraphs retrieved through `cite_paragraphs.mjs`' shard index | PASS |

## Result

`reviewed-rows-2026-10-29/RV2.jsonl` contains 54 unique step records, in scene order. Counts by kind: act 54 (all are typed gaps; no row was supported by the cited paragraph and existing adapter contract). Counts by gap reason: no mechanism 34; not an action 10; actor not the lead 9; unresolved person/place/object 1. Every record has a one-sentence paraphrase and chapter/paragraph locator. Canon names and source text remain private.

The private JSONL is intentionally ignored by `.gitignore` under `docs/research/novels/`; it remains local and is not part of a commit. The checkpoint is the tracked handoff surface.

The source snippets often describe ordinary actions, but the existing place-act adapter has no reader/cooking/waking/sitting/weapon-securing operation; journey rows require supported endpoints and means; topic rows need a resolved person/topic and a canon choice; and the cited material often gives no duration, result, or supported choice. Filling those fields would go beyond the paragraph. In nine records, the described act belongs to someone else. The one unresolved-place/entity case remains unassigned rather than receiving an invented ID. No row was promoted just because its M4 verb looked actionable.

## Highest-value mechanism gaps for a later lane

These are generic implications from the reviewed step classes, ranked by repeated occurrence in this shard; they are design leads, not accepted runtime scope.

1. **Conversation choices and reports (9)** — admit a lead's source-backed question/response with resolved person, topic, and recorded knowledge, without inventing a conversation outcome.
2. **Paid and ordinary transit (9)** — represent arrival, fare, boarding, and local movement with supported origin/destination, means, and unknown fares left unknown.
3. **Household preparation (6)** — support reading/cooking and meal preparation using real object/material custody and effects rather than invented stock.
4. **Short waiting (2)** — handle an explicitly described wait with a source-supported duration or completion cue.
5. **Awakening and time checking (2)** — express waking and checking a clock without treating sleep duration as a wall-clock event.
6. **Concealment and safe handling (1)** — model securing or hiding an owned object with its actual custody and resulting state.
7. **Observation and attention (1)** — record a lead's perception without asserting the truth or source of an uncertain perception.
8. **Destination exit and arrival (3)** — cover leaving a supervised location and the route outcome when the source supports both ends.
9. **Knowledge gained from another actor (9)** — preserve the distinction between a lead's observation and another person's speech/action; only lead knowledge effects belong in this seat.
10. **Ambiguous narrative beats (10)** — represent thoughts, offers, and scene transitions only when a player action/choice is actually evidenced.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node` extraction using X4 `chapters-1-24.json`, merged scene evidence locators, and `cite_paragraphs.mjs`'s `shardIndex` | PASS, 54/54 target gaps had cited source paragraphs | Paragraph availability only; each paragraph was then reviewed individually. |
| Node JSONL shape/uniqueness check on `reviewed-rows-2026-10-29/RV2.jsonl` | PASS, 54 records, 54 unique IDs, all locators/paraphrases present | All 54 are gaps; check does not establish gameplay coverage. |
| Node adapter validation using `definePlaceActs`, `defineTopicTalks`, and `defineJourneys` | PASS, 0 row verdicts to validate; all 54 gaps schema-checked | No adapter-shaped row was emitted; no content coverage added. |
| `git diff --check -- <owned files>` | Not applicable to newly created untracked files; direct JSON/whitespace review passed | Shared checkout already contains extensive unrelated dirty work; no unrelated path was changed. |

No build, test suite, browser run, persistence check, commit, or push was run: this is an offline private content review with no runtime change. Highest review state: source-spot-checked; route kind: offline private content review. The next Sol lane should select a mechanism gap from the ranked list only after checking its existing owner and consumer.
