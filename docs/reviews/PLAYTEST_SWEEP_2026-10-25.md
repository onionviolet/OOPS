# Headless playtest sweep, 2026-10-25

**Input:** git HEAD `3a1180dc274868d1e4350058a74725ac6b534394`. The primary checkout has other agents' uncommitted runtime edits in flight, so these findings are against that live state.

**Method:** yairpg-game MCP, player-visible text/actions only. Findings are tied to fresh-life reproduction paths below. No source, tests, dist, or other docs were edited.

## Coverage and lives

| Life | Fresh start | Time advanced | Save / export / import | Result |
|---|---|---|---|---|
| L1, Frontier | game_new, seed 251025, Village, Day 1 08:00 | 2,880 minutes, to Day 3 08:00 | Save hash 6a01374356cf002b; export 185,548 bytes; imported from returned temp path to Day 3 08:00 | Persistence calls succeeded. Title overlay remained. |
| L2, Frontier | game_new, seed 251026, Village, Day 1 08:00 | 1,440 minutes, to Day 2 08:00 | Save hash 9e1df7d4ccacbb60; export 185,628 bytes; imported to Day 2 08:00 | Same startup state and overlay. |
| L3, Mistglass attempt | game_new, seed 251027, Village, Day 1 08:00 | 1,440 minutes, to Day 2 08:00 | Save hash a0713409998887c2; export 185,624 bytes; imported to Day 2 08:00 | Same startup state and overlay. No Mistglass entry reached. |

All game_look receipts showed 0 page errors. I tried clicking the displayed PLAY text and exposed contextual actions, including Find work and Homes. The visible screen continued to say “Waiting for you to click 'PLAY'”; Find work did not start work. The listed actions omit PLAY, so the game tool cannot target that visible control by its advertised index/key/text routes. game_step still advances the clock beneath that state. I called game_report_limit once after the first failure; it recorded one ledger entry. Further fresh seeds confirmed the same block, so I stopped broad system coverage instead of treating underlying panel text as player access.

**Coverage not exercised:** village livelihood and ordinary actions; crafting/workshop and gear; household/manor and staff; all Mistglass cultivation systems; combat and combat review; continuation, law memory and baggage; LOTM Tingen districts and both Sequence 9 pathways. Three lives were created, each advanced for at least one in-game day and completed save/export/import, but none became interactively playable.

## Findings

### P1 — Startup overlay blocks player actions (blocker, fixed-on-branch B1)

- **Area:** game startup / MCP play surface.
- **Reproduction:** From a fresh game_new (observed with seeds 251025, 251026 and 251027), inspect game_look at Village, Day 1 08:00. The screen says “Waiting for you to click 'PLAY'” and visibly includes PLAY. Try game_click with text PLAY, then try a listed village action such as Find work. The PLAY control is not present in the numbered action list; the screen still shows the waiting overlay and Find work does not begin. game_step for 1,440 minutes advances the date while the same waiting overlay remains.
- **Expected:** PLAY begins the run and player actions change the game state.
- **Observed:** The tool exposes the running Village state and advances time, but does not expose the visible PLAY control as a click target. Actions beneath the overlay do not yield an interactive run. Save/export/import succeed despite this.
- **Severity:** blocker. Prevents meaningful playtest coverage across every requested system.
- **Limit route:** game_report_limit called once; response recorded one ledger entry. Workaround attempted: continue via exposed contextual actions and time steps, plus reproduce across fresh seeds. This did not restore interaction.

## What felt good

- Save, export, and import completed on all three fresh lives, with the imported game returning to the saved day and Village location.
- The clock advances by the requested duration while the tool reports 0 page errors. That verifies the time-step and persistence routes only, not gameplay correctness.

## Top five

P1 is the sole evidenced finding and ranks first: the startup overlay prevents all meaningful interaction, so the requested systems and pacing cannot be judged. No other defect is ranked because the game could not be played; the Frontier, crafting, household, Mistglass, combat, continuation, and Tingen lanes remain unverified.


## B1 follow-up, 2026-10-25

**Input:** isolated master `3a1180dc274868d1e4350058a74725ac6b534394` plus B1 MCP wrapper changes, **not** the primary checkout's uncommitted edits. The initial A1 input note above describes A1's earlier live-tree attempt only. Four Luna-medium area workers drive independent stdio servers from the isolated worktree; no registered-primary MCP is used.

**P1 diagnosis and branch fix:** the committed headless driver already auto-clicks PLAY. The old wrapper used DOM-shim `innerText`, which includes hidden loading-screen descendants, so it falsely reported the waiting overlay. Text clicking searched fewer control types than the action list. B1 filters hidden text, reports `started`, matches text to action-list controls, and supports scoped/paged looks. Fresh `game_new` now shows `started: true`; Find work reveals the patrol control, and clicking it displays Patrolling plus Stop patrolling. P1's report is retained as the historical observation, with its root cause narrowed by this evidence. Fixed on B1 branch, pending coordinator integration.

### P2 — Village patrol time-step throws (bug)

- **Area:** Frontier livelihood / runtime activity ticking.
- **Reproduction:** `game_new` seed 251035, default origin. `game_look` scope `#location_actions_div`; click listed Find work; look in the same scope; click `[data-activity="patrolling"]` by its listed index; `game_step` 120 minutes.
- **Expected:** complete the advertised two-hour patrol shift, with ordinary work progression and wages available on stopping.
- **Observed:** patrol begins and exposes Stop patrolling, but stepping throws `Cannot read properties of undefined (reading 'skill_required')`. Status then shows Day 1 10:00, 60 ticks, `stats.minutes: 0`, and an empty page-error list. A failed step can therefore leave time partially advanced without an error in status.
- **Severity:** bug. Blocks reliable patrol livelihood progression and its pacing evaluation. No source fix made under B1's tool-only scope.
- **Evidence:** parent direct-stdio transcript `/tmp/b1-patrol-repro.jsonl`; scope before/after confirms an actual responsive Village control, rather than underlying title text.

Desktop layout and human taste acceptance remain untested by this headless pass. Consolidated returns follow.


## B1 consolidated coverage

Applies AD6–AD8, AD10–AD18, AD32, AD36–AD38, AD41; AR7–AR8, MR/PIR/ECR/SLR and CBR where their consumers were actually reached. No product rule or accepted direction changed. Four `gpt-6-luna`, medium workers, no descendants, each used its own direct-stdio server and disposable saves. Parent reviewed their returns and corrected one account that described the patrol error as occurring on click: the transcript shows it occurred during the subsequent 120-minute step. Duplicate patrol reports BFA1/BMC2/BLD1 are consolidated into P2.

| Area / life | Actually exercised | Played time and persistence | Remaining boundary |
|---|---|---|---|
| Frontier, seeds 251031–251046 | Find work / patrol settlement; Village → Wild willow stand → Village after wrapper fix; herb gathering and one experimental steep; starting pants Equip/Take off; Gear workshop opened and operations inspected | Independent idle life reached Day 3 08:00; save hash `5d5b78a752083a40`; export/import restored time and Village | No viable preparation consumed; repair/fitting/treatment/reforge/salvage were listed, not executed; no active multi-day livelihood routine |
| Household, seed 251032 | Homes → Duke’s child → Arlmere manor; allowance; Iven’s completed meal order; Toma’s gathering/recovery; Sera’s leave/resume and Literacy lesson; agreed Rowan ledger appointment; private-storage deposit. A resumed branch traveled to Village and bought Hearthside cottage alongside shared manor rights | Initial household journey Day 1 08:00 → Day 2 09:15; save hash `07b38481f581f570`; export/import restored manor/time; repaired `game_new(path)` independently verified. Follow-up resumed manor life reached Day 3 01:15 (hash `27bf9541b72f81c9`); export/import restored manor and clock | Royal start, construction/repair, furnishings, pending-work leave, retrieval/store identity unresolved (BHB2); full away-return storage persistence unverified |
| Mistglass / combat, seeds 251033–251034 | Village entry and route search; patrol attempt only; separate idle life | Day 3 08:00; hash `387e7da8758d70f2`; save/export, cross-process path resume and import preserved Village/time | Mistglass not entered. Condensation, vessel geometry, seedbed, brood, formulation, medicine, trials untested. No fight or combat review reached. Patrol is a job, not evidence of a combat route |
| Continuation / Tingen, seed 251034, `lotm_probe=1` | Fresh Village; default/scoped/paged actions and panel checks, before/after save; idle stepping | Three 1,440-minute steps to Day 4 08:00; initial save hash `26625ddf61b9b1cc`; export, repaired path resume, second export/import restored Village/time | No continuation or LOTM entry control reached. Law memory/baggage/new life, Seer/Corpse Collector and all Tingen districts remain untested |

### BFA2 — Native site dropdown omitted by MCP (blocker, fixed-on-branch)

- **Area:** travel / headless action enumeration.
- **Repro:** `game_new` seed 251031; Move somewhere else → Go to Wild willow stand; inspect scoped `#location_actions_div`.
- **Expected:** the visible Move somewhere else dropdown can expose Return to Village.
- **Observed before fix:** label text present, action count zero. Narrow source inspection found a listener-only div without role, tabindex or inline handler; the driver’s action enumeration omits it outside the Village registry.
- **Observed after fix:** seed 251040 exposes `.location_choice_dropdown`; click it, then listed Return to Village `[5m]`; Village at 08:10. Visible herb-verge gathering also works.
- **Severity/status:** blocker for that life in the old wrapper; fixed-on-branch by wrapper enumeration, without `src/` changes. Final MCP regression repeats the roundtrip.

### BFA3 — “Success 100%” trial yields no preparation (confusing)

- **Area:** Frontier making / experimental steep.
- **Repro:** `game_new` seed 251046; Village common herb verge → Open Village common herb verge → Gather from the Village verge; select the carried-material checkbox; Craft 1.
- **Expected:** the preview distinguishes the chance to finish an attempt from the chance to make a viable listed preparation.
- **Observed:** one Low rushwort selected; preview “Success 100%” and “Can craft now: 1 attempt.” Craft consumes the lot, then reports that the steep was too thin and no preparation formed. The UI also warns that properties act before being known. This is an ambiguity in the percentage, not evidence that exploratory material failure is wrong.
- **Severity:** confusing; one exploratory attempt, no alternative lots tested. Receipt `/tmp/b1-herb-craft.jsonl`.

### BHB1 — Export path resume used the wrong format (bug, fixed-on-branch)

- **Area:** MCP `game_new(path)`.
- **Repro:** fresh seed 251032; enter Duke’s child manor life; save/export; successful `game_load(path)`; then `game_new({seed:1,path})` using that export.
- **Expected:** resume the exported life through its normal import route.
- **Observed before fix:** `Unexpected token 'Y', "YAIR-UTF8-"... is not valid JSON`; encoded export was being inserted into raw localStorage JSON.
- **Observed after fix:** fresh boot then native `importFile(encoded)` restores Arlmere manor, Day 2 09:15; independently verified by the household worker. Final regression checks time, started state and hero after resume.
- **Severity/status:** bug, fixed-on-branch. Normal `game_load` had already worked.

### BMC1 — Mistglass entry not exposed (blocker for coverage)

- **Area:** optional Mistglass / Projects entry.
- **Repro:** fresh seed 251033 at `http://localhost/?test_hooks=1`; inspect default/paged/scoped controls and workspace navigation.
- **Expected:** a reachable ordinary opt-in route to the conservatory, or a visible explanation of its entry gate.
- **Observed:** center exposes Here, Crafting, Mixing and `?`; Projects/Mistglass controls not actionable in the MCP surface. No explicit entry flag found in a narrow public-route check. No debug/host command or fixture mutation used.
- **Severity:** blocker for this sweep, not a verified rendered-app defect. All requested cultivation mechanisms remain untested.

### BLD2 — Tingen entry absent on test route (blocker for coverage)

- **Area:** LOTM test enrollment.
- **Repro:** `game_new({seed:251034,url:'http://localhost/?test_hooks=1&lotm_probe=1'})`; inspect every action page and `#lotm_panel`, before and after `game_save`; inspect visible Options/local-life routes.
- **Expected:** test enrollment controls for the Tingen slice.
- **Observed:** Village starts, but no action contains Tingen/LOTM and scoped panel is empty. Exact entry flag confirmed by narrow source inspection. Both pathways and districts remain untested.
- **Severity:** blocker for coverage; whether game or headless visibility/discovery is responsible remains unresolved.

### BLD3 — No reachable continuation control (blocker for coverage)

- **Area:** continuation / law memory and baggage.
- **Repro:** the fresh-life URL/seed above; inspect all action pages and `#continuation_panel`, before and after save.
- **Expected:** discoverable continuing-connection/fresh-life control or a legible prerequisite.
- **Observed:** no actionable continuation/connection/fresh-life control. No new life entered through this mechanism. This does not show a natural prerequisite is wrong; it bounds the sweep.
- **Severity:** blocker for requested coverage; carryover and baggage unverified.

### BHB2 — Private-storage count and chest copy disagree (confusing)

- **Area:** manor storage identity.
- **Repro:** `game_new` seed 251032; Homes → Duke’s child; Homes private storage starts 0/16; Store one selected item reports a unit moved into private local storage. Export at Day 2 09:15, resume, step 720+240 minutes to Day 3 01:15, save/export/import. Open your personal chest at manor; travel five minutes to Village and open Homes.
- **Expected:** if both surfaces name the same store, show the unit; if separate, distinguish their identities clearly.
- **Observed:** native chest says nothing stored; Homes still shows `Private storage · 1/16` and describes a private chest. Both views show zero page errors. No item moved during the follow-up.
- **Severity:** confusing, store identity unresolved. This is not a demonstrated lost-item or persistence bug. Receipts `/tmp/b1-day3-chest-check.jsonl` and `/tmp/b1-day3-property-check.jsonl`.

### BT1 — First-page action truncation hides further controls (confusing, fixed-on-branch)

- **Area:** MCP view coverage.
- **Repro:** default fresh `game_new`; original wrapper returns 80 entries although `actionCount` is 126 on this baseline.
- **Expected:** a way to enumerate the remaining controls without guessing selectors.
- **Observed:** original 80-action/3,500-character limit had no paging argument. B1 adds `offset` with absolute indices, `scope`, and 12,000 visible-text characters; regression confirms the page beginning at index 80.
- **Severity/status:** confusing; fixed-on-branch. CSS visibility remains approximate and does not prove desktop layout.

### BT2 — Export filenames could collide (bug risk, fixed-on-branch)

- **Area:** MCP parallel persistence.
- **Repro:** two `game_export` calls without virtual-time advance; multiple servers also share the same temp directory.
- **Expected:** each returned path continues to identify that export.
- **Observed/source evidence:** original filename was `save-${Date.now()}.txt`, with the virtual date fixed between exports. This is a source-confirmed overwrite risk, not an observed gameplay save-loss claim. B1 uses node:crypto UUIDs; regression exports twice at the same instant and requires distinct paths.
- **Severity/status:** bug risk, fixed-on-branch; no private player saves involved.

## What felt good in B1

- **G1:** Household accounting distinguished estate funds, personal allowance, staff wages, pantry, staff stock, player room and private storage. Meal, gathering and lesson requests completed through played time with explicit costs and agreements.
- **G2:** Frontier starts with concrete local services and a usable gear item. Equipping the pants changed the action to Take off. The herb verge gives a short gather-to-experiment loop, with a concrete material failure explanation.
- **G3:** Patrol communicates a two-hour pay cadence and returns its loaned kit. Despite P2, follow-up play showed the 5C outcome and XP notices had applied; a subsequent one-minute step succeeded.
- **G4:** Every area completed disposable save/export/import checks. Repaired cross-process path resume retained reached location and clock. These receipts establish only the tested states.

## B1 verification and delivery boundaries

- `node scripts/mcp/game_mcp_check.mjs`: PASS on final wrapper; nine tools, deterministic hash `e03130b905d6f533`, auto-start/hidden text, native site roundtrip, Village patrol control click, action pagination, save/export/import/resume, unique paths and rejected external entry/save paths.
- `npm run build`: PASS. `npm run check:arch`: PASS. `npm run check:rules`: PASS, zero warnings. No source or rule changes; no rule-behavior rerun required.
- `npm test`: 2,873/2,877 pass; four local-HTTP tests hit sandbox `listen EPERM`. Targeted `node --test tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` outside sandbox: 9/9 pass, including all four denied tests. No assertion failure remained; full suite not repeated.

Frozen-bundle path remains deferred: the headless reload owns a harness-instrumented bundler plus checkout HTML/CSS/assets. A wrapper-only path would not freeze these inputs. `game_new.path` remains an exported save; `url` supports localhost test entry only. Existing `stdio_server.mjs` transport required no change. MCP patch and lane records are delivered on the isolated branch; primary runtime/tool scripts are left for coordinator integration. No push, installed-app adoption or human acceptance claimed.

## B1 top ten, ranked

This ranks the sweep's distinct open findings and fixed tooling findings, not ten gameplay defects. P2 folds all three patrol duplicates together.

| Rank | Code | Finding | Status / priority |
|---:|---|---|---|
| 1 | P2 / BFA1 / BMC2 / BLD1 | Patrol step reports failure after applying its shift outcome | Open runtime bug; fix in owning game lane |
| 2 | BMC1 | Mistglass entry not exposed | Open coverage blocker for all requested cultivation loops |
| 3 | BLD2 | Tingen test enrollment absent | Open coverage blocker for both pathways and districts |
| 4 | BLD3 | Continuation control not reached | Open coverage blocker for law memory and baggage |
| 5 | BFA3 | 100% craft preview can still yield no preparation | Open confusing wording / probability semantics |
| 6 | BHB2 | Homes private-storage count and native chest copy disagree | Open confusing store identity; no item loss established |
| 7 | BFA2 | Native dropdown omission trapped a resource-site visit | Fixed-on-branch; natural return retested |
| 8 | P1 | Hidden startup text and mismatched text-click surface | Fixed-on-branch; actual boot already started PLAY |
| 9 | BHB1 | `game_new(path)` rejected encoded exports | Fixed-on-branch; cross-process resume retested |
| 10 | BT2 | Virtual-time export filenames could overwrite exports | Fixed-on-branch; unique-path regression |


BT1's fixed pagination gap is documented above but falls outside the final ten after BHB2's later storage-identity receipt. Area records are committed with the lane packet: `B1_FRONTIER.md`, `B1_HOUSEHOLD.md`, `B1_MISTGLASS.md`, `B1_CONTINUATION_LOTM.md` under `docs/gm/dispatch/codex-parallel-2026-10-25/`. The coordinator patch supplies those records; this consolidated report was edited directly in the primary checkout under B1 ownership.
