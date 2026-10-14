# HoI4 aspect pass

HOI4's useful lesson is the separation of authored text, scoped state and legal effects. This pass extends the earlier rules dossier with all twelve aspect rows, a build-family inventory and three deeper reads: special projects, multi-phase operations and scripted UI/text. A01 is covered at event/reply structure level. A03 and A04 remain PARTIAL at native evaluator/serializer level.

2026-10-14. Lane `asp-hoi4`. Source research only. SHOWN means inspected bytes or measured declarations; STATED means shipped documentation/comments; INFERRED means interpretation. Every YAIRPG takeaway is a PROPOSAL. No native game, UI, save restoration or YAIRPG implementation was exercised.

Installed root: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV`. Source paths below are relative to it. Prior dossier reports Steam build 25205862; this pass separately checks manifest/build and hashes in TOOLING. Definitions include inactive, debug and DLC-gated content, not proof of ownership or reachability.

Full raw reference: `/Users/weiwei/.codex/research/asp-hoi4/extract/`. `raw/` retains 5,644 selected text files, including all captured English text, conditions, events, GUI definitions, rules and author docs. `english_localisation.jsonl` retains 129,197 unique parsed keys with full text and source lines; `events-index.jsonl` retains 6,974 event bodies, repeated options and conditions. This directory is outside git. No source prose is copied into these public reports.

## Ranked PROPOSALS

These extend existing owners. They are research proposals, not accepted gameplay or implementation orders. One realm and one prestige layer remain the first milestone; canon-first priority, broad reasonable options and repeatable solo play remain in force. No fixed account-wide once limits. Desktop/laptop first; mobile deferred.

| Rank | Proposal | Owner | Future observable gate |
| --- | --- | --- | --- |
| 1 / P1 | Retain experiment learning separately from setup and repeatable trials | Modular production chains; existing skill/world work owners | Useful paid output survives cancel/resume and import; same instance never pays twice. |
| 2 / P2 | Compose an expedition from legal access, task and return phases | Characters/world events; existing simulation/jobs | Changed route or target invalidates plans; conserved means; personal risk differs from task success. |
| 3 / P3 | Project scoped text and effect summaries from actual known state | Thematic UI; knowledge and legal-command owners | Desktop 1366x768; stale button rechecks legality; repaint reveals no truth or RNG. |
| 4 / P4 | Make message reply and institution aftermath distinct durable steps | Characters/world events; storylet owner | Accept/refuse/defer all lead to supported later state across reload/import. |
| 5 / P5 | Use theme history to vary repeated experiment reports | Procedural story/content; selected world owner | Suppression changes eligible flavor weights without a guaranteed drop or lifetime action cap. |
| 6 / P6 | Report skipped persistence cases separately from passing tests | Engine saves/scale; save_files and compatibility owners | Missing fixture/token yields an explicit unverified case, not roundtrip proof. |
| 7 / P7 | Teach one useful action with a state-based contextual hint | Thematic UI; current world opening | The real predicate becomes true through natural play; label alone cannot close it. |
| 8 / P8 | Give condition and phase fields explicit units and edge semantics | Generation foundation rules; existing content validation | Min/max, deadline, cancel and absent-actor cases are checked against chosen behavior. |

## Confirm, correct or extend prior pass

| ID | Prior claim/area | Result |
| --- | --- | --- |
| C1 | Campaign census | CONFIRM: new event-body index has 6,974 definitions; earlier 11,547 direct options retained, not counted from nested dispatches. |
| C2 | SAVE_SHAPE old fixture evidence | CORRECT: pinned tests/parse.rs also names a 1.17 binary fixture; it is not only 1.10. Tests silently return early without tokens, so even a green run would need skip accounting. No tests run here. |
| C3 | Save version opaque | EXTEND: installed NGame declares major 33 and minor 0. Actual migration and compatibility remain unverified. |
| C4 | Narrative/dialogue | EXTEND: event ID to localization/options/effects and separate operative portrait fields traced; no broad personal conversation or relationship simulator established. |
| C5 | Research depth | EXTEND: experiments retain different progress by phase and choose prototype rewards. Do not flatten experiments into technology unlock duration. |
| C6 | Scripted UI performance | EXTEND: shipped docs specify dirty variables, dynamic lists and AI button budgets. No benchmark or native UI proof. |
| C7 | Province War fit | PRESERVE: ../PROVINCE_WAR_FIT.md owns packet routing. This pass supplies extra source detail without changing LOG01/CUSTOM01/ERA01 selection or registering owners. |
| C8 | Author docs authoritative | QUALIFY: older project design doc differs from current per-database docs/content; prototype interval notation itself conflicts with its prose. Native boundary evidence remains needed. |

See [ASPECTS](ASPECTS.md), [inventory](SYSTEM_INVENTORY.md), [deeper systems](DEEPER_SYSTEMS.md), [save/architecture evidence](SAVE_AND_ARCHITECTURE.md), [packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [tooling](TOOLING.md) and [checkpoint](CHECKPOINT.md). Bulk reference is outside git at the path above because this lane may write only its assigned output folder. Personal saves and installs were untouched. No gameplay, owner registration, test/build, commit or push was performed.
