# R7: native YAIR and Proto23 composition audit

2026-10-15. Writer `01a14072-4b0f-7300-a645-5a3d29d25a8f`. Findings and reversible recommendations, not human acceptance. [Handoff](R7_HANDOFF.md), [live direction](../../../USER_VISION.md), [UI rules](../../../UI_RULES.md). R7 implements the bounded A1–A5 UI slice. This is a deep trace of those surfaces and their immediate dependencies, not a claim to audit every game system.

Weibao's additional steering: compare the games side by side, consider multiple enemy panels and subtle code interactions, improve You as a coherent design, sharpen text/color, add report controls including stop combat log and clear, and use his wider screen. The supplied first image is **Existing layout**, a compatibility capture, not R7. The second is a 3600×1906 Proto23 reference. Raw attachments and receipts remain in ignored `docs/research/panel-design-2026-10-15/private/ui-reference-attachments/r7-*`.

## Sources and evidence

Pinned Proto23 original: `docs/research/panel-design-2026-10-15/private/proto23.html`, SHA256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`, revision `e93a8cd617932fb698ff889b968a32f9a20d48f3`. No original source edits. Existing private lab uses native constructors and controls with deliberately granted fixtures; original scaling is removed for 1366×768 captures. R7 freshly exercised native difficulty selection, a spawned fight, advancing health/logs, Pause next and Resume; actions/skills/crafting/journal/night and a native attribute hover were also captured. This is DEV SEEDED interaction proof, not natural progression. Lab source and original have distinct receipts.

YAIR sources read directly: `src/display.js` native stat catalog, descriptions, effects, weather and log producers; `src/ui/combat_display.js` fighter creation, stats, health and cycle rendering; `src/models/combat.js` target selection and event production; `src/combat_focus.js` public DOM projection; `src/ui_polish.js` hit text; `src/main.js:10155` shell/village readers; shared navigation/layout/controller/components and native HTML. Existing presentation was exercised on the synthetic fixture. It is the current integrated YAIR frontend, not a claimed untouched historical upstream build. The supplied YAIR reference and the existing-layout compatibility test are separately labelled.

Precise source ranges and private excerpts are in ignored `docs/research/panel-design-2026-10-15/private/r7-code-audit/`. Fresh screenshots and machine-readable source observations: `evidence/parity-r7/native-dom.json`, `proto23-audit.json`, `source-fight.json`, `native-yair-events.png`, `proto23-*.png`, `source-fight-*.png`. Screenshots prove pictured states; code locators establish the traced mechanism. Verification results belong to [R7 report](R7_REPORT.md).

## Findings and dispositions

| Code | Native/source observation and locator | Consequence for R7 | Disposition |
|---|---|---|---|
| F1 | Proto23 constructs one `global.current_m` opponent pane, with name/type/level, four attributes, health, rank and battle controls (`proto23.html:9148–9180`, `10010–10020`). YAIR constructs one row per fighter (`combat_display.js:144–184`, `204–215`). | A single expanded opponent cannot replace awareness of several attackers. R7 keeps a stable compact roster and offers individual health/cycle panels, with one inspected detail. | ACT NOW |
| F2 | YAIR chooses alive targets from the combat loop's list, using `.filter(...).slice(-target_count)` (`models/combat.js:215–245`). Shell inspection is ephemeral `selectedEnemy` and invokes no combat command. | Say **inspect**, not attack/select target. Per-enemy panel clicks must preserve the native encounter and pending attack loops. No click-to-retarget mechanic. | ACT NOW |
| F3 | YAIR native fighter slots are indexed DOM IDs, not durable encounter identities (`combat_display.js:144–148`); native encounter save records have separate keys (`models/combat.js:80–96`). | Reuse stable nodes within an encounter; fall back when an inspected row vanishes. Same-species slot reuse between encounters cannot prove identity continuity through the current UI adapter. A future durable actor/encounter projection is a separate owner change. | ACCOUNT FOR NOW |
| F4 | Native health text rounds upward, while bar width and attack cycle carry a different precision (`combat_display.js:386–415`). | Preserve native text and bar values separately. Do not derive exact health from a rounded label or call the cycle an exact time-to-hit forecast. Each individual panel has an indexed accessible cycle label. | ACT NOW |
| F5 | Active `update_fighter_stats` reads full fighter stats, contextual group modifiers and skill modifiers (`combat_display.js:217–299`). The separate older `update_defender_stats` implementation is not called by `update_displayed_fighters_stats`. | Read the active renderer. Do not treat a suspicious formula in a dormant legacy function as an established current combat defect. Paired Attack/Speed/Defense reuse emitted values; no duplicated hit-chance computation. | ACCOUNT FOR NOW |
| F6 | AP/EP are ratings; percentages depend on opponents and shields. Shield blocks are distinct from evasion (`combat_display.js:247–299`, `models/combat.js:423–453`). | Keep units and context. Never compare AP directly to a displayed hit percentage; never label 100% connection as guaranteed damage. Detail hovers preserve block caveats. | ACT NOW |
| F7 | Raw native exact enemy values exist, but built-in universal appraisal remains a proposal (`MEANS_AND_APPRAISAL.md:282`, relevant native-realm section of `PRESENTATION_AND_FOURTH_WALL.md`). Proto23's opponent renderer directly displays model values; it is not evidence of YAIR character knowledge. | Current values remain explicitly a native compatibility readout. Unknown fields are omitted, partial wording preserved. Known/partial/unknown cases are labelled synthetic public-DOM presentations, not earned appraisal. No new observer grant, world rule or hidden-model lookup. | ACT NOW + ACCOUNT FOR NOW |
| F8 | Proto23's You pane combines resources, equipment, four attributes, hit/dodge/crit and identity (`proto23.html:9063–9137`, `9952–9962`). YAIR has twelve real public rows with breakdowns (`display.js:282–290`, `4038–4088`). | You needs one coherent overview and named stat groups, not another copied twelve-row wall. R7 groups Attributes/Attack/Defense, adds native summary hovers and units, and shows native gear in available wide-screen space. It invents no rank or future stats. | ACT NOW |
| F9 | YAIR changes the shield defensive value from `.stat_value` to `.stat_value_long` and EP to Block (`display.js:4065–4088`). R6 selected only `.stat_value`. | Include both native value forms; preserve Block's percent/strength compound value and real description. This was a real omission risk in the R6 UI projection. | ACT NOW |
| F10 | Copying full stat DOM on every tick replaces focused controls. The native values/descriptions already have stable IDs. | R7 keeps keyed stat and overview controls and updates their content; reading a tooltip does not advance the clock. Avoid focus restoration loops on every render. | ACT NOW |
| F11 | Native effects supply descriptions/durations and buff/debuff data. No current opponent effect projection exists in the shell reader (`main.js:10155–10172`, native effects in `display.js`). | Preserve actual player status hovers; do not decorate enemies with guessed effects, stacks, intent or level. A future opponent-effect projection must be observer-qualified. | ACCOUNT FOR NOW |
| F12 | Proto23's center controls reveal assembly/skills/actions through flags and switch substantial peer windows (`proto23.html:9232–9320`; reveals `10893`, `13752`). | Keep Here/Skills/Crafting/Mixing beside the task. Journal/Bestiary/Books/Notebook and other known destinations get named persistent navigation. No catch-all More in parity; hidden/disabled routes retain native discovery/eligibility. | ACT NOW |
| F13 | Native YAIR journal has its own tabs; shared controller owns history/Back/Esc and expanded references. Proto23 journal is another task window, not a reason to crowd YAIR's local footer. | Move Journal out of the local footer, preserve its content and direct named/hotkey paths. Broader references continue through the existing controller, while stats/target inspection stay in their own region. | ACT NOW |
| F14 | The idle upper focus region previously showed a generic prompt despite public place/people data being available. | R7 shows the existing place description and known nearby people as free inspection links. Conversation still requires its explicit native action. Do not auto-start talking, grant traits, or claim no people exist when none are listed. | ACT NOW |
| F15 | Proto23 `msg`/`msg_add` accept subject objects and per-fragment colors (`10296–10332`); skill/perk/title messages use distinct subjects/colors (`13736–13765`); hits distinguish damage/crit/body parts (`13930–13975`). | Keep R6's actual recorded skill/milestone/item subjects. Separate loss/outgoing damage/growth/loot/crit/defeat colors; retain readable words and [CRIT]. YAIR physical hit text has no body-part roll, so none is imported. | ACT NOW |
| F16 | YAIR `hero_missed` is used for an outgoing attack evaded by the enemy; event names alone are not a reliable English actor/target description (`models/combat.js:437–453`). | Style outcome categories without rewriting who attacked whom from the event key. Retain exact original text and stable recorded subject snapshots. | ACCOUNT FOR NOW |
| F17 | Proto23 Freeze prevents `msg` from adding new entries; it is not just a held scroll position (`proto23.html:9870–9895`, `10296`). YAIR Smart follow preserves scroll and counts new visible events (`display.js:156–197`, `1177–1220`). | Keep honest Smart/Always/Latest controls. New **Stop combat log** explicitly suppresses new hit/miss/block/defeat reports while combat continues, preserves existing history and separate loot/growth reports, and resets on reload. It is not a simulation pause or replay queue. | ACT NOW |
| F18 | Native YAIR caps separate message categories; Proto23 has one configured maximum and CLR (`display.js:1160–1176`, `proto23.html:186`, `9711–9713`, `9870–9895`). Native clear did not reset category counts. | Clear must reset native counts and dynamic-loot reference along with rendered history, otherwise later capacity removal can target a nonexistent row. R7 reuses the native clear owner and checks subsequent stream traffic. No persisted history is promised. | ACT NOW |
| F19 | R6's layered outline shadows and .15em heading spacing survived the skin (`ui_tokens.css:294`, earlier resource rules). Scaled comparison images further soften text. | R7 uses system-first type, normal heading spacing, tabular values and solid resource labels without outline shadows. Comparison offers real 100% images. Font size customizations remain available; picture sharpness at fit scale is not native-render quality. | ACT NOW |
| F20 | Proto23 season uses distinct words/glyphs/colors (`13832–13845`), lunar/day/night follows its own time rules (`13863`). YAIR's native simple time is Day/Night (`game_time.js:84–88`); its native temperature projection includes chosen °C/°F and tolerability (`display.js:4350–4420`). | Add season/weather/day-night symbols with words and titles. Reuse displayed units and native tolerability details; do not convert temperature twice or invent moon phase, visibility, forecast or mechanical buffs. | ACT NOW |
| F21 | More width does not create more useful content by itself. The supplied 3600×1906 reference leaves unused external space while Proto23's internal pane proportions remain fixed. | Compare full-size 1366/1920/2560/3600 renderings. R7 uses wider space for visible gear and more simultaneous enemy panels, retaining the full-height log. Expanded laptop details may scroll locally and reduce inventory height; those costs stay visible. | ACT NOW |
| F22 | A hover preview can reopen after layout changes and intercept an unrelated click. Initial R7 flow reproduced this when returning from stat groups. | Passive previews do not intercept pointer input; explicit subject/effect previews retain their intentional reading/scroll surface. Preserve focus/Esc and check bounds at large text. | ACT NOW |
| F23 | R6 recorded return-to-parity timeouts; R7 initially reproduced slow auxiliary evaluation/capture. | Native Existing→R7→Existing selector interaction subsequently passed serially, with raw base-layout bytes, pin/collapse and gameplay state retained. Keep failed harness runs, and report the exact interaction evidence rather than claiming a diagnosed engine fault. | ACT NOW |
| F24 | Initial target-count code starts at one and its stance-related increment is guarded by `target_count > 1` (`models/combat.js:215–225`); this UI pass does not establish intended multi-target mechanics. | Do not imply individual panels enable group targeting or that a pictured roster proves a multi-target stance. Mechanic investigation belongs to a separately scoped combat owner. | LATER |
| F25 | Existing VFX distinguish settled events, Off/Reduced and actual reveal events. Historical log subjects are recorded at emission, whereas current panel links read current state. | Keep all existing VFX owners unchanged. No log replay on hover, no repeated discovery cue on restore, no resolution of old loot through today's bag, no speculative animation/throughput claim. | ACCOUNT FOR NOW |

## Composition decision, still a candidate

**D1:** compact indexed roster is the laptop default. Individual opponent panels are an explicit alternative; wide screens show more at once. One expanded comparison belongs to the inspected opponent. Multiple fully expanded stat tables by default compete with local actions and the log, especially at21px; the comparison shows that cost instead of hiding it.

**D2:** You has identity/resources, a small native attribute/combat overview, native equipment and grouped details. Group selection changes presentation only. Real progression and active effects use native descriptions. Wide displays reveal useful equipment space instead of stretching six numbers across a blank panel. No generic power rank, invented regeneration/intent or empty future-world counters.

**D3:** persistent named destinations hold records and broad references; local task tabs stay local. This is a reversible placement recommendation, not acceptance of every route as a permanent tab. Journal keeps native subviews and shared Back/Esc. No alternate registry or UI routing manager.

**D4:** expressive report colors apply to semantic subjects/outcomes, with exact wording and symbols retained. No new event grouping in R7: per-category retention, historical snapshots and lack of a universal durable event key make lossless grouping a larger owner change. Untyped item producers remain plain until they supply actual IDs.

## Useful later work, not R7 acceptance gates

| Code | Opportunity | Required owner/evidence |
|---|---|---|
| L1 | Durable encounter/actor identity, defeated/exited state and current-versus-recorded person hovers | Observer-qualified combat projection, not DOM-slot/name guessing; restore/encounter-change evidence |
| L2 | Optional wide reference rail for two items or a pinned character sheet beside a task | Shared-controller layout experiment with a real simultaneous task and return restoration |
| L3 | Typed historical references for more crafting/reward/title producers | Producer IDs and known descriptions captured at emission, not current-name matching |
| L4 | Event grouping, explicit historical retention policy, larger stream/VFX performance | Stable event identity and a representative sustained workload; no benchmark inference from this screenshot set |
| L5 | Enemy knowledge progression and custom world-specific stats | Existing means/appraisal/world owners select the actual mechanic and projection; synthetic unknown cases do not implement it |

Human visual/readability/default-composition acceptance remains open. Mobile, new combat/appraisal mechanics, personal saves, installed/public runtime, commits and publication remain outside this slice.

## Density and automatic fit follow-ups

**D6:** Weibao requested automatic screen fitting as well as a compact option.
R7 reuses the existing density owner; a direct Compact/Comfortable toggle changes
spacing without reducing the selected font. The base Existing layout retains its
own raw storage and density. No new save schema or second layout manager.

**D5:** automatic layout uses viewport size, measured pane width relative to its
font, and known enemy count. Wider contexts open available native gear and choose
individual enemy panels when their content fits; smaller contexts use a compact
roster. Manual roster/gear choices take priority for the current session. The
laptop upper pane responds to selected text size; detail expansion keeps a named
local scroll region. No auto zoom, unreadable font shrinking or hidden data reveal.

**D7:** future fit should also account for translated names, unusually large
resources, many effects and several custom-world stats. Those require real
projections and representative workloads. R7 tests long names/eight enemies and
live window resizing; it does not claim arbitrary-world fit, mobile acceptance or
full accessibility certification. The wide comparison includes the supplied
3600×1906 dimensions at21px.

**F26:** the attachment's3600×1906 pixels do not establish its CSS viewport or
device pixel ratio. Treat3600 as a reference-size/stress case alongside1920 and
2560 CSS pixels, not a measurement of Weibao's browser window. Native browser
rendering and full-size evidence own sharpness acceptance; downscaled screenshots
cannot establish it.

**F27 (ACCOUNT FOR NOW):** Proto23's name editor clears `you.name` on focus and
restores it on focus-out (`proto23.html:9068–9069`). Its inspection/UI behavior
is not uniformly read-only. R7 inspects emitted descriptions and invokes no
Proto23 handlers or name-edit callbacks. Native YAIR equipment commands remain
explicit actions; opening a row or stat preview remains free inspection.

**F28 (ACCOUNT FOR NOW):** native enemy percentages are emitted in the current
combat context. Multiple attackers change the native display to AP/EP, and the
current player-oriented shell reader is not an accepted arbitrary-ally inspector
(`combat_display.js:217–299`, `combat_focus.js`). Keep unsupported encounter roles
and world-specific stat projections with their existing combat/knowledge owners.

The Clear follow-up checks subsequent native traffic after clearing, alongside
the source-level counter reset. It is not an exhaustive category-cap or long-run
log throughput stress test.

**F29 (ACT NOW):** periodic Village/focus rendering rewrote unchanged headings,
calendar text and roster titles. R7 now keeps those text/attribute writes
idempotent. This preserves node identity and avoids unnecessary observer work;
no frame-rate or long-run efficiency measurement is claimed.

**F30 (ACT NOW):** at1366×768/21px, the first automatic text-height rule could
leave the selected item detail at zero height during combat. A targeted native
inspection/persistence check reproduced it. Item inspection now reserves lower
pane space in that laptop context, while vital resources and the full log remain
visible. The last integrated Save/reload/export/import and selected-item combat
check passed after the correction (`runs/r7-integrated-fit-final.log`).

**F31 (ACCOUNT FOR NOW):** native PLAY becomes visible before all UI modules
finish mounting (`main.js:9780–9825`, final test-hook registration near10293).
Automation now awaits the native completion hook before interaction and asserts
in-page results independently of pending document navigation. This is a harness
readiness correction, not an engine/startup-performance fix.

**F32 (ACT NOW):** a new transient report control must not silently change the
Existing presentation. R7 Stop combat log is explicitly presentation-scoped;
`stop-compat-results.json` verifies native combat reports continue in Existing
and resume normally when returning to R7. No saved gameplay flag was introduced.
