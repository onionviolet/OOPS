# Lane brief: RW5, paragraph-reviewed make or write an item rows for the new making pack field

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Same method, rules and output discipline as [RV6_BRIEF](RV6_BRIEF.md) and [RV_PARAGRAPH_REVIEW_BRIEF](RV_PARAGRAPH_REVIEW_BRIEF.md)
(CLR1 paragraph-first, JSON-safe rows, no invented stock or outcomes, forced canon: one canon choice, sealed secrets by id only, private outputs). The difference: the pack now has a pack field for this family, built by MF_MAKING_CHECKPOINT.md
(read its "Pack field" / row schema section and the adapter `src/cast_making_adapter.js` and its test for accepted row shapes). Take the first 100 steps, in scene order, from the census/mapping gap list for the **make or write an item** family (X4 Resume 2 table, family rules in
`scripts/lead_run/gap_census.mjs`; steps from the whole book, volume 1 first), skip steps already reviewed in `reviewed-rows-2026-10-29/*.jsonl`, read each cited paragraph (`scripts/lead_run/cite_paragraphs.mjs`), and append one JSONL line
per step to `reviewed-rows-2026-10-29/RW5.jsonl` as you go: `{"stepId","verdict":"row"|"gap","kind":"making","row":{...},"locator","paraphrase","gapReason"}`. Every `row` must load through the real adapter (`the making adapter's define function`) and the native registry check (no `undefined`, no empty `requires`).
Also write checkpoint `RW5_CHECKPOINT.md` (counts per kind and gap reason; top 5 generic reasons). Do not stop before 100 steps or the end of the family. A partial file is a valid result. Do not edit `src/`, `tests/`, `scripts/` or `private_packs/`.

**Second pass (AD2 relaxed the adapters, see [AD2_CHECKPOINT](AD2_CHECKPOINT.md)).** First re-review the 100 steps already in `reviewed-rows-2026-10-29/RW2.jsonl` (all were gaps under the strict adapters) against the relaxed adapters, then continue with up to 50 further steps of the family not yet reviewed.
Only produce a row when the paragraph supports it; unknown costs, stages and prior evidence are now allowed to be null/unknown, but never invented. Output file RW5.jsonl, checkpoint RW5_CHECKPOINT.md.
