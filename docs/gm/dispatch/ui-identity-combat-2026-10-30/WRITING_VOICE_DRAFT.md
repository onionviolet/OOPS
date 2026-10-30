# Writing voice: draft section for DESIGN.md

**Status: proposal (AD32), 2026-10-30, not human-reviewed.** Written for the `ui-identity` lane to fold into DESIGN.md; this file does not create or edit DESIGN.md. It adds no new style. Each rule below already exists somewhere in the repo and is cited; the two places where nothing exists yet are marked **gap**. Plan items: [M4 report voice, M6 damage type names](PLAN.md).

## How player-facing text reads (default)

Default: say what the thing is and what it changes for this character, in one or two short sentences, then the mechanics, then the numbers (UR70, UR71). Dial: a deliberate reading surface (a scene card, a book page, a note) may run longer (UR70). Reason: the first line is what a tooltip, a row and a screen reader all show, so it has to carry the meaning on its own.

| Surface | Reads like | Rules to cite |
|---|---|---|
| Item, trait, skill, condition and action descriptions | Meaning and practical effect first, restrained world-appropriate voice, concrete verbs; then current effects, costs and duration; then a labelled breakdown on request | UR70, UR71, UR72, UR74; checked by `npm run check:descriptions` (an inventory of flags, not a quality score) |
| Terms and ratings | A short explanation where the term affects a choice; says what higher or lower changes and whether a change is percent or percentage points | UR75, UR40 (a chance names both sides) |
| Log and report lines | Subject first, compact: who, did what, result, place if it matters; the log line is the receipt for a settled event | UR44, RPT3, SUI11 |
| Names inside lines | Names as the player knew them when the line was written ("a tall officer" until introduced); a historical line keeps what was known then and does not silently resolve to a current item or person (default; the reason is that old lines must stay true to their time) | RPT4, UR48, AD8 |
| Hints and refusals | An unavailable action names what is missing and what would fix it; a refusal that exists for the engine alone, by default ("another world, actor or body", the unnamed "required knowledge, means or circumstances") is hidden, not shown | UR73, UR82, SUI5, ECR32; `src/player_reasons.js` and its test |
| Stops and absences | One note line says what happened and why; when nothing happened the note says so | UR81, RPT6 |
| Scene cards | First line states what is at stake for you in one sentence; mechanics follow; every line is our wording built from state | SUI9, SUI1 |
| Developer text | Evidence labels, ids, locators, fill notes, stored-field caveats and pipeline terms stay out of play text (they live in the inspector and developer docs) | UR73, RPT11 |

Wording that varies: routine report lines draw from the world's texture rows keyed by place, band and day, so a reload reads the same and different days read differently (RPT12, WA37). Repeats fold into one line instead of repeating (RPT5, UR64).

## Per-world terms

Default: the mechanism is shared and the words belong to the world. Each world chooses its own version of each system, its UI and its vocabulary; no world is the template (AD46). Dial: a world with no term of its own falls back to the generic word, so an undeclared world reads as it does today.

- **Fallback chain (proposal).** world term, else the generic term, else the plain engine name. Nothing in the chain is saved, so adding a world's words needs no migration.
- **Damage type display names (plan item M6).** A world declares, for each type it uses, a display name, an optional glyph and a short phrase for the log. Undeclared worlds keep `physical` plus the effect_dsl types (acid, bludgeoning, cold, fire, force, lightning, necrotic, piercing, poison, psychic, radiant, slashing, thunder) under their generic names. Two worlds can name the same type differently (for example mystical harm in one world and a curse in another); the type id the engine uses does not change. The words follow UR70 (plain, concrete) and the log note words stay "resisted", "weak spot" and "no effect" unless a world supplies its own (CBD3 in the [combat palette](../../../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md)). **Gap:** no world declares display names yet and `src/damage_types.js` carries only ids; the table, its home in world data and its test are the combat lane's work.
- **Where canon words live.** Canon people, names and beats never land in tracked `src/` or `tests/` (CLR3, AD1). A canon world's damage-type words, report lines and flavour live in its private pack; tracked code carries the generic fallback and original-world rows. A canon world is first-class at the same dial, so its words are data, not code.
- **Report voice (plan item M4).** One table keyed by event kind and world; each row gives flavour plus the useful part (consequence or next step); a missing row falls back to today's generic line. It follows RPT1-RPT12: reuse the existing kinds (RPT1), what the player perceived, at its witness level (RPT2, SUI3), no canon labels and no future (RPT7, SUI4), written once by the settling event (RPT8), no developer text (RPT11). **Gap:** `reports_dock.js` and `report_repeats.js` have no world voice today.
- **Progress in the world's own form (AD46, plan item M5).** Words for ranks, currencies, institutions and meters come from the world; the number underneath is still exact for the player's own stats (AD8).
- **Per-world flourish is opt-in presentation.** A flourish may colour or decorate a line; by default it does not change or hide the fact the line states, because color alone must not carry a fact (UR38, UR37).

## Sealed secrets and flavour

Standing rule: world secrets are sealed by default; flavour text never shows a secret's truth outside its discovery route, and writers refer to secrets by ID, route and status in chat, reports, indexes and commit messages ([AGENTS.md](../../../../AGENTS.md#sealed-secrets), [the discovery doc](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10)).

- Flavour can express what the character believes, clearly qualified; it cannot establish an effect or reveal a sealed truth (UR72).
- Test a line before it ships: would a character who has not found the route write this sentence? If not, the line leaks. This is RPT2 and AD6 applied to writing.
- Overlays, reader dials and debug lenses filter the player projection; sealed outcomes appear by ID and status (UR80).
- Reports never say what a book did or will do; the opt-in "what the book did" overlay is the home for that, by default (RPT7, SUI4). Book text stays out of the log; quoted text belongs on a scene card or description, and a private-pack world may show one short marked quote for a scene the player was present at (RPT10, SUI1).
- Damage-type names, rank words and item names are not secrets by default, but a name that would reveal a sealed property (a curse the player has not found) is the property's truth and follows the same route.

## Existing checks and where this meets code

- `npm run check:descriptions` inventories descriptions and mechanical flags; it does not judge voice. [Latest inventory](../../../reviews/DESCRIPTION_LINT_2026-10-26.md).
- `tests/player_reasons.test.js` fails on an unregistered engine-refusal string.
- Rule index rows: UR1-UR75 are binding (UR76-UR82 are proposed, in use as the default); CLR, SUI and RPT are binding defaults ([RULES_INDEX](../../../RULES_INDEX.md), [UI rules](../../../UI_RULES.md)). Note for the folder: AGENTS.md still says UR1-UR69, GROUND_RULES cites UR70-UR75 and RULES_INDEX says UR1-UR75; the index is the current register.

## Open for the DESIGN.md author

- **Q1.** Where the per-world term table sits next to the M3 `data-world` hook and token table, so one lookup serves flourish and words.
- **Q2.** Whether the generic damage-type names get one sentence each in the fight surface, or on hover alone (UR43; default, with the reason that critical facts do not depend on hover).
- **Q3.** Humour and intensity are dials with a text equivalent (UR62); the voice section can point there instead of restating them.
