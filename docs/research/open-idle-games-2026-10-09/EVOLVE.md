# Evolve source audit, 2026-10-09

## REPORT

Evolve's strongest lesson for YAIR is an explicit boundary between a disposable run and permanent knowledge, paired with traits that change costs, jobs and available actions. Its technology catalogue is also a useful model for revealing a long campaign a little at a time. Its offline system banks faster future play, rather than secretly simulating an entire absent civilization.

This is a civilization game, not an individual aging or heir simulator. The inspected reset handlers end civilizations and recreate beginnings; they do not rewind history or preserve a named character's lived body. Use its run contracts and readable costs as design references, not as evidence that it solves YAIR's long-lived protagonist, family or follower goals. Dense micromanagement and replaying technology purchases are real costs of this approach.

Research only. No gameplay, build, browser session, user save, commit or upstream script was executed. Proposals below are not accepted decisions.

## Provenance and license

| Item | Verified result |
|---|---|
| Canonical repository | [pmotschmann/Evolve](https://github.com/pmotschmann/Evolve), author's README links its own GitHub Pages game; no maintained replacement established |
| Clone | `~/.codex/research/evolve/`, depth 1, outside YAIR |
| Snapshot | `3436358dcd03d9f9e071d51ea071e0a78c0322e4`, master; subject `1.4.1` |
| Commit date | `2026-06-19T13:09:47-04:00` (repository timestamp, not audit date) |
| Inspection date | 2026-10-09 |
| Repository license | Mozilla Public License Version 2.0, **MPL-2.0**, [LICENSE](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/LICENSE#L1-L2) |
| Reuse here | Paraphrased mechanics and small identifiers only; no copied source or assets. Copying covered source later would require preserving its file-level MPL obligations and notices; do not silently relabel it as YAIR's MIT code. Bundled third-party libraries were not separately licensed in this audit. |

README's canonical play link and description: [README.md](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/README.md#L1-L12). GitHub canonical page was checked live. No alternate fork was cloned or promoted based on popularity alone.

## Findings by the six assignment lenses

### F-E1 Core loop and offline time

Players evolve a species, allocate population to jobs, buy buildings and technologies, manage supply chains and eventually choose a reset. Resource production and consumption update in `fastLoop`; slower loops process additional simulation, daily events and saves. A worker schedules one common stream: normally 250 ms fast ticks, 1 s mid ticks, 5 s long ticks/game days. Slow/hyper traits change these intervals. Every fast tick precedes its corresponding mid/long tick, and callbacks precede daily saving. Catch-up execution is capped at 12 game days per call, with an explicit comment that there is no smart catch-up. Sources: [functions.js:142-172](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L142-L172), [main.js:841-882](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/main.js#L841-L882).

After at least 120,000 ms away or paused, `addATime` converts elapsed time into banked accelerated game days, using `floor((2/3) * elapsedMilliseconds * 2 / baseLongTimer)`. While the bank is positive, all loop intervals halve. The bank caps at 11,520 game days; at the unmodified 5-second day and 2× speed, this represents eight hours of accelerated wall-clock play. Trait-modified day lengths change wall-clock consumption. This is **later acceleration**, not immediate grants of all production, losses or events from the missing period. The saved timestamp updates when credit is added to avoid double-counting; reset clearing zeroes the time bank. Sources: [functions.js:174-204](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L174-L204), [main.js:12810-12826](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/main.js#L12810-L12826), [vars.js:2400-2430](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js#L2400-L2430).

YAIR relevance: this is one optional offline policy for operation cards. It cannot be described as aging, follower work and world history actually occurring during absence. Do not change YAIR's existing clock on the strength of this audit.

### F-E2 Life, death and exact reset retention

This audit found civilization calendars, population losses and extinction/reset operations, not a personal age-to-death succession system. Food shortage can kill population; those losses are counted, rather than creating individual heirs ([main.js:3845-3868](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/main.js#L3845-L3868)). "Gods" and "old gods" retain prior-species identifiers, not complete persons.

Every listed run ending calls `resetCommon`. It recreates city/calendar at day/year zero, sets technology to theology level 1, then calls `clearStates`. That clears resource stocks, evolution, civic/job state, space/interstellar/galaxy/portal/eden/starDock/tauceti, construction/research queues, ARPA state, event countdowns and many run counters. It resets accelerated time, pause and reset-disable settings. Permanent `genes`, accumulated prestige, achievement/feat records, and other untouched global statistics survive. **Exception:** Blood Stone count is zeroed without the blood gene. Queue gene can restore initial queue technology/display after the wipe. Some UI/settings fields persist but others are explicitly reset; "all settings persist" would be wrong. Sources: [resets.js:1264-1288](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L1264-L1288), [vars.js:2335-2430](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js#L2335-L2430).

The following table describes handler effects, not a claim that all routes are accessible at game start. Reward amounts are computed, not fixed. P means Plasmid, substituted with AntiPlasmid in antimatter. These currencies add to retained balances, rather than replacing one another.

| Operation | Reward additions | Recreated run and special retained context | Source |
|---|---|---|---|
| MAD | P | Protoplasm; same universe, biome, atmosphere, orbit and geology; prior species becomes god; rapid mutation and ancient ruins; preserves existing ascended flag | [resets.js:7-85](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L7-L85) |
| Bioseed | P + Phage | Protoplasm; seeded planet-choice context, probe/geck counts and new seed; same universe; no preserved geology; ascended false | [87-225](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L87-L225) |
| Cataclysm | P + Phage | Same species and local planet context, not ordinary protoplasm; explicit challenge flags disable CRISPR/trade/craft and plasmid or antimatter mastery; begins cataclysm | [227-317](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L227-L317) |
| Black hole / Big Bang | P + Phage + Dark | Protoplasm, universe-selection sentinel `bigbang`, four probes, new seed, no retained geology, ascended false | [320-429](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L320-L429) |
| Vacuum collapse | P + Phage + Dark | Magic universe/syphon prerequisite; universe-selection reset like Big Bang | [431-530](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L431-L530) |
| Ascension | P + Phage + Harmony | Protoplasm, same universe/planet; ascended true; each geology value increases by .02 | [532-631](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L532-L631) |
| Demonic infusion / descension | Artifact | Protoplasm, same universe/planet and existing ascended flag; corruption set to 5; spire lord/strength history changes | [633-746](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L633-L746) |
| Apotheosis | P + Supercoiled; Artifact if warlord | Protoplasm, ascended true, same universe/planet; geology +.02 | [748-842](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L748-L842) |
| Terraform | P + Phage + Harmony | Protoplasm; selected planet's biome/traits/geology replaces old planet; same universe, rejuvenated true, retains prior ascended flag | [844-932](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L844-L932) |
| AI apocalypse | P + Phage + AI Core | Protoplasm, same universe/planet; synthetic-unlock history and source species tracked; prior ascended flag retained | [934-1008](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L934-L1008) |
| Matrix, retirement, Garden of Eden | Each P + Phage + AI Core | Each recreates protoplasm on same universe/planet, retains prior ascended flag, records distinct ending/achievement and Womling history | [1010-1262](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js#L1010-L1262) |

Most handlers selectively retain `srace`; several decrement corruption rather than carry all traits. Race objects are reconstructed, so a generic "all species traits survive" rule is false. This is a taxonomy of reset routes, not thirteen nested tiers. Later routes pay different reward combinations and history changes; do not assume every deeper route pays every shallower currency. `getResetConstants` and `calcPrestige` calculate route-dependent rewards/caps from inputs ([functions.js:1494-1575](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L1494-L1575)). A separate **hard reset** removes the active `evolved` localStorage item and reloads, unlike prestige ([vars.js:2432-2442](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js#L2432-L2442)). Some destructive handlers write `evolveBak`; not every handler does, so there is no universal guaranteed backup claim.

YAIR relevance: distinguish succession, revival, rewind, universe travel and offline passage explicitly, as north star lines 2630-2640 already propose. A travel edge should not accidentally invoke a civilization-wipe contract. Native unconsciousness remains accepted behavior in PROJECT.md.

### F-E3 Pacing and grind

Technology objects have prerequisites, era, category, granted technology level, dynamic costs and actions. Early discoveries expose resource rows; later systems arrive through requirements rather than an initial screen of every possible feature ([tech.js:18-91](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/tech.js#L18-L91)). Species change the same discovery's ingredients and text. Replays vary species, planet and universe rather than only multiplying a universal experience bar.

Permanent genes buy reusable advantages; achievement levels produce mastery with universe-specific rates. Construction and research queues expand through technologies, permanent genes, feats and governor traits. These reduce repeated clicking, but repeated setup and technology buying still exist. Sources: [arpa.js:322-459](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/arpa.js#L322-L459), [functions.js:1361-1418](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L1361-L1418), [functions.js:414-446](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L414-L446).

Governors supply configurable tasks, conditional on unlocked genes/technology, with limited task slots and reserve controls ([governor.js:363-375](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/governor.js#L363-L375), [474-551](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/governor.js#L474-L551)). This supports D2b's solved work becoming a routine, but is not a rich autonomous-follower personality model. No measured hours-to-unlock or player-experience claim is made.

### F-E4 Data, events and saves

This is hybrid data-and-code design, not pure JSON configuration. `races` stores type, traits and names; `traits` stores origin/taxonomy/ranks and functions returning rank-dependent values. Technology and events embed executable condition, cost and effect functions. Jobs have descriptive functions and explicit setup calls. Separate localized JSON strings keep IDs stable while text varies. Sources: [races.js:240-267](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/races.js#L240-L267), [4997-5026](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/races.js#L4997-L5026), [jobs.js:14-59](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/jobs.js#L14-L59), [369-410](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/jobs.js#L369-L410), [events.js:13-74](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/events.js#L13-L74).

Events filter by race/genus/resource visibility/trait/technology and exclude the last event of the same major/minor type. Daily processing uses separate decreasing random countdowns, records the chosen event and adds tagged messages. This gives stage-appropriate surprises and avoids immediate identical repeats, not guaranteed narrative arcs ([events.js:1110-1164](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/events.js#L1110-L1164), [main.js:12720-12760](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/main.js#L12720-L12760)).

The whole `global` state becomes JSON, compressed with LZString UTF16 for localStorage, Base64 for exports. Loading reverses compression. Daily saving writes `evolved`, with a `geck` exception. Version-specific migration branches update old state; importing checks a few expected fields and sanitizes message colors, not a complete typed schema. Sources: [vars.js:1-2](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js#L1-L2), [83-119](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js#L83-L119), [functions.js:206-257](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L206-L257). Bounded message histories are capped separately for visible logs and saved messages ([functions.js:364-395](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L364-L395)). Compression reduces representation size; it does not establish a bound on state growth or safe quota handling.

YAIR live-source correction: `src/save_files.js:166-190` already measures UTF16 storage against a 4 MiB origin budget and preserves the old save on a quota failure. North star's older missing-size-guard sentence is stale. Compression is only a possible later optimization, not a missing safety guard. YAIR already has native activities and save validation; this audit does not propose replacing either.

### F-E5 Dense browser UI

Research rendering groups current and completed technologies by category/era, filters unavailable paths and lazily avoids unused tabs. Research queues show capacity, pause control, ETA and readiness colors. Job tooltips compute current per-worker rates and default job roles. A shared Popper wrapper generates dynamic detail and handles placement; tagged logs limit visible/saved history. Sources: [actions.js:6081-6125](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/actions.js#L6081-L6125), [9557-9605](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/actions.js#L9557-L9605), [functions.js:18-75](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js#L18-L75). These are inspected rendering behaviors, not a visual or accessibility acceptance test. Hover-heavy detail and color dependence deserve actual mobile/keyboard checks before adopting a pattern.

### F-E6 Small touches mapped to vanilla YAIR

Each is a proposed adaptation within existing center actions/panels, not a request for new windows. Evidence references the findings above or the exact source links.

| Code | Evolve touch and source | Vanilla YAIR proposal |
|---|---|---|
| T-E1 | Technology exposes a resource only when useful (F-E3) | Reveal a crafting ingredient after hearing its recipe or finding a sample. |
| T-E2 | Trait-dependent costs (tech.js:18-91) | Tool or bodily condition changes an existing gathering action's inputs. |
| T-E3 | Trait-dependent names/descriptions (same) | One activity can describe the actual equipped tool without making a duplicate profession. |
| T-E4 | Per-worker live rate in job text (jobs.js:42-59) | Show current herb-gathering yield with skill and tool contributions. |
| T-E5 | Default job stated in tooltip (jobs.js:14-59) | Explain what a household helper does when its assigned task ends. |
| T-E6 | Separate visible and saved log caps (F-E4) | Keep a short chronological recent log and compact lasting milestones in the biography. |
| T-E7 | Tagged major/minor logs (main.js:12720-12760) | Filter quiet work, personal events and dangerous events in the native log. |
| T-E8 | Immediate repeat exclusion (events.js:1110-1121) | Avoid seeing the same incidental village event twice in succession. |
| T-E9 | Events require relevant technology/resource/traits (F-E4) | Workshop mishaps happen after a workshop exists; aged-body events require actual aging. |
| T-E10 | Temporary inspiration event (events.js:42-51) | A witnessed success briefly helps a research stage, with visible expiry. |
| T-E11 | Distinct construction/research queues (functions.js:414-446) | Research preparation should not silently overwrite the character's chosen training activity. |
| T-E12 | Queue capacity displayed (actions.js:9557-9573) | Display routine steps used/available in the existing action panel. |
| T-E13 | Queue pause/remove controls (actions.js:9574-9598) | Let a player pause a solved routine without losing its plan. |
| T-E14 | ETA and readiness state on queued work (same) | Show missing material or blocked research prerequisite beside a queued recipe. |
| T-E15 | Reserve controls for governor tasks (governor.js:474-551) | Stop auto-crafting before spending the last food or emergency medicine. |
| T-E16 | Limited automation task slots (governor.js:363-375) | A helper undertakes a comprehensible set of duties rather than every profession at once. |
| T-E17 | Persistent queue gene restores quality of life after reset (vars.js:2424-2430) | A legacy may retain a learned routine template while the new body must relearn execution. |
| T-E18 | Previous species recorded as gods (F-E2) | Preserve who taught a method in its life record, separately from retained power. |
| T-E19 | Planet geology survives or changes by operation (F-E2) | A workshop or planted grove survives succession only when the operation card says so. |
| T-E20 | Different end routes reward different currencies (F-E2) | Distinguish teaching legacy, discovered knowledge and inherited items rather than one rebirth XP multiplier. |
| T-E21 | Completed research separate from available categories (F-E5) | Keep learned recipe references inspectable without cluttering current research choices. |
| T-E22 | Time bank cap, threshold and timestamp (F-E1) | An optional offline rule should disclose its cap and record the last accounted timestamp. |
| T-E23 | Backup on several destructive resets (F-E2) | Preview a new operation and preserve rollback data before a prototype run-ending mutation. |
| T-E24 | Species taxonomy plus ranked trait values (F-E4) | Group origin/body traits and display their actual rank-specific consequence in the bio. |

## Ranked proposals for the north star

All proposals, not decisions. Parent GM should rank these alongside the other two games; implement none under this research assignment.

| Rank/code | Proposal | Why and smallest observable proof |
|---|---|---|
| 1 / P-E1 | Explicit operation retention preview | Reuse the north star's operation cards. One optional heir transition lists retained knowledge/routine templates, lost body/proficiency and inherited property before confirmation. Preserve native defeat. |
| 2 / P-E2 | Routine reserves and stop reasons | D2b already calls for stop conditions. One vanilla gathering/crafting routine stops at a food or material reserve and states the exact reason in the action/log. |
| 3 / P-E3 | Research reveal by actual prerequisites | Reuse shared research stages. One familiar vanilla recipe reveals a next experiment after skill/material evidence, with prerequisite and partial outcome visible. |
| 4 / P-E4 | Trait consequences inside existing actions | One opt-in body/origin trait changes an existing activity cost/rate and its tooltip. No mandatory alternate opening. |
| 5 / P-E5 | Bounded event variety across a long life | One stage-aware ambient event family filters on age/place/occupation and avoids immediate repeats; durable milestone remains after recent prose rolls off. |
| 6 / P-E6 | Helper duty with an explicit reserve | One named follower helps gather or prepare research with a stop condition and visible attribution; keep relationship/consent rules in YAIR, because Evolve job pools do not provide them. |
| 7 / P-E7 | Retain taught methods, not all raw power | One legacy card preserves a method and its teacher while resetting body-dependent execution. Separate understanding from practice per north star 1717-1738. |
| 8 / P-E8 | Compare offline policy cards before choosing | Specify absence simulation versus a bank of faster future time, including aging/events/follower effects. A design comparison first; Evolve's policy is not automatically selected. |

Compression is not ranked: existing YAIR quota protection matters more, and no measured save-size evidence makes a codec change urgent. Several proposed owners already exist (`life_record`, `npc_lives`, activities, research and log surfaces); new work must first inspect their live contracts rather than creating duplicates.

## CHECKPOINT

- Identity: `/root/evolve`, research worker for `/root`, 2026-10-09. Exclusive output `docs/research/open-idle-games-2026-10-09/EVOLVE.md`.
- Completed: canonical/source/license check, shallow clone, bounded source inspection across all six lenses, all thirteen listed reset routes surveyed, shared wipe and exceptions traced, 24 small touches and eight proposals mapped to vanilla YAIR. Hash and commit date pinned above.
- Inputs: assignment, live PROJECT.md, relevant north star slices (D2b, operations, research/followers), live YAIR activities/save-source pointers. Existing dirty tree preserved. No relevant memory registry result was used.
- Limits: static inspection only; no Evolve playtest, balance timing, absent-time experiment, import/reload test, accessibility test or full third-party asset license inventory. No complete all-field initialization audit and no claim that every possible trait-specific edge case was exercised. Snapshot is the live fetched master commit, not a historical reconstruction of every release before audit day.
- Next: parent integrates findings/license/table into REPORT and CHECKPOINT. Any future code reuse requires fresh source/license scope review; gameplay implementation needs separate authorization and existing acceptance/backlog reconciliation.
