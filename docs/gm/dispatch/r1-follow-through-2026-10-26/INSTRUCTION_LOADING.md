# Q14 / IPC66 instruction loading repair, 2026-10-26

## Result and authority

F1. R1 explicitly authorizes reversible deduplication at the canonical source/generator. Portable preferences remain in one generated global file per client. OOPS's two generated embedded copies became conditional source pointers, preserving project instructions, Claude host notes and source attribution. This is implemented and source-verified, not a measured agent-performance improvement.

F2. Live route inspected: Codex CLI `0.164.0-alpha.11.1`, Claude Code `2.1.308`. No `~/.codex/AGENTS.override.md` exists. Codex's global owner is `~/.codex/AGENTS.md`; `project_doc_fallback_filenames = ["CLAUDE.md"]` does not select CLAUDE alongside an existing project AGENTS. Claude's `~/.claude/CLAUDE.md` imports `~/.claude/user-preferences.md`; its global settings select `claude-md-and-agents-md`. Repo CLAUDE imports AGENTS. Current Claude docs say an imported AGENTS is deduplicated by file identity, so the import itself is retained. Neither home loader nor client setting was changed.

F3. Before this edit, the global file and each repo file carried a full agreement. Both repo marked blocks used the older Claude sonnet-default delegation sentence; the canonical template and generated home files already used haiku for bounded extraction. The canonical template governs. No preference-body rule changed here. Exact prior files are preserved privately; the project-specific prefix/suffix of each repo file is byte-identical to the task baseline.

Sources checked October 26: [official Codex discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude loading/import rules](https://code.claude.com/docs/en/memory). These support the route model; a fresh model-run loading trace was not collected. No paid child CLI session was launched just to inspect discovery. Existing sessions may retain old instruction snapshots. The refreshed instruction message in this chat still included the old embedded project block after the disk edit, so this active chat is not evidence of fresh-session deduplication.

## Owned implementation

Canonical vault: `/Users/weiwei/Documents/Claude/Projects/Weibao's Workspace/plans`.

- `_templates/portable_agent_rules.md`: changed only source attribution to describe embedded/global-pointer modes.
- `_templates/portable_agent_rules_global.md`: generated-region pointer source, with fallback when global preferences were not loaded. It uses plain prose rather than a Claude external auto-import, avoiding another full import on the configured machine.
- `.claude/scripts/sync_agent_rules.py`: exact `--repo ... --global-preferences` opt-in; the managed mode marker survives later ordinary sync. `--embedded-preferences` reverses it. Mode-changing flags require exact repo selection, avoiding a broad sibling-mode conversion.
- `.claude/scripts/test_sync_agent_rules.py`: focused mode-preservation, rollback and scope regression coverage.
- `99_Meta_Workflow/Agent_Logic_Log.md`: appended applied-change/evidence history under the vault's instruction-edit rule.

Generated outputs: OOPS AGENTS.md and CLAUDE.md; `~/.claude/user-preferences.md` and `~/.codex/AGENTS.md`. Global outputs are identical and match the canonical generator. No global loader, hook, model setting or other sibling project was edited.

## Measurement and checks

[instruction-measurements.json](instruction-measurements.json) records baseline/current hashes and bytes. OOPS AGENTS: 21,433 → 13,657 bytes; CLAUDE: 9,524 → 1,748. Total reduction 15,552 bytes. Each global output grew by 69 bytes from the attribution sentence. Static route model: Codex full agreement occurrences 2 → 1, Claude 3 → 1 (counting the imported AGENTS once under the documented deduplication). Net selected-file bytes: Codex 7,707 fewer; Claude 15,483 fewer. Small source pointers still appear in both repo files. These are UTF-8 text/loading-route measures, not tokenizer, cache, billed-token, quota or behavioral measurements.

V1. `python3 -m unittest discover -s <vault>/.claude/scripts -p test_sync_agent_rules.py`: PASS, 8 tests. Covers malformed markers, host preservation, bounded targets, no sibling writes, check/dry-run, global resync persistence and explicit embedded rollback.

V2. `python3 <vault>/.claude/scripts/sync_agent_rules.py --repo /Users/weiwei/code/yet-another-idle-rpg --global-preferences`: generated both repo files. `python3 ~/.claude/scripts/sync_user_prefs.py`: generated both home files. Same repo command with `--check`: PASS, both unchanged.

V3. Baseline versus generated repo regions: PASS, both prefixes/suffixes byte-identical. `git diff --check -- AGENTS.md CLAUDE.md`: PASS. This preserves the pre-existing dirty AGENTS changes as baseline input, not as this task's authorship.

V4. `npm run check:rules`: rule index PASS (25 rows, 43 AD codes, 144 links, two existing untracked-link warnings); receipt stage FAIL because the concurrently owned `rules-consideration-2026-10-26/CHECKPOINT.md` had no receipt fence at inspection. No repair was made to that other chat's file. This is not a failure of portable preference generation. Final own-receipt validation is recorded in RECEIPT.

V5. Deterministic selected-file assembly: PASS, exactly one full agreement heading for each client's documented route; global outputs equal each other and canonical generator output; no Codex home override; Claude global and repo imports still present. Vault scoped `git diff --check`: PASS. This validates files and the route model, not a fresh host prompt capture.

## Recovery and limits

Private exact baseline backups and manifest: `~/.codex/research/r1-follow-through-2026-10-26/instruction-backup/`. Prefer the supported `--embedded-preferences` exact-repo flag to restore embedded mode using the current canonical agreement. Exact historical restoration is available from backups after checking for intervening writes. Do not blindly overwrite current shared files.

Other embedded repository consumers retain their previous mode. Running the broad legacy sync could update them under its existing semantics; this task did not run it. Fresh clients on this machine are expected to select one full global agreement based on documented routes and source checks; fresh-session prompt loading and cross-machine fallback behavior remain unexercised. No token savings, gameplay changes, commit, push or human review claimed.
