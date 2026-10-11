# Proposal review: new-game audit packets

Checked 2026-10-07 against the live working tree on `codex/gameplay-foundations`. Read-only review: no code, build, game run or commit.

**Status: proposals, not accepted decisions.** Everything here is a recommendation for Weibao. Nothing enters PROJECT.md until he accepts it, and PROJECT.md's current next step still applies: playtest the existing build and work the acceptance backlogs before any new content wave ([PROJECT.md](../../../../PROJECT.md), "Next step"). "Adopt-now" below means "first in line once that gate clears", not "start today".

Sources reviewed: [Achra packets](../../../research/path-of-achra/IMPLEMENTATION_PACKETS.md) (P1-P5), [Magic Research 2 packets](../../../research/magic-research-2/IMPLEMENTATION_PACKETS.md) (P1-P4), [Soulash 2 packets](../../../research/soulash-2/IMPLEMENTATION_PACKETS.md) (O1-O4), this wave's README, CANDIDATES, readbacks and VALIDATION, plus [engine handoff](../../../research/novels/ENGINE_GM_HANDOFF.md) and [world requirements](../../../research/novels/WORLD_ENGINE_REQUIREMENTS.md).

Evidence labels: **[V]** verified by reading the cited source lines. **[I]** inference from the code I read, not tested. No claim here was exercised in a browser.

## Main finding

F1. Six of the 13 proposals mostly duplicate systems that already shipped. The audit lanes compared against the reference games but not closely enough against YAIRPG's current content. The worst case is the Soulash packet's own top pick (O1, timber contract): `skills.timber.pack` already turns logs into kits at a capacity-limited workbench with refund-on-cancel and automation **[V]** `src/skill_expansion_content.js:158-162`. Magic P4's "gated prestige with before/after preview" is also the existing field renewal **[V]** `src/frontier_campaign.js:62-66,95-99`.

F2. All five Achra proposals need combat machinery that native combat does not have. Native fights run as independent per-fighter `setTimeout` loops with `Math.random` crits **[V]** `src/models/combat.js:180-207,370`. The only deterministic, saved combat surface is the opt-in duel/party contest behind `actionAdapter` **[V]** `src/models/combat.js:250-254`, `src/native_battle.js:10-14,38-62`, `src/party_battle.js:61-98`, and it is a narrow single-rival encounter.

## Engine surfaces referenced

| Surface | What it does | Citation |
| --- | --- | --- |
| Powers | Owned/learned check, execution rule, cooldown, world restriction, kept separate from knowledge | [V] `src/simulation.js:113-120` |
| Power models | `practice` mastery bands change capacity and cost scale | [V] `src/power_models.js:8-12` |
| Energies | Learned reserve/strain pools; `use` fails without reserve or strain headroom | [V] `src/energy_resources.js:21-45` |
| Programs (automation) | Bounded repeat count; pauses with a stated reason when inputs or access fail | [V] `src/simulation.js:301-319,518-525` |
| Sites | Work-site capacity and reservations | [V] `src/simulation.js:102-103` |
| Advancements | Track receipts, parents, exclusive branch groups | [V] `src/simulation.js:320-332` |
| Transitions | Preview lists lost/retained, then commit at a safe boundary | [V] `src/simulation.js:532-586` |
| Unsupported completion | Refunds reserved inputs and pauses the routine with a reason | [V] `src/simulation.js:251-262` |
| Native crafting | Recipes carry `recipe_skill`, level band and an availability (unlock) component; smelting already makes iron, silver and steel ingots that feed blade and axe parts | [V] `src/crafting_recipes.js:44-70,450-492,1152-1190` |
| Native stances | One current stance at a time, saved in the native save | [V] `src/main.js:2962-2984,4478` |
| Native active effects | Reapplying an effect replaces its duration; `group_tags` let the stronger effect win | [V] `src/main.js:4115-4151` |
| Equipment in simulation | Equip/unequip effect exists | [V] `src/simulation_effects.js:303-314` |
| Equipment as a fact | No equipped-item fact is projected into `simulationFacts` | [I] grep found none in `src/simulation_effects.js:63-130` |
| Damage types | Native combat has none; items.js "element" means armor component layers | [V] `src/items.js:466-472`, [I] no type field in `src/models/combat.js` |

## Per-proposal verdicts

### Path of Achra (old v0.4.7 demo)

**A-P1. Visible pending-effect row with a deterministic tie rule.**
Uses: opt-in party contest; the helper's guard is already one pending effect consumed by the next blow **[V]** `src/party_battle.js:72-80`. New code: a general effect queue, an ordering rule, UI row, and a `nativeBattle` schema bump with migration. Risk: native real-time combat has no shared turn, so ordering only means something inside the narrow duel **[I]**. Verdict: **later**, after a real opt-in combat surface exists.

**A-P2. One earned charge action (gain trigger, spend trigger).**
Uses: party contest plus actor resources; Lio's `brace_effort` already works as a spendable, exhaustible charge **[V]** `src/party_battle.js:74-76`. New code: a player-side charge resource, one gain hook (for example a landed hit), one spend action in the contest, save fields with additive defaults. Risk: lives only in the Mara contest until more opt-in fights exist; still the cheapest way to put Achra's build feel into play **[I]**. Verdict: **adopt-now** (rank 3).

**A-P3. Mutually exclusive temporary stance with extend-on-repeat.**
Uses: native stances (already exclusive) and active effects. New code: a duration on stances, or a stance-linked active effect whose reapply extends rather than replaces, which changes native `add_active_effect` behavior **[V]** `src/main.js:4148-4151`. Risk: touches vanilla stance save and code paths that PROJECT.md says to keep intact. Verdict: **later**.

**A-P4. Damage type unlocks conditional recovery capped by missing health.**
Uses: nothing directly; native combat has no damage types (see table). New code: a damage-type field across attacks, enemies and mitigation, then the heal rule. Risk: largest combat change of the set for one small effect. Verdict: **drop** for this milestone; revisit only if a damage-type system arrives for another reason.

**A-P5. Movement or wait consequence in an existing destination.**
Uses: pursuits already track `moving`/`waiting` status and contact **[V]** `src/simulation.js:538`, `src/simulation_effects.js:111-112`. New code: a positional consequence and a target that can die before resolution. Risk: the acceptance idea assumes combat positions, which native combat lacks **[I]**. Verdict: **later**.

### Magic Research 2 (July 2024 browser demo)

**M-P1. Earned knowledge with a separate casting gate.**
Uses: lessons grant the learned method; execution separately needs an active faculty, mastery and energy **[V]** `src/skill_expansion_content.js:100-120`, `src/simulation.js:113-120`, `src/energy_resources.js:41-43`. New code: at most a clearer two-gate explanation in the UI. Risk: duplicate work. Verdict: **drop** (already shipped); log any UI-clarity gap in the acceptance backlog instead.

**M-P2. Craft that changes one technique's output and a fuel stat.**
Uses: equipment effect, power models, energies, effect formulas that read facts **[V]** `src/simulation_effects.js:303-314`, `src/power_models.js:48-55`. New code: an equipped-item fact projection (none found, **[I]**), one item, one formula hook scoped to one technique family. Risk: moderate; the projection must not leak into unrelated commands, and native equipment saves must stay compatible. Closes the craft-to-technique loop the vision asks for ("ordinary skills stay useful late"). Verdict: **adopt-now** (rank 2).

**M-P3. Bounded automation with capacity, fuel, condition and pause reason.**
Uses: programs already do exactly this **[V]** `src/simulation.js:301-319,518-525`, and twenty commands are marked `automatable` **[V]** grep. New code: none beyond content. Verdict: **drop** (already shipped).

**M-P4. Achievement-gated prestige with before/after preview.**
Uses: the field renewal is the one prestige layer, gated by facility, dry rack, supply, rival and mastery, and its preview lists loss and reward **[V]** `src/frontier_campaign.js:62-66,95-108`. New code: none. Risk: the real open question is playtesting renewal's save/reload/import, which PROJECT.md already lists. Verdict: **drop** (already shipped).

### Soulash 2 (demo 0.9.19.7 data)

**S-O1. Local timber contract with a standing order.**
Uses: `skills.timber.pack` and `precise_pack` (logs to kits, workbench site, refund, automatable) **[V]** `src/skill_expansion_content.js:158-167`; field workshop packing also spends logs **[V]** `src/field_workshop.js:86`. New code: none. Verdict: **drop** (already shipped). This was the Soulash packet's own top recommendation.

**S-O2. Skill milestone unlocks a distinct alloy recipe with one downstream use.**
Uses: native smelting with `recipe_skill`, level band and unlock availability; ingots already feed equipment parts **[V]** `src/crafting_recipes.js:44-70,450-492,1152-1190`; the unlock can ride an advancement or mastery fact **[V]** `src/simulation.js:320-332`. New code: one item template, one smelting recipe, one component recipe that consumes it, and one unlock hook. Risk: low; new native item IDs need save tolerance for old saves, and balance is a proposal. Verdict: **adopt-now** (rank 1).

**S-O3. Opt-in spell unlock with cost, cooldown and practice XP only on valid resolution.**
Uses: practice commands award mastery and native XP only on completion **[V]** `src/skill_expansion_content.js:113-120`; powers have cooldowns **[V]** `src/simulation.js:117,185-187`. New code: none. Verdict: **drop** (already shipped).

**S-O4. Reversible four-state element shaping at a station.**
Uses: nothing directly; there is no element or affinity property on materials **[I]**. New code: a material property model, conversion recipes, and a valuation rule so cycling never creates value. Risk: needs an item-valuation decision first and it touches trade prices **[I]** (`src/items.js:154-197` value fields). Verdict: **later**.

## Ranking for the one-realm, one-prestige milestone

| Rank | Proposal | Why it leads |
| --- | --- | --- |
| 1 | **S-O2 alloy as earned access** | Smallest new code, entirely inside native crafting, and it gives an ordinary skill a new equipment choice. |
| 2 | **M-P2 equipment that alters one technique** | Joins crafting to the power/energy layer. Pair it with S-O2 so the alloy item is the equipment, making one slice instead of two. |
| 3 | **A-P2 earned charge action** | Path of Achra is the lead reference game, and `brace_effort` already shows the charge pattern. Its reach is limited to the opt-in contest. |

D1 (proposed). Treat S-O2 plus M-P2 as one slice: smelt the alloy, make the part, equip it, see one technique's output and fuel change, then unequip. Its acceptance gate is the AGENTS.md browser check plus save/reload/import, since native items and equipment are persisted.

R1. A-P2 adds fields to the saved `nativeBattle` state (schema 2, `src/party_battle.js:61-63`). It needs additive defaults or a migration decision before it ships.

Q1 (resolved 2026-10-07). Weibao asked to close them. Five duplicate proposals (Magic P1, P3, P4; Soulash O1, O3) and the dropped Achra P4 are closed in their packet files. F1's "six" counts five duplicates plus the A-P4 drop. D1 (Soulash O2 with Magic P2) went to a Codex build.
