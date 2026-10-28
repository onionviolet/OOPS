# W1 brief: make the lane workflow repeatable (CL131, CL221)

Model: `gpt-6-luna`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, beside G1
(no shared files). Do not commit; the coordinator commits. Never stash, reset, force or push.
Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md) (CLR1-CLR13). Plan sections 15.2, 20, 22.

## Why

This session coordinated eleven Codex lanes with scratchpad scripts only it could see. Most lane
problems were brief problems (wrong data assumption, missing file grant, wrong publication class) or
review catches (top-level `await`, canon names in tracked code). Make those repeatable for any coordinator.

## Inputs

Reference scripts (read them, do not copy blindly): the shared notes folder
`/Users/weiwei/Library/Application Support/Claude/side-session-notes/local_6fec2836-9984-4508-b25a-521599eae116/cast-lives-tools/`
(`launch_lane.py`: detached launch, API keys stripped; `preflight.mjs`: Codex usage read through
`codex app-server`; `l4c-browser.cjs`, `l4b-browser.cjs`: browser floor runs). The Codex CLI is
`/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex`.

## Build

1. **`scripts/codex_lane.mjs`** with subcommands:
   - `preflight`: account type must be `chatgpt`, ordinary usage allowed, window under 100%; prints one
     line; never consumes credit or starts a turn.
   - `launch <lane-id> <brief.md> --model <m> --effort <e>`: runs preflight, writes a prompt pointing at
     the brief (the brief's own rules apply; lanes never commit), launches detached in its own process
     group with `-s workspace-write`, strips `OPENAI_API_KEY`, `CODEX_API_KEY`, `ANTHROPIC_API_KEY`, and
     records pid, session id, logs and last message under `~/.codex/lanes/<task>/<lane-id>/` (outside the
     repo, no `.gitignore` change).
   - `resume <lane-id> <message.md>`: resumes the recorded session with the same sandbox flag (this
     session found `exec resume` dropped it; pass it explicitly or report that it cannot be passed).
   - `status`: one line per lane (running, exited, last message head).
2. **`scripts/lane_review.mjs <paths...>`**: before a coordinator commits a lane's files: canon-name
   sweep of tracked `src/` and `tests/` paths against names read at runtime from `private_packs/*-cast/cast.json`
   (prints counts only, never the names); top-level `await` check in `src/`; list of changed files outside
   the lane's stated grant (passed as `--grant`); exit non-zero on any hit.
3. **`docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/LANE_BRIEF_TEMPLATE.md`**: the blocks
   every brief carries: model and effort; publication class (CLR3); data probe with gate counts (CLR2);
   owned files and the out-of-grant rule ("do every fix you can inside the grant; for a needed hunk
   outside it, write a prepared patch and continue"); seam (CLR10); done check with FLR lines; stop
   conditions; "do not commit"; the defaults for known ambiguities (CLR12).

## Owned files

`scripts/codex_lane.mjs`, `scripts/lane_review.mjs`, `tests/codex_lane.test.js` (pure parts only: argument
parsing, env stripping, record shape; no real Codex call), `tests/lane_review.test.js` (synthetic names),
the template, and `cast-lives-lanes/W1_CHECKPOINT.md`.

## Done check

- Focused tests pass. `node scripts/codex_lane.mjs preflight` prints a pass line on this machine.
- `node scripts/lane_review.mjs --grant <files> <files>` passes on the current cast files and fails on a
  synthetic file containing a pack name and on one with a top-level `await`.
- Checkpoint with one line per check; no source text or canon names in any committed file.
