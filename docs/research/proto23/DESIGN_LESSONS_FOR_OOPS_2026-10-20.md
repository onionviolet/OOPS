# Corc / Proto23: deeper design lessons for OOPS

2026-10-20. Requested by Weibao: what can we glean for our game, including the
design choices, surrounding discussions and more to consider? **Research and
proposals.** This is a synthesis of the saved references, not a new specification
or an accepted build queue. Round 1: CRL1–CRL14 and candidate journeys CRJ1–CRJ4.
Round 2 continues with CRL15–CRL26 below.

## What seems most useful

**The strongest transferable pattern is a world whose small facts change what
you decide to do next.** A tree has resistance; a particular axe is doing the
work; its failure changes the plan; the output has to reach somewhere useful.
The compact interface can explain that whole relationship. Much of the appeal
comes from experiencing an ordinary activity as a particular situation rather
than watching another anonymous progress bar. This is our interpretation of the
evidence, not a quoted design manifesto from Corc.

For OOPS, the opportunity is to connect existing means, activities, material
identity, observations and aftermath. Several individual features already exist
in source. Another universal activity, inventory or knowledge framework would
duplicate owners before proving the interesting connection.

Authority: AD5–AD8, AD15–AD19, AD22, AD28, AD31–AD36 and AD38; UR35–UR49 and
UR50–UR58; MR1–MR10, MR16–MR23 and MR27–MR36; SR4–SR9 and SR15–SR24;
relevant skill/body/presence rules in [DOMAIN_RULES](../../DOMAIN_RULES.md).
[USER_VISION](../../USER_VISION.md), [PROJECT](../../../PROJECT.md) and the
[rules index](../../RULES_INDEX.md) retain authority. Constraints below are
proposed defaults with world-dependent dials and reasons. One realm and one
prestige layer remain the first milestone; complexity and multiple worlds remain
Weibao's direction. NPC-heavy simulation and generated layouts remain deferred.

Any later UI slice targets **1920×1080**, with the other current desktop/text-size
checks in [UI_RULES](../../UI_RULES.md). Visible outcomes are stated per journey.
Mobile optimization, a new shell and wholesale reference parity are deferred.

## Evidence and reading boundary

The [collection owner](CORC_MEDIA_AND_DESIGN_2026-10-20.md) owns F14–F29,
acquisition counts, original/derivative distinctions and missing attachments.
The [earlier Discord owner](DISCORD_RESEARCH_2026-10-15.md) owns F1–F13.
Here **shown** means visible in saved media, **stated** means attributed source
text, and **inferred** means our causal interpretation. None means shipped or
played in this pass.

| Reviewed here | Exact scope and remaining limit |
|---|---|
| Breadth | Read all 308 indexed post captions and inspected the first available media representation at contact-sheet scale for 280 records. Twenty-eight records have no indexed image representation. Classification: 160 likely Proto23 design/game media, 27 other-game/source, 58 technical/distribution, 46 jokes/art/off-topic, 17 unresolved. These are retrieval judgments, not independently verified authorship or complete semantic reviews. |
| Supplied media | Viewed all 23 supplied files, including 12 sampled frames from each of the two GIFs. Nineteen supplied still images match first-frame decoded pixels in indexed assets; that does not prove original byte identity or a unique original post. Four supplied files have no such exact match. |
| Deeper visuals | Larger review of 47 selected indexed records; 12 sampled frames apiece from the five linked GIFs, two additional climbing GIFs and one accessory GIF. Including the supplied GIFs, ten animation sequences sampled, not every frame or native playback. Both linked PNG scenes were also viewed. |
| Discussion | Read the main bodies of all 623 distinct actual messages in the 17 saved windows, including off-topic context and disagreement. These windows contain 630 actual message occurrences plus separator rows; overlap is deduplicated by ID. Reply previews were separated from each row's own text to prevent attributing a quoted statement to its replier. No full channel/thread read is claimed. |
| Prior source research | Reused the pinned [mechanism/probe report](SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md) and [Vivid flow palette](VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md). The older full-source comparison's dated absence claims are superseded by its linked adoption map and today's focused inspection. No new execution of downloaded HTML or full-source reread. |
| OOPS | Focused source reads of tools, gathering hooks, harvest, crafting selection/projection, chest transfers, furniture, pacing/weather and combat-log presentation. Source presence and call-site wiring only; no rebuilt browser, new test or current gameplay acceptance. Input hashes are saved privately. |
| YAIR developer | The [current acquisition owner](../yair-upstream/DISCORD_RESEARCH_2026-10-20.md) still reports verified Miktaew identity but no collected developer corpus at this pass's inspection. Inherited player buff/flavor notes remain player evidence. No new Miktaew design rationale is invented. |

Private analysis: [coverage and classification](private/discord-media-2026-10-20/analysis-oops-2026-10-20/caption-review.json),
[claim ledger](private/discord-media-2026-10-20/analysis-oops-2026-10-20/claim-ledger.json),
[animation samples](private/discord-media-2026-10-20/analysis-oops-2026-10-20/animation-sampling.json),
[input identity](private/discord-media-2026-10-20/analysis-oops-2026-10-20/input-manifest.json).
Raw wording, normalized context, media and detailed notes remain gitignored.
The contact sheets classify visual subjects; they do not make small unreadable
text into fully reviewed evidence. No browser gallery route was attempted.

Discord links retain the capture's source locators; none was reopened live here.
Attachment-path-derived expected links retain that qualification in the private
index. Minecraft house decoration and the Morrowind image are other-game media,
not Proto23 home features. In the July weather window, SardineMilk's event
example and Mercurius's body/combat proposal belong to those developers. Corc's
appreciation of event flexibility does not adopt their entire design for Proto23.

## Lessons, mechanisms and their costs

### CRL1. Uncertainty is useful when it changes a plan

**Shown/stated:** [underground weather](https://discord.com/channels/622495527485046805/811370601129705483/1525632186236145846)
can be hidden while weather still exists. The
[food discussion](https://discord.com/channels/622495527485046805/811370601129705483/1223511074372845630)
separately debates average lifetime, actual lifetime and learning through cooking
or experience. Corc raises uncertainty; players disagree about useful certainty.

**Why it works, inferred:** limited access creates a reason to observe, prepare,
remember or obtain a better means. But undifferentiated question marks erase
useful distinctions. A recent surface report, no current view and an uncertain
prediction are different information. The source does not establish one final
disclosure policy for all of these cases.

**OOPS proposal:** default to what the character can presently support, with the
last observation's place/time and relevant uncertainty when useful. Dials are
senses, instruments, expertise, reports and cheats. A tunnel may obscure the sky
while still exposing dripping water; weather and rock wetness need not change
together. Do not infer an underground-weather ban for a character with a working
remote sensor. Costs are obtaining/using those means and acting on stale evidence.

**Qualified in round 2:** a player-configured routine can become an information
channel if it exposes exact hidden expiry or promises perfect foresight without
a supported means. Ordinary such policies default to known cues or estimates.
Accepted protective safety stops are different: CBR27/BHR18 and the domain
application already permit inspecting real consequences without revealing their
hidden cause. They need no invented sensing prerequisite. Keep their public
reason observer-safe; stopping does not certify a diagnosis or precise forecast.

### CRL2. A method matters through the shape of what it leaves

**Shown/stated:** the [logging demonstration](https://discord.com/channels/622495527485046805/811370601129705483/1521016485944885269)
places target resistance, remaining tree durability and the actual tool/power
around ongoing work. In its context, Corc distinguishes punching scraps from
controlled clean slicing. [Smashing and disassembly](https://discord.com/channels/622495527485046805/811370601129705483/1424795106522828971)
can coexist with different outputs. Bare-hand aura is a discussed possibility,
not a verified working logging route.

**Why it works, inferred:** power and suitability answer different questions.
Breaking a tree quickly does not necessarily preserve a beam. A poor result can
remain useful as fuel. This creates multiple reasonable approaches without
pretending they are interchangeable or requiring one tool category forever.

**OOPS proposal:** default to methods whose real effects explain time, wear,
precision and output condition. World/material dials decide whether brute force,
heat, cutting, magic or another means preserves the desired structure. Costs
follow those effects. A powerful character can overcome the obstacle under
AD28/AD38; do not secretly scale its resistance back up to keep the old chore.

There is already a strong seam: [harvest](../../../src/harvest.js) records attack
aftermath and produces whole, damaged or scrap parts. Tool
[profiles](../../../src/tool_profiles.js) already describe verbs and improvised
rates, though hardness/precision are explicitly future-reader values there.
Extend a real downstream reader when selected, instead of adding decorative
material attributes. Gear-depth proposals retain their
[existing owner](../../GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md).

### CRL3. Storage becomes gameplay when it changes reach and timing

**Stated:** the [pile/ring exchange](https://discord.com/channels/622495527485046805/811370601129705483/1524215264537739426)
concerns logging/mining, explicitly not general loot. Large objects strain the
ring; their clock starts on entering the pile rather than on pickup. The
inventory-versus-pile question itself was still being discussed.

**Why it works, inferred:** producing, possessing, transporting and delivering
are separate accomplishments. A pile gives a physical place to accumulated work.
The ring's reason also makes an upgrade imaginable. A universal manual-pickup
step would instead add handling without necessarily changing a decision.

**OOPS proposal:** default to ordinary convenient pickup, adding a local pile or
haul only where a useful quantity, fragility, ownership or time constraint changes
the plan. Dials include carriers, body strength, containers, vehicles and spatial
means. The cost is an actual transport/custody constraint, not an unexplained row
limit. Native home storage is currently unlimited in the furniture projection;
this proposal does not replace it with Corc's limits.

For a selected perishable route, transfers should preserve age/exposure history.
Processing changes it through the process's mechanism; gathering, picking up,
splitting or combining a stack should not silently rejuvenate it. Cohorts may
need separate identity if freshness affects decisions. OOPS already has specimen
birth times and conserved [chest transfers](../../../src/native_storage_transaction.js).
That is a reason to trace the selected lot through those owners, not a claim of
a general food-spoilage implementation.

### CRL4. Automation should retain the player's intention when conditions change

**Stated:** [bounded autocrafting](https://discord.com/channels/622495527485046805/811370601129705483/1492270294709305455)
prevents unwanted indefinite consumption. [Chosen-tool preview and wear](https://discord.com/channels/622495527485046805/811370601129705483/1451305842501615646)
make the actual means inspectable. Timed crafting was tentative in the nearby
December exchange, with feedback intended to remain visible outside its menu.

**Why it works, inferred:** “make five” expresses a goal; “repeat until the
inventory is empty” is a different intention. A job that silently switches to a
valuable knife or a different ingredient can satisfy a quantity while violating
the reason it was started.

**OOPS proposal:** build on existing quantity/selection and stop controls. Default
to a disclosed scope: desired amount, chosen inputs/tool, stop reason and what
continues while another view is open. Dials permit substitution, reserves or a
known stopping cue. Costs are opportunity cost and the chosen means' wear. A
change outside the agreed scope stops or requests a new quote rather than
silently widening the job. Atomic crafts stay atomic; staged work retains the
stages and material actually settled under MR5/MR29.

This is partly present. The Village trial commits one selected batch;
[native material selection](../../../src/crafting_recipes.js) has a
stop-on-material-change option. [Tools](../../../src/tools_domain.js) stops a
broken-tool gathering cycle and supports an explicit restart with improvised
rates, wired in [main](../../../src/main.js). The next useful work is a coherent
journey and clear explanation, not a second scheduler. Offline/world pause and
banked-time direction remain with AD15–AD17; a menu animation owns no clock.

### CRL5. Mastery can change what needs attention

**Stated:** [cultivation's early design](https://discord.com/channels/622495527485046805/811370601129705483/902703368290598932)
connects passive growth, existing absorption skills and technique stages.
Corc describes material preparation beyond idling. The 2026 screenshots show
technique, support, rate and state of mind together; they do not verify the whole
2021 plan's implementation.

**Why it works, inferred:** skills can measure broad practice while a technique
changes what that practice does or requires. A milestone matters more when it
changes a routine than when it adds an unrelated percentage to another tab.

**OOPS proposal:** let one practiced method improve control, yield, safe working
conditions or the amount of routine handling the player delegates. A novice
learns a preparation; an expert can repeat that demonstrated preparation with a
stated stop policy. Worlds can retain deliberate ritual or exacting work when
their mechanism needs it. Time, apparatus and new circumstances still matter;
mastery need not erase them. Reuse the learned-method host, MR21–MR23 and SLR
owners. Do not create a universal cultivation ladder or make all practice consume
water because one source technique might.

The new design question is whether a milestone changes the player's next five
minutes. A lower time cost, an alternative route, or fewer interruptions can each
answer it. A menu of milestones with no changed use cannot.

### CRL6. Discovery needs to produce a useful next move

**Shown/stated:** [component-based recipe lookup](https://discord.com/channels/622495527485046805/811370601129705483/1111779482752274432)
was added ahead of catalog growth. [Recipe teaching information](https://discord.com/channels/622495527485046805/811370601129705483/905448996988940328)
and suggestions for lore/shop/notice clues address different parts of discovery.
The pinned source report corrects skill reveal to level-up rather than first XP.

**Why it works, inferred:** forward lookup answers “what do I need for this
goal?” Inverse lookup answers “what could this thing I found be good for?”
Together they make incidental finds and knowledge useful without a global quest.

**OOPS proposal:** default to known uses, supported hypotheses and retained
observations, with an explicit experiment route where available. Search should
follow observed identities/properties and local vocabulary. A hidden recipe's
name, count or position must not reveal it through inverse search. Dials add
manuals, appraisal and world-specific grammar. Costs are discovery and trials,
not extra mandatory reveal clicks. A familiar-looking ingredient may support a
guess without certifying its chemistry. [Derived-detail research](../../WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md)
already warns that names/categories cannot generate effects.

### CRL7. A number needs a baseline and a question it answers

**Stated:** [the April skill discussion](https://discord.com/channels/622495527485046805/811370601129705483/1492309608058847242)
is deeper than “numbers versus flavor.” Corc explains that a skill modifies an
intermediate strength term, so printing its internal coefficient as damage gain
would mislead. Players raise threshold outcomes and propose current-value
comparisons or earned numerical insight. Those suggestions were not established
as a shipped policy.

**OOPS proposal:** default to a short experiential description plus actual known
costs/results relevant to the task. When the means support a comparison, identify
its baseline: this tool versus improvisation, this target, this body, current
conditions. Dials permit exact values, intervals, qualitative cues or explicit
formula inspection according to knowledge and preferences. Distinguish an exact
internal stat from a forecast and from an observed outcome. The cost of a detailed
comparison is maintenance of the real reader and its disclosure boundary.

Rounding deserves attention at a selected breakpoint: a small displayed delta
can cross a meaningful survival, capacity or completion threshold. Conversely,
more decimals may add no decision value. Use the current tool-rate comparison
and sourced gear-stat pipeline where applicable, rather than writing parallel
tooltip math. This fits AD6–AD8 and UR40 without importing Corc's fourth-wall
preference as an OOPS restriction.

### CRL8. Interesting variety is a change in preference, not merely item count

**Shown/stated:** [accessory variants](https://discord.com/channels/622495527485046805/811370601129705483/1435208947869941880)
trade regeneration against maximum health and differ in condition. Corc proposes
wear/breakage and narrowly limits random item values for his game. A player
welcomes variety while asking for stable alternatives.

**Why it works, inferred:** there is no single “better” item when a longer outing,
a dangerous burst and scarce repair access favor different properties. Wear can
change which item one is willing to spend. It can also cause hoarding, frequent
replacement and anxiety about every minute of use.

**OOPS proposal:** use the accepted [many-dimension gear direction](../../EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md).
Default to a few understandable consequential differences in the selected slice;
world dials set rarity, generation, repairability and wear. Stable, crafted and
unusual generated equipment can coexist for different purposes. A loss/benefit
has an actual mechanism and source. Neither global random-affix grinding nor
universal degradation follows from this example. Compare useful roles and
replacement cost before increasing the number of rolls. Current optional
durability and instance ownership are starting seams, not missing systems.

### CRL9. Density works when the dependencies stay nearby and stable

**Shown/stated:** tool requirements reveal the selected dagger; recipe inputs,
output and work controls stay adjacent. In the
[oxygen exchange](https://discord.com/channels/622495527485046805/811370601129705483/1515288902909427744),
a reader specifically objects to a border crossing HP text. Corc tweaks it;
the reader says the difference remains difficult to see. An attempted revision
is not proof that the complaint was solved.

The pile window's surrounding discussion also criticizes another game's panels
changing order when opened/closed. Corc agrees that awkward UI harms a good
loop. These are individual experiences, not a survey or a verified audit of that
other game.

**OOPS proposal:** put a job's target, chosen means, progress and next decision
within its natural task region. Default to stable homes, selection and scroll;
let optional details expand without rearranging the remembered work surface.
Dials are density, text size and contextual resources. The reason is the player's
ability to scan dependencies while thinking, not maximum facts per pixel.
Keep source-like expressive grouping inside OOPS's existing shell and UR49's
documented differences. Verify actual text, contrast and keyboard inspection at
1920×1080 and enlarged text; no screenshot-only aesthetic verdict substitutes.

The blue matching tooltip remains a **dated unused alternate draft**. Its
[post](https://discord.com/channels/622495527485046805/811370601129705483/1556108309105344552)
does not establish creation age, replacement order or current final style.
Positive replies and Corc's glow intention explain the exploration, not a
general endorsement or rejection of blue tooltips.

### CRL10. Feedback should follow the timescale of the decision

**Shown:** climbing sequences show position, grip loss, falling debris, rain and
distinct landing imagery. The logging sequence shows a fell-tree transition and
later a change from selected axe to no tool. That image alone does not prove
why the tool disappeared. **Stated:** crafting feedback is meant to remain
visible while its menu is closed; repeated-log stacking becomes an optional
presentation choice in [its discussion](https://discord.com/channels/622495527485046805/811370601129705483/1072079511363006485).

**OOPS proposal:** quiet continuous progress supports a glance; a new constraint
or stop needs a plain reason and next move; a meaningful completion/discovery can
get stronger feedback; a durable receipt supports later reconstruction. Dials
are motion, sound, compression and emphasis. Costs include distraction and
render work, so redraw according to visible change and existing UI ownership.
Visual cadence does not settle gameplay or advance RNG/time.

OOPS [combat logs](../../../src/combat_log.js) already distinguish adjacent
equivalent events, preserve occurrence times, and keep defeats separate. Reuse
that semantic discipline when a different selected activity needs compression.
Do not collapse changed outcomes into a harmless-looking repeat count or replay
reward effects on reopening a record. Lethal source imagery gives no authority
to replace OOPS's forgiving recovery direction.

### CRL11. Home can be a buffer between expeditions and a place worth inhabiting

**Shown:** the supplied fireplace GIF changes capacity and descriptive intensity
when fuel is added. A [2021 firewood-pile screenshot](https://discord.com/channels/622495527485046805/811370601129705483/821624988531556362)
describes automatically supplying a fireplace but requiring replenishment. A
[2023 dwelling image](https://discord.com/channels/622495527485046805/811370601129705483/1141633192869232670)
describes an imperfect shelter rather than an abstract bonus room. These are
dated representations; the supplied GIF's exact originating post is unresolved.

**Why it works, inferred:** returning home can transform the meaning of gathered
fuel, wet equipment, reading and recovery. A local stockpile can shift attention
from repeated refueling to preparing for an outing. Small sleep and
[cat interactions](https://discord.com/channels/622495527485046805/811370601129705483/1525227182631419966)
give ordinary life texture without requiring a progression reward every time.

**OOPS proposal:** default to voluntary, useful preparation and a quiet return.
Dials include direct tending, a stocked feeder, an appropriate helper or a
self-sustaining means. Their costs and continuation follow actual world time and
chosen policies, without inventing an unattended maintenance debt. A successful
automation should remove old handling when it has earned that role. Home
furnishing/rest/reading bonuses already exist; this is a journey opportunity.
Flavor and optional mechanical benefits can coexist. Avoid turning every joke
or pet into a required optimization sequence.

### CRL12. Flavor suggests experiments, but is not proof of a resolver

**Shown:** the supplied herb/core descriptions connect materials to processing,
creatures, environment and possible uses. Book and storage-repair screenshots
make objects part of a place's history. The cat exchange contains player jokes;
it does not confirm a hidden boss.

**OOPS proposal:** distinguish evocative background, a character's claim, an
observed property and a supported actionable method. Default to prose that
offers useful hypotheses where a mechanism can answer them. Dials allow richer
simulation or authored exceptions when selected. The cost is keeping mechanical
promises and actual readers aligned; colorful text does not require implementing
every implied world process immediately. A claim may be wrong without the
underlying truth changing to fit it. Name/appearance-based derivation stays
qualified under the current derived-detail owner.

This yields a practical content test: if an object says it protects its contents
from rain, either the selected route can consume that property or the text makes
its current flavor/claim status clear. Do not announce a working rainproof
storage system from a descriptive tooltip alone.

### CRL13. Connect systems through a changed reason to revisit a place

**Inferred synthesis:** harvesting, material condition, portable means, home
preparation and technique practice can form a loop in which each result changes
the next outing. That is a possible OOPS loop, not a claim that all the reference
clips belong to one tested source sequence.

For example, in one original realm: an observed wet approach favors a safer
method; its output is useful but awkward to carry; preparation at home improves
the next trip; a practiced method later makes the old route routine. The return
reveals a useful clue, not merely a higher resource target. Both brute strength
and careful equipment can work with different costs under AD38.

World dials should change these relations. A spatial carrier can remove hauling;
a different body may ignore cold; a technique can produce a clean cut without
metal. Do not carry a source-world limitation across worlds without its cause.
Keep any world-scoped work on its own active clock, while a genuinely personal
faculty follows its declared carrier. Existing site, time and transfer owners
handle those distinctions. No second world, generated map or social simulation
is needed to prove the first connected loop.

### CRL14. Development demonstrations are best used to choose a playable question

The archive spans years of additions, alternate drafts, small polish and release
discussion. In the cat window, one participant speculates that much content is
not connected; another contrasts small useful delivery with a larger delayed
bundle. Those are comments, not proof of Corc's architecture or the cause of a
release delay. Prototype media do not settle compatibility, performance or feel.

**OOPS implication:** each proposed slice should answer one player question all
the way through use and aftermath. The pinned source probes already show why
preview, commit, rewards and hydration should not be copied as coupled closures:
they reproduced specific XP/tool/counter/random-selection problems in their
bounded fixtures. Keep the valuable experiences while using OOPS's current
owners and transactions. Do not commission another general foundation on the
strength of an attractive clip. This is AD33/AD36 sequencing, not a ceiling on
the depth or number of worlds Weibao wants.

## What already exists, and where the actual connection remains open

This map is **current source inspection**, not a live completeness audit. It
does not refresh earlier browser/persistence gates. Older granular research's
absence and defect statements remain dated unless separately reproduced.

| Area | Current owner / inspected seam | Interpretation for this round |
|---|---|---|
| Chosen tool, rates, wear, break, repair | `tool_profiles.js`, `tools_domain.js`, `tools_panel.js`; gathering start/work-cycle calls in `main.js` | Already source-wired. Test one complete job/stop/restart journey before adding another tool model. Hardness/precision's extra readers remain proposed. |
| Material aftermath and freshness | `harvest.js`: `drawSpecimen`, `harvestGrade`, `beginHarvest`, `cancelHarvest`, `advanceHarvest`; `harvest_ui.js` | Birth time, damage-dependent completeness, timed work and output receipts exist. General perishable transport is not proved. Exact forecast quality in the current panel needs a future selected means review; no disclosure defect is asserted without its intended knowledge contract. |
| Making and observations | `craft_state.js`, `craft_sources.js`, `crafting_frontier_runtime.js`, `crafting_home.js`; [CRAFTING_ENGINE](../../CRAFTING_ENGINE.md) | Existing product/knowledge/node owners and a selected-batch route. Rich confidence, stale reports and material-age cohorts are proposals, not assumed schema fields. |
| Input commitment | `crafting_recipes.js:find_recipe_material`, `native_craft_transaction.js` | Existing material-change preference and transaction boundary. Extend the selected consumer's intent, rather than assert every craft lacks a stop control. |
| Storage / home | `native_storage_transaction.js`, `absorb_b/furniture.js` | Conserved player/chest transfers and home rest/reading/storage effects exist. Native storage is unlimited. World piles/ring strain would be separately scoped variants. |
| Weather and state | `absorb_e1/pacing.js`, `world_weather_display.js`, `condition_facts.js` | Optional pacing and sheltered/weather wording already exist. They do not prove underground observation, lingering wetness or every cross-world climate mechanism. |
| Skills and UI growth | Learned-method host plus [prior source adoption map](SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md#f8-current-adoption-map-checked-against-live-source) | Extend an actual practiced method and its consumer. Do not restart skill discovery or claim current picker/search disclosure is fully verified. |
| Log / detail / effects | `combat_log.js`, `crafting_detail.js`, prior Vivid/panel owners | Compression, occurrences, detail and feedback already have owners. Source-like emphasis should explain a changed activity within the accepted shell. |

## Proposed next playable journeys, ranked locally

These are candidates for later selection, not new active requirements or a
replacement for the current queue. A full future implementation runs the repo's
required gates plus rebuilt fresh-origin desktop play. New saved state needs
Save, reload, Export and literal Import. Old-save compatibility remains deferred
by the later accepted decision; personal saves remain untouched.

| Candidate | Before → proposed player experience | Concrete future journey and observable done check | Capability / effort / trigger |
|---|---|---|---|
| **CRJ1. One gathering intention survives tool failure** | Disconnected rate, condition and repair facts → a legible plan with a useful output | Start an existing native gather with a known worn tool; inspect the actual means/rates; complete one cycle, observe the break stop; inspect without ending/advancing work; choose existing repair or explicit improvisation; use the output in one real recipe. The receipt explains spent inputs, wear and stop; reload retains the actual commitment/result. Existing native stop may already pass; if so, improve only the exposed gap. | Sol low/medium judgment for the cross-owner trace, bounded implementation after selection; **small to medium**, first when tools/activity UI is next touched. |
| **CRJ2. A fresh specimen changes a delivery choice** | A freshness number in one panel → preserve a useful outcome by choosing what to process and when | Use the existing carcass route; compare timely versus delayed processing on matched controlled fixtures, with an actual useful whole/damaged/scrap consumer. Transfer or cancel/resume without resetting birth time. The player can explain the difference from known evidence. Scope any new lot/custody state to this route. | Sol medium; **medium**, when harvest quality/custody is selected. Does not require general food spoilage or a finite global bag. |
| **CRJ3. A short home preparation changes one outing** | Home bonuses and weather as separate features → a reason to prepare, leave and return | At one authored existing place, demonstrate an observed exposure problem, choose an existing shelter/preparation/means, and show a meaningful time, condition or access change on the next trip. Pause at a consequential unknown choice. Return retains completed work and offers one optional quiet interaction. | Sol medium; **medium**, after a concrete condition/outdoor consumer is selected. No NPC simulation, cliff system or new map required. |
| **CRJ4. A learned method changes what the player attends to** | Another milestone number → a practiced technique simplifies a demonstrated routine or enables another approach | Discover one supported use from a known material/clue; perform it; practice through the existing method owner; demonstrate the changed routine/control; save/reload keeps knowledge, while unsupported means still have their actual cost. Inverse lookup shows known uses without revealing the next sealed recipe. | Sol medium for synthesis, Luna low for bounded content/fixture work; **medium**, when a learned-method consumer is next selected. No new universal skill tree. |

All four keep target progress, chosen means, immediate control and stop/completion
feedback readable at 1920×1080. The player journey, keyboard inspection,
populated state and larger text matter more than matching a crop's row count.
Human play/visual acceptance remains separate from technical passing evidence.

## More-to-consider disposition

**ACT NOW, completed documentation/research:** reviewed the saved corpus at the
coverage levels above, separated quoted reply previews from main-message claims,
retained the corrected alternate-tooltip chronology, kept other developers and
other-game media separate, saved private claim/coverage/input ledgers, and folded
the useful proposals into existing palettes below. No runtime, bundle, save,
tooling-repo, accepted direction, commit, push or publication change.

**ACCOUNT FOR NOW:** selected means and their costs belong to the commitment;
observation may become stale without changing truth; player-selected routine
policies must not expose unsupported foresight, while accepted protective stops
retain their real-consequence authority; transfers/processes retain the relevant material history;
mastery can remove repeated handling; known controls stay available when details
close; all continuation obeys the accepted clock and recovery policies. Apply
these to a selected slice, not as a mandatory supporting-system bundle.

**LATER / DELEGATE, not dispatched:** CRJ1–CRJ4 above. Additional source work is
a targeted context read only when a consequential claim needs it. YAIR rationale
comparison waits for its owning chat's acquired developer corpus, then compares
the same player journeys and retains disagreement. Suggested capability Sol
low/medium, small analysis pass; done when exact attributed evidence changes,
confirms or qualifies a named CRL lesson. No duplicate bulk collector is needed.

Proposal folds: [making](../../CRAFTING_ENGINE.md#corc-reference-round-2026-10-20-commitments-and-material-history),
[means/appraisal](../../MEANS_AND_APPRAISAL.md#corc-reference-round-2026-10-20-actionable-uncertainty),
[granular loops](../../GRANULAR_SYSTEMS_AND_INTERACTIONS.md#corc-reference-round-2026-10-20-connected-routines),
[Vivid/flow](VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md#corc-reference-round-2026-10-20-dependencies-and-attention).
These add proposals; they do not update AD rules or select new work.

## Verification and open limits

Documentation checks are recorded in the private verification receipt: relative
file/anchor checks for this pass's added links, whitespace/diff review, input
hashes, append-only preservation of the four palette baselines, and ignore checks
for private analysis. Shared dirty work on entry was preserved. Original capture
files were not edited; review derivatives live in the separate analysis folder.

No game build, test suite, source probe, source HTML execution or browser session
was run here. No current release, balance, save compatibility, full-history
coverage or human acceptance is claimed. Most individual media representations
and unsampled animation frames remain unreviewed; 26 listed attachment IDs still
lack bytes under the collection owner's inventory. The report answers the design
question from available evidence while leaving those boundaries visible.

## Round 2, 2026-10-20: falling, little UI reactions and fun

Weibao asked for more subtle things, specifically UI, falling and fun. This round
extends CRL1–CRL14 rather than restarting the research. **All examples below are
OOPS proposals unless labelled source evidence.** The point is to find expressive
little experiences, not turn each one into a new subsystem. Rules and deferrals
above continue; BHR10–BHR18, UR35/UR38/UR43 and the existing
[presentation palette](../../PRESENTATION_AND_FOURTH_WALL.md) particularly apply.

### Evidence added, and a correction

Reviewed 24 selected indexed images at a larger size, including cat art,
critical-hit sparks, equipment markers, glyph spacing, meditation state, hair,
reinforcement and the season header. Read their own captured captions. These
are dated demonstrations/questions; most have no saved full surrounding window.
Reused the earlier sampled falling/climbing frames and decoded timing metadata
for four clips. Encoded clip duration is presentation metadata, not simulated
fall time, input timing or proof of the game's physics.

Focused OOPS reads: `src/data/locations.js` has climbing activities, asymmetric
up/down travel, mountain shelter and place-specific noises; `src/defeat_domain.js`
has typed outcomes and a once-per-collapse guard; `src/settled_text_effects.js`
already has anchored effects, duplicate-receipt suppression and reduced-motion
handling. Those are source seams, not proof of a playable fall/catch simulation.
The current humor owner already models cause, audience, recognition, variation
and payoff. This round reuses those ideas instead of proposing another joke engine.

**Correction to CRL1/AA10:** my earlier wording treated all hidden-state-aware
stops alike. [The accepted domain application](../../DOMAIN_RULES.md#cross-audit-application-2026-10-18-1)
explicitly allows protective safety stops to inspect real consequences without
revealing hidden causes. The revised wording distinguishes that protection from
player-configured automation exposing exact hidden information. Neither needs
a new global policy system.

### CRL15. A tiny spatial scene can make a progress bar feel like a body

The source climbing frames use a vertical extent, a small character mark,
dislodged debris and a base/summit. Very little drawing communicates height and
instability. **Inference:** spatial relationships do more work than expensive
art here. A falling pebble says something different from an arbitrary sparkle.

**Proposal:** a small side view inside the activity region could show the climber,
a ledge and where loose debris goes. Default to one readable spatial relationship
with a text equivalent; dials add a rope, wind, a load or a different body when
their mechanisms matter. The cost is binding the scene to real progress and
conditions. Keep the desktop workspace stable: the little person moves; the
player need not chase the action controls. This can be ASCII, SVG or ordinary
DOM, without a platformer, scrolling world map or physics engine.

### CRL16. A slip, a fall and a landing are different dramatic beats

The [debris clip](https://discord.com/channels/622495527485046805/811370601129705483/1534727563966939146)
shows loss of grip without demonstrating every consequence; the
[fall clip](https://discord.com/channels/622495527485046805/811370601129705483/1534830288256106567)
has a distinct drop and landing. Neither proves a timed rescue mechanic.

**Proposal:** default to a readable sequence: footing gives way, the character
loses height or catches support, then the outcome becomes clear. A few grains
falling before the character, a brief held pose, then a quick descent can make
the event legible. If catching a ledge is a real choice, offer a proper paused
decision or previously chosen policy under AD16. If it is only an animation of
an already settled outcome, do not imply that fast clicking could rescue it.
World dials determine which supports/actions exist. The cost is implementing
the chosen response, rather than merely drawing a tempting button.

### CRL17. Landing can leave a situation rather than just subtract HP

**Original proposals:** an awkward landing on a lower shelf; hanging by the
rope with the pack below; arriving safely but needing a rest; a bruised return
under the existing forgiving recovery policy. These can be funny, tense or both.
Height alone does not settle them: body, surface, speed, support and actual
protective means matter where the selected model reads them.

Default to forgiving, explained aftermath. A harsher loss/injury rule needs its
existing world/settings authority and forewarning. Cargo displacement, rope
strain or lasting injury are optional selected mechanics with real ownership
and recovery costs, not automatic penalties for every fall. A flying, intangible
or sufficiently capable character can bypass the old problem under AD38.
Reuse condition/work/custody and defeat owners when needed; typed unconscious
outcomes do not mean that every stumble is a defeat or that all fall routes
already exist.

### CRL18. The pause after impact can be funnier than extra particles

The saved fatal/nonfatal variants have different landing imagery, but no
measured player response is available. **Proposal:** for a light-tone outcome,
let the dust clear and give the character a beat to assess their dignity. For
example: “You land on your feet. Then sit down rather quickly.” The real result
stays in plain text beside it: safe, resting, or another actual state.

Default to short local staging with optional sound. Tone and intensity are dials:
a serious injury should not automatically trigger slapstick, and a harmless
stumble need not get a full-screen alarm. Presentation can be skipped/reduced
without repeating or undoing the outcome. Repeated ordinary falls can get
quieter; a genuinely changed result deserves its own emphasis. The cost is a
small authored beat, not a compulsory real-time wait after every attempt.

### CRL19. Let the affected thing react

Corc's [critical-hit experiment caption](https://discord.com/channels/622495527485046805/811370601129705483/1478490836005031957)
explicitly describes sparks from the HP bar. A
[reinforced-weapon image](https://discord.com/channels/622495527485046805/811370601129705483/1105908754450493530)
changes the durability presentation. These show exploration, not accepted OOPS
styles or measured usability.

**Proposal:** a struck bar can briefly retain a trailing segment showing the
loss; a repaired tool's condition fill can return with a crisp local accent;
a caught rope can become taut in its scene. Default to the subject's region,
with text and static states; world/theme dials choose ink, chips, threads or a
quieter treatment. That makes effects informative about *what changed*. Preserve
the actual bar value and controls throughout. Reuse existing anchors and emit
from settled events; no random damage, reward or extra roll comes from the VFX.

### CRL20. Small state changes can carry personality

The [fireplace](#crl11-home-can-be-a-buffer-between-expeditions-and-a-place-worth-inhabiting)
changes descriptive energy with fuel; a [meditation image](https://discord.com/channels/622495527485046805/811370601129705483/1053239456037093426)
shows state of mind; [hair detail](https://discord.com/channels/622495527485046805/811370601129705483/1097243864391241788)
gives the character an ordinary physical detail. These do not prove a general
mood or hair-growth simulation.

**Proposal:** a lamp gutter, a settling posture, wet footprints or a recently
patched strap can make existing state feel lived in. Default to cues derived
from facts already owned by the selected system. Dials choose body, place and
style; a new lasting fact earns a save owner only if it is worth remembering.
The cost is keeping the cue honest. Hair does not grow through a frozen world
merely because a cosmetic animation runs. A cheerful pose need not imply a
secret morale multiplier. Texture can remain texture.

### CRL21. Recent-change cues are more useful than permanent excitement

Corc [shows and calls disabled a recent-XP marker](https://discord.com/channels/622495527485046805/811370601129705483/832698209729380363).
In a [separate rank-update caption](https://discord.com/channels/622495527485046805/811370601129705483/1202400265458810961),
he describes continuous growth making rank changes visually annoying. The
[season-header question](https://discord.com/channels/622495527485046805/811370601129705483/812154188913049630)
asks whether its emphasis draws too much attention. Their final settings remain
unresolved in this sample.

**Proposal:** a temporary mark could identify which *known* skill benefited from
the outing, or which tool/condition changed since the player last inspected it.
Default to a quiet mark and an explicit summary; dials offer more celebratory
feedback. Update frequently changing numbers without continually restarting a
flash. The cost is choosing what counts as meaningfully changed. Avoid automatic
row resorting under the pointer, and do not use markers to reveal an undiscovered
skill. Returning attention should find a useful difference, not a backlog of
every unobserved animation.

### CRL22. Typography and labels are part of the toy's feel

The archive includes a [glyph-spacing question](https://discord.com/channels/622495527485046805/811370601129705483/975882233481154590),
the prior long-name repair, and a [label sketch](https://discord.com/channels/622495527485046805/811370601129705483/1523786295556702389)
whose caption explains shortening a control after the text failed to fit.
This is evidence of particular fitting problems, not a font ranking.

**Proposal:** reserve tiny labels for familiar secondary facts; give active verbs
and full names room. Numeric columns can align while prose remains comfortable.
Distinctive glyphs can make a scene charming, but test them with fallback fonts,
long names and enlarged text. A shortened label should still explain itself on
focus or stable inspection. Keep the full subject identity available when a
compact alias is shown. Default to the established desktop typography; density
and world style are dials whose cost is legibility, not simply fewer pixels.

### CRL23. A creature can be a little actor without a social simulation

The [cat art](https://discord.com/channels/622495527485046805/811370601129705483/1526774084170551366)
and thought screenshots give personality through a small visual/text moment.
**Original proposals:** a cat tracks a dangling string, kneads a blanket, or
inspects a newly placed object. A harmless object can wobble and settle when
handled. Something ordinary responding to the player's presence can be pleasant
without another stat reward.

Default to a local, optional reaction tied to a real interaction or suitable
state; frequency, character and fanciness are dials. One incidental look need
not be saved as relationship history. A durable rename or actual object change
uses its existing owner. Keep interaction controls stable while the creature's
art moves. Keyboard users get the same explicit action. A large cast, schedule
simulator or companion progression system is not needed for one little actor.

### CRL24. Competence and anticipation can be funny too

The existing [humor owner](../../gm/dispatch/procgen-2026-10-13/p26/HUMOR_AND_NOVELTY.md#z11-humor-has-a-cause-and-an-audience)
already treats jokes as caused, audience-dependent and capable of ending. Extend
it with small physical contrasts rather than adding a random joke generator.
**Original examples:** a novice hugs a rock after a scare; much later the same
character steps over the obstacle while carefully protecting their lunch. A
formidable cultivator can land perfectly in the one muddy patch they failed to
notice. The method works; the mundane priority is the joke.

Default to a fitting brief aside, with serious/quiet presentation available.
World tone and the observer's actual knowledge set the dial. The cost is authored
context and timing. Do not take away a working power to preserve an old gag,
announce a fake debuff, or make the laugh depend on repeated punishment. A
callback should recognize a real earlier event and can rest once its cause ends.

### CRL25. Little sounds can explain space and make silence meaningful

OOPS already has place-noise lines: a rock takes a long time to hit below a
mountain path, wind passes, and birds cross overhead. **Proposal:** use those
observations to support a small scene: a pebble vanishes, then an optional faint
impact; sheltered rain sounds different from exposed rain; after a noisy descent,
the camp becomes quiet. The useful fact can be textual even with audio off.

Default to sparse local cues. Hearing, obstruction, body and place tune what can
be sensed, with no claim that every noise identifies its exact source. A delayed
sound may suggest depth; it does not grant a perfect distance measurement. Cost:
a small coherent sound/text vocabulary and nonintrusive mixing. Cosmetic sound
timers do not advance world time, and missed ambience need not be replayed when
the player returns to the tab.

### CRL26. Let the first arrival and later familiarity feel different

**Original proposal:** reaching a first overlook can briefly clear routine
chatter and let one new, observer-supported detail land. Returning later might
show a familiar foothold, a repaired marker or the place where the character
once rested. After gaining flight, the former hard climb can pass beneath them
without another mandatory suspense sequence. That contrast makes progress felt.

Default to existing discovery/history facts and the actual current route. Dials
allow changes caused by weather, repair or world events. Costs are retaining the
few details the player will recognize and giving the place a useful reason to
revisit. No automatic reveal of hidden interiors, new destiny, universal first-
visit reward or global nostalgia ledger is implied. Reuse known-things, site and
event owners when the selected scene needs memory. Quiet arrival is an option,
not a template every place must follow.

### Round 2 disposition and useful next experiments

**ACT NOW (done):** saved CRL15–CRL26, enlarged the selected visual review, bound
the new source-caption claims privately, checked current presentation/climbing/
defeat seams, and corrected CRL1/AA10's safety-stop overstatement. Folded the
useful visual and playful additions into the existing UI, presentation and
granular owners. No gameplay change or new accepted direction.

**ACCOUNT FOR NOW:** separate animation of an outcome from a real response
window; distinguish a stumble from a defeat; let capable characters retain their
competence; keep local expression and persistent aftermath separate. Existing
comfort/recovery, paused-choice and observer rules remain authoritative.

**LATER / DELEGATE, none dispatched:** these are optional additions when their
owning slice is selected. They do not replace CRJ1's earlier local recommendation.

| Candidate | Capability / effort / trigger | Observable done check |
|---|---|---|
| **CRJ5. One tiny climb/landing study** | Sol low/medium for comparing the authored experience; small disposable workbench study when a spatial activity is selected | Compare clean climb, slip/catch and forgiving landing at 1920×1080, including static/reduced-motion treatment. The player can tell position, event and available response; controls stay put. Clearly label simulated fixtures. Native behavior remains a separate later gate. |
| **CRJ6. One local physical reaction** | Luna low for a bounded presentation leaf after its event/anchor contract is settled; small, when an actual repair/hit/arrival already supplies a receipt | One subject reacts, plain/static text says the same thing, inspection/skip/reopen neither repeats the outcome nor changes simulation. Browser-check the actual native event before claiming delivery. |
| **CRJ7. One ordinary-life callback** | Sol low for voice/context, small, when a real home/return interaction is selected | A real prior event permits a fitting optional variation; a capable character stays capable; choosing quiet does not hide the useful outcome. Human review decides whether it is funny. |

Round 2 private evidence and check receipt:
[review package](private/discord-media-2026-10-20/analysis-oops-2026-10-20/round-2/).
Current UI target: 1920×1080 with larger text and reduced motion; mobile and
whole-game animation work remain deferred. Documentation checks cover added
links, corrections and preservation of prior text. No game build, runtime test,
browser implementation, original-capture mutation, commit or push in this round.


## Round 3: atomic feature audit and side-by-side

The [further feature audit](FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md) records
**PFA001–PFA090** across inspection, local reactions, work/tools, making,
custody, food/environment, progression, combat, home and services. Each row
compares dated reference evidence with an inspected OOPS source counterpart,
then separates present support, partial routes, deliberate differences,
candidates and unresolved claims. **PFY1–PFY10** add a compact three-way
comparison using the recovered YAIR developer research owner. These are
proposals and evidence, not accepted mechanics or implementation selection.

This pass enlarged the first representation for 90 further indexed records and
revisited 17 ambiguous records, with technical experiments, historical
prototypes and jokes kept out of feature claims. The independent
[UI/playful report](UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md)
adds concrete comparison/transfer/label/lifecycle findings. No current dirty-
source browser parity is claimed.

The YAIR acquisition owner has advanced since rounds 1–2's zero-corpus
checkpoint: its [current report](../yair-upstream/DISCORD_RESEARCH_2026-10-20.md)
now records the developer corpus, completed missing-ID recovery and a deeper
selected-media round. PFY comparisons reuse that owner's qualified findings;
this chat did not independently re-audit its raw archive.

**ACT NOW (done):** saved the finite matrix and evidence boundaries. **ACCOUNT
FOR NOW:** exact timing, subject identity, known facts, useful comparisons and
stable return. **LATER:** PFB1–PFB5 rank connected optional experiments and retain
their capability, effort, trigger and observable done checks. No new work was
dispatched by this round; CRJ1–CRJ7 remain the earlier journey palette. Private
[round-3 ledger and checks](private/discord-media-2026-10-20/analysis-oops-2026-10-20/round-3-feature-audit/)
retain input identity and review coverage. No gameplay, save, accepted rule,
build, commit or push changed in this documentation-only round.

## Round 4, 2026-10-21: what the 26 recovered files actually add

Weibao asked for a deeper review of the recovered files and their surrounding discussions using `more-to-consider`. This round follows AD32/35/36/37 and UR59–UR64. It extends the existing palette with CRL27–CRL34; it selects no gameplay work and changes no accepted rule. Desktop examples target 1920×1080, with 14/21px text where applicable. Mobile work remains deferred.

### Evidence boundary and corrections

The [recovery receipt](../../../docs/gm/dispatch/corc-missing-media-2026-10-21/REPORT.md) accounts for all 26 originals. This review read all 26 saved context windows, including reply previews and disagreement; quoted speakers were distinguished from the current speaker. It read the complete changelog and six distinct small standalone HTML prototypes; the repeated `34.html` is byte-identical across two posts. It compared the two `23delta.html` files and read selected relevant spans of the four large game snapshots, not all game content. The 2021 snapshots identify themselves as versions 450 and 468; both 2024 delta files still identify themselves as 470. Post date, internal version and byte identity are separate facts.

All eight PNGs and both GIF frames were inspected visually. The font's collection structure and differing hash from OOPS's current private collection were checked, not every font face/glyph. The three MP3s were classified using their discussion and existing full-decode receipts; they were not listened to in this pass, so there is no musical-quality or spatial-audio listening claim. The community save was decoded as inert text to inspect its envelope only, never imported or played. No recovered HTML was executed, installed or used to load external dependencies.

The recovered set corrects its own apparent importance: several files are personal media, reaction imagery, line-count crops or unrelated microprojects. They are not 26 additional gameplay demonstrations. Conversely, the historical game code contains a food-appraisal route that a caption-only review could miss. F22 and CRL1's March 2024 discussion remain accurately described as a discussion; they should no longer be read as evidence that earlier versions lacked food inspection.

Private [review ledger and source excerpts](private/discord-media-2026-10-20/recovery-26-2026-10-21/deeper-review/) retain the 26-file dispositions, hashes, exact source line spans and OOPS input identity. Nearby windows are selected evidence, not complete threads. The catalog reports 179 scoped unique messages; a raw-key inventory yields 180 entries because one date-separator row is excluded by the importer. Neither is a claim of full-channel coverage.

### CRL27. Knowledge progression can improve the decision before it reveals an exact number

**New source evidence:** in the recovered March 2024 game file, `ttl.rfpn2.talent` raises `survinf`; its description names rough food inspection. `descsinfo` case 1 derives freshness wording and rough affected quantities from the item. Case 2 estimates days and amount using average decay parameters. The file search found the title increment and these consumers, but no demonstrated ordinary earning route to case 2. This is source-level evidence, not a played unlock or a final current policy. [Source post](https://discord.com/channels/622495527485046805/811370601129705483/1214810498282029086); private source lines 619–623 and 10987–11005.

**OOPS consequence:** an apprentice cook can learn enough to choose what to eat first without acquiring an exact spoilage countdown. A better instrument, expertise or extraordinary sense could support a more precise estimate. Keep the actual material state separate from the observer's estimate, its basis and observation time. When transferring a stack, retain the material's age; when inspecting it again, refresh the estimate through the current means. An automation rule may use that public estimate, while accepted protective stops retain their existing observer-safe exception.

**Reuse and limit:** MEANS_AND_APPRAISAL and CRL1/CRL3 already own this distinction; CRAFTING_ENGINE still identifies general spoilage as not yet modeled. `known_things.js` supplies known membership, not a spoilage simulator. Extend the selected material/readout owner when an actual perishable route is chosen. Do not add a parallel global expiry service or adopt the source's exact thresholds and title requirements as world-wide laws. Applies AD6–AD8, AD38, MR30 and UR61/UR63.

### CRL28. A tiny toy is useful when it exposes a relationship

**New source evidence:** `34.html` selects the nearest point and draws the connection and distance. `35.html` adds moving targets, distance-dependent appearance and score. `25.html` exposes a simple click-to-add particle experiment. `32.html` recolors matching pixel groups from a small clickable palette; it also references an external image, so recovering its HTML does not recover every dependency or prove offline operation. Corc's nearby replies describe small experiments, including a clickable grid. [Distance and sequel](https://discord.com/channels/622495527485046805/811370601129705483/954358469840998440), [palette](https://discord.com/channels/622495527485046805/811370601129705483/1386004665010753596).

**OOPS proposal:** show a small actual relationship beside its consequence: which branch a harvesting reach can touch, which known route has the shortest travel time, or which supported target an action will affect. A moving highlight should answer “why this one?” before the player commits. Distance, path cost, reach and observer knowledge are separate quantities. A nearby point behind a barrier is not necessarily a valid target.

**Reuse and limit:** `region_view.js` already projects known native connections and their travel times, then delegates Go to the real travel control. A later visual study can use that projection. The source's nearest-point rule is not an OOPS targeting policy, and no new spatial simulation or forced manual minigame follows. Use an explicit tie rule and stable target identity if a future consumer needs proximity; focus changes must not silently retarget a committed action. Applies SR/AR ownership and UR62/UR63.

### CRL29. Build small authoring experiments around the real component

**New source evidence:** `23_c.html` puts glyph, foreground and background inputs beside actual 18×18 effect-icon elements, initializes several combinations, and appends each submitted combination as a comparison row. That is more useful than a color palette detached from its labels. Static source establishes the composition, not verified browser rendering. Corc says it was made for a friend to experiment with. [Source](https://discord.com/channels/622495527485046805/811370601129705483/1476399903218335766).

**OOPS proposal:** compare candidate effect chips in the existing customization/workbench surfaces using the real renderer and token values. Include a narrow glyph, a wide symbol, a numeral, selected/disabled states and long known names. Keep several candidates visible so comparison does not depend on remembering the previous color. Inspect at 1920×1080 with actual 14/21px text and per-glyph fallback; a source-sized 18px square is an example, not a new target size.

**Reuse and limit:** `customization_ui.js` already has draft component previews, Apply, profile JSON and effects previews. Extend its sample matrix only for an identified missing case; do not create another theme editor. The reference's raw palette mutation is not a save or undo model. A cosmetic draft must not alter active gameplay, observed knowledge or the committed profile before Apply. Applies UR60/UR62 and existing MOCKUP_SYSTEM.

### CRL30. Background catch-up needs evidence about outcomes and event order

**New source evidence:** the February and March delta files differ in both elapsed-time accumulation and battle handling. The earlier form multiplies elapsed seconds by two and rejects sufficiently large gaps; the later form accumulates elapsed seconds, uses a different reset threshold and converts whole seconds into multiple turns. It also changes the `tickflip`/battle-pause path. The accumulator reset means this is not simply an unlimited “100% progress while away” guarantee. A player suggests quiet audio as a workaround; that is a separate suggestion, not the implementation shown by the files. [Original request](https://discord.com/channels/622495527485046805/811370601129705483/1210396633863290942), [replacement](https://discord.com/channels/622495527485046805/811370601129705483/1214810498282029086).

**OOPS consequence:** compare a foreground run, the same elapsed interval under throttled scheduling, and reload/return through the chosen away-time policy. Check fuel spent, work completed, effect expiry, battle/recovery boundaries and output receipts, not just the displayed clock. A pause and a hidden tab need not mean the same thing. Bound processing slices to preserve responsiveness, while retaining the chosen policy about unprocessed time.

**Reuse and limit:** `simulation_clock.js` already owns engine timers and deterministic stepping. `main.js` has drift correction and a sliced fast-forward test route, explicitly distinguished there from a player offline policy. The existing settled-effects presenter consumes hidden-tab receipts without replaying old sounds. This inspection does not establish a current clock defect, certify the source patch or select a new away-time policy. Applies AD15–AD18, AR3/AR16 and UR62/UR64.

### CRL31. Separate an emerging capability from a finished progress readout

**New source evidence:** the stick screenshot announces a skill, then displays invalid numeric progress. Corc says broadly levelable objects can lack necessary information. The attraction is the surprising experiment; the incomplete numeric contract is a real limit. [Source](https://discord.com/channels/622495527485046805/811370601129705483/912757826227666964).

**OOPS proposal:** when a world reasonably supports a new use for an object, preserve the action and its consequences even before there is a conventional skill track. A valid qualitative statement can precede a known denominator. Keep “not measured,” “cannot currently observe,” “no comparable scale” and a development-data failure distinguishable. Do not disguise a broken value as fictional mystery or invent a 0–100 bar merely to fill a slot.

**Reuse and limit:** `meter_bar.js` already rejects nonfinite values and nonpositive maxima, while `skill_discovery.js` projects discovery/status separately. Those are existing protections, not newly missing features. A future boundary check should ensure a malformed optional readout cannot destroy neighboring valid controls, and that any error is recorded for developers. That containment has not been audited here. No arbitrary-object leveling implementation is selected. Applies AD5/AD38, UR61 and SLR ownership.

### CRL32. Keep local achievement legible beside a larger world's scale

**New discussion:** just before the recovered changelog, Corc explains intentionally modest early title framing as a way to imply larger scales beyond the village. Later community demon-king/village jokes are interpretations, not a confirmed plot or an OOPS progression specification. [Developer explanation](https://discord.com/channels/622495527485046805/811370601129705483/814931186756485140).

**OOPS proposal:** a village may treat a person as its best smith while wider experience reveals what the title does and does not cover. Show the accomplishment's scope and actual effects, rather than turning a locally important achievement into a meaningless percentage of a cosmic maximum. A larger unknown world can create anticipation without disclosing every hidden tier or making the UI belittle the player. Tone depends on the culture, speaker and relationship; insulting titles are not a global default.

**Reuse and limit:** current `titles_ui.js` already shows title requirements and bonuses; `known_things.js` limits records to encountered knowledge. Retain those owners. A scoped title or comparison needs a real source of reputation/knowledge and a consumer, not merely another naming ladder. Applies AD6–AD8, UR59/UR61 and existing title/world owners.

### CRL33. Typography portability is a concrete source correction

The font discussion documents a missing-font problem and a plan to bundle a collection. OOPS already has an optional private TTC fallback in `styles/ui_tokens.css`; its hash differs from the recovered TTC. That difference alone says nothing about whether their relevant glyphs look different. The CSS also tries local fonts first, so success on this Mac does not establish a clean-host result.

**Account for now:** retain UR60's rendered-face and per-glyph check. In a later packaging/font pass, test the intended candidate with local font resolution unavailable, inspect numeric alignment and wide-symbol bounds, and name the distributable fallback. The original launch treatment and module/player overrides remain authoritative. Do not replace or distribute a font merely because a Discord attachment exists. No font was installed or changed here. [Source](https://discord.com/channels/622495527485046805/811370601129705483/1176824068851388426).

### CRL34. Preserve enough context to reproduce an odd result

The error screenshot shows a string-length exception in the source message/damage path; nearby participants say they cannot reproduce it. Corc later reports an infinite-health fix. That sequence does not prove the screenshot's root cause or the effectiveness of that fix. The recovered community save and versioned HTML demonstrate why the exact artifact and active state matter more than a cropped error alone. [Source](https://discord.com/channels/622495527485046805/811370601129705483/825246971702542348).

**OOPS proposal:** when a real defect occurs, capture a private reproduction packet with build identity, chosen action/subject, relevant public receipt and the minimal fixture that recreates the failure. Use current headless/stepper tools and synthetic or explicitly authorized private state; do not commit another person's save. Check bounded rendering of abnormal numbers/messages if that is the reproduced failure. No cause was inferred and no OOPS defect is claimed from the source screenshot.

The remaining music, photo, reaction and line-count files add provenance and personality context, but no new mechanics. Nearby discussion of panning and volume envelopes can inform a later optional sound study, yet listening, reuse rights and implementation remain unverified. Current `settled_text_effects.js` already has gesture-gated optional sound and silent operation; do not add audio to defeat timer throttling or infer a shipped soundtrack from personal demos.

### Round 4 disposition

**ACT NOW, done:** reviewed/classified the finite recovery set, saved source excerpts and input identity, and corrected the earlier research boundary concerning historical food appraisal. All proposed mechanics remain proposals. No authority/UI-rule files, gameplay, saves, builds or commits changed.

**ACCOUNT FOR NOW:** keep estimate versus truth, actual target versus visual proximity, cosmetic draft versus committed state, and same-duration simulation versus callback frequency separate. These refine existing AD/UR owners rather than adding a competing rulebook.

**LATER / DELEGATE, ranked proposals, not dispatched:**

| Code | Useful bounded follow-up | Route / effort | Observable done check |
| --- | --- | --- | --- |
| CRJ8 | Food observation ladder, when a perishable route is selected | Sol medium for mechanism/knowledge judgment; medium | One real material, two supported observation qualities, age-preserving transfer, stale estimate handling and save/reload/import through its existing owner |
| CRJ9 | Effect-chip comparison added to the existing workbench/customization preview | Luna low for settled renderer wiring; small | Real components at 1920×1080 and 14/21px; saved side-by-side candidates, static equivalents, exact glyph/fallback evidence; preview leaves gameplay/active profile untouched |
| CRJ10 | Background/return outcome comparison through the existing simulation clock | Sol medium for coupled clocks; medium | Same chosen duration/policy yields explained work/resource/combat outcomes; no duplicate settlement or cue backlog; any intended differences documented |
| CRJ11 | Scope-aware title/comparison wording in a selected world | Sol medium for design, Luna low once settled; small | Actual known source/scope and effect shown; local achievement remains meaningful; no hidden-rank leak or invented global denominator |

This was a research/static-code pass. No rebuilt browser behavior, current gameplay parity, sound taste or human acceptance was established. No further fetching, agents or paid routes were used. The inherited shared ceiling remains 52%; observed review start was 48%.

## Round 5, 2026-10-21: subtle interactions folded into the plans

Weibao asked for another deeper pass and for useful additions to be folded into existing OOPS plans. This authorizes the documentation fold, not implementation or acceptance of every proposal. AD32/35/36/37, AD6–AD8, AD15–AD18, AD38, relevant MR/AR and UR59–UR64 apply. The inherited shared budget ceiling remains 52%; this round started at 49%, solo, with no new acquisition. Existing source/private evidence was reused. Desktop examples target 1920×1080 and actual 14/21px text; mobile optimization remains deferred.

### New source detail and consequential interactions

The useful new static detail is that the recovered game file's `addDesc` grants a small amount of reading XP on `mouseenter`, alongside displaying a description. The same snapshot restores title-talent markers on load before applying ungranted talents. These are concrete historical source mechanisms, not claims about current released behavior. The source's food-inspection, clock patch, icon tool, distance toys and surrounding rationale are reused with round 4's limits. Exact private source lines and current OOPS inputs are saved in [round-5 evidence](private/discord-media-2026-10-20/recovery-26-2026-10-21/deeper-review/round5/).

| Code | Further interaction and evidence | OOPS consequence / disposition |
| --- | --- | --- |
| CRL35 | **Inspection can be an action, not merely presentation.** Historical `addDesc`, lines 10362–10366, awards reading XP when the pointer enters. This means the source's UI gesture participates in learning. [Historical game artifact](https://discord.com/channels/622495527485046805/811370601129705483/1214810498282029086). | ACCOUNT FOR NOW: keep passive public projection separate from an intentional examination with real learning/time/cost. Hover, keyboard focus, font reflow and fixture restore default to no simulation mutation. A world may make examination teach something through its existing action owner. This refines a source-adaptation boundary, not an anti-cheat rule. |
| CRL36 | **Material age, observation time and present expertise can diverge.** Food code reads material condition through the observer's `survinf`; the later discussion separately considers experience and average versus actual lifetime. | ACCOUNT FOR NOW: improved skill supports a new reading, without silently upgrading what was known yesterday. An estimate describes a particular material/quantity under particular means. Preserve useful prior knowledge on transfer; qualify or refresh it when subject scope changes. No mandatory three-clock save schema follows. |
| CRL37 | **Mixing stock can invalidate an estimate without changing total quantity.** The recovered food code uses stack amount and average decay parameters; it does not prove a general mixed-age inventory model. This is our inferred consequence for CRL3/CRL27, not a newly claimed source mechanic. | ACCOUNT FOR NOW: split/merge only as the selected process requires. Do not manufacture a universal averaged expiry or reset age on transfer/cooking. A real preservation process can change deterioration for a reason and cost. Ordinary stock-selection policies use supported observations; actual spending and accepted safety stops keep their existing owners. |
| CRL38 | **A preview can become stale between gesture and commitment.** Source nearest-target toys recompute by current pointer distance; the icon/palette experiments can also change geometry. That is appropriate for a toy but not evidence of a committed-action policy. | ACCOUNT FOR NOW: keep the selected logical subject through pointer/focus changes, delayed fonts and stock changes. Revalidate native applicability at commit. Substitute only under an explicit existing policy. OOPS already binds exact material selection and Craft controls through `material_choice_view.js`; this is a boundary scenario for that route, not a confirmed bug. |
| CRL39 | **Glyph, backing and geometry carry meaning together.** The icon tool creates actual chips from glyph/foreground/background, while the real source effect definitions own separate behavior. Font availability was an actual discussion problem. | ACCOUNT FOR NOW: a fallback font/theme may change a chip's shape but should retain its known meaning and actual subject anchor. Use a known label/static explanation and actual component samples rather than judging a detached swatch. OOPS's existing customization preview remains the home. |
| CRL40 | **Learning during catch-up changes what later actions can know.** The recovered patch changes elapsed-time and battle scheduling together. Coupling that observation with the food/title source creates a further ordering question; it does not establish an OOPS defect. | ACCOUNT FOR NOW: put a capability/fuel/target boundary inside the test interval. Later actions may use a newly earned means; earlier decisions retain their historical basis. Returning to the UI can summarize those public changes without replaying effects or presenting new knowledge as an old prediction. Simulation must not depend on how many times a panel renders. |
| CRL41 | **Reloaded entitlement and replayed celebration are different lifecycles.** Historical load code, lines 388–391, restores an applied-talent marker. OOPS instead already stores held titles and derives known bonuses, while `createReceiptGate` handles bounded presentation deduplication. | ACCOUNT FOR NOW: preserve derived entitlement and one-time settlement under existing owners; do not add a second bonus cache or use a visual seen-ID set as reward authority. A load, theme apply or old panel rebuild is not another title award. Bounded cues need not imply an unbounded event archive. |

These are more than edge conditions: together they let a character learn, act on imperfect knowledge, carry material through time, and return to an understandable account of what happened. The common dependency is the actual subject and occurrence. A renderer can change style or catch up its view without changing those facts.

### Owner fold, completed

Each destination contains the concrete dependency, existing seam and a selected-slice done check. No new competing specification or rulebook was created.

| Owner | Folded references | Existing seam retained |
| --- | --- | --- |
| [Means and appraisal](../../MEANS_AND_APPRAISAL.md#recovered-corc-round-5-2026-10-21-observation-has-a-lifecycle) | CRL35/CRL36/CRL40 | AA9–AA12, actual examination/action owner and public observations |
| [Crafting engine](../../CRAFTING_ENGINE.md#recovered-corc-round-5-2026-10-21-stock-identity-estimates-and-commitment) | CRL36/CRL37/CRL38 | Material history, native spender, explicit stock policy and existing session batch-goal lifecycle |
| [Mockup system](../../MOCKUP_SYSTEM.md#recovered-corc-round-5-2026-10-21-comparison-without-changing-the-experiment) | CRL35/CRL38/CRL39 | Shared workbench/adapters, actual renderer, same public fixture and draft Apply semantics |
| [Runtime/performance plan](../../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#recovered-corc-round-5-2026-10-21-outcome-order-during-catch-up) | CRL30/CRL40/CRL41 | Simulation clock/stepper, existing derived title bonuses, settlement and bounded presentation |
| [Presentation palette](../../PRESENTATION_AND_FOURTH_WALL.md#recovered-corc-round-5-2026-10-21-truthful-change-after-reflow-and-return) | CRL38–CRL41 | Subject-bound cues, static alternatives, known summaries and existing receipt lifecycle |

**ACT NOW (done):** source detail inspected, inference boundaries recorded, and all five plan folds saved. This is completed planning work, not implemented gameplay. Existing parent-owned UI/authority files were left untouched. No standing priority, deferred system or source-world default was promoted to a new gate.

**ACCOUNT FOR NOW:** selected work should reuse these dependencies through its existing owners. In particular, source hover-learning is not silently copied, freshness is not rejuvenated by UI/custody changes, and better later knowledge is not backdated into an earlier automatic choice.

**LATER / DELEGATE:** extend existing CRJ8–CRJ10 instead of spawning three new initiatives. CRJ8 covers an observation followed by split/transfer/processing; CRJ9 covers same-fact chips and stale/reflowed selection; CRJ10 covers a midpoint capability/stock boundary and return/reload. Sol medium for coupled material/knowledge/time judgment, Luna low for settled visual wiring; small/medium per selected slice. Each owner states its observable done check. None was dispatched or implemented.

Validation is documentation/source evidence only: append-only preservation, local links/section anchors, unique CRL35–CRL41, exact source excerpts, source/input hashes and private ignore checks. No runtime suite or rebuilt browser claims are warranted by this fold. Earlier recovery/decode evidence remains separate from semantic review and from future gameplay acceptance.

## Round 6, 2026-10-21: title benefits and small opportunities

Weibao asked for deeper recovered-code/discussion mechanics, playful detail and specifically passive versus active title benefits, with useful additions folded into plans. This is another documentation-only proposal round under AD5/AD6–AD8/AD32/AD35–AD38, SLR, relevant MR/AR and UR59–UR64. No new rulebook, title mode, priority or gameplay slice is accepted by saving these ideas. Shared allowance started at 50%, with the inherited 52% ceiling; no agents, acquisition or source execution.

### What the source actually distinguishes

The recovered `23delta.html` uses `have`/`tget` for earned title/talent state and `you.title` for the selected display. `giveTitle` applies an ungranted talent, runs `onGet` and automatically selects the newly earned title. The title-list click changes the selected name and closes the chooser; it does not reverse the running talent. This supports a passive earned benefit separate from display selection in this historical snapshot. It is not proof of a general active-ability title system. [Artifact post](https://discord.com/channels/622495527485046805/811370601129705483/1214810498282029086); [earlier title-scale rationale](https://discord.com/channels/622495527485046805/811370601129705483/814931186756485140).

OOPS already has both all-held-title bonuses (`titles.js`) and an optional additional worn-title payoff (`absorb_p23/long_life/worn.js`), with native selection/durable save wiring in `main.js`. “Worn” is not synonymous with “press a button to activate an ability.” This source-level comparison does not re-certify current browser behavior.

| Code | New detail and useful consequence | Status / plan home |
| --- | --- | --- |
| CRL42 | **Title effects have several compatible mechanisms.** Earned passive, worn/attuned, activated action, conditional/reactive opportunity and social recognition can coexist. An acquired faculty can passively enable a deliberate examination. Learned competence, magical channel and institutional permission have different loss/cross-world conditions. | Proposal vocabulary folded into [Skills and talents](../../SKILLS_AND_TALENTS.md#recovered-corc-round-6-2026-10-21-title-benefits-by-mechanism). World mechanisms choose defaults, combinations and costs; no forced exclusive title slot. |
| CRL43 | **A passive gain can change an activity already running.** Walking/jogging talents alter `runerg`; their `onGet` adjusts the existing drain if running is active. Start/stop also read that modifier. Adapt by tracing actual ongoing costs and settlement, not just adding a tooltip bonus. | Account for now in title/learning plans. Test earn/change/stop/load through the actual activity owner. A worn-title switch cannot silently reprice already-settled work. |
| CRL44 | **An empty grant body can hide a real downstream benefit.** Quartermaster's `talent` body is empty, yet training-area drop predicates read its applied marker. Its benefit is a conditional new opportunity, rather than a stat bump or a new button. The historical predicate is source evidence, not a working OOPS reward route. | Title palette and presentation plan. A player's fitting title can change what they notice/recover in familiar work, with a real consumer and known explanation; no guaranteed bonus loot or source implementation marker adopted as game law. |
| CRL45 | **Materials can suggest an experiment before being consumed.** Both quill and ink acquisition handlers check the other object's `have` flag and grant the same recipe. Either-arrival handling is present; full flag/load semantics were not audited. | [Crafting plan](../../CRAFTING_ENGINE.md#recovered-corc-round-6-2026-10-21-materials-can-suggest-a-next-experiment). Distinguish remembered encounters, present ownership and consumable stock; keep learned knowledge after stock loss where the learning mechanism supports it. An inference is not a successful craft. |
| CRL46 | **Practice has several consequences, and mastery need not erase all of them.** Running gives skill practice, changes resource demand and wears footwear; the earned cost talent does not remove the other source consequences. | [Learning plan](../../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md#recovered-corc-round-6-2026-10-21-practice-changes-more-than-a-multiplier). A fitting OOPS practice route can become cheaper or more observant while its real body/tool/environment readers remain. No universal hunger/wear obligation is imported. |
| CRL47 | **A celebration need not take over the player's identity.** The source auto-selects an earned title, while its chooser marks titles with talents. This can be fun once but is not authority for overwriting OOPS's chosen worn/display identity. | [Presentation plan](../../PRESENTATION_AND_FOURTH_WALL.md#recovered-corc-round-6-2026-10-21-titles-that-say-what-they-do). Preserve choice by default; show the new passive/opportunity clearly. A deliberate investiture/transformation can change identity through its world mechanism. Recognition follows actual witnesses/means, not the title panel. |

### Fold and acceptance boundaries

**ACT NOW (done):** traced grant/selection/ongoing-running/drop/paired-acquisition consumers and folded six additions into four existing owners. The title plan explicitly qualifies its earlier social-title wording for system/metaphysical titles. The source's descriptive star, empty hook and selected name were not mistaken for complete benefit semantics.

**ACCOUNT FOR NOW:** retain OOPS's held-plus-optional-worn implementation; resolve activated uses through existing action owners, institutional effects through actual recognition, and learning through meaningful encounters/actions. Existing recipe links are a read-only known dependency index, not a recipe-grant or RNG owner. A small playful note is feedback on a real new opportunity, not another reward producer.

**LATER / DELEGATE:** one selected title/activity can demonstrate an earned passive plus a fitting optional use; an existing discovery journey can add order-independent material insight. Owners retain suggested executor, small/medium effort and real action/stop/reload checks. Nothing was dispatched. Desktop UI examples remain 1920×1080 at actual 14/21px text, with mobile optimization deferred.

Private [round-6 evidence](private/discord-media-2026-10-20/recovery-26-2026-10-21/deeper-review/round6/) preserves nine exact source ranges, affected-document baselines, OOPS input hashes and fold validation. Large game source remains a focused static read, not a full reread or execution. Prior discussion attribution remains in rounds 4–5; no new conversation chronology, release claim or human acceptance is invented.


## Round 7, 2026-10-21: title versus skill correction

Weibao questioned whether round 6's title benefits are simply skills and requested distinctions in rules. The earlier answer blurred capability type with source and activation. The existing title owner C2 already separated these. [C14](../../emergent/TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md#c14-titles-versus-the-capabilities-they-name-or-grant) now supplies the concrete counterfactuals, with [SLR40–SLR43](../../DOMAIN_RULES.md#titles-skills-and-effect-causes-2026-10-21) recording applications of existing AD30/AD38 and single-effect ownership.

**CRL48:** default to actual competence/method/faculty/trait versus designation/recognition/grant, with active/passive/worn/reactive as an independent mode. A source title flag is implementation evidence, not proof that OOPS needs a separate power model. Some round-6 examples can be normal learned skills with an epithet, while other worlds genuinely grant title power. One real effect has one owner; independent real rewards can stack when their causes support it. Current title bonuses remain unchanged.

ACT NOW (done): clarified the rules/index, question/direction receipt, project summary, title owner and earlier skills palette. ACCOUNT FOR NOW: distinguish labels and causal layers only when a consumer/loss/continuity case needs them; use the existing owners. LATER: a selected title/action demonstrates gain/use/loss and reload without duplication or unjustified competence removal. No new title system, schema or gameplay was selected. Rule checks and existing title/behavior regressions are recorded in the task checkpoint and private round-7 evidence.

## Round 8, 2026-10-21: useful mechanics beyond titles

Weibao requests: “More to consider from the recovered code beyond titles? Go deeper into useful mechanics and playful details, fold them into the existing plans, and send the additions to the implementation chat.” He further directs: “Continue with the next fitting implementation slice from the coverage table, implement all the stuff we found and added to the oop palette” and “implement all the useful stuff from the 26 missing”. This is implementation authority for useful native adaptations, not just another saved proposal. Existing priorities, sealed secrets, one playable slice at a time and mechanism-based world differences remain. Personal media, unrelated prototype code and source constants do not become mandatory gameplay.

The existing implementation chat `01a15ecb-cc15-7c82-9d76-e16699851618` retains runtime and its COVERAGE/CHECKPOINT/REPORT ownership. This coordinating pass owns only new source/plan appendices and sends an addendum. Its shared implementation ceiling remains 56%, including this work; the observed meter was 52% at this follow-up's start. No new agent, chat, source fetch or source execution.

### Four additional mechanics and useful checks

| Code | Recovered static evidence | Existing OOPS seam and useful addition |
| --- | --- | --- |
| CRL49 | Completed-book furnishing, source lines 1575–1585: local activation/deactivation changes reading-learning support; removing returns a physical book. This is not evidence of every book being new knowledge forever. | [Learning owner](../../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md#recovered-corc-round-8-2026-10-21-books-after-learning-and-changing-reading-pace). Inspect real completed-book, furnishing and rereading routes. A finished book can become a useful local reference without relearning its facts. Removal affects local support, not learned memory. A settled spine accent/quiet note can make the home feel inhabited. |
| CRL50 | Reading, source lines 12682–12698: stop retains per-book progress, current skill affects the estimate, and animated dots use a different timer from actual work. | Same learning owner and existing native book/rate projection. Make actual retained work and changing ETA legible; keep pause, blocked and working states distinct. Avoid duplicate progress or completion XP, and avoid describing activity dots as a measurement. |
| CRL51 | Vendors, lines 8912–8922/8959–8965 and a shop listener at 12350–12355: timed restock changes stock and signals it while a shop view is open. | [Market owner N2](../../gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md#recovered-corc-round-8-2026-10-21-restocking-while-someone-is-shopping). OOPS already has native stock refresh and stale-quote acceptance checks (`trade.js`). Exercise them and add only missing truthful feedback/context. The source ejects a shopper; useful OOPS continuity need not copy that annoyance. |
| CRL52 | Investigation, lines 9016–9037: initial applicability, a vague cue and an ongoing darkness/sight check are distinct. Exact hidden outcomes are not disclosed here. | [Granular interaction owner](../../GRANULAR_SYSTEMS_AND_INTERACTIONS.md#recovered-corc-round-8-2026-10-21-investigation-responds-to-changing-means). A selected actual investigation can change method or stop when its sensing means changes. Retain observer-safe clues, a useful next method and actual subject/progress state; no global secret detector. |

The source is the recovered [historical game attachment](https://discord.com/channels/622495527485046805/811370601129705483/1214810498282029086). These are focused static code findings; release status and exact play behavior remain unverified. Nearby saved discussions from earlier rounds remain their own evidence. No additional live discussion was fetched or invented for these code paths.

OOPS source inspection this round was narrow: `absorb_p23/reading/runtime.js` already separates elapsed time/rate/progress and completion effects, and `trade.js` already recalculates/rejects a stale quote. Their presence is a reason to reuse and verify, not a claim the entire new journey is implemented. Changes to ETA/knowledge/stock must read their existing authority rather than create another calculator.

### Fold and implementation handoff

ACT NOW (done): added CRL49–CRL52 with source excerpts, concrete owner folds, selected native journeys and acceptance checks. ACCOUNT FOR NOW: book knowledge versus physical copies and study support; completed work versus estimate; quote versus current terms; investigation eligibility versus clue versus revelation. LATER / IMPLEMENT THROUGH EXISTING CHAT: the user now authorizes fitting implementation of these and earlier useful rows. Reasonable reversible slice defaults need not await another selection question. Mobile, a macroeconomy or an all-world conversion do not become prerequisites.

Implementer should reconcile the exact 26-file ledger and all CRL27–CRL52 rows, linking earlier CRL1–26 where they already own the same detail, so overlap is reused rather than counted as another feature. Mark actual implementations, existing verified paths and exact remaining dependencies separately. “Needs a selected mechanism” by itself is no longer a stopping reason when a reasonable native choice fits this authorization. Choose the default and build; preserve any explicit live deferral or irreversible compatibility decision. The source file's presence, decorative labels or a simulated fixture are not substitutes for the real mechanic the useful row calls for.

No runtime work was done by this coordinating pass. Private [round-8 evidence](private/discord-media-2026-10-20/recovery-26-2026-10-21/deeper-review/round8/) records six exact source ranges, input identity, append preservation and local link/anchor checks. The implementation chat owns build/test/browser/persistence verification and its finite 56% cumulative ceiling; do not silently reset it to finish the entire palette.
