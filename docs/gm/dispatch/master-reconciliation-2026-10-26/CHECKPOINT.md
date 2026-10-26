```receipt
build: cbf3a4ebe392796afba70a847b7dd760b73690c8005015dcbb599744d69b59e2
route: fixture(combined integration)
state: browser-verified
viewport: 1920x1080 and 1536x864 desktop; mobile deferred
persistence: checked
tests: npm test 3486/3486; architecture/rules pass; Python tools 19/19; workbench 2/2
review: diff-scoped
surface: accumulated released source plus LOTM entry merge; no architecture baseline increase
```

Later release authority: Weibao subsequently selected “push master and update
the normal app accordingly”. [Publication/adoption](APP_ADOPTION.md) now records
that completed release. The local-only boundaries below describe the original
integration step and are superseded for this release.

# Master reconciliation, 2026-10-26

User request: "reconcile everything into master". This authorizes local integration
and commits, not push or installed-app replacement. Rules: AD32, AD36, AD41–AD43;
AR1–AR16; UR1–UR75; shared-worktree practice. No new mechanic/backlog completion
is implied. The desktop target is 1920x1080, with 1536x864 and 14/21px checks;
mobile remains deferred.

An isolated candidate protects the primary shared checkout. Initial primary HEAD:
`712eaf7d7247bdc1369fa02f35b1a4df3335c994`. Exact initial tracked/untracked
content is backed up at `/Users/weiwei/.local/share/codex-recovery/oops-reconcile-20261026/working-content.tar`;
its `input-manifest.json` identifies hashes and dispositions. Source, tests,
tooling, prose and textual evidence are integrated; private/generated saves,
profiles, bulk captures and preview bundle copies remain local and backed up.
No original local artifact is deleted.

## Branch and worktree disposition

- LOTM entrance branch includes M2; merge preserves ordinary Village notice,
  contextual enrollment reasons/costs and primary's later planOpen disclosure.
  Generated outputs are rebuilt from joined source.
- Q1/Q2/Q7 commits join ancestry. Primary's later adopted implementations retain
  safe in-root preview assets, fixed receipt inventory/closed-fence validation,
  and cached/import-safe generator diagnostics. Earlier lane variants do not
  replace those fixes. One duplicate package script from Q7 auto-merge removed.
- Q3/Q6/Q8 dirty tooling was already adopted and refined in primary; original
  lanes remain recovery sources. Q10/Q11/Q12/Q15 have no unique branch commits.
- All remaining local branch tips were already ancestors of master at intake.
  `git fetch origin` succeeded; origin/master matched intake. The sole origin
  ref outside the candidate is `origin/ghpages`, a deployment-output history,
  retained without merging generated site output into source master. Upstream
  refresh is a separate task and is not selected here.
  Existing worktrees/branches and unresolved reservations remain untouched.

## Verification

Final runtime identity: bundle SHA-256
`cbf3a4ebe392796afba70a847b7dd760b73690c8005015dcbb599744d69b59e2`.
Agent-verified, not human-reviewed. Default build and all completed combined
browser results below match this hash. Private fonts are linked from primary for
local verification; no private pack/player profile is loaded. Tests use generated
fixtures. Mobile, installed-app adoption and publication are outside this task.

| Command / check | Result | Limits |
|---|---|---|
| `npm run build` | PASS, final hash above | Rebuilt after merges and package-script deduplication; no warning from duplicate script remains |
| `npm test` | PASS 3,486/3,486, zero skipped, 71.46 s | Initial run failed 11 tests because integration filtering omitted two generated QA fixtures. Restored the authored command golden and earned QA save after provenance review, 16/16 focused pass, then full final suite passes. No player save used |
| `npm run check:arch` | PASS | main10084/10115, display6730/6767, save310/310; 6 grandfathered main imports/205 cycle edges, no baseline increase |
| `npm run check:rules` | PASS | 25 register rows,43 AD codes,144 links; zero warnings;14 receipts checked/317 named legacy paths skipped |
| `python3 -m unittest discover -s scripts/lanes/tests` | PASS 10/10 | Changed launcher/inventory tooling |
| `python3 -m unittest discover -s scripts/toolsets/tests` | PASS 9/9 | Changed tool launcher |
| `node --test prototypes/workbench/freshness.test.mjs` | PASS 2/2 | Source/output drift and archived/missing manifest claims; no claim that sketches are native gameplay |
| `node scripts/playtest/broader-ui.mjs <candidate> <out> final` | PASS | Six combinations:1920×1080,1800×1040,1536×864 at14/21px. Inventory/find/inspect/equip/return, recipe/craft/refusal, Journal/Skills filters, Reports history, keyboard focus and viewport. First run passed functional assertions but lacked ignored fonts; local font link repairs the environment, final run has zero errors |
| `node scripts/playtest/reconcile-master.mjs <candidate> <out>` | PASS | Fresh ordinary Village notice, no probe, visible one-way/purse costs, enrollment, exact LOTM slice/location through native Save/reload/Export/literal Import, four desktop/font combinations. Early driver attempts used the wrong Notebook route and too-short load timeout, corrected to the native LOTM menu and60s startup allowance |
| `node scripts/playtest/gu-life.mjs <candidate> <out>` | PASS | Earned Gu care/use,10 checks/four desktop-font combinations, literal persistence, no page errors |
| `node scripts/playtest/shadow-company-life.mjs <candidate> <out>` | PASS | Independent companion sleep/growth, player work, actual preparation/party/return/injury/reward;12 checks/four desktop-font combinations, literal persistence, no page errors |
| `node scripts/playtest/mol-learning-application.mjs <candidate> <out>` | PASS | Named generated R15 G4 fixture; actual household consumer, cancellation, pending/completed round-trips, no replay and no page errors |

Supplemental weather check: unmodified W6 `native-settled-proof.mjs`, copied to
an isolated evidence root with `W6_SNAPSHOT` pointing to this same rebuilt
candidate, PASS. The named generated W4 staves plus25-credit funding fixture
reaches paid apparatus/forecast/contained field/grounding/kit/commission and
coppice/water joins, twelve literal persistence checkpoints and four desktop/font
combinations. `evidence/weather-result.json` records exact results. No canonical
franchise weather law or wider deferred coverage is inferred from this original
field slice.

Supplemental HP check: copied I5 `native-journey.mjs`, pinned to the current
bundle hash with an explicit empty private-pack QA manifest, PASS. It records
15 assertions and 8 desktop/font combinations, native quantities and
stale-selection/capacity/rollback checks, ingredient preparation/substitution,
actual produced-dose consumers and pending/partial literal persistence. The
first run passed the functional route but failed its final HTTP assertion on
an absent optional manifest; the final complete rerun has zero HTTP/page errors.
The original frozen lane harness is unchanged; the adapted run is archived
privately with the combined proof. `evidence/hp-result.json` retains the result.

The Gu/company persistence harnesses now treat absent and explicit zero NPC XP
as equivalent because ordinary LOTM registration makes the existing loader
materialize those defaults. Player XP, every nonzero NPC XP entry, inventory,
clocks, actors, jobs and native vital offsets remain exact. No gameplay/save
format was changed to satisfy that comparison.

`evidence/` retains compact combined results and two inspected desktop captures.
Raw generated saves, full test logs and supplemental harness runs are archived in
`/Users/weiwei/.local/share/codex-recovery/oops-reconcile-20261026/combined-proof.tar.gz`
(with live scratch copies under `/tmp/oops-reconcile-20261026/`); the original working-content backup is durable
at the recovery path above. `INPUT_DISPOSITION.json` lists every initial changed
or untracked path, exact hash, integration/local-artifact decision, and the two
explicit generated-QA-fixture exceptions. Preserved artifacts remain in primary.

Earlier lane receipts retain their own scope, route and hash. L4 A5 and other
deferred or evidence-blocked details remain in their owners; this integration
does not promote them to completed gameplay. The original L4 request has4/5
primary proposals verified and A5 pending; world breadth and later source gaps
remain unchanged. Existing locks are retained, including stale/unknown slot
metadata; no owner transfer, new worker or chat message is inferred.

## Current-summary and loss checks

USER_VISION records this exact request; PROJECT routes to this receipt. Two
superseded PROJECT summaries are preserved verbatim in
`HISTORICAL_DELIVERY_SUMMARIES.md`. Compared with the preserved intake snapshot,
USER_VISION and IDEA_INDEX lose zero nonempty lines; PROJECT has13 nonempty
lines absent from current prose, all retained verbatim in history. Non-generated
integration whitespace check passes. Earlier dirty source/doc edits are retained
as supplied, rather than silently restoring superseded HEAD text.

## Landing

All local branch tips are covered by the joined ancestry. The final primary
landing uses an expected-old-HEAD guard, rechecks original file hashes and an
unchanged shared index, copies only candidate paths that differ, and updates the
index to the same tree. Existing unselected/private/bulk artifacts and original
worktrees remain available. That integration step performed no push or normal-app replacement; the later
[authorized release](APP_ADOPTION.md) publishes and adopts this verified runtime.

