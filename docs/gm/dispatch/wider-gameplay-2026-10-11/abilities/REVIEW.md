# Read-only join review, 2026-10-11

Scope: candidate ability admission, expedition discovery and recipients,
true-death stop/publication/archive boundaries, and P06 source-local method
contracts. No runtime edits, browser use or private-save access in this review.

## Actionable findings

F1 [P1]: `src/structured_pack_runtime.js:98-100` projects all visible commands
independently of expedition discovery. The original expedition validator did not
require discovery predicates on the bound commands. Reproduced with the actual
synthetic expedition fixture: removing its knowledge produced an empty site
projection, while native prepare remained eligible and committed a job. Root
assigned compiler/validator discovery guards and regression tests to expedition
worker. Repair acceptance belongs to root.

F2 [P1]: original `src/structured_life_runtime.js:19` projected authoritative
`lifeCause.reason` directly. A synthetic sealed cause appeared verbatim in the
life UI projection. Root reports replacement with generic wording and a
regression. This review did not read a private death truth into the report.

F3 [P2]: original `src/structured_expedition_runtime.js:44-46` admitted any
positive health effect for treatment and any lethal dead effect for the lethal
role without qualifying its recipient. Synthetic treatment and lethal effects
redirected to a bystander passed metadata validation. Root assigned explicit
player-recipient validation and tests to expedition worker.

F4 [P2]: archive partial-failure retry can collide with its own successful first
archive. `create_save` stamps a fresh `saved_at` to second precision; exact-byte
archive collision checks reject a later retry after archive succeeds but reset
fails. Live state remains available, but the unchanged life cannot retry through
that action without resolving the collision. Suggested repair: reuse a stable
archive payload for the same unchanged ended life, or compare canonical gameplay
excluding volatile export timestamps while refusing materially different state.
Reported to root; no repair claim here.

F5 [P2]: P06 ordinary craft route omits the actual living/body/hands requirements
from both admission and completion, despite its trained source persisting after
bodily eligibility changes. Sent the exact command ID privately to its owner;
no source identities or world truths reproduced here. Device route review found
its token, active source, compatibility and finite charge requirements intact.

## Checks and limits

`node --test tests/structured_life_runtime.test.js tests/structured_ability_runtime.test.js tests/structured_expedition_runtime.test.js`:
14/14 passed before the reported repairs. Passing tests did not cover F1-F4.

Read-only synthetic reproductions independently demonstrated F1, F2 and F3.
F4 is source-derived from the archive failure/retry path and volatile timestamp.
F5 is source-derived from P06's exact command gates, not browser evidence.

Death versus ordinary native defeat remains distinct in the current helper and
focused tests. Native-life checks appear on durable publication, reload, joined
clock advancement and native activities. The durable persistence call precedes
publishing `expansionState` and `character.is_alive`; no failed-save mutation of
live life was found in the reviewed path. Root owns rebuilt browser, save/reload,
import and actual new-character archive acceptance. No target-world bypass was
found in the existing native command preview: it validates declared actor,
world, location, target world/life and co-location where authored.
