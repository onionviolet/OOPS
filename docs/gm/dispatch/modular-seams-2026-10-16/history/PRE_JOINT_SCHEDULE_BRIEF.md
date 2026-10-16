# Modular seams run, 2026-10-16

You are the single Codex writer for this lane. Weibao asked: "make a codex run
to fix accordingly and create rules accordingly". The rules exist; your job is
the fix.

## Current plan and authorization, updated 2026-10-16

Weibao asked to update this plan for cross-domain interactions and future engine
requirements before continuing. This edit saves the continuation instructions;
it does not launch or resume the run. M1/M2 have reported passing evidence; M3
is STOPPED, implemented-unverified, and M4 has not started. Read the current
checkpoint and M3 report before acting. The original dispatch is retained at
[history/PRE_INTERACTION_UPDATE_BRIEF.md](history/PRE_INTERACTION_UPDATE_BRIEF.md).

Apply AR1–AR16, AD5–AD9, AD13–AD22, AD32–AD36, relevant MR and SR rules,
and UR41–UR48 for touched UI. Plan codes MP1–MP11 below identify the additions.
A plan requirement is not a claim of implemented capability or acceptance of
all proposed mechanics. No universal engine, full physics, ECS/framework
migration or general rule language is selected.

**MP1, authority and input recovery.** The canonical executable plan is this
brief; the lane checkpoint owns execution evidence. Current design context lives
in the shared checkout until integrated: read the owning files there if absent
or older on this branch. Shared root is
`/Users/weiwei/code/yet-another-idle-rpg`. Read-only access to those docs is
intended; do not copy shared uncommitted runtime sources or private packs.
Record the path/hash actually read. Missing authority docs are a preflight gap
to repair through their owner before gameplay work, not grounds to infer rules.

## Where you work

- Worktree: `/Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg`
- Branch: `codex/modular-seams`, cut from `codex/gameplay-foundations`.
- Work only in this worktree. Do not edit, stage, stash or reset anything in the
  shared checkout `/Users/weiwei/code/yet-another-idle-rpg`. It holds other
  sessions' uncommitted work (including continuation source in `main.js`,
  `display.js`, `save_files.js` and untracked `src/continuation_*.js`). That
  work is not on your base; do not copy it in. Note in the checkpoint which of
  your changes will need reconciling with it at merge time.
- Commit on your branch at the end of each round. Never add a `Co-Authored-By`
  trailer. Do not push. Do not merge into `codex/gameplay-foundations`; the
  merge back is Weibao's or the coordinator's call.
- At the start of each round, `git merge codex/gameplay-foundations` into your
  branch so you track the hot files. Resolve conflicts preserving their behavior.
- `node_modules` is a symlink to the shared checkout's; do not run `npm install`
  there. Use your own port for any preview server (19460–19469), never 8123,
  and stop servers by PID or port, never `pkill -f`.

## Read first

1. `docs/RULES_INDEX.md`, `AGENTS.md` and the current `PROJECT.md` summary.
2. `docs/ARCHITECTURE_RULES.md`; for a gameplay round also the relevant UI,
   making, ability or site/exploration owner. Read touched rules, not all palettes.
3. This checkpoint's M3 stop, `M3_REPORT.md`, `evidence/M3_STOP.json`, and the
   retained `scripts/modular_crafting_browser.cjs` in the lane.
4. Shared `docs/reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md`
   (MA1–MA7), `docs/ENGINE_EXPANSION.md` (EI1–EI22) and
   `docs/PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md` (PF24–PF57).
5. `docs/research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md` owns proposed kernel
   signatures. Use applicable manifest/transaction/cycle-cut sections; C/N
   proposals in other reviews are constraints when demonstrated, not a bundle
   of required services.

Sealed secrets rules apply. Keep user saves untouched. Dev diagnostics use
synthetic fixtures; player-facing inspection and shared receipts remain
observer-safe. Record exact command/source/bundle/content/fixture identities.

## Rounds

The original M1/M2 sections below are retained specifications, not instructions
to redo passing work. Reuse their evidence only for unchanged relevant inputs.
On an explicitly resumed run, follow recovery, conditional M2.5, M3, then a
separately recorded M4. Each runtime round ends at its existing gate or a stop.
The original two-failure stop remains: prior M3 failures are retained and cannot
be cleared merely by relaunching. A new bounded attempt needs the diagnosed
cause, changed input and meaningful regression recorded first. Do not use a new
label or scenario to evade the stop. Commit authority in the original lane
applies to resumed runtime rounds, not this documentation update.

### M1. Break the display/main cycle and add the architecture check (structural only)

- Move the helpers `display.js` imports from `main.js` (`translate` and the rest
  of that import list) into a leaf module, and update importers. Then look for
  any other module that imports `main.js`; move those helpers too where it is
  mechanical. Anything not mechanical goes on the baseline.
- Add `scripts/check_architecture.mjs` and an npm script `check:arch`. It builds
  the static relative-import graph of `src`, fails on any import cycle or any
  import of `src/main.js` not in `scripts/architecture_baseline.json`, and
  prints line counts of `main.js`, `display.js` and `save_files.js` against the
  baseline (report growth; do not fail on it yet). The baseline must only shrink.
- No gameplay change (AR9). Gate: `npm run build`, `npm test`, `npm run check:arch`,
  and a Playwright scenario on the rebuilt bundle from a fresh origin at
  1366×768: new game, a few actions, Save, reload, Export, literal Import, no
  console errors. Run the same scenario on the pre-change build and compare the
  resulting save JSON (ignore timestamps). Keep the scenario script; M2 reuses it.

### M2. Domain registry with two existing domains migrated (structural only)

- Add `src/domain_registry.js` per AR2–AR4 and AR6: `registerDomain({id, deps,
  initialState, save, validate, migrate, load, tick, commands, projection,
  panels})`, every part optional. `main.js` and `save_files.js` iterate the
  registry for create_save, load, envelope validation and ticks, keeping the
  existing validation order. Panels keep registering through `definePanel`.
  Inject narrow operations; no omnibus context; no new timer or save writer.
- Migrate two existing domains with different shapes. Harvest is the suggested
  first (it has `validateHarvestEnvelope` in `save_files.js` and `tickHarvest`
  in `main.js`). Pick a second with a different lifecycle, for example one with
  a panel or commands. Move their wiring out of `main.js`/`save_files.js` into
  registrations. Save keys and JSON shape stay byte-compatible.
- Gate: everything from M1, plus the before/after save comparison on a save that
  exercises both migrated domains, plus loading an old save without those keys
  (old-save compatibility). Report how many lines left `main.js` and `save_files.js`.

### Recovery before M3 (MP2): diagnose readiness without spending

Recover branch/HEAD/dirty paths, exact writer/session/PIDs and reservations.
The original recorded PID/PGID can be stale or reused; verify identity before
any process action. Record the current merge base and reconcile the current
foundations branch under the original round-start rule, preserving unrelated
work. A branch merge does not include another checkout's dirty source or docs.
No automatic merge back or push follows.

Rebuild the final stopped source; its last bundle predates the styling fix.
Trace the retained browser's paused fresh-load setup through save authority,
readiness, panel opening and refresh. Capture a read-only diagnostic that
separates native writer/restore status, game pause, command eligibility and
stale view state. Prove the specific cause with a synthetic fixture before a
new harvest attempt. Never force eligibility true, bypass the writer or treat
a directly injected successful product as the changed native journey.

### M2.5, conditional hardening only (MP3)

Trace only seams needed by M3 or a reproduced load/command failure. Prior risks
include sequential domain load after partial mutation, first-accepting item
handlers, missing native transaction/item-use ports and startup/open refresh.
Validate whether the actual caller already protects each boundary. Fix a
reproduced necessary gap through the existing owner; otherwise record it as
not triggered or deferred. Do not require all C1–C8/N1–N8 or EI services first.

Keep this structural/correctness round separate from new gameplay. Narrow
ports, existing publisher and clocks remain authoritative. Preserve validation
and settlement order, dormant slices, legacy item keys and old-save absence.
Gate: relevant existing regressions plus a meaningful failure regression for
changed behavior, build/full tests/architecture gate and affected rebuilt
before/after route with relevant Save/reload/Export/literal Import. If a new
migration is needed, make its compatibility decision explicit. If no change is
needed, skip M2.5 with the trace recorded; do not create a ceremonial round.

### M3. Crafting as the first new consumer (gameplay)

- Close the crafting engine's GR12 open gate through the registry, not through
  new hand-wiring in `main.js`: a `crafting` save slice (create/load/validate),
  product key resolution for native items, a carrier item template, effect on
  use saved and restored, one harvest action at one Village location keyed by
  the game clock, and one UI home that follows UI_RULES (declare the surface
  type, tokens, own node, shared center controller with bottom back bar and Esc).
  Follow MAKING_RULES for knowledge versus truth. Reuse `craft_resolver.js`,
  `craft_state.js`, `craft_product_registry.js` and `crafting_detail.js`.
- AR1 check: count lines this round added to `main.js`, `display.js` and
  `save_files.js`. Target at most one registration line each; explain any excess.
- Gate: build, test, `check:arch`, and a Playwright journey on the rebuilt bundle
  from a fresh origin at 1366×768: harvest → stored material → craft → useful
  output used → Save → reload → Export → literal Import, with state intact;
  plus an old save with no `crafting` key loading untouched. Save screenshots
  of the UI home in `evidence/` of this dispatch folder (in your worktree).

### M4, planned after M3: one cause crossing pursuits (MP4)

Replace the old optional second-resource-only pilot with a stronger reuse test.
Default candidate is a bounded light/reading/exploration chain (PF52): a real
lamp or supported light faculty changes an authored reading condition; observed
evidence then guides an actual available route or site action. First trace
available means and consumers. If that candidate would require a new power/world
or disproportionate mechanics, choose an existing obstruction/access interaction
(PF53) and record the concrete reason. Do not ask for taste choices already
settled by world/means direction, or fabricate capability to fit the example.

**MP5, selected seam.** Name the target adapter, state owner, actual method,
world/instance identity, physical or conceptual rule, downstream readers,
quote/commit path, projection and save fields. Borrow EI2–EI10 only as touched.
A non-person object must not masquerade as a simulation person. Begin with
an authored condition/relation, not continuous geometry or general physics.
A static definition need not become a lifecycle domain.

**MP6, conformance and scope.** Use one cause in an everyday action and an
exploration consumer, with a materially different means as comparison. A
physical lamp and a supernatural faculty need not share cost or targeting law;
no new faculty is required merely to provide the control. Protect old person
commands and native item use. Physical traits, knowledge and conceptual/authority
relations remain distinct; a matching tag does not grant a transformation.
No automatic anti-synergy limits, balancing weakness or universal energy fee.

Surface outcome: desktop 1366×768 populated synthetic save, ordinary use direct,
alternate application discoverable, result visible only through fitting means,
log intact and an explicit return/Back/Esc where applicable. Mobile, wholesale
redesign, NPC-heavy work, generated layouts and further product families deferred.
Record this in the M4 task report before implementation.

Gate: choose existing relevant checks and one failure scenario before editing;
run required build, full tests, architecture check and rebuilt native journey.
Exercise both useful consumers, actual costs/custody and Save/reload/Export/
literal Import; old save without the new slice loads without invented history.
Include failed-write conservation, stale/wrong-target refusal and an applicable
unknown-knowledge or support-loss case, reusing covered checks rather than
repeating subsets. Record tested identities and gaps. A model/headless test
cannot substitute for native gameplay or human visual/play acceptance.

**MP7, measure whether this improves the engine.** Report bespoke core edits,
new adapters, duplicated eligibility, setup/debug time and observed behavior
against the retained baseline. A clean registry registration alone proves less
than this cross-domain handoff. If reuse requires more special core wiring,
revise the narrow seam instead of adding more feature menus or declaring success.
End at this playable checkpoint; no automatic next wave.

### UI engine support for the touched slice (MP11)

Read shared ENGINE_EXPANSION UIE1–UIE12 and the applicable UI/mockup owners.
These are seam constraints for touched views, not authorization for a separate
visual rewrite or another global navigation/refresh framework. M3 keeps its
existing completion gate: use UIE1/UIE3 to diagnose its actual readiness/open
refresh problem, and repair only a demonstrated necessary gap before retrying.

For M4 or any separately selected UI change, declare the public projection and
quote/receipt path, local view-state owner, semantic subject IDs, mount/dispose
and navigation owners. Reuse panel kit, workspace/center controllers and existing
simulation render batching. Do not add a UI clock or duplicate gameplay rules.
Keep critical actions explicit; observer-safe previews and pinned inspection
must not leak knowledge through labels, sorting, history or cache scope.

Selected checks, not a mandatory new all-UI suite: opening after valid restoration
while paused; same subject/focus/query through refresh and Back; accurate blocked
or committed feedback without duplicate clicks/settlement; cleanup on reopening;
known history distinguished from current subject state. Choose relevant existing
center/workspace/UI-contract tests and a failure regression for changed behavior.
Run the retained required native gate at 1366×768 with populated synthetic data,
log/navigation intact, plus real 125/150% text checks when claiming changed layout
or disclosure. Prototype studies use MW workflow and same-state comparisons;
they do not prove native persistence or human visual acceptance.

Larger UI-engine work is later: stable semantic view restoration (balanced,
medium, done when reorder/removal/Back preserve meaningful selection and focus);
public-source workbench adapter (balanced, medium, done when a second distinct
study needs no host special case). Escalate save-authority/navigation lifecycle
changes for strong review. Do not let either become a prerequisite for M3 unless
its diagnosed cause actually requires it. No new chat is launched by this plan.

### Future backlog after the cross-domain proof (MP8–MP10)

These preserve future requirements and do not enter M3/M4's completion gate.
Each future selected unit names its consumer, executor level, cost and done check.

| Code | Opportunity / trigger | Level, effort and observable done check |
| --- | --- | --- |
| MP8 | Scoped target/body/world identities, retained definition revisions and explicit absence policies when the selected crossing/body/content lifecycle needs them | Strong review / medium per selected path. No wrong-instance targeting, accidental carry, orphaned commitment or rerolled retained truth after reload/content removal. Extend existing identity/continuation owners; no second journey store. |
| MP9 | Pure preview/explanation and explicit dependency invalidation when measured polling/context work dominates or stale quotes recur | Balanced implementation, strong transaction review / medium. Same known result at quote/execute boundaries, truthful source attribution, no sealed leaks, measured lower end-to-end cost on the same fixture. No whole-game reactive rewrite. |
| MP10 | Batch advancement, replay, content admission/overlays, author conformance and rule-changing hooks when real consumers expose a gap | Strong on ordering/migrations, balanced on tooling / medium per selected unit. Preserve segmented/batched results and stop remainder, exact content identity, failure atomicity and local law. Add services individually; no universal DSL/ECS/plugin runtime without its own demonstrated need. |

## Record keeping

- Keep `docs/gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md` in your worktree
  current after each round: status, commit, gate evidence, lines moved, baseline
  counts, reconciliation notes and open items. Put round reports beside it as
  `M1_REPORT.md` etc.
- Label anything not exercised in a rebuilt browser as implemented-unverified.
- Before a resumed run, make the task's rule/design docs available through their
  actual canonical paths and record hashes. Keep this brief aligned in both
  dispatch copies; update evidence in the lane first. Shared checkpoint summaries
  derive from it, not a second account of runtime truth.
- Every changed seam records one ordinary path, one changed-context/failure path
  and its actual consumers. Choose meaningful tests (AD36), not one per rule.
- A plan update, a verified source slice, a rebuilt native journey and human
  acceptance are separate states. No claim of superiority over other engines
  follows from the roadmap; compare the same task and measure real outcomes.
- If you find a rule in `docs/ARCHITECTURE_RULES.md` that is wrong or
  unworkable, do not silently ignore it: note it under "Rule feedback" in the
  checkpoint with evidence.

## Out of scope

Migrating every domain, merging the old unmerged branches, UI redesign beyond
the M3 crafting home, mobile layouts, TypeScript/framework changes, NPC-heavy
work, and editing `docs/USER_VISION.md` or `PROJECT.md`.

## Final message

End with: rounds completed, commits, gate results with commands run, lines moved
out of the core files, AR1 line counts for M3, what is unverified, merge
reconciliation notes, and rule feedback.
