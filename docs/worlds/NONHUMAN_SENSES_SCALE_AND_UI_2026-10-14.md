# Nonhuman senses, scale and UI, 2026-10-14

> Code namespace 2026-10-19 (no codes renamed): SU1-SU15 are local to this file; SU3 is also defined in skyrim/SOURCE_LEDGER, world-depth 06, 21 and 24. Outside this file cite `NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14#SU3`. See [reserved prefixes](../RULES_INDEX.md#reserved-prefixes-2026-10-19).

Status: source-read audit and **INFERRED original proposals**, not accepted
mechanics, implemented UI or browser proof. This is the SENSES, SCALE AND UI
lane of [the dispatch](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md).
Its [checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/senses/CHECKPOINT.md)
owns completion and remaining evidence. No sealed files or raw novels were read.

Evidence labels apply throughout: **SHOWN** means inspected source, not executed
gameplay; **STATED (Weibao)** means direction recorded in a live owner;
**STATED (owner)** preserves that owner's proposal status; **INFERRED** means a
design recommendation or hypothetical example; **UNKNOWN** names missing proof.
No franchise or biological fact is asserted from outside memory.

**STATED (Weibao):** [desktop/laptop first](../USER_VISION.md#standing-ui-priority-2026-10-13),
use the available screen, mobile optimization deferred; meals help and hunger
never kills. [PROJECT.md](../../PROJECT.md#standing-priorities-and-document-authority)
surfaces this direction. Concrete target: **1366x768 and 1920x1080 CSS viewports**.
Proposed visible outcome: body, legitimate perception, useful local actions,
current work and relevant member/partner context remain readable together.
Mobile redesign, implementation, new world admission, combat balance, offline
policy and detailed anatomy simulation are outside this lane.

**STATED (owners):** [requirements E1-E15, M1-M11, N1-N15](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md)
owns the nonhuman seams; [ENGINE_SPEC](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md)
owns proposed body/functions/slots/presence/size queries and persistence;
[PLAY](NONHUMAN_STARTS_PLAY_2026-10-14.md) owns body-kind loops and first-minute
scenarios. [BY_WORLD](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) and
[PROTAGONIST_MECHANICS](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) appeared
during drafting; their relevant authority, perception, naming, partner and
cross-world sections were consulted. Their source claims keep their own edition,
secondary-evidence and unknown qualifiers. This document supplies presentation
inputs and gates, not a second body schema, canon catalog or progression menu.

**STATED (owners):** [shared foundations](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md)
U01 separates person, life, body and controller; U12 declares actual carriers;
V06 requires correct equipment/action changes without duplication. [Origins](ORIGINS_AND_WORLD_TIMELINES.md#tree-and-other-bodies-change-available-actions)
supplies rooted reach and separate memory/anatomy. [Brood G9-G10](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g9-brood-play-autonomy-and-feedback-across-scales)
keeps sensory channels, commands, member autonomy and memory distinct.
[The UI owner](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#standing-ui-scope-and-acceptance-gates-2026-10-13)
owns readable panels and rebuilt desktop gates. [Presentation](../PRESENTATION_AND_FOURTH_WALL.md#vp-the-viewpoint-filters-the-vfx)
keeps all render modes within the viewer's knowledge; its means-on-hand direction
requires an actual observation channel rather than world-wide appraisal rights.

## 1. Perception as a filter

### What the existing rendering establishes

| Code | SHOWN source seam, read 2026-10-14 | Implication, INFERRED |
|---|---|---|
| SF1 | `src/display.js:2168-2169` writes current location name and `getDescription()`; combat also writes description and tooltip at `:2808-2818`. | Filter every place rendering path, including tooltip, through the focused observer. The calls themselves do not pass a body/viewer argument. |
| SF2 | `src/display.js:2383-2409` checks NPC/dialogue availability and builds a starting-text control. | Keep eligibility, perception of a presence and ability to communicate separate; a detected footfall need not become a named dialogue button. |
| SF3 | `src/display.js:505-519` binds a knowledge reader and projects item name/description through `nativeItemView`; `:555-570` separately prints component template names. | Extend the existing item projection and audit downstream fields. Filtering just the title does not guard every tooltip fact. |
| SF4 | `src/main.js:2244-2249` selects normal/combat display on location change; `:2482-2507` selects an action and checks `canBeStarted`/conditions. | Body-aware display and execution need the same qualified inputs. A disabled-looking button alone does not enforce a body rule. |
| SF5 | `src/display.js:2176-2195` offers local/fast travel; `:2539-2561` uses connection availability and route time; `:2677-2685` includes favorites, beds and last combat. | Ordinary, favorite, quick-return and combat exit routes all need reach/scale/carrier qualification. A remembered destination is not a usable route. |
| SF6 | `src/workspace_views.js:21-37` supplies an expandable place description; `:50-61` decorates native controls for keyboard use. | Keep one perception prose surface with keyboard-accessible inspection. Do not add a separate senses window for the same text. |

**INFERRED default:** produce an observer-qualified view before writing strings
or DOM. Resolve the current person, focused body or bodyless presence, actual
senses/source, local contact/reach, used appraisal means and retained evidence.
Render location, people, items, actions, combat, log, comparison, search and
accessible descriptions from that view. A render reads state; it does not sample
new facts, identify an item, spread knowledge or perform a scan.

**Dial:** automatic passive impressions, paid deliberate scanning, expert
interpretation or an explicit status-reading power. **Reasonably per world:** a
faculty supplies the information its local rule supports. Mana sense need not
identify names, moral character or inventory; many eyes need not see through walls.

Distinguish **unobserved**, **observed but unidentified**, **reported**,
**remembered**, **estimated** and **measured**. Display those distinctions only
where an actual entry exists. No silhouette, count, hidden tab, scent color or
locked name should enumerate an undiscovered person or secret. If there is no
permitted description, say what the actor experiences: `You have not sensed a
way beyond this wall`, rather than `Unknown secret room: 1`.

### Sense palette and minimal presentation inputs

All rows below are **INFERRED**, illustrative rather than species templates.
The state column describes view inputs referenced from engine/knowledge owners,
not new durable sensor arrays. A world can combine rows or supply another means.

| Channel | Location / people / item wording | UI shape | Minimum inputs and what remains UNKNOWN |
|---|---|---|---|
| Smell | `A fresh flour trace leads under the door`; `a familiar soap scent`; `a sharp oil smell on this fitting`. | Short trace rows: bearing, relative freshness, observed signature; Inspect or Follow when legal. | Channel active, endpoint, observed trace, time, direction confidence, learned association. Wind/masking affect supported evidence; smell does not supply an unseen person's name, color or intent. |
| Echolocation | `A low opening returns a close echo`; `a moving shape pauses`; `a small hard object answers near your left side`. | Sparse obstacle/route list or captioned local sketch; deliberate Ping with quoted cost if modeled. | Echo faculty, used/passive mode, qualified geometry, observation time and occlusion. No pigment, written lettering or material chemistry from an echo unless another means supplies it. |
| Mana sense | `A weak pulse behind the wall`; `one presence with a familiar rhythm`; `this shard carries an unstable current`. | Text strength/texture tags, optional still contour motif. | Source/rank, range, suppression/concealment, measured or qualitative result, learned signature. A pulse is not automatically a person, spell name, level or hidden origin. |
| Touch / vibration | `Weight crosses your north root`; `two knocks answer`; `a nick interrupts the blade's edge`. | Contact list or body-region rows, with links to reachable actions. | Contact endpoint, actual structural connection, location within it, observation time, interpretation. Contact alone does not reveal a visitor's face or a distant object. |
| No sight | `A voice calls from the doorway`; `cool air moves through a gap`; `you cannot read the painted sign by this means`. | The normal readable interface using supported impressions and known labels. | Surviving channels, known language/literacy and any alternative reading means. An inactive sight channel removes visual facts, not controls, contrast or screen-reader access. |
| Many eyes | `Movement at your rear`; `the marked doorway remains in view`. | One merged location account with optional sector/source labels, not one panel per eye. | Which eyes function, coverage/occlusion, attention policy and association of observations. Overlapping views do not duplicate people/items or grant simultaneous motor control. |
| Brood shared view | `Scout A: warm draft at the gap, just reported`; `Nest-tender: footsteps, last heard earlier`. | Selected member plus received-summary rows; switch observation seat separately from command seat. | Member/body refs, link mode/reach, sender, receipt time, local versus communicated evidence, command authority. A disconnected scout's live truth is not shared; emotional contact need not transmit images or memories. |

**INFERRED:** a retained known name can remain in Notebook/history after sight
is lost. Live text qualifies it: `Last met here earlier; not currently detected`.
Losing a channel invalidates live appraisal and interaction claims, not the
person's demonstrated memory. Reconnecting shares only the channel's declared
evidence; selecting a member thumbnail is not a memory transfer command.

**INFERRED:** prefer a short merged description with the decisive cue first.
Optional `How you know` disclosure contains channel/source, when observed and
uncertainty, without granting new knowledge. Sensory motifs stay quiet and
optional: no permanent sonar animation, compulsory sound, blurred text or scent
color puzzle. Effects-off, captions and assistive output use the same qualified
facts. A heightened sense is also an advantage when supported, not a mandatory
trade of visibility for extra upkeep.

**STATED (BY_WORLD, proposals):** NX5 distinguishes harmful observation from
mere description; NX9 distinguishes portable bodies from destination support;
NX10 asks for useful choices while another actor is unavailable. **INFERRED:**
when a selected world has a real observation hazard, its observation/exposure
event settles that effect once. Repainting, opening an accessible caption or
reloading the same evidence is not a fresh exposure action. Offer the protected
channel if one is actually known. Destination quotes show known habitat/support
and suppression, not only aperture fit. Partner absence leaves valid local work
or a declared wait/recovery choice, without inventing escape or control powers.

**STATED (PROTAGONIST_MECHANICS, proposals):** NM4/NM6/NM9/NM11 separate naming,
wielder partnership, advice and shared channels. **INFERRED:** these map to the
existing Body/Partner/Members/action projections above. That lane's slime
candidate and the engine lane's beast candidate remain alternatives; this UI
lane selects neither as accepted priority and imports no protagonist's powers.

## 2. Scale

**INFERRED default:** treat scale as usable geometry and interaction, not a
global damage multiplier or CSS zoom. Read engine-owned size/dimensions/mass,
route constraints and means. **Dial:** world-defined size bands, exact useful
measurements, deformable bodies, flight, phasing, resizing or a carrier.
**Reasonably per world:** a tiny spirit and a tiny material rat need not obey the
same aperture rule; a giant can have a spacious home rather than permanent
inconvenience. Measurements remain estimates without a measuring means.

| Illustrative scale case, INFERRED | Place / NPC / object text | Action and route consequence |
|---|---|---|
| Tiny material body | `The workbench is overhead; a skirting gap leads beneath it`. A person may first be boots, voice and vibration. A dropped fitting may be a movable load rather than negligible loot. | Known narrow paths, climbing/perching and handoff points; check aperture, height, material and actual method. A human's door handle can be unreachable while a wall gap is useful. |
| Huge material body | `The doorway pinches your shoulders; the courtyard is open`. A shopkeeper can be heard before their face is easy to inspect. A tool may fit poorly despite its familiar name. | Wide routes, outdoor trade, long reach or supported resizing. A bridge can have a real load limit; a broad river may be easy to cross. No universal giant rejection by every shop. |
| Distributed body / living place | `Footsteps at the west room; the core remains beneath the hall`. Furniture may be part of your reachable structure, a tenant's property or unattached stock. | Footprint, sensor coverage and effect reach are separate. Land/body footprint is not inventory and remote awareness is not physical access. |
| Carried weapon or familiar | `On Mara's belt; sheath muffles nearby voices`. The partner's hand pressure is directly felt; their private map is not automatically known. | Carrier determines actual transit and contact. Offer a route/request/consent control with pending/accepted/refused state, not a renamed Walk button. |

**INFERRED:** a known route row can say `Gap under door · fits your present body`
or `Doorway · too narrow in this form; courtyard route known`. Unknown dimensions
offer an inspection/approach action rather than fabricated certainty. Movement
checks the actual selected route, actor/body revision, method, carrier and cargo
at execution. A preview can become stale after growth, a load pickup, weather,
door closure or partner departure. Quotes explain only known reasons.

**INFERRED:** carrying has several dimensions: grasp/attachment, load and volume,
balance, body fit, accessible storage and custody. Inventory can show `Held in
harness`, `Stored at nest`, `With Mara`, or `Too bulky for this route` when known.
Tiny coins can still have ordinary economic value. A giant bag does not duplicate
its contents, and shrinking a body does not silently shrink all cargo. An actual
transition determines dropped, stored, carried or transformed items under U12/V06.

**INFERRED:** display scale-relative descriptions alongside stable known identity:
`Copper fitting · chest-high to you`, not a renamed new item species. NPC labels
use the observer's evidence, not a universal `giant human` tag. Social recognition
can come through voice, scent, introduced name or witnessed action; change in
apparent scale is not an automatic relationship reset.

## 3. Panels and desktop layout

### Adapt the existing surfaces

**SHOWN:** `src/display.js:219-229` binds fixed humanoid/tool slots;
`:2092-2110` iterates them and attaches item tooltips. `index.html:629-665`
defines equipment/tools and character view controls; `:233-246` defines location;
`:273-275` starts local actions; `:671-695` defines the filterable log.
`src/workspace_views.js:7-20` registers current-work/combat/stance views;
`:26-32` coordinates trade/craft/storage context with belongings.
These are source seams, not proof that body/colony/partner adaptations exist.

| Proposed surface, INFERRED | Existing home to adapt | Content and minimal referenced view state |
|---|---|---|
| Body, replacing the equipment view for relevant forms | Character/preparation surface, equipment/tools renderer; retain human gear view when appropriate. | Current body name/form, known working parts/functions, applicable fittings/slots, reserves/rest/repair where understood, and changes that block work. Read focused body id/revision, known functions/slots/conditions and equipped custody refs. No empty Head/Feet grid for a sword. Body detail and gear are subviews of one surface. |
| Reach map for immobile bodies | Location view, with routes/actions in Local actions. | Captioned footprint/contacts, known effect targets and visitors; optional small static sketch plus equivalent target list. Read endpoint/anchor, qualified channel reach, observations and action quotes. Differentiate sensed, reachable and controllable. Not a global discovered-room count. |
| Brood member list | Contextual workspace module using the existing panel system; selected member reuses Body/Belongings/Local actions. | Known member label, last known place/condition, link, assignment and observation/command seat. Read stable member refs and received summaries, focus, authorized control and job state. Disconnected rows say Last report; membership is not all-member live knowledge. |
| Host / wielder / carrier | One contextual relationship module or subview, not a second inventory or character engine. | Who holds/hosts you, actual channel, who directs which action, agreed task, pending request, known boundary and return/release route. Read host/carrier refs, known relationship and control/custody terms. A bodyless advisor can show presence/connection instead of a fake Body/HP panel. |
| Instinct and bond | Compact labeled rows near Body/partner, with decision detail beside the action. | `Hunt: tempting scent · optional tracking benefit`; `Mara: willing to carry you to the gate until dusk`, if known. Read urge/premise and known relationship terms. Numerical bond only when a means/premise supplies it; no mind-reading from an affection bar. |
| Current work, belongings and log | Existing work, inventory and message surfaces. | Actual executor/body, running/paused/waiting state, useful progress, inputs and custody, qualified result/source. No parallel brood queue, XP pool, sensory history or rewards created by presentation. |

**INFERRED default:** show the panels relevant to the selected life, retain their
stable identities and remembered player arrangement. A beast need not receive
Brood, Reach and Host panels. A sword needs Body and Wielder; a tree needs Body
and Reach; a colony needs Members and selected-member Body. **Dial:** pin a
partner or second received observation beside the current decision.
**Reasonably per world:** discovery/control rules determine availability; no
empty panel should hint at a sealed source or eventual transformation.

### Two proposed compositions, not measured fits

The sizes below are **INFERRED starting budgets**, at comfortable roughly 16px
body text. They do not replace player resizing or guarantee every populated state
fits. **UNKNOWN:** actual browser fit, scrollbar/menu behavior and long-label cost.

| Viewport | Body/preparation column | Decision column | Context column | Vertical plan |
|---|---|---|---|---|
| 1366x768 | About 300px: identity/vitals, short Body, relevant holdings or partner detail. | About 650px: time, location/Reach summary, current work, Local actions and selected quote. | About 360px: Members or Partner when applicable, short records/skills and log. | About 32px outer horizontal space and two 12px gaps leaves 1310px for columns. Reserve about 64px for shell/navigation, leaving about 680px after modest bottom spacing. Place roughly 120px location, 80px work and 360px routine decision area in center; use remaining space for headers/gaps. Context lists own their scrolling. |
| 1920x1080 | About 380px: identity/vitals, Body and useful holdings visible together. | About 950px: broader Reach/location, work, quote/actions, combat or craft detail. | About 534px: longer Members/Partner, useful records and log. | About 32px outer space plus two 12px gaps leaves 1864px for columns. Around 980px can remain below shell/navigation. Expand independent useful context and prose, preserving readable line length; do not just enlarge icons or leave the right half empty. |

An illustrative laptop arrangement for a rooted start:

```text
Body / useful fittings     Place + reach targets           Partner / received news
Known condition            Current work + saving           Records / useful skills
Held or stored stock       Local actions + selected quote  Recent qualified results
```

**INFERRED:** for a brood, replace Partner with Members and let selected-member
details occupy Body; for a sword, keep Wielder beside its cooperative actions.
At larger width, pin a second received member summary when that comparison helps.
Do not turn all information into one stacked mega-panel or shrink text to enforce
one-screen play. When several contexts matter, preserve independent useful
panels; switch optional detail within its existing home.

**INFERRED:** each long list has a clear scroll owner and stable selection.
Keep the selected action's quote, blocker, commit/cancel and current-work state
together. More place prose opens locally; mandatory decisions may use an expanded
reading view with a clear return. Busy combat can use center space while Retreat
and body/partner limits remain reachable. Test craft/trade as well as quiet start
screens because those views already change available layout space.

**INFERRED:** a body swap rebinds Body, vitals, holdings, perception and action
quotes to the new body in one coherent refresh. Keep unrelated panel positions,
scroll and text selection where possible. If a selected action becomes invalid,
show its known pause reason and alternate route. Display focus does not migrate
items, heal bodies or grant control; execution checks the explicit acting seat.

## 4. Text and voice

### Names, pronouns and greetings

**SHOWN:** `src/main.js:2122-2127` reads the biography for `gendered playful`;
at `:2125` it compares age with `middle-aged`, while `index.html:110` supplies
`data-age="middle aged"`. Its ternary routes every non-male value to female
greeting words; `index.html:92-94` includes an ambiguous choice. This is source
evidence of the mismatch and branching behavior, not a tested UI correction.

**INFERRED default:** separate person name/pronouns, body label/life stage,
collective/member name, title and observer-known address. Keep second-person
`you` for the selected player seat; use explicit speaker/member labels in mixed
views. Gender, bodily sex and shape do not automatically choose pronouns. A
nonbinary, unknown or unnamed person has a supported neutral/name-based fallback,
with grammar agreement handled in localization rather than scattered substitutions.
**Dial:** individual `it`, collective `we`, a chosen plural or local address.
**Reasonably per world:** a society can call a sentient blade `the sword` before
recognizing them; that is the NPC's evidence/premise, not the narrator's forced
identity. Optional coercive premises disclose their different control terms.

**INFERRED:** normalize the old age label in the owning biography/migration path
or support its documented alias at the translation seam; avoid a global search
and replace of personal or localized prose. A form-appropriate life-stage label
and introduced title can supply a greeting without inventing human age/gender.
Names with power effects are actions owned by world/mechanics lanes; choosing a
display nickname is not silently such an action. A nameless start can render
`you`, a known descriptor or player label without granting a canonical name.

### Existing name tokens and nonverbal narration

**SHOWN:** `src/display.js` (`log_message`) replaces `%HeroName%` with `character.name` in
log messages; `src/main.js:2126-2127` resolves `{%dynamic(HeroName)%}` separately.
Neither shown branch selects an event actor/member name from a supplied viewpoint.

**INFERRED:** retain legacy `%HeroName%` compatibility for single-player native
messages, but pin its intended referent at event creation/settlement. A historical
line should not become a different actor because the player later swaps seats or
renames a member. New multi-actor content should use explicit qualified subject,
speaker and observer fields through the existing localization/rendering owner;
do not create a second text-token engine here. Audit both token routes. Escape
names, pronouns and titles as text at every HTML boundary; an object's chosen name
does not authorize markup. Test long names, apostrophes and literal angle brackets.

| Nonverbal example, INFERRED | What it establishes |
|---|---|
| `You tap the hilt twice. Mara nods.` | Actual signal and observed response, not automatic successful conversation. |
| `You send Mara the echo you just heard.` | Requires a sensory-message link; does not send a complete room map. |
| `You suggest the courtyard route. Mara prefers the road.` | Advice and host disagreement, not player-directed walking. |
| `Scout A reports a warm draft. You do not yet know where it leads.` | Source attribution without omniscient narration. |
| `You remember how writing works; these roots cannot hold this chalk.` | Retained knowledge and missing execution means coexist. |

**INFERRED:** ordinary inner narration can express choice without asserting
vocal speech. Distinguish think, attempt, signal, received reply and understood
message. The dialogue home can say Communicate with someone and expose the
channel actually available; it need not vanish because the player lacks a mouth.
An NPC can misunderstand, ask for repetition or learn a signal through events.
Prior human memory supplies known concepts, not verified local signs; a native
monster or emerging mind can use concrete cues without being written as stupid.

### Accessibility is a player control

**INFERRED:** preserve contrast, readable type, keyboard focus and complete
labels regardless of the fictional body's sight/hearing. Provide textual
direction/relative distance for sketches; caption all meaningful audio; pair
color/glyph with words; keep deliberate scans operable by keyboard. Touch and
smell cues are text, never required haptics or sound. Decorative sonar sectors or
many-eye ornaments are hidden from assistive readers and have a plain equivalent.
Effects-off/reduced-motion and screen-reader output must reveal the same facts.

**INFERRED:** expose updated selected work/decisions with restrained live
announcements, not every tick of every brood member. Focus and selected controls
stay stable on refresh; a link outage announces one change and leaves useful
local actions visible. Accessible labels, hidden DOM, search, copyable text,
tooltips and comparison views must not contain unperceived secret names.
Laptop text enlargement remains an affected desktop gate; mobile optimization
does not become required because zoom narrows the effective viewport.

## 5. Teaching a strange body in the first minutes

**INFERRED default:** show one distinct faculty, one useful choice and one
repeatable idle activity through ordinary play. The sequence below is a
hypothetical presentation overlay for PLAY's scenarios, not a second tutorial
questline. Times mean approximate player attention, not scheduler minutes.
**Dial:** native familiarity, remembered human methods or slowly acquired
concepts. **Reasonably per world:** teach only functions admitted by the selected
start; an experienced brood founder need not rediscover basic communication.

| First-minute beat | What the player sees and does | Information/pacing boundary |
|---|---|---|
| Orient | A two-line body-aware impression; Body shows the current sense/method; two or three useful actions are already available. | No manual or full anatomy disclosure. Avoid hiding ordinary valid actions to manufacture a lesson. |
| Try a distinctive faculty | Follow a familiar scent, inspect a contact, sense a known pulse or ask a wielder for a small movement. | Quote real time/cost and who acts; no free appraisal from merely opening a panel. |
| Discover a useful limit | A known grip/route constraint explains one unavailable action beside a real alternative. | No compulsory failure, hunger death or universal nonhuman penalty. Keep the first success available. |
| Receive an observable response | A contact acknowledges a repeatable signal, a route opens through actual movement or a member transmits a limited report. | Show the source and result; do not claim social recognition or shared knowledge beyond the event. |
| Choose continuing work | Queue scent practice, supported root work, known safe retrieval or agreed partner practice; Current work names actor, result and interruption rule. | No offline grants introduced here. PLAY and scheduler policy own eligibility and settlement. A useful next choice remains visible. |

**INFERRED:** use the same panels and controls the player will use later. A brief
inline cue can disappear after the action succeeds or be dismissed; full help
stays available without blocking play. Restoring a save shows current functions
and any waiting response, without replaying a first-discovery reward. A body
change offers `What changed` with only known differences and an optional safe
test, not the whole creation tutorial again.

**INFERRED success criterion:** the player can identify the acting body/seat,
use one distinctive means, understand one known constraint, make a choice and
leave useful work running while seeing its state. Only a rebuilt browser journey
can establish those behaviors; fiction/pacing and layout feel still need Weibao's
acceptance. Staying nonhuman remains a complete route; no tutorial ends by
presenting becoming human as the default victory.

## 6. Considerations and bounded suggestions

The SU table is **INFERRED**, not an implementation backlog or fixed taxonomy.

| Code | Consideration | Default + dial + reasonably per world |
|---|---|---|
| SU1 | One truthful perception view | Default shared qualified view for prose/labels/assistive output. Dial stronger actual means. World rules determine what each channel reveals. |
| SU2 | Current sensation versus memory | Default annotate a stale known entry. Dial explicit memory loss/remote archive. Body loss alone does not erase all person knowledge. |
| SU3 | Channel outage | Default stop live claims and retain valid local controls. Dial autonomous assignments or limited continuing link. Respect actual connection policy. |
| SU4 | Size with useful access | Default tiny/huge routes offer distinctive possibilities. Dial exact dimensions, phasing or resizing. No universal fragility or social penalty. |
| SU5 | Reach is channel-specific | Default separate sensing, contact, message and effect reach. Dial sourced remote action. Territory ownership alone grants none of these. |
| SU6 | Body outputs and repairs | Default put known sap/scale/venom production and recovery in Body/action details with actual custody. Dial replaceable organs or purely cosmetic parts. Engine/PLAY own costs, not an icon harvest button. |
| SU7 | Ownership is not control | Default distinguish owner, holder, partner and controller in the object/host view. Dial authored coercion, theft or independent agency. Holder change is not necessarily game over. |
| SU8 | Mixed parties and command seats | Default visibly label current observation and acting seat. Dial pinned co-protagonist context. Switching does not transfer skills, cargo, knowledge or authority. |
| SU9 | Instinct and bond | Default optional pull/known cooperation terms. Dial quantified status or disclosed compulsory premise. Never infer consent or hidden motives from a generic bar. |
| SU10 | Knowledge modes | Default local evidence plus actually retained methods. Dial former-human memory, native mind or developing cognition. Use readable language without granting literacy or appraisal. |
| SU11 | Habitat and weather | Default surface meaningful known water/light/cold/mana changes beside affected actions. Dial measured diagnostics. No invented ambient upkeep or hunger deaths. |
| SU12 | Defeat and return | Default body-specific known recovery wording and real route. Dial repair, anchor, surviving member or replacement. Do not expose a sealed survival truth or promise a universal bed respawn. |
| SU13 | Naming and recognition | Default introduced/known names and neutral fallback. Dial powerful naming/title rules. World/mechanics owner resolves costs and who knows it. |
| SU14 | Threats and ordinary animal lives | Default sensed warning, received bounty report or household opportunity. Dial exceptional detection/recognition. No threat dossier, global hunter map or compulsory awakening for a village pet. |
| SU15 | View-state versus game-state persistence | Default save actual knowledge/control/custody under engine owners, layout preferences under existing presentation owners. Dial pinned views. Restore reprojects facts and never replays discovery or duplicates stock. |
| SU16 | Populated desktop use | Default independent useful panels and readable decision controls. Dial pinning, density and detail. Busy lists, long labels and zoom are gates, not excuses to optimize mobile first. |
| SU17 | Stay strange | Default viable continuing nonhuman work and identity. Dial later forms including human. Do not describe a permanent monster route as an unfinished tutorial. |

### Round 2 coverage and lane boundaries

All mappings are **INFERRED presentation coverage**, not gameplay fulfillment.

| Requirement | Where this lane treats it | Substantive behavior owner |
|---|---|---|
| N1 senses | Section 1, SU1-SU3 | Engine functions + knowledge/world means |
| N2 scale | Section 2, SU4-SU5 | Engine size/reach/routes |
| N3 body parts as inventory | Body/action view, SU6 | Engine custody + PLAY production |
| N4 being an item | Host/carrier view, SU7 | Custody/control and PLAY |
| N5 bond | Partner row, SU9 | Relationship/PLAY contract |
| N6 mixed party | Member/partner/seat labels, SU8 | Controller and party owners |
| N7 learning human things | Section 4, SU10 | Skills/means and PLAY |
| N8 instinct | Body/action cue, SU9 | Selected origin/world premise |
| N9 habitat/weather | Local/action context, SU11 | Body/world environmental rules |
| N10 death/return | Body/recovery wording, SU12 | Engine defeat + continuity |
| N11 memory modes | Sections 1, 4, 5; SU2/SU10 | Origin knowledge and retention |
| N12 name/title | Section 4, SU13 | World/mechanics naming |
| N13 hunter quests | Qualified warnings, SU14 | World/NPC actions and knowledge |
| N14 pets/livestock | Ordinary body/household partner view, SU14 | PLAY household variant |
| N15 remain nonhuman | Section 5, SU17 | PLAY progression and world routes |

### Five suggestions, ranked; browser verification specified, not run

**INFERRED:** these feed the engine lane's foundation/first-beast slice. Later
partner, rooted and brood checks wait for their real shared contracts. They are
not additional gates for shipping the earlier single-body foundation.

| Code | Suggestion | Required rebuilt browser evidence |
|---|---|---|
| SS1 | Join the first beast slice to one observer-qualified location/people/item rendering path, preserving the existing item knowledge seam. | At fresh disposable origins at both target viewports, use one legitimate sensory action; show an observed unidentified trace, then supported identification. Inspect normal/combat prose, tooltips, actions, comparisons, accessible names and DOM for absent hidden facts. Lose the channel and verify live facts disappear while legitimate memory remains. Save/reload/export/literal-file import the actual discovery and loss; compare old human presentation under the declared compatibility policy. |
| SS2 | Adapt equipment into a Body view for that same beast; keep selected action quote and work beside it. | At 1366x768 and 1920x1080, equip a supported fitting, observe a real function change and compare known eligibility with execution. Verify unsupported humanoid slots do not appear or contribute bonuses. Exercise busy combat/retreat, populated inventory, craft/trade, long names and laptop zoom/text enlargement. Keyboard/focus and saved human layouts remain usable. Verify fitting/custody and changed-positive body state after save/reload/literal import; test no item duplication under the selected transition. |
| SS3 | Add one authored tiny/huge route contrast and rooted Reach adaptation when those bodies are selected. | Use the real known route with current size/load; attempt a blocked alternate and take a valid bypass or approved carrier route. For rooted play, select a sensed target beyond effect reach and a valid in-reach action; verify favorites/quick return cannot bypass immobility. Observe actual location/custody changes. Check target list and map captions at both sizes, keyboard and effects-off. Save/reload/import route knowledge, size, cargo and anchor without teleportation. |
| SS4 | Add partner/member context only when the corresponding lease/link consumer exists. | Exercise agreed carrying/advice and a refusal; confirm no movement or resource spend occurs from advice alone. With two members at different places, receive a real limited report, switch view without free cargo/XP transfer, break the link and confirm Last report replaces live truth. Test pending/outage/return states, active body reserve and member-list focus at both viewports. Save/reload/import exact leases, assignments, custody and evidence; verify counters/log summaries contain only received information. |
| SS5 | Fix the age-address seam with body-aware naming/voice and teach through the same controls. | Create a `middle aged` human and supported neutral/unnamed/nonverbal start; inspect greetings and both name-token paths using long names and literal markup characters. Complete the selected distinctive action, observed reply and queued work with keyboard at both viewports; keep work/quote visible. Switch/rename only through an authorized route and verify prior lines retain their actual subject. Check screen-reader output and effects-off for equivalent qualified facts; reload/import identity/tutorial state without replaying rewards. Human pacing and layout-feel acceptance remain separate. |

**UNKNOWN / remaining proof:** this lane ran no build, tests, browser journey,
persistence operations or human acceptance. These are reviewable proposals and
source seams only. Canon-specific sensor rules, precise scale/bond values,
controller/link contracts and real body-change/persistence support stay with their
owners. No source, bundle, private save, other lane or global direction was edited.
