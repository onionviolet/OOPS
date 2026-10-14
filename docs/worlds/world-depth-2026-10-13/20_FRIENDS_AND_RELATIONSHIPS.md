# T: Friends, relationships and more (proposals, 2026-10-13)

Weibao (2026-10-13): "making friends with people? relationship stuff and more?"

Everything below is a proposal. Rows use Default + Dial + Reasonably (the in-world reason and its cost). Talk verbs (ask, confide, apologize, tease, introduce, refuse) belong to `S_dialogue_actions.md` in this folder; rows here say "talk verb (S)" and stop there.

Already covered elsewhere, so not repeated: the five interaction families and "keep only the axes a scene uses" (`docs/CHARACTERS_AND_WORLD_EVENTS.md:35-59`), companion kinds and the party proof (`:61-88`), favorability versus specific axes (`:403-415`), the romance layers and "friendship is a complete outcome" (`docs/LIFE_SIM_NORTH_STAR.md:1995-2021`, `:6728-6751`), per-person loyalty at succession (`:3345-3352`), "relationships reset unless something carries them" (`:3604-3607`), followers (`:1772-1782`), the rival chronicle (`docs/RIVALS_IDENTITIES_AND_FATE.md:231-275`), relationship-flip kits AK2 and QK1, PE2 relationship fields on person cards, PE5 memory receipts, RLX1-RLX11 relationship forms, and CL13 per-NPC memory across lives.

---

## 1. Code today (X)

| Code | Consideration | Why it matters |
|---|---|---|
| X1 | **One directed store exists.** `simulation.relationships[actor][target] = {axes, memories}` (`src/simulation_contracts.js:218`, validated at `:250`). Axes are open string keys with any finite value; memories cap at 32. Directed means Lio's view of you and yours of Lio are separate rows. | The data shape for trust, respect, fear and familiarity is already there. Most of RM below is content and views, not a new engine. |
| X2 | **Changes come from one effect type.** `{type:'relationship', actor, target, axis, amount, text}` (`src/simulation_effects.js:284-291`). A receipt keyed by cause, actor, target and axis stops a repeated delivery from farming favor (`:287-289`). | Anti-farm is built in. Gifts and greetings cannot grind a bar, which matches the "no daily gift chore" direction. |
| X3 | **Axes in use, all small integers:** trust (helper, party, exchange, promise, frontier campaign, nested content), respect (society, pursuit, skill expansion, frontier campaign), familiarity (body progression `src/body_progression.js:29`, observation, repository absorption, pocket realm), esteem (`src/repository_absorption_chains.js:39`), plus two counters on the dog (`scent_lessons`, `pin_retrievals`, `src/nethack_fieldcraft_content.js:89,102`). Some writes use amount 0 as memory only (`src/original_frontier_field_content.js:26`, `src/original_frontier_career_content.js:22`). | Eleven content owners already write relationships. Each picked its own axis word; there is no shared list yet (RM1 proposes one). |
| X4 | **Only negative writes are physical attacks.** `src/causal_story_host.js:248,259` drop trust by 2 for the victim and 1 for a witness. | Witness-aware harm exists. Insult, broken promise, jealousy and neglect have no writer yet. |
| X5 | **A second store lives in the chronicle.** `chronicle.relationships[id] = {axes, ties, memories}` with axes clamped to ±100 and typed `ties` (`src/chronicle.js:29-34`, `relationshipChange` at `:57-65`). The elder starts as `ties.role: 'acquaintance'` (`:78`) and gains `archiveDuty`, `dutyKept`, `grievance`, `successor` ties. | `ties` is the only place a relationship *kind* and obligations exist today. It is the working model for RM's kinds, but it serves one person. |
| X6 | **What reads relationship state.** The elder's lesson needs trust ≥ 1 and no grievance (`src/chronicle_ui.js:111`, `src/chronicle.js:201`); inheritance needs `dutyKept` and no grievance (`:191`). Fieldcraft asserts dog counters match lessons (`src/nethack_fieldcraft_facts.js:80-83`). Two consequence checks look up a memory by cause (`src/audit_remainder_consequences_facts.js:37,244`). `crush_social_views.js:94` filters Lio's memories for a view. | Only the elder has a real "relationship opens a door" gate. Everything else writes and displays. |
| X7 | **An unused gate seam.** The evaluator already exposes `relationship.<axis>` for the current target as a fact (`src/simulation_effects.js:155`). No content `requires` reads it (grep finds none). | Gating an offer on trust ≥ 2 is content-only work today. This is the cheapest lever in the codebase. |
| X8 | **People panel shows memories, one direction at a time.** `knownPeopleView` (`src/people_knowledge.js:12-106`) lists known people with details and memories; it reads the player's view of Lio and Iona (`:62,65`) but the helper's view of the player (`:53`), and hides private axes on purpose (`:29`). Rendered by `src/people_ui.js:4-29` in the adventure notebook (`src/adventure_notebook.js:71`). | The "people you know" journal exists and already avoids meters. It mixes directions without saying so. |
| X9 | **MoL cast has no relationship writes.** Nine people (`src/book_world_mol_content.js:7-17`) with attention budgets and attributed knowledge only; the after-arc quiet meal with Imaya (`src/book_world_mol_actions.js:73`) writes knowledge, not regard. | Cyoria people remember nothing between visits except what the player learned. A loop world wants exactly this for non-loopers, so it is a feature to keep as the default there. |
| X10 | **Village household is births, marriages and deaths.** `createVillageLives` (`src/npc_lives.js:5-23`) has six people with parents and spouse links, yearly news, and one added recruit (`:46-52`). No regard, no friendship between NPCs. | NPC-to-NPC ties exist only as family. Friendships among villagers are the next step (MF12). |
| X11 | **A favor counter exists as debt.** The patrol recruit can owe at most one favor, earned through a teaching term and spent on cover (`src/village_career.js:49-50,158`). | A working debt with a cap. It is a model for RM5 obligation rows. |
| X12 | **Rebirth wipes relationships both ways.** A transition with `reset: relationships` deletes the actor's rows and every other actor's row about them (`src/simulation.js:571,578`). | Matches "reset unless carried" for now. RX rows need a carrier seam here before any friend can remember a past life. |
| X13 | **Name reuse across owners.** "Lio" is both the household child (`src/npc_lives.js:13`) and the association porter (`src/party_content.js:8`); "Neri" is both a household birth (`npc_lives.js:14`) and the route apprentice (`src/pursuit_content.js:7`); "Iona" is both the patrol recruit (`npc_lives.js:49`, `village_career.js:135`) and the parcel clerk (`people_knowledge.js:65`). Different ids. | In a people panel, two Lios read as one friend. Either a deliberate "same person" decision or a display disambiguation is needed before friendship content leans on these names. |

---

## 2. Relationship model (RM)

| Code | Consideration | Why it matters |
|---|---|---|
| RM1 | **A shared axis vocabulary, open at the edges.** Default list: trust, liking, respect, fear, familiarity, debt (signed: who owes whom), attraction, rivalry, grievance. Dial: a world adds its own (HP life debt, SS bond, LOTM club standing). Reasonably: content can still write a custom axis, but the people view only words the shared ones. | X3 shows eleven owners inventing words. One list lets a people view, an heir screen and a gate read the same thing. |
| RM2 | **Shared history is the memories list, not an axis.** Default: "shared history" is counted from typed memories (meals, danger, work, secrets kept), with the kind tag on each memory. | Avoids a sixth number. "We survived the flood together" is a memory with a kind, and the view can say it in words. |
| RM3 | **What each knows about the other.** Default: a per-pair knowledge slice: your real name, your face, your power, your secret identity, your past life, your home. Reuses `simulation.knowledge` keyed by `person.<id>.` (already exposed at `simulation_effects.js:157`). | A friend who knows your Sequence is a different friend. LOTM masks, MoL loop secrets and SS True Names all hinge on this. |
| RM4 | **Kinds are ties, several at once.** Default: a person can be mentor and rival, or employer and friend. Kinds: acquaintance, friend, close friend, mentor, student, rival, enemy, family, found family, romance, partner, employer, employee, comrade, patron, ward, landlord, tenant, sworn sibling. Reuses the chronicle `ties` shape (X5). | One kind per person forces false choices. CK3 and Wildermyth both let roles stack. |
| RM5 | **Obligations are typed rows with an end.** Default: debt, promise, oath, life debt, apprenticeship term, lease. Each names who owes, what closes it, and what breaking it does. X11's favor cap is the model. | A fulfilled obligation closes cleanly (already stated in CHARACTERS); this adds that each kind closes differently. |
| RM6 | **Growth is by kind of event, with diminishing repeats.** Default: the first shared meal counts a lot, the tenth little, a new kind of shared thing counts again. The cause receipt (X2) already blocks exact repeats; this adds soft decay of repeats by memory kind. | Rewards variety of contact, which is how real friendships deepen, and keeps idle loops from grinding. |
| RM7 | **Drift while away.** Default: familiarity fades slowly with time apart; trust and respect hold; grievance fades slower than liking. Dial per world (frozen worlds freeze all of it, per RP11's freeze default). Reasonably: letters (RD9) slow the fade. | Coming back after ten years should feel like ten years. Freezing everything makes absence meaningless; fading everything punishes idle play. |
| RM8 | **Freeze points.** Default: a friend in a frozen world is frozen with it; a friend in a running world ages and moves on (CL13 owns the fade-with-age rule). Dial: a world clock ratio. | Ties RM7 to the existing per-world clock rules instead of a new timer. |
| RM9 | **Asymmetry is normal.** Default: their view of you and yours of them change separately (X1 is directed). A one-sided crush, a mentor who thinks less of you than you of them, a friend who thinks you are closer than you think. | RLX3 covers hidden one-way regard; this makes asymmetry the ordinary case, not a twist. |
| RM10 | **Moods and phases on top of the long tie.** Default: a short-lived state (annoyed this week, grateful today) that colors replies and fades in days. | A friend who is cross about a missed dinner should not lose long trust. A mood row keeps the long tie stable. |
| RM11 | **Thresholds are soft and per person.** Default: each person has a temperament (warm, guarded, proud, anxious) that shifts how fast each axis moves. A guarded person gains trust slowly and keeps it. | Same events, different people, different speeds. No universal heart count. |
| RM12 | **Kinds can change, with a remembered cause.** Default: friend to rival, enemy to grudging ally, student to peer, mentor to equal. The change writes a memory saying why. | Relationship arcs are the content. AK2 and QK1 flip at AU forks; this lets them flip in play. |
| RM13 | **Ending a relationship is a state, not a delete.** Default: estranged, broken off, divorced, outgrown, dead. Memories stay. | Grief, reconciliation and "we used to be friends" need the record to survive. |
| RM14 | **Groups have ties too.** Default: a friend group, a cohort, a household or a club holds a small group record (shared jokes, a meeting place, a standing night). | Friendship circles matter in HP houses, the Tarot Club, SS cohorts. Pairs alone miss "the group chat". |
| RM15 | **Pets and nonhumans use the same rows with fewer axes.** Default: familiarity, trust, fear only. The dog counters (X3) already sit here. | One model for the dog, an owl, an Echo and a spirit, with fewer dials. |

---

## 3. Making friends (MF)

| Code | Consideration | Why it matters |
|---|---|---|
| MF1 | **Repeated presence.** Default: being at the same place at the same time (PE3 schedules) adds familiarity once per day, capped. Idle routines count. Reasonably: you have to actually be there; a routine at the forge meets the smith. | The main idle-friendly route. Your routine choice decides who you get to know, which makes routine a social choice. |
| MF2 | **Shared work.** Default: a joint job (bench, patrol, harvest, research) writes a "worked together" memory and some respect; the quality of your part matters. | Matches CHARACTERS' "a cook can make a useful expedition meal". Respect from competence is distinct from liking. |
| MF3 | **Help in need.** Default: an NPC with an unmet need (PE4) is a window. Helping when it costs you counts more than helping when it is cheap. Reasonably: the cost is real time, coin or risk. | Need-based help is the strongest early bond and makes PE4 needs into friendship hooks. |
| MF4 | **Gifts that fit.** Default: a gift reads through the person's tastes, current need and history. A fitting cheap gift beats an expensive wrong one. Learning taste is discovery (LIFE_SIM 2008-2009). This adds: a gift they keep gains a memory each time it is used. | The kept gift is a small signal (UF4) and a late-game keepsake. |
| MF5 | **Remembering details.** Default: when the player uses a fact the NPC told them (a sister's name, a favorite tea), that is a bond event. Needs RM3 knowledge to be checkable. | Turns the notebook into a friendship tool. The player's own attention is the skill. |
| MF6 | **Keeping secrets.** Default: a confided secret is a test; keeping it while it would pay to tell builds trust. Telling it costs trust with that person and maybe gains it elsewhere. Talk verb "confide" is (S). | A secret kept is the cleanest trust event. Links to RLX10 leverage bonds. |
| MF7 | **Shared danger.** Default: surviving a threat together writes a strong memory for both and can skip stages (strangers become comrades). Dial: per world, danger bonds faster (SS, Soldier's Life) or slower (HP school, where danger is rarer). | War and dungeon worlds form bonds through danger. Their speed should differ from school worlds. |
| MF8 | **Shared meals.** Default: eating together is a small, repeatable bond event with diminishing repeats (RM6), and a cooked meal counts more than a bought one. Reuses existing meal items (MoL bread parcel, Village meals). | The cheapest daily social verb. It also gives cooking a social use. |
| MF9 | **Introductions.** Default: a friend can introduce you to their friend, which starts you at a warmer acquaintance and carries a bit of their trust. A bad act then reflects on the introducer. | Social networks grow outward. The introducer's reputation stake makes it matter. |
| MF10 | **NPCs start it.** Default: an NPC with a matching want, a shared trait or a debt to you can make the first move: an invitation, a question, a shared lunch spot. Reuses NPC initiative from CHARACTERS (`:57`). | The player should not have to start every friendship. Being approached is part of feeling liked. |
| MF11 | **Friendships that fail.** Default: incompatible goals, a slight, a betrayal, neglect or just drift can stall or end a bond. Failure writes a memory and sometimes leaves a mild grudge. Dial: how forgiving the world is. | A friendship that can fail is worth having. Failure also seeds rivals. |
| MF12 | **NPCs befriend each other.** Default: NPCs with overlapping schedules and compatible temperaments form ties on the yearly tick (`npc_lives` already ticks yearly, `src/npc_lives.js:33-38`). Their friendships make news ("Maia and the smith's wife now share a garden"). | The world has its own social life, and NPC ties give the player indirect routes (MF9) and stakes (RD13 jealousy). |
| MF13 | **Mixed or cold starts.** Default: some people start wary (you are foreign, a rival's friend, your body's predecessor wronged them per RLX5). Winning them over is its own arc. | Not everyone starts at zero. A cold start is a story. |
| MF14 | **Small talk is a cheap opener, not a grind.** Default: a short chat gives familiarity once per day per person and can surface one fact or need. Talk verbs (S). | Gives idle play a light social tick without making chat the path to deep bonds. |
| MF15 | **Bonds by competence display.** Default: a peer who sees you do something well (a duel, a craft, a spell) gains respect and maybe curiosity. Witness rules reuse X4's observer pattern. | Respect is earned in front of people. It also gives a reason to work in public. |

---

## 4. What relationships do (RD)

| Code | Consideration | Why it matters |
|---|---|---|
| RD1 | **Help and favors.** Default: a friend lends a tool, covers a shift, holds your stuff, feeds your pet. Each is an obligation row (RM5) with an end. | The everyday payoff. The favor cap (X11) shows how to keep it bounded. |
| RD2 | **Teaching.** Default: friends teach what they know, faster and cheaper than strangers; a mentor tie opens methods a stranger would refuse. The elder lesson already gates on trust (X6). | The clearest mechanical reward and already proven once. |
| RD3 | **Prices and terms.** Default: a merchant friend gives a small discount, credit, first look at stock or a quiet hold. Dial: a world where favoritism is a scandal. | Friendship touches the economy without a big bar. |
| RD4 | **Access.** Default: a friend gets you into a room, a club, a library section, a party, a family estate. Access is the friend's, so it can be revoked if they suffer for it. | Social keys instead of item keys. Ties into RLX6 and institution access in CHARACTERS (`:425`). |
| RD5 | **Warnings and rumors.** Default: friends tell you things first: a raid coming, someone asking about you, a price rise. Strangers tell late or not at all. Evidence status stays as in CHARACTERS (`:53`). | Information is the most valuable thing a friend gives in a dangerous world. |
| RD6 | **Rescue.** Default: a close friend or comrade can come for you when you fall, if they know and can reach you. They pay a real cost (injury, time). Dial: per world, rescue is common (party worlds) or rare (school worlds). | A defeat that a friend turns into a rescue is a memorable scene and a reason to have friends near danger. |
| RD7 | **Recruitment and companions.** Default: a friend is willing to join an activity; a hired hand needs pay. The companion party proof stays in CHARACTERS (`:76-88`). This adds: a friend's willingness and a hire's willingness are separate checks. | Keeps friendship from turning into a hiring discount. |
| RD8 | **Companions on activities.** Default: a friend can join a routine (gather, patrol, study) for a small speed or safety gain and a shared memory per session. They can refuse on a bad day (RM10). | Idle routines get social texture. Shared routines are the idle form of hanging out. |
| RD9 | **Letters.** Default: while away, friends write. A letter carries news, a request, a gift or a worry. Replying slows drift (RM7). Dial: worlds where mail is slow, censored or magical (owls, Tarot Club gatherings, Spell messages). | Gives absence a social channel and fits offline play: letters pile up while you are gone. |
| RD10 | **Inheritance and wills.** Default: a friend can be named in a will, guard a cache, or raise your heir. Per-person loyalty at succession is in LIFE_SIM (`:3345-3352`); this adds friends as executors who can be honest or not. | Friends are part of legacy, not only family. |
| RD11 | **Introductions outward.** Default: the more friends you have in a circle, the easier new ones come there (MF9). A friend's friend can be a mentor, partner or employer. | Social capital compounds, slowly. |
| RD12 | **Joint projects.** Default: two friends can start a shop, a club, a research line, a farm. The project has its own record and survives either one leaving, with a split. | Long-term goals other than power. Matches "a shared future, not a bigger bar" (LIFE_SIM `:5783`). |
| RD13 | **Jealousy.** Default: time and favors are visible. Two friends who both want your evening can resent each other or you. Romance rivals are in LIFE_SIM; this adds friend-jealousy, mentor-jealousy and sibling-jealousy. | Social time becomes a real budget. |
| RD14 | **Betrayal.** Default: a friend with a strong enough motive (debt, threat, ideology, love) can betray; the motive is visible in hindsight through memories and known needs. Dial: betrayal frequency per world (low in a cozy Village, higher in LOTM). | Betrayal hurts only if the friendship was real. Hindsight clues keep it fair. |
| RD15 | **Grief.** Default: when a friend dies, the player gets a mourning period: a short debuff or slower practice, a funeral event that draws other friends, a keepsake. The household death news (`npc_lives.js:10`) is the hook; a known friend's death gets a personal line. | Death of an unknown NPC is news; death of a friend is an event. That difference sells the bond. |
| RD16 | **Late-game reasons to keep old friends.** Default: old friends know you from before your power; they tell the truth when others flatter, keep your early places, raise your heirs, hold a grounding anchor (a friend counts as a reason to return to a world, LIFE_SIM `:2017`). Dial: old friends can also resent how you changed. | A strong returning character still needs people who are not impressed. That is the best late-game social content. |
| RD17 | **Debts both ways.** Default: you can owe friends, and they will sometimes call it in at a bad time. | A debt that arrives inconveniently is a story and a cost. |

---

## 5. Across worlds and lives (RX)

| Code | Consideration | Why it matters |
|---|---|---|
| RX1 | **Bring a friend, if they can come.** Default: a friend can cross with you only if their world allows it, they consent, and they have a reason. LIFE_SIM `:5561` states consenting companions carry; this adds the friend's own exit cost (job, family, the world's will). | Bringing someone is a sacrifice on their side. That makes it meaningful. |
| RX2 | **Friends who stay home write and wait.** Default: a friend left behind keeps a record of your absence (RM7) and greets you differently by how long you were gone. | Coming back to a friend who waited is one of the best moments a life sim can offer. |
| RX3 | **Copy and AU friends are their own people.** Default: a friend's counterpart in an AU copy does not know you unless the copy plan (QK11) carries memory. Counterpart map is EI3. This adds: the player's knowledge of the original friend shows as "you feel you know them" text, not as their regard. | Matches the recognition rule (`src/feature_expansion_book_recognition.js:76`): build a new relationship. |
| RX4 | **Recognition by habit.** Default: an AU friend can come to like you faster if you share the same habits that once bonded you (the same tea, the same joke), at a small rate; by default this is not instant memory. | Lets knowledge of a friend help without breaking "their memory is theirs". |
| RX5 | **Flips that hurt.** Default: AK2 flips a tie at an AU fork. This adds: when the player has a strong tie with the base version, the flipped version gets a one-line "this hurts" log and a notebook note. | The emotional cost of AUs lives here. |
| RX6 | **Reincarnated friends.** Default: a friend from a past life may be reborn (LIFE_SIM `:3622-3623`); they half-recognize you through CL13 cues. Dial: the world's reincarnation rule. Reasonably: full memory needs a carrier (RX8). | Friends who recur across lives make long play personal. |
| RX7 | **The heir meets your old friends.** Default: old friends meet your heir as someone new, with a starting warmth from the old tie (RLX11 passed-on tie). Their memories of you color how they treat the heir: kind, demanding, wary. | Friends become part of what you leave. |
| RX8 | **Carrier rows for friendship.** Default: what carries a bond across lives or worlds: a letter, a keepsake, a shared oath, a soul bond, a shared secret, a portrait. Each carrier carries a different slice (only trust, only memory, only the oath). Hooks X12's reset seam. | Without carriers, X12 wipes everything. Carriers make continuity a choice with costs. |
| RX9 | **Friends of other worlds meet each other.** Default: at the home Village or a hub, friends from different worlds can meet. Their reaction depends on their world's views (a wizard meets a Beyonder). | A home hub full of friends from everywhere is a late-game reward and a source of jokes (15_JOKES). |
| RX10 | **Loop friends.** Default: in a loop world, bonds reset for non-loopers. The player can rebuild a friendship faster each loop with knowledge (RX4), but the friend's side starts fresh. Dial: a looper friend who remembers. | Loop worlds make friendship a skill the player learns, not a stat the save keeps. |

---

## 6. Per world (RW)

### Harry Potter (`docs/worlds/harry-potter/`)

| Code | Consideration | Why it matters |
|---|---|---|
| RWHP1 | **Houses as default friend pools.** Default: dorm mates, common room and shared classes make house members the fastest MF1 route; inter-house friendships cost more presence and may draw teasing (general knowledge). | House sorting becomes a social start, not just a color. |
| RWHP2 | **Life debts.** Default: saving someone's life creates a life debt row (RM5) that magic itself may honor in a key moment (general knowledge: a public franchise idea). Dial: debts are a felt bond, not a hard compulsion. | A world-specific obligation kind with no other world's version. |
| RWHP3 | **Owl mail and holidays.** Default: owls carry letters (RD9) with a delivery time; holidays at a friend's house open a family visit and a summer scene. | School breaks become the friendship moments outside school. |
| RWHP4 | **Family friends and blood status.** Default: family ties and blood-status views shape who warms to you, through a household origin (HP10's household). Dial: how hard the prejudice runs. | Ties social life to the world's politics without making it a morality bar. |

### D&D (`docs/worlds/dnd/`)

| Code | Consideration | Why it matters |
|---|---|---|
| RWDD1 | **Party as found family.** Default: an adventuring party is a group record (RM14) with shared loot rules, a camp and stories told at rest. DND04 lists three service contacts with memory (`docs/worlds/dnd/COVERAGE_MAP.md:11`); this adds the party itself as a bond. | The classic D&D relationship and the companion proof's natural home. |
| RWDD2 | **Bonds, ideals and flaws as relationship seeds.** Default: a character's bond line (general knowledge, SRD backgrounds) names a person or place; acting for it earns inspiration (DDC15). This adds: the bonded person is a real NPC with a tie. | Uses the rules' own relationship hook. |
| RWDD3 | **Patrons and deities.** Default: a warlock patron or a cleric's deity is a relationship with trust and debt, not just a power source (general knowledge). | Pacts become social and can sour. |
| RWDD4 | **Long rests as social time.** Default: a long rest at camp gives a short shared-memory tick per companion and a chance for a personal scene. | Rest is when D&D parties talk, and it fits idle play. |

### A Soldier's Life (held, design only; private book, no names)

| Code | Consideration | Why it matters |
|---|---|---|
| RWSL1 | **The unit is the friend group.** Default: squad and unit form through shared danger (MF7 at its fastest) and shared drill. A unit's memory of you outlasts your service (CLW3 row). | Comrade is the core tie there. |
| RWSL2 | **Rank and friendship conflict.** Default: a promotion can strain a friendship with former peers; orders to a friend are a test. | A real tension specific to a military life. |
| RWSL3 | **Letters home and to the dead's families.** Default: letters carry news to family; writing to a fallen comrade's family is a grief event (RD15) and maybe a new tie. | Grief and letters in their sharpest form. |

### TTKS (per book; summaries in repo, deep dives private)

| Code | Consideration | Why it matters |
|---|---|---|
| RWTT1 | **B1: friends who notice the habits.** The habit tells (TT1) mean close friends are the people who can spot a replacement. Default: high-familiarity friends detect changes others miss. | Friendship as a detection system, unique to that book's premise. |
| RWTT2 | **B2: remembered friend, fresh stranger.** TT5 covers meeting the real version of a simulated friend. This adds: the player can use RX4 habit recognition there, and the stranger can also reject the player's familiarity as creepy. | Shows how memory without shared history can backfire. |
| RWTT3 | **B4: the household as friends.** The estate AI (TT12, TT22) and staff are relationships too; their loyalty decides how the estate runs while away. | The idle estate runs on bonds, not just upgrades. |
| RWTT4 | **B3/B5: proposal slots.** Default: each remaining book gets one friendship row when its summary is checked; no design invented from unchecked material. | Keeps per-book rows grounded in the reviewed summaries. |

### Mother of Learning (`docs/worlds/mother-of-learning/`, `src/book_world_mol_content.js`)

| Code | Consideration | Why it matters |
|---|---|---|
| RWML1 | **Loop resets every bond but the loopers'.** Default: non-loopers forget (public franchise premise); X9's knowledge-only cast fits this. Friendship is a skill the player relearns each loop (RX10). | The defining social rule of the world, and the code already behaves this way. |
| RWML2 | **A known friendship path per person.** Default: each of the nine cast members has a few known openers (what Kael needs for his daughter, what Taiven wants from work) that the player learns across loops and uses faster. | The loop turns friendship into a puzzle, which fits MoL. |
| RWML3 | **Loopers' ties persist.** Default: a fellow looper keeps shared history across resets; that bond deepens while everyone else's resets. Sealed details stay sealed (refer by ID only). | Lonely loops and the one person who remembers is the emotional core. |
| RWML4 | **Household life at the Kuroshka house.** Default: Imaya's household (MOL27 card games) is the stable social home inside the loop. | A place that resets but welcomes you each loop by default. |

### Lord of the Mysteries (LOTM)

| Code | Consideration | Why it matters |
|---|---|---|
| RWLM1 | **Tarot Club and masks.** Default: members know each other by code names (RLX1). This adds: trust inside the club and trust by daylight are two separate rows on the same card until revealed. | LOTM's core social structure, and RM3 knowledge drives it. |
| RWLM2 | **Secret identities strain friendships.** Default: friends who do not know your Beyonder life get hurt by absences and lies; telling them puts them at risk. | Every friend is a risk calculation, specific to LOTM. |
| RWLM3 | **The Moretti household.** QLM1 covers the lodger start. This adds: family warmth there is an anchor that steadies madness risk (a friend as stability). | Ties relationships to the world's sanity mechanics. |
| RWLM4 | **Betrayal dial set higher.** Default: in LOTM, a trusted figure turning out to be something else is common (general knowledge). RD14 runs at a higher dial. | Matches the world's tone. |

### Circle of Inevitability (CoI)

| Code | Consideration | Why it matters |
|---|---|---|
| RWCI1 | **Loop and copy bonds.** Default: RLX8 copy-split bond fits here. This adds: a friend's regard can differ by loop, and the player carries both views. | The same person as friend and stranger at once. |
| RWCI2 | **The town as one big acquaintance.** Default: a small town where everyone knows everyone; familiarity starts higher for townsfolk and gossip moves faster. | A distinct social density from LOTM's city. |
| RWCI3 | **Heir rows from LOTM.** QK7 covers heirs across the sequel. This adds: an old LOTM friend's descendant can carry warmth or grudge (RX7). | Long-play payoff across two books. |

### Shadow Slave

| Code | Consideration | Why it matters |
|---|---|---|
| RWSS1 | **Cohorts in the Dream Realm.** Default: the people you enter with are a cohort (CR1 pattern); shared danger bonds fast (MF7). QSS2 covers the roommate start. | Cohorts are the world's friend groups. |
| RWSS2 | **True Names and trust.** Default: knowing someone's True Name is power over them (CA17, general knowledge). Giving yours is the deepest trust act. | A world-specific trust axis with real stakes. |
| RWSS3 | **Flaws as social facts.** SS2 covers flaws shaping trust. This adds: a friend who knows your Flaw and keeps it secret is a close friend by definition. | Turns a mechanic into a friendship milestone. |
| RWSS4 | **Echoes as companions.** Default: an Echo uses the RM15 nonhuman model with loyalty and familiarity. | One model for monster companions. |

### Home Village (`src/npc_lives.js`, `src/village_career.js`)

| Code | Consideration | Why it matters |
|---|---|---|
| RWVL1 | **Households and neighbors.** Default: the Village household (X10) gains neighbor ties on the yearly tick (MF12); the player's household is a group record (RM14). | Grows the existing household into a social web. |
| RWVL2 | **Festivals as social peaks.** Default: Village festivals (MG09) gather everyone and give a big MF1 tick, a chance for a scene and news of who paired up. | Seasonal social highs that fit the calendar. |
| RWVL3 | **The patrol recruit as student-friend.** Default: the recruit tie (X11) grows from student to peer to friend; the favor cap is the start. | Builds on code that exists. |
| RWVL4 | **The elder as mentor and successor.** Default: the elder's ties (X5) are the first full relationship arc; this adds a friendship layer after succession (he becomes a friend, not only a source). | Extends the one proven relationship. |
| RWVL5 | **Home as a hub for friends from all worlds.** RX9 at the Village. | Late-game reward. |

---

## 7. UI and feel (UF)

| Code | Consideration | Why it matters |
|---|---|---|
| UF1 | **People panel, desktop first.** Default: the existing notebook panel (X8) becomes a two-pane view at 1366x768 and up: a list on the left (name, kind words, last seen), a card on the right (what you know, shared history, obligations, a short "how they seem" line). Mobile deferred per standing UI priority. | Builds on `people_ui.js` instead of a new screen. |
| UF2 | **Relationship journal.** Default: each card has a timeline of memories in plain words with dates, both directions labeled ("you", "they"). Fixes X8's mixed direction. | The story of a friendship is the memories. |
| UF3 | **Words, not meters, by default.** Default: the card says "warm", "wary", "owes you", "proud of you", "jealous lately" from the axes. Dial: a numbers toggle in settings for players who want them. | Meters spoil feel for many players; numbers help others. A dial serves both. |
| UF4 | **Small signals.** Default: a nickname they start using, a saved seat, a remembered order, a gift they still carry, a waved greeting from across the square. Each is a log line or a visible touch, not a number. | These are what make a friendship feel real. Cheap to author. |
| UF5 | **NPC-to-NPC view.** Default: a card can show "friends with Maia", "avoids the smith" once the player has seen it. Witnessed only. | Shows the world's own social life (MF12). |
| UF6 | **Letters inbox.** Default: letters (RD9) sit in a small inbox in the notebook, unread count on the tab. | Absence shows up as mail, which is idle-friendly. |
| UF7 | **Group cards.** Default: a group (RM14) gets a card: members, meeting place, standing night, shared jokes. | Friend circles visible as circles. |
| UF8 | **Kind change notices.** Default: when a kind changes (RM12), a short log line names the cause ("Taiven calls you a friend now, after the hatch"). | Makes progress felt without a bar. |
| UF9 | **Grief and memory view.** Default: dead friends stay in the panel with a mourning mark and their journal intact. | Respect for the dead and a keepsake for the player. |
| UF10 | **Per-world frame.** Default: the people panel picks up the world's frame tint and voice (V6, V7): Tarot cards for LOTM club members, house colors in HP, unit insignia for the soldier world. | Same panel, world-specific feel. |

---

## 8. Suggestions: five cheapest, ranked

Foundation R15 holds `src/main.js`, `src/simulation.js`, `src/save_files.js`, tests and `dist/` (`docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/BRIEF.md:66-74`). The crafting and settings goals (2026-10-13 checkpoints) hold their own UI paths. All five below avoid those files.

| Rank | Code | Suggestion | Save impact | File owner |
|---|---|---|---|---|
| 1 | X7 + RD2 | **Gate one optional offer on trust.** Example: Lio offers an extra brace lesson once his trust in the player is ≥ 2, using the already-exposed `relationship.trust` fact (`src/simulation_effects.js:155`). | None beyond existing relationship rows; additive content only. | `src/party_content.js` (content owner). |
| 2 | UF2 + X8 | **Label direction in the people journal.** Show "you" or "they" on each memory and include both directions where they exist. | None; view only. | `src/people_knowledge.js`, `src/people_ui.js`. |
| 3 | UF3 | **Words from axes.** Map trust, respect, familiarity to a few plain words on the card; numbers hidden by default. | None; view only. A later settings dial would touch the settings goal's files, so defer that dial. | `src/people_knowledge.js`. |
| 4 | X13 | **Disambiguate reused names** (Lio, Neri, Iona) in the people panel with a role suffix, or record a decision that they are the same people. | None for a display suffix; a "same person" merge would touch saved ids and needs a migration decision. | `src/people_knowledge.js` for display; content owners for a merge. |
| 5 | UF4 + MF5 | **One remembered small touch.** A Village NPC remembers one preference you told them (or one they told you) and acts on it later, as a knowledge entry plus a memory. | Additive knowledge and relationship rows in existing stores; no schema change. | `src/local_livelihood_content.js` or `src/crush_social_content.js` (content owners). |

Next after these: RM1 shared axis vocabulary (doc first, then content), RD15 grief line on a known friend's death in `npc_lives_ui.js`, and RX8 carriers through X12's reset seam (R15-held `simulation.js`, so it waits).
