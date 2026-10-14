# D9: bounded storyteller pacing over P3

Status: PROPOSAL, source-audited 2026-10-13, not a universal director or implemented fate system. Rank W2-6, below recommended first five.

| Slice | Outcome Weibao can play | Owner doc | Dependencies | Proposed branch / port |
|---|---|---|---|---|
| D9-A Steady / Gentle | Choose a local pacing style, see varied P3 cards, receive room to recover after a difficult outcome and continue idle play without accumulating forced decisions | [E5 Storyteller](../../../../emergent/E5_STORYTELLER_AND_FATE.md) | Integrated P3 deck/selection/cooldown/impact receipts and P1 saved deck streams mandatory; P2 projection principles reused; P4 cast optional | `proc/w2-d9-director` / 19460 |

## Live audit and direction

| Code | Evidence | Finding |
|---|---|---|
| F1 | `src/simulation.js:497-509`; `src/simulation_contracts.js:305-308` | Main's live baseline runs independent event checks, not comparative deck weighting. D9 must attach to P3's integrated selection seam, not patch this loop into another independent director. |
| F2 | `src/simulation.js:398-408,423-438`; `src/simulation_contracts.js:298-303` | Resolved event effects and response costs are authoritative; event logs/instances are bounded. D9 needs outcome receipts/impact summaries before pruning. Text tags or logs cannot reconstruct damage/loss reliably. |
| F3 | `src/simulation.js:82`; `src/expansion_engine.js:582-635` | Known decision handling can stop advancement. P3 was tasked with a less intrusive idle policy; D9 inherits that actual decision/expiry behavior rather than reintroduce global indefinite pauses. |
| F4 | `src/simulation_contracts.js:217-231` | No storyteller/fate owner in this audited state shape. It requires an optional validated owner, explicit defaults and scheduler integration. |
| F5 | `src/weather.js:7-14,31-47,194-195`; `src/game_time.js:35-41,64-73`; `src/life_record.js:1` | Seasonal/time context exists; biography is lossy. Tidal seasons and long-life fate are not necessary to show local weight pacing. |

USER_VISION's “anything possible, reasonably” and storyteller/fate possibilities allow styles and local limits, not a compulsory cosmic controller. `PROJECT.md:31-47` makes ordinary unfed play comfortable and desktop primary. Architecture review Backburner (`docs/reviews/WHOLE_PROJECT_GAME_ARCHITECTURE_REVIEW_2026-10-12.md:288`) defers the universal director. D9-A is a local optional adapter with two styles, not that broader system.

## Conflicts and gaps

| Code | Conflict / gap | Proposed resolution |
|---|---|---|
| R1 | E5 comfort uses hunger, making “unfed” a pacing deficit | Remove hunger from D9-A comfort/pressure. Optional meal benefits stay under food owners. Use recent actual outcomes, current health and open local pressure only; baseline ordinary play does not assume constant meals. |
| R2 | E5 reads impacts from chronicle; its display/history is lossy | P3 supplies explicit completion impact receipts from actual applied deltas, not guessed prose or universal net-worth fiction. Unsupported pressure inputs are zero and marked absent. |
| R3 | E5 clamps multipliers above zero after mentioning veto | Hard lore/means veto stays weight zero through final clamp. Clamp only positive eligible weights; styles cannot resurrect an impossible card. |
| R4 | E5 R7 consumes a dropped roll, while main baseline draws only after eligibility | Keep P3's documented lifecycle; freeze a single selection draw per due eligible deck tick and do not redraw after rejection. Pre-check means before selection; empty deck ticks may consume one declared draw if P3 contract requires it. Root resolves this exact seam at integration, not by changing legacy event checks. |
| R5 | E5 global defaults, fixed gaps and once-card exemptions can overrule world direction | All pacing/caps are local prototype data; no fixed lifetime “once” anti-abuse. Duplicate receipt protection is transaction integrity. Fate, harsh/off fairness, stacking and no-cost cheats stay future reachable content, not first-slice prerequisites. |

## Implementation contract

Only Village P3 deck, styles Steady and Gentle, chosen through an optional existing Settings/Notebook control, default opt-out/pass-through for old saves. Opt-in default Steady. New owner `expansion.storyteller = {schema:1, revision:1, worlds:{[worldId]:{styleId, enabled, changedAt, impacts:[], lastNonDailyAt, lastThreatAt, reliefUntil, badStreak, receipts:[]}}}`. Impact entries include outcome receipt ID, resolvedAt, nonnegative measured damage/loss units and capped relief delta; no private story text. Validate finite numbers, bounds, time and ID references. Retain summaries independent of pruned P3 instances. Style changes are logged neutral public settings and do not draw or reroll a pending card.

At one P3 due tick: gather P3 eligible cards/cast/means/cooldowns; calculate `recent = max(0, sum(impact * 0.5 ** (ageMinutes / halfLife)))`, default half-life 4320 minutes, Gentle 2880. `T = clamp(recent + 25*(1-hp/maxHp) + 10*min(3, openThreats),0,100)`. Missing vital means omit its term rather than invent zero health. `C = clamp(50 + 50*min(1,quietMinutes/10080),0,100)`, with quiet = time since last non-daily known card. `P=(C-T)/100`. No hunger, wealth, death-risk or debt inferred from absent fields.

Use E5 Steady/Gentle base tag multipliers and slopes, with world-local `swing` 0.5/0.4. For multi-tag cards use maximum positive tag multiplier; multiply eligible P3 base weight, clamp only positive multiplier to 0.05–5. Hard ineligible/veto remains zero. Threat gap is local 4320 played minutes, Gentle 8640; do not add lethal cards that P3 does not deliver. P3's existing open-decision cap remains authoritative. Require at least one presently affordable response or decline/flee for a proposed threatening card; if none exists exclude before the single selection, do not produce another roll. A safe quiet breaker after five played days weights an eligible people/opportunity/daily card; if none exists record empty tick, never spawn unsupported content.

Tempo `clamp(1+swing*0.5*P,0.3,1.6)` proposes next P3 interval `max(1,ceil(baseInterval/tempo))`, once after settlement of the tick. It never retroactively changes an already due/pending occurrence or creates a parallel scheduler. No extra director random draw needed for these styles: P3 uses its saved selection stream; all style math is deterministic. Keep a future P1 `director` seam for random personalities but do not consume it now. Freeze candidates, effective weights, selected ID and draw receipt at commitment.

Impact mapping for supported P3 outcomes: 6 units per 10% max-health lost, 5 for survived threat with no loss, recovery subtracts 10 (floor recent at zero); coin/item losses use explicitly declared fixed content impact until an actual supported valuation exists. Do not score offered-but-untaken rewards as recovery. After impact >=30, two played days threat factor 0.2/recovery factor 2; Gentle four days. Bad-streak opportunities use E5's capped factor only if actual card outcomes provide the required tags/impact. No direct resource/vital/cast effect list in director. Only P3's chosen card may write consequences.

Receipts ring 200: tick/world/style/revision, T/C/P, known input-presence flags, eligible card IDs, effective weights, chosen ID, P3 selection draw receipt and skip reason IDs. Player debug/perception projections cannot expose hidden cards/cast. Runtime lacks these receipts today. Natural browser journey shows relief and readable style effects; deterministic seeded-native 30-day traces compare settings under controlled actions without claiming “twice as many rares” from one random run.

Compatibility and ownership: absence preserves P3's existing scheduling, enrolled state gets explicit validated optional schema through root. Persist due tick, cooldowns/pressure/receipts in the same envelope with P3/P1; never reset on load or recalculate old impact from logs. New `src/storyteller_{state,pacing,content,view}.js` and tests belong to D9; P3 owns its hook/scheduler module, root shared `src/simulation.js`, `src/expansion_engine.js`, `src/main.js`, `src/save_files.js`. No per-person fate, body-growth, world-wide adaptive scaling, Ironman lock, cosmic events, offline policy or mobile work.

## Acceptance checklist (future, all NOT RUN)

- [ ] A1 SOURCE: deterministic 30-day traces for pass-through/Steady/Gentle, positive bounds, veto zero, gap/relief, empty-deck handling, affordable counters and actual impact inputs. Style/preview changes never draw or mutate a pending card. Tests/build pass; compare weights and due times rather than promise fixed sampled rare counts.
- [ ] A2 NATIVE: fresh origin enable Steady, see varied P3 cards, resolve a real difficult outcome, then observe supported relief/opportunity and continued routine play. Change to Gentle; verify changed future cadence without replacing pending cards or freezing idle decisions.
- [ ] A3 PERSISTENCE: Save/reload with an open card and during relief; Export then literal-file Import at a second fresh origin. Same card, due tick, impacts, cooldowns, receipts and next draw. Absent legacy owner preserves P3 pass-through behavior.
- [ ] A4 FAILURE / FAIRNESS: failed write produces no consumed tick or new consequence; unsupported style/schema rejects safely; excluded card never gets redrawn for a second chance. Receipt views reveal only actor-known data, and food absence adds no pressure term.
- [ ] A5 UI: rebuilt 1366x768 plus 1600x1000; local style control and known event/response readable, ordinary actions remain available. Full fate/world director, mobile and human cadence acceptance remain deferred.
