# Micro texture by world (proposal, 2026-10-14)

Weibao asked for more considerations, including subtle micro details. This lane grounds [part 36](36_MICRO_MOMENTS_AND_SMALL_SIGNALS.md) in bounded source records and current code. These are an open palette, not accepted specifications or an implementation queue. World order follows `PROJECT.md` and `docs/USER_VISION.md`: priority canon worlds first; Fallout remains paused. The requested home Village has its own original texture. No source, bundle, save, pack or index changed.

## Reading and claim contract

**SHOWN** means inspected code or directly inspected source, with its boundary stated. **STATED** means an inspected repository dossier or ledger reports the claim, not that this lane reread its underlying book. **INFERRED** means interpretation or an explicitly original fill-in. **UNKNOWN** is an unresolved source or runtime gate, not a prohibition. Source keys below resolve to exact paths. All proposed sentences, gestures, smells and timings are original writing; a supported object does not source an invented smell, dialogue or frequency.

Read alongside parts [19](19_DIALOGUE_ACTIONS.md), [20, UF](20_FRIENDS_AND_RELATIONSHIPS.md), [21, SU](21_RENOWN_AND_SUBTLE.md), [29, DV/RUI/RQ](29_RELATIONSHIP_PREREQUISITES.md), [31](31_INNER_LIFE_HOUSEHOLD_COMMUNITY.md) and [34](34_VALUES_CONSCIENCE_AND_LEISURE.md). Their suggestions remain proposals. In particular, friendship scores are not permission to expose private feelings; a symptom is not a diagnosis; a shared name is not shared identity.

Default: one short line or small stationary cue at an actual encounter, inspect, completed action or clock boundary. Dial: sparse/ordinary/rich cadence per world, including quiet. Reasonably: relevant present actors, known objects and supported senses; no line claiming events that did not occur. Emit after settlement, suppress restore/render replays, do not create rewards by displaying text. Cooldowns are presentation adjectives, not fixed once-only gameplay limits. Durable learning or an actual unique historical first can have a receipt without banning future similar experiences.

Target for any later UI slice: **1366×768 desktop**, readable background log or existing description/card, no modal and no lost routine actions. Mobile optimization is deferred. This document has source inspection only; no rebuilt browser or playable acceptance is claimed. Food can provide benefits and pleasure without hunger death. Passive play remains valid. Any romance extension must follow part 29's fixed body-age 18+ and adult-appearance floor for both people; no romance is proposed here.

## 1. Code today

| Code | Evidence and present machinery | Cheap reuse and actual limit |
|---|---|---|
| MTX-C01 | **SHOWN:** `src/display.js` (`log_message`) replaces the hero-name token and assigns log groups/styles; `:990` supports background entries; `:1019` trims groups; `:1033` preserves scroll position/unread behavior. | Existing sink and filter, not a voice selector or historical memory. Background retention is bounded and cannot store a permanent callback. New strings need the existing safe text/markup discipline. |
| MTX-C02 | **SHOWN:** `src/data/locations.js:331` varies Village description with field clear state and bridge completion. `:346` builds a time/body/deed-conditioned noise pool, including animals and a rat gag. `src/main.js:7632` samples location noise at probability 1/600 and activity noise at 1/100 per reached loop pass. `src/activities.js:23` accepts `getBackgroundNoises`. | Strongest cheap seam for MC23/26/27/31/33/43. Probabilities are per loop pass, not guaranteed game-minute delivery. Sampling can repeat a line immediately; neither probabilities nor log caps are per-signal cooldowns. This route's surrounding tick/activity eligibility must be respected. Existing lyrics are not reproduced or extended here. |
| MTX-C03 | **SHOWN:** `src/game_time.js:60` derives seasons; `:77` onward supplies time-of-day helpers. `src/weather.js:9` has seasonal temperature modifiers and `:36` rain cycle. `src/display.js:4137` renders clock/day-part, `:4145` temperature/rain/snow with roof handling. | State exists for home weather/time prose. No general source-world climate/calendar adapter follows from it. Snow icon is precipitation below zero, not evidence of a named world's snowfall history. Wet-clothing duration needs another owner. |
| MTX-C04 | **SHOWN:** `src/components/dialogue_component.js:13` has starting text/getter, description/getter and textlines. `src/main.js:3485` starts talk; `:3504` settles textline rewards. `src/data/dialogues.js:553` has a reputation-conditioned guard line. | Conditional greetings are possible now. No general nickname, inn-order or gift-in-use memory is established by this constructor. The swampcook greeting IDs at `src/data/dialogues.js:1310` contain placeholder text, not a finished greeting feature. Avoid a second payout on presentation. |
| MTX-C05 | **SHOWN:** `src/ink_scene_content.js:117` exposes world voice cues; `:126` onward rejects unmatched native bindings and source profiles without era/cutoff binding. `:46` projects greeting/detail/aside into Ink. | Authored scene-local voice exists, not automatic world-wide activation of every imported voice row. `src/pocket_realm_content.js:192` supplies a returning-visitor greeting under actual returning/met predicates. Reuse that specificity. |
| MTX-C06 | **SHOWN:** `src/display.js:509` projects an item view, `:518` includes its description; `src/items.js:1838` has herb flavor descriptions. `src/display.js:4861` renders skill flavor text. | Static item/sound/food prose is cheap. Personal wear, nicknames, provenance and trinkets require instance identity and appropriate save handling, not mutation of shared templates. Existing durability is not proof of item biography. |
| MTX-C07 | **SHOWN:** `src/people_knowledge.js:12` builds known-person details and memories, excluding private craftsman state at `:27`; `src/people_ui.js:4` renders these through text nodes. `src/simulation_contracts.js:96` validates person ID/label/world/location/inventory. | Known appearance can live in disclosed details. No generic appearance biography reader is established by person validation. Do not display raw person objects, hidden inventories or reverse-edge memories as a shortcut. |
| MTX-C08 | **SHOWN:** `src/simulation_effects.js:281` stores staged knowledge; `:285` writes directed relationships with cause receipts and a latest-32 memory list; `:302` supports expiring conditions. `src/everyday_life.js:15` stores learned work preferences and irritation/repair exchanges. | Real remembered conduct and temporary moods exist. Cause deduplication is not a repeat cadence; the latest-32 list can evict an inside joke. Long-lived callbacks need a retained anchor or a declared bounded lifetime. Mood text must be observable or disclosed, not an omniscient rendering of private condition. |
| MTX-C09 | **SHOWN:** `src/simulation.js:202` writes power `readyAt`; `:405` creates event occurrences. `src/scene_definitions.js:5` compiles delayed phases, currently with `maxOccurrences:1` at `:12`. | Timed jobs/events/power cooldowns are precedents, not a ready micro-signal service. Do not register ambient jokes as powers or impose this compiler's one-occurrence contract on recurring social texture. MC47 needs a small adapter if selected. |
| MTX-C10 | **SHOWN:** `src/crush_social_views.js:57` derives return recap from actual received reports. `src/npc_lives.js:5` authors optional household people and yearly public news. `src/native_discovery_feedback.js:4` accepts actual settled discoveries and resolves known labels. | Recap, yearly change and small milestone feedback each have bounded working source paths. None proves a general offline-life simulator, every child's growth dialogue or all-world milestone cue. |
| MTX-C11 | **SHOWN:** `src/workspace_state.js:31` supplies panel placements; `src/workspace_layout.js:44` applies presets. **STATED:** `PROJECT.md` describes world-frame tokens and per-browser display settings. | Existing layout persistence is reusable. A source-world motif still needs binding and desktop evidence. UI persistence and character knowledge are different owners. |

Costs below are **INFERRED implementation estimates**, not measured hours: **L** = wording/projection over existing relevant state, **M** = new bounded reader/receipt/policy or view binding, **H** = missing domain behavior or durable identity model. Each estimate includes the complete MC claim, not merely the cost of printing its sentence. **N** = no new character field; **A** = additive saved content/record with compatibility review; **S** = new persistent schema/policy likely; **U** = UI preference store. Runtime acceptance remains open for every proposed row.

### Every MC row, including prerequisites

| MC | Cost / save | Fit today and missing truth prerequisite |
|---|---|---|
| MC1 | M / A or S | C01 substitutes a name; C04 can read a known meeting. Shared nickname origin and who knows it need a retained record. |
| MC2 | M / A or S | No general inn purchase-history reader found. Record completed orders and actual serving stock before claiming a usual. |
| MC3 | M / A | Known willingness/presence and a meeting-specific seat reservation; not an automatic reward for familiarity. |
| MC4 | L–M / N or A | C07/C08 can read actual retained memory. Persistent weeks-old callback needs protection from eviction. |
| MC5 | M / N or A | Mood conditions exist, but observable expression needs its own disclosure projection. |
| MC6 | H / A or S | Need performed lie, witness, uncertain tell and competing interpretation. No generic lie detector. |
| MC7 | H / S | Need gift transfer/custody and actual later use/equipment; inventory possession alone does not mean wearing. |
| MC8 | M–H / A or S | C10 can report authored public yearly changes; actual haircut/wound/apprentice events need causes and known disclosure. |
| MC9 | M / A | Callback to retained shared joke, with cadence; not random text claiming an unseen shared past. |
| MC10 | M / N or A | Tie/conduct-derived greeting projection, correct edge and last witnessed exchange; private axes stay private. |
| MC11 | H / S | Need presence, NPC-to-NPC ties and actual social seating/exit choices. |
| MC12 | M–H / A or S | C10 supplies birth years; age-specific interests/dialogue and presence remain content work. |
| MC13 | M / A | Skills exist; causal body marks and observer access do not follow automatically from a level. |
| MC14 | M / N or A | Body age, not soul age; specific symptom requires applicable body/climate. No universal stiff-knee rule. |
| MC15 | M–H / A or S | C06 can display condition; personal gear-history lines need stable instance/custody, especially stacks. |
| MC16 | M–H / S | Player-owned instance naming and transfer/save semantics, not shared template rename. |
| MC17 | L for immediate cue; M for persistence / N or A | C03 + actual exposed travel can say rain strikes boots; lasting wetness/sunburn requires a condition. |
| MC18 | M–H / A | Job-caused dirt, washing removal and NPC sensing/reaction need a bounded consumer. |
| MC19 | H / A or S | Actual crafting load, fatigue recovery and quality consumer required. A shaky-hands line alone does not implement the proposed quality dip. |
| MC20 | M / A | Actual eaten dish plus personal home/person memory; no generic nostalgia from item category. |
| MC21 | M / A | Authored chosen habit and witnessed departure from it; unfamiliar observers cannot identify a replacement. |
| MC22 | M / A or S | C06 handles inspect text; physical keepsake needs acquisition, ownership and stack/transfer decisions. |
| MC23 | L / N | C02/C03 already support day-part pools. Add per-signal suppression if cooldown across draws is promised. |
| MC24 | L for season; M for preparations / N or A | Home season exists; festival setup or first-ever snow requires a local calendar/event receipt. |
| MC25 | L for existing changes; M for new / N or A | Village description already reads bridge/field state. New repair must occur before a changed roof line. |
| MC26 | L–M / N or A | C02 snippets exist; price/news/rumor claims need an actual known account and speaker/channel. |
| MC27 | L for local fauna; H for bonds/warnings / N or S | Existing cow/bird/rat lines cheap. Recognition, pursuit or predictive warning requires actual animal/danger state. |
| MC28 | M–H / A or S | Existing reputation prices are not harvest-driven economy. Explain the actual quote source; do not invent scarcity from season. |
| MC29 | M / A | A passed actor/camp occurrence or authored trace with age/location, observable without revealing its owner. |
| MC30 | M–H / A | Actual defensive response, or a witnessed report explicitly uncertain. Not a secret-danger boolean selecting an ominous line. |
| MC31 | L / N | C02 world/location sound pool. Written motif needs no audio engine. Ward audibility is a source question. |
| MC32 | L for spoken term; M for learned glossary / N or A | Source-local vocabulary can appear in speech; notebook definition needs the actual learned entry. |
| MC33 | L for event-only variants; M for mood/world / N or A | C02 has pools; log sink itself does not select voice. Preserve amount, outcome and witness certainty in every variant. |
| MC34 | M / A | Existing discovery/knowledge receipts can distinguish first learned from familiar, if retained. Intro detail can also be requested again. |
| MC35 | M / N or A | C10 precedent reads received reports. Gardening, gifts and mail need real completion/custody; absence alone grants none. |
| MC36 | M / N | C07 known memories plus keyboard/focus-accessible tooltip. No additional biography store if latest known row is enough. |
| MC37 | L for existing skill cue; M for friends/crafts / N or A | C10 settled-discovery hook exists; new milestone producers must supply actual settled events and respect effects settings. |
| MC38 | L–M / N or U | C11 layout/presentation seams; bind motif to disclosed current world and verify contrast/readability. |
| MC39 | L for panel state; M for routine / U or A | Layout persistence exists; last-used routine selection needs valid routine ownership and stale-selection handling. |
| MC40 | L–M / N | Wording cheap, confidence/basis projection essential. An uncertainty word does not launder a private fact. |
| MC41 | M / A | C09 delayed phases + completed favor cause + actual later encounter. No claim NPC moved by reading a log. |
| MC42 | H / S | Need dropped object's custody, finder, return and duplicate-safe transfer, not a fresh spawned replacement. |
| MC43 | L for safe gag; M for price/door / N or A | C02 rat gag precedent. Actual extra coin must be in quote; actual stuck door needs functional state. |
| MC44 | M / A | Bounded job/host bridge exists; letter/stall terms, paid time, consent and handoff require content. |
| MC45 | M–H / A | C09 and received-news projection support it; apprenticeship must actually begin before the report. |
| MC46 | M / A | Stable event date, applicable world calendar and known anniversary. No replay on load or frozen-world phantom year. |
| MC47 | M foundation; H for all attachments / S | No common signal registry found in inspected paths. Begin with id/known predicate/variants/priority/cadence; item/person/place histories are distinct extensions. A lint needs an explicit disclosure contract and negative cases. |
| MC48 | Re-estimate / mixed | MC23/24 plain season cues and MC33 factual variants are L. MC1 full nickname and MC2 usual are M with durable records, not free text. See cheapest five below. |

## 2. Source routes for the world palettes

Paths are repository-relative. Private dossiers remain ignored and are not copied or added to git. This is a focused dossier/ledger read, not a full-book semantic reread. No `SECRETS*` file was opened. Changed/randomized truths are excluded; later signals may name a secret ID/route/status only outside discovery.

| Key | Inspected source path or direct reference | What it can establish here |
|---|---|---|
| HP-A | `docs/worlds/harry-potter/SOURCE_LEDGER.md`; `docs/research/novels/harry-potter/world-audit-2026-10-11/WHOLE_WORLD_COVERAGE.md` | Seven-novel default, supplements separated, whole-world coverage still partial. |
| HP-C | `docs/research/novels/harry-potter/craft-integration-2026-10-12/CANON_CRAFT_EVIDENCE.md` | CCF02 ingredients/prices; CCF04 cauldron failure; CCF15 consumer products and repair limits, exact source locators retained. |
| HP-P | `docs/research/novels/harry-potter/craft-integration-2026-10-12/SPECIAL_RULES_AND_EVERYDAY_CONSEQUENCES.md` | PJ-C1–3 preparation, dose/body/voice/fit and password limits; core/script time separated. |
| HP-E1 | [Official first-day guide](https://www.harrypotter.com/features/ten-things-you-need-for-your-first-day-at-hogwarts), inspected 2026-10-14 | Companion-qualified school kit, coins, snacks, pets, writing and September departure. Not a seven-book audit. |
| HP-E2 | [Official Owl Post entry](https://www.harrypotter.com/fact-file/magical-miscellany/owl-post), inspected 2026-10-14 | Personal/postal owls, packages/newspapers and finding recipients. No fixed daily delivery schedule. |
| HP-E3 | [Official beverages guide](https://www.harrypotter.com/features/a-guide-to-the-most-magical-wizarding-world-beverages), inspected 2026-10-14 | Butterbeer and pumpkin juice. Fantastic Beasts-only drinks excluded from this palette. |
| HP-E4 | [Official magical sweets comparison](https://www.harrypotter.com/features/difference-between-muggle-and-magical-sweets), inspected 2026-10-14 | Chocolate Frog pictures and unpredictable beans, companion evidence. |
| DD | `docs/worlds/dnd/SOURCE_CONTRACT.md`; `FOUNDATION.md` in the same directory | Selected SRD 5.2.1 sections and official Phandalin overview; setting year/complete economy unresolved. No `WORLD_BRIEF.md` or `SOURCE_LEDGER.md` exists there. |
| TT1–TT5 | `docs/research/novels/ttks-novels-2026-10-10/B1/DEEP_DIVE_2026-10-10.md` through corresponding `B5/DEEP_DIVE_2026-10-10.md`; `TITLES.json` | Five separate supplied-edition worlds. Later deep dives supersede the earlier metadata-only B1 NOTES limit for their recorded ranges. Chapter/member IDs below are dossier locators. |
| ML | `docs/research/novels/full-book/mother-of-learning/WORLD.md`; `PEOPLE.md`; `docs/worlds/mother-of-learning/WORLD_BRIEF.md` | Integrated dossier with claim IDs; current original manual-device adaptation distinguished from source mana rules. |
| SL | `docs/research/novels/novel-wave-2026-10-09/soldier/SERIES_DOSSIER.md`; `VOLUME1_RECONCILIATION.md` | Supplied volumes 1–5, camp/logistics/kit texture; original world card is separate from source. Public rows use roles and avoid private plot detail. |
| VG | `src/data/locations.js:331`; `src/items.js:1838`; `src/everyday_life.js:15`; `src/village_career.js`; `src/npc_lives.js:5` | Original home world source code, not franchise canon. |
| LM | `docs/research/novels/full-book/lord-of-mysteries/WORLD.md`; `POWERS.md`; `docs/research/power-systems/wiki-digests/DIGEST_lord-of-mysteries.md` | Edition-qualified partial integration, ordinary fuel/food/accounts/work and occult limits. Not a whole-series completion certificate. Older wiki digest is blocked and supplies no new fact. |
| SS | `docs/research/novels/full-book/shadow-slave/WORLD_INDEX.md`; `docs/research/power-systems/wiki-digests/DIGEST_shadow-slave.md` | Partial integrated novel coverage, opening and reviewed batch references. Later ranks do not overwrite early travel rules. |
| FR | `docs/worlds/frieren/SOURCE_LEDGER.md`; `WORLD_BRIEF.md`; `docs/research/power-systems/wiki-digests/DIGEST_frieren.md` | Newer ledger has revision-qualified 2023-12-12 secondary snapshot; older digest's blocked status remains historical. No independent manga reread. |
| NR | `docs/worlds/naruto/SOURCE_LEDGER.md`; `WORLD_BRIEF.md`; `docs/research/power-systems/wiki-digests/DIGEST_naruto.md` | Narrow official chapter-located claims outrank blocked digest leads; no complete daily-life audit. |
| CU | `docs/research/novels/full-book/reverend-insanity/SYNTHESIS.md`; `docs/research/power-systems/wiki-digests/DIGEST_cradle.md`; TT2 | Separate cultivation settings. Cradle digest is blocked, not fresh lore evidence. No pan-cultivation canon. |
| FO | `docs/worlds/fallout/SOURCE_LEDGER.md`; `WORLD_BRIEF.md`; `docs/research/power-systems/wiki-digests/DIGEST_fallout.md` | Fallout 4 Commonwealth 2287 base boundary; Water Line campaign is original; paused work stays paused. |

Each palette row gives the source anchor, a **proposed** observable cue and its MC use. STATED does not mean the cue itself is already true in YAIRPG. Sounds, smells, foods, terms, manners, customs, money, utility, climate, animals, carried objects and gags are distributed across rows; unknown categories are left open rather than passed off as canon.

### Harry Potter

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-HP01 | **SHOWN companion, HP-E1.** Money: silver Sickles and bronze Knuts buy train snacks. | A buyer sorts small coins before paying the displayed quote. No invented exchange rate. | MC22/28 |
| MTX-HP02 | **SHOWN companion, HP-E1.** School departure is September 1; the ticket names a platform and departure hour. | A known ticket gets a short packing reminder near its actual departure. Not a generic monthly train. | MC22/24 |
| MTX-HP03 | **SHOWN companion, HP-E1.** Quills, ink and parchment are school and correspondence tools. | INFERRED original fill-in: a student checks an ink-stained cuff before a greeting, if observed. | MC13/32 |
| MTX-HP04 | **SHOWN companion, HP-E1.** Robes, protective gloves and a winter cloak belong to the school kit. | A carried cloak enters a cold-weather description; no claim it is worn unless equipped. | MC15/17 |
| MTX-HP05 | **SHOWN companion, HP-E1.** Pewter cauldron, scales and phials are distinct kit. | INFERRED original sound: a handled phial taps the cauldron rim during actual packing. | MC22/31 |
| MTX-HP06 | **SHOWN companion, HP-E2.** Owls carry letters, newspapers and parcels; school Owlery and public service exist. | Wingbeats accompany an actual delivered parcel. UNKNOWN fixed breakfast arrival time, flight duration and weather delay. | MC23/31/44 |
| MTX-HP07 | **SHOWN companion, HP-E1.** Students bring owls, cats or toads. | A known pet can interrupt a meeting. INFERRED original gag: a toad is found beside the owners packed trunk. | MC27/43 |
| MTX-HP08 | **SHOWN companion, HP-E3.** Butterbeer has hot and bottled servings; pumpkin juice is common. | An actual order names its drink. Remembering a usual still needs a history record. | MC2/20 |
| MTX-HP09 | **SHOWN companion, HP-E1.** Train trolley sells pasties and other snacks. | INFERRED original smell: warm pastry at the present trolley, when a heated batch exists. | MC20/23 |
| MTX-HP10 | **SHOWN companion, HP-E4.** Chocolate Frog pictures can move; beans have unpredictable flavors. | A known card picture changes pose, or a sampled bean earns a brief reaction. No copied joke dialogue. | MC22/43 |
| MTX-HP11 | **STATED, HP-C CCF02.** Ingredient shop stocks dried plants, powders and animal materials with distinct prices. | INFERRED original smell: dried roots around an opened shop jar; do not imply every powder smells alike. | MC18/28 |
| MTX-HP12 | **STATED, HP-C CCF04.** Bad brewing can damage a vessel and expose footwear; cause diagnosis is attributed to the teacher. | An inspected damaged shoe can recall this actual accident; not a universal beginner event. | MC4/15 |
| MTX-HP13 | **STATED, HP-C CCF15.** A repaired bowl does not recover its spilled contents. | The vessel is whole, while its owner still accounts for the missing medicine. | MC25/33 |
| MTX-HP14 | **STATED, HP-P PJ-C2/3.** A dose changes body, voice and clothing fit, but supplies no password or memories. | Robes sit differently during an actual transformation; a familiar manner is a clue, never proof of identity. | MC6/15/21 |
| MTX-HP15 | **INFERRED original, HP-A school context.** Manners: a pupil waits for a teachers invitation before discussing private work. | Use a local character preference, not a claimed universal wizarding greeting. UNKNOWN source-wide slang and greeting formula. | MC5/10/32 |
| MTX-HP16 | **UNKNOWN climate/detail, HP-A S03/S11.** Specific snowfall, seasonal scents, owl breakfast timetable and recurring portrait jokes need selected scene checks. | Original wet-stone smell is reachable after actual rain at that location; label it O. Do not turn a fan expectation into climate fact. | MC17/24/43 |

### D&D, Forgotten Realms

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-DD01 | **STATED, DD S04.** Phandalin is a rebuilt mining settlement with ordinary trades. | INFERRED original sound: a named smiths hammer at their actual open workshop. Not a sourced town-wide hourly bell. | MC23/31 |
| MTX-DD02 | **STATED, DD S04.** An inn is a supported local institution. | INFERRED original food/smell: a paid stew serving beside a hearth, if that original inn menu and batch are authored. | MC2/20 |
| MTX-DD03 | **STATED, DD S04.** Equipment sellers support expedition supply. | INFERRED original custom: a seller counts rope and fittings at handover; actual count must match the trade. | MC22/33 |
| MTX-DD04 | **STATED, DD S04.** Farm, shrine and trading/records exchange exist. | INFERRED original manners: a local worshipper pauses at the shrine before work. No universal Faerun prayer or offering tariff. | MC23/32 |
| MTX-DD05 | **STATED, DD C06, SRD 5.2.1 p148.** Mending repairs a limited break/tear over a minute and does not restore magic. | A seam closes at actual spell completion; an inert enchantment remains inert. | MC15/25 |
| MTX-DD06 | **STATED, DD C03, SRD 5.2.1 p179.** Concentration has specific interruption conditions. | An actor stops another conversation to maintain their actual spell. INFERRED mannerism, not mandatory physical trembling. | MC5/19 |
| MTX-DD07 | **STATED, DD C05, SRD 5.2.1 p187.** A short rest has a duration and eligibility rules. | A party sets down kit during an actual rest. INFERRED original cup-sharing needs stock and consent. | MC3/23 |
| MTX-DD08 | **STATED, DD C02/C08.** Crafting throughput differs between revised and legacy profiles. | A crafter checks the current jobs ledger, using the selected profile; no conflated universal workday. | MC26/33 |
| MTX-DD09 | **INFERRED original, DD foundation party premise.** Greeting and slang: local companions might greet by trade, title or shared expedition. | A role-based greeting is cheap; a nickname from a rescue needs the actual shared cause. UNKNOWN town-specific proverb. | MC1/9/32 |
| MTX-DD10 | **INFERRED original, DD S04 local livelihood anchors.** Animals and carrying: farm stock, a patched pack or a borrowed tool could fit this branch. | Author the actual animal or owned pack first. Do not claim a famous local animal appears in inspected S04. | MC15/22/27 |
| MTX-DD11 | **UNKNOWN, DD S02 selected-section coverage.** Money denominations, local change-making, climate and named dishes are not established by the inspected rule sections. | A counted coin payment can be original after economy admission; no invented regional mint or annual harvest crisis. | MC24/28 |
| MTX-DD12 | **UNKNOWN rule / INFERRED original gag, DD profile contract.** Spell-slot exhaustion is not automatically bodily fatigue; tabletop dice jokes are not local custom. | A caster checks remaining prepared means after real expenditure. A recurring leaky mug can be O; no free refill or implied condition. | MC19/43 |

### TTKS, five separate book palettes

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-TT01 | **STATED, TT1 L6 [0025][0068].** B1 uses spell-slot units 刻; overstrain has visible silver eye lines. | A qualified observer sees a brief eye detail after actual overcasting; do not label the hidden route or exact remaining fuel. | MC13/19/32 |
| MTX-TT02 | **STATED, TT1 observation [0065][0084][0109].** B1 parrot trades detection help for food, with unexplained mechanism. | A fed, present bird makes its actual call. Do not invent an omniscient bird or a diagnostic species-wide squawk. | MC27/31/43 |
| MTX-TT03 | **STATED, TT1 L12 [0002][0015][0046][0088].** B1 diary operation depends on appropriate paper. | The owner checks paper before touching the diary. INFERRED original carried crease or paper smell. | MC22/29 |
| MTX-TT04 | **STATED, TT1 folk tells [0041][0044].** B1 crude impersonation tells can fail against evolved mimics. | A familiar habit discrepancy is uncertain evidence. UNKNOWN everyday menu, coin system and standard greeting in this dossier. | MC6/21/40 |
| MTX-TT05 | **STATED, TT2 R4 [0015][0337][0547].** B2 owned traits and equipped traits differ; simulation has annual choice windows. | The actual panel shows a currently equipped term, with a short local gloss when learned. Not an audible public alert. | MC32/34 |
| MTX-TT06 | **STATED, TT2 trait table [0304][0346].** B2 porridge production can feed an economy but costs personal time. | INFERRED original smell: steam from an actual bowl just produced; no unearned stock on return. | MC20/23 |
| MTX-TT07 | **STATED, TT2 R5/R7.** B2 retained travel memory does not transfer a simulated persons relationship or emotion. | Your familiar greeting meets a strangers polite reserve. Only your recollection is narrated. | MC1/10/40 |
| MTX-TT08 | **STATED, TT3 R7 [0022][0073][0330].** B3 fresh attempts have people who do not remember earlier attempts. | A repeated meeting starts with the current attempts actual introduction; prior inside jokes remain the players memory. | MC1/9 |
| MTX-TT09 | **STATED, TT3 R9 [0173][0373].** B3 finished-world visits have durable consequences and no visit rewind. | A known repaired object can still be repaired on return if retained in that instance. UNKNOWN local cuisine/weather across segments. | MC25/35 |
| MTX-TT10 | **STATED, TT3 R10 [0026][0316][0376][0393].** B3 written future knowledge can be stolen; remembered canon becomes unreliable. | An owner closes an actual carried notebook. Do not print its hidden contents or announce a theft before evidence arrives. | MC22/29/40 |
| MTX-TT11 | **STATED, TT4 R6 and legacy table [0065][0111][0128][0130].** B4 keys, guest credentials and family ownership are distinct. | A butler changes its form of address only after the actual credential/ownership event. No guest becomes owner through a warm greeting. | MC1/10/32 |
| MTX-TT12 | **STATED, TT4 legacy table [0205].** B4 a revered relic can be an ordinary automated wardrobe. | After its function is actually learned, a harmless garment-selection callback can recur. No revelation before discovery. | MC15/43 |
| MTX-TT13 | **STATED, TT4 R4/R10.** B4 household AI has its own purpose; machine perception does not establish psionic knowledge. | INFERRED original chime confirms an authorized household task, not the truth of every claim. UNKNOWN canonical chime. | MC31/40 |
| MTX-TT14 | **STATED, TT5 R3 [0010][0083][0295].** B5 collector uses electricity; domestic charging can take days. | The user checks an actual charged device before work. INFERRED original domestic socket hum, not a sourced audible collector property. | MC22/31 |
| MTX-TT15 | **STATED, TT5 observation [0001][0037][0038][0053].** B5 interviews, medical screening and humidity signs have distinct blind spots. | An inspector pauses over inconsistent answers, or notes the result of a performed scan. UNKNOWN city food, seasonal weather and coin slang. | MC6/32/40 |

### Mother of Learning

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-ML01 | **STATED, ML WORLD C001-07/10/12/13.** Mana-crystal trains and shaping-inhibiting passenger wards are recorded. | INFERRED original sound: wheel rhythm at a present train. Ward hum is UNKNOWN, not an automatic audible motif. | MC23/31 |
| MTX-ML02 | **STATED, ML WORLD C001-12/13.** Station labor, news, a bakery and postboxes structure arrival. | INFERRED original smell: bread near a working bakery; an actual posted notice is a channel, not complete world news. | MC23/26 |
| MTX-ML03 | **STATED, ML WORLD C001-09/12/14/15.** Cyoria is a mage-shaped city around a powerful well. | A learned local term can gloss Hole or well. No raw mana sensation for an unsupported non-mage visitor. | MC31/32 |
| MTX-ML04 | **STATED, ML WORLD C003-01/04/08/09.** Students bring reagents and clean their workshop. | A teacher glances at the actual cleared bench before ending the lesson. INFERRED original gesture/custom. | MC5/25 |
| MTX-ML05 | **STATED, ML WORLD C009-04.** Coarse purple-creeper preparation changes leaves/time needed. | An observed coarse batch leaves visible fragments. INFERRED original smell; no unsourced standardized perfume. | MC15/19 |
| MTX-ML06 | **STATED, ML WORLD C014-06.** An alcohol-to-sugar ring supports unobtrusive practical use. | A witnessed drink operation gets one short aftertaste line. No item at start without acquisition. | MC20/22 |
| MTX-ML07 | **STATED, ML WORLD C015-04/05/06.** Wet luggage, rain shields and costly station shops consume actual means. | A sheltered traveler shakes rain from a bag after actual exposure. Weather is not a free action penalty. | MC17/28 |
| MTX-ML08 | **STATED, ML WORLD C002-03/13; C003-05/07.** Alignment-year preparations, food changes and a formal dance occur. | A known venue gains preparation detail only at its actual setup phase. INFERRED original bunting color. | MC3/24 |
| MTX-ML09 | **STATED, ML WORLD C011-03/04; C014-02/03.** Household rent, child care and basement work require space and support. | INFERRED original manners: ask before using a housemates bench. No free child care from implied friendship. | MC3/10/44 |
| MTX-ML10 | **STATED, ML PEOPLE C014-01/04; C018-09.** A younger family member draws and reads; friendships and ambitions are specific. | A disclosed drawing can reappear in a known room after actual acquisition. No unseen child biography dump. | MC8/22 |
| MTX-ML11 | **STATED, ML PEOPLE C002-10/11.** A classmates fire drake requires behavior training beyond bonding. | A present trained animal settles at the right instruction; no automatic obedient pet from a bond label. | MC27/43 |
| MTX-ML12 | **STATED, ML WORLD C006-03; C007-09.** Library work includes low pay, catalog training and access conditions. | INFERRED original sound: a clerk sorts actual catalog slips before a greeting. Source does not establish a universal library bell. | MC10/31 |
| MTX-ML13 | **STATED, ML WORLD C031-01; C058-06/07.** Card play, advice and cheating have ordinary household context. | A shared game can later support a joke about that actual hand. No immediate friendship from entering the room. | MC9/43 |
| MTX-ML14 | **STATED, ML WORLD C028-06; C064-01/07.** Low-mana rural work and long-distance travel include barter, cash, languages and currency differences. | A merchant checks the offered currency before a current quote. UNKNOWN universal crown conversion outside current authored adapter. | MC28/32 |
| MTX-ML15 | **STATED, ML WORLD_BRIEF, original device divergence.** Current visitor lamp uses separately charged equipment and manual controls. | A lamp dims only when actual operation/charge says so. Do not write that the visitors own mana is recovering. | MC19/33 |
| MTX-ML16 | **UNKNOWN / INFERRED original, ML WORLD.** A particular Cyoria greeting, ward tone or recurring breakfast dish is not established by these dossier rows. | Use a quiet local acknowledgment or bakery cue as O. A recurring demanding lesson joke needs a shared actual lesson, not fan inevitability. | MC1/31/43 |

### A Soldier's Life

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-SL01 | **STATED, SL Military work, Book1 Ch1–12.** Recruit screening, drill and kit issue separate rank from skill. | A superior checks issued gear before acknowledging readiness. INFERRED original clipped greeting, not copied dialogue. | MC1/10 |
| MTX-SL02 | **STATED, SL Military work.** Soldiers cook, clean, carry, scout and maintain kit. | INFERRED original sounds: ladle against a pot or scraping a boot during the actual task. | MC23/31 |
| MTX-SL03 | **STATED, SL Military work; Book3 reconciliation route.** Ration inventory and water melting shape travel. | A cook counts remaining portions in the actual ledger. No flavor line creates food, thirst death or hidden ration loss. | MC20/28 |
| MTX-SL04 | **STATED, SL Book3 logistics.** Snowshoes and spare boots matter on winter routes. | Wet laces or repaired straps appear after actual exposure/repair. INFERRED sensory detail, not a perpetual winter climate. | MC15/17/24 |
| MTX-SL05 | **STATED, SL Military work.** Weapons, supply custody and casualty details are regular duties. | A weapon handover is acknowledged by its actual custodian; a worn grip can be described without naming hidden prior owners. | MC15/22 |
| MTX-SL06 | **STATED, SL Book5 ordinary life.** Paid escort, guild tax and queues coexist with combat capability. | A clerk separates fee from wage in the actual quote. UNKNOWN general coin exchange and regional slang here. | MC28/32 |
| MTX-SL07 | **STATED, SL Book5 ordinary life.** Mount health, stable labor and guard rotations constrain travel. | A current groom tends an actual mount. INFERRED original hay smell and tack creak at the stable. | MC23/27/31 |
| MTX-SL08 | **STATED, SL Book5 Ch308.** Horse fatigue constrains pursuit. | The rider notices a current mounts tired gait. Not proof the whole party shares a fatigue value. | MC19/27 |
| MTX-SL09 | **STATED, SL Book5 Ch296.** Rain and mud interfere with a specific earth-sensing method. | A supported user notices reduced detail after a performed attempt. No diagnosis for people without that sense. | MC17/40 |
| MTX-SL10 | **STATED, SL progression/skills lens.** Cooking, languages, care and fieldcraft require practice. | A comrades greeting can mention the meal you actually cooked; INFERRED original mess-table teasing. | MC4/9 |
| MTX-SL11 | **STATED, SL military/rank lens.** Rank alters obligations and social treatment; wounds/supply errors constrain a company. | A newly promoted person is addressed by current rank, with an old familiar tone only where shared history permits. | MC10/13 |
| MTX-SL12 | **UNKNOWN / INFERRED original, SL bounded editions.** Fixed salute wording, canonical camp-food scent, standard joke and every regional season are not established by this summary. | A repeatedly misplaced spoon can be O if actual custody supports it. No source joke or private plot resolution is copied. | MC20/24/43 |

### Home Village, original world

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-VG01 | **SHOWN, VG locations:346–350.** Daytime cow, bird and rustling lines already exist. | Expand the original animal motif under the same locality/time gates; a new pet bond is separate. | MC23/27/31 |
| MTX-VG02 | **SHOWN, VG locations:351–360.** Rat complaints vary with field state and the players rat body. | An original recurring rat misunderstanding can vary safely; do not turn an existing complaint into a new infestation event. | MC26/43 |
| MTX-VG03 | **SHOWN, VG locations:331–344.** Bridge and field changes alter place description. | A short bridge callback reads actual completion. Nearby activity does not claim an unseen roof repair. | MC25/45 |
| MTX-VG04 | **SHOWN, VG items:1838.** Herbs have food-flavor descriptions. | INFERRED original smell: herbs on an actual opened cooking surface. Their mere inventory presence does not scent the whole room. | MC18/20 |
| MTX-VG05 | **SHOWN, VG everyday_life:15–28.** The craftsman has learned preferences for quiet work and actual interruption conduct. | His greeting can recall your performed apology or interruption; no hidden respect number is narrated. | MC4/5/10 |
| MTX-VG06 | **SHOWN, VG village_career; src/main.js:2435.** Patrol loans include lantern and baton, with terms. | INFERRED original sound: the lantern buckle clicks during actual issue/return. No second kit or waived debt. | MC22/31 |
| MTX-VG07 | **SHOWN, VG src/main.js:2395.** Current patrol return already acknowledges accounted-for equipment. | Add factual wording variants retaining the same settled return outcome. | MC33 |
| MTX-VG08 | **SHOWN, src/game_time.js:60; src/weather.js:9.** Home seasons and temperature/rain exist. | INFERRED original frost/bread/field smell at applicable location/day-part, with snow distinguished from mere cold. | MC17/23/24 |
| MTX-VG09 | **SHOWN, VG npc_lives:5.** Optional household birth years and public yearly news exist. | Age-aware public greeting needs an actual known resident and authored dialogue. Annual news is not a new autonomous friendship. | MC8/12 |
| MTX-VG10 | **INFERRED original, VG setting.** Food/drink: a Village kitchen could serve herb broth and weak tea. | Define an actual menu, batch and paid serving before a usual. Current inn-order memory remains UNKNOWN. | MC2/20 |
| MTX-VG11 | **INFERRED original, VG work rhythm.** Manners/custom: neighbors leave counting tradespeople a quiet moment. | Reuse only a disclosed persons preference; others may welcome chatter. A local term can be learned through a real conversation. | MC10/32 |
| MTX-VG12 | **INFERRED original, VG coin/loan context.** Money handling: a lender counts returned coins beside issued kit. | Read actual debt/payment settlement, not a reputation-based free gift. UNKNOWN universal local mint and coins texture. | MC28/33 |
| MTX-VG13 | **INFERRED original, VG original home.** Objects carried: a mended cloth, a river pebble, a folded route slip. | Give each selected trinket a real acquisition and owner. Inspection alone cannot mint it. | MC15/22 |
| MTX-VG14 | **INFERRED original, VG animal/gag context.** Running gag: a neighbor keeps promising a roof repair. | The promise can recur as speech; a completed repair needs actual state. Existing lyric-bearing noise is not extended. | MC25/43 |

### Lord of the Mysteries

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-LM01 | **STATED, LM WORLD r001 C05/06/08.** Penny-paid gas meter, shared washing and rent-included water shape home life. | INFERRED original sound: a paid meter clicks as the actual light comes on. No endless fuel on render. | MC22/23/31 |
| MTX-LM02 | **STATED, LM WORLD r001 C13/16/20; r002 C11/16–18.** Bread vendors, limited pepper/fat and household inventory matter. | An actual meal has modest seasoning; a known vendor can recognize a completed order after records exist. | MC2/20/28 |
| MTX-LM03 | **STATED, LM WORLD r003 C16–25; r012 C27–33.** Signed issue records, badges, night coffee, lamps and duty books have owners. | A colleague checks the roster before a greeting; coffee smell is O and requires an actual cup. | MC10/22/23 |
| MTX-LM04 | **STATED, LM WORLD r005 C22/27.** Carriage tariffs and horse rest differ by circumstances. | A fare quote names current terms; hoofbeats are an original audible cue only for a present carriage. | MC28/31 |
| MTX-LM05 | **STATED, LM WORLD r001 religion; r006 C14/15.** Faith and learned social-visit/hospitality customs matter. | Use the local persons known terms and ritual, not a universal occult greeting. UNKNOWN precise menu/slang outside checked accounts. | MC1/32 |
| MTX-LM06 | **UNKNOWN specific tic; STATED LM POWERS risk context.** Sequence-related madness is a world-rule topic, not a generic mood joke. | If actual observable exposure symptoms exist, narrate those with uncertainty. No repeated tic diagnoses a pathway, hidden Sequence or private sanity. | MC5/6/40 |

### Shadow Slave

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-SS01 | **STATED, SS opening ordinary baseline.** Real coffee/food, clean air and tutoring expose material inequality. | A cheap meal or better air can register in the current setting, not in every Dream region. | MC20/23 |
| MTX-SS02 | **STATED, SS First Nightmare baseline.** Campfire, chained caravan, horse priority, food/water and cold have concrete constraints. | A present fire crackles; a guard checks an actual chain. O sensory detail, not universal slave history. | MC17/22/31 |
| MTX-SS03 | **STATED, SS reviewed 201–280.** Coastal saltwater flooding differs from a mountain river with no salt smell. | Narrate the observed salinity/location clue, not the hidden cause of flooding or guaranteed future danger. | MC17/29/40 |
| MTX-SS04 | **STATED, SS reviewed 201–280.** Makeshift clothes, harvested parts, rope and bone arrows require preparation. | A known repaired strap or carried arrow bundle belongs to its actual owner. | MC15/22 |
| MTX-SS05 | **STATED, SS opening/detail and batch institutions.** Memory gear, ordinary materials and early travel/sleep support differ by rank and stage. | A supported summon creates its actual small visual cue; a failed summon does not announce destruction. | MC34/40 |
| MTX-SS06 | **UNKNOWN common greeting/gag/climate, SS scope.** Names and Flaws can be consequential; familiar food jokes cannot establish magical identity. | Original camp teasing can recur after a real shared meal. No forced True Name disclosure or universal all-rank sleep cue. | MC1/9/32/43 |

### Frieren

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-FR01 | **STATED secondary, FR Spells rev14938.** Learned, recorded and conferred spells consume mana, with qualified exceptions. | A traveler checks a learned utility spell before use. UNKNOWN exact flower/laundry/food spell in this inspected ledger. | MC22/32 |
| MTX-FR02 | **STATED secondary, FR Turk Region rev14484.** Actual Blue-Moon Weed observation precedes its growth spell; seed-rat clue matters. | A known animal trace leads to specimen inspection. O leaf rustle; no specimen spawned by recollection. | MC27/29 |
| MTX-FR03 | **STATED secondary, FR Frieren/Flamme/Fern revisions.** Trained concealment can mislead observers. | Describe what was sensed and its confidence. A tiny aura does not certify low strength. | MC5/40 |
| MTX-FR04 | **STATED secondary, FR public-counter learning rows.** Communities analyze magic and develop defenses over time. | A known older manual can be annotated as superseded after actual learning, not silently rewritten canon. | MC15/26 |
| MTX-FR05 | **INFERRED original, FR WORLD_BRIEF travel/memorial proposal.** A traveling party can share a simple supper beside a maintained memorial. | Bread smell, bowl manners and a familiar camp greeting are O. No claim of canonical named dish, coin rate or seasonal date. | MC3/20/24 |
| MTX-FR06 | **UNKNOWN source gag, FR bounded ledger.** Mimic-chest comedy and particular companions food jokes need selected scene/revision evidence. | Hold the fan gag as a lead; O recurring overpacked luggage can fill the slot if actual cargo permits. | MC22/43 |

### Naruto

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-NR01 | **STATED, NR N14, vol3 ch18.** Tree-climbing is a specific chakra-control exercise. | Actual practice leaves a footmark or a breath pause. O expression; not automatic reserve growth from viewing bark. | MC13/19/29 |
| MTX-NR02 | **STATED, NR N6.** Medical control and strength follow training and teaching. | An actual clinic helper checks supplies before a known procedure. O clean-cloth smell, not a sourced universal hospital scent. | MC22/31 |
| MTX-NR03 | **STATED, NR N7.** Puppets need frames, mechanisms and skilled operation. | A present craft worker oils a real joint; a quiet click is O and proves no hidden technique. | MC15/31 |
| MTX-NR04 | **STATED, NR WORLD_BRIEF original River Carrier.** Paid net/carrier repairs and clinic delivery belong to an original fan branch. | An actual timber/cloth handoff gets a terse acknowledgment; neither pay nor village rank is inherited from franchise familiarity. | MC10/33/44 |
| MTX-NR05 | **UNKNOWN daily-life detail, NR bounded ledger.** Ramen habits, catchphrases, headband customs, money handling and exact seasonal festivals need chapter-qualified daily-life checks. | Keep as retrieval leads. O broth smell at a separately authored open stall is usable without calling it a famous characters usual. | MC2/20/24/32 |
| MTX-NR06 | **INFERRED original, NR ordinary work context.** A patient fitter may joke about carriers returning with the same loose peg. | Needs actual repeat repairs. No joke unlocks a clan source or exposes a disguised person; animals require their own presence record. | MC4/27/43 |

### Cultivation, named settings rather than a blended canon

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-CU01 | **STATED, CU Reverend Insanity synthesis.** Gu are living controlled means with feeding and activation separate. | A keeper checks an actual creatures food, not generic mana. O rustling only for a present creature. | MC22/27/31 |
| MTX-CU02 | **STATED, CU Reverend Insanity synthesis.** Wine, petals, pork, jade and shop/caravan supply affect portfolios. | A known purchase may smell of wine or leaves as O sensory writing; it grants no refinement recipe. | MC20/28 |
| MTX-CU03 | **STATED, CU Reverend Insanity synthesis.** Academy rewards, household inheritance and merit exchange are institutions. | A clerk counts the actual award before acknowledgment. No universal sect bow or all-world spirit-stone coin. | MC10/28/32 |
| MTX-CU04 | **STATED, TT2 R4/R5 and trait table.** Annual trait choice and time-funded porridge belong to B2 specifically. | Steam from an actual bowl or a personal panel reminder, not a cultivation-wide sound or public notification. | MC20/23/34 |
| MTX-CU05 | **UNKNOWN, CU Cradle blocked digest.** Cradle aura/madra vocabulary and daily customs need independent qualified evidence beyond this blocked digest. | Do not reuse RI Gu, B2 annual traits or generic qi tea as Cradle canon. | MC31/32 |
| MTX-CU06 | **INFERRED original, CU per-setting authoring option.** A chosen sect can have swept steps, a tea courtesy and a repeatedly misplaced practice stool. | Original only after branch/people/season admission. Herbs, bows, animals, money and gags vary by institution; no compulsory genre template. | MC3/24/27/43 |

### Fallout, paused palette

| Code | Evidence / daily-life anchor | Proposed cue and truth gate | MC |
|---|---|---|---|
| MTX-FO01 | **STATED, FO F2.** Weapon modification, settlements and maintained Power Armor are base-game features. | O metallic clink after an actual fitted part; no claim a suit has fuel or a trained operator. | MC15/22/31 |
| MTX-FO02 | **STATED, FO F3.** Radiation and wounds differ; Survival is a separately considered reference. | An actual known instrument reading can prompt a short cue. Do not infer radiation from green weather or add hunger death. | MC17/19/40 |
| MTX-FO03 | **STATED, FO F5.** Dogmeat is a companion anchor, not an acquired visitor follower. | A known present animal may react; an original local dog is O, not Dogmeat by implication. | MC27 |
| MTX-FO04 | **STATED, FO F6 and WORLD_BRIEF.** Water Line workers, samples, cooperative and rig are original fan-campaign material. | O wet-metal smell, receipt check and pump rhythm only when real local equipment operates. | MC10/23/28/31 |
| MTX-FO05 | **UNKNOWN in inspected official ledger, FO boundary.** Caps, radio routine, branded meals, radstorm schedule and repeated settlement gag need selected base-game checks before direct adaptation. | Keep prior part 04 general-knowledge leads as leads. No radio lyric, copied catchphrase or TV/76 import. | MC20/24/26/32/43 |
| MTX-FO06 | **INFERRED original, FO local repair work.** A worker keeps counting a stubborn spare washer at each real refit. | A harmless recurring gag can use actual part stock. It consumes nothing merely by appearing. This row does not reactivate paused work. | MC22/33/43 |

## 3. Rule-specific signals, with part 36's delivery contract

These are **INFERRED implementation proposals** over the evidence in the palette. Each rendered example is one original line, not source dialogue. Cooldown terms are illustrative dials, not accepted rates. For world signals whose host does not exist, the row stays design-only. Every eligibility check uses the observer's disclosed projection; raw private state is not an acceptable input. A later discovery route can widen that projection.

| Code | World / MC / source | One-line example | Actual condition, audience and recurrence | Save/effect boundary |
|---|---|---|---|---|
| MTX-R01 | HP / MC22/31/44 / HP-E2 | An owl settles beside the parcel you were waiting for. | Delivery transaction completed here, owl actually present, recipient knows parcel. Default one delivery cue; Dial sparse to each relevant arrival; suppress redraw. UNKNOWN canonical morning timetable. | Mail/custody support is M–H; text grants no parcel. New mail owner needs compatibility decision. |
| MTX-R02 | D&D / MC19/40 / DD profile | You check what you can still cast before volunteering. | Actor knows their current spell resources in selected profile; triggered by an actual expenditure or offer. Default an offer-bound reminder; Dial inspect-only. Do not invent bodily exhaustion. | Derived N if slots already supported by selected host; this lane establishes no D&D slot host. Otherwise domain implementation required. |
| MTX-R03 | TTKS B1 / MC13/40 / TT1 L6 | A silver line catches in the casters eye. | Actual overstrain plus visible eyes and co-present observer; no pathway/name/fuel disclosure. Default on a new visible strain band; Dial inspect-only. A different cause remains possible to the observer. | Overstrain/appearance adapter required; cosmetic line does not deal or cure damage. A if retained symptoms. |
| MTX-R04 | TTKS B5 / MC6/40 / TT5 observation | The cleared screen covers only the sources this instrument knows. | A performed, explained screening result; reads known test scope. Default with the result; Dial brief/expanded. No negative-result immunity claim. | N wording over an actual result; a scan system is not supplied by this document. |
| MTX-R05 | MoL / MC31/40 / ML C001-07 | The train runs steadily while your practice shaping will not take. | Compatible actor actually attempts shaping under the passenger ward and learns the result. Non-mage guest cannot infer a ward from ordinary inability. Default on a newly learned constraint; Dial later inspect reminders. | A knowledge receipt if taught/observed; no ward hum asserted. Current manual lamp does not establish this travel system. |
| MTX-R06 | Soldier / MC17/40 / SL Book5 Ch296 | Through this mud, the ground gives you less detail. | Actual rain/mud and supported earth-sensing attempt, only its user or a received report. Default first changed reading in a weather episode; Dial sparse reminders. | Existing weather alone is insufficient; sensing needs a consumer. N if already stored; A for an actual learned result. |
| MTX-R07 | Village / MC4/10 / VG craftsman | He waits until the fittings are counted before answering. | You are present at an actually busy bench; you learned his preference or witness this gesture. Default greeting/inspect cue, not an every-tick interruption. Dial quiet/detail. | N projection over relevant work and known conduct. No respect delta or new job from displaying it. |
| MTX-R08 | LOTM / MC5/40 / LM POWERS | You notice the same small hesitation again. | Only a symptom actually observed and remembered, with a supported source-specific cause or unresolved account. Default actual changed symptom episode; Dial inspect-only. No automatic Sequence/madness diagnosis or hidden pathway-specific tell. | H until the symptom/exposure owner exists; separate from ordinary irritation and spirits. Never comic punishment for being idle. |
| MTX-R09 | Shadow Slave / MC22/34 / SS equipment rows | The familiar weapon takes shape in your hand. | Actor actually summons currently supported owned Memory; correct stage/body/transit rules. Default settlement cue; Dial short/quiet. Suppress restore and failed-summon certainty. | Actual summoning/custody required. N wording once supported; no duplicated ordinary inventory or item destruction claim. |
| MTX-R10 | Frieren / MC27/29 / FR Turk Region | The small tracks end beside a plant you have not studied. | Actual visible trace and specimen, observer can see but has not identified it. Default new inspect/arrival; Dial sparse repeat. No hidden species name in tooltip/count. | A if inspection records learned specimen; no learned growth spell from merely printing a clue. |
| MTX-R11 | Naruto / MC13/29 / NR N14 | Another scuff marks the bark where your foot slipped. | Actual control-practice attempt and contact with that tree; observer is participant or present witness. Default at attempt settlement; Dial sample longer practice intervals. | N over real practice if supplied; no free chakra or invented injury. Persistent marks require A plus place-history owner. |
| MTX-R12 | Cultivation, RI specifically / MC27/32 / CU | You check this Gus feed before choosing the next job. | Actor knows the actual owned living Gu and its feed requirements. Default planning/inspect cue; Dial richer portfolio reminders. Not a need imposed on every cultivation source. | Feeding, custody and job quote owner required; no feed consumed on inspect. Distinct from body hunger direction. |
| MTX-R13 | Fallout / MC22/31 / FO F2/F6 | The fitted plate settles with a short metallic click. | Actual compatible plate installation completed on the original local rig, observer present. Default work completion; Dial quiet/detail. No unexplained reactor hum or free power. | N text over actual installation if later authorized. Paused destination remains paused. |

For cadence, start with a presentation-only key `(world instance, signal id, observer, subject, relevant episode)`. Static descriptions replace their slot instead of emitting each render. Supplemental log texture uses a small session cache and world-local played time, frozen during unsupported absence. That is **N** character-save impact, but it deliberately does not promise suppression across app restarts. If a selected signal must remember its last delivery across reload/import, that is **A/S** with an explicit old-save default, instance identity and versioned policy. Do not use wall-clock elapsed time to age a frozen world's people or replenish local stock.

Milestone/callback predicates need retained facts, separate from delivery cadence. A historical first should follow a real durable receipt; rereading a tooltip is not an event. Do not preserve a whole unbounded log just to keep one joke: retain a bounded selected anchor or allow it to fade. Relationship memory eviction at C08 must not silently turn an old friend into a stranger unless that is an authored, sourced rule.

## 4. Copyright and sealed information

This palette uses short paraphrases and original example lines. It reproduces no book passage, source dialogue, song lyric or fan catchphrase. Official web pages are companion evidence; supplied-edition dossiers retain their private locators without moving raw text into this file. Existing upstream lyrics found in Village noise are outside the write scope and are neither copied here nor treated as a model for new content. Preserve upstream attribution and LICENSE in any later work; this file supplies no publication authorization or rights conclusion.

Public franchise premises may be discussed, but a future changed identity, randomized culprit or altered hidden rule stays sealed. The absence of a name is not sufficient protection: cue timing, wording, glossary entries, search counts and card visibility must not reveal a hidden truth by selection. A line may signal an actual suspicious observation without naming its true cause. No new secret truth is specified here, and no sealed file was read.

## 5. Cheapest five bounded slices, with save impact

These ranked **INFERRED proposals** replace part 36 MC48's broad cheapness claim. No selection is required from Weibao before this report is useful; build one playable slice before taking another. They reuse original Village content first. Source-world tables are future content options, not a demand to open twelve destinations.

| Code / rank | Small slice and visible result | Save impact / cost | Acceptance that would be needed later |
|---|---|---|---|
| MTX-S01 / 1 | **One place-change sentence.** Add a short original visual detail to the already changing Village bridge description, derived from actual bridge state (C02). | **N, L.** No new event, field, reward or timer; replace the description slot. | Rebuild; fresh origin at desktop target; inspect both actual unfinished and completed bridge routes. Confirm wording does not claim an unperformed repair. No behavior claim in this doc. |
| MTX-S02 / 2 | **Home day-part/weather detail.** One replaceable ambient description line at current home location, using roof, time and actual precipitation (C03). | **N, L–M.** A small projection/slot binding. No cross-world calendar, saved wetness or persistent first snow. | Rebuilt day/night and rain/roof positive/negative observations; stable slot on repeated render; 1366×768 actions remain visible. Source-world climates deferred. |
| MTX-S03 / 3 | **One useful herb/item description.** Original sensory wording in an existing Village herb description/tooltip (C06), stated as the inspected objects property rather than a remembered event. | **N, L.** Definition/view text only; no personalized item history or inventory change. | Rebuilt inspect with actual owned item, long text/keyboard access; no hidden item/unknown assay name leakage. No new source-world item registration. |
| MTX-S04 / 4 | **Three common-event voices.** Small variant sets for actual entering-location, stopped-activity and accounted-for-patrol-kit lines (`src/main.js:2225`, `:2472`, `:2395`), preserving outcome/cost exactly. | **N, L–M.** Variant selection and optional session throttle affect supplemental flavor, never suppress authoritative receipts. Durable no-repeat history would add save work and is deferred. | Rebuilt actual travel/stop/return plus interrupted-unpaid and debt negative cases; every variant must remain true. Restoring must not generate fresh completion text. |
| MTX-S05 / 5 | **Known work-preference greeting.** A conditional craftsman opening based on actually learned preference and current work availability, with a short witnessed callback where present (C04/C08). | **N, L–M** if only a dynamic reader of existing knowledge/conduct. New textline IDs, nickname origin, order history and later gift use are excluded from this bound and require their own A/S decisions. | Rebuilt unknown/known, busy/free and actual apology/return views. Same-name contacts remain distinct. Check reload/import preserves existing knowledge without introducing a new field. |

For any later persistent extension, require an explicit compatibility decision, save/reload and literal-file import of changed and old state, plus no new signal/reward from restore. That is a later implementation gate, not work performed in this documentation-only lane. Human taste acceptance remains separate from source and browser proof.
