# B12 micro body hook map, 2026-10-14

Source inspection only. Every size, trigger, API extension and slice below is
**proposal**, not implemented behavior or an accepted balance rule. Read
[B2 AUDIT](../b2/AUDIT.md) and [B2 SPEC, quirk hook](../b2/SPEC.md#g24-b25-quirk-hook-and-eight-concrete-variants)
first. This extends that consumer list rather than repeating its body-record,
identity, race/height or persistence audit. Source locators are repository-relative
`file:line`, observed in the dirty `codex/gameplay-foundations` checkout on
2026-10-14. Recheck them before implementation.

Authority: [COMMON](../COMMON.md), [lane task](../B12.md), [genetics palette](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md),
[prior integration](../../body-lineage-expansion-2026-10-11/INTEGRATION.md).
The palette remains Default + Dial + in-world reason/cost. Native Frontier is a
cheap compatibility fixture, not a required player opening. Unsupported world
or body adapters resolve neutral and retain data. No canon claim is made for
any world family, and no sealed truth appears in these documents.

## F1 Consumers reused from B2, with additional seams

These are existing destinations. Their existence does not establish a body
state, a new modifier, a cure or an observer's knowledge.

| Hook | Existing code consumer, file:line | B12 use and boundary |
|---|---|---|
| C01 Sleep | `src/main.js:2838`, `src/main.js:2846`, `src/main.js:2849`, `src/main.js:7489` | Reuse B2 furniture-adjusted stamina recovery multiplier before the native cap. Leave Sleeping XP and actual sleep ticks alone; health remains neutral in the first slice. |
| C02 Eating and meal effects | `src/main.js:4717`, `src/main.js:4721`, `src/main.js:4764`; `src/absorb_e1/pacing.js:54`, `src/absorb_e1/pacing.js:60` | Reuse B2 tagged-item effect-duration adapter. Publish a meal-triggered state only when the native item is used. Native fullness can consume food even if its old buff remains. |
| C03 Native accuracy | `src/models/person.js:597`, `src/models/person.js:608`; `src/models/combat.js:381` | Reuse B2 owned attack_points multiplier. This modifies an input to hit probability, not probability by the same percentage. No generic archery or spell-gesture check is implied. |
| C04 Stamina | `src/main.js:3768`, `src/main.js:3772`; `src/models/combat.js:168` | Native spend divides by stamina_efficiency; combat checks affordability against that efficiency. A proposed action cost factor must reach both paths consistently. Avoid changing maximum stamina. |
| C05 Native item crafting | `src/main.js:4236`, `src/main.js:4237`; `src/display.js:3077`, `src/display.js:3487` | Reuse B2 final shared chance helper after Work Ledger for preview and execution. Existing craft transaction/rollback still owns materials, XP and messages. |
| C06 Concealment | `src/pursuit_content.js:16`; `src/simulation.js:87`, `src/simulation.js:178`, `src/simulation.js:211` | Reuse B2 exact pursuit.conceal cost quote and frozen reservation. This is paid masking effort, not smell detection, stealth success or disguise recognition. |
| C07 Gathering, added | `src/models/location.js:491`, `src/models/location.js:511`; `src/main.js:7552`, `src/main.js:7563`; `src/display.js:3757`, `src/display.js:3808` | Final resource chance is a real output. Add a shared chance delta in efficiency preview and cycle resolution. Preserve counts, quality and RNG draws; do not touch JOB pay or time. |
| C08 Reading, added | `src/main.js:2916`, `src/main.js:2917`; `src/items.js:1148`; `src/display.js:1185`, `src/display.js:4731` | Book.addProgress accepts a time argument. Proposed progress per played minute can be fractional. Literacy XP at src/main.js:2921 is separate. ETA must divide remaining work by the resolved progress rate. |
| C09 Meditation and practice, added | `src/activities.js:130`; `src/main.js:4910`, `src/main.js:4919`; `src/body_progression.js:42`; `src/techniques.js:128`, `src/techniques.js:139` | Native Meditation XP is an existing tick consumer. Grip drills and rat-step practice have explicit completion receipts. Do not change discrete correct answers, integer proficiency or Watchcraft's required played minutes merely to simulate focus. |
| C10 Dialogue and trade, added | `src/main.js:3504`, `src/main.js:3541`; `src/components/trader_component.js:144`; `src/trade.js:77`, `src/trade.js:88` | Dialogue has an answer-rendering seam, not a universal persuasion roll. Trade has a margin/quote consumer; any new price effect must enter quote/fingerprint and commit through the native trade transaction. |
| C11 Weather and local time, added | `src/weather.js:111`, `src/weather.js:194`, `src/weather.js:198`; `src/game_time.js:18`, `src/game_time.js:77`; `src/absorb_e1/pacing.js:67`, `src/absorb_e1/pacing.js:80` | Native temperature, rain and light exist; optional home weather layers on them. Clock boundaries must use the supported host clock. Directional wind, sun-facing and thirst do not follow from these values. |
| C12 Event feed and log, added | `src/display.js:863`, `src/display.js:1036`, `src/display.js:1040`; `src/event_feed.js:37`, `src/event_feed.js:87`, `src/event_feed.js:100`; `src/event_feed_ui.js:3` | Log is a transient output. Feed is a pure knowledge/receipt/life projection; generic body knowledge is not currently included. Add an allowlisted observed body projection, never the whole simulation log. Use text-safe authored lines. |
| C13 Body observation and life memory, added | `src/body_progression.js:25`, `src/body_progression.js:46`, `src/body_progression.js:65`, `src/body_progression.js:79`; `src/character_bio.js:24`, `src/character_bio.js:28`; `src/life_record.js:52` | Existing callus, scrape/mark and one craftsman's observations are narrow real examples. Life record is lossy narrative, not a deduplication or reward authority. New first/best records need their own typed receipt keys. |

No generic lockpicking consumer was found in the inspected source. Weather
prose such as `src/data/locations.js:2801` and `src/data/locations.js:2914`
does not provide a wind direction/vector. `src/lore_practice_runtime.js:1`
is local work and a rain-warning family; its filename is not a cultivation
practice engine. Native Meditation and source-qualified power practice remain
different consumers.

## F2 Row coverage and proposed sizes

Status: **R** = a narrow existing action/output and its trigger can be reused;
**P** = an output exists but state, trigger, adapter or part of the named behavior
is missing; **N** = no matching behavior consumer found, although ordinary log
text can be rendered. R never means the proposed modifier is implemented.
All missing portions, including P rows, are listed in [NO_CONSUMER](NO_CONSUMER.md).
Neutral = multiplier 1, probability delta 0, stamina delta 0. Narrative-only
states have a proposed numeric effect of 0, intentionally.

### G56 MI, moment states

| Row | Existing consumer with file:line | Status and missing join | Proposal: Default; Dial; reason/cost |
|---|---|---|---|
| MI1 Cold fingers | C05 `src/main.js:4237`; C11 `src/weather.js:111`, `src/absorb_e1/pacing.js:80` | P: derive exposed-hand condition; no glove warmth/fine-task tags, lockpicking, handwriting or spell-gesture consumer | -0.01 item-craft chance while actual exposed-hand cold state is active. Proposed trigger: effective temperature below 5 C for 5 supported outdoor minutes; 3 warm sheltered minutes clears it. Dial 0 to -0.05 with authored gear/state thresholds. Warming costs played time; a fire/glove treatment needs real custody. |
| MI2 Sweaty palms | C03 `src/models/combat.js:381`; C09 `src/activities.js:137`, `src/main.js:4919` | P: no sweat exposure/chalk/wrap state; Climbing XP is not climbing success | attack_points x.98 for authored grip-dependent native attacks; optional Climbing XP x.98 only if selected. Dial neutral to x.90, task-qualified. Sweat trigger needs actual heat/exertion; wiping/chalk costs its real time/item, with no mandatory penalty to all weapons. |
| MI3 Post-meal drowsiness | C02 `src/main.js:4717`, `src/main.js:4764`; C08 `src/items.js:1148`; C09 `src/main.js:4919` | P: define a large-meal allowlist, consumedAt/expiry and eligible meditation ticks | Reading progress x.95 and Meditation XP x.98 for 20 supported played minutes after a tagged large meal is consumed. Dial duration/size/off per physiology. No all-food slowdown or diminished Watchcraft clock. Meal still nourishes; timing or a lighter actual meal avoids the state. |
| MI4 Stimulant jitters | C05 `src/main.js:4237`; C08 `src/main.js:2917`; C02 `src/main.js:4721` | P: no qualified stimulant-dose/jitter/tolerance join; reading speed is not general alertness | Item craft -0.02 chance, reading progress x1.02 for 15 played minutes after a world-authored stimulant. Dial doses/tolerance/off, including only a benefit. Cost is the actual consumed dose and any authored reaction; do not classify ordinary food as stimulant. |
| MI5 Thirst headache | C08 `src/items.js:1148`; C10 `src/trade.js:77` | P: no thirst/water/canteen ownership model or appraisal/long-negotiation focus consumer | Reading progress x.97 while explicitly authored thirsty-headache condition exists. Numeric negotiation/appraisal effect 0 until a real check exists. Dial off to x.90 where thirst is central. Drinking needs actual water; no new bar required for a finite scene. |
| MI6 Afternoon dip | C11 `src/game_time.js:18`; C08 `src/main.js:2917`; C09 `src/main.js:4919` | R for clock-based reading/meditation; chronotype values still need B2 params | Reading progress x.95 and Meditation XP x.98 during [13:00,15:00) in the qualified home clock. Chronotype can shift the interval, sleep/custom bodies can remove it. Dial neutral to x.90. Scheduling changes when you work; no nap bonus without actual nap consumer. |
| MI7 Warm-up | C03 `src/models/person.js:597`; C04 `src/main.js:3772`; C09 `src/main.js:4919` | P: no warm-up session timer, stretch action or retained warmth state | attack_points x.98 and combat stamina cost x1.02 for first 2 played combat minutes; authored movement routine suppresses both. Dial off, longer or stronger by body/method. No hidden every-enemy reset. Must specify time advancing during combat before shipping. |
| MI8 Hunger mood | C02 `src/absorb_e1/pacing.js:73`; C07 `src/models/location.js:511`; C10 `src/components/trader_component.js:144` | P: fullness exists only with home hunger enabled; hunting recipe tags, social reaction and quote adapter missing | With actual fullness <25 and hunger enabled: tagged hunting resource chance +.01; willing merchant markup above 1 x1.01, only with an authored irritation response. Off by default for social cost. Dial observer can ignore, react differently or refuse with reasons. A snack costs actual food. Do not infer hostility from hunger alone. |
| MI9 Glare and wind | C11 `src/weather.js:198`; C03 `src/models/combat.js:381`; C06 `src/pursuit_content.js:16` | P: brightness exists, but no facing/sun angle, directional wind, bow-release or scent tracking consumer | attack_points x.97 only on a later qualified ranged attack into authored glare. Scent/upwind effect 0 until directional evidence exists. Dial neutral, hat/position mitigation, body-specific vision. Native darkness is not glare; Neri has no hound sense. |
| MI10 Pins and needles | C09 `src/activities.js:130`; C04 `src/main.js:3772`; C06 `src/pursuit_content.js:16` | P: no posture/stakeout elapsed state or movement-only native stamina seam | After 30 uninterrupted played meditation minutes, next qualified conceal quote costs +.1 stamina, cleared after 2 moving minutes or a real posture shift. Dial off or other local movement effects. Existing conceal costs 2, so proposal costs 2.1; this represents masking movement effort, not guaranteed detection. |

### G59 MG, growth and milestones

| Row | Existing consumer with file:line | Status and missing join | Proposal: Default; Dial; reason/cost |
|---|---|---|---|
| MG1 Firsts | C09 `src/body_progression.js:42`; C12 `src/event_feed.js:87`; C13 `src/life_record.js:52` | P: completed grip action can trigger a first; no general first-per-body receipt or unbroken-sleep session | Numeric effect 0; first completed grip drill or first qualified recovered sleep emits one memory keyed by actual body/action. Dial authored firsts or quiet log only. Genuine completion pays its existing time/stamina; log grants nothing. Pull-up/qi circulation require new actions. |
| MG2 Personal bests | Raw aggregate `src/models/combat.js:422`, `src/models/combat.js:423`; save `src/main.js:4999`; C13 `src/life_record.js:52` | P: strongest_hit is a saved raw maximum updated without a player-only guard before mitigation; not a per-body personal best | Numeric effect 0; propose an attributed player/body best after final native damage resolves. Do not announce the existing raw strongest_hit as a personal achieved best. Dial opt-in other actually measured activities. New best record stores metric, body, value and receipt, never rerolls or awards repeat XP. |
| MG3 Visible small change | C13 `src/body_progression.js:46`, `src/body_progression.js:82` | R for earned calluses only; voice/clothing/body dimensions not tracked | Numeric effect 0 added by the line. Existing conditioned grip keeps its own capability. Say callus text after body.condition_grip completion; no second craft bonus. Dial show/hide known detail or later qualified voice/frame changes. Actual drills/recovery caused it. |
| MG4 Bruise and scar timelines | C13 `src/character_bio.js:24`; `src/body_progression.js:52`, `src/body_progression.js:55` | P: scrape-to-faint-scar state exists; no bruise colours/day stages/fading timeline | Numeric effect 0 added. First route uses active scrape versus expired/recovered scrape with retained palm mark. Dial richer dated stages per world once recorded. Do not claim a day-old bruise from a 20-minute scrape timer; existing recovery costs 3 played minutes. |
| MG5 Return to form | C13 `src/body_progression.js:55`; C03 `src/models/person.js:597`; C09 `src/main.js:4919` | P: recovery event exists, but no post-illness baseline/return-state consumer | attack_points x.98 and native training XP x.98 for 10 supported played minutes after a selected substantial illness clears, then 1. Dial off, graded rehab or immediate recovery. Exclude small hand-rest fixture by default. No permanent lost XP or manufactured new illness. |
| MG6 Bad days | C01 `src/main.js:2846`; C08 `src/items.js:1148`; C11 `src/life_record.js:60` | P: consumers exist, daily body seed/profile and validation do not | Daily class off/normal/sharp: 10% x.98, 80% x1, 10% x1.02 for sleep stamina recovery and reading progress. Dial neutral or world/body distribution. No cause is diagnosed; schedule around a felt difference or continue. Exact seed contract below. |

### G60 MB, changed bodies

| Row | Existing consumer with file:line | Status and missing join | Proposal: Default; Dial; reason/cost |
|---|---|---|---|
| MB1 Graft-site itch | Install receipt `src/backlog_expansion_body.js:264`; C12 `src/display.js:863`; C13 `src/character_bio.js:28` | P: actual installed part exists; no graft-site sensation/elapsed healing state | Numeric effect 0; proposed sensation lasts 30 supported played minutes after a selected compatible graft, then eases. Dial none, duration or local discomfort effects with a real target. Do not assume a brass intake lung is a biological graft or itchy without an authored definition. |
| MB2 Calibration drift | Installed operation `src/backlog_expansion_body.js:294`, `src/backlog_expansion_body.js:300`; C05 `src/main.js:4237` | P: actual part uses are counted; calibration quality/tuning craft consumer absent | Native item craft -0.01 chance only if that exact calibrated part supports the task. Proposed drift after 20 genuine part uses, restored by 3 played minutes of supported tuning. Dial never drifts, continuous drift or other services. Brass seal output stays guaranteed until its owner adopts an actual changed-operation contract. |
| MB3 New hand, old habits | Body custody `src/backlog_expansion_body.js:324`; C03 `src/models/combat.js:381`; C09 `src/techniques.js:139` | P: changed host is real; no per-hand coordination, signature-writing or relearning consumer | For a later acquired hand: grip-dependent attack_points x.97 for 15 played practice minutes, then 1. Dial familiar templates need none; broader change needs its own method. Knowledge/proficiency remains, paid practice develops control. Do not transfer the native penalty to Tern's clay body automatically. |
| MB4 Taste and smell change | C02 `src/main.js:4717`, `src/main.js:4721`; install/remove `src/backlog_expansion_body.js:264`, `src/backlog_expansion_body.js:315` | P: no palate/preference or changed sensory carrier model | Preference numeric effect 0. Optional separate tagged compatibility reaction: positive meal duration x.95 for a specified food/body pair, through B2 food adapter. Dial preference without penalties, new favourites or strong reactions. Changed taste does not by itself prove worse nutrition. Actual alternative meals cost food. |
| MB5 Phantom sensations | Remove receipt `src/backlog_expansion_body.js:315`; C12 `src/display.js:863` | N: no absent-limb map or phantom-sensation consumer | Numeric effect 0. Author a supported sensation flag/timeline after actual limb loss/replacement; do not infer phantom limb from removing an intake implant. Dial none, recurring neutral texture or explicitly designed distraction. No involuntary general accuracy loss. |
| MB6 Mirror moments | Controlled-body projection `src/backlog_expansion_body.js:488`; C12 `src/display.js:863` | N: body swaps exist; no reflection-access/perceived-self encounter | Numeric effect 0. One reflection encounter can reference current controlled body and actual known prior appearance; suppress repeats for the same witnessed change receipt. Dial comforting, unfamiliar or ordinary, without forced distress. Seeing a mirror requires a real place/object means. |
| MB7 Scale slips | Body form projection `src/backlog_expansion_body.js:488`; C04 `src/main.js:3772`; C05 `src/main.js:4237` | P: no dimensional clearance, reach calibration, loudness or accident consumer | Qualified precision craft -0.01 chance for first 10 played practice minutes after a substantial frame change. Dial familiar change neutral, tool-fit bypass or broader meaningful obstacles. No random stock destruction. Doorways/volume need new consumers; adapting costs actual time/tools. |

### G61 MH, family and heredity

| Row | Existing nearest owner with file:line | Status and missing join | Proposal: Default; Dial; reason/cost |
|---|---|---|---|
| MH1 Small inherited features | Named kin relation `src/backlog_expansion_body.js:392`; C13 `src/character_bio.js:16`; C12 `src/display.js:863` | N: no inherited appearance-feature or kin-evidence consumer | Numeric effect 0; record a witnessed resemblance as a claim, never paternity proof. Dial authored family features/inherited generator with evidence. Examining a real person costs attention/time; record only what was observed. |
| MH2 Shared voices | C10 `src/main.js:3541`; C12 `src/display.js:863` | N: dialogue text has no speaker acoustics/voice match, through-door/message channel | Numeric effect 0; an audible resemblance clue can suggest the wrong speaker without swapping actual actor ID. Dial family resemblance, trained mimicry or none; channel/voice must exist. No blanket trade bonus. |
| MH3 Inherited gestures | Taught family method `src/backlog_expansion_body.js:59`; observer `src/body_progression.js:25` | N: a learned packing source is not copying gestures or genetic transmission | Numeric effect 0; learned gesture clue stores observedBy and learnedFrom separately from ancestry. Dial copied, spontaneous similarity or inherited motor trait with a real mechanism. Demonstration needs contact; it does not grant a source capability. |
| MH4 Family food habits | C02 `src/main.js:4721`; B2 bread fixture `src/items.js:4212` | N for inheritance/upbringing; food-duration consumer reusable only after a qualified individual reaction is supplied | Habit numeric effect 0. Optional B2 sensitivity x.90 positive Stale bread meal duration, if individually defined, never inferred from kinship. Dial tastes only, family exposure, inherited tolerance or none. A menu choice costs food; distinction between habit and reaction needs evidence. |
| MH5 Recurring family dreams | C01 `src/main.js:2838`; C12 `src/display.js:863` | N: sleep recovery is not dream production, memory transmission or family comparison | Numeric effect 0; later authored dream motif records only each dreamer's report and an actual shared conversation. Dial coincidence, inherited motif or genuine channel per world. Never reveal sealed truth or another sleeper's private dream automatically. |

### G62 MP, presentation

| Row | Existing consumer with file:line | Status and missing join | Proposal: Default; Dial; reason/cost |
|---|---|---|---|
| MP1 Voice and gait training | C06 `src/pursuit_content.js:16`; C09 `src/techniques.js:139` | P: concealment and technique practice exist, but no disguise recognizer, identity claim or voice/gait practice | Exact conceal cost delta -.1 only after a newly authored completed movement-masking lesson, if this is its actual purpose. Dial small progress, training slips, magical passing or none. B2 scent quirk still separate; Neri's witnessed lead is not a voice check. Voice/SG10 passing numeric effect 0 until implemented. |
| MP2 Clothes fit | Equipment owner `src/models/person.js:627`; C10 `src/components/trader_component.js:144` | N: equipped weapon stats are not clothing fit, tailor custody or observer status recognition | Numeric effect 0 for mere fit. Optional later merchant markup above 1 x.99 only after a culture/merchant actually recognizes fitted status clothing. Dial other meanings or no reaction. Tailoring consumes real work/materials; no appearance-to-global-reputation conversion. |
| MP3 Flavour lines | C12 `src/display.js:863`; `src/event_feed.js:100`; `src/event_feed_ui.js:3` | R for native log and life memory output; body-feed projection/dedupe adapter still needed | Numeric effect 0 added by prose. Each line references the already resolved modifier/state, never applies it again. Default onset/easing or current relevant action, with optional quiet/detail dial. Cost is attention; selection/deduplication contract below and 72 sets in FLAVOUR_LINES. |
| MP4 Observer wording | C13 `src/body_progression.js:25`; `src/character_bio.js:12`; `src/event_feed.js:37` | P: one known craftsman has authored observations; no general observer-body view or stranger/friend language resolver | Numeric effect 0. One stranger says what they saw; a friend may connect only separately learned history. Dial personal wording/cultural language. Relationship alone grants no truth. Contact/report/diagnosis supplies evidence and can carry a mistaken claim. |

## D1 Resolver, arithmetic and clock proposals

Extend B2's pure queryBodyEffects, with its record/body/world/revision/knowledge
contract intact. Do not add another global stat system or copy body state into
simulation simply to turn on a flavour line. First slice adds allowlisted action
`read.native` and output `readingProgressMultiplier`. Later selected rows may add
`meditation.native.xp`, `gather.native`, `trade.native.quote`,
`combat.native.stamina` and their strictly typed outputs. These do not exist in
B2 today; its original whitelist cannot consume them without an explicit change.

For existing B2 actions retain its exact aggregation/rounding. Apply instance
multipliers once, chance deltas as probability fractions after existing effects,
clamp final chance [0,1]. MI1 -0.01 means 75% becomes 74%, not 74.25%.
For native stamina define final spend `stanceCost / nativeEfficiency * costFactor`;
use that same value for affordability/spend. Do not also multiply efficiency by
the inverse. Preview, commit and refund use one frozen simulation quote.

Reading proposal: `Book.addProgress(baseMinute * readingProgressMultiplier)`.
Do not add the multiplier to Literacy XP, book rewards or knowledge conditions.
Keep Book.setAsFinished's cap. Existing getRemainingTime is work remaining,
so reading action ETA/tooltip need `workRemaining / currentRate`; show that a
rate may change at a known boundary rather than promising a fixed completion.
Meditation XP effects apply only to actual Meditation skill ticks. Preserve
native Breathing XP and Watchcraft's known/practiced/executable played-time gates
(`src/main.js:7520`, `src/main.js:7526`). Discrete technique proficiency remains
integer and earned by the original response/completion rules.

Gathering proposal changes resource chance, not cycle duration. A 2% duration
change disappears for many floored native periods and can corrupt held cycle
progress. Freeze the selected cycle's resource-chance modifier at cycle start,
use it at completion and show the same quote; serialize a pending cycle quote
or explicitly specify migration to neutral for already-running old cycles.
New cycle samples current conditions. No extra RNG draws for flavour.

Trade proposal modifies **markup above 1**, not the whole item price:
`margin' = 1 + (margin - 1) * socialFactor`, then existing price rounding.
Apply after native Haggling/reputation/accessory composition. Recompute all
buy displays/selection totals from the same helper; extend quote fingerprint
with relevant condition/profile revision and reject changed quotes before
spending. Selling values, merchant stock and willingness remain their owners.
A 1.01 factor at margin 2 means margin 2.01. No automatic social discount.

Supported played time drives state expiry and warmth, never wall time. No
closed-browser body decay. Sample relevant boundaries in batched advancement,
including local midnight, MI6 interval endpoints and state expiry. Clock/body
changes recompute owned buckets without altering paid/frozen jobs. Unsupported
hosts stay neutral; real adapters can later choose pause/expiry/translation
under their own world clock and persistence contract.

## D2 MG6 seed and retention proposal: reload never rerolls

Default: optional MG6 profile disabled on migrated saves, neutral when missing.
Fresh authored adoption must persist its seed/profile before effects become
active. No random traits, symptoms or bad-day history are invented by migration.
Dial: each world/body can set its own distribution, amplitude and day clock,
including no variance. Day class does not imply illness, ancestry or a diagnosis.

Proposed additive validated seed block under B2's one native body record:

```json
{
  "micro": {
    "schema": 1,
    "daily": {
      "seedHex": "0123456789abcdef0123456789abcdef",
      "revision": 1,
      "enabled": true,
      "bodyEpoch": 0,
      "profileId": "frontier_daily_gentle_r1",
      "clockId": "native-calendar-360"
    }
  }
}
```

The sample is illustrative, not an RNG seed to assign every character. Physical
body seed belongs to that actual body; B2's native record must not control every
host. New host support needs its own persisted body key. BodyEpoch changes only
on a genuinely new body identity/template episode defined by its owner, not on
load, a haircut, equip, entry/exit, toggling the dial or visiting an old host.
Returning to the same body retains its epoch/seed. A changed profile pins its
revision through explicit adoption; turning it off then on restores that day's
same result. Ordinary midnight changes only the key, not saved root seed.

Seed initialization proposal: generate 128 bits through Web Crypto on fresh
creation or explicit adoption, retain the candidate across retries, and publish
it in the same durable choice as enabling the profile. Before success, effects
stay neutral and no daily line/milestone is issued. Probe/load/preview never call
entropy. Missing enabled seed or invalid revision rejects before live mutation;
an absent block stays neutral. Follow B2's validation, export and loader seams,
not permissive JSON roundtrip alone.

For the native home fixture compute
`dayOrdinal = floor(lifeCalendarMinute(current_game_time) / 1440)` using
`src/life_record.js:60`. This includes year/month/day; neither wall date nor
legacy day_count alone defines it. Any supported nonnative world must supply a
stable local day ordinal and clock/instance ID; missing adapter means neutral.
Travel cannot create a new body seed. A local clock reset revisits the same day
class unless the world's explicit reset/episode policy chooses a new key.

Exact deterministic derivation proposal, independent of shared mutable RNG:

```text
keyBytes = UTF8(JSON.stringify([
  "body.micro.daily", 1, seedHex, bodyId, bodyEpoch,
  worldInstanceId, clockId, profileId, revision, dayOrdinal
]))
digest = SHA256(keyBytes)
n = big-endian unsigned uint32 from digest bytes 0..3
u = n / 4294967296
class = u < 0.10 ? "off" : u < 0.90 ? "normal" : "sharp"
factor = class == "off" ? 0.98 : class == "sharp" ? 1.02 : 1
```

Use the fixed ordered array/string encoding, lowercase 32-character seedHex,
allowlisted version/profile IDs, safe-integer nonnegative epoch/day and stable
body/world instance IDs. Do not use unordered object stringification or JS
platform hashCode. Resolve the hash before entering the synchronous tick path;
cache by full key, discard cache on relevant changes. Cache is a derivation,
not a new persisted roll authority. Async completion must confirm its key is
still current; delay/stop a dependent tick rather than applying a prior day's
factor. Tests should pin digest/key vectors across load, import and batched time.

The distribution's proposed expected factor is 1. No ongoing accumulated
fatigue, consecutive-day penalty or extra combat/drop RNG draw. It changes
sleep stamina and book progress only in the first slice. At a MI6 dip plus an
off day, reading factor is .95 * .98 = .931; sharp plus dip = .969. Normal outside
dip = 1. Sleep remains base furniture recovery * daily factor before vital cap.

Cosmetic selection uses another namespaced hash, e.g. `body.micro.line` plus
state/phase/action receipt, never consumes state.rng, simulation.seed or
Math.random. Saved body seed, profile and clock survive manual save, export,
actual load, literal-file import and probe without rerolls. A new genuinely
created life/body may get a new seed by its own creation contract; no heir
seed policy is silently imposed here.

## D3 MP3 publication and knowledge proposal

[FLAVOUR_LINES](FLAVOUR_LINES.md) has 72 state/phase sets and 216 short lines.
Each set binds to a resolved effect. Pending rows are unusable until their
missing state/consumer is implemented. Do not emit a line about wind, diagnosis,
spice, a graft or clothing merely because an unrelated effect exists.

Proposed phase tokens: onset, ongoing relevant use, eased, clear. Eased/clear
lines mean that row's modifier changed/cleared, not that every other modifier
is neutral. Match actual facts and qualifiers in each catalogue group. Pick
one set at most for each actual phase/action transition; different world-family
wording is cosmetic and cannot invent mana, qi, an instrument or a named part.
Fall back to ordinary wording if the scene lacks the referenced means.

Deduplicate by `(bodyId, stateId, phase, episodeReceipt)` in a compact validated
micro observation cursor, not by life-record text or an endless list of lines.
Daily MG6 uses `(full day key, class, relevant action family)`; do not reannounce
the same class after reload/import. Persist last observed state/episode per
selected rule, not rendered prose or every tick. Rendering and preview are pure.
Messages from durable craft/choice plans publish after commit and join rollback;
native minute effects use native save cadence, without claiming per-tick atomic
storage. A restored save may repeat only actions that genuinely were not saved,
not reroll their daily class.

Native log is transient. Meaningful MG first/best/visible-change receipts can
append a bounded `memory` life milestone after their own dedupe record succeeds.
MP3 routine sensations should not fill Life. Feed only allowlisted player-known
body receipt IDs or life milestones, through C12; it does not currently project
arbitrary body knowledge. Keep the global simulation log private. Observer
claims retain source and uncertainty; strangers do not learn a hidden modifier
ID from prose. Sensation text need not expose unknown trait truth in DOM,
tooltips, accessibility labels, counters or exports shown as a preview.

Target for a later UI slice: laptop 1366x768, existing log, time/action status and
optional biography details. Visible outcome: readable state line plus truthful
reading ETA, with independent action/inventory/combat surfaces retained.
Advanced numerical details may explain known modifiers on request; narration
alone does not excuse misleading action costs. Mobile optimization, a new body
window and universal body/social simulation are deferred.
