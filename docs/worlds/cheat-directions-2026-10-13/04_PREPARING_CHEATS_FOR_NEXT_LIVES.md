# Preparing cheats for next lives

2026-10-13. Research/design lane requested by Weibao: creating a cheat before the next life, death rewards, inheritance and deeper long-term possibilities. Every new mechanic below is a proposal. This note edits no shared owner or gameplay file and reveals no sealed truth.

## F1. Authority and current source

[Accepted rules](../../RULES_FROM_SCRATCH.md#what-no-free-carries-and-no-generic-conversion-meant) make carry and conversion per-edge dials. A permitted edge can carry something freely or use generic conversion. A carrier explains how continuity works; it does not impose an automatic tax. The [heir direction](../../RULES_FROM_SCRATCH.md#the-heir) concerns what was actually left behind, including records, people, standing, unfinished projects and exceptional carriers. [PROJECT](../../../PROJECT.md#standing-priorities-and-document-authority) keeps one realm and one prestige layer as the first milestone, prioritizes canon worlds with accessible AU variants, and permits revision with an explicit compatibility decision.

[Part 17](../world-depth-2026-10-13/17_CARRYOVER_AND_RETROFIT.md) remains a useful palette, but its carrier-plus-cost requirement and statement that heirs lose all goods are stale. Live source in `src/life_experience_host.js` calls `deriveHeirLeftovers` and `applyHeirLeftovers` from `src/heir_inheritance.js`. The latter handles money after the specific estate kit debt, counted belongings and chest contents, home access, written/taught lesson IDs, selected standing and obligations. That source seam supports a limited actual-leftovers route, not arbitrary cheat construction, resurrection or multiversal delivery. No source test, build or browser exercise was run by this lane.

The [library](../../CHEAT_LIBRARY.md) already supplies Heirloom Compact, Traveler's Pattern Book, Rebirth Ledger, Instinct Inheritance, Hall of Selves and World Deeds. These are design cards, not proof of a universal engine. [First cheats and death rewards](../FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md) distinguishes the player, legacy recipient, world aftermath, afterlife offer and death-triggered power. This lane expands those distinctions rather than making death a generic shop.

## P1. Treat preparation as a project that exists during this life

The core loop is **decide what should survive → discover a method → build a carrier → develop a useful function → test within available means → arrange delivery → continue or end the life → claim and develop it**.

A useful artifact can work now and become an heirloom later. A book can teach its author, then another reader. Preparation should improve the current life as well as the hoped-for future unless delayed payoff is the explicit fantasy. Death normally resolves a project or opens an authored transition; it does not manufacture missing work. Retirement, adoption, apprenticeship, handover and travel can deliver it while the creator still lives.

Creating, preserving, transferring, recognizing the recipient and enabling activation are separate problems. The strongest crafter may lack any reincarnation knowledge. A reincarnator may have perfect continuity but no ability to create a new power. Their combination is a meaningful breakthrough, not an implied starting capability.

## P2. What can be prepared?

| ID | Project | Carrier and recipient | First useful loop | Deeper variants |
|---|---|---|---|---|
| NL01 | Crafted exceptional artifact | Physical object for heir, stranger or returning soul | Design, gather, craft, test, store, retrieve | Modular core, self-repair, owner recognition, evolving tool, expendable version, mass production |
| NL02 | Record or training inheritance | Book, teacher, archive or preserved recording | Research, write, teach, practice | A manual that accelerates learning; an explicit magical method that grants ability; a deliberately incomplete puzzle inheritance |
| NL03 | Latent body or soul change | A supported body, lineage, soul or rebirth mechanism | Study, alter, stabilize, awaken | Instinct, memory, adaptation seed, future compatibility, inherited constitution; determine whether it follows soul, genes or both |
| NL04 | Ritual or transition anchor | Site, object, place or ritual process | Locate, prepare, charge, rehearse, maintain | Return to one location; selected life window; emergency resurrection; explicit new-world edge |
| NL05 | A system built by the character | Artifact, construct, pocket realm, soul inscription or distributed network | Prototype one function, provision, operate, revise | Appraisal, quests, simulation, training or automation; a quest interface alone supplies no reward-generating power |
| NL06 | Institution that cultivates exceptional people | School, guild, family, sect, workshop, office | Recruit, train, fund, transfer responsibility | A continuing research program, succession office, shared library, collective cheat or society-wide access |
| NL07 | Engineered opportunity | World state and causal intervention | Create a route, stabilize conditions, leave clues | Establish a school, cultivate a resource, protect a future teacher, arrange an auction, seed recoverable prototypes |
| NL08 | Compact with future people or selves | Contract and the enforcement/backing it actually has | Negotiate, define benefit, provide collateral, arrange recognition | Voluntary future-self aid, reciprocal legacy chain, debt transfer, revocable pact, competing inheritors |
| NL09 | A self-contained workshop | Mobile artifact or authored pocket space | Build, stock, document, maintain, assign | A persistent research laboratory, machine intelligence, apprentices, stored samples; its clock and laws remain explicit |
| NL10 | Reusable construction pattern | Blueprint, library design, seed or imprint | Design, validate, reproduce, adapt | Learn a cheat recipe without carrying finished goods; retain world-specific ingredients and required skills |

NL07 matters even when nothing crosses with the character. Your next life can find a world that a previous life improved. If it starts elsewhere or in a reset branch, that opportunity may be absent. The player unlocking a start also differs from a character obtaining its power.

## P3. Define who the preparation is for

| Identity | What can recognize them? | What should not be silently assumed? |
|---|---|---|
| Same soul, different body | An authored soul signature, retained token or matching ritual | Same memories, species, consent, aptitude or access to the previous estate |
| Descendant or next of kin | Genealogy, estate law, a will, social recognition | Same person, guaranteed powers, guaranteed loyalty or a desired body |
| Apprentice or appointed successor | Teaching history, appointment, entrusted object | Genetic inheritance or ownership of everything the founder possessed |
| Clone, copy or branch counterpart | Explicit identity rule for that mechanism | That the original is gone; copies may coexist and disagree |
| A stranger selected by conditions | A test, location, voluntary acceptance or random draw | The creator's intent grants control over the recipient |
| A later player character | The actual in-world relation above, if any | Player account identity automatically grants character access |

An heir may refuse the founder's plans, change the artifact, sell it or become an opponent. A returning soul might accept the useful tool while rejecting its former ambitions. An inheritance can exist without an heir, awaiting a finder. This preserves lone-wolf and heirless routes.

Recipient tests can be forged, mistaken or overly strict where authored. A successor who fails a bloodline lock might legitimately modify it; a future self without memories may fail an old password. More restrictive protection is not automatically better design.

## P4. The preparation record

A proposed preparation record should distinguish:

| Field | Meaning |
|---|---|
| Function and design version | What the created thing actually does; revision or fork ancestry |
| Carrier, backing and resources | Where it exists, what sustains its effects, what its supply can support |
| Recipient and recognition | Intended recipient, accepted substitutes, access and consent |
| Origin and destination | Exact world/branch/era; a destination can be a supported eligible set rather than a chosen guarantee |
| Boundary behavior | Full, partial, transformed, dormant or blocked transfer, including free transfer where allowed |
| Readiness and known evidence | Concept, prototype, tested application, preserved, deliverable, delivered, usable |
| Ownership and custody | Creator, controller, physical holder, claimants, transfer rights |
| Trigger and time | Voluntary handover, retirement, death, calendar event, encounter; absent-world clock policy |
| Failure and recovery | Known failure, detectable damage, fallback, salvage, unanswered uncertainty |
| Completion and claim state | Prevent accidental repeated transfer while supporting intentional duplication powers |

These fields specify behavior, not a request to build a general framework now. Readiness must be evidence-qualified: a successful local artifact test does not establish that it survives a previously unvisited universe. Uncertainty can be playable research. Known uncertainty should be visible without revealing sealed internal truths.

## P5. Iterative construction across lives

A long arc can be: first life records a discovery; second life builds a functioning device; third life adds safe portability; later lives make it available to other people or establish a research institution. Each life produces a useful partial result. There need not be fixed stages, tiers or a cap.

Different advances deserve distinct recognition: more strength, lower upkeep, better reliability, portability, easier teaching, independence from a patron, preserved consent, more recipients, better repairability. A weaker independent artifact can be the best preparation for a world where its provider cannot reach.

The successor needs enough means to continue the project. A blueprint without materials remains a blueprint; skill without a workshop may find another application. Conversely a finished usable artifact should not force every heir to redo its inventor's tutorial. A future life can specialize rather than maintain every past system.

An old design may be worth revisiting after a new discovery. Keep the provenance and actual revision, permit copying or remixing under its authored rules, and distinguish a blueprint fork from transporting another person's physical artifact. Worlds can have rival design traditions and descendants of abandoned prototypes.

## P6. Random starts meet deliberate preparation

Preparation can alter the next-life distribution in several ways: guarantee an eligible artifact arrives, reserve one compatible route, increase the chance of a region, add an inheritance lead, establish a family start, or provide nothing but a discoverable site. Which one occurs belongs to the mechanism.

Offer three compatible proposal profiles: unsteered random life; prepared life with declared constraints; explicit chosen/sandbox life. Preparation does not have to erase randomness. A cached artifact could reach a random suitable finder; the returning soul may be born far from it; a library can offer several prepared designs but limited starting resources. An all-access mode can deliberately waive those constraints.

A saved future plan should not silently guarantee the selected world unless its method actually has that reach. Show the character's warranted confidence: confirmed destination, eligible range, uncertain hypothesis. Persist the committed draw/claim so reload is not an accidental new construction or new recipient selection. Deliberate reroll powers remain valid authored exceptions.

## P7. Book worlds, AUs and multiverses

These are original adaptation proposals, not verified canon claims:

| Setting mode | Preparation that fits | What must be established |
|---|---|---|
| Canon-grounded book world | Native crafting, estate, text, teaching and institutions | Source-supported effects, available materials and actual inheritance/death rules |
| Harry Potter original-character branch | Original family object, workshop, research notes or continuing school | Provenance, local magical compatibility and source constraints; no assumption that crafting permits safe soul transfer |
| Harry Potter AU with reincarnation premise | Soul-carried design or self-created artifact awaiting a later incarnation | The AU's changed continuity rule, exact recognition and retained knowledge; treat the change as the premise |
| D&D selected rules world | Crafted treasure, spell research, community resources, or supported return method | Selected edition/setting/rules profile, requirements, spell or item limitations and recipient |
| Learning/loop world | Research progress carried through a source-qualified retention mechanism | Reset scope, who remembers, what happens to materials and other actors |
| Parallel AU universe | A counterpart artifact or branch-specific cache | Corresponding history is not physical transfer; a branch variant may never have built it |
| Traveling multiverse | Portable workshop or a delivered prepared gift | Actual crossing edge, destination laws, time, discoverability and backing |

A setting can have the scale of a full universe while the delivered campaign represents only a region. A small first workshop slice does not deny future multiversal reach. Conversely calling an artifact multiversal says little until its reach, access, fuel and effects are defined. Portability, target scale and destructive strength are separate axes.

Fanfiction-derived worlds need named continuity/version and source coverage. Similar premises should not collapse into one Harry Potter ruleset. A reincarnation AU and an altered-family AU can use some shared content while having very different preparation rules. Uninspected fan works supply ideas to research, not established mechanics.

## P8. Costs, failures and beings offering assistance

Costs are optional and varied: materials, time, attention, secrecy, opportunity, lifespan, maintenance, dependency or a freely granted benefit. No universal sacrifice requirement follows from crossing lives. Threats and debts carry only when their own rules permit it.

A being can help, compete, misunderstand, lie or provide a completely honest gift. Separate motive, truthfulness, competence, authority, resources and actual control. A benevolent being may lack the promised reach; an unfriendly one may provide a reliable limited service. There should be routes through craft, natural phenomena, discovery, cooperation and institutions without a cosmic sponsor.

Failure can leave a useful lesser item, intact notes, a dormant seed, a project for others to complete, a changed world or nothing. Damage, capture and changing law are specific consequences, not mandatory punishments. A soul project may raise identity questions: did it preserve the person, create an echo or overwrite someone? The chosen mechanism should answer this, including whether affected characters can understand and refuse it.

Preparation can change society. Teaching the design widely may make the power commonplace, while retaining its exceptional origin. Scarcity, monopolies and artifact theft are possible gameplay, but so are open teaching, charitable provision and cooperative production. A personal cheat can become public infrastructure.

## P9. Idle work and closure

Research, gathering, transcription, fabrication and maintenance are good queued activities when the character has actual resources and methods. Stop conditions include missing supplies, a question needing a decision, injury risk or a dependent stage not yet verified. Waiting does not solve a novel unknown merely because a progress bar fills.

Project clocks and character clocks can differ. An institution might continue after its founder dies; a frozen absent world might preserve an unfinished experiment; an explicitly advancing world can age, complete, alter or destroy it. A resurrection project with no continuing operator stops unless its carrier is self-operating. None of these clocks can be inferred from the label "idle".

Preparation should appear in the life-end manifest as created, preserved, assigned, deliverable and uncertain, then later as actually delivered or unavailable. The recap respects character knowledge and sealed routes. It should name meaningful unfinished work rather than awarding a generic currency for death alone.

## P10. Bounded candidate and future checks

Small candidate, not selected implementation: an original apprentice inheritance project in one existing realm. Create a useful artifact or written method, name an eligible recipient, leave it with actual custody, end or retire the life, claim it and perform one new useful action. The note's stronger reincarnation and multiverse ideas remain future designs, not requirements for this slice.

Before selection, identify the current shared writer and exact source seams. Source checks should cover actual owned quantities, alternate/no recipient, refusal, unfinished work, permitted transfer, blocked transfer, and one-time delivery versus deliberately reproducible designs. Relevant native proof then needs a rebuilt desktop/laptop origin, natural preparation and successor use, save/reload/import, failed-save behavior, and old-save compatibility. No private save should be used. Persistence and human acceptance remain separate gates.

This lane performed document reconciliation and bounded live-source inspection only. No runtime file changed, no test/build/browser proof was produced, and no new mechanic is accepted. The precise construction rules, next-life distribution, cross-world delivery policy and first playable selection remain open.

## P11. Creation and delivery require different completion records

A project can be created but unfinished, complete but undelivered, delivered but inaccessible, or usable by the wrong recipient. Represent those states rather than one “next-life cheat unlocked” flag. An artifact's unique identity follows its custody; a reproducible design can create multiple descendants with separate identities. A recipe fork is not a second copy of the original physical object.

Define when designation becomes binding, how it can be revised, and what happens to a pending transfer if the creator dies unexpectedly. A persistent institution may finish work after death only when its actual resources and operators support it. A blueprint can remain available even if the delivery plan fails. No route needs all these complications; authored simple transfers can resolve directly.

At claim time, validate the selected route and settle it once. A replayed receipt must not duplicate a unique object. Reproducible or unlimited grants instead record separate legitimate creation events. A later body's inability to execute a method should not erase the preserved method. See [worked continuity scenarios](08_WORKED_WORLD_AND_LIFE_SCENARIOS.md) and [coverage checks](09_COVERAGE_VALIDATION_AND_IMPLEMENTATION_ORDER.md).
