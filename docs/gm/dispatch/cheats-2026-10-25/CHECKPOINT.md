# D4 cheats, 2026-10-25

Status: partial delivery committed; the broad inventory remains unfinished implementation scope. Branch codex/cheats-2026-10-25, base 3dfc49cf3422c0262d86810df47459f53f3a4a67. Worktree /Users/weiwei/.codex/worktrees/cheats/yet-another-idle-rpg. Port 5104. Branch commits authorized; no master integration or push.

Rules: AD11/22/26/28/29/30/32/34/36/38; AR1–AR16; UR1–UR69; GTR8/9/10/14. Runtime seams: cheat card envelope, domain registry, native harvest, seeded stream receipts, existing continuation and heir owners. Target 1920×1080 desktop; mobile deferred. Golden baseline: existing commands unchanged; schema-1 cards strict; save/import envelope validation remains authoritative. Failure scenarios: faculty disappears on heir/rewind, duplicate claim, appraisal changes without observation, peek advances stream, dice charges replay after reload, dormant UI leaks.

## Ownership and M4 overlap

D4 owns new cheat domain/card modules, cheat card/UI changes and focused cheat regressions; main.js edits restricted to cheat joins. Reader owns INVENTORY.md only; carry reader read-only. No subagent code writes.

Primary status checked before edits: dirty src/main.js, src/continuation_state.js, src/continuation_host.js, src/continuation_ui.js, src/heir_inheritance.js, tests/continuation_state.test.js and docs/CHEAT_LIBRARY.md. Cultivation owns continuation changes there. Clean: src/cheat_cards.js, src/life_experience_host.js, src/carry_ledger.js, src/status_window.js. Branch-only CHEAT_LIBRARY statuses; merge must reconcile its live primary additions. Any continuation edit here is a narrow cheat carrier adapter, not replacement of primary intent/baggage/law/retention/challenge changes.

## Inventory

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
| IM19 / RF1 | NPC-held card | Unbuilt | actor powers need registered descriptor and repeatable encounter/recognition route; arbitrary cards cannot be inserted into simulation.powers |
| IM20 | Patient Furnace | Unbuilt | away_ledger maths exists; authoritative native offline replay policy absent |
| IM20 | Pattern Book | Unbuilt | craftLedger's knowledge-redacted forecast exists; no cross-world learned-pattern consumer |
| IM20 | Heirloom Compact | Unbuilt | heir_inheritance and obligations exist; no executable bequest/claim adapter for a card |
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

Remaining verification: combined integration candidate full suite and human pacing/taste acceptance. D4 branch source commits: 97890a27 and 00334132. Remaining implementation scope is IM27–IM28 in the root owner, including the unbuilt priority cards above. Mobile is deferred. No merge to master, push or app adoption is claimed.

### Final test boundary and repaired integration checks

- Single full `npm test -- --test-concurrency=1`: 2,890 passed / 2,894, four failed, 94.3 s. Failures: the two `stepper_life_commit` VM cases omitted the extracted setter; the existing customization-host fingerprint changed when adding the shared status render; `cheat-faculty` lacked a surface entry. All four are D4 integration changes, not dismissed as baseline.
- node --test tests/stepper_life_commit.test.js tests/ui_contract.test.js tests/layout_spec.test.js: 25/25 PASS after scoped repairs. The VM injects the real adapter seam; the existing one-line host exception was re-fingerprinted, not broadened; the panel is explicitly registered in LAYOUT_SPEC.
- node --test tests/cheat_mechanisms.test.js: 14/14 PASS on final code, adding rejection/quarantine of incomplete saved readings before UI dereference and preserving stronger native appraisal skill.
- Final rebuilt browser: PASS on all six card routes and real heir flow; 1920×1080 and 1536×864 at measured 14px and 21px card text, no horizontal overflow in the card view, no page errors. Receipt separates viewport width from content width. Literal Import and actual heir Save/preflight/import/reload pass.
- Final build, architecture and rules checks: PASS. No second full suite was run, per M3. Thus the full-suite receipt is the failed pre-repair run plus focused passing repair evidence, not a claim of a fresh all-green full suite. A combined candidate full run remains with the merger.

M4 additional overlaps checked before repair: primary src/layout_spec.js, tests/stepper_life_commit.test.js and tests/ui_contract_allowlist.json are dirty. D4 changes only one surface row, one injected VM setter and the existing pollDisplays exception fingerprint; preserve the primary lane's other changes at integration. Primary systems-register and cheat-audit owners were clean at their append check.

## Final checkpoint

Runtime commit: 00334132. Foundational carrier commit: 97890a27. [Input identity and verification summary](VERIFICATION.json). Headless browser owns a fresh ephemeral profile and closes its port-5104 server on exit; no user save touched. No worker or server remains from this lane.

Resume order: RF1 registered actor-power/rematch adapter, then the missing native offline policy for Patient Furnace, knowledge-safe Pattern Book and executable Heirloom Compact. Continue from this branch/checkpoint; do not reinterpret palette aliases or simulator modes as ready-made card specifications. The unresolved scope and effort/done checks are IM27–IM28 in CHEAT_LIBRARY. This is a useful partial lane, not completion of the request to implement every remaining cheat.

Local generated residue intentionally excluded from commits: dist/bundle.js, dist/bundle.js.map, index.html build-version tokens, and the earlier browser-failure.png. The final screenshots and JSON receipts are the review artifacts. Nothing merged to master or pushed.
