# Mockup workbench delivery, 2026-10-16

Weibao requested a lasting better mockup system. Earlier recipe/activity
experiments each had their own review controls and serving instructions. The
new [workbench](README.md) provides one host for future interactive comparisons;
[docs/MOCKUP_SYSTEM.md](../../docs/MOCKUP_SYSTEM.md) owns the standing workflow.
USER_VISION, PROJECT and UI_RULES link to that owner. This accepts the tooling
direction, not an individual layout.

## Delivered

| Code | Behavior |
| --- | --- |
| D1 | Registry-driven study briefs, shared layout/scenario/viewport/text controls and explicit fixture/limitations disclosure. First packaged study: the existing two-recipe experiment, with pinned YAIR tokens/detail renderer and a simplified five-region frame. |
| D2 | Same-state layout switching and two interactive comparison panes. Stock, selected recipe, query, history, supported scroll/focus anchors and historical event data survive; peer synchronization restores resulting state without replaying commands or stealing focus. |
| D3 | Ready, missing-material, missing-station, reserved-stock, limited-knowledge, crowded-inventory/log and long-fictional-name scenarios. Manual clock, explicit reset and review download. No automatic persistence or review import. |
| D4 | Separate 1366×768/1920×1080 canvas sizes, actual 14/17.5/21px text and labelled fit/actual-size display modes. The tooling scrolls at actual size; game-fixture page overflow is checked separately. |
| D5 | Isolated fresh-port loopback server, reproducible copied fixture, input hashes/build revision and documented adapter protocol. Existing prototypes and shared game source/build remain unchanged by this task. |

Build revision: `1ff037042349385d`, pinned in [built/INPUTS.json](built/INPUTS.json).
The recipe adapter consumes the retained prototype's compiled real components
and data; it does not claim to rebuild the latest game source. New studies need
a registered entry **and** a fixture packaging step/adapter.

Targets: populated synthetic laptop fixture at1366×768 and 14/17.5/21px;
wide1920×1080 at21px with long names. Surface: Cooking service and local/full
reference within You/Focus/Inventory/Actions/Reports. Deferred: mobile,
new gameplay, production UI changes, saves/migrations, migrating the entire old
mockup archive and human visual/default-layout acceptance.

## Executed verification

Built with `node prototypes/workbench/build.mjs`. Served using
`node prototypes/workbench/serve.mjs` at fresh origin
`http://127.0.0.1:62841/`. Ran:

```sh
node prototypes/workbench/check.cjs http://127.0.0.1:62841/
```

**10 browser check groups pass**, recorded in [checks.json](evidence/checks.json).
They cover layout state/focus retention; ingredient/reference/recipe Back/Esc;
blocked attempts without spending; limited knowledge; bidirectional comparison
including historical-event handlers and scrolled inventory; both layouts at
three real text sizes without fixture page overflow; long names and wide
canvas; no-scale actual-size mode and explicit manual/reset clock; downloaded
review content; no localStorage keys or observed page errors.

All five JavaScript/build/server/check files also pass `node --check`.
No game build or full gameplay regression suite was run because this change
does not edit those inputs. These are prototype interaction checks, not native
crafting/gameplay/persistence proof.

Visual inspection: [laptop workbench](evidence/workbench-laptop.png),
[comparison overview](evidence/workbench-compare.png),
[compact actual21px](evidence/compact-21.png) and
[adjacent actual21px](evidence/adjacent-21.png). The overview is explicitly
scaled. Individual fixture captures are rendered directly in separate browser
pages at their exact target viewport without scaling. Earlier development
captures from scaled embedded panes were replaced. Compact keeps its known
result/action visible at21px; adjacent detail needs its internal scroll region.
Those are observed tradeoffs, not a selected default.

## Remaining gate

The reusable tooling is implemented and browser-checked. Weibao's visual and
interaction preference for each study remains open. A later native integration
needs its own source ownership, rebuild, natural journey and affected
save/import checks. Synthetic successes here establish none of those gates.
No commit, push, install or publication performed.

## Launch choice and personality study, 2026-10-20

Status: archived and superseded by Weibao’s later restoration request. It does not implement new gameplay. The current game uses its original loading appearance and direct PLAY; this study is historical only. Owner: [intro round 24, LC1–LC12](../../docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-24-richer-launch-choices-panel-placement-and-retained-character-2026-10-20). User asked for starts beyond optional systems, movable panels and recovery of the launch screen's lost character.

Added the `launch` study to the existing workbench. Use `node prototypes/workbench/build.mjs`, then `node prototypes/workbench/serve.mjs` and open its fresh URL with `?study=launch`. Current session preview: http://127.0.0.1:57584/?study=launch (exec session 82745). Two layouts use the same fixture: identity/choices/summary columns, or stacked panels. Original recipe study and its archived default geometry remain available; new launch study defaults to 1920×1080. The shared review toolbar also offers 1800×1040 and 1536×864.

Real inputs: current DOM-only `mountNewGameBeginning`, native system-option values, shared tokens and launch stylesheet, copied and hashed by `build-launch.mjs` into [fixture INPUTS](built/launch/INPUTS.json). No main-game bundle, clock, save or private pack loads. Background selection, opening preview and review state are simulated and explicitly labelled. Three backgrounds have small existing layered data prototypes; artisan/traveler are proposals. No invented skills, grants or character history are applied.

Recommendation: compact named starts in the central panel, details in the right summary, optional System disclosure below the starts, identity/signature left, credits/version below. Keep the original richer plum gradient and tilted author signature. Existing native loading messages still exist, but the isolated study does not simulate actual loading. At 1536×864 and 21px, central choices scroll; the summary and preview action remain visible. The stacked alternative scrolls the whole launch at large text and buries the action, so columns are the current recommendation. No human choice/acceptance is recorded.

Checks:

- `node prototypes/workbench/build.mjs`: PASS. Shared manifest includes the launch-fixture input hashes; earlier pinned recipe fixture remains unchanged.
- `node prototypes/workbench/check-launch.mjs http://127.0.0.1:57584/`: PASS, three check groups with 12 layout/size/text measurements, zero page errors/storage writes. Shared-state comparison, native radio selection, variant switch, long labels, preview and Escape/focus return exercised. [Receipt](evidence/launch-2026-10-20/receipt.json).
- `node prototypes/workbench/check.cjs http://127.0.0.1:57584/`: existing recipe/workbench regression PASS, 10 check groups. This retains its archived 1366×768 fixture checks; that is not a new game viewport requirement.
- `node --check` on the new adapter/build/check and modified shared controller, scoped `git diff --check`, and `npm run check:rules`: PASS. The existing untracked gear-depth link warning remains.
- Visually inspected [columns](evidence/launch-2026-10-20/columns.png) and [1536×864 at 21px](evidence/launch-2026-10-20/columns-large.png); [stacked capture](evidence/launch-2026-10-20/stacked.png) retained. Compact cards and expandable System correct the first prototype's excessive height.

Remaining gate: director judgment on placement/personality, followed by separately selected native beginning implementations. Production launch behavior and its earlier verification are unchanged. No new subagents, commit, push or personal-save operation.
