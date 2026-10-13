# A5 / P1 installed-slice native audit

2026-10-11. Finite audit complete; three concrete runtime defects reproduced. This is an audit return, not a repaired or accepted gameplay release. No original/candidate source, runtime pack, library, PROJECT, commits, pushes, merges or publishing changed. Earlier MICRO-P1 candidate and preview remain intact.

## Findings

**F1 / P1-UI, high:** The unmodified rebuilt game has no Optional worlds entry control after startup, on both a fresh hero and reload. The actual installed definition fetches and validates; registration is not the failing gate. `main.js` creates the panel, then the absorption startup calls `reload_normal_location()` at line7900, detaching its node. `content_pack_ui.js` checks an unchanged view signature before checking/remounting the host at lines9/26. Subsequent unchanged renders therefore leave it detached. An active generated job eventually changes the signature and makes the panel appear, which explains why active-job proof can pass despite the fresh-entry defect. Native entry also clears location controls after a save, so the same mount-order issue matters after movement. No repair was applied.

**F2 / P1-ABSENT-UNVISITED, high:** A generated current save made with the installed pack present, before ever visiting it, cannot be saved/exported after that pack is absent. Reproduced on the unmodified production bundle. Native saves serialize the registered location and availability even though `content_packs.packs` has no visit row. `preparePackSave` only scrubs location IDs held in existing pack rows, so it cannot recognize this unvisited pack’s native records. The loader warns about the missing location at `main.js:6214–6216`; its warning gate blocks saving at line6650. A wholly fresh malformed-manifest boot still falls back successfully. Absence of a previously visited pack works when its row supplies the provenance. These are different states, not contradictory results.

**F3 / P1-JOINED-CALENDAR, high:** A valid generated active visit with an enrolled chronicle advances the native calendar but not the expansion clock/chronicle anchor. The actual optional branch at `main.js:6740–6752` stages pack progress and native calendar independently of the joined clock below it. One normal timer tick produces a save which `validateSaveEnvelope` rejects with `Chronicle and game calendar disagree`. A reload of that save has no PLAY gate. Reproduced in both diagnostic and unmodified production bundles; direct validation confirms the before fixture is valid and the after fixture is invalid. This can strand an otherwise valid enrolled save after ordinary visited play. No validation bypass or retrospective reset was introduced.

## Inputs and proof boundaries

Managed isolated audit checkout: `/Users/weiwei/.codex/worktrees/a5-native-audit/yet-another-idle-rpg`, base `53dc1df15889be6ebb1bae403497041f0672db46`. The reserved original source inputs matched the checkout at start and close. Build used those current sources, not MICRO-P1’s older bundle. Native code stayed byte-for-byte unchanged. `npm run build` succeeded with existing Ink artifact check. Five `content_packs.test.js` tests passed. No broad unrelated suite ran.

One actual installed pack was snapshotted read-only into the audit checkout. Original manifest/pack hashes match at close. It is not synthetic loader content. Exact private pack revision/hash, current source/build/index/harness hashes, generated fixtures, revealing error text, UI snapshots and screenshots are in ignored agent-only evidence at `docs/research/novels/world-depth-2026-10-11/audits/native-proof/`. The original and audit private paths were checked ignored before writing. No personal saves were opened.

F1 blocks the normal fresh UI route. To inspect the deeper actual consumers without repairing source, an audit-only generated entry appends references to the existing `create_save`, state and `optionalPackPanel.render(true)` callbacks. This explicit force-render intervention exposes the existing controls; no pack mechanics, timers, saving or rewards are mocked or rewritten. Diagnostic results below qualify those consumers, not ordinary UI availability. C13 separately completes actual temporary transfer/payment in the unmodified production bundle from a generated active fixture; its first natural tick restores the detached panel by changing job state. F2 and F3 also have unmodified production reproduction.

Normal HackTimer/native played-time paths were used. No tick acceleration, direct completion, generalized engine or private pack edit was made. Generated starting fixtures are named as such. The diagnostic helper reads the real current envelope without writing it. Write failures use a narrowly toggled `Storage.prototype.setItem` rejection for this origin’s save key; no host quota or other origin is changed.

## Case ledger

| ID | Case | Executed outcome and qualification |
|---|---|---|
| C0 / F1 | Fresh/current reloaded entry controls | FAIL on unmodified production. Definition loads; panel is detached and remains absent. |
| C1 | Temporary selective delivery and one report payment | PASS with diagnostic UI access. One locally stored unit delivered, two carried units retained, stock/custody resolved, one local wage/report. Repetition unavailable; another natural tick adds no wages. |
| C2 | Leave during duty, return and resume | PASS with diagnostic UI access. Pending remaining time and custody unchanged while absent; re-entry resumes the same work, not a new claim. |
| C3 | Exhausted support and rest recovery | PASS. Generated depleted active fixture disables unsupported storage; native two-minute rest restores support and availability. It does not complete or pay the duty. |
| C4 | Actual failed entry write | PASS. Failed storage call publishes no visit, native movement, actor-world change or durable save change; successful retry enters once. |
| C5 | Actual failed return and clock writes | PASS. Return failure retains active visit/location; natural clock writes fail without advancing calendar, pending job or local custody/resources. Retry returns. |
| C6 | Actual failed wage publication | PASS. Generated report-ready fixture retains all local values on rejected payment write; retry gives one wage/report increment, then repeat is unavailable. |
| C7 | Current active and completed save/reload/import | PASS. Real save/export/file-input imports retain exact selected pack rows; includes active job and completed report. |
| C8R | Absent, saved fallback, reinstalled content | PASS after correcting the harness route owner. Active job/values retained dormant, Village fallback saved, actual definition restored, visit resumes unchanged. Earlier C8/C8R timeouts were a context-route mock not removed by page.unroute; they are superseded, not runtime findings. |
| C9fresh | Malformed manifest on fresh production boot | PASS. Base Village loads and saves with no private panel. |
| F2production | Pack removed before any visit | DEFECT REPRODUCED. Generated installed/unvisited save retains unknown native location; saving blocked while absent. Original C9 used this saved seed and exposed this distinct case. |
| C10 | Legacy active save/reload/import | PASS. Generated v0.5-shaped envelope restores exact pending pack job/custody and current-format roundtrip. |
| C11 / F3production | Enrolled-chronicle active visit, normal tick, reload | DEFECT REPRODUCED. Before validator passes; after validator and native reload reject calendar mismatch. Applies to the enrolled combination, not all fresh visits. |
| C12 | Keyboard and mobile controls | Keyboard focus/Enter return and re-entry PASS with diagnostic UI access. At390×844 the page has horizontal overflow, so mobile layout/comfortable touch use is not passed. |
| C13production | Temporary delivery/report through unmodified native bundle | PASS from a generated already-active fixture, after its natural job tick remounts controls. Selective custody and single local payment observed. Does not pass fresh entry. |
| C15 | Actual static/plain/accessible disclosure | PASS for the existing static panel. Reduced-motion preference leaves its text unchanged; buttons have textual names, panel has no title tooltips. Full visible/person/status/menu/log and accessibility text captured privately. No distinct private VFX/off renderer exists to audit. |
| C16 | Legacy completed save/reload/import | PASS. Generated completed v0.5-shaped envelope retains exact local completed row, rewards and custody through actual import. |

Five generic unit tests only establish their model/loader slices. They do not establish these browser outcomes. Expected defect checks are not positive compatibility passes. Raw failed attempts remain private and are classified/superseded above. A shared follow-up progress file was overwritten by narrowed helper runs; the completed command outputs and retained native artifacts are recorded in a separate durable follow-up receipt rather than presented as a missing full log.

## Disclosure and residuals

**K1:** The current renderer always shows all three defined person rows. It selects each state-linked memory string or introductory description, plus declared status labels and activity descriptions. It does not consult observer knowledge, distance or a hidden-person projection. The selected duty sets the supported receipt/memory fields, and those rendered states were captured after actual completion. This qualifies the installed slice’s authored UI, not source-wide character knowledge. A1/A2 must qualify which introductory claims are character-held and which future cards need a discovery gate; no sealed truth is copied here.

**K2:** Accessible text, ordinary visible text and reduced-motion static text carry the same inspected panel descriptions and controls. Native logs contain the ordinary attempted-write feedback. There is no separate pack-specific dynamic VFX renderer or effects-off/plain toggle. P8 remains a later interface gap; CSS/media preference evidence is not proof of an unimplemented mode.

**R1:** Mobile overflow is observed on the full native layout; keyboard action controls work. No claim of mobile usability, all tooltip families, offscreen NPC knowledge, all premises/method switches, permanent storage close/reopen, unconsciousness ejection or later exceptional rules is made. Fiction, pacing, natural balance and director acceptance remain separate. The current and legacy fixtures with no enrolled chronicle pass; F3 makes the enrolled combination fail.

## Repair packets and handoff

[REPAIR_PACKETS.md](REPAIR_PACKETS.md) binds each defect to its actual consumer, proposed narrow writer paths, compatibility requirement and acceptance gate. These are reviewable audit recommendations, not instructions to begin repairs. The three defects should be handled before calling P1 closed, without starting new world/VFX architecture. The mobile/disclosure residuals remain with their owning UI/source qualifications.

All source/private-pack writers remain released because this task never owned them. Public/private report/evidence writes are complete. Audit browser processes are closed; the isolated audit server is stopped after preservation. Build/harness checkout remains attached and recoverable. MICRO-P1 preview18531 remains untouched. No other user-owned chat was messaged. Root can inspect this return through its existing audit assignment; integration and director acceptance are open.
