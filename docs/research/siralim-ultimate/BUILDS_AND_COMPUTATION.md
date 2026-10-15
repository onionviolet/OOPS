# Builds, authoring and keeping chains finite

2026-10-14. Installed static data and shipped help only unless NATIVE_TRACE names a decoded body.

## Build layers

STATED (`localization/codex.csv:180,194-195,211-214`): the traveler supports a party of up to six creatures through specialization perks, knowledge and collections. A native creature trait, a fused-parent trait and artifact-granted traits are different sources. Fusion combines both parents' traits and averaged base stats, retains the primary visual body and adopts the secondary class/palette. Fusion eligibility has explicit errors for identical creatures and secondary Avatar choice (`ui.csv:527-533`). Exact race, training-scroll rounding and resource mutation need their consumers, not a wiki assumption.

STATED (`codex.csv:132-142`): each creature equips one artifact. Its typed slots cover stats, tricks, traits, a spell and a Nether stone. Tier raises property strength and opens slots; the help names a tier-50 ceiling. Unsocketing ordinary materials destroys them while Nether stones survive. Equipment therefore combines reusable sockets with source-specific recovery rules. A single generic "remove upgrade" command would hide a real cost.

STATED (`codex.csv:195,235`): projects unlock later specializations and the wardrobe switches among acquired options. Anointments can bring selected perks from other specializations. This is not proof every class perk can be imported freely. Compare with YAIRPG's acquired source, body support and local admission instead of importing a global class ban.

## Computation and legibility

STATED (`codex.csv:190-193`): battle startup has ordered phases for traits, identity, spells, conditions and stats before attack/cast effects. The help's numbering is internally ambiguous: its prose says battle truly starts at step 6 while the listed start step is 7. Keep that contradiction; native consumers must settle it before adapting exact order.

STATED: action families have per-turn limits, resurrection has a per-battle limit, and extra acquired traits have a battle limit. Calm Mode lowers several thresholds. Relics have named exemptions. These are local combat-chain rules, not justification for once-in-a-lifetime acquisition bans or caps on ordinary YAIRPG careers. Exact checks and queue behavior remain separate native questions.

STATED: a stat floor and diminishing stat growth keep numeric escalation bounded. Repeated-copy stacking is explicitly described per trait. Displaying events in sequence does not imply the simulation waits for every animation (`codex.csv:191-193`). Finite causal processing, presentation time and user-visible history should have distinct owners.

SHOWN content surface: 24 localization tables have stable tags, notes, English text and language columns. `traits.csv` contains 2,169 description-tag rows, `perks.csv` 661, `spells.csv` 1,494 total rows and `creatures.csv` 1,612 total rows. These are authoring/text counts. They are not reachable creature/trait counts. Definitions are compiled separately in named `scr_DatabaseCreature*`, `scr_DatabasePassives*`, `scr_DatabaseSpellGems*` and `scr_DatabasePerks` functions. Localization is not executable rule data or a public mod API.

## UI pattern

SHOWN/STATED: inspect text labels distinguish artifact versus temporary traits, ethereal versus permanent gems and sealed gems (`ui.csv:35-56`). Filters cover name, race, class, trait, fused state, knowledge, equipped state, rarity and favorites (`ui.csv:60-85,476`). The codex documents enemy inspection and chronological current/last battle history (`codex.csv:186,189`). There are named artifact comparison/draw functions. Native comparison calculations and live desktop readability are not established by text labels.

PROPOSAL SU-P02: one desktop inspector should show the same power grouped by actual source, owner and lifetime, with native usability and its known blocker. Keep the actor summary and selected trait visible together at 1366x768. This extends synthesis P04/P11 and K3/K9/K11/K14, with no second capability registry.

PROPOSAL SU-P04 (new extension to P14/P16): author one optional original local encounter with an explicit causal trigger queue and termination policy, and preserve trigger source/target in history. A repeated trigger needs a declared reason to stop, defer or reject, never silent loss of unrelated events. Existing simulation preview/commit remains the legality and publication path. A scheduler rewrite is not selected here.

## Native follow-through

SHOWN: `scr_Fuse` is the semantic merge body, separate from the palette cache. It records both parents, averages XP through a rounding helper, retains primary nickname, personality, GUID, strategy, macro and equipment references, and revises stable/party membership through helpers. It then calls `scr_UpdateCreature` and visual setup. Derived trait/stat realization and payment/custody need the constructor/update and UI callers; this is not a complete transaction audit. See NATIVE_TRACE N11.

SHOWN/INFERRED: the depth helper has a nonlinear depth curve, difficulty increments and mode multipliers. NATIVE_TRACE N12 gives the inferred formula and branch limits. This makes depth a numeric challenge axis, independently of realm identity and instability. No exact curve is proposed for YAIRPG.
