# Wiki full-dump reader lanes, 2026-10-13: common rules

Weibao asked (2026-10-13) for full dump lanes for JJK and Bleach plus Chainsaw Man, with Codex readers. Priority owner: `docs/USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13`. Repo root: `/Users/weiwei/code/yet-another-idle-rpg`. Full-dumps root (git-ignored): `docs/research/power-systems/wiki-digests/full-dumps/`.

## Before you start

Read `AGENTS.md`, your lane's `CHECKPOINT.md`, and `workers/hxh-full/CHECKPOINT.md` plus the first three lines of `workers/hxh-full/READ_LEDGER.jsonl` and `NOTES.jsonl`. Those records show the expected ledger and note shape; match their fields (`title`, `revision_id`, `source_url`, `text_sha256`, `read_text_sha256`, `read_characters`, `characters_read`, `source_spans`, `read_chunks`, `scope_state`, `read_complete`, `source_facts`, analyst inferences, proposals, unknowns kept separate).

## Write scope

Only your own lane folder named in your prompt. Never write the frozen `*_SOURCES.json` manifests, other workers' folders, `workers/qualifier/`, global aggregates (COVERAGE, SUPPLEMENT_COVERAGE, DUMPS.json, SOURCES.md, CHECKPOINT.md above workers), `src/`, `dist/`, saves, git, or anything outside the repo except reading private payloads. No commits.

Weibao is syncing an older copy of the research tree from his other Mac. Your lane folders are new and not in that copy. Your `READ_LEDGER.jsonl` is the authority on progress. If your own CHECKPOINT is stale or behind the ledger (for example after context compaction), reconcile it from the ledger and continue; that is not an unexpected change. Stop only if a file in your folder was changed by something other than you (rows you did not write, rows removed or rewritten, or a file replaced): record it in CHECKPOINT and exit without merging.

## Reading rules

- No network. Inputs are private gzip payloads at each manifest row's `read_file` (JSON `{metadata,text}`). Use `~/.codex/research/venv/bin/python` for any helper.
- Read every retained input's full selected text yourself, in manifest order, in bounded untruncated chunks: one chunk of at most 4,500 characters per tool output, never several chunks batched into one output (spot-check 2, P6). Automated scans, grep or summaries do not count as reading.
- After each input, verify the payload's SHA-256 and length equal the manifest `read_sha256`/`read_characters`, then append one ledger row and one note row, and update CHECKPOINT (counts, last completed, next pending) every time. Append-only JSONL; one input at a time so a crash loses at most one input.
- Notes paraphrase. No quotes over 15 words. Raw text never leaves `~/.codex/research/`.
- Separate: source assertion (what the wiki says), analyst inference, proposal for YAIRPG, unknown. Record wiki-internal contradictions as they are; do not resolve from memory.
- Mark continuity: manga canon, anime-only/filler, novel, game, or unclear. Episode, chapter and arc synopsis pages: still read in full; keep the note short when there is no mechanic, and record `narrative_only` with the arc and any rule-bearing events.
- Character inputs are mechanic-bearing spans only. Do not claim a character lacks a power because the span omits it.
- The wiki is a dated secondary source, not canon authentication. Its snapshot date limits what it can say.

## Note accuracy (added after spot-check 1, 2026-10-13)

Before writing each note, re-check it against this input's text only. Every `source_facts` and `wiki_assertions` item must be something this page states; context from earlier inputs, even the previous episode, goes in `analyst_inferences` with the other page's title, or is left out. Name the speaker or user exactly as the page does. An item may go in `unknowns` only after you have searched this page for it; if the page gives a condition, cost, material or worked example, record that instead. Where a single claim is cited to anime, a guidebook, a novel, a game or FGO material, label that claim, not just the page. For span-selected inputs, record `read_chunks` as offsets into the payload text.

## Pace and stopping

Keep going until your range is complete. Context compaction, packet boundaries or long runtimes are not stopping points; reread CHECKPOINT after any compaction and continue from "next pending". Stop only when your range is done, on the unexpected-change rule above, or on a real blocker (missing or mismatched payload): record it and exit. At completion, write a short `SUMMARY.md` in your folder with counts, top mechanics found, contradictions and open gates.
