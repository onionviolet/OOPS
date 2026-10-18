# Making rules

Standing rules for every agent that designs or builds a way to make things:
potions, cooking, smithing, runes, enchanting, formations, constructs and any
other making. Weibao, 2026-10-15: "save rules and deeper considerations for
potions, and extrapolate similar stuff for creating and runes and other aspects
accordingly?" ([USER_VISION](USER_VISION.md#making-rules-and-cross-domain-extrapolation-2026-10-15)).

Each rule names the mistake it prevents. The rules come from his crafting
direction across the four rounds in [CRAFTING_ENGINE](CRAFTING_ENGINE.md) and the
[weaponcraft and rune palette](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md)
(its OV model: a made thing is parts on a substrate, joined by rules, with true and
observed properties). Specific mechanics, numbers and slices in the linked
palettes remain proposals; these rules constrain them. AD38 (2026-10-17, accepted) generalizes MR1 and MR6–MR7: a making method that
reasonably works by the mechanisms in play works. Per-domain extrapolation
is in [CRAFTING_ENGINE round 4](CRAFTING_ENGINE.md#round-4-2026-10-15-deeper-potions-and-the-same-model-for-every-kind-of-making).

## Truth, chance and reloads

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR1 | **True properties act whether known or not.** Knowledge changes predictions, names and cues, never the result. | An unidentified potion that does nothing until appraised |
| MR2 | **Keep three sources of chance separate:** world truth (hidden properties, frozen once per save), execution (a committed per-attempt draw that skill narrows) and rare authored reactions. Given the inputs and the execution draw, the outcome is deterministic. | Reload or preview rerolling a result; skill secretly rewriting what a material is |
| MR3 | **Freeze on reveal.** Once a generated material, recipe, site or product is seen, save the value and its revision, not just a seed. | A content update silently changing a learned recipe |
| MR4 | **Preview consumes nothing:** no stock, no money and no draws. | Players scumming previews, or quotes that spend |
| MR5 | **Conserve what is conserved.** Mass, charge, identity and exact canon substances go somewhere declared: product, byproduct, waste or exit. | Free duplication through split, dilute or salvage loops |

## Recipes and experimentation

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR6 | **Free experimentation works in every world, canon ones included.** Any permitted combination resolves to an outcome: original, degraded, failed or known. "Invalid recipe" is not an outcome. | Making canon worlds formula-only and killing discovery play |
| MR7 | **Formulas are attractors, not gates.** Meeting a known formula's requirements, even by accident, makes that product. Near misses make a labelled degraded version; far attempts make originals. | Canon items minted by vague similarity, or experiments that can never find the real thing |
| MR8 | **Composition beats catalogs.** Author reusable properties, operations and laws. Fixed recipes stay as discovered shortcuts and canon anchors. | One hand-written template per combination |
| MR9 | **A standard recipe may declare open slots.** A slot changes strength, duration, side effects or style within the product's family, never its identity. | Slot-ins that turn a healing draught into a different named potion |
| MR10 | **Record what was demonstrated.** A learned method stores the steps that actually worked, with their conditions and limits. | "Known recipe" buttons that know more than the player ever showed |

## World laws and styles

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR11 | **Each world declares its making rulebook:** modes per domain (composition, formula, slots, budget, grade, conserved identity, pattern, assembly), verbs, substitution policy, failure semantics, knowledge routes, apparatus, legality, quality model, calendar and import compatibility. | One universal crafting law flattening every world |
| MR12 | **Style is data:** apparatus and scene, verbs, cues, failure flavor, naming grammar, pacing and social frame come from the world pack. | New engine code per world, or a Hogwarts cauldron that plays like a xianxia furnace |
| MR13 | **Label canon status on every rule and record:** SHOWN, STATED, INFERRED, ORIGINAL or GENERATED, with a locator. Original rules sit within canon results, and a sourced scene overrides them. | Invented mechanics presented as canon, and canon fidelity nobody can check |
| MR14 | **Cross-world use needs a directional compatibility law.** Without one, an imported material or item stays owned and inert, never silently native. | A Hogwarts ingredient quietly working as a xianxia pill herb |
| MR15 | **Limits are per-world adjectives, never fixed "once" rules.** | Arbitrary caps that do not fit a world |

## Process and depth

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR16 | **Every verb changes declared state.** A stir, quench, stroke or chant has a stated effect, window and cost, or it is not offered. | Decorative minigame steps |
| MR17 | **Order, preparation and timing count only where the law reads them.** Stages have windows (early, on time, late) only when a rule consumes them. | Busywork controls with no consequence |
| MR18 | **Depth is chosen per activity:** quick (repeat a recorded method), guided (key decisions) or deep (every stage). All three run one resolver, and the choice is a comfort setting, not a penalty. | A grind for basic results, or a deep mode with different rules |
| MR19 | **Quick never beats what is known; deep beats quick only through better choices.** | Automation stronger than the knowledge behind it |
| MR20 | **Magic, qi or spell input is a step with requirements and cost,** not a free multiplier. | Mana ink or a wand wave that buffs everything |

## Mastery

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR21 | **Skill improves control, not truth:** fewer or merged steps, lower time cost, narrower variance, wider windows, better yield, reading cues, recovery, improvisation, invention, scale and delegation. | Skill that changes what iron or an herb actually is |
| MR22 | **Mastery comes from meaningful new attempts,** teaching, texts or demonstrations; repeating an identical observation teaches nothing new. | Infinite XP from clicking the same brew |
| MR23 | **Same rules for every maker.** NPCs, apprentices, constructs and the player use one resolver with their own frozen maker snapshot (skill, tools, knowledge, stock). | Two economies and two balance passes |
| MR24 | **Top-grade or named-work gates are world law,** stated as tiers or requirements, and every path to them stays reachable. | Hidden caps, or a single compulsory path |

## Materials and sources

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR25 | **Resource spots have three layers:** canon anchors (cited), canon-consistent fill (generated stock and condition on existing places) and original regions. Generation never invents a canon landmark. | Procedural castles; a Mandrake patch in every meadow |
| MR26 | **Canon scarcity, exclusion and timing are hard constraints;** unstated timing is a labelled original adjective. | Invented lunar formulas presented as canon |
| MR27 | **Supply has many forms:** wild, cultivated, shop, institutional store, living creature, trade, reward and salvage. Each has an owner and an access rule, and taking has consequences. | Free unowned stock everywhere |
| MR28 | **Harvest rolls key on world, place, source and game time,** never wall clock or a shared counter. | Different yields after a backgrounded tab |

## Engine and persistence

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR29 | **One shared envelope, separate product logics.** Identity registry, knowledge projection, maker snapshot, execution draw, stage timeline, mastery data, outcome labels and publication are shared. Composition (potions, alloys, food), parts (weapons, devices), pattern (runes, formations) and conserved identity each keep their own resolver. | Forcing runes through chemistry math, or writing a second inventory path per craft |
| MR30 | **Products keep the law revision they were made under.** Validation re-resolves under that revision, and unsupported revisions are rejected, never silently dropped. | Old saves changing meaning after a patch |
| MR31 | **Projections never leak truth:** names, sorting, prices, tooltips, hidden counts and logs show only what the observer knows. | Sort order revealing which vial is poison |
| MR32 | **No maker system without a reader:** a new product family lands with an actual use (effect, stat, consumer, trade or gate). | Write-only crafting that looks done in reports |
| MR33 | **Old saves load unchanged.** A new owner stays absent until first use; migration never rewrites existing keys or products. | Broken or silently altered saves |

## Before you call it done

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| MR34 | **Prove determinism:** golden snapshots for three seeds, a seed sweep with invariants, and the same next value after save, reload and import. | Determinism bugs found by Weibao in play |
| MR35 | **Prove the canon boundary when a canon pack exists:** the exact formula makes the canon product, a near miss makes degraded, free mixing makes originals, and cited rows have locators. | Canon packs that drift from the source |
| MR36 | **Playable proof follows AGENTS.md:** rebuild, fresh origin, 1366×768, and Save, reload, Export and literal Import for persistence. Unit tests alone are source evidence, not gameplay. | Claiming engine code is a playable feature |

## Application reconciliation, 2026-10-18

At Weibao's request, apply MR1, MR5 and MR29 together with AR7 and AD38:
a staged craft records actual completed stages, spent inputs, held stock and
intermediate products. An interruption by combat, travel or a content edge
settles those facts through the activity's owner before another activity takes
control. Refund, spoilage and resumability follow the product mechanism;
cancelling after a committed stage does not silently undo it. Atomic crafts
remain atomic. [G28](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18)
is a future scenario, not a demand for a job engine.

MR1 also governs warnings: unknown properties act, while projections reveal only
what means support. Tags select modeled interactions; they are not a permission
list that makes an untagged supported interaction impossible (AD38).

**Current compatibility override:** MR30/MR33's old-content/old-save guarantees
are qualified by the [2026-10-17 decision](USER_VISION.md#old-save-compatibility-deferred-2026-10-17)
and [content-ID decision](USER_VISION.md#content-id-retirement-and-frozen-world-idle-2026-10-18).
A task may reset/drop old state and records that choice. New state still needs
Save/reload/Export/Import; current references must remain internally consistent.
MR36's historical 1366×768 target is a floor: new UI evidence also uses the
1920×1080 primary and other current targets in [UI_RULES](UI_RULES.md).
