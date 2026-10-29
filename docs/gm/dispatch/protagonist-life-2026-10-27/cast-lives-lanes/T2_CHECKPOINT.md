# T2: pack-driven journeys

Status: **implemented, below floor**. Agent-verified synthetic engine and native
headless fixture, not desktop-browser-verified or human-reviewed.
[Brief](T2_JOURNEYS_BRIEF.md). Ownership released to the coordinator after checks.
No commit, staging, stash, reset, force, push, shared build-output edit, private-pack
edit or player-save access. Temporary fixtures author their own synthetic packs.

## Direction, seam and owned paths

This implements the bounded journey mechanism requested by the brief, consistent
with PROJECT.md's lead-life direction. It adds no canon rows or replay coverage
claim. X4's family counts remain actor-unknown hypotheses, not confirmed lead steps.
Rules: AR1-AR16, AD36, AD38, AD43, AD45, MD1-MD3, CLR1-CLR12 and LSD60.
UI follows [player UI rules](../../../../../.claude/rules/player-ui.md), UR42 and
UR70-UR75. Target: existing place panel at **1920×1080 desktop**. Visible outcome:
a Journeys disclosure shows means, origin, destination, duration, fare and blocked
reasons. Mobile optimization is deferred. No new panel or navigation route.

| Owned file | Change |
| --- | --- |
| `src/cast_journeys.js` | Name-free row-to-command adapter, quote and arrival-report projection |
| `tests/cast_journeys.test.js` | Synthetic three-place routes, native disposable fixture and persistence/tamper checks |
| `src/book_world_lotm_cast_host.js` | Pack registration, bounded native relocation context, offers and Reports |
| `src/book_world_lotm_host.js` | Quote/commit and tick-context integration through the existing host |
| `src/book_world_lotm_state.js` | Exact pending-definition and completion-support lookup |
| `src/book_world_lotm_ui.js` | Existing place-panel disclosure and command buttons |
| `src/perspective_controls.js` | In-world journey disclosure tag |
| `tests/perspective_controls.test.js` | Journey tag coverage |
| `T2_CHECKPOINT.md` | This receipt |

No composition root, core clock, simulation transaction, save writer or rulebook
changed. New leaf imports the existing pure rule evaluator; zero new cycle edges.
The cast registry is the one registration site. The location authority remains
`simulation.people[actor].location`, with the existing native location publisher
updating the controlled body's actual place in the same transaction.

## CLR2 data probe

| Input | Expected | Observed | Gate |
| --- | --- | --- | --- |
| Existing native movement, clock and purse stock | Inventory | Native simulation jobs reserve costs and settle at `state.clock`; `resource` with `native:true`, actor `player`, key `money` charges the existing native purse. `relocate` updates the simulation body and, with the exact structured-native world/body/destination binding, emits `nativeLocation` and `current location` for the existing publisher. No generic paid-carriage adapter found in this seam. | PASS |
| Cast walking duration and eligibility | Inventory | `castWalkId(from,to)` selects registered pairs. `lotmWalkMinutes` uses district links and the same-district 2-minute default. Host move checks current origin, busy/sleep, canon admission and native command preview. Existing walks place the body at departure and report after the timer; T2 uses the existing relocation effect at completion instead. | PASS |
| D2 integration pattern | Inventory | `deriveCast` defines commands; `installCast` installs through `createSimulationRegistry`; native host quotes and commits; place-panel buttons call host `act`; exact admitted jobs are looked up by the owning state validator; completed observation receipts feed persisted Reports. | PASS |

## Pack contract and behavior

Optional `pack.journeys` accepts an array of rows, or `{journeys:[...]}`.
`defineJourneys(data, ports)` binds `worldId`, `actorId` (default player), group,
situation and optional common requirement. Each row has `id`, `from`, `to`,
`means`, `label`, positive integer `minutes` and `report`; optional `description`,
nonnegative integer `fare`, `hours:[from,to]` and native `requires` supply detail.
IDs and duplicate rows are checked. Host endpoints must be present in pack places.
A missing journey field produces no commands, UI, facts or replacement context.
A missing fare stays unknown and is labelled "Fare not recorded", rather than
asserting zero fare. Explicit zero is "No fare". Fare uses native money units;
no currency conversion or NPC purse was invented.

Hours are local integer hours, opening-inclusive and closing-exclusive, with
24 accepted as a closing endpoint and overnight windows supported. Admission
reads the existing cast calendar projection. Hours and available cash constrain
departure; their later change does not retroactively invalidate paid travel.
Authored support and the origin are rechecked at completion. Lost support refunds
reserved fare and grants neither relocation nor an arrival receipt. The native
supported-job contract uses `cancellation:'refund'`; no extra cancellation UI was
added. Existing host controls still display accepted work as occupied.

The quote uses native preview plus the existing pure evaluator's failed leaf
reasons over the same simulation facts. This preserves all hours, fare and
requires reasons despite native preview's generic compound-requirement message.
Origin/busy/body/canon/save/sleep reasons retain their native owners. Commit
revalidates the native definition. The actor stays at the origin until due; the
existing relocation effect then updates the body and native publisher together.
Reports publish after persistence and mark the receipt's cause in existing world
facts, following D2. Like D2 this is a latest-occurrence report projection, not a
new travel-history ledger.

Paid non-player routes carry no invented charge: their requirement blocks travel
with "Unpaid fill: this actor needs a purse owner before paid travel." A future
actor-purse owner must supply that settlement mechanism. The native fixture proves
the player's real purse route. Cross-world/realm entry is not implemented by a
same-world destination ID; a crossing needs its world-entry owner and binding.

## Persistence and limits

No new save slice or schema. Existing JSON jobs retain costs, effects and support.
The validator recognizes journey IDs even without the `book.lotm.` prefix, then
checks exact actor/revision/cancellation/costs/effects and exact completion support.
It rejects altered fares, destinations and removed completion support through the
real native save-envelope validator. Pre-T2 saves need no migration and acquire
no fabricated journey. Pending and completed Save/reload and literal Export/Import
pass in the disposable native fixture.

Missing-pack pending journeys have no dormant bypass; recovery still needs the
matching pack/definition. Malformed journey rows are rejected by the adapter, but
journey-specific invalid-pack boot recovery is not proven: the loader's existing
preflight covers other command families and is outside this lane's grant. The
coordinator/content lane owns pack generation/retention, content source review,
endpoint native registration and any loader preflight reconciliation. No live
canon pack was adopted or silently populated by this lane.

## Checks

Input: the eight source/test paths above on shared HEAD
`e3d933e8032bf4f181e1a02042bd14077d205b9a`; shared work outside these paths is
not claimed. The native test copies current source/scripts to a disposable tree,
adds fixture-only exports there, and uses three synthetic places, paid carriage,
return home and a boat blocked by hours and fare. No shared `main.js` edit.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_journeys.test.js tests/perspective_controls.test.js` | PASS 7/7 | Quotes, all blocked reasons, stale admission, overnight hours, one fare reservation, origin retained until due, arrival/native publisher, return route, lost-support refund, real validator pending Save/reload, arrival, Export/literal Import, destination/fare/support tamper rejection and perspective DOM. Synthetic/headless, not browser. |
| `BUILD_OUT=/tmp/yairpg-t2-build npm run build` | PASS, checked Ink artifacts and JS bundle | Build only; shared outputs untouched; not browser-exercised |
| `npm run check:arch` | PASS: main -59, display -37, save writer 0 growth; 6 grandfathered imports, 205 cycle edges | Existing baseline retained, no new cycles |
| `node scripts/lane_review.mjs` with the eight exact source/test grants and paths | Raw scanner FAIL: 6 name-hit files, 0 top-level await, 0 outside grant | HEAD baseline already has 5 hit files; added-line inspection and new-file scan identify only the common code/prose token `world`, with zero other new name hits. No canon identity added. Raw checker remains failed; not relabelled PASS. |
| Targeted publication review using `review()` on new files and added lines against HEAD | PASS manual disposition: only `world` lexical collision, no new canon names; exact grants retained | Common-token false positive is not a scanner change; original file content preserved |
| `git diff --check -- <six tracked owned paths>` plus owned new-file whitespace/link check | PASS | Whitespace and local links only |
| Full `npm test`, `check:rules`, rebuilt fresh-origin desktop browser | Not run by lane | Full combined gate belongs to coordinator; no rule/index changes |

Initial focused failures were corrected: native predicates support `lte`, not
`lt`; completion-support jobs require refund cancellation; synthetic observation
receipts require an active situation; actor requirements use the `actor.` fact
namespace. The native test exposed the collapsed compound failure message, now
expanded in quotes without weakening native admission.

## Floor receipt

| Floor | Evidence and gap |
| --- | --- |
| FLR1 Build | Isolated build passed; SHA-256 below. Native headless fixture independently rebuilds its synthetic source copy. |
| FLR2 Route | Named synthetic native fixture reaches the real place-panel buttons and return route. Natural canon and fresh-origin desktop browser route pending. |
| FLR3 Shown | Description, route, cost, duration, refusal reasons and perspective verified headlessly. Rebuilt 1920×1080 visual/interaction proof pending. |
| FLR4 Used | Journey changes the existing actual location consumed by places/walks and return command; fare changes existing native money. |
| FLR5 Kept | Native pending Save/reload, arrival Save/reload and Export/literal Import pass; browser persistence journey pending. |
| FLR6 Labelled | Implemented, below floor; agent-verified synthetic/headless fixture, not human-reviewed. |

Remaining authoritative gameplay gate: coordinator's rebuilt fresh-origin
1920×1080 browser journey, including pending save/reload, arrival and Export/Import,
on the combined candidate. Human review is optional. Coordinator also owns the
combined pre-commit checks and commits. Lane has no intentionally retained running
process after its focused run; `/tmp/yairpg-t2-build` is the isolated build artifact.

| Frozen input | SHA-256 |
| --- | --- |
| `src/cast_journeys.js` | `9f42c519de3f0c2d2bfafdef20fc7ff9be863af0c4fb6b15a158232c128c36ee` |
| `tests/cast_journeys.test.js` | `dae9cd0da5c3ffcc4b616e0ff79f6716557e691340585a6d7687ea010e54afba` |
| `src/book_world_lotm_cast_host.js` | `5956861d14ab49ab015627db54ad6d03c1c4865baa672be8159cf27d8205905c` |
| `src/book_world_lotm_host.js` | `a33285ab069aba084b5a7a5d9947a0524f33306a32925a6d697517f2bfd3448f` |
| `src/book_world_lotm_state.js` | `03acb2967bdb33566f2ed34e027b1183f5ca920e29c36f576fdf363c472b1925` |
| `src/book_world_lotm_ui.js` | `96a2879449016ba6d609be8c82abba9860d2f97ecc227ab85d9522be9855b957` |
| `src/perspective_controls.js` | `8b21ab731892139ecc7305b77d59b66455e9f8220643ad2b80697e052a3fce3a` |
| `tests/perspective_controls.test.js` | `5089a7c366d4b325e88f1f4ff597b264dee6a1ec088c225d345e0f73b679d639` |
| `/tmp/yairpg-t2-build/dist/bundle.js` | `16b4ce43a182aa3a1ece3569ad7b65d64f8cc36d0e5553b76200eaae5030a828` |

## Resume 1: stale topic fixture patch

The D2 host and save patches were already integrated in `79f081eb3`, but T2's
changes made their reverse-check fail. The topic fixture now tests the live copied
host and validator directly, retaining native choice, pending and settled
Save/reload, Export/Import, and tamper coverage. The separate malformed-pack
scenario still applies the **unintegrated** D2 loader preflight patch to its
disposable copy after the live-source scenario finishes. It does not establish
that loader recovery is integrated. Rules: ON9, CLR9, AR7, AR10 and AD36.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_journeys.test.js tests/cast_topic_talk.test.js tests/place_acts.test.js tests/perspective_controls.test.js` | PASS 19/19 | Synthetic/headless fixtures; the loader recovery case uses its prepared patch. Browser and combined pre-commit gates remain with the coordinator. |
| `git diff --check -- tests/cast_topic_talk.test.js` | PASS | Tracked fixture whitespace only. |

Input identity: shared HEAD `e3d933e8032bf4f181e1a02042bd14077d205b9a` plus
current owned T2 edits; `tests/cast_topic_talk.test.js` SHA-256
`032284b331306d598019c4d99c336313dae7f11b8912aba5e3c2eb1dfe38b6c0`.
No commit; ownership released to the coordinator.
