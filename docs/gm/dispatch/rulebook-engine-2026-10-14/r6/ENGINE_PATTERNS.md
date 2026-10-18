# R6: tag decks, faction turns, moves and projects

2026-10-14. **Research and proposals only.** No runtime implementation, migration,
build, browser proof or accepted product decision. This extends RB1, RB2, RB7,
EP6-EP8, EA8, GM2-GM4, NB3/NB4 and L2-L4 in the
[root palette](../../../../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md).
It does not advance L4 ahead of the ER8-A4 director trial. Standing world order,
one-realm/one-prestige delivery and current playable gates remain in force.

SHOWN = read directly in captured text or current source. INFERRED = proposed
YAIR design. UNKNOWN = no selected rule, consumer or evidence. All R6-P rows,
save sketches, example tags, costs and tests below are INFERRED. Tests are proposed
acceptance cases, not results. Code line locators are this checkout's research
snapshot and may move during concurrent work. The companion
[report](REPORT.md) records actual checks.

## R6-S: sources and exact references

Used the [deep-dive playbook](../../../../research/SOURCE_DEEP_DIVE_PLAYBOOK.md)
M1 catalog, M2 rules-to-engine and M5 synthesis. Searched with the library's
`search.py`, then checked core procedures directly in its private text. This is
bounded reading, not complete reading of four books. All relevant catalog pages
are preserved for later readers without claiming every entry was examined.

Printed pages below are followed by one-based PDF pages. The library search
reports PDF pages. Exact packet references are private, including all published
names, tables and rule text; the public proposals are paraphrased and original.

| Code | Edition and primary record | SHOWN source and private packet |
| --- | --- | --- |
| R6-S1 | Stars Without Number Revised Free Edition, captured `StarsWithoutNumberRevised-FreeEdition-122917.pdf`; [publisher listing](https://www.drivethrurpg.com/en/product/230009/stars-without-number-revised-edition-free-version) | World tags printed132-161 / PDF136-165; factions printed211-226 / PDF215-230. [Exact packet](private/SWN_TAGS_AND_FACTIONS_EXACT.md) |
| R6-S2 | Worlds Without Number Free Edition, captured `WorldsWithoutNumber_FreePDF_040221.pdf`; [publisher listing](https://www.drivethrurpg.com/en/product/348809/worlds-without-number-free-edition) | Location tags printed147-219 / PDF150-222; faction rules printed324-333 / PDF327-336, background actors334-335, opening major projects336. [Exact packet](private/WWN_TAGS_AND_FACTIONS_EXACT.md) |
| R6-S3 | Godbound Free Edition, captured `Godbound_FreeVersion-062516.pdf`; [publisher listing](https://www.drivethrurpg.com/en/product/185959/godbound-a-game-of-divine-heroes-free-edition) | Influence/Dominion printed126-133 / PDF128-135, advancement19 / PDF21, rewards103 / PDF105. [Exact packet](private/GODBOUND_INFLUENCE_DOMINION_EXACT.md) |
| R6-S4 | Ironsworn Core Rulebook, captured `Ironsworn-Rulebook.pdf`; [author distribution](https://shawn-tomkin.itch.io/ironsworn) | Core dice/tracks printed8-18 / PDF19-29; all moves49-109 / PDF60-120; all oracles165-191 / PDF176-202; scene challenge234-235 / PDF245-246. [Exact packet](private/IRONSWORN_MOVES_TRACKS_ORACLES_EXACT.md) |

[Private reading notes](private/READING_NOTES.md) distinguish checked procedures,
mechanical full-range capture and unresolved wording. [Packet manifest](private/PACKET_MANIFEST.json)
contains source/page hashes; [rebuild script](private/build_packets.py) only reads
existing library text. Four packets preserve 243 pages. No new source was acquired.
Publisher links identify editions, not a claim of live website verification.

Dungeon World is excluded from this synthesis: R3 has an in-progress repository
capture receipt, but no delivered source-readiness report at the initial check.
No Dungeon World rules or fronts are supplied from memory. EP6 below has direct
support from Ironsworn's own progress/countdown scene procedure.

## R6-P1 / RB1, EP8, GM3, L2: a five-slot tag deck

SHOWN R6-S1 printed132 and R6-S2 printed147: combine thematic tags and use five
kinds of adventure components. Their role is creative preparation, not an automatic
simulation. Ten new YAIR cards below use that structure. They are optional authoring
examples for an original settlement, not facts about Village or any sealed world.
A selected world may use a different tag count or blend rule; two is a useful trial
setting, not a global ceiling.

### Format and live seam

Keep three identities separate: a registry **presence tag**, a **theme card** with
five slots, and a **table** that selects candidates by tags. Do not put slot arrays,
weights, clocks or behavior on `TagRegistry` definitions. SHOWN
`src/tag_store.js:33-47` accepts only id/kind/parents/revision/visible, and
`src/tag_store.js:136-157` tracks entity membership.

The proposed theme-card/table envelope is:

```json
{
  "schema": 1,
  "id": "r6.theme.borrowed_noon",
  "revision": 1,
  "classification": ["r6.kind.theme", "r6.setting.settlement"],
  "slots": {
    "enemies": {"all": ["r6.slot.enemy", "r6.theme.borrowed_noon"]},
    "friends": {"all": ["r6.slot.friend", "r6.theme.borrowed_noon"]},
    "complications": {"all": ["r6.slot.complication", "r6.theme.borrowed_noon"]},
    "things": {"all": ["r6.slot.thing", "r6.theme.borrowed_noon"]},
    "places": {"all": ["r6.slot.place", "r6.theme.borrowed_noon"]}
  },
  "table": {
    "id": "r6.tags.settlement", "revision": 1,
    "query": {"all": ["r6.kind.theme", "r6.setting.settlement"]},
    "baseWeight": 1,
    "reason": "eligible settlement theme"
  }
}
```

Register every query leaf before use. Theme-card entities and component entities
get their own presence memberships; a definition merely existing does not enroll
an entity. Each component row, stored outside TagStore, has a stable id, revision,
classification tags, integer weight/reason, eligibility predicate, typed binding
(e.g. registered actor/stock/site or authored scenario template), and text grammar
slots referencing fact IDs. The table query filters memberships; it never lists
all candidate IDs. A new appropriately tagged row joins without changing the table.
An enemy role is potential opposition, not an unconditional hostile actor.

| Code | GR7/GR8 table step | SHOWN seam | Needed addition, INFERRED |
| --- | --- | --- | --- |
| R6-T1 | Query eligible theme/component memberships | `src/tag_store.js:181-195` supports string leaves and all/any/not; omitted observer reads truth | Join matched IDs to external card data and evaluate legal bindings. This is not a standalone table compiler yet |
| R6-T2 | Use the same query in legality rules | `src/rule_modules.js:34-38` compiles object leaves `{tag:id}`, unlike TagStore's string leaves; `src/rules.js:3-29` preserves unknown facts | One validated AST adapter between these two existing dialects. Never pass string leaves straight into `compileTagQuery` |
| R6-T3 | Apply core → world → region → actor → director overlays | `src/rule_modules.js:14,47` names layers; `src/rule_modules.js:77-92` offers scoped compilation and locks for its current resolver | Reuse scope/order concepts. A table overlay compiler is still needed; current modules only admit `village.mix@2` (`src/rule_modules.js:42`), so this is not a working table API |
| R6-T4 | Draw themes, then five component roles without changing unrelated draws | `src/gen_kit.js:44-77,96-122` provides canonical addresses, integer draws, weighted and stratified picks | Address role and subject independently. Stratify by role/theme where category shares must survive pool growth. A selected theme's own ID is an identity input, not a hardcoded pool list |
| R6-T5 | Validate a blended scene and freeze observed results | `src/gen_kit.js:169-180` offers bounded attempts/fallback receipt; `src/tag_store.js:197-233` preserves saved registry authority | Typed compatibility checks, named quiet fallback and saved full generated values/bindings. Tag snapshots alone do not freeze a scene or persist effects |
| R6-T6 | Project a discovered opportunity | `src/tag_store.js:77-114,176-189` separates visible tags and hidden/unknown query facts; `src/simulation.js:419-428` inspects/discovers saved events | Engine eligibility reads truth; display reads observer knowledge. Do not expose truth-side candidate lists or reasons through a query inspector |

An overlay stores ordered add/remove/reweight operations selected by tag query,
with stable operation IDs, revision, authority and reason. Reject ambiguous equal
priority operations; sort ties by code point. Preserve at least one legal quiet
result after removals. Existing rule-module scope does not include every life/branch
field, so the adapter must supply those bindings explicitly. Do not mutate a shared
registry to implement a temporary personal overlay.

### Ten YAIR-original cards

Each cell is an authored component concept. Production content would give it the
row fields above and actual legal bindings. Table text is design data, not literal
UI text and not permission to create stock or people. These have no published tag
names or copied tag entries.

| Code / theme ID and title | Enemies | Friends | Complications | Things | Places |
| --- | --- | --- | --- | --- | --- |
| R6-O1 `borrowed_noon`, Borrowed Noon | Timekeeper selling overlapping work hours | Apprentice comparing shadow marks | Two workshops hold valid claims to the same bell hour | Brass dial bearing both reservations | Roof garden used as a public sundial |
| R6-O2 `mended_paths`, Mended Paths | Contractor billing for a bridge never repaired | Ferrier preserving a safe foot crossing | Fixing the main road diverts customers from a helpful hamlet | Plank stamped with the wrong inspection date | Toll booth converted into a repair bench |
| R6-O3 `wandering_kiln`, Wandering Kiln | Dealer swapping fired pieces before inspection | Potter carrying sample tiles | The kiln's planned stop conflicts with a harvest route | Heat-marked clay route token | Portable firing yard beside a dry canal |
| R6-O4 `rain_receipts`, Rain Receipts | Collector demanding payment for unreceived water | Cistern tender keeping honest measures | Last season's receipts promise more than the repaired pipes can carry | Split measuring cup kept as evidence | Covered well where neighbors reconcile allotments |
| R6-O5 `quiet_engines`, Quiet Engines | Overseer hiding skipped maintenance | Night mechanic who recognizes an uneven hum | A safe shutdown cancels the day's useful public service | Spare flywheel with a repair history | Engine shed beneath a communal bath |
| R6-O6 `second_harvest`, Second Harvest | Broker buying the same crop from two owners | Gleaner mapping overlooked patches | Extra yield needs hands already promised to another farm | Basket with rival ownership knots | Orchard grown along an old boundary ditch |
| R6-O7 `returning_lessons`, Returning Lessons | Tutor charging for skills they cannot demonstrate | Former student teaching a working method | A popular lesson assumes equipment the school no longer owns | Practice board with dated corrections | Classroom sharing space with an evening workshop |
| R6-O8 `lantern_routes`, Lantern Routes | Guide moving route lights to favor a patron | Lamplighter keeping a safe return path | Conserving oil leaves one route usable only in daylight | Hooded lamp with a reliable fuel gauge | Sheltered junction with three signal hooks |
| R6-O9 `common_drawer`, Common Drawer | Custodian lending an already reserved tool | Repairer who records every returned part | A replacement tool fits one local bench but jams another | Reversible clamp with two sets of wear marks | Shared tool room beside the hiring board |
| R6-O10 `patient_ferry`, Patient Ferry | Wharf agent booking cargo beyond capacity | Boatwright offering an honest delay estimate | A later safer crossing misses a buyer's opening hours | Load ticket annotated by the actual crew | Waiting platform with a visible water gauge |

Blend R6-O1 + R6-O9 into one scene: the drawer's clamp is needed during two
legitimately overlapping work reservations. A player can inspect the schedule,
help repair a second clamp, negotiate another hour or decline. Bind to one actual
site capacity and one actual stock item; never grant a duplicate clamp through
both theme slots. Alternatives remain reachable through causal prerequisites.

**R6-P1 save/compatibility.** Store a selected table/overlay revision and scope,
theme refs, generated component **values** plus owner bindings, first-observed
revision and receipt refs. Retain immutable snapshots or an admitted archived pack
for referenced templates and grammars. A seed+ID alone is insufficient after an
entry is removed. Optional TagStore snapshot uses its existing schema1 reader,
whose saved definitions remain authority. Keep unknown IDs opaque, report them to
the integrator and block affected writes instead of replacing revealed facts.
Old saves have no deck record and remain inert; opt-in anchors at current supported
time with no past scene generation.

**R6-P1 smallest playable test.** One optional workshop request uses two themes
and exactly one legal clamp/reservation. Read the schedule, reserve a real slot,
finish the repair and see a changed later action. Cancel a preview, reopen it,
Save/reload and literal-file Import on a fresh origin: same components, inventory,
reservation and next unseen pick. Proposed generator checks: 1,000 seeds with all
five roles either legally bound or named fallback, three golden seeds, new tagged
row joins unchanged query, hidden negation cannot reveal a fact, unrelated draw
addition leaves the scene unchanged.

## R6-P2 / RB2, GM4, EP6, L4: faction turns as a slow owner

SHOWN R6-S1 printed211-215 and R6-S2 printed324-326: relevant organizations own
attributes, assets, goals and an abstract budget. One action type per turn can
activate multiple assets; one action is not necessarily one asset. Their human
GM allowances do not automatically constitute engine legality.

| Code | Edition distinction, SHOWN | Engine implication, INFERRED |
| --- | --- | --- |
| R6-F1 | SWN chooses a starting faction and cycles its list; WWN rolls initiative per faction, high first | Save one initiative result/order per turn. Profile decides ties and any out-of-range die handling |
| R6-F2 | Their income formulas round differently and goal-abandonment penalties differ | Save profile id/revision; never combine their rules into an unnamed common formula |
| R6-F3 | SWN equal attack totals hurt both sides; WWN equal totals favor defender | Resolver references selected edition. Asset attack/counterattack and targeting come from that profile |
| R6-F4 | Budgets represent organization-scale capacity, not a fixed sum of character currency | A purchase/transfer needs a named conversion and actual stock owner if it touches personal money/items |
| R6-F5 | Their default cadence is about a month or adventure; PCs can change faction circumstances outside that turn budget | Cadence and interference become declared world rules and caused state changes, not timer ticks or retroactive rewrites |

**State.** One optional owner per world instance/continuity and branch, holding
profile revision, clock binding, turn ordinal, due local time, phase, stable turn
order/cursor, faction IDs, goals, abstract treasury, stats and asset refs. Assets
retain identity, location/access, condition, upkeep debt and availability. A real
NPC/tool/shop bound to an asset keeps its existing person/inventory owner. A faction
summary does not duplicate those resources. Save pending command/job refs, not a
second copy of their frozen effects. The director can surface known consequences
but cannot spend the faction's treasury or force an incident by inventing an asset.
This preserves [ER8-P4 and ER8-A4](../../../../research/SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md#stores-and-boundaries).

**Actions and phases.** A profile provides the legal order for income, mandatory
upkeep, asset abilities, action, goal evaluation and news receipts. Persist a phase
cursor if work yields; process a turn transaction atomically if small. Candidate
policy ranks legal actions, then previews and commits a registered operation with
current expected sequence. Check actual location, target knowledge, access,
capacity and budget again before committing. Player interventions append causal
asset changes, invalidate unsupported unstarted actions and use declared completion
failure/refund for started jobs. They do not secretly reroll a frozen outcome.

SHOWN `src/simulation.js:89-116` already gates actor/target/world, participants,
occupancy and sites; `src/simulation.js:169-215` reserves costs and freezes effects,
context, outcome and job due time. `src/simulation.js:532-552` is an existing policy
loop choosing an eligible command/response. Reuse those contracts through a
faction adapter; an organization is not currently a registered person, so do not
silently manufacture an actor or bypass validation. Economy/asset-specific ledger,
legal actions and the adapter are needed, not provided by the incumbent controller.

**Cadence and catch-up.** In an original prototype, a local week could be the
selected slow interval; a faithful SWN/WWN profile keeps its chosen monthly/adventure
interpretation. Neither is selected here. Scheduled turns bind to eligible local
game time, world/life/instance/continuity and branch, never wall absence. Offscreen
detail and permission to advance time are separate questions. A dormant/frozen
world stays frozen without a selected clock policy. “Offline catch-up” means only
eligible elapsed time the host has already admitted. No new absence entitlement.

Reuse `src/simulation.js:464-484` boundary selection/settlement and
`src/expansion_engine.js:601-639` cloned-plan advancement, blocking choices and
512-boundary yield. Map local due times through the selected clock adapter before
comparing to the common clock. Within the new faction phase, use a saved profile
order and stable code-point tie rule. Recheck downstream event eligibility after
settlement; do not select against pre-settlement stock. Do not add one browser
interval per faction or use `src/simulation_clock.js:9` wall time as game time.

A catch-up batch stops at resource, contact, canon, travel, player choice or
eligibility changes. Yield with a retained remaining duration/turn-phase cursor;
never skip turns or compress unique consequences to fit a cap. Batch repeated
income only if no intervening cost, threshold or other state could change it.
The same elapsed admitted time must match split, jump and yielded execution.
Knowledge-filtered return news cites actual cause receipts; no report of hidden
moves merely because a faction acted.

**R6-P2 save/compatibility.** Proposed `factionTurns` entry in the common optional
owner below. In-flight turns retain profile, order, phase/cursor and due time;
failed publication must leave income, upkeep, actions and cursor unapplied.
Admit new records only on explicit content opt-in. Anchor at current eligible local
time; do not roll income from before activation. No FacCred/Treasure-to-coins
conversion without an authored rule. Legacy saves/decks keep old readers and RNG.
Removed faction definitions preserve data and stop only affected advancement.

**R6-P2 smallest playable test.** Two original local guilds each have one actual
asset and one goal. The player funds one repair through legal stock/currency; the
next admitted slow boundary changes the repaired ferry's later travel offer.
A return report names the known repair and cause. Compare one jump to several
small advances, including a yield mid-turn, and Save/reload/literal-file Import.
Fail storage write: no income, stock change or turn advancement leaks. Freeze the
world: no progress. Deplete upkeep, destroy a target before a pending job settles
and block at a player decision; all preserve their declared consequences. Source
math fixture Wealth2/Force1/Cunning1 produces different SWN and WWN income, proving
profile selection matters. This later L4 trial does not block the earlier director.

## R6-P3 / RB7, EP7, GM2, L3: moves and a consequence option for the director

SHOWN R6-S4 printed49-50: circumstance triggers a move; safe/certain actions need
no roll, and a repeated attempt needs a changed approach or situation. Printed8-9
uses d6+stat/adds capped at10, compared separately with two d10; beating two, one or
neither yields three outcomes. A challenge tie is not a hit. Printed105-109 offers
contextual consequences and oracle prompts. Printed165 explicitly depends on human
interpretation. An oracle prompt cannot, by itself, administer a game world.

**Needed pieces.** An optional narrative policy selects an eligible authored scene,
then a registered move definition validates the player's intent, means, target and
approach. Save one resolver profile and the real modifiers. Engine resolution
returns outcome plus consequences, not prose authoring authority. An optional model
may suggest a verb/binding, but validated authored bindings must work without it.
An Ironsworn-faithful dice profile and a YAIR-original probability profile can both
exist; they need different IDs. Do not call fixed arbitrary three-band probabilities
an exact reproduction of Ironsworn.

Reuse `src/storylet_deck.js:31-43` eligibility/cooldowns/open-instance checks and
`src/storylet_deck.js:51-76` paced selection/quiet result/receipts. SHOWN limits:
this code uses sequential draw state, tick ordinals and floating reweights, and
`src/storylet_deck.js:86-96` fixes the current deck schema. It is not already a
GR1-GR17 addressed-table implementation or generic EP7 policy system. Port only
new opted-in definitions with a versioned adapter; preserve current saved outcomes.
`src/gen_kit.js:185-194` supports pure peek/commit views, and
`src/rules.js:56-61` can retain a resolved outcome receipt, but neither spends
resources or publishes saves by itself. `src/simulation.js:134-150,169-215` supplies
cost validation and frozen-job semantics. The dice resolver remains a needed EP1
profile hook rather than a feature claimed to exist in this research.

A policy record needs definition/revision, scope/clock binding, next eligible check,
recent visible categories, cooldowns, attempt ordinal and pending event/receipt refs.
Include helpful and quiet outcomes. A turn with no legal storylet commits a quiet
receipt and due cursor, not a fabricated emergency. Layer policies per world/person
without giving either ownership of economy truth. A no-choice event and an actual
blocking decision retain their different host semantics.

### YAIR-original consequence table

This proposed 100-weight table illustrates authored effects, not a translation of
the published price table. Resolve legality first. Only affordable/applicable rows
participate; receipt stores effective integer weights and the reason. A deliberate
quiet **director** result is distinct from a move's **miss**, which must change
something meaningful. Weak hits use the move's own bounded cost choices; do not
roll this table again unless that move explicitly delegates to it.

| Code | Base weight | Original consequence | Required consumer/binding |
| --- | ---: | --- | --- |
| R6-C1 | 25 | A work slot moves later | Change one actual reservation/deadline under a registered reschedule rule; retain a reachable alternate hour |
| R6-C2 | 20 | A borrowed tool needs repair before return | Actual tool owner/condition and repair route; no duplicate item or invented ownership |
| R6-C3 | 15 | A witness asks for a demonstration | Add a specific known evidence gate to a later offer; completing demonstration removes it |
| R6-C4 | 15 | The chosen route becomes temporarily harder | Advance a local obstruction track with a named clearing action; do not rewrite a frozen route's geography |
| R6-C5 | 15 | The attempt consumes extra expendable material | Atomically spend a quoted amount of owned stock; unavailable stock removes this row before selection |
| R6-C6 | 10 | A rival gets an opportunity | Add one eligible faction proposal/cause at its next permitted boundary; do not grant an automatic faction success |

Base weights total100. A filtered pool can total less and is renormalized by the
integer picker; original labels are not guaranteed percentile ranges after filtering.
If all rows are inapplicable, a named authored fallback advances a scene-specific
setback track and opens a supported recovery action. Validate that fallback at
admission; do not assume it is always safe. If there is no legal consequence,
reject/hold the move before spending rather than resolving a meaningless miss.
Player-selected weak costs stay as a saved pending choice with alternatives and
any already-paid inputs reserved. Reload must not erase the cost or select again.

### EA8 nested tables and interpretation

Store a finite table graph with `id@rev`, typed subtable links, child roles and
combine policy, not executable callbacks. For example, a consequence role may
select a repair-cost detail, with its own address. Compile queries and validate
bindings before selection. Name duplicate handling per table: dedupe the same
stock reference, sum costs only once when intended, or escalate through a defined
severity band. Never charge two copies of the same material because two roles
resolved to it.

Proposed first-trial budgets: nesting depth2, at most8 draws per resolution,
three candidate validation attempts and one admitted fallback. A child address
includes its parent row, role and attempt. Reject graph cycles at pack validation;
cap dynamic expansion too. Human reroll/unbounded interpretation instructions in
the book become explicit authored policies here. This bound is a YAIR adaptation,
not an assertion of exact source fidelity. Preserve child receipts, rejects,
fallback count and combined effects. No recursive generation during render.

Oracle use follows the same separation: answer an unresolved, scoped question,
apply a validated binding, freeze its truth, then reveal through knowledge. An
oracle cannot overturn observed facts, bypass a known answer or introduce arbitrary
world laws. Open-ended prompts without a legal authored interpretation are UNKNOWN
and remain authoring aids. World truths and actor beliefs use separate records.

**R6-P3 save/compatibility.** Save policy and resolver revisions, canonical context
snapshot/modifiers, address/ordinal, dice or selection result, consequence tree,
frozen registered effects, publication cause and pending cost-choice state. Policy
is optional and absent on old saves; no past events, hidden free retries or recast
legacy rolls. Do not switch a pending move to new weights after a pack patch.
Saved choices use the admitted old pack or retained effect snapshot. Current storylet
schema stays with its current reader unless separately migrated.

**R6-P3 smallest playable test.** One repair attempt offers an ordinary safe route
and an optional risky shortcut. Strong grants the quoted repair; weak grants it
with one legal selected cost; miss creates the repair/setback route and preserves
the object. Exercise each outcome using isolated deterministic fixtures, then show
each through the real player route. At action score5, challenge pairs(2,4), (2,7),
(7,9) exercise all three. Equal5 must fail that comparison. Reopening previews,
Save/reload and literal-file Import preserve dice, costs and next event. Show quiet
and helpful director picks; invalid target/resource cannot resolve. A nested fallback
must stop within budget; doubles on a price-table roll do not automatically apply
a challenge-dice twist. No live proof is claimed here.

## R6-P4 / EP6: one track primitive, separate progression and completion policies

SHOWN R6-S4 printed14-18 uses ten four-part boxes; progress score counts only
full boxes. Printed234-235 uses that alongside a four-box countdown in the same
scene. Countdown filling triggers resolution, not automatic success. A progress
roll can be attempted early and ignores momentum; even a full track is not a
certain result. This directly supports common storage without conflating meanings.

**Needed primitive.** A track is an integer amount/capacity plus owner, unit,
advance rule and completion policy. A vow's forty quarter-box units, a four-step
setback count, a faction project and a timed deadline can share validation and
causal receipts. They do not share automatic advancement. A purely event-driven
track has no due time. A clock that means elapsed time must name its clock/unit
and permitted support windows. Do not treat plot segments as elapsed minutes.

```json
{
  "schema": 1,
  "id": "r6.scene.bridge.repair",
  "definition": {"id": "r6.track.repair", "revision": 1},
  "ownerRef": {"domain": "scene", "id": "r6.scene.bridge"},
  "unit": "quarter_box",
  "value": 0,
  "capacity": 40,
  "advanceBy": "registered_action",
  "completionPolicy": "attempt_progress_roll",
  "status": "active",
  "appliedCauses": [],
  "settlementRef": null
}
```

The reference names are proposals, not current validator enums. A timed variant
adds clock binding, due local time, sampled-through cursor and integer fractional
remainder where conversion needs it. Event tracks do not acquire those fields.
A track policy maps rank to stride; the faithful Ironsworn profile uses its source
increments and floors quarter units for scoring. A YAIR construction project may
instead guarantee completion at capacity. Deadline, counter, progress attempt and
completion threshold remain explicit consumer policies on the same state shape.

Reuse `src/simulation_contracts.js:217-230` keyed simulation stores and JSON
validation; `src/simulation.js:213-215,464-484` frozen jobs, due-time scheduling and
once-per-removed-job settlement. `src/rules.js:20-29` supplies numeric eligibility
predicates. No shared general track API was established by the source name search;
this is a proposed small addition, not an existing exported helper. Need registered
advance/resolve operations and legal scope checks. Effects elsewhere, including
`src/active_effects.js:15-32`, retain their own durations and body/stat semantics;
a progress clock does not replace native effect timers.

One causal command can advance both progress and setback atomically. Its cause
must not apply twice after reload, re-observation or yielded catch-up. Keep exact
unsettled causes/obligations; compaction can use acknowledged monotonic producer
cursors when equivalent, not arbitrary recent-list trimming. Threshold resolution
has its own once-only settlement reference. A filled track does not recursively
reward on every scheduler check. Cancelling and restarting does not erase a price
or conjure completed history; profile-specific reopen/rollback rules are explicit.

**R6-P4 save/compatibility.** Optional `tracks` map with definition, unit, amount,
capacity, owner/bindings, status and cause/settlement refs. Changing capacity/unit
requires explicit conversion or retaining the old definition. Unknown policy refs
preserve data and block affected advances. No tracks added to old vows/jobs by
heuristic name matching. Old saves are inert until a selected consumer creates one.

**R6-P4 smallest playable test.** A real workshop repair advances progress from
completed legal work while weak/missed shortcuts advance a separate setback track.
The player sees both meters and can finish early under its declared policy. When
setbacks fill, resolve progress, then offer the applicable recovery route. Save,
reload and Import at a fractional progress value and exactly at threshold; neither
loses units nor settles twice. Compare event-driven work under equal split/jump
advancement; time alone must not fill it. Independently freeze a timed variant's
world and prove its deadline does not advance without supported time.

## R6-P5 / NB4, RB2, EP6: attention and durable world projects

SHOWN R6-S3 printed126-130 distinguishes an immediate act, sustained management
and durable change bought with a spent resource. Withdrawal may release control
or expose instability without erasing real history. Lasting change can still be
destroyed by actual opposition. Printed129-132 combines scope, magnitude,
resistance and prerequisite deeds, rather than treating any stated wish as a free
fact edit. Approximate area descriptions differ between prose and table; a faithful
map implementation needs a recorded ruling. Printed130 treats NPC changes through
GM adjudication; GR13 equal engine legality below is a deliberate YAIR adaptation.

**Needed project record.** Typed desired fact/effect, scope, relevant capacity/source,
quoted rule revision, dependencies, contributors, recoverable attention commitments,
spent durable-resource ledger and permanent completed work. A project can use R6-P4
for work but resource commitment and durable credit remain separate fields, not
synonyms for progress. Costless direct actions still pass their real gift/means and
target gates. An impossible/large project stays reachable through means, support
and deeds; no universal once-only limit is introduced.

SHOWN `src/power_models.js:23-34` already previews investment capacity/upkeep and
authority jurisdiction/termination; `src/simulation.js:125-145` validates owned
power and costs. These are useful hooks, not an Influence reservation or Dominion
project implementation. `src/rule_modules.js:42,90-94` provides generated-law kind
and locks only for its currently admitted resolver. New project/law effects need
an admitted resolver and fact vocabulary; a saved arbitrary predicate cannot mint
an authoritative law. `src/realm_traveler_profiles.js:1-5,63-70` uses owner-referencing
traveler snapshots, so crossing should consult original pool/commitment owners,
not create a second attention or durable-point balance per body.

A preview quotes scope/resistance/deeds and what withdrawing attention would do.
Commit reserves actual attention and spends approved resources exactly once. Pay
attention to shared contributors: one pool cannot back two projects beyond capacity.
On withdrawal, free only that contributor's attention; schedule supported causal
instability under the chosen policy, retain spent credit and all completed goods,
learning and history. Durable mode removes routine management need, not the world's
ability to attack it. Expansion uses revised scope/delta quote and fresh legal gates.
A faction can oppose via actual means; the director can reveal that opposition
only through an appropriate observation route.

**R6-P5 save/compatibility.** Proposed `projects` map holds profile/scope, typed
change, budget-owner refs, contribution/commitment refs, durable expenditure and
cause refs, prerequisite job/deed refs, work track ref, lifecycle and withdrawal
policy. Balances stay in their existing authoritative actor/faction resource owner.
No global attention cap, new currency or free monthly Dominion income is installed.
Absent projects stay absent on old saves. A content opt-in chooses resources and
anchors clocks; no back-payment or retroactive decay. Changes to a completed law
retain their frozen revision and a new caused amendment rather than rewriting it.

**R6-P5 smallest playable test.** One optional common tool service improves a real
repair offer. Commit one actual attention unit, verify a competing project cannot
reuse it, withdraw and observe the quoted supported disruption route while keeping
already repaired tools. In a separate fixture spend the durable resource: service
continues without attention until a real opponent/action disables it. Save/reload
and Import preserve free capacity, spent credit, work and withdrawal timing. Failed
storage write must leave every balance and fact unchanged. These are isolated
future trials, not authorization to add both now.

## R6-D: common save, generation and acceptance contract

**R6-D1 / save proposal.** All five patterns fit one optional versioned subtree
inside the existing expansion simulation envelope, keyed by a canonical full scope:

```text
simulation.rulebookPatterns = {
  schema: 1,
  scopes: {
    [scopeKey(world, instance, continuity, life, branch)]: {
      bindings, packRefs,
      tagScenes: {}, factionTurns: {}, directors: {}, moves: {},
      tracks: {}, projects: {}, receipts: {}
    }
  }
}
```

This is illustrative, not a new accepted schema. Persist independent root references,
not copies of live RNG owners. Keep balances/jobs/people in their actual existing
owners and save references where possible. Admission requires explicit validators,
export/import readers and a compatibility decision for each selected consumer.
New optional state is created only by authorized content opt-in, never by render or
legacy load. Unsupported data is retained and affected mutation refused. There is
no automatic stream-root migration. Frozen records retain an archived reader/value;
unseen addresses may use a new pack revision only under an explicit version policy.

SHOWN `src/tag_store.js:201-233` has independent saved-registry authority;
`src/simulation_contracts.js:221-239` validates schemas and person definitions;
`src/expansion_persistence.js:7-17,30-52` stages expansion/native changes in one
envelope before storage publication. Integrate with that publication route. Adding
a localStorage key or mutating live UI before publication would evade these owners.
A plain JSON roundtrip is not proof of real Save or literal-file Import.

**R6-D2 / GR conformance.** All generation adapters should use a canonical address
containing world, instance, continuity, life, branch, table/profile revision, subject,
role and ordinal/local game-time window. Reuse the existing root authority, not a
seed derived afresh from save content. GR fold corrections leave root migration an
integrator decision. `gen_kit.address` and `drawU32` provide mechanics, not scoping
or persistence by themselves. Preview/cancel never advances ordinals. Commit saves
values/causes atomically, freezes observed facts and stores grammar fact refs.

| Rules | Proposed enforcement |
| --- | --- |
| GR1-GR4 | Pure addressed generators, stable namespaced identities, full frozen revealed values and lazy unobserved bindings |
| GR5-GR6 | Separate truth/knowledge projection; bounded constraint attempts with an admitted named fallback and counter |
| GR7-GR10 | Query-tag membership, ordered overlays, code-point ordering, integer weights/reasons and id@rev receipts |
| GR11-GR13 | Trial budgets declared below, one useful registered consumer per pattern, NPC/player legal operations share means/stock rules |
| GR14-GR17 | Full world/life/branch scope, fact-bound grammars, seed/golden/persistence tests and local game-time addresses |

Trial budgets are proposals, not gameplay ceilings: one generated scene per eligible
check, up to2 theme picks +5 component picks across at most3 attempts (21 draws),
plus one zero-draw fallback; at most2 new detailed actors per scene. Nested move
resolution has its separate8-draw budget. First faction trial has2 factions and
one asset each, with at most one action type per faction per turn; yield rather
than silently drop due work. Content exceeding these trial budgets needs a declared
larger profile or staged generation, not an assertion that the option can never
exist. Generated data must reach an action/cost/gate before a generator is called
implemented gameplay. Receipt retention protects frozen/unfinished consequences;
only presentation-only recent history may be bounded without a semantic proof.

**R6-D3 / smallest sequence.** First reuse the existing ER8-A4 trial opportunity to
exercise one original scene with saved three-way outcomes and event-driven tracks.
Tag-based component selection joins when its table/adapter dependency is admitted.
Keep the safe authored route available. Slow factions and attention/durable projects
remain later independent trials. A lack of generic faction economy is not a blocker
for the director, matching ER8-P4. This research does not select or launch that work.

For any later UI claim, target rebuilt desktop1366x768 at a fresh test origin with
visible request, real action/cost, resulting changed offer or condition, and same
saved next value after reload/literal-file Import. Mobile optimization is deferred.
A proposed source test, extracted table or synthetic dice fixture cannot substitute
for that playable acceptance. Implementation and all native gates remain OPEN.
