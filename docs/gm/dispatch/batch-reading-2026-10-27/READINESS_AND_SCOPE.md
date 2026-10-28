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
- F4 **Tiered models by value**: Haiku for census, scenes, texture; Sonnet (20x per token: about $0.20 a shard for a medium census) only for shards the census flags as dense in laws, rituals or abilities, and for the lead's own mechanism. Add a router that reads the census counts, not a blanket upgrade.
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

## 7. Round 3: Sonnet, and the long term (2026-10-28)

**Is Sonnet better?** Not tested at the settings that matter. The only Sonnet run was census at *low* effort (20 reader rows, new-entity recall 0.26): it tested effort, not the model. Price is 20x Haiku per token ($2 and $10 against $0.10 and $0.50 per million), so a medium census on Sonnet costs about $0.20 a shard (about $7 for volume 1 per pass) and a Sonnet scenes pass at high effort about the same. Haiku's observed failure is omission (recall, options, choices), which effort, a second run and the script fill reduce cheaply. Sonnet's expected gain is judgment (fewer invented fills, better inferred labels, rules read correctly), which is what mechanics and the merge need. **Default: Haiku for passes 1, 2 and 5; Sonnet for the rules pass on dense shards, the people pass on shards with a major cast, the merge, relabel and counterfactual synthesis, and the 10% support check.** One A/B decides the rest, on `w3s33`: Sonnet census at medium and Sonnet scenes at high, about $0.45 in all, judged on quality per dollar against the Haiku rows and the agent run (new-entity recall, options, fill support rate by Sonnet check). It needs a go.

**Long-term considerations (L-codes):**
- L1 **The binding cost is human and merge effort, not tokens.** Spend extra API dollars to save audit hours (a better model on judgment passes) before spending audit hours to save dollars.
- L2 **Golden set**: keep 5 graded shards per book (3 chapters each, rows checked by a stronger model, a sample by Weibao) and re-run them whenever the model, prompt or schema changes. Without it nobody can tell an improvement from drift. `w3s33` is the first.
- L3 **Versioned everything**: prompt text, schema, model id, effort and plan hash in each header (F9). Models get replaced; a cheaper or better one is adopted by re-running the golden set and, if it wins, re-reading at pennies per shard.
- L4 **Re-read is cheap, so design for it**: outputs are disposable, plans and source shards are the assets. Never hand-edit batch rows; corrections go in an overlay file keyed by id so a re-read does not lose them.
- L5 **Storage and backup**: the private folders are gitignored and hold the only copy of paid-for rows and of copyrighted request files. Back up outputs (not request files) outside the repo; the API keeps results 29 days only.
- L6 **Credits pacing**: $100 a month; campaign totals of $60 to $100 mean planning across months. Keep one running ledger across batches (label, date, dollars) and a per-month cap in the go phrases.
- L7 **Cross-world ids**: a namespace per world (`lotm.`, `hp.`) exists; crossovers and transmigration (WER) need a world-level registry so a shared fact (a calendar, a currency) is not re-minted per book.
- L8 **Licensing and provenance**: the wiki is community text (usually share-alike); rows derived from it need attribution and stay out of any public export. Source shards are copyrighted; only counts and ids leave the private folder.
- L9 **Privacy of the source**: shard text goes to Anthropic's API under its terms. If that changes for a held book, the same plans can run on a local model for the mechanical passes (the local-AI reader test) with a different client only.
- L10 **Consumer-driven schema**: every field names the engine consumer that reads it (a pack record, a bot assertion, a beat resolver). A field with no consumer after the probe is dropped, not collected for later.
- L11 **Model drift**: new Haiku or Sonnet releases change output length and thinking cost; re-measure `outTokensAssumed` on the golden set each time.
- L12 **Human review budget**: Weibao's acceptance is the real gate (AD42 allows "agent-verified, not human-reviewed"). Offer a ten-row right-or-wrong sheet per wave instead of asking him to read shards.

## 8. Round 4: reconciling the local-AI reader report (2026-10-28)

Source: [LOCAL_AI_READER_TEST_2026-10-27](../../../research/LOCAL_AI_READER_TEST_2026-10-27.md) (its commits `04a5b968d`, `1f06e8361`, `dfd25333d`, `977adee69`; its stage-2 design S2-a to S2-d and rows A4 to A6). Its own-style verdict agrees with section 1 here: names and amounts are not enough. Where the two plans overlap, the table says which one owns the work.

| Item | Local report says | Batch plan answer |
| --- | --- | --- |
| Census | Local `qwen3.8:27b` lane: 87 to 93% recall against haiku, name index only, 3 seeds share about 77% of names, about 4 of 12 extra rows are generic nouns | The batch census costs about $0.011 a shard and keeps full rows, so local census adds nothing for volume 1. Keep the local lane as the fallback if API privacy or credit ends (L9). Its noise-row tag (texture, not filter) is worth adopting: tag generic items `texture` instead of dropping them. |
| Scripted fields | `claimant` from scene evidence kinds (`dialogue:<who>`, `thought:<who>`); `touchedByLead` and M1 `whereabouts` from scene `touched`, `present`, `place` | Adopt as merge-script steps (C5): zero cost. Our batch scenes already emit the evidence kinds (and the speaker-kind repair keeps them valid). |
| Options and their `needs` | Haiku `needs` mostly empty; S2-c: Sonnet writes at least two alternatives per choice with needs that resolve to census ids | **Measured here:** batch scenes at high effort: 6 options, 3 with `needs` (agent run 7 and 2); every choice lists exactly two options (one untaken alternative). So the gap is real and unchanged: run S2-c as a **batch** pass, not an agent pilot (half price, no usage window). |
| Voice, procedure, tech | Haiku wrote 0 rows; S2-d proposes script-pulled paragraphs, local Qwen, Sonnet fallback | Covered by the rules pass (procedure, tech, consequences) and the people pass (speech, reacts). Same idea, one runner. |
| Off-lead NPC lives | Sonnet after the lead spine merges; belongs to the NPC-absence work | The people pass reads the shard text per person (routine, relations, knows). Merge its rows with the NPC-absence lane's card, do not build two. |
| Readiness gate | Each lead scene with a choice has two alternatives with resolved needs; each person with enough mentions has voice; each located person has whereabouts | Adopt as measures M11 to M13 beside M10 (affordance matrix), counted in READING_STATUS by the coordinator. |
| Why the gaps were missed | Voice and procedure were optional on the card; the two-pass reader was rejected for cost (PLAN 21.4); the follow-on ledger of untaken options (PLAN 13.7) was never scheduled | Rule for the future (L10 extended): a field or follow-on that the plan names must have a pass, a gate and an owner in the plan, or be struck out. A named-but-unscheduled step is the failure mode. |

**New angles from this round:**
- R1 **Options pass as a batch, Sonnet** (S2-c): input one merged scene row plus its cited paragraphs, output at least two alternatives per choice, each with `needs` resolved to census ids, labelled `I` (authored alternatives, replaceable). Run after the id merge so needs do not point at duplicate ids. Cost: a scene is a few thousand tokens, so a Sonnet batch for volume 1 is likely under $2 [I]; measure on `w1s16` and `w2s20` first, as the local report proposes.
- R2 **Resolve-rate as a gate**: share of `needs` and scene-referenced ids that resolve to census rows (local report: 16 of 23 and 9 of 13 before the id list was fed to the reader). Batch plan already passes the glossary; add the resolve rate to the collect summary so a low rate flags a shard.
- R3 **The Anthropic credit expires Nov 10** (local report A4). That is a deadline for spending, not a reason to spend: order the work so the pilot and volume 1 (about $2 to $4 all passes, including Sonnet lanes) fit well inside it, and treat anything beyond volume 1 (other books) as using the monthly credit afterwards.
- R4 **Play check**: no reader output proves the data supports play. The G3 probe is the proxy; the real check is the scripted lead bot (M3) and Weibao playing. Keep the probe questions in a file so each schema change re-runs them.
- R5 **Tuning risk applies to us too**: the batch settings were tuned on `w3s33`. The 3-shard pilot is the guard; add a 5-locator spot check per pilot shard.

**Disposition:** ACT NOW: this section. ACCOUNT FOR NOW: R2 (a small collect change, not done yet), R5. LATER / DELEGATE: R1 (Sonnet batch plan after the merge; level sonnet; done when options per choice at least 2 and needs resolve above 70%), M11 to M13 in READING_STATUS (reading coordinator), noise-row `texture` tag in the merge. No Sonnet or other paid run was started.

## 9. Round 5: better Haiku requests, and reading for the implementer (2026-10-28)

Asked: would adjusted Haiku requests do better, how should readers serve later implementation so the implementer reads rows instead of the book, and what does implementation need that no pass collects. Proposal from the Opus reviewer; nothing here is accepted and no batch was sent. Evidence: `batch_lib.mjs` schemas and prompts, `src/dose_process.js` (`defineProcess`), `src/lotm_formula_rows.js`, `src/book_world_lotm_lives.js`, the merge run in [NOV1_SCHEDULE](NOV1_SCHEDULE.md) section 1. [S] seen, [I] inference.

**Main finding.** Runtime LOTM data is built by agents reading the book into hand tables (the potion table behind `lotm_formula_rows.js`, the life profiles with `[494 p20]` cites), not from reader rows [S]. The rows we are about to pay for do not match those shapes: a runtime process has slots `{role, item, qty, unit, amount, evidence}`, `minutes`, `price.pence`, `product`, `ritual {needed, scale, text}` and evidence per field [S]; the batch `rules` row has `inputs`, `costs`, `steps` as free strings with one label and one locator per row [S]. So an implementer could not build a `defineProcess` row from a rules row without re-reading the book. Fixing the request shape costs nothing per batch; fixing it after the Stage A waves costs a re-read.

**Request changes for Haiku (K-codes).** Haiku fails by omission, so the levers are focus, checklists and structure, not a bigger model.

| Code | Change | Why | Cost |
| --- | --- | --- | --- |
| K1 | **Rules rows in runtime shape**: `inputs` as `{item id, qty, unit, role main/aux/tool/catalyst, label, locator}`; `minutes` (or band) and `place`; `product` id; `ritual {needed, scale, steps}`; per-field label and locator instead of one per row | Lets `defineProcess`, price, ritual and ability records be built from rows (N1) | Prompt and schema edit, mocked test |
| K2 | **Coverage receipt**: each request already gets the script's candidate table (amounts, times, measures); require one entry per candidate, either a row id or `skip:<reason>` | Turns silent omission into a visible, script-checked gap; a missing receipt flags the shard | Small; checked in collect |
| K3 | **Choice checklist** in the scenes pass: every choice lists at least two options; every option names its `needs` ids or `needs: none` explicitly | Haiku gives exactly one untaken option and mostly empty needs [S, section 8] | Prompt line; lint count |
| K4 | **Merged registry as the glossary** (overlay applied, one label per id), plus a short state capsule (who is where, last stated date) from the previous shard | Fewer duplicate ids (88 Chinese names under two or more ids today), better dates (7 of 316 scenes absolute) | Script change in `glossaryFromPlan`; needs the overlay reviewed |
| K5 | **Smaller shards where dense** (2 chapters instead of 3 when the agent run had 10 or more scenes) | Same tokens, more attention per scene; avoids `max_tokens` on dense shards (C8) | Plan-level; prepare_shard split |
| K6 | **One worked example** (invented fixture text, not source) per extra pass in the cached system prefix | Shows the shape and the level of detail; cached, so about free | Prompt edit |
| K7 | **Evidence tags aligned with runtime**: reader `S` splits into shown versus stated (runtime uses S shown, T stated, W wiki, I inferred) | An implementer copies the tag instead of re-judging it (N4) | Label enum change, merge maps it |
| K8 | **People pass time grid**: routine slots as `{weekday or "daily", from, to, place id}` instead of a free slot string | Q1 "where is X at nine in the evening" needs a time, not "evenings" | Schema edit |

What not to change: census and scenes settings (tested), and the two-pass shape. A second census run (F5) stays a pilot question.

**Reading for the implementer (N-codes): what implementation needs.**

| Code | Need | Today | Proposal |
| --- | --- | --- | --- |
| N1 | Process recipes (brewing, crafting, rites) with quantities, roles, minutes, products | Hand potion table | K1 rows, then a script that writes draft `defineProcess` rows with per-field evidence, marked as reader-made |
| N2 | Prices and wages in one unit | Census `price` rows with free units | Merge normalizes to pence with the world's units table; canon value kept beside the scaled one (as DWF129 does) |
| N3 | Lives: pay, rent, terms, papers, what a role permits | Hand life profiles with cites | Rules `institution` rows and texture `services` feed a life-profile packet |
| N4 | Provenance per field so authored proposals stay distinct (WPR5) | Runtime tags S/T/W/I; readers S/I/U | K7 plus a locator converter (`zh 第494章 p20` to `[494 p20]`) in the merge |
| N5 | **Implementation packets**: one file per topic (processes, prices, lives, places with hours and routes, people schedules, calendar, beats), generated from merged rows with locators, open questions and contradictions listed | Implementer reads the book or raw jsonl | Packet builder script after the merge; this is the interface an implementer reads, not the jsonl |
| N6 | Contradictions across shards (a price or identity revised later) | Not detected | Merge lists same-id field conflicts by chapter; the later statement wins unless sealed |
| N7 | Twist-bearing rows marked (F8) so sealed secrets and randomized worlds can find them | Only scenes have `sealed` | Marker on rules and people rows; the packet hides them from summaries |
| N8 | Unknowns as fill jobs: an empty affordance cell, a price with no value, a rite with no failure result | Implicit | Packet lists them; an implementer authors a proposal or asks the reader again |

**Disposition.**
- ACT NOW (this round): this section; the main finding goes to [NOV1_SCHEDULE](NOV1_SCHEDULE.md) as a precondition note.
- ACCOUNT FOR NOW: K1, K2, K3, K7 and K8 change the schemas and prompts of passes that have never run live; doing them **before** Go 1 means the $2.6 of Haiku rules, people and texture waves (and any Sonnet scale-up) come back in the shape the implementer needs. Estimated effort: one sonnet-level lane, about 2 to 3 hours with mocked tests, then a fresh dry run of the Stage A plans. The census and pilot labels in Go 1 do not depend on it and can go first.
- LATER / DELEGATE: K4 after the overlay review (sonnet, 1 hour, done when a v1 wave dry-runs with the merged glossary); K5 split of dense shards (sonnet, 1 hour); N1, N2, N4, N5, N6, N8 packet builder (sonnet lane, about half a day, done when a processes packet yields at least 5 draft `defineProcess` rows that validate); N7 with the sealed-secrets owner.

## 10. Round 6: the requests beyond LOTM volume 1 (2026-10-28)

Asked: how the requests (passes 1-5, K1-K8, the merge, packets) work for other books: LOTM's later volumes, LOTM 2 (Circle of Inevitability), and the English books. Proposal; nothing sent. Evidence: counts of LOTM- or Chinese-specific lines per runner file (`shard_tools` 33, `batch_lib` 19, `merge_shards` 10, `lint_lead_run` 8, `migrate_shard` 5, `prepare_shard` 2, `audit_shard` 0) [S]; schema card 1.3 puts LOTM money units in the shared card [S]; runtime LOTM ids are `book.lotm.tingen…` while reader ids are `lotm.place.tingen` [S]; the HP pack cites `B1:PDF-pN` and the MoL pack carries its own reset rules [S].

**What carries over unchanged:** the two-pass shape, the effort settings (to be re-measured per book), the plan, submit and collect runner, the caps, the stop rules, the action classes, labels S, I and U, and the merge's registry logic. A new book is a profile plus a pilot, not a new runner.

| Code | Issue beyond LOTM volume 1 | Consequence | Proposal (default, dial, reason) |
| --- | --- | --- | --- |
| X1 | **Source-script name field.** The census key is `zh`, and the merge folds by Chinese name | English books have no `zh`; folding by name breaks on titles, possessives and case | Rename to a source-name field with a per-language **name key**: Chinese as printed; English lowercased, titles and articles stripped, possessive dropped. Surname-only mentions ("Potter") never fold alone; family names are ambiguous |
| X2 | **Locators are LOTM-shaped** (`zh 第N章 pM`); LOTM after volume 1 restarts chapter numbers per part; HP cites PDF pages | Lint fails on every English row; later LOTM locators collide | A structured locator `{book, part, chapter, para}` stored internally and rendered per pack (`[494 p20]`, `B1:PDF-p111`). Part selection in `prepare_shard` is the LOTM-after-volume-1 gate (PLAN section 2) |
| X3 | **Units and money live in the shared card** | HP Galleons, Sickles and Knuts; A Soldier's Life pay and rations; Shadow Slave soul-based currency get the wrong unit rules | Split the card: a generic card plus a **world appendix** (units with conversion, kinds, calendar, special structures). The appendix sits in the cached system prefix per world, so it costs about nothing |
| X4 | **Kinds and rule kinds are LOTM-tilted** (rite, potion, ability, craft, law, custom, institution) | HP spells and potions with wand movements, Shadow Slave Aspects, Flaws, Memories and Echoes, Reverend Insanity Gu, MoL soul magic and shaping skills fit badly | Keep the generic enum and add `worldKind` (free text, mapped by the appendix). K1's recipe shape targets the **shared process envelope** (`defineProcess`, used beyond LOTM), not a LOTM table |
| X5 | **Structure differs by book.** The resolver assumes one timeline | MoL: a month that repeats (knowledge carries, the world resets). Shadow Slave: a waking world and a Dream Realm, and Nightmares as separate instanced scenarios. LOTM later volumes: the lead under several personas. Circle of Inevitability opens with a repeating-days arc (public premise). HP: school terms. A Soldier's Life: a campaign calendar | Scene fields from the appendix: `loop` (index and reset scope), `realm`, `persona` (the lead acting under a cover identity, still `pov: lead`). The timeline resolver keys by (loop, realm, date). The people pass records routines per loop or realm. One merge, with world switches |
| X6 | **The model knows famous books.** "Record only the shard" is harder for HP than for a translated web novel | Later-book knowledge leaks into early rows: wrong facts and spoilers in the sealed-secret sense for changed worlds | Keep the rule. For famous books, raise the **fact check** from 10% to 20% of rows on the first shards, and lint rows whose fact has no locator inside the shard. Leakage rate per book goes in the pilot report |
| X7 | **Token density.** English is about 1.3 tokens a word, Chinese about 1 a character | Shard sizes and `outTokensAssumed` measured on LOTM do not transfer | Size shards by tokens from the profile; measure output on each book's one-shard pilot (G6, L11) |
| X8 | **Name detection in English.** Glossary hits are substring matches | "Ron" matches inside other words; "the Professor" is a title, not a person | Word-boundary matching with the alias list; titles go to the relational set per language |
| X9 | **Two id universes.** Runtime packs use `book.lotm.tingen…` and their own HP and MoL ids; readers mint `lotm.place.tingen` | Rows cannot attach to existing pack records; an implementer would map by hand | An **id crosswalk** per world (reader id to pack id), seeded from existing pack records. Each world's glossary also seeds from its pack ids, so implemented worlds (HP, MoL, Shadow Slave) reuse ids from the first shard |
| X10 | **Editions differ in trust.** Circle of Inevitability is an unauthenticated English scrape; A Soldier's Life book 4 is missing; HP has PDF pages | Locator stability and provenance vary | G6 stands: settle the edition first. The profile records the edition hash; a scrape gets a lower provenance tier in packets |
| X11 | **Lead definition.** `pov: lead` assumes one protagonist | Interludes and side POVs (LOTM, Shadow Slave, Circle) | F10 stands: non-lead POV chapters feed census, people and texture, not lead scenes. The appendix names the lead and their known personas |
| X12 | **Series continuity.** LOTM volume 2 onward and Circle share a world and some people across books | Re-minting a shared person or currency per book | One registry per world (`lotm.`), carried across volumes. Circle uses the same world namespace with an era field; crossovers follow L7 |

**Effect on the current plan.**
- ACT NOW: none. Stage A and the volume 1 waves are LOTM-only and unaffected.
- ACCOUNT FOR NOW: when K1 lands, target the shared process envelope and add `worldKind`, so the rules shape does not need redoing per book (X4). Keep `zh` for now. The rename to a source-name field (X1) belongs to the language profile, with a migration in `migrate_shard`.
- LATER / DELEGATE:
  - **World profile lane** (X1-X5, X7, X8; supersedes the "English adapter"): language, locator, name key, units, kinds, structure switches, card appendix. Level sonnet, about a day. Done when one HP year 1 shard and one MoL chapter lint clean and merge.
  - **Id crosswalk** (X9): sonnet, half a day. Done when 20 LOTM reader ids map to pack ids and the HP glossary seeds from the pack.
  - **LOTM part-aware locators** (X2): sonnet, a few hours. Done when chapters 214 onward shard without locator collisions.
  - **Famous-book leakage check** (X6): folded into the fact-check lane.
- **Order beyond volume 1, unchanged in value:** HP year 1 (smallest; tests the profile), MoL (tests `loop`), LOTM volume 2 onward (needs part locators; reuses the registry), then Shadow Slave (realms) and A Soldier's Life. Circle of Inevitability after its edition is settled. With four days left, only the profile lane plus HP year 1 and MoL are realistic before Nov 1. The rest runs on the monthly credit.
