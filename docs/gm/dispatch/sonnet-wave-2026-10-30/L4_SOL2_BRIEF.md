# L4 Sol brief 2: LOTM summons and messenger rows (volume 1 slice 2)

You own exactly two NEW files: `src/lotm_summons_rows.js` and `tests/lotm_summons_rows.test.js`. No commits, no web, no edits to any other file. Rules: `.claude/rules/making-systems.md` (MR1-MR36), `.claude/rules/runtime-code.md` (AR1-AR16), AD38 (mechanisms, not allowed-outcome lists), WPR5 (anything not source-stated is an authored proposal, labelled). English only: no Chinese except the locator form below, no quoted source sentences.

Read `src/lotm_divination_rows.js` (slice 1) for style, evidence tags and gap lists. Typed source rows (private, read them): `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/luna_rows2.jsonl`.

## Shape (data only; no engine hookup in this slice)
Export `LOTM_SUMMONS_ROWS = {schema: 1, rows: [...]}`. Each row: `id` (`lotm.summon.<slug>`), `label`, `description`, `sourceIds` (merged source rule ids), `locators` (strings like `zh 第182章 p56`, literal characters, exactly the cited paragraphs), `device` (text), `eligibility` (`{all:[rule,...]}` where each rule is `{fact:'actor.lotm.summon.<name>',op:'eq'|'gte',value,reason}`, covering place, held objects, spirituality thresholds, prior preparation), `participants` ([{role:'caller'|'responder'|'witness'|'recipient', ref, note}]), `steps` ([{id, kind: 'prepare'|'call'|'response'|'rite'|'outcome', label, minutes (authored proposal), perceived (what the caller observes; observation only, no hidden truth)}]), `response` ({entity: generic description, perceived}), `result` ({kind:'delivery'|'attendance', stated, effects:[{type:'owner-needed', owner, value}]}), `limits` ([{condition, outcome, evidence}] only where the source states one), `evidence` (S/T/I per field), `proposals` (list of authored values). Also export `LOTM_SUMMONS_FACTS` (fact names required) and `LOTM_SUMMONS_GAPS` ([{id, reason}]).

## Rows (use only usable:true rows; others become gaps)
1. Copper-whistle messenger (source ids in row 1 of the jsonl): whistle owned by another character and used by the lead with a spiritual wall raised; two blows; responder is an illusory skeletal messenger that catches the letter and delivers it to its owner in a concealed way; second blow dismisses it. Delivery result, `effects` owner-needed (a messenger/mail mechanism).
2. Candle self-summoning (row 2): caller performs a candle-and-oils rite in a sealed room; responder is the lead's own presence above the grey fog, who answers by touching the linked symbol; first attempt fails for insufficient spirituality to form a full door, a later attempt works. Put the spirituality shortfall in `limits` and `eligibility` (threshold value is an authored proposal unless the jsonl states one).
3. Gaps: the personal-messenger ritual and contract (design not shown), the star summons (no device or stated limits), anything else in the jsonl with `usable:false`.

## Test (node:test, ESM)
`node --test tests/lotm_summons_rows.test.js`, nothing else. Assert: schema/step kinds valid and ordered (prepare before call before response); every locator matches `/^zh 第\d+章 p\d+$/`; unique ids; every eligibility fact appears in `LOTM_SUMMONS_FACTS`; no Chinese outside locators (scan the module source); each row has a responder participant and an `effects` entry naming an owner; gap ids absent from rows.

## Done check
Both files exist, test passes, `git status` shows only your two new paths. Report the one-line test result.
