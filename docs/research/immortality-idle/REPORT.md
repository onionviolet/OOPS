# Immortality Idle: source audit, 2026-10-13

Type: RESEARCH. Proposals here are not accepted decisions.

**Answer first.** Immortality Idle's best lesson for YAIR is that ordinary days do double duty. A blacksmithing day also runs the anvil you loaded. A life's gains decide where the next life starts. The family keeps the trade you practised most. Every lifespan source has a name. These change everyday play inside one life, and each maps to an existing YAIR owner (F1-F5). Challenge runs, generated family techniques, rule-bound hells and megaprojects are good later world adjectives but need more seams (F7, F11-F13).

Labels: **verified in source** = read in the pinned code; **verified in YAIR source** = read in this repo; **inferred** = judgment. Locators in [FINDINGS.json](FINDINGS.json).

## Source and license

| Field | Value |
|---|---|
| Repository | https://github.com/immortalityidle/immortalityidle.github.io |
| Live site | https://immortalityidle.github.io/ (classic build `/classic/`, older `/old/`) |
| Pinned commit | `c7231bae717b67a8e4dba2a3775d58bfbfadbdd6`, main, 2026-10-13 12:34:57 -0600 |
| Version | package.json 2.0.0; Angular |
| License | No LICENSE file; GitHub API reports none. README grants informal permission (use freely, keep derivatives open). Not an OSI license. Do not copy code; reimplement ideas with original names, numbers and text, credit as inspiration, ask the author before any code reuse. |
| Local copy | Session scratch only (shallow, read-only, nothing installed or run) |

Permalink base: `https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/game-state/`

## Ranked findings

| Code | Finding (verified in source unless marked) | YAIR today (verified in YAIR source) | Novelty |
|---|---|---|---|
| F1 | Workstations fire when you do their activity (home.service.ts#L1860-L1870; called from activity.service.ts#L383-L391). An anvil with 10 metal makes a weapon each Blacksmithing day; grade = material + 5x station power + log10(lore) + activity level, plus gem and extra materials (createEquipment #L2347-L2426). Stations have setup and daily upkeep and use home slots (#L109-L133). | Manual crafting gated by location (`src/models/location.js` LocationCrafting L33, `src/crafting_recipes.js`); authored rack/bench projects (`src/home_furnishing_host.js`). Nothing runs as a side effect of work. | new |
| F2 | Aptitude += (value at death - value at birth) / divider, never falling (character.service.ts#L1203-L1241). Next life starts at 1 + aptitude/10 (#L1243-L1256). Gain multiplier is a piecewise diminishing curve (#L1421-L1478). Soul Core and Meridian ascensions tune keep-rate and curve (#L1006-L1062). | No aptitude carry; heir gets one lesson (`src/chronicle.js` createHeirChronicle L273). Increlution P3 and `docs/LIFE_SIM_NORTH_STAR.md` L1529 cover the direction. | partial |
| F3 | Schedule loop of activities with repeat counts; skips locked entries; pauses when nothing can run (activity.service.ts#L346-L511). Named saved loops; threshold triggers swap plans at a money/stat value (#L748-L772); trigger 0 loads at rebirth (#L1184-L1238). Parallel qi-paid spirit activity (#L823-L842). | One single-command routine per actor (`src/simulation.js` setSimulationProgram L319-337); one fixed itinerary (`src/feature_expansion_work_plan.js` L272). | partial |
| F4 | Lifespan = base + food + alchemy + aptitude + spirituality + hygiene + magic, listed in a tooltip (character.service.ts#L652-L667, #L953-L994). Food lifespan capped at food value x 365 days, max 20 years (inventory.service.ts#L1685-L1722). Distinct death causes (#L873-L946); opt-in pause the day before old age (activity.service.ts#L357-L368); life summary with aptitude gains. | Fixed lifespan 80, start 18, last-year note (`src/chronicle.js` L73-L116); life stages (`src/life_experience.js` L9-L10). No extension sources or pause before death. | partial |
| F5 | Most-practised of six crafts becomes familySpecialty, +20% income next life (activity.service.ts#L1184-L1199). One open apprenticeship per life locks other gated trades until finished; finished ones stay open forever (#L1034-L1043, #L1253-L1276). | No per-life trade commitment or family trade. | new |
| F6 | Bloodline ranks widen carry: heirloom weapons, armor, money, money with interest, station materials, followers, daily aptitude growth; each rank's text states its carry (store.service.ts#L133-L180). | Rebirth reset domains (`src/simulation.js` L565-607); open-idle P4 operation card. | partial |
| F7 | Avatar challenges store the main save inside a restricted run (game-state.service.ts#L1412-L1645). Returning restores it, adds this run's attribute gains, keeps higher concept values, grants a permanent unlock (#L1647-L1710). | No challenge runs; ChallengeZone is fixed fights (`src/models/location.js` L396). | new |
| F8 | Closed time banks at 1/10; load always pauses; player opts to spend the bank (main-loop.service.ts#L160-L190). Life never runs while closed. | open-idle P6 candidate. | covered |
| F9 | Followers age out; a child takes the job at half power; assignment presets switch on thresholds (followers.service.ts#L1308-L1345, #L2117-L2165). | NPCs age and have family (`src/npc_lives.js`); no follower jobs or succession. | partial |
| F10 | Concept graph: two mastered concepts reveal a third; hidden ones show "Tao of ????" naming known prerequisites, ???? for unknown; gating concepts hint at more (contemplation.service.ts#L705-L786). Persists across lives. | Hidden skill names (`src/models/skill.js` L12); no combination graph. | new mechanism |
| F11 | Family techniques generated from combat experience, grow per use, inherited, archivable; player can block prefixes/effects to steer rolls (battle.service.ts#L1384-L1481, #L1483-L1528). | One authored staged technique (`src/techniques.js`). | new |
| F12 | Hells are rule zones: entry stash, daily penalty, restricted actions, hint, success check (hell.service.ts#L14-L30). Mountain of Knives damages by lifetime kills (#L1362-L1384). | Per-realm rules seam (`src/pocket_realm_rules.js`). | new |
| F13 | Impossible tasks declare persistence: the tower keeps bricks across lives; the swim resets even when you surface (impossibleTask.service.ts#L208-L222, #L313-L327). | Site projects keep facts (`src/site_projects.js`); no cross-life split. | new |
| F14 | About 40 manuals sell automation: remembered plans, auto-sell/use with reserve, auto-eat, auto-rest, autopause (item-repo.service.ts#L2947-L2976). 130 achievements open panels and add 2% gain each (achievement.service.ts#L230-L330). | Titles with 2% bonuses (`src/titles.js`); auto-consume favourites (`src/main.js` L7278-7292); Increlution P2. | partial |
| F15 | Stamina under 0 costs 5 days; qi under 0 costs 10 days and 1 max qi; auto-rest turns a short day into Rest and logs why (activity.service.ts#L774-L821, #L440-L456). | Stamina is a vital only. | new |
| F16 | 22-tier home ladder with upkeep; unpaid upkeep sends thugs (home.service.ts#L1402-L1445). Bagua furniture scoring by subtype, color, element (#L1750-L1783). | Housing is sleep only (`src/models/location.js` L17). | new |
| F17 | Save is `ii2` + base64(JSON) with per-service default filling, no version; storage key adds the deployed branch (game-state.service.ts#L526-L620, #L1362-L1394, #L1712-L1726). | Versioned migrations and guarded envelope (`src/main.js` load L5176, `src/save_files.js`). YAIR ahead. | covered |
| F18 | Desktop 100-column draggable grid, lockable, per-panel help, new-panel indicator, separate mobile layout (standard-layout.component.html#L123-L207); reviewable illustrated memories (achievement.service.ts#L2262-L2291). | Workspace grid (`src/workspace_layout.js`). | small touches |
| F19 | Activities tagged yin/yang; a balanced mix boosts health bonuses and caps (character.service.ts#L1387-L1406). | None found. | new, small |
| F20 | Inferred: the exponential constants suit a number-go-up idler, not YAIR's lived pacing. Borrow structures, not numbers. | | assessment |

## Contradictions and friction

- F2/F6 vs YAIR's heirs and random births: Immortality Idle always reincarnates the same person in the same town. Its carry is a mechanic, not an heir simulation. Carry rules stay per world.
- F8 vs Increlution: here closed time never spends life; Increlution's catch-up can kill. Both are world adjectives; neither settles YAIR's offline policy.
- F14: manuals gate QoL behind money. YAIR prefers automation earned by familiarity; a manual can be one carrier (a written method a world sells or teaches).
- F17: default filling is the only migration. Keep YAIR's versioned migrations.

## New versus earlier lanes

Covered elsewhere: career ladder and simple routines (open-idle P1/P2), operation card (P4), offline banking (P6), follower assignment (P8), earned automation and practice-versus-carry (Increlution P2/P3), preparation and memory (Tale of Immortal, ACS). New here: F1, F2 formula, F3 triggers and rebirth plan, F4 ledger and food ceiling, F5, F7, F10, F11, F12, F13, F15, F16.

Checks: static source reading only. Not run, no browser play, no YAIR edit, build or commit.

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Small touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Coverage: [CHECKPOINT.md](CHECKPOINT.md).
