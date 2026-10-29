# Local overnight reading: handoff (2026-10-29)

Weibao, 2026-10-29: "Run local and then we can develope a new workflow to touch up and consume less tokens when november comes around. I can leave mac running overnight for free." Then: "consider various settings too", "consider if multiple passes could be effective too", and hand off to Sonnet to work through it overnight, coordinating the local agents. No messages to other Claude Code chats.

## Goal

1. Tonight, at $0: pick the best local census settings on the known-answer set, then run the local census over the November queue on this Mac.
2. By morning: a proposed November workflow in which those local rows let the cloud batch spend fewer output tokens (output is about 97% of batch spend; READINESS_AND_SCOPE caching analysis).

Done when: the settings choice is recorded with scores, the overnight queue has run as far as the night allows (resumable), and round 15 of [READINESS_AND_SCOPE](READINESS_AND_SCOPE.md) holds the settings result, the multi-pass result and the November touch-up proposal, committed (own paths, not pushed).

## Evidence so far (READINESS_AND_SCOPE round 14 and C46)

- Local census, `qwen3.8:27b`, seed 7, temperature 0.3, thinking off: recall of the batch high rows **0.43-0.48**, lead-touched 0.55-0.66; 85% of its rows match a batch row. Weak kinds: place 31%, measure 7%, calendar 6%, law 0 of 6. 23% of notes are "Mentioned by name." About 1.5 minutes a chapter.
- One medium batch run + local: recall 0.73-0.78, lead-touched 0.89-0.93. Two medium runs merged: 0.79 and 0.95. One high run: 0.73 and 0.94.
- `gc1c003` hit the old 8,000-token output cap; the driver now defaults to 12,000.

## Tools

- `scripts/lead_run/local_census_overnight.mjs`: runs the lane on every shard of the named census plans, in order, resumable, with a free-memory gate (pause and unload under `--min-free`, default 25%). Flags: `--plans`, `--tag`, `--min-free`, `--predict`, `--limit`, `--model`, `--seed`, `--temp`, `--think`. Outputs and the progress log go to `<plan privateDir>/local-census/` (gitignored).
- `scripts/lead_run/local_census_lane.py`: now takes English or Chinese chapter headers; env `LOCAL_WORLD`, `LOCAL_NUM_PREDICT`, `LOCAL_THINK`, `LOCAL_KEEP`.
- Known-answer kit (gitignored): `docs/research/novels/_local-eval/`. `c13/`, `c13med2/` (two medium runs), `c13hi/` (high rerun) are batch replies on 6 shards (RI `ri1c004`, `ri1c061`; Godclads `gc1c003`, `gc1c004`; HP `hp1c005`, `hp5c012`); `local_c44/` holds briefs, shards and the first local rows for them. `c44.mjs <kit dir>` scores the arms against the October high rows (edit its arm list for new local tags). `local_ri2/` and `cmp_local.cjs` are the RI volumes 2-4 set from C39.
- dsh profile `local` (`~/.dsh/profiles/local`) runs single-shot tasks on the local model: `dsh local "<task>"`. Use it for tagging-style tasks; the lane scripts call Ollama directly.

## Plan for tonight

1. **Settings sweep on the kit (about an hour).** Run each arm on the 6 kit shards with the lane (`LEADRUN_DIR=<kit>/local_c44/`, a new tag per arm), score with `c44.mjs`. Arms worth trying, cheapest first:
   - thinking on (`LOCAL_THINK=1`), same seed and temperature;
   - temperature 0.5 with a second seed, merged with the seed-7 rows (two local readers, like C28);
   - a numbers-only second pass for measures, prices, calendar and clock rows (the weakest kinds), seeded with the script's candidate list, if a prompt change is small enough to make in a scratch copy of the lane;
   - `--predict` 12,000 against 8,000 only on dense shards.
   Pick by recall and lead-touched recall against Mac time; a merged two-pass arm wins only if it adds clearly more than it costs in hours.
2. **Overnight queue** with the chosen settings, in November order: `coi_census.json` (294 shards, about 1,180 chapters, about 25-30 hours at the current rate), then `ri5_census.json` onward. It will not finish in one night; that is fine, it resumes.
3. **November touch-up proposal.** Design and write (do not run) a cloud census pass that gets the local rows in its brief and returns only rows that are missing or wrong, so output tokens fall. Name what to measure in a small November pilot (recall of local + touch-up against two merged medium runs, output tokens per shard) and the expected saving. Also: local census rows as known names for the scenes, rules, people and texture passes, so ids stay consistent.

## Rules

- **No paid API calls.** The October credit is spent; any cloud call, batch or direct, needs Weibao's go phrase first. Local runs are free.
- **Memory:** LA11 in [the capacity doc](../../../research/LOCAL_AGENT_CAPACITY_2026-10-28.md). One model at a time; the driver's gate pauses under 25% free. The overnight LOTM coordinator's Codex lanes run browser checks on this Mac, so raise `--min-free` (35 is reasonable) if their checks slow or fail, and never run the sweep and the queue at once.
- Book text and model outputs stay in gitignored folders. Commit only your own paths from a fresh HEAD; never stash, reset or force; no push; no `Co-Authored-By` trailer. Edit shared docs hunk by hunk.
- Do not message other Claude Code sessions. Record status in this file's log section and in READINESS_AND_SCOPE.
- Proposals stay labeled as proposals; only Weibao accepts.
- Stop processes by PID or process group, never `pkill -f`. Record PIDs below.

## Log

- 2026-10-29: driver and lane flags written by the reading session. COI smoke test (`--limit 1`, tag `n1`, settings seed 7, temperature 0.3, thinking off): `coic005` (chapters 5-8, English) ran in 9 min 48 s with other lanes active; output in `circle-of-inevitability/private/lead-run-2026-10-28/local-census/`. The queue resumes past it with tag `n1`; a sweep winner with other settings should use a new tag.
- 2026-10-29 02:15 (Sonnet overnight session): sweep started, process group 97423 (stop with `kill -- -97423`), script `_local-eval/run_sweep.sh`, logs in `_local-eval/sweep_logs/`. Arms in order on the 6 kit shards, all `num_predict` 12000, memory gate 35%: `b12` (seed 7, temp 0.3, think off; clean baseline at 12K, the old `c44` rows are the 8K arm), `s2` (seed 11, temp 0.5), `t1` (thinking on). Queue starts only after `SWEEP_DONE` appears in `sweep_logs/done.log`.
- 2026-10-29 07:40: sweep finished (`SWEEP_DONE`; the memory gate paused it twice, 02:32 and 02:56). Scores are in READINESS_AND_SCOPE round 15 (C47-C52). Winner: seed 7, temperature 0.3, thinking off, `--predict 12000`.
- 2026-10-29 07:42: overnight queue started, process group 97531 (stop with `kill -- -97531`), tag `n1`, `--min-free 35`, `--predict 12000`, plans `coi_census.json,ri5_census.json`, stdout in `/tmp/claude-501/queue_n1.out`, progress in each plan's `local-census/overnight_n1.jsonl`. Resume by rerunning the same command.
- 2026-10-29 10:50: touch-up pilot run (Weibao's go): failed its bars, see round 15 C53-C56. Queue status: 4 COI shards done at about 45 min each, group 97531 still running.
