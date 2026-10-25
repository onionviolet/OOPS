# Itch.io build waves checkpoint (2026-10-23)

Execution record only. Direction lives in USER_VISION (leftover itch items) and
the AD33 line in RULES_INDEX. No Claude checkpoint existed for these waves, so
this file is new. Nothing here is pushed or installed.

## Committed

- 8c9cc54db: wave 1 and 2 build (inheritance law, heirlooms, carry ledger, codex,
  household fortunes, obligations ledger, aging and contact, economy standing,
  crafting depth, recognizer, world history, bond rite).
- 547209e82: live paths for vows, tempering trial, rune bench, trust tiers, peer
  ranking, craft failure and grudge, route speed, insurance claims.

## Wave 3 lanes (uncommitted)

| Lane | Session | Scope | State |
| --- | --- | --- | --- |
| w3-events | local_90b73f7f-205c-4772-8b28-5235bd348d70 | G26 orphan/grief/came-of-age, G25 cause lessons, G03 status machine, G06 broadcast memories (`life_events*`, `defeat_domain`, `npc_lives*`, `relationship_view`) | Done. 53 focused tests, 1536/1920 browser incl. save/reload/Export/Import. Evidence `docs/gm/dispatch/w3-events-2026-10-23/evidence`. |
| w3-institutions | local_843d9084-7460-4175-a4bc-aa4a6a7a861b | G62 diplomacy/schism/heresy, G27 skill floor/near-miss/paths not taken (`skill_records*`, `lore_history_state`, `story_insight_domain`) | Done. 14 focused tests, 1536/1920 incl. Export/Import. `war:1` wording fixed, rebuilt, journey rerun at 1536/1920 (reported by the lane, evidence not re-inspected by the successor). |
| w3-spatial | local_2c4c6527-3b24-489a-bf1e-dfd1a9c94c7c | G22 room plan, `home_layout@1` slice, hearth changes the bed score (`home_layout*`, `home_model`) | Done. 16 focused tests, 1536/1920 incl. Export/Import. |
| w3-tooling | local_862ac903-45d4-4c3e-ba04-9779b99f0c04 | OG1 Godot v100 decoder, OG2 probe, OG3 Il2CppDumper | OG1 done (outside repo: `~/.codex/research/idle-reincarnator/tools/decode_gdc.py`, backup kept). OG3 3 of 5 builds. OG2 done check not met. |
| w3-reads | local_0443563a-153b-40e3-b096-278c4ba6e58d | OG5, OG6, OG8, OG10, OG12, IM26 reads | Done. `BATCH_W3_READS.md`; claims mostly reader-reported, one spot-checked. |
| w3-direction | local_93122453-5d4d-485a-8e3b-857133021578 | Direction record, round 4 (IM34-IM53), IM27 panel audit, OPEN_GAPS statuses | Done. `check:rules` passes. |
| w3-lineage | local_6c9e7fa1-00e1-41f4-921a-db5b84ab97ee | G24/G28 lineage traits, G29 companion wishes (`lineage_*`, `companion_wishes`, `companion_roster`) | Done. Focused tests in `tests/lineage_traits.test.js`, `tests/companion_wishes.test.js`; browser script passes 1536 (14 PASS lines) and 1920 (all steps incl. reload, literal import, schema 1 save). Evidence `docs/gm/dispatch/w3-lineage-2026-10-23/evidence`. |

No successor lanes were started: each remaining unit has its owner, so a
successor would duplicate a lane.

## Coordination handoff (2026-10-23)

Weibao asked for a fresh coordinator to save tokens. Coordination and writes
to this file pass to w3-coordinator `local_42a6014f-7743-4b7e-82c2-f50972ee6c08`
(Sonnet). It reuses the live workers above, finishes the post-lineage combined
and browser gates and keeps wave 3 uncommitted: no commit, push or install
authority was granted. w3-institutions fixed the `war:1` wording (8/8 focused);
its bundle rebuild and browser rerun are still owed.

## Successor coordinator

Successor session: the session that wrote this section (the Sonnet that took over from
local_42a6014f). Wave 3 stays uncommitted.

## Combined gate (final, 2026-10-23 evening)

Input identity: HEAD 547209e82 plus 752 uncommitted paths (wave 3 and other
sessions'), dist/bundle.js md5 322ad4a20ea7205db3d46e1e81289e3a, lineage lane
idle. `npm run build` complete; `npm test` 2731/2731; `check:arch` growth 0
(main.js 10115); `check:rules` PASS with 2 untracked-file warnings. Lineage
browser script: 1536 pass, 1920 pass in full (an earlier 1920 "failure" came from
two overlapping runs closing each other's browser, not from a wrong expectation;
the script was unchanged by the successor).

## Wave 3 paths for a later commit

src: companion_roster, companion_wishes, defeat_domain, home_layout,
home_layout_domain, home_layout_panel, home_model, life_events, life_events_domain,
life_events_ui, lineage_domain, lineage_traits, lore_history_state, npc_lives,
npc_lives_ui, relationship_view, skill_records, skill_records_domain,
story_insight_domain (all `.js`). Other wave 3 source edits may sit in shared files
(hunk-only): check `git diff` before staging.
tests: companion_wishes, home_layout, institutions_records, life_events,
lineage_traits (`.test.js`). scripts: life_events_browser.cjs,
lineage_companions_browser.cjs. docs: dispatch dirs w3-events, w3-institutions,
w3-lineage, w3-spatial and itch-wave-2026-10-23; research `BATCH_W3_READS.md`,
`W3_{EVENTS,INSTITUTIONS,LINEAGE,SPATIAL,TOOLING}_NOTES.md`, `OPEN_GAPS.md`.
Not wave 3: the `distinct-world-w1-w4` evidence folders.

## Gaps

- Not committed: wave 3 stays uncommitted. The existing commit authorization
  covered the earlier waves; a wave 3 commit needs Weibao's yes.
- Other sessions' paths (chain inspector, LOTM, gear workshop, desktop host,
  skill overflow) share the tree and are not part of this wave.
- OG2, OG3 (2 builds), OG4, OG7, OG9, OG13 remain open or blocked per
  `docs/research/itch-io-2026-10-22/OPEN_GAPS.md`.

## Audit dispatch (2026-10-23)

Per GAP_AUDIT.md F2, w3-coordinator `local_42a6014f-7743-4b7e-82c2-f50972ee6c08`
was re-pinged to collect institutions and lineage results and finish the stable-input
final gates; it was running at 19:27 UTC. F3 went to a fresh Sonnet, D2
`local_cbe1e18d-af8a-474c-a6cb-57d355b92f32`, in an isolated worktree (branch
`d2-decision-reasons`); it covers the economy, contact, household and pledge
decision surfaces only and does not touch wave 3 paths. Wave 3 stays uncommitted.

## Status update (2026-10-23, later)

- w3-lineage finished: 1536 13/13, 1920 passed through reload, last step failed on a wrong script expectation (`scripts/lineage_companions_browser.cjs`). w3-coordinator owns the fix, the 1920 rerun and the combined gate; running, no result yet.
- D2 hunks applied to the primary working tree (economy_standing_domain.js, economy_standing_ui.js, household_fortunes_panel.js, pledges_ui.js, aging_contact_ui.js, tests/economy_standing.test.js); focused 31/31. They are part of the stable input for the final gate. Details in GAP_AUDIT.md.
- D2 (same session) is verifying 21 px, Slums quote and contact/household browser evidence in its own worktree; it does not write primary.
- Wave 3 and the D2 hunks remain uncommitted: no merge, commit, push or install.
- A separate home-clock pilot must not write household/home paths without the dispatcher's seam handoff.

## Status update 3 (2026-10-23, 5:15 PM EDT)

- Combined gate on the D2-applied tree (reported by w3-coordinator): build ok, `npm test` 2731/2731, `check:arch` no growth, `check:rules` pass (2 warnings). Input: HEAD 547209e82 + 752 uncommitted paths, `dist/bundle.js` md5 53c77026bdeef97ffdcaae6e89b8b6af.
- Lineage browser proof at 1920 stalls at the heir-crossing step on this tree (earlier tree: full pass); cause unresolved. w3-coordinator was released; successor w3-final `local_d5ce10d7-289b-48b6-ab4d-a7156ab4795c` owns diagnosis, the serial 1536 run and the final record. Final results are not yet written.
- D2 finished: 21 px and Slums quote pass at 1920 and 1536; contact panel passes; household panel has no browser evidence.
- Nothing is merged, committed, pushed or installed. A home-clock pilot may not write household/home paths without the dispatcher's seam handoff.

## Final record (2026-10-23, 5:40 PM EDT)

Two gate sections exist; do not mix them. The earlier gate in this file is on
`dist/bundle.js` md5 322ad4a2..., before D2's hunks. The final gate below is on the
D2-applied input: HEAD 547209e82 + 752 uncommitted paths, `dist/bundle.js` md5
53c77026bdeef97ffdcaae6e89b8b6af (unchanged across the runs below).

| Check | Result |
|---|---|
| Build, `npm test` (reported by w3-coordinator) | ok; 2731/2731 |
| `check:arch` / `check:rules` (same) | no growth (main.js 10115) / pass, 2 warnings |
| `lineage_companions_browser.cjs` 1536, serial, port 8933 | 14/14 PASS, exit 0, no page errors |
| `lineage_companions_browser.cjs` 1920, rerun with captured output | 14/14 PASS, exit 0, no page errors |

The earlier "stall at heir crossing" was slowness, not a defect: the first 1920 run
on this tree reached 03-death-inherited at +90 s and finished 07-back at about +8 min;
the rerun took about 9 min. A 900 s kill leaves little margin, so budget 1200 s.
The first run's stdout was lost, so the captured rerun is the record. No source
files were edited. Evidence: `docs/gm/dispatch/w3-lineage-2026-10-23/evidence/`
(01-07 at 1536 and 1920).

Remaining boundaries: household panel has no browser evidence (source and tests
only); wave 3 and the D2 hunks stay uncommitted (no merge, commit, push or install);
committed HEAD does not build alone (`src/pledges_content.js` imports the untracked
`src/progression_gates.js`); a home-clock pilot may not write household/home paths
without the dispatcher's seam handoff.

## Desktop interaction closure dispatched (2026-10-23)

One fresh Sonnet, `local_9127611c-0d27-44c5-bc4c-a26a9b67eb7b` (desktop-closure), owns only the hit-target reproduction/fix and the populated household panel proof, in its own worktree. The wave 3 lineage proof and test gate stay closed. The previous coordinator stays retired and no w3 or D2 implementation lane was cloned. It records patch/input hashes and evidence here when it reports.

## Desktop interaction closure result (2026-10-24)

- Hit target: NOT reproduced at 1920x1080 or 1536x864. Playwright normal clicks (no force) on Talk, elder, hello and back passed after 1920->1536 resize and fresh 1536, at 14 and 21 px (with and without reload), and a trial click over all 53 visible controls found 0 interceptions. The qud MERGE_PLAN line says "Not investigated"; no fix existed there. No source patch written; no regression added.
- Latent geometry (not a target-viewport defect): the `top` handle (`src/shell_resize.js` place('top',...)) spans the whole player-to-reports width, but in service mode the actions column spans both rows. At 1440, 1366 and 1280 wide the handle band sat on the elder `hello` centre (elementFromPoint returned `.shell-resize-handle`); after a resize the row gap also differs from a fresh load at the same size (318 vs 481 px at 1536x864). A Playwright click at 1440 still passed once. Candidate fix if wanted: limit the `top` handle width to the player column in service mode. Left unfixed.
- Household panel (D2 reasons, staff parts, watch rows; ducal start via Homes, ~9 game days): rebuilt bundle md5 53c77026bdeef97ffdcaae6e89b8b6af, input hash (src, styles, style.css, build.js, locales) bb3e89b09b7d9cd31ab7ea0710351249246a33f5081a0656012add32c60b0025, shell_resize.js 9373144ed6e310e8, shell_layout.css c114835c8955ea66, household_fortunes_panel.js 7753d68b7a771cd0. Screenshots opened at 1536x864 14 px and 1920x1080 21 px; panel text read for all four combos. Keyboard summary traversal and pointer toggles pass in all four; no clipped text, 0 page errors.
- Gaps: obligations/costs rows only show "Nothing is owed" (no cost row exercised); no awakened-with-signs watch row beyond circumstances; 1 of 5 pointer runs (1536x864, 14 px, 24 ticks-chunks) timed out on the first summary click, not reproduced in two reruns, cause not captured. No household source defect found.
- Evidence: /Users/weiwei/Library/Application Support/Claude/side-session-notes/local_c1a96817-04a5-4cd2-b5c6-d80abc66a4a3/desktop-closure-evidence/ (scripts, hh_*.png/txt, run.log). Candidate worktree .claude/worktrees/desktop-interaction-closure-2e51ef (uncommitted copy of primary src/styles/tests).

## O/F/A candidate D1 and D2: reproduced and patched (2026-10-24)

History kept: the earlier no-repro above was on the primary snapshot (service-mode handle overlap was latent there). On the integration-o-f-a tree (HEAD 4f060ef38, working-tree src/styles/style.css/build.js/locales sha256 b07148fa…d3, rebuilt bundle md5 42841e5c…) both defects reproduce with normal Playwright clicks.
- D1: at 1920x1080 the `top` resize handle intercepted the Bio "How you look" summary (also at 1536 on the notebook/Stats views by geometry). Cause: with the focus box away, `actions` spans both rows (39-1063), but the handle was drawn from the player column to Reports (x 17-1396 at y 340). Fix: new `dividerSpan` in `src/shell_resize.js` limits the divider to columns where a box ends above and another starts below (handle now 17-518). Keyboard arrows, drag and Home still work (453→473→530→453 px).
- D2: the Notebook nav route targeted `records` plus the Journal tab, but the notebook content is the workspace-owned `notebook` module, so the Journal tab showed an empty box. Fix: `src/layout_spec.js` route `records:notebook` now targets `notebook`; UIL1 pin updated.
- Patch (3 files, applies clean to integration-o-f-a by `git apply --check`, not applied there): /Users/weiwei/Library/Application Support/Claude/side-session-notes/local_c1a96817-04a5-4cd2-b5c6-d80abc66a4a3/desktop-closure-evidence/ofa/d1d2-shell-resize-notebook-route.patch sha256 25cfbf39…; results shell_resize.js a14e4767…, layout_spec.js 4189ad9b…, tests/layout_spec.test.js 779d45e0…; integration originals 9373144e…, b380f6e9…, 620b3f29…. Rebuilt candidate bundle md5 4e2aac9a66e182fc409c1a1bde58f039.
- Checks: `node --test tests/layout_spec.test.js` 19/19 (new divider-span regression plus the Notebook route pin); `check:arch` ok. Browser (headless, localhost:18752, no force): Bio summaries, Notebook nav (Here/Practice/People shown), handle-overlap scan over 11 views with 0 handle hits, at 1920x1080 and 1536x864, 14 and 21 px; screenshots opened (bio 1920 14, bio 1536 21, notebook 1536 14, notebook 1920 21 inspected). Full suite not rerun (unchanged inputs elsewhere).
- Gaps: body-panel command buttons ("action buttons") were not clicked: after Practice the Body & recovery panel stayed hidden in my script path (same before the fix), so that part of D1 is by overlap scan only. Handoff: integrator coord-ofa-2 (local_5e36e0d0) owns applying the patch; my ownership of the three files is released with this entry.
- Evidence: /Users/weiwei/Library/Application Support/Claude/side-session-notes/local_c1a96817-04a5-4cd2-b5c6-d80abc66a4a3/desktop-closure-evidence/ofa/ (scripts d12b/scan/rs, screenshots).

### O/F/A D1/D2 final-tree pointer proof (2026-10-24)

Integrator added one hunk to my patch (src/layout_spec.js line 168: `'notebook': surface('ST6', {representations: routed})`) after tests/ui_contract.test.js failed on the new Notebook route; it belongs with patch 25cfbf39…. Folded here; resulting layout_spec.js sha256 9a38b3d0…. Lesson: run ui_contract with layout_spec for route changes.
Input: tree cd40e6424b22201d (sorted-hash over src styles tests scripts locales; copied read-only into candidate and re-hashed equal), rebuilt bundle md5 ba1fca564cef153e6b6af2342ee0264f. `node --test tests/ui_contract.test.js tests/layout_spec.test.js` 22/22.
Real pointer (no force), headless, localhost:18763, start_probe frail start: at 1920x1080 and 1536x864, 14 and 21 px, all PASS: Bio summaries (description, conditions, learned) toggled open and shut; Here pane, Talk, elder, hello, back; Notebook nav (unlocked, views here/practice/people); Practice, Body & recovery, action button "eat meal"; Beginning nav and Begin (the Begin click starts the Reedbank life, so it ran last). 0 page errors. Divider `top` handle spans only the left column (501/527 px). Screenshots opened: 1920 14 bio, 1536 21 practice (earlier set: bio and notebook at both sizes).
Notes: one earlier Begin click timed out waiting for a stable element and passed on rerun (Beginning panel re-render, not an interception; not investigated). The body panel needs the elder met first (body_ui.js). Evidence: /Users/weiwei/Library/Application Support/Claude/side-session-notes/local_c1a96817-04a5-4cd2-b5c6-d80abc66a4a3/desktop-closure-evidence/ofa/final/.
