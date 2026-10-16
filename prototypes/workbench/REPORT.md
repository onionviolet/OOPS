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
