# p23-life-loops absorption report, 2026-10-14

Status: implemented and verified at the controlled native scope below. Names,
fiction and balance remain reversible proposals. Director play/taste is pending.

Implementation: `99b207e6c72eac0ce64d3a10aee0094055e05ea3`, branch
`absorb-all/p23-life-loops`, base `0216ccde`. No push or main-branch merge.
The original Proto23 ledger is untouched. Proto23 is unlicensed; no foreign code,
assets or prose were copied.

## Outcome and row decisions

The existing Local life owner now supports a morning watch, weekly market stall,
chance-visible courier and pamphlet, repeatable parcel relay, elder guidance and
explicit search exhaustion. Two public lifetime title goals and live grant cues
extend the existing Titles owner. Native Bleeding from an existing clawed enemy
trains the existing defensive skill. The existing calendar and joined settlement
remain authoritative; no second clock or reward timer was introduced.

Desktop target: **1366×768**, useful independent existing panels and visible
routine actions in the Local life scroller. Mobile optimization is deferred.
[Proposal/behavior owner](/Users/weiwei/code/yair-absorb-all-20261014/p23-life-loops/docs/PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md)
records exact routes, numbers and compatibility. `PROJECT.md` links that owner.

| Ledger row (1-based) | Source item | Decision and landing |
| --- | --- | --- |
| 3 | Lifetime home and purchase counters | Adopted in `99b207e6`: `src/absorb_c2/local_life.js; src/main.js; src/titles.js`. Schema 3 preserves old accounts; historical home time and purchases default to zero, not fabricated. Two public goals use native observed minutes and settled trade quantities. |
| 6 | Title earn moment | Adopted in `99b207e6`: `src/titles_ui.js; src/native_discovery_feedback.js; src/native_discovery_policy.js; src/settled_text_effects.js`. Configured native title events reuse the existing cue, compact styling, dismissal and effects settings. Restores emit no event. Existing all-held title bonuses remain derived; no separate equipped-title system. |
| 11 | DoT trains resistance | Adopted in `99b207e6`: `src/active_effects.js; src/enemies.js; src/absorb_c2/local_life.js; src/main.js`. Existing clawed guardian applies stackable native Bleeding. Played exposure trains existing Iron skin, a bodily-defense adaptation. Food-poison training from C2 is retained, not duplicated. |
| 16 | Wait-out-a-shift job | Adopted in `99b207e6`: `src/absorb_c2/local_life.js; src/world_rhythm.js recurringWindow; src/expansion_quest_ui.js`. Morning acceptance, idle Village watch through 20:00, native money and skill settlement, visible closed reason and repeated next-day shifts. Existing Persistence substitutes for a new Patience skill. |
| 57 | Daily/weekly hooks | Adopted in `99b207e6`: `src/absorb_c2/local_life.js; src/world_rhythm.js recurringWindow`. One weekly market stall restocks a persisted free bread claim and displays the next occurrence. Existing daily bread and native trader restock retain their owners; no second clock or catch-up registry. |
| 61 | Pamphlet and chance-visible visitor | Adopted in `99b207e6`: `src/absorb_c2/local_life.js`. One capped 40% arrival roll, deferred until idle, retains the courier after meeting. Pamphlet reveals relay actions in the location list without bypassing native mill travel permission. No new map location is invented. |
| 62 | Parcel relay and mentor | Adopted in `99b207e6`: `src/absorb_c2/local_life.js; src/expansion_quest_ui.js`. Three explicit existing-NPC handoffs with ordinary Village/mill travel, a next-stop Quest card, paid final receipt, explicit repeat and elder guidance. Existing quest presentation and Local life settlement remain the owners. |
| 65 | Scouting remaining finds | Adopted in `99b207e6`: `src/absorb_c2/local_life.js; existing src/absorb_c2/panel.js consumer`. The existing search row states one remaining find or zero/nothing remains, and disables exhausted search. Find quantities and chance are unchanged. |

The ledger JSON beside this report preserves each exact source, heading and
mechanism. Row 93 straddles Titles and equipment presentation. Its unearned title
portion already existed in `73519a0a`; its actual next slice (held-copy condition
and repair cost) belongs primarily to `p23-ui-polish`, so this lane does not claim it.

## Compatibility and finite consequences

Absent, schema-1 and schema-2 Local life records upgrade to schema 3 while
preserving search, runner tickets and daily meals. New home/purchase counters start
at zero because prior saves contain no reliable history for them. Unsupported
future schemas reject; malformed runner and new numeric accounts reject. The FA18
unsupported-schema regression now tests schema 4, since schema 3 is supported.
Native trades settle their quantity counter with inventory, money and XP. Failed
or stale commands do not increment it. Bleeding uses the existing active-effect
name/duration format. No user save was read or changed.

Watch accepts 07:00–10:00 and pays 12 coins plus 3 Perception XP at 20:00 after
remaining idle in Village. Persistence trains during observed watch minutes.
Departure, other work, death or crossing an unserved day interrupts without pay.
Weekly stall claims one Stale bread, once per current week, with no accumulated
missed rewards. The courier rolls once per observed Village arrival at 40%; after
meeting, the courier stays reachable. Relay handoffs pay 8 coins and 2 Perception
XP only at the last receipt; an explicit restart enables another three-stop relay.
Titles grant once per identity, and restored goals/held titles do not replay cues.
Search remains the already-accepted finite find set. These occurrence and receipt
checks prevent replay without imposing a fixed lifetime limit on watch or relays.

## Checks

Run from `/Users/weiwei/code/yair-absorb-all-20261014/p23-life-loops`:

| Check | Exact result |
| --- | --- |
| `npm run build` | PASS, including Ink compiler/artifact check. |
| `node --test tests/p23_life_loops.test.js tests/absorb_c2.test.js tests/titles.test.js tests/native_discovery_policy.test.js tests/fa18_runner_consequence.test.js` | **35/35 pass**, zero failures. |
| `npm test` | **630/630 pass**, zero failures, no pre-existing failures in the final run. 156.251 seconds. |
| `node docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-life-browser.cjs` | **14/14 PASS**, zero page errors; fresh contexts at 1366×768. |
| `node docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-life-extra.cjs` | **2/2 PASS**: actual visit miss/revisit/contact and actual landed guardian hits/stacking/skill exposure. |
| `node docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-title-visible.cjs` | **1/1 PASS**: cue intersects the visible Character panel, uses discovery styling and accessible dismissal. |
| Save/reload and native export/import | **8 checkpoints PASS**: accepted watch, paid watch, pamphlet, relay receipt, weekly claim, home title, bleeding and purchase title. Restored titles do not emit cues. |
| `git diff --check -- src tests docs PROJECT.md` | PASS. |

**17 desktop browser checks total.** The Python server used only assigned port
18706. Headless Chrome uses isolated contexts and does not control Weibao's
foreground Chrome or original saves. Playwright's bundled browser was absent;
the harness uses `channel: 'chrome'` without installing packages. It waits for
DOM readiness and the existing save-ownership display before Play, then tests
native actions. Export/import uses the game's public encoder/preflight/importer.

Tested local and served bundle SHA-256:
`888976300030909716d2f47f35f62dab54eca2a6f3cb2b3ba4e6665161b8b940`.
The visible-cue browser loaded the matching `v0.6-888976300030` URL.
No rebuilt distribution files were committed.

[Evidence folder](/Users/weiwei/code/yair-absorb-all-20261014/p23-life-loops/docs/gm/dispatch/absorb-all-2026-10-14/checks) contains exact logs, result JSON, bundle metadata and
three inspected desktop PNGs. [Visible title cue](/Users/weiwei/code/yair-absorb-all-20261014/p23-life-loops/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-title-visible.png)
and [Local life presentation](/Users/weiwei/code/yair-absorb-all-20261014/p23-life-loops/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-life-desktop.png) show the desktop
result. Scripts require the COMMON.md Playwright path and are reusable on port
18706.

## Evidence limits and implemented-unverified scope

Controlled native saves supply calendar boundaries, an already met courier, the
mill permission and near-threshold counters. Native actions then perform each
changed settlement, ordinary relay travel, title grant and persistence checkpoint.
The visit check separately rolls a real miss and a successful revisit. The combat
check uses the actual native guardian attack loop with controlled RNG and a
disposable high-health fixture; no callback is invoked manually in the final check.
These checks prove the changed native behavior, not naturally earning an entire
campaign route. Natural uninterrupted morning-to-evening watch pacing and earning
the guardian/mill permissions through the campaign remain **implemented-unverified
as full natural journeys**. They are not presented as accepted fiction or balance.
No further implementation blocker is known.

## Merge risks

- **R1: shared host.** `src/main.js` also belongs to the reveal/UI and other absorb
  lanes. Merge the import, Local life context, native trade counter patch, bleeding
  duration case, title refresh/restore and panel initialization hunks individually.
  Retain sibling `nativePatch` additions and save/publication ordering.
- **R2: shared discovery renderer.** The configured event/anchor defaults preserve
  existing skill behavior. Combine sibling discovery changes through this same
  policy/renderer; do not introduce a second cue owner. Titles need both the
  configured event and the compact/accessibility discovery classification.
- **R3: presentation/quests.** New public title goals make the catalog 28 rows.
  Local life and expansion quest cards reuse existing components; reconcile any
  sibling changes to their panel initialization or quest filters. Row 93’s equipment
  condition work remains outside this lane.
- **R4: generated artifacts.** Rebuild after integration. The lane intentionally
  does not commit rebuilt `dist/` or the generated `index.html` fingerprint change.

COMMON.md refers to SESSIONS.md, but that file is absent at the dispatch root.
The risks above use the named sibling lanes and live worktrees, not an invented
session roster. This report and its ledger are the only writes to the main checkout.

## Remaining acceptance gate

**Weibao’s play/taste review** of the labelled proposals at the desktop target.
Technical evidence does not accept names, balance or natural campaign pacing.
Serve the lane on its assigned port 18706; use a fresh test origin for review.
