# World pack loader: design (WPL)

Status: proposal plus a first additive slice, 2026-10-16. Lane brief:
[Part 9 P9P](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md)
(untracked in the main checkout; read by absolute path). Rules applied: CX1–CX8
(accepted), WP1–WP15, P9Y30 save rules, P9Q2–P9Q7 layered people, GR1–GR17,
IS1–IS10, EP/EC/MC5. Nothing here is wired into `main.js`, saves or `dist/`.
Codes **WPL**.

## WPL1: which pack system the loader extends

Two systems exist (P9P1a):

| System | What it is | Role |
| --- | --- | --- |
| `src/content_packs.js` | Pack **entry point and save owner**: reads `private_packs/manifest.json`, dispatches by `schema` (1 → `registerPack`, 2 → `registerStructured`), owns the `content_packs` save key (`registered` provenance, `preparePackSave` parking of unavailable packs). | **Base.** |
| `src/structured_pack_{definitions,runtime,state,ui}.js` | A **compiler** from a schema-2 pack into native registry families (worlds, actions, people, sites, events, encounters, energies …) plus the durable beginning receipt. | Reused as the compiler for a world pack's optional `native` block. |

**Decision (proposal): the world pack is a third *format* routed through
`content_packs`, not a third system.** Concretely, `loadContentPacks` gains one
dispatch arm, `data.format === 'yairpg.world-pack'` → `registerWorldPack`, next
to the existing schema-2 arm. A world pack holds the layers neither system has
(catalog, areas, institutions, cohorts, slots, rule profile, per-pack save
section). Anything it needs as native actions, people or sites goes in an
optional `native` block that is literally a schema-2 structured pack and
compiles through `compileStructuredPack`. So:

- one entry point and one dormant-pack policy (`content_packs`, IS8),
- one native-content compiler (`structured_pack_definitions`),
- world-pack-only logic lives in `src/world_pack_*.js` and calls neither's internals.

Why `content_packs` and not `structured_pack` as base: the loader's hard
problems (ordering, dormancy, provenance, save parking) are entry-point and
save problems, which `content_packs` already owns. `structured_pack` is a
compile-into-registry step with an exact-schema contract; widening it would
push catalog and population data into native registry families that tick,
which breaks CX4.

## WPL2: manifest shape (WP1, WP2)

Implemented in `src/world_pack_manifest.js` (`validateWorldPack`).

```js
{
  format: 'yairpg.world-pack', formatVersion: 1,
  id: 'book.mol',              // namespace root; every record id starts with `${id}.`
  revision: 3,                 // content revision, pinned by saves
  saveSchema: 1,               // delta format of this pack's save section
  saveCompatibleFrom: 2,       // older revisions >= this need no data change (identity hop)
  kind: 'canon' | 'generated' | 'hybrid' | 'rulebook',
  title: 'Cyoria',
  sourceSnapshot: {hash, locator},        // canon: deep-dive snapshot; generated: none
  generator: {id, version, receipt},      // generated packs only (P9P3c)
  attribution: {source, licence, notice}, // MC5-3; licence tier enum, 'private-research' refuses (MC5-6)
  requires: {features: [], packs: [{id, minRevision}], ruleProfile: 'profile id' | undefined},
  provides: {ruleProfiles: [...]},        // rulebook packs (P9P5)
  budgets: {entities, drawsPerEntity, saveBytes, presenceQueryMicros},
  entryArea: 'book.mol.area.station',
  retired: [{id, since}],                 // IDs never reused (IS1, WP6)
  content: {catalog, areas, institutions, cohorts, people, relationships,
            exceptions, slots, secrets, crossings},
  native: { /* optional schema-2 structured pack */ }
}
```

Validation is in two tiers (P9P2d):

- **Fatal → whole pack dormant:** wrong format/version, bad header, missing
  attribution or a refused licence, undeclared budgets, non-integer numbers
  (IS2), missing pack-level feature, missing or dormant dependency, dependency
  cycle, namespace overlap with another pack.
- **Local → only that record dormant:** bad record shape, ID outside the
  namespace, duplicate ID, reuse of a retired ID, a dangling reference (a route
  to a missing area, a cohort in an unknown house), a missing per-area feature,
  an unsupported slot kind or absent generator, sealed text in player-facing
  fields. Dormancy cascades to a fixpoint: a cohort whose slot is dormant
  goes dormant, then its members, then edges to them.

**Honest coverage (CX6, WP4).** Each area declares `background`,
`inspectable` or `playable`. The loader computes the effective level: a
playable area must answer a useful verb (`activities` non-empty) and hold at
least one person (named, cohort or population slot). Failing that, it is
downgraded to inspectable with a diagnostic. A route whose target is not
effectively playable is dormant: no travel button leads to a lock that is
really unfinished content. Reachability from `entryArea` is reported.

**Fingerprint (P9P2c).** `fingerprintWorldPack` hashes the pack with display
text keys (`label`, `title`, `name`, `description`, `notice`, `text`,
`summary`) stripped, through `gen_kit.hash64(address(...))`. A typo fix keeps
the fingerprint; a rule, slot or budget change does not.

## WPL3: per-pack save section and migration chain (WP8, WP9, P9P2b, P9P2g)

Implemented in `src/world_pack_save.js`. Proposed save key `world_packs`
(not written anywhere yet):

```js
world_packs: {schema: 1, sections: {
  'book.mol': {packId: 'book.mol', packRevision: 3, schema: 1, delta: {
    instances: {'book.mol.cyoria.main': {
      people: {[personId]: {frozen: {...shown fields}, rung: 'met' | 'known' | 'authored'}},
      edges: {[edgeKey]: {a, b, kind, source: 'play' | 'frozen'}},
      exceptions: [{id, personId, kind, placeId, start, end}],
      facts: {[factId]: scalar}
    }},
    retired: {[id]: {value, since, reason}}
  }}
}}
```

Rules:

- **Only the delta.** Catalog, cohorts and unmet people are never written
  (P9Y30.1–2). A generated student costs nothing until revealed.
- **Validator derived from the definition**, not a whole-save exact-schema
  assert (contrast `validateMolCampaignState`, P9Y1).
- **Revision pinning.** Save revision = pack revision: validate. Save older:
  walk the migration chain one revision at a time. A registered step
  (`registry.register({packId, from, to, migrate})`) runs if present; otherwise
  an identity hop is allowed only when `from >= saveCompatibleFrom`. A gap fails
  that section dormant with the original kept. Save newer than the pack:
  refuse with a plain message, keep the section verbatim, never downgrade.
- **Missing pack:** the section is carried verbatim and marked dormant (IS8).
- **Retired content:** delta entries naming an ID the current revision no
  longer defines move to `delta.retired` with `since` and a reason; nothing is
  deleted (P9P2g).
- **Seen beats revised:** a person view is base record ⊕ `frozen`. Unseen
  people take the new revision; seen fields keep their frozen value unless a
  migration (a retcon, CG9) rewrites them.
- **Instance isolation (P9P2f):** everything is keyed by instance. Two
  instances of one pack never share people, edges or facts, even with equal
  names, because draws and deltas both carry `instanceId`.

## WPL4: rule profiles through rule_modules and its lock (P9P5)

The loader never resolves a check. It resolves **which modules apply** and asks
the rule owner for a lock:

1. A pack names `requires.ruleProfile`. A profile is provided by the same pack
   or by a pack in its transitive `requires.packs`; otherwise the pack's rule
   profile is unresolved (dormant).
2. A profile is `{id, extends?, resolver, growthUnit, scaleClass,
   directorPolicy, modules, rulings}`. `extends` gives the multiverse case: a
   parent profile's modules sit at lower layers and the child's must not rank
   below the parent's highest layer (core → world → region → actor → director).
3. Each module carries a ruling status (MC5-1). Only `supported` modules enter
   the lock; `needs_ruling` and `unsupported` stay dormant and are listed.
4. The lock comes from an injected adapter `{createRuleLock(modules)}`. In the
   runtime that adapter is `rule_modules.createRuleLock` (currently on
   `codex/gameplay-foundations`, not on master). The resolver id must appear
   in available features as `resolver:<id>`. Missing adapter or resolver →
   profile `dormant`, pack otherwise active, and the world keeps its current
   behavior (EC5, WP12). This is how the unmerged R1/R2 branches stay optional.
5. No profile declared → status `none`, current behavior.
6. **Crossings (P9P5d):** a crossing to another pack needs a declared rule; if
   the two profiles' scale classes differ it also needs a `scaleRule`. Else
   the crossing is dormant.

## WPL5: generator slots through gen_kit with scoped addresses (P9P4, WP10)

Implemented in `src/world_pack_population.js`.

- Every draw uses `slotKey(packId, instanceId, scope, slot)` =
  `gen_kit.address('world-pack', {pack, instance, scope, slot})`, drawn with
  `drawU32(root, key)`. That is GR2's `hash(root, pack, instance, scope,
  slot)`. Adding a cohort to one pack never reshuffles another pack, another
  instance or another cohort.
- Table revision is part of the scope (GR10), so a table update changes only
  unseen people; seen ones are frozen (WPL3).
- Picks use `gen_kit.pickWeighted` with integer weights and receipts (GR9).
- **Budgets (CX5, GR11):** each slot declares `maxEntities` and
  `maxDrawsPerEntity`; the pack declares `budgets.entities`. Validation fails
  a slot whose cohorts exceed it, and a draw ledger throws at runtime if a
  member uses more draws than declared.
- Slot kinds accepted now: `cohort_members`. Declared but dormant until their
  generator exists: `minor_site`, `material_variant`, `recipe`, `storylet`,
  `micro_detail`. A slot also names its generator; an absent
  `generator:<id>` feature makes it dormant (WP12).

**Population (P9Q2–P9Q4):** institution → cohort → named canon person →
generated member → save rung. Cohort members are addresses
`${cohortId}.m${n}`, generated lazily on first query, never ticked. Presence is
a pure query (P9Q3): term calendar, then the cohort timetable block, then the
house dorm or commons default, then exceptions. Exception priority (P9Q44):
canon event 50 > quest 40 > illness 30 > detention 20 > club 10, ties by ID,
so any panel asking at the same minute gets the same answer (P9Q43).
Relationships are sparse (P9Q4): explicit pack or save edges first, then
derived classmate / housemate / clubmate, which freeze into the save once
relied on.

## WPL6: a generated world becomes a pack (P9P3, WORLD_SEEDS W1–W4)

Not implemented in this slice; the format is ready for it.

1. At admission, the world generator (P10 owner) runs under
   `gen_kit.withRetries` with the root's admission namespace (W2) and emits a
   `kind: 'generated'` manifest with `generator: {id, version, receipt}` and
   resolved profile, laws, calendar, institutions and slots as ordinary content.
2. **Admission validity (W4, P9P3b)** runs `validateWorldPack` plus world
   checks: each law has a resolver (rule-profile status `active`), each
   institution has a teacher slot or person, routes connect from the entry,
   at least one ordinary livelihood activity exists. Failure retries; after the
   cap, the named authored fallback is admitted. A broken world is never admitted.
3. The resolved manifest is stored with its receipt (W2, P9Q36: profile is
   consequential, so it is stored, not regenerated). Generator updates never
   rewrite it (P9P3c); a new generator version only affects new admissions.
4. **Hybrid packs (P9P3d):** a canon pack declares `slots` whose inputs include
   canon facts; canon people and landmarks are fixed records, never slot output.

Storage note: generated manifests belong in the save (they are the world), so
their size counts against the save budget, not the bundle. That needs the
save owner's decision when wired.

## WPL7: how MoL migrates onto the loader later

MoL today: six files, `state.schema === 11`, an exact field list and nine
residents asserted in `validateMolCampaignState`. Proposed path, each step
owner-checked and separately authorized:

1. **Catalog first, no save change.** Write `book.mol` as a world pack with
   `kind: 'canon'`, catalog, the seven current locations as areas, the nine
   residents as named people, `sourceSnapshot` = `MOL_SOURCE_SNAPSHOT`.
   The existing module keeps running; the pack only feeds an inspector.
2. **Native block.** Move MoL actions and people into the pack's `native`
   schema-2 block, compiled by `compileStructuredPack`. IDs stay `book.mol.*`
   (IS1), so nothing in old saves is renamed.
3. **Save migration.** A one-way migration lifts MoL's per-world campaign state
   into `world_packs.sections['book.mol']` at `packRevision: 1`, keeping the old
   block in `retired_content` until a later decision. `validateMolCampaignState`
   becomes the pack's derived section validator plus MoL's signature hooks
   (WP3: the loop rules stay a small module, not core state).
4. **Then widen:** Cyoria academy cohorts and the full named student body as
   data, presence by query.

## WPL8: smallest playable wiring step and its owners

**Proposed next step (WPL8a):** a debug-gated "Test school" visit through the
existing `content_packs` optional-pack path, read-only:

- `loadContentPacks` dispatch arm for `format: 'yairpg.world-pack'`, calling
  `loadWorldPacks` on bundled packs (no runtime fetch, P9P6b).
- One panel at 1366×768: pick an area, list who is there now (presence query
  over a few hundred students), click a person to "meet" them (freezes a
  `world_packs` section entry), save, reload, import, and see the same person
  in the same place with the same frozen details.
- Player notices for dormant packs/areas use `playerNotices`, never author
  diagnostics.

Owners: `src/main.js`, save files and `dist/` belong to Foundation R15 (II26).
`content_packs.js` is shared and read-only to this lane. The wiring therefore
needs (a) Weibao's go-ahead, (b) an owner check with the Foundation/save owner
for the new `world_packs` save key and its compatibility decision (absent key
= empty, old saves inert per EC5), and (c) one writer for the dispatch arm.

## WPL9: deferral register for this lane (CX8)

| Deferred | Reopen when |
| --- | --- |
| Lazy catalog loading (WP11, P9P6e) | Two or more real packs are bundled and memory is measured; keep behind `loadWorldPacks` |
| Pack diff tool (P9P6c) | First real revision bump with an affected save |
| User/mod packs (P9P6d) | A request to load packs not bundled with the game |
| Generated-world admission (WPL6) | The P10 original-world factory has a consumer slice |
| Non-cohort slot kinds | Their generator owner lands with a reader (GR12) |
| Read-only inspector UI (WP14, P9Q46) | The WPL8a wiring exists |
| Real rule lock (WPL4) | `codex/gameplay-foundations` rule_modules reaches master |

## WPL10: what the slice implements

| File | Covers |
| --- | --- |
| `src/world_pack_manifest.js` | Manifest and record validation, namespaced IDs, retired-ID reuse, attribution/licence, ruling status, budgets, integer-only data, sealed-text lint, fingerprint |
| `src/world_pack_loader.js` | Dependency order with cycle detection and ID tie-break, feature gating, reference integrity with cascading dormancy, honest coverage, rule profile resolution through an injected lock adapter, crossings, author report, player notices |
| `src/world_pack_population.js` | Scoped slot keys, generated cohort members with draw ledger and budgets, query-time presence with prioritized exceptions, sparse relationships |
| `src/world_pack_save.js` | Section shape, derived validator, migration registry and chain, revision pinning, missing-pack dormancy, retired IDs, seen-beats-revised freezing |
| `tests/world_pack_school_fixture.js` | Synthetic test-school pack, a rulebook pack and a fake lock adapter |
| `tests/world_pack*.test.js` | Proofs, including a load-budget test (WP15, P9Q45) |
