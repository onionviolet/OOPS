# E9. Laws as a power, and the law toolkit (proposal)

Claude, 2026-10-10. Weibao: "more to consider? expand accordingly, consider
stuff like Laws, making them make sense, or implemented accordingly only
when makes sense?" Follows his "there are and are not absolutes" (USER_VISION,
2026-10-10): a world can hold its own absolutes as lore; no law holds for
every world. Builds on [E4 rule layers](E4_TAGS_AND_RULES.md), [E5
storyteller](E5_STORYTELLER_AND_FATE.md), [E8D enforcement modes](E8D_VOW_SYSTEM.md)
and the [rulebook](../RULES_FROM_SCRATCH.md). Proposal only.

**Reframed 2026-10-10.** Weibao: "we can just have these ideas on how laws
work and stuff as a power, since there are plenty of powers like that, but
as of current there seems to be no lore reason to be like this in a
specific world quite yet." So this file is a **toolkit**: how a law works,
whoever imposes it. Its main users are **law powers** (a person, artifact,
place, ritual or patron that imposes a rule on reality). No world has a
fixed law from this file. A world gets one only when its own lore gives a
reason, using the same toolkit.

## Law powers

Powers that impose a rule on reality are a family of their own (added to
[E8B](E8B_POWER_CATALOG.md) under "Rules, words and causality"). Ways they
come:

| Law power | Scope | Example (original) |
|---|---|---|
| Domain or zone | A space around the holder, for a time | Inside my field, no lie can be spoken |
| Sanctuary | A place, lasting | No blood may be spilled in this shrine |
| Personal law | The holder only | Fire cannot burn me; debts owed to me weigh on the debtor |
| Contract law | The parties to a deal (E8D) | Whoever breaks our pact loses their voice |
| Artifact law | Whoever holds or stands near an item | While the scale is level, every trade is fair |
| Decree | Subjects, followers, a territory | In my lands, names bind |
| Rule-writing | Wherever the holder can reach, limited by slots or price | Write "if X then Y" into a place for a day (E8B conditions) |
| World seat | A whole world, for whoever owns the concept behind it | Rare; the top of the concept tiers (E4) |

Each one uses the toolkit below: a kind, a strength, an enforcement mode,
scope, edges and a price. The higher the scope and strength, the larger the
price, the rarer the power, or both, reasonably.

## What a law is (the toolkit)

A rule of reality within some scope, as opposed to a social law people can
ignore (E3 law and factions). Whoever imposes it, a law has these parts.

| Kind | Example (original) |
|---|---|
| Physical | Fire spreads twice as fast here; iron floats |
| Metaphysical | Souls linger a year after death |
| Causal | Every gift creates a debt |
| Informational | No spoken lie survives the night |
| Economic | Nothing can be made without something unmade |
| Social-cosmic | Heaven grants rule to whoever holds the mandate |
| Narrative | Prophecies spoken aloud come true, somehow |
| Temporal | Days are shorter in winter by law, not orbit |

**Strength**, chosen per law:

| Strength | Meaning |
|---|---|
| Absolute | Holds within its scope, full stop (a local absolute) |
| Strong | Holds except against named exceptions (a higher tier, a sacred place) |
| Tendency | Usually holds; odds can be beaten |
| Custom | Believed to be a law; actually social and breakable |

The last row is a good source of stories: a "law" everyone obeys turns out
to be custom, or the reverse.

## Making a law make sense

A law, from a power or a world, earns its place by answering these. Weak
answers mean it stays flavor.

1. **Reason.** Why does it exist? A creator's design, an ancient pact, the
   nature of the world's energy, a sealed god, an artifact, collective
   belief, a wound in reality.
2. **Scope.** Where, when and on whom? The whole world, a region, sacred
   ground, the living only, natives only.
3. **Mechanism.** How is it enforced? Prevent (the act fails), penalize
   (it happens, then a cost), or judge (a witness decides later), reusing
   E8D's enforcement modes.
4. **Second-order effects.** What does daily life look like because of it?
   Work out at least three: trades, customs, crimes, jokes, architecture.
5. **Winners and losers.** Who benefits, who suffers, who exploits it?
6. **Edges.** What doesn't it cover, and how do clever people use the gap?
7. **History.** When did it start? Can it end? Has it changed?
8. **Interactions.** How does it meet other laws here, and powers or
   people from outside?
9. **Learnability.** How does a player discover it, test it and come to
   understand it (E7)?

## Implement only when it makes sense

For law powers, the engine form is ordinary: a rule in the holder's
personal or place layer (E4) with the law's enforcement. For a world, the
bar is higher, as below.

Three tiers of implementation. A law moves up only when its answers above
are strong and it adds decisions.

| Tier | What it is | When |
|---|---|---|
| Flavor | Lore text, NPC talk, legends; no mechanics | The law is atmosphere, or its effects wouldn't change choices |
| Soft | Shapes odds and behavior: card weights (E2), NPC beliefs and habits (E3), storyteller tastes (E5) | It changes how the world tends to act, without hard enforcement |
| Hard | An engine rule in the world layer (E4), with enforcement, logs and discovery | It changes what players and NPCs can do, and the cost is worth it |

**Promotion test** (proposal): a law becomes hard when it has a reason, at
least three second-order effects, at least one exploitable edge, a way for
the player to learn it, a defined meeting with outside powers, and an
engine form that fits the E4 world layer. Otherwise it stays soft or
flavor until it does. A flavor law can still matter: people believe it,
and that changes them.

## Engine shape (hard laws)

```js
{ id: 'law:<world>.<name>', world, kind, strength,
  reason, scope: { places, times, subjects },
  enforcement: 'prevent'|'penalize'|'judge', witness,
  rules: [ /* E4 rules in the world layer */ ],
  exceptions: [ /* tags, places, tiers that escape it */ ],
  facts: [ /* facts it sets, for cards and NPCs */ ],
  discovery: { hints, tests },
  history: { since, source, can_end } }
```

- Laws live in the **world layer** of E4; place laws in the place layer.
- Their facts feed E2 cards and E3 beliefs, so soft effects follow from
  hard ones automatically.
- Each law has a **discovery state** for the player (unknown, rumored,
  believed, confirmed; E7).
- Breaking or bending one writes a history fact (E6).

## When laws meet (crossing worlds)

What happens when you bring "can't be seen" into a world whose law is
"everything is seen"? Ways it can go, chosen by the world's lore:

| Way | Result |
|---|---|
| Host wins | The world you're in decides; your power fails here |
| Higher tier wins | Concept tier or law strength decides (E8, north star tiers) |
| Bubble | Your carried law holds in a small radius around you, at a cost |
| Paradox | Both happen; an event follows (the world reacts, or reality strains) |
| Negotiated | A treaty, a vow (E8D) or a heaven's favor carves an exception |
| Converted | Your power is translated into the local form (verse equalization) |

## Changing laws

Laws can change, reasonably, through lore-fitting means:
- **Owning the law**: a concept-tier holder takes the seat behind it
  (E4 "owning a rule", north star tiers).
- **Bargaining** with a world's will or heaven.
- **Ritual or artifact**: break the seal, move the artifact that holds it.
- **Belief shift**: a law resting on belief weakens as belief fades.
- **Game rules**: a ritual game where players add laws (E8D, JJK-style).
- **Collapse**: the source dies; the law fades over years, leaving customs.

A law change rewrites the world's facts, which ripples through cards,
beliefs and economies. That's a world event worth a legend.

## Heaven as a character

Weibao's earlier point: pushback can come "sent by heaven or something".
Some worlds have a will that enforces its laws and has its own tastes.

- **Tastes**: punishes flashy power, ignores quiet monsters; or rewards the
  bold; or cares only about its mandate; or none of these.
- **Attention**: it notices through profile (below), omens, its servants.
- **Moods and history**: lenient after a great sacrifice, harsh after
  rebellion; it remembers.
- **Tools**: tribulations, omens, servants, law enforcement, gifts.
- **Learnable**: players read its moods through omens and other people's
  fates, and can bargain, hide or defy.
- **Absent** in many worlds; then nothing sends pushback but people.

## Profile: how visible you are

If pushback (from heaven, institutions or people) depends on attention,
visibility is worth tracking per person and per world.

| Raises it | Lowers it |
|---|---|
| Public displays of power | Hiding, disguises, aliases |
| Witnesses, rumors, legends (E6) | Remote places, few witnesses |
| Fame-fed powers, titles | Silence vows, anti-divination (E1 blind) |
| Breaking a law visibly | Allies who cover for you |

Profile is per audience: famous in one town, unknown in the next; known to
heaven, hidden from the guild. Players manage it like any other resource.

## Worked examples (original, not assigned to any world)

These are sample laws to show the toolkit. Each could come from a power, an
artifact, a decree or, if some world's lore ever calls for it, a world. The
"reason" column is a sample origin, not a fact about any world here.

| Law | Sample reason | Mechanism | Second-order effects | Edge | Tier |
|---|---|---|---|---|---|
| No spoken lie survives the night | A god of truth bled into the soil | Penalize: a lie told today becomes true by dawn or the liar falls ill | Merchants speak in careful truths; poets thrive; "I might" is the language of diplomacy; children learn precise speech early | Lies in writing, silence, questions, technical truths | Hard |
| Debts are physical | An old trade pact with the world's spirit | A debt weighs on the debtor's body until paid | Lenders are feared; the heavy-limbed are known debtors; bankruptcy is a medical issue | Debt can be transferred or carried by a pack animal | Hard |
| Fire always wins | The world was born from a burning star | Absolute: fire overcomes any opposing element here | Stone and water mages are rare; fire wardens rule; houses are built for burning | Fire can't win against no fuel; preventing a spark is the craft | Hard |
| The dead stay a year | A broken gate in the underworld | Strong: souls linger a year as visible shades | Inheritance by conversation; murder is solved by asking; grief has a deadline | Souls can be hidden, bound or rushed through | Soft or hard |
| Names bind | Creation was spoken | Strong: knowing a true name grants a command | Everyone uses use-names; naming ceremonies are secret | Names change with great life events | Hard |
| Whoever holds the mandate rules | Heaven's choice | Social-cosmic, judged by omens | Rebellions seek omens; usurpers fake them | Heaven can be fooled for a time | Soft |
| Iron is cursed | Believed, since a war long ago | Custom, not a real law | Smiths are outcasts; bronze is everything | It's harmless; discovering that is a revolution | Flavor, later soft |

## No world laws assigned yet

No world in the current game has a law from this file. The Village stays
mundane. When a world's lore gives a reason (a book world's own rules, a
designed world card), its laws are written with this toolkit and pass the
promotion test above. Until then, laws enter play through powers,
artifacts, vows and decrees.

## The law path, and laws in combat (2026-10-10)

Weibao: "save accordingly, consider implementation and combat aspects, this
is like the law path from LOTM, more to consider?"

### What the LOTM comparison suggests (structure only)

From Claude's memory of *Lord of Mysteries*, unverified: the series has an
**order pathway** (arbiters and judges) whose steps grow from authority and
interrogation, to forbidding things in an area, to commands reality obeys,
to balancing and embodying order. It has a neighboring **loophole pathway**
(lawyers) that grows by finding gaps in rules, distorting them and
corrupting their enforcers. Steps are digested by acting the role (lane B
confirmed digestion by acting as one way among others). The exact sequence
names and powers need checking; lane W's wiki crawl covers LOTM.

### A law path template (original, using E8C path parts)

A template only. Per rulebook rule 2, each world names, gates and prices
its own law path if its lore has one; book worlds follow their book (rule 3).

| Part | One way it can go |
|---|---|
| Currency | Authority: grows with recognized enforcement, witnesses and legitimacy |
| Steps | Warden (presence, being obeyed in small things), Questioner (truth and intent), Judge (prohibitions in a zone), Decree (commands that bind), Balance (equalize a field), Order (laws that outlast you) |
| Gate | Acting the role: enforcing, judging fairly, keeping your own laws; a hard case at each gate |
| Risk | Rigidity (trait drift toward `rigid`, inability to bend your own rules), corruption, being bound by your own decrees |
| Shape | A ladder with a neighbor: the loophole path, swapping at set points |
| Grader | The people who accept your authority, an institution, or heaven where it has a mandate |
| Ceiling | A law seat (E9 law powers), owning a concept of order |

**The loophole path** as its partner: steps from finding gaps, to
reinterpreting a rule, to bribing a law (paying to be exempt), to turning a
law against its maker, to rewriting another's decree. Its risk is
corruption and losing your own word's weight.

**An on-ramp already in the game:** the Village patrol career (Tessa, the
lantern and baton custody ledger) is a natural mundane doorway into a law
path. No world law is needed; it's a power path a life can grow into.

### Combat with laws

| Law in a fight | What it does | Counterplay |
|---|---|---|
| Prohibition zone | "No flight," "no fire," "no leaving" for its duration | Leave the zone; a higher tier; a loophole (gliding isn't flying); negation |
| Truth field | Lies fail; techniques must be described honestly when asked | Silence; questions instead of answers; technical truths |
| Command | "Kneel," "stop," "drop it": a will contest | Will, tier, deafness, a prior vow that conflicts |
| Sentence | A penalty applied after a judged breach (E8D judge mode) | Appeal to a higher authority; flee jurisdiction |
| Balance | Equalize stats or tiers in a field | Fight outside it; powers it doesn't cover |
| Exemption | The judge (or a briber) is exempt from their own law | Find the price of exemption; make them break it |
| Precedent | A law used before costs less and binds harder next time | Change the facts so precedent doesn't fit |

**Design points for law combat:**
- **Laws are announced** by default (spoken decrees), so fights become an
  information game; announcing can also strengthen them (audience pricing,
  JJK-style disclosure).
- **The caster is bound too** unless they pay for an exemption, so a
  no-fire zone also stops your fire.
- **Price scales** with scope, strength, duration, number of targets and
  how much the law fights the target's own power.
- **Law against law**: two law users stack decrees; resolution uses the
  meeting modes above (host, tier, bubble, paradox, negotiated).
- **Outlaws**: some beings carry a `lawless` tag (chaos spirits, the
  fateless, a loophole master) and resist or ignore laws.
- **Spirit versus letter**: the law's interpretation mode (E8D) decides
  whether gliding counts as flying.

### Implementation

| Piece | Engine form |
|---|---|
| Prohibition | A place-layer or zone rule (E4) with owner, duration, exemptions; forbidden actions show as ineligible with a reason, through the existing preview reasons (`previewSimulationCommand` reasons; `src/action_legibility.js` already renders requirement reasons) |
| Truth field | A rule on the `speak` hook (E8D) plus disclosure facts for E7 |
| Command | A forced action injected into the target's brain (E3) after a contest drawn from the `encounter` stream |
| Sentence | A judged breach (E8D enforcement `judge`) with a delayed penalty |
| Balance | A temporary condition that sets combat stats to a shared value |
| In vanilla combat | Laws become conditions on combatants (`forbidden:flight`, `forbidden:fire`) that remove options or negate damage tags (`src/models/combat.js` attack flow) |
| Decree builder | The E8D slot grammar (subject, act, scope, duration, penalty) with pre-authored quick decrees for fights |
| Idle | Standing orders for law users ("declare no-flee when fighting thieves") |
| Logs | Each law's announcement, effect, contests and breaches |

### More to consider

- **Jurisdiction**: laws hold strongest in places you've claimed or are
  recognized in; weaker abroad.
- **Appeals**: a target can pay to appeal to a higher authority (a court,
  heaven, a patron) and suspend a sentence.
- **Legal fictions**: declaring something true for the law's purposes
  ("this stranger is my kin") to route around a rule.
- **Laws and vows**: a decree is a vow imposed on others; a contract is a
  law two people share (E8D).
- **Law careers in a life**: guard, notary, judge, oath witness, contract
  broker; the life sim side of the path (E8E).
- **Corruption arc**: a judge who takes bribes slides toward the loophole
  path, or the reverse, an outlaw who starts keeping their word.
- **Losing authority**: if people stop recognizing you, an authority-fed
  path weakens (fame and faith currencies, E8C).

## Real-world traditions as a reference shelf (2026-10-10)

Weibao later clarified (2026-10-10): "I meant lore as in world lore, lores
relevant to each world? and dont forget our rules". The per-world mapping
is the next section. This shelf stays as reference: a world uses an entry
only when its own lore draws on that tradition (rule 2), never as a
default for all worlds.

Weibao: "more to consider? expand accordingly, tie real lore accordingly".
Real myth, religion and legal history already contain most law mechanics.
They are public domain, so the public build can use them by name. Summaries
are Claude's from general knowledge, in brief; details vary by source and
telling, and the wiki lane or a later check can tighten them.

### Myth and religion

| Lore | What it is (brief) | Mechanic it gives us |
|---|---|---|
| Oath on the Styx (Greek) | Even gods swore by the river Styx; an oath-breaking god was struck breathless and exiled from the gods' company for years | A **witness that outranks the swearer** (E8D witness slot); penalties that bind the mighty |
| Erinyes, the Furies (Greek) | Spirits who pursue oath-breakers and kin-slayers relentlessly | **Pursuers spawned by a breach**, using the existing pursuit system (`src/pursuit.js`) |
| Themis, Dike and Nemesis (Greek) | Divine order, justice, and retribution for hubris | Heaven's tastes (E9): Nemesis answers excessive **profile** and pride |
| Xenia (Greek) | Sacred guest-host law, watched by Zeus; gods visit in disguise to test it | **Hospitality laws** with hidden tests: a beggar may be a god (E7 K4 disguise) |
| Ma'at and the weighing of the heart (Egyptian) | After death, the heart is weighed against the feather of truth | **Judgment at death** deciding what carries to the next life (soul layer, heir rules) |
| The ten courts of Diyu and King Yama (Chinese) | The dead pass through courts that judge deeds and assign punishment and rebirth | **Afterlife bureaucracy** as a world between lives: reincarnation shaped by a verdict |
| The Celestial bureaucracy (Chinese folk religion) | Heaven runs like an imperial government: ranks, offices, reports, petitions | **Heaven with paperwork**: petitions, offices that pass on (E8D office claims), appeals |
| The Kitchen God (Chinese folk custom) | Reports a family's deeds to heaven each year; families sweeten his lips with sticky sweets so he speaks well, or can't speak | **Gaming heaven**, real and funny: bribe or gum up the informant (taco-vow energy) |
| City Gods (Chinese) | Local spirit magistrates with jurisdiction over a town and its dead | **Jurisdiction** for spirits; a town's own law spirit |
| Mandate of Heaven (Chinese) | Rule is legitimate while heaven grants it; disasters and omens signal its loss | **Legitimacy as currency**, read through omens (E9 heaven) |
| Karma and dharma (Indian traditions) | Deeds bear fruit across lives; each being has a right duty | A **deed ledger** that follows the soul (if a world's lore uses it) |
| Rta (Vedic) | Cosmic order the gods themselves uphold | Order as a concept above gods: the top law seat |
| Geis (Irish) | Personal taboos, often several, that can collide | Already in E8D; collisions as tragedy |
| Fae law (European folklore) | Exact words, debts for gifts, iron and hospitality rules | Literal interpretation (E8D), gift debts, cold iron as `lawless` tool |
| Forseti and the Thing (Norse) | A god of fair judgment; assemblies where disputes were settled | Assemblies as courts; a judge spirit |
| Golems and the shem (Jewish folklore) | A clay servant animated by a written holy word; erase a letter and it stops | **Written laws as life**: edit the word, change the being (rule-writing, true names) |

### Real legal history (strange and useful)

| Practice | What it was (brief) | Mechanic |
|---|---|---|
| Outlawry (medieval Norse and English) | An outlaw was outside the law's protection: anyone could harm them without penalty | The `lawless` tag cuts both ways: laws can't bind you, and they don't protect you |
| Sanctuary (medieval churches) | A fugitive in a church or sanctuary town couldn't be seized for a time | **Sanctuary places** with rules and time limits |
| Benefit of clergy (medieval English) | Clergy were tried in church courts; proving you could read a set verse became a way to escape the gallows | **Skill-based exemptions**: a loophole that rewards learning |
| Trial by ordeal | Guilt decided by surviving fire, water or hot iron, believed to reveal heaven's verdict | **Law resolved by contest** where heaven intervenes (if the world has one) |
| Trial by combat | Disputes settled by a duel, sometimes with champions | Champions fight for you; law combat as a formal duel |
| Compurgation (oath-helpers) | The accused cleared themselves with others swearing to their honesty | **Social vows**: allies stake their reputation for you (E3, E8D) |
| Wergild (Germanic) | A set price for a life by rank, paid to end a feud | A **price ledger** for harm; feuds end by payment |
| Deodand (English) | An object that caused a death was forfeit | **Laws on objects**: items with history (E7) get judged |
| Animal trials (medieval Europe) | Animals were sometimes tried in court, with lawyers | Courts for non-humans; a gag law with real roots |
| Piepowder courts (medieval markets) | Fast courts for traveling merchants, settling disputes within the fair | **Jurisdiction for travelers**; quick hub courts |
| Legal fictions (Roman and later law) | Treating something as true for the law's purpose | Already above; very much real |
| Sumptuary laws | Rules on who may wear what | Social laws shaping identity and disguise |
| Legalism and Confucian ritual (classical China) | Rule by strict written law and punishment versus rule by virtue and proper conduct | **Two law philosophies as two paths**: decree and penalty, or ritual and example |

### How this ties into the law path

- **Order path flavors**: a Legalist judge (written decrees, harsh
  penalties), a Confucian magistrate (ritual, example, shame), a
  celestial official (paperwork, petitions, rank), a Thing-speaker
  (assemblies, consensus).
- **Loophole path flavors**: the fae bargainer (exact words), the clerk
  who reads the verse (skill exemptions), the Kitchen God briber (gaming
  the informant), the outlaw (outside it all, and unprotected).
- **Enforcers**: Furies as pursuers, city gods as local judges, heaven's
  offices as appeals.
- **Death and law**: the weighing of the heart and the courts of the dead
  give the soul layer a judgment step between lives, for worlds whose lore
  includes one.

## Law powers by world, from each world's own lore (2026-10-10)

Mapped from each world's docs (a read of `docs/worlds/*` and live
destinations, 2026-10-10). The rulebook governs: each world makes its own
rules (2), book worlds follow their book (3), things cross only by a
carrier (5), what anyone sees can be wrong (6), accepted means Weibao said
so (10), outliers stay outliers (12). All rows are proposals.

| World | What its own lore has (docs) | Fit for law powers | Proposal |
|---|---|---|---|
| Home world (Village, hub, Saltworks, Archive), original, live | Civic and commercial order: town ledger, permits, guild contracts, charters with disclosed terms, custody ledgers (patrol kit), remembered promises (`original-frontier/CAMPAIGN.md:17,20,55`; `TIMELINE_AND_ENDINGS.md:23-25,67,78`). Strength "cannot grant consent, decide a legal claim" (`CAMPAIGN.md:103`) | Social law, not reality law | Law here is people and records: ledgers, contracts, witnesses, reputation (E3, E8D social vows). The patrol career is a mundane authority path. A reality-bending law power would be an outlier or something carried in |
| Folded Glasshouse, original, live | Nothing documented on law | None yet | Leave empty until its lore needs it |
| Tidemark, original, live | No lore doc found | None yet | Same |
| Paradise hub and Goa, book-derived, live | The source is documented as a death-or-contract hub: terms known before acceptance, refusal creates no debt, 72-hour tasks, secrecy sanctions, failure downgrades; judgment "needs its actual institution/authority"; Iona holds ledger authority (`paradise-hub/WORLD_BRIEF.md:17,41`; `BOOK_WORLD_ENTRY_MATRIX.md:28`; north star 2795, 2822) | Strong: the world's system is itself a contract-and-judgment power | Paradise contracts use E8D slots and enforcement as the book does; the system is the law holder, players are bound parties. Exact rules are unverified (primary pages unavailable), so source checks come first |
| Mother of Learning, Cyoria, book world, live branch | Institutional rules: certification, secure keys, guest passes, school and court permissions (`mother-of-learning/WORLD_BRIEF.md:19`). The time loop is documented as a world law that stays home (`CHEAT_COSMOLOGY.md:50,94`) | Partial: institutions and the loop | Follow the book. Law content is institutional permission and the loop's own rules; nothing else invented before the source is checked |
| Proto23 village, original-derived, live | Property deed, guest agreement for cottage access (`proto23/WORLD_BRIEF.md:18`) | Social law only | Deeds and agreements as records; no law powers |
| Jujutsu, book candidate (not selected) | Binding vows with uncertain penalty, birth restrictions, vow-built domains, the rule-adding game, an oath-keeper NPC (`jujutsu/WORLD_BRIEF.md:56-60,72,77,176-189`) | Strong: the source runs on vows and rules | The law path's combat (prohibitions, disclosure, rule games) fits here first, following the book with E8D's J1 to J10 corrections. Canon names in a private pack; public build uses original names (`:9-13`) |
| Proving Ground, original test world (proposal) | A vow table for signing, keeping and breaking (`proving-ground/WORLD_BRIEF.md:31`) | As a test bench | Test law combat here: a prohibition zone, a command contest, a sentence, logs |
| Bleach, book candidate | Secrecy and duties, institutional authority, a crossing contract (`bleach/SOURCE_LEDGER.md:28`; `CAMPAIGN.md:145`) | Not yet documented | Check the source before adding anything (sources first) |
| Elden Ring, franchise candidate | An original local funeral-custody law with registry and seals, stated as "not a universal law" in canon (`elden-ring/CAMPAIGN.md:17-19`); authority disputes, retrieval contracts | Partial, local and original | Keep the funeral law local; anything on the source's own order themes waits for a source check |
| Fallout, franchise candidate | Faction standing with duties, a repair court, purchasing contracts, a distribution charter (`fallout/CAMPAIGN.md:40,69,119`) | Civic only | Courts and charters as social law |
| Harry Potter, franchise candidate | School and registry recognition, guardian permission; "exact wizarding law is not checked here" (`harry-potter/SOURCE_LEDGER.md:14,26`) | Not yet | Check the source first |
| Naruto, franchise candidate | Summoning contracts as a documented but unresolved source concept; not to be fabricated (`naruto/SOURCE_LEDGER.md:56,80`) | Partial | Resolve from the source before using E8D contract slots |
| Skyrim, franchise candidate | A repair compact with authority disputes, local leases, broken promises recorded (`skyrim/CAMPAIGN.md:43,174,226`) | Civic only | Social law; the source's own oath and faction themes wait for a source check |

**What this means:**
- **Right now, law powers have a lore home in two places**: Paradise
  (contracts and judgment by the hub's system) and the JJK candidate (vows
  and rule games). The Proving Ground is the test bench.
- **Everywhere else, law is social**: ledgers, deeds, charters, courts and
  promises, handled by people and records, which the home world already
  has in some form.
- **A reality-bending law power elsewhere** is an outlier (rule 12) or
  something carried in from another world (rule 5). The host world's lore
  decides how it meets local rules (meeting modes above).
- **Sources first** for book and franchise worlds: several rows say
  "check the source", and those checks come before any law content.

## More to consider (round 2)

- **Bureaucracy as gameplay**: forms, offices, delays, bribes, appeals.
  A celestial court can be a dungeon of paperwork.
- **Informants**: whoever reports you to heaven or a court is a target for
  bribes, silence or friendship (the Kitchen God pattern).
- **Champions and stand-ins**: someone else fights or swears for you, with
  their own stake.
- **Price lists for harm** (wergild): an economy of injury that ends feuds
  or fuels them.
- **Sanctuary and asylum**: places and people that shelter the hunted, and
  what they ask in return.
- **Testing guests**: hospitality laws where any stranger may be a god,
  a spy or a test (E7 disguise).
- **Laws on things and animals**: an item judged for a death, a wolf put on
  trial, a cursed sword exiled.
- **Two philosophies clashing**: a strict-law empire next to a
  virtue-and-ritual kingdom; same crime, different outcomes.
- **The dead as plaintiffs**: in worlds where the dead stay or are judged,
  victims testify.

## Vocabulary additions

Entity kind `law` with fields `kind`, `strength` (`absolute`, `strong`,
`tendency`, `custom`), `reason`, `scope`, `enforcement`, `exceptions`,
`discovery`, `history`, `tier` (`flavor`, `soft`, `hard`); entity kind
`world_will` with `tastes`, `attention`, `mood`, `tools`; per-audience
fact `profile.<audience>`; meeting modes `host`, `tier`, `bubble`,
`paradox`, `negotiated`, `converted`; currency `authority`; tags `lawless`,
`rigid`, `forbidden:<act>`; law combat kinds `prohibition`, `truth_field`,
`command`, `sentence`, `balance`, `exemption`, `precedent`.
