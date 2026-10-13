# Request to the reviewing chat

Improve the implementation prompt below. Return one complete replacement prompt,
then a short account of material scope/tradeoff changes. Do not execute or dispatch
the task. Use the supplied context; you cannot inspect the local repository.
Keep the replacement within about 1.5 times the draft length. Cut repetition.
Use plain active language, no em dashes. Do not invent verified repository facts,
broaden permissions, expose secrets, or turn future ideas into a required rewrite.
Challenge dependencies, reconcile discovery with expressive VFX, and make the
acceptance evidence concrete. The human explicitly authorized this browser review
and subsequent local implementation. Reviewer advice remains a proposal.

# Draft work prompt

Implement a bounded playable slice connecting Proto23-inspired discovery-aware
UI to our existing text/VFX direction in YAIRPG. Preserve the full future vision
in documentation and leave a concrete reusable path for stronger world-specific
effects. Finish one connected slice before starting another. Do not stop at a
prompt, audit or preview when native implementation is possible.

## Human requests and authority

The user asked whether Proto23's full UI, colors, VFX and spacing could be used;
pointed out that selecting difficulty reveals more UI; requested deeper whole-
source consideration; and now asks to connect it with existing VFX ideas, create
a full-context prompt, improve it through a roundtrip, then implement.

Live owners: PROJECT.md summarizes accepted direction, docs/USER_VISION.md
preserves original requests, docs/PRESENTATION_AND_FOURTH_WALL.md owns the VFX
vision, and docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md owns UI guidance.
AGENTS.md requires inspecting dirty state, preserving other work, using one writer
per file area, and rebuilding before fresh-origin browser acceptance. Desktop/
laptop is primary; mobile optimization is deferred. Scope stays one realm/one
prestige layer for the first milestone. No commit, push, publication, personal
save changes, new agents/chats or new source acquisition is authorized here.
Existing paused authoring/world lanes do not resume merely because this UI task
is authorized. If another writer owns a needed shared path, isolate a candidate
or obtain an explicit release through an authorized route rather than overwrite.

## Proto23 evidence and lessons

Public source is 23html/23html.github.io index.html, revision
e93a8cd617932fb698ff889b968a32f9a20d48f3, SHA256
a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5.
A prior audit read all 14,768 lines. Follow-up browser play verified the staged
intro and difficulty-selected enemy/combat panel. Later gates are source-only:
first recipe reveals Assemble, first learned action reveals Actions, books reveal
Journal/Bestiary, and using a wallet reveals currency controls.

Exact-function probes corrected skill discovery: the skill appears on first
level-up (default 51 XP), not first XP. They also reproduced a 60-XP award
calling accumulation hooks with 69 total XP; a missing second tool permitting
the UI craft attempt and incrementing the craft counter despite no result; and
round-based RNG favoring middle options. Do not transplant those defects.

Inventory color defaults mostly mean item category; equipped gear also has
rarity glows. Combat colors mean damage type/result. A generic recolor conflates
these. Useful density comes from list/detail adjacency, compact rows, dedicated
comparison regions and a tall log. Adapt these within our flexible layout.
Proto23 also couples hover to Literacy XP and uses fixed coordinates/timers.
Presentation must remain read-only and animation must not settle gameplay.
Panel visibility, discovered knowledge, permanent unlock, current eligibility
and user hidden/collapsed layout preference are different facts.

Saved audit owners: docs/research/proto23/UI_SOURCE_ABSORPTION_2026-10-13.md and
SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md. Existing titles, furniture bonuses,
utility accessories, capped local search, optional hunger/weather and equipment
condition already have source owners; this task does not build replacements.
Direct source/assets reuse needs resolved license provenance. Independent
implementation of behavior is the current proposed route with attribution.

## Existing VFX direction, including the larger horizon

The user explicitly wants cool text-native signatures, ability effects,
transformations, spatial/temporal and conceptual powers, panel shattering and
fourth-wall moments. These are an open menu, not a fixed tier taxonomy. They must
make sense for the actual world, character, means, knowledge and settled event.
Truth and observation remain separate: a bluff or ambiguous witness account
cannot be presented as an authoritative proof of power. Sealed secrets cannot
leak through text, glyphs, themes, pickers, search, badges, reports or screenshots.

Accepted restraint: text/world first; quiet baseline; rare strong moments;
firsts are special; repetition grows quieter unless a real cause escalates it.
Illustrative reach: styled word → meaningful line → rare panel → exceptional
whole-screen/fourth-wall event. Preserve future time-stop/rewind, adaptation,
erasure, revelation, fracture, material signatures and absence/silence ideas.
Do not invent a native god/domain/time power to justify a demo, fake gameplay
effects, fake save deletion, host file access, or claim a preview is gameplay.
Effects-off must leave all facts and controls usable. Reduced motion uses a
readable static equivalent. Sound stays opt-in after gesture. Every overlay is
cancelable, bounded and unable to capture input or hide required terms.

## Current implementation entry points, recheck before editing

- src/skill_discovery.js projects known/hinted/available/blocked rows, filters
  before search/counts, and preserves accepted-work records. Unknown returns null.
- src/skill_discovery_native.js reads existing XP and visibility/unlock facts
  without initializing progress. src/models/skill.js owns native thresholds.
- src/main.js:add_xp_to_skill has a was_hidden→visible branch, skips some restore
  work using is_from_loading/restoringNativeSave, and calls nativeCraftMessage.
  src/display.js owns create_new_skill_bar/update_displayed_skill_bar and logs.
- src/workspace_layout.js modules have eligible() but core registrations often
  default true. Its module picker creates named disabled entries for ineligible
  modules. A panel-only gate therefore may still leak unknown systems. Preserve
  critical character/save/recovery/navigation controls and saved layouts.
- src/workspace_state.js owns per-browser layouts, independent from game saves.
  Workspace default, Classic and density settings already exist. Current Vivid
  is opt-in under Layout→Colors; Appearance palettes take precedence.
- src/settled_text_effects.js presents post-settlement receipts with SVG ink,
  guidance/seal/closing motifs, anchor pulse, bounded animations, deduplication,
  hidden-tab cancellation, reduced motion and opt-in audio. Current consumers
  include Work Ledger and native crafting.
- src/customization_profiles.js owns validated effects off/reduced/full,
  sound, inline/margin placement and effect definitions. Module effects overrides
  currently permit Ledger/crafting only; other modules permit palette/spacing/
  typography. src/customization_ui.js communicates this support scope.

## Recommended connected implementation, adjust from live evidence

Use one genuine existing discovery/learning transition as the first native
consumer outside generic receipts. Native skill visibility is a candidate:
undiscovered entries/categories remain absent, a real threshold crossing reveals
the useful view/row, and a restrained text/ink cue marks that first discovery.
Do not change XP thresholds/rewards to make the test convenient or gate all basic
character UI behind a tutorial. Include picker/count/search surfaces where they
actually expose the selected system. A discovered but unavailable method retains
its known record and truthful reason. No automatic focus theft or layout reset.

Reuse the current effect/settings owner. Distinguish event meaning from visual
motif; use actual known metadata and settled results, not regex-only truth
inference from prose. Limit the native integration to supported events with an
observable play route. Save the mapping of Proto23 reveals to the broader VFX
families, including strong powers whose native consumers remain future work.
Do not spend a rare fracture/whole-screen signature on ordinary skill XP.
If necessary, choose another already reachable learning event after inspecting
the authority/saving path; explain why without dropping discovery+VFX outcomes.

Persistence: derive known state from current authoritative progress; seed
presentation baselines on load/import so existing discoveries do not replay.
Avoid a new gameplay schema just to remember decorative effects. An import,
redraw, hover, unrelated repeated event, hidden tab or setting change must not
grant rewards or reproduce a first-event flourish. Define any in-session
deduplication/coalescing and cancellation behavior, including busy craft batches.

## Acceptance and deliverables

Save one executable reconciled prompt and reconciliation notes, a bounded
checkpoint/ownership record, implementation report and remaining acceptance
backlog. Connect design owners by reference rather than duplicate specifications.

Rebuild, then exercise native behavior from a disposable fresh origin at
1366×768, 1440×900 and 1920×1080 and larger text/150% zoom (label emulation).
Verify unknown→known transition via legitimate native input, usable controls,
visible costs/result, one restrained cue, stable layout/focus and no unknown
names through picker/search/counts. Exercise effects off, reduced/full and OS
reduced motion; absence of optional audio must not fail gameplay. Repeat and
redraw must not replay discovery or mutate gameplay. Check hidden-tab/cancel
cleanup and useful populated-state spacing.

Save, export, reload and literal-file import the disposable learned state;
verify XP/unlocks/items/currency and layout stay correct and first cues do not
replay. Test an older save baseline if the selected change touches compatibility.
Run meaningful focused tests for event gating/deduplication/truth and affected
settings/contracts, not a broad suite that merely mirrors the implementation.
Save screenshots and exact served bundle/source fingerprints. Report verified
source, test, rebuilt browser and human-taste states separately. Finish with the
play route and the one remaining authoritative acceptance gate, if any.
