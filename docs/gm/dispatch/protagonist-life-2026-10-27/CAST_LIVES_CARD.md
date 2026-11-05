# Cast lives: one-page card

This is a dated cast-life snapshot from October28–29, with later content reconciliation in B420 below. Its PIDs, running/next labels, counts and playable instructions are historical. Current execution follows [PROJECT](../../../../PROJECT.md), [lead-life rules](../../../LEAD_LIFE_RULES.md) and the relevant live source/delivery owner.

The [coordinator handoff](COORDINATOR_HANDOFF_2026-10-28.md), complete [plan](CAST_LIVES_PLAN_2026-10-28.md) (rounds1–20) and [lane receipts](cast-lives-lanes/) preserve the chronology. Standing lead-first direction remains AD44; later adopted codes and receipts supersede earlier proposal/status labels.

## Goal

Everything the book's protagonist touches lives in the game with its own week: schedules, relations,
knowledge and an arc that runs whether or not the player follows the lead (WA22-WA24). First slice:
LOTM chapters 1-24, "beside the lead" start. Second world: Mother of Learning, first loop.

## Recorded state (October28–29; original verification scope)

| Lane | What | State |
| --- | --- | --- |
| L1 | Merge, id crosswalk, fitness report | Landed `b3b2c0c8e` |
| L2, L2b, L2c | Schedule module; worksheets; fight contracts and after-actions | Landed |
| L3, L6a, L6b | LOTM cast records; MoL worksheets; MoL cast records (AR11: zero seam edits) | Landed; data now in `private_packs/` |
| L4a, L4c, L4d | Beside start from the private pack: cast moves by schedule, walks to cast places, resident entry, talk gate with away reasons, remote people excluded, relative day in the header | **Meets the AD43 floor** `1cadee65e` (bundle `11cf2385`, 1920×1080, zero page errors, Save/reload/Export/Import) |
| L7 | Reaction classes; classifier 40% to 59% (LOTM), 37% to 63% (MoL) | Landed `cdefcf80e`, partial |
| L4b | Beats settle on their days with no player; Reports lines at witness level; gap probe (15 gaps); fold-loss ledger | Landed; FLR3 partial (person view rows) |
| L4e | Polish: capitalized report lines, district grouping, place title, person-view beat rows | Landed `1dd4f88db` |
| L5r | Chapters 1-3 UI replay: two identical fresh UI runs, zero page errors; 1/18 verified (clean fold), 17 typed gaps, measured in beside | Landed `8a6dffa6a`; fidelity counts in the be seat once B1 lands (CL269) |
| W1 | Lane runner (`scripts/codex_lane.mjs`), review script, brief template | Landed `6324d336f` |
| G1 | Wait until (quoted, interruptible); beat aftermath writes dated knowledge to who learned it | Landed `5832a1f8b`; floor PASS bundle `0539519f` (1920×1080, zero page errors, Save/reload/Export/Import); wait takes 13 s for six hours (target 3 s, CO3) |
| C1, S1 | Perspective tags for 64 controls; seat filter with one read point | Landed `5832a1f8b` with G1 |
| P1 | One command per book to records-ready (CL272) | Landed `569616c90`; MoL reproduces, LOTM shows input drift |
| G2 | Concealment | Held until the be replay needs it |
| B1 | **Be the lead**: history pass, seat registration, no Village behind him, seeded draws | Running (Sol, pid 25335, `codex_lane.mjs status`) |
| T2, TH2 | Pack-driven journeys, non-walkable arrival fix, test timeouts | Landed `0df26deaa`, implemented below floor (browser floor pending); see [sonnet wave checkpoint](../sonnet-wave-2026-10-30/A_CHECKPOINT.md) |
| A1 | Routine bands in whole-book builds (ch 31+) | Generator landed; band ch 31-60 candidate 39 of 163 usable, places missing; not adopted into the pack |
| Next | Browser check of B1, then the L5r replay in the be seat (CL269); D1 determinism and divergence | See the handoff queue |

## Recorded playable route, October28

With the private pack on this machine: from the Village, pick the fifth Tingen start ("beside the lead").
You wake in neighbourhood lodging on day 1. Walk to the household's flat, the market, the bakery and other
places; the people the lead knows are where their day puts them. Talk to whoever is there; anyone away
says when and where they are usually back. Their story beats now happen on their days whether you are there or
not; be at the household flat at dawn on day 1 and Reports tells you what you saw.

## Rules for this work (CLR1-CLR13; accepted as binding defaults 2026-10-28)

Each line restates an accepted code where one exists; only CLR2, CLR3, CLR6, CLR8 and CLR9 are new.

Moved 2026-10-29 to [LEAD_LIFE_RULES, lane rules CLR1-CLR13](../../../LEAD_LIFE_RULES.md#f-lane-rules-clr1-clr13); codes and wording unchanged.

## Where to look

- **Top-down design of the lead's life** (actions, relationships, fights and results, knowledge, law, work, body,
  determinism, subtle chains, lanes): [LEAD_LIFE_SYSTEMS_DESIGN.md](LEAD_LIFE_SYSTEMS_DESIGN.md) (LSD1-LSD164, proposed).
- Method and index-to-runtime map: plan sections 2-3. Fights and gap probe: 8. Fate, time models, trends,
  UI: 9. Audits versus derivation, interaction loop: 10. Scene UI rules SUI1-SUI19: 15, 17, 18.
  Fold-loss: 19. Private pack and build order: 17. Reports text RPT1-RPT12: 21.
- Engine: `src/cast_schedule.js`, `src/beat_records.js`, `src/beat_ledger.js`. Tools:
  `scripts/lead_run/{build_crosswalk,cast_worksheet,conflict_contracts,after_actions}.mjs`.


## Content reconciliation B420: historical card and actual receipt status

This card and six complete L4a–L4e/L5r receipts were actually read. It is retained as a dated short index; current priority and source/runtime evidence remain with their current owners.

**CAST_LIVES_CARD:** The card is an October28/earlyOctober29 snapshot, not live worker or current-route state. Its lead-first standing goal survives, while current PROJECT supplies Klein-first, HP alongside and later ordinary-start scope. The B1 pid, held G2, next replay, old count/model/tool references and natural-time metrics are dated. L7 percentages are placement, not accuracy; MoL zero shared edits establishes data fit, not integrated play. L4d later completion supports the recorded beside floor, while L4e has its own14/15 shared-test failure and separate15/15 temporary candidate. No present floor or source-row fidelity follows from a landed label. The actual adoption section correctly routes CLR to its rulebook; other old proposed-status labels resolve through current owners.

**L4A_CHECKPOINT:** Four authored civil days and60I bindings project34 real bodies through the single location store. They are not exact source dates; a proposed relative-day6 gathering stays outside the four-day scene window. Remote/unplaced people are not local destinations. Original four profiles have scoped baseline comparisons. Native movement/persistence and away screenshot do not establish ordinary travel/meeting or literal browser Import; those gaps are later addressed by L4c/L4d rather than retroactively passed in this receipt. Two pending scope questions are historical, not present blockers.

**L4B_CHECKPOINT:** The null run’s84 terminal marker outcomes (73 carried,11 blocked) are not84 executed source actions. All84 folds are lossy/unverified with386 typed losses, two lacking matching scene contracts. Zero lodging reports is the actual witness budget, not failed gossip. Private report routes, event-time masks and failed-save atomicity keep observation distinct from occurrence. Coordinator completion supersedes the opening no-caller status and records real browser Reports/persistence on its own bundle, but person-history screenshots remain partial there. L4e later exercises that view with distinct proof and its own focused failure.

**L4C_CHECKPOINT:** Pack data is moved out of public source and retained history is not rewritten. Dormant pack-absent restoration qualifies the specific bodies/positions/queued travel cases tested, not every future pending command. The initial headless route differs from the minified browser artifact. The later coordinator browser run reaches the natural route but reveals five get_game_version errors; clean-HEAD reproduction assigns them to this lane’s top-level fetch await, correcting the earlier baseline assumption. Residual20 source/test paths and three bundle matching lines remain explicit, not a zero-name pass. The actual G0–G3 fixes and resulting floor are in L4d’s later completion.

**L4D_CHECKPOINT:** The opening below-floor/ownership/sandbox statuses are superseded by the coordinator’s actual UI adoption and rebuilt1920×1080 browser route: G1 resident blocks, G2 remote person handling, G3 relative header and G0 boot fix pass with zero page errors, persistence and3,676-test suite on the recorded inputs. Its earlier12-test/fetch/source-headless checks and blocked native/browser portions keep their original scopes. No absolute civil month/year or guessed remote city is created. The old title/list polish remains separate from the historical beside-start AD43 floor, not a fresh whole-world claim.

**L4E_CHECKPOINT:** District grouping, current-place header and person-history view are browser-exercised on the recorded bundle. Shared focused file fails14/15 due two old lowercase assertions; temporary candidate15/15 and new-case3/3 do not equal a passing final shared file. The center back label can remain stale after place change, and prior persistence proof is not newly asserted for this bundle. A landed summary cannot erase these exact limits.

**L5R_CHECKPOINT:** The lane initially cannot launch Chrome; coordinator later fixes knowledge/purse snapshot paths and completes two identical fresh1920×1080 natural-clock UI runs with zero page errors. One clean fold of two timed walks yields1/18, not three verified book steps from three screenshots or a completed opening. Seventeen typed gaps include seven seat needs and a rejected source attribution, which are not all missing verbs. The32-row merged ledger preserves15 L4b+17 L5r rows without equating layer counts to shared mechanics. Later broader-source mappings use different denominators and current be-seat replay owners; do not infer a new score or rerun an old command from this receipt.

The full plan is content-reviewed in B419; this adds no new gameplay, package, installed-app or source qualification proof. Historical tests and screenshots retain exact inputs and dates, with human review optional under AD42.


## Content reconciliation B421: be-seat history and cast-data source boundaries

Three additional complete receipts were reviewed; private source, pack state and test execution were not reopened.

**B1_CHECKPOINT:** The history-count stop is explicitly superseded by coordinator clarification, followed by source-located candidate memories and three relations. Opening memories, a later act of recall and paragraph-linked prior events are not automatically the same knowledge. The one-penny purse remains a labelled unverified fill: seeing a coin before payment does not establish the whole purse or debts, and a room object does not prove carried ownership. The producer-only schedule guard does not prove a single body; later round2 maps lead identity to the native player and removes its separate NPC actor. Detached fresh-life publication differs from ordinary crossing/import probe, with precise guard/failure forwarding and preservation of the prior save. Round3’s reported browser bundle does not certify round4’s new kit/perspective/autosave patch. Registered fixtures, built scratch composition and unapplied shared hunks retain different states; native combat stats, dated workroom tags, actual possessions and broad shell proof stay scoped. Seven L5r seat gaps require real replay rescoring, not automatic completion from a be-seat label. The later handoff records further integration history but this receipt supplies no fresh current be-route or full-book proof.

**L3_CHECKPOINT:** All data/label/timing/alias/rejection rows and the108-row queue were read. The actual principal beat counts sum84; queue Markdown counts are recorded separately without source/runtime credit. Present-plus-partial ranking does not place an absent person in a room; empty knowledge/relation/aim lists mean no selected verified input, not known absence. Twenty unresolved anchor addresses and38 undated forward anchors are lint references, not travel nodes or dated facts. Irregular[1,7] eligibility plus a missing window fact does not authorize all beats on day1. Source-confirmed content labels and unknown timing labels are separate. Rejected worksheet claims preserve wrong actor/place/time/aim/observer inferences instead of being repaired from memory. Event-marker effects do not execute spending, body movement or knowledge acquisition. The original public source-data placement is later corrected by L3m/L4c under the user’s keep-history decision; this data-only receipt is not current canon-publication or installed-state authority.

**L3M_CHECKPOINT:** This is a pointer to L4c’s actual private-pack migration/validation and its then-open browser/name-sweep gaps, not an independent second migration. Later L4c/L4d coordinator closures retain their own input identities and scopes. No history rewrite, private pack mutation, current ownership check or runtime verification follows from rereading the pointer.

Use these as dated implementation/coverage evidence alongside B420’s historical card routing. The source-data and generated-row preparation stages are useful without certifying an earned native journey. Current developer-route priority and actual later route evidence remain with PROJECT and its linked delivery owners.
