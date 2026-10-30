# UI identity and combat wave (2026-10-30)

Weibao's direction: [USER_VISION](../../../USER_VISION.md#ui-identity-per-world-basics-and-combat-surfaces-2026-10-30). Coordinator: the chat that asked "did much work get done from the parallel stuff" and ran this round. Everything a lane designs is a proposal (AD32) until Weibao accepts it. Rules: UR1-UR75, RPT1-RPT12, AR1-AR16, AD36, AD43, AD45, AD46.

Target viewport 1920x1080 (desktop first). Mobile deferred. F2 (feature UIs for below-floor slices) is not owned here: it waits for `bk-land` (`local_55a48d74`) and `floor-wire` (`local_97d3526c`).

## Starting findings

- F1. No single owner for the look. UI_RULES covers tokens, spacing and type (UR6, UR12, UR65-UR68); the identity sits in about ten dated audits, chiefly `docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md`, `docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md` and `docs/audits/UI_DESIGN_CORE_AUDIT.md`.
- F3. Two combat surfaces: the native Proto23 panels (`src/ui/combat_display.js`) and the tempo road contest, a plain `<details>` text panel (`src/tempo_fight_domain.js:80`). The versus row (`src/ui/combat_versus.js`, docs/representations/COMBAT.md round 2) feeds only the native side.
- F4. `src/damage_types.js` (weapon mix, armor protection, per-type defender multiplier) is read only by `combat_math.js` and `models/combat.js`. The tempo engine has no damage types.

## Round 1: more to consider (2026-10-30)

Codes M1-M10 are new to this round.

### ACCOUNT FOR NOW (constraints the lanes carry)

- **M1. Damage types come from `damage_types.js`, called by each fight definition; the frame stays structural.** `src/conflict_frame.js` says definitions own effects and settlement, and it runs the three pre-frame battles in a legacy mode whose draw count is part of the saved replay contract. So no harm step goes into the frame. The tempo definition calls `typedStrike` (or a sibling export in `damage_types.js`, the one authority, AR3). Other frame users (`native_battle`, `party_battle`, `feature_expansion_battle`, `cast_ability_adapter`) opt in per definition where the census (M9) says so; `pursuit`, `cohort_battle` and `field_care_battle` are off the frame. Checks: native fights, which already type through `combat_math.js` and `models/combat.js`, are not typed twice, and legacy replays stay identical.
- **M2. Combine the presentation, not the engines.** Recommended default: one fight surface with a shared header (the versus row and threat chips), one log and one move area. The native auto-fight and the tempo contest become two modes of that surface, chosen per world and encounter (AD46). One read model feeds it (extend the `combat_situation` / opponent projection, do not fork). The combat lane weighs this against at least one other form before building, as UR rules and AGENTS design framing ask.
- **M3. No per-world hook exists on the page.** Nothing sets `data-world` (or similar) on the root, so per-world flourish and skins have nowhere to attach. A single hook plus a per-world token and flourish table is cheap now and is the base O2 skins ride on later. Save-neutral: it reads the current world, stores nothing.
- **M4. Report lines need a per-world voice with a generic fallback.** `reports_dock.js` and `report_repeats.js` have no world voice. Proposed: a table keyed by event kind and world, each row giving flavour plus the useful part (consequence, next step), falling back to today's generic line. It follows RPT1-RPT12 and stays sealed-secret safe (no truth in flavour outside its discovery route).
- **M5. A basic world UI kit before diegetic UI.** Weibao's gate for O3: every world first gets the basics working. Proposed kit: where I am, what I can do, my progress in the world's own form (AD46), people, reports in the world's voice, and a fight surface. A per-world census marks each row as working, generic or missing.
- **M6. Damage type names are per world.** The mechanism is shared; the words and glyphs come from the world (for example mystical harm in one world, a curse in another). Types are declared with display names, and undeclared worlds keep physical plus the effect_dsl types. Nothing is saved, so no migration.
- **M7. Make it inspectable.** A dev readout of the type split per hit, and a fixture fight in the preview gallery (`src/ui/preview/fixtures/combat.js` exists) showing both modes.
- **M8. Collisions with running sessions.** `floor-wire` is the single writer for `src/simulation.js`, `src/domain_registry.js` and `src/book_world_lotm_*`; lanes send it patches. `bk-land` is merging book-wave branches, so the combat UI rebases after it lands. Uncommitted edits on primary master sit on both lanes' files (RECON_LEDGER section 5): the tempo and combat files (`src/tempo_fight*.js`, `combat_math.js`, `models/combat.js`, `enemies.js`, `ui/combat_display.js`, `tests/tempo_fight.test.js`) are RC44, likely `p4-fights` (`local_26a3b19b`); `style.css`, `styles/*.css`, `ui_polish.js` and the gallery are RC47, likely the GenUI / `ui-defects` wave. Each lane works in its own worktree, asks that owner to commit or confirm first, and rebases onto the owner's commit; it never edits those files on primary master. Edit shared docs hunk-only.

### LATER / DELEGATE

- **M9. Merge census (inside the combat lane).** List other old/new pairs that drift: native vs tempo combat, pursuit vs the tempo chase, `away_ledger.js` and `anchor_snapshots.js` (built, imported by nothing) vs the away bank, return digest vs the reports dock. Done when the lane's doc has one row per pair with keep, merge or retire as a proposal.
- **M10. Later depth.** Per-world skins as token packs (O2); diegetic world UI (O3) after M5; morale and wound stages on the versus row; a detachable combat feed.

## Lanes (Opus, as Weibao asked)

| Lane | Owns | Delivers | Done check |
| --- | --- | --- | --- |
| `ui-identity` | `DESIGN.md` (new), M3 hook, M4 report voice table, M5 kit census, and their UI_RULES / RULES_INDEX rows | DESIGN.md as the one owner of the look (identity, Proto23 composition, Luminous Gothic, feature-UI requirements, per-world flourish and report voice contract). One world (LOTM) shows its own flourish and report lines in the browser; the rest fall back. Kit census for every playable world. | DESIGN.md linked from AGENTS/UI_RULES; RULES_INDEX row; 1920 browser proof of LOTM flourish and a world report line with generic fallback elsewhere; focused tests; `check:rules` |
| `combat-surface` | `src/damage_types.js` and the tempo definition's harm call (frame untouched), tempo fight UI, `combat_versus` / situation read model | M1 types through the frame (tempo first), M6 per-world type names, the combined fight surface (M2) after weighing forms, M7 inspector, M9 census | Focused tests for typed harm in tempo and one other frame user; 1920 browser proof of a tempo fight showing types, versus row and log with save, reload, import; census table in its doc |

The combat lane builds UI against the DESIGN.md draft once `ui-identity` sends it. Until then it does the engine side (M1, M6) and the form choice.

## Lane receipt: `ui-identity` (2026-10-30)

Implemented, below floor (AD43): FLR4 holds for the flourish and arrival voice. The M5 census has unchecked rows, and LOTM work writes no Reports line to voice (census K1). Agent-verified, not human-reviewed.

- Correction to M3: a root hook already existed. `workspace_views.js` writes `data-world` with the world id, or `native` for the frontier. The lane added `data-world-family` and `data-world-flourish` beside it rather than a second writer.
- DESIGN.md DSG1-DSG19, linked from AGENTS.md and UI_RULES, with a RULES_INDEX register row, router entry and reserved DSG prefix. DSG11 (one home per fact) is Weibao's request, relayed by the repository review session. No AD line: O1 is recorded through the register row.
- M3: `src/world_look.js`, LOTM tokens in `styles/ui_tokens.css`, rules in `styles/world_look.css` (manifest line). M4: `src/world_report_voice.js`, applied once at write time in `display.js` `log_message`. Save-neutral: Reports lines are not saved.
- M5: [kit census](../../../audits/WORLD_UI_KIT_CENSUS_2026-10-30.md).
- Follow-up fixes, after an advisor review: `worldFamily` maps `hp.world` to `hp` rather than `world`; the LOTM fallback for unlisted places was dropped, so the other five lives' places stay generic until they are checked in play (UR72); DSG status reads proposed (AD32); Weibao's relayed DSG11 request is recorded in USER_VISION.

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/world_look.test.js` | 5/5 pass | none |
| `node --test tests/ui_contract.test.js tests/stylesheet_manifest.test.js` | 9/9 pass | none |
| `node scripts/playtest/world-look-probe.mjs` at 1920x1080, bundle `3d7ee038fca60de4`, rerun on `d97f7729fdaa460f` after the follow-up fixes, fresh origin | Frontier: family `frontier`, flourish off, 0 voiced lines. LOTM after crossing: family `lotm`, flourish on, header glyph and epithet, 1 voiced arrival line. Back in the Village after resume: flourish off, 0 voiced lines, 0 page errors | The frontier same-kind arrival line was not captured, because the resume reload clears the log. The unit test covers it |
| `npm run check:rules` | PASS (18 warnings, all pre-existing kinds) | none |
| `npm run check:arch` | exit 0 | none |
| `npm test` (full), branch on base fc066ee2d | 4717/4726 pass, 6 fail | Same failure on clean fc066ee2d, so not this branch: `ui_contract` (style.css rgba from 650a7ab5d, since fixed in 54fda9ed2), `cast_journeys` native place-panel journey, `cast_worksheet` and `lead_run_crosswalk` (no private `docs/research/novels` in worktrees). Open: `facts_frame` "fixture minutes … mid-wait" failed on the branch three times and passed once on clean master at a lower load; one branch rerun also failed "fresh life", which points to load (load average 100-130). Not yet settled by a same-load master run |
| Rebase onto 0308a4a95 (tip 6fb32f310), focused: world_look, stylesheet_manifest, ui_contract; `check:rules`, `check:arch` | world_look and manifest pass; rules PASS; arch exit 0; `ui_contract` fails only on style.css spacing and radius from 6c97ec39e, which also fails on clean 0308a4a95 | Not merged: weekly usage reached 88%, past the 86% checkpoint line. Next: rebase onto the master tip (19a48e65d or later), run `facts_frame` on branch and master at the same load, then the guarded merge if it is not the branch's |
