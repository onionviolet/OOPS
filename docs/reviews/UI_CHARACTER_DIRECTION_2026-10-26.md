# UI character: reference comparison and proposed review brief

2026-10-26. Design exploration, not implementation or an accepted visual identity.
Weibao asked what should define O1, whether to send a fresh audit chat, how
Proto23/other games do this, and whether O5 is hard. He likes O2/O3/O4/O5.
Initial review status, preserved as history: no chat was dispatched and no runtime or save changes were made.
Current dispatch: chat `01a17935-ee3f-76a3-a5ef-3a910749239a` completed the bounded audit below; its prototype fidelity limitation is recorded in UIC13.

Applies: AD6–AD8, AD32, AD34, AD36; UR37–UR38, UR49, UR59–UR64,
UR65–UR69; WPR19–WPR23. Existing owner:
[thematic UI palette](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md).
Desktop 1920×1080 primary, 1536×864 secondary, actual 14/21px text.
Mobile optimization remains deferred.

## Evidence and interpretation

- **F1, shown in saved captures:** Proto23 repeats compact Gothic text,
  hard rectangular frames, saturated navy/teal task fields, a purple log,
  and bright short feedback. Its identity comes substantially from these
  repeated choices rather than elaborate ornament. Reviewed
  `proto23_desktop_2026-10-21/baseline/proto23-actions-1920-14.png`
  against `oops-idle-1920-14.png` in the same directory. The receipt records
  a developer-seeded reference lab, supplied MS Gothic and removed lab scale.
  This is October 21 capture evidence, not a fresh live Proto23 session or
  proof of motion. OOPS visibly shares much of that vocabulary in this capture.
- **F2, developer-documented:** Fallen London's June 2018 redesign distinguishes
  Status qualities with rounded edges and Thing qualities with sharp corners.
  This is a concrete example of visual form carrying meaning.
  [Official source](https://www.failbettergames.com/news/fallen-london-website-redesign-now-live).
  Historical documentation, not verification of every current screen.
- **F3, official premise; design inference:** BOOK OF HOURS unites acquiring,
  restoring and cataloguing books with restoring a library and writing histories.
  A useful lesson is a coherent activity fantasy connecting many tasks.
  This review does not claim to have exercised its interface or audited usability.
  [Official source](https://weatherfactory.biz/book-of-hours/).
- **F4, current source:** `src/household_scene.js:23` already selects a small
  Moss face from known mood and displays known posture. O5 has an existing
  presentation example; it need not begin with a new simulation system.
  Source inspection only in this pass, not a new runtime check.

## Proposed defining vocabulary

| Code | Proposal | Reason and dial |
|---|---|---|
| C1 | Compact Gothic rhythm, aligned numbers and deliberate heading spacing | Builds on the selected font and existing game feel; density must survive larger text |
| C2 | Deep luminous fields with stable role colors | Preserves orientation across worlds; test accent intensity rather than making every surface emerald |
| C3 | One repeated frame/glyph family | Explore clipped corners, narrow dividers and a portal-derived selection mark; portal branding need not decorate every object |
| C4 | Surfaces take their character from their task | Inventory as a kit ledger, Reports as a chronicle, crafting as a work surface; common interactions remain recognizable |
| C5 | Brief caused responses and bounded local atmosphere | Visible press/selection/completion, local weather/material cues and occasional human touches support the world |

The earlier phrase "luminous traveler's journal" is one candidate, not the
answer the audit should be asked to confirm. Suggested starting hypothesis:
**a vivid compact interface into many lived worlds**. Compare how much journal,
instrument and local material treatment each task can support.

## O5 effort, proposed scope

| Level | Example | Work and acceptance |
|---|---|---|
| Small | Known mood expression; a contextual line at an existing successful result | Reuse current facts/events; inspect without side effects; avoid repetitive output |
| Medium | Repair mark on a specific tool; practice-dependent action flourish | Confirm per-item identity or real competence exists; route through those owners; keep meaning at reduced motion |
| Larger | A place remembers changes since the last visit; an animated reactive creature | Baseline/history or assets and event lifecycle may be needed; assess current support before selecting |

Start with a few small touches in places already modeled. Stateful cues must
not replay on load/reopen, invent history, reveal sealed knowledge or consume
gameplay RNG. Humor and frequency are world-specific dials.

## Recommended separate-chat brief, ready for explicit dispatch

Conduct a fresh UI character audit of OOPS. Read the existing UI owners and
inspect the actual populated desktop interface before proposing a visual
identity. Treat this report's C1–C5 and the traveler's-journal metaphor as
hypotheses. Preserve the selected Gothic default, desktop priority, semantic
colors and existing navigation unless evidence supports a specific proposal.

Compare Proto23's saved source/captures and two or three contrasting primary
references. Separate static appearance, interaction and source evidence. Explain
which repeated choices create character, what OOPS already has, and which
differences matter for its many worlds. Avoid a generic spacing-only audit.

Deliver a short defining vocabulary and two disposable treatments of the same
populated screen. Include O2 surface character, O3 local atmosphere, O4 caused
feedback and one small O5 touch using existing state. Show the treatments at
1920×1080 and check laptop/larger-text fit. Rank actual implementation costs.
Reuse the shared mockup workflow; coordinate live UI ownership first. Keep
production edits, app adoption, commits, pushes and new simulation outside this
audit. Save evidence and the proposed next slice in the existing owners.

Checks this pass: compared two saved desktop captures, inspected the capture
receipt and current household source, and opened the cited official pages.
No build/tests required for this design-only report. No new gameplay/UI proof.

## Source follow-through and implementation map, 2026-10-26

Weibao: "we can analyze source code accordingly too, how can we implement?"
This is source analysis and a proposed implementation sequence. Existing dirty
runtime work belongs to its current writers; this pass changes documentation.

### What is already in the checkout

| Code | Source and mechanism | Implication |
|---|---|---|
| S1 | `styles/ui_tokens.css:1704` defines shared feedback/motion tokens, hover, active, focus and selected states; `src/component_themes.js` and `src/customization_profiles.js` resolve palettes and module overrides | Much of O1/O4 already has a common implementation route. Compare rendered consistency before adding more selectors |
| S2 | `src/panel_kit.js:7` assigns `data-panel-role` and decorative role icons; `styles/component_themes.css` styles customized components | O2 can extend existing panel-role selectors and original surface homes. Check native panels outside panel-kit coverage separately; do not replace navigation |
| S3 | `src/quiet_place_detail.js:4` projects bounded Village atmosphere; `src/main.js:9755` creates it and the workspace `sceneCue` port forwards receipts to it | O3 has a mounted local atmosphere route. Broader-world presentation needs public place facts and appropriate local wording rather than applying Village prose everywhere |
| S4 | `src/palette_feedback_domain.js:110` observes rain/snow, lamp, tool condition, body recovery and skill changes; `src/palette_feedback.js` produces their display receipts | O3/O5 have source-connected cues, not just disconnected proposal rows. Actual screen visibility, frequency and subject fit still need fresh browser evidence |
| S5 | `src/settled_text_effects.js:4` deduplicates receipts; the presenter anchors SVG motifs/text and optional sound with effects settings | O4 should adapt this owner for result feedback. Its current sound is a short generated tone, not a library of tactile sound assets |
| S6 | `src/household_scene.js:23` renders mood-dependent Moss faces; `src/craft_cues.js:19` chooses craft text from skill level and positive preview/result quantity | O5 can extend bounded existing presentation. A preview is not a settled craft event; animate only the actual successful result route |

Proto23's saved `private/proto23.html` source was also inspected read-only:
line 14 groups hover fills across action/menu/inventory/craft classes; lines
52, 66, 72, 78 and 88 establish repeated header, meter, task and log gradients;
line 77 gives the inspector its own framed/shadowed treatment. This supports
the static visual comparison. It does not establish modern responsive behavior
or event-safe animation. Adapt the repeated grammar through OOPS tokens and
components rather than copying fixed coordinates or scattered inline styles.

Correction to the initial effort estimate: session return baselines and
competence expressions already exist. Return summaries use observed inventory,
tool, skill and body snapshots, cleared on load. They do not demonstrate a
durable history of everything happening at a place while absent. Costs must
be assessed against those exact existing semantics.

### Proposed implementation sequence

1. **I1, baseline:** reproduce one populated ordinary screen, one work result
   and one known household route on a rebuilt fresh origin. Identify whether
   each existing cue is visible, suppressed, disconnected or merely too subtle.
2. **I2, signature and surfaces:** compare two disposable visual treatments
   using existing typography, theme, role and control tokens. Give Inventory,
   Reports and work areas related but distinct treatment. Keep role colors,
   known names and command positions stable.
3. **I3, atmosphere and feedback:** apply the selected treatment through those
   same owners; extend local atmosphere from public world/place projections.
   Tune existing pressed/selected/completion states together. Default to a
   short response at a real transition; motion/intensity remain dials.
4. **I4, one small O5 route:** improve one already-supported scene or result,
   such as a known household expression or successful practiced craft. A
   pure display selector consumes known state/receipt, then existing scene or
   effect code renders it. No additional gameplay state or global event bus
   is needed for that slice.
5. **I5, proof:** run relevant focused tests, then required completion gates
   at AD36's stages. Exercise actual producer-to-screen routes at 1920×1080
   and laptop/large text. Check effects off/reduced, repeated events, subject
   replacement, load/revisit and focus/scroll. Persistence changes require
   save/reload/export/import; a cosmetic-only slice should use current state.

Implementation brief addition: require a producer → public projection/receipt
→ presenter → styled surface trace for each selected touch. Record an existing
consumer and a concrete failure case. Avoid adding another settings framework,
animation bus, simulation clock or per-world shell to supply cosmetic variation.

### Verification in this pass

- `node --test tests/palette_feedback.test.js tests/craft_cues.test.js tests/household_scene.test.js tests/product_appearance.test.js`: **26/26 pass**. Existing behavior only; no new UI proof or installation claim.
- Source baseline: dirty primary checkout at HEAD `712eaf7d7`; relevant SHA-256 prefixes: palette feedback `b7a55dacc595`, domain `523eda73336c`, settled effects `4b7528f01de4`, quiet place `acc92a20c557`, household scene `e49b300ca65f`, craft cues `5f802f9a7937`, UI tokens `185ce6cb122e`, customization profiles `c6cd7e65355a`.
- No runtime edits, new build, current browser route, commit, chat dispatch or app adoption in this source pass. First implementation gate is I1's fresh rendered baseline; source/tests cannot substitute for it.

## Fresh audit and runnable comparison, 2026-10-26

**Audit complete; proposed direction, no production implementation.** Separate chat
`01a17935-ee3f-76a3-a5ef-3a910749239a` was explicitly dispatched from
`01a178d7-139d-7453-ba7f-121cfd29a34c`. This supersedes the earlier **dispatch
status**, while retaining the original review's dated no-dispatch evidence.
One coordinator, no workers. Scope: source/visual audit, reference comparison,
disposable prototype, implementation proposal. No production runtime edits,
commit, push, normal-app adoption or save migration. Shared dirty work retained.
Relevant released broader-UI ownership was checked in its
[receipt](../gm/dispatch/broader-ui-follow-through-2026-10-26/CHECKPOINT.md).
This pass owns the character workbench study and these appended documentation
hunks; it does not take custody of that lane's source.

Applied AD6–8/32/34/36/40–42; UR37–38/49/59–69; MW1–7;
AR3/8/10/13/16 for the proposed source seams; WPR4/19–23/27/32 as evidence
lenses. Accepted direction remains Gothic, Proto23 composition lineage,
many worlds, desktop/laptop first. Primary 1920×1080; laptop 1536×864;
actual 14/21px, with 1800×1040 additionally captured. Mobile deferred.
No new product authority or human approval gate is created.

### UIC1: recommendation for O1

**Gothic windows onto lived worlds.** The recognizable signature is the frame,
the role colors, and the way a real action leaves a small visible trace.
The local world supplies the material character inside that frame. This is a
proposal, not acceptance of a journal, instrument-panel or portal-wide skin.

| Choice | Proposed default, dial and reason |
|---|---|
| Typography rhythm | Keep selected MS Gothic and aligned figures; plain weight, quiet labels, one clear subject heading and short receipt text. Use existing whole-pixel type/spacing roles in production. Larger text spends vertical space rather than shortening known names |
| Color roles | Retain recognizable teal place/header bands, blue task fields, violet Reports and existing semantic vitals/warnings. Concentrate vivid color in narrow structural bands and caused highlights; quieter reading fields reduce competition. Intensity remains a player/world dial |
| Frames and marks | Rectangular one-pixel frame family; small paired corner strokes for an active window, a consistent local selection edge and a legible focus ring. Use portal geometry sparingly at a navigation/selection boundary, not as the icon for every item or effect |
| Surface character | Inventory reads as aligned kit rows; work as input → action → measured result; Reports as time/subject/result records; homes as a small scene. Shared command and return behavior stays recognizable across these homes |
| Cadence and atmosphere | Immediate static press/selection, short result response, then settle. One locally justified scene cue at a time. Preserve text and existing off/reduced controls; detail should reward looking without requiring a moving background |

The **Signal** treatment is the source-based candidate for a global starting direction because it
retains the current Proto23 color geography and gives local scenes room to vary.
Use **Folio** warmth inside a workshop, home, library or physical record when the
world/task supports it. Its entire-shell version is the comparison extreme,
not a recommendation to make every world parchment-colored. Actual integration
should keep player palette overrides and semantic colors through their owners.

### UIC2: what the actual interface showed

Freshly rebuilt frozen tree at primary HEAD `712eaf7d7247bdc1369fa02f35b1a4df3335c994`
plus the then-current dirty source; native bundle SHA-256
`c452c60fc0026aa8a8e2ee46b3a2a67901c90126146934c24f945ad5b335ac6c`.
The build was made with `prepareTree('WORKTREE', tempRoot)` and `build(tempRoot)`
from `scripts/perf/lib.mjs`, so primary `index.html` and `dist/` were not build
outputs. The temp tree initially omitted ignored Gothic assets; the first capture
command failed before its comparison and was corrected by copying the existing
private font files into that disposable tree. No font acquisition or distribution.

[Native comparison receipt](../../prototypes/workbench/evidence/character-2026-10-26/native/receipt.json)
and [full-size task comparison](../../prototypes/workbench/evidence/character-2026-10-26/native/comparison.html).
Fixture: `tests/fixtures/perf/mid.json`, invalid undefined recipe keys removed,
crafting unlocked, Cooking admitted, 4 rat meat and its known item record added;
default customization with requested text size. These are fixture prerequisites,
not evidence of natural acquisition. Every matrix case uses a new browser context.
Ordinary commands then equip held pants, select/craft a known recipe, travel to
Infested field, and advance three native minutes. Separate fresh-life homeowner
choice and native meet action reach Moss. Personal profiles/saves were unused.

| Evidence | Shown finding and practical consequence |
|---|---|
| Ordinary Village, six viewport/text cases | The current interface already has strong teal/blue/violet geography and Gothic identity. Large colored empty fields occupy more visual area than local detail. Keep the geography, give reading fields a quieter backing and local subjects a clearer small accent |
| Inventory inspection/equipment | Held-item selection and native Equip are reachable; task state is not evidence that the shell needs replacing. Preserve the existing inspection/controller work; style its subject and selection through current owners |
| Crafting at 21px | Real costs, attempts, effect chips, outcome and return exist. Long information can dominate the work surface. Prioritize the same facts with task-specific framing; do not delete dependencies to obtain a pretty mockup |
| Reports after craft/combat | Reports is a distinct permanent region. It already provides continuity; a new floating toast feed would duplicate it. Use short local response plus existing retained result, with repeated-event grammar deferred to its existing audit owner |
| Known cottage/Moss | The scene is mounted and visible after opening its containing details. Current expressions, posture and history are real, but share the surrounding dense blue box grammar. A warmer bounded scene gives this existing character more emphasis without a new pet simulation |
| Native press/result, four fresh cases | Hover and active styles execute; one press increments attempts by one. Full effects execute three animations; reduced and OS-reduced execute one simpler overlay animation; off shows zero overlay animations while the native Made/Failed receipt remains |

[Interaction receipt](../../prototypes/workbench/evidence/character-2026-10-26/native-interactions.json)
records actual animation keyframe properties, pressed state and text, not a claim
from screenshots. No page exceptions. Four resource 404s were traced to omitted
optional `private_packs/manifest.json` in the isolated copy, one per fresh case;
the report does not call this a zero-console-error run. Loaded private packs and
unexamined world-specific services are outside the route. This is browser proof,
not installed-app behavior. Weather/lamp/tool/recovery event transitions were
source-traced below but not all induced in the native browser.

### UIC3: reference comparison, with mechanisms and costs

| Reference and evidence status | What creates character | What fits; cost/shortcoming |
|---|---|---|
| **Proto23**, actual retained HTML source and rerun original lab at 14/21px, three viewports | `private/proto23.html:14` shares hover gradients across many control types; `:52` repeats teal header fields; `:66–72` gives meters different gradients; `:77` makes inspection strongly framed; `:78/:88` separates task and log fields. The lab supplies MS Gothic and removes lab scaling; source fixed coordinates remain | Adapt its repeated grammar through tokens and native homes. It already explains much of OOPS's family resemblance. At 1920px the retained source leaves unused right/bottom canvas; fixed coordinates and strong gradients are poor candidates for copying. This is the saved edition, not proof of modern upstream behavior. Original source hash is recorded in the receipt and unchanged |
| **Fallen London**, developer-documented 2018 redesign, no fresh gameplay claim | Status qualities and Thing qualities use different edge shapes; named tabs, category navigation and search aid a large collection. [Official account](https://www.failbettergames.com/news/fallen-london-website-redesign-now-live) | Adapt form carrying meaning: task/inspection/report treatment should signal what the surface does. Do not assign a unique decorative frame to every system. Small shape distinctions need labels and consistent application; its published responsive breakpoints do not become OOPS targets |
| **A Dark Room**, current public source read at the links on 2026-10-26, no playtest claim | [CSS](https://github.com/doublespeakgames/adarkroom/blob/master/css/main.css#L202-L267) gives a spare feed, simple outlined actions and a cooldown fill. [Notifications](https://github.com/doublespeakgames/adarkroom/blob/master/script/notifications.js#L27-L74) queue by active module, prepend a message with 500ms opacity, and remove hidden entries. [Room](https://github.com/doublespeakgames/adarkroom/blob/master/script/room.js) couples contextual prose and actions to room/fire/building state | Adapt concise, caused local prose and restrained animation. OOPS has existing state/receipt owners for this. Do not copy notification-triggered saving, queued replay on return, wall-clock room timers or hidden-entry deletion over OOPS history. Minimalism saves artwork but shifts cost toward carefully authored state-linked language |

No third-party code or art was copied. The shared workbench uses OOPS presenters;
existing attribution/LICENSE remain intact. BOOK OF HOURS remains a broad
activity-fantasy reference from the earlier report, not additional source/UI proof.
No game purchase, installation, bulk source acquisition or private-account fetch.

### UIC4–UIC8: implementation trace and additional considerations

| Code / proposal | Producer → public state or settled receipt → presenter → actual consumer | New angle, lifetime and cost |
|---|---|---|
| **UIC4 / O2 surface grammar** | Existing workspace module ID/role and customization settings → `panel_kit.js` `data-panel-role`, `customization_profiles.js` module tokens → `ui_tokens.css`, `component_themes.css`, native inventory/crafting/Reports styles → their existing DOM homes | Role is not the same as surface: `optional` panels include many unrelated tasks, and legacy shell panels are not all panel-kit consumers. Start with explicit module IDs for four surfaces, then use role as a fallback. No per-world shell or new persisted theme schema. Relative effort: small/medium CSS integration |
| **UIC5 / O3 bounded scene** | Known native location/calendar/weather, `worldWeatherWords`, lamp projection → `palette_feedback_domain.js:localFacts/render` / `quietPlaceText` → `sceneCue` port, `quiet_place_detail.js` → mounted `#quiet_place_detail` via `main.js` | The current prose selector is Village-specific; it does not supply every world's atmosphere. Default is a narrow local color/line-art zone; dial detail by observed conditions and actual sensing. Static village house strokes in the prototype are illustrative, not a physical map. World-specific asset/prose sets cost more than CSS; do not infer indoor warmth from a fuel meter |
| **UIC6 / O4 caused response** | Native craft inventory/XP result → `observeWorkLedgerCraft` in `work_ledger_system.js`, durable publication in `main.js:publishWorkLedger` → `createSettledTextEffects` → actual recipe anchor inside `#crafting_window`; measured detail receipt separately flows `display.js:commit_selected_item_recipe` → `craftReceiptText` → `[data-craft-receipt]` | Two existing presentations must not become two competing outcomes. Let receipt text persist; keep decorative emphasis brief and local. Existing SVG paths/tone need no sprite assets. Check duration and re-anchoring with scrolling; any new event type must cancel on subject replacement and avoid load/revisit replay. Relative effort: small tuning, medium if owners must expose a missing public receipt |
| **UIC7 / O5 cheapest route** | Household `transitionHousehold` and elapsed-state owner → `householdAnimalView` / `projectHouseholdScene` → `householdPresentation` → `home_panel.js` and tranche-one UI consume `createHouseholdScene` | Improve the small existing Moss area using its known mood/posture and home identity. Keep it still by default; a face/posture change is state presentation, not proof of a new event. No new durable field, RNG, simulation, assets or animation required. Relative effort: small; verify curious/content/sheltering, absent/not-home and inspect-without-mutation |
| **UIC8 / O5 competence route** | Selected recipe + captured pre-craft skill + measured output → `display.js` result / `craftReceiptText` → `craftCue` → result receipt; preview separately reaches Result details | Woodworking/Forging already have three expertise bands. Cooking has no such authored cue today. A preview can describe attention but is not a completed occurrence. Add a handful of supported variants only if useful; do not invent tool scars without per-item evidence. Relative effort: small authored display work; animation tied to each item is medium/larger |

**ACCOUNT FOR NOW:** subject identity and repetition matter more than a clever
line. Receipt keys already include actor/subject/event or sequence and use bounded
seen sets; hidden events are consumed without replay. Domain session ledgers
clear on load; a place transition clears its local cue. Current return snapshots
compare carried stock, tools, known skills and body readings, not offscreen place
history. They cannot justify “Moss missed you” or “the shop changed while away.”
These require a real producer/knowledge route if later requested.

Useful expansion: let a small number of structural features stay stable across
worlds while local material vocabulary changes. Inventory remains rows, work
remains a committed task, Reports remains evidence, but their local accents can
suggest a workshop, institution, ruin or household. Avoid giving each world an
unbounded collection of bespoke widgets. Keep failure, partial success and
interrupted work as legible and personally specific as success; extra celebration
must not hide the price or a failed attempt. Budget recurring cues by semantic
change rather than randomly rotating prose on every redraw. Existing long-session
report grouping is a separate proposal, not a prerequisite for this audit.

### UIC9: two runnable treatments and their limits

Open the shared workbench with `?study=character`:

```sh
node prototypes/workbench/build.mjs
node prototypes/workbench/serve.mjs
```

Choose **OOPS visual character · proposed** if the query is omitted. The controls
compare Signal/Folio against the same state; compare mode mirrors the resulting
state without replaying craft. Scenarios include ready, rain, missing stock and
crowded Reports. Actual-size view and real 14/21px text are separate from Fit.
Build/source hashes live in
[study inputs](../../prototypes/workbench/built/character/INPUTS.json);
[prototype check receipt](../../prototypes/workbench/evidence/character-2026-10-26/prototype-checks.json).

The study reuses the current native **craft detail, household, atmosphere selector
and effect presenters**, current tokens and familiar five-region arrangement.
It uses a reduced original shell/navigation fixture, **not** the native shell
controller or exact current adaptive row geometry. Native shell mounting imports
`display.js` and runtime owners; this finite study did not create another native
host adapter. Consequently it answers material/feedback comparison, not full-shell
navigation or production fit. It does not reconstruct gameplay from a screenshot
or mount the production startup/save path. The ordinary native screen is separately
captured above. UI integration must still prove the chosen treatment on that shell.

Both treatments were exercised at 1920×1080 and 1536×864, 14/21px, including
inspection, pressed state, scripted success, Reports and household state.
At laptop/21px the craft action is below the initial inner scroll position and
remains reachable by scrolling; it is not an all-content-above-fold result.
The fixture has fewer recipe rows/dependencies than the native 21px screen.
The small surrounding review metadata includes reduced text; no claim that every
prototype label already meets production strike/token rules. Mobile unexamined.
Synthetic mood buttons set fixture state, not native pet actions. Native household
and persistence proof comes from the separate native route.

Screenshots:
[Signal](../../prototypes/workbench/evidence/character-2026-10-26/signal-1920-14.png),
[Folio](../../prototypes/workbench/evidence/character-2026-10-26/folio-1920-14.png),
[laptop large text](../../prototypes/workbench/evidence/character-2026-10-26/signal-1536-21.png),
[bounded home](../../prototypes/workbench/evidence/character-2026-10-26/folio-1920-14-home.png).
Recommendation is agent-inspected, not human-reviewed or selected.

### UIC10–UIC12: ranked proposed implementation slices

| Rank/code | Capability / effort | Proposed bounded slice and source map | Observable done check |
|---|---|---|---|
| 1 / **UIC10** | UI implementation with substantive judgment; medium | Keep Gothic/semantic colors; map Signal frame and four surface treatments into existing `ui_tokens.css`, native inventory/crafting/Reports owners and module customization. Reuse module IDs; do not add a second theme/settings framework. First screen: populated Village inventory → craft → result → return |
| | | | Fresh rebuilt native 1920×1080 and 1536×864 at 14/21px; same selected subject, work/log access, keyboard return and player overrides; actual costs/refusals unchanged. Existing relevant focused tests plus AD36 completion gates when implementing runtime |
| 2 / **UIC11** | Bounded CSS/presenter work; small | Warm the existing known household scene through `home_panel.js`/`household_scene.js` and its stylesheet home. Make mood/posture legible; do not replace its state owner. This is the easiest useful O5 slice |
| | | | Native homeowner/meet route, known curious/content/sheltering and absent contexts; inspect/history does not mutate state, no replay on reopening/loading, plain/reduced forms. Save/reload/import only if persistence is actually changed |
| 3 / **UIC12** | UI/domain synthesis; medium | Tune one craft-result cadence through `crafting_detail.js`, `display.js` measured receipt and existing `settled_text_effects.js` publication. Extend one local atmosphere selector only where a known-world fact is available. No global weather reskin |
| | | | Preview spends nothing; one native success/failure gives the correct receipt once; full/reduced/off and hidden/load/subject-replacement cases preserve meaning and commands. For new public projections add their focused regression |

These are **LATER / DELEGATE proposals**, not a dispatch or build authorization.
One playable slice at a time. Larger options parked: creature sprite animation
(needs style/assets and settled event lifetimes), durable offscreen place memories
(needs history/knowledge semantics), and per-item wear marks (needs exact identity
and real condition/history). None is required to make O5 useful.

### ACT NOW completed and verification record

- Frozen native build: `prepareTree('WORKTREE', tempRoot)` then `build(tempRoot)`, pass on hash above; local private font dependency supplied after first missing-file failure. Primary runtime outputs were not targets.
- `COMPARE_FULL=1 node scripts/playtest/proto23-desktop-comparison.mjs <frozen-root> <character-evidence>/native`: pass, six cases per game, native inventory/craft/combat/Reports plus homeowner/Moss and disposable Save/reload. This is fixture-seeded browser evidence, not whole-game acquisition or import proof.
- `node prototypes/workbench/evidence/character-2026-10-26/check-native.mjs`: four effects cases pass, one native attempt per press, no page exceptions; optional private-pack manifest 404s recorded above. Sound not listened to; full weather/tool/recovery transition coverage and installed app remain unexamined.
- `node prototypes/workbench/build.mjs`, `node prototypes/workbench/check-character.mjs <fresh-workbench-origin>`: pass, two treatments × two viewports × two text sizes, synchronized result state, full/reduced/off presenter checks and storage-free reset; `node prototypes/workbench/check.cjs <origin>`: 10 shared workbench groups pass. Incidental changes to initially clean archived launch outputs/general check captures were restored from their pre-task HEAD versions; scoped character evidence retained.
- `node --test tests/palette_feedback.test.js tests/craft_cues.test.js tests/household_scene.test.js tests/product_appearance.test.js`: 26/26 pass on inspected source. Existing behavior only. No full runtime suite, architecture gate, install, commit or production completion is claimed for this audit/prototype change.

Remaining production acceptance is the rebuilt native-shell journey for a later
authorized implementation. Human review is optional feedback under AD42.

### UIC13: director feedback on prototype fidelity, 2026-10-26

Weibao, viewing the character study: “feels liek yhe ui being worked on doesnt
look as fleshed out as the proto 23 one, is the mockup bench oudated?”

**Correction:** the new study is too sparse to support an overall visual-direction
decision. Its imported presenters are current, but its reduced navigation, six
stock rows, one recipe, two people, synthetic scene and fixed five-region frame
omit much of the real interface's density and character. The older recipe study
is a pinned prior prototype; neither study is the current installed application.
The current native screen captures above are the appropriate evidence for actual
OOPS composition. This is a defect in the experiment's representativeness, not
evidence that the current game lost those features.

Signal/Folio remain rough color/material studies. The recommendation is a
**source-based hypothesis**, not a visually validated default or director selection.
A faithful populated comparison using the current shell, current navigation,
several real services and recipe dependencies should precede selecting a global
treatment. Reuse existing native shell ownership rather than polishing this
small fixture into a parallel application. This is the missing experiment proof;
production implementation remains unauthorized. Audit/source findings and the
cheapest O5 mapping remain useful independently.

### UIC14: freshness correction and fresh-chat dispatch, 2026-10-26

Weibao requested updating the workbench to avoid future drift and repeating the
supplied audit in a new chat. Dispatched **OOPS UI audit with faithful current-shell
prototypes**, chat `01a17948-448e-77a2-b895-11128bed5435`, local primary checkout.
[Exact rerun brief](UI_CHARACTER_RERUN_2026-10-26.md) preserves A1–A5 and adds the
UIC13 correction: use the actual populated shell/navigation, baseline and real
content density; a sparse material sketch is insufficient for visual selection.
This chat releases the freshness/banner/registry/build-adapter paths to the rerun
owner after this note. No further parent writes to those paths are planned.

Completed here: MW8 in the mockup workflow/register, corresponding USER_VISION
and PROJECT summary, explicit archived/sketch/native labels, source/output hash
manifests and a visible live freshness banner. The server compares recorded
inputs on study change/focus and every 15 seconds while open. Current sketch
remains visibly a sketch even when hashes match. Missing evidence is unverified;
source/build drift says rebuild and recheck. This detects declared dependencies,
not an undeclared dependency or visual fidelity by itself. No scheduler created.

Checks: `node --test prototypes/workbench/freshness.test.mjs` 2/2 pass, including
source/output drift and missing/archived inputs. `check-freshness.cjs` visibly
checks matching sketch, archived and stale warning states. Shared workbench
`check.cjs` 10 groups pass with scoped `WORKBENCH_EVIDENCE`. Rules-index check
passes with two inherited untracked-link warnings. Combined `npm run check:rules`
fails in the receipts subcheck for unrelated `other-systems-depth-2026-10-26/`
exploration and learning CHECKPOINT files missing fenced receipt blocks; untouched.
Syntax and scoped whitespace checks pass. Full production runtime suite/install
not applicable to this workbench-only correction; no commit/push/adoption.

## UIC15–UIC22: faithful current-shell rerun, 2026-10-26

This round is owned by rerun chat `01a17948-448e-77a2-b895-11128bed5435`.
UIC14's dispatch is now executed here. The earlier “audit complete” statement
remains dated history for its reduced-shell experiment. UIC13's correction
continues to govern: source currency and visual fidelity are independent.
No visual treatment is director-accepted. No production source, app profile,
commit, push, publication or successor/worker chat is authorized or changed here.

Applied AD6–8/32/34/36/42, UR37–38/49/59–69, MW1–8, AR3/8/10/13,
WPR4/19–24/27. Desktop 1920×1080, laptop 1536×864, actual 14/21px;
mobile deferred. Reference-scout, more-to-consider and prototype-to-decision
were used within this one coordinator. This is a finite design/prototype pass.

### UIC15: what the replacement actually contains (ACT NOW)

[Runnable workbench](../../prototypes/workbench/index.html?study=native-character)
now defaults to **Current populated OOPS · native shell**. Start with
`node prototypes/workbench/serve.mjs`; use its fresh loopback address.
[Matched gallery](../../prototypes/workbench/evidence/native-character-2026-10-26/gallery.html)
shows baseline, Signal and Folio alongside, across place/services, item inspection,
recipe/dependencies, settled result/Reports and the known household scene.

The study executes the current native bundle, original DOM, navigation,
center controllers, inventory, equipment, recipe list, dependencies, costs,
RNG, XP, receipts and household actions. The changes are mockup-owned CSS and a
bounded bootstrap/message bridge. `BUILD_OUT` isolates generated native output;
linked assets are then copied into the study, so the served bundle/styles/assets
are frozen together. Upstream LICENSE remains in that output. Optional private
packs are omitted; private local fonts are excluded from version control.

**Fixture:** `populated-village-cook-2026-10-26`, a serialized current native
fresh-life envelope with the first 30 named public stock entries from
`tests/fixtures/perf/crowded.json`, Cooking unlocked and 12 rat meat chunks.
This replaces the legacy mid envelope, which rendered a “Restore saving” warning
in the initial rerun. Items are native identities and renderers, not hand-made rows.
The stock and availability prerequisites are injected, not naturally earned.
The machine fixture ID `mid-cook-2026-10-26` is retained for export continuity.
The separate Home scenario starts an unseeded native fresh life and uses
`start:homeowner` then `meet:cottage`. No personal gameplay origin/profile is opened.

Switch **Layout** on one running instance to preserve its stock, selected
subject, native navigation, transient Reports and scroll. CSS switching does not
reissue gameplay commands. Simultaneous native command mirroring is not implemented
and its checkbox is disabled for this study; the matched gallery provides the
alongside view. Archived studies retain their existing comparison behavior.
This limit is explicit, rather than representing independently running panes as
synchronized. Reset deliberately reseeds. Step uses the native tick hook.

### UIC16: reference comparison reopened from sources (ACT NOW)

| Reference and evidence | Mechanism actually supported | Fit, cost and shortcoming |
|---|---|---|
| Proto23 saved `private/proto23.html`, source SHA-256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`; original source lines 5/14/17/28 and 52–88; [existing capture provenance](proto23_desktop_2026-10-21/baseline/receipt.json) and `scripts/playtest/proto23-desktop-comparison.mjs` inspected | Gothic text, repeated hard frames, differentiated teal context/blue action/violet log fields, shared hover treatment and compact item rows. Source hash still matches the earlier native-reference receipt. The saved 1920/14 action image was visually reopened this round | Retain visual geography and concise cadence through existing OOPS tokens. Do not copy its absolute coordinates, cropped/fixed composition or reduced focus accessibility. Its extra specificity comes partly from concrete content and compact decisions, not ornament. Old captures and the developer-seeded lab are dated evidence, not proof of current hosted behavior or motion |
| [Kittens Game pinned source](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/core.js#L1324), local clone HEAD checked at that revision; `_createPriceLineModel` and rate-tooltip spans read | A shared price renderer presents held/required stock, limited-cap marking and a local rate-based ETA. Its ordinary resource list and richer detail have different jobs | Adapt concise causes inside OOPS's existing task detail. No duplicate cost evaluator. The inspected ETA arithmetic can imply eventual affordability even when a storage cap blocks it, so a decorative bar/ETA is not a substitute for native admission. Source inspection plus retained dossier fixtures, no new live play |
| [Trimps pinned HTML](https://raw.githubusercontent.com/Trimps/Trimps.github.io/b9edb1dfee270ebf81bef8d934dc71276bf8d963/index.html), source opened this round | Persistent resource columns combine held/max values and fill indicators; offline progress separately exposes progress, zone/cell context and stop/return commands. Named DOM targets have specific jobs | Adapt stable task context and a small visible interruption/return route. Do not put every OOPS mechanic into resource meters: lives, knowledge and local services differ. The dense resource cadence can compete with narrative/inspection. Pinned source evidence, not a fresh playthrough or current deployed-release claim |
| [Fallen London developer redesign account, June 2018](https://www.failbettergames.com/news/fallen-london-website-redesign-now-live), reopened this round | Status qualities use rounded forms, things sharp forms; possessions/self gain search/category routes; second chances move into the branch that uses them | Adapt form as a reading-role cue and keep help beside commitment. This historical account does not prove current shipped screens. An icon/form taxonomy has a maintenance and learning cost; OOPS should begin with its four existing surface roles rather than create a mark for every world rule |

No donor code or art was transplanted. These are three contrasting lessons beyond
Proto23, not a ranking of whole games. BOOK OF HOURS remains useful earlier
activity-fantasy context, but is not fresh behavioral evidence in this rerun.

### UIC17: recommended signature, with meaningful alternatives (proposal)

**Keep a vivid Gothic frame; let the task and place supply its material.**
The identity can be a repeated visual grammar without claiming that every life
is a journal, magical console or physical book. Signal is the proposed default
for general task surfaces. Folio warmth fits a known home, workshop, archive or
other material context. The baseline remains a real third choice in the study.

| Vocabulary | Proposed default and dial | Why it holds across worlds |
|---|---|---|
| Type rhythm | Selected Gothic; compact labels, aligned figures, one subject heading, readable prose blocks; real 14/21px checks | Familiar frame remains while local subject matter changes. Longer names/details spend scroll space rather than being deleted |
| Color roles | Cool blue work, teal context, violet Reports, existing semantic vitals and amber commitment/selection; quieter reading fields, adjustable intensity | Location can change without relearning danger/result/selection meanings |
| Frames and icons | Related rectangular frames, fine internal divisions, a clear focus/selection edge. Existing native task icons and subject names lead | Avoid a mandatory portal seal or paper illustration on unrelated actions. A decorative receipt mark is not item identity or magical power |
| Surface character | Inventory as aligned kit; work as dependencies and commitment; Reports as retained consequences; homes as a bounded known scene | O2 becomes different reading behavior as well as different backing color |
| Cadence and atmosphere | Immediate hover/press/selection, one short settled response, static receipt afterward. Small place-bound atmosphere; reduced/off supported | Action feedback has a cause and a finish. Background motion need not run to make the interface recognizable |

Full-shell inspection weakens the case for an all-over Folio skin: the same
warm material on every instrument competes with the existing color geography.
It strengthens a local warm household/workshop treatment. This is agent judgment,
not director selection. Material alone also leaves the long native work-policy
paragraph long; production prioritization of that information is a distinct,
proposed disclosure change, not something hidden by deleting it in this study.

### UIC18: serious proposals traced to their actual owners (ACCOUNT FOR NOW)

| Touch | Actual producer → public state/receipt → presenter → visible consumer | Lifetime/cost boundary |
|---|---|---|
| Local atmosphere | Native location/weather/daylight in `main.js` → known Village view → `quietPlaceText` / `createQuietPlaceDetail` in `src/quiet_place_detail.js` → `#quiet_place_detail` before location actions | Current daylight line shown. Off suppresses it; place change clears cue/effect. No new weather simulation or invented away history. Rain/lamp/tool/recovery transitions were source-traced, not exercised in this matrix |
| Native work feedback | Native craft transaction and settled event → `workLedgerCraftEffects.present` in `main.js` → `createSettledTextEffects` → native crafting window overlay plus retained `craft_receipt`/Reports | Full/reduced/off/OS-reduced executed. Receipt deduplication, subject replacement, cancellation and hidden-tab consumption belong to the existing owner. CSS adds no clock, event bus or reward |
| Small known-household O5 | Native home/household commands → `householdAnimalView` / `householdPresentation` → `createHouseholdScene.update` in `src/household_scene.js` → native `#home_panel .household-scene` | Named Moss, mood/posture and existing history are visible. Mockup warm backing/face contrast consumes that existing scene. No new animation assets or durable relationship memory needed |
| Practiced craft detail | Actual result `made`, skill ID/level → `craftResultText` → `craftCue` in `src/craft_cues.js` → native result paragraph | Currently Woodworking/Forging sight bands; Cooking has no authored cue. A preview can also use the selector, so only the settled occurrence should trigger a completion effect. Do not invent cooking expertise prose to make this demo richer |
| Session return detail | Observed carried/tool/skill/body snapshots → palette ledger/domain → Session notes panel and remembered readings | Cleared on load, bounded/deduplicated within the session. It is not offscreen living-place history. A durable “someone kept your chair warm” system would need actual presence/time/history state and separate design |

### UIC19: new expansion angles (ACCOUNT FOR NOW)

| Code | Useful angle and default | Failure/maintenance consideration |
|---|---|---|
| UIC19a | **Character through asymmetry of attention:** work emphasizes the selected means/result; inventory repeats rows; Reports keeps a quiet record; home gives one known inhabitant visual room | Decoration should not make four regions compete for the first glance. This uses existing surfaces, not a second shell |
| UIC19b | **Local material can follow the service, not just the world:** a clinic, foundry and household within one world can differ while command/focus grammar stays stable | Derive material from the actual public service descriptor. Do not infer danger/quality from a warm color or expose an unknown facility |
| UIC19c | **Let repeated events become familiar without making them louder:** an existing posture or short receipt can carry personality after the animation ends | Repetition identity belongs to subject + settled event; preferences/reset owner must stay explicit. No backlog animation on revisit |
| UIC19d | **Presence has a disclosure budget:** give the currently relevant known person a small expression/detail before adding more small actors across the screen | Existing Moss is cheap; crowds need public identities, presence and observation rules, plus more art and update work. A generic random face would lose subject meaning |
| UIC19e | **Compare while the UI is busy:** a selected recipe, inspected item and growing Reports stream reveal frame competition that an empty ideal screen hides | The new gallery retains native policies/dependencies and real result text. Crowded/very long logs, every local service and broader worlds still need their own bounded later samples, not a universal redesign gate |

### UIC20: staged source/code map (LATER / DELEGATE, proposals only)

| Rank / code | Proposed slice and existing seam | Capability / effort | Observable done check |
|---|---|---|---|
| 1 / UIC20a | Four surface material roles via `styles/ui_tokens.css`, `styles/shell_chrome.css`, inventory/crafting styles; use `src/component_themes.js` and `src/customization_profiles.js` for user/module controls | UI judgment, medium | Native populated baseline and changed screens at both desktop widths and 14/21px; ordinary navigation, focus, inspect/return and semantic colors remain readable. No new shell/controller |
| 2 / UIC20b | Easiest useful O5: improve known Moss face/posture emphasis in `src/household_scene.js` and existing household styles | UI/presenter judgment, small | Same subject before/after native meet/play/state changes; inspection changes no household state; reduced/off/static text remain useful. No added save bytes |
| 3 / UIC20c | Tune actual craft completion through `src/settled_text_effects.js`, `src/crafting_detail.js` and existing `main.js` craft subscription | Runtime/UI judgment, medium | One real attempt changes counters once, failed/no-output cases claim no finished object, repeat/load/subject replacement do not replay effects, off retains result text. Extend meaningful existing regressions; required runtime gates at AD36 |
| 4 / UIC20d | Broader local atmosphere through public place/service projections and `src/quiet_place_detail.js`, with existing palette feedback ports | Domain/UI judgment, medium | Two materially different known places use fitting static/local detail without invented state; unknown/away observations remain qualified; costs and failure paths are still visible |
| 5 / UIC20e | Durable living-place remembrance or new animated crowds | Domain/simulation/art work, larger; defer until selected | Name a real producer, history/presence authority, subject identity and time/reset/save contract before implementation. New simulation is a separate cost, not a prerequisite for O5 |

No production lane is dispatched. Existing UI/inspection owners retain custody;
this proposal grants no production repair authority. Initial startup/large-text
failures were traced to the mockup bootstrap and rechecked after its correction,
as recorded in UIC21.

### UIC21: fresh execution evidence and boundaries (ACT NOW)

Final frozen native bundle:
`da32191acbd8786502e439fb4487780517fda9df8aff1e32c943576db10e9675`.
[Preserved input/output manifest](../../prototypes/workbench/evidence/native-character-2026-10-26/INPUTS.json)
records 1,063 source inputs and 78 output files. The actual dependency graph
includes native renderer imports, imported JSON and library inputs; copied
styles/assets, fixtures and bootstrap are separately declared. Primary build
outputs were not used as the served study. The source/output check immediately after packaging
reported **matching**, with no changed inputs. During the pass it correctly
reported intervening book-world source drift, and the native build was refreshed
before the final matrix. The closing check then detected additional live edits to
`src/craft_recipes.js` and `src/craft_material_fit.js`: the tested snapshot is now
visibly **stale** relative to those inputs. Its native-shell fidelity and dated
execution proof remain; it is not claimed to contain the newer recipe edits.
Rebuild and repeat affected craft checks after those writers settle. This audit
does not chase concurrent implementation indefinitely. A matching hash check is
byte identity, not new UI proof.

| Command / evidence | Result | Gaps |
|---|---|---|
| `node prototypes/workbench/build-native-character.mjs` → official `node build.js` with isolated `BUILD_OUT` | Native bundle rebuilt, Ink compiler check passed; runtime graph unchanged across the final build; linked assets copied/frozen | Local build only, no installed-app or production adoption |
| `node prototypes/workbench/check-native-character.mjs <fresh-origin>/` → [receipt](../../prototypes/workbench/evidence/native-character-2026-10-26/receipt.json) | **12/12 native journeys:** baseline/Signal/Folio × 1920×1080/1536×864 × 14/21px; inspect/equip, complete one real attempt, read actual result, return, fresh homeowner/meet, known scene. Theme switching preserves native state excluding serialization timestamp. Sixty full-size native screenshots; no page exceptions | Fixture progress, not natural acquisition. Simultaneous native mirroring deliberately disabled. Not all worlds/services or long log histories |
| `node prototypes/workbench/check-native-effects.mjs <fresh-origin>/` → [effects](../../prototypes/workbench/evidence/native-character-2026-10-26/effects.json) | **4/4 modes:** actual mouse-down `:active`; one attempt per release; full 3 animations, reduced 1, off 0, OS-reduced 1. Native Made/Failed text retained | Sound remains off; no audio-device acceptance, weather/tool/recovery transition claims |
| `node prototypes/workbench/check-native-extras.mjs <fresh-origin>/` → [large-text and actor checks](../../prototypes/workbench/evidence/native-character-2026-10-26/large-text.json) | At laptop 14/21, recipe and inventory compute to actual 14/21px; native save ownership true, no write block. Here craft pointer route passes at both. Detail body 366/114px, content 737/891px, so native scrolling is required. Three supplemental 1536/21 actor captures show known Moss in context | A 114px reading viewport is cramped; reducing policy competition remains a proposal. The full home scene also needs scrolling at 21px |
| `node --test prototypes/workbench/freshness.test.mjs` | **2/2 pass:** changed/missing source/output identity, archived versus sketch evidence | Declared dependencies only; not a visual oracle |
| `WORKBENCH_EVIDENCE=<this-round>/shared-regression node prototypes/workbench/check.cjs <fresh-origin>/` | **10 existing workbench check groups pass**, output scoped to this round | Historical recipe fixture behavior; not native gameplay acceptance |
| `npm run check:rules` | **Pass**, 9 receipts checked, 317 explicit legacy paths skipped; two existing untracked-link warnings | No commit/tracking claim |
| Syntax and scoped `git diff --check` | Pass | No production runtime edit, so no full runtime test-suite or architecture-completion claim |

The only HTTP failure in the final native matrix is the deliberately omitted
optional `private_packs/manifest.json` (404). The corresponding resource-load
console message is retained in the receipt. No final page exceptions, save-lock
errors or worker CSP failures. The whole native shell is exercised, but this does
not claim that every service command, weather condition or installed app is verified.

**Setup failures were corrected, not turned into product findings.** The initial
bridge used `offsetParent` to detect a fixed PLAY button, then waited for `display`
instead of the native loader's `visibility`. It also clicked PLAY before native
save ownership resolved; the workbench CSP initially blocked inline handlers and
the native blob worker. The corrected mockup waits for ownership, respects native
visibility, skips import-probe bootstrapping and permits the native worker only
on this isolated study route. All affected final journeys were rerun. The earlier
read-only banners, connection-baseline error, occluded Here row and collapsed
large-text body were setup-state evidence, superseded by the final native checks.
They do not justify blaming or patching production code.

### UIC22: keeping this study useful without silently aging (ACT NOW / ACCOUNT FOR NOW)

The general workbench builder now builds this native study as well. The default
entry, Task & limits, live freshness banner and native bundle footer make it
findable and identify what is being viewed. Review export names the native bundle,
not the older general recipe build revision. Native Layout switching preserves
the current instance; the unsupported simultaneous checkbox is visibly disabled.
The matched gallery is explicitly static alongside evidence, not a claim of two
synchronized live games.

[MW8 and the native operating instructions](../MOCKUP_SYSTEM.md#native-character-study-2026-10-26)
keep the refresh route in the shared workflow. The server rechecks on study
change/focus and every 15 seconds. Missing evidence is unverified; changed inputs
are stale; an archived study stays archived. A rebuild must be followed by the
affected native route checks. Fresh-envelope compatibility, newly added dynamic
assets and new source seams still require declaring their dependencies; a hash
checker cannot discover an undeclared dependency or judge whether a fixture is
representative. No automation, worker, successor chat or recurring job was created.

**Disposition:** the faithful runnable comparison and finite A1–A5 audit are
agent-verified, not human-reviewed. UIC17/UIC20 are recommendations only.
Production styling, new O5 behavior, installed-app adoption and broader-world
sampling remain unimplemented proposals, not missing gates for this audit.
