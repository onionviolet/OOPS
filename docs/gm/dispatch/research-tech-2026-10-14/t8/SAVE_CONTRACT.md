# T8: seed, draw, transaction and compatibility contract

2026-10-14. **Proposal only.** B26-B30 extend PW1-PW5 and generation P8.
Schemas and stream names below are logical suggestions, not registered APIs,
reserved schema numbers or selected migrations. No user save was read or changed.

## B26. Source evidence: useful seams and their limits

Read-only main-checkout observations, 2026-10-14. SOURCE means inspected code,
not tests, native play, durability proof or a repository-wide absence audit.

| Locator | SOURCE behavior | T8 implication |
|---|---|---|
| `src/main.js:440`; `src/expansion_engine.js:73-79,517-521` | Initial RNG comes from crypto; expansion stores a nonzero uint32 cursor; xorshift advances that same `rng` field | Capture and persist a separate immutable tech root. Current `rng` is not an immutable root that can safely be re-derived on every visit |
| `src/expansion_engine.js:536-585` | Action plan clones state, freezes paid costs, outcomes, effects, draw and table revisions; `finish` records history at `:524-531` and keeps 100 entries | Reuse commitment discipline; bounded action history cannot be the sole durable tech/history/draw store |
| `src/simulation.js:38-40,48-72,180-188,501-514` | Domain/event derivation and xorshift exist; command outcomes advance `s.seed`; automatic checks keep per-check cursor/count/due, and services declare played-time advancement | Isolate tech scopes; `s.seed` is also mutable for commands. Register actual boundary adapters, not a display-triggered timer |
| `src/simulation_contracts.js:217-223,305-308`; `src/simulation_resolution.js:4-7,9-32` | Simulation stores/validates seed and check state; seed derivation helper and frozen spawned templates exist | Derivation is not itself a saved draw or generic inventor identity bridge |
| `src/main.js:5188-5196,5306-5308`; `src/expansion_engine.js:256-270` | Save includes expansion and optional lives; load restores validated expansion or initializes absent state; older expansion schemas migrate additively | Add explicit optional technology enrollment and validation. Do not depend on page-start crypto for an already enrolled world |
| `src/expansion_persistence.js:7-16,30-50`; `src/main.js:919-937` | Host stages a complete envelope, validates/writes it, then publishes expansion/native resources | Tech records, actual consumer effects and draw updates must enter the same detached plan/envelope |
| `src/main.js:414-424`; `src/save_files.js:194-215` | Current host storage wrapper uses guarded writes; size helpers measure UTF-8 and UTF-16 bytes and reject quota failure | Measure full envelopes. A tech sidecar cannot evade total capacity or atomicity requirements |
| `src/save_files.js:40-46,72-83,158-191` | Envelope validation and file decoding precede preflight; import writes only after preflight | Add technology schema/reference checks to both paths before live/storage mutation |
| `src/npc_lives.js:5-22`; `src/enemies.js:170-174`; `src/combat_math.js:34-44` | Authored households vary death year by hash; inspected loot sites and combat defaults still use Math.random | Older procedural status needs qualification. No claim all main gameplay is seeded or P1/P4 merged |

The dated status map describes its survey at
`docs/PROCEDURAL_GENERATION_STATUS_2026-10-13.md:7-21,52-56`. Its implementation
map and sibling worktree reports route investigation; main bytes above govern
these specific findings. Existing seeds/transactions support the proposed joins,
but do not establish a world-tech generator, ruin store or durable invention ledger.

## B27. Scope, immutable root and saved resolved truth

Proposed optional `WorldTechState`:

```text
scope: worldDefinition/continuity/instance/branch/era + enrollment boundary
revisions: schema, generator, PRNG, key codec, planner packs, laws, policies
techRootSeed: immutable captured uint32, nonzero; root derivation receipt
sourcePins: source snapshots, evidence modes, gap permissions, conflicts
definitions: frozen graph nodes/methods and generated resolved values
regions/routes: bound identities, exposures, suppliers/users, coverage
ruins/fragments: historical refs, frozen contents/condition, custody refs
inventors/projects: identity bridge, frozen profiles, progress/reservation refs
history/claims: P14 refs plus retained minimum evidence/identity closure
streams: per-domain scope, cursor, ordinal, algorithm revision
drawReceipts: operation key, stream, ordinal, before/after, uint32 draws,
              frozen choice context/weights, resolved choice, validation refs
schedule: clock binding, processedThrough, pending due/phase/operation keys
```

Domain owners retain stock, actual bodies, custody, knowledge, site capacity and
money. This envelope references them rather than maintaining duplicate balances.
Generated graph definitions save sufficient resolved semantics/interpreter refs,
not just IDs/hash/seed. Shared immutable definitions can be deduplicated through a
versioned manifest, but the exported envelope must retain everything required.

For new original worlds, admission captures the root alongside the instance.
If deriving it from existing expansion state, read the cursor **once at the
declared admission boundary**, save both derivation input and resulting root,
and never pretend it was the game's original immutable seed. Prior gameplay can
therefore affect that new world's admission seed; later tech displays cannot.
Legacy enrollment likewise records its boundary and coverage instead of inventing
a past. An absent optional owner remains absent until explicitly enrolled.

Proposed domain keys: background, diffusion per route/method, ruin per site,
inventor per actor, account/credit per occurrence. Names are semantic, not asserted
P1 registrations. Bind them to the eventual integrated stream owner. Never share
one advancing tech cursor with combat or rely on global iteration order.

For an implementable derivation candidate, pin the current `deriveSimulationSeed`
32-bit algorithm and serialize a fixed positional JSON array of root scope,
domain, entity and generator revision, with strings/numbers only, no omitted slots.
Freeze Unicode encoding/iteration rules and use exact ASCII ID sorting. Each
derived nonzero cursor then uses the pinned uint32 xorshift operation. Produce
seed-to-receipt golden vectors before selection; this lane has not executed them.
Always save cursor and resolved result. Even a deterministic hash changes meaning
if its codec, candidate list or resolver revision changes.

Branch fork at a checkpoint copies state/cursors and inherited definitions;
record subsequent branch-qualified operation identities. Merely changing the
branch ID cannot resample copied pending work. A fresh instance gets its own
admission/root policy. Loops, prestige and crossing carriers remain timeline-owner
decisions, not implicit resets of this envelope.

## B28. Commit once; preview consumes nothing

1. Read the authoritative owner revision, clock and selected dependency snapshot.
   Validate source pins, lawful graph, witness feasibility and supported consumers.
   Quote/preview/view computes only known information and creates no state/draws.
2. Build a detached candidate; reserve actual stock/capacity, assign the stable
   operation key, stage scoped draws and resolve validated choices. Freeze pending
   effects, terms, result semantics, minimum evidence and required identity refs.
3. Validate cross-owner references, retention closure and full-envelope size.
   Persist effects/resources, pending commitments, tech records, schedule and
   consumed draw state together through the owning host.
4. Publish only after durable success. Rendering is a reader. A replayed key
   resolves to its retained result without reapplying cost, reward or draw.
5. At a genuine later boundary, settle the frozen commitment through its consumer
   and append actual outcome/evidence. Cancellation, interruption or changed means
   follows its declared policy and cannot replace the admitted random result.

Invalid, stale, unsupported, quota-failed or rejected candidates publish nothing
and do not advance the live cursor. A retry from unchanged durable state yields
the same candidate. Finite validation retries can use detached draws, but either
the full accepted generation and receipt commits or none does. No unbounded
reroll-until-useful loop. A declared authored fallback has its own receipt.

Optional text failure must not redraw physical truth or erase a valid deed.
Retain minimal typed outcome plus a safe neutral rendering, then retry optional
text against frozen bindings. Minimum required evidence capacity must be reserved
before any history-promising operation spends resources. P14 owns this lifecycle
at `docs/gm/dispatch/procgen-2026-10-13/p14/CONTRACT.md:83-107`.

Lazy detail is a separate admitted operation using its frozen reservation and
revision. A preview cannot materialize it, change a seed, or leak hidden alternatives
through counts. Save draw receipts privately; public sealed artifacts contain only
secret ID, route and status. Determinism is not cryptographic secrecy from editors.

## B29. Version retention, import and clock progress

Old generated values and committed graph meanings survive catalogue updates.
Keep compatible interpreters/frozen definitions or use an explicit migration
with before/after semantic mapping and no new random truth. Unsupported revisions
are preserved with suspended commands or whole-import rejection under a selected
policy; the current loader must gain that path before it is claimed supported.
Never bind an old method ID to a newer incompatible method silently.

Validate unique scoped IDs/operation keys, uint32 cursors and ordinals, revision
bindings, dependency graph/bootstrap witnesses, historical partial order, actor
existence intervals, custody/reservations, fragment coverage, source pins,
disclosure rules, claims lineage and clock boundaries. Same key with different
content is conflict, not deduplication. Full-envelope import includes P14 evidence
and linked products; technology alone cannot import a payment or custody transfer.
Missing fragments/laws do not become safe empty defaults. Private saves stay private.

Retention follows references: preserve pending work, active claims, callbacks,
resolved generation meanings and their minimal causal/identity closure. Display
windows and index caches can compact; no latest-100 draw/history cap can erase
dependencies. Archiving needs a self-contained manifest and an atomic portable
export/import path. No new storage backend is selected. Check the actual full
serialized save and storage failure behavior rather than promise constant size
for an indefinitely growing exact invention history.

Advance through the canonical B3 schedule with saved `processedThrough` and an
optional continuation cursor. Process every relevant boundary or stop at a durable
continuation; a work budget cannot silently skip years and label them simulated.
Chunked active/offline execution must agree under the same authorized elapsed
interval and inputs. Opening/importing a save is not extra elapsed time. Natural
course continues on its selected clock, not on invented wall time for parked worlds.

## B30. Acceptance matrix for a later selected slice

All gates below are **specified, NOT RUN**. Documentation checks are not save
roundtrips. Native proof requires an actual integrated consumer and fresh rebuilt
desktop origins, with disposable fixtures rather than user saves.

| Oracle | Required comparison |
|---|---|
| Determinism | Same root/scope/revisions/dependencies yields identical admitted result; reorder unrelated catalogue/regions and consume combat draws without changing tech draws |
| Reload and preview | Pending/completed reload preserves result/cursor; many roadmap/region/fragment/inventor previews leave the entire owner and all streams byte-equivalent |
| Transaction/replay | Stale quote, duplicate key, quota and write failure leave no phantom stock, record, knowledge, history or consumed live draw; new legitimate operations remain possible |
| Canon and natural course | Undisturbed baseline honors selected pins; actual disturbance changes supported dependents only; private player work grants no unreceived NPC knowledge |
| Ruin and epistemics | Coverage is not a TK sum; copy lineage is not independent corroboration; comprehension changes knowledge, not ancient contents; no hidden truth leaks |
| Clocks and LOD | Whole versus segmented allowed intervals, save during continuation and coarse-to-named materialization conserve results, identity, budgets and due work |
| Version/retention | Old meanings and relevant evidence survive updates/compaction; unsupported content retained/rejected explicitly; no seed-only reconstruction or name-based rebinding |
| Full native portability | Reach actual useful output/recipient consequence, then pending/completed Save/reload, Export and literal-file Import at a second origin retain all linked domains and next draws |
| Desktop/director | 1366x768 and 1600x1000 show known state, roadmap and dated evidence together; hidden DOM/accessibility/errors remain observer-safe; mobile deferred, human fiction/balance review separate |
