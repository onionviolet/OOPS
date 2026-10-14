# Small touches palette

All 30 rows are PROPOSALS, not accepted requirements. Paths are HoI4-relative under REPORT’s root. Original-world wording only; no designed secrets are exposed.

| ID | Touch | Source | Player or author consequence |
| --- | --- | --- | --- |
| H-T01 | Separate admission from current blocker | `common/decisions/_documentation.md:6` | Avoid an impossible option that merely looks purchasable. |
| H-T02 | Keep discovery visibility distinct | `common/decisions/_documentation.md:12` | A known locked option can explain a blocker without revealing unknown content. |
| H-T03 | Narrow targeted candidate scans | `common/decisions/_documentation.md:24` | Actor-local prefilters precede state/target checks. |
| H-T04 | Explicitly name event recipient | `documentation/effects_documentation.md:2943` | Retain who receives a delayed consequence. |
| H-T05 | Show delayed offer as pending | `events/Germany.txt:430` | A sent offer is not accepted diplomacy. |
| H-T06 | Retain refusal consequences | `events/Germany.txt:441` | A refused offer can still change a relationship or later route. |
| H-T07 | Keep MTTH different from deadline | `events/Germany.txt:702` | Do not promise a completion time for a stochastic event. |
| H-T08 | Separate hidden execution from hidden truth | `events/Germany.txt:10057` | Off-screen bookkeeping cannot publish undiscovered rules. |
| H-T09 | Record a local cooldown clock | `events/Germany.txt:489` | A temporary flag has a different lifetime than a permanent phase marker. |
| H-T10 | Make refresh policy visible | `documentation/effects_documentation.md:1153` | Renewal should explain whether duration changes or stacks. |
| H-T11 | Match removal target scope | `documentation/effects_documentation.md:5978` | Removing one local condition must not remove another actor’s version. |
| H-T12 | Use tier replacement for improvement | `common/scripted_effects/GER_scripted_effects.txt:3` | Replace a prior tier without accumulating all its effects. |
| H-T13 | Give an appointment a real carrier | `common/characters/GER.txt:62` | Keep identity separate from an occupied advisor role. |
| H-T14 | Expose known effect source | `common/dynamic_modifiers/0_dynamic_modifiers.txt:1` | A displayed modifier identifies a known institution or item. |
| H-T15 | Keep capability distinct from stock | `common/technologies/armor.txt:3` | Learning an output does not create free equipment. |
| H-T16 | Show output-family switch consequence | `common/defines/00_defines.lua:640` | A production change quote includes retained or lost familiarity. |
| H-T17 | Explain site slots before payment | `common/buildings/00_buildings.txt:56` | Shared capacity is different from a building level cap. |
| H-T18 | Keep repair distinct from replacement | `common/defines/00_defines.lua:751` | Work to repair an object does not silently replace its identity. |
| H-T19 | Tag bonus applicability | `common/national_focus/generic.txt:76` | A limited benefit explains which methods qualify before consumption. |
| H-T20 | Keep preview from spending benefits | `documentation/effects_documentation.md:2226` | Commit owns consumption; this is a proposed YAIRPG contract. |
| H-T21 | Explain practice track contributors | `common/doctrines/tracks/land_doctrine_tracks.txt:1` | Only declared activities advance a selected track. |
| H-T22 | Retract selected-method effects correctly | `common/doctrines/grand_doctrines/_documentation.md` | Avoid permanent bonus leakage after changing method. |
| H-T23 | Give NPC plans an abort reason | `common/ai_strategy_plans/GER_historical_strategy_plan.txt:1` | A lost premise produces a visible change of plan. |
| H-T24 | Separate preference from legality | `common/decisions/_generic_decisions.txt:103` | A high AI weight cannot bypass command permissions. |
| H-T25 | Do not reuse one control for stability and support | `common/defines/00_defines.lua:339` | Confidence and willingness to sustain conflict are distinct if the world models both. |
| H-T26 | Name a threshold crossing receipt | `common/bop/ITA.txt:15` | Reload cannot fire the same band-entry reward twice. |
| H-T27 | Show connected-but-short capacity | `common/defines/00_defines.lua:4263` | A valid route may still have a bottleneck. |
| H-T28 | Explain capture recovery delay | `common/defines/00_defines.lua:4350` | Capturing a facility need not mean immediate usable output. |
| H-T29 | Pin active content profile | `history/countries/GER - Germany.txt:103` | Optional-at-start is different from safe missing-content restore. |
| H-T30 | Lint write-before-test order | `common/on_actions/00_on_actions.txt:384` | Audit a guard against a flag already changed earlier in the effect. |
