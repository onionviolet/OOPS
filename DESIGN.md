# OOPS design: the look

The one owner of how the game looks and reads. Weibao accepted a single DESIGN.md
for this on 2026-10-30 (O1, [his words](docs/USER_VISION.md#ui-identity-per-world-basics-and-combat-surfaces-2026-10-30)).
It says what the game should feel like, what every feature UI meets, and how
each world adds its own flavour. The mechanics of tokens, spacing, components and
navigation stay in [UI rules](docs/UI_RULES.md) (UR1-UR82, SUI, RPT); this file
links to them and does not restate them.

Status: the owner and the lines marked **accepted** are Weibao's direction.
DSG3/DSG5 and the editorial/cadence application of DSG13 are accepted defaults from [2026-11-04 direction](docs/USER_VISION.md#ui-and-prose-defaults-subtle-details-and-whimsy-2026-11-04). Other lines remain proposed (AD32) until he accepts or changes them; a line
that restates a UR or AD keeps that rule's status. Codes DSG1-DSG19 are new to this file. Every line is a default, a
dial and a reason (AD5); a world or feature can depart from one by saying why.

Target: desktop 1920x1080 first; mobile deferred ([standing priority](docs/USER_VISION.md#standing-ui-priority-2026-10-13)).

## What it should feel like

| Code | Default | Dial | Reason |
| --- | --- | --- | --- |
| DSG1 | **A dense, readable instrument panel you live in.** Proto23's composition is the baseline (**accepted**, UR12): You and the current focus as twin panels on top, inventory, the place and its actions in the middle, and a full-height Reports column kept whole (UR11). Rows are tight hairline rows, not cards in cards. | Panel sizes and docking are the player's (layout settings); a full-screen view takes over only for weighty moments (UR5). | The numbers, the place and what just happened stay in view together, which is what made Proto23 readable ([baseline clarification](docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15)). |
| DSG2 | **Luminous Gothic is the default skin** (**accepted**, [2026-10-29](docs/USER_VISION.md#luminous-gothic-is-the-default-look-2026-10-29)): square frames, navy-to-teal task fields, purple Reports, soft glow on frames and headings, pastel gradient vitals, the bitmap Gothic face at its native strikes with emphasis by colour or case rather than synthetic bold (UR60, UR68). | Neutral and the other Appearance profiles stay one setting away; a player's choice always wins over a world's (DSG16). | One look that grows instead of a dialect per feature ([round 14 VSX1](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-14-2026-10-30-grow-from-the-current-look-and-a-better-build)). |
| DSG3 | **Whimsical and unpretentious UI and flavor, vivid in colour, quiet in hierarchy.** The interface/narrator can be warm, dry, curious or playful; characters retain their own personality, motives, competence, knowledge and speech. Clear commitment terms accompany expressive texture. Decorative details may be pleasing without granting a gameplay benefit; effect claims follow UR72. Colour carries roles with readable words/symbols (UR37). | World, scene, repetition and player preferences tune expression; a serious world need not become parody, and a comic character need not lose their voice. | **Accepted default, 2026-11-04** ([direction](docs/USER_VISION.md#ui-and-prose-defaults-subtle-details-and-whimsy-2026-11-04)); presentation and characterization are distinct. |
| DSG4 | **Glyphs as compact tokens.** A CJK glyph marks a kind of subject (人 a person, 兽 an unknown creature, the season in the place header), with its English word beside it on first sight. | Per-world glyph sets (DSG12). | Proto23 already mixes a glyph into its header, and the Gothic face renders them crisply ([identity PX12](docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md#what-proto23s-identity-actually-is)). |
| DSG5 | **Compose the task before polishing its ornament.** Group the current subject/situation, relevant choices, commitment and aftermath into a readable hierarchy, preserving useful independent panes. Structure and decoration can be iterated together; what exists remains open to improvement (AD45). | Reading, comparison, investigation and routine tasks may use different forms. A meaningful diagram, quiet motif or expressive moment can earn space through the experience it creates, without a new mechanic. Prose normally stands alone. Start distinctive UI with the action, its quote, actual work/state and interaction feedback. A diagram or vignette may be chosen when it serves the task or a deliberate reading experience; a passage does not acquire an illustration merely because its wording changed. Keep observation/subject identity and stable interaction, with decorative intensity chosen per world and scene. This remains an opportunity to exercise taste, not an art, animation or joke quota ([prose-first clarification](docs/USER_VISION.md#prose-first-visuals-and-hall-interaction-2026-11-04)). | **Accepted default, 2026-11-04** ([direction](docs/USER_VISION.md#ui-and-prose-defaults-subtle-details-and-whimsy-2026-11-04)); refinement of the earlier restructure-before-decoration line, not a requirement to freeze mechanics before visual work. |

## What every feature UI meets

DSG6–DSG11 are the six readiness checks below. Surface authorization belongs to
UR2: existing direction can authorize a home, and AD42 makes human review optional.
These checks do not promote an unaccepted proposal. The contract card (UR76,
proposed) records their application; UI_RULES owns the interaction requirements.

| Code | Requirement | Dial | Reason, and the rules behind it |
| --- | --- | --- | --- |
| DSG6 | **A home.** Apply UR1/UR4/UR8 for surface, in-world operator and registration. | A throwaway lab view may skip it inside the Projects drawer. | Without a home every system drops a box into Local actions. |
| DSG7 | **A compact glance form.** Apply UR26/UR41/UR42 in the world’s own form (AD46): value, meter or status in the home’s header or appropriate visible set. | A world with no such system shows nothing (UR82). | The idle player reads at a glance; detail on demand (UR41, UR42). |
| DSG8 | **Details one click away.** Apply UR9/UR43 for controller, Back/Esc, selection and reading position; UR74 owns shared meaning. | Hover may preview; click pins (UR41). | A click never loses the player; one meaning across surfaces (UR74). |
| DSG9 | **An empty state that says how to fill it.** Apply UR32/UR52 for distinct empty and unknown states. | A world may keep a layer hidden until something attaches (UR82). | Blank panels read as bugs. |
| DSG10 | **A reason on anything greyed.** Apply UIV1 (proposed) and standing SUI5 for inline/focus reasons, limited to observer knowledge. | How much of the cause shows follows what the observer knows; a sealed cause reads "not yet" without the truth. | A player may never hover, and a silent grey button teaches nothing. |
| DSG11 | **One home per fact.** Each player-facing fact (a health total, a hit chance, a threat, how many opponents are left) has one owning place on screen. Other places link to it or show a deliberately different view, a summary with a route to the owner (UR56, UR64), not a second copy. Every view reads the same read model. | A glance header may repeat a fact it needs, such as HP in a versus header, if it reads the same read model and refreshes with the owner. | Copies drift: a 2026-10-30 fight showed opponent health three times, two of them disagreeing (2016/2025 against 2025/2025). Weibao asked for this rule on 2026-10-30, relayed by the repository review session ([record](docs/USER_VISION.md#ui-identity-per-world-basics-and-combat-surfaces-2026-10-30)). |

Descriptions inside any of these follow UR70-UR75 (meaning first, numbers second).

The accepted [task-layer application](docs/UI_RULES.md#task-layers-and-long-running-work-2026-11-04) keeps disclosure, execution depth and knowledge separate. Shared identity/controls support different task forms: a fixed-result summary, configurable assembly comparison, experimental notebook or ongoing-work review. Long work retains its actual identity, terms and return context; these roles need not become separate pages.

## The per-world contract

Each world chooses its own systems and their UI (**accepted**, AD46); Weibao asked
for world flourish and world report text, "not just using the generic ones"
(**accepted**, 2026-10-30). The shared chrome stays shared: controls, focus,
back bars and blocked reasons look the same in every world so nobody relearns the
UI (round 13 FLA5). What a world changes:

| Code | Layer | Default | Dial | Reason |
| --- | --- | --- | --- | --- |
| DSG12 | **Flourish** | The page root already carries `data-world` (the world id, `native` for the frontier, written in `workspace_views.js`); beside it [world_look.js](src/world_look.js) sets `data-world-family` for every world and `data-world-flourish="on"` for families it lists. A flourished family's tokens (accent, header rule, ornament glyph, place epithet) sit in `styles/ui_tokens.css` and its rules in `styles/world_look.css`. Unlisted worlds keep the plain Luminous look. LOTM is the first entry. | A row may set fewer tokens; the player's Appearance overrides it (DSG16); effects off drops the motion. | One hook is the base later skins ride on (PLAN M3); flourish stays off the data layer so contrast never drops (FLA3). |
| DSG13 | **Report and flavor voice** | The UI/narrator voice, a speaker's dialogue and the character's own interpretation are distinct. Reports lines that a world names get its own flavour plus the useful part (consequence or next step) from [world_report_voice.js](src/world_report_voice.js), in three grains, most specific first: a place row for a named locality, the world's general row for any other arrival or newly opened place there (flavour drawn per place, useful part naming that world's real way to move), else today's generic line. Rows key on the world id, so a generic family never voices a world it was not written for. | World/scene tone, recurrence and player preferences vary expression; repeated routine results quieten while new consequences can renew emphasis. Characters keep their own register. Useful consequence/next-step information remains available alongside flavor. | Weibao asked for "flavour or specific useful text" (PLAN M4). RPT1-RPT14 bind (RPT13: every enterable world ships its voice; RPT14: seen flavour, real controls): perceived only, subject first, no canon labels or future, deterministic wording. Flavour carries no sealed truth outside its discovery route. Editorial separation and cadence accepted 2026-11-04 ([direction](docs/USER_VISION.md#ui-and-prose-defaults-subtle-details-and-whimsy-2026-11-04)). |
| DSG14 | **Vocabulary for types and damage** | Shared mechanism, per-world words: a world declares display names and glyphs for its harm types; undeclared worlds show physical plus the effect types. | Owned by the combat lane (PLAN M6) in `damage_types.js`; this file only fixes that names come from the world. | The same mechanism reads as mystical harm in one world and a curse in another. |
| DSG15 | **Progress form** | Progress shows in the world's own form (a sequence, a report card, a status window, a ledger or none); the LOTM ladder is LOTM's form, not the default (AD46). | Per world and per life. | Progression is any lasting improvement. |
| DSG16 | **Precedence** | Player Appearance > world flourish or skin > Luminous default ([MDL12](docs/audits/UI_DESIGN_CORE_AUDIT.md#refactors-to-plan-for-before-they-get-expensive)). A world leaves the colours the player chose alone. | A player may opt in to letting a world repaint more (a later Appearance switch). | The player owns their screen. |
| DSG17 | **Skins (O2, later)** | A world skin is a token pack keyed by the same `data-world` hook: frame, fill, line, ornament, glyph set, motion signature (FLA2), reviewed in the gallery before it ships (FLA6). Priority is low now and important later (**accepted** ranking). | Each pack carries a size budget (FLA4). | Skins become data, not per-feature CSS (UR6, UR12). |
| DSG18 | **Diegetic UI (O3, later)** | A world-shaped surface (a newspaper, a status window, a sect jade slip) replaces a generic panel only after that world's basic kit (DSG19) is working, and keeps a plain text form. | Per world, one surface at a time. | Weibao: "we need the most basic Ui working for each world" first. |
| DSG19 | **The basic kit** | Every playable world answers six questions on screen: where I am, what I can do, my progress in the world's form, who is here, what happened in the world's voice, and how a fight looks. The [kit census](docs/audits/WORLD_UI_KIT_CENSUS_2026-10-30.md) marks each world's cells working, generic or missing. | A world without fights marks the fight cell "none by design". | The O3 gate; also the checklist for a new world's first UI slice. |

## Selective 2D exploration, 2026-11-01

**Current resolution: improve the Proto23-style functional interface first.**
Weibao found the pictured home unhelpful and preferred a better version of
Proto23's representation ([his feedback](docs/USER_VISION.md#functional-proto23-style-ui-over-the-pictured-home-2026-11-01)).
For housing, prioritise a readable home overview, meaningful furniture rows,
active effects, storage and connected rest/work actions within the current
shell. Stop expanding the pictured-home experiment. This is a preference for
better interaction and information structure, not a requirement to preserve
existing clutter or defects (DSG5, AD45).

Assess other aspects by the decisions they serve (AD46). Routine fishing,
gathering, trade and crafting can improve through their existing task forms;
position, layout, reach or adjacency can justify spatial representation in a
selected exploration, building or encounter task. These examples are proposals,
not a dispatched feature list. Decorative scenery and a walkable conversion are
not current defaults; no blanket ban on useful diagrams, maps or later 2D is made.
Reuse existing observer-safe projections and native commands in any chosen form.

Earlier selective-2D/hybrid ideas and the pictured-home request remain dated
history in USER_VISION and [UI audit rounds 16-21](docs/audits/UI_DESIGN_CORE_AUDIT.md).
[Round 22](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-22-2026-11-01-functional-home-first-after-prototype-feedback)
records the feedback, unfinished experiment and aspect-by-aspect implications.
Exact replacement layouts and other-aspect choices remain proposals under AD32.

## Common actions and task automation, 2026-11-01

Weibao: “Should wait and other buttons be placed seperately? so like shared/common cliocks and more? more to consider? ALso automate other tasks instead of just wait? more to conidr?” This is a design question; the arrangement below is proposed, not a shipped layout or a new accepted rule.

**CA1 proposed default:** keep the scene/current task's choices first. Put common verbs such as Wait and available Rest/Sleep in a compact, consistently placed Common actions section after the task, with time targets under one disclosure. Keep the active work's status and Stop/Pause with that work through the existing work strip/ledger, rather than scattering duplicate controls among story choices. Navigation/Back remains navigation. A common renderer delegates actual verbs, costs, clock and eligibility to the current world/place; it does not give every place the same actions. Alternate arrangement: a persistent compact activity bar where a world needs frequent time/task switching. A global toolbar listing every verb is not the default because it hides the current decision among irrelevant actions.

One wait target can have several known reasons, such as dawn and an appointment at the same time; show a single current quote or clearly grouped labels, not stale duplicate command controls. Keep focus, keyboard activation, current cost/reason and selected target stable while clocks update. Automation's state should read as intent, active job, result or paused reason, with a route back to its owning task. Its results stay in Reports; changed outcomes/discoveries remain distinguishable from routine repetition (UR43/UR44/UR64).

This does not move KJ2's buttons or create a global automation panel. [CA2–CA5 automation uptake](docs/gm/dispatch/procgen-2026-10-13/cr3/AUTOMATION.md#common-actions-and-useful-task-automation-2026-11-01) owns task/queue mechanics and current evidence. Reopen this arrangement with the next selected activity/UI slice; prove one manual/automated task, its current-work/stop route and interruption at 1920×1080, actual 14/21 px. Mobile remains deferred.

## Where to look next

- Populated LOTM UI: [UI audit round 27](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-27-2026-11-01-populated-lotm-journey-before-more-ui-infrastructure) implements the selected current-task/navigation/cost/consequence slice; its journey receipt distinguishes native verification from the remaining repository-wide gate.

- Native equipment review and UI sequencing: [UI audit round 26](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-26-2026-11-01-native-equipment-reviews-and-ui-priority-check) tests real tool/gear adapters and recommends connected LOTM/general UI clarity before more comparison infrastructure. Proposal under AD32; housing benefits stay in HB4 of the home palette.

- Furniture replacement experiment: [UI audit round 25](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-25-2026-11-01-native-furniture-replacement-and-reusable-review) records native staged packing/installation, costs and a reusable review component. Native tool reuse remains proposed under AD32.

- Modular/swappable UI ideas: [UI audit round 24](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-24-2026-11-01-modular-possibilities-without-screen-overload) distinguishes presentation, implementation and in-world swaps, with an inspector-led default and task-specific alternatives. Proposed under AD32; existing AR/DSG owners retain authority.

- Functional panel design ideas: [UI audit round 23](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-23-2026-11-01-functional-home-comparison-and-panel-design-ideas) compares a real-system home prototype with the current panel and proposes task-specific structures across newer panels. Ideas and the candidate remain unselected under AD32; common actions/automation stay with CA1-CA5 above.
- Tokens, spacing, heights, layers and type roles: [UI rules](docs/UI_RULES.md#small-detail-tokens-2026-10-22) UR6, UR65-UR68.
- Scenes, travel and Reports lines: [scene and report rules](docs/UI_RULES.md#scene-and-report-rules-sui-rpt).
- The history behind these lines: [identity round](docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md), [foundation round](docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md), [UI design core audit](docs/audits/UI_DESIGN_CORE_AUDIT.md) rounds 10-14.
- Change this file when the look's direction changes; record Weibao's words in USER_VISION first.
