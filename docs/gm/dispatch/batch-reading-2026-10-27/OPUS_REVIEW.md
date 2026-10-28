# Opus review: batched reading, state and next steps (2026-10-27)

**Superseded in part (2026-10-28):** the credit expires Nov 1, so [NOV1_SCHEDULE](NOV1_SCHEDULE.md) replaces section 4's order and section 5's go phrases. The merge (lane L1) is built. Sections 2, 3, 6 and 7 stand.

Reviewer: Opus-role session, reading [OPUS_HANDOFF](OPUS_HANDOFF.md), [REFLECTION](REFLECTION.md), [PLAN](PLAN.md) 5-6a, [READINESS_AND_SCOPE](READINESS_AND_SCOPE.md) 1-8, `scripts/lead_run/batch_*.mjs` and `tests/lead_run_batch.test.js` (17 pass, rerun today). Labels: [S] seen in files or commands, [I] inference. **No live submit, no key read, no spend.** Dry runs of `pilot3_census`, `pilot3_scenes` and `ab_w3s33_rules` still work.

## 1. Verdict

The method is right in shape: Haiku records, scripts fill and merge, Sonnet judges small inputs, Opus decides schema. Four changes make it faster and cheaper in Weibao's time:

- **D1. Build the merge now, on shards that already exist.** 47 agent-read, migrated shards with headers (grades: 5 C, 1 A, 41 B) and 155 census files sit in the private folder [S]. The merge (C5, F1, F3, F7) needs no new batch to be written and tested. The handoff lists it as stage 2, after the pilot; it should start today.
- **D2. Run the gap probe on what exists, not after volume 1.** Pilot shards plus agent shards are enough to ask the question list. The probe decides schema 1.4; it should not wait for 31 more shards (G3 is currently behind G2).
- **D3. Sonnet is cheap relative to the credit; the expiry argues for using it, not hoarding.** Credit expires Nov 1 (corrected 2026-10-28 by Weibao; first written as Nov 10). Volume 1 with every Haiku pass and every Sonnet lane is $2 to $4 of $100. Test Sonnet at settings that matter (medium census, high scenes) once, on two shards, so the model choice is evidence and not the low-effort accident.
- **D4. Fewer round trips for Weibao.** Independent labels can share one go phrase (precedent: "Go on batches ab-w3s33-full and ab-w3s33-census, cap $0.05 each."). Two phrases cover the whole next stage.

## 2. What I agree with

- A1. Two-pass Haiku shape, census medium strict, scenes high prompt mode (PLAN 6a). Evidence is n=1 but the effort effect is large and consistent.
- A2. Gate on new-entity recall, reader rows only; script fill is a floor, not credit.
- A3. Waves of about 10 shards, a `--max-usd` on every submit, `<label>_usage.csv` as cost record, never the Console.
- A4. Rules, people, texture built but held until a probe says which earn a place in schema 1.4 (L10). Building froze nothing.
- A5. Sonnet gets rows plus cited paragraphs, not whole shards. Right unit.
- A6. Opus only at decisions. Right.

## 3. What I would change or challenge

| Code | Challenge | Change |
| --- | --- | --- |
| C1 | **The pilot glossary leaks and is not comparable to `w3s33`.** `pilot3_census.json` takes every graded census except the three pilot shards, including shards after chapter 105 (`censusMatch` lists w2s2x and w3s30-32 for a ch 40-42 shard) [S]. Entities first met in ch 40 that recur later are already "known", so the new-entity denominator shrinks and the 0.75 gate is judged on a different, smaller set than the 0.78 it copies. | Keep the plan, but report the **denominator per shard** and pool if a shard has fewer than 10 new entities. A shard with fewer than 5 is "insufficient evidence", not a pass. Do not rewrite the glossary: production glossaries (ch 121-213) will also hold only earlier shards, and the recall number is internally consistent with what the model saw. |
| C2 | **The reference is agent output, not truth.** Recall measures agreement with one Haiku agent run. Sonnet or a second Haiku run may find real entities the agent missed, and the metric calls that a miss or a bonus depending on direction. | Pilot report adds "found only by batch" count and a **10-row right/wrong sheet** per pilot shard for Weibao (L12), optional per AD42; absent it, say "agent-verified, not human-reviewed". |
| C3 | **Rules, people and texture have no ground truth, so an A/B on `w3s33` cannot grade them.** `lintExtra` checks labels and locators only. | Do not A/B them alone. Run them on `w3s33` in the same go as the pilot census (cheap, $0.036) but judge them by the **question list** (section 6), which is the instrument. Write the list first. |
| C4 | **Gap observation by Sonnet is an LLM guessing what is missing.** It can invent gaps. | Make it two-step: a **script** answers each question mechanically from merged rows (field present, count, resolve rate) and marks unanswerable; Sonnet then explains each unanswerable, with the cited paragraph, and proposes the field. Run on about 6 shards (2 pilot, `w3s33`, 3 existing agent shards), not all 31. The schema decision needs a sample, not a census. |
| C5 | **`weight: great` inflation** (4 of 7 vs 1 in the agent run) is parked as a spot check. | Make it a pilot criterion: per shard, share of `great` at most 40% of scenes, else flag. Cheap, scripted in compare. |
| C6 | **Pilot scenes plan was dry-run before the pilot census exists**: glossary hits show 312 (same as census) because `p15m` etc. do not exist yet [S]. | After the census collect, **re-run the dry run** before the scenes go. Already noted in PLAN; make it step 2b in the order below, and re-check the estimate against the cap. |
| C7 | **Options-and-needs as an agent-free Sonnet batch is right, but its input needs the merge.** Needs must point at merged ids or the resolve rate is meaningless. | Order it after D1. First dry run on `w1s16` and `w2s20` as the local report proposes. |
| C8 | **Truncation is a real risk on dense shards** (scenes used 38,364 of 48,000 on a 6-scene shard; `p25` has about 13 scenes) [S]. Pilot uses 64,000. | Keep. Add to collect: a `max_tokens` result on scenes is logged as "split shard" not "repair", and the summary names the shard (already `parseMessage` error; add the advice string). |
| C9 | **Resolve rate is only a plan note (R2).** | Build it (lane L3 below); it is the cheapest quality signal and works for every pass. |
| C10 | **Hedge against tuning to one shard (R5).** | Agree, and add the 5-locator spot check per pilot shard, done by the script (random locators; count how many the quoted row's claim sits in the cited paragraph for names). |

Not changed, but worth stating: I would **not** run the union-of-two-census (F5), the router (F4) or the wiki rules batch (F2) before the probe. They are optimizations of passes that may not survive.

## 4. Ordered next steps with cost

| # | Step | Who | Cost | Gate to proceed |
| --- | --- | --- | --- | --- |
| 1 | Merge script lane L1 (below), tested on the 47 existing shards | Code lane, sonnet | $0 | Unique ids, one label per id, M1/M2 run |
| 2 | Write the question list (section 6) and the scripted answerer | This review plus code lane L2 | $0 | List agreed by Weibao only if he wants to edit; default proceeds |
| 3 | **Go 1**: pilot census on 3 shards **and** rules, people, texture on `w3s33` (4 labels) | Haiku batch | about $0.034 + $0.036 = **$0.07** | Weibao's phrase 1 |
| 4 | Collect all four; report per-shard grade, new-entity denominator and recall, `great` share, cost vs 2x | Script, then this reviewer | $0 | Pilot rule: each shard A or B, new-entity recall at least 0.75 (or pooled), within 2x of $0.022 |
| 5 | Re-run `pilot3_scenes` dry run on the new census (C6) | Script | $0 | Estimate under cap |
| 6 | **Go 2**: pilot scenes | Haiku batch | about **$0.036** | Phrase 2 |
| 7 | Collect; resolve rate; probe on 6 shards (script answers, then Sonnet explains the gaps) | Script + Sonnet batch | probe about **$0.30 to $0.60** | Phrase 3 for the Sonnet label |
| 8 | **Opus decision**: freeze or amend schema 1.4 (G4); decide which of rules, people, texture survive | Opus | one call | Probe output |
| 9 | Sonnet A/B on 2 shards: census medium and scenes high | Sonnet batch | about **$0.40 to $0.80** | Phrase 4; cap per label |
| 10 | Volume 1 (31 shards), waves of about 10, passes that survived step 8 | Haiku batch | about $0.69 base passes plus $0.03 per extra pass per shard (about $1 for three extras) | One phrase per wave |
| 11 | Sonnet options-and-needs and dense-shard rules/people, then 10% fact check | Sonnet batch | about $1 to $3 for volume 1 [I] | Per label |
| 12 | Other books: English adapter first (G5), then one book at a time | Mixed | per book, see PLAN 4 | Per-book go and cap |

Total through step 9: about **$1.5 to $2.5**, all inside the credit window. Steps 10-11 add $2 to $5. Nothing here approaches the $100.

Two things to avoid: running volume 1 before step 8 (extra passes may change the schema, wasting merge effort, the real cost per L1), and running Sonnet on every shard before step 9 shows it earns its 20x.

## 5. Exact go phrases (ask Weibao before each; none has been given)

1. **Go 1:** "Go on batches pilot-3-census, ab-w3s33-rules, ab-w3s33-people and ab-w3s33-texture, cap $0.06, $0.05, $0.05 and $0.05." Caps are above each dry-run estimate ($0.034 and about $0.012 each). Label names come from the plans' `label` field; confirm they match before submit.
2. **Go 2** (after collect and the step-5 dry run): "Go on batch pilot-3-scenes, cap $0.06."
3. **Go 3** (probe batch, plan file written after merge): "Go on batch gap-probe-sonnet, cap $0.80."
4. **Go 4** (after step 8): "Go on the Sonnet census medium and Sonnet scenes high batches on w1s16 and w2s20, cap $0.50 each." Plan files not written yet; write them after the probe so shards are chosen by the dense-shard counts.

The submit CLI already refuses a repeated label without `--resubmit`, so a second phrase cannot double-pay by accident.

## 6. Probe question list (draft, 20 questions; the instrument for G3/G4)

Each is answered by script from merged rows as `answerable`, `partial`, or `no`, with the missing field named. Group by what a different-style player does.

| Q | Question | Pass or field expected to answer it |
| --- | --- | --- |
| Q1 | Where is named person X at nine in the evening on day D? | people routine slots, scene whereabouts |
| Q2 | What does this rite or potion need, and what happens if it fails? | rules: inputs, failure, limits |
| Q3 | What does a night's lodging cost here, and who runs it? | texture services, prices |
| Q4 | What happens if the lead skips this beat? | outcomes, rules consequences, counterfactual per arc |
| Q5 | Can I make a living by trade in this place? | affordance matrix F1 |
| Q6 | What would this person say to a stranger, and what do they know? | people reacts, knows |
| Q7 | Who is the same person under two names, and when is that revealed? | `reveals` |
| Q8 | What hours does this place keep, and who may enter? | texture hours, access |
| Q9 | How long between place A and place B? | routes with minutes |
| Q10 | What does the law do if I do X in public? | rules consequences, customs |
| Q11 | What is on the news this week, and what is secret? | dated news public/private |
| Q12 | For this choice, what are two alternatives and what does each need? | options with resolved needs |
| Q13 | What do I need to learn this skill, and who teaches it? | rules procedure, people |
| Q14 | Which facts here change if the world is randomized? | twist-bearing marker F8 |
| Q15 | Which currency and what does bread cost? | texture prices, units |
| Q16 | What can this ability do, cost, and not do? | rules ability conditions |
| Q17 | What is the danger of this place at night? | texture, customs, rules |
| Q18 | Who would notice if I vanished for a week? | people relations, routines |
| Q19 | Which rows are authored proposals, and how many per shard? | fill layer count |
| Q20 | Which ids does this scene reference that do not resolve? | resolve rate |

## 7. Code lanes, start order

| Lane | Work | Done check | Level |
| --- | --- | --- | --- |
| L1 (start first) | **Cross-shard merge** (C5): one id registry across batch and agent shards, anchors to calendar dates, one label per id, late identity relabel from `reveals` (F3, F7), `claimant` from evidence kinds, `touchedByLead` and whereabouts from scenes, `texture` tag instead of dropping generic items. Work from a copy; never hand-edit rows (L4). | The 47 existing shards merge to one registry with unique ids; M1 and M2 run; an overlay file holds corrections | sonnet |
| L2 | **Gap-observation plan and scripted answerer**: reads the question list, merged rows, writes `answerable/partial/no` plus missing field; then a Sonnet batch plan (`gap-probe-sonnet`) that gets only the unanswerable rows and their cited paragraphs. Dry-run only until Go 3. | Answerer runs on 6 shards; plan dry-runs with an estimate under $0.80 | sonnet |
| L3 | **Resolve rate in collect** (R2): share of `needs` and scene-referenced ids (present, touched, place, speaker) that resolve to the shard's census plus glossary; add to the summary and header; flag a shard under 0.7. Also add the `great` share and the new-entity denominator to `batch_compare`. | Test in `lead_run_batch.test.js`; the 17 existing pass | sonnet |
| L4 | **English adapter** (G5): per-world profile (locator form, header pattern, quote guard in words, candidates, units). Independent; start after L1 and L3 so lanes do not touch the same files. Done when a Harry Potter year 1 shard lints clean. | `check:arch` and a lint fixture | sonnet |

L1 and L3 touch different files (merge script vs `batch_lib`/`batch_compare`), so they can run together; L2 depends on L1's output shape. One writer per file area. Merge with the NPC-absence lane's card rather than building a second people store (handoff open question).

## 8. Risks and honest gaps

- R1. Everything above rests on `w3s33` plus the pilot; if the pilot fails on one shard, the response is effort or a second run on that shard, not a new method.
- R2. Prompt-mode JSON on long output can fail to parse; a truncated scenes result needs a lower-effort or split re-request, not a repair.
- R3. Fills from Haiku are invented. Consumers must treat `authored-proposal` as replaceable; the 10% check should count fills separately.
- R4. Source text of held books goes to the API. Weibao's standing choice; outputs and request files stay private and gitignored.
- R5. No play check yet. The question list is the proxy; the scripted lead bot (M3) and Weibao playing are the real test.
- Not verified by me: the Console dashboard gap (I7, needs Weibao's workspace picker check), prices beyond the cached table in the repo, and every Sonnet cost figure ([I] until measured).

## 9. Disposition

ACT NOW (done): this review; dry runs of three plans; test rerun (17 pass).
ACCOUNT FOR NOW: C1, C2 and C5 (add to the pilot report), C6 (re-dry-run before Go 2).
LATER / DELEGATE: L1 to L4 above; Sonnet A/B plans after the probe; other books after G4 and G5.
