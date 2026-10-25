# Headless playtest sweep, 2026-10-25

**Latest follow-up:** [C2 results and updated top ten](#c2-follow-up). Earlier A1/B1 observations retain their original build identities.

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

## C2 follow-up

**Build and scope.** B1 branch `8e44dd7c3` was merged with requested master
`9b997ea60` as `5a2ed4c9e`, then tooling committed as `35ef1a1f3`.
Every C2 gameplay finding below uses committed runtime source tree
`6f928fb9523f41ce21c8140461ba39d81ecc7a52`, rebuilt with the headless harness.
Primary-checkout uncommitted gameplay additions are excluded. The native dist
build receipt is SHA-256 `652f967dc96777ce3c78a01a5d214c082e30e14000e9cccecd9ad1cc1897aec4`;
MCP imports its instrumented source bundle, not dist. No private player saves were read
or modified, and no sealed-truth/debug state supplied an entry.

Four Luna-medium workers played the four assigned areas. This is headless
player-action evidence, not rendered desktop visibility, installed-app adoption
or human acceptance. Applied AD6–AD8, AD22, AD32, AD34, AD36, AR3/AR7/AR8 and
AU1–AU7; area reports add their system-specific rules.

### Tooling findings and fixes

**CT1 / BMC1 / BLD2 / BLD3: native startup/navigation never finished in the
headless surface. Fixed in C2.** All three player routes exist. The runner's
no-op MutationObserver left `startScreen` set to `open` after PLAY hid the
loading screen, suppressing native navigation. C2 delivers attribute changes
at settle boundaries, including inline style changes. `started` now requires
both a hidden loading screen and the native closed-screen state.

- Mistglass: elder hello → native center Back → one played minute → place Options → Iona ledger → Follow local people and work → More panels → Projects → Optional projects → Mistglass → Enter. Its method is a separate explicit opt-in.
- Tingen: existing disposable localhost `lotm_probe=1` start → More panels → Tingen workroom → choose a native entry role. It remains test-only, as the game labels it.
- Continuation: More panels → Continuing connection → Open your connection → normal action and confirmation.

`game_new({panel:<id>})` and `game_click({panel:<id>})` select a visible native
More panels option. `game_click({key:<select>,value:<option>})` selects an
available native option. Neither invents discovery, enrollment or means;
unknown, hidden or disabled controls are refused. Layout / Panels / Show alone
restored a dock setting but did not open an unmapped parity module, so the
shortcut uses the native expansion selector instead.

**CT2: fresh-life clicks could return during asynchronous validation. Fixed
in C2.** On tooling `35ef1a1f3`, seed `251045`, open continuation, click Begin
a fresh life and its confirmation, then look at the view. The worker received
`"undefined" is not valid JSON`: the click reply raced its validation frame and
native reload. The final runner waits for the authority operation/reload before
returning a view. It reaches Life 2, paused arrival, native Continue and reciprocal
First-life controls, and a writable native save (hash `bd500535ce527677`).
Old/new receipts: `/tmp/c2-cont-session.jsonl`, `/tmp/c2-fresh-check.log` and the
continuation report. Old runner SHA-256 at `35ef1a1f3`:
`277e675ffb0849ce3a3f81eb8e29bdea8a84fc09f2bb86f0a5f2f1fc4dbd633c`;
final runner SHA-256:
`d3c0beb4aa949fc9ffd31087aa466f33dd96964fd5cbe651c0b3c38c0997cc0a`.

Frozen-bundle `path` remains deferred after inspection. That name already means
an exported save; native reload also reads checkout HTML/CSS/assets, and the
bundle must include harness instrumentation. A bundle path alone would not pin
the tested game. The isolated checkout and exact source identities above are
the boundary for this sweep.

### Completed journeys and remaining coverage

All rows below use the C2 runtime identity above. The four area reports retain fresh seeds, routes, expected/observed behavior, severity, save receipts and limitations. Continuation resumed after the CT2 fix; the other journeys used the same unchanged runtime source.

| Area / seed | Exercised through native actions | Persistence receipt | Remaining gate |
|---|---|---|---|
| Mistglass / `251043` | Entry, explicit method opt-in, 300 played minutes, condensate 10/10, Threaded-breath Integrated at 48 practice minutes, sluice clearance, paid Cloudseed dose | `65e0dd4cb8fe6106`; export/import restored Day 1 13:01, method, reserve, dose and sluice state | Trial gated by native Meditation; geometry, seedbed, brood and formulation absent from tested committed build |
| LOTM / `251044`, `251045` | Two separate Nighthawk lives; Seer ingestion, guided perception and sample cycle; Corpse Collector dose, three body-care acts and vigil, 4/4 settled digestion, assessment and held Gravedigger dose; docks, paid endorsement and crate work | Seer `500699efa1a875dd`; second life `cc753da7d7266b67`, restored Day 1 10:15 workroom | Brewing formula unaffordable in reached lives; full brewing outcome and broader districts remain unverified |
| Continuation / `251045` | Fresh Life 2, native confirmations, reciprocal resumes, study, later checkpoint and rewind 08:13 → 08:12 | `aa6283a3e98a80b0`; export/import retained Life 2 and later return point | Initial return untested; law memory and baggage controls absent, so review U1 is untestable on this build, not a failed reproduction |
| Combat / `251046` | Elder gear/travel, Infested field, first Wolf-rat group win (15 → 14 groups), second live encounter | `9a46e31b8f398a4c`; export/import retained 09:05, field, 18/60 hp, 0/40 stamina and rat 24/30 hp | Withdrawal and defeat untested; ordinary Combat log observed, dedicated combat review absent from this build |

Combat has timers beyond the dev calendar stepper. Large `game_step` calls therefore do not establish native combat pacing.

Area records: [Mistglass](../gm/dispatch/codex-parallel-2026-10-25/C2_MISTGLASS_PLAY.md), [LOTM](../gm/dispatch/codex-parallel-2026-10-25/C2_LOTM_PLAY.md), [continuation](../gm/dispatch/codex-parallel-2026-10-25/C2_CONTINUATION_PLAY.md), [combat](../gm/dispatch/codex-parallel-2026-10-25/C2_COMBAT_PLAY.md).

### C2 findings, in A1 format

**CMC1: purification-trial prerequisite route remains unresolved.**

- **Area/build:** Mistglass trials, C2 committed runtime tree above, seed `251043`.
- **Reproduction:** take the CT1 Mistglass route, learn Threaded-breath circulation, play 300 minutes and buy a Cloudseed dose. Inspect the 12-minute purification trial; then inspect Village actions and Find work for native Meditation.
- **Expected:** reach the prerequisite through ordinary progression, or identify its route before testing the trial.
- **Observed:** the trial states one paid dose and 2 condensate, but remains disabled with “Learn native Meditation first.” The bounded Village journey exposed Move, Talk, Find work and Mix; work offered patrol. No Meditation action was reached. This does not establish game-wide absence.
- **Severity:** coverage gap, not a confirmed broken unlock. Receipt `/tmp/c2-mist-session.jsonl`; follow-up `/tmp/c2-mist-resume.jsonl`.

**CLC6: brewing stopped at the reached life's means gate.**

- **Area/build:** Tingen brewing, C2 runtime tree above, seeds `251044` and `251045`.
- **Reproduction:** enroll through localhost `lotm_probe=1`, take the supervised Seer route, visit docks and do the recorded endorsement/crate journey; inspect the Corpse Collector formula purchase in the workroom. The second fresh life also displays the same means gate.
- **Expected:** a legible price and material route; successful brewing requires earning those means first.
- **Observed:** formula costs 5 pounds (1,200 pence), frog costs 36 pence at docks, reached purse about 102 coins, and purchase says “Insufficient money.” No money or ingredients were injected. Recipe purchase and brewing outcome remain unverified.
- **Severity:** coverage gate. This run does not demonstrate a balance defect or require that a fresh probationer can afford it. Receipt `/tmp/c2-lotm-seer2.jsonl`.

**CCC1: one reciprocal-return Continue reported an already-applied event.**

- **Area/build:** continuation, C2 runtime tree above with final async-click runner, seed `251045`.
- **Reproduction:** fresh Life 2 → Continue → Resume First life and confirm → Continue; inspect the connection view.
- **Expected:** the arrival action resolves or explains its current state.
- **Observed:** “This return has already been applied” and arrival-paused copy remained; a separately confirmed reciprocal resume to Life 2 worked. Native source guards repeated event tokens. A harness-only probe confirmed the first deterministic UUID repeats after realm reinstall. This supports a harness identity-replay cause, not a native-browser defect. No state was injected to bypass it.
- **Severity:** confusing headless observation; native cause unconfirmed. Receipt `/tmp/c2-cont-fixed-session.jsonl` and continuation report. CT2's earlier failed look is fixed separately.

**CBC1: mid-fight withdrawal was not found in the scoped local-action view.**

- **Area/build:** combat, C2 runtime tree above, seed `251046`.
- **Reproduction:** elder dialogue and sword → Infested field → first group win → second live fight; inspect `#location_actions_div` at low hp.
- **Expected:** discover the ordinary withdrawal choice and its cost (CBR25).
- **Observed:** that scope had no actions at 8/60 hp and 0/40 stamina. A parent return exists in source; this scoped observation does not show it is unavailable elsewhere in the native UI.
- **Severity:** confusing route/coverage gap, not a confirmed CBR25 violation. Receipt `/tmp/c2-combat-session.jsonl` and limit ledger.

**CG1 / CG2: newer requested systems were outside this build.** The committed source and reachable panels do not contain the newer cultivation geometry/seedbed/brood/formulation work, continuation law-memory/baggage controls or dedicated combat review. These remain acceptance backlog for an integrated candidate containing them. U1 from `UNCOMMITTED_RUNTIME_REVIEW_2026-10-25.md` specifically cannot be tested here without baggage. This is a build-coverage boundary, not evidence those newer systems pass or fail.

### What felt good in C2

**G5:** Mistglass connected method practice, a visible resource reserve, a cheaper sluice cost and an ordinary paid ingredient. **G6:** Tingen separated a prepared dose from irreversible ingestion and kept novice perception distinct from identification or safety. **G7:** Continuation made separate lives and reciprocal return points legible. **G8:** Combat showed opponent health and group progress, and preserved a live encounter through export/import. Area reports bound each observation to its actual journey.

### C2 updated top ten, ranked

This ranks open defects, confusing observations, coverage gates and fixed tooling findings. It is not a claim of ten gameplay bugs. B1 findings retain their original input identity and were not independently rerun in C2; the committed runtime tree is unchanged.

| Rank | Code | Finding | Status / next gate |
|---:|---|---|---|
| 1 | P2 / BFA1 / BMC2 / BLD1 | Patrol step reports failure after applying shift outcome | B1 runtime bug remains open; owning runtime lane |
| 2 | CMC1 | Native Meditation route not reached for purification trial | Ordinary prerequisite route still needed |
| 3 | CG1 | Geometry, seedbed, brood and formulation outside tested build | Test integrated candidate containing them |
| 4 | CG2 / U1 | Law memory, baggage and dedicated combat review outside tested build | U1 untestable here; not no-repro |
| 5 | CBC1 | Mid-fight withdrawal absent from inspected scope | Discover/retest full native route; no confirmed rule violation |
| 6 | CCC1 | Reciprocal-return Continue says already applied | UUID replay supports harness cause; native-browser isolation outstanding |
| 7 | CLC6 | Brewing stopped at formula cost | Earn ordinary means and complete recipe/brew; no balance claim |
| 8 | BFA3 | 100% craft preview can still yield no preparation | B1 confusing wording/probability semantics, still open |
| 9 | BHB2 | Homes storage count and chest identity disagree | B1 confusing identity, no item loss established |
| 10 | CT1 / CT2 | Hidden native panel routes and asynchronous transition observation | Fixed on C2 branch with regressions; BMC1/BLD2/BLD3 entry blockers closed |

B1's other fixed tooling findings remain documented in its historical section.

### C2 checks and delivery boundary

| Command / evidence | Result and gap |
|---|---|
| `npm run build` | PASS; dist SHA above; no dist changes selected |
| `npm run check:arch` | PASS; grandfathered baseline unchanged |
| `npm run check:rules` | PASS, zero warnings; no rule change requiring behavior-rule check |
| `npm test` | 2,872/2,877 pass; four localhost fixture `listen EPERM` denials and one 60-second alloy fixture timeout |
| `node --test tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` outside sandbox | PASS 9/9, including all four denied cases |
| `YAIRPG_FIXTURE_TIMEOUT_MS=180000 node --test tests/alloy_equipment.test.js` | PASS 5/5; timeout cleared |
| `node --test tests/interaction_native.test.js tests/scenario_facade.test.js tests/palette_native.test.js tests/crafting_native_reload.test.js tests/domain_instance_isolation.test.js` after CT2 | PASS 14/14, affected runner consumers |
| `node scripts/mcp/game_mcp_check.mjs` after CT2 | PASS, nine tools, deterministic hash `ce1f755934f76ad5`; all three entries, confirmed fresh life/native save, native dropdown return, paging, save/export/load/resume, unique export paths and external URL/path refusal |
| Harness-only UUID reinstall probe | First UUID repeats: true; diagnosis for CCC1, no gameplay state loaded |
| `git diff --check`; primary `git apply --check` for C2 patch | PASS at delivery; applicability only, not primary integration |

Final changed-runner tests and MCP regressions passed after the last code edit. Earlier build/architecture/rules and unaffected full-suite evidence are retained for unchanged inputs; the whole suite was not rerun after CT2. Logs are `/tmp/c2-build.log`, `/tmp/c2-tests.log`, `/tmp/c2-http-rerun.log`, `/tmp/c2-alloy-rerun.log`, `/tmp/c2-runner-consumers.log`, `/tmp/c2-mcp-check-final.log`.

`C2_game_mcp.patch` is refreshed against the primary checkout's actual current untracked MCP files and checked for applicability. Primary tool/runtime scripts remain unmodified by C2; patch application/integration is separate from this isolated branch delivery. Four workers finished bounded journeys and stopped their hosts. A blank accidental limit-ledger entry is retained as raw history and is not a finding.

The remaining gameplay acceptance gate is a rebuilt integrated candidate containing the newer systems, followed by their native journeys, U1 baggage reproduction and dedicated combat review. Desktop viewport evidence and human play acceptance remain separate from these headless results. Frozen-bundle support remains deferred as explained above.
