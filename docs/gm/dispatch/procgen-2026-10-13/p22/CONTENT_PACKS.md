# K3 and F2 extensions: versioned per-world content packs

2026-10-14. **PROPOSAL ONLY.** No schema or loader is changed. Extends [root K3/F2](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md). Reuse [P9 profile contract](../p9/PROFILE_RULES.md), [P10 profiles](../p10/REPORT.md), [P7 people reservations](../p7/GUIDELINES.md), [P11 context](../p11/CONTEXT.md) and [P15 A3/A7](../p15/AUTHORING_PIPELINE.md). Pack lifecycle packages their content; it does not create another story/people/history owner.

## K3.1: extend the actual existing formats

| Evidence | Shown/SOURCE | Implication |
|---|---|---|
| Private loader | `src/content_packs.js:88-99` reads `private_packs/manifest.json`; missing files can be skipped; schema 2 goes through a structured callback | A pack door exists. It is not a general generated-story lock/resolver. Keep optional source packs unbundled. |
| Simple pack | `src/content_packs.js:55-74,101-106` validates schema-1 activities/values and requires world/location compatibility on entry | No immutable revision/hash binding on every simple-pack generated object is shown here. Do not assume F2 already holds. |
| Registration and absence | `src/content_packs.js:137-186` retains owned native records/provenance and parks unavailable content | Preserve those owners. This parked-state policy differs from active structured beginnings. |
| Structured beginning | `src/structured_pack_state.js:4-34`; `src/structured_pack_runtime.js:41-45,77-81` retain revision, content hash, snapshot hash, seed, selected start and instance | Reuse exact binding semantics. They cover a beginning, not all future cards/threads across several switchable packs. |
| Compiler | `src/structured_pack_definitions.js:32-43,118-139,149-157` validates namespaced definitions, references, bootstrap and collisions before merge | New narrative metadata needs a sidecar/compiler adapter. Adding invented properties does not make old validation enforce them. |

**R22.1, contradiction:** [E6 section 12](../../../../emergent/E6_LORE_LAYER.md#12-book-world-packs) describes broadly skipping missing cards while reading saved lines. Current structured state requires exact beginning bytes and preserves the blocked character. Proposed policy below distinguishes historical presentation from active execution; it cannot replace current behavior without compatibility work.

## K3.2: pack identity and lock

Illustrative metadata sidecar, not the current schema-1 or schema-2 `pack.json`:

```json
{
  "format": "yairpg-narrative-pack-metadata",
  "formatRevision": 1,
  "packId": "fixture.local_departures",
  "contentRevision": 1,
  "worldProfileRef": "fixture.original_local@1",
  "continuityRef": "original@1",
  "sourceSnapshotRef": null,
  "lawRevisionRef": "fixture.original_local.laws@1",
  "generatorRevisionRef": "fixture.local_deck@1",
  "privacy": "public_original",
  "dependencies": [],
  "conflicts": [],
  "entryRefs": ["fixture.departure", "fixture.return_contact"],
  "attributionRefs": ["project.upstream_license"],
  "migrationRefs": []
}
```

The compiler produces the canonical metadata+payload digest and a lock entry with exact dependency revisions/hashes, compiler identity, resolved overlays and selected world-instance/era scope. Use numerical content revision for compatibility and optional display version for humans; a marketing version is not the lock. Source cutoff, world-law revision, generator revision and pack revision are separate axes. Public original packs, direct source recreation in local private packs, personal drafts and test fixtures retain distinct privacy/provenance classes. Never hash a raw novel library into the distributable pack or include its prose.

Lock the dependency closure when a world/pack is admitted. Each generated object/occurrence keeps its authoritative owner ID, pack lock reference, definition ID/revision, generator/table/text revisions as applicable, world/instance, cause/ordinal, cast bindings, realized text/effects/terms and draw receipt or its durable ref. Preserve actual resolved data as well as seed. An aggregate lock does not replace object provenance, and a hash cannot reconstruct an unavailable artifact. Existing runtime owners retain their own records; P22 adds shared provenance, not a giant duplicate state store.

A pack can include cards, person templates, authored place references, thread definitions, original dialogue and text grammar. It must declare supported adapter capabilities and cannot manufacture a new opcode, canon location, unique actor or world law just by naming one. P20 owns place state and authored geography remains protected. P13 owns explicit canon/AU overlays with keyed changes; never append incompatible rosters because both packs installed successfully.

## K3.3: enable, disable, change and resume

| Situation | Proposed disposition |
|---|---|
| Enable in a fresh world | Validate lock, dependencies, reservations, source scope and supported adapters before atomic registration/enrollment. Installing definitions alone grants no means, relationships, knowledge or rewards. |
| Enable later in an existing world | An explicit compatible future-admission policy can add new opportunities from the current boundary; never invent earlier history. Existing commitments stay pinned. |
| Disable future generation | Stop new admissions from that pack. Keep active occurrences, obligations, custody, people and retained history under their exact dependencies until settlement or declared dormant policy. No automatic deletion or refund invented by the toggle. |
| Disable a dependency | Explain the dependent admissions affected. Apply a complete validated plan or refuse the change; never partially unregister an active item's resolver. |
| Update to revision 2 | Future admissions may use a new lock after validation. Old generated instances and paid commitments retain revision 1. Keep both artifacts if execution requires both. Do not switch the global definition Map under a live job. |
| Correct realized text | New occurrences use corrected grammar. A reviewed display-only erratum may annotate older text while retaining original and mechanical identity. Any change to terms/effects needs a migration, not a spelling-fix label. |
| Missing exact content | Known historical display may use safe retained text or placeholders according to its privacy owner. Executable commitments needing absent bytes stay preserved/dormant; stop before mutation. No automatic fallback outcome, redraw, substitute actor or award. |
| Conflicting world/continuity/law packs | Keep both available as separate eligible world instances or named overlays when supported. Do not blend contradictory rules. A new profile adapter may make a legitimate combination reachable later. |
| Downgrade / unsupported import | Validate before storage writes. Explain required lock with safe IDs; preserve the original file/state. Migration needs declared old/new hashes, affected owners and replay/persistence checks. |

Disabling a pack is a preference about future content, not erasing things the world already made. Archiving a chronicle and preserving playable state remain distinct under P14/timeline owners. Storage retention bounds are technical policy, never fixed once limits on future jobs or rare content. New valid causes can repeat under world-local abundant, scarce, recurring, seasonal or unique-source rules.

## K3.4: canon and publication boundary

P9 per-world files define scope and source gaps. HP/D&D/book profiles can retain separate editions, TTKS books retain distinct source sets, MoL/Perfect Run/regression profiles need distinct reset contracts, LOTM and COI stay separately scoped, and serial worlds retain their reviewed cutoff. These are profile routing constraints, not P22 independently verified franchise mechanics. [P10](../p10/REPORT.md) similarly prevents mixing Fate/FMA continuities. Reincarnation Paradise's current world owners must supply its profile binding rather than assuming a missing P9 filename is evidence against availability.

Source rows carry SHOWN/STATED/INFERRED/UNKNOWN plus quality, creator/work/version/locator/speaker and contradiction refs. An AU explicitly changes named facts, never quietly turns an inference into canon. E6's proposed fixed-fact immunity cannot override accepted causal divergence when a relevant cause genuinely changes; P13 and timeline owners decide the qualified policy.

Public artifacts contain original definitions/synthetic tests and attribution. Direct recreation stays local private/unbundled under PROJECT, and sealed truth stays in its designated owner. A safe pack catalogue cannot expose a restricted answer in a title, dependency name, error, content preview or hash-derived filename. No private save export is used to build or distribute packs.

## K3.5: future acceptance cases

All NOT RUN: revision-1 pending event survives revision-2 installation unchanged; new supported event identifies revision 2; disable prevents only new admission; dependency conflicts reject atomically; missing pack preserves dormant commitment; exact artifact restoration resumes it; source/law/cutoff mismatch never redraws people/truth; old absent owner stays absent; failed write publishes nothing; Save/reload/Export/literal-file Import retains lock and next draws. Test normal and director envelopes separately. Native evidence at 1366x768 and 1600x1000 must show a safe revision/status and a real changed consequence. Root must choose the compatibility seam before any implementation; these fields are not a reserved save schema.
