# L2b checkpoint: cast worksheets (CL94)

Status: worksheet generator and private LOTM chapter 1-24 outputs complete; agent-verified, not human-reviewed. No runtime cast behavior is implemented.

Authority: [L2b brief](L2B_WORKSHEET_BRIEF.md), [L1 checkpoint](L1_CHECKPOINT.md), [cast-lives plan](../CAST_LIVES_PLAN_2026-10-28.md). Codes: CL2, CL94, WA22-WA24, AR1-AR16, AD36, AD41.

Private output: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/cast-worksheets/`. Inputs: L1's `merged-cast-2026-10-28/` and its `crosswalk.json`. Source rows and schema extensions are retained in each worksheet's `sourceRows`; private source text is not included in committed files.

```text
TOTAL entities=187 rows=148 usable-time=36
```

## Check log

- `node --test tests/cast_worksheet.test.js`: PASS, 2/2; fixtures cover slice ordering, tier counts, source-field pass-through, schedule gaps, forward anchors and input guards; no production output assertions.
- `node scripts/lead_run/cast_worksheet.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28 --crosswalk docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28/crosswalk.json --slice 1-24 --out docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/cast-worksheets/`: PASS; 187 worksheets, 148 candidate rows, 36 with usable time windows; no source text copied into committed artifacts.
- `node - <<'NODE'` coverage/order scan of L1 `crosswalk.json` against the private worksheet JSON files: PASS; 187 eligible crosswalk entities, 187 worksheets, no missing or extra worksheets, no out-of-order scene locators; source identity is L1's LOTM chapter 1-24 crosswalk.
- `git diff --no-index --check /dev/null <owned-file>` for each owned file, plus manual source-text review: PASS; no whitespace diagnostics or copied source prose; unrelated checkout changes excluded.
- `git add <three owned paths>`: BLOCKED before staging; sandbox denied creation of `.git/index.lock` because `.git` is read-only. No commit attempted; HEAD was left unchanged.

## Remaining boundary

Worksheets are preparation data for L3, not cast records or gameplay. Rows without a complete usable time window carry null `from`/`to` plus a gap note; no time was guessed. Proposed crosswalk IDs remain proposals from L1.
