# G53-B11 source and reference audit

2026-10-14. Docs only. Source inspection, not runtime proof. Main branch
`codex/gameplay-foundations`, observed HEAD `8e0f1138`; working tree already
contained unrelated edits. P2 branch `proc/p2-mixing`, observed HEAD `f8fe6994`,
with dirty rebuilt bundles/index. No checkout, build, npm, stage or commit ran.
Line locators describe the inspected files, including dirty source and sibling
proposals. Recheck them before implementation.

Authority: [COMMON](../COMMON.md), [B11 assignment](../B11.md),
[PROJECT](../../../../../PROJECT.md),
[USER_VISION](../../../../USER_VISION.md),
[G52-G55](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md),
[prior integration](../../body-lineage-expansion-2026-10-11/INTEGRATION.md).
This extends G53/GD1-GD5; it does not select new global mechanics or reopen
paused Fallout development. [SPEC](SPEC.md) owns proposals and
[TEST_PLAN](TEST_PLAN.md) owns unrun acceptance cases.

## F1: body records and capability sources have different jobs

| Evidence, shown in inspected source | Implication for this spec |
|---|---|
| `src/body_progression.js:15-23` declares inherited Natural balance, trained Conditioned grip, acquired Palm mark and two hand conditions. `:33-49` uses explicit enrollment, practice, recovery and source acquisition. | This is a small earned-body loop, not the proposed B2 physical record or a genome. A G53 diagnostic must not call `body.begin` or award these sources. |
| `src/body_progression.js:55-58` clears soreness/scrapes through three minutes of rest; `:65-69` derives tender/callused/marked facts. | Reuse hand soreness for a local recovery consequence. Existing body.recover requires body enrollment, so B11 needs a clinic-rest adapter or played-time expiry. Rest does not remove a lasting genetic change or its history. |
| `src/body_progression.js:25-30,59-62` creates actual observer knowledge after a demonstration. | A clinic or craftsman learns only through its own evidence route. Modifying the player cannot update every NPC. |
| `src/capabilities.js:4-5,22-35` validates source kinds/origins and positive capability grants. `:39-66` is a pure query, filters expiry/faculties and combines by max/sum. | Use registered `trait` sources with origin `acquired`. No new genetic source kind is required. Negative consequences need conditions or action adapters, not negative capability grants. |
| `src/simulation_effects.js:321-333` grants by source definition ID using `||=`, creates faculty state, and removes source/faculty together. | Duplicate same-definition grants silently collapse. First slice binds one active edit per tendon archetype explicitly; it cannot rely on that guard for ownership or fictional limits. Reapplying after removal needs a fresh edit receipt. |
| `src/expedition_content.js:89-98` defines `frontier.pack`: base four minutes, existing lesson changes it to two, hand control subtracts one, tender hands add two, fee six. It also requires an unsurveyed crossing and no kit. | This is an actual comparison consumer. A test fixture must preserve those gates. Granting more carry does not prove faster native weightlifting. Existing trained grip already supplies the same max hand-control benefit. |

B2's [SPEC](../b2/SPEC.md), G24-B2.1-.3 and .5, owns one optional
`character.body_record`, physical versus person fields, card instances,
knowledge and source references. Its [MIGRATION](../b2/MIGRATION.md), M1/M5,
rejects unsupported revision/unknown keys and leaves genetics unassigned.
Therefore B11 needs an explicit B2 revision extension. Appending an unvalidated
`genes` blob to revision 1 would contradict that contract. B2 itself remains a
proposal, not an available runtime module.

## F2: acquisition supports custody, but ordinary materials lack donor identity

Search performed across `src/` for `sources[`, `acquire`, `graft`, `mutation`.
Results were inspected for real source/ownership consumers rather than counting
every occurrence of the programming word mutation.

| Evidence, shown | Implication |
|---|---|
| `src/acquisition.js:8-16,39-65` validates owned inventories, aggregates all debits against initial ownership, then applies transfers/consumption/grants to a clone. `:68-95` stages publication and writes inventory owners into the envelope. | Reuse the conservation model for sample purchase, processing, holding and consumption. Do not debit the same unit from two routes. |
| `src/acquisition.js:19-34` records item ID, quantity and quality extrema. | An acquisition log is not proof of a named donor, tissue freshness or chain of custody. |
| `src/items.js:230-250` builds ordinary inventory keys; `:488-497` gives usable items effects/recovery chances; `:1216-1218` begins reconstruction from ID/components/quality. `src/gameplay_transactions.js:27-33` checks a JSON key, ID/components and optional quality. | A biological lot reference requires a deliberate instance-key adapter and cross-reference validator. A valid JSON key alone cannot establish a sample. |
| `src/enemies.js:234-245` has Starving wolf rat and a Rat tail drop at chance .04. `src/items.js:1528-1532` defines the material; `:1498-1502` defines Glass phial. | A native raw source exists. Converting it into a stabilized template sample is new fictional alchemy. Old tails have unknown individual provenance; do not invent the exact rat or collection date. |
| `src/field_workshop.js:70-73` explicitly copies an observed method with a donor and costs. `src/backlog_expansion_replacement.js:70-74` separately grants a method source and checks active faculty/control. | Method copying and body copying are separate operations. No generic acquisition helper makes a tissue sample grant mastery. |
| `src/book_world_paradise_content.js:39` describes a retained source drop while foreign graft/learning is unselected. `src/feature_expansion_book_host.js:14` can return authoring-only status with empty grants/mutations. | These are not executable genetic modification APIs. No generic G53 command was found in the inspected consumers. This is a scoped search conclusion, not an exhaustive proof of absence. |

## F3: potion effects are temporary; P2 is a useful separate implementation

| Evidence, shown | Reuse and boundary |
|---|---|
| `src/crafting_recipes.js:20,80-83,105-139` defines alchemy item recipes, station/skill success and material counts. `:1892-1945` defines healing powders/juice/potion; `:1973-1983` defines sapping. | Reuse authored material/process patterns. Native success is not a seeded genetic outcome. The first clinic treatment stages its own complete retained result instead of adding another random roll to `use_recipe`. |
| `src/active_effects.js:5-34` holds duration, stats, tags and group priority; `:161-189,211-219` defines healing and sapping effects. `src/items.js:4295-4317` binds potion templates to timed effects. | These are not heritable faculties. Preserve medicine behavior. Do not encode a lasting body edit as a long-duration active effect. |
| `src/main.js:4665-4675` resolves ordinary use by template ID; `:4691-4695` uses `Math.random()` for recovered containers. `:4797-4833` resolves effect templates and group priority. | Genetic sample use must route to an explicit clinic handler with exact sample identity and held inputs. It must not fall through to ordinary `[use]`, bottle recovery RNG or group replacement. |
| `src/main.js:5147` saves active effects; `:6726-6731` reconstructs them from templates plus duration. `:7203-7217` expires them as time advances. | This path does not retain arbitrary generated edit payloads. Use simulation conditions for B11 soreness and an owned body/card ledger for the edit. |

P2 locators below are relative to the read-only
`.claude/worktrees/proc-p2-mixing/`, **not main `src/`**:

| P2 evidence, shown in worktree source | B11 treatment |
|---|---|
| `src/mixture_state.js:11-29` derives and retains ingredient-family profiles and hidden method from a local seed; `:31-45` validates them. | Preserve its already resolved truth. Its local seed helper is awaiting root/P1 integration, not a shared immutable RNG service B11 can assume exists. |
| `src/mixture_state.js:47-74` conserves fictional mass/fractions, derives dose and canonical product identity/key. `:75-79` projects observed versus untested properties. | Useful product identity and truth/knowledge split. An oral composition is not a genetic template or proof that it can rewrite a body. |
| `src/mixture_state.js:84-98` checks all-holder references and retained exposure payload/timing, including consumed products. | Retain samples/cards after consumption when edits reference them. Validate all holders and pending reservations. Do not garbage-collect a donor record merely because inventory count is zero. |
| `src/mixture_native.js:5-35` stages purchase, mixing, use, learned method, reservation, cancellation and settlement on cloned data; `:37-43` writes one validated envelope before publication. | Adopt this transaction pattern. Body, sources, sample ownership, knowledge, receipts and money must share the write. No two separately successful publishers. |
| `src/mixture_ui.js:3-21,23-38` places mixing in existing crafting/local actions and polls its job there. | Reuse the surface, not panel visibility as a scheduler. B11 pending treatment must advance under the authoritative game clock even when the clinic panel is closed. |

P2's [REPORT](../../../../../.claude/worktrees/proc-p2-mixing/docs/gm/dispatch/procgen-2026-10-13/p2/REPORT.md)
reports 16 focused tests, 637 full tests and rebuilt desktop/persistence journeys.
Those are **stated sibling evidence**, not rerun by B11. Its
[BACKLOG](../../../../../.claude/worktrees/proc-p2-mixing/docs/gm/dispatch/procgen-2026-10-13/p2/BACKLOG.md)
keeps seed integration, natural gathering and offline production open. P2 was
not merged or adopted by this task.

## F4: persistence and RNG must join before a playable claim

| Evidence, shown | Required seam |
|---|---|
| `src/expansion_engine.js:75-79,518-521` stores a mutable RNG cursor. `:536-562,569-583` checks expected sequence, clones, debits costs and freezes draws/effects in pending work. | Use durable cause identity and frozen outcomes. Current `state.rng` is not a recoverable historical immutable root, and a generic action draw would consume an unrelated stream. |
| `src/simulation.js:38-39,51,182-186` has further derived/mutable seeds. | Do not create a fourth campaign RNG from panel visits or wall time. See SPEC's explicit legacy opt-in root proposal. |
| `src/expansion_persistence.js:7-16,30-49` stages a complete envelope, inventory/native patches and validation, then storage write. | Candidate seam for one body publication adapter, with prevalidated native publication and the host's guarded writer. It does not already understand B11 jobs or cards. |
| `src/main.js:4935-4968` creates native save fields and recalculates stats after load; `:5285-5308` validates and prepares the envelope before native restoration. | Explicitly serialize/restore the B2/B11 owner; do not assume `getBio()` includes it. Restore instance lookup before inventories and resolve sources before action previews. |
| `src/save_files.js:40-83` invokes optional-domain validators; `:176-191` encodes UTF-8 and imports only after decode and real-loader preflight; `:196-215` measures storage and guards writes. | Add cross-domain validation at local load and file import. Reject malformed presence, preserve prior bytes on failure, retain full-envelope roundtrips. |

B6 [GRAMMAR](../b6/GRAMMAR.md), G1/G5, [VALIDITY](../b6/VALIDITY.md),
V1/V4, and [SAVE_SHAPE](../b6/SAVE_SHAPE.md), S1-S4, require qualified handlers,
frozen intrinsic cards, cause-index agreement, source bindings and actual
transmission carriers. Its G7 also binds transmission to a real frozen parent/donor cause rather than
the random-adult pool. Its home fixture has no supernatural rewriting; B11's
home alchemy profile is a **separate proposed overlay**, not silent permission
to generate magical H cards. B11 uses a finite authored compatible archetype,
then adapts qualified generated cards. Shared samples/templates/cards need a
separate retained archive so they survive changes of native body; current edits
stay with the B2 body. B6 sample output is reconciled in REPORT.

## F5: external design references through the unbiased lens

Retrieved 2026-10-14. **Shown** means this lane directly inspected source or
played behavior; **stated** means a cited author/developer describes it;
**inferred** marks B11's design transfer. No game was played and no installed
version was verified. These dated sources are reference boundaries, not a
current-version balance guide. No raw fictional prose is reproduced.

| Reference and locator | Stated mechanism | Inferred use and limits |
|---|---|---|
| [Ludeon, Biotech preview #3, 2022-10-15](https://ludeon.com/blog/2022/10/biotech-preview-3-reproduction-children-genetic-modification-release-date/), “Genetic modifications” and “Genes” | Traders, rewards and extraction supply genepacks; an assembler combines them into an implanted xenogerm. Germline genes transmit to children; implanted xenogenes do not. Metabolic efficiency ties advantages/drawbacks to food need. | Borrow physical sample → design → application and explicit transmission classification. Do not label B11's heritable alchemy a RimWorld xenogerm rule. Do not import a hunger requirement into this game's optional-food direction. |
| [Ludeon, Biotech Steam page](https://store.steampowered.com/app/1826140/RimWorld__Biotech/), “Genetic modification” | Describes gene collection/recombination and varied functional xenohumans. | Supports variety, not B11's numerical complexity budget. Exact current assembler thresholds were not established from inspected primary sources; B11 numbers are local proposals. |
| [Freehold Games, Mutation Overhaul, v2.0.201.44](https://freeholdgames.itch.io/cavesofqud/devlog/182472/mutation-overhaul-our-biggest-mutation-rebalance-ever), “MUTATIONS”: rapid advancement, Flaming/Freezing Ray, Electrical Generation, Irritable Genome | Physical mutations can advance; limb loss can disable a located ray; electrical charge powers devices; Irritable Genome changes the usual mutation choice into a random one. | Borrow located consequences, useful work outside combat, and separation of selected versus random outcomes. A Qud mutation-point purchase is not DNA editing or proof of inheritance. The 2020 patch is historical; its exact values are not asserted as current. |
| [Bethesda Support, How did I get a mutation in Fallout 76?](https://help.bethesda.net/app/answers/detail/a_id/43474), acquisition/serum/removal paragraphs | Radiation can randomly mutate; a serum supplies a specific mutation; RadAway can remove mutations and perks can protect them. The article also describes repeat-serum temporary effects. | Borrow exposure versus selected delivery and reversal versus suppression. This is Fallout 76, not a universal rule for FEV, all Fallout games or biological heredity. No FEV reversibility claim is established. |
| [Bethesda, Gleaming Depths release notes](https://fallout.bethesda.net/en-NZ/news/fallout-76-the-gleaming-depths-release-notes), Perks → Starched Genes; [later fixes](https://fallout.bethesda.net/en-NZ/news/fallout-76-gleaming-depths-improvements-and-fixes-release-notes), Mutations | Release notes change Starched Genes ranks/category; later fixes discuss Class Freak/serum/RadX effect presentation. | Do not copy old perk rank UI or treat suppression as removal. Support and release notes are not proof of today's executable. |

Contradictions and limits: heritable alchemy is an intentional difference from
Ludeon's nonheritable xenogenes, not a source contradiction to smooth over.
Bethesda's high-radiation/removal probabilities are reported as the support
article states them; B11 did not inspect executable probabilities and imports
none. No direct conflict between the inspected primary mechanism descriptions
was established. Exact modern tuning remains unverified. Community wiki/search
results were discovery aids; numerical technical claims here rely on primary
sources or are explicitly B11 proposals.
