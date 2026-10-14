# p23-reveal-chain, 2026-10-14

Status: **implemented and technically verified as a reversible proposal**.
All eight assigned adapt-next rows are adopted in `51827c04e82083b9374de0cc6cff7e45a6b952eb` on
`absorb-all/p23-reveal-chain`. No push or merge. Original ledger unchanged.
Evidence/documentation commit: `1cf32c0f`. Director taste is unaccepted.
Source is independently reimplemented; no Proto23
code or assets copied. Upstream attribution and LICENSE remain intact.

## Scope and result

A1: Experience now reveals capability and the interface together. Native skill
names/categories appear at their first actual level threshold. Twenty-six skills
that lacked milestones have a modest explicitly authored level-1 stat reward,
using the existing announcement/stat engine. Native XP curves, caps and maximum
levels are unchanged. Running level 1 grants a Run toggle; Perception level 1
grants Investigate, which uses existing Local life search. Known actions stay
listed with a current reason when unavailable.

A2: Twenty **currently held** Golmoon leaves teach the existing Weak healing
powder preparation once. Knowledge and native recipe availability persist;
Learned preparations is a separate earned panel. The recipe remains repeatable.
Partial book study keeps raw work; literacy increases reading rate 5% per level,
capped at 50%, and displayed remaining time follows that rate. Completing ABC for
kids or Old combat manual reveals a Reading reference panel with a route into the
existing Journal/Bestiary. Essential logs and recovery are available throughout.

A3: An unfamiliar world's purse shows an exact raw coin count until a real money
settlement teaches its denominations. Knowledge is retained per world, independent
of physical inventory. The familiar frontier purse keeps its old presentation.
The optional four-step Staged opening setting defaults **off**. Its browser
progress persists; it changes presentation, not the original beginning or hero
creation. Existing first-fight Combat discovery from `d49cb911` is retained.

Target viewport: **1366x768 desktop/laptop**. Panels use the existing Workspace
registry and reveal settings. Classic also hides undiscovered modules. Mobile
optimization remains deferred. Live owners were read and standing direction is
unchanged; PROJECT.md records proposal status, not a taste acceptance.

## Row dispositions

Rows are one-based positions in the original 95-row ledger. Source/heading/full
mechanism and commits are preserved in the adjacent JSON.

| Row | Source item | Decision and landing |
| --- | --- | --- |
| 19 | R2 Skill engine | Adopted: models/skill.js first-level gate, existing native discovery/category filtering, data/skills.js 26 authored first-level perks. |
| 22 | R2 Item engine threshold teaching | Adopted: reveal_chain.js, acquisition host, existing recipe ID and durable unlock transaction. |
| 25 | R2 Books and manuals | Adopted: items.js work rate and exact restore, main.js book-completion reference panel, Stop/reload preservation. |
| 47 | R4 Run/Investigate actions | Adopted: practiced action panel and native Run travel consumer; existing Local life Investigate consumer. |
| 69 | R5 Startup staged reveal | Existing first-fight gate adopted in d49cb911; optional staged introduction additionally adopted in 51827c04, default off. |
| 75 | UI F1 real-event panel discovery | Existing Combat discovery retained; additional skill, method, herb-preparation and book-reference gates in this commit. |
| 83 | Mechanisms F4 experience/capability/UI chain | Adopted: practice-level grants and held-stack lesson, with current blocked reasons and independently revealed panels. |
| 85 | Mechanisms F4 wallet and book view | Adopted: per-world coin-handling knowledge and book-completion Reading reference. |

Rows 47/83 straddle life mechanics: this lane owns only the practice grant/UI and
Run consumer. It delegates search to Local life's current transactional owner;
`src/absorb_c2/local_life.js` and `panel.js` were not edited. Row 75 retains
already-landed presentation rather than repeating the Vivid/coin/item work.

## Checks and evidence

V1: `npm run build` **passes** on final source. Tested SHA256 for rebuilt
`dist/bundle.js`: `5815e5e74707938410ed6361b08e9fac3f2c06b7b6427ff3650d8832e49e8c2c`.
Final served HTTP bundle SHA256 also matched the rebuilt hash. Both commits pass
`git show --check`; generated minified output is excluded from source whitespace
checking. The source-map/build artifacts and generated index cache version are left
**uncommitted**, available for serving this worktree only.

V2: Focused command, **18/18 pass**:
`node --test tests/reveal_chain.test.js tests/native_discovery_policy.test.js tests/native_retained_method.test.js tests/save_compatibility.test.js tests/save_files.test.js`.
`npm test -- --test-timeout=60000` completed with **626/626 pass, zero failures**
on the earlier iteration. Final source's same complete test glob was rerun with
bounded concurrency:
`node --test --test-timeout=120000 --test-concurrency=2 tests/*.test.js`:
**626 tests, 626 pass, 0 fail, 0 cancelled, 0 skipped**, 206735.308041 ms.
No pre-existing test failures were observed. Two other unbounded/high-concurrency
attempts stalled while browser fixtures competed on this shared machine and were
stopped; they are not counted as passing suites.

V3: Final rebuilt fresh-origin Playwright run on **18705**, **9/9 groups pass**,
no JavaScript page errors. Chrome is headless, using the specified Playwright
runtime and installed Chrome executable, with disposable isolated contexts.
Controlled prerequisites use the existing test-save schema, not user saves.
Natural counters/awards are then executed by native handlers; these checks do
not claim a full natural acquisition campaign for every prerequisite.

| Browser group | Observed result |
| --- | --- |
| Default opening and first fight | Original fresh opening intact; undiscovered Skills/method/reference picker labels absent; real fight discovers Combat. |
| Optional staged opening | Time, vitals, belongings/actions reveal through three Continue controls; Save/reports stay reachable; completion survives reload. |
| Unfamiliar wallet | Actual authored-site Apply/Visit/job path shows 102 unfamiliar coins; completion pays coin, records knowledge durably and reveals denominations. |
| Real Running level and actions | Existing Running practice crosses level 1; Run appears, shows a busy reason while training; idle Run/Investigate toggles work. |
| Run travel comparison | Village-to-Shack takes 10 minutes off versus 8 on; on spends 1.9723865877712043 actual stamina after native efficiency from a nominal cost of 2. |
| Herb acquisition | Actual chest transfer 19→20 leaves teaches recipe and saves the fact/availability before publication. A second leaf does not replay the lesson. |
| New Alchemy perk | Actual native craft crosses Alchemy level 1 and visibly raises Intuition by exactly 1; existing discovery cue and milestone receipt appear. |
| Reading | Literacy-1 study advances faster, Stop retains partial work; reload retains identical raw book progress and literacy XP; completion reveals reference. |
| Native persistence | Four families (Run, herb/recipe, finished reading, unfamiliar wallet) Save/reload, Export, literal-file Import through file input and Save match their earned facts. |

Evidence lives in the worktree at
`docs/gm/dispatch/absorb-all-2026-10-14/checks/reveal-verification.json`,
`reveal-browser-results.json`, `reveal-browser.cjs` and the two 1366x768 PNGs.
The real-perk screenshot was visually inspected: readable independent desktop
panels, visible +1 Intuition and the native Alchemy cue/receipt.

## Save compatibility and limits

D1: New facts are optional in the existing actor-facts owner. Absence means Run
is off and new herb/world-denomination knowledge is unlearned. Existing book work
and XP are not rescaled; load bypasses study acceleration. Literacy XP tracks
completed study work, preserving native validation. Learned recipes use a stable
availability ID. Native acquisition/trade/chest settlement stages knowledge in
its durable transaction, while legacy acquisitions use their existing live/native
save route. The saved validation/schema contract remains unchanged; unsupported
schemas still reject. The introduction is browser presentation state.

D2: Newly authored level-1 perks are derived from already earned levels on old
saves, through the existing milestone engine. This intentionally adds the proposal's
modest stat rewards to those characters, without changing XP, consuming items or
replaying acquisitions. Each perk is a native definition; the Alchemy award path
is native-exercised. We did not individually play all 26 skills' acquisition routes.

Implemented-unverified **new mechanism groups: none**. Coverage limits: other
worlds' distinct native economies, every one of the 26 natural skill routes and
mobile layouts were not separately played. Existing unrelated Foundation/world
acceptance backlogs remain open and are not closed by this lane.

## Merge risks and remaining gate

R1: `main.js` and `display.js` overlap p23-ui-polish, p23-life-loops, upstream-dev,
fork-resurvey/fork-fort and potentially air-workshop. Preserve this lane's narrow
imports, transaction hook, raw-book restore and panel registrations alongside
newer owners; do not replace whole files. `items.js`/`crafting_recipes.js` may also
overlap upstream/UI changes. Reconcile any upstream recipe-ID repair with the
explicit Weak healing powder ID. `data/skills.js`, models/skill.js and hero.js
require semantic review if upstream changes their XP/acquisition owners.

R2: Life-loop changes to Local life's found/search availability must be reconciled
with Investigate's blocked reason. This lane adds no second search scheduler.
Workspace/picker changes need both lane discoveries retained. Rebuild the
integration worktree after merging; do not reuse this lane's dist bytes.

Only remaining acceptance gate for this lane: **Weibao's play/taste**. Mechanics,
numbers, labels and pacing are proposals. No product acceptance, publication,
push, user-save change or merge into gameplay-foundations is claimed.
