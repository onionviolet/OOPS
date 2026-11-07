# Idea audit 2026-11-06, lane 4: master playability plan and the older ranked lists

Read-only audit lane (sonnet). HEAD `3beb0857d` at start, `b68e4c88d` at end. Part of [IDEA_AUDIT_2026-11-06](../IDEA_AUDIT_2026-11-06.md), which defines the classification words. Proposals only (AD32). `Plan` = `docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md`.

## Inputs read

- `PROJECT.md`, whole. `Plan` lines 1-590 (rounds 1-13, B137, B569, B607).
- `docs/audits/IDEAS_TRIAGE_2026-10-26.md`: lines 1-159 in full and the rest at 420 characters per line (P01-P20, remaining rows, C1-C5, S01-S12).
- `docs/audits/IDEAS_NESTED_TRIAGE_2026-10-26.md`, whole, at 500 characters per line.
- `docs/audits/IDEAS_LEFT_INVENTORY_2026-10-25.md`: lines 1-53, 614-640 and 868-939; mid sections through the nested triage only.
- `docs/audits/GAP_AUDIT_2026-10-30.md`, `docs/audits/REFINEMENT_PRIORITIES_2026-10-31.md`, whole.
- `docs/gm/dispatch/village-loop-2026-10-27/BACKLOG_UI_CHECKPOINT.md` lines 74-175 (P02-P10 receipts). `docs/audits/LARGER_FOUNDATIONS_2026-11-06.md` lines 1-47. `MECHANISM_BACKLOG.md` by grep.

## Ledger

### Plan: stages, packet, round 1

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| M1 | Play cards for 5 routes, runnable build | Plan:41-51 | m1-route-walk `ROUTES.md` | Prepare cards; walk by MCP then browser | `ROUTES.md` exists (MCP walk, 2 passes). No play-card file found. Adoption cited is v0.6; the host is now Tauri | stale-doc | Cards unwritten; adoption baseline superseded by Tauri host |
| A1 | Immediate next packet: M1 cards, one M2 slice | Plan:116-122 | `ROUTES.md` → P02-P10 | Cards first | P02-P10 UI slices landed 2026-10-27; cards absent | stale-doc | Same as M1 |
| M2 | Continuous session friction fixes | Plan:53-59 | Q18 P02-P10 → village UI | Fix blocked reasons, stop reasons | `0298c2c6d`, `f0352c95e`: DRC11/12 reasons, P06 titles, P09 drink effects. Receipt: "below floor, no browser" | done-below-floor | Browser walk for DRC12 harvest reasons |
| M3 | Deepen worlds past openings | Plan:63-76 | PROJECT focus 1-2 | LOTM then HP | Klein KJ3AE and HP windows exist; PROJECT owns | duplicate | PROJECT focus 1 and 2 |
| M4 | Selected mechanics through useful lives | Plan:78-94 | crosswalk owners | Consumer-driven | No build row; consumer-driven by design | parked | A selected M3 consumer needs a helper |
| M5 | Further horizons and worlds | Plan:96-104 | accepted source queue | Local closure per world | None built as a stage | parked | Selection of a distinct world |
| MC1 | Use adopted baseline | Plan:130 | doc edit | Done | Text present; the baseline (`v0.6-0e5bb8f76aef`) predates Tauri | stale-doc | Doc-only fix when touched |
| MC2 | Drop accidental waiting | Plan:132 | doc edit | Done | Present as text | done-floor | Doc-only |
| MC3 | Reachability: natural vs fixture on cards | Plan:138 | cards | Account for | No cards. Some routes use fixtures (`village-craftsman` recipe `8821c275c`) | parked | Applies when cards are written |
| MC4 | Repeat practice needs real supply | Plan:139 | `book_world_lotm_bench.js` | Finite stock deliberate | Lazy seed once per revision (lines 54-60); no restock path | parked | Applies when a pursuit needs repeat supply |
| MC5-MC7 | Time offers a choice; depth includes response; authored breadth vs discovery | Plan:140-142 | AD16-18, AD38, UIV6 | Account for | Rules only | parked | Per slice |
| MC8 | Opening comfort is not long-save proof | Plan:143 | PF1 | Account for | `b1845a61e` Tauri save store is performance-adjacent. No PF1 benchmark found | parked | When a slice grows rows |
| MC9 | Continuation recap | Plan:149 | P10 | Conditional | P10 closed: return restores goal, minutes and Stop, "no recap UI needed" (`f0352c95e`) | parked | Reproduced return problem |
| MC10 | Reusable earned-checkpoint fixtures | Plan:150 | `scripts/playtest`, MCP | LATER | Scenario recipes exist (`8821c275c`); no library or hash index | ready | Locate fixtures, then build the index |
| MC11 | LOTM first step: use, not new ability | Plan:165 | lotm-pathway-gen | Default first slice | Abilities now exist: `book_world_lotm_abilities.js`, Sun Seq 9-8 and Klein Seq 7 (`1ec64ae02`) | duplicate | KJ3 windows and LG1/LG9 |
| MC12 | Director backlog is long | Plan:171 | AD42 | Superseded in text | AD42 at `RULES_INDEX:252` | contradicted | AD42 |
| MC13 | Another writer live | Plan:172 | dated 10-25 | Observation | Dated; a different set of dirty files now | stale-doc | Check live writers per slice |
| MC14 | MCP reachability pass | Plan:173 | `ROUTES.md` | Walk cards first | MCP walks recorded (2 passes) | done-below-floor | Browser proof still open |
| MC15 | Retire merged worktrees | Plan:179 | worktree list | LATER | `git worktree list`: 0 `codex/*`; the 12 listed are `.claude/worktrees/rep-*` | stale-doc | Lane 7 |
| MC16 | Archive two idle Claude sessions | Plan:180 | sidebar | Weibao action | Not checkable from the repo | needs-yes | Weibao action |

### Plan: rounds 3-5

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| LT1 | Verb of each world | Plan:202 | decide on play | Slow | No verb sentences; `docs/PLAYTEST.md` last substantive edit 2026-10-22 | needs-yes | After play on a world |
| LT2 | How many worlds deep | Plan:203 | direction | LOTM + HP | PROJECT focus 1-2 matches | parked | A two-hour life he keeps playing |
| LT3 | Save shape for many lives | Plan:204 | `lives_carry_domain`, Tauri store | Decide before a 3rd concurrent life | Not decided in code | parked | Third concurrent life |
| LT4 | How content gets made | Plan:205 | scripts | Hand rows | `build_cast_pack.mjs` generator exists | parked | Boilerplate repeats across about 3 slices |
| LT5 | Active vs idle mix | Plan:206 | AD16-18 | Defaults | `away_bank_domain` exists (G15) | parked | Play notes |
| LT6 | Process weight per slice | Plan:207 | AD43 | After a month | Not counted | parked | A month of slices |
| DC1-DC5 | Daily 15-20 min play and notes; note to slice; weekly options; audits only when needed | Plan:217-221 | Weibao, agent | Proposal | No `PLAYTEST.md` DC entries; process | needs-yes | His routine |
| ON1 | One night run on `night/<date>` | Plan:235 | scheduler | Proposal | No `night/*` branch | needs-yes | Weibao yes |
| ON2-ON10 | Night kinks; first night trial UIV1 | Plan:239-248 | ON1 | Defaults | Nothing built; B137 says unselected | parked | ON1 |
| ZM1 | Page zoom shrinks layout | Plan:256 | host | Add 125/150% to matrix | Zoom now Tauri `set_zoom`, 10% steps, 50-200% (`desktop.rs:127-139`). Doc cites Electron `app_menu.cjs`, removed `4b4465412` | stale-doc | Host changed |
| ZM2 | Cmd +/- steps text presets | Plan:257 | `customization_ui.js` | Proposed | `desktop.rs` zoom changes page zoom, not text size | ready | B137: shortcut replacement not selected; open choice |
| ZM3 | Register `Cmd+=` and `Cmd+Plus` | Plan:258 | host | Proposed | `desktop.rs` accelerators for Save, Export, Reload; none seen on zoom | stale-doc | Recheck on Tauri |
| ZM4 | Pop-out follows scale; persists | Plan:259 | host | Proposed | Not checked | unverified | Tauri app check |
| ZM5-ZM6 | Fullscreen/half-width; build ZM2-ZM4 | Plan:260-262 | UI slice | LATER | Not built | ready | Same as ZM2 |
| PR1 | Write from what the character knows | Plan:270 | WER3 entry text | Proposed | `book_world_lotm_entry.js:29-54` still says "Nighthawk office", "church teams know your old ties". Later direction: low-spoiler player starts (WORLD_ENTRY_RULES, 2026-11-01) | ready | Rewrite entry answers; conflict 3 |
| PR2-PR4 | Costs not reveals; spoiler dial; one voice per surface | Plan:271-273 | prose | Proposed | No prose rulebook in `RULES_INDEX` | ready | PR6 |
| PR5 | Prose lint over names | Plan:274 | `check:rules` | Proposed | `check:rules` runs three scripts, none a prose lint. B137: cannot replace observer-aware disclosure | parked | Weibao selection |
| PR6 | Prose rulebook then rewrite Tingen entry | Plan:276 | prose | LATER | Not done | ready | Needs a Weibao request to register a rulebook |
| TL1-TL7 | Travel loop palette; paused lives at reduced rate | Plan:295-301 | direction | Defaults | B137: not general laws; TL7 not built | parked | Per world; LT3 |
| TL8 | First exchange slice: learn in Tingen, use in Village | Plan:302 | RET7, carry ledger | First slice | `carry_ledger.js` rows are Frontier and Paradise only; no Tingen rows | ready | Add Tingen rows |
| IB1-IB5 | Idea-bank process | Plan:310-314 | process | Proposed | Process | parked | DC4 days |
| UT1 | Header mark: world, life, date | Plan:322 | UI | Proposed | Grep found none | unverified | Check in app |
| UT2 | Carry list on crossing confirm | Plan:323 | `carry_ledger` | Proposed | No Tingen carry rows | ready | TL8 |
| UT3 | "Nothing happened" return note | Plan:324 | return note | Proposed | B569: Village arrival note with standing text and current-wait exists (VC3a) | done-below-floor | Cross-world case not shown |
| UT4-UT6 | Knowledge origin; keep place; one crossing verb | Plan:325-327 | UI | Proposed | Not checked | unverified | Check on Tauri |

### Plan: rounds 6-11

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| BC1-BC8 | Cheat as thread, stages, branches, fusion, lineage | Plan:348-355 | `cheat_*.js` | Proposed | `cheat_growth.js` has 8 milestones, no world-first ones | parked | After BC2 and BC9 |
| BC9 | First slice: world-first milestone and one branch | Plan:356 | `cheat_mechanisms.js` | First slice | Not built | ready | Weibao selection |
| SC1-SC6 | Regions are packs; thin before thick | Plan:362-369 | `world_packs` | Proposed | Packs exist for HP, MoL, Gu, Shadow Slave; no Backlund region | parked | HR4 reason to go |
| HR1 | Show ladder, lock rungs | Plan:377 | `pathway_card.js` | Proposed | Card exists as proof page, no live host mount (REFINEMENT F2/A4) | in-progress | Card mount belongs to the LOTM owner |
| HR2-HR3 | Rung = consumer chain; headroom from places | Plan:378-379 | rules | Proposed | `book_world_lotm_seq7.js` exists; "not offered" stub rows remain in `path.js:24` and `pathways.js:82` | stale-doc | Conflict 2 |
| HR4 | Build Seq 7 for one pathway first | Plan:380 | LOTM | Proposed | Done by `1ec64ae02` (Klein Seq 7) | duplicate | KJ3/LG9 |
| HR5-HR6 | Power scales in world; typed rung rows | Plan:381-382 | pathway data | Proposed | Typed fields per rung not confirmed | unverified | Read `pathways.js` rung shape |
| SK1-SK7 | Skill verbs, specialization, synergy, decay | Plan:388-394 | skills | Proposed | Not checked | parked | Selection; SK7 limits to 3-5 skills |
| VL1 | Village is test bed for loop work | Plan:416 | Village | Scope | VL1, VC3a, VC2n, VC12 in the checkpoint | done-below-floor | Browser/persistence per checkpoint |
| VL2 | Proto23 village = original village | Plan:417 | proto23 | Interpretation | `proto23_world_*.js` exists as an original branch | done-below-floor | Weibao can still correct |
| VL3-VL7 | Identity thread; Proto23 loops; sessions; self-audit; Discord | Plan:418-422 | GM_PLAN | Process | B569 qualifies VL4 | stale-doc | VL4 |
| WV1 | Three sibling worlds | Plan:434 | packs | Proposal | Only the original Proto23 branch; no faithful Proto23 or YAIR pack | ready | PROJECT focus 4: needs his yes |
| WV2 | Keep current Village as variant | Plan:435 | direction | Default | Unchanged | parked | None |
| WV3-WV6 | Port rules, NOTICE, licence risk, faithful tests | Plan:436-439 | direction | Proposal | No NOTICE file; no push without his yes | needs-yes | PROJECT item 4 |
| WV7 | Three-world carry test | Plan:440 | carry | Proposal | Not built | ready | After WV1 |
| WV8 | Pack fingerprint in life record | Plan:441 | `world_pack_registry` | Proposal | Registry projection emits `fingerprint`; per-life record not confirmed | in-progress | Partial |
| WV9-WV12 | Port by loop step; YAIR config; identity; sealed | Plan:442-445 | proposal | Proposal | Nothing built | ready | WV1 |
| RT1-RT3 | Kill passes, critic, attack questions | Plan:457-459 | process | Proposed | Process | parked | Per world plan |
| PW1-PW2 | One page per world; contrast table | Plan:460-461 | docs | Proposed | Not found by file name | ready | Docs only |
| UF1 | Cohesive shifts, invariant layout | Plan:462 | UI | Proposed | B137: not to override functional housing and prose-first | contradicted | USER_VISION 2026-11-04 prose-first |
| UF2-UF7 | Header, world panel, cheat panel, rules, bank-as-UI, first slice | Plan:463-468 | UI | Proposed | `cheat_ui.js` exists; others unchecked | unverified | Check in app |
| CP1-CP9 | Comparable games leads | Plan:480-488 | research | Unverified leads | CP3 shape: `storylet_deck.js` built for the Village (`4e444a5e1`) | parked | CP-LATER source pass |
| OL1-OL5 | Overarching loop palette | Plan:493-498 | palette | Proposal | None selected | parked | None |
| WR1 | World loop card per world | Plan:508 | WPR | Proposed | No card files | ready | Docs only |
| WR2-WR10 | Three evenings; failure is content; storylets; second-world proof; scope line; retire | Plan:509-517 | rules | Proposed | B137: WR9 cannot postpone Klein/HP; WR8 not an embargo | contradicted | AD51, B137 |
| NPA | NPC absence, canon protagonist, time travel, conceptual abilities reports | Plan:525-531 | `docs/research/` | Proposals | Lane 5 | parked | Selection |

### Plan: round 12 table, horizon, rounds 13/B137/B569/B607

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| R12-1 | X16 AD50 commit | Plan:552 | `RULES_INDEX` | Missing at HEAD | AD50 line present (`RULES_INDEX:265`, `e9b2ce341`). USER_VISION section and END_RUN doc not checked | stale-doc | Check the two companion files |
| R12-2a | `canon_pull_panel` has no importer | Plan:553 | `native_tool_domains.js:15` | 0 importers | Imported at line 15; `lotm_pull_slice.js` exists | stale-doc | None |
| R12-2b | `lotm_price_map` wire or retire | Plan:553 | scripts | 0 importers | Used by `scripts/lead_run/coverage_ledger.mjs` and its test only; nothing in `src/` | ready | Wire or mark banked-cold |
| R12-2c | `invention_receipts` wire or retire | Plan:553 | scripts | 0 importers | Used by `scripts/invention_qa.mjs` and its test only | ready | Same |
| R12-2d | `anchor_snapshots` | Plan:553 | tests | 0 importers | Test only. GAP_AUDIT G15: waits on an authored event graph with a consumer | parked | A world ships an event graph |
| R12-3 | S8 pack save | Plan:554 | `world_pack_registry.js` | `world_pack_save` 0 importers | Registry imports it and registers domain `world_packs` with save, load, `reveal` command. No gameplay caller of `reveal` | done-below-floor | A gameplay trigger for `reveal` |
| R12-4 | H4 receipt; CG3/5/7 lead first screen | Plan:555 | Klein lane | Next | Dirty `book_world_lotm_ui.js` suggests live work; not tied to this row | unverified | Lane 1 |
| R12-5 | H2 rewind | Plan:556 | `loop_table`, bk-mol | Shared checkpoint | G15: bk-mol restart uses its own model, not anchors. No shared checkpoint | ready | Plan step 2 decision |
| R12-6 | Hunger Games doc then arena slice | Plan:557 | B607 doc | Doc exists, slice unbuilt | B607 confirms doc; no arena code | ready | Slice |
| R12-7 | G7 making donor, runes | Plan:558 | `rune_grammar` | Next | Not checked | ready | Weibao yes for any acquisition |
| R12-8 | H7, H3, H5, H10 | Plan:559 | per world | Later | Nothing | parked | WR9 |
| R12-9 | G2, G10, G9, G8, G6 palettes | Plan:560 | palettes | Keep in palettes | G2 generators and G6 hit location are built since | stale-doc | Row text behind code |
| R12-10 | Named-method parity defect | Plan:561 | `crafting_frontier_runtime.js` | Fix first | `stageCrafting` re-quotes with `quoteCrafting` (lines 173, 211); `tests/crafting_runtime.test.js` 7/7 | stale-doc | Round 13 already says repaired |
| R12-11 | Unmapped systems, K21/K27/K31/K32 | Plan:562 | front door | Maturity words | Not checked | ready | Per touch |
| R12-12 | H12 `build_cast_pack.mjs` uncommitted | Plan:563 | scripts | Owner commits | Tracked; commits `e3d933e80`, `87321c9dc`, `dc5f00240` | stale-doc | None |
| R12-H1..H4 | Horizon now / next / later / long term | Plan:540-543 | PROJECT, slices, worlds | Order | Now matches PROJECT 1; next = R12-3..6; later and long term unselected | duplicate / parked | PROJECT focus 1; after LOTM-first |
| R12-Q | Open decisions: test-bed retirement, Proto23 push, Witch Hat, AD50 commit | Plan:544 | Weibao | Questions | AD50 committed; other three open | needs-yes | His yes |
| R12-C | Complexity floor (W22, cost drivers) | Plan:546 | note | Account for | Not refreshed since 2026-10-14 | parked | When estimating |
| R13 | Foundation plan reuse boundaries | Plan:565-570 | `FOUNDATION_WORLD_ENABLEMENT_PLAN` | No wave selected | Larger-foundations doc (`2844df1eb`) is the later owner | parked | Selected consumer |
| B137 / B569 / B607 | Reconciliation notes | Plan:572-590 | notes | Historical horizon; Village; Hunger Games | Consistent with PROJECT and owners | parked | None |

### IDEAS_TRIAGE: P01-P20

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| P01 | Finish cohort fixture, browser play cards | Triage:17 | `ROUTES.md` | Ready | No cards; cohort fixture status not found | ready | Cards |
| P02 | Explain blocked actions (DRC10-12, UIA15) | Triage:18 | `0298c2c6d` | Ready | DRC11 and DRC12 done in source; DRC10 residual skipped; UIA15 not reproduced; "implemented, below floor" | done-below-floor | Browser walk for harvest reasons |
| P03 | UIA13/14, UI L8 measurement | Triage:19 | `1a5b15c59` | Ready | Place-action rows use Village grammar; UIA13 measured, no change; hover/disabled untested | done-below-floor | Real-play sample |
| P04 | UIA4/L6 fractional geometry | Triage:20 | `4ddd71e33` | Ready | Measured; proposal only (tokenized line-heights); no code | parked | Weibao's density call |
| P05 | UI L7 type values | Triage:21 | `4ddd71e33` | Ready | Synthetic bold removed on Gothic titles; off-role sizes recorded, not migrated | done-below-floor | Migrate sizes with P04 |
| P06 | DL6 long labels | Triage:22 | `f0352c95e` | Ready | Titles keep full name; Reports filter shrinks first | done-below-floor | None |
| P07 | DL9 time/weather signals | Triage:23 | `f0352c95e` | Ready | Checked, no change; no code | parked | None |
| P08 | UI L9/DL2/DL10 tooltip/motion | Triage:24 | `f0352c95e` | Ready | One reduced-motion token switch plus scanner guard | done-below-floor | Tooltip frame left to incumbent |
| P09 | DRC9 observed drink effects | Triage:25 | `f0352c95e` | Ready | "Drink one" names observed effects | done-below-floor | None |
| P10 | MC9/5/7/8 diagnostic | Triage:26 | `f0352c95e` | Ready | Return restores goal, minutes, Stop; no code | parked | Reproduced return problem |
| P11 | First missing LOTM use/contact join | Triage:27 | KJ3 receipts | Ready | Seq 9-8, Seq 7, abilities and Divination Club windows built | duplicate | KJ3A to KJ3AE, LG1/LG9 |
| P12 | HP continuing school/adult pursuit | Triage:28 | HP plan | Ready | `33ffbf7e0`, `61b3d9238`, `5cccc0bf8` | duplicate | HP plan windows |
| P13 | Map engine facts to enforcers (HP, LOTM, Fanren) | Triage:29 | docs | Ready | No map doc found | ready | Docs only |
| P14 | Filtered census loader for one book world | Triage:30 | pack loader | Ready | `build_cast_pack.mjs` builds whole-book packs; no filtered loader by that name | duplicate | Partial overlap with `build_cast_pack.mjs` |
| P15 | Depth/signature meter | Triage:31 | author tool | Ready | Not found | ready | Docs/script |
| P16 | Supply path for repeat practice | Triage:32 | bench | Ready | Seed once; restock not found; FD3 ready-stock seam (`aac8d1188`) is the later economy lane | parked | A pursuit needing repeat supply |
| P17 | Formula acquisition join | Triage:33 | merit, store | Ready | Backlog G2 lists formula routes; receipts not read | unverified | Read the KJ3 receipts |
| P18 | Book text grant, reader | Triage:34 | knowledge | Ready | Not found | ready | Pick reader |
| P19 | Services/routes census for a queued world | Triage:35 | source library | Ready | Not checked | ready | Bounded extraction |
| P20 | Close earliest unresolved source fact | Triage:36 | source windows | Ready | Not checked | ready | One source window |

### IDEAS_TRIAGE: remaining rows (167 rows incl. P01-P20; families IPC 28, DWF 32, WG 24, DRC/UIA/EL/playtest 14, WPD 10, U/C2/DEDUP/Q 10, Master M/MC 7, D2 5, other 17; sampled 10)

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| EL6 | Three bone-handle outputs | Triage:38 | `items.js` | Built, unverified | `items.js:2623` defines "Medium weak bone handle"; recipe-side names not compared | unverified | Compare recipe outputs to templates |
| DRC6 | Sold lot survives trader refresh | Triage:41 | trader | Needs consumer | No sold-lot retention code found | ready | Needs a consumer |
| DRC14/15 | Defeat-cause key; defeat by fight state | Triage:44-45 | `harm_engine.js` | Needs consumer | No defeat-cause key found | ready | Needs a consumer |
| U3 | Pathway module-link test | Triage:87 | tests | Compare to later candidate | `tests/lotm_pathway_rows.test.js` exists; not run | unverified | Run if relied upon |
| IPC17 | Compact MCP view | Triage:115 | `game_worker.mjs` | Superseded, built | `compact(full, scope)` with baseline/delta at lines 54-61 | done-below-floor | None |
| IPC49 | `tools/correction_sweep.py` | Triage:124 | tools | Keep and improve | File does not exist | stale-doc | Locate the tool or retire the row |
| IPC74 | Queue-check script | Triage:133 | `scripts/` | Proposal | Only `scripts/test_queue.mjs`, unrelated | ready | Script |
| DWF183 | Ten charms | Triage:159 | HP life data | Open | `hpSpellRows` drives abilities in `book_hp_life_data.js:86`; spell count not tallied | in-progress | Tally rows against ten |
| DWF186 | `authored_site` places with keepers | Triage:161 | `authored_site.js` | Not ready | Module and UI exist; six-place target not checked | unverified | Check place count |
| WG13 | Parked world row | Triage:61 | COVERAGE | Not selected | Doc says PARKED | parked | Later selection |
| Rest | Other families (kit, cards, DWF, WPD) | Triage | various | Proposals | Not sampled | unverified | Rows left unmapped |

### IDEAS_NESTED_TRIAGE (grouped)

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| NT-MIE | MIE-G1-G14, MAW-X1-X9 | Nested:21,23 | making register | Retained | `craft_material_fit.js` exists; whole-formula breadth open | parked | Selected consumer |
| NT-PWS | PROGRESSION_WORLD_STATE G1-G14 | Nested:22 | `progression_gates.js` | Retained | Overflow consumer not re-checked | parked | Selected gate |
| NT-ACCT | 403 ACCOUNT/LATER rows | Nested:24 | palettes | Retained | Frozen crosswalk, not re-run | parked | Per slice |
| NT-RP | RP1-RP9, SP1-SP3 kit ranges | Nested:25,40-51 | kit | Proposal | Cards README says combined grid UNKNOWN | parked | Per selected world |
| NT-CARDS | 30 world cards | Nested:53-59 | cards | Proposal | Not rechecked | parked | Selection |
| NT-BF | BF28-BF94 | Nested:27 | BF doc | Palette | Not a 67-code build | parked | P11/P12 consumers |
| NT-INST | 12 institution passes | Nested:28 | docs | Source-ready | Native play not shown | parked | Selection |
| NT-WD | World-depth 01-43 | Nested:29 | docs | Palette | Not checked | parked | Selection |
| NT-GT | GTR/GTO etc. | Nested:30 | progression | Proposal | Not checked | parked | Selection |
| NT-F1-F9 | Named checks | Nested:70-80 | receipts | Corrections | F2 pack-save inference dated; registry now saves (R12-3) | stale-doc | Row F2 |
| NT-DED | Dedup remainders | Nested:66 | dedup docs | Leads | Not rechecked | parked | Current owner |
| NT-I09 | Chat gaps I09, lone-wolf | Nested:36 | owners | Proposal | No new owner entry looked up | ready | Docs |

### IDEAS_LEFT_INVENTORY: ranked slices, enabling, chat gaps

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| IL-R1 | W1-W4/CG01-29 coherent journey | Inv:924 | cultivation checkpoint | Present journey | Same as P01 | duplicate | P01 |
| IL-R2 | DRC10-12/UIA14-15 | Inv:925 | P02 | Ready | See P02 | duplicate | P02 |
| IL-R3 | Gate overflow connect (G1/GTO) | Inv:926 | `progression_gates.js` | Ready | Not re-checked | unverified | Check consumer |
| IL-R4 | TQ199 cracked tool | Inv:927 | `tools_domain.js` | Ready | Typed crack and repair in source; native crack/repair fixture (Nested F3) | done-below-floor | None for first crack |
| IL-R5 | Sold lot buy-back (DRC6) | Inv:928 | trader | Ready | No code found | ready | See DRC6 |
| IL-R6 | One formula accepts substitute (MAW-X4) | Inv:929 | `craft_material_fit.js` | Ready | Graded native cooking slice exists (Inv:24); whole-formula breadth open | in-progress | Symbolic/potency grading |
| IL-R7 | Perishable in two storage conditions | Inv:930 | larder | Ready | Not found | ready | Pick item |
| IL-R8 | HP recipe via shared importer | Inv:931 | HP packs | Ready | HP packs and `book_hp_pack.js` exist | duplicate | HP plan |
| IL-EN | MAW-X2/X6/X8/X9 enabling | Inv:935 | docs/scripts | Ready | Not done | ready | Docs/scripts |
| IL-I09 | Restrained-but-influencing system | Inv:884,913 | `RESEARCH_LITRPG_SYSTEMS` | Proposal | Owner entry not looked up | ready | Docs |
| IL-LW | Lone-wolf past-life search | Inv:914 | `SELVES_AND_ECHOES` | Proposal | Same | ready | Docs |
| IL-OPEN | Consolidated open rows (614-640) | Inv:614-640 | kit rows | Proposal/partial | Mirrored one-for-one in Triage P-rows | duplicate | See Triage |

### GAP_AUDIT

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| G1 | Canon pull | Gap:G1 | `canon_pull_panel`, `lotm_pull_slice` | Designed only | Panel imported (`native_tool_domains.js:15`); slice file exists | done-below-floor | Resolver input scope unchecked |
| G2 | Generators | Gap:G2 | `quest_generator`, `premise_generator`, `trope_recognizer` | Audits only | Each has `src/` importers and tests; premise intro `0560f5551` | stale-doc | Doc behind code |
| G3 | Rivals and hidden strength | Gap:G3 | `rival_memory.js`, `1568691d5` | None built | Rival memory exists; roadRival brief dormant until something records strength; hidden-strength NPC not found | in-progress | Hidden-strength NPC |
| G4 | World breadth | Gap:G4 | direction | Docs only | Sequencing per canon-first | parked | After canon-first |
| G5 | Time/idle/loops | Gap:G5 | `away_bank_domain` | Idle designed only | Away bank wired (G15); loop table exists | done-below-floor | Idle standing orders unbuilt |
| G6 | Combat hit location | Gap:G6 | `harm_engine`, `tempo_fight_domain` | Nothing in `src/` | `harmPart` present in both | stale-doc | Doc behind code |
| G7 | Making depth | Gap:G7 | making | Apothecary never started | Not checked | unverified | None |
| G8-G11 | Character depth; social gatherings; cheat presentation; economy cause tags | Gap:G8-G11 | design | Designed only / none | Not checked | parked | Selection |
| G12 | UI subtle wishes | Gap:G12 | UI | Dev controls in strip at `workspace_layout.js:496` | Line 496 now holds start-screen code | unverified | Re-find the dev controls |
| G13 | Asks missing from USER_VISION | Gap:G13 | docs | 22 candidates | Not checked | ready | Fold into USER_VISION |
| G14 | Dropped ideas with no record | Gap:G14 | docs | Listed | Not checked | ready | Fold |
| G15 | `away_ledger` and `anchor_snapshots` unreachable | Gap:G15 | `away_bank_domain` | Resolved: wired; anchors waits | `away_bank_domain` imports `away_ledger`; anchors test-only | done-below-floor | Anchors per R12-2d |
| G16 | Shadow Slave label | Gap:G16 | owner | Maybe safe to rename | Not checked | ready | Owner check |
| R1-R5 | Readings not used (COI merge, shards, pack builder, SL idle, ranking) | Gap:R1-R5 | scripts | Notes | R3: builder takes `placePrefix` per B120; R4 paused by direction | stale-doc | R3 |
| U1-U6 | UI at 1920 | Gap:U1-U6 | UI | Findings | Dead tabs (U4) routed to ui-defects; not rechecked at HEAD | unverified | Recheck U4 |
| Lanes 1-7 | Proposed next lanes | Gap:lanes | Weibao's word | Ranked | Lane 1 done (G15); 2 and 3 partly; 4 partial; 7 done; 5 and 6 open | in-progress | Per lane |

### REFINEMENT_PRIORITIES

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| A1 | Connected lead-life day and recovery | Ref:A1 | Klein campaign | Proposal | Matches PROJECT focus 1 | duplicate | KJ3 |
| A2 | World knowable; `known_things` unlocked source | Ref:A2 | `known_things.js:73` | Candidate defect | `location.isUnlocked?.()` still there | ready | Decide visited source |
| A3 | Luminous forms | Ref:A3 | UI | Proposal | B183: forms are per task/world proposals; H2 housing superseded by Nov 1 functional direction | contradicted | USER_VISION 2026-11-01/04 |
| A4 | Progression in context; other worlds | Ref:A4 | `pathway_card.js` | Proposal | Proof page, no live mount; HP and MoL windows exist | in-progress | Mount card |
| A5 | Consequences, earned encounter | Ref:A5 | combat | Proposal | Seeded routes only (`COMBAT.md`) | parked | Earned encounter |
| F1-F4 | Evidence readings | Ref:F1-F4 | receipts | Notes | F4 release hashes older; `origin/master..HEAD` is 3 commits | stale-doc | None |
| F5 | Return grouping drops distinct same-text events | Ref:F5 | `return_digest.js` | Open | `used = new Set(...text)` at line 42, still text-based | ready | Identity key |
| F6 | Silence explanation exposes cause | Ref:F6 | `person_memory_effects.js` | Open | Not re-probed | unverified | Observer arg |
| F7 | Fight and hero HP disagree | Ref:F7 | combat | Reproduced | PROJECT: L2b closure run 2026-11-04 | stale-doc | PROJECT says fixture closure at floor |
| F8-F14 | Overlapping clocks; witness aggregation; debt/permission; making; progress axes; reset state; dials | Ref:F8-F14 | various | Open / proposals | Not rechecked; F13/F14 narrowed by the audit itself | parked | Selected journey or consumer |
| F15 | New owners need routing | Ref:F15 | RULES_INDEX | Note | Not rechecked | parked | None |

### PROJECT.md: current focus and standing priorities

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| PJ-F1 | Klein first novel; endpoint KJ3AE | PROJECT focus 1 | KJ3AE receipt | Endpoint ch69 P082 | `KJ3AA`-`KJ3AE` exist; no `KJ3AF`; all link targets in PROJECT exist | in-progress | Dirty LOTM duties/obligations files may be the next window |
| PJ-F2 | Harry Potter alongside | PROJECT focus 2 | HP plan | Selected Nov 3 | Plan file and HP commits present | in-progress | HP windows |
| PJ-F3 | Book worlds/menus depth; test beds frozen | PROJECT focus 3 | USER_VISION | Standing | Heading found | done-floor | Direction only |
| PJ-F4 | Three worlds, proposal | PROJECT focus 4 | Plan round 8 | Needs yes | Anchor found; no Proto23 pack | needs-yes | His yes |
| PJ-F5 | Playability plan pointer | PROJECT focus 5 | Plan | Sequences delivery | Plan is a historical horizon (B137) | stale-doc | Plan says it is not the queue |
| PJ-S1..S6, S8 | Delivery floor, human gates, refactor, lean verification, AR1-16, desktop first, AD52 | PROJECT SP | RULES_INDEX, USER_VISION | Current | Present | done-floor | None |
| PJ-S7, S9-S12 | Canon-first; complexity; merge before dispatch; deep details private; agent budget | PROJECT SP | log, USER_VISION, AU rules | Current | Not independently rechecked | unverified | None |
| PJ-REL | Release state: Tauri host | PROJECT Release | tauri CHECKPOINT | Tauri since 11-06 | `desktop-tauri/` present; Electron removed `4b4465412`; local master 3 commits ahead of `origin/master` | done-below-floor | PROJECT names no published hash |

## Conflicts noticed

1. **Gap audit G2 says generators are "audits and palettes only".** `quest_generator`, `premise_generator`, `trope_recognizer` and `relic_generator` all have `src/` importers and tests. G6 is the same: "Nothing in `src/` for hit location", yet `harmPart` is in `harm_engine.js` and `tempo_fight_domain.js`.
2. **Plan round 6 says Sequence 7 is "a literal stub".** `book_world_lotm_seq7.js` exists and `1ec64ae02` built Klein's Seq 7. The "Not offered in this slice" rows remain in `book_world_lotm_path.js:24` and `book_world_lotm_pathways.js:82`.
3. **Plan PR1/PR6 want the Tingen entry text to stop naming the Nighthawk office and church teams.** `book_world_lotm_entry.js:29-54` still names them. The WER owner's 2026-11-01 low-spoiler player-start direction points the same way.
4. **Plan round 12 row 2 says `canon_pull_panel` has 0 importers.** `native_tool_domains.js:15` imports it. Row 12 says `build_cast_pack.mjs` is uncommitted; it is tracked with three commits. Round 13 only retracts the parity and pack-save claims.
5. **Plan M1/F1 treats Electron-era adoption (`v0.6-0e5bb8f76aef`) and `app_menu.cjs` zoom roles as current.** The host is Tauri with its own `set_zoom` at 10% steps. Electron was removed in `4b4465412`, so the ZM rows describe code that no longer exists.

## Residue

- About 147 of the 167 Q18 table rows beyond P01-P20 and the 10 sampled (grouped by family).
- Inventory lines 54-613 and 641-867 (ACCOUNT/LATER crosswalk, 403 rows), grouped through the nested triage.
- Q18 packet claims for P13, P15, P18, P19, P20, DWF rows and most WG/WPD rows: source-pin actions with no code to check.
- Plan round 12 row 4 (H4 receipt, CG3/5/7): touches dirty LOTM UI files another session owns.
- Whether the USER_VISION AD50 section and the END_RUN research doc are tracked: only the `RULES_INDEX` line was checked.
- PJ-S7, S9-S12 rest on rule-index presence only.

## Checks run

- `git log`, `git show --stat`, `git worktree list`; `git rev-list --count origin/master..HEAD` returned 3.
- Importer greps for `world_pack_save`, `canon_pull_panel`, `lotm_price_map`, `invention_receipts`, `anchor_snapshots`, `away_ledger`, `away_bank_domain`, `quest_generator`, `premise_generator`, `trope_recognizer`, `proto23_world_host`.
- `node --test tests/crafting_runtime.test.js`: 7 pass, 0 fail (named-method parity).
- Python link check on `PROJECT.md`: no relative link target missing.
- `git ls-files scripts/lead_run/build_cast_pack.mjs`: tracked. `grep -n "AD50" docs/RULES_INDEX.md`: line 265.
- File-existence checks: `tools/correction_sweep.py` missing; `scripts/mcp/game_worker.mjs`, `src/authored_site.js`, `tests/lotm_pathway_rows.test.js` present; `src/carry_ledger.js` has Frontier and Paradise rows only; no `night/*` branch; no prose lint among the `check:rules` scripts.
