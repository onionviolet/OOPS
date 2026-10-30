# Coverage of coordinator ideas, 31b50c9f and a45ef88c

Method: grep of `src/`, `tests/`, dispatch checkpoints and the tracking docs, 2026-10-30. Read-only; no repo file edited. '(inferred)' marks anything not directly seen.

## 1. Table

| # | Coordinator | Idea (<=20 words) | Status | Evidence | Next step |
|---|---|---|---|---|---|
| 1 | 31b50c9f UI | UIW1/UIX2: remove '(a proposal)' labels from player text and lint for new ones | DONE | `scripts/check_descriptions.mjs` statusLabelPattern; `tests/check_descriptions.test.js`; audit R9 follow-through (16 labels removed, one Shadow Slave label kept) | None |
| 2 | 31b50c9f UI | Broader dev-word lint (UIX2/UR73), not only proposal labels | PARTIAL | Lint seen only covers proposal-style labels; wider dev-word list not found (inferred) | Extend lint list or close as covered |
| 3 | 31b50c9f UI | Acceptance packet P1-P16 (UIX4) for proposed UI rules UR76-UR82, UIV1-UIV7 | PARTIAL | Applied as 'proposals in use' in `docs/UI_RULES.md` (8de98f00); CHOICES item 4 awaits his answer | Wait for answer; silence leaves them as proposals |
| 4 | 31b50c9f UI | Luminous Gothic default for new and never-customized profiles | DONE | Pushed 5dcd2240c; audit R11 | None |
| 5 | 31b50c9f UI | Adopt new frozen snapshot into the Electron app | DONE | v0.6-e7f0aa4029ca adopted; `scripts/adopt_candidate.mjs`. Later UI work needs another adoption (inferred) | Re-run adopt script after next push, on his yes |
| 6 | 31b50c9f UI | Push master / db789da38 (carries other sessions' commits) | TRACKED-NOT-DONE | PLAN morning block 'Needs Weibao' item 1; not pushed | His yes |
| 7 | 31b50c9f UI | B1 return note ('While you were away' digest) in the lead's seat | PARTIAL | `src/return_digest.js`, `src/return_digest_ui.js` (a21533b6, 30b89bc1); host wiring waits on G16 pack-wording lookup | Wire to host once G16 resolves |
| 8 | 31b50c9f UI | B3 choice row and UIW5 specific blocked reasons (name the missing thing) | PARTIAL | Scene card shows blocked reason beside option for Village encounter cards (R2); Tingen night watch still generic (inferred); audit R8/R10 LATER | Sonnet session per audit; check Tingen and Village options |
| 9 | 31b50c9f UI | O3 day page: one threshold screen each morning or on return | TRACKED-NOT-DONE | Audit R8 O3 only ('O2 and O3 wait for B2 and B4'); no src hit; not in IDEA_INDEX, QUEUE or CHOICES | Add one IDEA_INDEX row so it survives audit churn |
| 10 | 31b50c9f UI | O2 grouped navigation (about six hubs) plus Ctrl+K jump | TRACKED-NOT-DONE | Audit R8 O2 and UR28; no build seen (inferred) | Build after B2/B4 settle |
| 11 | 31b50c9f UI | UIW2 panel sprawl: dedupe list, lazy-mount hidden panels (MDL10) | TRACKED-NOT-DONE | Audit R8 LATER third; ui-refactor PLAN 'Deferred: MDL10'; no lazy mount in workspace_layout.js/panel_reveal.js | Start when the UI freeze owner commits |
| 12 | 31b50c9f UI | UIW3 dev controls (Authoring, Layout, density) out of the player strip | TRACKED-NOT-DONE | `src/workspace_layout.js:496` still builds the 'Authoring' toolbar button; audit R8 LATER third | Move under Settings > Layout behind a dev flag |
| 13 | 31b50c9f UI | UIW4 'Local weather/date unavailable' reads as broken in Tingen header | TRACKED-NOT-DONE | Strings still in `src/world_weather_display.js:15`, `src/world_calendar.js:41`; PLAN morning block 'Found, not fixed' | Hide field or in-world line via UF2 header chips |
| 14 | 31b50c9f UI | UIW6 Tingen workroom as scene-card shape, main action above the fold | TRACKED-NOT-DONE | Audit R8 LATER fourth; ROUND2_BRIEF assigns density to the worlds session; no confirmation of delivery | Confirm in worlds branch or dispatch a Sonnet half-session |
| 15 | 31b50c9f UI | UIW7 back label names a panel ('Appearance') not a place | TRACKED-NOT-DONE | Audit R8 only; not reproduced; stale evidence text in old dispatch folders | Reproduce or close per UR15 |
| 16 | 31b50c9f UI | UIW8 bundle size and first-load measurement; split bundle by world (MDL15) | PARTIAL | R5 measured: PLAY about 2.3 s, 7.8 MB, about 8,900 nodes (PLAN). Audit split trigger is 'passes about 2 s', so it is tripped (inferred); no split built | Decide on world-split session |
| 17 | 31b50c9f UI | UIW9 MCP screenshot mirror shows a different layout than the live build | PARTIAL | Logged with `game_report_limit`; `docs/tools/GAME_MCP_LIMITS.md` covers the screenshot backend; specific mirror fix not seen | Check limits ledger; fix or note |
| 18 | 31b50c9f UI | UIX3: 'proposal' means two things; drop label, keep history in Authoring | DONE | Resolved in audit R9; labels removed | None |
| 19 | 31b50c9f UI | UIX7: evidence names which app (frozen vs dev vs MCP mirror) | DONE | Wording added to UR16 in `docs/UI_RULES.md:139` | None |
| 20 | 31b50c9f UI | UIX8: cast-lives screens fill the UR76 contract now | TRACKED-NOT-DONE | Audit R9 UIX8 and R10 ACCOUNT FOR NOW line 632 | Apply when lead-life panels are built |
| 21 | 31b50c9f UI | UIX5/UIX6/UIX1 follow-ups: checklist reorder, two new screen checks, mounted-budget rule, record load numbers | TRACKED-NOT-DONE | Audit R9 LATER ranked list; no checks found (inferred) | Pick up with UIW2 session |
| 22 | 31b50c9f UI | RPX1 ritual circle and RPX11 relationship web from one figure primitive | DONE | `src/ui/figure.js`, gallery, R3 (80e5b3c97); eleven rep sessions merged | None |
| 23 | 31b50c9f UI | RPX2-RPX20 further representations (brewing tracks, dreams, chases, rumour spread, chronicle, crossings...) | PARTIAL | Many covered by the 20 `docs/representations/*.md` sessions; rest 'follow as each world's lead run reaches them' (audit R10) | Check each against rep docs when a world needs it |
| 24 | 31b50c9f UI | Wave R1-R5 (seat seam, scene card, figure gallery, rules in one place, adoption script) | DONE | Merged 80e5b3c97; `PLAN.md` results | None |
| 25 | 31b50c9f UI | Rules in one place (RIX1-RIX2): SUI, RPT, CLR, CX into standing rulebooks | DONE | R4; `check:rules` warns on unrouted sets | None |
| 26 | 31b50c9f UI | Machine-wide two-slot limiter for suites and browser captures (RCT5) | DONE | `scripts/slot_run.mjs`, `tests/slot_run.test.js`, `package.json` test runs through it | None |
| 27 | 31b50c9f UI | Cap test-runner concurrency so two suites share the machine | DONE | `package.json`: `--test-concurrency=4` under `--max-load 12` | None |
| 28 | 31b50c9f UI | RCT2 representation contract test over gallery fixtures | DONE | f45b0f3d; `tests/representation_contract.test.js` | None |
| 29 | 31b50c9f UI | RCT1 merge order and merge of ~18-21 representation branches | DONE | MERGE_RECEIPT.md; 21 views merged, master 9b8a166b | None |
| 30 | 31b50c9f UI | RCT3 headless screenshot pixel-diff baseline for looks | TRACKED-NOT-DONE | Audit R14 LATER fifth; no baseline in contract test or build script | Sonnet low session |
| 31 | 31b50c9f UI | RCT4 each adapter switches to engine read model or names switch point | PARTIAL | L13 bridges in `src/read_models/`; PLAN lists switch per view; 'switch at merge' not confirmed for all (inferred) | Integrator check per view |
| 32 | 31b50c9f UI | VSX1 living style guide page and VSX2 native figure skin | PARTIAL | No 'style guide' text in gallery files; 'token and style guide' worker running at last report (inferred); 18ee8ef7 moved character sheet to tokens | Verify worker output; check gallery |
| 33 | 31b50c9f UI | VSX3 glyph language (one glyph per subject kind, labelled) | TRACKED-NOT-DONE | Audit R14 LATER fourth; `figure.js` glyph is per-node, no shared set (inferred) | Sonnet low session |
| 34 | 31b50c9f UI | VSX5 one motion vocabulary (settle, glow-in, pulse, fade) as tokens | PARTIAL | `--ui-motion-settle` and effects-off zeroing in `styles/ui_tokens.css`; only part of the set | Add remaining tokens |
| 35 | 31b50c9f UI | Motif layer: role to symbol, line, ornament, motion packs; plain and Luminous | TRACKED-NOT-DONE | Audit R13 LATER first; no 'motif' in figure.js/scene_card.js; role names kept (ACCOUNT FOR NOW) | After representation merge |
| 36 | 31b50c9f UI | First world pack for LOTM (brass, ink, tarot frames) and per-world art notes | TRACKED-NOT-DONE | Audit R13 LATER second/third | Needs his look at gallery |
| 37 | 31b50c9f UI | Injury middle path: overall HP, per-part only where a rule reads it | DONE | USER_VISION 2026-10-30; CHOICES 'Answered'; harm lane b8da5ec4a | None |
| 38 | 31b50c9f UI | Optional `part` field on conditions, plus save migration | PARTIAL | Open gap in a45 lines: closes when harm lane slice 2 lands | Harm slice 2 |
| 39 | 31b50c9f UI | Travel direction: seven considerations to maps and time sessions | PARTIAL | TC23 leave-by in `docs/representations/TIME_AND_CHRONICLE.md:397` (proposal); only four proposals were committed | See dropped list for the other three |
| 40 | 31b50c9f UI | Round-2 brief items 16 (fold into existing UI), 19 (levels and depth), 21 (all drafts) | DONE | `ROUND2_BRIEF.md` | None |
| 41 | 31b50c9f UI | Research and study session: map idea docs to code, build one honest slice | DONE | 39a96944, c4d46706; `docs/representations/RESEARCH.md`; Study panel | None |
| 42 | 31b50c9f UI | Queued Sonnet sessions: homes and base building, gathering and seasons, companions and party | TRACKED-NOT-DONE | PLAN 'Still queued'; morning block item 4; no HOMES/GATHERING/COMPANIONS doc in `docs/representations/` | His go to start |
| 43 | 31b50c9f UI | Token cleanup: 49 hard-coded style literals allowlisted instead of tokens | PARTIAL | 18ee8ef7 retired 8 entries; `tests/ui_contract_allowlist.json` now 772 entries after draft rep styles (reset in 0a5158ae) | Token worker finish; migrate rest |
| 44 | 31b50c9f UI | Four stale proof scripts; get encounter and fight cards reached | DONE | da8e7acc; all 8 views reached at 1920x1080 | None |
| 45 | 31b50c9f UI | Found-not-fixed: talk center covers native 'hello'; hidden duplicate `report_in`; first-visit tab hint reads as panel text | TRACKED-NOT-DONE | PLAN morning block and MERGE_RECEIPT lines 79-87; not in CHOICES/QUEUE/IDEA_INDEX | Move to a UI defects list or a Sonnet fix session |
| 46 | 31b50c9f UI | 45 failures 'Invalid game calendar' from another lane's unfinished work | DONE | Later full suite 4455/4476 and failures fixed (MERGE_RECEIPT); (inferred) cleared | None |
| 47 | 31b50c9f UI | Audit gaps in the lead's run, other characters' runs, empty states, saves, performance, accessibility | DROPPED-UNTRACKED | Listed as round 10 item in chat; no 'empty states' or 'accessibility' text in audit (grep) | See dropped list |
| 48 | 31b50c9f UI | Unconventional option priced for a later slice (round 10 item 9) | DROPPED-UNTRACKED | Chat only; O3/O4 are round 8 options, not clearly this one (inferred) | Confirm what it was; log it |
| 49 | 31b50c9f UI | Shadow Slave '(a proposal)' label kept for old-save wording | TRACKED-NOT-DONE | Audit R9 follow-through line 540; old-save compat is deferred in USER_VISION so the reason may be stale (inferred) | Remove label |
| 50 | a45ef88c wave | Pilot lanes L1-L3 plus L6 read-forward | DONE | f007ac639, ba4aea711; LEDGER | None |
| 51 | a45ef88c wave | L4 rites, divination, summons, potions, crafts: volume 1 then volumes 2-8 | PARTIAL | L4 Luna/Sol briefs in dispatch, 9e4bf365d, 30871ea4; later volumes ongoing | Continue per QUEUE walk |
| 52 | a45ef88c wave | L5 places and services (GM19) | TRACKED-NOT-DONE | PLAN row L5 'wait for L2's ranked list'; QUEUE gives GM19 to `sw-road` | Confirm sw-road owns it |
| 53 | a45ef88c wave | Ledger items 1, 2, 4: routines after month one, household schedules, opening hours | PARTIAL | CHOICES 3; LEDGER `sw-r3-c2-routine` launched; QR6a | Land results |
| 54 | a45ef88c wave | WB1: sample ~20 later-volume rows before fixing a data shape | DONE | WA48 accepted; extended to sibling books 5a2c28e07 | None |
| 55 | a45ef88c wave | WB2-WB8 whole-book and cross-book gap register (GM20+) | DONE | 2e2cfcb7a: GM22-GM40, family-by-book table; WA49 accepted | None |
| 56 | a45ef88c wave | WB8 populate other books' worlds (GM20, GM21 day-one lives) | TRACKED-NOT-DONE | QUEUE 'Not owned by this wave'; CHOICES 5 says start after GM40 | Start the other-book wave |
| 57 | a45ef88c wave | L8 character records and `sheetAsOf(person, chapter)` (WA50) | PARTIAL | `src/character_sheets.js`, tests; 5-principal pilot; QR6b queue for more | Add principals |
| 58 | a45ef88c wave | Gap workers: death/harm/restart (L9), advancement (L10), second city (L11) | PARTIAL | Slices landed read-model only (A_CHECKPOINT); host wiring pending | sw-wire consumers |
| 59 | a45ef88c wave | L12 slot limiter, L13 read-model bridges, L14 calendar and news | DONE | slot_run.mjs; `src/read_models/`; L14 briefs and commits | None |
| 60 | a45ef88c wave | Remaining gaps: GM29 mind effects, GM30 gatherings, GM33 artifacts, GM35 knowledge | TRACKED-NOT-DONE | QUEUE owner table (GM29 to memory lanes; GM30 sw-road; GM33 sw-rites after vol 2; GM35 sw-calendar) | Staff when lanes report |
| 61 | a45ef88c wave | GM40 spells as one shared seam, then GM20/GM21 | PARTIAL | 5b3703fa 'implemented, below floor'; CHOICES 5 | Floor check; then GM20/21 |
| 62 | a45ef88c wave | Whole-book charter and per-lane idea intake (`ideas/`) | DONE | QUEUE.md 69402dfd2; nine `ideas/*.md` files | None |
| 63 | a45ef88c wave | Sweep intake into owners (WA lines, GM rows, QR6, CHOICES) | PARTIAL | cee7415e1 folded 141 lines; ideas files now ~286 lines (inferred newer ones unswept) | Run another sweep |
| 64 | a45ef88c wave | Injuries shift odds by degree (accuracy, force, speed, evasion) | DONE | b8da5ec4a planned modifiers function | None |
| 65 | a45ef88c wave | Wire read models to playable host consumers (sw-wire) | PARTIAL | Round 2 note: still unwired; divination only consumer; fact supplier WA51/QR6d | Floor wave |
| 66 | a45ef88c wave | Scripted Chrome floor runner | DONE | `scripts/floor/run_floor.cjs`, `tests/floor_budget.test.js`, `floor_receipt.test.js` | None |
| 67 | a45ef88c wave | Rite and craft effect engine ('owner-needed' effects) | PARTIAL | 30871ea4; host patch waits on floor-wire (CHOICES 1) | Land host patch |
| 68 | a45ef88c wave | 'Tingen railway station' invented start point, check against the text | DROPPED-UNTRACKED | `src/book_world_lotm_cities.js:9-12` flags it 'Authored proposal' (WPR5) in code only; no QUEUE/CHOICES/IDEA_INDEX row | Add a verify-against-text row |
| 69 | a45ef88c wave | Main checkout `book_world_lotm_host.js` out of step with HEAD | DONE | File absent from the session-start modified list (inferred resolved) | None |
| 70 | a45ef88c wave | Timing gap: 854 of 1,319 routine rows lack time of day | PARTIAL | CHOICES 3, A4 Luna timing pilot brief, QR6a | Run pilot |
| 71 | a45ef88c wave | 91 unbound routine cards never come due | PARTIAL | CHOICES 3; `sw-r3-c2-routine` launched | Land binding |
| 72 | a45ef88c wave | Chinese collated full text for Circle of Inevitability | TRACKED-NOT-DONE | CHOICES 10 (default: only on a translation gap) | None |
| 73 | a45ef88c wave | Repair weak shards in volumes 2-8, step enrichment | TRACKED-NOT-DONE | IDEA_INDEX QR6 | Luna lanes when quota allows |
| 74 | a45ef88c wave | Luna queue stop line 70% until 2026-11-04 Codex reset | PARTIAL | 76e0817b commit marked proposal | His yes or silence |
| 75 | a45ef88c wave | Stop lines 75% Claude / 85% Codex, hard end Monday 11-02 11:00 | DONE | QUEUE.md walk rule 6 | None |
| 76 | a45ef88c wave | Tell UI coordinator which rep session reads which lane | DONE | ui-refactor PLAN 'Read models from the sonnet wave' table | None |
| 77 | a45ef88c wave | Round 3: six Codex Sol lanes (ability costs, routine bindings, prices, rites 4-8, texture, thin sheets) | PARTIAL | 435c3af2 briefs, `codex-r3/`; launches in flight; Luna follow-ups and 15-row spot-checks wait | Collect outputs, spot-check |
| 78 | a45ef88c wave | Ghost fill on the ability rung and costs for rows with no stated cost (CHOICES 2) | PARTIAL | `src/ability_ladder_figure.js` has ghost/words and is modified, uncommitted; costs not seen | Commit; then cost default pass |
| 79 | a45ef88c wave | Cast pack load and long-wait performance (audit F9) | TRACKED-NOT-DONE | 62429908 diagnosis only; `PERF_LOAD_AND_LONG_WAIT_2026-10-30.md` | Fix lane |
| 80 | a45ef88c wave | Overnight supervisor with agreed nudge split | DONE | `OVERNIGHT_2026-10-30.md` | None |
| 81 | a45ef88c wave | WA51-WA53 acceptance; save compatibility for new rows | TRACKED-NOT-DONE | CHOICES 6, 11 | His answer |

Counts: total 81; DONE 28, PARTIAL 26, TRACKED-NOT-DONE 24, DROPPED-UNTRACKED 3. By coordinator: 31b50c9f UI: DONE 17, PARTIAL 13, TRACKED-NOT-DONE 17, DROPPED-UNTRACKED 2; a45ef88c wave: DONE 11, PARTIAL 13, TRACKED-NOT-DONE 7, DROPPED-UNTRACKED 1.

## 2. Dropped and untracked (main deliverable)

Strict hits (not in CHOICES, QUEUE, LEDGER, `ideas/`, IDEA_INDEX, the UI audit or either PLAN):

1. **Three of the seven travel considerations.** The maps and time sessions were sent seven; only four were committed (TC23 leave-by among them). Wording in chat for the lost ones: "planning helps: leave when ready", and "measure it: fixed seed, near vs far lodging, big gap means rebalance". Greps for `leave when ready` and `near lodging` found no current doc. Which three is inferred. Next: add the two named ideas to `TIME_AND_CHRONICLE.md` or `MAPS_AND_TRAVEL.md` as proposals.
2. **Round 10 audit gaps** (other characters' runs, empty states, saves, performance, accessibility). Chat lists them; the audit has no text for empty states or accessibility. Next: one audit row each, ranked.
3. **Round 10 item 9, the unconventional option priced for a later slice.** Only in chat; not matched to a saved option (inferred). Next: recover from the Round 10 transcript and save it.
4. **'Tingen railway station' as an invented start.** Flagged only by a code comment; nothing queues the check against the text. Next: one QUEUE or ledger row (verify against the book, then keep or remove).
5. **Found-not-fixed UI defects** (talk center covers 'hello'; hidden duplicate `report_in` behind workroom tabs; first-visit tab hint reads as panel text). They exist only in the ui-refactor PLAN morning block and MERGE_RECEIPT, which are checkpoints, not queues. Counted TRACKED-NOT-DONE above, but they have no owner or lane. Next: give them a Sonnet fix session or a defects list.

At risk of drifting (tracked in one place only, easy to lose):

- **O3 day page.** Only in audit round 8 text; absent from IDEA_INDEX, QUEUE, CHOICES. Next: IDEA_INDEX row.
- **Ideas intake after the 141-line sweep.** The `ideas/` files hold about 286 lines; cee7415e1 folded 141 (inferred later lines unswept).
- **Shadow Slave label.** Its reason (old saves) conflicts with old-save compatibility being deferred.

## 3. UI and intuitiveness ideas

Delivered: return digest ('While you were away', pinned in Reports); labels stripped of 'proposal'; Luminous Gothic default; figure primitive, scene card and seat seam; blocked reason next to each option on Village encounter cards; 21 feature views merged and reachable at 1920x1080.

Tracked, not built (ranked by audit): UIW3 dev controls out of the player strip; UIW2 panel dedupe and lazy mount; UIW4 'unavailable' wording; UIW5/B3 specific blocked reasons; UIW6 Tingen workroom as a scene card; O2 grouped nav with Ctrl+K; O3 day page; VSX3 glyph language; VSX5 full motion set; motif layer and world packs; RCT3 pixel baseline; UIX8 UR76 contract for cast-lives screens; homes, gathering and companion views.

Dropped: the three travel considerations, round 10 audit gaps (empty states, accessibility), the unnamed unconventional option, and the three small intuitiveness defects (hello covered, duplicate `report_in`, tab hint) that have no owner.
