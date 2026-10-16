# Reusable mockup workbench

Standing workflow requested by Weibao on 2026-10-16: “Make long standing better
mockup system.” This owns how YAIR UI proposals are built and compared. It does
not select a recipe layout, replace the accepted Proto23 baseline, or authorize
unrelated production changes. [UI rules](UI_RULES.md) still govern player-facing
surfaces. Earlier independent prototypes remain historical experiments.

## Open it

From the repository root:

```sh
node prototypes/workbench/build.mjs
node prototypes/workbench/serve.mjs
```

Open the loopback URL printed by the server. It deliberately chooses a fresh port
for each run, separate from gameplay and personal browser saves. Leave that
process running while reviewing; Ctrl+C stops only that server. The workbench
serves only its own directory. No installation or extra dependency is required.

The initial study is recipe browsing, adapted from the retained
[recipe experiment](../prototypes/recipe-ui-2026-10-15/INTEGRATION.md). Its real
renderer/tokens/definitions are a **pinned prior prototype build**, not the latest
native game. The build copies those inputs, hashes them, and appends the local
adapter without modifying the older experiment. Its frame is a simplified
five-region fixture rather than a claim of exact current Shell geometry.

## Standing rules

| Code | Requirement | Reason |
| --- | --- | --- |
| MW1 | Start with a question, a representative player task, surface/home, target viewport, fixture provenance and exclusions. Put these in the study manifest and display them under Task & limits. | A polished screen should answer an actual unsettled question. |
| MW2 | Use the shared workbench for new interactive comparisons. Reuse pinned YAIR tokens, components and public projections where useful. State exactly which parts are real, simulated or absent. Use a focused pane study only when its question does not depend on surrounding composition, and label that limit. | Avoid unrelated skins and mocks that promise mechanics they do not have. |
| MW3 | Compare alternatives against the same state. Layout changes preserve selected subject, query, stock, history and available scroll/focus anchors. Compare mode mirrors interactions in either pane without replaying the gameplay command. Scenario changes and Reset explicitly restore the fixture. | Avoid one alternative receiving better data, a fresh inventory or an easier task. |
| MW4 | Keep viewport size, text size and display scale separate. Default to 1366×768; include 1920×1080 and real 14/17.5/21px text where relevant. Fit preview is labelled and useful for overview. Readability evidence uses actual-size browser rendering/captures. | A scaled thumbnail cannot establish readable large text. |
| MW5 | Exercise the journey, not just the opening image: find, inspect, act, read result, return and resume. Include relevant crowded, long-name, unknown, unavailable and failure states. Use keyboard and Back/Esc, preserve the log and current work. | Empty fixtures and screenshots miss navigation and changing-state defects. |
| MW6 | Isolate from game startup, personal saves, credentials and production storage. Use disposable in-memory fixtures and an explicit/manual clock unless time itself is under study. Never import sealed truths into a public fixture. | Review should be reversible, reproducible and safe for the director to play. |
| MW7 | Export a review with fixture state, build revision, viewport, text and limitations. Keep evidence with the experiment. Record recommendations separately from human selection and native integration. Accepted choices go in the existing feature owner and PROJECT summary. | Passing checks or exporting a file does not establish visual acceptance. |

The workbench controls are review tooling outside the game viewport. Its own
scrolling at actual size is expected; the fixture must meet the game's region
and overflow contracts independently. Mobile optimization remains deferred.

## First study and review controls

The recipe study offers compact/full and adjacent detail, ready/shortage/station/
reserved/limited-knowledge scenarios, crowded synthetic stock/log and deliberately
long fictional display names. IDs and recipe costs stay those of the retained
fixture. An explicit cook scripts success; it does not test native RNG, XP,
progression, save compatibility or real station access.

Layout changes do not spend, reset or discard history. Compare same state mounts
both alternatives at the selected viewport size. Either pane is interactive;
the resulting snapshot updates its peer. Local history/Back/Esc belongs to this
disposable fixture, not a second production navigation controller. The manual
Step fixture control changes only synthetic work progress. Reset restores the
selected scenario, including its stock, log, navigation and step counter.

Export review downloads JSON to the browser's download location. It contains
only this synthetic state and explicitly says the proposal is unreviewed.
Nothing persists automatically across reloads. Review exports are evidence,
not game-save files. This version does not import review exports.

## Add another study

Use this structure rather than forking the workbench chrome:

```text
prototypes/workbench/
  experiments.json          # registry and visible briefs
  workbench.js / .css        # shared controls and comparison host
  adapters/<study>.js        # prototype-owned state bridge
  build.mjs                 # isolated, reproducible fixture packaging
  built/<study>/            # served fixture and pinned dependencies
  evidence/                 # scoped checks, captures and report
```

Register an entry with a unique `id`, `title`, `question`, `task`, `surface`,
`fixture`, `limits`, local `entry`, and `variants`/`scenarios` arrays of
`{id,label}`. Add its build step and adapter using its actual state owner.
`build.mjs` currently packages the recipe study only; a registry row alone does
not package a new experiment. Do not scrape a screenshot or DOM back into a
second gameplay model. Small original fixtures are fine when no useful native
projection exists, provided they are labelled.

The iframe protocol is intentionally small:

| Direction | Message | Meaning |
| --- | --- | --- |
| Fixture → host | `{type:'mockup:ready'}` | Adapter is ready after rendering. |
| Host → fixture | `{type:'mockup:command',id,command,value,variant}` | Request `capture`, `restore`, `variant`, `scenario`, `text` or `step`. |
| Fixture → host | `{type:'mockup:reply',id,snapshot}` or `{type:'mockup:reply',id,error}` | Acknowledge the command only after relevant DOM restoration. |
| Fixture → host | `{type:'mockup:state',snapshot}` | User changed fixture state; synchronize the peer. Never emit because of a host restore. |

Both ends check message origin and window source. Snapshots are structured-clone
data with a schema version. Each adapter owns validation, state and event
restoration, focus anchors and scroll keys. Restore applies resulting state;
it must never replay craft/spend commands, advance time or erase known-event
meaning. Presentation variant and global text size are separate from the shared
fixture state. Keep overlays/menu/history within the prototype owner. Discard
prototype navigation/command shims when implementing the accepted production UI.

Do not turn this into a universal gameplay simulator or add a dependency merely
for a one-off view. Add shared behavior only when a concrete study needs it.
Retained old mockups can stay at their old paths; migrate them when they need
another decision rather than rewriting the whole archive.

## Verification and status

Run against a fresh server URL:

```sh
node prototypes/workbench/check.cjs http://127.0.0.1:PORT/
```

The checker uses the existing local Playwright runtime and installed Chrome.
Set `YAIRPG_PLAYWRIGHT` to another Playwright module path or `CHROME_PATH` to
another Chromium executable if needed. These are verification dependencies;
the workbench itself needs only Node and a browser.

Current check results and screenshots are in
[evidence](../prototypes/workbench/evidence/). The
[delivery report](../prototypes/workbench/REPORT.md) owns exact executed checks,
limits and any remaining acceptance gate. Production source/build/save/runtime
checks belong to the eventual native change, not this workbench delivery.
