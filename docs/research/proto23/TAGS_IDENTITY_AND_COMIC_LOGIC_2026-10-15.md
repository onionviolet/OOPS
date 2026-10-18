# Proto23 labels, identity and comic logic

2026-10-15. Requested by Weibao: consider Proto23's tags, especially the funny
combination of Nothing with Evil, and explore deeper implications.

Research and proposals only. No runtime, save, UI, priority or accepted design
change. This extends [E4 tags and rules](../../emergent/E4_TAGS_AND_RULES.md)
and [E8F adjectives](../../emergent/E8F_ADJECTIVES.md), rather than introducing
another tag-system specification. Those documents remain proposal owners.
[User direction](../../USER_VISION.md#anything-is-possible-2026-10-09) already
permits tags and rules across layers. Current playable-slice and desktop-first
priorities in [PROJECT.md](../../../PROJECT.md) remain in force.

## Verified source and limits

Primary source: [Proto23 pinned index.html](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html).
Locally inspected `/private/tmp/proto23-ui-source.html`; SHA256
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`
matches the earlier [source-mechanism report](SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md).
The [public page](https://23html.github.io/) also exposes the label combination.
Source findings below refer to that pinned revision, not an assertion that the
live source is byte-identical. No gameplay was exercised in this pass.

| Code | Verified finding | Source lines | Implication |
|---|---|---|---|
| F1 | Default `Creature` has name Nothing, description Empty space and `type = 3`; the default instance becomes `global.current_m`. | 7393-7462 | The odd pairing comes from concrete default values, not a demonstrated generated semantic judgment. Authorial intent is unknown. |
| F2 | `global.text.mtp` maps six creature types; index 3 displays Evil. `update_m` puts the mapped type beneath the name. | 10006-10014 | This particular quoted label is a creature class. Player titles are a separate mechanism. |
| F3 | Player class defense `cmaff[current_m.type]` participates in physical and magical damage calculation. Class-specific kill counters are also updated. | 10498-10504, 10612-10617 | Classification has consumers beyond display. This does not prove that the default empty opponent is normally fightable. |
| F4 | An NPC explains the classification in-world; its Evil bucket mixes artificial beings and supernatural enemies. | 11975-12004 | The taxonomy compresses origin and moral language. Its presence in dialogue does not make every descriptive claim an independently verified combat rule. |
| F5 | Current YAIR source already stores enemy category tags, has earned title definitions, and evaluates explicit facts with known/unknown results. | `src/enemies.js:71-85`, `src/titles.js:1-12`, `src/rules.js:1-29` | Build on existing owners if a slice is selected. A universal semantic engine is not established by these pieces. |

The useful borrowing is concise, confident classification that gives a world
personality, with selected categories doing real work. The source does not
establish a general adjective algebra or a universal morality simulation.

## Proposals to account for now

### P1. Let labels speak in the world's voice

An otherwise normal object becomes memorable when its label is oddly specific:
an apologetic sword, an unemployed shrine, a suspiciously ordinary pebble.
Some labels can remain pure flavor. Others can be earned summaries of actual
history. A few can be operative properties. Avoid forcing every joke to grant
a stat bonus or become a quest.

Give players a way to distinguish these meanings when a decision depends on
them. A name is not automatically a property: calling a sword fire does not
make it hot unless the world's rules or a naming power make that true.

### P2. Separate nature, judgment and recognition

A proposed helpful construct might be artificial by origin, trusted by its
neighbors, condemned by a temple, and recognized by one ward as an outsider.
These can coexist without converting all of them into one global evil flag.
Conversely, a world with objectively operative alignment may genuinely have
such a flag. Preserve that world's premise rather than universalizing either
subjective morality or objective alignment across the multiverse.

For a consequential claim, the design needs to answer: who applies it, what
it describes, when it applies, and which rule consumes it. These are questions
for existing owners, not a mandatory new record format for every flavor word.
Player-selected titles and nicknames need not overwrite evidence, reputation
or actual species.

### P3. Make discovery a change in understanding

Appraisal may progress from coarse category to observed property to understood
mechanism. A merchant's description, player note and measured result can
disagree. Losing an appraisal tool should remove current sensing capability
without erasing what was learned.

Known information should be useful: an observation changes a recipe choice,
a safe handling method, a conversation or a ward crossing. A new label alone
does not prove the entity gained or lost the underlying property. Tooltips,
search, sort order and color must not leak undiscovered truth. This applies
to newly authored secrets; no existing sealed truth is exposed here.

### P4. Let tags connect systems through specific rules

The interesting payoff is the same property mattering in several appropriate
places. A dry wooden implement can burn, serve as fuel and need protection
from rain, but those results require actual material/process rules. Burning
does not automatically mean destroyed; extinguished does not mean undamaged.
A summoned creature's origin does not by itself decide its mind, ownership,
loyalty or whether every world regards it as a person.

Word scope matters. A stolen sheath need not make its blade stolen. A curse
on an inscription need not infect every reader. A counterfeit badge can fool
a guard without satisfying a supernatural oath. Broad propagation, literal
adjective powers and exceptional cheats remain possible where specified.

### P5. Give labels history, change and different lifetimes

A label might be an enduring identity, a past event, a current state or a
temporary allegation. Repair removes broken but preserves repaired; acquittal
changes legal status without deleting the trial; a local nickname may persist
after its original cause ends. Which history travels with the player is a
world/continuity choice, not an automatic global grant.

For idle play, earned conditions may progress quietly in eligible elapsed
time. Absence does not authorize invented NPC knowledge or an unselected
offline punishment. Save resolved consequential history and its version so
an update does not silently reinterpret an old object or reroll its identity.

## Further possibilities, later unless selected

| Code | Opportunity | Playable consequence or question |
|---|---|---|
| L1 | Operational absurdity | An original comic ward rejects an officially condemned chair. The player can move the chair, dispute the designation or use a different entrance. This is an example, not a sealed planned encounter. |
| L2 | Paradoxes | An honest liar or living dead label need not be an error. Resolve the relevant predicate and scope; different senses of a word can coexist. |
| L3 | Missing versus absent | An empty slot, unknown occupant, invisible occupant and an actual entity named Nothing are different states. Powers targeting emptiness need an explicit meaning. Never turn a missing value into an evil target by accident. |
| L4 | Reputation as local information | Witnesses, rumor and records can spread different claims. An omniscient detection system is possible only where its premise grants that access. |
| L5 | Bureaucratic and magical economies | Certification, forgery, renaming, cleansing, attestation and disputed ownership can become services. Each has a concrete effect; paperwork does not automatically alter metaphysics. |
| L6 | Beyond items and people | Places, routes, organizations, weather and rules can carry properties. A road is unsafe to someone under particular conditions; a promise belongs to parties and terms. Some facts need relationships, not a flat adjective. |
| L7 | Gradual and measured qualities | Heat, contamination and confidence can have magnitudes. Boolean tags can summarize thresholds without replacing the underlying quantity. Not every tag needs the same numeric strength scale. |
| L8 | World translation | A foreign label can be recognized, ignored, approximated or explicitly converted. A local curse detector is not universal proof of morality or cosmology. |
| L9 | Label-changing powers | An adjective cheat could alter presentation, others' beliefs, rule recognition or reality itself. These are different capabilities. Scope, costs and counters depend on the requested power; no universal balancing tax is proposed. |
| L10 | Quiet humor and self-recognition | Sparse deadpan labels and long-tail titles can reflect unusual play styles, including home life. Avoid turning every action into a punchline or title notification. |

## Suggested first experiment, not selected

Choose one original, nonsealed object with a stable identity, a visible mundane
property, one locally attributed disputed label and one real rule consumer.
Let observation, one physical action and one social action produce different
outcomes. Display only the few facts relevant to the current decision, with
deeper known detail on inspection. Reuse the existing scene/reference home;
do not add a global tag dashboard.

If selected, target a populated 1366×768 desktop save and the shared UI rules.
The done check is an ordinary acquisition/discovery route, a consequence that
uses the actual property or attributed claim, clear feedback, and exact
save/reload/export/import continuity. Renaming alone must not alter reality
unless that is the selected power. No implementation or acceptance is claimed.

Disposition: F1-F5 are checked source findings; P1-P5 are ACCOUNT FOR NOW
design considerations; L1-L10 and the experiment are LATER proposals. No
current correctness defect requiring a runtime fix was established.

## Deeper pass: other titles, categories and existing consumers

Same-day follow-up requested by Weibao: go deeper across items, skills, people
and worlds, including interactions with existing tags and rules. This section
extends the proposals above; it does not select implementation work.

### F6. Proto23 has several classification systems with different jobs

The source contains 108 title declarations with 108 distinct IDs and 60 Skill
declarations. These are definition counts, not completed, reachable or useful
content counts. Several definitions are placeholders and some trigger lines
are commented out. Every title definition and its source references, plus
selected full schema/trigger sections, are retained in the gitignored
[private capture](private/tags-titles-2026-10-15/title-definitions-and-references.json).
The same directory retains the complete hash-checked source and skill table.
Committed analysis here paraphrases that material.

| Code | Source system and evidence | Worth absorbing | Do not infer |
|---|---|---|---|
| T1 | Creature class, six values, `type`; renderer at 10006-10014, combat class defense at 10498-10504 | Categories with shared combat and bestiary consumers; in-world explanation | Evil class is not a generic moral simulation; one creature class is not a complete person |
| T2 | Equipment separates `wtype`, attack class, elemental affinity, slot and rarity; 5595-5628 | Independent axes let a weapon train one discipline while delivering a different damage profile | Weapon name, color, rarity and actual damage are not interchangeable |
| T3 | Item `type`/`stype`, flags and hooks; 2189-2204, inventory color branches 11081-11095 | Category-driven organization plus a few special behaviors | A numeric code has no shared meaning across every object schema |
| T4 | Discovery, tried and new-item state; 10651, 10919-10933, 11094-11095 | Distinguish acquired, studied/used and unread feedback | Trying an item is not complete understanding; clearing a new marker must not erase discovery |
| T5 | Skill `type` participates in sorting, 9320-9323; levels and milestones have separate handlers, 1691-1718 | Useful grouping, activity-based growth, related-skill milestones | A skill category does not itself grant all capabilities associated with its name |
| T6 | Titles have identity, rarity, optional talent, on-acquisition hook and a special-marker flag; 431-438, 10207, 13760-13767 | Distinguish permanent achievement, selected display and operative entitlement | Rarity is not a multiplier; the special-marker flag alone does not establish secret-discovery behavior |
| T7 | Home-sector entry/stay/leave, furniture effects, cat-linked passive XP and consecutive stay counter; 8234-8280 | Places and relationships create eligible contexts for growth | This is not evidence of a universal NPC relationship simulator or broad offline simulation |

### F7. Titles can reward capability, information, access or biography

Correction to the older R1 reader's summary: source has four `.talent`
assignments. Three bodies directly change player modifiers; the fourth is
empty. It still matters because `giveTitle` marks that talent obtained and
two area-drop conditions read that marker. Thus a no-op hook is not evidence
of an inert title, nor should its tooltip be mistaken for the implementation.

| Code | Observed family | Actual source chain | Proposal for YAIRPG |
|---|---|---|---|
| TT1 | Movement accomplishments | Two movement titles reduce running cost through title talents, 508-548; movement milestones also grant separate benefits, 1860-1873 | Useful movement methods and route opportunities; avoid paying the same stat reward through both title and milestone |
| TT2 | Survival knowledge | One title increments `survinf`, 618-623; Shift inspection derives freshness estimates from rot state, 10982-11000 | Knowledge can improve the information available to a decision, rather than only raising numbers |
| TT3 | Service recognition | Returning supplies grants a title, 11660; its acquired-talent marker permits a special drop, 8072/8078 | Earned trust can admit repair services, instruction, borrowing or local loot eligibility through an explicit consumer |
| TT4 | Learning milestones | Literacy and cooking award titles alongside stats, XP modifiers or recipes, 1901-1920 | A title can summarize a stage while the skill remains the owner of competence and unlocks |
| TT5 | Domestic and relational life | Cat-patting thresholds, 7293; home stay thresholds, 7301-7303; home passive skill XP, 8266 | Recognize care, residence and long projects alongside combat; tie any relationship benefits to the actual relationship owner |
| TT6 | Failure and survival | Weak-opponent defeat predicate, 7266; no-death level predicate, 13730; death-related skill milestones, 2012-2023 | Recognize unusual history without mandatory failure farming; selected adaptations may be real benefits |
| TT7 | Long-tail accumulation | Kills, purchases, earned money, title counts and measured punches, 7269-7298 | Multiple kinds of achievement can describe a life; distinguish stock, lifetime flow, diversity, streak and best result |

These triggers also expose design choices worth changing consciously. Leaving
home resets Proto23's consecutive stay counter, while our current native
`home_minutes` reads cumulative home time. Neither is inherently correct for
every title. A history of being hungry is different from currently being
underfed. Preserve YAIRPG's accepted comfortable unfed play and no hunger
death; borrowing an adaptation loop does not accept Proto23's penalties.

Proto23's `giveTitle` automatically changes the displayed title and applies
an optional talent on acquisition. It does not establish that only the
displayed title's benefit is active. Its often mocking narration is a style
choice, not a requirement to belittle the player or call every person weak.

### F8. The live YAIRPG seams are more developed than the old draft

Checked directly in current source. These are source findings plus the named
focused tests below, not rebuilt browser or full-save acceptance.

| Code | Existing owner | Verified role | Integration consequence |
|---|---|---|---|
| Y1 | `src/items.js`, `src/enemies.js` | Boolean category tags already drive native code; item instances copy authored tag maps | Preserve native IDs/consumers; map selected categories rather than rename them wholesale |
| Y2 | `src/tag_store.js` | Registry kinds, acyclic parent implications, presence storage, observer filtering, three-state query semantics and standalone snapshots retaining saved definitions/revisions | Reuse for taxonomy and observation; it does not own durations, intensity, damage or gameplay clocks |
| Y3 | `src/rules.js` | Pure `eq`/`gte`/`lte`, `all`/`any`/`not`, with explicit known/unknown handling | Feed facts from their real owners; unknown is not false |
| Y4 | `src/rule_modules.js` | Typed module admission/matching and effect resolution; exact scope; separate physics, institution and knowledge channels | A concrete precedent for scoped rules, not permission to execute arbitrary generated rules |
| Y5 | `src/mixture_rules.js` | Registered Village plant/fluid/salt vocabulary, restorative implies plant; admitted `village.mix@2` reader, versioned rule locks, resolved product identity and receipts | Strongest current tag-to-rule example; extend supported consumers deliberately rather than assume this resolver governs combat or people |
| Y6 | `src/titles.js`, `src/absorb_p23/host_joins/long_life.js`, `src/main.js:9235` onward | Native held titles, counter recognition and staged host settlement; current native counters include home time and settled purchases | Reuse title recognition and durable native transactions |
| Y7 | `src/absorb_p23/long_life/worn.js` | All held-title bonuses remain; optional domestic worn payoff requires three held titles | Existing source already separates held benefits from a selected payoff; do not replace it with an accidental single-title restriction |
| Y8 | `src/absorb_p23/long_life/training.js` | A Cooking milestone supplies an Alchemy XP multiplier; display requires both skills known | Related training exists; a multiplier aids learning but does not grant another discipline's techniques |
| Y9 | `src/simulation_effects.js:112-134` | Facts include custody owner/holder, knowledge basis, powers, conditions, claims and actor-scoped simulation titles | Preserve these distinct owners; native held titles and simulation titles are not automatically the same store |

Important difference from E4's older proposal: its strength-based `tagWorld`
store and base/world/place/personal precedence are not the contract of the
current presence store or bounded module resolver. Current module layers are
core/world/region/actor/director, with typed permitted effects. Follow the
actual selected resolver; reconcile old proposals before adding content.

### P6. Connect across domains through explicit meanings

| Code | Domain | Original proposed example | Required connection |
|---|---|---|---|
| X1 | Items | A porous wooden cup absorbs a preparation; its contents and maker's mark matter separately | Material/process owner resolves absorption; contents have quantity; custody records possession; mark is evidence, not universal authority |
| X2 | Skills | Repeated sound repairs teach diagnosis and eventually a repair method | Native settled repair events feed eligible progress; technique unlock belongs to its skill/knowledge owner; a title summarizes the earned history |
| X3 | People | A trusted local repairer is also an outsider to a distant guild | Competence, institution membership, local reputation and witnessed evidence are separate facts; a nickname cannot manufacture mastery |
| X4 | Relationships | A borrowed tool is held by you and owned by the keeper | Query custody by owner, holder and object, rather than make every item globally borrowed; return or loss settles the actual agreement |
| X5 | Places | A damp cellar affects drying and storage, while a workshop license affects service access | Conditions and material processes supply physics; institutional rules supply access; a license does not negate dampness |
| X6 | Worlds | A foreign restorative ingredient arrives in a world whose medicine differs | Preserve material identity and learned history; the destination reader determines compatibility; source-world terminology alone grants no efficacy |
| X7 | Personal powers | A named blessing changes how one ward recognizes its bearer | Specify whether it changes observed evidence, the ward's selection predicate or underlying nature; the power may be broad if its premise says so |
| X8 | Organizations and laws | A guild declares a material forbidden | Store issuer, jurisdiction, subject and effective period as a relation/policy; do not turn a legal designation into poison damage |

Classification implications must be stable truths of their vocabulary:
oak implies wood; knight does not globally imply trustworthy. A sword need
not be sharp if blunt or broken. Cooking does not imply hot because some
methods are cold. Favor explicit process/material/state facts over the older
E4 draft's convenient universal shortcuts. These are proposal corrections,
not changes to the current runtime registry.

Some rules operate on true state while observers lack the result. A hidden
curse can act without revealing itself. The current module matcher defaults
to an explicit omniscient observer for simulation matching; UI must use an
appropriate observation view. Do not make physics depend on whether the player
has identified a property unless that is a selected world premise.

### P7. Titles need separate answers for history, display and authority

Proposed distinctions, not mandatory extra fields for every minor title:

| Code | Question | Why it changes play |
|---|---|---|
| ID1 | Was it earned, bestowed, bought, inherited, stolen or merely claimed? | Different acquisition modes remain possible; an institution can recognize an office while mastery remains separate |
| ID2 | Is it a lasting achievement, current role, temporary designation or reputation? | Losing an office need not erase its historical service; gaining a rank need not replace all earlier records |
| ID3 | Does it grant a standing benefit, a selected effect, local access or only a name? | A title list is not a universal bundle of passive bonuses; selection need not remove permanent learning |
| ID4 | Who knows, believes or recognizes it? | The player may know an accomplishment while strangers need evidence; a metaphysical title can be directly sensed if the world supports that |
| ID5 | What continues across body, life or world changes? | Remembered skill, bodily adaptation, institutional office and a named soul entitlement may have different continuity |

Composite epithets can summarize patterns across a life without flattening
them: a repairer who teaches and repeatedly returns borrowed tools could earn
a locally meaningful reputation. Require the relevant events and witnesses;
possessing a set of unrelated adjective tags is not sufficient biography.
Keep synthetic role composition a later proposal, not a universal automatic
title generator. Award event IDs and grant identity must prevent duplicate
rewards after retries or reload, including when the title also grants access.

### P8. One connected slice would teach us more than a giant vocabulary

Suggested experiment: an original Village repair-and-return job. A keeper
lends a damaged implement; inspection reveals a relevant material/state;
an appropriate process changes its useful behavior; native completion and
return earn local service recognition. That recognition opens one further
service or lesson. An optional later world visit can test a distinct local
recognition rule without retroactively changing the original history.

This connects item facts, means, practice, custody, recognition, people and
place. Choose either this or the earlier one-object experiment, then finish
that playable slice before extending it. Both remain unselected. The optional
world leg is not a new gate for a Village slice. Preserve idle-friendly queued
work and comfortable ordinary play; no mandatory upkeep loop is proposed.

The actual bridge, if selected, should follow:

`settled native event -> owning state -> selected fact/tag projection ->
admitted rule -> staged consequence -> durable receipt -> observer-safe UI`.

The tag store classifies, the rule matcher selects, and the owning transaction
settles. UI rendering never grants the property. Query only the needed roles
and facts; do not scan every entity and possible adjective on each idle tick.
Keep magnitudes in their quantity owners, expiring states in condition owners,
relationships in relation/custody owners, and generated identity in versioned
product records. Cache only when owner changes and observer changes invalidate
it correctly.

Before any gameplay delivery claim: rebuilt ordinary desktop route at 1366×768,
changed useful outcome, inaccessible/unknown-property behavior, partial/failure
recovery, and exact save/reload/export/import continuity for changed state.
Existing source tests do not substitute for those gates.

### Checks and disposition

Source inventory: 108 distinct title declarations, 60 skill declarations;
definition/reference capture and full source preserved privately with its hash.
Focused existing tests run: `node --test --test-reporter=dot
tests/tag_store.test.js tests/rule_modules.test.js
tests/mixture_rule_modules.test.js tests/titles.test.js`, 49 tests passed.
These check the selected current helpers/resolver/title slice, not every
integration claim or new gameplay. No production source or save was changed.

ACCOUNT FOR NOW: reuse current tag/rule/title owners, separate class and role
from attribution and truth, preserve unknown-state semantics, and reconcile
old E4 assumptions against actual resolver contracts. LATER: X1-X8, richer
title modes and one selected connected slice. No new implementation is
authorized merely by this research report.

## Follow-up: actual title powers and tags on rules

Weibao's [later clarification](../../USER_VISION.md#titles-achievements-and-tags-on-rules-2026-10-15)
explicitly includes titles granting powers through a world or cheat, related
achievement grants, and tags affecting rules themselves. The connected
[E4 expansion](../../emergent/TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md)
owns these considerations across cheats, NPCs, worlds and continuity. Earlier
distinctions between labels and consequences must not be read as a limit on
operative title/adjective powers. Where the premise makes naming, recognition
or a tag causally powerful, that is a real supported design possibility.
Specific mechanics remain proposals; this is not an additional Proto23 source
finding or an implementation claim.
