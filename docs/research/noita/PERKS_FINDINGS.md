# Noita perks and world rewrites

2026-10-09 static source audit. No game launch, save access or gameplay test.
Paths are archive-relative; `data/` resolves against the private extraction
`~/.codex/research/noita/data/`. All YAIR mappings are proposals.

## N8 verdict

**K1. Personal physics is confirmed; the fungal-shift claim needs correction.**
The active perk table contains persistent protection effects and blood-material
rewrites. Fungal shift is a separate reality-mutation mechanic invoked by a
strong TRIP status script, not a perk that temporarily changes materials.
The shift script calls `ConvertMaterialEverywhere` and has no duration,
expiry or reversal path. Its five-minute cooldown limits the next shift;
it does not describe how long the conversion lasts. Do not turn that cooldown
into an expiry in E4B. Exact persistence and newly generated terrain behavior
are native-engine gaps, not established by this Lua pass.

Evidence: `data/scripts/perks/perk_list.lua:931-979`, `:1280-1386`;
`data/scripts/status_effects/effect_trip_03.lua:1-24`;
`data/scripts/magic/fungal_shift.lua:119-133`, `:176-206`, `:225`.
Fungal Disease is a real perk, but its listed behavior loads a personal disease
entity and records a fungal pickup event; it is not the world conversion
function. `data/scripts/perks/perk_list.lua:1999-2023`.

## Catalogue and stacking counts

**K2. The installed table has 106 active perks.** A comment-aware scan of the
whole `perk_list.lua` excludes block-commented candidates such as freeze
protection. There are 55 records marked stackable and 51 marked nonstackable;
16 declare an explicit maximum and 29 mark repeated appearances rare.
Those totals include special entries outside the default perk pool.
They are catalogue counts, not availability or balance claims.

Source: `data/scripts/perks/perk_list.lua:1-3339` (whole file). Counts use active
`id`, `stackable`, `stackable_maximum` and `stackable_is_rare` declarations.

**K3. Repeat availability and the math of the effect are separate.**

| Concern | Source behavior | Evidence |
|---|---|---|
| Stack permission | A boolean; explicit cap disables future repeat eligibility once pickup count reaches it | `data/scripts/perks/perk.lua:13-28` |
| Pool multiplicity | Stackable perks can enter the deck more than once; `max_in_perk_pool` changes the range | `data/scripts/perks/perk.lua:81-113` |
| Rare repeat | Permits stacking but inserts only one occurrence per generated spawn-order deck | `data/scripts/perks/perk.lua:101-103` |
| Repeat spacing | Default minimum distance 4; a per-perk value can override it | `data/scripts/perks/perk.lua:67-68`, `:105`, `:119-139` |
| Default removal ceiling | Pool filtering uses default 128 for stackable perks with no explicit maximum | `data/scripts/perks/perk.lua:95-99`, `:143-156` |
| Pickup state | Increment run pickup count, attach permanent game effects and call custom function with the new count | `data/scripts/perks/perk.lua:203-245`, `:273-275` |
| Duplicate exclusion | `remove_other_perks` records related perks as picked up to remove them from the future pool | `data/scripts/perks/perk.lua:259-270` |

The default 128 is a pool-filtering ceiling, not proof that the engine refuses
a 129th forced pickup. The custom pickup function can still be called directly.
Similarly, stackable does not imply linear bonuses or independent instances.

## Personal-rule examples

**K4. Protection is persistent metadata plus engine behavior.** Fire,
radioactivity, explosion, melee and electricity protection all name game effects,
are nonstackable and usable by enemies. The pickup route loads those effects
with `frames = -1`. Lua confirms the named protections and persistence setting;
the exact damage-type bypass and interactions remain native behavior unless
verified elsewhere. Freeze protection appears inside a comment block and must
not be included as an active immunity perk from this table.
`data/scripts/perks/perk_list.lua:931-990`;
`data/scripts/perks/perk.lua:224-245`.

| Perk | What this source actually changes | Stacking operator |
|---|---|---|
| Slime blood | Blood and spray become slime; blood multiplier set to 3; slime slowdown protection; projectile multiplier multiplied by 0.75 | Blood fields are assignment, resistance is repeated multiplication |
| Oil blood | Blood and spray become oil; multiplier set to 3; fire protection; redundant fire-protection perk excluded from pool | Nonstackable; field assignment and persistent effect |
| Gas blood | Blood and spray become acid gas; multiplier set to 3; radioactivity protection; gravity multiplied by 0.75 | Nonstackable; assignment plus gravity multiplication |
| Extra HP | Max HP multiplied by 1.5 subject to positive cap; current HP receives the absolute max-HP change subject to max | Stackable multiplicative gain, not a flat additive bonus |
| Stainless armour | Named persistent game effect; stackable and rare | Math is native, so this pass does not supply its coefficient |

Evidence: `data/scripts/perks/perk_list.lua:1280-1319`, `:1322-1355`,
`:1358-1404`, `:583-611`, `:1018-1026`.

Blood perks illustrate why a single tag such as `resistant:3` can hide distinct
rules. Slime blood's repeated pickups do not create several simultaneous blood
materials; later assignment wins for the same component field, while resistance
can accumulate. Removal functions restore baseline blood/resistance/gravity
values explicitly. This audit does not prove correct composition of every
removal order or conflict between blood perks. Propose deriving active values
from owned modifiers rather than copying baseline-reset callbacks.
`data/scripts/perks/perk_list.lua:1307-1319`, `:1344-1355`, `:1388-1404`.

## Fungal shift as a world mutation

**K5. The conversion is selected from explicit pools and groups.** There are
18 source-group records and 32 destination records. Source groups deliberately
bundle variants: water includes static, salt and ice-water variants; oil groups
oil, swamp and peat; a gas group contains six named gases. These are explicit
lists, not automatic substitution based on identical tags. Weights differ,
including an extremely small weight for gold as a source.
`data/scripts/magic/fungal_shift.lua:3-59`.

The function normalizes the entity to its parent, checks a cooldown of
`60 * 60 * 5` frames, refuses shifts when the world EVERYTHING_TO_GOLD flag
is active, and stops after 20 successful iterations unless debug limits are
bypassed. It allows up to 20 attempts to select a conversion that changes
something. Iteration plus attempt index feed procedural-random coordinates.
The native `ProceduralRandomf/i` implementation remains outside Lua; the source
shows repeatable coordinate selection, not the full seed algorithm.
`data/scripts/magic/fungal_shift.lua:114-145`;
`data/scripts/lib/utilities.lua:25-41`, `:62-75`.

If the actor holds a potion or powder pouch, its main material can replace one
side with a 75% branch probability; another 50% branch selects source versus
destination. Held gold and holy grass destinations are usually redirected.
The resulting destination is checked for `[NO_FUNGAL_SHIFT]`, then rerolled
once if banned. That code is not a general claim that no banned material can
ever be selected through any route.
`data/scripts/magic/fungal_shift.lua:85-99`, `:146-174`.

For every material in the chosen source group, resolve native material IDs and
convert it everywhere if source and destination differ. Only after at least
one conversion succeeds does it increment iteration, remove the actor's TRIP
ingestion status, record last frame, print a message and attach one reality-
mutation UI icon. These receipts disclose a source material name; they do not
necessarily disclose every member of the group or the destination.
`data/scripts/magic/fungal_shift.lua:176-249`.

## Mapping to E4 and E4B

**K-P5. Keep personal rule, world mutation and world override distinct.** A blood
perk modifies what a body emits when damaged. Immunity modifies how the body
responds to a damage/contact event. A fungal-style mutation changes world
material identity through a native conversion operation. E4's scoped rule
layers can represent analogous behavior, but a one-time `transform` is not
identical to an enduring override of future material production. Specify both
stored contents and later emission behavior if YAIR wants that stronger effect.

**K-P6. Add stacking policy to the owned effect, not just to the acquisition.**
Propose fields for permission, cap, reappearance weight/spacing, and operator
(add/multiply/replace/max/unique). Give blood/emission rules an exclusive group
and explicit winner policy. Keep scope and lifespan independent: personal/world
are scopes; permanent/timed/one-off describe lifespan. E4's ownership and locks
still decide who can change a rule.

**K-P7. Preserve the cost of a personal advantage in the shared world.** Oil blood
can protect its owner while emitting fuel useful or dangerous to other people.
Propose applying immunity only to the owner and resolving the emitted material
through ordinary contact rules. NPCs can own the same personal rules where
world content allows it. The table's `usable_by_enemies` flags support reuse,
but do not prove every enemy receives every perk.

**K-P8. Make world mutations legible and replayable.** Propose a mutation receipt
with source profile/group, actual material IDs, destination, owner, stream draw,
world scope, iteration and reason. Keep the discovery stream for secret
selection and interaction for contact consequences, per shared vocabulary.
Whether the mutation expires or carries between lives is a separate world
policy. Neither Noita's cooldown nor the current E4 proposal selects it for us.

**K-P9. Use explicit groups as one recipe mode, not proof of universal substitutes.**
Fungal shift confirms that designers can group related materials and apply one
operation to them. It does not confirm that any two materials with the same
characteristics can replace each other in recipes. For YAIR, match recipe slot
profiles, then apply identity exceptions, purity, potency and harmful extra tags.
Keep that tag-substitution mode alongside canon recipes from E4B.

## Coverage and native boundaries

Deeply reviewed: fungal shift selection and conversion script; TRIP invocation;
perk pickup/stack eligibility and spawn-order sections; protection, blood,
Extra HP, Stainless Armour and Fungal Disease records. Counted all active
perk definitions; did not manually review every perk callback or every loaded
perk XML/entity script. No executable decompilation or runtime confirmation.

Native gaps: actual immunity math; persistent game-effect stacking; conversion
behavior for loaded/unloaded/future terrain and chained shifts; material
inventory main-material tie handling; ingestion threshold producing TRIP stage
03; save serialization of shift state; and damage/removal-order edge cases.
The report supports corrections and proposals, not a gameplay acceptance claim.
