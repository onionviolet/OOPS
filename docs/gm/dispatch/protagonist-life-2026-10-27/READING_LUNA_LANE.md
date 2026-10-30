# Luna reading lane: schema 1.5 scenes reread on the subscription (2026-10-29)

Weibao, 2026-10-29: "Send codex for luna, you can figure it out and save the requirements for the future." Proposal-level route, not
accepted for bulk use until the pilot grades are in. Cost: $0 API; draws on the ChatGPT window (preflight showed 26% used).
Owners: [reading status](READING_STATUS.md), [batch campaign](../batch-reading-2026-10-27/PLAN.md), `scripts/codex_lane.mjs`, `scripts/lead_run/luna_lane.mjs`.

## Requirements (reuse for any reread or new book)

1. **Preflight** `node scripts/codex_lane.mjs preflight` passes (account chatgpt, windows under 100%; `CODEX_LANE_MAX_USED` sets a lower ceiling). API keys are stripped by the runner.
2. **Same requests as the batch route.** Write a plan with `schemaVersion: '1.5'` and `outDir` under the gitignored private folder, run `batch_submit.mjs --plan <p> --dry-run` (writes `<label>_requests.jsonl`, sends nothing), then `luna_lane.mjs split --plan <p>` to write one prompt file per request under `<outDir>/prompts/`.
3. **One lane per shard**, `launch <lane> <brief.md> --model gpt-6-luna --effort medium` (`resume` takes no model option and fell back to another model in TG1, so launch fresh and name the model). The lane reads one prompt file and writes only `<outDir>/replies/<custom_id>.json`: the bare JSON the prompt asks for, no fences, no commentary. No repo edits, no commits, no web.
4. **Ingest** `luna_lane.mjs ingest --plan <p>` feeds the replies through the normal `collect` path (parse, lint, migrate, audit, grade, repair list) with no network; usage rows are zero because the lane is not metered here.
5. **Check before trusting:** read the lane's session file for the model name (the session calls itself "GPT-6"), grade A/B, name accuracy at least 0.9, and compare counts (scenes, options, step fields) with the same shard's existing Haiku rows. Stop rules from the batch plan apply.
6. **Privacy:** prompts and replies hold book text; the lane runs on the user's ChatGPT subscription (same precedent as TG1/TG2). Tracked files carry ids, counts and grades only.
7. **Shared checkout:** the lane touches only its reply file; the coordinator owns `src/`, `tests/`, `dist/`.

## Pilot

Plan `plans/luna15_pilot_scenes.json`, prefixes `w1s16L` (ch 43-45), `w2s20L` (ch 55-57), `w4s42L` (ch 121-123, a grade-C shard at 1.3). Results are recorded in the status doc.

## Pilot result (2026-10-29, `gpt-6-luna` medium, confirmed in the Codex session file; $0 API, 3 lanes in about 10 minutes)

| Shard | Chapters | Grade (1.5) | Lint | Scenes Luna / Haiku 1.3 | Steps Luna / Haiku | Option blocks Luna / Haiku |
| --- | --- | --- | --- | --- | --- | --- |
| `w1s16L` | 43-45 | C | 1 (`action-class`) | 4 / 8 | 19 / 22 | 6 / 14 |
| `w2s20L` | 55-57 | B | 0 | 4 / 7 | 16 / 11 | 7 / 14 |
| `w4s42L` | 121-123 | C | 4 (`date`) | 4 / 15 | 18 / 32 | 7 / 20 |

Name accuracy 1.0 on all three. The 1.5 step fields are filled (`locator`, `actor`, `kind`, `target`, `using`, `habit`, `results`).
**Finding:** Luna reads coarser: about 4 scenes per 3-chapter shard against 7-15 from Haiku, and about half the option blocks, so scene cards would lose granularity. Both C grades are 1-4 row lint failures a script can set aside. **Verdict (proposal):** do not replace the Haiku scenes pass with this lane for the full reread. It suits a second reader for step fields on shards already split into scenes, or a free fallback when credit is out. Better test next: give the lane the existing scene list (`beat`, `place`) and ask only for 1.5 step fields per scene.
Ingest and split tooling: `scripts/lead_run/luna_lane.mjs`. Not run on all 72 shards; the paid Haiku 1.5 scenes plan stays the default route for Nov 1 (about $1.5-2, needs Weibao's go).
