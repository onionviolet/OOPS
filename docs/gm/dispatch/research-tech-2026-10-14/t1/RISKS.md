# T1 ownership and save risks

2026-10-14. Read-only findings; these do not reserve source or launch work.
Statuses below describe inspected files, not a live-authority transfer. T1 owns
only this directory. The main checkout already had dirty PROJECT/USER_VISION,
bundle/index and other lanes' documents at entry. T1 preserved them.

## C8. In-flight overlaps

`docs/gm/dispatch/*/` STATUS/CHECKPOINT files were searched, including nested
lane checkpoints. Where a dispatch has no root STATUS/CHECKPOINT, its named
run/goal surface is the next authority to recover, not evidence of release.

| Owner/lane as recorded | Observed state | Overlapping source or proposed seam | Consequence |
|---|---|---|---|
| Foundation R15 integrator, main checkout | Active root integration; G4 landed, G10 later landed during this audit | `main.js`, simulation validation/publication, audited workshops, learning/lens/materials, home furnishings, save joins, shared bundle | No source release to T1. Re-read exact current head and reservations before any C1–C5 implementation. `docs/gm/dispatch/foundation-adoption-next-2026-10-13/CHECKPOINT.md:41`, `:49`, `:53` |
| World1 campaign W1, separate worktree | Later human instruction lifted pause; run then ended incomplete, branch integration blocked by dirty authority docs | Private world/content, shared adapters and material/knowledge consumers | Do not assume the older paused summary or an ended worker means code is released. No private payload installation follows. Same checkpoint `:35`, `:47`, `:51`; older paused checkpoint `docs/gm/dispatch/world1-full-completion-2026-10-11/CHECKPOINT.md:3` is historical relative to that instruction |
| Procgen P1–P4 and integration root | STATUS lists P1–P3 running and P4 done; root combining on `proc/wave1-integration` | Generated materials/resources, native recipes/inventory, shared integration; P24 knowledge/perspectives, CR1–CR4 crafting design | C1/C2 craft evidence and C3 sample meaning overlap. Docs lanes are research owners, not source reservations. `docs/gm/dispatch/procgen-2026-10-13/STATUS.md:5`, `:28`, `:42` |
| Research/technology T2–T4 | Active docs-only world, reference-game and history lanes | World qualification, RV/RQ/RF/BS/TM design owners; no source writes | Keep C1–C5 original and source-fit only; world mechanisms wait for T2 qualification. T1 does not rewrite the owner palette. `docs/gm/dispatch/research-tech-2026-10-14/t2/CHECKPOINT.md:3`, `t3/CHECKPOINT.md:7`, `t4/CHECKPOINT.md:3` |
| UI/cheat-status and Vivid/Proto23 | Vivid checkpoint says completed/workers released; R15 records CH1 integrated. Additional audit run files exist | Notebook tabs, discovery, `display.js`, `main.js`, workspace and Bestiary presentation | Historical completion is not a new reservation. Coordinate C1/C4/C5 panel changes with current UI integrator. `docs/gm/dispatch/vivid-proto23-flow-2026-10-13/CHECKPOINT.md:16`, `:20`; Foundation checkpoint `:45`; `docs/gm/dispatch/cheat-status-window-2026-10-13/runs/SESSIONS.md` |
| Nonhuman engine/senses design | Engine checkpoint COMPLETE as proposal | Supported body/senses, source and instrument means; proposed future schema allocation | Do not universalize current two-hand human checks or claim proposal schemas are allocated. `docs/gm/dispatch/nonhuman-starts-2026-10-14/engine/CHECKPOINT.md:3`, `:22` |
| Derived snapshot/offline audit | Offline lane COMPLETE read-only; prototype assignment in separate start-records worktree | Endpoint/branch/clock identity and future retention policy | C1–C5 add no offline timer or branch evidence sharing. `docs/gm/dispatch/derived-snapshots-2026-10-14/offline/CHECKPOINT.md:3`; `docs/gm/dispatch/derived-snapshots-2026-10-14/GOAL.md:11` |
| Absorb-all work | No root STATUS/CHECKPOINT found; run and report surfaces exist | Workshop/field familiarity, repeat search, reveal, known details, save-time/host joins | Owner identity/release remains unresolved from requested status surfaces. Recover `docs/gm/dispatch/absorb-all-2026-10-14/runs/SESSIONS.md` and exact task prompt before claiming any shared seam free |

Process inspection showed concurrent Claude/Codex activity. It did not establish
which actual session owns each proposed source path. T1 neither stopped a worker
nor requested a transfer. Current head changed during the audit: do not treat
an initial branch status as a frozen build. The source locators were structurally
checked at delivery; they still require semantic refresh before implementation.

## Save and meaning hazards

| Code | Risk, source evidence | Smallest required resolution |
|---|---|---|
| C9 | K stores the latest equal/higher-stage account, not a trial history (`src/simulation_effects.js:281`) | Keep consumer-relevant evidence in a separately validated optional owner. Do not add new stages such as “disproved” to the existing three-stage enum without a compatibility decision |
| C10 | Native craft and expansion publication have different mutation/rollback boundaries (`src/main.js:4136`, `src/expansion_persistence.js:7`) | Commit craft output/XP and its rider/evidence atomically. Storage failure must not leave a successful craft with unsaved progress, or progress without the craft. An event-feed render hook is not settlement |
| C11 | Expansion schema 11 has admitted owner predicates; generic migration applies only to old 1–4 (`src/expansion_engine.js:141`, `:256`, `:267`) | Allocate the new reader/version with integrator; wire load, validator, import and publication. Absent domain is inert; malformed/present-unsupported domain rejects while preserving original. Never invent old evidence from XP/kills |
| C12 | Workshop validators bind exact effects, durations, source/cause order and stock (`src/audited_workshop_lesson.js:86`, `:174`; `src/world_completion_materials_facts.js:107`) | New content revision for new behavior. Keep frozen old jobs/receipts intact; no unreviewed edits to prior definitions or duration rewrites |
| C13 | Sample and body identity matter; measured strips carry production/maker provenance (`src/world_completion_materials_facts.js:47`, `:123`; `src/world_completion_strip.js:1`) | C5 measurements and C3 trials bind exact current sample/endpoint/revision. Historical reading survives but cannot silently certify a new sample or different world |
| C14 | Bestiary currently exposes template stats after eligible kills; observation channels are information-only and recipient-scoped (`src/display.js:5311`; `src/observation_channels.js:65`) | Preserve old Bestiary exposure unless explicitly redesigned. New partial notes expose only actual observations. Do not use NPC private knowledge, definitions, pending outcomes or catalogue counts as player evidence |
| C15 | Life record and feed are bounded/lossy (`src/life_record.js:41`; `src/event_feed.js:102`) | Neither owns prerequisites, unlocks or trial deduplication. Their views link to authoritative questions/findings; compaction cannot erase earned capability |
| C16 | Repeated evidence and arbitrary prose can grow saves; guarded storage budget is 4 MiB (`src/save_files.js:196`) | Compact redundant display evidence while preserving meaningful contexts/causes/counts. Validate bounds and storage failure. Limits manage storage or local authored supply, not fixed per-player “once” anti-abuse ceilings |
| C17 | A retained receipt is not a cross-life/world carrier; reset policy can delete actor knowledge (`src/simulation.js:573`, `src/heir_inheritance.js:1`) | Default new research to its actor/endpoint. Each later inheritance/branch/carrier feature needs its own compatibility and usefulness contract. No automatic multiverse science sharing |

## C18. Proof and scope risk

The “cheap” palette suggestions identify seams, not completed gameplay. C1
needs a durable question owner; C2 needs a native craft join; C3 needs authored
local rules and real outcomes; C4 needs an encounter hook; C5 needs a supported
numeric instrument and recipe consumer. T1 did not execute them.

Future acceptance stays with each selected slice: current rebuild, fresh test
origin, actual acquisition-to-use, 1366x768 evidence, old-save compatibility,
Save/reload and actual Export/literal Import, failed-publication and relevant
control cases. Human fiction/balance acceptance is separate. Historical source,
seeded native or 1600x1100 smoke evidence cannot stand in for those gates.
No mobile gates, compulsory food upkeep, new prestige/world breadth or fixed
exclusive research paths are introduced by these proposals.
