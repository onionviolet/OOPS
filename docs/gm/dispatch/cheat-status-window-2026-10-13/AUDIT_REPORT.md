# Independent cheat status window audit

2026-10-14, America/New_York. Read-only audit of master. Initial detached snapshot: `d1ef4736ab7602fe4cfd75d4252b6494c22501ff` in `/tmp/yairpg-audit-20261014`. During the natural timing run another writer advanced master, first with documentation and then unrelated runtime changes. Final rebuilt snapshot: `5c084e50cc251fc9b9d8f26b754377da5c61ffca` in `/tmp/yairpg-audit-current-20261014`, served on port 18441. The main checkout remains on `codex/gameplay-foundations`. I did not make those intervening commits. The required gates/suite and the concrete failure/arrival cases were rerun on the final build; its natural first-win route was also repeated. The six-scheme/viewport matrix and 40-minute timing remain attributed to the initial build, whose cheat, clock and UI sources/styles are unchanged. Design references use the live main-checkout owners; S1 remains a proposal, not shipped stage-1 behavior or an accepted implementation specification.

## Verdict

**Stage 1 is not ready to build from the current palette unchanged.** The normal stage-0 route works, the rebuilt C0 and CH1 gates pass, and the full suite passes 628/628. However, ordinary travel can cross day 3 without awakening, failed awakening persistence can publish a panel and message absent from the durable save, and discovery accepts an awakened flag without the required first message. The default desktop placement also lets an arrival and F6/header checks pass without making the contents visible. These are concrete limits of the current foundation, not grounds to expand the task into all proposed cheat systems. The smallest defensible next build is one finite, known skill milestone quest with manual claim for one unspendable point, using durable publication and a typed held-card state. Its trigger and legacy behavior need a selected contract. This is an audit recommendation; no source, gate, progress flag, commit or push was changed.

## Findings, ranked by severity

### F1. Awakening publishes before persistence succeeds

**Severity: high for stage-1 reuse; medium for the present informational slice. Label: seeded-native.** A targeted storage fault rejected only writes containing an awakened card, allowing the real fixture clock to reach day 3 normally. The window appeared and the first system line was logged, but durable `cheats` still contained `awakened:false` and no messages. Two awakened-save writes were refused. Thus the discovery is not necessarily based on a persisted first message, and reload can lose an arrival the player already saw. No points, items or XP were awarded by this stage-0 transition; the concrete danger for stage 1 is copying this sequence for rewards or claims.

Evidence: `src/main.js:303-315` assigns `cheatState`, logs and renders before calling `save_progress`; `src/main.js:5255-5265` catches storage failure without rolling that state back. `runs/audit/current-failure-storage.log:1` (final build) and `failure-storage.log:1` (initial build) record `visible:true`, rejected awakened state, durable dormant state and the quota error. Screenshot: `runs/audit/current-failed-awakening-storage.png`. The broader all-save-write fault in `supplemental.log` instead paused the clock before awakening; it does not prove this defect. The targeted fault is the decisive test.

### F2. Travel can miss the day-3 awakening

**Severity: medium. Label: seeded-native.** Using the real-code dormant fixture, I unlocked the native field through the elder's ordinary dialogue, entered and immediately returned twice, and waited six seconds. Those four native 15-minute trips crossed the boundary. The resulting save was day 3, 00:23, still dormant, with no first message, no kills and no visible window. This contradicts an unconditional “first won fight or day 3, whichever first” claim.

Evidence: `runs/audit/current-travel-boundary.log:1` reproduces the same day 3, 00:23 result on the final build; screenshot `current-travel-crossed-day3.png`; reproducer `current-travel-boundary.cjs`. The initial reproduction is retained in `travel-boundary.log`. `src/main.js:2233-2234` advances time on travel; `src/main.js:7193-7195` does not check awakening. The periodic update takes `prev_day` only afterward and calls awakening only when its own tick crosses a day (`src/main.js:7243-7246,7256-7259`). Inference from that source: without a victory or another relevant transition, this missed path waits until the next tick-driven day boundary. I did not wait another full day on this fixture.

### F3. The closed envelope does not enforce the status card's semantic state or first-message requirement

**Severity: medium. Label: source.** The top-level card, held-entry and save-container keys are closed. The card's `state` and the `known` contents are not a closed gameplay contract. A valid boolean is required for `awakened`, but negative/object-valued points, an arbitrary stage/board, and a non-calendar JSON timestamp pass validation. `awakened:true` alone makes the card discoverable even with zero messages. This is broader than CH1's documented persisted-first-message rule. It is not evidence that ordinary creation grants bad state: its factory writes `{awakened:false,points:0}` correctly.

Evidence: `src/cheat_cards.js:28-44,47-63,82-87`; `runs/audit/state-contract.log:1-3` records accepted negative/object points, stage 99, an arbitrary board, and discovery without a message. CH1's requirement is `CHEAT_PANEL_CARDS.json:6` and `GOAL.md:23-25`. `src/status_window.js:32` renders the supplied points directly. Stage 1 needs per-card typed validation and an explicit legacy compatibility policy, rather than treating C0's JSON validation as an existing reward contract.

### F4. Desktop readability is good, but the default placement and header-only focus checks miss useful visibility

**Severity: medium. Label: seeded-native.** In both schemes, F6 reached a visible ring at all three requested sizes and Shift+F6 returned to Equipment comparison. Text contrast passed and there was no horizontal overflow. But after F6, the 1366×768 panel began at y=687.64 and ended at y=1165.77; most contents were below the viewport and footer. At 1440×900 it occupied y=819.64–1297.77, and at 1920×1080 y=823.64–1282.17. Scrolling its dock makes it readable; the contents are not intrinsically inaccessible. The default nevertheless requires extra scrolling for this new informational panel and repeats information already visible above it.

Evidence: `runs/audit/supplemental.log:7-12`; `runs/audit/ui-vivid-1366x768.png` and the other five `ui-<scheme>-<size>.png` screenshots. `src/status_window.js:36-38` requests placement after vitals, but the fresh Workspace preset sorts unlisted module IDs to the end (`src/workspace_layout.js:44`); the anchor handling at `:34-42` applies to newly added modules in an existing layout. F6 explicitly scrolls the header only (`:315-325`). H6 likewise measures the header after scrolling, not the full content (`checks/ch1_gate.cjs:128-132`). The separate arrival test recorded `workspace-reveal-quiet` at y=823.64–1301.77 in a dock ending at y=724: **zero visible pixels** during the once-only cue (`runs/audit/reveal-visibility.log:1`, `arrival-below-fold.png`), reproduced on the final build in `current-reveal-visibility.log:1` and `current-arrival-below-fold.png`. A marker count alone therefore misses the intended visible arrival.

### F5. S1 contains real scope and state-model ambiguities

**Severity: medium. Label: source.** The live S1 section explicitly calls itself a palette. It does not select a trigger, board algorithm, point rate, claim policy, expiry, inheritance or supported-world contract. SW1 puts points with stage 2, while the later S1 text puts point earning in stage 1; the later proposal can reasonably supersede that detail, but it must be selected as such. “First title” is unsafe as an unqualified post-awakening trigger because the same first kill can awaken the card and earn Blooded. Recipe-specific crafting progress cannot be reconstructed from the currently saved global success counter, and “make 3” is ambiguous between successful batches and output units. System-quest titles can grant native bonuses, so “no item/XP reward” alone does not guarantee no early power.

Evidence: live `docs/CHEAT_LIBRARY.md:730,892-957`; `src/titles.js:8-39` lists milestone thresholds and several actual bonuses; `src/main.js:7698-7717` defines the real title counters, including the warning that `total_kills` is not the real tally. `src/main.js:4252-4253,4269-4276,4946-4947` separates global successful crafts from output quantity. `src/quests.js:127-175,185-299` mutates story quest state and processes rewards automatically. Reuse its compatible condition vocabulary, not its story reward/registration path for a new point board. Further proposal tensions matter only when selected: auto-claim changes reward settlement and board size can change generation, so S1U.4 is not automatically a browser-only display setting (W3 `IG11`, lines 381-389). UP2 permits unknown silhouettes/counts (`CHEAT_LIBRARY.md:748`) while the current kit forbids them (`PANEL_KIT.md:24`); keep the current no-leak contract for this slice. WR1 combines standing, frequency and prohibition in one summary field, whereas W1 `PW2`, lines 29-42, permits simultaneous common/forbidden descriptions. W2 lines 43-48 also warns that WR8 must not erase a selected Absolute equalization option. These are qualifications of the proposal vocabulary, not new runtime gates or reasons to build all those systems now.

### F6. Green gates establish their tested slices, not the full intent

**Severity: medium. Label: source.** H3 exercises only the near-day-3 fixture, so it misses F2 and does not test F1. H4 can pass with incorrect titles, points or quest text because it checks element existence; its Strength equality check is skipped if the native comparison cannot be found. H5 can pass after changing messages or acquisition details because it checks panel presence and reveal count. Z3 checks held IDs, not exact card state. Z4's preservation check checks the hero name, empty held cards and absence of a fixture marker, rather than the full protected save. The “new origin” comments actually mean a new browser context at the same URL; this audit separately used another port.

Evidence: `checks/ch1_gate.cjs:28-33,68-83,90-104,107-132`; `checks/c0_gate.cjs:56-62,64-85,87-107`. `check_ch1.sh:5-6` also hardcodes the historical worktree and port, overriding caller variables. I read but did not run that wrapper; I ran its component regressions with the audited `REPO` and `URL`. Complete proposed additions appear below.

### F7. The historical “fresh hero cannot win” statement is contradicted by natural play

**Severity: low, but material to the prior acceptance description. Label: natural.** A fresh ordinary hero chose the dormant system, talked to the elder, received and equipped his sword and the starting pants, and entered the native field. Its first defeated enemy awakened the system on day 1. The recorded save had one bestiary kill, zero deaths, zero points and the first system message. Its `total_playtime` was 96 ticks; that is a game counter, not a separately measured wall-clock duration. After the ordinary title scan, the status window showed Blooded. No fixture, clock change, dev command or imported envelope was used for this play path.

On the final rebuilt snapshot, a second fresh game naturally awakened after **12.865 wall-clock seconds** from hero confirmation, with rapid automated dialogue/equipment clicks and one first victory. It logged exactly one status-window reveal and first message, and then displayed Blooded. This is a fast path, not a typical human reading-time estimate. Evidence: `runs/audit/current-natural-win.log:1-2`, `current-natural-win.json`, `current-natural-win.png`. Initial-run evidence: `runs/audit/first-win.cjs`, `first-win.log`, `first-win-result.log` (saved calendar, bestiary, cheats and complete combat log); screenshots `first-win-combat.png` and `first-win-awakened.png`; `natural-postwin-persistence.log` records the later Blooded row. This contradicts `CH1_REPORT.md:71-72`. That report's original first-win coverage was correctly labelled source-only; my new evidence does not retroactively make its earlier run natural.

### F8. Normal build and automated regression results are green

**Severity: informational. Label: source.** After installing the detached worktree's three locked dependencies with `npm ci`, `node build.js` passed. The final audited and served bundle SHA-256 both equal `0c4376463e9e13c1faa04ba5f8145960c2195eec14eb6e5ae0fa3637e3498def`. The initial hash was `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`. The final `npm test` passed 628/628 (initial suite 621/621) with no skips or failures. C0 reported five passes, including seven cheat-named tests; CH1 reported six passes, with its first awakening measured at 48 seconds on the final run (47 seconds initially) from the near-boundary fixture. Panel-kit 7, settings 7, crafting 9 and Vivid 10 checks also passed. These browser gates use seeded prerequisites for much of their behavior; this finding reports their command results, not natural acquisition of every prerequisite.

Evidence: final-build `runs/audit/current-build.log`, `current-c0.log`, `current-ch1.log`, `current-npm-test.log`, `current-exit-codes.json`; initial-build `exit-codes.json` records exit 0 for each completed command; `build.log`, `npm-test.log` final summary, `c0.log`, `ch1.log`, `panelkit.log`, `settings.log`, `crafting.log`, `vivid.log`. C0/CH1 frozen hashes verified unchanged. The initial build attempt failed only because this fresh worktree lacked `esbuild`; the successful build followed `npm ci`. Generated regression screenshots were retained under `runs/audit/regression-*` and their tracked detached-worktree evidence files restored to master bytes. Only the generated source map differed in the detached tree afterward.

### F9. The optional beginning is dormant, informational and concealed in ordinary UI

**Severity: informational. Label: natural.** A new game defaulted to No system; choosing Begin with a system acquired the real card through hero creation, recorded a dormant beginning and gave no first message or visible panel. The player-facing text/attribute scan found no Status window, Quest system or system-quests name after creation; the density control and Appearance option were absent. The selector describes the system generically and openly discloses that Surprise me currently has only one available system. Technical hidden DOM IDs exist, so “does not exist” should mean no player-facing name, region, setting or picker entry, not absence of an internal DOM node. Export did not show the card's name in the page; decoding the synthetic export naturally reveals saved card IDs and names. The export is not a spoiler-redacted share card.

Evidence: `index.html:124-132`; `src/main.js:8165-8178`; `src/cheat_cards.js:77-84`; `src/status_window.js:23-33`; `runs/audit/supplemental.log:1-4`; `natural-creation.png`, `natural-dormant.png`, `natural-start.json`; `surprise.log:1-2` confirms the surprise life record, zero points/messages, dormant card and absent Appearance option; `name-surfaces.log` inventories every source name occurrence. The card has no hooks or grant behavior, and the renderer reads existing character stats/titles. The early first-win awakening adds knowledge, not a stat boost or a completed progression chain. The ordinary player's UI already had those baseline stats; this does not by itself establish what NPCs can read in fiction.

### F10. The uninterrupted natural day-3 fallback has a substantial real-time wait

**Severity: informational/pacing judgment. Label: natural.** On the initial rebuilt snapshot, the panel became known on day 3, 00:00 after **2,437.449 seconds, or 40 minutes 37.4 seconds**, measured from hero confirmation by a DOM observer. The status-window reveal was recorded exactly once. This timed run was not repeated for another 40 minutes on the later build; the timer/awakening code is identical and the final gate re-exercised the day boundary. The new hero stayed in Village, awake, with normal time and no combat, fixtures, imports or speed changes. The ordinary dialogue and spare-weapon choice did not advance the calendar; no native travel was used on this run. Late on day 2 I queued ordinary Running, which keeps the same one-minute-per-tick rate. It earned native skill level 1 while the card remained dormant with zero points (`natural-running-state.log:21,122`); this supports the recommended known-skill quest owner without attributing ordinary training power to the cheat. The source expectation is 2,400 game minutes from day 1 08:00 to day 3 00:00, about 40 real minutes at the default rate. Sleeping uses six game minutes per tick where a bed is available, but I did not use or time that route.

Evidence: `runs/audit/natural.log`, `natural-timing.json`, `natural-awakened.json`, `natural-awakened.png`; `src/game_time.js:195`; `src/config.js:19-23`; `src/main.js:7150,7231,7688`. Judgment: the fallback is plausible for an idle life, and the ordinary first-fight route provides a much earlier arrival. Forty minutes is still a long first payoff for a chosen optional beginning, especially when the result is another informational view and the reveal can occur below the fold. This is pacing feedback, not a selected new timer or an unlock-gate requirement.

### F11. Persistence works on the exercised normal routes, including both old fixtures

**Severity: informational. Label: seeded-native.** Exact `cheats` equality survived dormant save/reload and native Export/literal-file Import into `http://127.0.0.1:18438`, distinct from the source port 18437. The awakened day-3 export also imported exactly, without another reveal. The legacy C0 held fixture remained usable through its stored message. Both supplied old fixture files, `precombat.save.txt` and `fought.save.txt`, loaded through literal-file import, saved empty schema-1 cheats and produced no page errors. Natural first-win progress additionally retained Blooded and exact cheat state across reload and import; that natural supplemental evidence is recorded separately rather than relabelling the old fixtures natural.

Evidence: `runs/audit/supplemental.log:3-6,14-15`; exported files `dormant-export.txt`, `awake-export.txt`, `old-*.save.txt`; `c0.log:2-4`; `natural-postwin-persistence-recovered.log`; `src/save_files.js:40-42,158-191`. The first CDP download-copy attempt for the natural export failed with ENOENT. The recovery captured the exact Blob emitted by the real Export button, wrote those bytes to `natural-firstwin-export.txt`, then used the literal file input. It did not construct a new save envelope. These checks prove the cheat domain and the exercised title, not byte-for-byte preservation of every shared system.

### F12. Appearance, text contrast and kit styling work within the measured desktop scope

**Severity: informational. Label: seeded-native.** All six Standard/Vivid viewport combinations passed the supplemental panel text contrast check: minimum approximately 12.18:1 Standard and 12.51:1 Vivid. No panel/page horizontal overflow or page error occurred. F6 focus outlines were 2px solid yellow in both schemes. Applying a Status window background of `#5a1010` through actual Appearance controls produced `data-custom-palette="true"`, computed `rgb(90,16,16)` and a persisted module override. Thus the old B1 whitelist blocker is closed in the audited build. The panel uses the kit's teal character role in Vivid and common neutral treatment in Standard, with shared typography, decorative icon and labelled region, rather than a separate visual language. Compact density tightened rows in H4. Readability and style parity do not resolve F4's placement or establish human taste acceptance.

Evidence: `runs/audit/supplemental.log:7-13`, its six UI screenshots and `appearance.png`; `ch1.log:4`; `src/customization_profiles.js:11,71-73`; `src/status_window.js:36-40`; `styles/status_window.css:1-8`. Appearance's screenshot shows the main layout with the panel below the fold; computed colors and the saved override, rather than that screenshot alone, prove application.

### F13. Shared-code joins preserve existing boundaries in source; broader native compatibility is not proved

**Severity: informational with explicit residual risk. Label: source.** I reviewed every named C0/CH1 hunk, the merge diff and the Appearance whitelist addition. The cheat import validator runs before preflight/storage; serialization validates the domain; load defaults missing cheats to empty; post-durable life-save publication restores cheats; hero creation captures the choice before controls are removed; panel initialization is excluded from import probes and blocked/error loads. Existing read-only import/save guards remain. No cheat grant was added to content-pack activation or heir leftovers. `buildLifeHeirSave` copies the fresh envelope, so the present heir path does not automatically inherit the previous card. That is current behavior, not a universal design limit. The victory hunk adds a save before clear-count/quest settlement, and the day hunk depends on a tick-local boundary; F1/F2 are the observed risks in those joins.

Evidence: `src/main.js:284,300-315,430,2282,3640-3662,5182,5255-5259,5290-5292,7256-7259,8165-8178,8230,8315-8325`; `src/save_files.js:42,185-191`; `src/life_experience_host.js:11-29`; `src/main.js:1638-1651,7056-7066,7131,7153,7880-7888`; `src/customization_profiles.js:11`. Passing 628 final tests and four initial-build UI regression gates supports their respective slices. No sealed/private-pack campaign, full native heir journey or full foundation-failure matrix was exercised for this audit.

### F14. Direction agrees for this Village pilot; several documents and future-world contracts need qualification

**Severity: informational/document consistency. Label: source.** Optional start first, default none, dormant stage 0 and a disclosed singleton Surprise me agree with the live direction. US unlocks, weighted rarity, other families, library progress and multiversal behavior remain possible and deferred. Their absence is not a contradiction or a new completion gate. The current status renderer has only held-card discovery, and start selection has no per-world baseline or rarity resolver. Therefore this Village implementation cannot be advertised as a general WR6/WR7 solution or as population-weighted random acquisition. A chosen singleton start does not imply every local resident gets a system.

Evidence: live `docs/USER_VISION.md:2065-2086`; `docs/CHEAT_LIBRARY.md:608-609,712-717,762-771,799-806`; `src/main.js:8170-8177`; `src/status_window.js:24,36-38`. W1 PW2/RY8 separates standing, frequency and legality; W2 XW34-XW36 distinguishes world-law and imported suppliers; W3 HU12/IG11 records silhouette and adapter tensions. These are proposals, not runtime claims. `GOAL.md:31-34` still says the start emits its first message, while `:38-41` and the build defer it to awakening. C0/CH1 reports retain old blocked headings followed by coordinator closes; their chronological closures resolve the old blockers, but those headings are misleading as current summaries. S1 was committed to master during this audit without a runtime change of its own; later unrelated runtime changes were separately rebuilt/retested; its “Palette, not specs” qualification must remain visible.

## Gate gaps: proposed additions only

No gate was edited and no `progress.json` pass flag changed. The table describes how a pass can miss intent, then proposes a check. Frozen integrity alone does not establish coverage quality.

| Item | What can pass without proving intent | Proposed addition |
| --- | --- | --- |
| H1 | Checks a control, default, keyword description and none branch; not all options, Surprise me, known costs or complete accessibility channels. `ch1_gate.cjs:37-52,25`. | Exercise all three options; inspect option text, accessible names, title/description references, picker, authoring, settings and export UI before/after creation. Assert saved life-choice text. |
| H2 | Checks dormant ownership and chiefly the “Status window” name, not full identity surfaces, harmlessness, exact zero points or dormant restore. `:54-66`. | Assert complete card/state/messages, no stat/XP/money/unlock delta due to acquisition, absence from focus/settings/Appearance, and dormant reload/import. |
| H3 | Near-boundary tick route only; first-message presence is not message uniqueness or durable-before-visible ordering; a marker need not be visible. `:28-33,68-83`. | Natural first win, uninterrupted natural day 3, travel crossing, already-past-boundary restore, and targeted failed-write cases. Observe exact durable transition, one message, status-specific cue, actual animation/static final state and viewport intersection. |
| H4 | Only level and possibly Strength equality; titles/points/quests need merely exist. `:90-104`. | Positive earned-title and nonzero level/stat fixtures, all five stat comparisons, exact stage-0 point/quest text, compact/comfortable persistence, and actual Appearance apply/reload/import. |
| H5 | Panel and cue checks can survive loss/change of acquisition, messages, known records, points or other state. New context is not a different port. `:107-121`. | Deep-compare the cheat domain and selected native facts before/after every boundary, both dormant and awakened, with a second origin. Compare log replay and message counts as well as reveal markers. |
| H6 | Header reachability after scripted scroll, default scheme only, forward F6 at one size, approximate background contrast. `:123-135`. | Both schemes at all three sizes; contents and future Claim controls visibly fit/reach the supported reading region, reverse F6, hidden-panel skipping, focus-ring contrast, reveal intersection, large text, Effects off and reduced motion. Use rendered/composited backgrounds when translucent or filtered. |
| Z1 | Top-level structural samples do not cover gameplay state semantics or discovery consistency. `c0_gate.cjs:36-54`. | Typed status state, valid timestamps for interpreted fields, finite bounded integer points, first-message/discovery consistency, duplicate quest IDs, unknown schema/key rejection and explicit legacy cases. Keep generic uninterpreted card data distinct. |
| Z2 | One old fixture, empty held cards; does not assert empty `known` or other-domain preservation. `:56-62`. | Both supplied old files and complete default domain equality; preserve chosen native inventory/quest/options facts without treating normal clock advances as corruption. |
| Z3 | Held IDs can survive while card state, messages and acquisition are erased. `:64-85`. | Deep cheat-domain equality, Unicode messages, dormant and awakened records, real distinct origin and stable selected unrelated facts. |
| Z4 | One missing-ID mutation; hero name plus empty held cards does not prove the complete current save stayed intact. `:87-100`. | Malformed semantic state/schema/message/board cases; isolate normal saving and compare the whole protected payload or a complete explicit stable-fact projection. Assert preflight and durable publication were not reached. |
| Z5 | Passing suite and three cheat-named tests say nothing about which critical behaviors those tests cover. `:102-107`. | Name the required contract/failure tests and retain full failing output; keep source tests distinct from browser journey acceptance. |

`check_ch1.sh` should eventually accept caller `REPO`/`URL` and own only the server it starts. That is a tooling proposal, not an audit edit. Its hardcoded original checkout and restore trap are why I invoked components directly.

## Stage 1 recommendation

### Smallest useful slice

**D1, proposal:** one finite milestone quest in the existing status window, offered only after a separate post-awakening progression trigger. Target the next displayed level of a skill the player already knows and can train through a visible native method, such as Running after it is discovered. If no eligible skill is known, show a truthful empty board without naming an undiscovered target. This reuses the existing `reach_skill` vocabulary and needs no unknown recipe, person or route. Show have/need, an ordinary-state “why” line, complete/claimed status, and a keyboard-reachable manual Claim button. Completion logs once; a successful claim adds one point and publishes one truthful receipt. Points buy nothing; claimed rows remain readable. This is one pilot board, not a universal limit on future boards, quests or cheat uses.

**D2, proposal:** defer recipes, refresh/expiry, rerolls, caps, habits, auto-claim, title grants, information rewards, shops and new panels. The suggested S1 two-kind build order is a proposal and can be narrowed. If two kinds are wanted immediately, add a generic “complete N successful native crafting batches after offer” quest using the existing global success count, not the recipe-specific example. A recipe-specific quest needs an additional settled recipe/output observation contract and cannot safely be inferred from current inventory or the global craft count.

**D3, proposal:** a conservative trigger is a level gained in an eligible known skill after awakening, with one further played game day as an idle fallback. Snapshot known skill levels and awakening time durably; evaluate committed current facts, including travel/time jumps, rather than copying the tick-local day test. Do not use an already-held title or the same first kill as a post-awakening stretch. For legacy cards, define when the new baseline is established instead of inventing historical progression. The exact trigger is a director choice, not implemented by this audit.

### Reused owners and boundaries

| Existing owner | Reuse | Do not assume |
| --- | --- | --- |
| `src/cheat_cards.js` | Held card, acquisition, message records; per-card state validator/migration | Current arbitrary JSON state is a point ledger or a typed board. |
| `src/models/skill.js`, native character skill XP; `src/main.js:3930-3932,7698-7717`; `src/titles.js` | Authoritative skill level and counter readings; existing held titles | `total_kills` is reliable, or a second title catalog is needed. No new title grants in this slice. |
| `src/quests.js:185-299` | Compatible `any`/`all` condition vocabulary and clear absolute-vs-delta semantics | Instantiating/registering system quests in the story manager is safe. It auto-processes native rewards and mutates global availability. |
| `src/expansion_persistence.js:7-50`, main `persistExpansion` and `lifeSaveStorage` | Stage a complete validated envelope, write once, publish afterward; a `nativePatch.cheats` can use the existing envelope boundary | Rendering, timers or `save_progress()` establish a successful point claim. Post-write render failure must not undo a durable reward. |
| `src/status_window.js`, panel kit/workspace, display settings, Appearance | Existing panel, rows, known-only settings, keyboard and visual styles | A second panel reveal will happen automatically: workspace knowledge is already sticky. Stage opening needs its own durable record and once-only presentation. |
| `src/save_files.js`, import preflight; `src/life_experience_host.js` | Validate before writes; retain unrelated save domains; explicit heir policy | Board inheritance or system-world support exists merely because the card says `gift` or uses CH1. |

### Proposed save shape inside the held card

No new top-level save field. For the built-in system card, add a versioned typed state, with the existing points field retained. This illustrative shape is a proposal, not the selected schema:

```js
save.cheats.held['system-quests'].card.state = {
  systemSchema: 1,
  awakened: true,
  stage: 1,
  points: 0,
  awakening: { at: /* real calendar */, skillLevels: { Running: 0 } },
  stage1: {
    seed: /* persisted uint32 */,
    openedAt: /* real calendar */,
    board: [{
      id: 'first-known-skill-milestone',
      kind: 'reach-skill',
      skillId: 'Running',
      worldId: 'base.frontier',
      offeredAt: /* real calendar */,
      baseline: 1,
      target: 2,
      rewardPoints: 1,
      completedAt: null,
      claimedAt: null
    }]
  }
};
```

Live progress is derived from the native skill level; it is not a duplicated ticking counter. The baseline is an immutable offer-time anchor needed to prevent retroactive completion. Claim identity plus `claimedAt` makes duplicate clicks/reload/import idempotent. Completion and stage-opening records let restore remain silent. The persisted seed supports stable selection if candidates are introduced; the one fixed milestone itself does not need randomness. Do not consume shared RNG merely while rendering.

The validator must close the interpreted entry shape, constrain stages and integer points/rewards, validate calendars and unique IDs, and check lifecycle consistency. Old C0 `{}` and CH1 `{awakened,points}` states need a specific additive interpretation: stage 0, empty board, existing legitimate points/messages retained, and no invented completion/claim. Preserve generic uninterpreted cards; unsupported typed boards should reject before preflight/storage rather than silently erase. For a message-bearing legacy C0 card, preserve its existing known presentation: stage 0 means informational, not necessarily dormant. A message-free generic legacy card needs an explicit activation policy rather than a silently invented awakening. Legacy awakening baselines and unknown older state keys are compatibility choices to settle before coding.

For this first Village supplier, do not claim world-law discovery, weighted rarity or automatic heir carry. Retain card/board data on unsupported travel and show a known reason for unavailable stage-1 controls. Choose whether native skill progress continues counting there; no silent reset. A future system-world supplier must be ordinary world access plus an exceptional extra where applicable, not blanket relabelling as a cheat.

### Proposed done check

All items are proposals. None changes the existing lane's gates or pass flags.

| Code | Item and measurement | Fixture/journey and evidence |
| --- | --- | --- |
| T1 | No stage 1 at awakening; exactly one later opening when the selected trigger settles. No opening on reload/import. | Natural optional start plus native progression; real-code dormant, newly awakened and just-before-trigger fixtures. Assert persisted baseline, stage and opening time. Include a travel-crossed boundary. |
| T2 | One stable known skill milestone; exact baseline/target and why text. No unknown labels, recipes, people or stages in visible/accessibility/settings channels. | Real native skill-level snapshot with a visible training method; ordinary no-card control; legacy C0/CH1 states. Repeat rendering and restore without a different board/seed. |
| T3 | Ordinary native skill-level advance changes have/need. Work before offer does not satisfy a new target. Completion is recorded/logged once. | Earn a skill level through real training; below/at/above-target controls. Node condition tests complement, but do not substitute for, browser advancement. |
| T4 | Manual claim changes only system points by exactly +1, marks the row claimed and emits one settled receipt. A second click, keyboard activation, reload or import adds zero. | Complete/unclaimed and claimed real-code fixtures; actual click and Enter/Space. Compare character XP, money, inventory, stats, titles, story quests and options immediately before/after claim. |
| T5 | Failed write grants no point, claim marker or success receipt; recovery can claim once. Failure after a successful durable write does not undo or pay twice. | Targeted storage failures at opening/completion/claim; post-durable publication/render fault; read-only second tab and blocked-save controls. Deep-compare saved and live state. |
| T6 | Exact card/board/seed/points/messages through Save, reload, Export and literal-file Import into a distinct origin, at pending, complete and claimed boundaries. Invalid typed boards reject and preserve current life. | Existing old fixtures, legacy held C0, CH1 dormant/awake, and new stage-1 fixtures built through the selected real host and serializer. Retain provenance and exported files. |
| T7 | At 1366×768, 1440×900 and 1920×1080 in both schemes, the useful row and Claim controls fit/reach the reading region without hiding routine actions. Text ≥4.5:1; visible focus/controls ≥3:1. | Full-board screenshots, clipped-region bounds, actual F6/Shift+F6 then row/Claim focus; hide/restore and large text. Verify the stage-opening cue intersects the visible viewport. |
| T8 | Effects off/reduced motion remain readable and usable, with no reward difference; Appearance wins and density changes presentation only. | Same completed fixture across effect/settings variants; actual palette apply, reload/import, point/control comparisons. Human taste remains separate. |
| T9 | No native story reward, title bonus or retroactive chain completion; explicit supported-world and heir behavior preserves existing state. Build and selected regressions pass. | Source join review, 628-suite successor result, C0/CH1 and affected panel/settings/craft/Vivid gates; bounded supported/unsupported supplier and heir-contract cases. Unavailable private/native journeys remain separately unverified. |

### Open questions for Weibao

**Q1. Trigger:** use the proposed known-skill level after awakening with a one-played-day fallback, or a different ordinary milestone? The same first kill/title should not qualify as the later stretch.

**Q2. First board:** start with the recommended single known-skill milestone and one unspendable point, or include a generic native-craft quest immediately? Recipe-specific counts require a larger integration contract.

**Q3. Continuity:** keep the first card/board per life as current succession effectively does, or select an explicit inheritance route now? Neither choice limits future backing-specific carry rules.

## What was not checked, and why

Mobile optimization is deferred by accepted direction. Real browser zoom, a screen-reader session, OS-level screenshots and human taste were not tested; the audit used headless Chrome at exact CSS viewport sizes, computed contrast and visible keyboard-focus screenshots. Compact density was exercised by H4, not a full six-size density matrix. The exact timed natural sleep path was not exercised. The uninterrupted 40-minute run and full six-case scheme matrix use the initial snapshot; the later snapshot got a fresh natural first win, required gates/suite and repeated targeted faults/reveal checks, with unchanged cheat/time/UI source. No claim is made that the long timing run used the later bundle. No private saves, sealed source prose, private content-pack installation, full native heir campaign, broad multiversal travel/standing or every foundation save-blocking route was used. Source review and existing tests are explicitly weaker evidence for those integrations. No stage-1 code or proposed done check was implemented. The primary C0/CH1 and UI-regression gate files were unchanged; wrapper setup was read, and its checks invoked individually on the detached build. Failed travel selectors and the CDP download-copy error remain recorded under `runs/audit/`; corrected successful routes provide the cited evidence. No gates were reopened or closed by this report.

All synthetic saves, scripts, command logs and screenshots are under `runs/audit/`. No personal save or foreground browser session was touched.
