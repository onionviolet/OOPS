# CU1: custody and atomic exchange (MF1 L2)

Status: **implemented, below floor**. Public generic code and synthetic fixtures;
no private pack adoption, source-coverage claim, staging, commit or push.
Authority: [CU1 brief](CU1_BRIEF.md), [MF1 L2](MF1_AUDIT.md#d2-proposed-ranked-build-order-at-most-eight-lanes),
[PROJECT](../../../../../PROJECT.md) and [USER_VISION](../../../../USER_VISION.md).
The brief's "grant for L4" is a cross-reference typo: its enumerated paths and
mandate identify L2 exchange. DV1 remains the separate divination lane.

Rules: AR1-AR16, AD6-AD8/36/38/43/45, CLR1-CLR13, MR4/MR5/MR27/MR29/MR31/MR33/MR36;
MR1-MR36 consulted, no making law changed. MD1-MD3 are proposed seam guidance.
LSD139: no new random draws, ordinal or keyed. No standing direction changed.
UI patch follows [player UI rules](../../../../../.claude/rules/player-ui.md),
UR42/UR70-UR75. Target: existing place panel at **1920x1080 desktop**; visible
outcome is a Belongings disclosure with description, grouped price, supported
tender/change, duration, blocked reason and player perspective. Mobile deferred.

## Probe, fit and bounded chain

Live pack probe: 1,500 people, 492 household objects, one object with seeded
resources, **zero exchange rows**. Inventory probe, no named quantitative gate.
Reviewed RV6/RV9 gaps support grouped purchases, tender/change and clothing
changes; other-actor disbursements remain other-actor work. Private paraphrases
were read in place; no book acquired, reread or canon row generated.

Default: a supported grouped quote reserves seller stock and the buyer's tender;
completion delivers goods and change together. Dial: currency conversion and
tender precision are authored per world/row. Reason: ownership and paid value
must be conserved. A supported total need not imply supported line prices.

`defineCastExchanges` uses C1/C2 simulation admission, refund cancellation,
completion support, item/resource effects, equipment and observer knowledge.
The C6 native trade staging path was inspected: its market/player-price/XP
semantics are for native trader quotes, so this adapter uses the existing C2
transaction for pack counterparties. It does not masquerade as a native trader
or update native market saturation/merchant purses. No new inventory, purse,
clock, save slice, transaction writer or seed is introduced.

First chain: existing seller inventory -> reserved stock plus native money ->
carried bundle and change -> existing equipment slot. Reservation is escrow:
goods stay out of the buyer's usable inventory until settlement. Cancellation
and lost location/contact support return the exact stock and tender, with no
purchase receipt. Preview is pure; execution rechecks stock, money and contact.
Repeated clock advancement gives no additional goods/change. Swapping clothing
returns the previous slot item through the native equipment owner.

No native household stash port was found in these carriers. Stash savings,
separate purses, denomination holdings, protected movement and institutional
advances remain explicit gaps for the household custody/economy/authority owners.
Tender/change detail here describes the supported numeric exchange; it does not
claim banknote inventory or an NPC purse. No facts simulate either. H2 ordinary
object concealment facts remain unchanged; L3 can consume delivered native item
keys through its existing inputs, with no new making binding in this lane.
Stock must already exist through its real owner. Missing stock producers stay gaps.

## Row contract and coordinator registration

Pack field: `exchanges: {schema:1, rows:[...]}`. Missing field returns no commands
and no disclosure. Unknown purchase total is `null` and emits no executable
purchase. An authored price binding is needed before that row can run; unknown
denominations are `null`, not zero. No `undefined` or empty `requires` array.
The synthetic example is in `tests/cast_exchange_adapter.test.js`.

| Field | Contract |
| --- | --- |
| Common row | `id`, positive integer `revision`, `kind`, resolved `place`, positive integer `minutes`, `label`, `description`, `report`; optional native predicate `requires` |
| Purchase | `kind:'purchase'`, resolved `sellerId`, nonempty `items:[{key,count,label}]` with unique exact inventory keys and positive integer counts |
| Grouped price | `price:{total:number|null,unit,moneyPerUnit,tender?:number|null,change?:number|null}`; nonnegative safe integer total/tender/change, positive integer conversion; tender and change supplied together and tender minus change equals total |
| Wear | `kind:'wear'`, exact held inventory `key`, existing native equipment `slot`; item/slot compatibility remains the native owner's responsibility |
| Provenance | Canon locators, identities, reviewed paraphrases and minutes basis remain in private rows; use existing timing policy and label fills |

The row lane resolves seller identity, presence, exact keys/counts, stock owner
and currency binding from evidence; it does not synthesize stock or split a total
into line prices. Equippable keys include actual quality/identity fields. A bare
clothing key was a fixture error: native Import retains quality, so the test now
uses its full key. Synthetic equippable template names also match their registry
keys, as the incumbent native equipped-item loader requires.

Coordinator applies `CU1_INTEGRATION.patch` after review. It is unapplied in the
shared checkout and contains minimal joins at these existing sites:

| Shared path (patch target, not edited here) | Join |
| --- | --- |
| `src/book_world_lotm_cast_host.js` | Adapter import, exported commands/offers, `deriveCast(pack.exchanges)`, one existing registry command-list extension |
| `src/book_world_lotm_host.js` | Import, offers/view, jobs and native cancel lookup |
| `src/book_world_lotm_state.js` | Optional-owner guard, pending command lookup, exact admitted costs/effects and completion support |
| `src/book_world_lotm_ui.js` | Existing action-area disclosure, player perspective, command buttons and reasons |
| `src/perspective_controls.js` | `data-lotm-exchanges` in-world family |
| `tests/perspective_controls.test.js` | Matching family expectation |

No core-owner file is edited, zero registration lines in main/save/display,
zero new cycle edges. Parallel host patches need coordinator rebase at import,
registry list, view/jobs and validator list sites. The native fixture uses live
integration when the patch is reverse-clean; otherwise it checks and applies it
in its disposable copy. It copies the perspective test before patching. It does
not apply old DV1/MK1 patches.

## Checks and floor

Final check receipts and input hashes follow below. Initial failures were fixture
issues: missing target context/person registration, wrong save money field,
clothing key missing quality, template-name mismatch on native Import, one
corrected worker-string syntax error, and a corrected engine-fixture equipment
context (per-actor slots at the clock boundary). These are not waived checks.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_exchange_adapter.test.js` | PASS 4/4, 33.6 seconds | Synthetic engine and disposable native fixture, not desktop browser |
| Disposable fixture: `node build.js` with its private synthetic pack and CU1 patch | PASS; bundle SHA-256 `b6c00b7f654bd493053e1467e910b15219716f3e4028508a578545ffc8da5b38` | Named fixture build, not shared live pack; temporary copy is removed by test cleanup |
| Disposable fixture: `node --test tests/perspective_controls.test.js` | PASS | Prepared exchange family and expectation exercised in copy |
| `npm run check:arch` (shared checkout and patched disposable copy) | PASS; main -51, display -37, save writer 0; 6 grandfathered imports, 205 cycle edges | No growth/new cycles; concurrent checkout inputs remain outside this grant |
| `git apply --check .../CU1_INTEGRATION.patch` | PASS | Forward patch readiness, not shared integration |
| `node scripts/lane_review.mjs --grant src/cast_exchange_adapter.js --grant tests/cast_exchange_adapter.test.js src/cast_exchange_adapter.js tests/cast_exchange_adapter.test.js` | Raw scanner FAIL: 1 name-hit file, 0 top-level await, 0 outside grant | Manual token inspection found the generic `World` / `I.world` collision in the synthetic test; adapter has zero hits. No canon identities introduced; raw result remains FAIL |
| Scoped whitespace, owned-document links and `git diff --check` | PASS | Untracked files checked directly as well |
| Full `npm test`, `npm run check:rules`, rebuilt fresh-origin desktop journey | Not run by lane | Coordinator's combined gates; no registered rule/code changed |

| Floor | Evidence / remaining gate |
| --- | --- |
| FLR1 Build | Disposable patched fixture bundle hash above; no shared build output changed |
| FLR2 Route | Synthetic fresh native be-seat fixture, manually supplied seller stock; pending and settled exchange plus wear through existing place UI. Natural sourced route and rebuilt desktop journey pending |
| FLR3 Shown | Native headless disclosure, description/cost/duration, blocked buttons and player perspective; no 1920x1080 browser visibility proof |
| FLR4 Used | Real native money, carried inventory and equipment; previous clothing is returned; stock loss/cancellation and stale quote produce no award |
| FLR5 Kept | Pending purchase and wear Save/reload; purchase pending Export/literal Import/reload; settled purchase and equipped clothing Export/literal Import/reload. Real validator rejects tampered purchase effects and completion support |
| FLR6 Labelled | Agent-verified synthetic engine/native fixture, not human-reviewed; **implemented, below floor** |

Coordinator owns integration, paragraph-reviewed private rows and their real stock
bindings, combined gates and the rebuilt fresh-origin 1920x1080 journey. This
lane's synthetic mechanism proves no new whole-book replay coverage. Known
replacement seam: household custody and denomination/purse owners can bind later
without replacing simulation's inventory, transaction or save ownership.

Owned output files: `src/cast_exchange_adapter.js`,
`tests/cast_exchange_adapter.test.js`, `CU1_INTEGRATION.patch`, this checkpoint,
and the CU1 additive pointer in `DV1_CHECKPOINT.md`. The concurrent KN1 pointer
in DV1 was present before this edit and preserved; it is not CU1's change.

Frozen lane inputs (shared HEAD at first native success:
`ffd9150326441acdf8b7099608066a5f676b10d2`, plus concurrent dirty work):

| Path | SHA-256 |
| --- | --- |
| `src/cast_exchange_adapter.js` | `86f6682623b33f5d992383e396edccc95339d70e051f4b5d35e6e30463bab3aa` |
| `tests/cast_exchange_adapter.test.js` | `108536805e7572029c3e71f85a3185a15fb2637a0ac6fb53253c8caef3f8afdb` |
| `CU1_INTEGRATION.patch` | `729b7d6c8707cc826201bcb12bdd04982f3fe3cb73b095c5e7a1b21026e3684d` |

Ownership released to the coordinator. No lane worker remains running; disposable
fixture cleanup completed. Shared host hunks remain prepared, unapplied.

## Resume 1: rebase on inference integration, 2026-10-29

The previous CU1 patch's host, validator and perspective-test context predated
KN1. Regenerated `CU1_INTEGRATION.patch` against HEAD
`4901ccd3aaeb32722a5922a41f02daf82c6ab11a`, retaining KN1 imports, command
lists, projection and perspective expectations. The cast registry remains the
single command registration site. The patch includes the exchange in-world
perspective tag and its matching test expectation. No shared host file was
edited. `tests/cast_exchange_adapter.test.js` retains the reverse-clean check:
when CU1 is already integrated it tests the copied live source without applying
any patch; otherwise it checks and applies the prepared patch in the disposable
copy. Added a diagnostic to identify the branch. AD36, AR1-AR16, CLR9/CLR13,
AD43 and AD45 apply; no new direction or rule change.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `git show HEAD:<six patch targets>` into disposable directory, then `git apply --check`, `git apply`, `git apply -R --check` on CU1 patch | PASS | HEAD target files only; shared source untouched |
| `node --test tests/cast_exchange_adapter.test.js tests/cast_inference_adapter.test.js tests/cast_making_adapter.test.js tests/cast_divination_adapter.test.js tests/perspective_controls.test.js` | PASS 19/19; CU1 fixture reports prepared-patch branch | Synthetic/headless, not desktop browser; other sessions edited shared inputs during the run, so each disposable copy is its own input |
| `/tmp/cu1-live-check.py` | PASS 1/1; CU1 patch integrated in a disposable source tree, then native fixture reports live-source branch | Synthetic fixture; temporary tree removed. Fixture bundle SHA-256 `2fa6ce63b1a232a9f59d74194cd188ea3e824d05c6c01078e9a3381c1f92d5ab` |
| `npm run check:arch` | PASS; main -51, display -37, save writer 0; 205 grandfathered cycles | Current shared inputs, no growth |
| `git apply --check .../CU1_INTEGRATION.patch` | PASS | Prepared joins still require coordinator application |
| `git diff --check` on owned tracked paths; direct whitespace check on untracked lane files | PASS | Whitespace only |

Input SHA-256: `CU1_INTEGRATION.patch`
`fa95970c20ba0214752c7cf30d66ba44139299a561037d700abd95f2d783b544`;
`tests/cast_exchange_adapter.test.js`
`b297049a473657830c3682ad9a76ce50dd6b7c94e49c2edfa195d875746ef3a0`.
This supersedes the original patch and test hashes above, retaining that history.
Status remains **implemented, below floor**: coordinator integration, combined
pre-commit gates, source-supported rows and rebuilt desktop journey remain open.
No commit; CU1 owned paths are released to the coordinator.
