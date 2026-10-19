# CR5 more: subtle making, overarching rules and implementation seams

2026-10-14. **Everything proposed here is a proposal.** SHOWN/SOURCE means direct code inspection only; INFERRED consequences and design suggestions are explicitly labelled. This file extends root SU10/OA/II/AB without modifying those owners. No runtime execution, builds, save reads or commits.

## F1-F12: merged P2 audit, file:line

Main checkout `/Users/weiwei/code/yet-another-idle-rpg`, branch `codex/gameplay-foundations`, sampled HEAD `c47d5193`. `git merge-base --is-ancestor 4e13f97f HEAD` succeeded. The current task's merged-P2 update supersedes older CR1-CR4/P6 branch-only descriptions. Their contract proposals remain useful; their historic browser/test counts are not fresh integrated proof. The old P2 worktree was not accessed. Source hashes in CHECKPOINT identify the sampled files, not a writer lock.

| Code / root extension | SHOWN source locator in main checkout | Meaning and proposed adapter consequence |
|---|---|---|
| F1 / II1a | `src/mixture_state.js:11-29,47-62` | Pure deterministic resolver over retained profiles; local scoped one-time family/method generation. No arbitrary random chemical outcomes or multi-world resolver switch. New generated facts must retain truth/revision; prototypes cannot reinterpret selected hidden truths as canon recipes. |
| F2 / II1b | `src/seeded_streams.js:3-16,23-41,46-58,64-77`; `src/main.js:1-3` | Main seed bridge uses `streamSeed`, with pure `unitDecision`; draw/ordinal helpers mutate counters/log. `ensureStreams` can initialize an absent stream owner, so a “pure prediction” host needs a read-only/staged seed snapshot. INFERRED integration caution, not a reproduced defect. Stream name admission is bounded; don't invent an unsupported name or silently redraw retained profiles. |
| F3 / II2a, II6a | `src/mixture_state.js:2-8,31-45,47-53,64-74` | Fixed four ingredient IDs, revision1 and consumer identity; canonical product/key decoding rejects arbitrary gadget/serum fields. AB1 adds family dispatch around established decoder contracts; it cannot be obtained by appending a metal tag or renaming MIXTURE_ID. Material expansion must preserve old profiles. |
| F4 / II3a | `src/mixture_state.js:54-71,81-83` | Four constituent totals conserved; whole-vial oral dose normalized to a reference mass. Uniform scaling changes product identity/mass but preserves concentration-normalized payload. Rational split/dilute helpers return composition, not native partial-vial products. New cartridges, body manufacture and power-pill amounts need their own actual-amount consumers; old vials keep their local law. |
| F5 / II5a | `src/mixture_state.js:39-40,75-79`; `src/mixture_native.js:16-22` | One exact-product observed flag and learned method; use reveals fixed dose/side effect. No observer key, negative trial, modelled range, ingredient assay or licence record. AB3 adds scoped claims; a danger tingle must not set observed=true and reveal the entire dose. |
| F6 / II2b | `src/mixture_state.js:61-74,84-89` | ID contains process/inputs/fractions/mass/revision; whole-envelope traversal resolves product references, including consumed exposures. Parts, condition, remaining charge and maker lineage lack representation. Preserve old IDs; generic family references need complete decoder/import-graph closure across inventory, storage, jobs, equipment and effects. |
| F7 / II3b | `src/mixture_state.js:91-98`; `src/active_effects.js:15-35,515-518` | One latest-dose replace family, payload and timing retained; specific restoration preserves mixtureExposure. Generic extra metadata is not automatically retained by ActiveEffect. AB2/body owners need explicit receptors/exposures/lasting source changes; suit charge, living bond and permanent gain are not infinite-duration potion buffs. |
| F8 / II4a | `src/mixture_native.js:5-15,35,38-43` | Stage clones state/stock, validates and writes before publication. Commit destination is main-character inventory/money and one fixed active-effect key. Reuse atomic staging **contract**, not this hardcoded host as an NPC/universal maker. AB4 requires recipient/custody/source/tool participants and actual revision revalidation. |
| F9 / II4b | `src/mixture_native.js:23-33`; `src/mixture_ui.js:37` | One vessel reservation; advances one due batch then dates the next from supplied current clock; free/visible UI polls settlement. This is not general parallel/catch-up/offline manufacturing. CR3 owns queue/scheduler joining; future factory contexts must preserve existing job semantics. |
| F10 / II5b | `src/mixture_ui.js:12-21,29-35` | Whole pack controls, pure resolver forecast followed by mixturePresentation, then owned-product use/learn/repeat controls. Current known UI is not a comic HUD/forensic model. New projections must cover labels, recommendation/sort reasons and accessibility text, not only visible description. |
| F11 / II4c | `src/main.js:4696-4712` | Native host guards player life, activity, world/location and dispositions, then publishes hero state. “Use” is not restricted to Village in the same way as counter actions, but still base.frontier/free guarded. Combat throws, NPCs, another body or comic-world station need a legitimate admitted host, not a bypass. |
| F12 / II7a | `src/mixture_state.js:27-45`; `src/seeded_streams.js:27-36` | Retained products/methods/job and saved-stream cells validate, but no product uniqueness, suit lineage, reboot survivor or maker registry exists in these modules. AB5/6/7 are proposed joins; current local law bounds are implementation limits, not canon or universal “once” rules. |

These locators substantiate what the inspected modules contain. They are not whole-repo negative proofs: other foundations may supply part of a join. Root/CR6 must reconcile those owners before selecting modules. A source-inspection finding does not certify staged-write rollback, UI safety or imported-save correctness under a future combined system.

## SU10a-SU10l: subtle, record-backed comic making

All O proposals. Extend SU10 instead of selecting a compulsory comic skin. K3's [report](../../comics-2026-10-14/K3_REPORT.md) owns content-kind/layout distinction, known recaps and reading pace. Each detail below adds a making subject.

| Code | Concrete detail and observable basis | Mechanical versus presentation boundary |
|---|---|---|
| SU10a | A completed upgrade receives a compact technical cutaway showing **known** changed parts, beside its parent design. | AB7 actual installed change causes the card; a cover is not proof of an untested function. |
| SU10b | A broken gadget leaves a quiet beat showing a visible cracked latch or empty mount, with an accessible optional description. | Actual observed damage comes from object owner. Silence adds no wound, destruction or secret clue. |
| SU10c | Routine cartridges use a brief margin tally; first successful rig repair gets a larger receipt card if desired. | Exact counts remain inventory facts. Presentation cannot turn ten outputs into one splash reward or suppress an admitted shortage. |
| SU10d | Blueprint pencil annotations show author, date, tested surface and unresolved question. | Knowledge/edition from CR4, not perfect universal recipe certification. A forged annotation is an attributed claim. |
| SU10e | A visible patched sleeve or changed nozzle helps a familiar observer recognize a revised costume. | Appearance can support identity suspicion through existing observer owner, not auto-unmask the actor. |
| SU10f | A “meanwhile, at the bench” insert appears only after an entitled remote feed or received workshop update. | It projects a real admitted job. Comic styling cannot grant remote knowledge, close-browser progress or staff means. |
| SU10g | A station gives a small witnessed cue as a supported stage completes: settled layer, ready light or timed latch. | A declared process must cause the cue. A decorative cue is labelled texture and does not change chemistry. |
| SU10h | New design credits list the inventor, fabricator and actual contributing enchanter where known. | Credit belongs to contribution/history, not last-touch ownership or generic creator reputation. Unknown collaborator stays unknown. |
| SU10i | A scratched identifier makes an expert ask to inspect an object rather than magically recover its whole history. | Wear is physical; attribution is a hypothesis. Multiple plausible explanations survive until evidence separates them. |
| SU10j | A returning maker compares today's receipt with a saved earlier edition, showing a real resolved improvement or an untested claim. | Cosmetic, measured, predicted and historical changes remain separate. No auto-rewrite of older products. |
| SU10k | A work montage summarizes actual progress, pauses and failed attempts, preserving links to relevant observations. | Reading time, game time and narrative compression differ. Montage does not invent growth or hide a failure cost. |
| SU10l | A commemorative cover names an earned workshop feat; a foresight cover carries a visible possibility label. | Same layout, different truth status. Sealed truth cannot appear on either outside discovery. Cover intensity is a taste dial. |

AB3 governs what each observer sees; AB1/7 supply product/design facts; AB4 records contributions; AB6 retains which instance/revision the history belongs to. None requires hunger, compulsory durability, penalties during absence or a global presentation RNG draw.

## OA1a-OA6b: overarching implications

| Extension | Additional proposal and concrete implementation implication |
|---|---|
| OA1a | **One publication envelope, several laws.** A suit can reference parts, a cartridge C, a magical attachment P/E and living partner an actor. Shared custody/save/read contracts do not require one universal numeric resolver. Register only representations used by the chosen consumer. |
| OA1b | **Truth belongs to manufacture/use, not the panel.** A stat page, cover, commercial grade or patent is a projection/claim. Actual product function reads retained supported material/interface/source facts whether known or not. |
| OA2a | **Maker parity includes means.** Player, NPC and construct run compatible processes with their real faculties/tools/stocks. Skill improvement does not spawn parts; a named “genius” trait has no effect until a process consumes it. CR4 owns maker roles. |
| OA2b | **Team invention need not merge people.** Bind separate design, fabrication, test and source contributors to one job/cause. Credit, learning and ownership may differ. Assistance and paid/ordinary routes remain real choices. |
| OA3a | **Uniqueness has a domain.** Single original identity, limited production, recipe secrecy, sole patent issuer and exclusive current bearer are different. AB5 enforces only selected lawful exclusivity. Copies/counterparts require actual explicit creation/instance laws, not hidden anti-abuse vetoes. |
| OA3b | **Lawful duplication has an account.** Where a cheat creates stock or copies a source, name the changed conservation domain and provenance. Do not pretend it conserves ordinary matter, and do not add an unsourced instability penalty to an allowed perfect copy. |
| OA4a | **Retcon is a typed transition.** A physical rebuild, belief revision, identity transplant and historical rewrite may leave similar visuals but change different owners. [K5](../../comics-2026-10-14/K5_REPORT.md) owns that distinction; AB6 adds product/part/exposure/recipe survival manifests. |
| OA4b | **Preserve earned changes by selected policy.** Defaults/strong anchors are proposals from the comic owner, not automatic engine promises. Every transition declares old/new instance, retained object, dependent source, observer memory and import compatibility. Loading isn't a reboot. |
| OA5a | **Reveal scope includes inference output.** AI ranking, a hazard icon, cost quote or unavailable button may leak as much as a tooltip. Project all derived recommendations through permitted evidence, including no hidden candidate denominators. |
| OA5b | **Unknown is not unsupported.** Unknown-to-observer truth still resolves. Undefined model/interface is explicitly unsupported or deferred, not secretly safe/zero. That boundary permits research and powerful honest cheats without faking simulation. |
| OA6a | **Novel designs become repeatable only after admission.** Process revision, selected inputs, station/source access and consumer must be valid. A copied sheet can be studied while unsupported making remains a named gap. CR3/CR4 keep queues and learning. |
| OA6b | **Idle is a clock choice.** Played-time staff production and closed-browser manufacture are different policies. Select one existing clock adapter; do not make comic off-panel time advance three competing clocks or create absence starvation. |

## AB1-AB7 crosswalk, without another abstraction owner

[CR6's completed proposal packet](../cr6/REPORT.md) owns root's consolidated P2/AB implementation analysis. Its late report confirms retained P2 semantics, additive observer evidence and the seed-initialization caution; none is CR5 runtime proof. The older weapon XA list is a companion proposal; the recovered primary [weaponcraft/inscription root](../../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) owns R1-R3. The [maker-arts palette](../../../../WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md) is a separate parallel proposal, not that primary owner. Number collisions are namespaced: **crafting.AB1** here is not weaponcraft.AB1. CR5 adds source-qualified witnesses, not competing schemas or runtime reservations.

| Root AB | Minimum witness this lane contributes | Reuse seam / remaining work |
|---|---|---|
| AB1 family registry | Cartridge plus installed nozzle/device have distinct consumer/decoder while sharing holders/publication. CM7/18/23/29. | F3/F6. Keep old P2 key, validate all definitions before references. Existing item/structured equipment/P6 owners are root/CR6's integration questions. |
| AB2 exposure ledger | Temporary power pill, bodily manufacture debit and recipient-fit observation refer to real body history. CM18/19/22, PCX13/14. | F4/F7; CR1 owns quantity/route/body law. Retain exact old replace-family payload, no retroactive poison reinterpretation. |
| AB3 observer knowledge | Blueprint, instrument reading, hypothesis and accepted canon label have scope/basis/contradictions. Every CX and SU10. | F5/F10. XA6 and existing knowledge owners supply shared contract; do not overload boolean observed. |
| AB4 maker actor | Inventor/fabricator/enchanter contribute their actual means/stock/time. CM17/21/27. | F8/F11; CR4/P4 person and scheduler owners. Pure law callable by any actor; host admission/publication still recipient-specific. |
| AB5 uniqueness | Original power identity versus synthetic media versus recipe scarcity versus object holder. CM3/4/14/19, PCX8/16. | F12; world-instance-qualified identity and copy policies, one custody authority. Idempotent settlement limits a receipt, not new paid production. |
| AB6 continuity | Same physical object, alternate counterpart, old product revision and dependent live source have explicit transition outcomes. CM24/29/31, PCX22. | F6/F12; K5 source/transition semantics and existing transfer owner. Save/load/import use retained revisions, not automatic latest-canon rewriting. |
| AB7 design lineage | Parent/variant design, current object, installed part, transmitted method edition and actual contribution remain separate. CM1/17/25/30, PCX17. | F3/F6; CR4 knowledge/maker lineage and P6 part graphs. A new drawing doesn't auto-upgrade older owned objects. |

A narrowed first implementation need not build all seven registries. For the relay-thread witness, AB1/3/7 subsets and an existing actor/publication bridge can be enough; no universal magic-identity or reboot simulator prerequisite. A stronger later source changes required records and gates, not authority over siblings.

## C6-C10: newly arrived sibling reconciliation

| Code | Read-only owner and result |
|---|---|
| C6 | [K1](../../comics-2026-10-14/K1_REPORT.md) independently separates UI eligibility, visibility, hunter certification and item grades. CM15/PCX10 retain that distinction; no generic webtoon public-window law. |
| C7 | [K2](../../comics-2026-10-14/K2_REPORT.md) owns additional world rosters; CR5's source cards are **making claimsets**, not new world registrations or an alternate campaign priority. |
| C8 | [K3](../../comics-2026-10-14/K3_REPORT.md) owns style/kind/read pace; SU10 adds only manufacture-specific causes. Silent damage card is not a simulation event. |
| C9 | [K4](../../comics-2026-10-14/K4_REPORT.md) distinguishes capability, authority and build budgets, and category ratios from event chances. CM6/PCX6 do not import census counts as production probabilities. |
| C10 | [R2 game references](../../weaponcraft-runes-2026-10-14/R2_REPORT.md) separates parts/processes, glyph grammar and decorative writing. CM21/24 add source predicates, not an independent universal rune interpreter. [K5](../../comics-2026-10-14/K5_REPORT.md) owns reboot semantics, extended only with item dependents here. |

At this refresh, CR6 has a completed proposal report, old `wr1/` contains a checkpoint; `wr2/`-`wr4/` folders and a K6 final report were not available. CR5 makes no completion claim for them. Root reviews whatever later lands. The weapon-reveal companion, recovered primary inscription root and parallel maker-arts palette are cross-linked with their distinct ownership preserved.

## Remaining source and runtime gates

Canon questions stay **findable and local**: chosen issue/model for suits; selected complete serum treatment; exact wonder-metal specimen/process; target/variant of kryptonite; ring-era payer and permanence; specific toxin/cure relationship; precise MHA licensing; ordinary versus copied Devil Fruit law; webtoon shop/transfer/grade scope; Asterix album exception; comic-versus-TV key forging; actual manhua pill formation. None requires a new whole-library read to select an original witness.

For a chosen gameplay slice, root must allocate one writer per shared area, pin supported source/adapter/consumer and compatible optional owner; run meaningful source tests and required build; show natural acquire → make → observe → useful consumer → repeat/cancel on a fresh rebuilt origin; Save/reload plus Export/literal-file Import pending and changed-positive states; prove failed-write/stale/duplicate admission and old-save handling. Desktop 1366x768 and 1600x1000, mobile deferred. Source/build/native/persistence/human gates are distinct and all **OPEN** for CR5 proposals.
