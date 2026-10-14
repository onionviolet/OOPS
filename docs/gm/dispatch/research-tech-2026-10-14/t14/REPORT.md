# T14 report: revealer cheat cards

2026-10-14. Documentation and scratch checking complete. These remain draft considerations. No card is installed or implemented as gameplay.

**Result:** 60 cards cover RC1-RC15 with four forms each, including a mood form for every revealer. The real validator accepts 54 and rejects six proposed panel IDs. All six rejections remain explicit decisions; no card or validator was altered to disguise them.

## Deliverables and new codes

| File | Content / codes |
|---|---|
| [CHECKPOINT.md](CHECKPOINT.md) | Created first; scope, read/reconciliation progress and final resume point, L0-L9 and L66-L69 |
| [cards.json](cards.json) | Actual ten-field C0 cards; nested stages, hooks, observer grades/range, limits, acquisition, placement, store reads and world fit |
| [check.mjs](check.mjs) | Scratch script imports `/Users/weiwei/code/yet-another-idle-rpg/src/cheat_cards.js` by absolute path; no file writes or browser actions |
| [CARDS.md](CARDS.md) | Readable summary of all 60 IDs; L10-L24 for RC families and L60-L65 for shared contracts |
| [PANELS.md](PANELS.md) | L30-L35 new-panel versus reuse decisions; L36-L39 existing panels and current runtime limits |
| [WORLD_FIT.md](WORLD_FIT.md) | Fifteen world profiles, RC-by-form fits, L40-L52 bounded canon parallels and L53-L54 evidence gaps/contradictions |

Four forms per RC are system tab, two fitting alternatives and mood. Across the cards: 15 system tabs, 4 lenses, 7 items, 4 bloodlines, 4 techniques, 6 advisors, 5 familiars and 15 mood forms. Twelve named world profiles occur in card-level fit entries. The other three profiles are retained adjacent possibilities, not promised cards or new active world work.

## Findings

| Code | Finding | Evidence / consequence |
|---|---|---|
| L75 | The current validator checks the exact outer shape, allowed panel/terms and JSON-safe nested data, not RC semantics | `src/cheat_cards.js:2-6,32-44`. Nested routes, store reads and stages are authoring metadata. Scratch completeness checks do not establish their runtime meaning. |
| L76 | An accepted status-window card cannot deliver an RC tab through current source | First eligible card lookup and generic awakening are `src/cheat_cards.js:85-100`; fixed native stats and empty quest text are `src/status_window.js:23-33`. Family routing, multiple-card presentation and per-card awakening remain separate work. |
| L77 | IM2, IM3, IM5 and IM6 do not cover every hidden truth the palette asks to reveal | Cards explicitly identify additional market, NPC project, speech/affect, incident and historical owners. Owner design: `docs/TECHNOLOGY_AND_PROGRESSION.md:1529-1538`. Evidence receipts are not omniscient truth; missing owners return unknown. |
| L78 | Canon analogues are narrower than the proposed RC contracts | WORLD_FIT L40-L54 separates shown, stated and inferred evidence, media and access gaps. Examples include private advisor voice, observed copying, stored memory review and bounded divination. No exact canon price-cause, diffusion, rival-progress or variance reader was verified. |

RC14’s one reconstructed method is treated as a first useful payoff, not a permanent once-per-ruin restriction. Forms keep local limits and reachable growth; no fixed global charges, odds, mandatory suffering or hunger upkeep are added. Stages are illustrative and do not deny a supported strong means its full information. This follows COMMON and the RC/OM palette at `docs/TECHNOLOGY_AND_PROGRESSION.md:1462-1518`.

## Executed scratch check

Command:

```sh
node docs/gm/dispatch/research-tech-2026-10-14/t14/check.mjs
```

Final executed result: **exit 0**, meaning the draft has exactly the expected panel decisions and no unexpected validator/completeness errors. It does **not** mean all 60 cards validate.

Validator output counts:

```json
{
  "total": 60,
  "validatorAccepted": 54,
  "validatorRejected": 6,
  "expectedPanelRejections": 6,
  "unexpectedValidatorResults": 0,
  "completenessErrors": 0,
  "distinctWorldFitEntries": 12,
  "inMemoryGrantJSONRoundtrips": 54,
  "fixtureMessages": 54,
  "combinedStateRoundtrip": true,
  "validatorUnchangedDuringCheck": true
}
```

Each RC has four distinct forms, including mood. Acquisition arrays use AQ1-AQ11, AQ13 and AQ14 where fitting; AQ12 is retained as a conditional event-transmission possibility in each card’s otherRoutes, never falsely offered universally. Every card explicitly marks all four requested stores used or unused, with read reasons.

| Card | Rejected `ui` | Decision |
|---|---|---|
| `rc2-system` | `research-roadmap` | L30 |
| `rc8-system` | `diffusion-map` | L31 |
| `rc10-system` | `rival-projects` | L32 |
| `rc13-system` | `variance-gauge` | L33 |
| `rc14-system` | `ruin-archive` | L34 |
| `rc15-system` | `research-advisor` | L35 |

All six produce the real error `Invalid cheat card ui: unknown panel.` Their JSON stays unchanged. Since the validator stops at this error, these six do not receive a complete real-validator pass of later fields. Draft completeness review is supplementary, not a substitute.

The 54 accepted cards were granted only into an in-memory schema-1 state with route `AQ14:test-fixture`, serialized/restored and checked for exact card equality. One labeled fixture message per card and the combined state survive that same in-memory JSON roundtrip. No hook, awakening, spending or native save/import was executed.

Final observed hashes:

- Validator: `8ca52e83187845d8da7bdb11d5ba96befe81bd3f2ebbe932f0c664f8140273d4`
- cards.json: `82a425024c1e991b049777eee522716502504a3ba2023978ce59a85fbcf0f5e7`

A bounded artifact review found zero errors: all 60 IDs appear in CARDS, panel decisions resolve, local Markdown links exist, and dash-style checks pass. The final cards hash covers corrected source locators. The script prints full results on rerun and fails if source changes unexpectedly accept a currently rejected panel or change validation outcomes.

## Ranked suggestions, proposals only

1. **L70:** Use RC1’s targeted lens as a small comparison candidate once one real IM2 belief and a qualified truth-reading owner exist. Show a wrong belief and a next investigation without granting practical mastery.
2. **L71:** Pair RC2’s targeted atlas with the separate T6 planner for an actor-view versus true-graph comparison. Preserve full-world compatibility and graph coverage limits; the independent system panel remains L30, not silently substituted.
3. **L72:** Resolve L30-L35 through the live panel/architecture owners when a full system form is selected. Compare an independent region with explicit reuse at 1366x768, preserving useful local actions and legible detail.
4. **L73:** For a selected historical slice, start with one identified specimen and RC6 before promising a whole ruin reconstruction. Freeze surviving traces, receipt identity and carrier behavior so reload cannot invent a history.
5. **L74:** Compare the selected strong form with its mood sibling on the same facts. Keep texture optional and inspection reachable; measure whether the subtle cue gives a useful lead while preserving its lower detail.

## Open questions and unverified scope

| Question / gate | Disposition |
|---|---|
| Which card/form, world/source-era and strength does Weibao want implemented? | No selection inferred from this docs task. All cards remain possibilities. |
| New independent panels or explicit existing-panel reuse? | L30-L35 remain unresolved product decisions. Existing IDs being valid do not prove renderers or full comparison behavior. |
| Which owner supplies truth and admits each observer? | IM2/IM5/IM6 design and separate IM3 module are not a wired shared RC service; additional owners are named per card. Resolve for a selected slice. |
| Canon fidelity | Bounded official pages and local project source summaries were read. No new full-book, full-manga or episode viewing. One Piece direct open returned 403 after its official search synopsis was obtained; no retry. WN summaries and blocked wiki leads keep their original qualifiers. |
| Source drift and R1 integration | R1_REPORT was read as a separate worker’s report, not proof that its stronger validator was merged into this imported source. Other workers are active. Future implementation must recover the live owners again. |
| Runtime and playable acceptance | No source edit, build, browser journey, real save/reload/import, migration or human acceptance. The authoritative future playable gate is the selected card’s rebuilt fresh-origin desktop journey and applicable persistence proof. |

Only this lane’s folder was written. No staging, commit, push, source-library change or personal-save access was performed. Desktop/laptop remains primary; mobile optimization and additional world implementation are deferred. T14 closes the requested documentation and scratch-check work, not gameplay delivery.
