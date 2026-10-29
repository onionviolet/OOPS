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

## 11. Round 7: record everything, consider gaps after (2026-10-28)

Weibao's direction ([record](../../../USER_VISION.md#readers-record-everything-gaps-come-after-2026-10-28)): readers record everything; the project considers gaps afterwards, for implementation toward a full playthrough. Applied to the runner the same day; mocked tests 28 pass (batch and merge files); nothing sent.

| Change | Where | Effect |
| --- | --- | --- |
| Passes 3-5 get a shared **record, never invent** instruction: completeness over polish, no proposals, fills or alternatives the text lacks; anything that fits no field goes to `other` with its ids | `batch_lib.mjs` `RECORD_TEXT`, schemas | Nothing is lost to the schema; invented rows stop entering the record |
| **Labels T, S, I, U** in passes 3-5 (stated, shown, implied, unsettled), every sub-row with its own locator (K7) | schemas, `lintExtra` | An implementer copies provenance per field |
| **Rules in recipe shape** (K1): inputs as item, qty, unit and role (main, auxiliary, tool, catalyst, fee); products; minutes; place; costs with amount and unit; ritual needed, scale and steps; `worldKind`; `spell` kind added | `RULE` schema | Rows map to the shared process envelope (`defineProcess`) for any world, not only LOTM (X4) |
| **People routines as days, from, to, place, what** (K8) | `PERSON` schema | "Where is X at nine" has a time to answer from |
| **Candidate coverage** (K2, by script, not by the model): the amounts, times and measures the script finds in each shard, checked against the census; rate in the collect summary and shard header | `candidateCoverage` in collect | Omission becomes a number per shard, free |
| `other` rows written per pass (`<prefix>_rules_other.jsonl` …) and loaded by the merge | collect, `merge_shards.mjs` | Catch-all facts reach the merged record |

Dropped from the readers: K3 (asking Haiku for two alternatives per choice). Alternatives are gap work, done afterwards from the rows (options-and-needs lane), not recorded as if the text gave them. Census and scenes are unchanged: they were tuned live and the pilot tests them as they are; scenes `fills` stay labelled `authored-proposal` and are treated as replaceable, and dropping them from the scenes pass is a pilot-round decision, not made blind.

Gap work afterwards (LATER, owners as in sections 9-10): the merge, then the packet builder (N5) lists unknowns per topic (N8), the gap probe (Q1-Q20) names missing fields, and alternatives, fills and counterfactuals are authored from the record, each labelled as authored.

## 12. Round 8: implementers read the source through the index (2026-10-28, accepted by Weibao)

Weibao asked why Haiku reads at all if Sonnet could implement from the text; he accepted this answer ("Sounds good, save idea accordingly, Build it"). **Haiku records; the implementer reads the source where it matters.** Rows are the index (ids, locators, cheap, read once per shard); the merge and topic packets gather the rows for one implementation topic; the implementer (a Sonnet-level session) then opens the **cited paragraphs** in the private shards and implements from the prose, checking each row against its source. Judgment stays on real text, row errors do not propagate, and nobody re-reads 200 chapters per topic. Omissions are caught by the coverage count (section 11) and plain text search over the shards.

Tool: `scripts/lead_run/cite_paragraphs.mjs` prints, for ids or a topic, every cited paragraph from the private shards (with optional neighbouring paragraphs). Output is source text: read it locally, never commit it. Consequence for the schedule: Sonnet batch scale-ups (T2-T5, NOV1_SCHEDULE) matter less, because the implementer gets Sonnet-quality reading of exactly the passages it builds from; run them only where the A/B shows a large gain.

## 13. Round 9: whole books and the long-term workflow (2026-10-28)

Weibao: "save and improve the batching thing as a long term workflow, can we cover the entire book for each? how come Harry potteter and MOL would be 7$? More to consider?" The procedure now lives in [BATCH_READING_WORKFLOW](../../../research/BATCH_READING_WORKFLOW.md).

ACT NOW (done):

| Code | Finding | Done |
| --- | --- | --- |
| W1 | The Harry Potter PDF split ran books 3-6 together (four more heading forms) and kept a contents list as 21 empty chapters | Splitter takes all five forms and drops empty chapters: 17, 18, 22, 37, 38, 30, 36 chapters, numbered in order; year 1 shards unchanged byte for byte |
| W2 | Batch census rows put an evidence label (S, I, U) in `label` (the display name): 144 of 150 rows on one shard, so a merged registry would be labelled "S" | Prompt says what `label` is; migrate derives the name for new rows; merge ignores evidence labels in old rows (960 batch ids merged, 0 evidence-letter labels) |
| W3 | LOTM chapter numbers restart in each of its 8 volumes, so volume 2 would collide with volume 1 locators and cited paragraphs | `zh bV 第N章 pM` for volumes after 1 (volume 1 unchanged), headers carry `| book V`, cite keys by volume |
| W4 | Price amounts the reader wrote into notes ("[5 pounds]") failed lint | Migrate parses the bracket; nothing is guessed |
| W5 | MoL scenes used `spell` and `rules` as touched kinds | Touched takes rule kinds; appendices say never `rules` |
| W6 | Waves of 10 shards with a fixed chapter count could not cover whole books before Nov 1, and dense shards truncated | `books.json` plus `make_book_plans.mjs`: size-grouped shards, skip-done plans, a pilot per new book, one step per pass per world, true-bound caps |

ACCOUNT FOR NOW:

- A1. A world's gate stops all its books: one bad Harry Potter book halts the other six. Accepted for this round (safer); split the run file per book if that costs a night.
- A2. Books in one step read their census in parallel, so volume 3 does not see volume 2's names in its known-names table; ids can diverge across volumes. The merge's proposed overlay folds same-name proper ids; review it before use.
- A3. The scenes grade also lints the shard's census rows, so a census fault shows twice; repair the census first, then regrade.
- A4. Measured spend is computed from the runner's price table. Ceilings leave about $16 of the month's credit unassigned as margin.

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| L1 Source acquisition (what is still missing is listed in [LIBRARY_INDEX](../../../research/LIBRARY_INDEX.md#not-on-disk-or-unverified-the-one-pending-list); Shadow Slave 1841-2260, Circle of Inevitability, TTKS and A Soldier's Life 1-6 were already on disk, done below) | haiku lookup, then sonnet; small | Sources in the library; rows added to the index and `books.json` |
| L2 (done 2026-10-28) `html` and `json` adapters for EPUBs without NCX, `asl` and `coi` appendices and profiles | sonnet, small | Shards split with chapter counts matching the edition (below) |
| L3 Second census arm (union) for LOTM volumes 2-8 on next month's credit | plan only | Recall measured against the first arm |
| L4 Monthly pacing: each month, rerun `make_book_plans.mjs` and spend that month's credit on what is left plus repairs | GM routine | Run files dated per month |

Gap closure (2026-10-28, no API call): a Calibre `metadata.db` search found all of it already catalogued. Keys, shards and true-bound caps from `make_book_plans.mjs --prepare` (no run files written; each needs Weibao's go):

| Keys | Source | Chapters | Shards | Cap total |
| --- | --- | --- | --- | --- |
| `asl1`-`asl6` (world `asl`) | Calibre ids 55, 56, 57, 58, 112 and the book 4 .mobi converted | 1-58, 59-121, 122-181, 182-243, 244-319, 320-384 (384, none empty or missing) | 21, 21, 22, 27, 35, 25 | $12.99 (1.80, 1.82, 1.90, 2.32, 3.00, 2.15) |
| `ss9` (world `ss`) | Calibre id 35, "Shadow Slave Novel Vol 9" | 1841-2260 (420, contiguous) | 69 | $5.91 |
| `ss11` (world `ss`, beyond scope) | Calibre id 37, volume 11 | 2721-3000 (280) | 51 | $4.37 |
| `coi` (world `coi`, English) | Calibre id 34 | 1-1179 minus the skipped 1026 (1,178; afterword 1180 cut) | 295 | $25.16 |
| `ttks1`-`ttks5` (one world each, Chinese, traditional script) | ttks.tw captures in `docs/research/novels/ttks-novels-2026-10-10/B1-B5`; B2 and B3 chapters 1-10 from the Fanqie free text | 111, 665, 429, 206, 668 (contiguous from 1, none empty) | 60, 333, 215, 103, 668 | $113.31 in all (4.95, 27.27, 17.62, 8.50, 54.97); `ttks5` alone is about half |

No `overPromptCap`. Books 2, 3, 5, 6 and `ss11` have a contents list or numbering quirks (`Chapter: 103 Title`, `Chapter 98 Title`); the splitter handles them and the chapter counts match the editions' own ranges. A Soldier's Life book 4's conversion keeps its headings but not its volume title. `coi` is the largest at about 1,800 words per chapter; its chapters do not need to be read in one go, and the pilot gate applies as for any new book.


## 14. Round 10: what the pilot and gates do and do not test (2026-10-28)

Weibao: "is pilot to test for mistakes and stuff and then driver sends full thing? more to ocnsider?" Yes: a one-shard pilot (census and scenes) per new book, then each pass in full, with a stop check after every step. Today the pilots caught four format faults for cents (locator form, English lint, `duration` kind, name form) before any whole-book pass.

ACCOUNT FOR NOW:

| Code | Finding | Evidence | Constraint |
| --- | --- | --- | --- |
| P1 | Gates test form, not truth: grade B means valid locators, names printed where cited and clean lint. Nothing checks that a row's claim matches the paragraph | 745 of 747 batch shard headers have `spotChecked: 0` | Treat batch rows as an index to the source, never as facts, until spot-checked; the implementer reads the cited paragraphs (round 8) |
| P2 | A one-shard pilot catches systematic faults but cannot measure rates: truncation (5-10% of shards) and parse failures show only in the full step | Mother of Learning census: pilot clean, full pass 9 of 105 `max_tokens` | Every run ends with a retry step for failed shards (128K, `--tag`), not a pilot rerun |
| P3 | The pilot uses each book's first shard, often an atypical opening (few names, a prologue POV) | `hp1c001`, `molc001` pilots are chapter 1 | Pilots should add the densest shard by candidate count |
| P4 | Passes 3-5 (rules, people, texture) are never piloted; their stop rule counts failures only, so a prompt-mode fault spreads to every book of a world before it shows | `hp4c020-scenes` `json-parse`; people truncated 2 of 36 in Stage A | Accepted for now; the per-step stop rule still halts at 20% failures |
| P5 | Drivers load code at launch, so a lint fix needs a relaunch; relaunching re-collects from receipts and resends nothing | Four relaunches today | Simulate the gate offline (`sim.mjs` pattern) before relaunching |

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| L5 Spot-check lane: per book, sample 20 rows across kinds, fetch each cited paragraph with `cite_paragraphs.mjs`, and mark the row supported, partly supported or unsupported; write `spotChecked` and a support rate into the headers | haiku readers on bounded paragraphs, sonnet to judge disagreements; small per book | Every finished book has a support rate; books under an agreed rate get a re-read |
| L6 Pilot picks the first and the densest shard | generator change, small | Pilot plans list two shards for a new book |
| L7 Fold the offline gate simulation into the driver (`--regrade-only`) | small | One command regrades a stopped run without the API |
| L8 Retry step written automatically at the end of each run file for failed and truncated shards | generator change, small | Run files end with a `retry` step |

### First spot-check: Mother of Learning (2026-10-28, L5 started)

Weibao: "Yes, spot-check". 24 rows sampled across passes (census 6, scenes 5, rules 5, people 4, places 4; seeded), each judged by a haiku reader against its cited paragraphs only. Rows citing more than four paragraphs were re-judged with every cited paragraph. Packets and verdicts are private (`spotcheck_mol_2026-10-28*.jsonl` in the book's private folder).

| Result | Count |
| --- | --- |
| Supported | 12 (census 4, rules 5, people 1, places 2) |
| Partly: main claim holds, one secondary field not in the cited text | 12 (census 2, scenes 5, people 3, places 2) |
| Unsupported | 0 |

| Code | Finding | Disposition |
| --- | --- | --- |
| SC1 | Every row's main claim matched the text; no invented events or people | Rows are a trustworthy index to the source, as round 8 assumes |
| SC2 | The misses are secondary details without their own citation: a scene outcome or duration (all 5 scene rows), a person's trait, want or attitude, a place's containing place, an exact count where the text says "several" | Implementers treat uncited secondary fields as leads to check in the chapter, not facts. Prompt candidate (next month's runs): every step, outcome, anchor, trait and want carries its own locator, and vague amounts stay vague in the note |
| SC3 | Rules rows (5 of 5) were fully supported | Rules rows are the most reliable pass |

## 15. Round 11: the other books, settings and budget (2026-10-28)

Weibao: "send out the ones for other books as well, more to consider? updated rules and more? rr books? Stuff like perfect run and the others?"

Evidence at 13:55 EDT. Harry Potter and Shadow Slave whole-book runs finished. HP cost $8.94: census 149 B and 19 C, scenes 155 B and 19 C. Shadow Slave cost $18.20: census 300 B and 49 C, scenes 319 B and 55 C. Failures by pass, HP then Shadow Slave: census 10 and 26, scenes 4 and 1, rules 0 and 1, people 43 and 30, texture 0 and 1. Measured spend across all `_summary.json` files is $34.62; that is a lower bound, since earlier batches may lack summaries. The r3 run files for the retries and the new books were written at 13:25 (`385c91889`): `2026-10-28r-asl` (ceiling $11), `-hp` ($3), `-mol` ($1), `-ss` ($12). All use 128K and the pooled stop rule, with people at high.

ACT NOW:

| Code | Finding | Disposition |
| --- | --- | --- |
| RB1 | The LOTM ceiling went from $30 back to $35 (`d98832322`, following the handoff table). That undid the 13:25 trim. LOTM $35 plus measured spend plus all four r3 ceilings comes to about $96.6, over the $95 line | Send r-hp, r-mol and r-asl now (about $84.6). Send r-ss once LOTM census has measured spend, still before the Oct 31 noon deadline |
| RB2 | The driver stops when spent plus a step's caps passes the ceiling. Projecting 55% measured per step, LOTM reaches people under $35 and stops before texture ($9.81 of caps) | Accepted: LOTM texture runs on November's credit. A relaunch resumes from receipts and resends nothing |

ACCOUNT FOR NOW:

| Code | Finding | Disposition |
| --- | --- | --- |
| RB3 | Texture at high effort and 64K failed 0 of 179 HP shards and 1 of 375 Shadow Slave shards | No texture setting change; 128K is headroom only |
| RB4 | r-ss puts the Shadow Slave retries (the densest shards) in the same steps as volumes 9 and 11 under the pooled rule | Acceptable: even if half of the 26 census retries fail, that is 13 of 144 shards, under 20%. A `step` waiver would also waive the new books, so do not add one there |
| RB5 | The input-size check found the largest shard at 40K tokens and none near the 100K price step | No re-sharding. Split only shards still cut off at 128K (round 11 pilot, NOV1 WR5) |

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| RB6 Hero works for a batch index in November or later: You Are Summoned 1-5, Godclads 1-2 and Wish Upon the Stars 1-8 (Calibre EPUBs); The Perfect Run and Super Supportive (Royal Road JSON captures). All five already have full agent reads and cards, so the index adds paragraph citations, not a first read. Rough measured cost from Mother of Learning's $4.70 for about 0.7M words: about $0.7-0.8 per 100K words, about $33 for the five (Perfect Run 0.48M, You Are Summoned 0.66M, Godclads 0.46M, Wish 1.05M, Super Supportive 1.51M) | sonnet; register the EPUBs in `books.json` and run `make_book_plans --prepare` offline; convert the two JSON captures into a private EPUB or HTML copy, as A Soldier's Life book 4 was, rather than adding an adapter | The five keys have plans and true-bound caps; nothing sent |
| RB7 Default November order: LOTM texture, Circle of Inevitability, TTKS 1-5, then the hero works. At true bounds this passes $100, but at measured rates (50-60%) the first three fit and the hero works start | Weibao's call on order only | One go per run file |
| RB8 Retry HP and Shadow Slave texture failures (0 and 1 shards) and any r3 shards still cut off at 128K, by splitting the shard | generator, small | Retry plans list split shards |

## 16. Round 12: schema 1.4, finishing the prime books, shards to gameplay (2026-10-28)

Weibao: "Start schema work, lets finish up the prime ones, considering gaps we can pull from the text but then also what info from the book we can get to address those? Send new chat to look into turning the shards into gameplay, following the goal of first creating everything the protraginist interacted with to go through their own stories?"

ACT NOW (done):

| Code | Finding | Disposition |
| --- | --- | --- |
| SV1 | Price links were broken. Of 491 Mother of Learning and 717 HP `services` rows, 476 and 685 hold free-text `price` ("none stated", "a pretty penny"), and 0 resolve to a census price row | Schema 1.4 adds `kind`, `amount`, `unit`, `per`, `priceId` and a three-way `priceStated` to services (READING_GAP_MAP PG1) |
| SV2 | A schema change landing unconditionally would change what approved runs send on a relaunch, and would mix two schemas in one book | 1.4 is opt-in per plan (`schemaVersion: '1.4'`). Existing plans rebuild byte-identically to the requests already sent (checked against the HP people requests). `d37049ebf` |
| SV3 | 1.4 fields: `recurrence` and `until` on routine slots (PG2), `since` on relations (PG8), `acquire` on rules (PG3), rule kind `reset` with `reset` (PG4; named to avoid `loop/1.2`, which owns the lead's gameplay loops), `enforcement` (PG9), and three-way `costStated` (PG6). All are optional and omitted when the text is silent; an inferred pattern takes label I | Lint checks the new enums when present, and that a stated price has a number. Tests: 82 lead_run tests pass; full `npm test` passes 3,629 of 3,629 |
| SV4 | A new session, [Turn reading shards into gameplay](#local_8464a2d9-9ecb-4dd8-8f78-2d4bb62d6b72), owns importing the index into game state (everything the lead touches gets its own story; WA22-WA24) and owns `merge_shards.mjs` runs | This session sends it the 1.4 field names and does not merge |

ACCOUNT FOR NOW:

| Code | Finding | Disposition |
| --- | --- | --- |
| SV5 | More fields mean more output. The 2x-estimate cost rule already stopped dense retries | Set `outTokensAssumed` for November from the 1.4 pilot's measured output |
| SV6 | The prime books already read lack 1.4 fields. A whole re-read is not worth the cost | Re-read only shards whose existing rows point at prices, routines, teachers or resets (selected from the merged index), priced from the pilot |

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| SV7 Regenerate the November plans (`2026-11-01-*`, COI, TTKS) with `schemaVersion: '1.4'` once the pilot settles the fields | generator flag, small | Plans carry 1.4; caps re-sized |
| SV8 Targeted 1.4 re-read list for Mother of Learning, HP, Shadow Slave and LOTM, from merged rows (prices, teachers, resets, routines) | sonnet, medium | A plan per book with a measured bound |

### Schema 1.4 direct pilot (2026-10-28, Weibao: "Go, cap $2")

11 calls at high effort and 128K: 6 HP people shards (the same as the effort pilot), 3 Mother of Learning rules chapters with loop-reset paragraphs, and 2 texture chapters (Diagon Alley, Mother of Learning chapter 5). Cost $0.28 direct. All 11 completed with 0 lint issues.

| Code | Finding | Disposition |
| --- | --- | --- |
| SV9 | People output rose about 5% over the 1.4-less high/128K arm (378K against 360K tokens across the 6 shards) | Keep `outTokensAssumed` at 32K for caps; the cost rule's 2x estimate needs the measured per-pass rate, not a guess (see SV5) |
| SV10 | `recurrence` was filled on 49 of 132 routine slots (9 inferred, label I): 20 once, 14 daily, 6 irregular, 4 term, 2 weekly, 2 yearly, 1 weekdays. A sample read sensibly ("weekdays" for Vernon's work, "term" for Percy's prefect duty) | Accepted as working |
| SV11 | `since` on relations: 3 of 451 (books rarely date an attitude) | Keep; merge ordering by locator (PG8) carries most of the timing |
| SV12 | Rules: `acquire` on 6 of 26 rules, with teacher, practice, progress sign and ceiling where shown. All 3 loop chapters produced a `reset` rule (trigger, resets, keeps). `costStated` on 24 of 26. `enforcement` on 1 of 5 laws | Accepted as working |
| SV13 | Texture: 7 of 22 services carry typed prices (Diagon Alley: 5 Knuts a scoop, 17 Sickles an ounce, 21 Galleons each, a 5-Knut delivery fee); the other 15 are marked `not-mentioned` instead of "none stated" | Accepted as working |

## 17. Round 13: finish LOTM, then the rest of October (2026-10-28)

Weibao: "We can fix LOTM, and then do the rest? Splot accordingly? Address each of the tihng ti consider?"

| Code | Consideration | Disposition |
| --- | --- | --- |
| C20 | LOTM's 48 census and 7 people cut-offs happened at medium effort with 128K, so effort is not the lever | Done: `make_split_retry.mjs` splits each cut-off shard into one-chapter shards. The first chapter keeps the old prefix and replaces the partial output; later chapters get their own chapter prefix, which the census pattern already matches. Run `2026-10-28s-lotm`: 110 requests, true bound $3.59, sent (`702bda147`). LOTM volume 1's 6 wave-plan census failures use another shard scheme and stay on the November retry list |
| C21 | Measured spend from summaries leaves out the direct pilots ($0.57, added by hand), and the dashboard lags | The chain keeps $1 under the $100 credit (the $99 test) and $95 for runs with a ceiling below their bound |
| C22 | Near the deadline the last book should be unable to overrun | Godclads' ceiling is set to its true bound ($13.38). It is sent only if measured spend plus that bound is at most $99 |
| C23 | Cheap set-up checks for November: a direct Reverend Insanity Gu check (about $0.30) and a medium-census pilot (C13, about $0.30) | Next, from whatever remains after Godclads, or first thing in November |
| C24 | November order | Circle of Inevitability, then the Shadow Slave rerun with its pilot gate waived, then the retry list: LOTM volume 1's 6 census shards, HP's 2 broken people replies and 3 census partials, A Soldier's Life's 14 census partials, all at split or medium |

Chain (scratchpad `chain2.sh`, PID 35762): after the Perfect Run, the RI pilot and the LOTM split retry exit, resume `r-asl` for texture if measured spend plus $5.01 is at most $95, then send Godclads under C22. Both must go before Oct 31 noon.

### Round 13 follow-up: last October checks (2026-10-28, Weibao: "Go, cap $3")

| Code | Finding | Disposition |
| --- | --- | --- |
| C25 | Godclads finished all five passes for $3.95 (ceiling $13.38); 9 census shards came back cut off | Split retry `2026-10-28g-gc`: 18 one-chapter requests, true cap $0.60, ceiling $0.61. The first launch stopped before sending because the driver summed $0.33 + $0.27 past a $0.60 ceiling; `make_split_retry.mjs` now defaults the ceiling to the total plus a cent |
| C26 | Reverend Insanity Gu check (C23) | Answered from the October rows for $0 instead of a paid call. The 1.4 rules pass on chapters 1-100 gave 368 rows, 179 about Gu: refining recipes with inputs, quantities and steps (`Refining a Gu`, 6 steps), feeding upkeep (31 rows), fusion and combination recipes (10), rank gates (28), `costStated` on 145 of the 179. `acquire` is on 2 Gu rows, which fits the text: a Gu's power comes with owning and feeding the Gu, not with learning. The schema fits Gu without a change |
| C27 | Medium-effort census (C13), direct, 6 shards (RI 2, Godclads 2, HP 2), $0.09, plus a high-effort rerun of the same 6 as a noise baseline, $0.13 | Two high runs overlap only 72% by name (lead-touched 94%), so census output varies run to run. Medium: 40% less output, 20% fewer rows, 64% overlap with the October high rows (lead-touched 85%). Medium loses about 9 points of lead-touched recall, which the cast-lives goal needs. **Keep census at high.** Matching is by normalized name and aliases, so all recall figures are lower bounds |

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| C28 Because two high runs disagree on about a quarter of rows, two medium runs merged (about 1.2x one high run) may beat one high run on recall. Test the union on the same 6 shards before any November census at scale | direct pilot, about $0.10 | Union recall against both high runs reported per shard |

### Round 13 follow-up 2 (2026-10-28, Weibao: "send accordingly")

| Code | Finding | Disposition |
| --- | --- | --- |
| C25a | Godclads split retry `2026-10-28g-gc` spent $0.16. 17 of 18 one-chapter shards came back whole; `gc2c007` is still cut off as one chapter | `gc2c007` joins the November retry list (next lever: lower effort or a half-chapter split) |
| C28r | C28 run: a second medium census arm on the same 6 shards, $0.08. One medium run: recall 0.64-0.73 against the October high rows, lead-touched 0.85-0.91. Two medium runs merged: **0.79**, lead-touched **0.95**. One high rerun: 0.72 and 0.94. The merged pair costs about 1.25x one high run | Proposed November default: census as two merged medium runs on the books the gameplay session imports first (LOTM, MoL, RI, COI); a single high run elsewhere. Merge must dedupe by normalized name and aliases |
| C29 | Sonnet A/B on `w3s33`, batch, $0.20 (Haiku about $0.01-0.02 a pass on the same shard). Census: 135 rows against Haiku's 126, 85% overlap both ways; Sonnet marks 39 rows touched by the lead against Haiku's 10. Scenes: 7 scenes, 5 options, 3 choices against Haiku's 6, 7, 6; Sonnet's options carry a class and needs (`ritual`, needs the Fool) where Haiku's say `other` | No blanket Sonnet. Haiku under-marks `touchedByLead`, which the cast-lives goal keys on. One shard is a thin sample |
| C30 | SV8 targeted 1.4 people re-read, run `2026-10-28sv8`, $0.16: LOTM chapters 1-24 (9 shards) and MoL chapters 1-4, all 13 ok. Against the 1.3 rows: 197 people (was 166), `recurrence` on 65 of 132 routine slots, a reacts class on 172 of 181 reacts. But fewer raw rows: 132 routine slots (was 205), 181 reacts (was 295) | The 1.3 rows are kept in each book's `pre-sv8/`. The gameplay merge should union the two by person and slot, taking 1.4 fields where present |

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| C31 Sonnet relabel pass: Sonnet re-judges only `touchedByLead` and option class and needs over Haiku's rows (small input), first on 3-5 more shards against `w3s33`'s result | direct pilot, about $0.30 | Lead-touched marks and option classes compared per shard with cost per shard |

### Last October runs (2026-10-28 evening, Weibao: "Send next stuff for the rest of the moneey left"; "Send the rereads and other stuff accordingly", passing $95 approved)

Measured October total after these: **$95.53** (summaries plus $1.06 of direct pilots and the Sonnet A/B).

| Code | Run | Result |
| --- | --- | --- |
| C32 | Retries `2026-10-29h-hp`, `2026-10-29a-asl`, `2026-10-29v1-lotm` | $0.42. HP 5 of 5 ok; LOTM volume 1 chapters 154-156 and 178-180, 6 of 6; A Soldier's Life 37 of 38 (one still cut off) |
| C33 | Reverend Insanity volumes 2-4 (chapters about 101-400), `2026-10-29-ri234` then `2026-10-29-ri234t` | $4.35 for census, scenes, rules and people (390 ok, 7 cut off); the pooled ceiling stopped texture as predicted, which ran alone afterwards for $0.77 (98 ok). RI is read through about chapter 400 |
| C34 | LOTM volume 1 schema 1.4 re-read `2026-10-29sv14-lotm`: people chapters 25-213, rules and texture for all 72 shards, and a second medium census of 31 shards (prefixes suffixed `x2`, C28) | $2.60; 232 ok, 2 cut off. Old rows backed up to `pre-sv14/` |

November retry list adds: `gc2c007` census (already one chapter), RI volumes 2-4's 7 cut-off shards, A Soldier's Life's 1, LOTM sv14's 2.
| C35 | Mother of Learning rules and texture at schema 1.4, 64K max output, `2026-10-29sv14-mol` (Weibao: "send next stuff accordingly") | $1.57; 212 of 212 ok, none cut off at 64K. Old rows backed up to `pre-sv14/`. October measured total **$97.09**; the credit is spent |
| C36 | Last retries `2026-10-29r2-retries`: RI volumes 2-4's 7 cut-off census shards split to one chapter, `asl6c352` and `gc2c007`, all at medium effort (Weibao: "send accordingly") | $0.12; 23 of 24 ok, including both single chapters that had cut off at high, so medium effort fixed them. `ri2c105` is still cut off. LOTM's two `x2` partials were left out (duplicate census). October measured total about **$97.21** |

### Local model for the rest of the books? (2026-10-29, Weibao: "would it be optimal to use local ai to try and read the rest and then audit after?")

| Code | Finding | Disposition |
| --- | --- | --- |
| C37 | Pilot: `local_census_lane.py` (scratch copy patched for English chapter headers) on `qwen3.8:27b` through Ollama, RI chapters 104 and 105, seed 7, temperature 0.3. 42 s and 84 s per chapter, free memory 83% to 81%, swap flat; $0. Rows: 36 against batch 40 (35 shared) and 73 against the cut-off batch reply's 51 (48 shared). But the brief's known-name table is built from the existing census files, which include these chapters' own batch rows, so the overlap is inflated and is not a recall measure. The model's own rows are thin: notes read "Mentioned by name.", and 21 of 73 rows on chapter 105 are Gu ranks filed as `measure` | Quality on RI stays unmeasured; the independent figure remains the LOTM reader test (87-93% census recall, census lane only) |
| C38 | Reading the rest locally is not the better route. The local lane covers census only; scenes, options, fills, rules, people and texture stay out of reach (reader test, capacity doc LA13). Census is about a fifth of batch spend: for RI chapters 401-2334 that is about $5 of the about $25 cloud bill, for about 30 hours of Mac time at about one minute a chapter, with an 18-19 GB model resident and a cloud audit still needed | Default: November batch reads at measured rates (RI about $1.3 per 100 chapters, covered by the monthly credit). Local lanes take post-processing on batch rows, which the capacity doc already routes: LA9 routine-time fill, LA12 tagging with a known-answer sample, and a free first pass on a cut-off chapter (`ri2c105` gave 73 rows) before a paid retry |

### Round 14: clean recompare and how far local models go (2026-10-29, Weibao: "recompare? more to consider? We can change the DSH profile for local Ai, consider how much we can use the local ai?")

ACT NOW (done):

| Code | Finding | Disposition |
| --- | --- | --- |
| C39 | Clean recompare. Briefs rebuilt with known names from RI volume 1 only (`censusMatch ^ri1c…m_census`), the realistic setting for reading forward, so no answer leaks in. 6 three-chapter shards across volumes 2-4, `qwen3.8:27b`, seed 7, temperature 0.3. **Recall of the batch high rows 0.43** (per shard 0.35-0.65), **lead-touched 0.55**; 85% of local rows match a batch row and 95% have their label in the text; 23% of notes are "Mentioned by name." By kind: person 69%, item 57%, organization 46%, creature 33%, place 31%, measure 7%, calendar 6%, law 0 of 6. 3-7 minutes a shard (about 1.5 minutes a chapter), 318 rows against the batch's 941 | C37's overlap was the leak. On RI the local census lane is a partial reader, well under the LOTM reader test's 87-93% (that test scored against a narrower reference) |
| C40 | New dsh profile `local` (`~/.dsh/profiles/local`, copied from `headless`): the agent and subagents default to `ollama-local / qwen3.8:27b` with reasoning off; cloud models stay selectable; `headless` and `web` are unchanged. Smoke test `dsh local "Reply with exactly the word OK"`: OK in 33 s | Use it for single-shot extraction or tagging tasks with a schema; a 27B model with a 16-32K context is weak at multi-step tool use (capacity doc LA13), so it is not an agent default for repo work |

ACCOUNT FOR NOW:

| Code | Consideration | Disposition |
| --- | --- | --- |
| C41 | Auditing local reads costs about what reading costs: a cloud check has to read the same chapter text, which is most of the input, and the batch output it would replace is cheap ($1.3 per 100 RI chapters) | No local-first-then-audit route for the main five-pass read |
| C42 | Memory is shared with the other lanes. Free memory fell from 84% to 48% while the coordinator's wave ran; the model holds 18-19 GB | LA11 gate per batch (start at about 40% free or more, abort under 15%), one model, no local run beside a build or browser floor |
| C43 | Where local helps, in order: free first pass on a cut-off chapter before a paid retry; tagging or classifying existing rows against a known-answer sample (LA12); routine-time fill after the script step (LA9); a candidate list for a cloud reviewer. All work on rows the batch already wrote | These stay the local routes |

LATER / DELEGATE:

| Item | Level, effort | Done check |
| --- | --- | --- |
| C44 Local as the free second reader for C28: union one medium batch census with one local census pass and compare against two merged medium runs on the same 6 shards. If the union comes close, November's census saves one medium run per shard | local pilot, 30-45 minutes of Mac time, $0 | Union recall per shard against the high rows, beside the two-medium figure |
| C45 Local tagging pilot on reacts classes (`reacts_classified.jsonl` keyword baseline), 50 rows through `dsh local` or the Ollama API | local pilot, 15 minutes, $0 | Agreement rate with the baseline; disagreements read |

C44 result (2026-10-29, Weibao: "Run C44"):

| Code | Finding | Disposition |
| --- | --- | --- |
| C46 | Local census (`qwen3.8:27b`, seed 7, temperature 0.3) on the 6 C28 shards, with briefs taken from the original batch requests (nothing leaked), $0, 4.5-5.5 minutes a shard. Recall of the October high rows, all 6 shards: local alone **0.48** (lead-touched 0.66); one medium run 0.64 (0.85); **medium + local 0.73-0.78 (0.89-0.93)** over the two medium runs; two medium runs merged **0.79 (0.95)**; one high rerun 0.73 (0.94). `gc1c003` hit the lane's 8,000-token output cap and kept 17 rows | Medium + local roughly matches one high run on recall but trails it and the two-medium merge on lead-touched rows, which the cast-lives import keys on. The saving is one medium run, about $0.013 a shard (about $8 across RI's remaining 650 shards), for about 50 hours of Mac time. **Two merged medium runs stay the proposed default**; medium + local is the fallback when credit runs short |

## 18. Round 15: local settings sweep and the November touch-up pass (2026-10-29, Weibao: "consider various settings too", "consider if multiple passes could be effective too")

Sweep: `qwen3.8:27b`, the 6 C28 shards, briefs from the original batch requests, $0, scored by `_local-eval/c45.mjs` against the October high rows (554 rows, 148 lead-touched). Recall is the share of high rows whose zh or label a local row matches. Mac time is the sum of shard wall times, with other lanes running and the memory gate pausing twice, so treat hours as upper-ish bounds.

| Code | Arm | Recall (lead-touched) | With one medium run | Out tokens, rows | Mac time |
| --- | --- | --- | --- | --- | --- |
| C47 | `c44`: seed 7, temp 0.3, think off, cap 8K (C46 arm) | 0.482 (0.662) | 0.727 (0.892) | 41.2K, 408 | 30 min |
| C47 | `b12`: same, cap 12K | **0.536 (0.736)** | 0.727 (0.905) | 41.3K, 503 | 58 min |
| C47 | `s2`: seed 11, temp 0.5, cap 12K | 0.500 (0.703) | 0.731 (0.919) | 37.3K, 432 | 53 min |
| C47 | `t1`: thinking on, cap 12K | 0.227 (0.365) | 0.675 (0.865) | 145.1K, 154 | 204 min |

| Code | Finding | Disposition |
| --- | --- | --- |
| C48 | **Thinking on is a loss.** Recall drops from 0.54 to 0.23 at 3.5x the time and 3.5x the tokens; the reasoning eats the output budget and leaves 154 rows against 503 | Keep thinking off. Do not retry with a bigger cap |
| C49 | **Cap 12K beats 8K by +0.05 recall (+0.07 lead-touched)**, mostly on the dense shards (`gc1c003` no longer truncates). The wall-time gap (30 vs 58 min) mixes the cap with machine load, since the 8K arm ran with fewer other lanes; per-shard time at the same load is not measured | Keep 12K, the driver default |
| C50 | **Multiple local passes do not pay off.** `b12+s2` (two readers) gives 0.570 (0.791), +0.034 and +0.055 over `b12` alone, for double the hours. Three readers (`b12+s2+t1`) reach 0.581 (0.791). With a medium batch run underneath, a second local pass adds +0.017 recall and +0.027 lead-touched (0.727 to 0.744; 0.905 to 0.932), and a third adds +0.007 more | One local pass. A second local pass is the weakest use of Mac time; a cloud touch-up (C51) targets the same misses directly |
| C51 | **Settings winner: seed 7, temperature 0.3, thinking off, `--predict 12000`.** Medium + local is 0.727 (0.905), level with C46's 0.727 (0.892): the extra cap mainly raises local-alone recall, not the union | The overnight queue runs these settings under tag `n1` |
| C52 | A numbers-only second pass (measures, prices, calendar, clock) was not built. C39 found these kinds the weakest (measure 7%, calendar 6%), but the lane's candidate list already seeds them, so a second prompt likely re-finds the same candidates; the fix is a prompt rewrite, not a settings change | LATER: try on the 6 kit shards in a scratch lane copy after the queue; done check is measure and calendar recall on the kit against C39's 7% and 6% |

### Proposal (not accepted): November cloud "touch-up" census pass

Labeled a proposal. Only Weibao accepts; no cloud call is sent without his go phrase.

**Shape.** For each shard with local rows, one batch request on Haiku (medium effort) whose brief adds a section "Rows already found (do not repeat)": the local rows as a compact table (id, zh, kind, locator, note, about 25 tokens a row). The model returns only (a) rows the table misses and (b) corrections to table rows, each marked `fix:<id>` with the corrected fields. Everything else it leaves out. The merge script applies local rows, then additions, then fixes, and rewrites ids to one scheme.

**Why it saves.** Output is about 97% of batch spend (round 3 caching analysis). A full medium census returns roughly the whole row set; the local pass already holds about half of the high rows and 74% of the lead-touched ones. If the touch-up returns only the other half plus corrections, output falls by an estimated 35-50% per census shard [I, not measured]. Input rises by the local table (about 400 rows x 25 tokens = 10K for a dense shard), billed at input rates and cached across the shard's passes if the table sits in the shared prefix, so net saving is below the output saving. Rough figure: census is about a fifth of batch spend, so the touch-up saves about 7-10% of a book's total, not more [I].

**Risks to price in.** (1) Anchoring: seeing local rows may make the model skip rows near them, lowering recall of the union below two merged medium runs (0.79, lead-touched 0.95). (2) 23% of local notes are "Mentioned by name." and 15% of local rows are not in the batch rows; the touch-up should replace such notes, not repeat them. (3) The local ids use the lane's slug scheme, not batch ids; the merge must renumber. (4) Local rows with `nameSource: pinyin-unconfirmed` must stay flagged.

**November pilot (named, small).** Six kit shards, medium effort, one request each, about $0.08 total at the C46 rate [I]; run after Weibao's go. Compare the union (local `b12` + touch-up) against two merged medium runs (0.79 / 0.95) on recall and lead-touched recall, and record output tokens per shard against a plain medium run (the C13 replies). **Pass:** union recall at least 0.77 and lead-touched at least 0.93 with output tokens at most 60% of a plain medium run. **Fail:** keep two medium runs as the default (C46).

**Other passes.** Scenes, rules, people and texture pass 2 get the local census table as the known-name list, so ids stay consistent without waiting on the batch census. This replaces the batch census rows in those briefs only after the pilot passes; until then the batch census stays the id source.

### Overnight queue status

Started 2026-10-29 07:42 on `coi_census.json`, then `ri5_census.json`, tag `n1`, `--min-free 35`, process group 97531 (details and log in the [handoff](LOCAL_OVERNIGHT_HANDOFF_2026-10-29.md)). It resumes after a stop; the 294 COI shards need about 25-60 hours at the measured 5-10 minutes a shard. Rows stay in the gitignored `local-census/` folders.
