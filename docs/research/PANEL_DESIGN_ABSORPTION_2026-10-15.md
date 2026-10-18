# Panel design absorption from text, idle and menu-heavy games

2026-10-15. Requested by Weibao: panel design from Proto23, Idling to Rule the
Gods, other idle games and games with many menus; more-to-consider pass.
Research and recommendations, not accepted new direction or implementation.

## Authority and scope

Keep the accepted Proto23 frame language and build order in
[PROJECT](../../PROJECT.md#standing-priorities-and-document-authority) and the
[foundation round](../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md). Placement,
navigation, discovery and scrolling follow [UI rules](../UI_RULES.md) and
[surface types](../UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md).
This comparison does not reopen those decisions or supersede active UI lanes.

Target for a later trial: 1366×768, populated save, desktop/laptop first.
Visible outcome: identify current work, choose a routine action, inspect a
related object and return without hunting or losing the log. Mobile, a full
redesign, new gameplay systems and imported code are outside this research pass.

## Evidence and limitations

Proto23's pinned source was fetched again and its SHA256 matches the existing
[source study](proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md):
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
Relevant CSS, recipe detail and skill-reveal functions were inspected directly.
The older report owns introduction/post-difficulty browser evidence; this pass
does not claim a new Proto23 playthrough.

ITRTG: inspected two official Steam store screenshots through a background
browser, one combat screen and one creation screen. These establish pictured
layout, not present-build interactions, tooltips, shortcuts or accessibility.
Kittens and A Dark Room: relevant source inspected. Bitburner: official API
documentation inspected. Factorio: developer design articles inspected.
Melvor: indexed official wiki material only; direct wiki and game fetches
returned 403. No live Melvor behavior is claimed.

Detailed captures, exact source URLs, hashes and available branch-head IDs are
in gitignored [private/MANIFEST](panel-design-2026-10-15/private/MANIFEST.json).
The A Dark Room branch-head lookup returned 422; its captured bytes are hashed,
but an immutable upstream revision was not resolved. No downloaded source ran.

## What Proto23 actually does

| Code | Observed source mechanism | What to adapt |
| --- | --- | --- |
| P23-1 | Square framed regions, gradients, thin separators and compact rows; CSS lines 7–91 | Shared tokens and components, already accepted. Preserve readable targets and group spacing |
| P23-2 | You and opponent occupy nearby regions above actions | A stable player summary beside a contextual person/opponent focus, with comparison data visible together |
| P23-3 | Recipe rows have a neighboring reagent/output/tool detail region; `renderRcp`, lines 10623–10704 | Select a row and read/act beside it. Support click and keyboard focus; the original hover dependency is not a requirement |
| P23-4 | Skills become listed in the level-up branch of `giveSkExp`, lines 13747–13758; recipes/actions/books reveal further controls | Interface growth follows earned knowledge. First XP alone is not the source's skill reveal trigger |
| P23-5 | Inventory subtype colors, equipment rarity colors, combat result colors and new-item feedback have different purposes | Separate semantic tokens, with words/icons for important meanings. Avoid coloring every noun as rarity |

The useful inheritance is the relationship between information, actions and
discovery, as well as the look. Do not inherit fixed coordinates, hover-only
access, broad restore reveals or unknown-license source/assets. See the existing
[UI absorption](proto23/UI_SOURCE_ABSORPTION_2026-10-13.md) for precise source
anchors and unresolved provenance. Independent implementation remains the route.

## Ranked reference comparison

Rank reflects fit for the present panel/navigation question, not overall game quality.

| Code | Reference and evidence | Mechanism worth taking | YAIR application and cost | Disposition |
| --- | --- | --- | --- | --- |
| G1 | [Proto23 pinned source](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html) | Stable regions, adjacent details, earned reveals, distinct feedback vocabularies | Continue the accepted skin/foundation and integrate list/detail patterns. Moderate migration cost, existing owners | Adapt; visual direction already accepted |
| G2 | [Melvor official beginner guide](https://wiki.melvoridle.com/index.php?title=Beginners_Guide), indexed interface section; [official FAQ](https://wiki.melvoridle.com/index.php/FAQ), indexed quick-equip description | Named skill navigation, collapsible navigation groups, task-specific quick equipment | Persistent named destinations; compact contextual tools within the selected task. Moderate cost to bind routing and equipment eligibility | Adapt named navigation; quick-equipment trial later |
| G3 | [Kittens source](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/index.html), lines 397–465; [Workshop](https://wiki.kittensgame.com/en/game-tabs/workshop) | Resource/main/log regions and earned subsystem tabs | Keep resources and log present as the work region changes. Low structural mismatch. Kittens also tabs Queue against Log; YAIR's accepted always-visible log takes precedence | Adapt regions and earned tabs |
| G4 | [Idling to Rule the Gods](https://store.steampowered.com/app/466170/Idling_to_Rule_the_Gods/), official combat and creation screenshots | Persistent character pane and broad navigation above a replaceable workspace; creation rows align count, target and command | Summary plus focused management view. For existing parallel work, align owner, allocation, output and next threshold. Moderate cost; no new clone/worker mechanic implied | Adapt management layout; avoid copying icon-only navigation |
| G5 | [Factorio Factoriopedia](https://factorio.com/blog/post/fff-397) and [search/pins/alerts](https://factorio.com/blog/post/fff-400) | Follow inputs and uses, search consistently, pin a destination, open the relevant alert location | Known item → known recipes using it → relevant service; notices open their exact subject. Moderate/high binding and observer-filtering cost | Adapt navigation relationships; strongest addition beyond the current skin |
| G6 | [Bitburner openTail](https://github.com/bitburner-official/bitburner-src/blob/847fcb20e4197aaca6042621bde9e65e4c822d41/markdown/bitburner.userinterface.opentail.md) | Inspect a particular running script's output in its own tail window | Optional inspection of an existing job's progress/reasons, alongside ongoing play. Moderate cost; existing panels already support optional placement | Trial an inspector only when a real job needs it |
| G7 | [A Dark Room source](https://github.com/doublespeakgames/adarkroom), `script/room.js`, room initialization, `unlockForest`, build availability | Narrative changes introduce new places and capabilities | A short event introduces a real new interaction and points to its home. Moderate content/knowledge integration cost | Adapt reveal pacing; retain essential navigation and recovery |

ITRTG screenshot references from the official store API:
[combat](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/466170/ss_97221950c8be2db4731d0e653ea211b3b4d1a9fe.1920x1080.jpg?t=1770066229),
[creation](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/466170/ss_9d2d2d2d39d35e17faeb2af2e7b53c2738cd7d9d.1920x1080.jpg?t=1770066229).
The first shows character stats at left, icon navigation above and opponent
details/action at right. The second retains that structure around a production
table. The icon bar illustrates a discoverability cost; its tooltips were not tested.

## Recommended composition, proposal

Use a persistent named navigation strip across the top. At laptop width,
group lower-frequency destinations rather than compress labels into unexplained
icons. Existing UR21 direct routes remain the requirement; seven routine actions
is a Local actions budget, not a seven-destination cap on the whole game.

Below it, keep three stable regions: player/resources at left, current place or
selected large view in the center, and the full-height event/combat log at right.
Put current work in the always-visible summary. Within the center, show nearby
people/opponents when relevant. A selected list gets a neighboring detail area
when width permits; at 1366×768 use the existing expanded-center route if a split
would make either side unreadable. These are alternatives to compare, not fixed
pixel allocations. Bottom-pinned destination back bar and Esc use the shared
controller. Threshold choices such as world start retain their accepted dedicated screen.

Compact and expanded views should project the same state and invoke the same
commands. A pin changes presentation only. It must not become a second copy of
the feature or an offsite remote-control privilege. Watching a distant bench is
different from being allowed to operate it.

## More to consider: account for now

| Code | Consequence | Constraint or proposal |
| --- | --- | --- |
| M1 | Navigation can accidentally change play | Distinguish inspect, leave service, stop job and cancel commitment. Current `center_modes.js` back invokes a stop callback, so browsing away cannot be assumed harmless. Specify each surface's behavior before linking it |
| M2 | Expanded views can create duplicate state | One owner/command path for compact and expanded forms. Preserve selected item, filter, focus and scroll. Source currently resets center content scroll on mode painting; full return restoration is not established |
| M3 | Searching and cross-links can reveal unknown content | Use actual observer-qualified knowledge in names, counts, filters, recipe uses, tooltips and notices. Unknown absent; known unavailable retains its reason. Search navigation does not grant service access |
| M4 | Idle play needs meaning between clicks | Distinguish running, blocked, awaiting input, complete and lost access. Show actual output/rate, next threshold and reason; offer an ETA only when the simulation supports it. Do not invent precision for random or conditional outcomes |
| M5 | A busy simulation can destroy reading and clicking | Keep rows/selection stable across ticks; do not jump under the pointer. Preserve a scrolled-up log, show unread activity, coalesce repetitive ticks and keep important events legible. Reduced motion and non-color cues remain necessary |

## Later trial and acceptance

**T1, proposed next panel trial after the accepted foundation order:** one
existing service, ideally the accepted apothecary slice when its owner is ready.
Compare compact list/detail against expanded center at 1366×768, using the same
recipe, current work and log. Show requirements and outcome next to the command,
open one known ingredient's reference, then return to the exact recipe/position.
No new economy, keeper behavior or work system is authorized by this comparison.

Acceptance for that implementation: rebuild, fresh isolated origin, populated
save, routine controls/work/back visible, log retained, keyboard route and larger
text checked. Separately test whether browsing stops work, whether loss of access
shows the correct reason, and whether discovery remains safe. Reload/import and
old-layout compatibility checks apply if saved state/layout is affected. Weibao's
visual-feel acceptance remains distinct from technical proof.

**L1, parked research:** Your Chronicle for story/task integration; Evolve and
NGU Idle for long-lived subsystem navigation; Dwarf Fortress, RimWorld and grand
strategy games for relationship views, management tables and explanations of
derived numbers. These are candidates for named future gaps, not inspected
mechanism claims or a required new research wave.

## Current source grounding and work performed

Read `panel_kit.js`, `workspace_views.js`, relevant `workspace_layout.js` routes,
`center_modes.js` and `display.js` mode bindings. The registry, discovery
predicates, panel opening and center stack already exist in source. Extend these
owners rather than add a parallel UI framework. Presence is not proof of all
UR21–UR33 behavior or human acceptance.

Only this report and ignored reference captures were created. No runtime,
shared UI owner, build, user save, commit or publication was changed. No gameplay
tests ran because this pass changes no gameplay. Remaining gate is the bounded
rebuilt panel comparison if selected for implementation.

## Authorized C1 follow-up and source-replacement assessment

Later 2026-10-15, Weibao explicitly asked to send the baseline to the UI worker,
verify its reading, continue refactoring, show the rebuilt result beside Proto23,
and use smaller subagents. The prior research-only status applies to the earlier
pass; C1 is now authorized implementation through the existing foundation worker.
[Fresh acknowledgment](../gm/dispatch/ui-foundation-2026-10-15/BASELINE_ACK.md)
and [C1 acknowledgment](../gm/dispatch/ui-foundation-2026-10-15/C1_ACK.md)
own the transfer. The old waiting queue was stopped before NAV dispatch; root's
[coordination record](../gm/dispatch/ui-triage-apothecary-2026-10-15/runs/COORDINATION.md)
preserves the exact reason and queue order. Only the C1 worker edits shared UI.

Two GPT-6 Luna medium read-only subagents assessed source reuse and composition.
Their conclusions, checked against the source seams and existing owners:

| Code | Route | Assessment |
| --- | --- | --- |
| SR1 | Run pinned original Proto23 locally as a reference | Feasible. Root served the captured original HTML on an isolated localhost origin and advanced its introduction through normal controls. This is separate from YAIRPG and personal saves; it is not a redistributed dependency or integrated engine |
| SR2 | Replace YAIRPG's entire page/engine with Proto23 | Does not deliver the requested presentation refactor: the single file brings its own game state, timers, saves and handlers. YAIRPG's generated bundle, stable action/trade/storage/crafting IDs, center-mode owner and save/import contracts would need a separate compatibility project |
| SR3 | Drop Proto23's original DOM/CSS into YAIRPG | Not a ready component transplant: fixed geometry/selectors and game-owned handlers conflict with the workspace registry's movable nodes, discovery/eligibility and shared navigation. Its shape can guide an independently implemented shell, with existing native commands bound underneath |
| SR4 | Refactor YAIRPG's shared shell around the reference | Chosen for C1: use preset/default grouping, shared tokens/components, the current center controller and the actual gameplay/save owners. Consolidate repeated shells and scene controls; preserve explicit player layouts and give existing players the deliberate Workspace preset route |

Specific coupling points: `index.html` loads the generated bundle and defines
stable native surfaces; `src/center_modes.js` moves and toggles those surfaces;
`src/workspace_layout.js` registers node identity, home, discovery and eligibility.
Replacing all of them with the other game's HTML is a behavior/persistence
replacement, beyond this composition slice. A small generic snippet might be
reusable after provenance review, but no such snippet is required for C1.

The source subagent checked official repository metadata/root files and found
no declared license. [Official repository](https://github.com/23html/23html.github.io),
[metadata](https://api.github.com/repos/23html/23html.github.io).
This records provenance status, not a legal conclusion about local inspection.
Local reference use proceeds; this slice copies no original source/assets into
the distributable game. Its presentation implementation remains original.

The requested comparison will identify reference dimensions, new-build evidence,
fresh/default versus saved-layout behavior and remaining taste acceptance. It
must not turn a reference screenshot or the old technical receipt into proof of
the new composition.

## Deeper native exploration and source lab, 2026-10-15

Weibao then asked to click further into Proto23, or build/use a source-based
variant to see fuller UI. Root continued the isolated unmodified source on
19117 through ordinary controls, separately from the new developer lab:

- **N1, earned skill view:** a skill unlocked during ordinary elapsed play;
  opening Skills and clicking its row displayed the native description/perk
  detail overlay. No skill flag or XP was injected in this run.
- **N2, settings and return:** inspected the native log-limit, background sliders,
  background presets and gradient option. Chose the source's Night preset
  (18/18/46). Clicking the active Settings tab again returned to the place view.
- **N3, home and reading:** used the normal recovery/home choices, examined the
  starter bag, acquired its actual contents and read its instruction paper.
  Ordinary reading completion unlocked four native recipe entries and Assemble.
- **N4, actual crafting:** clicked the learned healing-powder recipe. Source
  inventory changed from 15 to 12 Cure Grass and gained one product; the adjacent
  requirements/output region and native log updated. This was an executed craft,
  not a selection-only preview. The lab's flour row similarly consumed one wheat
  and produced two flour through the original renderer's click binding.

The material lesson: a stable player/inventory/focus/log shell also holds the
deeper skill, reference, settings and recipe views. Recipe list and neighboring
detail are a strong visual reference. Preserve YAIRPG's explicit native command,
preview and work/stop semantics when adapting it: Proto23's item/recipe clicks
can start reading or craft immediately, and repeating a tab can close a view.
Those are distinct choices from the visual layout.

The private [source lab](panel-design-2026-10-15/private/proto23-lab/UI_LAB.md)
uses a source copy plus a separate harness, not replica panels. It is served at
<http://127.0.0.1:19118/> on its own disposable origin. Visible DEV SEEDED buttons
grant valid items, XP or unlock prerequisites through source owners and open
native Crafting, Skills, Actions, General Store and Journal. Root exercised all
five and opened Journal statistics through its normal subnavigation. This proves
those native renderers respond in the local variant, not normal acquisition of
every seeded feature or integration into YAIRPG.

The lab's manifest records exact seed functions and limitations. Source copy,
data and screenshots stay under the existing gitignored private directory.
Normal-play observations N1–N4 remain separate from these seeded demonstrations.
C1's production implementation and its saved-layout compatibility remain owned
by [C1_REPORT](../gm/dispatch/ui-foundation-2026-10-15/C1_REPORT.md).
