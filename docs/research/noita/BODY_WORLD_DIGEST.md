# Noita body, container and world digest

Local source audit, 2026-10-09. Adaptations below are proposals. This pass reads the extracted install and shipped modding docs. It does not launch Noita, exercise saves or change YAIR gameplay. Paths beginning `data/` are under `~/.codex/research/noita/data/`; paths beginning `external/` are under `~/.codex/research/noita/`.

The useful pattern is a route from material to body effect, with dose, cause and time kept distinct. The strongest corrections are that oil coating is marked as fire protection, beneficial contact does not mean beneficial drinking, containers hold mixtures, and common physics still has authored exceptions.

## N-code readback

| Code | Result | Source-backed correction |
|---|---|---|
| N3 | confirmed with correction | Materials attach contact statuses through legacy status_effects or structured Stains. OILED, like WET, is marked as fire protection on the body; loose oil is burnable. The summary that oil feeds fire must distinguish loose fuel from coating. Evidence: `data/materials.xml:5854-5884`, `data/scripts/status_effects/status_list.lua:8-45`. |
| N4 | confirmed with correction | Ingestion has its own per-material dose/effect rows. A useful stain may be harmful when drunk: invisibility liquid gives FOOD_POISONING by ingestion. Solids also have ingestion effects, so neither every liquid having an effect nor every material being consumable follows. Evidence: `data/materials.xml:7090-7132`, `data/materials.xml:9761-9797`, `data/entities/player_base.xml:386-399`. |
| N5 | confirmed with correction | Flasks hold mixtures indexed by material type and run reactions inside the inventory. The ordinary flask sucks up to barrel_size 1000 and enables reaction chance 20, explosions and entity outputs. Powder pouch has material_type 1, barrel_size 1500 and drinkable 0. One-material containers are an explicit YAIR simplification, not the observed Noita model. Evidence: `data/entities/items/pickup/potion.xml:60-88`, `data/entities/items/pickup/powder_stash.xml:62-84`, `data/entities/items/pickup/powder_stash.xml:151-161`, `external/tools_modding/component_documentation.txt:1632-1641`. |
| N9 | confirmed with boundary | Standard polymorph targets sheep for 600 frames and random polymorph uses the RANDOM target. Engine documentation exposes serialized original entity storage. A mass polymorph script targets both homing targets and player units, with boss and immunity exclusions. Restoring memories or a soul is YAIR design, not a Noita source fact. Evidence: `data/entities/misc/effect_polymorph.xml:5-11`, `data/entities/misc/effect_polymorph_random.xml:5-11`, `data/scripts/projectiles/mass_polymorph.lua:6-22`, `external/tools_modding/component_documentation.txt:1001-1002`. |
| N10 | confirmed with correction | Players, basic enemies and animals share damage/status component families, but authored parameters differ. Enemy AI has herd relations and aggression, not only tag matching. The directed relation matrix has 35 herds and 133 asymmetric unordered pairs. Shared mechanics do not imply identical susceptibility or universal friendly fire. Evidence: `data/entities/player_base.xml:132-161`, `data/entities/player_base.xml:268-272`, `data/entities/base_humanoid.xml:165-181`, `data/entities/base_humanoid.xml:208-212`, `data/entities/base_enemy_basic.xml:3-33`, `data/genome_relations.csv:1-36`, `external/tools_modding/component_documentation.txt:133-143`, `external/tools_modding/component_documentation.txt:2267-2275`, `external/tools_modding/component_documentation.txt:2669`. |
| N11 | confirmed with boundary | Orb pickups separate first discovery from later encounters: a first encounter creates a spell card from storage, a known orb creates a heart, and out-of-bounds orb IDs create evil hearts. Tablet offerings convert physical tablets to gold and repeated offerings may spawn monsters. These are concrete knowledge, place and history gates. Claims about community discovery dates are not established by the install. Evidence: `data/scripts/items/orb_pickup.lua:21-59`, `data/entities/items/books/base_book.xml:1-40`, `data/scripts/magic/altar_tablet_magic.lua:249-318`. |

## Stains, dose and time

A material can declare contact statuses with a `status_effects` attribute or a structured `StatusEffects/Stains` list. An ingestion list can be different. Oil coats as OILED but drinking it adds poison and food poisoning (`data/materials.xml:5876-5883`). Invisibility liquid coats as INVISIBILITY yet ingestion adds food poisoning (`data/materials.xml:7104-7130`). Mana liquid supplies the same named benefit through both routes (`data/materials.xml:6634-6662`). Snow, flesh and fungi also have ingestion rows; liquid is not a required phase.

Stain thresholds are material fields. Oil requires a 0.2 coating threshold in its declaration; polymorph liquid uses 0.25 (`data/materials.xml:5872-5873`, `data/materials.xml:6868-6874`). Shaken and ignited drop chances are authored separately. WET and OILED effect entities each declare 600 frames (`data/entities/misc/effect_wet.xml:5-9`, `data/entities/misc/effect_oiled.xml:5-9`). This is an effect duration declaration, not proof that all wetness lasts exactly ten seconds: native systems maintain stain levels and cooldowns separately (`external/tools_modding/component_documentation.txt:2431-2452`). Washing, dilution, replenishment and ignition order remain native-system opacity here.

The active status registry has 49 rows and 41 distinct IDs. Drunkenness, trip and cloud curse repeat the ID at dose thresholds. Drunkenness crosses 0, 0.25, 0.75 and 1; the final tier adds poison. Trip crosses 0.5, 1.5 and 3 after its base tier; cloud curse shifts from rain to thunder to acid at 0.25 and 0.75 (`data/scripts/status_effects/status_list.lua:213-279`, `:353-376`). FOOD_POISONING has a minimum 0.055 and a UI offset of the same size (`:288-295`). These values are normalized status quantities, not YAIR tag strengths or doses in millilitres.

The player's gut has a material inventory, a capacity of 7500, overingestion damage and a blood-healing parameter (`data/entities/player_base.xml:386-399`). Shipped component docs say retained gut size waits 600 frames after eating by default, then reduces one unit every five frames; only a selected material tag may count toward satiation (`external/tools_modding/component_documentation.txt:1199-1207`). Gut fullness, effect dose and useful food are different concepts. Exact ingestion status accumulation/decay is engine-side, so this pass does not infer a universal stacking formula from these fields.

For direct effects, the docs expose finite frame duration and an exclusivity group that replaces an older effect from the same group when loaded (`external/tools_modding/component_documentation.txt:994-1012`). Scripted effects can also have custom reversal logic: the hearty status halves max HP with a floor guard and later doubles max HP while preserving the current fraction (`data/scripts/status_effects/hearty_start.lua:14-44`, `data/scripts/status_effects/hearty_end.lua:21-33`). No single additive status policy describes all of these.

## Containers

The flask has material intake, spray, throwing, physical breakage and an inventory keyed by material type. It takes up to barrel size 1000, spills on death, leaks on damage, and allows reactions with explosion/entity outputs (`data/entities/items/pickup/potion.xml:27-30`, `:60-88`). The shipped engine docs define `do_reactions` as the chance per frame to run reactions, `reaction_speed` as units converted at once, and shaking as a speed-up option (`external/tools_modding/component_documentation.txt:1632-1641`). A mixed flask is a small reaction vessel, not just an item with one potion effect.

A pouch uses material type 1 intake, barrel size 1500 and ten sucked cells per frame; its ItemComponent explicitly has `drinkable=0` (`data/entities/items/pickup/powder_stash.xml:62-84`, `:151-161`). It shares a spray component, but does not declare the flask's explicit reaction settings. Flask death creates four shards through Lua; the spill itself belongs to MaterialInventoryComponent (`data/scripts/items/potion_glass_break.lua:20-28`). Do not attribute spilling to that shard script.

E4B's one-material container is a valid small proposal if named as a simplification. Mixtures should preserve amount per material if later enabled; do not put arbitrary contents into the capped durable-state item key. Container amount is instance data and should receive a save compatibility decision.

## Body swaps and common mechanics

Standard polymorph declares a sheep target for 600 frames; random polymorph declares a random target (`data/entities/misc/effect_polymorph.xml:5-11`, `data/entities/misc/effect_polymorph_random.xml:5-11`). The engine exposes serialized original entity storage, but its restoration and random-choice implementation are not Lua (`external/tools_modding/component_documentation.txt:1001-1002`). The sheep template has 0.1 HP, grass eating, a helpless herd and its own movement/body mass (`data/entities/animals/sheep.xml:5-27`, `:45-74`). Thus swapping body capability is supported; a retained soul and relationship graph are YAIR proposals.

Mass polymorph gathers both homing targets and player units and rejects bosses, protected tags and non-root entities (`data/scripts/projectiles/mass_polymorph.lua:6-22`). The status registry also clears cells causing a polymorph when activated (`data/scripts/status_effects/status_list.lua:88-121`). These are explicit exceptions and a loop-prevention signal, rather than proof that every entity is freely transformable.

Player, enemy and animal templates use DamageModelComponent and StatusEffectDataComponent. Base humanoids define fire chance and a long material-damage list; basic enemies override breathing; helpless animals have their own fire chance and shorter hazard list (`data/entities/player_base.xml:132-161`, `:268-272`; `data/entities/base_humanoid.xml:165-181`, `:208-212`; `data/entities/base_enemy_basic.xml:20-33`; `data/entities/base_helpless_animal.xml:145-176`, `:208-212`). Shared machinery produces different susceptibility from data. It does not mean every enemy drinks, burns or drowns identically.

The herd CSV has 35 herds and 1225 directed relation cells. Of 595 unordered herd pairs, 133 have different values by direction (`data/genome_relations.csv:1-36`). Higher relation is good according to the shipped docs; aggression and AI detection are additional inputs (`external/tools_modding/component_documentation.txt:210`, `:2669`; `data/entities/base_enemy_basic.xml:3-17`). Healers may target friends, and own-herd counterattacks can be disabled (`external/tools_modding/component_documentation.txt:133-143`). Exact target selection remains native. Tags alone do not explain Noita faction fights.

Projectile fields can permit friendly fire, delay shooter collision or exempt the player (`external/tools_modding/component_documentation.txt:2267-2275`). A tablet itself declares never-hit-player (`data/entities/items/books/base_book.xml:35-40`). Universal consequence is a useful YAIR design goal, but the claim that Noita has no exceptions is false.

## Brief secrets and gates

There are 13 numbered orb templates and 32 book XML templates including bases, which are file inventory counts rather than reachable world counts. Orb first discovery loads a spell card; prior discovery or a daily run loads a heart. IDs at or above 100 load evil hearts. All-time discovery flags and run boss-state checks are distinct (`data/scripts/items/orb_pickup.lua:21-68`). Knowledge progression and current-run progression are therefore separate useful models.

Tablets are physical, throwable books with a tablet tag (`data/entities/items/books/base_book.xml:1-40`). The altar looks for physical tablets within range, converts them to gold and increments its offering history. After more than two offers, a seeded roll may spawn three monsters (`data/scripts/magic/altar_tablet_magic.lua:249-318`). The same artifact can carry lore and participate in world interactions. This bounded review establishes scripted place/history gates, not every glyph puzzle, ending or the dates on which the community discovered secrets.

## Proposed YAIR mapping

| Noita concept | E4/shared vocabulary use | Boundary |
|---|---|---|
| Stain level and causing material | Body instance tag deltas; cause in chain log | Keep coating amount distinct from tag strength and visual coverage. |
| Contact vs ingestion | Existing contact kind `touch` vs `use`, with an explicit drink action context | No new vocabulary is accepted by this audit. |
| Dose tiers | `when` facts plus named rule outcomes | Do not apply every tier cumulatively by accident. |
| Effect duration/exclusivity | Existing expiry and proposed tag stacking/cancels | Give scripted reversal its own rule and save state. |
| Material inventory mixture | Container instance quantities, contact `mix` | Capped item keys are not a mixture database. |
| Body template swap | `transform` of body while person stays stable | Identity retention is our proposal and needs save/reload/import proof. |
| Herd relations | Directed faction facts plus aggression/needs | Avoid encoding a full relation matrix as material tags. |
| Orb/tablet knowledge | Stable `fact` knowledge and separate world history | A lore reward is not automatic prestige or a reset. |

## Twenty small touches, all proposals

- **BW-T1.** Keep wetness separate from clean: rain cools a body without removing every social stain. Source basis: BW-F1.
- **BW-T2.** Give oil two contexts: loose fuel burns; a fresh body coating can briefly shield ignition in a Noita-like world. Source basis: BW-F1.
- **BW-T3.** Show coat and drink outcomes separately in the material notebook. Source basis: BW-F2.
- **BW-T4.** Offer a small sip and a full drink with explicit dose, time and known outcome ranges. Source basis: BW-F2.
- **BW-T5.** Use tiered drunkenness: a small dose loosens speech, a large dose adds sickness. Source basis: BW-F3.
- **BW-T6.** A bottle can hold water and oil with separate amounts instead of converting both to a generic potion item. Source basis: BW-F4.
- **BW-T7.** Mixing may take time; shaking speeds the reaction but may trigger a volatile output sooner. Source basis: BW-F4.
- **BW-T8.** A cracked flask leaks into its place; breakage spills the remaining exact contents. Source basis: BW-F4.
- **BW-T9.** A powder pouch can scatter salt or coal but offers no drink verb. Source basis: BW-F4.
- **BW-T10.** A polymorphed body changes movement, food needs and available verbs while the person keeps knowledge. Source basis: BW-F5.
- **BW-T11.** Transformation consumes or clears its causing coat to prevent an immediate loop. Source basis: BW-F5.
- **BW-T12.** An unusual meal can give a timed resistance, distinct from learning a recipe or gaining permanent power. Source basis: BW-F2.
- **BW-T13.** A faction may tolerate another faction that still hates it: relations can be directed. Source basis: BW-F6.
- **BW-T14.** Keep aggression and relation separate: a hungry aggressive beast attacks sooner than a calm member of its herd. Source basis: BW-F6.
- **BW-T15.** Apply the same rain and fire rules to named NPCs, with body-specific immunity checks. Source basis: BW-F6.
- **BW-T16.** Display friendly-fire and self-hit rules on a technique instead of promising all hazards are universal. Source basis: BW-F6.
- **BW-T17.** First discovery of a hidden relic teaches a technique; later visits give a modest local resource. Source basis: BW-F7.
- **BW-T18.** A lore tablet can be read, thrown or offered at a shrine; each route consumes or keeps the same item explicitly. Source basis: BW-F7.
- **BW-T19.** Repeated shrine offerings change the next result and expose the count in the causal log after discovery. Source basis: BW-F7.
- **BW-T20.** Track discovery knowledge separately from current-world collection history. Source basis: BW-F7.

## Coverage receipt

Counts are declaration counts before inheritance: 468 active material declarations; 70 legacy contact-status attributes; 65 explicit liquid-stain attributes; 21 materials with structured stains and 23 structured stain-effect rows; 132 materials with ingestion, 133 ingestion blocks and 149 ingestion-effect rows. `meat_slime_cursed` has two ingestion blocks. Commented XML was excluded by the XML parser; the inactive BRAIN_DAMAGE Lua row was excluded before status counts. These are not counts of runtime edible substances.

Eighteen status scripts were inventoried. The status registry was fully read; hearty start/end and relevant effect templates were inspected, rather than claiming every custom effect script was reconstructed. The companion [BODY_WORLD_FINDINGS.json](BODY_WORLD_FINDINGS.json) gives source inventory, counts, N-code verdicts and opaque gates. No native engine code was decompiled in this worker scope; no behavior was played.
