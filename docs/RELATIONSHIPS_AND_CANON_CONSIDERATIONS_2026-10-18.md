# Relationships, canon characters and world events: considerations, 2026-10-18

Claude, 2026-10-18. A palette, not a spec. Nothing here is selected for a build.

Weibao (2026-10-18), after story palette rounds 12-14: "other little world aspects
and more? Changing stuff that happens in a world, like becoming naruto's friend and
then causing a chain of events based on that? we might need a separate chat work on
relationships and canon and more?"

This doc is that separate home. No relationships considerations palette existed
before it; the [2026-10-10 relationships research](research/relationships-2026-10-10/REPORT.md)
is a research record (code audit, mature-systems survey, layer model L1-L7) and
stays the reference for the bond model. This palette adds what that research did
not cover: bonds with canon characters as a cause of canon change, the chains that
follow through the canon cast, and the small daily texture bonds create.

Rules applied: AD5 (anything possible, reasonably), AD6 (means decide, both ways),
AD22 (firm lines are save integrity and real-world guardrails), AD24 (players
choose pursuits), AD25 (threats from actual causes), AD33 (NPC-heavy work
deprioritized; slices sequence it), AD38 (things work by how they work), OD7
(natural course), OD8 (canon corrects itself only through a world mechanism),
[P13](gm/dispatch/procgen-2026-10-13/p13/REPORT.md) F1-F5 (F3: reassigning a canon
role needs an actual cause), rulebook 5 (carriers across lives and worlds),
rulebook 6 (readings can be wrong), sealed secrets by ID. Code prefix `RL` plus a
section letter; RL1-RL35 (survey) and RLX are already used elsewhere and are not
reused.

## What already exists (read, not restated)

| Owner | Covers |
|---|---|
| [Relationships research REPORT](research/relationships-2026-10-10/REPORT.md) | Five separate relationship stores in code (F1), write-mostly axes (F2), consent precedent (F6), layer model L1-L7 (familiarity, opinion, trust, role-relations, memories, shared history, obligations), offline rule, carriers across lives |
| [Mature systems survey](research/relationships-2026-10-10/MATURE_SYSTEMS_SURVEY.md) | RimWorld, CK3, Sims, Stardew, Persona, Wildermyth and more; RL1-RL35; bloat and chore complaints |
| [E3 living people](emergent/E3_LIVING_PEOPLE.md) §9-10, §13-14 | Opinion and typed memory on the directed ledger; gossip with distortion; named enemies; acting in character while away |
| [Characters and world events](CHARACTERS_AND_WORLD_EVENTS.md#favorability-and-encounter-driven-follow-ups-2026-10-02) | Trust, respect and grievance as separate tracks; encounter-driven follow-ups |
| [Story palette](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md) | G1-G6 social web, AI family, AJ promises; BR6 NPCs live tropes; BV5 chains hop between people; BX6 plan clocks; BX8 joining a canon arc; CA1 event dossiers; CB1-CB12 changing canon |
| [Timelines](TIMELINES_AND_DIVERGENCE.md) | Inertia inputs ("disturbance spreads along relationships"), ripple reach dial (default: connected people), edge cases for saving or killing canon characters, information hazard |
| [Companions palette](COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) | C1-C13 bond tracks, including companions' opinions of each other (C13) |
| [Agency, relationships and aftermath](worlds/deeper-interactions-audit-2026-10-13/03_AGENCY_RELATIONSHIPS_AND_AFTERMATH.md) | Mechanism-specific social consequences, enthrallment aftermath, closure precedent |
| [Living beside protagonists](research/LIVING_BESIDE_PROTAGONISTS_2026-10-10.md) | Premise families P1-P10; canon clock; foreknowledge states; sticky great events versus fragile details |

**Baseline (checked 2026-10-18).** `src/simulation_contracts.js:218` still holds a
directed `relationships` ledger; `src/simulation_effects.js:195` exposes its axes as
`relationship.<axis>` facts and `:333` is its writer. No source file carries a
canon-status field or a need profile. Nothing below is built, so the choices are
still cheap.

**Core position.** A relationship is a mechanism, not a meter. A canon character's
choices come from their needs, beliefs, means and ties. Befriending, rivaling,
mentoring, romancing or betraying them changes those inputs, so their choices
change by how they work (AD38), and every canon event that rested on the old inputs
becomes a lever (CB1). Change then travels outward along *their* ties, fading with
distance, which is exactly the Timelines ripple path.

## RLA. What a bond holds

The L1-L7 layers are the store. These rows add what canon characters need from it.

| Code | Idea | Notes |
|---|---|---|
| RLA1 | **Directed and lopsided.** Naruto may count you as his best friend while you think of him as a neighbor's kid, or the reverse. Each side holds its own regard, trust and reading of the other. | Directed ledger already supports this. Lopsided bonds are story fuel (unrequited loyalty, a protégé who idolizes you). |
| RLA2 | **What they believe about you is separate from how they feel.** A friend can like you and wrongly think you are a spy, or trust you without knowing what you are. | AD6 and P13 F4: belief, basis and date kept apart from regard. |
| RLA3 | **Shared history they can cite.** Typed memories (the day you shared lunch when nobody would sit with him, the spar you threw) come back in their lines and choices years later. | L5/L6. A memory that never gets cited expires early (REPORT §3). |
| RLA4 | **Role-relations are world-typed.** A rival in a shinobi village, a sworn sibling in xianxia, a House friend at Hogwarts and a contracted partner in Chainsaw Man each carry that culture's duties, rituals and costs. | World pack data on L4. Same engine, different social law. |
| RLA5 | **Bond tempo belongs to the person.** Someone starved of acknowledgement opens fast and clings; someone guarded by grief or pride opens slowly and tests you. | Tempo reads the RLB need profile and traits, not a global rate. |
| RLA6 | **Witnessed dreams are promises.** Hearing someone's stated dream ("I'll be Hokage") and believing in it is a social act with weight. They remember who believed early. | Opens an AJ1 promise on the thread registry without either side saying "I promise". |
| RLA7 | **Readable by means.** You see their feelings toward you only as well as your means allow: plain impressions by default, more with empathy skills, sensing techniques, long acquaintance or a cheat. | AD6. Reasons stay visible for your own side (RL32), hidden intent stays hidden. |

## RLB. Needs and loneliness gaps: what a bond acts on

| Code | Idea | Notes |
|---|---|---|
| RLB1 | **Need profile per canon character.** A short list of what they lack and want, by era: acknowledgement, family, a rival, a teacher, safety, purpose, revenge, being understood, rest. Naruto early in public canon: an isolated child who wants to be seen; his first acknowledgement is a turning point. | From memory of public canon; a content pass checks it against the [Naruto source ledger](worlds/naruto/SOURCE_LEDGER.md) and labels C/A/I. |
| RLB2 | **The gap is the lever.** Filling a need changes the behavior the need was driving. Personality stays: a loud prankster stays loud, but pranks for attention lose their reason once someone pays attention. | Change motive, keep traits. Stops "befriending turned him into a different person". |
| RLB3 | **Canon already assigned gap-fillers.** Canon names who answered each need (a teacher, a mentor, a team). If you get there first, the canon filler still exists, still meets them, and still matters, but the bond starts from a different place and weighs differently. | Default: two people can share one role. Displacing the canon filler needs an actual cause (P13 F3), such as the filler never meeting them because you changed where they were. |
| RLB4 | **Some needs a friend cannot fill.** A revenge drive, a curse, a duty or a clan obligation keeps pulling. A strong bond becomes a counterweight the character weighs against it, and the outcome comes from the weights and the world's own pull. | Strong canon pull acts only where the world has that mechanism (OD8). Elsewhere it is the character's own drive. |
| RLB5 | **Filling it wrong.** Dependency, a crutch, an indulgent guardian, a mentor who removes every struggle. The bond is real and still costs them growth. | Pairs with CB5 canon's missing work. Not forbidden; the world shows what went undone. |
| RLB6 | **Needs move with age and era.** The need at six differs from the need at twelve or after a war. Old fills can go stale ("you were there when I was a kid, but you don't know me now"). | Ties BW4 era weights and the canon clock. |
| RLB7 | **Need archetypes recur across worlds.** The isolated gifted outcast, the burdened heir, the last survivor, the avenger, the child raised as a weapon. A genre-family recognizer can propose a starting profile that a world pack corrects. | BW1 family layer. Illustrative; each canon character still needs its own sourced profile. |

## RLC. Canon events that depend on a relationship

Relationship nodes in the CA1 event dossier, typed so a content pass can find them.

| Code | Idea | Notes |
|---|---|---|
| RLC1 | **Bond-required nodes.** The event needs a tie to exist: a chase driven by friendship, a sacrifice for a teammate, a rescue mission someone volunteers for. Weaken or replace the tie and the event shifts. | CB1 lever, CB2 spectrum. |
| RLC2 | **Absence-required nodes.** The event needs someone to be alone, unheard or unloved: a rampage from isolation, a defection when nobody holds them back, a recruitment that preys on loneliness. These are the easiest levers for a friendly player, because just being there changes the input. | Canon is full of these. Many fan "fix-it" premises are this node in disguise (N7 guardian-of-Naruto in the private survey). |
| RLC3 | **Talk resolutions need their mechanism.** Canon conflicts settled by one person reaching another rest on a shared experience the speaker can draw on. If your earlier friendship removed the speaker's own loneliness, their mirror for reaching the next lonely person is weaker. Someone else may reach them (perhaps you), or that arc goes differently. | The cleanest second-order example: a kindness early removes a mechanism canon used later. CB5 missing work. |
| RLC4 | **Mentor-gated learning.** Techniques and lessons canon characters learn through a teacher depend on that teacher meeting them, liking them and having time. A bond changes who teaches what, and when. | Ties SLR teaching rules and the source ledger's trainable methods (N1-N3). |
| RLC5 | **Conflict nodes.** Some canon fights need a grudge, a rivalry or a belief about the opponent. Defusing the grudge early, or redirecting the rivalry to you, changes or removes the fight. | The fight's other needs (a tournament, a draw) persist (CB3). |
| RLC6 | **Bond weight feeds inertia.** A relationship node's disturbance is bond strength times the event's plot weight, divided by redundancy (how many other ties push the same way). | Timelines inertia inputs, made concrete for social causes. |
| RLC7 | **Relationship outcomes are a spectrum.** A friend still leaves but says goodbye, leaves later, leaves with you, stays and finds another route to the same drive, or stays and is miserable. | CB2 applied to bonds. The happy extreme is reachable and is one of several. |

## RLD. How a bond changes a canon character

| Code | Idea | Notes |
|---|---|---|
| RLD1 | **Decisions weigh ties.** When choosing, a character counts who each option touches. A friend in danger, a mentor's opinion or a rival's gaze changes the score of options, so the same person picks differently. | E3 §7 utility with tie terms. The decision is theirs; you change inputs. |
| RLD2 | **Your habits rub off.** They pick up your sayings, techniques, food, fighting style and values. You taught him to cook, so he eats something besides instant ramen. | Small and charming, and it is real influence: a technique you shared can change a canon fight. |
| RLD3 | **Arc drift, not arc replacement.** A bonded canon character keeps their core drives and canon pressures. Their arc bends: different timing, different allies, different scars. | Keeps them recognizable (the fan complaint is "mindless fix-it"). |
| RLD4 | **Which role you take sets the route.** Friend, rival, mentor, guardian, sibling-figure, rival-turned-friend, romance or enemy each push their arc differently: a rival accelerates growth, a mentor changes the technique tree, a guardian changes childhood, an enemy can forge them. | All reachable (AD5). RLJ4 bounds romance by age. |
| RLD5 | **Betrayal has a long shadow.** Betraying a canon character leaves a wound that reads into later choices: trust lowered for everyone like you, an arc darkened, and their circle hearing your name. | L3 trust drops hard; G5 gossip carries it. Redemption needs actual restitution (the elder precedent). |
| RLD6 | **They change you too.** Being close to them changes your reputation (the friend of the village pariah is shunned with him, then later known as his friend), your opportunities and, in character, your values. | Player autonomy (E3 §14) can read the bond. |
| RLD7 | **They have their own agency.** They can decline, test you, use you, keep secrets, outgrow you or choose someone else. Consent costs nothing to refuse (REPORT F6). | Canon characters are people, not quest givers (fan complaint: relatives treated as NPCs). |
| RLD8 | **Foreknowledge inside a friendship.** Knowing your friend's future is a burden and a choice: hide it, hint, warn or tell. Telling is an information hazard (Timelines), and a perceptive friend may notice you know too much. | Honesty becomes a bond axis. M2 foreknowledge states. |
| RLD9 | **Their power curve can change.** A friend who trains with you, eats better or is less hated may grow faster or slower than canon; one with less hardship may lack a breakthrough canon gave them under pressure. | Means and causes, not a canon-strength lock. C7 power-scale fidelity reads current state. |

## RLE. Chains through the canon cast

| Code | Idea | Notes |
|---|---|---|
| RLE1 | **Ripples follow ties.** A changed character changes how they treat the people they meet, who then choose differently. The relationship graph is the propagation path; the Timelines ripple reach dial sets how far it goes per world. | Default "connected people". Each hop needs a plausible dependency (OD7), not blanket butterflies. |
| RLE2 | **Worked chain (illustrative, Naruto).** Befriend him early, so he has a friend at the academy. His attention-seeking pranks ease (RLB2). His first acknowledgement in canon now lands on a less isolated child and weighs less (RLB3). Team assignment still follows the academy's own rule, so joining his team needs an actual cause: your scores fit the rule, someone with authority is asked, or the roster changed (P13 F3). His rivalry still finds the top student, because rivalry follows standing, not loneliness. Later, his speech to another isolated child draws on a loneliness he partly lacks, so that child's arc rests more on you or goes differently (RLC3). When the defection comes, two ties hold the would-be defector back instead of one (RLC6). | Each hop names its mechanism. Links marked as inference until the content pass sources them. |
| RLE3 | **Jealousy and displacement.** Your closeness shifts others: the rival who wanted his attention, the classmate with a quiet crush, the teacher who thought he was the only one. | Companions C13 at human scale. |
| RLE4 | **Introductions open doors.** A friend introduces you to their family, teacher and allies. People you could not reach become reachable because a tie vouches for you. | A bond is a means (AD6). This is how a nobody meets a legend. |
| RLE5 | **Others see your bonds as leverage.** Factions and schemers read attachments: a guarded weapon-child with a friend is a risk to some and a hostage route to others. | AD25: threats from actual causes. Your bond can make you a target. |
| RLE6 | **Plan clocks read relationships.** A canon villain's recruitment or manipulation step requires the target's dissatisfaction, isolation or grudge. Your bond changes whether that step's requirement holds. | BX6 with social requirements. |
| RLE7 | **Damping is normal.** Most of the cast does not notice; most chains end in a hop or two; distant regions keep their canon. | Sticky great events versus fragile details (M3). |
| RLE8 | **Grief chains.** Deaths drive canon growth. Saving a mentor keeps their bond going and removes the grief-driven push; losing someone canon kept alive starts a grief chain canon never wrote. | Timelines edge cases plus CB5. |

## RLF. NPC-to-NPC relationships

| Code | Idea | Notes |
|---|---|---|
| RLF1 | **Canon ties as data.** Teams, families, rivalries, old friendships, debts and grudges among canon cast live in the dossier with canon-status labels and era. | One authority with the person record (RLJ1). |
| RLF2 | **Canon ties have their own natural course.** Friendships form, sour and mend on canon's calendar unless something changes them. | OD7 for relationships. |
| RLF3 | **You can introduce, reconcile, divide or matchmake.** Bring two canon people together early, mend a rift, start a rivalry, or tell one a truth about the other. | Truths canon reveals late are public twists (not sealed) but still follow the spoiler dial (BX9). |
| RLF4 | **Original NPCs bond with canon cast.** A generated shopkeeper befriends a canon teacher; a generated child joins a canon friend group. | P13 F2: original background people can matter by receipts. Offscreen pairs run at aggregate detail (AM). |
| RLF5 | **Loyalty conflicts.** Helping one friend hurts another; two of your friends become rivals; your mentor and your best friend's family are feuding. | The richest small dilemmas come from overlapping ties. |
| RLF6 | **Relationships die with people.** A death ends bonds, starts grief, shifts guardianship and inheritance, and leaves objects and places with meaning. | RLE8 and H1 place memory. |

## RLG. Small daily world aspects bonds create

| Code | Idea | Notes |
|---|---|---|
| RLG1 | **Routines.** A usual training spot, a regular meal stall, a walk home. Routines are schedules others can learn, so rumors, friends and enemies know where to find you. | C4 offscreen schedules. |
| RLG2 | **Places become yours together.** The spot where you first sparred, the bench where they told you their dream, the roof where you watch fireworks. | H1 place memory for pairs. |
| RLG3 | **Gifts with meaning.** Per-person tastes, gifts that carry memory, handmade gifts from your own crafting, gifts that later matter in canon (a charm that blocks a strike). | Crafting and making feed relationships (BW3 glue). |
| RLG4 | **Shared meals.** Who cooks, who pays, who is always broke; food preferences; eating together as the cheapest warm scene. | BR5 scene-scale tropes. |
| RLG5 | **Rumors about the pair.** "They're dating", "he's a bad influence", "she's the only one who visits him". Gossip travels real edges and gets it wrong. | G5 and E3 §10 distortion. |
| RLG6 | **Names and address change with the bond.** Nicknames, honorifics dropped, inside jokes, a shared catchphrase. | BA how people address you. |
| RLG7 | **Small favors.** Watch my place, water my plant, cover my shift, walk my little brother home. Each is a tiny promise kept or broken. | AJ1 at scene scale; low stakes, high warmth. |
| RLG8 | **Dates that matter.** Birthdays, anniversaries of a death, festivals spent together, the day you met. | Q1 anniversaries, CA9 recurring institutions. |
| RLG9 | **Letters while apart.** Time skips, training trips and missions become letter threads, a natural idle fit: your friend's travels arrive as mail. | Idle return letters (P16) with a person's voice. |
| RLG10 | **Household overlap.** A spare key, borrowed tools, a shared pantry, sleeping over after a bad night. | Custody and owner inventories (party saving owners). |

## RLH. Across lives, loops and worlds

| Code | Idea | Notes |
|---|---|---|
| RLH1 | **Bonds cross a reset only through a carrier.** A soul bond, an heirloom, a vow, a letter, or a world that lets memories persist. | Rulebook 5; carryover is a save decision (BY5). |
| RLH2 | **Loop asymmetry.** In a regression or time loop you remember the friendship and they do not. Rebuilding it each loop can use a known shortcut that feels hollow, and knowing too much makes them wary. | Mother of Learning and Re:Zero shapes; M2 foreknowledge. |
| RLH3 | **Heirs inherit the social world you made.** Your friend's children know your name; your heir meets the grown-up version of the kid you fed. | Timelines heirs; BV7 generational chains. |
| RLH4 | **A friend who follows you between worlds.** A canon companion who travels with you meets another world's law through its own body and means. | BW5 cross-world residue; [world absorption](WORLD_ABSORPTION_RULES.md) when settled. |

## RLI. Overdo modes specific to relationships

Each has its own default and dial, alongside BS1-BS6.

| Code | Failure mode | Default and dial (in-world reason) |
|---|---|---|
| RLI1 | **Everyone loves you.** Additive regard drifts to universal adoration (CK3 bloat). | Clamped, dated reasons (L2), and competing ties: canon characters keep their own priorities and other people they love. |
| RLI2 | **Protagonist gravity.** Every canon arc bends toward the player. | Canon ties keep their weight by default; you are one tie among many. RLE7 damping. A world with a fate or halo mechanism can raise it openly. |
| RLI3 | **Fix-it flattening.** Removing all pain removes all growth and every hard choice. | Allowed. The world shows the undone work (CB5, RLB5) and the drives that remain (RLB4). |
| RLI4 | **Relationship chores.** Daily upkeep feels mandatory (Stardew). | Familiarity decays to a floor; trust does not decay while away; authored beats wait for presence (REPORT offline rule). |
| RLI5 | **Romance as the default endpoint.** | Friendship, rivalry, mentorship, guardianship and sworn kinship are full endpoints with their own payoffs. |
| RLI6 | **Canon cast as quest givers.** | RLD7: their own schedules, needs and refusals are visible through ordinary means. |

## ACT NOW

None. No code reads canon characters or relationship-driven events today.

## ACCOUNT FOR NOW

Constraints for anyone who builds bonds with canon characters or relationship
nodes in dossiers:

- **RLJ1, one relationship authority.** Extend the directed ledger rather than
  adding a sixth store; reconcile the five existing stores (REPORT F1) before canon
  bonds land. Canon characters use the same person record with a canon-status
  label. AR rules: namespaced save slice and migration when built.
- **RLJ2, causes, not scripts.** A bond changes an event only through the node's
  actual mechanism (CC2). Reassigning a canon role needs an actual cause (P13 F3);
  canon restores itself only through a world-supported mechanism (OD8).
- **RLJ3, belief apart from regard.** What a character believes about you, with
  basis and date, is stored apart from how they feel (AD6, P13 F4).
- **RLJ4, romance is adults only.** A real-world guardrail under AD22, not a
  per-world dial. Child-era canon (early Naruto, the early Hogwarts years, academy
  starts) offers friendship, rivalry, mentorship and guardianship; romance waits
  for adult characters. The ages come from the source, not from how the cast is
  drawn.
- **RLJ5, consent and agency.** Canon characters can refuse, leave or use you.
  Bonds forced by mind control, contracts or enthrallment work where the world's
  mechanism supports them and carry that mechanism's aftermath
  ([agency and aftermath](worlds/deeper-interactions-audit-2026-10-13/03_AGENCY_RELATIONSHIPS_AND_AFTERMATH.md)).
- **RLJ6, offline.** Bond numbers resolve in closed form on return; authored beats
  (confessions, betrayals, defections) wait for the player by default, so bonds do not
  break while away; a world whose rules say life moves on without you can dial that. Proposal consistent with the REPORT offline rule and the pause baseline.
- **RLJ7, seals.** A canon character's changed or randomized secret stays sealed by
  ID; their confiding in you is a discovery route, so the confided text lives on
  that route only. Trope and need tags never leak sealed truth (BT1).
- **RLJ8, sequencing under AD33.** NPC-heavy work is deprioritized. First proofs
  use existing Village actors; canon cast waits for a selected book world. This is
  a practical sequencing risk, not scope drift.
- **RLJ9, spoiler dial.** Relationship text that hints at a friend's future follows
  the per-world spoiler dial (C2, BX9).

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLK1 | Seam doc reconciling the five relationship stores into one directed-ledger authority, with consumers and a migration plan. | Opus-medium, medium doc | Names one authority per fact under AR, lists every current reader and writer by file, and a migration with a compatibility note. |
| RLK2 | Need-profile schema (RLB1) plus one Village example with need, gap, canon-style filler and what changes when filled. | Sonnet-medium, small | Profile doc; a headless check shows one card's eligibility changing when the need is filled. |
| RLK3 | Relationship node types (bond-required, absence-required, talk resolution, mentor access, conflict) in the CD1 dossier schema. | Sonnet-medium, small; waits on CD1 | Schema rows; lint rejects a relationship node with no named mechanism. |
| RLK4 | Naruto relationship dossier for one early era: canon ties, need profiles, relationship nodes with locators and C/A/I labels. | Luna-medium reader within AU budget, medium | Committed paraphrase plus private locators; every node cites its mechanism; spoiler dial noted. |
| RLK5 | Village proof: befriend one isolated NPC whose isolation drives a scheduled event; the bond shifts the event (CB2) and a second NPC reacts one hop away (RLE1). | Opus-medium, medium; waits on RLK1, RLK2, CD1 | Browser run from a fresh origin shows the shift and the second NPC's reaction citing the bond; save, reload and import keep it. |
| RLK6 | Ripple inspector (debug only): which ties carried a change, hop count and decay. | Sonnet-low, small | Dev panel lists hops with receipt IDs; nothing in player UI. |
| RLK7 | Small-life pack (RLG) for Village: shared meal, gift, routine, nickname, favor and letter cards reading the ledger. | Sonnet-medium, small; waits on RLK1 | Six cards, each citing a real receipt; none fires without its bond state. |
| RLK8 | Cross-world need-archetype table (RLB7) for the genre-family layer. | Sonnet-low, small doc | Each archetype cites at least three worlds, labelled illustrative or sourced. |

Suggested order, if Weibao picks any: RLK1 first, because every other row needs one
relationship authority; then RLK2 and RLK5 prove "a friend changes an event" on the
Village slice; RLK4 is the first book-world dossier when a world is selected.

---

## Round 2 (2026-10-18): canon change in general, how story keeps going, and the world after

Request: "This is interesting, but consider general changes to cannon and more, how
story progresses or how to implmenet subsequent world and more? more to consider?"

Existing owners not repeated here: [Timelines](TIMELINES_AND_DIVERGENCE.md) T1-T5
(identities, snapshots, causal events, parallel state, time cheats), its dials
(off-rails mode, ripple reach, healing rate) and "save the difference, not the
world"; the [OD7 writing chain](worlds/self-as-player-expansion-2026-10-13/NARRATIVE_AUTHOR_WORKFLOW.md#od7-writing-and-continuation-chain-2026-10-15)
W1-W5; story rounds 13-14 (BX6 plan clocks, BX7 divergent successors, CA1 dossiers,
CB1-CB12); [world absorption](WORLD_ABSORPTION_RULES.md) WA1-WA21; P13 F1-F5;
[E5 storyteller](emergent/E5_STORYTELLER_AND_FATE.md) pacing. All proposals.

**Core position.** A changed world needs three things the earlier rounds leave
implicit. First, each *kind* of change travels by its own channel, so propagation is
cheap and explainable. Second, the story keeps moving because the canon cast's long
goals and the world's underlying pressures survive the change, not because a script
resumes. Third, the world after is stored as a delta over an immutable canon
baseline, keyed by the pack's fact IDs, so later beats, later visits and later pack
revisions can all read it.

## RLL. Kinds of change and how each one travels

Round 1 covered people changed through bonds. Most canon changes are other kinds,
and each has its own path outward.

| Code | Change type | Travels by | Example (illustrative) |
|---|---|---|---|
| RLL1 | **A person's fate** (alive, dead, maimed, captured, never born) | Their ties, offices, plans and the jobs they did (CB5) | A mentor who survives keeps teaching, so a whole cohort's technique trees differ. |
| RLL2 | **A person's allegiance or location** | Who they now report to, whose plans gain or lose a piece | A defector who stays home leaves a villain's plan short one step's requirement. |
| RLL3 | **Custody of an object** | Owner, holder, carrier routes and who knows where it is | The relic is in your shop, not the vault, so the heist targets you. |
| RLL4 | **Information released early or late** | Knowledge channels: who told whom, with what basis (P13 F4) | A twist revealed at the start of an era instead of the end changes every choice made in between by those who heard it. |
| RLL5 | **A technique, recipe or idea arriving early** | Teaching and imitation diffusion: students, rivals who watched, written copies | A healing method spread a decade early changes casualty counts in every later battle. |
| RLL6 | **An institution or office** (who rules, which law holds, which school stands) | Succession, policy, budgets, appointments | A different leader changes who gets sent on which mission. |
| RLL7 | **Economy and supply** | Prices, stocks, trade routes, jobs (CA2 supply chains) | Cornering a war material moves which side can fight when. |
| RLL8 | **Timing alone** | Every dependent date window shifts; overlaps with other events change | An exam held a month later now falls in the same week as an invasion. |
| RLL9 | **Place and physical condition** | Routes, shelter, terrain, what can be built or reached | A bridge you built opens an invasion route canon never had. |
| RLL10 | **The premise itself** (an AU start, a changed birth, a different power) | The whole baseline: this is a different starting snapshot, not an intervention | A fan-style "what if X was born elsewhere" is a start choice (T2), with its own forecast. |

Each type needs a propagation adapter that names which fact IDs it can touch. That
keeps OD7's "plausible dependency, not blanket butterflies" mechanical instead of a
judgment call each time.

## RLM. How story keeps going after divergence

| Code | Idea | Notes |
|---|---|---|
| RLM1 | **Canon becomes a forecast, not a script.** After a change, canon's remaining beats are the world's expected course, each with a status (RLN3). The world compares against it; nothing forces it. | The off-rails dial's motive-driven default, made concrete. |
| RLM2 | **Long goals for the whole major cast.** BX6 plan clocks for villains, generalized: every major canon actor has standing goals and plan steps with requirements (become leader, avenge a clan, find a cure, keep the peace). After divergence, story is these plans meeting each other and you. | One mechanism drives both canon and off-canon story. |
| RLM3 | **World pressures outlast their canon release.** Wars, schisms and crises grow from accumulated pressures (inter-state tension, a scarce resource, a hidden faction's strength). A canon event released a pressure at a certain time. Stop that event and the pressure keeps building and finds another outlet, unless you also reduce its cause. | CB3 at world scale. These are in-world forces, separate from E5 storyteller pacing (OD7 keeps the two apart). |
| RLM4 | **Natural reconvergence.** Diverged history can drift back toward canon shapes on its own when the same root causes still hold: the war still comes because the resource is still scarce. This differs from OD8 correction, which needs a world mechanism, and from a forced script, which is not allowed. | Explains why canon feels sticky in strong-inertia worlds without a fate entity (M3). |
| RLM5 | **No compensating catastrophe.** If you truly solve a problem, the world does not invent a worse one to keep drama up (OD7). New conflict comes only from causes that already exist: other pressures, other actors' goals, canon's later threats still on the board. | Most book worlds have later threats offscreen already, so solving one arc rarely leaves a dead world. |
| RLM6 | **Successor arcs read character, not plot.** Generated arcs after divergence cast canon characters by their profiles (needs, traits, goals, ties), so a changed world still sounds like its people. Fan AUs that explore the same divergence are a palette for plausible shapes, never imported canon. | BX7 plus round 1 RLB. Keeps source law, fan premise and project counterfactual distinct (OD7 writing chain). |
| RLM7 | **Era transitions are pressure thresholds.** A series' eras (school, war, aftermath, new generation) begin when pressures cross thresholds or key goals resolve, not on canon's dates. A diverged world can reach the war era early, late or skip into a different era. | BW4 era weights then follow the actual era, not the calendar. |
| RLM8 | **Endings are states, not credits.** A canon finale has preconditions too. A diverged world may reach its own ending (the threat gone, peace made), then continues as a quieter life-sim world with the next generation's small pressures, or the player moves on. | Fits AD24 (no compulsory main quest) and the life-sim north star. |
| RLM9 | **Your chronicle becomes this save's canon.** Later visits, heirs, NPC histories and generated legends read the save's actual history as their reference, with canon kept as the "how it went elsewhere" layer that seers or travelers might know. | Ties U3 legends, BV7 generational chains, Timelines heirs. |
| RLM10 | **Unknown future is a feeling the player can have.** Past a big divergence, foreknowledge drops toward "none" for affected events, and the game says so through the notebook confidence, not a banner. | M2 foreknowledge states; CB7 knowledge spending. |

## RLN. Implementing the world after a change

| Code | Idea | Notes |
|---|---|---|
| RLN1 | **Baseline plus delta, keyed by fact ID.** The world pack (WA1, WA9) is the immutable canon baseline. The save holds a delta log of changed facts, each citing the receipt that caused it. Current state is baseline plus delta, computed on read. | Timelines "save the difference", given a concrete key: the pack's stable namespaced IDs. |
| RLN2 | **Dependency index.** Each dossier prerequisite names the fact IDs it reads. When a delta touches one of those IDs, the dependent events are marked for recheck; nothing else is reevaluated. | T3's "reevaluate affected events, not every molecule", as a lookup table. |
| RLN3 | **Event status vocabulary.** Every forecast event carries one status: `pending-canon`, `pending-changed`, `delayed`, `moved`, `invalidated`, `replaced`, `occurred`, `occurred-differently`. One authority (the A6 thread registry, CC1). | Gives inspectors, recaps and foreknowledge one thing to read. |
| RLN4 | **Recheck when it comes close.** Marked events recheck their prerequisites when their date window approaches or the player heads there (CA10), not at the moment of change. | Keeps idle catch-up cheap; distant events stay stubs. |
| RLN5 | **Generated replacements are frozen once made.** A replacement event records its generator, table revision, draw and cause receipts, and does not reroll on reload (BT2, GR rules). | Determinism and save integrity (AD22). |
| RLN6 | **Pack revision rebase.** When a world pack updates (a canon fact corrected, a new volume absorbed), a diverged save can rebase: facts the save changed keep the save's value, untouched facts take the new revision, conflicts are listed for review. Staying on the old revision stays possible (CC3). | Needs a save compatibility decision before code. Serial sources (C6) make this likely. |
| RLN7 | **Golden canon run.** A headless run with no player input reproduces canon order for the absorbed span. It is the regression test for any natural-course engine; one-perturbation runs then show each change's reach. | AD36: one meaningful invariant. Also a debug tool for authors. |
| RLN8 | **Compress the settled past.** Resolved events and their deltas fold into chronicle entries once nothing reads them, keeping only facts later dossiers or people still cite. | BK4 save budgets. Playable resume scope stays the T4 question. |
| RLN9 | **What-if runner for authors (debug only).** Run a dossier forward from the current save under a hypothetical change, in isolation, and show which events change status. | Distinct from CB12 player counterfactual reading, which needs an in-world means and cost. |

## RLO. Later and subsequent worlds

| Code | Idea | Notes |
|---|---|---|
| RLO1 | **A new world pack brings its story kit.** Beyond WA's K-parts: dossiers for its major events, cast goals and ties (RLM2, RLF1), need profiles (RLB1), world pressures (RLM3) and the propagation adapters it needs (RLL). Optional tiers, not gates (WA6 floor first). | Lets each later world change and continue the same way without new engine code (WA1). |
| RLO2 | **Templates get cheaper per world.** Event-type templates (CA11), change-type adapters (RLL) and need archetypes (RLB7) carry over; a later world mostly fills data. WA20's second-world proof should include one changed event. | Authoring cost is the real constraint on many worlds. |
| RLO3 | **Returning to a world you changed.** It resumes from your delta, advanced by its absence policy (T4), with the cast aged and their plans moved on. It does not snap back to canon. | Timelines rule 7 absent worlds. |
| RLO4 | **Same world, new run.** A fresh run starts from canon baseline unless a carrier or an explicit continued-history choice says otherwise (P13 F5). The previous run's chronicle can survive as a legend or a known "other branch". | Carryover is a save decision (BY5). |
| RLO5 | **Cross-world ripples need carriers.** Changing world A affects world B only through something that crosses: a traveler, an exported item or technique, a fame echo, a shared cosmic actor (rulebook 5). | Keeps worlds mechanically separate unless the player connects them. |
| RLO6 | **Worlds in sequence can answer each other.** A technique you spread in one world, or a companion who came along, can shift a later world's forecast once it arrives there through its law (BW5, RLH4). | The multiverse version of RLL5. |

## RLP. Ways canon change goes wrong

| Code | Failure mode | Default and dial (in-world reason) |
|---|---|---|
| RLP1 | **Butterfly overload.** Every small act rewrites distant events. | Change-type channels (RLL) and the ripple reach dial; distant facts change only through a named path. |
| RLP2 | **Arbitrary snapback.** Canon returns with no visible reason. | Only RLM4 shared root causes or an OD8 mechanism; either leaves a trace the player can find by means. |
| RLP3 | **Dead world after a fix-it.** | RLM3 pressures, RLM2 goals and canon's later threats keep causes alive; RLM8 lets a world rest when they really are gone. |
| RLP4 | **Flanderized cast off-canon.** Characters reduced to one trait once canon stops guiding them. | RLM6 casts by full profile; round 1 RLB needs and RLD3 arc drift. |
| RLP5 | **Foreknowledge decays wrong.** Too fast makes knowing canon worthless; too slow makes changes feel fake. | Per change type: RLL4 information spreads fast, RLL9 physical changes stay local. Healing rate dial per world. |
| RLP6 | **Contradictions with later canon.** A generated beat conflicts with canon content absorbed later. | RLN6 rebase lists conflicts; generated records keep their status label (WA3). |

## ACCOUNT FOR NOW

- **RLQ1, one delta authority.** World deltas live in one namespaced save slice
  keyed by pack fact IDs; event status lives on the thread registry. No feature
  keeps its own canon-changed flags (CC1, AR).
- **RLQ2, propagation through declared channels.** A change reaches another fact
  only through a propagation adapter or a dossier dependency (RLL, RLN2); this is
  how OD7's plausible-dependency rule gets enforced.
- **RLQ3, pressures are in-world.** World pressures (RLM3) are facts with causes,
  readable by means; storyteller pacing (E5) can choose which caused event to show,
  never add an uncaused one (RLM5, AD25).
- **RLQ4, golden run before engine.** Any natural-course engine ships with RLN7's
  canon run for its absorbed span as the regression it must keep passing.
- **RLQ5, rebase is a save decision.** RLN6 needs an explicit compatibility
  decision before code, like BY5.
- **RLQ6, seals and spoilers.** Forecast statuses and what-if output follow the
  spoiler dial; a changed or randomized truth stays sealed by ID in the inspector
  and recap text alike.

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLR1 | Change-type adapter table (RLL1-RLL10): fact kinds each touches, propagation path, decay. | Sonnet-medium, small doc | Every row names the fact ID families and one Village example. |
| RLR2 | Delta-over-baseline seam doc (RLN1-RLN4) mapped to `world_instances.js` local facts and the pack loader. | Opus-medium, medium doc; pairs with RLK1 | Names one authority per fact, the dependency index shape, migration, and which current owners read it. |
| RLR3 | Golden canon run for the Cyoria pilot's absorbed span. | Opus-medium, medium; waits on WAC8 | Headless run reproduces the recorded event order; one perturbation changes exactly the dependent events. |
| RLR4 | World pressure model (RLM3) for Village: one pressure, its causes, its outlets. | Sonnet-medium, small | Seeded run: blocking one outlet shifts the release to another; reducing the cause lowers it. |
| RLR5 | Cast goal ledger (RLM2) for three Village people with plan steps and requirements. | Sonnet-medium, small; waits on RLK2 | Seeded run where removing one requirement changes that person's next step. |
| RLR6 | Pack rebase design (RLN6) with a conflict list format. | Opus-high, medium doc; needs Weibao's save decision first | A worked r1-to-r2 example with kept, updated and conflicting facts. |
| RLR7 | World pack story-kit checklist (RLO1) as an optional WA extension. | Sonnet-low, small doc | Added to the absorption owner as optional tiers; WA6 floor unchanged. |

Suggested order, if Weibao picks any: RLR1 and RLR2 first, since they give every
change one path and one store; RLR4 and RLR5 make post-divergence story run on the
Village slice; RLR3 waits for the Cyoria pack conversion.

---

## Round 3 (2026-10-18): content for everything the changes change

Request: "what about everytihng that changes because of the changes? wont we need to
code new story points and possibilities and more>"

**Short answer.** Not one story point per branch. Branches multiply faster than
anyone can write, so the plan has to be that almost no content is written *for* a
branch. Content is written against state: a scene says what it needs (a living
mentor, a grudge, a festival in town) and fires wherever that holds, canon or not.
Hand-written work goes to a few anchors, and the gaps that remain are found by play
and filled for Weibao's actual save. He is essentially the only player (AD22), which
makes the last part practical in a way it is not for a commercial game.

## RLS. Five layers that cover a changed world

| Code | Layer | What it covers | Who writes it |
|---|---|---|---|
| RLS1 | **State-keyed content.** Storylets and scenes declare preconditions on facts, roles and relationships, not on "canon" or "branch X". A "grieving student" scene fires for whoever is grieving whoever died, in any timeline. | Most daily and side content, in every branch at once. | Authored once, reused everywhere. This is the main answer. |
| RLS2 | **Roles, not names.** Scenes cast by role slots (mentor, rival, ruler, healer), filled by whoever holds the role now. A changed world recasts its scenes automatically. | Leadership, teaching, missions, rivalries after a change. | Authored once per role (BR1 slot bundles, A1 casting). |
| RLS3 | **Grammar for new events.** Event-type templates (CA11), trope successors (BV1) and the cast's goal ledger (RLM2) assemble events that canon never had: a different war, a different election, a rescue for someone canon let die. | Big off-canon beats. | Templates authored; instances generated, frozen once made (RLN5). |
| RLS4 | **Authored anchors.** Canon beats, plus a few high-value "most likely changes" per world (the famous what-ifs fans write about), get hand-written variants. | The moments where generic text would feel thin. | Authored per world, sparingly. |
| RLS5 | **Gap filling for the real save.** When play reaches a state no anchor covers and the generic version reads flat, the game logs a content gap. An agent session between play sessions writes a tailored scene for that state through the OD7 writing chain (W1-W5), reviewed, then added as an ordinary state-keyed card. | Weibao's actual divergences, at the depth he actually reaches. | Agents, offline, on demand. |

The layers fall back in order: if no anchor fits, a template fits; if no template
fits, state-keyed generic content fits; if even that is thin, the gap is logged.
Nothing breaks, and the world never stops because a branch lacks writing.

## RLV. What keeps the amount manageable

| Code | Idea | Notes |
|---|---|---|
| RLV1 | **Most changes are small and local.** Damping (RLE7), change channels (RLL) and detail by distance (CA10) mean a change touches a few facts near you; distant canon stays canon and keeps its canon content. | The branch count looks huge on paper; the facts that differ in any one save stay small. |
| RLV2 | **Possibilities are verbs, not scripts.** New options come from existing verbs meeting new state: if the mentor lives, "ask for a lesson" works because the verb already exists and the person is there. | AD38. A new possibility needs new code only when no verb covers it (WA1). |
| RLV3 | **Characters carry their own voice.** Profiles (needs, traits, goals, ties, speech notes) let one scene sound right for whoever is cast. | RLM6; cheaper than per-character variants. |
| RLV4 | **Write for where play goes.** Content follows the actual save's frontier, not the full tree. Unvisited branches cost nothing. | Same idea as generating nested worlds on entry. |
| RLV5 | **Reuse across worlds.** Grief, succession, rivalry, rescue and reunion scenes work in every world with world-pack wording. | BW1 core layer. |
| RLV6 | **Thin is honest.** A changed event can be told briefly through a bulletin, a letter or a rumor (AQ, CA7) when it is far from you. Not every consequence needs a scene. | Matches how people actually learn about distant events. |

## RLW. Live generation, if wanted later

An optional language-model proposer could draft dialogue or a scene for an uncovered
state during play. The existing stance holds ([D1](EMERGENT_SYSTEMS.md),
[enemy protagonists](ENEMY_PROTAGONISTS.md)): it proposes text and intentions, game
rules validate and commit, accepted results are saved so reload never rerolls, and
mechanics stay deterministic. RLS5's offline route gives most of the benefit
without latency, cost or replay risk, so it is the proposed default.

## ACCOUNT FOR NOW

- **RLT1, content keys on state, not branches.** By default cards and scenes key
  on facts, roles and relationships rather than a branch or timeline ID. Where a
  world really tracks branches (time keepers, a traveler who knows which branch
  this is), the card keys on that in-world fact instead. A content lint can flag a
  precondition that names a branch ID directly.
- **RLT2, every precondition names facts.** So the dependency index (RLN2) can tell
  which content a change enables or retires.
- **RLT3, fallback is always reachable.** Each event type has a generic telling;
  missing authored variants degrade to it, not to silence or an error.
- **RLT4, gap log is a debug artifact.** It records state IDs and receipts only,
  stays out of player UI, and follows seals (sealed truths by ID only).
- **RLT5, tailored content is ordinary content.** Gap-filling scenes land as
  normal state-keyed cards with canon-status `authored` (WA3), so they also work in
  any later save that reaches the same state.

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLU1 | Content-gap logger (debug only): when an event resolves with only the generic telling, record state, receipts and event type. | Sonnet-medium, small | Seeded Village run logs a gap for a deliberately uncovered state; nothing in player UI. |
| RLU2 | Gap-fill workflow: from a gap log entry to a reviewed state-keyed card through W1-W5, as a repeatable agent task. | Opus-medium, small doc plus one worked example | One logged gap becomes a card that fires in that save and in a fresh seeded run reaching the same state. |
| RLU3 | Role-slot audit of existing Village cards: which name a person where a role would do. | Sonnet-low, small | List of cards with hard-coded names and the role each should cast. |
| RLU4 | Branch-key lint (RLT1) added to the storylet content checks. | Sonnet-low, small | Lint rejects a test card whose precondition names a timeline or branch. |

Suggested order, if Weibao picks any: RLU3 and RLU4 are cheap and keep new content
branch-proof from the start; RLU1 then RLU2 turn real play into the authoring queue.

---

## Round 4 (2026-10-18): writing ahead, fate as course correction, and AI over the long term

Request: "so do we need to prewrite everything in advance? more to consider? Using
something like "fate" to course correct? Live ai seems not competetent enough, maybe
long term stuff? more to consider?"

Builds on round 3 (RLS content layers). Owners: OD8 for canon correction,
[E5 §7](emergent/E5_STORYTELLER_AND_FATE.md) fate as a person-scope entity
(amplitude, bias, reserve, anchors), A4 coincidence budget, and the existing
proposer-only stance on language models ([D1](EMERGENT_SYSTEMS.md),
[enemy protagonists](ENEMY_PROTAGONISTS.md)). All proposals.

**Short answers.** No, nothing needs to be prewritten in full: write a fixed core up
front, then write ahead of the save by a horizon, the way a game master preps the
next session rather than the whole campaign. Fate is a good tool in worlds that have
it, and in those worlds it is also an honest way to keep branches few; in worlds
without it, the same convergence comes from root causes (RLM4) instead. Live AI is
not the authority now and may never need to be; the useful move today is shaping
every content need as a structured request, so templates, offline agents and, later,
a live model can all answer the same request.

## RLY. Writing ahead instead of writing everything

| Code | Idea | Notes |
|---|---|---|
| RLY1 | **Fixed core, written up front.** The world pack, canon anchors for the starting era, event-type templates, role scenes and the generic telling for every event type (RLT3). | Enough for any save to run with no further writing. |
| RLY2 | **Authoring horizon.** Between sessions, an agent reads the save's forecast (RLN3 statuses) and dependency index, lists what is reachable in the next stretch of in-game time, and writes for that. Like prepping the next session. | Writing tracks the save's frontier; unreached branches cost nothing (RLV4). |
| RLY3 | **Idle pace buys time.** An idle game moves slowly per real hour, and Weibao's sessions have gaps, so the horizon can stay ahead of play cheaply. Long offline jumps lean on the generic layer and the recap (P16), then the horizon catches up. | The genre helps here. |
| RLY4 | **The forecast says what is coming.** Pending events near in time and place, open threads, ripening pressures and cast plan steps due soon are the authoring queue. | One input, already planned in round 2. |
| RLY5 | **Two queues.** Gaps already hit (RLU1, played thin) and gaps about to be hit (RLY2, not yet played). The second is better: the content lands before he sees the thin version. | Same workflow, earlier trigger. |
| RLY6 | **Don't spoil the director.** Weibao is the player, so tailored content for his save is reviewed by another agent and lint, not by him, unless he asks. The prep notes stay in a private, gitignored folder like sealed files. | Extends the sealed-secrets rule to save-tailored prep. |
| RLY7 | **A save bible.** The horizon agent keeps a short continuity file per save: who is alive, who knows what, tone, running jokes, open promises. Every new scene is checked against it. | Bounded continuity notes (AU15) applied to one save's story. |

## RLZ. Fate as course correction

OD8 already allows canon to correct itself through a world-supported mechanism.
These rows make "fate" one such mechanism with parts a world can turn on, tune or
leave out.

| Code | Idea | Notes |
|---|---|---|
| RLZ1 | **World-scale fate works through coincidence.** Fate spends a reserve to bend chance toward the canon course: the right person happens to pass by, the letter arrives a day late, the weather turns. By default it does not raise the dead, create people from nothing or override skill outright; a world whose fate can do those things says so, with what it costs. | Puts fate on the A4 coincidence budget, which already exists. Substitutes still need their own motive and means (OD7). |
| RLZ2 | **Fate has a budget and a cost.** Its reserve refills by world law and drains with each correction. Big divergences can exhaust it, after which history runs free. | Gives "too big for fate to fix" a reason, not a fixed cap. |
| RLZ3 | **Fate leaves traces.** Corrections look like streaks of coincidence that perceptive people, seers or a divergence sense can notice. The player can learn that something is pushing back. | Rules out arbitrary snapback (RLP2). Readable by means (AD6). |
| RLZ4 | **Fate can be resisted, used or bargained with.** Outsiders, transmigrators or fateless people may sit outside it; some can ride its pull, stall it, or trade with whatever runs it. | Common in the source genre; each world says which. E5 §7.3 theft and sharing apply. |
| RLZ5 | **Per-world presence.** Strong in worlds whose source has it (heavenly will, a destiny that reasserts itself), weak or absent in others, where only root causes produce convergence. | OD8: do not import fate into a world that lacks it. |
| RLZ6 | **Fate also keeps branches few, honestly.** In strong-fate worlds most changes bend back, so more of the canon content stays usable and fewer new branches need writing. The saving is a real consequence of the world's law. | Fate as content economizer, where the world supports it. |
| RLZ7 | **Fate is not the storyteller.** E5 storyteller pacing chooses which caused events to show; fate is an in-world force that changes causes and can be met in-world. Keep them separate (OD7). | A world can have both, either or neither. |
| RLZ8 | **Fate scenes need writing too.** Its interventions are content: the near miss, the sense of being steered, the confrontation with whatever runs it. | Templates for "fate intervenes" (RLS3) keep this cheap. |

## RLAI. AI now and later

Agreed: a live model is not reliable enough today to decide story, and the design
should not need it to. The aim is to avoid locking it out either.

| Code | Idea | Notes |
|---|---|---|
| RLAI1 | **Content requests as data.** Every content need is a structured request: event type, state facts, cast by role and profile, constraints, tone, seals and spoiler dial. Templates answer it today, offline agents answer it between sessions (RLY2), and a live model could answer it later. Nothing else changes. | The one cheap, future-proof step. Distinct from `src/story_requests.js`, which holds Village supply requests, not content requests. |
| RLAI2 | **A ladder of AI roles by risk.** From safest: rewording a written line in character, small talk and barks, drafting a scene from a request, proposing an NPC's intention. Each rung is enabled only when it passes its own evaluation. Game rules still decide and commit every effect. | Proposer only, as the existing stance says; seeded saves stay reproducible because accepted text is saved. |
| RLAI3 | **Evaluation set from real play.** Gap logs and the horizon's requests, each with the scene a reviewer accepted, become a test set. A model rung turns on when its drafts match the accepted scenes on continuity, voice and rule compliance. | Turns "competent enough" into a measurable gate. |
| RLAI4 | **Offline agents are the near term.** Between-session authoring (RLY2, RLU2) uses AI where it is already decent: drafting with time to review, lint and a save bible. | Matches how this project already works. |
| RLAI5 | **Graceful when absent.** Every request has a template answer, so turning live AI off, or running offline without a network, changes texture, not function. | RLT3 fallback, extended. |
| RLAI6 | **Cost and privacy stay explicit.** Any live model call names its cost route and sends only the request's actor-accessible facts, never the whole save or sealed truths. | Matches the agent usage budget rules (AU) and seals. |

## ACCOUNT FOR NOW

- **RLAC1, the fixed core is complete on its own.** Any save runs to any state
  with templates and generic tellings alone; horizon writing and AI only deepen
  texture.
- **RLAC2, fate is a mechanism, not an authoring shortcut.** A world uses RLZ only
  if its law supports fate, with the OD8 treatment: what detects divergence, reach,
  cost, who perceives it and what resists it.
- **RLAC3, content requests are the seam.** New content hooks emit structured
  requests (RLAI1) rather than calling a template directly, so the answerer can
  change later without touching callers (AR one authority).
- **RLAC4, accepted text is saved.** Whatever answers a request, the accepted
  result is stored and never regenerated on reload (BT2, RLN5).
- **RLAC5, save-tailored prep stays private.** Horizon notes, save bibles and
  forecasts for Weibao's save live in a gitignored folder and follow seals.

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLAD1 | Content request schema (RLAI1) with a template answerer for two event types. | Sonnet-medium, small | A Village event emits a request and the template answers it; a stub second answerer can replace it without caller changes. |
| RLAD2 | Authoring-horizon workflow (RLY2, RLY4-RLY7) as a repeatable agent task with a save bible template. | Opus-medium, small doc plus one dry run on a test save | From a test save, the task lists the next reachable events and writes one card that later fires in play. |
| RLAD3 | World fate module (RLZ1-RLZ4) on the A4 coincidence budget for one fate-bearing world, behind a per-world dial. | Opus-high, medium; waits on a world selection and round 2's forecast | Seeded run: a small change bends back with a visible coincidence streak; a large one exhausts the reserve and stays changed. |
| RLAD4 | AI evaluation harness (RLAI3) using accepted gap-fill scenes. | Opus-medium, medium; waits on RLU2 having produced scenes | Report scores a model's drafts against accepted scenes on continuity and rule checks; no runtime integration. |

Suggested order, if Weibao picks any: RLAD1 first, since every later answerer plugs
into it; RLAD2 makes writing-ahead real; RLAD3 waits for a fate-bearing world;
RLAD4 waits until enough accepted scenes exist.

---

## Round 5 (2026-10-18): other course forces, outside meddlers, early endings and detours

Request: "MOre to consider? other things lioke fate and more? or external actor doing
stuff like that? More to consider? /more-to-consider in every aspect? We can also make
it so that certain actions might just end the run early? or make me play through
something else? more to consider?"

Owners not repeated: [time keepers and variants](TIME_KEEPERS_AND_VARIANTS.md)
(pruning, being hunted, a god of stories S1-S5, What If worlds, multiverse-scale
characters X1-X7); [part 22](worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md)
12.3 RS1-RS8 (ending, shelving and continuing a run by choice), 11 QB (book world
endings, QBC5 bad ending as a playable world) and 13 NT (when the next life starts);
E5 storyteller and fate; round 4 RLZ. Accepted direction that binds this round: AD19
(forgiving by default; harsher play optional or forewarned), AD20 (a locally
unwinnable situation may require going elsewhere or restarting), AD12 (the former
life pauses), AD14 (known-consequence warnings), AD16 (away time stops at important
choices), AD24 (players choose pursuits), AD28 (beaten obstacles stay beaten). All
proposals.

**Core position.** Fate is one member of a family: forces and outside actors that
care how a world's story goes. Model them all the same way, as actors with a goal,
means, reach, perception, cost and counters, running on the same goal ledger as the
canon cast (RLM2), only at a larger scope. An early ending or a forced detour is then
just what one of those actors, or the world's own law, does when its conditions are
met, with a cause the player could have read and, by default, a way back.

## RLFC. Forces like fate

Each is a per-world option. A world takes the ones its source or premise supports.

| Code | Force | What it wants or does | Typical worlds (illustrative) |
|---|---|---|---|
| RLFC1 | **World will** | The world itself notices outliers; it may tolerate, test, suppress or expel them. | Xianxia heavenly will, "the world rejects outsiders" isekai shapes |
| RLFC2 | **Tribulation and judgment** | A trial that arrives when power or sin crosses a threshold; passing it raises you, failing can end you. | Cultivation worlds |
| RLFC3 | **Karma** | Deeds accumulate weight that returns later as luck, misfortune, debts or rebirth placement. | Buddhist-flavored settings, many cultivation worlds |
| RLFC4 | **Prophecy** | A stated future that recruits people to make or stop it; it can fulfill itself because people heard it. | Harry Potter-style prophecy, many fantasies |
| RLFC5 | **Narrative causality** | Story shapes pull events (the third son, the last-minute rescue). | Discworld, story-power worlds (BR7) |
| RLFC6 | **Balance or equilibrium** | Power gained in one place is answered elsewhere; a hero rises, so a villain does. | Worlds with paired light and dark, Avatar-style cycles |
| RLFC7 | **Curse or doom** | A bound bad end attached to a person, line or place, with its own conditions. | Fairy tales, family curses |
| RLFC8 | **Entropy or decay** | The world winds down unless someone renews it. | Dying-world settings, Dark Souls-like cycles |
| RLFC9 | **Plot armor as a trait** | A person who survives what should kill them, because of a halo, a system or fate (E5 §7). | Protagonist-halo worlds, Fated Child |
| RLFC10 | **Counter-fate** | A force that wants divergence: chaos, a trickster principle, freedom itself. Canon pressure and its opposite can both exist. | Worlds where fate is contested |

Shared parts for every force, so one module serves all: trigger, reserve or budget,
reach, how it acts (coincidence, test, attack, reward, expulsion), traces it leaves
(RLZ3), who perceives it, what resists it, and what it costs. AD28 holds: a force can
send a new obstacle, but an obstacle already beaten stays beaten.

## RLEX. Outside actors who meddle

| Code | Actor | Goal and typical means | Notes |
|---|---|---|---|
| RLEX1 | **Keepers** | Stability: prune divergence, recruit useful variants | Already owned by the time keepers doc; listed for the family. |
| RLEX2 | **Audiences** | Entertainment: watchers who reward drama, risk and cruelty, sponsor favorites, and can withdraw support | ORV constellations are the clear example. Their incentive pushes toward danger, which is a reason the world gets harder. |
| RLEX3 | **Collectors** | Rare outcomes, unique people, branch specimens | They may want you to diverge, then take what you made. |
| RLEX4 | **System administrators** | Keep a system-world running to spec: patch exploits, audit anomalies, revoke privileges | LitRPG and system-apocalypse worlds. Can make AD22-style "fix the exploit" an in-world act. |
| RLEX5 | **Gods and patrons** | Worship, champions, territory, a bet with another god | Can grant, demand, abandon or trade you. |
| RLEX6 | **Other transmigrators and regressors** | Their own agendas with their own foreknowledge | Timelines "who changes history besides you". Rival players without being players. |
| RLEX7 | **Summoners and recruiters** | Need someone for a job elsewhere | The cleanest source of forced detours (RLDT). |
| RLEX8 | **The one who sent you** | Whoever arranged your arrival, with a purpose you may not know | Can ask, steer, collect a debt or end your stay. Its purpose can be a sealed secret (by ID only). |
| RLEX9 | **Authors and editors** | A god of stories (S1-S5) who wants a good story, not a fixed one | Owned by the time keepers doc; here as an actor with a goal ledger. |
| RLEX10 | **Your own other self** | A past, future or variant you who interferes | Timelines meeting-your-past-self proposals. |

Every outside actor gets: goal, means, reach, what it can perceive (AD6 applies to
them too), cost per act, standing with other actors, and what the player can do back:
hide, bargain, serve, evade, expose, defeat or replace it. Actors can conflict, so a
keeper and an audience can pull the same world opposite ways, which is itself story.

## RLEE. Actions that can end a run early

AD19 makes recovery forgiving by default, so an early end here means "this life's
story in this world stops", not "the save is lost". Ordinary reload stays available
unless the player chose a stricter setting.

| Code | Idea | Notes |
|---|---|---|
| RLEE1 | **Ends have causes in the world.** Breaking a fixed point and being pruned, failing a tribulation, breaking a vow with a lethal clause, speaking a forbidden name, a curse completing, expulsion by the world will, a patron revoking you, dying where revival is impossible. | Each names its force or actor (RLFC, RLEX) and its trigger. |
| RLEE2 | **Forewarned by means.** Before an ending can trigger, the world offers readable warnings: omens, a teacher's warning, a known law, a system notice, a fate trace, a known-consequence prompt (AD14). How explicit depends on the player's means and settings. | AD19's "forewarned". A hidden instant end belongs only to a stricter setting the player chose. |
| RLEE3 | **Strictness is the player's setting, danger is the world's.** A world can be lethal; whether a lethal end allows reload, rewind or only a next life is a separate setting (AD19, AD21). | Hardcore is opt-in. |
| RLEE4 | **Not every end is death.** Imprisonment for life, exile, becoming a god, being sealed, losing your identity, retiring, winning outright, being absorbed into the force you fought. | Each continues somewhere: a next life, a branch, an epilogue or a detour. |
| RLEE5 | **An end is a branch point.** The ended branch is archived with its chronicle (RS8). The next step can be a next life (NT1-NT10), a fresh run, a return to the last safe point, or a playable bad-ending world (QBC5). | Nothing about an early end forces a single follow-up. |
| RLEE6 | **Near-ends are better content than ends.** Most triggers default to a narrow escape with a cost: a scar, a debt to whoever saved you, a fate trace, a lost item. The full end stays reachable for the worst cases or stricter settings. | Same tension, more play. |
| RLEE7 | **Ending on purpose.** Some players want to trigger an end (to die for someone, to break the world on the way out). Chosen ends are a valid move with full aftermath for the world and the people left. | Player choice (AD24); feeds heirs and next lives. |
| RLEE8 | **No ends while away.** A pending end-trigger met during away time stops for the player's decision (AD16, RLJ6), unless the player chose otherwise. | Idle safety. |
| RLEE9 | **What carries.** An early end carries what the world, the cheat and the force say: memories by default (AD11), maybe a mark from the force that ended you, a debt, a title, a grudge held by the actor. | Rulebook 5 carriers. |

## RLDT. Being made to play something else

| Code | Idea | Notes |
|---|---|---|
| RLDT1 | **Detours have a carrier and a way home.** Summoned, dreamed, possessed, pruned into a void, dragged into a trial world, sent on a god's errand, swapped into another body. Each declares what goes with you, how you return, and what happens to your body and world meanwhile (AD12 pause by default). | Timelines T4 crossing rules apply. |
| RLDT2 | **Trial spaces.** A bounded world built to test you (a Nightmare, a secret realm, a tribulation dream, a dungeon trial), with its own rules and rewards. | Shadow Slave Nightmares and cultivation secret realms are the clear shapes. Cheap: they reuse templates and can borrow other world packs. |
| RLDT3 | **Play someone else for a while.** The canon protagonist on the other side of your change, your rival, the antagonist's next step, your heir years later, a companion's own errand. | A way to show consequences of your changes from inside them. Point-of-view rules from the identity owner apply (AD10). |
| RLDT4 | **Play the consequence.** After a big change, a short interlude where you live as someone your change affected: the villager in the war you caused or prevented. | Makes ripple effects felt, not just read. |
| RLDT5 | **Detours reuse other worlds.** A summons can land you in a world you already have a pack for, at a different era, so detours cost little new writing. | Ties RLO2: worlds feed each other. |
| RLDT6 | **Refusing, escaping, bargaining.** A detour is an event with options where means allow: resist the summons, cut the trial short at a cost, negotiate terms with whoever pulled you. | AD24 player choice within the world's reach. |
| RLDT7 | **What comes back.** Skills, items, wounds, companions, debts and news cross back by the carrier's rules; your home world reads your absence (RS5). | A detour is also a story for the people you left. |

## RLXA. Every aspect touched

| Code | Aspect | Consideration |
|---|---|---|
| RLXA1 | **Knowledge** | You learn a force or actor exists by its traces, by people who know, or by a cheat. Its real purpose can be sealed (by ID only). |
| RLXA2 | **Interface** | Forces and actors appear in the existing knowledge surfaces (notebook, people known), not a new panel; warnings ride the known-consequence prompt. Desktop first. |
| RLXA3 | **Saves** | An early end archives its branch; detours store home-world pause state and the carrier; force and actor state live in one namespaced slice with a migration when built (AR). |
| RLXA4 | **Idle** | Force budgets refill by world law over played time; outside actors act at aggregate detail while you are away and by default do not end a run offscreen (RLEE8). |
| RLXA5 | **Relationships** | Companions can follow you into a detour, be left behind, or be targeted by the actor that wants you. A friend can pay a fate debt for you. |
| RLXA6 | **Economy** | Bargains with forces and patrons have prices: offerings, service, memories, years, a favor owed. |
| RLXA7 | **Cheats** | Some cheats hide you from a force, read its budget, or let you spend its pull. The base cheat's relation to each force is per world (AD29). |
| RLXA8 | **Difficulty** | Outside actors are a reason the world gets harder without matching you automatically (AD25): an audience that wants drama, an administrator patching your trick. |
| RLXA9 | **Content cost** | Forces and actors reuse one module and the goal ledger; trial spaces and detours reuse templates and other packs; "fate intervenes" and "near-end" scenes are templates (RLS3). |
| RLXA10 | **Testing** | Each end trigger and detour gets a seeded scenario: warned, triggered, continued, saved, reloaded, imported. |
| RLXA11 | **Overdo** | Too many meddlers make the player a puppet. Per-world dial for how many outside actors are active, and most stay quiet unless something you did draws their attention. |
| RLXA12 | **Player agency** | Forces shape odds and situations; they do not take control of the player character outright, except through a declared mechanism (possession, a contract) with its own counters. |

## ACCOUNT FOR NOW

- **RLAC6, one actor model for forces and meddlers.** Fate, world will, keepers,
  audiences and patrons share one actor shape (goal, means, reach, perception, cost,
  counters) on the goal ledger; no per-force subsystem (AR).
- **RLAC7, forgiving by default.** Early ends are forewarned by means and reload
  stays available unless the player picked a stricter setting (AD19). A hidden
  instant end exists only under such a setting.
- **RLAC8, every end continues somewhere.** An end archives its branch and offers
  the follow-ups its world supports (RLEE5); nothing loses the save.
- **RLAC9, detours declare their carrier.** Each detour states what crosses, the
  way home and the home world's state while away, before any code (T4, AD12).
- **RLAC10, outside actors obey means.** They perceive and act only through their
  declared means (AD6); a meddler cannot know what it has no way to see.

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLAD5 | Force and outside-actor schema (RLFC shared parts, RLEX fields) as one actor shape on the goal ledger. | Opus-medium, small doc | Fate, a keeper and an audience each fit the shape without extra fields. |
| RLAD6 | Early-end catalog per force with trigger, warning route, near-end default and follow-ups. | Sonnet-medium, small doc | Every row names its warning (RLEE2) and at least two follow-ups (RLEE5). |
| RLAD7 | One Village near-end: a forewarned trigger, a narrow escape with a cost, and the full end under a strict setting. | Opus-medium, medium; waits on RLAD5 | Browser run from a fresh origin shows warning, escape and cost; strict setting shows the end and its continuation; save, reload and import. |
| RLAD8 | Trial-space detour template (RLDT2) with carrier, return and home pause. | Opus-medium, medium doc | Template filled for two worlds' trial shapes with carriers and return rules. |
| RLAD9 | Point-of-view interlude design (RLDT3, RLDT4) against the identity owner. | Opus-medium, small doc | Names whose body, knowledge and means the player uses, and what returns. |

Suggested order, if Weibao picks any: RLAD5 first so every force and meddler uses one
shape; RLAD7 proves a forgiving near-end on Village; RLAD8 and RLAD9 open detours.

---

## Round 6 (2026-10-18): when an action runs past content that is not built yet

Request: "I dont mean meddlers, but rather if the world has a force dedicated to
maintainting timelines or something etc, but those are interesting ideas, I meant
like doiong certain things ends the run early because the content isnt done yet?"

Correction: round 5 read "external actor" as outside meddlers. Weibao meant two
narrower things: a world force whose job is keeping the timeline intact (covered by
RLFC and the [time keepers](TIME_KEEPERS_AND_VARIANTS.md) owner, where a world has
one), and, mainly, a practical boundary: what happens when the player does something
the game has no content for yet. Round 5 stays as written; this round answers the
second question.

Existing owners: [choices that gate choices](worlds/CHOICES_THAT_GATE_CHOICES_2026-10-13.md)
G1 ("missing content should not masquerade as a world law"); part 22
[QBF1-QBF4](worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md) (canon frontier
for ongoing works); the inherited Village quest line, which already ends in a plain
"[To be continued]" task (`src/quests.js:388`); round 3 fallback layers and round 4
writing ahead. Naming note: "frontier" is already a world ID in code
(`base.frontier`), so this round says **content edge** to avoid confusion. All
proposals.

**Short answer.** Yes, a content edge needs handling, and for a long time it will be
common: the fallback layers of round 3 do not exist yet, and even when they do, some
states will be too thin to play. The better default is to **park** the branch at the
edge rather than end it: save it with a bookmark, tell the player plainly, offer
something else to play, and resume it when the content exists. Since Weibao is the
only player and agents write ahead of his save (RLY), a parked branch is a request
for content, not a loss. Ending the run is still available as an option. An in-world
cover (a timeline force stepping in) is used only where the world already has such a
force; elsewhere the edge is named as what it is, per G1.

## RLCE. Content edges

| Code | Idea | Notes |
|---|---|---|
| RLCE1 | **Kinds of edge.** Time (past the absorbed era or canon frontier), space (a region not built), cast (a canon character with no profile yet), divergence (a change whose consequences reach events with no coverage), mechanic (a verb the engine lacks) and depth (an activity past its built tier). | Each kind gets its own handling; one "content missing" bucket would hide which work is needed. |
| RLCE2 | **A coverage map.** Every dossier node, event, region, cast member and verb carries a coverage status: authored, template, generic, none. The dependency index (RLN2) can then tell, before an action resolves, whether its consequences land on "none". | Detection is cheap once coverage is data. Lint can report coverage per world. |
| RLCE3 | **Warn before, not after.** An action that would cross an edge gets a plain notice before it commits: "this goes past what is built; doing it parks this branch". The player chooses: do it and park, do something else, or (for a strict setting) do it and end. | Known-consequence warning (AD14) applied to content. No surprise loss (AD19). |
| RLCE4 | **Park, don't end.** A parked branch is saved whole at the edge with a bookmark naming the edge and the action that reached it. It resumes exactly there once content covers it; pack revisions rebase as in RLN6. | The better default for a solo player whose content keeps growing. |
| RLCE5 | **Something else to play meanwhile.** While a branch is parked, offer the nearest playable thing: the last point before the edge, another shelved world (RS2), an earlier era, a point-of-view interlude (RLDT3) or a fresh run. | The default leaves the player something to play while the branch waits. |
| RLCE6 | **Every edge hit is an authoring request.** The bookmark becomes a content request (RLAI1) with the highest priority in the horizon queue (RLY5), because the player actually wanted to go there. | The best possible signal for what to build next. |
| RLCE7 | **Thin continuation when it is good enough.** Where generic or template content exists but is thin, the player can choose to keep going on it instead of parking, with the chronicle marking that stretch as thin so it can be enriched later. | Round 3 fallback, chosen rather than imposed. |
| RLCE8 | **In-world cover only where the world has the force.** A world with a timeline-keeping force, a fate reserve or a world will can show the edge as that force acting (a ward that will not open, keepers arriving, fate closing a door), with the force's real traces and costs. A world without one shows the plain notice. | G1 and OD8 together: never invent a world law to hide unfinished work, because that would leave a false canon fact in the save once the content arrives. |
| RLCE9 | **Plain wording is a presentation choice.** The notice can be fully out of world ("not built yet"), a light frame ("the story beyond here is unwritten") or the in-world cover from RLCE8, set in presentation options. | Matches the fourth-wall owner. The plain notice is the default because Weibao is also the director. |
| RLCE10 | **Mechanic edges are just unavailable actions.** A verb the engine lacks does not appear, or appears disabled with "not built yet", rather than parking a whole branch. | Small edges get small handling. |
| RLCE11 | **Space and time edges can be soft and honest.** An unbuilt region's road is shown as not yet open; a time skip past the absorbed era stops at the last covered date. Either can use a real in-world obstacle only if that obstacle is true in the world anyway. | No fake blizzards. |
| RLCE12 | **No edges crossed while away.** Idle routines stop at an edge for the player's decision (AD16), like any important choice. | Idle safety. |
| RLCE13 | **Edges show on the map of what is coming.** The forecast (RLN3) and the divergence inspector (CD4) mark covered and uncovered futures, so a player who wants to stay inside built content can see where the edge is. | Inspection only; spoiler dial and seals apply. |
| RLCE14 | **Parked branches have a cap and a list.** A list of parked branches, oldest and most wanted first, with what each needs. The count is a per-player adjective, not a fixed limit. | Keeps parked work from piling up unseen. |

## ACCOUNT FOR NOW

- **RLAC11, missing content is not a world law.** No in-world force, obstacle or
  canon fact is invented to hide an unbuilt area (G1). In-world cover uses only a
  force the world already has (RLCE8).
- **RLAC12, edges warn first.** An action that would cross a content edge shows its
  consequence before committing; parking or ending is the player's choice (AD14,
  AD19).
- **RLAC13, parking is a save feature.** A parked branch needs a bookmark record
  and resume path inside the existing branch and archive owners (T4), with a
  migration when built.
- **RLAC14, coverage is data.** Coverage status sits on pack records and dossier
  nodes, so detection and lint read the same fact (AR one authority).
- **RLAC15, edge hits feed authoring.** Every parked bookmark is logged as a content
  request; the log follows seals and stays out of player UI beyond the notice
  itself.

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLAD10 | Coverage field on pack records and dossier nodes, plus a per-world coverage report. | Sonnet-medium, small | Lint prints coverage counts for the Cyoria pilot; a node with "none" is listed. |
| RLAD11 | Edge warning and park flow on one Village case: an action past the inherited "[To be continued]" step offers park, choose otherwise, or end. | Opus-medium, medium; touches persistence | Browser run from a fresh origin shows the warning, parks, offers an alternative, and resumes after a test content patch; save, reload and import keep the bookmark. |
| RLAD12 | Parked-branch list and its content-request log. | Sonnet-medium, small; waits on RLAD11 | List shows the bookmark, edge kind and wanted content; log entry matches the RLAI1 request shape. |
| RLAD13 | Edge-kind handling table (RLCE1) with default handling per kind. | Sonnet-low, small doc | Each kind names its notice, park or disable behavior and what content clears it. |

Suggested order, if Weibao picks any: RLAD13 and RLAD10 are cheap and make edges
visible; RLAD11 is the first playable proof, on the Village quest line that already
stops at "[To be continued]".

## Core-rule reconciliation, 2026-10-18

**RLAC16, stop policy is not foreknowledge (AD6–AD9, AD16/AD17).** Truth-driven
safety/content checks and player-known watch lists are separate inputs. Show only
perceivable aftermath or a plain implementation limit, not a hidden future event,
relationship state or uncovered-node count. Unknown threats can act without a
pre-event warning; selected recovery still follows AD19.

**RLAC17, detect a bounded content edge (AR7/AR8).** RLCE2's coverage map checks
the selected action's represented dependencies and authoring horizon. It does
not prove all emergent downstream consequences are covered or cheaply knowable.
A plain technical "not built" notice grants no fictional knowledge. Prefer an
atomic preflight boundary where possible; if a real earlier stage already
committed, parking retains its effects and resumes the remaining stage once
(G28). Settle unused time as pending or banked through one owner (G27).

**RLAC18, freeze follows the selected world policy (AD12/AD16).** Parking a
branch, changing the active world and setting a view aside are different acts.
A UI close alone does not freeze world truth, undo a relationship or launch a
substitute run. Offer alternatives with their stated clock/continuity effect.

Later case, only when parking is selected: a synthetic interrupted activity hits
one covered-to-unbuilt boundary, parks with its real stock and time receipt,
then resumes after coverage is added without duplicate consequences. Level:
strong runtime/authoring agent, medium; current-state persistence and rebuilt
1920×1080 plus 1366×768 evidence, with no sealed truth in public fixtures.

## Round 7 (2026-10-30): relationship fade and bounty autonomy from the similar-games surveys, proposal only

Source: [similar games beyond protolikes](research/SIMILAR_GAMES_BEYOND_PROTOLIKE_2026-10-30.md) F2 and F10; ranked in the
[absorption plan](research/ABSORPTION_PLAN_SIMILAR_GAMES_2026-10-30.md). Proposals (AD32). Both are NPC-heavy and AD33 defers
NPC-heavy work, so they are LATER.

ACCOUNT FOR NOW

- **RLU5, fade is a dial on familiarity, not on trust.** Veloren moves each stored feeling toward zero, and strong feelings
  fade more slowly (`rtsim/src/data/sentiment.rs`, raw-checked; its real-time constants are not copied). RLI4 already says
  familiarity decays to a floor and trust does not decay while away. So the only addition is the shape: the fade rate falls as
  the value grows, and a cap per person keeps the weakest ties from persisting forever. Default: off for the lead's circle.
  Dial: rate and cap per world. Reason: a world with a long memory (gods, grudge cultures) turns it down; a gossip town turns
  it up.
- **RLU6, a persistent tie list has a cap.** Veloren caps stored sentiments per NPC and drops the weakest. Our equivalent is
  a cap on stored acquaintance ties, never on kin or bonded ties. Default cap set by the world's population dial.

LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| RLU7 | Posted-task autonomy: a follower scores a posted task by reward, distance, danger and temperament, and the UI names the refusal reason (Majesty, developer-documented; formula unverified). | Sonnet, medium; AD33 later | A follower declines one task for a named reason and takes another; no new ledger beside PIR. Reopen when AD33 is lifted or a companion slice needs it. |
| RLU8 | Veloren "simulated NPCs drop queued actions": when the player is away, keep an explicit list of which NPC actions survive. | Sonnet, low doc | A short table in the away-ledger owner naming each action kind as survives, drops or resumes. Waits for the away-bank lane. |
