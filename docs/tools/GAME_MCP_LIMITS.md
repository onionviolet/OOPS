# Game MCP limits and how to expand them

Owner of the rule for [`scripts/mcp/`](../../scripts/mcp/game_mcp.mjs) (registry `game-mcp`, registered for Claude Code in
`.mcp.json` and for Codex in `.codex/config.toml`). Created 2026-10-23.

## The rule

The server is a first version. When a limit blocks or slows an agent, the agent calls `game_report_limit` once (what it wanted,
what blocked it, its workaround) and keeps going. That appends one line to
[`game_mcp_limits.jsonl`](game_mcp_limits.jsonl). The ledger is a reminder, not a decision: an entry does not
authorize a change. Before extending the server, read the ledger. An entry that repeats, or one that stalls real work, becomes a
tool or a fix here, with a test in `scripts/mcp/game_mcp_check.mjs`. Fold handled entries into the table below and leave the
raw lines in place.

Check the ledger size any time with `node scripts/mcp/game_mcp.mjs --self-check` (prints `openLimitEntries`).

## Known limits (2026-10-23)

| Limit | Workaround today | Expand by |
| --- | --- | --- |
| P1: hidden title text says waiting for PLAY after the driver has started; text clicks miss controls that the action list exposes (2026-10-25) | **Fixed on B1 branch:** `game_new` explicitly reports `started`; view filters hidden descendants; text clicks use the action-list controls. Regression reaches Village Find work after game_new | Reintegrate B1 patch and rerun stdio check in primary. Baseline already auto-clicked PLAY; no game source defect found. |
| No screenshots; `game_look` is text from an in-process DOM | Read `screen` text and the action list | Electron backend over CDP with `capturePage` (EL17); UI claims still need rebuilt browser evidence (AGENTS.md) |
| No `game_quote`; commands run only as clicks | Click, then read the result | Expose the AR7 quote step on a window entry point, then a `game_quote` tool |
| `game_look` pages 80 actions and 12,000 visible-text characters (B1, fixed on branch) | Use `offset` for more actions and `scope` for a panel; indices refer to the full current scoped list | Headless CSS remains approximate; desktop layout still needs a browser |
| Listener-only native travel/resource dropdown divs were absent outside the Village registry (BFA2) | **Fixed on B1 branch:** include visible `.location_choice_dropdown` controls; verified Village → Wild willow stand → Village | Regression exercises the return route without game source changes |
| `game_new(path)` fed an encoded export into a raw JSON boot slot (BHB1, 2026-10-25) | **Fixed on B1 branch:** boot a fresh disposable realm, then use the same native import route as `game_load` | Regression resumes an exported life and checks the clock and created hero |
| Export filenames used virtual `Date.now()` in a shared temp folder | **Fixed on B1 branch:** node:crypto UUID filenames prevent same-instant and parallel-server overwrites | Regression exports twice at the same virtual instant and requires distinct paths |
| Short text such as `Find work` may omit icons and hidden text included in the action label | Use the listed action index or the complete returned label; B1 text clicks now match those labels | Return concise visible labels with unambiguous IDs in a later wrapper pass |
| One game per server; `game_new` replaces it | Run another server | A session id on every tool |
| `game_step` is capped at 10,080 minutes per call | Call it again | Raise the cap with a progress reply |
| `game_load` reads only from the export temp folder | `game_export` first | An explicit allow-list setting |
| No sealed-truth or debug tools, by design | Read what the player sees | Only with an explicit flag and Weibao's instruction (sealed secrets rule) |
| Seen once in 7 runs: `game_load` can fail with "did not settle within 40 s of timer time" | Retry, or `game_new` with `path` | Reproduce under load and fix in the headless import settle |
| Boots the working tree, so another session's unfinished edit can break it. Seen 2026-10-23 (cleared by the owners within the hour, no fix needed here; `inventory_component` and `person.js` already form a cycle through `items.js` at HEAD, so module order decides whether it bites): an import cycle through `src/models/person.js` and `src/components/inventory_component.js` made `game_new` fail with "Cannot set properties of undefined (setting 'person')" | Wait for or ask the owning session; `git stash` is not allowed here | A frozen bundle option (a distinct `bundlePath`; `path` already means save export). B1 deferred: runner reload closes over its harness bundler and checkout assets, so a wrapper-only path is not an honest freeze. B1 pins isolated committed master `3a1180dc2`. |
| Headless layout is not real: CSS visibility is approximate | Use the browser playtest bot for layout | n/a |

## C2 native panel access (2026-10-25)

The B1 Mistglass, Tingen and continuation access blockers shared a headless
startup defect: the no-op `MutationObserver` left the workspace in title-screen
mode after PLAY. C2's runner delivers attribute changes at settle boundaries
(including inline style changes), allowing native startup observers to close
that mode. Child-list and character-data observation remain unimplemented.

`game_new({panel:"projects"})` and `game_click({panel:"continuation"})` automate
the native More panels selector using the existing visible controls. `game_click({key:<select>,value:<option>})`
also supports visible, enabled native select options. They neither
unlock panels nor enroll the character. Unknown panels fail. For Tingen use
`game_new({url:"http://localhost/?lotm_probe=1",panel:"lotm"})`, then choose the
native test enrollment. This is the game's existing disposable localhost
start, not a new ordinary-world entrance. Mistglass first requires speaking to
the Village elder. Return with the native center Back control, advance one
played minute, open the place Options tab and Iona’s work ledger, and choose
Follow local people and work. Then open Projects, Optional projects, and the
Mistglass disclosure for its explicit entry and method choices. Continuing
connection uses its ordinary Open your connection action.

Frozen-bundle support remains deferred. `path` already means an exported save;
the runner uses an instrumented bundle plus checkout HTML/CSS/assets on reload.
A bundle path alone would not pin those inputs, so it is not a cheap wrapper
addition. Current tests identify the checkout/build they actually booted.

## Not authority

Findings and ledger entries are proposals. UI and persistence claims need their own evidence (AGENTS.md, Verification).

## B1 branch receipt, 2026-10-25

`game_new.url` accepts only an HTTP localhost test origin for opt-in world entry and always enables `test_hooks=1`. It changes entry configuration, not game state. `path` remains an MCP export, not a bundle path. `game_mcp_check.mjs` covers the started state, hidden startup text, Village livelihood control, deterministic elder interaction, save/export/load/resume, unique export paths, unsafe save-path refusal and a temporary limit ledger. Full B1 record: [status](../gm/dispatch/codex-parallel-2026-10-25/B1_STATUS.md).
