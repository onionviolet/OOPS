# Q1–Q4: stories on calendars, deadlines and life stages

2026-10-14. **PROPOSAL ONLY.** Extends root Q1–Q4, using [P11 context](../p11/CONTEXT.md), [occasions N8](../p11/DREAMS_AND_OCCASIONS.md#n8-festivals-and-seasonal-events), [D8 history](../p5/D8_LORE_GRAMMAR.md), [D9 pacing](../p5/D9_STORYTELLER.md), [P12 structures](../p12/STRUCTURES.md), [P13 canon](../p13/RULES.md), [P14 history](../p14/CONTRACT.md) and [P16 resets](../p16/LOOPS_AND_RESETS.md). These joins do not select offline advancement, a loop, aging rules or a universal director.

## Q0: use the actual clock domain

Shown/SOURCE inspection on 2026-10-14:

| Locator | Actual inspected behavior | Consequence for the proposal |
|---|---|---|
| [game_time.js:18](../../../../../src/game_time.js:18), [35](../../../../../src/game_time.js:35) | Native time advances minutes; month/day boundaries use twelve 30-day months | A base calendar year is 360 days. Do not use device/Gregorian anniversaries or publication dates |
| [game_time.js:63](../../../../../src/game_time.js:63), [193](../../../../../src/game_time.js:193) | Spring/Summer/Autumn/Winter follows months 1–3/4–6/7–9/10–12 | Reuse this season in base-world context; other worlds need explicit calendar bindings |
| [game_time.js:3](../../../../../src/game_time.js:3), [77](../../../../../src/game_time.js:77), [188](../../../../../src/game_time.js:188) | `is_night` starts at 20, named/simple Night at 21 | Different signals; do not silently choose one as the universal night rule |
| [weather.js:9](../../../../../src/weather.js:9), [36](../../../../../src/weather.js:36), [63](../../../../../src/weather.js:63) | Seasonal, hour, eleven-day temperature and thirteen-day rain-cycle inputs | Deterministic weather context exists. This is not a saved stochastic weather episode generator |
| [weather.js:71](../../../../../src/weather.js:71), [111](../../../../../src/weather.js:111), [194](../../../../../src/weather.js:194) | Temperature uses current native location; rain uses native day count; smoothing has module-local prior modifier | Do not query this as arbitrary remote-world weather or recalculate past exposure from today's location |
| [weather.js:198](../../../../../src/weather.js:198) | Light is derived from native hour/minute and night thresholds | A sight-dependent clue must bind the appropriate light signal and actual sense |
| [simulation.js:456](../../../../../src/simulation.js:456), [465](../../../../../src/simulation.js:465) | Common expansion scheduler owns boundaries, jobs, expiries and checks | Add a boundary adapter to that authority, not another timer per story |
| [life_record.js:60](../../../../../src/life_record.js:60) | Calendar conversion validates native dates using a 360-day year | Useful base calendar conversion only; it is not a universal mapping from calendar to expansion clock |

A story time reference needs endpoint/world/instance/branch, local clock domain, occurrence date/window, mapping anchor/revision and selected absence policy. Native calendar can progress before simulation enrollment while expansion time differs ([P11 R2](../p11/CONTEXT.md#c7-contradictions-and-integration-dispositions)). Never guess one from the other. Occurred-at, witnessed-at, reported-at and remembered-at are separate. Missing exact source date uses an interval/order/season, not a fabricated day.

## Q1.1: anniversaries from retained receipts

Subscribe to actual death, marriage, founding, victory, rescue, completed project or other selected receipt types, plus authored/background traditions labelled by origin. P14 keeps the event and discovery basis; P11 owns organized occasions. P24 adds a recurrence consumer.

Logical anniversary binding: originReceiptRef, calendarBindingRef, recurrenceRule, scope/participants, rememberedAudience, nextDue, lastSettledOccurrence, organizer/means refs and end/change policy. A unique occurrence key includes origin, branch, rule revision and local cycle/year. Retry/reload of that occurrence cannot draw or pay twice; the following year's occurrence remains reachable. Repeated celebrations and newly founded customs use local adjectives, not fixed lifetime limits.

Generate this year's content from what actually changed: surviving participants, current place condition, known relationship state, funding, prior commemorations and current wishes. A rebuilt workshop's opening anniversary can request a fitting maintenance task, performance or shared meal. A remembered death can produce an optional visit, account or reconciliation enquiry; no universal grief damage or automatic mourning duty. Quiet remembrance is a valid complete event with no reward.

If the date is uncertain, use a declared approximate commemoration rule without asserting an exact historical date. Foreign calendars need an explicit translation or maintain separate observances. Missed dates can generate a later account/offer where supported; do not silently charge supplies or enact a costly ritual while away. Old biography prose cannot reconstruct authoritative anniversaries; enroll from a new receipt or an explicit player-selected commemorative date labelled as such.

## Q2.1: canon countdowns as conditional pressure

Read the P13 event graph and real current prerequisites, then let P12 assemble preparation/response/aftermath arcs. A deadline follows the event's time policy; it does not establish that the catastrophe still occurs. Preserve paths to prepare, warn, investigate, evacuate, shelter, help, fight, profit, negotiate, avert, ignore, leave and return wherever actual means permit. Several preparations can coexist. Saving a person is not forced to consume the opportunity to save another.

| Arc phase | Generated content and actual cause |
|---|---|
| Distant window | Dated forecast, ordinary supply/learning opportunities or public announcements; unknown threats remain undisclosed |
| Building pressure | Real actor plans, demands, notices and shortages produce fitting requests and evidence |
| Near known window | Useful preparation reminders and current options, with explicit known urgency and stop/cancel terms |
| Event changes or fails | Record actual intervention and dependent invalidation; revise known warnings only on received evidence |
| Aftermath | Surviving people/places/needs generate rebuilding, changed careers, celebration, recovery or ordinary life |

Never assign an exact day from chapter order. Show a range or event relation where the source is imprecise. Public warning, remembered canon and genuine foresight may show different countdowns. No numerical countdown to a sealed event before its route reveals it. Internal known-to-author urgency can choose eligible content without text exposing the reason, but content selection itself needs disclosure review.

Mother of Learning's invasion, a sourced sect war or a monster wave are requested source patterns, not canon clocks established here. [P9 MoL](../p9/MOTHER_OF_LEARNING.md) and [P13](../p13/) bind the exact source/version/anchor; [intro AH8/AH10/CV2/CV7](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#ah-anchors) supplies pressure, continued-branch applicability and occurrence/reveal distinction. Existing continuous MoL saves must not gain a looping catastrophe controller by implication.

A canon scene can be invalidated while broader threats remain supported by other actors. No spawn ladder or numerical inertia can restore a hard missing cause without real means. A known fixed-point law needs its enforcing mechanism and counter policy. Pausing just before an important event versus advancing with a summary are retained offline options from intro OT3, not newly selected behavior. Apparent urgency must not force clicking during comfortable idle play.

## Q3.1: stage weights by world and body

Separate chronological age, body developmental stage, social/career stage, mastery, memory age, active controller and remaining supported lifespan. A regressor can be an expert in a young body. A cultivator may retain prime function for centuries. A newly awakened sword may contain old memories; a collective can have changing members without a single human birthday. [Starts palette](../../../../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md#p1-starting-possibilities) and [nonhuman engine](../../nonhuman-starts-2026-10-14/COMMON.md) own start/actionability bindings.

| Stage context | Proposed weight emphasis | Reachability rule |
|---|---|---|
| Childhood/new awakening | Familiarization, assistance, learning, exploration and local bonds | Actual body/consent/source requirements gate acts; meaningful agency and supported stronger exceptions remain |
| Apprenticeship/new career | Mentors, practice, mistakes, exams, work and rivalry | Adult novices and younger experts remain possible; age is not competence |
| Established/prime | Projects, collaborations, ordinary home life, exploration and ambition | Peaceful and risky paths can coexist; no compulsory escalation |
| Mastery/leadership | Teaching, institutional decisions, unusual research and rival methods | Mastery can be narrow; rank alone grants no authority or omniscient method |
| Elder/late career | Reflection, succession, new pursuits, mentorship and legacy | Learning, work and adventure remain reachable where supported; no automatic frailty/death from the label |
| Changed body/cycle | Rebuilding means, comparing known methods, fitting new senses | Retained memory changes questions, not current fuel, physique or universal eligibility |

Use world-specific stage resolver and tag weights once at the D9/P3 selection seam. Stage, social role, storyteller and fate arc remain independent; do not multiply the same age effect twice through multiple inputs. Hard unsupported acts stay ineligible; soft preferences leave positive weight on allowed alternatives. Selected world laws can impose genuine developmental/body conditions, not genre-wide human-age caps.

E5 §8's under-12/12–24/25–64/65+ bands and its low elder learning/romance/opportunity weights are historical proposals. Its “later life” rare multiplier and final-year legacy factor do not establish a universal life law. Extend with local profiles and actual known life transitions. Death prediction must not leak a hidden remaining lifespan. P23 owns goals and inner change, P19 succession/social history, P16 endings; stage weights cannot choose these outcomes directly.

## Q4.1: seasonal arcs read live weather and calendar

Reuse P5 X2's future weather-episode owner if selected; the first seasonal slice can instead read existing deterministic native weather/calendar. No new weather stream is required merely to recognize an existing rain boundary. P8 owns actual ecology/crops and supplies; P6 owns work/production; P11 N8 owns occasions. Unsupported crop growth/flood simulation stays absent until its own consumer exists.

Original arc: a real exposed repair appointment has preparation, a supported rain-related work condition, completion and a later shared account. Calendar season changes eligible local timing or demand, while observed weather changes the relevant supported work option. Indoor work, hire, delay, suitable tools and dry-weather work coexist. If the current resolver has no rain effect, start with timing/availability and label stronger exposure mechanics as a further proposal.

Later arcs can cover planting/harvest, migration, winter trading, monsoon repair, seasonal recruitment, hibernation/awakening or ceremonial cycles. Bind season meanings per world/region, not Earth's hemisphere or the device date. Winter scarcity must arise from actual supply and selected conditions, never disguised global hunger death. Powerful climate control can change weather where its actual scope works; storyteller tone cannot.

At admission freeze the declared sampling policy: current context, due-time sample or accumulated exposure. Save the needed boundary samples/exposure and source refs. A finished item or already delivered account does not reroll when the season changes. Remote forecasts need endpoint-correct observations. A returning visit follows its selected clock/absence policy; P24 introduces no wall-clock catch-up.

## Q1–Q4 future gates

G1: month/year boundary, uncertain dates, local recurrence and paused/reversed/loop clock policy. Two supported advancement chunks agree with one equivalent advance; no duplicate anniversary, deadline or draw from two observers. Reset is a fictional transformation, not file load.

G2: real receipt changes anniversary content; intervention changes a countdown only where dependencies apply; unrelated control remains; known confidence follows evidence arrival. Distinguish canceled exact event from surviving pressure. An actual stage transition changes eligible weights without rerolling open events; nonhuman and long-life profiles preserve usable alternatives.

G3: prove a useful supported seasonal preparation on a fresh rebuilt desktop origin, then pending/completed Save/reload/Export/literal-file Import with dates, recurrence keys, exposure, evidence, chosen cast/text and next draws. Old absent owners stay absent; no fabricated historical anniversaries or offline death. All runtime and human fiction/pacing gates **OPEN / NOT RUN**.
