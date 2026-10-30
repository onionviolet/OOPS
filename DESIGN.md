# OOPS design: the look

The one owner of how the game looks and reads. Weibao accepted a single DESIGN.md
for this on 2026-10-30 (O1, [his words](docs/USER_VISION.md#ui-identity-per-world-basics-and-combat-surfaces-2026-10-30)).
It says what the game should feel like, what every feature UI meets, and how
each world adds its own flavour. The mechanics of tokens, spacing, components and
navigation stay in [UI rules](docs/UI_RULES.md) (UR1-UR82, SUI, RPT); this file
links to them and does not restate them.

Status: the owner and the lines marked **accepted** are Weibao's direction.
Everything else here is a proposal in use as the default (AD32) until he accepts
or changes it. Codes DSG1-DSG19 are new to this file. Every line is a default, a
dial and a reason (AD5); a world or feature can depart from one by saying why.

Target: desktop 1920x1080 first; mobile deferred ([standing priority](docs/USER_VISION.md#standing-ui-priority-2026-10-13)).

## What it should feel like

| Code | Default | Dial | Reason |
| --- | --- | --- | --- |
| DSG1 | **A dense, readable instrument panel you live in.** Proto23's composition is the baseline (**accepted**, UR12): You and the current focus as twin panels on top, inventory, the place and its actions in the middle, and a full-height Reports column kept whole (UR11). Rows are tight hairline rows, not cards in cards. | Panel sizes and docking are the player's (layout settings); a full-screen view takes over only for weighty moments (UR5). | The numbers, the place and what just happened stay in view together, which is what made Proto23 readable ([baseline clarification](docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15)). |
| DSG2 | **Luminous Gothic is the default skin** (**accepted**, [2026-10-29](docs/USER_VISION.md#luminous-gothic-is-the-default-look-2026-10-29)): square frames, navy-to-teal task fields, purple Reports, soft glow on frames and headings, pastel gradient vitals, the bitmap Gothic face at its native strikes with emphasis by colour or case rather than synthetic bold (UR60, UR68). | Neutral and the other Appearance profiles stay one setting away; a player's choice always wins over a world's (DSG16). | One look that grows instead of a dialect per feature ([round 14 VSX1](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-14-2026-10-30-grow-from-the-current-look-and-a-better-build)). |
| DSG3 | **Whimsical and unpretentious in words, vivid in colour, quiet in hierarchy.** Text is short and concrete; colour carries roles (danger, money, bond, knowledge, progress), never decoration alone, and every coloured fact also has a word (UR37). | A world may pick a darker or lighter register of voice (DSG13). | The tone of the [vision digest](docs/VISION_DIGEST.md#what-oops-is); colour roles keep a reskin from changing what red means. |
| DSG4 | **Glyphs as compact tokens.** A CJK glyph marks a kind of subject (人 a person, 兽 an unknown creature, the season in the place header), with its English word beside it on first sight. | Per-world glyph sets (DSG12). | Proto23 already mixes a glyph into its header, and the Gothic face renders them crisply ([identity PX12](docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md#what-proto23s-identity-actually-is)). |
| DSG5 | **Restructure before decorating.** A representation earns a better shape, home or split before it earns ornament; what exists is a draft unless it is genuinely good. | Flourish (DSG12) stays small until a representation is settled. | Weibao, round 13: "dont feel too attached to current ways" ([round 13](docs/audits/UI_DESIGN_CORE_AUDIT.md#round-13-2026-10-30-visual-distinctiveness-and-flair)); AD45. |

## What every feature UI meets

A feature is ready for the main surface when it has all six. Until then it lives
in the Projects drawer (UR2). The contract card (UR76) is where a lane writes these down.

| Code | Requirement | Dial | Reason, and the rules behind it |
| --- | --- | --- | --- |
| DSG6 | **A home.** One declared surface type and place (UR1), registered through `definePanel` (UR8), with in-world logic: who runs it, where, when (UR4). | A throwaway lab view may skip it inside the Projects drawer. | Without a home every system drops a box into Local actions. |
| DSG7 | **A compact glance form.** One row or chip that answers "how is it going" in the always-visible set or its home's header: a value, a meter or a status word, in the world's own form (AD46). | A world with no such system shows nothing (UR82). | The idle player reads at a glance; detail on demand (UR41, UR42). |
| DSG8 | **Details one click away.** The glance form opens the full view through the shared controller with a bottom back bar and Esc (UR9, UR43); compact and full share state, selection and scroll. | Hover may preview; click pins (UR41). | A click never loses the player; one meaning across surfaces (UR74). |
| DSG9 | **An empty state that says how to fill it.** Known-empty, filtered-empty, unavailable and unknown read differently (UR52). | A world may keep a layer hidden until something attaches (UR82). | Blank panels read as bugs. |
| DSG10 | **A reason on anything greyed.** A disabled control shows what is missing inline or on focus, never only in a tooltip (UIV1, SUI5), in the observer's knowledge only. | How much of the cause shows follows what the observer knows; a sealed cause reads "not yet" without the truth. | A player may never hover, and a silent grey button teaches nothing. |

| DSG11 | **One home per fact.** Each player-facing fact (a health total, a hit chance, a threat, how many opponents are left) has one owning place on screen. Other places link to it or show a deliberately different view, a summary with a route to the owner (UR56, UR64), not a second copy. Every view reads the same read model. | A glance header may repeat a fact it needs, such as HP in a versus header, if it reads the same read model and refreshes with the owner. | Copies drift: a 2026-10-30 fight showed opponent health three times, two of them disagreeing (2016/2025 against 2025/2025). Weibao asked for this rule on 2026-10-30, relayed by the repository review session. |

Descriptions inside any of these follow UR70-UR75 (meaning first, numbers second).

## The per-world contract

Each world chooses its own systems and their UI (**accepted**, AD46); Weibao asked
for world flourish and world report text, "not just using the generic ones"
(**accepted**, 2026-10-30). The shared chrome stays shared: controls, focus,
back bars and blocked reasons look the same in every world so nobody relearns the
UI (round 13 FLA5). What a world changes:

| Code | Layer | Default | Dial | Reason |
| --- | --- | --- | --- | --- |
| DSG12 | **Flourish** | The page root already carries `data-world` (the world id, `native` for the frontier, written in `workspace_views.js`); beside it [world_look.js](src/world_look.js) sets `data-world-family` for every world and `data-world-flourish="on"` for families it lists. A flourished family's tokens (accent, header rule, ornament glyph, place epithet) sit in `styles/ui_tokens.css` and its rules in `styles/world_look.css`. Unlisted worlds keep the plain Luminous look. LOTM is the first entry. | A row may set fewer tokens; the player's Appearance overrides it (DSG16); effects off drops the motion. | One hook is the base later skins ride on (PLAN M3); flourish stays off the data layer so contrast never drops (FLA3). |
| DSG13 | **Report voice** | Reports lines that a world names get its own flavour plus the useful part (consequence or next step) from [world_report_voice.js](src/world_report_voice.js), keyed by event kind and world family; otherwise today's generic line. | A world can voice a kind or leave it generic; the useful part is never dropped for flavour. | Weibao asked for "flavour or specific useful text" (PLAN M4). RPT1-RPT12 bind: perceived only, subject first, no canon labels or future, deterministic wording. Flavour carries no sealed truth outside its discovery route. |
| DSG14 | **Vocabulary for types and damage** | Shared mechanism, per-world words: a world declares display names and glyphs for its harm types; undeclared worlds show physical plus the effect types. | Owned by the combat lane (PLAN M6) in `damage_types.js`; this file only fixes that names come from the world. | The same mechanism reads as mystical harm in one world and a curse in another. |
| DSG15 | **Progress form** | Progress shows in the world's own form (a sequence, a report card, a status window, a ledger or none); the LOTM ladder is LOTM's form, not the default (AD46). | Per world and per life. | Progression is any lasting improvement. |
| DSG16 | **Precedence** | Player Appearance > world flourish or skin > Luminous default ([MDL12](docs/audits/UI_DESIGN_CORE_AUDIT.md#refactors-to-plan-for-before-they-get-expensive)). A world leaves the colours the player chose alone. | A player may opt in to letting a world repaint more (a later Appearance switch). | The player owns their screen. |
| DSG17 | **Skins (O2, later)** | A world skin is a token pack keyed by the same `data-world` hook: frame, fill, line, ornament, glyph set, motion signature (FLA2), reviewed in the gallery before it ships (FLA6). Priority is low now and important later (**accepted** ranking). | Each pack carries a size budget (FLA4). | Skins become data, not per-feature CSS (UR6, UR12). |
| DSG18 | **Diegetic UI (O3, later)** | A world-shaped surface (a newspaper, a status window, a sect jade slip) replaces a generic panel only after that world's basic kit (DSG19) is working, and keeps a plain text form. | Per world, one surface at a time. | Weibao: "we need the most basic Ui working for each world" first. |
| DSG19 | **The basic kit** | Every playable world answers six questions on screen: where I am, what I can do, my progress in the world's form, who is here, what happened in the world's voice, and how a fight looks. The [kit census](docs/audits/WORLD_UI_KIT_CENSUS_2026-10-30.md) marks each world's cells working, generic or missing. | A world without fights marks the fight cell "none by design". | The O3 gate; also the checklist for a new world's first UI slice. |

## Where to look next

- Tokens, spacing, heights, layers and type roles: [UI rules](docs/UI_RULES.md#small-detail-tokens-2026-10-22) UR6, UR65-UR68.
- Scenes, travel and Reports lines: [scene and report rules](docs/UI_RULES.md#scene-and-report-rules-sui-rpt).
- The history behind these lines: [identity round](docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md), [foundation round](docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md), [UI design core audit](docs/audits/UI_DESIGN_CORE_AUDIT.md) rounds 10-14.
- Change this file when the look's direction changes; record Weibao's words in USER_VISION first.
