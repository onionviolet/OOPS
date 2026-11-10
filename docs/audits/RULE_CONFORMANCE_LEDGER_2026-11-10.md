# Rule conformance ledger, 2026-11-10

Audit, agent proposal (AD32). Weibao asked "Rules we need to setup and make followed? changing prior implementation for these rules once other stuff is addressed?" ([log](../gm/USER_VISION_LOG_2026-11.md#making-rules-followed-and-bringing-old-code-in-line-2026-11-10)). This ledger lists where existing code does not yet meet the 2026-11-10 rulebooks, and when to bring it in line. Rows come from each rulebook's own "Open details" and "Competing" lines; they were not re-verified line by line in code, so each row's first step is a short check that it still holds. Codes use the local prefix RCL; cite them from elsewhere as `RULE_CONFORMANCE_LEDGER_2026-11-10#RCL1`. The earlier [domain rules conformance scan](DOMAIN_RULES_CONFORMANCE_2026-10-19.md) (DRC) covers BHR, CBR, ECR, SLR and PIR.

## When old code changes

| Code | Policy | Reason |
| --- | --- | --- |
| RCL1 | **Default: move when touched (AR9).** A slice that edits a module listed below brings that module in line with the rule in the same change, as a recorded structural step, and leaves untouched modules alone. | Rewrites without a player-facing reason spend budget and break working slices; touching code is when the cost is lowest |
| RCL2 | **A dedicated consolidation runs ahead of touch in three cases:** two writers of one fact disagree (a correctness bug), a planned slice is blocked by the competing shapes, or the competition multiplies the cost of every new world. | These cost more each week they wait |
| RCL3 | **Order: after the current build wave reaches its checkpoint.** A consolidation lane is its own slice with the six-line floor (AD43), one writer per file (AR15), a save note when it moves state (AR6), and a regression proving the old callers still behave. | "Finish one playable slice before starting the next" (AGENTS) |
| RCL4 | **A rule revision marks code stale, not wrong.** When a rule line changes, the rows it touches are re-checked and re-ranked here; code that met the old line keeps working until RCL1 or RCL2 applies. | SPR12 (a refit is a revision); old saves are disposable but working slices are not |

## Rows, ranked by consequence

Trigger names which RCL2 case applies, or "touch" for RCL1.

| Code | Gap | Rule | Trigger | Owner area | Level, effort | Done check |
| --- | --- | --- | --- | --- | --- | --- |
| RCL5 | Two LOTM loss accumulators: `book.lotm.pressure` (loss at 6) and the `harm_state` carrier (lost at 9, 30-minute death clock) | MND8, BHR18 | Two writers of one fact | Mind, `harm_state.js`, LOTM host | Sonnet, medium | **Done 2026-11-10.** One carrier: causes and relief write an inbox that drains onto the `harm` power carrier at 1.5x; facts read the carrier with the inbox; lost holds (canon L7); the 30-minute grace runs in play, not during skipped time; only rest, care and travel remain at the lost stage. Tests: `lotm_harm_wiring`, `lotm_causes`, `lotm_self_ritual` |
| RCL6 | Three away banks with three caps; the growing cap he chose has no single home | TMR6 | Two writers of one fact | Time, `away_*.js` | Sonnet, medium | **Done 2026-11-10.** One source: the Mistglass practice draws from the native bank at its 60x efficiency and the host debits it; the Furnace already rebases. The cap grows through registered sources, the first being play (one day per 30 played days, proposal dial), listed in the projection. Tests: `away_bank_domain`, `cultivation_away` |
| RCL7 | Two schedule owners, `cast_schedule.js` and `npc_schedule.js`; one wraps midnight and one does not | TMR, STY14 | Two writers of one fact | Schedules and presence | Sonnet, small | One midnight rule; a test where a shift crosses midnight in both callers |
| RCL8 | LOTM keeps its own day formula in two places | TMR1 | Touch | Time, LOTM host | Haiku, small | Both call `dayIndex`; `check:rules` lint (FRC27) finds no second formula |
| RCL9 | Three window shapes (Gu, HP, LOTM) and two pack loaders; `windowKit` has no caller | WKR9, STY17 | Multiplies new-world cost | World packs and story windows | Sonnet, large | The next new world's windows use `windowKit`; one existing shape moved when touched |
| RCL10 | Three equipment owners (native, simulation, structured) | ITM9 | Touch, or blocked slice | Items, gear | Sonnet, large | One equipment read for stats; the other two adapt to it |
| RCL11 | Three person stores plus companion bonds | TIE1 | Touch | People and ties | Sonnet, large | One person record behind the three entry points |
| RCL12 | Four material routes; hunger in three places | LVR1, LVR13 | Touch | Livelihoods, care | Sonnet, medium | One hunger seam read by the Gu keeper, the pen and the household |
| RCL13 | MOL source facts are one free-text `provenance` string; HP has `ev` rows | SKR1 | Touch | World packs | Haiku, small | MOL source table with medium, edition and hash; rows point at it |
| RCL14 | Resolved beats do not record which route met them | STY33, RTC9 | Blocked slice (route variety) | Story, `beat_records.js` | Sonnet, small | A beat resolved two ways records each `via`; the recap names it without canon status |
| RCL15 | Four display vocabularies for one knowledge ladder | KNW3 | Touch | Knowledge | Sonnet, small | One vocabulary map; Knows and Reports use it |
| RCL16 | The LOTM pull beat names a church agent as a bare id | AGT11 | Touch | Powers that act, `canon_pull.js` | Haiku, small | The id resolves to an authority or church record |
| RCL17 | Cheat cards mostly off the power registry | CHT4 | Touch | Cheats | Sonnet, medium | Each card's powers resolve through the registry |

Lower rows, also from the books' open details: no tie reader starts an action (TIE8); plot rights carry no dues (LVR16); `law_case.js` has no caller (STN18); no mood state (MND5); no spoilage owner (ITM8); no shared acting-power record (AGT1, held as LLR26). These are missing features, not conflicts with a rule, so they wait for a slice that needs them.
