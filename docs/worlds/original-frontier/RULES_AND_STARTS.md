# Frontier rules, starts and first-pass pacing

Planning revision 1, 2026-10-05. Required IDs and delivery gate are in [WORLD_COMPLETION](WORLD_COMPLETION.md); these are original design choices for review, not applied runtime changes. Existing native rules cited here were inspected on the [planning input snapshot](PLAN_INPUTS.json).

## Start and access

Current routing clarification, 2026-10-11: the rules below describe this optional
Frontier campaign and compatibility with its existing saves. They are not a
mandatory opening for expanded runs. The intended suspenseful random entry is
specified by the shared [completion standard](../../WORLD_COMPLETION_STANDARD.md);
its selector and native initialization remain to be implemented. This routing
change does not rewrite Frontier's frozen campaign requirements or invent a
new origin in an existing save.

Keep the existing player, body, money, equipment, native skill XP, quest progress and current `base.frontier`. An old save acquires no campaign enrollment, actor stock, discovery, debt or mastery from loading. An explicit optional meeting begins the campaign now. Short Measure still requires the native elder meeting and actual Town square access. A known inaccessible place displays its known route/access reason; an undiscovered place is not revealed through a locked future panel.

No new random origin is required for Frontier. Fixed opening facts and the three-log Short Measure discrepancy stay fixed. A retained native or imported power counts only if its actual acquisition/body/fuel/authority and local function work; a remembered name grants nothing. Any future new-life start is a separate shared design decision, not a way to reset these saves.

The player can pursue several careers. Entry does not enroll the cooperative or accept every arc. Required delivery includes usable alternatives and explicit terminal refusal; player completion follows one coherent path and its aftermath. No mandatory universal level gate or repeat of old quests is added.

## First-pass acquisition and advancement

| Route | Actual or proposed first-pass rule | Functional result and retained owner |
|---|---|---|
| Observation → study → practice → internalization | Existing Rat-step: observed enemy or field exercise, two-coin/three-minute study; slow six-minute practice or saved active decisions; internalization at proficiency 2; execution at owned proficiency 6 and Agility 8 | Native route consumer works without a kit/Strength gate; proficiency 12 guarantees ready guide on that route. Existing `actor.techniques` retains its configured cap. This is not a new universal mastery cap or combat feint handler. |
| Ordinary teaching and application | Existing Load-bearing Step has teaching/copying alternatives and mastery-2 paid application; original new methods require a willing actual instructor and reserved attention | Ownership, instruction, practice and execution remain distinct. Existing simulation power/faculty records retain mastery and supported energy. New control/trail/material/cooperation definitions are owned by Ability, not granted by this plan. |
| Repeated native work | Gather with actual unlocked activity/tools; craft with available recipe/materials; combat or training awards its existing native skill XP | Existing skill milestones and native results remain authoritative. A finished job can award a declared amount through the existing XP effect; cancel/preview cannot award completion XP. |
| Feat or insight | Proposal: one saved feat receipt from a real new result, such as checking a contradicted route then using the corrected approach, completing a controlled intercept, or carrying a tested sound lot through its declared hazard | Opens a specific function/branch or teaches a narrow lesson. Feats are evidence-bearing receipts in existing facts/claims/progression, not another career XP bar. Duplicate or render-driven feats grant nothing. |
| Deliberate comparison/research | Proposal: pay for a named sample/control case, compare actual observed results and hear a willing resident's bounded evidence | Grants understood knowledge and a specific preparation/counter after a real observation. Failure can teach a limited conclusion without supplying an unowned source or manufacturing a fitting. |

Initial proposals for the four new function cards in [ABILITIES](ABILITIES.md): a local taught practice normally takes 2–4 game minutes and 1–2 stamina, with stated refunds; first application opens after one completed lesson. An established milestone requires two relevant completed paid/ordinary applications and one distinct case; a mature feat requires one harder actual use, not repeating a safe drill indefinitely. These are reversible content thresholds, implemented through existing mastery/unlock/receipt owners after Ability/Engine freeze callers. They do not replace native skill levels, promise those APIs exist, or give every function a redundant application counter.

Native skill facts: [Running](../../../src/data/skills.js:1464) has level-1/3 Agility and level-5 stamina/stat milestones; [Climbing](../../../src/data/skills.js:1849) has its own stat milestones; [Woodcutting](../../../src/data/skills.js:1955) and [Animal handling](../../../src/data/skills.js:1995) have XP visibility threshold 4. [Perception](../../../src/data/skills.js:2465) has threshold 80 and separate actual milestones; a six-XP observation does not make its bar visible by itself. [Haggling](../../../src/data/skills.js:2925) already changes native trader pricing. No universal Level 5 method unlock is inferred from these definitions.

Native XP stays in the existing character/skill owner. Learned method knowledge may make its action visible before an XP bar's threshold is reached. A missing generic skill-level fact must be supplied by Engine's frozen read-only adapter; current specific strength/perception/climbing facts do not establish such an API. No completion requirement relies on a fabricated native skill threshold.

## Travel, work and rewards

| Scale | First-pass choice | Why this pace supports play |
|---|---|---|
| Home work | 2–6-minute new lessons, sampling or finite lot checks; native training/rest/jobs keep their own periods | A player can make useful progress near home. Short tasks teach a decision or change a resource/function rather than asking for daily attendance. |
| Existing route | Village–Forest road 240 minutes, Forest road–Town outskirts 240, outskirts–Town square 40 before current skill modifiers; Shack connection 10 and cave connection 60 | Travel is an actual commitment. Bundle Town receiving/ledger/lesson/supply purposes into one journey. The native menu quote is authoritative; NPC plans need a declared supported speed and access. |
| Established project | A finite sequence of 2–4 contributions spread among real local work, a journey, observation and response | Jobs overlap where distinct actors/sites permit. The player is not occupied for another worker's entire independent task. |
| Mature outcome | One harder prepared case, chosen threat/charter settlement and an actual hand-off/return | A campaign ends through changed possibilities and consequences, not an arbitrary 100-hour timer or a second reset. Optional long regional expeditions can deepen the result later. |

The held module's 4/4/1 NPC route minutes are a known draft error relative to the native 240/240/40-minute journey scale. First-pass plan selects matching base geography unless a real transport/speed policy is delivered. The held code remains unchanged. Scheduler `remaining`/`budgetExhausted` must preserve unspent time across the existing 512-boundary budget; a long trip cannot silently skip resident decisions.

Short Measure's held two/four-coin payments are local work fees, not pay for a compulsory 520-minute one-way courier trip. The later visit carries multiple native/campaign purposes and useful instruction. New customer contracts quote actual goods/time/risk before commitment; reward comparison uses current gathering/job/trade opportunities. Avoid erasing legacy market prices or mirroring reputation. Director review can tune numbers after rebuilt native behavior is available.

## Continuing demand and finite automation

First-pass campaign includes a finite four-order return-lot charter, quoted one order at a time. A proposed order supplies a concrete customer, exact goods/specification, actual purse, receiving capacity, wage, accepted quantity, due condition and termination. Customer demand decreases only when actual contracted work settles. Required order variants include smaller corrected lot, prepared craft lot, evidence service and consented support; players select a viable subset rather than repeat four identical deliveries.

After charter closure, new work is optional and requires a new funded need. A calendar boundary may announce an eligible quote but cannot mint coins, refill inventory or silently accept a job. Fresh demand can follow actual customer consumption, an explicitly funded new project or a real purchase/contribution. Player payment moves native money into the consenting institution's existing actor purse in the same staged transaction; any later wage debits that purse. Old initial stock is not replayed. A finite cash/work-order token represents a budget/contract, never a second physical inventory.

Ordinary life remains available when customer funds run out: native gathering, useful crafting/trade, unlocked jobs, known practice, rest and exploration. Legacy native job funding retains its rules; this pack does not retrofit the entire inherited economy. Declining the cooperative closes only its optional contracts. An unfunded counter is visibly paused, not a reason to charge the player a debt.

New routine target defaults to three accepted units, with an explicit editable finite target within the existing engine limit. Reserve only the next unit's exact material/stock/wage and participant/site capacity. Show remaining target and actual stop reason. Stop/pause for exhausted demand or money, unavailable exact stock/tool, custody/consent/access change, occupied worker/site, insufficient stamina/fuel, new dangerous decision, unsupported clock or target reached. Pause leaves paid current work intact; cancellation follows frozen refund/forfeit terms. Resume quotes the actual remainder. No unexplored combat, new contract consent or random rare trial runs from an idle routine.

## Setbacks, branches and clocks

Poor preparation can consume the declared sample/stamina and preserve a useful failure record. A damaged optional project may need one material or a new specification; unrelated home/native stock is not destroyed. Known recovery at Village/Shack remains reachable, including occupied-work cancellation and native fainting. A safe alternative can be slower or less profitable without being fake. Unsupported lethal NPC combat, permanent player death and broad ecology are outside this pack.

Known choice boundaries are explicit. Accepting a charter reserves only its stated duties. Decline/silence before acceptance creates no promise. A consented smaller service, private contract or terminal withdrawal may permanently close that instance's branch; explain known consequences before commitment, retain the closure receipt and offer ordinary life afterwards. A later restart needs a new funded agreement, not missed backpay or deletion of the old receipt. The field renewal does not erase these branches and is never required to reopen them.

Use current common played-time rules for actual native travel and committed work. No closed-browser action or loss is added. New off-screen decisions outside a declared supported clock stay frozen. Do not silently change existing Frontier common-clock behavior when the player travels to native locations; distinct-world absence needs a selected policy/Engine binding. A report remains last observed information with its timestamp; return does not turn it into an omniscient live update.

Optional RNG may select an eligible finite clue or material trial at commitment, using registered outcomes and ordinary fallback. Fixed count errors, instructor identity, guaranteed basic lessons and existing people are never randomized here. Preview/render spends no draw. Save selected table/config revision, actual inputs/result, seed stream and cause once; reload repeats that outcome. Trial failure consumes only its declared cost. New native combat/gathering RNG replacement is an optional shared adapter, not implied by declarative expansion RNG.

## Timeline and cumulative ending alignment

[TIMELINE_AND_ENDINGS](TIMELINE_AND_ENDINGS.md) recommends a persistent chronicle with actual milestone phases, specifies seven cumulative local/career/exit ending cases, and gives the declared optional charter-pressure window. No chapter skip, aging, loop or native clock replacement is implemented. The observed S2 skill roster now supplies the four bounded first acquisition/use/milestone cases in [ABILITIES](ABILITIES.md#actual-bounded-skilldiscovery-return-observed-during-planning); the earlier general lesson/feat cadence remains a future-content proposal, not a request to override that code's exact costs/milestones. Full mature growth remains required beyond merely finishing its current ordinary drill.

Concrete existing finite draws to retain: `frontier.rat_step.active` commits one of two authored cue patterns at equal 0.5 weight; `frontier.inspect` uses the registered four-to-one ordinary/Field-eye table; the ordinary Rat-step route has its authored 0.85/0.15 ready/strained outcome and proficiency-12 guarantee. Their paid causes, completion state and frozen practice/roll receipts already distinguish preview from commitment. Preserve each current ordinary alternative and once/repeat cadence; no new rare-source lottery is required merely to satisfy this pack's RNG requirement. Any later material-quality table needs its own actual lot/result binding before affecting stock.
