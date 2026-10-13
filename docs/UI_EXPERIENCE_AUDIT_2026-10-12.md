# UI, thematic identity and whimsy audit

Requested by Weibao, 2026-10-12. Audit and original design proposals only. No
gameplay edits, accepted layout, implementation dispatch, commits or publication.
This is the separate audit requested while laptop/customization implementation is
[paused](gm/dispatch/cheats-sfx-implementation-2026-10-12/CHECKPOINT.md).

## Conclusion

The main need is a coherent play interface that spends space on the current
decision, shows its consequences, and feels like a particular life in a
particular world. Movable boxes, additional settings and palette changes are
useful tools, but their presence does not establish that experience.

Preserve independent functional panels. Give ordinary play and authoring
deliberate arrangements across the laptop's width and height. Develop theme and
whimsy alongside that composition, with the first effects attached to real
results. Do not solve the screen problem by shrinking text, hiding everything,
or turning every system into one overview.

## Evidence and limits

Read PROJECT.md, USER_VISION.md, the existing UI/thematic audits, presentation
ideaboard, live UI and customization checkpoints, laptop steering, and relevant
native/action/pack/notebook/event-feed/profile source. Shared checkout was dirty
at observed HEAD `dd3efe3383f12f0aac22e4f390aae90fae2e7fc4`; HEAD alone does not
identify the reviewed source.

Copied public runtime inputs into a temporary directory, excluding private
packs, personal saves and source-library prose. Ran the actual `node build.js`
there, including the Ink check, then served the rebuilt snapshot on fresh origin
18612. Initial snapshot build attempts lacked imported document assets; copied
the actual imported assets and reran successfully. No shared build was changed.

Inspected frozen candidate previews 18571 (workspace) and 18582 (customization)
in fresh headless Chrome contexts, without changing their files or existing
browser storage. They were not rebuilt by this audit. Inspected all three
openings at 1440×900, 1512×982 and 1920×1080 CSS-pixel viewports; at 1440 also
exercised the public elder greeting. On both candidates expanded native work
choices and started the actual loaned-kit patrol. Expanded the customization
editor and scrolled to Apply. All captured journeys had zero page exceptions.

This proves those inspections and patrol starts, not a completed shift,
crafting, combat, reward settlement, preference Apply, audible sound,
save/reload/import, browser-menu zoom, or private-world acceptance. Candidate
prior proofs remain scoped to their own reports. No personal save was opened.
Laptop dimensions are explicit test assumptions, not a measurement of Weibao's
current screen. Mobile redesign is deferred per latest steering.

Evidence: [measurements](reviews/ui-experience-2026-10-12/EVIDENCE.json),
[editor and work inspection](reviews/ui-experience-2026-10-12/FOLLOWUP.json),
[input bindings](reviews/ui-experience-2026-10-12/MANIFEST.json).
The generic control inventory excludes some native event-listener DIV controls;
offscreen counts include deliberately scrollable content. Neither is a count of
broken controls. Findings use screenshots, actual interaction and named source.

## Findings

| ID | Priority | Evidence | What is needed |
|---|---|---|---|
| F1 | First | Shared opening is 1656 px wide at both laptop widths. At 1440, the reports column is clipped and patrol prose occupies the local-action area. [Shared opening](reviews/ui-experience-2026-10-12/shared-1440-opening.png). | A laptop composition with visible routine decisions and no horizontal page overflow. Preserve full reading separately. |
| F2 | First | Workspace opening puts Talk and Work together on screen. Customization candidate again places patrol prose before them. Its `main.js` registers ledger/customization but does not preserve all of the workspace candidate's action hierarchy. [Workspace](reviews/ui-experience-2026-10-12/workspace-1440-opening.png), [customization](reviews/ui-experience-2026-10-12/customization-1440-opening.png). | Reconcile the combined interface, not only the editor. Treat local-action order as an integration contract. Do not copy dated main/build files. |
| F3 | First | Presentation profiles and Original System rules share one tall right-dock host. At 1440, expanded profile Apply initially measures y=1607.4, beyond the 900 px viewport. Scrolling reaches it, but separates earlier choices from applying them. [Expanded editor](reviews/ui-experience-2026-10-12/customization-1440-editor-expanded.png), [Apply](reviews/ui-experience-2026-10-12/customization-1440-editor-apply.png). | Independent Appearance, Effects/Sound and Rules surfaces, with a wider editing arrangement and visible draft/apply status. Keep a shared draft/profile owner behind separate views. |
| F4 | High | Workspace repeats Collapse/Options on every panel. Empty skills, records, inventory and a 137 px idle-work panel consume substantial opening height. Customization's collapsed Work ledger retains a large empty outer body in the inspected busy view. | Size default bodies from useful content and reserve flexible space for the active task. Keep direct movement, but offer a deliberate layout-edit mode for secondary chrome. Filling space is not the same as using it. |
| F5 | High | Customization styles change native controls: Inventory/Combat and Stats/Bio/Equipment/Tools wrap, with lower entries clipped in their current bodies. Source applies font/spacing/palette to outer modules and uses `!important` color/background, while nested native surfaces retain their own colors. [Editor screenshot](reviews/ui-experience-2026-10-12/customization-1440-editing.png); candidate `styles/customization.css`, `src/customization_profiles.js`. | A component-level style contract and theme preview using tabs, tables, inputs, disabled controls and long labels. Arbitrary palette overrides need readable states and recoverable defaults. |
| F6 | High | Starting patrol succeeds in both candidates. Workspace shows current work plus the native duration/finish row; customization can leave those controls outside the current center-dock view after editorial navigation. Native wording says “Finish patrolling (earnings: nothing)” before the full round. [Workspace work](reviews/ui-experience-2026-10-12/workspace-1440-busy.png), [customization work](reviews/ui-experience-2026-10-12/customization-1440-busy.png). | Keep job, time basis, payout condition and stop consequence together. Restore relevant play context after leaving editing. Distinguish stopping early from successfully completing work. Unknown skill names remain knowledge-limited, not automatically a defect. |
| F7 | High | Structured actions project costs/time/blockers but render sequential prose/button pairs and rebuild their body. Older optional actions expose less decision detail and report “Saved.” Native, expansion and workspace controls still have different visual grammars. Source: `structured_pack_ui.js`, `content_pack_ui.js`, `action_legibility_ui.js`. | Shared action/result semantics with compact rows, inspectable detail and stable interaction. Reuse keyed action-legibility patterns where appropriate; preserve distinct content layouts. A storage receipt should not stand in for a gameplay result. |
| F8 | Medium | Current profile system supports typography, colors, spacing and native-season palettes. Settled effects have two actual consumers: Work Ledger and crafting. The broader theme/VFX ideaboard is substantially larger. | World identity needs materials, vocabulary, local motifs, diagrams and event rhythms as well as colors. Name supported effects in editing; distinguish a preview from a live consumer. |
| F9 | High before integration | Workspace and customization remain isolated, with shared source reserved to another owner. Old UI audit findings and newer candidate proofs describe different artifacts. | Preserve a capability/proof map and one combined laptop acceptance gate. Neither latest candidate nor largest test count is automatically the authoritative combined game. |

Native keyboard controls, refresh focus and readable text selection also remain
part of the existing [UI consistency audit](UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md).
This audit did not repeat its full keyboard test. Verify them on the eventual
combined build rather than assuming panel movement fixes native semantics.

## D1: Proposed composition and navigation

Use authored arrangements with direct movement as an override. Users should not
need to design their own workspace before the game is pleasant to play.

| Context | Independent panels shown together | Continuity |
|---|---|---|
| Ordinary play | Relevant vitals/preparation; place and immediate actions; current work; belongings; recent consequences | Place description remains available in a reading view. Long inventory/history scroll in their own region. Critical status is stable. |
| Crafting or comparison | Inputs/owned tools; selected recipe/item comparison; quote/work/result; relevant inventory | Costs and confirm/cancel stay adjacent. Selection survives refresh. Do not invent a second inventory or timer. |
| Conversation or required choice | Speaker/account; actual choices; known commitments/context | Retain a return path and recover required responses even if a panel was hidden. No automatic unearned world knowledge. |
| Authoring | Appearance; Effects/Sound; original Rules; a live representative preview | Show meaningful independent controls across the screen. Draft state and Apply/Discard stay in view. Returning restores play context. |

These are arrangements, not four separate apps or forced exclusive modes. A
player can keep useful panels pinned. Use layout changes at explicit navigation
boundaries, not surprising rearrangement on every tick. Never interrupt a drag,
text edit or comparison with automatic switching.

Default play should require no whole-page scroll between the ordinary next
action and its status at the declared laptop sizes. Full lore, large lists and
deep rules may scroll. Avoid a dock scroll containing several separate panel
scrolls for the same task; give its current task one clear scroll owner.
At larger text scales, allow readable reflow and navigation rather than clipping
to maintain a one-screen promise. This follows the intent of
[W3C's reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html);
it is not a WCAG conformance assessment or a mobile implementation requirement.

## D2: A coherent visual and thematic language

Use a stable base for text, numbers, controls, focus, warnings and selection.
Separate semantic states from world decoration: an accent for magic must not
also ambiguously mean danger, selected, rare and clickable. Keep readable numbers
and explicit units, especially at purchase, payout and cancel thresholds.

Theme the world/place first, the practiced build second and the current activity
third, with personal overrides. A borrowed tool can add a small motif without
repainting everything. Theme transitions should preserve orientation and safe
knowledge. Cosmetics can be freely selectable without implying access to powers.

| Original direction | Material and detail | Useful visualization when supported |
|---|---|---|
| Ordinary life | Cloth tabs, worn paper, wood edges, handwritten remarks | Custody labels, local errands, familiar faces |
| Scholarly magic | Ink annotations, fine gold rules, restrained seals | Prepared structure and known component relationships |
| Embodied practice | Stone, fiber and flowing linework | Known strain/recovery, rather than invented universal anatomy |
| Workshop technology | Pencil schematics, brass labels, tool marks | Materials, wear, throughput and actual bottlenecks |
| Advanced instruments | Crisp traces, sparse light, diagnostic headings | Sensor source/confidence and executable means |
| Hybrid craft | A common material base with two distinct notations | Where mechanisms couple and why they fail separately |

Do not decorate every paragraph or bar. Establish type hierarchy, border weight,
spacing, icon style and illustration scale before layering textures. Decorative
headings can differ; body text, thresholds and table digits remain stable.
Future place art should support the decisions beside it, not displace them.
No new image/art asset is required to qualify the first composition.

## D3: Whimsy that belongs to the world

Small details can be delightful without becoming quests or stat modifiers.
Use a few recurring motifs that react to known events, with enough variation
that idle repetition does not turn them into noise. These are original examples,
not accepted lore or claims of engine support.

| ID | Proposed detail | Meaning and dependency |
|---|---|---|
| W1 | A little receipt folds or gains a maker's mark after a successful craft | First candidate: use an actual settled output, preserving a plain result. Fits the existing crafting receipt consumer. |
| W2 | A notebook margin acquires a tiny doodle after meeting a known person | Personal memory/texture. Needs observer-qualified acquaintance and a durable cosmetic policy if retained. |
| W3 | A camp kettle wobbles once, rain gathers on a window edge, or a cloth tab stirs | Quiet local atmosphere only when the place/weather supports it. An illustration must not imply an unowned kettle or real consumable effect. |
| W4 | An item card gains a repair stitch, familiar nickname or maker's note | Connects affection to an actual item instance/history. Requires identity/history support; do not fabricate a repair event. |
| W5 | An NPC remembers a returned borrowed tool in one short line | Consequence through personality. Use actual memory/custody state; repeated praise should not spam each tick. |
| W6 | Mastery gradually turns tentative marks into confident notation | Communicates known growth. Distinguish comprehension, practiced skill and executable power; needs a defined visible milestone. |
| W7 | Rare power briefly bends its own panel border or displaces letters | Signature spectacle. Requires an actual witnessed effect and anchored overlay; controls and factual save messages remain usable. |
| W8 | A return summary highlights a few consequential changes before offering the full log | Comfort and continuity. Needs actual elapsed/offline outcomes; no fictional reward receipt. |

Choose W1 and one quiet place detail for the first comparison. W2/W4/W5/W6 need
their actual state adapters; W7 belongs with the deeper VFX lane; W8 needs an
offline-result audit. This ranks the full palette without commissioning it all.

## D4: Feedback, sound and attention

Give actions a readable progression: selected, quoted, running, waiting/paused,
settled, failed or stopped. Routine output gets a short local response;
meaningful mastery or discovery can receive a stronger beat; exceptional
world events can receive a set piece. Repeated small gains should not demand
the same attention as a required decision.

Keep flavor, heard accounts, objective execution status and save errors
distinguishable. In-world misinformation may be part of the fiction; saving
failure remains factual. Retain the current known-event projection boundary and
avoid leaking hidden routes through theme menus, silhouettes, asset choices,
panel pickers or decorative counts.

Use a small sound vocabulary for accepted action, settled result, warning and
rare event. Ambient place sound is optional and independent. Show a meaningful
preview with mute, intensity and reduced/static alternatives. Enabled device
audio remains a human check in the customization owner's report. Respect
reduced motion and allow nonessential interaction animation to be disabled,
following [W3C's animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
That does not qualify all proposed VFX or claim an accessibility pass.

## A1–A5: Recommended finite implementation order

1. **A1, combined laptop composition:** restore immediate local choices, remove
   fixed empty-body waste, and show relevant work/cancel/save status in ordinary
   play. Compare current opening and actual busy work at all three sizes.
2. **A2, independent editor surfaces:** separate Appearance, Effects/Sound and
   Rules views; keep actual controls, preview and Apply/Discard simultaneously
   useful. Returning to play restores its relevant position. Shared draft
   ownership and unsaved changes survive changing panels.
3. **A3, component theme contract:** qualify tabs, action rows, comparisons,
   inputs, warnings and disabled states under neutral, arcane and workshop
   presentations using identical known facts. Font/spacing changes cannot
   silently clip controls. Inspect keyboard focus, text scale and recovery.
4. **A4, one consequence plus one delight:** actual craft receipt plus a quiet
   state-qualified place detail. Include plain/static/off, interrupted effects,
   moved panels, repeated actions and meaningful result history.
5. **A5, integrated acceptance:** obtain the existing owners' integration
   release, reconcile surgical changes, rebuild the combined runtime and use a
   fresh origin. Exercise ordinary opening, actual craft/comparison, busy work,
   required response, theme/effect/rule Apply and generated save/reload/import.
   Director visual acceptance remains distinct from technical checks.

Do not reopen docking mechanics already qualified unless combined source or a
named reproduction changes their result. Do not launch a new UI framework,
general content editor or mobile wave to answer this audit.

## Resume point

Audit complete at the evidence scope above. Proposed priorities are not accepted
design and this report does not resume the paused implementation. Shared source,
existing UI docs/candidate and customization dispatch retain their current
owners. Only this report/evidence area was written. The next authorized owner
should reconcile F1–F9 with laptop steering and freeze the finite A1/A2 gate;
the original rules/content authoring scope remains separate and retained.
