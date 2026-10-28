# Is the extraction enough to play the lead's life in the player's own style, and when do we batch every book? (2026-10-28)

Proposal from the Opus coordinator, a more-to-consider round on [PLAN.md](PLAN.md) and [REFLECTION.md](REFLECTION.md). Nothing here is accepted until Weibao says so; no batch was submitted for it. Consumers: [canon protagonist report](../../../research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md) Parts G and H (PX51-PX54, completeness measures M1-M9), [schema card 1.3](../protagonist-life-2026-10-27/SCHEMA_CARD_1_3.md). Labels: [S] seen in the files, [I] inference.

## 1. The short answer

**For the lead's own line (layer L0), yes, nearly.** Scenes, steps, options, choices, knowledge, motives, anchors, footprints, census with whereabouts and fills cover "every place, item, price, law and person the lead touches" and the dated beats (H.1, M1 and M2). The high-effort scenes pass matched the agent run on choices (6 of 6) and nearly on options (6 of 7) [S].

**For playing "in your own style", no, not yet.** Own style means the player does something the lead did not. The schema records what the text shows, so it is thin exactly where a different choice needs the world to answer. The gaps below are what a player-led run asks of the world beyond the lead's route (layer L1, the second layer in H.1).

## 2. Coverage gaps (C-codes)

| Code | What a different style needs | What we hold | Gap and proposed fix |
| --- | --- | --- | --- |
| C1 | **How things work**: rules, potions, rituals, divination, crafts, an ability's conditions and costs | Census `law` rows with a note of at most 15 words; `procedure` and `tech` card fields **dropped from the batch schema** [S, batch_lib comment] | Mechanics are the biggest loss. Add a **rules pass** (pass 3): per shard, every rule or procedure stated as conditions, steps, inputs, costs, failure results, limits, in own words with locators. Needs prompt mode and high effort. |
| C2 | **Other people's lives and reactions**: routines, where they are by hour and day, attitudes, what they would say to a stranger | Census `whereabouts` (era-level), `present` lists, `voice` dropped | Add a **people pass** (pass 4): per person, routine slots, relationships with attitude and basis, speech habits (own words, no quotes), what they know and when. Whereabouts must carry time of day, not only era. |
| C3 | **Everyday texture** (lodging, food, work, transport, hours, weather, crowds, law enforcement) | Prices and amounts as census rows; some anchors | Add a **texture pass** (pass 5), with sourced rows only where the text states them. Everything else stays `fill` with layer and confidence; a Sonnet synthesis pass after the merge writes period fills from the pass-1 to 5 rows. |
| C4 | **What changes if the lead is absent or acts differently** (counterfactuals) | `outcomes` carried/changed/blocked on lead scenes; `footprint` for great scenes | Per-shard reading cannot know downstream effects. This is a **cross-shard synthesis** job at the merge step (Sonnet or Opus, one call per arc, over the merged rows), not a Haiku shard job. Poke tests (M5) are its check. |
| C5 | **Global timeline and ids** across 31 shards | `deps` and date anchors resolve inside one shard only; `continues` for split scenes | Needs a merge script (PL-L16, GF1, GF19): one id registry, anchors resolved to calendar dates, cross-shard `deps` stitched. Not built; it is the main code lane before volume 1 can feed M1 and M2. |
| C6 | **Reasons and options the text implies but does not state** | Options labelled `I`, fills labelled `authored-proposal` | Works as designed. Risk: Haiku invents fills freely. Keep fills `authored-proposal`, cap their weight in any consumer, and spot-check 10% by Sonnet. |
| C7 | **Accuracy of the facts**, not only the names | Name accuracy 1.0 (names found in the shard); locator validity | No factual ground truth. Add the 10% Sonnet row check (supported by the cited paragraph: yes or no) and report the support rate per wave. |
| C8 | **Hard limit on output size** | Scenes at high effort used 38,364 of 48,000 tokens on a 3-chapter shard with 6 scenes [S] | A denser shard (the agent run of `w2s25` has 13 scenes) can hit `max_tokens` and waste the call. Pilot scenes plan raised to 64,000; max_tokens above the model's limit would be rejected at $0. |

Pass 3 to 5 would use the same shards, the same glossary and one more batch per pass. At the measured $0.01 to $0.011 a shard per pass, three more passes add about $0.03 a shard, about $1 for volume 1. Money is not the limit; the code lanes (merge, language adapter), schema design and the audit are.

## 3. When is it good enough to batch all the books?

Because a re-read of volume 1 costs under $1, **the cost of being wrong is small; the cost that matters is wasted audit and merge effort on rows in a schema that later changes.** So the gates are about schema stability and tooling, not money.

| Gate | Condition | State |
| --- | --- | --- |
| G1 | Pilot of 3 other shards: grade A or B each, new-entity recall at least 0.75, measured cost within 2x of $0.022 a shard | Plans ready, awaiting Weibao's go |
| G2 | LOTM volume 1 (31 shards, two passes, in waves of about 10) passes the stop rules: at most 2 of 10 shards grade C, name accuracy at least 0.9, no repeated failure, cost within 2x | After G1 |
| G3 | **Consumer probe**: merge volume 1 (C5), then run M1 and M2 against it and answer a fixed list of about 20 own-style questions from the rows (for example: where is a named person at nine in the evening, what does this rite need, what does a night's lodging cost, what happens if the lead skips this beat). Every unanswerable question names the schema field or pass that would answer it | After G2. Decides whether passes 3 to 5 are in schema 1.4 |
| G4 | Schema 1.4 frozen (the passes and fields G3 asked for), documented in the schema owner with a change rule | After G3 |
| G5 | English runtime adapter done (locator form, header pattern, quote guard in words, candidate patterns, units); Harry Potter year 1 shard lints clean | Needed for 9 of the 10 other books [S, PLAN section 4]; independent of G1 to G4, can run in parallel |
| G6 | Per book: boundary and edition settled, id registry seeded, a one-shard measured fit, a finite plan (AU13) and Weibao's yes with a cap | Per book |

**Batch every book after G4 and G5, one book at a time under G6, not before.** Before G4 only volume 1 runs, because it is the only book whose language adapter exists and whose output already feeds the sim. After G4 the order is the PLAN order (Harry Potter year 1, Mother of Learning, then the rest); each is a pilot of one shard, then five, then the rest, with its own go phrase and cap. Total for all held books at the base estimate was about $26 [PLAN section 3]; at the measured 1.6x and with passes 3 to 5, plan for about $60 to $100. That is more than one month of credits: the campaign takes about two months or must skip the largest books (Reverend Insanity about $9 per pass pair, Shadow Slave about $4). Set per-book caps before any book starts.

## 4. Guidelines saved (G-codes for the runner, proposals until accepted)

1. **Census at medium effort, strict schema; scenes at high effort, prompt mode.** Low effort only for mechanical passes.
2. **Gate on new-entity recall** (names the glossary did not supply, reader rows only), with all-row recall reported second.
3. **Script fill is a floor, not credit**: it fills known names, never counts toward reader recall, and never creates a duplicate id.
4. **One entity, one id**: two reader rows with one id merge into one row plus an alias.
5. **Waves of about 10 shards per batch**, one go phrase and one `--max-usd` per wave, because batches can overrun the workspace limit.
6. **Estimates use measured output tokens** (`outTokensAssumed` in the plan; measured about 40,000 per request for census at medium and scenes at high), not the old 25,000.
7. **Repair requests carry the known-names table** (fixed this round) and a repair result never creates another repair; a second grade C gets one fresh full request, never a third.
8. **Never rely on the Console for cost**; the `<label>_usage.csv` is the record. If the Console shows no runs, check the workspace picker and widen the date range.
9. **A pass enters schema 1.4 only after the consumer probe (G3) shows it answers a named question.** Passes 3 to 5 are built and dry-run ready (round 2) so the probe has rows to test; building them freezes nothing.
10. **Layers are a report, not a gate** (PX53, PX54): a book is "lead-complete" at L0 plus the L1 smoke test; passes 3 to 5 are what L1 uses.

## 5. More to consider (this round)

**ACT NOW (done):** `repairRequest` glossary and `maxTokens` fix; `outTokensAssumed` read by the submit CLI; pilot plans use 64,000 max tokens for scenes; this file.

**ACCOUNT FOR NOW:**
- Haiku fills are free inventions; the consumer must treat `authored-proposal` rows as replaceable (card rule), and the Sonnet spot check should count fills separately.
- Prompt-mode JSON can fail to parse on long output; parse failure and `max_tokens` already route to repair, but a truncated scenes result needs a fresh call at lower effort or a split shard, not a repair.
- Chinese-only quote guard (six characters) stays; English books need the adapter first (G5).
- The pilot's scenes batch reads the pilot census, so run census, collect, then scenes.

**LATER / DELEGATE:**
- Cross-shard merge script (C5): code lane, done when volume 1's 31 shards give one registry with unique ids and resolved anchors and M1/M2 run on it; level: sonnet.
- Rules, people and texture passes (C1 to C3): schema lane after G3; done when a probe question list is fully answerable from the rows.
- Counterfactual synthesis (C4): one Sonnet call per arc over merged rows after G4; done when poke tests M5 run on three great beats.
- Sonnet 10% support check as a batch (C7): done when `spotChecked >= 5` and a support rate are in each header.
- Local-AI reader report (`docs/research/LOCAL_AI_READER_TEST_2026-10-27.md`) may serve the mechanical passes at zero API cost; compare once it lands.

## 6. Round 2: what else we would want, and what changed in the runner (2026-10-28)

Asked: adjust the batched runs to cover everything the lead-in-own-style play needs, and consider what was missed.

**ACT NOW (done, mocked and dry-run only):** the runner now has three more passes, `rules`, `people`, `texture` (C1 to C3), prompt mode at high effort, with their own output files (`<prefix>_rules.jsonl`, `_people.jsonl`, `_places/_services/_news/_customs.jsonl`) and a label and locator lint in collect (no migrate, no grade, no repair). Dry-run plans on `w3s33`: [rules](plans/ab_w3s33_rules.json), [people](plans/ab_w3s33_people.json), [texture](plans/ab_w3s33_texture.json), each about $0.012 estimated at 45,000 output tokens. `tests/lead_run_batch.test.js` 17 pass. Nothing submitted; each live batch needs its own go and cap.

What the new schemas hold, beyond the first round's lists:
- **Rules** carry `consequences` (trigger, response, by whom): the world's reaction to an act, taken from precedents in the text. This is the source for "what happens if I do X".
- **People** carry `reacts` (response to a kind of action), `knows` with a `since`, and `reveals` (two names, one person), which the strict per-shard reader cannot otherwise resolve.
- **Texture** carries `within` (containment), `hours`, `access`, `affordances` (action class, what, needs), `routes` with minutes, dated `news` (public or private), and `customs`.

**ACCOUNT FOR NOW (new angles, F-codes):**
- F1 **Affordance matrix**: place by action class (the 14 classes in the card). Build it at the merge from scenes, options and texture rows. An empty cell where a class should be possible is a fill job. This is the direct "can the player live by trade, craft, study, fight here" check; propose it as completeness measure M10 beside M1 to M9.
- F2 **Sources other than the novel**: the wiki dump already holds structured rules (sequence tables, potion formulas, ranks). A batch over wiki pages with the same rules schema is cheaper and more complete than reading prose for mechanics, and a novel-versus-wiki disagreement is a conflict row for the audit. Label wiki rows `nameSource: wiki` and keep provenance per row.
- F3 **Early shards cannot know later reveals**: a reader forbidden outside knowledge labels an identity `U` that chapter 150 settles. Needs a late **identity and relabel pass** at the merge (merge `reveals` rows, upgrade `U` and `I` labels where a later shard states it) before any consumer reads volume 1 as one world.
- F4 **Tiered models by value**: Haiku for census, scenes, texture; Sonnet (about 10x per token, still cents a shard) only for shards the census flags as dense in laws, rituals or abilities, and for the lead's own mechanism. Add a router that reads the census counts, not a blanket upgrade.
- F5 **Two census runs and a union**: recall is the weak lever (0.78 exact on new entities at medium). A second medium run unions at about $0.011 a shard; whether the union beats one high-effort run is untested (A/B on `w3s33` and the pilot shards).
- F6 **Automated consumer probe**: the 20 own-style questions of G3 can be answered by a Haiku batch reading only the merged rows; every "cannot answer" names a missing field. Cheaper and repeatable after each schema change.
- F7 **English names**: the game shows English, but new entities get model-made labels (`pinyin-unconfirmed`). Labels need a consistency pass at the merge (one label per id, the wiki title where it exists), or the same person appears under three spellings in the UI.
- F8 **Variable facts and slots**: identities, secrets and twists are what a changed or randomized world swaps. Mark rows that are twist-bearing (`sealed` ids exist for scenes; census and rules rows have none) so the randomizer and the sealed-secrets rule can find them. Public franchise twists are not sealed; changed ones are.
- F9 **Provenance and rollback**: headers carry reader model, pass and date; add effort, plan hash and schema version so a bad wave can be isolated and re-run without touching agent-graded shards (batch prefixes already cannot collide).
- F10 **Non-lead point of view**: chapters from other people's view give routines and attitudes the lead never sees; the people pass should read them like any other; scenes with `pov` not lead stay census-only by design.

**LATER / DELEGATE (additions):**
- F2 wiki rules batch: code is the existing runner with a wiki-page shard builder; level sonnet; done when one sequence table yields rule rows that agree with the novel's.
- F1 and F3 and F7 are merge-script features (C5): include in that lane's brief; done when the merged volume 1 has an affordance matrix, relabelled identities and one label per id.
- F4 router and F5 union: A/B on the pilot shards after the pilot passes; effort: one lane each; done check: recall and rule-support rate per dollar against the current default.
- F6 probe batch: after the merge exists.
- A/B of the three new passes on `w3s33` (about $0.036 in all) needs your go: "Go on the w3s33 rules, people and texture batches, cap $0.05 each."
