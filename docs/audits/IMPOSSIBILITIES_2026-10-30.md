# Impossibilities sweep (2026-10-30)

Weibao, 2026-10-30: "Consider gaps and impossibilities, we can just implement those." Pillars: AD5 (everything is possible, reasonably) and AD38 (things work by how they work). Every row is a finding or proposal, none is an accepted decision. Evidence: a Sonnet grep sample of `src/` (about 990 files, not exhaustive) and a docs sweep; raw lists are in the shared notes folder (`ip_code_sweep.md`, `ip_docs_sweep.md`). Sealed secrets appear by ID only.

**Result.** The codebase mostly follows the pillars already: most refusals name a missing thing, and `economy_standing`, `rank_gap_observer` and `home_layout` use value, reason and dial objects. The gap audit lists few outright "impossible" items; its gaps are mostly designed-but-unbuilt, which is a sequencing matter. What remains is a short list of fixed numbers, `once:true` beats and generic reasons. Rank is by how often a player hits it, then whether he asked.

## Built (focused tests pass; agent-verified, not human-reviewed)

| Code | Where | Was | Now (default, dial, reason) |
| --- | --- | --- | --- |
| IP1 | `src/craft_resolver.js` | Batch of 999 per lot and 12 steps, fixed for every law | Default 999 and 12. Dial: `limits.batchCeiling` and `limits.steps` on a law (a bigger vat or crew). Refusal now says what would lift it. Test: `tests/craft_engine.test.js` (IP1 x2) |
| IP2 | `src/home_school_offices.js` | "already booked this school month" with no way forward | Default one funded session per 30 days. Dial: a paid top-up (4 estate coins, button "Pay for an extra session now"), which pushes the next free session back by a third of a month. Refusal now names the top-up. Test: `tests/home_cultivation.test.js` (IP8 test) |

## Queue for owner lanes (not built here; ranked)

| Code | Location | Current behaviour | Mechanism | Cost | Dial |
| --- | --- | --- | --- | --- | --- |
| IP3 | `craft_process_cues.js:165-171` | Four generic refusals (apparatus, control, materials, cue) | Name the missing item or skill; allow a substitute tool at higher failure odds | Failure odds, time | `skillShortfallRisk` |
| IP4 | `tools_domain.js:147` | "You cannot judge the head with these means" | Coarse look with low confidence. Caution: hidden damage state must not leak, so it needs a design call | A vague result | confidence band |
| IP5 | `craft_reference.js:143-145` | A training reference cannot be re-read | Re-reading pure grants yields nothing; practice material yields a little | Time | `rereadYield` |
| IP6 | `craft_sources.js:13,264` | `MAX_IDLE_HARVESTS=500` | Stop for an in-world cause (stamina, food) | Stamina | `idleHarvestsPerRun` |
| IP7 | `book_world_primordial_credit.js:157-158` | One mission at a time, "Come back tomorrow" | Rush fee or standing cost. `book_world_*` files go through floor-wire | Coins or standing | `taskPerDay` exists |
| IP9 | `audit_remainder_home_content.js:89-182`, `original_frontier_field_content.js:59-224`, `storylet_content.js`, `lever_lesson.js`, `proto23_world_content.js:42` | About 40 `once:true` commands | Repeat after world state changes. Default repeatable, `once` only for genuinely one-time facts | Time, fee | `repeatAfter` days |
| IP10 | `home_warehouse.js:23`, `home_office.js:28` | Staff runs stop when stock or purse is short | Partial fill, or borrow from the household at a markup | A markup | `partialFill` |
| IP11 | `rank_gap_observer.js:73-76` | "Needs the matching credential or sense" | Name the sense; allow a borrowed route through an ally at a favor cost | Favor | exists |
| IP12 | `workspace_layout.js:271`, `body_ui.js:39` | Fallback "Not available here right now" | By default show the specific blocker (UIW5), because the player needs to know what is missing. Both files are being edited by UI lanes, so it goes to the General UI coordinator | None | none |
| IP13 | `world_rhythm.js:23`, `lamplight_factory.js:75` | "The game calendar is unavailable", "Saving is paused" | Name the missing time source; add an in-world line | None | none |
| IP14 | `authored_site.js:15`, `content_packs.js:7,64` | Pay caps 500 and 10000, generic error | Scale with the patron's funds, give a reason | None | patron funds |
| IP15 | `craft_failure_ledger.js`, `craft_reference.js:22,82`, `family_tree.js:9-10`, `obligations_ledger.js` | Silent truncation caps | Label as save-size guards (AD22), show "and N more" | None | none |

IP15 are save-integrity caps, which AD22 allows, so only the labels change.

## Docs reworded (cold files, none dirty, last commits 3 days to 3 weeks old)

MAKING_RULES MR9, CHEAT_LIBRARY IM2, GENETICS_AND_HERO_START_PLAN GHS97, LIFE_SIM_NORTH_STAR (VIP shop), CRAFTING_ENGINE PZ15, DEEP_WORLD_WORKFLOW (Sequence skip), ENEMY_PROTAGONISTS (companion loyalty), EMERGENT_SYSTEMS (NPC "may never do"). Each now reads default, dial, reason.

## Docs held back (another lane is editing, or recent)

- `WORLD_ABSORPTION_RULES.md` WAC23 (no universal power scale): edited 9 hours ago. Proposed: local units by default; a hub world or measuring authority publishes a lossy conversion.
- `LEAD_LIFE_RULES.md:32` (only an external factor changes canon): edited 12 hours ago, already default plus dial, low priority.
- `PROGRESSION_GATE_RULES.md:176` (switching "blocked rather than priced"): label as a slice limit; dial: priced or possible by an in-world route.
- `GAP_AUDIT_2026-10-30.md` G15 ("excess dropped", anchors "cannot"), and `gap-audit-2026-10-30/uv_cov_2.md:188`, `uv_cov_3.md:87`, `uv_cov_4.md:149`: edited within the hour. Say "not yet" for anchors; write the hidden-strength chief as an unbuilt capability; forgiving recovery gets a per-world unavoidable-defeat dial (AD20); retirement-ledger throw is a test-time guard with a play-time log-and-drop dial.

## Not changed

Death final by default (LORE_AND_CONTINUITY), MR6/MR7, WER10/11 and the other rules the sweep found already in default-dial-reason form.
