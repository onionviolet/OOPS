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

The initial recipe-browsing study (now archived) was adapted from the retained
[recipe experiment](../prototypes/recipe-ui-2026-10-15/INTEGRATION.md). Its real
renderer/tokens/definitions are a **pinned prior prototype build**, not the latest
native game. The build copies those inputs, hashes them, and appends the local
adapter without modifying the older experiment. Its frame is a simplified
five-region fixture rather than a claim of exact current Shell geometry.

The archived 2026-10-20 launch study pins that round’s Beginning choice renderer
and tokens/styles over explicitly simulated background/opening state. It was
superseded by Weibao’s request to restore the original PLAY screen.
Open the workbench with `?study=launch`. It compares identity/choices/summary columns
and a stacked layout, preserving choices. Its starts/personality recommendations
remain proposals; [receipt](../prototypes/workbench/REPORT.md#launch-choice-and-personality-study-2026-10-20).

Proposed direction, 2026-10-16: studies should mount the real game views over
fixture data rather than redraw a copy. See
[UI engine round 3, UIE17–UIE26](ENGINE_EXPANSION.md#round-3-one-renderer-for-the-game-and-its-mockups-2026-10-16).
Not accepted yet; the rules below still apply.

## Standing rules

| Code | Requirement | Reason |
| --- | --- | --- |
| MW1 | Start with a question, a representative player task, surface/home, target viewport, fixture provenance and exclusions. Put these in the study manifest and display them under Task & limits. | A polished screen should answer an actual unsettled question. |
| MW2 | Use the shared workbench for new interactive comparisons. Reuse pinned YAIR tokens, components and public projections where useful. State exactly which parts are real, simulated or absent. Use a focused pane study only when its question does not depend on surrounding composition, and label that limit. | Avoid unrelated skins and mocks that promise mechanics they do not have. |
| MW3 | Compare alternatives against the same state. Layout changes preserve selected subject, query, stock, history and available scroll/focus anchors. Compare mode mirrors interactions in either pane without replaying the gameplay command. Scenario changes and Reset explicitly restore the fixture. | Avoid one alternative receiving better data, a fresh inventory or an easier task. |
| MW4 | Keep viewport size, text size and display scale separate. Default to 1920×1080 (1366×768 retired 2026-10-19); include other desktop sizes and real 14/17.5/21px text where relevant. Fit preview is labelled and useful for overview. Readability evidence uses actual-size browser rendering/captures. | A scaled thumbnail cannot establish readable large text. |
| MW5 | Exercise the journey, not just the opening image: find, inspect, act, read result, return and resume. Include relevant crowded, long-name, unknown, unavailable and failure states. Use keyboard and Back/Esc, preserve the log and current work. | Empty fixtures and screenshots miss navigation and changing-state defects. |
| MW6 | Isolate from personal gameplay startup, saves, credentials and production storage. Reduced studies use disposable in-memory fixtures. Under the 2026-10-26 current-shell correction, native studies may start a frozen bundle with fixture storage on a fresh disposable loopback origin; use an explicit/manual clock unless time itself is under study. Never import sealed truths into a public fixture. | Review should be reversible, reproducible and safe for the director to play. |
| MW7 | Export a review with fixture state, build revision, viewport, text and limitations. Keep evidence with the experiment. Record recommendations separately from human selection and native integration. Accepted choices go in the existing feature owner and PROJECT summary. | Passing checks or exporting a file does not establish visual acceptance. |
| MW8 | **Show freshness and fidelity separately.** Register each study as archived, sketch or native. Native UI comparisons use the current populated shell/navigation and representative dependencies; reduced fixtures remain visibly labelled sketches. Record source and built-output hashes, recheck them on open and while reviewing, and flag missing/changed inputs before using the study as current UI evidence. Refresh and repeat affected journeys after drift; do not silently relabel a rebuild as verified. | A freshly built sparse mockup can still misrepresent the game; a once-faithful mockup can drift behind its sources. |

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
`build.mjs` packages the pinned recipe study and calls `build-launch.mjs` for the
archived launch-choice renderer over public fixture backgrounds; a registry row alone
does not package a new experiment. Do not scrape a screenshot or DOM back into a
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


## Recovered Corc round 5, 2026-10-21: comparison without changing the experiment

**Candidate study details**, from [CRL35/CRL38/CRL39](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-5-2026-10-21-subtle-interactions-folded-into-the-plans). This is a proposal under existing MW/UR59–UR64, not a change to the standing mockup protocol. Target 1920×1080 at actual 14/21px text; mobile optimization stays deferred.

For a selected effect-chip/relationship study, capture one public fixture/projection and use it for both candidates. Keep cosmetic state separate from action/learning state. Fixture restore, hover/focus and font/theme changes default to observational operations; the recovered source's XP-on-hover behavior is not copied accidentally. A deliberate gameplay examination has its own action and receipt.

Include a target that disappears or becomes unavailable during selection and a delayed font/fallback change that alters label width. Retain the selected logical subject while updating geometry; a tooltip or highlight follows the actual anchor, and a reflow does not redirect an in-progress commitment. A label/shape explains the meaning alongside color when the chosen glyph cannot render. Give icon candidates their actual backgrounds and adjacent text; a stand-alone swatch cannot establish legibility.

If native projection is unavailable, label the fixture simulated and keep the same facts across variants. Do not load source HTML or its external image to obtain a screenshot. A future fixture's packaged assets and actual fonts need their own identity; the prototype's filename/version label is not enough to reproduce it.

**ACT NOW (done):** folded these cases into the existing study owner. **ACCOUNT FOR NOW:** reuse the shared registry/adapters and renderer. **LATER / DELEGATE:** CRJ9, Luna low once the samples are settled, small effort. Done: source-input hashes, same-fixture comparison, zero unintended XP/resource/profile changes, retained subject/focus through reflow and restored comparison state, plus actual-size desktop captures. No new study is built by this documentation pass.

## Freshness and fidelity correction, 2026-10-26

Weibao found the character sketch less fleshed out than Proto23, then requested:
“update accordingly and make sure it doesnt fall behind in the future, send new
chat to do above again”. This authorizes the workbench correction and fresh audit;
it does not select Signal/Folio or authorize production gameplay/app adoption.
MW8 owns the workflow; [UIC13 and rerun record](reviews/UI_CHARACTER_DIRECTION_2026-10-26.md#uic13-director-feedback-on-prototype-fidelity-2026-10-26) preserve the evidence.

The workbench serves `freshness.json` from live source/output hashes. Its visible
banner checks on study change, window focus and every 15 seconds while open.
Archived studies remain archived; matching inputs in a sketch still say “not
current-shell UI proof”. A missing manifest/endpoint is unverified, not current.
This detects tracked dependencies, not every possible undisclosed dependency;
each new native adapter must list all renderer/style/fixture/shell inputs it uses.
The rerun owns replacing the inadequate comparison with a faithful populated
current-shell study. Retain older studies explicitly as history. No unattended
monitor or scheduled automation was requested or created.

## Native character study, 2026-10-26

The default study is now `native-character`: the full populated native shell,
baseline plus two mockup-owned CSS treatments. The earlier character study stays
a sketch; recipe and launch studies stay archived. [Rerun and limits](reviews/UI_CHARACTER_DIRECTION_2026-10-26.md#uic15uic22-faithful-current-shell-rerun-2026-10-26).
The later user direction explicitly permits isolated native startup, superseding
MW6's earlier blanket “Isolate from game startup” wording for this route.

`build.mjs` includes `build-native-character.mjs`. The native builder uses
`BUILD_OUT`, copies linked assets into its own frozen output, records the actual
esbuild input graph (including imported JSON and library inputs), records copied
styles/resources, fixture/bootstrap/shell source and built-output hashes, and
rejects a runtime input changing during the build. It excludes optional private
packs and keeps private fonts ignored. It does not write the primary build outputs.
A successful rebuild establishes byte identity, not a newly passed journey.

After rebuilding, run `node prototypes/workbench/check-native-character.mjs <fresh-origin>/`
and `node prototypes/workbench/check-native-effects.mjs <fresh-origin>/`.
These write their own scoped evidence. Refresh the native fresh-envelope fixture
when compatibility changes, then repeat affected routes; do not drop loader
warnings or hide native controls to obtain a cleaner comparison.

The workbench banner checks declared inputs on study change/focus and every
15 seconds. Drift remains visible while a frozen historical capture remains
inspectable. This is a detector, not an unattended rebuild or a visual-fidelity
oracle. New external/dynamic dependencies must join the manifest.

For this native study, use Layout switching on one running instance. The
simultaneous comparison checkbox is disabled because native command mirroring
has not been implemented. The matched gallery places baseline/treatments alongside;
it is labelled screenshot evidence. Other studies retain their existing mirrored
fixture protocol. The native bootstrap waits for save ownership before PLAY and
skips native import-probe instances; its isolated CSP permits the native worker.
These are mockup hosting details, not changes to the production save controller.
