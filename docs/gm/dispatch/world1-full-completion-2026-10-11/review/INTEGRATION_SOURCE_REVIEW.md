# Independent candidate integration source review

Reviewed 2026-10-11 by `/root/integration_review`, read-only runtime reviewer.

Scope: the 28 source/test paths in `../INTEGRATION_PLAN.json`, candidate
`/Users/weiwei/.codex/worktrees/world1-completion/yet-another-idle-rpg`, against
shared same-base HEAD `53dc1df15889be6ebb1bae403497041f0672db46`.
All 28 live candidate SHA-256 fingerprints matched the plan during this review.
No runtime, private pack, test, build, browser, save or source-library writes;
no tests, builds or browser journeys run. Only this review directory was written.

No source-established integration blocker was found for the currently installed
authored unit. Two concrete generic runtime gaps need tracking as full-world
implementation expands. This is not final independent full-world gap review,
source completeness approval, native behavior proof or director acceptance.

## Findings

**F1 [P2]: Player projection can expose NPC-only command presentation.**
`src/structured_pack_runtime.js:96-98` iterates every command and projects its
label, description and reasons whenever `quote.visible` is true. The preview
in `src/simulation.js:85-110` adds actor/role mismatch as an eligibility reason,
but does not make that command invisible. A command with an NPC `actorId` and
no separate visibility predicate therefore appears as a disabled player action.
The compiler's explicit audience requirement (`src/structured_pack_definitions.js:79`)
does not prevent this: audience is retained for job/log publication in
`src/simulation.js:211,288`, rather than used for action projection. This can
reveal NPC-private labels and descriptions once such commands are authored.
Filter commands intended for other actual actors/roles before projection and
define observer disclosure independently from execution facts. Add a focused
NPC-only presentation regression. Current installed structured definitions
contain zero NPC actor/role-restricted commands, so current private journey
exposure is not established. Reproduction is source-derived and unrun.

**F2 [P2]: Identified units cannot have the native player as title owner.**
`src/structured_pack_definitions.js:63` requires every unit's `titleOwner` to
appear in `d.simulation.people`; `src/structured_pack_state.js:9` repeats this
restriction against receipt `peopleIds`. The native player is initialized
separately from that list by `src/structured_pack_runtime.js:68-78`, and adding
a declared player row would collide with that actual player. In contrast,
`src/structured_container_runtime.js:63-66` explicitly allows title ownership
by the holder, and the low-level development test uses that supported case.
Thus the structured pack admission/receipt layer cannot represent an identified
object genuinely owned by the player, despite the container runtime supporting
it. Admit the already-bound native player alongside declared simulation people,
while preserving actual title and quantity checks, and add compiler/receipt
roundtrip coverage. Current installed definitions contain zero player-owned
units. This is a full-world expressiveness gap, not a demonstrated current
journey failure. Reproduction is source-derived and unrun.

## Source evidence by requested boundary

| Boundary | Inspected evidence and limit |
| --- | --- |
| Genuine native callers | `main.js` calls selection, beginning, simulation action/cancellation and renewal from the mounted structured panel; location restrictions and real CombatZone construction are present. Actual clicks/combat remain unrun here. |
| Durable publication | `persistExpansion` stages gameplay/native inventory publications before `persistExpansionPlan`; the latter patches and validates the single envelope before `storage.setItem`; live state and publication follow success. Beginning reserves its selection first. Source inspection establishes ordering, not storage-failure browser behavior. |
| Item ownership | `structured_container_runtime.js` requires one complete exact object, accountable title/custody, actual person/container inventory, aperture and volume limits, actual source/faculty/body and energy use. `structured_pack_state.js` checks stock plus reservations against title status. F2 remains. |
| Source geometry | Container capacity/aperture, whole-object constraints, staged development debits, exposure/condition conversion and clock boundaries have consumers. This review does not certify that these generic limits cover every source-world ability or geometry detail. |
| Dormant prior versions | `content_packs.js` records registration separately from visits, parks owned native locations/availability/inventory and restores exact ID lists. Structured active saves require exact revision/hash/snapshot and pause with preserved export when content is absent. No inferred conversion of prior scalar history was found. |
| Old saves | Absence of structured state returns unchanged; later simulation schemas can enter without a caused situation, while malformed situation validation remains. Prior real saved-file load/import compatibility is a separate native gate. |
| Actor knowledge | People and status project held player knowledge, action costs omit NPC costs and outcomes. Actual target/container facts are execution facts. F1 is the command-presentation gap. |
| Tests | Reviewed the new provenance/binding/structured definition/runtime/origin/container/preparation/development/renewal/UI tests and their asserted boundaries. Synthetic test presence is not a fresh run or native proof. |

## Remaining authoritative gate

The root GM must verify the rebuilt combined shared source and current unit
through a fresh native origin, including save/reload/import, before reporting
shared playable technical delivery. Full S00-S14 observable-leaf coverage and
an independent final full-world gap review remain separate from this bounded
generic integration review. No sealed content truths are included here.

## Follow-up disposition, 2026-10-11

Root implemented fixes in the candidate, then requested this independent
read-only source recheck. Both original findings are **resolved in source with
meaningful focused regression coverage**; native verification remains separate.
The original findings and initial fingerprints above are historical snapshots,
not the current candidate hashes after these fixes.

- **F1 resolved:** `structuredCampaignView` now excludes commands bound to a
  different actual actor or a nonmatching actor definition before preview and
  presentation. The new regression supplies both an NPC `actorId` command and
  a role-only command with its inherited player `actorId` deleted, verifies an
  ordinary player action remains, and verifies neither private label reaches
  the serialized view. This directly covers the reported projection failure.
  General author visibility predicates still govern discovery for player
  actions; this change does not assert that every future predicate is safe.
- **F2 resolved:** compiler title owner/recipient checks admit the separately
  bound `player` alongside declared simulation people, and receipt unit checks
  likewise admit the player title owner. Actual saved claim ownership and
  held/reserved quantity checks remain intact. The new regression compiles and
  begins a player-owned unit, reserves it via the actual command, cancels with
  refund, publishes through the save transaction, revalidates the saved
  envelope, and rejects a duplicate object added to another owner. This is
  stronger than merely checking the relaxed admission expression.

Root reported the focused source slice **17/17 passed**, after removing an
undefined property from the role-only JSON fixture. This reviewer inspected
the final code and test assertions but did not independently run that slice,
the full suite, a build or a browser journey. No new integration blocker was
identified in this follow-up. No full SRC01/SRC03 or full-world claim is made.

Rechecked candidate SHA-256 identities:

| Path | SHA-256 |
| --- | --- |
| `src/structured_pack_definitions.js` | `d162ec4a266c56cb0057da1c3e31b6870c19034a38d1c9086dcfbd39e7bf892f` |
| `src/structured_pack_runtime.js` | `fbc9eb255b11040a0329fae926a9ad62cd3e4396ee5f4b93edd066c73e5fa794` |
| `src/structured_pack_state.js` | `a85fed42de42fb4df9f0595db408adb2541f39356e99beb80d94420143ff720a` |
| `tests/structured_pack_runtime.test.js` | `235402ab3394e18fd34470dfee3e51af4673e0803c3cf505d2686f7819405329` |

Review-directory writes released after this append; no candidate/shared runtime
or test files were changed by the reviewer.
