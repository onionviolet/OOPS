# Docs truth-drift fixes, 2026-10-19

All edits are dated "Update 2026-10-19" notes or minimal hunks; old wording kept as history. Nothing staged or committed.

## Edits
- docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md ~:91: note after "buildLifeHeirSave is never called" (main.js:457/2763 wire it; owner W6 F2a).
- docs/worlds/world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md RF8 and 11_ACCESS_AND_STARTS.md X8: inline "now wired" notes.
- docs/audits/cheat-implementation-2026-10-10/REPORT.md Bottom line: banner (cheat_cards.js exists, heir builder called, baseline/locators stale; points to CHEAT_LIBRARY).
- docs/reviews/ENGINE_AND_IDENTITY_THREAD_2026-10-16.md: "No name is selected" note (OOPS accepted); M3 notes on Saved-outputs row and Open decision 2.
- docs/reviews/CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md, FOUNDATION_CONSIDERATIONS_2026-10-16.md, RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md: M3 passed notes (CHECKPOINT.md table verified: M3 passed on resume, M4 not started).
- AGENTS.md: AD1-AD36 -> AD1-AD38; UR41-UR48 -> UR41-UR49 (RULES_INDEX has AD38; UI_RULES has UR49). AD36 named-rule link untouched.
- CLAUDE.md: PROJECT.md "short summary" -> priorities/decisions summary, about 1,500 lines.
- docs/gm/SHARED_WORKTREE_PRACTICE.md "Merge before dispatch" step 2: push waits for Weibao's yes.
- docs/gm/README.md ~:79: GM_CAPACITY_AND_SUCCESSION relabelled historical, points to GAME_MASTER_PROMPT and AGENT_USAGE_RULES.
- docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md ~:17: note pointing at UI_RULES 2026-10-17 targets.
- docs/DOMAIN_RULES.md after ECR19 row: note that AD17 owns the recap wording where they differ (ECR19 text and status unchanged).
- docs/PROTOTYPE_HISTORY.md: removed wrong `docs/` prefix on every `](docs/` link (all targets verified to exist); repointed two dead anchors (:183, :215) to WANDERING_ZONES_AND_INSIGHT.md and CHARACTERS_AND_WORLD_EVENTS.md.
- docs/research/SOURCE_REQUESTS.md: struck S1/S4/S5 ask, replaced "Done (none yet)".
- docs/research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md: AQ3 row and two list rows note Magical Diary: Wolf Hall is owned and source-read.

## Left for Weibao or later
- Acceptance of BHR/CBR/ECR/SLR (IDEA_INDEX and three core audits say Proposed; RULES_INDEX says Accepted 2026-10-18; no USER_VISION entry). GR/CX "never binding" vs accepted. Status not changed.
- Remaining M3 "stopped" lines in FOUNDATION_CONSIDERATIONS (:13, :75, :98) and RAPID_ITERATION :44 are covered only by the top-of-file note.
- Offline-mode "never called" claim (01_HOME_AND_HUBS P2313) not traced.
- Eight `[PROJECT.md](gm/PROJECT_LOG.md...)` mislabels (USER_VISION, RESEARCH_GENRE_SWEEP, PROTOTYPE_HISTORY:353) not relabelled.
- main.js/display.js line anchors 1,000+ lines off (D3-F5) and 20 `file.js:N` citations: not fixed, too many.
- Duplicate reconciliation blocks, dedupe, file moves: out of scope.
