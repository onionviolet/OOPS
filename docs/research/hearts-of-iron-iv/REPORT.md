# Hearts of Iron IV: authored rules and reusable patterns

2026-10-14. **Source research, PARTIAL. No gameplay implementation or runtime proof.**

HoI4's strongest fit is a campaign built from small, scoped rules: choose a long project, make local decisions, dispatch events to other actors, and retain the resulting flags, relations and modifiers. Its production model adds a second useful lesson: changing the output of a mature workshop has a cost beyond buying inputs. Both are PROPOSALS for YAIRPG, not new accepted requirements.

This pass reads Steam app 394360, installed build **25205862**, at `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV`. All HoI4 paths below are relative to that root. Installed definitions include DLC branches and debug entries; counts do not mean all content is enabled or reachable. The manifest establishes installed bytes, not DLC ownership or play acceptance. The actual YAIRPG branch read was `codex/gameplay-foundations`, despite the prompt's main-checkout shorthand. Existing dirty state was preserved.

**Evidence labels:** SHOWN = read source or measured structure; STATED = shipped docs or another owner's claim; INFERRED = interpretation or proposed adaptation. Engine constants are SHOWN; their comments are STATED. No source read proves native runtime execution.

## Ranked YAIRPG PROPOSALS

| Rank / ID | Proposal and useful player consequence | Existing owner / boundary |
| --- | --- | --- |
| 1 / H-P1 | Scoped campaign chain records: one local project can open a decision, send another actor an offer and retain acceptance/refusal and aftermath. Prevent a second payout for the same committed transition without banning later valid repetitions. | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, `docs/gm/WORLD_IMPLEMENTATION_RUN.md`; `src/simulation.js`, `src/storylet_deck.js`. AB2/AB6/AB7/AB10. |
| 2 / H-P2 | Per-world condition contracts: each adjective declares carrier, affected stat, magnitude source, expiry clock, refresh/stack policy and removal cause. A local institution's improving condition changes an actual job or route. | `docs/worlds/WORLD_CORE_KIT_2026-10-14.md`, `docs/ENGINE_EXPANSION.md`; existing simulation conditions and world-instance owners. AB1/AB8/AB12. |
| 3 / H-P3 | Workshop continuity: retain skill with a method or output family, explain the loss on a switch, and make alternate recipes useful. One existing Village production chain is the first candidate. | `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`, `docs/gm/dispatch/chain-build-2026-10-14/`; harvest/mixture/work-plan owners. No new universal crafting engine. |
| 4 / H-P4 | Three distinct gates for content: admission to this world/actor, discovery visibility, and current ability to act. Show current blockers without showing undiscovered truth. | `docs/RULES_FROM_SCRATCH.md`, `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`; simulation registry, knowledge and selectors. AB6/AB9/AB13. |
| 5 / H-P5 | Reusable authored campaign branches with explicit prerequisites, optional bypass and reversibility. Exclusivity comes from a fitting world's condition, not a permanent account-wide ban. | `docs/gm/world-implementation/IMPLEMENTATION_PLAN.md`, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md`. |
| 6 / H-P6 | Separate learned capability, equipped design and actual stock. A design unlock can open a paid job without upgrading existing objects for free. | `docs/ENGINE_EXPANSION.md`, modular-chain palette and current object/mixture/native adapters. AB7/AB11. |
| 7 / H-P7 | Practice tracks attached to selected methods: useful participation earns mastery; changing the method replaces its active effects while preserving declared learning. | Power/skill and world law owners, `docs/worlds/WORLD_CORE_KIT_2026-10-14.md`; not a new universal doctrine currency. |
| 8 / H-P8 | NPC plans with allowed/enable/abort predicates and declared priorities. An NPC can abandon an invalid objective and choose another legal one through the existing command owner. | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, `docs/ENGINE_EXPANSION.md`; AB3/AB6/AB13. |

Standing direction remains one realm and one prestige layer for the first milestone, canon-first world order, everything possible reasonably, no fixed solo-player once limits, and desktop/laptop first. For a future UI packet, target 1366x768 and 1600x1000; show current project, conditions, blockers and consequence beside the action. Mobile optimization is deferred. Research does not add UI proof gates to the present doc-only task.

## Corpus measurement

SHOWN: a comment-aware brace/token scanner counted declaration positions, not text hits. Raw census and hashes are in `~/.codex/research/hoi4/extract/`; [FINDINGS.json](FINDINGS.json) carries public aggregates. `common/` rules, `events/`, `history/`, relevant `documentation/`, `interface/` and DLC metadata yielded **5,393 hashed files**. This is not a total game-file count.

| Family | Declared count | Scope / caveat |
| --- | ---: | --- |
| Focus trees | 67 | In 81 national-focus text files |
| Focus nodes | 10,333 | Direct children of focus_tree blocks |
| Shared focus nodes | 335 | Top-level shared_focus blocks; references are separate |
| Event definitions | 6,974 | 6,251 country, 677 news, 33 unit-leader, 7 operative-leader, 6 state |
| Triggered-only / hidden / MTTH events | 6,565 / 184 / 375 | Overlapping attributes, not partitions |
| Event options | 11,547 | Direct option blocks |
| Decisions including missions | 4,148 | Direct nested blocks in non-category decision files; debug included |
| Decisions with mission timeout / timed removal | 443 / 2,124 | Attributes can overlap |
| Decision category definitions | 597 | 705 category contribution blocks in decision bodies |
| Scripted effects / triggers | 1,542 / 926 | Top-level macro definitions |
| On-action hook contributions | 337 | 117 distinct hook names across 17 files |
| Ideas / dynamic modifiers | 6,508 / 679 | Definition blocks; no active-instance or stacking claim |
| Technologies / AI strategy plans | 552 / 376 | 13 / 128 files respectively |
| Characters | 5,404 | Includes inactive or gated entries; not advisor count |
| Doctrine definitions | 125 | 4 folders, 12 grand doctrines, 14 tracks, 95 subdoctrines |

No duplicate event IDs or decision IDs were found by this census. That does not prove no semantic collisions or bad references. A “chain” is not a distinct declaration type: one path can span many focuses, effects and events, so these counts are not a count of independent campaign stories.

## Confirm, correct or extend prior work

| ID | Prior owner | Disposition from this pass |
| --- | --- | --- |
| H-C1 | Province War `HOI4_UI_ADAPTATION_20260930.md` | EXTEND: exact installed tech, equipment and construction fields now support the earlier research/queue workspace proposal. No current HoI4 UI behavior was played or copied; prior aesthetic gates remain open. |
| H-C2 | Province War `SIMILAR_GAME_CANDIDATES_AUDIT.md`, SG02 | CONFIRM SOURCE FAMILY: NSupply defines expose rail/hub flow, motorization, capture cooldown and train requirements. They do not update the older audit's Province War runtime findings. LOG01 remains a deferred extension. |
| H-C3 | YAIRPG abstraction inventory ER18 | EXTEND: campaign dispatch, conditions and gate separation fit existing AB2/6/7/8/9/10/12/13 owners. Do not infer a new global engine from repeated script blocks. |
| H-C4 | Chain-build T2/T3 and modular-chain palette | EXTEND: HoI4 distinguishes design, equipment stock, production and target-template roles. Its output-family continuity can inform an existing job; inspector proposals read retained receipts, not rerun hidden resolution. T2's proposed source file was absent in this checkout when read. |
| H-C5 | Older doctrine/research assumptions | CORRECT: this installed build has `common/doctrines/` grand/subdoctrine/mastery data. A legacy research-tree account is not a complete description of this install. |
| H-C6 | “Plain-text rules imply optional content safely drops from saves” | NOT ESTABLISHED: DLC-gated starting-history branches and metadata are shown; arbitrary DLC/mod removal from an existing save is unverified. |

## Read next

[Chains](CHAINS_DIGEST.md), [modifiers](MODIFIERS_DIGEST.md), [economy](ECONOMY_DIGEST.md), [research](RESEARCH_DIGEST.md), [politics and AI](POLITICS_AI_DIGEST.md), [DLC gates](DLC_COVERAGE.md), [source ledger](SOURCE_LEDGER.md), [save limits](SAVE_SHAPE.md), [Province War packet fit](PROVINCE_WAR_FIT.md), [implementation proposals](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [reproduction](TOOLING.md), [checkpoint](CHECKPOINT.md).

Remaining gaps are named in CHECKPOINT. No source, tests, build, browser, save, commit, installation or owner registration changed beyond these research outputs.
