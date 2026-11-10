# World kind rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("foundational implementation rules for types of worlds and more? also types of source?", [log](gm/USER_VISION_LOG_2026-11.md#world-kind-and-source-kind-rulebooks-2026-11-10)); the canon-first order was added after his follow-up ([log](gm/USER_VISION_LOG_2026-11.md#canon-first-building-and-calibration-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers how a kind of world (cultivation, occult mystery, magic academy, time loop, system apocalypse, death game, expedition hub, cyberpunk, ordinary life and the rest) becomes engine data: presets over the shared world axes, composition of several kinds, the minimum kit every world registers, how far a world is built, and how worlds of different kinds meet. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

What Weibao has said: many mechanically distinct worlds are his direction (PROJECT scope); worlds set their own rules (Rulebook 2–3); everything is possible, reasonably (AD5); things work by how they work (AD38); a second world validates a seam (AD51); limits are adjectives per world (AD22).

Owners and neighbours (linked, not restated): Rulebook 2–3 in [RULES_FROM_SCRATCH](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10); [WORLD_ENTRY_RULES](WORLD_ENTRY_RULES.md) WER1–WER17 (starts and crossings); [WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md) WA1–WA68 (turning a source into a pack); [GENERATION_FOUNDATION_RULES](GENERATION_FOUNDATION_RULES_2026-10-14.md) GR1–GR17; [WORLD_PASS_RULES](WORLD_PASS_RULES.md) (how a pass runs); [SOURCE_KIND_RULES](SOURCE_KIND_RULES.md) SKR (what a source is). Palettes: [multiverse structures](worlds/MULTIVERSE_STRUCTURES.md) (cosmologies, styles, coverage stages), [genre sweep](RESEARCH_GENRE_SWEEP.md), [world dials considerations](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) (WDI), [world core kit](worlds/WORLD_CORE_KIT_2026-10-14.md), [completion standard](WORLD_COMPLETION_STANDARD.md). Code: `src/world_pack_manifest.js` (`WORLD_AXES`, `PACK_KINDS`, `PACK_ROLES`, `AUTHORITY_MODELS`, `LICENCE_TIERS`, `COVERAGE`, presets), `src/world_pack_registry.js`, `src/world_pack_loader.js`, `src/world_society_sheet.js`; the [area guide](AREA_GUIDE.md) "World packs and story windows".

## Terms

| Term | Means |
| --- | --- |
| Axis | One of the thirteen independent world axes in `WORLD_AXES`: cosmology, law, resolution, progression, scale, time, lifeDeath, metaphysics, canonCourse, persistence, tone, society, being (P9M1a–m) |
| Kind | A named preset of axis defaults, plus the shared seams that kind usually leans on. A label for authors, never a code branch |
| Origin | Where a world's content comes from: `canon`, `original`, `generated` or `hybrid` (`PACK_KINDS`) |
| Role | Where a pack sits: world, series, cosmology, multiverse, cluster, universe, rulebook (`PACK_ROLES`) |
| Coverage | How far a family or region is built: background, inspectable, playable (`COVERAGE`) |

## Kinds as presets

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| WKR1 | **A kind is a preset, not a type.** A kind fills axis defaults; every axis stays overridable by the world. | Default: a kind is a `provides.presets` entry (`id`, `label`, `axes`) in a pack manifest, and a world names it in `preset`. Readers read axis values and mechanism facts, never the preset id. Dial: a world may override any axis it inherits. Reason: real worlds mix kinds (LOTM is an occult mystery, an industrial city and a pathway ladder at once), and a reader keyed on "cultivation" breaks the first cultivation world that differs. | AD38, WDI12, P9M1 |
| WKR2 | **Worlds compose several kinds.** A world may name more than one preset. | Default: presets apply in the listed order and fill only axes still unset; the world's own axis values win; a clash between two presets is a diagnostic the world answers by setting that axis itself. Dial: per world. Reason: "both, depending on the world" (AD5); a magic academy inside a time loop is one world, not two. | WKR1, `axes` merge in the manifest |
| WKR3 | **(restates) Cosmology, coverage and persistence are separate decisions.** A genre label settles none of them. | A one-town assignment can sit in a planet-sized world; a tiny realm can be permanent; reset does not follow from "tower" or "trial". | [Multiverse structures](worlds/MULTIVERSE_STRUCTURES.md#three-independent-decisions) |
| WKR4 | **Origin decides how gaps are filled.** | Default: `canon` fills gaps with labelled generated or authored rows (WA8) and keeps source facts unknown until found; `original` states its laws as world law written by Weibao or as labelled agent proposals; `generated` follows the GR contract with seed and revision; `hybrid` declares origin per family. Dial: per family inside a hybrid. Reason: the same missing price means "unknown to us" in a book world and "not decided yet" in an original one. | WA8, GR1–GR17, SKR3 |
| WKR5 | **The kind catalogue is a palette.** The [kind table](#kind-palette) lists illustrative kinds with their usual axis values, the seams they lean on and the trap to avoid. | Default: a new world picks the nearest kinds as starting presets and edits from there. Dial: add a kind when a world needs one the table lacks. Reason: idea docs are palettes, not specs. | AGENTS design framing |

## What every world registers

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| WKR6 | **A minimum kit, in existing modules.** A world that the player can enter registers into the shared readers instead of writing its own. | Default kit: manifest with axes and origin; calendar profile in `world_calendar_content.js` (TMR2); naming sheet in [WORLD_NAMING_SHEETS](names/WORLD_NAMING_SHEETS.md) (NMR); report voice (`world_report_voice.js`); look (`world_look.js`); a society sheet row (`SHEETS` in `world_society_sheet.js`); at least one start on the one start list (WER); climate where the world has outdoors (`world_climate.js`); one host registration line per consumer (AR18). Dial: a background world stops at manifest and naming sheet. Reason: each reader already exists; a world that skips one gets a generic voice or a missing calendar. | AR18, TMR2, NMR, WER |
| WKR7 | **Coverage is per family and region.** | Default: a world records coverage per family (people, sites, institutions) and per region, so one district can be playable while the rest is background. Dial: per region. Reason: design can sketch the whole setting while one connected slice deepens (multiverse structures, visits and coverage). | `COVERAGE`, WA22 |
| WKR8 | **(restates) A second world validates the seam.** A seam first built for one kind is a first use; a world of a different kind proves it shared. | AD51, FND5. |
| WKR9 | **New worlds use the intended builders.** | Default: definitions go in a plain-data world pack (`world_pack_*`); story windows start from `windowKit` in `window_chain.js`; structured packs (`structured_pack_*`) hold simulation commands and once-only acts. Dial: an existing world keeps its window shape until a slice touches it. Reason: three window shapes and two pack loaders compete today (area guide "Competing"); a new world should not add a fourth. | AREA_GUIDE, AR9 |
| WKR10 | **Each kind in use has a fixture world.** | Default: for each kind a shipped world uses, one small test manifest carries that preset, and shared readers are tested across those fixtures by axis value. Dial: add a fixture when a second world of a new kind lands. Reason: kind diversity is what breaks shared readers; testing against one world hides it. | AD51, AD36 |

## Axes a kind usually sets

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| WKR11 | **The power ladder's shape is a dial.** Ranked realms, pathways with sequences, classes and levels, skills only, items and gear, bloodlines, or no ladder. | Default: the kind proposes a shape on the `progression` axis; abilities and gates own how it runs. Dial: a world mixes shapes (a cultivator with gear). Reason: the same evaluator handles every shape (GTR, ABR). | GTR1–GTR35, ABR1–ABR22 |
| WKR12 | **Technology, magic visibility and density are axis values.** | Default: `metaphysics` carries magic density and how it works; `society` carries technology era and whether magic is hidden, known to an elite or public. Readers use them for prices, institutions and what strangers believe. Dial: per region (a hidden-magic city beside a public-magic school). Reason: "what does a passer-by know" decides half of an occult world's play. | KNW1, STN6, ECR |
| WKR13 | **Kind-shaped clocks are schedules.** Loops, tournaments, school terms, harvests and countdowns run as schedules, and as deadlines only where the source protagonist faces one. | Default: a cycle world declares its reset domain, trigger and what the traveler keeps (multiverse cycles row). Dial: per world. Reason: Weibao, 2026-10-27, schedule rather than deadline. | TMR rules, STY |
| WKR14 | **Tone is an axis.** Horror, grimness, comedy and quiet ordinary life live on `tone` and change text, presentation and stakes shown. | Default: forgiving recovery holds under every tone (AD19); a world may harden it with an in-world reason (AD22). Dial: per world and per region. Reason: a horror world and a slice-of-life world share the same recovery floor unless a world says why not. | AD19, AD22, PRS |
| WKR15 | **A world with an in-fiction system shows it as world content.** Status windows, quest prompts and levels that exist inside the story render as a diegetic surface reading the same stores. | Default: the numbers are the world's, shown through its skin (DSG); the engine's own panels stay separate. Dial: per world; a world may merge them. Reason: an apocalypse world's system screen and LOTM's lack of one are both world facts. | DSG skins, ABR |
| WKR16 | **Scale is an axis, and off-screen detail names its resolution.** | Default: `scale` from settlement to cosmos; each region names whether off-screen life is authored background, an aggregate or actual actors. Dial: per region. Reason: no pretend global simulation (multiverse structures, visits and coverage). | SR, GR17 |

## Worlds meeting

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| WKR17 | **Each crossing edge names whose rules apply.** | Default: `place` for local mechanisms, while what the body or mind carries keeps its home rules unless the crossing says otherwise; `traveler`, `raw`, `equalized` and `dominant` are the other models (`AUTHORITY_MODELS`). Dial: per edge. Reason: a cultivator in a gun world keeps their qi but the gun world's air may not feed it. | WER9, WDI14, P9M3 |
| WKR18 | **(restates) Converged worlds declare the merge.** A merge event, real ownership and history conflicts, and no automatic winner among laws unless a dominant law is declared. | [Multiverse structures](worlds/MULTIVERSE_STRUCTURES.md#cosmologies-to-compose), converged row. |
| WKR19 | **A new kind earns a world with depth.** A new kind gets its own sources or declared rules, local people, resources and progression before it gets a build packet. | Default: deepen existing worlds and scout different kinds in parallel. Dial: a quick variant of an existing world may reuse its kit with a stated difference. Reason: ten shallow reskins add registrations, not play (multiverse structures, other styles). Held for Weibao as LLR31. | Multiverse structures |
| WKR20 | **Generated worlds record how they were made.** | Default: a generated world stores its seed, preset `id@rev` and generator revisions, and what the player has seen freezes (GR3, GR10). Dial: a deliberately rerolled world declares a new identity. Reason: a world must stay the same world across a reload. | GR1–GR17 |
| WKR21 | **Canon worlds first; presets come out of them.** A kind's preset is extracted from a world that is built through its lead's life and calibrated against its canon, then a second world of that kind confirms it. | Default: until then the preset is a draft that only its first world reads; an original or non-lore world of that kind borrows the calibrated world's anchors and says so (SPR13 borrowed). Dial: a kind with no canon world yet (an original idea) starts from declared rules and its nearest calibrated kind. Reason: Weibao, 2026-11-10, "first building things/calibrating them against cannon first"; AD44, AD49 and AD51 already put the lead's life and lore anchors before generalizing. | AD44, AD49, AD51, SPR7–SPR22 |

## Kind palette

Illustrative, not a build list. Axis values are typical starting presets; any world changes them.

| Kind | Usual axis values | Seams it leans on | Trap |
| --- | --- | --- | --- |
| Cultivation, higher realms | progression: ranked realms; metaphysics: dense, absorbable; lifeDeath: long lives; scale: valley to heavens | GTR gates, LVR resources, MR pills and arrays, TMR long time | Realms as a bare number; ascending deletes the old world |
| Occult mystery, pathways | metaphysics: hidden; society: industrial city; progression: sequences with madness | KNW (what is secret), MND (loss of control), AGT (gods), STN churches | Reveals the player cannot reach by any means |
| Magic academy | society: school; time: terms; progression: classes and grades | TIE classmates, SLR lessons, STN houses and ranks | Every day a lesson; nothing outside the walls |
| Time loop, regression | cosmology: cycle; persistence: memory kept, world reset | KNW memory, TMR cycle clock, STY divergence | Reset that silently keeps or drops things |
| System apocalypse, tower | resolution: in-fiction system; progression: levels and classes; tone: grim | WKR15 diegetic system, CBR, GTR, LVR salvage | Only fights; repair, households and supply forgotten |
| Death game, arena | society: spectators; time: countdown; tone: grim | STN audiences, CBR, TIE alliances, STY sponsors | Treating the arena as the whole world |
| Expedition hub, portal network | cosmology: network; role: cluster | WER crossings, ECR cross-world value, missions | Issuer goals mistaken for destination truth |
| Martial, military | society: ranks and units; progression: training and gear | STN posts, LVR pay, CBR, BHR injury | Rank as power (STN8 lets them diverge) |
| Science fiction, cyberpunk | society: corporate; metaphysics: none or tech; progression: implants and gear | ITM gear, ECR debt, BHR implants, STN heat | Tech as reskinned magic with no supply |
| Ordinary life, historical | metaphysics: none; tone: quiet | LVR jobs, TIE, ECR, TMR seasons | No progression; nothing to want |
| Nonhuman majority | being: nonhuman; scale: varies | BHR bodies and senses, nonhuman starts specs | Humans with a different name |
| Superhero, conceptual powers | metaphysics: conceptual; society: public protectors | ABR conceptual abilities, STN identity, KNW secret identity | Difficulty only from bigger numbers |

## Open details

- Which presets ship first: proposal, the kinds of the worlds already in packs (LOTM, HP, MoL, Gu, Paradise) as fixtures (WKR10).
- Whether a kind also ships default dials outside `WORLD_AXES` (meter sets, report voice defaults): proposal, yes through the same `provides.presets` entry once a second reader needs it.
- A kind lint (readers branching on a preset id): proposal, add to `check:rules` when a first violation is found.
