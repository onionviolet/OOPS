# U8: Combat and conflict UI at scale

## CHECKPOINT

Complete, 2026-10-14. Read COMMON, AGENTS, PROJECT, user preferences, standing
UI direction, root codes, F3 and combat source. Reference research and proposed
CB palette are recorded below; [U8 report](U8_REPORT.md) owns delivery limits.
Only this file and U8_REPORT.md are owned. No source, tests, bundles, saves,
packs, root palette or sealed files were changed or opened for secret content.
Resume by checking the two owned files and live root palette before integration.

Status: design considerations, **INFERRED proposals**, not accepted mechanics.
Targets: **1366×768 and 1920×1080**. Visible outcome: player state, current
threat, escape control and readable recent feedback remain visible together;
larger fights add useful scope without pushing these below the workspace.
Mobile optimization, combat simulation changes and implementation are deferred.

Evidence: **SHOWN** = inspected source with lines or loaded page content,
not live gameplay. **STATED** = cited developer/manual/wiki description.
**INFERRED** = proposed transfer. **MEMORY** = unchecked recall, never proof.
External descriptions were checked on 2026-10-14. Historical posts establish
their described mechanism, not the exact current shipping UI. No game was run.

## Readout and incumbent

**F1. Scale should change the unit of attention.** Default to a player and
target pair for a duel, two readable rosters for a small party, squad/front
summaries for dozens, and objectives/formations for armies. Keep a selected
individual beside the player's local situation at every scale. More people
should not mean fifty copies of the current detailed enemy row. INFERRED.

**F2. Being in a battle is different from commanding it.** Show personal
danger, received orders and the larger battle separately. The UI needs to say
whether an action commands the player, their party, an assigned formation or
the army. An observed ally is not automatically controllable. INFERRED.

**F3. The old workspace finding and current source differ.** The density
[audit F3](../../../UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md#f3-combat-escapes-the-workspace-and-hides-the-log-and-retreat)
records combat below the docks, inaccessible retreat and little visible log
at both desktop targets. This is prior reported browser evidence; its images
were not reinspected here. Current SHOWN source registers Combat in center
and Stance & combatants in left through definePanel, and explicitly keeps
retreat in Local actions below them (`src/workspace_views.js:15-20`). Thus
"combat has no workspace module" is no longer supported by current source.
Conversely, registration alone does not prove retreat/log visibility in a
saved layout, nor does it close the audit's rebuilt-browser gate.

| Source code | SHOWN current behavior | Consequence for scale, INFERRED |
| --- | --- | --- |
| SF1 | `src/display.js:2774-2818` shows combat, can auto-switch to its tab, sets combat action geometry and appends travel choices to action_div. | Workspace routing must reconcile the legacy geometry and keep the exit near the encounter. No current visual defect is asserted from these lines alone. |
| SF2 | `src/ui/combat_display.js:44-55,136-200` creates a DOM fighter row per attacker/defender; non-special combat preserves the first attacker node. | Add selected-detail and group views rather than expand every row at 50. Preserve the player's persistent node/focus when changing view. |
| SF3 | `src/ui/combat_display.js:216-287` reads getFullStats and writes attack, speed, hit/AP, dodge/EP, defense directly. The attacker-zero stats are used in calculations; one-opponent displays differ from many-opponent displays. | Introduce an observer-qualified projection and named matchup. A single odds number cannot describe all many-vs-many pairings. Review displayed odds against selected pair before claiming correctness. |
| SF4 | `src/models/combat.js:38-54,96-124` supports attacker/defender arrays, supplied UI slots and special combat that may not involve the player. | Existing arrays are a useful seam, not proof of fifty-person or army support. Side, viewpoint and command authority need explicit UI meaning. |
| SF5 | `src/models/combat.js:179-208` updates attack progress through per-fighter loops; `src/ui/combat_display.js:176-183` adds an attack bar per enemy. | Cooldown progress is not proof of a readable intent telegraph. Group presentation should leave simulation timing untouched. No benchmark was run. |
| SF6 | `src/display.js:880-919,1010-1038` puts hits, misses, victory and defeat in message_combat, prunes that category above 80, groups dynamic loot separately and respects log-follow preference. | A large fight can evict its cause before review. Summaries must be derived before truncation, and important outcomes need their own retained record. |

Source observations cover these paths only, not every expansion combat adapter.
Existing panel-kit discovery, F6 navigation and saved-placement rules remain
the incumbent; this proposal does not create a second layout system. See
[Panel kit](../../../PANEL_KIT.md) and the
[nonhuman perception owner](../../../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md).

## References and transfer

The disposition column is a recommendation, not an accepted decision. Each
transfer is INFERRED. No third-party source code or assets are being copied.

| Ref | Evidence and mechanism | Transfer, cost and disposition |
| --- | --- | --- |
| CR1 Melvor / idle combat | STATED: [Melvor FAQ](https://wiki.melvoridle.com/index.php/FAQ) describes offline-combat settings and death from hits exceeding auto-eat thresholds or exhausted supplies. [V0.21 notes](https://wiki.melvoridle.com/w/V0.21) document offline combat with a specific dungeon pause exception. Historical exceptions need a live version check before adoption. | Adapt resource runway and explicit stop conditions beside automation. A safety estimate needs actual known inputs; average DPS alone cannot promise survival. Cost: resource and outcome accounting. |
| CR2 Darkest Dungeon | STATED: [official getting-started wiki](https://darkestdungeon.wiki.gg/wiki/Getting_Started) describes opposing ranks and skills dependent on position. [Red Hook overview](https://www.darkestdungeon.com/darkest-dungeon/about/) describes health and stress pressures. | Adapt opposing strips for small parties, with positional meaning only where combat has it. Keep health and morale/stress distinct. Park a fixed rank theatre at army scale; it cannot show every soldier. |
| CR3 Battle Brothers | SHOWN page / STATED developer: [2016 UI rework](https://battlebrothersgame.com/dev-blog-74-progress-update-reworked-ui/) identifies lost clicks, sluggish UI, excess scrolling and upcoming roster/formation needs. | Adapt the separation of roster planning from immediate action. Trial responsive selection and stable focus before adding density. Cost: selection/formation model; decorative skin alone solves none of the reported input issues. |
| CR4 Kenshi | STATED: [Lo-Fi overview](https://lofigames.com/about-kenshi/) describes squad control. SHOWN page / STATED historical [medical update](https://lofigames.com/medical-system-update-0-61-0/) distinguishes vital/nonvital body damage and worsening untreated injuries; severance is future work in that post. | Adapt a selected member's functional injury view and rescue needs, with squad summaries. Do not cite this old post as proof of current prosthetic UI. Cost: body-qualified condition data. |
| CR5 Mount & Blade, party and battle | STATED: [TaleWorlds order-of-battle post](https://www.taleworlds.com/en/Games/Bannerlord/Blog/114) distinguishes army commander, formation captain and ordinary warrior. Direct open failed; indexed developer text was available. [2021 development update](https://www.taleworlds.com/en/News/495) describes prebattle assignment, formation cards with count/type/ammo/morale, and slowed order entry. | Adapt party preparation before battle, formation state during it, and a clear authority badge. Critical model for player-as-participant. Cost: command scope and orders acknowledged/rejected. Slow-order time is an option only where the world clock permits it. |
| CR6 Total War | SHOWN page / STATED [official battle guide](https://wiki.totalwar.com/w/Mastering_Battles.html) describes unit-card selection and same-type selection. [Rome II manual groups](https://r2encv2.totalwar.com/en/manual/single-player/0082_enc_page_battle_play_phase_conflict_groups/index.html) states grouped cards sit under a numbered tab. | Adapt formation/group selection and drill-down at army scale. Keep player-local danger visible alongside it. Park whole-army commands when the player lacks that authority. Cost: useful groups and aggregation, not a new 3D battlefield. |
| CR7 RimWorld raids | SHOWN page / STATED [raid wiki](https://rimworldwiki.com/wiki/Raider) distinguishes raid strategies and attack/withdrawal behavior. Its equipment section warns that its linked data is outdated; no numeric balance data is used here. [Ludeon mechanoid preview](https://ludeon.com/blog/2022/10/biotech-preview-2-combat-mechanoids-pollution-and-super-mechanoid-bosses/) documents different enemy roles and deployed subunits. | Adapt threats by objective/approach, not only an enemy HP list: breach, kidnapping, fire, rescue. Track the threatened place/person. Cost: event-to-objective links. Exact raid UI placement is not verified here. |
| CR8 Dwarf Fortress reports | SHOWN page / STATED [Bay 12 development archive](https://www.bay12games.com/dwarves/) records grouped combat-report icons with expansion/recenter options in the 2021 entries, and later report persistence work. | Adapt a short consequence summary linked to detailed body/event history. Do not stream every anatomical event into the live pane. Cost: retained structured events; old archive entries do not prove current persistence behavior. |
| CR9 Final Fantasy XII gambits | STATED: indexed [publisher manual scan](https://gamingalexandria.com/ps2/Final%20Fantasy%20XII/Final%20Fantasy%20XII%20-%20Manual.pdf) says gambit order is priority; direct PDF retrieval failed. [Square Enix update](https://www.square-enix-games.com/en_GB/home/final-fantasy-xii-the-zodiac-age-pc-ps4-update) documents three saved gambit sets. | Adapt ordered condition/action policies and named presets, not mandatory scripting. Cost: priority/conflict explanations and legal action checks. Full manual is not claimed read. |
| CR10 Dragon Age tactics | SHOWN PDF / STATED [EA manual](https://eaassets-a.akamaihd.net/eahelp/manuals/dragon-age-origins-manuals_PC.pdf), printed pp.29-30: ordered conditions and actions, direct control of current character, tactics for other party members, growing condition/action slots. | Adapt explicit direct-control versus policy-control labels and readable rules. Cost: overrides, target resolution, fuel and cooldown failure explanations. Avoid requiring more rules just because the party grows. |
| CR11 MUD spam gags | SHOWN docs / STATED [Mudlet deleteLine](https://wiki.mudlet.org/w/Manual:Lua_Functions#deleteLine) removes a line in response to a trigger; [trigger introduction](https://wiki.mudlet.org/w/Manual:Introduction/en) describes pattern matching and highlights. | Adapt user-controlled filters and separate combat streams. Gagging text can hide a defeat or new mechanic, so preserve typed outcomes independently of display filters. Cost: structured event classification; text regex alone is brittle. |
| CR12 Cogmind | SHOWN page / STATED [developer log article](https://www.gridsagegames.com/blog/2014/02/message-log/) describes six recent lines, a further six in extended mode and expansion in place. Its sample screenshots are explicitly debug examples. | Adapt recent feedback plus reachable deep history. Counterpoint: Cogmind intends a secondary log beside a map, while YAIRPG text may carry the main causal explanation. Give it sufficient visible space. Cost: stable scroll/selection and retention. |
| CR13 Text-heavy JRPG logs | SHOWN PDF / STATED [Dragon Quest VII Nintendo-hosted manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/manual-3DS-Dragon_Quest_VII_Fragments_of_the_Forgotten_Past?_a=DATC1RAAZAA0), battle commands/settings: message speed, party/individual tactics and flee, whose failed attempt costs the party its attacks that turn. | Adapt pacing choices for readable narrative combat, with actor/action/result lines. Counterpoint: an advancing battle message is not a durable searchable log, and per-message acknowledgement would obstruct idle play. Cost: separate presentation pacing from simulated time. |

## CB palette: default plus dial

Every row is INFERRED and remains a consideration. Defaults are useful starting
points; dials preserve alternatives without granting information or authority.
Numbers below describe proposed presentation thresholds, not simulation limits.

| Code | Default | Dial | Root mapping |
| --- | --- | --- | --- |
| CB1 Combat home | One contextual encounter surface. Keep player, selected opponent, exit and at least five recent meaningful log lines visible together. Return to the prior pinned context when combat ends. | Expanded battle workspace with more roster/map space; compact encounter retains emergency controls and feedback. Preserve saved layouts. | ZN2, IN3 |
| CB2 Scale of view | Duel pair at 1; two rosters at 5; squads/fronts at 50; formations/objectives at army scale. Selected individual stays inspectable. | Pin individuals or choose roster/group/map view. View preference cannot merge distinct simulation entities or hide an urgent personal threat. | ZN2, SC5 |
| CB3 Command seat | Badge says "Self", "Party", "Assigned formation" or "Army". Mark observed-only groups and show received orders separately from issued orders. | Switch observation focus and command focus independently where supported; broader commands require actual authority. | IN7, DP1, MO3 |
| CB4 Conditions | Show decision-changing conditions first, with text/name, stack count and next expiry. Open details for source, scope, remaining stacks and interaction. Group repeated effects by mechanic. | All effects, harmful-only, pinned buffs, body-region or squad view. A summary says affected count, not "everyone" from an average. | SC5, CS3 |
| CB5 Telegraphs | Selected threat shows observed action, target/scope, time or phase, interrupt/response opportunity and uncertainty. Priority threats reach the one attention queue. | All known intents, personal threats only, or pause-on-known-critical where time rules permit. Do not equate cooldown fill with guaranteed intent. | SC5, DP1, CS7 |
| CB6 Combat text | Live consequence feed groups routine repeats, preserves causal links and allows detail expansion. Major injury, defeat, retreat failure and a newly observed effect remain distinct. | Full event stream, actor/category filters, per-encounter history, prose speed and search. Display filters never erase the retained outcome record. | IN3, SC5 |
| CB7 Party policies | MO3 tiers: simple stance/auto-use toggles, party role/resource grid, then ordered condition/action rules. Show active preset and why the latest rule fired or failed. | Per-member overrides, richer rules and named presets with a plain-language preview. Manual order explicitly replaces or temporarily overrides a policy. | IN7, MO3, DP1 |
| CB8 Exit and escape | Reachable fixed control near personal danger at every scale; text says scope, cost/time and known risk. If no normal route exists, show the reason and available alternatives in that same place. | Self/party/formation withdrawal, rescue-before-withdrawal, surrender or power escape where supported. Reachable never means guaranteed successful. | ZN2, SC5, DP1 |
| CB9 Powers in combat | Player powers show relevant fuel/charges/cooldowns as chips linked to their owned surface; encounter use stays beside target and consequence preview. Enemy powers appear as observed effects. | Pin a few powers, expand a powers list, or open the cheat surface in context. No new enemy power panel or above-grade name/stat leak. | CS3, CS7, ZN2, DP1 |
| CB10 Body and appraisal | Render relevant functions, carriers and senses for the focused body. Enemy readings say observed/estimated/unknown plus source and age. No universal humanoid anatomy or exact HP by default. | Rich anatomy for known bodies; legal appraisal/observation modes may improve readings. A different display preference never improves knowledge. | CS7, DP1, SC5 |
| CB11 Auto and idle receipt | Show active policy, resource runway at known grade, stop conditions and auto/manual status. Return digest lists elapsed time, outcomes, spending, injuries, interruptions and current state. | Encounter totals, selected decisive events, full retained history, or deliberate manual pacing. Offline and on-screen auto combat use the same outcome vocabulary. | IN3, IN7, SC5, DP1 |

## Layout from one enemy to armies

INFERRED layout proposal. "Beside" means simultaneously readable in the
encounter region, not a literal mirror of every opponent's detailed card.

| Scale | Enemy beside player | Battle layer and log | Personal control |
| --- | --- | --- | --- |
| 1 vs 1 | Two comparable cards: condition, current observed intent, relevant resources; exact stats only when known. | Recent causal lines under/alongside the pair. | Target/action preview, stance, power use and exit stay visible. |
| 5 vs 5, or 1 vs 5 | Friendly and hostile short rosters, selected pair detail. Target and incoming threats use stable IDs/names, not list position alone. | Five foes remain individually reachable without five full stat panels. Position/role only if mechanically real. | One target selection; party orders clearly distinct from self actions. |
| 50 vs 50 | Player and selected threat beside squad summaries, with affected/active/downed counts and spread of condition. Named endangered allies stay pinned. | Group by front/role/order, inspect a member list inside its region. Reports summarize the encounter rather than flood live text. | Command only owned groups; rescue and local withdrawal stay visible. |
| Army | Local player pair plus formation cards and objectives, with separate local and reported distant state. | Fronts, morale, ammunition, losses and order status where those systems exist. A whole-army average HP is a poor substitute for a collapsing flank. | Army/formation commands only if authorized; otherwise received order, contribution and local options. |

At **1366×768**, use the root's shared center/context arrangement with player
and selected threat side by side, roster in a bounded reading region, and
fixed encounter controls outside its scrolling content. Keep Local actions
useful and reserve visible log height. When several details compete, selection
changes the detail region rather than stacking new panels below it.

At **1920×1080**, the root's separate contextual column can show the encounter
beside Local actions and the records/log column. Extra width supports group
overview plus selected detail; it should not become empty padding around one
enemy. A large battle view may occupy more board space by choice, while the
player strip, exit and feedback remain visible. These are proposed layouts,
not measured pixel fits or runtime claims.

## Rules that keep aggregation truthful

**CB4 detail.** A poison chip might say "3 stacks, next tick soon" only if
that timing is known. Details distinguish additive stacks, separate sources,
refreshing duration, caps, suppression and resistance. A squad chip reads
"poisoned 3/12 observed" and opens the three affected members. Do not let
buff churn reorder focused controls. Text/icon meaning must survive color or
motion being disabled.

**CB5 detail.** Telegraphs distinguish winding up, targeting, committed,
interrupted and merely suspected. An offscreen report has sender and age;
it does not create a current global targeting preview. Enemy count is
"12 seen, others unconfirmed" when the player lacks a full census. Alerts
rank by personal danger, threatened objective and response window, with a
quiet remainder count. No separate blinking queue per squad or cheat.

**CB6 detail.** Aggregate by encounter, time window, actor/group and event
kind. Keep lethal spikes and first observations out of routine averages.
Illustrative invented row: "West squad took 14 hits; Mira fell; 2 charges
spent. Open cause." Expand to the observed sequence. Keep actual loss,
recovery and revived-after-defeat separate, so a net-zero HP change does not
erase a consequence. Store or compute digests from structured events before
the current 80-line combat cap discards them. Use bounded retention with a
visible limit, not a promise of infinite history.

**CB7 detail.** A rule preview reads "If a controlled ally's observed health
is low, use one available heal; reserve the last charge." Show priority,
target tie-break, fuel, cooldown and scope. Invalid/unknown conditions do not
silently become true. Explain "no valid target", "cannot reach", "reserved
fuel" or "order not accepted". Rate limits/hysteresis can prevent oscillation.
UI rules do not invent party obedience, legal reach or unlocked means.

**CB8 detail.** Retreat from an army can mean leaving personally, withdrawing
the assigned formation, or ordering the army to disengage. The receipt names
which happened and who remains. An unconscious body or rooted being may need
rescue, detachment or surrender; a grey exit explains why rather than vanishing.
Policy emergency actions and manual exit must use the same actual route rules.

**CB9-CB10 detail.** Player power previews show target, fuel, known drawback
and actual reach. Enemy display can say "wound closed again" without naming
its hidden mechanism. Low-grade estimates should use ranges or plain risk
language; tooltip, sort order, log, digest and accessibility text obey the same
grade. Lost sight makes readings stale. A swarm can report surviving carriers
and local damage; an animated object can report integrity/function; a rooted
body can report reachable contacts. These are schema-driven alternatives, not
new implementations or universal knowledge permissions.

**CB11 detail.** Auto battle is a policy/control mode, while offline progress
is a time-execution route. Neither implies safety. Receipts distinguish
victory, survival, defeat, withdrawal, partial objective and unavailable
observation. Party casualties and the battle's outcome may differ from the
player's personal outcome. The digest can explain where an emergency rule
stopped and link the decisive events, without replaying hours of attacks or
revealing offscreen truths. Changes to speed must name the clock affected.

## Bounded follow-up, not new required scope

| Code | Recommended next investigation | Future observable check |
| --- | --- | --- |
| A1 | Trial CB1/CB8 on existing small native combat before making a large battle UI. | Rebuilt fresh-origin evidence at both desktop targets: player/selected foe, exit and five useful recent lines visible together, including saved layouts and keyboard focus. |
| A2 | Adapt CB6 to retained encounter summaries. | Many routine events do not evict decisive outcomes; expanding a summary reproduces the retained cause and respects log-follow, filters and retention limits. |
| A3 | Trial CB2/CB3 with explicit synthetic design fixtures at 1, 5, 50 and army scope. | Named ally remains reachable; observed-only group never receives a command; local danger/exit survives group inspection. A fixture is layout proof only. |
| A4 | Review CB7/CB9/CB10 against relevant live gameplay owners before implementation. | Manual override, resource failure, nonhuman escape and low/high appraisal are truthful across visible text, tooltips and digest. |
| A5 | Exercise auto and away receipt only when that implementation is authorized. | Correct elapsed clock, fuel, interruption, party/player outcomes and current state. Save/reload/import is required if persistence changes. |

These gates are future trial criteria, not work run by U8. No army mechanics,
new policy unlock, generalized appraisal or new mobile gate is authorized here.

Open design points: **Q1** whether future large fights have real formations or
only presentation groups; **Q2** which worlds permit paused/slowed orders;
**Q3** retained combat-event budget and receipt persistence; **Q4** how orders
reach and bind independently acting allies. Defaults above remain usable while
these are unsettled. They are owner questions, not either/or requests to Weibao.
