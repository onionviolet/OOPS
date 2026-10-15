# P01 Village mixing feedback

2026-10-14. Implemented on `slice/p01-mixing-feedback`; source commit
`d2366ec0`. No merge or push. No saved field, reward or work-engine change.

## F1: Direction and the earlier stop

The initial stop and four-assertion reproduction at `4fda8929` remain intact;
[PREFLIGHT](PREFLIGHT.md) preserves the original report. Root Claude's later
instruction, conveyed directly in this session within Weibao's P01 go-ahead,
narrowed the work row: when idle, say **Queue finished or stopped**, followed
by the **current reason** from current stock and quote. Never claim that this
was the historical stop cause. The clarification is recorded in
[NEXT_SLICE_P01](../NEXT_SLICE_P01.md); other gates stand.

Desktop/laptop targets: **1366x768 and 1600x1000**. Visible outcome: holds and
cost, current blockers, work timing and last result sit together with Mix at
the top of the existing panel. Mobile and human presentation/balance acceptance
remain deferred. No layout outside this panel changed.

## F2: What changed

`src/mixture_feedback.js` projects plain data from the frame, mixture owner and
existing quote. Vial costs show free stock, needed inputs, stock left or shortage,
shopping cost and purse. Queue totals include any already-held batch exactly
once; future batches are conditional on supply, with only one held at a time.

Mix and Queue have separate blockers. The vessel blocks another queue while
the native immediate Mix remains available when free stock permits it. Known
failures map to player sentences; unknown failures show **Can't mix right now**
and retain the last safe notice. Raw exceptions are not displayed. Requirement
leaves pass through `projectKnownActionRequirements`; undisclosed alternatives
stay hidden. Responsive queue admission is compared with the current quote.

The work card shows minutes left, remaining batches including the current one,
three game minutes per batch, conditional total time and held inputs. After
completion/stop it describes current admission, including changed stock after
replenishment. It does not reconstruct a past stop from a notice.

Last result uses acquisition receipts conservatively. An acquisition at the
current mixture transaction sequence proves that transaction's finished product
and time. Older first-acquisition records do not establish the latest completion.
When that proof or event-level consumption is missing, the field reads unavailable.
Recipe definitions and prose are never substituted for consumption receipts.

`src/mixture_ui.js` joins the four cards beside existing controls. Spacing and
supply rows changed only within the panel; supply routes remain on name tooltips.
Existing IDs, actions and the native durable publication path are retained.
Repeat quantity is a local preview; running work projects its retained remaining
count. Rendering/reopening spends no stock or time.

## V1: Source and build evidence

- [Focused tests](checks/focused.tap): **20 pass, 0 fail** (13 new projection
  checks plus 7 existing native transaction checks).
- [Full npm test](checks/full.tap): **1448 total, 1445 pass, 0 fail, 3 existing
  TODOs**. TODOs are the existing default-RNG ratchets for legacy native combat;
  local-life search/contact; encounter/loot/craft/market/gather.
- `npm run build` passes, including Ink validation. Rebuilt `dist/bundle.js`,
  `dist/bundle.js.map` and `index.html` are included in the evidence commit so
  the branch retains the exact exercised candidate. Nothing was installed.
- [Retained-stop reproduction](checks/retained-stop.json): all four original
  source assertions remain passing; this JSON round-trip is not native import.

The projection checks cover costs, held stock counted once, each blocker family,
invalid selection/count, current repeat-stop semantics, receipt absence, hidden
OR alternatives, current acquisition proof and byte-identical deterministic
inputs. Runtime engines, mixture schema/validator and action-legibility owner
were not changed.

## V2: Rebuilt browser and persistence evidence

[Harness](checks/browser.cjs), [machine proof](evidence/proof.json).
**18 named browser groups pass at each viewport, 36 total**, zero page errors.
Served bundle SHA-256 in both runs:
`542e4037b02628951b96d026d92d038f475c9ffd887d76665ef77b0338f9216e`,
equal to this worktree's rebuilt bytes.

Each viewport uses new isolated browser contexts at `http://127.0.0.1:22470`.
It buys three bellleaf and four water through the counter for 32 real coins,
mixes and drinks one ordinary vial, saves the observed method and queues four.
Two timed vials complete under the ordinary played clock, then the next
reservation finds no bellleaf. The work card names the **current** missing
bellleaf. Actual stock agrees: zero bellleaf and one water remain. Buying more
inputs changes the current reason to ready; a new queue starts successfully.

Cancellation occurs after played minutes elapse within the first batch and
returns exactly the held inputs. A forced selection change without an input
event exercises stale-quote refusal before any debit. A separate forced storage
failure exercises generic safe wording, retained safe notice and zero payment.
These are labelled fault controls, not natural recipe failures. Four reopenings
preserve stock, mixture owner, purse and native calendar exactly.

The harness freezes only the external HackTimer worker for snapshot comparisons;
it reloads and lets the real worker run for timed completion and mid-job cancel.
It does not inject currency, stock, clock or mixture state. Fixed wall time avoids
an unrelated export reward. No normal save/profile is opened.

At both pending and completed states, native Save, reload, Export and literal-file
Import into another fresh context preserve stock, job and **all four card texts**
exactly. Export matches the full saved envelope and literal Import initially
writes its exact bytes. The native reload comparison is scoped to mixture owner,
stock, purse and calendar, not unrelated host normalization.

| Evidence | 1366x768 | 1600x1000 |
|---|---|---|
| Pending work, all cards and Mix visible | [Laptop](evidence/pending-1366.png) | [Desktop](evidence/pending-1600.png) |
| Completed/stopped, current blocker | [Laptop](evidence/completed-1366.png) | [Desktop](evidence/completed-1600.png) |
| Pending persistence | [Exact comparisons](evidence/pending-persistence-1366.json) | [Exact comparisons](evidence/pending-persistence-1600.json) |
| Completed persistence | [Exact comparisons](evidence/completed-persistence-1366.json) | [Exact comparisons](evidence/completed-persistence-1600.json) |
| Pending literal Import | [Laptop](evidence/import-pending-1366.png) | [Desktop](evidence/import-pending-1600.png) |
| Completed literal Import | [Laptop](evidence/import-completed-1366.png) | [Desktop](evidence/import-completed-1600.png) |

Geometry assertions verify the entire four cards and Mix are inside the visible
panel with its scroll position at zero. Visual inspection confirms readable
laptop text. Product history may scroll in the existing panel.

## Later proposal and remaining boundaries

**L1, LATER optional-revision proposal, not built or accepted:** the missing
historical fact is the actual failed next admission of a stopped repeat, including
its product/method, game minute, remaining goal, structured reason and, for a
shortage, input ID, needed/available/missing amounts at that boundary. The
`stageMixtureAction` **advance** writer would set it when next reservation fails,
before clearing its local job context, and `commitMixturePlan` would publish it
atomically through an explicitly supported optional receipt revision. An absent
record means **unknown**, never inferred from later stock. This needs a separate
compatibility decision; no new field or validator admission was added here.

**U1, IMPLEMENTED_UNVERIFIED native variant:** the responsive-law-change blocker
is source-covered; this P01 browser journey uses the ordinary learned method.
Hidden prerequisite disclosure and invalid-selector families are source-tested,
not a claim of additional native content. No required P01 technical gate remains
open under the coordinator clarification. Weibao's feel/taste judgment and root
integration review remain separate. No mobile or closed-browser progress claim.
