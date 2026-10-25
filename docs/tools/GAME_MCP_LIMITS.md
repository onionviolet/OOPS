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
| Native screenshot backend is optional; `game_look` remains DOM text | `game_capabilities` preflights existing Electron/Playwright; `game_screenshot({backend:"electron"})` returns a real CDP PNG or an explicit failure | Saved-state mirror at 1920×1080, isolated hidden profile. Transient panels/selections and exact paused timing are not mirrored; do not use it as proof of the headless layout |
| AR7 quote access | `game_quote({command:"lamp.toggle"})` calls the existing scenario bridge and native registry quote | Finite supported command, observer-safe explicit fields, no execute/debug exposure. Other commands fail closed |
| `game_look` pages 80 actions and 12,000 visible-text characters (B1, fixed on branch) | Use `offset` for more actions and `scope` for a panel; indices refer to the full current scoped list | Headless CSS remains approximate; desktop layout still needs a browser |
| Listener-only native travel/resource dropdown divs were absent outside the Village registry (BFA2) | **Fixed on B1 branch:** include visible `.location_choice_dropdown` controls; verified Village → Wild willow stand → Village | Regression exercises the return route without game source changes |
| `game_new(path)` fed an encoded export into a raw JSON boot slot (BHB1, 2026-10-25) | **Fixed on B1 branch:** boot a fresh disposable realm, then use the same native import route as `game_load` | Regression resumes an exported life and checks the clock and created hero |
| Export filenames used virtual `Date.now()` in a shared temp folder | **Fixed on B1 branch:** node:crypto UUID filenames prevent same-instant and parallel-server overwrites | Regression exports twice at the same virtual instant and requires distinct paths |
| Short text such as `Find work` may omit icons and hidden text included in the action label | Use the listed action index or the complete returned label; B1 text clicks now match those labels | Return concise visible labels with unambiguous IDs in a later wrapper pass |
| Multiple isolated games | Supply `sessionId` on game tools; omitted means `default` | Separate worker process/storage/clock per id. `game_new` replaces that id; `game_reload` uses its storage; `game_close` stops that id. Explicit imports may copy an export across sessions without linking storage |
| `game_step` is capped at 10,080 minutes per call | Call it again | Raise the cap with a progress reply |
| `game_load` reads only from the export temp folder | `game_export` first | An explicit allow-list setting |
| No sealed-truth or debug tools, by design | Read what the player sees | Only with an explicit flag and Weibao's instruction (sealed secrets rule) |
| Seen once in 7 runs: `game_load` can fail with "did not settle within 40 s of timer time" | Retry, or `game_new` with `path` | Reproduce under load and fix in the headless import settle |
| Working-tree boot drift | `game_freeze` returns `bundlePath`, `snapshotManifest`, full SHA-256 bundle/manifest identities and input count; pass both paths to `game_new` | Snapshot pins instrumented bundle, HTML/CSS/assets, static content, runner/dependencies, worker and desktop host. Each session owns a verified private copy used on reload/import. `path` continues to mean a save export. D2 initialization repair remains separate |
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

Native click replies also wait for the game’s asynchronous authority validation
and any requested reload. This matters for fresh-life continuation: returning
before its validation iframe finishes can expose an old blocked runtime and
make the next snapshot fail. The C2 regression confirms Life 2, its paused
arrival and a writable native save after the actual confirmation.

Remaining playtest qualifications: CCC1 observed an “already applied” Continue
message after reciprocal return. The native guard compares event tokens, while
the harness re-seeds deterministic crypto on reload; identity replay is a
possible harness cause, not an established browser runtime defect. Native
combat also has timers beyond the dev calendar stepper, so large `game_step`
calls do not establish real combat pacing. The [C2 sweep](../reviews/PLAYTEST_SWEEP_2026-10-25.md#c2-follow-up)
keeps these limitations separate from game defects.

C2 historical boundary: frozen-bundle support was deferred there because a bundle path alone did not pin HTML/CSS/assets or the reload runner. E4 addresses that boundary with the manifest and per-session private copy below.

## Not authority

Findings and ledger entries are proposals. UI and persistence claims need their own evidence (AGENTS.md, Verification).

## B1 branch receipt, 2026-10-25

`game_new.url` accepts only an HTTP localhost test origin for opt-in world entry and always enables `test_hooks=1`. It changes entry configuration, not game state. `path` remains an MCP export, not a bundle path. `game_mcp_check.mjs` covers the started state, hidden startup text, Village livelihood control, deterministic elder interaction, save/export/load/resume, unique export paths, unsafe save-path refusal and a temporary limit ledger. Full B1 record: [status](../gm/dispatch/codex-parallel-2026-10-25/B1_STATUS.md).


## E4 M10 tool contract (2026-10-25)

```js
const frozen = game_freeze();
game_new({sessionId:"review", bundlePath:frozen.bundlePath, snapshotManifest:frozen.snapshotManifest});
game_quote({sessionId:"review", command:"lamp.toggle"});
game_save({sessionId:"review"});
game_reload({sessionId:"review"});
game_capabilities();
game_screenshot({sessionId:"review", backend:"electron"});
game_close({sessionId:"review"});
```

These are tool calls, not a JavaScript client library. Freeze copies the static-content census already owned by `desktop/snapshot.cjs`, an instrumented headless bundle, its runner sources and imports, and the native desktop host. The manifest records SHA-256 for each copied input; its hash and bundle hash appear in frozen session replies. The runner's reload seam is changed in the disposable copy to load its instrumented bundle directly. It does not call the live bundler on reload. Local fetches read the snapshot root; absent files return 404, never fall back to the checkout. Future same-origin content dependencies must enter the census to be available in frozen sessions. Content and saves may include private data; keep snapshot directories and screenshot artifacts private.

`game_freeze` captures the current checkout and current `dist` page build independently. Run `npm run build` first for screenshot evidence of the matching source. The manifest honestly pins both, but does not assert they match. No generated build is committed by this lane. Returned manifest paths are local temporary artifacts, not portable signed build attestations. Editing the external snapshot invalidates subsequent new sessions; running sessions retain their private copies. OS temporary files are retained for inspection, with no automatic deletion or player-profile access.

The optional screenshot uses existing Electron and existing Playwright support only, launches the existing desktop host hidden with a fresh `YAIRPG_USER_DATA`, injects the selected session's native snapshot and uses CDP `Page.captureScreenshot`. It returns a PNG path, full SHA-256, byte size and actual dimensions. It neither reads nor drives the player's app, and does not expose a general page-evaluation tool. `game_capabilities.screenshot.available` is a dependency preflight, not a launch claim. Launch errors remain errors; DOM text never substitutes for pixels. Screenshot state belongs to a disposable native mirror, so this proves native rendering of saved state rather than an unsaved transient headless interaction.

The existing UTF-8 and older unmarked export import paths are unchanged. Session IDs are server-local, not durable resume tokens; retain exports and frozen manifests to resume after a server restart. Reload preserves stored saves, not unsaved work. Rule application and feature evidence: [E4 checkpoint](../gm/dispatch/mcp-m10-2026-10-25/CHECKPOINT.md). Raw ledger lines remain append-only and unchanged by E4.
