# Dwarf Fortress aspect backfill

Build 24557528 is unchanged from the prior intake. The installed executable hash and all 29 previously reviewed file hashes match. No further game install is needed for this readable-data pass. A selective private recapture replaces the lost old-Mac extraction: all 19 Lua/374 TXT files plus the executable, without saves, preferences or logs.

The largest extension is contextual text: all 64 supplied TEXT_SET files are now read. REA/Ghidra also recovered a text-loader body and two error-handler bodies; a fourth query has an unresolved switch. The dossier covers A01-A12 with explicit partial labels. It does not establish the whole dialogue engine, serializer, AI, tutorial or gameplay.

## Ranked PROPOSALS

| Code | Proposal | Owner system | Basis and scope |
|---|---|---|---|
| P1 | Context-aware speech from known facts | `docs/worlds/DIALOGUE_AND_INTERACTIONS.md` | A01 / D1: Typed speaker/listener/context snapshot; read-only original phrase variation; effects remain with paid action owner. |
| P2 | Route an event into log, alert and inspection | `docs/UI_RULES.md` | A02, A06 / D2: One durable event ID, knowledge-filtered projection and severity-dependent interruption. |
| P3 | Prefer grouped storage within real travel cost | `src/simulation.js` | A05 / D3: Only if a selected logistics slice needs it: compatible reachable capacity first, then bounded distance discount. |
| P4 | Separate recovery rotation from manual retention | `src/expansion_persistence.js` | A04: Optional bounded recovery ring, explicit manual checkpoint and useful failure reporting; retain existing save authority. |
| P5 | Validate content IDs and candidate weights | `docs/worlds/ABILITY_AUTHORING.md` | A03, A07, A08: Reject malformed references/weights before generation; preserve seed/order/provenance. |
| P6 | Give narrative leads honest location precision | `src/people_knowledge.js` | A01, A02: Known person, site and exact building remain distinct disclosures with provenance. |
| P7 | Use context ambience separately from event cues | `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md` | A11 / D2: Optional audio variation derives from state/events; visual information remains complete when muted. |

## Prior dossier reconciliation

| Finding | Disposition | Receipt |
|---|---|---|
| Retained build/file pins | Confirmed unchanged locally | ASPECTS.md F1; private prior-hash-comparison.json |
| Old retained private payload | Historical pointer only; original files reported lost | ASPECTS.md F2; new selective HASHES.txt |
| Native engine not read | Extended for four bounded static queries, one unresolved | SAVE_AND_NATIVE_DIGEST.md |
| Text/language/art unread | Full supplied vanilla_text layer read; language schema/counts only | ASPECTS.md F4; DEEPER_SYSTEMS.md D1 |
| Save recovery guidance | Extended with default controls and handlers, still no transaction proof | ASPECTS.md F5, A04 |
| Existing production/body/institution findings | Selected source hashes agree; not a fresh full semantic re-audit | Prior COVERAGE.json and this inventory |

## Deliverables and remaining gate

[ASPECTS.md](ASPECTS.md) and [ASPECTS.json](ASPECTS.json) own twelve rows; [SYSTEM_INVENTORY.md](SYSTEM_INVENTORY.md) inventories all found authoring groups plus 43 named subsystems/boundaries; [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md) expands the top three new reads. [SAVE_AND_NATIVE_DIGEST.md](SAVE_AND_NATIVE_DIGEST.md) preserves priority native limits. [TOOLING.md](TOOLING.md) and [CHECKPOINT.md](CHECKPOINT.md) make resumption mechanical.

Status PARTIAL with a complete unread table. Named next research choices are a native text-selector/substitution trace or serializer-success/migration trace; neither needs another game install. Runtime proof remains outside this lane because launching is prohibited. No source copying, canonical owner edit or implementation is authorized by these proposals. Province War may cite this shared research and apply its own admission review.
