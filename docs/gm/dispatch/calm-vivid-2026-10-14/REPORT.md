# Calmer Vivid and progressive UI disclosure

2026-10-14. Implemented and rebuilt in the shared working tree. Technical slice
verified below; Weibao's visual-feel acceptance is open. No commit or push.

## Result

**D1: Quieter hierarchy.** Vivid retains its navy, teal, purple and green panel
roles. Inactive controls, panel edges, collapsed headings and log filters compete
less with the current action. Selected tabs use a lighter edge and readable text
instead of a large gold fill. Compact closed secondary sections preserve their
30px minimum summary targets; open explanations retain their space.

**D2: Discovery uses the existing owners.** Latest integrated skill/journal,
combat and optional staged-opening work is retained. Bestiary and Anthology tabs
now appear when native earned-record lists are populated. Empty Magic navigation
stays unnamed and hidden. Knowledge remains sticky through list refreshes within
a session and is derived again from native restored records on load. No unlock
rewards, XP, inventory, save schema or discovery-save flags were added.

**D3: Useful panels and controls remain reachable.** No column widths, personal
layout, pin/collapse state or text size is changed. Inventory, preparation,
actions, vitals and reports remain independent. Newly integrated per-item hotkey
forms now sit behind native `details`/`summary` controls beside their item,
available by pointer or keyboard. The fixed native read-button width no longer
splits its closing bracket at the laptop font size. The build fingerprints
`workspace.css` to avoid mixing updated JS with cached presentation.

Source paths: `styles/workspace.css`, `src/workspace_disclosure.js`,
`src/workspace_views.js`, one hotkey-holder change in `src/main.js`, and the
stylesheet cache key in `build.js`. Generated bundle/map/index rebuilt.

## Latest work and evidence provenance

Preflight was `ce005a31`; unrelated integration advanced HEAD to `ba46670a`
during the task, including the P01 mixing-feedback merge. Preserved those
changes and rebuilt from the combined live source. Final sourcemap contents
match current main/workspace/disclosure source, and fetched bundle/CSS match disk.
The older UI writers explicitly released ownership. Unrelated dirty documents
and evidence were preserved.

The populated fixture is deliberately synthetic: inventory, money, skill XP,
known kills and reading progress extend a disposable current-build save earned
through the native opening/elder route. It is density/restore evidence, not
natural balance or earned late-game progression. An initial inconsistent fixture
omitted the Literacy XP required by its reading progress; the loader correctly
warned and entered recovery. That fixture was corrected. This was not a newly
established old-save compatibility defect.

Native first-kill discovery uses the separate current-build precombat export
without synthetic progression. Personal browser profiles and user save files
were neither read nor changed. Baseline comparison images use the pre-task
committed JS and backed-up CSS on the same disposable fixture.

## Checks

| Code | Evidence | Result and scope |
| --- | --- | --- |
| V1 | `node build.js`; [build parity](evidence/build-parity.json) | Build passes; current sourcemap source, served bundle, served CSS and CSS fingerprint agree |
| V2 | `node --test tests/workspace_disclosure.test.js tests/workspace_focus.test.js tests/reveal_chain.test.js` | 9 pass: transient list refresh, restored/independent knowledge, existing focus/reveal behavior |
| V3 | `npm test` | 1,758 pass, three TODOs, no failures, 1,761 total; source unchanged after this run except a subsequently checked inventory CSS width fix |
| V4 | [Browser driver](check-browser.cjs), [13 groups](evidence/browser-results.json) | Fresh opening; same-state before/after; populated 1366×768, 1440×900 and 1920×1080; native first kill/reload; reference selection; keyboard hotkey disclosure; saved pin/collapse state; actual Export/download/literal-file Import; Standard; reduced motion/no restore reveal |
| V5 | [Visual driver](check-visual.cjs), [results](evidence/visual-results.json) | Crafting view, corrected read-button fit, actual Appearance Apply/save/reload, 150% viewport/scale emulation, and 51 visible text samples with minimum measured contrast 7.54:1. This is not a full-game accessibility audit or real browser zoom |

The three populated desktop sizes have no document horizontal overflow. All named
useful modules remain available with their existing scrolling. That does not
mean every known panel or every inventory row fits simultaneously above the fold.
No automatic rearrangement or forced collapsing of learned panels was added.

## Screenshots

| State | Before | After |
| --- | --- | --- |
| Opening, 1366×768 | [Before](evidence/before-opening.png) | [Calmer opening](evidence/after-opening.png) |
| Populated, 1366×768 | [Before](evidence/before-populated.png) | [Calmer populated view](evidence/after-populated-1366.png) |
| Populated, larger laptops/desktops | Same content fixture | [1440×900](evidence/after-populated-1440.png), [1920×1080](evidence/after-populated-1920.png) |
| Other affected states | Current rebuilt source | [Combat](evidence/after-combat.png), [crafting](evidence/after-crafting-1366.png), [Standard](evidence/standard-populated.png), [150% emulation](evidence/after-populated-150pct.png) |

Play preview: `http://127.0.0.1:19064/`, a separate local origin. Starts normally;
the synthetic populated state is shown in evidence, not installed into a user's
existing game. The task's Python server is left available for review.

## Open review and future considerations

**R1: Human feel.** Weibao decides whether the calmer hierarchy is preferable in
ordinary and populated play. Technical passes do not grant taste acceptance.
Real browser zoom and broad endgame/all-world review were not performed.

**O1: Contextual workspaces.** Future direct interaction should replace the
relevant activity region or add a justified independent view, rather than append
another permanent box to every screen. [Earlier proposal](../../../PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md).

**O2: Future discovery producers.** The new disclosure helper accepts a read-only
projection. Native lists currently provide earned reference entries; if those
lists become virtualized or acquire placeholders, supply explicit host knowledge
facts instead of treating decoration as discovery. A future magic system must
present genuinely known content, not reveal its tab through an empty placeholder.

**O3: Later relevance defaults.** Automatic grouping/focus modes can be compared
separately if busy saves still feel crowded. Preserve manual pins, stable focus,
history and predictable access. These are future proposals, not new gates for
this delivery or other active waves.
