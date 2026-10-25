# D4 cheats, 2026-10-25

Status: same-session G1 native adapter scope implemented and verified; remaining source palettes reconciled to explicit policy/content boundaries below. No claim that all reference powers or simulator modes are built. Branch codex/cheats-2026-10-25, base 3dfc49cf3422c0262d86810df47459f53f3a4a67. Worktree /Users/weiwei/.codex/worktrees/cheats/yet-another-idle-rpg. Port 5104. Branch commits authorized; no master integration or push.

Rules: AD11/22/26/28/29/30/32/34/36/38; AR1–AR16; UR1–UR69; GTR8/9/10/14. Runtime seams: cheat card envelope, domain registry, native harvest, seeded stream receipts, existing continuation and heir owners. Target 1920×1080 desktop; mobile deferred. Golden baseline: existing commands unchanged; schema-1 cards strict; save/import envelope validation remains authoritative. Failure scenarios: faculty disappears on heir/rewind, duplicate claim, appraisal changes without observation, peek advances stream, dice charges replay after reload, dormant UI leaks.

## Ownership and M4 overlap

D4 owns new cheat domain/card modules, cheat card/UI changes and focused cheat regressions; main.js edits restricted to cheat joins. Reader owns INVENTORY.md only; carry reader read-only. No subagent code writes.

Primary status checked before edits: dirty src/main.js, src/continuation_state.js, src/continuation_host.js, src/continuation_ui.js, src/heir_inheritance.js, tests/continuation_state.test.js and docs/CHEAT_LIBRARY.md. Cultivation owns continuation changes there. Clean: src/cheat_cards.js, src/life_experience_host.js, src/carry_ledger.js, src/status_window.js. Branch-only CHEAT_LIBRARY statuses; merge must reconcile its live primary additions. Any continuation edit here is a narrow cheat carrier adapter, not replacement of primary intent/baggage/law/retention/challenge changes.

## Inventory

Current: all326 source IDs are reconciled in [FAMILY_RECONCILIATION.md](FAMILY_RECONCILIATION.md) across13 mechanism families; grouped source rows can reference several mechanisms. The initial audit below is execution history, superseded by G1 statuses.

Complete source-row inventory is saved in [INVENTORY.md](INVENTORY.md). Initial implemented card: system-quests (partial: dormant optional grant, awakening, native status projection; no quest loop). All other named cheat cards are proposals until a consumer and UI are verified. Generic existing mechanics are engine candidates, not evidence of implemented cards.

## Build slices

- D4.1 implemented: quiet faculty seed, per-card awakening, enduring-stage carry and shared cadence.
- D4.2 implemented bounded slice: real card actions through existing owners, strict persistence and discovery-safe UI.

## Checks

- git status --short / branch / HEAD: clean isolated branch at stated base before changes.
- Primary per-file status: overlap recorded above; no writes there.
- git log --oneline -30 master; systems register; MAW-X1–X9; recent cheat dispatch: read, no newer cheat runtime found.

### D4.1 source slice

Quiet faculty now seeds separately from the optional talking system; awakening reads card-supplied trigger/message. A cheat domain owns its envelope and commit-before-reveal host. Heir uses a carrier adapter retaining quiet-faculty stages/provenance/awakening and resetting per-life points; temporal restore uses the same adapter without replacing local snapshots of accompanying cards. Existing continuation owns the return itself. Status window uses existing pollDisplays cadence, no private timer. These are reversible authored defaults, not newly accepted design rules.

- node --test tests/cheat_carry.test.js: 4/4 pass; ordinary seed, distinct system, heir carry/reset, post-checkpoint acquisition retention.
- npm run check:arch: pass; main 10090 vs baseline 10115, no new cycles; browser and full suite pending final inputs.

### D4.2 implemented source and browser slice

| Priority | Card / mechanism | State | Engine owner |
|---|---|---|---|
| Foundation | Quiet personal faculty | Built and browser-exercised | cheat_host domain, progression gates, existing continuation/heir carrier |
| Existing card | Optional quest system | Built finite victory-claim slice, browser-exercised | status_window and native won-zone counter |
| IM17 | True Appraisal | Built carcass observation slice, browser-exercised | harvest.observeCarcass |
| IM18 | Loaded Dice | Built native loot-call slice, browser-exercised | seeded_streams cell call, durable override, receipts |
| IM20 | Fate Ledger | Built visible-encounter read, browser-exercised | pure stream decision, actual native foe projection |
| IM20 | Earned Habit | Built finite routine adapter, browser-exercised | harvest routine and existing native clock |
| IM19 / RF1 | NPC-held card | Built, focused tests and native browser pass | registered actor power, existing paid rematch, native/party planner, observer knowledge |
| IM20 / PC02 | Patient Furnace | Built bounded route; native/browser/actual carry verified | accepted OD4/TBANK, patient_furnace, existing native clock, finite harvest and durable plan |
| IM20 / PC04 | Pattern Book | Built bounded route; native/browser/actual carry verified | readable native recipe/reference owner; paid reconstruction into crafting learned methods |
| IM20 / PC03 | Heirloom Compact | Built bounded route; native/browser/actual claim verified | counted estate nomination, current heir law, debt-first native successor transaction |
| SH3 | Freshness Sense | Built bounded route; native/browser/carry verified | retained observer timestamps and same-source-clock age |
| Palette | Other named source entries | Proposal or partial as inventoried | [Exhaustive source-row table](INVENTORY.md), including source locators and existing owner candidates |

The inventory's initial 324 rows include aliases, families, simulator modes, grades and policies; they are not independent authored runtime specifications. Two explicit runtime rows were added, and four named card rows updated. This lane does **not** claim all remaining cards are built. Primary overlap remains in main.js, continuation_state.js and CHEAT_LIBRARY.md at the final per-file check; continuation_host/ui and heir_inheritance were previously dirty but later primary status changed, so use the live reconciliation owner. tests/lives_carry_codex.test.js and carry_ledger.js were clean before their scoped unresolved-world regression change.

Input identities: base master 3dfc49cf3; D4.1 commit 97890a27; final runtime commit 00334132ed2b73cb1e3568f12ab6af39b3a874b3; aggregate runtime hash and exact gate boundaries in [VERIFICATION.json](VERIFICATION.json). `git merge master`: already up to date before final gates. No source edits in the primary checkout. No dist commits. Generated index.html asset versions and dist outputs are local build residue only.

- node --test tests/cheat_carry.test.js tests/cheat_mechanisms.test.js tests/cheat_status_window.test.js: 20/20 pass at that slice; later finite-system claim extends mechanisms to 13 tests, covered by final suite.
- node --test --test-concurrency=1 tests/cheat_cards.test.js tests/cheat_awakening.test.js: 8/8 pass, serial browsers; includes strict import, real serialization and storage-fault awakening retry.
- node --test tests/lives_carry_codex.test.js: 5/5 pass; unknown-world carry returns explicit unresolved rows.
- node docs/gm/dispatch/cheats-2026-10-25/browser.mjs: PASS at 1920×1080 on 5104, six card/faculty routes, native encounter fate reading, Save/reload, literal production Import and actual beginHeir boot/preflight/import; no page errors. [Receipt](BROWSER.json), [screenshot](cheats-1920.png). Test-only instrumentation exposes native entry points; the browser bundle is rebuilt from current source, not the tracked prebuilt bundle. Fixture supplies lived counters; ordinary acquisition/pacing through those milestones is not human-accepted.
- npm run check:arch: PASS, main 10092 vs baseline 10115; no new import cycles, save_files growth zero.
- npm run check:rules: PASS, 22 register rows / 41 AD codes / 125 links, zero warnings.
- npm run build && npm test -- --test-concurrency=1: completed; see the failed full-run and focused repair receipt below. Only one full suite invoked, serial test files.

Authored dials: 1 insight per finite lived milestone; 1 insight per development/refill; 3 appraisal/fate/habit and 2 dice reserves initially. Heir reserves start empty. These are reversible implementation proposals. Unchanged existing command definitions retain their golden identity. New card states have revision 1 and typed accounting; local unsupported entries are retained as JSON in cheats_quarantine, and explicit Import remains strict. Full backups retain real restore data. No hidden reference power is exposed by an undiscovered card list.

Remaining verification: combined integration candidate full suite and human pacing/taste acceptance. D4 branch source commits: 97890a27 and 00334132. At that earlier checkpoint, IM27–IM28 were open. The same-session G1 receipts below supersede those card statuses and reconcile broader proposals. Mobile is deferred. No merge to master, push or app adoption is claimed.

### Final test boundary and repaired integration checks

- Single full `npm test -- --test-concurrency=1`: 2,890 passed / 2,894, four failed, 94.3 s. Failures: the two `stepper_life_commit` VM cases omitted the extracted setter; the existing customization-host fingerprint changed when adding the shared status render; `cheat-faculty` lacked a surface entry. All four are D4 integration changes, not dismissed as baseline.
- node --test tests/stepper_life_commit.test.js tests/ui_contract.test.js tests/layout_spec.test.js: 25/25 PASS after scoped repairs. The VM injects the real adapter seam; the existing one-line host exception was re-fingerprinted, not broadened; the panel is explicitly registered in LAYOUT_SPEC.
- node --test tests/cheat_mechanisms.test.js: 14/14 PASS on final code, adding rejection/quarantine of incomplete saved readings before UI dereference and preserving stronger native appraisal skill.
- Final rebuilt browser: PASS on all six card routes and real heir flow; 1920×1080 and 1536×864 at measured 14px and 21px card text, no horizontal overflow in the card view, no page errors. Receipt separates viewport width from content width. Literal Import and actual heir Save/preflight/import/reload pass.
- Final build, architecture and rules checks: PASS. No second full suite was run, per M3. Thus the full-suite receipt is the failed pre-repair run plus focused passing repair evidence, not a claim of a fresh all-green full suite. A combined candidate full run remains with the merger.

M4 additional overlaps checked before repair: primary src/layout_spec.js, tests/stepper_life_commit.test.js and tests/ui_contract_allowlist.json are dirty. D4 changes only one surface row, one injected VM setter and the existing pollDisplays exception fingerprint; preserve the primary lane's other changes at integration. Primary systems-register and cheat-audit owners were clean at their append check.

## Earlier checkpoint before G1 (superseded)

Runtime commit: 00334132. Foundational carrier commit: 97890a27. [Input identity and verification summary](VERIFICATION.json). Headless browser owns a fresh ephemeral profile and closes its port-5104 server on exit; no user save touched. No worker or server remains from this lane.

Historical resume order: RF1, Pattern Book, Compact, then Furnace if supported. G1 implemented these; its correction F6 shows existing accepted offline policy rather than a missing-policy blocker. Continue from this branch/checkpoint; do not reinterpret palette aliases or simulator modes as ready-made card specifications. The unresolved scope and effort/done checks are IM27–IM28 in CHEAT_LIBRARY. This is a useful partial lane, not completion of the request to implement every remaining cheat.

Local generated residue intentionally excluded from commits: dist/bundle.js, dist/bundle.js.map, index.html build-version tokens, and the earlier browser-failure.png. The final screenshots and JSON receipts are the review artifacts. Nothing merged to master or pushed.

## Same-session G1 resume from 7088a420 (2026-10-25)

Status: running under the user's same-session continuation. Original full-suite receipt and dirty dist/index/failure evidence are preserved. No master merge, push, deletion or primary write is authorized in this resume. Rules remain AD11/22/26/29/36/38, AR1–16, observer knowledge and existing native clocks/estate transactions. Reusing mechanic-absorption and more-to-consider workflow; parent owns code, two bounded readers own source reconciliation/test drafting.

Correction F5: the prior checkpoint's missing-rematch assertion was wrong. `frontier_campaign.js:rival.recover`, `rival.rematch`, `prepareRivalRematch` and `tests/frontier_campaign.test.js` already implement paid recovery and repeatable contests. RF1 will reuse them. Missing adapters are implementation work, not policy blockers.

RF1 seam: registered simulation power with typed card/holder state, existing native/party contest executor and observer knowledge. Target 1920×1080 desktop; mobile deferred. Failure cases: hidden holder state leaks before a tell; first encounter is falsely predicted; reload repeats a paid reaction; a different opening is predicted despite absent memory; failed persistence mutates live actor memory.

M4 checked before edits: primary src/native_battle.js, src/party_battle.js, src/main.js and src/layout_spec.js dirty. Primary src/frontier_campaign.js, src/frontier_campaign_ui.js, src/native_battle_contracts.js and tests/frontier_campaign.test.js clean. Further files checked per slice below. The cultivation run receives no writes.


### RF1 completed slice (same-session resume)

Registered actor power and typed holder-owned card memory land through `campaignDefinitions.powers` / the existing simulation registry. Native and party strike planners share the adapter; first witnessed opening teaches, a matching later opening consumes the holder's stamina and uses the existing damage/RNG resolver, and changed actual means break the read. Same-session replay does not repeat the paid reaction. Observer knowledge, rather than the private card, supplies the persistent Notes/People tell. This is bounded rematch rehearsal; full NPC temporal rewind is not claimed.

M4 further exact overlaps: primary src/simulation_content.js and src/simulation_contracts.js are dirty. D4 adds one registered power and one specialized record validator there; preserve the primary lane's other definitions/validation. No primary file was written.

- node --test tests/rehearsed_foe.test.js tests/frontier_campaign.test.js tests/party_battle.test.js: PASS 26/26, actual learning/rematch/cost, changed opening, JSON reload, observer boundary, malformed holder and stale/repeated action.
- npm run build: PASS; local generated evidence retained.
- npm run check:arch: PASS; main 10092 vs baseline 10115, no new cycles.
- node docs/gm/dispatch/cheats-2026-10-25/rf1-browser.mjs: PASS, fresh profile at 5104 / 1920×1080; actual guarded native strike, paid recovery/rematch, observation rendered through existing Notes/People, Save/reload and literal Import preserve the exact holder record. No page errors. [Receipt](RF1_BROWSER.json), [desktop evidence](rf1-1920.png).

The browser fixture establishes the association route and initial contest with existing engine commands; native actions, costs and durable writes are exercised through test-only hooks. Natural discovery/pacing remains human acceptance. Original full-run and targeted repair receipts remain unchanged; no new full suite.

### G1 Pattern Book slice (2026-10-25)

Built: readable native Frontier method -> retained typed design -> continuing-self carry -> paid reconstruction into the existing crafting learned-method owner. No material truth, skill or inputs are copied. Existing crafting UI/quote identifies missing ingredients; its forecasts still use knowledge-redacted `forecastCraft`, and no raw failure residue is copied. Patterns retain original law revision; incompatible worlds retain the design and explain the missing law.

- `node --test tests/pattern_book.test.js tests/cheat_mechanisms.test.js tests/craft_reference.test.js`: 23/23 pass after correcting generated-material fixture; actual recipe consumes inputs, forged/unread patterns and foreign-law reconstruction reject without publishing costs.
- `npm run build`: pass; `/tmp/d4-pattern-build.log`.
- `npm run check:arch`: pass; `/tmp/d4-pattern-arch.log`.
- `node docs/gm/dispatch/cheats-2026-10-25/pattern-browser.mjs`: pass, rebuilt fresh origin 1920x1080 port5104; UI sketch, Save/reload, literal Import, real beginHeir, empty reserves, recharge, rebuild, native crafting missing-input display. `PATTERN_BROWSER.json`, inspected `pattern-1920.png`. Intermediate harness corrections concerned reference-access assumption, Play overlay and ambiguous selector; failure image retained outside commit.
- M4 exact overlap: `src/main.js` dirty in primary; D4 touches only its existing cheat host ports/import. `src/crafting_frontier_runtime.js` dirty in primary, read only here. `src/cheat_cards.js`, `src/cheat_definitions.js`, `src/cheat_mechanisms.js`, `src/cheat_ui.js`, `tests/cheat_mechanisms.test.js`, `tests/helpers/cheat_game.mjs` branch-only owners; no continuation_* writes. Full combined integration gate remains with merger; no second full suite.

### G1 Heirloom Compact slice (2026-10-25)

Built: nominate one exact owned personal/chest lot for the existing law's successor. At native beginHeir, the estate rechecks stock, subtracts the explicit claim from generic inheritance, transfers it to successor belongings, clears the nomination and retains a claim receipt. Spent stock lapses; an unresolved local carrier grants nothing extra. Existing debt settlement, duties, kin law and pristine heir remain unchanged. Nomination costs one reserve, new-life reserves empty.

- `node --test tests/heirloom_compact.test.js tests/heir_inheritance.test.js tests/heir_inheritance_kinfolk.test.js tests/cheat_mechanisms.test.js`: 23/23 pass, exact count conservation, no repeated nomination, debt-first shortfall and stale stock covered. `/tmp/d4-compact-tests.log`.
- `npm run build`: pass; `/tmp/d4-compact-build.log`.
- `npm run check:arch`: pass, main 10093 vs baseline10115; `/tmp/d4-compact-arch.log`. Direct UI item-owner import initially introduced a cycle; repaired using injected native item labels.
- `node docs/gm/dispatch/cheats-2026-10-25/compact-browser.mjs`: pass, rebuilt fresh-origin desktop1920x1080 port5104; real UI nomination, Save/reload, literal Import, native beginHeir exact personal/chest conservation, cleared nomination, receipt and subsequent Save/reload. `COMPACT_BROWSER.json`, inspected `compact-1920.png`. Harness expected count was corrected to actual live pre-succession stock; failure image retained outside commit.
- M4 exact overlap: `src/heir_inheritance.js` and `src/main.js` dirty in primary. Branch adds narrow compact estate claim hooks and existing cheat ports only. `src/life_experience_host.js` clean in primary at inspection, touched here to retain the actual claim receipt after its existing carry call. `src/chronicle.js`, `src/chronicle_ui.js`, `src/carry_ledger.js`, `src/layout_spec.js`, continuation_* files and existing heir tests read only in this slice. Shared `src/cheat_cards.js`, `src/cheat_definitions.js`, `src/cheat_mechanisms.js`, `src/cheat_host.js`, `src/cheat_ui.js`, `tests/helpers/cheat_game.mjs` remain branch writes only.

### G1 Patient Furnace slice (2026-10-25)

F6 authority correction: the old assertion that no accepted offline policy exists was wrong. OD4 and TBANK authorize chosen current-world routines, real calendar/aging/deadlines, important-choice/supply stops, and continuing-journey unused time: `docs/USER_VISION.md` lines3525–3539,3824–3880; `docs/DIRECTION_SYNTHESIS.md` banking sections489–538. The old main test-hook comment was implementation history, corrected here. No new aging, loss, helper, expiry or danger rule is introduced.

Built: opt into an active finite carcass routine for one reserve; bank unused elapsed time on load at native awake cadence (`1000/config.tickrate` ms per minute). Each click spends at most30 minutes for responsiveness, retaining the whole unused balance. Each one-minute native clock plan atomically includes cloned harvest state, native outputs/XP, skill activation and the time debit in the existing durable envelope. Important choices, occupied/dead body, world mismatch, completion or empty stock stop further work. Ordinary durable commits rebase the wall anchor, avoiding credit for already played time. Eligible time persists through the existing cheat carry owner; a new body requires a new assignment. These are bounded reversible implementation dials, not universal time rules.

- `node --test tests/patient_furnace.test.js tests/away_ledger.test.js tests/harvest.test.js tests/stepper_life_commit.test.js`: 35/35 pass before native locked-skill repair; `/tmp/d4-furnace-tests.log`.
- Browser pre-repair failure: completion rejected `Skill Butchering rejected the planned XP.` (then eligibility quote rejected while actual skill remained locked). Earlier accepted minutes/debits stayed together; unfinished carcass stayed pending. Repaired the smallest native prepared-unlock query/quote seam: conditions/locked/finished checks still apply; live availability publishes after durability. Preserved `furnace-failure.png` outside commits. Original lane full-suite failed receipt remains unchanged in VERIFICATION.json.
- `node --test tests/patient_furnace.test.js tests/gameplay_foundations.test.js tests/stepper_life_commit.test.js`: 19/19 pass after repair, including real native skill registry quote without mutating availability, native waiting-choice stop, failed storage with no publication, exact finite supplies/output/XP, online anchor rebase; `/tmp/d4-furnace-repair.log`.
- `npm run build`: pass; `/tmp/d4-furnace-build.log`.
- `npm run check:arch`: pass, main10096 vs10115; `/tmp/d4-furnace-arch.log`.
- `node docs/gm/dispatch/cheats-2026-10-25/furnace-browser.mjs`: pass, rebuilt fresh-origin1920x1080 port5104, actual10.5s absence -> bank, explicit UI settlement -> native minutes/output/XP/stop and exact debit, Save/reload/literal Import without replay, actual beginHeir retains bank/spent record and clears local assignment. `FURNACE_BROWSER.json`, inspected `furnace-1920.png`.
- M4 exact overlap: `src/main.js` and `tests/stepper_life_commit.test.js` dirty in primary. `src/models/skill.js`, `src/components/availability_component.js`, `src/gameplay_publication.js`, `src/expansion_persistence.js`, `src/native_resources_domain.js`, `src/harvest.js` clean in primary at inspection; first three touched narrowly here for staged native skill activation, last three read only. `src/life_experience_host.js` unchanged in this slice; carry uses `src/cheat_cards.js`. No continuation_* or primary edits. Branch-only cheat definition/host/mechanism/UI writes included. Combined full integration gate belongs to merger; no second full suite run.

### G1 Freshness Sense slice (2026-10-25)

Built SH3 bounded route: passive age projection over retained player observations, using the original timestamp and source clock. Same-clock age advances with native time; foreign/unknown/future clocks return unavailable comparison. It reads no current specimen truth or future stream. Development costs lived insight; timestamp reads have no extra reserve cost. Added the native completed-finite-routine milestone so the eighth development has a reachable lived source. Also replaced Pattern Book's raw world ID with its Frontier name in player text.

- `node --test tests/information_freshness.test.js tests/cheat_mechanisms.test.js tests/pattern_book.test.js tests/heirloom_compact.test.js`: 19/19 pass; observer record stays unchanged when truth/time changes, foreign clocks do not imply freshness; `/tmp/d4-freshness-tests.log`.
- `npm run build`: pass; `/tmp/d4-freshness-build.log`.
- `npm run check:arch`: pass; `/tmp/d4-freshness-arch.log`.
- `node docs/gm/dispatch/cheats-2026-10-25/freshness-browser.mjs`: pass, rebuilt fresh-origin1920x1080 port5104; UI appraisal and five actual native minutes -> dated original unchanged and age rendered, Save/reload/literal Import exact record, actual heir keeps learned sense and starts body-local records fresh. `FRESHNESS_BROWSER.json`, inspected `freshness-1920.png`.
- M4: only existing branch cheat definition/mechanism/UI owners plus one current-calendar read in primary-dirty `src/main.js`; new leaf projection and regression. No primary, layout, heir-owner or continuation_* writes in this slice.

### G1 temporal carrier repair (2026-10-25)

Final review found a real remaining adapter defect: a snapshot already holding Pattern Book could replace a later sketch, and an old Patient Furnace snapshot could restore spent journey time. Fixed in `carryCheats`: enduring designs and current bank/spent/remainder follow the continuing self, while native snapshot policy still supplies local reserves and assignment. A temporal arrival stamps a new wall anchor, so its old interval is not credited twice. Pattern history is validated independently from restored per-body charge usage. No continuation owner was edited.

- `node --test tests/cheat_carry.test.js tests/continuation_state.test.js tests/continuation_host.test.js tests/pattern_book.test.js tests/patient_furnace.test.js`: 25/25 pass; actual continuation planner restores twice without duplicating bank or dropping later designs, and existing host checks remain green. `/tmp/d4-temporal-carry-tests.log`.
- `npm run build`: pass; `/tmp/d4-temporal-carry-build.log`.
- `node docs/gm/dispatch/cheats-2026-10-25/temporal-browser.mjs`: pass, rebuilt fresh-origin1920x1080 port5104; later UI sketch and native bank expenditure -> actual continuation host/preflight/durable write/reload -> current design/bank retained, local body/reserves restored, remembered design reconstructs in native crafting. `TEMPORAL_BROWSER.json`, inspected `temporal-1920.png`. One harness correction handles the return's expected page navigation.
- M4: branch writes only `src/cheat_cards.js`, `src/cheat_definitions.js`, `src/patient_furnace.js`, `tests/cheat_carry.test.js`, `tests/helpers/cheat_game.mjs`. Primary-dirty continuation_state/host/ui files and continuation tests read/run only. Cultivation changes remain untouched.


## G1 final checkpoint and input identity

Verified source/test head: `cefddc4287376dd3daba121173d516bb6e384ded`, on `codex/cheats-2026-10-25`, continuing from `7088a420`. Six source slices: `0d9a9bce` RF1, `af60e0b2` Pattern Book, `0c6f0a7e` Compact, `0c9c0e68` Furnace, `12d778ae` Freshness, `cefddc42` temporal payload repair. The final branch head is the docs/evidence commit containing this checkpoint, resolvable exactly with `git log -1 --format=%H -- docs/gm/dispatch/cheats-2026-10-25/CHECKPOINT.md`; it adds no runtime change beyond the verified source head. See [G1_VERIFICATION.json](G1_VERIFICATION.json).

The original task's existing-policy native adapters are delivered, including real UI/consumer, costs, descriptor data, observer knowledge and applicable carry. Remaining reference powers are explicitly unresolved proposals/source prerequisites in [family reconciliation](FAMILY_RECONCILIATION.md#authority-boundary-for-remaining-source-palettes), not326 independent specs and not missing-adapter blockers. No paused scope revived. G1's latest no-master-merge instruction overrides COMMON_W4's generic merge-current-master line. No master merge, push, deletion or primary write occurred.

### Final checks (one line each)

- Inventory coverage comparison:326/326 unique source IDs mapped once,0 unmatched/duplicate IDs;13 mechanism families. The single grouped IM20 row crosses family codes without becoming independent specs.
- Focused affected native/card/carry/UI sets, serial explicit23 files:150/150 pass on `12d778ae`; `/tmp/d4-g1-final-focused.log`. This is not a full-suite rerun.
- Post-review temporal carrier set (`cheat_carry`, `continuation_state`, `continuation_host`, `pattern_book`, `patient_furnace`):25/25 pass on final source inputs; `/tmp/d4-temporal-carry-tests.log`.
- Final `npm run build`: pass on `cefddc42`; `/tmp/d4-g1-final-build.log`. Generated dist/index files remain uncommitted.
- Final `npm run check:arch`: pass, main10096 vs10115 baseline, no new cycles; `/tmp/d4-g1-final-arch.log`.
- Final `npm run check:rules`: pass,22 register rows/41 AD codes/125 links,0 warnings; `/tmp/d4-g1-final-rules.log`.
- Rebuilt original six-route browser rerun: pass after named card additions,1920x1080 and1536x864 at measured14px/21px text with no horizontal card overflow; native Save/reload/literal Import and beginHeir pass. `BROWSER.json` and updated review PNGs; `/tmp/d4-g1-final-browser.log`. Temporal repair then has its separate final-source real-return proof.
- Rebuilt named-route browsers: RF1, Pattern, Compact, Furnace, Freshness and final temporal return all pass fresh-origin desktop1920x1080 on5104, with inspected PNGs and separate JSON receipts. Each applicable path exercises native Save/reload/literal Import and actual heir/continuation transaction, not only fixture serialization.
- Original full suite: unchanged failed pre-repair receipt2890/2894, followed by25/25 targeted repairs in `VERIFICATION.json`; no second full suite. Combined candidate full gate remains with merger. Human discovery, pacing and taste acceptance remain separate.
- Final per-file primary status: overlap table below; primary untouched. `lsof -nP -iTCP:5104 -sTCP:LISTEN` found no listener after browser close. Existing dirty generated/failure evidence retained.

### Final M4 exact overlap handoff

| Exact path(s) | Primary observed state | D4 branch join |
|---|---|---|
| `src/main.js` | dirty | Native cheat ports, prepared skill quote/unlock join, atomic harvest patch publication and existing writer anchor rebase; no broad owner replacement. |
| `src/continuation_state.js` | dirty | Earlier D4 only added existing carryCheats call; G1 read/run only, no edits. Preserve cultivation owner. |
| `src/continuation_host.js`, `src/continuation_ui.js` | dirty | G1 read/real browser consumer only; no edits. |
| `src/heir_inheritance.js` | dirty | Narrow counted Compact escrow/claim, validation and preview lines. Preserve primary trait/lineage work. |
| `src/life_experience_host.js` | clean | Existing cheat carry call plus post-claim Compact receipt. |
| `src/native_battle.js`, `src/party_battle.js` | dirty | Shared RF1 actor-owned opening adapter. |
| `src/simulation_content.js`, `src/simulation_contracts.js` | dirty | RF1 power registration and typed holder record validation. |
| `src/frontier_campaign.js`, `src/frontier_campaign_ui.js` | clean | Registry definition and observer-known tell; existing paid rematch retained. |
| `src/layout_spec.js` | dirty | Earlier D4 cheat-faculty surface row only; G1 unchanged. |
| `src/models/skill.js`, `src/components/availability_component.js`, `src/gameplay_publication.js` | clean | Small typed prepared-unlock query/XP quote; normal conditions and durable publication retained. |
| `tests/continuation_state.test.js` | dirty | Run only; no G1 edit. |
| `tests/stepper_life_commit.test.js` | dirty | Existing extracted native writer harness supplies real cheat setter and new real rebase helper. |
| `tests/ui_contract_allowlist.json` | dirty | Earlier D4 pollDisplays fingerprint only; G1 unchanged. |
| `tests/ui_contract.test.js` | clean | Run only. |
| `docs/CHEAT_LIBRARY.md` | dirty | Branch-only statuses and dated more-to-consider rounds; preserve primary additions during merge. |

`src/expansion_persistence.js`, `src/native_resources_domain.js`, `src/harvest.js`, `src/crafting_frontier_runtime.js`, `src/chronicle.js`, `src/chronicle_ui.js` and `src/carry_ledger.js` are existing consumers/read owners in G1; no G1 writes. Crafting runtime was observed dirty in primary during Pattern work. New cheat modules/tests and branch cheat owners are D4-owned. Remaining local dirt is generated build payload and preserved failure captures, excluded from commits; the inventory/review artifacts are committed separately from source slices.
